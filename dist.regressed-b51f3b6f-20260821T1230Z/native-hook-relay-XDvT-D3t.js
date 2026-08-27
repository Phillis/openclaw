import { h as readNonEmptyStringPreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { D as resolveExpiresAtMsFromDurationMs, n as MAX_TIMER_TIMEOUT_MS, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import "./errors-CSNUPl5U.js";
import { r as stripAnsi } from "./ansi-DjDeieuH.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BixM8L1u.js";
import { g as normalizeToolPolicyName } from "./tool-policy-CWmnHLY1.js";
import { f as getAgentToolResultMiddlewareMatcherScope, p as listAgentToolResultMiddlewares } from "./loader-lwogLCXu.js";
import { l as mergePluginToolMatcherScopes, r as hasGlobalHooks, s as getToolHookMatcherScope, y as getGlobalHookRunnerRegistry } from "./hook-runner-global-IYtayVps.js";
import { B as getTrustedToolPolicyMatcherScope, H as requestDeferredPluginToolApproval, V as cancelDeferredPluginToolApproval, b as runBeforeToolCallHook, ct as PluginApprovalResolutions, y as hasBeforeToolCallPolicy } from "./agent-tools.before-tool-call-BzRsADjV.js";
import "./types-DQ1qMLz0.js";
import { l as payloadTextResult } from "./common-BGOZLJ2_.js";
import { t as callGatewayTool } from "./gateway-O0XoIBU1.js";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-B9fJlULF.js";
import { i as runAgentHarnessBeforeAgentFinalizeHook } from "./lifecycle-hook-helpers-BIigCxgL.js";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-BgNE3Q6o.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-Mtb_s-wH.js";
import { n as retainBeforeToolCallForNativeHookRelay } from "./host-capability-CyXWwkXk.js";
import { t as isApprovalNotFoundError } from "./approval-errors-Bzw_-cAg.js";
import { _ as codexNativeHookRelayResponseCodec, c as normalizeOptionalPositiveInteger, d as readNativeHookRelayProvider, f as readNonEmptyString, g as truncateRelayText, h as snapshotNativeHookRelayPayload, i as isRetryableNativeHookRelayBridgeLookupError, l as normalizePositiveInteger, m as shellQuoteArgs, o as isJsonObject, p as readOptionalBoolean, r as isNativeHookRelayBridgeStaleRegistrationError, s as isJsonValue, t as NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR, u as readNativeHookRelayEvent, v as DEFAULT_RELAY_TIMEOUT_MS, y as readNativeHookRelayBridgeRecordRow } from "./native-hook-relay-client-DZNBM_ak.js";
import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
//#region src/agents/harness/native-hook-relay-state.ts
const NATIVE_HOOK_RELAY_STATE_SYMBOL = Symbol.for("openclaw.nativeHookRelay.state");
function getNativeHookRelaySharedState() {
	const globalRecord = globalThis;
	globalRecord[NATIVE_HOOK_RELAY_STATE_SYMBOL] ??= {
		relays: /* @__PURE__ */ new Map(),
		relayBridges: /* @__PURE__ */ new Map(),
		invocations: [],
		pendingPermissionApprovals: /* @__PURE__ */ new Map(),
		pendingPreToolUseApprovals: /* @__PURE__ */ new Map(),
		permissionApprovalWindows: /* @__PURE__ */ new Map(),
		permissionAllowAlwaysApprovals: /* @__PURE__ */ new Map()
	};
	return globalRecord[NATIVE_HOOK_RELAY_STATE_SYMBOL];
}
const nativeHookRelayState = getNativeHookRelaySharedState();
//#endregion
//#region src/agents/harness/native-hook-relay-store.ts
function readNativeHookRelayBridgeSnapshot(row) {
	const record = readNativeHookRelayBridgeRecordRow(row);
	if (!record || !row || !Number.isSafeInteger(row.updated_at_ms)) return;
	return {
		record,
		updatedAtMs: row.updated_at_ms
	};
}
function readNativeHookRelayBridgeSnapshotFromDatabase(params) {
	const db = getNodeSqliteKysely(params.database.db);
	return readNativeHookRelayBridgeSnapshot(executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("native_hook_relay_bridges").selectAll().where("relay_id", "=", params.relayId)));
}
function sameNativeHookRelayBridgeSnapshot(left, right) {
	return left.updatedAtMs === right.updatedAtMs && left.record.relayId === right.record.relayId && left.record.pid === right.record.pid && left.record.hostname === right.record.hostname && left.record.port === right.record.port && left.record.token === right.record.token && left.record.expiresAtMs === right.record.expiresAtMs;
}
function readNativeHookRelayBridgeRecord(params) {
	return withOpenClawStateDatabaseReadOnly((database) => readNativeHookRelayBridgeSnapshotFromDatabase({
		database,
		relayId: params.relayId
	})?.record, { path: params.stateDbPath });
}
function writeNativeHookRelayBridgeRecord(params) {
	const updatedAtMs = params.updatedAtMs ?? Date.now();
	const record = params.record;
	const { token } = record;
	runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("native_hook_relay_bridges").values({
			relay_id: record.relayId,
			pid: record.pid,
			hostname: record.hostname,
			port: record.port,
			token,
			expires_at_ms: record.expiresAtMs,
			updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("relay_id").doUpdateSet({
			pid: record.pid,
			hostname: record.hostname,
			port: record.port,
			token,
			expires_at_ms: record.expiresAtMs,
			updated_at_ms: updatedAtMs
		})));
	}, { path: params.stateDbPath });
}
function renewOrRestoreNativeHookRelayBridgeRecord(params) {
	const { record } = params;
	const { token } = record;
	const updatedAtMs = params.updatedAtMs ?? Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const current = readNativeHookRelayBridgeSnapshotFromDatabase({
			database,
			relayId: record.relayId
		});
		if (!current) return executeSqliteQuerySync(database.db, db.insertInto("native_hook_relay_bridges").values({
			relay_id: record.relayId,
			pid: record.pid,
			hostname: record.hostname,
			port: record.port,
			token,
			expires_at_ms: record.expiresAtMs,
			updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("relay_id").doNothing())).numAffectedRows === 1n;
		if (current.record.pid !== record.pid || current.record.token !== token) return false;
		return executeSqliteQuerySync(database.db, db.updateTable("native_hook_relay_bridges").set({
			hostname: record.hostname,
			port: record.port,
			expires_at_ms: record.expiresAtMs,
			updated_at_ms: updatedAtMs
		}).where("relay_id", "=", record.relayId).where("pid", "=", record.pid).where("token", "=", token).where("updated_at_ms", "=", current.updatedAtMs)).numAffectedRows === 1n;
	}, { path: params.stateDbPath });
}
function deleteNativeHookRelayBridgeRecordIfOwned(params) {
	return runOpenClawStateWriteTransaction((database) => {
		const current = readNativeHookRelayBridgeSnapshotFromDatabase({
			database,
			relayId: params.relayId
		});
		if (!current || current.record.pid !== params.pid || current.record.token !== params.token) return false;
		const db = getNodeSqliteKysely(database.db);
		return executeSqliteQuerySync(database.db, db.deleteFrom("native_hook_relay_bridges").where("relay_id", "=", params.relayId).where("pid", "=", params.pid).where("token", "=", params.token).where("updated_at_ms", "=", current.updatedAtMs)).numAffectedRows === 1n;
	}, { path: params.stateDbPath });
}
function pruneNativeHookRelayBridgeRecords(params) {
	const nowMs = params.nowMs ?? Date.now();
	const database = openOpenClawStateDatabase({ path: params.stateDbPath });
	const db = getNodeSqliteKysely(database.db);
	const snapshots = executeSqliteQuerySync(database.db, db.selectFrom("native_hook_relay_bridges").selectAll()).rows.flatMap((row) => {
		const snapshot = readNativeHookRelayBridgeSnapshot(row);
		return snapshot ? [snapshot] : [];
	});
	const candidates = [];
	for (const snapshot of snapshots) {
		if (nowMs > snapshot.record.expiresAtMs) {
			candidates.push({
				snapshot,
				reason: "expired"
			});
			continue;
		}
		if (snapshot.record.pid !== params.currentPid && params.isPidDead(snapshot.record.pid)) candidates.push({
			snapshot,
			reason: "dead-pid"
		});
	}
	if (candidates.length === 0) return [];
	return runOpenClawStateWriteTransaction((writeDatabase) => {
		const writeDb = getNodeSqliteKysely(writeDatabase.db);
		const pruned = [];
		for (const candidate of candidates) {
			const current = readNativeHookRelayBridgeSnapshotFromDatabase({
				database: writeDatabase,
				relayId: candidate.snapshot.record.relayId
			});
			if (!current || !sameNativeHookRelayBridgeSnapshot(current, candidate.snapshot) || candidate.reason === "expired" && nowMs <= current.record.expiresAtMs) continue;
			if (executeSqliteQuerySync(writeDatabase.db, writeDb.deleteFrom("native_hook_relay_bridges").where("relay_id", "=", current.record.relayId).where("token", "=", current.record.token).where("updated_at_ms", "=", current.updatedAtMs)).numAffectedRows === 1n) pruned.push({
				relayId: current.record.relayId,
				pid: current.record.pid,
				reason: candidate.reason
			});
		}
		return pruned;
	}, { path: params.stateDbPath });
}
function clearNativeHookRelayBridgeRecordsForTests(options = {}) {
	runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.deleteFrom("native_hook_relay_bridges"));
	}, { path: options.stateDbPath });
}
//#endregion
//#region src/agents/harness/native-hook-relay-bridge.ts
const MAX_NATIVE_HOOK_BRIDGE_BODY_BYTES = 5e6;
const log$2 = createSubsystemLogger("agents/harness/native-hook-relay");
const { relays: relays$1, relayBridges: relayBridges$1 } = nativeHookRelayState;
function isNativeHookRelayBridgePidDead(pid) {
	try {
		process.kill(pid, 0);
		return false;
	} catch (error) {
		return typeof error === "object" && error !== null && "code" in error && error.code === "ESRCH";
	}
}
function registerNativeHookRelayBridge(registration, stateDbPath, invokeRelay) {
	try {
		const pruned = pruneNativeHookRelayBridgeRecords({
			currentPid: process.pid,
			isPidDead: isNativeHookRelayBridgePidDead,
			stateDbPath
		});
		for (const row of pruned) log$2.debug("pruned stale native hook relay bridge record", {
			relayId: row.relayId,
			stalePid: row.pid,
			currentPid: process.pid,
			reason: row.reason
		});
	} catch (error) {
		log$2.debug("native hook relay bridge record prune skipped", { error });
	}
	unregisterNativeHookRelayBridge(registration.relayId);
	const token = randomUUID();
	const server = createServer();
	const bridge = {
		relayId: registration.relayId,
		stateDbPath,
		token,
		server
	};
	server.on("request", (req, res) => {
		handleNativeHookRelayBridgeRequest(req, res, {
			provider: registration.provider,
			relayId: registration.relayId,
			token,
			registration,
			bridge,
			invokeRelay
		});
	});
	relayBridges$1.set(registration.relayId, bridge);
	server.on("error", (error) => {
		log$2.debug("native hook relay bridge server error", {
			error,
			relayId: registration.relayId
		});
	});
	server.listen(0, "127.0.0.1", () => {
		if (relayBridges$1.get(registration.relayId) !== bridge) return;
		try {
			writeNativeHookRelayBridgeRecordForRegistration(registration, bridge);
		} catch (error) {
			log$2.debug("failed to publish native hook relay bridge record", {
				error,
				relayId: registration.relayId
			});
		}
	});
	server.unref();
}
function writeNativeHookRelayBridgeRecordForRegistration(registration, bridge) {
	const record = resolveNativeHookRelayBridgeRecord(registration, bridge);
	if (!record) return;
	writeNativeHookRelayBridgeRecord({
		record,
		stateDbPath: bridge.stateDbPath
	});
}
function resolveNativeHookRelayBridgeRecord(registration, bridge, expiresAtMs = registration.expiresAtMs) {
	const address = bridge.server.address();
	if (!address || typeof address === "string") {
		log$2.debug("native hook relay bridge server address unavailable", { relayId: registration.relayId });
		return;
	}
	return {
		relayId: registration.relayId,
		pid: process.pid,
		hostname: "127.0.0.1",
		port: address.port,
		token: bridge.token,
		expiresAtMs
	};
}
function renewNativeHookRelayBridgeRecord(registration, bridge, expiresAtMs) {
	const record = resolveNativeHookRelayBridgeRecord(registration, bridge, expiresAtMs);
	if (!record) return "unavailable";
	return renewOrRestoreNativeHookRelayBridgeRecord({
		record,
		stateDbPath: bridge.stateDbPath
	}) ? "renewed" : "ownership-changed";
}
function unregisterNativeHookRelayBridge(relayId, options) {
	const bridge = options?.expectedBridge ?? relayBridges$1.get(relayId);
	if (!bridge) return;
	if (relayBridges$1.get(relayId) === bridge) relayBridges$1.delete(relayId);
	bridge.server.close();
	const removeRecord = () => {
		try {
			deleteNativeHookRelayBridgeRecordIfOwned({
				...bridge,
				pid: process.pid
			});
		} catch (error) {
			log$2.debug("failed to remove native hook relay bridge record", {
				error,
				relayId
			});
		}
	};
	const deferBridgeRecordRemovalMs = normalizePositiveInteger(options?.deferBridgeRecordRemovalMs, 0);
	if (deferBridgeRecordRemovalMs > 0) {
		setTimeout(removeRecord, deferBridgeRecordRemovalMs).unref();
		return;
	}
	removeRecord();
}
async function handleNativeHookRelayBridgeRequest(req, res, auth) {
	try {
		if (req.method !== "POST" || req.url !== "/invoke") {
			writeNativeHookRelayBridgeJson(res, 404, {
				ok: false,
				error: "not found"
			});
			return;
		}
		if (req.headers.authorization !== `Bearer ${auth.token}`) {
			writeNativeHookRelayBridgeJson(res, 403, {
				ok: false,
				error: "forbidden"
			});
			return;
		}
		if (!isCurrentNativeHookRelayBridgeRequest(auth)) {
			writeNativeHookRelayBridgeJson(res, 410, {
				ok: false,
				error: NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR
			});
			return;
		}
		const body = await readNativeHookRelayBridgeBody(req);
		const payload = readNativeHookRelayBridgePayload(JSON.parse(body));
		if (payload.provider !== auth.provider || payload.relayId !== auth.relayId) {
			writeNativeHookRelayBridgeJson(res, 403, {
				ok: false,
				error: "native hook relay bridge target mismatch"
			});
			return;
		}
		if (!isCurrentNativeHookRelayBridgeRequest(auth)) {
			writeNativeHookRelayBridgeJson(res, 410, {
				ok: false,
				error: NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR
			});
			return;
		}
		writeNativeHookRelayBridgeJson(res, 200, {
			ok: true,
			result: await auth.invokeRelay({
				...payload,
				requireGeneration: true
			})
		});
	} catch (error) {
		writeNativeHookRelayBridgeJson(res, isNativeHookRelayBridgeStaleRegistrationError(error) ? 410 : 500, {
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		});
	}
}
function isCurrentNativeHookRelayBridgeRequest(auth) {
	return relays$1.get(auth.relayId) === auth.registration && relayBridges$1.get(auth.relayId) === auth.bridge;
}
async function readNativeHookRelayBridgeBody(req) {
	const chunks = [];
	let total = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		total += buffer.byteLength;
		if (total > MAX_NATIVE_HOOK_BRIDGE_BODY_BYTES) throw new Error("native hook relay bridge payload too large");
		chunks.push(buffer);
	}
	return Buffer.concat(chunks, total).toString("utf8");
}
function readNativeHookRelayBridgePayload(value) {
	if (!isJsonObject(value)) throw new Error("native hook relay bridge payload must be an object");
	return {
		provider: value.provider,
		relayId: value.relayId,
		generation: readNonEmptyString(value.generation, "generation"),
		event: value.event,
		rawPayload: value.rawPayload
	};
}
function writeNativeHookRelayBridgeJson(res, statusCode, payload) {
	const body = JSON.stringify(payload);
	res.writeHead(statusCode, {
		"content-type": "application/json",
		"content-length": Buffer.byteLength(body)
	});
	res.end(body);
}
function readNativeHookRelayBridgeRecordIfExists(relayId, stateDbPath) {
	try {
		return readNativeHookRelayBridgeRecord({
			relayId,
			stateDbPath
		});
	} catch (error) {
		log$2.debug("failed to read native hook relay bridge record", {
			error,
			relayId
		});
	}
}
function clearNativeHookRelayBridgesForTests() {
	for (const relayId of relayBridges$1.keys()) unregisterNativeHookRelayBridge(relayId);
	clearNativeHookRelayBridgeRecordsForTests();
}
//#endregion
//#region src/agents/harness/native-hook-relay-codec.ts
const CODEX_NATIVE_HOOK_TOOL_NAME_ALIASES = {
	exec_command: "exec",
	write: "apply_patch",
	edit: "apply_patch",
	agent: "spawn_agent"
};
const nativeHookRelayProviderAdapters = { codex: {
	normalizeMetadata: normalizeCodexHookMetadata,
	readToolInput: readCodexToolInput,
	readToolResponse: readCodexToolResponse,
	...codexNativeHookRelayResponseCodec,
	renderBeforeAgentFinalizeReviseResponse: (reason) => ({
		stdout: `${JSON.stringify({
			decision: "block",
			reason
		})}\n`,
		stderr: "",
		exitCode: 0
	}),
	renderBeforeAgentFinalizeStopResponse: (reason) => ({
		stdout: `${JSON.stringify({
			continue: false,
			...reason?.trim() ? { stopReason: reason.trim() } : {}
		})}\n`,
		stderr: "",
		exitCode: 0
	})
} };
function getNativeHookRelayProviderAdapter(provider) {
	return nativeHookRelayProviderAdapters[provider];
}
function normalizeNativeHookInvocation(params) {
	const metadata = getNativeHookRelayProviderAdapter(params.registration.provider).normalizeMetadata(params.rawPayload);
	return {
		provider: params.registration.provider,
		relayId: params.registration.relayId,
		event: params.event,
		...metadata,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId,
		rawPayload: params.rawPayload,
		receivedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function normalizeCodexHookMetadata(rawPayload) {
	const payload = isJsonObject(rawPayload) ? rawPayload : {};
	const metadata = {};
	const nativeEventName = readNonEmptyStringPreservingWhitespace(payload.hook_event_name);
	if (nativeEventName) metadata.nativeEventName = nativeEventName;
	const cwd = readNonEmptyStringPreservingWhitespace(payload.cwd);
	if (cwd) metadata.cwd = cwd;
	const model = readNonEmptyStringPreservingWhitespace(payload.model);
	if (model) metadata.model = model;
	const turnId = readNonEmptyStringPreservingWhitespace(payload.turn_id);
	if (turnId) metadata.turnId = turnId;
	const transcriptPath = readNonEmptyStringPreservingWhitespace(payload.transcript_path);
	if (transcriptPath) metadata.transcriptPath = transcriptPath;
	const permissionMode = readNonEmptyStringPreservingWhitespace(payload.permission_mode);
	if (permissionMode) metadata.permissionMode = permissionMode;
	const stopHookActive = readOptionalBoolean(payload.stop_hook_active);
	if (stopHookActive !== void 0) metadata.stopHookActive = stopHookActive;
	const lastAssistantMessage = readNonEmptyStringPreservingWhitespace(payload.last_assistant_message);
	if (lastAssistantMessage) metadata.lastAssistantMessage = lastAssistantMessage;
	const toolName = readNonEmptyStringPreservingWhitespace(payload.tool_name);
	if (toolName) metadata.toolName = toolName;
	const toolUseId = readNonEmptyStringPreservingWhitespace(payload.tool_use_id);
	if (toolUseId) metadata.toolUseId = toolUseId;
	return metadata;
}
function readCodexToolInput(rawPayload) {
	const payload = isJsonObject(rawPayload) ? rawPayload : {};
	const toolInput = payload.tool_input;
	if (isJsonObject(toolInput)) return normalizeCodexToolInput(normalizeNativeHookToolName(readNonEmptyStringPreservingWhitespace(payload.tool_name)), toolInput);
	if (toolInput === void 0) return {};
	return { value: toolInput };
}
function normalizeCodexToolInput(toolName, toolInput) {
	const command = normalizeCodexCommand(toolInput.cmd);
	if (toolName !== "exec" || command === void 0) return toolInput;
	return {
		...toolInput,
		command
	};
}
function normalizeCodexCommand(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value) && value.every((part) => typeof part === "string")) return shellQuoteArgs(value);
}
function nativeHookRelayParamsWereRewritten(originalFingerprint, candidate) {
	if (candidate === void 0) return false;
	return stableStringify(candidate) !== originalFingerprint;
}
function readCodexToolResponse(rawPayload) {
	return (isJsonObject(rawPayload) ? rawPayload : {}).tool_response;
}
function readNativeHookRelayApprovalMode(rawPayload) {
	return (isJsonObject(rawPayload) ? rawPayload : {}).openclaw_approval_mode === "report" ? "report" : void 0;
}
function normalizeNativeHookToolName(toolName) {
	const normalized = normalizeToolPolicyName(toolName ?? "tool");
	return CODEX_NATIVE_HOOK_TOOL_NAME_ALIASES[normalized] ?? normalized;
}
//#endregion
//#region src/agents/harness/native-hook-relay-command.ts
function resolveNativeHookRelayNicePrefix(value) {
	if (process.platform === "win32" || value === false || value === void 0) return [];
	const nice = normalizePositiveInteger(value, 0);
	if (nice <= 0) return [];
	return [
		"nice",
		"-n",
		String(nice)
	];
}
function resolveNativeHookRelayCommandTimeoutMs(configuredTimeoutMs, overrideTimeoutMs) {
	const configured = normalizeOptionalPositiveInteger(configuredTimeoutMs);
	const override = normalizeOptionalPositiveInteger(overrideTimeoutMs);
	if (configured === void 0) return override;
	if (override === void 0) return configured;
	return Math.min(configured, override);
}
function buildNativeHookRelayCommand(params) {
	return buildNativeHookRelayCommandWithStateDatabase(params);
}
function buildNativeHookRelayCommandWithStateDatabase(params) {
	const timeoutMs = normalizePositiveInteger(params.timeoutMs, DEFAULT_RELAY_TIMEOUT_MS);
	const executable = params.executable ?? resolveOpenClawCliExecutable();
	const argv = executable === "openclaw" ? ["openclaw"] : [params.nodeExecutable ?? process.execPath, executable];
	const command = shellQuoteArgs([
		...resolveNativeHookRelayNicePrefix(params.nice),
		...argv,
		"hooks",
		"relay",
		"--provider",
		params.provider,
		"--relay-id",
		params.relayId,
		...params.stateDbPath ? ["--state-db", params.stateDbPath] : [],
		...params.generation ? ["--generation", params.generation] : [],
		"--event",
		params.event,
		...params.event === "pre_tool_use" && params.preToolUseUnavailable ? ["--pre-tool-use-unavailable", params.preToolUseUnavailable] : [],
		"--timeout",
		String(timeoutMs)
	]);
	return process.platform === "win32" ? command : `exec ${command}`;
}
function resolveOpenClawCliExecutable() {
	const envPath = process.env.OPENCLAW_CLI_PATH?.trim();
	if (envPath && existsSync(envPath)) return envPath;
	const packageRoot = resolveOpenClawPackageRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (packageRoot) {
		for (const candidate of [
			path.join(packageRoot, "openclaw.mjs"),
			path.join(packageRoot, "dist", "entry.js"),
			path.join(packageRoot, "scripts", "run-node.mjs")
		]) if (existsSync(candidate)) return candidate;
	}
	const argvEntry = process.argv[1];
	if (argvEntry) {
		const resolved = path.resolve(argvEntry);
		if (existsSync(resolved)) return resolved;
	}
	throw new Error("Cannot resolve OpenClaw CLI executable path for native hook relay");
}
//#endregion
//#region src/agents/harness/native-hook-relay-permissions.ts
const DEFAULT_PERMISSION_TIMEOUT_MS = 12e4;
const PERMISSION_ALLOW_ALWAYS_TTL_MS = 1800 * 1e3;
const MAX_PERMISSION_FALLBACK_KEYS = 200;
const MAX_PERMISSION_FALLBACK_KEY_CHARS = 240;
const MAX_PERMISSION_FINGERPRINT_SORT_KEYS = 200;
const MAX_APPROVAL_TITLE_LENGTH = 80;
const MAX_APPROVAL_DESCRIPTION_LENGTH = 700;
const MAX_PERMISSION_APPROVALS_PER_WINDOW = 12;
const PERMISSION_APPROVAL_WINDOW_MS = 6e4;
const MAX_PERMISSION_ALLOW_ALWAYS_ENTRIES = 512;
const log$1 = createSubsystemLogger("agents/harness/native-hook-relay");
const { pendingPermissionApprovals, pendingPreToolUseApprovals, permissionApprovalWindows, permissionAllowAlwaysApprovals } = nativeHookRelayState;
let nativeHookRelayPermissionApprovalRequester = requestNativeHookRelayPermissionApproval;
let nativeHookRelayDeferredToolApprovalRequester = requestDeferredPluginToolApproval;
function nativeHookRelayPreToolUseApprovalKey(params) {
	const toolUseId = params.toolUseId?.trim();
	return toolUseId ? `${params.relayId}:${toolUseId}` : void 0;
}
function setNativeHookRelayPreToolUseApproval(params) {
	const key = nativeHookRelayPreToolUseApprovalKey(params);
	if (!key) return false;
	const previousApproval = pendingPreToolUseApprovals.get(key);
	if (previousApproval) cancelDeferredPluginToolApproval(previousApproval.deferredApproval);
	pendingPreToolUseApprovals.set(key, {
		deferredApproval: params.deferredApproval,
		originalParamsFingerprint: params.originalParamsFingerprint
	});
	if (pendingPreToolUseApprovals.size > 200) {
		const oldestKey = pendingPreToolUseApprovals.keys().next().value;
		if (oldestKey) {
			const oldestApproval = pendingPreToolUseApprovals.get(oldestKey);
			if (oldestApproval) cancelDeferredPluginToolApproval(oldestApproval.deferredApproval);
			pendingPreToolUseApprovals.delete(oldestKey);
		}
	}
	return true;
}
function removeNativeHookRelayPreToolUseApprovals(relayId) {
	const prefix = `${relayId}:`;
	for (const [key, pendingApproval] of pendingPreToolUseApprovals) if (key.startsWith(prefix)) {
		cancelDeferredPluginToolApproval(pendingApproval.deferredApproval);
		pendingPreToolUseApprovals.delete(key);
	}
}
async function resolveNativeHookRelayDeferredToolApproval(params) {
	const pendingApprovalKey = nativeHookRelayPreToolUseApprovalKey(params);
	if (!pendingApprovalKey) return;
	const pendingApproval = pendingPreToolUseApprovals.get(pendingApprovalKey);
	if (!pendingApproval) return;
	pendingApproval.resolutionPromise ??= resolveNativeHookRelayPreToolUseApproval(pendingApproval, params.signal).finally(() => {
		if (pendingPreToolUseApprovals.get(pendingApprovalKey) === pendingApproval) pendingPreToolUseApprovals.delete(pendingApprovalKey);
	});
	return pendingApproval.resolutionPromise;
}
async function resolveNativeHookRelayPreToolUseApproval(pendingApproval, signal) {
	const outcome = await nativeHookRelayDeferredToolApprovalRequester({
		deferredApproval: pendingApproval.deferredApproval,
		signal
	});
	if (outcome.blocked) return {
		handled: true,
		outcome: "denied",
		reason: outcome.reason,
		...outcome.kind === "failure" && outcome.disposition !== "blocked" ? { failureDisposition: outcome.disposition } : {}
	};
	if (nativeHookRelayParamsWereRewritten(pendingApproval.originalParamsFingerprint, outcome.params)) return {
		handled: true,
		outcome: "denied",
		reason: "OpenClaw tool policy rewrote Codex app-server approval params; refusing original request."
	};
	return {
		handled: true,
		outcome: "approved-once"
	};
}
async function runNativeHookRelayPermissionRequest(params) {
	const request = {
		provider: params.registration.provider,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId,
		toolName: normalizeNativeHookToolName(params.invocation.toolName),
		...params.invocation.toolUseId ? { toolCallId: params.invocation.toolUseId } : {},
		...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
		...params.invocation.model ? { model: params.invocation.model } : {},
		toolInput: params.adapter.readToolInput(params.invocation.rawPayload),
		...params.registration.signal ? { signal: params.registration.signal } : {}
	};
	const approvalKey = nativeHookRelayPermissionApprovalKey({
		registration: params.registration,
		request
	});
	const allowAlwaysKey = nativeHookRelayPermissionAllowAlwaysKey({
		registration: params.registration,
		request
	});
	if (hasNativeHookRelayPermissionAllowAlways(allowAlwaysKey)) return params.adapter.renderPermissionDecisionResponse("allow");
	const pendingApproval = pendingPermissionApprovals.get(approvalKey);
	try {
		const decision = await (pendingApproval ?? startNativeHookRelayPermissionApprovalWithBudget({
			registration: params.registration,
			approvalKey,
			request
		}));
		if (decision === "allow") return params.adapter.renderPermissionDecisionResponse("allow");
		if (decision === "allow-always") {
			rememberNativeHookRelayPermissionAllowAlways(allowAlwaysKey);
			return params.adapter.renderPermissionDecisionResponse("allow");
		}
		if (decision === "deny") return params.adapter.renderPermissionDecisionResponse("deny", "Denied by user");
	} catch (error) {
		log$1.warn(`native hook permission approval failed; deferring to provider approval path: ${String(error)}`);
	}
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function startNativeHookRelayPermissionApprovalWithBudget(params) {
	if (!consumeNativeHookRelayPermissionBudget(params.registration.relayId)) {
		log$1.warn(`native hook permission approval rate limit exceeded; deferring to provider approval path: relay=${params.registration.relayId} run=${params.registration.runId}`);
		return "defer";
	}
	const approval = nativeHookRelayPermissionApprovalRequester(params.request).finally(() => {
		if (pendingPermissionApprovals.get(params.approvalKey) === approval) pendingPermissionApprovals.delete(params.approvalKey);
	});
	pendingPermissionApprovals.set(params.approvalKey, approval);
	return approval;
}
function nativeHookRelayPermissionApprovalKey(params) {
	return [
		params.registration.relayId,
		params.registration.runId,
		params.request.toolCallId ? `call:${params.request.toolCallId}` : permissionRequestFallbackKey(params.request),
		permissionRequestContentFingerprint(params.request)
	].join(":");
}
function nativeHookRelayPermissionAllowAlwaysKey(params) {
	const hash = createHash("sha256");
	hash.update("openclaw:native-hook-relay:permission-allow-always:v2");
	hash.update("\0");
	hash.update(params.registration.relayId);
	hash.update("\0");
	hash.update(params.request.provider);
	hash.update("\0");
	hash.update(params.request.agentId ?? "");
	hash.update("\0");
	hash.update(params.request.sessionKey ?? params.request.sessionId);
	hash.update("\0");
	hash.update(permissionRequestContentFingerprint(params.request));
	return hash.digest("hex");
}
function permissionRequestFallbackKey(request) {
	const command = readNonEmptyStringPreservingWhitespace(request.toolInput.command);
	if (command) return `${request.toolName}:command:${truncateRelayText(command, 240)}`;
	return `${request.toolName}:keys:${permissionRequestToolInputKeyFingerprint(request.toolInput)}`;
}
function permissionRequestToolInputKeyFingerprintForTests(toolInput) {
	return permissionRequestToolInputKeyFingerprint(toolInput);
}
function permissionRequestToolInputKeyFingerprint(toolInput) {
	let fingerprint = "";
	const { keys, truncated } = readBoundedOwnKeys(toolInput, MAX_PERMISSION_FALLBACK_KEYS);
	for (const key of keys) {
		const separator = fingerprint ? "," : "";
		const remaining = MAX_PERMISSION_FALLBACK_KEY_CHARS - fingerprint.length - separator.length;
		if (remaining <= 0) break;
		fingerprint += `${separator}${key.slice(0, remaining)}`;
	}
	if (truncated && fingerprint.length < MAX_PERMISSION_FALLBACK_KEY_CHARS) fingerprint += `${fingerprint ? "," : ""}...`.slice(0, MAX_PERMISSION_FALLBACK_KEY_CHARS - fingerprint.length);
	return fingerprint || "none";
}
function permissionRequestContentFingerprintForTests(request) {
	return permissionRequestContentFingerprint(request);
}
function permissionRequestContentFingerprint(request) {
	const hash = createHash("sha256");
	hash.update(request.toolName);
	hash.update("\0");
	hash.update(request.cwd ?? "");
	hash.update("\0");
	updateJsonHash(hash, request.toolInput);
	return hash.digest("hex");
}
function updateJsonHash(hash, value) {
	if (value === null) {
		hash.update("null");
		return;
	}
	if (typeof value === "string") {
		hash.update("string:");
		hash.update(JSON.stringify(value));
		return;
	}
	if (typeof value === "number") {
		hash.update(`number:${String(value)}`);
		return;
	}
	if (typeof value === "boolean") {
		hash.update(`boolean:${String(value)}`);
		return;
	}
	if (Array.isArray(value)) {
		hash.update("[");
		for (const item of value) {
			updateJsonHash(hash, item);
			hash.update(",");
		}
		hash.update("]");
		return;
	}
	hash.update("{");
	const { keys, truncated } = readBoundedOwnKeys(value, MAX_PERMISSION_FINGERPRINT_SORT_KEYS);
	for (const key of keys) {
		hash.update(JSON.stringify(key));
		hash.update(":");
		const item = value[key];
		if (item !== void 0) updateJsonHash(hash, item);
		hash.update(",");
	}
	if (truncated) {
		const sortedKeySet = new Set(keys);
		hash.update("#object-tail:");
		for (const key in value) {
			if (!Object.hasOwn(value, key) || sortedKeySet.has(key)) continue;
			hash.update(JSON.stringify(key));
			hash.update(":");
			const item = value[key];
			if (item !== void 0) updateJsonHash(hash, item);
			hash.update(",");
		}
	}
	hash.update("}");
}
function readBoundedOwnKeys(value, maxKeys) {
	const keys = [];
	let truncated = false;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		if (keys.length >= maxKeys) {
			truncated = true;
			break;
		}
		keys.push(key);
	}
	keys.sort();
	return {
		keys,
		truncated
	};
}
function consumeNativeHookRelayPermissionBudget(relayId, now = Date.now()) {
	const windowStart = now - PERMISSION_APPROVAL_WINDOW_MS;
	const timestamps = (permissionApprovalWindows.get(relayId) ?? []).filter((timestamp) => timestamp >= windowStart);
	if (timestamps.length >= MAX_PERMISSION_APPROVALS_PER_WINDOW) {
		permissionApprovalWindows.set(relayId, timestamps);
		return false;
	}
	timestamps.push(now);
	permissionApprovalWindows.set(relayId, timestamps);
	return true;
}
function hasNativeHookRelayPermissionAllowAlways(key, now = Date.now()) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) return false;
	const entry = permissionAllowAlwaysApprovals.get(key);
	if (!entry) return false;
	const expiresAtMs = asDateTimestampMs(entry.expiresAtMs);
	if (expiresAtMs === void 0 || expiresAtMs <= validNow) {
		permissionAllowAlwaysApprovals.delete(key);
		return false;
	}
	return true;
}
function rememberNativeHookRelayPermissionAllowAlways(key, now = Date.now()) {
	pruneNativeHookRelayPermissionAllowAlways(now);
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(PERMISSION_ALLOW_ALWAYS_TTL_MS, { nowMs: now });
	if (expiresAtMs === void 0) return;
	permissionAllowAlwaysApprovals.set(key, { expiresAtMs });
	pruneMapToMaxSize(permissionAllowAlwaysApprovals, MAX_PERMISSION_ALLOW_ALWAYS_ENTRIES);
}
function pruneNativeHookRelayPermissionAllowAlways(now = Date.now()) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) return;
	for (const [key, entry] of permissionAllowAlwaysApprovals) {
		const expiresAtMs = asDateTimestampMs(entry.expiresAtMs);
		if (expiresAtMs === void 0 || expiresAtMs <= validNow) permissionAllowAlwaysApprovals.delete(key);
	}
}
function removeNativeHookRelayPermissionState(relayId) {
	permissionApprovalWindows.delete(relayId);
	for (const key of pendingPermissionApprovals.keys()) if (key.startsWith(`${relayId}:`)) pendingPermissionApprovals.delete(key);
}
async function requestNativeHookRelayPermissionApproval(request) {
	const timeoutMs = DEFAULT_PERMISSION_TIMEOUT_MS;
	const requestResult = await callGatewayTool("plugin.approval.request", { timeoutMs: 13e4 }, {
		pluginId: `openclaw-native-hook-relay-${request.provider}`,
		title: truncateRelayText(`${nativeHookRelayProviderDisplayName(request.provider)} permission request`, MAX_APPROVAL_TITLE_LENGTH),
		description: truncateRelayText(formatPermissionApprovalDescription(request), MAX_APPROVAL_DESCRIPTION_LENGTH),
		severity: "warning",
		toolName: request.toolName,
		toolCallId: request.toolCallId,
		allowedDecisions: [
			PluginApprovalResolutions.ALLOW_ONCE,
			PluginApprovalResolutions.ALLOW_ALWAYS,
			PluginApprovalResolutions.DENY
		],
		agentId: request.agentId,
		sessionKey: request.sessionKey,
		timeoutMs,
		twoPhase: true
	}, { expectFinal: false });
	const approvalId = requestResult?.id;
	if (!approvalId) return "defer";
	let decision;
	if (Object.hasOwn(requestResult ?? {}, "decision")) decision = requestResult.decision;
	else {
		const waitResult = await waitForNativeHookRelayApprovalDecision({
			approvalId,
			signal: request.signal,
			timeoutMs
		});
		decision = waitResult?.id === approvalId ? waitResult.decision : void 0;
	}
	if (decision === PluginApprovalResolutions.ALLOW_ONCE) return "allow";
	if (decision === PluginApprovalResolutions.ALLOW_ALWAYS) return "allow-always";
	if (decision === PluginApprovalResolutions.DENY) return "deny";
	return "defer";
}
async function waitForNativeHookRelayApprovalDecision(params) {
	const waitPromise = callGatewayTool("plugin.approval.waitDecision", { timeoutMs: params.timeoutMs + 1e4 }, { id: params.approvalId }).catch((error) => {
		if (isApprovalNotFoundError(error)) return;
		throw error;
	});
	if (!params.signal) return waitPromise;
	let onAbort;
	const abortPromise = new Promise((_, reject) => {
		if (params.signal.aborted) {
			reject(toErrorObject(params.signal.reason, "Non-Error rejection"));
			return;
		}
		onAbort = () => reject(toErrorObject(params.signal.reason, "Non-Error rejection"));
		params.signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		return await Promise.race([waitPromise, abortPromise]);
	} finally {
		if (onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
function formatPermissionApprovalDescriptionForTests(request) {
	return formatPermissionApprovalDescription(request);
}
function formatPermissionApprovalDescription(request) {
	return [
		`Tool: ${sanitizeApprovalText(request.toolName)}`,
		request.cwd ? `Cwd: ${sanitizeApprovalText(request.cwd)}` : void 0,
		request.model ? `Model: ${sanitizeApprovalText(request.model)}` : void 0,
		formatToolInputPreview(request.toolInput)
	].filter((line) => Boolean(line)).join("\n");
}
function formatToolInputPreview(toolInput) {
	const command = readNonEmptyStringPreservingWhitespace(toolInput.command);
	if (command) return `Command: ${truncateRelayText(sanitizeApprovalText(command), 240)}`;
	const keys = Object.keys(toolInput).map(sanitizeApprovalText).filter(Boolean).toSorted();
	if (!keys.length) return;
	return `Input keys: ${keys.slice(0, 12).join(", ")}${keys.length > 12 ? ` (${keys.length - 12} omitted)` : ""}`;
}
function sanitizeApprovalText(value) {
	let sanitized = "";
	for (const char of stripAnsi(value)) {
		const codePoint = char.codePointAt(0);
		sanitized += codePoint != null && isUnsafeApprovalCodePoint(codePoint) ? " " : char;
	}
	return sanitized.replace(/\s+/g, " ").trim();
}
function isUnsafeApprovalCodePoint(codePoint) {
	return codePoint >= 0 && codePoint <= 8 || codePoint === 11 || codePoint === 12 || codePoint >= 14 && codePoint <= 31 || codePoint >= 127 && codePoint <= 159 || codePoint >= 8234 && codePoint <= 8238 || codePoint >= 8294 && codePoint <= 8297;
}
function nativeHookRelayProviderDisplayName(provider) {
	return provider === "codex" ? "Codex" : provider;
}
function setNativeHookRelayPermissionApprovalRequesterForTests(requester) {
	nativeHookRelayPermissionApprovalRequester = requester;
}
function setNativeHookRelayDeferredToolApprovalRequesterForTests(requester) {
	nativeHookRelayDeferredToolApprovalRequester = requester;
}
function clearNativeHookRelayPermissionsForTests() {
	pendingPermissionApprovals.clear();
	for (const pendingApproval of pendingPreToolUseApprovals.values()) cancelDeferredPluginToolApproval(pendingApproval.deferredApproval);
	pendingPreToolUseApprovals.clear();
	permissionApprovalWindows.clear();
	permissionAllowAlwaysApprovals.clear();
	nativeHookRelayPermissionApprovalRequester = requestNativeHookRelayPermissionApproval;
	nativeHookRelayDeferredToolApprovalRequester = requestDeferredPluginToolApproval;
}
//#endregion
//#region src/agents/harness/native-hook-relay-events.ts
function getGlobalToolHookMatcherScope(hookName) {
	const registry = getGlobalHookRunnerRegistry();
	return registry ? getToolHookMatcherScope(registry, hookName) : void 0;
}
function nativePreToolUseMayRunLoopDetection(registration) {
	if (!registration.preToolUseLoopDetection || !registration.sessionKey) return false;
	return resolveToolLoopDetectionConfig({
		cfg: registration.config,
		agentId: registration.agentId
	})?.enabled !== false;
}
function nativeHookRelayEventHasLocalWork(registration, event) {
	if (event === "pre_tool_use") return hasBeforeToolCallPolicy() || nativePreToolUseMayRunLoopDetection(registration);
	if (event === "post_tool_use") return hasGlobalHooks("after_tool_call") || listAgentToolResultMiddlewares("codex").length > 0;
	if (event === "before_agent_finalize") return hasGlobalHooks("before_agent_finalize");
	return true;
}
function nativeHookRelayEventToolMatcher(registration, event) {
	if (event === "pre_tool_use") {
		if (nativePreToolUseMayRunLoopDetection(registration)) return;
		const policyRegistry = getGlobalHookRunnerRegistry();
		const scope = mergePluginToolMatcherScopes([getGlobalToolHookMatcherScope("before_tool_call"), getTrustedToolPolicyMatcherScope(policyRegistry)]);
		return scope?.matchAll ? void 0 : scope?.toolNames;
	}
	if (event === "post_tool_use") {
		const scope = mergePluginToolMatcherScopes([getGlobalToolHookMatcherScope("after_tool_call"), getAgentToolResultMiddlewareMatcherScope("codex")]);
		return scope?.matchAll ? void 0 : scope?.toolNames;
	}
}
async function processNativeHookRelayInvocation(params) {
	if (params.invocation.event === "pre_tool_use") return runNativeHookRelayPreToolUse(params);
	if (params.invocation.event === "post_tool_use") return runNativeHookRelayPostToolUse(params);
	if (params.invocation.event === "before_agent_finalize") return runNativeHookRelayBeforeAgentFinalize(params);
	return runNativeHookRelayPermissionRequest(params);
}
async function runNativeHookRelayPreToolUse(params) {
	const toolName = normalizeNativeHookToolName(params.invocation.toolName);
	const toolInput = params.adapter.readToolInput(params.invocation.rawPayload);
	const originalToolInputFingerprint = stableStringify(toolInput);
	const approvalMode = readNativeHookRelayApprovalMode(params.invocation.rawPayload);
	const policyRequest = {
		toolName,
		params: toolInput,
		...params.invocation.toolUseId ? { toolCallId: params.invocation.toolUseId } : {},
		signal: params.registration.signal
	};
	const outcome = params.registration.runBeforeToolCall ? await params.registration.runBeforeToolCall({
		...policyRequest,
		...approvalMode === "report" ? { approvalMode: "defer" } : {},
		...params.invocation.cwd ? { nativeOperation: { cwd: params.invocation.cwd } } : {}
	}) : await runBeforeToolCallHook({
		...policyRequest,
		...approvalMode === "report" ? { approvalMode: "defer" } : {},
		ctx: {
			...params.registration.agentId ? { agentId: params.registration.agentId } : {},
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			...params.registration.config ? { config: params.registration.config } : {},
			runId: params.registration.runId,
			...params.registration.channelId ? { channelId: params.registration.channelId } : {},
			...params.registration.requester ? { requester: params.registration.requester } : {},
			...params.registration.approvalContext,
			...params.invocation.cwd ? {
				cwd: params.invocation.cwd,
				workspaceDir: params.invocation.cwd
			} : {}
		}
	});
	if (outcome.blocked) return params.adapter.renderPreToolUseBlockResponse(outcome.reason, outcome.kind === "failure" && outcome.disposition !== "blocked" ? outcome.disposition : void 0);
	if (outcome.deferredApproval) {
		if (!setNativeHookRelayPreToolUseApproval({
			relayId: params.registration.relayId,
			toolUseId: params.invocation.toolUseId,
			deferredApproval: outcome.deferredApproval,
			originalParamsFingerprint: originalToolInputFingerprint
		})) {
			cancelDeferredPluginToolApproval(outcome.deferredApproval);
			return params.adapter.renderPreToolUseBlockResponse("Plugin approval required but Codex tool id unavailable.");
		}
		return params.adapter.renderNoopResponse(params.invocation.event);
	}
	if (nativeHookRelayParamsWereRewritten(originalToolInputFingerprint, outcome.params)) {
		if (toolName === "exec" && typeof outcome.params.command === "string") return params.adapter.renderPreToolUseRewriteResponse({ command: outcome.params.command });
		return params.adapter.renderPreToolUseBlockResponse("OpenClaw tool policy rewrote unsupported Codex hook input; refusing original request.");
	}
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function runNativeHookRelayPostToolUse(params) {
	const toolName = normalizeNativeHookToolName(params.invocation.toolName);
	const toolCallId = params.invocation.toolUseId ?? `${params.invocation.event}:${params.invocation.receivedAt}`;
	const startArgs = params.adapter.readToolInput(params.invocation.rawPayload);
	const rawResult = params.adapter.readToolResponse(params.invocation.rawPayload);
	const result = !(listAgentToolResultMiddlewares("codex").length > 0) ? rawResult : await createAgentToolResultMiddlewareRunner({
		runtime: "codex",
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId
	}).applyToolResultMiddleware({
		turnId: params.invocation.turnId,
		toolCallId,
		toolName,
		args: startArgs,
		...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
		result: payloadTextResult(rawResult)
	});
	await runAgentHarnessAfterToolCallHook({
		toolName,
		toolCallId,
		runId: params.registration.runId,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		...params.registration.channelId ? { channelId: params.registration.channelId } : {},
		startArgs,
		result
	});
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function runNativeHookRelayBeforeAgentFinalize(params) {
	const outcome = await runAgentHarnessBeforeAgentFinalizeHook({
		event: {
			runId: params.registration.runId,
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			...params.invocation.turnId ? { turnId: params.invocation.turnId } : {},
			provider: params.registration.provider,
			...params.invocation.model ? { model: params.invocation.model } : {},
			...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
			...params.invocation.transcriptPath ? { transcriptPath: params.invocation.transcriptPath } : {},
			stopHookActive: params.invocation.stopHookActive === true,
			...params.invocation.lastAssistantMessage ? { lastAssistantMessage: params.invocation.lastAssistantMessage } : {}
		},
		ctx: {
			...params.registration.agentId ? { agentId: params.registration.agentId } : {},
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			runId: params.registration.runId,
			...params.registration.channelId ? { channelId: params.registration.channelId } : {},
			...params.invocation.cwd ? { workspaceDir: params.invocation.cwd } : {},
			...params.invocation.model ? { modelId: params.invocation.model } : {}
		}
	});
	if (outcome.action === "revise") return params.adapter.renderBeforeAgentFinalizeReviseResponse(outcome.reason);
	if (outcome.action === "finalize") return params.adapter.renderBeforeAgentFinalizeStopResponse(outcome.reason);
	return params.adapter.renderNoopResponse(params.invocation.event);
}
//#endregion
//#region src/agents/harness/native-hook-relay-types.ts
const NATIVE_HOOK_RELAY_EVENTS = [
	"pre_tool_use",
	"post_tool_use",
	"permission_request",
	"before_agent_finalize"
];
//#endregion
//#region src/agents/harness/native-hook-relay.ts
/** Native harness hook event relay and public Plugin SDK facade. */
const DEFAULT_RELAY_TTL_MS = 1800 * 1e3;
const log = createSubsystemLogger("agents/harness/native-hook-relay");
const { relays, relayBridges, invocations } = nativeHookRelayState;
const RELAY_LIFETIME = "__openclawNativeHookRelayLifetimeV1";
function readRelayLifetime(registration) {
	return registration[RELAY_LIFETIME];
}
function setRelayLifetime(registration, lifetime) {
	Object.defineProperty(registration, RELAY_LIFETIME, {
		configurable: true,
		value: lifetime
	});
}
function scheduleNativeHookRelayExpiry(relayId, registration) {
	const lifetime = readRelayLifetime(registration);
	if (!lifetime) return;
	if (lifetime.expiryTimer) clearTimeout(lifetime.expiryTimer);
	const rearm = () => {
		if (relays.get(relayId) !== registration) return;
		const remainingMs = registration.expiresAtMs - Date.now();
		if (remainingMs < 0) {
			unregisterNativeHookRelay(relayId, registration);
			return;
		}
		lifetime.expiryTimer = setTimeout(rearm, Math.min(remainingMs + 1, MAX_TIMER_TIMEOUT_MS));
		lifetime.expiryTimer.unref();
	};
	rearm();
}
function resolveNativeHookRelayExpiresAtMs(ttlMs) {
	return resolveExpiresAtMsFromDurationMs(normalizePositiveInteger(ttlMs, DEFAULT_RELAY_TTL_MS));
}
function registerNativeHookRelay(params) {
	return registerNativeHookRelayInternal(params, void 0);
}
/** Private-local bundled runtime entrypoint; not exported through the public SDK. */
function registerRetainedNativeHookRelay(params) {
	const { retention, ...registrationParams } = params;
	return registerNativeHookRelayInternal(registrationParams, retention);
}
function registerNativeHookRelayInternal(params, retention) {
	pruneExpiredNativeHookRelays();
	pruneNativeHookRelayPermissionAllowAlways();
	const relayId = normalizeRelayKey(params.relayId, "id") ?? randomUUID();
	const generation = normalizeRelayKey(params.generation, "generation") ?? randomUUID();
	const generationMismatchGraceMs = normalizePositiveInteger(params.generationMismatchGraceMs, 0);
	const now = Date.now();
	const expiresAtMs = resolveNativeHookRelayExpiresAtMs(params.ttlMs);
	if (expiresAtMs === void 0) throw new Error("Native hook relay expiry is outside the supported Date range");
	const allowedEvents = normalizeAllowedEvents(params.allowedEvents);
	const stateDbPath = resolveOpenClawStateSqlitePath();
	const deliverReplacedRegistrationUnregister = unregisterNativeHookRelay(relayId, void 0, {
		deferBridgeRecordRemovalMs: 250,
		deferOnUnregister: true
	});
	let partialRegistration;
	try {
		const retained = params.runBeforeToolCall && retention ? retainBeforeToolCallForNativeHookRelay(params.runBeforeToolCall) : void 0;
		const registration = {
			relayId,
			provider: params.provider,
			generation,
			...generationMismatchGraceMs > 0 ? { generationMismatchGraceExpiresAtMs: now + generationMismatchGraceMs } : {},
			...params.agentId ? { agentId: params.agentId } : {},
			sessionId: params.sessionId,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.config ? { config: params.config } : {},
			runId: params.runId,
			...params.channelId ? { channelId: params.channelId } : {},
			...params.requester ? { requester: params.requester } : {},
			...params.approvalContext ? { approvalContext: params.approvalContext } : {},
			allowedEvents,
			preToolUseLoopDetection: params.preToolUseLoopDetection !== false,
			expiresAtMs,
			preToolUseFailureProjections: /* @__PURE__ */ new Map(),
			...params.signal ? { signal: params.signal } : {},
			...params.runBeforeToolCall ? { runBeforeToolCall: params.runBeforeToolCall } : {},
			...params.assertActive ? { assertActive: params.assertActive } : {},
			...params.onPreToolUseFailure ? { onPreToolUseFailure: params.onPreToolUseFailure } : {}
		};
		partialRegistration = registration;
		relays.set(relayId, registration);
		setRelayLifetime(registration, {
			foregroundOpen: true,
			foregroundToken: Symbol("native-hook-relay-foreground"),
			...retained ? { retained } : {},
			...retention ? { retention } : {}
		});
		if (params.signal) {
			const abort = () => unregisterNativeHookRelay(relayId, registration);
			params.signal.addEventListener("abort", abort, { once: true });
			readRelayLifetime(registration).removeAbortListener = () => params.signal?.removeEventListener("abort", abort);
			if (params.signal.aborted) {
				unregisterNativeHookRelay(relayId, registration);
				throw new Error("native hook relay registration aborted");
			}
		}
		registerNativeHookRelayBridge(registration, stateDbPath, invokeNativeHookRelay);
		scheduleNativeHookRelayExpiry(relayId, registration);
		const handle = {
			...registration,
			shouldRelayEvent: (event) => nativeHookRelayEventHasLocalWork(registration, event),
			toolMatcherForEvent: (event) => nativeHookRelayEventToolMatcher(registration, event),
			commandForEvent: (event, options) => buildNativeHookRelayCommandWithStateDatabase({
				provider: params.provider,
				relayId,
				stateDbPath,
				generation: registration.generation,
				event,
				preToolUseUnavailable: event === "pre_tool_use" && !nativeHookRelayEventHasLocalWork(registration, event) ? "noop" : void 0,
				nice: params.command?.nice,
				timeoutMs: resolveNativeHookRelayCommandTimeoutMs(params.command?.timeoutMs, options?.timeoutMs),
				executable: params.command?.executable,
				nodeExecutable: params.command?.nodeExecutable
			}),
			renew: (ttlMs) => {
				const current = relays.get(relayId);
				if (current !== registration) return;
				const renewedExpiresAtMs = resolveNativeHookRelayExpiresAtMs(ttlMs);
				if (renewedExpiresAtMs === void 0) return;
				const bridge = relayBridges.get(relayId);
				if (bridge && bridge.server.listening) try {
					const renewal = renewNativeHookRelayBridgeRecord(current, bridge, renewedExpiresAtMs);
					if (renewal === "unavailable") return;
					if (renewal === "ownership-changed") {
						log.debug("native hook relay bridge record ownership changed", { relayId });
						unregisterNativeHookRelay(relayId, current);
						return;
					}
				} catch (error) {
					log.debug("failed to renew native hook relay bridge record", {
						error,
						relayId
					});
					return;
				}
				current.expiresAtMs = renewedExpiresAtMs;
				handle.expiresAtMs = renewedExpiresAtMs;
				scheduleNativeHookRelayExpiry(relayId, current);
			},
			unregister: () => deactivateNativeHookRelayForeground(relayId, registration)
		};
		return handle;
	} catch (error) {
		if (partialRegistration) unregisterNativeHookRelay(relayId, partialRegistration);
		throw error;
	} finally {
		deliverReplacedRegistrationUnregister?.();
	}
}
function unregisterNativeHookRelay(relayId, expectedRegistration, options) {
	if (expectedRegistration && relays.get(relayId) !== expectedRegistration) return;
	const registration = expectedRegistration ?? relays.get(relayId);
	if (!registration) return;
	const lifetime = readRelayLifetime(registration);
	const bridge = relayBridges.get(relayId);
	if (relays.get(relayId) === registration) relays.delete(relayId);
	if (lifetime?.expiryTimer) clearTimeout(lifetime.expiryTimer);
	lifetime?.removeAbortListener?.();
	lifetime?.retained?.release();
	delete registration[RELAY_LIFETIME];
	unregisterNativeHookRelayBridge(relayId, {
		...options,
		...bridge ? { expectedBridge: bridge } : {}
	});
	removeNativeHookRelayInvocations(relayId);
	removeNativeHookRelayPreToolUseApprovals(relayId);
	removeNativeHookRelayPermissionState(relayId);
	const deliverOnUnregister = () => {
		try {
			lifetime?.retention?.onDispose();
		} catch (error) {
			try {
				log.warn("native hook relay unregister callback failed", {
					error,
					relayId
				});
			} catch {}
		}
	};
	if (options?.deferOnUnregister) return deliverOnUnregister;
	deliverOnUnregister();
}
function deactivateNativeHookRelayForeground(relayId, registration) {
	if (relays.get(relayId) !== registration) return;
	const lifetime = readRelayLifetime(registration);
	if (!lifetime) return;
	lifetime.foregroundOpen = false;
	let shouldRetain = false;
	if (lifetime.retained && lifetime.retention) try {
		shouldRetain = lifetime.retention.shouldRetainAfterForegroundClose();
	} catch (error) {
		try {
			log.warn("native hook relay retention predicate failed", {
				error,
				relayId
			});
		} catch {}
	}
	if (shouldRetain) return;
	unregisterNativeHookRelay(relayId, registration);
}
async function resolveNativeHookRelayInvocationBinding(registration, event, rawPayload) {
	const lifetime = readRelayLifetime(registration);
	if (!lifetime) throw new Error("native hook relay registration is inactive");
	const claim = lifetime.retention?.readClaim(rawPayload);
	if (claim && event === "pre_tool_use" && lifetime.retained && lifetime.retention) {
		const retained = lifetime.retained;
		const retention = lifetime.retention;
		let assertAdmission;
		const assertRetainedAuthority = () => {
			if (relays.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
			registration.signal?.throwIfAborted();
			retained.assertActive();
			if (assertAdmission && !assertAdmission()) throw new Error("native hook relay retained invocation not allowed");
			if (!retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		};
		if (lifetime.foregroundOpen && retention.awaitForegroundAdmission) {
			assertAdmission = await retention.awaitForegroundAdmission(claim);
			if (!assertAdmission) throw new Error("native hook relay retained invocation not allowed");
			assertRetainedAuthority();
		} else if (!retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		return {
			...registration,
			assertActive: assertRetainedAuthority,
			runBeforeToolCall: retained.runBeforeToolCall
		};
	}
	if (!lifetime.foregroundOpen) throw new Error("native hook relay foreground invocation not allowed");
	const foregroundToken = lifetime.foregroundToken;
	const assertActive = () => {
		if (relays.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
		registration.signal?.throwIfAborted();
		registration.assertActive?.();
		if (!lifetime.foregroundOpen || lifetime.foregroundToken !== foregroundToken) throw new Error("native hook relay foreground invocation not allowed");
	};
	return {
		...registration,
		assertActive
	};
}
function normalizeRelayKey(value, kind) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (trimmed.length > 160 || !/^[A-Za-z0-9._:-]+$/u.test(trimmed)) throw new Error(`native hook relay ${kind} must be non-empty, compact, and URL-safe`);
	return trimmed;
}
async function invokeNativeHookRelay(params) {
	const provider = readNativeHookRelayProvider(params.provider);
	const relayId = readNonEmptyString(params.relayId, "relayId");
	const event = readNativeHookRelayEvent(params.event);
	const registration = relays.get(relayId);
	if (!registration) {
		pruneExpiredNativeHookRelays();
		throw new Error("native hook relay not found");
	}
	if (Date.now() > registration.expiresAtMs) {
		unregisterNativeHookRelay(relayId, registration);
		throw new Error("native hook relay expired");
	}
	if (registration.provider !== provider) throw new Error("native hook relay provider mismatch");
	if (params.requireGeneration) {
		const generation = readNonEmptyString(params.generation, "generation");
		if (generation !== registration.generation) {
			if (!canAcceptNativeHookRelayGenerationMismatch(registration, generation)) throw new Error(NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR);
			log.debug("native hook relay accepted bootstrap generation mismatch", {
				relayId,
				event,
				runId: registration.runId
			});
		}
	}
	if (!registration.allowedEvents.includes(event)) throw new Error("native hook relay event not allowed");
	if (!isJsonValue(params.rawPayload)) throw new Error("native hook relay payload must be JSON-compatible");
	const normalized = normalizeNativeHookInvocation({
		registration,
		event,
		rawPayload: params.rawPayload
	});
	const effectiveRegistration = await resolveNativeHookRelayInvocationBinding(registration, event, params.rawPayload);
	if (event === "pre_tool_use" || event === "permission_request") effectiveRegistration.assertActive?.();
	recordNativeHookRelayInvocation(normalized);
	const startedAt = Date.now();
	const response = await processNativeHookRelayInvocation({
		registration: effectiveRegistration,
		invocation: normalized,
		adapter: getNativeHookRelayProviderAdapter(provider)
	});
	if (event === "pre_tool_use" || event === "permission_request") effectiveRegistration.assertActive?.();
	if (normalized.toolUseId && response.failureDisposition && readNativeHookRelayApprovalMode(normalized.rawPayload) !== "report") projectNativeHookRelayPreToolUseFailure(registration, {
		toolName: normalizeNativeHookToolName(normalized.toolName),
		toolCallId: normalized.toolUseId,
		disposition: response.failureDisposition,
		durationMs: Date.now() - startedAt
	});
	return response;
}
function projectNativeHookRelayPreToolUseFailure(registration, failure) {
	const callback = registration.onPreToolUseFailure;
	if (!callback || registration.preToolUseFailureProjections.has(failure.toolCallId)) return;
	const record = {
		promise: Promise.resolve().then(() => callback(failure)),
		settled: false
	};
	registration.preToolUseFailureProjections.set(failure.toolCallId, record);
	record.promise.then(() => {
		record.settled = true;
	}, (error) => {
		record.settled = true;
		if (registration.preToolUseFailureProjections.get(failure.toolCallId) === record) registration.preToolUseFailureProjections.delete(failure.toolCallId);
		log.debug("native pre-tool failure projection failed", {
			error,
			relayId: registration.relayId,
			toolCallId: failure.toolCallId
		});
	});
	if (registration.preToolUseFailureProjections.size > 200) {
		let oldestToolCallId;
		for (const [toolCallId, candidate] of registration.preToolUseFailureProjections) {
			oldestToolCallId ??= toolCallId;
			if (candidate.settled) {
				registration.preToolUseFailureProjections.delete(toolCallId);
				return;
			}
		}
		if (oldestToolCallId) registration.preToolUseFailureProjections.delete(oldestToolCallId);
	}
}
function hasNativeHookRelayInvocation(params) {
	const toolUseId = params.toolUseId?.trim();
	if (!toolUseId) return false;
	return invocations.some((invocation) => invocation.relayId === params.relayId && invocation.event === params.event && invocation.toolUseId === toolUseId);
}
function recordNativeHookRelayInvocation(invocation) {
	invocations.push({
		...invocation,
		rawPayload: snapshotNativeHookRelayPayload(invocation.rawPayload)
	});
	if (invocations.length > 200) invocations.splice(0, invocations.length - 200);
}
function removeNativeHookRelayInvocations(relayId) {
	for (let index = invocations.length - 1; index >= 0; index -= 1) if (invocations[index]?.relayId === relayId) invocations.splice(index, 1);
}
function canAcceptNativeHookRelayGenerationMismatch(registration, generation) {
	const expiresAtMs = registration.generationMismatchGraceExpiresAtMs;
	if (typeof expiresAtMs !== "number" || Date.now() > expiresAtMs) return false;
	if (registration.generationMismatchGraceAcceptedGeneration) return registration.generationMismatchGraceAcceptedGeneration === generation;
	registration.generationMismatchGraceAcceptedGeneration = generation;
	return true;
}
function pruneExpiredNativeHookRelays(now = Date.now()) {
	for (const [relayId, registration] of relays) if (now > registration.expiresAtMs) unregisterNativeHookRelay(relayId, registration);
}
function normalizeAllowedEvents(events) {
	if (!events?.length) return NATIVE_HOOK_RELAY_EVENTS;
	return [...new Set(events)];
}
const testing = {
	clearNativeHookRelaysForTests() {
		for (const [relayId, registration] of relays) unregisterNativeHookRelay(relayId, registration);
		clearNativeHookRelayBridgesForTests();
		invocations.length = 0;
		clearNativeHookRelayPermissionsForTests();
	},
	getNativeHookRelayInvocationsForTests() {
		return [...invocations];
	},
	getNativeHookRelayRegistrationForTests(relayId) {
		return relays.get(relayId);
	},
	getNativeHookRelayBridgeDirForTests() {
		throw new Error("native hook relay bridge files were retired");
	},
	getNativeHookRelayBridgeRegistryPathForTests(relayId) {
		throw new Error("native hook relay bridge files were retired");
	},
	getNativeHookRelayBridgeRecordForTests(relayId) {
		const record = readNativeHookRelayBridgeRecordIfExists(relayId);
		return record ? { ...record } : void 0;
	},
	isNativeHookRelayBridgeLookupRetryableForTests(error, elapsedMs = 0) {
		return isRetryableNativeHookRelayBridgeLookupError({
			error,
			elapsedMs
		});
	},
	formatPermissionApprovalDescriptionForTests(request) {
		return formatPermissionApprovalDescriptionForTests(request);
	},
	permissionRequestContentFingerprintForTests(request) {
		return permissionRequestContentFingerprintForTests(request);
	},
	permissionRequestToolInputKeyFingerprintForTests,
	setNativeHookRelayPermissionApprovalRequesterForTests(requester) {
		setNativeHookRelayPermissionApprovalRequesterForTests(requester);
	},
	setNativeHookRelayDeferredToolApprovalRequesterForTests(requester) {
		setNativeHookRelayDeferredToolApprovalRequesterForTests(requester);
	}
};
//#endregion
export { testing as a, registerRetainedNativeHookRelay as i, invokeNativeHookRelay as n, resolveNativeHookRelayDeferredToolApproval as o, registerNativeHookRelay as r, buildNativeHookRelayCommand as s, hasNativeHookRelayInvocation as t };
