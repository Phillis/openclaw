//#region src/plugins/provider-catalog.d.ts
/** Finds a provider catalog template entry by normalized provider and template id. */
declare function findCatalogTemplate(params: {
  entries: ReadonlyArray<{
    provider: string;
    id: string;
  }>;
  providerId: string;
  templateIds: readonly string[];
}): {
  provider: string;
  id: string;
} | undefined;
//#endregion
export { findCatalogTemplate as t };