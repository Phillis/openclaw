import { n as OpenClawConfig } from "./types.openclaw-CTCn19OD.js";
import { a as PluginStateKeyedStore, i as OpenKeyedStoreOptions } from "./config-GlXTeRSN.js";
//#region src/plugins/doctor-contract-module.d.ts
type PluginDoctorStateMigrationDetection = {
  preview: string[];
};
type PluginDoctorStateMigrationContext = {
  openPluginStateKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>; /** Doctor-only batch import preserving source age and remaining retention. */
  importPluginStateEntries?: (options: OpenKeyedStoreOptions, entries: readonly {
    key: string;
    value: unknown;
    createdAt: number;
    ttlMs?: number;
  }[]) => void; /** Plugin-wide live-row capacity for import preflight. Older test hosts may omit it. */
  getPluginStateCapacity?: () => {
    liveEntries: number;
    maxEntries: number;
  };
};
type PluginDoctorStateMigration = {
  id: string;
  label: string; /** Import retired file state only during explicit `doctor --fix` repair. */
  doctorOnly?: boolean;
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