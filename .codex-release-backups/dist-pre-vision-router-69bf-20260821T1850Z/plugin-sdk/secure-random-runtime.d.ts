//#region src/infra/secure-random.d.ts
/** Generates a cryptographically secure UUID for runtime ids and cache keys. */
declare function generateSecureUuid(): string;
/** Generates a URL-safe cryptographic token from the requested byte count. */
declare function generateSecureToken(bytes?: number): string;
//#endregion
export { generateSecureToken, generateSecureUuid };