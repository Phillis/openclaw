import { _ as resolveGatewayPort } from "./paths-CqeDjSA4.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { b as createConfigIO } from "./io-CeQckj5v.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BDz7f4XS.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-CQFyXoKe.js";
import "./config-Dl8DJbzM.js";
import { n as t } from "./i18n-BzsUVhtU.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { s as transformConfigWithPendingPluginInstalls } from "./install-record-commit-DQjHzbZN.js";
import chalk from "chalk";
//#region src/wizard/setup.security-note.ts
const heading = (text) => chalk.bold(text);
function getSecurityNoteTitle() {
	return t("wizard.security.title");
}
function getSecurityConfirmMessage() {
	return t("wizard.security.confirm");
}
function getSecurityNoteMessage() {
	return [
		t("wizard.security.attribution"),
		t("wizard.security.personalAgent"),
		t("wizard.security.toolAccess"),
		t("wizard.security.promptRisk"),
		"",
		t("wizard.security.notMultitenant"),
		t("wizard.security.sharedAuthority"),
		"",
		t("wizard.security.hardeningRequired"),
		t("wizard.security.askForHelp"),
		"",
		heading(t("wizard.security.recommendedBaseline")),
		`- ${t("wizard.security.baselinePairing")}`,
		`- ${t("wizard.security.baselineSharedInbox")}`,
		`- ${t("wizard.security.baselineSandbox")}`,
		`- ${t("wizard.security.baselineDmSessions")}`,
		`- ${t("wizard.security.baselineSecrets")}`,
		`- ${t("wizard.security.baselineStrongModel")}`,
		"",
		heading(t("wizard.security.runRegularly")),
		formatCliCommand("openclaw security audit --deep"),
		formatCliCommand("openclaw security audit --fix"),
		"",
		`${t("wizard.security.learnMore")} https://docs.openclaw.ai/gateway/security`
	].join("\n");
}
//#endregion
//#region src/wizard/setup.shared.ts
function hasQuickstartGatewayOverrides(overrides) {
	return overrides.gatewayPort !== void 0 || overrides.gatewayBind !== void 0 || overrides.gatewayAuth !== void 0 || overrides.gatewayToken !== void 0 || overrides.gatewayTokenRefEnv !== void 0 || overrides.gatewayPassword !== void 0 || overrides.tailscale !== void 0 || overrides.tailscaleResetOnExit !== void 0;
}
function formatQuickstartGatewaySummary(defaults, keepExisting) {
	const bind = {
		auto: t("wizard.gateway.bindAuto"),
		custom: t("wizard.gateway.bindCustom"),
		lan: t("wizard.gateway.bindLan"),
		loopback: t("wizard.gateway.bindLoopback"),
		tailnet: t("wizard.gateway.bindTailnet")
	}[defaults.bind];
	return [
		...keepExisting ? [t("wizard.setup.quickstartKeepSettings")] : [],
		t("wizard.setup.quickstartGatewayPort", { port: defaults.port }),
		t("wizard.setup.quickstartGatewayBind", { bind }),
		...defaults.bind === "custom" && defaults.customBindHost ? [t("wizard.setup.quickstartGatewayCustomIp", { host: defaults.customBindHost })] : [],
		t("wizard.setup.quickstartGatewayAuth", { auth: defaults.authMode === "token" ? t("wizard.setup.quickstartAuthTokenDefault") : t("common.password") }),
		t("wizard.setup.quickstartTailscaleExposure", { exposure: t(`wizard.gatewayTailscale.${defaults.tailscaleMode}`) }),
		t("wizard.setup.quickstartDirectChannels")
	].join("\n");
}
/**
* Config writes go through the pending-plugin-install commit helper so wizard
* flows never drop install records that a concurrent migration already staged.
*/
async function writeWizardConfigFile(config, opts = {}) {
	return (await transformConfigWithPendingPluginInstalls({
		...opts.baseHash !== void 0 ? { baseHash: opts.baseHash } : {},
		...opts.baseHash !== void 0 || opts.baseSnapshot ? { maxAttempts: 1 } : {},
		...opts.afterWrite ? { afterWrite: opts.afterWrite } : {},
		writeOptions: {
			...opts.writeOptions,
			...opts.allowConfigSizeDrop !== void 0 ? { allowConfigSizeDrop: opts.allowConfigSizeDrop } : {},
			...opts.baseSnapshot ? { baseSnapshot: opts.baseSnapshot } : {}
		},
		transform: (current) => ({ nextConfig: opts.mergeBase ? applyMergePatch(current, createMergePatch(opts.mergeBase, config)) : config })
	})).nextConfig;
}
async function readSetupConfigFileSnapshot() {
	return await createConfigIO({ pluginValidation: "skip" }).readConfigFileSnapshot();
}
async function readValidSetupConfigFile() {
	const snapshot = await readSetupConfigFileSnapshot();
	if (!snapshot.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor`.");
	return snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
}
/** One-time security acknowledgement; persisted so reruns stay quiet. */
async function requireRiskAcknowledgement(params) {
	if (params.config.wizard?.securityAcknowledgedAt) return params.config;
	if (params.opts.acceptRisk === true) return applySecurityAcknowledgement(params.config);
	await params.prompter.note(getSecurityNoteMessage(), getSecurityNoteTitle());
	if (!await params.prompter.confirm({
		message: getSecurityConfirmMessage(),
		initialValue: true,
		layout: "vertical"
	})) throw new WizardCancelledError(t("wizard.setup.riskNotAccepted"));
	return applySecurityAcknowledgement(params.config);
}
function applySecurityAcknowledgement(config) {
	if (config.wizard?.securityAcknowledgedAt) return config;
	return {
		...config,
		wizard: {
			...config.wizard,
			securityAcknowledgedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
/** Derive quickstart gateway defaults, preserving any existing gateway settings. */
function resolveQuickstartGatewayDefaults(baseConfig, overrides = {}) {
	const hasExisting = typeof baseConfig.gateway?.port === "number" || baseConfig.gateway?.bind !== void 0 || baseConfig.gateway?.auth?.mode !== void 0 || baseConfig.gateway?.auth?.token !== void 0 || baseConfig.gateway?.auth?.password !== void 0 || baseConfig.gateway?.customBindHost !== void 0 || baseConfig.gateway?.tailscale?.mode !== void 0;
	const bindRaw = baseConfig.gateway?.bind;
	const bind = bindRaw === "loopback" || bindRaw === "lan" || bindRaw === "auto" || bindRaw === "custom" || bindRaw === "tailnet" ? bindRaw : "loopback";
	let authMode = "token";
	if (baseConfig.gateway?.auth?.mode === "token" || baseConfig.gateway?.auth?.mode === "password") authMode = baseConfig.gateway.auth.mode;
	else if (baseConfig.gateway?.auth?.token) authMode = "token";
	else if (baseConfig.gateway?.auth?.password) authMode = "password";
	const tailscaleRaw = baseConfig.gateway?.tailscale?.mode;
	const tailscaleMode = tailscaleRaw === "off" || tailscaleRaw === "serve" || tailscaleRaw === "funnel" ? tailscaleRaw : "off";
	const explicitAuthMode = overrides.gatewayAuth ?? (overrides.gatewayToken !== void 0 || overrides.gatewayTokenRefEnv !== void 0 ? "token" : overrides.gatewayPassword !== void 0 ? "password" : void 0);
	return {
		hasExisting,
		port: overrides.gatewayPort ?? resolveGatewayPort(baseConfig),
		bind: overrides.gatewayBind ?? bind,
		authMode: explicitAuthMode ?? authMode,
		tailscaleMode: overrides.tailscale ?? tailscaleMode,
		token: overrides.gatewayTokenRefEnv !== void 0 ? {
			source: "env",
			provider: resolveDefaultSecretProviderAlias(baseConfig, "env", { preferFirstProviderForSource: true }),
			id: overrides.gatewayTokenRefEnv.trim()
		} : overrides.gatewayToken ?? baseConfig.gateway?.auth?.token,
		password: overrides.gatewayPassword ?? baseConfig.gateway?.auth?.password,
		customBindHost: baseConfig.gateway?.customBindHost,
		tailscaleResetOnExit: overrides.tailscaleResetOnExit ?? baseConfig.gateway?.tailscale?.resetOnExit ?? false
	};
}
//#endregion
export { requireRiskAcknowledgement as a, readValidSetupConfigFile as i, hasQuickstartGatewayOverrides as n, resolveQuickstartGatewayDefaults as o, readSetupConfigFileSnapshot as r, writeWizardConfigFile as s, formatQuickstartGatewaySummary as t };
