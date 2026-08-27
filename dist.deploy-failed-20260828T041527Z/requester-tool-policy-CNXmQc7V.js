import { a as resolveInheritedToolPolicyForSession, i as resolveGroupToolPolicy, o as resolveSubagentToolPolicyForSession } from "./agent-tools.policy-BuNXvHMo.js";
import { n as resolvePersistedSubagentToolPolicyEnvelope, s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-Chg191Ne.js";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-DuMIfV8W.js";
import { u as normalizeInputProvenance } from "./input-provenance-CCQsDhUy.js";
import { t as resolveRequesterStoreKey } from "./subagent-requester-store-key-B9iKefbQ.js";
//#region src/agents/subagents/announce/subagent-announce-handoff.ts
function resolveExactSubagentCompletionEvent(params) {
	if (params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_announce") return;
	const completionEvents = params.internalEvents?.filter((event) => event.type === "task_completion" && event.source === "subagent");
	const completionEvent = completionEvents?.length === 1 ? completionEvents[0] : void 0;
	return completionEvent?.childSessionKey === params.inputProvenance.sourceSessionKey ? completionEvent : void 0;
}
/** Identifies the delivery-only turn that hands a completed subagent result to its requester. */
function isSubagentAnnounceCompletionHandoff(params) {
	if (params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_announce") return false;
	return params.internalEvents?.some((event) => event.type === "task_completion" && event.source === "subagent") === true;
}
/** Verify that a consumed in-process handoff still matches this exact model attempt. */
function isTrustedSubagentCompletionHandoffForRun(params) {
	const handoff = params.handoff;
	const completionEvent = resolveExactSubagentCompletionEvent({
		inputProvenance: params.inputProvenance,
		internalEvents: params.internalEvents
	});
	if (!handoff || handoff.kind !== "subagent-completion" || params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_announce" || params.internalEvents !== void 0 && !completionEvent) return false;
	return handoff.sourceSessionKey === params.inputProvenance.sourceSessionKey && (params.internalEvents === void 0 || handoff.sourceSessionId === completionEvent?.childSessionId) && handoff.targetSessionKey === params.sessionKey && handoff.targetSessionId === params.sessionId && handoff.provider === params.provider?.trim().toLowerCase() && handoff.model === params.model?.trim();
}
//#endregion
//#region src/agents/requester-tool-policy.ts
const MAX_DELEGATION_LINEAGE_DEPTH = 32;
function policyFromEnvelope(envelope) {
	if (!envelope) return;
	return envelope.inheritedToolAllow.length > 0 || envelope.inheritedToolDeny.length > 0 ? {
		...envelope.inheritedToolAllow.length > 0 ? { allow: envelope.inheritedToolAllow } : {},
		...envelope.inheritedToolDeny.length > 0 ? { deny: envelope.inheritedToolDeny } : {}
	} : void 0;
}
function resolveDelegatedPolicy(params, subagentStore) {
	const provenance = normalizeInputProvenance(params.inputProvenance);
	const hasExternalRequester = provenance?.kind === "external_user" || Boolean(params.senderId || params.senderName || params.senderUsername || params.senderE164);
	if (isTrustedSubagentCompletionHandoffForRun({
		handoff: params.trustedInternalHandoff,
		inputProvenance: provenance,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		provider: params.modelProvider,
		model: params.modelId
	})) {
		if (!provenance?.sourceSessionKey || !params.sessionKey) return { delegated: false };
		if (!params.config) throw new Error("Trusted internal handoff policy resolution requires configuration.");
		const targetSessionKey = resolveRequesterStoreKey(params.config, params.sessionKey);
		let currentSessionKey = resolveRequesterStoreKey(params.config, provenance.sourceSessionKey);
		const visited = /* @__PURE__ */ new Set();
		for (let depth = 0; depth < MAX_DELEGATION_LINEAGE_DEPTH; depth += 1) {
			if (visited.has(currentSessionKey)) return { delegated: false };
			visited.add(currentSessionKey);
			const completionStore = resolveSubagentCapabilityStore(currentSessionKey, { cfg: params.config });
			const envelope = resolvePersistedSubagentToolPolicyEnvelope(currentSessionKey, {
				cfg: params.config,
				store: completionStore
			});
			if (!envelope) return { delegated: false };
			const parentSessionKey = resolveRequesterStoreKey(params.config, envelope.spawnedBy);
			if (((envelope.completionOwnerSessionKey ? resolveRequesterStoreKey(params.config, envelope.completionOwnerSessionKey) : void 0) ?? parentSessionKey) === targetSessionKey) return {
				delegated: true,
				source: "completion-handoff",
				policy: policyFromEnvelope(envelope)
			};
			currentSessionKey = parentSessionKey;
		}
		return { delegated: false };
	}
	if (!hasExternalRequester) {
		const ownEnvelope = resolvePersistedSubagentToolPolicyEnvelope(params.subagentSessionKey, {
			cfg: params.config,
			store: subagentStore
		});
		if (ownEnvelope) return {
			delegated: true,
			source: "persisted-child",
			policy: policyFromEnvelope(ownEnvelope)
		};
	}
	return { delegated: false };
}
/** Confirms that an exact consumed completion capability also owns persisted requester lineage. */
function hasVerifiedRequesterCompletionHandoff(params) {
	const delegatedPolicy = resolveDelegatedPolicy(params, void 0);
	return delegatedPolicy.delegated && delegatedPolicy.source === "completion-handoff";
}
/** Resolve sender/group policy or a verified inherited projection, never both. */
function resolveRequesterToolPolicies(params) {
	const subagentSessionKey = params.subagentSessionKey ?? params.sessionKey;
	const subagentStore = resolveSubagentCapabilityStore(subagentSessionKey, { cfg: params.config });
	const delegatedPolicy = resolveDelegatedPolicy({
		...params,
		subagentSessionKey
	}, subagentStore);
	const subagentPolicy = subagentSessionKey && isSubagentEnvelopeSession(subagentSessionKey, {
		cfg: params.config,
		store: subagentStore
	}) ? resolveSubagentToolPolicyForSession(params.config, subagentSessionKey, { store: subagentStore }) : void 0;
	if (delegatedPolicy.delegated) return {
		delegated: true,
		requesterPolicySource: delegatedPolicy.source,
		subagentPolicy,
		inheritedToolPolicy: delegatedPolicy.policy,
		subagentStore
	};
	const senderPolicyMode = params.senderPolicyMode ?? "always";
	const shouldResolveSenderPolicy = senderPolicyMode === "always" || senderPolicyMode === "when-sender-id" && Boolean(params.senderId);
	return {
		delegated: false,
		requesterPolicySource: "current-request",
		groupPolicy: params.conversationPolicy ?? resolveGroupToolPolicy({
			config: params.config,
			sessionKey: params.groupPolicySessionKey ?? params.sessionKey,
			spawnedBy: params.spawnedBy,
			messageProvider: params.messageProvider ?? void 0,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			accountId: params.accountId,
			requireConfiguredAccount: params.requireConfiguredGroupAccount,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			senderPolicyMode: senderPolicyMode === "never" ? "never" : "always"
		}),
		senderPolicy: shouldResolveSenderPolicy ? resolveSenderToolPolicy({
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			messageProvider: params.messageProvider,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164
		}) : void 0,
		subagentPolicy,
		inheritedToolPolicy: resolveInheritedToolPolicyForSession(params.config, subagentSessionKey, { store: subagentStore }),
		subagentStore
	};
}
//#endregion
export { resolveExactSubagentCompletionEvent as a, isTrustedSubagentCompletionHandoffForRun as i, resolveRequesterToolPolicies as n, isSubagentAnnounceCompletionHandoff as r, hasVerifiedRequesterCompletionHandoff as t };
