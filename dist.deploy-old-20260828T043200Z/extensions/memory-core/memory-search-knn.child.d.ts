import { n as VectorKnnResponse, t as VectorKnnRequest } from "../../manager-search-knn-D_1BAO3g.js";
//#region extensions/memory-core/src/memory/manager-search-knn.child.d.ts
type VectorKnnChildInput = {
  databasePath: string;
  extensionPath?: string;
  request: VectorKnnRequest;
};
type VectorKnnChildResult = {
  status: "ok";
  value: VectorKnnResponse;
} | {
  status: "failed";
  error: string;
};
//#endregion
export { VectorKnnChildInput, VectorKnnChildResult };