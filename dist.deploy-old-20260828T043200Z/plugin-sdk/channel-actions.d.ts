import { i as resolvePollMaxSelections } from "../polls-sXqxREW1.js";
import { a as imageResultFromFile, c as readNonNegativeIntegerParam, d as readReactionParams, f as readStringArrayParam, i as createActionGate, l as readNumberParam, m as readToolStringParam, o as parseAvailableTags, p as readStringOrNumberParam, r as ToolAuthorizationError, t as ActionGate, u as readPositiveIntegerParam } from "../common-BcF4g4is.js";
import { t as jsonResult } from "../tool-results-CKFyNsQ1.js";
import { a as optionalPositiveIntegerSchema, i as optionalNonNegativeIntegerSchema, o as optionalStringEnum, r as optionalFiniteNumberSchema, s as stringEnum } from "../typebox-CG2pB18W.js";
//#region src/channels/plugins/actions/shared.d.ts
/**
 * Shared channel action helpers.
 *
 * Filters token-backed accounts and composes account-level action gates.
 */
type OptionalDefaultGate<TKey extends string> = (key: TKey, defaultValue?: boolean) => boolean;
type TokenSourcedAccount = {
  tokenSource?: string | null;
};
/**
 * Filters out accounts explicitly marked as tokenless.
 */
declare function listTokenSourcedAccounts<TAccount extends TokenSourcedAccount>(accounts: readonly TAccount[]): TAccount[];
/**
 * Creates an action gate that is enabled when any account-level gate enables the action.
 */
declare function createUnionActionGate<TAccount, TKey extends string>(accounts: readonly TAccount[], createGate: (account: TAccount) => OptionalDefaultGate<TKey>): OptionalDefaultGate<TKey>;
//#endregion
//#region src/channels/plugins/actions/reaction-message-id.d.ts
type ReactionToolContext = {
  currentMessageId?: string | number;
};
/**
 * Resolves the message id for reaction tools from explicit args or current tool context.
 */
declare function resolveReactionMessageId(params: {
  args: Record<string, unknown>;
  toolContext?: ReactionToolContext;
}): string | number | undefined;
//#endregion
//#region src/agents/date-time.d.ts
/** Add normalized timestamp fields without overwriting valid existing values. */
declare function withNormalizedTimestamp<T extends Record<string, unknown>>(value: T, rawTimestamp: unknown): T & {
  timestampMs?: number;
  timestampUtc?: string;
};
//#endregion
//#region src/agents/sandbox-paths.d.ts
declare function assertMediaNotDataUrl(media: string): void;
//#endregion
export { type ActionGate, ToolAuthorizationError, assertMediaNotDataUrl, createActionGate, createUnionActionGate, imageResultFromFile, jsonResult, listTokenSourcedAccounts, optionalFiniteNumberSchema, optionalNonNegativeIntegerSchema, optionalPositiveIntegerSchema, optionalStringEnum, parseAvailableTags, readNonNegativeIntegerParam, readNumberParam, readPositiveIntegerParam, readReactionParams, readStringArrayParam, readStringOrNumberParam, readToolStringParam as readStringParam, resolvePollMaxSelections, resolveReactionMessageId, stringEnum, withNormalizedTimestamp };