//#region packages/normalization-core/src/promise-like.d.ts
/** Canonical thenable guard; use instead of local isPromiseLike copies. */
declare function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T>;
//#endregion
export { isPromiseLike };