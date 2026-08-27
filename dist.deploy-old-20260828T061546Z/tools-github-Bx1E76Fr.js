import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as consumeGitHubSetupHandoff } from "./secret-store-DzZIiLba.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Aa as validateToolsGitHubAuthorizePollParams, Fa as validateToolsGitHubStatusParams, Ma as validateToolsGitHubAuthorizeStartParams, Oa as validateToolsGitHubAuthorizeCancelParams, Pa as validateToolsGitHubConfigureParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { f as resolveManagedGitHubProfileDir, l as resolveConfiguredGitHubToolIdentity, n as createManagedGitHubProfileId, r as installManagedGitHubProfile, u as resolveGitHubToolIdentityStatus } from "./github-tool-identity-B__a3yB4.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-0q-ojjmE.js";
import { t as updateGitHubToolIdentityConfig } from "./github-tool-identity-config-yG3BOfza.js";
//#region src/gateway/server-methods/tools-github.ts
const toolsGitHubHandlers = {
	"tools.github.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateToolsGitHubStatusParams, "tools.github.status", respond)) return;
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: params.agentId,
			respond,
			cfg: context.getRuntimeConfig(),
			normalize: normalizeOptionalString
		});
		if (!resolved) return;
		respond(true, await resolveGitHubToolIdentityStatus({
			config: context.getRuntimeConfig(),
			agentId: resolved.agentId,
			selectedScope: params.selectedScope
		}));
	},
	"tools.github.configure": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateToolsGitHubConfigureParams, "tools.github.configure", respond)) return;
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: params.agentId,
			respond,
			cfg: context.getRuntimeConfig(),
			normalize: normalizeOptionalString
		});
		if (!resolved) return;
		try {
			const previousIdentity = resolveConfiguredGitHubToolIdentity({
				config: resolved.cfg,
				agentId: resolved.agentId,
				scope: params.scope
			});
			if (params.mode === "inherit") {
				const nextConfig = await updateGitHubToolIdentityConfig({
					scope: params.scope,
					agentId: resolved.agentId,
					expectedIdentity: previousIdentity ?? null
				});
				if (previousIdentity?.kind === "oauth") context.githubOAuthService?.retireProfile(previousIdentity.profileId);
				respond(true, await resolveGitHubToolIdentityStatus({
					config: nextConfig,
					agentId: resolved.agentId,
					selectedScope: params.scope
				}));
				return;
			}
			const gitAuthor = params.gitAuthor ? {
				...params.gitAuthor.name !== void 0 ? { name: params.gitAuthor.name.trim() } : {},
				...params.gitAuthor.email !== void 0 ? { email: params.gitAuthor.email.trim() } : {}
			} : void 0;
			const token = consumeGitHubSetupHandoff({ name: params.secretName });
			if (!token) throw new Error("temporary GitHub credential is unavailable");
			const profileId = createManagedGitHubProfileId();
			const profileDir = resolveManagedGitHubProfileDir({
				agentId: resolved.agentId,
				scope: params.scope,
				profileId
			});
			let nextConfig = resolved.cfg;
			await installManagedGitHubProfile({
				profileDir,
				token,
				commitConfig: async (account) => {
					const identity = {
						profileId,
						gitAuthor: gitAuthor ?? {
							name: account.login,
							email: `${account.accountId}+${account.login}@users.noreply.github.com`
						}
					};
					nextConfig = await updateGitHubToolIdentityConfig({
						scope: params.scope,
						agentId: resolved.agentId,
						identity,
						expectedIdentity: previousIdentity ?? null
					});
				}
			});
			if (previousIdentity?.kind === "oauth") context.githubOAuthService?.retireProfile(previousIdentity.profileId);
			respond(true, await resolveGitHubToolIdentityStatus({
				config: nextConfig,
				agentId: resolved.agentId,
				selectedScope: params.scope
			}));
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub identity setup failed"));
		}
	},
	"tools.github.authorize.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateToolsGitHubAuthorizeStartParams, "tools.github.authorize.start", respond)) return;
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: params.agentId,
			respond,
			cfg: context.getRuntimeConfig(),
			normalize: normalizeOptionalString
		});
		if (!resolved) return;
		try {
			const service = context.githubOAuthService;
			if (!service) throw new Error("GitHub authorization lifecycle is unavailable.");
			respond(true, await service.startAuthorization({
				scope: params.scope,
				agentId: resolved.agentId
			}));
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub authorization could not start"));
		}
	},
	"tools.github.authorize.poll": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateToolsGitHubAuthorizePollParams, "tools.github.authorize.poll", respond)) return;
		try {
			const service = context.githubOAuthService;
			if (!service) throw new Error("GitHub authorization lifecycle is unavailable.");
			respond(true, await service.pollAuthorization(params.requestId));
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub authorization polling failed"));
		}
	},
	"tools.github.authorize.cancel": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateToolsGitHubAuthorizeCancelParams, "tools.github.authorize.cancel", respond)) return;
		const service = context.githubOAuthService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub authorization lifecycle is unavailable"));
			return;
		}
		respond(true, { cancelled: service.cancelAuthorization(params.requestId) });
	}
};
//#endregion
export { toolsGitHubHandlers };
