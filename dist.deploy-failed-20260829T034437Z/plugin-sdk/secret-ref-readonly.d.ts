import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import "../config-C5ZMVTaL.js";
//#region src/plugin-sdk/secret-ref-readonly.internal.d.ts
/** Checks whether a read-only plugin path may resolve a secret through an env provider. */
declare function canResolveEnvSecretRefInReadOnlyPath(params: {
  cfg?: OpenClawConfig;
  provider: string;
  id: string;
}): boolean;
//#endregion
//#region src/plugin-sdk/secret-ref-readonly.d.ts
type ReadOnlyEnvSecretRefResolution = {
  status: "available";
  value: string;
} | {
  status: "missing";
} | {
  status: "blocked";
};
/** Resolve one configured secret without letting blocked refs borrow ambient credentials. */
declare function resolveReadOnlyEnvSecretRef(params: {
  value: unknown;
  path: string;
  cfg?: OpenClawConfig;
  expectedEnvId: string;
  normalizeValue: (value: unknown) => string | undefined;
}): ReadOnlyEnvSecretRefResolution;
//#endregion
export { ReadOnlyEnvSecretRefResolution, canResolveEnvSecretRefInReadOnlyPath, resolveReadOnlyEnvSecretRef };