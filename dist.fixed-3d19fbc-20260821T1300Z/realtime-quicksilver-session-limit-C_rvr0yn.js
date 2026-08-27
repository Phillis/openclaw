//#region extensions/openai/realtime-quicksilver-session-limit.ts
const OPENAI_QUICKSILVER_MAX_SESSIONS = 8;
const reservations = /* @__PURE__ */ new Map();
function reserveOpenAIQuicksilverSession(owner, opts) {
	const now = Date.now();
	for (const [reservedOwner, expiresAtMs] of reservations) if (expiresAtMs !== void 0 && expiresAtMs <= now) reservations.delete(reservedOwner);
	if (reservations.has(owner)) {
		reservations.set(owner, opts?.expiresAtMs);
		return;
	}
	if (reservations.size >= OPENAI_QUICKSILVER_MAX_SESSIONS) throw new Error("Too many concurrent OpenAI GPT-Live sessions; try again in a minute");
	reservations.set(owner, opts?.expiresAtMs);
}
function releaseOpenAIQuicksilverSession(owner) {
	reservations.delete(owner);
}
//#endregion
export { reserveOpenAIQuicksilverSession as n, releaseOpenAIQuicksilverSession as t };
