import { R as CliBackendExecuteContext } from "../../plugin-entry-BZAeuuKK.js";
import "../../cli-backend-eVESRQMA.js";
//#region extensions/anthropic/agent-sdk.runtime.d.ts
type ClaudeAgentSdkSecretInput = {
  fd: 3;
  createData: () => Buffer;
};
declare function executeClaudeAgentSdk(context: CliBackendExecuteContext, secretInput?: ClaudeAgentSdkSecretInput): AsyncIterable<Record<string, unknown>>;
//#endregion
export { executeClaudeAgentSdk };