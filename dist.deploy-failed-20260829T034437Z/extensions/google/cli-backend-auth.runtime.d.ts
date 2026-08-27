import { $t as CliBackendToolAvailability, Qt as CliBackendPreparedExecution } from "../../acpx-D5fMZfg0.js";
import "../../cli-backend-CEPvigee.js";
import { GeminiCliRestrictedAuthContext } from "./cli-backend-isolated-auth.runtime.js";
//#region extensions/google/cli-backend-auth.runtime.d.ts
type GeminiCliAuthHomeContext = GeminiCliRestrictedAuthContext & {
  agentDir?: string;
  authProfileId?: string;
  isolatedCompletionCwd?: string;
  toolAvailability?: CliBackendToolAvailability;
  isolatedCompletionModelId?: string;
  isolatedCompletionPrompt?: string;
  isolatedCompletionSystemPrompt?: string;
};
type GeminiCliPreparedExecution = CliBackendPreparedExecution & {
  isolatedCompletionEnforced?: true;
};
declare function prepareGeminiCliExecution(ctx: GeminiCliAuthHomeContext, credential: unknown): Promise<GeminiCliPreparedExecution | null>;
//#endregion
export { prepareGeminiCliExecution };