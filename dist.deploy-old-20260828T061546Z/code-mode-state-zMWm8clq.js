import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.js";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { g as isFutureDateTimestampMs, k as resolveExpiresAtMsFromDurationSeconds } from "./number-coercion-CLj0HTDM.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { i as clampNumber } from "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { o as isToolExecutionAllowed, t as TOOL_EXECUTION_GATED_MESSAGE } from "./tool-policy-shared-DmpG3HvD.js";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-D2XMKe-X.js";
import { s as NODE_FS_LIST_DIR_COMMAND } from "./node-commands-DRxP7loh.js";
import { l as emitSessionLifecycleEvent } from "./session-history-eviction-DX5U9ZnW.js";
import { n as CODE_MODE_WAIT_TOOL_NAME, t as CODE_MODE_EXEC_TOOL_NAME } from "./code-mode-control-tools-BA6DDloF.js";
import { n as ToolInputError, r as asToolParamsRecord } from "./common-CI1GnPjt.js";
import { l as registerTrustedToolNoStartError, t as consumeTrustedToolNoStartError } from "./tool-result-error-CnEQjVCq.js";
import { n as boundCodeModeValue, t as boundCodeModeResult } from "./code-mode-json-CWwCZ1yI.js";
import { t as resolveEligibleNodeFromList } from "./node-resolve-Cxs-SER3.js";
import { i as consumeMcpCodeModeGuestResult } from "./agent-bundle-mcp-materialize-Mr-8KHzr.js";
import "./tool-search-Dlb-qK1p.js";
import { t as parseNodeList } from "./node-list-parse-B-QeHrg4.js";
import { m as resolveMainSessionAlias, p as resolveInternalSessionKey } from "./sessions-helpers-GgSp1hTb.js";
import { f as getSwarmRunByLaunchReplayKey, p as initSubagentRegistry } from "./subagent-registry-ROej5jsc.js";
import { t as resolveSwarmConfig } from "./swarm-config-Df_H07Y6.js";
import { t as raceWithAbortSignal } from "./agent-tools.abort-BYKt565b.js";
import { n as waitForCollectorCompletion } from "./agents-wait-tool-CTXChnCS.js";
import { n as SWARM_CODE_MODE_REQUEST_FINGERPRINT, t as SWARM_CODE_MODE_IDEMPOTENCY_KEY } from "./swarm-code-mode-DXtHU4JN.js";
import { n as parseCodeModeScriptSyntax, t as buildCodeModeScriptParseSource } from "./code-mode-script-syntax-DZwdESO8.js";
import { readFile } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { parse, tokTypes, tokenizer } from "acorn";
import { Script } from "node:vm";
//#region src/agents/code-mode-skills.ts
function decodeXml(value) {
	return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}
function readSkillField(block, field) {
	const match = new RegExp(`^[ ]{4}<${field}>(.*)</${field}>$`, "mu").exec(block)?.[1];
	return match === void 0 ? void 0 : decodeXml(match);
}
/** Select Code Mode skills from the exact catalog rendered into this run's prompt. */
function resolveCodeModeSkills(params) {
	const catalog = /<available_skills>\n([\s\S]*?)\n<\/available_skills>/u.exec(params.skillsPrompt)?.[1];
	if (!catalog) return [];
	const candidatesByName = new Map(params.candidates.map((skill) => [skill.name, skill]));
	const result = [];
	for (const match of catalog.matchAll(/^[ ]{2}<skill>\n([\s\S]*?)\n[ ]{2}<\/skill>$/gmu)) {
		const block = match[1] ?? "";
		const name = readSkillField(block, "name");
		const location = readSkillField(block, "location");
		const source = name ? candidatesByName.get(name) : void 0;
		if (!name || !location || !source) continue;
		result.push({
			name,
			description: source.description,
			location,
			source: {
				filePath: source.filePath,
				readContent: source.readContent
			},
			reader: params.reader
		});
	}
	return result;
}
async function readCodeModeSkill(skill, signal) {
	if (typeof skill.source.readContent === "string") return skill.source.readContent;
	if (skill.reader) return await skill.reader({
		location: skill.location,
		signal
	});
	return await readFile(skill.source.filePath, {
		encoding: "utf8",
		signal
	});
}
//#endregion
//#region src/agents/code-mode-catalog.ts
const RESERVED_GLOBAL_NAMES = new Set("ALL_TOOLS API MCP agents catalog clearTimeout globalThis json log namespaces nodes phase setTimeout skills text tools yield_control AggregateError Array ArrayBuffer Atomics BigInt BigInt64Array BigUint64Array Boolean DataView Date Error EvalError FinalizationRegistry Float32Array Float64Array Function Infinity Int16Array Int32Array Int8Array Intl JSON Map Math NaN Number Object Promise Proxy RangeError ReferenceError Reflect RegExp Set SharedArrayBuffer String Symbol SyntaxError TypeError URIError Uint16Array Uint32Array Uint8Array Uint8ClampedArray WeakMap WeakRef WeakSet WebAssembly console decodeURI decodeURIComponent encodeURI encodeURIComponent escape eval isFinite isNaN parseFloat parseInt undefined unescape".split(" "));
const RESERVED_WORDS = /* @__PURE__ */ new Set([
	...Object.values(tokTypes).flatMap((token) => token.keyword ? [token.keyword] : []),
	"await",
	"enum",
	"implements",
	"interface",
	"package",
	"private",
	"protected",
	"public",
	"static",
	"yield"
]);
function normalizedCallableBase(name) {
	const normalized = name.replace(/[^A-Za-z0-9_$]/g, "_");
	return /^[A-Za-z_$]/.test(normalized) && !normalized.startsWith("__openclaw") ? normalized : `tool_${normalized}`;
}
function suffixedCallableName(base, id, used) {
	const digest = createHash("sha256").update(id).digest("hex");
	for (let length = 8; length <= digest.length; length += 2) {
		const candidate = `${base}_${digest.slice(0, length)}`;
		if (!used.has(candidate) && !RESERVED_WORDS.has(candidate)) return candidate;
	}
	throw new Error("could not allocate a unique code mode callable name");
}
function selectEffectiveEntries(entries) {
	const winners = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		if (entry.source === "mcp") continue;
		const current = winners.get(entry.name);
		if (!current || entry.source === "client" && current.source !== "client") winners.set(entry.name, entry);
	}
	return [...winners.values()];
}
/** Canonical host projection shared by the prompt, guest bindings, and bridge routing. */
function createCodeModeCatalogProjection(entries, options) {
	const used = /* @__PURE__ */ new Set([...RESERVED_GLOBAL_NAMES, ...options?.reservedNames ?? []]);
	const candidates = selectEffectiveEntries(entries).map((entry) => {
		const base = normalizedCallableBase(entry.name);
		return {
			entry,
			base,
			canKeepExactName: entry.name === base && !RESERVED_WORDS.has(entry.name) && !used.has(entry.name)
		};
	}).toSorted((left, right) => Number(right.canKeepExactName) - Number(left.canKeepExactName) || left.base.localeCompare(right.base) || left.entry.id.localeCompare(right.entry.id));
	const bindings = [];
	for (const candidate of candidates) {
		let callableName = candidate.base;
		if (RESERVED_WORDS.has(callableName) || used.has(callableName)) callableName = suffixedCallableName(candidate.base, candidate.entry.id, used);
		used.add(callableName);
		const { id, source, name, label, description, input, output } = candidate.entry;
		bindings.push({
			id,
			source,
			name,
			label,
			description,
			input,
			output,
			callableName
		});
	}
	bindings.sort((left, right) => left.callableName.localeCompare(right.callableName));
	return {
		bindings,
		guestBindings: bindings.map(({ id: _id, ...binding }) => binding),
		byCallableName: new Map(bindings.map((binding) => [binding.callableName, binding])),
		byId: new Map(bindings.map((binding) => [binding.id, binding]))
	};
}
function redactCodeModeCatalogIds(message, bindings) {
	let redacted = message;
	for (const binding of bindings.toSorted((left, right) => right.id.length - left.id.length)) redacted = redacted.replaceAll(binding.id, binding.callableName);
	return redacted;
}
//#endregion
//#region src/agents/code-mode-bridge.ts
const CODE_MODE_NODES_TOOL_ID = "openclaw:core:nodes";
function projectCodeModeNode(node) {
	return {
		id: node.nodeId,
		name: node.displayName?.trim() || node.nodeId,
		...node.platform ? { platform: node.platform } : {},
		connected: node.connected === true,
		commands: Array.isArray(node.commands) ? node.commands.filter((command) => typeof command === "string") : []
	};
}
async function callNodesTool(params) {
	return await params.runtime.callValue(CODE_MODE_NODES_TOOL_ID, params.input, {
		includeMcp: false,
		parentToolCallId: params.parentToolCallId,
		signal: params.signal,
		onUpdate: params.onUpdate,
		recoverySurface: "catalog"
	});
}
async function listCodeModeNodes(params) {
	return parseNodeList(await callNodesTool({
		...params,
		input: { action: "status" }
	}));
}
async function runNodesBridge(params) {
	const values = params.request.args;
	const action = values[0];
	if (action === "list") return (await listCodeModeNodes(params)).filter((node) => node.paired === true).map(projectCodeModeNode);
	if (action === "get") {
		const query = values[1];
		if (typeof query !== "string" || !query.trim()) throw new ToolInputError("nodes.get id or name must be a non-empty string.");
		const projected = projectCodeModeNode(resolveEligibleNodeFromList(await listCodeModeNodes(params), query, (candidate) => candidate.paired === true, {
			ineligibleExact: (id, eligibleIds) => `node "${id}" is not paired (paired node ids: ${eligibleIds})`,
			nameResolveFailed: (reason, eligibleIds) => `${reason} (paired node ids: ${eligibleIds})`,
			noneEligible: () => "no paired nodes",
			multipleEligible: (eligible) => `multiple nodes paired: ${eligible.map((candidate) => candidate.nodeId).toSorted().join(", ")}`
		}));
		return {
			id: projected.id,
			name: projected.name,
			...projected.commands.includes("fs.listDir") ? { listDirCommand: NODE_FS_LIST_DIR_COMMAND } : {}
		};
	}
	if (action === "invoke") {
		const node = values[1];
		const command = values[2];
		if (typeof node !== "string" || !node.trim()) throw new ToolInputError("nodes.invoke node id must be a non-empty string.");
		if (typeof command !== "string" || !command.trim()) throw new ToolInputError("nodes.invoke command must be a non-empty string.");
		return await callNodesTool({
			...params,
			input: {
				action: "invoke",
				node,
				invokeCommand: command,
				invokeParamsJson: JSON.stringify(values[3] ?? {})
			}
		});
	}
	throw new ToolInputError("unsupported nodes bridge action.");
}
function codeModeReplayIdForToolCall(ctx, toolCallId, code, assistantTurnId) {
	const outerRunId = ctx.runId?.trim();
	if (!outerRunId) return `cm_replay_${randomUUID()}`;
	const identity = JSON.stringify([
		ctx.sessionKey ?? "",
		ctx.sessionId ?? "",
		outerRunId,
		assistantTurnId?.trim() ?? "",
		toolCallId,
		code
	]);
	return `cm_replay_${createHash("sha256").update(identity).digest("hex").slice(0, 24)}`;
}
function requireCodeModeSwarmEnabled(ctx) {
	if (!resolveSwarmConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId).enabled) throw new ToolInputError("code mode swarm globals are disabled.");
	if (ctx.toolExecutionAllow && !isToolExecutionAllowed(ctx.toolExecutionAllow, "sessions_spawn")) throw new ToolInputError(TOOL_EXECUTION_GATED_MESSAGE);
}
function resolveCodeModeRequesterSessionKey(ctx) {
	const sessionKey = ctx.sessionKey?.trim();
	if (!sessionKey) throw new ToolInputError("code mode swarm globals require session and run identity.");
	const { mainKey, alias } = resolveMainSessionAlias(ctx.runtimeConfig ?? ctx.config ?? {});
	return resolveInternalSessionKey({
		key: sessionKey,
		alias,
		mainKey
	});
}
function resolveCodeModeSwarmGroupId(ctx) {
	const sessionKey = resolveCodeModeRequesterSessionKey(ctx);
	const runId = ctx.runId?.trim();
	if (!runId) throw new ToolInputError("code mode swarm globals require session and run identity.");
	return `swarm:${sessionKey}:${runId}`;
}
function replayedSpawnResult(entry) {
	return {
		status: "accepted",
		runId: entry.swarmRunId ?? entry.runId,
		sessionKey: entry.childSessionKey,
		...entry.label ? { label: entry.label } : {}
	};
}
function readOptionalStringOption(options, key) {
	const value = options[key];
	if (value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new ToolInputError(`agents.run ${key} must be a non-empty string.`);
	return value.trim();
}
async function runAgentSpawnBridge(params) {
	requireCodeModeSwarmEnabled(params.ctx);
	const prompt = params.request.args[0];
	const options = isRecord(params.request.args[1]) ? params.request.args[1] : {};
	if (typeof prompt !== "string" || !prompt.trim()) throw new ToolInputError("agents.run prompt must be a non-empty string.");
	const fastMode = options.fastMode;
	if (fastMode !== void 0 && fastMode !== true && fastMode !== false && fastMode !== "auto") throw new ToolInputError("agents.run fastMode must be boolean or \"auto\".");
	const schema = options.schema;
	if (schema !== void 0 && !isRecord(schema)) throw new ToolInputError("agents.run schema must be a JSON schema object.");
	const label = readOptionalStringOption(options, "label");
	const model = readOptionalStringOption(options, "model");
	const thinking = readOptionalStringOption(options, "thinking");
	const agentId = readOptionalStringOption(options, "agentId");
	const spawnEntry = params.runtime.namespaceEntries().find((entry) => entry.source === "openclaw" && entry.name === "sessions_spawn");
	if (!spawnEntry) throw new ToolInputError("agents.run requires the sessions_spawn tool.");
	const spawnInput = {
		task: prompt.trim(),
		collect: true,
		groupId: resolveCodeModeSwarmGroupId(params.ctx),
		...label ? { label } : {},
		...model ? { model } : {},
		...thinking ? { thinking } : {},
		...agentId ? { agentId } : {},
		...fastMode !== void 0 ? { fastMode } : {},
		...schema ? { outputSchema: schema } : {}
	};
	const requestFingerprint = `sha256:${createHash("sha256").update(stableStringify(spawnInput)).digest("hex")}`;
	const idempotencyKey = `${params.codeModeRunId}:${params.request.id}`;
	const requesterSessionKey = resolveCodeModeRequesterSessionKey(params.ctx);
	let existing = getSwarmRunByLaunchReplayKey(idempotencyKey, requesterSessionKey, params.ctx.agentId);
	if (existing) {
		if (existing.swarmLaunchRequestFingerprint !== requestFingerprint) throw new ToolInputError("agents.run replay request does not match the persisted collector.");
		if (existing.swarmLaunchPending === true) {
			if (!existing.queuedLaunch) throw new ToolInputError("agents.run persisted launch reservation cannot be recovered.");
			initSubagentRegistry();
			existing = getSwarmRunByLaunchReplayKey(idempotencyKey, requesterSessionKey, params.ctx.agentId) ?? existing;
			if (existing.swarmLaunchPending === true && !existing.queuedLaunch) throw new ToolInputError("agents.run persisted launch reservation cannot be recovered.");
		}
		return replayedSpawnResult(existing);
	}
	Object.defineProperty(spawnInput, SWARM_CODE_MODE_IDEMPOTENCY_KEY, { value: idempotencyKey });
	Object.defineProperty(spawnInput, SWARM_CODE_MODE_REQUEST_FINGERPRINT, { value: requestFingerprint });
	const called = await params.runtime.callExactId(spawnEntry.id, spawnInput, {
		parentToolCallId: params.parentToolCallId,
		signal: params.signal,
		onUpdate: params.onUpdate
	});
	const value = isRecord(called.result) && "details" in called.result ? called.result.details : called.result;
	if (!isRecord(value) || value.status !== "accepted" || typeof value.runId !== "string") throw new ToolInputError(`agents.run spawn failed: ${isRecord(value) && typeof value.error === "string" ? value.error : "collector spawn was not accepted"}`);
	return value;
}
async function runAgentWaitBridge(params) {
	requireCodeModeSwarmEnabled(params.ctx);
	const runId = params.request.args[0];
	if (typeof runId !== "string" || !runId.trim()) throw new ToolInputError("agentWait run id must be a non-empty string.");
	const rawSessionKey = params.ctx.sessionKey?.trim();
	if (!rawSessionKey) throw new ToolInputError("agents.run wait requires session identity.");
	const requesterSessionKey = resolveCodeModeRequesterSessionKey(params.ctx);
	return await waitForCollectorCompletion({
		runId: runId.trim(),
		currentSessionKeys: /* @__PURE__ */ new Set([rawSessionKey, requesterSessionKey]),
		currentAgentId: params.ctx.agentId,
		config: params.ctx.runtimeConfig ?? params.ctx.config,
		signal: params.signal
	});
}
function runSwarmNoteBridge(params) {
	requireCodeModeSwarmEnabled(params.ctx);
	const note = isRecord(params.request.args[0]) ? params.request.args[0] : void 0;
	const kind = note?.kind;
	const text = note?.text;
	if (kind !== "phase" && kind !== "log" || typeof text !== "string" || !text.trim()) throw new ToolInputError("swarmNote requires phase/log kind and non-empty text.");
	const sessionKey = params.ctx.sessionKey?.trim();
	if (!sessionKey) throw new ToolInputError("swarmNote requires session identity.");
	emitSessionLifecycleEvent({
		sessionKey,
		reason: "swarm-note",
		swarmGroupId: resolveCodeModeSwarmGroupId(params.ctx),
		kind,
		text: text.trim()
	});
	return { ok: true };
}
async function runBridgeRequest(params) {
	const catalogProjection = params.catalogProjection;
	try {
		const values = Array.isArray(params.request.args) ? params.request.args : [];
		let value;
		switch (params.request.method) {
			case "search": {
				const query = values[0];
				if (typeof query !== "string") throw new ToolInputError("search query must be a string.");
				const options = isRecord(values[1]) ? values[1] : void 0;
				const matches = await params.runtime.search(query, {
					limit: typeof options?.limit === "number" ? options.limit : void 0,
					includeMcp: false,
					allowedIds: catalogProjection.byId
				});
				const exact = query.trim().toLowerCase();
				const exactBinding = catalogProjection.bindings.find((binding) => binding.name.toLowerCase() === exact || binding.callableName.toLowerCase() === exact);
				value = exactBinding ? [exactBinding.callableName] : matches.flatMap((entry) => {
					const binding = catalogProjection.byId.get(entry.id);
					return binding ? [binding.callableName] : [];
				});
				break;
			}
			case "describe": {
				const callableName = values[0];
				if (typeof callableName !== "string") throw new ToolInputError("describe callable name must be a string.");
				const binding = catalogProjection.byCallableName.get(callableName);
				if (!binding) throw new ToolInputError(`Unknown catalog function: ${callableName}.`);
				const { id: _id, sourceName: _sourceName, mcp: _mcp, ...guestDescription } = await params.runtime.describe(binding.id, { includeMcp: false });
				value = {
					...guestDescription,
					callableName: binding.callableName
				};
				break;
			}
			case "callValue": {
				const callableName = values[0];
				if (typeof callableName !== "string") throw new ToolInputError("catalog callable name must be a string.");
				const binding = catalogProjection.byCallableName.get(callableName);
				if (!binding) throw new ToolInputError(`Unknown catalog function: ${callableName}.`);
				let input = values[1] ?? {};
				if (binding.source === "openclaw" && binding.name === "exec" && binding.input?.includes("yieldMs") === true && isRecord(input) && input.background !== true && input.yieldMs === void 0) input = {
					...input,
					yieldMs: Math.max(1, Math.min(1e3, Math.floor(params.remainingMs / 4)))
				};
				const called = await params.runtime.callExactId(binding.id, input, {
					parentToolCallId: params.parentToolCallId,
					signal: params.signal,
					onUpdate: params.onUpdate
				});
				value = isRecord(called.result) && "details" in called.result ? called.result.details : called.result;
				break;
			}
			case "nodes":
				value = await runNodesBridge(params);
				break;
			case "yield":
				value = {
					status: "yielded",
					reason: values[0] ?? null
				};
				break;
			case "namespace": {
				const namespaceId = values[0];
				const pathLocal = values[1];
				const callArgs = values[2];
				if (typeof namespaceId !== "string") throw new ToolInputError("namespace id must be a string.");
				if (!Array.isArray(pathLocal) || !pathLocal.every((entry) => typeof entry === "string")) throw new ToolInputError("namespace path must be an array of strings.");
				value = await params.namespaceRuntime.invoke(namespaceId, pathLocal, Array.isArray(callArgs) ? callArgs : [], async (request) => {
					const entry = request.catalogId ? params.runtime.namespaceEntries().find((candidate) => candidate.id === request.catalogId) : params.runtime.namespaceEntries().find((candidate) => candidate.name === request.toolName && candidate.sourceName === request.pluginId);
					if (!entry) throw new ToolInputError(`namespace tool is not visible in the run catalog: ${request.toolName}`);
					const called = await params.runtime.callExactId(entry.id, request.input, {
						parentToolCallId: params.parentToolCallId,
						signal: params.signal,
						onUpdate: params.onUpdate
					});
					if (request.catalogId) {
						const guestResult = consumeMcpCodeModeGuestResult(called.result);
						if (guestResult === void 0) throw new ToolInputError("MCP namespace tool result is missing its owned guest projection.");
						return guestResult;
					}
					return isRecord(called.result) && "details" in called.result ? called.result.details : called.result;
				});
				break;
			}
			case "agentSpawn":
				value = await runAgentSpawnBridge(params);
				break;
			case "agentWait":
				value = await runAgentWaitBridge(params);
				break;
			case "skillsList":
				value = (params.ctx.codeModeSkills ?? []).map(({ name, description, location }) => ({
					name,
					description,
					location
				}));
				break;
			case "skillsRead": {
				const name = values[0];
				const available = params.ctx.codeModeSkills ?? [];
				const skill = typeof name === "string" ? available.find((entry) => entry.name === name) : null;
				if (!skill) {
					const names = available.map((entry) => entry.name).join(", ") || "(none)";
					throw new ToolInputError(`Unknown skill ${JSON.stringify(name)}. Available skills: ${names}`);
				}
				value = await readCodeModeSkill(skill, params.signal);
				break;
			}
			case "sleep": {
				const delay = values[0];
				if (typeof delay !== "number" || !Number.isFinite(delay) || delay < 0) throw new ToolInputError("setTimeout delay must be a non-negative finite number.");
				value = await setTimeout$1(resolveSafeTimeoutDelayMs(delay, { minMs: 0 }), null, { signal: params.signal });
				break;
			}
			case "swarmNote":
				value = runSwarmNoteBridge(params);
				break;
		}
		return {
			id: params.request.id,
			ok: true,
			value: boundCodeModeValue(value, params.maxOutputBytes)
		};
	} catch (error) {
		const settled = {
			id: params.request.id,
			ok: false,
			error: redactCodeModeCatalogIds(formatErrorMessage(error), catalogProjection.bindings)
		};
		if (consumeTrustedToolNoStartError(error)) registerTrustedToolNoStartError(settled);
		return settled;
	}
}
//#endregion
//#region src/agents/code-mode-shell-source.ts
const JAVASCRIPT_EXPORT = /^export\s+(?:(?:abstract|as|async|class|const|declare|default|enum|function|import|interface|let|namespace|type|var)\b|[={*])/u;
const JAVASCRIPT_KEYWORD = /^(?:abstract|as|async|await|break|case|catch|class|const|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|namespace|new|null|of|private|protected|public|return|satisfies|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)$/u;
const JAVASCRIPT_GLOBAL = /^(?:API|MCP|AggregateError|Array|ArrayBuffer|BigInt|BigInt64Array|BigUint64Array|Boolean|DataView|Date|Error|EvalError|Float32Array|Float64Array|Function|Infinity|Int16Array|Int32Array|Int8Array|Intl|JSON|Map|Math|NaN|Number|Object|Promise|Proxy|RangeError|ReferenceError|Reflect|RegExp|Set|String|Symbol|SyntaxError|TypeError|URIError|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|WeakMap|WeakSet|catalog|clearTimeout|console|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|globalThis|isFinite|isNaN|json|nodes|parseFloat|parseInt|setTimeout|skills|text|yield_control)$/u;
const SHELL_COMMAND = /^(?:\/(?:usr\/(?:local\/)?)?bin\/)?(alias|apt|awk|bash|bg|brew|builtin|bun|cargo|cat|cd|chmod|cmd|command|cp|curl|cut|date|declare|df|dir|docker|dotnet|du|echo|env|exec|exit|export|fg|file|find|getopts|git|go|gradle|grep|hash|head|help|hostname|id|java|javac|jobs|jq|kill|kubectl|ln|local|logout|ls|make|mkdir|mvn|mv|node|npm|npx|perl|php|pip|pip3|pnpm|poetry|popd|powershell|printf|ps|pushd|pwd|pwsh|pytest|python|python3|read|readonly|rg|rm|ruby|rustc|rustup|sed|set|sh|shift|sleep|sort|source|stat|sudo|swift|systemctl|tail|tar|tee|test|touch|trap|tree|type|ulimit|umask|uname|uniq|unset|unzip|uv|uvx|vitest|wait|wc|wget|which|whoami|xargs|yarn|zip|zsh)(?=$|[\s;&|<>])/u;
const SHELL_IDENTIFIER = /^([A-Za-z_][\w-]*)(?=$|[\s;&|<>])/u;
const SHELL_EXECUTABLE_PATH = /^(?:(?:\.{1,2}|~)[\\/]|\/|[A-Za-z]:[\\/])[^\s;|&()]+(?=$|[\t \r\n;&|])/u;
const SHELL_ARGUMENT = /^(?:-{1,2}[a-z\d][\w-]*(?:[\t =;&|]|$)|(?:(?:\.{1,2}|~)[\\/]|\/|[A-Za-z]:[\\/])[^\s]+)/iu;
const SHELL_ENV_ASSIGNMENT = /^[A-Za-z_]\w*=(?:"(?:\\.|[^"])*"|'[^']*'|\\.|[^\s;&|])*(?:[\t ]+|[\t ]*\r?\n[\t ]*)(?=\S)/u;
const SHELL_CONTROL = /^(?:(?:if|elif|while|until)[\t ]+(?:\[{1,2}(?=[\t ]|$)|test\b|[A-Za-z_][\w-]*(?=[\t ;]))|for[\t ]+(?:[A-Za-z_]\w*[\t ]+in\b|\(\([^\r\n]*\)\)[\t ]*;[\t ]*do\b)|case[\t ]+\S+[\t ]+in\b|function[\t ]+[A-Za-z_][\w-]*[\t ]*\{)/u;
const SHELL_REDIRECTION = /^(?:\d*(?:>>?|<<?)|&>>?)/u;
const LEADING_SOURCE_COMMENTS = /^(?:(?:\/\/[^\r\n]*(?:\r?\n|$)|\/\*[\s\S]*?\*\/|#[^\r\n]*(?:\r?\n|$))[\t \r\n]*)+/u;
function parsesAsGuestJavaScript(source, declaration = "") {
	try {
		return new Script(`(async () => {\n${declaration}${source}\n})`) instanceof Script;
	} catch {
		return false;
	}
}
function hasHoistedGuestBinding(source, name) {
	return !parsesAsGuestJavaScript(source, `let ${name};\n`) && parsesAsGuestJavaScript(source, `var ${name};\n`);
}
/** Reject recognizable shell commands without guessing at JavaScript expressions. */
function isShellLikeCodeModeSource(source, preparedSource = source) {
	const trimmed = source.trim();
	if (trimmed.startsWith("#!")) return true;
	const uncommented = trimmed.replace(LEADING_SOURCE_COMMENTS, "");
	if (!uncommented || JAVASCRIPT_EXPORT.test(uncommented)) return false;
	if (SHELL_CONTROL.test(uncommented)) return true;
	let commandSource = uncommented;
	for (;;) {
		const assignment = SHELL_ENV_ASSIGNMENT.exec(commandSource);
		if (!assignment) break;
		commandSource = commandSource.slice(assignment[0].length);
	}
	const knownCommand = SHELL_COMMAND.exec(commandSource);
	const unknownCommand = SHELL_IDENTIFIER.exec(commandSource);
	const command = knownCommand ?? (unknownCommand && !JAVASCRIPT_KEYWORD.test(unknownCommand[1] ?? "") && !JAVASCRIPT_GLOBAL.test(unknownCommand[1] ?? "") ? unknownCommand : null);
	if (!command && !SHELL_EXECUTABLE_PATH.test(commandSource)) return false;
	const commandTail = command ? commandSource.slice(command[0].length) : "";
	const remainder = commandTail.trimStart();
	if (command && !remainder) return knownCommand !== null;
	if (!parsesAsGuestJavaScript(preparedSource)) return true;
	const commandName = command?.[1];
	if (commandName && hasHoistedGuestBinding(preparedSource, commandName)) return false;
	if (/^[\t ]*(?:[;\r\n]|&&?|\|{1,2})/u.test(commandTail)) return knownCommand !== null;
	if (!command || !SHELL_ARGUMENT.test(remainder) && !(knownCommand !== null && SHELL_REDIRECTION.test(remainder)) && !(commandName === "jq" && remainder.startsWith("."))) return false;
	return true;
}
const CODE_MODE_SHELL_SOURCE_ERROR = "code-mode exec runs JavaScript or TypeScript, not shell commands. Call an enabled async tool global from guest JavaScript; use catalog.search(query) when the bounded quick index omits it. Do not retry the same shell command as code.";
//#endregion
//#region src/agents/code-mode-typescript-runtime.ts
const typescriptRuntimeLoader = createLazyPromiseLoader(() => import("typescript"), { cacheRejections: true });
function loadCodeModeTypeScriptRuntime() {
	return typescriptRuntimeLoader.load();
}
//#endregion
//#region src/agents/code-mode-runtime.ts
const DEFAULT_TIMEOUT_MS = 1e4;
const DEFAULT_MEMORY_LIMIT_BYTES = 64 * 1024 * 1024;
const DEFAULT_MAX_OUTPUT_BYTES = 64 * 1024;
const DEFAULT_MAX_SNAPSHOT_BYTES = 10 * 1024 * 1024;
const DEFAULT_MAX_PENDING_TOOL_CALLS = 16;
const DEFAULT_SNAPSHOT_TTL_SECONDS = 900;
const DEFAULT_SEARCH_LIMIT = 8;
const DEFAULT_MAX_SEARCH_LIMIT = 50;
const CODE_MODE_WORKER_WATCHDOG_GRACE_MS = 2e3;
const DEFAULT_HEADLESS_WALL_CLOCK_MS = 3e4;
const MAX_HEADLESS_WALL_CLOCK_MS = 9e5;
function normalizeCodeModeRawConfig(value) {
	const codeMode = value;
	if (codeMode === true) return { enabled: true };
	if (codeMode === false) return { enabled: false };
	if (codeMode === "auto") return { enabled: "auto" };
	return isRecord(codeMode) ? codeMode : void 0;
}
function readCodeModeRawConfig(config, agentId) {
	const globalRaw = normalizeCodeModeRawConfig((isRecord(config?.tools) ? config.tools : void 0)?.codeMode) ?? {};
	const agentRaw = config && agentId ? normalizeCodeModeRawConfig(resolveAgentConfig(config, agentId)?.tools?.codeMode) : void 0;
	return agentRaw ? {
		...globalRaw,
		...agentRaw
	} : globalRaw;
}
function readEnabled(value) {
	return typeof value === "boolean" || value === "auto" ? value : "auto";
}
function readPositiveInteger(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
function readLanguages(value) {
	if (!Array.isArray(value)) return ["javascript", "typescript"];
	const languages = value.filter((entry) => entry === "javascript" || entry === "typescript");
	return languages.length > 0 ? uniqueValues(languages) : ["javascript", "typescript"];
}
/** Resolves Code Mode runtime limits and language support from config. */
function resolveCodeModeConfig(config, agentId) {
	const raw = readCodeModeRawConfig(config, agentId);
	const maxSearchLimit = clampNumber(readPositiveInteger(raw.maxSearchLimit, DEFAULT_MAX_SEARCH_LIMIT), 1, DEFAULT_MAX_SEARCH_LIMIT);
	return {
		enabled: readEnabled(raw.enabled),
		runtime: "quickjs-wasi",
		mode: "only",
		languages: readLanguages(raw.languages),
		timeoutMs: clampNumber(readPositiveInteger(raw.timeoutMs, DEFAULT_TIMEOUT_MS), 100, 6e4),
		memoryLimitBytes: clampNumber(readPositiveInteger(raw.memoryLimitBytes, DEFAULT_MEMORY_LIMIT_BYTES), 1024 * 1024, 1024 * 1024 * 1024),
		maxOutputBytes: clampNumber(readPositiveInteger(raw.maxOutputBytes, DEFAULT_MAX_OUTPUT_BYTES), 1024, 10 * 1024 * 1024),
		maxSnapshotBytes: clampNumber(readPositiveInteger(raw.maxSnapshotBytes, DEFAULT_MAX_SNAPSHOT_BYTES), 1024, 256 * 1024 * 1024),
		maxPendingToolCalls: clampNumber(readPositiveInteger(raw.maxPendingToolCalls, DEFAULT_MAX_PENDING_TOOL_CALLS), 1, 128),
		snapshotTtlSeconds: clampNumber(readPositiveInteger(raw.snapshotTtlSeconds, DEFAULT_SNAPSHOT_TTL_SECONDS), 1, 1440 * 60),
		searchDefaultLimit: clampNumber(readPositiveInteger(raw.searchDefaultLimit, DEFAULT_SEARCH_LIMIT), 1, maxSearchLimit),
		maxSearchLimit
	};
}
/**
* Resolves the master switch against one model's catalog capability flag.
* `true`/`false` are absolute; `"auto"` engages only for models whose catalog
* compat declares `codeMode: "preferred"`. This gates the model-facing tool
* surface only; runs that route to a provider-native harness (for example the
* default OpenAI Codex surface) never reach this embedded-runtime gate.
*/
function isCodeModeEngagedForModel(config, model) {
	if (config.enabled !== "auto") return config.enabled;
	return (model?.compat && typeof model.compat === "object" ? model.compat : void 0)?.codeMode === "preferred";
}
function toToolSearchConfig(config) {
	return {
		enabled: true,
		mode: "tools",
		codeTimeoutMs: config.timeoutMs,
		searchDefaultLimit: config.searchDefaultLimit,
		maxSearchLimit: config.maxSearchLimit
	};
}
function resolveCodeModeHeadlessConfig(ctx, overrides) {
	const base = resolveCodeModeConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId);
	const definedOverrides = Object.fromEntries(Object.entries(overrides ?? {}).filter(([, value]) => value !== void 0));
	return resolveCodeModeConfig({ tools: { codeMode: {
		...base,
		...definedOverrides
	} } });
}
var CodeModeLimitError = class extends ToolInputError {
	constructor(message) {
		super(message);
		this.code = "snapshot_limit_exceeded";
		this.name = "CodeModeLimitError";
	}
};
function isRuntimeInterruptedError(error) {
	return (error instanceof Error ? error.message : error) === "interrupted";
}
function codeModeFailureCode(error) {
	if (error instanceof CodeModeLimitError) return error.code;
	if (isRuntimeInterruptedError(error)) return "timeout";
	return error instanceof ToolInputError ? "invalid_input" : "internal_error";
}
function codeModeFailureMessage(error) {
	return isRuntimeInterruptedError(error) ? "code mode timeout exceeded" : formatErrorMessage(error);
}
function boundOutputToLimit(output, config) {
	const bounded = boundCodeModeResult({
		output,
		maxOutputBytes: config.maxOutputBytes
	});
	output.splice(0, output.length, ...bounded.output);
	return bounded.truncated;
}
function readCode(args) {
	const params = asToolParamsRecord(args);
	const codeAlias = readNonBlankString(params.code);
	const commandAlias = readNonBlankString(params.command);
	if (codeAlias !== void 0 && commandAlias !== void 0 && codeAlias !== commandAlias) throw new ToolInputError("code and command must match when both are provided.");
	const code = commandAlias ?? codeAlias;
	if (code === void 0) throw new ToolInputError("code or command must be a non-empty string.");
	const language = params.language;
	if (language !== void 0 && language !== "javascript" && language !== "typescript") throw new ToolInputError("language must be javascript or typescript.");
	const restartSafe = params.restartSafe;
	if (restartSafe !== void 0 && typeof restartSafe !== "boolean") throw new ToolInputError("restartSafe must be a boolean.");
	return {
		code,
		language,
		restartSafe: restartSafe === true
	};
}
function readRunId(args) {
	const params = asToolParamsRecord(args);
	const runId = params.runId ?? params.run_id;
	if (typeof runId !== "string" || !runId.trim()) throw new ToolInputError("runId must be a non-empty string.");
	return runId.trim();
}
function maskCodeLiteralsAndComments(code, typescriptRuntime) {
	let masked = code.split("");
	const maskRange = (start, end, offset = 0) => {
		for (let index = Math.max(start - offset, 0); index < Math.min(end - offset, masked.length); index += 1) if (masked[index] !== "\n" && masked[index] !== "\r") masked[index] = " ";
	};
	try {
		const wrapped = buildCodeModeScriptParseSource(code);
		parse(wrapped.source, {
			ecmaVersion: "latest",
			onComment: (_isBlock, _text, start, end) => maskRange(start, end, wrapped.codeOffset),
			onToken: (token) => {
				if (token.type.label === "string" || token.type.label === "regexp" || token.type.label === "template") maskRange(token.start, token.end, wrapped.codeOffset);
			}
		});
		return masked.join("");
	} catch {
		masked = code.split("");
		if (typescriptRuntime) try {
			const sourceFile = typescriptRuntime.createSourceFile("code-mode.ts", code, typescriptRuntime.ScriptTarget.ES2022, true, typescriptRuntime.ScriptKind.TS);
			const visit = (node) => {
				typescriptRuntime.forEachLeadingCommentRange(code, node.getFullStart(), (start, end) => maskRange(start, end));
				typescriptRuntime.forEachTrailingCommentRange(code, node.getEnd(), (start, end) => maskRange(start, end));
				if (typescriptRuntime.isStringLiteralLike(node) || typescriptRuntime.isRegularExpressionLiteral(node) || typescriptRuntime.isTemplateHead(node) || typescriptRuntime.isTemplateMiddle(node) || typescriptRuntime.isTemplateTail(node)) maskRange(node.getStart(sourceFile), node.getEnd());
				typescriptRuntime.forEachChild(node, visit);
			};
			visit(sourceFile);
			return masked.join("");
		} catch {
			return code;
		}
		try {
			for (const token of tokenizer(code, {
				ecmaVersion: "latest",
				onComment: (_isBlock, _text, start, end) => maskRange(start, end)
			})) if (token.type.label === "string" || token.type.label === "template") maskRange(token.start, token.end);
			return masked.join("");
		} catch {
			return code;
		}
	}
}
function isModuleLoaderCallee(callee) {
	if (callee.type === "ParenthesizedExpression") return isModuleLoaderCallee(callee.expression);
	if (callee.type === "ChainExpression") return isModuleLoaderCallee(callee.expression);
	if (callee.type === "SequenceExpression") {
		const expression = callee.expressions[callee.expressions.length - 1];
		return expression !== void 0 && isModuleLoaderCallee(expression);
	}
	return callee.type === "Identifier" && callee.name === "require";
}
function containsModuleAccess(node) {
	if (node.type === "ImportDeclaration" || node.type === "ImportExpression" || node.type === "MetaProperty" && node.meta.name === "import" || node.type === "CallExpression" && isModuleLoaderCallee(node.callee)) return true;
	for (const value of Object.values(node)) {
		if (Array.isArray(value)) {
			for (const child of value) if (child !== null && typeof child === "object" && "type" in child && typeof child.type === "string" && containsModuleAccess(child)) return true;
			continue;
		}
		if (value !== null && typeof value === "object" && "type" in value && typeof value.type === "string" && containsModuleAccess(value)) return true;
	}
	return false;
}
function typeScriptContainsModuleAccess(code, ts) {
	const source = ts.createSourceFile("code-mode.ts", code, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
	const isLoaderCallee = (expression) => {
		if (ts.isParenthesizedExpression(expression)) return isLoaderCallee(expression.expression);
		if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.CommaToken) return isLoaderCallee(expression.right);
		return ts.isIdentifier(expression) && expression.text === "require";
	};
	const visit = (node) => {
		if (ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node) || ts.isMetaProperty(node) && node.keywordToken === ts.SyntaxKind.ImportKeyword || ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || isLoaderCallee(node.expression))) return true;
		return ts.forEachChild(node, (child) => visit(child) ? true : void 0) === true;
	};
	return visit(source);
}
function rejectsModuleAccess(code, typescriptRuntime) {
	const parsed = parseCodeModeScriptSyntax(code);
	if (parsed.ok) return containsModuleAccess(parsed.program);
	if (typescriptRuntime) try {
		return typeScriptContainsModuleAccess(code, typescriptRuntime);
	} catch {}
	const source = maskCodeLiteralsAndComments(code, typescriptRuntime);
	return /\bimport\b\s*(?:\.|\(|["'`{*]|\w)|\brequire\b\s*\(/u.test(source);
}
async function prepareSource(input) {
	const language = input.language ?? "javascript";
	if (!input.config.languages.includes(language)) throw new ToolInputError(`code mode ${language} input is disabled.`);
	if (language === "javascript") {
		if (rejectsModuleAccess(input.code)) throw new ToolInputError("code mode module access is disabled.");
		if (isShellLikeCodeModeSource(input.code)) throw new ToolInputError(CODE_MODE_SHELL_SOURCE_ERROR);
		return input.code;
	}
	const ts = await loadCodeModeTypeScriptRuntime();
	if (rejectsModuleAccess(input.code, ts)) throw new ToolInputError("code mode module access is disabled.");
	const transformed = ts.transpileModule(input.code, {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.ESNext,
			importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
			sourceMap: false
		},
		reportDiagnostics: true
	});
	const diagnostics = transformed.diagnostics ?? [];
	if (diagnostics.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)) throw new ToolInputError(`typescript transform failed: ${diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n")}`);
	if (rejectsModuleAccess(transformed.outputText, ts)) throw new ToolInputError("code mode module access is disabled.");
	if (isShellLikeCodeModeSource(input.code, transformed.outputText) || isShellLikeCodeModeSource(transformed.outputText)) throw new ToolInputError(CODE_MODE_SHELL_SOURCE_ERROR);
	return transformed.outputText;
}
function createCodeModeApiFilesForRun(namespaceRuntime, swarmEnabled) {
	const { apiFiles: files } = namespaceRuntime;
	return swarmEnabled ? files : files.filter((file) => file.path !== "agents.d.ts");
}
function enforceSnapshotPayloadLimits(params) {
	if (params.snapshotBytes.byteLength > params.config.maxSnapshotBytes) throw new CodeModeLimitError("code mode snapshot limit exceeded");
}
//#endregion
//#region src/agents/code-mode-state.ts
const MAX_ACTIVE_CODE_MODE_RUNS = 64;
const MAX_AGENT_WAIT_SNAPSHOT_TTL_WINDOWS = 4;
const BRIDGE_CLOSED_MESSAGE = "Code Mode tool canceled, expired, or owner lost; start a new run.";
const activeRuns = /* @__PURE__ */ new Map();
const resumingRunIds = /* @__PURE__ */ new Set();
let activeRunReservations = 0;
let nextPendingBridgeSettlementSequence = 0;
let activeRunExpiryTimer;
function createCodeModeBridgeDispatchState() {
	return {
		started: false,
		potentiallyMutatingDispatches: 0
	};
}
/** Read the host-only side-effect classification for one Code Mode run. */
function isCodeModeBridgeRepairEligible(state) {
	return state.started && state.potentiallyMutatingDispatches === 0;
}
function scheduleActiveRunExpiry() {
	if (activeRunExpiryTimer) {
		clearTimeout(activeRunExpiryTimer);
		activeRunExpiryTimer = void 0;
	}
	let nextExpiresAt = Number.POSITIVE_INFINITY;
	for (const state of activeRuns.values()) nextExpiresAt = Math.min(nextExpiresAt, state.expiresAt);
	if (!Number.isFinite(nextExpiresAt)) return;
	activeRunExpiryTimer = setTimeout(() => {
		activeRunExpiryTimer = void 0;
		removeExpiredRuns();
		scheduleActiveRunExpiry();
	}, Math.max(1, nextExpiresAt - Date.now()));
	activeRunExpiryTimer.unref?.();
}
function removeExpiredRuns(now = Date.now()) {
	for (const [runId, state] of activeRuns) if (!isFutureDateTimestampMs(state.expiresAt, { nowMs: now })) {
		if (state.pending?.some((entry) => entry.method === "agentWait" && !entry.settled) && state.agentWaitRetainUntil !== void 0 && isFutureDateTimestampMs(state.agentWaitRetainUntil, { nowMs: now })) {
			const renewed = resolveCodeModeSnapshotExpiresAt(now, state.config.snapshotTtlSeconds);
			if (renewed !== void 0) {
				state.expiresAt = Math.min(renewed, state.agentWaitRetainUntil);
				continue;
			}
		}
		disposeCodeModeRun(runId);
	}
}
function disposeCodeModeRun(runId) {
	cancelPendingBridgeStates(activeRuns.get(runId)?.pending ?? []);
	activeRuns.delete(runId);
	resumingRunIds.delete(runId);
	scheduleActiveRunExpiry();
}
/** Cancel suspended bridge work before its Gateway-owned runtimes disappear. */
function disposeAllCodeModeRuns() {
	activeRuns.forEach((state) => cancelPendingBridgeStates(state.pending));
	activeRuns.clear();
	resumingRunIds.clear();
	scheduleActiveRunExpiry();
}
/** Advance the snapshot frontier before exposing output to a wait observer. */
function takeUndeliveredCodeModeRunOutput(state) {
	const output = state.output.slice(state.deliveredOutputCount);
	state.deliveredOutputCount = state.output.length;
	return output;
}
/** Abort each bridge call whose result has not already reached its guest. */
function cancelPendingBridgeStates(pending) {
	for (const entry of pending) if (!entry.settled) entry.cancel?.();
}
/** Apply restored-guest cancellation to the parent-owned host operations. */
function cancelPendingBridgeStatesById(pending, canceledRequestIds) {
	if (canceledRequestIds.length === 0) return;
	const canceled = new Set(canceledRequestIds);
	cancelPendingBridgeStates(pending.filter((entry) => canceled.has(entry.id)));
	pending.splice(0, pending.length, ...pending.filter((entry) => !canceled.has(entry.id)));
}
/** Deliver bridge responses in actual settlement order, not request order. */
function settledBridgeRequestsInCompletionOrder(pending) {
	return pending.filter((entry) => entry.settled !== void 0).toSorted((left, right) => (left.settledSequence ?? 0) - (right.settledSequence ?? 0)).flatMap((entry) => entry.settled ? [entry.settled] : []);
}
/** Keep every dispatched bridge call required until its guest has received the result. */
function pendingBridgeStatesForSettlement(pending, settlementMode) {
	if (settlementMode.kind === "awaiting") return pending;
	const requiredRequestIds = new Set(settlementMode.requiredRequestIds);
	return pending.filter((entry) => requiredRequestIds.has(entry.id));
}
/** Await the shared guest frontier without guessing native Promise ownership. */
function waitForPendingBridgeSettlement(pending, settlementMode) {
	const required = pendingBridgeStatesForSettlement(pending, settlementMode);
	const outstanding = required.filter((entry) => !entry.settled);
	if (outstanding.length === 0 || settlementMode.kind === "awaiting" && outstanding.length !== required.length) return Promise.resolve();
	return (settlementMode.kind === "draining" ? Promise.all(outstanding.map((entry) => entry.promise)) : Promise.race(outstanding.map((entry) => entry.promise))).then(() => void 0);
}
function resolveCodeModeSnapshotExpiresAt(now, ttlSeconds) {
	return resolveExpiresAtMsFromDurationSeconds(ttlSeconds, { nowMs: now });
}
function enforceActiveRunLimit() {
	removeExpiredRuns();
	if (activeRuns.size + activeRunReservations >= MAX_ACTIVE_CODE_MODE_RUNS) throw new ToolInputError("too many suspended code mode runs.");
}
function reserveActiveRunSlot(ownedRunId) {
	if (ownedRunId === void 0) enforceActiveRunLimit();
	else if (!activeRuns.delete(ownedRunId)) throw new ToolInputError("code mode run is unavailable or expired.");
	activeRunReservations += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		activeRunReservations = Math.max(0, activeRunReservations - 1);
	};
}
function snapshotState(params) {
	enforceSnapshotStateLimits(params);
	const runId = `cm_${randomUUID()}`;
	const pending = createPendingBridgeStates({
		...params,
		activeRunId: runId,
		codeModeRunId: params.codeModeReplayId
	});
	try {
		return storeSnapshotState({
			...params,
			runId,
			replayId: params.codeModeReplayId,
			pending,
			replaySafe: params.replaySafe && pendingBridgeRequestsReplaySafe(params.pendingRequests, params.runtime, params.catalogProjection)
		});
	} catch (error) {
		cancelPendingBridgeStates(pending);
		throw error;
	}
}
function pendingBridgeRequestsReplaySafe(pending, runtime, catalogProjection) {
	return pending.every((request) => isPendingBridgeRequestReplaySafe(request, runtime, catalogProjection));
}
function isPendingBridgeRequestReplaySafe(request, runtime, catalogProjection) {
	if (request.method === "search" || request.method === "describe" || request.method === "yield" || request.method === "agentSpawn" || request.method === "agentWait" || request.method === "skillsList" || request.method === "skillsRead" || request.method === "sleep") return true;
	if (request.method === "nodes") return request.args[0] === "list" || request.args[0] === "get";
	if (request.method !== "callValue") return false;
	const callableName = Array.isArray(request.args) ? request.args[0] : void 0;
	if (typeof callableName !== "string") return false;
	const binding = catalogProjection.byCallableName.get(callableName);
	return binding ? runtime.isReplaySafeExactId(binding.id) : false;
}
function enforceSnapshotStateLimits(params) {
	if (!params.reservedActiveRunSlot) enforceActiveRunLimit();
	enforceSnapshotPayloadLimits(params);
}
function createPendingBridgeStates(params) {
	return params.pendingRequests.map((request) => {
		const abortController = new AbortController();
		const signal = AbortSignal.any([
			params.signal,
			params.ctx.abortSignal,
			abortController.signal
		].filter((candidate) => candidate !== void 0));
		const yieldRunSignal = params.catalogProjection.byCallableName.get(String(request.args[0]))?.name === "sessions_yield" ? params.ctx.abortSignal : void 0;
		const tracksDispatch = request.method !== "sleep";
		const recoverySafe = [
			"search",
			"describe",
			"skillsList",
			"skillsRead"
		].includes(request.method) || ["nodes", "callValue"].includes(request.method) && isPendingBridgeRequestReplaySafe(request, params.runtime, params.catalogProjection);
		if (tracksDispatch) {
			params.bridgeDispatch.started = true;
			if (!recoverySafe) params.bridgeDispatch.potentiallyMutatingDispatches += 1;
		}
		const completion = raceWithAbortSignal(runBridgeRequest({
			runtime: params.runtime,
			catalogProjection: params.catalogProjection,
			namespaceRuntime: params.namespaceRuntime,
			parentToolCallId: params.parentToolCallId,
			codeModeRunId: params.codeModeRunId,
			maxOutputBytes: params.config.maxOutputBytes,
			remainingMs: Math.max(1, params.remainingMs),
			ctx: params.ctx,
			request,
			signal,
			onUpdate: params.onUpdate
		}), signal, yieldRunSignal).catch(() => ({
			id: request.id,
			ok: false,
			error: signal.reason instanceof Error ? signal.reason.message : BRIDGE_CLOSED_MESSAGE
		}));
		const state = {
			...request,
			promise: completion.then((settled) => {
				if (tracksDispatch && consumeTrustedToolNoStartError(settled) && !recoverySafe) params.bridgeDispatch.potentiallyMutatingDispatches = Math.max(0, params.bridgeDispatch.potentiallyMutatingDispatches - 1);
				state.settledSequence = ++nextPendingBridgeSettlementSequence;
				state.settled = settled;
				if (state.method === "agentWait" && params.activeRunId) {
					const active = activeRuns.get(params.activeRunId);
					if (active?.pending.includes(state)) {
						const renewed = resolveCodeModeSnapshotExpiresAt(Date.now(), active.config.snapshotTtlSeconds);
						if (renewed !== void 0) {
							active.expiresAt = renewed;
							scheduleActiveRunExpiry();
						}
					}
				}
				return settled;
			}),
			cancel: () => abortController.abort(/* @__PURE__ */ new Error(BRIDGE_CLOSED_MESSAGE))
		};
		return state;
	});
}
function storeSnapshotState(params) {
	const now = Date.now();
	const expiresAt = resolveCodeModeSnapshotExpiresAt(now, params.config.snapshotTtlSeconds);
	if (expiresAt === void 0) throw new ToolInputError("code mode run expiry is unavailable.");
	const agentWaitRetainUntil = params.pending.some((entry) => entry.method === "agentWait" && !entry.settled) ? resolveCodeModeSnapshotExpiresAt(now, params.config.snapshotTtlSeconds * MAX_AGENT_WAIT_SNAPSHOT_TTL_WINDOWS) : void 0;
	activeRuns.set(params.runId, {
		runId: params.runId,
		replayId: params.replayId,
		parentToolCallId: params.parentToolCallId,
		ctx: params.ctx,
		config: params.config,
		snapshotBytes: params.snapshotBytes,
		pending: params.pending,
		settlementMode: params.settlementMode,
		replaySafe: params.replaySafe,
		output: params.output,
		deliveredOutputCount: params.output.length,
		expiresAt,
		agentWaitRetainUntil,
		runtime: params.runtime,
		catalogProjection: params.catalogProjection,
		namespaceRuntime: params.namespaceRuntime,
		bridgeDispatch: params.bridgeDispatch
	});
	scheduleActiveRunExpiry();
	return {
		status: "waiting",
		runId: params.runId,
		reason: codeModeWaitingReason(params.pending),
		pendingToolCalls: pendingToolCalls(params.pending),
		replaySafe: params.replaySafe,
		output: params.output.slice(params.deliveredOutputCount ?? 0),
		telemetry: telemetry(params.runtime)
	};
}
function codeModeWaitingReason(pending) {
	return pending.length > 0 && pending.every((entry) => entry.method === "yield") ? "yield" : "pending_tools";
}
function pendingToolCalls(pending) {
	return pending.filter((entry) => !entry.settled).map((entry) => ({
		id: entry.id,
		method: entry.method
	}));
}
function telemetry(runtime) {
	return {
		...runtime.telemetry(),
		visibleTools: [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME]
	};
}
//#endregion
export { isCodeModeEngagedForModel as A, createCodeModeCatalogProjection as B, DEFAULT_HEADLESS_WALL_CLOCK_MS as C, codeModeFailureMessage as D, codeModeFailureCode as E, resolveCodeModeConfig as F, resolveCodeModeHeadlessConfig as I, toToolSearchConfig as L, readCode as M, readPositiveInteger as N, createCodeModeApiFilesForRun as O, readRunId as P, CODE_MODE_NODES_TOOL_ID as R, CODE_MODE_WORKER_WATCHDOG_GRACE_MS as S, boundOutputToLimit as T, resolveCodeModeSkills as V, snapshotState as _, createCodeModeBridgeDispatchState as a, telemetry as b, disposeCodeModeRun as c, pendingBridgeStatesForSettlement as d, pendingToolCalls as f, settledBridgeRequestsInCompletionOrder as g, resumingRunIds as h, codeModeWaitingReason as i, prepareSource as j, enforceSnapshotPayloadLimits as k, isCodeModeBridgeRepairEligible as l, reserveActiveRunSlot as m, cancelPendingBridgeStates as n, createPendingBridgeStates as o, removeExpiredRuns as p, cancelPendingBridgeStatesById as r, disposeAllCodeModeRuns as s, activeRuns as t, pendingBridgeRequestsReplaySafe as u, storeSnapshotState as v, MAX_HEADLESS_WALL_CLOCK_MS as w, waitForPendingBridgeSettlement as x, takeUndeliveredCodeModeRunOutput as y, codeModeReplayIdForToolCall as z };
