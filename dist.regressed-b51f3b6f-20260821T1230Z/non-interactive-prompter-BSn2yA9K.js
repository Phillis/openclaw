import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { i as isMalformedApiKeyInput } from "./credential-state-DRH6Q-Y3.js";
import { i as resolveAuthProfileOrder } from "./order-jGX4iJ3y.js";
import { r as ensureAuthProfileStore } from "./store-BfXdFfLh.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { t as resolveEnvApiKey } from "./model-auth-env-B8fM73iy.js";
import "./auth-profiles-C5SvE-Ih.js";
import { n as resolveApiKeyForProfile } from "./oauth-C_hDxzAR.js";
import "./model-auth-Dah4Ay9K.js";
//#region src/commands/onboard-non-interactive/api-keys.ts
/**
* API-key resolution for non-interactive onboarding.
*
* The resolver keeps flag, environment, and auth-profile precedence consistent
* across provider setup paths while preserving secret-ref mode constraints.
*/
function parseEnvVarNameFromSourceLabel(source) {
	if (!source) return;
	return /^(?:shell env: |env: )([A-Z][A-Z0-9_]*)$/.exec(source.trim())?.[1];
}
async function resolveApiKeyFromProfiles(params) {
	const store = ensureAuthProfileStore(params.agentDir);
	const order = resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider: params.provider
	});
	for (const profileId of order) {
		if (store.profiles[profileId]?.type !== "api_key") continue;
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store,
			profileId,
			agentDir: params.agentDir
		});
		if (resolved?.apiKey) return resolved.apiKey;
	}
	return null;
}
/** Resolves an API key for non-interactive setup without prompting the user. */
async function resolveNonInteractiveApiKey(params) {
	const flagKey = normalizeOptionalSecretInput(params.flagValue);
	const explicitEnvVar = params.envVarName?.trim() || params.envVar.trim();
	const resolveExplicitEnvKey = () => normalizeOptionalSecretInput(process.env[explicitEnvVar]);
	const resolveEnvKey = () => {
		const envResolved = resolveEnvApiKey(params.provider, process.env, {
			config: params.cfg,
			workspaceDir: params.workspaceDir
		});
		const explicitEnvKey = explicitEnvVar ? normalizeOptionalSecretInput(process.env[explicitEnvVar]) : void 0;
		return {
			key: envResolved?.apiKey ?? explicitEnvKey,
			envVarName: parseEnvVarNameFromSourceLabel(envResolved?.source) ?? explicitEnvVar
		};
	};
	const useSecretRefMode = params.secretInputMode === "ref";
	if (useSecretRefMode && flagKey) {
		const explicitEnvKey = resolveExplicitEnvKey();
		if (explicitEnvKey) return {
			key: explicitEnvKey,
			source: "env",
			envVarName: explicitEnvVar
		};
		params.runtime.error([`${params.flagName} cannot be used with --secret-input-mode ref unless ${params.envVar} is set in env.`, `Set ${params.envVar} in env and omit ${params.flagName}, or use --secret-input-mode plaintext.`].join("\n"));
		params.runtime.exit(1);
		return null;
	}
	if (useSecretRefMode) {
		const resolvedEnv = resolveEnvKey();
		if (resolvedEnv.key) {
			if (!resolvedEnv.envVarName) {
				params.runtime.error([`--secret-input-mode ref requires an explicit environment variable for provider "${params.provider}".`, `Set ${params.envVar} in env and retry, or use --secret-input-mode plaintext.`].join("\n"));
				params.runtime.exit(1);
				return null;
			}
			return {
				key: resolvedEnv.key,
				source: "env",
				envVarName: resolvedEnv.envVarName
			};
		}
	}
	if (flagKey) {
		if (isMalformedApiKeyInput(flagKey)) {
			params.runtime.error("Paste the API key value, not an OpenClaw onboarding command.");
			params.runtime.exit(1);
			return null;
		}
		return {
			key: flagKey,
			source: "flag"
		};
	}
	const resolvedEnv = resolveEnvKey();
	if (resolvedEnv.key) return {
		key: resolvedEnv.key,
		source: "env",
		envVarName: resolvedEnv.envVarName
	};
	if (params.allowProfile ?? true) {
		const profileKey = await resolveApiKeyFromProfiles({
			provider: params.provider,
			cfg: params.cfg,
			agentDir: params.agentDir
		});
		if (profileKey) return {
			key: profileKey,
			source: "profile"
		};
	}
	if (params.required === false) return null;
	const profileHint = params.allowProfile === false ? "" : `, or existing ${params.provider} API-key profile`;
	params.runtime.error(`Missing ${params.flagName} (or ${params.envVar} in env${profileHint}). Export ${params.envVar}, pass ${params.flagName}, or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
	params.runtime.exit(1);
	return null;
}
//#endregion
//#region src/commands/non-interactive-prompter.ts
/** Builds a WizardPrompter for commands that must fail instead of prompting. */
function createNonInteractiveLoggingPrompter(runtime, formatPromptError) {
	const unavailable = (message) => Promise.reject(new Error(formatPromptError(message)));
	return {
		async intro(title) {
			runtime.log(title);
		},
		async outro(message) {
			runtime.log(message);
		},
		async note(message, title) {
			runtime.log(title ? `${title}\n${message}` : message);
		},
		async select(params) {
			return unavailable(params.message);
		},
		async multiselect(params) {
			return unavailable(params.message);
		},
		async text(params) {
			return unavailable(params.message);
		},
		async confirm(params) {
			return unavailable(params.message);
		},
		progress(label) {
			runtime.log(label);
			return {
				update(message) {
					runtime.log(message);
				},
				stop(message) {
					if (message) runtime.log(message);
				}
			};
		}
	};
}
//#endregion
export { resolveNonInteractiveApiKey as n, createNonInteractiveLoggingPrompter as t };
