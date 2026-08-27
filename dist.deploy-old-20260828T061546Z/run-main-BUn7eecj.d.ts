import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
//#region src/cli/startup-trace.d.ts
type GatewayStartupTraceSource = "entry" | "cli.main";
type GatewayStartupTraceLineFormatter = (message: string) => string;
type StartupTraceMeasureOptions = {
  timeline?: boolean;
};
declare function createGatewayDispatchStartupTrace(argv: string[], source: GatewayStartupTraceSource): {
  enabled: boolean;
  requiresDiagnosticsConfig(): Promise<boolean>;
  configureDiagnosticsTimeline(config: OpenClawConfig): Promise<void>;
  setLineFormatter(formatter: GatewayStartupTraceLineFormatter): void;
  mark(name: string): void;
  measure<T>(name: string, run: () => T | PromiseLike<T>, options?: StartupTraceMeasureOptions): Promise<T>;
};
//#endregion
//#region src/cli/run-main-policy.d.ts
declare function rewriteUpdateFlagArgv(argv: string[]): string[];
declare function shouldEnsureCliPath(argv: string[]): boolean;
declare function shouldUseRootHelpFastPath(argv: string[], env?: NodeJS.ProcessEnv): boolean;
declare function shouldUseSetupOnboardConfigureHelpFastPath(argv: string[], env?: NodeJS.ProcessEnv): boolean;
declare function shouldHandleBareRoot(argv: string[]): boolean;
declare function shouldStartProxyForCli(argv: string[]): boolean;
declare namespace run_main_d_exports {
  export { isGatewayRunFastPathArgv, rewriteUpdateFlagArgv, runCli, shouldEnsureCliPath, shouldHandleBareRoot, shouldStartOnboardingForFreshInstall, shouldStartProxyForCli, shouldUseRootHelpFastPath, shouldUseSetupOnboardConfigureHelpFastPath };
}
declare function isGatewayRunFastPathArgv(argv: string[]): boolean;
declare function shouldStartOnboardingForFreshInstall(argv: string[]): Promise<boolean>;
declare function runCli(argv?: string[], options?: {
  additionalStartupTrace?: ReturnType<typeof createGatewayDispatchStartupTrace>;
  retainConsoleRoutingUntilProcessExit?: boolean;
}): Promise<void>;
//#endregion
export { rewriteUpdateFlagArgv as a, shouldStartProxyForCli as c, shouldStartOnboardingForFreshInstall as i, shouldUseRootHelpFastPath as l, runCli as n, shouldEnsureCliPath as o, run_main_d_exports as r, shouldHandleBareRoot as s, isGatewayRunFastPathArgv as t, shouldUseSetupOnboardConfigureHelpFastPath as u };