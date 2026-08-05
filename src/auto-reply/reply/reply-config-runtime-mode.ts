import type { OpenClawConfig } from "../../config/types.openclaw.js";

// Reply completeness is process-local metadata. Keep it off config objects so
// frozen runtime snapshots and identity-keyed caches remain valid.
const replyConfigRuntimeModes = new WeakMap<OpenClawConfig, "fast" | "full">();

export function markReplyConfigRuntimeMode<T extends OpenClawConfig>(
  config: T,
  runtimeMode: "fast" | "full",
): T {
  const existingMode = replyConfigRuntimeModes.get(config);
  if (existingMode !== undefined && existingMode !== runtimeMode) {
    // Runtime mode belongs to one reply admission, while config snapshots can be shared across
    // concurrent turns. Never let a fast test and a full reply mutate each other's metadata.
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
  return Boolean(
    config &&
    typeof config === "object" &&
    replyConfigRuntimeModes.get(config as OpenClawConfig) === "full",
  );
}
