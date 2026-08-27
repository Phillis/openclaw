import { R as CliBackendExecuteContext } from "../../plugin-entry-BZAeuuKK.js";
import "../../cli-backend-eVESRQMA.js";
import { SDKUserMessage } from "@anthropic-ai/claude-agent-sdk";
//#region extensions/anthropic/agent-sdk-runtime-helpers.d.ts
declare function splitClaudeToolNames(value: string): string[];
declare function createClaudeAgentSdkUserMessage(context: CliBackendExecuteContext): SDKUserMessage;
//#endregion
export { createClaudeAgentSdkUserMessage, splitClaudeToolNames };