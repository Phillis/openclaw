import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { s as readConfigFileSnapshot } from "./io-ClLVsBMp.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { a as resolveExecutablePath } from "./executable-path-HS2Pej6k.js";
import "./config-B_0xOnKq.js";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-DJvB3IVo.js";
import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { n as redactSupportString } from "./diagnostic-support-redaction-QVOqlrtG.js";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-cjWLuv7y.js";
import { t as HEALTH_FINDING_SEVERITY_RANK } from "./health-checks-DrfuiOOz.js";
import { c as select } from "./configure.shared-D77XM94J.js";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
//#region src/commands/triage-prompt.ts
const TRIAGE_PROMPT_MAX_BYTES = 8 * 1024;
const TRIAGE_FINDINGS_MAX_COUNT = 10;
const TRIAGE_FINDING_MAX_LENGTHS = {
	id: 100,
	message: 320,
	hint: 180
};
const OMISSION_RESERVE = 96;
function promptByteLength(lines) {
	return Buffer.byteLength(lines.join("\n"), "utf8") + 1;
}
function renderTriageTail(bundle, redaction) {
	const lines = [
		"",
		"## Diagnostics bundle",
		""
	];
	if (bundle.kind === "available") lines.push(`Sanitized ZIP: ${redactSupportString(bundle.path, redaction)}`, "Contains sanitized config, status and health snapshots, operational log summaries, and available payload-free stability diagnostics.");
	else if (bundle.kind === "unavailable") lines.push(`Diagnostics export unavailable: ${redactSupportString(bundle.reason, redaction)}`);
	else lines.push("Diagnostics export skipped with `--no-export`.");
	return [
		...lines,
		"",
		"## Privacy",
		"",
		"Secrets, tokens, raw chat payloads, and raw logs are excluded; local paths are relative to `~` or `$OPENCLAW_STATE_DIR`.",
		""
	];
}
/** Render a bounded fixing-agent prompt from already-sanitized doctor findings. */
function renderTriagePrompt(params) {
	const { bundle, redaction } = params;
	const findings = params.findings.toSorted((left, right) => {
		return HEALTH_FINDING_SEVERITY_RANK[right.severity] - HEALTH_FINDING_SEVERITY_RANK[left.severity] || left.checkId.localeCompare(right.checkId);
	});
	const lines = [
		"You are debugging THIS machine's OpenClaw installation. Identify the root cause, explain the safest repair, and verify the result. You may run `openclaw doctor`, `openclaw doctor --fix`, `openclaw status --all`, and `openclaw logs`. Product documentation: https://docs.openclaw.ai.",
		"",
		"## Environment",
		"",
		`- OpenClaw: ${VERSION}`,
		`- Platform: ${process.platform}`,
		`- Node.js: ${process.versions.node} (the runtime executing OpenClaw, which may differ from the shell default)`,
		"",
		"## Doctor findings",
		""
	];
	if (findings.length === 0) lines.push("No advisory doctor findings were reported.");
	const tail = renderTriageTail(bundle, redaction);
	const findingsBudget = TRIAGE_PROMPT_MAX_BYTES - promptByteLength(lines) - promptByteLength(tail) - OMISSION_RESERVE;
	let used = 0;
	let rendered = 0;
	for (const finding of findings.slice(0, TRIAGE_FINDINGS_MAX_COUNT)) {
		const id = redactSupportString(finding.checkId, redaction, { maxLength: TRIAGE_FINDING_MAX_LENGTHS.id });
		const text = redactSupportString(finding.message, redaction, { maxLength: TRIAGE_FINDING_MAX_LENGTHS.message });
		const entry = [`- [${finding.severity}] ${id}: ${text}`];
		if (finding.fixHint) {
			const hint = redactSupportString(finding.fixHint, redaction, { maxLength: TRIAGE_FINDING_MAX_LENGTHS.hint });
			entry.push(`  Fix: ${hint}`);
		}
		const entryBytes = promptByteLength(entry);
		if (rendered > 0 && used + entryBytes > findingsBudget) break;
		lines.push(...entry);
		used += entryBytes;
		rendered += 1;
	}
	const omitted = findings.length - rendered;
	if (omitted > 0) lines.push(`${omitted} more findings omitted; run \`openclaw doctor\` for the full list.`);
	lines.push(...tail);
	const prompt = lines.map((line) => line.replace(/[\r\n]+/gu, " ").trimEnd()).join("\n");
	if (Buffer.byteLength(prompt, "utf8") <= TRIAGE_PROMPT_MAX_BYTES) return prompt;
	const suffix = "\n[Prompt truncated to the 8 KiB safety limit.]\n";
	return `${truncateUtf8Prefix(prompt, TRIAGE_PROMPT_MAX_BYTES - Buffer.byteLength(suffix))}${suffix}`;
}
//#endregion
//#region src/commands/triage.ts
async function collectTriageBundle(skipExport) {
	if (skipExport) return { kind: "skipped" };
	try {
		const rpc = {
			timeout: "3000",
			json: true
		};
		const health = await callGatewayFromCliWithTransport("health", rpc, void 0, {
			defaultTimeoutMs: 3e3,
			sharedStateMode: "read-only"
		});
		const [{ writeDiagnosticSupportExport }, { gatherDaemonStatus }] = await Promise.all([import("./diagnostic-support-export-bYl803sM.js"), import("./status.gather-caIMpbge.js")]);
		return {
			kind: "available",
			path: (await writeDiagnosticSupportExport({
				readHealthSnapshot: async () => health,
				readStatusSnapshot: async () => await gatherDaemonStatus({
					rpc,
					probe: true,
					requireRpc: false,
					deep: false
				})
			})).path
		};
	} catch (error) {
		return {
			kind: "unavailable",
			reason: scrubDoctorErrorMessage(error)
		};
	}
}
function resolveTriageHandoff(options) {
	if (options.json === true) return { kind: "print" };
	if (options.run === true) return { kind: "embedded" };
	return process.stdin.isTTY && process.stdout.isTTY ? { kind: "offer" } : { kind: "print" };
}
function quoteShellArgument(value) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}
/** Collect read-only diagnostics, write the bounded prompt, and optionally run one agent turn. */
async function triageCommand(runtime, options = {}) {
	const { collectDoctorFindings } = await import("./doctor-lint-B5KUTxPd.js");
	const findings = await collectDoctorFindings(runtime);
	const redaction = {
		env: process.env,
		stateDir: resolveStateDir()
	};
	const bundle = await collectTriageBundle(options.noExport === true);
	const prompt = renderTriagePrompt({
		findings,
		bundle,
		redaction
	});
	const now = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/gu, "-");
	const outputDir = path.join(redaction.stateDir, "logs", "support");
	const promptPath = path.join(outputDir, `openclaw-triage-prompt-${now}-${process.pid}.md`);
	await fs.mkdir(outputDir, {
		recursive: true,
		mode: 448
	});
	await fs.writeFile(promptPath, prompt, {
		encoding: "utf8",
		mode: 384
	});
	const quotedPath = quoteShellArgument(promptPath);
	const suggestedCommands = [
		`claude "$(cat ${quotedPath})"`,
		`codex exec - < ${quotedPath}`,
		"openclaw triage --run"
	];
	const findingCounts = {
		error: 0,
		warning: 0,
		info: 0
	};
	for (const finding of findings) findingCounts[finding.severity] += 1;
	let handoff = resolveTriageHandoff(options);
	const externalAgents = options.json === true || handoff.kind === "offer" ? ["claude", "codex"].flatMap((agent) => {
		const executablePath = resolveExecutablePath(agent);
		return executablePath ? [{
			agent,
			executablePath
		}] : [];
	}) : [];
	const detectedAgents = externalAgents.map(({ agent }) => agent);
	const report = {
		promptPath,
		bundlePath: bundle.kind === "available" ? bundle.path : null,
		bundleError: bundle.kind === "unavailable" ? redactSupportString(bundle.reason, redaction) : null,
		findings: findingCounts,
		detectedAgents,
		suggestedCommands
	};
	if (options.json === true) {
		writeRuntimeJson(runtime, report);
		return;
	}
	runtime.log(`Debugging prompt: ${promptPath}`);
	if (bundle.kind === "available") runtime.log(`Sanitized diagnostics: ${bundle.path}`);
	else if (bundle.kind === "unavailable") runtime.log(`Diagnostics export unavailable: ${report.bundleError}`);
	if (handoff.kind === "offer") {
		const snapshot = await readConfigFileSnapshot({ observe: false });
		const config = snapshot.runtimeConfig ?? snapshot.config;
		const agentId = tryResolveAmbientOwnerAgentId(config);
		const choices = [];
		if (snapshot.exists && snapshot.valid && agentId && resolveAgentEffectiveModelPrimary(config, agentId)) choices.push({
			value: { kind: "embedded" },
			label: "OpenClaw embedded agent"
		});
		for (const { agent, executablePath } of externalAgents) {
			if (process.platform === "win32" && /\.(?:cmd|bat)$/iu.test(executablePath)) continue;
			choices.push({
				value: {
					kind: "external",
					agent,
					executablePath
				},
				label: agent === "claude" ? "Claude Code" : "Codex CLI"
			});
		}
		choices.push({
			value: { kind: "print" },
			label: "Just print the commands"
		});
		const selected = await select({
			message: "Choose an agent to investigate this OpenClaw installation",
			options: choices
		});
		if (typeof selected === "symbol") {
			runtime.exit(130);
			return;
		}
		handoff = selected;
	}
	if (handoff.kind === "print" || handoff.kind === "embedded") {
		runtime.log("Ready-to-run agent handoffs:");
		for (const command of suggestedCommands) runtime.log(`  ${command}`);
		if (handoff.kind === "print") return;
	}
	if (handoff.kind === "external") {
		let exitCode;
		try {
			exitCode = await new Promise((resolve, reject) => {
				const child = spawn(handoff.executablePath, [prompt], { stdio: "inherit" });
				child.once("error", reject);
				child.once("exit", (code, signal) => resolve(resolveSubprocessExitCode(code, signal)));
			});
		} catch (error) {
			runtime.error(`Failed to launch ${handoff.agent}: ${scrubDoctorErrorMessage(error)}`);
			runtime.log(`Run manually: ${suggestedCommands[handoff.agent === "claude" ? 0 : 1]}`);
			runtime.exit(1);
			return;
		}
		if (exitCode !== 0) runtime.exit(exitCode);
		return;
	}
	if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("Embedded triage requires an interactive terminal; use a suggested handoff command.");
	const { verifySetupInference } = await import("./system-agent/setup-inference.js");
	const inference = await verifySetupInference({
		runtime,
		timeoutMs: 15e3
	});
	if (!inference.ok) {
		const message = `Embedded agent unavailable: ${redactSupportString(scrubDoctorErrorMessage(inference.error), redaction)}. Run \`openclaw onboard\` or use a suggested handoff command.`;
		if (options.run === true) throw new Error(message);
		runtime.log(message);
		return;
	}
	const { agentExecCommand } = await import("./agent-exec-IlUFJDu5.js");
	const result = await agentExecCommand(void 0, { messageFile: promptPath }, runtime);
	if (result.exitCode !== 0) runtime.exit(result.exitCode);
}
//#endregion
export { triageCommand };
