import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { t as expandHomePrefix } from "./home-dir-BFvskzn8.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-IGAbV2KW.js";
import { n as isCwdBoundHashedArgPattern, r as isGeneratedHashedArgPattern } from "./exec-command-resolution-CJ9Vm03p.js";
import { _ as hasPosixLoginStartupBeforeInlineCommand, g as hasPosixInteractiveStartupBeforeInlineCommand, i as extractBindableShellWrapperInlineCommand, m as POSIX_INLINE_COMMAND_FLAGS, u as isShellWrapperInvocation } from "./shell-wrapper-resolution-BddNi41x.js";
import { l as resolveExecApprovalsSocketPath, o as normalizeExecApprovalsInternal, s as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-_UJgdeLU.js";
import { a as loadExecApprovals, i as ensureExecApprovalsSnapshot, l as replaceExecApprovalsSnapshot, m as updateExecApprovalsSync, p as updateExecApprovals, r as ensureExecApprovals } from "./exec-approvals-generated-migration-DfpexxOF.js";
import "./exec-approvals-analysis-BvkQXLiO.js";
import "./exec-wrapper-resolution-Et5CIZnS.js";
import { s as resolveAllowAlwaysPatternEntries } from "./exec-approvals-allowlist-BNiuHBrn.js";
import { t as canonicalizeExecApprovalPolicyRules } from "./exec-approval-policy-snapshot-BHqSsTto.js";
import net from "node:net";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/infra/exec-approvals-resolver.ts
function isExecSecurity(value) {
	return value === "allowlist" || value === "full" || value === "deny";
}
function isExecAsk(value) {
	return value === "always" || value === "off" || value === "on-miss";
}
function normalizeSecurity(value, fallback) {
	return isExecSecurity(value) ? value : fallback;
}
function normalizeAsk(value, fallback) {
	return isExecAsk(value) ? value : fallback;
}
function resolveDefaultSecurityField(params) {
	const defaultValue = params.defaults[params.field];
	if (isExecSecurity(defaultValue)) return {
		value: defaultValue,
		source: `defaults.${params.field}`
	};
	return {
		value: params.fallback,
		source: null
	};
}
function resolveDefaultAskField(params) {
	if (isExecAsk(params.defaults.ask)) return {
		value: params.defaults.ask,
		source: "defaults.ask"
	};
	return {
		value: params.fallback,
		source: null
	};
}
function resolveAgentSecurityField(params) {
	const fallbackField = resolveDefaultSecurityField({
		field: params.field,
		defaults: params.defaults,
		fallback: params.fallback
	});
	if (params.rawAgent[params.field] != null) {
		if (isExecSecurity(params.agent[params.field])) return {
			value: params.agent[params.field],
			source: `agents.${params.agentKey}.${params.field}`
		};
		return fallbackField;
	}
	if (params.rawWildcard[params.field] != null) {
		if (isExecSecurity(params.wildcard[params.field])) return {
			value: params.wildcard[params.field],
			source: `agents.*.${params.field}`
		};
		return fallbackField;
	}
	return fallbackField;
}
function resolveAgentAskField(params) {
	const fallbackField = resolveDefaultAskField({
		defaults: params.defaults,
		fallback: params.fallback
	});
	if (params.rawAgent.ask != null) {
		if (isExecAsk(params.agent.ask)) return {
			value: params.agent.ask,
			source: `agents.${params.agentKey}.ask`
		};
		return fallbackField;
	}
	if (params.rawWildcard.ask != null) {
		if (isExecAsk(params.wildcard.ask)) return {
			value: params.wildcard.ask,
			source: "agents.*.ask"
		};
		return fallbackField;
	}
	return fallbackField;
}
function resolveExecApprovalsFromFilePrepared(params) {
	const rawFile = params.rawFile;
	const file = params.file;
	const defaults = file.defaults ?? {};
	const agentKey = params.agentId ?? "default";
	const agent = file.agents?.[agentKey] ?? {};
	const wildcard = file.agents?.["*"] ?? {};
	const rawAgent = rawFile.agents?.[agentKey] ?? {};
	const rawWildcard = rawFile.agents?.["*"] ?? {};
	const fallbackSecurity = params.overrides?.security ?? "full";
	const fallbackAsk = params.overrides?.ask ?? "off";
	const fallbackAskFallback = params.overrides?.askFallback ?? "deny";
	const fallbackAutoAllowSkills = params.overrides?.autoAllowSkills ?? false;
	const resolvedDefaults = {
		security: normalizeSecurity(defaults.security, fallbackSecurity),
		ask: normalizeAsk(defaults.ask, fallbackAsk),
		askFallback: normalizeSecurity(defaults.askFallback ?? fallbackAskFallback, fallbackAskFallback),
		autoAllowSkills: defaults.autoAllowSkills ?? fallbackAutoAllowSkills
	};
	const resolvedAgentSecurity = resolveAgentSecurityField({
		field: "security",
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.security
	});
	const resolvedAgentAsk = resolveAgentAskField({
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.ask
	});
	const resolvedAgentAskFallback = resolveAgentSecurityField({
		field: "askFallback",
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.askFallback
	});
	const resolvedAgent = {
		security: resolvedAgentSecurity.value,
		ask: resolvedAgentAsk.value,
		askFallback: resolvedAgentAskFallback.value,
		autoAllowSkills: agent.autoAllowSkills ?? wildcard.autoAllowSkills ?? resolvedDefaults.autoAllowSkills
	};
	const allowlist = [...Array.isArray(wildcard.allowlist) ? wildcard.allowlist : [], ...Array.isArray(agent.allowlist) ? agent.allowlist : []];
	return {
		path: params.path ?? resolveExecApprovalsDisplayPath(),
		socketPath: expandHomePrefix(params.socketPath ?? file.socket?.path ?? resolveExecApprovalsSocketPath()),
		token: params.token,
		defaults: resolvedDefaults,
		agent: resolvedAgent,
		agentSources: {
			security: resolvedAgentSecurity.source,
			ask: resolvedAgentAsk.source,
			askFallback: resolvedAgentAskFallback.source
		},
		allowlist,
		file
	};
}
function resolveExecApprovalsFromFileInternal(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovalsInternal(params.file);
	const { token: socketToken } = file.socket ?? {};
	return resolveExecApprovalsFromFilePrepared({
		...params,
		rawFile,
		file,
		token: params.token ?? socketToken ?? ""
	});
}
//#endregion
//#region src/infra/exec-approvals-core.ts
const EXEC_TARGET_VALUES = [
	"auto",
	"sandbox",
	"gateway",
	"node"
];
function normalizeExecHost(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "sandbox" || normalized === "gateway" || normalized === "node") return normalized;
	return null;
}
function normalizeExecTarget(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "auto") return normalized;
	return normalizeExecHost(normalized);
}
function requireValidExecTarget(value) {
	if (value == null) return null;
	if (typeof value !== "string") throw new Error(`Invalid exec host value type ${typeof value}. Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`);
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return null;
	const target = normalizeExecTarget(normalized);
	if (target) return target;
	throw new Error(`Invalid exec host "${value}". Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`);
}
function normalizeExecSecurity(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "full") return normalized;
	return null;
}
function normalizeExecAsk(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "off" || normalized === "on-miss" || normalized === "always") return normalized;
	return null;
}
function normalizeExecMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "ask" || normalized === "auto" || normalized === "full") return normalized;
	return null;
}
function resolveExecModeFromPolicy(params) {
	if (params.security === "deny") return "deny";
	if (params.security === "allowlist" && params.ask === "off") return "allowlist";
	if (params.security === "full" && params.ask !== "always") return "full";
	return "ask";
}
function resolveExecPolicyForMode(mode) {
	switch (mode) {
		case "deny": return {
			security: "deny",
			ask: "off",
			autoReview: false
		};
		case "allowlist": return {
			security: "allowlist",
			ask: "off",
			autoReview: false
		};
		case "ask": return {
			security: "allowlist",
			ask: "on-miss",
			autoReview: false
		};
		case "auto": return {
			security: "allowlist",
			ask: "on-miss",
			autoReview: true
		};
		case "full": return {
			security: "full",
			ask: "off",
			autoReview: false
		};
	}
	throw new Error(`Unsupported exec mode: ${String(mode)}`);
}
function resolveExecModePolicy(params) {
	if (!params.mode) return {
		mode: resolveExecModeFromPolicy({
			security: params.security,
			ask: params.ask
		}),
		security: params.security,
		ask: params.ask,
		autoReview: false
	};
	return {
		mode: params.mode,
		...resolveExecPolicyForMode(params.mode)
	};
}
const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 18e5;
//#endregion
//#region src/infra/exec-approvals-policy.ts
function requiresExecApproval(params) {
	if (params.ask === "always") return true;
	if (params.durableApprovalSatisfied === true) return false;
	return params.ask === "on-miss" && params.security === "allowlist" && (!params.analysisOk || !params.allowlistSatisfied);
}
function normalizeCommandName(value) {
	return (value ?? "").split(/[\\/]/).pop()?.toLowerCase() ?? "";
}
function textMentionsSecurityAuditSuppressions(value) {
	const normalized = value.toLowerCase();
	return normalized.includes("security.audit.suppressions") || /["']?security["']?[\s\S]{0,200}["']?audit["']?[\s\S]{0,200}["']?suppressions["']?/.test(normalized);
}
function isReadOnlySecurityAuditSuppressionInspection(argv) {
	let offset = normalizeCommandName(argv[0]) === "pnpm" && argv[1] === "openclaw" ? 1 : 0;
	if (normalizeCommandName(argv[offset]) !== "openclaw") return false;
	offset += 1;
	while (offset < argv.length) {
		const arg = argv[offset];
		if (["--dev", "--no-color"].includes(arg ?? "")) {
			offset += 1;
			continue;
		}
		if ([
			"--profile",
			"--container",
			"--log-level"
		].includes(arg ?? "")) {
			offset += 2;
			continue;
		}
		if (arg?.startsWith("--profile=") || arg?.startsWith("--container=") || arg?.startsWith("--log-level=")) {
			offset += 1;
			continue;
		}
		break;
	}
	return argv[offset] === "config" && [
		"get",
		"schema",
		"validate"
	].includes(argv[offset + 1] ?? "");
}
function removeParsedSegmentText(command, segments) {
	let remaining = command;
	for (const segment of segments) {
		const raw = (segment.raw ?? segment.argv?.join(" "))?.trim();
		if (!raw) continue;
		remaining = remaining.replace(raw, " ");
	}
	return remaining;
}
function commandRequiresSecurityAuditSuppressionApproval(params) {
	let sawSegmentMention = false;
	for (const segment of params.segments) {
		if (!textMentionsSecurityAuditSuppressions(`${segment.raw ?? ""} ${segment.argv.join(" ")}`)) continue;
		sawSegmentMention = true;
		if (!isReadOnlySecurityAuditSuppressionInspection(segment.argv)) return true;
	}
	if (sawSegmentMention) {
		if (textMentionsSecurityAuditSuppressions(removeParsedSegmentText(params.command, params.segments))) return true;
		return false;
	}
	return textMentionsSecurityAuditSuppressions(params.command);
}
function minSecurity(a, b) {
	const order = {
		deny: 0,
		allowlist: 1,
		full: 2
	};
	return order[a] <= order[b] ? a : b;
}
function maxAsk(a, b) {
	const order = {
		off: 0,
		"on-miss": 1,
		always: 2
	};
	return order[a] >= order[b] ? a : b;
}
const DEFAULT_EXEC_APPROVAL_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
const OPTIONAL_EXEC_APPROVAL_DECISIONS = ["allow-always"];
const OPTIONAL_EXEC_APPROVAL_DECISION_SET = new Set(OPTIONAL_EXEC_APPROVAL_DECISIONS);
function isOptionalExecApprovalDecision(decision) {
	return OPTIONAL_EXEC_APPROVAL_DECISION_SET.has(decision);
}
function collectExecApprovalUnavailableDecisionSet(decisions) {
	const unavailable = /* @__PURE__ */ new Set();
	if (!Array.isArray(decisions)) return unavailable;
	for (const decision of decisions) if (isOptionalExecApprovalDecision(decision)) unavailable.add(decision);
	return unavailable;
}
function normalizeExecApprovalUnavailableDecisions(decisions) {
	const unavailable = collectExecApprovalUnavailableDecisionSet(decisions);
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => unavailable.has(decision));
}
function resolveExecApprovalAllowedDecisions(params) {
	if (normalizeExecAsk(params?.ask) === "always" || params?.allowAlwaysPersistence?.kind === "one-shot") return ["allow-once", "deny"];
	return DEFAULT_EXEC_APPROVAL_DECISIONS;
}
function resolveExecApprovalUnavailableDecisions(params) {
	const allowed = new Set(resolveExecApprovalAllowedDecisions(params));
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => !allowed.has(decision));
}
function resolveExecApprovalRequestAllowedDecisions(params) {
	const policyDecisions = resolveExecApprovalAllowedDecisions({ ask: params?.ask });
	const unavailableDecisions = collectExecApprovalUnavailableDecisionSet(params?.unavailableDecisions);
	if (unavailableDecisions.size === 0) return policyDecisions;
	return policyDecisions.filter((decision) => !isOptionalExecApprovalDecision(decision) || !unavailableDecisions.has(decision));
}
function isExecApprovalDecisionAllowed(params) {
	return resolveExecApprovalAllowedDecisions({ ask: params.ask }).includes(params.decision);
}
//#endregion
//#region src/infra/exec-approvals-allow-always.ts
function hasDurableExecApproval(params) {
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) || hasSegmentDurableExecApproval({
		analysisOk: params.analysisOk,
		segmentAllowlistEntries: params.segmentAllowlistEntries
	});
}
function buildDurableCommandApprovalPattern(commandText) {
	return `=command:${sha256HexPrefixCore(commandText, 16)}`;
}
function buildNodeCommandApprovalPattern(commandText) {
	return `=node-command:${sha256HexPrefixCore(commandText, 16)}`;
}
function hasNodeCommandAllowAlwaysMarker(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildNodeCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && entry.pattern === commandPattern);
}
function hasExactCommandDurableExecApproval(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildDurableCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && (entry.pattern === commandPattern || typeof entry.commandText === "string" && entry.commandText.trim() === normalizedCommand));
}
/** Callers pass whether their final, post-gate authorization depends on a durable grant. */
function resolveDurableExecApprovalRequirement(params) {
	if (!params.durableApprovalRequired) return null;
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) ? "exact-command" : "segment-allowlist";
}
function hasSegmentDurableExecApproval(params) {
	return params.analysisOk && params.segmentAllowlistEntries.length > 0 && params.segmentAllowlistEntries.every((entry) => entry?.source === "allow-always");
}
function buildAllowlistEntryMatchKey(entry) {
	return JSON.stringify([entry.pattern, entry.argPattern ?? null]);
}
function buildExecApprovalPolicyRuleKey(entry) {
	return JSON.stringify([
		entry.pattern,
		entry.argPattern ?? null,
		entry.source ?? null
	]);
}
function buildAllowAlwaysUpgradeRuleKey(rule) {
	if (rule.source !== void 0) return null;
	return buildExecApprovalPolicyRuleKey({
		...rule,
		source: "allow-always"
	});
}
/** Captures effective file policy while excluding ids and mutable usage metadata. */
function createExecApprovalPolicySnapshot(params) {
	const resolved = resolveExecApprovalsFromFileInternal({
		file: params.file,
		agentId: params.agentId
	});
	const allowlistRulesByKey = new Map(resolved.allowlist.map((entry) => {
		const rule = {
			pattern: entry.pattern,
			...entry.argPattern !== void 0 ? { argPattern: entry.argPattern } : {},
			...entry.source === "allow-always" ? { source: entry.source } : {}
		};
		return [buildExecApprovalPolicyRuleKey(rule), rule];
	}));
	return {
		security: resolved.agent.security,
		ask: resolved.agent.ask,
		askFallback: resolved.agent.askFallback,
		autoAllowSkills: resolved.agent.autoAllowSkills,
		allowlistRules: canonicalizeExecApprovalPolicyRules([...allowlistRulesByKey.values()])
	};
}
function isExecApprovalPolicySnapshotCurrent(expected, current) {
	const currentRuleKeys = new Set(current.allowlistRules.map(buildExecApprovalPolicyRuleKey));
	return expected.security === current.security && expected.ask === current.ask && expected.askFallback === current.askFallback && expected.autoAllowSkills === current.autoAllowSkills && expected.allowlistRules.every((rule) => {
		const key = buildExecApprovalPolicyRuleKey(rule);
		if (currentRuleKeys.has(key)) return true;
		const upgradedKey = buildAllowAlwaysUpgradeRuleKey(rule);
		return upgradedKey !== null && currentRuleKeys.has(upgradedKey);
	});
}
function applyAllowlistEntryUpdate(params) {
	if (!params.agentId) throw new Error("Exec allowlist update requires an explicit agent id.");
	const target = params.agentId;
	const agents = params.file.agents ?? {};
	const existing = agents[target] ?? {};
	const allowlist = Array.isArray(existing.allowlist) ? existing.allowlist : [];
	const trimmed = params.pattern.trim();
	if (!trimmed) return null;
	const argPattern = params.options?.argPattern === "" ? void 0 : params.options?.argPattern;
	const existingEntry = allowlist.find((entry) => entry.pattern === trimmed && (entry.argPattern ?? void 0) === argPattern);
	if (existingEntry && (!params.options?.source || existingEntry.source === params.options.source)) return null;
	const now = Date.now();
	const nextAllowlist = existingEntry ? allowlist.map((entry) => entry.pattern === trimmed && (entry.argPattern ?? void 0) === argPattern ? {
		...entry,
		argPattern,
		source: params.options?.source ?? entry.source,
		lastUsedAt: now
	} : entry) : [...allowlist, {
		id: crypto.randomUUID(),
		pattern: trimmed,
		argPattern,
		source: params.options?.source,
		lastUsedAt: now
	}];
	return {
		...params.file,
		agents: {
			...agents,
			[target]: {
				...existing,
				allowlist: nextAllowlist
			}
		}
	};
}
function addAllowlistEntry(approvals, agentId, pattern, options) {
	const snapshot = updateExecApprovalsSync({ update: (file) => applyAllowlistEntryUpdate({
		file,
		agentId,
		pattern,
		options
	}) });
	if (snapshot) replaceExecApprovalsSnapshot(approvals, snapshot.file);
}
function addDurableCommandApproval(approvals, agentId, commandText) {
	const normalized = commandText.trim();
	if (!normalized) return;
	addAllowlistEntry(approvals, agentId, buildDurableCommandApprovalPattern(normalized), { source: "allow-always" });
}
function resolveAllowAlwaysPatternCoverage(params) {
	const byKey = /* @__PURE__ */ new Map();
	let representedSegmentCount = 0;
	for (const segment of params.segments) {
		if (isShellWrapperInvocation(segment.argv)) {
			const segmentPatterns = resolveAllowAlwaysPatternEntries({
				segments: [segment],
				cwd: params.cwd,
				env: params.env,
				platform: params.platform,
				strictInlineEval: params.strictInlineEval
			});
			for (const pattern of segmentPatterns) byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
			continue;
		}
		const segmentPatterns = resolveAllowAlwaysPatternEntries({
			segments: [segment],
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (segmentPatterns.length === 0) continue;
		representedSegmentCount += 1;
		for (const pattern of segmentPatterns) byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
	}
	return {
		complete: params.segments.length > 0 && representedSegmentCount === params.segments.length,
		patterns: [...byKey.values()]
	};
}
function persistAllowAlwaysPatterns(params) {
	const coverage = resolveAllowAlwaysPatternCoverage(params);
	const commandText = params.commandText?.trim();
	persistAllowAlwaysDecision({
		approvals: params.approvals,
		agentId: params.agentId,
		decision: {
			kind: "patterns",
			patterns: coverage.patterns,
			...commandText && coverage.complete && coverage.patterns.length > 0 ? { commandText } : {}
		}
	});
	return coverage.patterns;
}
function hasRuntimeShellPayload(argv) {
	const inlineCommand = extractBindableShellWrapperInlineCommand([...argv]);
	return Boolean(inlineCommand && (/(?:\$[A-Za-z0-9_@*?#$!-]|\$\{|`|\$\()/u.test(inlineCommand) || hasPosixInteractiveStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS) || hasPosixLoginStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS)));
}
function resolvePlanPersistenceState(plan) {
	if (!plan) return {
		reusablePatternsAllowed: true,
		reasons: []
	};
	if (!plan.ok) return {
		reusablePatternsAllowed: false,
		reasons: ["unplanned"]
	};
	const reasons = /* @__PURE__ */ new Set();
	let reusablePatternsAllowed = true;
	const candidates = plan.groups.flatMap((group) => group.candidates);
	for (const candidate of candidates) {
		if (candidate.trustMode === "prompt-only") reasons.add("prompt-only");
		if (candidate.trustMode === "exact-command") reasons.add("no-reusable-pattern");
		if (candidate.trustMode === "executable" && !candidate.allowAlways) reasons.add("no-reusable-pattern");
		reusablePatternsAllowed = reusablePatternsAllowed && candidate.allowAlways;
		if (hasRuntimeShellPayload(candidate.sourceSegment.argv)) reasons.add("runtime-payload");
		if (candidate.transport.kind === "shell-wrapper" && hasRuntimeShellPayload(candidate.transport.wrapperArgv)) reasons.add("runtime-payload");
	}
	return {
		reusablePatternsAllowed,
		reasons: [...reasons]
	};
}
function resolveAllowAlwaysPersistenceDecision(params) {
	const planPersistence = resolvePlanPersistenceState(params.authorizationPlan);
	const reasons = new Set(planPersistence.reasons);
	if (params.runtimePayload === true) reasons.add("runtime-payload");
	const commandText = params.commandText?.trim();
	const hardReasons = [...reasons].filter((reason) => reason !== "no-reusable-pattern");
	if (hardReasons.length > 0) return {
		kind: "one-shot",
		reasons: hardReasons
	};
	if (params.preparedCoverage?.complete === true && params.preparedCoverage.patterns.length > 0) return {
		kind: "patterns",
		patterns: params.preparedCoverage.patterns,
		...commandText ? { commandText } : {}
	};
	if (planPersistence.reusablePatternsAllowed) {
		const coverage = resolveAllowAlwaysPatternCoverage({
			segments: params.segments,
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (coverage.patterns.length > 0) return {
			kind: "patterns",
			patterns: coverage.patterns,
			...commandText && coverage.complete ? { commandText } : {}
		};
	}
	reasons.add("no-reusable-pattern");
	return {
		kind: "one-shot",
		reasons: [...reasons]
	};
}
function persistAllowAlwaysDecision(params) {
	const decision = params.decision;
	if (decision.kind === "one-shot") return;
	const snapshot = updateExecApprovalsSync({ update: (file) => applyAllowAlwaysDecision({
		file,
		agentId: params.agentId,
		decision
	}) });
	if (snapshot) replaceExecApprovalsSnapshot(params.approvals, snapshot.file);
}
function applyAllowAlwaysDecision(params) {
	const entries = params.decision.kind === "exact-command" ? params.decision.commandText.trim() ? [{
		pattern: buildDurableCommandApprovalPattern(params.decision.commandText.trim()),
		source: "allow-always"
	}] : [] : [...params.decision.patterns.map((pattern) => ({
		pattern: pattern.pattern,
		argPattern: pattern.argPattern,
		source: "allow-always"
	})), ...params.decision.commandText?.trim() ? [{
		pattern: buildNodeCommandApprovalPattern(params.decision.commandText.trim()),
		source: "allow-always"
	}] : []];
	if (!params.agentId) throw new Error("Exec allowlist update requires an explicit agent id.");
	const generatedPatterns = new Set(entries.filter((entry) => isCwdBoundHashedArgPattern(entry.argPattern)).map((entry) => entry.pattern));
	const existingAgent = params.file.agents?.[params.agentId];
	const existingAllowlist = existingAgent?.allowlist ?? [];
	const retainedAllowlist = existingAllowlist.filter((entry) => !(generatedPatterns.has(entry.pattern) && entry.source === "allow-always" && !isCwdBoundHashedArgPattern(entry.argPattern)));
	let next = retainedAllowlist.length === existingAllowlist.length ? params.file : {
		...params.file,
		agents: {
			...params.file.agents,
			[params.agentId]: {
				...existingAgent,
				allowlist: retainedAllowlist
			}
		}
	};
	let changed = next !== params.file;
	for (const entry of entries) {
		const updated = applyAllowlistEntryUpdate({
			file: next,
			agentId: params.agentId,
			pattern: entry.pattern,
			options: {
				argPattern: entry.argPattern,
				source: entry.source
			}
		});
		if (updated) {
			next = updated;
			changed = true;
		}
	}
	return changed ? next : null;
}
//#endregion
//#region src/infra/exec-approvals-authorization.ts
function assertCurrentUsageAuthorization(params) {
	const current = resolveExecApprovalsFromFileInternal({
		file: params.file,
		agentId: params.agentId,
		overrides: {
			security: params.authorization.security,
			ask: params.authorization.ask
		}
	});
	const security = minSecurity(params.authorization.security, current.agent.security);
	const ask = maxAsk(params.authorization.ask, current.agent.ask);
	if (security === "deny") throw new Error("Exec approval changed before execution");
	if (params.authorization.source === "explicit-approval" || params.authorization.source === "auto-review") {
		const expectedPolicy = params.authorization.policySnapshot;
		if (!expectedPolicy || !isExecApprovalPolicySnapshotCurrent(expectedPolicy, createExecApprovalPolicySnapshot({
			file: params.file,
			agentId: params.agentId
		}))) throw new Error("Exec approval changed before execution");
	}
	if (params.authorization.source === "explicit-approval") return;
	if (params.authorization.source === "auto-review") {
		if (ask === "always") throw new Error("Exec approval changed before execution");
		return;
	}
	let authorizationSecurity = security;
	if (params.authorization.source === "ask-fallback") {
		const askFallback = minSecurity(security, current.agent.askFallback);
		if (askFallback === "deny" || askFallback !== params.authorization.security) throw new Error("Exec approval changed before execution");
		if (askFallback === "full") return;
		authorizationSecurity = askFallback;
	} else if (security !== params.authorization.security || ask !== params.authorization.ask) throw new Error("Exec approval changed before execution");
	if (authorizationSecurity !== "allowlist") return;
	if (params.authorization.requireExactCommandApproval) {
		if (!hasExactCommandDurableExecApproval({
			allowlist: current.allowlist,
			commandText: params.command
		})) throw new Error("Exec approval changed before execution");
		return;
	}
	if (params.authorization.requireDurableAllowlistApproval) {
		const durableKeys = new Set(current.allowlist.filter((entry) => entry.source === "allow-always").map(buildAllowlistEntryMatchKey));
		if (params.matchKeys.size === 0 || [...params.matchKeys].some((key) => !durableKeys.has(key))) throw new Error("Exec approval changed before execution");
	}
	if (!params.authorization.allowlistSatisfied) throw new Error("Exec approval changed before execution");
	const currentKeys = new Set(current.allowlist.map(buildAllowlistEntryMatchKey));
	if ([...params.matchKeys].some((key) => !currentKeys.has(key))) throw new Error("Exec approval changed before execution");
	if (params.authorization.requireAutoAllowSkills && !current.agent.autoAllowSkills) throw new Error("Exec approval changed before execution");
}
function recordAllowlistUse(approvals, agentId, entry, command, resolvedPath) {
	recordAllowlistMatchesUse({
		approvals,
		agentId,
		matches: [entry],
		command,
		resolvedPath
	});
}
function recordAllowlistMatchesUse(params) {
	if (params.matches.length === 0 && !params.authorization) return;
	const snapshot = updateExecApprovalsSync({ update: (file) => applyRecordedAllowlistUse({
		...params,
		file
	}) });
	if (snapshot) replaceExecApprovalsSnapshot(params.approvals, snapshot.file);
}
function applyRecordedAllowlistUse(params) {
	const keys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	if (params.authorization) assertCurrentUsageAuthorization({
		file: params.file,
		agentId: params.agentId,
		command: params.command,
		matchKeys: keys,
		authorization: params.authorization
	});
	return applyRecordedAllowlistMetadata(params);
}
function applyRecordedAllowlistMetadata(params) {
	const keys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	if (keys.size === 0) return null;
	if (!params.agentId) throw new Error("Exec allowlist metadata update requires an explicit agent id.");
	const target = params.agentId;
	const agents = params.file.agents ?? {};
	let changed = false;
	const nextAgents = { ...agents };
	for (const key of target === "*" ? [target] : ["*", target]) {
		const existing = agents[key];
		if (!existing?.allowlist) continue;
		let entryChanged = false;
		const nextAllowlist = existing.allowlist.map((entry) => {
			if (!keys.has(buildAllowlistEntryMatchKey(entry))) return entry;
			changed = true;
			entryChanged = true;
			return Object.assign({}, entry, {
				id: entry.id ?? crypto.randomUUID(),
				lastUsedAt: Date.now(),
				lastUsedCommand: isGeneratedHashedArgPattern(entry.argPattern) ? void 0 : params.command,
				lastResolvedPath: params.resolvedPath
			});
		});
		if (entryChanged) nextAgents[key] = {
			...existing,
			allowlist: nextAllowlist
		};
	}
	return changed ? {
		...params.file,
		agents: nextAgents
	} : null;
}
async function commitExecAuthorizationLocked(params) {
	if ((params.authorization.source === "explicit-approval" || params.authorization.source === "auto-review") && !params.authorization.policySnapshot) throw new Error("Delayed exec authorization requires a policy snapshot");
	if (params.allowAlwaysDecision && params.allowAlwaysDecision.kind !== "one-shot") {
		if (params.authorization.source !== "explicit-approval") throw new Error("Allow-always persistence requires explicit approval");
	}
	await updateExecApprovals({ update: (file) => {
		const matchKeys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
		assertCurrentUsageAuthorization({
			file,
			agentId: params.agentId,
			command: params.command,
			matchKeys,
			authorization: params.authorization
		});
		let next = file;
		let changed = false;
		if (params.allowAlwaysDecision && params.allowAlwaysDecision.kind !== "one-shot") {
			const granted = applyAllowAlwaysDecision({
				file: next,
				agentId: params.agentId,
				decision: params.allowAlwaysDecision
			});
			if (granted) {
				next = granted;
				changed = true;
			}
		}
		return applyRecordedAllowlistMetadata({
			...params,
			file: next
		}) ?? (changed ? next : null);
	} });
}
//#endregion
//#region src/infra/jsonl-socket.ts
const JSONL_SOCKET_MAX_LINE_BYTES = 16 * 1024 * 1024;
/**
* Sends one JSONL request line, half-closes the write side, and waits for an accepted response line.
*/
function resolveJsonlSocketTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, 1);
}
async function requestJsonlSocketWithMaxLineBytes(params, maxLineBytes) {
	const { socketPath, requestLine, accept } = params;
	const timeoutMs = resolveJsonlSocketTimeoutMs(params.timeoutMs);
	return await new Promise((resolve) => {
		const client = new net.Socket();
		let settled = false;
		let lineChunks = [];
		let lineBytes = 0;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			try {
				client.destroy();
			} catch {}
			resolve(value);
		};
		const appendLineChunk = (chunk) => {
			if (lineBytes + chunk.byteLength > maxLineBytes) {
				finish(null);
				return false;
			}
			if (chunk.byteLength > 0) {
				lineChunks.push(chunk);
				lineBytes += chunk.byteLength;
			}
			return true;
		};
		const takeLine = () => {
			const line = Buffer.concat(lineChunks, lineBytes).toString("utf8").trim();
			lineChunks = [];
			lineBytes = 0;
			return line;
		};
		const timer = setTimeout(() => finish(null), timeoutMs);
		client.on("error", () => finish(null));
		client.on("end", () => finish(null));
		client.on("close", () => finish(null));
		client.connect(socketPath, () => {
			client.end(`${requestLine}\n`);
		});
		client.on("data", (data) => {
			let offset = 0;
			while (offset < data.byteLength) {
				const newlineIndex = data.indexOf(10, offset);
				if (newlineIndex === -1) {
					appendLineChunk(data.subarray(offset));
					return;
				}
				if (!appendLineChunk(data.subarray(offset, newlineIndex))) return;
				const line = takeLine();
				offset = newlineIndex + 1;
				if (!line) continue;
				try {
					const msg = JSON.parse(line);
					const result = accept(msg);
					if (result === void 0) continue;
					finish(result);
					return;
				} catch {}
			}
		});
	});
}
async function requestJsonlSocket(params) {
	return await requestJsonlSocketWithMaxLineBytes(params, JSONL_SOCKET_MAX_LINE_BYTES);
}
//#endregion
//#region src/infra/exec-approvals-socket.ts
async function requestExecApprovalViaSocket(params) {
	const { socketPath, token, request } = params;
	if (!socketPath || !token) return null;
	const timeoutMs = params.timeoutMs ?? 15e3;
	return await requestJsonlSocket({
		socketPath,
		requestLine: JSON.stringify({
			type: "request",
			token,
			id: crypto.randomUUID(),
			request
		}),
		timeoutMs,
		accept: (value) => {
			const msg = value;
			if (msg?.type === "decision" && msg.decision) return msg.decision;
		}
	});
}
//#endregion
//#region src/infra/exec-approvals.ts
function redactExecApprovals(snapshot) {
	const { raw: _raw, ...rest } = snapshot;
	const socketPath = snapshot.file.socket?.path?.trim();
	return {
		...rest,
		file: {
			...snapshot.file,
			socket: socketPath ? { path: socketPath } : void 0
		}
	};
}
function normalizeExecApprovals(file) {
	const socketPath = file.socket?.path?.trim();
	const token = file.socket?.token?.trim();
	return normalizeExecApprovalsInternal({
		...file,
		socket: {
			path: socketPath,
			token
		}
	});
}
function shapeResolvedExecApprovals(params) {
	const defaultSocketPath = resolveExecApprovalsSocketPath();
	return resolveExecApprovalsFromFile({
		file: params.file,
		agentId: params.agentId,
		overrides: params.overrides,
		path: params.filePath,
		socketPath: params.socket === "persisted" ? expandHomePrefix(params.file.socket?.path ?? defaultSocketPath) : defaultSocketPath,
		token: params.socket === "persisted" ? params.file.socket?.token ?? "" : ""
	});
}
function resolveExecApprovalsWithoutSocket(params) {
	const resolved = shapeResolvedExecApprovals({
		...params,
		socket: "none"
	});
	return (resolved.agent.security === "full" || resolved.agent.security === "deny") && resolved.agent.ask === "off" && !params.file.socket?.token?.trim() ? resolved : null;
}
function resolveExecApprovals(agentId, overrides) {
	const filePath = resolveExecApprovalsDisplayPath();
	if (!overrides?.requireSocket) {
		const resolved = resolveExecApprovalsWithoutSocket({
			file: loadExecApprovals(),
			filePath,
			agentId,
			overrides
		});
		if (resolved) return resolved;
	}
	return shapeResolvedExecApprovals({
		file: ensureExecApprovals(),
		filePath,
		agentId,
		overrides,
		socket: "persisted"
	});
}
async function resolveExecApprovalsLocked(agentId, overrides) {
	const filePath = resolveExecApprovalsDisplayPath();
	if (!overrides?.requireSocket) {
		const resolved = resolveExecApprovalsWithoutSocket({
			file: loadExecApprovals(),
			filePath,
			agentId,
			overrides
		});
		if (resolved) return resolved;
	}
	return shapeResolvedExecApprovals({
		file: (await ensureExecApprovalsSnapshot()).file,
		filePath: resolveExecApprovalsDisplayPath(),
		agentId,
		overrides,
		socket: "persisted"
	});
}
function resolveExecApprovalsFromFile(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovals(params.file);
	return resolveExecApprovalsFromFilePrepared({
		...params,
		rawFile,
		file,
		token: params.token ?? file.socket?.token ?? ""
	});
}
//#endregion
export { requiresExecApproval as A, normalizeExecTarget as B, DEFAULT_EXEC_APPROVAL_DECISIONS as C, maxAsk as D, isExecApprovalDecisionAllowed as E, EXEC_TARGET_VALUES as F, resolveExecModeFromPolicy as H, normalizeExecAsk as I, normalizeExecHost as L, resolveExecApprovalRequestAllowedDecisions as M, resolveExecApprovalUnavailableDecisions as N, minSecurity as O, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as P, normalizeExecMode as R, resolveDurableExecApprovalRequirement as S, commandRequiresSecurityAuditSuppressionApproval as T, resolveExecModePolicy as U, requireValidExecTarget as V, resolveExecPolicyForMode as W, isExecApprovalPolicySnapshotCurrent as _, resolveExecApprovalsLocked as a, resolveAllowAlwaysPatternCoverage as b, commitExecAuthorizationLocked as c, addAllowlistEntry as d, addDurableCommandApproval as f, hasNodeCommandAllowAlwaysMarker as g, hasExactCommandDurableExecApproval as h, resolveExecApprovalsFromFile as i, resolveExecApprovalAllowedDecisions as j, normalizeExecApprovalUnavailableDecisions as k, recordAllowlistMatchesUse as l, hasDurableExecApproval as m, redactExecApprovals as n, requestExecApprovalViaSocket as o, createExecApprovalPolicySnapshot as p, resolveExecApprovals as r, requestJsonlSocket as s, normalizeExecApprovals as t, recordAllowlistUse as u, persistAllowAlwaysDecision as v, OPTIONAL_EXEC_APPROVAL_DECISIONS as w, resolveAllowAlwaysPersistenceDecision as x, persistAllowAlwaysPatterns as y, normalizeExecSecurity as z };
