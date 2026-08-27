import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { createHmac, randomBytes } from "node:crypto";
//#region src/gateway/board-view-ticket.ts
const BOARD_HTTP_PATH_PREFIX = "/__openclaw__/board/";
const BOARD_VIEW_TICKET_TTL_MS = 20 * 6e4;
const BOARD_VIEW_TICKET_SCOPE = "board-widget-view";
const BOARD_VIEW_TICKET_MAX_LENGTH = 2048;
const ticketSecret = randomBytes(32);
function signTicketPayload(payload, secret) {
	return createHmac("sha256", secret).update(`${BOARD_VIEW_TICKET_SCOPE}\0${payload}`).digest("base64url");
}
function isValidClaims(value) {
	if (!value || typeof value !== "object") return false;
	const claims = value;
	return typeof claims.sessionKey === "string" && claims.sessionKey.length > 0 && claims.sessionKey.length <= 512 && (claims.agentId === void 0 || typeof claims.agentId === "string" && claims.agentId.length > 0 && claims.agentId.length <= 64) && typeof claims.name === "string" && claims.name.length > 0 && claims.name.length <= 64 && Number.isSafeInteger(claims.revision) && (claims.revision ?? 0) >= 1 && typeof claims.viewGeneration === "string" && /^[a-f0-9]{32}$/u.test(claims.viewGeneration) && Number.isSafeInteger(claims.expiresAtMs) && typeof claims.nonce === "string" && /^[A-Za-z0-9_-]{32}$/u.test(claims.nonce);
}
function createBoardViewTicket(params) {
	const nowMs = params.nowMs ?? Date.now();
	const claims = {
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		name: params.name,
		revision: params.revision,
		viewGeneration: params.viewGeneration,
		expiresAtMs: nowMs + BOARD_VIEW_TICKET_TTL_MS,
		nonce: randomBytes(24).toString("base64url")
	};
	if (!Number.isSafeInteger(nowMs) || !isValidClaims(claims)) throw new Error("invalid board view ticket binding");
	const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
	return {
		ticket: `v1.${payload}.${signTicketPayload(payload, ticketSecret)}`,
		expiresAtMs: claims.expiresAtMs
	};
}
function verifyBoardViewTicket(value, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	if (!Number.isSafeInteger(nowMs) || value.length > BOARD_VIEW_TICKET_MAX_LENGTH) return;
	const parts = value.split(".");
	if (parts.length !== 3 || parts[0] !== "v1") return;
	const [, payload, signature] = parts;
	if (!payload || !signature) return;
	if (!safeEqualSecret(signature, signTicketPayload(payload, ticketSecret))) return;
	let claims;
	try {
		claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
	} catch {
		return;
	}
	if (!isValidClaims(claims) || claims.expiresAtMs <= nowMs) return;
	return claims;
}
function buildBoardWidgetFrameUrl(params) {
	return `${BOARD_HTTP_PATH_PREFIX}${encodeURIComponent(params.sessionKey)}/${encodeURIComponent(params.name)}/index.html?bt=${encodeURIComponent(params.ticket)}`;
}
//#endregion
export { verifyBoardViewTicket as a, createBoardViewTicket as i, BOARD_VIEW_TICKET_TTL_MS as n, buildBoardWidgetFrameUrl as r, BOARD_HTTP_PATH_PREFIX as t };
