import { St as OpenClawPluginNodeHostCommandIo } from "../../types-CbXjz50O.js";

//#region extensions/anthropic/session-catalog-node-commands.d.ts
declare function listClaudeSessions(paramsJSON?: string | null): Promise<string>;
declare function readClaudeSession(paramsJSON?: string | null): Promise<string>;
declare function resumeClaudeSession(paramsJSON: string | null | undefined, io: OpenClawPluginNodeHostCommandIo | undefined): Promise<string>;
//#endregion
export { listClaudeSessions, readClaudeSession, resumeClaudeSession };