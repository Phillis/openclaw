import { i as OpenClawConfig } from "./types.openclaw-ClnaeuRs.js";
import "./types-Db5QLc7j.js";
import { lt as ContextEngine } from "./types-Hf0Z4d9b.js";
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
//#region src/context-engine/registry.d.ts
/**
 * Options for {@link resolveContextEngine}.
 */
type ResolveContextEngineOptions = {
  agentDir?: string;
  workspaceDir?: string;
};
/**
 * Resolve which ContextEngine to use based on plugin slot configuration.
 *
 * Resolution order:
 *   1. `config.plugins.slots.contextEngine` (explicit slot override)
 *   2. Default slot value ("legacy")
 *
 * When `config` is provided it is forwarded to the factory as part of a
 * {@link ContextEngineFactoryContext}. Additional runtime paths can be
 * supplied via `options`. Existing no-arg factories continue to work
 * because JavaScript permits extra arguments at call sites.
 *
 * Non-default engines that fail (unregistered, factory throw, or contract
 * violation) are logged and silently replaced by the default engine.
 * Throws only when the default engine itself cannot be resolved.
 */
declare function resolveContextEngine(config?: OpenClawConfig, options?: ResolveContextEngineOptions): Promise<ContextEngine>;
//#endregion
export { ensureContextEnginesInitialized, resolveContextEngine };