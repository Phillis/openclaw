import { xo as SessionMaintenanceMode } from "./types.openclaw-woQof385.js";
//#region src/config/sessions/store-maintenance.d.ts
type SessionMaintenanceWarning = {
  activeSessionKey: string;
  activeUpdatedAt?: number;
  totalEntries: number;
  pruneAfterMs: number;
  maxEntries: number;
  wouldPrune: boolean;
  wouldCap: boolean;
};
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
type ResolvedSessionMaintenanceConfigInput = Omit<ResolvedSessionMaintenanceConfig, "modelRunPruneAfterMs"> & Partial<Pick<ResolvedSessionMaintenanceConfig, "modelRunPruneAfterMs">>;
//#endregion
//#region src/config/sessions/disk-budget.d.ts
type SessionDiskBudgetSweepResult = {
  totalBytesBefore: number;
  totalBytesAfter: number;
  removedFiles: number;
  removedEntries: number;
  freedBytes: number;
  maxBytes: number;
  highWaterBytes: number;
  overBudget: boolean;
};
//#endregion
//#region src/config/sessions/store-maintenance-operations.d.ts
type SessionMaintenanceApplyReport = {
  mode: ResolvedSessionMaintenanceConfig["mode"];
  beforeCount: number;
  afterCount: number;
  modelRunPruned: number;
  pruned: number;
  capped: number;
  diskBudget: SessionDiskBudgetSweepResult | null;
};
//#endregion
export { SessionMaintenanceWarning as i, ResolvedSessionMaintenanceConfig as n, ResolvedSessionMaintenanceConfigInput as r, SessionMaintenanceApplyReport as t };