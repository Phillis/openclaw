import { r as OpenClawConfig } from "./types.openclaw-a_kGc1gJ.js";
import { i as ReplyPayload } from "./reply-payload-D83wzoq7.js";
import { c as SessionEntry } from "./types-Byd4mWhx.js";
//#region src/auto-reply/reply/commands-models.d.ts
type ModelsCommandSessionEntry = Partial<Pick<SessionEntry, "authProfileOverride" | "modelProvider" | "model">>;
type ModelsProviderData = {
  byProvider: Map<string, Set<string>>;
  providers: string[];
  resolvedDefault: {
    provider: string;
    model: string;
  };
  modelNames: Map<string, string>;
  runtimeChoicesByProvider?: Map<string, ModelsRuntimeChoice[]>;
};
type ModelsRuntimeChoice = {
  id: string;
  label: string;
  description: string;
};
declare function buildModelsProviderData(cfg: OpenClawConfig, agentId?: string, options?: {
  view?: "default" | "all";
  workspaceDir?: string;
}): Promise<ModelsProviderData>;
declare function formatModelsAvailableHeader(params: {
  provider: string;
  total: number;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  sessionEntry?: ModelsCommandSessionEntry;
}): string;
declare function resolveModelsCommandReply(params: {
  cfg: OpenClawConfig;
  commandBodyNormalized: string;
  surface?: string;
  currentModel?: string;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  sessionEntry?: ModelsCommandSessionEntry;
}): Promise<ReplyPayload | null>;
//#endregion
export { resolveModelsCommandReply as a, formatModelsAvailableHeader as i, ModelsRuntimeChoice as n, buildModelsProviderData as r, ModelsProviderData as t };