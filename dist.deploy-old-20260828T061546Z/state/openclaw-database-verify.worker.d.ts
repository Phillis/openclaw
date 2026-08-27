//#region src/state/openclaw-database-verify.worker.d.ts
type OpenClawDatabaseVerifyTarget = {
  path: string;
  kind: "agent" | "state";
  label: string;
};
type OpenClawDatabaseVerifyResult = {
  path: string;
  ok: boolean;
  error?: string;
  terminal?: boolean;
};
/** Verify database files serially so large agent scans never compete for I/O. */
declare function verifyOpenClawDatabases(targets: readonly OpenClawDatabaseVerifyTarget[]): Promise<OpenClawDatabaseVerifyResult[]>;
//#endregion
export { OpenClawDatabaseVerifyResult, OpenClawDatabaseVerifyTarget, verifyOpenClawDatabases };