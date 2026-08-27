//#region src/gateway/control-ui-http-utils.ts
/** Returns true for idempotent HTTP methods that can read Control UI assets. */
function isReadHttpMethod(method) {
	return method === "GET" || method === "HEAD";
}
/** Returns whether an Accept header permits an HTML document response. */
function acceptsControlUiHtmlResponse(accept) {
	const normalized = accept?.trim();
	if (!normalized) return true;
	return normalized.split(",").some((entry) => {
		const [rawMediaType, ...parameters] = entry.split(";");
		if (parameters.some((parameter) => /^\s*q\s*=\s*0(?:\.0{0,3})?\s*$/i.test(parameter))) return false;
		const mediaType = rawMediaType?.trim().toLowerCase();
		return mediaType === "*/*" || mediaType === "text/*" || mediaType === "text/html" || mediaType === "application/xhtml+xml";
	});
}
/** Sends a plain-text response with the standard UTF-8 content type. */
function respondPlainText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	if (statusCode !== 204) res.setHeader("Content-Length", String(Buffer.byteLength(body)));
	res.end(body);
}
/** Sends the shared plain-text 404 response for Control UI routes. */
function respondNotFound(res) {
	respondPlainText(res, 404, "Not Found");
}
//#endregion
export { respondPlainText as i, isReadHttpMethod as n, respondNotFound as r, acceptsControlUiHtmlResponse as t };
