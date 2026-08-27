import { IncomingMessage } from "node:http";
import { Command } from "commander";

//#region src/plugin-sdk/gateway-runtime.d.ts
declare function resolveAdvertisedLanHost(): Promise<string | null>;
//#endregion
export { resolveAdvertisedLanHost as t };