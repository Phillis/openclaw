import { r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { c as SessionEntry } from "../types-Byd4mWhx.js";
import { n as CommandArgs, t as CommandArgValues } from "../commands-args.types-zglMcgeO.js";
import { Fa as formatFastModeCurrentStatus, Ia as formatFastModeSourceSuffix, La as formatFastModeStatusValue, Pa as formatFastModeCommandOptions, ca as resolveControlCommandGate, ja as resolveFastModeState, sa as resolveCommandAuthorizedFromAuthorizers } from "../host-capability-types-3XBDy-df.js";
import { a as CommandArgsParsing, l as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "../commands-registry.types-87Jvhqdl.js";
import { i as shouldComputeCommandAuthorized, t as hasControlCommand } from "../command-detection-Dj3JSmrN.js";
import { _ as maybeResolveTextAlias, a as formatCommandArgMenuTitle, c as listNativeCommandSpecsForConfig, d as resolveCommandArgChoices, f as resolveCommandArgMenu, i as findCommandByNativeName, p as serializeCommandArgs, r as buildCommandTextFromArgs, s as listNativeCommandSpecs, u as parseCommandArgs, v as normalizeCommandBody, x as listChatCommands } from "../commands-registry-OVNjMcAc.js";
import { i as resolveCommandAuthorization, n as resolveStoredModelOverride, o as resolveNativeCommandSessionTargets, r as CommandAuthorization } from "../stored-model-override-CJJZweOk.js";
import { t as ModelsProviderData } from "../commands-models-BbsZBMjU.js";
import { t as listSkillCommandsForAgents } from "../chat-commands-BSSq65Y7.js";
import { n as listProviderPluginCommandSpecs } from "../command-specs-SQPQqZZH.js";

//#region src/agents/thinking-runtime.d.ts
/** Resolves an explicit session override before configured model/provider policy. */
declare function resolveEffectiveAgentRuntime(params: {
  cfg: OpenClawConfig;
  provider: string;
  modelId: string;
  modelApi?: string | null;
  modelBaseUrl?: unknown;
  agentId?: string;
  sessionKey?: string;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride">;
}): string;
//#endregion
export { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type ModelsProviderData, type NativeCommandSpec, buildCommandTextFromArgs, findCommandByNativeName, formatCommandArgMenuTitle, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, hasControlCommand, listChatCommands, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listSkillCommandsForAgents, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveEffectiveAgentRuntime, resolveFastModeState, resolveNativeCommandSessionTargets, resolveStoredModelOverride, serializeCommandArgs, shouldComputeCommandAuthorized };