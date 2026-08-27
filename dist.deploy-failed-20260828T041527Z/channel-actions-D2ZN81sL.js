import "./sandbox-paths-C7Hkb46-.js";
import { g as readStringOrNumberParam } from "./common-CI1GnPjt.js";
import "./typebox-DzztcX9H.js";
import "./date-time-Ch20W-k8.js";
//#region src/channels/plugins/actions/shared.ts
/**
* Filters out accounts explicitly marked as tokenless.
*/
function listTokenSourcedAccounts(accounts) {
	return accounts.filter((account) => account.tokenSource !== "none");
}
/**
* Creates an action gate that is enabled when any account-level gate enables the action.
*/
function createUnionActionGate(accounts, createGate) {
	const gates = accounts.map((account) => createGate(account));
	return (key, defaultValue = true) => gates.some((gate) => gate(key, defaultValue));
}
//#endregion
//#region src/channels/plugins/actions/reaction-message-id.ts
/**
* Reaction action message-id resolver.
*
* Reads explicit reaction targets or falls back to the current tool message context.
*/
/**
* Resolves the message id for reaction tools from explicit args or current tool context.
*/
function resolveReactionMessageId(params) {
	return readStringOrNumberParam(params.args, "messageId") ?? params.toolContext?.currentMessageId;
}
//#endregion
export { createUnionActionGate as n, listTokenSourcedAccounts as r, resolveReactionMessageId as t };
