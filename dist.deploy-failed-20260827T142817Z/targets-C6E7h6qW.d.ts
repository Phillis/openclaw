import { d as MigrationProviderContext } from "./types-DYqBZyXL.js";
//#region src/plugin-sdk/migration-runtime.d.ts
/** Directories a migration provider writes imported agent data into. */
type PlannedMigrationTargets = {
  workspaceDir: string;
  stateDir: string;
  agentDir: string;
};
/**
 * Resolves default agent workspace/state/agent directories. Prefers the runtime resolver,
 * then configured agentDir (using effective-home resolution), then canonical state layout.
 */
declare function resolvePlannedMigrationTargets(ctx: MigrationProviderContext): PlannedMigrationTargets;
//#endregion
export { resolvePlannedMigrationTargets as n, PlannedMigrationTargets as t };