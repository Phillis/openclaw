import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { _ as sortUniqueStrings, u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { n as createConfigScopedPromiseLoader } from "./plugin-cache-primitives-Bm-Ppe_P.js";
import { s as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-CKAJM6x9.js";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Zllbp6of.js";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.js";
import { t as resolveEnabledBundledManifestContractPlugins } from "./bundled-manifest-contract-plugins-D6FGI4tT.js";
//#region src/plugins/document-extractor-public-artifacts.ts
const DOCUMENT_EXTRACTOR_ARTIFACT_CANDIDATES = ["document-extractor.js", "document-extractor-api.js"];
function isDocumentExtractorPlugin(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.label === "string" && Array.isArray(value.mimeTypes) && value.mimeTypes.every((mimeType) => typeof mimeType === "string" && mimeType.trim()) && (value.autoDetectOrder === void 0 || typeof value.autoDetectOrder === "number") && typeof value.extract === "function";
}
function collectExtractorFactories(mod) {
	const extractors = [];
	const errors = [];
	for (const [name, exported] of Object.entries(mod).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (typeof exported !== "function" || exported.length !== 0 || !name.startsWith("create") || !name.endsWith("DocumentExtractor")) continue;
		let candidate;
		try {
			candidate = exported();
		} catch (error) {
			errors.push(error);
			continue;
		}
		if (isDocumentExtractorPlugin(candidate)) extractors.push(candidate);
	}
	return {
		extractors,
		errors
	};
}
/** Loads document extractor entries from a bundled plugin public artifact module. */
function loadBundledDocumentExtractorEntriesFromDir(params) {
	const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: params.dirName,
		artifactCandidates: DOCUMENT_EXTRACTOR_ARTIFACT_CANDIDATES
	});
	if (!mod) return null;
	const { extractors, errors } = collectExtractorFactories(mod);
	if (extractors.length === 0) {
		if (errors.length > 0) throw new Error(`Unable to initialize document extractors for plugin ${params.pluginId}`, { cause: errors.length === 1 ? errors[0] : new AggregateError(errors) });
		return null;
	}
	return extractors.map((extractor) => Object.assign({}, extractor, { pluginId: params.pluginId }));
}
//#endregion
//#region src/plugins/document-extractors.runtime.ts
/** Resolves bundled document extractor providers from enabled manifest contracts. */
function resolveExplicitAllowedDocumentExtractorPluginIds(params) {
	const allow = params.config?.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0) return null;
	const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
	const deniedPluginIds = new Set(params.config?.plugins?.deny ?? []);
	const entries = params.config?.plugins?.entries ?? {};
	return sortUniqueStrings(normalizeStringEntries(allow).filter((pluginId) => !onlyPluginIdSet || onlyPluginIdSet.has(pluginId)).filter((pluginId) => !deniedPluginIds.has(pluginId)).filter((pluginId) => entries[pluginId]?.enabled !== false));
}
/** Returns enabled document extractors in deterministic auto-detect order. */
function resolvePluginDocumentExtractors(params) {
	const extractors = [];
	const loadErrors = [];
	const pluginIds = resolveExplicitAllowedDocumentExtractorPluginIds({
		config: params?.config,
		onlyPluginIds: params?.onlyPluginIds
	}) ?? resolveEnabledBundledManifestContractPlugins({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params?.env,
		onlyPluginIds: params?.onlyPluginIds,
		contract: "documentExtractors"
	}).map((plugin) => plugin.id);
	for (const pluginId of pluginIds) {
		let loaded;
		try {
			loaded = loadBundledDocumentExtractorEntriesFromDir({
				dirName: pluginId,
				pluginId
			});
		} catch (error) {
			loadErrors.push(error);
			continue;
		}
		if (loaded) extractors.push(...loaded);
	}
	if (extractors.length === 0 && loadErrors.length > 0) throw new Error("Unable to load document extractor plugins", { cause: loadErrors.length === 1 ? loadErrors[0] : new AggregateError(loadErrors) });
	return sortPluginEntriesForAutoDetect(extractors);
}
//#endregion
//#region src/media/document-extractors.runtime.ts
const documentExtractorLoader = createConfigScopedPromiseLoader((config) => resolvePluginDocumentExtractors(config ? { config } : void 0));
/** Runs the first matching plugin document extractor and tags successful results with its extractor id. */
async function extractDocumentContent(params) {
	const mimeType = normalizeLowercaseStringOrEmpty(params.mimeType);
	const extractors = await documentExtractorLoader.load(params.config);
	const request = {
		buffer: params.buffer,
		mimeType: params.mimeType,
		maxPages: params.maxPages,
		maxPixels: params.maxPixels,
		minTextChars: params.minTextChars,
		...params.password ? { password: params.password } : {},
		...params.pageNumbers ? { pageNumbers: params.pageNumbers } : {},
		...params.onImageExtractionError ? { onImageExtractionError: params.onImageExtractionError } : {}
	};
	const errors = [];
	for (const extractor of extractors) {
		if (!extractor.mimeTypes.map((entry) => normalizeLowercaseStringOrEmpty(entry)).includes(mimeType)) continue;
		try {
			const result = await extractor.extract(request);
			if (result) return {
				...result,
				extractor: extractor.id
			};
		} catch (error) {
			errors.push(error);
		}
	}
	if (errors.length > 0) throw new Error(`Document extraction failed for ${mimeType || "unknown MIME type"}`, { cause: errors.length === 1 ? errors[0] : new AggregateError(errors) });
	return null;
}
//#endregion
//#region src/media/pdf-extract.ts
/** Extracts PDF content through the configured document extractor and hides extractor metadata. */
async function extractPdfContent(params) {
	const extracted = await extractDocumentContent({
		buffer: params.buffer,
		mimeType: "application/pdf",
		maxPages: params.maxPages,
		maxPixels: params.maxPixels,
		minTextChars: params.minTextChars,
		...params.password ? { password: params.password } : {},
		...params.pageNumbers ? { pageNumbers: params.pageNumbers } : {},
		...params.config ? { config: params.config } : {},
		...params.onImageExtractionError ? { onImageExtractionError: params.onImageExtractionError } : {}
	});
	if (!extracted) throw new Error("PDF extraction disabled or unavailable: enable the document-extract plugin to process application/pdf files.");
	return {
		text: extracted.text,
		images: extracted.images
	};
}
//#endregion
export { extractPdfContent as t };
