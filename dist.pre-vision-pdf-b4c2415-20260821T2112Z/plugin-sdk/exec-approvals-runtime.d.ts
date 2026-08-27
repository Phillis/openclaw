import { a as ExecApprovalsFile, c as ExecAsk, f as resolveExecModePolicy, o as ExecApprovalsResolved, s as ExecApprovalsSnapshot, u as ExecSecurity } from "../exec-approvals-core-CYhVMCan.js";

//#region src/infra/exec-approvals-contracts.d.ts
type ExecApprovalsDefaultOverrides = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
  requireSocket?: boolean;
};
//#endregion
//#region src/infra/exec-approvals-config.d.ts
declare function resolveExecApprovalsDisplayPath(): string;
//#endregion
//#region src/infra/exec-approvals-store.d.ts
declare function readExecApprovalsSnapshot(): ExecApprovalsSnapshot;
declare function loadExecApprovals(): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals.d.ts
declare function resolveExecApprovalsFromFile(params: {
  file: ExecApprovalsFile;
  agentId?: string;
  overrides?: ExecApprovalsDefaultOverrides;
  path?: string;
  socketPath?: string;
  token?: string;
}): ExecApprovalsResolved;
//#endregion
export { type ExecApprovalsFile, loadExecApprovals, readExecApprovalsSnapshot, resolveExecApprovalsDisplayPath, resolveExecApprovalsFromFile, resolveExecModePolicy };