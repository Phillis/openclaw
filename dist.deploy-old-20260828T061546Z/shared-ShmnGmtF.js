import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { o as truncateToVisibleWidth, s as visibleWidth } from "./ansi-DjDeieuH.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { n as normalizeAgentModelRefForConfig, s as toAgentModelListLike } from "./model-input-ILUprkGk.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, l as resolveAgentDir, p as resolveAmbientOwnerAgentId, v as resolveSoleAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { s as readConfigFileSnapshot } from "./io-ClLVsBMp.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { i as legacyModelKey } from "./model-ref-shared-D4yx0hwT.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-DbjoXfPH.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { n as isRich$1, r as theme } from "./theme-vjDs9tao.js";
import { n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { r as replaceConfigFile } from "./mutate-BjBakg7Z.js";
import "./config-B_0xOnKq.js";
import "./model-selection-Cp8EGD61.js";
import { n as inspectModelReference, r as canonicalizeModelCatalogProviderRef } from "./model-reference-validation-Gve9AexG.js";
//#region src/commands/models/list.format.ts
/** Formatting helpers for model-list terminal tables. */
const TRUNCATED_SUFFIX = "...";
/** Formats token counts as compact decimal-K labels. */
const formatTokenK = (value) => {
	if (!value || !Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}`;
	return `${Math.round(value / 1e3)}k`;
};
/** Enables rich formatting only for non-machine-readable output. */
const isRich = (opts) => isRich$1() && !opts?.json && !opts?.plain;
/** Pads a table cell to a fixed terminal visible width. */
const padTerminalCell = (value, size) => {
	const remaining = size - visibleWidth(value);
	return remaining > 0 ? `${value}${" ".repeat(remaining)}` : value;
};
/** Applies terminal color based on a model-list tag. */
const formatTag = (tag, rich) => {
	if (!rich) return tag;
	if (tag === "default") return theme.success(tag);
	if (tag === "image") return theme.accentBright(tag);
	if (tag === "configured") return theme.accent(tag);
	if (tag === "missing") return theme.error(tag);
	if (tag.startsWith("fallback#")) return theme.warn(tag);
	if (tag.startsWith("img-fallback#")) return theme.warn(tag);
	if (tag.startsWith("alias:")) return theme.accentDim(tag);
	return theme.muted(tag);
};
/** Truncates model-list cells to terminal visible width with an ASCII ellipsis. */
const truncate = (value, max) => {
	const sanitized = sanitizeTerminalText(value);
	if (visibleWidth(sanitized) <= max) return sanitized;
	if (max <= 3) return truncateToVisibleWidth(sanitized, max);
	return `${truncateToVisibleWidth(sanitized, max - 3)}${TRUNCATED_SUFFIX}`;
};
//#endregion
//#region src/commands/models/list.options.ts
/** Rejects conflicting machine-readable output modes. */
function ensureFlagCompatibility(opts) {
	if (opts.json && opts.plain) throw new Error("Choose either --json or --plain, not both.");
}
//#endregion
//#region src/commands/models/shared.ts
/** Shared helpers for model commands that read or mutate model config. */
/** Formats millisecond durations for model command output. */
const formatMs = (value) => {
	if (value === null || value === void 0) return "-";
	if (!Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}ms`;
	return `${Math.round(value / 100) / 10}s`;
};
/** Loads config from disk and throws a formatted error when validation fails. */
async function loadValidConfigOrThrow() {
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.valid) {
		const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
		throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
	}
	return snapshot.runtimeConfig ?? snapshot.config;
}
/** Reads source config, applies a mutator, and writes only the source-form config. */
async function updateConfig(mutator) {
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.valid) {
		const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
		throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
	}
	const next = await mutator(structuredClone(snapshot.sourceConfig ?? snapshot.config), { runtimeConfig: structuredClone(snapshot.runtimeConfig ?? snapshot.config) });
	await replaceConfigFile({
		nextConfig: next,
		baseHash: snapshot.hash
	});
	return next;
}
/** Resolves a CLI model reference through aliases and catalog provider aliases. */
function resolveModelTarget(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const resolved = resolveModelRefFromString({
		raw: params.raw,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex
	});
	if (!resolved) throw new Error(`Invalid model reference: ${params.raw}`);
	return canonicalizeModelCatalogProviderRef(resolved.ref, { cfg: params.cfg });
}
function resolveAuthoredModelAliasTarget(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const resolved = resolveModelRefFromString({
		raw: params.raw,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex
	});
	return resolved?.alias ? resolved.ref : void 0;
}
/** Resolves model reference strings to canonical provider/model keys. */
function resolveModelKeysFromEntries(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	return params.entries.map((entry) => resolveModelRefFromString({
		raw: entry,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex
	})).filter((entry) => Boolean(entry)).map((entry) => modelKey(entry.ref.provider, entry.ref.model));
}
function resolveKnownAgentId(cfg, rawAgentId) {
	const agentId = normalizeAgentId(rawAgentId);
	if (!listAgentIds(cfg).includes(agentId)) throw new Error(`Unknown agent id "${rawAgentId}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	return agentId;
}
/** Resolves the selected model-command agent and its profile directory. */
function resolveModelsTargetAgent(cfg, rawAgentId, mode) {
	const requested = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const requestedAgentId = requested ? resolveKnownAgentId(cfg, requested) : void 0;
	const agentId = resolveKnownAgentId(cfg, mode.kind === "read" ? resolveAmbientOwnerAgentId(cfg, requestedAgentId, {
		surface: "model inspection",
		hint: "Pass --agent <id> or set agents.defaults.systemAgent.agentId."
	}) : requestedAgentId ?? resolveSoleAgentId(cfg, {
		surface: "the model command",
		hint: "Pass --agent <id>."
	}));
	return {
		agentId,
		agentDir: (mode.kind === "read" ? mode.agentDirOverride : void 0) ?? resolveAgentDir(cfg, agentId)
	};
}
/** Upserts the canonical model entry and folds legacy key metadata into it. */
function upsertCanonicalModelConfigEntry(models, params) {
	const key = modelKey(params.provider, params.model);
	const legacyKeys = [legacyModelKey(params.provider, params.model), `${params.provider}/${key}`].filter((legacyKey) => typeof legacyKey === "string" && legacyKey.length > 0 && legacyKey !== key);
	let legacyEntry;
	for (const legacyKey of legacyKeys) {
		const entry = models[legacyKey];
		if (!entry) continue;
		Object.assign(legacyEntry ??= {}, entry);
		legacyEntry.params = {
			...legacyEntry.params,
			...entry.params
		};
	}
	if (legacyEntry) models[key] = {
		...legacyEntry,
		...models[key],
		params: {
			...legacyEntry.params,
			...models[key]?.params
		}
	};
	else if (!models[key]) models[key] = {};
	for (const legacyKey of legacyKeys) delete models[legacyKey];
	return key;
}
/** Merges primary/fallback patches while normalizing refs for config storage. */
function mergePrimaryFallbackConfig(existing, patch) {
	const next = { ...existing && typeof existing === "object" ? existing : void 0 };
	if (patch.primary !== void 0) next.primary = normalizeAgentModelRefForConfig(patch.primary);
	if (patch.fallbacks !== void 0) next.fallbacks = patch.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
	else if (next.fallbacks !== void 0) next.fallbacks = next.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
	return next;
}
/** Applies a default text/image primary-model update and ensures the model entry exists. */
function applyDefaultModelPrimaryUpdate(params) {
	const resolved = params.resolvedTarget ?? resolveDefaultModelPrimaryTarget(params);
	const nextModels = { ...params.cfg.agents?.defaults?.models };
	const key = upsertCanonicalModelConfigEntry(nextModels, resolved);
	const defaults = params.cfg.agents?.defaults ?? {};
	const existing = toAgentModelListLike(defaults[params.field]);
	return {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			defaults: {
				...defaults,
				[params.field]: mergePrimaryFallbackConfig(existing, { primary: key }),
				models: nextModels
			}
		}
	};
}
function resolveDefaultModelPrimaryTarget(params) {
	return params.resolveCfg && params.resolveCfg !== params.cfg ? resolveAuthoredModelAliasTarget({
		raw: params.modelRaw,
		cfg: params.cfg
	}) ?? resolveModelTarget({
		raw: params.modelRaw,
		cfg: params.resolveCfg
	}) : resolveModelTarget({
		raw: params.modelRaw,
		cfg: params.cfg
	});
}
/** Validates and persists one default text/image model selection. */
async function updateDefaultModelPrimaryConfig(params) {
	let warning;
	return {
		updated: await updateConfig((cfg, context) => {
			const resolvedTarget = resolveDefaultModelPrimaryTarget({
				cfg,
				resolveCfg: context.runtimeConfig,
				modelRaw: params.modelRaw
			});
			const inspection = inspectModelReference({
				cfg: context.runtimeConfig,
				ref: resolvedTarget
			});
			if (inspection.status === "unknown-provider") throw new Error(`Unknown model provider "${inspection.provider}". Install a plugin that declares it or configure it under models.providers before selecting "${inspection.ref}". Config was not changed.`);
			if (inspection.status === "unknown-model") warning = `Warning: Model "${inspection.ref}" is not in the local model catalog for provider "${inspection.provider}". The provider is installed or configured, so the selection was saved; verify the model ID if it is not a newly released or self-hosted model.`;
			return applyDefaultModelPrimaryUpdate({
				cfg,
				resolveCfg: context.runtimeConfig,
				modelRaw: params.modelRaw,
				field: params.field,
				resolvedTarget
			});
		}),
		...warning ? { warning } : {}
	};
}
/**
* Model key format: "provider/model"
*
* The model key is displayed in `/model status` and used to reference models.
* When using `/model <key>`, use the exact format shown (e.g., "openrouter/moonshotai/kimi-k2").
*
* For providers with hierarchical model IDs (e.g., OpenRouter), the model ID may include
* sub-providers (e.g., "moonshotai/kimi-k2"), resulting in a key like "openrouter/moonshotai/kimi-k2".
*/
//#endregion
export { resolveModelKeysFromEntries as a, updateConfig as c, ensureFlagCompatibility as d, formatTag as f, truncate as g, padTerminalCell as h, mergePrimaryFallbackConfig as i, updateDefaultModelPrimaryConfig as l, isRich as m, formatMs as n, resolveModelTarget as o, formatTokenK as p, loadValidConfigOrThrow as r, resolveModelsTargetAgent as s, applyDefaultModelPrimaryUpdate as t, upsertCanonicalModelConfigEntry as u };
