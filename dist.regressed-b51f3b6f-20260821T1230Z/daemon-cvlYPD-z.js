import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { u as redactToolPayloadText } from "./redact-Cl7lwBnl.js";
import { t as sameFileIdentity } from "./file-identity-BDCAnrmX.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./fs-safe-C9N8pCh1.js";
import "./path-guards-fBZukd5S.js";
import { d as resolveConfigDir } from "./utils-DEqefz4f.js";
import { _ as resolveNodeWindowsTaskName, g as resolveNodeSystemdServiceName, m as resolveNodeLaunchAgentLabel } from "./constants-B4HhnyPv.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { i as registerSecretValueForRedaction, r as redactRegisteredSecretValues } from "./secret-redaction-registry-gIFE-2_j.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.js";
import { n as signalProcessTree } from "./kill-tree-B-nnBWyI.js";
import { s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { At as boolean, Rn as string, Tn as object, wn as number } from "./schemas-CZ9Toj_c.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { n as readFileWindowFullySync } from "./file-read-DtMn74uz.js";
import { h as runOpenClawStateWriteTransaction, kt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-DlCMR4eQ.js";
import { t as createDedupeCache } from "./dedupe-C5V_sRWr.js";
import { t as tempWorkspace } from "./private-temp-workspace-B5dYiPlo.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cg4Pldzy.js";
import { i as resolveExecutableFromPathEnv } from "./executable-path-D05F-hRH.js";
import { l as sanitizeSystemRunEnvOverrides, s as sanitizeHostExecEnv, t as inspectHostExecEnvOverrides } from "./host-env-security-B_a4cpNH.js";
import { t as colorize } from "./theme-vjDs9tao.js";
import { i as logWarn, t as logDebug } from "./logger-DKrZPnAI.js";
import { d as getActivePluginRegistry } from "./runtime-g0R28Sy0.js";
import { a as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BULcX9xX.js";
import { l as resolveCommandResolutionFromArgv, s as resolveApprovalAuditTrustPath } from "./exec-command-resolution-B9td7pT8.js";
import { C as extractEnvAssignmentKeysFromDispatchWrappers, D as unwrapKnownDispatchWrapperInvocation, F as splitShellArgs, N as normalizeExecutableToken, a as extractShellWrapperCommand, c as isBlockedShellWrapperCommand, d as resolveShellWrapperTransportArgv, f as unwrapKnownShellMultiplexerInvocation, h as advancePosixInlineOptionScan, m as POSIX_INLINE_COMMAND_FLAGS, n as POSIX_SHELL_WRAPPERS, t as POSIX_PARSEABLE_SHELL_WRAPPERS, u as isShellWrapperInvocation, x as resolveInlineCommandMatch } from "./shell-wrapper-resolution-BddNi41x.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-ClLrY9h9.js";
import "./config-Dl8DJbzM.js";
import { a as readWindowsProcessStartTimeSync } from "./windows-port-pids-CMSygYlL.js";
import { S as resolveSystemdUserServiceAccount, i as readSystemdUserLingerStatus, x as isSystemdUserServiceAvailable } from "./systemd-DPnIQILH.js";
import { r as resolveNodeProgramArguments } from "./program-args-C4pvyUF9.js";
import { u as buildNodeServiceEnvironment } from "./runtime-paths-DN2SRxPQ.js";
import { d as createCapturedOutputBuffers, f as finalizeCapturedOutput, n as runExec, r as runCommandWithTimeout, u as appendCapturedOutput } from "./exec-BL80Wdzl.js";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { r as resolveSafeChildProcessInvocation } from "./windows-command-LFdkl-nm.js";
import { n as resolveDaemonInstallRuntimeInputs, r as resolveDaemonNodeBinDir, t as emitDaemonInstallRuntimeWarning } from "./daemon-install-plan.shared-D9z10Vrt.js";
import { r as isGatewayDaemonRuntime, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-CHOL1Kuf.js";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-BAHQH0iA.js";
import { n as buildPlatformServiceStartHints, t as buildPlatformRuntimeLogHints } from "./runtime-hints-Db7lTXFy.js";
import { a as filterDaemonEnv, d as resolveRuntimeStatusColor, n as createDaemonInstallActionContext, p as buildDaemonServiceSnapshot, r as failIfNixDaemonInstallMode, t as createCliStatusTextStyles, v as installDaemonServiceAndEmit } from "./shared-Cauz4p0y.js";
import { t as formatRuntimeStatus } from "./runtime-format-BfRSfET7.js";
import { t as parsePort } from "./parse-port-BMBBPvn5.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-Do3cAiyu.js";
import { r as loadOrCreateDeviceIdentity } from "./device-identity-D1g4SzdB.js";
import { t as normalizeFingerprint } from "./fingerprint-CFbD9c_Z.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-2OrPX3Ar.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-B1nULpha.js";
import { t as GatewayClient } from "./client-D0gSxl6W.js";
import { t as GatewayClientRequestError } from "./request-error-Cviusa7U.js";
import { a as NODE_EXEC_APPROVALS_COMMANDS, c as NODE_MCP_TOOLS_CALL_COMMAND, f as NODE_SYSTEM_RUN_COMMANDS, i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS, m as NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE, p as NODE_TERMINAL_UPLOAD_COMMAND, r as NODE_DEVICE_APPS_COMMAND, s as NODE_FS_LIST_DIR_COMMAND, t as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND, u as NODE_MCP_TOOL_CALL_TIMEOUT_MS } from "./node-commands-DemsbVYQ.js";
import { i as runServiceUninstall, n as runServiceStart, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-CeMFoTS1.js";
import { t as resolveMcpRequestTimeoutMs } from "./mcp-transport-config-C8VGUeII.js";
import { X as WORKER_PUBLIC_INGRESS_PATH, a as WORKER_PROTOCOL_FEATURES } from "./worker-admission-R0mXKdG7.js";
import { i as writeSecretInputToChild, r as addSecretInputStdio, t as createChildAdapter } from "./child-DZp-ouPz.js";
import { t as loadSkillsFromDirSafe } from "./local-loader-BJ3elWx6.js";
import { a as mergeExecApprovalsSocketDefaults } from "./exec-approvals-config-moZwurok.js";
import { D as minSecurity, E as maxAsk, G as ensureExecApprovalsSnapshot, H as resolveExecModePolicy, J as readExecApprovalsSnapshot, Q as updateExecApprovals, b as resolveAllowAlwaysPersistenceDecision, f as createExecApprovalPolicySnapshot, g as isExecApprovalPolicySnapshotCurrent, i as resolveExecApprovalsLocked, k as requiresExecApproval, o as requestJsonlSocket, p as hasDurableExecApproval, s as commitExecAuthorizationLocked, t as normalizeExecApprovals, w as commandRequiresSecurityAuditSuppressionApproval, x as resolveDurableExecApprovalRequirement, y as resolveAllowAlwaysPatternCoverage } from "./exec-approvals-DkNiV-ux.js";
import { n as resolvePlannedSegmentArgv, r as analyzeArgvCommand } from "./exec-approvals-analysis-5duiv6DD.js";
import "./exec-wrapper-resolution-Et5CIZnS.js";
import { l as describeInterpreterInlineEval } from "./risks-CsMxFHRL.js";
import { d as PNPM_DLX_OPTIONS_WITH_VALUE, f as PNPM_FLAG_OPTIONS, g as planShellAuthorization, h as unwrapKnownPackageManagerExecInvocation, i as evaluateShellAllowlistWithAuthorization, m as normalizePackageManagerExecToken, p as PNPM_OPTIONS_WITH_VALUE, t as evaluateExecAllowlist, u as PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE } from "./exec-approvals-allowlist-DGCv2C3A.js";
import { a as createMcpJsonSchemaValidator, i as sanitizeMcpMetadataText, o as matchesMcpToolFilterPattern, r as collectMcpPaginatedItems, t as resolveMcpTransport } from "./mcp-transport-Bn24sfAb.js";
import { t as mcpContentBlockToAgentContent } from "./mcp-content-WEFrHX9X.js";
import { h as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-Din_sL74.js";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-B3QCoQfh.js";
import { t as applyExecPolicyLayer } from "./exec-policy-fW6gzRky.js";
import { r as resolveExecSafeBinRuntimePolicy, t as isInterpreterLikeSafeBin } from "./exec-safe-bin-runtime-policy-F-bJ388b.js";
import { t as getMachineDisplayName } from "./machine-name-Dhnqqwdy.js";
import { a as hashWorkerBundleManifest, n as collectWorkerBundleManifestWithSourceIdentity } from "./bundle-staging-DcGgN-po.js";
import { n as NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE, t as NODE_RUNNER_INVENTORY_UPDATE_METHOD } from "./node-runner-inventory-CvaqnZf8.js";
import { i as NODE_SKILL_NAME_RE, r as NODE_SKILL_MAX_TOTAL_BYTES, t as NODE_SKILL_MAX_CONTENT_BYTES } from "./node-skill-constraints-DLpuutsb.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-L5fXdI0M.js";
import { t as decodeClaudeCliNodeRunParams } from "./invoke-agent-cli-claude-params-T5P3gemx.js";
import { n as detectPolicyInlineEval } from "./policy-KCMV8X4V.js";
import { t as buildAuthorizedShellCommandFromPlan } from "./exec-authorization-render-DHho9VzH.js";
import { i as resolveExecAutoReviewDecision } from "./exec-auto-review-DAe4l45X.js";
import { c as normalizeSystemRunApprovalPlan, n as formatExecCommand, r as resolveSystemRunCommandRequest } from "./system-run-command-Dyih2lau.js";
import { t as decodePairingSetupCode } from "./setup-code-BXkvc32v.js";
import { a as loadNodeHostConfig, i as configureNodeHost } from "./config-BWm1RSBz.js";
import { n as stageTerminalUpload, t as ensureTerminalUploadCleanup } from "./terminal-file-upload-Bh-Q3Tmh.js";
import { t as BoundedBuffer } from "./bounded-buffer-C08_hwby.js";
import { n as probeRfbServer, t as classifyRfbSecurity } from "./rfb-probe-Doz7Vne6.js";
import { t as scanInstalledApps } from "./installed-apps-C_EDA6g_.js";
import { t as listHostDirectories } from "./host-directory-listing-CXs-GH7y.js";
import { i as parseNodeWorkerWorkspaceExecResult, n as NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES, r as parseNodeWorkerWorkspaceExecInput, t as NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES } from "./node-workspace-protocol-DlQjlWdM.js";
import { t as parseNodeWorkerWorkspaceRetainInput } from "./node-workspace-retain-protocol-JcRERe5z.js";
import { a as nodeWorkspaceTransferManifestPath, i as nodeWorkspaceTransferBlobPath, o as nodeWorkspaceTransferPackPath, r as NodeWorkerWorkspaceTransferError, s as nodeWorkspaceTransferReconcilePath, t as NODE_WORKSPACE_TRANSFER_ERROR_CODE } from "./node-workspace-transfer-protocol-BlZMCwT7.js";
import { i as parseWorkerLaunchPlan, n as completeWorkerLaunchDescriptor, o as parseWorkerConnectionEndpoint } from "./launch-descriptor-CCSAs-Jn.js";
import { a as parseNodeWorkerLaunchInput, i as parseNodeWorkerConnectionFailureMessage, n as nodeWorkerPlanHash, o as parseNodeWorkerLookupInput, r as parseNodeWorkerCancelInput, s as parseNodeWorkerSupervisorReceipt } from "./node-supervisor-protocol-BMYRTeBJ.js";
import { o as formatWorkerConnectionFailure } from "./worker-connection-contract-Cyi21lKp.js";
import { T as MAX_WORKSPACE_MANIFEST_BYTES, _ as parseWorkerWorkspaceManifest } from "./workspace-actual-manifest-B7ccel6H.js";
import { f as workerWorkspaceTransferPaths } from "./workspace-result-staging-Gr33yVbq.js";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-DLvOPcsX.js";
import { _ as migrateLegacyDeviceAuth, g as detectLegacyDeviceAuth, h as detectLegacyDeviceIdentity, n as migrateLegacyExecApprovals, r as migrateLegacyDeviceIdentity, t as detectLegacyExecApprovals } from "./state-migrations.exec-approvals-Dk7RHB0U.js";
import { t as resolveNodeService } from "./node-service-Cb5DaQWg.js";
import crypto, { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { spawn } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import net from "node:net";
import { once } from "node:events";
import { StringDecoder } from "node:string_decoder";
import { WebSocket } from "ws";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import http from "node:http";
import https from "node:https";
//#region src/node-host/gateway-candidate-connection.ts
function formatGatewayCandidateUrl(gateway) {
	const host = gateway.host ?? "127.0.0.1";
	const urlHost = host.includes(":") && !(host.startsWith("[") && host.endsWith("]")) ? `[${host}]` : host;
	const port = gateway.port ?? 18789;
	return `${gateway.tls ? "wss" : "ws"}://${urlHost}:${port}${gateway.contextPath ? gateway.contextPath.startsWith("/") ? gateway.contextPath : `/${gateway.contextPath}` : ""}`;
}
function canTryNextGatewayCandidate(info) {
	return info?.phase === "pre-hello" && info.connectRequestSent === false;
}
function createNodeHostGatewayCandidateConnection(params) {
	if (params.candidates.length === 0) throw new Error("node host gateway candidate list cannot be empty");
	let currentCandidateIndex = 0;
	let stopped = false;
	let winnerSelected = params.candidates.length === 1;
	let latestManifest;
	let currentClient = createCandidateClient(currentCandidateIndex);
	function createCandidateClient(candidateIndex) {
		const candidate = params.candidates[candidateIndex];
		if (!candidate) throw new Error(`node host gateway candidate ${candidateIndex} is unavailable`);
		const url = formatGatewayCandidateUrl(candidate);
		const candidateClient = new GatewayClient({
			...params.clientOptions,
			url,
			tlsFingerprint: candidate.tlsFingerprint,
			onEvent: (event) => {
				if (currentCandidateIndex === candidateIndex) params.onEvent(event);
			},
			onHelloOk: (hello) => {
				if (currentCandidateIndex !== candidateIndex) return;
				if (!winnerSelected) {
					winnerSelected = true;
					params.onWinningCandidate(candidate);
				}
				params.onHelloOk(hello, url, candidate.tlsFingerprint);
			},
			onConnectError: (error) => {
				if (currentCandidateIndex === candidateIndex) params.onConnectError(error);
			},
			onReconnectPaused: (info) => {
				if (currentCandidateIndex === candidateIndex) params.onReconnectPaused(info);
			},
			onClose: (code, reason, info) => {
				if (currentCandidateIndex !== candidateIndex) return;
				params.onClose(code, reason, info);
				const nextCandidateIndex = candidateIndex + 1;
				if (stopped || winnerSelected || nextCandidateIndex >= params.candidates.length || !canTryNextGatewayCandidate(info)) return;
				currentCandidateIndex = nextCandidateIndex;
				candidateClient.stop();
				queueMicrotask(() => {
					if (stopped || currentCandidateIndex !== nextCandidateIndex) return;
					currentClient = createCandidateClient(nextCandidateIndex);
					currentClient.start();
				});
			}
		});
		if (latestManifest) candidateClient.updateNodeManifest(latestManifest);
		return candidateClient;
	}
	return {
		start() {
			currentClient.start();
		},
		stop() {
			stopped = true;
			currentClient.stop();
		},
		request(...requestArgs) {
			return currentClient.request(...requestArgs);
		},
		updateNodeManifest(manifest) {
			latestManifest = manifest;
			currentClient.updateNodeManifest(manifest);
		}
	};
}
//#endregion
//#region src/node-host/invoke-payload.ts
const MAX_INVOKE_INPUT_BYTES = 16 * 1024;
function coerceNodeInvokePayload(payload) {
	if (!payload || typeof payload !== "object") return null;
	const obj = payload;
	const id = typeof obj.id === "string" ? obj.id.trim() : "";
	const nodeId = typeof obj.nodeId === "string" ? obj.nodeId.trim() : "";
	const command = typeof obj.command === "string" ? obj.command.trim() : "";
	if (!id || !nodeId || !command) return null;
	return {
		id,
		nodeId,
		command,
		paramsJSON: typeof obj.paramsJSON === "string" ? obj.paramsJSON : obj.params !== void 0 ? JSON.stringify(obj.params) : null,
		timeoutMs: typeof obj.timeoutMs === "number" ? obj.timeoutMs : null,
		idempotencyKey: typeof obj.idempotencyKey === "string" ? obj.idempotencyKey : null
	};
}
function coerceNodeInvokeCancelPayload(payload) {
	const value = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
	return value && typeof value.invokeId === "string" && typeof value.nodeId === "string" ? {
		invokeId: value.invokeId,
		nodeId: value.nodeId
	} : null;
}
function coerceNodeInvokeInputPayload(payload) {
	const value = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
	if (!value || typeof value.id !== "string" || typeof value.nodeId !== "string" || !Number.isInteger(value.seq) || value.seq < 0 || typeof value.payloadJSON !== "string" || Buffer.byteLength(value.payloadJSON, "utf8") > MAX_INVOKE_INPUT_BYTES) return null;
	return {
		invokeId: value.id,
		nodeId: value.nodeId,
		seq: value.seq,
		payloadJSON: value.payloadJSON
	};
}
//#endregion
//#region src/infra/exec-host.ts
/** Send an authenticated exec request over the host JSONL socket. */
async function requestExecHostViaSocket(params) {
	const { socketPath, token, request } = params;
	if (!socketPath || !token) return null;
	const timeoutMs = params.timeoutMs ?? 2e4;
	const requestJson = JSON.stringify(request);
	const nonce = crypto.randomBytes(16).toString("hex");
	const ts = Date.now();
	const hmac = crypto.createHmac("sha256", token).update(`${nonce}:${ts}:${requestJson}`).digest("hex");
	return await requestJsonlSocket({
		socketPath,
		requestLine: JSON.stringify({
			type: "exec",
			id: crypto.randomUUID(),
			nonce,
			ts,
			hmac,
			requestJson
		}),
		timeoutMs,
		accept: (value) => {
			const msg = value;
			if (msg?.type !== "exec-res") return;
			if (msg.ok === true && msg.payload) return {
				ok: true,
				payload: msg.payload
			};
			if (msg.ok === false && msg.error) return {
				ok: false,
				error: msg.error
			};
			return null;
		}
	});
}
//#endregion
//#region src/node-host/desktop-stream-command.ts
const DEFAULT_DESKTOP_PORT = 5900;
const PROBE_TIMEOUT_MS = 1500;
const MAX_PAYLOAD_BYTES = 1024 * 1024;
const PAUSE_BUFFERED_BYTES = 4 * 1024 * 1024;
const RESUME_CHECK_MS = 25;
const TICKET_PATTERN = /^[a-f0-9]{48}$/u;
function decodeDesktopStreamParams(raw) {
	let value;
	try {
		value = raw ? JSON.parse(raw) : void 0;
	} catch {
		throw new Error("INVALID_REQUEST: desktop stream params malformed JSON");
	}
	if (!isRecord(value)) throw new Error("INVALID_REQUEST: desktop stream params required");
	const ticket = typeof value.ticket === "string" ? value.ticket.trim() : "";
	const attachPath = typeof value.attachPath === "string" ? value.attachPath.trim() : "";
	if (!TICKET_PATTERN.test(ticket) || attachPath !== `/node-desktop/attach?ticket=${ticket}`) throw new Error("INVALID_REQUEST: desktop stream ticket and attachPath required");
	if (new URL(attachPath, "http://127.0.0.1").searchParams.get("ticket") !== ticket) throw new Error("INVALID_REQUEST: desktop stream ticket does not match attachPath");
	if (Object.keys(value).some((key) => key !== "ticket" && key !== "attachPath")) throw new Error("INVALID_REQUEST: desktop stream params contain unsupported fields");
	return {
		ticket,
		attachPath
	};
}
function websocketDataBuffer(data) {
	if (Buffer.isBuffer(data)) return data;
	if (Array.isArray(data)) return Buffer.concat(data);
	return Buffer.from(data);
}
function attachWebSocketUrl(gatewayUrl, attachPath) {
	const gateway = new URL(gatewayUrl);
	const url = new URL(attachPath, gateway);
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error("desktop stream gateway URL must use WebSocket transport");
	if (url.origin !== gateway.origin || url.pathname !== "/node-desktop/attach") throw new Error("desktop stream attachPath must stay on the connected gateway");
	return url.toString();
}
function assertTlsSocketFingerprint(socket, expectedRaw) {
	const expected = normalizeFingerprint(expectedRaw);
	const actual = normalizeFingerprint(socket.getPeerCertificate().fingerprint256 ?? "");
	if (!expected || !actual || actual !== expected) throw new Error("gateway TLS fingerprint mismatch");
}
function createPinnedRequestFinisher(expected) {
	return (request) => {
		request.once("socket", (socket) => {
			const tlsSocket = socket;
			tlsSocket.once("secureConnect", () => {
				try {
					assertTlsSocketFingerprint(tlsSocket, expected);
					request.end();
				} catch (error) {
					request.destroy(error instanceof Error ? error : new Error(String(error)));
				}
			});
		});
	};
}
function websocketOptions(url, tlsFingerprint) {
	if (!url.startsWith("wss:") || !tlsFingerprint?.trim()) return { maxPayload: MAX_PAYLOAD_BYTES };
	return {
		maxPayload: MAX_PAYLOAD_BYTES,
		rejectUnauthorized: false,
		finishRequest: createPinnedRequestFinisher(tlsFingerprint)
	};
}
function assertGatewayTlsFingerprint(ws, expectedRaw) {
	if (!expectedRaw?.trim()) return;
	const expected = normalizeFingerprint(expectedRaw);
	const socket = ws["_socket"];
	const actual = normalizeFingerprint(socket?.getPeerCertificate?.().fingerprint256 ?? "");
	if (!expected || !actual || actual !== expected) throw new Error("gateway TLS fingerprint mismatch");
}
async function readVncPassword(passwordFile) {
	if (!passwordFile) return;
	const password = (await fs$1.readFile(passwordFile, "utf8")).replace(/[\r\n]+$/u, "");
	if (!password) throw new Error("desktop.host.passwordFile is empty");
	registerSecretValueForRedaction(password);
	return password;
}
async function waitForSocketConnect(socket) {
	await new Promise((resolve, reject) => {
		socket.once("connect", resolve);
		socket.once("error", reject);
	});
}
async function waitForWebSocketOpen(ws) {
	await new Promise((resolve, reject) => {
		ws.once("open", resolve);
		ws.once("error", reject);
	});
}
async function sendAttachMetadata(ws, metadata) {
	const buffer = Buffer.from(JSON.stringify(metadata), "utf8");
	try {
		await new Promise((resolve, reject) => {
			ws.send(buffer, { binary: true }, (error) => error ? reject(error) : resolve());
		});
	} finally {
		buffer.fill(0);
	}
}
function createDesktopStreamSplice(params) {
	let resumeTimer;
	let settled = false;
	let finish;
	const done = new Promise((resolve, reject) => {
		finish = (error) => {
			if (settled) return;
			settled = true;
			clearInterval(resumeTimer);
			if (error) reject(error);
			else resolve();
		};
		params.ws.on("message", (data, isBinary) => {
			if (!isBinary) {
				finish(/* @__PURE__ */ new Error("gateway sent non-binary desktop stream data"));
				return;
			}
			if (!params.rfbSocket.write(websocketDataBuffer(data))) {
				params.ws.pause();
				params.rfbSocket.once("drain", () => params.ws.resume());
			}
		});
		params.rfbSocket.on("data", (chunk) => {
			if (params.ws.readyState !== WebSocket.OPEN) return;
			params.ws.send(chunk, { binary: true }, (error) => error && finish(error));
			if (params.ws.bufferedAmount <= PAUSE_BUFFERED_BYTES || resumeTimer) return;
			params.rfbSocket.pause();
			resumeTimer = setInterval(() => {
				if (params.ws.bufferedAmount <= PAUSE_BUFFERED_BYTES) {
					clearInterval(resumeTimer);
					resumeTimer = void 0;
					params.rfbSocket.resume();
				}
			}, RESUME_CHECK_MS);
			resumeTimer.unref?.();
		});
		params.ws.once("close", () => finish());
		params.ws.once("error", (error) => finish(error));
		params.rfbSocket.once("close", () => finish());
		params.rfbSocket.once("error", (error) => finish(error));
	});
	done.catch(() => void 0);
	return {
		done,
		start() {
			if (params.rfbSocket.destroyed || params.ws.readyState !== WebSocket.OPEN) {
				finish();
				return;
			}
			params.rfbSocket.resume();
			params.ws.resume();
		}
	};
}
/** Splices a node-local loopback RFB socket to a ticket-authenticated Gateway WebSocket. */
async function runNodeDesktopStreamCommand(params) {
	if (params.target.host !== "127.0.0.1") throw new Error("desktop stream target must be loopback");
	if (!Number.isInteger(params.target.port) || params.target.port < 1 || params.target.port > 65535) throw new Error("desktop stream target port is invalid");
	params.emitStatus?.("probing local RFB server\n").catch(() => void 0);
	const probe = await probeRfbServer({
		host: "127.0.0.1",
		port: params.target.port,
		timeoutMs: PROBE_TIMEOUT_MS
	});
	if (probe.kind !== "rfb") throw new Error(probe.kind === "not-rfb" ? "desktop stream target is not an RFB server" : "desktop stream loopback RFB server is unavailable");
	const auth = classifyRfbSecurity(probe.securityTypes);
	if (auth === "none") throw new Error("refusing unauthenticated loopback RFB server");
	if (auth === "unsupported") throw new Error("loopback RFB server security is unsupported");
	const vncPassword = auth === "vnc-password" ? await readVncPassword(params.passwordFile) : void 0;
	if (params.signal.aborted) return;
	const rfbSocket = net.createConnection(params.target.port, "127.0.0.1");
	rfbSocket.pause();
	const wsUrl = attachWebSocketUrl(params.gatewayUrl, params.command.attachPath);
	const ws = new WebSocket(wsUrl, websocketOptions(wsUrl, params.gatewayTlsFingerprint));
	let aborted = params.signal.aborted;
	let resolveAbort;
	const abort = new Promise((resolve) => {
		resolveAbort = resolve;
	});
	const onAbort = () => {
		aborted = true;
		rfbSocket.destroy();
		ws.terminate();
		resolveAbort();
	};
	params.signal.addEventListener("abort", onAbort, { once: true });
	if (aborted) onAbort();
	try {
		await Promise.race([Promise.all([waitForSocketConnect(rfbSocket), waitForWebSocketOpen(ws)]), abort]);
		if (aborted) return;
		assertGatewayTlsFingerprint(ws, params.gatewayTlsFingerprint);
		ws.pause();
		const splice = createDesktopStreamSplice({
			rfbSocket,
			ws
		});
		await sendAttachMetadata(ws, {
			auth,
			...vncPassword ? { vncPassword } : {}
		});
		params.emitStatus?.("desktop stream attached\n").catch(() => void 0);
		splice.start();
		await splice.done;
	} catch (error) {
		if (!aborted) throw error;
	} finally {
		params.signal.removeEventListener("abort", onAbort);
		rfbSocket.destroy();
		if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close();
	}
}
/** Runs the built-in command against the node-local desktop configuration. */
async function invokeNodeDesktopStream(params) {
	if (!params.gatewayUrl || !params.signal) throw new Error("desktop stream gateway connection is unavailable");
	if (params.config?.enabled !== true) throw new Error("desktop host streaming is disabled on this node");
	await runNodeDesktopStreamCommand({
		command: decodeDesktopStreamParams(params.paramsJSON),
		gatewayUrl: params.gatewayUrl,
		...params.gatewayTlsFingerprint ? { gatewayTlsFingerprint: params.gatewayTlsFingerprint } : {},
		target: {
			host: "127.0.0.1",
			port: params.config.port ?? DEFAULT_DESKTOP_PORT
		},
		...params.config.passwordFile ? { passwordFile: params.config.passwordFile } : {},
		signal: params.signal,
		...params.emitStatus ? { emitStatus: params.emitStatus } : {}
	});
}
//#endregion
//#region src/node-host/node-invoke-progress.ts
const PROGRESS_CHUNK_BYTES = 16 * 1024;
const MIN_HEARTBEAT_INTERVAL_MS = 250;
const MAX_HEARTBEAT_INTERVAL_MS = 5e3;
function resolveNodeInvokeHeartbeatInterval(idleTimeoutMs) {
	return Math.max(MIN_HEARTBEAT_INTERVAL_MS, Math.min(MAX_HEARTBEAT_INTERVAL_MS, Math.floor(idleTimeoutMs / 2)));
}
function createNodeInvokeProgressWriter(params) {
	let seq = 0;
	let queue = Promise.resolve();
	let progressError;
	let heartbeatQueued = false;
	let heartbeatDirty = false;
	let heartbeatTimer;
	let recurringHeartbeats = false;
	let stopped = false;
	let lastProgressAt = 0;
	const heartbeatIntervalMs = resolveNodeInvokeHeartbeatInterval(params.idleTimeoutMs);
	const recordError = (error) => {
		progressError = error instanceof Error ? error : new Error(String(error));
		params.onError(progressError);
	};
	const enqueue = (task, pausable) => {
		pausable?.pause();
		queue = queue.then(task).catch(recordError).finally(() => pausable?.resume());
		return queue;
	};
	const sendText = async (text) => {
		let remaining = text;
		while (remaining) {
			const chunk = truncateUtf8Prefix(remaining, PROGRESS_CHUNK_BYTES);
			if (!chunk) break;
			await params.client.request("node.invoke.progress", {
				invokeId: params.frame.id,
				nodeId: params.frame.nodeId,
				seq,
				chunk
			});
			seq += 1;
			remaining = remaining.slice(chunk.length);
		}
	};
	const queueHeartbeat = () => {
		if (stopped) return;
		if (heartbeatQueued) {
			heartbeatDirty = true;
			return;
		}
		heartbeatQueued = true;
		const delayMs = Math.max(0, heartbeatIntervalMs - (Date.now() - lastProgressAt));
		heartbeatTimer = setTimeout(() => {
			heartbeatTimer = void 0;
			enqueue(async () => {
				await params.client.request("node.invoke.progress", {
					invokeId: params.frame.id,
					nodeId: params.frame.nodeId,
					seq,
					chunk: ""
				});
				seq += 1;
				lastProgressAt = Date.now();
			}).finally(() => {
				heartbeatQueued = false;
				if ((heartbeatDirty || recurringHeartbeats) && !stopped) {
					heartbeatDirty = false;
					queueHeartbeat();
				}
			});
		}, delayMs);
	};
	return {
		write(text, pausable) {
			if (!text || stopped) return queue;
			lastProgressAt = Date.now();
			return enqueue(() => sendText(text), pausable);
		},
		queueHeartbeat,
		startHeartbeats() {
			recurringHeartbeats = true;
			queueHeartbeat();
		},
		stopHeartbeats() {
			recurringHeartbeats = false;
			heartbeatDirty = false;
			clearTimeout(heartbeatTimer);
			heartbeatTimer = void 0;
			heartbeatQueued = false;
		},
		async flush() {
			await queue.catch(() => {});
		},
		stop() {
			stopped = true;
			recurringHeartbeats = false;
			heartbeatDirty = false;
			clearTimeout(heartbeatTimer);
			heartbeatTimer = void 0;
		},
		get error() {
			return progressError;
		}
	};
}
//#endregion
//#region src/node-host/invoke-agent-cli-claude.ts
/** Validates and streams one approval-gated Claude CLI turn on a headless node. */
const OUTPUT_CAP_BYTES = 2e5;
const STDERR_TAIL_BYTES = 2e4;
const TERMINAL_EVENT_MAX_BYTES = 1024 * 1024;
function isClaudeResultLine(line) {
	try {
		return JSON.parse(line)?.type === "result";
	} catch {
		return false;
	}
}
/** Spawn the node-resolved Claude binary and stream bounded UTF-8 stdout. */
async function runClaudeCliNodeCommand(params) {
	const cancelledResult = () => ({
		exitCode: 130,
		timedOut: false,
		success: false,
		stdout: "",
		stderr: "Claude CLI invocation cancelled",
		error: null,
		truncated: false
	});
	if (params.signal?.aborted) return cancelledResult();
	let promptDir;
	let argv = params.argv;
	try {
		if (params.request.systemPrompt !== void 0) {
			promptDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-node-claude-prompt-"));
			const promptPath = path.join(promptDir, "system-prompt.md");
			await fs$1.writeFile(promptPath, params.request.systemPrompt, { mode: 384 });
			argv = [
				...argv,
				"--append-system-prompt-file",
				promptPath
			];
		}
		if (params.signal?.aborted) return cancelledResult();
		return await new Promise((resolve) => {
			let settled = false;
			let hardTimedOut = false;
			let idleTimedOut = false;
			let cancelled = false;
			let truncated = false;
			let outputBytes = 0;
			let stderr = "";
			const decoder = new StringDecoder("utf8");
			const stderrDecoder = new StringDecoder("utf8");
			const terminalDecoder = new StringDecoder("utf8");
			let terminalLineBuffer = "";
			let terminalLineTouchesTruncation = false;
			let terminalResultLine;
			const invocation = resolveSafeChildProcessInvocation({
				argv,
				cwd: params.cwd,
				env: params.env ?? process.env
			});
			const stdio = [
				"pipe",
				"pipe",
				"pipe"
			];
			addSecretInputStdio(stdio, params.secretInput);
			const child = spawn(invocation.command, invocation.args, {
				cwd: params.cwd,
				env: params.env,
				stdio,
				...process.platform !== "win32" ? { detached: true } : {},
				windowsHide: invocation.windowsHide,
				windowsVerbatimArguments: invocation.windowsVerbatimArguments
			});
			const kill = () => {
				const pid = child.pid;
				if (typeof pid === "number" && pid > 0) signalProcessTree(pid, "SIGKILL", { detached: process.platform !== "win32" });
				try {
					child.kill("SIGKILL");
				} catch {}
			};
			const progress = createNodeInvokeProgressWriter({
				client: params.client,
				frame: params.frame,
				idleTimeoutMs: params.request.idleTimeoutMs,
				onError: kill
			});
			const abortRun = () => {
				cancelled = true;
				kill();
			};
			params.signal?.addEventListener("abort", abortRun, { once: true });
			if (params.signal?.aborted) abortRun();
			const hardTimer = setTimeout(() => {
				hardTimedOut = true;
				kill();
			}, params.timeoutMs ?? params.request.timeoutMs);
			let idleTimer;
			const resetIdleTimer = () => {
				clearTimeout(idleTimer);
				idleTimer = setTimeout(() => {
					idleTimedOut = true;
					kill();
				}, params.request.idleTimeoutMs);
			};
			resetIdleTimer();
			const retain = (chunk) => {
				if (outputBytes >= OUTPUT_CAP_BYTES) {
					truncated = true;
					return Buffer.alloc(0);
				}
				const remaining = OUTPUT_CAP_BYTES - outputBytes;
				const retained = chunk.length > remaining ? chunk.subarray(0, remaining) : chunk;
				outputBytes += retained.length;
				if (retained.length !== chunk.length) truncated = true;
				return retained;
			};
			const captureTerminalLines = (raw, touchesTruncation) => {
				terminalLineBuffer += terminalDecoder.write(raw);
				terminalLineTouchesTruncation ||= touchesTruncation;
				while (true) {
					const newline = terminalLineBuffer.indexOf("\n");
					if (newline < 0) break;
					const line = terminalLineBuffer.slice(0, newline).replace(/\r$/u, "");
					terminalLineBuffer = terminalLineBuffer.slice(newline + 1);
					if (terminalLineTouchesTruncation && Buffer.byteLength(line, "utf8") <= TERMINAL_EVENT_MAX_BYTES && isClaudeResultLine(line)) terminalResultLine = line;
					terminalLineTouchesTruncation = touchesTruncation;
				}
				if (Buffer.byteLength(terminalLineBuffer, "utf8") > TERMINAL_EVENT_MAX_BYTES) {
					terminalLineBuffer = "";
					terminalLineTouchesTruncation = false;
				}
			};
			const ignoreOutputStreamError = () => {};
			child.stdout.on("error", ignoreOutputStreamError);
			child.stderr.on("error", ignoreOutputStreamError);
			child.stdout.on("data", (raw) => {
				const retained = retain(raw);
				if (retained.length > 0) captureTerminalLines(retained, false);
				if (retained.length < raw.length) captureTerminalLines(raw.subarray(retained.length), true);
				resetIdleTimer();
				if (retained.length === 0) {
					progress.queueHeartbeat();
					return;
				}
				const text = decoder.write(retained);
				progress.write(text, child.stdout);
			});
			child.stderr.on("data", (raw) => {
				retain(raw);
				stderr = truncateUtf8Suffix(`${stderr}${stderrDecoder.write(raw)}`, STDERR_TAIL_BYTES);
				resetIdleTimer();
				progress.queueHeartbeat();
			});
			child.stdin.on("error", () => {});
			child.stdin.end(params.request.stdin ?? "");
			const finish = async (exitCode, error) => {
				if (settled) return;
				settled = true;
				clearTimeout(hardTimer);
				clearTimeout(idleTimer);
				progress.stopHeartbeats();
				params.signal?.removeEventListener("abort", abortRun);
				const finalText = decoder.end();
				if (finalText) progress.write(finalText);
				const terminalText = terminalDecoder.end();
				if (terminalText) terminalLineBuffer += terminalText;
				const finalStderr = stderrDecoder.end();
				if (finalStderr) stderr = truncateUtf8Suffix(`${stderr}${finalStderr}`, STDERR_TAIL_BYTES);
				if (terminalLineTouchesTruncation && Buffer.byteLength(terminalLineBuffer, "utf8") <= TERMINAL_EVENT_MAX_BYTES && isClaudeResultLine(terminalLineBuffer)) terminalResultLine = terminalLineBuffer;
				if (truncated && terminalResultLine) progress.write(`\n${terminalResultLine}\n`);
				await progress.flush();
				progress.stop();
				const timeoutMessage = idleTimedOut ? "Claude CLI produced no output before the idle timeout" : hardTimedOut ? "Claude CLI exceeded the hard timeout" : "";
				const finalError = progress.error ?? error;
				resolve({
					exitCode: exitCode ?? (idleTimedOut || hardTimedOut ? 124 : cancelled ? 130 : 1),
					timedOut: idleTimedOut || hardTimedOut,
					noOutputTimedOut: idleTimedOut,
					success: exitCode === 0 && !idleTimedOut && !hardTimedOut && !cancelled && !finalError,
					stdout: "",
					stderr: truncateUtf8Suffix([
						stderr,
						timeoutMessage,
						cancelled ? "Claude CLI invocation cancelled" : "",
						finalError?.message
					].filter(Boolean).join("\n"), STDERR_TAIL_BYTES),
					error: finalError?.message ?? null,
					truncated
				});
			};
			writeSecretInputToChild(child, params.secretInput).catch((error) => {
				kill();
				finish(null, error instanceof Error ? error : new Error(String(error)));
			});
			child.once("error", (error) => void finish(null, error));
			child.once("close", (code) => void finish(code));
		});
	} finally {
		if (promptDir) await fs$1.rm(promptDir, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
//#region src/node-host/exec-policy.ts
/** Evaluates node-host exec policy from security, approval, and allowlist context. */
/** Normalizes raw approval decisions from node-host payloads. */
function resolveExecApprovalDecision(value) {
	if (value === "allow-once" || value === "allow-always") return value;
	return null;
}
function formatSystemRunAllowlistMissMessage(params) {
	if (params?.windowsShellWrapperBlocked) return "SYSTEM_RUN_DENIED: allowlist miss (Windows shell wrappers like cmd.exe /c require approval; approve once/always or run with --ask on-miss|always)";
	return "SYSTEM_RUN_DENIED: allowlist miss";
}
/** Combines exec security, allowlist analysis, and approval state into an allow/deny decision. */
function evaluateSystemRunPolicy(params) {
	const windowsShellWrapperBlocked = params.security === "allowlist" && params.shellWrapperInvocation && params.isWindows && params.cmdInvocation;
	const shellWrapperBlocked = windowsShellWrapperBlocked;
	const analysisOk = shellWrapperBlocked ? false : params.analysisOk;
	const allowlistSatisfied = shellWrapperBlocked ? false : params.allowlistSatisfied;
	const approvedByAsk = params.approvalDecision !== null || params.approved === true;
	if (params.security === "deny") return {
		allowed: false,
		eventReason: "security=deny",
		errorMessage: "SYSTEM_RUN_DISABLED: security=deny",
		analysisOk,
		allowlistSatisfied,
		shellWrapperBlocked,
		windowsShellWrapperBlocked,
		requiresAsk: false,
		approvalDecision: params.approvalDecision,
		approvedByAsk
	};
	const requiresAsk = requiresExecApproval({
		ask: params.ask,
		security: params.security,
		analysisOk,
		allowlistSatisfied,
		durableApprovalSatisfied: params.durableApprovalSatisfied
	});
	if (requiresAsk && !approvedByAsk) return {
		allowed: false,
		eventReason: "approval-required",
		errorMessage: "SYSTEM_RUN_DENIED: approval required",
		analysisOk,
		allowlistSatisfied,
		shellWrapperBlocked,
		windowsShellWrapperBlocked,
		requiresAsk,
		approvalDecision: params.approvalDecision,
		approvedByAsk
	};
	if (params.security === "allowlist" && (!analysisOk || !allowlistSatisfied) && !approvedByAsk) {
		if (params.durableApprovalSatisfied) return {
			allowed: true,
			analysisOk,
			allowlistSatisfied,
			shellWrapperBlocked,
			windowsShellWrapperBlocked,
			requiresAsk,
			approvalDecision: params.approvalDecision,
			approvedByAsk
		};
		return {
			allowed: false,
			eventReason: "allowlist-miss",
			errorMessage: formatSystemRunAllowlistMissMessage({ windowsShellWrapperBlocked }),
			analysisOk,
			allowlistSatisfied,
			shellWrapperBlocked,
			windowsShellWrapperBlocked,
			requiresAsk,
			approvalDecision: params.approvalDecision,
			approvedByAsk
		};
	}
	return {
		allowed: true,
		analysisOk,
		allowlistSatisfied,
		shellWrapperBlocked,
		windowsShellWrapperBlocked,
		requiresAsk,
		approvalDecision: params.approvalDecision,
		approvedByAsk
	};
}
//#endregion
//#region src/node-host/invoke-system-run-allowlist.ts
/** Resolves system.run allowlist matches, argv plans, and truncated command output. */
/**
* Allowlist analysis and argv rewriting for node-host system.run.
*
* This module keeps command approval analysis separate from process execution,
* and only rewrites shell transports when the rebuilt command still satisfies policy.
*/
const POSIX_PARSEABLE_SHELL_WRAPPER_NAMES = POSIX_PARSEABLE_SHELL_WRAPPERS;
const POSIX_SHELL_WRAPPER_NAMES = POSIX_SHELL_WRAPPERS;
/** Evaluates analyzed command segments against allowlist and trusted safe-bin policy. */
async function evaluateSystemRunAllowlist(params) {
	if (params.shellCommand) {
		const allowlistEval = await evaluateShellAllowlistWithAuthorization({
			command: params.shellCommand,
			allowlist: params.approvals.allowlist,
			safeBins: params.safeBins,
			safeBinProfiles: params.safeBinProfiles,
			cwd: params.cwd,
			env: params.env,
			trustedSafeBinDirs: params.trustedSafeBinDirs,
			skillBins: params.skillBins,
			autoAllowSkills: params.autoAllowSkills,
			platform: process.platform
		});
		return {
			analysisOk: allowlistEval.analysisOk,
			allowlistMatches: allowlistEval.allowlistMatches,
			allowlistSatisfied: params.security === "allowlist" && allowlistEval.analysisOk ? allowlistEval.allowlistSatisfied : false,
			allowlistAuthorizationSatisfied: allowlistEval.analysisOk && allowlistEval.allowlistSatisfied,
			segments: allowlistEval.segments,
			segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
			segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy,
			...allowlistEval.authorizationPlan ? { authorizationPlan: allowlistEval.authorizationPlan } : {}
		};
	}
	const analysis = analyzeArgvCommand({
		argv: params.argv,
		cwd: params.cwd,
		env: params.env
	});
	const allowlistEval = evaluateExecAllowlist({
		analysis,
		allowlist: params.approvals.allowlist,
		safeBins: params.safeBins,
		safeBinProfiles: params.safeBinProfiles,
		cwd: params.cwd,
		trustedSafeBinDirs: params.trustedSafeBinDirs,
		skillBins: params.skillBins,
		autoAllowSkills: params.autoAllowSkills
	});
	return {
		analysisOk: analysis.ok,
		allowlistMatches: allowlistEval.allowlistMatches,
		allowlistSatisfied: params.security === "allowlist" && analysis.ok ? allowlistEval.allowlistSatisfied : false,
		allowlistAuthorizationSatisfied: analysis.ok && allowlistEval.allowlistSatisfied,
		segments: analysis.segments,
		segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
		segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy
	};
}
/** Resolve the single planned argv that can replace the caller argv after allowlist approval. */
function resolvePlannedAllowlistArgv(params) {
	if (params.security !== "allowlist" || params.policy.approvedByAsk || params.shellCommand || !params.policy.analysisOk || !params.policy.allowlistSatisfied || params.segments.length !== 1) return;
	const plannedAllowlistArgv = resolvePlannedSegmentArgv(expectDefined(params.segments[0], "segments entry at 0"));
	return plannedAllowlistArgv && plannedAllowlistArgv.length > 0 ? plannedAllowlistArgv : null;
}
/** Resolve final argv after safe-bin shell rewriting. */
async function resolveSystemRunExecArgv(params) {
	let execArgv = params.plannedAllowlistArgv ?? params.argv;
	const transportKind = params.shellCommand ? resolvePosixShellInlineCommandTransportKind(params.argv) : "none";
	if (params.security === "allowlist" && !params.policy.approvedByAsk && params.shellCommand && params.policy.analysisOk && params.policy.allowlistSatisfied && transportKind === "opaque") return null;
	if (params.security === "allowlist" && params.isWindows && !params.policy.approvedByAsk && params.shellCommand && params.policy.analysisOk && params.policy.allowlistSatisfied && params.segments.length === 1) {
		const plannedArgv = resolvePlannedSegmentArgv(expectDefined(params.segments[0], "segments entry at 0"));
		if (!plannedArgv) return null;
		execArgv = plannedArgv;
	}
	if (params.security === "allowlist" && !params.isWindows && !params.policy.approvedByAsk && params.shellCommand && params.policy.analysisOk && params.policy.allowlistSatisfied) {
		if (transportKind !== "parseable" || !params.segmentSatisfiedBy.some((entry) => entry === "safeBins" || entry === "inlineChain")) return execArgv;
		if (!params.authorizationPlan) return null;
		const rebuilt = buildAuthorizedShellCommandFromPlan({
			plan: params.authorizationPlan,
			mode: "safeBins",
			segmentSatisfiedBy: params.segmentSatisfiedBy
		});
		if (!rebuilt.ok || !rebuilt.command) return null;
		const rewrittenArgv = replacePosixShellInlineCommand({
			argv: params.argv,
			oldCommand: params.shellCommand,
			nextCommand: rebuilt.command
		});
		if (!rewrittenArgv) return null;
		execArgv = rewrittenArgv;
	}
	return execArgv;
}
function resolvePosixShellInlineCommandTransportKind(argv) {
	const transportArgv = resolveShellWrapperTransportArgv(argv);
	if (!transportArgv) return "none";
	const executable = normalizeExecutableToken(transportArgv[0] ?? "");
	if (!POSIX_SHELL_WRAPPER_NAMES.has(executable)) return "none";
	return POSIX_PARSEABLE_SHELL_WRAPPER_NAMES.has(executable) ? "parseable" : "opaque";
}
function findSubsequence(haystack, needle) {
	if (needle.length === 0 || needle.length > haystack.length) return -1;
	for (let start = 0; start <= haystack.length - needle.length; start += 1) {
		let matches = true;
		for (let offset = 0; offset < needle.length; offset += 1) if (haystack[start + offset] !== needle[offset]) {
			matches = false;
			break;
		}
		if (matches) return start;
	}
	return -1;
}
function replacePosixShellInlineCommand(params) {
	const transportArgv = resolveShellWrapperTransportArgv(params.argv);
	if (!transportArgv || !POSIX_PARSEABLE_SHELL_WRAPPER_NAMES.has(normalizeExecutableToken(transportArgv[0] ?? ""))) return null;
	const transportStart = findSubsequence(params.argv, transportArgv);
	if (transportStart < 0) return null;
	const match = resolveInlineCommandMatch(transportArgv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
	if (match.valueTokenIndex === null) return null;
	const absoluteValueIndex = transportStart + match.valueTokenIndex;
	const token = params.argv[absoluteValueIndex];
	if (token === void 0) return null;
	const rewritten = [...params.argv];
	if (token === params.oldCommand) {
		rewritten[absoluteValueIndex] = params.nextCommand;
		return rewritten;
	}
	if (token.endsWith(params.oldCommand)) {
		rewritten[absoluteValueIndex] = token.slice(0, token.length - params.oldCommand.length) + params.nextCommand;
		return rewritten;
	}
	return null;
}
/** Mark truncated output in stderr when possible, otherwise stdout. */
/** Truncates captured stdout/stderr in place to the node-host output cap. */
function applyOutputTruncation(result) {
	if (!result.truncated) return;
	const suffix = "... (truncated)";
	if (result.stderr.trim().length > 0) result.stderr = `${result.stderr}\n${suffix}`;
	else result.stdout = `${result.stdout}\n${suffix}`;
}
//#endregion
//#region src/node-host/invoke-system-run-plan.ts
/** Builds and revalidates system.run approval plans for cwd and mutable executable operands. */
const MUTABLE_ARGV1_INTERPRETER_PATTERNS = [
	/^(?:node|nodejs)$/,
	/^perl$/,
	/^php$/,
	/^python(?:\d+(?:\.\d+)*)?$/,
	/^ruby$/
];
const GENERIC_MUTABLE_SCRIPT_RUNNERS = /* @__PURE__ */ new Set([
	"esno",
	"jiti",
	"ts-node",
	"ts-node-esm",
	"tsx",
	"vite-node"
]);
const OPAQUE_MUTABLE_SCRIPT_RUNNERS = /* @__PURE__ */ new Set(["busybox", "toybox"]);
const BUN_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"add",
	"audit",
	"completions",
	"create",
	"exec",
	"help",
	"init",
	"install",
	"link",
	"outdated",
	"patch",
	"pm",
	"publish",
	"remove",
	"repl",
	"run",
	"test",
	"unlink",
	"update",
	"upgrade",
	"x"
]);
const BUN_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--backend",
	"--bunfig",
	"--conditions",
	"--config",
	"--console-depth",
	"--cwd",
	"--define",
	"--elide-lines",
	"--env-file",
	"--extension-order",
	"--filter",
	"--hot",
	"--inspect",
	"--inspect-brk",
	"--inspect-wait",
	"--install",
	"--jsx-factory",
	"--jsx-fragment",
	"--jsx-import-source",
	"--loader",
	"--origin",
	"--port",
	"--preload",
	"--smol",
	"--tsconfig-override",
	"-c",
	"-e",
	"-p",
	"-r"
]);
const DENO_RUN_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--cached-only",
	"--cert",
	"--config",
	"--env-file",
	"--ext",
	"--harmony-import-attributes",
	"--import-map",
	"--inspect",
	"--inspect-brk",
	"--inspect-wait",
	"--location",
	"--log-level",
	"--lock",
	"--node-modules-dir",
	"--no-check",
	"--preload",
	"--reload",
	"--seed",
	"--strace-ops",
	"--unstable-bare-node-builtins",
	"--v8-flags",
	"--watch",
	"--watch-exclude",
	"-L"
]);
const NODE_OPTIONS_WITH_FILE_VALUE = /* @__PURE__ */ new Set([
	"-r",
	"--experimental-loader",
	"--import",
	"--loader",
	"--require"
]);
const RUBY_UNSAFE_APPROVAL_FLAGS = /* @__PURE__ */ new Set([
	"-I",
	"-r",
	"--require"
]);
const PERL_UNSAFE_APPROVAL_FLAGS = /* @__PURE__ */ new Set([
	"-I",
	"-M",
	"-m"
]);
function normalizeOptionFlag(token) {
	return normalizeLowercaseStringOrEmpty(parseInlineOptionToken(token).name);
}
function readTrimmedArgToken(argv, index) {
	return normalizeNullableString(argv[index]) ?? "";
}
const POSIX_SHELL_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--init-file",
	"--rcfile",
	"--startup-script",
	"-O",
	"-o",
	"+O",
	"+o"
]);
const POSIX_SHELLS_WITH_PLUS_OPTIONS = /* @__PURE__ */ new Set([
	"ash",
	"bash",
	"dash",
	"ksh",
	"mksh",
	"osh",
	"sh",
	"yash",
	"zsh"
]);
function isPosixShellOptionToken(token, supportsPlusOptions) {
	return token.startsWith("-") || supportsPlusOptions && token.startsWith("+");
}
function pathComponentsFromRootSync(targetPath) {
	const absolute = path.resolve(targetPath);
	const parts = [];
	let cursor = absolute;
	while (true) {
		parts.unshift(cursor);
		const parent = path.dirname(cursor);
		if (parent === cursor) return parts;
		cursor = parent;
	}
}
function isOwnedByCurrentProcessSync(candidate) {
	if (process.platform === "win32" || typeof process.getuid !== "function") return false;
	try {
		return fs.statSync(candidate).uid === process.getuid();
	} catch {
		return false;
	}
}
function isMutableByCurrentProcessSync(candidate) {
	try {
		fs.accessSync(candidate, fs.constants.W_OK);
		return true;
	} catch {
		return isOwnedByCurrentProcessSync(candidate);
	}
}
function hasMutableSymlinkPathComponentSync(targetPath) {
	for (const component of pathComponentsFromRootSync(targetPath)) try {
		if (!fs.lstatSync(component).isSymbolicLink()) continue;
		if (isMutableByCurrentProcessSync(path.dirname(component))) return true;
	} catch {
		return true;
	}
	return false;
}
function pathLooksMutableForShellPayloadSync(targetPath) {
	if (isMutableByCurrentProcessSync(targetPath) || isMutableByCurrentProcessSync(path.dirname(targetPath)) || hasMutableSymlinkPathComponentSync(targetPath)) return true;
	let realPath;
	try {
		realPath = fs.realpathSync(targetPath);
	} catch {
		return true;
	}
	return isMutableByCurrentProcessSync(realPath) || isMutableByCurrentProcessSync(path.dirname(realPath)) || hasMutableSymlinkPathComponentSync(realPath);
}
function shouldPinExecutableForApproval(params) {
	if (params.shellCommand !== null) return false;
	return (params.wrapperChain?.length ?? 0) === 0;
}
function hashFileContentsSync(filePath) {
	return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}
function looksLikePathToken(token) {
	return token.startsWith(".") || token.startsWith("/") || token.startsWith("\\") || token.includes("/") || token.includes("\\") || path.extname(token).length > 0;
}
function resolvesToExistingFileSync(rawOperand, cwd) {
	if (!rawOperand) return false;
	try {
		return fs.statSync(path.resolve(cwd ?? process.cwd(), rawOperand)).isFile();
	} catch {
		return false;
	}
}
function isKnownBinaryExecutableHeader(buffer) {
	if (buffer.length >= 4 && buffer.subarray(0, 4).equals(Buffer.from([
		127,
		69,
		76,
		70
	]))) return true;
	if (buffer.length >= 4 && (buffer.subarray(0, 4).equals(Buffer.from([
		254,
		237,
		250,
		206
	])) || buffer.subarray(0, 4).equals(Buffer.from([
		206,
		250,
		237,
		254
	])) || buffer.subarray(0, 4).equals(Buffer.from([
		254,
		237,
		250,
		207
	])) || buffer.subarray(0, 4).equals(Buffer.from([
		207,
		250,
		237,
		254
	])) || buffer.subarray(0, 4).equals(Buffer.from([
		202,
		254,
		186,
		190
	])) || buffer.subarray(0, 4).equals(Buffer.from([
		190,
		186,
		254,
		202
	])) || buffer.subarray(0, 4).equals(Buffer.from([
		202,
		254,
		186,
		191
	])) || buffer.subarray(0, 4).equals(Buffer.from([
		191,
		186,
		254,
		202
	])))) return true;
	if (buffer.length < 64 || !buffer.subarray(0, 2).equals(Buffer.from([77, 90]))) return false;
	const peOffset = buffer.readUInt32LE(60);
	return peOffset >= 0 && peOffset <= buffer.length - 4 && buffer.subarray(peOffset, peOffset + 4).equals(Buffer.from([
		80,
		69,
		0,
		0
	]));
}
function isLikelyScriptLikePathSync(targetPath) {
	let stat;
	try {
		stat = fs.statSync(targetPath);
	} catch {
		return true;
	}
	if (!stat.isFile()) return true;
	let header;
	try {
		const fd = fs.openSync(targetPath, "r");
		try {
			header = Buffer.alloc(1024);
			const bytesRead = readFileWindowFullySync(fd, header, 0);
			header = header.subarray(0, bytesRead);
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return true;
	}
	if (header.length === 0) return true;
	if (header.subarray(0, 2).equals(Buffer.from("#!"))) return true;
	if (isKnownBinaryExecutableHeader(header)) return false;
	return true;
}
function unwrapArgvForMutableOperand(argv) {
	let current = argv;
	let baseIndex = 0;
	let opaqueMultiplexerSeen = false;
	while (true) {
		const dispatchUnwrap = unwrapKnownDispatchWrapperInvocation(current);
		if (dispatchUnwrap.kind === "unwrapped") {
			baseIndex += current.length - dispatchUnwrap.argv.length;
			current = dispatchUnwrap.argv;
			continue;
		}
		const shellMultiplexerUnwrap = unwrapKnownShellMultiplexerInvocation(current);
		if (shellMultiplexerUnwrap.kind === "unwrapped") {
			if (OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(shellMultiplexerUnwrap.wrapper)) opaqueMultiplexerSeen = true;
			baseIndex += current.length - shellMultiplexerUnwrap.argv.length;
			current = shellMultiplexerUnwrap.argv;
			continue;
		}
		const packageManagerUnwrap = unwrapKnownPackageManagerExecInvocation(current);
		if (packageManagerUnwrap) {
			baseIndex += current.length - packageManagerUnwrap.length;
			current = packageManagerUnwrap;
			continue;
		}
		return {
			argv: current,
			baseIndex,
			opaqueMultiplexerSeen
		};
	}
}
function resolvePosixShellScriptOperandIndex(argv, executable) {
	const supportsPlusOptions = POSIX_SHELLS_WITH_PLUS_OPTIONS.has(executable);
	if (resolveInlineCommandMatch(argv, POSIX_INLINE_COMMAND_FLAGS, {
		allowCombinedC: true,
		isOptionToken: (token) => isPosixShellOptionToken(token, supportsPlusOptions),
		stopAtFirstNonOption: true
	}).valueTokenIndex !== null) return null;
	let afterDoubleDash = false;
	for (let i = 1; i < argv.length; i += 1) {
		const token = readTrimmedArgToken(argv, i);
		if (!token) continue;
		if (token === "-") return null;
		if (!afterDoubleDash && token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (!afterDoubleDash && token === "-s") return null;
		if (!afterDoubleDash && isPosixShellOptionToken(token, supportsPlusOptions)) {
			const flag = normalizeOptionFlag(token);
			if (POSIX_SHELL_OPTIONS_WITH_VALUE.has(flag)) {
				if (!token.includes("=")) i += 1;
				continue;
			}
			i += advancePosixInlineOptionScan(token) - 1;
			continue;
		}
		return i;
	}
	return null;
}
function resolveOptionFilteredFileOperandIndex(params) {
	let afterDoubleDash = false;
	for (let i = params.startIndex; i < params.argv.length; i += 1) {
		const token = readTrimmedArgToken(params.argv, i);
		if (!token) continue;
		if (afterDoubleDash) return resolvesToExistingFileSync(token, params.cwd) ? i : null;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-") return null;
		if (token.startsWith("-")) {
			if (!token.includes("=") && params.optionsWithValue?.has(token)) i += 1;
			continue;
		}
		return resolvesToExistingFileSync(token, params.cwd) ? i : null;
	}
	return null;
}
function resolveOptionFilteredPositionalIndex(params) {
	let afterDoubleDash = false;
	for (let i = params.startIndex; i < params.argv.length; i += 1) {
		const token = readTrimmedArgToken(params.argv, i);
		if (!token) continue;
		if (afterDoubleDash) return i;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-") return null;
		if (token.startsWith("-")) {
			if (!token.includes("=") && params.optionsWithValue?.has(token)) i += 1;
			continue;
		}
		return i;
	}
	return null;
}
function collectExistingFileOperandIndexes(params) {
	let afterDoubleDash = false;
	const hits = [];
	for (let i = params.startIndex; i < params.argv.length; i += 1) {
		const token = readTrimmedArgToken(params.argv, i);
		if (!token) continue;
		if (afterDoubleDash) {
			if (resolvesToExistingFileSync(token, params.cwd)) hits.push(i);
			continue;
		}
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-") return {
			hits: [],
			sawOptionValueFile: false
		};
		if (token.startsWith("-")) {
			const option = parseInlineOptionToken(token);
			const flag = option.name;
			const inlineValue = option.hasInlineValue ? option.inlineValue : void 0;
			if (params.optionsWithFileValue?.has(normalizeLowercaseStringOrEmpty(flag))) {
				if (inlineValue && resolvesToExistingFileSync(inlineValue, params.cwd)) {
					hits.push(i);
					return {
						hits,
						sawOptionValueFile: true
					};
				}
				const nextToken = readTrimmedArgToken(params.argv, i + 1);
				if (!inlineValue && nextToken && resolvesToExistingFileSync(nextToken, params.cwd)) {
					hits.push(i + 1);
					return {
						hits,
						sawOptionValueFile: true
					};
				}
			}
			continue;
		}
		if (resolvesToExistingFileSync(token, params.cwd)) hits.push(i);
	}
	return {
		hits,
		sawOptionValueFile: false
	};
}
function resolveGenericInterpreterScriptOperandIndex(params) {
	const collection = collectExistingFileOperandIndexes({
		argv: params.argv,
		startIndex: 1,
		cwd: params.cwd,
		optionsWithFileValue: params.optionsWithFileValue
	});
	if (collection.sawOptionValueFile) return null;
	return collection.hits.length === 1 ? expectDefined(collection.hits[0], "hits entry at 0") : null;
}
function resolveBunScriptOperandIndex(params) {
	const directIndex = resolveOptionFilteredPositionalIndex({
		argv: params.argv,
		startIndex: 1,
		optionsWithValue: BUN_OPTIONS_WITH_VALUE
	});
	if (directIndex === null) return null;
	const directToken = readTrimmedArgToken(params.argv, directIndex);
	if (directToken === "run") return resolveOptionFilteredFileOperandIndex({
		argv: params.argv,
		startIndex: directIndex + 1,
		cwd: params.cwd,
		optionsWithValue: BUN_OPTIONS_WITH_VALUE
	});
	if (BUN_SUBCOMMANDS.has(directToken)) return null;
	if (!looksLikePathToken(directToken)) return null;
	return directIndex;
}
function resolveDenoRunScriptOperandIndex(params) {
	if (readTrimmedArgToken(params.argv, 1) !== "run") return null;
	return resolveOptionFilteredFileOperandIndex({
		argv: params.argv,
		startIndex: 2,
		cwd: params.cwd,
		optionsWithValue: DENO_RUN_OPTIONS_WITH_VALUE
	});
}
function hasRubyUnsafeApprovalFlag(argv) {
	let afterDoubleDash = false;
	for (let i = 1; i < argv.length; i += 1) {
		const token = readTrimmedArgToken(argv, i);
		if (!token) continue;
		if (afterDoubleDash) return false;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-I" || token === "-r") return true;
		if (token.startsWith("-I") || token.startsWith("-r")) return true;
		if (RUBY_UNSAFE_APPROVAL_FLAGS.has(normalizeLowercaseStringOrEmpty(token))) return true;
	}
	return false;
}
function hasPerlUnsafeApprovalFlag(argv) {
	let afterDoubleDash = false;
	for (let i = 1; i < argv.length; i += 1) {
		const token = readTrimmedArgToken(argv, i);
		if (!token) continue;
		if (afterDoubleDash) return false;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-I" || token === "-M" || token === "-m") return true;
		if (token.startsWith("-I") || token.startsWith("-M") || token.startsWith("-m")) return true;
		if (PERL_UNSAFE_APPROVAL_FLAGS.has(token)) return true;
	}
	return false;
}
function isMutableScriptRunner(executable) {
	return GENERIC_MUTABLE_SCRIPT_RUNNERS.has(executable) || OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(executable) || isInterpreterLikeSafeBin(executable);
}
function resolveMutableFileOperandIndex(argv, cwd) {
	const unwrapped = unwrapArgvForMutableOperand(argv);
	const executable = normalizeExecutableToken(unwrapped.argv[0] ?? "");
	if (!executable) return null;
	if (unwrapped.opaqueMultiplexerSeen || OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(executable)) return null;
	if (POSIX_SHELL_WRAPPERS.has(executable)) {
		if (!POSIX_PARSEABLE_SHELL_WRAPPERS.has(executable)) return null;
		const shellIndex = resolvePosixShellScriptOperandIndex(unwrapped.argv, executable);
		return shellIndex === null ? null : unwrapped.baseIndex + shellIndex;
	}
	if (MUTABLE_ARGV1_INTERPRETER_PATTERNS.some((pattern) => pattern.test(executable))) {
		const operand = readTrimmedArgToken(unwrapped.argv, 1);
		if (operand && operand !== "-" && !operand.startsWith("-")) return unwrapped.baseIndex + 1;
	}
	if (executable === "bun") {
		const bunIndex = resolveBunScriptOperandIndex({
			argv: unwrapped.argv,
			cwd
		});
		if (bunIndex !== null) return unwrapped.baseIndex + bunIndex;
	}
	if (executable === "deno") {
		const denoIndex = resolveDenoRunScriptOperandIndex({
			argv: unwrapped.argv,
			cwd
		});
		if (denoIndex !== null) return unwrapped.baseIndex + denoIndex;
	}
	if (executable === "ruby" && hasRubyUnsafeApprovalFlag(unwrapped.argv)) return null;
	if (executable === "perl" && hasPerlUnsafeApprovalFlag(unwrapped.argv)) return null;
	if (!isMutableScriptRunner(executable)) return null;
	const genericIndex = resolveGenericInterpreterScriptOperandIndex({
		argv: unwrapped.argv,
		cwd,
		optionsWithFileValue: executable === "node" || executable === "nodejs" ? NODE_OPTIONS_WITH_FILE_VALUE : void 0
	});
	return genericIndex === null ? null : unwrapped.baseIndex + genericIndex;
}
function shellPayloadNeedsStableBinding(shellCommand, cwd) {
	const argv = splitShellArgs(shellCommand);
	if (!argv || argv.length === 0) return false;
	const snapshot = resolveMutableFileOperandSnapshotSync({
		argv,
		cwd,
		shellCommand: null
	});
	if (!snapshot.ok) return true;
	if (snapshot.snapshot) return true;
	const firstToken = readTrimmedArgToken(argv, 0);
	if (!resolvesToExistingFileSync(firstToken, cwd)) return false;
	if (!path.isAbsolute(firstToken)) return true;
	const resolvedPath = path.resolve(cwd ?? process.cwd(), firstToken);
	if (pathLooksMutableForShellPayloadSync(resolvedPath)) return true;
	return isLikelyScriptLikePathSync(resolvedPath);
}
function requiresStableInterpreterApprovalBindingWithShellCommand(params) {
	const unwrapped = unwrapArgvForMutableOperand(params.argv);
	if (unwrapped.opaqueMultiplexerSeen) return true;
	if (params.shellCommand !== null) return shellPayloadNeedsStableBinding(params.shellCommand, params.cwd);
	if (pnpmDlxInvocationNeedsFailClosedBinding(params.argv, params.cwd)) return true;
	const executable = normalizeExecutableToken(unwrapped.argv[0] ?? "");
	if (!executable) return false;
	if (POSIX_SHELL_WRAPPERS.has(executable)) return false;
	return isMutableScriptRunner(executable);
}
function pnpmDlxInvocationNeedsFailClosedBinding(argv, cwd) {
	if (normalizePackageManagerExecToken(argv[0] ?? "") !== "pnpm") return false;
	let idx = 1;
	while (idx < argv.length) {
		const token = readTrimmedArgToken(argv, idx);
		if (!token) {
			idx += 1;
			continue;
		}
		if (token === "--") {
			idx += 1;
			continue;
		}
		if (!token.startsWith("-")) {
			if (token !== "dlx") return false;
			return pnpmDlxTailNeedsFailClosedBinding(argv.slice(idx + 1), cwd);
		}
		const parsedOption = parseInlineOptionToken(token);
		const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
		if (PNPM_OPTIONS_WITH_VALUE.has(flag) || PNPM_DLX_OPTIONS_WITH_VALUE.has(flag)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE.has(parsedOption.name)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_FLAG_OPTIONS.has(flag)) {
			idx += 1;
			continue;
		}
		return true;
	}
	return false;
}
function pnpmDlxTailNeedsFailClosedBinding(argv, cwd) {
	let idx = 0;
	while (idx < argv.length) {
		const token = readTrimmedArgToken(argv, idx);
		if (!token) {
			idx += 1;
			continue;
		}
		if (token === "--") return pnpmDlxTailMayNeedStableBinding(argv.slice(idx + 1), cwd);
		if (!token.startsWith("-")) return pnpmDlxTailMayNeedStableBinding(argv.slice(idx), cwd);
		const parsedOption = parseInlineOptionToken(token);
		const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
		if (flag === "-c" || flag === "--shell-mode") return false;
		if (PNPM_OPTIONS_WITH_VALUE.has(flag) || PNPM_DLX_OPTIONS_WITH_VALUE.has(flag)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE.has(parsedOption.name)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_FLAG_OPTIONS.has(flag)) {
			idx += 1;
			continue;
		}
		return true;
	}
	return true;
}
function pnpmDlxTailMayNeedStableBinding(argv, cwd) {
	const snapshot = resolveMutableFileOperandSnapshotSync({
		argv,
		cwd,
		shellCommand: null
	});
	return snapshot.ok && snapshot.snapshot !== null;
}
/** Captures file identity for a mutable script operand that approval is bound to. */
function resolveMutableFileOperandSnapshotSync(params) {
	const argvIndex = resolveMutableFileOperandIndex(params.argv, params.cwd);
	if (argvIndex === null) {
		if (requiresStableInterpreterApprovalBindingWithShellCommand({
			argv: params.argv,
			shellCommand: params.shellCommand,
			cwd: params.cwd
		})) return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval cannot safely bind this interpreter/runtime command"
		};
		return {
			ok: true,
			snapshot: null
		};
	}
	const rawOperand = readTrimmedArgToken(params.argv, argvIndex);
	if (!rawOperand) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a stable script operand"
	};
	const resolvedPath = path.resolve(params.cwd ?? process.cwd(), rawOperand);
	let realPath;
	let stat;
	try {
		realPath = fs.realpathSync(resolvedPath);
		stat = fs.statSync(realPath);
	} catch {
		return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval requires an existing script operand"
		};
	}
	if (!stat.isFile()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a file script operand"
	};
	return {
		ok: true,
		snapshot: {
			argvIndex,
			path: realPath,
			sha256: hashFileContentsSync(realPath)
		}
	};
}
function resolveCanonicalApprovalCwdSync(cwd) {
	const requestedCwd = path.resolve(cwd);
	let cwdLstat;
	let cwdStat;
	let cwdReal;
	let cwdRealStat;
	try {
		cwdLstat = fs.lstatSync(requestedCwd);
		cwdStat = fs.statSync(requestedCwd);
		cwdReal = fs.realpathSync(requestedCwd);
		cwdRealStat = fs.statSync(cwdReal);
	} catch {
		return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval requires an existing canonical cwd"
		};
	}
	if (!cwdStat.isDirectory()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires cwd to be a directory"
	};
	if (hasMutableSymlinkPathComponentSync(requestedCwd)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires canonical cwd (no symlink path components)"
	};
	if (cwdLstat.isSymbolicLink()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires canonical cwd (no symlink cwd)"
	};
	if (!sameFileIdentity(cwdStat, cwdLstat) || !sameFileIdentity(cwdStat, cwdRealStat) || !sameFileIdentity(cwdLstat, cwdRealStat)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cwd identity mismatch"
	};
	return {
		ok: true,
		snapshot: {
			cwd: cwdReal,
			stat: cwdStat
		}
	};
}
/** Rechecks that the approved cwd still points at the same directory identity. */
function revalidateApprovedCwdSnapshot(params) {
	const current = resolveCanonicalApprovalCwdSync(params.snapshot.cwd);
	if (!current.ok) return false;
	return sameFileIdentity(params.snapshot.stat, current.snapshot.stat);
}
function revalidateApprovedMutableFileOperand(params) {
	const operand = params.argv[params.snapshot.argvIndex]?.trim();
	if (!operand) return false;
	const resolvedPath = path.resolve(params.cwd ?? process.cwd(), operand);
	let realPath;
	try {
		realPath = fs.realpathSync(resolvedPath);
	} catch {
		return false;
	}
	if (realPath !== params.snapshot.path) return false;
	try {
		return hashFileContentsSync(realPath) === params.snapshot.sha256;
	} catch {
		return false;
	}
}
function hardenApprovedExecutionPaths(params) {
	if (!params.approvedByAsk) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: params.cwd,
		approvedCwdSnapshot: void 0
	};
	let hardenedCwd = params.cwd;
	let approvedCwdSnapshot;
	if (hardenedCwd) {
		const canonicalCwd = resolveCanonicalApprovalCwdSync(hardenedCwd);
		if (!canonicalCwd.ok) return canonicalCwd;
		hardenedCwd = canonicalCwd.snapshot.cwd;
		approvedCwdSnapshot = canonicalCwd.snapshot;
	}
	if (params.argv.length === 0) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: hardenedCwd,
		approvedCwdSnapshot
	};
	const resolution = resolveCommandResolutionFromArgv(params.argv, hardenedCwd);
	if (!shouldPinExecutableForApproval({
		shellCommand: params.shellCommand,
		wrapperChain: resolution?.wrapperChain
	})) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: hardenedCwd,
		approvedCwdSnapshot
	};
	const pinnedExecutable = resolution?.execution.resolvedRealPath ?? resolution?.execution.resolvedPath;
	if (!pinnedExecutable) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a stable executable path"
	};
	if (pinnedExecutable === params.argv[0]) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: hardenedCwd,
		approvedCwdSnapshot
	};
	const argv = [...params.argv];
	argv[0] = pinnedExecutable;
	return {
		ok: true,
		argv,
		argvChanged: true,
		cwd: hardenedCwd,
		approvedCwdSnapshot
	};
}
function buildSystemRunApprovalPlan(params) {
	const command = resolveSystemRunCommandRequest({
		command: params.command,
		rawCommand: params.rawCommand
	});
	if (!command.ok) return {
		ok: false,
		message: command.message
	};
	if (command.argv.length === 0) return {
		ok: false,
		message: "command required"
	};
	if (command.shellPayload === null && isBlockedShellWrapperCommand(command.argv)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind this interpreter/runtime command"
	};
	const hardening = hardenApprovedExecutionPaths({
		approvedByAsk: true,
		argv: command.argv,
		shellCommand: command.shellPayload,
		cwd: normalizeNullableString(params.cwd) ?? void 0
	});
	if (!hardening.ok) return {
		ok: false,
		message: hardening.message
	};
	const commandText = formatExecCommand(hardening.argv);
	const commandPreview = command.previewText?.trim() && command.previewText.trim() !== commandText ? command.previewText.trim() : null;
	const mutableFileOperand = resolveMutableFileOperandSnapshotSync({
		argv: hardening.argv,
		cwd: hardening.cwd,
		shellCommand: command.shellPayload
	});
	if (!mutableFileOperand.ok) return {
		ok: false,
		message: mutableFileOperand.message
	};
	return {
		ok: true,
		plan: {
			argv: hardening.argv,
			cwd: hardening.cwd ?? null,
			commandText,
			commandPreview,
			agentId: normalizeNullableString(params.agentId),
			sessionKey: normalizeNullableString(params.sessionKey),
			mutableFileOperand: mutableFileOperand.snapshot ?? void 0
		}
	};
}
//#endregion
//#region src/node-host/invoke-system-run.ts
/** Policy and execution pipeline for approved node-host system.run requests. */
const safeBinTrustedDirWarningCache = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
const APPROVAL_CWD_DRIFT_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval cwd changed before execution";
const APPROVAL_SCRIPT_OPERAND_BINDING_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval missing script operand binding";
const APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval script operand changed before execution";
const APPROVAL_STATE_WRITE_FAILED_MESSAGE = "SYSTEM_RUN_DENIED: approval state could not be persisted";
function warnWritableTrustedDirOnce(message) {
	if (safeBinTrustedDirWarningCache.check(message)) return;
	logWarn(message);
}
function normalizeDeniedReason(reason) {
	switch (reason) {
		case "security=deny":
		case "approval-required":
		case "allowlist-miss":
		case "execution-plan-miss":
		case "companion-unavailable":
		case "permission:screenRecording": return reason;
		default: return "approval-required";
	}
}
function resolveAgentExecConfig(cfg, agentId) {
	if (!agentId) return;
	return resolveAgentConfig(cfg, agentId)?.tools?.exec;
}
/** Resolves the effective exec security/ask policy for one system.run request. */
async function resolveEffectiveSystemRunExecPolicy(params) {
	const agentExec = resolveAgentExecConfig(params.cfg, params.agentId);
	const globalExec = params.cfg.tools?.exec;
	const layeredPolicy = applyExecPolicyLayer(applyExecPolicyLayer({
		security: params.defaultSecurity,
		ask: params.defaultAsk
	}, globalExec), agentExec);
	const modePolicy = resolveExecModePolicy({
		mode: layeredPolicy.mode,
		security: layeredPolicy.security,
		ask: layeredPolicy.ask
	});
	const approvals = await resolveExecApprovalsLocked(params.agentId, {
		security: modePolicy.security,
		ask: modePolicy.ask,
		requireSocket: params.requireSocket
	});
	return {
		agentExec,
		globalExec,
		approvals,
		security: minSecurity(modePolicy.security, approvals.agent.security),
		ask: maxAsk(modePolicy.ask, approvals.agent.ask),
		autoReview: modePolicy.autoReview
	};
}
async function resolveSystemRunAutoReviewer(params) {
	if (params.opts.autoReviewer) return params.opts.autoReviewer;
	const { createModelExecAutoReviewer } = await import("./exec-auto-reviewer-CjnAbIn8.js");
	return createModelExecAutoReviewer({
		cfg: params.cfg,
		agentId: params.agentId,
		reviewer: params.agentExec?.reviewer ?? params.globalExec?.reviewer
	});
}
async function loadSystemRunConfig(opts) {
	if (opts.getRuntimeConfig) return opts.getRuntimeConfig();
	const { getRuntimeConfig } = await import("./config/config.js");
	return getRuntimeConfig();
}
async function sendSystemRunDenied(opts, execution, params) {
	await opts.sendNodeEvent(opts.client, "exec.denied", opts.buildExecEventPayload({
		sessionKey: execution.sessionKey,
		runId: execution.runId,
		host: "node",
		command: execution.commandText,
		reason: params.reason,
		suppressNotifyOnExit: execution.suppressNotifyOnExit
	}));
	await opts.sendInvokeResult({
		ok: false,
		error: {
			code: "UNAVAILABLE",
			message: params.message
		}
	});
}
async function sendSystemRunCompleted(opts, execution, result, payloadJSON) {
	await opts.sendExecFinishedEvent({
		sessionKey: execution.sessionKey,
		runId: execution.runId,
		commandText: execution.commandText,
		result,
		suppressNotifyOnExit: execution.suppressNotifyOnExit
	});
	await opts.sendInvokeResult({
		ok: true,
		payloadJSON
	});
}
function argvArraysMatch(left, right) {
	return left !== void 0 && left.length === right.length && left.every((entry, index) => entry === right[index]);
}
async function parseSystemRunPhase(opts) {
	const command = resolveSystemRunCommandRequest({
		command: opts.params.command,
		rawCommand: opts.params.rawCommand
	});
	if (!command.ok) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: command.message
			}
		});
		return null;
	}
	if (command.argv.length === 0) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "command required"
			}
		});
		return null;
	}
	const shellPayload = command.shellPayload;
	const shellWrapperInvocation = isShellWrapperInvocation(command.argv);
	const commandText = command.commandText;
	const approvalPlan = opts.params.systemRunPlan === void 0 ? null : normalizeSystemRunApprovalPlan(opts.params.systemRunPlan);
	if (opts.params.systemRunPlan !== void 0 && !approvalPlan) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "systemRunPlan invalid"
			}
		});
		return null;
	}
	const agentId = normalizeOptionalString(opts.params.agentId);
	const requestedSessionKey = normalizeOptionalString(opts.params.sessionKey);
	const sessionKey = requestedSessionKey ?? "node";
	const runId = normalizeOptionalString(opts.params.runId) ?? crypto.randomUUID();
	const cwd = normalizeOptionalString(opts.params.cwd);
	const suppressNotifyOnExit = opts.params.suppressNotifyOnExit === true;
	const approvalSource = opts.params.approvalSource;
	if (approvalSource != null && approvalSource !== "ask-fallback" && approvalSource !== "auto-review") {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "approvalSource invalid"
			}
		});
		return null;
	}
	const approvalDecision = resolveExecApprovalDecision(opts.params.approvalDecision);
	const approved = opts.params.approved === true;
	if (approvalSource != null && (opts.params.approved !== void 0 || opts.params.approvalDecision !== void 0)) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "approvalSource cannot be combined with explicit approval"
			}
		});
		return null;
	}
	const explicitApproval = approved || approvalDecision !== null;
	const forwardedDelayedApproval = approvalSource === "auto-review" || explicitApproval;
	if (approvalSource != null || explicitApproval) {
		if (!(approvalPlan !== null && argvArraysMatch(approvalPlan.argv, command.argv) && approvalPlan.commandText === commandText && normalizeOptionalString(approvalPlan.cwd) === cwd && normalizeOptionalString(approvalPlan.agentId) === agentId && normalizeOptionalString(approvalPlan.sessionKey) === requestedSessionKey)) {
			await opts.sendInvokeResult({
				ok: false,
				error: {
					code: "INVALID_REQUEST",
					message: approvalSource != null ? "approvalSource requires matching systemRunPlan" : "explicit approval requires matching systemRunPlan"
				}
			});
			return null;
		}
	}
	const delayedApprovalPolicySnapshot = forwardedDelayedApproval ? approvalPlan?.policySnapshot ?? null : null;
	if (forwardedDelayedApproval && !delayedApprovalPolicySnapshot) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "delayed approval requires a prepared policy snapshot"
			}
		});
		return null;
	}
	const envAssignmentKeys = extractEnvAssignmentKeysFromDispatchWrappers(command.argv);
	const envAssignmentDiagnostics = inspectHostExecEnvOverrides({
		overrides: envAssignmentKeys.length > 0 ? Object.fromEntries(envAssignmentKeys.map((key) => [key, "1"])) : void 0,
		blockPathOverrides: true
	});
	if (envAssignmentDiagnostics.rejectedOverrideBlockedKeys.length > 0) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: `SYSTEM_RUN_DENIED: command env assignment rejected (blocked env assignment keys: ${envAssignmentDiagnostics.rejectedOverrideBlockedKeys.join(", ")})`
			}
		});
		return null;
	}
	const envOverrideDiagnostics = inspectHostExecEnvOverrides({
		overrides: opts.params.env ?? void 0,
		blockPathOverrides: true
	});
	if (envOverrideDiagnostics.rejectedOverrideBlockedKeys.length > 0 || envOverrideDiagnostics.rejectedOverrideInvalidKeys.length > 0) {
		const details = [];
		if (envOverrideDiagnostics.rejectedOverrideBlockedKeys.length > 0) details.push(`blocked override keys: ${envOverrideDiagnostics.rejectedOverrideBlockedKeys.join(", ")}`);
		if (envOverrideDiagnostics.rejectedOverrideInvalidKeys.length > 0) details.push(`invalid non-portable override keys: ${envOverrideDiagnostics.rejectedOverrideInvalidKeys.join(", ")}`);
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: `SYSTEM_RUN_DENIED: environment override rejected (${details.join("; ")})`
			}
		});
		return null;
	}
	const envOverrides = sanitizeSystemRunEnvOverrides({
		overrides: opts.params.env ?? void 0,
		shellWrapper: shellWrapperInvocation
	});
	return {
		argv: command.argv,
		shellPayload,
		shellWrapperInvocation,
		commandText,
		commandPreview: command.previewText,
		approvalPlan,
		agentId,
		sessionKey,
		runId,
		execution: {
			sessionKey,
			runId,
			commandText,
			suppressNotifyOnExit
		},
		approvalDecision,
		approvalSource: approvalSource ?? void 0,
		delayedApprovalPolicySnapshot,
		envOverrides,
		env: opts.sanitizeEnv(envOverrides),
		cwd,
		timeoutMs: opts.params.timeoutMs ?? void 0,
		needsScreenRecording: opts.params.needsScreenRecording === true,
		approved,
		suppressNotifyOnExit
	};
}
async function evaluateSystemRunPolicyPhase(opts, parsed) {
	const cfg = await loadSystemRunConfig(opts);
	const effectivePolicy = await resolveEffectiveSystemRunExecPolicy({
		cfg,
		agentId: parsed.agentId,
		defaultSecurity: opts.resolveExecSecurity(void 0),
		defaultAsk: opts.resolveExecAsk(void 0),
		requireSocket: opts.preferMacAppExecHost
	});
	const { agentExec, globalExec, approvals } = effectivePolicy;
	const currentPolicySnapshot = createExecApprovalPolicySnapshot({
		file: approvals.file,
		agentId: parsed.agentId
	});
	if (parsed.delayedApprovalPolicySnapshot && !isExecApprovalPolicySnapshotCurrent(parsed.delayedApprovalPolicySnapshot, currentPolicySnapshot)) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: "SYSTEM_RUN_DENIED: exec approval policy changed; request approval again"
		});
		return null;
	}
	const evaluationPolicySnapshot = parsed.delayedApprovalPolicySnapshot ?? currentPolicySnapshot;
	const baseSecurity = effectivePolicy.security;
	const baseAsk = effectivePolicy.ask;
	const fallbackRequest = parsed.approvalSource === "ask-fallback";
	const security = fallbackRequest ? minSecurity(baseSecurity, approvals.agent.askFallback) : baseSecurity;
	const ask = fallbackRequest ? "off" : baseAsk;
	const autoAllowSkills = approvals.agent.autoAllowSkills;
	const { safeBins, safeBinProfiles, trustedSafeBinDirs } = resolveExecSafeBinRuntimePolicy({
		global: cfg.tools?.exec,
		local: agentExec,
		onWarning: warnWritableTrustedDirOnce
	});
	const bins = autoAllowSkills ? await opts.skillBins.current() : [];
	const allowlistEvaluation = await evaluateSystemRunAllowlist({
		shellCommand: parsed.shellPayload,
		argv: parsed.argv,
		approvals,
		security,
		safeBins,
		safeBinProfiles,
		trustedSafeBinDirs,
		cwd: parsed.cwd,
		env: parsed.env,
		skillBins: bins,
		autoAllowSkills
	});
	const { allowlistMatches, allowlistAuthorizationSatisfied, segments, segmentAllowlistEntries, segmentSatisfiedBy } = allowlistEvaluation;
	let { analysisOk, allowlistSatisfied } = allowlistEvaluation;
	const strictInlineEval = agentExec?.strictInlineEval === true || cfg.tools?.exec?.strictInlineEval === true;
	const inlineEvalHit = strictInlineEval ? detectPolicyInlineEval(segments) : null;
	const isWindows = process.platform === "win32";
	const cmdDetectionArgv = resolveShellWrapperTransportArgv(parsed.argv) ?? parsed.argv;
	const cmdInvocation = opts.isCmdExeInvocation(cmdDetectionArgv);
	const durableApprovalSatisfied = hasDurableExecApproval({
		analysisOk,
		segmentAllowlistEntries,
		allowlist: approvals.allowlist,
		commandText: parsed.commandText
	});
	const inlineEvalExecutableTrusted = inlineEvalHit !== null && segmentAllowlistEntries.some((entry) => entry?.source === "allow-always");
	const forwardedAutoReview = parsed.approvalSource === "auto-review";
	let approvalDecision = forwardedAutoReview ? "allow-once" : parsed.approvalDecision;
	let approvalGrantSource = forwardedAutoReview ? "auto-review" : parsed.approved || approvalDecision !== null ? "explicit-approval" : null;
	let policy = evaluateSystemRunPolicy({
		security,
		ask,
		analysisOk,
		allowlistSatisfied,
		durableApprovalSatisfied: durableApprovalSatisfied || inlineEvalExecutableTrusted,
		approvalDecision,
		approved: parsed.approved,
		isWindows,
		cmdInvocation,
		shellWrapperInvocation: parsed.shellPayload !== null
	});
	const requiresSecurityAuditSuppressionApproval = commandRequiresSecurityAuditSuppressionApproval({
		command: parsed.commandText,
		cwd: parsed.cwd,
		env: parsed.env,
		segments
	}) && !(baseSecurity === "full" && baseAsk === "off" && !fallbackRequest);
	if (forwardedAutoReview && requiresSecurityAuditSuppressionApproval) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: "SYSTEM_RUN_DENIED: explicit approval required"
		});
		return null;
	}
	if (requiresSecurityAuditSuppressionApproval && !policy.approvedByAsk) policy = {
		allowed: false,
		eventReason: "approval-required",
		errorMessage: "SYSTEM_RUN_DENIED: approval required",
		analysisOk: policy.analysisOk,
		allowlistSatisfied: policy.allowlistSatisfied,
		shellWrapperBlocked: policy.shellWrapperBlocked,
		windowsShellWrapperBlocked: policy.windowsShellWrapperBlocked,
		requiresAsk: true,
		approvalDecision: policy.approvalDecision,
		approvedByAsk: policy.approvedByAsk
	};
	let autoReviewDeferredMessage;
	analysisOk = policy.analysisOk;
	allowlistSatisfied = policy.allowlistSatisfied;
	if (inlineEvalHit !== null && !policy.approvedByAsk && (policy.allowed ? true : policy.eventReason !== "security=deny")) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: `SYSTEM_RUN_DENIED: approval required (${describeInterpreterInlineEval(inlineEvalHit)} requires explicit approval in strictInlineEval mode)`
		});
		return null;
	}
	if (!policy.allowed) {
		const [autoReviewSegment] = segments;
		const directAutoReviewArgvMatchesRequest = parsed.shellPayload !== null || argvArraysMatch(autoReviewSegment?.argv, parsed.argv);
		const autoReviewArgv = segments.length === 1 && autoReviewSegment !== void 0 && autoReviewSegment.resolution?.policyBlocked !== true && !isBlockedShellWrapperCommand(autoReviewSegment.argv) && directAutoReviewArgvMatchesRequest && (parsed.shellPayload === null || autoReviewSegment.raw !== void 0 && autoReviewSegment.raw.trim() === parsed.shellPayload.trim()) ? autoReviewSegment.argv : void 0;
		if (!fallbackRequest && effectivePolicy.autoReview && ask !== "always" && analysisOk && autoReviewArgv !== void 0 && parsed.approvalPlan !== null && inlineEvalHit === null && !requiresSecurityAuditSuppressionApproval && policy.eventReason !== "security=deny") {
			const decision = await resolveExecAutoReviewDecision(await resolveSystemRunAutoReviewer({
				opts,
				cfg,
				agentId: parsed.agentId,
				agentExec,
				globalExec
			}), {
				command: parsed.commandText,
				argv: autoReviewArgv,
				cwd: parsed.cwd,
				envKeys: Object.keys(parsed.envOverrides ?? {}).toSorted(),
				host: "node",
				reason: policy.eventReason === "allowlist-miss" ? "allowlist-miss" : "approval-required",
				analysis: {
					parsed: analysisOk,
					allowlistMatched: allowlistSatisfied,
					durableApprovalMatched: durableApprovalSatisfied,
					inlineEval: false,
					shellWrapper: parsed.shellWrapperInvocation
				},
				agent: {
					id: parsed.agentId,
					sessionKey: parsed.sessionKey
				}
			});
			if (decision.decision === "allow-once" && decision.risk === "low") {
				approvalDecision = "allow-once";
				approvalGrantSource = "auto-review";
				policy = evaluateSystemRunPolicy({
					security,
					ask,
					analysisOk,
					allowlistSatisfied,
					durableApprovalSatisfied: durableApprovalSatisfied || inlineEvalExecutableTrusted,
					approvalDecision,
					approved: true,
					isWindows,
					cmdInvocation,
					shellWrapperInvocation: parsed.shellPayload !== null
				});
			} else autoReviewDeferredMessage = `${policy.errorMessage} (exec auto-review deferred to human approval: ${decision.rationale})`;
		}
	}
	if (!policy.allowed) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: policy.eventReason,
			message: autoReviewDeferredMessage ?? policy.errorMessage
		});
		return null;
	}
	if (policy.shellWrapperBlocked && !policy.approvedByAsk && !durableApprovalSatisfied) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: "SYSTEM_RUN_DENIED: approval required"
		});
		return null;
	}
	const durableApprovalRequirement = resolveDurableExecApprovalRequirement({
		durableApprovalRequired: security === "allowlist" && durableApprovalSatisfied && !policy.approvedByAsk && (!policy.analysisOk || !policy.allowlistSatisfied),
		allowlist: approvals.allowlist,
		commandText: parsed.commandText
	});
	const approvalContextBound = policy.approvedByAsk || fallbackRequest;
	const hardenedPaths = hardenApprovedExecutionPaths({
		approvedByAsk: approvalContextBound,
		argv: parsed.argv,
		shellCommand: parsed.shellPayload,
		cwd: parsed.cwd
	});
	if (!hardenedPaths.ok) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: hardenedPaths.message
		});
		return null;
	}
	const approvedCwdSnapshot = approvalContextBound ? hardenedPaths.approvedCwdSnapshot : void 0;
	if (approvalContextBound && hardenedPaths.cwd && !approvedCwdSnapshot) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: APPROVAL_CWD_DRIFT_DENIED_MESSAGE
		});
		return null;
	}
	const plannedAllowlistArgv = resolvePlannedAllowlistArgv({
		security,
		shellCommand: parsed.shellPayload,
		policy,
		segments
	});
	if (plannedAllowlistArgv === null) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "execution-plan-miss",
			message: "SYSTEM_RUN_DENIED: execution plan mismatch"
		});
		return null;
	}
	return {
		...parsed,
		approvalDecision,
		argv: hardenedPaths.argv,
		cwd: hardenedPaths.cwd,
		approvals,
		evaluationPolicySnapshot,
		security,
		ask,
		policy,
		approvalGrantSource,
		durableApprovalSatisfied,
		durableApprovalRequirement,
		strictInlineEval,
		inlineEvalHit,
		allowlistMatches,
		analysisOk,
		allowlistSatisfied,
		allowlistAuthorizationSatisfied,
		safeBins,
		safeBinProfiles,
		trustedSafeBinDirs,
		skillBins: bins,
		autoAllowSkills,
		segments,
		segmentSatisfiedBy,
		authorizationPlan: allowlistEvaluation.authorizationPlan,
		plannedAllowlistArgv: plannedAllowlistArgv ?? void 0,
		isWindows,
		approvedCwdSnapshot
	};
}
async function revalidateSystemRunApprovedPathBindings(opts, phase) {
	if (phase.approvedCwdSnapshot && !revalidateApprovedCwdSnapshot({ snapshot: phase.approvedCwdSnapshot })) {
		logWarn(`security: system.run approval cwd drift blocked (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: APPROVAL_CWD_DRIFT_DENIED_MESSAGE
		});
		return false;
	}
	if (phase.approvalPlan?.mutableFileOperand && !revalidateApprovedMutableFileOperand({
		snapshot: phase.approvalPlan.mutableFileOperand,
		argv: phase.argv,
		cwd: phase.cwd
	})) {
		logWarn(`security: system.run approval script drift blocked (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE
		});
		return false;
	}
	return true;
}
async function executeSystemRunPhase(opts, phase) {
	if (!await revalidateSystemRunApprovedPathBindings(opts, phase)) return;
	const expectedMutableFileOperand = phase.approvalPlan ? resolveMutableFileOperandSnapshotSync({
		argv: phase.argv,
		cwd: phase.cwd,
		shellCommand: phase.shellPayload
	}) : null;
	if (expectedMutableFileOperand && !expectedMutableFileOperand.ok) {
		logWarn(`security: system.run approval script binding blocked (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: expectedMutableFileOperand.message
		});
		return;
	}
	if (expectedMutableFileOperand?.snapshot && !phase.approvalPlan?.mutableFileOperand) {
		logWarn(`security: system.run approval script binding missing (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: APPROVAL_SCRIPT_OPERAND_BINDING_DENIED_MESSAGE
		});
		return;
	}
	const execArgv = await resolveSystemRunExecArgv({
		plannedAllowlistArgv: phase.plannedAllowlistArgv,
		argv: phase.argv,
		security: phase.security,
		approvals: phase.approvals,
		safeBins: phase.safeBins,
		safeBinProfiles: phase.safeBinProfiles,
		trustedSafeBinDirs: phase.trustedSafeBinDirs,
		skillBins: phase.skillBins,
		autoAllowSkills: phase.autoAllowSkills,
		isWindows: phase.isWindows,
		policy: phase.policy,
		shellCommand: phase.shellPayload,
		segments: phase.segments,
		segmentSatisfiedBy: phase.segmentSatisfiedBy,
		authorizationPlan: phase.authorizationPlan,
		cwd: phase.cwd,
		env: phase.env
	});
	if (!execArgv) {
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "execution-plan-miss",
			message: "SYSTEM_RUN_DENIED: execution plan mismatch"
		});
		return;
	}
	if (opts.preferMacAppExecHost) {
		const macApprovalSource = phase.approvalSource ?? (phase.approvalGrantSource === "auto-review" ? "auto-review" : void 0);
		const macApprovalDecision = macApprovalSource ? null : phase.approvalGrantSource === "explicit-approval" && phase.approvalDecision === null ? "allow-once" : phase.approvalDecision;
		const execRequest = {
			command: execArgv,
			rawCommand: execArgv === phase.argv ? phase.commandText || null : formatExecCommand(execArgv),
			cwd: phase.cwd ?? null,
			env: phase.envOverrides ?? null,
			timeoutMs: phase.timeoutMs ?? null,
			needsScreenRecording: phase.needsScreenRecording,
			agentId: phase.agentId ?? null,
			sessionKey: phase.sessionKey ?? null,
			approvalDecision: macApprovalDecision,
			approvalSource: macApprovalSource,
			...phase.approvalGrantSource ? { policySnapshot: phase.evaluationPolicySnapshot } : {}
		};
		const response = await opts.runViaMacAppExecHost({
			approvals: phase.approvals,
			request: execRequest
		});
		if (opts.signal?.aborted) return;
		if (!response) {
			if (opts.execHostEnforced || !opts.execHostFallbackAllowed) {
				await sendSystemRunDenied(opts, phase.execution, {
					reason: "companion-unavailable",
					message: "COMPANION_APP_UNAVAILABLE: macOS app exec host unreachable"
				});
				return;
			}
		} else if (!response.ok) {
			await sendSystemRunDenied(opts, phase.execution, {
				reason: normalizeDeniedReason(response.error.reason),
				message: response.error.message
			});
			return;
		} else {
			const result = response.payload;
			await sendSystemRunCompleted(opts, phase.execution, result, JSON.stringify(result));
			return;
		}
	}
	if (phase.needsScreenRecording) {
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "permission:screenRecording",
			message: "PERMISSION_MISSING: screenRecording"
		});
		return;
	}
	const allowAlwaysDecision = phase.policy.approvalDecision === "allow-always" ? resolveAllowAlwaysPersistenceDecision({
		segments: phase.segments,
		cwd: phase.cwd,
		env: phase.env,
		platform: process.platform,
		commandText: phase.commandText,
		strictInlineEval: phase.strictInlineEval,
		authorizationPlan: phase.authorizationPlan,
		runtimePayload: phase.inlineEvalHit !== null
	}) : void 0;
	const authorizationSource = phase.approvalSource === "ask-fallback" ? "ask-fallback" : phase.approvalSource === "auto-review" ? "auto-review" : phase.approvalGrantSource ?? "current-policy";
	const delayedAuthorization = authorizationSource === "explicit-approval" || authorizationSource === "auto-review";
	const authorization = {
		source: authorizationSource,
		security: phase.security,
		ask: phase.ask,
		allowlistSatisfied: phase.allowlistAuthorizationSatisfied || phase.durableApprovalSatisfied,
		...delayedAuthorization ? { policySnapshot: phase.evaluationPolicySnapshot } : {},
		requireAutoAllowSkills: phase.segmentSatisfiedBy.includes("skills"),
		requireExactCommandApproval: phase.durableApprovalRequirement === "exact-command",
		requireDurableAllowlistApproval: phase.durableApprovalRequirement === "segment-allowlist"
	};
	try {
		await (opts.commitExecAuthorization ?? commitExecAuthorizationLocked)({
			agentId: phase.agentId,
			matches: phase.allowlistMatches,
			command: phase.commandText,
			resolvedPath: resolveApprovalAuditTrustPath(phase.segments[0]?.resolution ?? null, phase.cwd),
			authorization,
			...allowAlwaysDecision ? { allowAlwaysDecision } : {}
		});
	} catch {
		logWarn(`security: system.run approval state write failed (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-state-write-failed",
			message: APPROVAL_STATE_WRITE_FAILED_MESSAGE
		});
		return;
	}
	if (!await revalidateSystemRunApprovedPathBindings(opts, phase)) return;
	if (opts.signal?.aborted) return;
	const result = await (opts.signal ? opts.runCommand(execArgv, phase.cwd, phase.env, phase.timeoutMs, opts.signal) : opts.runCommand(execArgv, phase.cwd, phase.env, phase.timeoutMs));
	if (opts.signal?.aborted) return;
	applyOutputTruncation(result);
	await sendSystemRunCompleted(opts, phase.execution, result, JSON.stringify({
		exitCode: result.exitCode,
		timedOut: result.timedOut,
		success: result.success,
		stdout: result.stdout,
		stderr: result.stderr,
		error: result.error ?? null
	}));
}
/** Executes a validated system.run request, emitting lifecycle events and approvals. */
async function handleSystemRunInvoke(opts) {
	if (opts.signal?.aborted) return;
	const parsed = await parseSystemRunPhase(opts);
	if (!parsed || opts.signal?.aborted) return;
	const policyPhase = await evaluateSystemRunPolicyPhase(opts, parsed);
	if (!policyPhase || opts.signal?.aborted) return;
	await executeSystemRunPhase(opts, policyPhase);
}
//#endregion
//#region src/node-host/invoke-agent-cli-claude-handler.ts
const CLAUDE_NODE_AUTH_INPUTS = [{
	requestEnv: "CLAUDE_CODE_OAUTH_TOKEN",
	descriptorEnv: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR"
}, {
	requestEnv: "ANTHROPIC_API_KEY",
	descriptorEnv: "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR"
}];
function prepareClaudeNodeSecretInput(params) {
	const selected = CLAUDE_NODE_AUTH_INPUTS.find(({ requestEnv }) => Object.hasOwn(params.requestEnv ?? {}, requestEnv));
	if (!selected) return { cleanup: () => {} };
	for (const key of [
		"ANTHROPIC_API_KEY",
		"CLAUDE_CODE_OAUTH_TOKEN",
		"CLAUDE_CODE_SUBPROCESS_ENV_SCRUB"
	]) delete params.childEnv[key];
	const source = Buffer.from(params.requestEnv?.[selected.requestEnv] ?? "", "utf8");
	params.childEnv[selected.descriptorEnv] = "3";
	return {
		secretInput: {
			fd: 3,
			createData: () => Buffer.from(source)
		},
		cleanup: () => source.fill(0)
	};
}
async function handleClaudeCliNodeInvoke(params) {
	if (!params.runtime.claudePath) {
		await params.deps.sendErrorResult(params.client, params.frame, "UNAVAILABLE", "Claude CLI agent runs are unavailable");
		return;
	}
	const claudePath = params.runtime.claudePath;
	let request;
	try {
		request = await decodeClaudeCliNodeRunParams(params.frame.paramsJSON);
	} catch (error) {
		await params.deps.sendInvalidRequestResult(params.client, params.frame, error);
		return;
	}
	const approvalCommand = [claudePath, ...request.argv];
	const preparedApproval = buildSystemRunApprovalPlan({
		command: approvalCommand,
		...request.cwd ? { cwd: request.cwd } : {},
		...request.agentId ? { agentId: request.agentId } : {},
		...request.sessionKey ? { sessionKey: request.sessionKey } : {}
	});
	if (!preparedApproval.ok) {
		await params.deps.sendErrorResult(params.client, params.frame, "INVALID_REQUEST", preparedApproval.message);
		return;
	}
	const { getRuntimeConfig: getNodeRuntimeConfig } = await import("./config/config.js");
	const execPolicy = await resolveEffectiveSystemRunExecPolicy({
		cfg: getNodeRuntimeConfig(),
		agentId: request.agentId,
		defaultSecurity: params.deps.resolveExecSecurity(void 0),
		defaultAsk: params.deps.resolveExecAsk(void 0),
		requireSocket: false
	});
	const approvalPlan = {
		...preparedApproval.plan,
		policySnapshot: createExecApprovalPolicySnapshot({
			file: execPolicy.approvals.file,
			agentId: request.agentId
		})
	};
	let runResult;
	await (params.runtime.handleSystemRun ?? handleSystemRunInvoke)({
		client: params.client,
		params: {
			command: approvalCommand,
			...request.cwd ? { cwd: request.cwd } : {},
			...request.env ? { env: request.env } : {},
			...request.agentId ? { agentId: request.agentId } : {},
			...request.sessionKey ? { sessionKey: request.sessionKey } : {},
			...request.systemRunPlan ? { systemRunPlan: request.systemRunPlan } : {},
			...request.approvalDecision ? { approvalDecision: request.approvalDecision } : {},
			timeoutMs: request.timeoutMs
		},
		skillBins: params.skillBins,
		execHostEnforced: false,
		execHostFallbackAllowed: true,
		resolveExecSecurity: params.deps.resolveExecSecurity,
		resolveExecAsk: params.deps.resolveExecAsk,
		isCmdExeInvocation: params.deps.isCmdExeInvocation,
		sanitizeEnv: params.deps.sanitizeEnv,
		runCommand: async (approvalArgv, cwd, env, timeoutMs) => {
			const childEnv = { ...env };
			for (const key of request.clearEnv ?? []) if (!Object.hasOwn(request.env ?? {}, key)) delete childEnv[key];
			const preparedSecret = prepareClaudeNodeSecretInput({
				requestEnv: request.env,
				childEnv
			});
			try {
				runResult = await runClaudeCliNodeCommand({
					client: params.client,
					frame: params.frame,
					request,
					argv: approvalArgv,
					cwd,
					env: childEnv,
					secretInput: preparedSecret.secretInput,
					timeoutMs,
					signal: params.runtime.signal
				});
			} finally {
				preparedSecret.cleanup();
			}
			return runResult;
		},
		runViaMacAppExecHost: params.deps.runViaMacAppExecHost,
		sendNodeEvent: async () => {},
		buildExecEventPayload: params.deps.buildExecEventPayload,
		sendInvokeResult: async (result) => {
			if (!result.ok && !request.approvalDecision && result.error?.message?.includes("approval required")) {
				await params.deps.sendInvokeResult(params.client, params.frame, {
					ok: true,
					payloadJSON: JSON.stringify({
						approvalRequired: true,
						systemRunPlan: approvalPlan,
						security: execPolicy.security,
						ask: execPolicy.ask
					})
				});
				return;
			}
			if (!result.ok || !runResult) {
				await params.deps.sendInvokeResult(params.client, params.frame, result);
				return;
			}
			const payload = {
				exitCode: runResult.exitCode ?? 1,
				stderrTail: runResult.stderr,
				truncated: runResult.truncated,
				...runResult.timedOut ? { timeoutKind: runResult.noOutputTimedOut ? "idle" : "hard" } : {}
			};
			await params.deps.sendInvokeResult(params.client, params.frame, {
				ok: true,
				payloadJSON: JSON.stringify(payload)
			});
		},
		sendExecFinishedEvent: async () => {},
		preferMacAppExecHost: false
	});
}
//#endregion
//#region src/node-host/invoke-device-apps.ts
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;
const DeviceAppsParamsSchema = object({
	query: string().trim().min(1).optional(),
	limit: number().int().transform((value) => Math.min(MAX_LIMIT, Math.max(1, value))).optional(),
	includeSystem: boolean().optional()
}).strict();
async function invokeDeviceApps(params) {
	if (!params.sharingEnabled) return {
		ok: false,
		code: "INSTALLED_APPS_SHARING_DISABLED",
		message: "INSTALLED_APPS_SHARING_DISABLED: enable Installed Apps in node-host settings"
	};
	let request;
	try {
		request = DeviceAppsParamsSchema.parse(JSON.parse(params.paramsJSON || "{}"));
	} catch (error) {
		return {
			ok: false,
			code: "INVALID_REQUEST",
			message: String(error)
		};
	}
	const inventory = await (params.scan ?? scanInstalledApps)({ platform: params.platform ?? process.platform });
	if (inventory.status === "unsupported") return {
		ok: false,
		code: "UNAVAILABLE",
		message: "UNAVAILABLE: installed application inventory is only available on macOS"
	};
	const query = request.query?.toLocaleLowerCase("en-US");
	const matching = inventory.apps.filter((app) => (request.includeSystem === true || !app.system) && (!query || app.label.toLocaleLowerCase("en-US").includes(query) || app.bundleId?.toLocaleLowerCase("en-US").includes(query)));
	const apps = matching.slice(0, request.limit ?? DEFAULT_LIMIT);
	return {
		ok: true,
		payload: {
			count: apps.length,
			totalMatched: matching.length,
			truncated: matching.length > apps.length,
			apps
		}
	};
}
//#endregion
//#region src/node-host/invoke-file-commands.ts
function decodeParams$1(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
	}
}
/** Handles bounded node-host filesystem commands before plugin dispatch. */
async function invokeNodeFileCommand(command, paramsJSON) {
	if (command !== "fs.listDir" && command !== "terminal.upload") return null;
	try {
		const params = decodeParams$1(paramsJSON);
		if (command === "fs.listDir") {
			if (params.path !== void 0 && typeof params.path !== "string") throw new Error("INVALID_REQUEST: path must be a string");
			return { payload: await listHostDirectories(params.path) };
		}
		if (typeof params.name !== "string" || typeof params.contentBase64 !== "string") throw new Error("INVALID_REQUEST: terminal upload name and content are required");
		return { payload: await stageTerminalUpload({
			name: params.name,
			contentBase64: params.contentBase64
		}) };
	} catch (error) {
		return { error };
	}
}
//#endregion
//#region src/node-host/mcp.ts
/** Process-lifetime MCP clients owned by the headless node host. */
const NODE_MCP_PLUGIN_ID = "node-mcp";
const NODE_MCP_DESCRIPTION_MAX_CHARS = 1024;
const NODE_MCP_NAME_MAX_CHARS = 64;
const NODE_MCP_SERVER_FRAGMENT_MAX_CHARS = 31;
const NODE_MCP_ERROR_MAX_CHARS = 1024;
const NODE_MCP_MAX_DESCRIPTORS = 128;
const NODE_MCP_MAX_DESCRIPTOR_BYTES = 1024 * 1024;
const NODE_MCP_MAX_CATALOG_BYTES = 10 * 1024 * 1024;
const NODE_MCP_MAX_LIST_PAGES = NODE_MCP_MAX_DESCRIPTORS;
const NODE_MCP_MAX_LISTED_TOOLS = NODE_MCP_MAX_DESCRIPTORS * NODE_MCP_MAX_LIST_PAGES;
var NodeHostMcpError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.name = "NodeHostMcpError";
		this.code = code;
	}
};
function defaultWarn(message) {
	console.warn(message);
}
function formatMcpError(error) {
	return truncateUtf16Safe(redactSensitiveUrlLikeString(toErrorObject(error, "MCP request failed").message), NODE_MCP_ERROR_MAX_CHARS);
}
function sanitizeDescriptorFragment(raw, fallback) {
	const normalized = raw.trim().replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^[_-]+|[_-]+$/g, "") || fallback;
	return /^[A-Za-z]/.test(normalized) ? normalized : `${fallback}_${normalized}`;
}
function buildDescriptorBaseName(serverName, toolName) {
	const server = sanitizeDescriptorFragment(serverName, "mcp").slice(0, NODE_MCP_SERVER_FRAGMENT_MAX_CHARS);
	const toolBudget = Math.max(1, NODE_MCP_NAME_MAX_CHARS - server.length - 1);
	return `${server}_${sanitizeDescriptorFragment(toolName, "tool").slice(0, toolBudget)}`;
}
function reserveDescriptorName(baseName, usedNames) {
	let index = 1;
	while (true) {
		const suffix = index === 1 ? "" : `_${index}`;
		const candidate = `${baseName.slice(0, NODE_MCP_NAME_MAX_CHARS - suffix.length)}${suffix}`;
		const key = normalizeLowercaseStringOrEmpty(candidate);
		if (!usedNames.has(key)) {
			usedNames.add(key);
			return candidate;
		}
		index += 1;
	}
}
function normalizeInputSchema(value) {
	if (value && typeof value === "object" && !Array.isArray(value)) return value;
	return {
		type: "object",
		properties: {},
		additionalProperties: true
	};
}
/** Builds provider-safe MCP descriptors in stable server/tool order. */
function buildNodeMcpToolDescriptors(listedTools) {
	const usedNames = /* @__PURE__ */ new Set();
	const descriptors = [];
	let catalogBytes = 0;
	for (const { serverName, tool } of listedTools.toSorted((left, right) => left.serverName.localeCompare(right.serverName) || left.tool.name.localeCompare(right.tool.name))) {
		const toolName = tool.name.trim();
		const descriptor = {
			pluginId: NODE_MCP_PLUGIN_ID,
			name: reserveDescriptorName(buildDescriptorBaseName(serverName, toolName), usedNames),
			description: truncateUtf16Safe(sanitizeMcpMetadataText(tool.description) || sanitizeMcpMetadataText(toolName) || "MCP tool", NODE_MCP_DESCRIPTION_MAX_CHARS),
			parameters: normalizeInputSchema(tool.inputSchema),
			command: NODE_MCP_TOOLS_CALL_COMMAND,
			mcp: {
				server: serverName,
				tool: toolName
			}
		};
		const descriptorBytes = Buffer.byteLength(JSON.stringify(descriptor));
		if (descriptorBytes > NODE_MCP_MAX_DESCRIPTOR_BYTES || catalogBytes + descriptorBytes > NODE_MCP_MAX_CATALOG_BYTES) continue;
		descriptors.push(descriptor);
		catalogBytes += descriptorBytes;
		if (descriptors.length >= NODE_MCP_MAX_DESCRIPTORS) break;
	}
	return descriptors;
}
function isOAuthServer(config) {
	return config.auth === "oauth" || Boolean(config.oauth);
}
function shouldExposeTool(config, toolName) {
	const include = config.toolFilter?.include ?? [];
	const exclude = config.toolFilter?.exclude ?? [];
	if (include.length > 0 && !include.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName))) return false;
	return !exclude.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName));
}
async function connectWithTimeout(client, transport, timeoutMs) {
	let timer;
	try {
		await Promise.race([client.connect(transport), new Promise((_, reject) => {
			timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`MCP server connection timed out after ${timeoutMs}ms`)), timeoutMs);
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function withAbort(promise, signal) {
	if (!signal) return await promise;
	if (signal.aborted) throw new Error("MCP startup aborted");
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(/* @__PURE__ */ new Error("MCP startup aborted"));
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
async function listAllTools(client, timeoutMs, shouldInclude, signal) {
	return await collectMcpPaginatedItems({
		label: "MCP tool listing",
		itemLabel: "tools",
		timeoutMs,
		maxPages: NODE_MCP_MAX_LIST_PAGES,
		maxItems: NODE_MCP_MAX_LISTED_TOOLS,
		maxBytes: NODE_MCP_MAX_CATALOG_BYTES,
		signal,
		loadPage: async ({ cursor, requestTimeoutMs, signal: requestSignal }) => {
			const page = await client.listTools(cursor === void 0 ? void 0 : { cursor }, {
				timeout: requestTimeoutMs,
				maxTotalTimeout: requestTimeoutMs,
				signal: requestSignal
			});
			return {
				items: page.tools,
				nextCursor: page.nextCursor,
				serializedValue: page
			};
		},
		mapItem: (tool) => {
			const toolName = tool.name.trim();
			if (!toolName || !shouldInclude(toolName)) return;
			return {
				...tool,
				name: toolName
			};
		}
	});
}
function resolveCallTimeoutMs(value) {
	return clampPositiveTimerTimeoutMs(value) ?? 12e4;
}
function isMcpTimeoutError(error) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === ErrorCode.RequestTimeout);
}
/** Starts configured MCP servers once for the lifetime of the node host. */
async function startNodeHostMcpManager(servers, deps = {}) {
	const warn = deps.warn ?? defaultWarn;
	const createClient = deps.createClient ?? (() => new Client({
		name: "openclaw-node-host",
		version: VERSION
	}, { jsonSchemaValidator: createMcpJsonSchemaValidator() }));
	const resolveTransport = deps.resolveTransport ?? resolveMcpTransport;
	const configured = listEnabledNodeHostMcpServers(servers);
	const sessions = /* @__PURE__ */ new Map();
	const listedTools = [];
	await Promise.all(configured.map(async ([serverName, config]) => {
		if (isOAuthServer(config)) {
			warn(`node host MCP server "${serverName}" skipped: OAuth is not supported`);
			return;
		}
		let client;
		let resolved;
		let session;
		try {
			resolved = resolveTransport(serverName, config);
			if (!resolved) {
				warn(`node host MCP server "${serverName}" skipped: invalid or unsupported transport`);
				return;
			}
			client = createClient(serverName);
			session = {
				client,
				connected: false,
				tools: /* @__PURE__ */ new Set(),
				toolCallTimeoutMs: resolveMcpRequestTimeoutMs(config, NODE_MCP_TOOL_CALL_TIMEOUT_MS),
				detachStderr: resolved.detachStderr
			};
			client.onclose = () => {
				if (session) session.connected = false;
			};
			await withAbort(connectWithTimeout(client, resolved.transport, resolved.connectionTimeoutMs), deps.signal);
			session.connected = true;
			const tools = await listAllTools(client, resolved.requestTimeoutMs, (toolName) => shouldExposeTool(config, toolName), deps.signal);
			for (const tool of tools) {
				session.tools.add(tool.name);
				listedTools.push({
					serverName,
					tool
				});
			}
			sessions.set(serverName, session);
		} catch (error) {
			if (session) session.connected = false;
			resolved?.detachStderr?.();
			if (client) await Promise.allSettled([client.close()]);
			if (!deps.signal?.aborted) warn(`node host MCP server "${serverName}" failed: ${formatMcpError(error)}`);
		}
	}));
	const descriptors = buildNodeMcpToolDescriptors(listedTools);
	if (descriptors.length < listedTools.length) warn(`node host MCP catalog bounded: published ${descriptors.length} of ${listedTools.length} tools`);
	let closed = false;
	return {
		configuredServerCount: configured.length,
		descriptors,
		async callMcpTool(params) {
			const session = sessions.get(params.server);
			if (!session?.connected) throw new NodeHostMcpError("MCP_SERVER_UNAVAILABLE", `MCP server "${params.server}" is unavailable`);
			if (!session.tools.has(params.tool)) throw new NodeHostMcpError("MCP_TOOL_UNAVAILABLE", `MCP tool "${params.tool}" is unavailable on server "${params.server}"`);
			try {
				return await session.client.callTool({
					name: params.tool,
					arguments: params.arguments ?? {}
				}, void 0, {
					timeout: Math.min(resolveCallTimeoutMs(params.timeoutMs), session.toolCallTimeoutMs),
					...params.signal ? { signal: params.signal } : {}
				});
			} catch (error) {
				if (!session.connected) throw new NodeHostMcpError("MCP_SERVER_UNAVAILABLE", `MCP server "${params.server}" disconnected`, { cause: error });
				if (isMcpTimeoutError(error)) throw new NodeHostMcpError("MCP_TOOL_TIMEOUT", formatMcpError(error), { cause: error });
				throw new NodeHostMcpError("MCP_TOOL_ERROR", formatMcpError(error), { cause: error });
			}
		},
		async close() {
			if (closed) return;
			closed = true;
			for (const session of sessions.values()) {
				session.connected = false;
				session.detachStderr?.();
			}
			await Promise.allSettled(Array.from(sessions.values(), (session) => session.client.close()));
			sessions.clear();
		}
	};
}
function listEnabledNodeHostMcpServers(servers) {
	return Object.entries(normalizeConfiguredMcpServers(servers)).filter(([serverName, config]) => serverName.length > 0 && serverName === serverName.trim() && config.enabled !== false).map(([serverName, config]) => [serverName, config]).toSorted(([left], [right]) => left.localeCompare(right));
}
//#endregion
//#region src/node-host/node-event-params.ts
/** Build node.event params, shared by the invoke dispatcher and the runtime. */
function buildNodeEventParams(event, payload) {
	const payloadJSON = payload === void 0 ? void 0 : JSON.stringify(payload);
	return {
		event,
		payloadJSON: typeof payloadJSON === "string" ? payloadJSON : null
	};
}
//#endregion
//#region src/node-host/node-worker-process-identity.ts
function readNodeWorkerProcessStartTime(pid) {
	return process.platform === "win32" ? readWindowsProcessStartTimeSync(pid) : getFileLockProcessStartTime(pid);
}
function requireNodeWorkerProcessIdentity(pid) {
	const startTime = readNodeWorkerProcessStartTime(pid);
	if (startTime === null) throw new Error(`cannot establish PID-reuse-safe identity for process ${pid}`);
	return {
		pid,
		startTime
	};
}
function inspectNodeWorkerProcessIdentity(identity) {
	const observedStartTime = readNodeWorkerProcessStartTime(identity.pid);
	if (observedStartTime !== null) {
		if (observedStartTime !== identity.startTime) return "reused";
		return isPidDefinitelyDead(identity.pid) ? "dead" : "live";
	}
	return isPidDefinitelyDead(identity.pid) ? "dead" : "unknown";
}
//#endregion
//#region src/node-host/node-worker-launch-store.ts
const NODE_WORKER_LAUNCH_SCHEMA_START = "CREATE TABLE IF NOT EXISTS node_worker_launches (";
const NODE_WORKER_LAUNCH_SCHEMA_END = "\n  WHERE completed_at_ms IS NOT NULL;";
const initializedDatabases = /* @__PURE__ */ new WeakSet();
const TERMINAL_STATES = /* @__PURE__ */ new Set([
	"completed",
	"failed",
	"interrupted",
	"cancelled"
]);
const TERMINAL_RECEIPT_RETENTION_MS = 1440 * 60 * 1e3;
const TERMINAL_PRUNE_BATCH_LIMIT = 256;
function ensureNodeWorkerLaunchSchema(database) {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(NODE_WORKER_LAUNCH_SCHEMA_START);
	const end = start >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf(NODE_WORKER_LAUNCH_SCHEMA_END, start) : -1;
	if (start < 0 || end < start) throw new Error("OpenClaw node worker launch schema marker is missing.");
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 37));
}
function query(database) {
	return getNodeSqliteKysely(database);
}
function readRow(database, launchId) {
	return executeSqliteQueryTakeFirstSync(database, query(database).selectFrom("node_worker_launches").selectAll().where("launch_id", "=", launchId));
}
function readNonterminalCount(database) {
	return executeSqliteQueryTakeFirstSync(database, query(database).selectFrom("node_worker_launches").select((expression) => expression.fn.countAll().as("count")).where("state", "in", ["pending", "running"]))?.count ?? 0;
}
function readNonterminalRows(database) {
	return executeSqliteQuerySync(database, query(database).selectFrom("node_worker_launches").selectAll().where("state", "in", ["pending", "running"]).orderBy("launch_id", "asc")).rows;
}
function pruneTerminalRows(params) {
	let candidates = query(params.database).selectFrom("node_worker_launches").select("launch_id").where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs).orderBy("completed_at_ms", "asc").orderBy("launch_id", "asc").limit(params.limit);
	if (params.excludeLaunchId) candidates = candidates.where("launch_id", "!=", params.excludeLaunchId);
	const launchIds = executeSqliteQuerySync(params.database, candidates).rows.map((row) => row.launch_id);
	if (launchIds.length === 0) return 0;
	const result = executeSqliteQuerySync(params.database, query(params.database).deleteFrom("node_worker_launches").where("launch_id", "in", launchIds).where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs));
	return Number(result.numAffectedRows ?? 0n);
}
function processIdentity(pid, startTime) {
	return {
		pid,
		startTime
	};
}
function receiptFromRow(row) {
	if (!isNodeWorkerLaunchState(row.state)) throw new Error(`invalid node worker launch state ${row.state}`);
	return {
		launchId: row.launch_id,
		planHash: row.plan_hash,
		gatewayNamespace: row.gateway_namespace,
		environmentId: row.environment_id,
		sessionId: row.session_id,
		ownerEpoch: row.owner_epoch,
		placementGeneration: row.placement_generation,
		runId: row.run_id,
		state: row.state,
		supervisor: processIdentity(row.supervisor_pid, row.supervisor_start_time),
		worker: row.worker_pid === null || row.worker_start_time === null ? null : processIdentity(row.worker_pid, row.worker_start_time),
		resultJson: row.result_json,
		errorText: row.error_text,
		completedAtMs: row.completed_at_ms,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
	};
}
function isNodeWorkerLaunchState(value) {
	return value === "pending" || value === "running" || TERMINAL_STATES.has(value);
}
function validateIdentifier(value, label) {
	if (!value || value.trim() !== value || value.length > 256 || value.includes("\0")) throw new Error(`${label} must be a bounded non-empty identifier`);
}
function validatePlanHash(value) {
	if (!/^[a-f0-9]{64}$/u.test(value)) throw new Error("node worker plan hash must be 64 lowercase hexadecimal characters");
}
function validateTimestamp(value) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error("node worker launch timestamp must be a non-negative safe integer");
}
function validatePruneLimit(limit) {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1e3) throw new Error("node worker launch prune limit must be between 1 and 1000");
}
function validateProcessIdentity(identity) {
	if (!Number.isSafeInteger(identity.pid) || identity.pid <= 0 || identity.pid > 2147483647 || !Number.isSafeInteger(identity.startTime) || identity.startTime < 0) throw new Error("node worker process identity must contain a bounded pid and start time");
}
function requireMatchingRow(database, launchId, planHash) {
	const row = readRow(database, launchId);
	if (!row) throw new Error(`node worker launch ${launchId} does not exist`);
	if (row.plan_hash !== planHash) throw new Error(`node worker launch ${launchId} was replayed with a different plan`);
	return row;
}
function rowHasSupervisor(row, identity) {
	return row.supervisor_pid === identity.pid && row.supervisor_start_time === identity.startTime;
}
function rowHasWorker(row, identity) {
	return identity === null ? row.worker_pid === null && row.worker_start_time === null : row.worker_pid === identity.pid && row.worker_start_time === identity.startTime;
}
function sameObservedOwner(current, observed) {
	return current.state === observed.state && current.supervisor_pid === observed.supervisor_pid && current.supervisor_start_time === observed.supervisor_start_time && current.worker_pid === observed.worker_pid && current.worker_start_time === observed.worker_start_time;
}
function rowMatchesImmutableIdentity(row, expected) {
	return row.launch_id === expected.launchId && row.plan_hash === expected.planHash && row.environment_id === expected.environmentId && row.session_id === expected.sessionId && row.owner_epoch === expected.ownerEpoch && row.placement_generation === expected.placementGeneration && row.run_id === expected.runId;
}
/** Synchronous shared-state owner for durable node worker launch supervision. */
var NodeWorkerLaunchStore = class {
	constructor(options = {}) {
		this.databaseOptions = options.env ? { env: options.env } : {};
	}
	write(operationLabel, operation) {
		let initializedDatabase;
		const result = runOpenClawStateWriteTransaction(({ db }) => {
			if (!initializedDatabases.has(db)) {
				ensureNodeWorkerLaunchSchema(db);
				initializedDatabase = db;
			}
			return operation(db);
		}, this.databaseOptions, { operationLabel });
		if (initializedDatabase) initializedDatabases.add(initializedDatabase);
		return result;
	}
	claim(claim, supervisor, capacity, nowMs = Date.now()) {
		validateIdentifier(claim.launchId, "node worker launch id");
		validatePlanHash(claim.planHash);
		validateTimestamp(nowMs);
		validateProcessIdentity(supervisor);
		if (!Number.isSafeInteger(capacity) || capacity < 1) throw new Error("node worker capacity must be a positive safe integer");
		const observed = this.write("node-worker-launch.claim-inspect", (database) => readRow(database, claim.launchId));
		if (observed && observed.plan_hash !== claim.planHash) throw new Error(`node worker launch ${claim.launchId} was replayed with a different plan`);
		const observedSupervisorState = observed ? inspectNodeWorkerProcessIdentity(processIdentity(observed.supervisor_pid, observed.supervisor_start_time)) : void 0;
		return this.write("node-worker-launch.claim", (database) => {
			const finalize = (result) => {
				pruneTerminalRows({
					database,
					cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS),
					limit: TERMINAL_PRUNE_BATCH_LIMIT,
					excludeLaunchId: claim.launchId
				});
				return result;
			};
			let current = readRow(database, claim.launchId);
			if (!current) {
				const nonterminalCount = readNonterminalCount(database);
				if (nonterminalCount >= capacity) return finalize({
					action: "at-capacity",
					nonterminalCount
				});
				executeSqliteQuerySync(database, query(database).insertInto("node_worker_launches").values({
					launch_id: claim.launchId,
					plan_hash: claim.planHash,
					gateway_namespace: claim.gatewayNamespace,
					environment_id: claim.environmentId,
					session_id: claim.sessionId,
					owner_epoch: claim.ownerEpoch,
					placement_generation: claim.placementGeneration,
					run_id: claim.runId,
					state: "pending",
					supervisor_pid: supervisor.pid,
					supervisor_start_time: supervisor.startTime,
					worker_pid: null,
					worker_start_time: null,
					result_json: null,
					error_text: null,
					completed_at_ms: null,
					created_at_ms: nowMs,
					updated_at_ms: nowMs
				}));
				return finalize({
					action: "start",
					receipt: receiptFromRow(requireMatchingRow(database, claim.launchId, claim.planHash)),
					nonterminalCount: readNonterminalCount(database)
				});
			}
			if (current.plan_hash !== claim.planHash) throw new Error(`node worker launch ${claim.launchId} was replayed with a different plan`);
			const previousOwnerDefinitelyStale = observedSupervisorState === "dead" || observedSupervisorState === "reused";
			if (current.state === "pending" && observed && sameObservedOwner(current, observed) && previousOwnerDefinitelyStale) {
				const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
				executeSqliteQuerySync(database, query(database).updateTable("node_worker_launches").set({
					supervisor_pid: supervisor.pid,
					supervisor_start_time: supervisor.startTime,
					updated_at_ms: updatedAtMs
				}).where("launch_id", "=", claim.launchId).where("plan_hash", "=", claim.planHash).where("state", "=", "pending").where("supervisor_pid", "=", observed.supervisor_pid).where("supervisor_start_time", "=", observed.supervisor_start_time).where("worker_pid", "is", null).where("worker_start_time", "is", null));
				current = requireMatchingRow(database, claim.launchId, claim.planHash);
				return finalize({
					action: rowHasSupervisor(current, supervisor) ? "start" : "replay",
					receipt: receiptFromRow(current),
					nonterminalCount: readNonterminalCount(database)
				});
			}
			if (current.state === "running" && observed && sameObservedOwner(current, observed) && previousOwnerDefinitelyStale) return finalize({
				action: "recover",
				receipt: receiptFromRow(current),
				nonterminalCount: readNonterminalCount(database)
			});
			return finalize({
				action: "replay",
				receipt: receiptFromRow(current),
				nonterminalCount: readNonterminalCount(database)
			});
		});
	}
	listNonterminal() {
		return this.write("node-worker-launch.list-nonterminal", (database) => readNonterminalRows(database).map(receiptFromRow));
	}
	nonterminalCount() {
		return this.write("node-worker-launch.count-nonterminal", readNonterminalCount);
	}
	pruneExpiredTerminal(params = {}) {
		const nowMs = params.nowMs ?? Date.now();
		const limit = params.limit ?? TERMINAL_PRUNE_BATCH_LIMIT;
		validateTimestamp(nowMs);
		validatePruneLimit(limit);
		return this.write("node-worker-launch.prune-terminal", (database) => pruneTerminalRows({
			database,
			cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS),
			limit
		}));
	}
	get(launchId) {
		validateIdentifier(launchId, "node worker launch id");
		return this.write("node-worker-launch.get", (database) => {
			const row = readRow(database, launchId);
			return row ? receiptFromRow(row) : void 0;
		});
	}
	getMatching(expected) {
		validateIdentifier(expected.launchId, "node worker launch id");
		validatePlanHash(expected.planHash);
		return this.write("node-worker-launch.get-matching", (database) => {
			const row = readRow(database, expected.launchId);
			return row && rowMatchesImmutableIdentity(row, expected) ? receiptFromRow(row) : void 0;
		});
	}
	finishCancelled(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		if (params.worker) validateProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish-cancelled", (database) => {
			const current = readRow(database, params.expected.launchId);
			if (!current || !rowMatchesImmutableIdentity(current, params.expected)) return;
			if (TERMINAL_STATES.has(current.state)) return receiptFromRow(current);
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, params.worker)) return receiptFromRow(current);
			const completedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			let update = query(database).updateTable("node_worker_launches").set({
				state: "cancelled",
				result_json: null,
				error_text: "node worker launch cancelled",
				completed_at_ms: completedAtMs,
				updated_at_ms: completedAtMs
			}).where("launch_id", "=", params.expected.launchId).where("plan_hash", "=", params.expected.planHash).where("environment_id", "=", params.expected.environmentId).where("session_id", "=", params.expected.sessionId).where("owner_epoch", "=", params.expected.ownerEpoch).where("placement_generation", "=", params.expected.placementGeneration).where("run_id", "=", params.expected.runId).where("state", "in", ["pending", "running"]).where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime);
			update = params.worker ? update.where("worker_pid", "=", params.worker.pid).where("worker_start_time", "=", params.worker.startTime) : update.where("worker_pid", "is", null).where("worker_start_time", "is", null);
			executeSqliteQuerySync(database, update);
			const settled = readRow(database, params.expected.launchId);
			return settled && rowMatchesImmutableIdentity(settled, params.expected) ? receiptFromRow(settled) : void 0;
		});
	}
	markRunning(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		validateProcessIdentity(params.worker);
		return this.write("node-worker-launch.mark-running", (database) => {
			const current = requireMatchingRow(database, params.launchId, params.planHash);
			if (TERMINAL_STATES.has(current.state)) return receiptFromRow(current);
			if (current.state === "running") return receiptFromRow(current);
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, null)) return receiptFromRow(current);
			const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			executeSqliteQuerySync(database, query(database).updateTable("node_worker_launches").set({
				state: "running",
				worker_pid: params.worker.pid,
				worker_start_time: params.worker.startTime,
				updated_at_ms: updatedAtMs
			}).where("launch_id", "=", params.launchId).where("plan_hash", "=", params.planHash).where("state", "=", "pending").where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime).where("worker_pid", "is", null).where("worker_start_time", "is", null));
			return receiptFromRow(requireMatchingRow(database, params.launchId, params.planHash));
		});
	}
	finish(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		if (params.worker) validateProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish", (database) => {
			const current = requireMatchingRow(database, params.launchId, params.planHash);
			if (TERMINAL_STATES.has(current.state)) return receiptFromRow(current);
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, params.worker)) return receiptFromRow(current);
			const completedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			let update = query(database).updateTable("node_worker_launches").set({
				state: params.state,
				result_json: params.state === "completed" ? params.resultJson ?? null : null,
				error_text: params.state === "completed" ? null : params.errorText ?? null,
				completed_at_ms: completedAtMs,
				updated_at_ms: completedAtMs
			}).where("launch_id", "=", params.launchId).where("plan_hash", "=", params.planHash).where("state", "in", ["pending", "running"]).where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime);
			update = params.worker ? update.where("worker_pid", "=", params.worker.pid).where("worker_start_time", "=", params.worker.startTime) : update.where("worker_pid", "is", null).where("worker_start_time", "is", null);
			executeSqliteQuerySync(database, update);
			return receiptFromRow(requireMatchingRow(database, params.launchId, params.planHash));
		});
	}
};
//#endregion
//#region src/node-host/node-worker-capacity.ts
const DEFAULT_WORKER_CAPACITY = 2;
const DEFAULT_CAPACITY_WAIT_MS = 1e4;
const CAPACITY_POLL_MS = 100;
function capacityAbortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("node worker admission aborted");
}
var NodeWorkerCapacityExhaustedError = class extends Error {
	constructor(waitMs) {
		super(`node worker capacity remained full for ${waitMs} ms`);
		this.code = NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE;
		this.name = "NodeWorkerCapacityExhaustedError";
	}
};
/** Owns durable worker slot admission and live full/free publication edges. */
var NodeWorkerCapacity = class {
	constructor(store, options = {}) {
		this.store = store;
		this.waiters = /* @__PURE__ */ new Set();
		this.closeAbort = new AbortController();
		this.capacity = options.capacity ?? DEFAULT_WORKER_CAPACITY;
		this.waitMs = options.capacityWaitMs ?? DEFAULT_CAPACITY_WAIT_MS;
		this.onAvailabilityChanged = options.onAvailabilityChanged;
		this.onTerminal = options.onTerminal;
		if (!Number.isSafeInteger(this.capacity) || this.capacity < 1) throw new Error("node worker capacity must be a positive safe integer");
		if (!Number.isSafeInteger(this.waitMs) || this.waitMs < 0) throw new Error("node worker capacity wait must be a non-negative safe integer");
	}
	async initialize(recoverRunning) {
		this.publish(false);
		for (const receipt of this.store.listNonterminal()) {
			if (receipt.state === "pending") {
				const supervisorState = inspectNodeWorkerProcessIdentity(receipt.supervisor);
				if (supervisorState === "dead" || supervisorState === "reused") this.finish({
					launchId: receipt.launchId,
					planHash: receipt.planHash,
					supervisor: receipt.supervisor,
					worker: null,
					state: "interrupted",
					errorText: "node host stopped before the worker launch started"
				}, false);
				continue;
			}
			await recoverRunning(receipt);
		}
		this.store.pruneExpiredTerminal();
		this.refresh();
	}
	async claim(claim, supervisor, signal) {
		const deadlineMs = Date.now() + this.waitMs;
		while (true) {
			if (this.closeAbort.signal.aborted) throw new Error("node worker supervisor is closed");
			signal?.throwIfAborted();
			const result = this.store.claim(claim, supervisor, this.capacity);
			this.publish(result.nonterminalCount < this.capacity);
			if (result.action !== "at-capacity") return result;
			await this.wait(deadlineMs, signal);
		}
	}
	finish(params, notify = true) {
		const receipt = this.store.finish(params);
		if (notify && receipt.state !== "pending" && receipt.state !== "running") {
			this.changed();
			this.onTerminal?.();
		}
		return receipt;
	}
	finishCancelled(params) {
		const receipt = this.store.finishCancelled(params);
		if (receipt && receipt.state !== "pending" && receipt.state !== "running") {
			this.changed();
			this.onTerminal?.();
		}
		return receipt;
	}
	close() {
		this.closeAbort.abort();
		this.wake();
	}
	publish(available) {
		if (this.availability === available) return;
		this.availability = available;
		this.onAvailabilityChanged?.(available);
	}
	refresh() {
		const count = this.store.nonterminalCount();
		this.publish(count < this.capacity);
		if (count < this.capacity) this.wake();
	}
	changed() {
		this.wake();
		try {
			this.refresh();
		} catch {
			this.publish(false);
		}
	}
	wake() {
		for (const wake of this.waiters) wake();
	}
	async wait(deadlineMs, signal) {
		const remainingMs = deadlineMs - Date.now();
		if (remainingMs <= 0) throw new NodeWorkerCapacityExhaustedError(this.waitMs);
		if (signal?.aborted) throw capacityAbortReason(signal);
		if (this.closeAbort.signal.aborted) throw new Error("node worker supervisor is closed");
		await new Promise((resolve, reject) => {
			const finish = (operation) => {
				clearTimeout(pollTimer);
				this.waiters.delete(wake);
				signal?.removeEventListener("abort", onAbort);
				this.closeAbort.signal.removeEventListener("abort", onClose);
				operation();
			};
			const wake = () => finish(resolve);
			const onAbort = () => finish(() => reject(signal ? capacityAbortReason(signal) : /* @__PURE__ */ new Error("node worker admission aborted")));
			const onClose = () => finish(() => reject(/* @__PURE__ */ new Error("node worker supervisor is closed")));
			const pollTimer = setTimeout(wake, Math.min(CAPACITY_POLL_MS, remainingMs));
			pollTimer.unref?.();
			this.waiters.add(wake);
			signal?.addEventListener("abort", onAbort, { once: true });
			this.closeAbort.signal.addEventListener("abort", onClose, { once: true });
		});
	}
};
//#endregion
//#region src/node-host/node-worker-supervisor-contract.ts
function projectNodeWorkerSupervisorReceipt(receipt) {
	const identity = {
		launchId: receipt.launchId,
		planHash: receipt.planHash,
		environmentId: receipt.environmentId,
		sessionId: receipt.sessionId,
		ownerEpoch: receipt.ownerEpoch,
		placementGeneration: receipt.placementGeneration,
		runId: receipt.runId
	};
	const parsed = parseNodeWorkerSupervisorReceipt(receipt.state === "completed" ? {
		...identity,
		state: receipt.state,
		resultJson: receipt.resultJson
	} : receipt.state === "failed" || receipt.state === "interrupted" || receipt.state === "cancelled" ? {
		...identity,
		state: receipt.state,
		errorText: receipt.errorText
	} : {
		...identity,
		state: receipt.state
	});
	if (!parsed) throw new Error("node worker supervisor durable receipt is inconsistent");
	return parsed;
}
//#endregion
//#region src/node-host/node-worker-supervisor-commands.ts
function resolveWorkerConnectionEndpoint(params) {
	if (!params.gatewayUrl) throw new Error("node worker gateway connection unavailable");
	const gateway = new URL(params.gatewayUrl);
	if (gateway.protocol !== "ws:" && gateway.protocol !== "wss:") throw new Error("node worker gateway connection must use WebSocket transport");
	const endpointUrl = new URL(gateway.toString());
	endpointUrl.pathname = `${gateway.pathname.replace(/\/$/u, "")}${WORKER_PUBLIC_INGRESS_PATH}`;
	endpointUrl.search = "";
	endpointUrl.hash = "";
	if (endpointUrl.host !== gateway.host) throw new Error("node worker endpoint must stay on the connected gateway host");
	const endpoint = parseWorkerConnectionEndpoint({
		kind: "websocket",
		url: endpointUrl.toString(),
		...gateway.protocol === "wss:" && params.gatewayTlsFingerprint ? { tlsFingerprint: params.gatewayTlsFingerprint } : {}
	});
	if (!endpoint) throw new Error("node worker gateway connection could not form a worker endpoint");
	return endpoint;
}
/** Dispatches the non-advertised worker control contract before public node commands. */
async function invokeNodeWorkerSupervisorCommand(params) {
	if (!(params.command === "worker.launch.v1" || params.command === "worker.status.v1" || params.command === "worker.cancel.v1" || params.command === "worker.workspace.exec.v1" || params.command === "worker.workspace.retain.v1")) return { handled: false };
	if (params.command === "worker.workspace.exec.v1" && !params.workspace || params.command !== "worker.workspace.exec.v1" && !params.supervisor) return {
		handled: true,
		ok: false,
		code: "UNAVAILABLE",
		message: "node worker runtime unavailable"
	};
	try {
		if (params.command === "worker.workspace.exec.v1") return {
			handled: true,
			ok: true,
			payload: await params.workspace.exec(parseNodeWorkerWorkspaceExecInput(params.paramsJSON), params.signal, params.gatewayUrl ? {
				url: params.gatewayUrl,
				...params.gatewayTlsFingerprint ? { tlsFingerprint: params.gatewayTlsFingerprint } : {}
			} : void 0)
		};
		if (params.command === "worker.workspace.retain.v1") return {
			handled: true,
			ok: true,
			payload: await params.supervisor.retainWorkspaces(parseNodeWorkerWorkspaceRetainInput(params.paramsJSON), params.signal)
		};
		const receipt = params.command === "worker.launch.v1" ? await params.supervisor.launch(parseNodeWorkerLaunchInput(params.paramsJSON), resolveWorkerConnectionEndpoint(params), params.signal) : params.command === "worker.status.v1" ? await params.supervisor.status(parseNodeWorkerLookupInput(params.paramsJSON).launchId) : await params.supervisor.cancel(parseNodeWorkerCancelInput(params.paramsJSON));
		return {
			handled: true,
			ok: true,
			payload: receipt ? projectNodeWorkerSupervisorReceipt(receipt) : null
		};
	} catch (error) {
		const invalid = error instanceof Error && error.message.startsWith("INVALID_REQUEST:");
		const capacityFailure = error instanceof NodeWorkerCapacityExhaustedError;
		const transferFailure = error instanceof NodeWorkerWorkspaceTransferError;
		return {
			handled: true,
			ok: false,
			code: invalid ? "INVALID_REQUEST" : capacityFailure ? NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE : transferFailure ? NODE_WORKSPACE_TRANSFER_ERROR_CODE : "UNAVAILABLE",
			message: invalid || capacityFailure || transferFailure ? error.message : "node worker supervisor command failed"
		};
	}
}
//#endregion
//#region src/node-host/plugin-node-host.ts
/** Plugin node-host bridge for loading plugin registry commands and dispatching node capabilities. */
/**
* Plugin node-host command registry bridge.
*
* Node hosts load the active plugin registry, expose registered capabilities
* and commands, and dispatch incoming node-host commands by exact command id.
*/
const loadPluginRegistryLoaderModule = createLazyRuntimeModule(() => import("./plugins/loader.js"));
let nodeHostPluginRegistry;
function resolveNodeHostPluginRegistry() {
	return nodeHostPluginRegistry ?? getActivePluginRegistry() ?? void 0;
}
/** Ensure plugin registry data is loaded before node-host command dispatch. */
async function ensureNodeHostPluginRegistry(params) {
	nodeHostPluginRegistry = (await loadPluginRegistryLoaderModule()).loadPluginRegistryHandle({
		config: params.config,
		activationSourceConfig: params.config,
		env: params.env
	});
}
/** List registered node-host capabilities and command ids in deterministic order. */
function listRegisteredNodeHostCapsAndCommands(context, options = {}) {
	const registry = resolveNodeHostPluginRegistry();
	return withPluginRuntimeRegistryScope(registry, () => {
		const caps = /* @__PURE__ */ new Set();
		const commands = /* @__PURE__ */ new Set();
		let computerUse;
		const nodePluginTools = /* @__PURE__ */ new Map();
		for (const entry of registry?.nodeHostCommands ?? []) {
			if (entry.command.duplex === true && options.includeDuplex === false) continue;
			if (entry.command.isAvailable?.(context) === false) continue;
			if (entry.command.cap) caps.add(entry.command.cap);
			commands.add(entry.command.command);
			if (entry.command.computerUse) computerUse = parseComputerUseCapabilityDescriptor(entry.command.computerUse(context));
			const agentTool = buildNodePluginToolDescriptor(entry);
			if (agentTool) nodePluginTools.set(`${agentTool.pluginId}\0${agentTool.name}`, agentTool);
		}
		return {
			caps: [...caps].toSorted((left, right) => left.localeCompare(right)),
			commands: [...commands].toSorted((left, right) => left.localeCompare(right)),
			...computerUse ? { computerUse } : {},
			nodePluginTools: [...nodePluginTools.values()].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId) || left.name.localeCompare(right.name))
		};
	});
}
/** Watch plugin-owned availability inputs that can change during this process. */
function watchRegisteredNodeHostCommandAvailability(context, onChange) {
	const registry = resolveNodeHostPluginRegistry();
	const cleanups = [];
	withPluginRuntimeRegistryScope(registry, () => {
		for (const entry of registry?.nodeHostCommands ?? []) {
			const cleanup = entry.command.watchAvailability?.(context, () => withPluginRuntimeRegistryScope(registry, onChange));
			if (cleanup) cleanups.push(cleanup);
		}
	});
	return () => withPluginRuntimeRegistryScope(registry, () => {
		for (const cleanup of cleanups.splice(0)) cleanup();
	});
}
function isProviderSafeToolName(value) {
	return /^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(value);
}
function buildNodePluginToolDescriptor(entry) {
	const agentTool = entry.command.agentTool;
	if (!agentTool) return null;
	const name = normalizeOptionalString(agentTool.name) ?? "";
	const description = normalizeOptionalString(agentTool.description) ?? "";
	if (!isProviderSafeToolName(name) || !description) return null;
	const mcpServer = normalizeOptionalString(agentTool.mcp?.server) ?? "";
	const mcpTool = normalizeOptionalString(agentTool.mcp?.tool) ?? "";
	return {
		pluginId: entry.pluginId,
		name,
		description,
		parameters: asOptionalRecord(agentTool.parameters) ?? {
			type: "object",
			properties: {},
			additionalProperties: true
		},
		command: entry.command.command,
		...mcpServer && mcpTool ? { mcp: {
			server: mcpServer,
			tool: mcpTool
		} } : {}
	};
}
/** Invoke a registered node-host plugin command, or return null for unknown commands. */
async function invokeRegisteredNodeHostCommand(command, paramsJSON, io, context) {
	const registry = resolveNodeHostPluginRegistry();
	const match = (registry?.nodeHostCommands ?? []).find((entry) => entry.command.command === command);
	if (!match) return null;
	return await withPluginRuntimeRegistryScope(registry, async () => {
		if (match.command.duplex === true) {
			if (!io) throw new Error(`node command requires duplex transport: ${command}`);
			return context ? await match.command.handle(paramsJSON, io, context) : await match.command.handle(paramsJSON, io);
		}
		return context ? await match.command.handle(paramsJSON, void 0, context) : await match.command.handle(paramsJSON);
	});
}
function isRegisteredNodeHostCommandDuplex(command) {
	return (resolveNodeHostPluginRegistry()?.nodeHostCommands ?? []).find((entry) => entry.command.command === command)?.command.duplex === true;
}
function resetNodeHostPluginRegistry() {
	nodeHostPluginRegistry = void 0;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.nodeHostPluginTestApi")] = {
	getNodeHostPluginRegistry: () => nodeHostPluginRegistry,
	resetNodeHostPluginRegistry
};
//#endregion
//#region src/node-host/skills.ts
/** Resolve an advertised node skill directory locator to this node's canonical path. */
function resolveNodeHostedSkillDirectory(locator, nodeId) {
	if (!locator.startsWith("node://")) return null;
	const prefix = `node://${encodeURIComponent(nodeId)}/skills/`;
	const name = locator.startsWith(prefix) ? locator.slice(prefix.length) : "";
	if (!NODE_SKILL_NAME_RE.test(name)) throw new Error("INVALID_REQUEST: node skill cwd locator is invalid for this node");
	try {
		const skillsDir = fs.realpathSync(path.join(resolveConfigDir(), "skills"));
		const skillDir = fs.realpathSync(path.join(skillsDir, name));
		if (!isPathInside(skillsDir, skillDir) || !fs.statSync(path.join(skillDir, "SKILL.md")).isFile()) throw new Error("missing SKILL.md");
		return skillDir;
	} catch {
		throw new Error("INVALID_REQUEST: node skill cwd locator is unavailable");
	}
}
function listCandidateSkillFiles(skillsDir, warn) {
	let entries;
	try {
		entries = fs.readdirSync(skillsDir, { withFileTypes: true });
	} catch (error) {
		if (error.code !== "ENOENT") warn(`node host skill scan skipped (${skillsDir}): ${String(error)}`);
		return [];
	}
	const candidates = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
		const filePath = path.join(skillsDir, entry.name, "SKILL.md");
		try {
			if (fs.statSync(filePath, { throwIfNoEntry: false })?.isFile()) candidates.push(filePath);
		} catch (error) {
			warn(`node host skill skipped (${filePath}): ${String(error)}`);
		}
	}
	return candidates.toSorted((left, right) => left.localeCompare(right, "en"));
}
function scanNodeHostedSkills(options = {}) {
	const skillsDir = path.resolve(options.skillsDir ?? path.join(resolveConfigDir(), "skills"));
	const warn = options.warn ?? ((message) => console.warn(message));
	const rootSkillFile = path.join(skillsDir, "SKILL.md");
	try {
		if (fs.statSync(rootSkillFile, { throwIfNoEntry: false })?.isFile()) warn(`node host skill skipped (${rootSkillFile}): skills must use a named child directory`);
	} catch (error) {
		warn(`node host skill scan skipped (${rootSkillFile}): ${String(error)}`);
	}
	const candidates = listCandidateSkillFiles(skillsDir, warn);
	if (candidates.length === 0) return [];
	const loadedSkills = [];
	const frontmatterByFilePath = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		let invalidFrontmatter = false;
		const candidatePath = path.resolve(candidate);
		const loaded = loadSkillsFromDirSafe({
			dir: path.dirname(candidate),
			source: "openclaw-node",
			maxBytes: NODE_SKILL_MAX_CONTENT_BYTES,
			onDiagnostic: (diagnostic) => {
				if (path.resolve(diagnostic.path) === candidatePath) invalidFrontmatter = true;
				warn(`node host skill skipped (${diagnostic.path}): ${diagnostic.message}`);
			}
		});
		const skill = loaded.skills.find((entry) => path.resolve(entry.filePath) === candidatePath);
		if (skill) {
			loadedSkills.push(skill);
			const frontmatter = loaded.frontmatterByFilePath.get(skill.filePath);
			if (frontmatter) frontmatterByFilePath.set(skill.filePath, frontmatter);
			continue;
		}
		let size;
		try {
			size = fs.statSync(candidate, { throwIfNoEntry: false })?.size;
		} catch (error) {
			warn(`node host skill skipped (${candidate}): ${String(error)}`);
			continue;
		}
		const reason = invalidFrontmatter ? null : typeof size === "number" && size > 65536 ? `exceeds ${NODE_SKILL_MAX_CONTENT_BYTES} bytes` : "has invalid or missing frontmatter";
		if (reason) warn(`node host skill skipped (${candidate}): ${reason}`);
	}
	const descriptors = [];
	const seenNames = /* @__PURE__ */ new Set();
	let totalBytes = 0;
	for (const skill of loadedSkills.toSorted((left, right) => left.name.localeCompare(right.name, "en"))) {
		const frontmatter = frontmatterByFilePath.get(skill.filePath);
		if (frontmatter?.name?.trim() !== skill.name || frontmatter.description?.trim() !== skill.description || path.basename(skill.baseDir) !== skill.name) {
			warn(`node host skill skipped (${skill.filePath}): directory, name, and frontmatter must match`);
			continue;
		}
		let content;
		try {
			content = fs.readFileSync(skill.filePath, "utf8");
		} catch (error) {
			warn(`node host skill skipped (${skill.filePath}): ${String(error)}`);
			continue;
		}
		const contentBytes = Buffer.byteLength(content, "utf8");
		if (!NODE_SKILL_NAME_RE.test(skill.name) || !skill.description || skill.description.length > 1024 || contentBytes > 65536) {
			warn(`node host skill skipped (${skill.filePath}): invalid name, description, or size`);
			continue;
		}
		if (seenNames.has(skill.name)) {
			warn(`node host skill skipped (${skill.filePath}): duplicate name ${skill.name}`);
			continue;
		}
		if (descriptors.length >= 64) {
			warn(`node host skill skipped (${skill.filePath}): exceeds 64 skills`);
			continue;
		}
		if (totalBytes + contentBytes > 524288) {
			warn(`node host skill skipped (${skill.filePath}): exceeds ${NODE_SKILL_MAX_TOTAL_BYTES} total bytes`);
			continue;
		}
		seenNames.add(skill.name);
		totalBytes += contentBytes;
		descriptors.push({
			name: skill.name,
			description: skill.description,
			content
		});
	}
	return descriptors;
}
//#endregion
//#region src/node-host/invoke.ts
/** Node-host command dispatcher for system commands, approvals, env policy, and plugin commands. */
const OUTPUT_CAP = 2e5;
const MCP_TEXT_CONTENT_MAX_BYTES = 1024 * 1024;
const MCP_TEXT_TRUNCATION_MARKER = "\n[truncated: MCP text content exceeded 1 MB]";
const MCP_INVOKE_PAYLOAD_MAX_BYTES = 20 * 1024 * 1024;
const MCP_PAYLOAD_TRUNCATION_MARKER = "[truncated: MCP result exceeded 20 MB]";
const MCP_ERROR_MESSAGE_MAX_CHARS = 1024;
const OUTPUT_EVENT_TAIL = 2e4;
const DEFAULT_NODE_PATH$1 = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const execHostEnforced = normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_NODE_EXEC_HOST ?? "") === "app";
const execHostFallbackAllowed = normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_NODE_EXEC_FALLBACK ?? "") !== "0";
const preferMacAppExecHost = process.platform === "darwin" && execHostEnforced;
function resolveNodeSkillCwdParam(params, nodeId) {
	if (typeof params.cwd !== "string") return params;
	const resolved = resolveNodeHostedSkillDirectory(params.cwd, nodeId);
	return resolved ? {
		...params,
		cwd: resolved
	} : params;
}
function buildEnvOverrideRejectionMessage(params) {
	const details = [];
	if (params.rejectedOverrideBlockedKeys.length > 0) details.push(`blocked override keys: ${params.rejectedOverrideBlockedKeys.join(", ")}`);
	if (params.rejectedOverrideInvalidKeys.length > 0) details.push(`invalid non-portable override keys: ${params.rejectedOverrideInvalidKeys.join(", ")}`);
	return `SYSTEM_RUN_DENIED: environment override rejected (${details.join("; ")})`;
}
function buildSystemRunPrepareCoverageEnv(params) {
	const diagnostics = inspectHostExecEnvOverrides({
		overrides: params.env ?? void 0,
		blockPathOverrides: true
	});
	if (diagnostics.rejectedOverrideBlockedKeys.length > 0 || diagnostics.rejectedOverrideInvalidKeys.length > 0) return {
		ok: false,
		message: buildEnvOverrideRejectionMessage(diagnostics)
	};
	return {
		ok: true,
		env: sanitizeEnv(sanitizeSystemRunEnvOverrides({
			overrides: params.env ?? void 0,
			shellWrapper: isShellWrapperInvocation(params.argv)
		}))
	};
}
async function buildSystemRunAllowAlwaysCoverage(params) {
	const cwd = params.cwd ?? void 0;
	const shellWrapper = extractShellWrapperCommand(params.argv, params.rawCommand);
	if (shellWrapper.isWrapper) {
		if (!shellWrapper.command) return {
			complete: false,
			patterns: []
		};
		const authorizationPlan = await planShellAuthorization({
			command: shellWrapper.command,
			cwd,
			env: params.env,
			platform: process.platform
		});
		if (!authorizationPlan.ok) return {
			complete: false,
			patterns: []
		};
		const candidates = authorizationPlan.groups.flatMap((group) => group.candidates);
		const reusableSegments = candidates.filter((candidate) => candidate.allowAlways).map((candidate) => candidate.sourceSegment);
		const coverage = resolveAllowAlwaysPatternCoverage({
			segments: reusableSegments,
			cwd,
			env: params.env,
			platform: process.platform,
			strictInlineEval: params.strictInlineEval
		});
		return {
			...coverage,
			complete: coverage.complete && reusableSegments.length === candidates.length
		};
	}
	const analysis = analyzeArgvCommand({
		argv: params.argv,
		cwd,
		env: params.env
	});
	if (!analysis.ok) return {
		complete: false,
		patterns: []
	};
	return resolveAllowAlwaysPatternCoverage({
		segments: analysis.segments,
		cwd,
		env: params.env,
		platform: process.platform,
		strictInlineEval: params.strictInlineEval
	});
}
function resolveExecSecurity(value) {
	return value === "deny" || value === "allowlist" || value === "full" ? value : "allowlist";
}
function isCmdExeInvocation(argv) {
	const token = argv[0]?.trim();
	if (!token) return false;
	const base = normalizeLowercaseStringOrEmpty(path.win32.basename(token));
	return base === "cmd.exe" || base === "cmd";
}
function resolveExecAsk(value) {
	return value === "off" || value === "on-miss" || value === "always" ? value : "on-miss";
}
/** Builds a sanitized execution environment with controlled PATH and approved overrides. */
function sanitizeEnv(overrides) {
	return sanitizeHostExecEnv({
		overrides,
		blockPathOverrides: true
	});
}
function truncateOutput(raw, maxChars) {
	if (raw.length <= maxChars) return {
		text: raw,
		truncated: false
	};
	return {
		text: `... (truncated) ${sliceUtf16Safe(raw, raw.length - maxChars)}`,
		truncated: true
	};
}
function redactExecApprovals(file) {
	const socketPath = file.socket?.path?.trim();
	return {
		...file,
		socket: socketPath ? { path: socketPath } : void 0
	};
}
function requireExecApprovalsBaseHash(params, snapshot) {
	const baseHash = typeof params.baseHash === "string" ? params.baseHash.trim() : "";
	if (!snapshot.exists) {
		if (baseHash && baseHash !== snapshot.hash) throw new Error("INVALID_REQUEST: exec approvals changed; reload and retry");
		return;
	}
	if (!snapshot.hash) throw new Error("INVALID_REQUEST: exec approvals base hash unavailable; reload and retry");
	if (!baseHash) throw new Error("INVALID_REQUEST: exec approvals base hash required; reload and retry");
	if (baseHash !== snapshot.hash) throw new Error("INVALID_REQUEST: exec approvals changed; reload and retry");
}
function clarifyNodeExecCwdSpawnError(error, cwd) {
	const message = error.message;
	if (!cwd || error.code !== "ENOENT" && error.code !== "ENOTDIR") return message;
	let reason;
	try {
		if (fs.statSync(cwd).isDirectory()) return message;
		reason = "is not a directory";
	} catch (statError) {
		const statCode = statError.code;
		if (statCode !== "ENOENT" && statCode !== "ENOTDIR") return message;
		reason = statCode === "ENOTDIR" || error.code === "ENOTDIR" ? "is not a directory" : "does not exist";
	}
	return `node exec working directory ${reason} on the node host: ${cwd} (os reported: ${message})`;
}
async function runCommand(argv, cwd, env, timeoutMs, signal) {
	try {
		const result = await runCommandWithTimeout(argv, {
			baseEnv: env,
			cwd,
			killProcessTree: true,
			maxCombinedOutputBytes: OUTPUT_CAP,
			maxOutputBytes: OUTPUT_CAP,
			outputCapture: "head",
			input: Buffer.alloc(0),
			signal,
			timeoutMs: timeoutMs && timeoutMs > 0 ? timeoutMs : void 0
		});
		const timedOut = result.termination === "timeout";
		const exitCode = result.code ?? void 0;
		return {
			exitCode,
			timedOut,
			success: exitCode === 0 && !timedOut,
			stdout: result.stdout,
			stderr: result.stderr,
			error: null,
			truncated: Boolean(result.stdoutTruncatedBytes || result.stderrTruncatedBytes)
		};
	} catch (err) {
		return {
			exitCode: void 0,
			timedOut: false,
			success: false,
			stdout: "",
			stderr: "",
			error: clarifyNodeExecCwdSpawnError(err, cwd),
			truncated: false
		};
	}
}
function resolveEnvPath(env) {
	return (env?.PATH ?? env?.Path ?? process.env.PATH ?? process.env.Path ?? DEFAULT_NODE_PATH$1).split(path.delimiter).filter(Boolean);
}
function resolveExecutable(bin, env) {
	if (bin.includes("/") || bin.includes("\\")) return null;
	const extensions = process.platform === "win32" ? (env?.PATHEXT ?? env?.PathExt ?? env?.Pathext ?? process.env.PATHEXT ?? process.env.PathExt ?? ".EXE;.CMD;.BAT;.COM").split(";").map((ext) => normalizeLowercaseStringOrEmpty(ext)) : [""];
	for (const dir of resolveEnvPath(env)) for (const ext of extensions) {
		const candidate = path.join(dir, bin + ext);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}
async function handleSystemWhich(params, env) {
	const bins = normalizeStringEntries(params.bins);
	const found = {};
	for (const bin of bins) {
		const pathLocal = resolveExecutable(bin, env);
		if (pathLocal) found[bin] = pathLocal;
	}
	return { bins: found };
}
function buildExecEventPayload(payload) {
	if (!payload.output) return payload;
	const trimmed = payload.output.trim();
	if (!trimmed) return payload;
	const { text } = truncateOutput(trimmed, OUTPUT_EVENT_TAIL);
	return {
		...payload,
		output: text
	};
}
async function sendExecFinishedEvent(params) {
	const combined = [
		params.result.stdout,
		params.result.stderr,
		params.result.error
	].filter(Boolean).join("\n");
	await sendNodeEvent(params.client, "exec.finished", buildExecEventPayload({
		sessionKey: params.sessionKey,
		runId: params.runId,
		host: "node",
		command: params.commandText,
		exitCode: params.result.exitCode ?? void 0,
		timedOut: params.result.timedOut,
		success: params.result.success,
		output: combined,
		suppressNotifyOnExit: params.suppressNotifyOnExit
	}));
}
async function runViaMacAppExecHost(params) {
	const { approvals, request } = params;
	return await requestExecHostViaSocket({
		socketPath: approvals.socketPath,
		token: approvals.token,
		request
	});
}
async function sendJsonPayloadResult(client, frame, payload) {
	await sendInvokeResult(client, frame, {
		ok: true,
		payloadJSON: JSON.stringify(payload)
	});
}
async function sendMcpPayloadResult(client, frame, payload) {
	await sendInvokeResult(client, frame, {
		ok: true,
		payload
	});
}
async function sendRawPayloadResult(client, frame, payloadJSON) {
	await sendInvokeResult(client, frame, {
		ok: true,
		payloadJSON
	});
}
async function sendErrorResult(client, frame, code, message) {
	await sendInvokeResult(client, frame, {
		ok: false,
		error: {
			code,
			message
		}
	});
}
async function sendInvalidRequestResult(client, frame, err) {
	await sendErrorResult(client, frame, "INVALID_REQUEST", String(err));
}
function classifyExecApprovalsStorageError(err) {
	return (err && typeof err === "object" && "code" in err ? err.code : null) === "file_lock_timeout" ? "TIMEOUT" : "UNAVAILABLE";
}
async function sendExecApprovalsStorageErrorResult(client, frame, err) {
	await sendErrorResult(client, frame, classifyExecApprovalsStorageError(err), String(err));
}
function createNodeHostInvocationClient(client, signal) {
	if (!signal) return client;
	return { async request(method, params, opts) {
		if (signal.aborted && (method === "node.invoke.result" || method === "node.invoke.progress" || method === "node.event")) return {};
		return opts === void 0 ? await client.request(method, params) : await client.request(method, params, opts);
	} };
}
/** Handles one node-host command invocation payload and returns serialized results. */
async function handleInvoke(frame, client, skillBins, mcpManager, runtime = {}) {
	const invocationClient = createNodeHostInvocationClient(client, runtime.signal);
	try {
		await dispatchInvoke(frame, invocationClient, skillBins, mcpManager, runtime);
	} catch (err) {
		logWarn(`node host invoke failed (command=${frame.command ?? "unknown"}, id=${frame.id}): ${String(err)}`);
		try {
			await sendErrorResult(invocationClient, frame, "UNAVAILABLE", "node invocation failed");
		} catch (sendErr) {
			logWarn(`node host invoke failure response could not be sent (id=${frame.id}): ${String(sendErr)}`);
		}
	}
}
async function dispatchInvoke(frame, client, skillBins, mcpManager, runtime = {}) {
	const command = frame.command ?? "";
	const workerSupervisorResult = await invokeNodeWorkerSupervisorCommand({
		command,
		paramsJSON: frame.paramsJSON,
		supervisor: runtime.workerSupervisor,
		workspace: runtime.workerWorkspace,
		gatewayUrl: runtime.gatewayUrl,
		gatewayTlsFingerprint: runtime.gatewayTlsFingerprint,
		signal: runtime.signal
	});
	if (workerSupervisorResult.handled) {
		if (workerSupervisorResult.ok) await sendJsonPayloadResult(client, frame, workerSupervisorResult.payload);
		else await sendErrorResult(client, frame, workerSupervisorResult.code, workerSupervisorResult.message);
		return;
	}
	if (command === "device.apps") {
		const result = await invokeDeviceApps({
			paramsJSON: frame.paramsJSON,
			sharingEnabled: runtime.installedAppsSharingEnabled === true,
			...runtime.installedAppsPlatform ? { platform: runtime.installedAppsPlatform } : {},
			...runtime.scanInstalledApps ? { scan: runtime.scanInstalledApps } : {}
		});
		if (result.ok) await sendJsonPayloadResult(client, frame, result.payload);
		else await sendErrorResult(client, frame, result.code, result.message);
		return;
	}
	if (command === "desktop.stream") {
		try {
			await invokeNodeDesktopStream({
				paramsJSON: frame.paramsJSON,
				gatewayUrl: runtime.gatewayUrl,
				gatewayTlsFingerprint: runtime.gatewayTlsFingerprint,
				config: runtime.desktopHostConfig,
				signal: runtime.signal,
				emitStatus: runtime.emitProgress
			});
			await sendJsonPayloadResult(client, frame, { status: "closed" });
		} catch (error) {
			await sendErrorResult(client, frame, "UNAVAILABLE", error instanceof Error ? error.message : "desktop stream unavailable");
		}
		return;
	}
	if (command === "system.execApprovals.get") {
		try {
			const snapshot = await ensureExecApprovalsSnapshot();
			await sendJsonPayloadResult(client, frame, {
				path: snapshot.path,
				exists: snapshot.exists,
				hash: snapshot.hash,
				file: redactExecApprovals(snapshot.file)
			});
		} catch (err) {
			await sendExecApprovalsStorageErrorResult(client, frame, err);
		}
		return;
	}
	if (command === "system.execApprovals.set") {
		let params;
		let normalized;
		try {
			params = decodeParams(frame.paramsJSON);
			if (!params.file || typeof params.file !== "object") throw new Error("INVALID_REQUEST: exec approvals file required");
			normalized = normalizeExecApprovals(params.file);
		} catch (err) {
			await sendInvalidRequestResult(client, frame, err);
			return;
		}
		let snapshot;
		try {
			snapshot = readExecApprovalsSnapshot();
		} catch (err) {
			await sendExecApprovalsStorageErrorResult(client, frame, err);
			return;
		}
		try {
			requireExecApprovalsBaseHash(params, snapshot);
		} catch (err) {
			await sendInvalidRequestResult(client, frame, err);
			return;
		}
		let nextSnapshot;
		try {
			nextSnapshot = await updateExecApprovals({
				baseHash: snapshot.hash,
				update: (current) => mergeExecApprovalsSocketDefaults({
					normalized,
					current
				})
			});
		} catch (err) {
			await sendExecApprovalsStorageErrorResult(client, frame, err);
			return;
		}
		if (!nextSnapshot) {
			await sendErrorResult(client, frame, "INVALID_REQUEST", "INVALID_REQUEST: exec approvals changed; reload and retry");
			return;
		}
		await sendJsonPayloadResult(client, frame, {
			path: nextSnapshot.path,
			exists: nextSnapshot.exists,
			hash: nextSnapshot.hash,
			file: redactExecApprovals(nextSnapshot.file)
		});
		return;
	}
	if (command === "system.which") {
		try {
			const params = decodeParams(frame.paramsJSON);
			if (!Array.isArray(params.bins)) throw new Error("INVALID_REQUEST: bins required");
			await sendJsonPayloadResult(client, frame, await handleSystemWhich(params, sanitizeEnv(void 0)));
		} catch (err) {
			await sendInvalidRequestResult(client, frame, err);
		}
		return;
	}
	const fileCommand = await invokeNodeFileCommand(command, frame.paramsJSON);
	if (fileCommand) {
		if ("error" in fileCommand) await sendInvalidRequestResult(client, frame, fileCommand.error);
		else await sendJsonPayloadResult(client, frame, fileCommand.payload);
		return;
	}
	if (command === "mcp.tools.call.v1") {
		await handleMcpToolsCall(frame, client, mcpManager, runtime.signal);
		return;
	}
	if (command === "agent.cli.claude.run.v1") {
		await handleClaudeCliNodeInvoke({
			frame,
			client,
			skillBins,
			runtime,
			deps: {
				sendErrorResult,
				sendInvalidRequestResult,
				sendInvokeResult,
				resolveExecSecurity,
				resolveExecAsk,
				isCmdExeInvocation,
				sanitizeEnv,
				runViaMacAppExecHost,
				buildExecEventPayload
			}
		});
		return;
	}
	try {
		const { pluginCommandIo: io, pluginCommandContext: context } = runtime;
		const invokeContext = context && (frame.sessionKey || runtime.signal) ? {
			...context,
			...frame.sessionKey ? { sessionKey: frame.sessionKey } : {},
			...runtime.signal ? { signal: runtime.signal } : {}
		} : context;
		const pluginResult = await invokeRegisteredNodeHostCommand(command, frame.paramsJSON, io, invokeContext);
		if (pluginResult !== null) {
			await sendRawPayloadResult(client, frame, pluginResult);
			return;
		}
	} catch (err) {
		await sendInvalidRequestResult(client, frame, err);
		return;
	}
	if (command === "system.run.prepare") {
		try {
			const params = resolveNodeSkillCwdParam(decodeParams(frame.paramsJSON), frame.nodeId);
			const prepared = buildSystemRunApprovalPlan(params);
			if (!prepared.ok) {
				await sendErrorResult(client, frame, "INVALID_REQUEST", prepared.message);
				return;
			}
			const prepareEnv = buildSystemRunPrepareCoverageEnv({
				argv: prepared.plan.argv,
				env: params.env ?? void 0
			});
			if (!prepareEnv.ok) {
				await sendErrorResult(client, frame, "INVALID_REQUEST", prepareEnv.message);
				return;
			}
			const { getRuntimeConfig } = await import("./config/config.js");
			const execPolicy = await resolveEffectiveSystemRunExecPolicy({
				cfg: getRuntimeConfig(),
				agentId: prepared.plan.agentId ?? void 0,
				defaultSecurity: resolveExecSecurity(void 0),
				defaultAsk: resolveExecAsk(void 0),
				requireSocket: preferMacAppExecHost
			});
			await sendJsonPayloadResult(client, frame, {
				plan: {
					...prepared.plan,
					policySnapshot: createExecApprovalPolicySnapshot({
						file: execPolicy.approvals.file,
						agentId: prepared.plan.agentId ?? void 0
					})
				},
				execPolicy: {
					security: execPolicy.security,
					ask: execPolicy.ask
				},
				allowAlwaysCoverage: await buildSystemRunAllowAlwaysCoverage({
					argv: prepared.plan.argv,
					rawCommand: typeof params.rawCommand === "string" ? params.rawCommand : null,
					cwd: prepared.plan.cwd,
					env: prepareEnv.env,
					strictInlineEval: params.strictInlineEval === true
				})
			});
		} catch (err) {
			await sendInvalidRequestResult(client, frame, err);
		}
		return;
	}
	if (command !== "system.run") {
		await sendErrorResult(client, frame, "UNAVAILABLE", "command not supported");
		return;
	}
	let params;
	try {
		params = resolveNodeSkillCwdParam(decodeParams(frame.paramsJSON), frame.nodeId);
	} catch (err) {
		await sendInvalidRequestResult(client, frame, err);
		return;
	}
	if (!Array.isArray(params.command) || params.command.length === 0) {
		await sendErrorResult(client, frame, "INVALID_REQUEST", "command required");
		return;
	}
	await handleSystemRunInvoke({
		client,
		params,
		skillBins,
		signal: runtime.signal,
		execHostEnforced,
		execHostFallbackAllowed,
		resolveExecSecurity,
		resolveExecAsk,
		isCmdExeInvocation,
		sanitizeEnv,
		runCommand,
		runViaMacAppExecHost,
		sendNodeEvent,
		buildExecEventPayload,
		sendInvokeResult: async (result) => {
			await sendInvokeResult(client, frame, result);
		},
		sendExecFinishedEvent: async ({ sessionKey, runId, commandText, result, suppressNotifyOnExit }) => {
			await sendExecFinishedEvent({
				client,
				sessionKey,
				runId,
				commandText,
				result,
				suppressNotifyOnExit
			});
		},
		preferMacAppExecHost
	});
}
function decodeMcpToolsCallParams(raw) {
	const value = decodeParams(raw);
	if (!isRecord(value)) throw new Error("INVALID_REQUEST: MCP tool params must be an object");
	const server = typeof value.server === "string" ? value.server.trim() : "";
	const tool = typeof value.tool === "string" ? value.tool.trim() : "";
	if (!server || !tool) throw new Error("INVALID_REQUEST: server and tool required");
	if (value.arguments !== void 0 && !isRecord(value.arguments)) throw new Error("INVALID_REQUEST: arguments must be an object");
	return {
		server,
		tool,
		...value.arguments ? { arguments: value.arguments } : {}
	};
}
function normalizeMcpContentBlock(block) {
	if (!isRecord(block)) return null;
	return mcpContentBlockToAgentContent(block);
}
function serializedJsonBytes(value) {
	return Buffer.byteLength(JSON.stringify(value));
}
/** Keeps MCP text/image content while bounding text sent through node.invoke. */
function boundMcpToolResultPayload(result) {
	const normalizedBlocks = result.content.map(normalizeMcpContentBlock).filter((block) => block !== null);
	const totalTextBytes = normalizedBlocks.reduce((total, block) => total + (isRecord(block) && block.type === "text" && typeof block.text === "string" ? Buffer.byteLength(block.text) : 0), 0);
	let remainingTextBytes = totalTextBytes > MCP_TEXT_CONTENT_MAX_BYTES ? MCP_TEXT_CONTENT_MAX_BYTES - Buffer.byteLength(MCP_TEXT_TRUNCATION_MARKER) : MCP_TEXT_CONTENT_MAX_BYTES;
	let markedTruncated = false;
	const textBoundedContent = [];
	for (const block of normalizedBlocks) {
		if (block.type === "image" && typeof block.data === "string" && typeof block.mimeType === "string") {
			textBoundedContent.push(block);
			continue;
		}
		if (block.type !== "text" || typeof block.text !== "string") continue;
		if (totalTextBytes <= MCP_TEXT_CONTENT_MAX_BYTES) {
			textBoundedContent.push(block);
			continue;
		}
		if (markedTruncated) continue;
		const text = truncateUtf8Prefix(block.text, remainingTextBytes);
		remainingTextBytes -= Buffer.byteLength(text);
		const blockWasTruncated = text.length < block.text.length;
		if (text || blockWasTruncated) textBoundedContent.push({
			...block,
			text: blockWasTruncated ? `${text}${MCP_TEXT_TRUNCATION_MARKER}` : text
		});
		if (blockWasTruncated || remainingTextBytes === 0) {
			if (!blockWasTruncated) textBoundedContent.push({
				type: "text",
				text: MCP_TEXT_TRUNCATION_MARKER.trimStart()
			});
			markedTruncated = true;
		}
	}
	const payloadMarker = {
		type: "text",
		text: MCP_PAYLOAD_TRUNCATION_MARKER
	};
	const reservedMarkerBytes = serializedJsonBytes(payloadMarker) + 1;
	let usedBytes = Buffer.byteLength("{\"content\":[]}");
	let payloadTruncated = false;
	const content = [];
	for (const block of textBoundedContent) {
		const blockBytes = serializedJsonBytes(block) + (content.length > 0 ? 1 : 0);
		if (usedBytes + blockBytes + reservedMarkerBytes > MCP_INVOKE_PAYLOAD_MAX_BYTES) {
			payloadTruncated = true;
			continue;
		}
		content.push(block);
		usedBytes += blockBytes;
	}
	let structuredContent;
	if (result.structuredContent) {
		const structuredBytes = Buffer.byteLength(",\"structuredContent\":") + serializedJsonBytes(result.structuredContent);
		if (usedBytes + structuredBytes + reservedMarkerBytes <= MCP_INVOKE_PAYLOAD_MAX_BYTES) structuredContent = result.structuredContent;
		else payloadTruncated = true;
	}
	if (payloadTruncated) content.push(payloadMarker);
	return {
		content,
		...structuredContent ? { structuredContent } : {}
	};
}
function mcpToolErrorMessage(result) {
	return truncateUtf16Safe(result.content.filter((block) => isRecord(block) && block.type === "text" && typeof block.text === "string").map((block) => block.text.trim()).filter(Boolean).join("\n") || "MCP tool returned an error", 1024);
}
async function handleMcpToolsCall(frame, client, mcpManager, signal) {
	if (!mcpManager) {
		await sendErrorResult(client, frame, "MCP_SERVER_UNAVAILABLE", "node host MCP is unavailable");
		return;
	}
	let params;
	try {
		params = decodeMcpToolsCallParams(frame.paramsJSON);
	} catch (error) {
		await sendInvalidRequestResult(client, frame, error);
		return;
	}
	try {
		const result = await mcpManager.callMcpTool({
			...params,
			timeoutMs: frame.timeoutMs ?? void 0,
			...signal ? { signal } : {}
		});
		if (result.isError) {
			await sendErrorResult(client, frame, "MCP_TOOL_ERROR", mcpToolErrorMessage(result));
			return;
		}
		await sendMcpPayloadResult(client, frame, boundMcpToolResultPayload(result));
	} catch (error) {
		if (error instanceof NodeHostMcpError) {
			await sendErrorResult(client, frame, error.code, error.message);
			return;
		}
		await sendErrorResult(client, frame, "MCP_TOOL_ERROR", truncateUtf16Safe(String(error), MCP_ERROR_MESSAGE_MAX_CHARS));
	}
}
function decodeParams(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
	}
}
async function sendInvokeResult(client, frame, result) {
	try {
		await client.request("node.invoke.result", buildNodeInvokeResultParams(frame, result));
	} catch {}
}
function buildNodeInvokeResultParams(frame, result) {
	const params = {
		id: frame.id,
		nodeId: frame.nodeId,
		ok: result.ok
	};
	if (result.payload !== void 0) params.payload = result.payload;
	if (typeof result.payloadJSON === "string") params.payloadJSON = result.payloadJSON;
	if (result.error) params.error = result.error;
	return params;
}
async function sendNodeEvent(client, event, payload) {
	try {
		await client.request("node.event", buildNodeEventParams(event, payload));
	} catch {}
}
const testing = {
	MCP_TEXT_CONTENT_MAX_BYTES,
	MCP_INVOKE_PAYLOAD_MAX_BYTES,
	clarifyNodeExecCwdSpawnError,
	runCommand
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.nodeHostInvokeTestApi")] = testing;
//#endregion
//#region src/node-host/node-worker-build.ts
const SOURCE_IDENTITY_STAT_CONCURRENCY = 64;
function sameSourceIdentityStats(expected, current) {
	return current.dev === expected.dev && current.ino === expected.ino && current.mode === expected.mode && current.size === expected.size && current.mtimeNs === expected.mtimeNs && current.ctimeNs === expected.ctimeNs && (expected.kind === "file" ? current.isFile() : current.isDirectory()) && !current.isSymbolicLink();
}
async function matchesWorkerBundleSourceIdentity(entries) {
	for (let offset = 0; offset < entries.length; offset += SOURCE_IDENTITY_STAT_CONCURRENCY) {
		const batch = entries.slice(offset, offset + SOURCE_IDENTITY_STAT_CONCURRENCY);
		if ((await Promise.all(batch.map(async (expected) => {
			try {
				const current = await fs$1.lstat(expected.path, { bigint: true });
				return expected.path === expected.realPath && sameSourceIdentityStats(expected, current);
			} catch {
				return false;
			}
		}))).includes(false)) return false;
	}
	return true;
}
async function computeNodeWorkerBuild(packageRoot, options) {
	const stagingRoot = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-node-worker-build-"));
	try {
		const collected = await collectWorkerBundleManifestWithSourceIdentity(packageRoot, stagingRoot);
		return {
			build: {
				bundleHash: hashWorkerBundleManifest(collected.manifest),
				openclawVersion: options.openclawVersion ?? VERSION,
				protocolFeatures: [...options.protocolFeatures ?? WORKER_PROTOCOL_FEATURES].toSorted()
			},
			sourceIdentity: collected.sourceIdentity
		};
	} finally {
		await fs$1.rm(stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
/** Resolves and freezes the package root that produced the node's advertised worker build. */
async function resolveNodeWorkerInstallation(options = {}) {
	const packageRoot = options.packageRoot ?? resolveOpenClawPackageRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (!packageRoot) throw new Error("Unable to locate the running OpenClaw package root for node worker hosting");
	const canonicalRoot = await fs$1.realpath(packageRoot);
	const initial = await computeNodeWorkerBuild(canonicalRoot, options);
	let sourceIdentity = initial.sourceIdentity;
	let invalid = false;
	let pending;
	const revalidateBuild = () => {
		if (invalid) return Promise.resolve(false);
		pending ??= (async () => {
			if (await matchesWorkerBundleSourceIdentity(sourceIdentity)) return true;
			try {
				const current = await computeNodeWorkerBuild(canonicalRoot, options);
				if (current.build.bundleHash !== initial.build.bundleHash) {
					invalid = true;
					return false;
				}
				sourceIdentity = current.sourceIdentity;
				return true;
			} catch {
				invalid = true;
				return false;
			}
		})().finally(() => {
			pending = void 0;
		});
		return pending;
	};
	return {
		packageRoot: canonicalRoot,
		build: initial.build,
		revalidateBuild
	};
}
//#endregion
//#region src/node-host/node-worker-entry.ts
/** Resolves an explicitly selected worker install without crossing local/bundle trust modes. */
async function resolveNodeWorkerEntry(params) {
	if (params.installKind === "local") {
		const installation = params.localInstallation;
		if (!installation || installation.build.bundleHash !== params.expectedBundleHash) throw new Error("node worker local install does not match its advertised build");
		if (!await installation.revalidateBuild()) throw new Error("node worker local install changed after its build was advertised");
		const root = fs.realpathSync.native(installation.packageRoot);
		const entry = fs.realpathSync.native(path.join(root, "openclaw.mjs"));
		if (!isPathInside(root, entry) || !fs.statSync(entry).isFile()) throw new Error("node worker local entry must be a regular file inside its install");
		return entry;
	}
	const root = fs.realpathSync.native(params.bundleRoot);
	const bundle = fs.realpathSync.native(path.join(root, params.gatewayNamespace, "bundles", params.expectedBundleHash));
	if (!isPathInside(root, bundle)) throw new Error("node worker bundle resolves outside its configured root");
	const entry = fs.realpathSync.native(path.join(bundle, "openclaw.mjs"));
	if (!isPathInside(bundle, entry) || !fs.statSync(entry).isFile()) throw new Error("node worker entry must be a regular file inside its bundle");
	return entry;
}
//#endregion
//#region src/node-host/node-worker-environment.ts
const POSIX_WORKER_ENV_KEYS = /* @__PURE__ */ new Set([
	"PATH",
	"HOME",
	"TMPDIR",
	"TMP",
	"TEMP",
	"LANG",
	"LANGUAGE",
	"TZ",
	"NODE_EXTRA_CA_CERTS",
	"NODE_USE_SYSTEM_CA",
	"OPENCLAW_ALLOW_INSECURE_PRIVATE_WS"
]);
const WINDOWS_WORKER_ENV_KEYS = /* @__PURE__ */ new Set([
	...POSIX_WORKER_ENV_KEYS,
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"SYSTEMROOT",
	"WINDIR",
	"COMSPEC",
	"PATHEXT"
]);
/** Freeze the minimal non-secret environment inherited by node-host workers. */
function snapshotNodeWorkerEnv(source) {
	const windows = process.platform === "win32";
	const snapshot = {};
	const retainedWindowsKeys = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(source)) {
		if (value === void 0) continue;
		const normalized = windows ? key.toUpperCase() : key;
		if (!((windows ? WINDOWS_WORKER_ENV_KEYS : POSIX_WORKER_ENV_KEYS).has(normalized) || normalized.startsWith("LC_"))) continue;
		if (windows) {
			const previousKey = retainedWindowsKeys.get(normalized);
			if (previousKey) delete snapshot[previousKey];
			retainedWindowsKeys.set(normalized, key);
		}
		snapshot[key] = value;
	}
	snapshot.NODE_DISABLE_COMPILE_CACHE = "1";
	snapshot.OPENCLAW_NO_RESPAWN = "1";
	return snapshot;
}
//#endregion
//#region src/node-host/node-worker-output.ts
const NODE_WORKER_STDOUT_MAX_BYTES = 64 * 1024;
const STDERR_MAX_BYTES = 4 * 1024;
function createNodeWorkerCredentialScrubber(credential) {
	const ordered = [.../* @__PURE__ */ new Set([
		credential,
		encodeURIComponent(credential),
		JSON.stringify(credential).slice(1, -1)
	])].toSorted((left, right) => right.length - left.length);
	return {
		maxRepresentationBytes: Math.max(...ordered.map((representation) => Buffer.byteLength(representation, "utf8"))),
		scrub: (text) => {
			let scrubbed = text;
			for (const representation of ordered) scrubbed = scrubbed.replaceAll(representation, "[REDACTED]");
			return scrubbed;
		}
	};
}
function redactLaunchText(value, scrubCredential) {
	return redactToolPayloadText(redactRegisteredSecretValues(scrubCredential(value), () => "[REDACTED]"));
}
function sanitizeNodeWorkerDiagnostic(value, fallback, scrubCredential) {
	return truncateUtf8Suffix(redactLaunchText(formatErrorMessage(value), scrubCredential).replace(/\s+/gu, " ").trim() || fallback, STDERR_MAX_BYTES);
}
function parseNodeWorkerSuccessfulResult(stdout, scrubCredential) {
	if (stdout.truncatedBytes > 0) throw new Error(`worker stdout exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`);
	const redacted = redactLaunchText(finalizeCapturedOutput(stdout, "head", true).toString("utf8").trim(), scrubCredential);
	let parsed;
	try {
		parsed = JSON.parse(redacted);
	} catch (error) {
		throw new Error("worker returned invalid JSON output", { cause: error });
	}
	const result = JSON.stringify(parsed);
	if (Buffer.byteLength(result, "utf8") > 65536) throw new Error(`worker result exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`);
	return result;
}
const NODE_WORKER_STDERR_MAX_BYTES = STDERR_MAX_BYTES;
//#endregion
//#region src/node-host/node-worker-tree-control.ts
const RECOVERY_POLL_MS = 25;
function inspectPosixProcessGroup(pid) {
	try {
		process.kill(-pid, 0);
		return "live";
	} catch (error) {
		return error.code === "ESRCH" ? "dead" : "unknown";
	}
}
function inspectOwnedNodeWorkerTree(worker) {
	const root = inspectNodeWorkerProcessIdentity(worker);
	if (root === "reused") return "dead";
	if (root === "live") return "live";
	if (root === "unknown") return "unknown";
	return process.platform === "win32" ? "dead" : inspectPosixProcessGroup(worker.pid);
}
async function signalOwnedNodeWorkerTree(worker, signal) {
	const root = inspectNodeWorkerProcessIdentity(worker);
	if (root === "reused" || root === "unknown") return;
	if (process.platform !== "win32") {
		if (inspectPosixProcessGroup(worker.pid) !== "live") return;
		const revalidatedRoot = inspectNodeWorkerProcessIdentity(worker);
		if (revalidatedRoot === "reused" || revalidatedRoot === "unknown") return;
		try {
			process.kill(-worker.pid, signal);
		} catch (error) {
			if (error.code !== "ESRCH") throw error;
		}
		return;
	}
	if (root !== "live" || inspectNodeWorkerProcessIdentity(worker) !== "live") return;
	await new Promise((resolve) => {
		signalProcessTree(worker.pid, signal, {
			detached: true,
			onComplete: resolve
		});
	});
}
async function waitForOwnedNodeWorkerTreeDeath(worker, timeoutMs) {
	const deadline = Date.now() + timeoutMs;
	let state = inspectOwnedNodeWorkerTree(worker);
	while (state === "live" && Date.now() < deadline) {
		await setTimeout$1(RECOVERY_POLL_MS);
		state = inspectOwnedNodeWorkerTree(worker);
	}
	return state;
}
//#endregion
//#region src/node-host/node-worker-transfer-client.ts
const TRANSFER_TIMEOUT_MS = 10 * 6e4;
const TRANSFER_RESULT_MAX_BYTES = 64 * 1024;
const validatedTlsSocketPins = /* @__PURE__ */ new WeakMap();
const transferLog = createSubsystemLogger("node-host/worker-workspace");
function tlsPinMismatch() {
	return new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: gateway TLS fingerprint mismatch");
}
function transferUrl(gatewayUrl, routePath) {
	const gateway = new URL(gatewayUrl);
	if (gateway.protocol !== "ws:" && gateway.protocol !== "wss:") throw new Error("workspace transfer gateway must use WebSocket transport");
	const url = new URL(gateway.toString());
	url.protocol = gateway.protocol === "wss:" ? "https:" : "http:";
	url.pathname = `${gateway.pathname.replace(/\/$/u, "")}${routePath}`;
	url.search = "";
	url.hash = "";
	if (url.host !== gateway.host) throw new Error("workspace transfer endpoint must stay on the connected gateway host");
	return url;
}
function waitForTlsPin(request, expectedRaw) {
	if (!expectedRaw?.trim()) return Promise.resolve();
	const expected = normalizeFingerprint(expectedRaw);
	if (!expected) return Promise.reject(new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: gateway TLS fingerprint is invalid"));
	return new Promise((resolve, reject) => {
		let settled = false;
		let tlsSocket;
		let fail = () => {};
		let verify = () => {};
		let bindSocket = () => {};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			request.off("error", fail);
			request.off("socket", bindSocket);
			tlsSocket?.off("secureConnect", verify);
			if (error) reject(error);
			else resolve();
		};
		fail = (error) => finish(error);
		request.once("error", fail);
		bindSocket = (socket) => {
			tlsSocket = socket;
			const validated = validatedTlsSocketPins.get(tlsSocket);
			if (validated) {
				finish(validated === expected ? void 0 : tlsPinMismatch());
				return;
			}
			verify = () => {
				const actual = normalizeFingerprint(tlsSocket.getPeerCertificate().fingerprint256 ?? "");
				if (!actual || expected !== actual) {
					finish(tlsPinMismatch());
					return;
				}
				validatedTlsSocketPins.set(tlsSocket, actual);
				finish();
			};
			const peerFingerprint = tlsSocket.getPeerCertificate().fingerprint256;
			if (request.reusedSocket || peerFingerprint) verify();
			else tlsSocket.once("secureConnect", verify);
		};
		request.once("socket", bindSocket);
	});
}
async function openRequest(params) {
	const url = transferUrl(params.gatewayUrl, params.routePath);
	const request = (url.protocol === "https:" ? https : http).request(url, {
		method: params.method,
		headers: {
			authorization: `Bearer ${params.token}`,
			...params.headers
		},
		signal: params.signal,
		...url.protocol === "https:" && params.tlsFingerprint ? {
			rejectUnauthorized: false,
			session: Buffer.alloc(0)
		} : {}
	});
	const response = once(request, "response").then(([message]) => message);
	const send = async () => {
		if (url.protocol === "https:") await waitForTlsPin(request, params.tlsFingerprint);
		await params.writeBody?.(request);
		request.end();
	};
	send().catch((error) => request.destroy(error instanceof Error ? error : new Error(String(error))));
	return await response;
}
async function readResponseBody(response, maxBytes) {
	const chunks = [];
	let total = 0;
	for await (const value of response) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		total += chunk.byteLength;
		if (total > maxBytes) {
			response.destroy(/* @__PURE__ */ new Error("workspace transfer response exceeded its byte limit"));
			throw new Error("workspace transfer response exceeded its byte limit");
		}
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}
async function requireOk(response) {
	if (response.statusCode === 200) return;
	const body = (await readResponseBody(response, TRANSFER_RESULT_MAX_BYTES)).toString("utf8");
	if (response.statusCode === 413 && body.includes("workspace_transfer_limit")) throw new NodeWorkerWorkspaceTransferError("workspace-transfer-limit: gateway rejected workspace transfer caps");
	throw new NodeWorkerWorkspaceTransferError(`workspace-transfer-failed: gateway returned ${response.statusCode ?? 0}`);
}
async function downloadBuffer(params, maxBytes) {
	const response = await openRequest(params);
	await requireOk(response);
	return await readResponseBody(response, maxBytes);
}
async function downloadFile(params) {
	const response = await openRequest(params.request);
	await requireOk(response);
	const output = fs.createWriteStream(params.destination, {
		flags: "wx",
		mode: 384
	});
	const hash = createHash("sha256");
	let bytes = 0;
	try {
		for await (const value of response) {
			const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
			bytes += chunk.byteLength;
			if (bytes > (params.expectedBytes ?? 4294967296) || bytes > 4294967296) throw new Error("workspace transfer download exceeded its byte limit");
			hash.update(chunk);
			if (!output.write(chunk)) await once(output, "drain");
		}
		const finished = once(output, "finish");
		output.end();
		await finished;
	} catch (error) {
		output.destroy();
		await fs$1.rm(params.destination, { force: true });
		throw error;
	}
	if (params.expectedBytes !== void 0 && bytes !== params.expectedBytes || params.expectedSha256 !== void 0 && hash.digest("hex") !== params.expectedSha256) {
		await fs$1.rm(params.destination, { force: true });
		throw new Error("workspace transfer blob failed integrity validation");
	}
}
function workspacePath(root, relative) {
	const candidate = path.join(root, ...relative.split("/"));
	if (candidate !== root && !isPathInside(root, candidate)) throw new Error("workspace transfer manifest escaped its workspace");
	return candidate;
}
function workspaceCommandEnv(homeDir) {
	return {
		...process.env,
		HOME: homeDir,
		...process.platform === "win32" ? { USERPROFILE: homeDir } : {},
		GCM_INTERACTIVE: "Never",
		GIT_ASKPASS: "",
		GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
		GIT_CONFIG_NOSYSTEM: "1",
		GIT_TERMINAL_PROMPT: "0",
		SSH_ASKPASS: ""
	};
}
async function runWorkspaceCommand(params) {
	const maxOutputBytes = params.maxOutputBytes ?? 128 * 1024;
	const result = await runCommandWithTimeout(params.argv, {
		cwd: params.workspaceDir,
		baseEnv: workspaceCommandEnv(params.homeDir),
		...params.input === void 0 ? {} : { input: params.input },
		timeoutMs: TRANSFER_TIMEOUT_MS,
		signal: params.signal,
		maxOutputBytes,
		maxCombinedOutputBytes: maxOutputBytes + 128 * 1024
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error(`workspace transfer apply failed: ${(result.stderr || result.stdout).trim()}`);
	return result.stdout;
}
async function captureManifest(params) {
	return (await runWorkspaceCommand({
		workspaceDir: params.workspaceDir,
		homeDir: params.manifestHome,
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_MANIFEST_JS,
			params.workspaceDir,
			params.baseCommit ?? "",
			...params.baseCommit ? ["eligible"] : []
		],
		signal: params.signal
	})).trim();
}
async function initializeGitWorkspace(params) {
	const objectFormat = params.baseCommit.length === 40 ? "sha1" : "sha256";
	if (params.baseCommit.length !== 40 && params.baseCommit.length !== 64) throw new Error("workspace transfer Git base object id is invalid");
	const git = async (args, options = {}) => await runWorkspaceCommand({
		workspaceDir: params.workspaceDir,
		homeDir: params.manifestHome,
		argv: [
			"git",
			"-C",
			params.workspaceDir,
			...args
		],
		...options.input === void 0 ? {} : { input: options.input },
		signal: params.signal,
		...options.maxOutputBytes === void 0 ? {} : { maxOutputBytes: options.maxOutputBytes }
	});
	await git([
		"init",
		"--quiet",
		`--object-format=${objectFormat}`,
		"."
	]);
	const pack = await fs$1.open(params.packPath, "r");
	try {
		await runExec("git", [
			"-C",
			params.workspaceDir,
			"index-pack",
			"--stdin"
		], {
			cwd: params.workspaceDir,
			baseEnv: workspaceCommandEnv(params.manifestHome),
			stdinFileDescriptor: pack.fd,
			signal: params.signal,
			timeoutMs: TRANSFER_TIMEOUT_MS,
			maxBuffer: 256 * 1024,
			logOutput: false
		});
	} finally {
		await pack.close();
	}
	await fs$1.writeFile(path.join(params.workspaceDir, ".git", "shallow"), `${params.baseCommit}\n`);
	if ((await git([
		"rev-parse",
		"--verify",
		`${params.baseCommit}^{commit}`
	])).trim() !== params.baseCommit) throw new Error("workspace transfer Git base does not match the synced pack");
	await git([
		"update-ref",
		"refs/heads/openclaw-worker",
		params.baseCommit
	]);
	await git([
		"symbolic-ref",
		"HEAD",
		"refs/heads/openclaw-worker"
	]);
	await git(["read-tree", params.baseCommit]);
	const gitlinks = (await git([
		"ls-files",
		"--stage",
		"-z"
	], { maxOutputBytes: MAX_WORKSPACE_MANIFEST_BYTES })).split("\0").filter(Boolean).flatMap((record) => {
		const separator = record.indexOf("	");
		return separator >= 0 && record.startsWith("160000 ") ? [record.slice(separator + 1)] : [];
	});
	if (gitlinks.length > 0) await git([
		"update-index",
		"--skip-worktree",
		"-z",
		"--stdin"
	], { input: `${gitlinks.join("\0")}\0` });
	await fs$1.rm(params.packPath, { force: true });
}
const workspaceTransferQueues = /* @__PURE__ */ new Map();
async function serializeNodeWorkerWorkspace(workspaceDir, operation) {
	const key = path.resolve(workspaceDir);
	const previous = workspaceTransferQueues.get(key) ?? Promise.resolve();
	let release;
	const current = new Promise((resolve) => {
		release = resolve;
	});
	const queued = previous.then(() => current);
	workspaceTransferQueues.set(key, queued);
	await previous;
	try {
		return await operation();
	} finally {
		release();
		if (workspaceTransferQueues.get(key) === queued) workspaceTransferQueues.delete(key);
	}
}
async function removeTransferArtifact(target) {
	await fs$1.rm(target, {
		recursive: true,
		force: true,
		maxRetries: process.platform === "win32" ? 5 : 0,
		retryDelay: 100
	});
}
async function recoverWorkspaceReplacement(workspaceDir) {
	const parent = path.dirname(workspaceDir);
	const workspaceName = path.basename(workspaceDir);
	await fs$1.mkdir(parent, {
		recursive: true,
		mode: 448
	});
	const entries = await fs$1.readdir(parent, { withFileTypes: true });
	const stagingPrefix = `.${workspaceName}.workspace-transfer-`;
	const staging = entries.filter((entry) => entry.name.startsWith(stagingPrefix));
	const backups = entries.filter((entry) => entry.name.startsWith(`${workspaceName}.previous-`));
	for (const entry of staging) if (entry.isDirectory() && !entry.isSymbolicLink()) await removeTransferArtifact(path.join(parent, entry.name));
	const workspaceExists = await fs$1.lstat(workspaceDir).then((stats) => {
		if (stats.isSymbolicLink() || !stats.isDirectory()) throw new Error("workspace transfer target is not an owned directory");
		return true;
	}).catch((error) => {
		if (error.code === "ENOENT") return false;
		throw error;
	});
	const validBackups = [];
	for (const entry of backups) if (entry.isDirectory() && !entry.isSymbolicLink()) validBackups.push(path.join(parent, entry.name));
	if (!workspaceExists) {
		if (validBackups.length > 1) throw new Error("workspace transfer recovery found multiple prior workspaces");
		if (validBackups.length === 1) await fs$1.rename(validBackups[0], workspaceDir);
		return;
	}
	await Promise.all(validBackups.map((backup) => removeTransferArtifact(backup).catch(() => void 0)));
}
async function replaceWorkspace(workspaceDir, staging) {
	const backup = `${workspaceDir}.previous-${process.pid}-${randomUUID()}`;
	let movedOld = false;
	try {
		await fs$1.rename(workspaceDir, backup);
		movedOld = true;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	try {
		await fs$1.rename(staging, workspaceDir);
	} catch (error) {
		if (movedOld) try {
			await fs$1.rename(backup, workspaceDir);
		} catch (rollbackError) {
			const recoveryError = new Error(`workspace transfer rollback failed; recover ${backup}`, { cause: error });
			Object.defineProperty(recoveryError, "rollbackError", { value: rollbackError });
			throw recoveryError;
		}
		throw error;
	}
	if (movedOld) await removeTransferArtifact(backup).catch(() => void 0);
}
async function downloadWorkspace(params) {
	const startedAt = performance.now();
	let packDownloadMs;
	const manifest = parseWorkerWorkspaceManifest((await downloadBuffer({
		gatewayUrl: params.gatewayUrl,
		tlsFingerprint: params.tlsFingerprint,
		routePath: nodeWorkspaceTransferManifestPath(params.environmentId, params.transfer.manifestRef),
		method: "GET",
		token: params.transfer.token,
		signal: params.signal
	}, MAX_WORKSPACE_MANIFEST_BYTES)).toString("utf8"), params.transfer.manifestRef);
	const stagingWorkspace = await tempWorkspace({
		rootDir: path.dirname(params.workspaceDir),
		prefix: `.${path.basename(params.workspaceDir)}.workspace-transfer-`
	});
	const staging = stagingWorkspace.dir;
	try {
		if (manifest.baseCommit) {
			const packPath = path.join(staging, ".openclaw-base.pack");
			const packStartedAt = performance.now();
			await downloadFile({
				request: {
					gatewayUrl: params.gatewayUrl,
					tlsFingerprint: params.tlsFingerprint,
					routePath: nodeWorkspaceTransferPackPath(params.environmentId, params.transfer.manifestRef),
					method: "GET",
					token: params.transfer.token,
					signal: params.signal
				},
				destination: packPath
			});
			packDownloadMs = performance.now() - packStartedAt;
			await initializeGitWorkspace({
				workspaceDir: staging,
				manifestHome: params.manifestHome,
				packPath,
				baseCommit: manifest.baseCommit,
				signal: params.signal
			});
		}
		const blobApplyStartedAt = performance.now();
		for (const directory of manifest.directories ?? []) await fs$1.mkdir(workspacePath(staging, directory), {
			recursive: true,
			mode: 448
		});
		for (const entry of manifest.entries) {
			const destination = workspacePath(staging, entry.path);
			await fs$1.mkdir(path.dirname(destination), {
				recursive: true,
				mode: 448
			});
			await fs$1.rm(destination, {
				recursive: true,
				force: true
			});
			if (entry.type === "symlink") {
				await fs$1.symlink(entry.target, destination);
				continue;
			}
			await downloadFile({
				request: {
					gatewayUrl: params.gatewayUrl,
					tlsFingerprint: params.tlsFingerprint,
					routePath: nodeWorkspaceTransferBlobPath(params.environmentId, entry.sha256),
					method: "GET",
					token: params.transfer.token,
					signal: params.signal
				},
				destination,
				expectedBytes: entry.size,
				expectedSha256: entry.sha256
			});
			await fs$1.chmod(destination, entry.mode);
		}
		const blobApplyMs = performance.now() - blobApplyStartedAt;
		const observed = await captureManifest({
			workspaceDir: staging,
			manifestHome: params.manifestHome,
			baseCommit: manifest.baseCommit,
			signal: params.signal
		});
		if (observed !== params.transfer.manifestRef) throw new Error(`workspace transfer materialized a different manifest (${observed}/${params.transfer.manifestRef})`);
		await replaceWorkspace(params.workspaceDir, staging);
		transferLog.debug("node worker workspace transfer completed", {
			environmentId: params.environmentId,
			direction: "download",
			outcome: "succeeded",
			durationMs: performance.now() - startedAt,
			...packDownloadMs === void 0 ? {} : { packDownloadMs },
			blobApplyMs
		});
		return observed;
	} finally {
		await stagingWorkspace.cleanup();
	}
}
async function writeChunk(request, chunk) {
	if (request.write(chunk)) return;
	await once(request, "drain");
}
async function uploadFile(request, filePath) {
	for await (const value of fs.createReadStream(filePath)) await writeChunk(request, Buffer.isBuffer(value) ? value : Buffer.from(value));
}
async function uploadWorkspace(params) {
	const baseRaw = await fs$1.readFile(path.join(params.manifestHome, ".openclaw-worker", "manifests", `${params.transfer.baseManifestRef.slice(7)}.json`), "utf8");
	const base = parseWorkerWorkspaceManifest(baseRaw, params.transfer.baseManifestRef);
	const currentRef = await captureManifest({
		workspaceDir: params.workspaceDir,
		manifestHome: params.manifestHome,
		baseCommit: base.baseCommit,
		signal: params.signal
	});
	const currentRaw = await fs$1.readFile(path.join(params.manifestHome, ".openclaw-worker", "manifests", `${currentRef.slice(7)}.json`), "utf8");
	const current = parseWorkerWorkspaceManifest(currentRaw, currentRef);
	const changed = new Set(workerWorkspaceTransferPaths(current, base));
	const files = current.entries.filter((entry) => entry.type === "file" && changed.has(entry.path));
	const manifestBytes = Buffer.from(currentRaw);
	const baseBytes = Buffer.from(baseRaw);
	const contentLength = 8 + baseBytes.byteLength + manifestBytes.byteLength + files.reduce((total, entry) => total + 8 + entry.size, 0);
	const response = await openRequest({
		gatewayUrl: params.gatewayUrl,
		tlsFingerprint: params.tlsFingerprint,
		routePath: nodeWorkspaceTransferReconcilePath(params.environmentId, params.transfer.baseManifestRef),
		method: "POST",
		token: params.transfer.token,
		headers: {
			"content-type": "application/vnd.openclaw.worker-workspace-reconcile-v1",
			"content-length": String(contentLength)
		},
		signal: params.signal,
		writeBody: async (request) => {
			for (const value of [baseBytes, manifestBytes]) {
				const header = Buffer.allocUnsafe(4);
				header.writeUInt32BE(value.byteLength);
				await writeChunk(request, header);
				await writeChunk(request, value);
			}
			for (const entry of files) {
				const size = Buffer.allocUnsafe(8);
				size.writeBigUInt64BE(BigInt(entry.size));
				await writeChunk(request, size);
				await uploadFile(request, workspacePath(params.workspaceDir, entry.path));
			}
		}
	});
	await requireOk(response);
	if (JSON.parse((await readResponseBody(response, TRANSFER_RESULT_MAX_BYTES)).toString("utf8")).manifestRef !== currentRef) throw new Error("workspace transfer upload acknowledgement is invalid");
	return currentRef;
}
async function runNodeWorkerWorkspaceTransfer(params) {
	try {
		await recoverWorkspaceReplacement(params.workspaceDir);
		return params.transfer.direction === "download" ? await downloadWorkspace({
			...params,
			tlsFingerprint: params.gatewayTlsFingerprint,
			transfer: params.transfer
		}) : await uploadWorkspace({
			...params,
			tlsFingerprint: params.gatewayTlsFingerprint,
			transfer: params.transfer
		});
	} catch (error) {
		if (error instanceof NodeWorkerWorkspaceTransferError) throw error;
		throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: transfer did not complete", { cause: error });
	}
}
//#endregion
//#region src/node-host/node-worker-workspace.ts
const DEFAULT_TIMEOUT_MS = 12e4;
const WORKSPACE_RETENTION_DELETE_LIMIT = 256;
const ENVIRONMENT_HASH_PATTERN = /^[a-f0-9]{16}$/u;
const SESSION_HASH_PATTERN = /^[a-f0-9]{32}$/u;
const MANIFEST_FILE_PATTERN = /^[a-f0-9]{64}\.json$/u;
function hashPathComponent(value, length) {
	return createHash("sha256").update(value).digest("hex").slice(0, length);
}
function workspaceGenerationKey(params) {
	return [
		params.gatewayNamespace,
		params.environmentHash,
		params.sessionHash,
		params.generation
	].join("/");
}
function launchGenerationKey(reference) {
	return workspaceGenerationKey({
		gatewayNamespace: reference.gatewayNamespace,
		environmentHash: hashPathComponent(reference.environmentId, 16),
		sessionHash: hashPathComponent(reference.sessionId, 32),
		generation: reference.ownerEpoch
	});
}
function workspaceSessionKey(environmentHash, sessionHash) {
	return `${environmentHash}/${sessionHash}`;
}
function parseGenerationName(name) {
	const generation = Number(name);
	return Number.isSafeInteger(generation) && generation >= 0 && String(generation) === name ? generation : void 0;
}
function parseTransferArtifactGeneration(name) {
	const staging = /^\.([0-9]+)\.workspace-transfer-.+$/u.exec(name);
	if (staging) return parseGenerationName(staging[1]);
	const backup = /^([0-9]+)\.previous-.+$/u.exec(name);
	return backup ? parseGenerationName(backup[1]) : void 0;
}
async function listOwnedEntries(parent) {
	try {
		return (await fs$1.readdir(parent, { withFileTypes: true })).toSorted((left, right) => left.name.localeCompare(right.name));
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}
async function listOwnedDirectories(parent) {
	return (await listOwnedEntries(parent)).filter((entry) => entry.isDirectory() && !entry.isSymbolicLink()).map((entry) => entry.name);
}
async function removeOwnedDirectory(root, target, canDelete = () => true) {
	try {
		const [stats, parent, resolved] = await Promise.all([
			fs$1.lstat(target),
			fs$1.realpath(path.dirname(target)),
			fs$1.realpath(target)
		]);
		if (stats.isSymbolicLink() || !stats.isDirectory() || path.dirname(resolved) !== parent || !isPathInside(root, resolved)) return false;
		if (!canDelete()) return false;
		await fs$1.rm(target, {
			recursive: true,
			force: true
		});
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
async function removeOwnedFile(root, target, canDelete = () => true) {
	try {
		const [stats, parent, resolved] = await Promise.all([
			fs$1.lstat(target),
			fs$1.realpath(path.dirname(target)),
			fs$1.realpath(target)
		]);
		if (stats.isSymbolicLink() || !stats.isFile() || path.dirname(resolved) !== parent || !isPathInside(root, resolved)) return false;
		if (!canDelete()) return false;
		await fs$1.rm(target, { force: true });
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
async function removeIfEmpty(target) {
	try {
		await fs$1.rmdir(target);
	} catch (error) {
		const code = error.code;
		if (code !== "ENOENT" && code !== "ENOTEMPTY" && code !== "EEXIST") throw error;
	}
}
function ensureContainedDirectory(parent, name) {
	const candidate = path.join(parent, name);
	fs.mkdirSync(candidate, { recursive: true });
	const stats = fs.lstatSync(candidate);
	const resolved = fs.realpathSync.native(candidate);
	if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(parent, resolved)) throw new Error("INVALID_REQUEST: node worker workspace path escaped its owner root");
	return resolved;
}
function resolveArgumentPath(workspaceDir, arg) {
	if (path.isAbsolute(arg)) return arg;
	if (arg.startsWith(".") || arg.includes("/") || path.sep === "\\" && arg.includes("\\")) return path.resolve(workspaceDir, arg);
}
function assertWorkspaceArgv(workspaceDir, argv) {
	for (const [index, arg] of argv.entries()) {
		if (index > 0 && argv[index - 1] === "-e" && path.basename(argv[0] ?? "") === "node") continue;
		const candidate = resolveArgumentPath(workspaceDir, arg);
		if (!candidate) continue;
		let resolved = candidate;
		try {
			resolved = fs.realpathSync.native(candidate);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
		if (resolved !== workspaceDir && !isPathInside(workspaceDir, resolved)) throw new Error("INVALID_REQUEST: workspace command argv resolves outside its workspace");
	}
}
function projectWorkspaceResult(workspaceDir, result) {
	const parsed = parseNodeWorkerWorkspaceExecResult({
		workspaceDir,
		stdout: result.stdout,
		stderr: result.stderr,
		code: result.code,
		signal: result.signal,
		killed: result.killed,
		termination: result.termination,
		...result.stdoutTruncatedBytes === void 0 ? {} : { stdoutTruncatedBytes: result.stdoutTruncatedBytes },
		...result.stderrTruncatedBytes === void 0 ? {} : { stderrTruncatedBytes: result.stderrTruncatedBytes },
		...result.noOutputTimedOut === void 0 ? {} : { noOutputTimedOut: result.noOutputTimedOut },
		...result.outputLimitExceeded === void 0 ? {} : { outputLimitExceeded: result.outputLimitExceeded },
		...result.outputErrorStream === void 0 ? {} : { outputErrorStream: result.outputErrorStream }
	});
	if (!parsed) throw new Error("node worker workspace result violated its bounded contract");
	return parsed;
}
function buildAcceptedSnapshot(input) {
	const retainedGenerations = /* @__PURE__ */ new Set();
	const manifestsBySession = /* @__PURE__ */ new Map();
	for (const entry of input.retain) {
		const environmentHash = hashPathComponent(entry.environmentId, 16);
		const sessionHash = hashPathComponent(entry.sessionId, 32);
		retainedGenerations.add(workspaceGenerationKey({
			gatewayNamespace: input.gatewayNamespace,
			environmentHash,
			sessionHash,
			generation: entry.generation
		}));
		const sessionKey = workspaceSessionKey(environmentHash, sessionHash);
		const current = manifestsBySession.get(sessionKey);
		if (current === null || entry.manifestRefs === null) {
			manifestsBySession.set(sessionKey, null);
			continue;
		}
		const refs = current ?? /* @__PURE__ */ new Set();
		for (const manifestRef of entry.manifestRefs) refs.add(manifestRef);
		manifestsBySession.set(sessionKey, refs);
	}
	return {
		controllerId: input.controllerId,
		sequence: input.sequence,
		signature: JSON.stringify(input.retain),
		retainedGenerations,
		manifestsBySession
	};
}
/** Runs trusted worker transport commands only from a node-owned session workspace. */
var NodeWorkerWorkspaceRuntime = class {
	constructor(options = {}) {
		this.retainQueue = new KeyedAsyncQueue();
		this.acceptedSnapshots = /* @__PURE__ */ new Map();
		this.activeWorkspaceOperations = /* @__PURE__ */ new Map();
		this.activeRetainProtections = /* @__PURE__ */ new Map();
		const env = options.env ?? process.env;
		const configuredRoot = path.resolve(options.root ?? path.join(resolveStateDir(env), "node-host"));
		fs.mkdirSync(configuredRoot, { recursive: true });
		this.root = fs.realpathSync.native(configuredRoot);
		this.env = {
			...snapshotNodeWorkerEnv(env),
			GCM_INTERACTIVE: "Never",
			GIT_ASKPASS: "",
			GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
			GIT_CONFIG_NOSYSTEM: "1",
			GIT_TERMINAL_PROMPT: "0",
			SSH_ASKPASS: ""
		};
	}
	beginWorkspaceOperation(gatewayNamespace, generationKey) {
		this.activeWorkspaceOperations.set(generationKey, (this.activeWorkspaceOperations.get(generationKey) ?? 0) + 1);
		for (const protection of this.activeRetainProtections.get(gatewayNamespace) ?? []) protection.add(generationKey);
		return () => {
			const count = this.activeWorkspaceOperations.get(generationKey) ?? 0;
			if (count <= 1) this.activeWorkspaceOperations.delete(generationKey);
			else this.activeWorkspaceOperations.set(generationKey, count - 1);
		};
	}
	currentLocalProtection(gatewayNamespace, retainedDuringPass, listNonterminal) {
		const protectedGenerations = new Set(retainedDuringPass);
		for (const generationKey of this.activeWorkspaceOperations.keys()) if (generationKey.startsWith(`${gatewayNamespace}/`)) protectedGenerations.add(generationKey);
		for (const launch of listNonterminal()) if (launch.gatewayNamespace === gatewayNamespace) protectedGenerations.add(launchGenerationKey(launch));
		return protectedGenerations;
	}
	async listWorkspaceSessions(gatewayNamespace) {
		const gatewayRoot = path.join(this.root, gatewayNamespace);
		const workspacesRoot = path.join(gatewayRoot, "workspaces");
		const sessions = [];
		for (const environmentHash of await listOwnedDirectories(workspacesRoot)) {
			if (!ENVIRONMENT_HASH_PATTERN.test(environmentHash)) continue;
			const environmentRoot = path.join(workspacesRoot, environmentHash);
			for (const sessionHash of await listOwnedDirectories(environmentRoot)) {
				if (!SESSION_HASH_PATTERN.test(sessionHash)) continue;
				sessions.push({
					gatewayNamespace,
					environmentHash,
					sessionHash,
					workspacesRoot,
					environmentRoot,
					sessionRoot: path.join(environmentRoot, sessionHash)
				});
			}
		}
		return sessions;
	}
	async applyRetainSnapshot(input, listNonterminal, signal) {
		return await this.retainQueue.enqueue(input.gatewayNamespace, async () => {
			signal?.throwIfAborted();
			const next = buildAcceptedSnapshot(input);
			const current = this.acceptedSnapshots.get(input.gatewayNamespace);
			if (current?.controllerId === next.controllerId) {
				if (next.sequence < current.sequence) return {
					applied: false,
					deleted: 0,
					hasMore: false
				};
				if (next.sequence === current.sequence && next.signature !== current.signature) throw new Error("INVALID_REQUEST: workspace retain sequence changed contents");
			}
			this.acceptedSnapshots.set(input.gatewayNamespace, next);
			const retainedDuringPass = /* @__PURE__ */ new Set();
			for (const generationKey of this.activeWorkspaceOperations.keys()) if (generationKey.startsWith(`${input.gatewayNamespace}/`)) retainedDuringPass.add(generationKey);
			const protections = this.activeRetainProtections.get(input.gatewayNamespace) ?? /* @__PURE__ */ new Set();
			protections.add(retainedDuringPass);
			this.activeRetainProtections.set(input.gatewayNamespace, protections);
			try {
				return {
					applied: true,
					...await this.collectRetainedWorkspaceSnapshot({
						gatewayNamespace: input.gatewayNamespace,
						snapshot: next,
						retainedDuringPass,
						listNonterminal,
						signal
					})
				};
			} finally {
				protections.delete(retainedDuringPass);
				if (protections.size === 0) this.activeRetainProtections.delete(input.gatewayNamespace);
			}
		});
	}
	async collectRetainedWorkspaceSnapshot(params) {
		let deleted = 0;
		let hasMore = false;
		for (const session of await this.listWorkspaceSessions(params.gatewayNamespace)) {
			params.signal?.throwIfAborted();
			await serializeNodeWorkerWorkspace(session.sessionRoot, async () => {
				const currentSnapshot = this.acceptedSnapshots.get(params.gatewayNamespace);
				if (currentSnapshot?.controllerId !== params.snapshot.controllerId || currentSnapshot.sequence !== params.snapshot.sequence || currentSnapshot.signature !== params.snapshot.signature) return;
				const localProtection = this.currentLocalProtection(params.gatewayNamespace, params.retainedDuringPass, params.listNonterminal);
				const entries = await listOwnedEntries(session.sessionRoot);
				const existingGenerations = /* @__PURE__ */ new Set();
				for (const entry of entries) {
					const generation = parseGenerationName(entry.name);
					if (generation !== void 0 && entry.isDirectory() && !entry.isSymbolicLink()) existingGenerations.add(generation);
				}
				const candidates = [];
				for (const entry of entries) {
					if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
					const generation = parseGenerationName(entry.name);
					const artifactGeneration = parseTransferArtifactGeneration(entry.name);
					if (generation !== void 0) {
						const key = workspaceGenerationKey({
							...session,
							generation
						});
						if (!currentSnapshot.retainedGenerations.has(key) && !localProtection.has(key)) candidates.push({
							path: path.join(session.sessionRoot, entry.name),
							generationKey: key
						});
						continue;
					}
					if (artifactGeneration === void 0) continue;
					const key = workspaceGenerationKey({
						...session,
						generation: artifactGeneration
					});
					const retainedTargetMissing = currentSnapshot.retainedGenerations.has(key) && !existingGenerations.has(artifactGeneration);
					if (!localProtection.has(key) && !retainedTargetMissing) candidates.push({
						path: path.join(session.sessionRoot, entry.name),
						generationKey: key
					});
				}
				for (const candidate of candidates) {
					if (deleted >= WORKSPACE_RETENTION_DELETE_LIMIT) {
						hasMore = true;
						return;
					}
					if (this.currentLocalProtection(params.gatewayNamespace, params.retainedDuringPass, params.listNonterminal).has(candidate.generationKey)) continue;
					if (await removeOwnedDirectory(this.root, candidate.path, () => !this.currentLocalProtection(params.gatewayNamespace, params.retainedDuringPass, params.listNonterminal).has(candidate.generationKey))) deleted += 1;
				}
				const sessionPrefix = `${params.gatewayNamespace}/${session.environmentHash}/${session.sessionHash}/`;
				const hasCurrentLocalProtection = () => [...this.currentLocalProtection(params.gatewayNamespace, params.retainedDuringPass, params.listNonterminal)].some((key) => key.startsWith(sessionPrefix));
				const hasLocalProtection = hasCurrentLocalProtection();
				const retainedManifestRefs = currentSnapshot.manifestsBySession.get(workspaceSessionKey(session.environmentHash, session.sessionHash));
				if (!hasLocalProtection && retainedManifestRefs !== null) {
					const manifestRoot = path.join(session.sessionRoot, ".openclaw-worker", "manifests");
					for (const entry of await listOwnedEntries(manifestRoot)) {
						if (!entry.isFile() || entry.isSymbolicLink() || !MANIFEST_FILE_PATTERN.test(entry.name) || retainedManifestRefs?.has(`sha256:${entry.name.slice(0, -5)}`)) continue;
						if (deleted >= WORKSPACE_RETENTION_DELETE_LIMIT) {
							hasMore = true;
							return;
						}
						if (await removeOwnedFile(this.root, path.join(manifestRoot, entry.name), () => !hasCurrentLocalProtection())) deleted += 1;
					}
					await removeIfEmpty(manifestRoot);
					await removeIfEmpty(path.dirname(manifestRoot));
				}
				const hasGenerationOrArtifact = (await listOwnedEntries(session.sessionRoot)).some((entry) => entry.isDirectory() && !entry.isSymbolicLink() && (parseGenerationName(entry.name) !== void 0 || parseTransferArtifactGeneration(entry.name) !== void 0));
				const hasAuthoritativeRetain = [...currentSnapshot.retainedGenerations].some((key) => key.startsWith(sessionPrefix));
				if (!hasGenerationOrArtifact && !hasAuthoritativeRetain && !hasCurrentLocalProtection()) {
					const metadataRoot = path.join(session.sessionRoot, ".openclaw-worker");
					if (deleted >= WORKSPACE_RETENTION_DELETE_LIMIT) {
						hasMore = true;
						return;
					}
					if (await removeOwnedDirectory(this.root, metadataRoot, () => !hasCurrentLocalProtection())) deleted += 1;
					await removeIfEmpty(session.sessionRoot);
					await removeIfEmpty(session.environmentRoot);
					await removeIfEmpty(session.workspacesRoot);
				}
			});
			if (hasMore) break;
		}
		return {
			deleted,
			hasMore
		};
	}
	async exec(input, signal, gateway) {
		const environmentHash = hashPathComponent(input.environmentId, 16);
		const sessionHash = hashPathComponent(input.sessionId, 32);
		const sessionRootCandidate = path.join(this.root, input.gatewayNamespace, "workspaces", environmentHash, sessionHash);
		const generationKey = workspaceGenerationKey({
			gatewayNamespace: input.gatewayNamespace,
			environmentHash,
			sessionHash,
			generation: input.generation
		});
		const finishOperation = this.beginWorkspaceOperation(input.gatewayNamespace, generationKey);
		try {
			return await serializeNodeWorkerWorkspace(sessionRootCandidate, async () => {
				const sessionRoot = ensureContainedDirectory(ensureContainedDirectory(ensureContainedDirectory(ensureContainedDirectory(this.root, input.gatewayNamespace), "workspaces"), environmentHash), sessionHash);
				const workspaceName = String(input.generation);
				const workspacePath = path.join(sessionRoot, workspaceName);
				if (input.transfer) {
					if (input.resetWorkspace) throw new Error("INVALID_REQUEST: workspace transfer owns its atomic replacement");
					if (!gateway?.url) throw new Error("INVALID_REQUEST: workspace transfer gateway is unavailable");
					try {
						const stats = fs.lstatSync(workspacePath);
						const resolved = fs.realpathSync.native(workspacePath);
						if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(sessionRoot, resolved)) throw new Error("INVALID_REQUEST: node worker workspace path escaped its owner root");
					} catch (error) {
						if (error.code !== "ENOENT") throw error;
					}
					return projectWorkspaceResult(workspacePath, {
						stdout: `${await runNodeWorkerWorkspaceTransfer({
							gatewayUrl: gateway.url,
							gatewayTlsFingerprint: gateway.tlsFingerprint,
							environmentId: input.environmentId,
							workspaceDir: workspacePath,
							manifestHome: sessionRoot,
							transfer: input.transfer,
							signal
						})}\n`,
						stderr: "",
						code: 0,
						signal: null,
						killed: false,
						termination: "exit"
					});
				}
				if (input.resetWorkspace) {
					try {
						const stats = fs.lstatSync(workspacePath);
						const resolved = fs.realpathSync.native(workspacePath);
						if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(sessionRoot, resolved)) throw new Error("INVALID_REQUEST: node worker workspace path escaped its owner root");
					} catch (error) {
						if (error.code !== "ENOENT") throw error;
					}
					fs.rmSync(workspacePath, {
						recursive: true,
						force: true
					});
				}
				const workspaceDir = ensureContainedDirectory(sessionRoot, workspaceName);
				assertWorkspaceArgv(workspaceDir, input.argv);
				const commandEnv = {
					...this.env,
					HOME: sessionRoot,
					...process.platform === "win32" ? { USERPROFILE: sessionRoot } : {}
				};
				return projectWorkspaceResult(workspaceDir, await runCommandWithTimeout(input.argv, {
					cwd: workspaceDir,
					baseEnv: commandEnv,
					...input.input === void 0 ? {} : { input: input.input },
					timeoutMs: input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
					...signal ? { signal } : {},
					killProcessTree: true,
					maxOutputBytes: {
						stdout: NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES,
						stderr: NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES
					},
					terminateOnOutputLimit: true
				}));
			});
		} finally {
			finishOperation();
		}
	}
};
//#endregion
//#region src/node-host/node-worker-supervisor.ts
const STOP_GRACE_MS = 1e3;
const FORCE_STOP_WAIT_MS = 4e3;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
function sameProcessIdentity(left, right) {
	return left?.pid === right?.pid && left?.startTime === right?.startTime && left !== null === (right !== null);
}
function receiptMatchesOwner(receipt, supervisor, worker) {
	return sameProcessIdentity(receipt.supervisor, supervisor) && sameProcessIdentity(receipt.worker, worker);
}
/** Owns worker process groups, lifetime gates, and the durable node-host launch journal. */
var NodeWorkerSupervisor = class {
	constructor(options = {}) {
		this.active = /* @__PURE__ */ new Map();
		this.starting = /* @__PURE__ */ new Map();
		this.closed = false;
		const env = options.env ?? process.env;
		this.bundleRoot = path.resolve(options.bundleRoot ?? path.join(resolveStateDir(env), "node-host"));
		this.store = new NodeWorkerLaunchStore({ env });
		this.workerEnv = snapshotNodeWorkerEnv(env);
		this.localInstallation = options.localInstallation;
		this.workspace = options.workspace ?? new NodeWorkerWorkspaceRuntime({
			root: this.bundleRoot,
			env: this.workerEnv
		});
		this.capacity = new NodeWorkerCapacity(this.store, options);
	}
	requireSupervisorIdentity() {
		return this.supervisorIdentity ??= requireNodeWorkerProcessIdentity(process.pid);
	}
	initialize() {
		return this.initializationPromise ??= this.capacity.initialize(async (receipt) => {
			await this.recoverRunning(receipt, false);
		});
	}
	async launch(input, connectionEndpoint, signal) {
		if (!GATEWAY_NAMESPACE_PATTERN.test(input.gatewayNamespace)) throw new Error("gateway namespace must be a safe bounded path component");
		if (!BUNDLE_HASH_PATTERN.test(input.expectedBundleHash)) throw new Error("node worker bundle hash must be 64 lowercase hexadecimal characters");
		if (!Number.isSafeInteger(input.placementGeneration) || input.placementGeneration < 0) throw new Error("node worker placement generation must be a non-negative safe integer");
		const descriptor = completeWorkerLaunchDescriptor(parseWorkerLaunchPlan(structuredClone(input.descriptor)), connectionEndpoint);
		if (descriptor.admission.handshake.bundleHash !== input.expectedBundleHash) throw new Error("node worker descriptor bundle hash does not match the launch bundle");
		const planHash = nodeWorkerPlanHash(input);
		if (this.closed) throw new Error("node worker supervisor is closed");
		await this.initialize();
		const local = this.active.get(input.launchId);
		if (local) {
			if (local.planHash !== planHash) throw new Error(`node worker launch ${input.launchId} was replayed with a different plan`);
			if (local.state === "observed") return this.reconcileActiveTerminal(local);
			const receipt = this.store.get(input.launchId);
			if (receipt) return receipt;
		}
		const supervisor = this.requireSupervisorIdentity();
		const claimInput = {
			launchId: input.launchId,
			planHash,
			gatewayNamespace: input.gatewayNamespace,
			environmentId: descriptor.admission.environmentId,
			sessionId: descriptor.admission.sessionId,
			ownerEpoch: descriptor.admission.ownerEpoch,
			placementGeneration: input.placementGeneration,
			runId: descriptor.assignment.runId
		};
		if (this.closed) throw new Error("node worker supervisor is closed");
		const claim = await this.capacity.claim(claimInput, supervisor, signal);
		if (claim.action === "recover") return await this.recoverRunning(claim.receipt);
		if (claim.action === "replay") {
			const replay = this.active.get(input.launchId);
			if (replay?.planHash === planHash && replay.state === "observed") return this.reconcileActiveTerminal(replay);
			const startup = this.starting.get(input.launchId);
			return startup && claim.receipt.state === "pending" ? await startup : claim.receipt;
		}
		const startup = this.startClaimed({
			input,
			descriptor,
			planHash,
			supervisor
		});
		this.starting.set(input.launchId, startup);
		try {
			return await startup;
		} finally {
			if (this.starting.get(input.launchId) === startup) this.starting.delete(input.launchId);
		}
	}
	async status(launchId) {
		await this.initialize();
		const active = this.active.get(launchId);
		if (active?.state === "observed") return this.reconcileActiveTerminal(active);
		if (active?.state === "running") {
			const workerState = inspectNodeWorkerProcessIdentity(active.worker);
			if (workerState === "dead" || workerState === "reused") {
				let treeState = inspectOwnedNodeWorkerTree(active.worker);
				if (treeState === "live") {
					await signalOwnedNodeWorkerTree(active.worker, "SIGTERM");
					treeState = await waitForOwnedNodeWorkerTreeDeath(active.worker, STOP_GRACE_MS);
				}
				if (treeState === "live") {
					await signalOwnedNodeWorkerTree(active.worker, "SIGKILL");
					await waitForOwnedNodeWorkerTreeDeath(active.worker, FORCE_STOP_WAIT_MS);
				}
				await active.done;
				const observed = this.active.get(launchId);
				if (observed?.state === "observed") return this.reconcileActiveTerminal(observed);
			}
			return this.store.get(launchId);
		}
		const receipt = this.store.get(launchId);
		return receipt?.state === "running" ? await this.recoverRunning(receipt) : receipt;
	}
	async retainWorkspaces(input, signal) {
		await this.initialize();
		return await this.workspace.applyRetainSnapshot(input, () => this.store.listNonterminal(), signal);
	}
	async cancel(expected) {
		await this.initialize();
		const receipt = this.store.getMatching(expected);
		if (!receipt || receipt.state === "completed" || receipt.state === "failed") return receipt;
		if (receipt.state === "interrupted" || receipt.state === "cancelled") return receipt;
		const active = this.active.get(expected.launchId);
		if (active) {
			if (active.planHash !== expected.planHash || !receiptMatchesOwner(receipt, active.supervisor, active.worker)) return receipt;
			if (active.state === "running") await this.stopChild(active, "cancelled");
			const observed = this.active.get(expected.launchId);
			if (observed?.state === "observed") return this.reconcileActiveTerminal(observed);
			return this.store.getMatching(expected);
		}
		const startup = this.starting.get(expected.launchId);
		if (startup && receipt.state === "pending" && receipt.supervisor.pid === process.pid) {
			const cancelled = this.capacity.finishCancelled({
				expected,
				supervisor: receipt.supervisor,
				worker: null
			});
			await startup;
			return this.store.getMatching(expected) ?? cancelled;
		}
		const supervisorState = inspectNodeWorkerProcessIdentity(receipt.supervisor);
		if (supervisorState === "live" || supervisorState === "unknown") return receipt;
		if (!receipt.worker) return this.capacity.finishCancelled({
			expected,
			supervisor: receipt.supervisor,
			worker: null
		});
		let workerState = inspectOwnedNodeWorkerTree(receipt.worker);
		if (workerState === "unknown") return receipt;
		if (workerState === "live") {
			const beforeSignal = this.store.getMatching(expected);
			if (beforeSignal?.state !== "running" || !receiptMatchesOwner(beforeSignal, receipt.supervisor, receipt.worker)) return beforeSignal;
			await signalOwnedNodeWorkerTree(receipt.worker, "SIGTERM");
			workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, STOP_GRACE_MS);
		}
		if (workerState === "live") {
			const beforeSignal = this.store.getMatching(expected);
			if (beforeSignal?.state !== "running" || !receiptMatchesOwner(beforeSignal, receipt.supervisor, receipt.worker)) return beforeSignal;
			await signalOwnedNodeWorkerTree(receipt.worker, "SIGKILL");
			workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, FORCE_STOP_WAIT_MS);
		}
		if (workerState !== "dead") return this.store.getMatching(expected);
		return this.capacity.finishCancelled({
			expected,
			supervisor: receipt.supervisor,
			worker: receipt.worker
		});
	}
	close() {
		if (this.closePromise) return this.closePromise;
		this.closed = true;
		this.capacity.close();
		const closePromise = (async () => {
			const errors = [];
			if (this.initializationPromise) try {
				await this.initializationPromise;
			} catch (error) {
				errors.push(error);
			}
			await Promise.allSettled(this.starting.values());
			await Promise.all([...this.active.values()].filter((active) => active.state === "running").map(async (active) => await this.stopChild(active, "interrupted")));
			for (const active of this.active.values()) {
				if (active.state !== "observed") continue;
				try {
					this.reconcileActiveTerminal(active);
				} catch (error) {
					errors.push(error);
				}
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "node worker terminal reconciliation failed");
		})().finally(() => {
			if (this.closePromise === closePromise) this.closePromise = void 0;
		});
		this.closePromise = closePromise;
		return closePromise;
	}
	reconcileActiveTerminal(active) {
		try {
			const receipt = this.capacity.finish({
				launchId: active.launchId,
				planHash: active.planHash,
				supervisor: active.supervisor,
				worker: active.worker,
				...active.outcome
			});
			if (receipt.state === "pending" || receipt.state === "running") throw new Error(`node worker launch ${active.launchId} terminal state was not persisted`);
			if (this.active.get(active.launchId) === active) this.active.delete(active.launchId);
			return receipt;
		} catch (error) {
			active.persistenceError = error;
			throw error;
		}
	}
	async recoverRunning(receipt, notifyCapacity = true) {
		if (receipt.state !== "running" || !receipt.worker) return receipt;
		const previousSupervisor = inspectNodeWorkerProcessIdentity(receipt.supervisor);
		if (previousSupervisor !== "dead" && previousSupervisor !== "reused") return this.store.get(receipt.launchId) ?? receipt;
		let workerState = inspectOwnedNodeWorkerTree(receipt.worker);
		if (workerState === "unknown") return this.store.get(receipt.launchId) ?? receipt;
		if (workerState === "live") {
			await signalOwnedNodeWorkerTree(receipt.worker, "SIGTERM");
			workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, STOP_GRACE_MS);
		}
		if (workerState === "live") {
			await signalOwnedNodeWorkerTree(receipt.worker, "SIGKILL");
			workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, FORCE_STOP_WAIT_MS);
		}
		if (workerState !== "dead") return this.store.get(receipt.launchId) ?? receipt;
		return this.capacity.finish({
			launchId: receipt.launchId,
			planHash: receipt.planHash,
			supervisor: receipt.supervisor,
			worker: receipt.worker,
			state: "interrupted",
			errorText: "node host stopped before the worker launch completed"
		}, notifyCapacity);
	}
	async startClaimed(params) {
		const credential = params.descriptor.admission.credential;
		const scrubber = createNodeWorkerCredentialScrubber(credential);
		const connectionFailure = {};
		registerSecretValueForRedaction(credential);
		let adapter;
		try {
			const entry = await resolveNodeWorkerEntry({
				bundleRoot: this.bundleRoot,
				installKind: params.input.installKind,
				expectedBundleHash: params.input.expectedBundleHash,
				gatewayNamespace: params.input.gatewayNamespace,
				...this.localInstallation ? { localInstallation: this.localInstallation } : {}
			});
			adapter = await createChildAdapter({
				argv: [
					process.execPath,
					entry,
					"worker",
					"--internal-worker-ipc"
				],
				env: this.workerEnv,
				exactEnv: true,
				ownedWorker: true,
				onWorkerMessage: (message) => {
					const diagnostic = parseNodeWorkerConnectionFailureMessage(message);
					if (!diagnostic) return;
					connectionFailure.errorText = diagnostic.cause ? formatWorkerConnectionFailure(params.descriptor.connectionEndpoint, sanitizeNodeWorkerDiagnostic(diagnostic.cause, "node worker gateway connection failed", scrubber.scrub)) : void 0;
				},
				input: JSON.stringify(params.descriptor)
			});
		} catch (error) {
			return this.capacity.finish({
				launchId: params.input.launchId,
				planHash: params.planHash,
				supervisor: params.supervisor,
				worker: null,
				state: "failed",
				errorText: sanitizeNodeWorkerDiagnostic(error, "node worker spawn failed", scrubber.scrub)
			});
		}
		if (!adapter.pid) {
			adapter.kill("SIGKILL");
			adapter.dispose();
			return this.capacity.finish({
				launchId: params.input.launchId,
				planHash: params.planHash,
				supervisor: params.supervisor,
				worker: null,
				state: "failed",
				errorText: "node worker spawn did not return a process id"
			});
		}
		let worker;
		try {
			worker = requireNodeWorkerProcessIdentity(adapter.pid);
		} catch (error) {
			adapter.kill("SIGKILL");
			await adapter.wait().catch(() => void 0);
			adapter.dispose();
			return this.capacity.finish({
				launchId: params.input.launchId,
				planHash: params.planHash,
				supervisor: params.supervisor,
				worker: null,
				state: "failed",
				errorText: sanitizeNodeWorkerDiagnostic(error, "node worker process identity unavailable", scrubber.scrub)
			});
		}
		let journalReleased = false;
		let releaseJournalPromise;
		const journalReady = new Promise((resolve) => {
			releaseJournalPromise = resolve;
		});
		const releaseJournal = () => {
			if (!journalReleased) {
				journalReleased = true;
				releaseJournalPromise();
			}
		};
		const active = {
			state: "running",
			adapter,
			journalReady,
			launchId: params.input.launchId,
			planHash: params.planHash,
			releaseJournal,
			scrubber,
			connectionFailure,
			supervisor: params.supervisor,
			worker
		};
		active.done = this.observeChild(active);
		this.active.set(active.launchId, active);
		active.done.catch(() => void 0);
		let running;
		try {
			running = this.store.markRunning({
				launchId: active.launchId,
				planHash: active.planHash,
				supervisor: params.supervisor,
				worker
			});
		} catch (error) {
			active.releaseJournal();
			await this.stopChild(active, "interrupted").catch(() => void 0);
			throw error;
		}
		active.releaseJournal();
		if (running.state === "cancelled" || running.state === "interrupted") {
			await this.stopChild(active, running.state);
			return this.store.get(active.launchId) ?? running;
		}
		if (running.state !== "running") {
			adapter.closeStartGate?.();
			return running;
		}
		if (this.closed) {
			await this.stopChild(active, "interrupted");
			return this.store.get(active.launchId) ?? running;
		}
		try {
			await adapter.openStartGate?.();
		} catch {
			await this.stopChild(active, "interrupted");
			return this.store.get(active.launchId) ?? running;
		}
		return running;
	}
	async observeChild(active) {
		const stdout = createCapturedOutputBuffers();
		const stderr = createCapturedOutputBuffers();
		active.adapter.onStdout((chunk) => appendCapturedOutput(stdout, chunk, NODE_WORKER_STDOUT_MAX_BYTES, "head"));
		active.adapter.onStderr((chunk) => appendCapturedOutput(stderr, chunk, NODE_WORKER_STDERR_MAX_BYTES + active.scrubber.maxRepresentationBytes, "tail"));
		let outcome;
		try {
			const exit = await active.adapter.wait();
			await active.journalReady;
			if (active.stopState) outcome = Object.freeze({
				state: active.stopState,
				errorText: active.connectionFailure.errorText ?? (active.stopState === "cancelled" ? "node worker launch cancelled" : "node worker launch interrupted during node-host shutdown")
			});
			else if (exit.code === 0 && exit.signal === null) try {
				outcome = Object.freeze({
					state: "completed",
					resultJson: parseNodeWorkerSuccessfulResult(stdout, active.scrubber.scrub)
				});
			} catch (error) {
				outcome = Object.freeze({
					state: "failed",
					errorText: sanitizeNodeWorkerDiagnostic(error, "invalid worker result", active.scrubber.scrub)
				});
			}
			else {
				const detail = finalizeCapturedOutput(stderr, "tail", true).toString("utf8");
				const exitLabel = exit.signal ? `signal ${exit.signal}` : `exit code ${String(exit.code)}`;
				outcome = Object.freeze({
					state: "failed",
					errorText: active.connectionFailure.errorText ?? sanitizeNodeWorkerDiagnostic(`node worker failed with ${exitLabel}${detail ? `: ${detail}` : ""}`, "node worker failed", active.scrubber.scrub)
				});
			}
		} catch (error) {
			await active.journalReady;
			outcome = Object.freeze({
				state: active.stopState ?? "failed",
				errorText: active.connectionFailure.errorText ?? sanitizeNodeWorkerDiagnostic(error, "node worker wait failed", active.scrubber.scrub)
			});
		} finally {
			active.adapter.dispose();
		}
		const observed = {
			state: "observed",
			launchId: active.launchId,
			planHash: active.planHash,
			supervisor: active.supervisor,
			worker: active.worker,
			outcome
		};
		if (this.active.get(active.launchId) !== active) return;
		this.active.set(active.launchId, observed);
		try {
			this.reconcileActiveTerminal(observed);
		} catch {}
	}
	async stopChild(active, state) {
		active.stopState ??= state;
		active.adapter.kill("SIGTERM");
		const forceKill = setTimeout(() => active.adapter.kill("SIGKILL"), STOP_GRACE_MS);
		forceKill.unref?.();
		try {
			await active.done;
		} finally {
			clearTimeout(forceKill);
		}
	}
};
function createNodeWorkerSupervisor(options = {}) {
	return new NodeWorkerSupervisor(options);
}
//#endregion
//#region src/node-host/runtime.ts
/** Transport-independent CLI node-host runtime shared by Gateway and app workers. */
const DEFAULT_NODE_PATH = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const MAX_PENDING_INVOKE_INPUT_BYTES = 64 * 1024;
function dispatchNodeInvokeInput(target, seq, payloadJSON) {
	if (!target || target.inputFailed || seq < target.nextInputSeq) return false;
	if (seq > target.nextInputSeq) logDebug(`node-host: input sequence gap: expected ${target.nextInputSeq}, received ${seq}`);
	target.nextInputSeq = seq + 1;
	if (target.input) {
		target.input(payloadJSON);
		return true;
	}
	if (!target.pendingInput.push(payloadJSON)) {
		target.inputFailed = true;
		logDebug("node-host: aborted invoke after buffered input exceeded 64 KiB");
		return false;
	}
	return true;
}
function registerNodeInvokeInputHandler(target, input) {
	if (target.inputFailed) return;
	target.input = input;
	for (const pending of target.pendingInput.drain()) input(pending);
}
function resolveExecutablePathFromEnv(bin, pathEnv) {
	if (bin.includes("/") || bin.includes("\\")) return null;
	return resolveExecutableFromPathEnv(bin, pathEnv) ?? null;
}
function resolveExecutableTrustPathFromEnv(bin, pathEnv) {
	const resolvedPath = resolveExecutablePathFromEnv(bin, pathEnv);
	if (!resolvedPath) return null;
	try {
		return fs.realpathSync(resolvedPath);
	} catch {
		return resolvedPath;
	}
}
function resolveSkillBinTrustEntries(bins, pathEnv) {
	const trustEntries = [];
	const seen = /* @__PURE__ */ new Set();
	for (const raw of bins) {
		const name = raw.trim();
		if (!name) continue;
		const resolvedPath = resolveExecutableTrustPathFromEnv(name, pathEnv);
		if (!resolvedPath) continue;
		const key = `${name}\u0000${resolvedPath}`;
		if (seen.has(key)) continue;
		seen.add(key);
		trustEntries.push({
			name,
			resolvedPath
		});
	}
	return trustEntries.toSorted((left, right) => left.name.localeCompare(right.name) || left.resolvedPath.localeCompare(right.resolvedPath));
}
var SkillBinsCache = class {
	constructor(client, pathEnv) {
		this.client = client;
		this.pathEnv = pathEnv;
		this.bins = [];
		this.lastRefresh = 0;
		this.ttlMs = 9e4;
	}
	async current(force = false) {
		if (force || Date.now() - this.lastRefresh > this.ttlMs) await this.refresh();
		return this.bins;
	}
	async refresh() {
		try {
			const res = await this.client.request("skills.bins", {});
			const bins = Array.isArray(res?.bins) ? res.bins.map((bin) => String(bin)) : [];
			this.bins = resolveSkillBinTrustEntries(bins, this.pathEnv);
			this.lastRefresh = Date.now();
		} catch {
			if (!this.lastRefresh) this.bins = [];
		}
	}
};
function ensureNodePathEnv() {
	ensureOpenClawCliOnPath({ pathEnv: process.env.PATH ?? "" });
	const current = process.env.PATH ?? "";
	if (current.trim()) return current;
	process.env.PATH = DEFAULT_NODE_PATH;
	return DEFAULT_NODE_PATH;
}
function createInventory(params) {
	const pluginTools = [...params.pluginTools, ...params.mcpManager?.descriptors ?? []].toSorted((left, right) => {
		const a = left;
		const b = right;
		return (a.pluginId ?? "").localeCompare(b.pluginId ?? "") || (a.name ?? "").localeCompare(b.name ?? "");
	});
	return {
		skills: params.skills,
		pluginTools
	};
}
function sameStringList(left, right) {
	return left.length === right.length && left.every((value, index) => value === right[index]);
}
function sameManifest(left, right) {
	return left.pathEnv === right.pathEnv && sameStringList(left.caps, right.caps) && sameStringList(left.commands, right.commands) && JSON.stringify(left.computerUse) === JSON.stringify(right.computerUse) && JSON.stringify(left.workerRuns) === JSON.stringify(right.workerRuns);
}
async function prepareNodeHostRuntime(params) {
	ensureTerminalUploadCleanup();
	const config = params?.config ?? getRuntimeConfig();
	const env = params?.env ?? process.env;
	await ensureNodeHostPluginRegistry({
		config,
		env
	});
	const pathEnv = ensureNodePathEnv();
	env.PATH = pathEnv;
	const duplexEnabled = params?.enableAgentRuns === true || params?.enableDuplexPluginCommands === true;
	const platform = params?.platform ?? process.platform;
	const installedAppsSharingEnabled = platform === "darwin" && params?.installedAppsSharingEnabled === true;
	const desktopStreamingEnabled = (platform === "darwin" || platform === "linux" || platform === "win32") && config.desktop?.host?.enabled === true;
	const availabilityContext = {
		config,
		env
	};
	const resolvePluginNodeHost = () => listRegisteredNodeHostCapsAndCommands(availabilityContext, { includeDuplex: duplexEnabled });
	const pluginNodeHost = resolvePluginNodeHost();
	const claudePath = params?.enableAgentRuns === true && config.nodeHost?.agentRuns?.claude?.enabled === true ? resolveExecutableTrustPathFromEnv("claude", pathEnv) : null;
	const workerInstallation = params?.enableWorkerRuns === true && config.nodeHost?.workerRuns?.enabled === true ? await resolveNodeWorkerInstallation() : void 0;
	const workerRuns = workerInstallation?.build;
	const skills = config.nodeHost?.skills?.enabled === false ? null : scanNodeHostedSkills();
	const buildManifest = (pluginManifest) => ({
		caps: [.../* @__PURE__ */ new Set([
			"system",
			"mcp",
			...installedAppsSharingEnabled ? ["device"] : [],
			...pluginManifest.caps
		])].toSorted(),
		commands: [.../* @__PURE__ */ new Set([
			...NODE_SYSTEM_RUN_COMMANDS,
			...NODE_EXEC_APPROVALS_COMMANDS,
			NODE_FS_LIST_DIR_COMMAND,
			NODE_TERMINAL_UPLOAD_COMMAND,
			NODE_MCP_TOOLS_CALL_COMMAND,
			...desktopStreamingEnabled ? [NODE_DESKTOP_STREAM_COMMAND] : [],
			...installedAppsSharingEnabled ? [NODE_DEVICE_APPS_COMMAND] : [],
			...claudePath ? [NODE_AGENT_CLI_CLAUDE_RUN_COMMAND] : [],
			...pluginManifest.commands
		])].toSorted(),
		...pluginManifest.computerUse ? { computerUse: pluginManifest.computerUse } : {},
		pathEnv,
		...workerRuns ? { workerRuns } : {}
	});
	const manifest = buildManifest(pluginNodeHost);
	return {
		manifest,
		initialInventory: createInventory({
			skills,
			pluginTools: pluginNodeHost.nodePluginTools
		}),
		start({ client, onInventoryChanged, onManifestChanged, onRunnerAvailabilityChanged }) {
			const mcpAbort = new AbortController();
			const workerWorkspace = workerInstallation ? new NodeWorkerWorkspaceRuntime({ env }) : void 0;
			const workerSupervisor = workerInstallation ? createNodeWorkerSupervisor({
				env,
				localInstallation: workerInstallation,
				onAvailabilityChanged: onRunnerAvailabilityChanged,
				workspace: workerWorkspace
			}) : void 0;
			if (workerSupervisor) workerSupervisor.initialize().catch((error) => {
				logDebug(`node-host: worker capacity reconciliation failed: ${String(error)}`);
			});
			const skillBins = new SkillBinsCache(client, pathEnv);
			const activeInvokes = /* @__PURE__ */ new Map();
			const pluginCommandContext = { sendNodeEvent: async (event, payload) => await client.request("node.event", buildNodeEventParams(event, payload)) };
			let currentPluginNodeHost = pluginNodeHost;
			let currentManifest = manifest;
			let gatewayConnection;
			let manager;
			let closing = false;
			let closePromise;
			const startup = startNodeHostMcpManager(config.nodeHost?.mcp?.servers, { signal: mcpAbort.signal }).then((resolved) => {
				manager = resolved;
				if (!closing) onInventoryChanged?.(createInventory({
					skills,
					pluginTools: currentPluginNodeHost.nodePluginTools,
					mcpManager: manager
				}));
				return resolved;
			});
			const refreshAvailability = () => {
				const nextPluginNodeHost = resolvePluginNodeHost();
				const nextManifest = buildManifest(nextPluginNodeHost);
				currentPluginNodeHost = nextPluginNodeHost;
				if (!sameManifest(currentManifest, nextManifest)) {
					currentManifest = nextManifest;
					onManifestChanged?.(nextManifest);
				}
				onInventoryChanged?.(createInventory({
					skills,
					pluginTools: currentPluginNodeHost.nodePluginTools,
					mcpManager: manager
				}));
			};
			const stopAvailabilityWatch = onManifestChanged ? watchRegisteredNodeHostCommandAvailability(availabilityContext, refreshAvailability) : () => {};
			if (onManifestChanged) refreshAvailability();
			return {
				async invoke(frame) {
					const duplexCommand = duplexEnabled && isRegisteredNodeHostCommandDuplex(frame.command);
					const progressEnabled = duplexCommand || frame.command === "desktop.stream";
					const controller = new AbortController();
					const input = duplexCommand ? {
						nextInputSeq: 0,
						pendingInput: new BoundedBuffer(MAX_PENDING_INVOKE_INPUT_BYTES, {
							mode: "fail-closed",
							onOverflow: () => controller.abort(/* @__PURE__ */ new Error("terminal input exceeded the 64 KiB pre-spawn buffer"))
						}, (payload) => Buffer.byteLength(payload, "utf8")),
						inputFailed: false
					} : void 0;
					const active = {
						controller,
						...input ? { input } : {}
					};
					activeInvokes.get(frame.id)?.controller.abort();
					activeInvokes.set(frame.id, active);
					const progress = progressEnabled ? createNodeInvokeProgressWriter({
						client,
						frame,
						idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
						onError: () => controller.abort()
					}) : void 0;
					if (duplexCommand) progress?.startHeartbeats();
					const pluginCommandIo = input && progress ? {
						signal: controller.signal,
						emitChunk: async (chunk) => await progress.write(chunk),
						onInput: (callback) => {
							if (activeInvokes.get(frame.id) === active) registerNodeInvokeInputHandler(input, callback);
						}
					} : void 0;
					try {
						await handleInvoke(frame, client, skillBins, manager, {
							...claudePath ? { claudePath } : {},
							signal: controller.signal,
							...pluginCommandIo ? { pluginCommandIo } : {},
							...gatewayConnection?.url ? { gatewayUrl: gatewayConnection.url } : {},
							...gatewayConnection?.tlsFingerprint ? { gatewayTlsFingerprint: gatewayConnection.tlsFingerprint } : {},
							...config.desktop?.host ? { desktopHostConfig: config.desktop.host } : {},
							...progress ? { emitProgress: (text) => progress.write(text) } : {},
							installedAppsSharingEnabled,
							installedAppsPlatform: platform,
							pluginCommandContext,
							...workerSupervisor ? { workerSupervisor } : {},
							...workerWorkspace ? { workerWorkspace } : {}
						});
					} finally {
						progress?.stop();
						await progress?.flush();
						if (activeInvokes.get(frame.id) === active) activeInvokes.delete(frame.id);
					}
				},
				handleInput(invokeId, seq, payloadJSON) {
					const input = activeInvokes.get(invokeId)?.input;
					if (!dispatchNodeInvokeInput(input, seq, payloadJSON)) logDebug(`node-host: dropped inactive or duplicate input for invoke ${invokeId}`);
				},
				cancel(invokeId) {
					activeInvokes.get(invokeId)?.controller.abort();
				},
				cancelAll() {
					for (const active of activeInvokes.values()) active.controller.abort();
					activeInvokes.clear();
				},
				updateGatewayConnection(connection) {
					gatewayConnection = connection;
				},
				close() {
					if (closePromise) return closePromise;
					closing = true;
					this.cancelAll();
					const preludeErrors = [];
					try {
						stopAvailabilityWatch();
					} catch (error) {
						preludeErrors.push(error);
					}
					mcpAbort.abort();
					const supervisorClose = Promise.resolve().then(() => workerSupervisor?.close());
					const mcpClose = startup.then((resolved) => resolved.close());
					closePromise = Promise.allSettled([supervisorClose, mcpClose]).then((results) => {
						const errors = [...preludeErrors, ...results.flatMap((result) => result.status === "rejected" ? [result.reason] : [])];
						if (errors.length === 1) throw errors[0];
						if (errors.length > 1) throw new AggregateError(errors, "node-host runtime close failed");
					});
					return closePromise;
				}
			};
		}
	};
}
//#endregion
//#region src/node-host/startup-state-migrations.ts
/** Runs the Doctor-owned retired state-store migrations required by node-host startup. */
async function reportMigration(label, run, log) {
	try {
		const result = await run();
		for (const change of result?.changes ?? []) log.info(change);
		for (const warning of result?.warnings ?? []) log.warn(warning);
	} catch (error) {
		log.warn(`Failed running ${label} startup migration: ${formatErrorMessage(error)}`);
	}
}
/** Invoke the Doctor-owned state migrators authorized for node-host startup. */
async function runStartupMigrations(params) {
	const stateDir = resolveStateDir(params?.env);
	const env = {
		...params?.env ?? process.env,
		OPENCLAW_STATE_DIR: stateDir
	};
	const log = params?.log ?? createSubsystemLogger("node-host/startup-migrations");
	await reportMigration("device auth", async () => {
		const detected = detectLegacyDeviceAuth({
			stateDir,
			doctorOnlyStateMigrations: true
		});
		if (!detected.hasLegacy) return;
		return await migrateLegacyDeviceAuth({
			detected,
			env,
			stateDir
		});
	}, log);
	await reportMigration("device identity", async () => {
		const detected = detectLegacyDeviceIdentity({
			stateDir,
			env,
			doctorOnlyStateMigrations: true
		});
		if (!detected.hasLegacy) return;
		return await migrateLegacyDeviceIdentity({
			detected,
			env,
			stateDir,
			doctorOnlyStateMigrations: true
		});
	}, log);
	await reportMigration("exec approvals", async () => {
		const detected = detectLegacyExecApprovals({
			stateDir,
			doctorOnlyStateMigrations: true
		});
		if (!detected.hasLegacy) return;
		return await migrateLegacyExecApprovals({
			detected,
			env,
			stateDir
		});
	}, log);
}
//#endregion
//#region src/node-host/runner.ts
/** CLI runner for node-host stdin/stdout command dispatch. */
function resolveNodeHostGatewayPlatform(platform) {
	switch (platform) {
		case "darwin": return "macos";
		case "win32": return "windows";
		case "linux": return "linux";
		default: return "unknown";
	}
}
function resolveNodeHostGatewayDeviceFamily(platform) {
	switch (platform) {
		case "darwin": return "Mac";
		case "win32": return "Windows";
		case "linux": return "Linux";
		default: return;
	}
}
function writeStderrLine(message) {
	process.stderr.write(`${message}\n`);
}
const NODE_HOST_EXIT_ON_RECONNECT_PAUSE_CODES = /* @__PURE__ */ new Set([
	ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
	ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH,
	ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
	ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH
]);
function shouldExitNodeHostOnReconnectPaused(detailCode) {
	return detailCode !== null && NODE_HOST_EXIT_ON_RECONNECT_PAUSE_CODES.has(detailCode);
}
function formatNodeHostReconnectPausedMessage(info, params) {
	const detail = info.detailCode ? ` detail=${info.detailCode}` : "";
	const reason = info.reason.trim() || "no close reason";
	const action = params?.exiting ? "exiting for supervisor restart" : "waiting for operator action";
	return `node host gateway reconnect paused after close (${info.code}): ${reason}${detail}; ${action}`;
}
function handleNodeHostReconnectPaused(info, deps = {}) {
	const shouldExit = shouldExitNodeHostOnReconnectPaused(info.detailCode);
	(deps.writeLine ?? writeStderrLine)(formatNodeHostReconnectPausedMessage(info, { exiting: shouldExit }));
	if (!shouldExit) return;
	(deps.exit ?? ((code) => process.exit(code)))(1);
}
const NODE_PLUGIN_TOOLS_UPDATE_METHOD = "node.pluginTools.update";
const NODE_SKILLS_UPDATE_METHOD = "node.skills.update";
const NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS = 250;
const NODE_OPTIONAL_PUBLICATION_RETRY_MAX_MS = 5e3;
function isExactUnknownMethodError(error, method) {
	return error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message === `unknown method: ${method}`;
}
function isExactLegacyNodeAuthorizationError(error, method, gatewayProtocol) {
	return (gatewayProtocol === 3 || gatewayProtocol === 4 && method === "node.runnerInventory.update") && error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message === "unauthorized role: node";
}
function classifyNodeMethodFailure(error, method, gatewayProtocol) {
	if (isExactUnknownMethodError(error, method) || isExactLegacyNodeAuthorizationError(error, method, gatewayProtocol)) return "legacy-unsupported";
	if (error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST") return "rejected";
	return "transient";
}
async function resolveNodeHostGatewayCredentials(params) {
	return await resolveGatewayCredentialsWithSecretInputs({
		config: (params.config.gateway?.mode === "remote" ? "remote" : "local") === "local" ? buildNodeHostLocalAuthConfig(params.config) : params.config,
		env: params.env,
		localPrecedence: "env-first",
		remoteTokenPrecedence: "env-first",
		remotePasswordPrecedence: "env-first"
	});
}
function buildNodeHostLocalAuthConfig(config) {
	if (!config.gateway?.remote?.token && !config.gateway?.remote?.password) return config;
	const nextConfig = structuredClone(config);
	if (nextConfig.gateway?.remote) {
		nextConfig.gateway.remote.token = void 0;
		nextConfig.gateway.remote.password = void 0;
	}
	return nextConfig;
}
async function runNodeHost(opts) {
	await runStartupMigrations({ log: {
		info: writeStderrLine,
		warn: writeStderrLine
	} });
	const plannedGateway = {
		host: opts.gatewayHost,
		port: opts.gatewayPort,
		tls: opts.gatewayTls ?? getRuntimeConfig().gateway?.tls?.enabled ?? false,
		tlsFingerprint: opts.gatewayTlsFingerprint,
		contextPath: opts.gatewayContextPath
	};
	const fallbackDisplayName = await getMachineDisplayName();
	const config = await configureNodeHost({
		nodeId: opts.nodeId,
		displayName: opts.displayName,
		fallbackDisplayName,
		gateway: plannedGateway,
		installedAppsSharing: opts.installedAppsSharing
	});
	const nodeId = config.nodeId;
	const displayName = config.displayName ?? fallbackDisplayName;
	const gateway = config.gateway ?? plannedGateway;
	const gatewayCandidates = opts.gatewayCandidates?.length ? opts.gatewayCandidates : [gateway];
	const cfg = getRuntimeConfig();
	const preparedRuntime = await prepareNodeHostRuntime({
		config: cfg,
		env: process.env,
		enableAgentRuns: true,
		enableWorkerRuns: true,
		installedAppsSharingEnabled: config.installedAppsSharing
	});
	const { token, password } = opts.preferGatewayBootstrapToken ? {} : await resolveNodeHostGatewayCredentials({
		config: cfg,
		env: process.env
	});
	let inventory = preparedRuntime.initialInventory;
	let workerRunsAvailable = false;
	let gatewayHelloReceived = false;
	let gatewayConnectionGeneration = 0;
	let connectedGatewayProtocol = 0;
	let optionalPublicationStates = /* @__PURE__ */ new Map();
	const retireOptionalPublications = () => {
		for (const state of optionalPublicationStates.values()) if (state.retryTimer) clearTimeout(state.retryTimer);
		optionalPublicationStates.clear();
	};
	const retireGatewayConnection = () => {
		gatewayConnectionGeneration += 1;
		gatewayHelloReceived = false;
		connectedGatewayProtocol = 0;
		retireOptionalPublications();
	};
	const queueOptionalPublication = (method, params, label, isRetry = false) => {
		if (!gatewayHelloReceived) return;
		const connectionGeneration = gatewayConnectionGeneration;
		const gatewayProtocol = connectedGatewayProtocol;
		const connectionIsCurrent = () => connectionGeneration === gatewayConnectionGeneration;
		let state = optionalPublicationStates.get(method);
		if (!state) {
			state = {
				status: "unknown",
				hasPending: false,
				hasPublishedParams: false,
				hasRejectedParams: false,
				retryDelayMs: NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS,
				retryPending: false,
				hasInFlightParams: false
			};
			optionalPublicationStates.set(method, state);
		}
		if (state.hasInFlightParams && isDeepStrictEqual(state.inFlightParams, params)) {
			if (state.hasPending) state.pendingParams = params;
			return;
		}
		if (state.status === "unsupported" || state.hasRejectedParams && isDeepStrictEqual(state.rejectedParams, params) || state.hasPending && isDeepStrictEqual(state.pendingParams, params) || !state.inFlight && state.hasPublishedParams && isDeepStrictEqual(state.publishedParams, params)) return;
		if (state.retryTimer) {
			clearTimeout(state.retryTimer);
			state.retryTimer = void 0;
		}
		if (!isRetry) state.retryDelayMs = NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS;
		state.hasRejectedParams = false;
		state.rejectedParams = void 0;
		state.pendingParams = params;
		state.hasPending = true;
		if (state.inFlight) return;
		const publish = async () => {
			while (state.hasPending && state.status !== "unsupported") {
				if (!connectionIsCurrent()) return;
				const nextParams = state.pendingParams;
				state.pendingParams = void 0;
				state.hasPending = false;
				if (state.hasPublishedParams && isDeepStrictEqual(state.publishedParams, nextParams)) continue;
				if (state.hasRejectedParams && !isDeepStrictEqual(state.rejectedParams, nextParams)) {
					state.hasRejectedParams = false;
					state.rejectedParams = void 0;
				}
				state.inFlightParams = nextParams;
				state.hasInFlightParams = true;
				try {
					await client.request(method, nextParams);
					if (!connectionIsCurrent()) return;
					state.status = "supported";
					state.publishedParams = nextParams;
					state.hasPublishedParams = true;
					state.hasRejectedParams = false;
					state.rejectedParams = void 0;
					state.retryDelayMs = NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS;
					state.retryPending = false;
				} catch (error) {
					if (!connectionIsCurrent()) return;
					const failure = classifyNodeMethodFailure(error, method, gatewayProtocol);
					if (failure === "legacy-unsupported") {
						state.status = "unsupported";
						state.pendingParams = void 0;
						state.hasPending = false;
						state.retryPending = false;
					} else {
						writeStderrLine(`node host ${label} publish failed: ${String(error)}`);
						if (failure === "rejected") {
							state.hasRejectedParams = true;
							state.rejectedParams = nextParams;
							state.retryPending = false;
							if (state.hasPending && isDeepStrictEqual(state.pendingParams, nextParams)) {
								state.pendingParams = void 0;
								state.hasPending = false;
							}
						} else {
							state.hasPublishedParams = false;
							state.publishedParams = void 0;
							if (!state.hasPending || isDeepStrictEqual(state.pendingParams, nextParams)) {
								state.pendingParams = nextParams;
								state.hasPending = true;
								state.retryPending = true;
								break;
							}
						}
					}
				} finally {
					state.inFlightParams = void 0;
					state.hasInFlightParams = false;
				}
			}
		};
		const inFlight = publish().finally(() => {
			if (state.inFlight === inFlight) {
				state.inFlight = void 0;
				if (state.hasPending && state.status !== "unsupported" && gatewayHelloReceived && connectionIsCurrent()) {
					const pendingParams = state.pendingParams;
					const retryPending = state.retryPending;
					state.retryPending = false;
					if (retryPending) {
						const retryDelayMs = state.retryDelayMs;
						state.retryDelayMs = Math.min(retryDelayMs * 2, NODE_OPTIONAL_PUBLICATION_RETRY_MAX_MS);
						state.retryTimer = setTimeout(() => {
							state.retryTimer = void 0;
							if (state.hasPending && isDeepStrictEqual(state.pendingParams, pendingParams) && gatewayHelloReceived && connectionIsCurrent()) {
								state.pendingParams = void 0;
								state.hasPending = false;
								queueOptionalPublication(method, pendingParams, label, true);
							}
						}, retryDelayMs);
						state.retryTimer.unref?.();
					} else {
						state.pendingParams = void 0;
						state.hasPending = false;
						queueOptionalPublication(method, pendingParams, label);
					}
				}
			}
		});
		state.inFlight = inFlight;
	};
	const publishInventory = () => {
		if (!gatewayHelloReceived) return;
		if (inventory.skills) queueOptionalPublication(NODE_SKILLS_UPDATE_METHOD, { skills: inventory.skills }, "skill");
		queueOptionalPublication(NODE_PLUGIN_TOOLS_UPDATE_METHOD, { tools: inventory.pluginTools }, "plugin tool");
	};
	const publishRunnerInventory = () => {
		queueOptionalPublication(NODE_RUNNER_INVENTORY_UPDATE_METHOD, {
			protocolFeatures: [NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE],
			...workerRunsAvailable && preparedRuntime.manifest.workerRuns ? { workerRuns: preparedRuntime.manifest.workerRuns } : {}
		}, "runner inventory");
	};
	const persistWinningGateway = (winningGateway) => {
		configureNodeHost({
			nodeId,
			displayName,
			fallbackDisplayName,
			gateway: winningGateway,
			installedAppsSharing: config.installedAppsSharing
		}).catch((error) => {
			writeStderrLine(`node host gateway endpoint persistence failed: ${String(error)}`);
		});
	};
	const client = createNodeHostGatewayCandidateConnection({
		candidates: gatewayCandidates,
		clientOptions: {
			token: token || void 0,
			bootstrapToken: opts.gatewayBootstrapToken,
			preferBootstrapToken: opts.preferGatewayBootstrapToken,
			password: password || void 0,
			instanceId: nodeId,
			clientName: GATEWAY_CLIENT_NAMES.NODE_HOST,
			clientDisplayName: displayName,
			clientVersion: VERSION,
			platform: resolveNodeHostGatewayPlatform(process.platform),
			deviceFamily: resolveNodeHostGatewayDeviceFamily(process.platform),
			mode: GATEWAY_CLIENT_MODES.NODE,
			role: "node",
			scopes: [],
			caps: preparedRuntime.manifest.caps,
			commands: preparedRuntime.manifest.commands,
			computerUse: preparedRuntime.manifest.computerUse,
			workerRuns: preparedRuntime.manifest.workerRuns,
			pathEnv: preparedRuntime.manifest.pathEnv,
			permissions: void 0,
			deviceIdentity: loadOrCreateDeviceIdentity()
		},
		onEvent: (evt) => {
			if (evt.event === "node.invoke.cancel") {
				const payload = coerceNodeInvokeCancelPayload(evt.payload);
				if (payload) activeRuntime.cancel(payload.invokeId);
				return;
			}
			if (evt.event === "node.invoke.input") {
				const payload = coerceNodeInvokeInputPayload(evt.payload);
				if (payload) activeRuntime.handleInput(payload.invokeId, payload.seq, payload.payloadJSON);
				return;
			}
			if (evt.event !== "node.invoke.request") return;
			const payload = coerceNodeInvokePayload(evt.payload);
			if (payload) activeRuntime.invoke(payload);
		},
		onHelloOk: (hello, url, tlsFingerprint) => {
			writeStderrLine(`node host gateway connected: ${url}`);
			activeRuntime.updateGatewayConnection({
				url,
				...tlsFingerprint ? { tlsFingerprint } : {}
			});
			gatewayConnectionGeneration += 1;
			gatewayHelloReceived = true;
			connectedGatewayProtocol = hello.protocol;
			retireOptionalPublications();
			optionalPublicationStates = /* @__PURE__ */ new Map();
			if (opts.stopAfterFirstConnect) {
				finish(0);
				return;
			}
			publishRunnerInventory();
			publishInventory();
		},
		onConnectError: (error) => {
			writeStderrLine(`node host gateway connect failed: ${error.message}`);
		},
		onReconnectPaused: (info) => {
			handleNodeHostReconnectPaused(info, { exit: (code) => {
				client.stop();
				activeRuntime.close().finally(() => process.exit(code));
			} });
		},
		onClose: (code, reason) => {
			retireGatewayConnection();
			activeRuntime.updateGatewayConnection();
			activeRuntime.cancelAll();
			writeStderrLine(`node host gateway closed (${code}): ${reason}`);
		},
		onWinningCandidate: persistWinningGateway
	});
	const activeRuntime = preparedRuntime.start({
		client,
		onInventoryChanged: (nextInventory) => {
			inventory = nextInventory;
			publishInventory();
		},
		onRunnerAvailabilityChanged: (available) => {
			workerRunsAvailable = available;
			publishRunnerInventory();
		},
		onManifestChanged: (manifest) => {
			retireGatewayConnection();
			client.updateNodeManifest(manifest);
		}
	});
	let stopping = false;
	let resolveStopped;
	const stopped = new Promise((resolve) => {
		resolveStopped = resolve;
	});
	const lifetimeInterval = setInterval(() => {}, 1e6);
	const removeSignalHandlers = () => {
		process.off("SIGINT", onSigint);
		process.off("SIGTERM", onSigterm);
	};
	const stopClientAndMcp = async () => {
		retireGatewayConnection();
		client.stop();
		try {
			await activeRuntime.close();
		} finally {
			clearInterval(lifetimeInterval);
		}
	};
	const finish = async (exitCode) => {
		if (stopping) return;
		stopping = true;
		removeSignalHandlers();
		try {
			await stopClientAndMcp();
		} finally {
			process.exitCode = exitCode;
			resolveStopped?.();
		}
	};
	const onSigint = () => void finish(130);
	const onSigterm = () => void finish(143);
	process.once("SIGINT", onSigint);
	process.once("SIGTERM", onSigterm);
	const readinessPromise = startGatewayClientWhenEventLoopReady(client);
	let readiness;
	try {
		readiness = await readinessPromise;
	} catch (error) {
		if (stopping) {
			await stopped;
			return;
		}
		removeSignalHandlers();
		await stopClientAndMcp();
		throw error;
	}
	if (!readiness.ready) {
		if (stopping) {
			await stopped;
			return;
		}
		removeSignalHandlers();
		await stopClientAndMcp();
		throw new Error("node host gateway event loop readiness timeout");
	}
	await stopped;
}
//#endregion
//#region src/commands/node-daemon-install-helpers.ts
/** Node-based daemon install plan builder for managed gateway services. */
function buildNodeInstallEnvironmentValueSources() {
	return {
		OPENCLAW_GATEWAY_TOKEN: "file",
		OPENCLAW_GATEWAY_PASSWORD: "file"
	};
}
/** Builds launch arguments, environment, and metadata for a Node daemon service install. */
async function buildNodeInstallPlan(params) {
	const { devMode, nodePath } = await resolveDaemonInstallRuntimeInputs({
		env: params.env,
		runtime: params.runtime,
		devMode: params.devMode,
		nodePath: params.nodePath
	});
	const { programArguments, workingDirectory } = await resolveNodeProgramArguments({
		host: params.host,
		port: params.port,
		contextPath: params.contextPath,
		tls: params.tls,
		tlsFingerprint: params.tlsFingerprint,
		nodeId: params.nodeId,
		displayName: params.displayName,
		installedAppsSharing: params.installedAppsSharing,
		dev: devMode,
		nodePath
	});
	await emitDaemonInstallRuntimeWarning({
		env: params.env,
		runtime: params.runtime,
		programArguments,
		warn: params.warn,
		title: "Node daemon runtime"
	});
	return {
		programArguments,
		workingDirectory,
		environment: buildNodeServiceEnvironment({
			env: params.env,
			extraPathDirs: resolveDaemonNodeBinDir(nodePath)
		}),
		environmentValueSources: buildNodeInstallEnvironmentValueSources(),
		description: "OpenClaw Node Host"
	};
}
//#endregion
//#region src/cli/node-cli/gateway-options.ts
function gatewayConfigFromUrl(url, tlsFingerprint) {
	const parsed = new URL(url);
	const tls = parsed.protocol === "wss:";
	return {
		host: parsed.hostname,
		port: parsed.port ? Number.parseInt(parsed.port, 10) : tls ? 443 : 80,
		...parsed.pathname !== "/" ? { contextPath: parsed.pathname } : {},
		tls,
		...tlsFingerprint ? { tlsFingerprint } : {}
	};
}
function resolveNodePairGatewayOptions(input) {
	return resolveNodePairGatewayPayload(decodePairingSetupCode(input));
}
/** Project a validated pairing payload into the canonical node-host candidate list. */
function resolveNodePairGatewayPayload(payload) {
	const candidates = (payload.urls ?? [payload.url]).map((url) => gatewayConfigFromUrl(url, url === payload.url ? payload.tlsFingerprint : void 0));
	const primary = candidates[0];
	return {
		host: primary.host ?? "127.0.0.1",
		port: primary.port ?? 18789,
		...primary.contextPath ? { contextPath: primary.contextPath } : {},
		tls: primary.tls ?? false,
		...primary.tlsFingerprint ? { tlsFingerprint: primary.tlsFingerprint } : {},
		bootstrapToken: payload.bootstrapToken,
		candidates
	};
}
function resolveNodeGatewayOptions(options, config, pair) {
	const baselineHost = pair?.host ?? config?.gateway?.host ?? "127.0.0.1";
	const baselinePort = pair?.port ?? config?.gateway?.port ?? 18789;
	const host = normalizeOptionalString(options.host) || baselineHost;
	const port = options.port === void 0 ? baselinePort : parsePort(options.port);
	const endpointChanged = host !== baselineHost || port !== null && port !== baselinePort;
	const baselineTlsFingerprint = pair?.tlsFingerprint ?? config?.gateway?.tlsFingerprint;
	const baselineTls = pair?.tls ?? config?.gateway?.tls;
	const tlsFingerprint = options.tls === false ? void 0 : normalizeOptionalString(options.tlsFingerprint) ?? (endpointChanged ? void 0 : baselineTlsFingerprint);
	const tls = typeof options.tls === "boolean" ? options.tls : Boolean(tlsFingerprint) || (endpointChanged ? void 0 : baselineTls);
	const contextPath = normalizeOptionalString(options.contextPath) ?? (options.contextPath !== void 0 || endpointChanged ? void 0 : pair?.contextPath ?? config?.gateway?.contextPath);
	const hasExplicitEndpoint = options.host !== void 0 || options.port !== void 0 || options.contextPath !== void 0 || options.tls !== void 0 || options.tlsFingerprint !== void 0;
	return {
		host,
		port,
		contextPath,
		tls,
		tlsFingerprint,
		gatewayCandidates: pair && !hasExplicitEndpoint ? pair.candidates : void 0
	};
}
//#endregion
//#region src/cli/node-cli/daemon.ts
function renderNodeServiceStartHints() {
	return buildPlatformServiceStartHints({
		installCommand: formatCliCommand("openclaw node install"),
		startCommand: formatCliCommand("openclaw node start"),
		launchAgentPlistPath: `~/Library/LaunchAgents/${resolveNodeLaunchAgentLabel()}.plist`,
		systemdServiceName: resolveNodeSystemdServiceName(),
		windowsTaskName: resolveNodeWindowsTaskName()
	});
}
function buildNodeRuntimeHints(env = process.env) {
	return buildPlatformRuntimeLogHints({
		env,
		systemdServiceName: resolveNodeSystemdServiceName(),
		windowsTaskName: resolveNodeWindowsTaskName()
	});
}
/**
* Warns (does NOT auto-enable) when systemd user lingering is disabled.
* The installed user-level node service stops when the last SSH session ends
* unless `loginctl enable-linger <user>` has been run. Read-only: this never
* changes host state, matching the operator-consent policy used elsewhere.
*/
async function warnIfSystemdUserLingerDisabled(warn) {
	if (process.platform !== "linux") return;
	if (!await isSystemdUserServiceAvailable()) return;
	const user = resolveSystemdUserServiceAccount(process.env);
	if (!user) return;
	const status = await readSystemdUserLingerStatus({
		env: process.env,
		user
	});
	if (!status || status.linger === "yes") return;
	warn(`Systemd lingering is disabled for ${status.user}. The node service will stop when you log out. Run: sudo loginctl enable-linger ${status.user}`);
}
async function runNodeDaemonInstall(opts) {
	const { json, stdout, warnings, emit, fail } = createDaemonInstallActionContext(opts.json);
	if (failIfNixDaemonInstallMode(fail)) return;
	const { host, port, contextPath, tls, tlsFingerprint } = resolveNodeGatewayOptions(opts, await loadNodeHostConfig());
	if (!Number.isFinite(port ?? NaN) || (port ?? 0) <= 0 || (port ?? 0) > 65535) {
		fail(opts.port !== void 0 ? formatInvalidPortOption("--port") : formatInvalidConfigPort("node.gateway.port"));
		return;
	}
	if (opts.tls === false && opts.tlsFingerprint !== void 0) {
		fail("--no-tls cannot be combined with --tls-fingerprint");
		return;
	}
	const runtimeRaw = opts.runtime ? opts.runtime : DEFAULT_GATEWAY_DAEMON_RUNTIME;
	if (!isGatewayDaemonRuntime(runtimeRaw)) {
		fail("Invalid --runtime (use \"node\"; Bun lacks the required node:sqlite API)");
		return;
	}
	const service = resolveNodeService();
	const warn = (message) => {
		if (json) warnings.push(message);
		else defaultRuntime.log(message);
	};
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		fail(`Node service check failed: ${String(err)}`);
		return;
	}
	if (loaded && !opts.force) {
		await warnIfSystemdUserLingerDisabled(warn);
		emit({
			ok: true,
			result: "already-installed",
			message: `Node service already ${service.loadedText}.`,
			service: buildDaemonServiceSnapshot(service, loaded),
			warnings: warnings.length ? warnings : void 0
		});
		if (!json) {
			defaultRuntime.log(`Node service already ${service.loadedText}.`);
			defaultRuntime.log(`Reinstall with: ${formatCliCommand("openclaw node install --force")}`);
		}
		return;
	}
	const { programArguments, workingDirectory, environment, environmentValueSources, description } = await buildNodeInstallPlan({
		env: process.env,
		host,
		port: port ?? 18789,
		contextPath,
		tls: Boolean(tls),
		tlsFingerprint,
		nodeId: opts.nodeId,
		displayName: opts.displayName,
		installedAppsSharing: opts.shareInstalledApps,
		runtime: runtimeRaw,
		warn: (message) => {
			if (json) warnings.push(message);
			else defaultRuntime.log(message);
		}
	});
	await installDaemonServiceAndEmit({
		serviceNoun: "Node",
		service,
		warnings,
		emit,
		fail,
		install: async () => {
			await service.install({
				env: process.env,
				stdout,
				warn,
				programArguments,
				workingDirectory,
				environment,
				environmentValueSources,
				description
			});
		},
		onVerified: async () => {
			await warnIfSystemdUserLingerDisabled(warn);
		}
	});
}
async function runNodeDaemonUninstall(opts = {}) {
	return await runServiceUninstall({
		serviceNoun: "Node",
		service: resolveNodeService(),
		opts,
		stopBeforeUninstall: false,
		assertNotLoadedAfterUninstall: false
	});
}
async function runNodeDaemonStart(opts = {}) {
	return await runServiceStart({
		serviceNoun: "Node",
		service: resolveNodeService(),
		renderStartHints: renderNodeServiceStartHints,
		opts
	});
}
async function runNodeDaemonRestart(opts = {}) {
	await runServiceRestart({
		serviceNoun: "Node",
		service: resolveNodeService(),
		renderStartHints: renderNodeServiceStartHints,
		opts
	});
}
async function runNodeDaemonStop(opts = {}) {
	return await runServiceStop({
		serviceNoun: "Node",
		service: resolveNodeService(),
		opts
	});
}
async function runNodeDaemonStatus(opts = {}) {
	const json = Boolean(opts.json);
	const service = resolveNodeService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (error) {
		const message = `Node service check failed: ${String(error)}`;
		if (json) defaultRuntime.writeJson({ error: message });
		else defaultRuntime.error(message);
		defaultRuntime.exit(1);
		return;
	}
	const [command, runtime] = await Promise.all([service.readCommand(process.env).catch(() => null), service.readRuntime(process.env).catch((err) => ({
		status: "unknown",
		detail: String(err)
	}))]);
	const payload = { service: {
		...buildDaemonServiceSnapshot(service, loaded),
		command,
		runtime
	} };
	if (json) {
		const safeEnvironment = filterDaemonEnv(command?.environment);
		defaultRuntime.writeJson({ service: {
			...payload.service,
			command: command ? {
				...command,
				environment: Object.keys(safeEnvironment).length > 0 ? safeEnvironment : void 0
			} : command
		} });
		return;
	}
	const { rich, label, accent, infoText, okText, warnText, errorText } = createCliStatusTextStyles();
	const serviceStatus = loaded ? okText(service.loadedText) : warnText(service.notLoadedText);
	defaultRuntime.log(`${label("Service:")} ${accent(service.label)} (${serviceStatus})`);
	if (command?.programArguments?.length) defaultRuntime.log(`${label("Command:")} ${infoText(command.programArguments.join(" "))}`);
	if (command?.sourcePath) defaultRuntime.log(`${label("Service file:")} ${infoText(command.sourcePath)}`);
	if (command?.workingDirectory) defaultRuntime.log(`${label("Working dir:")} ${infoText(command.workingDirectory)}`);
	const runtimeLine = formatRuntimeStatus(runtime);
	if (runtimeLine) {
		const runtimeColor = resolveRuntimeStatusColor(runtime?.status);
		defaultRuntime.log(`${label("Runtime:")} ${colorize(rich, runtimeColor, runtimeLine)}`);
	}
	if (!loaded) {
		defaultRuntime.log("");
		for (const hint of renderNodeServiceStartHints()) defaultRuntime.log(`${warnText("Start with:")} ${infoText(hint)}`);
		return;
	}
	const baseEnv = {
		...process.env,
		...command?.environment ?? void 0
	};
	const hintEnv = {
		...baseEnv,
		OPENCLAW_LOG_PREFIX: baseEnv.OPENCLAW_LOG_PREFIX ?? "node"
	};
	if (runtime?.missingUnit) {
		defaultRuntime.error(errorText("Service unit not found."));
		for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
		return;
	}
	if (runtime?.status === "stopped") {
		defaultRuntime.error(errorText("Service is loaded but not running."));
		for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
	}
}
//#endregion
export { runNodeDaemonStop as a, resolveNodePairGatewayOptions as c, runStartupMigrations as d, prepareNodeHostRuntime as f, runNodeDaemonStatus as i, resolveNodePairGatewayPayload as l, runNodeDaemonRestart as n, runNodeDaemonUninstall as o, runNodeDaemonStart as r, resolveNodeGatewayOptions as s, runNodeDaemonInstall as t, runNodeHost as u };
