import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { S as validateAuditRunInspectParams, b as validateAuditActivityListParams, x as validateAuditListParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { a as isExecutionDecisionCursor, c as listAuditEvents, i as ExecutionDecisionCursorError, t as inspectExecutionIdentityRun } from "./execution-identity-context-DSIgbfeD.js";
import { t as parsePositiveAuditCursor } from "./audit-cursor-D7Z3YEc0.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
//#region src/gateway/server-methods/audit.ts
const DEFAULT_AUDIT_LIST_LIMIT = 100;
const MAX_AUDIT_LIST_LIMIT = 500;
/** Preserve the shipped audit.list result shape for run/tool-only clients. */
function mapLegacyAuditEvent(event) {
	const { schemaVersion: _schemaVersion, actorType, actorId, ...legacyEvent } = event;
	return {
		...legacyEvent,
		actor: {
			type: actorType,
			id: actorId
		}
	};
}
function mapAuditActivityEvent(event) {
	if (event.kind === "agent_run") {
		const { actorType, actorId, ...activity } = event;
		return {
			...activity,
			eventType: "agent_run",
			actor: {
				type: actorType,
				id: actorId
			}
		};
	}
	if (event.kind === "tool_action") {
		const { actorType, actorId, ...activity } = event;
		return {
			...activity,
			eventType: "tool_action",
			actor: {
				type: actorType,
				id: actorId
			}
		};
	}
	if (event.direction === "inbound") {
		const { actorType, actorId, ...activity } = event;
		const actor = actorType === "channel_sender" ? {
			type: "channel_sender",
			id: actorId
		} : {
			type: "system",
			id: actorId
		};
		return {
			...activity,
			eventType: "inbound_message",
			actor
		};
	}
	const { actorType, actorId, ...activity } = event;
	return {
		...activity,
		eventType: "outbound_message",
		actor: {
			type: actorType,
			id: actorId
		}
	};
}
function invalidRangeOrCursor(params) {
	const cursor = parsePositiveAuditCursor(params.cursor);
	return {
		...cursor !== void 0 && cursor !== null ? { cursor } : {},
		invalid: cursor === null || params.after !== void 0 && params.before !== void 0 && params.after > params.before
	};
}
const auditHandlers = {
	"audit.list": ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditListParams, "audit.list", respond)) return;
		const parsed = invalidRangeOrCursor(params);
		if (parsed.invalid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.list range or cursor"));
			return;
		}
		const agentId = normalizeOptionalString(params.agentId);
		const sessionKey = normalizeOptionalString(params.sessionKey);
		const runId = normalizeOptionalString(params.runId);
		const page = listAuditEvents({
			limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
			...parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {},
			filters: {
				...agentId ? { agentId } : {},
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {},
				...params.kind ? { kind: params.kind } : {},
				...params.status ? { status: params.status } : {},
				...params.after !== void 0 ? { after: params.after } : {},
				...params.before !== void 0 ? { before: params.before } : {}
			}
		});
		respond(true, {
			events: page.events.map((event) => {
				if (event.kind === "message") throw new Error("legacy audit.list cannot project message records");
				return mapLegacyAuditEvent(event);
			}),
			...page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}
		});
	},
	"audit.activity.list": ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditActivityListParams, "audit.activity.list", respond)) return;
		const parsed = invalidRangeOrCursor(params);
		if (parsed.invalid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.activity.list range or cursor"));
			return;
		}
		const agentId = normalizeOptionalString(params.agentId);
		const sessionKey = normalizeOptionalString(params.sessionKey);
		const runId = normalizeOptionalString(params.runId);
		const page = listAuditEvents({
			limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
			...parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {},
			filters: {
				includeMessages: true,
				...agentId ? { agentId } : {},
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {},
				...params.kind ? { kind: params.kind } : {},
				...params.status ? { status: params.status } : {},
				...params.direction ? { direction: params.direction } : {},
				...params.channel ? { channel: params.channel } : {},
				...params.after !== void 0 ? { after: params.after } : {},
				...params.before !== void 0 ? { before: params.before } : {}
			}
		});
		respond(true, {
			events: page.events.map(mapAuditActivityEvent),
			...page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}
		});
	},
	"audit.run.inspect": ({ params, respond }) => {
		if (!assertValidParams(params, validateAuditRunInspectParams, "audit.run.inspect", respond)) return;
		const decisionCursor = params.decisionCursor;
		const executionOffset = typeof params.runId !== "string" || params.executionCursor === decisionCursor && decisionCursor !== void 0 && (decisionCursor.startsWith("a:") || decisionCursor.startsWith("g:")) ? void 0 : parsePositiveAuditCursor(params.executionCursor);
		if (decisionCursor !== void 0 && !isExecutionDecisionCursor(decisionCursor) || executionOffset === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.run.inspect cursor"));
			return;
		}
		try {
			respond(true, inspectExecutionIdentityRun({
				...typeof params.runId === "string" ? {
					runId: params.runId,
					...executionOffset !== void 0 ? { executionOffset } : {},
					executionLimit: params.executionLimit ?? 50
				} : { executionId: params.executionId },
				...decisionCursor !== void 0 ? { decisionCursor } : {},
				decisionLimit: params.decisionLimit ?? 50
			}));
		} catch (error) {
			if (error instanceof ExecutionDecisionCursorError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			throw error;
		}
	}
};
//#endregion
export { auditHandlers };
