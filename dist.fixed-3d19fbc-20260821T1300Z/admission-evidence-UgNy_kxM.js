import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
//#region src/channels/message-access/admission-evidence-scope-key.ts
const MAX_CHANNEL_ADMISSION_SCOPE_BYTES = 32768;
const MAX_CHANNEL_ADMISSION_SCOPE_NODES = 256;
const INVALID_SCOPE_VALUE = Symbol("invalid-channel-admission-scope-value");
function snapshotOwnedData(value, budget = { nodes: 0 }, depth = 0) {
	budget.nodes += 1;
	if (budget.nodes > MAX_CHANNEL_ADMISSION_SCOPE_NODES || depth > 6) return INVALID_SCOPE_VALUE;
	if (value === void 0 || value === null || typeof value === "string" || typeof value === "boolean") return value;
	if (typeof value === "number") return Number.isFinite(value) ? value : INVALID_SCOPE_VALUE;
	if (typeof value !== "object") return INVALID_SCOPE_VALUE;
	let descriptors;
	let symbols;
	try {
		descriptors = Object.getOwnPropertyDescriptors(value);
		symbols = Object.getOwnPropertySymbols(value);
	} catch {
		return INVALID_SCOPE_VALUE;
	}
	if (symbols.some((key) => Object.getOwnPropertyDescriptor(value, key)?.enumerable)) return INVALID_SCOPE_VALUE;
	const keys = Object.keys(descriptors).filter((key) => descriptors[key]?.enumerable).toSorted();
	const entries = [];
	for (const key of keys) {
		const descriptor = descriptors[key];
		if (!descriptor || !("value" in descriptor)) return INVALID_SCOPE_VALUE;
		const captured = snapshotOwnedData(descriptor.value, budget, depth + 1);
		if (captured === INVALID_SCOPE_VALUE) return INVALID_SCOPE_VALUE;
		entries.push([key, captured]);
	}
	return Array.isArray(value) ? ["array", entries] : ["record", entries];
}
function stableOwnedScopeKey(value) {
	const snapshot = snapshotOwnedData(value);
	if (snapshot === INVALID_SCOPE_VALUE) return;
	try {
		const key = JSON.stringify(snapshot);
		return key.length <= MAX_CHANNEL_ADMISSION_SCOPE_BYTES ? key : void 0;
	} catch {
		return;
	}
}
function safeOwnPropertyDescriptor(value, key) {
	try {
		return Object.getOwnPropertyDescriptor(value, key);
	} catch {
		return;
	}
}
function ownDataValue(value, key) {
	let descriptor;
	try {
		descriptor = Object.getOwnPropertyDescriptor(value, key);
	} catch {
		return INVALID_SCOPE_VALUE;
	}
	if (!descriptor) return;
	return "value" in descriptor ? descriptor.value : INVALID_SCOPE_VALUE;
}
function publicResultScopeKey(result) {
	const stateValue = ownDataValue(result, "state");
	if (!stateValue || typeof stateValue !== "object") return;
	const routeFacts = ownDataValue(stateValue, "routeFacts");
	if (!Array.isArray(routeFacts)) return;
	const routeCount = ownDataValue(routeFacts, "length");
	if (typeof routeCount !== "number" || routeCount > MAX_CHANNEL_ADMISSION_SCOPE_NODES) return;
	const routes = [];
	for (let index = 0; index < routeCount; index += 1) {
		const descriptor = safeOwnPropertyDescriptor(routeFacts, String(index));
		const route = descriptor && "value" in descriptor ? descriptor.value : void 0;
		if (!route || typeof route !== "object") return;
		routes.push({
			id: ownDataValue(route, "id"),
			kind: ownDataValue(route, "kind"),
			gate: ownDataValue(route, "gate"),
			effect: ownDataValue(route, "effect"),
			precedence: ownDataValue(route, "precedence"),
			senderPolicy: ownDataValue(route, "senderPolicy")
		});
	}
	return stableOwnedScopeKey({
		accountId: ownDataValue(stateValue, "accountId"),
		channelId: ownDataValue(stateValue, "channelId"),
		conversationKind: ownDataValue(stateValue, "conversationKind"),
		event: ownDataValue(stateValue, "event"),
		routeFacts: routes
	});
}
const FINALIZED_CONTEXT_SCOPE_FIELDS = [
	"OriginatingChannel",
	"AccountId",
	"SenderId",
	"ChatType",
	"ChatId",
	"SessionKey",
	"AgentId",
	"DmScope",
	"ParentSessionKey",
	"ModelParentSessionKey",
	"MessageSid",
	"MessageSidFull",
	"ReplyToId",
	"ReplyToIdFull",
	"To",
	"From",
	"OriginatingTo",
	"MessageThreadId",
	"NativeChannelId",
	"ThreadParentId",
	"InboundEventKind",
	"Provider",
	"Surface",
	"NativeDirectUserId"
];
function finalizedContextScopeKey(context) {
	const entries = [];
	for (const key of FINALIZED_CONTEXT_SCOPE_FIELDS) {
		const descriptor = safeOwnPropertyDescriptor(context, key);
		if (!descriptor) {
			entries.push([key, "absent"]);
			continue;
		}
		if (!("value" in descriptor)) return;
		const value = descriptor.value;
		if (value !== void 0 && value !== null && typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return;
		entries.push([
			key,
			"present",
			value
		]);
	}
	return stableOwnedScopeKey(entries);
}
//#endregion
//#region src/channels/message-access/admission-evidence.ts
const CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS = 16;
const CHANNEL_ADMISSION_EVIDENCE_MAX_AGE_MS = 720 * 60 * 6e4;
const state = resolveGlobalSingleton(Symbol.for("openclaw.channelAdmissionEvidenceState"), () => ({
	collectionEnabled: false,
	generation: 0,
	payloadByEvidence: /* @__PURE__ */ new WeakMap(),
	resolutionByIngress: /* @__PURE__ */ new WeakMap(),
	ownerByChannelId: /* @__PURE__ */ new Map(),
	evidenceByPreparation: /* @__PURE__ */ new WeakMap(),
	evidenceByContext: /* @__PURE__ */ new WeakMap(),
	scopeByContext: /* @__PURE__ */ new WeakMap(),
	consumedEvidence: /* @__PURE__ */ new WeakSet(),
	decisionSink: void 0
}));
/** Register one exact native channel record as the current in-process producer. */
function registerChannelAdmissionEvidenceOwner(owner) {
	state.ownerByChannelId.set(owner.channelId, owner);
	return () => {
		if (state.ownerByChannelId.get(owner.channelId) === owner) state.ownerByChannelId.delete(owner.channelId);
	};
}
function configureChannelAdmissionEvidenceCollection(enabled) {
	const generation = ++state.generation;
	state.collectionEnabled = enabled;
	return () => {
		if (state.generation === generation) {
			state.collectionEnabled = false;
			state.generation += 1;
		}
	};
}
function configureChannelAdmissionDecisionSink(sink) {
	state.decisionSink = sink;
	return () => {
		if (state.decisionSink === sink) state.decisionSink = void 0;
	};
}
function mintChannelAdmissionEvidence(payload) {
	if (!state.collectionEnabled) return;
	const evidence = Object.freeze({ kind: "channel-admission-evidence" });
	state.payloadByEvidence.set(evidence, Object.freeze({
		...payload,
		createdAt: Date.now(),
		generation: state.generation
	}));
	return evidence;
}
function scopedParticipantRef(params) {
	const channelId = params.channelId;
	const accountId = params.accountId || "default";
	const rawPrincipalRef = params.rawPrincipalRef == null ? "" : String(params.rawPrincipalRef);
	if (!channelId || !rawPrincipalRef) return;
	const scoped = JSON.stringify([
		channelId,
		accountId,
		rawPrincipalRef
	]);
	return scoped.length <= 4096 ? scoped : void 0;
}
function participantContribution(params) {
	const rawPrincipalRef = scopedParticipantRef(params);
	return Object.freeze(rawPrincipalRef ? { participant: Object.freeze({
		state: "present",
		rawPrincipalRef
	}) } : { participant: Object.freeze({ state: "unknown" }) });
}
/** Brand an exact resolver object with its non-authoritative input binding. */
function snapshotContextBinding(value) {
	if (!value || typeof value !== "object") return;
	const agentId = ownDataValue(value, "agentId");
	const sessionKey = ownDataValue(value, "sessionKey");
	const messageId = ownDataValue(value, "messageId");
	const nativeChannelId = ownDataValue(value, "nativeChannelId");
	const inboundEventKind = ownDataValue(value, "inboundEventKind");
	if (typeof agentId !== "string" || typeof sessionKey !== "string" || messageId !== void 0 && typeof messageId !== "string" || nativeChannelId !== void 0 && typeof nativeChannelId !== "string" || inboundEventKind !== "user_request" && inboundEventKind !== "room_event") return;
	return Object.freeze({
		agentId,
		sessionKey,
		messageId,
		nativeChannelId,
		inboundEventKind
	});
}
function recordChannelIngressResolution(params) {
	const owner = state.ownerByChannelId.get(params.channelId);
	const activeOwner = owner?.isLive() === true ? owner : void 0;
	state.resolutionByIngress.set(params.result, Object.freeze({
		channelId: params.channelId,
		accountId: params.accountId,
		rawPrincipalRef: params.rawPrincipalRef,
		participantOutcomeAffecting: params.participantOutcomeAffecting,
		owner: activeOwner,
		ownerEpoch: activeOwner?.epoch,
		scope: Object.freeze({ conversation: Object.freeze({ ...params.scope.conversation }) }),
		contextBinding: snapshotContextBinding(params.scope.contextBinding),
		publicScopeKey: publicResultScopeKey(params.result),
		handoff: { consumed: false }
	}));
	return params.result;
}
function normalizeScopeId(value) {
	if (value === void 0 || value === null) return;
	return typeof value === "string" || typeof value === "number" ? String(value) : INVALID_SCOPE_VALUE;
}
function contextHandoffMatches(params) {
	const conversation = ownDataValue(params.contextParams, "conversation");
	const route = ownDataValue(params.contextParams, "route");
	const reply = ownDataValue(params.contextParams, "reply");
	const message = ownDataValue(params.contextParams, "message");
	if (!conversation || typeof conversation !== "object" || !route || typeof route !== "object" || !reply || typeof reply !== "object" || !message || typeof message !== "object") return false;
	const expected = params.binding.scope?.conversation;
	const expectedContext = params.binding.contextBinding;
	if (!expected || !expectedContext) return false;
	const routeAccountId = ownDataValue(route, "accountId");
	const effectiveAccountId = routeAccountId === void 0 ? params.accountId : normalizeScopeId(routeAccountId);
	const conversationKind = ownDataValue(conversation, "kind");
	const conversationId = normalizeScopeId(ownDataValue(conversation, "id"));
	const conversationParentId = normalizeScopeId(ownDataValue(conversation, "parentId"));
	const conversationThreadId = normalizeScopeId(ownDataValue(conversation, "threadId"));
	const replyThreadId = normalizeScopeId(ownDataValue(reply, "messageThreadId"));
	const replyParentId = normalizeScopeId(ownDataValue(reply, "threadParentId"));
	const nativeConversationId = normalizeScopeId(ownDataValue(conversation, "nativeChannelId"));
	const nativeReplyId = normalizeScopeId(ownDataValue(reply, "nativeChannelId"));
	const routeAgentId = normalizeScopeId(ownDataValue(route, "agentId"));
	const dispatchSessionKey = normalizeScopeId(ownDataValue(route, "dispatchSessionKey"));
	const routeSessionKey = normalizeScopeId(ownDataValue(route, "routeSessionKey"));
	const inboundEventKindValue = ownDataValue(message, "inboundEventKind");
	const inboundEventKind = inboundEventKindValue === void 0 || inboundEventKindValue === null ? "user_request" : normalizeScopeId(inboundEventKindValue);
	if ([
		effectiveAccountId,
		conversationId,
		conversationParentId,
		conversationThreadId,
		replyThreadId,
		replyParentId,
		nativeConversationId,
		nativeReplyId,
		routeAgentId,
		dispatchSessionKey,
		routeSessionKey,
		inboundEventKind
	].includes(INVALID_SCOPE_VALUE)) return false;
	const nativeId = nativeReplyId ?? nativeConversationId;
	if (expectedContext.nativeChannelId !== void 0 && nativeId !== expectedContext.nativeChannelId || expectedContext.nativeChannelId === void 0 && typeof nativeId === "string" && ![
		expected.id,
		expected.parentId,
		expected.threadId
	].includes(nativeId)) return false;
	if (replyThreadId !== void 0 && conversationThreadId !== void 0 && replyThreadId !== conversationThreadId || replyParentId !== void 0 && conversationParentId !== void 0 && replyParentId !== conversationParentId || nativeReplyId !== void 0 && nativeConversationId !== void 0 && nativeReplyId !== nativeConversationId) return false;
	return scopedParticipantRef(params.binding) === scopedParticipantRef({
		channelId: params.channelId,
		accountId: effectiveAccountId,
		rawPrincipalRef: params.rawPrincipalRef
	}) && conversationKind === expected.kind && conversationId === expected.id && (replyParentId ?? conversationParentId) === expected.parentId && (replyThreadId ?? conversationThreadId) === expected.threadId && routeAgentId === expectedContext.agentId && (dispatchSessionKey ?? routeSessionKey) === expectedContext.sessionKey && inboundEventKind === expectedContext.inboundEventKind;
}
function unknownChannelAdmissionEvidence() {
	return mintChannelAdmissionEvidence({
		kind: "leaf",
		contribution: Object.freeze({ participant: { state: "unknown" } })
	});
}
/** Consume and validate the exact resolver-to-context handoff before context construction. */
function prepareHostChannelContextAdmissionEvidence(params) {
	const preparation = Object.freeze({ kind: "prepared-channel-admission-evidence" });
	if (params.ingress === "unsupported") {
		state.evidenceByPreparation.set(preparation, mintChannelAdmissionEvidence({
			kind: "leaf",
			contribution: Object.freeze({ participant: { state: "unsupported" } })
		}));
		return preparation;
	}
	const results = params.ingress === void 0 ? [] : Array.isArray(params.ingress) ? params.ingress : [params.ingress];
	const seen = /* @__PURE__ */ new Set();
	const validBindings = [];
	let valid = results.length > 0 && results.length <= CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS;
	for (const result of results) {
		const binding = state.resolutionByIngress.get(result);
		const firstUse = binding !== void 0 && !binding.handoff.consumed && !seen.has(result);
		if (binding && !binding.handoff.consumed) binding.handoff.consumed = true;
		seen.add(result);
		const ownerMatches = params.owner !== void 0 && binding?.owner === params.owner && binding.ownerEpoch === params.owner.epoch && state.ownerByChannelId.get(params.channelId) === params.owner && params.owner.isLive();
		const resultIngress = ownDataValue(result, "ingress");
		const resultMatches = binding?.publicScopeKey !== void 0 && publicResultScopeKey(result) === binding.publicScopeKey && resultIngress !== null && typeof resultIngress === "object" && ownDataValue(resultIngress, "admission") === "dispatch";
		const contextMatches = binding !== void 0 && contextHandoffMatches({
			...params,
			binding
		});
		if (!firstUse || !ownerMatches || !resultMatches || !contextMatches || !binding) valid = false;
		else validBindings.push(binding);
	}
	const contextMessageId = normalizeScopeId(ownDataValue(params.contextParams, "messageId"));
	const finalMessageId = validBindings.at(-1)?.contextBinding?.messageId;
	if (contextMessageId === INVALID_SCOPE_VALUE || finalMessageId !== void 0 && contextMessageId !== finalMessageId) valid = false;
	const sources = valid ? validBindings.map((binding) => {
		const contribution = participantContribution(binding);
		return mintChannelAdmissionEvidence({
			kind: "leaf",
			contribution: Object.freeze({
				...contribution,
				decision: Object.freeze({
					participantAware: contribution.participant.state === "present",
					outcomeAffecting: binding.participantOutcomeAffecting
				})
			})
		});
	}) : [];
	state.evidenceByPreparation.set(preparation, valid ? combineChannelAdmissionEvidence(sources) : unknownChannelAdmissionEvidence());
	return preparation;
}
/** Attach one prepared private carrier to the exact finalized context scope. */
function bindHostChannelContextAdmissionEvidence(params) {
	const preparedEvidence = state.evidenceByPreparation.get(params.preparation);
	state.evidenceByPreparation.delete(params.preparation);
	if (!state.collectionEnabled) return;
	const scopeKey = finalizedContextScopeKey(params.context);
	const evidence = preparedEvidence && scopeKey !== void 0 ? preparedEvidence : unknownChannelAdmissionEvidence();
	if (evidence) {
		state.evidenceByContext.set(params.context, evidence);
		if (scopeKey !== void 0) state.scopeByContext.set(params.context, scopeKey);
	}
}
function readChannelContextAdmissionEvidence(context) {
	return state.evidenceByContext.get(context);
}
/** Preserve private evidence when an owner intentionally replaces a finalized context object. */
function copyChannelParticipantAdmissionEvidence(source, target) {
	const evidence = state.evidenceByContext.get(source);
	if (!evidence) return;
	const sourceScope = state.scopeByContext.get(source);
	const targetScope = finalizedContextScopeKey(target);
	const safeEvidence = sourceScope !== void 0 && targetScope === sourceScope && activePayload(evidence, Date.now()) !== void 0 ? evidence : unknownChannelAdmissionEvidence();
	if (safeEvidence) {
		state.evidenceByContext.set(target, safeEvidence);
		if (targetScope !== void 0) state.scopeByContext.set(target, targetScope);
	}
}
function activePayload(evidence, now) {
	if (!evidence || state.consumedEvidence.has(evidence)) return;
	const payload = state.payloadByEvidence.get(evidence);
	return payload && payload.generation === state.generation && now - payload.createdAt <= CHANNEL_ADMISSION_EVIDENCE_MAX_AGE_MS ? payload : void 0;
}
/** Preserve one source exactly; collected sources get one new bounded opaque aggregate. */
function combineChannelAdmissionEvidence(evidence) {
	if (!state.collectionEnabled) return;
	if (evidence.length === 1) return evidence[0];
	if (evidence.length > CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS) return mintChannelAdmissionEvidence({
		kind: "leaf",
		contribution: Object.freeze({ participant: { state: "unknown" } })
	});
	return mintChannelAdmissionEvidence({
		kind: "aggregate",
		sources: Object.freeze([...evidence])
	});
}
function inspectContributions(params) {
	const payload = activePayload(params.evidence, params.now);
	if (!payload || !params.evidence || params.seen.has(params.evidence)) return [{ participant: { state: "unknown" } }];
	params.seen.add(params.evidence);
	return payload.kind === "leaf" ? [payload.contribution] : payload.sources.flatMap((source) => inspectContributions({
		...params,
		evidence: source
	}));
}
/** Compare opaque participants without exposing or consuming their raw references. */
function compareChannelAdmissionParticipants(evidence) {
	const contributions = evidence.flatMap((candidate) => inspectContributions({
		evidence: candidate,
		now: Date.now(),
		seen: /* @__PURE__ */ new Set()
	}));
	if (contributions.length === 0 || contributions.length > CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS) return "mixed-or-unknown";
	const participants = contributions.map((item) => item.participant);
	const first = participants[0];
	return first?.state === "present" && participants.every((item) => item.state === "present" && item.rawPrincipalRef === first.rawPrincipalRef) ? "same" : "mixed-or-unknown";
}
function consumeContributions(params) {
	const payload = activePayload(params.evidence, params.now);
	if (!payload || !params.evidence || params.seen.has(params.evidence)) return [{ participant: { state: "unknown" } }];
	params.seen.add(params.evidence);
	state.consumedEvidence.add(params.evidence);
	if (payload.kind === "leaf") return [payload.contribution];
	const contributions = payload.sources.flatMap((source) => consumeContributions({
		...params,
		evidence: source
	}));
	return contributions.length <= CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS ? contributions : [{ participant: { state: "unknown" } }];
}
function freezeConsumed(value) {
	return Object.freeze({
		...value,
		invoker: Object.freeze(value.invoker)
	});
}
/** Consume one aggregate at run admission. Missing, forged, stale, or reused carriers are unknown. */
function consumeChannelAdmissionEvidence(evidence) {
	const contributions = consumeContributions({
		evidence,
		now: Date.now(),
		seen: /* @__PURE__ */ new Set()
	});
	const participants = contributions.map((item) => item.participant);
	if (participants.length > 0 && participants.every((item) => item.state === "unsupported")) return freezeConsumed({
		ingressState: "unsupported",
		invoker: { state: "unknown" },
		decisionCoverage: "unsupported"
	});
	const present = participants.filter((item) => item.state === "present");
	if (!(present.length === participants.length && present.every((item) => item.rawPrincipalRef === present[0]?.rawPrincipalRef)) || !present[0]) return freezeConsumed({
		ingressState: "unknown",
		invoker: { state: "unknown" },
		decisionCoverage: "unknown"
	});
	const everyDecisionEnforced = contributions.every((item) => item.decision?.participantAware && item.decision.outcomeAffecting);
	return freezeConsumed({
		ingressState: "present",
		invoker: {
			state: "present",
			kind: "person",
			rawPrincipalRef: present[0].rawPrincipalRef
		},
		assuranceRef: "channel-admission",
		decisionCoverage: everyDecisionEnforced ? "enforced" : "attribution-only"
	});
}
/** Queue the channel decision after its exact identity tuple on the shared audit FIFO. */
function recordChannelAdmissionDecision(params) {
	const missingEvidence = params.coverageState === "unknown" ? ["channel.admission_evidence"] : params.coverageState === "unsupported" ? ["channel.adapter_identity"] : params.coverageState === "attribution-only" ? ["decision.participant_effect"] : [];
	return state.decisionSink?.({
		schemaVersion: 1,
		receiptId: `${params.contextId}:channel-admission`,
		contextId: params.contextId,
		executionId: params.executionId,
		runId: params.runId,
		occurredAt: params.occurredAt,
		action: {
			family: "channel",
			operation: "admission",
			summary: "Channel ingress admitted this agent execution."
		},
		decision: {
			outcome: params.coverageState === "unknown" || params.coverageState === "unsupported" ? "unknown" : "allowed",
			reasonCode: params.coverageState === "enforced" ? "channel_ingress_participant_enforced" : params.coverageState === "attribution-only" ? "channel_ingress_attribution_only" : params.coverageState === "unsupported" ? "channel_ingress_identity_unsupported" : "channel_ingress_identity_unknown"
		},
		enforcement: {
			coverageState: params.coverageState,
			evaluatorRef: "channel-ingress",
			policyRefs: [],
			grantRefs: [],
			contextFieldsUsed: params.coverageState === "enforced" ? ["invoker.principal"] : []
		},
		source: {
			owner: "channel-ingress",
			recordRef: `${params.contextId}:channel-admission`,
			decisionBoundary: "channel-ingress.run-admission"
		},
		missingEvidence,
		remediation: params.coverageState === "enforced" ? [] : [{
			code: "treat_as_diagnostic_provenance",
			text: "Treat this receipt as diagnostic provenance, not authorization."
		}]
	}) ?? false;
}
//#endregion
export { configureChannelAdmissionEvidenceCollection as a, prepareHostChannelContextAdmissionEvidence as c, recordChannelIngressResolution as d, registerChannelAdmissionEvidenceOwner as f, configureChannelAdmissionDecisionSink as i, readChannelContextAdmissionEvidence as l, combineChannelAdmissionEvidence as n, consumeChannelAdmissionEvidence as o, compareChannelAdmissionParticipants as r, copyChannelParticipantAdmissionEvidence as s, bindHostChannelContextAdmissionEvidence as t, recordChannelAdmissionDecision as u };
