import { t as resolveContextEngine } from "./registry-mpmusNwH.js";

//#region src/context-engine/init.d.ts
/**
 * Ensures all built-in context engines are registered in the active registry.
 *
 * The legacy engine is always registered as a safe fallback so that
 * `resolveContextEngine()` can resolve the default "legacy" slot without
 * callers needing to remember manual registration.
 *
 * Additional engines are registered by their own plugins via
 * `api.registerContextEngine()` during plugin load.
 */
declare function ensureContextEnginesInitialized(): void;
//#endregion
export { ensureContextEnginesInitialized, resolveContextEngine };