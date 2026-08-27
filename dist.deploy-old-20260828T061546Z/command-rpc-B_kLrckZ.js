import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-bvGF5XWf.js";
import { n as resolveSessionModelRef } from "./session-model-ref-Dc9mG8e_.js";
import { m as resolveStorePath, r as getSessionEntry } from "./session-store-runtime-ZfR7yV2q.js";
import "./model-session-runtime-ULOyyYTD.js";
import "./agent-runtime-dai5X0jZ.js";
import "./agent-harness-runtime-BeSKB82Z.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DZ1L5hge.js";
import { i as resolveCodexAppServerRuntimeOptions, s as resolveCodexSupervisionAppServerRuntimeOptions } from "./config-Cup3m5Mg.js";
import { Dt as isJsonObject, St as resolveCodexAppServerPreparedAuthHandoff, _t as resolveCodexAppServerAuthProfileId, yt as resolveCodexAppServerAuthProfileStore } from "./shared-client-DsH0bBjk.js";
import { a as closeCodexStartupClientBestEffort } from "./attempt-client-cleanup-CBrsZNhS.js";
import { n as listCodexAppServerModels } from "./models-C08KodZj.js";
import { a as withCodexAppServerJsonClient, i as requestCodexAppServerJson } from "./request-D5ZqL_4v.js";
import { t as resumeCodexAppServerThread } from "./thread-resume-DD663Ee5.js";
import { n as describeControlFailure, t as CODEX_CONTROL_METHODS } from "./capabilities-D3W23TKw.js";
import { n as prepareCodexAppServerAuthBinding } from "./auth-binding-DW1kd4-H.js";
//#region extensions/codex/src/command-rpc.ts
async function prepareControlAuth(options, startOptions) {
	if (!options.onResponse || !options.config || !options.sessionKey || options.authProfileId === null || startOptions.homeScope === "user") return {
		authProfileId: options.authProfileId ?? void 0,
		clientOptions: { authProfileId: options.authProfileId }
	};
	const config = options.config;
	const { sessionAgentId } = resolveSessionAgentIds({
		config,
		sessionKey: options.sessionKey,
		agentId: options.agentId
	});
	const agentDir = options.agentDir ?? resolveAgentDir(config, sessionAgentId);
	const workspaceDir = resolveAgentWorkspaceDir(config, sessionAgentId);
	const entry = getSessionEntry({
		agentId: sessionAgentId,
		storePath: resolveStorePath(config.session?.store, { agentId: sessionAgentId }),
		sessionKey: options.sessionKey,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	});
	const model = resolveSessionModelRef(config, entry, sessionAgentId);
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir,
		config
	});
	const { plan, attempts } = prepareAgentRuntimeAuth({
		provider: model.provider,
		modelId: model.model,
		config,
		agentDir,
		workspaceDir,
		authProfileStore: store,
		sessionAuthProfileId: entry?.authProfileOverride ?? options.authProfileId,
		sessionAuthProfileSource: entry?.authProfileOverrideSource,
		harnessId: "codex",
		harnessAuthBootstrap: "harness"
	});
	const route = plan.modelRoute;
	const resolvedAuth = route ? await resolveApiKeyForProvider({
		provider: route.provider,
		modelId: route.modelId,
		modelApi: route.api,
		cfg: config,
		agentDir,
		workspaceDir,
		store,
		profileId: attempts[0]?.profileId,
		lockedProfile: plan.forwardedAuthProfileSource === "user",
		allowAuthProfileFallback: attempts[0]?.allowAuthProfileFallback,
		skipSetupProviderFallback: true
	}) : void 0;
	const handoff = await resolveCodexAppServerPreparedAuthHandoff({
		authRequirement: route?.authRequirement,
		resolvedApiKey: resolvedAuth?.apiKey,
		authProfileId: route ? plan.forwardedAuthProfileId : resolveCodexAppServerAuthProfileId({
			authProfileId: plan.forwardedAuthProfileId,
			store,
			config
		}),
		authProfileStore: store,
		agentDir,
		homeScope: startOptions.homeScope ?? "agent",
		config,
		subscriptionProfileRequiredError: "Prepared Codex subscription route requires a forwarded OpenAI OAuth or token profile.",
		subscriptionProfileUnusableError: "Prepared Codex subscription auth profile is unusable."
	});
	const binding = handoff.authProfileId ? await prepareCodexAppServerAuthBinding({
		authProfileId: handoff.authProfileId,
		authProfileStore: store,
		agentDir,
		config
	}) : void 0;
	return {
		authProfileId: handoff.authProfileId,
		clientOptions: {
			...handoff.preparedAuth ? { preparedAuth: handoff.preparedAuth } : { authProfileId: handoff.authProfileId },
			authRequirement: route?.authRequirement,
			authProfileStore: binding?.authProfileStore ?? store,
			authBindingFingerprint: binding?.fingerprint,
			agentDir
		}
	};
}
function requestOptions(pluginConfig, limit, config, agentDir) {
	const runtime = resolveCodexAppServerRuntimeOptions({ pluginConfig });
	return {
		limit,
		timeoutMs: runtime.requestTimeoutMs,
		startOptions: runtime.start,
		config,
		agentDir
	};
}
async function codexControlRequest(pluginConfig, method, requestParams, options = {}) {
	const runtime = options.startOptions ? resolveCodexSupervisionAppServerRuntimeOptions({ pluginConfig }) : resolveCodexAppServerRuntimeOptions({ pluginConfig });
	const startOptions = options.startOptions ?? runtime.start;
	const auth = await prepareControlAuth(options, startOptions);
	const controlRequestOptions = {
		timeoutMs: options.timeoutMs ?? runtime.requestTimeoutMs,
		startOptions,
		config: options.config,
		sessionKey: options.sessionKey,
		sessionId: options.sessionId,
		agentDir: options.agentDir,
		isolated: options.isolated,
		...auth.clientOptions
	};
	if (options.onResponse || options.beforeRequest) return await withCodexAppServerJsonClient(controlRequestOptions, async (request, client, scope) => {
		await options.beforeRequest?.(request);
		scope.assertCurrent();
		let response;
		if (method === "thread/resume") {
			if (!isJsonObject(requestParams) || typeof requestParams.threadId !== "string") throw new Error("Codex thread/resume requires a thread id.");
			response = await resumeCodexAppServerThread({
				client,
				request: {
					...requestParams,
					threadId: requestParams.threadId
				},
				requestResume: () => request({
					method,
					requestParams
				}),
				abandonClient: () => closeCodexStartupClientBestEffort(client)
			});
		} else response = await request({
			method,
			requestParams
		});
		await options.onResponse?.(response, client, {
			authProfileId: auth.authProfileId,
			assertCurrent: scope.assertCurrent
		});
		scope.assertCurrent();
		return response;
	});
	return await requestCodexAppServerJson({
		method,
		requestParams,
		...controlRequestOptions
	});
}
async function safeCodexControlRequest(pluginConfig, method, requestParams, options = {}) {
	return await safeValue(async () => await codexControlRequest(pluginConfig, method, requestParams, options));
}
async function safeCodexModelList(pluginConfig, limit, config, agentDir) {
	return await safeValue(async () => await listCodexAppServerModels(requestOptions(pluginConfig, limit, config, agentDir)));
}
async function readCodexStatusProbes(pluginConfig, config, agentDir) {
	const [models, account, limits, mcps, skills] = await Promise.all([
		safeCodexModelList(pluginConfig, 20, config, agentDir),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.account, { refreshToken: false }, {
			config,
			agentDir
		}),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.rateLimits, void 0, {
			config,
			agentDir
		}),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listMcpServers, { limit: 100 }, {
			config,
			agentDir
		}),
		safeCodexControlRequest(pluginConfig, CODEX_CONTROL_METHODS.listSkills, {}, {
			config,
			agentDir
		})
	]);
	return {
		models,
		account,
		limits,
		mcps,
		skills
	};
}
async function safeValue(read) {
	try {
		return {
			ok: true,
			value: await read()
		};
	} catch (error) {
		return {
			ok: false,
			error: describeControlFailure(error)
		};
	}
}
//#endregion
export { safeCodexControlRequest as i, readCodexStatusProbes as n, requestOptions as r, codexControlRequest as t };
