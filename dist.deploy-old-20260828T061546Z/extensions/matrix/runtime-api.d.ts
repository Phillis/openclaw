import { J as ssrfPolicyFromDangerouslyAllowPrivateNetwork, m as PluginRuntime, q as assertHttpUrlTargetsPrivateNetwork, s as writeJsonFileAtomically, vt as RuntimeLogger } from "../../plugin-entry-DyrRrRy2.js";
import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
import { k as RuntimeEnv } from "../../manifest-registry-DdCvbEOK.js";
import { G as ChannelDirectoryEntry, Y as ChannelMessageActionContext } from "../../types.adapters-DVrIc5zd.js";
import { r as WizardPrompter } from "../../setup-wizard-types-BFO9MBX3.js";
import { a as createPinnedDispatcher, i as closeDispatcher, o as resolvePinnedHostnameWithPolicy, r as SsrFPolicy, t as LookupFn } from "../../ssrf-Ck7fh8Hg.js";
import "../../channel-contract-gwjjjQO_.js";
import "../../setup-Cg_c54xI.js";
import { a as resolveMatrixCredentialsPath, c as getMatrixScopedEnvVarNames, d as findMatrixAccountEntry, f as requiresExplicitMatrixDefaultAccount, h as resolveMatrixDefaultOrOnlyAccountId, i as resolveMatrixCredentialsFilename, l as listMatrixEnvAccountIds, m as resolveMatrixChannelConfig, n as resolveMatrixAccountStorageRoot, o as resolveMatrixHomeserverKey, p as resolveConfiguredMatrixAccountIds, r as resolveMatrixCredentialsDir, s as sanitizeMatrixPathSegment, t as hashMatrixAccessToken, u as resolveMatrixEnvAccountToken } from "../../storage-paths-CKpnSpjE.js";
import { i as setMatrixThreadBindingMaxAgeBySessionKey, r as setMatrixThreadBindingIdleTimeoutBySessionKey } from "../../thread-bindings-shared-BjDZcxPp.js";
import "../../runtime-vfwkTnFP.js";
import { t as setMatrixRuntime } from "../../runtime-BC30TaqO.js";
import "../../runtime-env-DCgw_M5Q.js";
//#region src/infra/format-time/format-datetime.d.ts
type FormatTimestampOptions = {
  /** Include seconds in the output. Default: false */
  displaySeconds?: boolean;
};
type FormatZonedTimestampOptions = FormatTimestampOptions & {
  /** IANA timezone string (e.g., 'America/New_York'). Default: system timezone */
  timeZone?: string;
};
/**
 * Format a Date with timezone display using Intl.DateTimeFormat.
 *
 * Without seconds: `2024-01-15 14:30 EST`
 * With seconds:    `2024-01-15 14:30:05 EST`
 *
 * Returns undefined if Intl formatting fails.
 */
declare function formatZonedTimestamp(date: Date, options?: FormatZonedTimestampOptions): string | undefined;
//#endregion
//#region extensions/matrix/src/auth-precedence.d.ts
type MatrixResolvedStringField = "homeserver" | "userId" | "accessToken" | "password" | "deviceId" | "deviceName";
type MatrixResolvedStringValues = Record<MatrixResolvedStringField, string>;
type MatrixStringSourceMap = Partial<Record<MatrixResolvedStringField, string>>;
declare function resolveMatrixAccountStringValues(params: {
  accountId: string;
  account?: MatrixStringSourceMap;
  scopedEnv?: MatrixStringSourceMap;
  channel?: MatrixStringSourceMap;
  globalEnv?: MatrixStringSourceMap;
}): MatrixResolvedStringValues;
//#endregion
//#region extensions/matrix/src/matrix/deps.d.ts
declare function isMatrixSdkAvailable(): boolean;
declare function ensureMatrixSdkInstalled(params?: {
  runtime?: RuntimeEnv;
  confirm?: (message: string) => Promise<boolean>;
  resolveFn?: (id: string) => string;
}): Promise<void>;
//#endregion
//#region extensions/matrix/runtime-api.d.ts
declare function chunkTextForOutbound(text: string, limit: number): string[];
//#endregion
export { type ChannelDirectoryEntry, type ChannelMessageActionContext, type LookupFn, type MatrixResolvedStringField, type MatrixResolvedStringValues, type OpenClawConfig, type PluginRuntime, type RuntimeEnv, type RuntimeLogger, type SsrFPolicy, type WizardPrompter, assertHttpUrlTargetsPrivateNetwork, chunkTextForOutbound, closeDispatcher, createPinnedDispatcher, ensureMatrixSdkInstalled, findMatrixAccountEntry, formatZonedTimestamp, getMatrixScopedEnvVarNames, hashMatrixAccessToken, isMatrixSdkAvailable, listMatrixEnvAccountIds, requiresExplicitMatrixDefaultAccount, resolveConfiguredMatrixAccountIds, resolveMatrixAccountStorageRoot, resolveMatrixAccountStringValues, resolveMatrixChannelConfig, resolveMatrixCredentialsDir, resolveMatrixCredentialsFilename, resolveMatrixCredentialsPath, resolveMatrixDefaultOrOnlyAccountId, resolveMatrixEnvAccountToken, resolveMatrixHomeserverKey, resolvePinnedHostnameWithPolicy, sanitizeMatrixPathSegment, setMatrixRuntime, setMatrixThreadBindingIdleTimeoutBySessionKey, setMatrixThreadBindingMaxAgeBySessionKey, ssrfPolicyFromDangerouslyAllowPrivateNetwork, writeJsonFileAtomically };