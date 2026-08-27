import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { t as createClackPrompter } from "./clack-prompter-9tEHHVYQ.js";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-DZKXbUOF.js";
//#region src/shared/session-archive-timeout.ts
/** Cloud workspace reconciliation may take several minutes before archive can commit. */
const SESSION_ARCHIVE_REQUEST_TIMEOUT_MS = 10 * 6e4;
//#endregion
//#region src/commands/sessions-lifecycle.ts
/** Gateway-backed archive and delete commands for stored sessions. */
const SESSION_TARGET_PAGE_SIZE = 200;
function listHint(agent) {
	return formatCliCommand(`openclaw sessions list${agent ? ` --agent ${agent}` : ""} --json`);
}
function notFoundResult(key, agent) {
	return {
		key,
		ok: false,
		status: "not_found",
		error: `Session not found. Run ${listHint(agent)} to choose a valid key.`
	};
}
async function listRequestedSessions(keys, agent, rpcOptions) {
	const wanted = new Set(keys);
	const found = /* @__PURE__ */ new Map();
	let offset = 0;
	while (wanted.size > found.size) {
		const page = await callGatewayFromCliWithTransport("sessions.list", rpcOptions, {
			limit: SESSION_TARGET_PAGE_SIZE,
			...offset > 0 ? { offset } : {},
			archived: "all",
			includeGlobal: true,
			includeUnknown: true,
			configuredAgentsOnly: true,
			...agent ? { agentId: agent } : {}
		}, { defaultTimeoutMs: 3e4 });
		if (!page || !Array.isArray(page.sessions)) throw new Error("Gateway returned an invalid sessions.list response.");
		for (const row of page.sessions) if (wanted.has(row.key) && !found.has(row.key)) found.set(row.key, row);
		if (found.size === wanted.size || page.hasMore !== true) break;
		const nextOffset = page.nextOffset;
		if (typeof nextOffset !== "number" || nextOffset <= offset) throw new Error("Gateway returned invalid sessions.list pagination.");
		offset = nextOffset;
	}
	return found;
}
function outputLifecycleResults(operation, dryRun, results, runtime, json) {
	const ok = results.every((result) => result.ok);
	if (json) writeRuntimeJson(runtime, {
		ok,
		operation,
		dryRun,
		results
	});
	else for (const result of results) switch (result.status) {
		case "archived":
			runtime.log(`Archived session ${result.key}.`);
			break;
		case "already_archived":
			runtime.log(`Session ${result.key} is already archived.`);
			break;
		case "deleted":
			runtime.log(`Deleted session ${result.key}.`);
			for (const archived of result.archived ?? []) runtime.log(`Archived transcript: ${archived}`);
			if (result.worktreePreserved) runtime.error(`Preserved worktree ${result.worktreePreserved.branch} at ${result.worktreePreserved.path}; remove it manually after preserving any changes.`);
			break;
		case "would_archive":
			runtime.log(`[dry-run] archive session ${result.key}`);
			break;
		case "would_delete":
			runtime.log(`[dry-run] delete session ${result.key} and its live transcript state`);
			break;
		case "not_found":
		case "failed":
			runtime.error(`${operation} ${result.key}: ${result.error ?? "Unknown failure."}`);
			break;
	}
	if (!ok) runtime.exit(1);
}
async function runSessionsLifecycleCommand(operation, opts, runtime) {
	const keys = opts.keys.map((key) => key.trim());
	const rpcOptions = {
		url: opts.url,
		token: opts.token,
		password: opts.password,
		timeout: opts.timeout,
		json: opts.json
	};
	let sessions;
	try {
		sessions = await listRequestedSessions(keys.filter(Boolean), opts.agent, rpcOptions);
	} catch (error) {
		const message = formatErrorMessage(error);
		outputLifecycleResults(operation, Boolean(opts.dryRun), keys.map((key) => ({
			key,
			ok: false,
			status: "failed",
			error: message
		})), runtime, Boolean(opts.json));
		return;
	}
	const results = keys.map((key) => key && sessions.has(key) ? void 0 : notFoundResult(key, opts.agent));
	const validTargets = keys.flatMap((key, index) => {
		const session = sessions.get(key);
		return session ? [{
			index,
			session
		}] : [];
	}).filter(({ index, session }) => {
		if (!(!opts.dryRun && !(operation === "archive" && session.archived === true)) || session.sessionId) return true;
		results[index] = {
			key: session.key,
			ok: false,
			status: "failed",
			error: "Session has no durable identity; lifecycle mutation was not attempted."
		};
		return false;
	});
	if (operation === "delete" && !opts.dryRun && !opts.yes && validTargets.length > 0) {
		if (opts.json || !process.stdin.isTTY) {
			const error = "Deletion requires confirmation. Pass --yes to delete non-interactively.";
			for (const { index, session } of validTargets) results[index] = {
				key: session.key,
				ok: false,
				status: "failed",
				error
			};
			outputLifecycleResults(operation, false, results.filter((result) => result !== void 0), runtime, Boolean(opts.json));
			return;
		}
		if (!await createClackPrompter().confirm({
			message: `Delete ${validTargets.length} session${validTargets.length === 1 ? "" : "s"} and remove live transcript state?`,
			initialValue: false
		})) {
			runtime.log("Cancelled.");
			return;
		}
	}
	for (const { index, session } of validTargets) {
		if (opts.dryRun) {
			results[index] = {
				key: session.key,
				ok: true,
				status: operation === "archive" ? session.archived === true ? "already_archived" : "would_archive" : "would_delete"
			};
			continue;
		}
		if (operation === "archive" && session.archived === true) {
			results[index] = {
				key: session.key,
				ok: true,
				status: "already_archived"
			};
			continue;
		}
		try {
			if (operation === "archive") {
				const response = await callGatewayFromCliWithTransport("sessions.patch", rpcOptions, {
					key: session.key,
					...opts.agent ? { agentId: opts.agent } : {},
					...session.sessionId ? { expectedSessionId: session.sessionId } : {},
					archived: true
				}, { defaultTimeoutMs: SESSION_ARCHIVE_REQUEST_TIMEOUT_MS });
				if (response?.ok !== true || response.entry?.archivedAt === void 0) throw new Error("Gateway did not confirm that the session was archived.");
				results[index] = {
					key: response.key ?? session.key,
					ok: true,
					status: "archived"
				};
			} else {
				const response = await callGatewayFromCliWithTransport("sessions.delete", rpcOptions, {
					key: session.key,
					...opts.agent ? { agentId: opts.agent } : {},
					...session.sessionId ? { expectedSessionId: session.sessionId } : {},
					deleteTranscript: true,
					...session.archived === true ? { archivedOnly: true } : {}
				}, { defaultTimeoutMs: 3e4 });
				if (response?.ok !== true || response.deleted !== true) {
					results[index] = notFoundResult(session.key, opts.agent);
					continue;
				}
				results[index] = {
					key: response.key ?? session.key,
					ok: true,
					status: "deleted",
					archived: response.archived ?? [],
					...response.worktreePreserved ? { worktreePreserved: response.worktreePreserved } : {}
				};
			}
		} catch (error) {
			results[index] = {
				key: session.key,
				ok: false,
				status: "failed",
				error: formatErrorMessage(error)
			};
		}
	}
	outputLifecycleResults(operation, Boolean(opts.dryRun), results.filter((result) => result !== void 0), runtime, Boolean(opts.json));
}
/** Archive one or more stored sessions through the same Gateway patch used by Control UI. */
async function sessionsArchiveCommand(opts, runtime) {
	await runSessionsLifecycleCommand("archive", opts, runtime);
}
/** Delete one or more stored sessions through the same Gateway lifecycle owner used by Control UI. */
async function sessionsDeleteCommand(opts, runtime) {
	await runSessionsLifecycleCommand("delete", opts, runtime);
}
//#endregion
export { sessionsArchiveCommand, sessionsDeleteCommand };
