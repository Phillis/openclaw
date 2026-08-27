import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as resolveHomeRelativePath, t as expandHomePrefix } from "./home-dir-DcrXWQPU.js";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-D8GLfPr_.js";
import { randomBytes } from "node:crypto";
import path from "node:path";
//#region src/infra/exec-approvals-config.ts
const toStringOrUndefined = readStringValue;
function isExecSecurity(value) {
	return value === "allowlist" || value === "full" || value === "deny";
}
function isExecAsk(value) {
	return value === "always" || value === "off" || value === "on-miss";
}
const DEFAULT_SECURITY = "full";
const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK = "deny";
const DEFAULT_EXEC_APPROVALS_STATE_DIR = "~/.openclaw";
const EXEC_APPROVALS_FILE = "exec-approvals.json";
const EXEC_APPROVALS_SOCKET = "exec-approvals.sock";
function resolveExecApprovalsStateDir(env = process.env) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) {
		const resolved = resolveHomeRelativePath(override, { env });
		return {
			path: resolved,
			displayPath: resolved
		};
	}
	return {
		path: expandHomePrefix(DEFAULT_EXEC_APPROVALS_STATE_DIR, { env }),
		displayPath: DEFAULT_EXEC_APPROVALS_STATE_DIR
	};
}
function resolveExecApprovalsPath(env = process.env) {
	return path.join(resolveExecApprovalsStateDir(env).path, EXEC_APPROVALS_FILE);
}
function resolveExecApprovalsSocketPath() {
	return path.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_SOCKET);
}
function resolveExecApprovalsDisplayPath() {
	const stateDir = resolveExecApprovalsStateDir().displayPath;
	const locator = path.join("state", "openclaw.sqlite#exec_approvals_config");
	return stateDir === DEFAULT_EXEC_APPROVALS_STATE_DIR ? `${stateDir}/${locator}` : path.join(stateDir, locator);
}
function resolveExecApprovalsTranscriptPath() {
	return process.env.OPENCLAW_STATE_DIR?.trim() ? "$OPENCLAW_STATE_DIR/state/openclaw.sqlite#exec_approvals_config" : `${DEFAULT_EXEC_APPROVALS_STATE_DIR}/state/openclaw.sqlite#exec_approvals_config`;
}
function createFailClosedExecApprovalsFallback() {
	return normalizeExecApprovalsInternal({
		version: 1,
		defaults: {
			security: "deny",
			ask: "off",
			askFallback: "deny",
			autoAllowSkills: false
		},
		agents: {}
	});
}
function hasValidExecApprovalPolicyFields(value) {
	if (!isPlainObject(value)) return false;
	return (value.security === void 0 || isExecSecurity(value.security)) && (value.ask === void 0 || isExecAsk(value.ask)) && (value.askFallback === void 0 || isExecSecurity(value.askFallback)) && (value.autoAllowSkills === void 0 || typeof value.autoAllowSkills === "boolean");
}
function isValidPersistedExecAllowlistEntry(value) {
	if (typeof value === "string") return value.trim().length > 0;
	if (!isPlainObject(value) || typeof value.pattern !== "string" || !value.pattern.trim()) return false;
	return (value.id === void 0 || typeof value.id === "string") && (value.source === void 0 || typeof value.source === "string") && (value.commandText === void 0 || typeof value.commandText === "string") && (value.argPattern === void 0 || typeof value.argPattern === "string") && (value.lastUsedAt === void 0 || typeof value.lastUsedAt === "number" && Number.isFinite(value.lastUsedAt)) && (value.lastUsedCommand === void 0 || typeof value.lastUsedCommand === "string") && (value.lastResolvedPath === void 0 || typeof value.lastResolvedPath === "string");
}
function isValidPersistedExecApprovals(value) {
	if (!isPlainObject(value) || value.version !== 1) return false;
	if (value.socket !== void 0) {
		if (!isPlainObject(value.socket) || value.socket.path !== void 0 && typeof value.socket.path !== "string" || value.socket.token !== void 0 && typeof value.socket.token !== "string") return false;
	}
	if (value.defaults !== void 0 && !hasValidExecApprovalPolicyFields(value.defaults)) return false;
	if (value.agents !== void 0) {
		if (!isPlainObject(value.agents)) return false;
		for (const agent of Object.values(value.agents)) if (!hasValidExecApprovalPolicyFields(agent) || agent.allowlist !== void 0 && (!Array.isArray(agent.allowlist) || !agent.allowlist.every(isValidPersistedExecAllowlistEntry))) return false;
	}
	return true;
}
/** Parse only structurally valid persisted approvals without inventing fallback policy. */
function tryParsePersistedExecApprovals(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (isValidPersistedExecApprovals(parsed)) return normalizeExecApprovalsInternal(parsed);
	} catch {}
	return null;
}
function normalizeAllowlistPattern(value) {
	const trimmed = normalizeOptionalString(value) ?? "";
	return trimmed ? normalizeLowercaseStringOrEmpty(trimmed) : null;
}
function mergeLegacyAgent(current, legacy) {
	const allowlist = [];
	const seen = /* @__PURE__ */ new Set();
	const pushEntry = (entry) => {
		const patternKey = normalizeAllowlistPattern(entry.pattern);
		if (!patternKey) return;
		const key = `${patternKey}\x00${entry.argPattern?.trim() ?? ""}`;
		if (seen.has(key)) return;
		seen.add(key);
		allowlist.push(entry);
	};
	for (const entry of current.allowlist ?? []) pushEntry(entry);
	for (const entry of legacy.allowlist ?? []) pushEntry(entry);
	return {
		security: current.security ?? legacy.security,
		ask: current.ask ?? legacy.ask,
		askFallback: current.askFallback ?? legacy.askFallback,
		autoAllowSkills: current.autoAllowSkills ?? legacy.autoAllowSkills,
		allowlist: allowlist.length > 0 ? allowlist : void 0
	};
}
function coerceAllowlistEntries(allowlist) {
	if (!Array.isArray(allowlist) || allowlist.length === 0) return Array.isArray(allowlist) ? allowlist : void 0;
	let changed = false;
	const result = [];
	for (const item of allowlist) if (typeof item === "string") {
		const trimmed = item.trim();
		if (trimmed) {
			result.push({ pattern: trimmed });
			changed = true;
		} else changed = true;
	} else if (item && typeof item === "object" && !Array.isArray(item)) {
		const pattern = item.pattern;
		if (typeof pattern === "string" && pattern.trim().length > 0) result.push(item);
		else changed = true;
	} else changed = true;
	return changed ? result.length > 0 ? result : void 0 : allowlist;
}
function ensureAllowlistIds(allowlist) {
	if (!Array.isArray(allowlist) || allowlist.length === 0) return allowlist;
	let changed = false;
	const next = allowlist.map((entry) => {
		if (entry.id) return entry;
		changed = true;
		return {
			...entry,
			id: crypto.randomUUID()
		};
	});
	return changed ? next : allowlist;
}
function stripAllowlistCommandText(allowlist) {
	if (!Array.isArray(allowlist) || allowlist.length === 0) return allowlist;
	let changed = false;
	const next = allowlist.map((entry) => {
		if (typeof entry.commandText !== "string") return entry;
		changed = true;
		const { commandText: _commandText, ...rest } = entry;
		return rest;
	});
	return changed ? next : allowlist;
}
function sanitizeExecApprovalPolicy(policy) {
	const security = toStringOrUndefined(policy?.security)?.trim();
	const ask = toStringOrUndefined(policy?.ask)?.trim();
	const askFallback = toStringOrUndefined(policy?.askFallback)?.trim();
	return {
		security: security === "deny" || security === "allowlist" || security === "full" ? security : void 0,
		ask: ask === "off" || ask === "on-miss" || ask === "always" ? ask : void 0,
		askFallback: askFallback === "deny" || askFallback === "allowlist" || askFallback === "full" ? askFallback : void 0,
		autoAllowSkills: policy?.autoAllowSkills
	};
}
function normalizeExecApprovalsInternal(file) {
	const { path: rawSocketPath, token: rawValue } = file.socket ?? {};
	const socketPath = rawSocketPath?.trim();
	const token = rawValue?.trim();
	const agents = { ...file.agents };
	const legacyDefault = agents.default;
	if (legacyDefault) {
		const main = agents[DEFAULT_AGENT_ID];
		agents[DEFAULT_AGENT_ID] = main ? mergeLegacyAgent(main, legacyDefault) : legacyDefault;
		delete agents.default;
	}
	for (const [key, agent] of Object.entries(agents)) {
		const allowlist = stripAllowlistCommandText(ensureAllowlistIds(coerceAllowlistEntries(agent.allowlist)));
		const sanitizedPolicy = sanitizeExecApprovalPolicy(agent);
		if (allowlist !== agent.allowlist || sanitizedPolicy.security !== agent.security || sanitizedPolicy.ask !== agent.ask || sanitizedPolicy.askFallback !== agent.askFallback) agents[key] = {
			...agent,
			allowlist,
			security: sanitizedPolicy.security,
			ask: sanitizedPolicy.ask,
			askFallback: sanitizedPolicy.askFallback
		};
	}
	const sanitizedDefaults = sanitizeExecApprovalPolicy(file.defaults);
	return {
		version: 1,
		socket: {
			path: socketPath && socketPath.length > 0 ? socketPath : void 0,
			token: token && token.length > 0 ? token : void 0
		},
		defaults: { ...sanitizedDefaults },
		agents
	};
}
function mergeExecApprovalsSocketDefaults(params) {
	const currentSocketPath = params.current?.socket?.path?.trim();
	const currentToken = params.current?.socket?.token?.trim();
	const socketPath = params.normalized.socket?.path?.trim() ?? currentSocketPath ?? resolveExecApprovalsSocketPath();
	const token = params.normalized.socket?.token?.trim() ?? currentToken ?? generateToken();
	return {
		...params.normalized,
		socket: {
			path: socketPath,
			token
		}
	};
}
function generateToken() {
	return randomBytes(24).toString("base64url");
}
//#endregion
export { mergeExecApprovalsSocketDefaults as a, resolveExecApprovalsPath as c, tryParsePersistedExecApprovals as d, generateToken as i, resolveExecApprovalsSocketPath as l, DEFAULT_SECURITY as n, normalizeExecApprovalsInternal as o, createFailClosedExecApprovalsFallback as r, resolveExecApprovalsDisplayPath as s, DEFAULT_EXEC_APPROVAL_ASK_FALLBACK as t, resolveExecApprovalsTranscriptPath as u };
