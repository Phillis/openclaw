import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./error-runtime-CmA1H4Zg.js";
import "./number-runtime-Cy4drVnh.js";
import { t as runChannelProbe } from "./text-utility-runtime-BNhX-3os.js";
import { t as collectZalouserSecurityAuditFindings } from "./security-audit-DemZyz6Q.js";
import { S as waitForZaloQrLogin, a as listZaloGroupMembers, c as logoutZaloProfile, i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, x as startZaloQrLogin } from "./zalo-js-CqMzO3kK.js";
import { a as sendReactionZalouser, i as sendMessageZalouser } from "./send-B9e3tcmG.js";
//#region extensions/zalouser/src/probe.ts
async function probeZalouser(profile, timeoutMs) {
	return await runChannelProbe(timeoutMs ? resolveTimerTimeoutMs(timeoutMs, 1e3, 1e3) : void 0, async () => {
		const user = await getZaloUserInfo(profile);
		return user ? {
			ok: true,
			user
		} : {
			ok: false,
			error: "Not authenticated"
		};
	}, (error) => ({
		ok: false,
		error: formatErrorMessage(error)
	}));
}
//#endregion
export { collectZalouserSecurityAuditFindings, getZaloUserInfo, listZaloFriendsMatching, listZaloGroupMembers, listZaloGroupsMatching, logoutZaloProfile, probeZalouser, sendMessageZalouser, sendReactionZalouser, startZaloQrLogin, waitForZaloQrLogin };
