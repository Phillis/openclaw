import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./error-runtime-CmlvK1A3.js";
import { t as runChannelProbe } from "./text-utility-runtime-LRU688AB.js";
import { t as MessagingApiClient } from "./messagingApiClient-UpUACf5e.js";
//#region extensions/line/src/probe.ts
async function probeLineBot(channelAccessToken, timeoutMs = 5e3) {
	if (!channelAccessToken?.trim()) return {
		ok: false,
		error: "Channel access token not configured"
	};
	const client = new MessagingApiClient({ channelAccessToken: channelAccessToken.trim() });
	return await runChannelProbe(timeoutMs, async () => {
		const profile = await client.getBotInfo();
		return {
			ok: true,
			bot: {
				displayName: profile.displayName,
				userId: profile.userId,
				basicId: profile.basicId,
				pictureUrl: profile.pictureUrl
			}
		};
	}, (error) => ({
		ok: false,
		error: formatErrorMessage(error)
	}));
}
//#endregion
export { probeLineBot as t };
