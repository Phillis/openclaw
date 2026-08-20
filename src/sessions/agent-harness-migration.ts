import { randomUUID } from "node:crypto";
import { patchSessionEntry } from "../config/sessions/session-accessor.js";
import type { SessionAgentHarnessMigration, SessionEntry } from "../config/sessions/types.js";
import { runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission.js";

export type AgentHarnessMigrationCheckpoint = {
  checkpointId: string;
  rollback: () => Promise<void>;
};

export type MigrateSessionAgentHarnessParams = {
  sessionKey: string;
  storePath: string;
  toHarnessId: string;
  signal?: AbortSignal;
  prepareCheckpoint: (entry: Readonly<SessionEntry>) => Promise<AgentHarnessMigrationCheckpoint>;
  adoptCheckpoint: (params: {
    checkpointId: string;
    fromHarnessId: string;
    fromEpoch: string;
    toHarnessId: string;
    toEpoch: string;
  }) => Promise<void>;
  retireSource?: (params: {
    checkpointId: string;
    fromHarnessId: string;
    fromEpoch: string;
  }) => Promise<void>;
};

/**
 * Explicit, fail-closed cross-harness migration saga. The durable fence blocks
 * ordinary work until adoption commits or rollback removes the transition.
 */
export async function migrateSessionAgentHarness(
  params: MigrateSessionAgentHarnessParams,
): Promise<SessionEntry> {
  return await runExclusiveSessionLifecycleMutation({
    scope: params.storePath,
    identities: [params.sessionKey],
    signal: params.signal,
    run: async () => {
      const toHarnessId = params.toHarnessId.trim();
      if (!toHarnessId) {
        throw new Error("target harness id is required");
      }
      let checkpoint: AgentHarnessMigrationCheckpoint | undefined;
      let transition: SessionAgentHarnessMigration | undefined;
      let sourceEntry: Readonly<SessionEntry> | undefined;
      const prepared = await patchSessionEntry(
        { sessionKey: params.sessionKey, storePath: params.storePath },
        (entry) => {
          if (entry.agentHarnessMigration) {
            throw new Error("agent harness migration already in progress");
          }
          const fromHarnessId = entry.agentHarnessId?.trim();
          const fromEpoch = entry.agentHarnessEpoch?.trim();
          if (!fromHarnessId || !fromEpoch) {
            throw new Error("session does not have a durable harness lane to migrate");
          }
          if (fromHarnessId === toHarnessId) {
            throw new Error(`session already belongs to harness ${toHarnessId}`);
          }
          sourceEntry = Object.freeze(structuredClone(entry));
          const migrationId = randomUUID();
          transition = {
            schemaVersion: 1,
            migrationId,
            fromHarnessId,
            fromEpoch,
            toHarnessId,
            toEpoch: randomUUID(),
            checkpointId: migrationId,
            startedAt: Date.now(),
            state: "preparing",
          };
          return { agentHarnessMigration: transition };
        },
        { preserveActivity: true, skipMaintenance: true },
      );
      if (!prepared || !transition || !sourceEntry) {
        throw new Error("session not found");
      }
      let committed: SessionEntry | null = null;
      try {
        checkpoint = await params.prepareCheckpoint(sourceEntry);
        const checkpointId = checkpoint.checkpointId.trim();
        if (!checkpointId) {
          throw new Error("migration checkpoint id is required");
        }
        const adopting = await patchSessionEntry(
          { sessionKey: params.sessionKey, storePath: params.storePath },
          (entry) => {
            if (
              entry.agentHarnessMigration?.migrationId !== transition?.migrationId ||
              entry.agentHarnessMigration.state !== "preparing"
            ) {
              throw new Error("agent harness migration fence changed during preparation");
            }
            transition = { ...entry.agentHarnessMigration, checkpointId, state: "adopting" };
            return { agentHarnessMigration: transition };
          },
          { preserveActivity: true, skipMaintenance: true },
        );
        if (!adopting || !transition) {
          throw new Error("session disappeared during harness migration preparation");
        }
        await params.adoptCheckpoint({
          checkpointId: transition.checkpointId,
          fromHarnessId: transition.fromHarnessId,
          fromEpoch: transition.fromEpoch,
          toHarnessId: transition.toHarnessId,
          toEpoch: transition.toEpoch,
        });
        committed = await patchSessionEntry(
          { sessionKey: params.sessionKey, storePath: params.storePath },
          (entry) => {
            if (entry.agentHarnessMigration?.migrationId !== transition?.migrationId) {
              throw new Error("agent harness migration fence changed during adoption");
            }
            return {
              agentHarnessId: transition.toHarnessId,
              agentHarnessEpoch: transition.toEpoch,
              agentHarnessLaneEpochs: {
                ...entry.agentHarnessLaneEpochs,
                [transition.fromHarnessId]: transition.fromEpoch,
                [transition.toHarnessId]: transition.toEpoch,
              },
              agentHarnessMigration: undefined,
            };
          },
          { preserveActivity: true, skipMaintenance: true },
        );
        if (!committed) {
          throw new Error("session disappeared during harness migration");
        }
      } catch (error) {
        try {
          await checkpoint?.rollback();
        } finally {
          await patchSessionEntry(
            { sessionKey: params.sessionKey, storePath: params.storePath },
            (entry) =>
              entry.agentHarnessMigration?.migrationId === transition?.migrationId
                ? { agentHarnessMigration: undefined }
                : null,
            { preserveActivity: true, skipMaintenance: true },
          );
        }
        throw error;
      }
      if (!committed) {
        throw new Error("session harness migration did not commit");
      }
      if (params.retireSource) {
        try {
          await params.retireSource({
            checkpointId: transition.checkpointId,
            fromHarnessId: transition.fromHarnessId,
            fromEpoch: transition.fromEpoch,
          });
        } catch {
          // Adoption is already committed. Source retirement is idempotent
          // cleanup and must not roll the durable owner back.
        }
      }
      return committed;
    },
  });
}
