import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import "./agent-scope-BizOtGGz.js";
import { f as resolveDefaultAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { c as resolveSharedMainAuthAgentDir } from "./path-resolve-CttHagpC.js";
import { a as loadPersistedAuthProfileStore, o as loadPersistedSharedAuthProfileStore, s as mergeAuthProfileStores } from "./persisted-tYYP9V51.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-B67UeNMn.js";
import { b as updateAuthProfileStoreWithLock } from "./store-2zwMbXSG.js";
import { t as parseModelCatalogJson } from "./model-catalog-json-CxUsDrkg.js";
import { i as isGeneratedPluginModelCatalog, s as loadPersistedPluginModelCatalogsReadOnly } from "./plugin-model-catalog-BScQHhpo.js";
import { t as note } from "./note-D7f3pYFE.js";
import { t as listAgentModelsJsonPaths } from "./storage-scan-CX6EsU2l.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-model-catalog-credentials.ts
/** Doctor-owned migration of plaintext model-catalog credentials into agent SQLite. */
function emptyStore() {
	return {
		version: 1,
		profiles: {}
	};
}
function credentialMatches(credential, { provider, key }) {
	if (normalizeProviderId(credential?.provider ?? "") !== normalizeProviderId(provider)) return false;
	return credential?.type === "api_key" && credential.key === key || credential?.type === "token" && credential.token === key;
}
function collectCredentials(providers, store, blockedStores = []) {
	if (!isRecord(providers)) return [];
	return Object.entries(providers).flatMap(([provider, entry]) => {
		if (!isRecord(entry) || typeof entry.apiKey !== "string") return [];
		const key = entry.apiKey;
		const credential = {
			provider,
			key
		};
		if (!key.trim() || isNonSecretApiKeyMarker(key) || store.profiles[key] !== void 0 || findMatchingProfileId(store, credential, blockedStores) !== void 0) return [];
		return [credential];
	});
}
function uniqueCredentials(credentials) {
	return [...new Map(credentials.map((credential) => [`${normalizeProviderId(credential.provider)}\0${credential.key}`, credential])).values()];
}
function findMatchingProfileId(store, credential, blockedStores) {
	return Object.entries(store.profiles).find(([profileId, stored]) => credentialMatches(stored, credential) && blockedStores.every((blocked) => blocked.profiles[profileId] === void 0 || credentialMatches(blocked.profiles[profileId], credential)))?.[0];
}
function allocateProfileId(store, credential, blockedStores) {
	const provider = normalizeProviderId(credential.provider);
	for (let suffix = 1;; suffix += 1) {
		const profileId = suffix === 1 ? `${provider}:default` : `${provider}:models-json${suffix === 2 ? "" : `-${suffix}`}`;
		if ((!store.profiles[profileId] || credentialMatches(store.profiles[profileId], credential)) && blockedStores.every((blocked) => !blocked.profiles[profileId] || credentialMatches(blocked.profiles[profileId], credential))) return profileId;
	}
}
async function persistCredentials(params) {
	const credentials = uniqueCredentials(params.credentials);
	if (credentials.length === 0) return 0;
	const blockedStores = params.blockedStores ?? [];
	const profileIds = /* @__PURE__ */ new Map();
	let added = 0;
	if (!await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		stateDir: params.stateDir,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater: (localStore) => {
			const effectiveStore = params.inheritedStore ? mergeAuthProfileStores(params.inheritedStore, localStore) : localStore;
			for (const credential of credentials) {
				const profileId = findMatchingProfileId(effectiveStore, credential, blockedStores) ?? allocateProfileId(effectiveStore, credential, blockedStores);
				profileIds.set(profileId, credential);
				if (credentialMatches(effectiveStore.profiles[profileId], credential)) continue;
				localStore.profiles[profileId] = {
					type: "api_key",
					provider: normalizeProviderId(credential.provider),
					key: credential.key
				};
				effectiveStore.profiles[profileId] = localStore.profiles[profileId];
				added += 1;
			}
			return added > 0;
		}
	})) throw new Error("auth profile store could not be updated");
	const persisted = params.agentDir ? loadPersistedAuthProfileStore(params.agentDir) : loadPersistedSharedAuthProfileStore({
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	});
	const effectivePersisted = params.inheritedStore ? mergeAuthProfileStores(params.inheritedStore, persisted ?? emptyStore()) : persisted;
	for (const [profileId, credential] of profileIds) if (!credentialMatches(effectivePersisted?.profiles[profileId], credential)) throw new Error(`credential verification failed for provider "${credential.provider}"`);
	return added;
}
function collectAgentCatalogs(agentDir, warnings) {
	const localStore = loadPersistedAuthProfileStore(agentDir) ?? emptyStore();
	const providers = [];
	const rootPath = path.join(agentDir, "models.json");
	try {
		const root = parseModelCatalogJson(fs.readFileSync(rootPath, "utf8"));
		if (isRecord(root) && isRecord(root.providers)) providers.push(root.providers);
	} catch (error) {
		if (error.code !== "ENOENT") warnings.push(`Could not read model catalog ${shortenHomePath(rootPath)}: ${error instanceof Error ? error.message : String(error)}`);
	}
	try {
		for (const catalog of loadPersistedPluginModelCatalogsReadOnly(agentDir)) try {
			const parsed = JSON.parse(catalog.contents);
			if (isGeneratedPluginModelCatalog(parsed) && isRecord(parsed) && isRecord(parsed.providers)) providers.push(parsed.providers);
		} catch {
			warnings.push(`Could not parse generated model catalog for plugin ${catalog.pluginId}.`);
		}
	} catch (error) {
		warnings.push(`Could not read generated model catalogs for ${shortenHomePath(agentDir)}: ${error instanceof Error ? error.message : String(error)}`);
	}
	return {
		agentDir,
		localStore,
		providers
	};
}
/** Copies and verifies catalog credentials before the runtime retires plaintext catalog auth. */
async function maybeMigrateModelCatalogCredentials(params) {
	const warnings = [];
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env);
	const mainAgentDir = resolveSharedMainAuthAgentDir(env);
	const discoveredAgentDirs = listAgentModelsJsonPaths(params.cfg, stateDir, env).map((modelsPath) => path.dirname(modelsPath));
	const agentDirs = [.../* @__PURE__ */ new Set([
		mainAgentDir,
		resolveDefaultAgentDir(params.cfg, env),
		...discoveredAgentDirs
	])];
	const mainStore = loadPersistedSharedAuthProfileStore(env) ?? emptyStore();
	const catalogs = agentDirs.map((agentDir) => collectAgentCatalogs(agentDir, warnings));
	const effectiveStores = catalogs.map(({ localStore }) => mergeAuthProfileStores(mainStore, localStore));
	const childStores = catalogs.filter((catalog) => catalog.agentDir !== mainAgentDir).map((catalog) => catalog.localStore);
	const configCredentials = collectCredentials(params.cfg.models?.providers, mainStore, childStores);
	const catalogCredentials = catalogs.map((catalog, index) => uniqueCredentials(catalog.providers.flatMap((providers) => collectCredentials(providers, effectiveStores[index] ?? mainStore))));
	const detected = configCredentials.length + catalogCredentials.reduce((sum, entries) => sum + entries.length, 0);
	for (const warning of warnings) params.runtime.error(warning);
	if (detected === 0) return {
		detected,
		migrated: 0,
		warnings
	};
	note(`Found ${detected} plaintext model credential${detected === 1 ? "" : "s"}. Run openclaw doctor --fix to copy and verify them in agent SQLite before plaintext catalog authentication is retired.`, "Model catalog credentials");
	if (!(params.prompter.shouldRepair || await params.prompter.confirmAutoFix({
		message: "Copy model credentials into agent SQLite now?",
		initialValue: true
	}))) return {
		detected,
		migrated: 0,
		warnings
	};
	let migrated = 0;
	try {
		migrated += await persistCredentials({
			blockedStores: childStores,
			credentials: configCredentials,
			stateDir
		});
	} catch (error) {
		const warning = `Could not migrate configured model credentials: ${error instanceof Error ? error.message : String(error)}`;
		warnings.push(warning);
		params.runtime.error(warning);
	}
	const migratedMainStore = loadPersistedSharedAuthProfileStore(env) ?? mainStore;
	for (const [index, catalog] of catalogs.entries()) try {
		migrated += await persistCredentials({
			...catalog.agentDir === mainAgentDir ? {} : { agentDir: catalog.agentDir },
			credentials: catalogCredentials[index] ?? [],
			...catalog.agentDir === mainAgentDir ? {} : { inheritedStore: migratedMainStore },
			stateDir
		});
	} catch (error) {
		const warning = `Could not migrate model credentials for ${shortenHomePath(catalog.agentDir)}: ${error instanceof Error ? error.message : String(error)}`;
		warnings.push(warning);
		params.runtime.error(warning);
	}
	if (migrated > 0) note(`Copied and verified ${migrated} model credential${migrated === 1 ? "" : "s"} in agent SQLite. Existing catalog values remain active until the runtime migration lands.`, "Doctor changes");
	return {
		detected,
		migrated,
		warnings
	};
}
//#endregion
export { maybeMigrateModelCatalogCredentials };
