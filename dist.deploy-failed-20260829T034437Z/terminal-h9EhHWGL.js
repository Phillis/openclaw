import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import "./src-BntaCZM-.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { i as allowsProcessHomeSessionScan } from "./paths-BBSTUjD5.js";
import "./errors-Ccx0R-_Z.js";
import { t as mergeProcessEnv } from "./process-env-CW4bkwqq.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-UYcIi_5g.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { h as NODE_TERMINAL_UPLOAD_COMMAND, i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS } from "./node-commands-DRxP7loh.js";
import { $v as validateTerminalUploadParams, Jv as validateTerminalAttachParams, Qv as validateTerminalResizeParams, Xv as validateTerminalInputParams, Yv as validateTerminalCloseParams, Zv as validateTerminalOpenParams, ey as validateTerminalUploadResult } from "./src-4dv5TpeQ.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRF7yKG5.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { r as isCanonicalTerminalUploadBase64 } from "./terminal-constants-0UMJMHnf.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-BuNOLSoA.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { t as BoundedBuffer } from "./bounded-buffer-C08_hwby.js";
import { t as applyPluginNodeInvokePolicy } from "./node-invoke-plugin-policy-C86ujiBp.js";
import { n as resolveSessionCatalogProvider } from "./session-catalog-lN8hF_x-.js";
import { r as resolveTerminalSpawnPlan, t as buildTerminalEnv } from "./launch-SXWXUZTR.js";
import { n as surrogateSafeTail } from "./output-ring-Bz-YhhYd.js";
//#region src/gateway/terminal/node-relay.ts
const DATA_INPUT_CHUNK_BYTES = 2 * 1024;
const MAX_PENDING_DATA_CHARS = 512 * 1024;
function parseExit(result) {
	if (!result.ok) return { error: `${result.error?.code ?? "NODE_INVOKE_FAILED"}: ${result.error?.message ?? "node terminal invoke failed"}` };
	try {
		const raw = result.payloadJSON ?? (result.payload === void 0 ? void 0 : JSON.stringify(result.payload));
		if (!raw) return { exitCode: 0 };
		const value = JSON.parse(raw);
		if (!value || typeof value !== "object" || Array.isArray(value)) return { exitCode: 0 };
		const record = value;
		return {
			...typeof record.exitCode === "number" ? { exitCode: record.exitCode } : {},
			...typeof record.signal === "number" ? { signal: record.signal } : {}
		};
	} catch {
		return { error: "node terminal returned an invalid exit result" };
	}
}
function splitInput(data) {
	const chunks = [];
	let start = 0;
	let bytes = 0;
	for (let index = 0; index < data.length; index += 1) {
		const codePoint = data.codePointAt(index);
		if (codePoint === void 0) break;
		const char = String.fromCodePoint(codePoint);
		const size = Buffer.byteLength(char, "utf8");
		if (bytes > 0 && bytes + size > DATA_INPUT_CHUNK_BYTES) {
			chunks.push(data.slice(start, index));
			start = index;
			bytes = 0;
		}
		bytes += size;
		if (char.length === 2) index += 1;
	}
	if (start < data.length) chunks.push(data.slice(start));
	return chunks;
}
async function createNodeRelayBackend(params) {
	let resolveDispatchReady;
	const dispatchReady = new Promise((resolve) => {
		resolveDispatchReady = resolve;
	});
	let dataCallback;
	let exitCallback;
	const pendingData = new BoundedBuffer(MAX_PENDING_DATA_CHARS, {
		mode: "drop-oldest",
		fit: surrogateSafeTail
	}, (chunk) => chunk.length);
	let pendingExit;
	const abort = new AbortController();
	const result = params.registry.invoke({
		nodeId: params.nodeId,
		expectedConnId: params.expectedConnId,
		...params.expectedPairingGeneration ? { expectedPairingGeneration: params.expectedPairingGeneration } : {},
		command: params.command,
		params: params.params,
		timeoutMs: 0,
		idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
		signal: abort.signal,
		onDispatchReady: resolveDispatchReady,
		onProgress: (chunk) => {
			if (!chunk) return;
			if (dataCallback) dataCallback(chunk);
			else pendingData.push(chunk);
		}
	}).then(parseExit).catch((error) => ({ error: error instanceof Error ? error.message : String(error) })).then((exit) => {
		if (exitCallback) exitCallback(exit);
		else pendingExit = exit;
		return exit;
	});
	const activeInvokeId = await Promise.race([dispatchReady, result.then((exit) => {
		throw new Error(exit.error ?? "failed to start node terminal invoke");
	})]);
	const send = (payload) => params.registry.sendInvokeInput(activeInvokeId, payload);
	return {
		write(data) {
			for (const chunk of splitInput(data)) send({
				kind: "data",
				data: chunk
			});
		},
		resize(cols, rows) {
			send({
				kind: "resize",
				cols,
				rows
			});
		},
		pause() {},
		resume() {},
		kill() {
			abort.abort();
		},
		onData(callback) {
			dataCallback = callback;
			for (const chunk of pendingData.drain()) callback(chunk);
		},
		onExit(callback) {
			exitCallback = callback;
			if (pendingExit) {
				const exit = pendingExit;
				pendingExit = void 0;
				callback(exit);
			}
		}
	};
}
//#endregion
//#region src/gateway/terminal/open-deadline.ts
const TERMINAL_OPEN_DEADLINE_MS = 3e4;
var TerminalOpenDeadlineError = class extends Error {
	constructor() {
		super("terminal open timed out");
		this.name = "TerminalOpenDeadlineError";
	}
};
function createTerminalOpenDeadline() {
	return {
		expiresAtMs: Date.now() + TERMINAL_OPEN_DEADLINE_MS,
		controller: new AbortController()
	};
}
function expireTerminalOpenDeadline(deadline) {
	if (!deadline.controller.signal.aborted) deadline.controller.abort(new TerminalOpenDeadlineError());
	return toErrorObject(deadline.controller.signal.reason, "Terminal open timed out");
}
async function waitForTerminalOpenDeadline(run, deadline) {
	if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) throw expireTerminalOpenDeadline(deadline);
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timer);
			reject(expireTerminalOpenDeadline(deadline));
		};
		const timer = setTimeout(() => expireTerminalOpenDeadline(deadline), Math.max(0, deadline.expiresAtMs - Date.now()));
		deadline.controller.signal.addEventListener("abort", onAbort, { once: true });
		let promise;
		try {
			promise = run();
		} catch (error) {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
			return;
		}
		promise.then((value) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
		});
	});
}
//#endregion
//#region src/gateway/server-methods/terminal-open-plan.ts
function authorizeTerminalNodeCommand(context, nodeId, command) {
	const node = context.nodeRegistry.get(nodeId);
	if (!node) return {
		ok: false,
		message: "terminal node is not connected"
	};
	if (!node.commands.includes(command)) return {
		ok: false,
		message: "terminal node command is not available"
	};
	const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
		...node,
		approvedCommands: node.commands
	});
	const allowed = isNodeCommandAllowed({
		command,
		declaredCommands: node.commands,
		allowlist
	});
	return allowed.ok ? {
		ok: true,
		node
	} : {
		ok: false,
		message: allowed.reason
	};
}
function authorizeCatalogTerminalNode(context, plan) {
	return authorizeTerminalNodeCommand(context, plan.nodeId, plan.command);
}
function resolveTerminalOpenSpawnPlan(launchPlan, catalogPlan) {
	if (!catalogPlan) return resolveTerminalSpawnPlan(launchPlan);
	if (catalogPlan.kind === "local") return resolveTerminalSpawnPlan({
		...launchPlan,
		initialCommand: catalogPlan.argv,
		cwdOverride: catalogPlan.cwd
	});
	return {
		agentId: launchPlan.agentId,
		cwd: catalogPlan.cwd ?? launchPlan.cwd,
		shell: catalogPlan.title ?? catalogPlan.command,
		args: []
	};
}
//#endregion
//#region src/gateway/server-methods/terminal-upload.ts
function invalid$1(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
const terminalUploadHandlers = { "terminal.upload": async (opts) => {
	const { params, respond, context } = opts;
	if (!assertValidParams(params, validateTerminalUploadParams, "terminal.upload", respond)) return;
	const connId = opts.client?.connId;
	if (!connId) {
		invalid$1(respond, "terminal requires an authenticated connection");
		return;
	}
	const p = params;
	if (!isCanonicalTerminalUploadBase64(p.contentBase64)) {
		invalid$1(respond, "invalid terminal.upload base64 content");
		return;
	}
	if (!context.terminalSessions || !context.isTerminalEnabled()) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
		return;
	}
	try {
		const result = await context.terminalSessions.upload(connId, p.sessionId, {
			name: p.name,
			contentBase64: p.contentBase64
		});
		if (!result) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		respond(true, result);
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "terminal upload failed"));
	}
} };
//#endregion
//#region src/gateway/server-methods/terminal.ts
function invalid(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
function requireConnId(opts) {
	const connId = opts.client?.connId;
	if (!connId) {
		invalid(opts.respond, "terminal requires an authenticated connection");
		return null;
	}
	return connId;
}
function terminalEnabled(context) {
	return context.isTerminalEnabled();
}
function terminalFailureMessage(message, hint) {
	return hint ? `${message}; ${hint}` : message;
}
function respondTerminalOpenTimeout(respond, hint) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("terminal open timed out", hint)));
}
function parseNodePayload(payload, payloadJSON) {
	if (!payloadJSON) return payload;
	return safeParseJson(payloadJSON);
}
async function stageNodeTerminalUpload(context, nodeId, file) {
	const access = authorizeTerminalNodeCommand(context, nodeId, NODE_TERMINAL_UPLOAD_COMMAND);
	if (!access.ok) throw new Error(access.message);
	const result = await context.nodeRegistry.invoke({
		nodeId,
		expectedConnId: access.node.connId,
		...access.node.pairingGeneration ? { expectedPairingGeneration: access.node.pairingGeneration } : {},
		command: NODE_TERMINAL_UPLOAD_COMMAND,
		params: file,
		timeoutMs: 12e4
	});
	if (!result.ok) throw new Error(result.error?.message ?? "terminal node upload failed");
	const payload = parseNodePayload(result.payload, result.payloadJSON);
	if (!validateTerminalUploadResult(payload)) throw new Error("terminal node returned an invalid upload result");
	return payload;
}
function respondLaunchBlocked(respond, block, hint) {
	if (block.kind === "disabled") {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("terminal is disabled", hint)));
		return;
	}
	if (block.kind === "unknown-agent") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, terminalFailureMessage(`unknown agent "${block.agentId}"`, hint)));
		return;
	}
	if (block.kind === "owner-required") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, terminalFailureMessage(block.message, hint)));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, terminalFailureMessage(`terminal unavailable: agent "${block.agentId}" runs in a sandbox (mode "${block.mode}"); in-sandbox terminals are not supported yet`, hint)));
}
const CATALOG_TERMINAL_INITIAL_SIZE = {
	cols: 80,
	rows: 24
};
/** Canonical terminal admission and launch path shared by shell, resume, and start RPCs. */
async function openTerminalSession(opts, request) {
	const { respond, context } = opts;
	const connId = requireConnId(opts);
	if (!connId) return;
	const manager = context.terminalSessions;
	if (!manager) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("terminal is not available", request.failureHint)));
		return;
	}
	const launch = context.resolveTerminalLaunchPolicy(request.agentId);
	if (!launch.ok) {
		respondLaunchBlocked(respond, launch.block, request.failureHint);
		return;
	}
	const deadline = createTerminalOpenDeadline();
	let catalogPlan;
	let title;
	let createBackend;
	let nodeRelay;
	let stageUpload;
	if (request.resolveCatalogPlan) {
		const resolveCatalogPlan = request.resolveCatalogPlan;
		try {
			catalogPlan = await waitForTerminalOpenDeadline(() => resolveCatalogPlan(launch.plan.agentId), deadline);
		} catch (error) {
			if (error instanceof TerminalOpenDeadlineError) {
				respondTerminalOpenTimeout(respond, request.failureHint);
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? terminalFailureMessage(error.message, request.failureHint) : terminalFailureMessage(request.catalogFailureMessage ?? "catalog terminal open failed", request.failureHint)));
			return;
		}
		title = catalogPlan.title;
		if (catalogPlan.kind === "local") {
			if (catalogPlan.argv.length === 0) {
				invalid(respond, terminalFailureMessage("catalog terminal plan has no command", request.failureHint));
				return;
			}
		} else {
			const nodeCatalogPlan = catalogPlan;
			const access = authorizeCatalogTerminalNode(context, nodeCatalogPlan);
			if (!access.ok) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage(access.message, request.failureHint)));
				return;
			}
			let nodeParams;
			try {
				const parsed = JSON.parse(catalogPlan.paramsJSON);
				if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid params");
				nodeParams = {
					...parsed,
					cols: request.cols,
					rows: request.rows
				};
			} catch {
				invalid(respond, terminalFailureMessage("catalog terminal plan has invalid params", request.failureHint));
				return;
			}
			let policyResult;
			try {
				policyResult = await waitForTerminalOpenDeadline(() => applyPluginNodeInvokePolicy({
					context,
					client: opts.client,
					nodeSession: access.node,
					command: nodeCatalogPlan.command,
					params: nodeParams
				}), deadline);
			} catch (error) {
				if (error instanceof TerminalOpenDeadlineError) {
					respondTerminalOpenTimeout(respond, request.failureHint);
					return;
				}
				throw error;
			}
			if (policyResult && !policyResult.ok) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage(policyResult.message, request.failureHint)));
				return;
			}
			nodeRelay = {
				plan: nodeCatalogPlan,
				params: nodeParams
			};
			stageUpload = async (file) => await stageNodeTerminalUpload(context, nodeCatalogPlan.nodeId, file);
		}
	}
	if (context.isConnectionActive?.(connId) === false) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("terminal connection closed", request.failureHint)));
		return;
	}
	if (!terminalEnabled(context)) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("terminal is disabled", request.failureHint)));
		return;
	}
	const refreshedLaunch = context.resolveTerminalLaunchPolicy(request.agentId);
	if (!refreshedLaunch.ok) {
		respondLaunchBlocked(respond, refreshedLaunch.block, request.failureHint);
		return;
	}
	let agentOwner;
	if (request.sessionKey) {
		const runtimeConfig = context.getRuntimeConfig();
		const requestedOwner = resolveRequestedSessionAgentId(runtimeConfig, request.sessionKey, refreshedLaunch.plan.agentId);
		if (!requestedOwner.ok) {
			respond(false, void 0, requestedOwner.error);
			return;
		}
		const agentSessionKey = resolveStoredSessionKeyForAgentStore({
			cfg: runtimeConfig,
			agentId: requestedOwner.agentId,
			sessionKey: request.sessionKey
		});
		const { entry } = loadGatewaySessionEntryReadOnly(agentSessionKey, {
			agentId: requestedOwner.agentId,
			clone: false
		});
		const agentSessionId = entry?.sessionId?.trim();
		if (!agentSessionId) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("session is no longer available; refresh and retry", request.failureHint)));
			return;
		}
		agentOwner = {
			kind: "agent",
			agentSessionKey,
			agentSessionId,
			agentId: requestedOwner.agentId
		};
	}
	if (nodeRelay) {
		const relay = nodeRelay;
		const access = authorizeCatalogTerminalNode(context, relay.plan);
		if (!access.ok) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage(access.message, request.failureHint)));
			return;
		}
		createBackend = async () => await createNodeRelayBackend({
			registry: context.nodeRegistry,
			nodeId: relay.plan.nodeId,
			expectedConnId: access.node.connId,
			expectedPairingGeneration: access.node.pairingGeneration,
			command: relay.plan.command,
			params: relay.params
		});
	}
	const spawnPlan = resolveTerminalOpenSpawnPlan(refreshedLaunch.plan, catalogPlan);
	if (request.requiredCwd !== void 0 && spawnPlan.cwd !== request.requiredCwd) {
		invalid(respond, terminalFailureMessage("cwd is no longer available; recreate or choose the worktree and retry", request.failureHint));
		return;
	}
	const terminalEnv = catalogPlan?.kind === "local" ? mergeProcessEnv([
		buildTerminalEnv(process.env),
		catalogPlan.env,
		catalogPlan.pathEnv ? { PATH: catalogPlan.pathEnv } : void 0
	]) : buildTerminalEnv(process.env);
	const closeOpenedSession = (sessionId) => agentOwner ? manager.closeAgent(agentOwner, sessionId) : manager.close(connId, sessionId);
	let openingTerminal;
	let outcome;
	try {
		outcome = await waitForTerminalOpenDeadline(() => {
			openingTerminal = manager.open({
				owner: agentOwner ?? {
					kind: "conn",
					connId
				},
				...agentOwner ? { viewerConnId: connId } : {},
				agentId: spawnPlan.agentId,
				cwd: spawnPlan.cwd,
				shell: spawnPlan.shell,
				args: spawnPlan.args,
				cols: request.cols,
				rows: request.rows,
				env: terminalEnv,
				signal: deadline.controller.signal,
				...createBackend ? { createBackend } : {},
				...stageUpload ? { stageUpload } : {}
			});
			return openingTerminal;
		}, deadline);
	} catch (error) {
		if (error instanceof TerminalOpenDeadlineError) {
			if (openingTerminal) openingTerminal.then((lateOutcome) => {
				if (lateOutcome.ok) closeOpenedSession(lateOutcome.sessionId);
			}, () => void 0);
			respondTerminalOpenTimeout(respond, request.failureHint);
			return;
		}
		throw error;
	}
	if (!outcome.ok) {
		respond(false, void 0, errorShape(outcome.code === "limit" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, terminalFailureMessage(outcome.message, request.failureHint)));
		return;
	}
	if (context.isConnectionActive?.(connId) === false) {
		closeOpenedSession(outcome.sessionId);
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("terminal connection closed", request.failureHint)));
		return;
	}
	context.logGateway.info(`terminal opened session=${outcome.sessionId} agent=${outcome.agentId} conn=${connId} shell=${outcome.shell}`);
	respond(true, {
		sessionId: outcome.sessionId,
		agentId: outcome.agentId,
		shell: outcome.shell,
		cwd: outcome.cwd,
		confined: false,
		...title ? { title } : {}
	});
}
/** Handlers for the operator terminal method family. */
const terminalHandlers = {
	...terminalUploadHandlers,
	"terminal.open": async (opts) => {
		const { params, respond } = opts;
		if (!assertValidParams(params, validateTerminalOpenParams, "terminal.open", respond)) return;
		const p = params;
		let resolveCatalogPlan;
		if (p.catalog) {
			const provider = resolveSessionCatalogProvider(p.catalog.catalogId);
			if (!provider) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${p.catalog.catalogId}`));
				return;
			}
			if (!provider.openTerminal) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session catalog cannot open terminals"));
				return;
			}
			const openTerminal = provider.openTerminal;
			const catalog = p.catalog;
			resolveCatalogPlan = async (agentId) => await openTerminal.call(provider, {
				allowProcessHomeFallback: allowsProcessHomeSessionScan(),
				agentId,
				hostId: catalog.hostId,
				threadId: catalog.threadId
			});
		}
		await openTerminalSession(opts, {
			...p.agentId ? { agentId: p.agentId } : {},
			...p.sessionKey ? { sessionKey: p.sessionKey } : {},
			cols: p.cols,
			rows: p.rows,
			...resolveCatalogPlan ? { resolveCatalogPlan } : {},
			catalogFailureMessage: "catalog terminal open failed"
		});
	},
	"terminal.input": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalInputParams, "terminal.input", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.write(connId, p.sessionId, p.data) ?? false });
	},
	"terminal.resize": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalResizeParams, "terminal.resize", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.resize(connId, p.sessionId, p.cols, p.rows) ?? false });
	},
	"terminal.close": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalCloseParams, "terminal.close", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		respond(true, { ok: context.terminalSessions?.close(connId, p.sessionId) ?? false });
	},
	"terminal.attach": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalAttachParams, "terminal.attach", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!context.terminalSessions || !terminalEnabled(context)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const attached = context.terminalSessions.attach(connId, p.sessionId);
		if (!attached) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		context.logGateway.info(`terminal attached session=${attached.sessionId} agent=${attached.agentId} conn=${connId}`);
		const supportsOffsetSeq = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_OFFSET_SEQ);
		respond(true, {
			sessionId: attached.sessionId,
			agentId: attached.agentId,
			shell: attached.shell,
			cwd: attached.cwd,
			confined: false,
			buffer: attached.buffer,
			...supportsOffsetSeq ? { seq: attached.seq } : {}
		});
	},
	"terminal.list": async (opts) => {
		const { respond, context } = opts;
		if (!requireConnId(opts)) return;
		respond(true, { sessions: context.terminalSessions && terminalEnabled(context) ? context.terminalSessions.list().map((session) => ({
			sessionId: session.sessionId,
			agentId: session.agentId,
			shell: session.shell,
			cwd: session.cwd,
			confined: false,
			attached: session.attached,
			owner: session.owner,
			createdAtMs: session.createdAtMs
		})) : [] });
	}
};
//#endregion
export { CATALOG_TERMINAL_INITIAL_SIZE, openTerminalSession, terminalHandlers };
