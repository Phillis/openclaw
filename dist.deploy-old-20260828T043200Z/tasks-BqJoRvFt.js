import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Ca as validateTasksGetParams, Sa as validateTasksCancelParams, Ta as validateTasksRecoveryParams, wa as validateTasksListParams } from "./src-4dv5TpeQ.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-CPkeRwvL.js";
import "./sessions-CdrF1uzY.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { S as getTaskById, T as listTaskRecordPage } from "./task-registry-LJQ782u-.js";
import "./runtime-internal-Cq7nj-Aw.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as retrySubagentCompletionDelivery, n as dismissSubagentCompletionDelivery } from "./subagent-completion-delivery-2OFCl3SJ.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { n as canAccessTaskRequesterSession, t as mapTaskSummary } from "./task-summary-Cdf2Lrj1.js";
//#region src/gateway/server-methods/tasks.ts
const DEFAULT_TASKS_LIST_LIMIT = 100;
const MAX_TASKS_LIST_LIMIT = 500;
const LEDGER_STATUS_TO_TASK_STATUSES = {
	queued: ["queued"],
	running: ["running"],
	completed: ["succeeded"],
	failed: ["failed", "lost"],
	timed_out: ["timed_out"],
	cancelled: ["cancelled"]
};
function normalizeTaskStatusFilter(status) {
	if (!status) return null;
	return new Set((Array.isArray(status) ? status : [status]).flatMap((value) => LEDGER_STATUS_TO_TASK_STATUSES[value] ?? []));
}
function parseCursor(cursor) {
	if (!cursor) return 0;
	if (!/^\d+$/.test(cursor.trim())) return null;
	const parsed = Number(cursor);
	return Number.isSafeInteger(parsed) ? parsed : null;
}
const tasksHandlers = {
	"tasks.list": ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksListParams, "tasks.list", respond)) return;
		const cursor = parseCursor(params.cursor);
		if (cursor === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid tasks.list cursor"));
			return;
		}
		const statusFilter = normalizeTaskStatusFilter(params.status);
		const limit = Math.min(params.limit ?? DEFAULT_TASKS_LIST_LIMIT, MAX_TASKS_LIST_LIMIT);
		const requestedSessionKey = normalizeOptionalString(params.sessionKey);
		const cfg = context.getRuntimeConfig();
		let sessionKey;
		let sessionAgentId;
		if (requestedSessionKey) {
			const sessionOwner = resolveRequestedSessionAgentId(cfg, requestedSessionKey, normalizeOptionalString(params.agentId));
			if (!sessionOwner.ok) {
				respond(false, void 0, sessionOwner.error);
				return;
			}
			sessionAgentId = sessionOwner.agentId;
			sessionKey = canonicalizeMainSessionAlias({
				cfg,
				agentId: sessionOwner.agentId,
				sessionKey: requestedSessionKey
			});
		}
		const page = listTaskRecordPage({
			offset: cursor,
			limit,
			statuses: statusFilter ? [...statusFilter] : void 0,
			agentId: sessionKey ? void 0 : params.agentId,
			sessionKey,
			sessionAgentId,
			cfg,
			filter: (task) => canAccessTaskRequesterSession({
				cfg,
				client,
				task
			})
		});
		const nextOffset = cursor + page.tasks.length;
		respond(true, {
			tasks: page.tasks.map((task) => mapTaskSummary(task)),
			...page.hasMore ? { nextCursor: String(nextOffset) } : {}
		});
	},
	"tasks.get": ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksGetParams, "tasks.get", respond)) return;
		const taskId = params.taskId;
		const task = getTaskById(taskId);
		if (!task || !canAccessTaskRequesterSession({
			cfg: context.getRuntimeConfig(),
			client,
			task
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `task not found: ${taskId}`));
			return;
		}
		respond(true, { task: mapTaskSummary(task, { includePrompt: true }) });
	},
	"tasks.cancel": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksCancelParams, "tasks.cancel", respond)) return;
		const taskId = params.taskId;
		const reason = normalizeOptionalString(params.reason);
		const { cancelDetachedTaskRunByIdCore } = await import("./task-executor-cancel.runtime.js");
		const cfg = context.getRuntimeConfig();
		const task = getTaskById(taskId);
		if (task && !canAccessTaskRequesterSession({
			access: "write",
			cfg,
			client,
			task
		})) {
			respond(true, {
				found: false,
				cancelled: false
			});
			return;
		}
		const result = await cancelDetachedTaskRunByIdCore({
			cfg,
			taskId,
			...reason ? { reason } : {}
		});
		respond(true, {
			found: result.found,
			cancelled: result.cancelled,
			...result.reason ? { reason: result.reason } : {},
			...result.task ? { task: mapTaskSummary(result.task) } : {}
		});
	},
	"tasks.retry": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksRecoveryParams, "tasks.retry", respond)) return;
		const results = [];
		const cfg = context.getRuntimeConfig();
		for (const taskId of params.taskIds) {
			const task = getTaskById(taskId);
			if (task && !canAccessTaskRequesterSession({
				access: "write",
				cfg,
				client,
				task
			})) {
				results.push({
					taskId,
					ok: false,
					reason: "task not found"
				});
				continue;
			}
			const result = await retrySubagentCompletionDelivery(taskId);
			results.push({
				taskId,
				ok: result.ok,
				...result.reason ? { reason: result.reason } : {},
				...result.duplicateRisk ? { duplicateRisk: true } : {},
				...result.task ? { task: mapTaskSummary(result.task, { includePrompt: true }) } : {}
			});
		}
		respond(true, { results });
	},
	"tasks.dismiss": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksRecoveryParams, "tasks.dismiss", respond)) return;
		const { discardSubagentTerminalDelivery } = await import("./subagent-registry-D40ZiQBH.js");
		const results = [];
		const cfg = context.getRuntimeConfig();
		for (const taskId of params.taskIds) {
			const task = getTaskById(taskId);
			if (task && !canAccessTaskRequesterSession({
				access: "write",
				cfg,
				client,
				task
			})) {
				results.push({
					taskId,
					ok: false,
					reason: "task not found"
				});
				continue;
			}
			const result = await dismissSubagentCompletionDelivery(taskId, { discardTerminalDelivery: discardSubagentTerminalDelivery });
			results.push({
				taskId,
				ok: result.ok,
				...result.reason ? { reason: result.reason } : {},
				...result.task ? { task: mapTaskSummary(result.task, { includePrompt: true }) } : {}
			});
		}
		respond(true, { results });
	}
};
//#endregion
export { tasksHandlers };
