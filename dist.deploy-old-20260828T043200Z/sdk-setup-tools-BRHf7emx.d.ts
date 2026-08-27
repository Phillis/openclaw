import "./acpx-BA25QFjp.js";
import "./types.openclaw-Ca71eRYk.js";
import "./types-D4D938Wk.js";
import "./setup-wizard-types-BoxqfOlR.js";
import "./types-d78mIH9j.js";
import "./runtime-env-lLLj49vk.js";
import { n as ResolvedBrowserConfig } from "./config-CTX5YdNS.js";
//#region extensions/browser/src/browser/chrome.executables.d.ts
/** Browser executable candidate with product metadata and filesystem path. */
type BrowserExecutable = {
  kind: "brave" | "canary" | "chromium" | "chrome" | "custom" | "edge";
  path: string;
};
/** Resolve the Google Chrome executable for a named platform when available. */
declare function resolveGoogleChromeExecutableForPlatform(platform: NodeJS.Platform): BrowserExecutable | null;
/** Read a browser executable version from platform metadata or a command-line probe. */
declare function readBrowserVersion(executablePath: string): string | null;
/** Parse a major browser version from a raw version string. */
declare function parseBrowserMajorVersion(rawVersion: string | null | undefined): number | null;
/** Resolve the preferred Chromium-family executable for a platform. */
declare function resolveBrowserExecutableForPlatform(resolved: ResolvedBrowserConfig, platform: NodeJS.Platform): BrowserExecutable | null;
//#endregion
export { resolveGoogleChromeExecutableForPlatform as a, resolveBrowserExecutableForPlatform as i, parseBrowserMajorVersion as n, readBrowserVersion as r, BrowserExecutable as t };