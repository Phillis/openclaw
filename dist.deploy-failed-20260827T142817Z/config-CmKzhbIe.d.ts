import { T as BrowserProfileConfig, n as OpenClawConfig, w as BrowserConfig } from "./types.openclaw-VfFCsbZD.js";
import { r as SsrFPolicy } from "./ssrf-CIroieCz.js";
import { lookup } from "node:dns";
import { Command } from "commander";

//#region extensions/browser/src/browser/client.types.d.ts
type BrowserCdpLookup = typeof lookup;
/** Browser transport backing the selected profile. */
type BrowserTransport = "cdp" | "chrome-mcp" | "extension";
type BrowserHeadlessSource = "request" | "env" | "profile" | "config" | "linux-display-fallback" | "default";
type BrowserGraphicsAcceleration = "hardware" | "software" | "unknown";
type BrowserGraphicsDevice = {
  vendorId: number;
  deviceId: number;
  vendor: string;
  device: string;
  driverVendor: string;
  driverVersion: string;
};
type BrowserVideoDecodeCapability = {
  profile: string;
  minResolution: {
    width: number;
    height: number;
  };
  maxResolution: {
    width: number;
    height: number;
  };
};
type BrowserVideoEncodeCapability = {
  profile: string;
  maxResolution: {
    width: number;
    height: number;
  };
  maxFramerateNumerator: number;
  maxFramerateDenominator: number;
};
type BrowserGraphicsDiagnostics = {
  status: "available";
  observedAt: number;
  acceleration: BrowserGraphicsAcceleration;
  renderer: string | null;
  vendor: string | null;
  version: string | null;
  backend: string | null;
  devices: BrowserGraphicsDevice[];
  featureStatus: Record<string, string>;
  disabledFeatures: Array<{
    feature: string;
    status: string;
  }>;
  driverBugWorkarounds: string[];
  videoDecoding: BrowserVideoDecodeCapability[];
  videoEncoding: BrowserVideoEncodeCapability[];
} | {
  status: "unavailable";
  observedAt: number;
  reason: string;
};
type BrowserTabOwnership = {
  status: "durable";
  nativeTargetId: string;
  profileFingerprint: string;
  browserInstanceFingerprint: string;
} | {
  status: "non-durable";
  reason: "explicit-cdp-url-required" | "target-marker-not-unique" | "target-marker-lookup-failed" | "target-lookup-failed" | "browser-identity-unavailable" | "browser-identity-lookup-failed";
};
/** Browser status response returned by the control server. */
type BrowserStatus = {
  enabled: boolean;
  profile?: string;
  driver?: "openclaw" | "existing-session" | "extension";
  transport?: BrowserTransport;
  running: boolean;
  cdpReady?: boolean;
  cdpHttp?: boolean;
  /**
   * For Chrome MCP existing-session profiles, true only if a page-level tool
   * round-trip (`list_pages`) completes; for managed CDP profiles, mirrors
   * `cdpReady`. Distinguishes "transport handshake passed" from "page tools
   * are actually usable".
   */
  pageReady?: boolean;
  pid: number | null;
  cdpPort: number | null;
  cdpUrl?: string | null;
  chosenBrowser: string | null;
  detectedBrowser?: string | null;
  detectedExecutablePath?: string | null;
  detectError?: string | null;
  userDataDir: string | null;
  color: string;
  headless: boolean;
  headlessSource?: BrowserHeadlessSource;
  noSandbox?: boolean;
  executablePath?: string | null;
  attachOnly: boolean;
  /**
   * Cached process-lifetime diagnostics for a locally launched managed browser.
   * Passive status calls never launch a browser to populate this field.
   */
  graphics?: BrowserGraphicsDiagnostics | null;
};
/** Browser tab record exposed by tab listing and tab mutation endpoints. */
type BrowserTab = {
  /** Best handle for agents to pass back as targetId: label, then tabId, then raw targetId. */suggestedTargetId?: string;
  targetId: string; /** Stable, human-friendly tab handle for this profile runtime (for example t1). */
  tabId?: string; /** Optional user-assigned tab label. */
  label?: string;
  title: string;
  url: string;
  wsUrl?: string; /** Internal CDP lookup pin paired with wsUrl; omitted from model-facing summaries. */
  wsLookup?: BrowserCdpLookup;
  type?: string;
};
/** Internal tab-open result. Browser tools must remove internal metadata before model output. */
type BrowserOpenResult = BrowserTab & {
  ownership?: BrowserTabOwnership;
  resolvedProfile?: string;
};
/** ARIA snapshot node exposed in structured snapshot responses. */
type SnapshotAriaNode = {
  ref: string;
  role: string;
  name: string;
  value?: string;
  description?: string;
  backendDOMNodeId?: number;
  depth: number;
};
//#endregion
//#region extensions/browser/src/browser/cdp.helpers.d.ts
type CloseTrackedCdpTargetResult = {
  status: "cancelled" | "closed" | "missing" | "ownership-mismatch";
} | {
  status: "unavailable";
  reason: Extract<BrowserTabOwnership, {
    status: "non-durable";
  }>["reason"] | "target-close-failed";
};
//#endregion
//#region extensions/browser/src/browser/paths.d.ts
/** Default root directory for browser upload inputs. */
declare const DEFAULT_UPLOAD_DIR: string;
//#endregion
//#region extensions/browser/src/browser/config.d.ts
/** Browser config after defaults, derived ports, and profile defaults are applied. */
type ResolvedBrowserConfig = {
  enabled: boolean;
  evaluateEnabled: boolean;
  controlPort: number;
  cdpPortRangeStart: number;
  cdpPortRangeEnd: number;
  cdpProtocol: "http" | "https";
  cdpHost: string;
  cdpIsLoopback: boolean;
  remoteCdpTimeoutMs: number;
  remoteCdpHandshakeTimeoutMs: number;
  localLaunchTimeoutMs: number;
  localCdpReadyTimeoutMs: number;
  actionTimeoutMs: number;
  color: string;
  executablePath?: string;
  headless: boolean;
  headlessSource?: "config" | "default";
  noSandbox: boolean;
  attachOnly: boolean;
  defaultProfile: string;
  profiles: Record<string, BrowserProfileConfig>;
  tabCleanup: ResolvedBrowserTabCleanupConfig;
  ssrfPolicy?: SsrFPolicy;
  extraArgs: string[]; /** Default loopback port for extension-driver relay servers. */
  extensionRelayDefaultPort: number; /** Assigned loopback relay port per extension-driver profile (no explicit cdpPort). */
  extensionRelayPorts: Record<string, number>; /** Extension relay authentication compatibility policy. */
  extensionRelay: {
    allowLegacyAuth: boolean;
  }; /** Per-profile process-only Basic credentials for internal browser clients. */
  extensionRelayInternalTokens: Record<string, string>; /** Persistent relay HMAC key (absent until pairing or relay startup creates it). */
  extensionRelayToken?: string;
};
/** Normalized tab-cleanup settings for session-owned browser tabs. */
type ResolvedBrowserTabCleanupConfig = {
  enabled: boolean;
  idleMinutes: number;
  maxTabsPerSession: number;
  sweepMinutes: number;
};
/** Runtime browser profile settings resolved from global and profile config. */
type ResolvedBrowserProfile = {
  name: string;
  cdpPort: number;
  cdpUrl: string;
  cdpHost: string;
  cdpIsLoopback: boolean;
  userDataDir?: string;
  mcpCommand?: string;
  mcpArgs?: string[];
  color: string;
  driver: "openclaw" | "existing-session" | "extension";
  executablePath?: string;
  headless: boolean;
  headlessSource?: "profile" | "config" | "default";
  attachOnly: boolean;
};
/** Source that determined managed Chrome headless mode. */
type ManagedBrowserHeadlessSource = "request" | "env" | "profile" | "config" | "linux-display-fallback" | "default";
/** Resolve raw browser config into runtime browser defaults. */
declare function resolveBrowserConfig(cfg: BrowserConfig | undefined, rootConfig?: OpenClawConfig): ResolvedBrowserConfig;
/** Resolve one configured browser profile by name. */
declare function resolveProfile(resolved: ResolvedBrowserConfig, profileName: string): ResolvedBrowserProfile | null;
//#endregion
export { resolveBrowserConfig as a, CloseTrackedCdpTargetResult as c, BrowserStatus as d, BrowserTab as f, SnapshotAriaNode as h, ResolvedBrowserTabCleanupConfig as i, BrowserGraphicsDiagnostics as l, BrowserTransport as m, ResolvedBrowserConfig as n, resolveProfile as o, BrowserTabOwnership as p, ResolvedBrowserProfile as r, DEFAULT_UPLOAD_DIR as s, ManagedBrowserHeadlessSource as t, BrowserOpenResult as u };