import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { a as upsertSessionUpstreamLink, t as deleteSessionUpstreamLink } from "./session-upstream-links-s8R05hU4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { _ as sessionBindingIdentity } from "./session-binding-BKWA8Z6K.js";
import { u as readVisibleSessionTranscriptMessageEntries } from "./session-transcript-runtime-BrQue-7k.js";
import { r as assertCodexThreadForkResponse } from "./protocol-validators-DQMpwHD0.js";
import "./incognito-session-DoO9V_or.js";
import "./session-catalog-BUkkJEWz.js";
import { i as createImportedCodexSession, n as codexUpstreamBaseline, t as codexLastTerminalTurnId } from "./session-upstream-marker-DWj_-nSO.js";
//#region extensions/codex/src/app-server/upstream-fork-boundary.ts
const TURN_PAGE_LIMIT = 100;
function failure(code, message) {
	return {
		ok: false,
		code,
		message
	};
}
function asInputs(item) {
	return Array.isArray(item.content) ? item.content : [];
}
function userMessageDisplay(item) {
	let text = "";
	let hasTextElement = false;
	let hasImage = false;
	let hasUnverifiableInput = false;
	for (const input of asInputs(item)) if (input.type === "text") {
		if (typeof input.text === "string") text += input.text;
		hasTextElement ||= Array.isArray(input.textElements) && input.textElements.length > 0;
	} else {
		hasUnverifiableInput = true;
		hasImage ||= input.type === "image" || input.type === "localImage";
	}
	return {
		text,
		visible: Boolean(text.trim()) || hasTextElement || hasImage,
		hasUnverifiableInput
	};
}
function isHiddenNestedReviewTurn(previous, turn) {
	if (previous?.status !== "completed" || turn.status !== "interrupted" || turn.completedAt != null || !previous.items.some((item) => item.type === "enteredReviewMode") || !previous.items.some((item) => item.type === "exitedReviewMode")) return false;
	const userMessages = turn.items.filter((item) => item.type === "userMessage");
	const [firstUserMessage, secondUserMessage] = userMessages;
	if (!firstUserMessage || !secondUserMessage || userMessages.length !== 2) return false;
	return JSON.stringify(asInputs(firstUserMessage)) === JSON.stringify(asInputs(secondUserMessage));
}
function localMessageText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	const texts = [];
	for (const block of content) {
		if (!block || typeof block !== "object" || Array.isArray(block)) return;
		const typed = block;
		if (typed.type !== "text" || typeof typed.text !== "string") return;
		texts.push(typed.text);
	}
	return texts.join("");
}
function resolveCodexUpstreamForkBoundaryFromTurns(params) {
	let visibleUserMessagesSeen = 0;
	let reviewMode = false;
	for (const [turnIndex, turn] of params.turns.entries()) {
		const hiddenNestedReviewTurn = isHiddenNestedReviewTurn(params.turns[turnIndex - 1], turn);
		let userMessagesInTurn = 0;
		for (const item of turn.items) {
			if (item.type === "enteredReviewMode") {
				reviewMode = true;
				continue;
			}
			if (item.type === "exitedReviewMode") {
				reviewMode = false;
				continue;
			}
			if (item.type !== "userMessage") continue;
			const isSteer = userMessagesInTurn > 0;
			userMessagesInTurn += 1;
			if (reviewMode || hiddenNestedReviewTurn) continue;
			const display = userMessageDisplay(item);
			if (display.hasUnverifiableInput) return failure("drift-mismatch", "A message before the fork point contains images or attachments that cannot be verified across OpenClaw and Codex. Fork from a text-only span instead.");
			if (!display.visible) continue;
			const ordinal = visibleUserMessagesSeen;
			if (ordinal > params.userMessageOrdinal) break;
			const localText = params.localPrefixTexts[ordinal];
			if (localText === void 0) return failure("drift-mismatch", "A message before the fork point contains images or attachments that cannot be verified across OpenClaw and Codex. Fork from a text-only span instead.");
			if (display.text !== localText) return failure("drift-mismatch", "The local conversation no longer matches the Codex thread. Refresh the session and try again.");
			if (ordinal !== params.userMessageOrdinal) {
				visibleUserMessagesSeen += 1;
				continue;
			}
			if (isSteer) return failure("steer-message", "This message steered an existing Codex turn and cannot be forked independently. Fork from the turn's first message instead.");
			if (turn.status === "inProgress") return failure("in-progress-turn", "This Codex turn is still in progress. Wait for it to finish, then try forking again.");
			const retained = turnIndex > 0 ? params.turns[turnIndex - 1] : void 0;
			return {
				ok: true,
				boundary: {
					beforeTurnId: turn.id,
					targetTurnId: turn.id,
					retainedMarker: retained ? {
						turnId: retained.id,
						userMessageCount: retained.items.filter((retainedItem) => retainedItem.type === "userMessage").length
					} : {
						turnId: null,
						userMessageCount: 0
					}
				}
			};
		}
	}
	return failure("drift-mismatch", "The message could not be matched to the Codex thread. Refresh the session and try again.");
}
async function listCodexUpstreamTurns(control, threadId) {
	const turns = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	for (;;) {
		const page = await control.listTurnPage({
			threadId,
			limit: TURN_PAGE_LIMIT,
			sortDirection: "asc",
			itemsView: "full",
			...cursor ? { cursor } : {}
		});
		turns.push(...page.data);
		const nextCursor = page.nextCursor?.trim() || void 0;
		if (!nextCursor) return turns;
		if (seenCursors.has(nextCursor)) throw new Error("Codex returned a repeated thread/turns/list cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
}
async function resolveCodexUpstreamForkBoundary(params) {
	try {
		if ((await params.control.readThread(params.threadId, false)).historyMode === "paginated") return failure("upstream-unavailable", "This Codex thread uses paginated history, which cannot be forked from OpenClaw yet.");
		const visibleUserEntries = (await readVisibleSessionTranscriptMessageEntries({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		})).filter((entry) => entry.role === "user");
		const userMessageOrdinal = visibleUserEntries.findIndex((entry) => entry.entryId === params.entryId);
		if (userMessageOrdinal < 0) return failure("drift-mismatch", "The local message could not be mapped to the Codex thread. Refresh the session and try again.");
		const localPrefixTexts = visibleUserEntries.slice(0, userMessageOrdinal + 1).map((entry) => localMessageText("content" in entry.message ? entry.message.content : void 0));
		const resolved = resolveCodexUpstreamForkBoundaryFromTurns({
			turns: await listCodexUpstreamTurns(params.control, params.threadId),
			userMessageOrdinal,
			localPrefixTexts
		});
		return resolved.ok ? {
			...resolved,
			editorText: localPrefixTexts[userMessageOrdinal]
		} : resolved;
	} catch {
		return failure("upstream-unavailable", "The Codex thread could not be read. Check that Codex is available, then try again.");
	}
}
function precheckCodexUpstreamForkBoundary(params) {
	const target = params.turns.find((turn) => turn.id === params.boundary.targetTurnId);
	if (!target) return failure("upstream-unavailable", "The Codex thread changed before it could be forked. Refresh the session and try again.");
	if (target.status === "inProgress") return failure("in-progress-turn", "This Codex turn is still in progress. Wait for it to finish, then try forking again.");
	return {
		ok: true,
		boundary: params.boundary
	};
}
//#endregion
//#region extensions/codex/src/app-server/upstream-session-fork.ts
function readConnectionFingerprint(ref) {
	if (!isRecord(ref)) return;
	return typeof ref.connectionFingerprint === "string" && ref.connectionFingerprint.trim() ? ref.connectionFingerprint : void 0;
}
function normalizeTurnId(value) {
	return normalizeOptionalString(value);
}
async function forkCodexUpstreamSession(params, options) {
	try {
		return await options.control.withPinnedConnection(async (control) => {
			const incognito = isIncognitoSessionKey(params.targetKey);
			const clientId = control.clientId?.trim();
			if (incognito && !clientId) throw new Error("Incognito Codex forks require the live pinned app-server client");
			let linked = false;
			let bindingIdentity;
			const compensateFork = async (forkedThreadId) => {
				if (bindingIdentity) await options.bindingStore.mutate(bindingIdentity, {
					kind: "clear",
					threadId: forkedThreadId
				}).catch(() => void 0);
				if (linked) deleteSessionUpstreamLink(params.targetKey, params.source.agentId);
				await control.archiveThread(forkedThreadId).catch(() => void 0);
			};
			const sourceFingerprint = readConnectionFingerprint(params.upstream.ref);
			if (params.upstream.kind !== "codex-app-server" || !sourceFingerprint || sourceFingerprint !== control.connectionFingerprint) return {
				status: "failed",
				code: "upstream-unavailable",
				message: "This Codex thread is not available on the current connection. Reconnect to its host and try again."
			};
			const resolved = await resolveCodexUpstreamForkBoundary({
				...params.source,
				threadId: params.upstream.threadId,
				control
			});
			if (!resolved.ok) return {
				status: "failed",
				code: resolved.code,
				message: resolved.message
			};
			const liveTurns = await listCodexUpstreamTurns(control, params.upstream.threadId);
			const precheck = precheckCodexUpstreamForkBoundary({
				boundary: resolved.boundary,
				turns: liveTurns
			});
			if (!precheck.ok) return {
				status: "failed",
				code: precheck.code,
				message: precheck.message
			};
			const rawResponse = await control.forkThread({
				threadId: params.upstream.threadId,
				beforeTurnId: resolved.boundary.beforeTurnId,
				...incognito ? { ephemeral: true } : {},
				excludeTurns: !incognito
			});
			let response;
			try {
				response = assertCodexThreadForkResponse(rawResponse);
			} catch (error) {
				const orphanThreadId = isRecord(rawResponse.thread) && typeof rawResponse.thread.id === "string" ? rawResponse.thread.id.trim() : "";
				if (orphanThreadId && orphanThreadId !== params.upstream.threadId) await control.archiveThread(orphanThreadId).catch(() => void 0);
				throw error;
			}
			const threadId = response.thread.id.trim();
			if (!threadId) throw new Error("Codex thread/fork response did not include a thread id");
			if (threadId === params.upstream.threadId) throw new Error("Codex thread/fork response reused the source thread id");
			const forkedThreadId = threadId;
			try {
				const connectionFingerprint = control.connectionFingerprint;
				if (!connectionFingerprint) throw new Error("Codex fork connection did not include a fingerprint");
				const forkedTurns = incognito ? response.thread.turns ?? [] : await listCodexUpstreamTurns(control, threadId);
				const expectedLastTurnId = resolved.boundary.retainedMarker.turnId;
				if ((forkedTurns.at(-1)?.id ?? null) !== expectedLastTurnId) {
					await compensateFork(forkedThreadId);
					return {
						status: "failed",
						code: "upstream-unavailable",
						message: "This Codex version does not support message-level forks. Update Codex, reconnect, and try again."
					};
				}
				const forkedThread = {
					...response.thread,
					turns: forkedTurns
				};
				const throughTurnId = codexLastTerminalTurnId(forkedThread, normalizeTurnId) ?? null;
				const marker = codexUpstreamBaseline(forkedThread, normalizeTurnId);
				const config = options.resolveConfig?.() ?? {};
				return {
					status: "created",
					key: (await createImportedCodexSession({
						runtime: options.runtime,
						config,
						key: params.targetKey,
						agentId: params.source.agentId,
						thread: forkedThread,
						throughTurnId,
						initialEntry: {
							agentHarnessId: options.harnessRuntimeId,
							modelSelectionLocked: true
						},
						afterImport: async (entry) => {
							bindingIdentity = sessionBindingIdentity({
								agentId: entry.agentId,
								sessionId: entry.sessionId,
								sessionKey: entry.key,
								config
							});
							linked = upsertSessionUpstreamLink({
								sessionKey: entry.key,
								agentId: entry.agentId,
								catalogId: params.upstream.catalogId,
								hostId: params.upstream.hostId,
								threadId,
								upstreamKind: params.upstream.kind,
								upstreamRef: {
									connectionFingerprint,
									threadId
								},
								marker
							});
							if (!linked) throw new Error("Codex fork link could not be persisted");
							if (!await options.bindingStore.mutate(bindingIdentity, {
								kind: "set",
								binding: {
									threadId,
									...incognito && clientId ? { clientId } : {},
									cwd: forkedThread.cwd ?? "",
									model: response.model,
									modelProvider: response.modelProvider ?? void 0,
									historyCoveredThrough: (/* @__PURE__ */ new Date()).toISOString()
								}
							})) throw new Error("Codex session binding changed before the fork could be attached");
							return { pluginExtensions: entry.entry.pluginExtensions };
						}
					})).key,
					...resolved.editorText !== void 0 ? { editorText: resolved.editorText } : {}
				};
			} catch {
				await compensateFork(forkedThreadId);
				return {
					status: "failed",
					code: "upstream-unavailable",
					message: "The Codex fork could not be verified or imported into a new session. Refresh sessions and try again."
				};
			}
		});
	} catch {
		return {
			status: "failed",
			code: "upstream-unavailable",
			message: "The Codex thread could not be forked. Check that Codex is available, then try again."
		};
	}
}
//#endregion
export { forkCodexUpstreamSession };
