import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { a as resolveAgentModelPrimaryValue, i as resolveAgentModelFallbackValues } from "./model-input-ILUprkGk.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import "./model-ref-shared-D4yx0hwT.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex, l as inferUniqueProviderFromConfiguredModels } from "./model-selection-shared-DbjoXfPH.js";
import "./defaults-CdX9UGcX.js";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-DhyLO0Qh.js";
//#region src/agents/configured-model-entries.ts
/** Projects effective configured model refs, aliases, and role tags for one agent. */
function resolveConfiguredModelEntries(params) {
	const defaultProvider = params.defaultProvider ?? "openai";
	const defaultModel = params.defaultModel ?? "gpt-5.6-sol";
	const resolvedDefault = resolveConfiguredModelRef({
		...params,
		defaultProvider,
		defaultModel
	});
	const aliasIndex = params.aliasIndex ?? buildModelAliasIndex({
		...params,
		defaultProvider
	});
	const entriesByKey = /* @__PURE__ */ new Map();
	const addEntry = (ref, tag) => {
		const canonicalRef = params.canonicalizeRef?.(ref) ?? ref;
		const key = modelKey(canonicalRef.provider, canonicalRef.model);
		const originalKey = modelKey(ref.provider, ref.model);
		const existing = entriesByKey.get(key);
		const aliases = [
			...existing?.aliases ?? [],
			...aliasIndex.byKey.get(key) ?? [],
			...originalKey === key ? [] : aliasIndex.byKey.get(originalKey) ?? []
		];
		const aliasDisabled = existing?.aliasDisabled === true || aliasIndex.disabledKeys?.has(key) === true || aliasIndex.disabledKeys?.has(originalKey) === true;
		if (existing) {
			existing.tags.add(tag);
			existing.aliases = [...new Set(aliases)];
			existing.aliasDisabled = aliasDisabled;
			return;
		}
		entriesByKey.set(key, {
			key,
			ref: canonicalRef,
			tags: /* @__PURE__ */ new Set([tag]),
			aliases: [...new Set(aliases)],
			aliasDisabled
		});
	};
	const addRaw = (raw, tag) => {
		const trimmed = raw.trim();
		const inferredProvider = trimmed.includes("/") ? void 0 : inferUniqueProviderFromConfiguredModels({
			cfg: params.cfg,
			agentId: params.agentId,
			model: trimmed,
			allowManifestNormalization: params.allowManifestNormalization,
			manifestPlugins: params.manifestPlugins
		});
		const resolved = resolveModelRefFromString({
			...params,
			raw,
			defaultProvider: inferredProvider ?? defaultProvider,
			aliasIndex
		});
		if (resolved) addEntry(resolved.ref, tag);
	};
	addEntry(resolvedDefault, "default");
	resolveConfiguredModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId
	}).forEach((raw, index) => addRaw(raw, `fallback#${index + 1}`));
	const imageModel = params.cfg.agents?.defaults?.imageModel;
	const imagePrimary = resolveAgentModelPrimaryValue(imageModel);
	if (imagePrimary) addRaw(imagePrimary, "image");
	resolveAgentModelFallbackValues(imageModel).forEach((raw, index) => addRaw(raw, `img-fallback#${index + 1}`));
	const agentModels = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.models : void 0;
	const configuredRefs = /* @__PURE__ */ new Set();
	for (const models of [params.cfg.agents?.defaults?.models, agentModels]) for (const raw of Object.keys(models ?? {})) if (!raw.trim().endsWith("/*")) configuredRefs.add(raw);
	for (const raw of configuredRefs) addRaw(raw, "configured");
	return {
		defaultRef: resolvedDefault,
		entries: [...entriesByKey.values()],
		byKey: entriesByKey
	};
}
//#endregion
export { resolveConfiguredModelEntries as t };
