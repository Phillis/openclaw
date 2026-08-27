//#region src/shared/node-match.d.ts
/**
 * Shared node-selection policy for CLI, gateway-facing SDK helpers, and plugins.
 *
 * Exact ids, remote IPs, normalized display names, and long id prefixes are the
 * only accepted query shapes; fuzzy ordering lives here so callers agree.
 */
/** Node fields accepted by shared CLI/API node selection helpers. */
type NodeMatchCandidate = {
  /** Stable node id used for RPC/session routing. */
  nodeId: string;
  /** Human-facing node name used for fuzzy operator input. */
  displayName?: string;
  /** Tailscale or network address accepted as an exact match. */
  remoteIp?: string;
  /** Connected nodes win only after the strongest match type is chosen. */
  connected?: boolean;
  /** Client id used to prefer current OpenClaw nodes over legacy migration ties. */
  clientId?: string;
};
//#endregion
//#region src/shared/node-resolve.d.ts
/** Caller-supplied error wording for capability-gated node selection. */
type EligibleNodeMessages<TNode extends NodeMatchCandidate> = {
  /** Exact-id match that is not eligible; `eligibleIds` is sorted or "none". */
  ineligibleExact: (query: string, eligibleIds: string) => string;
  /** Display-name/query resolution among eligible nodes failed. */
  nameResolveFailed: (reason: string, eligibleIds: string) => string;
  /** No eligible node exists. */
  noneEligible: () => string;
  /** Several eligible nodes exist and no query disambiguates them. */
  multipleEligible: (eligible: TNode[]) => string;
};
/**
 * Resolves a capability-gated node from the full node list. Exact ids are
 * checked before eligible-name resolution so an ineligible id cannot redirect
 * to an eligible node that shares its display name.
 */
declare function resolveEligibleNodeFromList<TNode extends NodeMatchCandidate>(nodes: TNode[], query: string | undefined, isEligible: (node: TNode) => boolean, messages: EligibleNodeMessages<TNode>): TNode;
//#endregion
export { type EligibleNodeMessages, resolveEligibleNodeFromList };