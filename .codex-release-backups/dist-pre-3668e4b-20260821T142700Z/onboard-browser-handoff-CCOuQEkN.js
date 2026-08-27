import "./utils-D9gvQMP6.js";
import { t as sleep } from "./sleep-Bd74jGcV.js";
import { i as GATEWAY_CLIENT_NAMES, n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { s as callGateway } from "./call-CZ1eu88h.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-BQ-2HR_Q.js";
import { t as resolveAdvertisedControlUiLinks } from "./control-ui-links--NOqSGLU.js";
import { n as openUrl } from "./browser-open-DKvmdQNZ.js";
import { a as formatControlUiSshHint } from "./onboard-helpers-CPYqMvEB.js";
import { n as t } from "./i18n-BzsUVhtU.js";
import { i as waitForControlUiDocument, n as issueControlUiBrowserHandoff, r as resolveControlUiHandoffTarget, t as hasVerifiedControlUiLoopbackAlias } from "./control-ui-handoff-Bv5LSgM3.js";
//#region src/commands/onboard-browser-handoff.ts
const GUI_HANDOFF_TIMEOUT_MS = 6e4;
const HEADLESS_HANDOFF_TIMEOUT_MS = 3e5;
const HANDOFF_POLL_INTERVAL_MS = 1e3;
const HANDOFF_PROBE_TIMEOUT_MS = 5e3;
function hasSshSession(env) {
	return Boolean(env.SSH_CONNECTION || env.SSH_TTY);
}
/** Pure graphical-session detection used before attempting a browser launch. */
function detectGraphicalSession(env, platform) {
	if (hasSshSession(env)) return false;
	if (platform === "darwin" || platform === "win32") return true;
	if (platform === "linux") return Boolean(env.DISPLAY || env.WAYLAND_DISPLAY);
	return false;
}
async function resolveBrowserHatchTarget(config, env) {
	const shared = await resolveControlUiHandoffTarget({
		config,
		env
	});
	const credentials = await resolveGatewayCredentialsWithSecretInputs({
		config,
		env,
		modeOverride: "local"
	});
	const authMode = !config.gateway?.auth?.mode && credentials.password ? "password" : shared.authMode;
	const token = authMode === "token" ? credentials.token : void 0;
	const setupAuthValue = authMode === "password" ? credentials.password : void 0;
	const target = {
		config,
		dashboardUrl: shared.links.httpUrl,
		documentUrl: shared.documentUrl,
		port: shared.port,
		...shared.loopbackAliasHost ? { loopbackAliasHost: shared.loopbackAliasHost } : {},
		...shared.tlsConfig ? { tlsConfig: shared.tlsConfig } : {},
		...shared.bind === "loopback" || shared.tlsConfig?.enabled !== true ? { sshHint: formatControlUiSshHint({
			port: shared.port,
			...shared.basePath ? { basePath: shared.basePath } : {}
		}) } : {},
		...token ? { token } : {}
	};
	if (setupAuthValue) target["password"] = setupAuthValue;
	return target;
}
function isConnectedControlUi(entry) {
	return entry.host === GATEWAY_CLIENT_IDS.CONTROL_UI && entry.mode === GATEWAY_CLIENT_MODES.WEBCHAT && entry.reason !== "disconnect";
}
function resolveConnectedControlUiPresenceKeys(entries) {
	return entries.filter(isConnectedControlUi).map((entry) => [
		entry.deviceId,
		entry.instanceId,
		entry.host,
		entry.mode
	].join("\0"));
}
async function probeDashboardPresence(target, timeoutMs) {
	try {
		return {
			reachable: true,
			clientKeys: resolveConnectedControlUiPresenceKeys(await callGateway({
				config: target.config,
				method: "system-presence",
				timeoutMs,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				mode: GATEWAY_CLIENT_MODES.CLI,
				...target.token ? { token: target.token } : {},
				...target.password ? { password: target.password } : {},
				expectFinal: false,
				ignoreEnvUrlOverride: true
			}) ?? [])
		};
	} catch (error) {
		return {
			reachable: false,
			reason: error instanceof Error ? error.message : String(error)
		};
	}
}
async function waitForDashboardClient(params) {
	const now = params.now ?? Date.now;
	const sleepFor = params.sleep ?? sleep;
	const deadline = now() + params.timeoutMs;
	while (true) {
		const beforeProbeMs = deadline - now();
		if (beforeProbeMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		const result = await params.probe(params.target, Math.min(HANDOFF_PROBE_TIMEOUT_MS, beforeProbeMs));
		if (!result.reachable) return {
			connected: false,
			reason: "gateway-unreachable"
		};
		if (result.clientKeys.some((key) => !params.baselineClientKeys.has(key))) return { connected: true };
		const remainingMs = deadline - now();
		if (remainingMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		await sleepFor(Math.min(HANDOFF_POLL_INTERVAL_MS, remainingMs));
	}
}
/** Opens or prints the dashboard and waits for its Control UI client connection. */
async function runBrowserHatchHandoff(params, deps = {}) {
	const env = deps.env ?? process.env;
	const graphical = detectGraphicalSession(env, deps.platform ?? process.platform);
	if (params.suppressTokenOutput === true || params.config.gateway?.controlUi?.enabled === false) return {
		handedOff: false,
		reason: "target-unavailable"
	};
	let target;
	try {
		target = await (deps.resolveTarget ?? resolveBrowserHatchTarget)(params.config, env);
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	}
	if (!await (deps.verifyLoopbackAlias ?? hasVerifiedControlUiLoopbackAlias)(target)) return {
		handedOff: false,
		reason: "target-unavailable"
	};
	let progress;
	try {
		if (!(await (deps.waitForDocument ?? waitForControlUiDocument)({
			url: target.documentUrl,
			tlsConfig: target.tlsConfig,
			onPending: () => {
				progress = params.prompter.progress(t("wizard.guided.controlUiPreparing"));
			}
		})).ready) return {
			handedOff: false,
			reason: "target-unavailable"
		};
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	} finally {
		progress?.stop();
	}
	const probePresence = deps.probePresence ?? probeDashboardPresence;
	const baseline = await probePresence(target, HANDOFF_PROBE_TIMEOUT_MS);
	if (!baseline.reachable) return {
		handedOff: false,
		reason: "gateway-unreachable"
	};
	let opened = false;
	if (graphical) try {
		const browserHandoff = await (deps.issueBrowserHandoff ?? issueControlUiBrowserHandoff)(target.dashboardUrl);
		opened = await (deps.openBrowser ?? openUrl)(browserHandoff.browserUrl);
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	}
	if (opened) await params.prompter.note(t("wizard.guided.browserHandoffOpening"), t("wizard.guided.browserHandoffTitle"));
	else {
		const bind = target.config.gateway?.bind;
		const remoteBind = bind === "lan" || bind === "tailnet" || bind === "custom";
		const directRemoteDisplay = !graphical && remoteBind && target.tlsConfig?.enabled === true;
		const tunnelHint = !graphical && !directRemoteDisplay ? target.sshHint ?? (remoteBind ? formatControlUiSshHint({
			port: target.port,
			...target.config.gateway?.controlUi?.basePath ? { basePath: target.config.gateway.controlUi.basePath } : {}
		}) : void 0) : void 0;
		const sshHint = tunnelHint ? `\n\n${tunnelHint}` : "";
		const visibleUrl = directRemoteDisplay ? (await resolveAdvertisedControlUiLinks({
			bind,
			port: target.port,
			customBindHost: target.config.gateway?.customBindHost,
			basePath: target.config.gateway?.controlUi?.basePath,
			tlsEnabled: target.tlsConfig?.enabled === true
		})).httpUrl : target.dashboardUrl;
		const authHint = target.token || target.password ? "\n\nIf prompted, enter your Gateway token or password from its configured secret source." : "";
		const pairingHint = directRemoteDisplay ? "\n\nIf device approval is required, run `openclaw devices list`, then `openclaw devices approve <requestId>`." : "";
		await params.prompter.note(`${t("wizard.guided.browserHandoffCopy", { url: visibleUrl })}${sshHint}${authHint}${pairingHint}`, t("wizard.guided.browserHandoffTitle"));
	}
	const wait = await (deps.pollForClient ?? waitForDashboardClient)({
		target,
		baselineClientKeys: new Set(baseline.clientKeys),
		timeoutMs: graphical ? GUI_HANDOFF_TIMEOUT_MS : HEADLESS_HANDOFF_TIMEOUT_MS,
		probe: probePresence,
		...deps.now ? { now: deps.now } : {},
		...deps.sleep ? { sleep: deps.sleep } : {}
	});
	if (!wait.connected) return {
		handedOff: false,
		reason: wait.reason
	};
	await params.prompter.note(t("wizard.guided.browserHandoffContinuing"), t("wizard.guided.browserHandoffTitle"));
	return { handedOff: true };
}
//#endregion
export { runBrowserHatchHandoff };
