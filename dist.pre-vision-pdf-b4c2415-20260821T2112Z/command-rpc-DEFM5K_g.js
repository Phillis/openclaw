import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { R as timestampMsToIsoString } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-zZP1Z6cM.js";
import "./temp-path-ChKDkme1.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { w as resolveCodexSupervisionAppServerRuntimeOptions, x as resolveCodexAppServerRuntimeOptions } from "./session-binding-BqXBlQHR.js";
import "./text-utility-runtime-LRU688AB.js";
import { n as describeControlFailure, t as CODEX_CONTROL_METHODS } from "./capabilities-CPs19Wxb.js";
import { r as formatCodexDisplayText } from "./command-formatters-VbUiTYkT.js";
import { i as withCodexAppServerJsonClient, r as requestCodexAppServerJson } from "./request-CtW-4Zw1.js";
import { n as listCodexAppServerModels } from "./models-C-qiMJwk.js";
import process from "node:process";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
//#region extensions/codex/src/jsonl-lines.ts
const JSONL_STREAM_THRESHOLD_BYTES = 4 * 1024 * 1024;
const JSONL_READ_CHUNK_BYTES = 1024 * 1024;
async function visitJsonlLines(file, visitor, chunkBytes = JSONL_READ_CHUNK_BYTES) {
	let size;
	try {
		size = (await fs.stat(file)).size;
	} catch {
		return {
			ok: false,
			lineCount: 0
		};
	}
	if (size <= JSONL_STREAM_THRESHOLD_BYTES) {
		let content;
		try {
			content = await fs.readFile(file, "utf8");
		} catch {
			return {
				ok: false,
				lineCount: 0
			};
		}
		if (content.length === 0) return {
			ok: true,
			lineCount: 0
		};
		let lineCount = 0;
		for (const line of content.split(/\r?\n/u)) {
			lineCount += 1;
			if (visitor(line) === false) break;
		}
		return {
			ok: true,
			lineCount
		};
	}
	let handle;
	try {
		handle = await fs.open(file, "r");
	} catch {
		return {
			ok: false,
			lineCount: 0
		};
	}
	const buffer = Buffer.allocUnsafe(chunkBytes);
	const decoder = new TextDecoder();
	let pendingFragments = [];
	let lineCount = 0;
	try {
		while (true) {
			const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
			if (bytesRead === 0) break;
			const content = decoder.decode(buffer.subarray(0, bytesRead), { stream: true });
			let lineStart = 0;
			while (true) {
				const newline = content.indexOf("\n", lineStart);
				if (newline === -1) break;
				let rawLine = content.slice(lineStart, newline);
				if (pendingFragments.length > 0) {
					pendingFragments.push(rawLine);
					rawLine = pendingFragments.join("");
					pendingFragments = [];
				}
				const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
				lineCount += 1;
				if (visitor(line) === false) return {
					ok: true,
					lineCount
				};
				lineStart = newline + 1;
			}
			if (lineStart < content.length) pendingFragments.push(content.slice(lineStart));
		}
		const decoderTail = decoder.decode();
		if (decoderTail.length > 0) pendingFragments.push(decoderTail);
		if (pendingFragments.length > 0) {
			const rawLine = pendingFragments.join("");
			const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
			lineCount += 1;
			visitor(line);
		}
		return {
			ok: true,
			lineCount
		};
	} catch {
		return {
			ok: false,
			lineCount: 0
		};
	} finally {
		await handle.close().catch(() => void 0);
	}
}
//#endregion
//#region extensions/codex/src/node-cli-sessions.ts
const CODEX_CLI_SESSIONS_LIST_COMMAND = "codex.cli.sessions.list";
const CODEX_CLI_SESSION_RESUME_COMMAND = "codex.cli.session.resume";
const DEFAULT_SESSION_LIMIT = 10;
const MAX_SESSION_LIMIT = 50;
const DEFAULT_RESUME_TIMEOUT_MS = 20 * 6e4;
const SESSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const activeResumeSessions = /* @__PURE__ */ new Set();
const DEFAULT_RESUME_SPAWN_RUNTIME = {
	platform: process.platform,
	env: process.env,
	execPath: process.execPath
};
function createCodexCliSessionNodeHostCommands() {
	return [{
		command: CODEX_CLI_SESSIONS_LIST_COMMAND,
		cap: "codex-cli-sessions",
		handle: listLocalCodexCliSessions
	}, {
		command: CODEX_CLI_SESSION_RESUME_COMMAND,
		cap: "codex-cli-sessions",
		dangerous: true,
		handle: resumeLocalCodexCliSession
	}];
}
function createCodexCliSessionNodeInvokePolicies() {
	return [{
		commands: [CODEX_CLI_SESSIONS_LIST_COMMAND],
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (ctx) => ctx.invokeNode()
	}, {
		commands: [CODEX_CLI_SESSION_RESUME_COMMAND],
		dangerous: true,
		handle: (ctx) => ctx.invokeNode()
	}];
}
async function listCodexCliSessionsOnNode(params) {
	const node = await resolveCodexCliNode({
		runtime: params.runtime,
		requestedNode: params.requestedNode,
		command: CODEX_CLI_SESSIONS_LIST_COMMAND
	});
	return {
		node,
		result: parseCodexCliSessionsListResult(await params.runtime.nodes.invoke({
			nodeId: readNodeId(node),
			command: CODEX_CLI_SESSIONS_LIST_COMMAND,
			params: {
				limit: params.limit,
				filter: params.filter
			},
			timeoutMs: 15e3,
			scopes: ["operator.write"]
		}))
	};
}
async function resolveCodexCliSessionForBindingOnNode(params) {
	const listing = await listCodexCliSessionsOnNode({
		runtime: params.runtime,
		requestedNode: params.requestedNode,
		filter: params.sessionId,
		limit: MAX_SESSION_LIMIT
	});
	if (!listing.node.commands?.includes("codex.cli.session.resume")) throw new Error(`Node ${formatNodeLabel(listing.node)} does not expose ${CODEX_CLI_SESSION_RESUME_COMMAND}.`);
	return {
		node: listing.node,
		session: listing.result.sessions.find((session) => session.sessionId === params.sessionId)
	};
}
async function resumeCodexCliSessionOnNode(params) {
	const payload = unwrapNodeInvokePayload(await params.runtime.nodes.invoke({
		nodeId: params.nodeId,
		command: CODEX_CLI_SESSION_RESUME_COMMAND,
		params: {
			sessionId: params.sessionId,
			prompt: params.prompt,
			cwd: params.cwd,
			timeoutMs: params.timeoutMs
		},
		timeoutMs: (params.timeoutMs ?? DEFAULT_RESUME_TIMEOUT_MS) + 5e3,
		scopes: ["operator.write"]
	}));
	if (!isRecord(payload) || payload.ok !== true || typeof payload.text !== "string") throw new Error("Codex CLI resume returned an invalid payload.");
	return {
		ok: true,
		sessionId: typeof payload.sessionId === "string" ? payload.sessionId : params.sessionId,
		text: payload.text
	};
}
function formatCodexCliSessions(params) {
	if (params.result.sessions.length === 0) return `No Codex CLI sessions returned from ${formatCodexDisplayText(formatNodeLabel(params.node))}.`;
	return [`Codex CLI sessions on ${formatCodexDisplayText(formatNodeLabel(params.node))}:`, ...params.result.sessions.map((session) => {
		const details = [session.cwd, session.updatedAt].filter((value) => Boolean(value));
		return `- ${formatCodexDisplayText(session.sessionId)}${session.lastMessage ? ` - ${formatCodexDisplayText(session.lastMessage)}` : ""}${details.length > 0 ? ` (${details.map(formatCodexDisplayText).join(", ")})` : ""}\n  Bind: /codex resume ${formatCodexDisplayText(session.sessionId)} --host ${formatCodexDisplayText(readNodeId(params.node))} --bind here`;
	})].join("\n");
}
async function listLocalCodexCliSessions(paramsJSON) {
	const params = readRecordParam(paramsJSON);
	const limit = normalizeLimit(params.limit);
	const filter = typeof params.filter === "string" ? params.filter.trim().toLowerCase() : "";
	const codexHome = resolveCodexHome();
	const summaries = await readHistorySessions(codexHome);
	await hydrateSessionFiles(codexHome, summaries);
	await hydrateSessionsFromSessionFiles(codexHome, summaries);
	const sessions = [...summaries.values()].filter((session) => {
		if (!filter) return true;
		return [
			session.sessionId,
			session.cwd,
			session.lastMessage
		].some((value) => value?.toLowerCase().includes(filter));
	}).toSorted((a, b) => compareOptionalStringsDesc(a.updatedAt, b.updatedAt)).slice(0, limit);
	return JSON.stringify({
		sessions,
		codexHome
	});
}
async function resumeLocalCodexCliSession(paramsJSON) {
	const params = readRecordParam(paramsJSON);
	const sessionId = typeof params.sessionId === "string" ? params.sessionId.trim() : "";
	const prompt = typeof params.prompt === "string" ? params.prompt.trim() : "";
	if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) throw new Error("Missing or invalid Codex CLI session id.");
	if (!prompt) throw new Error("Missing Codex CLI prompt.");
	if (activeResumeSessions.has(sessionId)) throw new Error(`Codex CLI session ${sessionId} already has an active resume turn.`);
	activeResumeSessions.add(sessionId);
	try {
		const text = await runCodexExecResume({
			sessionId,
			prompt,
			cwd: typeof params.cwd === "string" && params.cwd.trim() ? params.cwd.trim() : void 0,
			timeoutMs: normalizeTimeoutMs(params.timeoutMs)
		});
		return JSON.stringify({
			ok: true,
			sessionId,
			text: text.trim() || "Codex completed without a text reply."
		});
	} finally {
		activeResumeSessions.delete(sessionId);
	}
}
async function runCodexExecResume(params) {
	const outputPath = path.join(await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-codex-cli-")), "last-message.txt");
	try {
		const invocation = resolveCodexCliResumeSpawnInvocation([
			"exec",
			"resume",
			"--skip-git-repo-check",
			"--output-last-message",
			outputPath,
			params.sessionId,
			"-"
		], {
			platform: process.platform,
			env: process.env,
			execPath: process.execPath
		});
		const child = spawn(invocation.command, invocation.args, {
			cwd: params.cwd || process.cwd(),
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: process.env,
			shell: invocation.shell,
			windowsHide: invocation.windowsHide
		});
		const stdout = [];
		const stderr = [];
		let timedOut = false;
		let forceKillTimeout;
		const timeout = setTimeout(() => {
			timedOut = true;
			child.kill("SIGTERM");
			forceKillTimeout = setTimeout(() => child.kill("SIGKILL"), 2e3);
			forceKillTimeout.unref?.();
		}, params.timeoutMs);
		child.stdout.on("data", (chunk) => stdout.push(chunk));
		child.stderr.on("data", (chunk) => stderr.push(chunk));
		child.stdin.end(params.prompt);
		const exitCode = await new Promise((resolve, reject) => {
			child.on("error", reject);
			child.on("exit", (code) => resolve(code));
		}).finally(() => {
			clearTimeout(timeout);
			if (forceKillTimeout) clearTimeout(forceKillTimeout);
		});
		if (timedOut) throw new Error(`codex exec resume timed out after ${String(params.timeoutMs)}ms`);
		if (exitCode !== 0) {
			const message = Buffer.concat(stderr).toString("utf8").trim() || Buffer.concat(stdout).toString("utf8").trim() || `codex exec resume exited with code ${String(exitCode)}`;
			throw new Error(message);
		}
		return await fs.readFile(outputPath, "utf8");
	} finally {
		await fs.rm(path.dirname(outputPath), {
			recursive: true,
			force: true
		});
	}
}
function resolveCodexCliResumeSpawnInvocation(args, runtime = DEFAULT_RESUME_SPAWN_RUNTIME) {
	const resolved = materializeWindowsSpawnProgram(resolveWindowsSpawnProgram({
		command: "codex",
		platform: runtime.platform,
		env: runtime.env,
		execPath: runtime.execPath,
		packageName: "@openai/codex"
	}), args);
	return {
		command: resolved.command,
		args: resolved.argv,
		shell: resolved.shell,
		windowsHide: resolved.windowsHide
	};
}
async function readHistorySessions(codexHome) {
	const summaries = /* @__PURE__ */ new Map();
	if (!(await visitJsonlLines(path.join(codexHome, "history.jsonl"), (line) => {
		const trimmed = line.trim();
		if (!trimmed) return;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			return;
		}
		if (!isRecord(parsed) || typeof parsed.session_id !== "string") return;
		const sessionId = parsed.session_id.trim();
		if (!sessionId) return;
		const entry = summaries.get(sessionId) ?? {
			sessionId,
			messageCount: 0
		};
		entry.messageCount += 1;
		if (typeof parsed.text === "string" && parsed.text.trim()) entry.lastMessage = truncateText(parsed.text.trim(), 140);
		if (typeof parsed.ts === "number") entry.updatedAt = timestampMsToIsoString(parsed.ts * 1e3) ?? entry.updatedAt;
		summaries.set(sessionId, entry);
	})).ok) return /* @__PURE__ */ new Map();
	return summaries;
}
async function hydrateSessionFiles(codexHome, summaries) {
	if (summaries.size === 0) return;
	const files = await findSessionFiles(path.join(codexHome, "sessions"), 4);
	const pending = new Set(summaries.keys());
	for (const file of files) {
		const basename = path.basename(file);
		const sessionId = [...pending].find((id) => basename.includes(id));
		if (!sessionId) continue;
		const entry = summaries.get(sessionId);
		if (!entry) continue;
		entry.sessionFile = file;
		const cwd = readSessionMetaCwd(await readFirstLine(file) ?? "");
		if (cwd) entry.cwd = cwd;
		pending.delete(sessionId);
		if (pending.size === 0) return;
	}
}
async function hydrateSessionsFromSessionFiles(codexHome, summaries) {
	const files = await findSessionFiles(path.join(codexHome, "sessions"), 4);
	for (const file of files) {
		const summary = await readSessionFileSummary(file);
		if (!summary) continue;
		const existing = summaries.get(summary.sessionId);
		summaries.set(summary.sessionId, {
			...summary,
			...existing,
			cwd: existing?.cwd ?? summary.cwd,
			sessionFile: existing?.sessionFile ?? summary.sessionFile,
			updatedAt: existing?.updatedAt ?? summary.updatedAt,
			lastMessage: existing?.lastMessage ?? summary.lastMessage,
			messageCount: existing?.messageCount ?? summary.messageCount
		});
	}
}
async function readSessionFileSummary(file) {
	let sessionId = "";
	let cwd;
	let updatedAt;
	let lastMessage;
	let messageCount = 0;
	const result = await visitJsonlLines(file, (line) => {
		const trimmed = line.trim();
		if (!trimmed) return;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			return;
		}
		if (!isRecord(parsed)) return;
		if (typeof parsed.timestamp === "string" && parsed.timestamp.trim()) updatedAt = parsed.timestamp.trim();
		if (parsed.type === "session_meta" && isRecord(parsed.payload)) {
			if (typeof parsed.payload.id === "string" && parsed.payload.id.trim()) sessionId = parsed.payload.id.trim();
			if (typeof parsed.payload.cwd === "string" && parsed.payload.cwd.trim()) cwd = parsed.payload.cwd.trim();
			return;
		}
		const messageText = readResponseItemMessageText(parsed);
		if (messageText) {
			messageCount += 1;
			lastMessage = truncateText(messageText, 140);
		}
	});
	if (!result.ok) return null;
	if (result.lineCount === 0) return null;
	if (!sessionId) sessionId = readSessionIdFromFilename(file) ?? "";
	if (!sessionId) return null;
	return {
		sessionId,
		updatedAt: updatedAt ?? await readFileMtimeIso(file),
		lastMessage,
		cwd,
		sessionFile: file,
		messageCount
	};
}
async function findSessionFiles(dir, maxDepth) {
	if (maxDepth < 0) return [];
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	const files = [];
	for (const entry of entries) {
		const entryPath = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...await findSessionFiles(entryPath, maxDepth - 1));
		else if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(entryPath);
	}
	return files;
}
function readSessionMetaCwd(line) {
	try {
		const parsed = JSON.parse(line);
		if (!isRecord(parsed) || parsed.type !== "session_meta" || !isRecord(parsed.payload)) return;
		return typeof parsed.payload.cwd === "string" && parsed.payload.cwd.trim() ? parsed.payload.cwd.trim() : void 0;
	} catch {
		return;
	}
}
function readResponseItemMessageText(parsed) {
	if (parsed.type !== "response_item" || !isRecord(parsed.payload)) return;
	if (parsed.payload.type !== "message") return;
	if ((typeof parsed.payload.role === "string" ? parsed.payload.role : "") !== "user") return;
	const parts = (Array.isArray(parsed.payload.content) ? parsed.payload.content : []).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const text = typeof entry.text === "string" ? entry.text : typeof entry.input_text === "string" ? entry.input_text : void 0;
		return text?.trim() ? [text.trim()] : [];
	});
	return parts.length > 0 ? parts.join(" ") : void 0;
}
function readSessionIdFromFilename(file) {
	return path.basename(file).match(/[0-9a-f]{8}-[0-9a-f-]{27,}/iu)?.[0];
}
async function resolveCodexCliNode(params) {
	const list = await params.runtime.nodes.list(params.requestedNode ? void 0 : { connected: true });
	const requested = params.requestedNode?.trim();
	const candidates = list.nodes.filter((node) => {
		if (requested) return [
			node.nodeId,
			node.displayName,
			node.remoteIp
		].some((value) => value === requested);
		return node.connected === true && node.commands?.includes(params.command);
	});
	if (candidates.length === 0) throw new Error(requested ? `Codex CLI node ${requested} was not found.` : "No connected node exposes Codex CLI session commands.");
	const usable = candidates.filter((node) => node.commands?.includes(params.command));
	if (usable.length === 0) throw new Error(`Node ${requested ?? "candidate"} does not expose ${params.command}.`);
	if (usable.length > 1) throw new Error("Multiple Codex CLI-capable nodes connected. Pass --host <node-id>.");
	return expectDefined(usable[0], "single usable Codex CLI node");
}
function parseCodexCliSessionsListResult(raw) {
	const payload = unwrapNodeInvokePayload(raw);
	if (!isRecord(payload) || !Array.isArray(payload.sessions)) throw new Error("Codex CLI session list returned an invalid payload.");
	return {
		codexHome: typeof payload.codexHome === "string" ? payload.codexHome : "",
		sessions: payload.sessions.flatMap((entry) => {
			if (!isRecord(entry) || typeof entry.sessionId !== "string") return [];
			return [{
				sessionId: entry.sessionId,
				updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : void 0,
				lastMessage: typeof entry.lastMessage === "string" ? entry.lastMessage : void 0,
				cwd: typeof entry.cwd === "string" ? entry.cwd : void 0,
				sessionFile: typeof entry.sessionFile === "string" ? entry.sessionFile : void 0,
				messageCount: typeof entry.messageCount === "number" && Number.isFinite(entry.messageCount) ? entry.messageCount : 0
			}];
		})
	};
}
function unwrapNodeInvokePayload(raw) {
	const record = isRecord(raw) ? raw : {};
	if (typeof record.payloadJSON === "string" && record.payloadJSON.trim()) try {
		return JSON.parse(record.payloadJSON);
	} catch (error) {
		throw new Error("Codex CLI node command returned malformed payloadJSON.", { cause: error });
	}
	if ("payload" in record) return record.payload;
	return raw;
}
function readRecordParam(paramsJSON) {
	if (!paramsJSON?.trim()) return {};
	try {
		const parsed = JSON.parse(paramsJSON);
		return isRecord(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function resolveCodexHome() {
	return process.env.CODEX_HOME?.trim() || path.join(os.homedir(), ".codex");
}
async function readFirstLine(file) {
	let firstLine;
	return (await visitJsonlLines(file, (line) => {
		firstLine = line;
		return false;
	}, 65536)).ok ? firstLine : void 0;
}
async function readFileMtimeIso(file) {
	try {
		return (await fs.stat(file)).mtime.toISOString();
	} catch {
		return;
	}
}
function normalizeLimit(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.min(MAX_SESSION_LIMIT, Math.max(1, Math.floor(value))) : DEFAULT_SESSION_LIMIT;
}
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.min(60 * 6e4, Math.floor(value)) : DEFAULT_RESUME_TIMEOUT_MS;
}
function truncateText(value, max) {
	if (value.length <= max) return value;
	return `${truncateUtf16Safe(value, Math.max(0, max - 3))}...`;
}
function compareOptionalStringsDesc(a, b) {
	return (b ?? "").localeCompare(a ?? "");
}
function readNodeId(node) {
	if (!node.nodeId) throw new Error("Codex CLI node did not include a node id.");
	return node.nodeId;
}
function formatNodeLabel(node) {
	return [
		node.displayName,
		node.nodeId,
		node.remoteIp
	].filter(Boolean).join(" / ") || "node";
}
//#endregion
//#region extensions/codex/src/command-rpc.ts
function requestOptions(pluginConfig, limit, config, agentDir) {
	const runtime = resolveCodexAppServerRuntimeOptions({ pluginConfig });
	return {
		limit,
		timeoutMs: runtime.requestTimeoutMs,
		startOptions: runtime.start,
		config,
		agentDir
	};
}
async function codexControlRequest(pluginConfig, method, requestParams, options = {}) {
	const runtime = options.startOptions ? resolveCodexSupervisionAppServerRuntimeOptions({ pluginConfig }) : resolveCodexAppServerRuntimeOptions({ pluginConfig });
	const controlRequestOptions = {
		timeoutMs: options.timeoutMs ?? runtime.requestTimeoutMs,
		startOptions: options.startOptions ?? runtime.start,
		config: options.config,
		sessionKey: options.sessionKey,
		sessionId: options.sessionId,
		authProfileId: options.authProfileId,
		agentDir: options.agentDir,
		isolated: options.isolated
	};
	if (options.onResponse) return await withCodexAppServerJsonClient(controlRequestOptions, async (request, client) => {
		const response = await request({
			method,
			requestParams
		});
		await options.onResponse(response, client);
		return response;
	});
	return await requestCodexAppServerJson({
		method,
		requestParams,
		...controlRequestOptions
	});
}
async function safeCodexControlRequest(pluginConfig, method, requestParams, options = {}) {
	return await safeValue(async () => await codexControlRequest(pluginConfig, method, requestParams, options));
}
async function safeCodexModelList(pluginConfig, limit, config, agentDir) {
	return await safeValue(async () => await listCodexAppServerModels(requestOptions(pluginConfig, limit, config, agentDir)));
}
async function readCodexStatusProbes(pluginConfig, config, agentDir) {
	const [models, account, limits, mcps, skills] = await Promise.all([
		safeCodexModelList(pluginConfig, 20, config, agentDir),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.account, { refreshToken: false }, {
			config,
			agentDir
		}),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.rateLimits, void 0, {
			config,
			agentDir
		}),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listMcpServers, { limit: 100 }, {
			config,
			agentDir
		}),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listSkills, {}, {
			config,
			agentDir
		})
	]);
	return {
		models,
		account,
		limits,
		mcps,
		skills
	};
}
async function safeValue(read) {
	try {
		return {
			ok: true,
			value: await read()
		};
	} catch (error) {
		return {
			ok: false,
			error: describeControlFailure(error)
		};
	}
}
//#endregion
export { CODEX_CLI_SESSION_RESUME_COMMAND as a, formatCodexCliSessions as c, resumeCodexCliSessionOnNode as d, safeCodexControlRequest as i, listCodexCliSessionsOnNode as l, readCodexStatusProbes as n, createCodexCliSessionNodeHostCommands as o, requestOptions as r, createCodexCliSessionNodeInvokePolicies as s, codexControlRequest as t, resolveCodexCliSessionForBindingOnNode as u };
