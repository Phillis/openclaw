import { Y as DmPolicy, n as OpenClawConfig, st as SecretInput } from "./types.openclaw-CpYrAZv3.js";
import { ct as WizardPrompter } from "./setup-wizard-types-DUwZ9UvR.js";
//#region src/channels/plugins/setup-wizard-helpers.d.ts
declare function addWildcardAllowFrom(allowFrom?: ReadonlyArray<string | number> | null): string[];
declare function mergeAllowFromEntries(current: Array<string | number> | null | undefined, additions: Array<string | number>): string[];
declare function setTopLevelChannelDmPolicyWithAllowFrom(params: {
  cfg: OpenClawConfig;
  channel: string;
  dmPolicy: DmPolicy;
  getAllowFrom?: (cfg: OpenClawConfig) => Array<string | number> | undefined;
}): OpenClawConfig;
declare function buildSingleChannelSecretPromptState(params: {
  accountConfigured: boolean;
  hasConfigToken: boolean;
  allowEnv: boolean;
  envValue?: string;
}): {
  accountConfigured: boolean;
  hasConfigToken: boolean;
  canUseEnv: boolean;
};
type SingleChannelSecretInputPromptResult = {
  action: "keep";
} | {
  action: "use-env";
} | {
  action: "set";
  value: SecretInput;
  resolvedValue: string;
};
declare function runSingleChannelSecretStep(params: {
  cfg: OpenClawConfig;
  prompter: Pick<WizardPrompter, "confirm" | "text" | "select" | "note">;
  providerHint: string;
  credentialLabel: string;
  secretInputMode?: "plaintext" | "ref";
  accountConfigured: boolean;
  hasConfigToken: boolean;
  allowEnv: boolean;
  envValue?: string;
  envPrompt: string;
  keepPrompt: string;
  inputPrompt: string;
  preferredEnvVar?: string;
  onMissingConfigured?: () => Promise<void>;
  applyUseEnv?: (cfg: OpenClawConfig) => OpenClawConfig | Promise<OpenClawConfig>;
  applySet?: (cfg: OpenClawConfig, value: SecretInput, resolvedValue: string) => OpenClawConfig | Promise<OpenClawConfig>;
}): Promise<{
  cfg: OpenClawConfig;
  action: SingleChannelSecretInputPromptResult["action"];
  resolvedValue?: string;
}>;
declare function promptSingleChannelSecretInput(params: {
  cfg: OpenClawConfig;
  prompter: Pick<WizardPrompter, "confirm" | "text" | "select" | "note">;
  providerHint: string;
  credentialLabel: string;
  secretInputMode?: "plaintext" | "ref";
  accountConfigured: boolean;
  canUseEnv: boolean;
  hasConfigToken: boolean;
  envPrompt: string;
  keepPrompt: string;
  inputPrompt: string;
  preferredEnvVar?: string;
}): Promise<SingleChannelSecretInputPromptResult>;
//#endregion
export { runSingleChannelSecretStep as a, promptSingleChannelSecretInput as i, buildSingleChannelSecretPromptState as n, setTopLevelChannelDmPolicyWithAllowFrom as o, mergeAllowFromEntries as r, addWildcardAllowFrom as t };