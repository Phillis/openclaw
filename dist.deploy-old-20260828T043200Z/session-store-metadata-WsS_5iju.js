import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { d as sessionDeliveryOrigin, n as deliveryContextFromSession } from "./delivery-context.shared-azPdmUls.js";
import "./session-store-runtime-BNwfvw44.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { a as resolveMatrixDirectUserId, o as resolveMatrixTargetIdentity } from "./target-ids-DEUqtLsd.js";
//#region extensions/matrix/src/matrix/session-store-metadata.ts
function resolveMatrixRoomTargetId(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const target = resolveMatrixTargetIdentity(trimmed);
	return target?.kind === "room" && target.id.startsWith("!") ? target.id : void 0;
}
function resolveMatrixSessionAccountId(value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? normalizeAccountId(trimmed) : void 0;
}
function resolveMatrixStoredRoomId(params) {
	return resolveMatrixRoomTargetId(params.deliveryTo) ?? resolveMatrixRoomTargetId(params.originNativeChannelId) ?? resolveMatrixRoomTargetId(params.originTo);
}
function resolveMatrixStoredSessionMeta(entry) {
	if (!entry) return null;
	const deliveryContext = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	const channel = normalizeOptionalString(deliveryContext?.channel) ?? normalizeOptionalString(origin?.provider);
	const accountId = resolveMatrixSessionAccountId(deliveryContext?.accountId ?? origin?.accountId) ?? void 0;
	const roomId = resolveMatrixStoredRoomId({
		deliveryTo: deliveryContext?.to,
		originNativeChannelId: origin?.nativeChannelId,
		originTo: origin?.to
	});
	const chatType = normalizeOptionalString(origin?.chatType) ?? normalizeOptionalString(entry.chatType);
	const directUserId = chatType === "direct" ? normalizeOptionalString(origin?.nativeDirectUserId) ?? resolveMatrixDirectUserId({
		from: normalizeOptionalString(origin?.from),
		to: (roomId ? `room:${roomId}` : void 0) ?? normalizeOptionalString(deliveryContext?.to) ?? normalizeOptionalString(origin?.to),
		chatType
	}) : void 0;
	if (!channel && !accountId && !roomId && !directUserId) return null;
	return {
		...channel ? { channel } : {},
		...accountId ? { accountId } : {},
		...roomId ? { roomId } : {},
		...directUserId ? { directUserId } : {}
	};
}
//#endregion
export { resolveMatrixStoredSessionMeta as t };
