import { R as CliBackendExecuteContext } from "../../plugin-entry-CX5-Xb96.js";
import "../../cli-backend-BYDmWJ4D.js";
//#region extensions/anthropic/agent-sdk.runtime.d.ts
type ClaudeAgentSdkSecretInput = {
  fd: 3;
  createData: () => Buffer;
};
declare function executeClaudeAgentSdk(context: CliBackendExecuteContext, secretInput?: ClaudeAgentSdkSecretInput): AsyncIterable<Record<string, unknown>>;
//#endregion
export { executeClaudeAgentSdk };