import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { d as sessionDeliveryOrigin } from "./delivery-context.shared-azPdmUls.js";
import { u as readMediaBuffer } from "./store-B6ILpvye.js";
import { o as resolveInboundMediaReference } from "./media-reference-Q4z-WfN-.js";
import { a as parseControlUiResourcePath } from "./control-ui-contract-CgrOMhfo.js";
import { r as authorizeControlUiSessionOwnerReadRequestOrReply } from "./http-auth-utils-CrQlRW6b.js";
import { c as sendMethodNotAllowed, v as respondNotFound } from "./http-common-m4pDgMA2.js";
import "./http-utils-BKAf5kRa.js";
import { i as sendHttpImageResponse, r as resolveHttpImageRepresentation, t as HTTP_IMAGE_MAX_BYTES } from "./http-image-response-D9tBiCjy.js";
//#region src/gateway/channel-avatar-http.ts
const CHANNEL_AVATAR_CACHE_MAX_ENTRIES = 128;
const channelAvatarIndex = /* @__PURE__ */ new Map();
const channelAvatarBytes = /* @__PURE__ */ new Map();
const getSessionStoreModule = createLazyRuntimeModule(() => import("./session-utils-store-_7pL_Fgh.js"));
function touchChannelAvatarCache(sessionKey, reference) {
	const indexed = channelAvatarIndex.get(sessionKey);
	if (!indexed || indexed.reference !== reference) return;
	const image = channelAvatarBytes.get(indexed.imageKey);
	if (!image) {
		channelAvatarIndex.delete(sessionKey);
		return;
	}
	channelAvatarIndex.delete(sessionKey);
	channelAvatarIndex.set(sessionKey, indexed);
	channelAvatarBytes.delete(indexed.imageKey);
	channelAvatarBytes.set(indexed.imageKey, image);
	return image;
}
async function loadChannelAvatar(sessionKey, reference) {
	const cached = touchChannelAvatarCache(sessionKey, reference);
	if (cached) return cached;
	const resolved = await resolveInboundMediaReference(reference);
	if (!resolved) return;
	const stored = await readMediaBuffer(resolved.id, "inbound", HTTP_IMAGE_MAX_BYTES);
	const image = await resolveHttpImageRepresentation(resolved.id, stored.buffer);
	if (!image) return;
	const imageKey = `${sessionKey}\0${image.etag}`;
	channelAvatarBytes.set(imageKey, image);
	channelAvatarIndex.set(sessionKey, {
		reference,
		imageKey
	});
	pruneMapToMaxSize(channelAvatarBytes, CHANNEL_AVATAR_CACHE_MAX_ENTRIES);
	pruneMapToMaxSize(channelAvatarIndex, CHANNEL_AVATAR_CACHE_MAX_ENTRIES);
	return image;
}
/** Serves the current channel-avatar snapshot for an owner-visible session. */
async function handleChannelAvatarHttpRequest(req, res, opts) {
	const parsed = parseControlUiResourcePath("channelAvatar", req.url ? new URL(req.url, "http://localhost").pathname : void 0, opts.basePath);
	if (!parsed.matched) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	if (!await authorizeControlUiSessionOwnerReadRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	})) return true;
	if (!parsed.value) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	let reference;
	try {
		const { entry } = (await getSessionStoreModule()).loadGatewaySessionEntryReadOnly(parsed.value, { clone: false });
		reference = sessionDeliveryOrigin(entry)?.avatar;
	} catch {}
	if (!reference) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	let image;
	try {
		image = await loadChannelAvatar(parsed.value, reference);
	} catch {}
	if (!image) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	sendHttpImageResponse({
		req,
		res,
		image,
		filename: "channel-avatar"
	});
	return true;
}
//#endregion
export { handleChannelAvatarHttpRequest };
