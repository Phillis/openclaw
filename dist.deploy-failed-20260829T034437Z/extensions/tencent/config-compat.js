//#region extensions/tencent/config-compat.ts
const TENCENT_TOKENHUB_DEFAULT_MODEL_REF = "tencent-tokenhub/hy3";
const TENCENT_TOKENHUB_PREVIEW_MODEL_REF = "tencent-tokenhub/hy3-preview";
const TOKENHUB_DEFAULT_ALIAS = "Hy3 (TokenHub)";
const TOKENHUB_PREVIEW_ALIAS = "Hy3 preview (TokenHub)";
function isTokenHubModelMapConfigured(models) {
	return Object.hasOwn(models, TENCENT_TOKENHUB_DEFAULT_MODEL_REF) || Object.hasOwn(models, TENCENT_TOKENHUB_PREVIEW_MODEL_REF);
}
function withDefaultAlias(entry, alias) {
	return {
		...entry,
		alias: entry?.alias ?? alias
	};
}
function needsDefaultAlias(entry) {
	return entry?.alias === void 0;
}
function migrateDefaultModel(model) {
	if (model === TENCENT_TOKENHUB_PREVIEW_MODEL_REF) return {
		model: { primary: TENCENT_TOKENHUB_DEFAULT_MODEL_REF },
		changed: true
	};
	if (model && typeof model === "object" && "primary" in model && model.primary === TENCENT_TOKENHUB_PREVIEW_MODEL_REF) return {
		model: {
			...model,
			primary: TENCENT_TOKENHUB_DEFAULT_MODEL_REF
		},
		changed: true
	};
	return {
		model,
		changed: false
	};
}
function migrateTencentTokenHubModelDefaults(cfg) {
	const existingModels = cfg.agents?.defaults?.models;
	if (!existingModels || !isTokenHubModelMapConfigured(existingModels)) return {
		config: cfg,
		changes: []
	};
	const needsDefaultRepair = !Object.hasOwn(existingModels, TENCENT_TOKENHUB_DEFAULT_MODEL_REF) || needsDefaultAlias(existingModels[TENCENT_TOKENHUB_DEFAULT_MODEL_REF]);
	const needsPreviewRepair = !Object.hasOwn(existingModels, TENCENT_TOKENHUB_PREVIEW_MODEL_REF) || needsDefaultAlias(existingModels[TENCENT_TOKENHUB_PREVIEW_MODEL_REF]);
	const migratedModel = migrateDefaultModel(cfg.agents?.defaults?.model);
	if (!needsDefaultRepair && !needsPreviewRepair && !migratedModel.changed) return {
		config: cfg,
		changes: []
	};
	const nextModels = {
		...existingModels,
		[TENCENT_TOKENHUB_DEFAULT_MODEL_REF]: withDefaultAlias(existingModels[TENCENT_TOKENHUB_DEFAULT_MODEL_REF], TOKENHUB_DEFAULT_ALIAS),
		[TENCENT_TOKENHUB_PREVIEW_MODEL_REF]: withDefaultAlias(existingModels[TENCENT_TOKENHUB_PREVIEW_MODEL_REF], TOKENHUB_PREVIEW_ALIAS)
	};
	const nextConfig = {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models: nextModels,
				...migratedModel.model !== void 0 ? { model: migratedModel.model } : void 0
			}
		}
	};
	const changes = [`Updated Tencent TokenHub agent model defaults to include ${TENCENT_TOKENHUB_DEFAULT_MODEL_REF} and ${TENCENT_TOKENHUB_PREVIEW_MODEL_REF}.`];
	if (migratedModel.changed) changes.push(`Changed Tencent TokenHub primary default from ${TENCENT_TOKENHUB_PREVIEW_MODEL_REF} to ${TENCENT_TOKENHUB_DEFAULT_MODEL_REF}.`);
	return {
		config: nextConfig,
		changes
	};
}
//#endregion
export { migrateTencentTokenHubModelDefaults };
