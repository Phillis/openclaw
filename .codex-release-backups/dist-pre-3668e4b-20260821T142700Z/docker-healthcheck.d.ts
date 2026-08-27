import { i as OpenClawConfig } from "./types.openclaw-woQof385.js";
//#region src/docker-healthcheck.d.ts
type DockerHealthcheckPortDeps = {
  env: NodeJS.ProcessEnv;
  getRuntimeConfig: () => OpenClawConfig;
  readActiveGatewayLockPort: (opts: {
    env: NodeJS.ProcessEnv;
  }) => Promise<number | undefined>;
  resolveGatewayPort: (config: OpenClawConfig, env: NodeJS.ProcessEnv) => number;
};
type DockerHealthcheckDeps = Partial<DockerHealthcheckPortDeps> & {
  fetch?: typeof globalThis.fetch;
};
declare function resolveDockerHealthcheckPort(deps?: Partial<DockerHealthcheckPortDeps>): Promise<number>;
declare function probeDockerGatewayHealth(deps?: DockerHealthcheckDeps): Promise<boolean>;
//#endregion
export { probeDockerGatewayHealth, resolveDockerHealthcheckPort };