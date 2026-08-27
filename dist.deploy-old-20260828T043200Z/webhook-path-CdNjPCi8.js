//#region extensions/feishu/src/webhook-path.ts
const DEFAULT_FEISHU_WEBHOOK_PATH = "/feishu/events";
/** Normalize trusted configuration only; incoming request targets must remain unmodified. */
function normalizeFeishuWebhookPath(value) {
	const configured = value?.trim();
	if (!configured) return DEFAULT_FEISHU_WEBHOOK_PATH;
	try {
		const parsed = new URL(configured, "http://localhost");
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
		const emptyQuery = !parsed.search && parsed.href.endsWith("?") && !configured.includes("#") ? "?" : "";
		return `${parsed.pathname}${parsed.search}${emptyQuery}`;
	} catch {
		return null;
	}
}
//#endregion
export { normalizeFeishuWebhookPath as n, DEFAULT_FEISHU_WEBHOOK_PATH as t };
