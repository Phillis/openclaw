import { w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import "./number-runtime-CoAPZzJY.js";
import "./runtime-mJF84ei1.js";
import { t as MEMORY_QUERY_COLUMNS } from "./lancedb-store-Cpo-SYRn.js";
import { t as isMemoryMachineOutput } from "./cli-output-mode-VTVEx4hB.js";
import { u as normalizeRecallQuery } from "./memory-policy-DbbZNcEQ.js";
//#region extensions/memory-lancedb/memory-cli.ts
function parsePositiveIntegerOption(value, flag) {
	if (value === void 0) return;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer`);
	return parsed;
}
function parseMemoryCliColumns(value) {
	if (typeof value !== "string") return [...MEMORY_QUERY_COLUMNS];
	const columns = value.split(",").map((column) => column.trim());
	const invalid = columns.filter((column) => !MEMORY_QUERY_COLUMNS.includes(column));
	if (invalid.length > 0) throw new Error(`Unsupported memory columns: ${invalid.join(", ")}`);
	return columns;
}
function parseMemoryCliOrder(value) {
	if (typeof value !== "string" || !value.trim()) return null;
	const [column, direction = "asc", extra] = value.split(":");
	if (extra !== void 0 || !MEMORY_QUERY_COLUMNS.includes(column) || !["asc", "desc"].includes(direction.toLowerCase())) throw new Error("--order-by must be <id|text|importance|category|createdAt>:<asc|desc>");
	return {
		column,
		direction: direction.toLowerCase() === "desc" ? -1 : 1
	};
}
function parseMemoryCliFilter(rawValue) {
	if (rawValue === void 0) return;
	if (typeof rawValue !== "string") throw new Error("--filter must be a string");
	const filter = rawValue.trim();
	if (filter.length > 200) throw new Error("Filter condition exceeds maximum length of 200 characters");
	const match = /^(id|text|importance|category|createdAt)\s*(=|!=|<>|<=|>=|<|>|LIKE)\s*(?:'((?:''|[^'])*)'|(-?(?:\d+(?:\.\d+)?|\.\d+)))$/i.exec(filter);
	if (!match) throw new Error("--filter must be one comparison using id, text, importance, category, or createdAt");
	const rawColumn = match[1];
	const rawOperator = match[2];
	const rawString = match[3];
	const rawNumber = match[4];
	const column = MEMORY_QUERY_COLUMNS.find((candidate) => candidate.toLowerCase() === rawColumn.toLowerCase());
	if (!column) throw new Error(`Unsupported memory filter column: ${rawColumn}`);
	const operator = rawOperator.toUpperCase();
	const value = rawString !== void 0 ? rawString.replaceAll("''", "'") : Number(rawNumber);
	if (typeof value === "number" && !Number.isFinite(value)) throw new Error("--filter numeric value must be finite");
	const expectsNumber = column === "importance" || column === "createdAt";
	if (expectsNumber !== (typeof value === "number")) throw new Error(`--filter ${column} requires a ${expectsNumber ? "number" : "quoted string"}`);
	if (operator === "LIKE" && typeof value !== "string") throw new Error("--filter LIKE requires a quoted string");
	return {
		column,
		operator,
		value
	};
}
function registerMemoryCli(api, db, embeddings, resolveCliAgentId, recallMaxChars) {
	api.registerCli(({ program }) => {
		const memory = program.command("ltm").description("LanceDB memory plugin commands");
		memory.command("list").description("List memories").option("--agent <id>", "Agent id (default: configured default agent)").option("--limit <n>", "Max results").option("--order-by-created-at", "Order memories by createdAt descending", false).action(async (opts) => {
			const agentId = resolveCliAgentId(opts.agent);
			const limit = parsePositiveIntegerOption(opts.limit, "--limit");
			const entries = await db.list(agentId, limit, { orderByCreatedAt: Boolean(opts.orderByCreatedAt) });
			defaultRuntime.writeJson(entries);
		});
		memory.command("search").description("Search memories").argument("<query>", "Search query").option("--agent <id>", "Agent id (default: configured default agent)").option("--limit <n>", "Max results", "5").action(async (query, opts) => {
			let operationError;
			let operationFailed = false;
			try {
				const agentId = resolveCliAgentId(opts.agent);
				const limit = parsePositiveIntegerOption(opts.limit, "--limit");
				const vector = await embeddings.embed(agentId, normalizeRecallQuery(query, recallMaxChars));
				const output = (await db.search(agentId, vector, limit, .3)).map((r) => ({
					id: r.entry.id,
					text: r.entry.text,
					category: r.entry.category,
					importance: r.entry.importance,
					score: r.score
				}));
				defaultRuntime.writeJson(output);
			} catch (err) {
				operationError = err;
				operationFailed = true;
			}
			let closeError;
			let closeFailed = false;
			try {
				await embeddings.close?.();
			} catch (err) {
				closeError = err;
				closeFailed = true;
			}
			if (operationFailed) throw operationError;
			if (closeFailed) throw closeError;
		});
		memory.command("query").description("Query memories (non-vector search)").option("--agent <id>", "Agent id (default: configured default agent)").option("--cols <columns>", "Columns to select, comma-separated").option("--filter <condition>", "Filter condition").option("--limit <n>", "Limit number of results", "10").option("--order-by <order>", "Order by column and direction (e.g., createdAt:desc)").action(async (opts) => {
			const agentId = resolveCliAgentId(opts.agent);
			const outputColumns = parseMemoryCliColumns(opts.cols);
			const order = parseMemoryCliOrder(opts.orderBy);
			const selectedColumns = [...outputColumns];
			if (order && !selectedColumns.includes(order.column)) selectedColumns.push(order.column);
			const limit = parsePositiveIntegerOption(opts.limit, "--limit") ?? 10;
			let rows = await db.query(agentId, {
				columns: selectedColumns,
				filter: parseMemoryCliFilter(opts.filter),
				...order ? {} : { limit }
			});
			if (order) {
				rows.sort((a, b) => {
					const aValue = a[order.column];
					const bValue = b[order.column];
					if (aValue < bValue) return -1 * order.direction;
					if (aValue > bValue) return order.direction;
					return 0;
				});
				rows = rows.slice(0, limit);
				if (!outputColumns.includes(order.column)) for (const row of rows) delete row[order.column];
			}
			defaultRuntime.writeJson(rows);
		});
		memory.command("stats").description("Show memory statistics").option("--agent <id>", "Agent id (default: configured default agent)").action(async (opts) => {
			const agentId = resolveCliAgentId(opts.agent);
			const count = await db.count(agentId);
			console.log(`Total memories: ${count}`);
		});
	}, {
		commands: ["ltm"],
		descriptors: [{
			name: "ltm",
			description: "LanceDB memory plugin commands",
			hasSubcommands: true,
			machineOutput: isMemoryMachineOutput
		}]
	});
}
//#endregion
export { registerMemoryCli as n, parseMemoryCliFilter as t };
