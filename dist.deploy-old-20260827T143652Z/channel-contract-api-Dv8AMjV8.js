import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as openRootFileSync } from "./root-file-Chr9dJBe.js";
import "./boundary-file-read-BoOq_oud.js";
import { n as getCachedPluginModuleLoader, t as createPluginModuleLoaderCache } from "./plugin-module-loader-cache-DW5Tr4Iu.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-B91t3pWa.js";
import { o as getOfficialExternalPluginCatalogManifest, r as getOfficialExternalChannelSecretContract, u as listOfficialExternalChannelCatalogEntries } from "./official-external-plugin-catalog-CDrgEY7c.js";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-DBY_bHmV.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-BQhELyO0.js";
import "./shared-QozwPUGk.js";
import { c as isEnabledFlag, r as collectSecretInputAssignment, s as isChannelAccountEffectivelyEnabled } from "./runtime-shared-D-v-cKxA.js";
import { i as createChannelSecretTargetRegistryEntries, o as getChannelRecord } from "./channel-secret-basic-runtime-DyoTL1FR.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
//#region src/secrets/official-external-channel-secret-contract.ts
/** Host fallback secret contracts for external channels without contract artifacts. */
function hasActivationValue(params) {
	if (!params.activationField) return true;
	if (normalizeOptionalString(params.record[params.activationField])) return true;
	return Boolean(params.allowEnv && params.activationEnv && normalizeOptionalString(params.env[params.activationEnv]));
}
function loadOfficialExternalChannelSecretContractApi(channelId) {
	const contract = getOfficialExternalChannelSecretContract(channelId);
	if (!contract) return;
	const fieldNames = contract.fields.map((field) => field.field);
	return {
		secretTargetRegistryEntries: createChannelSecretTargetRegistryEntries({
			channelKey: contract.channelId,
			channel: fieldNames,
			account: fieldNames
		}),
		collectRuntimeConfigAssignments({ config, defaults, context }) {
			const channel = getChannelRecord(config, contract.channelId);
			if (!channel) return;
			for (const field of contract.fields) {
				const activationEnvValue = field.activationEnv ? normalizeOptionalString(context.env[field.activationEnv]) : void 0;
				if (isEnabledFlag(channel) && field.activationField && !normalizeOptionalString(channel[field.activationField]) && activationEnvValue) channel[field.activationField] = activationEnvValue;
				collectSecretInputAssignment({
					value: channel[field.field],
					path: `channels.${contract.channelId}.${field.field}`,
					expected: "string",
					defaults,
					context,
					active: isEnabledFlag(channel) && hasActivationValue({
						record: channel,
						activationField: field.activationField,
						activationEnv: field.activationEnv,
						env: context.env,
						allowEnv: true
					}),
					inactiveReason: `external channel is disabled or ${field.activationField ?? "its credential surface"} is not configured.`,
					apply: (value) => {
						channel[field.field] = value;
					}
				});
				const accounts = isRecord(channel.accounts) ? channel.accounts : void 0;
				if (!accounts) continue;
				for (const [accountId, accountValue] of Object.entries(accounts)) {
					const account = isRecord(accountValue) ? accountValue : void 0;
					if (!account || !Object.hasOwn(account, field.field)) continue;
					collectSecretInputAssignment({
						value: account[field.field],
						path: `channels.${contract.channelId}.accounts.${accountId}.${field.field}`,
						expected: "string",
						defaults,
						context,
						active: isChannelAccountEffectivelyEnabled(channel, account) && hasActivationValue({
							record: account,
							activationField: field.activationField,
							activationEnv: field.activationEnv,
							env: context.env,
							allowEnv: false
						}),
						inactiveReason: `external channel account is disabled or ${field.activationField ?? "its credential surface"} is not configured.`,
						apply: (value) => {
							account[field.field] = value;
						}
					});
				}
			}
		}
	};
}
function listOfficialExternalChannelSecretTargetRegistryEntries() {
	return listOfficialExternalChannelCatalogEntries().flatMap((entry) => {
		const channelId = normalizeOptionalString(getOfficialExternalPluginCatalogManifest(entry)?.channel?.id);
		return channelId ? loadOfficialExternalChannelSecretContractApi(channelId)?.secretTargetRegistryEntries ?? [] : [];
	});
}
//#endregion
//#region src/secrets/channel-contract-api.ts
/** Loads channel secret contract APIs from bundled and external plugin artifacts. */
const CONTRACT_API_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts"
];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
const moduleLoaders = createPluginModuleLoaderCache();
function loadBundledChannelPublicArtifact(channelId, artifactBasename) {
	try {
		return loadBundledPluginPublicArtifactModuleSync({
			dirName: channelId,
			artifactBasename
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Unable to resolve bundled plugin public surface ")) return;
		throw error;
	}
}
/** Loads a bundled channel secret contract from its public artifact bundle. */
function loadBundledChannelSecretContractApi(channelId) {
	return loadBundledChannelPublicArtifact(channelId, "secret-contract-api.js");
}
function orderedContractApiExtensions() {
	return RUNNING_FROM_BUILT_ARTIFACT ? CONTRACT_API_EXTENSIONS : [...CONTRACT_API_EXTENSIONS.slice(3), ...CONTRACT_API_EXTENSIONS.slice(0, 3)];
}
function resolvePluginContractApiPath(rootDir) {
	const searchDirs = RUNNING_FROM_BUILT_ARTIFACT ? [path.join(rootDir, "dist"), rootDir] : [rootDir, path.join(rootDir, "dist")];
	for (const basename of ["secret-contract-api", "contract-api"]) for (const dir of searchDirs) for (const extension of orderedContractApiExtensions()) {
		const candidate = path.join(dir, `${basename}${extension}`);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}
function loadPluginContractModule(modulePath) {
	return getCachedPluginModuleLoader({
		cache: moduleLoaders,
		modulePath,
		importerUrl: import.meta.url
	})(modulePath);
}
function loadExternalChannelSecretContractFromRecord(record, env = process.env) {
	const contractPath = resolvePluginContractApiPath(record.rootDir);
	if (!contractPath) return;
	const opened = openRootFileSync({
		absolutePath: contractPath,
		rootPath: record.rootDir,
		boundaryLabel: "plugin root",
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: record.rootDir,
			env
		}),
		skipLexicalRootCheck: true
	});
	if (!opened.ok) return;
	const safePath = opened.path;
	fs.closeSync(opened.fd);
	try {
		const mod = loadPluginContractModule(safePath);
		if (mod.collectRuntimeConfigAssignments || mod.secretTargetRegistryEntries) return mod;
	} catch (error) {
		if (process.env.OPENCLAW_DEBUG_CHANNEL_CONTRACT_API === "1") {
			const detail = error instanceof Error ? error.message : String(error);
			console.warn(`[channel-contract-api] failed to load ${record.id} contract ${safePath}: ${detail}`);
		}
	}
}
function recordOwnsChannel(record, channelId) {
	return record.channels.includes(channelId) || Object.hasOwn(record.channelConfigs ?? {}, channelId) || record.channelCatalogMeta?.id === channelId || record.packageChannel?.id === channelId;
}
function listChannelSecretContractRecords(params) {
	return resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.env
	}).plugins.filter((record) => record.origin !== "bundled").filter((record) => recordOwnsChannel(record, params.channelId)).filter((record) => !params.loadablePluginOrigins || params.loadablePluginOrigins.has(record.id)).toSorted((left, right) => {
		if (left.id === params.channelId && right.id !== params.channelId) return -1;
		if (right.id === params.channelId && left.id !== params.channelId) return 1;
		return left.id.localeCompare(right.id);
	});
}
/** Loads the first channel secret contract for a channel, preferring bundled metadata. */
/** Loads a channel secret contract API for a channel id and current plugin origin policy. */
function loadChannelSecretContractApi(params) {
	const bundled = loadBundledChannelSecretContractApi(params.channelId);
	if (bundled || params.bundledOnly) return bundled;
	const env = params.env ?? process.env;
	const officialFallback = loadOfficialExternalChannelSecretContractApi(params.channelId);
	let records;
	try {
		records = listChannelSecretContractRecords({
			channelId: params.channelId,
			config: params.config,
			env,
			loadablePluginOrigins: params.loadablePluginOrigins
		});
	} catch (error) {
		if (officialFallback) return officialFallback;
		throw error;
	}
	for (const record of records) {
		const contract = loadExternalChannelSecretContractFromRecord(record, env);
		if (contract) return contract;
	}
	return officialFallback;
}
/** Loads a channel secret contract directly from a manifest record. */
function loadChannelSecretContractApiForRecord(record) {
	if (record.origin === "bundled") return loadBundledChannelSecretContractApi(record.id);
	return loadExternalChannelSecretContractFromRecord(record);
}
//#endregion
export { loadChannelSecretContractApiForRecord as n, listOfficialExternalChannelSecretTargetRegistryEntries as r, loadChannelSecretContractApi as t };
