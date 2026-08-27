import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-oCkfUEEq.js";
import { s as callGateway } from "./call-CZ1eu88h.js";
import { t as formatRunLabel } from "./subagents-utils-Bya_9C4V.js";
import { r as stripToolMessages } from "./chat-history-text-DJ2UV7io.js";
import { n as commandReply } from "./command-gates-Cn1fPIAB.js";
import { n as formatLogLines, s as resolveSubagentEntryForToken } from "./shared-CSkwpQVL.js";
//#region src/auto-reply/reply/commands-subagents/action-log.ts
async function handleSubagentsLogAction(ctx) {
	const { runs, restTokens } = ctx;
	const target = restTokens[0];
	if (!target) return commandReply("📜 Usage: /subagents log <id|#> [limit]");
	const includeTools = restTokens.some((token) => normalizeLowercaseStringOrEmpty(token) === "tools");
	const parsedLimit = parseStrictNonNegativeInteger(restTokens.slice(1).find((token) => parseStrictNonNegativeInteger(token) !== void 0));
	const limit = parsedLimit === void 0 ? 20 : Math.min(200, Math.max(1, parsedLimit));
	const targetResolution = resolveSubagentEntryForToken(runs, target);
	if ("reply" in targetResolution) return targetResolution.reply;
	const history = await callGateway({
		method: "chat.history",
		params: {
			sessionKey: targetResolution.entry.childSessionKey,
			limit
		}
	});
	const rawMessages = Array.isArray(history?.messages) ? history.messages : [];
	const lines = formatLogLines(includeTools ? rawMessages : stripToolMessages(rawMessages));
	const header = `📜 Subagent log: ${formatRunLabel(targetResolution.entry)}`;
	if (lines.length === 0) return commandReply(`${header}\n(no messages)`);
	return commandReply([header, ...lines].join("\n"));
}
//#endregion
export { handleSubagentsLogAction };
