import { IncomingMessage } from "node:http";

//#region src/gateway/net.d.ts
declare function resolveRequestClientIp(req?: IncomingMessage, trustedProxies?: string[], allowRealIpFallback?: boolean): string | undefined;
/**
 * Check if a hostname or IP refers to the local machine.
 * Handles: localhost, 127.x.x.x, ::1, [::1], ::ffff:127.x.x.x
 * Note: 0.0.0.0 and :: are NOT loopback - they bind to all interfaces.
 */
declare function isLoopbackHost(host: string): boolean;
//#endregion
export { resolveRequestClientIp as n, isLoopbackHost as t };