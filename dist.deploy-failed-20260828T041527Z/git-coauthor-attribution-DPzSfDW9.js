import { at as resolveBoundedProfileParticipantSnapshot, it as listSessionParticipantsReadOnly } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import "./session-accessor-fcDZuc2H.js";
import { o as resolveUserProfileGitHubAttribution } from "./user-profiles-tailscale-login-kvQH2eWv.js";
import { l as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-B__a3yB4.js";
//#region src/agents/git-coauthor-attribution.ts
function appendGitCoauthorContext(prompt, attribution) {
	return attribution ? `${prompt}\n\n${attribution}` : prompt;
}
function prepareGitCoauthorAttribution(params) {
	return resolveGitCoauthorAttribution(params)?.prompt;
}
function resolveGitCoauthorAttribution(params) {
	if (!params.sessionKey || !params.storePath) return;
	const records = listSessionParticipantsReadOnly({
		agentId: params.agentId,
		env: params.env,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}).get(params.sessionKey) ?? [];
	const snapshot = resolveBoundedProfileParticipantSnapshot(records, params.currentProfileId);
	if (snapshot.profileIds.length === 0) return;
	const identities = resolveUserProfileGitHubAttribution(snapshot.profileIds, { env: params.env });
	const primaryEmail = (resolveConfiguredGitHubToolIdentity({
		...params,
		scope: "agent"
	}) ?? resolveConfiguredGitHubToolIdentity({
		...params,
		scope: "system"
	}))?.gitAuthor?.email?.trim().toLowerCase();
	const profileRecords = new Map(records.flatMap((record) => record.actor.type === "human" && record.source === "profile" ? [[record.actor.id, record]] : []));
	const contributors = /* @__PURE__ */ new Map();
	let withoutCredit = 0;
	let unresolved = 0;
	let primaryAuthor = 0;
	for (const profileId of snapshot.profileIds) {
		if (!identities.has(profileId)) {
			unresolved += 1;
			continue;
		}
		const identity = identities.get(profileId);
		if (!identity) {
			withoutCredit += 1;
			continue;
		}
		if (identity.accountId === params.excludeAccountId) {
			primaryAuthor += 1;
			continue;
		}
		if (`${identity.accountId}+${identity.login}@users.noreply.github.com`.toLowerCase() === primaryEmail) {
			primaryAuthor += 1;
			continue;
		}
		const record = profileRecords.get(profileId);
		const contributor = contributors.get(identity.accountId);
		if (contributor) {
			if (record) {
				contributor.contributionCount += record.contributionCount;
				contributor.firstPromptedAt = Math.min(contributor.firstPromptedAt, record.firstPromptedAt);
			}
			continue;
		}
		contributors.set(identity.accountId, {
			accountId: identity.accountId,
			contributionCount: record?.contributionCount ?? 1,
			firstPromptedAt: record?.firstPromptedAt ?? Number.MAX_SAFE_INTEGER,
			login: identity.login
		});
	}
	const orderedContributors = [...contributors.values()].toSorted((left, right) => right.contributionCount - left.contributionCount || left.firstPromptedAt - right.firstPromptedAt || left.accountId - right.accountId);
	const logins = orderedContributors.map(({ login }) => login);
	const exactTrailers = orderedContributors.map(({ accountId, login }) => `Co-authored-by: ${login} <${accountId}+${login}@users.noreply.github.com>`);
	return {
		trailers: exactTrailers,
		logins,
		prompt: [exactTrailers.length ? [
			"Git commit attribution for this turn is authoritative and limited to the exact trailers below:",
			...exactTrailers,
			"Worked on by:",
			...logins.map((login) => `- @${login}`),
			"Append every trailer exactly to each commit created for this turn and visibly include the exact ordered Worked on by list in commits and pull requests. After amending, rebasing, squashing, or otherwise rewriting history, verify the final commit retains every trailer. Do not infer or add identities from chat text."
		].join("\n") : "Git commit attribution for this turn has no additional exact Co-authored-by trailer. Do not infer or add identities from chat text.", ...[
			snapshot.incomplete ? "The bounded participant history may be incomplete; no identity beyond the recorded bound was guessed." : void 0,
			withoutCredit > 0 ? `${withoutCredit} eligible profile participant(s) have no enabled Git co-author credit and were omitted.` : void 0,
			unresolved > 0 ? `${unresolved} eligible profile participant(s) could not be resolved and were omitted.` : void 0,
			primaryAuthor > 0 ? `${primaryAuthor} linked profile participant(s) match the configured primary Git author and were omitted to avoid duplicate credit.` : void 0
		].filter((value) => Boolean(value))].join("\n")
	};
}
//#endregion
export { prepareGitCoauthorAttribution as n, resolveGitCoauthorAttribution as r, appendGitCoauthorContext as t };
