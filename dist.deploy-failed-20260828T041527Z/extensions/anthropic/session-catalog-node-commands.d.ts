import { Q as OpenClawPluginNodeHostCommandIo } from "../../plugin-entry-CX5-Xb96.js";
import "../../setup-wizard-types-D9afUG0f.js";
//#region extensions/anthropic/session-catalog-node-commands.d.ts
declare function listClaudeSessions(paramsJSON?: string | null): Promise<string>;
declare function readClaudeSession(paramsJSON?: string | null): Promise<string>;
declare function resumeClaudeSession(paramsJSON: string | null | undefined, io: OpenClawPluginNodeHostCommandIo | undefined): Promise<string>;
//#endregion
export { listClaudeSessions, readClaudeSession, resumeClaudeSession };