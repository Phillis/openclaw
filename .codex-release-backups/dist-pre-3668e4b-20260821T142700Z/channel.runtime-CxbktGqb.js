import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./error-runtime-oXQewkZq.js";
import "./number-runtime-CoAPZzJY.js";
import { t as runChannelProbe } from "./text-utility-runtime-BSdEoze8.js";
import { t as collectZalouserSecurityAuditFindings } from "./security-audit-CSExCPGE.js";
import { S as waitForZaloQrLogin, a as listZaloGroupMembers, c as logoutZaloProfile, i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, x as startZaloQrLogin } from "./zalo-js-CoPSLtzp.js";
import { a as sendReactionZalouser, i as sendMessageZalouser } from "./send-CWryV2fH.js";
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
