import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-er-Gn_t_.js";
import { da as validateTasksCancelParams, fa as validateTasksGetParams, ma as validateTasksRecoveryParams, pa as validateTasksListParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { w as listTaskRecordPage, x as getTaskById } from "./task-registry-D0u4Dzrj.js";
import "./runtime-internal-ByOukZ5u.js";
import "./sessions-D-jhKYGW.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import { i as retrySubagentCompletionDelivery, n as dismissSubagentCompletionDelivery } from "./subagent-completion-delivery-BXP_3cYN.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as mapTaskSummary } from "./task-summary-DeOCC2Y7.js";
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
	"tasks.list": ({ params, respond, context }) => {
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
			cfg
		});
		const nextOffset = cursor + page.tasks.length;
		respond(true, {
			tasks: page.tasks.map((task) => mapTaskSummary(task)),
			...page.hasMore ? { nextCursor: String(nextOffset) } : {}
		});
	},
	"tasks.get": ({ params, respond }) => {
		if (!assertValidParams(params, validateTasksGetParams, "tasks.get", respond)) return;
		const taskId = params.taskId;
		const task = getTaskById(taskId);
		if (!task) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `task not found: ${taskId}`));
			return;
		}
		respond(true, { task: mapTaskSummary(task, { includePrompt: true }) });
	},
	"tasks.cancel": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateTasksCancelParams, "tasks.cancel", respond)) return;
		const taskId = params.taskId;
		const reason = normalizeOptionalString(params.reason);
		const { cancelDetachedTaskRunByIdCore } = await import("./task-executor-cancel.runtime.js");
		const result = await cancelDetachedTaskRunByIdCore({
			cfg: context.getRuntimeConfig(),
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
	"tasks.retry": async ({ params, respond }) => {
		if (!assertValidParams(params, validateTasksRecoveryParams, "tasks.retry", respond)) return;
		const results = [];
		for (const taskId of params.taskIds) {
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
	"tasks.dismiss": async ({ params, respond }) => {
		if (!assertValidParams(params, validateTasksRecoveryParams, "tasks.dismiss", respond)) return;
		const { discardSubagentTerminalDelivery } = await import("./subagent-registry-DTbY2QEQ.js");
		const results = [];
		for (const taskId of params.taskIds) {
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
