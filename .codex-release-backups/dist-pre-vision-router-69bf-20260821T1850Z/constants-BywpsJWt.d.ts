//#region extensions/browser/src/browser/constants.d.ts
/**
 * Browser default configuration constants.
 *
 * Shared defaults for config resolution, tool schemas, managed Chrome launch,
 * tab cleanup, screenshots, and AI snapshot sizing.
 */
/** Default enabled state for the browser plugin. */
declare const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Default JavaScript evaluation permission for managed browser actions. */
declare const DEFAULT_BROWSER_EVALUATE_ENABLED = true;
/** Default color for the managed OpenClaw browser profile. */
declare const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Default managed profile name shown to users. */
declare const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Default browser profile selected when no profile is requested. */
declare const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Default timeout for browser action execution. */
declare const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 60000;
/** Default maximum AI snapshot text size. */
declare const DEFAULT_AI_SNAPSHOT_MAX_CHARS = 40000;
//#endregion
export { DEFAULT_OPENCLAW_BROWSER_COLOR as a, DEFAULT_BROWSER_EVALUATE_ENABLED as i, DEFAULT_BROWSER_ACTION_TIMEOUT_MS as n, DEFAULT_OPENCLAW_BROWSER_ENABLED as o, DEFAULT_BROWSER_DEFAULT_PROFILE_NAME as r, DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME as s, DEFAULT_AI_SNAPSHOT_MAX_CHARS as t };