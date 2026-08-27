import { S as TextContent, _ as SimpleStreamOptions, a as AssistantMessageEventStreamContract, c as Context, d as Model, i as AssistantMessageEvent, k as ToolResultMessage, l as ImageContent, n as Api } from "./types-Cm3n7XMD.js";
import { c as CompactionResult, s as CompactionPreparation } from "./agent-core-B8sowrXn.js";
import { S as ToolExecutionMode, _ as CustomMessage, b as StreamFn, c as AgentMessage, f as AgentToolResult, p as AgentToolUpdateCallback, u as AgentTool, x as ThinkingLevel } from "./types-DKu1Bc4Q.js";
import { u as SourceInfo } from "./types-DMfmNky0.js";
import { n as PluginMetadataSnapshot, r as PluginMetadataSnapshotOwnerMaps } from "./plugin-metadata-snapshot.types-BrgZTxRQ.js";
import { c as SessionEntry, n as SessionManager, o as BranchSummaryEntry, s as CompactionEntry, t as ReadonlySessionManager } from "./session-manager-B7xs4kTa.js";
import { i as OAuthLoginCallbacks$1, l as OAuthProviderInterface, r as OAuthCredentials$1, s as OAuthProviderId } from "./provider-oauth-runtime-DamE_Zlc.js";
import { Static, TSchema, Type } from "typebox";
import { AutocompleteItem, AutocompleteProvider, Component, EditorComponent, EditorTheme, KeyId, KeybindingsConfig, KeybindingsManager, OverlayHandle, OverlayOptions, TUI } from "@earendil-works/pi-tui";

//#region packages/agent-core/src/harness/utils/truncate.d.ts
/** Result metadata for content truncated by line count, byte count, or both. */
interface TruncationResult {
  /** The truncated content */
  content: string;
  /** Whether truncation occurred */
  truncated: boolean;
  /** Which limit was hit: "lines", "bytes", or null if not truncated */
  truncatedBy: "lines" | "bytes" | null;
  /** Total number of lines in the original content */
  totalLines: number;
  /** Total number of bytes in the original content */
  totalBytes: number;
  /** Number of complete lines in the truncated output */
  outputLines: number;
  /** Number of bytes in the truncated output */
  outputBytes: number;
  /** Whether the last line was partially truncated (only for tail truncation edge case) */
  lastLinePartial: boolean;
  /** Whether the first line exceeded the byte limit (for head truncation) */
  firstLineExceedsLimit: boolean;
  /** The max lines limit that was applied */
  maxLines: number;
  /** The max bytes limit that was applied */
  maxBytes: number;
}
//#endregion
//#region src/agents/sessions/event-bus.d.ts
/** Minimal publish/subscribe interface used by session components. */
interface EventBus {
  emit(channel: string, data: unknown): void;
  on(channel: string, handler: (data: unknown) => void): () => void;
}
/** Event bus plus lifecycle control for tests and teardown. */
interface EventBusController extends EventBus {
  clear(): void;
}
/** Creates an in-process event bus with unsubscribe and clear support. */
declare function createEventBus(): EventBusController;
//#endregion
//#region src/agents/modes/interactive/theme/theme.d.ts
type ThemeColor = "accent" | "border" | "borderAccent" | "borderMuted" | "success" | "error" | "warning" | "muted" | "dim" | "text" | "thinkingText" | "userMessageText" | "customMessageText" | "customMessageLabel" | "toolTitle" | "toolOutput" | "mdHeading" | "mdLink" | "mdLinkUrl" | "mdCode" | "mdCodeBlock" | "mdCodeBlockBorder" | "mdQuote" | "mdQuoteBorder" | "mdHr" | "mdListBullet" | "toolDiffAdded" | "toolDiffRemoved" | "toolDiffContext" | "syntaxComment" | "syntaxKeyword" | "syntaxFunction" | "syntaxVariable" | "syntaxString" | "syntaxNumber" | "syntaxType" | "syntaxOperator" | "syntaxPunctuation" | "thinkingOff" | "thinkingMinimal" | "thinkingLow" | "thinkingMedium" | "thinkingHigh" | "thinkingXhigh" | "bashMode";
type ThemeBg = "selectedBg" | "userMessageBg" | "customMessageBg" | "toolPendingBg" | "toolSuccessBg" | "toolErrorBg";
type ColorMode = "truecolor" | "256color";
declare class Theme {
  readonly name?: string;
  readonly sourcePath?: string;
  sourceInfo?: SourceInfo;
  private fgColors;
  private bgColors;
  private mode;
  constructor(fgColors: Record<ThemeColor, string | number>, bgColors: Record<ThemeBg, string | number>, mode: ColorMode, options?: {
    name?: string;
    sourcePath?: string;
    sourceInfo?: SourceInfo;
  });
  fg(color: ThemeColor, text: string): string;
  bg(color: ThemeBg, text: string): string;
  bold(text: string): string;
  italic(text: string): string;
  underline(text: string): string;
  inverse(text: string): string;
  strikethrough(text: string): string;
  getFgAnsi(color: ThemeColor): string;
  getBgAnsi(color: ThemeBg): string;
  getColorMode(): ColorMode;
  getThinkingBorderColor(level: "off" | "minimal" | "low" | "medium" | "high" | "xhigh"): (str: string) => string;
  getBashModeBorderColor(): (str: string) => string;
}
//#endregion
//#region src/agents/sessions/tools/bash-operations.d.ts
/**
 * Minimal shell execution interface injected into bash session tools.
 */
interface BashOperations {
  exec: (command: string, cwd: string, options: {
    /**
     * stdout and stderr are independent pipes, so each needs its own decode
     * state; tag chunks to keep them apart. Untagged chunks share one lane,
     * preserving behavior for operations that cannot distinguish streams.
     */
    onData: (data: Buffer, stream?: "stdout" | "stderr") => void;
    signal?: AbortSignal;
    timeout?: number;
    env?: NodeJS.ProcessEnv;
  }) => Promise<{
    exitCode: number | null;
  }>;
}
//#endregion
//#region src/agents/sessions/bash-executor.d.ts
interface BashResult {
  /** Combined stdout + stderr output (sanitized, possibly truncated) */
  output: string;
  /** Process exit code (undefined if killed/cancelled) */
  exitCode: number | undefined;
  /** Whether the command was cancelled via signal */
  cancelled: boolean;
  /** Whether the output was truncated */
  truncated: boolean;
  /** Path to temp file containing full output (if output exceeded truncation threshold) */
  fullOutputPath?: string;
}
//#endregion
//#region src/agents/sessions/compaction/compaction.d.ts
/** Generates a compaction summary through the shared agent-core runtime. */
declare function generateSummary(currentMessages: AgentMessage[], model: Model, reserveTokens: number, apiKey: string | undefined, headers?: Record<string, string>, signal?: AbortSignal, customInstructions?: string, previousSummary?: string, thinkingLevel?: ThinkingLevel, streamFn?: StreamFn): Promise<string>;
//#endregion
//#region src/agents/sessions/exec.d.ts
/**
 * Shared command execution utilities for extensions and custom tools.
 */
/**
 * Options for executing shell commands.
 */
interface ExecOptions {
  /** AbortSignal to cancel the command */
  signal?: AbortSignal;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Working directory */
  cwd?: string;
  /** Optional maximum retained stdout/stderr characters per stream. */
  maxOutputChars?: number;
}
/**
 * Result of executing a shell command.
 */
interface ExecResult {
  stdout: string;
  stderr: string;
  stdoutTruncatedChars?: number;
  stderrTruncatedChars?: number;
  outputLimitExceeded?: "stdout" | "stderr";
  code: number;
  killed: boolean;
}
//#endregion
//#region src/agents/sessions/footer-data-provider.d.ts
/**
 * Provides git branch and extension statuses - data not otherwise accessible to extensions.
 * Token stats, model info available via ctx.sessionManager and ctx.model.
 */
declare class FooterDataProvider {
  private static readonly WATCH_DEBOUNCE_MS;
  private extensionStatuses;
  private cachedBranch;
  private gitPaths;
  private headWatcher;
  private reftableWatcher;
  private reftableTablesListWatcher;
  private reftableTablesListPath;
  private branchChangeCallbacks;
  private availableProviderCount;
  private refreshTimer;
  private gitWatcherRetryTimer;
  private refreshInFlight;
  private refreshPending;
  private disposed;
  constructor(cwd: string);
  /** Current git branch, null if not in repo, "detached" if detached HEAD */
  getGitBranch(): string | null;
  /** Extension status texts set via ctx.ui.setStatus() */
  getExtensionStatuses(): ReadonlyMap<string, string>;
  /** Subscribe to git branch changes. Returns unsubscribe function. */
  onBranchChange(callback: () => void): () => void;
  /** Internal: set extension status */
  setExtensionStatus(key: string, text: string | undefined): void;
  /** Number of unique providers with available models (for footer display) */
  getAvailableProviderCount(): number;
  /** Internal: update available provider count */
  setAvailableProviderCount(count: number): void;
  /** Internal: cleanup */
  dispose(): void;
  private notifyBranchChange;
  private scheduleRefresh;
  private refreshGitBranchAsync;
  private resolveGitBranchSync;
  private resolveGitBranchAsync;
  private clearGitWatchers;
  private scheduleGitWatcherRetry;
  private handleGitWatcherError;
  private setupGitWatcher;
}
/** Read-only view for extensions - excludes setExtensionStatus, setAvailableProviderCount and dispose */
type ReadonlyFooterDataProvider = Pick<FooterDataProvider, "getGitBranch" | "getExtensionStatuses" | "getAvailableProviderCount" | "onBranchChange">;
//#endregion
//#region src/agents/sessions/keybindings.d.ts
/** OpenClaw-specific key ids added to the shared pi-tui keybinding registry. */
interface AppKeybindings {
  "app.interrupt": true;
  "app.clear": true;
  "app.exit": true;
  "app.suspend": true;
  "app.thinking.cycle": true;
  "app.model.cycleForward": true;
  "app.model.cycleBackward": true;
  "app.model.select": true;
  "app.tools.expand": true;
  "app.thinking.toggle": true;
  "app.session.toggleNamedFilter": true;
  "app.editor.external": true;
  "app.message.followUp": true;
  "app.message.dequeue": true;
  "app.clipboard.pasteImage": true;
  "app.session.new": true;
  "app.session.tree": true;
  "app.session.fork": true;
  "app.session.resume": true;
  "app.tree.foldOrUp": true;
  "app.tree.unfoldOrDown": true;
  "app.tree.editLabel": true;
  "app.tree.toggleLabelTimestamp": true;
  "app.session.togglePath": true;
  "app.session.toggleSort": true;
  "app.session.rename": true;
  "app.session.delete": true;
  "app.session.deleteNoninvasive": true;
  "app.models.save": true;
  "app.models.enableAll": true;
  "app.models.clearAll": true;
  "app.models.toggleProvider": true;
  "app.models.reorderUp": true;
  "app.models.reorderDown": true;
  "app.tree.filter.default": true;
  "app.tree.filter.noTools": true;
  "app.tree.filter.userOnly": true;
  "app.tree.filter.labeledOnly": true;
  "app.tree.filter.all": true;
  "app.tree.filter.cycleForward": true;
  "app.tree.filter.cycleBackward": true;
}
declare module "@earendil-works/pi-tui" {
  interface Keybindings extends AppKeybindings {}
}
/** Keybinding manager that loads OpenClaw defaults plus optional user overrides. */
declare class KeybindingsManager$1 extends KeybindingsManager {
  private configPath;
  constructor(userBindings?: KeybindingsConfig, configPath?: string);
  /** Creates a manager from the agent keybindings.json file. */
  static create(agentDir?: string): KeybindingsManager$1;
  /** Reloads user overrides from disk when this manager was created with a config path. */
  reload(): void;
  /** Returns the currently resolved keybinding map after defaults and overrides. */
  getEffectiveConfig(): KeybindingsConfig;
  private static loadFromFile;
}
//#endregion
//#region src/agents/plugin-model-catalog.d.ts
type PersistedPluginModelCatalog = {
  pluginId: string;
  contents: string;
};
type PluginModelCatalogMetadataSnapshot = Pick<PluginMetadataSnapshot, "owners"> & {
  index?: {
    plugins: ReadonlyArray<{
      enabled: boolean;
      pluginId: string;
    }>;
  };
  normalizePluginId?: (pluginId: string) => string;
};
//#endregion
//#region src/agents/sessions/auth-storage.d.ts
type ApiKeyCredential = {
  type: "api_key";
  key: string;
};
type OAuthCredential = {
  type: "oauth";
} & OAuthCredentials$1;
type TokenCredential = {
  type: "token";
  token: string;
  expires?: number;
};
type AuthCredential = ApiKeyCredential | OAuthCredential | TokenCredential;
type AuthStorageData = Record<string, AuthCredential>;
type AuthStatus = {
  configured: boolean;
  source?: "stored" | "runtime" | "environment" | "fallback" | "models_json_key" | "models_json_command";
  label?: string;
};
type LockResult<T> = {
  result: T;
  next?: string;
};
interface AuthStorageBackend {
  readonly migrationOwnerAgentDir?: string;
  withLock<T>(fn: (current: string | undefined) => LockResult<T>): T;
  withLockAsync<T>(fn: (current: string | undefined) => Promise<LockResult<T>>): Promise<T>;
}
/**
 * Provider-keyed credential facade backed by the canonical auth-profile store.
 */
declare class AuthStorage {
  private data;
  private runtimeOverrides;
  private fallbackResolver?;
  private loadError;
  private errors;
  private storage;
  private migrationOwnerAgentDir?;
  private constructor();
  static forAgent(agentDir?: string): AuthStorage;
  /**
   * @deprecated Use AuthStorage.forAgent(agentDir). The path-taking compatibility
   * form is eligible for removal after 2026-10-01 and a clean published-plugin
   * reader sweep; it no longer reads or writes JSON.
   */
  static create(authPath?: string): AuthStorage;
  static fromStorage(storage: AuthStorageBackend): AuthStorage;
  static inMemory(data?: AuthStorageData): AuthStorage;
  /**
   * Set a runtime API key override (not persisted to disk).
   * Used for CLI --api-key flag.
   */
  setRuntimeApiKey(provider: string, apiKey: string): void;
  /**
   * Remove a runtime API key override.
   */
  removeRuntimeApiKey(provider: string): void;
  /**
   * Set a fallback resolver for API keys not found in auth.json or env vars.
   * Used for custom provider keys from models.json.
   */
  setFallbackResolver(resolver: (provider: string) => string | undefined): void;
  private recordError;
  private getCanonicalLoadError;
  private parseStorageData;
  /**
   * Reload credentials from storage.
   */
  reload(): void;
  private persistProviderChange;
  /**
   * Get credential for a provider.
   */
  get(provider: string): AuthCredential | undefined;
  /**
   * Set credential for a provider.
   */
  set(provider: string, credential: AuthCredential): void;
  /**
   * Remove credential for a provider.
   */
  remove(provider: string): void;
  /**
   * List all providers with credentials.
   */
  list(): string[];
  /**
   * Check if credentials exist for a provider in auth.json.
   */
  has(provider: string): boolean;
  /**
   * Check if any form of auth is configured for a provider.
   * Unlike getApiKey(), this doesn't refresh OAuth tokens.
   */
  hasAuth(provider: string): boolean;
  /**
   * Return auth status without exposing credential values or refreshing tokens.
   */
  getAuthStatus(provider: string): AuthStatus;
  /**
   * Get all credentials (for passing to getOAuthApiKey).
   */
  getAll(): AuthStorageData;
  drainErrors(): Error[];
  /**
   * Login to an OAuth provider.
   */
  login(providerId: OAuthProviderId, callbacks: OAuthLoginCallbacks$1): Promise<void>;
  /**
   * Logout from a provider.
   */
  logout(provider: string): void;
  /**
   * Refresh OAuth token with backend locking to prevent race conditions.
   * Multiple agent sessions may try to refresh simultaneously when tokens expire.
   */
  private refreshOAuthTokenWithLock;
  /**
   * Get API key for a provider.
   * Priority:
   * 1. Runtime override (CLI --api-key)
   * 2. API key from auth.json
   * 3. OAuth token from auth.json (auto-refreshed with locking)
   * 4. Environment variable
   * 5. Fallback resolver (models.json custom providers)
   */
  getApiKey(providerId: string, options?: {
    includeFallback?: boolean;
  }): Promise<string | undefined>;
  /**
   * Get all OAuth providers registered for this auth/session runtime.
   */
  getOAuthProviders(): OAuthProviderInterface[];
}
//#endregion
//#region src/agents/sessions/model-registry.d.ts
declare const ProviderAuthModeSchema: Type.TUnion<[Type.TLiteral<"api-key">, Type.TLiteral<"aws-sdk">, Type.TLiteral<"oauth">, Type.TLiteral<"token">]>;
type ProviderAuthMode = Static<typeof ProviderAuthModeSchema>;
type ResolvedRequestAuth = {
  ok: true;
  apiKey?: string;
  headers?: Record<string, string>;
} | {
  ok: false;
  error: string;
};
type ModelRegistryOptions = {
  includePluginCatalogs?: boolean;
  modelsJsonContents?: string | null;
  pluginCatalogs?: readonly PersistedPluginModelCatalog[];
  pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
  sourceSnapshot?: ModelRegistry;
  workspaceDir?: string;
};
/** Clear the config value command cache. Exported for testing. */
/**
 * Model registry - loads and manages models, resolves API keys via AuthStorage.
 */
declare class ModelRegistry {
  private models;
  private providerRequestConfigs;
  private modelRequestHeaders;
  private registeredProviders;
  private loadError;
  readonly authStorage: AuthStorage;
  private modelsJsonPath;
  private modelsJsonContents;
  private pluginCatalogs;
  private pluginMetadataSnapshot;
  private includePluginCatalogs;
  private baseCatalogSnapshot;
  private sourceSnapshot;
  private constructor();
  private captureCatalogSnapshot;
  private restoreSourceCatalog;
  static create(authStorage: AuthStorage, modelsJsonPath?: string, options?: ModelRegistryOptions): ModelRegistry;
  static inMemory(authStorage: AuthStorage): ModelRegistry;
  /** Creates a request-isolated registry from this lifecycle-owned catalog snapshot. */
  fork(authStorage: AuthStorage): ModelRegistry;
  /**
   * Reload models from disk (models.json).
   */
  refresh(): void;
  /** Get any root or generated plugin catalog load error. */
  getError(): string | undefined;
  /** Returns the exact plugin metadata generation captured with this registry. */
  getProviderMetadataOwners(): PluginMetadataSnapshotOwnerMaps | undefined;
  private loadModels;
  private loadCapturedPluginCatalogs;
  private loadCustomModels;
  private validateConfig;
  private parseModels;
  /**
   * Get all configured models.
   */
  getAll(): Model[];
  /**
   * Get only models that have auth configured.
   * This is a fast check that doesn't refresh OAuth tokens.
   */
  getAvailable(): Model[];
  /**
   * Find a model by provider and ID.
   */
  find(provider: string, modelId: string): Model | undefined;
  /**
   * Get API key for a model.
   */
  hasConfiguredAuth(model: Model): boolean;
  private getModelRequestKey;
  private storeProviderRequestConfig;
  private storeModelHeaders;
  /**
   * Get API key and request headers for a model.
   */
  getApiKeyAndHeaders(model: Model): Promise<ResolvedRequestAuth>;
  /**
   * Return auth status for a provider, including request auth configured in models.json.
   * This intentionally does not execute command-backed config values.
   */
  getProviderAuthStatus(provider: string): AuthStatus;
  /**
   * Get display name for a provider.
   */
  getProviderDisplayName(provider: string): string;
  /**
   * Get API key for a provider.
   */
  getApiKeyForProvider(provider: string): Promise<string | undefined>;
  /**
   * Check if a model is using OAuth credentials (subscription).
   */
  isUsingOAuth(model: Model): boolean;
  /**
   * Register a provider dynamically (from extensions).
   *
   * If provider has models: replaces all existing models for this provider.
   * Provider-level request settings are stored for already-known models but
   * never create implicit model rows.
   * If provider has oauth: registers OAuth provider for /login support.
   */
  registerProvider(providerName: string, config: ProviderConfigInput): void;
  /**
   * Unregister a previously registered provider.
   *
   * Removes the provider from the registry and reloads models from disk.
   * Also resets dynamic OAuth and API stream registrations before reapplying
   * remaining dynamic providers.
   * Has no effect if the provider was never registered.
   */
  unregisterProvider(providerName: string): void;
  /**
   * Upsert a provider config into registeredProviders.
   * If the provider is already registered, defined values in the incoming config
   * override existing ones; undefined values are preserved from the stored config.
   * If the provider is not registered, the incoming config is stored as-is.
   */
  private upsertRegisteredProvider;
  private validateProviderConfig;
  private applyProviderConfig;
}
/**
 * Input type for registerProvider API.
 */
interface ProviderConfigInput {
  name?: string;
  baseUrl?: string;
  apiKey?: string;
  auth?: ProviderAuthMode;
  api?: Api;
  streamSimple?: (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
  headers?: Record<string, string>;
  authHeader?: boolean;
  /** OAuth provider for /login support */
  oauth?: Omit<OAuthProviderInterface, "id">;
  models?: Array<{
    id: string;
    name: string;
    api?: Api;
    baseUrl?: string;
    reasoning: boolean;
    thinkingLevelMap?: Model["thinkingLevelMap"];
    input: ("text" | "image")[];
    cost: {
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
    };
    contextWindow: number;
    maxTokens: number;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    compat?: Model["compat"];
  }>;
}
//#endregion
//#region src/agents/sessions/slash-commands.d.ts
type SlashCommandSource = "extension" | "prompt" | "skill";
interface SlashCommandInfo {
  name: string;
  description?: string;
  source: SlashCommandSource;
  sourceInfo: SourceInfo;
}
//#endregion
//#region src/agents/sessions/diagnostics.d.ts
/**
 * Session resource diagnostic types.
 *
 * Describes collisions and warnings discovered while loading extensions, skills, prompts, and themes.
 */
interface ResourceCollision {
  resourceType: "extension" | "skill" | "prompt" | "theme";
  name: string;
  winnerPath: string;
  loserPath: string;
  winnerSource?: string;
  loserSource?: string;
}
interface ResourceDiagnostic {
  type: "warning" | "error" | "collision";
  message: string;
  path?: string;
  collision?: ResourceCollision;
}
//#endregion
//#region src/skills/loading/session.d.ts
interface Skill {
  name: string;
  description: string;
  filePath: string;
  baseDir: string;
  promptVersion?: string;
  source: string;
  sourceInfo: SourceInfo;
  disableModelInvocation: boolean;
}
/**
 * Format skills for inclusion in a system prompt.
 * Uses XML format per Agent Skills standard.
 * See: https://agentskills.io/integrate-skills
 *
 * Skills with disableModelInvocation=true are excluded from the prompt
 * (they can only be invoked explicitly via /skill:name commands).
 */
declare function formatSkillsForPrompt(skills: Skill[]): string;
//#endregion
//#region src/agents/sessions/system-prompt.d.ts
interface BuildSystemPromptOptions {
  /** Custom system prompt (replaces default). */
  customPrompt?: string;
  /** Tools to include in prompt. Default: [read, bash, edit, write] */
  selectedTools?: string[];
  /** Optional one-line tool snippets keyed by tool name. */
  toolSnippets?: Record<string, string>;
  /** Additional guideline bullets appended to the default system prompt guidelines. */
  promptGuidelines?: string[];
  /** Text to append to system prompt. */
  appendSystemPrompt?: string;
  /** Working directory. */
  cwd: string;
  /** Pre-loaded context files. */
  contextFiles?: Array<{
    path: string;
    content: string;
  }>;
  /** Pre-loaded skills. */
  skills?: Skill[];
}
//#endregion
//#region src/agents/sessions/tools/edit-diff.d.ts
/**
 * Shared diff computation utilities for the edit tool.
 * Used by both edit.ts (for execution) and tool-execution.ts (for preview rendering).
 */
interface Edit {
  oldText: string;
  newText: string;
}
//#endregion
//#region src/agents/sessions/tools/tool-contracts.d.ts
interface BashToolInput {
  command: string;
  timeout?: number;
}
interface BashToolDetails {
  truncation?: TruncationResult;
  fullOutputPath?: string;
}
interface EditToolInput {
  path: string;
  edits: Edit[];
}
type EditToolDetails = {
  changed: false;
} | {
  changed: true; /** Display-oriented diff of the changes made */
  diff: string; /** Standard unified patch of the changes made */
  patch: string; /** Line number of the first change in the new file (for editor navigation) */
  firstChangedLine?: number;
};
interface FindToolInput {
  pattern: string;
  path?: string;
  limit?: number;
}
interface FindToolDetails {
  truncation?: TruncationResult;
  resultLimitReached?: number;
}
interface GrepToolInput {
  pattern: string;
  path?: string;
  glob?: string;
  ignoreCase?: boolean;
  literal?: boolean;
  context?: number;
  limit?: number;
}
interface GrepToolDetails {
  truncation?: TruncationResult;
  matchLimitReached?: number;
  linesTruncated?: boolean;
}
interface LsToolInput {
  path?: string;
  limit?: number;
}
interface LsToolDetails {
  truncation?: TruncationResult;
  entryLimitReached?: number;
}
interface ReadToolInput {
  path: string;
  offset?: number;
  limit?: number;
}
type ReadToolTruncationDetails = Omit<TruncationResult, "content">;
type ReadToolDetails = {
  kind: "text";
  content: string;
} | {
  kind: "image";
  content: string;
  mimeType: string;
} | {
  kind: "truncated";
  content: string;
  truncation: ReadToolTruncationDetails;
} | {
  kind: "not_found";
  status: "not_found";
  path: string;
  optional: true;
};
interface WriteToolInput {
  path: string;
  content: string;
}
//#endregion
//#region src/agents/sessions/extensions/types.d.ts
type OAuthCredentials = {
  refresh: string;
  access: string;
  expires: number;
  [key: string]: unknown;
};
type OAuthPrompt = {
  message: string;
  placeholder?: string;
  allowEmpty?: boolean;
};
type OAuthAuthInfo = {
  url: string;
  instructions?: string;
};
type OAuthSelectOption = {
  id: string;
  label: string;
};
type OAuthSelectPrompt = {
  message: string;
  options: OAuthSelectOption[];
};
interface OAuthLoginCallbacks {
  onAuth: (info: OAuthAuthInfo) => void;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  onProgress?: (message: string) => void;
  onManualCodeInput?: () => Promise<string>;
  /** Show an interactive selector and return the selected option id, or undefined on cancel. */
  onSelect?: (prompt: OAuthSelectPrompt) => Promise<string | undefined>;
  signal?: AbortSignal;
}
/** Options for extension UI dialogs. */
interface ExtensionUIDialogOptions {
  /** AbortSignal to programmatically dismiss the dialog. */
  signal?: AbortSignal;
  /** Timeout in milliseconds. Dialog auto-dismisses with live countdown display. */
  timeout?: number;
}
/** Placement for extension widgets. */
type WidgetPlacement = "aboveEditor" | "belowEditor";
/** Options for extension widgets. */
interface ExtensionWidgetOptions {
  /** Where the widget is rendered. Defaults to "aboveEditor". */
  placement?: WidgetPlacement;
}
/** Raw terminal input listener for extensions. */
type TerminalInputHandler = (data: string) => {
  consume?: boolean;
  data?: string;
} | undefined;
/** Working indicator configuration for the interactive streaming loader. */
interface WorkingIndicatorOptions {
  /** Animation frames. Use an empty array to hide the indicator entirely. Custom frames are rendered verbatim. */
  frames?: string[];
  /** Frame interval in milliseconds for animated indicators. */
  intervalMs?: number;
}
/** Wrap the current autocomplete provider with additional behavior. */
type AutocompleteProviderFactory = (current: AutocompleteProvider) => AutocompleteProvider;
type EditorFactory = (tui: TUI, theme: EditorTheme, keybindings: KeybindingsManager$1) => EditorComponent;
/**
 * UI context for extensions to request interactive UI.
 * Each mode (interactive, RPC, print) provides its own implementation.
 */
interface ExtensionUIContext {
  /** Show a selector and return the user's choice. */
  select(title: string, options: string[], opts?: ExtensionUIDialogOptions): Promise<string | undefined>;
  /** Show a confirmation dialog. */
  confirm(title: string, message: string, opts?: ExtensionUIDialogOptions): Promise<boolean>;
  /** Show a text input dialog. */
  input(title: string, placeholder?: string, opts?: ExtensionUIDialogOptions): Promise<string | undefined>;
  /** Show a notification to the user. */
  notify(message: string, type?: "info" | "warning" | "error"): void;
  /** Listen to raw terminal input (interactive mode only). Returns an unsubscribe function. */
  onTerminalInput(handler: TerminalInputHandler): () => void;
  /** Set status text in the footer/status bar. Pass undefined to clear. */
  setStatus(key: string, text: string | undefined): void;
  /** Set the working/loading message shown during streaming. Call with no argument to restore default. */
  setWorkingMessage(message?: string): void;
  /** Show or hide the built-in interactive working loader row during streaming. */
  setWorkingVisible(visible: boolean): void;
  /**
   * Configure the interactive working indicator shown during streaming.
   *
   * - Omit the argument to restore the default animated spinner.
   * - Use `frames: ["●"]` for a static indicator.
   * - Use `frames: []` to hide the indicator entirely.
   * - Custom frames are rendered as provided, so extensions must add their own colors.
   */
  setWorkingIndicator(options?: WorkingIndicatorOptions): void;
  /** Set the label shown for hidden thinking blocks. Call with no argument to restore default. */
  setHiddenThinkingLabel(label?: string): void;
  /** Set a widget to display above or below the editor. Accepts string array or component factory. */
  setWidget(key: string, content: string[] | undefined, options?: ExtensionWidgetOptions): void;
  setWidget(key: string, content: ((tui: TUI, theme: Theme) => Component & {
    dispose?(): void;
  }) | undefined, options?: ExtensionWidgetOptions): void;
  /** Set a custom footer component, or undefined to restore the built-in footer.
   *
   * The factory receives a FooterDataProvider for data not otherwise accessible:
   * git branch and extension statuses from setStatus(). Token stats, model info,
   * etc. are available via ctx.sessionManager and ctx.model.
   */
  setFooter(factory: ((tui: TUI, theme: Theme, footerData: ReadonlyFooterDataProvider) => Component & {
    dispose?(): void;
  }) | undefined): void;
  /** Set a custom header component (shown at startup, above chat), or undefined to restore the built-in header. */
  setHeader(factory: ((tui: TUI, theme: Theme) => Component & {
    dispose?(): void;
  }) | undefined): void;
  /** Set the terminal window/tab title. */
  setTitle(title: string): void;
  /** Show a custom component with keyboard focus. */
  custom<T>(factory: (tui: TUI, theme: Theme, keybindings: KeybindingsManager$1, done: (result: T) => void) => (Component & {
    dispose?(): void;
  }) | Promise<Component & {
    dispose?(): void;
  }>, options?: {
    overlay?: boolean; /** Overlay positioning/sizing options. Can be static or a function for dynamic updates. */
    overlayOptions?: OverlayOptions | (() => OverlayOptions); /** Called with the overlay handle after the overlay is shown. Use to control visibility. */
    onHandle?: (handle: OverlayHandle) => void;
  }): Promise<T>;
  /** Paste text into the editor, triggering paste handling (collapse for large content). */
  pasteToEditor(text: string): void;
  /** Set the text in the core input editor. */
  setEditorText(text: string): void;
  /** Get the current text from the core input editor. */
  getEditorText(): string;
  /** Show a multi-line editor for text editing. */
  editor(title: string, prefill?: string): Promise<string | undefined>;
  /** Stack additional autocomplete behavior on top of the built-in provider. */
  addAutocompleteProvider(factory: AutocompleteProviderFactory): void;
  /**
   * Set a custom editor component via factory function.
   * Pass undefined to restore the default editor.
   *
   * The factory receives:
   * - `theme`: EditorTheme for styling borders and autocomplete
   * - `keybindings`: KeybindingsManager for app-level keybindings
   *
   * For full app keybinding support (escape, ctrl+d, model switching, etc.),
   * extend `CustomEditor` from `openclaw/plugin-sdk/agent-sessions` and call
   * `super.handleInput(data)` for keys you don't handle.
   *
   * @example
   * ```ts
   * import { CustomEditor } from "openclaw/plugin-sdk/agent-sessions";
   *
   * class VimEditor extends CustomEditor {
   *   private mode: "normal" | "insert" = "insert";
   *
   *   handleInput(data: string): void {
   *     if (this.mode === "normal") {
   *       // Handle vim normal mode keys...
   *       if (data === "i") { this.mode = "insert"; return; }
   *     }
   *     super.handleInput(data);  // App keybindings + text editing
   *   }
   * }
   *
   * ctx.ui.setEditorComponent((tui, theme, keybindings) =>
   *   new VimEditor(tui, theme, keybindings)
   * );
   * ```
   */
  setEditorComponent(factory: EditorFactory | undefined): void;
  /** Get the currently configured custom editor factory, or undefined when using the default editor. */
  getEditorComponent(): EditorFactory | undefined;
  /** Get the current theme for styling. */
  readonly theme: Theme;
  /** Get all available themes with their names and file paths. */
  getAllThemes(): {
    name: string;
    path: string | undefined;
  }[];
  /** Load a theme by name without switching to it. Returns undefined if not found. */
  getTheme(name: string): Theme | undefined;
  /** Set the current theme by name or Theme object. */
  setTheme(theme: string | Theme): {
    success: boolean;
    error?: string;
  };
  /** Get current tool output expansion state. */
  getToolsExpanded(): boolean;
  /** Set tool output expansion state. */
  setToolsExpanded(expanded: boolean): void;
}
interface ContextUsage {
  /** Estimated context tokens, or null if any (e.g. right after compaction, before next LLM response). */
  tokens: number | null;
  contextWindow: number;
  /** Context usage as percentage of context window, or null if tokens is unknown. */
  percent: number | null;
}
interface CompactOptions {
  customInstructions?: string;
  onComplete?: (result: CompactionResult) => void;
  onError?: (error: Error) => void;
}
/**
 * Context passed to extension event handlers.
 */
interface ExtensionContext {
  /** UI methods for user interaction */
  ui: ExtensionUIContext;
  /** Whether UI is available (false in print/RPC mode) */
  hasUI: boolean;
  /** Current working directory */
  cwd: string;
  /** Session manager (read-only) */
  sessionManager: ReadonlySessionManager;
  /** Model registry for API key resolution */
  modelRegistry: ModelRegistry;
  /** Current model (may be undefined) */
  model: Model | undefined;
  /** Whether the agent is idle (not streaming) */
  isIdle(): boolean;
  /** The current abort signal, or undefined when the agent is not streaming. */
  signal: AbortSignal | undefined;
  /** Abort the current agent operation */
  abort(): void;
  /** Whether there are queued messages waiting */
  hasPendingMessages(): boolean;
  /** Gracefully shut down OpenClaw and exit. Available in all contexts. */
  shutdown(): void;
  /** Get current context usage for the active model. */
  getContextUsage(): ContextUsage | undefined;
  /** Trigger compaction without awaiting completion. */
  compact(options?: CompactOptions): void;
  /** Get the current effective system prompt. */
  getSystemPrompt(): string;
}
/**
 * Extended context for command handlers.
 * Includes session control methods only safe in user-initiated commands.
 */
interface ExtensionCommandContext extends ExtensionContext {
  /** Wait for the agent to finish streaming */
  waitForIdle(): Promise<void>;
  /** Start a new session, optionally with initialization. */
  newSession(options?: {
    parentSession?: string;
    setup?: (sessionManager: SessionManager) => Promise<void>;
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }): Promise<{
    cancelled: boolean;
  }>;
  /** Fork from a specific entry, creating a new session file. */
  fork(entryId: string, options?: {
    position?: "before" | "at";
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }): Promise<{
    cancelled: boolean;
  }>;
  /** Navigate to a different point in the session tree. */
  navigateTree(targetId: string, options?: {
    summarize?: boolean;
    customInstructions?: string;
    replaceInstructions?: boolean;
    label?: string;
  }): Promise<{
    cancelled: boolean;
  }>;
  /** Switch to a different session file. */
  switchSession(sessionPath: string, options?: {
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }): Promise<{
    cancelled: boolean;
  }>;
  /** Reload extensions, skills, prompts, and themes. */
  reload(): Promise<void>;
}
/**
 * Fresh command-capable context bound to the replacement session after a session switch.
 *
 * This is passed to `withSession()` callbacks on `newSession()`, `fork()`, and `switchSession()`.
 */
interface ReplacedSessionContext extends ExtensionCommandContext {
  sendMessage<T = unknown>(message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details">, options?: {
    triggerTurn?: boolean;
    deliverAs?: "steer" | "followUp" | "nextTurn";
  }): Promise<void>;
  sendUserMessage(content: string | (TextContent | ImageContent)[], options?: {
    deliverAs?: "steer" | "followUp";
  }): Promise<void>;
}
/** Rendering options for tool results */
interface ToolRenderResultOptions {
  /** Whether the result view is expanded */
  expanded: boolean;
  /** Whether this is a partial/streaming result */
  isPartial: boolean;
}
/** Context passed to tool renderers. */
interface ToolRenderContext<TState = unknown, TArgs = unknown> {
  /** Current tool call arguments. Shared across call/result renders for the same tool call. */
  args: TArgs;
  /** Unique id for this tool execution. Stable across call/result renders for the same tool call. */
  toolCallId: string;
  /** Invalidate just this tool execution component for redraw. */
  invalidate: () => void;
  /** Previously returned component for this render slot, if any. */
  lastComponent: Component | undefined;
  /** Shared renderer state for this tool row. Initialized by tool-execution.ts. */
  state: TState;
  /** Working directory for this tool execution. */
  cwd: string;
  /** Whether the tool execution has started. */
  executionStarted: boolean;
  /** Whether the tool call arguments are complete. */
  argsComplete: boolean;
  /** Whether the tool result is partial/streaming. */
  isPartial: boolean;
  /** Whether the result view is expanded. */
  expanded: boolean;
  /** Whether inline images are currently shown in the TUI. */
  showImages: boolean;
  /** Whether the current result is an error. */
  isError: boolean;
}
type BivariantCallback<TArgs extends unknown[], TResult> = {
  bivarianceHack(...args: TArgs): TResult;
}["bivarianceHack"];
/**
 * Tool definition for registerTool().
 */
interface ToolDefinition<TParams extends TSchema = TSchema, TDetails = unknown, TState = unknown> {
  /** Tool name (used in LLM tool calls) */
  name: string;
  /** Human-readable label for UI */
  label: string;
  /** Preserve lifecycle telemetry without rendering transient channel progress. */
  hideFromChannelProgress?: boolean;
  /** Tool results contain externally controlled network content. */
  resultContentSource?: AgentTool["resultContentSource"];
  /** Description for LLM */
  description: string;
  /** Optional one-line snippet for the Available tools section in the default system prompt. Custom tools are omitted from that section when this is not provided. */
  promptSnippet?: string;
  /** Optional guideline bullets appended to the default system prompt Guidelines section when this tool is active. */
  promptGuidelines?: string[];
  /** Parameter schema (TypeBox) */
  parameters: TParams;
  /** Exact schema for the structured value returned in AgentToolResult.details. */
  outputSchema?: TSchema;
  /** Controls whether ToolExecutionComponent renders the standard colored shell or the tool renders its own framing. */
  renderShell?: "default" | "self";
  /** Optional compatibility shim to prepare raw tool call arguments before schema validation. Must return an object conforming to TParams. */
  prepareArguments?: (args: unknown) => Static<TParams>;
  /**
   * Per-tool execution mode override.
   * - "sequential": this tool must execute one at a time with other tool calls.
   * - "parallel": this tool can execute concurrently with other tool calls.
   *
   * If omitted, the default execution mode applies.
   */
  executionMode?: ToolExecutionMode;
  /** Execute the tool. */
  execute(toolCallId: string, params: Static<TParams>, signal: AbortSignal | undefined, onUpdate: AgentToolUpdateCallback<TDetails> | undefined, ctx: ExtensionContext): Promise<AgentToolResult<TDetails>>;
  /** Custom rendering for tool call display */
  renderCall?: BivariantCallback<[args: Static<TParams>, theme: Theme, context: ToolRenderContext<TState, Static<TParams>>], Component>;
  /** Custom rendering for tool result display */
  renderResult?: BivariantCallback<[result: AgentToolResult<TDetails>, options: ToolRenderResultOptions, theme: Theme, context: ToolRenderContext<TState, Static<TParams>>], Component>;
}
/** Fired after session_start to allow extensions to provide additional resource paths. */
interface ResourcesDiscoverEvent {
  type: "resources_discover";
  cwd: string;
  reason: "startup" | "reload";
}
/** Result from resources_discover event handler */
interface ResourcesDiscoverResult {
  skillPaths?: string[];
  promptPaths?: string[];
  themePaths?: string[];
}
/** Fired when a session is started, loaded, or reloaded */
interface SessionStartEvent {
  type: "session_start";
  /** Why this session start happened. */
  reason: "startup" | "reload" | "new" | "resume" | "fork";
  /** Previously active session file. Present for "new", "resume", and "fork". */
  previousSessionFile?: string;
}
/** Fired before switching to another session (can be cancelled) */
interface SessionBeforeSwitchEvent {
  type: "session_before_switch";
  reason: "new" | "resume";
  targetSessionFile?: string;
}
/** Fired before forking a session (can be cancelled) */
interface SessionBeforeForkEvent {
  type: "session_before_fork";
  entryId: string;
  position: "before" | "at";
}
/** Fired before context compaction (can be cancelled or customized) */
interface SessionBeforeCompactEvent {
  type: "session_before_compact";
  preparation: CompactionPreparation;
  branchEntries: SessionEntry[];
  customInstructions?: string;
  signal: AbortSignal;
  /** Prepared reasoning level for extension-owned summarization. */
  thinkingLevel?: ThinkingLevel;
  /** Prepared provider stream for extension-owned summarization. */
  streamFn?: StreamFn;
}
/** Fired after context compaction */
interface SessionCompactEvent {
  type: "session_compact";
  compactionEntry: CompactionEntry;
  fromExtension: boolean;
}
/** Fired before an extension runtime is torn down due to quit, reload, or session replacement. */
interface SessionShutdownEvent {
  type: "session_shutdown";
  reason: "quit" | "reload" | "new" | "resume" | "fork";
  /** Destination session file when shutting down due to session replacement. */
  targetSessionFile?: string;
}
/** Preparation data for tree navigation */
interface TreePreparation {
  targetId: string;
  oldLeafId: string | null;
  commonAncestorId: string | null;
  entriesToSummarize: SessionEntry[];
  userWantsSummary: boolean;
  /** Custom instructions for summarization */
  customInstructions?: string;
  /** If true, customInstructions replaces the default prompt instead of being appended */
  replaceInstructions?: boolean;
  /** Label to attach to the branch summary entry */
  label?: string;
}
/** Fired before navigating in the session tree (can be cancelled) */
interface SessionBeforeTreeEvent {
  type: "session_before_tree";
  preparation: TreePreparation;
  signal: AbortSignal;
}
/** Fired after navigating in the session tree */
interface SessionTreeEvent {
  type: "session_tree";
  newLeafId: string | null;
  oldLeafId: string | null;
  summaryEntry?: BranchSummaryEntry;
  fromExtension?: boolean;
}
type SessionEvent = SessionStartEvent | SessionBeforeSwitchEvent | SessionBeforeForkEvent | SessionBeforeCompactEvent | SessionCompactEvent | SessionShutdownEvent | SessionBeforeTreeEvent | SessionTreeEvent;
/** Fired before each LLM call. Can modify messages. */
interface ContextEvent {
  type: "context";
  messages: AgentMessage[];
}
/** Fired before a provider request is sent. Can replace the payload. */
interface BeforeProviderRequestEvent {
  type: "before_provider_request";
  payload: unknown;
}
/** Fired after a provider response is received and before the response stream is consumed. */
interface AfterProviderResponseEvent {
  type: "after_provider_response";
  status: number;
  headers: Record<string, string>;
}
/** Fired after user submits prompt but before agent loop. */
interface BeforeAgentStartEvent {
  type: "before_agent_start";
  /** The raw user prompt text (after expansion). */
  prompt: string;
  /** Images attached to the user prompt, if any. */
  images?: ImageContent[];
  /** The fully assembled system prompt string. */
  systemPrompt: string;
  /** Structured options used to build the system prompt. Extensions can inspect this without re-discovering resources. */
  systemPromptOptions: BuildSystemPromptOptions;
}
/** Fired when an agent loop starts */
interface AgentStartEvent {
  type: "agent_start";
}
/** Fired when an agent loop ends */
interface AgentEndEvent {
  type: "agent_end";
  messages: AgentMessage[];
}
/** Fired once the session has no automatic retry, compaction, or queued continuation left. */
interface AgentSettledEvent {
  type: "agent_settled";
}
/** Fired at the start of each turn */
interface TurnStartEvent {
  type: "turn_start";
  turnIndex: number;
  timestamp: number;
}
/** Fired at the end of each turn */
interface TurnEndEvent {
  type: "turn_end";
  turnIndex: number;
  message: AgentMessage;
  toolResults: ToolResultMessage[];
}
/** Fired when a message starts (user, assistant, or toolResult) */
interface MessageStartEvent {
  type: "message_start";
  message: AgentMessage;
}
/** Fired during assistant message streaming with token-by-token updates */
interface MessageUpdateEvent {
  type: "message_update";
  message: AgentMessage;
  assistantMessageEvent: AssistantMessageEvent;
}
/** Fired when a message ends */
interface MessageEndEvent {
  type: "message_end";
  message: AgentMessage;
}
/** Fired when a tool starts executing */
interface ToolExecutionStartEvent {
  type: "tool_execution_start";
  toolCallId: string;
  toolName: string;
  args: unknown;
}
/** Fired during tool execution with partial/streaming output */
interface ToolExecutionUpdateEvent {
  type: "tool_execution_update";
  toolCallId: string;
  toolName: string;
  args: unknown;
  partialResult: unknown;
}
/** Fired when a tool finishes executing */
interface ToolExecutionEndEvent {
  type: "tool_execution_end";
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError: boolean;
}
type ModelSelectSource = "set" | "cycle" | "restore";
/** Fired when a new model is selected */
interface ModelSelectEvent {
  type: "model_select";
  model: Model;
  previousModel: Model | undefined;
  source: ModelSelectSource;
}
/** Fired when a new thinking level is selected */
interface ThinkingLevelSelectEvent {
  type: "thinking_level_select";
  level: ThinkingLevel;
  previousLevel: ThinkingLevel;
}
/** Fired when user executes a bash command via ! or !! prefix */
interface UserBashEvent {
  type: "user_bash";
  /** The command to execute */
  command: string;
  /** True if !! prefix was used (excluded from LLM context) */
  excludeFromContext: boolean;
  /** Current working directory */
  cwd: string;
}
/** Source of user input */
type InputSource = "interactive" | "rpc" | "extension";
/** Fired when user input is received, before agent processing */
interface InputEvent {
  type: "input";
  /** The input text */
  text: string;
  /** Attached images, if any */
  images?: ImageContent[];
  /** Where the input came from */
  source: InputSource;
}
/** Result from input event handler */
type InputEventResult = {
  action: "continue";
} | {
  action: "transform";
  text: string;
  images?: ImageContent[];
} | {
  action: "handled";
};
interface ToolCallEventBase {
  type: "tool_call";
  toolCallId: string;
}
interface BashToolCallEvent extends ToolCallEventBase {
  toolName: "bash";
  input: BashToolInput;
}
interface ReadToolCallEvent extends ToolCallEventBase {
  toolName: "read";
  input: ReadToolInput;
}
interface EditToolCallEvent extends ToolCallEventBase {
  toolName: "edit";
  input: EditToolInput;
}
interface WriteToolCallEvent extends ToolCallEventBase {
  toolName: "write";
  input: WriteToolInput;
}
interface GrepToolCallEvent extends ToolCallEventBase {
  toolName: "grep";
  input: GrepToolInput;
}
interface FindToolCallEvent extends ToolCallEventBase {
  toolName: "find";
  input: FindToolInput;
}
interface LsToolCallEvent extends ToolCallEventBase {
  toolName: "ls";
  input: LsToolInput;
}
interface CustomToolCallEvent extends ToolCallEventBase {
  toolName: string;
  input: Record<string, unknown>;
}
/**
 * Fired before a tool executes. Can block.
 *
 * `event.input` is mutable. Mutate it in place to patch tool arguments before execution.
 * Later `tool_call` handlers see earlier mutations. No re-validation is performed after mutation.
 */
type ToolCallEvent = BashToolCallEvent | ReadToolCallEvent | EditToolCallEvent | WriteToolCallEvent | GrepToolCallEvent | FindToolCallEvent | LsToolCallEvent | CustomToolCallEvent;
interface ToolResultEventBase {
  type: "tool_result";
  toolCallId: string;
  input: Record<string, unknown>;
  content: (TextContent | ImageContent)[];
  isError: boolean;
}
interface BashToolResultEvent extends ToolResultEventBase {
  toolName: "bash";
  details: BashToolDetails | undefined;
}
interface ReadToolResultEvent extends ToolResultEventBase {
  toolName: "read";
  details: ReadToolDetails | undefined;
}
interface EditToolResultEvent extends ToolResultEventBase {
  toolName: "edit";
  details: EditToolDetails | undefined;
}
interface WriteToolResultEvent extends ToolResultEventBase {
  toolName: "write";
  details: undefined;
}
interface GrepToolResultEvent extends ToolResultEventBase {
  toolName: "grep";
  details: GrepToolDetails | undefined;
}
interface FindToolResultEvent extends ToolResultEventBase {
  toolName: "find";
  details: FindToolDetails | undefined;
}
interface LsToolResultEvent extends ToolResultEventBase {
  toolName: "ls";
  details: LsToolDetails | undefined;
}
interface CustomToolResultEvent extends ToolResultEventBase {
  toolName: string;
  details: unknown;
}
/** Fired after a tool executes. Can modify result. */
type ToolResultEvent = BashToolResultEvent | ReadToolResultEvent | EditToolResultEvent | WriteToolResultEvent | GrepToolResultEvent | FindToolResultEvent | LsToolResultEvent | CustomToolResultEvent;
/** Union of all event types */
type ExtensionEvent = ResourcesDiscoverEvent | SessionEvent | ContextEvent | BeforeProviderRequestEvent | AfterProviderResponseEvent | BeforeAgentStartEvent | AgentStartEvent | AgentEndEvent | AgentSettledEvent | TurnStartEvent | TurnEndEvent | MessageStartEvent | MessageUpdateEvent | MessageEndEvent | ToolExecutionStartEvent | ToolExecutionUpdateEvent | ToolExecutionEndEvent | ModelSelectEvent | ThinkingLevelSelectEvent | UserBashEvent | InputEvent | ToolCallEvent | ToolResultEvent;
interface ContextEventResult {
  messages?: AgentMessage[];
}
type BeforeProviderRequestEventResult = unknown;
interface ToolCallEventResult {
  /** Block tool execution. To modify arguments, mutate `event.input` in place instead. */
  block?: boolean;
  reason?: string;
}
/** Result from user_bash event handler */
interface UserBashEventResult {
  /** Custom operations to use for execution */
  operations?: BashOperations;
  /** Full replacement: extension handled execution, use this result */
  result?: BashResult;
}
interface ToolResultEventResult {
  content?: (TextContent | ImageContent)[];
  details?: unknown;
  isError?: boolean;
}
interface MessageEndEventResult {
  /** Replace the finalized message. The replacement must keep the original message role. */
  message?: AgentMessage;
}
interface BeforeAgentStartEventResult {
  message?: Pick<CustomMessage, "customType" | "content" | "display" | "details">;
  /** Replace the system prompt for this turn. If multiple extensions return this, they are chained. */
  systemPrompt?: string;
}
interface SessionBeforeSwitchResult {
  cancel?: boolean;
}
interface SessionBeforeForkResult {
  cancel?: boolean;
  skipConversationRestore?: boolean;
}
interface SessionBeforeCompactResult {
  cancel?: boolean;
  compaction?: CompactionResult;
}
interface SessionBeforeTreeResult {
  cancel?: boolean;
  summary?: {
    summary: string;
    details?: unknown;
  };
  /** Override custom instructions for summarization */
  customInstructions?: string;
  /** Override whether customInstructions replaces the default prompt */
  replaceInstructions?: boolean;
  /** Override label to attach to the branch summary entry */
  label?: string;
}
interface MessageRenderOptions {
  expanded: boolean;
}
type MessageRenderer<T = unknown> = (message: CustomMessage<T>, options: MessageRenderOptions, theme: Theme) => Component | undefined;
interface RegisteredCommand {
  name: string;
  sourceInfo: SourceInfo;
  description?: string;
  getArgumentCompletions?: (argumentPrefix: string) => AutocompleteItem[] | null | Promise<AutocompleteItem[] | null>;
  handler: (args: string, ctx: ExtensionCommandContext) => Promise<void>;
}
interface ResolvedCommand extends RegisteredCommand {
  invocationName: string;
}
/** Handler function type for events */
type ExtensionHandler<E, R = undefined> = (event: E, ctx: ExtensionContext) => Promise<R | void> | R | void;
/**
 * ExtensionAPI passed to extension factory functions.
 */
interface ExtensionAPI {
  on(event: "resources_discover", handler: ExtensionHandler<ResourcesDiscoverEvent, ResourcesDiscoverResult>): void;
  on(event: "session_start", handler: ExtensionHandler<SessionStartEvent>): void;
  on(event: "session_before_switch", handler: ExtensionHandler<SessionBeforeSwitchEvent, SessionBeforeSwitchResult>): void;
  on(event: "session_before_fork", handler: ExtensionHandler<SessionBeforeForkEvent, SessionBeforeForkResult>): void;
  on(event: "session_before_compact", handler: ExtensionHandler<SessionBeforeCompactEvent, SessionBeforeCompactResult>): void;
  on(event: "session_compact", handler: ExtensionHandler<SessionCompactEvent>): void;
  on(event: "session_shutdown", handler: ExtensionHandler<SessionShutdownEvent>): void;
  on(event: "session_before_tree", handler: ExtensionHandler<SessionBeforeTreeEvent, SessionBeforeTreeResult>): void;
  on(event: "session_tree", handler: ExtensionHandler<SessionTreeEvent>): void;
  on(event: "context", handler: ExtensionHandler<ContextEvent, ContextEventResult>): void;
  on(event: "before_provider_request", handler: ExtensionHandler<BeforeProviderRequestEvent, BeforeProviderRequestEventResult>): void;
  on(event: "after_provider_response", handler: ExtensionHandler<AfterProviderResponseEvent>): void;
  on(event: "before_agent_start", handler: ExtensionHandler<BeforeAgentStartEvent, BeforeAgentStartEventResult>): void;
  on(event: "agent_start", handler: ExtensionHandler<AgentStartEvent>): void;
  on(event: "agent_end", handler: ExtensionHandler<AgentEndEvent>): void;
  on(event: "agent_settled", handler: ExtensionHandler<AgentSettledEvent>): void;
  on(event: "turn_start", handler: ExtensionHandler<TurnStartEvent>): void;
  on(event: "turn_end", handler: ExtensionHandler<TurnEndEvent>): void;
  on(event: "message_start", handler: ExtensionHandler<MessageStartEvent>): void;
  on(event: "message_update", handler: ExtensionHandler<MessageUpdateEvent>): void;
  on(event: "message_end", handler: ExtensionHandler<MessageEndEvent, MessageEndEventResult>): void;
  on(event: "tool_execution_start", handler: ExtensionHandler<ToolExecutionStartEvent>): void;
  on(event: "tool_execution_update", handler: ExtensionHandler<ToolExecutionUpdateEvent>): void;
  on(event: "tool_execution_end", handler: ExtensionHandler<ToolExecutionEndEvent>): void;
  on(event: "model_select", handler: ExtensionHandler<ModelSelectEvent>): void;
  on(event: "thinking_level_select", handler: ExtensionHandler<ThinkingLevelSelectEvent>): void;
  on(event: "tool_call", handler: ExtensionHandler<ToolCallEvent, ToolCallEventResult>): void;
  on(event: "tool_result", handler: ExtensionHandler<ToolResultEvent, ToolResultEventResult>): void;
  on(event: "user_bash", handler: ExtensionHandler<UserBashEvent, UserBashEventResult>): void;
  on(event: "input", handler: ExtensionHandler<InputEvent, InputEventResult>): void;
  /** Register a tool that the LLM can call. */
  registerTool<TParams extends TSchema = TSchema, TDetails = unknown, TState = unknown>(tool: ToolDefinition<TParams, TDetails, TState>): void;
  /** Register a custom command. */
  registerCommand(name: string, options: Omit<RegisteredCommand, "name" | "sourceInfo">): void;
  /** Register a keyboard shortcut. */
  registerShortcut(shortcut: KeyId, options: {
    description?: string;
    handler: (ctx: ExtensionContext) => Promise<void> | void;
  }): void;
  /** Register a CLI flag. */
  registerFlag(name: string, options: {
    description?: string;
    type: "boolean" | "string";
    default?: boolean | string;
  }): void;
  /** Get the value of a registered CLI flag. */
  getFlag(name: string): boolean | string | undefined;
  /** Register a custom renderer for CustomMessageEntry. */
  registerMessageRenderer<T = unknown>(customType: string, renderer: MessageRenderer<T>): void;
  /** Send a custom message to the session. */
  sendMessage<T = unknown>(message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details">, options?: {
    triggerTurn?: boolean;
    deliverAs?: "steer" | "followUp" | "nextTurn";
  }): void;
  /**
   * Send a user message to the agent. Always triggers a turn.
   * When the agent is streaming, use deliverAs to specify how to queue the message.
   */
  sendUserMessage(content: string | (TextContent | ImageContent)[], options?: {
    deliverAs?: "steer" | "followUp";
  }): void;
  /** Append a custom entry to the session for state persistence (not sent to LLM). */
  appendEntry(customType: string, data?: unknown): void;
  /** Set the session display name (shown in session selector). */
  setSessionName(name: string): void;
  /** Get the current session name, if set. */
  getSessionName(): string | undefined;
  /** Set or clear a label on an entry. Labels are user-defined markers for bookmarking/navigation. */
  setLabel(entryId: string, label: string | undefined): void;
  /** Execute a shell command. */
  exec(command: string, args: string[], options?: ExecOptions): Promise<ExecResult>;
  /** Get the list of currently active tool names. */
  getActiveTools(): string[];
  /** Get all configured tools with parameter schema and source metadata. */
  getAllTools(): ToolInfo[];
  /** Set the active tools by name. */
  setActiveTools(toolNames: string[]): void;
  /** Get available slash commands in the current session. */
  getCommands(): SlashCommandInfo[];
  /** Set the current model. Returns false if no API key available. */
  setModel(model: Model): Promise<boolean>;
  /** Get current thinking level. */
  getThinkingLevel(): ThinkingLevel;
  /** Set thinking level (clamped to model capabilities). */
  setThinkingLevel(level: ThinkingLevel): void;
  /**
   * Register a model provider.
   *
   * If `models` is provided: replaces all existing models for this provider.
   * If `oauth` is provided: registers OAuth provider for /login support.
   * If `streamSimple` is provided: registers a custom API stream handler.
   *
   * During initial extension load this call is queued and applied once the
   * runner has bound its context. After that it takes effect immediately, so
   * it is safe to call from command handlers or event callbacks without
   * requiring a `/reload`.
   *
   * @example
   * // Register a new provider with custom models
   * api.registerProvider("my-proxy", {
   *   baseUrl: "https://proxy.example.com",
   *   apiKey: "PROXY_API_KEY",
   *   api: "anthropic-messages",
   *   models: [
   *     {
   *       id: "claude-sonnet-4-20250514",
   *       name: "Claude 4 Sonnet (proxy)",
   *       reasoning: false,
   *       input: ["text", "image"],
   *       cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
   *       contextWindow: 200000,
   *       maxTokens: 16384
   *     }
   *   ]
   * });
   *
   * @example
   * // Override baseUrl for an existing provider
   * api.registerProvider("anthropic", {
   *   baseUrl: "https://proxy.example.com"
   * });
   *
   * @example
   * // Register provider with OAuth support
   * api.registerProvider("corporate-ai", {
   *   baseUrl: "https://ai.corp.com",
   *   api: "openai-responses",
   *   models: [...],
   *   oauth: {
   *     name: "Corporate AI (SSO)",
   *     async login(callbacks) { ... },
   *     async refreshToken(credentials) { ... },
   *     getApiKey(credentials) { return credentials.access; }
   *   }
   * });
   */
  registerProvider(name: string, config: ProviderConfig): void;
  /**
   * Unregister a previously registered provider.
   *
   * Removes all models belonging to the named provider and reloads the configured
   * model registry. Has no effect if the provider is not currently registered.
   *
   * Like `registerProvider`, this takes effect immediately when called after
   * the initial load phase.
   *
   * @example
   * api.unregisterProvider("my-proxy");
   */
  unregisterProvider(name: string): void;
  /** Shared event bus for extension communication. */
  events: EventBus;
}
/** Configuration for registering a provider via api.registerProvider(). */
interface ProviderConfig {
  /** Display name for the provider in UI. */
  name?: string;
  /** Base URL for the API endpoint. Required when defining models. */
  baseUrl?: string;
  /** API key or environment variable name. Required when defining models (unless oauth provided). */
  apiKey?: string;
  /** API type. Required at provider or model level when defining models. */
  api?: Api;
  /** Optional streamSimple handler for custom APIs. */
  streamSimple?: (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
  /** Custom headers to include in requests. */
  headers?: Record<string, string>;
  /** If true, adds Authorization: Bearer header with the resolved API key. */
  authHeader?: boolean;
  /** Models to register. If provided, replaces all existing models for this provider. */
  models?: ProviderModelConfig[];
  /** OAuth provider for /login support. The `id` is set automatically from the provider name. */
  oauth?: {
    /** Display name for the provider in login UI. */name: string; /** Run the login flow, return credentials to persist. */
    login(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials>; /** Refresh expired credentials, return updated credentials to persist. */
    refreshToken(credentials: OAuthCredentials): Promise<OAuthCredentials>; /** Convert credentials to API key string for the provider. */
    getApiKey(credentials: OAuthCredentials): string; /** Optional: modify models for this provider (e.g., update baseUrl based on credentials). */
    modifyModels?(models: Model[], credentials: OAuthCredentials): Model[];
  };
}
/** Configuration for a model within a provider. */
interface ProviderModelConfig {
  /** Model ID (e.g., "claude-sonnet-4-20250514"). */
  id: string;
  /** Display name (e.g., "Claude 4 Sonnet"). */
  name: string;
  /** API type override for this model. */
  api?: Api;
  /** API endpoint URL override for this model. */
  baseUrl?: string;
  /** Whether the model supports extended thinking. */
  reasoning: boolean;
  /** Maps OpenClaw thinking levels to provider/model-specific values; null marks a level unsupported. */
  thinkingLevelMap?: Model["thinkingLevelMap"];
  /** Supported input types. */
  input: ("text" | "image")[];
  /** Cost per token (for tracking, can be 0). */
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  /** Maximum context window size in tokens. */
  contextWindow: number;
  /** Maximum output tokens. */
  maxTokens: number;
  /** Custom headers for this model. */
  headers?: Record<string, string>;
  /** OpenAI compatibility settings. */
  compat?: Model["compat"];
}
/** Extension factory function type. Supports both sync and async initialization. */
type ExtensionFactory = (api: ExtensionAPI) => void | Promise<void>;
interface RegisteredTool {
  definition: ToolDefinition;
  sourceInfo: SourceInfo;
}
interface ExtensionFlag {
  name: string;
  description?: string;
  type: "boolean" | "string";
  default?: boolean | string;
  extensionPath: string;
}
interface ExtensionShortcut {
  shortcut: KeyId;
  description?: string;
  handler: (ctx: ExtensionContext) => Promise<void> | void;
  extensionPath: string;
}
type HandlerFn = (...args: unknown[]) => Promise<unknown>;
type SendMessageHandler = <T = unknown>(message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details">, options?: {
  triggerTurn?: boolean;
  deliverAs?: "steer" | "followUp" | "nextTurn";
}) => void;
type SendUserMessageHandler = (content: string | (TextContent | ImageContent)[], options?: {
  deliverAs?: "steer" | "followUp";
}) => void;
type AppendEntryHandler = (customType: string, data?: unknown) => void;
type SetSessionNameHandler = (name: string) => void;
type GetSessionNameHandler = () => string | undefined;
type GetActiveToolsHandler = () => string[];
/** Tool info with name, description, parameter schema, and source metadata */
type ToolInfo = Pick<ToolDefinition, "name" | "description" | "parameters"> & {
  sourceInfo: SourceInfo;
};
type GetAllToolsHandler = () => ToolInfo[];
type GetCommandsHandler = () => SlashCommandInfo[];
type SetActiveToolsHandler = (toolNames: string[]) => void;
type RefreshToolsHandler = () => void;
type SetModelHandler = (model: Model) => Promise<boolean>;
type GetThinkingLevelHandler = () => ThinkingLevel;
type SetThinkingLevelHandler = (level: ThinkingLevel) => void;
type SetLabelHandler = (entryId: string, label: string | undefined) => void;
/**
 * Shared state created by loader, used during registration and runtime.
 * Contains flag values (defaults set during registration, CLI values set after).
 */
interface ExtensionRuntimeState {
  flagValues: Map<string, boolean | string>;
  /** Provider registrations queued during extension loading, processed when runner binds */
  pendingProviderRegistrations: Array<{
    name: string;
    config: ProviderConfig;
    extensionPath: string;
  }>;
  /** Throws when this extension instance is stale after runtime replacement. */
  assertActive: () => void;
  /** Marks this extension instance as stale after runtime replacement or reload. */
  invalidate: (message?: string) => void;
  /**
   * Register or unregister a provider.
   *
   * Before bindCore(): queues registrations / removes from queue.
   * After bindCore(): calls ModelRegistry directly for immediate effect.
   */
  registerProvider: (name: string, config: ProviderConfig, extensionPath?: string) => void;
  unregisterProvider: (name: string, extensionPath?: string) => void;
}
/**
 * Action implementations for ExtensionAPI methods.
 * Provided to runner.initialize(), copied into the shared runtime.
 */
interface ExtensionActions {
  sendMessage: SendMessageHandler;
  sendUserMessage: SendUserMessageHandler;
  appendEntry: AppendEntryHandler;
  setSessionName: SetSessionNameHandler;
  getSessionName: GetSessionNameHandler;
  setLabel: SetLabelHandler;
  getActiveTools: GetActiveToolsHandler;
  getAllTools: GetAllToolsHandler;
  setActiveTools: SetActiveToolsHandler;
  refreshTools: RefreshToolsHandler;
  getCommands: GetCommandsHandler;
  setModel: SetModelHandler;
  getThinkingLevel: GetThinkingLevelHandler;
  setThinkingLevel: SetThinkingLevelHandler;
}
/**
 * Actions for ExtensionContext (ctx.* in event handlers).
 * Required by all modes.
 */
interface ExtensionContextActions {
  getModel: () => Model | undefined;
  isIdle: () => boolean;
  getSignal: () => AbortSignal | undefined;
  abort: () => void;
  hasPendingMessages: () => boolean;
  shutdown: () => void;
  getContextUsage: () => ContextUsage | undefined;
  compact: (options?: CompactOptions) => void;
  getSystemPrompt: () => string;
}
/**
 * Actions for ExtensionCommandContext (ctx.* in command handlers).
 * Only needed for interactive mode where extension commands are invokable.
 */
interface ExtensionCommandContextActions {
  waitForIdle: () => Promise<void>;
  newSession: (options?: {
    parentSession?: string;
    setup?: (sessionManager: SessionManager) => Promise<void>;
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }) => Promise<{
    cancelled: boolean;
  }>;
  fork: (entryId: string, options?: {
    position?: "before" | "at";
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }) => Promise<{
    cancelled: boolean;
  }>;
  navigateTree: (targetId: string, options?: {
    summarize?: boolean;
    customInstructions?: string;
    replaceInstructions?: boolean;
    label?: string;
  }) => Promise<{
    cancelled: boolean;
  }>;
  switchSession: (sessionPath: string, options?: {
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }) => Promise<{
    cancelled: boolean;
  }>;
  reload: () => Promise<void>;
}
/**
 * Full runtime = state + actions.
 * Created by loader with throwing action stubs, completed by runner.initialize().
 */
interface ExtensionRuntime extends ExtensionRuntimeState, ExtensionActions {}
/** Loaded extension with all registered items. */
interface Extension {
  path: string;
  resolvedPath: string;
  sourceInfo: SourceInfo;
  handlers: Map<string, HandlerFn[]>;
  tools: Map<string, RegisteredTool>;
  messageRenderers: Map<string, MessageRenderer>;
  commands: Map<string, RegisteredCommand>;
  flags: Map<string, ExtensionFlag>;
  shortcuts: Map<KeyId, ExtensionShortcut>;
}
interface ExtensionError {
  extensionPath: string;
  event: string;
  error: string;
  stack?: string;
}
//#endregion
//#region src/agents/sessions/extensions/loader.d.ts
/**
 * Create a runtime with throwing stubs for action methods.
 * Runner.bindCore() replaces these with real implementations.
 */
declare function createExtensionRuntime(): ExtensionRuntime;
/**
 * Create an Extension from an inline factory function.
 */
declare function loadExtensionFromFactory(factory: ExtensionFactory, cwd: string, eventBus: EventBus, runtime: ExtensionRuntime, extensionPath?: string): Promise<Extension>;
//#endregion
//#region src/agents/sessions/extensions/runner.d.ts
/** Combined result from all before_agent_start handlers */
interface BeforeAgentStartCombinedResult {
  messages?: NonNullable<BeforeAgentStartEventResult["message"]>[];
  systemPrompt?: string;
}
/**
 * Events handled by the generic emit() method.
 * Events with dedicated emitXxx() methods are excluded for stronger type safety.
 */
type RunnerEmitEvent = Exclude<ExtensionEvent, ToolCallEvent | ToolResultEvent | UserBashEvent | ContextEvent | BeforeProviderRequestEvent | BeforeAgentStartEvent | MessageEndEvent | ResourcesDiscoverEvent | InputEvent>;
type RunnerEmitResult<TEvent extends RunnerEmitEvent> = TEvent extends {
  type: "session_before_switch";
} ? SessionBeforeSwitchResult | undefined : TEvent extends {
  type: "session_before_fork";
} ? SessionBeforeForkResult | undefined : TEvent extends {
  type: "session_before_compact";
} ? SessionBeforeCompactResult | undefined : TEvent extends {
  type: "session_before_tree";
} ? SessionBeforeTreeResult | undefined : undefined;
type ExtensionErrorListener = (error: ExtensionError) => void;
declare class ExtensionRunner {
  private extensions;
  private runtime;
  private uiContext;
  private cwd;
  private sessionManager;
  private modelRegistry;
  private errorListeners;
  private getModel;
  private isIdleFn;
  private getSignalFn;
  private waitForIdleFn;
  private abortFn;
  private hasPendingMessagesFn;
  private getContextUsageFn;
  private compactFn;
  private getSystemPromptFn;
  private newSessionHandler;
  private forkHandler;
  private navigateTreeHandler;
  private switchSessionHandler;
  private reloadHandler;
  private shutdownHandler;
  private shortcutDiagnostics;
  private commandDiagnostics;
  private staleMessage;
  constructor(extensions: Extension[], runtime: ExtensionRuntime, cwd: string, sessionManager: SessionManager, modelRegistry: ModelRegistry);
  bindCore(actions: ExtensionActions, contextActions: ExtensionContextActions, providerActions?: {
    registerProvider?: (name: string, config: ProviderConfig) => void;
    unregisterProvider?: (name: string) => void;
  }): void;
  bindCommandContext(actions?: ExtensionCommandContextActions): void;
  setUIContext(uiContext?: ExtensionUIContext): void;
  getUIContext(): ExtensionUIContext;
  hasUI(): boolean;
  getExtensionPaths(): string[];
  /** Get all registered tools from all extensions (first registration per name wins). */
  getAllRegisteredTools(): RegisteredTool[];
  /** Get a tool definition by name. Returns undefined if not found. */
  getToolDefinition(toolName: string): RegisteredTool["definition"] | undefined;
  getFlags(): Map<string, ExtensionFlag>;
  setFlagValue(name: string, value: boolean | string): void;
  getFlagValues(): Map<string, boolean | string>;
  getShortcuts(resolvedKeybindings: KeybindingsConfig): Map<KeyId, ExtensionShortcut>;
  getShortcutDiagnostics(): ResourceDiagnostic[];
  invalidate(message?: string): void;
  private assertActive;
  onError(listener: ExtensionErrorListener): () => void;
  emitError(error: ExtensionError): void;
  hasHandlers(eventType: string): boolean;
  getMessageRenderer(customType: string): MessageRenderer | undefined;
  private resolveRegisteredCommands;
  getRegisteredCommands(): ResolvedCommand[];
  getCommandDiagnostics(): ResourceDiagnostic[];
  getCommand(name: string): ResolvedCommand | undefined;
  /**
   * Request a graceful shutdown. Called by extension tools and event handlers.
   * The actual shutdown behavior is provided by the mode via bindExtensions().
   */
  shutdown(): void;
  /**
   * Create an ExtensionContext for use in event handlers and tool execution.
   * Context values are resolved at call time, so changes via bindCore/bindUI are reflected.
   */
  createContext(): ExtensionContext;
  createCommandContext(): ExtensionCommandContext;
  private isSessionBeforeEvent;
  emit<TEvent extends RunnerEmitEvent>(event: TEvent): Promise<RunnerEmitResult<TEvent>>;
  emitMessageEnd(event: MessageEndEvent): Promise<AgentMessage | undefined>;
  emitToolResult(event: ToolResultEvent): Promise<ToolResultEventResult | undefined>;
  emitToolCall(event: ToolCallEvent): Promise<ToolCallEventResult | undefined>;
  emitUserBash(event: UserBashEvent): Promise<UserBashEventResult | undefined>;
  emitContext(messages: AgentMessage[]): Promise<AgentMessage[]>;
  emitBeforeProviderRequest(payload: unknown): Promise<unknown>;
  emitBeforeAgentStart(prompt: string, images: ImageContent[] | undefined, systemPrompt: string, systemPromptOptions: BuildSystemPromptOptions): Promise<BeforeAgentStartCombinedResult | undefined>;
  emitResourcesDiscover(cwd: string, reason: ResourcesDiscoverEvent["reason"]): Promise<{
    skillPaths: Array<{
      path: string;
      extensionPath: string;
    }>;
    promptPaths: Array<{
      path: string;
      extensionPath: string;
    }>;
    themePaths: Array<{
      path: string;
      extensionPath: string;
    }>;
  }>;
  /** Emit input event. Transforms chain, "handled" short-circuits. */
  emitInput(text: string, images: ImageContent[] | undefined, source: InputSource): Promise<InputEventResult>;
}
//#endregion
//#region src/agents/sessions/tools/read.d.ts
declare const readSchema: Type.TObject<{
  path: Type.TString;
  offset: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TNumber>;
}>;
/**
 * Pluggable operations for the read tool.
 * Override these to delegate file reading to remote systems (for example SSH).
 */
interface ReadOperations {
  /** Resolve a user-supplied path for this read backend. */
  resolvePath?: (filePath: string, cwd: string) => string | Promise<string>;
  /** Decode text bytes for this backend. Custom backends default to UTF-8. */
  decodeText?: (params: {
    buffer: Buffer;
    absolutePath: string;
  }) => string;
  /** Read file contents as a Buffer */
  readFile: (absolutePath: string) => Promise<Buffer>;
  /** Check if file is readable (throw if not) */
  access: (absolutePath: string) => Promise<void>;
  /** Detect image MIME type, return null or undefined for non-images */
  detectImageMimeType?: (absolutePath: string, buffer: Buffer) => Promise<string | null | undefined>;
}
interface ReadToolOptions {
  /** Whether to auto-resize images to 2000x2000 max. Default: true */
  autoResizeImages?: boolean;
  /** Custom operations for file reading. Default: local filesystem */
  operations?: ReadOperations;
}
declare function createReadTool(cwd: string, options?: ReadToolOptions): AgentTool<typeof readSchema>;
//#endregion
export { ExtensionAPI as a, formatSkillsForPrompt as c, generateSummary as d, createEventBus as f, loadExtensionFromFactory as i, ModelRegistry as l, ExtensionRunner as n, ExtensionContext as o, createExtensionRuntime as r, ToolDefinition as s, createReadTool as t, AuthStorage as u };