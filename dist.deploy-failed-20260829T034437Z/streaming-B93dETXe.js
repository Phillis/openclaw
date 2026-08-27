import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { t as asBoolean } from "./boolean-DmBL0YJK.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { a as isShellToolDisplayName, i as isCommandBearingToolCall, o as resolveToolDisplay, t as formatToolDetail } from "./tool-display-Dsp8HXJK.js";
import { n as formatToolAggregateParts, t as formatToolAggregate } from "./tool-meta-x_qgg5vY.js";
import { t as getChannelStreamingConfigObject } from "./streaming-config-readers-hq5t1bLI.js";
//#region src/shared/progress-labels.ts
const DEFAULT_PROGRESS_DRAFT_LABELS = ["Working"];
function hashProgressSeed(seed) {
	let hash = 2166136261;
	for (let index = 0; index < seed.length; index += 1) {
		hash ^= seed.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}
function selectProgressLabel(params) {
	const labels = params.labels ?? DEFAULT_PROGRESS_DRAFT_LABELS;
	if (labels.length === 0) return;
	return labels[typeof params.seed === "string" && params.seed.length > 0 ? hashProgressSeed(params.seed) % labels.length : Math.floor(Math.max(0, Math.min(.999999, params.random?.() ?? 0)) * labels.length)] ?? labels[0];
}
//#endregion
//#region src/channels/streaming.ts
function asInteger(value) {
	return typeof value === "number" && Number.isInteger(value) ? value : void 0;
}
function normalizeStreamingMode(value) {
	if (typeof value !== "string") return null;
	return normalizeOptionalLowercaseString(value) || null;
}
function parsePreviewStreamingMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "off" || normalized === "partial" || normalized === "block" || normalized === "progress") return normalized;
	return null;
}
function asProgressConfig(value) {
	return asNullableRecord(value) ?? void 0;
}
function asCommandTextMode(value) {
	return value === "raw" || value === "status" ? value : void 0;
}
const DEFAULT_PROGRESS_DRAFT_INITIAL_DELAY_MS = 1500;
const DEFAULT_PROGRESS_DRAFT_MAX_LINE_CHARS = 120;
const PROGRESS_DRAFT_NARRATION_MAX_CHARS = 280;
const MIN_TRUNCATED_FINAL_PREFIX_CHARS = 48;
const MIN_TRUNCATED_FINAL_CONTINUATION_CHARS = 24;
const NON_WORK_PROGRESS_TOOL_NAMES = /* @__PURE__ */ new Set([
	"message",
	"messages",
	"reply",
	"send",
	"reaction",
	"react",
	"typing",
	"progress_card",
	"update_plan"
]);
function isChannelProgressDraftWorkToolName(name) {
	const normalized = normalizeOptionalLowercaseString(name);
	return Boolean(normalized && !NON_WORK_PROGRESS_TOOL_NAMES.has(normalized));
}
function stripTrailingEllipsis(text) {
	return text.replace(/(?:\s*(?:\.{3}|\u2026))+$/u, "").trimEnd();
}
function isPotentialTruncatedFinal(finalText) {
	const trimmedFinal = finalText.trimEnd();
	const untruncatedFinal = stripTrailingEllipsis(trimmedFinal);
	return untruncatedFinal.length >= MIN_TRUNCATED_FINAL_PREFIX_CHARS && untruncatedFinal !== trimmedFinal;
}
function selectLongerFinalText(params) {
	const finalText = params.finalText.trimEnd();
	if (!isPotentialTruncatedFinal(finalText)) return;
	const untruncatedFinal = stripTrailingEllipsis(finalText);
	for (const candidate of params.candidateTexts) {
		const candidateText = candidate?.trimEnd();
		if (!candidateText || candidateText.length <= finalText.length || !candidateText.startsWith(untruncatedFinal)) continue;
		const continuation = candidateText.slice(untruncatedFinal.length).trimStart();
		if (continuation.length >= MIN_TRUNCATED_FINAL_CONTINUATION_CHARS && /^[\p{L}\p{N}]/u.test(continuation)) return candidateText;
	}
}
async function resolveTranscriptBackedChannelFinalText(params) {
	if (!isPotentialTruncatedFinal(params.finalText)) return params.finalText;
	const candidateText = await params.resolveCandidateText();
	return selectLongerFinalText({
		finalText: params.finalText,
		candidateTexts: [candidateText]
	}) ?? params.finalText;
}
function isAgentPlanStepStatus(value) {
	return value === "pending" || value === "in_progress" || value === "completed";
}
/**
* TODO(remove): normalizes the pre-2026.7.2 string plan-step wire shape to
* pending typed steps. Bundled producers all emit typed steps, and
* @openclaw/codex is force-updated with core, so this only covers a plugin
* pinned against an update. Delete once that cannot happen.
*/
function normalizeAgentPlanSteps(value) {
	if (!Array.isArray(value)) return;
	return value.flatMap((entry) => {
		if (typeof entry === "string") {
			const step = entry.trim();
			return step ? [{
				step,
				status: "pending"
			}] : [];
		}
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
		const rawStep = entry.step;
		const status = entry.status;
		const step = typeof rawStep === "string" ? rawStep.trim() : "";
		return step && isAgentPlanStepStatus(status) ? [{
			step,
			status
		}] : [];
	});
}
const EMOJI_PREFIX_RE = /^\p{Extended_Pictographic}/u;
const progressDraftLineCorrelationKeys = /* @__PURE__ */ new WeakMap();
function compactStrings(values) {
	return values.map((value) => value?.replace(/\s+/g, " ").trim()).filter(Boolean);
}
function inferToolMeta(name, args, detailMode = "explain") {
	if (!name || !args) return;
	return formatToolDetail(resolveToolDisplay({
		name,
		args,
		detailMode
	}));
}
function buildNamedProgressLine(kind, name, metas, options, fields) {
	const normalizedName = name?.trim() || "tool_call";
	const compactMetas = compactStrings(metas ?? []);
	const { text, detail } = formatToolAggregateParts(normalizedName, compactMetas.length ? compactMetas : void 0, { markdown: options?.markdown });
	const display = resolveToolDisplay({ name: normalizedName });
	const line = {
		...fields?.id ? { id: fields.id } : {},
		kind,
		text,
		label: display.label,
		icon: display.emoji,
		...detail ? { detail } : {},
		...fields?.status ? { status: fields.status } : {},
		toolName: display.name
	};
	setProgressDraftLineCorrelationKey(line, fields?.correlationKey);
	return line;
}
function setProgressDraftLineCorrelationKey(line, correlationKey) {
	const normalized = correlationKey?.trim();
	if (normalized) progressDraftLineCorrelationKeys.set(line, normalized);
}
function itemKindToToolName(kind) {
	switch (normalizeOptionalLowercaseString(kind)) {
		case "command": return "exec";
		case "patch": return "apply_patch";
		case "search": return "web_search";
		case "api": return "api";
		case "tool": return "tool_call";
		default: return;
	}
}
/** Tools whose detail is raw command text; commandText policy applies to these. */
function isCommandToolName(name) {
	return isCommandBearingToolCall(name);
}
function isCommandProgressItem(input) {
	const itemKind = normalizeOptionalLowercaseString(input.itemKind);
	return input.commandBearing === true || itemKind === "command" || isCommandToolName(input.name);
}
function resolveProgressDraftLineId(input, params) {
	const itemId = input.itemId?.trim();
	const toolCallId = input.toolCallId?.trim();
	if (itemId) return itemId;
	return params?.useToolCallIdFallback === true ? toolCallId : void 0;
}
function resolveCommandProgressCorrelationKey(input) {
	const toolCallId = input.toolCallId?.trim();
	return toolCallId ? `command:${toolCallId}` : void 0;
}
function isTerminalProgressStatus(status) {
	const normalized = normalizeOptionalLowercaseString(status);
	return normalized === "completed" || normalized === "failed" || normalized?.startsWith("exit ") === true;
}
function isEmptyReasoningProgressItem(input, meta) {
	return !meta && normalizeOptionalLowercaseString(input.itemKind) === "analysis" && normalizeOptionalLowercaseString(input.title) === "reasoning";
}
function patchMetas(input) {
	const fileMetas = [
		...input.added ?? [],
		...input.modified ?? [],
		...input.deleted ?? []
	];
	return compactStrings([
		input.summary,
		...fileMetas,
		input.title
	]);
}
function buildCommandOutputProgressLine(input, status, options) {
	const name = input.name ?? "exec";
	const correlationKey = resolveCommandProgressCorrelationKey(input);
	const detail = options?.commandText === "raw" ? compactStrings([input.title]) : [];
	const line = buildNamedProgressLine(input.event, name, detail, options, {
		correlationKey,
		id: resolveProgressDraftLineId(input, { useToolCallIdFallback: true }),
		status
	});
	if (!line || !status) return line;
	if (status === "completed") return line;
	if (!line.detail || line.detail === status) {
		const statusLine = {
			...line,
			detail: status,
			text: formatToolAggregate(name, [status], { markdown: options?.markdown })
		};
		setProgressDraftLineCorrelationKey(statusLine, correlationKey);
		return statusLine;
	}
	const statusLine = {
		...line,
		text: formatToolAggregate(name, [status, line.detail], { markdown: options?.markdown })
	};
	setProgressDraftLineCorrelationKey(statusLine, correlationKey);
	return statusLine;
}
function shouldPrefixProgressLine(line) {
	return !EMOJI_PREFIX_RE.test(line);
}
function formatChannelProgressDraftLine(input, options) {
	return buildChannelProgressDraftLine(input, options)?.text;
}
function resolveChannelProgressDraftLineOptions(entry, options) {
	return {
		...options,
		commandText: options?.commandText ?? resolveChannelStreamingPreviewCommandText(entry)
	};
}
function buildChannelProgressDraftLineForEntry(entry, input, options) {
	return buildChannelProgressDraftLine(input, resolveChannelProgressDraftLineOptions(entry, options));
}
function formatChannelProgressDraftLineForEntry(entry, input, options) {
	return buildChannelProgressDraftLineForEntry(entry, input, options)?.text;
}
function buildChannelProgressDraftLine(input, options) {
	switch (input.event) {
		case "tool": {
			const itemId = input.itemId ?? (input.toolCallId ? `tool:${input.toolCallId}` : void 0);
			const commandBearing = isCommandBearingToolCall(input.name, input.args);
			return buildNamedProgressLine(input.event, input.name, [options?.commandText !== "raw" && commandBearing ? void 0 : inferToolMeta(input.name, input.args, options?.detailMode), input.phase && !input.name ? input.phase : void 0], options, {
				correlationKey: commandBearing ? resolveCommandProgressCorrelationKey(input) : void 0,
				id: itemId
			});
		}
		case "item": {
			const name = input.name ?? itemKindToToolName(input.itemKind);
			const meta = options?.commandText !== "raw" && isCommandProgressItem(input) ? void 0 : input.meta ?? input.summary ?? input.progressText;
			if (isEmptyReasoningProgressItem(input, meta)) return;
			if (name) return buildNamedProgressLine(input.event, name, [meta], options, {
				correlationKey: isCommandProgressItem(input) ? resolveCommandProgressCorrelationKey(input) : void 0,
				id: resolveProgressDraftLineId(input),
				status: input.status
			});
			const text = compactStrings([meta, input.title]).at(0);
			const id = resolveProgressDraftLineId(input);
			const correlationKey = isCommandProgressItem(input) ? resolveCommandProgressCorrelationKey(input) : void 0;
			if (!text) return;
			const line = {
				...id ? { id } : {},
				kind: input.event,
				text,
				label: input.title?.trim() || input.itemKind?.trim() || "Update",
				...input.status ? { status: input.status } : {}
			};
			setProgressDraftLineCorrelationKey(line, correlationKey);
			return line;
		}
		case "plan":
			if (input.phase !== void 0 && input.phase !== "update") return;
			return buildNamedProgressLine(input.event, "progress_card", [
				input.explanation,
				normalizeAgentPlanSteps(input.steps)?.[0]?.step,
				input.title ?? "planning"
			], options);
		case "approval":
			if (input.phase !== void 0 && input.phase !== "requested") return;
			return buildNamedProgressLine(input.event, "approval", [
				input.command,
				input.message,
				input.reason,
				input.title ?? "approval requested"
			], options, { status: "requested" });
		case "command-output":
			if (input.phase !== void 0 && input.phase !== "end") return;
			return buildCommandOutputProgressLine(input, input.exitCode === 0 ? "completed" : input.exitCode != null ? `exit ${input.exitCode}` : input.status, options);
		case "patch":
			if (input.phase !== void 0 && input.phase !== "end") return;
			return buildNamedProgressLine(input.event, input.name ?? "apply_patch", patchMetas(input), options, { id: input.itemId ?? input.toolCallId });
	}
}
function createChannelProgressDraftGate(params) {
	const initialDelayMs = params.initialDelayMs ?? DEFAULT_PROGRESS_DRAFT_INITIAL_DELAY_MS;
	const setTimeoutFn = params.setTimeoutFn ?? setTimeout;
	const clearTimeoutFn = params.clearTimeoutFn ?? clearTimeout;
	const reportStartError = params.onStartError ?? ((error) => {
		console.warn(`[progress-draft] channel progress draft failed to start: ${String(error)}`);
	});
	let started = false;
	let disposed = false;
	let workEvents = 0;
	let timer;
	let startPromise;
	const clearTimer = () => {
		if (timer) {
			clearTimeoutFn(timer);
			timer = void 0;
		}
	};
	const start = () => {
		if (disposed || started) return startPromise ?? Promise.resolve();
		if (startPromise) return startPromise;
		clearTimer();
		started = true;
		const nextStart = Promise.resolve().then(params.onStart).then(() => {
			if (disposed) started = false;
			if (startPromise === nextStart) startPromise = void 0;
		}).catch((error) => {
			if (startPromise === nextStart) startPromise = void 0;
			started = false;
			throw error;
		});
		startPromise = nextStart;
		return startPromise;
	};
	const schedule = () => {
		if (timer || started || disposed || initialDelayMs < 0) return;
		timer = setTimeoutFn(() => {
			timer = void 0;
			start().catch((error) => {
				reportStartError(error);
			});
		}, initialDelayMs);
	};
	return {
		get hasStarted() {
			return started;
		},
		get workEvents() {
			return workEvents;
		},
		async noteWork() {
			if (disposed) return false;
			workEvents += 1;
			if (startPromise) {
				await startPromise;
				return started;
			}
			if (started) return true;
			schedule();
			return false;
		},
		async startNow() {
			await start();
		},
		cancel() {
			disposed = true;
			started = false;
			clearTimer();
		},
		reset() {
			clearTimer();
			started = false;
			disposed = false;
			workEvents = 0;
			startPromise = void 0;
		}
	};
}
function resolveChannelStreamingChunkMode(entry) {
	const mode = getChannelStreamingConfigObject(entry)?.chunkMode;
	return mode === "length" || mode === "newline" ? mode : void 0;
}
function resolveChannelStreamingBlockEnabled(entry, previewPolicy) {
	const explicitBlockStreaming = asBoolean(getChannelStreamingConfigObject(entry)?.block?.enabled);
	if (typeof explicitBlockStreaming === "boolean" || !previewPolicy) return explicitBlockStreaming;
	const explicitPreviewMode = parsePreviewStreamingMode(getChannelStreamingConfigObject(entry)?.mode);
	if (previewPolicy.previewAvailable && explicitPreviewMode !== null && explicitPreviewMode !== "off") return false;
	return previewPolicy.blockStreamingDefault === "on";
}
function resolveChannelStreamingBlockCoalesce(entry) {
	return asNullableRecord(getChannelStreamingConfigObject(entry)?.block?.coalesce) ?? void 0;
}
function resolveChannelStreamingPreviewChunk(entry) {
	return asNullableRecord(getChannelStreamingConfigObject(entry)?.preview?.chunk) ?? void 0;
}
function resolveChannelStreamingPreviewToolProgress(entry, defaultValue = true, mode) {
	const config = getChannelStreamingConfigObject(entry);
	if ((mode ?? resolveChannelPreviewStreamMode(entry, "partial")) === "progress") return asBoolean(config?.progress?.toolProgress) ?? asBoolean(config?.preview?.toolProgress) ?? defaultValue;
	return asBoolean(config?.preview?.toolProgress) ?? defaultValue;
}
function resolveChannelStreamingProgressCommentary(entry, defaultValue = false, mode) {
	const config = getChannelStreamingConfigObject(entry);
	if ((mode ?? resolveChannelPreviewStreamMode(entry, "partial")) !== "progress") return false;
	return asBoolean(asNullableRecord(config?.progress)?.commentary) ?? defaultValue;
}
function resolveChannelStreamingProgressNarration(entry, defaultValue = true) {
	return asBoolean(asNullableRecord(getChannelStreamingConfigObject(entry)?.progress)?.narration) ?? defaultValue;
}
function resolveChannelStreamingPreviewCommandText(entry, defaultValue = "status") {
	const config = getChannelStreamingConfigObject(entry);
	return asCommandTextMode(config?.progress?.commandText) ?? asCommandTextMode(config?.preview?.commandText) ?? defaultValue;
}
function resolveChannelStreamingSuppressDefaultToolProgressMessages(entry, options) {
	if (options?.draftStreamActive === false || options?.previewStreamingEnabled === false) return false;
	const mode = options?.mode ?? resolveChannelPreviewStreamMode(entry, "off");
	if (mode === "off") return false;
	if (mode === "progress") return true;
	if (options?.draftStreamActive === true) return true;
	return options?.previewToolProgressEnabled ?? resolveChannelStreamingPreviewToolProgress(entry);
}
function resolveChannelPreviewStreamMode(entry, defaultMode) {
	return parsePreviewStreamingMode(getChannelStreamingConfigObject(entry)?.mode) ?? defaultMode;
}
function resolveChannelProgressDraftConfig(entry) {
	return asProgressConfig(getChannelStreamingConfigObject(entry)?.progress) ?? {};
}
function normalizeProgressLabels(labels) {
	const normalized = normalizeTrimmedStringList(labels);
	if (normalized.length === 0) return [...DEFAULT_PROGRESS_DRAFT_LABELS];
	return normalized;
}
function resolveChannelProgressDraftLabel(params) {
	const progress = resolveChannelProgressDraftConfig(params.entry);
	if (progress.label === false) return;
	const normalizedLabel = typeof progress.label === "string" ? normalizeOptionalLowercaseString(progress.label) : null;
	if (typeof progress.label === "string" && progress.label.trim() && normalizedLabel !== "auto") return progress.label.trim();
	return selectProgressLabel({
		labels: normalizeProgressLabels(progress.labels),
		seed: params.seed,
		random: params.random
	});
}
function resolveChannelProgressDraftMaxLines(entry, defaultValue = 8) {
	const configured = asInteger(resolveChannelProgressDraftConfig(entry).maxLines);
	return configured && configured > 0 ? configured : defaultValue;
}
function resolveChannelProgressDraftMaxLineChars(entry, defaultValue = DEFAULT_PROGRESS_DRAFT_MAX_LINE_CHARS) {
	const configured = asInteger(resolveChannelProgressDraftConfig(entry).maxLineChars);
	return configured && configured > 0 ? configured : defaultValue;
}
function sliceCodePoints(value, start, end) {
	return Array.from(value).slice(start, end).join("");
}
function compactProgressLineDetail(detail, maxChars) {
	const chars = Array.from(detail);
	if (chars.length <= maxChars) return detail;
	if (maxChars <= 1) return "…";
	const keepStart = Math.max(1, Math.ceil((maxChars - 1) * .45));
	const keepEnd = Math.max(1, maxChars - keepStart - 1);
	const rawStart = chars.slice(0, keepStart).join("").trimEnd();
	return `${rawStart.length > 8 && /\s+\S+$/.test(rawStart) ? rawStart.replace(/\s+\S+$/, "") : rawStart}…${chars.slice(-keepEnd).join("").trimStart()}`;
}
function removeUnbalancedInlineBackticks(value) {
	if (Array.from(value).filter((char) => char === "`").length % 2 === 0) return value;
	return value.trimStart().startsWith("`") ? value.replaceAll("`", "'") : value.replaceAll("`", "");
}
function repairCompactedProgressMarkdown(value) {
	const withoutDanglingBackticks = removeUnbalancedInlineBackticks(value);
	const trimmedStart = withoutDanglingBackticks.trimStart();
	if (!trimmedStart.startsWith("_") || trimmedStart.endsWith("_")) return withoutDanglingBackticks;
	if (Array.from(trimmedStart).filter((char) => char === "_").length % 2 === 0) return withoutDanglingBackticks;
	return `${withoutDanglingBackticks.slice(0, withoutDanglingBackticks.length - trimmedStart.length)}${trimmedStart.slice(1)}`;
}
function compactChannelProgressDraftNarration(text) {
	const normalized = text.replace(/\s+/g, " ").trim();
	if (Array.from(normalized).length <= PROGRESS_DRAFT_NARRATION_MAX_CHARS) return normalized;
	return compactPlainProgressLine(normalized, PROGRESS_DRAFT_NARRATION_MAX_CHARS);
}
function compactPlainProgressLine(line, maxChars) {
	const head = sliceCodePoints(line, 0, maxChars - 1).trimEnd();
	const boundary = head.search(/\s+\S*$/u);
	if (boundary > Math.floor(maxChars * .6)) return `${head.slice(0, boundary).trimEnd()}…`;
	return `${head}…`;
}
function compactChannelProgressDraftLine(line, maxChars) {
	const normalized = line.replace(/\s+/g, " ").trim();
	if (!normalized) return "";
	if (Array.from(normalized).length <= maxChars) return normalized;
	if (maxChars <= 1) return "…";
	const compactWithPrefix = (prefix, detail) => {
		const detailLimit = maxChars - Array.from(prefix).length;
		if (detailLimit < 8) return;
		return repairCompactedProgressMarkdown(`${prefix}${compactProgressLineDetail(detail, detailLimit)}`);
	};
	const splitIndex = normalized.indexOf(": ");
	if (splitIndex > 0) {
		const compact = compactWithPrefix(normalized.slice(0, splitIndex + 2), normalized.slice(splitIndex + 2));
		if (compact) return compact;
	}
	const compactCommandPrefixMatch = normalized.match(/^🛠️\s+/u);
	if (compactCommandPrefixMatch) {
		const prefix = compactCommandPrefixMatch[0];
		const compact = compactWithPrefix(prefix, normalized.slice(prefix.length));
		if (compact) return compact;
	}
	return repairCompactedProgressMarkdown(compactPlainProgressLine(normalized, maxChars));
}
function formatPlanChecklistLines(steps, options) {
	const normalizedSteps = steps.map((entry, index) => ({
		...entry,
		step: entry.step.replace(/\s+/g, " ").trim(),
		index
	})).filter((entry) => entry.step);
	if (normalizedSteps.length === 0 || options.maxLines <= 0) return [];
	const maxLines = Math.max(1, options.maxLines);
	const marker = (status) => status === "completed" ? "✅" : status === "in_progress" ? "▸" : "▢";
	const formatStep = (entry) => compactChannelProgressDraftLine(`${marker(entry.status)} ${entry.step}`, options.maxLineChars);
	if (normalizedSteps.length <= maxLines) return normalizedSteps.map(formatStep);
	const availableSteps = maxLines - 1;
	if (availableSteps === 0) {
		const completedCount = normalizedSteps.filter((entry) => entry.status === "completed").length;
		return [compactChannelProgressDraftLine(`✅ ${completedCount}/${normalizedSteps.length} done`, options.maxLineChars)];
	}
	const pendingSteps = normalizedSteps.filter((entry) => entry.status !== "completed");
	const activeStep = pendingSteps.find((entry) => entry.status === "in_progress");
	const pendingSlots = Math.max(0, availableSteps - (activeStep ? 1 : 0));
	const pendingTail = pendingSlots === 0 ? [] : pendingSteps.filter((entry) => entry !== activeStep).slice(-pendingSlots);
	const visiblePending = [...activeStep ? [activeStep] : [], ...pendingTail];
	const completedSlots = Math.max(0, availableSteps - visiblePending.length);
	const visibleSteps = [...completedSlots > 0 ? normalizedSteps.filter((entry) => entry.status === "completed").slice(-completedSlots) : [], ...visiblePending].toSorted((a, b) => a.index - b.index);
	return [compactChannelProgressDraftLine(`✅ ${normalizedSteps.length - pendingSteps.length}/${normalizedSteps.length} done`, options.maxLineChars), ...visibleSteps.map(formatStep)];
}
function getProgressDraftLineText(line) {
	if (typeof line === "string") return line;
	const icon = line.icon?.trim();
	const prefix = icon ? `${icon} ` : "";
	const label = line.label.trim();
	const detail = line.detail?.trim();
	const status = line.status?.trim();
	const displayStatus = status === "completed" ? void 0 : status;
	if (detail) {
		const compactCommandLine = isShellToolDisplayName(line.toolName);
		if (line.kind === "command-output" && displayStatus && detail !== displayStatus) {
			const outputDetail = detail.startsWith(`${displayStatus};`) ? detail : `${displayStatus}; ${detail}`;
			if (compactCommandLine) return `${prefix}${outputDetail}`;
			return label ? `${prefix}${label}: ${outputDetail}` : `${prefix}${outputDetail}`;
		}
		if (line.kind !== "patch" && label && !compactCommandLine) return `${prefix}${label}: ${detail}`;
		return `${prefix}${detail}`;
	}
	if (displayStatus) {
		if (label) return `${prefix}${label}: ${displayStatus}`;
		return `${prefix}${displayStatus}`;
	}
	const text = line.text.trim();
	if (!icon && text && text !== label) return text;
	return `${prefix}${label}`.trim();
}
function normalizeChannelProgressDraftLineIdentity(line) {
	return (typeof line === "string" ? line : line ? getProgressDraftLineText(line) : void 0)?.replace(/`([^`]+)`/gu, "$1").replace(/\s+/g, " ").trim() ?? "";
}
function mergeChannelProgressDraftLine(lines, line, params) {
	const normalized = normalizeChannelProgressDraftLineIdentity(line);
	if (!normalized) return lines;
	const maxLines = Math.max(1, params.maxLines);
	const lineKeys = resolveProgressDraftLineMergeKeys(line);
	if (lineKeys.length > 0) {
		const existingIndex = lines.findIndex((entry) => resolveProgressDraftLineMergeKeys(entry).some((entryKey) => lineKeys.includes(entryKey)));
		if (existingIndex >= 0) {
			const replacement = mergeProgressDraftLineUpdate(expectDefined(lines[existingIndex], "lines entry at existing index"), line);
			if (replacement === lines[existingIndex]) return lines;
			const next = [...lines];
			next[existingIndex] = replacement;
			return next.slice(-maxLines);
		}
	} else {
		const previous = lines.at(-1);
		if (previous && normalizeChannelProgressDraftLineIdentity(previous) === normalized) return lines;
	}
	return [...lines, line].slice(-maxLines);
}
function mergeProgressDraftLineUpdate(previous, line) {
	if (typeof previous !== "object" || typeof line !== "object") return line;
	if (line.kind !== "command-output" || !line.status || line.detail && line.detail !== line.status) return line;
	const previousDetail = previous.detail?.trim();
	if (!previousDetail || previousDetail === previous.status || isTerminalProgressStatus(previous.status)) return line;
	const replacement = {
		...line,
		detail: previousDetail
	};
	replacement.text = getProgressDraftLineText(replacement);
	setProgressDraftLineCorrelationKey(replacement, progressDraftLineCorrelationKeys.get(line) ?? progressDraftLineCorrelationKeys.get(previous));
	return replacement;
}
function resolveProgressDraftLineMergeKeys(line) {
	if (typeof line !== "object") return [];
	const keys = [progressDraftLineCorrelationKeys.get(line), line.id].map((key) => key?.trim()).filter((key) => Boolean(key));
	return [...new Set(keys)];
}
function formatChannelProgressDraftText(params) {
	const narration = params.narration ? compactChannelProgressDraftNarration(params.narration) : "";
	const progress = resolveChannelProgressDraftConfig(params.entry);
	const maxLines = resolveChannelProgressDraftMaxLines(params.entry);
	const maxLineChars = resolveChannelProgressDraftMaxLineChars(params.entry);
	const formatLine = params.formatLine ?? ((line) => line);
	const planLines = formatPlanChecklistLines(params.plan ?? [], {
		maxLines,
		maxLineChars
	}).map(formatLine);
	const hasConfiguredLabel = progress.label !== void 0 || progress.labels !== void 0;
	const resolvedLabel = narration && !hasConfiguredLabel ? void 0 : resolveChannelProgressDraftLabel({
		entry: params.entry,
		seed: params.seed,
		random: params.random
	});
	const statusHeadline = narration ? formatLine(narration) : "";
	const bullet = params.bullet ?? "•";
	const toolLineBudget = planLines.length > 0 ? Math.max(0, maxLines - planLines.length) : maxLines;
	const renderedToolLines = params.lines.map((line) => {
		const text = compactChannelProgressDraftLine(typeof line === "string" ? line : getProgressDraftLineText(line), maxLineChars);
		if (!text) return;
		const prefix = typeof line === "object" && line !== null ? line.prefix !== false : true;
		const formatted = formatLine(text);
		return prefix && shouldPrefixProgressLine(text) ? `${bullet} ${formatted}` : formatted;
	}).filter((line) => Boolean(line));
	const rollingLines = toolLineBudget === 0 ? [] : renderedToolLines.slice(-toolLineBudget);
	return [
		resolvedLabel && (planLines.length > 0 || rollingLines.length < maxLines) ? compactChannelProgressDraftLine(resolvedLabel, maxLineChars) : void 0,
		statusHeadline,
		[...rollingLines, ...planLines].join("\n")
	].filter(Boolean).join("\n\n");
}
//#endregion
export { resolveChannelStreamingProgressCommentary as C, selectLongerFinalText as D, resolveTranscriptBackedChannelFinalText as E, resolveChannelStreamingPreviewToolProgress as S, resolveChannelStreamingSuppressDefaultToolProgressMessages as T, resolveChannelStreamingBlockCoalesce as _, formatChannelProgressDraftLineForEntry as a, resolveChannelStreamingPreviewChunk as b, isChannelProgressDraftWorkToolName as c, normalizeAgentPlanSteps as d, normalizeChannelProgressDraftLineIdentity as f, resolveChannelProgressDraftMaxLines as g, resolveChannelProgressDraftMaxLineChars as h, formatChannelProgressDraftLine as i, isPotentialTruncatedFinal as l, resolveChannelProgressDraftConfig as m, buildChannelProgressDraftLineForEntry as n, formatChannelProgressDraftText as o, resolveChannelPreviewStreamMode as p, createChannelProgressDraftGate as r, formatPlanChecklistLines as s, buildChannelProgressDraftLine as t, mergeChannelProgressDraftLine as u, resolveChannelStreamingBlockEnabled as v, resolveChannelStreamingProgressNarration as w, resolveChannelStreamingPreviewCommandText as x, resolveChannelStreamingChunkMode as y };
