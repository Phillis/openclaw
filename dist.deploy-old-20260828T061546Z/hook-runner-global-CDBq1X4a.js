import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { a as expandToolGroups, c as normalizeToolPolicyName, l as readToolAllowlistIntersection, r as attachToolAllowlistIntersection, s as normalizeToolList } from "./tool-policy-shared-DmpG3HvD.js";
import "./tool-policy-B1rvCc4B.js";
import { r as isToolAllowedByPolicyName } from "./tool-policy-match-DfCekeWz.js";
import { s as isPluginRegistryRetired } from "./registry-lifecycle-DYhl0RY-.js";
import { d as getActivePluginRegistry } from "./runtime-B2KAtS3O.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-azPdmUls.js";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-scope-D--dYlKj.js";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-C4JNkXkP.js";
import { i as copyReplyPayloadMetadata } from "./reply-payload-BeeUJOmJ.js";
import { createHash, randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/tool-hook-matcher.ts
const NON_CANONICAL_TOOL_MATCHER_NAMES = /* @__PURE__ */ new Set([
	"bash",
	"exec_command",
	"apply-patch",
	"Write",
	"Edit",
	"agent"
]);
/** Omission is the only match-all form; explicit matcher values must stay bounded. */
function normalizePluginToolMatcher(matcher) {
	if (matcher === void 0) return;
	if (!Array.isArray(matcher)) throw new TypeError("tool hook matcher must be an array of tool names");
	if (matcher.length === 0) throw new TypeError("tool hook matcher must contain at least one tool name");
	const normalized = /* @__PURE__ */ new Set();
	for (let index = 0; index < matcher.length; index += 1) {
		if (!Object.hasOwn(matcher, index)) throw new TypeError("tool hook matcher entries must be non-empty strings");
		const toolName = matcher[index];
		if (typeof toolName !== "string") throw new TypeError("tool hook matcher entries must be non-empty strings");
		const canonicalToolName = normalizeLowercaseStringOrEmpty(toolName);
		if (!canonicalToolName) throw new TypeError("tool hook matcher entries must be non-empty strings");
		if (canonicalToolName === "*") throw new TypeError("tool hook matcher wildcard entries are not supported");
		if (NON_CANONICAL_TOOL_MATCHER_NAMES.has(canonicalToolName) || NON_CANONICAL_TOOL_MATCHER_NAMES.has(toolName.trim())) throw new TypeError("tool hook matcher entries must use canonical OpenClaw tool ids");
		normalized.add(canonicalToolName);
	}
	const toolNames = Array.from(normalized).toSorted();
	if (toolNames.length === 0) throw new TypeError("tool hook matcher entries must be non-empty strings");
	const [firstToolName, ...remainingToolNames] = toolNames;
	if (!firstToolName) throw new TypeError("tool hook matcher entries must be non-empty strings");
	return [firstToolName, ...remainingToolNames];
}
function pluginToolMatcherCoversTool(matcher, toolName) {
	const normalizedMatcher = normalizePluginToolMatcher(matcher);
	return normalizedMatcher === void 0 || normalizedMatcher.includes(normalizeLowercaseStringOrEmpty(toolName));
}
function createPluginToolMatcherScope(matchers) {
	let hasRegistration = false;
	const toolNames = /* @__PURE__ */ new Set();
	for (const matcher of matchers) {
		hasRegistration = true;
		const normalized = normalizePluginToolMatcher(matcher);
		if (!normalized) return {
			matchAll: true,
			toolNames: []
		};
		for (const toolName of normalized) toolNames.add(toolName);
	}
	return hasRegistration ? {
		matchAll: false,
		toolNames: Array.from(toolNames).toSorted()
	} : void 0;
}
function mergePluginToolMatcherScopes(scopes) {
	let hasScope = false;
	const toolNames = /* @__PURE__ */ new Set();
	for (const scope of scopes) {
		if (!scope) continue;
		hasScope = true;
		if (scope.matchAll) return {
			matchAll: true,
			toolNames: []
		};
		for (const toolName of scope.toolNames) toolNames.add(toolName);
	}
	return hasScope ? {
		matchAll: false,
		toolNames: Array.from(toolNames).toSorted()
	} : void 0;
}
//#endregion
//#region src/plugins/hook-runner-global-state.ts
const hookRunnerGlobalStateKey = Symbol.for("openclaw.plugins.hook-runner-global-state");
function getHookRunnerGlobalState() {
	return resolveGlobalSingleton(hookRunnerGlobalStateKey, () => ({
		hookRunner: null,
		registry: null
	}), (state) => {
		state.registry = null;
	}, "plugin-registry");
}
function resolveRootHookRegistry(state) {
	const activeRegistry = getActivePluginRegistry();
	const initializedRegistry = state.registry && !isPluginRegistryRetired(state.registry) ? state.registry : null;
	if (!initializedRegistry || initializedRegistry === activeRegistry) return activeRegistry ?? initializedRegistry;
	return overlayHookRegistries(activeRegistry, initializedRegistry);
}
function overlayHookRegistries(baseRegistry, overlayRegistry) {
	if (!overlayRegistry || overlayRegistry === baseRegistry) return baseRegistry;
	if (!baseRegistry) return overlayRegistry;
	const overlayPluginIds = new Set(overlayRegistry.plugins.map((plugin) => plugin.id));
	const overlayLegacyHookEvents = /* @__PURE__ */ new Map();
	for (const hook of overlayRegistry.hooks) {
		if (!Array.isArray(hook.events)) continue;
		const events = overlayLegacyHookEvents.get(hook.pluginId) ?? /* @__PURE__ */ new Set();
		for (const event of hook.events) events.add(event);
		overlayLegacyHookEvents.set(hook.pluginId, events);
	}
	const overlayTypedHooks = new Set(overlayRegistry.typedHooks.map((hook) => `${hook.pluginId}\0${hook.hookName}`));
	const overlayTrustedPolicies = new Set((overlayRegistry.trustedToolPolicies ?? []).map((entry) => `${entry.pluginId}\0${entry.policy.id}`));
	const trustedToolPolicies = [...(baseRegistry.trustedToolPolicies ?? []).filter((entry) => !overlayTrustedPolicies.has(`${entry.pluginId}\0${entry.policy.id}`)), ...overlayRegistry.trustedToolPolicies ?? []].toSorted((left, right) => {
		return (left.origin === "bundled" ? 0 : 1) - (right.origin === "bundled" ? 0 : 1);
	});
	return {
		hooks: [...baseRegistry.hooks.flatMap((hook) => {
			const overlayEvents = overlayLegacyHookEvents.get(hook.pluginId);
			if (!overlayEvents || !Array.isArray(hook.events)) return hook;
			const events = hook.events.filter((event) => !overlayEvents.has(event));
			return events.length === 0 ? [] : [{
				...hook,
				events
			}];
		}), ...overlayRegistry.hooks],
		typedHooks: [...baseRegistry.typedHooks.filter((hook) => !overlayTypedHooks.has(`${hook.pluginId}\0${hook.hookName}`)), ...overlayRegistry.typedHooks],
		plugins: [...baseRegistry.plugins.filter((plugin) => !overlayPluginIds.has(plugin.id)), ...overlayRegistry.plugins],
		trustedToolPolicies
	};
}
function resolveHookRegistry(state) {
	const generationRegistry = getPluginRuntimeGenerationRegistry();
	if (generationRegistry) return generationRegistry;
	return overlayHookRegistries(resolveRootHookRegistry(state), getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? null);
}
function createLiveHookRegistryFacade(state) {
	return {
		get hooks() {
			return resolveHookRegistry(state)?.hooks ?? [];
		},
		get typedHooks() {
			return resolveHookRegistry(state)?.typedHooks ?? [];
		},
		get plugins() {
			return resolveHookRegistry(state)?.plugins ?? [];
		},
		get trustedToolPolicies() {
			return resolveHookRegistry(state)?.trustedToolPolicies ?? [];
		}
	};
}
/** Get the registry view that backs global hook dispatch. */
function getGlobalHookRunnerRegistry() {
	const state = getHookRunnerGlobalState();
	return resolveHookRegistry(state) ? createLiveHookRegistryFacade(state) : null;
}
//#endregion
//#region src/hooks/fire-and-forget.ts
const DEFAULT_MAX_CONCURRENT_FIRE_AND_FORGET_HOOKS = 16;
const DEFAULT_MAX_QUEUED_FIRE_AND_FORGET_HOOKS = 256;
const DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS = 2e3;
const MAX_HOOK_LOG_MESSAGE_LENGTH = 500;
const getFireAndForgetHookState = () => resolveGlobalSingleton(Symbol.for("openclaw.fireAndForgetHookState"), () => ({
	active: 0,
	queue: []
}));
function positiveIntegerOrDefault(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
function resolveFireAndForgetHookTimeoutMs(value) {
	if (typeof value === "number" && Number.isInteger(value) && value > 0) return resolveTimerTimeoutMs(value, DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS);
	return resolveTimerTimeoutMs(DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS, 1);
}
function replaceLogControlCharacters(value) {
	let result = "";
	for (const char of value) {
		const codePoint = char.codePointAt(0);
		if (codePoint === void 0 || codePoint <= 31 || codePoint === 127 || codePoint === 8232 || codePoint === 8233) {
			result += " ";
			continue;
		}
		result += char;
	}
	return result;
}
/** Format hook errors as bounded single-line log messages with secrets redacted upstream. */
function formatHookErrorForLog(err) {
	return truncateUtf16Safe(replaceLogControlCharacters(formatErrorMessage(err)).replace(/\s+/g, " ").trim() || "unknown error", MAX_HOOK_LOG_MESSAGE_LENGTH);
}
/** Run a hook promise without awaiting it, logging rejection safely. */
function fireAndForgetHook(task, label, logger = logVerbose) {
	task.catch((err) => {
		logger(`${label}: ${formatHookErrorForLog(err)}`);
	});
}
function runFireAndForgetHookJob(state, job, limits) {
	state.active += 1;
	let didLogTimeout = false;
	const timeout = job.timeoutMs > 0 ? setTimeout(() => {
		didLogTimeout = true;
		job.logger(`${job.label}: timed out after ${job.timeoutMs}ms`);
	}, job.timeoutMs) : void 0;
	Promise.resolve().then(job.task).catch((err) => {
		if (!didLogTimeout) job.logger(`${job.label}: ${formatHookErrorForLog(err)}`);
	}).finally(() => {
		if (timeout) clearTimeout(timeout);
		state.active -= 1;
		drainFireAndForgetHookQueue(state, limits);
	});
}
function drainFireAndForgetHookQueue(state, limits) {
	while (state.active < limits.maxConcurrency) {
		const next = state.queue.shift();
		if (!next) return;
		runFireAndForgetHookJob(state, next, limits);
	}
}
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
function fireAndForgetBoundedHook(task, label, logger = logVerbose, options = {}) {
	const state = getFireAndForgetHookState();
	const maxConcurrency = positiveIntegerOrDefault(options.maxConcurrency, DEFAULT_MAX_CONCURRENT_FIRE_AND_FORGET_HOOKS);
	const maxQueue = positiveIntegerOrDefault(options.maxQueue, DEFAULT_MAX_QUEUED_FIRE_AND_FORGET_HOOKS);
	const timeoutMs = resolveFireAndForgetHookTimeoutMs(options.timeoutMs);
	if (state.active >= maxConcurrency && state.queue.length >= maxQueue) {
		logger(`${label}: queue full; dropping hook`);
		return;
	}
	state.queue.push({
		task,
		label,
		logger,
		timeoutMs
	});
	drainFireAndForgetHookQueue(state, { maxConcurrency });
}
//#endregion
//#region src/shared/text/join-segments.ts
/** Concatenates two optional text blocks, preserving the right block's explicit empty string. */
function concatOptionalTextSegments(params) {
	const separator = params.separator ?? "\n\n";
	if (params.left && params.right) return `${params.left}${separator}${params.right}`;
	return params.right ?? params.left;
}
/** Joins non-empty string segments, optionally trimming each segment before presence checks. */
function joinPresentTextSegments(segments, options) {
	const separator = options?.separator ?? "\n\n";
	const trim = options?.trim ?? false;
	const values = [];
	for (const segment of segments) {
		if (typeof segment !== "string") continue;
		const normalized = trim ? segment.trim() : segment;
		if (!normalized) continue;
		values.push(normalized);
	}
	return values.length > 0 ? values.join(separator) : void 0;
}
//#endregion
//#region src/plugins/hook-decision-types.ts
/** Prefix for user-facing replacement messages when a `block` decision stops a request. */
const BLOCK_MESSAGE_PREFIX = "Your message could not be sent";
function resolveBlockMessage(decision, params = {}) {
	const message = typeof decision.message === "string" ? decision.message.trim() : "";
	const blockedBy = params.blockedBy?.trim();
	if (message) return blockedBy ? `${BLOCK_MESSAGE_PREFIX}: ${message} (blocked by ${blockedBy})` : `${BLOCK_MESSAGE_PREFIX}: ${message}`;
	return blockedBy ? `${BLOCK_MESSAGE_PREFIX}: blocked by ${blockedBy}` : `${BLOCK_MESSAGE_PREFIX}: blocked`;
}
/**
* Type guard: does this object look like a HookDecision (has `outcome` field)?
*/
function isHookDecision(value) {
	if (typeof value !== "object" || value === null) return false;
	const v = value;
	const keys = Object.keys(v);
	if (v.outcome === "pass") return keys.length === 1;
	if (v.outcome !== "block") return false;
	const allowedBlockKeys = /* @__PURE__ */ new Set([
		"outcome",
		"reason",
		"message",
		"category",
		"metadata"
	]);
	if (keys.some((key) => !allowedBlockKeys.has(key))) return false;
	if (typeof v.reason !== "string" || !v.reason.trim()) return false;
	if ("message" in v && (typeof v.message !== "string" || !v.message.trim())) return false;
	if ("category" in v && (typeof v.category !== "string" || !v.category.trim())) return false;
	if ("metadata" in v && (typeof v.metadata !== "object" || v.metadata === null || Array.isArray(v.metadata))) return false;
	return true;
}
//#endregion
//#region src/plugins/hook-isolation.ts
var HookIsolationError = class extends Error {};
function containsSharedMemory(value, seen) {
	if (typeof SharedArrayBuffer !== "undefined" && value instanceof SharedArrayBuffer) return true;
	if (!value || typeof value !== "object") return false;
	if (ArrayBuffer.isView(value)) return typeof SharedArrayBuffer !== "undefined" && value.buffer instanceof SharedArrayBuffer;
	if (value instanceof ArrayBuffer) return false;
	const webAssemblyMemory = globalThis.WebAssembly?.Memory;
	if (webAssemblyMemory && value instanceof webAssemblyMemory && typeof SharedArrayBuffer !== "undefined") {
		if (Reflect.get(webAssemblyMemory.prototype, "buffer", value) instanceof SharedArrayBuffer) return true;
	}
	if (seen.has(value)) return false;
	seen.add(value);
	if (value instanceof Map) {
		const entries = Map.prototype.entries.call(value);
		for (const [key, entry] of entries) if (containsSharedMemory(key, seen) || containsSharedMemory(entry, seen)) return true;
		return false;
	}
	if (value instanceof Set) {
		const entries = Set.prototype.values.call(value);
		for (const entry of entries) if (containsSharedMemory(entry, seen)) return true;
		return false;
	}
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		if (descriptor && "value" in descriptor && containsSharedMemory(descriptor.value, seen)) return true;
	}
	return false;
}
function cloneHookIsolationValue(hookName, value) {
	try {
		if (containsSharedMemory(value, /* @__PURE__ */ new Set())) throw new TypeError("shared memory cannot be isolated");
		const cloned = structuredClone(value);
		if (containsSharedMemory(cloned, /* @__PURE__ */ new Set())) throw new TypeError("shared memory cannot be isolated");
		return cloned;
	} catch (cause) {
		throw new HookIsolationError(`[hooks] ${hookName} mutable input isolation failed`, { cause });
	}
}
//#endregion
//#region src/plugins/runtime/subagent-requester-context.ts
const pluginSubagentRequesterScope = resolveGlobalSingleton(Symbol.for("openclaw.pluginSubagentRequesterScope"), () => new AsyncLocalStorage());
function createPluginSubagentRequesterContext(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const origin = normalizeDeliveryContext(params.origin);
	if (!sessionKey || !origin?.channel || !origin.to) return;
	return Object.freeze({
		sessionKey,
		origin: Object.freeze({ ...origin })
	});
}
async function withPluginSubagentRequesterContext(requester, run) {
	const scope = {
		active: true,
		requester
	};
	return await pluginSubagentRequesterScope.run(scope, async () => {
		try {
			return await run();
		} finally {
			scope.active = false;
		}
	});
}
function getPluginSubagentRequesterContext() {
	const scope = pluginSubagentRequesterScope.getStore();
	return scope?.active === true ? scope.requester : void 0;
}
function resolvePluginSubagentCompletionRequester(completionDelivery) {
	if (completionDelivery !== void 0 && completionDelivery !== "current-requester") throw new Error("Unsupported plugin subagent completionDelivery value.");
	if (completionDelivery === void 0) return;
	const requester = getPluginSubagentRequesterContext();
	if (!requester) throw new Error("completionDelivery \"current-requester\" requires an active requester-bound plugin hook invocation.");
	return requester;
}
//#endregion
//#region src/plugins/hooks.ts
/**
* Plugin Hook Runner
*
* Provides utilities for executing plugin lifecycle hooks with proper
* error handling and priority ordering.
*/
const DEFAULT_VOID_HOOK_TIMEOUT_MS_BY_HOOK = {
	agent_end: 3e4,
	channel_pairing_requested: 2e3,
	before_compaction: 3e4,
	after_compaction: 3e4,
	skill_changed: 3e4,
	skill_proposal_changed: 3e4,
	gateway_stop: 5e3
};
const DEFAULT_MODIFYING_HOOK_TIMEOUT_MS_BY_HOOK = {
	before_agent_run: 15e3,
	before_install: 15e3,
	before_tool_call: 15e3,
	before_agent_finalize: 15e3,
	before_prompt_build: 15e3,
	message_sending: 15e3,
	reply_payload_sending: 15e3,
	resolve_exec_env: 15e3,
	skill_proposal_evaluate: 12e4
};
function deepFreezeHookValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value !== "object" && typeof value !== "function" || value === null) return value;
	const object = value;
	if (seen.has(object)) return value;
	seen.add(object);
	for (const child of Object.values(object)) deepFreezeHookValue(child, seen);
	return Object.freeze(value);
}
/**
* Get hooks for a specific hook name, sorted by priority (higher first).
*/
function getHooksForName(registry, hookName, ctx, toolName) {
	return registry.typedHooks.filter((hook) => {
		if (hook.hookName !== hookName) return false;
		if (hookName !== "before_agent_reply" || hook.eligibleTriggers === void 0) return true;
		const trigger = typeof ctx === "object" && ctx !== null && "trigger" in ctx ? ctx.trigger : void 0;
		return typeof trigger === "string" && hook.eligibleTriggers.includes(trigger);
	}).filter((hook) => toolName === void 0 || pluginToolMatcherCoversTool(hook.matcher, toolName)).toSorted((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
function getToolHookMatcherScope(registry, hookName) {
	return createPluginToolMatcherScope(getHooksForName(registry, hookName).map((registration) => registration.matcher));
}
function getHooksForNameAndPlugin(registry, hookName, pluginId) {
	return getHooksForName(registry, hookName).filter((hook) => hook.pluginId === pluginId);
}
/**
* Create a hook runner for a specific registry.
*/
function createHookRunner(registry, options = {}) {
	const logger = options.logger;
	const catchErrors = options.catchErrors ?? true;
	const failurePolicyByHook = {
		before_agent_run: "fail-closed",
		...options.failurePolicyByHook
	};
	const voidHookTimeoutMsByHook = {
		...DEFAULT_VOID_HOOK_TIMEOUT_MS_BY_HOOK,
		...options.voidHookTimeoutMsByHook
	};
	const modifyingHookTimeoutMsByHook = {
		...DEFAULT_MODIFYING_HOOK_TIMEOUT_MS_BY_HOOK,
		...options.modifyingHookTimeoutMsByHook
	};
	const beforePromptBuildDispatch = new AsyncLocalStorage();
	const runtimeDecisionScopeId = randomUUID();
	let runtimeDecisionOrdinal = 0;
	const shouldCatchHookErrors = (hookName) => catchErrors && (failurePolicyByHook[hookName] ?? "fail-open") === "fail-open";
	const recordBeforeToolCallDecision = (params) => {
		if (!params.receiptAuthority) return;
		try {
			if (params.receiptAuthority() === false) return;
		} catch {
			return;
		}
		const failed = params.failOpen !== void 0;
		const blocked = params.result?.block === true || params.failOpen === false;
		recordRuntimeActionDecision({
			token: params.token,
			family: "plugin",
			operation: "before_tool_call",
			outcome: blocked ? "denied" : params.failOpen ? "unknown" : "allowed",
			coverageState: blocked || !failed ? "enforced" : "unknown",
			reasonCode: failed ? params.failOpen ? "plugin_hook_failed_open" : "plugin_hook_failed_closed" : blocked ? "plugin_hook_blocked" : params.result?.requireApproval ? "plugin_hook_approval_required" : "plugin_hook_allowed",
			owner: "plugin-hook",
			decisionBoundary: "plugin.before-tool-call",
			policyRefs: ["plugin-hook:before-tool-call"],
			summary: failed ? params.failOpen ? "A plugin hook failed open, so its policy outcome is unknown." : "A plugin hook failed closed before tool execution." : blocked ? "A registered plugin hook denied tool execution." : params.result?.requireApproval ? "A registered plugin hook required a separate owner-native approval decision." : "A registered plugin hook allowed tool execution to continue.",
			missingEvidence: params.failOpen ? ["plugin.hook_decision"] : [],
			remediation: params.failOpen ? [{
				code: "repair_plugin_hook",
				text: "Inspect the registered plugin hook failure before relying on this action."
			}] : [],
			discriminator: JSON.stringify([
				params.hook.pluginId,
				params.hook.registrationId ?? null,
				params.event.toolCallId ?? null,
				++runtimeDecisionOrdinal,
				params.event.toolName,
				runtimeDecisionScopeId
			])
		});
	};
	const firstDefined = (prev, next) => prev ?? next;
	const lastDefined = (prev, next) => next ?? prev;
	const stickyTrue = (prev, next) => prev === true || next === true ? true : void 0;
	const toPluginReplyPayload = (payload) => {
		const { trustedLocalMedia: _trustedLocalMedia, ...visiblePayload } = payload;
		return structuredClone(visiblePayload);
	};
	const areMediaUrlArraysEqual = (left, right) => {
		const normalizedLeft = left ?? [];
		const normalizedRight = right ?? [];
		return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((value, index) => value === normalizedRight[index]);
	};
	const preservesTrustedMediaRefs = (previous, next) => {
		return previous.trustedLocalMedia === true && previous.mediaUrl === next.mediaUrl && areMediaUrlArraysEqual(previous.mediaUrls, next.mediaUrls);
	};
	const acceptPluginReplyPayload = (previous, next) => {
		const { trustedLocalMedia: _trustedLocalMedia, ...safePayload } = next;
		const clonedPayload = structuredClone(safePayload);
		return copyReplyPayloadMetadata(previous, preservesTrustedMediaRefs(previous, clonedPayload) ? {
			...clonedPayload,
			trustedLocalMedia: true
		} : clonedPayload);
	};
	const mergeBeforeModelResolve = (acc, next) => ({
		modelOverride: firstDefined(acc?.modelOverride, next.modelOverride),
		providerOverride: firstDefined(acc?.providerOverride, next.providerOverride)
	});
	const normalizeHookToolsAllow = (value) => {
		if (value === void 0) return;
		if (!Array.isArray(value)) return [];
		if (value.some((entry) => typeof entry !== "string")) return [];
		return value;
	};
	const readHookToolsAllowRestrictions = (value) => {
		const normalized = normalizeHookToolsAllow(value);
		if (normalized === void 0) return [];
		const attached = Array.isArray(value) ? readToolAllowlistIntersection(value) : void 0;
		return attached ? attached.map((restriction) => normalizeHookToolsAllow(restriction) ?? []) : [normalized];
	};
	const intersectToolsAllow = (left, right) => {
		if (left === void 0) return right;
		if (left.length === 0 || right.length === 0) return [];
		const normalizedLeft = normalizeToolList(expandToolGroups(left));
		const normalizedRight = normalizeToolList(expandToolGroups(right));
		if (normalizedLeft.includes("*")) return normalizedRight;
		if (normalizedRight.includes("*")) return normalizedLeft;
		return [...new Set(normalizeToolList([...normalizedLeft, ...normalizedRight]))].filter((name) => {
			const normalized = normalizeToolPolicyName(name);
			return isToolAllowedByPolicyName(normalized, { allow: normalizedLeft }) && isToolAllowedByPolicyName(normalized, { allow: normalizedRight });
		});
	};
	const mergeBeforePromptBuild = (acc, next) => {
		const toolRestrictions = [...readHookToolsAllowRestrictions(acc?.toolsAllow), ...readHookToolsAllowRestrictions(next.toolsAllow)];
		const toolsAllow = toolRestrictions.length === 0 ? void 0 : attachToolAllowlistIntersection([...toolRestrictions.reduce(intersectToolsAllow, void 0) ?? []], toolRestrictions);
		return {
			systemPrompt: firstDefined(acc?.systemPrompt, next.systemPrompt),
			prependContext: concatOptionalTextSegments({
				left: acc?.prependContext,
				right: next.prependContext
			}),
			appendContext: concatOptionalTextSegments({
				left: acc?.appendContext,
				right: next.appendContext
			}),
			...toolsAllow !== void 0 ? { toolsAllow } : {},
			prependSystemContext: concatOptionalTextSegments({
				left: acc?.prependSystemContext,
				right: next.prependSystemContext
			}),
			appendSystemContext: concatOptionalTextSegments({
				left: acc?.appendSystemContext,
				right: next.appendSystemContext
			})
		};
	};
	const mergeAgentTurnPrepare = (acc, next) => ({
		prependContext: concatOptionalTextSegments({
			left: acc?.prependContext,
			right: next.prependContext
		}),
		appendContext: concatOptionalTextSegments({
			left: acc?.appendContext,
			right: next.appendContext
		})
	});
	const mergeBeforeAgentFinalize = (acc, next) => {
		const normalizeRetry = (retry) => {
			const instruction = typeof retry?.instruction === "string" ? retry.instruction.trim() : "";
			if (!instruction) return;
			return {
				...retry,
				instruction
			};
		};
		const readRetryCandidates = (result) => {
			if (!result || result.action !== "revise") return [];
			const candidateList = result.retryCandidates;
			if (Array.isArray(candidateList) && candidateList.length > 0) return candidateList.map((retry) => normalizeRetry(retry)).filter((retry) => retry !== void 0);
			const retry = normalizeRetry(result.retry);
			return retry ? [retry] : [];
		};
		const attachRetryCandidates = (result, candidates) => {
			if (result.action !== "revise" || candidates.length <= 1) return result;
			Object.defineProperty(result, "retryCandidates", {
				configurable: true,
				enumerable: false,
				value: candidates
			});
			return result;
		};
		if (acc?.action === "finalize") return acc;
		if (next.action === "finalize") return {
			action: "finalize",
			reason: next.reason
		};
		if (acc?.action === "revise" && next.action === "revise") {
			const retryCandidates = [...readRetryCandidates(acc), ...readRetryCandidates(next)];
			const retry = retryCandidates[0];
			return attachRetryCandidates({
				action: "revise",
				reason: concatOptionalTextSegments({
					left: acc.reason,
					right: next.reason
				}),
				...retry ? { retry } : {}
			}, retryCandidates);
		}
		if (acc?.action === "revise") return acc;
		if (next.action === "revise") {
			const retry = normalizeRetry(next.retry);
			return {
				action: "revise",
				reason: next.reason,
				...retry ? { retry } : {}
			};
		}
		return next.action === "continue" ? {
			action: "continue",
			reason: next.reason
		} : acc ?? next;
	};
	const mergeSubagentDeliveryTargetResult = (acc, next) => {
		if (acc?.origin) return acc;
		return next;
	};
	const handleHookError = (params) => {
		const msg = `[hooks] ${params.hookName} handler from ${params.pluginId} failed: ${formatHookErrorForLog(params.error)}`;
		if (shouldCatchHookErrors(params.hookName)) {
			logger?.error(msg);
			return;
		}
		throw new Error(msg, { cause: params.error });
	};
	const sanitizeHookError = (error) => {
		return formatErrorMessage(error).split("\n")[0]?.trim() || "unknown error";
	};
	const getPluginPackageVersion = (pluginId) => registry.plugins.find((plugin) => plugin.id === pluginId)?.packageVersion;
	const normalizePositiveTimeoutMs = (timeoutMs) => {
		return clampPositiveTimerTimeoutMs(timeoutMs);
	};
	const getVoidHookTimeoutMs = (hookName, hook) => normalizePositiveTimeoutMs(hook.timeoutMs) ?? normalizePositiveTimeoutMs(voidHookTimeoutMsByHook[hookName]);
	const getModifyingHookTimeoutMs = (hookName, hook) => normalizePositiveTimeoutMs(hook.timeoutMs) ?? normalizePositiveTimeoutMs(modifyingHookTimeoutMsByHook[hookName]);
	const getClaimingHookTimeoutMs = (hook) => normalizePositiveTimeoutMs(hook.timeoutMs);
	const withHookTimeout = async (promise, timeoutMs, optionsResult = {}) => {
		let timer;
		const timeout = new Promise((_, reject) => {
			timer = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`timed out after ${timeoutMs}ms`));
			}, timeoutMs);
			if (optionsResult.unref) timer.unref?.();
		});
		try {
			return await Promise.race([promise, timeout]);
		} finally {
			if (timer) clearTimeout(timer);
		}
	};
	const runSyncMessageHookStep = (hook, hookName, event, message, ctx) => {
		try {
			const handler = hook.handler;
			const result = handler({
				...event,
				message
			}, ctx);
			if (isPromiseLike(result)) {
				Promise.resolve(result).catch(() => void 0);
				const msg = `[hooks] ${hookName} handler from ${hook.pluginId} returned a Promise; this hook is synchronous and the result was ignored.`;
				if (!shouldCatchHookErrors(hookName)) throw new Error(msg);
				logger?.warn?.(msg);
				return;
			}
			if (!result) return;
			if (hookName === "before_message_write" && result.block) return { block: true };
			const nextMessage = result.message;
			return nextMessage ? { message: nextMessage } : void 0;
		} catch (err) {
			const msg = `[hooks] ${hookName} handler from ${hook.pluginId} failed: ${String(err)}`;
			if (shouldCatchHookErrors(hookName)) {
				logger?.error(msg);
				return;
			}
			throw new Error(msg, { cause: err });
		}
	};
	const runSyncMessageHooks = (hookName, event, ctx) => {
		const hooks = getHooksForName(registry, hookName);
		if (hooks.length === 0) return;
		let current = event.message;
		for (const hook of hooks) {
			const result = runSyncMessageHookStep(hook, hookName, event, current, ctx);
			if (result?.block) return {
				message: current,
				block: true
			};
			if (result?.message) current = result.message;
		}
		return { message: current };
	};
	/**
	* Run a hook that doesn't return a value (fire-and-forget style).
	* All handlers are executed in parallel for performance.
	*/
	async function runVoidHook(hookName, event, ctx, optionsValue = {}, matcherToolName) {
		const hooks = getHooksForName(registry, hookName, void 0, matcherToolName);
		if (hooks.length === 0) return;
		logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers)`);
		const promises = hooks.map(async (hook) => {
			try {
				const promise = Promise.resolve(hook.handler(event, ctx));
				const timeoutMs = getVoidHookTimeoutMs(hookName, hook);
				if (timeoutMs) await withHookTimeout(promise, timeoutMs, { unref: optionsValue.unrefTimeout ?? true });
				else await promise;
			} catch (err) {
				handleHookError({
					hookName,
					pluginId: hook.pluginId,
					error: err
				});
			}
		});
		await Promise.all(promises);
	}
	function bindVoidHook(hookName) {
		return async (event, ctx) => runVoidHook(hookName, event, ctx);
	}
	/**
	* Run a hook that can return a modifying result.
	* Handlers are executed sequentially in priority order, and results are merged.
	*/
	async function runModifyingHook(hookName, event, ctx, policy = {}, matcherToolName) {
		const hooks = getHooksForName(registry, hookName, void 0, matcherToolName);
		const selectedHooks = policy.includeRegistration ? hooks.filter(policy.includeRegistration) : hooks;
		if (selectedHooks.length === 0) return;
		logger?.debug?.(`[hooks] running ${hookName} (${selectedHooks.length} handlers, sequential)`);
		let result;
		for (const hook of selectedHooks) {
			policy.assertHandlerBoundaryActive?.();
			let shouldStop = false;
			try {
				const handler = hook.handler;
				const handlerEvent = policy.isolateEventPerHandler ? cloneHookIsolationValue(hookName, event) : event;
				const promise = Promise.resolve(handler(handlerEvent, ctx));
				const timeoutMs = getModifyingHookTimeoutMs(hookName, hook);
				const handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
				policy.onHandlerResult?.({
					hook,
					result: handlerResult
				});
				if (handlerResult !== void 0 && (handlerResult !== null || policy.mergeNullResults)) {
					if (policy.mergeResults) result = policy.mergeResults(result, handlerResult, hook);
					else result = handlerResult;
					if (result && policy.shouldStop?.(result)) {
						const terminalLabel = policy.terminalLabel ? ` ${policy.terminalLabel}` : "";
						const priority = hook.priority ?? 0;
						logger?.debug?.(`[hooks] ${hookName}${terminalLabel} decided by ${hook.pluginId} (priority=${priority}); skipping remaining handlers`);
						policy.onTerminal?.({
							hookName,
							pluginId: hook.pluginId,
							result
						});
						shouldStop = true;
					}
				}
			} catch (err) {
				const failOpen = !(err instanceof HookIsolationError) && shouldCatchHookErrors(hookName);
				policy.onHandlerError?.(hook, failOpen);
				if (err instanceof HookIsolationError) throw err;
				handleHookError({
					hookName,
					pluginId: hook.pluginId,
					error: err
				});
			}
			policy.assertHandlerBoundaryActive?.();
			if (shouldStop) break;
		}
		return result;
	}
	/**
	* Run a sequential claim hook where the first `{ handled: true }` result wins.
	*/
	async function runClaimingHook(hookName, event, ctx, runHandler) {
		const hooks = getHooksForName(registry, hookName, ctx);
		if (hooks.length === 0) return;
		logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers, first-claim wins)`);
		return await runClaimingHooksList(hooks, hookName, event, ctx, runHandler);
	}
	async function runClaimingHookForPlugin(hookName, pluginId, event, ctx) {
		const hooks = getHooksForNameAndPlugin(registry, hookName, pluginId);
		if (hooks.length === 0) return;
		logger?.debug?.(`[hooks] running ${hookName} for ${pluginId} (${hooks.length} handlers, targeted)`);
		return await runClaimingHooksList(hooks, hookName, event, ctx);
	}
	async function runClaimingHooksList(hooks, hookName, event, ctx, runHandler) {
		for (const hook of hooks) try {
			const invokeHandler = async () => {
				const promise = Promise.resolve(hook.handler(event, ctx));
				const timeoutMs = getClaimingHookTimeoutMs(hook);
				return timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
			};
			const handlerResult = runHandler ? await runHandler(invokeHandler) : await invokeHandler();
			if (handlerResult?.handled) return handlerResult;
		} catch (err) {
			handleHookError({
				hookName,
				pluginId: hook.pluginId,
				error: err
			});
		}
	}
	async function runClaimingHookForPluginOutcome(hookName, pluginId, event, ctx) {
		if (!registry.plugins.some((plugin) => plugin.id === pluginId && plugin.status === "loaded")) return { status: "missing_plugin" };
		const hooks = getHooksForNameAndPlugin(registry, hookName, pluginId);
		if (hooks.length === 0) return { status: "no_handler" };
		logger?.debug?.(`[hooks] running ${hookName} for ${pluginId} (${hooks.length} handlers, targeted outcome)`);
		let firstError = null;
		for (const hook of hooks) try {
			const promise = Promise.resolve(hook.handler(event, ctx));
			const timeoutMs = getClaimingHookTimeoutMs(hook);
			const handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
			if (handlerResult?.handled) return {
				status: "handled",
				result: handlerResult
			};
		} catch (err) {
			firstError ??= sanitizeHookError(err);
			handleHookError({
				hookName,
				pluginId: hook.pluginId,
				error: err
			});
		}
		if (firstError) return {
			status: "error",
			error: firstError
		};
		return { status: "declined" };
	}
	function withAgentRunId(event, ctx) {
		if (event.runId || !ctx.runId) return event;
		return {
			...event,
			runId: ctx.runId
		};
	}
	/**
	* Run before_model_resolve hook.
	* Allows plugins to override provider/model before model resolution.
	*/
	async function runBeforeModelResolve(event, ctx) {
		return runModifyingHook("before_model_resolve", event, ctx, { mergeResults: mergeBeforeModelResolve });
	}
	/**
	* Run before_prompt_build hook.
	* Allows plugins to inject context and system prompt before prompt submission.
	*/
	async function runBeforePromptBuild(event, ctx) {
		if (beforePromptBuildDispatch.getStore()?.active) return;
		const token = { active: true };
		return await beforePromptBuildDispatch.run(token, async () => {
			try {
				return await runModifyingHook("before_prompt_build", event, ctx, {
					mergeResults: mergeBeforePromptBuild,
					includeRegistration: (registration) => registration.requiresToolAuthority !== true
				});
			} finally {
				token.active = false;
			}
		});
	}
	/** Runs context enrichment only after the host has finalized the turn's tool surface. */
	async function runAuthorizedPromptBuild(event, ctx, params) {
		const sourceFingerprint = params.toolAuthorityFingerprint.trim();
		if (!sourceFingerprint) return;
		const activeToolNames = [...new Set(params.activeToolNames.map(normalizeToolPolicyName).filter(Boolean))].toSorted();
		const activeToolNameSet = new Set(activeToolNames);
		const token = { active: true };
		const assertActive = () => {
			if (!token.active) throw new Error("prompt tool authority is no longer active");
			params.assertHostActive();
		};
		const authority = Object.freeze({
			fingerprint: createHash("sha256").update(sourceFingerprint).update("\0").update(activeToolNames.join("\0")).digest("hex"),
			allows(toolName) {
				assertActive();
				return activeToolNameSet.has(normalizeToolPolicyName(toolName));
			},
			assertActive
		});
		try {
			const result = await runModifyingHook("before_prompt_build", event, {
				...ctx,
				toolAuthority: authority
			}, {
				mergeResults: mergeBeforePromptBuild,
				includeRegistration: (registration) => registration.requiresToolAuthority === true,
				assertHandlerBoundaryActive: assertActive
			});
			if (!result) return;
			return {
				...result.prependContext ? { prependContext: result.prependContext } : {},
				...result.appendContext ? { appendContext: result.appendContext } : {}
			};
		} finally {
			token.active = false;
		}
	}
	async function runAgentTurnPrepare(event, ctx) {
		return runModifyingHook("agent_turn_prepare", event, ctx, { mergeResults: mergeAgentTurnPrepare });
	}
	/**
	* Run before_agent_reply hook.
	* Allows plugins to intercept messages and return a synthetic reply,
	* short-circuiting the LLM agent. First handler to return { handled: true } wins.
	*/
	async function runBeforeAgentReply(event, ctx) {
		return runClaimingHook("before_agent_reply", event, ctx);
	}
	/**
	* Run agent_end hook.
	* Allows plugins to analyze completed conversations.
	* Runs handlers in parallel.
	*/
	async function runAgentEnd(event, ctx, optionsLocal) {
		return runVoidHook("agent_end", withAgentRunId(event, ctx), ctx, optionsLocal);
	}
	/**
	* Run before_agent_finalize hook.
	* Allows plugins to request one more model pass before a natural final reply
	* is accepted. This is not the user-facing /stop cancellation path.
	*/
	async function runBeforeAgentFinalize(event, ctx) {
		return runModifyingHook("before_agent_finalize", withAgentRunId(event, ctx), ctx, { mergeResults: mergeBeforeAgentFinalize });
	}
	/**
	* Run before_compaction hook.
	*/
	async function runBeforeCompaction(event, ctx) {
		return runVoidHook("before_compaction", event, ctx);
	}
	/**
	* Run after_compaction hook.
	*/
	async function runAfterCompaction(event, ctx) {
		return runVoidHook("after_compaction", event, ctx);
	}
	/**
	* Run inbound_claim hook.
	* Allows plugins to claim an inbound event before commands/agent dispatch.
	*/
	async function runInboundClaim(event, ctx) {
		return runClaimingHook("inbound_claim", event, ctx);
	}
	async function runInboundClaimForPlugin(pluginId, event, ctx) {
		return runClaimingHookForPlugin("inbound_claim", pluginId, event, ctx);
	}
	async function runInboundClaimForPluginOutcome(pluginId, event, ctx) {
		return runClaimingHookForPluginOutcome("inbound_claim", pluginId, event, ctx);
	}
	/**
	* Run before_dispatch hook.
	* Allows plugins to inspect or handle a message before model dispatch.
	* First handler returning { handled: true } wins.
	*/
	async function runBeforeDispatch(event, ctx, requester) {
		return runClaimingHook("before_dispatch", event, ctx, requester ? (run) => withPluginSubagentRequesterContext(requester, run) : void 0);
	}
	/**
	* Run reply_dispatch hook.
	* Allows plugins to own reply dispatch before the default model path runs.
	* First handler returning { handled: true } wins.
	*/
	async function runReplyDispatch(event, ctx) {
		return runClaimingHook("reply_dispatch", event, ctx);
	}
	/**
	* Run reply_payload_sending hook.
	* Allows plugins to modify or cancel normalized reply payloads before delivery.
	* Runs sequentially, passing each handler the latest payload.
	*/
	async function runReplyPayloadSending(event, ctx) {
		const hooks = getHooksForName(registry, "reply_payload_sending");
		if (hooks.length === 0) return;
		logger?.debug?.(`[hooks] running reply_payload_sending (${hooks.length} handlers, sequential)`);
		let currentPayload = event.payload;
		let result;
		for (const hook of hooks) try {
			const handler = hook.handler;
			const promise = Promise.resolve(handler({
				...event,
				payload: toPluginReplyPayload(currentPayload)
			}, ctx));
			const timeoutMs = getModifyingHookTimeoutMs("reply_payload_sending", hook);
			const handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
			if (!handlerResult) continue;
			if (handlerResult.payload !== void 0) currentPayload = acceptPluginReplyPayload(currentPayload, handlerResult.payload);
			result = {
				payload: currentPayload,
				cancel: stickyTrue(result?.cancel, handlerResult.cancel),
				reason: lastDefined(result?.reason, handlerResult.reason)
			};
			if (result.cancel === true) {
				const priority = hook.priority ?? 0;
				logger?.debug?.(`[hooks] reply_payload_sending cancel=true decided by ${hook.pluginId} (priority=${priority}); skipping remaining handlers`);
				break;
			}
		} catch (err) {
			handleHookError({
				hookName: "reply_payload_sending",
				pluginId: hook.pluginId,
				error: err
			});
		}
		return result;
	}
	/**
	* Run message_sending hook.
	* Allows plugins to modify or cancel outgoing messages.
	* Runs sequentially.
	*/
	async function runMessageSending(event, ctx) {
		return runModifyingHook("message_sending", event, ctx, {
			mergeResults: (acc, next) => {
				if (acc?.cancel === true) return acc;
				return {
					content: lastDefined(acc?.content, next.content),
					cancel: stickyTrue(acc?.cancel, next.cancel),
					cancelReason: lastDefined(acc?.cancelReason, next.cancelReason),
					metadata: next.metadata ?? acc?.metadata
				};
			},
			shouldStop: (result) => result.cancel === true,
			terminalLabel: "cancel=true"
		});
	}
	/**
	* Run before_agent_run gate hook.
	* Fires after session resolution and workspace preparation, before model inference.
	* Returns the most-restrictive pass/block decision from all handlers.
	* Handlers that return void are treated as pass.
	*/
	async function runBeforeAgentRun(event, ctx) {
		let winningPluginId;
		const decision = await runModifyingHook("before_agent_run", event, ctx, {
			mergeResults: (_acc, next, reg) => {
				if (next === void 0 || next === null) {
					const normalized = {
						outcome: "block",
						reason: "before_agent_run returned an invalid decision"
					};
					winningPluginId = reg.pluginId;
					return normalized;
				}
				const normalized = isHookDecision(next) ? next : {
					outcome: "block",
					reason: "before_agent_run returned an invalid decision"
				};
				const merged = !_acc || normalized.outcome === "block" && _acc.outcome !== "block" ? normalized : _acc;
				if (merged === normalized) winningPluginId = reg.pluginId;
				return merged;
			},
			mergeNullResults: true,
			shouldStop: (result) => result?.outcome === "block",
			terminalLabel: "gate-decision"
		});
		if (!decision) return;
		return {
			decision,
			pluginId: winningPluginId ?? "unknown"
		};
	}
	/**
	* Run before_tool_call hook.
	* Allows plugins to modify or block tool calls.
	* Runs sequentially.
	*/
	async function runBeforeToolCall(event, ctx, receipt) {
		return runModifyingHook("before_tool_call", event, ctx, {
			isolateEventPerHandler: true,
			mergeResults: (acc, next, reg) => {
				if (acc?.block === true) return acc;
				const approvalAlreadyRequested = acc?.requireApproval !== void 0;
				let params = lastDefined(acc?.params, next.params);
				if (approvalAlreadyRequested) params = acc?.params;
				else if (next.requireApproval && params !== void 0) params = cloneHookIsolationValue("before_tool_call", params);
				return {
					params,
					block: stickyTrue(acc?.block, next.block),
					blockReason: lastDefined(acc?.blockReason, next.blockReason),
					requireApproval: acc?.requireApproval ?? (next.requireApproval ? {
						...next.requireApproval,
						pluginId: reg.pluginId
					} : void 0)
				};
			},
			shouldStop: (result) => result.block === true,
			terminalLabel: "block=true",
			onHandlerResult: ({ hook, result }) => {
				receipt?.markOwnerDecision?.();
				recordBeforeToolCallDecision({
					event,
					hook,
					token: receipt?.token,
					result,
					receiptAuthority: receipt?.assertAuthority
				});
			},
			onHandlerError: (hook, failOpen) => {
				receipt?.markOwnerDecision?.();
				recordBeforeToolCallDecision({
					event,
					hook,
					token: receipt?.token,
					failOpen,
					receiptAuthority: receipt?.assertAuthority
				});
			}
		}, event.toolName);
	}
	/**
	* Run after_tool_call hook.
	* Runs in parallel (fire-and-forget).
	*/
	async function runAfterToolCall(event, ctx) {
		return runVoidHook("after_tool_call", event, ctx, {}, event.toolName);
	}
	/**
	* Run tool_result_persist hook.
	*
	* This hook is intentionally synchronous: it runs in hot paths where session
	* transcripts are appended synchronously.
	*
	* Handlers are executed sequentially in priority order (higher first). Each
	* handler may return `{ message }` to replace the message passed to the next
	* handler.
	*/
	function runToolResultPersist(event, ctx) {
		const result = runSyncMessageHooks("tool_result_persist", event, ctx);
		return result ? { message: result.message } : void 0;
	}
	/**
	* Run before_message_write hook.
	*
	* This hook is intentionally synchronous: it runs on the hot path where
	* session transcripts are appended synchronously.
	*
	* Handlers are executed sequentially in priority order (higher first).
	* If any handler returns { block: true }, the message is NOT written
	* to the session JSONL and we return immediately.
	* If a handler returns { message }, the modified message replaces the
	* original for subsequent handlers and the final write.
	*/
	function runBeforeMessageWrite(event, ctx) {
		const result = runSyncMessageHooks("before_message_write", event, ctx);
		if (result?.block) return { block: true };
		return result && result.message !== event.message ? { message: result.message } : void 0;
	}
	/**
	* Run subagent_delivery_target hook.
	* Runs sequentially so channel plugins can deterministically resolve routing.
	*/
	async function runSubagentDeliveryTarget(event, ctx) {
		return runModifyingHook("subagent_delivery_target", event, ctx, { mergeResults: mergeSubagentDeliveryTargetResult });
	}
	async function runHeartbeatPromptContribution(event, ctx) {
		return runModifyingHook("heartbeat_prompt_contribution", event, ctx, { mergeResults: mergeAgentTurnPrepare });
	}
	/**
	* Run every registered proposal evaluator and retain its attribution.
	*
	* Evaluator failures are returned as data so Workshop can persist and show
	* them. A broken optional evaluator must not make proposal state unreadable.
	*/
	async function runSkillProposalEvaluate(event, ctx) {
		const hookName = "skill_proposal_evaluate";
		const hooks = getHooksForName(registry, hookName);
		if (hooks.length === 0) return [];
		logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers, attributed)`);
		const immutableEvent = deepFreezeHookValue(structuredClone(event));
		return await Promise.all(hooks.map(async (hook) => {
			const pluginVersion = getPluginPackageVersion(hook.pluginId);
			const attribution = {
				evaluatorId: hook.registrationId ?? hook.pluginId,
				pluginId: hook.pluginId,
				...pluginVersion ? { pluginVersion } : {}
			};
			try {
				const handler = hook.handler;
				const promise = Promise.resolve(handler(immutableEvent, ctx));
				const timeoutMs = getModifyingHookTimeoutMs(hookName, hook);
				const result = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
				return result ? Object.assign({}, attribution, {
					status: "completed",
					result
				}) : Object.assign({}, attribution, { status: "skipped" });
			} catch (error) {
				const message = sanitizeHookError(error);
				logger?.error(`[hooks] ${hookName} handler from ${hook.pluginId} failed: ${formatHookErrorForLog(error)}`);
				return Object.assign({}, attribution, {
					status: "error",
					error: message
				});
			}
		}));
	}
	async function runSkillProposalChanged(event, ctx) {
		return runVoidHook("skill_proposal_changed", deepFreezeHookValue(structuredClone(event)), ctx);
	}
	async function runSkillChanged(event, ctx) {
		return runVoidHook("skill_changed", deepFreezeHookValue(structuredClone(event)), ctx);
	}
	/**
	* Run before_install hook.
	* Allows plugins to augment scan findings or block installs.
	* Runs sequentially so higher-priority hooks can block before lower ones run.
	*/
	async function runBeforeInstall(event, ctx) {
		return runModifyingHook("before_install", event, ctx, {
			mergeResults: (acc, next) => {
				if (acc?.block === true) return acc;
				const mergedFindings = [...acc?.findings ?? [], ...next.findings ?? []];
				return {
					findings: mergedFindings.length > 0 ? mergedFindings : void 0,
					block: stickyTrue(acc?.block, next.block),
					blockReason: lastDefined(acc?.blockReason, next.blockReason)
				};
			},
			shouldStop: (result) => result.block === true,
			terminalLabel: "block=true"
		});
	}
	async function runResolveExecEnv(event, ctx) {
		return await runModifyingHook("resolve_exec_env", event, ctx, { mergeResults: (acc, next) => acc ? {
			...acc,
			...next
		} : next }) ?? {};
	}
	function hasHooks(hookName, ctx) {
		if (ctx === void 0) return registry.typedHooks.some((hook) => hook.hookName === hookName);
		return getHooksForName(registry, hookName, ctx).length > 0;
	}
	/**
	* Get count of registered hooks for a given hook name.
	*/
	function getHookCount(hookName) {
		return registry.typedHooks.filter((h) => h.hookName === hookName).length;
	}
	return {
		runBeforeModelResolve,
		runAgentTurnPrepare,
		runBeforePromptBuild,
		runAuthorizedPromptBuild,
		runBeforeAgentReply,
		runModelCallStarted: bindVoidHook("model_call_started"),
		runModelCallEnded: bindVoidHook("model_call_ended"),
		runLlmInput: bindVoidHook("llm_input"),
		runLlmOutput: bindVoidHook("llm_output"),
		runBeforeAgentFinalize,
		runAgentEnd,
		runBeforeCompaction,
		runAfterCompaction,
		runBeforeReset: async (event, ctx) => runVoidHook("before_reset", event, ctx),
		runBeforeAgentRun,
		runInboundClaim,
		runInboundClaimForPlugin,
		runInboundClaimForPluginOutcome,
		runChannelPairingRequested: bindVoidHook("channel_pairing_requested"),
		runMessageReceived: bindVoidHook("message_received"),
		runBeforeDispatch,
		runReplyDispatch,
		runReplyPayloadSending,
		runMessageSending,
		runMessageSent: async (event, ctx) => runVoidHook("message_sent", event, ctx),
		runBeforeToolCall,
		runAfterToolCall,
		runToolResultPersist,
		runBeforeMessageWrite,
		runSessionStart: async (event, ctx) => runVoidHook("session_start", event, ctx),
		runSessionEnd: bindVoidHook("session_end"),
		runSubagentDeliveryTarget,
		runSubagentSpawned: async (event, ctx) => runVoidHook("subagent_spawned", event, ctx),
		runSubagentProgress: async (event, ctx) => runVoidHook("subagent_progress", event, ctx),
		runSubagentEnded: async (event, ctx) => runVoidHook("subagent_ended", event, ctx),
		runGatewayStart: async (event, ctx) => runVoidHook("gateway_start", event, ctx),
		runGatewayStop: bindVoidHook("gateway_stop"),
		runHeartbeatPromptContribution,
		runCronReconciled: bindVoidHook("cron_reconciled"),
		runCronChanged: bindVoidHook("cron_changed"),
		runSkillProposalEvaluate,
		runSkillProposalChanged,
		runSkillChanged,
		runBeforeInstall,
		runResolveExecEnv,
		hasHooks,
		getHookCount
	};
}
//#endregion
//#region src/plugins/hook-runner-global.ts
/**
* Global Plugin Hook Runner
*
* Singleton hook runner that's initialized when plugins are loaded
* and can be called from anywhere in the codebase.
*
* The runner is created once and resolves hooks live on every dispatch from the
* current request-scoped registry or process root. This also preserves the
* contract that hooks pushed after initialization dispatch immediately.
*/
const getLog = () => createSubsystemLogger("plugins");
/**
* Initialize the global hook runner with a plugin registry.
* Called on every plugin registry activation and by SDK consumers. The runner
* instance stays stable so references captured mid-run keep seeing current hooks.
*/
function initializeGlobalHookRunner(registry) {
	const state = getHookRunnerGlobalState();
	const log = getLog();
	state.registry = registry;
	if (!state.hookRunner) state.hookRunner = createHookRunner(createLiveHookRegistryFacade(state), {
		logger: {
			debug: (msg) => log.debug(msg),
			warn: (msg) => log.warn(msg),
			error: (msg) => log.error(msg)
		},
		catchErrors: true,
		failurePolicyByHook: {
			before_agent_run: "fail-closed",
			before_install: "fail-closed",
			before_tool_call: "fail-closed"
		}
	});
	const hookCount = registry.hooks.length;
	if (hookCount > 0) log.debug(`hook runner initialized with ${hookCount} registered hooks`);
}
/**
* Get the global hook runner.
* Returns null if plugins haven't been loaded yet.
*/
function getGlobalHookRunner() {
	return getHookRunnerGlobalState().hookRunner;
}
/**
* Get the registry from the most recent activation or explicit initialization.
* Returns null if plugins haven't been loaded yet.
*/
function getGlobalPluginRegistry() {
	return getHookRunnerGlobalState().registry;
}
/**
* Check if any hooks are registered for a given hook name.
*/
function hasGlobalHooks(hookName, ctx) {
	return getHookRunnerGlobalState().hookRunner?.hasHooks(hookName, ctx) ?? false;
}
async function runGlobalGatewayStopSafely(params) {
	const log = getLog();
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("gateway_stop")) return;
	try {
		await hookRunner.runGatewayStop(params.event, params.ctx);
	} catch (err) {
		if (params.onError) {
			params.onError(err);
			return;
		}
		log.warn(`gateway_stop hook failed: ${String(err)}`);
	}
}
/**
* Reset the global hook runner (for testing).
*/
function resetGlobalHookRunner() {
	const state = getHookRunnerGlobalState();
	state.hookRunner = null;
	state.registry = null;
}
//#endregion
export { createPluginToolMatcherScope as _, resetGlobalHookRunner as a, pluginToolMatcherCoversTool as b, createPluginSubagentRequesterContext as c, resolveBlockMessage as d, joinPresentTextSegments as f, getGlobalHookRunnerRegistry as g, formatHookErrorForLog as h, initializeGlobalHookRunner as i, resolvePluginSubagentCompletionRequester as l, fireAndForgetHook as m, getGlobalPluginRegistry as n, runGlobalGatewayStopSafely as o, fireAndForgetBoundedHook as p, hasGlobalHooks as r, getToolHookMatcherScope as s, getGlobalHookRunner as t, cloneHookIsolationValue as u, mergePluginToolMatcherScopes as v, normalizePluginToolMatcher as y };
