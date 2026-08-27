import { X as GatewayRequestHandlerOptions, r as OpenClawPluginApi } from "../../types-BC3VLVBd.js";
import { a as SessionEntry } from "../../types-kBzibTqd.js";
import { a as isBlockedHostnameOrIp } from "../../ssrf-CX7egwMk.js";
import { i as sleep, n as readRequestBodyWithLimit, r as requestBodyErrorToText, t as isRequestBodyLimitError } from "../../runtime-api-DLNotOjq.js";
import { o as fetchWithSsrFGuard } from "../../provider-request-config-B7W6uKKc.js";
import { t as definePluginEntry } from "../../plugin-entry-CV_XUPkc.js";
import { i as TtsProviderSchema, n as TtsConfigSchema, r as TtsModeSchema, t as TtsAutoSchema } from "../../zod-schema.core-mhl-S05F.js";
export { type GatewayRequestHandlerOptions, type OpenClawPluginApi, type SessionEntry, TtsAutoSchema, TtsConfigSchema, TtsModeSchema, TtsProviderSchema, definePluginEntry, fetchWithSsrFGuard, isBlockedHostnameOrIp, isRequestBodyLimitError, readRequestBodyWithLimit, requestBodyErrorToText, sleep };