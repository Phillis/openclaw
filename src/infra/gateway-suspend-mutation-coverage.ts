import { createHash } from "node:crypto";
import type { GatewaySuspendMutationCoverage } from "../../packages/gateway-protocol/src/index.js";

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, "en-US"))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

const COVERAGE = {
  schema: "openclaw-gateway-suspend-mutation-coverage/v1" as const,
  surfaces: [
    "gateway_admission",
    "scheduler",
    "plugin_rpc_http",
    "task_controller",
    "channel_mutation",
    "provider_effect_admission",
    "legacy_state_writers",
  ] as const,
  enforcement: {
    rootAdmission: "process-wide-refuse-and-drain" as const,
    scheduler: "pause-before-idle-proof" as const,
    durableHandoff: "private-single-link-cas" as const,
    startupAdoption: "before-request-cron-task-roots" as const,
    release: "explicit-non-reusable-authority" as const,
  },
};

export const GATEWAY_SUSPEND_MUTATION_COVERAGE: GatewaySuspendMutationCoverage = Object.freeze({
  ...COVERAGE,
  coverageHash: createHash("sha256").update(canonical(COVERAGE)).digest("hex"),
});
