import { r as OpenClawConfig } from "./types.openclaw-CflOMr0r.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-DRFVcTqK.js";
import { n as SkillCommandSpec } from "./types-BGVJFv2Y.js";
import { n as ExecSessionDefaults, t as ExecPolicyOverrides } from "./exec-defaults-A-JBj0wu.js";
//#region src/skills/discovery/chat-command-invocation.d.ts
/** Lists slash command names reserved by built-in chat commands and callers. */
declare function listReservedChatSlashCommandNames(extraNames?: string[]): Set<string>;
declare function resolveSkillCommandInvocation(params: {
  commandBodyNormalized: string;
  skillCommands: SkillCommandSpec[];
}): {
  command: SkillCommandSpec;
  args?: string;
  inline?: boolean;
} | null;
//#endregion
//#region src/skills/discovery/chat-commands.d.ts
declare function listSkillCommandsForWorkspace(params: {
  workspaceDir: string;
  cfg: OpenClawConfig;
  agentId?: string;
  skillFilter?: string[];
  sessionEntry?: ExecSessionDefaults;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
  includeAllowlistHidden?: boolean;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
}): SkillCommandSpec[];
declare function listSkillCommandsForAgents(params: {
  cfg: OpenClawConfig;
  agentIds?: string[];
  sessionEntry?: ExecSessionDefaults;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
}): SkillCommandSpec[];
//#endregion
export { resolveSkillCommandInvocation as i, listSkillCommandsForWorkspace as n, listReservedChatSlashCommandNames as r, listSkillCommandsForAgents as t };