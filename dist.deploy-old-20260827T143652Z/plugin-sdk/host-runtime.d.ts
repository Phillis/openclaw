//#region src/infra/scp-host.d.ts
/** Normalize an optional `[user@]host` SCP target or reject unsafe tokens. */
declare function normalizeScpRemoteHost(value: string | null | undefined): string | undefined;
//#endregion
//#region src/infra/net/hostname.d.ts
/** Normalize a hostname for policy comparisons. */
declare function normalizeHostname(hostname: string): string;
//#endregion
export { normalizeHostname, normalizeScpRemoteHost };