import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { n as canonicalPathFromExistingAncestor } from "./absolute-path-CYFPfAjt.js";
import "./fs-safe-CmrQUApq.js";
import { d as resolveConfigDir, m as shortenHomePath, p as shortenHomeInString } from "./utils-Bw16L5tB.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { f as resolveConfigPath, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-DNxmF3kK.js";
import { l as resolveSessionTranscriptsDirForAgent } from "./paths-DVAvlIOc.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-CL_-T11Y.js";
import { t as ConnectErrorDetailCodes, u as readConnectErrorDetailCode } from "./connect-error-details-Dxf1zdDX.js";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-l0wakFAx.js";
import { n as probeGateway } from "./probe-BciXecJ6.js";
import "./control-ui-links-CTWv3QrL.js";
import { p as ensureAgentWorkspace } from "./workspace-DJ__UUS2.js";
import { r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import { t as printClawBanner } from "./claw-banner-6G1-bTt6.js";
import "./detect-binary-T1YoxrQG.js";
import "./browser-open-DkrpjQE8.js";
import { c as removeWorkspaceDirs, i as moveToTrash, r as listAgentSessionDirs } from "./cleanup-utils-DBlaUZGP.js";
import path from "node:path";
import fs from "node:fs/promises";
import { inspect } from "node:util";
import { cancel, isCancel } from "@clack/prompts";
//#region src/commands/onboard-helpers.ts
/** Shared helpers for onboarding, reset, gateway checks, and wizard output. */
/** Handles Clack cancellation by exiting through the runtime. */
function guardCancel(value, runtime, exitCode = 0) {
	if (isCancel(value)) {
		cancel(stylePromptTitle("Setup cancelled.") ?? "Setup cancelled.");
		runtime.exit(exitCode);
		throw new Error("unreachable");
	}
	return value;
}
/** Summarizes existing config values before onboarding overwrites or reuses them. */
function summarizeExistingConfig(config) {
	const rows = [];
	const defaults = config.agents?.defaults;
	if (defaults?.workspace) rows.push(shortenHomeInString(`Workspace: ${defaults.workspace}`));
	if (defaults?.model) {
		const model = resolveAgentModelPrimaryValue(defaults.model);
		if (model) rows.push(shortenHomeInString(`Model: ${model}`));
	}
	const gatewaySummary = summarizeGatewayConfig(config);
	if (gatewaySummary) rows.push(shortenHomeInString(gatewaySummary));
	if (config.skills?.install?.nodeManager) rows.push(shortenHomeInString(`Node manager: ${config.skills.install.nodeManager}`));
	return rows.length ? rows.join("\n") : "No key settings detected.";
}
function summarizeGatewayConfig(config) {
	const gateway = config.gateway;
	if (!gateway?.mode && typeof gateway?.port !== "number" && !gateway?.bind && !gateway?.remote?.url) return null;
	const mode = normalizeOptionalString(gateway.mode);
	const bind = formatGatewayBind(gateway.bind);
	const remoteUrl = normalizeOptionalString(gateway.remote?.url);
	const useRemoteUrl = remoteUrl !== void 0 && mode !== "local";
	const endpoint = useRemoteUrl && remoteUrl ? remoteUrl : typeof gateway.port === "number" ? `:${gateway.port}` : void 0;
	const words = [];
	if (mode) words.push(mode);
	if (bind) words.push(mode ? `via ${bind}` : bind);
	if (mode === "remote" && !remoteUrl) {
		words.push("(missing remote URL)");
		return `Gateway: ${words.join(" ")}`;
	}
	if (endpoint) words.push(`${useRemoteUrl ? "at" : "on"} ${endpoint}`);
	return `Gateway: ${words.length > 0 ? words.join(" ") : "configured"}`;
}
function formatGatewayBind(value) {
	switch (value) {
		case "lan": return "LAN";
		case "loopback": return "loopback";
		case "tailnet": return "tailnet";
		case "auto": return "auto";
		case "custom": return "custom";
		default: return normalizeOptionalString(value);
	}
}
/** Normalizes gateway token prompts while rejecting JS stringification sentinels. */
function normalizeGatewayTokenInput(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	if (trimmed === "undefined" || trimmed === "null") return "";
	return trimmed;
}
/** Validates gateway password prompt input. */
function validateGatewayPasswordInput(value) {
	if (typeof value !== "string") return "Required";
	const trimmed = value.trim();
	if (!trimmed) return "Required";
	if (trimmed === "undefined" || trimmed === "null") return "Cannot be the literal string \"undefined\" or \"null\"";
}
/** Prints the onboarding banner: pixel mascot beside the OPENCLAW wordmark. */
async function printWizardHeader(runtime) {
	await printClawBanner(runtime);
}
/** Records wizard provenance metadata on config writes. */
function applyWizardMetadata(cfg, params) {
	const commit = normalizeOptionalString(process.env.GIT_COMMIT) ?? normalizeOptionalString(process.env.GIT_SHA);
	return inheritLegacyDefaultAgentId(cfg, {
		...cfg,
		wizard: {
			...cfg.wizard,
			lastRunAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastRunVersion: VERSION,
			lastRunCommit: commit,
			lastRunCommand: params.command,
			lastRunMode: params.mode
		}
	});
}
/** Formats the no-GUI SSH tunnel hint for opening the Control UI remotely. */
function formatControlUiSshHint(params) {
	const basePath = normalizeControlUiBasePath(params.basePath);
	const uiPath = basePath ? `${basePath}/` : "/";
	const localUrl = `${params.tlsEnabled ? "https" : "http"}://localhost:${params.port}${uiPath}`;
	const sshTarget = resolveSshTargetHint();
	return [
		"No GUI detected. Open from your computer:",
		`ssh -N -L ${params.port}:127.0.0.1:${params.port} ${sshTarget}`,
		"Then open:",
		localUrl,
		"BYOH note: lan, tailnet, and custom bind are currently IPv4-only.",
		"If your host is IPv6-only, use an IPv4 sidecar or proxy in front of the Gateway.",
		"Docs:",
		"https://docs.openclaw.ai/gateway/remote",
		"https://docs.openclaw.ai/web/control-ui"
	].filter(Boolean).join("\n");
}
function resolveSshTargetHint() {
	return `${process.env.USER || process.env.LOGNAME || "user"}@${(process.env.SSH_CONNECTION?.trim().split(/\s+/))?.[2] ?? "<host>"}`;
}
/** Ensures workspace bootstrap files and session transcript directories exist. */
async function ensureWorkspaceAndSessions(workspaceDir, runtime, options) {
	const ws = await ensureAgentWorkspace({
		dir: workspaceDir,
		ensureBootstrapFiles: !options?.skipBootstrap,
		skipOptionalBootstrapFiles: options?.skipOptionalBootstrapFiles
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDirForAgent(options.agentId);
	await fs.mkdir(sessionsDir, { recursive: true });
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
	return { bootstrapPending: ws.bootstrapPending === true };
}
async function assertFullResetPreservesOnboardingLock(workspaceDir) {
	const [workspacePath, migrationDir] = await Promise.all([canonicalPathFromExistingAncestor(path.resolve(workspaceDir)), canonicalPathFromExistingAncestor(path.join(resolveStateDir(), "migration"))]);
	if (workspacePath === migrationDir || isPathInside(workspacePath, migrationDir) || isPathInside(migrationDir, workspacePath)) throw new Error("Full reset workspace overlaps the active onboarding lock directory. Choose a workspace outside the OpenClaw state migration directory or use a narrower reset scope.");
}
/** Deletes onboarding-managed state according to the selected reset scope. */
async function handleReset(scope, workspaceDir, runtime) {
	if (scope === "full") await assertFullResetPreservesOnboardingLock(workspaceDir);
	const failures = [];
	const trashRequiredPath = async (targetPath) => {
		if (!await moveToTrash(targetPath, runtime)) failures.push(targetPath);
	};
	await trashRequiredPath(resolveConfigPath());
	if (scope === "config") {
		throwIfResetFailed(failures);
		return;
	}
	await trashRequiredPath(path.join(resolveConfigDir(), "credentials"));
	const stateDir = resolveStateDir();
	try {
		const sessionDirs = await listAgentSessionDirs(stateDir);
		for (const sessionDir of sessionDirs) await trashRequiredPath(sessionDir);
	} catch {
		failures.push(path.join(stateDir, "agents"));
	}
	if (scope === "full") failures.push(...await removeWorkspaceDirs([workspaceDir], runtime, {
		removeStateRows: true,
		removeWorkspace: (workspace) => moveToTrash(workspace, runtime)
	}));
	throwIfResetFailed(failures);
}
function throwIfResetFailed(failures) {
	const uniqueFailures = [...new Set(failures)];
	if (uniqueFailures.length > 0) throw new Error(`Reset failed to remove required state:\n${uniqueFailures.join("\n")}`);
}
function runOnboardingGatewayProbe(params, detailLevel) {
	const url = params.url.trim();
	const timeoutMs = params.timeoutMs ?? Math.max(1500, params.preauthHandshakeTimeoutMs ?? 0);
	return probeGateway({
		url,
		...params.config ? { config: params.config } : {},
		timeoutMs,
		auth: {
			token: params.token,
			password: params.password
		},
		...params.tlsFingerprint ? { tlsFingerprint: params.tlsFingerprint } : {},
		...params.preauthHandshakeTimeoutMs ? { preauthHandshakeTimeoutMs: params.preauthHandshakeTimeoutMs } : {},
		detailLevel
	});
}
/** Runs a single lightweight gateway probe for onboarding readiness checks. */
async function probeGatewayReachable(params) {
	try {
		const probe = await runOnboardingGatewayProbe(params, "none");
		if (!probe.ok) return {
			ok: false,
			detail: probe.error ?? void 0
		};
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			detail: summarizeError(err)
		};
	}
}
const RECOGNIZED_GATEWAY_CONNECT_ERROR_CODES = new Set(Object.values(ConnectErrorDetailCodes));
function didProbeReachGateway(probe) {
	const connectErrorCode = readConnectErrorDetailCode(probe.connectErrorDetails);
	const recognizedConnectError = connectErrorCode !== null && RECOGNIZED_GATEWAY_CONNECT_ERROR_CODES.has(connectErrorCode);
	const serverVersion = probe.server?.version?.trim();
	const serverConnectionId = probe.server?.connId?.trim();
	return recognizedConnectError || Boolean(serverVersion && serverConnectionId);
}
/** Reads only Gateway config and classifies whether its default agent has inference. */
async function probeGatewayConfiguredModel(params) {
	let probe;
	try {
		probe = await runOnboardingGatewayProbe(params, "config");
	} catch (err) {
		return {
			kind: "unreachable",
			detail: summarizeError(err)
		};
	}
	const detail = probe.error ?? void 0;
	if (!didProbeReachGateway(probe)) return {
		kind: "unreachable",
		...detail ? { detail } : {}
	};
	if (!probe.ok) return {
		kind: "reachable-unverified",
		detail
	};
	const snapshot = probe.configSnapshot;
	const configCandidate = snapshot?.valid === true ? snapshot.runtimeConfig ?? snapshot.config : null;
	if (!configCandidate || typeof configCandidate !== "object" || Array.isArray(configCandidate)) return {
		kind: "reachable-unverified",
		detail: "Gateway returned an invalid config snapshot"
	};
	try {
		const config = configCandidate;
		return resolveAgentEffectiveModelPrimary(config, resolveDefaultAgentId(config)) ? { kind: "configured" } : {
			kind: "missing-configured-model",
			detail: "Gateway default agent has no configured model"
		};
	} catch {
		return {
			kind: "reachable-unverified",
			detail: "Gateway returned an invalid config snapshot"
		};
	}
}
/** Polls gateway reachability until success or deadline. */
async function waitForGatewayReachable(params) {
	const deadlineMs = params.deadlineMs ?? 15e3;
	const pollMs = resolveTimerTimeoutMs(params.pollMs ?? 400, 400, 0);
	const probeTimeoutMs = params.probeTimeoutMs ?? 1500;
	const startedAt = Date.now();
	let lastDetail;
	while (Date.now() - startedAt < deadlineMs) {
		const probe = await probeGatewayReachable({
			url: params.url,
			token: params.token,
			password: params.password,
			timeoutMs: probeTimeoutMs
		});
		if (probe.ok) return probe;
		lastDetail = probe.detail;
		const remainingMs = deadlineMs - (Date.now() - startedAt);
		if (remainingMs <= 0) break;
		await sleep(Math.min(pollMs, remainingMs));
	}
	return {
		ok: false,
		detail: lastDetail
	};
}
function summarizeError(err) {
	let raw = "unknown error";
	if (err instanceof Error) raw = err.message || raw;
	else if (typeof err === "string") raw = err || raw;
	else if (err !== void 0) raw = inspect(err, { depth: 2 });
	const line = raw.split("\n").map((s) => s.trim()).find(Boolean) ?? raw;
	return line.length > 120 ? `${truncateUtf16Safe(line, 119)}…` : line;
}
/** Default workspace path shown by onboarding prompts. */
const DEFAULT_WORKSPACE = DEFAULT_AGENT_WORKSPACE_DIR;
//#endregion
export { guardCancel as a, printWizardHeader as c, summarizeExistingConfig as d, validateGatewayPasswordInput as f, formatControlUiSshHint as i, probeGatewayConfiguredModel as l, applyWizardMetadata as n, handleReset as o, waitForGatewayReachable as p, ensureWorkspaceAndSessions as r, normalizeGatewayTokenInput as s, DEFAULT_WORKSPACE as t, probeGatewayReachable as u };
