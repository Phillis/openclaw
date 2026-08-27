import { i as OpenClawConfig } from "./types.openclaw-woQof385.js";
import { xt as DetachedTaskTerminalState } from "./host-capability-types-CdpnHc99.js";
import { t as getAcpSessionManager } from "./manager-CeT_uDW_.js";
import { n as cancelActiveCronTaskRun } from "./active-run-cancellation-D2egNSpJ.js";
//#region src/agents/bash-process-control.d.ts
declare function cancelBackgroundExecSession(sessionId: string): boolean;
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill.d.ts
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
declare function killSubagentRunAdmin(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
  agentId?: string;
}): Promise<{
  found: false;
  killed: boolean;
  runId?: undefined;
  sessionKey?: undefined;
  cascadeKilled?: undefined;
  error?: undefined;
} | {
  found: true;
  killed: boolean;
  runId: string;
  sessionKey: string;
  cascadeKilled: number;
  error: string;
} | {
  runId: string;
  sessionKey: string;
  cascadeKilled: number;
  targetState?: ({
    state: "finalizing";
  } | {
    state: "terminal";
    task: DetachedTaskTerminalState;
  }) | undefined;
  found: true;
  killed: boolean;
  error?: undefined;
} | {
  runId: string;
  sessionKey: string;
  cascadeKilled: number;
  cascadeLabels: string[] | undefined;
  targetState?: ({
    state: "finalizing";
  } | {
    state: "terminal";
    task: DetachedTaskTerminalState;
  }) | undefined;
  found: true;
  killed: boolean;
  error?: undefined;
}>;
//#endregion
export { cancelActiveCronTaskRun, cancelBackgroundExecSession, getAcpSessionManager, killSubagentRunAdmin };