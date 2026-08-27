import { o as ModelCompatConfig } from "./types.openclaw-Cjm06lg9.js";
import { a as Context, f as SimpleStreamOptions, i as AssistantMessageEventStreamContract, l as Model, n as Api, r as AssistantMessage } from "./types-CL_qQaPo.js";
import { n as PluginMetadataSnapshot, r as PluginMetadataSnapshotOwnerMaps } from "./plugin-metadata-snapshot.types-gOlGvA-L.js";
import "./index-C1qx1Yoz.js";
import { t as CompactionResult } from "./index-BSAlQ8TI.js";
import { c as ToolExecutionMode, i as AgentToolUpdateCallback, n as AgentTool, r as AgentToolResult } from "./types-CPd3N9Q-.js";
import "./templating-tHzj-d8O.js";
import { n as SourceInfo } from "./skill-contract---6RE6Le.js";
import { i as ReadonlySessionManager } from "./transcript-B37nXJYC.js";
import { t as ModelCatalogEntry } from "./model-catalog.types-BA_Lii60.js";
import { Static, TSchema, Type } from "typebox";
import "@openclaw/ai";
import "@openclaw/ai/internal/runtime";
import "@openclaw/ai/internal/shared";
import { AutocompleteProvider, Component, EditorComponent, EditorTheme, KeybindingsConfig, KeybindingsManager, OverlayHandle, OverlayOptions, TUI } from "@earendil-works/pi-tui";
//#region src/llm/stream.d.ts
declare function completeSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): Promise<AssistantMessage>;
//#endregion
//#region src/plugin-sdk/provider-oauth-runtime.d.ts
/** Normalized OAuth credential bundle persisted by provider auth profiles. */
type OAuthCredentials = {
  /** Refresh token or provider-equivalent long-lived credential. */
  refresh: string;
  /** Access token or provider-equivalent bearer credential. */
  access: string;
  /** Absolute epoch milliseconds when the access token should be considered expired. */
  expires: number;
  [key: string]: unknown;
};
/** Stable provider id used by OAuth credential and config routing. */
type OAuthProviderId = string;
/** Manual input prompt shown during OAuth login flows. */
type OAuthPrompt = {
  /** Prompt text shown to the operator. */
  message: string;
  /** Optional placeholder for manual text entry. */
  placeholder?: string;
  /** Whether empty input should be accepted instead of reprompting. */
  allowEmpty?: boolean;
};
/** Authorization URL and optional instructions shown before OAuth completion. */
type OAuthAuthInfo = {
  /** Provider authorization URL shown to the user. */
  url: string;
  /** Optional provider-specific instruction text for manual flows. */
  instructions?: string;
};
/** One selectable OAuth login option. */
type OAuthSelectOption = {
  /** Stable option id returned when the operator selects this entry. */
  id: string;
  /** Human-readable option label shown in the selector. */
  label: string;
};
/** Selector prompt used when a provider offers multiple OAuth login choices. */
type OAuthSelectPrompt = {
  /** Prompt text shown above the selectable options. */
  message: string;
  /** Options available for the operator to choose from. */
  options: OAuthSelectOption[];
};
/** UI/runtime callbacks used by provider OAuth login implementations. */
interface OAuthLoginCallbacks {
  /** Emits authorization URL/instructions to the UI before waiting for completion. */
  onAuth: (info: OAuthAuthInfo) => void;
  /** Prompts for manual input such as pasted callback URLs or authorization codes. */
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  /** Reports human-readable login progress without exposing secrets. */
  onProgress?: (message: string) => void;
  /** Optional direct manual-code entry hook used when callback-server flows cannot complete. */
  onManualCodeInput?: () => Promise<string>;
  /** Show an interactive selector and return the selected option id, or undefined on cancel. */
  onSelect?: (prompt: OAuthSelectPrompt) => Promise<string | undefined>;
  /** Cancels pending OAuth waits and prompts when aborted. */
  signal?: AbortSignal;
}
/** Provider OAuth contract implemented by provider plugins. */
interface OAuthProviderInterface {
  /** Stable provider id used for credential and config routing. */
  readonly id: OAuthProviderId;
  /** Human-readable provider name shown in login flows. */
  readonly name: string;
  /** Run the login flow and return credentials to persist. */
  login(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials>;
  /** Whether login uses a local callback server and supports manual code input. */
  usesCallbackServer?: boolean;
  /** Refresh expired credentials and return updated credentials to persist. */
  refreshToken(credentials: OAuthCredentials): Promise<OAuthCredentials>;
  /** Convert credentials to an API key string for the provider. */
  getApiKey(credentials: OAuthCredentials): string;
  /** Optionally adjust models for this provider, such as updating baseUrl. */
  modifyModels?(models: Model[], credentials: OAuthCredentials): Model[];
}
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
} & OAuthCredentials;
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
  login(providerId: OAuthProviderId, callbacks: OAuthLoginCallbacks): Promise<void>;
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
//#region src/agents/sessions/extensions/types.d.ts
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
    overlay?: boolean;
    /** Overlay positioning/sizing options. Can be static or a function for dynamic updates. */
    overlayOptions?: OverlayOptions | (() => OverlayOptions);
    /** Called with the overlay handle after the overlay is shown. Use to control visibility. */
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
//#endregion
//#region src/agents/model-catalog-lookup.d.ts
type ModelThinkingCompat = {
  thinkingFormat?: ModelCompatConfig["thinkingFormat"];
  supportedReasoningEfforts?: readonly string[] | null;
};
type PreparedModelThinkingCapability = Readonly<{
  provider: string;
  modelId: string;
  agentRuntime: string;
  /** Present only when the capability came from a physical provider route. */
  route?: Readonly<{
    api: string;
    baseUrl: string;
  }>;
  compat: ModelThinkingCompat;
}>;
/** Finds a provider-qualified model entry in a catalog. */
declare function findModelInCatalog(catalog: ModelCatalogEntry[], provider: string, modelId: string): ModelCatalogEntry | undefined;
//#endregion
//#region src/agents/model-catalog.d.ts
/**
 * Check if a model supports image input based on its catalog entry.
 */
declare function modelSupportsVision(entry: ModelCatalogEntry | undefined): boolean;
//#endregion
export { ModelRegistry as a, OAuthLoginCallbacks as c, ToolDefinition as i, completeSimple as l, PreparedModelThinkingCapability as n, AuthStorage as o, findModelInCatalog as r, OAuthCredentials as s, modelSupportsVision as t };