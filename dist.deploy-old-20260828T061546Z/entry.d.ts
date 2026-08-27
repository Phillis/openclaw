import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
import { tt as PluginLoadOptions } from "./types-CKuYlEDM.js";
import { r as run_main_d_exports } from "./run-main-BUn7eecj.js";
//#region src/cli/program/root-help.d.ts
/** Options for rendering root help without fully registering the live CLI. */
type RootHelpRenderOptions = Pick<PluginLoadOptions, "pluginSdkResolution"> & {
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  includePluginDescriptors?: boolean;
};
//#endregion
//#region src/cli/precomputed-help.d.ts
type PrecomputedSubcommandHelpName = "config" | "doctor" | "gateway" | "models" | "plugins" | "sessions" | "tasks";
type OutputPrecomputedHelpText = () => boolean;
type PrecomputedCommandHelpDeps = {
  outputPrecomputedBrowserHelpText?: OutputPrecomputedHelpText;
  outputPrecomputedSecretsHelpText?: OutputPrecomputedHelpText;
  outputPrecomputedNodesHelpText?: OutputPrecomputedHelpText;
  outputPrecomputedSubcommandHelpText?: (commandName: PrecomputedSubcommandHelpName) => boolean;
  loadRootHelpRenderOptionsForConfigSensitivePlugins?: (env?: NodeJS.ProcessEnv) => Promise<RootHelpRenderOptions | null>;
  env?: NodeJS.ProcessEnv;
};
//#endregion
//#region src/entry.d.ts
declare function tryHandleRootHelpFastPath(argv: string[], deps?: {
  outputPrecomputedRootHelpText?: () => boolean;
  outputRootHelp?: (options?: RootHelpRenderOptions) => void | Promise<void>;
  loadRootHelpRenderOptionsForConfigSensitivePlugins?: (env?: NodeJS.ProcessEnv) => Promise<RootHelpRenderOptions | null>;
  onError?: (error: unknown) => void | Promise<void>;
  env?: NodeJS.ProcessEnv;
}): Promise<boolean>;
declare function tryHandlePrecomputedCommandHelpFastPath(argv: string[], deps?: PrecomputedCommandHelpDeps): Promise<boolean>;
declare function runMainOrRootHelp(argv: string[], deps?: RunMainOrRootHelpDeps): Promise<void>;
type RunMainOrRootHelpDeps = {
  loadRunCli?: () => Promise<Pick<typeof run_main_d_exports, "runCli">>;
};
//#endregion
export { runMainOrRootHelp, tryHandlePrecomputedCommandHelpFastPath, tryHandleRootHelpFastPath };