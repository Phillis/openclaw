import { n as resolveRealpathOrAbsolute } from "./boundary-path-DDLrDh1C.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/api-facades.ts
/** Attaches nested facade namespaces to the flat plugin API implementation. */
function attachPluginApiFacades(api) {
	api.session = {
		state: { registerSessionExtension: (...args) => api.registerSessionExtension(...args) },
		workflow: {
			enqueueNextTurnInjection: (...args) => api.enqueueNextTurnInjection(...args),
			registerSessionSchedulerJob: (...args) => api.registerSessionSchedulerJob(...args),
			sendSessionAttachment: (...args) => api.sendSessionAttachment(...args),
			scheduleSessionTurn: (...args) => api.scheduleSessionTurn(...args),
			unscheduleSessionTurnsByTag: (...args) => api.unscheduleSessionTurnsByTag(...args)
		},
		controls: {
			registerSessionAction: (...args) => api.registerSessionAction(...args),
			registerControlUiDescriptor: (...args) => api.registerControlUiDescriptor(...args)
		}
	};
	api.agent = { events: {
		registerAgentEventSubscription: (...args) => api.registerAgentEventSubscription(...args),
		emitAgentEvent: (...args) => api.emitAgentEvent(...args)
	} };
	api.runContext = {
		setRunContext: (...args) => api.setRunContext(...args),
		getRunContext: (...args) => api.getRunContext(...args),
		clearRunContext: (...args) => api.clearRunContext(...args)
	};
	api.lifecycle = { registerRuntimeLifecycle: (...args) => api.registerRuntimeLifecycle(...args) };
	return api;
}
//#endregion
//#region src/plugins/api-builder.ts
const noopRegisterTool = () => {};
const noopRegisterHook = () => {};
const noopRegisterHttpRoute = () => {};
const noopRegisterHostedMediaResolver = () => {};
const noopRegisterWidgetPresenter = () => {};
const noopRegisterMcpServerConnectionResolver = () => {};
const noopRegisterChannel = () => {};
const noopRegisterGatewayMethod = () => {};
const noopRegisterSessionCatalog = () => {};
const noopRegisterCli = () => {};
const noopRegisterReload = () => {};
const noopRegisterNodeHostCommand = () => {};
const noopRegisterNodeInvokePolicy = () => {};
const noopRegisterSecurityAuditCollector = () => {};
const noopRegisterService = () => {};
const noopRegisterGatewayDiscoveryService = () => {};
const noopRegisterCliBackend = () => {};
const noopRegisterTextTransforms = () => {};
const noopRegisterConfigMigration = () => {};
const noopRegisterMigrationProvider = () => {};
const noopRegisterAutoEnableProbe = () => {};
const noopRegisterProvider = () => {};
const noopRegisterWorkerProvider = () => {};
const noopRegisterModelCatalogProvider = () => {};
const noopRegisterEmbeddingProvider = () => {};
const noopRegisterSpeechProvider = () => {};
const noopRegisterRealtimeTranscriptionProvider = () => {};
const noopRegisterRealtimeVoiceProvider = () => {};
const noopRegisterMediaUnderstandingProvider = () => {};
const noopRegisterTranscriptsSourceProvider = () => {};
const noopRegisterImageGenerationProvider = () => {};
const noopRegisterVideoGenerationProvider = () => {};
const noopRegisterMusicGenerationProvider = () => {};
const noopRegisterWebFetchProvider = () => {};
const noopRegisterWebSearchProvider = () => {};
const noopRegisterInteractiveHandler = () => {};
const noopOnConversationBindingResolved = () => {};
const noopRegisterCommand = () => {};
const noopRegisterContextEngine = () => {};
const noopRegisterCompactionProvider = () => {};
const noopRegisterAgentHarness = () => {};
const noopRegisterCodexAppServerExtensionFactory = () => {};
const noopRegisterAgentToolResultMiddleware = () => {};
const noopRegisterSessionExtension = () => {};
const noopEnqueueNextTurnInjection = async (injection) => ({
	enqueued: false,
	id: "",
	sessionKey: injection.sessionKey
});
const noopRegisterTrustedToolPolicy = () => {};
const noopRegisterToolMetadata = () => {};
const noopRegisterControlUiDescriptor = () => {};
const noopRegisterBoardWidgetContentKind = () => {};
const noopRegisterRuntimeLifecycle = () => {};
const noopRegisterAgentEventSubscription = () => {};
const noopEmitAgentEvent = () => ({
	emitted: false,
	reason: "not wired"
});
const noopSetRunContext = () => false;
const noopGetRunContext = () => void 0;
const noopClearRunContext = () => {};
const noopRegisterSessionSchedulerJob = () => void 0;
const noopRegisterSessionAction = () => {};
const noopSendSessionAttachment = async () => ({
	ok: false,
	error: "not wired"
});
const noopScheduleSessionTurn = async () => void 0;
const noopUnscheduleSessionTurnsByTag = async () => ({
	removed: 0,
	failed: 0
});
const noopRegisterDetachedTaskRuntime = () => {};
const noopRegisterMemoryCapability = () => {};
const noopRegisterMemoryPromptSupplement = () => {};
const noopRegisterMemoryPromptPreparation = () => {};
const noopRegisterMemoryCorpusSupplement = () => {};
const noopOn = () => {};
function createUnavailableRuntime(registrationMode, pluginId) {
	const owner = pluginId ? `Plugin "${pluginId}"` : "Plugin";
	const guidance = registrationMode === "cli-metadata" ? "Declare root commands in the manifest's cliCommands or defer runtime access out of register()." : "Defer runtime access out of register().";
	return new Proxy(Object.create(null), { get(_target, property) {
		if (typeof property === "symbol") return;
		throw new Error(`${owner} runtime is intentionally unavailable during "${registrationMode}" registration. ${guidance}`);
	} });
}
function buildPluginApi(params) {
	const handlers = params.handlers ?? {};
	const registerCli = handlers.registerCli ?? noopRegisterCli;
	return attachPluginApiFacades({
		id: params.id,
		name: params.name,
		version: params.version,
		description: params.description,
		source: params.source,
		rootDir: params.rootDir,
		registrationMode: params.registrationMode,
		config: params.config,
		pluginConfig: params.pluginConfig,
		runtime: params.runtime,
		logger: params.logger,
		registerTool: handlers.registerTool ?? noopRegisterTool,
		registerHook: handlers.registerHook ?? noopRegisterHook,
		registerHttpRoute: handlers.registerHttpRoute ?? noopRegisterHttpRoute,
		registerHostedMediaResolver: handlers.registerHostedMediaResolver ?? noopRegisterHostedMediaResolver,
		registerWidgetPresenter: handlers.registerWidgetPresenter ?? noopRegisterWidgetPresenter,
		registerMcpServerConnectionResolver: handlers.registerMcpServerConnectionResolver ?? noopRegisterMcpServerConnectionResolver,
		registerChannel: handlers.registerChannel ?? noopRegisterChannel,
		registerGatewayMethod: handlers.registerGatewayMethod ?? noopRegisterGatewayMethod,
		registerSessionCatalog: handlers.registerSessionCatalog ?? noopRegisterSessionCatalog,
		registerCli,
		registerNodeCliFeature: (registrar, opts) => registerCli(registrar, {
			...opts,
			parentPath: ["nodes"]
		}),
		registerReload: handlers.registerReload ?? noopRegisterReload,
		registerNodeHostCommand: handlers.registerNodeHostCommand ?? noopRegisterNodeHostCommand,
		registerNodeInvokePolicy: handlers.registerNodeInvokePolicy ?? noopRegisterNodeInvokePolicy,
		registerSecurityAuditCollector: handlers.registerSecurityAuditCollector ?? noopRegisterSecurityAuditCollector,
		registerService: handlers.registerService ?? noopRegisterService,
		registerGatewayDiscoveryService: handlers.registerGatewayDiscoveryService ?? noopRegisterGatewayDiscoveryService,
		registerCliBackend: handlers.registerCliBackend ?? noopRegisterCliBackend,
		registerTextTransforms: handlers.registerTextTransforms ?? noopRegisterTextTransforms,
		registerConfigMigration: handlers.registerConfigMigration ?? noopRegisterConfigMigration,
		registerMigrationProvider: handlers.registerMigrationProvider ?? noopRegisterMigrationProvider,
		registerAutoEnableProbe: handlers.registerAutoEnableProbe ?? noopRegisterAutoEnableProbe,
		registerProvider: handlers.registerProvider ?? noopRegisterProvider,
		registerWorkerProvider: handlers.registerWorkerProvider ?? noopRegisterWorkerProvider,
		registerModelCatalogProvider: handlers.registerModelCatalogProvider ?? noopRegisterModelCatalogProvider,
		registerEmbeddingProvider: handlers.registerEmbeddingProvider ?? noopRegisterEmbeddingProvider,
		registerSpeechProvider: handlers.registerSpeechProvider ?? noopRegisterSpeechProvider,
		registerRealtimeTranscriptionProvider: handlers.registerRealtimeTranscriptionProvider ?? noopRegisterRealtimeTranscriptionProvider,
		registerRealtimeVoiceProvider: handlers.registerRealtimeVoiceProvider ?? noopRegisterRealtimeVoiceProvider,
		registerMediaUnderstandingProvider: handlers.registerMediaUnderstandingProvider ?? noopRegisterMediaUnderstandingProvider,
		registerTranscriptSourceProvider: handlers.registerTranscriptSourceProvider ?? noopRegisterTranscriptsSourceProvider,
		registerImageGenerationProvider: handlers.registerImageGenerationProvider ?? noopRegisterImageGenerationProvider,
		registerVideoGenerationProvider: handlers.registerVideoGenerationProvider ?? noopRegisterVideoGenerationProvider,
		registerMusicGenerationProvider: handlers.registerMusicGenerationProvider ?? noopRegisterMusicGenerationProvider,
		registerWebFetchProvider: handlers.registerWebFetchProvider ?? noopRegisterWebFetchProvider,
		registerWebSearchProvider: handlers.registerWebSearchProvider ?? noopRegisterWebSearchProvider,
		registerInteractiveHandler: handlers.registerInteractiveHandler ?? noopRegisterInteractiveHandler,
		onConversationBindingResolved: handlers.onConversationBindingResolved ?? noopOnConversationBindingResolved,
		registerCommand: handlers.registerCommand ?? noopRegisterCommand,
		registerContextEngine: handlers.registerContextEngine ?? noopRegisterContextEngine,
		registerCompactionProvider: handlers.registerCompactionProvider ?? noopRegisterCompactionProvider,
		registerAgentHarness: handlers.registerAgentHarness ?? noopRegisterAgentHarness,
		registerCodexAppServerExtensionFactory: handlers.registerCodexAppServerExtensionFactory ?? noopRegisterCodexAppServerExtensionFactory,
		registerAgentToolResultMiddleware: handlers.registerAgentToolResultMiddleware ?? noopRegisterAgentToolResultMiddleware,
		registerSessionExtension: handlers.registerSessionExtension ?? noopRegisterSessionExtension,
		enqueueNextTurnInjection: handlers.enqueueNextTurnInjection ?? noopEnqueueNextTurnInjection,
		registerTrustedToolPolicy: handlers.registerTrustedToolPolicy ?? noopRegisterTrustedToolPolicy,
		registerToolMetadata: handlers.registerToolMetadata ?? noopRegisterToolMetadata,
		registerControlUiDescriptor: handlers.registerControlUiDescriptor ?? noopRegisterControlUiDescriptor,
		registerBoardWidgetContentKind: handlers.registerBoardWidgetContentKind ?? noopRegisterBoardWidgetContentKind,
		registerRuntimeLifecycle: handlers.registerRuntimeLifecycle ?? noopRegisterRuntimeLifecycle,
		registerAgentEventSubscription: handlers.registerAgentEventSubscription ?? noopRegisterAgentEventSubscription,
		emitAgentEvent: handlers.emitAgentEvent ?? noopEmitAgentEvent,
		setRunContext: handlers.setRunContext ?? noopSetRunContext,
		getRunContext: handlers.getRunContext ?? noopGetRunContext,
		clearRunContext: handlers.clearRunContext ?? noopClearRunContext,
		registerSessionSchedulerJob: handlers.registerSessionSchedulerJob ?? noopRegisterSessionSchedulerJob,
		registerSessionAction: handlers.registerSessionAction ?? noopRegisterSessionAction,
		sendSessionAttachment: handlers.sendSessionAttachment ?? noopSendSessionAttachment,
		scheduleSessionTurn: handlers.scheduleSessionTurn ?? noopScheduleSessionTurn,
		unscheduleSessionTurnsByTag: handlers.unscheduleSessionTurnsByTag ?? noopUnscheduleSessionTurnsByTag,
		registerDetachedTaskRuntime: handlers.registerDetachedTaskRuntime ?? noopRegisterDetachedTaskRuntime,
		registerMemoryCapability: handlers.registerMemoryCapability ?? noopRegisterMemoryCapability,
		registerMemoryPromptSupplement: handlers.registerMemoryPromptSupplement ?? noopRegisterMemoryPromptSupplement,
		registerMemoryPromptPreparation: handlers.registerMemoryPromptPreparation ?? noopRegisterMemoryPromptPreparation,
		registerMemoryCorpusSupplement: handlers.registerMemoryCorpusSupplement ?? noopRegisterMemoryCorpusSupplement,
		resolvePath: params.resolvePath,
		on: handlers.on ?? noopOn
	});
}
//#endregion
//#region src/plugins/plugin-runtime-artifact-selection.ts
/** Selects built plugin artifacts without importing active runtime state. */
function rewriteBundledRuntimeArtifactRelativePath(relativePath) {
	return relativePath.replace(/\.[^.]+$/u, ".js");
}
function listPackageLocalRuntimeArtifactOutputExtensions(sourceExt) {
	switch (sourceExt) {
		case ".mts":
		case ".mjs": return [
			".mjs",
			".js",
			".cjs"
		];
		case ".cts":
		case ".cjs": return [
			".cjs",
			".js",
			".mjs"
		];
		default: return [
			".js",
			".mjs",
			".cjs"
		];
	}
}
function listPackageLocalRuntimeArtifactRelativePathBases(relativePath) {
	const ext = path.extname(relativePath).toLowerCase();
	const withoutExt = ext ? relativePath.slice(0, -ext.length) : relativePath;
	if (!withoutExt.startsWith(`src${path.sep}`) && !withoutExt.startsWith("src/")) return [withoutExt];
	return [withoutExt.slice(4), withoutExt];
}
function listPackageLocalDistRuntimeArtifactRelativePaths(relativePath) {
	const ext = path.extname(relativePath).toLowerCase();
	const candidates = /* @__PURE__ */ new Set();
	for (const base of listPackageLocalRuntimeArtifactRelativePathBases(relativePath)) for (const outputExt of listPackageLocalRuntimeArtifactOutputExtensions(ext)) candidates.add(`${base}${outputExt}`);
	return [...candidates];
}
function shouldPreferPackageLocalDistRuntimeArtifact(source) {
	switch (path.extname(source).toLowerCase()) {
		case ".ts":
		case ".tsx":
		case ".mts":
		case ".cts": return true;
		default: return false;
	}
}
function resolvePackageLocalDistRuntimeArtifact(params) {
	const relativeSource = path.relative(params.rootDir, params.source);
	if (!shouldPreferPackageLocalDistRuntimeArtifact(relativeSource) || relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return null;
	const artifactRoot = path.join(params.rootDir, "dist");
	for (const artifactRelativePath of listPackageLocalDistRuntimeArtifactRelativePaths(relativeSource)) {
		const artifactSource = path.join(artifactRoot, artifactRelativePath);
		if (fs.existsSync(artifactSource)) return resolveRealpathOrAbsolute(artifactSource);
	}
	return null;
}
function resolvePreferredBundledRootArtifactFromCanonicalPaths(params) {
	const { rootDir, source } = params;
	const sourceExternal = params.packageManifest?.build?.bundledDist === false;
	const extensionsDir = path.dirname(rootDir);
	if (path.basename(extensionsDir) !== "extensions") return {
		source,
		rootDir
	};
	const packageRoot = path.dirname(extensionsDir);
	if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") return {
		source,
		rootDir
	};
	const relativeSource = path.relative(rootDir, source);
	if (relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return {
		source,
		rootDir
	};
	const artifactRelativePath = rewriteBundledRuntimeArtifactRelativePath(relativeSource);
	for (const artifactRootName of sourceExternal ? ["dist"] : ["dist-runtime", "dist"]) {
		const artifactRoot = path.join(packageRoot, artifactRootName, "extensions", path.basename(rootDir));
		const artifactSource = path.join(artifactRoot, artifactRelativePath);
		if (fs.existsSync(artifactSource)) return {
			source: resolveRealpathOrAbsolute(artifactSource),
			rootDir: resolveRealpathOrAbsolute(artifactRoot)
		};
	}
	return {
		source,
		rootDir
	};
}
/** Selects the lifecycle-owned root build for one bundled source artifact. */
function resolvePreferredBundledRootArtifact(params) {
	return resolvePreferredBundledRootArtifactFromCanonicalPaths({
		source: resolveRealpathOrAbsolute(params.source),
		rootDir: resolveRealpathOrAbsolute(params.rootDir),
		packageManifest: params.packageManifest
	});
}
/** Applies source, package-local, and root-build preference without runtime memo state. */
function resolvePreferredBuiltRuntimeArtifact(params) {
	const { rootDir, source } = params;
	if (!params.preferBuiltPluginArtifacts) return {
		source,
		rootDir
	};
	if (params.origin !== "bundled") {
		const artifactSource = resolvePackageLocalDistRuntimeArtifact({
			source,
			rootDir
		});
		return artifactSource ? {
			source: artifactSource,
			rootDir
		} : {
			source,
			rootDir
		};
	}
	const packageLocalArtifactSource = params.packageManifest?.build?.bundledDist === false ? null : resolvePackageLocalDistRuntimeArtifact({
		source,
		rootDir
	});
	if (packageLocalArtifactSource) return {
		source: packageLocalArtifactSource,
		rootDir
	};
	return resolvePreferredBundledRootArtifactFromCanonicalPaths({
		source,
		rootDir,
		packageManifest: params.packageManifest
	});
}
//#endregion
export { attachPluginApiFacades as a, createUnavailableRuntime as i, resolvePreferredBundledRootArtifact as n, buildPluginApi as r, resolvePreferredBuiltRuntimeArtifact as t };
