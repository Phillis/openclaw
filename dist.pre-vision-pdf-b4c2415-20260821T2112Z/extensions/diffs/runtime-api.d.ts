import { IncomingMessage, ServerResponse } from "node:http";

//#region src/gateway/net.d.ts
declare function resolveRequestClientIp(req?: IncomingMessage, trustedProxies?: string[], allowRealIpFallback?: boolean): string | undefined;
//#endregion
export { resolveRequestClientIp };