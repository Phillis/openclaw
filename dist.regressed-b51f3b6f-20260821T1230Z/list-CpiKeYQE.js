import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { n as ClawHubRequestError } from "./clawhub-client-4V78ChLt.js";
import { n as markPromotionSlugsNotified, s as fetchClawHubPromotions } from "./promotions-feed-DkfVhcp-.js";
//#region src/commands/promos/list.ts
/** Lists active ClawHub promotional model offers. */
function formatWindowEnd(promotion) {
	const daysLeft = Math.max(0, Math.ceil((promotion.endsAt - Date.now()) / 864e5));
	if (daysLeft === 0) return "ends today";
	return daysLeft === 1 ? "1 day left" : `${daysLeft} days left`;
}
async function promosListCommand(opts, runtime) {
	let promotions;
	try {
		promotions = await fetchClawHubPromotions();
	} catch (error) {
		if (!(error instanceof ClawHubRequestError) || error.status !== 404) throw error;
		if (opts.json) writeRuntimeJson(runtime, { promotions: [] });
		else runtime.log("Promotions are not available from ClawHub yet.");
		return;
	}
	markPromotionSlugsNotified(promotions.map((promotion) => promotion.slug));
	if (opts.json) {
		writeRuntimeJson(runtime, { promotions });
		return;
	}
	if (promotions.length === 0) {
		runtime.log("No active promotions right now.");
		return;
	}
	const safe = sanitizeTerminalText;
	for (const promotion of promotions) {
		const sponsor = promotion.sponsor ? ` — ${safe(promotion.sponsor)}` : "";
		runtime.log(`${safe(promotion.title)}${sponsor} (${formatWindowEnd(promotion)})`);
		runtime.log(`  ${safe(promotion.blurb)}`);
		for (const model of promotion.models) {
			const alias = model.alias ? ` (${safe(model.alias)})` : "";
			const suggested = model.suggestedDefault ? " — suggested default" : "";
			runtime.log(`  · ${safe(model.modelRef)}${alias}${suggested}`);
		}
		runtime.log(`  Claim: ${formatCliCommand(`openclaw promos claim ${safe(promotion.slug)}`)}`);
	}
}
//#endregion
export { promosListCommand };
