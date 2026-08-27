import { b as ProviderReplayPolicyContext, x as ProviderSanitizeReplayHistoryContext, y as ProviderReplayPolicy } from "../../plugin-entry-C1So83n6.js";
import { mn as AgentMessage } from "../../setup-wizard-types-DVg7Zco4.js";
//#region extensions/github-copilot/replay-policy.d.ts
declare function stripCopilotAssistantThinkingMessages<T>(messages: T[]): T[];
declare function buildGithubCopilotReplayPolicy(ctx: ProviderReplayPolicyContext): ProviderReplayPolicy | undefined;
declare function sanitizeGithubCopilotReplayHistory(ctx: ProviderSanitizeReplayHistoryContext): AgentMessage[];
//#endregion
export { buildGithubCopilotReplayPolicy, sanitizeGithubCopilotReplayHistory, stripCopilotAssistantThinkingMessages };