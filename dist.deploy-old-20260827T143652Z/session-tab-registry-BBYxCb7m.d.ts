import { c as CloseTrackedCdpTargetResult, n as ResolvedBrowserConfig, p as BrowserTabOwnership } from "./config-CuUAQuKO.js";
//#region extensions/browser/src/browser/session-tab-store.d.ts
type BrowserSessionTabRecord = {
  version: 1;
  sessionKey: string;
  nativeTargetId: string;
  profile: string;
  profileAliases?: string[];
  profileFingerprint: string;
  browserInstanceFingerprint: string;
  interactionTargetKind: "native" | "opaque";
  trackedAt: number;
  lastUsedAt: number;
  cleanupRequestedAt?: number;
  cleanupAttemptToken?: string;
  cleanupKind?: "lifecycle" | "sweep";
};
//#endregion
//#region extensions/browser/src/browser/session-tab-registry.d.ts
type SessionTabParams = {
  sessionKey?: string;
  targetId?: string;
  nativeTargetId?: string;
  baseUrl?: string;
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