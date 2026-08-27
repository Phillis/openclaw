import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
//#region src/infra/outbound/message-action-param-keys.ts
const STANDARD_MESSAGE_ACTION_PARAM_KEYS = /* @__PURE__ */ new Set([
	"accountId",
	"action",
	"asDocument",
	"attachments",
	"base64",
	"bestEffort",
	"buffer",
	"caption",
	"channel",
	"channelId",
	"contentType",
	"delivery",
	"dryRun",
	"filePath",
	"fileUrl",
	"filename",
	"forceDocument",
	"gifPlayback",
	"gatewayToken",
	"gatewayUrl",
	"image",
	"idempotencyKey",
	"interactive",
	"json",
	"media",
	"mediaUrl",
	"mediaUrls",
	"media_urls",
	"message",
	"mimeType",
	"path",
	"pollAnonymous",
	"pollDurationHours",
	"pollMulti",
	"pollOption",
	"pollPublic",
	"pollQuestion",
	"pin",
	"presentation",
	"replyTo",
	"silent",
	"senderIsOwner",
	"target",
	"targets",
	"text",
	"threadId",
	"timeoutMs",
	"topLevel",
	"to"
]);
/**
* Detects non-standard message action params that may need plugin-owned handling.
*/
function hasPotentialPluginActionParam(params) {
	return Object.entries(params).some(([key, value]) => {
		if (STANDARD_MESSAGE_ACTION_PARAM_KEYS.has(key)) return false;
		if (typeof value === "string") return Boolean(normalizeOptionalString(value));
		if (typeof value === "number") return Number.isFinite(value);
		return value !== void 0;
	});
}
//#endregion
export { hasPotentialPluginActionParam as t };
