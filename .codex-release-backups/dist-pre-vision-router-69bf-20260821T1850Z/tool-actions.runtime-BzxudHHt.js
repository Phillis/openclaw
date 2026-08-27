import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings, y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { _ as readToolStringParam, h as readStringArrayParam, i as createActionGate, m as readReactionParams, p as readPositiveIntegerParam, t as ToolAuthorizationError } from "./common-ciEJghJz.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "./runtime-group-policy-6UJsFi-Z.js";
import { a as resolveMatrixAccountConfig, o as resolveMatrixBaseConfig } from "./account-config-BBbAX8mT.js";
import { i as resolveMatrixAccount } from "./accounts-CfCyqoAF.js";
import { r as normalizeMatrixResolvableTarget } from "./target-ids-g6UnQdM7.js";
import { n as resolveMatrixRoomConfig } from "./rooms-Dp8O_oqW.js";
import { S as resolveMatrixRoomId, _ as parsePollStart, d as buildPollResponseContent, g as isPollStartType, n as reactMatrixMessage } from "./send-suj0miew.js";
import { a as readJoinedMatrixMembers, r as isStrictDirectMembership, t as hasDirectMatrixMemberFlag } from "./direct-room-B9Jvl2Eu.js";
import { i as buildMatrixReactionRelationsPath, o as selectOwnMatrixReactionEventIds, s as summarizeMatrixReactionEvents } from "./reaction-common--NYWOOFo.js";
import { n as withResolvedRoomAction, t as withResolvedActionClient } from "./client-DY3EJ45l.js";
import { a as fetchEventSummary, c as resolveMatrixActionLimit, i as sendMatrixMessage, n as editMatrixMessage, o as readPinnedEvents, r as readMatrixMessages, s as EventType, t as deleteMatrixMessage } from "./messages-BT_nPJ3p.js";
import "./runtime-api-yu9H_0mB.js";
import { t as applyMatrixProfileUpdate } from "./profile-update-WQaT2W0h.js";
import { _ as scanMatrixVerificationQr, a as confirmMatrixVerificationSas, c as getMatrixRoomKeyBackupStatus, d as listMatrixVerifications, f as mismatchMatrixVerificationSas, h as restoreMatrixRoomKeyBackup, i as confirmMatrixVerificationReciprocateQr, l as getMatrixVerificationSas, n as bootstrapMatrixVerification, o as generateMatrixVerificationQr, p as requestMatrixVerification, r as cancelMatrixVerification, s as getMatrixEncryptionStatus, t as acceptMatrixVerification, u as getMatrixVerificationStatus, v as startMatrixVerification, y as verifyMatrixRecoveryKey } from "./verification-BDNVWjV3.js";
import { t as createMatrixRoomInfoResolver } from "./room-info-wF35ncdw.js";
//#region extensions/matrix/src/matrix/actions/polls.ts
function normalizeOptionIndexes(indexes) {
	return uniqueValues(indexes.map((index) => Math.trunc(index)).filter((index) => Number.isFinite(index) && index > 0));
}
function normalizeOptionIds(optionIds) {
	return uniqueStrings(optionIds.map((optionId) => optionId.trim()).filter((optionId) => optionId.length > 0));
}
function resolveSelectedAnswerIds(params) {
	const parsed = parsePollStart(params.pollContent);
	if (!parsed) throw new Error("Matrix poll vote requires a valid poll start event.");
	const selectedById = normalizeOptionIds(params.optionIds ?? []);
	const selectedByIndex = normalizeOptionIndexes(params.optionIndexes ?? []).map((index) => {
		const answer = parsed.answers[index - 1];
		if (!answer) throw new Error(`Matrix poll option index ${index} is out of range for a poll with ${parsed.answers.length} options.`);
		return answer.id;
	});
	const answerIds = normalizeOptionIds([...selectedById, ...selectedByIndex]);
	if (answerIds.length === 0) throw new Error("Matrix poll vote requires at least one poll option id or index.");
	if (answerIds.length > parsed.maxSelections) throw new Error(`Matrix poll allows at most ${parsed.maxSelections} selection${parsed.maxSelections === 1 ? "" : "s"}.`);
	const answerMap = new Map(parsed.answers.map((answer) => [answer.id, answer.text]));
	return {
		answerIds,
		labels: answerIds.map((answerId) => {
			const label = answerMap.get(answerId);
			if (!label) throw new Error(`Matrix poll option id "${answerId}" is not valid for poll ${parsed.question}.`);
			return label;
		}),
		maxSelections: parsed.maxSelections
	};
}
async function voteMatrixPoll(roomId, pollId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const pollEvent = await client.getEvent(resolvedRoom, pollId);
		if (!isPollStartType(typeof pollEvent.type === "string" ? pollEvent.type : "")) throw new Error(`Event ${pollId} is not a Matrix poll start event.`);
		const { answerIds, labels, maxSelections } = resolveSelectedAnswerIds({
			optionIds: [...opts.optionIds ?? [], ...opts.optionId ? [opts.optionId] : []],
			optionIndexes: [...opts.optionIndexes ?? [], ...opts.optionIndex !== void 0 ? [opts.optionIndex] : []],
			pollContent: pollEvent.content
		});
		const content = buildPollResponseContent(pollId, answerIds);
		return {
			eventId: await client.sendEvent(resolvedRoom, "m.poll.response", content) ?? null,
			roomId: resolvedRoom,
			pollId,
			answerIds,
			labels,
			maxSelections
		};
	});
}
//#endregion
//#region extensions/matrix/src/matrix/actions/reactions.ts
async function listMatrixReactionEvents(client, roomId, messageId, limit, opts = {}) {
	const events = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	while (true) {
		const res = await client.doRequest("GET", buildMatrixReactionRelationsPath(roomId, messageId), {
			dir: "b",
			limit,
			...cursor ? { from: cursor } : {}
		});
		if (Array.isArray(res.chunk)) events.push(...res.chunk);
		const nextCursor = typeof res.next_batch === "string" ? res.next_batch.trim() : "";
		if (!nextCursor || !opts.allPages && events.length >= limit) return events;
		if (seenCursors.has(nextCursor)) throw new Error("Matrix reaction pagination returned a repeated cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
}
async function listMatrixReactions(roomId, messageId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		return summarizeMatrixReactionEvents(await listMatrixReactionEvents(client, resolvedRoom, messageId, resolveMatrixActionLimit(opts.limit, 100)));
	});
}
async function removeMatrixReactions(roomId, messageId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const chunk = await listMatrixReactionEvents(client, resolvedRoom, messageId, 200, { allPages: true });
		const userId = await client.getUserId();
		if (!userId) return { removed: 0 };
		const toRemove = selectOwnMatrixReactionEventIds(chunk, userId, opts.emoji);
		if (toRemove.length === 0) return { removed: 0 };
		await Promise.all(toRemove.map((id) => client.redactEvent(resolvedRoom, id)));
		return { removed: toRemove.length };
	});
}
//#endregion
//#region extensions/matrix/src/matrix/actions/pins.ts
async function updateMatrixPins(roomId, opts, update) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const next = update(await readPinnedEvents(client, resolvedRoom));
		const payload = { pinned: next };
		await client.sendStateEvent(resolvedRoom, EventType.RoomPinnedEvents, "", payload);
		return { pinned: next };
	});
}
async function pinMatrixMessage(roomId, messageId, opts = {}) {
	return await updateMatrixPins(roomId, opts, (current) => current.includes(messageId) ? current : [...current, messageId]);
}
async function unpinMatrixMessage(roomId, messageId, opts = {}) {
	return await updateMatrixPins(roomId, opts, (current) => current.filter((id) => id !== messageId));
}
async function listMatrixPins(roomId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const pinned = await readPinnedEvents(client, resolvedRoom);
		return {
			pinned,
			events: (await Promise.all(pinned.map(async (eventId) => {
				try {
					return await fetchEventSummary(client, resolvedRoom, eventId);
				} catch {
					return null;
				}
			}))).filter((event) => Boolean(event))
		};
	});
}
//#endregion
//#region extensions/matrix/src/matrix/actions/room.ts
async function getMatrixMemberInfo(userId, opts) {
	return await withResolvedActionClient(opts, async (client) => {
		const roomId = await resolveMatrixRoomId(client, opts.roomId);
		if (!(await client.getJoinedRoomMembers(roomId)).includes(userId)) throw new Error(`User ${userId} is not a member of room ${roomId}`);
		const profile = await client.getUserProfile(userId);
		return {
			userId,
			profile: {
				displayName: profile?.displayname ?? null,
				avatarUrl: profile?.avatar_url ?? null
			},
			membership: null,
			powerLevel: null,
			displayName: profile?.displayname ?? null,
			roomId
		};
	});
}
async function getMatrixRoomInfo(roomId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		let name = null;
		let topic = null;
		let canonicalAlias = null;
		let memberCount = null;
		try {
			const nameState = await client.getRoomStateEvent(resolvedRoom, "m.room.name", "");
			name = typeof nameState?.name === "string" ? nameState.name : null;
		} catch {}
		try {
			const topicState = await client.getRoomStateEvent(resolvedRoom, EventType.RoomTopic, "");
			topic = typeof topicState?.topic === "string" ? topicState.topic : null;
		} catch {}
		try {
			const aliasState = await client.getRoomStateEvent(resolvedRoom, "m.room.canonical_alias", "");
			canonicalAlias = typeof aliasState?.alias === "string" ? aliasState.alias : null;
		} catch {}
		try {
			memberCount = (await client.getJoinedRoomMembers(resolvedRoom)).length;
		} catch {}
		return {
			roomId: resolvedRoom,
			name,
			topic,
			canonicalAlias,
			altAliases: [],
			memberCount
		};
	});
}
//#endregion
//#region extensions/matrix/src/matrix/read-policy.ts
function normalizeRoomId(raw) {
	return raw?.trim().replace(/^room:/i, "") ?? "";
}
function isCurrentRoom(params) {
	return params.context?.currentChannelProvider?.trim().toLowerCase() === "matrix" && params.context.requesterAccountId?.trim() === params.accountId && normalizeRoomId(params.context.currentChannelId) === normalizeRoomId(params.roomId);
}
function includesEntry(entries, value) {
	const normalized = value.trim().toLowerCase();
	return (entries ?? []).some((entry) => {
		const candidate = String(entry).replace(/^matrix:/i, "").trim().toLowerCase();
		return candidate === "*" || candidate === normalized;
	});
}
function hasWildcardEntry(entries) {
	return (entries ?? []).some((entry) => String(entry).replace(/^matrix:/i, "").trim() === "*");
}
function resolveMatrixReadRoomPolicy(params) {
	const room = resolveMatrixRoomConfig({
		rooms: params.account.config.groups ?? params.account.config.rooms,
		roomId: params.roomId,
		aliases: params.aliases
	});
	const baseRoom = resolveMatrixRoomConfig({
		rooms: params.baseConfig.groups ?? params.baseConfig.rooms,
		roomId: params.roomId,
		aliases: params.aliases
	});
	const baseRoomAccount = baseRoom.config?.account;
	const explicitlyScopedToAnotherAccount = room.config === void 0 && baseRoom.matchSource === "direct" && typeof baseRoomAccount === "string" && normalizeAccountId(baseRoomAccount) !== params.account.accountId;
	const accountMatches = !room.config?.account || room.config.account === params.account.accountId;
	const configuredRoomBlocked = room.config !== void 0 && (!room.allowed || !accountMatches);
	return {
		blocked: explicitlyScopedToAnotherAccount || configuredRoomBlocked,
		blockedBeforeProviderAccess: explicitlyScopedToAnotherAccount || room.matchSource === "direct" && configuredRoomBlocked,
		room
	};
}
async function classifyMatrixReadRoom(params) {
	const members = await readJoinedMatrixMembers(params.client, params.roomId);
	if (!members) return { kind: "unknown" };
	if (members.length >= 3) return { kind: "group" };
	if (members.length !== 2) return { kind: "unknown" };
	const selfUserId = await params.client.getUserId().catch(() => null);
	if (!selfUserId || !members.includes(selfUserId)) return { kind: "unknown" };
	const remoteUserId = members.find((member) => member !== selfUserId);
	if (!isStrictDirectMembership({
		selfUserId,
		remoteUserId,
		joinedMembers: members
	}) || !remoteUserId) return { kind: "unknown" };
	const memberStateFlag = await hasDirectMatrixMemberFlag(params.client, params.roomId, selfUserId);
	await params.client.dms.update().catch(() => false);
	if (memberStateFlag === true || params.client.dms.isDm(params.roomId)) return {
		kind: "direct",
		remoteUserId
	};
	return memberStateFlag === false ? { kind: "group" } : { kind: "unknown" };
}
async function withAuthorizedMatrixReadTarget(params) {
	const account = resolveMatrixAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const baseConfig = resolveMatrixBaseConfig(params.cfg);
	if (resolveMatrixReadRoomPolicy({
		account,
		baseConfig,
		roomId: normalizeMatrixResolvableTarget(params.roomId),
		aliases: []
	}).blockedBeforeProviderAccess) throw new ToolAuthorizationError("Matrix read target is not allowed.");
	return await withResolvedActionClient(params.opts, async (client) => {
		const roomId = await resolveMatrixRoomId(client, params.roomId);
		const inputAlias = params.roomId.trim().startsWith("#") ? params.roomId.trim() : void 0;
		const { getRoomInfo } = createMatrixRoomInfoResolver(client);
		const roomInfo = await getRoomInfo(roomId, { includeAliases: true });
		const mutableRoomName = account.config.dangerouslyAllowNameMatching === true ? roomInfo.name : void 0;
		const aliases = [
			inputAlias,
			roomInfo.canonicalAlias,
			...roomInfo.altAliases,
			mutableRoomName
		].filter((value) => Boolean(value));
		const finalPolicy = resolveMatrixReadRoomPolicy({
			account,
			baseConfig,
			roomId,
			aliases
		});
		const room = finalPolicy.room;
		const current = isCurrentRoom({
			accountId: account.accountId,
			context: params.context,
			roomId
		});
		const currentChatType = params.context?.currentChatType?.trim().toLowerCase();
		const trustedCurrentClassification = currentChatType === "direct" ? {
			kind: "direct",
			remoteUserId: ""
		} : currentChatType === "group" || currentChatType === "channel" ? { kind: "group" } : null;
		const classification = room.matchSource === "direct" ? { kind: "group" } : current && trustedCurrentClassification ? trustedCurrentClassification : await classifyMatrixReadRoom({
			client,
			roomId
		});
		const resolvedGroupPolicy = resolveAllowlistProviderRuntimeGroupPolicy({
			providerConfigPresent: params.cfg.channels?.matrix !== void 0,
			groupPolicy: account.config.groupPolicy,
			defaultGroupPolicy: resolveDefaultGroupPolicy(params.cfg)
		}).groupPolicy;
		const groupPolicy = account.config.allowlistOnly && resolvedGroupPolicy === "open" ? "allowlist" : resolvedGroupPolicy;
		const dmPolicy = account.config.allowlistOnly ? account.config.dm?.policy === "disabled" ? "disabled" : "allowlist" : account.config.dm?.policy ?? "pairing";
		const directOperator = params.context?.conversationReadOrigin === "direct-operator";
		if (!(finalPolicy.blocked ? false : directOperator ? classification.kind === "direct" ? account.config.dm?.enabled !== false && dmPolicy !== "disabled" : classification.kind === "group" ? groupPolicy !== "disabled" : groupPolicy !== "disabled" && dmPolicy !== "disabled" && account.config.dm?.enabled !== false : classification.kind === "direct" ? account.config.dm?.enabled !== false && dmPolicy !== "disabled" && (current || includesEntry(account.config.dm?.allowFrom, classification.remoteUserId)) : classification.kind === "group" ? groupPolicy !== "disabled" && (current || groupPolicy === "open" || room.config !== void 0) : current ? groupPolicy !== "disabled" && dmPolicy !== "disabled" && account.config.dm?.enabled !== false : groupPolicy === "open" && dmPolicy !== "disabled" && account.config.dm?.enabled !== false && hasWildcardEntry(account.config.dm?.allowFrom))) throw new ToolAuthorizationError("Matrix read target is not allowed.");
		return await params.run({
			client,
			roomId
		});
	});
}
//#endregion
//#region extensions/matrix/src/tool-actions.ts
const messageActions = /* @__PURE__ */ new Set([
	"sendMessage",
	"editMessage",
	"deleteMessage",
	"readMessages"
]);
const reactionActions = /* @__PURE__ */ new Set(["react", "reactions"]);
const pinActions = /* @__PURE__ */ new Set([
	"pinMessage",
	"unpinMessage",
	"listPins"
]);
const pollActions = /* @__PURE__ */ new Set(["pollVote"]);
const profileActions = /* @__PURE__ */ new Set(["setProfile"]);
const verificationActions = /* @__PURE__ */ new Set([
	"encryptionStatus",
	"verificationList",
	"verificationRequest",
	"verificationAccept",
	"verificationCancel",
	"verificationStart",
	"verificationGenerateQr",
	"verificationScanQr",
	"verificationSas",
	"verificationConfirm",
	"verificationMismatch",
	"verificationConfirmQr",
	"verificationStatus",
	"verificationBootstrap",
	"verificationRecoveryKey",
	"verificationBackupStatus",
	"verificationBackupRestore"
]);
function projectMatrixMessagesForDisplay(messages) {
	return messages.map((message) => ({
		...message,
		...message.eventId ? { id: message.eventId } : {},
		...message.sender ? { authorTag: message.sender } : {},
		...message.body !== void 0 ? { content: message.body } : {},
		...typeof message.timestamp === "number" && Number.isFinite(message.timestamp) && Math.abs(message.timestamp) <= 864e13 ? { ts: new Date(message.timestamp).toISOString() } : {}
	}));
}
function readRoomId(params, required = true) {
	const direct = readToolStringParam(params, "roomId") ?? readToolStringParam(params, "channelId");
	if (direct) return direct;
	if (!required) return readToolStringParam(params, "to") ?? "";
	return readToolStringParam(params, "to", { required: true });
}
function toSnakeCaseKey(key) {
	return normalizeOptionalLowercaseString(key.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2"));
}
function readRawParam(params, key) {
	if (Object.hasOwn(params, key)) return params[key];
	const snakeKey = toSnakeCaseKey(key);
	if (snakeKey !== key && Object.hasOwn(params, snakeKey)) return params[snakeKey];
}
function readStringAliasParam(params, keys, options = {}) {
	for (const key of keys) {
		const raw = readRawParam(params, key);
		if (typeof raw !== "string") continue;
		const trimmed = raw.trim();
		if (trimmed) return trimmed;
	}
	if (options.required) throw new Error(`${keys[0]} required`);
}
function readPositiveIntegerArrayParam(params, key) {
	const raw = readRawParam(params, key);
	if (raw == null) return [];
	return (Array.isArray(raw) ? raw : [raw]).flatMap((value) => {
		if (value == null || value === "") return [];
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!trimmed) return [];
			if (!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(trimmed)) return [];
		}
		const index = readPositiveIntegerParam({ [key]: value }, key, { message: `${key} must contain positive integers.` });
		return index === void 0 ? [] : [index];
	});
}
async function handleMatrixAction(params, cfg, opts = {}) {
	const action = readToolStringParam(params, "action", { required: true });
	const accountId = readToolStringParam(params, "accountId") ?? void 0;
	const isActionEnabled = createActionGate(resolveMatrixAccountConfig({
		cfg,
		accountId
	}).actions);
	const clientOpts = {
		cfg,
		...accountId ? { accountId } : {}
	};
	const withReadTarget = async (roomId, run) => await withAuthorizedMatrixReadTarget({
		cfg,
		accountId,
		roomId,
		context: opts.readContext,
		opts: clientOpts,
		run
	});
	if (reactionActions.has(action)) {
		if (!isActionEnabled("reactions")) throw new Error("Matrix reactions are disabled.");
		const roomId = readRoomId(params);
		const messageId = readToolStringParam(params, "messageId", { required: true });
		if (action === "react") {
			const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a Matrix reaction." });
			if (remove || isEmpty) return jsonResult({
				ok: true,
				removed: (await withReadTarget(roomId, async (target) => {
					return await removeMatrixReactions(target.roomId, messageId, {
						...clientOpts,
						client: target.client,
						emoji: remove ? emoji : void 0
					});
				})).removed
			});
			await withReadTarget(roomId, async (target) => {
				await reactMatrixMessage(target.roomId, messageId, emoji, {
					...clientOpts,
					client: target.client
				});
			});
			return jsonResult({
				ok: true,
				added: emoji
			});
		}
		const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." });
		return jsonResult({
			ok: true,
			reactions: await withReadTarget(roomId, async (target) => {
				return await listMatrixReactions(target.roomId, messageId, {
					...clientOpts,
					client: target.client,
					limit: limit ?? void 0
				});
			})
		});
	}
	if (pollActions.has(action)) {
		const roomId = readRoomId(params);
		const pollId = readStringAliasParam(params, ["pollId", "messageId"], { required: true });
		if (!pollId) throw new Error("pollId required");
		const optionId = readToolStringParam(params, "pollOptionId");
		const optionIndex = readPositiveIntegerParam(params, "pollOptionIndex", { message: "pollOptionIndex must be a positive integer." });
		const optionIds = [...readStringArrayParam(params, "pollOptionIds") ?? [], ...optionId ? [optionId] : []];
		const optionIndexes = [...readPositiveIntegerArrayParam(params, "pollOptionIndexes"), ...optionIndex !== void 0 ? [optionIndex] : []];
		return jsonResult({
			ok: true,
			result: await withReadTarget(roomId, async (target) => {
				return await voteMatrixPoll(target.roomId, pollId, {
					...clientOpts,
					client: target.client,
					optionIds,
					optionIndexes
				});
			})
		});
	}
	if (messageActions.has(action)) {
		if (!isActionEnabled("messages")) throw new Error("Matrix messages are disabled.");
		switch (action) {
			case "sendMessage": {
				const to = readToolStringParam(params, "to", { required: true });
				const mediaUrl = readToolStringParam(params, "mediaUrl", { trim: false }) ?? readToolStringParam(params, "media", { trim: false }) ?? readToolStringParam(params, "filePath", { trim: false }) ?? readToolStringParam(params, "path", { trim: false });
				const content = readToolStringParam(params, "content", {
					required: !mediaUrl,
					allowEmpty: true,
					trim: false
				});
				const replyToId = readToolStringParam(params, "replyToId") ?? readToolStringParam(params, "replyTo");
				const threadId = readToolStringParam(params, "threadId");
				const audioAsVoice = typeof readRawParam(params, "audioAsVoice") === "boolean" ? readRawParam(params, "audioAsVoice") : typeof readRawParam(params, "asVoice") === "boolean" ? readRawParam(params, "asVoice") : void 0;
				return jsonResult({
					ok: true,
					result: await sendMatrixMessage(to, content, {
						mediaUrl: mediaUrl ?? void 0,
						...opts.mediaAccess ? { mediaAccess: opts.mediaAccess } : {},
						mediaLocalRoots: opts.mediaLocalRoots,
						replyToId: replyToId ?? void 0,
						threadId: threadId ?? void 0,
						audioAsVoice,
						...clientOpts
					})
				});
			}
			case "editMessage": {
				const roomId = readRoomId(params);
				const messageId = readToolStringParam(params, "messageId", { required: true });
				const content = readToolStringParam(params, "content", {
					required: true,
					trim: false
				});
				return jsonResult({
					ok: true,
					result: await withReadTarget(roomId, async (target) => {
						return await editMatrixMessage(target.roomId, messageId, content, {
							...clientOpts,
							client: target.client
						});
					})
				});
			}
			case "deleteMessage": {
				const roomId = readRoomId(params);
				const messageId = readToolStringParam(params, "messageId", { required: true });
				const reason = readToolStringParam(params, "reason");
				await withReadTarget(roomId, async (target) => {
					await deleteMatrixMessage(target.roomId, messageId, {
						reason: reason ?? void 0,
						...clientOpts,
						client: target.client
					});
				});
				return jsonResult({
					ok: true,
					deleted: true
				});
			}
			case "readMessages": {
				const roomId = readRoomId(params);
				const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." });
				const before = readToolStringParam(params, "before");
				const after = readToolStringParam(params, "after");
				const threadId = readToolStringParam(params, "threadId");
				return jsonResult({
					ok: true,
					...await withReadTarget(roomId, async (target) => {
						const messages = await readMatrixMessages(target.roomId, {
							limit: limit ?? void 0,
							before: before ?? void 0,
							after: after ?? void 0,
							threadId: threadId ?? void 0,
							...clientOpts,
							client: target.client
						});
						return {
							...messages,
							messages: projectMatrixMessagesForDisplay(messages.messages),
							roomId: target.roomId,
							...threadId ? { threadId } : {}
						};
					})
				});
			}
			default: break;
		}
	}
	if (pinActions.has(action)) {
		if (!isActionEnabled("pins")) throw new Error("Matrix pins are disabled.");
		const roomId = readRoomId(params);
		const request = action === "pinMessage" ? {
			kind: "pin",
			messageId: readToolStringParam(params, "messageId", { required: true })
		} : action === "unpinMessage" ? {
			kind: "unpin",
			messageId: readToolStringParam(params, "messageId", { required: true })
		} : { kind: "list" };
		return await withReadTarget(roomId, async (target) => {
			const actionOpts = {
				...clientOpts,
				client: target.client
			};
			if (request.kind === "pin") return jsonResult({
				ok: true,
				pinned: (await pinMatrixMessage(target.roomId, request.messageId, actionOpts)).pinned
			});
			if (request.kind === "unpin") return jsonResult({
				ok: true,
				pinned: (await unpinMatrixMessage(target.roomId, request.messageId, actionOpts)).pinned
			});
			const result = await listMatrixPins(target.roomId, actionOpts);
			return jsonResult({
				ok: true,
				pinned: result.pinned,
				events: result.events,
				pins: projectMatrixMessagesForDisplay(result.events)
			});
		});
	}
	if (profileActions.has(action)) {
		if (!isActionEnabled("profile")) throw new Error("Matrix profile updates are disabled.");
		const avatarPath = readToolStringParam(params, "avatarPath") ?? readToolStringParam(params, "path") ?? readToolStringParam(params, "filePath");
		return jsonResult({
			ok: true,
			...await applyMatrixProfileUpdate({
				cfg,
				account: accountId,
				displayName: readToolStringParam(params, "displayName") ?? readToolStringParam(params, "name"),
				avatarUrl: readToolStringParam(params, "avatarUrl"),
				avatarPath,
				mediaLocalRoots: opts.mediaLocalRoots
			})
		});
	}
	if (action === "memberInfo") {
		if (!isActionEnabled("memberInfo")) throw new Error("Matrix member info is disabled.");
		const userId = readToolStringParam(params, "userId", { required: true });
		return jsonResult({
			ok: true,
			member: await withReadTarget(readRoomId(params), async (target) => {
				return await getMatrixMemberInfo(userId, {
					roomId: target.roomId,
					...clientOpts,
					client: target.client
				});
			})
		});
	}
	if (action === "channelInfo") {
		if (!isActionEnabled("channelInfo")) throw new Error("Matrix room info is disabled.");
		return jsonResult({
			ok: true,
			room: await withReadTarget(readRoomId(params), async (target) => {
				return await getMatrixRoomInfo(target.roomId, {
					...clientOpts,
					client: target.client
				});
			})
		});
	}
	if (verificationActions.has(action)) {
		if (!isActionEnabled("verification")) throw new Error("Matrix verification actions are disabled.");
		const requestId = readToolStringParam(params, "requestId") ?? readToolStringParam(params, "verificationId") ?? readToolStringParam(params, "id");
		if (action === "encryptionStatus") return jsonResult({
			ok: true,
			status: await getMatrixEncryptionStatus({
				includeRecoveryKey: params.includeRecoveryKey === true,
				...clientOpts
			})
		});
		if (action === "verificationStatus") return jsonResult({
			ok: true,
			status: await getMatrixVerificationStatus({
				includeRecoveryKey: params.includeRecoveryKey === true,
				...clientOpts
			})
		});
		if (action === "verificationBootstrap") {
			const result = await bootstrapMatrixVerification({
				recoveryKey: readToolStringParam(params, "recoveryKey", { trim: false }) ?? readToolStringParam(params, "key", { trim: false }) ?? void 0,
				forceResetCrossSigning: params.forceResetCrossSigning === true,
				...clientOpts
			});
			return jsonResult({
				ok: result.success,
				result
			});
		}
		if (action === "verificationRecoveryKey") {
			const result = await verifyMatrixRecoveryKey(readToolStringParam({ recoveryKey: readToolStringParam(params, "recoveryKey", { trim: false }) ?? readToolStringParam(params, "key", { trim: false }) }, "recoveryKey", {
				required: true,
				trim: false
			}), clientOpts);
			return jsonResult({
				ok: result.success,
				result
			});
		}
		if (action === "verificationBackupStatus") return jsonResult({
			ok: true,
			status: await getMatrixRoomKeyBackupStatus(clientOpts)
		});
		if (action === "verificationBackupRestore") {
			const result = await restoreMatrixRoomKeyBackup({
				recoveryKey: readToolStringParam(params, "recoveryKey", { trim: false }) ?? readToolStringParam(params, "key", { trim: false }) ?? void 0,
				...clientOpts
			});
			return jsonResult({
				ok: result.success,
				result
			});
		}
		if (action === "verificationList") return jsonResult({
			ok: true,
			verifications: await listMatrixVerifications(clientOpts)
		});
		if (action === "verificationRequest") {
			const userId = readToolStringParam(params, "userId");
			const deviceId = readToolStringParam(params, "deviceId");
			const roomId = readToolStringParam(params, "roomId") ?? readToolStringParam(params, "channelId");
			return jsonResult({
				ok: true,
				verification: await requestMatrixVerification({
					ownUser: typeof params.ownUser === "boolean" ? params.ownUser : void 0,
					userId: userId ?? void 0,
					deviceId: deviceId ?? void 0,
					roomId: roomId ?? void 0,
					...clientOpts
				})
			});
		}
		if (action === "verificationAccept") return jsonResult({
			ok: true,
			verification: await acceptMatrixVerification(readToolStringParam({ requestId }, "requestId", { required: true }), clientOpts)
		});
		if (action === "verificationCancel") {
			const reason = readToolStringParam(params, "reason");
			const code = readToolStringParam(params, "code");
			return jsonResult({
				ok: true,
				verification: await cancelMatrixVerification(readToolStringParam({ requestId }, "requestId", { required: true }), {
					reason: reason ?? void 0,
					code: code ?? void 0,
					...clientOpts
				})
			});
		}
		if (action === "verificationStart") {
			const method = normalizeOptionalLowercaseString(readToolStringParam(params, "method"));
			if (method && method !== "sas") throw new Error("Matrix verificationStart only supports method=sas; use verificationGenerateQr/verificationScanQr for QR flows.");
			return jsonResult({
				ok: true,
				verification: await startMatrixVerification(readToolStringParam({ requestId }, "requestId", { required: true }), {
					method: "sas",
					...clientOpts
				})
			});
		}
		if (action === "verificationGenerateQr") return jsonResult({
			ok: true,
			...await generateMatrixVerificationQr(readToolStringParam({ requestId }, "requestId", { required: true }), clientOpts)
		});
		if (action === "verificationScanQr") {
			const qrDataBase64 = readToolStringParam(params, "qrDataBase64") ?? readToolStringParam(params, "qrData") ?? readToolStringParam(params, "qr");
			return jsonResult({
				ok: true,
				verification: await scanMatrixVerificationQr(readToolStringParam({ requestId }, "requestId", { required: true }), readToolStringParam({ qrDataBase64 }, "qrDataBase64", { required: true }), clientOpts)
			});
		}
		if (action === "verificationSas") return jsonResult({
			ok: true,
			sas: await getMatrixVerificationSas(readToolStringParam({ requestId }, "requestId", { required: true }), clientOpts)
		});
		if (action === "verificationConfirm") return jsonResult({
			ok: true,
			verification: await confirmMatrixVerificationSas(readToolStringParam({ requestId }, "requestId", { required: true }), clientOpts)
		});
		if (action === "verificationMismatch") return jsonResult({
			ok: true,
			verification: await mismatchMatrixVerificationSas(readToolStringParam({ requestId }, "requestId", { required: true }), clientOpts)
		});
		if (action === "verificationConfirmQr") return jsonResult({
			ok: true,
			verification: await confirmMatrixVerificationReciprocateQr(readToolStringParam({ requestId }, "requestId", { required: true }), clientOpts)
		});
	}
	throw new Error(`Unsupported Matrix action: ${action}`);
}
//#endregion
export { handleMatrixAction };
