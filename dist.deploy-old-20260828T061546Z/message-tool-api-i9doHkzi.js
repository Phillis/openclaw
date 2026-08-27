import { n as listGoogleChatAccountIds, t as inspectGoogleChatAccount } from "./accounts-BKR-gDyB.js";
//#region extensions/googlechat/src/message-tool-api.ts
function describeGoogleChatMessageTool({ cfg, accountId }) {
	return (accountId ? [inspectGoogleChatAccount({
		cfg,
		accountId
	})] : listGoogleChatAccountIds(cfg).map((listedAccountId) => inspectGoogleChatAccount({
		cfg,
		accountId: listedAccountId
	}))).some((account) => account.enabled && account.credentialSource !== "none" && account.tokenStatus === "available") ? { actions: ["send"] } : null;
}
//#endregion
export { describeGoogleChatMessageTool as t };
