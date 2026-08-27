import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { m as retainGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CTDt7IQ1.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/question-manager.ts
/** Grace period for late question.waitAnswer and question.get calls. */
const QUESTION_RESOLVED_ENTRY_GRACE_MS = 15e3;
const QuestionManagerErrorCodes = {
	NOT_FOUND: "QUESTION_NOT_FOUND",
	ALREADY_TERMINAL: "QUESTION_ALREADY_TERMINAL",
	ID_IN_USE: "QUESTION_ID_IN_USE",
	INVALID_ANSWER: "QUESTION_INVALID_ANSWER"
};
var QuestionManagerError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "QuestionManagerError";
	}
};
function unrefTimer(timer) {
	timer.unref?.();
}
function waitResult(record) {
	switch (record.status) {
		case "pending": return { status: "pending" };
		case "answered": return {
			status: "answered",
			answers: record.answers ?? { answers: {} }
		};
		case "cancelled": return { status: "cancelled" };
		case "expired": return { status: "expired" };
	}
	return record.status;
}
function resolvedEvent(record) {
	if (record.status === "pending") return null;
	return record.status === "answered" ? {
		id: record.id,
		status: record.status,
		answers: record.answers ?? { answers: {} }
	} : {
		id: record.id,
		status: record.status
	};
}
/** Process-local lifecycle owner for pending questions. */
var QuestionManager = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map();
	}
	request(params) {
		const createdAtMs = Date.now();
		const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
		const expiresAtMs = resolveExpiresAtMsFromDurationMs(timeoutMs, { nowMs: createdAtMs });
		if (expiresAtMs === void 0) throw new Error("question expiry is unavailable");
		const id = params.id ?? randomUUID();
		if (this.entries.has(id)) throw new QuestionManagerError(QuestionManagerErrorCodes.ID_IN_USE, `question '${id}' already exists`);
		const record = {
			id,
			questions: params.questions,
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.runId ? { runId: params.runId } : {},
			createdAtMs,
			expiresAtMs,
			status: "pending"
		};
		const entry = {
			record,
			expiryTimer: setTimeout(() => this.expire(record.id), timeoutMs),
			cleanupTimer: null,
			waiters: /* @__PURE__ */ new Set(),
			onResolved: params.onResolved,
			admissionContinuation: retainGatewayRootWorkAdmissionContinuationScope()
		};
		this.entries.set(record.id, entry);
		unrefTimer(entry.expiryTimer);
		return record;
	}
	get(id) {
		const entry = this.entries.get(id);
		if (!entry) return null;
		if (entry.record.status === "pending" && entry.record.expiresAtMs <= Date.now()) this.expire(id);
		return this.entries.get(id)?.record ?? null;
	}
	list() {
		const records = [];
		for (const id of this.entries.keys()) {
			const record = this.get(id);
			if (record?.status === "pending") records.push(record);
		}
		return records.toSorted((left, right) => left.createdAtMs - right.createdAtMs || left.id.localeCompare(right.id));
	}
	/** Re-enters only the still-pending question's original admitted root. */
	runPendingContinuation(id, run) {
		const entry = this.entries.get(id);
		if (!entry?.admissionContinuation || entry.record.status !== "pending" || entry.record.expiresAtMs <= Date.now()) return null;
		return entry.admissionContinuation.run(run);
	}
	waitAnswer(id, timeoutMs) {
		const record = this.requireRecord(id);
		if (record.status !== "pending") return Promise.resolve(waitResult(record));
		const entry = this.entries.get(id);
		if (!entry) throw this.notFound(id);
		return new Promise((resolve) => {
			const waiter = {
				resolve,
				timer: null
			};
			entry.waiters.add(waiter);
			if (timeoutMs !== void 0) {
				waiter.timer = setTimeout(() => {
					entry.waiters.delete(waiter);
					resolve({ status: "pending" });
				}, resolveTimerTimeoutMs(timeoutMs, 1));
				unrefTimer(waiter.timer);
			}
		});
	}
	resolve(id, answers, resolvedBy) {
		const entry = this.requirePendingEntry(id);
		const canonical = this.validateAnswers(entry.record.questions, answers);
		entry.record = {
			...entry.record,
			status: "answered",
			answers: canonical,
			...resolvedBy ? { resolvedBy } : {}
		};
		this.finish(entry);
		return {
			status: "answered",
			answers: canonical
		};
	}
	cancel(id, resolvedBy) {
		const entry = this.requirePendingEntry(id);
		entry.record = {
			...entry.record,
			status: "cancelled",
			...resolvedBy ? { resolvedBy } : {}
		};
		this.finish(entry);
		return { status: "cancelled" };
	}
	/** Clears all manager-owned timers and releases waiters. */
	reset() {
		for (const entry of this.entries.values()) {
			clearTimeout(entry.expiryTimer);
			entry.admissionContinuation?.release();
			entry.admissionContinuation = null;
			if (entry.cleanupTimer) clearTimeout(entry.cleanupTimer);
			for (const waiter of entry.waiters) {
				if (waiter.timer) clearTimeout(waiter.timer);
				waiter.resolve(waitResult(entry.record));
			}
			entry.waiters.clear();
		}
		this.entries.clear();
	}
	requireRecord(id) {
		const record = this.get(id);
		if (!record) throw this.notFound(id);
		return record;
	}
	requirePendingEntry(id) {
		const record = this.requireRecord(id);
		if (record.status !== "pending") throw new QuestionManagerError(QuestionManagerErrorCodes.ALREADY_TERMINAL, `question '${id}' is already ${record.status}`);
		const entry = this.entries.get(id);
		if (!entry) throw this.notFound(id);
		return entry;
	}
	/** Validates answers against stored questions and returns them in canonical form. */
	validateAnswers(questions, answers) {
		const submittedIds = Object.keys(answers.answers);
		const questionsById = new Map(questions.map((question) => [question.questionId, question]));
		const unknownId = submittedIds.find((id) => !questionsById.has(id));
		if (unknownId) throw this.invalidAnswer(unknownId, "is not part of this request");
		const canonical = { answers: {} };
		for (const question of questions) {
			const values = Object.hasOwn(answers.answers, question.questionId) ? answers.answers[question.questionId] : void 0;
			if (!values || values.length === 0) throw this.invalidAnswer(question.questionId, "requires an answer");
			if (values.some((value) => !value.trim())) throw this.invalidAnswer(question.questionId, "contains an empty answer");
			if (!question.multiSelect && values.length > 1) throw this.invalidAnswer(question.questionId, "does not allow multiple answers");
			const canonicalValues = values.map((value) => {
				const matched = question.options.find((option) => option.label.trim() === value.trim());
				return matched ? matched.label : value.trim();
			});
			if (question.options.length > 0 && !question.isOther && canonicalValues.some((value) => !question.options.some((option) => option.label === value))) throw this.invalidAnswer(question.questionId, "contains an unknown option");
			canonical.answers[question.questionId] = canonicalValues;
		}
		return canonical;
	}
	invalidAnswer(id, reason) {
		return new QuestionManagerError(QuestionManagerErrorCodes.INVALID_ANSWER, `question '${id}' ${reason}`);
	}
	notFound(id) {
		return new QuestionManagerError(QuestionManagerErrorCodes.NOT_FOUND, `question '${id}' was not found`);
	}
	expire(id) {
		const entry = this.entries.get(id);
		if (!entry || entry.record.status !== "pending") return;
		entry.record = {
			...entry.record,
			status: "expired"
		};
		this.finish(entry);
	}
	finish(entry) {
		clearTimeout(entry.expiryTimer);
		entry.admissionContinuation?.release();
		entry.admissionContinuation = null;
		const result = waitResult(entry.record);
		for (const waiter of entry.waiters) {
			if (waiter.timer) clearTimeout(waiter.timer);
			waiter.resolve(result);
		}
		entry.waiters.clear();
		const event = resolvedEvent(entry.record);
		if (event) try {
			entry.onResolved?.(event);
		} catch {}
		const cleanupTimer = setTimeout(() => {
			if (entry.cleanupTimer === cleanupTimer && this.entries.get(entry.record.id) === entry) this.entries.delete(entry.record.id);
		}, QUESTION_RESOLVED_ENTRY_GRACE_MS);
		entry.cleanupTimer = cleanupTimer;
		unrefTimer(cleanupTimer);
	}
};
//#endregion
export { QuestionManagerError as n, QuestionManagerErrorCodes as r, QuestionManager as t };
