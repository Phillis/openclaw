import { a as AcpRuntimeEnsureInput, c as AcpRuntimePromptMode, d as AcpRuntimeTurn, f as AcpRuntimeTurnAttachment, g as AcpSessionUpdateTag, h as AcpRuntimeTurnResultError, i as AcpRuntimeDoctorReport, l as AcpRuntimeSessionMode, m as AcpRuntimeTurnResult, n as AcpRuntimeCapabilities, o as AcpRuntimeEvent, p as AcpRuntimeTurnInput, r as AcpRuntimeControl, s as AcpRuntimeHandle, t as AcpRuntime, u as AcpRuntimeStatus } from "../types-DI-7ERAP.js";
import { a as SessionAcpIdentity, c as SessionAcpMeta, i as AcpSessionRuntimeOptions, l as SessionId, n as AcpServerOptions, o as SessionAcpIdentitySource, r as AcpSession, s as SessionAcpIdentityState, t as AcpProvenanceMode, u as normalizeAcpProvenanceMode } from "../types-Bst3_XVW.js";
import { i as stringifyNonErrorCause } from "../error-coercion-BNmzukkS.js";
import { readBool, readMetadataNumber, readMetadataString, readNonNegativeInteger } from "./meta.js";
import { isParentOwnedBackgroundAcpSession, isRequesterParentOfBackgroundAcpSession } from "./session-interaction-mode.js";
import { AcpSessionLineageMeta, AcpSessionLineageRow, toAcpSessionLineageMeta } from "./session-lineage-meta.js";
import { AcpSessionStore, createInMemorySessionStore, defaultAcpSessionStore } from "./session.js";
import { a as isAcpRuntimeError, i as formatAcpErrorChain, n as AcpRuntimeError, o as toAcpRuntimeError, r as AcpRuntimeErrorCode, s as withAcpRuntimeErrorBoundary, t as ACP_ERROR_CODES } from "../errors-Buu3ylDF.js";
import { formatAcpRuntimeErrorText, toAcpRuntimeErrorText } from "./runtime/error-text.js";
import { ACP_SESSION_IDENTITY_RENDERER_VERSION, AcpSessionIdentifierRenderMode, resolveAcpSessionCwd, resolveAcpSessionIdentifierLinesFromIdentity, resolveAcpThreadSessionDetailLines } from "./runtime/session-identifiers.js";
import { createIdentityFromEnsure, createIdentityFromHandleEvent, createIdentityFromStatus, identityEquals, identityHasStableSessionId, isSessionIdentityPending, mergeSessionIdentity, resolveRuntimeHandleIdentifiersFromIdentity, resolveRuntimeResumeSessionId, resolveSessionIdentityFromMeta } from "./runtime/session-identity.js";

//#region packages/acp-core/src/error-format.d.ts
/** Installs a host-provided redactor used before ACP fallback secret-pattern redaction. */
declare function configureAcpErrorRedactor(redactor: ((value: string) => string) | undefined): void;
/** Redacts common HTTP, payment, assignment, and private-key secrets from error text. */
declare function redactSensitiveText(value: string): string;
//#endregion
//#region packages/acp-core/src/structured-auth-redaction.d.ts
declare const HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
declare const HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN: string;
declare const HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN: string;
declare const HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN: string;
declare const HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN: string;
declare const HTTP_AUTH_HEADER_BOUNDARY_PATTERN: string;
declare const HTTP_AUTH_SERIALIZED_QUOTE_PATTERN: string;
declare const CREDENTIAL_STYLE_HEADER_REDACT_PATTERN: string;
type StructuredAuthParamRange = {
  start: number;
  end: number;
};
declare function findStructuredAuthParamRanges(value: string): StructuredAuthParamRange[];
declare function redactStructuredAuthHeaders(value: string, replacement: string): string;
//#endregion
export { ACP_ERROR_CODES, ACP_SESSION_IDENTITY_RENDERER_VERSION, AcpProvenanceMode, AcpRuntime, AcpRuntimeCapabilities, AcpRuntimeControl, AcpRuntimeDoctorReport, AcpRuntimeEnsureInput, AcpRuntimeError, AcpRuntimeErrorCode, AcpRuntimeEvent, AcpRuntimeHandle, AcpRuntimePromptMode, AcpRuntimeSessionMode, AcpRuntimeStatus, AcpRuntimeTurn, AcpRuntimeTurnAttachment, AcpRuntimeTurnInput, AcpRuntimeTurnResult, AcpRuntimeTurnResultError, AcpServerOptions, AcpSession, AcpSessionIdentifierRenderMode, AcpSessionLineageMeta, AcpSessionLineageRow, AcpSessionRuntimeOptions, AcpSessionStore, AcpSessionUpdateTag, CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, HTTP_AUTH_HEADER_BOUNDARY_PATTERN, HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN, HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_SCHEME_PATTERN, HTTP_AUTH_SERIALIZED_QUOTE_PATTERN, SessionAcpIdentity, SessionAcpIdentitySource, SessionAcpIdentityState, SessionAcpMeta, SessionId, StructuredAuthParamRange, configureAcpErrorRedactor, createIdentityFromEnsure, createIdentityFromHandleEvent, createIdentityFromStatus, createInMemorySessionStore, defaultAcpSessionStore, findStructuredAuthParamRanges, formatAcpErrorChain, formatAcpRuntimeErrorText, identityEquals, identityHasStableSessionId, isAcpRuntimeError, isParentOwnedBackgroundAcpSession, isRequesterParentOfBackgroundAcpSession, isSessionIdentityPending, mergeSessionIdentity, normalizeAcpProvenanceMode, readBool, readMetadataNumber, readMetadataString, readNonNegativeInteger, redactSensitiveText, redactStructuredAuthHeaders, resolveAcpSessionCwd, resolveAcpSessionIdentifierLinesFromIdentity, resolveAcpThreadSessionDetailLines, resolveRuntimeHandleIdentifiersFromIdentity, resolveRuntimeResumeSessionId, resolveSessionIdentityFromMeta, stringifyNonErrorCause, toAcpRuntimeError, toAcpRuntimeErrorText, toAcpSessionLineageMeta, withAcpRuntimeErrorBoundary };