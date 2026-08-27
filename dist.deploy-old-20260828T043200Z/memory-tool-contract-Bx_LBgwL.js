import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import { t as resolveMemorySearchConfig } from "./memory-search-Cyk11Xva.js";
import "./memory-core-host-runtime-core-l5CDi0zI.js";
//#region extensions/memory-core/src/memory-tool-contract.ts
const MemorySearchSchema = {
	type: "object",
	properties: {
		query: { type: "string" },
		maxResults: {
			type: "integer",
			minimum: 1
		},
		minScore: { type: "number" },
		corpus: {
			type: "string",
			enum: [
				"memory",
				"wiki",
				"all",
				"sessions"
			]
		}
	},
	required: ["query"],
	additionalProperties: false
};
const MemoryGetSchema = {
	type: "object",
	properties: {
		path: { type: "string" },
		from: {
			type: "integer",
			minimum: 1
		},
		lines: {
			type: "integer",
			minimum: 1
		},
		corpus: {
			type: "string",
			enum: [
				"memory",
				"wiki",
				"all"
			]
		}
	},
	required: ["path"],
	additionalProperties: false
};
function resolveMemorySourceContract(settings) {
	const files = ["MEMORY.md, USER.md, Markdown files recursively under memory/", settings.extraPaths.length > 0 ? "configured extra paths" : ""].filter(Boolean).join(", ");
	return {
		files,
		search: settings.searchSources.includes("sessions") ? `${files}, indexed session transcripts` : files
	};
}
function resolveMemoryToolContext(options) {
	const cfg = options.getConfig ? options.getConfig() : options.config;
	if (!cfg) return null;
	const { sessionAgentId: agentId } = resolveSessionAgentIds({
		sessionKey: options.agentSessionKey,
		config: cfg,
		agentId: options.agentId
	});
	const settings = resolveMemorySearchConfig(cfg, agentId);
	return settings ? {
		cfg,
		agentId,
		sources: resolveMemorySourceContract(settings)
	} : null;
}
const SEARCH_CORPUS_OUTCOME_GUIDANCE = "Corpus outcomes cover each requested corpus; a corpus warning means results are partial and must be surfaced to the user.";
const GET_READ_OUTCOME_GUIDANCE = "status=ok means the requested excerpt was read; status=not_found means every requested available corpus missed.";
const MEMORY_SEARCH_TOOL_CONTRACT = {
	label: "Memory Search",
	name: "memory_search",
	parameters: MemorySearchSchema,
	describe: ({ search }) => `Mandatory recall step: semantically search ${search} before answering questions about prior work, decisions, dates, people, preferences, or todos. Optional \`corpus=wiki\` or \`corpus=all\` also searches registered compiled-wiki supplements. \`corpus=memory\` restricts hits to indexed memory files (excludes session transcript chunks from ranking). \`corpus=sessions\` restricts hits to the session corpus under the same visibility rules as session history tools. ${SEARCH_CORPUS_OUTCOME_GUIDANCE} If response has disabled=true or stale=true, tell the user and include the warning/action guidance.`
};
const MEMORY_GET_TOOL_CONTRACT = {
	label: "Memory Get",
	name: "memory_get",
	parameters: MemoryGetSchema,
	describe: ({ files }) => `Safe exact excerpt read from ${files}. Defaults to a bounded excerpt when lines are omitted and includes truncation/continuation info when more content exists. \`corpus=wiki\` reads registered compiled-wiki supplements. ${GET_READ_OUTCOME_GUIDANCE} ${SEARCH_CORPUS_OUTCOME_GUIDANCE}`
};
function buildMemoryPromptSection({ availableTools, citationsMode, sources }) {
	const hasMemorySearch = availableTools.has("memory_search");
	const hasMemoryGet = availableTools.has("memory_get");
	if (!hasMemorySearch && !hasMemoryGet) return [];
	return [
		"## Memory Recall",
		hasMemorySearch ? `Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on ${sources.search}${hasMemoryGet ? "; then use memory_get to pull only the needed lines" : ""}. ${SEARCH_CORPUS_OUTCOME_GUIDANCE}${hasMemoryGet ? ` For memory_get, ${GET_READ_OUTCOME_GUIDANCE}` : ""} If low confidence after search, say you checked.` : `Before answering anything about prior work, decisions, dates, people, preferences, or todos that point to a specific source in ${sources.files}: run memory_get to pull only the needed lines. ${GET_READ_OUTCOME_GUIDANCE} ${SEARCH_CORPUS_OUTCOME_GUIDANCE} If low confidence after reading, say you checked.`,
		citationsMode === "off" ? "Citations are disabled: do not mention file paths or line numbers in replies unless the user explicitly asks." : "Citations: include Source: <path#line> when it helps the user verify memory snippets.",
		""
	];
}
//#endregion
export { resolveMemoryToolContext as i, MEMORY_SEARCH_TOOL_CONTRACT as n, buildMemoryPromptSection as r, MEMORY_GET_TOOL_CONTRACT as t };
