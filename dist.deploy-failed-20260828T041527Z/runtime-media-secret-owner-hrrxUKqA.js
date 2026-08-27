import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-D5EZZ925.js";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.js";
//#region src/media-understanding/entry-capabilities.ts
const MEDIA_CAPABILITIES = [
	"audio",
	"image",
	"video"
];
function isMediaCapability(value) {
	return typeof value === "string" && MEDIA_CAPABILITIES.includes(value);
}
function resolveEntryType(entry) {
	return entry.type ?? (entry.command ? "cli" : "provider");
}
/** Returns valid explicit capability tags from a media model entry. */
function resolveConfiguredMediaEntryCapabilities(entry) {
	if (!Array.isArray(entry.capabilities)) return;
	const capabilities = entry.capabilities.filter(isMediaCapability);
	return capabilities.length > 0 ? capabilities : void 0;
}
/** Resolves the capability set for an entry, inferring shared provider entries from metadata. */
function resolveEffectiveMediaEntryCapabilities(params) {
	const configured = resolveConfiguredMediaEntryCapabilities(params.entry);
	if (configured) return configured;
	if (params.source !== "shared") return;
	if (resolveEntryType(params.entry) === "cli") return;
	const providerId = normalizeMediaProviderId(params.entry.provider ?? "");
	if (!providerId) return;
	return params.providerRegistry.get(providerId)?.capabilities;
}
/** Tests whether an entry should be considered for a requested media capability. */
function matchesMediaEntryCapability(params) {
	const capabilities = resolveEffectiveMediaEntryCapabilities(params);
	if (!capabilities || capabilities.length === 0) return params.source === "capability";
	return capabilities.includes(params.capability);
}
//#endregion
//#region src/secrets/runtime-media-secret-owner.ts
/** Runtime owner for one configured media-understanding model entry. */
function runtimeMediaModelSecretOwnerId(params) {
	return params.source === "shared" ? `media-model:shared:${params.index}` : `media-model:${params.capability}:${params.index}`;
}
/** Runtime owner for request defaults inherited by one media capability. */
function runtimeMediaRequestSecretOwnerId(capability) {
	return `media-model:${capability}:request`;
}
function modelRequestOverridesPath(entry, path) {
	const request = entry.request;
	const requestPath = path.split(".request.")[1];
	if (!request || !requestPath) return false;
	if (requestPath.startsWith("auth.")) return request.auth !== void 0;
	if (requestPath.startsWith("tls.")) return request.tls !== void 0;
	if (requestPath.startsWith("proxy.")) return request.proxy !== void 0;
	const headerName = requestPath.startsWith("headers.") ? requestPath.slice(8).toLowerCase() : void 0;
	return Boolean(headerName && Object.keys(request.headers ?? {}).some((key) => key.toLowerCase() === headerName));
}
/** Rejects a cold capability request only when the model still inherits its failed field. */
function assertRuntimeMediaRequestSecretOwnerAvailable(params) {
	const owner = findActiveDegradedSecretOwner("capability", runtimeMediaRequestSecretOwnerId(params.capability));
	if (owner && owner.paths.some((path) => !modelRequestOverridesPath(params.entry, path))) throw new SecretSurfaceUnavailableError(owner);
}
//#endregion
export { resolveConfiguredMediaEntryCapabilities as a, matchesMediaEntryCapability as i, runtimeMediaModelSecretOwnerId as n, resolveEffectiveMediaEntryCapabilities as o, runtimeMediaRequestSecretOwnerId as r, assertRuntimeMediaRequestSecretOwnerAvailable as t };
