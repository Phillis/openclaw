import { J as ssrfPolicyFromDangerouslyAllowPrivateNetwork, gt as RuntimeLogger, m as PluginRuntime, q as assertHttpUrlTargetsPrivateNetwork, s as writeJsonFileAtomically } from "../../plugin-entry-Bvo-51M-.js";
import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-contracts-DBboNIpX.js";
import { k as RuntimeEnv } from "../../manifest-registry-BJhqwERh.js";
import { G as ChannelDirectoryEntry, Y as ChannelMessageActionContext } from "../../types.adapters-UsYT95C9.js";
import { r as WizardPrompter } from "../../setup-wizard-types-CTl56MML.js";
import { a as createPinnedDispatcher, i as closeDispatcher, o as resolvePinnedHostnameWithPolicy, r as SsrFPolicy, t as LookupFn } from "../../ssrf-Ck7fh8Hg.js";
import "../../channel-contract-BTByoES9.js";
import "../../setup-D8bin8hp.js";
import { a as resolveMatrixCredentialsPath, c as getMatrixScopedEnvVarNames, d as findMatrixAccountEntry, f as requiresExplicitMatrixDefaultAccount, h as resolveMatrixDefaultOrOnlyAccountId, i as resolveMatrixCredentialsFilename, l as listMatrixEnvAccountIds, m as resolveMatrixChannelConfig, n as resolveMatrixAccountStorageRoot, o as resolveMatrixHomeserverKey, p as resolveConfiguredMatrixAccountIds, r as resolveMatrixCredentialsDir, s as sanitizeMatrixPathSegment, t as hashMatrixAccessToken, u as resolveMatrixEnvAccountToken } from "../../storage-paths-CX2UYn1B.js";
import { i as setMatrixThreadBindingMaxAgeBySessionKey, r as setMatrixThreadBindingIdleTimeoutBySessionKey } from "../../thread-bindings-shared-BjDZcxPp.js";
import "../../runtime-CippcftS.js";
import { t as setMatrixRuntime } from "../../runtime-Bjz2SDUq.js";
import "../../runtime-env-C1EXUSSN.js";
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