import { randomUUID } from "node:crypto";
import { normalizeOptionalLowercaseString } from "@openclaw/normalization-core/string-coerce";
import { updateSessionEntry } from "../config/sessions/session-accessor.js";
import type { SessionEntry } from "../config/sessions/types.js";

export type AgentHarnessLaneClaim = {
  epoch: string;
  entry?: SessionEntry;
};

/**
 * Claims a stable per-harness context generation before model dispatch.
 *
 * Unlocked sessions only update the lane map: the successful terminal attempt
 * remains responsible for promoting a harness to the active top-level owner.
 */
export async function ensureAgentHarnessLaneEpoch(params: {
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  storePath?: string;
  agentHarnessId: string;
  snapshotEpoch?: string;
  modelSelectionLocked?: boolean;
}): Promise<AgentHarnessLaneClaim> {
  const agentHarnessId = normalizeOptionalLowercaseString(params.agentHarnessId);
  if (!agentHarnessId) {
    throw new Error("Cannot claim an agent harness lane without a harness id");
  }

  const snapshotEpoch = params.snapshotEpoch?.trim() || undefined;
  const localEpoch = snapshotEpoch ?? randomUUID();
  if (!params.sessionKey || !params.storePath) {
    return { epoch: localEpoch };
  }

  let claimedEpoch = localEpoch;
  let rejectedSessionIdentity = false;
  const entry = await updateSessionEntry(
    {
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      storePath: params.storePath,
    },
    (current) => {
      if (current.sessionId !== params.sessionId) {
        rejectedSessionIdentity = true;
        return null;
      }
      const activeHarnessId = normalizeOptionalLowercaseString(current.agentHarnessId);
      if (
        params.modelSelectionLocked === true &&
        activeHarnessId &&
        activeHarnessId !== agentHarnessId
      ) {
        throw new Error(
          `Locked session harness mismatch: expected ${activeHarnessId}, selected ${agentHarnessId}`,
        );
      }
      claimedEpoch =
        current.agentHarnessLaneEpochs?.[agentHarnessId]?.trim() ||
        (activeHarnessId === agentHarnessId ? current.agentHarnessEpoch?.trim() : undefined) ||
        localEpoch;
      return {
        agentHarnessLaneEpochs: {
          ...current.agentHarnessLaneEpochs,
          [agentHarnessId]: claimedEpoch,
        },
        ...(params.modelSelectionLocked === true && activeHarnessId === agentHarnessId
          ? { agentHarnessEpoch: claimedEpoch }
          : {}),
      };
    },
    { skipMaintenance: true, requireWriteSuccess: true },
  );

  if (rejectedSessionIdentity || !entry) {
    throw new Error(
      `Cannot claim agent harness lane for missing or replaced session ${params.sessionKey}`,
    );
  }
  return { epoch: claimedEpoch, entry };
}
