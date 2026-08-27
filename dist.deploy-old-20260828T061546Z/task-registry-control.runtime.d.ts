import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
import "./logs-chat-D9H02Wyj.js";
import "./types-BgZZ1ot4.js";
import "./index-BZQb-BjE.js";
import "./manager.core-BMTmiUsH.js";
import { getAcpSessionManager } from "./acp/control-plane/manager.js";
import { hn as DetachedTaskTerminalState } from "./types-CKuYlEDM.js";
import { n as cancelActiveCronTaskRun } from "./active-run-cancellation-CW0zBOK0.js";
import "./subagent-registry.types-mOYxcD4T.js";
//#region src/agents/bash-process-control.d.ts
declare function cancelBackgroundExecSession(sessionId: string): boolean;
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill.d.ts
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
declare function killSubagentRunAdmin(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
  agentId?: string;
  expectedRunId?: string;
  expectedGeneration?: number;
  expectedOwnerKey?: string;
}): Promise<{
  found: false;
  killed: false;
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