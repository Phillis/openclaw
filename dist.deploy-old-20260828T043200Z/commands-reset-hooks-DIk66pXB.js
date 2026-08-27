import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import "./agent-scope-DigoIwHb.js";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { w as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { D as selectSessionTranscriptLeafControlledPath } from "./session-transcript-index-DtVCy6vi.js";
import "./session-accessor-B-FKZX9M.js";
import { b as loadTranscriptEvents } from "./session-accessor.sqlite-transcript-store-Bx_F0DmJ.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CWpWIBkz.js";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks--fsrYuTN.js";
//#region src/auto-reply/reply/commands-reset-hooks.ts
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply.runtime.js"));
function loadRouteReplyRuntime() {
	return routeReplyRuntimeLoader.load();
}
function parseTranscriptMessages(entries) {
	return (selectSessionTranscriptLeafControlledPath(entries) ?? entries).flatMap((entry) => {
		if (entry && typeof entry === "object" && !Array.isArray(entry) && entry.type === "message" && entry.message) return [entry.message];
		return [];
	});
}
async function loadBeforeResetTranscript(params) {
	if (!params.sessionId || !params.sessionKey || !params.storePath) {
		logVerbose("before_reset: no session identity available, firing hook with empty messages");
		return {
			sessionFile: params.sessionFile,
			messages: []
		};
	}
	try {
		return {
			sessionFile: params.sessionFile,
			messages: parseTranscriptMessages(await loadTranscriptEvents({
				...params.agentId ? { agentId: params.agentId } : {},
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}))
		};
	} catch (err) {
		logVerbose(`before_reset: failed to read transcript identity ${params.sessionKey}/${params.sessionId}; firing hook with empty messages (${String(err)})`);
		return {
			sessionFile: params.sessionFile,
			messages: []
		};
	}
}
async function emitResetCommandHooks(params) {
	const hookAgentId = parseAgentSessionKey(params.sessionKey)?.agentId ?? params.agentId ?? resolveDefaultAgentId(params.cfg);
	const hookStorePath = hookAgentId && params.storePath ? resolveSessionStorePathForScope({
		agentId: hookAgentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}) : params.storePath;
	const hookEvent = createInternalHookEvent("command", params.action, params.sessionKey ?? "", {
		agentId: hookAgentId,
		sessionEntry: params.sessionEntry,
		previousSessionEntry: params.previousSessionEntry,
		commandSource: params.command.surface,
		senderId: params.command.senderId,
		workspaceDir: params.workspaceDir,
		storePath: hookStorePath,
		cfg: params.cfg
	});
	await triggerInternalHook(hookEvent);
	params.command.resetHookTriggered = true;
	let routedReply = false;
	if (hookEvent.messages.length > 0) {
		const channel = params.ctx.OriginatingChannel || params.command.channel;
		const to = params.ctx.OriginatingTo || params.command.from || params.command.to;
		if (channel && to) {
			const { routeReply } = await loadRouteReplyRuntime();
			const result = await routeReply({
				payload: { text: hookEvent.messages.join("\n\n") },
				channel,
				to,
				sessionKey: params.sessionKey,
				accountId: params.ctx.AccountId,
				requesterSenderId: params.command.senderId,
				requesterSenderName: params.ctx.SenderName,
				requesterSenderUsername: params.ctx.SenderUsername,
				requesterSenderE164: params.ctx.SenderE164,
				threadId: params.ctx.MessageThreadId,
				cfg: params.cfg,
				replyKind: "final"
			});
			if (result.delivered) await params.onObservedReplyDelivery?.();
			routedReply = result.delivered || result.suppressed === true;
		}
	}
	const hookRunner = getGlobalHookRunner();
	if (hookRunner?.hasHooks("before_reset")) {
		const prevEntry = params.previousSessionEntry;
		const agentId = hookAgentId;
		const storePath = hookStorePath;
		const beforeResetTranscript = await loadBeforeResetTranscript({
			agentId,
			sessionFile: agentId && prevEntry?.sessionId && storePath ? formatSqliteSessionFileMarker({
				agentId,
				sessionId: prevEntry.sessionId,
				storePath
			}) : params.sessionKey,
			sessionId: prevEntry?.sessionId,
			sessionKey: params.sessionKey,
			storePath
		});
		(async () => {
			try {
				await hookRunner.runBeforeReset({
					...beforeResetTranscript,
					reason: params.action
				}, {
					agentId,
					sessionKey: params.sessionKey,
					sessionId: prevEntry?.sessionId,
					workspaceDir: params.workspaceDir
				});
			} catch (err) {
				logVerbose(`before_reset hook failed: ${String(err)}`);
			}
		})();
	}
	return { routedReply };
}
//#endregion
export { emitResetCommandHooks as t };
