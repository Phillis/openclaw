import { i as OpenClawConfig } from "../types.openclaw-woQof385.js";
import { L as CommandContext } from "../host-capability-types-BB7_xyrh.js";
import { t as SystemAgentCommandDeps } from "../operations-BTNI2ZO4.js";

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