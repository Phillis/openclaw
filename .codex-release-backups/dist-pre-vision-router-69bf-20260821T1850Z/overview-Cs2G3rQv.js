import { t as isFastTestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-uyT2Z2BT.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { _ as resolveGatewayPort, f as resolveConfigPath } from "./paths-CqeDjSA4.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-ekSMR50U.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { g as resolveSystemAgentTargetAgentId, r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import { l as readConfigFileSnapshot } from "./io-BTBpQ7uO.js";
import "./config-CfeGo4K4.js";
import { r as runCommandWithTimeout } from "./exec-Cmwsxh9J.js";
import { n as OPENCLAW_SOURCE_URL, r as resolveOpenClawReferencePaths, t as OPENCLAW_DOCS_URL } from "./docs-path-CIMgdwYZ.js";
//#region src/system-agent/probes.ts
const LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS = 16 * 1024;
/** Probe a command by running a small version command with bounded output and timeout. */
async function probeLocalCommand(command, args = ["--version"], opts = {}) {
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 1500);
	const outputLimit = opts.outputLimit ?? LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS;
	try {
		const result = await runCommandWithTimeout([command, ...args], {
			killProcessTree: true,
			maxOutputBytes: outputLimit,
			timeoutMs
		});
		if (result.termination === "timeout") return {
			command,
			found: true,
			error: `timed out after ${timeoutMs}ms`,
			timedOut: true
		};
		const text = `${result.stdout}\n${result.stderr}`.trim().split(/\r?\n/)[0]?.trim();
		return {
			command,
			found: result.code === 0 || Boolean(text),
			version: text || void 0,
			error: result.code === 0 ? void 0 : `exited ${String(result.code)}`
		};
	} catch (error) {
		const spawnError = error;
		return {
			command,
			found: spawnError.code !== "ENOENT",
			error: spawnError.code === "ENOENT" ? "not found" : spawnError.message
		};
	}
}
/** Probe a Gateway URL by translating it to its HTTP /healthz endpoint. */
async function probeGatewayUrl(url, opts = {}) {
	const httpUrl = url.replace(/^ws:/, "http:").replace(/^wss:/, "https:");
	const healthUrl = new URL("/healthz", httpUrl).toString();
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 900);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	let response;
	try {
		response = await fetch(healthUrl, {
			method: "GET",
			signal: controller.signal
		});
		return {
			reachable: response.ok,
			url,
			error: response.ok ? void 0 : response.statusText
		};
	} catch (err) {
		return {
			reachable: false,
			url,
			error: err instanceof Error ? err.message : String(err)
		};
	} finally {
		clearTimeout(timeout);
		await response?.body?.cancel().catch(() => void 0);
	}
}
//#endregion
//#region src/system-agent/overview.ts
function issueMessages(snapshot) {
	return snapshot.issues.map((issue) => {
		return `${issue.path ? `${issue.path}: ` : ""}${issue.message}`;
	});
}
function buildAgentSummaries(cfg, defaultAgentId) {
	const entries = listAgentEntries(cfg);
	if (entries.length === 0) return [{
		id: defaultAgentId,
		isDefault: true,
		model: resolveAgentEffectiveModelPrimary(cfg, defaultAgentId)
	}];
	const seen = /* @__PURE__ */ new Set();
	const summaries = [];
	for (const entry of entries) {
		const id = normalizeAgentId(entry.id);
		if (seen.has(id)) continue;
		seen.add(id);
		const summary = {
			id,
			isDefault: id === defaultAgentId
		};
		if (typeof entry.name === "string") summary.name = entry.name;
		const model = resolveAgentEffectiveModelPrimary(cfg, id);
		if (model) summary.model = model;
		if (typeof entry.workspace === "string") summary.workspace = entry.workspace;
		summaries.push(summary);
	}
	return summaries;
}
function resolveFastTestReferences(env) {
	if (!isFastTestRuntimeEnv(env)) return;
	const sourcePath = process.cwd();
	return {
		sourcePath,
		docsPath: `${sourcePath}/docs`
	};
}
async function loadSystemAgentOverview(opts = {}) {
	const env = opts.env ?? process.env;
	const deps = opts.deps ?? {};
	const snapshot = await (deps.readConfigFileSnapshot ?? readConfigFileSnapshot)();
	const cfg = snapshot.runtimeConfig ?? snapshot.sourceConfig ?? {};
	const defaultAgentId = resolveSystemAgentTargetAgentId(cfg);
	const defaultModel = resolveAgentEffectiveModelPrimary(cfg, defaultAgentId) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model);
	const configPath = snapshot.path || (deps.resolveConfigPath ?? resolveConfigPath)(env);
	let gatewayUrl = `ws://127.0.0.1:${(deps.resolveGatewayPort ?? resolveGatewayPort)(cfg, env)}`;
	let gatewaySource = "local loopback";
	let gatewayError;
	try {
		const details = (deps.buildGatewayConnectionDetails ?? (await import("./call-DrR5WyUw.js")).buildGatewayConnectionDetails)({
			config: cfg,
			configPath
		});
		gatewayUrl = details.url;
		gatewaySource = details.urlSource;
		gatewayError = details.remoteFallbackNote;
	} catch (err) {
		gatewayError = err instanceof Error ? err.message : String(err);
	}
	const resolveReferences = deps.resolveOpenClawReferencePaths ?? resolveOpenClawReferencePaths;
	const commandProbe = deps.probeLocalCommand ?? probeLocalCommand;
	const [codex, claude, gemini, gateway, references] = await Promise.all([
		commandProbe("codex"),
		commandProbe("claude"),
		commandProbe("gemini"),
		(deps.probeGatewayUrl ?? probeGatewayUrl)(gatewayUrl),
		resolveFastTestReferences(env) ?? resolveReferences({
			argv1: process.argv[1],
			cwd: process.cwd(),
			moduleUrl: import.meta.url
		})
	]);
	return {
		config: {
			path: configPath,
			exists: snapshot.exists,
			valid: snapshot.valid,
			issues: issueMessages(snapshot),
			hash: snapshot.hash ?? null
		},
		agents: buildAgentSummaries(cfg, defaultAgentId),
		defaultAgentId,
		defaultModel,
		tools: {
			codex,
			claude,
			gemini,
			apiKeys: {
				openai: Boolean(env.OPENAI_API_KEY?.trim()),
				anthropic: Boolean(env.ANTHROPIC_API_KEY?.trim())
			}
		},
		gateway: {
			url: gateway.url,
			source: gatewaySource,
			reachable: gateway.reachable,
			error: gateway.error ?? gatewayError
		},
		references: {
			docsPath: references.docsPath ?? void 0,
			docsUrl: OPENCLAW_DOCS_URL,
			sourcePath: references.sourcePath ?? void 0,
			sourceUrl: OPENCLAW_SOURCE_URL
		}
	};
}
function formatCommandProbe(probe) {
	if (!probe.found) return "not found";
	if (probe.version) return probe.version;
	return probe.error ? `found (${probe.error})` : "found";
}
function formatSystemAgentOverview(overview) {
	const agentLines = overview.agents.map((agent) => {
		return `  - ${[
			agent.id,
			agent.isDefault ? "default" : void 0,
			agent.name ? `name=${agent.name}` : void 0,
			agent.model ? `model=${agent.model}` : void 0,
			agent.workspace ? `workspace=${agent.workspace}` : void 0
		].filter(Boolean).join(" | ")}`;
	});
	const configStatus = overview.config.valid ? overview.config.exists ? "valid" : "missing" : "invalid";
	const issueLines = overview.config.issues.length > 0 ? ["Config issues:", ...overview.config.issues.map((issue) => `  - ${issue}`)] : [];
	return [
		"OpenClaw online. Little claws, typed tools.",
		"",
		`Config: ${configStatus}`,
		`Path: ${overview.config.path}`,
		`Default agent: ${overview.defaultAgentId}`,
		`Default model: ${overview.defaultModel ?? "not configured"}`,
		"Agents:",
		...agentLines,
		`Codex: ${formatCommandProbe(overview.tools.codex)}`,
		`Claude Code: ${formatCommandProbe(overview.tools.claude)}`,
		`Gemini CLI: ${formatCommandProbe(overview.tools.gemini)}`,
		`API keys: OpenAI ${overview.tools.apiKeys.openai ? "found" : "not found"}, Anthropic ${overview.tools.apiKeys.anthropic ? "found" : "not found"}`,
		`AI: ${overview.defaultModel ? `conversation runs on ${overview.defaultModel}` : "inference unavailable; run openclaw onboard before starting OpenClaw"}`,
		`Docs: ${overview.references.docsPath ?? overview.references.docsUrl}`,
		overview.references.sourcePath ? `Source: ${overview.references.sourcePath}` : `Source: ${overview.references.sourceUrl}`,
		`Gateway: ${overview.gateway.reachable ? "reachable" : "not reachable"} (${overview.gateway.url}, ${overview.gateway.source})`,
		overview.gateway.error ? `Gateway note: ${overview.gateway.error}` : void 0,
		`Next: ${recommendSystemAgentNextStep(overview)}`,
		...issueLines
	].filter((line) => line !== void 0).join("\n");
}
function recommendSystemAgentNextStep(overview) {
	if (!overview.config.exists) return "run \"openclaw onboard\" to establish inference";
	if (!overview.config.valid) return "run \"validate config\" or \"doctor\" to inspect the config";
	if (!overview.defaultModel) return "run \"openclaw onboard\" to establish inference";
	if (!overview.gateway.reachable) return "run \"gateway status\" or \"restart gateway\"";
	return "run \"talk to agent\" to enter your default agent";
}
function formatStartupConfigStatus(overview) {
	if (!overview.config.exists) return "missing";
	return overview.config.valid ? "valid" : "invalid";
}
function formatStartupGatewayStatus(overview) {
	if (overview.gateway.reachable) return `Gateway: reachable at ${overview.gateway.url}.`;
	return `Gateway: not reachable at ${overview.gateway.url}; I already did the first probe.`;
}
function formatStartupAction(overview) {
	if (!overview.config.valid) return "Config needs attention. Run `doctor` to inspect it.";
	if (!overview.defaultModel) return "Inference is unavailable. Run `openclaw onboard` and complete a live model check.";
}
/**
* Welcome shown right after inference activation. OpenClaw owns the
* remaining workspace, Gateway, channel, and agent setup.
*/
function formatSystemAgentOnboardingWelcome(overview) {
	return [
		"## Inference is ready.",
		"",
		`- Verified model: ${overview.defaultModel ?? "not configured"}.`,
		`- ${overview.gateway.reachable ? `Gateway: running at ${overview.gateway.url}.` : "Gateway: not configured or reachable yet."}`,
		"- I can now finish your workspace, Gateway, channels, agents, plugins, and other optional setup.",
		"- Connect how you want to talk: say `connect whatsapp`, `connect telegram`, `connect slack`, `connect discord` — or `channels` for the full list.",
		"",
		"Say `talk to agent` to meet your agent right here, or `help` for everything I can do."
	].join("\n");
}
function formatSystemAgentStartupMessage(overview) {
	const agent = overview.agents.find((entry) => entry.id === overview.defaultAgentId);
	const agentLabel = agent?.name ? `${overview.defaultAgentId} (${agent.name})` : overview.defaultAgentId;
	return [
		"Hi, I'm OpenClaw — caretaker of this gateway, config, channels, and agents.",
		overview.defaultModel ? `Model: ${overview.defaultModel}.` : "Inference is unavailable.",
		`Config: ${formatStartupConfigStatus(overview)}. Default agent: ${agentLabel}.`,
		formatStartupGatewayStatus(overview),
		formatStartupAction(overview)
	].filter((line) => line !== void 0).join("\n");
}
//#endregion
export { probeLocalCommand as a, loadSystemAgentOverview as i, formatSystemAgentOverview as n, formatSystemAgentStartupMessage as r, formatSystemAgentOnboardingWelcome as t };
