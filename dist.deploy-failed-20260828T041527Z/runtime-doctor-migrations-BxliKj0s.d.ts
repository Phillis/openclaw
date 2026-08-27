import { n as OpenClawConfig } from "./types.openclaw-n6JIVcIK.js";
import "./types-CebnZ6B4.js";
import { n as PluginStateEntry, r as PluginStateKeyedStore, t as OpenKeyedStoreOptions } from "./channel-contract-DsIFrPEf.js";
import "./manifest-registry-CMV4LCJ1.js";
import "./legacy-private-network-migration-BGqJ99C1.js";
import { DatabaseSync } from "node:sqlite";
//#region src/plugin-state/plugin-state-store.sqlite.d.ts
type PluginDoctorRawStateEntry = Omit<PluginStateEntry<unknown>, "value" | "expiresAt"> & {
  valueJson: string;
  value?: unknown;
  expiresAt: number | null;
};
//#endregion
//#region src/plugins/doctor-contract-module.d.ts
type PluginDoctorStateMigrationDetection = {
  preview: string[];
};
type PluginDoctorStateMigrationContext = {
  openPluginStateKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
  /** Doctor-only batch import preserving source age and remaining retention. */
  importPluginStateEntries?: (options: OpenKeyedStoreOptions, entries: readonly {
    key: string;
    value: unknown;
    createdAt: number;
    ttlMs?: number;
  }[]) => void;
  /** Plugin-wide live-row capacity for import preflight. Older test hosts may omit it. */
  getPluginStateCapacity?: () => {
    liveEntries: number;
    maxEntries: number;
  };
  readPluginStateEntriesInKeyRange?: (namespace: string, range: {
    prefix: string;
    after?: string;
    limit: number;
  }) => PluginDoctorRawStateEntry[];
  readSessionIdentityEvidenceBatch?: (requests: readonly {
    agentId: string;
    sessionId: string;
  }[]) => Promise<({
    agentId: string;
    sessionId: string;
    state: "current";
    sessionKey: string;
  } | {
    agentId: string;
    sessionId: string;
    state: "absent" | "unknown";
  })[]>;
  /** Present only while the host owns the offline SQLite maintenance lock. */
  deletePluginStateEntriesIfUnchanged?: (namespace: string, entries: readonly PluginDoctorRawStateEntry[]) => {
    deleted: number;
    changed: number;
  };
};
type PluginDoctorStateMigration = {
  id: string;
  label: string;
  /** Import retired file state only during explicit `doctor --fix` repair. */
  doctorOnly?: boolean;
  phase?: "after-session-repair";
  detectLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) => Promise<PluginDoctorStateMigrationDetection | null> | PluginDoctorStateMigrationDetection | null;
  migrateLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) => Promise<{
    changes: string[];
    warnings: string[];
    notices?: string[];
  }> | {
    changes: string[];
    warnings: string[];
    notices?: string[];
  };
};
//#endregion
export { PluginDoctorStateMigration as t };