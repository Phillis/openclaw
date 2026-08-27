import "./types.openclaw-CflOMr0r.js";
import { Ct as ExecSecurity, St as ExecMode, bt as ExecAsk, wt as ExecTarget } from "./approval-types-CE7E0Chc.js";
import { c as SessionEntry } from "./types-CheMd8wT.js";
import "./sessions-IH61nUyJ.js";
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