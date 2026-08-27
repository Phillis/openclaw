//#region extensions/browser/cli-output-mode.d.ts
declare function resolveBrowserLazySubcommand(argv: readonly string[]): string | null;
/** Browser inspection commands with JSON as their default presentation own machine stdout. */
declare function isBrowserMachineOutput(params: {
  argv: readonly string[];
}): boolean;
//#endregion
export { isBrowserMachineOutput, resolveBrowserLazySubcommand };