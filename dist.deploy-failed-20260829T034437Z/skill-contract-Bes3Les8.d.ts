import "./types-Sg3pk96c.js";
//#region src/cron/scheduled-tool-policy.d.ts
/** Closed, server-authored origin of an account-scoped scheduled tool cap. */
type CronScheduledToolCallerOrigin = {
  kind: "external";
  channel: string;
} | {
  kind: "local";
} | {
  kind: "unknown";
};
/** Server-authored provenance for a persisted scheduled tool-cap authority envelope. */
type CronScheduledToolPolicy = {
  version: 1;
  mode: "trusted";
  ownerSessionKey?: never;
  ownerAccountId?: never;
} | {
  version: 1;
  mode: "account";
  ownerSessionKey: string;
  ownerAccountId: string;
};
//#endregion
//#region src/agents/sessions/source-info.d.ts
type SourceScope = "user" | "project" | "temporary";
type SourceOrigin = "package" | "top-level";
interface SourceInfo {
  path: string;
  source: string;
  scope: SourceScope;
  origin: SourceOrigin;
  baseDir?: string;
}
//#endregion
//#region src/skills/loading/skill-contract.d.ts
interface Skill {
  name: string;
  /** Human-readable title from the first Markdown H1, falling back to the identifier. */
  displayName?: string;
  description: string;
  /** Additional loading guidance rendered with the location in full and compact catalogs. */
  locationNote?: string;
  /** Runtime-only content for non-filesystem skill locators such as node://. */
  readContent?: string;
  filePath: string;
  baseDir: string;
  sourceInfo: SourceInfo;
  disableModelInvocation: boolean;
  source: string;
}
//#endregion
export { CronScheduledToolPolicy as i, SourceInfo as n, CronScheduledToolCallerOrigin as r, Skill as t };