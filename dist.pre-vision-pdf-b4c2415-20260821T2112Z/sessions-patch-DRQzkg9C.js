import { a as normalizeFastMode, c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { l as resolveAgentDir, p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { T as resolveSubagentConfiguredModelSelection, w as resolveDefaultModelForAgent } from "./codex-route-model-ref-0uJOp6W2.js";
import { a as normalizeElevatedLevel, l as normalizeUsageDisplay, o as normalizeReasoningLevel, s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel, t as formatThinkingLevels } from "./thinking-dphnnN-M.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { n as projectCanonicalSessionEntryShape } from "./store-entry-shape-BgAn-BWO.js";
import { m as resolveMissingAgentHarnessSessionError, o as isAgentHarnessSessionKeyOwnedBy } from "./agent-harness-session-key-BMj1lPtX.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-BnpBwpz_.js";
import { i as resolveAllowedModelRef } from "./model-selection-Dg63KcCa.js";
import { a as readAcpSessionMetaForEntry } from "./session-meta-CkBRKe6w.js";
import { S as sessionAgentStatusExpiresAt, b as resolveActiveSessionAgentStatus, x as sanitizeSessionAgentStatusNote, y as isSessionAgentAttentionIconId } from "./session-utils-row-pCr636Wc.js";
import { g as normalizeInheritedToolDenylist, h as normalizeInheritedToolAllowlist } from "./subagent-capabilities-WLDx82Jc.js";
import { z as normalizeExecTarget } from "./exec-approvals-DkNiV-ux.js";
import { a as isModelSelectionLocked, t as MODEL_SELECTION_LOCKED_MESSAGE } from "./model-overrides-D4SC_nUZ.js";
import { t as normalizeSendPolicy } from "./send-policy-fb8W-yqC.js";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-DAKwbHjK.js";
import { t as parseSessionLabel } from "./session-label-DSD-L6TD.js";
import { n as snapshotAgentModelFallback, t as isAgentSessionModelPatchOrigin } from "./session-model-patch-origin-CRnGGlIv.js";
import { i as parseVerboseOverride, n as applyVerboseOverride, r as parseTraceOverride, t as applyTraceOverride } from "./level-overrides-DLB7ZeRX.js";
import { t as normalizeGroupActivation } from "./group-activation-B6ER3hWD.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/sessions-patch-subagent-policy.ts
function supportsSpawnPolicy(storeKey) {
	return isSubagentSessionKey(storeKey) || isAcpSessionKey(storeKey);
}
function unsupportedField(field, storeKey) {
	return supportsSpawnPolicy(storeKey) ? void 0 : `${field} is only supported for subagent:* or acp:* sessions`;
}
/** Applies the remaining public child-policy fields after lineage became creation-only. */
function applySessionsPatchSubagentPolicy(params) {
	const { existing, next, patch, storeKey } = params;
	if ("completionOwnerSessionKey" in patch) {
		const raw = patch.completionOwnerSessionKey;
		if (raw === null && existing?.completionOwnerSessionKey) return "completionOwnerSessionKey cannot be cleared once set";
		if (raw !== null && raw !== void 0) {
			const unsupported = unsupportedField("completionOwnerSessionKey", storeKey);
			if (unsupported) return unsupported;
			const normalized = normalizeOptionalString(raw);
			if (!normalized) return "invalid completionOwnerSessionKey: empty";
			if (existing?.completionOwnerSessionKey && existing.completionOwnerSessionKey !== normalized) return "completionOwnerSessionKey cannot be changed once set";
			next.completionOwnerSessionKey = normalized;
		}
	}
	if ("inheritedToolPolicyVersion" in patch) {
		const raw = patch.inheritedToolPolicyVersion;
		if (raw === null && existing?.inheritedToolPolicyVersion !== void 0) return "inheritedToolPolicyVersion cannot be cleared once set";
		if (raw !== null && raw !== void 0) {
			const unsupported = unsupportedField("inheritedToolPolicyVersion", storeKey);
			if (unsupported) return unsupported;
			if (raw !== 1) return "invalid inheritedToolPolicyVersion (expected 1)";
			next.inheritedToolPolicyVersion = 1;
		}
	}
	for (const field of ["inheritedToolDeny", "inheritedToolAllow"]) {
		if (!(field in patch)) continue;
		const raw = patch[field];
		if (raw === null) {
			delete next[field];
			continue;
		}
		if (raw === void 0) continue;
		if (!Array.isArray(raw)) return `invalid ${field} (use an array of tool names)`;
		const unsupported = unsupportedField(field, storeKey);
		if (unsupported) return unsupported;
		const normalized = field === "inheritedToolDeny" ? normalizeInheritedToolDenylist(raw) : normalizeInheritedToolAllowlist(raw);
		if (normalized.length > 0) next[field] = normalized;
		else delete next[field];
	}
}
//#endregion
//#region src/gateway/sessions-patch.ts
function invalid(message) {
	return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, message)
	};
}
function resolveSessionPatchModelSelection(params) {
	const { model: modelWithoutProfile, profile } = splitTrailingAuthProfile(params.raw);
	const resolved = resolveAllowedModelRef({
		cfg: params.cfg,
		catalog: params.catalog,
		raw: modelWithoutProfile,
		defaultProvider: params.defaultProvider,
		defaultModel: params.subagentModelHint ?? params.defaultModel
	});
	if ("error" in resolved) return {
		ok: false,
		error: resolved.error
	};
	return {
		ok: true,
		provider: resolved.ref.provider,
		model: resolved.ref.model,
		...profile ? { profile } : {},
		isDefault: resolved.ref.provider === params.defaultProvider && resolved.ref.model === params.defaultModel
	};
}
function normalizeExecSecurity(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "full") return normalized;
}
function normalizeExecAsk(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "off" || normalized === "on-miss" || normalized === "always") return normalized;
}
function normalizeSessionToolOverrides(raw) {
	const normalizeBooleanMap = (value) => {
		const entries = Object.entries(value ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
		return entries.length > 0 ? Object.fromEntries(entries) : void 0;
	};
	const mcpToolsDeny = Object.fromEntries(Object.entries(raw.mcpToolsDeny ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted((left, right) => left.localeCompare(right))]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right)));
	const mcpServers = normalizeBooleanMap(raw.mcpServers);
	const skills = normalizeBooleanMap(raw.skills);
	const normalized = {
		...mcpServers ? { mcpServers } : {},
		...Object.keys(mcpToolsDeny).length > 0 ? { mcpToolsDeny } : {},
		...skills ? { skills } : {},
		...raw.webSearch === false ? { webSearch: false } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Project a validated gateway session patch for one session entry. */
async function projectSessionsPatchEntry(params) {
	const { cfg, storeKey, patch } = params;
	const harnessSessionError = params.existingEntry === void 0 && isAgentHarnessSessionKeyOwnedBy(storeKey, params.authorizedAgentHarnessId) ? void 0 : resolveMissingAgentHarnessSessionError(storeKey, params.existingEntry);
	if (harnessSessionError) return invalid(harnessSessionError);
	if (typeof patch.archived === "boolean") {
		if (!params.existingEntry?.sessionId) return invalid(`session not found: ${storeKey}`);
		if (patch.expectedSessionId === void 0) return invalid(`expectedSessionId required for session lifecycle patch: ${storeKey}`);
	}
	if ("model" in patch && isModelSelectionLocked(params.existingEntry)) return invalid(MODEL_SELECTION_LOCKED_MESSAGE);
	const now = Date.now();
	const parsedAgent = parseAgentSessionKey(storeKey);
	const sessionAgentId = normalizeAgentId(params.agentId ?? parsedAgent?.agentId ?? resolveDefaultAgentId(cfg));
	const resolvedDefault = resolveDefaultModelForAgent({
		cfg,
		agentId: sessionAgentId
	});
	const subagentModelHint = isSubagentSessionKey(storeKey) ? resolveSubagentConfiguredModelSelection({
		cfg,
		agentId: sessionAgentId
	}) : void 0;
	const resolveThinkingRuntime = (provider, model, entry) => {
		return readAcpSessionMetaForEntry({
			sessionKey: storeKey,
			agentId: sessionAgentId,
			entry
		})?.backend ?? resolveEffectiveAgentRuntime({
			cfg,
			provider,
			modelId: model,
			agentId: sessionAgentId,
			sessionKey: storeKey,
			sessionEntry: entry
		});
	};
	let loadedModelCatalog;
	const loadPreparedModelCatalogForPatch = async () => {
		if (loadedModelCatalog) return loadedModelCatalog;
		if (!params.loadGatewayModelCatalog) return;
		const catalog = await params.loadGatewayModelCatalog();
		loadedModelCatalog = Array.isArray(catalog) ? catalog : [];
		return loadedModelCatalog;
	};
	const existing = params.existingEntry ? projectCanonicalSessionEntryShape(params.existingEntry) : void 0;
	const next = existing?.sessionId ? {
		...existing,
		updatedAt: Math.max(existing.updatedAt ?? 0, now)
	} : {
		...existing,
		sessionId: randomUUID(),
		updatedAt: Math.max(existing?.updatedAt ?? 0, now)
	};
	if (existing && !existing.sessionId) {
		delete next.label;
		delete next.category;
		delete next.displayName;
	}
	const subagentPolicyError = applySessionsPatchSubagentPolicy({
		existing,
		next,
		patch,
		storeKey
	});
	if (subagentPolicyError) return invalid(subagentPolicyError);
	if ("label" in patch) {
		const raw = patch.label;
		if (raw === null) delete next.label;
		else if (raw !== void 0) {
			const parsed = parseSessionLabel(raw);
			if (!parsed.ok) return invalid(parsed.error);
			if (params.isLabelInUse(parsed.label)) return invalid(`label already in use: ${parsed.label}`);
			next.label = parsed.label;
		}
	}
	if ("category" in patch) {
		const raw = patch.category;
		if (raw === null) delete next.category;
		else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return invalid("invalid category: empty");
			if (trimmed.length > 512) return invalid(`invalid category: too long (max 512)`);
			next.category = trimmed;
		}
	}
	if ("boardFace" in patch && patch.boardFace !== void 0) next.boardFace = patch.boardFace;
	if ("statusNote" in patch || "attention" in patch || "ttlMinutes" in patch) {
		const rawNote = patch.statusNote;
		const rawAttention = patch.attention;
		const ttlMinutes = patch.ttlMinutes;
		if (ttlMinutes !== void 0 && (!Number.isInteger(ttlMinutes) || ttlMinutes < 1 || ttlMinutes > 120)) return invalid(`invalid ttlMinutes (use 1-120)`);
		if (rawNote === null || rawAttention === null) {
			if (rawNote !== void 0 && rawNote !== null || rawAttention !== void 0 && rawAttention !== null) return invalid("cannot clear and set agent status in the same patch");
			delete next.agentStatus;
		} else {
			const current = resolveActiveSessionAgentStatus(next.agentStatus, now);
			const note = rawNote === void 0 ? current?.note : sanitizeSessionAgentStatusNote(rawNote);
			if (!note) return invalid("statusNote required before setting attention or ttlMinutes");
			if (rawAttention !== void 0 && !isSessionAgentAttentionIconId(rawAttention)) return invalid("invalid attention icon");
			const attention = rawAttention ?? current?.attention;
			next.agentStatus = {
				note,
				expiresAt: sessionAgentStatusExpiresAt(now, ttlMinutes),
				...attention ? { attention } : {}
			};
		}
	}
	if ("archived" in patch) if (patch.archived === true) {
		if (next.archivedAt === void 0) {
			next.archivedAt = now;
			if (params.archivedBy) next.archivedBy = params.archivedBy;
			else delete next.archivedBy;
		}
		delete next.pinnedAt;
	} else {
		delete next.archivedAt;
		delete next.archivedBy;
	}
	if ("pinned" in patch) if (patch.pinned === true) {
		if (next.archivedAt !== void 0) return invalid("cannot pin an archived session; restore it first");
		next.pinnedAt ??= now;
	} else delete next.pinnedAt;
	if ("unread" in patch) if (patch.unread === true) next.markedUnreadAt = now;
	else {
		next.lastReadAt = now;
		delete next.markedUnreadAt;
		delete next.agentStatus;
	}
	if ("thinkingLevel" in patch) {
		const raw = patch.thinkingLevel;
		if (raw === null) delete next.thinkingLevel;
		else if (raw !== void 0) {
			const normalized = normalizeThinkLevel(raw);
			if (!normalized) {
				const hintProvider = normalizeOptionalString(existing?.providerOverride) || resolvedDefault.provider;
				const hintModel = normalizeOptionalString(existing?.modelOverride) || resolvedDefault.model;
				return invalid(`invalid thinkingLevel (use ${formatThinkingLevels(hintProvider, hintModel, "|", await loadPreparedModelCatalogForPatch(), resolveThinkingRuntime(hintProvider, hintModel, existing))})`);
			}
			next.thinkingLevel = normalized;
		}
	}
	if ("fastMode" in patch) {
		const raw = patch.fastMode;
		if (raw === null) delete next.fastMode;
		else if (raw !== void 0) {
			const normalized = normalizeFastMode(raw);
			if (normalized === void 0) return invalid("invalid fastMode (use true, false, or \"auto\")");
			next.fastMode = normalized;
		}
	}
	if ("toolOverrides" in patch) {
		const raw = patch.toolOverrides;
		if (raw === null) delete next.toolOverrides;
		else if (raw !== void 0) {
			const normalized = normalizeSessionToolOverrides(raw);
			if (normalized) next.toolOverrides = normalized;
			else delete next.toolOverrides;
		}
	}
	if ("verboseLevel" in patch) {
		const raw = patch.verboseLevel;
		const parsed = parseVerboseOverride(raw);
		if (!parsed.ok) return invalid(parsed.error);
		applyVerboseOverride(next, parsed.value);
	}
	if ("traceLevel" in patch) {
		const raw = patch.traceLevel;
		const parsed = parseTraceOverride(raw);
		if (!parsed.ok) return invalid(parsed.error);
		applyTraceOverride(next, parsed.value);
	}
	if ("reasoningLevel" in patch) {
		const raw = patch.reasoningLevel;
		if (raw === null) delete next.reasoningLevel;
		else if (raw !== void 0) {
			const normalized = normalizeReasoningLevel(raw);
			if (!normalized) return invalid("invalid reasoningLevel (use \"on\"|\"off\"|\"stream\")");
			next.reasoningLevel = normalized;
		}
	}
	if ("responseUsage" in patch) {
		const raw = patch.responseUsage;
		if (raw === null) delete next.responseUsage;
		else if (raw !== void 0) {
			const normalized = normalizeUsageDisplay(raw);
			if (!normalized) return invalid("invalid responseUsage (use \"off\"|\"tokens\"|\"full\")");
			next.responseUsage = normalized;
		}
	}
	if ("elevatedLevel" in patch) {
		const raw = patch.elevatedLevel;
		if (raw === null) delete next.elevatedLevel;
		else if (raw !== void 0) {
			const normalized = normalizeElevatedLevel(raw);
			if (!normalized) return invalid("invalid elevatedLevel (use \"on\"|\"off\"|\"ask\"|\"full\")");
			next.elevatedLevel = normalized;
		}
	}
	if ("execHost" in patch) {
		const raw = patch.execHost;
		if (raw === null) delete next.execHost;
		else if (raw !== void 0) {
			const normalized = normalizeExecTarget(raw) ?? void 0;
			if (!normalized) return invalid("invalid execHost (use \"auto\"|\"sandbox\"|\"gateway\"|\"node\")");
			next.execHost = normalized;
		}
	}
	if ("execSecurity" in patch) {
		const raw = patch.execSecurity;
		if (raw === null) delete next.execSecurity;
		else if (raw !== void 0) {
			const normalized = normalizeExecSecurity(raw);
			if (!normalized) return invalid("invalid execSecurity (use \"deny\"|\"allowlist\"|\"full\")");
			next.execSecurity = normalized;
		}
	}
	if ("execAsk" in patch) {
		const raw = patch.execAsk;
		if (raw === null) delete next.execAsk;
		else if (raw !== void 0) {
			const normalized = normalizeExecAsk(raw);
			if (!normalized) return invalid("invalid execAsk (use \"off\"|\"on-miss\"|\"always\")");
			next.execAsk = normalized;
		}
	}
	if ("execNode" in patch) {
		const raw = patch.execNode;
		if (raw === null) {
			delete next.execNode;
			delete next.execCwd;
		} else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return invalid("invalid execNode: empty");
			if (trimmed !== next.execNode) delete next.execCwd;
			next.execNode = trimmed;
		}
	}
	if ("model" in patch) {
		const agentModelFallback = isAgentSessionModelPatchOrigin() ? next.modelFallback?.source === "agent-patch" ? {
			...next.modelFallback,
			ts: Math.max(now, next.modelFallback.ts + 1)
		} : snapshotAgentModelFallback(cfg, next, sessionAgentId, now) : void 0;
		delete next.modelFallback;
		const raw = patch.model;
		if (raw === null) {
			applyModelOverrideWithAuthProfileCompatibility({
				cfg,
				agentDir: resolveAgentDir(cfg, sessionAgentId),
				entry: next,
				currentProvider: next.providerOverride ?? next.modelProvider ?? resolvedDefault.provider,
				selection: {
					provider: resolvedDefault.provider,
					model: resolvedDefault.model,
					isDefault: true
				},
				...params.providerAuthMetadataSnapshot ? { metadataSnapshot: params.providerAuthMetadataSnapshot } : {}
			});
			delete next.liveModelSwitchPending;
		} else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return invalid("invalid model: empty");
			if (!params.loadGatewayModelCatalog) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "model catalog unavailable")
			};
			const catalog = await loadPreparedModelCatalogForPatch();
			if (!catalog) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "model catalog unavailable")
			};
			const resolved = resolveSessionPatchModelSelection({
				cfg,
				catalog,
				raw: trimmed,
				defaultProvider: resolvedDefault.provider,
				defaultModel: resolvedDefault.model,
				subagentModelHint
			});
			if (!resolved.ok) return invalid(resolved.error);
			applyModelOverrideWithAuthProfileCompatibility({
				cfg,
				agentDir: resolveAgentDir(cfg, sessionAgentId),
				entry: next,
				currentProvider: next.providerOverride ?? next.modelProvider ?? resolvedDefault.provider,
				selection: {
					provider: resolved.provider,
					model: resolved.model,
					isDefault: resolved.isDefault
				},
				profileOverride: resolved.profile,
				...params.providerAuthMetadataSnapshot ? { metadataSnapshot: params.providerAuthMetadataSnapshot } : {},
				markLiveSwitchPending: true
			});
		}
		if (agentModelFallback) next.modelFallback = agentModelFallback;
	}
	if (next.thinkingLevel && ("thinkingLevel" in patch || "model" in patch)) {
		const effectiveProvider = next.providerOverride ?? resolvedDefault.provider;
		const effectiveModel = next.modelOverride ?? resolvedDefault.model;
		const thinkingLevel = normalizeThinkLevel(next.thinkingLevel);
		const thinkingCatalog = await loadPreparedModelCatalogForPatch();
		if (!thinkingLevel) delete next.thinkingLevel;
		else {
			const thinkingRuntime = resolveThinkingRuntime(effectiveProvider, effectiveModel, next);
			if (!isThinkingLevelSupported({
				provider: effectiveProvider,
				model: effectiveModel,
				level: thinkingLevel,
				catalog: thinkingCatalog,
				agentRuntime: thinkingRuntime
			})) {
				if ("thinkingLevel" in patch) return invalid(`thinkingLevel "${thinkingLevel}" is not supported for ${effectiveProvider}/${effectiveModel} (use ${formatThinkingLevels(effectiveProvider, effectiveModel, "|", thinkingCatalog, thinkingRuntime)})`);
				next.thinkingLevel = resolveSupportedThinkingLevel({
					provider: effectiveProvider,
					model: effectiveModel,
					level: thinkingLevel,
					catalog: thinkingCatalog,
					agentRuntime: thinkingRuntime
				});
			}
		}
	}
	if ("thinkingLevel" in patch && !("model" in patch) && next.modelFallback?.source === "agent-patch") next.modelFallback = next.thinkingLevel ? {
		...next.modelFallback,
		prevThinkingLevel: next.thinkingLevel
	} : {
		...next.modelFallback,
		prevThinkingLevel: void 0
	};
	if ("sendPolicy" in patch) {
		const raw = patch.sendPolicy;
		if (raw === null) delete next.sendPolicy;
		else if (raw !== void 0) {
			const normalized = normalizeSendPolicy(raw);
			if (!normalized) return invalid("invalid sendPolicy (use \"allow\"|\"deny\")");
			next.sendPolicy = normalized;
		}
	}
	if ("groupActivation" in patch) {
		const raw = patch.groupActivation;
		if (raw === null) delete next.groupActivation;
		else if (raw !== void 0) {
			const normalized = normalizeGroupActivation(raw);
			if (!normalized) return invalid("invalid groupActivation (use \"mention\"|\"always\")");
			next.groupActivation = normalized;
		}
	}
	return {
		ok: true,
		entry: next
	};
}
//#endregion
export { resolveSessionPatchModelSelection as n, projectSessionsPatchEntry as t };
