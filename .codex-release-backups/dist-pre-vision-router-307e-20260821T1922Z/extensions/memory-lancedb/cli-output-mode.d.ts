//#region extensions/memory-lancedb/cli-output-mode.d.ts
/** LanceDB inspection commands emit JSON as their only presentation. */
declare function isMemoryMachineOutput(params: {
  argv: readonly string[];
}): boolean;
//#endregion
export { isMemoryMachineOutput };