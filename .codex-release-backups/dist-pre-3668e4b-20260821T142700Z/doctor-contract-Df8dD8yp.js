import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { i as defineChannelAliasMigration, l as hasLegacyAccountStreamingAliases, n as defineKeyMoveMigration, s as normalizeChannelConfigEntries } from "./runtime-doctor-migrations-BkKB39tt.js";
import { n as normalizeFeishuWebhookPath, t as DEFAULT_FEISHU_WEBHOOK_PATH } from "./webhook-path-CdNjPCi8.js";
//#region extensions/feishu/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "feishu",
	streaming: { defaultMode: "partial" },
	accountStreamingReplacesRoot: true
});
const LEGACY_COALESCE_FIELDS = [
	"enabled",
	"minDelayMs",
	"maxDelayMs"
];
const LEGACY_HEARTBEAT_FIELDS = ["visibility", "intervalMs"];
const toolsBaseMigration = defineKeyMoveMigration({
	from: ["tools", "base"],
	to: ["tools", "bitable"],
	match: (value) => typeof value === "boolean",
	sourceOwn: false
});
function sanitizeLegacyHeartbeatFields(params) {
	const heartbeat = asNullableRecord(params.entry.heartbeat);
	if (!heartbeat || Object.keys(heartbeat).length > 0 && !LEGACY_HEARTBEAT_FIELDS.some((field) => Object.hasOwn(heartbeat, field))) return {
		entry: params.entry,
		changed: false
	};
	const next = { ...params.entry };
	delete next.heartbeat;
	params.changes.push(`Removed ${params.pathPrefix}.heartbeat (legacy Feishu fields were never read by runtime).`);
	return {
		entry: next,
		changed: true
	};
}
function sanitizeLegacyCoalesceFields(params) {
	const streaming = asNullableRecord(params.entry.streaming);
	const block = asNullableRecord(streaming?.block);
	const coalesce = asNullableRecord(block?.coalesce);
	if (!streaming || !block || !coalesce) return {
		entry: params.entry,
		changed: false
	};
	const removed = LEGACY_COALESCE_FIELDS.filter((field) => coalesce[field] !== void 0);
	if (removed.length === 0) return {
		entry: params.entry,
		changed: false
	};
	const nextCoalesce = { ...coalesce };
	for (const field of removed) delete nextCoalesce[field];
	params.changes.push(`Removed ${params.pathPrefix}.streaming.block.coalesce.{${removed.join(",")}} (legacy Feishu-only fields; block delivery reads minChars/maxChars/idleMs).`);
	return {
		entry: {
			...params.entry,
			streaming: {
				...streaming,
				block: {
					...block,
					coalesce: nextCoalesce
				}
			}
		},
		changed: true
	};
}
function hasLegacyWebhookPath(value) {
	const path = asNullableRecord(value)?.webhookPath;
	return typeof path === "string" && normalizeFeishuWebhookPath(path) !== path;
}
function normalizeLegacyWebhookPath(params) {
	const path = params.entry.webhookPath;
	if (typeof path !== "string") return {
		entry: params.entry,
		changed: false
	};
	const normalized = normalizeFeishuWebhookPath(path);
	const canonical = normalized ?? "/feishu/events";
	if (canonical === path) return {
		entry: params.entry,
		changed: false
	};
	params.changes.push(normalized === null ? `Reset invalid ${params.pathPrefix}.webhookPath to ${DEFAULT_FEISHU_WEBHOOK_PATH}.` : `Normalized ${params.pathPrefix}.webhookPath to its HTTP request path.`);
	return {
		entry: {
			...params.entry,
			webhookPath: canonical
		},
		changed: true
	};
}
function normalizeFeishuLegacyConfigEntries(cfg, changes) {
	return normalizeChannelConfigEntries({
		cfg,
		channelId: "feishu",
		changes,
		normalizeEntry: (params) => {
			const tools = toolsBaseMigration.normalize(params);
			const coalesce = sanitizeLegacyCoalesceFields({
				...params,
				entry: tools.entry
			});
			const heartbeat = sanitizeLegacyHeartbeatFields({
				...params,
				entry: coalesce.entry
			});
			const webhook = normalizeLegacyWebhookPath({
				...params,
				entry: heartbeat.entry
			});
			return {
				entry: webhook.entry,
				changed: tools.changed || coalesce.changed || heartbeat.changed || webhook.changed
			};
		}
	}).config;
}
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: ["channels", "feishu"],
		message: "channels.feishu[.accounts.<id>].webhookPath must be a canonical HTTP request path; run \"openclaw doctor --fix\".",
		match: (value) => {
			const entry = asNullableRecord(value);
			return hasLegacyWebhookPath(entry) || hasLegacyAccountStreamingAliases(entry?.accounts, hasLegacyWebhookPath);
		}
	},
	{
		path: ["channels", "feishu"],
		message: "channels.feishu[.accounts.<id>].tools.base is legacy; use tools.bitable. Run \"openclaw doctor --fix\".",
		match: (value) => {
			const entry = asNullableRecord(value);
			return toolsBaseMigration.hasLegacy(entry) || hasLegacyAccountStreamingAliases(entry?.accounts, toolsBaseMigration.hasLegacy);
		}
	}
];
function normalizeCompatibilityConfig({ cfg }) {
	const aliases = streamingAliasMigration.normalizeChannelConfig({ cfg });
	return {
		config: normalizeFeishuLegacyConfigEntries(aliases.config, aliases.changes),
		changes: aliases.changes
	};
}
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
