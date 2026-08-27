import { r as ChannelId } from "./group-policy-BeFy91iJ.js";
import { Dn as ChatRunState, En as ChatRunEntry, Tn as RestartRecoveryCandidate, kn as QueuedChatTurnMap, wn as ChatAbortControllerEntry } from "./types-5umPnScv.js";
import { i as HeartbeatRunner, n as GatewayMaintenanceHandles, r as MediaCleanupStopResult, t as PluginServicesHandle } from "./services-C2X1zA3S.js";
import "./index-CPKNYzw-.js";
import { Server } from "node:http";
import { WebSocketServer } from "ws";
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
    activeRuns: RestartRecoveryCandidate[];
    reason: string;
    isActiveRun: (run: RestartRecoveryCandidate) => boolean;
  }) => Promise<void> | void;
  resolveActiveSessionIdForKey?: (sessionKey: string) => string | undefined;
};
declare function runGatewayClosePrelude(params: {
  stopDiagnostics?: () => void;
  clearSkillsRefreshTimer?: () => void;
  skillsChangeUnsub?: () => void | Promise<void>;
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
  disposeSessionMcpRuntimes?: () => Promise<void>;
  disposeBundleLspRuntimes?: () => Promise<void>;
  disposeAllBundleLspRuntimes: () => Promise<void>;
  drainRetainedOpenAiEmbeddingProviders: () => Promise<void>;
  stopGmailWatcher: () => Promise<void>;
  disposeAllCodeModeRuns: () => Promise<void> | void;
  closeProviderTransportDispatcherPool: () => Promise<void>;
  cron: {
    stop: () => void;
    stopAndDrain?: () => Promise<void>;
  };
  heartbeatRunner: HeartbeatRunner;
  updateCheckStop?: (() => void) | null;
  stopTaskRegistryMaintenance?: (() => Promise<void> | void) | null;
  nodePresenceTimers: Map<string, ReturnType<typeof setInterval>>;
  maintenance: GatewayMaintenanceHandles | null;
  stopMediaCleanup: () => Promise<MediaCleanupStopResult>;
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
//#region src/gateway/active-sessions-shutdown-drain.d.ts
declare function drainActiveSessionsForShutdown(params: {
  reason: "shutdown" | "restart";
  totalTimeoutMs?: number;
}): Promise<{
  emittedSessionIds: string[];
  timedOut: boolean;
}>;
//#endregion
export { createGatewayCloseHandler, drainActiveSessionsForShutdown, runGatewayClosePrelude };