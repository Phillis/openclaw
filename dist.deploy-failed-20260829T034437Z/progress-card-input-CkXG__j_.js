import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { Zg as PROGRESS_CARD_MAX_UTF8_BYTES } from "./src-4dv5TpeQ.js";
import { t as stripInvisibleUnicode } from "./unicode-visibility-cJ_24BIl.js";
//#region src/session-cards/progress-card-input.ts
var ProgressCardInputError = class extends Error {};
function isProgressCardStepStatus(value) {
	return value === "pending" || value === "in_progress" || value === "completed";
}
/** Validates and normalizes the replace-on-write progress-card payload. */
function normalizeProgressCardInput(input) {
	let markdown;
	if (input.markdown !== void 0) {
		if (typeof input.markdown !== "string") throw new ProgressCardInputError("markdown must be a string");
		if (Buffer.byteLength(input.markdown, "utf8") > 8192) throw new ProgressCardInputError(`progress card markdown exceeds ${PROGRESS_CARD_MAX_UTF8_BYTES} UTF-8 bytes`);
		const sanitized = stripInvisibleUnicode(input.markdown);
		if (sanitized.trim()) markdown = sanitized;
	}
	let steps;
	if (input.plan !== void 0) {
		if (!Array.isArray(input.plan)) throw new ProgressCardInputError("plan must be an array");
		if (input.plan.length > 50) throw new ProgressCardInputError(`plan can contain at most 50 steps`);
		const normalizedSteps = [];
		let inProgressCount = 0;
		for (const [index, entry] of input.plan.entries()) {
			const record = asOptionalObjectRecord(entry);
			if (!record) throw new ProgressCardInputError(`plan[${index}] must be an object`);
			if (typeof record.step !== "string") throw new ProgressCardInputError(`plan[${index}].step must be a string`);
			if (Buffer.byteLength(record.step, "utf8") > 512) throw new ProgressCardInputError(`plan[${index}].step exceeds 512 UTF-8 bytes`);
			const step = stripInvisibleUnicode(record.step);
			if (!step.trim()) throw new ProgressCardInputError(`plan[${index}].step must not be empty`);
			if (!isProgressCardStepStatus(record.status)) throw new ProgressCardInputError(`plan[${index}].status must be one of pending, in_progress, completed`);
			if (record.status === "in_progress") inProgressCount += 1;
			normalizedSteps.push({
				step,
				status: record.status
			});
		}
		if (inProgressCount > 1) throw new ProgressCardInputError("plan can contain at most one in_progress step");
		if (normalizedSteps.length > 0) steps = normalizedSteps;
	}
	return {
		...markdown ? { markdown } : {},
		...steps ? { steps } : {}
	};
}
//#endregion
export { normalizeProgressCardInput as n, ProgressCardInputError as t };
