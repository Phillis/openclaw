import { a as ExtensionAPI, c as formatSkillsForPrompt, d as generateSummary, f as createEventBus, i as loadExtensionFromFactory, l as ModelRegistry, n as ExtensionRunner, o as ExtensionContext, r as createExtensionRuntime, t as createReadTool, u as AuthStorage } from "../index-D4zZ2xWk.js";
import { a as parseSessionEntries, c as SessionEntry, i as migrateSessionEntries, n as SessionManager, r as buildSessionContext } from "../session-manager-B7xs4kTa.js";

//#region src/config/sessions/version.d.ts
/** Current persisted session transcript/header schema version. */
declare const CURRENT_SESSION_VERSION = 3;
//#endregion
//#region src/plugins/provider-runtime.errors.d.ts
/** A known OAuth provider could not load its owning plugin or required auth hooks. */
declare class OAuthProviderConfiguredUnavailableError extends Error {
  readonly code: "OAUTH_PROVIDER_CONFIGURED_UNAVAILABLE";
  readonly state: "configured-unavailable";
  readonly providerId: string;
  constructor(providerId: string);
}
//#endregion
export { AuthStorage, CURRENT_SESSION_VERSION, type ExtensionAPI, type ExtensionContext, ExtensionRunner, ModelRegistry, OAuthProviderConfiguredUnavailableError, type SessionEntry, SessionManager, buildSessionContext, createEventBus, createExtensionRuntime, createReadTool, formatSkillsForPrompt, generateSummary, loadExtensionFromFactory, migrateSessionEntries, parseSessionEntries };