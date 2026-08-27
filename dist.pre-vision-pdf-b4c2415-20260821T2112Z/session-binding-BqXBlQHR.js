import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as parseBooleanValue } from "./boolean-DmBL0YJK.js";
import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { g as resolveSessionAgentIds } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { f as resolveDefaultAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { An as preprocess, At as boolean, Bt as discriminatedUnion, Et as array, Lt as custom, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { m as normalizeResolvedSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BdBosV0l.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import { r as ensureAuthProfileStore } from "./store-BH6qiWJF.js";
import { n as detectWindowsSpawnCommandInlineArgs } from "./windows-spawn-zZP1Z6cM.js";
import { g as AgentHarnessSessionSupersededError, h as AgentHarnessPreflightError } from "./failover-error-EKvoWJQa.js";
import { r as resolveExecApprovalsFromFile } from "./exec-approvals-DkNiV-ux.js";
import { t as log } from "./logger-XkrUQwkD.js";
import { m as resolveStorePath, r as getSessionEntry } from "./session-store-runtime-BsqwEEwm.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import { r as buildSecretInputSchema } from "./secret-input-Dv7SE4A5.js";
import "./agent-harness-runtime-CrWeZgVC.js";
import "./agent-runtime-BWHKIUtK.js";
import { t as parse$1 } from "./parse-CeAA4y4S.js";
import "./exec-approvals-runtime-DVqaMbUB.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir, hostname } from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/codex/src/app-server/config-utils.ts
const START_OPTIONS_KEY_SECRET_SYMBOL = Symbol.for("openclaw.codexAppServerStartOptionsKeySecret");
const START_OPTIONS_KEY_SECRET = getStartOptionsKeySecret();
const PLAIN_DECIMAL_NUMBER_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))$/;
function normalizeCodexServiceTier(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const normalized = trimmed.toLowerCase();
	if (normalized === "fast" || normalized === "priority") return "priority";
	if (normalized === "flex") return "flex";
	return trimmed;
}
function isCodexFastServiceTier(value) {
	return normalizeCodexServiceTier(value) === "priority";
}
function normalizePositiveNumber(value, fallback) {
	return resolvePositiveTimerTimeoutMs(value, fallback);
}
function normalizeHeaders(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	return Object.fromEntries(Object.entries(value).map(([key, child]) => [key.trim(), normalizeCodexAppServerSecretInput({
		value: child,
		path: `plugins.entries.codex.config.appServer.headers.${key}`
	})]).filter((entry) => Boolean(entry[0] && entry[1])));
}
function normalizeCodexAppServerSecretInput(params) {
	return normalizeResolvedSecretInputString(params);
}
function readBooleanEnv(value) {
	return parseBooleanValue(value);
}
function readExecSecurity(value) {
	return value === "deny" || value === "allowlist" || value === "full" ? value : void 0;
}
function readExecAsk(value) {
	return value === "off" || value === "on-miss" || value === "always" ? value : void 0;
}
function readNumberEnv(value) {
	const trimmed = value?.trim();
	if (!trimmed || !PLAIN_DECIMAL_NUMBER_RE.test(trimmed)) return;
	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function resolveArgs(configArgs, envArgs) {
	if (Array.isArray(configArgs)) return configArgs.map((entry) => normalizeOptionalString(entry)).filter((entry) => entry !== void 0);
	if (typeof configArgs === "string") return splitShellWords(configArgs);
	return splitShellWords(envArgs ?? "");
}
function hashSecretForKey(value, label) {
	if (!value) return null;
	return createHmac("sha256", START_OPTIONS_KEY_SECRET).update(label).update("\0").update(value).digest("hex");
}
function getStartOptionsKeySecret() {
	const globalState = globalThis;
	globalState[START_OPTIONS_KEY_SECRET_SYMBOL] ??= randomBytes(32);
	return globalState[START_OPTIONS_KEY_SECRET_SYMBOL];
}
function splitShellWords(value) {
	const words = [];
	let current = "";
	let quote = null;
	for (const char of value) {
		if (quote) {
			if (char === quote) quote = null;
			else current += char;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (/\s/.test(char)) {
			if (current) {
				words.push(current);
				current = "";
			}
			continue;
		}
		current += char;
	}
	if (current) words.push(current);
	return words;
}
//#endregion
//#region extensions/codex/src/app-server/config-exec-policy.ts
function selectForcedPromptingSandbox(params) {
	if (params.configuredSandbox === "read-only" || params.defaultSandbox === "read-only") return "read-only";
	return params.defaultSandbox ?? "workspace-write";
}
function selectForcedDangerFullAccessSandbox(params) {
	if (params.configuredSandbox === "read-only") return "read-only";
	if (params.defaultPolicy?.dangerFullAccessAllowed === false) {
		if (params.openClawSandboxActive) return params.defaultPolicy.sandbox ?? "workspace-write";
		throw new Error("legacy full exec security with ask requires Codex app-server danger-full-access");
	}
	return "danger-full-access";
}
function selectGuardianSandbox(allowedSandboxModes) {
	if (allowedSandboxModes === void 0 || allowedSandboxModes.has("workspace-write")) return "workspace-write";
	if (allowedSandboxModes.has("read-only")) return "read-only";
	if (allowedSandboxModes.has("danger-full-access")) return "danger-full-access";
	return "workspace-write";
}
function resolveApprovalPolicy(value) {
	if (value === "on-failure") return "on-request";
	return value === "on-request" || value === "untrusted" || value === "never" ? value : void 0;
}
function resolveSandbox(value) {
	return value === "read-only" || value === "workspace-write" || value === "danger-full-access" ? value : void 0;
}
function resolveApprovalsReviewer(value) {
	return value === "auto_review" || value === "guardian_subagent" || value === "user" ? value : void 0;
}
function resolveOpenClawExecPolicyFromConfig(params) {
	const root = asOptionalRecord(params.config);
	const globalExec = asOptionalRecord(asOptionalRecord(root?.tools)?.exec);
	const globalPolicy = applyOpenClawExecPolicyLayer(createDefaultOpenClawExecPolicy(), globalExec);
	const agentId = params.agentId?.trim();
	if (!agentId) return globalPolicy;
	const agents = asOptionalRecord(root?.agents);
	const agentList = Array.isArray(agents?.list) ? agents.list : [];
	const normalizedAgentId = normalizeAgentId(agentId);
	return applyOpenClawExecPolicyLayer(globalPolicy, asOptionalRecord(asOptionalRecord(asOptionalRecord(agentList.find((entry) => {
		const id = asOptionalRecord(entry)?.id;
		return typeof id === "string" && normalizeAgentId(id) === normalizedAgentId;
	}))?.tools)?.exec));
}
function resolveOpenClawExecPolicyForCodexAppServer(params) {
	const overridePolicy = applyOpenClawExecPolicyLayer(resolveOpenClawExecPolicyFromConfig({
		config: params.config,
		agentId: params.agentId
	}), params.execOverrides);
	return applyOpenClawExecApprovalFloors(overridePolicy, resolveOpenClawExecApprovalFloorsForCodexAppServer({
		approvals: params.approvals,
		agentId: params.agentId,
		policy: overridePolicy
	}));
}
function resolveEffectiveOpenClawExecModeForCodexAppServer(params) {
	if (params.execPolicy?.touched === true) return params.execPolicy.mode;
	return params.execMode;
}
function resolveCodexPolicyModeForOpenClawExecMode(mode) {
	if (!mode || mode === "full") return;
	return "guardian";
}
function assertCodexAppServerAllowedForOpenClawExecMode(mode) {
	if (mode === "deny" || mode === "allowlist") throw new AgentHarnessPreflightError(`Codex app-server local execution is unavailable because effective tools.exec.mode=${mode}. Execution-host approvals are authoritative. For gateway turns, inspect them with \`openclaw approvals get --gateway\` and update that same target with \`openclaw approvals set --gateway --stdin\`; for local \`agent exec\`, omit \`--gateway\`. Intentionally align that host policy before retrying.`, { scope: "harness" });
}
function createDefaultOpenClawExecPolicy() {
	return {
		security: "full",
		ask: "off",
		touched: false
	};
}
function applyOpenClawExecPolicyLayer(base, exec) {
	if (!exec) return base;
	const mode = readExecMode(exec.mode);
	if (mode !== void 0) return {
		...resolveOpenClawExecPolicyForMode(mode),
		touched: true
	};
	const security = readExecSecurity(exec.security);
	const ask = readExecAsk(exec.ask);
	if (security === void 0 && ask === void 0) return base;
	const nextSecurity = security ?? base.security;
	const nextAsk = ask ?? base.ask;
	return {
		mode: resolveOpenClawExecModeFromPolicy({
			security: nextSecurity,
			ask: nextAsk
		}),
		security: nextSecurity,
		ask: nextAsk,
		touched: true
	};
}
function resolveOpenClawExecApprovalFloorsForCodexAppServer(params) {
	if (!params.approvals) return;
	return resolveExecApprovalsFromFile({
		file: params.approvals,
		agentId: params.agentId,
		overrides: {
			security: params.policy.security,
			ask: params.policy.ask
		}
	}).agent;
}
function applyOpenClawExecApprovalFloors(base, approvalFloors) {
	if (!approvalFloors) return base;
	const nextSecurity = approvalFloors.security ? minOpenClawExecSecurity(base.security, approvalFloors.security) : base.security;
	const nextAsk = approvalFloors.ask ? maxOpenClawExecAsk(base.ask, approvalFloors.ask) : base.ask;
	if (nextSecurity === base.security && nextAsk === base.ask) return base;
	return {
		mode: resolveOpenClawExecModeFromPolicy({
			security: nextSecurity,
			ask: nextAsk
		}),
		security: nextSecurity,
		ask: nextAsk,
		touched: true
	};
}
function resolveOpenClawExecPolicyForMode(mode) {
	switch (mode) {
		case "deny": return {
			mode,
			security: "deny",
			ask: "off"
		};
		case "allowlist": return {
			mode,
			security: "allowlist",
			ask: "off"
		};
		case "ask":
		case "auto": return {
			mode,
			security: "allowlist",
			ask: "on-miss"
		};
		case "full": return {
			mode,
			security: "full",
			ask: "off"
		};
	}
	return mode;
}
function resolveOpenClawExecModeFromPolicy(params) {
	if (params.security === "deny") return "deny";
	if (params.security === "allowlist" && params.ask === "off") return "allowlist";
	if (params.security === "full" && params.ask !== "always") return "full";
	return "ask";
}
function minOpenClawExecSecurity(left, right) {
	const order = {
		deny: 0,
		allowlist: 1,
		full: 2
	};
	return order[left] <= order[right] ? left : right;
}
function maxOpenClawExecAsk(left, right) {
	const order = {
		off: 0,
		"on-miss": 1,
		always: 2
	};
	return order[left] >= order[right] ? left : right;
}
function readExecMode(value) {
	return value === "deny" || value === "allowlist" || value === "ask" || value === "auto" || value === "full" ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/config-requirements.ts
const UNIX_CODEX_REQUIREMENTS_PATH = "/etc/codex/requirements.toml";
const WINDOWS_CODEX_REQUIREMENTS_SUFFIX = "\\OpenAI\\Codex\\requirements.toml";
function isCodexAppServerApprovalPolicyAllowedByRequirements(policy, params = {}) {
	const content = readCodexRequirementsToml(params);
	if (content === void 0) return true;
	const allowedApprovalPolicies = parseAllowedApprovalPoliciesFromCodexRequirements(content);
	return allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has(policy);
}
function readCodexRequirementsToml(params) {
	if (params.requirementsToml !== void 0) return params.requirementsToml ?? void 0;
	const requirementsPath = normalizeOptionalString(params.requirementsPath) ?? resolveCodexRequirementsPath(params.env ?? process.env, params.platform ?? process.platform);
	try {
		if (params.readRequirementsFile) return params.readRequirementsFile(requirementsPath);
		return readFileSync(requirementsPath, "utf8");
	} catch {
		return;
	}
}
function resolveCodexRequirementsPath(env, platform) {
	if (platform === "win32") return `${(normalizeOptionalString(env.ProgramData) ?? "C:\\ProgramData").replace(/[\\/]+$/, "")}${WINDOWS_CODEX_REQUIREMENTS_SUFFIX}`;
	return UNIX_CODEX_REQUIREMENTS_PATH;
}
function parseAllowedSandboxModesFromCodexRequirements(content, hostName) {
	const remoteSandboxModes = parseMatchingRemoteSandboxModesFromCodexRequirements(content, hostName);
	if (remoteSandboxModes !== void 0) return remoteSandboxModes;
	return parseRequirementsSandboxModes(parseTopLevelRequirementsStringArray(content, "allowed_sandbox_modes"));
}
function parseAllowedApprovalPoliciesFromCodexRequirements(content) {
	const values = parseTopLevelRequirementsStringArray(content, "allowed_approval_policies");
	if (values === void 0) return;
	const normalizedPolicies = values.map((entry) => normalizeRequirementsApprovalPolicy(entry)).filter((entry) => entry !== void 0);
	return normalizedPolicies.length > 0 ? new Set(normalizedPolicies) : void 0;
}
function parseAllowedApprovalsReviewersFromCodexRequirements(content) {
	const values = parseTopLevelRequirementsStringArray(content, "allowed_approvals_reviewers");
	if (values === void 0) return;
	const normalizedReviewers = values.map((entry) => normalizeRequirementsApprovalsReviewer(entry)).filter((entry) => entry !== void 0);
	return normalizedReviewers.length > 0 ? new Set(normalizedReviewers) : void 0;
}
function parseMatchingRemoteSandboxModesFromCodexRequirements(content, hostName) {
	const normalizedHostName = normalizeRequirementsHostName(hostName);
	if (normalizedHostName === void 0) return;
	for (const section of parseTomlArrayTableSections(content, "remote_sandbox_config")) {
		const patterns = parseRequirementsStringArray(section, "hostname_patterns");
		if (!patterns || !requirementsHostNameMatchesAnyPattern(normalizedHostName, patterns)) continue;
		return parseRequirementsSandboxModes(parseRequirementsStringArray(section, "allowed_sandbox_modes"));
	}
}
function parseRequirementsSandboxModes(values) {
	if (values === void 0) return;
	const normalizedModes = values.map((entry) => normalizeRequirementsSandboxMode(entry)).filter((entry) => entry !== void 0);
	return normalizedModes.length > 0 ? new Set(normalizedModes) : void 0;
}
function parseTopLevelRequirementsStringArray(content, key) {
	return parseRequirementsStringArray(stripTomlLineComments(content).slice(0, firstTomlTableOffset(content)), key);
}
function parseTomlStringValue(content, key) {
	return parseTomlStringAssignmentValue(content, tomlDottedKeyPattern(key));
}
function parseInlineOpenAIModelProviderBaseUrl(content) {
	return parseTomlStringAssignmentValue(content, `${tomlKeyPattern("model_providers")}\\s*=\\s*\\{[\\s\\S]*?${tomlKeyPattern("openai")}\\s*=\\s*\\{[\\s\\S]*?${tomlKeyPattern("base_url")}`);
}
function parseTomlStringAssignmentValue(content, keyPattern) {
	const assignment = content.match(new RegExp(`(?:^|\\n)\\s*${keyPattern}\\s*=\\s*([^\\r\\n]*)`));
	if (!assignment) return;
	const rawValue = assignment[1]?.trimStart() ?? "";
	if (rawValue.startsWith("\"\"\"") || rawValue.startsWith("'''")) return false;
	const match = parseTomlStringAssignment(content, keyPattern);
	return match ? match[1] ?? match[2] ?? "" : false;
}
function parseTomlStringAssignment(content, keyPattern) {
	return content.match(new RegExp(`(?:^|\\n)\\s*${keyPattern}\\s*=\\s*(?:"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|'([^']*)')`));
}
function tomlDottedKeyPattern(key) {
	return key.split(".").map(tomlKeyPattern).join("\\s*\\.\\s*");
}
function tomlKeyPattern(key) {
	const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return `(?:"${escaped}"|'${escaped}'|${escaped})`;
}
function parseRequirementsStringArray(content, key) {
	const match = content.match(new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
	if (!match) return;
	const arrayBody = match[1] ?? "";
	const stringMatches = [...arrayBody.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^']*)'/g)];
	if (stringMatches.length === 0 && arrayBody.trim().length > 0) return;
	return stringMatches.map((entry) => entry[1] ?? entry[2] ?? "");
}
function parseTomlTableSection(content, table) {
	const strippedContent = stripTomlLineComments(content);
	const tablePattern = tomlDottedKeyPattern(table);
	const match = new RegExp(`^\\s*\\[\\s*${tablePattern}\\s*\\]\\s*$`, "m").exec(strippedContent);
	if (!match) return;
	const sectionStart = match.index + match[0].length;
	const rest = strippedContent.slice(sectionStart);
	const nextTableOffset = rest.search(/^\s*\[/m);
	return nextTableOffset === -1 ? rest : rest.slice(0, nextTableOffset);
}
function parseTomlArrayTableSections(content, table) {
	const strippedContent = stripTomlLineComments(content);
	const escapedTable = table.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const headerPattern = new RegExp(`^\\s*\\[\\[\\s*${escapedTable}\\s*\\]\\]\\s*$`, "gm");
	const sections = [];
	for (let match = headerPattern.exec(strippedContent); match; match = headerPattern.exec(strippedContent)) {
		const sectionStart = headerPattern.lastIndex;
		const rest = strippedContent.slice(sectionStart);
		const nextTableOffset = rest.search(/^\s*\[/m);
		sections.push(nextTableOffset === -1 ? rest : rest.slice(0, nextTableOffset));
	}
	return sections;
}
function firstTomlTableOffset(content) {
	return content.match(/^\s*\[[^\]\n]/m)?.index ?? content.length;
}
function stripTomlLineComments(value) {
	let output = "";
	let quote;
	let escaped = false;
	for (let index = 0; index < value.length; index += 1) {
		const char = value[index] ?? "";
		if (quote) {
			output += char;
			if (quote === "\"" && escaped) {
				escaped = false;
				continue;
			}
			if (quote === "\"" && char === "\\") {
				escaped = true;
				continue;
			}
			if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			output += char;
			continue;
		}
		if (char === "#") {
			while (index < value.length && value[index] !== "\n") index += 1;
			if (value[index] === "\n") output += "\n";
			continue;
		}
		output += char;
	}
	return output;
}
function normalizeRequirementsSandboxMode(value) {
	const compact = value.replace(/[\s_-]/g, "").toLowerCase();
	if (compact === "readonly") return "read-only";
	if (compact === "workspacewrite") return "workspace-write";
	if (compact === "dangerfullaccess") return "danger-full-access";
}
function normalizeRequirementsHostName(value) {
	const normalized = value.trim().replace(/\.+$/g, "").toLowerCase();
	return normalized.length > 0 ? normalized : void 0;
}
function requirementsHostNameMatchesAnyPattern(hostName, patterns) {
	return patterns.some((pattern) => {
		const normalizedPattern = normalizeRequirementsHostName(pattern);
		return normalizedPattern !== void 0 && globPatternMatches(hostName, normalizedPattern);
	});
}
function globPatternMatches(value, pattern) {
	let regex = "^";
	for (const char of pattern) if (char === "*") regex += ".*";
	else if (char === "?") regex += ".";
	else regex += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	regex += "$";
	return new RegExp(regex).test(value);
}
function normalizeRequirementsApprovalPolicy(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "on-failure") return "on-request";
	return resolveApprovalPolicy(normalized);
}
function normalizeRequirementsApprovalsReviewer(value) {
	return resolveApprovalsReviewer(value.trim().toLowerCase());
}
function selectGuardianApprovalPolicy(allowedApprovalPolicies, execModeRequiringPromptingApprovals) {
	if (allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("on-request")) return "on-request";
	if (execModeRequiringPromptingApprovals) throw new Error(`tools.exec.mode=${execModeRequiringPromptingApprovals} requires Codex app-server prompting approvals`);
	if (allowedApprovalPolicies.has("untrusted")) return "untrusted";
	if (allowedApprovalPolicies.has("never")) return "never";
	return "on-request";
}
function selectGuardianApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringAutoReviewer) {
	if (allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("auto_review")) return "auto_review";
	if (allowedApprovalsReviewers.has("guardian_subagent")) return "guardian_subagent";
	if (execModeRequiringAutoReviewer) throw new Error(`tools.exec.mode=${execModeRequiringAutoReviewer} requires Codex app-server auto approvals`);
	if (allowedApprovalsReviewers.has("user")) return "user";
	return "auto_review";
}
function selectUserApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringUserReviewer) {
	if (allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("user")) return "user";
	throw new Error(`tools.exec.mode=${execModeRequiringUserReviewer ?? "ask"} requires Codex app-server user approvals`);
}
//#endregion
//#region extensions/codex/src/app-server/config-reviewer.ts
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
const CODEX_CONFIG_TOML_FILENAME = "config.toml";
function canUseCodexModelBackedApprovalsReviewerForModel(params) {
	const explicitProvider = params.modelProvider?.trim().toLowerCase();
	const inferredProvider = inferProviderFromModelRef(params.model);
	if (explicitProvider && explicitProvider !== "codex") return isTrustedCodexModelBackedApprovalsReviewerProvider(explicitProvider, params) && (inferredProvider === void 0 || isTrustedCodexModelBackedApprovalsReviewerProvider(inferredProvider, params));
	if (inferredProvider !== void 0) return isTrustedCodexModelBackedApprovalsReviewerProvider(inferredProvider, params);
	return isTrustedCodexModelBackedApprovalsReviewerProvider(explicitProvider, params);
}
function isTrustedCodexModelBackedOpenAIProvider(params) {
	if (!openAIBaseUrlEnvOverridesAreTrustedForModelBackedReview(params.env)) return false;
	const codexBaseUrlOverrides = readCodexBaseUrlOverridesForModelBackedReview(params);
	if (codexBaseUrlOverrides === false || !codexBaseUrlOverrides.openAI.every(isNativeOpenAIBaseUrl) || !codexBaseUrlOverrides.chatGPT.every(isNativeChatGPTBaseUrl)) return false;
	const openAIProviders = readConfiguredOpenAIProvidersForModelBackedReview(params.config);
	if (openAIProviders.length === 0) return true;
	return openAIProviders.every((openAIProvider) => configuredOpenAIProviderIsTrustedForModelBackedReview(openAIProvider, params.model));
}
function resolveCodexModelBackedReviewerPolicyContext(params) {
	const provider = params.provider?.trim();
	if (provider && provider.toLowerCase() !== "codex") return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(provider),
		model: params.model
	};
	const bindingModelProvider = params.bindingModelProvider?.trim();
	const currentModel = params.model?.trim();
	const bindingModel = params.bindingModel?.trim();
	if (bindingModelProvider && currentModel && bindingModel && currentModel === bindingModel) return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(bindingModelProvider),
		model: params.model ?? params.bindingModel
	};
	const currentModelProvider = inferProviderFromModelRef(params.model);
	if (currentModelProvider) return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(currentModelProvider),
		model: params.model
	};
	if (bindingModelProvider) return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(bindingModelProvider),
		model: params.model ?? params.bindingModel
	};
	return {
		modelProvider: params.nativeAuthProfile === true ? "openai" : void 0,
		model: params.model ?? params.bindingModel
	};
}
function isCodexModelBackedApprovalsReviewerProvider(provider) {
	return provider?.trim().toLowerCase() === "openai";
}
function isTrustedCodexModelBackedApprovalsReviewerProvider(provider, params) {
	return isCodexModelBackedApprovalsReviewerProvider(provider) && isTrustedCodexModelBackedOpenAIProvider({
		config: params.config,
		env: params.env,
		model: params.model,
		agentDir: params.agentDir,
		codexConfigToml: params.codexConfigToml,
		homeScope: params.homeScope
	});
}
function readCodexBaseUrlOverridesForModelBackedReview(params) {
	const configToml = readCodexAppServerConfigToml(params);
	if (configToml === false) return false;
	if (configToml === void 0) return {
		openAI: [],
		chatGPT: []
	};
	const topLevelContent = stripTomlLineComments(configToml).slice(0, firstTomlTableOffset(configToml));
	const modelProviderOpenAISection = parseTomlTableSection(configToml, "model_providers.openai");
	const openAIBaseUrl = parseTomlStringValue(topLevelContent, "openai_base_url");
	const chatGPTBaseUrl = parseTomlStringValue(topLevelContent, "chatgpt_base_url");
	const openAI = [
		openAIBaseUrl,
		parseTomlStringValue(topLevelContent, "model_providers.openai.base_url"),
		parseInlineOpenAIModelProviderBaseUrl(topLevelContent),
		modelProviderOpenAISection ? parseTomlStringValue(modelProviderOpenAISection, "base_url") : void 0
	];
	const chatGPT = [chatGPTBaseUrl];
	if ([...openAI, ...chatGPT].includes(false)) return false;
	return {
		openAI: openAI.filter((entry) => typeof entry === "string"),
		chatGPT: chatGPT.filter((entry) => typeof entry === "string")
	};
}
function readCodexAppServerConfigToml(params) {
	if (params.codexConfigToml !== void 0) return params.codexConfigToml ?? void 0;
	const configPath = resolveCodexAppServerConfigPath(params);
	if (!configPath) return;
	try {
		return readFileSync(configPath, "utf8");
	} catch (error) {
		return readErrorCode(error) === "ENOENT" ? void 0 : false;
	}
}
function codexConfigEnablesNativeComputerUse(params) {
	const configToml = readCodexAppServerConfigToml(params);
	if (configToml === false) return true;
	if (configToml === void 0) return false;
	let parsedConfig;
	try {
		parsedConfig = parse$1(configToml, { integersAsBigInt: true });
	} catch {
		return true;
	}
	const rawPlugins = parsedConfig.plugins;
	if (rawPlugins === void 0) return false;
	const plugins = asOptionalRecord(rawPlugins);
	if (!plugins) return true;
	for (const [pluginId, rawPluginConfig] of Object.entries(plugins)) {
		if (!params.pluginNames.some((pluginName) => pluginId === pluginName || pluginId.startsWith(`${pluginName}@`))) continue;
		const pluginConfig = asOptionalRecord(rawPluginConfig);
		if (!pluginConfig) return true;
		if (pluginConfig.enabled === false) continue;
		return true;
	}
	return false;
}
function resolveCodexAppServerConfigPath(params) {
	if (params.homeScope === "user") return path.join(resolveCodexAppServerUserHomeDir(params.env), CODEX_CONFIG_TOML_FILENAME);
	const agentDir = normalizeOptionalString(params.agentDir);
	const codexHome = agentDir ? path.join(path.resolve(agentDir), CODEX_APP_SERVER_HOME_DIRNAME) : void 0;
	return codexHome ? path.join(codexHome, CODEX_CONFIG_TOML_FILENAME) : void 0;
}
/** Resolves the native user Codex home used by Desktop and the CLI. */
function resolveCodexAppServerUserHomeDir(env = process.env, homedir$1 = homedir) {
	const configured = normalizeOptionalString(env.CODEX_HOME);
	return path.resolve(configured ?? path.join(homedir$1(), ".codex"));
}
function readErrorCode(error) {
	return error && typeof error === "object" && "code" in error ? String(error.code) : void 0;
}
function readConfiguredOpenAIProvidersForModelBackedReview(config) {
	const providerRecords = asOptionalRecord(asOptionalRecord(asOptionalRecord(config)?.models)?.providers);
	if (!providerRecords) return [];
	const openAIProviders = [];
	for (const [providerId, providerConfig] of Object.entries(providerRecords)) {
		if (resolveProviderIdForAuth(providerId, { config }) !== "openai") continue;
		const record = asOptionalRecord(providerConfig);
		if (record) openAIProviders.push(record);
	}
	return openAIProviders;
}
function configuredOpenAIProviderIsTrustedForModelBackedReview(openAIProvider, modelInput) {
	if (asOptionalRecord(openAIProvider.localService) || hasNonEmptyRecord(openAIProvider.headers) || hasNonEmptyRecord(openAIProvider.request) || typeof openAIProvider.authHeader === "boolean" || !isNativeOpenAIBaseUrl(openAIProvider.baseUrl)) return false;
	const models = openAIProvider.models;
	if (!Array.isArray(models)) return true;
	const modelId = normalizeOpenAIModelBackedReviewerModelId(modelInput);
	if (!modelId) return false;
	for (const entry of models) {
		const model = asOptionalRecord(entry);
		if (typeof model?.id !== "string" || !matchesConfiguredOpenAIModelId(modelId, model.id)) continue;
		if (hasNonEmptyRecord(model.headers) || hasNonEmptyRecord(model.request) || !isNativeOpenAIBaseUrl(model.baseUrl)) return false;
	}
	return true;
}
function normalizeOpenAIModelBackedReviewerModelId(modelInput) {
	const normalized = modelInput?.trim() ?? "";
	const authProfileIndex = normalized.indexOf("@");
	const withoutAuthProfile = authProfileIndex > 0 ? normalized.slice(0, authProfileIndex) : normalized;
	const slashIndex = withoutAuthProfile.indexOf("/");
	return slashIndex > 0 ? withoutAuthProfile.slice(slashIndex + 1).trim() : withoutAuthProfile;
}
function matchesConfiguredOpenAIModelId(modelId, configuredModelId) {
	const configured = normalizeOpenAIModelBackedReviewerModelId(configuredModelId);
	return Boolean(configured) && (modelId === configured || modelId.startsWith(`${configured}@`));
}
function hasNonEmptyRecord(value) {
	const record = asOptionalRecord(value);
	return record !== void 0 && Object.keys(record).length > 0;
}
function isNativeOpenAIBaseUrl(value) {
	if (typeof value !== "string" || !value.trim()) return true;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.hostname.toLowerCase() === "api.openai.com";
	} catch {
		return false;
	}
}
function openAIBaseUrlEnvOverridesAreTrustedForModelBackedReview(env) {
	return [env?.OPENAI_BASE_URL, env?.OPENAI_API_BASE].every(isNativeOpenAIBaseUrl);
}
function isNativeChatGPTBaseUrl(value) {
	if (typeof value !== "string" || !value.trim()) return true;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.hostname.toLowerCase() === "chatgpt.com";
	} catch {
		return false;
	}
}
function normalizeCodexModelBackedReviewerPolicyProvider(provider) {
	return provider.toLowerCase() === "openai" ? "openai" : provider;
}
function inferProviderFromModelRef(model) {
	const normalized = model?.trim().toLowerCase();
	const slashIndex = normalized?.indexOf("/") ?? -1;
	return slashIndex > 0 ? normalized?.slice(0, slashIndex) : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/config-contracts.ts
const CODEX_PLUGINS_MARKETPLACE_NAME = "openai-curated";
const CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME = "workspace-directory";
const CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
//#endregion
//#region extensions/codex/src/app-server/session-discovery-config.ts
const codexSessionCatalogConfigSchema = object({ enabled: boolean().optional() }).strict();
const codexDiscoveryConfigSchema = object({
	enabled: boolean().optional(),
	timeoutMs: number().positive().optional()
}).strict();
//#endregion
//#region extensions/codex/src/app-server/config-parsing.ts
const DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME = "computer-use";
const DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX = "openclaw-network";
const codexAppServerTransportSchema = _enum([
	"stdio",
	"websocket",
	"unix"
]);
const codexAppServerHomeScopeSchema = _enum(["agent", "user"]);
const SecretInputSchema = buildSecretInputSchema();
const codexAppServerPolicyModeSchema = _enum(["yolo", "guardian"]);
const codexAppServerApprovalPolicySchema = preprocess((value) => value === "on-failure" ? "on-request" : value, _enum([
	"never",
	"on-request",
	"untrusted"
]));
const codexAppServerSandboxSchema = _enum([
	"read-only",
	"workspace-write",
	"danger-full-access"
]);
const codexAppServerApprovalsReviewerSchema = _enum([
	"user",
	"auto_review",
	"guardian_subagent"
]);
const codexDynamicToolsLoadingSchema = _enum(["searchable", "direct"]);
const codexComputerUseHealthIntervalSchema = union([
	literal(30),
	literal(60),
	literal(120),
	literal(240)
]);
const codexComputerUsePluginCacheModeSchema = _enum(["shared", "independent"]);
const codexPluginDestructivePolicySchema = union([
	boolean(),
	literal("auto"),
	literal("ask")
]);
const codexAppServerServiceTierSchema = preprocess((value) => value === null ? null : normalizeCodexServiceTier(value), string().trim().min(1).nullable().optional()).optional();
const codexAppServerExperimentalSchema = object({ sandboxExecServer: boolean().optional() }).strict();
const codexAppServerRemoteWorkspaceRootSchema = string().trim().min(1);
const codexAppServerNetworkProxyDomainPermissionSchema = _enum(["allow", "deny"]);
const codexAppServerNetworkProxyUnixSocketPermissionSchema = _enum(["allow", "none"]);
const codexAppServerNetworkProxySchema = object({
	enabled: boolean().optional(),
	profileName: string().trim().min(1).optional(),
	baseProfile: _enum(["read-only", "workspace"]).optional(),
	mode: _enum(["limited", "full"]).optional(),
	domains: record(string(), codexAppServerNetworkProxyDomainPermissionSchema).optional(),
	unixSockets: record(string(), codexAppServerNetworkProxyUnixSocketPermissionSchema).optional(),
	proxyUrl: string().trim().min(1).optional(),
	socksUrl: string().trim().min(1).optional(),
	enableSocks5: boolean().optional(),
	enableSocks5Udp: boolean().optional(),
	allowUpstreamProxy: boolean().optional(),
	allowLocalBinding: boolean().optional(),
	dangerouslyAllowNonLoopbackProxy: boolean().optional(),
	dangerouslyAllowAllUnixSockets: boolean().optional()
}).strict();
const codexPluginEntryConfigSchema = object({
	enabled: boolean().optional(),
	marketplaceName: string().regex(CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN).optional(),
	pluginName: string().trim().min(1).optional(),
	allow_destructive_actions: codexPluginDestructivePolicySchema.optional()
}).strict();
const codexPluginsConfigSchema = object({
	enabled: boolean().optional(),
	allow_all_plugins: boolean().optional(),
	allow_destructive_actions: codexPluginDestructivePolicySchema.optional(),
	plugins: record(string(), codexPluginEntryConfigSchema).optional()
}).strict();
const codexSupervisionEndpointSchema = union([object({
	id: string().optional(),
	label: string().optional(),
	transport: literal("stdio-proxy").optional(),
	command: string().optional(),
	args: array(string()).optional(),
	cwd: string().optional()
}).strict(), object({
	id: string().optional(),
	label: string().optional(),
	transport: literal("websocket"),
	url: string(),
	authTokenEnv: string().optional()
}).strict()]);
const codexSupervisionConfigSchema = object({
	enabled: boolean().optional(),
	endpoints: array(codexSupervisionEndpointSchema).optional(),
	allowRawTranscripts: boolean().optional(),
	allowWriteControls: boolean().optional()
}).strict();
const codexPluginConfigSchema = object({
	codexDynamicToolsLoading: codexDynamicToolsLoadingSchema.optional(),
	codexDynamicToolsExclude: array(string()).optional(),
	sessionCatalog: codexSessionCatalogConfigSchema.optional(),
	discovery: codexDiscoveryConfigSchema.optional(),
	computerUse: object({
		enabled: boolean().optional(),
		autoInstall: boolean().optional(),
		marketplaceDiscoveryTimeoutMs: number().positive().optional(),
		liveTestTimeoutMs: number().positive().optional(),
		toolCallTimeoutMs: number().positive().optional(),
		healthCheckEnabled: boolean().optional(),
		healthCheckIntervalMinutes: codexComputerUseHealthIntervalSchema.optional(),
		pluginCacheMode: codexComputerUsePluginCacheModeSchema.optional(),
		strictReadiness: boolean().optional(),
		autoRepair: boolean().optional(),
		marketplaceSource: string().optional(),
		marketplacePath: string().optional(),
		marketplaceName: string().optional(),
		pluginName: string().optional(),
		mcpServerName: string().optional()
	}).strict().optional(),
	codexPlugins: unknown().optional(),
	supervision: codexSupervisionConfigSchema.optional(),
	appServer: object({
		mode: codexAppServerPolicyModeSchema.optional(),
		transport: codexAppServerTransportSchema.optional(),
		homeScope: codexAppServerHomeScopeSchema.optional(),
		command: string().optional(),
		args: union([array(string()), string()]).optional(),
		url: string().optional(),
		authToken: SecretInputSchema.optional(),
		headers: record(string(), SecretInputSchema).optional(),
		clearEnv: array(string()).optional(),
		remoteWorkspaceRoot: codexAppServerRemoteWorkspaceRootSchema.optional(),
		codeModeOnly: boolean().optional(),
		loopDetectionPreToolUseRelay: boolean().optional(),
		requestTimeoutMs: number().positive().optional(),
		turnCompletionIdleTimeoutMs: number().positive().optional(),
		turnAssistantCompletionIdleTimeoutMs: number().positive().optional(),
		postToolRawAssistantCompletionIdleTimeoutMs: number().positive().optional(),
		approvalPolicy: codexAppServerApprovalPolicySchema.optional(),
		sandbox: codexAppServerSandboxSchema.optional(),
		approvalsReviewer: codexAppServerApprovalsReviewerSchema.optional(),
		serviceTier: codexAppServerServiceTierSchema,
		networkProxy: codexAppServerNetworkProxySchema.optional(),
		defaultWorkspaceDir: string().optional(),
		experimental: codexAppServerExperimentalSchema.optional()
	}).strict().optional()
}).strict();
function readCodexPluginConfig(value) {
	const parsed = codexPluginConfigSchema.safeParse(value);
	if (!parsed.success) return {};
	const { codexPlugins: rawCodexPlugins, ...config } = parsed.data;
	const plugins = codexPluginsConfigSchema.safeParse(rawCodexPlugins);
	if (!plugins.success) return config;
	return {
		...config,
		...plugins.data ? { codexPlugins: plugins.data } : {}
	};
}
function isCodexSandboxExecServerEnabled(pluginConfig, sandbox) {
	return isCodexRemoteExecPlacementSandbox(sandbox) || readCodexPluginConfig(pluginConfig).appServer?.experimental?.sandboxExecServer === true;
}
function isCodexRemoteExecPlacementSandbox(sandbox) {
	return typeof sandbox === "object" && sandbox !== null && "placementExecutionMode" in sandbox && sandbox.placementExecutionMode === "remote-exec";
}
function assertCodexAppServerCommandHasNoInlineArgs(params) {
	const inlineArgs = detectWindowsSpawnCommandInlineArgs(params.command);
	if (!inlineArgs) return;
	const sourceLabel = params.source === "env" ? "OPENCLAW_CODEX_APP_SERVER_BIN" : "plugins.entries.codex.config.appServer.command";
	const argsLabel = params.source === "env" ? "OPENCLAW_CODEX_APP_SERVER_ARGS" : "plugins.entries.codex.config.appServer.args";
	throw new Error(`${sourceLabel} must be only the Codex app-server executable path; "${inlineArgs.executable}" was configured with inline arguments "${inlineArgs.arguments}". Move those arguments to ${argsLabel}, or remove the override to use the managed Codex startup path.`);
}
function resolveCodexPluginsPolicy(pluginConfig) {
	const config = readCodexPluginConfig(pluginConfig).codexPlugins;
	const configured = config !== void 0;
	const enabled = config?.enabled === true;
	const destructivePolicy = resolveCodexPluginDestructivePolicy(config?.allow_destructive_actions ?? true);
	const pluginPolicies = Object.entries(config?.plugins ?? {}).flatMap(([configKey, entry]) => {
		if (!isCodexPluginMarketplaceName(entry.marketplaceName) || !entry.pluginName) return [];
		const entryDestructivePolicy = resolveCodexPluginDestructivePolicy(entry.allow_destructive_actions ?? config?.allow_destructive_actions ?? true);
		return [{
			configKey,
			marketplaceName: entry.marketplaceName,
			pluginName: entry.pluginName,
			enabled: enabled && entry.enabled !== false,
			allowDestructiveActions: entryDestructivePolicy.allowDestructiveActions,
			destructiveApprovalMode: entryDestructivePolicy.destructiveApprovalMode
		}];
	}).toSorted((left, right) => left.configKey.localeCompare(right.configKey));
	return {
		configured,
		enabled,
		allowAllPlugins: enabled && config?.allow_all_plugins === true,
		allowDestructiveActions: destructivePolicy.allowDestructiveActions,
		destructiveApprovalMode: destructivePolicy.destructiveApprovalMode,
		pluginPolicies
	};
}
function isCodexPluginMarketplaceName(value) {
	return typeof value === "string" && CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN.test(value);
}
function resolveCodexPluginDestructivePolicy(policy) {
	if (policy === "auto" || policy === "ask") return {
		allowDestructiveActions: true,
		destructiveApprovalMode: policy
	};
	return {
		allowDestructiveActions: policy,
		destructiveApprovalMode: policy ? "allow" : "deny"
	};
}
//#endregion
//#region extensions/codex/src/app-server/config-security.ts
function shouldAutoApproveCodexAppServerApprovals(appServer) {
	return appServer.networkProxy === void 0 && appServer.approvalPolicy === "never" && appServer.sandbox === "danger-full-access";
}
function resolveCodexAppServerNetworkProxy(config, sandbox) {
	if (config?.enabled !== true) return {};
	const fileSystemMode = config.baseProfile === "read-only" || !config.baseProfile && sandbox === "read-only" ? "read" : "write";
	const networkConfig = removeUndefinedJsonFields({
		enabled: true,
		mode: config.mode,
		domains: normalizeNetworkProxyPermissionMap(config.domains),
		unix_sockets: normalizeNetworkProxyPermissionMap(config.unixSockets),
		proxy_url: normalizeOptionalString(config.proxyUrl),
		socks_url: normalizeOptionalString(config.socksUrl),
		enable_socks5: config.enableSocks5,
		enable_socks5_udp: config.enableSocks5Udp,
		allow_upstream_proxy: config.allowUpstreamProxy,
		allow_local_binding: config.allowLocalBinding,
		dangerously_allow_non_loopback_proxy: config.dangerouslyAllowNonLoopbackProxy,
		dangerously_allow_all_unix_sockets: config.dangerouslyAllowAllUnixSockets
	});
	const profile = {
		filesystem: {
			":minimal": "read",
			":project_roots": { ".": fileSystemMode }
		},
		network: networkConfig
	};
	const profileName = resolveNetworkProxyPermissionProfileName(config, profile);
	const configPatch = {
		"features.network_proxy.enabled": true,
		default_permissions: profileName,
		permissions: { [profileName]: profile }
	};
	return { networkProxy: {
		profileName,
		configFingerprint: fingerprintCodexAppServerNetworkProxyConfigPatch(configPatch),
		configPatch
	} };
}
function resolveNetworkProxyPermissionProfileName(config, profile) {
	const explicitProfileName = normalizeOptionalString(config.profileName);
	if (explicitProfileName) return explicitProfileName;
	return `${DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX}-${createHash("sha256").update(stableStringifyJson({
		version: 1,
		profile
	})).digest("hex").slice(0, 16)}`;
}
function fingerprintCodexAppServerNetworkProxyConfigPatch(configPatch) {
	return createHash("sha256").update(stableStringifyJson(configPatch)).digest("hex");
}
function normalizeNetworkProxyPermissionMap(value) {
	const entries = Object.entries(value ?? {}).map(([key, permission]) => [key.trim(), permission]).filter(([key]) => key.length > 0);
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function removeUndefinedJsonFields(value) {
	return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== void 0));
}
function stableStringifyJson(value) {
	if (Array.isArray(value)) return `[${value.map((item) => stableStringifyJson(item)).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => `${JSON.stringify(key)}:${stableStringifyJson(item)}`).join(",")}}`;
	return JSON.stringify(value);
}
function withMcpElicitationsApprovalPolicy(policy) {
	if (typeof policy !== "string") return { granular: {
		...policy.granular,
		mcp_elicitations: true
	} };
	if (policy === "never") return { granular: {
		mcp_elicitations: true,
		rules: false,
		sandbox_approval: false,
		request_permissions: false,
		skill_approval: false
	} };
	return { granular: {
		mcp_elicitations: true,
		rules: true,
		sandbox_approval: true,
		request_permissions: true,
		skill_approval: true
	} };
}
function resolveTransport(value) {
	return value === "websocket" || value === "unix" ? value : "stdio";
}
function normalizeRemoteWorkspaceRoot(value) {
	return normalizeOptionalString(value);
}
function inferCodexAppServerConnectionClass(params) {
	if (params.transport !== "websocket") return "local-loopback";
	return params.url && isLoopbackWebSocketUrl(params.url) ? "local-loopback" : "remote";
}
function assertCodexAppServerConnectionClassConfig(params) {
	if (params.connectionClass === "remote" && !hasIdentityBearingWebSocketAuth({
		authToken: params.authToken,
		headers: params.headers
	})) throw new Error("remote Codex app-server WebSocket URLs require appServer.authToken or an Authorization header");
}
/** Applies the canonical remote-auth boundary to any Codex AppServer transport. */
function assertCodexAppServerConnectionSecurity(params) {
	assertCodexAppServerConnectionClassConfig({
		connectionClass: inferCodexAppServerConnectionClass(params),
		authToken: params.authToken,
		headers: params.headers
	});
}
function isLoopbackWebSocketUrl(value) {
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		return false;
	}
	if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return false;
	return isLoopbackHost(parsed.hostname);
}
function hasIdentityBearingWebSocketAuth(params) {
	if (normalizeOptionalString(params.authToken)) return true;
	return Object.entries(params.headers).some(([key, value]) => key.trim().toLowerCase() === "authorization" && Boolean(normalizeOptionalString(value)));
}
function resolvePolicyMode(value) {
	return value === "guardian" || value === "yolo" ? value : void 0;
}
function resolveDefaultCodexAppServerPolicy(params) {
	if (params.transport !== "stdio") return {
		mode: "yolo",
		dangerFullAccessAllowed: true
	};
	const content = readCodexRequirementsToml(params);
	if (content === void 0) {
		if (!params.forceGuardian) return {
			mode: "yolo",
			dangerFullAccessAllowed: true
		};
		return {
			mode: "guardian",
			dangerFullAccessAllowed: true,
			approvalPolicy: selectGuardianApprovalPolicy(void 0, params.execModeRequiringPromptingApprovals),
			approvalsReviewer: params.forceUserReviewer ? selectUserApprovalsReviewer(void 0, params.execModeRequiringUserReviewer) : selectGuardianApprovalsReviewer(void 0, params.execModeRequiringPromptingApprovals === "auto" ? "auto" : void 0),
			sandbox: selectGuardianSandbox(void 0)
		};
	}
	const allowedSandboxModes = parseAllowedSandboxModesFromCodexRequirements(content, normalizeOptionalString(params.hostName) ?? hostname());
	const allowedApprovalPolicies = parseAllowedApprovalPoliciesFromCodexRequirements(content);
	const allowedApprovalsReviewers = parseAllowedApprovalsReviewersFromCodexRequirements(content);
	const yoloSandboxAllowed = allowedSandboxModes === void 0 || allowedSandboxModes.has("danger-full-access");
	const yoloApprovalAllowed = allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("never");
	const yoloReviewerAllowed = allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("user");
	if (!params.forceGuardian && yoloSandboxAllowed && yoloApprovalAllowed && yoloReviewerAllowed) return {
		mode: "yolo",
		dangerFullAccessAllowed: true
	};
	return {
		mode: "guardian",
		dangerFullAccessAllowed: yoloSandboxAllowed,
		approvalPolicy: selectGuardianApprovalPolicy(allowedApprovalPolicies, params.execModeRequiringPromptingApprovals),
		approvalsReviewer: params.forceUserReviewer ? selectUserApprovalsReviewer(allowedApprovalsReviewers, params.execModeRequiringUserReviewer) : selectGuardianApprovalsReviewer(allowedApprovalsReviewers, params.execModeRequiringPromptingApprovals === "auto" ? "auto" : void 0),
		sandbox: selectGuardianSandbox(allowedSandboxModes)
	};
}
//#endregion
//#region extensions/codex/src/app-server/config-runtime.ts
/**
* Sole owner of the app-server home-scope decision. Ordinary harness connections
* default to the isolated agent home; the supervision connection owns the operator's
* native Codex home on local transports. Auth handoffs must read the scope from here
* (or from resolved start options) because a prepared login on a native home rewrites
* the account Codex CLI and Desktop share.
*/
function resolveCodexAppServerHomeScope(params) {
	const configured = params.appServer?.homeScope;
	if (configured) return configured;
	return params.connectionScope === "supervision" && resolveTransport(params.appServer?.transport) !== "websocket" ? "user" : "agent";
}
function resolveCodexAppServerRuntimeOptions(params = {}) {
	const env = params.env ?? process.env;
	const config = readCodexPluginConfig(params.pluginConfig).appServer ?? {};
	const transport = resolveTransport(config.transport);
	const homeScope = resolveCodexAppServerHomeScope({ appServer: config });
	const configCommand = normalizeOptionalString(config.command);
	const envCommand = normalizeOptionalString(env.OPENCLAW_CODEX_APP_SERVER_BIN);
	const command = configCommand ?? envCommand ?? "codex";
	const commandSource = configCommand ? "config" : envCommand ? "env" : "managed";
	if (commandSource === "config" || commandSource === "env") assertCodexAppServerCommandHasNoInlineArgs({
		command,
		source: commandSource
	});
	const args = resolveArgs(config.args, env.OPENCLAW_CODEX_APP_SERVER_ARGS);
	const headers = normalizeHeaders(config.headers);
	const clearEnv = normalizeTrimmedStringList(config.clearEnv);
	const authToken = normalizeCodexAppServerSecretInput({
		value: config.authToken,
		path: "plugins.entries.codex.config.appServer.authToken"
	});
	const url = normalizeOptionalString(config.url) ?? (transport === "unix" ? "unix://" : void 0);
	const connectionClass = inferCodexAppServerConnectionClass({
		transport,
		url
	});
	const remoteAppsSubstrate = "preconfigured";
	const remoteWorkspaceRoot = normalizeRemoteWorkspaceRoot(config.remoteWorkspaceRoot);
	const execMode = resolveEffectiveOpenClawExecModeForCodexAppServer({
		execMode: params.execMode,
		execPolicy: params.execPolicy
	});
	assertCodexAppServerAllowedForOpenClawExecMode(execMode);
	const explicitPolicyMode = resolvePolicyMode(config.mode) ?? resolvePolicyMode(env.OPENCLAW_CODEX_APP_SERVER_MODE);
	const configuredSandbox = resolveSandbox(config.sandbox) ?? resolveSandbox(env.OPENCLAW_CODEX_APP_SERVER_SANDBOX);
	const explicitApprovalsReviewer = resolveApprovalsReviewer(config.approvalsReviewer);
	const normalizedPolicyMode = resolveCodexPolicyModeForOpenClawExecMode(execMode);
	const ignoreLegacyYoloPolicyMode = normalizedPolicyMode === "guardian" && explicitPolicyMode === "yolo";
	const canUseModelBackedReviewer = canUseCodexModelBackedApprovalsReviewerForModel({
		modelProvider: params.modelProvider,
		model: params.model,
		config: params.config,
		env,
		agentDir: params.agentDir,
		codexConfigToml: params.codexConfigToml,
		homeScope
	});
	const forceUserReviewer = !canUseModelBackedReviewer && (explicitApprovalsReviewer === "auto_review" || explicitApprovalsReviewer === "guardian_subagent" || explicitPolicyMode === "guardian" && explicitApprovalsReviewer !== "user") || execMode !== void 0 && execMode !== "full" && (execMode !== "auto" || !canUseModelBackedReviewer);
	const forceGuardianReviewer = execMode === "auto" && canUseModelBackedReviewer;
	const execModeRequiringPromptingApprovals = execMode === "auto" || execMode === "ask" ? execMode : forceUserReviewer ? "ask" : void 0;
	const forceDangerFullAccessSandbox = params.execPolicy?.touched === true && params.execPolicy.security === "full" && params.execPolicy.ask === "always";
	const forceRuntimePolicy = forceUserReviewer || forceGuardianReviewer || forceDangerFullAccessSandbox;
	const defaultPolicy = explicitPolicyMode && !forceRuntimePolicy && !ignoreLegacyYoloPolicyMode ? void 0 : resolveDefaultCodexAppServerPolicy({
		transport,
		env,
		forceGuardian: normalizedPolicyMode === "guardian",
		forceUserReviewer: forceUserReviewer || !canUseModelBackedReviewer,
		execModeRequiringPromptingApprovals,
		requirementsToml: params.requirementsToml,
		requirementsPath: params.requirementsPath,
		readRequirementsFile: params.readRequirementsFile,
		platform: params.platform,
		hostName: params.hostName,
		execModeRequiringUserReviewer: forceUserReviewer ? execMode : void 0
	});
	const preserveExplicitAutoSandbox = forceGuardianReviewer && configuredSandbox === "read-only";
	const forcedPolicy = forceRuntimePolicy ? {
		approvalPolicy: defaultPolicy?.approvalPolicy ?? "on-request",
		sandbox: preserveExplicitAutoSandbox ? void 0 : forceDangerFullAccessSandbox ? selectForcedDangerFullAccessSandbox({
			configuredSandbox,
			defaultPolicy,
			openClawSandboxActive: Boolean(params.openClawSandboxActive)
		}) : selectForcedPromptingSandbox({
			configuredSandbox,
			defaultSandbox: defaultPolicy?.sandbox
		}),
		approvalsReviewer: defaultPolicy?.approvalsReviewer ?? (forceUserReviewer ? "user" : "auto_review")
	} : void 0;
	const policyMode = ignoreLegacyYoloPolicyMode ? normalizedPolicyMode : explicitPolicyMode ?? normalizedPolicyMode ?? defaultPolicy?.mode ?? "yolo";
	const serviceTier = normalizeCodexServiceTier(config.serviceTier);
	const resolvedSandbox = forcedPolicy?.sandbox ?? configuredSandbox ?? defaultPolicy?.sandbox ?? (policyMode === "guardian" ? "workspace-write" : "danger-full-access");
	if (transport === "websocket" && !url) throw new Error("plugins.entries.codex.config.appServer.url is required when appServer.transport is websocket");
	if (transport === "websocket" && homeScope === "user") throw new Error("plugins.entries.codex.config.appServer.homeScope=user requires appServer.transport=stdio or unix");
	if (transport === "unix" && homeScope !== "user") throw new Error("plugins.entries.codex.config.appServer.transport=unix requires appServer.homeScope=user");
	if (transport === "unix" && !url?.startsWith("unix://")) throw new Error("plugins.entries.codex.config.appServer.url must use unix:// when appServer.transport is unix");
	assertCodexAppServerConnectionSecurity({
		transport,
		url,
		authToken,
		headers
	});
	const configApprovalPolicy = resolveApprovalPolicy(config.approvalPolicy);
	const envApprovalPolicy = resolveApprovalPolicy(env.OPENCLAW_CODEX_APP_SERVER_APPROVAL_POLICY);
	const approvalPolicy = configApprovalPolicy ?? envApprovalPolicy ?? defaultPolicy?.approvalPolicy ?? (policyMode === "guardian" ? "on-request" : "never");
	const approvalPolicySource = configApprovalPolicy ? "config" : envApprovalPolicy ? "env" : defaultPolicy?.approvalPolicy ? "requirements" : "implicit";
	const computerUseConfig = resolveCodexComputerUseConfig({
		pluginConfig: params.pluginConfig,
		env
	});
	const managedCommandOrder = params.managedCommandOrder ?? (homeScope === "user" || computerUseConfig.enabled ? "desktop-first" : "package-first");
	const includeManagedCommandOrder = commandSource === "managed" && (managedCommandOrder === "desktop-first" || params.managedCommandOrder === "package-first");
	const managedComputerUsePluginNames = [.../* @__PURE__ */ new Set([DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME, computerUseConfig.pluginName])];
	return {
		start: {
			transport,
			homeScope,
			command,
			commandSource,
			...includeManagedCommandOrder ? { managedCommandOrder } : {},
			...commandSource === "managed" ? { managedComputerUsePluginNames } : {},
			args: args.length > 0 ? args : [
				"app-server",
				"--listen",
				"stdio://"
			],
			...url ? { url } : {},
			...authToken ? { authToken } : {},
			headers,
			...transport === "stdio" && clearEnv.length > 0 ? { clearEnv } : {}
		},
		connectionClass,
		remoteAppsSubstrate,
		...remoteWorkspaceRoot ? { remoteWorkspaceRoot } : {},
		codeModeOnly: config.codeModeOnly === true,
		loopDetectionPreToolUseRelay: config.loopDetectionPreToolUseRelay !== false,
		requestTimeoutMs: normalizePositiveNumber(config.requestTimeoutMs, 6e4),
		turnCompletionIdleTimeoutMs: normalizePositiveNumber(config.turnCompletionIdleTimeoutMs, 6e4),
		turnAssistantCompletionIdleTimeoutMs: normalizePositiveNumber(config.turnAssistantCompletionIdleTimeoutMs, 1e4),
		...config.postToolRawAssistantCompletionIdleTimeoutMs !== void 0 ? { postToolRawAssistantCompletionIdleTimeoutMs: normalizePositiveNumber(config.postToolRawAssistantCompletionIdleTimeoutMs, 6e4) } : {},
		approvalPolicy: forcedPolicy?.approvalPolicy ?? approvalPolicy,
		approvalPolicySource,
		sandbox: resolvedSandbox,
		approvalsReviewer: forcedPolicy?.approvalsReviewer ?? explicitApprovalsReviewer ?? defaultPolicy?.approvalsReviewer ?? (policyMode === "guardian" ? "auto_review" : "user"),
		...serviceTier ? { serviceTier } : {},
		...resolveCodexAppServerNetworkProxy(config.networkProxy, resolvedSandbox)
	};
}
/**
* Rechecks Codex-owned plugin state at the final spawn boundary, where the
* effective agent home is known, so Computer Use keeps the desktop app's TCC ownership.
*/
function resolveCodexAppServerStartOptionsForAgent(params) {
	const startOptions = params.startOptions;
	if (startOptions.transport !== "stdio" || startOptions.commandSource !== "managed" || startOptions.managedCommandOrder !== void 0) return startOptions;
	if (startOptions.homeScope === "user") return {
		...startOptions,
		managedCommandOrder: "desktop-first"
	};
	return codexConfigEnablesNativeComputerUse({
		agentDir: params.agentDir,
		codexConfigToml: params.codexConfigToml,
		env: params.env,
		homeScope: "agent",
		pluginNames: startOptions.managedComputerUsePluginNames ?? ["computer-use"]
	}) ? {
		...startOptions,
		managedCommandOrder: "desktop-first"
	} : startOptions;
}
function resolveCodexComputerUseConfig(params = {}) {
	const env = params.env ?? process.env;
	const config = readCodexPluginConfig(params.pluginConfig).computerUse ?? {};
	const marketplaceSource = normalizeOptionalString(params.overrides?.marketplaceSource) ?? normalizeOptionalString(config.marketplaceSource) ?? normalizeOptionalString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_SOURCE);
	const marketplacePath = normalizeOptionalString(params.overrides?.marketplacePath) ?? normalizeOptionalString(config.marketplacePath) ?? normalizeOptionalString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_PATH);
	const marketplaceName = normalizeOptionalString(params.overrides?.marketplaceName) ?? normalizeOptionalString(config.marketplaceName) ?? normalizeOptionalString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_NAME);
	const configuredPluginName = normalizeOptionalString(params.overrides?.pluginName) ?? normalizeOptionalString(config.pluginName) ?? normalizeOptionalString(env.OPENCLAW_CODEX_COMPUTER_USE_PLUGIN_NAME);
	const configuredMcpServerName = normalizeOptionalString(params.overrides?.mcpServerName) ?? normalizeOptionalString(config.mcpServerName) ?? normalizeOptionalString(env.OPENCLAW_CODEX_COMPUTER_USE_MCP_SERVER_NAME);
	const autoInstall = params.overrides?.autoInstall ?? config.autoInstall ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_AUTO_INSTALL) ?? false;
	const marketplaceDiscoveryTimeoutMs = normalizePositiveNumber(params.overrides?.marketplaceDiscoveryTimeoutMs ?? config.marketplaceDiscoveryTimeoutMs ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS), DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS);
	const liveTestTimeoutMs = normalizePositiveNumber(params.overrides?.liveTestTimeoutMs ?? config.liveTestTimeoutMs ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS), DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS);
	const toolCallTimeoutMs = normalizePositiveNumber(params.overrides?.toolCallTimeoutMs ?? config.toolCallTimeoutMs ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS), DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS);
	const healthCheckIntervalMinutes = normalizeComputerUseHealthCheckIntervalMinutes(params.overrides?.healthCheckIntervalMinutes ?? config.healthCheckIntervalMinutes ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_HEALTH_CHECK_INTERVAL_MINUTES));
	const healthCheckEnabled = params.overrides?.healthCheckEnabled ?? config.healthCheckEnabled ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_HEALTH_CHECK_ENABLED) ?? false;
	const pluginCacheMode = normalizeComputerUsePluginCacheMode(params.overrides?.pluginCacheMode) ?? normalizeComputerUsePluginCacheMode(config.pluginCacheMode) ?? normalizeComputerUsePluginCacheMode(env.OPENCLAW_CODEX_COMPUTER_USE_PLUGIN_CACHE_MODE) ?? "independent";
	const strictReadiness = params.overrides?.strictReadiness ?? config.strictReadiness ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_STRICT_READINESS) ?? false;
	const autoRepair = params.overrides?.autoRepair ?? config.autoRepair ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_AUTO_REPAIR) ?? false;
	return {
		enabled: params.overrides?.enabled ?? config.enabled ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE) ?? Boolean(autoInstall || marketplaceSource || marketplacePath || marketplaceName || configuredPluginName || configuredMcpServerName),
		autoInstall,
		marketplaceDiscoveryTimeoutMs,
		liveTestTimeoutMs,
		toolCallTimeoutMs,
		healthCheckEnabled,
		healthCheckIntervalMinutes,
		pluginCacheMode,
		strictReadiness,
		autoRepair,
		pluginName: configuredPluginName ?? "computer-use",
		mcpServerName: configuredMcpServerName ?? "computer-use",
		...marketplaceSource ? { marketplaceSource } : {},
		...marketplacePath ? { marketplacePath } : {},
		...marketplaceName ? { marketplaceName } : {}
	};
}
function normalizeComputerUseHealthCheckIntervalMinutes(value) {
	return value === 30 || value === 60 || value === 120 || value === 240 ? value : 60;
}
function normalizeComputerUsePluginCacheMode(value) {
	return value === "shared" || value === "independent" ? value : null;
}
function codexAppServerStartOptionsKey(options, params = {}) {
	return JSON.stringify({
		transport: options.transport,
		command: options.command,
		commandSource: options.commandSource ?? null,
		managedCommandOrder: options.managedCommandOrder ?? "package-first",
		managedComputerUsePluginNames: [...options.managedComputerUsePluginNames ?? []].toSorted(),
		managedFallbackCommandPaths: [...options.managedFallbackCommandPaths ?? []],
		args: options.args,
		cwd: options.cwd ?? null,
		url: options.url ?? null,
		authToken: hashSecretForKey(options.authToken, "authToken"),
		headers: Object.entries(options.headers).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, hashSecretForKey(value, `header:${key}`)]),
		env: Object.entries(options.env ?? {}).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, hashSecretForKey(value, `env:${key}`)]),
		clearEnv: [...options.clearEnv ?? []].toSorted(),
		authProfileId: params.authProfileId ?? null,
		authBindingFingerprint: params.authBindingFingerprint ?? null,
		agentDir: params.agentDir ?? null,
		fallbackApiKeyCacheKey: params.fallbackApiKeyCacheKey ?? null
	});
}
function codexSandboxPolicyForTurn(mode, cwd, nativeArgs = []) {
	if (mode === "danger-full-access") return { type: "dangerFullAccess" };
	if (mode === "read-only") return {
		type: "readOnly",
		networkAccess: false
	};
	let excludeTmpdirEnvVar = false;
	let excludeSlashTmp = false;
	for (let index = 0; index < nativeArgs.length; index += 1) {
		const arg = nativeArgs[index];
		const override = arg === "-c" || arg === "--config" ? nativeArgs[++index] : arg?.startsWith("--config=") ? arg.slice(9) : void 0;
		if (!override) continue;
		const separator = override.indexOf("=");
		if (separator < 0) continue;
		const key = override.slice(0, separator).trim();
		const value = override.slice(separator + 1).trim();
		if (value !== "true" && value !== "false") continue;
		if (key === "sandbox_workspace_write.exclude_tmpdir_env_var") excludeTmpdirEnvVar = value === "true";
		else if (key === "sandbox_workspace_write.exclude_slash_tmp") excludeSlashTmp = value === "true";
	}
	return {
		type: "workspaceWrite",
		writableRoots: [cwd],
		networkAccess: false,
		excludeTmpdirEnvVar,
		excludeSlashTmp
	};
}
/** Resolves the passive supervision control connection without changing harness defaults. */
function resolveCodexSupervisionAppServerRuntimeOptions(params = {}) {
	const pluginConfig = readCodexPluginConfig(params.pluginConfig);
	const appServer = pluginConfig.appServer ?? {};
	const homeScope = resolveCodexAppServerHomeScope({
		appServer,
		connectionScope: "supervision"
	});
	return resolveCodexAppServerRuntimeOptions({
		...params,
		pluginConfig: {
			...pluginConfig,
			appServer: {
				...appServer,
				homeScope
			}
		}
	});
}
//#endregion
//#region extensions/codex/src/app-server/session-binding.ts
/** SQLite-backed Codex app-server thread bindings. */
const CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER = "openai";
const PUBLIC_OPENAI_MODEL_PROVIDER = "openai";
const BINDING_LEASE_RETRY_INTERVAL_MS = 1e3;
const BOUNDED_BINDING_FINGERPRINT_PATTERN = /^sha256:[a-f0-9]{64}$/i;
const CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS = 6e4;
const BINDING_LEASE_STALE_MS = 65e3;
const BINDING_LEASE_WAIT_MS = 7e4;
const BINDING_LEASE_RENEW_INTERVAL_MS = Math.floor(BINDING_LEASE_STALE_MS / 3);
const PHYSICAL_SESSION_RETIRE_TTL_MS = BINDING_LEASE_WAIT_MS;
/** Resolves the same agent scope OpenClaw uses for transcript/session ownership. */
function sessionBindingIdentity(params) {
	const { sessionAgentId } = resolveSessionAgentIds(params);
	const sessionKey = params.sessionKey?.trim();
	return {
		kind: "session",
		agentId: sessionAgentId,
		sessionId: params.sessionId,
		...sessionKey ? { sessionKey } : {}
	};
}
/** Decides whether a run may share the durable stable-key binding owner. */
function resolveCodexRunSessionBindingAuthority(params) {
	const sessionKey = params.identity.sessionKey?.trim();
	if (!sessionKey) return "ephemeral";
	try {
		const storePath = params.storePath?.trim() || resolveStorePath(params.config?.session?.store, { agentId: params.identity.agentId });
		const entry = getSessionEntry({
			agentId: params.identity.agentId,
			hydrateSkillPromptRefs: false,
			readConsistency: "latest",
			sessionKey,
			storePath
		});
		if (!entry) return "ephemeral";
		return entry.sessionId === params.identity.sessionId ? "current" : "superseded";
	} catch {
		return "superseded";
	}
}
/** Builds the terminal coordination error used when a newer OpenClaw session owns the binding. */
function createCodexSessionGenerationSupersededError(sessionId) {
	return new AgentHarnessSessionSupersededError(`Codex session generation is no longer current: ${sessionId}`);
}
const optionalStringSchema = string().optional().catch(void 0);
const optionalBooleanSchema = boolean().optional().catch(void 0);
const optionalNonBlankStringSchema = string().refine((value) => Boolean(value.trim())).optional().catch(void 0);
const optionalTimestampSchema = string().refine((value) => Number.isFinite(Date.parse(value))).optional().catch(void 0);
const pendingSupervisionBranchSchema = object({
	sourceThreadId: string().trim().min(1),
	connectionFingerprint: string().trim().min(1).optional(),
	lastTurnId: string().trim().min(1).optional(),
	cleanupThreadIds: array(string().trim().min(1)).max(2).optional()
}).strict().superRefine((pending, context) => {
	const cleanupThreadIds = pending.cleanupThreadIds ?? [];
	if (new Set(cleanupThreadIds).size !== cleanupThreadIds.length) context.addIssue({
		code: "custom",
		message: "pending supervision cleanup thread ids must be unique"
	});
	if (cleanupThreadIds.includes(pending.sourceThreadId)) context.addIssue({
		code: "custom",
		message: "pending supervision cleanup cannot target its source"
	});
});
const contextEngineProjectionSchema = object({
	schemaVersion: literal(1),
	mode: literal("thread_bootstrap"),
	epoch: string().refine((value) => Boolean(value.trim())),
	fingerprint: optionalStringSchema
}).strict();
const contextEngineSchema = object({
	schemaVersion: literal(1),
	engineId: string(),
	policyFingerprint: string(),
	projection: contextEngineProjectionSchema.optional().catch(void 0)
}).strict();
const destructiveApprovalModeSchema = _enum([
	"allow",
	"deny",
	"auto",
	"ask"
]).optional().catch(void 0);
const accountAppPolicyEntrySchema = object({
	source: literal("account"),
	appName: string(),
	allowDestructiveActions: boolean(),
	allowOpenWorld: boolean().optional(),
	destructiveApprovalMode: destructiveApprovalModeSchema,
	mcpServerNames: array(string())
}).strict();
const pluginAppPolicyEntrySchema = object({
	source: literal("plugin").optional(),
	configKey: string(),
	marketplaceName: string().regex(CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN),
	pluginName: string(),
	allowDestructiveActions: boolean(),
	allowOpenWorld: boolean().optional(),
	destructiveApprovalMode: destructiveApprovalModeSchema,
	mcpServerNames: array(string())
}).strict();
const pluginAppPolicyContextSchema = object({
	fingerprint: string(),
	apps: record(string(), union([accountAppPolicyEntrySchema, pluginAppPolicyEntrySchema])),
	pluginAppIds: record(string(), array(string())).default({})
}).strict();
const threadBindingSchema = object({
	threadId: string().refine((value) => Boolean(value.trim())),
	clientId: optionalStringSchema,
	cwd: string(),
	rolloutPath: optionalNonBlankStringSchema,
	connectionScope: literal("supervision").optional(),
	supervisionSourceThreadId: string().trim().min(1).optional(),
	authProfileId: optionalStringSchema,
	model: optionalStringSchema,
	preserveNativeModel: literal(true).optional().catch(void 0),
	pendingSupervisionBranch: pendingSupervisionBranchSchema.optional(),
	modelProvider: string().transform((value) => value.trim()).pipe(string().min(1)).optional().catch(void 0),
	approvalPolicy: preprocess((value) => value === "on-failure" ? "on-request" : value, _enum([
		"never",
		"on-request",
		"untrusted"
	]).optional()).catch(void 0),
	sandbox: _enum([
		"read-only",
		"workspace-write",
		"danger-full-access"
	]).optional().catch(void 0),
	serviceTier: preprocess(normalizeCodexServiceTier, custom((value) => typeof value === "string").optional()).optional().catch(void 0),
	networkProxyProfileName: optionalStringSchema,
	networkProxyConfigFingerprint: optionalStringSchema,
	dynamicToolsFingerprint: optionalStringSchema,
	dynamicToolsContainDeferred: optionalBooleanSchema,
	webSearchThreadConfigFingerprint: optionalStringSchema,
	nativeSkillIsolationFingerprint: optionalStringSchema,
	userMcpServersFingerprint: optionalStringSchema,
	mcpServersFingerprint: optionalStringSchema,
	configuredMcpOwnershipVersion: literal(1).optional().catch(void 0),
	ringZeroConfigFingerprint: optionalStringSchema,
	ringZeroClientInstanceId: optionalStringSchema,
	/** Durable fact preventing a later unrestricted turn from widening this thread. */
	nativeToolPolicyRestricted: literal(true).optional().catch(void 0),
	nativeHookRelayGeneration: optionalNonBlankStringSchema,
	appServerRuntimeFingerprint: optionalStringSchema,
	pluginAppsFingerprint: optionalStringSchema,
	pluginAppsInputFingerprint: optionalStringSchema,
	pluginAppPolicyContext: pluginAppPolicyContextSchema.optional().catch(void 0),
	contextEngine: contextEngineSchema.optional().catch(void 0),
	environmentSelectionFingerprint: optionalStringSchema,
	conversationStartId: optionalStringSchema,
	conversationSourceTransferComplete: literal(true).optional().catch(void 0),
	historyCoveredThrough: optionalTimestampSchema
}).superRefine((binding, context) => {
	if (binding.connectionScope === "supervision") {
		if (!binding.supervisionSourceThreadId) context.addIssue({
			code: "custom",
			message: "supervision connection ownership requires its native source thread id"
		});
		if (binding.preserveNativeModel !== true) context.addIssue({
			code: "custom",
			message: "supervision connection ownership requires native model ownership"
		});
		if (binding.conversationSourceTransferComplete !== true) context.addIssue({
			code: "custom",
			message: "supervision connection ownership requires a completed source transfer"
		});
		if (!binding.pendingSupervisionBranch && (!binding.model?.trim() || !binding.modelProvider)) context.addIssue({
			code: "custom",
			message: "materialized supervision bindings require a native model and provider"
		});
	}
	if (binding.supervisionSourceThreadId && binding.connectionScope !== "supervision") context.addIssue({
		code: "custom",
		message: "a supervision source thread id requires supervision connection ownership"
	});
	if (!binding.pendingSupervisionBranch) return;
	if (binding.threadId !== binding.pendingSupervisionBranch.sourceThreadId) context.addIssue({
		code: "custom",
		message: "pending supervision source must match the provisional thread binding"
	});
	if (binding.supervisionSourceThreadId !== binding.pendingSupervisionBranch.sourceThreadId) context.addIssue({
		code: "custom",
		message: "pending supervision source must match its durable source identity"
	});
	if (binding.preserveNativeModel !== true) context.addIssue({
		code: "custom",
		message: "pending supervision bindings must defer model selection to Codex App Server"
	});
	if (binding.connectionScope !== "supervision") context.addIssue({
		code: "custom",
		message: "pending supervision bindings require supervision connection ownership"
	});
});
var CodexSupervisionBindingReplacementError = class extends Error {
	constructor(threadId, operation) {
		super(`Refusing to replace supervised Codex thread ${threadId} while ${operation}; its native user-home connection and model ownership must be preserved`);
		this.name = "CodexSupervisionBindingReplacementError";
	}
};
function assertCodexBindingMayBeReplaced(binding, operation) {
	if (binding?.connectionScope === "supervision") throw new CodexSupervisionBindingReplacementError(binding.threadId, operation);
}
const bindingLeaseSchema = object({
	token: string().refine((value) => Boolean(value.trim())),
	expiresAt: number().finite()
});
const storedSessionIdSchema = string().transform((value) => value.trim()).pipe(string().min(1)).optional().catch(void 0);
const storedBindingSchema = discriminatedUnion("state", [object({
	version: literal(1),
	state: literal("active"),
	binding: threadBindingSchema,
	sessionId: storedSessionIdSchema,
	lease: bindingLeaseSchema.optional().catch(void 0)
}), object({
	version: literal(1),
	state: literal("cleared"),
	sessionId: storedSessionIdSchema,
	lease: bindingLeaseSchema.optional().catch(void 0),
	retired: literal(true).optional().catch(void 0)
})]);
function hashCodexAppServerBindingFingerprint(canonical) {
	return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}
function normalizeLegacyBindingFingerprint(value) {
	if (typeof value !== "string" || value === "" || value === "[]" || BOUNDED_BINDING_FINGERPRINT_PATTERN.test(value)) return value;
	return hashCodexAppServerBindingFingerprint(value);
}
function normalizeLegacyBindingFingerprints(record) {
	let normalized = record;
	for (const key of ["dynamicToolsFingerprint", "userMcpServersFingerprint"]) {
		const value = record[key];
		const next = normalizeLegacyBindingFingerprint(value);
		if (next === value) continue;
		if (normalized === record) normalized = { ...record };
		normalized[key] = next;
	}
	return normalized;
}
function normalizeStoredCodexAppServerBindingFingerprints(value) {
	const stored = readStoredCodexAppServerBinding(value);
	if (!stored || stored.state !== "active") return stored;
	const binding = normalizeLegacyBindingFingerprints(stored.binding);
	return binding === stored.binding ? stored : readStoredCodexAppServerBinding({
		...stored,
		binding
	});
}
/** Encodes a migrated sidecar binding as one canonical plugin-state row. */
function createStoredCodexAppServerBinding(value, options = {}) {
	const rawRecord = asOptionalRecord(value);
	if (!rawRecord) return;
	const record = normalizeLegacyBindingFingerprints(rawRecord);
	if (record.schemaVersion !== 1 && record.schemaVersion !== 2) return;
	const pluginAppPolicyContext = readPluginAppPolicyContext(record.pluginAppPolicyContext, record.schemaVersion);
	const historyCoveredThrough = readTimestamp(record.historyCoveredThrough) ?? readTimestamp(record.updatedAt) ?? readTimestamp(record.createdAt) ?? readTimestamp(options.now) ?? (/* @__PURE__ */ new Date()).toISOString();
	const authProfileId = typeof record.authProfileId === "string" ? record.authProfileId : void 0;
	const binding = readCodexAppServerThreadBinding({
		...record,
		modelProvider: normalizeCodexAppServerBindingModelProvider({
			...options.lookup,
			authProfileId,
			modelProvider: typeof record.modelProvider === "string" ? record.modelProvider : void 0
		}),
		cwd: typeof record.cwd === "string" ? record.cwd : "",
		pluginAppPolicyContext,
		historyCoveredThrough
	});
	return binding ? {
		version: 1,
		state: "active",
		binding: stripUndefinedBinding(binding)
	} : void 0;
}
function bindingLeaseLostError(key, cause) {
	return new Error(`Lost Codex binding lease: ${key}`, cause === void 0 ? void 0 : { cause });
}
/** Carries one prepared run identity through callers that rederive it from public params. */
function scopeCodexRunBindingStore(params) {
	const mapSessionIdentity = (identity) => identity.agentId === params.logicalIdentity.agentId && identity.sessionId === params.logicalIdentity.sessionId && identity.sessionKey?.trim() === params.logicalIdentity.sessionKey?.trim() ? params.physicalIdentity : identity;
	const mapIdentity = (identity) => identity.kind === "session" ? mapSessionIdentity(identity) : identity;
	return {
		read: (identity) => params.bindingStore.read(mapIdentity(identity)),
		hasOtherThreadOwner: (threadId, identity) => params.bindingStore.hasOtherThreadOwner(threadId, identity ? mapIdentity(identity) : void 0),
		mutate: (identity, mutation) => params.bindingStore.mutate(mapIdentity(identity), mutation),
		prepareSessionGenerationReclaim: (identity) => params.bindingStore.prepareSessionGenerationReclaim(mapSessionIdentity(identity)),
		adoptSessionGeneration: (identity, expectedPreviousSessionId) => params.bindingStore.adoptSessionGeneration(mapSessionIdentity(identity), expectedPreviousSessionId),
		resetSessionGeneration: (identity) => params.bindingStore.resetSessionGeneration(mapSessionIdentity(identity)),
		retireSessionGeneration: (identity) => params.bindingStore.retireSessionGeneration(mapSessionIdentity(identity)),
		withThreadArchiveFence: (run) => params.bindingStore.withThreadArchiveFence(run),
		withLease: (identity, run) => params.bindingStore.withLease(mapIdentity(identity), run)
	};
}
/** Lets the authoritative OpenClaw session generation claim a stale stable binding row. */
async function reclaimCurrentCodexSessionGeneration(params) {
	const sessionKey = params.identity.sessionKey?.trim();
	if (!sessionKey) return true;
	const plan = await params.bindingStore.prepareSessionGenerationReclaim(params.identity);
	if (plan.kind === "resolved") return plan.result;
	try {
		const storePath = params.storePath?.trim() || resolveStorePath(params.config?.session?.store, { agentId: params.identity.agentId });
		if (getSessionEntry({
			agentId: params.identity.agentId,
			hydrateSkillPromptRefs: false,
			readConsistency: "latest",
			sessionKey,
			storePath
		})?.sessionId !== params.identity.sessionId) return false;
	} catch {
		return false;
	}
	return await params.bindingStore.mutate(params.identity, {
		kind: "reclaim-generation",
		expectedPreviousSessionId: plan.expectedPreviousSessionId
	});
}
/** Creates the single binding facade owned by the Codex plugin runtime. */
function createCodexAppServerBindingStore(state) {
	const update = state.update?.bind(state);
	if (!update) throw new Error("Codex app-server bindings require atomic plugin-state updates");
	const leaseContext = new AsyncLocalStorage();
	const archiveContext = new AsyncLocalStorage();
	let activeBindingMutations = 0;
	let pendingArchives = 0;
	let archiveTail = Promise.resolve();
	let bindingMutationsDrained = [];
	const waitForBindingMutations = async () => {
		if (activeBindingMutations === 0) return;
		await new Promise((resolve) => {
			bindingMutationsDrained.push(resolve);
		});
	};
	const runBindingMutation = async (run) => {
		if (archiveContext.getStore() === true) return await run();
		if (pendingArchives > 0) throw new Error("Codex binding mutation blocked while a native archive is in progress; retry");
		activeBindingMutations += 1;
		try {
			return await run();
		} finally {
			activeBindingMutations -= 1;
			if (activeBindingMutations === 0) {
				const drained = bindingMutationsDrained;
				bindingMutationsDrained = [];
				for (const resolve of drained) resolve();
			}
		}
	};
	const renewLease = (key, owner) => {
		if (owner.failure) return;
		try {
			let renewed = false;
			const stored = update(key, (raw) => {
				const current = readStoredCodexAppServerBinding(raw);
				if (raw !== void 0 && !current) throw new Error(`Invalid Codex app-server binding row: ${key}`);
				const lease = current?.lease;
				const now = Date.now();
				if (!lease || lease.token !== owner.token || lease.expiresAt <= now) return;
				renewed = true;
				return {
					...current,
					lease: {
						token: owner.token,
						expiresAt: now + BINDING_LEASE_STALE_MS
					}
				};
			});
			if (!renewed || !stored) owner.failure = bindingLeaseLostError(key);
		} catch (error) {
			owner.failure = bindingLeaseLostError(key, error);
		}
	};
	const transactKey = async (key, apply, ttlMs) => {
		const deadline = Date.now() + BINDING_LEASE_WAIT_MS;
		while (true) {
			let busy = false;
			let leaseLost = false;
			let result;
			const ownedLease = leaseContext.getStore()?.get(key);
			if (ownedLease?.failure) throw ownedLease.failure;
			const ownedToken = ownedLease?.token;
			update(key, (raw) => {
				const current = readStoredCodexAppServerBinding(raw);
				if (raw !== void 0 && !current) throw new Error(`Invalid Codex app-server binding row: ${key}`);
				const activeLease = current?.lease;
				const now = Date.now();
				if (ownedToken && (!activeLease || activeLease.token !== ownedToken || activeLease.expiresAt <= now)) {
					leaseLost = true;
					return;
				}
				if (activeLease && activeLease.token !== ownedToken && activeLease.expiresAt > now) {
					busy = true;
					return;
				}
				const applied = apply(current, ownedToken);
				result = applied.result;
				return applied.next;
			}, ttlMs == null ? void 0 : { ttlMs });
			if (leaseLost) {
				const failure = bindingLeaseLostError(key);
				if (ownedLease) ownedLease.failure = failure;
				throw failure;
			}
			if (!busy) return result;
			if (Date.now() >= deadline) throw new Error(`Timed out waiting for Codex binding lease: ${key}`);
			await sleep(BINDING_LEASE_RETRY_INTERVAL_MS);
		}
	};
	return {
		async read(identity) {
			const key = bindingStoreKey(identity);
			const raw = state.lookup(key);
			const stored = readStoredCodexAppServerBinding(raw);
			if (raw !== void 0 && !stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
			return stored?.state === "active" && ownsStoredSessionGeneration(identity, stored) ? stored.binding : void 0;
		},
		async hasOtherThreadOwner(threadId, currentIdentity) {
			const currentKey = currentIdentity ? bindingStoreKey(currentIdentity) : void 0;
			return state.entries().some(({ key, value }) => {
				const stored = readStoredCodexAppServerBinding(value);
				if (!stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
				const isCurrentOwner = currentIdentity !== void 0 && key === currentKey && (currentIdentity.kind === "conversation" || stored.sessionId === currentIdentity.sessionId.trim());
				if (stored.state !== "active" || stored.binding.threadId !== threadId || isCurrentOwner) return false;
				return true;
			});
		},
		async prepareSessionGenerationReclaim(identity) {
			const key = bindingStoreKey(identity);
			const raw = state.lookup(key);
			const current = readStoredCodexAppServerBinding(raw);
			if (raw !== void 0 && !current) throw new Error(`Invalid Codex app-server binding row: ${key}`);
			if (!current) return {
				kind: "resolved",
				result: true
			};
			const currentSessionId = current.sessionId;
			if (!currentSessionId) return {
				kind: "resolved",
				result: current.state !== "cleared" || current.retired !== true
			};
			if (currentSessionId === identity.sessionId) return current.state === "cleared" && current.retired === true ? {
				kind: "verify",
				expectedPreviousSessionId: currentSessionId
			} : {
				kind: "resolved",
				result: true
			};
			return {
				kind: "verify",
				expectedPreviousSessionId: currentSessionId
			};
		},
		async mutate(identity, mutation) {
			return await runBindingMutation(async () => {
				const key = bindingStoreKey(identity);
				const retainLegacyClear = mutation.kind === "clear" && key.startsWith("conversation:legacy-");
				return await transactKey(key, (current, leaseToken) => {
					const ownsGeneration = ownsStoredSessionGeneration(identity, current);
					const ownedLease = current?.lease && current.lease.token === leaseToken ? { lease: current.lease } : {};
					if (mutation.kind === "reclaim-generation") {
						if (identity.kind !== "session" || !identity.sessionKey?.trim()) return { result: false };
						if (!current) return { result: true };
						if (ownsGeneration) {
							if (current.state === "cleared" && current.retired === true && current.sessionId === mutation.expectedPreviousSessionId) return {
								result: true,
								next: {
									version: 1,
									state: "cleared",
									sessionId: identity.sessionId,
									...ownedLease
								}
							};
							return { result: current.state !== "cleared" || current.retired !== true };
						}
						if (current.sessionId !== mutation.expectedPreviousSessionId) return { result: false };
						if (current.state === "active" && current.binding.connectionScope === "supervision") return { result: false };
						return {
							result: true,
							next: {
								version: 1,
								state: "cleared",
								sessionId: identity.sessionId,
								...ownedLease
							}
						};
					}
					const storedActive = current?.state === "active" ? current : void 0;
					const active = ownsGeneration ? storedActive : void 0;
					const retiredGeneration = current?.state === "cleared" && current.retired === true && ownsGeneration;
					const preservesSupervisionOwner = mutation.kind === "set" && active?.binding.connectionScope === "supervision" && isSameSupervisionOwner(active.binding, mutation.binding);
					const clearsPendingSupervisionOwner = mutation.kind === "clear" && active?.binding.connectionScope === "supervision" && matchesPendingSupervisionClear(active.binding, mutation.threadId, mutation.expectedPendingSupervisionBranch);
					const replacesExpectedOrdinaryOwner = mutation.kind === "replace-thread" && active?.binding.threadId === mutation.expectedThreadId && active.binding.connectionScope !== "supervision" && mutation.binding.connectionScope !== "supervision" && mutation.binding.threadId !== mutation.expectedThreadId;
					if (mutation.kind === "set" && (mutation.if?.kind === "absent" && storedActive || current !== void 0 && !ownsGeneration || retiredGeneration || active?.binding.connectionScope === "supervision" && !preservesSupervisionOwner) || mutation.kind === "patch" && active?.binding.threadId !== mutation.threadId || mutation.kind === "replace-thread" && !replacesExpectedOrdinaryOwner || (mutation.kind === "patch-pending-supervision-branch" || mutation.kind === "commit-pending-supervision-branch") && !matchesPendingSupervisionBranch(active?.binding, mutation.expected) || mutation.kind === "clear" && (mutation.threadId !== void 0 && active?.binding.threadId !== mutation.threadId || !ownsGeneration || active?.binding.connectionScope === "supervision" && !clearsPendingSupervisionOwner)) return { result: false };
					if (mutation.kind === "clear" && retiredGeneration) return { result: true };
					if (mutation.kind === "clear") return {
						result: true,
						next: {
							version: 1,
							state: "cleared",
							...storedSessionGeneration(identity, current),
							...ownedLease
						}
					};
					let binding;
					if (mutation.kind === "set" || mutation.kind === "replace-thread") binding = validateBindingForWrite(mutation.binding);
					else if (mutation.kind === "patch-pending-supervision-branch") binding = validateBindingForWrite({
						...active.binding,
						pendingSupervisionBranch: mutation.pending
					});
					else if (mutation.kind === "commit-pending-supervision-branch") binding = validateBindingForWrite({
						...active.binding,
						...mutation.patch,
						threadId: mutation.threadId,
						pendingSupervisionBranch: void 0
					});
					else binding = validateBindingForWrite({
						...active.binding,
						...mutation.patch,
						threadId: mutation.threadId
					});
					return {
						result: true,
						next: {
							version: 1,
							state: "active",
							binding,
							...storedSessionGeneration(identity, current),
							...ownedLease
						}
					};
				}, mutation.kind === "clear" && !retainLegacyClear && !leaseContext.getStore()?.has(key) ? 1 : void 0);
			});
		},
		async adoptSessionGeneration(identity, expectedPreviousSessionId) {
			return await runBindingMutation(async () => {
				const key = bindingStoreKey(identity);
				const expectedSessionId = expectedPreviousSessionId.trim();
				const targetSessionId = identity.sessionId.trim();
				if (!expectedSessionId) throw new Error("Codex session generation adoption requires the previous session id");
				return await transactKey(key, (current) => {
					if (current?.state !== "active") return { result: "absent" };
					if (current.sessionId === targetSessionId) return { result: "current" };
					if (current.sessionId !== expectedSessionId) return { result: "conflict" };
					return {
						result: "adopted",
						next: {
							...current,
							sessionId: targetSessionId
						}
					};
				});
			});
		},
		async resetSessionGeneration(identity) {
			return await runBindingMutation(async () => {
				const key = bindingStoreKey(identity);
				return await transactKey(key, (current, leaseToken) => {
					if (!current) return { result: "absent" };
					if (!ownsStoredSessionGeneration(identity, current)) return { result: "conflict" };
					if (current.state === "cleared" && current.retired === true) return { result: "conflict" };
					return {
						result: "applied",
						next: {
							version: 1,
							state: "cleared",
							...storedSessionGeneration(identity, current),
							...current.lease && current.lease.token === leaseToken ? { lease: current.lease } : {}
						}
					};
				}, leaseContext.getStore()?.has(key) ? void 0 : 1);
			});
		},
		async retireSessionGeneration(identity) {
			return await runBindingMutation(async () => {
				const key = bindingStoreKey(identity);
				return await transactKey(key, (current, leaseToken) => {
					if (!current) return { result: "absent" };
					if (!ownsStoredSessionGeneration(identity, current)) return { result: "conflict" };
					if (current.state === "cleared" && current.retired === true) return { result: "applied" };
					return {
						result: "applied",
						next: {
							version: 1,
							state: "cleared",
							retired: true,
							...storedSessionGeneration(identity, current),
							...current.lease && current.lease.token === leaseToken ? { lease: current.lease } : {}
						}
					};
				}, identity.sessionKey?.trim() ? void 0 : PHYSICAL_SESSION_RETIRE_TTL_MS);
			});
		},
		async withThreadArchiveFence(run) {
			pendingArchives += 1;
			const operation = archiveTail.then(async () => {
				await waitForBindingMutations();
				return await archiveContext.run(true, run);
			});
			archiveTail = operation.then(() => void 0, () => void 0);
			try {
				return await operation;
			} finally {
				pendingArchives -= 1;
			}
		},
		async withLease(identity, run) {
			const key = bindingStoreKey(identity);
			const owned = leaseContext.getStore();
			const existingOwner = owned?.get(key);
			if (existingOwner) {
				const failureBeforeRun = existingOwner.failure;
				if (failureBeforeRun) throw failureBeforeRun;
				const result = await run();
				const failureAfterRun = existingOwner.failure;
				if (failureAfterRun) throw failureAfterRun;
				return result;
			}
			const token = randomUUID();
			if (!await transactKey(key, (current) => {
				if (current?.state === "cleared" && current.retired === true && ownsStoredSessionGeneration(identity, current)) return { result: false };
				const lease = {
					token,
					expiresAt: Date.now() + BINDING_LEASE_STALE_MS
				};
				if (current?.state === "active") return {
					result: true,
					next: {
						...current,
						...preservedSessionGeneration(identity, current),
						lease
					}
				};
				if (current?.state === "cleared" && current.retired === true) return {
					result: true,
					next: {
						...current,
						lease
					}
				};
				return {
					result: true,
					next: {
						version: 1,
						state: "cleared",
						...preservedSessionGeneration(identity, current),
						lease
					}
				};
			})) throw new Error(`Codex binding generation was retired: ${key}`);
			const owner = { token };
			const nested = new Map(owned);
			nested.set(key, owner);
			const heartbeat = setInterval(() => renewLease(key, owner), BINDING_LEASE_RENEW_INTERVAL_MS);
			heartbeat.unref();
			try {
				const result = await leaseContext.run(nested, run);
				if (owner.failure) throw owner.failure;
				return result;
			} finally {
				clearInterval(heartbeat);
				try {
					const removeOwnedLease = (raw, matches) => {
						const current = readStoredCodexAppServerBinding(raw);
						if (!current || !matches(current) || current.lease?.token !== token) return;
						const { lease: _lease, ...released } = current;
						return released;
					};
					if (!update(key, (raw) => removeOwnedLease(raw, (current) => current.state === "active"))) {
						if (!update(key, (raw) => removeOwnedLease(raw, (current) => current.state === "cleared" && current.retired === true), key.startsWith("session:") ? { ttlMs: PHYSICAL_SESSION_RETIRE_TTL_MS } : void 0)) update(key, (raw) => removeOwnedLease(raw, (current) => current.state === "cleared"), { ttlMs: 1 });
					}
				} catch (error) {
					log.warn("failed to release codex app-server binding lease", {
						key,
						error
					});
				}
			}
		}
	};
}
function matchesPendingSupervisionBranch(binding, expected) {
	const pending = binding?.pendingSupervisionBranch;
	if (!pending || binding?.threadId !== expected.sourceThreadId) return false;
	if (pending.sourceThreadId !== expected.sourceThreadId || pending.connectionFingerprint !== expected.connectionFingerprint || pending.lastTurnId !== expected.lastTurnId) return false;
	const currentCleanup = pending.cleanupThreadIds ?? [];
	const expectedCleanup = expected.cleanupThreadIds ?? [];
	return currentCleanup.length === expectedCleanup.length && currentCleanup.every((threadId, index) => threadId === expectedCleanup[index]);
}
function isSameSupervisionOwner(current, replacement) {
	return replacement.connectionScope === "supervision" && replacement.threadId === current.threadId && replacement.supervisionSourceThreadId === current.supervisionSourceThreadId;
}
function matchesPendingSupervisionClear(binding, threadId, expected) {
	if (!expected) return false;
	const sourceThreadId = expected.sourceThreadId;
	return threadId === sourceThreadId && binding.supervisionSourceThreadId === sourceThreadId && matchesPendingSupervisionBranch(binding, expected);
}
/** Stable plugin-state key for one current binding owner. */
function bindingStoreKey(identity) {
	if (identity.kind === "session") {
		const rawAgentId = identity.agentId.trim();
		const sessionId = identity.sessionId.trim();
		if (!rawAgentId) throw new Error("Codex app-server binding requires an agent id");
		if (!sessionId) throw new Error("Codex app-server binding requires a session id");
		const agentId = resolveSessionAgentIds({ agentId: rawAgentId }).sessionAgentId;
		const sessionKey = identity.sessionKey?.trim();
		if (sessionKey) return `session-key:${agentId}:${createHash("sha256").update(sessionKey).digest("base64url")}`;
		return `session:${agentId}:${sessionId}`;
	}
	const bindingId = identity.bindingId.trim();
	if (!bindingId) throw new Error("Codex app-server conversation binding requires a binding id");
	return `conversation:${bindingId}`;
}
function readStoredCodexAppServerBinding(value) {
	const result = storedBindingSchema.safeParse(value);
	return result.success ? stripUndefinedValue(result.data) : void 0;
}
function storedSessionGeneration(identity, current) {
	if (identity.kind === "session") return { sessionId: identity.sessionId };
	return current?.sessionId ? { sessionId: current.sessionId } : {};
}
function preservedSessionGeneration(identity, current) {
	if (current?.sessionId) return { sessionId: current.sessionId };
	return storedSessionGeneration(identity, current);
}
function ownsStoredSessionGeneration(identity, current) {
	return identity.kind !== "session" || !current?.sessionId || current.sessionId === identity.sessionId;
}
function validateBindingForWrite(binding) {
	const validated = readCodexAppServerThreadBinding(binding);
	if (!validated) throw new Error("Invalid Codex app-server thread binding");
	return stripUndefinedBinding(validated);
}
/** Parses stored or shipped sidecar data into the current domain value. */
function readCodexAppServerThreadBinding(value) {
	const result = threadBindingSchema.safeParse(value);
	if (!result.success) return;
	return result.data;
}
function stripUndefinedBinding(binding) {
	return stripUndefinedValue(binding);
}
function stripUndefinedValue(value) {
	if (Array.isArray(value)) return value.map(stripUndefinedValue);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== void 0).map(([key, entry]) => [key, stripUndefinedValue(entry)]));
}
function readTimestamp(value) {
	return optionalTimestampSchema.parse(value);
}
function readPluginAppPolicyContext(value, bindingSchemaVersion) {
	const record = asOptionalRecord(value);
	if (!record || typeof record.fingerprint !== "string") return;
	const apps = asOptionalRecord(record.apps);
	if (!apps) return;
	const parsedApps = {};
	for (const [appId, rawEntry] of Object.entries(apps)) {
		const entry = asOptionalRecord(rawEntry);
		if (!entry) return;
		const destructiveApprovalMode = readDestructiveApprovalMode(entry.destructiveApprovalMode, bindingSchemaVersion);
		const mcpServerNamesValid = Array.isArray(entry.mcpServerNames) && entry.mcpServerNames.every((serverName) => typeof serverName === "string");
		if (entry.source === "account") {
			if ("appId" in entry || typeof entry.appName !== "string" || typeof entry.allowDestructiveActions !== "boolean" || entry.allowOpenWorld !== void 0 && typeof entry.allowOpenWorld !== "boolean" || destructiveApprovalMode === "invalid" || !mcpServerNamesValid) return;
			parsedApps[appId] = {
				source: "account",
				appName: entry.appName,
				allowDestructiveActions: entry.allowDestructiveActions,
				...typeof entry.allowOpenWorld === "boolean" ? { allowOpenWorld: entry.allowOpenWorld } : {},
				...destructiveApprovalMode ? { destructiveApprovalMode } : {},
				mcpServerNames: entry.mcpServerNames
			};
			continue;
		}
		if ("appId" in entry || entry.source !== void 0 && entry.source !== "plugin" || typeof entry.configKey !== "string" || typeof entry.marketplaceName !== "string" || !CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN.test(entry.marketplaceName) || typeof entry.pluginName !== "string" || typeof entry.allowDestructiveActions !== "boolean" || entry.allowOpenWorld !== void 0 && typeof entry.allowOpenWorld !== "boolean" || destructiveApprovalMode === "invalid" || !mcpServerNamesValid) return;
		parsedApps[appId] = {
			configKey: entry.configKey,
			marketplaceName: entry.marketplaceName,
			pluginName: entry.pluginName,
			allowDestructiveActions: entry.allowDestructiveActions,
			...typeof entry.allowOpenWorld === "boolean" ? { allowOpenWorld: entry.allowOpenWorld } : {},
			...destructiveApprovalMode ? { destructiveApprovalMode } : {},
			mcpServerNames: entry.mcpServerNames
		};
	}
	const parsedPluginAppIds = {};
	if (record.pluginAppIds !== void 0 && (!record.pluginAppIds || typeof record.pluginAppIds !== "object" || Array.isArray(record.pluginAppIds))) return;
	if (record.pluginAppIds && typeof record.pluginAppIds === "object") for (const [configKey, appIds] of Object.entries(record.pluginAppIds)) {
		if (!Array.isArray(appIds) || appIds.some((appId) => typeof appId !== "string")) return;
		parsedPluginAppIds[configKey] = appIds;
	}
	return {
		fingerprint: record.fingerprint,
		apps: parsedApps,
		pluginAppIds: parsedPluginAppIds
	};
}
function readDestructiveApprovalMode(value, bindingSchemaVersion) {
	if (value === void 0) return;
	if (value === "allow" || value === "deny") return value;
	if (value === "auto") return bindingSchemaVersion === 1 ? "allow" : "auto";
	if (value === "ask" && bindingSchemaVersion === 2) return "ask";
	if (value === "on-request" && bindingSchemaVersion === 1) return "auto";
	return "invalid";
}
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
/** Returns true when an auth profile uses native Codex/OpenAI app-server auth. */
function isCodexAppServerNativeAuthProfile(lookup) {
	const authProfileId = lookup.authProfileId?.trim();
	if (!authProfileId) return false;
	try {
		const credential = (lookup.authProfileStore ?? ensureAuthProfileStore(lookup.agentDir?.trim() || resolveDefaultAgentDir(lookup.config ?? {}), {
			allowKeychainPrompt: false,
			config: lookup.config,
			externalCliProviderIds: [CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER],
			externalCliProfileIds: [authProfileId]
		})).profiles[authProfileId];
		if (!credential || credential.type === "api_key") return false;
		const provider = credential.provider?.trim();
		return Boolean(provider && resolveProviderIdForAuth(provider, { config: lookup.config }) === CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER);
	} catch (error) {
		log.debug("failed to resolve codex app-server auth profile provider", {
			authProfileId,
			error
		});
		return false;
	}
}
/** Hides redundant OpenAI provider attribution for native Codex auth bindings. */
function normalizeCodexAppServerBindingModelProvider(params) {
	const modelProvider = params.modelProvider?.trim();
	if (!modelProvider) return;
	if (isCodexAppServerNativeAuthProfile(params) && modelProvider.toLowerCase() === PUBLIC_OPENAI_MODEL_PROVIDER) return;
	return modelProvider;
}
//#endregion
export { readCodexPluginConfig as A, resolveCodexComputerUseConfig as C, withMcpElicitationsApprovalPolicy as D, shouldAutoApproveCodexAppServerApprovals as E, resolveCodexAppServerUserHomeDir as F, resolveCodexModelBackedReviewerPolicyContext as I, isCodexAppServerApprovalPolicyAllowedByRequirements as L, CODEX_PLUGINS_MARKETPLACE_NAME as M, CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME as N, isCodexRemoteExecPlacementSandbox as O, canUseCodexModelBackedApprovalsReviewerForModel as P, resolveOpenClawExecPolicyForCodexAppServer as R, resolveCodexAppServerStartOptionsForAgent as S, assertCodexAppServerConnectionSecurity as T, sessionBindingIdentity as _, createCodexAppServerBindingStore as a, resolveCodexAppServerHomeScope as b, hashCodexAppServerBindingFingerprint as c, normalizeStoredCodexAppServerBindingFingerprints as d, readCodexAppServerThreadBinding as f, scopeCodexRunBindingStore as g, resolveCodexRunSessionBindingAuthority as h, bindingStoreKey as i, resolveCodexPluginsPolicy as j, isCodexSandboxExecServerEnabled as k, isCodexAppServerNativeAuthProfile as l, reclaimCurrentCodexSessionGeneration as m, CodexSupervisionBindingReplacementError as n, createCodexSessionGenerationSupersededError as o, readStoredCodexAppServerBinding as p, assertCodexBindingMayBeReplaced as r, createStoredCodexAppServerBinding as s, CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS as t, normalizeCodexAppServerBindingModelProvider as u, codexAppServerStartOptionsKey as v, resolveCodexSupervisionAppServerRuntimeOptions as w, resolveCodexAppServerRuntimeOptions as x, codexSandboxPolicyForTurn as y, isCodexFastServiceTier as z };
