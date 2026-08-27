import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { d as sessionDeliveryOrigin, n as deliveryContextFromSession } from "./delivery-context.shared-B3qeEQhR.js";
import "./session-store-runtime-De3jWY_Z.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as resolveMatrixTargetIdentity, i as resolveMatrixDirectUserId } from "./target-ids-g6UnQdM7.js";
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
