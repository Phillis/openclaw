import type { OpenClawConfig } from "../../config/types.openclaw.js";

// Reply completeness is process-local metadata. Keep it off config objects so
// frozen runtime snapshots and identity-keyed caches remain valid.
const replyConfigRuntimeModes = new WeakMap<OpenClawConfig, "fast" | "full" | "published">();

export function markReplyConfigRuntimeMode<T extends OpenClawConfig>(
  config: T,
  runtimeMode: "fast" | "full" | "published",
): T {
  const existingMode = replyConfigRuntimeModes.get(config);
  if (existingMode !== undefined && existingMode !== runtimeMode) {
    // Runtime mode belongs to one reply admission, while Gateway config snapshots are shared
    // across concurrent channel turns. Never let an exact/full caller downgrade a published turn
    // (or vice versa) by mutating metadata attached to the shared object.
    const isolatedConfig = { ...config } as T;
    replyConfigRuntimeModes.set(isolatedConfig, runtimeMode);
    return isolatedConfig;
  }
  replyConfigRuntimeModes.set(config, runtimeMode);
  return config;
}

export function isCompleteReplyConfig(config: unknown): config is OpenClawConfig {
  return Boolean(
    config && typeof config === "object" && replyConfigRuntimeModes.has(config as OpenClawConfig),
  );
}

export function usesFullReplyRuntime(config: unknown): boolean {
  if (!config || typeof config !== "object") {
    return false;
  }
  const mode = replyConfigRuntimeModes.get(config as OpenClawConfig);
  return mode === "full" || mode === "published";
}

export function usesPublishedReplyRuntime(config: unknown): boolean {
  return Boolean(
    config &&
    typeof config === "object" &&
    replyConfigRuntimeModes.get(config as OpenClawConfig) === "published",
  );
}
