//#region extensions/memory-core/src/memory/embedding-local-service.d.ts
type MemoryCoreAcquireLocalService = (target: {
  providerId: string;
  baseUrl: string;
  headers?: HeadersInit;
}, signal?: AbortSignal | null) => Promise<{
  release: () => void;
} | undefined>;
//#endregion
export { MemoryCoreAcquireLocalService as t };