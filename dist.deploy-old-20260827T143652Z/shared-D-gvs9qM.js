import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { At as boolean, Rn as string, Tn as object, wn as number } from "./schemas-CZ9Toj_c.js";
import { g as MarkdownConfigSchema, s as DmPolicySchema, u as GroupPolicySchema } from "./zod-schema.core-DlR2bhDb.js";
import { a as buildChannelConfigSchema, c as buildMultiAccountChannelSchema, o as buildGroupEntrySchema, t as AllowFromListSchema } from "./config-schema-7k2vg2UM.js";
import "./reply-payload-DBNGwex4.js";
import { a as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-C6dKYMZI.js";
import { n as describeAccountSnapshot } from "./account-helpers-CEliAVvN.js";
import "./text-chunking-DrVvfnLf.js";
import "./core-Bqt7fa3M.js";
import "./runtime-doctor-migrations-Bxiar_G3.js";
import { t as formatAllowFromLowercase } from "./allow-from-D8N51uwu.js";
import "./dangerous-name-runtime-DPfCb05r.js";
import "./channel-config-schema-B2VBzFY9.js";
import { i as createDangerousNameMatchingMutableAllowlistWarningCollector } from "./channel-policy-DlGVx39H.js";
import { a as checkZcaAuthenticated, c as resolveZalouserAccountSync, o as listZalouserAccountIds, s as resolveDefaultZalouserAccountId } from "./setup-core-BhRoyl_r.js";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-CZsh-TMv.js";
import { n as isZalouserMutableGroupEntry } from "./security-audit-4pfjAFEl.js";
//#region extensions/zalouser/src/config-schema.ts
const groupConfigSchema = buildGroupEntrySchema().omit({
	toolsBySender: true,
	skills: true,
	allowFrom: true,
	systemPrompt: true
}).strip();
const ZalouserConfigSchema = buildMultiAccountChannelSchema(object({
	name: string().optional(),
	enabled: boolean().optional(),
	configWrites: boolean().optional(),
	markdown: MarkdownConfigSchema,
	profile: string().optional(),
	dangerouslyAllowNameMatching: boolean().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: AllowFromListSchema,
	historyLimit: number().int().min(0).optional(),
	groupAllowFrom: AllowFromListSchema,
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groups: object({}).catchall(groupConfigSchema).optional(),
	messagePrefix: string().optional(),
	responsePrefix: string().optional()
}), { accountsMode: "catchall" });
const zalouserDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "hybrid",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectMutableAllowlistWarnings: createDangerousNameMatchingMutableAllowlistWarningCollector({
		channel: "zalouser",
		detector: isZalouserMutableGroupEntry,
		collectLists: (scope) => {
			const groups = asNullableRecord(scope.account.groups);
			return groups ? [{
				pathLabel: `${scope.prefix}.groups`,
				list: Object.keys(groups)
			}] : [];
		}
	})
};
//#endregion
//#region extensions/zalouser/src/shared.ts
const zalouserMeta = {
	id: "zalouser",
	label: "Zalo Personal",
	selectionLabel: "Zalo (Personal Account)",
	docsPath: "/channels/zalouser",
	docsLabel: "zalouser",
	blurb: "Zalo personal account via QR code login.",
	aliases: ["zlu"],
	order: 85,
	quickstartAllowFrom: false
};
const zalouserConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "zalouser",
	listAccountIds: listZalouserAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveZalouserAccountSync),
	defaultAccountId: resolveDefaultZalouserAccountId,
	clearBaseFields: [
		"profile",
		"name",
		"dmPolicy",
		"allowFrom",
		"historyLimit",
		"groupAllowFrom",
		"groupPolicy",
		"groups",
		"messagePrefix"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(zalouser|zlu):/i
	})
});
function createZalouserPluginBase(params) {
	return {
		id: "zalouser",
		meta: zalouserMeta,
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true,
			reactions: true,
			threads: false,
			polls: false,
			nativeCommands: false,
			blockStreaming: true
		},
		doctor: zalouserDoctor,
		reload: { configPrefixes: ["channels.zalouser"] },
		configSchema: buildChannelConfigSchema(ZalouserConfigSchema),
		config: {
			...zalouserConfigAdapter,
			isConfigured: (account) => Boolean(account.profile),
			isLinked: async (account) => await checkZcaAuthenticated(account.profile) ? "linked" : "not-linked",
			unconfiguredReason: () => "not configured",
			unlinkedReason: () => "not authenticated",
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: Boolean(account.profile)
			})
		},
		setupContract: params.setupContract
	};
}
//#endregion
export { createZalouserPluginBase as t };
