import { X as GatewayRequestHandlerOptions, r as OpenClawPluginApi } from "../../types-Ci1t4mxf.js";
import { a as SessionEntry } from "../../types-CkKOeDuP.js";
import { a as isBlockedHostnameOrIp } from "../../ssrf-CX7egwMk.js";
import { i as sleep, n as readRequestBodyWithLimit, r as requestBodyErrorToText, t as isRequestBodyLimitError } from "../../runtime-api-DLNotOjq.js";
import { o as fetchWithSsrFGuard } from "../../provider-request-config-B3PbEfcF.js";
import { t as definePluginEntry } from "../../plugin-entry-bTQC2ETl.js";
import { i as TtsProviderSchema, n as TtsConfigSchema, r as TtsModeSchema, t as TtsAutoSchema } from "../../zod-schema.core-mhl-S05F.js";
export { type GatewayRequestHandlerOptions, type OpenClawPluginApi, type SessionEntry, TtsAutoSchema, TtsConfigSchema, TtsModeSchema, TtsProviderSchema, definePluginEntry, fetchWithSsrFGuard, isBlockedHostnameOrIp, isRequestBodyLimitError, readRequestBodyWithLimit, requestBodyErrorToText, sleep };