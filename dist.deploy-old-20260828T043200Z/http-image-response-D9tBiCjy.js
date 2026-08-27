import { t as matchesHttpIfNoneMatch } from "./http-conditional-BWrY1Un1.js";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/http-image-response.ts
/** Authenticated UI images are deliberately small, bounded presentation assets. */
const HTTP_IMAGE_MAX_BYTES = 512 * 1024;
/** Vector images are markup the renderer must parse, so they get a tighter cap. */
const HTTP_SVG_MAX_BYTES = 64 * 1024;
const SVG_MIME_TYPE = "image/svg+xml";
const ICO_MIME_TYPE = "image/x-icon";
/** Sniffable raster types the Control UI can render inside an <img> element. */
const ALLOWED_HTTP_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
	ICO_MIME_TYPE
]);
/**
* SVG images stay self-contained: no script, document expansion, embedded
* documents, or outbound fetches can reach the browser through an image route.
*/
function isRenderableHttpSvg(body) {
	if (body.byteLength > 65536) return false;
	const text = body.toString("utf8");
	return !text.includes("\0") && !/<!doctype|<!entity/iu.test(text) && !/<\s*(?:script|foreignObject|image|use|iframe)\b/iu.test(text) && !/\b(?:href|xlink:href|src)\s*=/iu.test(text) && /^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg(?:\s|>)/iu.test(text);
}
/** Sniffs and validates bytes before they become a browser image response. */
async function resolveHttpImageRepresentation(sourceName, body) {
	if (body.byteLength === 0 || body.byteLength > 524288) return;
	let contentType;
	if (path.extname(sourceName).toLowerCase() === ".svg") contentType = isRenderableHttpSvg(body) ? SVG_MIME_TYPE : void 0;
	else {
		const sniffed = (await fileTypeFromBuffer(body))?.mime;
		const normalized = sniffed === "image/vnd.microsoft.icon" ? ICO_MIME_TYPE : sniffed;
		contentType = normalized && ALLOWED_HTTP_IMAGE_MIME_TYPES.has(normalized) ? normalized : void 0;
	}
	if (!contentType) return;
	return {
		body,
		contentType,
		etag: `"${createHash("sha256").update(body).digest("base64url")}"`
	};
}
/** Writes the shared private-cache and document-sandbox policy for image bytes. */
function sendHttpImageResponse(params) {
	const { req, res, image } = params;
	res.setHeader("etag", image.etag);
	res.setHeader("cache-control", params.cacheControl ?? "private, max-age=3600");
	res.setHeader("cross-origin-resource-policy", "same-origin");
	res.setHeader("x-content-type-options", "nosniff");
	res.setHeader("content-security-policy", "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; sandbox");
	res.setHeader("content-disposition", `attachment; filename="${params.filename}"`);
	if (matchesHttpIfNoneMatch(req.headers["if-none-match"], image.etag)) {
		res.statusCode = 304;
		res.end();
		return;
	}
	res.statusCode = 200;
	res.setHeader("content-type", image.contentType);
	res.setHeader("content-length", String(image.body.byteLength));
	res.end(req.method === "HEAD" ? void 0 : image.body);
}
//#endregion
export { sendHttpImageResponse as i, HTTP_SVG_MAX_BYTES as n, resolveHttpImageRepresentation as r, HTTP_IMAGE_MAX_BYTES as t };
