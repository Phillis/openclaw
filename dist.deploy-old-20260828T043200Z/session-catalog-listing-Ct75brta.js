import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./security-runtime-CYUTzVOk.js";
import { a as ClaudeCatalogParamsError, n as CLAUDE_SESSIONS_LIST_COMMAND, r as CLAUDE_SESSION_READ_COMMAND } from "./session-catalog-shared-B8NbCO28.js";
import { t as CLAUDE_LOCAL_SESSION_HOST_ID } from "./session-catalog-adoption-C3d_naEs.js";
import { i as currentHomeDir, r as configuredClaudeConfigDir, s as gatewayClaudeScanOptions } from "./session-catalog-scan-Br4cebMu.js";
import { n as parseTranscriptLine } from "./session-catalog-transcript-Bz8I3DB8.js";
import { n as listClaudeSessions } from "./session-catalog-discovery-gyPWzwsY.js";
import { n as resolveNodeLabel, t as createNodeListFailedError } from "./session-catalog-node-helpers-Bb_Ro2Ey.js";
import { a as decodeOffset, c as parseGatewayQuery, d as readOptionalCursor, f as readTranscriptParams, l as readListParams, o as encodeOffset, p as unwrapNodePayload, s as parseCatalogPage, u as readNodePageCursor } from "./session-catalog-parsing-B9VGazrM.js";
import { t as claudeNodeTerminalCapability } from "./session-catalog-terminal-DUM7wJWd.js";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-listing.ts
const TRANSCRIPT_READ_CHUNK_BYTES = 128 * 1024;
const MAX_TRANSCRIPT_SCAN_BYTES = 64 * 1024 * 1024;
const MAX_TRANSCRIPT_PAGE_BYTES = 20 * 1024 * 1024;
const NODE_INVOKE_TIMEOUT_MS = 3e4;
const NODE_CATALOG_LIST_RESPONSE_TIMEOUT_MS = 8e3;
const CLAUDE_HISTORY_IMPORT_MAX_ITEMS = 200;
const CLAUDE_HISTORY_IMPORT_MAX_BYTES = 512 * 1024;
async function listLocalClaudeSessionPage(value, homeDir, scanOptions) {
	const resolvedHome = homeDir ?? currentHomeDir();
	const resolvedScanOptions = scanOptions ?? (homeDir === void 0 ? gatewayClaudeScanOptions(true) : {});
	const params = readListParams(value);
	const offset = decodeOffset(params.cursor, "catalog");
	const search = params.searchTerm?.toLocaleLowerCase();
	const records = (await listClaudeSessions(resolvedHome, resolvedScanOptions)).filter((record) => {
		if (!search) return true;
		return [
			record.name,
			record.cwd,
			record.gitBranch,
			record.threadId
		].some((candidate) => candidate?.toLocaleLowerCase().includes(search));
	});
	const page = records.slice(offset, offset + params.limit).map(({ filePath: _filePath, ...record }) => record);
	const nextOffset = offset + page.length;
	return {
		sessions: page,
		...nextOffset < records.length ? { nextCursor: encodeOffset(nextOffset) } : {}
	};
}
async function readLocalClaudeTranscriptPage(value, homeDir, scanOptions) {
	const resolvedHome = homeDir ?? currentHomeDir();
	const resolvedScanOptions = scanOptions ?? (homeDir === void 0 ? gatewayClaudeScanOptions(true) : {});
	const params = readTranscriptParams(value);
	let filePath = (await listClaudeSessions(resolvedHome, resolvedScanOptions)).find((record) => record.threadId === params.threadId)?.filePath;
	if (!filePath) filePath = (await listClaudeSessions(resolvedHome, {
		...resolvedScanOptions,
		forceRefresh: true
	})).find((record) => record.threadId === params.threadId)?.filePath;
	if (!filePath) throw new ClaudeCatalogParamsError("Claude session is unavailable");
	const handle = await fs.open(filePath, "r");
	try {
		const stat = await handle.stat();
		const requestedEnd = params.cursor ? decodeOffset(params.cursor, "transcript") : stat.size;
		if (requestedEnd > stat.size) throw new ClaudeCatalogParamsError("transcript cursor is invalid");
		let position = requestedEnd;
		let scanned = 0;
		let fragments = [];
		const found = [];
		while (position > 0 && scanned < MAX_TRANSCRIPT_SCAN_BYTES && found.length <= params.limit) {
			const size = Math.min(TRANSCRIPT_READ_CHUNK_BYTES, position, MAX_TRANSCRIPT_SCAN_BYTES - scanned);
			position -= size;
			const chunk = Buffer.allocUnsafe(size);
			let filled = 0;
			while (filled < size) {
				const { bytesRead } = await handle.read(chunk, filled, size - filled, position + filled);
				if (bytesRead === 0) throw new Error("Claude transcript changed while it was being read");
				filled += bytesRead;
			}
			scanned += filled;
			let right = filled;
			for (let index = filled - 1; index >= 0; index -= 1) {
				if (chunk[index] !== 10) continue;
				const segment = chunk.subarray(index + 1, right);
				if (segment.length > 0 || fragments.length > 0) {
					const item = parseTranscriptLine(Buffer.concat([segment, ...fragments.toReversed()]), normalizeBoundedOptionalString);
					fragments = [];
					if (item) {
						found.push({
							item,
							start: position + index + 1
						});
						if (found.length > params.limit) break;
					}
				}
				right = index;
			}
			if (found.length > params.limit) break;
			const prefix = chunk.subarray(0, right);
			if (position === 0) {
				if (prefix.length > 0 || fragments.length > 0) {
					const item = parseTranscriptLine(Buffer.concat([prefix, ...fragments.toReversed()]), normalizeBoundedOptionalString);
					if (item) found.push({
						item,
						start: 0
					});
				}
				fragments = [];
			} else if (prefix.length > 0) fragments.push(prefix);
		}
		if (position > 0 && found.length < params.limit) throw new Error("Claude transcript page exceeded the safe scan limit");
		const requested = found.slice(0, params.limit);
		const selected = [];
		let selectedBytes = 0;
		for (const entry of requested) {
			const itemBytes = Buffer.byteLength(JSON.stringify(entry.item), "utf8");
			if (selected.length > 0 && selectedBytes + itemBytes > MAX_TRANSCRIPT_PAGE_BYTES - 64 * 1024) break;
			selected.push(entry);
			selectedBytes += itemBytes;
		}
		const earliestStart = selected.at(-1)?.start;
		const hasEarlierItems = selected.length < found.length || position > 0;
		return {
			threadId: params.threadId,
			items: selected.map((entry) => entry.item),
			...hasEarlierItems && earliestStart !== void 0 && earliestStart > 0 ? { nextCursor: encodeOffset(earliestStart) } : {}
		};
	} finally {
		await handle.close();
	}
}
async function listClaudeSessionCatalog(params) {
	const query = parseGatewayQuery(params.query);
	const requested = query.hostIds ? new Set(query.hostIds) : void 0;
	const scanOptions = gatewayClaudeScanOptions(params.allowProcessHomeFallback);
	const localHosts = (params.allowProcessHomeFallback !== false || scanOptions.configDir !== void 0) && (!requested || requested.has("gateway:local")) ? [(async () => {
		try {
			return {
				hostId: CLAUDE_LOCAL_SESSION_HOST_ID,
				label: "Local Claude",
				kind: "gateway",
				connected: true,
				...await listLocalClaudeSessionPage({
					limit: query.limitPerHost,
					...query.search ? { searchTerm: query.search } : {},
					...query.cursors?.["gateway:local"] !== void 0 ? { cursor: query.cursors[CLAUDE_LOCAL_SESSION_HOST_ID] } : {}
				}, currentHomeDir(), scanOptions)
			};
		} catch {
			return {
				hostId: CLAUDE_LOCAL_SESSION_HOST_ID,
				label: "Local Claude",
				kind: "gateway",
				connected: true,
				sessions: [],
				error: {
					code: "LOCAL_READ_FAILED",
					message: "Local Claude sessions are unavailable"
				}
			};
		}
	})()] : [];
	for (const host of localHosts) if (params.onHost) host.then(params.onHost).catch(() => void 0);
	if (!(!requested || query.hostIds?.some((hostId) => hostId.startsWith("node:")))) return { hosts: await Promise.all(localHosts) };
	let nodes;
	try {
		nodes = (await (params.listNodes?.() ?? params.runtime.nodes.list())).nodes;
	} catch (error) {
		const registryHost = {
			hostId: "node:registry",
			label: "Paired nodes",
			kind: "node",
			connected: false,
			sessions: [],
			error: createNodeListFailedError(error)
		};
		params.onHost?.(registryHost);
		return { hosts: [...await Promise.all(localHosts), registryHost] };
	}
	const eligible = nodes.filter((node) => node.gatewayLocal !== true && node.commands?.includes("anthropic.claude.sessions.list.v1") && (!requested || requested.has(`node:${node.nodeId}`))).slice(0, 100 - localHosts.length).toSorted((left, right) => resolveNodeLabel(left).localeCompare(resolveNodeLabel(right)));
	const nodeHosts = await Promise.all(eligible.map(async (node) => {
		const hostId = `node:${node.nodeId}`;
		const common = {
			hostId,
			label: resolveNodeLabel(node),
			kind: "node",
			connected: node.connected === true,
			nodeId: node.nodeId,
			canContinueClaude: node.commands?.includes("anthropic.claude.sessions.read.v1") === true && node.commands.includes("agent.cli.claude.run.v1") && node.invocableCommands?.includes("anthropic.claude.sessions.list.v1") === true && node.invocableCommands.includes("anthropic.claude.sessions.read.v1") && node.invocableCommands.includes("agent.cli.claude.run.v1"),
			...claudeNodeTerminalCapability(node)
		};
		if (node.connected !== true) {
			const host = Object.assign({}, common, {
				sessions: [],
				error: {
					code: "NODE_OFFLINE",
					message: "Paired node is offline"
				}
			});
			params.onHost?.(host);
			return host;
		}
		const eventualHost = Promise.resolve().then(async () => {
			const raw = await params.runtime.nodes.invoke({
				nodeId: node.nodeId,
				command: CLAUDE_SESSIONS_LIST_COMMAND,
				params: {
					limit: query.limitPerHost,
					...query.search ? { searchTerm: query.search } : {},
					...query.cursors?.[hostId] !== void 0 ? { cursor: query.cursors[hostId] } : {}
				},
				timeoutMs: NODE_INVOKE_TIMEOUT_MS,
				scopes: ["operator.write"]
			});
			return Object.assign({}, common, parseCatalogPage(unwrapNodePayload(raw)));
		}).catch(() => Object.assign({}, common, {
			sessions: [],
			error: {
				code: "NODE_INVOKE_FAILED",
				message: "Paired node Claude sessions are unavailable"
			}
		}));
		if (params.onHost) eventualHost.then(params.onHost).catch(() => void 0);
		try {
			return await withTimeout(eventualHost, NODE_CATALOG_LIST_RESPONSE_TIMEOUT_MS, { message: "paired node Claude session catalog timed out" });
		} catch {
			return Object.assign({}, common, {
				sessions: [],
				error: {
					code: "NODE_INVOKE_FAILED",
					message: "Paired node Claude sessions are unavailable"
				}
			});
		}
	}));
	return { hosts: [...await Promise.all(localHosts), ...nodeHosts] };
}
async function readClaudeSessionTranscript(params) {
	const cursor = readOptionalCursor(params.cursor, "transcript");
	if (params.hostId === "gateway:local") {
		assertClaudeLocalAccess(params.hostId, params.allowProcessHomeFallback);
		return {
			hostId: params.hostId,
			label: "Local Claude",
			...await readLocalClaudeTranscriptPage({
				threadId: params.threadId,
				limit: params.limit,
				...cursor !== void 0 ? { cursor } : {}
			}, currentHomeDir(), gatewayClaudeScanOptions(params.allowProcessHomeFallback))
		};
	}
	if (!params.hostId.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
	const nodeId = params.hostId.slice(5);
	const node = (await params.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes("anthropic.claude.sessions.read.v1"));
	if (!node) throw new ClaudeCatalogParamsError("paired-node Claude session host is unavailable");
	const page = unwrapNodePayload(await params.runtime.nodes.invoke({
		nodeId,
		command: CLAUDE_SESSION_READ_COMMAND,
		params: {
			threadId: params.threadId,
			limit: params.limit,
			...cursor !== void 0 ? { cursor } : {}
		},
		timeoutMs: NODE_INVOKE_TIMEOUT_MS,
		scopes: ["operator.write"]
	}));
	if (!isRecord(page) || !Array.isArray(page.items) || page.items.length > 50 || page.items.some((item) => !isRecord(item) || typeof item.type !== "string") || page.threadId !== params.threadId || Buffer.byteLength(JSON.stringify(page), "utf8") > MAX_TRANSCRIPT_PAGE_BYTES) throw new Error("Claude node returned an invalid transcript page");
	const nextCursor = readNodePageCursor(page, "Claude node returned an invalid transcript page");
	return {
		hostId: params.hostId,
		label: resolveNodeLabel(node),
		threadId: params.threadId,
		items: page.items,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
function assertClaudeLocalAccess(hostId, allowProcessHomeFallback) {
	if (hostId === "gateway:local" && allowProcessHomeFallback === false && configuredClaudeConfigDir() === void 0) throw new ClaudeCatalogParamsError("local Claude sessions are unavailable in isolated state");
}
async function readBoundedClaudeHistory(params) {
	const items = [];
	let cursor;
	let bytes = 0;
	while (items.length < CLAUDE_HISTORY_IMPORT_MAX_ITEMS) {
		const page = await readClaudeSessionTranscript({
			runtime: params.runtime,
			hostId: params.hostId,
			threadId: params.threadId,
			limit: Math.min(50, CLAUDE_HISTORY_IMPORT_MAX_ITEMS - items.length),
			allowProcessHomeFallback: params.allowProcessHomeFallback,
			...cursor ? { cursor } : {}
		});
		for (const item of page.items) {
			const itemBytes = Buffer.byteLength(JSON.stringify(item), "utf8");
			if (items.length > 0 && bytes + itemBytes > CLAUDE_HISTORY_IMPORT_MAX_BYTES) return items;
			items.push(item);
			bytes += itemBytes;
		}
		if (!page.nextCursor || page.nextCursor === cursor) break;
		cursor = page.nextCursor;
	}
	return items;
}
async function resolveNodeClaudeRecord(params) {
	let cursor;
	for (let pageIndex = 0; pageIndex < 100; pageIndex += 1) {
		const page = parseCatalogPage(unwrapNodePayload(await params.runtime.nodes.invoke({
			nodeId: params.nodeId,
			command: CLAUDE_SESSIONS_LIST_COMMAND,
			params: {
				limit: 100,
				searchTerm: params.threadId,
				...cursor ? { cursor } : {}
			},
			timeoutMs: NODE_INVOKE_TIMEOUT_MS,
			scopes: ["operator.write"]
		})));
		const record = page.sessions.find((candidate) => candidate.threadId === params.threadId);
		if (record) return record;
		if (!page.nextCursor || page.nextCursor === cursor) break;
		cursor = page.nextCursor;
	}
	throw new ClaudeCatalogParamsError("Claude session is unavailable on the paired node");
}
//#endregion
export { readClaudeSessionTranscript as a, readBoundedClaudeHistory as i, listClaudeSessionCatalog as n, readLocalClaudeTranscriptPage as o, listLocalClaudeSessionPage as r, resolveNodeClaudeRecord as s, assertClaudeLocalAccess as t };
