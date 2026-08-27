import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { t as defineChannelSetupContract } from "./setup-contract-CIbR6uxD.js";
import { t as createAccountListHelpers } from "./account-helpers-Cnv50TjD.js";
import "./temp-path-wP_7naJE.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as createSetupTranslator } from "./i18n-BQpjgFU-.js";
import { i as createPatchedAccountSetupAdapter } from "./setup-helpers-ChQBLW6h.js";
import { i as createDelegatedSetupWizardProxy } from "./setup-credential-Cg5429p2.js";
import "./setup-runtime-DoSscGn3.js";
import "./channel-setup-o7ff3LvZ.js";
import "./account-resolution-B2Bh3J2z.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/zalouser/src/accounts.ts
const loadZalouserAccountsRuntime = createLazyRuntimeModule(() => import("./accounts.runtime.js"));
const { listAccountIds: listZalouserAccountIds, resolveDefaultAccountId: resolveDefaultZalouserAccountId, resolveAccountConfig: resolveMergedZalouserAccountConfig } = createAccountListHelpers("zalouser", {
	omitKeys: ["defaultAccount"],
	implicitDefaultAccount: {
		channelKeys: ["profile"],
		envVars: ["ZALOUSER_PROFILE", "ZCA_PROFILE"]
	}
});
function mergeZalouserAccountConfig(cfg, accountId) {
	const merged = resolveMergedZalouserAccountConfig(cfg, accountId);
	return {
		...merged,
		groupPolicy: merged.groupPolicy ?? "allowlist"
	};
}
function resolveProfile(config, accountId) {
	if (config.profile?.trim()) return config.profile.trim();
	if (process.env.ZALOUSER_PROFILE?.trim()) return process.env.ZALOUSER_PROFILE.trim();
	if (process.env.ZCA_PROFILE?.trim()) return process.env.ZCA_PROFILE.trim();
	if (accountId !== "default") return accountId;
	return "default";
}
function resolveZalouserAccountBase(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultZalouserAccountId(params.cfg));
	const baseEnabled = (params.cfg.channels?.zalouser)?.enabled !== false;
	const merged = mergeZalouserAccountConfig(params.cfg, accountId);
	return {
		accountId,
		enabled: baseEnabled && merged.enabled !== false,
		merged,
		profile: resolveProfile(merged, accountId)
	};
}
function resolveZalouserAccountSync(params) {
	const { accountId, enabled, merged, profile } = resolveZalouserAccountBase(params);
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		profile,
		authenticated: false,
		config: merged
	};
}
async function checkZcaAuthenticated(profile, options) {
	return await (await loadZalouserAccountsRuntime()).checkZaloAuthenticated(profile, options);
}
//#endregion
//#region extensions/zalouser/src/qr-temp-file.ts
async function writeQrDataUrlToTempFile(qrDataUrl, profile) {
	const base64 = (qrDataUrl.trim().match(/^data:image\/png;base64,(.+)$/i)?.[1] ?? "").trim();
	if (!base64) return null;
	const safeProfile = profile.replace(/[^a-zA-Z0-9_-]+/g, "-") || "default";
	const filePath = path.join(resolvePreferredOpenClawTmpDir(), `openclaw-zalouser-qr-${safeProfile}.png`);
	await fs.writeFile(filePath, Buffer.from(base64, "base64"), { mode: 384 });
	await fs.chmod(filePath, 384);
	return filePath;
}
//#endregion
//#region extensions/zalouser/src/setup-core.ts
const t = createSetupTranslator();
const channel = "zalouser";
const zalouserSetupAdapter = createPatchedAccountSetupAdapter({
	channelKey: channel,
	validateInput: () => null,
	buildPatch: () => ({})
});
const zalouserSetupContract = defineChannelSetupContract({
	fields: {},
	legacyAdapter: zalouserSetupAdapter
});
function createZalouserSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel,
		loadWizard,
		status: {
			configuredLabel: t("wizard.channels.statusLoggedIn"),
			unconfiguredLabel: t("wizard.channels.statusNeedsQrLogin"),
			configuredHint: t("wizard.channels.statusRecommendedLoggedIn"),
			unconfiguredHint: t("wizard.channels.statusRecommendedQrLogin"),
			configuredScore: 1,
			unconfiguredScore: 15
		},
		credentials: [],
		delegatePrepare: true,
		delegateFinalize: true
	});
}
//#endregion
export { checkZcaAuthenticated as a, resolveZalouserAccountSync as c, writeQrDataUrlToTempFile as i, zalouserSetupAdapter as n, listZalouserAccountIds as o, zalouserSetupContract as r, resolveDefaultZalouserAccountId as s, createZalouserSetupWizardProxy as t };
