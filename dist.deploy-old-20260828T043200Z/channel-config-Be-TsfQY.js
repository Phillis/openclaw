import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { c as createTopLevelChannelConfigAdapter } from "./channel-config-helpers-C7An4wuC.js";
import { n as tryReadSecretFileSync } from "./secret-file-Cbg2G7na.js";
import "./secret-file-runtime-D0-UDab9.js";
import { t as formatAllowFromLowercase } from "./allow-from-C78YI2I3.js";
import { S as resolveMSTeamsCredentials } from "./inbound-5byP9f5_.js";
//#region extensions/msteams/src/channel-config.ts
const msteamsMeta = {
	id: "msteams",
	label: "Microsoft Teams",
	selectionLabel: "Microsoft Teams (Bot Framework)",
	docsPath: "/channels/msteams",
	docsLabel: "msteams",
	blurb: "Teams SDK; enterprise support.",
	aliases: ["teams"],
	order: 60
};
function resolveMSTeamsAccount(cfg) {
	const config = cfg.channels?.msteams;
	const credentials = resolveMSTeamsCredentials(config);
	const certificatePath = credentials?.type === "federated" && !credentials.useManagedIdentity ? credentials.certificatePath : void 0;
	const certificate = certificatePath ? tryReadSecretFileSync(certificatePath, "Microsoft Teams certificate", void 0, { configPath: config?.certificatePath?.trim() ? "channels.msteams.certificatePath" : "env.MSTEAMS_CERTIFICATE_PATH" }) : void 0;
	const unavailable = certificate?.status === "configured_unavailable";
	return {
		accountId: DEFAULT_ACCOUNT_ID,
		enabled: config?.enabled !== false,
		configured: Boolean(credentials),
		tokenStatus: !credentials ? "missing" : unavailable ? "configured_unavailable" : "available",
		...unavailable ? { credentialDiagnostics: [certificate.diagnostic] } : {}
	};
}
const msteamsConfigAdapter = createTopLevelChannelConfigAdapter({
	sectionKey: "msteams",
	resolveAccount: resolveMSTeamsAccount,
	resolveAccessorAccount: ({ cfg }) => ({
		allowFrom: cfg.channels?.msteams?.allowFrom,
		defaultTo: cfg.channels?.msteams?.defaultTo
	}),
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
	resolveDefaultTo: (account) => account.defaultTo
});
//#endregion
export { msteamsMeta as n, resolveMSTeamsAccount as r, msteamsConfigAdapter as t };
