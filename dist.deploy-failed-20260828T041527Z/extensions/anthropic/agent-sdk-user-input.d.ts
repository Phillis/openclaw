import { R as CliBackendExecuteContext } from "../../plugin-entry-CX5-Xb96.js";
import "../../cli-backend-BYDmWJ4D.js";
import { PermissionResult } from "@anthropic-ai/claude-agent-sdk";
//#region extensions/anthropic/agent-sdk-user-input.d.ts
declare function createClaudeAgentSdkUserInputAuthorizer(context: CliBackendExecuteContext): {
  authorize(params: {
    input: Record<string, unknown>;
    signal: AbortSignal;
    toolUseId?: string;
  }): Promise<PermissionResult>;
};
//#endregion
export { createClaudeAgentSdkUserInputAuthorizer };