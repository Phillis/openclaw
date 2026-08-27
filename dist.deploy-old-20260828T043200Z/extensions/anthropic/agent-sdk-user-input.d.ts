import { R as CliBackendExecuteContext } from "../../plugin-entry-BZAeuuKK.js";
import "../../cli-backend-eVESRQMA.js";
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