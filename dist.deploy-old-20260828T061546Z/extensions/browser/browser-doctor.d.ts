import { n as OpenClawConfig } from "../../types.openclaw-n6JIVcIK.js";
import "../../config-DIBSe6nQ.js";
import { i as resolveBrowserExecutableForPlatform } from "../../sdk-setup-tools-BaagudkT.js";
//#region packages/terminal-core/src/note.d.ts
declare function note(message: unknown, title?: string): void;
//#endregion
//#region extensions/browser/src/doctor-browser.d.ts
/** Legacy managed clawd profile paths that can be archived by doctor --fix. */
type LegacyClawdBrowserProfileResidue = {
  legacyProfileDir: string;
  legacyUserDataDir: string;
  canonicalUserDataDir: string;
};
type BrowserDoctorFilesystemDeps = {
  configDir?: string;
  pathExists?: (targetPath: string) => boolean;
  movePathToTrash?: (targetPath: string) => Promise<string>;
};
/** Detects unmanaged legacy clawd browser profile residue on disk. */
declare function detectLegacyClawdBrowserProfileResidue(cfg: OpenClawConfig, deps?: BrowserDoctorFilesystemDeps): LegacyClawdBrowserProfileResidue | null;
/** Emits Browser doctor notes for Chrome MCP, managed Chrome, and legacy residue readiness. */
declare function noteChromeMcpBrowserReadiness(cfg: OpenClawConfig, deps?: {
  platform?: NodeJS.Platform;
  noteFn?: typeof note;
  env?: NodeJS.ProcessEnv;
  getUid?: () => number;
  resolveManagedExecutable?: typeof resolveBrowserExecutableForPlatform;
  resolveChromeExecutable?: (platform: NodeJS.Platform) => {
    path: string;
  } | null;
  readVersion?: (executablePath: string) => string | null;
  configDir?: string;
  pathExists?: (targetPath: string) => boolean;
  homeDir?: string;
}): Promise<void>;
/** Repair only an already-owned native-host registration during doctor --fix. */
declare function maybeRepairOwnedChromeExtensionNativeHosts(): Promise<{
  changes: string[];
  warnings: string[];
}>;
/** Archives legacy clawd browser profile residue when doctor --fix is requested. */
declare function maybeArchiveLegacyClawdBrowserProfileResidue(cfg: OpenClawConfig, deps?: BrowserDoctorFilesystemDeps): Promise<{
  changes: string[];
  warnings: string[];
}>;
//#endregion
export { type LegacyClawdBrowserProfileResidue, detectLegacyClawdBrowserProfileResidue, maybeArchiveLegacyClawdBrowserProfileResidue, maybeRepairOwnedChromeExtensionNativeHosts, noteChromeMcpBrowserReadiness };