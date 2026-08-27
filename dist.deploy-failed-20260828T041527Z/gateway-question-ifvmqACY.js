import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { m as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-BeeUJOmJ.js";
import { randomBytes } from "node:crypto";
//#region src/agents/harness/user-input-bridge.ts
function emptyAgentHarnessUserInputAnswers() {
	return { answers: {} };
}
function formatAgentHarnessUserInputPrompt(questions, options = {}) {
	const formatText = options.formatText ?? ((text) => text);
	const lines = [options.intro ?? "Agent needs input:"];
	questions.forEach((question, index) => {
		if (questions.length > 1) lines.push("", `${index + 1}. ${formatText(question.header)}`, formatText(question.question));
		else lines.push("", formatText(question.header), formatText(question.question));
		if (question.isSecret) lines.push(options.secretWarning ?? "This channel may show your reply to other participants.");
		question.options?.forEach((option, optionIndex) => {
			lines.push(`${optionIndex + 1}. ${formatText(option.label)}${option.description ? ` - ${formatText(option.description)}` : ""}`);
		});
		if (question.isOther) lines.push(options.otherLabel ?? "Other: reply with your own answer.");
	});
	return lines.join("\n");
}
async function deliverAgentHarnessUserInputPrompt(params, questions, options = {}) {
	const text = formatAgentHarnessUserInputPrompt(questions, options);
	if (params.onBlockReply) {
		await params.onBlockReply(markReplyPayloadForSourceSuppressionDelivery({
			text,
			presentation: options.presentation
		}));
		return;
	}
	await params.onPartialReply?.({ text });
}
/** Builds the portable one-question presentation shared by tools and harnesses. */
function buildAgentHarnessQuestionPresentation(params) {
	if (params.questions.length !== 1) return;
	const [question] = params.questions;
	const options = question?.options ?? [];
	const formatText = params.formatText ?? ((text) => text);
	if (!question || question.multiSelect || question.isSecret || options.length === 0) return;
	const optionGuidance = [
		...options.map((option) => `- ${formatText(option.label)}${option.description ? `: ${formatText(option.description)}` : ""}`),
		"",
		question.isOther ? "Tap an option, or reply with the option text or your own answer." : "Tap an option, or reply with the option number or text."
	].join("\n");
	return { blocks: [
		{
			type: "text",
			text: formatText(question.question)
		},
		{
			type: "text",
			text: optionGuidance
		},
		{
			type: "buttons",
			buttons: [...options.map((option) => ({
				label: formatText(option.label),
				action: {
					type: "question",
					questionId: params.questionId,
					optionValue: option.label
				}
			})), ...question.isOther ? [{
				label: "Other…",
				action: {
					type: "question",
					questionId: params.questionId,
					intent: "custom-input"
				}
			}] : []]
		}
	] };
}
/** Builds the exact question payload consumed by web chat and native channels. */
function buildAgentHarnessQuestionPromptPayload(params) {
	const prompt = formatAgentHarnessUserInputPrompt(params.questions, params.options);
	const presentation = params.options?.presentation ?? buildAgentHarnessQuestionPresentation({
		...params,
		formatText: params.options?.formatText
	});
	const [question] = params.questions;
	const candidateOptionValues = params.questions.length === 1 && question && !question.multiSelect && !question.isSecret ? question.options?.map((option) => option.label) ?? [] : [];
	const normalizedOptionValues = candidateOptionValues.map((option) => option.trim().toLowerCase());
	const optionValues = candidateOptionValues.length >= 2 && candidateOptionValues.length <= 4 && normalizedOptionValues.every(Boolean) && new Set(normalizedOptionValues).size === candidateOptionValues.length ? candidateOptionValues : void 0;
	return markReplyPayloadForSourceSuppressionDelivery({
		text: `${prompt}\n\n${questionReplyGuidance(params.questions)}`,
		...presentation ? {
			presentation,
			presentationTextMode: "fallback"
		} : {},
		channelData: { askUser: {
			questionId: params.questionId,
			...optionValues ? { optionValues } : {}
		} }
	});
}
function questionReplyGuidance(questions) {
	if (questions.length !== 1) return "Reply by number or question id. Use a declared option where choices are fixed.";
	const [question] = questions;
	if (!question || (question.options?.length ?? 0) === 0) return "Reply with your answer.";
	if (question.multiSelect) return "Reply with comma-separated option numbers or text, or your own answer.";
	return question.isOther ? "Reply with the number, the option text, or your own answer." : "Reply with the number or option text.";
}
/** Delivers a gateway-backed question through the harness block-reply surface. */
async function deliverAgentHarnessQuestionPrompt(params, questionId, questions, options, signal) {
	signal?.throwIfAborted();
	const payload = buildAgentHarnessQuestionPromptPayload({
		questionId,
		questions,
		options
	});
	if (params.onBlockReply) {
		await params.onBlockReply(payload, signal ? { abortSignal: signal } : void 0);
		return;
	}
	signal?.throwIfAborted();
	await params.onPartialReply?.({ text: payload.text });
}
function buildAgentHarnessUserInputAnswers(questions, inputText) {
	const answers = {};
	if (questions.length === 1) {
		const question = questions[0];
		if (question) answers[question.id] = { answers: normalizeAgentHarnessUserInputAnswers(inputText, question) };
		return { answers };
	}
	const keyed = parseKeyedAnswers(inputText);
	const fallbackLines = inputText.split(/\r?\n/).map((line) => line.trim());
	questions.forEach((question, index) => {
		const answer = keyed.get(question.id.toLowerCase()) ?? keyed.get(question.header.toLowerCase()) ?? keyed.get(question.question.toLowerCase()) ?? keyed.get(String(index + 1)) ?? fallbackLines[index] ?? "";
		answers[question.id] = { answers: answer ? normalizeAgentHarnessUserInputAnswers(answer, question) : [] };
	});
	return { answers };
}
function normalizeAgentHarnessUserInputAnswers(answer, question) {
	if (!question.multiSelect) {
		const normalized = normalizeAgentHarnessUserInputAnswer(answer, question);
		return normalized ? [normalized] : [];
	}
	const declaredAnswer = normalizeAgentHarnessUserInputOption(answer, question);
	if (declaredAnswer) return [declaredAnswer];
	const normalized = answer.split(/[,;\n]/u).map((part) => normalizeAgentHarnessUserInputAnswer(part, question)).filter((part) => Boolean(part));
	return [...new Set(normalized)];
}
function normalizeAgentHarnessUserInputAnswer(answer, question) {
	const trimmed = answer.trim();
	const declaredAnswer = normalizeAgentHarnessUserInputOption(trimmed, question);
	if (declaredAnswer) return declaredAnswer;
	if ((question.options?.length ?? 0) > 0 && !question.isOther) return;
	return trimmed || void 0;
}
function normalizeAgentHarnessUserInputOption(answer, question) {
	const trimmed = answer.trim();
	const options = question.options ?? [];
	const optionIndex = /^\d+$/.test(trimmed) ? Number(trimmed) - 1 : -1;
	const indexed = optionIndex >= 0 ? options[optionIndex] : void 0;
	if (indexed) return indexed.label;
	const exact = options.find((option) => option.label.toLowerCase() === trimmed.toLowerCase());
	if (exact) return exact.label;
}
function parseKeyedAnswers(inputText) {
	const answers = /* @__PURE__ */ new Map();
	for (const line of inputText.split(/\r?\n/)) {
		const match = line.match(/^\s*([^:=-]+?)\s*[:=-]\s*(.+?)\s*$/);
		if (!match) continue;
		const key = match[1]?.trim().toLowerCase();
		const value = match[2]?.trim();
		if (key && value) answers.set(key, value);
	}
	return answers;
}
//#endregion
//#region src/agents/harness/gateway-question.ts
const QUESTION_RPC_GRACE_MS = 1e4;
const TERMINAL_QUESTION_ERROR_REASONS = /* @__PURE__ */ new Set(["QUESTION_ALREADY_TERMINAL", "QUESTION_NOT_FOUND"]);
const pendingAgentQuestions = resolveGlobalMap(Symbol.for("openclaw.pendingAgentQuestions"), (questions) => {
	const error = /* @__PURE__ */ new Error("gateway lifecycle ended before question registration completed");
	for (const state of questions.values()) if (state.kind === "gateway") state.rejectRegistration(error);
	else state.settle();
	questions.clear();
});
function readQuestionErrorReason(error) {
	if (!error || typeof error !== "object") return;
	const requestError = error;
	if (requestError.name !== "GatewayClientRequestError") return;
	const details = requestError.details;
	if (!details || typeof details !== "object" || Array.isArray(details)) return;
	const reason = details.reason;
	return typeof reason === "string" ? reason : void 0;
}
function isTerminalAgentQuestionError(error) {
	const reason = readQuestionErrorReason(error);
	return reason !== void 0 && TERMINAL_QUESTION_ERROR_REASONS.has(reason);
}
async function observeCommittedAnswer(answer) {
	if (!answer) return false;
	let timer;
	try {
		return (await Promise.race([answer, new Promise((resolve) => {
			timer = setTimeout(() => resolve(void 0), 1e3);
			timer.unref?.();
		})]))?.status === "answered";
	} catch {
		return false;
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function resolvePendingAgentQuestionAnswers(state, answers) {
	const gatewayAnswers = { answers: Object.fromEntries(Object.entries(answers.answers).map(([questionId, answer]) => [questionId, answer.answers])) };
	try {
		await state.gatewayCall("question.resolve", {}, {
			id: state.questionId,
			answers: gatewayAnswers,
			resolvedBy: "plain-text"
		});
		return true;
	} catch (error) {
		if (isTerminalAgentQuestionError(error)) return false;
		if (await observeCommittedAnswer(state.answer)) return true;
		state.resolving = false;
		throw error;
	}
}
/** Registers one gateway question as the next plain-text claim target for its session. */
function registerPendingAgentQuestion(params) {
	const sessionKey = params.sessionKey.trim();
	if (pendingAgentQuestions.get(sessionKey)) throw new Error(`session already has a pending agent input request: ${sessionKey}`);
	let resolveRegistration;
	let rejectRegistration;
	const registration = new Promise((resolve, reject) => {
		resolveRegistration = resolve;
		rejectRegistration = reject;
	});
	registration.catch(() => void 0);
	let registrationAttached = false;
	const state = {
		kind: "gateway",
		...params,
		sessionKey,
		registration,
		rejectRegistration,
		attachRegistration: (promise) => {
			if (registrationAttached) throw new Error("gateway question registration already attached");
			registrationAttached = true;
			promise.then(resolveRegistration, rejectRegistration);
		},
		cancelRequested: false,
		resolving: false
	};
	pendingAgentQuestions.set(sessionKey, state);
	return {
		attachRegistration: state.attachRegistration,
		setAnswer: async (answer) => {
			if (pendingAgentQuestions.get(sessionKey) !== state) return false;
			state.answer = answer;
			if (!state.bufferedAnswers) return false;
			const resolved = await resolvePendingAgentQuestionAnswers(state, state.bufferedAnswers);
			if (resolved) delete state.bufferedAnswers;
			return resolved;
		},
		isCancellationRequested: () => state.cancelRequested,
		isResolving: () => state.cancelRequested || state.resolving,
		dispose: () => {
			if (pendingAgentQuestions.get(sessionKey) === state) pendingAgentQuestions.delete(sessionKey);
			if (!registrationAttached) rejectRegistration(/* @__PURE__ */ new Error("gateway question registration disposed before attachment"));
		}
	};
}
/** Claims the next queued plain-text message for the session's gateway question. */
async function claimPendingAgentQuestionAnswer(params) {
	const sessionKey = params.sessionKey?.trim();
	const state = sessionKey ? pendingAgentQuestions.get(sessionKey) : void 0;
	if (!state || state.resolving || state.kind === "gateway" && state.cancelRequested) return false;
	if (state.kind === "secret") {
		state.resolving = true;
		return state.settle(params.text);
	}
	state.resolving = true;
	const answers = buildAgentHarnessUserInputAnswers(state.questions, params.text);
	if (!state.answer) {
		try {
			await state.registration;
		} catch {
			state.resolving = false;
			return false;
		}
		if (pendingAgentQuestions.get(state.sessionKey) !== state) {
			state.resolving = false;
			return false;
		}
	}
	try {
		await params.persist?.();
	} catch (error) {
		state.resolving = false;
		throw error;
	}
	if (!state.answer) {
		state.bufferedAnswers = answers;
		return true;
	}
	return await resolvePendingAgentQuestionAnswers(state, answers);
}
/** Cancels a question before the same inbound message takes another route. */
async function cancelPendingAgentQuestionForSession(params) {
	const sessionKey = params.sessionKey?.trim();
	const state = sessionKey ? pendingAgentQuestions.get(sessionKey) : void 0;
	if (!state || state.resolving) return false;
	if (state.kind === "secret") {
		state.resolving = true;
		return state.settle();
	}
	state.cancelRequested = true;
	state.resolving = true;
	try {
		await state.gatewayCall("question.resolve", { timeoutMs: QUESTION_RPC_GRACE_MS }, {
			id: state.questionId,
			cancel: true,
			resolvedBy: params.resolvedBy
		});
		state.onCancel?.(params.resolvedBy);
		return true;
	} catch (error) {
		if (isTerminalAgentQuestionError(error)) {
			state.onCancel?.(params.resolvedBy);
			return true;
		}
		state.cancelRequested = false;
		state.resolving = false;
		throw error;
	}
}
/** Presents one warned secret prompt and keeps its answer out of durable question records. */
function runAgentHarnessSecretInput(params) {
	params.signal?.throwIfAborted();
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) throw new Error("secret input requires a session key");
	if (pendingAgentQuestions.has(sessionKey)) throw new Error(`session already has a pending agent input request: ${sessionKey}`);
	return new Promise((resolve) => {
		let settled = false;
		const finish = (text) => {
			if (settled || pendingAgentQuestions.get(sessionKey) !== state) return false;
			settled = true;
			pendingAgentQuestions.delete(sessionKey);
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", onAbort);
			resolve(text);
			return true;
		};
		const onAbort = () => finish();
		const timeout = setTimeout(onAbort, params.timeoutMs);
		timeout.unref?.();
		const state = {
			kind: "secret",
			sessionKey,
			resolving: false,
			settle: finish
		};
		pendingAgentQuestions.set(sessionKey, state);
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) {
			onAbort();
			return;
		}
		deliverAgentHarnessUserInputPrompt(params.delivery, params.questions, params.promptOptions).catch(() => finish());
	});
}
/** Registers, presents, and waits for one harness-owned gateway question record. */
async function runAgentHarnessGatewayQuestion(params) {
	if (params.questions.some((question) => question.isSecret)) {
		const text = await runAgentHarnessSecretInput({
			questions: params.questions,
			sessionKey: params.sessionKey,
			timeoutMs: params.timeoutMs,
			delivery: params.delivery,
			promptOptions: params.promptOptions,
			signal: params.signal
		});
		if (text === void 0) return { status: "cancelled" };
		const parsed = buildAgentHarnessUserInputAnswers(params.questions, text);
		return {
			status: "answered",
			answers: { answers: Object.fromEntries(Object.entries(parsed.answers).map(([id, answer]) => [id, answer.answers])) }
		};
	}
	const questionId = params.questionId ?? `ask_${randomBytes(16).toString("hex")}`;
	const questions = params.questions.map(({ id, ...question }) => ({
		...question,
		questionId: id,
		options: [...question.options ?? []]
	}));
	let aborted = false;
	params.signal?.throwIfAborted();
	const claim = registerPendingAgentQuestion({
		questionId,
		sessionKey: params.sessionKey,
		questions: params.questions,
		gatewayCall: params.gatewayCall
	});
	const registration = Promise.resolve().then(() => params.gatewayCall("question.request", {}, {
		id: questionId,
		questions,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.runId ? { runId: params.runId } : {},
		timeoutMs: params.timeoutMs
	}, params.signal ? { signal: params.signal } : void 0));
	claim.attachRegistration(registration);
	const cancel = async (resolvedBy) => {
		try {
			return await params.gatewayCall("question.resolve", { timeoutMs: QUESTION_RPC_GRACE_MS }, {
				id: questionId,
				cancel: true,
				resolvedBy
			});
		} catch (error) {
			if (!isTerminalAgentQuestionError(error)) throw error;
			try {
				const result = await params.gatewayCall("question.waitAnswer", { timeoutMs: QUESTION_RPC_GRACE_MS }, {
					id: questionId,
					timeoutMs: 1e3
				});
				return result.status === "answered" ? result : void 0;
			} catch {
				return;
			}
		}
	};
	const onAbort = () => {
		aborted = true;
		claim.dispose();
		cancel("run-abort").catch(() => void 0);
	};
	try {
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) {
			onAbort();
			params.signal.throwIfAborted();
		}
		if ((await registration).id !== questionId) throw new Error("question.request returned an unexpected question id");
		if (aborted || claim.isCancellationRequested() || params.signal?.aborted) {
			const terminal = await cancel(aborted || params.signal?.aborted ? "run-abort" : "superseded-input");
			if (terminal?.status === "answered") return terminal;
			return { status: "cancelled" };
		}
		const answer = params.gatewayCall("question.waitAnswer", { timeoutMs: params.timeoutMs + QUESTION_RPC_GRACE_MS }, {
			id: questionId,
			timeoutMs: params.timeoutMs
		}, params.signal ? { signal: params.signal } : void 0);
		const bufferedAnswer = await claim.setAnswer(answer);
		const answerOutcome = answer.then((result) => ({
			kind: "answer",
			result
		}), (error) => ({
			kind: "answer-error",
			error
		}));
		const finishAnswer = async (result) => {
			if (result.status !== "pending") return result;
			return await cancel("wait-timeout") ?? { status: "cancelled" };
		};
		if (bufferedAnswer) {
			const terminal = await answerOutcome;
			if (terminal.kind === "answer-error") throw terminal.error;
			return await finishAnswer(terminal.result);
		}
		const beforeDelivery = await Promise.race([answerOutcome, new Promise((resolve) => {
			setTimeout(() => resolve({ kind: "delivery-ready" }), 0);
		})]);
		if (beforeDelivery.kind === "answer") return await finishAnswer(beforeDelivery.result);
		if (beforeDelivery.kind === "answer-error") throw beforeDelivery.error;
		if (claim.isResolving()) {
			const outcome = await answerOutcome;
			if (outcome.kind === "answer-error") throw outcome.error;
			return await finishAnswer(outcome.result);
		}
		const deliveryAbort = new AbortController();
		const deliveryOutcome = deliverAgentHarnessQuestionPrompt(params.delivery, questionId, params.questions, params.promptOptions, deliveryAbort.signal).then(() => ({ kind: "delivery" }), (error) => ({
			kind: "delivery-error",
			error
		}));
		const first = await Promise.race([answerOutcome, deliveryOutcome]);
		if (first.kind === "answer") {
			deliveryAbort.abort(/* @__PURE__ */ new Error("gateway question resolved before prompt delivery"));
			return await finishAnswer(first.result);
		}
		if (first.kind === "answer-error") {
			deliveryAbort.abort(first.error);
			throw first.error;
		}
		if (first.kind === "delivery-error") {
			const terminal = await cancel("prompt-delivery-failed");
			if (terminal?.status === "answered") return terminal;
			throw new Error("harness question prompt delivery failed", { cause: first.error });
		}
		const terminal = await answerOutcome;
		if (terminal.kind === "answer-error") throw terminal.error;
		return await finishAnswer(terminal.result);
	} catch (error) {
		try {
			const terminal = await cancel(params.signal?.aborted ? "run-abort" : "harness-error");
			if (terminal?.status === "answered") return terminal;
		} catch {}
		if (params.signal?.aborted) return { status: "cancelled" };
		throw error;
	} finally {
		params.signal?.removeEventListener("abort", onAbort);
		claim.dispose();
	}
}
//#endregion
export { buildAgentHarnessQuestionPromptPayload as a, emptyAgentHarnessUserInputAnswers as c, runAgentHarnessGatewayQuestion as i, formatAgentHarnessUserInputPrompt as l, claimPendingAgentQuestionAnswer as n, buildAgentHarnessUserInputAnswers as o, registerPendingAgentQuestion as r, deliverAgentHarnessUserInputPrompt as s, cancelPendingAgentQuestionForSession as t, normalizeAgentHarnessUserInputAnswer as u };
