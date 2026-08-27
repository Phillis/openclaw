import { t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import "./fs-safe-CmrQUApq.js";
import { n as resolvePlannedSegmentArgv } from "./exec-approvals-analysis-BvkQXLiO.js";
import { h as hasMutableSymlinkPathComponentSync } from "./system-run-approval-binding-0Gs8JaF5.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/exec-authorization-render.ts
const SHELL_BARE_TOKEN_PATTERN = /^[A-Za-z0-9_@%+=:,./-]+$/u;
function shellEscapeSingleArg(value) {
	return `'${value.replace(/'/g, `'"'"'`)}'`;
}
function renderBareShellToken(value) {
	return value.length > 0 && SHELL_BARE_TOKEN_PATTERN.test(value) ? value : shellEscapeSingleArg(value);
}
function renderSourcePreservingArgv(argv) {
	return argv.map((token) => renderBareShellToken(token)).join(" ");
}
function hasUnquotedShellExpansionSource(value) {
	let quote = null;
	let escaped = false;
	let atWordStart = true;
	for (const char of value) {
		if (escaped) {
			escaped = false;
			continue;
		}
		if (quote !== "single" && char === "\\") {
			escaped = true;
			continue;
		}
		if (quote === "single") {
			if (char === "'") quote = null;
			continue;
		}
		if (quote === "double") {
			if (char === "\"") quote = null;
			continue;
		}
		if (char === "'") {
			quote = "single";
			continue;
		}
		if (char === "\"") {
			quote = "double";
			continue;
		}
		if (/\s/u.test(char)) {
			atWordStart = true;
			continue;
		}
		if (char === "~" && atWordStart) return true;
		if (char === "{" || char === "*" || char === "?" || char === "[") return true;
		atWordStart = false;
	}
	return false;
}
function hasArgumentShellExpansionSource(candidate) {
	const executableEnd = Math.max(0, candidate.sourceStep.executableSpan.endIndex - candidate.sourceStep.span.startIndex);
	return hasUnquotedShellExpansionSource(candidate.sourceStep.text.slice(executableEnd));
}
function validateSpan(params) {
	const { span } = params;
	if (!Number.isInteger(span.startIndex) || !Number.isInteger(span.endIndex) || span.startIndex < 0 || span.endIndex > params.command.length || span.startIndex >= span.endIndex) return {
		ok: false,
		reason: "invalid source span"
	};
	if (params.command.slice(span.startIndex, span.endIndex) !== params.expectedText) return {
		ok: false,
		reason: "source span mismatch"
	};
	return {
		ok: true,
		command: ""
	};
}
function sourceStepSlice(params) {
	const relativeStart = Math.max(0, params.span.startIndex - params.candidate.sourceStep.span.startIndex);
	const relativeEnd = Math.max(relativeStart, params.span.endIndex - params.candidate.sourceStep.span.startIndex);
	return params.candidate.sourceStep.text.slice(relativeStart, relativeEnd);
}
function shouldRewriteCandidate(params) {
	if (params.mode === "enforced") return params.satisfiedBy !== "safeBuiltins";
	return params.satisfiedBy === "safeBins" || params.satisfiedBy === "inlineChain";
}
function hasDispatchWrapper(segment) {
	return (segment.resolution?.wrapperChain?.length ?? 0) > 0;
}
function replacementForCandidate(params) {
	if (params.mode === "enforced" && hasArgumentShellExpansionSource(params.candidate)) return {
		ok: false,
		reason: "shell expansion in enforced arguments"
	};
	if (!shouldRewriteCandidate({
		mode: params.mode,
		satisfiedBy: params.satisfiedBy
	})) return null;
	const plannedArgv = resolvePlannedSegmentArgv(params.candidate.sourceSegment);
	if (!plannedArgv) return {
		ok: false,
		reason: "segment execution plan unavailable"
	};
	if (params.satisfiedBy === "safeBins" && hasArgumentShellExpansionSource(params.candidate)) return {
		ok: false,
		reason: "shell expansion in safe-bin arguments"
	};
	if (params.mode === "enforced" && params.candidate.transport.kind === "shell-wrapper") return {
		ok: false,
		reason: "shell quoting required in wrapper payload"
	};
	if (hasDispatchWrapper(params.candidate.sourceSegment)) {
		const spanResult = validateSpan({
			command: params.command,
			span: params.candidate.sourceStep.span,
			expectedText: params.candidate.sourceStep.text
		});
		if (!spanResult.ok) return spanResult;
		return {
			startIndex: params.candidate.sourceStep.span.startIndex,
			endIndex: params.candidate.sourceStep.span.endIndex,
			text: renderSourcePreservingArgv(plannedArgv)
		};
	}
	const executable = plannedArgv[0];
	if (!executable) return {
		ok: false,
		reason: "segment execution plan unavailable"
	};
	const renderedExecutable = renderBareShellToken(executable);
	if (params.satisfiedBy === "safeBins" && params.candidate.transport.kind === "shell-wrapper" && renderedExecutable !== executable) return {
		ok: false,
		reason: "shell quoting required in wrapper payload"
	};
	const spanResult = validateSpan({
		command: params.command,
		span: params.candidate.sourceStep.executableSpan,
		expectedText: sourceStepSlice({
			candidate: params.candidate,
			span: params.candidate.sourceStep.executableSpan
		})
	});
	if (!spanResult.ok) return spanResult;
	return {
		startIndex: params.candidate.sourceStep.executableSpan.startIndex,
		endIndex: params.candidate.sourceStep.executableSpan.endIndex,
		text: renderedExecutable
	};
}
function collectCandidateReplacements(params) {
	const replacements = [];
	for (const [index, candidate] of params.candidates.entries()) {
		const replacement = replacementForCandidate({
			command: params.command,
			candidate,
			mode: params.mode,
			satisfiedBy: params.segmentSatisfiedBy[index]
		});
		if (!replacement) continue;
		if ("ok" in replacement) return replacement;
		replacements.push(replacement);
	}
	return replacements;
}
function applyReplacements(params) {
	const sorted = params.replacements.toSorted((left, right) => left.startIndex - right.startIndex);
	let previousEnd = -1;
	for (const replacement of sorted) {
		if (replacement.startIndex < previousEnd) return {
			ok: false,
			reason: "overlapping replacement ranges"
		};
		previousEnd = replacement.endIndex;
	}
	let command = params.command;
	for (const replacement of sorted.toReversed()) command = command.slice(0, replacement.startIndex) + replacement.text + command.slice(replacement.endIndex);
	return {
		ok: true,
		command
	};
}
function buildAuthorizedShellCommandFromPlan(params) {
	if (!params.plan.ok) return {
		ok: false,
		reason: params.plan.reason
	};
	if (params.plan.dialect !== "posix-shell") return {
		ok: false,
		reason: "unsupported command dialect"
	};
	const candidates = params.plan.groups.flatMap((group) => group.candidates);
	const segmentSatisfiedBy = params.segmentSatisfiedBy ?? [];
	if (segmentSatisfiedBy.length !== candidates.length) return {
		ok: false,
		reason: "segment metadata mismatch"
	};
	const replacements = collectCandidateReplacements({
		command: params.plan.originalCommand,
		candidates,
		mode: params.mode,
		segmentSatisfiedBy
	});
	if ("ok" in replacements) return replacements;
	return applyReplacements({
		command: params.plan.originalCommand,
		replacements
	});
}
//#endregion
//#region src/infra/system-run-cwd-binding.ts
/** Captures and revalidates the directory identity used by exec authorization. */
const APPROVAL_CWD_DRIFT_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval cwd changed before execution";
function captureApprovedCwdSnapshotSync(cwd) {
	const requestedCwd = path.resolve(cwd);
	let cwdLstat;
	let cwdStat;
	let cwdReal;
	let cwdRealStat;
	try {
		cwdLstat = fs.lstatSync(requestedCwd);
		cwdStat = fs.statSync(requestedCwd);
		cwdReal = fs.realpathSync(requestedCwd);
		cwdRealStat = fs.statSync(cwdReal);
	} catch {
		return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval requires an existing canonical cwd"
		};
	}
	if (!cwdStat.isDirectory()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires cwd to be a directory"
	};
	if (hasMutableSymlinkPathComponentSync(requestedCwd) || cwdLstat.isSymbolicLink()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires canonical cwd (no symlink path components)"
	};
	if (!sameFileIdentity(cwdStat, cwdLstat) || !sameFileIdentity(cwdStat, cwdRealStat) || !sameFileIdentity(cwdLstat, cwdRealStat)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cwd identity mismatch"
	};
	return {
		ok: true,
		snapshot: {
			cwd: cwdReal,
			stat: cwdStat
		}
	};
}
/** Rechecks the exact directory object immediately before process launch. */
function revalidateApprovedCwdSnapshot(snapshot) {
	const current = captureApprovedCwdSnapshotSync(snapshot.cwd);
	return current.ok && sameFileIdentity(snapshot.stat, current.snapshot.stat);
}
//#endregion
export { buildAuthorizedShellCommandFromPlan as i, captureApprovedCwdSnapshotSync as n, revalidateApprovedCwdSnapshot as r, APPROVAL_CWD_DRIFT_DENIED_MESSAGE as t };
