import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { t as callGateway } from "../call-Di7A17oL.js";

//#region src/plugin-sdk/session-visibility.d.ts
type GatewayCaller = typeof callGateway;
/** Configured visibility mode for session tools and session-related commands. */
type SessionToolsVisibility = "self" | "tree" | "agent" | "all";
/** Agent-to-agent access policy compiled from `tools.agentToAgent` config. */
type AgentToAgentPolicy = {
  enabled: boolean;
  matchesAllow: (agentId: string) => boolean;
  isAllowed: (requesterAgentId: string, targetAgentId: string) => boolean;
};
/** Session operation whose visibility error copy should be rendered. */
type SessionAccessAction = "history" | "send" | "list" | "status";
/** Result of checking whether one session operation may target a session. */
type SessionAccessResult = {
  allowed: true;
  expectedSessionId?: string;
} | {
  allowed: false;
  error: string;
  status: "forbidden";
};
type ScopedSessionAccessRequest = {
  action: Exclude<SessionAccessAction, "list">;
  requesterSessionKey: string;
  targetSessionKey: string;
};
type ScopedSessionAccessGrant = {
  expectedSessionId: string;
};
type ScopedSessionAccessProvider = (request: ScopedSessionAccessRequest) => ScopedSessionAccessGrant | undefined;
declare function registerScopedSessionAccessProvider(provider: ScopedSessionAccessProvider): () => void;
declare function resolveScopedSessionAccess(request: ScopedSessionAccessRequest): ScopedSessionAccessGrant | undefined;
/** Minimal session row metadata needed to evaluate ownership and cross-agent access. */
type SessionVisibilityRow = {
  key: string;
  agentId?: string;
  ownerSessionKey?: string;
  spawnedBy?: string;
  parentSessionKey?: string;
};
/** Public compatibility wrapper; direct guards use the richer private result. */
declare function listSpawnedSessionKeys(params: {
  requesterSessionKey: string;
  limit?: number;
  callGateway?: GatewayCaller;
}): Promise<Set<string>>;
/** Resolve configured session-tool visibility, defaulting invalid or missing values to tree. */
declare function resolveSessionToolsVisibility(cfg: OpenClawConfig): SessionToolsVisibility;
/** Resolve visibility after applying sandbox clamps for spawned-session-only agents. */
declare function resolveEffectiveSessionToolsVisibility(params: {
  cfg: OpenClawConfig;
  sandboxed: boolean;
}): SessionToolsVisibility;
/** Resolve sandbox-specific session visibility clamp for agent defaults. */
declare function resolveSandboxSessionToolsVisibility(cfg: OpenClawConfig): "spawned" | "all";
/** Compile agent-to-agent allow rules into reusable matching predicates. */
declare function createAgentToAgentPolicy(cfg: OpenClawConfig): AgentToAgentPolicy;
type SessionVisibilityCheckerParams = {
  action: SessionAccessAction;
  defaultAgentId?: string;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
};
/** Create a direct session-key visibility checker for one requester/action pair. */
declare function createSessionVisibilityCheckerImpl(params: SessionVisibilityCheckerParams & {
  spawnedKeys: Set<string> | null;
}): {
  check: (targetSessionKey: string) => SessionAccessResult;
};
/** Direct-key visibility checker plus registration for narrow host-owned grants. */
declare const createSessionVisibilityChecker: typeof createSessionVisibilityCheckerImpl & {
  registerScopedAccessProvider: typeof registerScopedSessionAccessProvider;
  resolveScopedAccess: typeof resolveScopedSessionAccess;
};
/** Create a row-aware visibility checker that can use owner/spawn metadata. */
declare function createSessionVisibilityRowChecker(params: {
  action: SessionAccessAction;
  defaultAgentId?: string;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
}): {
  check: (row: SessionVisibilityRow) => SessionAccessResult;
};
/** Create a visibility guard, loading spawned-session ownership when direct keys need it. */
declare function createSessionVisibilityGuard(params: {
  action: SessionAccessAction;
  defaultAgentId?: string;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
  callGateway?: GatewayCaller;
}): Promise<{
  check: (targetSessionKey: string) => SessionAccessResult;
}>;
//#endregion
export { AgentToAgentPolicy, SessionAccessAction, SessionAccessResult, SessionToolsVisibility, SessionVisibilityRow, createAgentToAgentPolicy, createSessionVisibilityChecker, createSessionVisibilityGuard, createSessionVisibilityRowChecker, listSpawnedSessionKeys, resolveEffectiveSessionToolsVisibility, resolveSandboxSessionToolsVisibility, resolveSessionToolsVisibility };