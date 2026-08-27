import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { f as redactSensitiveText, m as redactToolPayloadText } from "./redact-CWP17HFN.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./fs-safe-CmrQUApq.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import "./path-guards-CQoZeoCG.js";
import { d as resolveConfigDir } from "./utils-Bw16L5tB.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { g as resolveNodeLaunchAgentLabel, v as resolveNodeSystemdServiceName, y as resolveNodeWindowsTaskName } from "./constants-ChqKLfPp.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { i as registerSecretValueForRedaction, r as redactRegisteredSecretValues } from "./secret-redaction-registry-gIFE-2_j.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { n as signalProcessTree } from "./kill-tree-CR2oLt9D.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { At as boolean, Rn as string, Tn as object, wn as number } from "./schemas-CZ9Toj_c.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { An as executeSqliteQuerySync, It as OPENCLAW_STATE_SCHEMA_SQL, Mn as getNodeSqliteKysely, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync, zt as tableExists } from "./openclaw-state-db-CeAO_dqo.js";
import { t as createDedupeCache } from "./dedupe-C9TI3O0j.js";
import { t as tempWorkspace } from "./private-temp-workspace-DLvP_dJe.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-dw5fHLEW.js";
import { l as sanitizeSystemRunEnvOverrides, s as sanitizeHostExecEnv, t as inspectHostExecEnvOverrides } from "./host-env-security-B_a4cpNH.js";
import { r as copyConfigResolutionFactsExcept } from "./resolution-facts-DIK_QG79.js";
import { i as resolveExecutableFromPathEnv } from "./executable-path-HS2Pej6k.js";
import { t as colorize } from "./theme-vjDs9tao.js";
import { i as logWarn, t as logDebug } from "./logger-D4iLuGk3.js";
import { d as getActivePluginRegistry } from "./runtime-DMlUh4Cg.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { c as resolveApprovalAuditTrustPath, u as resolveCommandResolutionFromArgv } from "./exec-command-resolution-CJ9Vm03p.js";
import { C as extractEnvAssignmentKeysFromDispatchWrappers, N as normalizeExecutableToken, a as extractShellWrapperCommand, c as isBlockedShellWrapperCommand, d as resolveShellWrapperTransportArgv, m as POSIX_INLINE_COMMAND_FLAGS, n as POSIX_SHELL_WRAPPERS, t as POSIX_PARSEABLE_SHELL_WRAPPERS, u as isShellWrapperInvocation, x as resolveInlineCommandMatch } from "./shell-wrapper-resolution-BddNi41x.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import "./worker-admission-v0PuudgP.js";
import { s as WORKER_PUBLIC_INGRESS_PATH } from "./worker-protocol-primitives-Ch87u2k0.js";
import { i as NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE, r as NODE_WORKER_CAPACITY_MAX, t as NODE_RUNNER_INVENTORY_UPDATE_METHOD } from "./node-runner-inventory-C6KxqRM_.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BcyyC-CC.js";
import "./config-B2bSneS2.js";
import { a as readWindowsProcessStartTimeSync } from "./windows-port-pids-Dw25m5j1.js";
import { A as resolveSystemdUserServiceAccount, D as isSystemdUserServiceAvailable } from "./systemd-scope-Dt6qzIxA.js";
import { r as resolveNodeProgramArguments } from "./program-args-DPGT6RM4.js";
import { f as buildNodeServiceEnvironment } from "./runtime-paths-BWwciIgl.js";
import { f as appendCapturedOutput, m as finalizeCapturedOutput, n as runExec, p as createCapturedOutputBuffers, r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { n as resolveDaemonInstallRuntimeInputs, r as resolveDaemonRuntimeBinDir, t as emitDaemonInstallRuntimeWarning } from "./daemon-install-plan.shared-Db9gDw_n.js";
import { r as isGatewayDaemonRuntime, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-DMPJy4HP.js";
import { i as readSystemdUserLingerStatus } from "./systemd-fY9j-7P4.js";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-HTpcnFye.js";
import { n as buildPlatformServiceStartHints, t as buildPlatformRuntimeLogHints } from "./runtime-hints-B9Y8o0pU.js";
import { a as filterDaemonEnv, d as resolveRuntimeStatusColor, n as createDaemonInstallActionContext, p as buildDaemonServiceSnapshot, r as failIfNixDaemonInstallMode, t as createCliStatusTextStyles, v as installDaemonServiceAndEmit } from "./shared-AtIdcOsw.js";
import { t as formatRuntimeStatus } from "./runtime-format-DtKf8bRh.js";
import { t as parsePort } from "./parse-port-Dw2bUWKg.js";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-Dxf1zdDX.js";
import { r as loadOrCreateDeviceIdentity } from "./device-identity-UxfYyiX_.js";
import { o as requireTlsFingerprint, r as normalizeTlsFingerprint } from "./client-address-utils-ycG4vrin.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-B7OzED4v.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-B1nULpha.js";
import { t as GatewayClient } from "./client-CtXLFRHL.js";
import { t as GatewayClientRequestError } from "./request-error-DOHu7KKj.js";
import { n as isGatewayLoopbackHost } from "./websocket-transport-wJ1IBbMW.js";
import { A as buildCloudflareAccessHeaders, E as parseWorkerConnectionEndpoint, S as completeWorkerLaunchDescriptor, _ as parseNodeWorkerLaunchInput, b as validateNodeWorkerLaunchInput, g as parseNodeWorkerEnvironmentStopInput, h as parseNodeWorkerConnectionFailureMessage, m as parseNodeWorkerCancelInput, p as nodeWorkerPlanHash, v as parseNodeWorkerLookupInput, y as parseNodeWorkerSupervisorReceipt } from "./worker-connection-contract-CLo4JQpE.js";
import { _ as NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE, a as NODE_EXEC_APPROVALS_COMMANDS, c as NODE_MCP_TOOLS_CALL_COMMAND, h as NODE_TERMINAL_UPLOAD_COMMAND, i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS, m as NODE_SYSTEM_RUN_COMMANDS, r as NODE_DEVICE_APPS_COMMAND, s as NODE_FS_LIST_DIR_COMMAND, t as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND, u as NODE_MCP_TOOL_CALL_TIMEOUT_MS } from "./node-commands-DRxP7loh.js";
import { Cm as GATEWAY_SERVER_CAPS, ho as validateWorkerAdmissionHandshake } from "./src-4dv5TpeQ.js";
import { i as runServiceUninstall, n as runServiceStart, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-DFuIjMuC.js";
import { t as resolveMcpRequestTimeoutMs } from "./mcp-transport-config-CZdVn5YO.js";
import { i as jsonUtf8BytesOrInfinity, t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { n as createChildAdapter, t as getProcessSupervisor } from "./supervisor-DmhWHZD2.js";
import { t as loadSkillsFromDirSafe } from "./local-loader-DWyFL6N6.js";
import { a as mergeExecApprovalsSocketDefaults } from "./exec-approvals-config-_UJgdeLU.js";
import { A as requiresExecApproval, D as maxAsk, O as minSecurity, S as resolveDurableExecApprovalRequirement, T as commandRequiresSecurityAuditSuppressionApproval, U as resolveExecModePolicy, _ as isExecApprovalPolicySnapshotCurrent, a as resolveExecApprovalsLocked, b as resolveAllowAlwaysPatternCoverage, c as commitExecAuthorizationLocked, i as resolveExecApprovalsFromFile, m as hasDurableExecApproval, n as redactExecApprovals, p as createExecApprovalPolicySnapshot, s as requestJsonlSocket, t as normalizeExecApprovals, x as resolveAllowAlwaysPersistenceDecision } from "./exec-approvals-B5vSSaiI.js";
import { c as readExecApprovalsSnapshot, i as ensureExecApprovalsSnapshot, p as updateExecApprovals } from "./exec-approvals-generated-migration-DfpexxOF.js";
import { n as resolvePlannedSegmentArgv, r as analyzeArgvCommand } from "./exec-approvals-analysis-BvkQXLiO.js";
import "./exec-wrapper-resolution-Et5CIZnS.js";
import { l as describeInterpreterInlineEval } from "./risks-D6ZQ78A6.js";
import { g as planShellAuthorization, i as evaluateShellAllowlistWithAuthorization, t as evaluateExecAllowlist } from "./exec-approvals-allowlist-BNiuHBrn.js";
import { a as collectMcpPaginatedItems, c as redactMcpDiagnosticError, d as disposeMcpClient, f as isStatefulMcpHttpSessionExpired, n as normalizeMcpToolCatalog, o as sanitizeMcpMetadataText, r as isMcpToolAllowed, s as createMcpJsonSchemaValidator, t as resolveMcpTransport, u as connectMcpClient } from "./mcp-transport-D6ND-y3b.js";
import { m as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-VOMUlSYu.js";
import { t as createNodeDuplexEndpoint } from "./node-duplex-framing-DT01SCQw.js";
import { n as NODE_DESKTOP_STREAM_COMMAND, r as NODE_PORTAL_ATTACH_PATH, t as NODE_DESKTOP_ATTACH_PATH } from "./node-desktop-stream-BZM2AiRA.js";
import { t as applyExecPolicyLayer } from "./exec-policy-DnRWVctg.js";
import { r as resolveExecSafeBinRuntimePolicy } from "./exec-safe-bin-runtime-policy-BVSOxLTx.js";
import { t as getMachineDisplayName } from "./machine-name-BOSf0pdX.js";
import { _ as formatExecCommand, l as resolveMutableFileOperandSnapshotSync, o as normalizeSystemRunApprovalPlan, t as APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE, u as revalidateApprovedMutableFileOperand, v as resolveSystemRunCommandRequest } from "./system-run-approval-binding-0Gs8JaF5.js";
import { n as detectPolicyInlineEval } from "./policy-7EVCJmzu.js";
import { a as hashWorkerBundleManifest, t as WORKER_BUNDLE_ENTRY_PATH } from "./worker-bundle-hash-mYTNaYdm.js";
import { t as DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS } from "./worker-bundle-limits-BFwcdQuE.js";
import { r as readWorkerBundleDirectoryManifest, t as extractWorkerBundleArchive } from "./worker-bundle-archive-yl24WAFg.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-Bw07juFU.js";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.js";
import { i as NODE_SKILL_NAME_RE, r as NODE_SKILL_MAX_TOTAL_BYTES, t as NODE_SKILL_MAX_CONTENT_BYTES } from "./node-skill-constraints-DLpuutsb.js";
import { t as decodeClaudeCliNodeRunParams } from "./invoke-agent-cli-claude-params-B2EcHmj9.js";
import { i as buildAuthorizedShellCommandFromPlan, n as captureApprovedCwdSnapshotSync, r as revalidateApprovedCwdSnapshot, t as APPROVAL_CWD_DRIFT_DENIED_MESSAGE } from "./system-run-cwd-binding-ByG_ptRC.js";
import { i as resolveExecAutoReviewDecision } from "./exec-auto-review-Biuf1fPP.js";
import { t as decodePairingSetupCode } from "./setup-code-DpM52__Q.js";
import { a as loadNodeHostConfig, d as resolveNodeHostCloudflareAccess, i as configureNodeHost, l as nodeHostGatewaysShareOrigin, s as nodeHostCloudflareAccessConfigFromEnv } from "./config-BFEkSSSc.js";
import { n as stageTerminalUpload, t as ensureTerminalUploadCleanup } from "./terminal-file-upload-OlwEV8zs.js";
import { t as BoundedBuffer } from "./bounded-buffer-C08_hwby.js";
import { n as probeRfbServer, t as classifyRfbSecurity } from "./rfb-probe-DI5gZAFI.js";
import { t as scanInstalledApps } from "./installed-apps-C_EDA6g_.js";
import { t as listHostDirectories } from "./host-directory-listing-CXs-GH7y.js";
import { a as parseNodeWorkerBundleInstallInput, i as nodeWorkerBundleTransferPath, r as NodeWorkerBundleInstallError, t as NODE_WORKER_BUNDLE_INSTALL_ERROR_CODE } from "./node-bundle-install-protocol-C5qCRbvl.js";
import { i as parseNodeWorkerWorkspaceExecResult, n as NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES, r as parseNodeWorkerWorkspaceExecInput, t as NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES } from "./node-workspace-protocol-DlQjlWdM.js";
import { r as parseNodeWorkerWorkspaceRetainInput } from "./node-workspace-retain-protocol-CVk94Dul.js";
import { a as nodeWorkspaceTransferManifestPath, i as nodeWorkspaceTransferBlobPath, o as nodeWorkspaceTransferPackPath, r as NodeWorkerWorkspaceTransferError, s as nodeWorkspaceTransferReconcilePath, t as NODE_WORKSPACE_TRANSFER_ERROR_CODE } from "./node-workspace-transfer-protocol-BlZMCwT7.js";
import { n as parseWorkerProcessResult } from "./worker-process-protocol-DxScVuGj.js";
import { A as MAX_WORKSPACE_MANIFEST_BYTES, _ as parseWorkerWorkspaceManifest } from "./workspace-actual-manifest-DIThIqhg.js";
import { p as absoluteEntryMatches } from "./workspace-reconcile-Ca4yuu6w.js";
import { f as workerWorkspaceTransferPaths } from "./workspace-result-staging-C1c-gG8N.js";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-5YsdfQ0E.js";
import { _ as migrateLegacyDeviceAuth, g as detectLegacyDeviceAuth, h as detectLegacyDeviceIdentity, n as migrateLegacyExecApprovals, r as migrateLegacyDeviceIdentity, t as detectLegacyExecApprovals } from "./state-migrations.exec-approvals-C4vUpnhZ.js";
import { t as resolveNodeService } from "./node-service-Cnr2v2nE.js";
import fs, { constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto, { createHash, randomUUID } from "node:crypto";
import { execFile, spawn } from "node:child_process";
import { isDeepStrictEqual, promisify } from "node:util";
import net from "node:net";
import { StringDecoder } from "node:string_decoder";
import { addAbortListener, once } from "node:events";
import pLimit from "p-limit";
import { TLSSocket } from "node:tls";
import { WebSocket } from "ws";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ErrorCode, ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";
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
		const cloudflareAccess = params.cloudflareAccessByCandidate?.get(candidate);
		const candidateClient = new GatewayClient({
			...params.clientOptions,
			url,
			tlsFingerprint: candidate.tlsFingerprint,
			...cloudflareAccess ? { edgeAuthHeaders: buildCloudflareAccessHeaders(cloudflareAccess) } : {},
			onEvent: (event) => {
				if (currentCandidateIndex === candidateIndex) params.onEvent(event);
			},
			onHelloOk: (hello) => {
				if (currentCandidateIndex !== candidateIndex) return;
				if (!winnerSelected) {
					winnerSelected = true;
					params.onWinningCandidate(candidate);
				}
				params.onHelloOk(hello, url, candidate.tlsFingerprint, cloudflareAccess);
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
//#region src/node-host/gateway-platform-identity.ts
function resolveNodeHostGatewayPlatformIdentity(platform) {
	switch (platform) {
		case "darwin": return {
			platform: "macos",
			deviceFamily: "Mac"
		};
		case "win32": return {
			platform: "windows",
			deviceFamily: "Windows"
		};
		case "linux": return {
			platform: "linux",
			deviceFamily: "Linux"
		};
		default: return { platform: "unknown" };
	}
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
	const paramsJSON = typeof obj.paramsJSON === "string" ? obj.paramsJSON : obj.params !== void 0 ? JSON.stringify(obj.params) : null;
	const timeoutMs = typeof obj.timeoutMs === "number" ? obj.timeoutMs : null;
	const idempotencyKey = typeof obj.idempotencyKey === "string" ? obj.idempotencyKey : null;
	const sessionKey = normalizeOptionalString(obj.sessionKey);
	return {
		id,
		nodeId,
		command,
		paramsJSON,
		timeoutMs,
		idempotencyKey,
		...sessionKey ? { sessionKey } : {}
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
//#region src/worker/node-desktop-protocol.ts
const REQUEST_MAX_BYTES$1 = 16 * 1024;
const PATH_MAX_BYTES = 4 * 1024;
const TICKET_PATTERN$2 = /^[a-f0-9]{48}$/u;
function parseJson(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > REQUEST_MAX_BYTES$1) throw new Error("INVALID_REQUEST: invalid node worker desktop request");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed node worker desktop request");
	}
}
function hasExactKeys(value, required, optional = []) {
	const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
	return required.every((key) => Object.hasOwn(value, key)) && Object.keys(value).every((key) => allowed.has(key));
}
function isValidPort(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= 65535;
}
function requireAbsolutePath(value, label) {
	if (typeof value !== "string" || !path.isAbsolute(value) || value.includes("\0") || Buffer.byteLength(value, "utf8") > PATH_MAX_BYTES) throw new Error(`INVALID_REQUEST: ${label} must be a bounded absolute path`);
	return value;
}
function parseNodeWorkerDesktopStreamInput(raw) {
	const value = parseJson(raw);
	if (!isRecord(value) || !hasExactKeys(value, [
		"ticket",
		"attachPath",
		"port"
	], ["passwordFilePath"])) throw new Error("INVALID_REQUEST: invalid node worker desktop stream request");
	const ticket = value.ticket;
	const attachPath = value.attachPath;
	if (typeof ticket !== "string" || !TICKET_PATTERN$2.test(ticket) || attachPath !== `/node-desktop/attach?ticket=${ticket}` || !isValidPort(value.port)) throw new Error("INVALID_REQUEST: invalid node worker desktop stream request");
	const passwordFilePath = value.passwordFilePath === void 0 ? void 0 : requireAbsolutePath(value.passwordFilePath, "passwordFilePath");
	return {
		ticket,
		attachPath,
		port: value.port,
		...passwordFilePath ? { passwordFilePath } : {}
	};
}
function parseNodeWorkerDesktopLaunchInput(raw) {
	const value = parseJson(raw);
	if (!isRecord(value) || value.id !== "browser" && value.id !== "terminal") throw new Error("INVALID_REQUEST: invalid node worker desktop app descriptor");
	const executablePath = requireAbsolutePath(value.executablePath, "executablePath");
	if (value.id === "terminal") {
		if (!hasExactKeys(value, ["id", "executablePath"])) throw new Error("INVALID_REQUEST: invalid node worker terminal descriptor");
		return {
			id: "terminal",
			executablePath
		};
	}
	if (!hasExactKeys(value, [
		"id",
		"executablePath",
		"cdpPort"
	]) || !isValidPort(value.cdpPort)) throw new Error("INVALID_REQUEST: invalid node worker browser descriptor");
	return {
		id: "browser",
		executablePath,
		cdpPort: value.cdpPort
	};
}
//#endregion
//#region src/node-host/node-stream-transport.ts
const MAX_PAYLOAD_BYTES = 1024 * 1024;
const PAUSE_BUFFERED_BYTES = 4 * 1024 * 1024;
const RESUME_CHECK_MS = 25;
function websocketDataBuffer(data) {
	if (Buffer.isBuffer(data)) return data;
	if (Array.isArray(data)) return Buffer.concat(data);
	return Buffer.from(data);
}
function attachWebSocketUrl(params) {
	const gateway = new URL(params.gatewayUrl);
	const url = new URL(params.attachPath, gateway);
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error(`${params.streamName} stream gateway URL must use WebSocket transport`);
	if (url.origin !== gateway.origin || url.pathname !== params.expectedAttachPath) throw new Error(`${params.streamName} stream attachPath must stay on the connected gateway`);
	url.pathname = `${gateway.pathname.replace(/\/$/u, "")}${url.pathname}`;
	return url.toString();
}
function assertTlsSocketFingerprint(socket, expectedRaw) {
	const expected = normalizeTlsFingerprint(expectedRaw);
	const actual = normalizeTlsFingerprint(socket.getPeerCertificate().fingerprint256 ?? "");
	if (!expected || !actual || actual !== expected) throw new Error("gateway TLS fingerprint mismatch");
}
function createPinnedRequestFinisher(expected) {
	return (request) => {
		request.once("socket", (socket) => {
			if (!(socket instanceof TLSSocket)) {
				request.destroy(/* @__PURE__ */ new Error("gateway TLS fingerprint mismatch"));
				return;
			}
			socket.once("secureConnect", () => {
				try {
					assertTlsSocketFingerprint(socket, expected);
					request.end();
				} catch (error) {
					request.destroy(error instanceof Error ? error : new Error(String(error)));
				}
			});
		});
	};
}
function websocketOptions(url, tlsFingerprint, cloudflareAccess) {
	const edgeHeaders = cloudflareAccess ? { headers: buildCloudflareAccessHeaders(cloudflareAccess) } : {};
	if (!url.startsWith("wss:") || !tlsFingerprint?.trim()) return {
		maxPayload: MAX_PAYLOAD_BYTES,
		...edgeHeaders
	};
	return {
		maxPayload: MAX_PAYLOAD_BYTES,
		...edgeHeaders,
		rejectUnauthorized: false,
		finishRequest: createPinnedRequestFinisher(tlsFingerprint)
	};
}
function assertGatewayTlsFingerprint(socket, expectedRaw) {
	if (!expectedRaw?.trim()) return;
	const expected = normalizeTlsFingerprint(expectedRaw);
	const actual = normalizeTlsFingerprint(socket?.getPeerCertificate().fingerprint256 ?? "");
	if (!expected || !actual || actual !== expected) throw new Error("gateway TLS fingerprint mismatch");
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
function createNodeStreamSplice(params) {
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
				finish(/* @__PURE__ */ new Error(`gateway sent non-binary ${params.streamName} stream data`));
				return;
			}
			if (!params.socket.write(websocketDataBuffer(data))) {
				params.ws.pause();
				params.socket.once("drain", () => params.ws.resume());
			}
		});
		params.socket.on("data", (chunk) => {
			if (params.ws.readyState !== WebSocket.OPEN) return;
			params.ws.send(chunk, { binary: true }, (error) => error && finish(error));
			if (params.ws.bufferedAmount <= PAUSE_BUFFERED_BYTES || resumeTimer) return;
			params.socket.pause();
			resumeTimer = setInterval(() => {
				if (params.ws.bufferedAmount <= PAUSE_BUFFERED_BYTES) {
					clearInterval(resumeTimer);
					resumeTimer = void 0;
					params.socket.resume();
				}
			}, RESUME_CHECK_MS);
			resumeTimer.unref?.();
		});
		params.ws.once("close", () => finish());
		params.ws.once("error", (error) => finish(error));
		params.socket.once("close", () => finish());
		params.socket.once("error", (error) => finish(error));
	});
	done.catch(() => void 0);
	return {
		done,
		start() {
			if (params.socket.destroyed || params.ws.readyState !== WebSocket.OPEN) {
				finish();
				return;
			}
			params.socket.resume();
			params.ws.resume();
		}
	};
}
/** Pairs an enrolled Gateway attach socket with a node-owned loopback connection. */
async function runNodeStreamTransport(params) {
	const socket = params.connectAfterGatewayAttach ? new net.Socket() : net.createConnection(params.port, "127.0.0.1");
	socket.pause();
	const wsUrl = attachWebSocketUrl(params);
	const ws = new WebSocket(wsUrl, websocketOptions(wsUrl, params.gatewayTlsFingerprint, params.gatewayCloudflareAccess));
	let gatewayTlsSocket;
	ws.once("upgrade", (response) => {
		if (response.socket instanceof TLSSocket) gatewayTlsSocket = response.socket;
	});
	let aborted = params.signal.aborted;
	let resolveAbort;
	const abort = new Promise((resolve) => {
		resolveAbort = resolve;
	});
	const onAbort = () => {
		aborted = true;
		socket.destroy();
		ws.terminate();
		resolveAbort();
	};
	params.signal.addEventListener("abort", onAbort, { once: true });
	if (aborted) onAbort();
	try {
		if (params.connectAfterGatewayAttach) {
			await Promise.race([waitForWebSocketOpen(ws), abort]);
			if (!aborted) {
				socket.connect({
					port: params.port,
					host: "localhost",
					autoSelectFamily: true
				});
				await Promise.race([waitForSocketConnect(socket), abort]);
			}
		} else await Promise.race([Promise.all([waitForSocketConnect(socket), waitForWebSocketOpen(ws)]), abort]);
		if (aborted) return;
		assertGatewayTlsFingerprint(gatewayTlsSocket, params.gatewayTlsFingerprint);
		ws.pause();
		const splice = createNodeStreamSplice({
			socket,
			ws,
			streamName: params.streamName
		});
		await sendAttachMetadata(ws, params.metadata);
		params.emitStatus?.(`${params.streamName} stream attached\n`).catch(() => void 0);
		splice.start();
		await splice.done;
	} catch (error) {
		if (!aborted) throw error;
	} finally {
		params.signal.removeEventListener("abort", onAbort);
		socket.destroy();
		if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close();
	}
}
//#endregion
//#region src/node-host/desktop-stream-command.ts
const DEFAULT_DESKTOP_PORT = 5900;
const PROBE_TIMEOUT_MS = 1500;
const TICKET_PATTERN$1 = /^[a-f0-9]{48}$/u;
const MAX_VNC_PASSWORD_BYTES = 4 * 1024;
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
	if (!TICKET_PATTERN$1.test(ticket) || attachPath !== `/node-desktop/attach?ticket=${ticket}`) throw new Error("INVALID_REQUEST: desktop stream ticket and attachPath required");
	if (new URL(attachPath, "http://127.0.0.1").searchParams.get("ticket") !== ticket) throw new Error("INVALID_REQUEST: desktop stream ticket does not match attachPath");
	if (Object.keys(value).some((key) => key !== "ticket" && key !== "attachPath")) throw new Error("INVALID_REQUEST: desktop stream params contain unsupported fields");
	return {
		ticket,
		attachPath
	};
}
async function readVncPassword(passwordFile, signal) {
	if (!passwordFile) return;
	signal.throwIfAborted();
	const handle = await fs$1.open(passwordFile, constants.O_RDONLY | constants.O_NONBLOCK);
	const buffer = Buffer.alloc(4097);
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) throw new Error("desktop password file must be a regular file");
		if (stat.size > MAX_VNC_PASSWORD_BYTES) throw new Error("desktop password file is too large");
		signal.throwIfAborted();
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
		signal.throwIfAborted();
		if (bytesRead > MAX_VNC_PASSWORD_BYTES) throw new Error("desktop password file is too large");
		const password = buffer.subarray(0, bytesRead).toString("utf8").replace(/[\r\n]+$/u, "");
		if (!password) throw new Error("desktop password file is empty");
		registerSecretValueForRedaction(password);
		return password;
	} finally {
		buffer.fill(0);
		await handle.close();
	}
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
	const vncPassword = auth === "vnc-password" ? await readVncPassword(params.passwordFile, params.signal) : void 0;
	if (params.signal.aborted) return;
	await runNodeStreamTransport({
		gatewayUrl: params.gatewayUrl,
		gatewayTlsFingerprint: params.gatewayTlsFingerprint,
		gatewayCloudflareAccess: params.gatewayCloudflareAccess,
		attachPath: params.command.attachPath,
		expectedAttachPath: NODE_DESKTOP_ATTACH_PATH,
		port: params.target.port,
		metadata: {
			auth,
			...vncPassword ? { vncPassword } : {}
		},
		streamName: "desktop",
		signal: params.signal,
		emitStatus: params.emitStatus
	});
}
/** Runs the built-in command against the node-local desktop configuration. */
async function invokeNodeDesktopStream(params) {
	if (!params.gatewayUrl || !params.signal) throw new Error("desktop stream gateway connection is unavailable");
	if (params.config?.enabled !== true) throw new Error("desktop host streaming is disabled on this node");
	await runNodeDesktopStreamCommand({
		command: decodeDesktopStreamParams(params.paramsJSON),
		gatewayUrl: params.gatewayUrl,
		...params.gatewayTlsFingerprint ? { gatewayTlsFingerprint: params.gatewayTlsFingerprint } : {},
		...params.gatewayCloudflareAccess ? { gatewayCloudflareAccess: params.gatewayCloudflareAccess } : {},
		target: {
			host: "127.0.0.1",
			port: params.config.port ?? DEFAULT_DESKTOP_PORT
		},
		...params.config.passwordFile ? { passwordFile: params.config.passwordFile } : {},
		signal: params.signal,
		...params.emitStatus ? { emitStatus: params.emitStatus } : {}
	});
}
/** Runs the private worker command against provider-attested loopback RFB facts. */
async function invokeNodeWorkerDesktopStream(params) {
	if (!params.gatewayUrl || !params.signal) throw new Error("node worker desktop gateway connection is unavailable");
	const command = parseNodeWorkerDesktopStreamInput(params.paramsJSON);
	await runNodeDesktopStreamCommand({
		command,
		gatewayUrl: params.gatewayUrl,
		...params.gatewayTlsFingerprint ? { gatewayTlsFingerprint: params.gatewayTlsFingerprint } : {},
		...params.gatewayCloudflareAccess ? { gatewayCloudflareAccess: params.gatewayCloudflareAccess } : {},
		target: {
			host: "127.0.0.1",
			port: command.port
		},
		...command.passwordFilePath ? { passwordFile: command.passwordFilePath } : {},
		signal: params.signal
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
		const supervisor = getProcessSupervisor();
		const runId = randomUUID();
		let cancelled = false;
		let truncated = false;
		let outputBytes = 0;
		let stderr = "";
		let terminalLineBuffer = "";
		let terminalLineTouchesTruncation = false;
		let terminalResultLine;
		const decoder = new StringDecoder("utf8");
		const stderrDecoder = new StringDecoder("utf8");
		const terminalDecoder = new StringDecoder("utf8");
		const progress = createNodeInvokeProgressWriter({
			client: params.client,
			frame: params.frame,
			idleTimeoutMs: params.request.idleTimeoutMs,
			onError: () => supervisor.cancel(runId)
		});
		const abortRun = () => {
			cancelled = true;
			supervisor.cancel(runId);
		};
		const retain = (chunk) => {
			const remaining = Math.max(0, OUTPUT_CAP_BYTES - outputBytes);
			const retained = chunk.subarray(0, remaining);
			outputBytes += retained.length;
			truncated ||= retained.length !== chunk.length;
			return retained;
		};
		const captureTerminalLines = (raw, touchesTruncation) => {
			terminalLineBuffer += terminalDecoder.write(raw);
			terminalLineTouchesTruncation ||= touchesTruncation;
			for (let newline = terminalLineBuffer.indexOf("\n"); newline >= 0;) {
				const line = terminalLineBuffer.slice(0, newline).replace(/\r$/u, "");
				terminalLineBuffer = terminalLineBuffer.slice(newline + 1);
				if (terminalLineTouchesTruncation && Buffer.byteLength(line, "utf8") <= TERMINAL_EVENT_MAX_BYTES && isClaudeResultLine(line)) terminalResultLine = line;
				terminalLineTouchesTruncation = touchesTruncation;
				newline = terminalLineBuffer.indexOf("\n");
			}
			if (Buffer.byteLength(terminalLineBuffer, "utf8") > TERMINAL_EVENT_MAX_BYTES) {
				terminalLineBuffer = "";
				terminalLineTouchesTruncation = false;
			}
		};
		let exit;
		let runError;
		params.signal?.addEventListener("abort", abortRun, { once: true });
		try {
			const runPromise = supervisor.spawn({
				runId,
				sessionId: params.request.sessionKey ?? params.frame.id,
				backendId: "node-host-claude",
				mode: "child",
				argv,
				cwd: params.cwd,
				env: params.env,
				exactEnv: true,
				input: params.request.stdin ?? "",
				secretInput: params.secretInput,
				timeoutMs: params.timeoutMs ?? params.request.timeoutMs,
				noOutputTimeoutMs: params.request.idleTimeoutMs,
				captureOutput: false,
				onStdoutRaw: (raw) => {
					const retained = retain(raw);
					captureTerminalLines(retained, false);
					if (retained.length < raw.length) captureTerminalLines(raw.subarray(retained.length), true);
					if (retained.length === 0) {
						progress.queueHeartbeat();
						return;
					}
					progress.write(decoder.write(retained));
				},
				onStderrRaw: (raw) => {
					retain(raw);
					stderr = truncateUtf8Suffix(`${stderr}${stderrDecoder.write(raw)}`, STDERR_TAIL_BYTES);
					progress.queueHeartbeat();
				}
			});
			if (params.signal?.aborted) abortRun();
			const run = await runPromise;
			if (promptDir && run.waitForExtinction) {
				const ownedPromptDir = promptDir;
				promptDir = void 0;
				run.waitForExtinction().then(() => fs$1.rm(ownedPromptDir, {
					recursive: true,
					force: true
				})).catch((error) => {
					logWarn(`Claude CLI system prompt cleanup failed: ${String(error)}`);
				});
			}
			exit = await run.wait();
		} catch (error) {
			runError = error instanceof Error ? error : new Error(String(error));
		} finally {
			params.signal?.removeEventListener("abort", abortRun);
			progress.stopHeartbeats();
		}
		progress.write(decoder.end());
		terminalLineBuffer += terminalDecoder.end();
		stderr = truncateUtf8Suffix(`${stderr}${stderrDecoder.end()}`, STDERR_TAIL_BYTES);
		if (terminalLineTouchesTruncation && Buffer.byteLength(terminalLineBuffer, "utf8") <= TERMINAL_EVENT_MAX_BYTES && isClaudeResultLine(terminalLineBuffer)) terminalResultLine = terminalLineBuffer;
		if (truncated && terminalResultLine) progress.write(`\n${terminalResultLine}\n`);
		await progress.flush();
		progress.stop();
		const idleTimedOut = !cancelled && exit?.noOutputTimedOut === true;
		const timedOut = !cancelled && exit?.timedOut === true;
		const timeoutMessage = idleTimedOut ? "Claude CLI produced no output before the idle timeout" : timedOut ? "Claude CLI exceeded the hard timeout" : "";
		const finalError = progress.error ?? runError;
		return {
			exitCode: cancelled ? 130 : exit?.exitCode ?? (timedOut ? 124 : 1),
			timedOut,
			noOutputTimedOut: idleTimedOut,
			success: exit?.exitCode === 0 && !timedOut && !cancelled && !finalError,
			stdout: "",
			stderr: truncateUtf8Suffix([
				stderr,
				timeoutMessage,
				cancelled ? "Claude CLI invocation cancelled" : "",
				finalError?.message
			].filter(Boolean).join("\n"), STDERR_TAIL_BYTES),
			error: finalError?.message ?? null,
			truncated
		};
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
/** Builds and revalidates system.run approval plans for cwd and executable paths. */
function shouldPinExecutableForApproval(params) {
	return params.shellCommand === null && (params.wrapperChain?.length ?? 0) === 0;
}
function hardenApprovedExecutionPaths(params) {
	if (!params.approvedByAsk) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: params.cwd,
		approvedCwdSnapshot: void 0
	};
	let hardenedCwd = params.cwd ?? process.cwd();
	const canonicalCwd = captureApprovedCwdSnapshotSync(hardenedCwd);
	if (!canonicalCwd.ok) return canonicalCwd;
	hardenedCwd = canonicalCwd.snapshot.cwd;
	const approvedCwdSnapshot = canonicalCwd.snapshot;
	const resolution = resolveCommandResolutionFromArgv(params.argv, hardenedCwd);
	if (params.argv.length === 0 || !shouldPinExecutableForApproval({
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
	if (!hardening.ok) return hardening;
	const commandText = formatExecCommand(hardening.argv);
	const commandPreview = command.previewText?.trim() && command.previewText.trim() !== commandText ? command.previewText.trim() : null;
	const mutableFileOperand = resolveMutableFileOperandSnapshotSync({
		argv: hardening.argv,
		cwd: hardening.cwd,
		shellCommand: command.shellPayload
	});
	if (!mutableFileOperand.ok) return mutableFileOperand;
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
const APPROVAL_SCRIPT_OPERAND_BINDING_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval missing script operand binding";
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
	const { createModelExecAutoReviewer } = await import("./exec-auto-reviewer-BJmBeUyT.js");
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
	let executionCwd = hardenedPaths.cwd;
	let approvedCwdSnapshot = approvalContextBound ? hardenedPaths.approvedCwdSnapshot : void 0;
	if (security === "allowlist" && !approvedCwdSnapshot) {
		const capturedCwd = captureApprovedCwdSnapshotSync(executionCwd ?? process.cwd());
		if (!capturedCwd.ok) {
			await sendSystemRunDenied(opts, parsed.execution, {
				reason: "approval-required",
				message: capturedCwd.message
			});
			return null;
		}
		executionCwd = capturedCwd.snapshot.cwd;
		approvedCwdSnapshot = capturedCwd.snapshot;
	}
	if ((approvalContextBound || security === "allowlist") && !approvedCwdSnapshot) {
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
		cwd: executionCwd,
		approvalDecision,
		argv: hardenedPaths.argv,
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
	if (phase.approvedCwdSnapshot && !revalidateApprovedCwdSnapshot(phase.approvedCwdSnapshot)) {
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
//#region src/node-host/invoke-mcp-result.ts
const MCP_TEXT_CONTENT_MAX_BYTES = 1024 * 1024;
const MCP_TEXT_TRUNCATION_MARKER = "\n[truncated: MCP text content exceeded 1 MB]";
const MCP_INVOKE_PAYLOAD_MAX_BYTES = 20 * 1024 * 1024;
const MCP_PAYLOAD_TRUNCATION_MARKER = "[truncated: MCP result exceeded 20 MB]";
/** Bounds MCP result content before it crosses node.invoke. */
function boundMcpToolResultPayload(result) {
	const payloadMarker = {
		type: "text",
		text: MCP_PAYLOAD_TRUNCATION_MARKER
	};
	const reservedMarkerBytes = jsonUtf8BytesOrInfinity(payloadMarker) + 1;
	const isError = result.isError === true;
	let usedBytes = jsonUtf8BytesOrInfinity({
		content: [],
		...isError ? { isError } : {}
	});
	let payloadTruncated = false;
	let structuredContent;
	if (result.structuredContent) {
		const prefixBytes = Buffer.byteLength(",\"structuredContent\":");
		const availableBytes = Math.max(0, MCP_INVOKE_PAYLOAD_MAX_BYTES - usedBytes - prefixBytes - reservedMarkerBytes);
		const measured = boundedJsonUtf8Bytes(result.structuredContent, availableBytes);
		if (measured.complete && measured.bytes <= availableBytes) {
			structuredContent = result.structuredContent;
			usedBytes += prefixBytes + measured.bytes;
		} else payloadTruncated = true;
	}
	const mirroredStructuredContent = structuredContent ? JSON.stringify(structuredContent, null, 2) : void 0;
	const normalizedBlocks = result.content.filter((block) => isRecord(block) && (mirroredStructuredContent === void 0 || block.type !== "text" || block.text !== mirroredStructuredContent));
	const totalTextBytes = normalizedBlocks.reduce((total, block) => total + (block.type === "text" && typeof block.text === "string" ? Buffer.byteLength(block.text) : 0), 0);
	let remainingTextBytes = totalTextBytes > MCP_TEXT_CONTENT_MAX_BYTES ? MCP_TEXT_CONTENT_MAX_BYTES - Buffer.byteLength(MCP_TEXT_TRUNCATION_MARKER) : MCP_TEXT_CONTENT_MAX_BYTES;
	let markedTruncated = false;
	const textBoundedContent = [];
	for (const block of normalizedBlocks) {
		if (block.type !== "text" || typeof block.text !== "string") {
			textBoundedContent.push(block);
			continue;
		}
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
	const content = [];
	for (const block of textBoundedContent) {
		const separatorBytes = content.length > 0 ? 1 : 0;
		const availableBytes = Math.max(0, MCP_INVOKE_PAYLOAD_MAX_BYTES - usedBytes - separatorBytes - reservedMarkerBytes);
		const measured = boundedJsonUtf8Bytes(block, availableBytes);
		if (!measured.complete || measured.bytes > availableBytes) {
			payloadTruncated = true;
			continue;
		}
		content.push(block);
		usedBytes += measured.bytes + separatorBytes;
	}
	if (payloadTruncated) content.push(payloadMarker);
	return {
		content,
		...structuredContent ? { structuredContent } : {},
		...isError ? { isError } : {}
	};
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
const NODE_MCP_CONNECT_CONCURRENCY = 6;
const NODE_MCP_RETRY_INITIAL_MS = 250;
const NODE_MCP_RETRY_MAX_MS = 6e4;
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
	return truncateUtf16Safe(redactMcpDiagnosticError(error), NODE_MCP_ERROR_MAX_CHARS);
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
async function listAllTools(client, timeoutMs, shouldInclude, signal) {
	const normalized = normalizeMcpToolCatalog(await collectMcpPaginatedItems({
		label: "MCP tool listing",
		itemLabel: "tools",
		timeoutMs,
		maxPages: NODE_MCP_MAX_LIST_PAGES,
		maxItems: NODE_MCP_MAX_LISTED_TOOLS,
		maxBytes: NODE_MCP_MAX_CATALOG_BYTES,
		signal,
		loadPage: async ({ cursor, requestTimeoutMs, signal: requestSignal }) => {
			const page = await client.request({
				method: "tools/list",
				params: cursor === void 0 ? void 0 : { cursor }
			}, ListToolsResultSchema, {
				timeout: requestTimeoutMs,
				maxTotalTimeout: requestTimeoutMs,
				signal: requestSignal
			});
			return {
				items: page.tools,
				nextCursor: page.nextCursor,
				serializedValue: page
			};
		}
	}), createMcpJsonSchemaValidator(), (toolName) => shouldInclude(toolName) ? "include" : "exclude");
	return {
		tools: normalized.tools,
		metadata: normalized.metadata
	};
}
function disposeNodeHostMcpSession(session) {
	session.abortController.abort(/* @__PURE__ */ new Error("node host MCP session retired"));
	return disposeMcpClient(session);
}
/** Starts process-lifetime MCP server state for the node host. */
async function startNodeHostMcpManager(servers, deps = {}) {
	const warn = deps.warn ?? defaultWarn;
	const createClient = deps.createClient ?? ((_serverName, options) => new Client({
		name: "openclaw-node-host",
		version: VERSION
	}, {
		jsonSchemaValidator: createMcpJsonSchemaValidator(),
		listChanged: { tools: {
			autoRefresh: false,
			debounceMs: 0,
			onChanged: () => options.onToolsChanged()
		} }
	}));
	const resolveTransport = deps.resolveTransport ?? resolveMcpTransport;
	const descriptors = [];
	const connectionAdmission = pLimit(NODE_MCP_CONNECT_CONCURRENCY);
	const lifecycleAbortController = new AbortController();
	const lifecycleSignal = deps.signal ? AbortSignal.any([deps.signal, lifecycleAbortController.signal]) : lifecycleAbortController.signal;
	const states = new Map(listEnabledNodeHostMcpServers(servers).map(([serverName, config]) => [serverName, {
		serverName,
		config,
		listedTools: [],
		work: Promise.resolve(),
		catalogWork: Promise.resolve(),
		refreshQueued: false,
		retryDelayMs: NODE_MCP_RETRY_INITIAL_MS
	}]));
	let closed = false;
	let startupComplete = false;
	const rebuildDescriptors = () => {
		if (closed) return;
		const listedTools = Array.from(states.values()).flatMap((state) => state.listedTools.map((tool) => ({
			serverName: state.serverName,
			tool
		})));
		const next = buildNodeMcpToolDescriptors(listedTools);
		if (next.length < listedTools.length) warn(`node host MCP catalog bounded: published ${next.length} of ${listedTools.length} tools`);
		if (isDeepStrictEqual(descriptors, next)) return;
		descriptors.splice(0, descriptors.length, ...next);
		if (startupComplete) deps.onDescriptorsChanged?.();
	};
	const invalidateCurrent = (state, session) => {
		if (state.current !== session) return false;
		state.current = void 0;
		session.abortController.abort(/* @__PURE__ */ new Error("node host MCP session invalidated"));
		state.listedTools = [];
		rebuildDescriptors();
		return true;
	};
	const enqueueWork = (state, task) => {
		state.work = state.work.then(task, task).catch(() => {});
	};
	const enqueueCatalogWork = (state, task) => {
		const work = state.catalogWork.then(task, task);
		state.catalogWork = work.catch(() => {});
		return work;
	};
	const scheduleRetry = (state) => {
		if (closed || lifecycleSignal.aborted || states.get(state.serverName) !== state || state.retryTimer || state.current) return;
		const delayMs = state.retryDelayMs;
		state.retryDelayMs = Math.min(delayMs * 2, NODE_MCP_RETRY_MAX_MS);
		state.retryTimer = setTimeout(() => {
			state.retryTimer = void 0;
			enqueueWork(state, () => reconnect(state));
		}, delayMs);
		state.retryTimer.unref?.();
	};
	const connectAndList = (state, signal) => connectionAdmission(async () => {
		if (closed || signal.aborted) return;
		let resolved;
		let session;
		try {
			resolved = resolveTransport(state.serverName, state.config);
			if (!resolved) {
				states.delete(state.serverName);
				throw new Error("invalid or unsupported transport");
			}
			let onToolsChanged = () => {};
			const client = createClient(state.serverName, { onToolsChanged: () => onToolsChanged() });
			const createdSession = {
				...resolved,
				client,
				connected: false,
				toolCallTimeoutMs: resolveMcpRequestTimeoutMs(state.config, NODE_MCP_TOOL_CALL_TIMEOUT_MS),
				abortController: new AbortController()
			};
			onToolsChanged = () => {
				if (state.current === createdSession) requestRefresh(state, createdSession);
			};
			session = createdSession;
			state.current = createdSession;
			client.onclose = () => {
				if (createdSession.connected && invalidateCurrent(state, createdSession)) enqueueWork(state, async () => {
					await disposeNodeHostMcpSession(createdSession);
					scheduleRetry(state);
				});
			};
			await connectMcpClient({
				client,
				transport: resolved.transport,
				timeoutMs: resolved.connectionTimeoutMs,
				signal
			});
			if (closed || signal.aborted || state.current !== session) return;
			session.connected = true;
			const listSignal = AbortSignal.any([signal, session.abortController.signal]);
			await enqueueCatalogWork(state, async () => {
				const next = await listAllTools(client, createdSession.requestTimeoutMs, (toolName) => isMcpToolAllowed(state.config.toolFilter, toolName), listSignal);
				if (closed || state.current !== createdSession) return;
				createdSession.toolMetadata = next.metadata;
				state.listedTools = next.tools;
				state.retryDelayMs = NODE_MCP_RETRY_INITIAL_MS;
				rebuildDescriptors();
			});
			await state.catalogWork;
		} catch (error) {
			const lostOwnership = session !== void 0 && state.current !== session;
			if (session && state.current === session) {
				invalidateCurrent(state, session);
				await disposeNodeHostMcpSession(session);
			} else if (!session) resolved?.detachStderr?.();
			if (closed || signal.aborted || lostOwnership) return;
			throw error;
		}
	});
	async function reconnect(state) {
		if (closed || state.current) return;
		try {
			await connectAndList(state, lifecycleSignal);
		} catch (error) {
			if (!closed && !lifecycleSignal.aborted) {
				warn(`node host MCP server "${state.serverName}" reconnect failed: ${formatMcpError(error)}`);
				scheduleRetry(state);
			}
		}
	}
	const refresh = async (state, session) => {
		if (closed || state.current !== session || !session.connected) return;
		try {
			const next = await listAllTools(session.client, session.requestTimeoutMs, (toolName) => isMcpToolAllowed(state.config.toolFilter, toolName), AbortSignal.any([lifecycleSignal, session.abortController.signal]));
			if (closed || state.current !== session) return;
			session.toolMetadata = next.metadata;
			state.listedTools = next.tools;
			rebuildDescriptors();
		} catch (error) {
			if (closed || lifecycleSignal.aborted || state.current !== session) return;
			warn(`node host MCP server "${state.serverName}" tool refresh failed: ${formatMcpError(error)}`);
			invalidateCurrent(state, session);
			await disposeNodeHostMcpSession(session);
			scheduleRetry(state);
		}
	};
	function requestRefresh(state, session) {
		if (closed || lifecycleSignal.aborted || state.current !== session || !session.connected || state.refreshQueued) return;
		state.refreshQueued = true;
		enqueueCatalogWork(state, async () => {
			state.refreshQueued = false;
			await refresh(state, session);
		}).catch(() => {});
	}
	const tasks = Array.from(states.values(), (state) => async () => {
		if (state.config.auth === "oauth" || state.config.oauth) {
			states.delete(state.serverName);
			warn(`node host MCP server "${state.serverName}" skipped: OAuth is not supported`);
			return;
		}
		try {
			await connectAndList(state, lifecycleSignal);
		} catch (error) {
			if (!lifecycleSignal.aborted) warn(`node host MCP server "${state.serverName}" failed: ${formatMcpError(error)}`);
		}
	});
	await Promise.all(tasks.map((task) => task()));
	startupComplete = true;
	for (const state of states.values()) if (!state.current) scheduleRetry(state);
	return {
		descriptors,
		async callMcpTool(params) {
			const state = states.get(params.server);
			const session = state?.current;
			if (!state || !session?.connected) throw new NodeHostMcpError("MCP_SERVER_UNAVAILABLE", `MCP server "${params.server}" is unavailable`);
			if (!descriptors.some((descriptor) => descriptor.mcp?.server === params.server && descriptor.mcp.tool === params.tool)) throw new NodeHostMcpError("MCP_TOOL_UNAVAILABLE", `MCP tool "${params.tool}" is unavailable on server "${params.server}"`);
			const requestedTimeoutMs = clampPositiveTimerTimeoutMs(params.timeoutMs) ?? 12e4;
			const validateResult = session.toolMetadata?.validatorForCall(params.tool);
			try {
				const result = await session.client.callTool({
					name: params.tool,
					arguments: params.arguments ?? {}
				}, void 0, {
					timeout: Math.min(requestedTimeoutMs, session.toolCallTimeoutMs),
					...params.signal ? { signal: params.signal } : {}
				});
				validateResult?.(result);
				return result;
			} catch (error) {
				const sessionExpired = isStatefulMcpHttpSessionExpired(session, error);
				if (sessionExpired && invalidateCurrent(state, session)) enqueueWork(state, async () => {
					await disposeNodeHostMcpSession(session);
					scheduleRetry(state);
				});
				if (!sessionExpired && (!session.connected || state.current !== session)) throw new NodeHostMcpError("MCP_SERVER_UNAVAILABLE", `MCP server "${params.server}" disconnected`, { cause: error });
				if (error && typeof error === "object" && "code" in error && error.code === ErrorCode.RequestTimeout) throw new NodeHostMcpError("MCP_TOOL_TIMEOUT", formatMcpError(error), { cause: error });
				throw new NodeHostMcpError("MCP_TOOL_ERROR", formatMcpError(error), { cause: error });
			}
		},
		async close() {
			if (closed) return;
			closed = true;
			lifecycleAbortController.abort(/* @__PURE__ */ new Error("node host MCP manager closed"));
			const closing = Array.from(states.values(), async (state) => {
				if (state.retryTimer) {
					clearTimeout(state.retryTimer);
					state.retryTimer = void 0;
				}
				const session = state.current;
				state.current = void 0;
				state.listedTools = [];
				if (session) await disposeNodeHostMcpSession(session);
				await state.work;
				await state.catalogWork;
			});
			await Promise.allSettled(closing);
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
//#region src/node-host/desktop-launch-command.ts
const DESKTOP_LAUNCH_TIMEOUT_MS = 3e4;
function signalError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("node worker desktop launch aborted");
}
/** Directly runs one provider-attested zero-argument launcher without replay. */
async function invokeNodeWorkerDesktopLaunch(params) {
	const app = parseNodeWorkerDesktopLaunchInput(params.paramsJSON);
	const signal = params.signal;
	signal?.throwIfAborted();
	const child = spawn(app.executablePath, [], {
		shell: false,
		stdio: "ignore",
		windowsHide: true
	});
	await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
			child.off("error", onError);
			child.off("exit", onExit);
			if (error) reject(error);
			else resolve();
		};
		const stop = (error) => {
			try {
				child.kill("SIGKILL");
			} catch {}
			finish(error);
		};
		const onAbort = () => signal && stop(signalError(signal));
		const onError = (error) => finish(error);
		const onExit = (code, terminationSignal) => {
			if (code === 0) {
				finish();
				return;
			}
			finish(/* @__PURE__ */ new Error(terminationSignal ? `node worker desktop launcher terminated by ${terminationSignal}` : `node worker desktop launcher exited with code ${code ?? "unknown"}`));
		};
		const timer = setTimeout(() => stop(/* @__PURE__ */ new Error("node worker desktop launcher timed out")), DESKTOP_LAUNCH_TIMEOUT_MS);
		timer.unref?.();
		child.once("error", onError);
		child.once("exit", onExit);
		signal?.addEventListener("abort", onAbort, { once: true });
		if (signal?.aborted) onAbort();
	});
	return { status: "ready" };
}
//#endregion
//#region src/node-host/node-worker-launch-receipt.ts
function isNodeWorkerTerminalState(value) {
	return value === "completed" || value === "failed" || value === "interrupted" || value === "cancelled";
}
function validateNodeWorkerContainerIdentity(identity) {
	if (identity.engine !== "docker" && identity.engine !== "podman") throw new Error("node worker container engine must be docker or podman");
	if (!/^[a-f0-9]{64}$/u.test(identity.containerId)) throw new Error("node worker container id must contain exactly 64 lowercase hexadecimal digits");
	if (!/^[a-f0-9]{64}$/u.test(identity.engineTarget)) throw new Error("node worker container engine target must contain exactly 64 lowercase hexadecimal digits");
}
function containerIdentity(value) {
	if (value == null) return null;
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		throw new Error("invalid node worker container identity");
	}
	if (!isRecord(parsed) || Object.keys(parsed).length !== 3 || parsed.engine !== "docker" && parsed.engine !== "podman" || typeof parsed.containerId !== "string" || typeof parsed.engineTarget !== "string") throw new Error("invalid node worker container identity");
	const identity = {
		engine: parsed.engine,
		containerId: parsed.containerId,
		engineTarget: parsed.engineTarget
	};
	validateNodeWorkerContainerIdentity(identity);
	return identity;
}
function nodeWorkerLaunchReceiptFromRow(row) {
	if (row.state !== "pending" && row.state !== "running" && !isNodeWorkerTerminalState(row.state)) throw new Error(`invalid node worker launch state ${row.state}`);
	const container = containerIdentity(row.container_json);
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
		supervisor: {
			pid: row.supervisor_pid,
			startTime: row.supervisor_start_time
		},
		worker: row.worker_pid === null || row.worker_start_time === null ? null : {
			pid: row.worker_pid,
			startTime: row.worker_start_time
		},
		...container ? { container } : {},
		resultJson: row.result_json,
		errorText: row.error_text,
		completedAtMs: row.completed_at_ms,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
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
const NODE_WORKER_LAUNCH_CONTAINER_SCHEMA_START = "CREATE TABLE IF NOT EXISTS node_worker_launch_containers (";
const NODE_WORKER_LAUNCH_CONTAINER_SCHEMA_END = "\n) STRICT;";
const initializedDatabases$1 = /* @__PURE__ */ new WeakSet();
const TERMINAL_RECEIPT_RETENTION_MS$1 = 1440 * 60 * 1e3;
const TERMINAL_PRUNE_BATCH_LIMIT$1 = 256;
function ensureNodeWorkerLaunchSchema(database, kind = "journal") {
	const startMarker = kind === "journal" ? NODE_WORKER_LAUNCH_SCHEMA_START : NODE_WORKER_LAUNCH_CONTAINER_SCHEMA_START;
	const endMarker = kind === "journal" ? NODE_WORKER_LAUNCH_SCHEMA_END : NODE_WORKER_LAUNCH_CONTAINER_SCHEMA_END;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(startMarker);
	const end = start >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf(endMarker, start) : -1;
	if (start < 0 || end < start) throw new Error(`OpenClaw node worker launch ${kind} schema marker is missing.`);
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + endMarker.length));
}
function query$1(database) {
	return getNodeSqliteKysely(database);
}
function selectLaunchRows(database) {
	return query$1(database).selectFrom("node_worker_launches").selectAll("node_worker_launches").$if(tableExists(database, "node_worker_launch_containers"), (selection) => selection.leftJoin("node_worker_launch_containers", "node_worker_launch_containers.launch_id", "node_worker_launches.launch_id").select("node_worker_launch_containers.container_json"));
}
function readRow$1(database, launchId) {
	return executeSqliteQueryTakeFirstSync(database, selectLaunchRows(database).where("node_worker_launches.launch_id", "=", launchId));
}
function readNonterminalCount(database) {
	return executeSqliteQueryTakeFirstSync(database, query$1(database).selectFrom("node_worker_launches").select((expression) => expression.fn.countAll().as("count")).where("state", "in", ["pending", "running"]))?.count ?? 0;
}
function readNonterminalRows(database) {
	return executeSqliteQuerySync(database, selectLaunchRows(database).where("node_worker_launches.state", "in", ["pending", "running"]).orderBy("node_worker_launches.launch_id", "asc")).rows;
}
function pruneTerminalRows(params) {
	let candidates = query$1(params.database).selectFrom("node_worker_launches").select("launch_id").where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs).orderBy("completed_at_ms", "asc").orderBy("launch_id", "asc").limit(params.limit);
	if (params.excludeLaunchId) candidates = candidates.where("launch_id", "!=", params.excludeLaunchId);
	const launchIds = executeSqliteQuerySync(params.database, candidates).rows.map((row) => row.launch_id);
	if (launchIds.length === 0) return 0;
	if (tableExists(params.database, "node_worker_launch_containers")) executeSqliteQuerySync(params.database, query$1(params.database).deleteFrom("node_worker_launch_containers").where("launch_id", "in", launchIds));
	const result = executeSqliteQuerySync(params.database, query$1(params.database).deleteFrom("node_worker_launches").where("launch_id", "in", launchIds).where("state", "in", [
		"completed",
		"failed",
		"interrupted",
		"cancelled"
	]).where("completed_at_ms", "<=", params.cutoffMs));
	return Number(result.numAffectedRows ?? 0n);
}
/** Read the authoritative physical owner within an already-open journal transaction. */
function readNodeWorkerLaunchReceipt(database, launchId) {
	if (!tableExists(database, "node_worker_launches")) return;
	const row = readRow$1(database, launchId);
	return row ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
}
/** Physical extinction closes unfinished turns, never a result already recorded by the worker. */
function settleNodeWorkerActiveTurns(database, owner) {
	if (owner.state === "pending" || owner.state === "running" || !tableExists(database, "node_worker_turns")) return;
	executeSqliteQuerySync(database, query$1(database).updateTable("node_worker_turns").set((expression) => {
		const completedAt = expression.fn("max", [
			"created_at_ms",
			"updated_at_ms",
			expression.val(owner.updatedAtMs)
		]);
		return {
			state: owner.state === "completed" ? "interrupted" : owner.state,
			result_json: null,
			error_text: owner.errorText ?? "node worker stopped before its turn completed",
			completed_at_ms: completedAt,
			updated_at_ms: completedAt
		};
	}).where("owner_launch_id", "=", owner.launchId).where("state", "=", "running"));
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
	const row = readRow$1(database, launchId);
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
			if (!initializedDatabases$1.has(db)) {
				ensureNodeWorkerLaunchSchema(db);
				initializedDatabase = db;
			}
			return operation(db);
		}, this.databaseOptions, { operationLabel });
		if (initializedDatabase) initializedDatabases$1.add(initializedDatabase);
		return result;
	}
	claim(claim, supervisor, capacity, nowMs = Date.now()) {
		validateIdentifier(claim.launchId, "node worker launch id");
		validatePlanHash(claim.planHash);
		validateTimestamp(nowMs);
		validateProcessIdentity(supervisor);
		if (!Number.isSafeInteger(capacity) || capacity < 1) throw new Error("node worker capacity must be a positive safe integer");
		const observed = this.write("node-worker-launch.claim-inspect", (database) => readRow$1(database, claim.launchId));
		if (observed && observed.plan_hash !== claim.planHash) throw new Error(`node worker launch ${claim.launchId} was replayed with a different plan`);
		const observedSupervisorState = observed ? inspectNodeWorkerProcessIdentity({
			pid: observed.supervisor_pid,
			startTime: observed.supervisor_start_time
		}) : void 0;
		return this.write("node-worker-launch.claim", (database) => {
			const finalize = (result) => {
				pruneTerminalRows({
					database,
					cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS$1),
					limit: TERMINAL_PRUNE_BATCH_LIMIT$1,
					excludeLaunchId: claim.launchId
				});
				return result;
			};
			let current = readRow$1(database, claim.launchId);
			if (!current) {
				const nonterminalCount = readNonterminalCount(database);
				if (nonterminalCount >= capacity) return finalize({
					action: "at-capacity",
					nonterminalCount
				});
				executeSqliteQuerySync(database, query$1(database).insertInto("node_worker_launches").values({
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
					receipt: nodeWorkerLaunchReceiptFromRow(requireMatchingRow(database, claim.launchId, claim.planHash)),
					nonterminalCount: readNonterminalCount(database)
				});
			}
			if (current.plan_hash !== claim.planHash) throw new Error(`node worker launch ${claim.launchId} was replayed with a different plan`);
			const previousOwnerDefinitelyStale = observedSupervisorState === "dead" || observedSupervisorState === "reused";
			if (current.state === "pending" && observed && sameObservedOwner(current, observed) && previousOwnerDefinitelyStale) {
				const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
				executeSqliteQuerySync(database, query$1(database).updateTable("node_worker_launches").set({
					supervisor_pid: supervisor.pid,
					supervisor_start_time: supervisor.startTime,
					updated_at_ms: updatedAtMs
				}).where("launch_id", "=", claim.launchId).where("plan_hash", "=", claim.planHash).where("state", "=", "pending").where("supervisor_pid", "=", observed.supervisor_pid).where("supervisor_start_time", "=", observed.supervisor_start_time).where("worker_pid", "is", null).where("worker_start_time", "is", null));
				current = requireMatchingRow(database, claim.launchId, claim.planHash);
				return finalize({
					action: rowHasSupervisor(current, supervisor) ? "start" : "replay",
					receipt: nodeWorkerLaunchReceiptFromRow(current),
					nonterminalCount: readNonterminalCount(database)
				});
			}
			if (current.state === "running" && observed && sameObservedOwner(current, observed) && previousOwnerDefinitelyStale) return finalize({
				action: "recover",
				receipt: nodeWorkerLaunchReceiptFromRow(current),
				nonterminalCount: readNonterminalCount(database)
			});
			return finalize({
				action: "replay",
				receipt: nodeWorkerLaunchReceiptFromRow(current),
				nonterminalCount: readNonterminalCount(database)
			});
		});
	}
	listNonterminal() {
		return this.write("node-worker-launch.list-nonterminal", (database) => readNonterminalRows(database).map(nodeWorkerLaunchReceiptFromRow));
	}
	nonterminalCount() {
		return this.write("node-worker-launch.count-nonterminal", readNonterminalCount);
	}
	pruneExpiredTerminal(params = {}) {
		const nowMs = params.nowMs ?? Date.now();
		const limit = params.limit ?? TERMINAL_PRUNE_BATCH_LIMIT$1;
		validateTimestamp(nowMs);
		validatePruneLimit(limit);
		return this.write("node-worker-launch.prune-terminal", (database) => pruneTerminalRows({
			database,
			cutoffMs: Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS$1),
			limit
		}));
	}
	get(launchId) {
		validateIdentifier(launchId, "node worker launch id");
		return this.write("node-worker-launch.get", (database) => {
			const row = readRow$1(database, launchId);
			return row ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
		});
	}
	getMatching(expected) {
		validateIdentifier(expected.launchId, "node worker launch id");
		validatePlanHash(expected.planHash);
		return this.write("node-worker-launch.get-matching", (database) => {
			const row = readRow$1(database, expected.launchId);
			return row && rowMatchesImmutableIdentity(row, expected) ? nodeWorkerLaunchReceiptFromRow(row) : void 0;
		});
	}
	finishCancelled(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		if (params.worker) validateProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish-cancelled", (database) => {
			const current = readRow$1(database, params.expected.launchId);
			if (!current || !rowMatchesImmutableIdentity(current, params.expected)) return;
			if (isNodeWorkerTerminalState(current.state)) {
				const receipt = nodeWorkerLaunchReceiptFromRow(current);
				settleNodeWorkerActiveTurns(database, receipt);
				return receipt;
			}
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, params.worker)) return nodeWorkerLaunchReceiptFromRow(current);
			const completedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			let update = query$1(database).updateTable("node_worker_launches").set({
				state: "cancelled",
				result_json: null,
				error_text: "node worker launch cancelled",
				completed_at_ms: completedAtMs,
				updated_at_ms: completedAtMs
			}).where("launch_id", "=", params.expected.launchId).where("plan_hash", "=", params.expected.planHash).where("environment_id", "=", params.expected.environmentId).where("session_id", "=", params.expected.sessionId).where("owner_epoch", "=", params.expected.ownerEpoch).where("placement_generation", "=", params.expected.placementGeneration).where("run_id", "=", params.expected.runId).where("state", "in", ["pending", "running"]).where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime);
			update = params.worker ? update.where("worker_pid", "=", params.worker.pid).where("worker_start_time", "=", params.worker.startTime) : update.where("worker_pid", "is", null).where("worker_start_time", "is", null);
			executeSqliteQuerySync(database, update);
			const settled = readRow$1(database, params.expected.launchId);
			if (!settled || !rowMatchesImmutableIdentity(settled, params.expected)) return;
			const receipt = nodeWorkerLaunchReceiptFromRow(settled);
			settleNodeWorkerActiveTurns(database, receipt);
			return receipt;
		});
	}
	markRunning(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		validateProcessIdentity(params.worker);
		if (params.container) validateNodeWorkerContainerIdentity(params.container);
		return this.write("node-worker-launch.mark-running", (database) => {
			const current = requireMatchingRow(database, params.launchId, params.planHash);
			if (isNodeWorkerTerminalState(current.state)) return nodeWorkerLaunchReceiptFromRow(current);
			if (current.state === "running") return nodeWorkerLaunchReceiptFromRow(current);
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, null)) return nodeWorkerLaunchReceiptFromRow(current);
			if (params.container) {
				ensureNodeWorkerLaunchSchema(database, "container");
				executeSqliteQuerySync(database, query$1(database).insertInto("node_worker_launch_containers").values({
					launch_id: params.launchId,
					container_json: JSON.stringify({
						engine: params.container.engine,
						containerId: params.container.containerId,
						engineTarget: params.container.engineTarget
					})
				}));
			}
			const updatedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			executeSqliteQuerySync(database, query$1(database).updateTable("node_worker_launches").set({
				state: "running",
				worker_pid: params.worker.pid,
				worker_start_time: params.worker.startTime,
				updated_at_ms: updatedAtMs
			}).where("launch_id", "=", params.launchId).where("plan_hash", "=", params.planHash).where("state", "=", "pending").where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime).where("worker_pid", "is", null).where("worker_start_time", "is", null));
			return nodeWorkerLaunchReceiptFromRow(requireMatchingRow(database, params.launchId, params.planHash));
		});
	}
	finish(params) {
		const nowMs = params.nowMs ?? Date.now();
		validateTimestamp(nowMs);
		validateProcessIdentity(params.supervisor);
		if (params.worker) validateProcessIdentity(params.worker);
		return this.write("node-worker-launch.finish", (database) => {
			const current = requireMatchingRow(database, params.launchId, params.planHash);
			if (isNodeWorkerTerminalState(current.state)) {
				const receipt = nodeWorkerLaunchReceiptFromRow(current);
				settleNodeWorkerActiveTurns(database, receipt);
				return receipt;
			}
			if (!rowHasSupervisor(current, params.supervisor) || !rowHasWorker(current, params.worker)) return nodeWorkerLaunchReceiptFromRow(current);
			const completedAtMs = Math.max(nowMs, current.created_at_ms, current.updated_at_ms);
			let update = query$1(database).updateTable("node_worker_launches").set({
				state: params.state,
				result_json: params.state === "completed" ? params.resultJson ?? null : null,
				error_text: params.state === "completed" ? null : params.errorText ?? null,
				completed_at_ms: completedAtMs,
				updated_at_ms: completedAtMs
			}).where("launch_id", "=", params.launchId).where("plan_hash", "=", params.planHash).where("state", "in", ["pending", "running"]).where("supervisor_pid", "=", params.supervisor.pid).where("supervisor_start_time", "=", params.supervisor.startTime);
			update = params.worker ? update.where("worker_pid", "=", params.worker.pid).where("worker_start_time", "=", params.worker.startTime) : update.where("worker_pid", "is", null).where("worker_start_time", "is", null);
			executeSqliteQuerySync(database, update);
			const receipt = nodeWorkerLaunchReceiptFromRow(requireMatchingRow(database, params.launchId, params.planHash));
			settleNodeWorkerActiveTurns(database, receipt);
			return receipt;
		});
	}
};
//#endregion
//#region src/node-host/node-worker-capacity.ts
const DEFAULT_CAPACITY_WAIT_MS = 1e4;
const CAPACITY_POLL_MS = 100;
function capacityAbortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("node worker admission aborted");
}
function resolveDefaultWorkerCapacity() {
	const availableParallelism = typeof os.availableParallelism === "function" ? os.availableParallelism() : os.cpus().length;
	return Math.min(NODE_WORKER_CAPACITY_MAX, Math.max(1, availableParallelism));
}
var NodeWorkerCapacityExhaustedError = class extends Error {
	constructor(waitMs) {
		super(`node worker capacity remained full for ${waitMs} ms`);
		this.code = NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE;
		this.name = "NodeWorkerCapacityExhaustedError";
	}
};
/** Owns durable worker slot admission and exact live capacity publication. */
var NodeWorkerCapacity = class {
	constructor(store, options = {}) {
		this.store = store;
		this.waiters = /* @__PURE__ */ new Set();
		this.closeAbort = new AbortController();
		this.capacity = options.capacity ?? resolveDefaultWorkerCapacity();
		this.waitMs = options.capacityWaitMs ?? DEFAULT_CAPACITY_WAIT_MS;
		this.onCapacityChanged = options.onCapacityChanged;
		if (!Number.isSafeInteger(this.capacity) || this.capacity < 1 || this.capacity > 1024) throw new Error(`node worker capacity must be between 1 and ${NODE_WORKER_CAPACITY_MAX}`);
		this.publishedCapacity = Object.freeze({
			total: this.capacity,
			available: 0
		});
		if (!Number.isSafeInteger(this.waitMs) || this.waitMs < 0) throw new Error("node worker capacity wait must be a non-negative safe integer");
	}
	async initialize(recoverRunning) {
		this.onCapacityChanged?.(this.publishedCapacity);
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
		this.refresh(true);
	}
	async claim(claim, supervisor, signal) {
		const deadlineMs = Date.now() + this.waitMs;
		while (true) {
			if (this.closeAbort.signal.aborted) throw new Error("node worker supervisor is closed");
			signal?.throwIfAborted();
			const result = this.store.claim(claim, supervisor, this.capacity);
			this.publishCount(result.nonterminalCount);
			if (result.action !== "at-capacity") return result;
			await this.wait(deadlineMs, signal);
		}
	}
	finish(params, notify = true) {
		const receipt = this.store.finish(params);
		if (notify && receipt.state !== "pending" && receipt.state !== "running") this.changed();
		return receipt;
	}
	finishCancelled(params) {
		const receipt = this.store.finishCancelled(params);
		if (receipt && receipt.state !== "pending" && receipt.state !== "running") this.changed();
		return receipt;
	}
	close() {
		this.closeAbort.abort();
		this.wake();
	}
	publishCount(nonterminalCount, force = false) {
		const available = Math.max(0, this.capacity - nonterminalCount);
		if (!force && this.publishedCapacity.available === available) return;
		this.publishedCapacity = Object.freeze({
			total: this.capacity,
			available
		});
		this.onCapacityChanged?.(this.publishedCapacity);
	}
	refresh(force = false) {
		const count = this.store.nonterminalCount();
		this.publishCount(count, force);
		if (count < this.capacity) this.wake();
	}
	changed() {
		this.wake();
		try {
			this.refresh();
		} catch {
			this.publishCount(this.capacity);
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
//#region src/node-host/portal-stream-command.ts
const REQUEST_MAX_BYTES = 16 * 1024;
const TICKET_PATTERN = /^[a-f0-9]{48}$/u;
function parseNodeWorkerPortalStreamInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker portal stream request");
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed node worker portal stream request");
	}
	if (!isRecord(value) || Object.keys(value).length !== 3 || typeof value.ticket !== "string" || !TICKET_PATTERN.test(value.ticket) || value.attachPath !== `/node-portal/attach?ticket=${value.ticket}` || typeof value.port !== "number" || !Number.isSafeInteger(value.port) || value.port < 1 || value.port > 65535) throw new Error("INVALID_REQUEST: invalid node worker portal stream request");
	return {
		ticket: value.ticket,
		attachPath: value.attachPath,
		port: value.port
	};
}
/** Runs a private worker portal stream against its exact enrolled Gateway owner. */
async function invokeNodeWorkerPortalStream(params) {
	if (!params.gatewayUrl || !params.signal) throw new Error("node worker portal gateway connection is unavailable");
	const command = parseNodeWorkerPortalStreamInput(params.paramsJSON);
	await runNodeStreamTransport({
		gatewayUrl: params.gatewayUrl,
		gatewayTlsFingerprint: params.gatewayTlsFingerprint,
		gatewayCloudflareAccess: params.gatewayCloudflareAccess,
		attachPath: command.attachPath,
		expectedAttachPath: NODE_PORTAL_ATTACH_PATH,
		port: command.port,
		metadata: { ok: true },
		streamName: "portal",
		signal: params.signal,
		connectAfterGatewayAttach: true
	});
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
		...gateway.protocol === "wss:" && params.gatewayTlsFingerprint ? { tlsFingerprint: params.gatewayTlsFingerprint } : {},
		...params.gatewayCloudflareAccess ? { cloudflareAccess: params.gatewayCloudflareAccess } : {}
	});
	if (!endpoint) throw new Error("node worker gateway connection could not form a worker endpoint");
	return endpoint;
}
/** Dispatches the non-advertised worker control contract before public node commands. */
async function invokeNodeWorkerSupervisorCommand(params) {
	if (!(params.command === "worker.bundle.install.v1" || params.command === "worker.launch.v1" || params.command === "worker.status.v1" || params.command === "worker.cancel.v1" || params.command === "worker.environment.stop.v1" || params.command === "worker.workspace.exec.v1" || params.command === "worker.workspace.retain.v1" || params.command === "worker.desktop.stream.v1" || params.command === "worker.desktop.launch.v1" || params.command === "worker.portal.stream.v1")) return { handled: false };
	if (params.command === "worker.bundle.install.v1" && !params.bundleInstaller || params.command === "worker.workspace.exec.v1" && !params.workspace || params.command === "worker.workspace.retain.v1" && !params.supervisor || params.command !== "worker.bundle.install.v1" && params.command !== "worker.workspace.exec.v1" && params.command !== "worker.workspace.retain.v1" && !params.supervisor) return {
		handled: true,
		ok: false,
		code: "UNAVAILABLE",
		message: "node worker runtime unavailable"
	};
	try {
		if (params.command === "worker.bundle.install.v1") {
			if (!params.gatewayUrl) throw new Error("node worker gateway connection unavailable");
			return {
				handled: true,
				ok: true,
				payload: await params.bundleInstaller.ensure({
					input: parseNodeWorkerBundleInstallInput(params.paramsJSON),
					gatewayUrl: params.gatewayUrl,
					...params.gatewayTlsFingerprint ? { gatewayTlsFingerprint: params.gatewayTlsFingerprint } : {},
					...params.gatewayCloudflareAccess ? { gatewayCloudflareAccess: params.gatewayCloudflareAccess } : {},
					signal: params.signal
				})
			};
		}
		if (params.command === "worker.workspace.exec.v1") return {
			handled: true,
			ok: true,
			payload: await params.workspace.exec(parseNodeWorkerWorkspaceExecInput(params.paramsJSON), params.signal, params.gatewayUrl ? {
				url: params.gatewayUrl,
				...params.gatewayTlsFingerprint ? { tlsFingerprint: params.gatewayTlsFingerprint } : {},
				...params.gatewayCloudflareAccess ? { cloudflareAccess: params.gatewayCloudflareAccess } : {}
			} : void 0)
		};
		if (params.command === "worker.workspace.retain.v1") {
			const input = parseNodeWorkerWorkspaceRetainInput(params.paramsJSON);
			const workspace = await params.supervisor.retainWorkspaces(input, params.signal);
			let bundles;
			if (workspace.applied && input.bundleHashes) {
				if (!params.bundleInstaller?.retain) throw new Error("node worker bundle retention unavailable");
				bundles = await params.bundleInstaller.retain({
					gatewayNamespace: input.gatewayNamespace,
					bundleHashes: input.bundleHashes,
					...input.acknowledgedBundleGeneration !== void 0 ? { acknowledgedGeneration: input.acknowledgedBundleGeneration } : {}
				});
			}
			const hasMore = workspace.hasMore || bundles?.hasMore === true;
			const inspectBundle = params.bundleInstaller?.inspect?.bind(params.bundleInstaller);
			if (workspace.applied && input.bundleStatusHash && !hasMore && !inspectBundle) throw new Error("node worker bundle status unavailable");
			const bundleStatus = workspace.applied && input.bundleStatusHash && !hasMore && inspectBundle ? await inspectBundle({
				gatewayNamespace: input.gatewayNamespace,
				bundleHash: input.bundleStatusHash
			}) : void 0;
			return {
				handled: true,
				ok: true,
				payload: bundles || bundleStatus ? {
					...workspace,
					...bundles ? {
						bundleDeleted: bundles.deleted,
						bundleGeneration: bundles.generation,
						hasMore
					} : {},
					...bundleStatus ? { bundleStatus } : {}
				} : workspace
			};
		}
		if (params.command === "worker.desktop.stream.v1") {
			await invokeNodeWorkerDesktopStream({
				paramsJSON: params.paramsJSON,
				gatewayUrl: params.gatewayUrl,
				gatewayTlsFingerprint: params.gatewayTlsFingerprint,
				gatewayCloudflareAccess: params.gatewayCloudflareAccess,
				signal: params.signal
			});
			return {
				handled: true,
				ok: true,
				payload: null
			};
		}
		if (params.command === "worker.portal.stream.v1") {
			await invokeNodeWorkerPortalStream({
				paramsJSON: params.paramsJSON,
				gatewayUrl: params.gatewayUrl,
				gatewayTlsFingerprint: params.gatewayTlsFingerprint,
				gatewayCloudflareAccess: params.gatewayCloudflareAccess,
				signal: params.signal
			});
			return {
				handled: true,
				ok: true,
				payload: null
			};
		}
		if (params.command === "worker.desktop.launch.v1") return {
			handled: true,
			ok: true,
			payload: await invokeNodeWorkerDesktopLaunch({
				paramsJSON: params.paramsJSON,
				signal: params.signal
			})
		};
		if (params.command === "worker.environment.stop.v1") {
			await params.supervisor.stopEnvironment(parseNodeWorkerEnvironmentStopInput(params.paramsJSON));
			return {
				handled: true,
				ok: true,
				payload: null
			};
		}
		const receipt = params.command === "worker.launch.v1" ? await params.supervisor.launch(parseNodeWorkerLaunchInput(params.paramsJSON), resolveWorkerConnectionEndpoint(params), params.signal) : params.command === "worker.status.v1" ? await params.supervisor.status(parseNodeWorkerLookupInput(params.paramsJSON).launchId) : await params.supervisor.cancel(parseNodeWorkerCancelInput(params.paramsJSON));
		return {
			handled: true,
			ok: true,
			payload: receipt ? projectNodeWorkerSupervisorReceipt(receipt) : null
		};
	} catch (error) {
		const invalid = error instanceof Error && error.message.startsWith("INVALID_REQUEST:");
		const bundleInstallFailure = error instanceof NodeWorkerBundleInstallError;
		const capacityFailure = error instanceof NodeWorkerCapacityExhaustedError;
		const transferFailure = error instanceof NodeWorkerWorkspaceTransferError;
		return {
			handled: true,
			ok: false,
			code: invalid ? "INVALID_REQUEST" : bundleInstallFailure ? NODE_WORKER_BUNDLE_INSTALL_ERROR_CODE : capacityFailure ? NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE : transferFailure ? NODE_WORKSPACE_TRANSFER_ERROR_CODE : "UNAVAILABLE",
			message: invalid || bundleInstallFailure || capacityFailure || transferFailure ? error.message : "node worker supervisor command failed"
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
/** Release plugin command state before a reconnected Gateway can invoke it again. */
async function notifyRegisteredNodeHostCommandDisconnect() {
	const registry = resolveNodeHostPluginRegistry();
	const callbacks = new Set((registry?.nodeHostCommands ?? []).map((entry) => entry.command.onDisconnect).filter((callback) => callback !== void 0));
	await withPluginRuntimeRegistryScope(registry, async () => {
		const failures = (await Promise.allSettled([...callbacks].map(async (callback) => await callback()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length === 1) {
			const failure = failures[0];
			throw failure instanceof Error ? failure : new Error("node-host plugin disconnect cleanup failed", { cause: failure });
		}
		if (failures.length > 1) throw new AggregateError(failures, "node-host plugin disconnect cleanup failed");
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
		await dispatchInvoke(frame, invocationClient, client, skillBins, mcpManager, runtime);
	} catch (err) {
		logWarn(`node host invoke failed (command=${frame.command ?? "unknown"}, id=${frame.id}): ${String(err)}`);
		try {
			await sendErrorResult(invocationClient, frame, "UNAVAILABLE", "node invocation failed");
		} catch (sendErr) {
			logWarn(`node host invoke failure response could not be sent (id=${frame.id}): ${String(sendErr)}`);
		}
	}
}
async function dispatchInvoke(frame, client, abortedFailureClient, skillBins, mcpManager, runtime = {}) {
	const command = frame.command ?? "";
	const workerSupervisorResult = await invokeNodeWorkerSupervisorCommand({
		command,
		paramsJSON: frame.paramsJSON,
		bundleInstaller: runtime.workerBundleInstaller,
		supervisor: runtime.workerSupervisor,
		workspace: runtime.workerWorkspace,
		gatewayUrl: runtime.gatewayUrl,
		gatewayTlsFingerprint: runtime.gatewayTlsFingerprint,
		gatewayCloudflareAccess: runtime.gatewayCloudflareAccess,
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
				gatewayCloudflareAccess: runtime.gatewayCloudflareAccess,
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
		let includeResolvedDefaults = false;
		try {
			if (frame.paramsJSON != null) {
				const params = decodeParams(frame.paramsJSON);
				if (!isRecord(params) || params.includeResolvedDefaults !== void 0 && typeof params.includeResolvedDefaults !== "boolean") throw new Error("INVALID_REQUEST: includeResolvedDefaults must be boolean");
				includeResolvedDefaults = params.includeResolvedDefaults === true;
			}
		} catch (err) {
			await sendInvalidRequestResult(client, frame, err);
			return;
		}
		try {
			const snapshot = await ensureExecApprovalsSnapshot();
			await sendJsonPayloadResult(client, frame, {
				...redactExecApprovals(snapshot),
				...includeResolvedDefaults ? { resolvedDefaults: resolveExecApprovalsFromFile({ file: snapshot.file }).defaults } : {}
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
		await sendJsonPayloadResult(client, frame, redactExecApprovals(nextSnapshot));
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
		const acquireManagedWorkspace = context?.acquireManagedWorkspace;
		let pluginInvocationActive = true;
		const invokeContext = context && (frame.sessionKey || runtime.signal || acquireManagedWorkspace) ? {
			...context,
			...frame.sessionKey ? { sessionKey: frame.sessionKey } : {},
			...runtime.signal ? { signal: runtime.signal } : {},
			...acquireManagedWorkspace ? { acquireManagedWorkspace: (request) => {
				if (!pluginInvocationActive || runtime.signal?.aborted || !frame.sessionKey || request.sessionKey !== frame.sessionKey) throw new Error("node placement workspace invocation authority is closed");
				return acquireManagedWorkspace(request);
			} } : {}
		} : context;
		let pluginResult;
		try {
			pluginResult = await invokeRegisteredNodeHostCommand(command, frame.paramsJSON, io, invokeContext);
		} finally {
			pluginInvocationActive = false;
		}
		if (pluginResult !== null) {
			await runtime.flushPluginCommandIo?.();
			await sendRawPayloadResult(client, frame, pluginResult);
			return;
		}
	} catch (err) {
		await sendInvalidRequestResult(runtime.canReportAbortedFailure?.(err) ? abortedFailureClient : client, frame, err);
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
		await sendMcpPayloadResult(client, frame, boundMcpToolResultPayload(await mcpManager.callMcpTool({
			...params,
			timeoutMs: frame.timeoutMs ?? void 0,
			...signal ? { signal } : {}
		})));
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
	clarifyNodeExecCwdSpawnError,
	runCommand
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.nodeHostInvokeTestApi")] = testing;
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
	const hostCacheFenced = source.NODE_DISABLE_COMPILE_CACHE !== void 0 && source.OPENCLAW_SERVICE_KIND === "node" && source.OPENCLAW_LAUNCHD_LABEL === resolveNodeLaunchAgentLabel();
	if (!(source.NODE_DISABLE_COMPILE_CACHE !== void 0 && !hostCacheFenced)) snapshot.NODE_COMPILE_CACHE = (hostCacheFenced ? void 0 : source.NODE_COMPILE_CACHE?.trim()) || path.join(resolvePreferredOpenClawTmpDir(), "node-worker-compile-cache");
	else snapshot.NODE_DISABLE_COMPILE_CACHE = "1";
	snapshot.OPENCLAW_NO_RESPAWN = "1";
	return snapshot;
}
//#endregion
//#region src/node-host/node-worker-transfer-http.ts
var NodeWorkerTransferHttpError = class extends Error {
	constructor(reason, message) {
		super(message);
		this.reason = reason;
		this.name = "NodeWorkerTransferHttpError";
	}
};
const validatedTlsSocketPins = /* @__PURE__ */ new WeakMap();
function transferUrl(gatewayUrl, routePath) {
	const gateway = new URL(gatewayUrl);
	if (gateway.protocol !== "ws:" && gateway.protocol !== "wss:") throw new NodeWorkerTransferHttpError("invalid-gateway-transport", "worker transfer gateway must use WebSocket transport");
	const url = new URL(gateway.toString());
	url.protocol = gateway.protocol === "wss:" ? "https:" : "http:";
	url.pathname = `${gateway.pathname.replace(/\/$/u, "")}${routePath}`;
	url.search = "";
	url.hash = "";
	if (url.host !== gateway.host) throw new NodeWorkerTransferHttpError("invalid-gateway-transport", "worker transfer endpoint must stay on the connected gateway host");
	return url;
}
function waitForTlsPin(request, expectedRaw) {
	if (!expectedRaw?.trim()) return Promise.resolve();
	const expected = normalizeTlsFingerprint(expectedRaw);
	if (!expected) return Promise.reject(new NodeWorkerTransferHttpError("invalid-tls-fingerprint", "worker transfer gateway TLS fingerprint is invalid"));
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
				finish(validated === expected ? void 0 : new NodeWorkerTransferHttpError("tls-fingerprint-mismatch", "worker transfer gateway TLS fingerprint mismatch"));
				return;
			}
			verify = () => {
				const actual = normalizeTlsFingerprint(tlsSocket.getPeerCertificate().fingerprint256 ?? "");
				if (!actual || expected !== actual) {
					finish(new NodeWorkerTransferHttpError("tls-fingerprint-mismatch", "worker transfer gateway TLS fingerprint mismatch"));
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
async function openNodeWorkerTransferHttpRequest(params) {
	const url = transferUrl(params.gatewayUrl, params.routePath);
	if (params.cloudflareAccess && url.protocol !== "https:") throw new NodeWorkerTransferHttpError("cloudflare-access-requires-tls", "Cloudflare Access credentials require HTTPS worker transfer");
	const request = (url.protocol === "https:" ? https : http).request(url, {
		method: params.method,
		headers: {
			...params.headers,
			authorization: `Bearer ${params.token}`,
			...params.cloudflareAccess ? buildCloudflareAccessHeaders(params.cloudflareAccess) : {}
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
//#endregion
//#region src/node-host/node-worker-bundle-installer.ts
const INSTALL_RECEIPT = "bootstrap-receipt.json";
const INSTALL_IGNORED_TOP_LEVEL = /* @__PURE__ */ new Set([INSTALL_RECEIPT]);
const BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const STAGING_PATTERN = /^\.staging-[a-f0-9]{64}-/u;
const PREVIOUS_PATTERN = /^[a-f0-9]{64}\.previous-/u;
const BUNDLE_DELETE_BATCH = 16;
const WORKER_PREWARM_TIMEOUT_MS = 10 * 6e4;
const execFileAsync = promisify(execFile);
async function responseBody(response, maxBytes = 64 * 1024) {
	const chunks = [];
	let total = 0;
	for await (const value of response) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		total += chunk.byteLength;
		if (total > maxBytes) {
			response.destroy(/* @__PURE__ */ new Error("worker bundle transfer response exceeded its byte limit"));
			throw new Error("worker bundle transfer response exceeded its byte limit");
		}
		chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString("utf8");
}
async function downloadBundle(params) {
	const response = await openNodeWorkerTransferHttpRequest({
		gatewayUrl: params.gatewayUrl,
		tlsFingerprint: params.gatewayTlsFingerprint,
		cloudflareAccess: params.gatewayCloudflareAccess,
		routePath: nodeWorkerBundleTransferPath(params.input.build.bundleHash),
		method: "GET",
		token: params.input.archive.token,
		signal: params.signal
	});
	if (response.statusCode !== 200) {
		await responseBody(response);
		throw new Error(`gateway returned ${response.statusCode ?? 0}`);
	}
	if (Number(response.headers["content-length"]) !== params.input.archive.bytes) {
		response.destroy();
		throw new Error("gateway returned an unexpected worker bundle length");
	}
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
			if (bytes > params.input.archive.bytes || bytes > 536870912) throw new Error("worker bundle download exceeded its byte limit");
			hash.update(chunk);
			if (!output.write(chunk)) await once(output, "drain");
		}
		await new Promise((resolve, reject) => {
			output.end(resolve);
			output.once("error", reject);
		});
	} catch (error) {
		output.destroy();
		await fs$1.rm(params.destination, { force: true });
		throw error;
	}
	if (bytes !== params.input.archive.bytes || hash.digest("hex") !== params.input.archive.sha256) {
		await fs$1.rm(params.destination, { force: true });
		throw new Error("worker bundle download failed integrity validation");
	}
}
async function readReceipt$1(bundleDir) {
	try {
		const raw = JSON.parse(await fs$1.readFile(path.join(bundleDir, INSTALL_RECEIPT), "utf8"));
		return validateWorkerAdmissionHandshake(raw) ? raw : void 0;
	} catch {
		return;
	}
}
async function validateInstalledBundle(bundleDir, expected) {
	try {
		const rootStats = await fs$1.lstat(bundleDir);
		if (rootStats.isSymbolicLink() || !rootStats.isDirectory()) return false;
		const receipt = await readReceipt$1(bundleDir);
		if (!receipt || !sameWorkerBuild(receipt, expected)) return false;
		if (hashWorkerBundleManifest(await readWorkerBundleDirectoryManifest({
			root: bundleDir,
			limits: DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS,
			ignoreTopLevel: INSTALL_IGNORED_TOP_LEVEL
		})) !== expected.bundleHash) return false;
		const root = await fs$1.realpath(bundleDir);
		const entry = await fs$1.realpath(path.join(root, WORKER_BUNDLE_ENTRY_PATH));
		return isPathInside(root, entry) && (await fs$1.stat(entry)).isFile();
	} catch {
		return false;
	}
}
async function removeStaleInstallStaging(bundlesRoot) {
	const entries = await fs$1.readdir(bundlesRoot, { withFileTypes: true });
	await Promise.all(entries.map(async (entry) => {
		if (entry.name.startsWith(".staging-") && entry.isDirectory() && !entry.isSymbolicLink()) await fs$1.rm(path.join(bundlesRoot, entry.name), {
			recursive: true,
			force: true
		});
	}));
}
async function publishBundle(destination, staging) {
	const prior = `${destination}.previous-${process.pid}-${randomUUID()}`;
	let movedPrior = false;
	try {
		await fs$1.rename(destination, prior);
		movedPrior = true;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	try {
		await fs$1.rename(staging, destination);
	} catch (error) {
		if (movedPrior) await fs$1.rename(prior, destination).catch(() => void 0);
		throw error;
	}
	if (movedPrior) await fs$1.rm(prior, {
		recursive: true,
		force: true
	}).catch(() => void 0);
}
var NodeWorkerBundleInstaller = class {
	#root;
	#operations = new KeyedAsyncQueue();
	#bundleGenerationsByNamespace = /* @__PURE__ */ new Map();
	#currentGenerationByNamespace = /* @__PURE__ */ new Map();
	#prewarmedBundles = /* @__PURE__ */ new Set();
	#workerEnv;
	constructor(options = {}) {
		const env = options.env ?? process.env;
		this.#root = path.resolve(options.root ?? path.join(resolveStateDir(env), "node-host"));
		this.#workerEnv = snapshotNodeWorkerEnv(env);
	}
	#markPendingRetention(gatewayNamespace, bundleHash) {
		const generation = (this.#currentGenerationByNamespace.get(gatewayNamespace) ?? 0) + 1;
		this.#currentGenerationByNamespace.set(gatewayNamespace, generation);
		const generations = this.#bundleGenerationsByNamespace.get(gatewayNamespace) ?? /* @__PURE__ */ new Map();
		generations.set(bundleHash, generation);
		this.#bundleGenerationsByNamespace.set(gatewayNamespace, generations);
	}
	async #prewarmBundle(bundleDir, signal) {
		if (this.#prewarmedBundles.has(bundleDir)) return;
		try {
			await execFileAsync(process.execPath, [path.join(bundleDir, WORKER_BUNDLE_ENTRY_PATH), "--internal-worker-prewarm"], {
				cwd: bundleDir,
				env: this.#workerEnv,
				timeout: WORKER_PREWARM_TIMEOUT_MS,
				windowsHide: true,
				...signal ? { signal } : {}
			});
		} catch (error) {
			if (signal?.aborted) throw signal.reason ?? error;
			throw error;
		}
		this.#prewarmedBundles.add(bundleDir);
	}
	async ensure(params) {
		const { input } = params;
		const key = input.gatewayNamespace;
		return await this.#operations.enqueue(key, async () => {
			try {
				params.signal?.throwIfAborted();
				const bundlesRoot = path.join(this.#root, input.gatewayNamespace, "bundles");
				const destination = path.join(bundlesRoot, input.build.bundleHash);
				if (await validateInstalledBundle(destination, input.build)) {
					if (input.bundlePrewarm) await this.#prewarmBundle(destination, params.signal);
					this.#markPendingRetention(input.gatewayNamespace, input.build.bundleHash);
					return structuredClone(input.build);
				}
				await fs$1.mkdir(bundlesRoot, {
					recursive: true,
					mode: 448
				});
				await removeStaleInstallStaging(bundlesRoot);
				const operationRoot = await fs$1.mkdtemp(path.join(bundlesRoot, `.staging-${input.build.bundleHash}-`));
				try {
					const archivePath = path.join(operationRoot, "bundle.tgz");
					const staging = path.join(operationRoot, "root");
					await downloadBundle({
						gatewayUrl: params.gatewayUrl,
						gatewayTlsFingerprint: params.gatewayTlsFingerprint,
						gatewayCloudflareAccess: params.gatewayCloudflareAccess,
						input,
						destination: archivePath,
						signal: params.signal
					});
					await extractWorkerBundleArchive({
						tarballPath: archivePath,
						destination: staging,
						expectedBundleHash: input.build.bundleHash,
						limits: DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS
					});
					const receipt = await fs$1.open(path.join(staging, INSTALL_RECEIPT), "wx", 384);
					try {
						await receipt.writeFile(`${JSON.stringify(input.build)}\n`);
						await receipt.sync();
					} finally {
						await receipt.close();
					}
					await publishBundle(destination, staging);
					if (!await validateInstalledBundle(destination, input.build)) throw new Error("published worker bundle failed validation");
					if (input.bundlePrewarm) await this.#prewarmBundle(destination, params.signal);
					this.#markPendingRetention(input.gatewayNamespace, input.build.bundleHash);
					return structuredClone(input.build);
				} finally {
					await fs$1.rm(operationRoot, {
						recursive: true,
						force: true
					});
				}
			} catch (error) {
				if (error instanceof NodeWorkerBundleInstallError) throw error;
				if (error instanceof NodeWorkerTransferHttpError) throw new NodeWorkerBundleInstallError(error.reason === "tls-fingerprint-mismatch" ? "worker-bundle-install-failed: gateway TLS fingerprint mismatch" : error.reason === "cloudflare-access-requires-tls" ? "worker-bundle-install-failed: Cloudflare Access credentials require HTTPS" : "worker-bundle-install-failed: gateway transfer is unavailable", { cause: error });
				throw new NodeWorkerBundleInstallError(`worker-bundle-install-failed: ${truncateUtf16Safe(redactSensitiveText(error instanceof Error ? error.message : String(error)), 512) || "bundle installation did not complete"}`, { cause: error });
			}
		});
	}
	async inspect(params) {
		return await this.#operations.enqueue(params.gatewayNamespace, async () => {
			const bundleDir = path.join(this.#root, params.gatewayNamespace, "bundles", params.bundleHash);
			const receipt = await readReceipt$1(bundleDir);
			const installed = receipt?.bundleHash === params.bundleHash && await validateInstalledBundle(bundleDir, receipt);
			return {
				bundleHash: params.bundleHash,
				status: installed ? "installed" : "missing"
			};
		});
	}
	async retain(params) {
		return await this.#operations.enqueue(params.gatewayNamespace, async () => {
			const bundlesRoot = path.join(this.#root, params.gatewayNamespace, "bundles");
			let entries;
			try {
				entries = await fs$1.readdir(bundlesRoot, { withFileTypes: true });
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT")) return {
					deleted: 0,
					hasMore: false,
					generation: this.#currentGenerationByNamespace.get(params.gatewayNamespace) ?? 0
				};
				throw error;
			}
			const protectedHashes = new Set(params.bundleHashes);
			const generations = this.#bundleGenerationsByNamespace.get(params.gatewayNamespace) ?? /* @__PURE__ */ new Map();
			const acknowledgedGeneration = params.acknowledgedGeneration ?? 0;
			for (const [bundleHash, generation] of generations) if (generation > acknowledgedGeneration) protectedHashes.add(bundleHash);
			else generations.delete(bundleHash);
			if (generations.size > 0) this.#bundleGenerationsByNamespace.set(params.gatewayNamespace, generations);
			else this.#bundleGenerationsByNamespace.delete(params.gatewayNamespace);
			const candidates = entries.filter((entry) => entry.isDirectory() && !entry.isSymbolicLink() && (BUNDLE_HASH_PATTERN.test(entry.name) && !protectedHashes.has(entry.name) || STAGING_PATTERN.test(entry.name) || PREVIOUS_PATTERN.test(entry.name))).map((entry) => entry.name).toSorted();
			const selected = candidates.slice(0, BUNDLE_DELETE_BATCH);
			for (const name of selected) {
				const target = path.join(bundlesRoot, name);
				await fs$1.rm(target, {
					recursive: true,
					force: true
				});
				this.#prewarmedBundles.delete(target);
			}
			return {
				deleted: selected.length,
				hasMore: candidates.length > selected.length,
				generation: this.#currentGenerationByNamespace.get(params.gatewayNamespace) ?? 0
			};
		});
	}
};
//#endregion
//#region src/node-host/node-worker-container-engine.ts
const DEFAULT_NODE_WORKER_CONTAINER_IMAGE = "node:22-slim";
const CONTAINER_REVALIDATION_TIMEOUT_MS = 3e4;
const HOST_LABEL = "openclaw.node-worker.host";
const GATEWAY_LABEL = "openclaw.node-worker.gateway";
const LAUNCH_LABEL = "openclaw.node-worker.launch";
const CONTAINER_NODE_EXECUTABLE = "node";
const CONTAINER_PATH = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const CONTAINER_ID_PATTERN = /^[a-f0-9]{64}$/u;
const ENCODED_LAUNCH_PATTERN = /^[A-Za-z0-9_-]+$/u;
const OWNED_CONTAINER_STATUSES = /* @__PURE__ */ new Set([
	"created",
	"initialized",
	"running",
	"paused",
	"restarting",
	"stopping"
]);
const ENDED_CONTAINER_STATUSES = /* @__PURE__ */ new Set([
	"exited",
	"stopped",
	"dead",
	"removing"
]);
function hostNamespace(bundleRoot) {
	return createHash("sha256").update(path.resolve(bundleRoot)).digest("hex").slice(0, 32);
}
function encodeLaunchLabel(launchId) {
	return Buffer.from(launchId, "utf8").toString("base64url");
}
function decodeLaunchLabel(value) {
	if (!ENCODED_LAUNCH_PATTERN.test(value)) return;
	const decoded = Buffer.from(value, "base64url").toString("utf8");
	return decoded && encodeLaunchLabel(decoded) === value ? decoded : void 0;
}
function commandErrorText(error) {
	if (!(error instanceof Error)) return String(error);
	const stderr = "stderr" in error ? error.stderr : void 0;
	return typeof stderr === "string" && stderr.trim() ? stderr.trim() : error.message;
}
function missingContainer(error) {
	return /\bno such (?:object|container)\b|\bno container with (?:name|id)\b/iu.test(commandErrorText(error));
}
async function runContainerCommand(engine, args, timeoutMs = 15e3) {
	return (await runExec(engine.command, args, {
		...engine.env ? { baseEnv: engine.env } : {},
		timeoutMs,
		logOutput: false
	})).stdout.trim();
}
async function resolveContainerEngineTarget(engine, options = {}) {
	const env = engine.env ?? process.env;
	const timeoutMs = options.pinned ? CONTAINER_REVALIDATION_TIMEOUT_MS : 5e3;
	if (engine.id === "docker") {
		const endpoint = env.DOCKER_HOST?.trim() || await runContainerCommand(engine, [
			"context",
			"inspect",
			"--format",
			"{{.Endpoints.docker.Host}}"
		], 5e3);
		if (!endpoint || endpoint === "<no value>") throw new Error("Docker context did not report a stable daemon endpoint");
		const pinnedEnv = {
			...env,
			DOCKER_HOST: endpoint
		};
		delete pinnedEnv.DOCKER_CONTEXT;
		const frozenEnv = Object.freeze(pinnedEnv);
		const daemonId = await runContainerCommand({
			...engine,
			env: frozenEnv
		}, [
			"info",
			"--format",
			"{{.ID}}"
		], timeoutMs);
		if (!daemonId || daemonId === "<no value>") throw new Error("Docker daemon did not report a stable identity");
		return {
			target: createHash("sha256").update(`docker\0${daemonId}`).digest("hex"),
			env: frozenEnv
		};
	}
	const [hostname, graphRoot, remoteSocket = "", extra] = (await runContainerCommand(engine, [
		"info",
		"--format",
		"{{.Host.Hostname}}	{{.Store.GraphRoot}}	{{.Host.RemoteSocket.Path}}"
	], timeoutMs)).split("	");
	if (extra !== void 0 || !hostname || !graphRoot || hostname === "<no value>") throw new Error("Podman did not report a stable host and storage identity");
	let connections = [];
	if (!options.pinned) {
		const output = await runContainerCommand(engine, [
			"system",
			"connection",
			"list",
			"--format",
			"json"
		], 5e3);
		let parsed;
		try {
			parsed = JSON.parse(output);
		} catch {
			throw new Error("Podman returned invalid connection metadata");
		}
		if (!Array.isArray(parsed)) throw new Error("Podman returned invalid connection metadata");
		connections = parsed.filter(isRecord);
	}
	const configuredHost = env.CONTAINER_HOST?.trim() ?? "";
	const configuredConnection = env.CONTAINER_CONNECTION?.trim() ?? "";
	const selected = configuredHost ? connections.find((connection) => connection.URI === configuredHost) : configuredConnection ? connections.find((connection) => connection.Name === configuredConnection) : connections.find((connection) => connection.Default === true);
	if (configuredConnection && !configuredHost && !selected) throw new Error("Podman could not resolve the configured connection target");
	const selectedUri = configuredHost || (typeof selected?.URI === "string" ? selected.URI : "") || (remoteSocket && remoteSocket !== "<no value>" ? `unix://${remoteSocket}` : "local");
	const selectedIdentity = env.CONTAINER_SSHKEY?.trim() || (typeof selected?.Identity === "string" ? selected.Identity : "");
	const pinnedEnv = { ...env };
	if (selectedUri !== "local") {
		pinnedEnv.CONTAINER_HOST = selectedUri;
		delete pinnedEnv.CONTAINER_CONNECTION;
	}
	if (selectedIdentity) pinnedEnv.CONTAINER_SSHKEY = selectedIdentity;
	return {
		target: createHash("sha256").update(JSON.stringify([
			"podman",
			hostname,
			graphRoot,
			remoteSocket,
			selectedUri,
			selectedIdentity
		])).digest("hex"),
		env: Object.freeze(pinnedEnv)
	};
}
/** Resolve one working Docker-compatible daemon before advertising worker hosting. */
async function resolveNodeWorkerContainerEngine(options = {}) {
	const env = options.env ? Object.freeze({
		...process.env,
		...options.env
	}) : process.env;
	const failures = [];
	for (const id of ["docker", "podman"]) {
		const command = resolveExecutableFromPathEnv(id, env.PATH ?? process.env.PATH ?? "", env);
		if (!command) {
			failures.push(`${id}: executable not found`);
			continue;
		}
		const unresolved = {
			id,
			command,
			...options.env ? { env } : {}
		};
		try {
			const version = await runContainerCommand(unresolved, [
				"version",
				"--format",
				"{{.Server.Version}}"
			], 5e3);
			if (version && version !== "<no value>") return {
				...unresolved,
				...await resolveContainerEngineTarget(unresolved)
			};
			failures.push(`${id}: daemon did not report a server version`);
		} catch (error) {
			failures.push(`${id}: ${commandErrorText(error)}`);
		}
	}
	throw new Error(`nodeHost.workerRuns.isolation=container requires a working Docker-compatible engine; install and start Docker, OrbStack, or Podman, or set isolation to "none" (${failures.join("; ")})`);
}
/** Create a labeled, stopped container so its durable identity exists before worker admission. */
async function createNodeWorkerContainer(engine, params) {
	const bundleDir = path.dirname(params.bundleEntry);
	const namespace = hostNamespace(params.bundleRoot);
	const launchHash = createHash("sha256").update(`${params.gatewayNamespace}\0${params.launchId}`).digest("hex").slice(0, 32);
	const containerName = `openclaw-node-worker-${namespace.slice(0, 12)}-${launchHash}`;
	const args = [
		"create",
		"--interactive",
		"--name",
		containerName,
		"--label",
		`${HOST_LABEL}=${namespace}`,
		"--label",
		`${GATEWAY_LABEL}=${params.gatewayNamespace}`,
		"--label",
		`${LAUNCH_LABEL}=${encodeLaunchLabel(params.launchId)}`,
		"--mount",
		`type=bind,source=${bundleDir},target=${bundleDir},readonly`,
		"--mount",
		`type=bind,source=${params.workspaceDir},target=${params.workspaceDir}`,
		"--workdir",
		params.workspaceDir
	];
	if (engine.id === "docker" && process.getuid && process.getgid) args.push("--user", `${process.getuid()}:${process.getgid()}`);
	const containerEnv = {
		...params.env,
		PATH: CONTAINER_PATH,
		HOME: params.workspaceDir
	};
	if (containerEnv.NODE_EXTRA_CA_CERTS) {
		let certificatePath;
		try {
			certificatePath = fs.realpathSync.native(containerEnv.NODE_EXTRA_CA_CERTS);
		} catch {
			throw new Error("node worker container cannot access the configured NODE_EXTRA_CA_CERTS file");
		}
		if (!isPathInside(bundleDir, certificatePath) && !isPathInside(params.workspaceDir, certificatePath)) throw new Error("node worker container cannot access NODE_EXTRA_CA_CERTS outside its admitted bundle or session workspace; place the CA certificate in the session workspace");
		containerEnv.NODE_EXTRA_CA_CERTS = certificatePath;
	}
	for (const key of [
		"TMPDIR",
		"TMP",
		"TEMP"
	]) if (containerEnv[key] !== void 0) containerEnv[key] = "/tmp";
	if (containerEnv.NODE_COMPILE_CACHE !== void 0) containerEnv.NODE_COMPILE_CACHE = "/tmp/openclaw-node-worker-compile-cache";
	for (const [key, value] of Object.entries(containerEnv).toSorted(([left], [right]) => left.localeCompare(right))) if (value !== void 0) args.push("--env", `${key}=${value}`);
	args.push("--entrypoint", CONTAINER_NODE_EXECUTABLE, params.image ?? DEFAULT_NODE_WORKER_CONTAINER_IMAGE, params.bundleEntry, "--internal-worker-session");
	const current = await resolveContainerEngineTarget(engine, { pinned: true });
	if (current.target !== engine.target) throw new Error(`node worker container daemon changed since hosting startup (pinned ${engine.target}, current ${current.target}); restore the original daemon context or restart the node host`);
	const containerId = await runContainerCommand(engine, args, 3e5);
	if (!CONTAINER_ID_PATTERN.test(containerId)) {
		try {
			await killNodeWorkerContainer(engine, containerName, params);
		} catch (error) {
			throw new Error(`node worker container engine returned an invalid container identity and cleanup failed: ${commandErrorText(error)}`, { cause: error });
		}
		throw new Error("node worker container engine returned an invalid container identity");
	}
	return {
		engine: engine.id,
		containerId,
		engineTarget: engine.target
	};
}
function buildNodeWorkerContainerStartArgv(engine, containerId) {
	return [
		engine.command,
		"start",
		"--attach",
		"--interactive",
		containerId
	];
}
/** Inspect the container rather than its disposable Docker client process. */
async function inspectNodeWorkerContainer(engine, containerId, expected) {
	try {
		const [status = "", owner, gateway, launch, extra] = (await runContainerCommand(engine, [
			"inspect",
			"--type",
			"container",
			"--format",
			expected ? `{{.State.Status}}\t{{index .Config.Labels "${HOST_LABEL}"}}\t{{index .Config.Labels "${GATEWAY_LABEL}"}}\t{{index .Config.Labels "${LAUNCH_LABEL}"}}` : "{{.State.Status}}",
			containerId
		])).split("	");
		if (expected) {
			if (extra !== void 0 || owner !== hostNamespace(expected.bundleRoot) || gateway !== expected.gatewayNamespace || launch !== encodeLaunchLabel(expected.launchId)) return "reused";
		} else if (owner !== void 0) return "unknown";
		return OWNED_CONTAINER_STATUSES.has(status) ? "live" : ENDED_CONTAINER_STATUSES.has(status) ? "dead" : "unknown";
	} catch (error) {
		return missingContainer(error) ? "dead" : "unknown";
	}
}
/** Kill the authoritative container before removing its identity from the launch journal. */
async function killNodeWorkerContainer(engine, containerId, expected) {
	const original = await inspectNodeWorkerContainer(engine, containerId, expected);
	if (original === "reused" || original === "unknown") throw new Error(`node worker container ownership could not be verified before removal (${original})`);
	try {
		await runContainerCommand(engine, ["kill", containerId]);
	} catch {}
	try {
		await runContainerCommand(engine, [
			"rm",
			"--force",
			containerId
		]);
	} catch (error) {
		if (!missingContainer(error)) throw error;
	}
	const remaining = await inspectNodeWorkerContainer(engine, containerId);
	if (remaining !== "dead") throw new Error(`node worker container removal could not be verified (${remaining})`);
}
/** List only containers owned by this node-host root, never another local host instance. */
async function listNodeWorkerContainers(engine, options) {
	const output = await runContainerCommand(engine, [
		"ps",
		"--all",
		"--no-trunc",
		"--filter",
		`label=${HOST_LABEL}=${hostNamespace(options.bundleRoot)}`,
		"--filter",
		`label=${GATEWAY_LABEL}`,
		"--filter",
		`label=${LAUNCH_LABEL}`,
		"--format",
		`{{.ID}}\t{{.Label "${GATEWAY_LABEL}"}}\t{{.Label "${LAUNCH_LABEL}"}}`
	]);
	if (!output) return [];
	return output.split("\n").map((line) => {
		const [containerId, gatewayNamespace, encodedLaunch, extra] = line.split("	");
		const launchId = encodedLaunch ? decodeLaunchLabel(encodedLaunch) : void 0;
		if (extra !== void 0 || !containerId || !CONTAINER_ID_PATTERN.test(containerId) || !gatewayNamespace || !launchId) throw new Error("node worker container engine returned an invalid container listing");
		return {
			engine: engine.id,
			containerId,
			engineTarget: engine.target,
			gatewayNamespace,
			launchId
		};
	}).toSorted((left, right) => left.containerId.localeCompare(right.containerId));
}
//#endregion
//#region src/node-host/node-worker-container-lifecycle.ts
var NodeWorkerContainerContextMismatchError = class extends Error {};
/** Owns exact container authority and startup cleanup independently of client PIDs. */
var NodeWorkerContainerLifecycle = class {
	constructor(engine, bundleRoot, store) {
		this.engine = engine;
		this.bundleRoot = bundleRoot;
		this.store = store;
	}
	async initialize() {
		for (const receipt of this.store.listNonterminal()) if (receipt.container && (receipt.container.engine !== this.engine.id || receipt.container.engineTarget !== this.engine.target)) throw new NodeWorkerContainerContextMismatchError(`node worker launch ${receipt.launchId} belongs to a different ${receipt.container.engine} engine or daemon; restore its original engine context before enabling worker hosting`);
		for (const container of await listNodeWorkerContainers(this.engine, { bundleRoot: this.bundleRoot })) {
			const receipt = this.store.get(container.launchId);
			if (receipt?.state === "pending" && receipt.gatewayNamespace === container.gatewayNamespace) {
				const supervisorState = inspectNodeWorkerProcessIdentity(receipt.supervisor);
				if (supervisorState === "live" || supervisorState === "unknown") continue;
			}
			if (receipt?.state === "running" && receipt.gatewayNamespace === container.gatewayNamespace && receipt.container?.engine === container.engine && receipt.container.containerId === container.containerId && receipt.container.engineTarget === this.engine.target) continue;
			await this.remove(container, container);
		}
	}
	async inspect(container, owner) {
		return await inspectNodeWorkerContainer(this.requireMatchingEngine(container), container.containerId, this.expectedOwner(owner));
	}
	async remove(container, owner) {
		await killNodeWorkerContainer(this.requireMatchingEngine(container), container.containerId, this.expectedOwner(owner));
	}
	requireMatchingEngine(container) {
		if (container.engine !== this.engine.id || container.engineTarget !== this.engine.target) throw new NodeWorkerContainerContextMismatchError(`node worker container belongs to a different ${container.engine} engine or daemon context`);
		return this.engine;
	}
	expectedOwner(owner) {
		return {
			bundleRoot: this.bundleRoot,
			...owner
		};
	}
};
//#endregion
//#region src/node-host/node-worker-output.ts
const NODE_WORKER_STDOUT_MAX_BYTES = 64 * 1024;
const STDERR_MAX_BYTES = 4 * 1024;
function createNodeWorkerCredentialScrubber(credentials) {
	const ordered = [...new Set((typeof credentials === "string" ? [credentials] : credentials).flatMap((credential) => [
		credential,
		encodeURIComponent(credential),
		JSON.stringify(credential).slice(1, -1)
	]))].toSorted((left, right) => right.length - left.length);
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
function parseNodeWorkerOutputJson(raw, scrubCredential) {
	const redacted = redactLaunchText(raw, scrubCredential);
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
//#region src/node-host/node-worker-launch-observation.ts
/** Turn results settle independently; process exit alone releases the physical owner. */
async function observeNodeWorkerChildOutput(active, onResult, currentTurnId) {
	let stdout = "";
	let lastResult;
	let outputError;
	let journaled = false;
	const drain = () => {
		if (!journaled || outputError) return;
		try {
			let newline;
			while ((newline = stdout.indexOf("\n")) >= 0) {
				const line = stdout.slice(0, newline);
				stdout = stdout.slice(newline + 1);
				if (Buffer.byteLength(line, "utf8") > 65536) throw new Error(`worker stdout exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`);
				const frame = parseWorkerProcessResult(JSON.parse(parseNodeWorkerOutputJson(line, active.scrubber.scrub)));
				if (!frame) throw new Error("worker returned an invalid turn result");
				onResult(frame);
				lastResult = JSON.stringify(frame.result);
			}
			if (Buffer.byteLength(stdout, "utf8") > 65536) throw new Error(`worker stdout exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`);
		} catch (error) {
			outputError = error;
			stdout = "";
			active.adapter.kill("SIGKILL");
		}
	};
	let stderr = createCapturedOutputBuffers();
	let diagnosticTurnId = currentTurnId();
	const currentStderr = () => {
		if (diagnosticTurnId !== currentTurnId()) {
			stderr = createCapturedOutputBuffers();
			diagnosticTurnId = currentTurnId();
		}
		return stderr;
	};
	active.adapter.onStdout((chunk) => {
		if (outputError) return;
		stdout += chunk;
		if (!journaled && Buffer.byteLength(stdout, "utf8") > 65536) {
			outputError = /* @__PURE__ */ new Error(`worker stdout exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`);
			stdout = "";
			active.adapter.kill("SIGKILL");
		}
		drain();
	});
	active.adapter.onStderr((chunk) => appendCapturedOutput(currentStderr(), chunk, NODE_WORKER_STDERR_MAX_BYTES + active.scrubber.maxRepresentationBytes, "tail"));
	try {
		active.journalReady.then(() => {
			journaled = true;
			drain();
		});
		const exit = await active.adapter.wait();
		await active.journalReady;
		if (active.stopState) return Object.freeze({
			state: active.stopState,
			errorText: active.connectionFailure.errorText ?? (active.stopState === "cancelled" ? "node worker launch cancelled" : "node worker launch interrupted during node-host shutdown")
		});
		if (outputError || stdout.length > 0 || exit.code === 0 && !lastResult) return Object.freeze({
			state: "failed",
			errorText: sanitizeNodeWorkerDiagnostic(outputError ?? /* @__PURE__ */ new Error("worker exited without a complete turn result"), "invalid worker result", active.scrubber.scrub)
		});
		if (exit.code === 0 && exit.signal === null && lastResult) return Object.freeze({
			state: "completed",
			resultJson: lastResult
		});
		const detail = finalizeCapturedOutput(currentStderr(), "tail", true).toString("utf8");
		const exitLabel = exit.signal ? `signal ${exit.signal}` : `exit code ${String(exit.code)}`;
		return Object.freeze({
			state: "failed",
			errorText: active.connectionFailure.errorText ?? sanitizeNodeWorkerDiagnostic(`node worker failed with ${exitLabel}${detail ? `: ${detail}` : ""}`, "node worker failed", active.scrubber.scrub)
		});
	} catch (error) {
		await active.journalReady;
		return Object.freeze({
			state: active.stopState ?? "failed",
			errorText: active.connectionFailure.errorText ?? sanitizeNodeWorkerDiagnostic(error, "node worker wait failed", active.scrubber.scrub)
		});
	} finally {
		active.adapter.dispose();
	}
}
//#endregion
//#region src/node-host/node-worker-entry.ts
/** Resolves one exact Gateway-managed worker bundle from its isolated namespace. */
function resolveNodeWorkerEntry(params) {
	const root = fs.realpathSync.native(params.bundleRoot);
	const bundle = fs.realpathSync.native(path.join(root, params.gatewayNamespace, "bundles", params.expectedBundleHash));
	if (!isPathInside(root, bundle)) throw new Error("node worker bundle resolves outside its configured root");
	const entry = fs.realpathSync.native(path.join(bundle, WORKER_BUNDLE_ENTRY_PATH));
	if (!isPathInside(bundle, entry) || !fs.statSync(entry).isFile()) throw new Error("node worker entry must be a regular file inside its bundle");
	return entry;
}
//#endregion
//#region src/node-host/node-worker-launch-transport.ts
/** Keep local IPC and container stdio as transport choices of one launch state machine. */
async function prepareNodeWorkerLaunchTransport(options) {
	const entry = resolveNodeWorkerEntry({
		bundleRoot: options.bundleRoot,
		expectedBundleHash: options.input.expectedBundleHash,
		gatewayNamespace: options.input.gatewayNamespace
	});
	if (!options.containerEngine) return {
		kind: "started",
		adapter: await createChildAdapter({
			argv: [
				process.execPath,
				entry,
				"--internal-worker-ipc",
				"--internal-worker-session"
			],
			env: options.workerEnv,
			exactEnv: true,
			ownedWorker: true,
			onWorkerMessage: (message) => {
				const diagnostic = parseNodeWorkerConnectionFailureMessage(message);
				if (!diagnostic) return;
				options.connectionFailure.errorText = diagnostic.cause ? sanitizeNodeWorkerDiagnostic(diagnostic.cause, "node worker gateway connection failed", options.scrubber.scrub) : void 0;
			},
			stdinMode: "pipe-open"
		})
	};
	const endpoint = options.descriptor.connectionEndpoint;
	if (endpoint.kind !== "websocket") throw new Error("container-isolated workers require a reachable WebSocket Gateway URL");
	if (isGatewayLoopbackHost(new URL(endpoint.url).hostname)) throw new Error("container-isolated workers cannot reach a loopback Gateway URL; connect the node host using a Gateway address reachable from its container network");
	if (options.descriptor.assignment.browser) throw new Error("container-isolated workers cannot use host browser assignments; disable browser access for isolated worker sessions");
	const lifecycle = options.containerLifecycle;
	if (!lifecycle) throw new Error("node worker container isolation has no lifecycle owner");
	let container;
	try {
		container = await createNodeWorkerContainer(options.containerEngine, {
			bundleRoot: options.bundleRoot,
			bundleEntry: entry,
			workspaceDir: options.descriptor.assignment.workspaceDir,
			gatewayNamespace: options.input.gatewayNamespace,
			launchId: options.input.launchId,
			env: options.workerEnv,
			...options.containerImage ? { image: options.containerImage } : {}
		});
		const claimed = options.store.get(options.input.launchId);
		if (claimed?.state !== "pending") {
			await lifecycle.remove(container, options.input);
			if (!claimed) throw new Error("node worker container launch lost its durable claim");
			return {
				kind: "terminal",
				receipt: claimed
			};
		}
		return {
			kind: "started",
			adapter: await createChildAdapter({
				argv: buildNodeWorkerContainerStartArgv(options.containerEngine, container.containerId),
				env: options.containerEngine.env ?? options.engineEnv,
				exactEnv: true,
				stdinMode: "pipe-open"
			}),
			container
		};
	} catch (error) {
		if (container) await lifecycle.remove(container, options.input);
		throw error;
	}
}
/** Both transports admit turns only after the physical owner has been journaled. */
async function startNodeWorkerLaunchTransport(params) {
	if (!params.isCurrent()) throw new Error("node worker admission closed before startup");
	if (!params.container) await params.adapter.openStartGate?.();
	if (!params.isCurrent()) throw new Error("node worker admission closed before descriptor dispatch");
	await sendNodeWorkerInput(params.adapter, {
		type: "turn",
		turnId: params.descriptor.assignment.turnId,
		descriptor: params.descriptor
	});
}
async function sendNodeWorkerInput(adapter, message) {
	const stdin = adapter.stdin;
	if (!stdin) throw new Error("node worker did not provide a writable stdin pipe");
	await new Promise((resolve, reject) => {
		stdin.write(`${JSON.stringify(message)}\n`, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}
//#endregion
//#region src/node-host/node-worker-supervisor-ownership.ts
/** Only environment facts survive a turn; descriptors contain disposable admission authority. */
function nodeWorkerEnvironmentBinding(input) {
	const { admission, assignment } = input.descriptor;
	return {
		gatewayNamespace: input.gatewayNamespace,
		environmentId: admission.environmentId,
		sessionId: admission.sessionId,
		ownerEpoch: admission.ownerEpoch,
		placementGeneration: input.placementGeneration,
		bundleHash: input.expectedBundleHash,
		agentId: assignment.agentId,
		workspaceDir: assignment.workspaceDir,
		containmentRoot: assignment.workerContainmentRoot,
		permissionMode: assignment.permissionMode
	};
}
function nodeWorkerEnvironmentKey(binding) {
	return JSON.stringify([binding.gatewayNamespace, binding.environmentId]);
}
function nodeWorkerEnvironmentMatches(binding, expected) {
	return binding.gatewayNamespace === expected.gatewayNamespace && binding.environmentId === expected.environmentId && binding.sessionId === expected.sessionId && binding.ownerEpoch === expected.ownerEpoch;
}
function createNodeWorkerActiveTurn(claim) {
	const { promise, resolve } = createDeferredCore();
	return {
		claim,
		done: promise,
		settle: resolve,
		cancelled: false
	};
}
/** Match both process bookkeeping and exact authoritative container identity. */
function nodeWorkerReceiptMatchesOwner(receipt, supervisor, worker, container) {
	const sameProcess = (left, right) => left?.pid === right?.pid && left?.startTime === right?.startTime && left !== null === (right !== null);
	return sameProcess(receipt.supervisor, supervisor) && sameProcess(receipt.worker, worker) && receipt.container?.engine === container?.engine && receipt.container?.containerId === container?.containerId && receipt.container?.engineTarget === container?.engineTarget;
}
/** Delay result observation until the launch's exact owner has been journaled. */
function createNodeWorkerJournalGate() {
	let released = false;
	let resolveReady;
	return {
		journalReady: new Promise((resolve) => {
			resolveReady = resolve;
		}),
		releaseJournal: () => {
			if (!released) {
				released = true;
				resolveReady();
			}
		}
	};
}
//#endregion
//#region src/node-host/node-worker-turn-lifecycle.ts
/** Shutdown must be able to abort admission before it stops the retiring physical owner. */
async function waitForNodeWorkerRetirement(active, signal) {
	signal.throwIfAborted();
	if (!active.retiring) return;
	const aborted = createDeferredCore();
	const listener = addAbortListener(signal, () => aborted.resolve());
	try {
		await Promise.race([active.done, aborted.promise]);
	} finally {
		listener[Symbol.dispose]();
	}
}
function nodeWorkerDescriptorSecrets(descriptor) {
	const endpoint = descriptor.connectionEndpoint;
	const access = endpoint.kind === "websocket" ? endpoint.cloudflareAccess : void 0;
	return [descriptor.admission.credential, ...access ? [access.clientId, access.clientSecret] : []];
}
/** Persist completion before releasing the turn; the physical launch still owns cleanup. */
function settleNodeWorkerTurn(active, frame, store) {
	if (active.stopState) return;
	const turn = active.turn;
	if (!turn || turn.claim.launchId !== frame.turnId || active.retiring) throw new Error("node worker returned a result outside its active turn");
	const receipt = store.finish({
		expected: turn.claim,
		ownerLaunchId: active.launchId,
		supervisor: active.supervisor,
		worker: active.worker,
		...turn.cancelled ? {
			state: "cancelled",
			errorText: active.connectionFailure.errorText ?? "node worker turn cancelled"
		} : {
			state: "completed",
			resultJson: JSON.stringify(frame.result)
		}
	});
	if (!receipt || receipt.state === "pending" || receipt.state === "running") throw new Error("node worker turn completion lost its physical owner");
	active.turn = void 0;
	active.retiring = !frame.retainWorker;
	turn.settle();
}
async function startNodeWorkerTurn({ active, descriptor, claim, signal, store, cancel, stopChild }) {
	signal.throwIfAborted();
	const admitted = store.claim({
		claim,
		ownerLaunchId: active.launchId,
		supervisor: active.supervisor,
		worker: active.worker
	});
	if (admitted.action === "replay") return admitted.receipt;
	active.turn = createNodeWorkerActiveTurn(claim);
	const secrets = nodeWorkerDescriptorSecrets(descriptor);
	for (const value of secrets) registerSecretValueForRedaction(value);
	Object.assign(active.scrubber, createNodeWorkerCredentialScrubber(secrets));
	active.connectionFailure.errorText = void 0;
	const onAbort = () => {
		cancel(claim).catch(() => void 0);
	};
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		await sendNodeWorkerInput(active.adapter, {
			type: "turn",
			turnId: claim.launchId,
			descriptor
		});
		if (signal.aborted) await cancel(claim);
	} catch {
		await stopChild(active, "interrupted");
	} finally {
		signal.removeEventListener("abort", onAbort);
	}
	return store.get(claim.launchId) ?? admitted.receipt;
}
//#endregion
//#region src/node-host/node-worker-launch.ts
/** Starts one physical owner behind the durable journal gate, independent of turn reuse. */
async function startNodeWorkerChild(context, params) {
	const sensitiveValues = nodeWorkerDescriptorSecrets(params.descriptor);
	const scrubber = createNodeWorkerCredentialScrubber(sensitiveValues);
	const connectionFailure = {};
	for (const value of sensitiveValues) registerSecretValueForRedaction(value);
	let adapter;
	let container;
	try {
		const prepared = await prepareNodeWorkerLaunchTransport({
			bundleRoot: context.bundleRoot,
			workerEnv: context.workerEnv,
			engineEnv: context.engineEnv,
			input: params.input,
			descriptor: params.descriptor,
			connectionFailure,
			scrubber,
			store: context.store,
			containerEngine: context.containerEngine,
			containerLifecycle: context.containerLifecycle,
			containerImage: context.containerImage
		});
		if (prepared.kind === "terminal") return prepared.receipt;
		adapter = prepared.adapter;
		container = prepared.container;
	} catch (error) {
		return context.capacity.finish({
			launchId: params.input.launchId,
			planHash: params.planHash,
			supervisor: params.supervisor,
			worker: null,
			state: "failed",
			errorText: sanitizeNodeWorkerDiagnostic(error, "node worker spawn failed", scrubber.scrub)
		});
	}
	if (!adapter.pid) {
		if (container) await context.requireContainerLifecycle().remove(container, params.input);
		adapter.kill("SIGKILL");
		adapter.dispose();
		return context.capacity.finish({
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
		if (container) await context.requireContainerLifecycle().remove(container, params.input);
		adapter.kill("SIGKILL");
		await adapter.wait().catch(() => void 0);
		adapter.dispose();
		return context.capacity.finish({
			launchId: params.input.launchId,
			planHash: params.planHash,
			supervisor: params.supervisor,
			worker: null,
			state: "failed",
			errorText: sanitizeNodeWorkerDiagnostic(error, "node worker process identity unavailable", scrubber.scrub)
		});
	}
	const { journalReady, releaseJournal } = createNodeWorkerJournalGate();
	const active = {
		state: "running",
		binding: nodeWorkerEnvironmentBinding(params.input),
		turn: createNodeWorkerActiveTurn(params.claim),
		retiring: false,
		adapter,
		journalReady,
		gatewayNamespace: params.input.gatewayNamespace,
		launchId: params.input.launchId,
		planHash: params.planHash,
		releaseJournal,
		scrubber,
		connectionFailure,
		supervisor: params.supervisor,
		worker,
		...container ? { container } : {}
	};
	active.done = context.observeChild(active);
	context.active.set(active.launchId, active);
	active.done.catch(() => void 0);
	let running;
	try {
		running = context.store.markRunning({
			launchId: active.launchId,
			planHash: active.planHash,
			supervisor: params.supervisor,
			worker,
			...container ? { container } : {}
		});
	} catch (error) {
		active.releaseJournal();
		if (container) {
			await context.stopChild(active, "interrupted");
			context.active.delete(active.launchId);
			context.capacity.finish({
				launchId: active.launchId,
				planHash: active.planHash,
				supervisor: params.supervisor,
				worker: null,
				state: "failed",
				errorText: sanitizeNodeWorkerDiagnostic(error, "node worker container identity could not be persisted", scrubber.scrub)
			});
		} else await context.stopChild(active, "interrupted").catch(() => void 0);
		throw error;
	}
	active.releaseJournal();
	if (running.state === "cancelled" || running.state === "interrupted") {
		await context.stopChild(active, running.state);
		return context.store.get(active.launchId) ?? running;
	}
	if (running.state !== "running") {
		if (container) await context.stopChild(active, "interrupted");
		else adapter.closeStartGate?.();
		return running;
	}
	if (context.isClosed() || params.signal?.aborted || active.turn?.cancelled) {
		await context.stopChild(active, context.isClosed() ? "interrupted" : "cancelled");
		return context.store.get(active.launchId) ?? running;
	}
	try {
		await startNodeWorkerLaunchTransport({
			adapter,
			descriptor: params.descriptor,
			container,
			isCurrent: () => context.active.get(active.launchId) === active && !context.isClosed() && !params.signal?.aborted && active.turn?.cancelled === false
		});
	} catch {
		await context.stopChild(active, active.turn?.cancelled ? "cancelled" : "interrupted");
		return context.store.get(active.launchId) ?? running;
	}
	return context.turns.get(params.input.launchId) ?? running;
}
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
//#region src/node-host/node-worker-supervisor-recovery.ts
const STOP_GRACE_MS$1 = 1e3;
const FORCE_STOP_WAIT_MS$1 = 4e3;
/** Reconcile stale launch ownership against its actual process or container authority. */
async function recoverNodeWorkerLaunch(params) {
	const { receipt } = params;
	const state = params.state ?? "interrupted";
	const latest = () => params.store.get(receipt.launchId) ?? receipt;
	const stillOwned = () => {
		const current = params.store.getMatching(receipt);
		return current?.state === receipt.state && current.gatewayNamespace === receipt.gatewayNamespace && nodeWorkerReceiptMatchesOwner(current, receipt.supervisor, receipt.worker, receipt.container);
	};
	if (receipt.state !== "pending" && receipt.state !== "running" || !stillOwned()) return latest();
	const previousSupervisor = inspectNodeWorkerProcessIdentity(receipt.supervisor);
	if (previousSupervisor !== "dead" && previousSupervisor !== "reused") return latest();
	if (!receipt.worker && params.containerLifecycle) {
		await params.containerLifecycle.initialize();
		if (!stillOwned()) return latest();
	}
	if (receipt.container) {
		if (!params.containerLifecycle) throw new Error("node worker container isolation has no lifecycle owner");
		const containerState = await params.containerLifecycle.inspect(receipt.container, receipt);
		if (!stillOwned()) return latest();
		if (containerState === "unknown") {
			if (state === "cancelled") return latest();
			throw new Error(`node worker container ${receipt.container.containerId} could not be inspected; restore its ${receipt.container.engine} engine before enabling worker hosting`);
		}
		if (containerState === "reused") {
			if (state === "cancelled") return latest();
			throw new Error(`node worker launch ${receipt.launchId} lost its container ownership`);
		}
		await params.containerLifecycle.remove(receipt.container, receipt);
	} else if (receipt.worker) {
		let workerState = inspectOwnedNodeWorkerTree(receipt.worker);
		if (workerState === "unknown") return latest();
		if (workerState === "live") {
			if (!stillOwned()) return latest();
			await signalOwnedNodeWorkerTree(receipt.worker, "SIGTERM");
			workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, STOP_GRACE_MS$1);
		}
		if (workerState === "live") {
			if (!stillOwned()) return latest();
			await signalOwnedNodeWorkerTree(receipt.worker, "SIGKILL");
			workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, FORCE_STOP_WAIT_MS$1);
		}
		if (workerState !== "dead") return latest();
	}
	if (!stillOwned()) return latest();
	return params.capacity.finish({
		launchId: receipt.launchId,
		planHash: receipt.planHash,
		supervisor: receipt.supervisor,
		worker: receipt.worker,
		state,
		errorText: state === "cancelled" ? "node worker launch cancelled" : receipt.worker ? "node host stopped before the worker launch completed" : "node host stopped before the worker launch started"
	}, params.notifyCapacity);
}
//#endregion
//#region src/node-host/node-worker-turn-store.ts
const initializedDatabases = /* @__PURE__ */ new WeakSet();
const TERMINAL_RECEIPT_RETENTION_MS = 1440 * 60 * 1e3;
const TERMINAL_PRUNE_BATCH_LIMIT = 256;
function query(database) {
	return getNodeSqliteKysely(database);
}
function ensureTurnSchema(database) {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS node_worker_turns (");
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n  WHERE state = 'running';", start);
	if (start < 0 || end < start) throw new Error("OpenClaw node worker turn schema marker is missing.");
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 27));
}
function readRow(database, turnId) {
	return executeSqliteQueryTakeFirstSync(database, query(database).selectFrom("node_worker_turns").selectAll().where("turn_id", "=", turnId));
}
function readReceipt(database, turnId) {
	let turn = readRow(database, turnId);
	if (!turn) return;
	const owner = readNodeWorkerLaunchReceipt(database, turn.owner_launch_id);
	if (!owner) throw new Error(`node worker turn ${turnId} has no physical owner`);
	if (turn.state === "running" && owner.state !== "pending" && owner.state !== "running") {
		settleNodeWorkerActiveTurns(database, owner);
		turn = readRow(database, turnId);
	}
	const state = turn.state === "running" && owner.state === "pending" ? "pending" : turn.state;
	if (state !== "pending" && state !== "running" && state !== "completed" && state !== "failed" && state !== "interrupted" && state !== "cancelled") throw new Error(`invalid node worker turn state ${state}`);
	return {
		...owner,
		ownerLaunchId: owner.launchId,
		launchId: turn.turn_id,
		planHash: turn.plan_hash,
		runId: turn.run_id,
		state,
		resultJson: turn.result_json,
		errorText: turn.error_text,
		completedAtMs: turn.completed_at_ms,
		createdAtMs: turn.created_at_ms,
		updatedAtMs: turn.updated_at_ms
	};
}
function matchesIdentity(receipt, expected) {
	return receipt.launchId === expected.launchId && receipt.planHash === expected.planHash && receipt.environmentId === expected.environmentId && receipt.sessionId === expected.sessionId && receipt.ownerEpoch === expected.ownerEpoch && receipt.placementGeneration === expected.placementGeneration && receipt.runId === expected.runId;
}
function matchesProcess(receipt, supervisor, worker) {
	return receipt.supervisor.pid === supervisor.pid && receipt.supervisor.startTime === supervisor.startTime && receipt.worker?.pid === worker?.pid && receipt.worker?.startTime === worker?.startTime;
}
function pruneTerminal(database, nowMs, excludeTurnId) {
	executeSqliteQuerySync(database, query(database).deleteFrom("node_worker_turns").where("turn_id", "in", query(database).selectFrom("node_worker_turns").select("turn_id").where("completed_at_ms", "<=", Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS)).where("turn_id", "!=", excludeTurnId).orderBy("completed_at_ms", "asc").orderBy("turn_id", "asc").limit(TERMINAL_PRUNE_BATCH_LIMIT)));
}
/** Immutable turn outcomes attached to a separately supervised physical worker. */
var NodeWorkerTurnStore = class {
	constructor(options = {}) {
		this.databaseOptions = options.env ? { env: options.env } : {};
	}
	write(operationLabel, operation) {
		let initialized;
		const result = runOpenClawStateWriteTransaction(({ db }) => {
			if (!initializedDatabases.has(db)) {
				ensureTurnSchema(db);
				initialized = db;
			}
			return operation(db);
		}, this.databaseOptions, { operationLabel });
		if (initialized) initializedDatabases.add(initialized);
		return result;
	}
	claim(params) {
		const { claim, ownerLaunchId, supervisor } = params;
		const nowMs = params.nowMs ?? Date.now();
		return this.write("node-worker-turn.claim", (database) => {
			const existing = readReceipt(database, claim.launchId);
			if (existing) {
				if (!matchesIdentity(existing, claim) || existing.gatewayNamespace !== claim.gatewayNamespace || existing.ownerLaunchId !== ownerLaunchId) throw new Error(`node worker turn ${claim.launchId} was replayed with a different plan or owner`);
				pruneTerminal(database, nowMs, claim.launchId);
				return {
					action: "replay",
					receipt: existing
				};
			}
			const owner = readNodeWorkerLaunchReceipt(database, ownerLaunchId);
			if (!owner || owner.state !== "pending" && owner.state !== "running" || !matchesProcess(owner, supervisor, params.worker ?? null) || owner.gatewayNamespace !== claim.gatewayNamespace || owner.environmentId !== claim.environmentId || owner.sessionId !== claim.sessionId || owner.ownerEpoch !== claim.ownerEpoch || owner.placementGeneration !== claim.placementGeneration || owner.state === "pending" && owner.launchId !== claim.launchId || owner.launchId === claim.launchId && (owner.state !== "pending" || owner.planHash !== claim.planHash || owner.runId !== claim.runId)) throw new Error(`node worker turn ${claim.launchId} does not match its live physical owner`);
			executeSqliteQuerySync(database, query(database).insertInto("node_worker_turns").values({
				turn_id: claim.launchId,
				owner_launch_id: ownerLaunchId,
				plan_hash: claim.planHash,
				run_id: claim.runId,
				state: "running",
				result_json: null,
				error_text: null,
				completed_at_ms: null,
				created_at_ms: nowMs,
				updated_at_ms: nowMs
			}));
			pruneTerminal(database, nowMs, claim.launchId);
			return {
				action: "start",
				receipt: readReceipt(database, claim.launchId)
			};
		});
	}
	get(turnId) {
		return this.write("node-worker-turn.get", (database) => readReceipt(database, turnId));
	}
	getMatching(expected) {
		const receipt = this.get(expected.launchId);
		return receipt && matchesIdentity(receipt, expected) ? receipt : void 0;
	}
	finish(params) {
		return this.write("node-worker-turn.finish", (database) => {
			const receipt = readReceipt(database, params.expected.launchId);
			if (!receipt || !matchesIdentity(receipt, params.expected) || receipt.ownerLaunchId !== params.ownerLaunchId) return;
			if (receipt.state !== "pending" && receipt.state !== "running" || !matchesProcess(receipt, params.supervisor, params.worker)) return receipt;
			const nowMs = params.nowMs ?? Date.now();
			const completedAtMs = Math.max(nowMs, receipt.createdAtMs, receipt.updatedAtMs);
			executeSqliteQuerySync(database, query(database).updateTable("node_worker_turns").set({
				state: params.state,
				result_json: params.state === "completed" ? params.resultJson ?? null : null,
				error_text: params.state === "completed" ? null : params.errorText ?? null,
				completed_at_ms: completedAtMs,
				updated_at_ms: completedAtMs
			}).where("turn_id", "=", receipt.launchId).where("state", "=", "running"));
			pruneTerminal(database, nowMs, receipt.launchId);
			return readReceipt(database, receipt.launchId);
		});
	}
};
//#endregion
//#region src/node-host/node-worker-transfer-client.ts
const TRANSFER_TIMEOUT_MS = 10 * 6e4;
const TRANSFER_RESULT_MAX_BYTES = 64 * 1024;
const transferLog = createSubsystemLogger("node-host/worker-workspace");
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
	const response = await openNodeWorkerTransferHttpRequest(params);
	await requireOk(response);
	return await readResponseBody(response, maxBytes);
}
async function downloadFile(params) {
	const response = await openNodeWorkerTransferHttpRequest(params.request);
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
			...process.platform === "win32" ? [params.baseCommit ? "eligible" : "all", params.referenceManifestRef.slice(7)] : params.baseCommit ? ["eligible"] : []
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
	const index = await git([
		"ls-files",
		"--stage",
		"-z"
	], { maxOutputBytes: MAX_WORKSPACE_MANIFEST_BYTES });
	const gitlinks = [];
	const basePaths = /* @__PURE__ */ new Set();
	for (const record of index.split("\0").filter(Boolean)) {
		const separator = record.indexOf("	");
		if (separator < 0) continue;
		const indexedPath = record.slice(separator + 1);
		if (record.startsWith("160000 ")) gitlinks.push(indexedPath);
		else basePaths.add(indexedPath);
	}
	if (gitlinks.length > 0) await git([
		"update-index",
		"--skip-worktree",
		"-z",
		"--stdin"
	], { input: `${gitlinks.join("\0")}\0` });
	const checkoutPaths = params.entries.map((entry) => entry.path).filter((entryPath) => basePaths.has(entryPath));
	if (checkoutPaths.length > 0) await git([
		"checkout-index",
		"-z",
		"--stdin"
	], { input: `${checkoutPaths.join("\0")}\0` });
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
	const raw = await downloadBuffer({
		gatewayUrl: params.gatewayUrl,
		tlsFingerprint: params.tlsFingerprint,
		cloudflareAccess: params.cloudflareAccess,
		routePath: nodeWorkspaceTransferManifestPath(params.environmentId, params.transfer.manifestRef),
		method: "GET",
		token: params.transfer.token,
		signal: params.signal
	}, MAX_WORKSPACE_MANIFEST_BYTES);
	const manifest = parseWorkerWorkspaceManifest(raw.toString("utf8"), params.transfer.manifestRef);
	const stagingWorkspace = await tempWorkspace({
		rootDir: path.dirname(params.workspaceDir),
		prefix: `.${path.basename(params.workspaceDir)}.workspace-transfer-`
	});
	const staging = stagingWorkspace.dir;
	try {
		if (process.platform === "win32") {
			if ((await runWorkspaceCommand({
				workspaceDir: staging,
				homeDir: params.manifestHome,
				argv: [
					"node",
					"-e",
					REMOTE_WORKSPACE_MANIFEST_JS,
					staging,
					manifest.baseCommit ?? "",
					"publish",
					params.transfer.manifestRef.slice(7)
				],
				input: raw,
				signal: params.signal
			})).trim() !== params.transfer.manifestRef) throw new Error("workspace transfer manifest publication acknowledgement is invalid");
		}
		if (manifest.baseCommit) {
			const packPath = path.join(staging, ".openclaw-base.pack");
			const packStartedAt = performance.now();
			await downloadFile({
				request: {
					gatewayUrl: params.gatewayUrl,
					tlsFingerprint: params.tlsFingerprint,
					cloudflareAccess: params.cloudflareAccess,
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
				entries: manifest.entries,
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
			const materializedEntry = process.platform === "win32" && entry.type === "file" && entry.mode === 493 ? {
				...entry,
				mode: 420
			} : entry;
			if (manifest.baseCommit && await absoluteEntryMatches(destination, materializedEntry)) continue;
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
					cloudflareAccess: params.cloudflareAccess,
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
			referenceManifestRef: params.transfer.manifestRef,
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
		referenceManifestRef: params.transfer.baseManifestRef,
		signal: params.signal
	});
	const currentRaw = await fs$1.readFile(path.join(params.manifestHome, ".openclaw-worker", "manifests", `${currentRef.slice(7)}.json`), "utf8");
	const current = parseWorkerWorkspaceManifest(currentRaw, currentRef);
	const changed = new Set(workerWorkspaceTransferPaths(current, base));
	const files = current.entries.filter((entry) => entry.type === "file" && changed.has(entry.path));
	const manifestBytes = Buffer.from(currentRaw);
	const baseBytes = Buffer.from(baseRaw);
	const contentLength = 8 + baseBytes.byteLength + manifestBytes.byteLength + files.reduce((total, entry) => total + 8 + entry.size, 0);
	const response = await openNodeWorkerTransferHttpRequest({
		gatewayUrl: params.gatewayUrl,
		tlsFingerprint: params.tlsFingerprint,
		cloudflareAccess: params.cloudflareAccess,
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
			cloudflareAccess: params.gatewayCloudflareAccess,
			transfer: params.transfer
		}) : await uploadWorkspace({
			...params,
			tlsFingerprint: params.gatewayTlsFingerprint,
			cloudflareAccess: params.gatewayCloudflareAccess,
			transfer: params.transfer
		});
	} catch (error) {
		if (error instanceof NodeWorkerWorkspaceTransferError) throw error;
		if (error instanceof NodeWorkerTransferHttpError) {
			if (error.reason === "cloudflare-access-requires-tls") throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: Cloudflare Access credentials require HTTPS", { cause: error });
			if (error.reason === "tls-fingerprint-mismatch") throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: gateway TLS fingerprint mismatch", { cause: error });
			if (error.reason === "invalid-tls-fingerprint") throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: gateway TLS fingerprint is invalid", { cause: error });
		}
		throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: transfer did not complete", { cause: error });
	}
}
//#endregion
//#region src/node-host/node-worker-workspace-identity.ts
/** Validates node-owned placement workspace identities and canonical paths. */
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
function hashNodeWorkerWorkspaceComponent(value, length) {
	return createHash("sha256").update(value).digest("hex").slice(0, length);
}
function nodeWorkerWorkspaceGenerationKey(params) {
	return [
		params.gatewayNamespace,
		params.environmentHash,
		params.sessionHash,
		params.generation
	].join("/");
}
function nodeWorkerWorkspaceLaunchGenerationKey(reference) {
	return nodeWorkerWorkspaceGenerationKey({
		gatewayNamespace: reference.gatewayNamespace,
		environmentHash: hashNodeWorkerWorkspaceComponent(reference.environmentId, 16),
		sessionHash: hashNodeWorkerWorkspaceComponent(reference.sessionId, 32),
		generation: reference.ownerEpoch
	});
}
function nodeWorkerWorkspaceSessionKey(environmentHash, sessionHash) {
	return `${environmentHash}/${sessionHash}`;
}
function parseNodeWorkerWorkspaceGeneration(name) {
	const generation = Number(name);
	return Number.isSafeInteger(generation) && generation >= 0 && String(generation) === name ? generation : void 0;
}
function parseNodeWorkerWorkspaceTransferGeneration(name) {
	const staging = /^\.([0-9]+)\.workspace-transfer-.+$/u.exec(name)?.[1];
	const backup = /^([0-9]+)\.previous-.+$/u.exec(name)?.[1];
	const generation = staging ?? backup;
	return generation === void 0 ? void 0 : parseNodeWorkerWorkspaceGeneration(generation);
}
/** Proves an existing workspace was derived from its exact node-owned placement identity. */
function resolveNodeManagedWorkspaceIdentity(root, request) {
	const fail = () => {
		throw new Error("INVALID_REQUEST: node placement does not own the requested workspace");
	};
	if (typeof request.workspaceDir !== "string" || !path.isAbsolute(request.workspaceDir) || typeof request.environmentId !== "string" || !request.environmentId || typeof request.sessionId !== "string" || !request.sessionId || typeof request.sessionKey !== "string" || !request.sessionKey || !Number.isSafeInteger(request.ownerEpoch) || request.ownerEpoch < 1) return fail();
	let stats;
	let workspaceDir;
	try {
		stats = fs.lstatSync(request.workspaceDir);
		workspaceDir = fs.realpathSync.native(request.workspaceDir);
	} catch {
		return fail();
	}
	const components = path.relative(root, workspaceDir).split(path.sep);
	const gatewayNamespace = components[0];
	if (!gatewayNamespace || !GATEWAY_NAMESPACE_PATTERN.test(gatewayNamespace)) return fail();
	const environmentHash = hashNodeWorkerWorkspaceComponent(request.environmentId, 16);
	const sessionHash = hashNodeWorkerWorkspaceComponent(request.sessionId, 32);
	const expected = path.join(root, gatewayNamespace, "workspaces", environmentHash, sessionHash, String(request.ownerEpoch));
	if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(root, workspaceDir) || components.length !== 5 || components[1] !== "workspaces" || request.workspaceDir !== workspaceDir || workspaceDir !== expected) return fail();
	return {
		workspaceDir,
		gatewayNamespace,
		generationKey: nodeWorkerWorkspaceGenerationKey({
			gatewayNamespace,
			environmentHash,
			sessionHash,
			generation: request.ownerEpoch
		})
	};
}
//#endregion
//#region src/node-host/node-worker-workspace.ts
const DEFAULT_TIMEOUT_MS = 12e4;
const WORKSPACE_RETENTION_DELETE_LIMIT = 256;
const ENVIRONMENT_HASH_PATTERN = /^[a-f0-9]{16}$/u;
const SESSION_HASH_PATTERN = /^[a-f0-9]{32}$/u;
const MANIFEST_FILE_PATTERN = /^[a-f0-9]{64}\.json$/u;
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
		const environmentHash = hashNodeWorkerWorkspaceComponent(entry.environmentId, 16);
		const sessionHash = hashNodeWorkerWorkspaceComponent(entry.sessionId, 32);
		retainedGenerations.add(nodeWorkerWorkspaceGenerationKey({
			gatewayNamespace: input.gatewayNamespace,
			environmentHash,
			sessionHash,
			generation: entry.generation
		}));
		const sessionKey = nodeWorkerWorkspaceSessionKey(environmentHash, sessionHash);
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
		this.latestTransferredManifest = /* @__PURE__ */ new Map();
		this.deletingWorkspaceGenerations = /* @__PURE__ */ new Set();
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
	/** Claims an existing identity-derived workspace against concurrent retention. */
	acquireManagedWorkspace(request) {
		const identity = resolveNodeManagedWorkspaceIdentity(this.root, request);
		if (this.deletingWorkspaceGenerations.has(identity.generationKey)) throw new Error("INVALID_REQUEST: node placement workspace is being removed");
		const finishOperation = this.beginWorkspaceOperation(identity.gatewayNamespace, identity.generationKey);
		let released = false;
		return {
			workspaceDir: identity.workspaceDir,
			release: () => {
				if (!released) {
					released = true;
					finishOperation();
				}
			}
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
		for (const launch of listNonterminal()) if (launch.gatewayNamespace === gatewayNamespace) protectedGenerations.add(nodeWorkerWorkspaceLaunchGenerationKey(launch));
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
					const generation = parseNodeWorkerWorkspaceGeneration(entry.name);
					if (generation !== void 0 && entry.isDirectory() && !entry.isSymbolicLink()) existingGenerations.add(generation);
				}
				const candidates = [];
				for (const entry of entries) {
					if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
					const generation = parseNodeWorkerWorkspaceGeneration(entry.name);
					const artifactGeneration = parseNodeWorkerWorkspaceTransferGeneration(entry.name);
					if (generation !== void 0) {
						const key = nodeWorkerWorkspaceGenerationKey({
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
					const key = nodeWorkerWorkspaceGenerationKey({
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
					if (await removeOwnedDirectory(this.root, candidate.path, () => {
						if (this.currentLocalProtection(params.gatewayNamespace, params.retainedDuringPass, params.listNonterminal).has(candidate.generationKey)) return false;
						this.deletingWorkspaceGenerations.add(candidate.generationKey);
						return true;
					}).finally(() => this.deletingWorkspaceGenerations.delete(candidate.generationKey))) {
						deleted += 1;
						if (parseNodeWorkerWorkspaceGeneration(path.basename(candidate.path)) !== void 0) this.latestTransferredManifest.delete(candidate.generationKey);
					}
				}
				const sessionPrefix = `${params.gatewayNamespace}/${session.environmentHash}/${session.sessionHash}/`;
				const hasCurrentLocalProtection = () => [...this.currentLocalProtection(params.gatewayNamespace, params.retainedDuringPass, params.listNonterminal)].some((key) => key.startsWith(sessionPrefix));
				const hasLocalProtection = hasCurrentLocalProtection();
				const retainedManifestRefs = currentSnapshot.manifestsBySession.get(nodeWorkerWorkspaceSessionKey(session.environmentHash, session.sessionHash));
				if (!hasLocalProtection && retainedManifestRefs !== null) {
					const reachable = new Set(retainedManifestRefs);
					for (const generation of existingGenerations) {
						const latest = this.latestTransferredManifest.get(nodeWorkerWorkspaceGenerationKey({
							...session,
							generation
						}));
						if (latest) reachable.add(latest);
					}
					const manifestRoot = path.join(session.sessionRoot, ".openclaw-worker", "manifests");
					for (const entry of await listOwnedEntries(manifestRoot)) {
						if (!entry.isFile() || entry.isSymbolicLink() || !MANIFEST_FILE_PATTERN.test(entry.name) || reachable.has(`sha256:${entry.name.slice(0, -5)}`)) continue;
						if (deleted >= WORKSPACE_RETENTION_DELETE_LIMIT) {
							hasMore = true;
							return;
						}
						if (await removeOwnedFile(this.root, path.join(manifestRoot, entry.name), () => !hasCurrentLocalProtection())) deleted += 1;
					}
					await removeIfEmpty(manifestRoot);
					await removeIfEmpty(path.dirname(manifestRoot));
				}
				const hasGenerationOrArtifact = (await listOwnedEntries(session.sessionRoot)).some((entry) => entry.isDirectory() && !entry.isSymbolicLink() && (parseNodeWorkerWorkspaceGeneration(entry.name) !== void 0 || parseNodeWorkerWorkspaceTransferGeneration(entry.name) !== void 0));
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
		const environmentHash = hashNodeWorkerWorkspaceComponent(input.environmentId, 16);
		const sessionHash = hashNodeWorkerWorkspaceComponent(input.sessionId, 32);
		const sessionRootCandidate = path.join(this.root, input.gatewayNamespace, "workspaces", environmentHash, sessionHash);
		const generationKey = nodeWorkerWorkspaceGenerationKey({
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
				if (input.transfer || input.resetWorkspace) try {
					const stats = fs.lstatSync(workspacePath);
					const resolved = fs.realpathSync.native(workspacePath);
					if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(sessionRoot, resolved)) throw new Error("INVALID_REQUEST: node worker workspace path escaped its owner root");
				} catch (error) {
					if (error.code !== "ENOENT") throw error;
				}
				if (input.transfer) {
					if (input.resetWorkspace) throw new Error("INVALID_REQUEST: workspace transfer owns its atomic replacement");
					if (!gateway?.url) throw new Error("INVALID_REQUEST: workspace transfer gateway is unavailable");
					const stdout = await runNodeWorkerWorkspaceTransfer({
						gatewayUrl: gateway.url,
						gatewayTlsFingerprint: gateway.tlsFingerprint,
						gatewayCloudflareAccess: gateway.cloudflareAccess,
						environmentId: input.environmentId,
						workspaceDir: workspacePath,
						manifestHome: sessionRoot,
						transfer: input.transfer,
						signal
					});
					this.latestTransferredManifest.set(generationKey, stdout);
					return projectWorkspaceResult(workspacePath, {
						stdout: `${stdout}\n`,
						stderr: "",
						code: 0,
						signal: null,
						killed: false,
						termination: "exit"
					});
				}
				if (input.resetWorkspace) fs.rmSync(workspacePath, {
					recursive: true,
					force: true
				});
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
/** Owns worker process groups, lifetime gates, and the durable node-host launch journal. */
var NodeWorkerSupervisor = class {
	constructor(options = {}) {
		this.active = /* @__PURE__ */ new Map();
		this.starting = /* @__PURE__ */ new Map();
		this.admissions = /* @__PURE__ */ new Map();
		this.stoppingEnvironments = /* @__PURE__ */ new Map();
		this.closed = false;
		const env = options.env ?? process.env;
		this.bundleRoot = path.resolve(options.bundleRoot ?? path.join(resolveStateDir(env), "node-host"));
		this.store = new NodeWorkerLaunchStore({ env });
		this.turns = new NodeWorkerTurnStore({ env });
		this.workerEnv = snapshotNodeWorkerEnv(env);
		this.engineEnv = {
			...process.env,
			...env
		};
		this.containerEngine = options.containerEngine;
		this.containerLifecycle = options.containerEngine ? new NodeWorkerContainerLifecycle(options.containerEngine, this.bundleRoot, this.store) : void 0;
		this.containerImage = options.containerImage;
		this.workspace = options.workspace ?? new NodeWorkerWorkspaceRuntime({
			root: this.bundleRoot,
			env: this.workerEnv
		});
		this.capacity = new NodeWorkerCapacity(this.store, options);
	}
	initialize() {
		if (this.initializationPromise) return this.initializationPromise;
		const initialization = (async () => {
			if (this.containerLifecycle) await this.containerLifecycle.initialize();
			await this.capacity.initialize(async (receipt) => {
				await this.recoverRunning(receipt, false);
			});
		})().catch((error) => {
			if (this.initializationPromise === initialization) this.initializationPromise = void 0;
			throw error;
		});
		return this.initializationPromise = initialization;
	}
	requireContainerLifecycle() {
		if (!this.containerLifecycle) throw new Error("node worker container isolation has no available engine");
		return this.containerLifecycle;
	}
	async launch(rawInput, connectionEndpoint, signal) {
		const input = validateNodeWorkerLaunchInput(structuredClone(rawInput));
		const descriptor = completeWorkerLaunchDescriptor(input.descriptor, connectionEndpoint);
		const planHash = nodeWorkerPlanHash(input);
		if (this.closed) throw new Error("node worker supervisor is closed");
		const binding = nodeWorkerEnvironmentBinding(input);
		const key = nodeWorkerEnvironmentKey(binding);
		if (this.stoppingEnvironments.has(key)) throw new Error("node worker environment is stopping");
		const admission = this.admissions.get(key);
		if (admission) {
			if (admission.launchId !== input.launchId || admission.planHash !== planHash) throw new Error("node worker environment already has a turn being admitted");
			return await admission.done;
		}
		const abort = new AbortController();
		const done = this.launchAdmitted(input, descriptor, planHash, signal ? AbortSignal.any([signal, abort.signal]) : abort.signal);
		const pending = {
			binding,
			launchId: input.launchId,
			planHash,
			abort,
			done
		};
		this.admissions.set(key, pending);
		try {
			return await done;
		} finally {
			if (this.admissions.get(key) === pending) this.admissions.delete(key);
		}
	}
	async launchAdmitted(input, descriptor, planHash, signal) {
		await this.initialize();
		const supervisor = this.supervisorIdentity ??= requireNodeWorkerProcessIdentity(process.pid);
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
		signal.throwIfAborted();
		const previous = this.turns.get(input.launchId);
		if (previous) {
			this.turns.claim({
				claim: claimInput,
				ownerLaunchId: previous.ownerLaunchId,
				supervisor: previous.supervisor,
				worker: previous.worker
			});
			return await this.status(input.launchId) ?? previous;
		}
		const binding = nodeWorkerEnvironmentBinding(input);
		for (const owner of this.active.values()) {
			if (nodeWorkerEnvironmentKey(owner.binding) !== nodeWorkerEnvironmentKey(binding)) continue;
			if (owner.state === "observed") {
				this.reconcileActiveTerminal(owner);
				continue;
			}
			await this.statusOwner(owner.launchId);
			await waitForNodeWorkerRetirement(owner, signal);
			signal.throwIfAborted();
			if (this.active.get(owner.launchId) !== owner) continue;
			if (owner.turn) throw new Error("node worker environment already has an active turn");
			if (owner.stopState || owner.retiring) throw new Error("node worker environment cleanup is incomplete");
			if (JSON.stringify(owner.binding) !== JSON.stringify(binding)) {
				if (binding.ownerEpoch < owner.binding.ownerEpoch || binding.ownerEpoch === owner.binding.ownerEpoch && binding.placementGeneration < owner.binding.placementGeneration) throw new Error("node worker launch belongs to a replaced environment");
				await this.stopChild(owner, "interrupted");
				if (this.active.get(owner.launchId) === owner) throw new Error("node worker environment cleanup is incomplete");
				signal.throwIfAborted();
				continue;
			}
			return await startNodeWorkerTurn({
				active: owner,
				descriptor,
				claim: claimInput,
				signal,
				store: this.turns,
				cancel: (expected) => this.cancel(expected),
				stopChild: (active, state) => this.stopChild(active, state)
			});
		}
		const claim = await this.capacity.claim(claimInput, supervisor, signal);
		if (claim.action === "recover") await this.recoverRunning(claim.receipt);
		if (claim.action !== "start") throw new Error("node worker turn receipt expired; request a fresh turn");
		try {
			this.turns.claim({
				claim: claimInput,
				ownerLaunchId: input.launchId,
				supervisor
			});
		} catch (error) {
			this.capacity.finish({
				...claimInput,
				supervisor,
				worker: null,
				state: "failed",
				errorText: "node worker turn could not be journaled"
			});
			throw error;
		}
		let cancellation;
		const cancelClaimed = () => {
			cancellation ??= this.cancel(claimInput);
			cancellation.catch(() => void 0);
		};
		signal?.addEventListener("abort", cancelClaimed, { once: true });
		const startup = startNodeWorkerChild({
			bundleRoot: this.bundleRoot,
			workerEnv: this.workerEnv,
			engineEnv: this.engineEnv,
			store: this.store,
			turns: this.turns,
			capacity: this.capacity,
			containerEngine: this.containerEngine,
			containerImage: this.containerImage,
			containerLifecycle: this.containerLifecycle,
			requireContainerLifecycle: () => this.requireContainerLifecycle(),
			active: this.active,
			isClosed: () => this.closed,
			observeChild: (active) => this.observeChild(active),
			stopChild: (active, state) => this.stopChild(active, state)
		}, {
			input,
			descriptor,
			planHash,
			supervisor,
			signal,
			claim: claimInput
		});
		this.starting.set(input.launchId, startup);
		if (signal?.aborted) cancelClaimed();
		try {
			const receipt = await startup;
			return cancellation ? await cancellation ?? receipt : receipt;
		} finally {
			signal?.removeEventListener("abort", cancelClaimed);
			if (this.starting.get(input.launchId) === startup) this.starting.delete(input.launchId);
		}
	}
	async status(launchId) {
		await this.initialize();
		const turn = this.turns.get(launchId);
		if (turn) {
			if (this.active.get(turn.ownerLaunchId)?.state === "observed" || turn.state === "pending" || turn.state === "running") await this.statusOwner(turn.ownerLaunchId);
			return this.turns.get(launchId);
		}
	}
	async statusOwner(launchId) {
		await this.initialize();
		const active = this.active.get(launchId);
		if (active?.state === "observed") return this.reconcileActiveTerminal(active);
		if (active?.state === "running") {
			if (active.container) {
				const inspection = await this.requireContainerLifecycle().inspect(active.container, active);
				if (inspection === "unknown") return this.store.get(launchId);
				if (inspection === "reused") throw new Error(`node worker launch ${launchId} lost its container ownership`);
				if (inspection === "live") {
					const clientState = inspectNodeWorkerProcessIdentity(active.worker);
					if (clientState !== "dead" && clientState !== "reused") return this.store.get(launchId);
					await active.done;
					if (this.active.get(launchId) === active) await this.stopChild(active, "interrupted");
				} else {
					await this.cleanupActiveContainer(active);
					await active.done;
					if (active.deferredOutcome) this.observeTerminalOutcome(active, active.deferredOutcome);
				}
				const observed = this.active.get(launchId);
				return observed?.state === "observed" ? this.reconcileActiveTerminal(observed) : this.store.get(launchId);
			}
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
		const claimed = this.turns.getMatching(expected);
		const claimedOwner = claimed && this.active.get(claimed.ownerLaunchId);
		if (claimedOwner?.state === "running" && claimedOwner.turn?.claim.launchId === expected.launchId) claimedOwner.turn.cancelled = true;
		await this.initialize();
		const receipt = this.turns.getMatching(expected);
		if (!receipt) return;
		if (receipt.state !== "pending" && receipt.state !== "running") return await this.status(receipt.launchId);
		const active = this.active.get(receipt.ownerLaunchId);
		if (active?.state !== "running" || active.turn?.claim.launchId !== expected.launchId) {
			const owner = this.store.get(receipt.ownerLaunchId);
			if (owner) await this.cancelOwner(owner);
			return this.turns.getMatching(expected);
		}
		const turn = active.turn;
		turn.cancelled = true;
		try {
			await withTimeout(sendNodeWorkerInput(active.adapter, {
				type: "cancel",
				turnId: expected.launchId
			}).then(() => turn.done), 5e3, { message: "node worker turn cancellation did not settle" });
		} catch {
			if (this.active.get(active.launchId) === active && active.turn === turn) await this.stopChild(active, "cancelled");
		}
		return this.turns.getMatching(expected);
	}
	async stopEnvironment(expected) {
		const key = nodeWorkerEnvironmentKey(expected);
		this.stoppingEnvironments.set(key, (this.stoppingEnvironments.get(key) ?? 0) + 1);
		try {
			const admission = this.admissions.get(key);
			if (admission && nodeWorkerEnvironmentMatches(admission.binding, expected)) {
				admission.abort.abort(/* @__PURE__ */ new Error("node worker environment stopped"));
				await admission.done.catch(() => void 0);
			}
			await this.initialize();
			for (const owner of this.active.values()) {
				if (!nodeWorkerEnvironmentMatches(owner.binding, expected)) continue;
				if (owner.state === "running") await this.stopChild(owner, "interrupted");
				const observed = this.active.get(owner.launchId);
				if (observed?.state === "observed") this.reconcileActiveTerminal(observed);
				else if (observed) throw new Error("node worker environment cleanup is incomplete");
			}
			for (const owner of this.store.listNonterminal()) if (nodeWorkerEnvironmentMatches(owner, expected)) {
				await this.cancelOwner(owner);
				const remaining = this.store.get(owner.launchId);
				if (remaining?.state === "pending" || remaining?.state === "running") throw new Error("node worker environment is still owned by another supervisor");
			}
		} finally {
			const remaining = this.stoppingEnvironments.get(key) - 1;
			if (remaining === 0) this.stoppingEnvironments.delete(key);
			else this.stoppingEnvironments.set(key, remaining);
		}
	}
	async cancelOwner(expected) {
		await this.initialize();
		const receipt = this.store.getMatching(expected);
		if (!receipt || receipt.state !== "pending" && receipt.state !== "running") return receipt;
		const active = this.active.get(expected.launchId);
		if (active) {
			if (active.planHash !== expected.planHash || !nodeWorkerReceiptMatchesOwner(receipt, active.supervisor, active.worker, active.container)) return receipt;
			if (active.state === "running") await this.stopChild(active, "cancelled");
			const observed = this.active.get(expected.launchId);
			if (observed?.state === "observed") return this.reconcileActiveTerminal(observed);
			return this.store.getMatching(expected);
		}
		const startup = this.starting.get(expected.launchId);
		if (startup && receipt.state === "pending" && receipt.supervisor.pid === process.pid) {
			if (this.containerEngine) {
				await startup;
				return await this.cancelOwner(expected);
			}
			const cancelled = this.capacity.finishCancelled({
				expected,
				supervisor: receipt.supervisor,
				worker: null
			});
			await startup;
			return this.store.getMatching(expected) ?? cancelled;
		}
		if (startup && receipt.container && receipt.supervisor.pid === process.pid) {
			await startup;
			return await this.cancelOwner(expected);
		}
		return await recoverNodeWorkerLaunch({
			receipt,
			store: this.store,
			capacity: this.capacity,
			containerLifecycle: this.containerLifecycle,
			notifyCapacity: true,
			state: "cancelled"
		});
	}
	close() {
		if (this.closePromise) return this.closePromise;
		this.closed = true;
		this.capacity.close();
		for (const admission of this.admissions.values()) admission.abort.abort(/* @__PURE__ */ new Error("node worker supervisor is closed"));
		const closePromise = (async () => {
			const errors = [];
			await this.initializationPromise?.catch((error) => errors.push(error));
			await Promise.allSettled([...this.admissions.values()].map((admission) => admission.done));
			await Promise.allSettled(this.starting.values());
			const stopped = await Promise.allSettled([...this.active.values()].filter((active) => active.state === "running").map((active) => this.stopChild(active, "interrupted")));
			errors.push(...stopped.flatMap((r) => r.status === "rejected" ? [r.reason] : []));
			for (const active of this.active.values()) {
				if (active.state !== "observed") continue;
				try {
					this.reconcileActiveTerminal(active);
				} catch (error) {
					errors.push(error);
				}
			}
			if (errors.length > 0) throw errors.length === 1 ? errors[0] : new AggregateError(errors, "node worker terminal reconciliation failed");
		})().finally(() => {
			if (this.closePromise === closePromise) this.closePromise = void 0;
		});
		this.closePromise = closePromise;
		return closePromise;
	}
	reconcileActiveTerminal(active) {
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
	}
	async recoverRunning(receipt, notifyCapacity = true) {
		return await recoverNodeWorkerLaunch({
			receipt,
			store: this.store,
			capacity: this.capacity,
			containerLifecycle: this.containerLifecycle,
			notifyCapacity
		});
	}
	async observeChild(active) {
		const outcome = await observeNodeWorkerChildOutput(active, (frame) => {
			settleNodeWorkerTurn(active, frame, this.turns);
		}, () => active.turn?.claim.launchId);
		if (active.container) try {
			await this.cleanupActiveContainer(active);
		} catch {
			active.deferredOutcome = outcome;
			return;
		}
		this.observeTerminalOutcome(active, outcome);
	}
	observeTerminalOutcome(active, outcome) {
		const observed = {
			state: "observed",
			binding: active.binding,
			gatewayNamespace: active.gatewayNamespace,
			launchId: active.launchId,
			planHash: active.planHash,
			supervisor: active.supervisor,
			worker: active.worker,
			...active.container ? { container: active.container } : {},
			outcome
		};
		if (this.active.get(active.launchId) !== active) return;
		this.active.set(active.launchId, observed);
		try {
			this.reconcileActiveTerminal(observed);
		} catch {}
		active.turn?.settle();
		active.turn = void 0;
	}
	async cleanupActiveContainer(active) {
		if (!active.container) return;
		if (!active.containerCleanup) {
			const cleanup = this.requireContainerLifecycle().remove(active.container, active).finally(() => {
				if (active.containerCleanup === cleanup) active.containerCleanup = void 0;
			});
			active.containerCleanup = cleanup;
		}
		await active.containerCleanup;
	}
	async stopChild(active, state) {
		active.stopState ??= state;
		if (active.container) await this.cleanupActiveContainer(active);
		active.adapter.kill("SIGTERM");
		const forceKill = setTimeout(() => active.adapter.kill("SIGKILL"), STOP_GRACE_MS);
		forceKill.unref?.();
		try {
			await active.done;
			if (active.deferredOutcome) this.observeTerminalOutcome(active, active.deferredOutcome);
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
const WORKER_INITIALIZATION_RETRY_MS = 5e3;
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
function createInventory(skills, pluginTools, mcpDescriptors = []) {
	return {
		skills,
		pluginTools: [...pluginTools, ...mcpDescriptors].toSorted((left, right) => {
			const a = left;
			const b = right;
			return (a.pluginId ?? "").localeCompare(b.pluginId ?? "") || (a.name ?? "").localeCompare(b.name ?? "");
		})
	};
}
function sameStringList(left, right) {
	return left.length === right.length && left.every((value, index) => value === right[index]);
}
function sameManifest(left, right) {
	return left.pathEnv === right.pathEnv && sameStringList(left.caps, right.caps) && sameStringList(left.commands, right.commands) && JSON.stringify(left.computerUse) === JSON.stringify(right.computerUse);
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
	let workerRunsEnabled = params?.enableWorkerRuns === true && (params.forceWorkerRuns === true || config.nodeHost?.workerRuns?.enabled === true);
	let preparedContainerWorkspace;
	let preparedContainerSupervisor;
	let preparedContainerCapacity;
	let preparedContainerInitialized = false;
	let publishContainerCapacity;
	let workerHostingDisabledReason;
	const disablePreparedContainerHosting = async (error) => {
		let failure = error;
		try {
			await preparedContainerSupervisor?.close();
		} catch (closeError) {
			if (closeError !== error) failure = /* @__PURE__ */ new Error(`${String(error)}; supervisor cleanup failed: ${String(closeError)}`);
		}
		workerRunsEnabled = false;
		preparedContainerWorkspace = void 0;
		preparedContainerSupervisor = void 0;
		preparedContainerCapacity = void 0;
		workerHostingDisabledReason = failure instanceof Error ? failure.message : String(failure);
	};
	if (workerRunsEnabled && config.nodeHost?.workerRuns?.isolation === "container") try {
		if (platform === "win32") throw new Error("Container-isolated node workers are unsupported on Windows because native paths cannot be mounted at their container paths; run the node host on Linux or macOS, or set isolation to \"none\".");
		const containerEngine = await resolveNodeWorkerContainerEngine({ env });
		preparedContainerWorkspace = new NodeWorkerWorkspaceRuntime({ env });
		preparedContainerSupervisor = createNodeWorkerSupervisor({
			env,
			capacity: config.nodeHost?.workerRuns?.capacity,
			workspace: preparedContainerWorkspace,
			containerEngine,
			...config.nodeHost?.workerRuns?.containerImage ? { containerImage: config.nodeHost.workerRuns.containerImage } : {},
			onCapacityChanged: (capacity) => {
				preparedContainerCapacity = capacity;
				publishContainerCapacity?.(capacity);
			}
		});
		try {
			await preparedContainerSupervisor.initialize();
			preparedContainerInitialized = true;
		} catch (error) {
			if (error instanceof NodeWorkerContainerContextMismatchError) await disablePreparedContainerHosting(error);
			else logDebug(`node-host: worker capacity reconciliation failed: ${String(error)}`);
		}
	} catch (error) {
		await disablePreparedContainerHosting(error);
	}
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
		pathEnv
	});
	const manifest = buildManifest(pluginNodeHost);
	const initialInventory = createInventory(skills, pluginNodeHost.nodePluginTools);
	return {
		manifest,
		workerHostingEnabled: workerRunsEnabled,
		...workerHostingDisabledReason ? { workerHostingDisabledReason } : {},
		initialInventory,
		start({ client, onInventoryChanged, onManifestChanged, onRunnerCapacityChanged, onWorkerHostingDisabled }) {
			const mcpAbort = new AbortController();
			let closing = false;
			let closePromise;
			let initializationRetry;
			const workerWorkspace = preparedContainerWorkspace ?? (workerRunsEnabled ? new NodeWorkerWorkspaceRuntime({ env }) : void 0);
			const workerBundleInstaller = workerRunsEnabled ? new NodeWorkerBundleInstaller({ env }) : void 0;
			let workerSupervisor = preparedContainerSupervisor ?? (workerRunsEnabled ? createNodeWorkerSupervisor({
				env,
				capacity: config.nodeHost?.workerRuns?.capacity,
				onCapacityChanged: onRunnerCapacityChanged,
				workspace: workerWorkspace
			}) : void 0);
			if (preparedContainerSupervisor) {
				publishContainerCapacity = onRunnerCapacityChanged;
				if (preparedContainerCapacity) onRunnerCapacityChanged?.(preparedContainerCapacity);
			}
			const initializeWorkerSupervisor = () => {
				const supervisor = workerSupervisor;
				if (!supervisor || closing) return;
				supervisor.initialize().catch(async (error) => {
					logDebug(`node-host: worker capacity reconciliation failed: ${String(error)}`);
					if (closing || workerSupervisor !== supervisor) return;
					if (error instanceof NodeWorkerContainerContextMismatchError) {
						workerSupervisor = void 0;
						onWorkerHostingDisabled?.(error.message);
						await supervisor.close().catch((closeError) => {
							logDebug(`node-host: worker supervisor cleanup failed: ${String(closeError)}`);
						});
						return;
					}
					initializationRetry = setTimeout(() => {
						initializationRetry = void 0;
						initializeWorkerSupervisor();
					}, WORKER_INITIALIZATION_RETRY_MS);
					initializationRetry.unref?.();
				});
			};
			if (workerSupervisor && !preparedContainerInitialized) initializeWorkerSupervisor();
			const skillBins = new SkillBinsCache(client, pathEnv);
			const activeInvokes = /* @__PURE__ */ new Map();
			let pluginDisconnectCleanup = Promise.resolve();
			const pluginCommandContext = {
				sendNodeEvent: async (event, payload) => await client.request("node.event", buildNodeEventParams(event, payload)),
				...workerWorkspace ? { acquireManagedWorkspace: (request) => workerWorkspace.acquireManagedWorkspace(request) } : {}
			};
			let currentPluginNodeHost = pluginNodeHost;
			let currentManifest = manifest;
			let gatewayConnection;
			let manager;
			const publishInventory = () => onInventoryChanged?.(createInventory(skills, currentPluginNodeHost.nodePluginTools, manager?.descriptors));
			const startup = startNodeHostMcpManager(config.nodeHost?.mcp?.servers, {
				signal: mcpAbort.signal,
				onDescriptorsChanged: () => {
					if (!closing && manager) publishInventory();
				}
			}).then((resolved) => {
				manager = resolved;
				if (!closing) publishInventory();
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
				publishInventory();
			};
			const stopAvailabilityWatch = onManifestChanged ? watchRegisteredNodeHostCommandAvailability(availabilityContext, refreshAvailability) : () => {};
			if (onManifestChanged) refreshAvailability();
			return {
				async invoke(frame) {
					await pluginDisconnectCleanup;
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
					const framedIo = input && progress ? createNodeDuplexEndpoint({
						sendFrame: async (payloadJSON) => await progress.write(payloadJSON),
						onError: (error) => {
							active.framedFailure = error;
							controller.abort(error);
						}
					}) : void 0;
					if (framedIo) controller.signal.addEventListener("abort", () => framedIo.close(), { once: true });
					let framedInputRegistered = false;
					const pluginCommandIo = input && progress && framedIo ? {
						signal: controller.signal,
						emitChunk: async (chunk) => await progress.write(chunk),
						onInput: (callback) => {
							if (activeInvokes.get(frame.id) === active) registerNodeInvokeInputHandler(input, callback);
						},
						frames: {
							send: async (message) => await framedIo.send(message),
							onMessage: (callback) => {
								const unsubscribe = framedIo.onMessage(callback);
								if (!framedInputRegistered) {
									framedInputRegistered = true;
									registerNodeInvokeInputHandler(input, (payloadJSON) => {
										try {
											framedIo.receive(payloadJSON);
										} catch (error) {
											controller.abort(error);
										}
									});
									framedIo.sendReady().catch(controller.abort.bind(controller));
								}
								return unsubscribe;
							}
						}
					} : void 0;
					try {
						await handleInvoke(frame, client, skillBins, manager, {
							...claudePath ? { claudePath } : {},
							signal: controller.signal,
							pluginCommandIo,
							flushPluginCommandIo: framedIo?.drain,
							canReportAbortedFailure: (error) => controller.signal.aborted && error === active.framedFailure && error === controller.signal.reason && activeInvokes.get(frame.id) === active,
							...gatewayConnection?.url ? { gatewayUrl: gatewayConnection.url } : {},
							...gatewayConnection?.tlsFingerprint ? { gatewayTlsFingerprint: gatewayConnection.tlsFingerprint } : {},
							...gatewayConnection?.cloudflareAccess ? { gatewayCloudflareAccess: gatewayConnection.cloudflareAccess } : {},
							...config.desktop?.host ? { desktopHostConfig: config.desktop.host } : {},
							...progress ? { emitProgress: (text) => progress.write(text) } : {},
							installedAppsSharingEnabled,
							installedAppsPlatform: platform,
							pluginCommandContext,
							...workerBundleInstaller ? { workerBundleInstaller } : {},
							...workerSupervisor ? { workerSupervisor } : {},
							...workerWorkspace ? { workerWorkspace } : {}
						});
					} finally {
						framedIo?.close();
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
					pluginDisconnectCleanup = pluginDisconnectCleanup.then(async () => await notifyRegisteredNodeHostCommandDisconnect()).catch((error) => {
						logDebug(`node-host: plugin disconnect cleanup failed: ${String(error)}`);
					});
				},
				updateGatewayConnection(connection) {
					gatewayConnection = connection;
				},
				close() {
					if (closePromise) return closePromise;
					closing = true;
					if (initializationRetry) {
						clearTimeout(initializationRetry);
						initializationRetry = void 0;
					}
					this.cancelAll();
					const preludeErrors = [];
					try {
						stopAvailabilityWatch();
					} catch (error) {
						preludeErrors.push(error);
					}
					mcpAbort.abort();
					const disconnectClose = pluginDisconnectCleanup;
					const supervisorClose = Promise.resolve().then(() => workerSupervisor?.close());
					const mcpClose = startup.then((resolved) => resolved.close());
					closePromise = Promise.allSettled([
						disconnectClose,
						supervisorClose,
						mcpClose
					]).then((results) => {
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
		for (const notice of result?.notices ?? []) log.info(notice);
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
function writeStderrLine(message) {
	process.stderr.write(`${message}\n`);
}
const NODE_HOST_EXIT_ON_RECONNECT_PAUSE_CODES = /* @__PURE__ */ new Set([
	ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
	ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH,
	ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
	ConnectErrorDetailCodes.AUTH_IDENTITY_HEADER_REQUIRED,
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
	copyConfigResolutionFactsExcept(config, nextConfig, ["gateway.remote.token", "gateway.remote.password"]);
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
	const cfg = getRuntimeConfig();
	const plannedGateway = {
		host: opts.gatewayHost,
		port: opts.gatewayPort,
		tls: opts.gatewayTls ?? cfg.gateway?.tls?.enabled ?? false,
		tlsFingerprint: opts.gatewayTlsFingerprint,
		contextPath: opts.gatewayContextPath,
		cloudflareAccess: opts.gatewayCloudflareAccess
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
	const gatewayCandidates = opts.gatewayCandidates?.length ? opts.gatewayCandidates.map((candidate, index) => index === 0 && gateway.cloudflareAccess && !candidate.cloudflareAccess ? {
		...candidate,
		cloudflareAccess: gateway.cloudflareAccess
	} : candidate) : [gateway];
	if (gatewayCandidates.find((candidate) => candidate.cloudflareAccess && candidate.tls !== true)) throw new Error("Cloudflare Access credentials require a TLS Gateway connection");
	const resolvedCloudflareAccess = await Promise.all(gatewayCandidates.map(async (candidate) => await resolveNodeHostCloudflareAccess({
		value: candidate.cloudflareAccess,
		config: cfg,
		env: process.env
	})));
	const cloudflareAccessByCandidate = /* @__PURE__ */ new Map();
	gatewayCandidates.forEach((candidate, index) => {
		const credentials = resolvedCloudflareAccess[index];
		if (credentials) cloudflareAccessByCandidate.set(candidate, credentials);
	});
	const preparedRuntime = await prepareNodeHostRuntime({
		config: cfg,
		env: process.env,
		enableAgentRuns: true,
		enableWorkerRuns: true,
		forceWorkerRuns: opts.forceWorkerRuns,
		installedAppsSharingEnabled: config.installedAppsSharing
	});
	let workerHostingEnabled = preparedRuntime.workerHostingEnabled;
	if (preparedRuntime.workerHostingDisabledReason) writeStderrLine(`node host worker hosting disabled: ${preparedRuntime.workerHostingDisabledReason}`);
	const { token, password } = opts.gatewayBootstrapToken ? {} : await resolveNodeHostGatewayCredentials({
		config: cfg,
		env: process.env
	});
	let inventory = preparedRuntime.initialInventory;
	let workerCapacity;
	let gatewayHelloReceived = false;
	let consecutivePermanentGatewayRejections = 0;
	let gatewayConnectionGeneration = 0;
	let connectedGatewayProtocol = 0;
	let gatewayCapabilities = /* @__PURE__ */ new Set();
	let optionalPublicationStates = /* @__PURE__ */ new Map();
	const retireOptionalPublications = () => {
		for (const state of optionalPublicationStates.values()) if (state.retryTimer) clearTimeout(state.retryTimer);
		optionalPublicationStates.clear();
	};
	const retireGatewayConnection = () => {
		gatewayConnectionGeneration += 1;
		gatewayHelloReceived = false;
		connectedGatewayProtocol = 0;
		gatewayCapabilities = /* @__PURE__ */ new Set();
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
			workerHost: workerHostingEnabled && workerCapacity ? {
				enabled: true,
				capacity: workerCapacity,
				bundlePrewarm: 1,
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_RETENTION) ? { bundleRetention: 1 } : {},
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_RETENTION) && gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_STATUS) ? { bundleStatus: 1 } : {},
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_PORTAL_STREAM) ? { portalStream: 1 } : {},
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_ENVIRONMENT_SESSION) ? { environmentSession: 1 } : {}
			} : { enabled: false }
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
		cloudflareAccessByCandidate,
		clientOptions: {
			token: token || void 0,
			bootstrapToken: opts.gatewayBootstrapToken,
			preferBootstrapToken: opts.preferGatewayBootstrapToken,
			password: password || void 0,
			instanceId: nodeId,
			clientName: GATEWAY_CLIENT_NAMES.NODE_HOST,
			clientDisplayName: displayName,
			clientVersion: VERSION,
			...resolveNodeHostGatewayPlatformIdentity(process.platform),
			mode: GATEWAY_CLIENT_MODES.NODE,
			role: "node",
			scopes: [],
			caps: preparedRuntime.manifest.caps,
			commands: preparedRuntime.manifest.commands,
			computerUse: preparedRuntime.manifest.computerUse,
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
		onHelloOk: (hello, url, tlsFingerprint, cloudflareAccess) => {
			consecutivePermanentGatewayRejections = 0;
			writeStderrLine(`node host gateway connected: ${url}`);
			activeRuntime.updateGatewayConnection({
				url,
				...tlsFingerprint ? { tlsFingerprint } : {},
				...cloudflareAccess ? { cloudflareAccess } : {}
			});
			gatewayConnectionGeneration += 1;
			gatewayHelloReceived = true;
			connectedGatewayProtocol = hello.protocol;
			gatewayCapabilities = new Set(hello.features?.capabilities);
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
			const rejection = error instanceof GatewayClientRequestError && isRecord(error.details) ? error.details : void 0;
			if (rejection?.reason !== "websocket-upgrade-rejected" || rejection.httpStatus !== 403 || rejection.gatewayErrorType !== "proxy_attribution_required") {
				consecutivePermanentGatewayRejections = 0;
				return;
			}
			if (++consecutivePermanentGatewayRejections < 3) return;
			const remediation = typeof rejection.gatewayErrorMessage === "string" ? rejection.gatewayErrorMessage : error.message;
			writeStderrLine(`node host gateway permanently rejected connection (${rejection.gatewayErrorType}): ${remediation}; exiting`);
			finish(1);
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
		onRunnerCapacityChanged: (capacity) => {
			workerCapacity = capacity;
			publishRunnerInventory();
		},
		onWorkerHostingDisabled: (reason) => {
			workerHostingEnabled = false;
			writeStderrLine(`node host worker hosting disabled: ${reason}`);
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
/** Managed node-host install plan builder. */
function buildNodeInstallEnvironmentValueSources() {
	return {
		OPENCLAW_GATEWAY_TOKEN: "file",
		OPENCLAW_GATEWAY_PASSWORD: "file",
		CF_ACCESS_CLIENT_ID: "file",
		CF_ACCESS_CLIENT_SECRET: "file"
	};
}
/** Builds launch arguments, environment, and metadata for a managed node-host service install. */
async function buildNodeInstallPlan(params) {
	const { devMode, runtimePath } = await resolveDaemonInstallRuntimeInputs({
		env: params.env,
		runtime: params.runtime,
		devMode: params.devMode,
		runtimePath: params.runtimePath
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
		runtime: params.runtime,
		runtimePath
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
			extraPathDirs: resolveDaemonRuntimeBinDir(runtimePath)
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
function resolveNodeGatewayOptions(options, config, pair, env = process.env) {
	const baselineHost = pair?.host ?? config?.gateway?.host ?? "127.0.0.1";
	const baselinePort = pair?.port ?? config?.gateway?.port ?? 18789;
	const host = normalizeOptionalString(options.host) || baselineHost;
	const port = options.port === void 0 ? baselinePort : parsePort(options.port);
	const endpointChanged = host !== baselineHost || port !== null && port !== baselinePort;
	const baselineTlsFingerprint = pair?.tlsFingerprint ?? config?.gateway?.tlsFingerprint;
	const selectedTlsFingerprint = options.tls === false ? void 0 : options.tlsFingerprint !== void 0 ? options.tlsFingerprint : endpointChanged ? void 0 : baselineTlsFingerprint;
	const baselineTls = pair?.tls ?? config?.gateway?.tls;
	const tlsFingerprint = selectedTlsFingerprint ? requireTlsFingerprint(selectedTlsFingerprint) : void 0;
	const tls = typeof options.tls === "boolean" ? options.tls : Boolean(tlsFingerprint) || (endpointChanged ? void 0 : baselineTls);
	const contextPath = normalizeOptionalString(options.contextPath) ?? (options.contextPath !== void 0 || endpointChanged ? void 0 : pair?.contextPath ?? config?.gateway?.contextPath);
	const hasExplicitEndpoint = options.host !== void 0 || options.port !== void 0 || options.contextPath !== void 0 || options.tls !== void 0 || options.tlsFingerprint !== void 0;
	const savedGatewayMatchesBaseline = !pair || config?.gateway !== void 0 && nodeHostGatewaysShareOrigin(config.gateway, pair.candidates[0]);
	const cloudflareAccess = (!endpointChanged && savedGatewayMatchesBaseline ? config?.gateway?.cloudflareAccess : void 0) ?? nodeHostCloudflareAccessConfigFromEnv(env);
	return {
		host,
		port,
		contextPath,
		tls,
		tlsFingerprint,
		cloudflareAccess,
		gatewayCandidates: pair && !hasExplicitEndpoint ? pair.candidates.map((candidate, index) => index === 0 && cloudflareAccess ? {
			...candidate,
			cloudflareAccess
		} : candidate) : void 0
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
	const config = await loadNodeHostConfig();
	let gatewayOptions;
	try {
		gatewayOptions = resolveNodeGatewayOptions(opts, config);
	} catch (error) {
		fail(error instanceof Error ? error.message : String(error));
		return;
	}
	const { host, port, contextPath, tls, tlsFingerprint, cloudflareAccess } = gatewayOptions;
	if (!Number.isFinite(port ?? NaN) || (port ?? 0) <= 0 || (port ?? 0) > 65535) {
		fail(opts.port !== void 0 ? formatInvalidPortOption("--port") : formatInvalidConfigPort("node.gateway.port"));
		return;
	}
	if (opts.tls === false && opts.tlsFingerprint !== void 0) {
		fail("--no-tls cannot be combined with --tls-fingerprint");
		return;
	}
	if (cloudflareAccess && tls !== true) {
		fail("Cloudflare Access credentials require --tls for the node Gateway connection");
		return;
	}
	const runtimeRaw = opts.runtime ? opts.runtime : DEFAULT_GATEWAY_DAEMON_RUNTIME;
	if (!isGatewayDaemonRuntime(runtimeRaw)) {
		fail("Invalid --runtime (use \"node\" or \"bun\")");
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
		fail(`Node service check failed: ${formatErrorMessage(err)}`);
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
		const message = `Node service check failed: ${formatErrorMessage(error)}`;
		if (json) throw new Error(message, { cause: error });
		defaultRuntime.error(message);
		defaultRuntime.exit(1);
		return;
	}
	const [command, runtime] = await Promise.all([service.readCommand(process.env).catch(() => null), service.readRuntime(process.env).catch((err) => ({
		status: "unknown",
		detail: formatErrorMessage(err)
	}))]);
	const payload = { service: {
		...buildDaemonServiceSnapshot(service, loaded),
		command,
		runtime
	} };
	if (json) {
		const safeEnvironment = filterDaemonEnv(command?.environment);
		const publicCommand = command && {
			...command,
			environment: Object.keys(safeEnvironment).length > 0 ? safeEnvironment : void 0
		};
		if (publicCommand) {
			delete publicCommand.managedDefinition;
			delete publicCommand.managedOverrides;
		}
		defaultRuntime.writeJson({ service: {
			...payload.service,
			command: publicCommand
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
