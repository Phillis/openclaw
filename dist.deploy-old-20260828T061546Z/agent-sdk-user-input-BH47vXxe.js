import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
//#region extensions/anthropic/agent-sdk-user-input.ts
function createClaudeAgentSdkUserInputAuthorizer(context) {
	const requests = /* @__PURE__ */ new Map();
	return { authorize(params) {
		const existing = params.toolUseId ? requests.get(params.toolUseId) : void 0;
		if (existing) return existing;
		const request = runClaudeUserInput(context, params);
		if (params.toolUseId) requests.set(params.toolUseId, request);
		return request;
	} };
}
async function runClaudeUserInput(context, params) {
	const questions = readClaudeUserInputQuestions(params.input);
	if (!questions) return {
		behavior: "deny",
		message: "OpenClaw rejected malformed Claude user questions."
	};
	const result = await context.requestUserInput({
		toolName: "AskUserQuestion",
		questions,
		intro: "Claude needs input:",
		...params.toolUseId ? { toolCallId: params.toolUseId } : {},
		abortSignal: params.signal
	});
	if (result.status !== "answered") return {
		behavior: "deny",
		message: `${result.message} Continue with your best judgment.`
	};
	const answers = {};
	questions.forEach((question) => {
		answers[question.question] = (result.answers[question.id] ?? []).join(", ");
	});
	return {
		behavior: "allow",
		updatedInput: {
			...params.input,
			answers
		}
	};
}
function readClaudeUserInputQuestions(input) {
	const rawQuestions = input.questions;
	if (!Array.isArray(rawQuestions) || rawQuestions.length < 1 || rawQuestions.length > 4) return;
	const questions = [];
	for (const [index, rawQuestion] of rawQuestions.entries()) {
		if (!isRecord(rawQuestion)) return;
		const question = readBoundedText(rawQuestion.question, 4096);
		const header = readBoundedText(rawQuestion.header, 12);
		const rawOptions = rawQuestion.options;
		if (!question || !header || !Array.isArray(rawOptions) || rawOptions.length < 2 || rawOptions.length > 4 || typeof rawQuestion.multiSelect !== "boolean") return;
		const options = [];
		for (const rawOption of rawOptions) {
			if (!isRecord(rawOption)) return;
			const label = readBoundedText(rawOption.label, 256);
			const description = readBoundedText(rawOption.description, 1024);
			if (!label || !description) return;
			options.push({
				label,
				description
			});
		}
		questions.push({
			id: `question_${index + 1}`,
			header,
			question,
			multiSelect: rawQuestion.multiSelect,
			isOther: true,
			options
		});
	}
	return questions;
}
function readBoundedText(value, maxLength) {
	if (typeof value !== "string" || value.length === 0 || value.length > maxLength) return;
	return value;
}
//#endregion
export { createClaudeAgentSdkUserInputAuthorizer as t };
