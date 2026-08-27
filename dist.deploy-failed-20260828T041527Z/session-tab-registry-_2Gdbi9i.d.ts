import "./acpx-hsLTUlEK.js";
import "./plugin-state-runtime-Dkg9tCIM.js";
import { c as CloseTrackedCdpTargetResult, n as ResolvedBrowserConfig, p as BrowserTabOwnership } from "./config-BePXyzlG.js";
import { z } from "zod";
//#region extensions/browser/src/browser/session-tab-route.d.ts
type BrowserSessionTabRoute = {
  kind: "browser-control";
  baseUrl?: string;
} | {
  kind: "node-proxy";
  nodeId: string;
  closeTarget: (tab: {
    targetId: string;
    profile?: string;
    ownership?: BrowserTabOwnership;
  }) => Promise<CloseTrackedCdpTargetResult>;
};
//#endregion
//#region extensions/browser/src/browser/session-tab-store.d.ts
declare const browserSessionTabRecordSchema: z.ZodObject<{
  version: z.ZodLiteral<1>;
  sessionKey: z.ZodString;
  nativeTargetId: z.ZodString;
  profile: z.ZodString;
  profileAliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
  profileFingerprint: z.ZodString;
  browserInstanceFingerprint: z.ZodString;
  interactionTargetKind: z.ZodEnum<{
    native: "native";
    opaque: "opaque";
  }>;
  trackedAt: z.ZodNumber;
  lastUsedAt: z.ZodNumber;
  cleanupRequestedAt: z.ZodOptional<z.ZodNumber>;
  cleanupAttemptToken: z.ZodOptional<z.ZodString>;
  cleanupKind: z.ZodOptional<z.ZodEnum<{
    lifecycle: "lifecycle";
    sweep: "sweep";
  }>>;
}, z.core.$loose>;
type BrowserSessionTabRecord = z.infer<typeof browserSessionTabRecordSchema>;
//#endregion
//#region extensions/browser/src/browser/session-tab-registry.d.ts
type SessionTabParams = {
  sessionKey?: string;
  targetId?: string;
  nativeTargetId?: string;
  route?: BrowserSessionTabRoute;
  profile?: string;
  profileAliases?: Array<string | undefined>;
  ownership?: BrowserTabOwnership;
  aliases?: Array<string | undefined>;
};
type DurableRecord = BrowserSessionTabRecord;
type DurableTab = DurableRecord & {
  kind: "durable";
  storageKey: string;
};
type CloseTab = (tab: {
  targetId: string;
  nativeTargetId?: string;
  baseUrl?: string;
  route?: BrowserSessionTabRoute;
  profile?: string;
}) => Promise<void>;
type CloseParams = {
  closeTab?: CloseTab;
  closeDurableTab?: (tab: DurableTab, options: {
    shouldClose: () => boolean;
  }) => Promise<CloseTrackedCdpTargetResult>;
  getResolvedBrowserConfig?: () => ResolvedBrowserConfig | null;
  onWarn?: (message: string) => void;
};
/** Starts tracking a browser tab for later session cleanup. */
declare function trackSessionBrowserTab(params: SessionTabParams & {
  now?: number;
}): void;
/** Removes a browser tab from session cleanup tracking. */
declare function untrackSessionBrowserTab(params: SessionTabParams): void;
/** Closes and untracks tabs for the supplied session keys. */
declare function closeTrackedBrowserTabsForSessions(params: CloseParams & {
  sessionKeys: Array<string | undefined>;
  now?: number;
}): Promise<number>;
//#endregion
export { trackSessionBrowserTab as n, untrackSessionBrowserTab as r, closeTrackedBrowserTabsForSessions as t };