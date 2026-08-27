import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as redactSensitiveText } from "./redact-DP7p9QfH.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { randomUUID } from "node:crypto";
import { Value } from "typebox/value";
import { Type } from "typebox";
import { isProxy } from "node:util/types";
//#region src/audit/execution-identity-admission.ts
/** Bounded execution-identity facts captured at authoritative run admission. */
const EXECUTION_IDENTITY_ADMISSION_MAX_BYTES = 16 * 1024;
const EXECUTION_IDENTITY_ADMISSION_MAX_ITEMS = 16;
const RAW_REF_MAX_LENGTH = 4096;
const PROCESS_RUNTIME_INSTANCE_ID = randomUUID();
const log = createSubsystemLogger("audit/events");
const boundedRef = () => Type.String({
	minLength: 1,
	maxLength: 256
});
const rawRef = () => Type.String({
	minLength: 1,
	maxLength: RAW_REF_MAX_LENGTH
});
const evidenceState = () => Type.Union([
	Type.Literal("present"),
	Type.Literal("absent"),
	Type.Literal("unknown"),
	Type.Literal("unsupported")
]);
const closedObject = (properties) => Type.Object(properties, { additionalProperties: false });
const ingressKind = () => Type.Union([
	Type.Literal("local-cli"),
	Type.Literal("gateway-client"),
	Type.Literal("channel"),
	Type.Literal("api"),
	Type.Literal("schedule"),
	Type.Literal("webhook"),
	Type.Literal("task"),
	Type.Literal("subagent"),
	Type.Literal("acp"),
	Type.Literal("worker"),
	Type.Literal("plugin"),
	Type.Literal("recovery"),
	Type.Literal("system")
]);
const runtimeKind = () => Type.Union([
	Type.Literal("gateway"),
	Type.Literal("embedded"),
	Type.Literal("worker"),
	Type.Literal("plugin-harness"),
	Type.Literal("acp")
]);
const admissionGrant = () => closedObject({
	rawGrantRef: rawRef(),
	state: evidenceState()
});
const admissionGrants = () => Type.Array(admissionGrant(), { maxItems: EXECUTION_IDENTITY_ADMISSION_MAX_ITEMS });
const admissionAssurance = () => Type.Array(closedObject({
	kind: Type.Union([
		Type.Literal("durable-profile"),
		Type.Literal("trusted-proxy"),
		Type.Literal("tailscale-whois"),
		Type.Literal("device-proof"),
		Type.Literal("channel-admission"),
		Type.Literal("local-process"),
		Type.Literal("spawn-lineage"),
		Type.Literal("worker-admission"),
		Type.Literal("runtime-binding"),
		Type.Literal("other")
	]),
	rawEvidenceRef: rawRef(),
	strength: Type.Union([
		Type.Literal("self-asserted"),
		Type.Literal("boundary-verified"),
		Type.Literal("cryptographic")
	])
}), { maxItems: EXECUTION_IDENTITY_ADMISSION_MAX_ITEMS });
const ExecutionIdentityAdmissionInvokerSchema = Type.Union([closedObject({
	state: Type.Literal("present"),
	kind: Type.Union([
		Type.Literal("person"),
		Type.Literal("agent"),
		Type.Literal("service"),
		Type.Literal("schedule"),
		Type.Literal("webhook"),
		Type.Literal("system"),
		Type.Literal("local-account"),
		Type.Literal("runtime")
	]),
	rawPrincipalRef: rawRef(),
	displayLabel: Type.Optional(Type.String({ maxLength: 128 }))
}), closedObject({ state: Type.Literal("unknown") })]);
const ExecutionIdentityAdmissionEnvelopeSchema = closedObject({
	envelopeVersion: Type.Literal(1),
	contextId: boundedRef(),
	executionId: boundedRef(),
	runId: boundedRef(),
	createdAt: Type.Integer({ minimum: 0 }),
	runtimeInstanceId: rawRef(),
	agentId: boundedRef(),
	ingress: closedObject({
		kind: ingressKind(),
		boundary: boundedRef(),
		state: evidenceState(),
		rawSourceRef: Type.Optional(rawRef())
	}),
	runtime: closedObject({ kind: runtimeKind() }),
	invoker: Type.Optional(ExecutionIdentityAdmissionInvokerSchema),
	applicableGrants: admissionGrants(),
	assurance: admissionAssurance()
});
const ExecutionIdentityAdmissionFactsSchema = closedObject({
	runId: boundedRef(),
	agentId: boundedRef(),
	ingress: closedObject({
		kind: ingressKind(),
		boundary: boundedRef(),
		state: Type.Optional(evidenceState()),
		rawSourceRef: Type.Optional(rawRef())
	}),
	runtime: closedObject({ kind: runtimeKind() }),
	invoker: Type.Optional(ExecutionIdentityAdmissionInvokerSchema),
	applicableGrants: Type.Optional(admissionGrants()),
	assurance: Type.Optional(admissionAssurance())
});
const ExecutionIdentityAdmissionTokenSchema = closedObject({
	tokenVersion: Type.Literal(1),
	contextId: boundedRef(),
	executionId: boundedRef(),
	runId: boundedRef(),
	createdAt: Type.Integer({ minimum: 0 })
});
let admissionSink;
let admissionFailureWarned = false;
function uniqueSorted(values, key) {
	return [...new Map(values.map((value) => [key(value), value])).values()].toSorted((a, b) => {
		const left = key(a);
		const right = key(b);
		return left < right ? -1 : left > right ? 1 : 0;
	});
}
function freezeEnvelope(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object" || seen.has(value)) return value;
	seen.add(value);
	for (const nested of Object.values(value)) freezeEnvelope(nested, seen);
	return Object.freeze(value);
}
function copyOwnedData(value, ancestors = /* @__PURE__ */ new WeakSet()) {
	if (value === null || [
		"string",
		"number",
		"boolean"
	].includes(typeof value)) return value;
	if (typeof value !== "object" || isProxy(value)) throw new Error("execution identity admission data must be clone-safe plain data");
	if (ancestors.has(value)) throw new Error("execution identity admission data must be clone-safe plain data");
	ancestors.add(value);
	try {
		const prototype = Object.getPrototypeOf(value);
		const keys = Reflect.ownKeys(value);
		const array = Array.isArray(value);
		if (Array.isArray(value)) {
			const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length");
			if (prototype !== Array.prototype || !lengthDescriptor || !("value" in lengthDescriptor) || typeof lengthDescriptor.value !== "number" || keys.length !== lengthDescriptor.value + 1 || keys.at(-1) !== "length") throw new Error("execution identity admission data must be clone-safe plain data");
		} else if (prototype !== Object.prototype && prototype !== null) throw new Error("execution identity admission data must be clone-safe plain data");
		const copy = array ? [] : Object.create(null);
		for (const [index, key] of keys.entries()) {
			if (key === "length" && array) continue;
			if (typeof key !== "string" || array && key !== String(index)) throw new Error("execution identity admission data must be clone-safe plain data");
			const descriptor = Object.getOwnPropertyDescriptor(value, key);
			if (!descriptor?.enumerable || !("value" in descriptor)) throw new Error("execution identity admission data must be clone-safe plain data");
			Object.defineProperty(copy, key, {
				configurable: true,
				enumerable: true,
				value: copyOwnedData(descriptor.value, ancestors),
				writable: true
			});
		}
		return copy;
	} finally {
		ancestors.delete(value);
	}
}
function validateEnvelope(value) {
	const owned = copyOwnedData(value);
	if (!Value.Check(ExecutionIdentityAdmissionEnvelopeSchema, owned) || !Number.isSafeInteger(owned.createdAt)) throw new Error("execution identity admission envelope violates its bounded contract");
	const encoded = JSON.stringify(owned);
	if (Buffer.byteLength(encoded, "utf8") > EXECUTION_IDENTITY_ADMISSION_MAX_BYTES) throw new Error("execution identity admission envelope exceeds 16 KiB");
	return owned;
}
function validateFacts(value) {
	const owned = copyOwnedData(value);
	if (!Value.Check(ExecutionIdentityAdmissionFactsSchema, owned)) throw new Error("execution identity admission facts violate their bounded contract");
	return owned;
}
function validateToken(value) {
	const owned = copyOwnedData(value);
	if (!Value.Check(ExecutionIdentityAdmissionTokenSchema, owned) || !Number.isSafeInteger(owned.createdAt)) throw new Error("execution identity admission token violates its bounded contract");
	return owned;
}
/** Allocate the immutable correlation owned by one outer admitted turn. */
function createExecutionIdentityAdmissionToken(runId, options = {}) {
	return freezeEnvelope(validateToken({
		tokenVersion: 1,
		contextId: options.contextId ?? randomUUID(),
		executionId: options.executionId ?? randomUUID(),
		runId,
		createdAt: options.now ?? Date.now()
	}));
}
function parseExecutionIdentityAdmissionToken(value) {
	return freezeEnvelope(validateToken(value));
}
function redactDisplayLabel(value) {
	return truncateUtf16Safe(redactSensitiveText(redactSensitiveText(value, { mode: "tools" }), { mode: "tools" }), 128);
}
/** Capture owned admission facts without touching filesystem or database state. */
function captureExecutionIdentityAdmissionEnvelope(facts, options) {
	const ownedToken = validateToken(options.token);
	if (ownedToken.runId !== facts.runId) throw new Error("execution identity admission token disagrees with the admitted run");
	const runtimeInstanceId = options.runtimeInstanceId ?? PROCESS_RUNTIME_INSTANCE_ID;
	const assurance = facts.assurance ?? [{
		kind: "runtime-binding",
		rawEvidenceRef: runtimeInstanceId,
		strength: "boundary-verified"
	}];
	return freezeEnvelope(validateEnvelope({
		envelopeVersion: 1,
		contextId: ownedToken.contextId,
		executionId: ownedToken.executionId,
		runId: ownedToken.runId,
		createdAt: ownedToken.createdAt,
		runtimeInstanceId,
		agentId: facts.agentId,
		ingress: {
			...facts.ingress,
			state: facts.ingress.state ?? "present"
		},
		runtime: { ...facts.runtime },
		...facts.invoker?.state === "present" ? { invoker: {
			state: "present",
			kind: facts.invoker.kind,
			rawPrincipalRef: facts.invoker.rawPrincipalRef,
			...facts.invoker.displayLabel !== void 0 ? { displayLabel: redactDisplayLabel(facts.invoker.displayLabel) } : {}
		} } : facts.invoker?.state === "unknown" ? { invoker: { state: "unknown" } } : {},
		applicableGrants: uniqueSorted(facts.applicableGrants ?? [], (grant) => `${grant.rawGrantRef}\0${grant.state}`).map((grant) => ({
			rawGrantRef: grant.rawGrantRef,
			state: grant.state
		})),
		assurance: uniqueSorted(assurance, (item) => `${item.kind}\0${item.rawEvidenceRef}\0${item.strength}`).map((item) => ({
			kind: item.kind,
			rawEvidenceRef: item.rawEvidenceRef,
			strength: item.strength
		}))
	}));
}
/** Revalidate a structured-cloned worker message before any persistence work. */
function parseExecutionIdentityAdmissionEnvelope(value) {
	const envelope = validateEnvelope(value);
	const parsed = captureExecutionIdentityAdmissionEnvelope(envelope, {
		token: createExecutionIdentityAdmissionToken(envelope.runId, {
			contextId: envelope.contextId,
			executionId: envelope.executionId,
			now: envelope.createdAt
		}),
		runtimeInstanceId: envelope.runtimeInstanceId
	});
	if (JSON.stringify(parsed) !== JSON.stringify(envelope)) throw new Error("execution identity admission envelope is not canonical");
	return parsed;
}
/** Revalidate either bounded worker message before schema, key, or database work. */
function parseExecutionIdentityAdmissionWork(value) {
	const owned = copyOwnedData(value);
	if (!owned || typeof owned !== "object") throw new Error("execution identity admission work violates its bounded contract");
	const work = owned;
	if (work.kind === "capture") return freezeEnvelope({
		kind: "capture",
		envelope: parseExecutionIdentityAdmissionEnvelope(work.envelope)
	});
	if (work.kind === "retry-reference") return freezeEnvelope({
		kind: "retry-reference",
		token: parseExecutionIdentityAdmissionToken(work.token)
	});
	throw new Error("execution identity admission work violates its bounded contract");
}
/** Install the current process lifecycle's writer without creating a second queue. */
function configureExecutionIdentityAdmissionSink(sink) {
	admissionSink = sink;
	return () => {
		if (admissionSink === sink) admissionSink = void 0;
	};
}
function hasExecutionIdentityAdmissionSink() {
	return admissionSink !== void 0;
}
/**
* Capture and enqueue evidence. The returned ID is only a candidate until async persistence wins.
*/
function enqueueExecutionIdentityContextAtAdmission(facts, options) {
	if (!options.enabled) return;
	try {
		const ownedFacts = validateFacts(facts);
		const token = validateToken(options.token ?? createExecutionIdentityAdmissionToken(ownedFacts.runId, {
			contextId: options.contextId,
			executionId: options.executionId,
			now: options.now
		}));
		const work = options.retryOnly ? {
			kind: "retry-reference",
			token
		} : {
			kind: "capture",
			envelope: captureExecutionIdentityAdmissionEnvelope(ownedFacts, {
				token,
				runtimeInstanceId: options.runtimeInstanceId
			})
		};
		if (!admissionSink) throw new Error("audit writer unavailable");
		return {
			candidateContextId: token.contextId,
			candidateExecutionId: token.executionId,
			accepted: admissionSink(work)
		};
	} catch {
		if (!admissionFailureWarned) {
			admissionFailureWarned = true;
			log.warn("audit execution identity admission evidence was not queued; continuing without it");
		}
		return;
	}
}
//#endregion
export { parseExecutionIdentityAdmissionEnvelope as a, hasExecutionIdentityAdmissionSink as i, createExecutionIdentityAdmissionToken as n, parseExecutionIdentityAdmissionToken as o, enqueueExecutionIdentityContextAtAdmission as r, parseExecutionIdentityAdmissionWork as s, configureExecutionIdentityAdmissionSink as t };
