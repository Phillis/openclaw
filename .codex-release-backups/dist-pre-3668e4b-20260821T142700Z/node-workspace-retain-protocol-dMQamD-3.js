import { At as boolean, Et as array, Rn as string, Tn as object, dn as literal, wn as number } from "./schemas-C7gqXY2T.js";
//#region src/worker/node-workspace-retain-protocol.ts
const REQUEST_MAX_BYTES = 1024 * 1024;
const RETAIN_MAX_ENTRIES = 4096;
const MANIFEST_REFS_MAX_ENTRIES = 32;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const BoundedIdentifierSchema = string().min(1).max(256).refine((value) => value.trim() === value && !value.includes("\0"));
const ManifestRefsSchema = array(string().regex(MANIFEST_REF_PATTERN)).max(MANIFEST_REFS_MAX_ENTRIES).superRefine((refs, context) => {
	if (new Set(refs).size !== refs.length) context.addIssue({
		code: "custom",
		message: "manifestRefs must not contain duplicates"
	});
}).transform((refs) => refs.toSorted()).nullable();
const RetainEntrySchema = object({
	environmentId: BoundedIdentifierSchema,
	sessionId: BoundedIdentifierSchema,
	generation: number().int().min(1).max(Number.MAX_SAFE_INTEGER),
	manifestRefs: ManifestRefsSchema
}).strict();
const RetainInputSchema = object({
	version: literal(1),
	gatewayNamespace: BoundedIdentifierSchema.regex(GATEWAY_NAMESPACE_PATTERN),
	controllerId: BoundedIdentifierSchema.max(128),
	sequence: number().int().min(1).max(Number.MAX_SAFE_INTEGER),
	retain: array(RetainEntrySchema).max(RETAIN_MAX_ENTRIES)
}).strict();
const RetainResultSchema = object({
	applied: boolean(),
	deleted: number().int().min(0).max(Number.MAX_SAFE_INTEGER),
	hasMore: boolean()
}).strict();
function parseNodeWorkerWorkspaceRetainInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker workspace retain request");
	try {
		const parsed = RetainInputSchema.parse(JSON.parse(raw));
		const keys = /* @__PURE__ */ new Set();
		for (const entry of parsed.retain) {
			const key = `${entry.environmentId}\0${entry.sessionId}\0${entry.generation}`;
			if (keys.has(key)) throw new Error("workspace retain entries must be unique");
			keys.add(key);
		}
		parsed.retain.sort((left, right) => left.environmentId.localeCompare(right.environmentId) || left.sessionId.localeCompare(right.sessionId) || left.generation - right.generation);
		return parsed;
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`INVALID_REQUEST: invalid node worker workspace retain request: ${detail}`, { cause: error });
	}
}
function parseNodeWorkerWorkspaceRetainResult(value) {
	return RetainResultSchema.safeParse(value).data ?? null;
}
//#endregion
export { parseNodeWorkerWorkspaceRetainResult as n, parseNodeWorkerWorkspaceRetainInput as t };
