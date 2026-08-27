import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
import "./logs-chat-D9H02Wyj.js";
import "./types-B7fPbrj5.js";
import "./index-BZQb-BjE.js";
import "./channel-contract-DdTkh5ZZ.js";
import "./templating-BkMhYZzX.js";
import "./manager.core-BMTmiUsH.js";
import { Cn as HealthSummary, Dn as ChatRunState, En as ChatRunEntry, Sn as DedupeEntry, Tn as RestartRecoveryCandidate, kn as QueuedChatTurnMap, wn as ChatAbortControllerEntry } from "./types-CKuYlEDM.js";
import "./hook-runner-global-CMV5dOQo.js";
import "./get-reply-CDywEitd.js";
import "./index-y1YQBCvl.js";
import "./subagent-registry.types-mOYxcD4T.js";
//#region src/infra/heartbeat-runner-scheduler.d.ts
type HeartbeatRunner = {
  stop: () => void;
  updateConfig: (cfg: OpenClawConfig) => void;
};
//#endregion
//#region src/gateway/server-media-cleanup-lifecycle.d.ts
type MediaCleanupStopResult = "drained" | "timed-out";
//#endregion
//#region src/gateway/server-maintenance.d.ts
declare function startGatewayMaintenanceTimers(params: {
  broadcast: (event: string, payload: unknown, opts?: {
    dropIfSlow?: boolean;
    stateVersion?: {
      presence?: number;
      health?: number;
    };
  }) => void;
  nodeSendToAllSubscribed: (event: string, payload: unknown) => void;
  getPresenceVersion: () => number;
  getHealthVersion: () => number;
  refreshGatewayHealthSnapshot: (opts?: {
    probe?: boolean;
    includeSensitive?: boolean;
  }) => Promise<HealthSummary>;
  logHealth: {
    info: (msg: string) => void;
    error: (msg: string) => void;
  };
  restartRunningChannels: () => Promise<void>;
  refreshPresence: () => void;
  resetEventLoopHealth: () => void;
  dedupe: Map<string, DedupeEntry>;
  chatAbortControllers: Map<string, ChatAbortControllerEntry>;
  chatQueuedTurns: QueuedChatTurnMap;
  restartRecoveryCandidates: Map<string, RestartRecoveryCandidate>;
  chatRunState: ChatRunState;
  removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  agentRunSeq: Map<string, number>;
  nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
  isNixMode?: boolean;
  mediaCleanupTtlMs?: number;
  getRuntimeConfig: () => OpenClawConfig;
  runWorktreeGc?: () => Promise<unknown>;
  runDeliveryQueueMediaGc?: () => Promise<unknown>;
  runManagedOutgoingMediaGc?: () => Promise<unknown>;
}): {
  tickInterval: ReturnType<typeof setInterval>;
  healthInterval: ReturnType<typeof setInterval>;
  dedupeCleanup: ReturnType<typeof setInterval>;
  startMediaCleanup: () => void;
  stopMediaCleanup: () => Promise<MediaCleanupStopResult>;
  worktreeCleanup: ReturnType<typeof setInterval>;
  skillUsageCleanup: () => void;
};
//#endregion
//#region src/gateway/server-runtime-services.d.ts
type GatewayMaintenanceHandles = NonNullable<Awaited<ReturnType<typeof startGatewayMaintenanceTimers>>>;
//#endregion
//#region src/plugins/services.d.ts
type PluginServicesHandle = {
  stop: (options?: {
    strict: true;
    deadlineAtMs: number;
  }) => Promise<void>;
};
//#endregion
export { HeartbeatRunner as i, GatewayMaintenanceHandles as n, MediaCleanupStopResult as r, PluginServicesHandle as t };