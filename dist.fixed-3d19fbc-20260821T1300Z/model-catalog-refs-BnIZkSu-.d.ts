//#region packages/model-catalog-core/src/model-catalog-refs.d.ts
type ProviderModelRef = {
  provider: string;
  model: string;
};
/** Recognizes one unambiguous hosted source suffix on a bare or qualified model ref. */
declare function isCloudModelRef(modelRef: string | undefined): boolean;
//#endregion
export { isCloudModelRef as n, ProviderModelRef as t };