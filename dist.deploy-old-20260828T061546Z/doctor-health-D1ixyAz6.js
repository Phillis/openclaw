import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./error-runtime-CmA1H4Zg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./state-paths-DQKtm04E.js";
import { r as MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE, t as LLAMA_CPP_PROVIDER_INSTALL_COMMAND } from "./local-embedding-provider-BYt5VAF8.js";
import { t as collectVectorProviderFindings } from "./doctor-vector-index-provider-diagnostic-CtKorFX5.js";
//#region extensions/memory-core/src/doctor-health.ts
const MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID = "memory-core/managed-local-embedding-setup";
const pluginStateIsolatedDoctorCheckIds = [MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID];
const registrationsByHost = /* @__PURE__ */ new WeakMap();
function resolveSelectedMemoryProvider(config, agentId) {
	const agent = config.agents?.entries?.[agentId] ?? config.agents?.list?.find((entry) => entry.id === agentId);
	const defaults = config.memory?.search;
	const overrides = agent?.memory?.search;
	if (!(overrides?.enabled ?? defaults?.enabled ?? true)) return null;
	const provider = normalizeOptionalLowercaseString(overrides?.provider ?? defaults?.provider);
	return !provider || provider === "auto" ? "openai" : provider;
}
function createManagedLocalEmbeddingSetupCheck(state) {
	return {
		id: MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID,
		kind: "plugin",
		source: "memory-core",
		defaultEnabled: false,
		description: "Checks existing semantic indexes for required managed local embedding setup.",
		async detect(ctx) {
			if (!state.memoryCoreActive) return [];
			const env = ctx.env ?? process.env;
			let findings;
			try {
				findings = await collectVectorProviderFindings({
					config: ctx.cfg,
					env,
					stateDir: resolveStateDir(env)
				}, async (params) => {
					const provider = resolveSelectedMemoryProvider(params.config, params.agentId);
					if (!provider || provider === "none") return null;
					if (provider !== "local") return null;
					const failure = await state.inspectEmbeddingProviderSetup({
						config: params.config,
						env: params.env,
						agentId: params.agentId,
						provider
					});
					if (failure === void 0) return {
						provider,
						reason: MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE,
						requirement: "memory-embedding-provider-plugin",
						fixHint: `Run \`${LLAMA_CPP_PROVIDER_INSTALL_COMMAND}\`, ensure the plugin is enabled, then rerun this check.`
					};
					return failure;
				}, {
					indexInspectionMode: "readiness",
					inspectConfiguredMemorySecretRefs: true
				});
			} catch (error) {
				return [{
					checkId: MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID,
					severity: "error",
					source: "memory-core",
					target: "memory-core",
					requirement: "memory-index-inspection",
					message: `Memory Core semantic-index readiness could not be verified (${formatErrorMessage(error)}).`,
					fixHint: "Keep the current Gateway running, resolve the database inspection error, then rerun this check."
				}];
			}
			return findings.map((finding) => ({
				checkId: MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID,
				severity: "error",
				source: "memory-core",
				path: `${finding.configPrefix}.provider`,
				target: `${finding.agentId}/${finding.provider}`,
				requirement: finding.requirement ?? "managed-local-embedding-setup",
				message: `Memory index for agent ${finding.agentId} uses vector model ${finding.model}, but embedding provider "${finding.provider}" cannot initialize (${finding.reason}).`,
				fixHint: finding.fixHint
			}));
		}
	};
}
function registerMemoryCoreDoctorChecks(host) {
	let registration = registrationsByHost.get(host.registerHealthCheck);
	if (registration) {
		registration.state.inspectEmbeddingProviderSetup = host.inspectEmbeddingProviderSetup;
		registration.state.memoryCoreActive = host.memoryCoreActive;
	} else {
		const state = {
			inspectEmbeddingProviderSetup: host.inspectEmbeddingProviderSetup,
			memoryCoreActive: host.memoryCoreActive
		};
		registration = {
			check: createManagedLocalEmbeddingSetupCheck(state),
			state
		};
		registrationsByHost.set(host.registerHealthCheck, registration);
	}
	if (host.getHealthCheck("memory-core/managed-local-embedding-setup") === registration.check) return;
	host.registerHealthCheck(registration.check);
}
//#endregion
export { pluginStateIsolatedDoctorCheckIds as n, registerMemoryCoreDoctorChecks as r, MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID as t };
