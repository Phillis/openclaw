import { i as OpenClawConfig, ys as SecretRef } from "../../types.openclaw-ClnaeuRs.js";
import { mL as WorkerAdmissionHandshake } from "../../index-BM_xi37e.js";
import { y as SecretRefResolveCache } from "../../channel-contract-D_kQewsM.js";
import { n as PluginManifestRegistry } from "../../manifest-registry-BxbBLC7n.js";
import { bn as WorkerSshEndpoint, vn as WorkerProfile, xn as WorkerSshIdentity, yn as WorkerProvider } from "../../types-Hf0Z4d9b.js";
import { h as SpawnResult, p as CommandOptions } from "../../web-media-BlsMjzpu.js";
//#region src/secrets/resolve.d.ts
type ResolveSecretRefOptions = {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  cache?: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
};
/** Resolves one SecretRef and requires a non-empty string result. */
declare function resolveSecretRefString(ref: SecretRef, options: ResolveSecretRefOptions): Promise<string>;
//#endregion
//#region src/gateway/worker-environments/bundle.d.ts
type WorkerInstallationArtifactBase = {
  bundleHash: string;
  openclawVersion: string;
  protocolFeatures: readonly string[];
};
type WorkerBundleArtifact = WorkerInstallationArtifactBase & {
  install: "bundle";
  tarballBytes: number;
  tarballSha256: string;
  tarballPath: string;
};
type WorkerNpmArtifact = WorkerInstallationArtifactBase & {
  install: "npm";
  packageIntegrity: string;
  packageSpec: string;
};
type WorkerInstallationArtifact = WorkerBundleArtifact | WorkerNpmArtifact;
type WorkerBundleProducer = {
  prepare: () => Promise<WorkerBundleArtifact>;
  prune: (retainedBundleHashes: readonly string[]) => Promise<void>;
};
type WorkerBundleProducerOptions = {
  packageRoot?: string;
  cacheDir?: string;
  openclawVersion?: string;
  protocolFeatures?: readonly string[];
  cacheOwnership?: "exclusive";
  onCacheCleanupError?: (error: unknown) => void;
};
type WorkerNpmPackageInstallCheck = (packageRoot: string) => Promise<boolean>;
type WorkerNpmReleaseVerifier = (params: {
  bundleHash: string;
  version: string;
}) => Promise<string>;
/** Creates a process-lifecycle bundle producer that scans the running build at most once. */
declare function createWorkerBundleProducer(options?: WorkerBundleProducerOptions): WorkerBundleProducer;
/**
 * Selects the exact npm package only after the public tarball's canonical worker manifest proves
 * parity with the running gateway bundle.
 */
declare function resolveWorkerNpmInstallationArtifact(params: {
  bundle: WorkerBundleArtifact;
  packageRoot?: string;
  isPackageInstall?: WorkerNpmPackageInstallCheck;
  verifyRelease?: WorkerNpmReleaseVerifier;
}): Promise<WorkerNpmArtifact>;
//#endregion
//#region src/gateway/worker-environments/bootstrap.d.ts
type ResolvedWorkerSshIdentity = WorkerSshIdentity;
type WorkerBootstrapCommandRunner = (argv: string[], options: CommandOptions) => Promise<SpawnResult>;
type WorkerBootstrapRequest = {
  ssh: WorkerSshEndpoint;
  artifact: WorkerInstallationArtifact;
  operationId: string;
  /** Provider endpoint host key copied by the gateway bootstrap adapter. */
  pinnedHostKey?: string;
};
type WorkerBootstrapDependencies = {
  resolveIdentity: (keyRef: WorkerSshEndpoint["keyRef"]) => Promise<ResolvedWorkerSshIdentity>;
  runCommand?: WorkerBootstrapCommandRunner;
  timeoutMs?: number;
  signal?: AbortSignal;
};
/** Installs one exact worker artifact over SSH and returns its admission receipt. */
declare function bootstrapWorker(request: WorkerBootstrapRequest, dependencies: WorkerBootstrapDependencies): Promise<WorkerAdmissionHandshake>;
//#endregion
//#region src/gateway/worker-environments/identity.d.ts
type GenericWorkerSshIdentityResolver = (keyRef: SecretRef) => Promise<WorkerSshIdentity>;
/** Routes dynamic identities to their provider owner and configured refs to the generic resolver. */
declare function resolveWorkerSshIdentity(params: {
  provider: WorkerProvider;
  leaseId: string;
  profile: WorkerProfile;
  keyRef: SecretRef;
  resolveGeneric: GenericWorkerSshIdentityResolver;
}): Promise<WorkerSshIdentity>;
//#endregion
export { bootstrapWorker, createWorkerBundleProducer, resolveSecretRefString, resolveWorkerNpmInstallationArtifact, resolveWorkerSshIdentity };