import { n as readCompletedFileMutationDelta } from "./file-mutation-args-DnIaOu5F.js";
import { n as resolveFileMutationToolName } from "./tool-mutation-names-DbOogX1N.js";
import { C as resolveChannelStreamingProgressCommentary, S as resolveChannelStreamingPreviewToolProgress, T as resolveChannelStreamingSuppressDefaultToolProgressMessages, c as isChannelProgressDraftWorkToolName, f as normalizeChannelProgressDraftLineIdentity, g as resolveChannelProgressDraftMaxLines, h as resolveChannelProgressDraftMaxLineChars, n as buildChannelProgressDraftLineForEntry, o as formatChannelProgressDraftText, r as createChannelProgressDraftGate, u as mergeChannelProgressDraftLine } from "./streaming-3t37hp7G.js";
import { a as sanitizeProgressStatusText, i as normalizeReasoningProgressLine, n as mergeReasoningProgressText, r as normalizeCommentaryProgressText, t as formatReasoningProgressDisplayLine } from "./progress-draft-status-text-DHLH_p9V.js";
import { t as settleProgressVisibilityCallbackResult } from "./progress-visibility-DVUJibF4.js";
//#region src/channels/progress-draft-diffstat.ts
const MAX_TRACKED_MUTATION_FILES = 256;
const MAX_PENDING_MUTATION_DIFFS = 64;
function createProgressDraftDiffStatTracker(params) {
	let hasCommittedDiff = false;
	let mutationFiles = /* @__PURE__ */ new Set();
	let mutationOverflowFiles = 0;
	let mutationAdded = 0;
	let mutationRemoved = 0;
	let pendingMutationDiffs = /* @__PURE__ */ new Map();
	const reset = () => {
		hasCommittedDiff = false;
		mutationFiles = /* @__PURE__ */ new Set();
		mutationOverflowFiles = 0;
		mutationAdded = 0;
		mutationRemoved = 0;
		pendingMutationDiffs = /* @__PURE__ */ new Map();
	};
	const stageToolEvent = (payload) => {
		if (!params.canStage()) return;
		const toolCallId = payload.toolCallId?.trim();
		if (payload.phase !== "start" || !toolCallId || !payload.name || !payload.args) return;
		const kind = resolveFileMutationToolName(payload.name);
		const delta = kind ? readCompletedFileMutationDelta(kind, payload.args) : void 0;
		if (!delta) return;
		if (!pendingMutationDiffs.has(toolCallId) && pendingMutationDiffs.size >= MAX_PENDING_MUTATION_DIFFS) return;
		pendingMutationDiffs.set(toolCallId, delta);
	};
	const commitItemEvent = (payload) => {
		const toolCallId = payload.toolCallId?.trim();
		if (!toolCallId || payload.phase !== "end") return;
		const delta = pendingMutationDiffs.get(toolCallId);
		if (!delta) return;
		pendingMutationDiffs.delete(toolCallId);
		const status = payload.status?.trim().toLowerCase();
		if (status === "failed" || status === "error") return;
		hasCommittedDiff = true;
		mutationAdded += delta.added;
		mutationRemoved += delta.removed;
		for (const file of delta.files) {
			if (mutationFiles.has(file)) continue;
			if (mutationFiles.size < MAX_TRACKED_MUTATION_FILES) {
				mutationFiles.add(file);
				continue;
			}
			mutationOverflowFiles += 1;
		}
	};
	const resolve = () => hasCommittedDiff ? {
		files: mutationFiles.size + mutationOverflowFiles,
		added: mutationAdded,
		removed: mutationRemoved
	} : void 0;
	return {
		stageToolEvent,
		commitItemEvent,
		resolve,
		reset
	};
}
//#endregion
//#region src/channels/progress-draft-events.ts
function createChannelProgressDraftEventHandlers(params) {
	const pushEvent = (input, detailMode) => {
		const lineOptions = detailMode ? { detailMode } : void 0;
		const line = params.buildLine ? params.buildLine(input, lineOptions) : buildChannelProgressDraftLineForEntry(params.entry, input, lineOptions);
		return params.pushLine(line, input.event === "tool" ? { toolName: input.name?.trim() } : {});
	};
	return {
		pushToolEvent: (payload) => {
			const { detailMode, ...input } = payload;
			params.onTool?.(payload);
			return pushEvent({
				event: "tool",
				...input
			}, detailMode);
		},
		pushItemEvent: (payload) => {
			const { kind: itemKind, ...input } = payload;
			params.onItem?.(payload);
			return pushEvent({
				event: "item",
				...input,
				itemKind
			});
		},
		pushApprovalEvent: (payload) => {
			return payload.phase === "requested" ? pushEvent({
				event: "approval",
				...payload
			}) : Promise.resolve(false);
		},
		pushCommandOutputEvent: (payload) => {
			return payload.phase === "end" ? pushEvent({
				event: "command-output",
				...payload
			}) : Promise.resolve(false);
		},
		pushPatchEvent: (payload) => {
			return payload.phase === "end" ? pushEvent({
				event: "patch",
				...payload
			}) : Promise.resolve(false);
		}
	};
}
//#endregion
//#region src/channels/progress-draft-lines.ts
/**
* Removes a keyed structured progress line while preserving plain text draft lines.
* Returns the original array when no line is removed so renderers can use identity as a no-op signal.
*/
function removeChannelProgressDraftLine(lines, id) {
	const lineId = id.trim();
	if (!lineId) return lines;
	const next = lines.filter((line) => typeof line !== "object" || line.id?.trim() !== lineId);
	return next.length === lines.length ? lines : next;
}
//#endregion
//#region src/channels/progress-receipt-tracker.ts
/** Tracks per-turn activity for compact progress receipts. */
function createChannelProgressReceiptTracker(params) {
	const now = params?.now ?? Date.now;
	let startedAt = now();
	let reasoningSteps = 0;
	let toolCalls = 0;
	let commentaryNotes = 0;
	let reasoningOpen = false;
	const seenCommentaryIds = /* @__PURE__ */ new Set();
	let lastCommentaryText = "";
	const closeReasoning = () => {
		if (!reasoningOpen) return;
		reasoningOpen = false;
		reasoningSteps += 1;
	};
	const reset = () => {
		startedAt = now();
		reasoningSteps = 0;
		toolCalls = 0;
		commentaryNotes = 0;
		reasoningOpen = false;
		seenCommentaryIds.clear();
		lastCommentaryText = "";
	};
	const elapsedSeconds = () => Math.max(1, Math.round((now() - startedAt) / 1e3));
	return {
		noteReasoning() {
			reasoningOpen = true;
		},
		closeReasoning,
		noteToolCall(toolName) {
			closeReasoning();
			if (isChannelProgressDraftWorkToolName(toolName)) toolCalls += 1;
		},
		noteCommentary(itemId, text) {
			const trimmed = text?.trim();
			if (!trimmed) return;
			if (itemId) {
				if (!seenCommentaryIds.has(itemId)) {
					seenCommentaryIds.add(itemId);
					commentaryNotes += 1;
				}
				return;
			}
			if (trimmed !== lastCommentaryText) {
				lastCommentaryText = trimmed;
				commentaryNotes += 1;
			}
		},
		reset,
		get toolCalls() {
			return toolCalls;
		},
		get elapsedSeconds() {
			return elapsedSeconds();
		},
		buildSummaryLine() {
			closeReasoning();
			const seconds = elapsedSeconds();
			return [
				...reasoningSteps > 0 ? [`🧠 ${reasoningSteps} thought${reasoningSteps === 1 ? "" : "s"}`] : [],
				...commentaryNotes > 0 ? [`💬 ${commentaryNotes} note${commentaryNotes === 1 ? "" : "s"}`] : [],
				...toolCalls > 0 ? [`🛠️ ${toolCalls} tool call${toolCalls === 1 ? "" : "s"}`] : [],
				`⏱️ ${seconds}s`
			].join(" · ");
		}
	};
}
//#endregion
//#region src/channels/progress-draft-compositor.ts
const PROGRESS_STATUS_PREAMBLE_FRESH_MS = 2e4;
/** Creates a stateful compositor for one streaming channel reply. */
function createChannelProgressDraftCompositor(params) {
	const now = params.now ?? Date.now;
	const setTimeoutFn = params.setTimeoutFn ?? setTimeout;
	const clearTimeoutFn = params.clearTimeoutFn ?? clearTimeout;
	const reasoningLinePrefix = params.reasoningLinePrefix ?? "";
	const commentaryLinePrefix = params.commentaryLinePrefix ?? "";
	const commentaryItalics = params.commentaryItalics ?? true;
	const stripLaneItalics = (text) => text.split("\n").map((line) => line.replace(/^_(.*)_$/su, "$1")).join("\n");
	const previewToolProgressEnabled = params.active && resolveChannelStreamingPreviewToolProgress(params.entry, true, params.mode);
	const commentaryProgressEnabled = params.active && resolveChannelStreamingProgressCommentary(params.entry, false, params.mode);
	const thinkingProgressEnabled = params.active && (params.reasoningGate ?? previewToolProgressEnabled);
	const suppressDefaultToolProgressMessages = params.active && resolveChannelStreamingSuppressDefaultToolProgressMessages(params.entry, {
		draftStreamActive: true,
		mode: params.mode,
		previewToolProgressEnabled
	});
	let progressSuppressed = false;
	let lines = [];
	let lastRenderedText = "";
	let lastRenderedLines = lines;
	let lastRenderedDiffStatKey = "";
	let reasoningRawText = "";
	let lastReasoningLine;
	let lastIdLessCommentaryId;
	let lastIdLessCommentaryBare = "";
	let preambleText = "";
	let preambleItemId;
	let preambleAt;
	let narrationText = "";
	let planSteps;
	let planExplanation = "";
	let finalReplyStarted = false;
	let finalReplyDelivered = false;
	const diffStatTracker = createProgressDraftDiffStatTracker({ canStage: () => params.active && params.mode === "progress" && !progressSuppressed && !finalReplyStarted && !finalReplyDelivered });
	let preambleExpiryTimer;
	let lastStartRendered = false;
	const mergeReasoningProgress = (text, options) => {
		if (!text) return "";
		reasoningRawText = mergeReasoningProgressText(reasoningRawText, text, { snapshot: options?.snapshot === true });
		return normalizeReasoningProgressLine(reasoningRawText);
	};
	const clearPreambleExpiryTimer = () => {
		if (preambleExpiryTimer !== void 0) {
			clearTimeoutFn(preambleExpiryTimer);
			preambleExpiryTimer = void 0;
		}
	};
	const resolveStatusText = () => {
		const preambleIsFresh = preambleAt !== void 0 && now() - preambleAt < 2e4;
		const effectiveNarration = narrationText || planExplanation;
		return preambleText && (preambleIsFresh || !effectiveNarration) ? preambleText : effectiveNarration;
	};
	const formatDraftText = (draftLines = lines, options) => {
		const narration = resolveStatusText() || void 0;
		const linesRenderedByChannel = params.rendersRollingLinesNatively === true && Boolean(narration || planSteps?.length);
		return formatChannelProgressDraftText({
			entry: params.entry,
			lines: linesRenderedByChannel ? [] : draftLines,
			seed: params.seed,
			formatLine: options?.formatted === false ? void 0 : params.formatLine,
			narration,
			plan: planSteps
		});
	};
	const resolveDiffStat = diffStatTracker.resolve;
	const getSnapshot = () => {
		const statusHeadline = resolveStatusText();
		const diffStat = resolveDiffStat();
		return {
			lines: lines.map((line) => typeof line === "string" ? line : { ...line }),
			...statusHeadline ? { statusHeadline } : {},
			...planSteps ? { plan: planSteps.map((entry) => ({ ...entry })) } : {},
			...planExplanation ? { planExplanation } : {},
			...diffStat ? { diffStat } : {}
		};
	};
	const clearProgressState = (suppressed) => {
		clearPreambleExpiryTimer();
		progressSuppressed = suppressed;
		lines = [];
		lastRenderedText = "";
		lastRenderedLines = lines;
		lastRenderedDiffStatKey = "";
		reasoningRawText = "";
		lastReasoningLine = void 0;
		lastIdLessCommentaryId = void 0;
		lastIdLessCommentaryBare = "";
		preambleText = "";
		preambleItemId = void 0;
		preambleAt = void 0;
		narrationText = "";
		planSteps = void 0;
		planExplanation = "";
		diffStatTracker.reset();
		lastStartRendered = false;
	};
	const publish = async (options) => {
		const text = formatDraftText();
		const diffStatKey = JSON.stringify(resolveDiffStat() ?? null);
		const structuredStateChanged = params.updateOnLineChange === true && (lines !== lastRenderedLines || diffStatKey !== lastRenderedDiffStatKey);
		if (!text || text === lastRenderedText && !structuredStateChanged) return false;
		if (!(await settleProgressVisibilityCallbackResult(params.update(text, {
			...options,
			lines: [...lines]
		}))).visible) return false;
		lastRenderedText = text;
		lastRenderedLines = lines;
		lastRenderedDiffStatKey = diffStatKey;
		return true;
	};
	const render = async (options) => {
		if (!params.active || params.mode !== "progress" || finalReplyStarted || finalReplyDelivered) return false;
		return await publish(options);
	};
	const schedulePreambleExpiryRefresh = () => {
		clearPreambleExpiryTimer();
		if (!preambleText || !narrationText || preambleAt === void 0 || !gate.hasStarted || finalReplyStarted || finalReplyDelivered) return;
		const remaining = PROGRESS_STATUS_PREAMBLE_FRESH_MS - (now() - preambleAt);
		if (remaining <= 0) return;
		preambleExpiryTimer = setTimeoutFn(() => {
			preambleExpiryTimer = void 0;
			render().catch((err) => {
				console.warn(`[progress-draft] channel progress status refresh failed: ${String(err)}`);
			});
		}, remaining);
	};
	const gate = createChannelProgressDraftGate({
		onStart: async () => {
			lastStartRendered = await render({ flush: true });
			schedulePreambleExpiryRefresh();
		},
		setTimeoutFn,
		clearTimeoutFn
	});
	/**
	* Commentary line identity. An explicit item id owns its line. Without one,
	* providers stream cumulative snapshots ("Checking" → "Checking the
	* workspace"), so a snapshot that continues the open line reuses its id and
	* updates in place; anything else starts a new line.
	*/
	const resolveCommentaryLineId = (commentary) => {
		if (commentary.itemId) return `commentary:${commentary.itemId}`;
		if (!commentary.normalized) return "";
		if (Boolean(lastIdLessCommentaryBare) && (commentary.bareNormalized.startsWith(lastIdLessCommentaryBare) || lastIdLessCommentaryBare.startsWith(commentary.bareNormalized)) && lastIdLessCommentaryId) return lastIdLessCommentaryId;
		return `commentary:${commentary.normalized}`;
	};
	const clearLine = async (lineId) => {
		const nextLines = removeChannelProgressDraftLine(lines, lineId);
		if (nextLines === lines) return;
		lines = nextLines;
		if (!gate.hasStarted) return;
		if (formatDraftText()) {
			await render();
			return;
		}
		lastRenderedText = "";
		await params.deleteCurrent?.();
	};
	const noteProgress = async (line, options) => {
		if (!params.active || finalReplyStarted || finalReplyDelivered) return false;
		if (options?.toolName !== void 0 && !isChannelProgressDraftWorkToolName(options.toolName)) return false;
		if (params.isEmptyLine?.(line)) return false;
		const normalized = normalizeChannelProgressDraftLineIdentity(line);
		if (!normalized || progressSuppressed) return false;
		if (params.mode !== "progress" && !previewToolProgressEnabled) return false;
		const progressLine = typeof line === "object" && line !== void 0 ? line : normalized;
		const shouldStoreLine = previewToolProgressEnabled;
		const nextLines = shouldStoreLine ? mergeChannelProgressDraftLine(lines, progressLine, { maxLines: resolveChannelProgressDraftMaxLines(params.entry) }) : lines;
		const lineChanged = nextLines !== lines;
		const hasUnconfirmedRender = formatDraftText(nextLines) !== lastRenderedText;
		const diffStatChanged = params.updateOnLineChange === true && JSON.stringify(resolveDiffStat() ?? null) !== lastRenderedDiffStatKey;
		if (shouldStoreLine && !lineChanged && !hasUnconfirmedRender && !diffStatChanged) return false;
		if (shouldStoreLine && lineChanged) {
			reasoningRawText = "";
			lastReasoningLine = void 0;
		}
		if (shouldStoreLine && params.tryNativeUpdate) {
			const text = formatDraftText(nextLines, { formatted: false });
			if (text && await params.tryNativeUpdate(text)) {
				lines = nextLines;
				lastRenderedText = text;
				lastRenderedLines = lines;
				return true;
			}
		}
		lines = nextLines;
		if (params.mode !== "progress") return shouldStoreLine ? await publish() : false;
		if (options?.startImmediately || params.shouldStartNow?.(line)) {
			const alreadyStarted = gate.hasStarted;
			if (!alreadyStarted) lastStartRendered = false;
			await gate.startNow();
			if (!gate.hasStarted) return false;
			return alreadyStarted ? await render() : lastStartRendered;
		}
		const alreadyStarted = gate.hasStarted;
		const progressActive = await gate.noteWork();
		if ((alreadyStarted || progressActive) && gate.hasStarted) return await render();
		return false;
	};
	return {
		get previewToolProgressEnabled() {
			return previewToolProgressEnabled;
		},
		get commentaryProgressEnabled() {
			return commentaryProgressEnabled;
		},
		get suppressDefaultToolProgressMessages() {
			return suppressDefaultToolProgressMessages;
		},
		get hasStarted() {
			return gate.hasStarted;
		},
		get isVisible() {
			return Boolean(lastRenderedText) && !finalReplyStarted && !finalReplyDelivered;
		},
		get hasStatusHeadline() {
			return Boolean(resolveStatusText());
		},
		get hasPlanProgress() {
			return Boolean(planSteps?.length);
		},
		getSnapshot,
		markFinalReplyStarted() {
			finalReplyStarted = true;
			gate.cancel();
			clearPreambleExpiryTimer();
		},
		markFinalReplyDelivered() {
			finalReplyDelivered = true;
			clearPreambleExpiryTimer();
		},
		beginNewTurn(options) {
			if (options?.force !== true && !finalReplyStarted && !finalReplyDelivered) return false;
			finalReplyStarted = false;
			finalReplyDelivered = false;
			gate.reset();
			clearProgressState(false);
			return true;
		},
		reset() {
			clearProgressState(false);
		},
		resetReasoningProgress() {
			reasoningRawText = "";
		},
		mergeReasoningProgress,
		suppress() {
			clearProgressState(true);
		},
		cancel() {
			gate.cancel();
			clearPreambleExpiryTimer();
		},
		start() {
			return gate.startNow();
		},
		async noteActivity(options) {
			if (!params.active || params.mode !== "progress" || progressSuppressed || finalReplyStarted || finalReplyDelivered) return false;
			if (options?.startImmediately) {
				const alreadyStarted = gate.hasStarted;
				if (!alreadyStarted) lastStartRendered = false;
				await gate.startNow();
				if (!gate.hasStarted) return false;
				return alreadyStarted ? await render({ flush: true }) : lastStartRendered;
			}
			const alreadyStarted = gate.hasStarted;
			const progressActive = await gate.noteWork();
			if ((alreadyStarted || progressActive) && gate.hasStarted) return await render();
			return false;
		},
		pushToolProgress: noteProgress,
		...createChannelProgressDraftEventHandlers({
			entry: params.entry,
			pushLine: noteProgress,
			onTool: diffStatTracker.stageToolEvent,
			onItem: diffStatTracker.commitItemEvent,
			...params.buildProgressEventLine ? { buildLine: params.buildProgressEventLine } : {}
		}),
		async pushPlanProgress(steps, options) {
			if (!params.active || params.mode !== "progress" || progressSuppressed || finalReplyStarted || finalReplyDelivered) return false;
			planSteps = steps && steps.length > 0 ? steps.map((entry) => ({ ...entry })) : void 0;
			planExplanation = options?.explanation?.replace(/\s+/g, " ").trim() ?? "";
			if (!planSteps && !planExplanation) {
				if (!gate.hasStarted) return false;
				const rendered = await render();
				if (rendered || formatDraftText()) return rendered;
				lastRenderedText = "";
				await params.deleteCurrent?.();
				return true;
			}
			const alreadyStarted = gate.hasStarted;
			if (!alreadyStarted) lastStartRendered = false;
			await gate.startNow();
			if (!gate.hasStarted) return false;
			return alreadyStarted ? await render() : lastStartRendered;
		},
		async pushPreambleHeadline(text, options) {
			if (!params.active || params.mode !== "progress" || progressSuppressed) return false;
			if (commentaryProgressEnabled) return false;
			if (finalReplyStarted || finalReplyDelivered) return false;
			const itemId = options?.itemId?.trim() || void 0;
			const normalized = sanitizeProgressStatusText(text ?? "").replace(/\s+/g, " ").trim();
			if (!normalized) {
				if (!itemId || itemId !== preambleItemId) return false;
				preambleText = "";
				preambleItemId = void 0;
				preambleAt = void 0;
				clearPreambleExpiryTimer();
				if (!gate.hasStarted) return false;
				const rendered = await render();
				if (rendered || formatDraftText()) return rendered;
				lastRenderedText = "";
				await params.deleteCurrent?.();
				return true;
			}
			const isNewPreambleItem = Boolean(itemId && itemId !== preambleItemId);
			if (isNewPreambleItem) preambleItemId = itemId;
			else if (!itemId) preambleItemId = void 0;
			if (normalized === preambleText && !isNewPreambleItem) return false;
			preambleText = normalized;
			preambleAt = now();
			schedulePreambleExpiryRefresh();
			return gate.hasStarted ? await render() : false;
		},
		async pushNarrationProgress(text) {
			if (!params.active || params.mode !== "progress" || progressSuppressed) return false;
			if (finalReplyStarted || finalReplyDelivered) return false;
			const normalized = text?.replace(/\s+/g, " ").trim() ?? "";
			if (normalized === narrationText) return false;
			if (!normalized) {
				narrationText = "";
				clearPreambleExpiryTimer();
				return await render();
			}
			narrationText = normalized;
			schedulePreambleExpiryRefresh();
			return gate.hasStarted ? await render() : false;
		},
		async pushReasoningProgress(text, options) {
			if (!params.active || params.mode !== "progress" || !text || progressSuppressed || finalReplyDelivered || !thinkingProgressEnabled) return false;
			const normalized = mergeReasoningProgress(text, options);
			if (!normalized) return false;
			const compactLine = formatReasoningProgressDisplayLine(normalized, resolveChannelProgressDraftMaxLineChars(params.entry));
			if (!compactLine) return false;
			const displayLine = `${reasoningLinePrefix}${compactLine}`;
			const priorIndex = lastReasoningLine === void 0 ? -1 : lines.lastIndexOf(lastReasoningLine);
			if (priorIndex >= 0) {
				lines = [...lines];
				lines[priorIndex] = displayLine;
			} else lines = [...lines, displayLine].slice(-resolveChannelProgressDraftMaxLines(params.entry));
			lastReasoningLine = displayLine;
			if (await gate.noteWork() && gate.hasStarted) return await render();
			return false;
		},
		async pushCommentaryProgress(text, options) {
			if (!params.active || params.mode !== "progress" || !commentaryProgressEnabled) return false;
			if (finalReplyStarted || finalReplyDelivered) return false;
			const itemId = options?.itemId?.trim();
			if (!text && !itemId) return false;
			const normalized = normalizeCommentaryProgressText(text ?? "");
			const bareNormalized = stripLaneItalics(normalized);
			const lineId = resolveCommentaryLineId({
				itemId,
				normalized,
				bareNormalized
			});
			if (!normalized) {
				if (lineId) await clearLine(lineId);
				return false;
			}
			const line = {
				id: lineId,
				text: `${commentaryLinePrefix}${commentaryItalics ? normalized : bareNormalized}`,
				kind: "item",
				label: "Commentary",
				prefix: false
			};
			lines = mergeChannelProgressDraftLine(lines, line, { maxLines: resolveChannelProgressDraftMaxLines(params.entry) });
			if (!itemId) {
				lastIdLessCommentaryId = lineId;
				lastIdLessCommentaryBare = bareNormalized;
			}
			const alreadyStarted = gate.hasStarted;
			if (!alreadyStarted) lastStartRendered = false;
			await gate.startNow();
			if (!gate.hasStarted) return false;
			return alreadyStarted ? await render() : lastStartRendered;
		}
	};
}
//#endregion
export { createChannelProgressDraftCompositor as n, createChannelProgressReceiptTracker as r, PROGRESS_STATUS_PREAMBLE_FRESH_MS as t };
