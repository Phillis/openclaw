import { c as SessionEntry } from "./types-ByIHlRxL.js";
import { _ as ExecSecurity, g as ExecMode, m as ExecAsk, v as ExecTarget } from "./exec-approvals-core-ByvfWxmW.js";
//#region src/agents/exec-defaults.d.ts
/** Session-scoped exec fields that may be carried across an isolated runtime boundary. */
type ExecSessionDefaults = Pick<SessionEntry, "execHost" | "execSecurity" | "execAsk" | "execNode" | "execCwd">;
type ResolvedExecConfig = {
  host?: ExecTarget;
  mode?: ExecMode;
  security?: ExecSecurity;
  ask?: ExecAsk;
  node?: string;
};
type ExecPolicyOverrides = Omit<ResolvedExecConfig, "mode">;
//#endregion
export { ExecSessionDefaults as n, ExecPolicyOverrides as t };