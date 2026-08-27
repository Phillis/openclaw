//#region src/gateway/server-methods/session-creation-provenance.ts
function resolveOperatorSessionCreation(client, options = {}) {
	if (options.allowTrustedHint && client?.internal?.sessionCreation) return client.internal.sessionCreation;
	const agentRuntimeIdentity = client?.internal?.agentRuntimeIdentity;
	if (options.allowTrustedHint && agentRuntimeIdentity?.sessionSpawnContext) return {
		via: "spawn",
		actor: {
			type: "agent",
			id: agentRuntimeIdentity.sessionKey
		},
		...agentRuntimeIdentity.sessionSpawnContext.completionOwnerSessionKey ? { completionOwnerSessionKey: agentRuntimeIdentity.sessionSpawnContext.completionOwnerSessionKey } : {},
		inheritedToolPolicy: agentRuntimeIdentity.sessionSpawnContext.inheritedToolPolicy
	};
	const profileId = client?.authenticatedUserProfile?.profileId;
	return {
		via: "operator",
		...profileId ? { actor: {
			type: "human",
			id: profileId
		} } : {}
	};
}
function resolveAgentRunSessionCreation(client) {
	const actor = resolveOperatorSessionCreation(client).actor;
	return {
		via: "run",
		...actor ? { actor } : {}
	};
}
//#endregion
export { resolveOperatorSessionCreation as n, resolveAgentRunSessionCreation as t };
