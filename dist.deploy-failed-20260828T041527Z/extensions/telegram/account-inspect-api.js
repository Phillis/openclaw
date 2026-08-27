import { t as inspectTelegramAccount } from "../../account-inspect-Br0r-wcR.js";
//#region extensions/telegram/account-inspect-api.ts
function inspectTelegramReadOnlyAccount(cfg, accountId) {
	return inspectTelegramAccount({
		cfg,
		accountId
	});
}
//#endregion
export { inspectTelegramReadOnlyAccount };
