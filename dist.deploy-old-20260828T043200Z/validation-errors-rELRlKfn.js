import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { a as NonEmptyString } from "./primitives-TdbrOFJ1.js";
import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/error-codes.ts
const CronJobNotFoundErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.CRON_JOB_NOT_FOUND),
	jobId: NonEmptyString
});
/** Missing operator-scope details shared by WebSocket and HTTP responses. */
const MissingScopeErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.MISSING_SCOPE),
	missingScope: NonEmptyString,
	requiredScopes: Type.Array(NonEmptyString, { minItems: 1 })
});
const McpAppViewExpiredErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED) });
const OutboundDeliveryQueuedErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.OUTBOUND_DELIVERY_QUEUED) });
const UserPrefsLimitExceededErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.USER_PREFS_LIMIT_EXCEEDED),
	limit: Type.Integer({ minimum: 1 }),
	currentCount: Type.Integer({ minimum: 0 })
});
const UnknownAgentIdErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.UNKNOWN_AGENT_ID),
	agentId: NonEmptyString
});
const WizardNotFoundErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.WIZARD_NOT_FOUND) });
const ProjectCloneErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.PROJECT_CLONE_FAILED),
	cause: Type.String({ enum: [
		"invalid_url",
		"auth_required",
		"not_found",
		"network",
		"target_exists",
		"clone_failed"
	] })
});
const RevisionHashSchema = Type.String({ pattern: "^[a-fA-F0-9]{64}$" });
const SkillProposalRevisionChangedErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.SKILL_PROPOSAL_REVISION_CHANGED),
	expectedRevisionHash: RevisionHashSchema,
	currentRevisionHash: RevisionHashSchema
});
/** Structured details emitted by method-level failures. */
const GatewayErrorDetailsSchema = Type.Union([
	CronJobNotFoundErrorDetailsSchema,
	MissingScopeErrorDetailsSchema,
	McpAppViewExpiredErrorDetailsSchema,
	OutboundDeliveryQueuedErrorDetailsSchema,
	UserPrefsLimitExceededErrorDetailsSchema,
	SkillProposalRevisionChangedErrorDetailsSchema,
	ProjectCloneErrorDetailsSchema,
	UnknownAgentIdErrorDetailsSchema,
	WizardNotFoundErrorDetailsSchema
]);
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
function errorShape(code, message, opts) {
	return {
		code,
		message,
		...opts
	};
}
/** Builds structured details for a missing operator scope. */
function buildMissingScopeErrorDetails(params) {
	const requiredScopes = params.requiredScopes.length > 0 ? [...params.requiredScopes] : [params.missingScope];
	return {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope: params.missingScope,
		requiredScopes
	};
}
/** Builds a forbidden error for a missing operator scope without message parsing. */
function missingScopeErrorShape(params) {
	const details = buildMissingScopeErrorDetails(params);
	return errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${params.missingScope}`, { details });
}
//#endregion
//#region packages/gateway-protocol/src/validation-errors.ts
function firstStringParam(value) {
	if (typeof value === "string" && value.trim()) return value;
	if (Array.isArray(value)) return value.find((entry) => typeof entry === "string" && entry.trim().length > 0);
}
/** Convert validator errors into compact operator-facing failure text. */
function formatValidationErrors(errors) {
	if (!errors?.length) return "unknown validation error";
	const parts = [];
	for (const err of errors) {
		const keyword = typeof err?.keyword === "string" ? err.keyword : "";
		const instancePath = typeof err?.instancePath === "string" ? err.instancePath : "";
		if (keyword === "additionalProperties") {
			const additionalProperty = firstStringParam(err?.params?.additionalProperty) ?? firstStringParam(err?.params?.additionalProperties);
			if (additionalProperty) {
				const where = instancePath ? `at ${instancePath}` : "at root";
				parts.push(`${where}: unexpected property '${additionalProperty}'`);
				continue;
			}
		}
		if (keyword === "required") {
			const missingProperty = firstStringParam(err?.params?.missingProperty) ?? firstStringParam(err?.params?.requiredProperties);
			if (missingProperty) {
				const where = instancePath ? `at ${instancePath}: ` : "";
				parts.push(`${where}must have required property '${missingProperty}'`);
				continue;
			}
		}
		const failingKeyword = typeof err?.params?.failingKeyword === "string" ? err.params.failingKeyword : "";
		const message = keyword === "then" || keyword === "if" && failingKeyword === "then" ? "must have required conditional properties" : typeof err?.message === "string" && err.message.trim() ? err.message : "validation error";
		const where = instancePath ? `at ${instancePath}: ` : "";
		parts.push(`${where}${message}`);
	}
	const unique = [...new Set(parts.filter((part) => part.trim()))];
	return unique.length > 0 ? unique.join("; ") : "unknown validation error";
}
//#endregion
export { OutboundDeliveryQueuedErrorDetailsSchema as a, UserPrefsLimitExceededErrorDetailsSchema as c, errorShape as d, missingScopeErrorShape as f, MissingScopeErrorDetailsSchema as i, WizardNotFoundErrorDetailsSchema as l, CronJobNotFoundErrorDetailsSchema as n, ProjectCloneErrorDetailsSchema as o, GatewayErrorDetailsSchema as r, SkillProposalRevisionChangedErrorDetailsSchema as s, formatValidationErrors as t, buildMissingScopeErrorDetails as u };
