import { At as RestartRecoveryCandidate, It as QueuedChatTurnMap, Mt as ChatRunState, jt as ChatRunEntry, kt as ChatAbortControllerEntry } from "./host-capability-types-CSKZWJAm.js";
import { r as ChannelId } from "./group-policy-Do4IaxCb.js";
import { n as PluginServicesHandle, r as HeartbeatRunner, t as GatewayPostReadySidecarHandle } from "./session-utils-ADqgOK1-.js";
import { WebSocketServer } from "ws";
import { Server } from "node:http";

//#region src/gateway/server-media-cleanup-lifecycle.d.ts
type MediaCleanupStopResult = "drained" | "timed-out";
//#endregion
//#region src/gateway/server-close.d.ts
type ShutdownResult = {
  durationMs: number;
  warnings: string[];
};
type RestartRunAbortParams = {
  chatAbortControllers: Map<string, ChatAbortControllerEntry>;
  chatQueuedTurns: QueuedChatTurnMap;
  restartRecoveryCandidates?: Map<string, RestartRecoveryCandidate>;
  chatRunState: ChatRunState;
  removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  agentRunSeq: Map<string, number>;
  broadcast: (event: string, payload: unknown, opts?: {
    dropIfSlow?: boolean;
  }) => void;
  nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
  markMainSessionsAbortedForRestart?: (params: {
    sessionKeys: Set<string>;
    sessionIds: Set<string>;
    activeRuns: Array<{
      runId: string;
      lifecycleGeneration: string;
      sessionKey: string;
      sessionId: string;
      observedAt?: number;
    }>;
    reason: string;
    isActiveRun: (run: {
      runId: string;
      lifecycleGeneration: string;
      sessionKey: string;
      sessionId: string;
      observedAt?: number;
    }) => boolean;
  }) => Promise<void> | void;
  resolveActiveSessionIdForKey?: (sessionKey: string) => string | undefined;
};
declare function runGatewayClosePrelude(params: {
  stopDiagnostics?: () => void;
  clearSkillsRefreshTimer?: () => void;
  skillsChangeUnsub?: () => void;
  disposeAuthRateLimiter?: () => void;
  disposeBrowserAuthRateLimiter: () => void;
  stopChannelHealthMonitor?: () => Promise<void>;
  stopReadinessEventLoopHealth?: () => void;
  closeMcpServer?: () => Promise<void>;
}): Promise<void>;
declare function createGatewayCloseHandler(params: {
  bonjourStop: (() => Promise<void>) | null;
  tailscaleCleanup: (() => Promise<void>) | null;
  clearSecretsRuntimeSnapshot?: (() => void) | null;
  channelIds?: readonly ChannelId[];
  stopChannel: (name: ChannelId, accountId?: string) => Promise<void>;
  pluginServices: PluginServicesHandle | null;
  postReadySidecars?: readonly GatewayPostReadySidecarHandle[];
  disposeSessionMcpRuntimes?: () => Promise<void>;
  disposeBundleLspRuntimes?: () => Promise<void>;
  cron: {
    stop: () => void;
    stopAndDrain?: () => Promise<void>;
  };
  heartbeatRunner: HeartbeatRunner;
  updateCheckStop?: (() => void) | null;
  stopTaskRegistryMaintenance?: (() => Promise<void> | void) | null;
  nodePresenceTimers: Map<string, ReturnType<typeof setInterval>>;
  tickInterval: ReturnType<typeof setInterval>;
  healthInterval: ReturnType<typeof setInterval>;
  dedupeCleanup: ReturnType<typeof setInterval>;
  stopMediaCleanup: () => Promise<MediaCleanupStopResult>;
  worktreeCleanup: ReturnType<typeof setInterval> | null;
  skillCuratorCleanup: () => void;
  agentUnsub: (() => Promise<void> | void) | null;
  heartbeatUnsub: (() => void) | null;
  transcriptUnsub: (() => void) | null;
  lifecycleUnsub: (() => void) | null;
  taskUnsub: (() => void) | null;
  getPendingReplyCount?: () => number;
  clients: Set<{
    connectionKind?: "gateway" | "worker";
    socket: {
      close: (code: number, reason: string) => void;
    };
  }>;
  configReloader: {
    stop: () => Promise<void>;
  };
  wss?: WebSocketServer;
  httpServer?: Server;
  httpServers?: Server[];
  drainActiveSessionsForShutdown?: (params: {
    reason: "shutdown" | "restart";
    totalTimeoutMs?: number;
  }) => Promise<{
    emittedSessionIds: string[];
    timedOut: boolean;
  }>;
} & RestartRunAbortParams): (opts?: {
  reason?: string;
  restartExpectedMs?: number | null;
  drainTimeoutMs?: number | null;
}) => Promise<ShutdownResult>;
//#endregion
//#region src/gateway/session-reset-service.d.ts
type DrainActiveSessionsForShutdownResult = {
  emittedSessionIds: string[];
  timedOut: boolean;
};
/**
 * Emit a typed `session_end` for every session that received `session_start`
 * but did not yet receive a paired `session_end`. The bounded total timeout
 * mirrors the gateway lifecycle hook timeout so a slow plugin cannot block
 * SIGTERM/SIGINT past the runtime's overall shutdown grace window.
 *
 * Sessions that have already been finalized through replace / reset / delete /
 * compaction are forgotten from the tracker by `emitGatewaySessionEndPluginHook`
 * before this drain runs, so they will not be double-fired here.
 */
declare function drainActiveSessionsForShutdown(params: {
  reason: "shutdown" | "restart";
  totalTimeoutMs?: number;
}): Promise<DrainActiveSessionsForShutdownResult>;
//#endregion
export { ShutdownResult, createGatewayCloseHandler, drainActiveSessionsForShutdown, runGatewayClosePrelude };