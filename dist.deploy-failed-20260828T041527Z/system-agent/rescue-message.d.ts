import { i as OpenClawConfig } from "../types.openclaw-Bon4guJK.js";
import { Mt as CommandContext, p as SystemAgentCommandDeps } from "../types-C6qw56EZ.js";
//#region src/system-agent/rescue-message.d.ts
/** Input required to process one possible `/openclaw` rescue message. */
type SystemAgentRescueMessageInput = {
  cfg: OpenClawConfig;
  command: CommandContext;
  commandBody: string;
  agentId?: string;
  isGroup: boolean;
  env?: NodeJS.ProcessEnv;
  deps?: SystemAgentCommandDeps;
};
/** Extract the command body after `/openclaw`, or null when the message is not for rescue. */
declare function extractSystemAgentRescueMessage(commandBody: string): string | null;
/** Process one rescue message and return a reply, or null when not a rescue command. */
declare function runSystemAgentRescueMessage(input: SystemAgentRescueMessageInput): Promise<string | null>;
//#endregion
export { extractSystemAgentRescueMessage, runSystemAgentRescueMessage };