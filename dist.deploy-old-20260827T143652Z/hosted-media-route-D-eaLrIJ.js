//#region extensions/synology-chat/src/hosted-media-route.ts
const SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX = "__openclaw_synology_media_token";
function normalizeExactPath(path) {
	const trimmed = path.trim();
	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/u, "") : "/";
}
function resolveSynologyPublicWebhookRouteKey(webhookUrlValue) {
	try {
		const webhookUrl = new URL(webhookUrlValue);
		if (webhookUrl.protocol !== "https:" || !webhookUrl.hostname || webhookUrl.username || webhookUrl.password || webhookUrl.hash) return;
		webhookUrl.searchParams.sort();
		return webhookUrl.toString();
	} catch {
		return;
	}
}
function toSynologyHostedMediaStoreRoutePath(path) {
	const normalized = normalizeExactPath(path);
	return normalized === "/" ? normalized : `${normalized}/`;
}
function resolveSynologyHostedMediaRoute(params) {
	if (!params.webhookUrl.trim()) throw new Error("Synology Chat attachments require webhookUrl. Set the account's exact externally reachable HTTPS callback URL.");
	if (!resolveSynologyPublicWebhookRouteKey(params.webhookUrl)) throw new Error("Synology Chat webhookUrl must be an absolute HTTPS URL with a hostname and no credentials or fragment.");
	const webhookUrl = new URL(params.webhookUrl);
	if ([...webhookUrl.searchParams.keys()].some((key) => key.startsWith(`__openclaw_synology_media_token_`))) throw new Error(`Synology Chat webhookUrl must not contain query parameters starting with ${SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX}_.`);
	return {
		localRoutePath: toSynologyHostedMediaStoreRoutePath(params.webhookPath),
		publicBaseUrl: webhookUrl.origin,
		publicRoutePath: webhookUrl.pathname,
		publicSearch: webhookUrl.search
	};
}
//#endregion
export { toSynologyHostedMediaStoreRoutePath as i, resolveSynologyHostedMediaRoute as n, resolveSynologyPublicWebhookRouteKey as r, SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX as t };
