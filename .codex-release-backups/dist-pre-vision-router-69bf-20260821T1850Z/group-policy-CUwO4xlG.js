import { m as resolveScopeRequireMention, u as buildChannelGroupsScopeTree } from "./channel-policy-Dn6aXK3G.js";
//#region extensions/googlechat/src/group-policy.ts
function buildGoogleChatGroupPolicyScope(params) {
	const matchKey = params.groupId && Object.hasOwn(params.tree.scopes, params.groupId) ? params.groupId : void 0;
	return {
		tree: params.tree,
		path: matchKey ? [matchKey] : [],
		matchKey
	};
}
function resolveGoogleChatGroupRequireMention(params) {
	return resolveScopeRequireMention(buildGoogleChatGroupPolicyScope({
		tree: buildChannelGroupsScopeTree(params.cfg, "googlechat", params.accountId),
		groupId: params.groupId
	}));
}
//#endregion
export { resolveGoogleChatGroupRequireMention as n, buildGoogleChatGroupPolicyScope as t };
