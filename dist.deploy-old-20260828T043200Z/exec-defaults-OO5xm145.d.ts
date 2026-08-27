import "./types.openclaw-Cjm06lg9.js";
import { Ct as ExecSecurity, St as ExecMode, bt as ExecAsk, wt as ExecTarget } from "./approval-types-B-BXuih1.js";
import { c as SessionEntry } from "./types-CNsppBy_.js";
import "./sessions-D0GtEQ5l.js";
//#region src/agents/exec-defaults.d.ts
/** Session-scoped exec fields that may be carried across an isolated runtime boundary. */
type ExecSessionDefaults = Pick<SessionEntry, "execHost" | "execSecurity" | "execAsk" | "execNode" | "execCwd" | "permissionMode" | "sandbox">;
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