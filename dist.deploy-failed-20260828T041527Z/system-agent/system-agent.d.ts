import "../index-C5EG2Z92.js";
import { A as RuntimeEnv } from "../manifest-registry-BTc0dNop.js";
import { V as SystemAgentVerifiedInferenceBinding, h as loadSystemAgentOverview, m as SystemAgentOverview, p as SystemAgentCommandDeps } from "../types-C6qw56EZ.js";
import "../config-7RZyYa4d.js";
import "../update-startup-DkSrf5Gp.js";
//#region src/system-agent/assistant-prompts.d.ts
/** One prior conversation turn supplied to the assistant. */
type SystemAgentAssistantTurn = {
  role: "user" | "assistant";
  text: string;
};
/** Parsed assistant plan before its command is re-validated as an operation. */
type SystemAgentAssistantPlan = {
  command?: string;
  reply?: string;
  modelLabel?: string;
};
//#endregion
//#region src/system-agent/assistant.d.ts
type SystemAgentAssistantPlanner = (params: {
  input: string;
  overview: SystemAgentOverview;
  history?: SystemAgentAssistantTurn[];
  pendingOperation?: string;
  readonly verifiedInference: SystemAgentVerifiedInferenceBinding;
}) => Promise<SystemAgentAssistantPlan | null>;
//#endregion
//#region src/system-agent/system-agent.d.ts
/**
 * CLI entry point for OpenClaw.
 *
 * This module chooses JSON, one-shot, or interactive TUI mode and delegates all
 * command parsing/execution to dialogue and operation modules.
 */
type SystemAgentInteractiveRunner = (opts: RunSystemAgentOptions, runtime: RuntimeEnv) => Promise<void>;
/** Options accepted by the OpenClaw command runner. */
type RunSystemAgentOptions = {
  message?: string;
  yes?: boolean;
  json?: boolean;
  interactive?: boolean;
  /** "onboarding" swaps the greeting for the first-run setup proposal. */
  welcomeVariant?: "onboarding";
  /** Workspace override for the proposed first-run setup (from --workspace). */
  setupWorkspace?: string;
  /** Selected first-agent name for the onboarding setup proposal. */
  setupAgentName?: string;
  onReady?: () => void;
  deps?: SystemAgentCommandDeps;
  formatOverview?: (overview: SystemAgentOverview) => string;
  loadOverview?: typeof loadSystemAgentOverview;
  planWithAssistant?: SystemAgentAssistantPlanner;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  runInteractiveTui?: SystemAgentInteractiveRunner;
  /** Exact live-tested route supplied by the inference gate. */
  readonly verifiedInference: SystemAgentVerifiedInferenceBinding;
};
/** User-supplied command options before the inference gate binds the run. */
type SystemAgentCommandOptions = Omit<RunSystemAgentOptions, "verifiedInference">;
/** Run OpenClaw in JSON, one-shot message, or interactive TUI mode. */
declare function runSystemAgent(opts: RunSystemAgentOptions, runtime?: RuntimeEnv): Promise<void>;
//#endregion
export { RunSystemAgentOptions, SystemAgentCommandOptions, runSystemAgent };