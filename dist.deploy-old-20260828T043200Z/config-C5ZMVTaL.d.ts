import { r as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-Cjm06lg9.js";
import "./types-336a6ztO.js";
import "./manifest-registry-BQiYh3fz.js";
import { a as readConfigFileSnapshotForWrite, c as ConfigWriteResult, l as ConfigWriteAfterWrite, s as ConfigWriteOptions, u as ConfigWriteFollowUp } from "./io-CN6VZK8B.js";
import "./paths-VM0qngsT.js";
//#region src/config/mutation-types.d.ts
/** Selects whether a mutation starts from runtime or source config shape. */
type ConfigMutationBase = "runtime" | "source";
//#endregion
//#region src/config/mutate.d.ts
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: OpenClawConfig;
  persistedHash: string | null;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
type ConfigMutationIO = {
  env?: NodeJS.ProcessEnv;
  readConfigFileSnapshotForWrite: typeof readConfigFileSnapshotForWrite;
  writeConfigFile: (cfg: OpenClawConfig, options?: ConfigWriteOptions) => Promise<ConfigWriteResult | void>;
};
type ConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
  attempt: number;
};
type ConfigMutationResult<T> = ConfigReplaceResult & {
  result: T | undefined;
  attempts: number;
};
declare function replaceConfigFile(params: {
  nextConfig: OpenClawConfig;
  baseHash?: string;
  snapshot?: ConfigFileSnapshot;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
}): Promise<ConfigReplaceResult>;
declare function mutateConfigFile<T = void>(params: {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  mutate: (draft: OpenClawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
}): Promise<ConfigMutationResult<T>>;
//#endregion
export { ConfigMutationBase as i, mutateConfigFile as n, replaceConfigFile as r, ConfigReplaceResult as t };