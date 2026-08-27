import { Ba as formatFastModeCommandOptions, Ha as formatFastModeSourceSuffix, La as resolveFastModeState, Ua as formatFastModeStatusValue, Va as formatFastModeCurrentStatus, ii as resolveControlCommandGate, ri as resolveCommandAuthorizedFromAuthorizers } from "../agent-harness-runtime-D3DJE4wK.js";
import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import { c as SessionEntry } from "../types-CNsppBy_.js";
import { n as CommandArgs, t as CommandArgValues } from "../commands-args.types-zglMcgeO.js";
import "../sessions-D0GtEQ5l.js";
import { a as CommandArgsParsing, l as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "../commands-registry.types-ChGYKjh7.js";
import { i as shouldComputeCommandAuthorized, t as hasControlCommand } from "../command-detection-Cnp2HFkn.js";
import { _ as maybeResolveTextAlias, a as formatCommandArgMenuTitle, c as listNativeCommandSpecsForConfig, d as resolveCommandArgChoices, f as resolveCommandArgMenu, i as findCommandByNativeName, p as serializeCommandArgs, r as buildCommandTextFromArgs, s as listNativeCommandSpecs, u as parseCommandArgs, v as normalizeCommandBody, x as listChatCommands } from "../commands-registry-BTJxAzk5.js";
import { i as resolveCommandAuthorization, n as resolveStoredModelOverride, o as resolveNativeCommandSessionTargets, r as CommandAuthorization } from "../stored-model-overrides-CiboMJba.js";
import { t as ModelsProviderData } from "../commands-models-jqScdrAs.js";
import { t as listSkillCommandsForAgents } from "../chat-commands-D30i7Xo3.js";
import { n as listProviderPluginCommandSpecs } from "../command-specs-Co5dn5rF.js";
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
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked">;
}): string;
//#endregion
export { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type ModelsProviderData, type NativeCommandSpec, buildCommandTextFromArgs, findCommandByNativeName, formatCommandArgMenuTitle, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, hasControlCommand, listChatCommands, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listSkillCommandsForAgents, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveEffectiveAgentRuntime, resolveFastModeState, resolveNativeCommandSessionTargets, resolveStoredModelOverride, serializeCommandArgs, shouldComputeCommandAuthorized };