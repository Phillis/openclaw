import { o as SecretRef, s as SecretRefSource } from "./types.secrets-BrR1WS-r.js";
//#region src/secrets/ref-contract.d.ts
/** Minimal config shape needed to resolve default provider aliases for a secret source. */
type SecretRefDefaultsCarrier = {
  /** Secrets config subset; callers pass full config objects or narrow test doubles. */
  secrets?: {
    /** Explicit per-source provider aliases selected by the operator. */
    defaults?: {
      /** Default provider alias for environment-variable secret refs. */
      env?: string;
      /** Default provider alias for file-backed secret refs. */
      file?: string;
      /** Default provider alias for exec-backed secret refs. */
      exec?: string;
      /** Default provider alias for shared-store secret refs. */
      store?: string;
    };
    /** Provider declarations used only when callers ask to prefer the first matching source. */
    providers?: Record<string, {
      source?: string;
    }>;
  };
};
/** Resolves the default provider alias for one source, falling back to the built-in alias. */
declare function resolveDefaultSecretProviderAlias(config: SecretRefDefaultsCarrier, source: SecretRefSource, options?: {
  preferFirstProviderForSource?: boolean;
}): string;
/** Validates a complete SecretRef against the shared provider/source/id grammar. */
declare function isValidSecretRef(ref: SecretRef): boolean;
//#endregion
//#region src/utils/normalize-secret-input.d.ts
/**
 * Secret normalization for copy/pasted credentials.
 *
 * Common footgun: line breaks (especially `\r`) embedded in API keys/tokens.
 * We strip line breaks anywhere, then trim whitespace at the ends.
 *
 * Another frequent source of runtime failures is rich-text/Unicode artifacts
 * (smart punctuation, box-drawing chars, etc.) pasted into API keys. These can
 * break HTTP header construction (`ByteString` violations). Drop non-Latin1
 * code points so malformed keys fail as auth errors instead of crashing request
 * setup.
 *
 * Intentionally does NOT remove ordinary spaces inside the string to avoid
 * silently altering "Bearer <token>" style values.
 */
/**
 * Normalizes a raw secret value from config, env, setup prompts, or plugin SDK callers.
 * Returns an empty string for absent/invalid input so callers can keep boolean presence checks simple.
 */
declare function normalizeSecretInput(value: unknown): string;
/**
 * Normalizes a raw secret value and converts empty normalized output to `undefined`.
 * Use this at optional config boundaries where "not configured" is clearer than an empty string.
 */
declare function normalizeOptionalSecretInput(value: unknown): string | undefined;
//#endregion
export { resolveDefaultSecretProviderAlias as i, normalizeSecretInput as n, isValidSecretRef as r, normalizeOptionalSecretInput as t };