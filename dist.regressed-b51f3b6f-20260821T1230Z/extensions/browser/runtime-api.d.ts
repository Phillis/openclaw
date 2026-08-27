import { g as OpenClawPluginApi, t as definePluginEntry, v as OpenClawPluginToolContext, wt as AnyAgentTool, y as OpenClawPluginToolFactory } from "../../plugin-entry-BvodcAaE.js";
import { a as resolveBrowserConfig, d as BrowserStatus, f as BrowserTab, h as SnapshotAriaNode, m as BrowserTransport, n as ResolvedBrowserConfig, o as resolveProfile, r as ResolvedBrowserProfile, s as DEFAULT_UPLOAD_DIR, u as BrowserOpenResult } from "../../config-CuUAQuKO.js";
import { n as redactCdpUrl } from "../../browser-cdp-DwylMUCX.js";
import { a as DEFAULT_OPENCLAW_BROWSER_COLOR, i as DEFAULT_BROWSER_EVALUATE_ENABLED, s as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, t as DEFAULT_AI_SNAPSHOT_MAX_CHARS } from "../../constants-BywpsJWt.js";
import { n as ensureBrowserControlAuth, r as resolveBrowserControlAuth } from "../../control-auth-CYe3ODin.js";
import { a as resolveGoogleChromeExecutableForPlatform, n as parseBrowserMajorVersion, r as readBrowserVersion, t as BrowserExecutable } from "../../sdk-setup-tools-DeIcctYZ.js";
import { n as trackSessionBrowserTab, r as untrackSessionBrowserTab, t as closeTrackedBrowserTabsForSessions } from "../../session-tab-registry-BBYxCb7m.js";
import { t as movePathToTrash } from "../../trash-Xk5ha1PQ.js";
import { A as AnnotationItem, C as browserConsoleMessages, D as BrowserActionTabResult, E as BrowserActionPathResult, O as BrowserBatchAbort, S as getBrowserProfileCapabilities, T as BrowserActionOk, _ as startBrowserBridgeServer, a as installBrowserCommonMiddleware, b as BrowserServerState, c as BrowserRouteRegistrar, d as startBrowserControlServiceFromConfig, f as stopBrowserControlService, g as BrowserBridge, h as runBrowserProxyCommand, i as installBrowserAuthMiddleware, j as BrowserDownloadResult, k as BrowserBatchActionResult, l as createBrowserRuntimeState, m as getBrowserControlState, n as browserHandlers, o as createBrowserRouteDispatcher, p as createBrowserControlContext, r as handleBrowserGatewayRequest, s as registerBrowserRoutes, t as createBrowserPluginService, u as stopBrowserRuntime, v as stopBrowserBridgeServer, w as browserPdfSave, x as createBrowserTool, y as createBrowserRouteContext } from "../../plugin-service-DMJU2dgo.js";
import { Command } from "commander";

//#region node_modules/@openclaw/fs-safe/dist/root-paths.d.ts
type InvalidPathResult = {
  ok: false;
  error: string;
};
type ResolvePathsWithinRootParams = {
  rootDir: string;
  requestedPaths: string[];
  scopeLabel: string;
};
type ResolvePathsWithinRootResult = {
  ok: true;
  paths: string[];
} | InvalidPathResult;
declare function resolveExistingPathsWithinRoot(params: ResolvePathsWithinRootParams): Promise<ResolvePathsWithinRootResult>;
//#endregion
//#region extensions/browser/src/browser/client-actions.types.d.ts
/**
 * Browser action request types.
 *
 * Defines the closed action union accepted by browser-control `/act` routes and
 * reused by the Browser agent tool.
 */
/** Form field descriptor used by fill actions. */
type BrowserFormField = {
  ref: string;
  type: string;
  value?: string | number | boolean;
};
/** Normalized browser action request sent to the control server. */
type BrowserActRequest = {
  kind: "click";
  ref?: string;
  selector?: string;
  targetId?: string;
  doubleClick?: boolean;
  button?: string;
  modifiers?: string[];
  delayMs?: number;
  timeoutMs?: number;
} | {
  kind: "clickCoords";
  x: number;
  y: number;
  targetId?: string;
  doubleClick?: boolean;
  button?: string;
  delayMs?: number;
  timeoutMs?: number;
} | {
  kind: "type";
  ref?: string;
  selector?: string;
  text: string;
  targetId?: string;
  submit?: boolean;
  slowly?: boolean;
  timeoutMs?: number;
} | {
  kind: "press";
  key: string;
  targetId?: string;
  delayMs?: number;
} | {
  kind: "hover";
  ref?: string;
  selector?: string;
  targetId?: string;
  timeoutMs?: number;
} | {
  kind: "scrollIntoView";
  ref?: string;
  selector?: string;
  targetId?: string;
  timeoutMs?: number;
} | {
  kind: "drag";
  startRef?: string;
  startSelector?: string;
  endRef?: string;
  endSelector?: string;
  targetId?: string;
  timeoutMs?: number;
} | {
  kind: "select";
  ref?: string;
  selector?: string;
  values: string[];
  targetId?: string;
  timeoutMs?: number;
} | {
  kind: "fill";
  fields: BrowserFormField[];
  targetId?: string;
  timeoutMs?: number;
} | {
  kind: "resize";
  width: number;
  height: number;
  targetId?: string;
} | {
  kind: "wait";
  timeMs?: number;
  text?: string;
  textGone?: string;
  selector?: string;
  url?: string;
  loadState?: "load" | "domcontentloaded" | "networkidle";
  fn?: string;
  targetId?: string;
  timeoutMs?: number;
} | {
  kind: "evaluate";
  fn: string;
  ref?: string;
  targetId?: string;
  timeoutMs?: number;
} | {
  kind: "close";
  targetId?: string;
} | {
  kind: "batch";
  actions: BrowserActRequest[];
  targetId?: string;
  stopOnError?: boolean;
};
//#endregion
//#region extensions/browser/src/browser/client-actions-core.d.ts
type BrowserActResponse = {
  ok: true;
  targetId: string;
  url?: string;
  result?: unknown;
  results?: BrowserBatchActionResult[];
  aborted?: BrowserBatchAbort;
  blockedByDialog?: boolean;
  browserState?: unknown; /** Download info when a click/batch/evaluate action triggers a browser download. */
  downloads?: BrowserDownloadResult[];
};
/** Navigate a browser tab through the control server. */
declare function browserNavigate(baseUrl: string | undefined, opts: {
  url: string;
  targetId?: string;
  timeoutMs?: number;
  profile?: string;
}): Promise<BrowserActionTabResult>;
/** Arm a one-shot browser dialog handler. */
declare function browserArmDialog(baseUrl: string | undefined, opts: {
  accept: boolean;
  promptText?: string;
  dialogId?: string;
  targetId?: string;
  timeoutMs?: number;
  profile?: string;
}): Promise<BrowserActionOk>;
/** Arm or execute a browser file chooser upload. */
declare function browserArmFileChooser(baseUrl: string | undefined, opts: {
  paths: string[];
  ref?: string;
  inputRef?: string;
  element?: string;
  targetId?: string;
  timeoutMs?: number;
  profile?: string;
}): Promise<BrowserActionOk>;
/** Execute one normalized browser action request. */
declare function browserAct(baseUrl: string | undefined, req: BrowserActRequest, opts?: {
  profile?: string;
  timeoutMs?: number;
}): Promise<BrowserActResponse>;
/** Capture a screenshot through the browser control server. */
declare function browserScreenshotAction(baseUrl: string | undefined, opts: {
  targetId?: string;
  fullPage?: boolean;
  ref?: string;
  element?: string;
  type?: "png" | "jpeg";
  labels?: boolean;
  timeoutMs?: number;
  profile?: string;
}): Promise<BrowserActionPathResult>;
//#endregion
//#region extensions/browser/src/browser/doctor.d.ts
type BrowserDoctorCheckStatus = "pass" | "warn" | "fail" | "info";
/** One browser doctor check result. */
type BrowserDoctorCheck = {
  id: string;
  label: string;
  status: BrowserDoctorCheckStatus;
  summary: string;
  fixHint?: string;
};
/** Browser doctor report returned by browser-control clients. */
type BrowserDoctorReport = {
  ok: boolean;
  profile: string;
  transport: BrowserTransport;
  checks: BrowserDoctorCheck[];
  status: BrowserStatus;
};
//#endregion
//#region extensions/browser/src/browser/client.d.ts
/** Profile status record returned by browser profile listing. */
type ProfileStatus = {
  name: string;
  transport?: BrowserTransport;
  cdpPort: number | null;
  cdpUrl: string | null;
  color: string;
  driver: "openclaw" | "existing-session" | "extension";
  running: boolean;
  tabCount: number;
  isDefault: boolean;
  isRemote: boolean;
  missingFromConfig?: boolean;
  reconcileReason?: string | null;
};
/** Result returned when a managed browser profile directory is reset. */
type BrowserResetProfileResult = {
  ok: true;
  moved: boolean;
  from: string;
  to?: string;
};
/** Snapshot response returned by browserSnapshot. */
type SnapshotResult = {
  ok: true;
  format: "aria";
  targetId: string;
  url: string;
  nodes: SnapshotAriaNode[];
  truncated?: boolean;
  blockedByDialog?: boolean;
  browserState?: unknown;
} | {
  ok: true;
  format: "ai";
  targetId: string;
  url: string;
  snapshot: string;
  truncated?: boolean;
  newElements?: number;
  refs?: Record<string, {
    role: string;
    name?: string;
    nth?: number;
  }>;
  stats?: {
    lines: number;
    chars: number;
    refs: number;
    interactive: number;
  };
  labels?: boolean;
  labelsCount?: number;
  labelsSkipped?: number;
  /**
   * Per-ref bounding boxes when labels=true. Coordinates are in the
   * captured image's space. Omitted when empty.
   */
  annotations?: AnnotationItem[];
  imagePath?: string;
  imageType?: "png" | "jpeg";
  blockedByDialog?: boolean;
  browserState?: unknown;
};
/** Read browser-control status for the selected profile. */
declare function browserStatus(baseUrl?: string, opts?: {
  profile?: string;
  timeoutMs?: number;
}): Promise<BrowserStatus>;
/** Run browser doctor checks for the selected profile. */
declare function browserDoctor(baseUrl?: string, opts?: {
  profile?: string;
  deep?: boolean;
}): Promise<BrowserDoctorReport>;
/** List configured browser profiles and their current status. */
declare function browserProfiles(baseUrl?: string, opts?: {
  timeoutMs?: number;
}): Promise<ProfileStatus[]>;
/** Start the selected browser profile. */
declare function browserStart(baseUrl?: string, opts?: {
  profile?: string;
  timeoutMs?: number;
}): Promise<void>;
/** Stop the selected browser profile. */
declare function browserStop(baseUrl?: string, opts?: {
  profile?: string;
  timeoutMs?: number;
}): Promise<void>;
/** Reset the selected managed browser profile directory. */
declare function browserResetProfile(baseUrl?: string, opts?: {
  profile?: string;
}): Promise<BrowserResetProfileResult>;
/** Result returned after creating a browser profile. */
type BrowserCreateProfileResult = {
  ok: true;
  profile: string;
  transport?: BrowserTransport;
  cdpPort: number | null;
  cdpUrl: string | null;
  userDataDir: string | null;
  color: string;
  isRemote: boolean;
};
/** Create and persist a browser profile. */
declare function browserCreateProfile(baseUrl: string | undefined, opts: {
  name: string;
  color?: string;
  cdpUrl?: string;
  userDataDir?: string;
  driver?: "openclaw" | "existing-session";
}): Promise<BrowserCreateProfileResult>;
/** Result returned after deleting a browser profile. */
type BrowserDeleteProfileResult = {
  ok: true;
  profile: string;
  deleted: boolean;
};
/** Delete a configured browser profile. */
declare function browserDeleteProfile(baseUrl: string | undefined, profile: string): Promise<BrowserDeleteProfileResult>;
/** List tabs for the selected browser profile. */
declare function browserTabs(baseUrl?: string, opts?: {
  profile?: string;
  timeoutMs?: number;
}): Promise<BrowserTab[]>;
/** Open a new tab in the selected browser profile. */
declare function browserOpenTab(baseUrl: string | undefined, url: string, opts?: {
  profile?: string;
  label?: string;
  timeoutMs?: number;
}): Promise<BrowserOpenResult>;
/** Focus an existing browser tab. */
declare function browserFocusTab(baseUrl: string | undefined, targetId: string, opts?: {
  profile?: string;
  timeoutMs?: number;
}): Promise<{
  ok: true;
  targetId?: string;
}>;
/** Close an existing browser tab. */
declare function browserCloseTab(baseUrl: string | undefined, targetId: string, opts?: {
  profile?: string;
  timeoutMs?: number;
}): Promise<void>;
/** Execute legacy index-based tab actions. */
declare function browserTabAction(baseUrl: string | undefined, opts: {
  action: "list" | "new" | "close" | "select";
  index?: number;
  profile?: string;
}): Promise<unknown>;
/** Capture an ARIA or AI snapshot for the selected tab. */
declare function browserSnapshot(baseUrl: string | undefined, opts: {
  format?: "aria" | "ai";
  targetId?: string;
  limit?: number;
  maxChars?: number;
  refs?: "role" | "aria";
  interactive?: boolean;
  compact?: boolean;
  depth?: number;
  selector?: string;
  frame?: string;
  labels?: boolean;
  urls?: boolean;
  mode?: "efficient";
  profile?: string;
  timeoutMs?: number;
}): Promise<SnapshotResult>;
//#endregion
//#region extensions/browser/src/browser-proxy-envelope.d.ts
type BrowserProxyFile = {
  path: string;
  base64: string;
  mimeType?: string;
};
//#endregion
//#region extensions/browser/src/browser/proxy-files.d.ts
/** Persist proxy-returned files and return a remote-path to local-path map. */
declare function persistBrowserProxyFiles(files: BrowserProxyFile[] | undefined): Promise<Map<string, string>>;
/** Rewrite every supported result path that points at a persisted proxy file. */
declare function applyBrowserProxyPaths(result: unknown, mapping: Map<string, string>): void;
//#endregion
//#region extensions/browser/src/browser/request-policy.d.ts
type BrowserRequestProfileParams = {
  query?: Record<string, unknown>;
  body?: unknown;
  profile?: string | null;
};
/** Normalizes route paths so mutation-policy checks compare stable slash forms. */
declare function normalizeBrowserRequestPath(value: string): string;
/** Returns true when a control request mutates persistent browser profile state. */
declare function isPersistentBrowserProfileMutation(method: string, path: string): boolean;
/** Resolves the requested profile from query, body, or route defaults. */
declare function resolveRequestedBrowserProfile(params: BrowserRequestProfileParams): string | undefined;
//#endregion
//#region extensions/browser/src/browser/form-fields.d.ts
type BrowserFormFieldValue = NonNullable<BrowserFormField["value"]>;
/** Normalize a form field value to the types accepted by fill actions. */
declare function normalizeBrowserFormFieldValue(value: unknown): BrowserFormFieldValue | undefined;
/** Normalize one form field descriptor from untrusted route/tool input. */
declare function normalizeBrowserFormField(record: Record<string, unknown>): BrowserFormField | null;
//#endregion
//#region extensions/browser/src/attached-browser-tool-runtime.d.ts
type AttachedBrowserToolRuntime = {
  tool: AnyAgentTool;
  dispose: () => Promise<void>;
};
type CreateAttachedBrowserToolRuntimeParams = {
  cdpUrl: string;
  ensureAttachTarget: () => Promise<void>;
  agentSessionKey?: string;
  agentDir?: string;
  workspaceDir: string;
};
/** Create a normal Browser agent tool pinned to one raw, attach-only CDP profile. */
declare function createAttachedBrowserToolRuntime(params: CreateAttachedBrowserToolRuntimeParams): Promise<AttachedBrowserToolRuntime>;
//#endregion
//#region extensions/browser/src/cli/browser-cli.d.ts
/** Registers the Browser CLI command and its lazy-loaded subcommand groups. */
declare function registerBrowserCli(program: Command, argv?: string[], pluginRoot?: string): void;
//#endregion
export { type AttachedBrowserToolRuntime, type BrowserBridge, type BrowserCreateProfileResult, type BrowserDeleteProfileResult, type BrowserDoctorCheck, type BrowserDoctorReport, type BrowserExecutable, type BrowserFormField, type BrowserResetProfileResult, type BrowserRouteRegistrar, type BrowserServerState, type BrowserStatus, type BrowserTab, type BrowserTransport, type CreateAttachedBrowserToolRuntimeParams, DEFAULT_AI_SNAPSHOT_MAX_CHARS, DEFAULT_BROWSER_EVALUATE_ENABLED, DEFAULT_OPENCLAW_BROWSER_COLOR, DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, DEFAULT_UPLOAD_DIR, type OpenClawPluginApi, type OpenClawPluginToolContext, type OpenClawPluginToolFactory, type ProfileStatus, type ResolvedBrowserConfig, type ResolvedBrowserProfile, type SnapshotResult, applyBrowserProxyPaths, browserAct, browserArmDialog, browserArmFileChooser, browserCloseTab, browserConsoleMessages, browserCreateProfile, browserDeleteProfile, browserDoctor, browserFocusTab, browserHandlers, browserNavigate, browserOpenTab, browserPdfSave, browserProfiles, browserResetProfile, browserScreenshotAction, browserSnapshot, browserStart, browserStatus, browserStop, browserTabAction, browserTabs, closeTrackedBrowserTabsForSessions, createAttachedBrowserToolRuntime, createBrowserControlContext, createBrowserPluginService, createBrowserRouteContext, createBrowserRouteDispatcher, createBrowserRuntimeState, createBrowserTool, definePluginEntry, ensureBrowserControlAuth, getBrowserControlState, getBrowserProfileCapabilities, handleBrowserGatewayRequest, installBrowserAuthMiddleware, installBrowserCommonMiddleware, isPersistentBrowserProfileMutation, movePathToTrash, normalizeBrowserFormField, normalizeBrowserFormFieldValue, normalizeBrowserRequestPath, parseBrowserMajorVersion, persistBrowserProxyFiles, readBrowserVersion, redactCdpUrl, registerBrowserCli, registerBrowserRoutes, resolveBrowserConfig, resolveBrowserControlAuth, resolveExistingPathsWithinRoot, resolveGoogleChromeExecutableForPlatform, resolveProfile, resolveRequestedBrowserProfile, runBrowserProxyCommand, startBrowserBridgeServer, startBrowserControlServiceFromConfig, stopBrowserBridgeServer, stopBrowserControlService, stopBrowserRuntime, trackSessionBrowserTab, untrackSessionBrowserTab };