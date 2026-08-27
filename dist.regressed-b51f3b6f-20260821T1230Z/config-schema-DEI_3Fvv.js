import { At as boolean, Ht as email, Rn as string, Tn as object, Zn as unknown, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
//#region extensions/reef/src/config-schema.ts
const HandleSchema = string().regex(/^[a-z0-9][a-z0-9_-]{0,62}$/);
const RelayUrlSchema = string().regex(/^[hH][tT][tT][pP][sS]?:\/\/[^\\/?#@]+\/?$/, "Reef relay URL must be an HTTP(S) origin without credentials, path, query, or hash").url();
const ReefChannelConfigSchema = object({
	enabled: boolean().default(true),
	configWrites: boolean().optional(),
	relayUrl: RelayUrlSchema.default("https://reefwire.ai"),
	handle: HandleSchema.optional(),
	email: email().optional(),
	guard: object({
		provider: _enum(["anthropic", "openai"]),
		pinnedModel: string().min(1),
		apiKeyEnv: string().regex(/^[A-Z_][A-Z0-9_]*$/),
		policyVersion: string().min(1),
		timeoutMs: number().int().min(100).max(12e4)
	}).strict().optional(),
	stateDir: string().min(1).optional(),
	requestPolicy: _enum([
		"code-only",
		"friends-of-friends",
		"open"
	]).default("code-only"),
	friends: unknown().optional()
}).strict();
function resolveReefConfig(cfg) {
	return ReefChannelConfigSchema.parse(cfg.channels?.reef ?? {});
}
function normalizeReefTarget(raw) {
	const target = raw.trim().replace(/^(reef:|@)/i, "").toLowerCase();
	return HandleSchema.safeParse(target).success ? target : void 0;
}
function parseReefRelayUrl(raw) {
	return new URL(RelayUrlSchema.parse(raw)).origin;
}
function autonomyBudget(autonomy) {
	return {
		notifyOnly: autonomy === "notify-only",
		botLoopProtection: {
			enabled: true,
			maxEventsPerWindow: autonomy === "extended" ? 12 : autonomy === "bounded" ? 3 : 1,
			windowSeconds: autonomy === "extended" ? 3600 : 86400,
			cooldownSeconds: 86400
		}
	};
}
//#endregion
export { resolveReefConfig as a, parseReefRelayUrl as i, autonomyBudget as n, normalizeReefTarget as r, ReefChannelConfigSchema as t };
