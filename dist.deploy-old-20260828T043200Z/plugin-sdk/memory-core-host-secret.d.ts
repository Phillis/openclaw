//#region packages/memory-host-sdk/src/host/secret-input.d.ts
/** Return true when a configured memory secret contains a literal value or reference. */
declare function hasConfiguredMemorySecretInput(value: unknown): boolean;
/** Consume a secret value that the gateway runtime snapshot already resolved. */
declare function resolveMemorySecretInputString(params: {
  value: unknown;
  path: string;
}): string | undefined;
//#endregion
export { hasConfiguredMemorySecretInput, resolveMemorySecretInputString };