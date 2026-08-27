import { rt as MemorySource } from "./types.openclaw-OHssSjQn.js";
import "./memory-core-host-engine-storage-Du2uPGgs.js";
import { DatabaseSync } from "node:sqlite";
//#region extensions/memory-core/src/memory/manager-search-knn.d.ts
type VectorKnnRow = {
  id: string;
  path: string;
  start_line: number;
  end_line: number;
  text: string;
  source: MemorySource;
  dist: number;
};
type VectorKnnRequest = {
  vectorTable: string;
  providerModels: string[];
  queryVec: number[];
  limit: number;
  snippetMaxChars: number;
  sourceFilter: {
    sql: string;
    params: string[];
  };
};
type VectorKnnResponse = {
  rows: VectorKnnRow[];
  fallbackScanRequired: boolean;
};
//#endregion
export { VectorKnnResponse as n, VectorKnnRequest as t };