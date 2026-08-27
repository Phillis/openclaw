import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import { a as listAgentIds } from "./agent-scope-config-CUBiGmG3.js";
import "./session-upstream-links-BwxSZt9W.js";
import "./input-provenance-CCQsDhUy.js";
import { p as withSessionTranscriptWriteLock } from "./session-transcript-runtime-DXwgc1x5.js";
import { n as decodeNodePtyResumeParams, r as runNodePtyCommand, t as resolveNodeHostExecutable } from "./node-host-B926ObkZ.js";
import { a as parseClaudeCliHistoryEntry, f as resolveClaudeCliTimestampMs, g as parseCliReseedPrompt, u as resolveClaudeCliPromptTextCandidates } from "./cli-session-history.claude-DzqLWUpB.js";
import { createHash } from "node:crypto";
//#region src/plugins/session-catalog.ts
function normalizeUserText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function isExternalUserText(probe, text) {
	const normalized = text === void 0 ? "" : normalizeUserText(text);
	return !probe.ownRecentUserTexts.includes(normalized);
}
function listSessionCatalogEntries(params) {
	const requiresExplicitOwner = params.config.agents?.ownership === "explicit";
	const requestedAgentId = params.agentId || requiresExplicitOwner ? resolveSessionAgentIds({
		config: params.config,
		agentId: params.agentId
	}).sessionAgentId : void 0;
	const requestEntries = params.sessionEntries?.entriesForCatalog?.();
	if (requestEntries) return requiresExplicitOwner && requestedAgentId ? requestEntries.filter((entry) => entry.agentId === requestedAgentId) : requestEntries;
	const defaultAgentId = requestedAgentId ?? resolveSessionAgentIds({ config: params.config }).defaultAgentId;
	return (requiresExplicitOwner ? [defaultAgentId] : [defaultAgentId, ...listAgentIds(params.config).filter((agentId) => agentId !== defaultAgentId)]).flatMap((agentId) => {
		return (params.sessionEntries ? params.sessionEntries.entriesForAgent(agentId) : params.runtime.agent.session.listSessionEntries({
			agentId,
			readOnly: true
		})).map((entry) => Object.assign({}, entry, { agentId }));
	});
}
function sessionCatalogAdoptedSourceKey(hostId, threadId) {
	return `${hostId}\0${threadId}`;
}
function sessionCatalogAdoptedSessionKey(prefix, source) {
	return `${prefix}${createHash("sha256").update(source).digest("hex")}`;
}
function listAdoptedSessionCatalogSessions(params) {
	const adopted = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry } of listSessionCatalogEntries(params)) {
		const source = params.sourceFromEntry(entry);
		if (source && entry.pluginOwnerId === params.pluginId && entry.initializationPending !== true) adopted.set(sessionCatalogAdoptedSourceKey(source.hostId, source.threadId), sessionKey);
	}
	return adopted;
}
function createSessionCatalogAdoptionCoordinator() {
	const operations = /* @__PURE__ */ new Map();
	return async (params) => {
		const pending = operations.get(params.sourceKey);
		if (pending) return await pending;
		const operation = (async () => {
			const existing = await params.findExisting();
			if (existing) return await params.complete({ sessionKey: existing });
			const continued = await params.create().catch(async (error) => {
				const raced = await params.findExisting();
				if (raced) return { sessionKey: raced };
				throw error;
			});
			return await params.complete(continued);
		})();
		operations.set(params.sourceKey, operation);
		try {
			return await operation;
		} finally {
			if (operations.get(params.sourceKey) === operation) operations.delete(params.sourceKey);
		}
	};
}
//#endregion
//#region src/plugins/session-catalog-history-import.ts
const SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS = 200;
const SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES = 512 * 1024;
const SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT = 100;
function importedSessionCatalogMessage(params) {
	const timestamp = parseDateStringTimestampMs(params.item.timestamp) ?? params.fallbackTimestamp;
	const importedText = params.item.text?.trim();
	if (!importedText && params.item.type === "reasoning") return;
	const text = importedText || "[Unsupported catalog transcript item]";
	if (params.item.type === "userMessage") return {
		role: "user",
		content: text,
		timestamp,
		__openclaw: { mirrorOrigin: `${params.catalogId}-catalog-import` }
	};
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: `${params.item.type === "reasoning" ? "Thinking\n\n" : params.item.type === "toolCall" ? "Tool call\n\n" : params.item.type === "toolResult" ? "Tool result\n\n" : params.item.type === "other" ? "Other\n\n" : ""}${text}`
		}],
		timestamp,
		api: "openai-responses",
		provider: params.catalogId,
		model: params.item.model ?? "native-history",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop"
	};
}
function fitSessionCatalogItemToBytes(item, maxBytes) {
	if (Buffer.byteLength(JSON.stringify(item), "utf8") <= maxBytes) return item;
	const text = item.text;
	if (typeof text !== "string") return;
	const candidate = (length) => {
		const safeLength = length > 0 && /[\uD800-\uDBFF]/u.test(text.charAt(length - 1)) ? length - 1 : length;
		return {
			...item,
			text: `${text.slice(0, safeLength)}…`,
			truncated: true
		};
	};
	let low = 0;
	let high = text.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(JSON.stringify(candidate(middle)), "utf8") <= maxBytes) low = middle;
		else high = middle - 1;
	}
	const bounded = candidate(low);
	return Buffer.byteLength(JSON.stringify(bounded), "utf8") <= maxBytes ? bounded : void 0;
}
function importableSessionCatalogItem(item) {
	const { raw: _raw, ...importable } = item;
	return importable;
}
async function readBoundedSessionCatalogHistory(params) {
	const pages = [];
	let cursor;
	let itemCount = 0;
	let bytes = 0;
	while (itemCount < SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS) {
		const page = await params.read({
			limit: Math.min(SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT, SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS - itemCount),
			...cursor ? { cursor } : {}
		});
		const retained = [];
		for (let index = page.items.length - 1; index >= 0; index -= 1) {
			const item = page.items[index];
			if (!item) continue;
			const importableItem = importableSessionCatalogItem(item);
			const itemBytes = Buffer.byteLength(JSON.stringify(importableItem), "utf8");
			const remainingBytes = SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES - bytes;
			if (itemCount > 0 && itemBytes > remainingBytes) return [retained, ...pages.toReversed()].flat();
			const retainedItem = itemBytes <= remainingBytes ? importableItem : fitSessionCatalogItemToBytes(importableItem, remainingBytes);
			if (!retainedItem) continue;
			const retainedItemBytes = Buffer.byteLength(JSON.stringify(retainedItem), "utf8");
			retained.unshift(retainedItem);
			itemCount += 1;
			bytes += retainedItemBytes;
			if (itemCount === SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS || bytes === SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES) return [retained, ...pages.toReversed()].flat();
		}
		pages.push(retained);
		if (!page.nextCursor || page.nextCursor === cursor) break;
		cursor = page.nextCursor;
	}
	return pages.toReversed().flat();
}
async function importSessionCatalogHistory(params) {
	const items = await readBoundedSessionCatalogHistory({ read: params.read });
	const fallbackTimestamp = Date.now();
	await withSessionTranscriptWriteLock(params, async (transcript) => {
		for (const [index, item] of items.entries()) {
			const imported = importedSessionCatalogMessage({
				catalogId: params.catalogId,
				item,
				fallbackTimestamp: fallbackTimestamp + index
			});
			if (!imported) continue;
			const message = {
				...imported,
				idempotencyKey: `${params.catalogId}-catalog:${params.threadId}:${item.id ?? index}`
			};
			await transcript.appendMessage({
				message,
				idempotencyLookup: "scan",
				cwd: params.cwd
			});
		}
	});
}
//#endregion
//#region src/gateway/cli-session-history.claude-activity.ts
function classifyClaudeCliHistoryEntry(params) {
	const entry = params.entry;
	const content = entry.message?.content;
	if (entry.type !== "user" || entry.message?.role !== "user") return { humanTurn: false };
	if (typeof content !== "string" && !Array.isArray(content)) return { humanTurn: false };
	const candidates = resolveClaudeCliPromptTextCandidates(entry, content);
	if (candidates.length === 0 || candidates.some(({ text }) => text.startsWith("[Inter-session message]") || parseCliReseedPrompt(text).kind !== "none")) return { humanTurn: false };
	if (parseClaudeCliHistoryEntry(entry, params.cliSessionId, params.sourceLineNumber, /* @__PURE__ */ new Map(), { reseedMode: "preserve" })?.role !== "user") return { humanTurn: false };
	const occurredAt = resolveClaudeCliTimestampMs(entry.timestamp);
	return {
		humanTurn: true,
		userText: candidates[0]?.text,
		...occurredAt === void 0 ? {} : { occurredAt }
	};
}
/** Classifies one native JSONL row through the same filters used by history import. */
function classifyClaudeCliHistoryLine(params) {
	let entry;
	try {
		entry = JSON.parse(params.line);
	} catch {
		return { humanTurn: false };
	}
	return classifyClaudeCliHistoryEntry({
		...params,
		entry
	});
}
/** Applies native history filters to an already-decoded catalog user message. */
function classifyClaudeCliHistoryMessage(params) {
	return classifyClaudeCliHistoryEntry({
		cliSessionId: params.cliSessionId,
		sourceLineNumber: params.sourceLineNumber,
		entry: {
			type: "user",
			timestamp: params.timestamp,
			message: {
				role: "user",
				content: params.content
			}
		}
	});
}
//#endregion
//#region src/plugins/session-catalog-family.ts
function nodeLabel(node) {
	return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function unwrapNodePayload(value) {
	return isRecord(value) && typeof value.payloadJSON === "string" ? JSON.parse(value.payloadJSON) : value;
}
function isOptionalString(value) {
	return value === void 0 || typeof value === "string";
}
function isOptionalNumber(value) {
	return value === void 0 || typeof value === "number";
}
function isNodeSession(value, sessionIdPattern) {
	return isRecord(value) && typeof value.threadId === "string" && sessionIdPattern.test(value.threadId) && typeof value.status === "string" && value.status.length > 0 && typeof value.archived === "boolean" && typeof value.canContinue === "boolean" && typeof value.canArchive === "boolean" && isOptionalString(value.name) && isOptionalString(value.cwd) && isOptionalString(value.source) && isOptionalString(value.modelProvider) && isOptionalString(value.cliVersion) && isOptionalString(value.gitBranch) && isOptionalString(value.sessionKey) && isOptionalNumber(value.createdAt) && isOptionalNumber(value.updatedAt) && isOptionalNumber(value.recencyAt);
}
const TRANSCRIPT_ITEM_TYPES = /* @__PURE__ */ new Set([
	"userMessage",
	"agentMessage",
	"reasoning",
	"toolCall",
	"toolResult",
	"other"
]);
function isNodeTranscriptItem(value) {
	return isRecord(value) && typeof value.type === "string" && TRANSCRIPT_ITEM_TYPES.has(value.type) && isOptionalString(value.id) && isOptionalString(value.text) && isOptionalString(value.timestamp) && isOptionalString(value.model) && (value.truncated === void 0 || typeof value.truncated === "boolean");
}
function parseNodeSessionPage(value, options, isExactCursor) {
	if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > options.node.maxPageLimit || !value.sessions.every((session) => isNodeSession(session, options.node.sessionIdPattern))) throw new Error(options.messages.invalidNodeSessionPage);
	const nextCursor = value.nextCursor;
	if (nextCursor !== void 0 && !isExactCursor(nextCursor)) throw new Error(options.messages.invalidNodeCursor);
	return {
		sessions: value.sessions,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
function parseNodeTranscriptPage(value, threadId, options, isExactCursor) {
	if (!isRecord(value) || value.threadId !== threadId || !Array.isArray(value.items) || value.items.length > options.node.maxPageLimit || !value.items.every(isNodeTranscriptItem)) throw new Error(options.messages.invalidNodeTranscriptPage);
	const nextCursor = value.nextCursor;
	if (nextCursor !== void 0 && !isExactCursor(nextCursor)) throw new Error(options.messages.invalidNodeCursor);
	return {
		hostId: options.local.hostId,
		threadId,
		items: value.items,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
function projectPageCapabilities(page, capabilities, project) {
	return {
		...page,
		sessions: page.sessions.map((session) => project(session, capabilities))
	};
}
function projectAdoptedSessions(page, adopted, localHostId) {
	return {
		...page,
		sessions: page.sessions.map((session) => {
			const sessionKey = adopted.get(sessionCatalogAdoptedSourceKey(localHostId, session.threadId));
			return sessionKey ? {
				...session,
				sessionKey
			} : session;
		})
	};
}
async function listNodeHost(options, query, node, isExactCursor) {
	const hostId = `node:${node.nodeId}`;
	const common = {
		hostId,
		label: nodeLabel(node),
		kind: "node",
		connected: node.connected === true,
		nodeId: node.nodeId
	};
	if (node.connected !== true) return {
		...common,
		sessions: [],
		error: {
			code: "NODE_OFFLINE",
			message: "Paired node is offline"
		}
	};
	try {
		const cursor = query.cursors?.[hostId];
		if (cursor !== void 0 && !isExactCursor(cursor)) throw new Error("cursor is invalid");
		const page = parseNodeSessionPage(unwrapNodePayload(await options.runtime.nodes.invoke({
			nodeId: node.nodeId,
			command: options.node.listCommand,
			params: {
				...query.limitPerHost ? { limit: query.limitPerHost } : {},
				...query.search ? { searchTerm: query.search } : {},
				...cursor !== void 0 ? { cursor } : {}
			},
			timeoutMs: options.node.timeoutMs,
			scopes: ["operator.write"]
		})), options, isExactCursor);
		return {
			...common,
			...projectPageCapabilities(page, options.capabilities.node(node), options.capabilities.project)
		};
	} catch {
		return {
			...common,
			sessions: [],
			error: {
				code: "NODE_INVOKE_FAILED",
				message: options.messages.nodeInvokeFailed
			}
		};
	}
}
async function listHosts(options, query, isExactCursor) {
	const requested = query.hostIds ? new Set(query.hostIds) : void 0;
	const hosts = [];
	if ((!requested || requested.has(options.local.hostId)) && await options.local.available(query)) try {
		const capabilities = await options.capabilities.local();
		const adopted = query.sessionEntries ? await options.continuation.listAdopted(query.agentId, query.sessionEntries) : /* @__PURE__ */ new Map();
		const page = projectAdoptedSessions(projectPageCapabilities(await options.local.list(query), capabilities, options.capabilities.project), adopted, options.local.hostId);
		const host = {
			hostId: options.local.hostId,
			label: options.local.label,
			kind: "gateway",
			connected: true,
			...page
		};
		hosts.push(host);
		query.onHost?.(host);
	} catch {
		const host = {
			hostId: options.local.hostId,
			label: options.local.label,
			kind: "gateway",
			connected: true,
			sessions: [],
			error: {
				code: "LOCAL_READ_FAILED",
				message: options.messages.localReadFailed
			}
		};
		hosts.push(host);
		query.onHost?.(host);
	}
	let nodes;
	try {
		nodes = (await (query.listNodes?.() ?? options.runtime.nodes.list())).nodes;
	} catch {
		return hosts;
	}
	const pending = nodes.filter((node) => node.commands?.includes(options.node.listCommand) && (!requested || requested.has(`node:${node.nodeId}`))).toSorted((left, right) => nodeLabel(left).localeCompare(nodeLabel(right))).slice(0, options.node.maxHosts - hosts.length).map((node) => listNodeHost(options, query, node, isExactCursor).then((host) => {
		query.onHost?.(host);
		return host;
	}));
	return [...hosts, ...await Promise.all(pending)];
}
async function readTranscript(options, request, isExactCursor) {
	if (request.cursor !== void 0 && !isExactCursor(request.cursor)) throw new Error("cursor is invalid");
	if (request.hostId === options.local.hostId) {
		options.local.assertAccess(request.hostId, request.allowProcessHomeFallback);
		return await options.local.read(request);
	}
	if (!request.hostId.startsWith("node:")) throw new Error(options.messages.invalidHostId);
	const nodeId = request.hostId.slice(5);
	const node = (await options.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes(options.node.readCommand));
	if (!node) throw new Error(options.messages.nodeReadUnavailable);
	return {
		...parseNodeTranscriptPage(unwrapNodePayload(await options.runtime.nodes.invoke({
			nodeId,
			command: options.node.readCommand,
			params: {
				threadId: request.threadId,
				...request.limit ? { limit: request.limit } : {},
				...request.cursor !== void 0 ? { cursor: request.cursor } : {}
			},
			timeoutMs: options.node.timeoutMs,
			scopes: ["operator.write"]
		})), request.threadId, options, isExactCursor),
		hostId: request.hostId,
		label: nodeLabel(node)
	};
}
async function openTerminal(options, request, isExactCursor) {
	const title = options.terminal.title(request.threadId);
	if (request.hostId === options.local.hostId) {
		options.local.assertAccess(request.hostId, request.allowProcessHomeFallback);
		const session = await options.terminal.requireLocalSession(request.threadId);
		const resolution = resolveNodeHostExecutable(options.terminal.executable, {
			env: process.env,
			pathEnv: process.env.PATH ?? "",
			strategy: "fallback"
		});
		if (!resolution) throw new Error(options.terminal.unavailableMessage);
		return {
			kind: "local",
			argv: [resolution.executable, ...options.terminal.args(request.threadId)],
			...session.cwd ? { cwd: session.cwd } : {},
			...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
			title
		};
	}
	if (!request.hostId.startsWith("node:")) throw new Error(options.messages.invalidHostId);
	const nodeId = request.hostId.slice(5);
	if (!(await options.runtime.nodes.list()).nodes.find((candidate) => {
		const commands = candidate.invocableCommands ?? candidate.commands;
		return candidate.nodeId === nodeId && candidate.connected === true && commands?.includes(options.node.listCommand) === true && commands.includes(options.node.terminalCommand);
	})) throw new Error(options.messages.nodeTerminalUnavailable);
	const session = parseNodeSessionPage(unwrapNodePayload(await options.runtime.nodes.invoke({
		nodeId,
		command: options.node.listCommand,
		params: {
			searchTerm: request.threadId,
			limit: options.node.maxPageLimit
		},
		timeoutMs: options.node.timeoutMs,
		scopes: ["operator.write"]
	})), options, isExactCursor).sessions.find((candidate) => candidate.threadId === request.threadId);
	if (!session) throw new Error(options.messages.sessionUnavailable);
	return {
		kind: "node",
		nodeId,
		command: options.node.terminalCommand,
		paramsJSON: JSON.stringify({ threadId: request.threadId }),
		...session.cwd ? { cwd: session.cwd } : {},
		title
	};
}
/** Compose the shared local-plus-paired-node runtime for one CLI session-catalog family. */
function createSessionCatalogFamily(options, isExactCursor) {
	const continueAdoption = createSessionCatalogAdoptionCoordinator();
	return {
		list: async (query) => await listHosts(options, query, isExactCursor),
		read: async (request) => await readTranscript(options, request, isExactCursor),
		continueSession: async (request) => {
			options.local.assertAccess(request.hostId, request.allowProcessHomeFallback);
			if (request.hostId.startsWith("node:")) throw new Error(options.continuation.nodeReadOnlyMessage);
			if (request.hostId !== options.local.hostId) throw new Error(options.messages.invalidHostId);
			const available = await options.continuation.availability();
			if (!available.available) throw new Error(available.message);
			const agentId = options.continuation.resolveAgentId(request.agentId);
			const sourceKey = sessionCatalogAdoptedSourceKey(request.hostId, request.threadId);
			return await continueAdoption({
				sourceKey,
				findExisting: async () => (await options.continuation.listAdopted(agentId)).get(sourceKey),
				create: async () => {
					const session = await options.continuation.loadSession(request.threadId);
					options.continuation.validateSession(session);
					const current = await options.continuation.availability();
					if (!current.available) throw new Error(current.message);
					return await options.continuation.create({
						agentId,
						hostId: request.hostId,
						threadId: request.threadId,
						session
					});
				},
				complete: async (continued) => await options.continuation.complete(continued, request.threadId)
			});
		},
		checkUpstreamActivity: options.checkUpstreamActivity,
		openTerminal: async (request) => await openTerminal(options, request, isExactCursor)
	};
}
/** Build the three node-host commands and their explicit terminal-only invoke policy. */
function createSessionCatalogNodeHostBindings(options) {
	const terminal = {
		command: options.terminalCommand,
		cap: options.capability,
		dangerous: false,
		duplex: true,
		isAvailable: options.terminalAvailable,
		handle: async (paramsJSON, io) => {
			if (!io) throw new Error(options.terminalIoRequiredMessage);
			const params = decodeNodePtyResumeParams(paramsJSON, (value) => {
				if (typeof value !== "string" || !options.sessionIdPattern.test(value)) throw new Error(options.invalidThreadIdMessage);
				return value;
			});
			const session = await options.requireSession(params.threadId);
			const resolution = resolveNodeHostExecutable(options.executable, {
				env: process.env,
				pathEnv: process.env.PATH ?? process.env.Path ?? "",
				strategy: "direct"
			});
			if (!resolution) throw new Error(options.terminalUnavailableMessage);
			return JSON.stringify(await runNodePtyCommand({
				file: resolution.executable,
				args: options.args(params.threadId),
				cwd: session.cwd,
				cols: params.cols,
				rows: params.rows
			}, io));
		}
	};
	return {
		commands: [
			{
				command: options.listCommand,
				cap: options.capability,
				dangerous: false,
				isAvailable: options.listAvailable,
				handle: async (paramsJSON) => JSON.stringify(await options.list(options.parseParams(paramsJSON)))
			},
			{
				command: options.readCommand,
				cap: options.capability,
				dangerous: false,
				isAvailable: options.listAvailable,
				handle: async (paramsJSON) => JSON.stringify(await options.read(options.parseParams(paramsJSON)))
			},
			terminal
		],
		policies: [{
			commands: [
				options.listCommand,
				options.readCommand,
				options.terminalCommand
			],
			defaultPlatforms: [
				"macos",
				"linux",
				"windows"
			],
			handle: (context) => context.command === options.terminalCommand ? { ok: true } : context.invokeNode()
		}]
	};
}
//#endregion
//#region src/plugin-sdk/session-catalog.ts
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 100;
const MAX_CURSOR_LENGTH = 128;
const MAX_TRANSCRIPT_ITEM_BYTES = 512 * 1024;
const MAX_TRANSCRIPT_PAGE_BYTES = 20 * 1024 * 1024;
function boundedSessionCatalogLimit(value, fallback = DEFAULT_PAGE_LIMIT) {
	if (value === void 0) return fallback;
	if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > MAX_PAGE_LIMIT) throw new Error(`limit must be an integer between 1 and ${String(MAX_PAGE_LIMIT)}`);
	return Number(value);
}
function encodeSessionCatalogCursor(offset) {
	return Buffer.from(JSON.stringify({ offset }), "utf8").toString("base64url");
}
function optionalSessionCatalogCursor(value) {
	if (value === void 0) return;
	if (typeof value !== "string" || value.length === 0 || value.length > MAX_CURSOR_LENGTH) throw new Error("cursor is invalid");
	return value;
}
function parseSessionCatalogListParams(value, options) {
	if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
	if (!isRecord(value)) throw new Error(options.messages.listNotObject);
	const unknown = Object.keys(value).find((key) => ![
		"searchTerm",
		"limit",
		"cursor"
	].includes(key));
	if (unknown) throw new Error(options.messages.unknownListParameter(unknown));
	const searchTerm = normalizeBoundedOptionalString(value.searchTerm, options.searchMaxLength);
	if (value.searchTerm !== void 0 && !searchTerm) throw new Error(options.messages.invalidSearchTerm);
	const cursor = optionalSessionCatalogCursor(value.cursor);
	return {
		limit: boundedSessionCatalogLimit(value.limit),
		...searchTerm ? { searchTerm } : {},
		...cursor ? { cursor } : {}
	};
}
function parseSessionCatalogReadParams(value, options) {
	if (!isRecord(value)) throw new Error(options.messages.readNotObject);
	const unknown = Object.keys(value).find((key) => ![
		"threadId",
		"limit",
		"cursor"
	].includes(key));
	if (unknown) throw new Error(options.messages.unknownReadParameter(unknown));
	const threadId = normalizeBoundedOptionalString(value.threadId, options.threadIdMaxLength);
	if (!threadId || !options.threadIdPattern.test(threadId)) throw new Error(options.messages.invalidThreadId);
	const cursor = optionalSessionCatalogCursor(value.cursor);
	return {
		threadId,
		limit: boundedSessionCatalogLimit(value.limit),
		...cursor ? { cursor } : {}
	};
}
function decodeSessionCatalogCursor(value) {
	const cursor = optionalSessionCatalogCursor(value);
	if (cursor === void 0) return 0;
	try {
		const bytes = Buffer.from(cursor, "base64url");
		if (bytes.toString("base64url") !== cursor) throw new Error("non-canonical base64url");
		const parsed = JSON.parse(bytes.toString("utf8"));
		if (!isRecord(parsed) || !Number.isSafeInteger(parsed.offset) || Number(parsed.offset) < 0) throw new Error("invalid offset");
		const offset = Number(parsed.offset);
		if (encodeSessionCatalogCursor(offset) !== cursor) throw new Error("non-canonical cursor payload");
		return offset;
	} catch (error) {
		throw new Error("cursor is invalid", { cause: error });
	}
}
function isExactSessionCatalogCursor(value) {
	if (typeof value !== "string") return false;
	try {
		decodeSessionCatalogCursor(value);
		return true;
	} catch {
		return false;
	}
}
function truncateUtf8(text, maxBytes) {
	if (Buffer.byteLength(text, "utf8") <= maxBytes) return text;
	let low = 0;
	let high = text.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(text.slice(0, middle), "utf8") <= maxBytes - 3) low = middle;
		else high = middle - 1;
	}
	const end = low > 0 && /[\uD800-\uDBFF]/u.test(text.charAt(low - 1)) ? low - 1 : low;
	return `${text.slice(0, end)}…`;
}
/** Page transcript items from the tail, bounding per-item and per-page byte budgets. */
function boundSessionCatalogTranscriptPage(items, limit, offset) {
	const end = Math.max(0, items.length - offset);
	const start = Math.max(0, end - limit);
	const page = [];
	let pageBytes = 2;
	for (let index = end - 1; index >= start; index -= 1) {
		const item = items[index];
		if (!item) continue;
		const bounded = {
			...item,
			text: truncateUtf8(item.text ?? "", MAX_TRANSCRIPT_ITEM_BYTES)
		};
		const itemBytes = Buffer.byteLength(JSON.stringify(bounded), "utf8") + 1;
		if (page.length > 0 && pageBytes + itemBytes > MAX_TRANSCRIPT_PAGE_BYTES) break;
		page.unshift(bounded);
		pageBytes += itemBytes;
	}
	const consumed = offset + page.length;
	return {
		items: page,
		...consumed < items.length ? { nextCursor: encodeSessionCatalogCursor(consumed) } : {}
	};
}
/** Canonical bounded parameter, base64url cursor, and UTF-8 transcript paging contract. */
const sessionCatalogPaging = {
	boundedLimit: boundedSessionCatalogLimit,
	encodeCursor: encodeSessionCatalogCursor,
	optionalCursor: optionalSessionCatalogCursor,
	parseListParams: parseSessionCatalogListParams,
	parseReadParams: parseSessionCatalogReadParams,
	decodeCursor: decodeSessionCatalogCursor,
	isExactCursor: isExactSessionCatalogCursor,
	boundTranscriptPage: boundSessionCatalogTranscriptPage
};
//#endregion
export { classifyClaudeCliHistoryMessage as a, isExternalUserText as c, normalizeUserText as d, sessionCatalogAdoptedSessionKey as f, classifyClaudeCliHistoryLine as i, listAdoptedSessionCatalogSessions as l, createSessionCatalogFamily as n, importSessionCatalogHistory as o, sessionCatalogAdoptedSourceKey as p, createSessionCatalogNodeHostBindings as r, createSessionCatalogAdoptionCoordinator as s, sessionCatalogPaging as t, listSessionCatalogEntries as u };
