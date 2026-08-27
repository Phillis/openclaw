//#region extensions/memory-lancedb/lancedb-runtime.d.ts
type LanceDbModule = typeof import("@lancedb/lancedb");
type LanceDbRuntimeLogger = {
  info?: (message: string) => void;
  warn?: (message: string) => void;
};
declare function loadLanceDbModule(logger?: LanceDbRuntimeLogger): Promise<LanceDbModule>;
//#endregion
export { loadLanceDbModule };