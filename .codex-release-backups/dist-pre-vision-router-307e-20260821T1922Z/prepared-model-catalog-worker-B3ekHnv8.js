import { n as resolveInstalledManifestRegistryIndexFingerprint } from "./manifest-registry-installed-L8oQDrQ2.js";
import { L as cloneAuthProfileStore } from "./persisted-tYYP9V51.js";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DUOk3SoP.js";
import { r as markPreparedModelCatalogFull, t as fingerprintPreparedRuntimeFacts } from "./prepared-model-runtime.facts-BrYzuXKg.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/agents/prepared-model-catalog-worker.ts
/** Runs complete model-catalog discovery outside the Gateway event loop. */
const authByFullCatalog = /* @__PURE__ */ new WeakMap();
function setPreparedModelFullCatalogAuth(modelCatalog, auth) {
	authByFullCatalog.set(modelCatalog, auth);
}
function getPreparedModelFullCatalogAuth(modelCatalog) {
	return authByFullCatalog.get(modelCatalog);
}
const PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS = 18e4;
const PREPARED_MODEL_CATALOG_WORKER_GENERATION_POLL_MS = 25;
function fingerprintPreparedModelCatalogPlugins(snapshot) {
	return fingerprintPreparedRuntimeFacts({
		config: snapshot.configFingerprint ?? null,
		index: resolveInstalledManifestRegistryIndexFingerprint(snapshot.index),
		pluginIds: snapshot.pluginIds ?? null,
		policy: snapshot.policyHash,
		workspaceDir: snapshot.workspaceDir ?? null
	});
}
function fingerprintPreparedModelCatalogGeneration(params) {
	return fingerprintPreparedRuntimeFacts({
		input: params.input,
		authStore: params.authStore,
		providerIds: params.providerIds,
		pluginFingerprint: fingerprintPreparedModelCatalogPlugins(params.pluginMetadataSnapshot)
	});
}
function createPreparedModelCatalogWorkerInput(params) {
	const source = params.agentFacts.input;
	const input = {
		...source.agentId ? { agentId: source.agentId } : {},
		agentDir: source.agentDir,
		inheritedAuthDir: source.inheritedAuthDir ?? source.agentDir,
		...source.workspaceDir ? { workspaceDir: source.workspaceDir } : {},
		...source.readOnly ? { readOnly: true } : {},
		skipCredentials: true,
		env: { ...params.agentFacts.env },
		...source.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		...source.runtimePluginSelections ? { runtimePluginSelections: source.runtimePluginSelections } : {},
		config: source.config
	};
	const authStore = cloneAuthProfileStore(params.agentFacts.authStore);
	const providerIds = [...params.agentFacts.providerIds];
	return {
		kind: "catalog",
		generationFingerprint: fingerprintPreparedModelCatalogGeneration({
			input,
			authStore,
			providerIds,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		}),
		input,
		authStore,
		providerIds
	};
}
function resolvePreparedModelCatalogWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "agents", "prepared-model-catalog.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./prepared-model-catalog.worker${extension}`, currentModuleUrl);
}
function createPreparedModelCatalogWorker(params) {
	const superseded = () => new PreparedModelRuntimePublicationSupersededError(`prepared model runtime catalog generation was superseded for ${params.input.input.agentDir}`);
	let worker;
	let generationPoll;
	let terminalError;
	let nextRequestId = 1;
	const pending = /* @__PURE__ */ new Map();
	const rejectPending = (error) => {
		for (const request of pending.values()) {
			clearTimeout(request.timeout);
			request.reject(error);
		}
		pending.clear();
	};
	const stop = (error) => {
		terminalError ??= error;
		if (generationPoll) {
			clearInterval(generationPoll);
			generationPoll = void 0;
		}
		const active = worker;
		worker = void 0;
		active?.removeAllListeners();
		rejectPending(error);
		if (active) active.terminate();
	};
	const ensureWorker = () => {
		if (terminalError) throw terminalError;
		if (!params.isCurrent()) {
			const error = superseded();
			stop(error);
			throw error;
		}
		if (worker) return worker;
		const workerUrl = resolvePreparedModelCatalogWorkerUrl();
		const active = new Worker(workerUrl, {
			workerData: params.input,
			...workerUrl.pathname.endsWith(".ts") ? { execArgv: ["--import", "tsx"] } : {},
			env: {
				...process.env,
				...params.input.input.env
			}
		});
		active.unref();
		active.on("message", (message) => {
			const request = pending.get(message.requestId);
			if (!request) return;
			pending.delete(message.requestId);
			clearTimeout(request.timeout);
			if (!params.isCurrent()) {
				const error = superseded();
				request.reject(error);
				stop(error);
			} else if (message.status === "failed") request.reject(new Error(message.error));
			else if (message.generationFingerprint !== params.input.generationFingerprint) {
				const error = /* @__PURE__ */ new Error("prepared model catalog worker returned a stale generation");
				request.reject(error);
				stop(error);
			} else request.resolve(message);
		});
		active.once("error", (error) => stop(error instanceof Error ? error : new Error(String(error))));
		active.once("exit", (code) => {
			if (worker === active) stop(/* @__PURE__ */ new Error(`prepared model catalog worker exited with code ${code} before its generation retired`));
		});
		worker = active;
		generationPoll = setInterval(() => {
			if (!params.isCurrent()) stop(superseded());
		}, PREPARED_MODEL_CATALOG_WORKER_GENERATION_POLL_MS);
		generationPoll.unref();
		return active;
	};
	const request = (value) => {
		let active;
		try {
			active = ensureWorker();
		} catch (error) {
			return Promise.reject(error instanceof Error ? error : new Error(String(error)));
		}
		const requestId = nextRequestId++;
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				stop(/* @__PURE__ */ new Error("prepared model catalog worker timed out"));
			}, PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS);
			timeout.unref();
			pending.set(requestId, {
				timeout,
				resolve,
				reject
			});
			active.postMessage({
				...value,
				requestId
			}, []);
		}).then((message) => {
			if (!params.isCurrent()) throw superseded();
			return message;
		});
	};
	return {
		loadCatalog: async () => {
			const message = await request({ kind: "catalog" });
			if (message.kind !== "catalog") throw new Error("prepared model catalog worker returned an auth refresh result");
			const modelCatalog = markPreparedModelCatalogFull(message.snapshot);
			setPreparedModelFullCatalogAuth(modelCatalog, {
				authStore: message.authStore,
				authModes: message.authModes
			});
			return modelCatalog;
		},
		loadAuth: async ({ providerIds, profileIds }) => {
			const normalizedProviderIds = [...new Set(providerIds)].toSorted((left, right) => left.localeCompare(right));
			const normalizedProfileIds = profileIds ? [...new Set(profileIds)].toSorted((left, right) => left.localeCompare(right)) : void 0;
			const message = await request({
				kind: "auth-refresh",
				providerIds: normalizedProviderIds,
				...normalizedProfileIds ? { profileIds: normalizedProfileIds } : {}
			});
			if (message.kind !== "auth-refresh") throw new Error("prepared model auth refresh worker returned a catalog result");
			return {
				authStore: message.authStore,
				authModes: message.authModes
			};
		}
	};
}
//#endregion
export { getPreparedModelFullCatalogAuth as i, createPreparedModelCatalogWorkerInput as n, fingerprintPreparedModelCatalogGeneration as r, createPreparedModelCatalogWorker as t };
