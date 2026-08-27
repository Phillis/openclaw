import { s as WebMediaResult } from "./plugin-entry-BvodcAaE.js";
import { mt as OutboundMediaAccess } from "./types.adapters-BxgsWXLj.js";
//#region src/plugin-sdk/outbound-media.d.ts
/** Media loading policy used before plugin media is handed to channel delivery. */
type OutboundMediaLoadOptions = {
  /** Maximum allowed media payload size before the load is rejected. */maxBytes?: number; /** Whether callers may load remote URLs, local files, or both. */
  mediaAccess?: OutboundMediaAccess; /** Approved local roots for file/path media; `"any"` disables root restriction. */
  mediaLocalRoots?: readonly string[] | "any"; /** Optional local file reader used by tests or plugin-specific filesystem adapters. */
  mediaReadFile?: (filePath: string) => Promise<Buffer>; /** Workspace root used when resolving relative local media paths. */
  workspaceDir?: string; /** Explicit proxy URL forwarded to shared outbound media loading policy. */
  proxyUrl?: string; /** Fetch implementation for remote media loads. */
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>; /** Extra fetch options merged into remote media requests. */
  requestInit?: RequestInit; /** Whether shared media loading may optimize image payloads. */
  optimizeImages?: boolean; /** Allows explicit proxy DNS behavior to be trusted by the media fetch guard. */
  trustExplicitProxyDns?: boolean;
};
/** Load outbound media from a remote URL or approved local path using the shared web-media policy. */
declare function loadOutboundMediaFromUrl(mediaUrl: string, options?: OutboundMediaLoadOptions): Promise<WebMediaResult>;
//#endregion
export { loadOutboundMediaFromUrl as t };