import { n as OpenClawConfig } from "./types.openclaw-OHssSjQn.js";
import "./config-contracts-CbBCWgEm.js";
import "./runtime-doctor-migrations-BKKjMUZs.js";
import { t as HealthCheck } from "./health-BmivA38p.js";
//#region extensions/memory-core/src/migration/doctor-vector-index-provider-diagnostic.d.ts
type ProviderFailure = {
  provider: string;
  reason: string;
  requirement?: string;
  fixHint?: string;
};
type VectorProviderFinding = ProviderFailure & {
  agentId: string;
  model: string;
  configPrefix: string;
};
type InspectConfiguredProvider = (params: {
  config: OpenClawConfig;
  agentId: string;
  env: NodeJS.ProcessEnv;
  agentDatabasePath: string;
}) => Promise<ProviderFailure | null>;
declare function collectVectorProviderFindings(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
}, inspectProvider: InspectConfiguredProvider, options?: {
  indexInspectionMode?: "best-effort" | "readiness";
  inspectConfiguredMemorySecretRefs?: boolean;
}): Promise<VectorProviderFinding[]>;
//#endregion
//#region extensions/memory-core/src/doctor-health.d.ts
declare const MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID = "memory-core/managed-local-embedding-setup";
declare const pluginStateIsolatedDoctorCheckIds: readonly ["memory-core/managed-local-embedding-setup"];
type InspectManagedLocalEmbeddingSetup = (params: {
  config: Parameters<typeof collectVectorProviderFindings>[0]["config"];
  env: NodeJS.ProcessEnv;
  agentId: string;
  provider: string;
}) => ProviderFailure | null | undefined | Promise<ProviderFailure | null | undefined>;
type MemoryCoreDoctorRegistrationHost = {
  registerHealthCheck: (check: HealthCheck) => void;
  getHealthCheck: (id: string) => HealthCheck | undefined;
  inspectEmbeddingProviderSetup: InspectManagedLocalEmbeddingSetup;
  memoryCoreActive: boolean;
};
declare function registerMemoryCoreDoctorChecks(host: MemoryCoreDoctorRegistrationHost): void;
//#endregion
export { pluginStateIsolatedDoctorCheckIds as n, registerMemoryCoreDoctorChecks as r, MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID as t };