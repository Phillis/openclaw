import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { a as isPathInside, p as safeRealpathSync } from "./path-D138yf8v.js";
import { n as resolvePathViaExistingAncestorSync } from "./root-path-existing-CLr-7fqF.js";
import { r as resolveRootPathSync } from "./root-path-CsUfUJ7P.js";
import { t as discoverConfiguredPluginLoadPaths } from "./discovery-KmR2BWJK.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { n as isRootFileMissingFailure } from "./boundary-file-read-h_n3tTfV.js";
import "./boundary-path-DDLrDh1C.js";
import { a as readRootJsonObjectSync } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { o as resolvePackageExtensionEntries } from "./manifest-DFeZvDdx.js";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.js";
import { n as loadPluginManifestRegistryCore, o as loadInstalledPluginIndexInstallRecords } from "./manifest-registry-DRErrq38.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-CeAk9iRD.js";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-BkM5PRVy.js";
import { n as resolveInstalledPluginPackageOwnership } from "./installed-plugin-package-ownership-JNsP8Eri.js";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-BlJhejU6.js";
import { t as PLUGIN_DECLARED_SURFACE_GROUPS } from "./plugin-declared-surface-groups-CaZZpMBC.js";
import { c as writePersistedInstalledPluginIndexInstallRecordsWithLease } from "./installed-plugin-index-records-CyommlnD.js";
import { n as resolvePromptInjectionAllowed, t as resolveConversationAccessAllowed } from "./hook-policy-decisions-DL3kOjGW.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-BZTAJyJS.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/plugins/capability-summary.ts
const REVIEWED_MANIFEST_CONTRACT_FAMILIES = [
	"embeddedExtensionFactories",
	"agentToolResultMiddleware",
	"trustedToolPolicies",
	"externalAuthProviders",
	"embeddingProviders",
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders",
	"mediaUnderstandingProviders",
	"transcriptSourceProviders",
	"documentExtractors",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webContentExtractors",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"usageProviders",
	"migrationProviders",
	"gatewayMethodDispatch",
	"tools"
];
function mergePluginDeclaredSurfaces(surfaces) {
	const merged = {
		channels: [],
		providers: [],
		tools: [],
		contracts: [],
		hooks: [],
		mcpServers: [],
		cliCommands: [],
		cliBackends: [],
		skills: [],
		dangerousConfigFlags: []
	};
	for (const surface of surfaces) for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) merged[group].push(...surface[group]);
	for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) merged[group] = [...new Set(merged[group])].toSorted();
	return merged;
}
/** Acceptance belongs to the package; missing siblings must never shrink its review. */
function resolvePluginPackageDeclaredSurface(ownership, manifests) {
	const surfaces = [];
	for (const pluginId of ownership.pluginIds) {
		const manifest = manifests.get(pluginId);
		if (!manifest) return;
		surfaces.push(buildPluginCapabilitySummary({
			manifest,
			origin: manifest.origin
		}).declared);
	}
	return mergePluginDeclaredSurfaces(surfaces);
}
function buildHookGrant(effective, configured) {
	return {
		effective,
		...typeof configured === "boolean" ? { configured } : {}
	};
}
function buildPluginCapabilitySummary(params) {
	const { manifest, entryConfig } = params;
	const hooks = entryConfig?.hooks;
	const llm = entryConfig?.llm;
	const subagent = entryConfig?.subagent;
	return {
		declared: {
			channels: (manifest.channels ?? (manifest.channel?.id ? [manifest.channel.id] : [])).toSorted(),
			providers: (manifest.providers ?? []).flatMap((provider) => typeof provider === "string" ? [provider] : provider.id ? [provider.id] : []).toSorted(),
			tools: [.../* @__PURE__ */ new Set([...manifest.contracts?.tools ?? [], ...Object.keys(manifest.toolMetadata ?? {})])].toSorted(),
			contracts: [...new Set(REVIEWED_MANIFEST_CONTRACT_FAMILIES.flatMap((family) => (manifest.contracts?.[family] ?? []).map((id) => `${family}: ${id}`)))].toSorted(),
			hooks: (manifest.hooks ?? []).toSorted(),
			mcpServers: Object.keys(manifest.mcpServers ?? {}).toSorted(),
			cliCommands: (manifest.cliCommands ?? []).map((command) => command.name).toSorted(),
			cliBackends: (manifest.cliBackends ?? []).toSorted(),
			skills: (manifest.skills ?? []).toSorted(),
			dangerousConfigFlags: (manifest.configContracts?.dangerousFlags ?? []).map((flag) => flag.path).toSorted()
		},
		grants: {
			hooks: {
				allowPromptInjection: buildHookGrant(resolvePromptInjectionAllowed(hooks), hooks?.allowPromptInjection),
				allowConversationAccess: buildHookGrant(resolveConversationAccessAllowed(params.origin, hooks), hooks?.allowConversationAccess)
			},
			...llm ? { llm: {
				...llm.allowModelOverride !== void 0 ? { allowModelOverride: llm.allowModelOverride } : {},
				...llm.allowedModels ? { allowedModels: llm.allowedModels.toSorted() } : {},
				...llm.allowedCompletionModels ? { allowedCompletionModels: llm.allowedCompletionModels.toSorted() } : {},
				...llm.allowAuthProfileOverride !== void 0 ? { allowAuthProfileOverride: llm.allowAuthProfileOverride } : {},
				...llm.allowAgentIdOverride !== void 0 ? { allowAgentIdOverride: llm.allowAgentIdOverride } : {}
			} } : {},
			...subagent ? { subagent: {
				...subagent.allowModelOverride !== void 0 ? { allowModelOverride: subagent.allowModelOverride } : {},
				...subagent.allowedModels ? { allowedModels: subagent.allowedModels.toSorted() } : {}
			} } : {}
		}
	};
}
//#endregion
//#region src/plugins/capability-consent.ts
function resolvePluginArtifactManifests(rootDir, env = process.env, context = {}) {
	const artifactRoot = fs.realpathSync(resolveUserPath(rootDir, env));
	const packageManifest = readRootJsonObjectSync({
		rootDir: artifactRoot,
		rootRealPath: artifactRoot,
		relativePath: "package.json",
		boundaryLabel: "plugin artifact directory",
		rejectHardlinks: true
	});
	if (!packageManifest.ok) {
		if (packageManifest.reason !== "open" || !isRootFileMissingFailure(packageManifest.failure)) throw new Error(`Unable to inspect the plugin artifact package manifest: ${artifactRoot}`);
	} else {
		const extensions = resolvePackageExtensionEntries(packageManifest.value);
		if (extensions.status === "invalid") throw new Error(extensions.error);
		if (extensions.status === "empty") throw new Error("package.json openclaw.extensions is empty");
	}
	const currentRoot = path.resolve(resolveUserPath(context.currentArtifactDir ?? rootDir, env));
	const currentCanonicalRoot = resolvePathViaExistingAncestorSync(currentRoot);
	const loadPaths = [];
	for (const configuredPath of context.config?.plugins?.load?.paths ?? []) {
		const source = path.resolve(resolveUserPath(configuredPath, env));
		const canonicalSource = resolvePathViaExistingAncestorSync(source);
		if (!isPathInside(currentRoot, source) && !isPathInside(currentCanonicalRoot, canonicalSource)) continue;
		const current = resolveRootPathSync({
			absolutePath: source,
			rootPath: currentRoot,
			rootCanonicalPath: currentCanonicalRoot,
			boundaryLabel: "installed plugin artifact directory"
		});
		const lexicalRoot = isPathInside(currentRoot, source) ? currentRoot : currentCanonicalRoot;
		const relativePath = isPathInside(lexicalRoot, source) ? path.relative(lexicalRoot, source) : path.relative(currentCanonicalRoot, current.kind === "directory" ? current.canonicalPath : path.join(resolvePathViaExistingAncestorSync(path.dirname(source)), path.basename(source)));
		const staged = resolveRootPathSync({
			absolutePath: path.join(artifactRoot, relativePath),
			rootPath: artifactRoot,
			rootCanonicalPath: artifactRoot,
			boundaryLabel: "staged plugin artifact directory"
		});
		loadPaths.push(staged.absolutePath);
	}
	loadPaths.push(artifactRoot);
	const packageDiscovery = discoverConfiguredPluginLoadPaths({
		loadPaths: [artifactRoot],
		env,
		deduplicate: true
	});
	const packageSources = new Set(packageDiscovery.candidates.map((candidate) => safeRealpathSync(candidate.source) ?? candidate.source));
	const discovery = loadPaths.length === 1 ? packageDiscovery : discoverConfiguredPluginLoadPaths({
		loadPaths,
		env,
		deduplicate: true
	});
	const registry = loadPluginManifestRegistryCore({
		config: { plugins: { load: { paths: loadPaths } } },
		env,
		installRecords: {},
		discovery: {
			candidates: discovery.candidates.filter((candidate) => packageSources.has(safeRealpathSync(candidate.source) ?? candidate.source)),
			diagnostics: packageDiscovery.diagnostics
		}
	});
	const error = registry.diagnostics.find((diagnostic) => diagnostic.level === "error");
	if (error || registry.plugins.length === 0) throw new Error(error?.message ?? `Plugin artifact has no valid plugin manifest: ${artifactRoot}`);
	return registry.plugins;
}
/** Read only validated manifest surfaces belonging to the actual artifact on disk. */
function resolvePluginArtifactDeclaredSurface(rootDir, env = process.env, context = {}) {
	return mergePluginDeclaredSurfaces(resolvePluginArtifactManifests(rootDir, env, context).map((manifest) => buildPluginCapabilitySummary({
		manifest,
		origin: "global"
	}).declared));
}
function computeDeclaredSurfaceHash(declared) {
	const canonical = Object.fromEntries(PLUGIN_DECLARED_SURFACE_GROUPS.map((group) => [group, declared[group].toSorted()]));
	return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}
function diffDeclaredSurfaceWidening(previous, next) {
	const widened = {};
	for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) {
		const previousValues = new Set(previous[group]);
		const added = next[group].filter((value) => !previousValues.has(value)).toSorted();
		if (added.length > 0) widened[group] = added;
	}
	return {
		widened,
		hasWidening: Object.keys(widened).length > 0
	};
}
function resolvePluginInstallRecordIntegrity(record) {
	const npmIntegrity = record.integrity ?? record.npmIntegrity;
	if (npmIntegrity) return {
		integrity: npmIntegrity,
		integrityKind: "ssri"
	};
	if (record.clawpackSha256) return {
		integrity: record.clawpackSha256,
		integrityKind: "sha256"
	};
	return record.gitCommit ? {
		integrity: record.gitCommit,
		integrityKind: "git-commit"
	} : void 0;
}
function resolveAcceptedSurfaceCurrent(record, declared) {
	return record.acceptedSurface !== void 0 && record.acceptedSurfaceHash !== void 0 && record.acceptedSurfaceHash === computeDeclaredSurfaceHash(record.acceptedSurface) && record.acceptedSurfaceHash === computeDeclaredSurfaceHash(declared) && record.acceptedSurfaceIntegrity === resolvePluginInstallRecordIntegrity(record)?.integrity;
}
/** Preserve caller control-flow failures across installers that normalize exceptions. */
function capturePluginCapabilityConsentHandlerErrors(handler) {
	let failure;
	return {
		onCapabilityConsent: handler ? async (review) => {
			try {
				return await handler(review);
			} catch (error) {
				failure = { error };
				throw error;
			}
		} : void 0,
		rethrowCallbackError: () => {
			if (failure) throw failure.error;
		}
	};
}
const pendingPluginCapabilityReviews = /* @__PURE__ */ new Map();
registerPluginMetadataProcessMemoLifecycleClear(() => {
	pendingPluginCapabilityReviews.clear();
});
function resolvePendingPluginCapabilityReview(pluginId) {
	return pendingPluginCapabilityReviews.get(pluginId);
}
function resolvePluginInstallRecordTrust(record) {
	if (!record?.clawhubTrustDisposition) return;
	return {
		disposition: record.clawhubTrustDisposition,
		...record.clawhubTrustReasons ? { reasons: [...record.clawhubTrustReasons] } : {},
		...record.clawhubTrustCheckedAt ? { checkedAt: record.clawhubTrustCheckedAt } : {},
		...record.clawhubTrustAcknowledgedAt ? { acknowledgedAt: record.clawhubTrustAcknowledgedAt } : {},
		...record.clawhubTrustPending !== void 0 ? { pending: record.clawhubTrustPending } : {},
		...record.clawhubTrustStale !== void 0 ? { stale: record.clawhubTrustStale } : {}
	};
}
function acceptManagedPluginDeclaredSurface(record, declared) {
	const integrity = resolvePluginInstallRecordIntegrity(record)?.integrity;
	const accepted = {
		...record,
		acceptedSurface: declared,
		acceptedSurfaceHash: computeDeclaredSurfaceHash(declared),
		acceptedSurfaceAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	delete accepted.acceptedSurfaceIntegrity;
	if (integrity) accepted.acceptedSurfaceIntegrity = integrity;
	return accepted;
}
function buildPluginCapabilityConsentReview(params) {
	const { pluginId, manifest, record } = params;
	const summary = buildPluginCapabilitySummary({
		manifest,
		origin: "global",
		entryConfig: params.config.plugins?.entries?.[pluginId]
	});
	const declared = params.declared ?? summary.declared;
	const spec = record.resolvedSpec ?? record.spec;
	const packageName = record.clawhubPackage ?? record.resolvedName;
	const previousDeclared = params.previousDeclared ?? record.acceptedSurface;
	const widened = params.widened ?? (previousDeclared ? diffDeclaredSurfaceWidening(previousDeclared, declared).widened : void 0);
	const trust = resolvePluginInstallRecordTrust(record);
	return {
		pluginId,
		name: manifest.name ?? pluginId,
		...manifest.version ?? record.version ? { version: manifest.version ?? record.version } : {},
		...summary,
		declared,
		reviewToken: computeDeclaredSurfaceHash(declared),
		source: {
			kind: record.source,
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...resolvePluginInstallRecordIntegrity(record)
		},
		...trust ? { trust } : {},
		...widened && Object.keys(widened).length > 0 ? { widened } : {},
		...record.acceptedSurfaceAt ? { acceptedAt: record.acceptedSurfaceAt } : {}
	};
}
function throwManagedPluginCapabilityConsentRequired(review) {
	pendingPluginCapabilityReviews.delete(review.pluginId);
	pendingPluginCapabilityReviews.set(review.pluginId, review);
	if (pendingPluginCapabilityReviews.size > 32) {
		const oldest = pendingPluginCapabilityReviews.keys().next().value;
		if (oldest !== void 0) pendingPluginCapabilityReviews.delete(oldest);
	}
	throw new ManagedPluginLifecycleError(`Plugin "${review.pluginId}" requires capability consent. Use openclaw plugins install or openclaw plugins enable with --accept-capabilities, then retry.`, { capabilityConsent: {
		pluginId: review.pluginId,
		reviewToken: review.reviewToken,
		...review.widened ? { widened: review.widened } : {},
		...review.acceptedAt ? { acceptedAt: review.acceptedAt } : {}
	} });
}
/** Enforce and durably acknowledge consent before an installed plugin is enabled. */
async function resolvePluginCapabilityConsent(params) {
	const env = params.env ?? process.env;
	return await withPluginLifecycleLease({ env }, async (lease) => {
		const workspace = resolvePluginControlPlaneWorkspace({
			config: params.config,
			env
		});
		const metadata = params.metadata ?? resolvePluginMetadataSnapshot({
			config: params.config,
			env,
			...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
		});
		const pluginId = metadata.normalizePluginId(params.pluginId);
		const plugin = metadata.index.plugins.find((candidate) => candidate.pluginId === pluginId);
		if (!plugin || plugin.origin === "bundled") return;
		if (!resolveInstalledPluginIndexInstallOwner(plugin) && !isInstalledPluginIndexInstallOwnerAmbiguous(plugin) && !Object.hasOwn(metadata.index.installRecords, pluginId)) return;
		const ownership = resolveInstalledPluginPackageOwnership(metadata.index, pluginId, env);
		if (!ownership.ok) throw new ManagedPluginLifecycleError(ownership.error);
		const { installOwner, installRecord } = ownership.value;
		const manifest = metadata.byPluginId.get(pluginId);
		if (!manifest) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" has no installed manifest.`);
		const declared = resolvePluginPackageDeclaredSurface(ownership.value, metadata.byPluginId);
		if (!declared) throw new ManagedPluginLifecycleError(`Plugin package "${installOwner}" has incomplete manifest metadata.`);
		const review = buildPluginCapabilityConsentReview({
			pluginId,
			manifest,
			record: installRecord,
			config: params.config,
			declared
		});
		if (resolveAcceptedSurfaceCurrent(installRecord, declared)) {
			pendingPluginCapabilityReviews.delete(pluginId);
			return;
		}
		const acknowledgment = params.acknowledge ?? await params.onCapabilityConsent?.(review);
		if (!acknowledgment) throwManagedPluginCapabilityConsentRequired(review);
		const records = await loadInstalledPluginIndexInstallRecords({ env });
		const persistedRecord = records[installOwner];
		if (!persistedRecord?.installPath) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" no longer has a verifiable installed package record.`);
		const currentDeclared = resolvePluginArtifactDeclaredSurface(persistedRecord.installPath, env, { config: params.config });
		const currentReview = buildPluginCapabilityConsentReview({
			pluginId,
			manifest,
			record: persistedRecord,
			config: params.config,
			declared: currentDeclared
		});
		if (acknowledgment.reviewToken !== currentReview.reviewToken) throwManagedPluginCapabilityConsentRequired(currentReview);
		await writePersistedInstalledPluginIndexInstallRecordsWithLease({
			...records,
			[installOwner]: acceptManagedPluginDeclaredSurface(persistedRecord, currentDeclared)
		}, {
			env,
			config: params.config,
			lease
		});
		pendingPluginCapabilityReviews.delete(pluginId);
	});
}
async function resolvePluginArtifactCapabilityConsent(params) {
	const artifactContext = {
		config: params.config,
		currentArtifactDir: params.currentArtifactDir
	};
	const declared = resolvePluginArtifactDeclaredSurface(params.artifactDir, params.env, artifactContext);
	const manifest = resolvePluginArtifactManifests(params.artifactDir, params.env, artifactContext)[0];
	const review = buildPluginCapabilityConsentReview({
		pluginId: params.pluginId,
		manifest: manifest ?? { name: params.pluginId },
		record: params.record,
		config: params.config,
		declared,
		...params.previousDeclared ? { previousDeclared: params.previousDeclared } : {}
	});
	if (params.mode === "update" && params.previousDeclared) {
		const { hasWidening } = diffDeclaredSurfaceWidening(params.previousDeclared, declared);
		const priorAcceptanceCurrent = params.previousRecord !== void 0 && resolveAcceptedSurfaceCurrent(params.previousRecord, params.previousDeclared) && resolvePluginInstallRecordIntegrity(params.previousRecord) !== void 0;
		if (!hasWidening && priorAcceptanceCurrent) return declared;
	}
	const acknowledgment = params.acknowledgeCapabilities ?? await params.onCapabilityConsent?.(review);
	const finalDeclared = resolvePluginArtifactDeclaredSurface(params.artifactDir, params.env, artifactContext);
	const finalToken = computeDeclaredSurfaceHash(finalDeclared);
	if (!acknowledgment || acknowledgment.reviewToken !== finalToken) return throwManagedPluginCapabilityConsentRequired(finalToken === review.reviewToken ? review : buildPluginCapabilityConsentReview({
		pluginId: params.pluginId,
		manifest: resolvePluginArtifactManifests(params.artifactDir, params.env, artifactContext)[0] ?? { name: params.pluginId },
		record: params.record,
		config: params.config,
		declared: finalDeclared,
		...params.previousDeclared ? { previousDeclared: params.previousDeclared } : {}
	}));
	pendingPluginCapabilityReviews.delete(params.pluginId);
	return finalDeclared;
}
/** Bind artifact consent to verified staged bytes and carry acceptance into the record commit. */
function createManagedPluginArtifactConsentHandler(params) {
	const previousDeclaredByOwner = /* @__PURE__ */ new Map();
	for (const [installOwner, record] of Object.entries(params.previousRecords ?? {})) if (record.installPath) try {
		previousDeclaredByOwner.set(installOwner, resolvePluginArtifactDeclaredSurface(record.installPath, params.env, { config: params.config }));
	} catch {}
	const pendingAcceptedSurfaces = /* @__PURE__ */ new Map();
	return {
		onBeforePluginArtifactCommit: async (artifact) => {
			const matchingOwners = Object.entries(params.previousRecords ?? {}).filter(([installOwner, record]) => installOwner === artifact.pluginId || installOwner === params.previousPluginOwners?.get(artifact.pluginId) || Boolean(artifact.currentArtifactDir && record.installPath && path.resolve(resolveUserPath(artifact.currentArtifactDir, params.env)) === path.resolve(resolveUserPath(record.installPath, params.env))));
			if (matchingOwners.length > 1) throw new ManagedPluginLifecycleError(`Plugin "${artifact.pluginId}" matches multiple installed package owners.`);
			const [installOwner, previousRecord] = matchingOwners[0] ?? [];
			const previousDeclared = installOwner ? previousDeclaredByOwner.get(installOwner) : void 0;
			const declared = await resolvePluginArtifactCapabilityConsent({
				config: params.config,
				env: params.env,
				pluginId: artifact.pluginId,
				artifactDir: artifact.stagedArtifactDir,
				currentArtifactDir: previousRecord?.installPath ?? artifact.currentArtifactDir,
				record: {
					source: params.source,
					installPath: artifact.stagedArtifactDir,
					...params.spec ? { spec: params.spec } : {},
					...params.expectedIntegrity ? { integrity: params.expectedIntegrity } : {}
				},
				acknowledgeCapabilities: params.acknowledgeCapabilities,
				onCapabilityConsent: params.onCapabilityConsent,
				...previousRecord ? { previousRecord } : {},
				...previousDeclared ? { previousDeclared } : {},
				mode: artifact.mode
			});
			pendingAcceptedSurfaces.set(artifact.pluginId, declared);
		},
		applyAcceptedSurface: (pluginId, record) => {
			const declared = pendingAcceptedSurfaces.get(pluginId);
			if (!declared) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" did not expose its verified artifact for capability review.`);
			return acceptManagedPluginDeclaredSurface(record, declared);
		}
	};
}
/** Prepare the same package-owned consent history for every managed installer. */
async function prepareManagedPluginArtifactConsentHandler(params) {
	const env = params.env ?? process.env;
	const previousRecords = params.previousRecords ?? await loadInstalledPluginIndexInstallRecords({ env });
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env
	});
	const metadata = Object.keys(previousRecords).length > 0 ? resolvePluginMetadataSnapshot({
		config: params.config,
		env,
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	}) : void 0;
	const previousPluginOwners = /* @__PURE__ */ new Map();
	for (const plugin of metadata?.index.plugins ?? []) {
		const owner = resolveInstalledPluginIndexInstallOwner(plugin);
		if (owner) previousPluginOwners.set(plugin.pluginId, owner);
	}
	return createManagedPluginArtifactConsentHandler({
		...params,
		env,
		previousRecords,
		previousPluginOwners
	});
}
function formatPluginCapabilityConsentRequired(pluginId) {
	return `Plugin "${pluginId}" requires capability consent; disable and re-enable it or run \`openclaw plugins enable ${pluginId} --accept-capabilities\`.`;
}
//#endregion
export { diffDeclaredSurfaceWidening as a, resolveAcceptedSurfaceCurrent as c, resolvePluginCapabilityConsent as d, resolvePluginInstallRecordIntegrity as f, resolvePluginPackageDeclaredSurface as g, mergePluginDeclaredSurfaces as h, createManagedPluginArtifactConsentHandler as i, resolvePendingPluginCapabilityReview as l, buildPluginCapabilitySummary as m, capturePluginCapabilityConsentHandlerErrors as n, formatPluginCapabilityConsentRequired as o, resolvePluginInstallRecordTrust as p, computeDeclaredSurfaceHash as r, prepareManagedPluginArtifactConsentHandler as s, buildPluginCapabilityConsentReview as t, resolvePluginArtifactDeclaredSurface as u };
