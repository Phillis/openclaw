import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import { n as AcpRuntimeError$1 } from "./errors-MW5Rkd8s.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./security-runtime-qrFVi6LG.js";
import "./text-utility-runtime-BNhX-3os.js";
import { d as withAcpxLeaseEnvironment, i as createAcpxProcessLeaseId, o as hashAcpxProcessCommand, t as ACPX_PROBE_LEASE_SESSION_KEY, u as readAcpxProcessLeaseIdentity, v as splitCommandParts } from "./process-lease-Cwvj7WGe.js";
import "./runtime-api-DL4TBpAq.js";
import { d as OPENCLAW_CODEX_CONFIG_ARG, l as CODEX_ACP_PACKAGE, n as cleanupOpenClawOwnedAcpxProcessTree, r as isOpenClawLeaseAwareAcpxProcessCommand, t as cleanupOpenClawOwnedAcpxPendingLease } from "./process-reaper-Dnmwhox6.js";
import { fileURLToPath } from "node:url";
import fs, { readFileSync } from "node:fs";
import os from "node:os";
import path, { resolve } from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { execFile, spawn } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { Readable, Writable } from "node:stream";
import readline from "node:readline/promises";
import { PROTOCOL_VERSION, client, methods } from "@agentclientprotocol/sdk";
//#region node_modules/acpx/dist/live-checkpoint-BSIrfgVo.js
var AcpxOperationalError = class extends Error {
	outputCode;
	detailCode;
	origin;
	retryable;
	acp;
	outputAlreadyEmitted;
	constructor(message, options) {
		super(message, options);
		this.name = new.target.name;
		this.outputCode = options?.outputCode;
		this.detailCode = options?.detailCode;
		this.origin = options?.origin;
		this.retryable = options?.retryable;
		this.acp = options?.acp;
		this.outputAlreadyEmitted = options?.outputAlreadyEmitted;
	}
};
var AgentSpawnError = class extends AcpxOperationalError {
	agentCommand;
	constructor(agentCommand, cause) {
		super(`Failed to spawn agent command: ${agentCommand}`, { cause: cause instanceof Error ? cause : void 0 });
		this.agentCommand = agentCommand;
	}
};
var AgentStartupError = class extends AcpxOperationalError {
	agentCommand;
	exitCode;
	signal;
	stderrSummary;
	constructor(params) {
		const exitSummary = `exit=${params.exitCode ?? "null"}, signal=${params.signal ?? "null"}`;
		const stderrSuffix = typeof params.stderrSummary === "string" && params.stderrSummary.trim().length > 0 ? `: ${params.stderrSummary.trim()}` : "";
		super(`ACP agent exited before initialize completed (${exitSummary})${stderrSuffix}`, {
			cause: params.cause instanceof Error ? params.cause : void 0,
			outputCode: "RUNTIME",
			detailCode: "AGENT_STARTUP_FAILED",
			origin: "acp"
		});
		this.agentCommand = params.agentCommand;
		this.exitCode = params.exitCode;
		this.signal = params.signal;
		this.stderrSummary = params.stderrSummary?.trim() || void 0;
	}
};
var AgentDisconnectedError = class extends AcpxOperationalError {
	reason;
	exitCode;
	signal;
	constructor(reason, exitCode, signal, options) {
		super(`ACP agent disconnected during request (${reason}, exit=${exitCode ?? "null"}, signal=${signal ?? "null"})`, {
			outputCode: "RUNTIME",
			detailCode: "AGENT_DISCONNECTED",
			origin: "acp",
			...options
		});
		this.reason = reason;
		this.exitCode = exitCode;
		this.signal = signal;
	}
};
var UnsupportedPromptContentError = class extends AcpxOperationalError {
	constructor(message) {
		super(message, {
			outputCode: "USAGE",
			detailCode: "UNSUPPORTED_PROMPT_CONTENT",
			origin: "acp"
		});
	}
};
var SessionResumeRequiredError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "RUNTIME",
			detailCode: "SESSION_RESUME_REQUIRED",
			origin: "acp",
			retryable: true,
			...options
		});
	}
};
var GeminiAcpStartupTimeoutError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "TIMEOUT",
			detailCode: "GEMINI_ACP_STARTUP_TIMEOUT",
			origin: "acp",
			...options
		});
	}
};
var SessionModeReplayError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "RUNTIME",
			detailCode: "SESSION_MODE_REPLAY_FAILED",
			origin: "acp",
			...options
		});
	}
};
var SessionModelReplayError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "RUNTIME",
			detailCode: "SESSION_MODEL_REPLAY_FAILED",
			origin: "acp",
			...options
		});
	}
};
var SessionConfigOptionReplayError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "RUNTIME",
			detailCode: "SESSION_CONFIG_OPTION_REPLAY_FAILED",
			origin: "acp",
			...options
		});
	}
};
var ClaudeAcpSessionCreateTimeoutError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "TIMEOUT",
			detailCode: "CLAUDE_ACP_SESSION_CREATE_TIMEOUT",
			origin: "acp",
			...options
		});
	}
};
var CopilotAcpUnsupportedError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "RUNTIME",
			detailCode: "COPILOT_ACP_UNSUPPORTED",
			origin: "acp",
			...options
		});
	}
};
var AuthPolicyError = class extends AcpxOperationalError {
	constructor(message, options) {
		super(message, {
			outputCode: "RUNTIME",
			detailCode: "AUTH_REQUIRED",
			origin: "acp",
			...options
		});
	}
};
var PermissionDeniedError = class extends AcpxOperationalError {};
var PermissionPromptUnavailableError = class extends AcpxOperationalError {
	constructor() {
		super("Permission prompt unavailable in non-interactive mode");
	}
};
const OUTPUT_ERROR_CODES = [
	"NO_SESSION",
	"TIMEOUT",
	"PERMISSION_DENIED",
	"PERMISSION_PROMPT_UNAVAILABLE",
	"RUNTIME",
	"USAGE"
];
const OUTPUT_ERROR_ORIGINS = [
	"cli",
	"runtime",
	"queue",
	"acp"
];
const SESSION_RECORD_SCHEMA = "acpx.session.v1";
const RESOURCE_NOT_FOUND_ACP_CODES = /* @__PURE__ */ new Set([-32001, -32002]);
function asRecord$8(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function toAcpErrorPayload(value) {
	const record = asRecord$8(value);
	if (!record) return;
	if (typeof record.code !== "number" || !Number.isFinite(record.code)) return;
	if (typeof record.message !== "string" || record.message.length === 0) return;
	return {
		code: record.code,
		message: record.message,
		data: record.data
	};
}
function extractAcpErrorInternal(value, depth) {
	if (depth > 5) return;
	const direct = toAcpErrorPayload(value);
	if (direct) return direct;
	const record = asRecord$8(value);
	if (!record) return;
	return extractNestedAcpError(record, depth);
}
function extractNestedAcpError(record, depth) {
	for (const key of [
		"error",
		"acp",
		"cause"
	]) if (key in record) {
		const nested = extractAcpErrorInternal(record[key], depth + 1);
		if (nested) return nested;
	}
}
function formatUnknownErrorMessage(error) {
	if (error instanceof Error) return error.message;
	if (error && typeof error === "object") {
		const maybeMessage = error.message;
		if (typeof maybeMessage === "string" && maybeMessage.length > 0) return maybeMessage;
		try {
			return JSON.stringify(error);
		} catch {}
	}
	return String(error);
}
const SESSION_NOT_FOUND_PATTERN = /session\s+["'\w-]+\s+not found/i;
function isSessionNotFoundText(value) {
	if (typeof value !== "string") return false;
	const normalized = value.toLowerCase();
	return normalized.includes("resource_not_found") || normalized.includes("resource not found") || normalized.includes("session not found") || normalized.includes("unknown session") || normalized.includes("invalid session identifier") || SESSION_NOT_FOUND_PATTERN.test(value);
}
function hasSessionNotFoundHint(value, depth = 0) {
	if (depth > 4) return false;
	if (isSessionNotFoundText(value)) return true;
	if (Array.isArray(value)) return value.some((entry) => hasSessionNotFoundHint(entry, depth + 1));
	const record = asRecord$8(value);
	if (!record) return false;
	return Object.values(record).some((entry) => hasSessionNotFoundHint(entry, depth + 1));
}
function extractAcpError(error) {
	return extractAcpErrorInternal(error, 0);
}
function isAcpResourceNotFoundError(error) {
	const acp = extractAcpError(error);
	if (acp && RESOURCE_NOT_FOUND_ACP_CODES.has(acp.code)) return true;
	if (acp) {
		if (isSessionNotFoundText(acp.message)) return true;
		if (hasSessionNotFoundHint(acp.data)) return true;
	}
	return isSessionNotFoundText(formatUnknownErrorMessage(error));
}
const AUTH_REQUIRED_ACP_CODES = /* @__PURE__ */ new Set([-32e3]);
const QUERY_CLOSED_BEFORE_RESPONSE_DETAIL = "query closed before response received";
function asRecord$7(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function isAuthRequiredMessage(value) {
	if (!value) return false;
	const normalized = value.toLowerCase();
	return [
		"auth required",
		"authentication required",
		"authorization required",
		"credential required",
		"credentials required",
		"token required",
		"login required"
	].some((needle) => normalized.includes(needle));
}
function isAcpAuthRequiredPayload(acp) {
	if (!acp) return false;
	if (!AUTH_REQUIRED_ACP_CODES.has(acp.code)) return false;
	if (isAuthRequiredMessage(acp.message)) return true;
	const data = asRecord$7(acp.data);
	if (!data) return false;
	return hasAuthRequiredData(data);
}
function hasAuthRequiredData(data) {
	return data.authRequired === true || hasNonEmptyString(data.methodId) || hasNonEmptyArray(data.methods);
}
function hasNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function hasNonEmptyArray(value) {
	return Array.isArray(value) && value.length > 0;
}
function isOutputErrorCode(value) {
	return typeof value === "string" && OUTPUT_ERROR_CODES.includes(value);
}
function isOutputErrorOrigin(value) {
	return typeof value === "string" && OUTPUT_ERROR_ORIGINS.includes(value);
}
function readOutputErrorMeta(error) {
	const record = asRecord$7(error);
	if (!record) return {};
	return {
		outputCode: isOutputErrorCode(record.outputCode) ? record.outputCode : void 0,
		detailCode: typeof record.detailCode === "string" && record.detailCode.trim().length > 0 ? record.detailCode : void 0,
		origin: isOutputErrorOrigin(record.origin) ? record.origin : void 0,
		retryable: typeof record.retryable === "boolean" ? record.retryable : void 0,
		acp: extractAcpError(record.acp)
	};
}
function isTimeoutLike(error) {
	return error instanceof Error && error.name === "TimeoutError";
}
function isNoSessionLike(error) {
	return error instanceof Error && error.name === "NoSessionError";
}
function isUsageLike(error) {
	if (!(error instanceof Error)) return false;
	return error.name === "CommanderError" || error.name === "InvalidArgumentError" || asRecord$7(error)?.code === "commander.invalidArgument";
}
function formatErrorMessage(error) {
	return formatUnknownErrorMessage(error);
}
function isAcpQueryClosedBeforeResponseError(error) {
	const acp = extractAcpError(error);
	if (!acp || acp.code !== -32603) return false;
	const details = asRecord$7(acp.data)?.details;
	if (typeof details !== "string") return false;
	return details.toLowerCase().includes(QUERY_CLOSED_BEFORE_RESPONSE_DETAIL);
}
function mapErrorCode(error) {
	if (error instanceof PermissionPromptUnavailableError) return "PERMISSION_PROMPT_UNAVAILABLE";
	if (error instanceof PermissionDeniedError) return "PERMISSION_DENIED";
	if (isTimeoutLike(error)) return "TIMEOUT";
	if (isNoSessionLike(error) || isAcpResourceNotFoundError(error)) return "NO_SESSION";
	if (isUsageLike(error)) return "USAGE";
}
function normalizeOutputError(error, options = {}) {
	const meta = readOutputErrorMeta(error);
	const code = resolveOutputErrorCode(error, options, meta);
	const acp = options.acp ?? meta.acp ?? extractAcpError(error);
	return {
		code,
		message: formatErrorMessage(error),
		detailCode: resolveDetailCode(error, acp, options, meta),
		origin: meta.origin ?? options.origin,
		retryable: meta.retryable ?? options.retryable,
		acp
	};
}
function resolveOutputErrorCode(error, options, meta) {
	const code = meta.outputCode ?? mapErrorCode(error) ?? options.defaultCode ?? "RUNTIME";
	if (code === "RUNTIME" && isAcpResourceNotFoundError(error)) return "NO_SESSION";
	return code;
}
function resolveDetailCode(error, acp, options, meta) {
	return meta.detailCode ?? options.detailCode ?? (error instanceof AuthPolicyError || isAcpAuthRequiredPayload(acp) ? "AUTH_REQUIRED" : void 0);
}
const ACP_ADAPTER_PACKAGE_RANGES = {
	pi: "^0.0.31",
	codex: "^1.1.5",
	claude: "^0.60.0",
	mux: "^0.28.0"
};
const AGENT_REGISTRY = {
	pi: `npx pi-acp@${ACP_ADAPTER_PACKAGE_RANGES.pi}`,
	openclaw: "openclaw acp",
	codex: `npx -y @agentclientprotocol/codex-acp@${ACP_ADAPTER_PACKAGE_RANGES.codex}`,
	claude: `npx -y @agentclientprotocol/claude-agent-acp@${ACP_ADAPTER_PACKAGE_RANGES.claude}`,
	gemini: "gemini --acp",
	cursor: "cursor-agent acp",
	copilot: "copilot --acp --stdio",
	droid: "droid exec --output-format acp",
	"fast-agent": "uvx fast-agent-mcp acp",
	"grok-build": "grok agent stdio",
	iflow: "iflow --experimental-acp",
	kilocode: "npx -y @kilocode/cli acp",
	kimi: "kimi acp",
	kiro: "kiro-cli-chat acp",
	mux: `npx -y mux@${ACP_ADAPTER_PACKAGE_RANGES.mux} acp`,
	opencode: "npx -y opencode-ai acp",
	pool: "pool acp",
	qoder: "qodercli --acp",
	qwen: "qwen --acp",
	trae: "traecli acp serve",
	zeroclaw: "zeroclaw acp"
};
const AGENT_ARGV_REGISTRY = {
	pi: ["npx", `pi-acp@${ACP_ADAPTER_PACKAGE_RANGES.pi}`],
	openclaw: ["openclaw", "acp"],
	codex: [
		"npx",
		"-y",
		`@agentclientprotocol/codex-acp@${ACP_ADAPTER_PACKAGE_RANGES.codex}`
	],
	claude: [
		"npx",
		"-y",
		`@agentclientprotocol/claude-agent-acp@${ACP_ADAPTER_PACKAGE_RANGES.claude}`
	],
	gemini: ["gemini", "--acp"],
	cursor: ["cursor-agent", "acp"],
	copilot: [
		"copilot",
		"--acp",
		"--stdio"
	],
	droid: [
		"droid",
		"exec",
		"--output-format",
		"acp"
	],
	"fast-agent": [
		"uvx",
		"fast-agent-mcp",
		"acp"
	],
	"grok-build": [
		"grok",
		"agent",
		"stdio"
	],
	iflow: ["iflow", "--experimental-acp"],
	kilocode: [
		"npx",
		"-y",
		"@kilocode/cli",
		"acp"
	],
	kimi: ["kimi", "acp"],
	kiro: ["kiro-cli-chat", "acp"],
	mux: [
		"npx",
		"-y",
		`mux@${ACP_ADAPTER_PACKAGE_RANGES.mux}`,
		"acp"
	],
	opencode: [
		"npx",
		"-y",
		"opencode-ai",
		"acp"
	],
	pool: ["pool", "acp"],
	qoder: ["qodercli", "--acp"],
	qwen: ["qwen", "--acp"],
	trae: [
		"traecli",
		"acp",
		"serve"
	],
	zeroclaw: ["zeroclaw", "acp"]
};
const BUILT_IN_AGENT_PACKAGES = {
	codex: {
		packageName: "@agentclientprotocol/codex-acp",
		packageRange: ACP_ADAPTER_PACKAGE_RANGES.codex,
		preferredBinName: "codex-acp",
		fallbackCommand: AGENT_REGISTRY.codex,
		legacyFallbackCommands: []
	},
	claude: {
		packageName: "@agentclientprotocol/claude-agent-acp",
		packageRange: ACP_ADAPTER_PACKAGE_RANGES.claude,
		preferredBinName: "claude-agent-acp",
		fallbackCommand: AGENT_REGISTRY.claude,
		legacyFallbackCommands: [`npm exec @agentclientprotocol/claude-agent-acp@${ACP_ADAPTER_PACKAGE_RANGES.claude}`]
	}
};
const AGENT_ALIASES = {
	"factory-droid": "droid",
	factorydroid: "droid"
};
const DEFAULT_AGENT_NAME = "codex";
function normalizeAgentName$1(value) {
	return value.trim().toLowerCase();
}
function resolveCanonicalAgentName(value) {
	const normalized = normalizeAgentName$1(value);
	return AGENT_ALIASES[normalized] ?? normalized;
}
function mergeAgentRegistry(overrides) {
	if (!overrides) return { ...AGENT_REGISTRY };
	const merged = { ...AGENT_REGISTRY };
	for (const [name, command] of Object.entries(overrides)) {
		const normalized = normalizeAgentName$1(name);
		if (!normalized || !command.trim()) continue;
		merged[normalized] = command.trim();
	}
	return merged;
}
function resolveAgentCommand$1(agentName, overrides) {
	const normalized = normalizeAgentName$1(agentName);
	const registry = mergeAgentRegistry(overrides);
	return registry[normalized] ?? registry[AGENT_ALIASES[normalized] ?? normalized] ?? agentName;
}
function resolveAgentArgv(agentName) {
	const normalized = normalizeAgentName$1(agentName);
	const argv = AGENT_ARGV_REGISTRY[normalized] ?? AGENT_ARGV_REGISTRY[resolveCanonicalAgentName(agentName)];
	return argv ? [...argv] : void 0;
}
function findBuiltInAgentPackage(agentCommand) {
	const normalized = agentCommand.trim();
	return Object.values(BUILT_IN_AGENT_PACKAGES).find((spec) => spec.fallbackCommand === normalized || spec.legacyFallbackCommands?.includes(normalized));
}
function defaultResolvePackageRoot(packageName) {
	const segments = packageName.split("/");
	let cursor = path.dirname(fileURLToPath(import.meta.url));
	while (true) {
		const candidateRoot = path.join(cursor, "node_modules", ...segments);
		const manifestPath = path.join(candidateRoot, "package.json");
		if (fs.existsSync(manifestPath)) try {
			if (JSON.parse(fs.readFileSync(manifestPath, "utf8")).name === packageName) return candidateRoot;
		} catch {}
		const parent = path.dirname(cursor);
		if (parent === cursor) throw new Error(`Built-in agent package not found: ${packageName}`);
		cursor = parent;
	}
}
function resolvePackageBin(spec, manifest) {
	if (typeof manifest.bin === "string") return manifest.bin;
	if (!manifest.bin || typeof manifest.bin !== "object") return;
	return manifest.bin[spec.preferredBinName] ?? (Object.keys(manifest.bin).length === 1 ? Object.values(manifest.bin)[0] : void 0);
}
function defaultResolveNpmCliPath(execPath) {
	const candidate = path.resolve(path.dirname(execPath), "..", "lib", "node_modules", "npm", "bin", "npm-cli.js");
	if (!fs.existsSync(candidate)) throw new Error(`npm CLI not found for execPath: ${execPath}`);
	return candidate;
}
function resolveInstalledBuiltInAgentLaunch(agentCommand, options = {}) {
	const spec = findBuiltInAgentPackage(agentCommand);
	if (!spec) return;
	const readFileSync = options.readFileSync ?? fs.readFileSync;
	const existsSync = options.existsSync ?? fs.existsSync;
	const resolvePackageRoot = options.resolvePackageRoot ?? defaultResolvePackageRoot;
	try {
		const resolved = resolveInstalledBuiltInAgentPackage(spec, {
			readFileSync,
			existsSync,
			resolvePackageRoot
		});
		if (!resolved) return;
		return {
			source: "installed",
			command: process.execPath,
			args: [resolved.binPath],
			packageName: spec.packageName,
			packageRange: spec.packageRange,
			packageVersion: resolved.packageVersion,
			binPath: resolved.binPath
		};
	} catch {
		return;
	}
}
function resolveInstalledBuiltInAgentPackage(spec, options) {
	const packageRoot = options.resolvePackageRoot(spec.packageName);
	const manifest = JSON.parse(options.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
	if (manifest.name !== spec.packageName) return;
	const relativeBinPath = resolvePackageBin(spec, manifest);
	if (!relativeBinPath) return;
	const binPath = path.resolve(packageRoot, relativeBinPath);
	return options.existsSync(binPath) ? {
		packageVersion: manifest.version,
		binPath
	} : void 0;
}
function resolvePackageExecBuiltInAgentLaunch(agentCommand, options = {}) {
	const spec = findBuiltInAgentPackage(agentCommand);
	if (!spec) return;
	const existsSync = options.existsSync ?? fs.existsSync;
	const execPath = options.execPath ?? process.execPath;
	const resolveNpmCliPath = options.resolveNpmCliPath ?? defaultResolveNpmCliPath;
	try {
		const npmCliPath = resolveNpmCliPath(execPath);
		if (!existsSync(npmCliPath)) return;
		return {
			source: "package-exec",
			command: execPath,
			args: [
				npmCliPath,
				"exec",
				"--yes",
				`--package=${spec.packageName}@${spec.packageRange}`,
				"--",
				spec.preferredBinName
			],
			packageName: spec.packageName,
			packageRange: spec.packageRange,
			npmCliPath
		};
	} catch {
		return;
	}
}
function resolveBuiltInAgentLaunch(agentCommand, options = {}) {
	return resolveInstalledBuiltInAgentLaunch(agentCommand, options) ?? resolvePackageExecBuiltInAgentLaunch(agentCommand, options);
}
function listBuiltInAgents(overrides) {
	return [.../* @__PURE__ */ new Set([...Object.keys(AGENT_REGISTRY), ...Object.keys(overrides ?? {})])];
}
var TimeoutError = class extends Error {
	constructor(timeoutMs) {
		super(`Timed out after ${timeoutMs}ms`);
		this.name = "TimeoutError";
	}
};
var InterruptedError = class extends Error {
	constructor() {
		super("Interrupted");
		this.name = "InterruptedError";
	}
};
async function withTimeout(promise, timeoutMs) {
	if (timeoutMs == null || timeoutMs <= 0) return await promise;
	let timer;
	const timeoutPromise = new Promise((_resolve, reject) => {
		timer = setTimeout(() => {
			reject(new TimeoutError(timeoutMs));
		}, timeoutMs);
	});
	try {
		return await Promise.race([promise, timeoutPromise]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function withInterrupt(run, onInterrupt) {
	return await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (cb) => {
			if (settled) return;
			settled = true;
			process.off("SIGINT", onSigint);
			process.off("SIGTERM", onSigterm);
			process.off("SIGHUP", onSighup);
			cb();
		};
		const rejectInterrupted = () => {
			onInterrupt().finally(() => {
				finish(() => reject(new InterruptedError()));
			});
		};
		const onSigint = () => {
			rejectInterrupted();
		};
		const onSigterm = () => {
			rejectInterrupted();
		};
		const onSighup = () => {
			rejectInterrupted();
		};
		process.once("SIGINT", onSigint);
		process.once("SIGTERM", onSigterm);
		process.once("SIGHUP", onSighup);
		run().then((result) => finish(() => resolve(result)), (error) => finish(() => reject(error)));
	});
}
function promptCapabilityRequirement(block) {
	switch (block.type) {
		case "image": return {
			blockType: "image",
			capability: "image"
		};
		case "audio": return {
			blockType: "audio",
			capability: "audio"
		};
		case "resource": return {
			blockType: "resource",
			capability: "embeddedContext"
		};
		default: return;
	}
}
function getUnsupportedPromptContentMessage(prompt, agentCapabilities) {
	for (const [index, block] of prompt.entries()) {
		const requirement = promptCapabilityRequirement(block);
		if (!requirement) continue;
		if (agentCapabilities?.promptCapabilities?.[requirement.capability] === true) continue;
		return `prompt[${index}] ${requirement.blockType} content requires agentCapabilities.promptCapabilities.${requirement.capability}`;
	}
}
function textPrompt(text) {
	return [{
		type: "text",
		text
	}];
}
function asRecord$5(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function isAcpMessageObject(value) {
	return asRecord$5(value) !== null;
}
function isJsonRpcNotification(message) {
	return Object.hasOwn(message, "method") && typeof message.method === "string" && !Object.hasOwn(message, "id");
}
function isSessionUpdateNotification(message) {
	return isJsonRpcNotification(message) && message.method === "session/update";
}
const DEFAULT_EVENT_SEGMENT_MAX_BYTES = 64 * 1024 * 1024;
function sessionBaseDir$1() {
	return path.join(os.homedir(), ".acpx", "sessions");
}
function safeSessionId$1(sessionId) {
	return encodeURIComponent(sessionId);
}
function sessionEventActivePath(sessionId) {
	return path.join(sessionBaseDir$1(), `${safeSessionId$1(sessionId)}.stream.ndjson`);
}
function defaultSessionEventLog(sessionId) {
	return {
		active_path: sessionEventActivePath(sessionId),
		segment_count: 5,
		max_segment_bytes: DEFAULT_EVENT_SEGMENT_MAX_BYTES,
		max_segments: 5,
		last_write_at: void 0,
		last_write_error: null
	};
}
const AGENT_SESSION_ID_META_KEYS = ["agentSessionId", "sessionId"];
function normalizeAgentSessionId(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function asMetaRecord(meta) {
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	return meta;
}
function extractAgentSessionId(meta) {
	const record = asMetaRecord(meta);
	if (!record) return;
	for (const key of AGENT_SESSION_ID_META_KEYS) {
		const normalized = normalizeAgentSessionId(record[key]);
		if (normalized) return normalized;
	}
}
function normalizeRuntimeSessionId(value) {
	return normalizeAgentSessionId(value);
}
function extractRuntimeSessionId(meta) {
	return extractAgentSessionId(meta);
}
function serializeSessionRecordForDisk(record) {
	const canonical = {
		...record,
		schema: SESSION_RECORD_SCHEMA
	};
	return {
		schema: canonical.schema,
		acpx_record_id: canonical.acpxRecordId,
		acp_session_id: canonical.acpSessionId,
		agent_session_id: normalizeRuntimeSessionId(canonical.agentSessionId),
		agent_command: canonical.agentCommand,
		agent_argv: canonical.agentArgv,
		cwd: canonical.cwd,
		name: canonical.name,
		created_at: canonical.createdAt,
		last_used_at: canonical.lastUsedAt,
		last_seq: canonical.lastSeq,
		last_request_id: canonical.lastRequestId,
		event_log: canonical.eventLog,
		closed: canonical.closed,
		closed_at: canonical.closedAt,
		pid: canonical.pid,
		agent_started_at: canonical.agentStartedAt,
		last_prompt_at: canonical.lastPromptAt,
		last_agent_exit_code: canonical.lastAgentExitCode,
		last_agent_exit_signal: canonical.lastAgentExitSignal,
		last_agent_exit_at: canonical.lastAgentExitAt,
		last_agent_disconnect_reason: canonical.lastAgentDisconnectReason,
		protocol_version: canonical.protocolVersion,
		agent_capabilities: canonical.agentCapabilities,
		title: canonical.title,
		messages: canonical.messages,
		updated_at: canonical.updated_at,
		cumulative_token_usage: canonical.cumulative_token_usage,
		cumulative_cost: canonical.cumulative_cost,
		request_token_usage: canonical.request_token_usage,
		acpx: canonical.acpx,
		imported_from: canonical.importedFrom ? {
			record_id: canonical.importedFrom.recordId,
			cwd_original: canonical.importedFrom.cwdOriginal,
			exported_by: canonical.importedFrom.exportedBy,
			exported_at: canonical.importedFrom.exportedAt
		} : void 0
	};
}
const LEGACY_AGENT_COMMANDS = {
	pi: [
		"npx pi-acp",
		"npx pi-acp@^0.0.22",
		"npx pi-acp@^0.0.26"
	],
	codex: [
		"npx @zed-industries/codex-acp",
		"npx @zed-industries/codex-acp@^0.9.5",
		"npx @zed-industries/codex-acp@^0.10.0",
		"npx @zed-industries/codex-acp@^0.11.1",
		"npx @zed-industries/codex-acp@^0.12.0",
		"npx -y @agentclientprotocol/codex-acp@^0.0.44",
		"npx -y @agentclientprotocol/codex-acp@^1.1.4"
	],
	claude: [
		"npx @zed-industries/claude-agent-acp",
		"npx -y @zed-industries/claude-agent-acp",
		"npx -y @zed-industries/claude-agent-acp@^0.21.0",
		"npx -y @zed-industries/claude-agent-acp@^0.23.1",
		"npx -y @zed-industries/claude-agent-acp@^0.24.2",
		"npx -y @zed-industries/claude-agent-acp@^0.25.0",
		"npx -y @zed-industries/claude-agent-acp@^0.31.0",
		"npx -y @agentclientprotocol/claude-agent-acp@^0.36.1",
		"npx -y @agentclientprotocol/claude-agent-acp@^0.37.0",
		"npm exec @agentclientprotocol/claude-agent-acp@^0.36.1",
		"npm exec @agentclientprotocol/claude-agent-acp@^0.37.0"
	],
	gemini: ["gemini", "gemini --experimental-acp"],
	kiro: ["kiro-cli acp"],
	mux: ["npx -y mux@^0.27.0 acp"],
	opencode: ["npx opencode-ai"]
};
function currentArgv(name) {
	const argv = AGENT_ARGV_REGISTRY[name];
	return argv ? [...argv] : void 0;
}
function resolveAgentArgvForCommand(agentCommand) {
	for (const [name, command] of Object.entries(AGENT_REGISTRY)) if (command === agentCommand) return currentArgv(name);
	for (const [name, spec] of Object.entries(BUILT_IN_AGENT_PACKAGES)) if ((spec.legacyFallbackCommands ?? []).includes(agentCommand)) return currentArgv(name);
	for (const [name, commands] of Object.entries(LEGACY_AGENT_COMMANDS)) if (commands.includes(agentCommand)) return currentArgv(name);
}
function asRecord$4(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function hasOwn$1(source, key) {
	return Object.prototype.hasOwnProperty.call(source, key);
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function parseOptionalAgentArgv(value) {
	return isStringArray(value) && value.length > 0 && value[0]?.length > 0 ? value : void 0;
}
function parsePersistedAgentArgv(record) {
	return parseOptionalAgentArgv(record.agent_argv) ?? (typeof record.agent_command === "string" ? resolveAgentArgvForCommand(record.agent_command) : void 0);
}
function hasModelConfigOption(options) {
	if (!Array.isArray(options)) return false;
	return options.some((entry) => {
		const option = asRecord$4(entry);
		return option?.category === "model" || option?.id === "model";
	});
}
function parseConfigOptions(raw) {
	if (!Array.isArray(raw) || !raw.every((entry) => asRecord$4(entry) !== void 0)) return;
	return raw;
}
function parseAvailableCommand(raw) {
	if (typeof raw === "string") {
		const name = raw.trim();
		return name ? { name } : void 0;
	}
	const record = asRecord$4(raw);
	if (!record) return;
	const name = parseNonEmptyString(record.name);
	if (!name) return;
	const description = parseNonEmptyString(record.description);
	return {
		name,
		...description ? { description } : {},
		...typeof record.has_input === "boolean" ? { has_input: record.has_input } : {}
	};
}
function parseAvailableCommands(raw) {
	if (!Array.isArray(raw)) return;
	const commands = raw.map((entry) => parseAvailableCommand(entry)).filter((entry) => entry !== void 0);
	return commands.length > 0 ? commands : void 0;
}
function parseNonEmptyString(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function parseTokenUsage(raw) {
	if (raw === void 0 || raw === null) return;
	const record = asRecord$4(raw);
	if (!record) return null;
	const usage = {};
	for (const field of [
		"input_tokens",
		"output_tokens",
		"cache_creation_input_tokens",
		"cache_read_input_tokens",
		"thought_tokens",
		"total_tokens"
	]) {
		const value = record[field];
		if (value === void 0) continue;
		if (!isNonNegativeFiniteNumber(value)) return null;
		usage[field] = value;
	}
	return usage;
}
function isNonNegativeFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
function parseUsageCost(raw) {
	if (raw === void 0 || raw === null) return;
	const record = asRecord$4(raw);
	if (!record) return null;
	return parseUsageCostRecord(record);
}
function parseUsageCostRecord(record) {
	const amount = parseCostAmount(record.amount);
	const currency = parseCostCurrency(record.currency);
	if (amount === null || currency === null) return null;
	const cost = {
		...amount !== void 0 ? { amount } : {},
		...currency !== void 0 ? { currency } : {}
	};
	return Object.keys(cost).length > 0 ? cost : void 0;
}
function parseCostAmount(value) {
	if (value === void 0) return;
	return isNonNegativeFiniteNumber(value) ? value : null;
}
function parseCostCurrency(value) {
	if (value === void 0) return;
	if (typeof value !== "string") return null;
	const currency = value.trim();
	return currency.length > 0 ? currency : void 0;
}
function parseRequestTokenUsage(raw) {
	if (raw === void 0 || raw === null) return;
	const record = asRecord$4(raw);
	if (!record) return null;
	const usage = {};
	for (const [key, value] of Object.entries(record)) {
		const parsed = parseTokenUsage(value);
		if (parsed == null) return null;
		usage[key] = parsed;
	}
	return usage;
}
function isSessionMessageImage(raw) {
	const record = asRecord$4(raw);
	if (!record || typeof record.source !== "string") return false;
	if (record.size === void 0 || record.size === null) return true;
	const size = asRecord$4(record.size);
	return !!size && isFiniteNumber(size.width) && isFiniteNumber(size.height);
}
function isSessionMessageAudio(raw) {
	const record = asRecord$4(raw);
	return !!record && typeof record.source === "string" && typeof record.mime_type === "string";
}
function isFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value);
}
function isUserContent(raw) {
	const record = asRecord$4(raw);
	if (!record) return false;
	if (typeof record.Text === "string") return true;
	if (record.Mention !== void 0) {
		const mention = asRecord$4(record.Mention);
		return !!mention && typeof mention.uri === "string" && typeof mention.content === "string";
	}
	if (record.Image !== void 0) return isSessionMessageImage(record.Image);
	if (record.Audio !== void 0) return isSessionMessageAudio(record.Audio);
	return false;
}
function isToolUse(raw) {
	const record = asRecord$4(raw);
	return !!record && hasStringFields(record, [
		"id",
		"name",
		"raw_input"
	]) && hasOwn$1(record, "input") && typeof record.is_input_complete === "boolean" && isOptionalString(record.thought_signature);
}
function hasStringFields(record, keys) {
	return keys.every((key) => typeof record[key] === "string");
}
function isOptionalString(value) {
	return value === void 0 || value === null || typeof value === "string";
}
function isToolResultContent(raw) {
	const record = asRecord$4(raw);
	if (!record) return false;
	if (typeof record.Text === "string") return true;
	if (record.Image !== void 0) return isSessionMessageImage(record.Image);
	return false;
}
function isToolResult(raw) {
	const record = asRecord$4(raw);
	return !!record && typeof record.tool_use_id === "string" && typeof record.tool_name === "string" && typeof record.is_error === "boolean" && isToolResultContent(record.content);
}
function isAgentContent(raw) {
	const record = asRecord$4(raw);
	if (!record) return false;
	if (typeof record.Text === "string") return true;
	if (record.Thinking !== void 0) return isThinkingContent(record.Thinking);
	if (typeof record.RedactedThinking === "string") return true;
	if (record.ToolUse !== void 0) return isToolUse(record.ToolUse);
	return false;
}
function isThinkingContent(raw) {
	const thinking = asRecord$4(raw);
	return !!thinking && typeof thinking.text === "string" && isOptionalString(thinking.signature);
}
function isUserMessage$1(raw) {
	const record = asRecord$4(raw);
	if (!record || record.User === void 0) return false;
	const user = asRecord$4(record.User);
	return !!user && typeof user.id === "string" && Array.isArray(user.content) && user.content.every((entry) => isUserContent(entry));
}
function isAgentMessage$1(raw) {
	const record = asRecord$4(raw);
	if (!record || record.Agent === void 0) return false;
	const agent = asRecord$4(record.Agent);
	if (!agent || !Array.isArray(agent.content) || !agent.content.every(isAgentContent)) return false;
	const toolResults = asRecord$4(agent.tool_results);
	if (!toolResults) return false;
	return Object.values(toolResults).every(isToolResult);
}
function isConversationMessage(raw) {
	return raw === "Resume" || isUserMessage$1(raw) || isAgentMessage$1(raw);
}
function parseConversationRecord(record) {
	if (!hasValidConversationCore(record)) return;
	const title = parseConversationTitle(record.title);
	if (title === INVALID_VALUE) return;
	const cumulativeTokenUsage = parseTokenUsage(record.cumulative_token_usage);
	const cumulativeCost = parseUsageCost(record.cumulative_cost);
	const requestTokenUsage = parseRequestTokenUsage(record.request_token_usage);
	if (cumulativeTokenUsage === null || cumulativeCost === null || requestTokenUsage === null) return;
	return {
		title,
		messages: record.messages,
		updated_at: record.updated_at,
		cumulative_token_usage: cumulativeTokenUsage ?? {},
		cumulative_cost: cumulativeCost,
		request_token_usage: requestTokenUsage ?? {}
	};
}
const INVALID_VALUE = Symbol("invalid");
function parseConversationTitle(value) {
	if (value === void 0 || value === null || typeof value === "string") return value;
	return INVALID_VALUE;
}
function hasValidConversationCore(record) {
	return Array.isArray(record.messages) && record.messages.every(isConversationMessage) && typeof record.updated_at === "string";
}
function parseAcpxState(raw) {
	const record = asRecord$4(raw);
	if (!record) return;
	const state = {};
	assignBooleanTrue(state, "reset_on_next_ensure", record.reset_on_next_ensure);
	assignStringState(state, "current_mode_id", record.current_mode_id);
	assignStringState(state, "desired_mode_id", record.desired_mode_id);
	assignDesiredConfigOptions(state, record.desired_config_options);
	assignParsedModelState(state, record);
	const availableCommands = parseAvailableCommands(record.available_commands);
	if (availableCommands) state.available_commands = availableCommands;
	assignParsedSessionOptions(state, record.session_options);
	return state;
}
function assignParsedModelState(state, record) {
	assignStringState(state, "current_model_id", record.current_model_id);
	if (isStringArray(record.available_models)) state.available_models = [...record.available_models];
	if (record.model_control === "config_option" || record.model_control === "legacy_set_model") state.model_control = record.model_control;
	const configOptions = parseConfigOptions(record.config_options);
	if (configOptions) state.config_options = configOptions;
	if (state.model_control === void 0 && state.available_models !== void 0) state.model_control = hasModelConfigOption(state.config_options) ? "config_option" : "legacy_set_model";
}
function assignBooleanTrue(state, key, value) {
	if (value === true) state[key] = true;
}
function assignStringState(state, key, value) {
	if (typeof value === "string") state[key] = value;
}
function assignDesiredConfigOptions(state, raw) {
	const desiredConfigOptions = asRecord$4(raw);
	if (!desiredConfigOptions) return;
	const parsed = Object.fromEntries(Object.entries(desiredConfigOptions).filter((entry) => {
		const [, value] = entry;
		return typeof value === "string";
	}));
	if (Object.keys(parsed).length > 0) state.desired_config_options = parsed;
}
function assignParsedSessionOptions(state, raw) {
	const sessionOptions = asRecord$4(raw);
	if (!sessionOptions) return;
	const parsedSessionOptions = {};
	assignSessionOptionModel(parsedSessionOptions, sessionOptions.model);
	assignSessionOptionAllowedTools(parsedSessionOptions, sessionOptions.allowed_tools);
	assignSessionOptionMaxTurns(parsedSessionOptions, sessionOptions.max_turns);
	assignSessionOptionSystemPrompt(parsedSessionOptions, sessionOptions.system_prompt);
	assignSessionOptionEnv(parsedSessionOptions, sessionOptions.env);
	if (Object.keys(parsedSessionOptions).length > 0) state.session_options = parsedSessionOptions;
}
function assignSessionOptionModel(options, value) {
	if (typeof value === "string") options.model = value;
}
function assignSessionOptionAllowedTools(options, value) {
	if (isStringArray(value)) options.allowed_tools = [...value];
}
function assignSessionOptionMaxTurns(options, value) {
	if (typeof value === "number" && Number.isInteger(value) && value > 0) options.max_turns = value;
}
function assignSessionOptionSystemPrompt(options, value) {
	if (typeof value === "string" && value.length > 0) {
		options.system_prompt = value;
		return;
	}
	const appendRecord = asRecord$4(value);
	if (appendRecord && typeof appendRecord.append === "string" && appendRecord.append.length > 0) options.system_prompt = { append: appendRecord.append };
}
function assignSessionOptionEnv(options, value) {
	const env = asRecord$4(value);
	if (!env) return;
	const parsed = Object.fromEntries(Object.entries(env).filter((entry) => {
		const [, raw] = entry;
		return typeof raw === "string";
	}));
	if (Object.keys(parsed).length > 0) options.env = parsed;
}
function parseEventLog(raw, sessionId) {
	const record = asRecord$4(raw);
	if (!record || !hasValidEventLogCore(record)) return defaultSessionEventLog(sessionId);
	return {
		active_path: record.active_path,
		segment_count: record.segment_count,
		max_segment_bytes: record.max_segment_bytes,
		max_segments: record.max_segments,
		last_write_at: typeof record.last_write_at === "string" ? record.last_write_at : void 0,
		last_write_error: record.last_write_error == null || typeof record.last_write_error === "string" ? record.last_write_error : null
	};
}
function hasValidEventLogCore(record) {
	return typeof record.active_path === "string" && isPositiveInteger(record.segment_count) && isPositiveInteger(record.max_segment_bytes) && isPositiveInteger(record.max_segments);
}
function isPositiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0;
}
function parseImportedFrom(raw) {
	if (raw == null) return;
	const record = asRecord$4(raw);
	if (!record || typeof record.record_id !== "string" || typeof record.cwd_original !== "string" || typeof record.exported_by !== "string" || typeof record.exported_at !== "string") return null;
	return {
		recordId: record.record_id,
		cwdOriginal: record.cwd_original,
		exportedBy: record.exported_by,
		exportedAt: record.exported_at
	};
}
function parseSessionRecordMetadata(record) {
	const lastRequestId = normalizeOptionalString(record.last_request_id);
	if (lastRequestId === null) return null;
	const importedFrom = parseImportedFrom(record.imported_from);
	if (importedFrom === null) return null;
	return {
		lastRequestId,
		importedFrom
	};
}
function normalizeOptionalName(value) {
	if (value == null) return;
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function normalizeOptionalPid(value) {
	if (value == null) return;
	if (!Number.isInteger(value) || value <= 0) return null;
	return value;
}
function normalizeOptionalBoolean(value, fallback = false) {
	if (value == null) return fallback;
	return typeof value === "boolean" ? value : null;
}
function normalizeOptionalString(value) {
	if (value == null) return;
	return typeof value === "string" ? value : null;
}
function normalizeOptionalExitCode(value) {
	if (value === void 0) return;
	if (value === null) return null;
	if (Number.isInteger(value)) return value;
	return Symbol("invalid");
}
function normalizeOptionalSignal(value) {
	if (value === void 0) return;
	if (value === null) return null;
	if (typeof value === "string") return value;
	return Symbol("invalid");
}
function parseSessionRecord(raw) {
	const record = asRecord$4(raw);
	if (!record) return null;
	if (record.schema !== "acpx.session.v1") return null;
	const optionals = validSessionOptionals({
		name: normalizeOptionalName(record.name),
		pid: normalizeOptionalPid(record.pid),
		closed: normalizeOptionalBoolean(record.closed, false),
		closedAt: normalizeOptionalString(record.closed_at),
		agentStartedAt: normalizeOptionalString(record.agent_started_at),
		lastPromptAt: normalizeOptionalString(record.last_prompt_at),
		lastAgentExitCode: normalizeOptionalExitCode(record.last_agent_exit_code),
		lastAgentExitSignal: normalizeOptionalSignal(record.last_agent_exit_signal),
		lastAgentExitAt: normalizeOptionalString(record.last_agent_exit_at),
		lastAgentDisconnectReason: normalizeOptionalString(record.last_agent_disconnect_reason)
	});
	if (!hasValidSessionRecordCore(record) || !optionals) return null;
	const conversation = parseConversationRecord(record);
	if (!conversation) return null;
	const eventLog = parseEventLog(record.event_log, record.acpx_record_id);
	const metadata = parseSessionRecordMetadata(record);
	if (!metadata) return null;
	return {
		schema: SESSION_RECORD_SCHEMA,
		acpxRecordId: record.acpx_record_id,
		acpSessionId: record.acp_session_id,
		agentSessionId: normalizeRuntimeSessionId(record.agent_session_id),
		agentCommand: record.agent_command,
		agentArgv: parsePersistedAgentArgv(record),
		cwd: record.cwd,
		name: optionals.name,
		createdAt: record.created_at,
		lastUsedAt: record.last_used_at,
		lastSeq: record.last_seq,
		lastRequestId: metadata.lastRequestId,
		eventLog,
		closed: optionals.closed,
		closedAt: optionals.closedAt,
		pid: optionals.pid,
		agentStartedAt: optionals.agentStartedAt,
		lastPromptAt: optionals.lastPromptAt,
		lastAgentExitCode: optionals.lastAgentExitCode,
		lastAgentExitSignal: optionals.lastAgentExitSignal,
		lastAgentExitAt: optionals.lastAgentExitAt,
		lastAgentDisconnectReason: optionals.lastAgentDisconnectReason,
		protocolVersion: typeof record.protocol_version === "number" ? record.protocol_version : void 0,
		agentCapabilities: asRecord$4(record.agent_capabilities),
		title: conversation.title,
		messages: conversation.messages,
		updated_at: conversation.updated_at,
		cumulative_token_usage: conversation.cumulative_token_usage,
		cumulative_cost: conversation.cumulative_cost,
		request_token_usage: conversation.request_token_usage,
		acpx: parseAcpxState(record.acpx),
		importedFrom: metadata.importedFrom
	};
}
function hasValidSessionRecordCore(record) {
	return hasStringFields(record, [
		"acpx_record_id",
		"acp_session_id",
		"agent_command",
		"cwd",
		"created_at",
		"last_used_at"
	]) && typeof record.last_seq === "number" && Number.isInteger(record.last_seq) && record.last_seq >= 0;
}
function validSessionOptionals(options) {
	if (hasNullOptionalSessionFields(options) || hasInvalidExitStatus(options)) return null;
	return options;
}
function hasNullOptionalSessionFields(options) {
	return [
		options.name,
		options.pid,
		options.closed,
		options.closedAt,
		options.agentStartedAt,
		options.lastPromptAt,
		options.lastAgentExitAt,
		options.lastAgentDisconnectReason
	].some((value) => value === null);
}
function hasInvalidExitStatus(options) {
	return typeof options.lastAgentExitCode === "symbol" || typeof options.lastAgentExitSignal === "symbol";
}
const counters = /* @__PURE__ */ new Map();
function incrementPerfCounter(name, delta = 1) {
	counters.set(name, (counters.get(name) ?? 0) + delta);
}
const SNAKE_CASE_KEY = /^[a-z][a-z0-9_]*$/;
const ZED_TAG_KEYS = /* @__PURE__ */ new Set([
	"User",
	"Agent",
	"Resume",
	"Text",
	"Mention",
	"Image",
	"Audio",
	"Thinking",
	"RedactedThinking",
	"ToolUse"
]);
const MAP_OBJECT_PATHS = /* @__PURE__ */ new Set(["request_token_usage", "messages.Agent.tool_results"]);
const OPAQUE_VALUE_PATHS = /* @__PURE__ */ new Set([
	"agent_capabilities",
	"messages.Agent.content.ToolUse.input",
	"acpx.desired_config_options",
	"acpx.config_options"
]);
function isRecord$1(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function joinPath(path) {
	return path.join(".");
}
function isAllowedKey(path, key) {
	if (ZED_TAG_KEYS.has(key)) return true;
	return false;
}
function shouldSkipKeyRule(path) {
	return MAP_OBJECT_PATHS.has(joinPath(path));
}
function shouldSkipDescend(path) {
	return OPAQUE_VALUE_PATHS.has(joinPath(path)) || isToolResultOutputPath(path);
}
function isToolResultOutputTail(path, toolResultsIndex) {
	return toolResultsIndex !== -1 && toolResultsIndex + 2 === path.length - 1;
}
function isToolResultOutputPath(path) {
	if (path.length < 5 || path[path.length - 1] !== "output") return false;
	const toolResultsIndex = path.lastIndexOf("tool_results");
	if (!isToolResultOutputTail(path, toolResultsIndex)) return false;
	return path.slice(0, toolResultsIndex + 1).join(".") === "messages.Agent.tool_results";
}
function collectViolations(value, path, violations) {
	if (Array.isArray(value)) {
		for (const entry of value) collectViolations(entry, path, violations);
		return;
	}
	if (!isRecord$1(value)) return;
	const skipKeyRule = shouldSkipKeyRule(path);
	for (const [key, child] of Object.entries(value)) collectKeyViolation(child, key, path, skipKeyRule, violations);
}
function collectKeyViolation(child, key, path, skipKeyRule, violations) {
	if (!skipKeyRule && !SNAKE_CASE_KEY.test(key) && !isAllowedKey(path, key)) violations.push(`${joinPath(path)}.${key}`.replace(/^\./, ""));
	const childPath = [...path, key];
	if (!shouldSkipDescend(childPath)) collectViolations(child, childPath, violations);
}
function findPersistedKeyPolicyViolations(value) {
	const violations = [];
	collectViolations(value, [], violations);
	return violations;
}
function assertPersistedKeyPolicy(value) {
	const violations = findPersistedKeyPolicyViolations(value);
	if (violations.length === 0) return;
	throw new Error(`Persisted key policy violation (expected snake_case keys): ${violations.join(", ")}`);
}
function createAtomicWriteTempPath(filePath, createUniqueId = randomUUID) {
	const tempName = `.acpx-write.${process.pid}.${Date.now()}.${createUniqueId()}.tmp`;
	return path.join(path.dirname(filePath), tempName);
}
function absolutePath(value) {
	return path.resolve(value);
}
function isoNow$2() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
async function promptForPermission(options) {
	if (!process.stdin.isTTY || !process.stderr.isTTY) return false;
	if (options.header) process.stderr.write(`\n${options.header}\n`);
	if (options.details && options.details.trim().length > 0) process.stderr.write(`${options.details}\n`);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stderr
	});
	try {
		const normalized = (await rl.question(options.prompt)).trim().toLowerCase();
		return normalized === "y" || normalized === "yes";
	} finally {
		rl.close();
	}
}
const WRITE_PREVIEW_MAX_LINES = 16;
const WRITE_PREVIEW_MAX_CHARS = 1200;
function nowIso$1() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function isWithinRoot(rootDir, targetPath) {
	const relative = path.relative(rootDir, targetPath);
	return relative.length === 0 || !relative.startsWith("..") && !path.isAbsolute(relative);
}
function toWritePreview(content) {
	const lines = content.replace(/\r\n/g, "\n").split("\n");
	const visibleLines = lines.slice(0, WRITE_PREVIEW_MAX_LINES);
	let preview = visibleLines.join("\n");
	if (lines.length > visibleLines.length) preview += `\n... (${lines.length - visibleLines.length} more lines)`;
	if (preview.length > WRITE_PREVIEW_MAX_CHARS) preview = `${preview.slice(0, WRITE_PREVIEW_MAX_CHARS - 3)}...`;
	return preview;
}
async function defaultConfirmWrite(filePath, preview) {
	return await promptForPermission({
		header: `[permission] Allow write to ${filePath}?`,
		details: preview,
		prompt: "Allow write? (y/N) "
	});
}
function canPromptForPermission$2() {
	return process.stdin.isTTY && process.stderr.isTTY;
}
var FileSystemHandlers = class {
	rootDir;
	permissionMode;
	nonInteractivePermissions;
	onOperation;
	usesDefaultConfirmWrite;
	confirmWrite;
	constructor(options) {
		this.rootDir = path.resolve(options.cwd);
		this.permissionMode = options.permissionMode;
		this.nonInteractivePermissions = options.nonInteractivePermissions ?? "deny";
		this.onOperation = options.onOperation;
		this.usesDefaultConfirmWrite = options.confirmWrite == null;
		this.confirmWrite = options.confirmWrite ?? defaultConfirmWrite;
	}
	updatePermissionPolicy(permissionMode, nonInteractivePermissions) {
		this.permissionMode = permissionMode;
		this.nonInteractivePermissions = nonInteractivePermissions ?? "deny";
	}
	async readTextFile(params) {
		const filePath = this.resolvePathWithinRoot(params.path);
		const summary = `read_text_file: ${filePath}`;
		this.emitOperation({
			method: "fs/read_text_file",
			status: "running",
			summary,
			details: this.readWindowDetails(params.line, params.limit),
			timestamp: nowIso$1()
		});
		try {
			if (this.permissionMode === "deny-all") throw new PermissionDeniedError("Permission denied for fs/read_text_file (--deny-all)");
			const content = await fs$1.readFile(filePath, "utf8");
			const sliced = this.sliceContent(content, params.line, params.limit);
			this.emitOperation({
				method: "fs/read_text_file",
				status: "completed",
				summary,
				details: this.readWindowDetails(params.line, params.limit),
				timestamp: nowIso$1()
			});
			return { content: sliced };
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.emitOperation({
				method: "fs/read_text_file",
				status: "failed",
				summary,
				details: message,
				timestamp: nowIso$1()
			});
			throw error;
		}
	}
	async writeTextFile(params) {
		const filePath = this.resolvePathWithinRoot(params.path);
		const preview = toWritePreview(params.content);
		const summary = `write_text_file: ${filePath}`;
		this.emitOperation({
			method: "fs/write_text_file",
			status: "running",
			summary,
			details: preview,
			timestamp: nowIso$1()
		});
		try {
			if (!await this.isWriteApproved(filePath, preview)) throw new PermissionDeniedError("Permission denied for fs/write_text_file");
			await fs$1.mkdir(path.dirname(filePath), { recursive: true });
			await fs$1.writeFile(filePath, params.content, "utf8");
			this.emitOperation({
				method: "fs/write_text_file",
				status: "completed",
				summary,
				details: preview,
				timestamp: nowIso$1()
			});
			return {};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.emitOperation({
				method: "fs/write_text_file",
				status: "failed",
				summary,
				details: message,
				timestamp: nowIso$1()
			});
			throw error;
		}
	}
	async isWriteApproved(filePath, preview) {
		if (this.permissionMode === "approve-all") return true;
		if (this.permissionMode === "deny-all") return false;
		if (this.usesDefaultConfirmWrite && this.nonInteractivePermissions === "fail" && !canPromptForPermission$2()) throw new PermissionPromptUnavailableError();
		return await this.confirmWrite(filePath, preview);
	}
	resolvePathWithinRoot(rawPath) {
		if (!path.isAbsolute(rawPath)) throw new Error(`Path must be absolute: ${rawPath}`);
		const resolved = path.resolve(rawPath);
		if (!isWithinRoot(this.rootDir, resolved)) throw new Error(`Path is outside allowed cwd subtree: ${resolved}`);
		return resolved;
	}
	sliceContent(content, line, limit) {
		if (line == null && limit == null) return content;
		const lines = content.split("\n");
		const startIndex = Math.max(0, (line == null ? 1 : Math.max(1, Math.trunc(line))) - 1);
		const maxLines = limit == null ? void 0 : Math.max(0, Math.trunc(limit));
		if (maxLines === 0) return "";
		const endIndex = maxLines == null ? lines.length : Math.min(lines.length, startIndex + maxLines);
		return lines.slice(startIndex, endIndex).join("\n");
	}
	readWindowDetails(line, limit) {
		if (line == null && limit == null) return;
		return `line=${line == null ? 1 : Math.max(1, Math.trunc(line))}, limit=${limit == null ? "all" : Math.max(0, Math.trunc(limit))}`;
	}
	emitOperation(operation) {
		this.onOperation?.(operation);
	}
};
function selected(optionId) {
	return { outcome: {
		outcome: "selected",
		optionId
	} };
}
function cancelled() {
	return { outcome: { outcome: "cancelled" } };
}
function withEscalationMetadata(response, event) {
	return {
		...response,
		_meta: {
			...response._meta,
			acpx: {
				...response._meta?.acpx && typeof response._meta.acpx === "object" && !Array.isArray(response._meta.acpx) ? response._meta.acpx : {},
				permissionEscalation: event
			}
		}
	};
}
function pickOption(options, kinds) {
	for (const kind of kinds) {
		const match = options.find((option) => option.kind === kind);
		if (match) return match;
	}
}
const TOOL_KIND_TITLE_MATCHERS = [
	{
		kind: "read",
		needles: ["read", "cat"]
	},
	{
		kind: "search",
		needles: [
			"search",
			"find",
			"grep"
		]
	},
	{
		kind: "edit",
		needles: [
			"write",
			"edit",
			"patch"
		]
	},
	{
		kind: "delete",
		needles: ["delete", "remove"]
	},
	{
		kind: "move",
		needles: ["move", "rename"]
	},
	{
		kind: "execute",
		needles: [
			"run",
			"execute",
			"bash"
		]
	},
	{
		kind: "fetch",
		needles: [
			"fetch",
			"http",
			"url"
		]
	},
	{
		kind: "think",
		needles: ["think"]
	}
];
function inferToolKind(params) {
	if (params.toolCall.kind) return params.toolCall.kind;
	const title = params.toolCall.title?.trim().toLowerCase();
	if (!title) return;
	const head = title.split(":", 1)[0]?.trim();
	if (!head) return;
	return titleHeadToolKind(head) ?? "other";
}
function titleHeadToolKind(head) {
	return TOOL_KIND_TITLE_MATCHERS.find(({ needles }) => needles.some((needle) => head.includes(needle)))?.kind;
}
function isAutoApprovedReadKind(kind) {
	return kind === "read" || kind === "search";
}
async function promptForToolPermission(params) {
	return await promptForPermission({ prompt: `\n[permission] Allow ${params.toolCall.title ?? "tool"} [${inferToolKind(params) ?? "other"}]? (y/N) ` });
}
function canPromptForPermission$1() {
	return process.stdin.isTTY && process.stderr.isTTY;
}
function readStringProperty(value, keys) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	for (const key of keys) {
		const entry = record[key];
		if (typeof entry === "string" && entry.trim().length > 0) return entry.trim();
	}
}
function readToolName(params) {
	const rawInputName = readStringProperty(params.toolCall.rawInput, [
		"name",
		"tool",
		"toolName"
	]);
	if (rawInputName) return rawInputName;
	const head = (params.toolCall.title?.trim())?.split(/[:\s]/, 1)[0]?.trim();
	return head && head.length > 0 ? head : void 0;
}
function normalizeMatcher(value) {
	return value.trim().toLowerCase();
}
function permissionMatchTokens(params) {
	const tokens = /* @__PURE__ */ new Set();
	const kind = inferToolKind(params);
	const rawKind = params.toolCall.kind;
	const title = params.toolCall.title?.trim();
	const toolName = readToolName(params);
	for (const value of [
		kind,
		rawKind,
		title,
		toolName
	]) if (typeof value === "string" && value.trim().length > 0) tokens.add(normalizeMatcher(value));
	if (title) {
		const head = title.split(/[:\s]/, 1)[0]?.trim();
		if (head) tokens.add(normalizeMatcher(head));
	}
	return [...tokens];
}
function findPolicyRule(rules, params) {
	if (!rules || rules.length === 0) return;
	const tokens = permissionMatchTokens(params);
	for (const rule of rules) {
		const normalized = normalizeMatcher(rule);
		if (normalized === "*" || tokens.includes(normalized)) return rule;
	}
}
function matchPermissionPolicy(params, policy) {
	if (!policy) return;
	const denyRule = findPolicyRule(policy.autoDeny, params);
	if (denyRule) return {
		action: "deny",
		matchedRule: denyRule
	};
	const approveRule = findPolicyRule(policy.autoApprove, params);
	if (approveRule) return {
		action: "approve",
		matchedRule: approveRule
	};
	const escalateRule = findPolicyRule(policy.escalate, params);
	if (escalateRule) return {
		action: "escalate",
		matchedRule: escalateRule
	};
	return policy.defaultAction ? { action: policy.defaultAction } : void 0;
}
function buildEscalationEvent(params, matchedRule) {
	const toolKind = inferToolKind(params);
	const toolTitle = params.toolCall.title?.trim() || "tool";
	const toolName = readToolName(params);
	return {
		type: "permission_escalation",
		sessionId: params.sessionId,
		toolCallId: params.toolCall.toolCallId,
		...toolName ? { toolName } : {},
		toolTitle,
		...params.toolCall.rawInput !== void 0 ? { toolInput: params.toolCall.rawInput } : {},
		...toolKind ? { toolKind } : {},
		action: "escalate",
		...matchedRule ? { matchedRule } : {},
		message: `Permission escalation required for ${toolTitle}`,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function selectedOrFirst(options, allowOption) {
	return { response: selected((allowOption ?? options[0]).optionId) };
}
function selectedOrCancelled(option) {
	return { response: option ? selected(option.optionId) : cancelled() };
}
async function resolveEscalatingPermissionRequest(params, policyMatch, allowOption, rejectOption) {
	if (canPromptForPermission$1()) return resolveInteractivePromptResult(params, allowOption, rejectOption);
	const escalation = buildEscalationEvent(params, policyMatch.matchedRule);
	return {
		response: withEscalationMetadata(rejectOption ? selected(rejectOption.optionId) : cancelled(), escalation),
		escalation
	};
}
async function resolveInteractivePromptResult(params, allowOption, rejectOption) {
	const approved = await promptForToolPermission(params);
	if (approved && allowOption) return { response: selected(allowOption.optionId) };
	if (!approved && rejectOption) return { response: selected(rejectOption.optionId) };
	return { response: cancelled() };
}
function resolvePolicyMatch(params, policyMatch, options, allowOption, rejectOption) {
	if (policyMatch?.action === "approve") return selectedOrFirst(options, allowOption);
	if (policyMatch?.action === "deny") return selectedOrCancelled(rejectOption);
	if (policyMatch?.action === "escalate") return resolveEscalatingPermissionRequest(params, policyMatch, allowOption, rejectOption);
}
function resolveModeMatch(options, mode, allowOption, rejectOption) {
	if (mode === "approve-all") return selectedOrFirst(options, allowOption);
	if (mode === "deny-all") return selectedOrCancelled(rejectOption);
}
function resolveNonInteractivePermission(nonInteractivePolicy, rejectOption) {
	if (nonInteractivePolicy === "fail") throw new PermissionPromptUnavailableError();
	return selectedOrCancelled(rejectOption);
}
async function resolveReadOrPromptPermission(params, nonInteractivePolicy, allowOption, rejectOption) {
	if (isAutoApprovedReadKind(inferToolKind(params)) && allowOption) return { response: selected(allowOption.optionId) };
	if (!canPromptForPermission$1()) return resolveNonInteractivePermission(nonInteractivePolicy, rejectOption);
	return resolveInteractivePromptResult(params, allowOption, rejectOption);
}
async function resolvePermissionRequestWithDetails(params, mode, nonInteractivePolicy = "deny", policy) {
	const options = params.options ?? [];
	if (options.length === 0) return { response: cancelled() };
	const allowOption = pickOption(options, ["allow_once", "allow_always"]);
	const rejectOption = pickOption(options, ["reject_once", "reject_always"]);
	const resolvedByPolicy = await resolvePolicyMatch(params, matchPermissionPolicy(params, policy), options, allowOption, rejectOption);
	if (resolvedByPolicy) return resolvedByPolicy;
	const resolvedByMode = resolveModeMatch(options, mode, allowOption, rejectOption);
	if (resolvedByMode) return resolvedByMode;
	return resolveReadOrPromptPermission(params, nonInteractivePolicy, allowOption, rejectOption);
}
const DECISION_FALLBACK_ORDER = {
	allow_once: ["allow_once", "allow_always"],
	allow_always: ["allow_always", "allow_once"],
	reject_once: ["reject_once", "reject_always"],
	reject_always: ["reject_always", "reject_once"]
};
function decisionToResponse(params, decision) {
	if (decision.outcome === "cancel") return cancelled();
	const matched = pickOption(params.options ?? [], DECISION_FALLBACK_ORDER[decision.outcome]);
	return matched ? selected(matched.optionId) : cancelled();
}
function classifyPermissionDecision(params, response) {
	if (response.outcome.outcome !== "selected") return "cancelled";
	const selectedOptionId = response.outcome.optionId;
	const selectedOption = params.options.find((option) => option.optionId === selectedOptionId);
	if (!selectedOption) return "cancelled";
	if (selectedOption.kind === "allow_once" || selectedOption.kind === "allow_always") return "approved";
	return "denied";
}
function readWindowsEnvValue(env, key) {
	const matchedKey = Object.keys(env).find((entry) => entry.toUpperCase() === key);
	return matchedKey ? env[matchedKey] : void 0;
}
function windowsExecutableExtensions(env) {
	return (readWindowsEnvValue(env, "PATHEXT") ?? ".COM;.EXE;.BAT;.CMD").split(";").map((value) => value.trim().toLowerCase()).filter((value) => value.length > 0);
}
function commandCandidates(command, env) {
	if (path.extname(command).length > 0) return [command];
	return windowsExecutableExtensions(env).map((extension) => `${command}${extension}`);
}
function commandHasPath(command) {
	return command.includes("/") || command.includes("\\") || path.isAbsolute(command);
}
function resolveWindowsPathCommand(command, env) {
	const candidates = commandCandidates(command, env);
	const pathValue = readWindowsEnvValue(env, "PATH");
	if (!pathValue) return;
	for (const directory of pathValue.split(";")) {
		const resolved = findExistingCommandInDirectory(directory, candidates);
		if (resolved) return resolved;
	}
}
function findExistingCommandInDirectory(directory, candidates) {
	const trimmedDirectory = directory.trim();
	if (trimmedDirectory.length === 0) return;
	return candidates.map((candidate) => path.join(trimmedDirectory, candidate)).find((resolved) => fs.existsSync(resolved));
}
function resolveWindowsWrapperToken(token, wrapperPath) {
	const relative = token.match(/%~?dp0%?\s*[\\/]*(.*)$/i)?.[1]?.trim();
	if (!relative) return;
	const candidate = path.resolve(path.dirname(wrapperPath), relative.replace(/[\\/]+/g, path.sep).replace(/^[\\/]+/, ""));
	return path.extname(candidate).toLowerCase() === ".exe" && fs.existsSync(candidate) ? candidate : void 0;
}
function resolveWindowsWrapperExecutable(wrapperPath) {
	if (!fs.existsSync(wrapperPath)) return;
	try {
		return [...fs.readFileSync(wrapperPath, "utf8").matchAll(/"([^"\r\n]*)"/g)].map((match) => resolveWindowsWrapperToken(match[1] ?? "", wrapperPath)).find((candidate) => candidate !== void 0);
	} catch {
		return;
	}
}
function resolveWindowsCommand(command, env = process.env) {
	const candidates = commandCandidates(command, env);
	if (commandHasPath(command)) return candidates.find((candidate) => fs.existsSync(candidate));
	return resolveWindowsPathCommand(command, env);
}
/**
* Resolve a Windows command to a native executable suitable for direct spawn.
*
* Batch and PowerShell shims are intentionally rejected unless they point at a
* real `.exe` entrypoint. Callers that need shell execution should use the
* command-specific shell policy instead.
*/
function resolveWindowsExecutablePath(command, env = process.env) {
	const resolved = resolveWindowsCommand(command, env);
	if (!resolved) return;
	const absolute = path.resolve(resolved);
	const extension = path.extname(absolute).toLowerCase();
	if (extension === ".exe") return absolute;
	if (extension !== ".cmd" && extension !== ".bat" && extension !== ".ps1") return;
	const siblingExecutable = `${absolute.slice(0, -extension.length)}.exe`;
	return fs.existsSync(siblingExecutable) ? siblingExecutable : resolveWindowsWrapperExecutable(absolute);
}
function shouldUseWindowsBatchShell(command, platform = process.platform, env = process.env) {
	if (platform !== "win32") return false;
	const resolvedCommand = resolveWindowsCommand(command, env) ?? command;
	const ext = path.extname(resolvedCommand).toLowerCase();
	return ext === ".cmd" || ext === ".bat";
}
const CMD_META_CHAR_RE = /([()\][%!^"`<>&|;, *?])/gu;
const CMD_BACKSLASH_QUOTE_RE = /(?=(\\+?)?)\1"/gu;
const CMD_TRAILING_BACKSLASH_RE = /(?=(\\+?)?)\1$/gu;
const CMD_SHIM_RE = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/iu;
function escapeCmdCommand(value) {
	return value.replace(CMD_META_CHAR_RE, "^$1");
}
function escapeCmdArgument(value, doubleEscapeMeta) {
	const escaped = `"${value.replace(CMD_BACKSLASH_QUOTE_RE, "$1$1\\\"").replace(CMD_TRAILING_BACKSLASH_RE, "$1$1")}"`.replace(CMD_META_CHAR_RE, "^$1");
	return doubleEscapeMeta ? escaped.replace(CMD_META_CHAR_RE, "^$1") : escaped;
}
function buildAgentSpawnCommand(command, args, platform = process.platform, env = process.env) {
	if (!shouldUseWindowsBatchShell(command, platform, env)) return {
		command,
		args: [...args]
	};
	const resolvedCommand = path.win32.normalize(resolveWindowsCommand(command, env) ?? command);
	const doubleEscapeMeta = CMD_SHIM_RE.test(resolvedCommand);
	const shellCommand = [escapeCmdCommand(resolvedCommand), ...args.map((arg) => escapeCmdArgument(arg, doubleEscapeMeta))].join(" ");
	return {
		command: readWindowsEnvValue(env, "COMSPEC") ?? "cmd.exe",
		args: [
			"/d",
			"/s",
			"/c",
			`"${shellCommand}"`
		],
		windowsVerbatimArguments: true
	};
}
function buildSpawnCommandOptions(command, options, platform = process.platform, env = process.env) {
	if (!shouldUseWindowsBatchShell(command, platform, env)) return options;
	return {
		...options,
		shell: true
	};
}
function buildTerminalSpawnCommand(command, args) {
	return {
		command,
		args: args ?? [],
		killProcessGroup: false
	};
}
function buildTerminalShellSpawnCommand(command, platform = process.platform) {
	if (platform === "win32") return {
		command: "cmd.exe",
		args: [
			"/d",
			"/s",
			"/c",
			command
		],
		killProcessGroup: true
	};
	return {
		command: "/bin/sh",
		args: ["-c", command],
		killProcessGroup: true
	};
}
const UNKNOWN_VERSION = "0.0.0-unknown";
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
let cachedVersion = null;
function parseVersion(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}
function readPackageVersion(packageJsonPath) {
	try {
		return parseVersion(JSON.parse(readFileSync(packageJsonPath, "utf8")).version);
	} catch {
		return null;
	}
}
function resolveVersionFromAncestors(startDir) {
	let current = startDir;
	while (true) {
		const packageVersion = readPackageVersion(path.join(current, "package.json"));
		if (packageVersion) return packageVersion;
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
function resolveAcpxVersion(params) {
	const envVersion = resolvePackageEnvVersion(params?.env ?? process.env);
	if (envVersion) return envVersion;
	if (params?.packageJsonPath) return readPackageVersion(params.packageJsonPath) ?? UNKNOWN_VERSION;
	return resolveVersionFromAncestors(MODULE_DIR) ?? UNKNOWN_VERSION;
}
function resolvePackageEnvVersion(env) {
	const envPackageName = parseVersion(env.npm_package_name);
	const envVersion = parseVersion(env.npm_package_version);
	return envPackageName === "acpx" ? envVersion : null;
}
function getAcpxVersion() {
	if (cachedVersion) return cachedVersion;
	cachedVersion = resolveAcpxVersion();
	return cachedVersion;
}
async function runTimedExecFile(command, args, options = {}) {
	const timeoutMs = Math.max(1, Math.round(options.timeoutMs ?? 8e3));
	return await new Promise((resolve, reject) => {
		let settled = false;
		let timer;
		const child = execFile(command, [...args], {
			encoding: "utf8",
			maxBuffer: options.maxBufferBytes ?? 33554432,
			killSignal: "SIGKILL",
			windowsHide: options.windowsHide
		}, (error, stdout) => {
			if (settled) return;
			settled = true;
			if (timer) clearTimeout(timer);
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout);
		});
		timer = setTimeout(() => {
			if (settled) return;
			settled = true;
			const killed = child.kill("SIGKILL");
			child.stdout?.destroy();
			child.stderr?.destroy();
			child.unref();
			reject(Object.assign(/* @__PURE__ */ new Error(`${command} timed out after ${timeoutMs}ms`), {
				code: "ETIMEDOUT",
				killed,
				signal: "SIGKILL"
			}));
		}, timeoutMs);
	});
}
function normalizeAgentCommandInput(value) {
	if (typeof value === "string") return { agentCommand: value };
	const parts = toCommandParts([...value]);
	const argv = [parts.command, ...parts.args];
	return {
		agentCommand: renderArgvIdentity(argv),
		agentArgv: argv
	};
}
const IDENTITY_SAFE_ARG_RE = /^[A-Za-z0-9_@%+=:,./^~-]+$/u;
function renderArgvIdentity(argv) {
	return argv.map((arg) => IDENTITY_SAFE_ARG_RE.test(arg) ? arg : JSON.stringify(arg)).join(" ");
}
function isoNow$1() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function waitForSpawn$1(child) {
	return new Promise((resolve, reject) => {
		const onSpawn = () => {
			child.off("error", onError);
			resolve();
		};
		const onError = (error) => {
			child.off("spawn", onSpawn);
			reject(error);
		};
		child.once("spawn", onSpawn);
		child.once("error", onError);
	});
}
function isChildProcessRunning(child) {
	return child.exitCode == null && child.signalCode == null;
}
function requireAgentStdio(child) {
	if (!child.stdin || !child.stdout || !child.stderr) throw new Error("ACP agent must be spawned with piped stdin/stdout/stderr");
	return child;
}
function waitForChildExit(child, timeoutMs) {
	if (!isChildProcessRunning(child)) return Promise.resolve(true);
	return new Promise((resolve) => {
		let settled = false;
		const timer = setTimeout(() => {
			finish(false);
		}, Math.max(0, timeoutMs));
		const finish = (value) => {
			if (settled) return;
			settled = true;
			child.off("close", onExitLike);
			child.off("exit", onExitLike);
			clearTimeout(timer);
			resolve(value);
		};
		const onExitLike = () => {
			finish(true);
		};
		child.once("close", onExitLike);
		child.once("exit", onExitLike);
	});
}
function resolveAgentCommandParts(value, argv, platform = process.platform) {
	if (argv) {
		const parts = toCommandParts([...argv]);
		assertWindowsLaunchableCommand(parts.command, platform);
		return parts;
	}
	if (platform === "win32") throw new Error("Raw agent command strings are not supported on Windows. Configure the agent with an argv array, for example: \"argv\": [\"agent.exe\", \"--acp\"]. Legacy agents.<name>.args arrays are migrated automatically. Existing sessions without saved argv must be closed and recreated.");
	return splitCommandLine(value);
}
function assertWindowsLaunchableCommand(command, platform) {
	if (platform === "win32" && path.extname(command).toLowerCase() === ".sh") throw new Error(`Windows cannot launch shell script executable "${command}" directly. Configure an explicit interpreter argv, for example: "argv": ["bash", "${command}"]. acpx does not infer interpreters.`);
}
function splitCommandLine(value) {
	const parts = [];
	let current = "";
	let quote = null;
	let escaping = false;
	let hasPart = false;
	for (const ch of value) {
		const next = readCommandLineChar({
			ch,
			current,
			quote,
			escaping,
			parts,
			hasPart
		});
		current = next.current;
		quote = next.quote;
		escaping = next.escaping;
		hasPart = next.hasPart;
	}
	if (escaping) {
		current += "\\";
		hasPart = true;
	}
	if (quote) throw new Error("Invalid --agent command: unterminated quote");
	if (hasPart) parts.push(current);
	return toCommandParts(parts);
}
function toCommandParts(parts) {
	if (parts.length === 0 || parts[0] === "") throw new Error("Invalid --agent command: empty command");
	return {
		command: parts[0],
		args: parts.slice(1)
	};
}
function readCommandLineChar(state) {
	if (state.escaping) return {
		current: state.current + state.ch,
		quote: state.quote,
		escaping: false,
		hasPart: true
	};
	if (state.ch === "\\" && state.quote !== "'") return {
		current: state.current,
		quote: state.quote,
		escaping: true,
		hasPart: state.hasPart
	};
	if (state.quote) return readQuotedCommandLineChar({
		ch: state.ch,
		current: state.current,
		quote: state.quote,
		hasPart: state.hasPart
	});
	return readUnquotedCommandLineChar(state);
}
function readQuotedCommandLineChar(state) {
	if (state.ch === state.quote) return {
		current: state.current,
		quote: null,
		escaping: false,
		hasPart: true
	};
	return {
		current: state.current + state.ch,
		quote: state.quote,
		escaping: false,
		hasPart: true
	};
}
function readUnquotedCommandLineChar(state) {
	if (state.ch === "'" || state.ch === "\"") return {
		current: state.current,
		quote: state.ch,
		escaping: false,
		hasPart: true
	};
	if (/\s/.test(state.ch)) {
		flushCommandLinePart(state.parts, state.current, state.hasPart);
		return {
			current: "",
			quote: null,
			escaping: false,
			hasPart: false
		};
	}
	return {
		current: state.current + state.ch,
		quote: null,
		escaping: false,
		hasPart: true
	};
}
function flushCommandLinePart(parts, current, hasPart) {
	if (hasPart) parts.push(current);
}
function asAbsoluteCwd(cwd) {
	return path.resolve(cwd);
}
async function resolveAgentSessionCwd(cwd, agentCommand, options = {}) {
	const resolved = asAbsoluteCwd(cwd);
	if (!shouldTranslateWslWindowsCwd(agentCommand, options)) return resolved;
	const translated = (await (options.runWslpath ?? runWslpath)(resolved)).trim();
	if (!translated) throw new Error(`wslpath returned an empty Windows path for cwd: ${resolved}`);
	return translated;
}
function shouldTranslateWslWindowsCwd(agentCommand, options) {
	if (!isWsl(options)) return false;
	try {
		const { command } = splitCommandLine(agentCommand);
		return isWindowsExecutableCommand(command);
	} catch {
		return false;
	}
}
function isWsl(options) {
	if ((options.platform ?? process.platform) !== "linux") return false;
	return (options.existsSync ?? fs.existsSync)("/proc/sys/fs/binfmt_misc/WSLInterop");
}
const WINDOWS_EXECUTABLE_EXTENSION_RE = /\.(?:exe|cmd|bat)$/u;
function isWindowsExecutableCommand(command) {
	const normalized = command.toLowerCase();
	return WINDOWS_EXECUTABLE_EXTENSION_RE.test(normalized);
}
async function runWslpath(cwd) {
	return await runTimedExecFile("wslpath", ["-w", cwd]);
}
function basenameToken(value) {
	return path.basename(value).toLowerCase().replace(/\.(cmd|exe|bat)$/u, "");
}
const DEFAULT_AGENT_CLOSE_AFTER_STDIN_END_MS = 100;
const QODER_AGENT_CLOSE_AFTER_STDIN_END_MS = 750;
const GEMINI_ACP_STARTUP_TIMEOUT_MS = 15e3;
const CLAUDE_ACP_SESSION_CREATE_TIMEOUT_MS = 6e4;
const GEMINI_VERSION_TIMEOUT_MS = 2e3;
const GEMINI_ACP_FLAG_VERSION = [
	0,
	33,
	0
];
const COPILOT_HELP_TIMEOUT_MS = 2e3;
const CLAUDE_CODE_DEFAULT_SETTING_SOURCES = ["project", "local"];
const QODER_BENIGN_STDOUT_LINES = /* @__PURE__ */ new Set(["Received interrupt signal. Cleaning up resources...", "Cleanup completed. Exiting..."]);
function resolveAgentCloseAfterStdinEndMs(agentCommand) {
	const { command } = splitCommandLine(agentCommand);
	return basenameToken(command) === "qodercli" ? QODER_AGENT_CLOSE_AFTER_STDIN_END_MS : DEFAULT_AGENT_CLOSE_AFTER_STDIN_END_MS;
}
function shouldIgnoreNonJsonAgentOutputLine(agentCommand, trimmedLine) {
	const { command } = splitCommandLine(agentCommand);
	return basenameToken(command) === "qodercli" && QODER_BENIGN_STDOUT_LINES.has(trimmedLine);
}
function isGeminiAcpCommand(command, args) {
	return basenameToken(command) === "gemini" && (args.includes("--acp") || args.includes("--experimental-acp"));
}
function isClaudeAcpCommand$1(command, args) {
	if (basenameToken(command) === "claude-agent-acp") return true;
	return args.some((arg) => arg.includes("claude-agent-acp"));
}
function isCopilotAcpCommand(command, args) {
	return basenameToken(command) === "copilot" && args.includes("--acp");
}
function isQoderAcpCommand(command, args) {
	return basenameToken(command) === "qodercli" && args.includes("--acp");
}
function isCursorAcpCommand(command, args) {
	const commandToken = basenameToken(command);
	return commandToken === "cursor-agent" || commandToken === "agent" && args.includes("acp");
}
function isDevinAcpCommand(command, args) {
	return basenameToken(command) === "devin" && (args.includes("acp") || args.includes("--acp") || args.includes("--experimental-acp"));
}
function hasCommandFlag(args, flagName) {
	return args.some((arg) => arg === flagName || arg.startsWith(`${flagName}=`));
}
function normalizeQoderAllowedToolName(tool) {
	switch (tool.trim().toLowerCase()) {
		case "bash":
		case "glob":
		case "grep":
		case "ls":
		case "read":
		case "write": return tool.trim().toUpperCase();
		default: return tool.trim();
	}
}
function buildQoderAcpCommandArgs(initialArgs, options) {
	const args = [...initialArgs];
	const sessionOptions = options.sessionOptions;
	if (typeof sessionOptions?.maxTurns === "number" && !hasCommandFlag(args, "--max-turns")) args.push(`--max-turns=${sessionOptions.maxTurns}`);
	if (Array.isArray(sessionOptions?.allowedTools) && !hasCommandFlag(args, "--allowed-tools") && !hasCommandFlag(args, "--disallowed-tools")) {
		const encodedTools = sessionOptions.allowedTools.map(normalizeQoderAllowedToolName).join(",");
		args.push(`--allowed-tools=${encodedTools}`);
	}
	return args;
}
function resolveGeminiAcpStartupTimeoutMs() {
	const raw = process.env.ACPX_GEMINI_ACP_STARTUP_TIMEOUT_MS;
	if (typeof raw === "string" && raw.trim().length > 0) {
		const parsed = Number(raw);
		if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
	}
	return GEMINI_ACP_STARTUP_TIMEOUT_MS;
}
function resolveClaudeAcpSessionCreateTimeoutMs() {
	const raw = process.env.ACPX_CLAUDE_ACP_SESSION_CREATE_TIMEOUT_MS;
	if (typeof raw === "string" && raw.trim().length > 0) {
		const parsed = Number(raw);
		if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
	}
	return CLAUDE_ACP_SESSION_CREATE_TIMEOUT_MS;
}
function parseGeminiVersion(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	const match = normalized.match(/(\d+)\.(\d+)\.(\d+)/);
	if (!match) return;
	return {
		raw: normalized,
		parts: [
			Number(match[1]),
			Number(match[2]),
			Number(match[3])
		]
	};
}
function compareVersionParts(left, right) {
	for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
		const leftPart = left[index] ?? 0;
		const rightPart = right[index] ?? 0;
		if (leftPart !== rightPart) return leftPart - rightPart;
	}
	return 0;
}
async function detectGeminiVersion(command) {
	const versionLine = (await readCommandOutput(command, ["--version"], GEMINI_VERSION_TIMEOUT_MS))?.split(/\r?\n/).map((line) => line.trim()).find((line) => /\d+\.\d+\.\d+/.test(line));
	return parseGeminiVersion(versionLine);
}
async function resolveGeminiCommandArgs(command, args) {
	if (basenameToken(command) !== "gemini" || !args.includes("--acp")) return [...args];
	const version = await detectGeminiVersion(command);
	if (version && compareVersionParts(version.parts, GEMINI_ACP_FLAG_VERSION) < 0) return args.map((arg) => arg === "--acp" ? "--experimental-acp" : arg);
	return [...args];
}
async function readCommandOutput(command, args, timeoutMs) {
	return await new Promise((resolve) => {
		const child = spawn(command, [...args], buildSpawnCommandOptions(command, {
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			windowsHide: true
		}));
		let stdout = "";
		let stderr = "";
		let settled = false;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			child.removeAllListeners();
			child.stdout?.removeAllListeners();
			child.stderr?.removeAllListeners();
			resolve(value);
		};
		const timer = setTimeout(() => {
			child.kill("SIGKILL");
			finish(void 0);
		}, timeoutMs);
		child.stdout?.setEncoding("utf8");
		child.stderr?.setEncoding("utf8");
		child.stdout?.on("data", (chunk) => {
			stdout += chunk;
		});
		child.stderr?.on("data", (chunk) => {
			stderr += chunk;
		});
		child.once("error", () => {
			finish(void 0);
		});
		child.once("close", () => {
			finish(`${stdout}\n${stderr}`);
		});
	});
}
async function buildGeminiAcpStartupTimeoutMessage(command) {
	const parts = ["Gemini CLI ACP startup timed out before initialize completed.", "This usually means the local Gemini CLI is waiting on interactive OAuth or has incompatible ACP subprocess behavior."];
	const version = await detectGeminiVersion(command);
	if (version) parts.push(`Detected Gemini CLI version: ${version.raw}.`);
	if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) parts.push("No GEMINI_API_KEY or GOOGLE_API_KEY was set for non-interactive auth.");
	parts.push("Try upgrading Gemini CLI and using API-key-based auth for non-interactive ACP runs.");
	return parts.join(" ");
}
function buildClaudeAcpSessionCreateTimeoutMessage() {
	return [
		"Claude ACP session creation timed out before session/new completed.",
		"This matches the known persistent-session stall seen with some Claude Code and @agentclientprotocol/claude-agent-acp combinations.",
		"In harnessed or non-interactive runs, prefer --approve-all with nonInteractivePermissions=deny, upgrade Claude Code and the Claude ACP adapter, or use acpx claude exec as a one-shot fallback."
	].join(" ");
}
async function buildCopilotAcpUnsupportedMessage(command) {
	const parts = ["GitHub Copilot CLI ACP stdio mode is not available in the installed copilot binary.", "acpx copilot expects a Copilot CLI release that supports --acp --stdio."];
	const helpOutput = await readCommandOutput(command, ["--help"], COPILOT_HELP_TIMEOUT_MS);
	if (typeof helpOutput === "string" && !helpOutput.includes("--acp")) parts.push("Detected copilot --help output without --acp support.");
	parts.push("Upgrade GitHub Copilot CLI to a release with ACP stdio support, or use --agent with another ACP-compatible adapter in the meantime.");
	return parts.join(" ");
}
async function ensureCopilotAcpSupport(command) {
	const helpOutput = await readCommandOutput(command, ["--help"], COPILOT_HELP_TIMEOUT_MS);
	if (typeof helpOutput === "string" && !helpOutput.includes("--acp")) throw new CopilotAcpUnsupportedError(await buildCopilotAcpUnsupportedMessage(command), { retryable: false });
}
function buildClaudeCodeOptionsMeta(options, isolateUserSettings = false) {
	const claudeCodeOptions = {};
	if (isolateUserSettings) claudeCodeOptions.settingSources = resolveClaudeCodeSettingSources();
	if (options) assignClaudeCodeOptions(claudeCodeOptions, options);
	const meta = {};
	if (Object.keys(claudeCodeOptions).length > 0) meta.claudeCode = { options: claudeCodeOptions };
	assignClaudeCodeSystemPrompt(meta, options?.systemPrompt);
	if (Object.keys(meta).length === 0) return;
	return meta;
}
function resolveClaudeCodeSettingSources(env = process.env) {
	if (env.ACPX_CLAUDE_INCLUDE_USER_SETTINGS?.trim() === "1") return ["user", ...CLAUDE_CODE_DEFAULT_SETTING_SOURCES];
	return [...CLAUDE_CODE_DEFAULT_SETTING_SOURCES];
}
function assignClaudeCodeOptions(target, options) {
	if (typeof options.model === "string" && options.model.trim().length > 0) target.model = options.model;
	if (Array.isArray(options.allowedTools)) target.allowedTools = [...options.allowedTools];
	if (typeof options.maxTurns === "number") target.maxTurns = options.maxTurns;
}
function assignClaudeCodeSystemPrompt(target, systemPrompt) {
	if (typeof systemPrompt === "string" && systemPrompt.length > 0) {
		target.systemPrompt = systemPrompt;
		return;
	}
	if (isAppendSystemPrompt(systemPrompt)) target.systemPrompt = { append: systemPrompt.append };
}
function isAppendSystemPrompt(value) {
	return !!value && typeof value === "object" && typeof value.append === "string" && value.append.length > 0;
}
function resolveClaudeCodeExecutable(platform = process.platform, env = process.env) {
	if (platform !== "win32") return;
	if (readWindowsEnvValue(env, "CLAUDE_CODE_EXECUTABLE")) return;
	return resolveWindowsExecutablePath("claude", env);
}
const AUTH_ENV_PREFIX = "ACPX_AUTH_";
function toEnvToken(value) {
	return value.trim().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toUpperCase();
}
function buildAuthEnvKey(methodId) {
	const token = toEnvToken(methodId);
	return token.length > 0 ? `${AUTH_ENV_PREFIX}${token}` : void 0;
}
const authEnvKeyCache = /* @__PURE__ */ new Map();
function authEnvKey(methodId) {
	const cached = authEnvKeyCache.get(methodId);
	if (cached !== void 0) return cached;
	const key = buildAuthEnvKey(methodId);
	authEnvKeyCache.set(methodId, key);
	return key;
}
function readEnvCredential(methodId) {
	const key = authEnvKey(methodId);
	if (!key) return;
	const value = process.env[key];
	if (typeof value === "string" && value.trim().length > 0) return value;
}
function protectedEnvKey(key) {
	return process.platform === "win32" ? key.toUpperCase() : key;
}
function isAuthEnvKey(key) {
	return protectedEnvKey(key).startsWith(AUTH_ENV_PREFIX);
}
function authEnvSuffix(key) {
	return key.slice(10);
}
function protectEnvKey(protectedKeys, key) {
	protectedKeys.add(protectedEnvKey(key));
}
function promotePrefixedAuthEnvironment(env) {
	const protectedKeys = /* @__PURE__ */ new Set();
	for (const [key, value] of Object.entries(env)) {
		if (!isAuthEnvKey(key)) continue;
		if (typeof value !== "string" || value.trim().length === 0) continue;
		const normalized = toEnvToken(authEnvSuffix(key));
		if (!normalized) continue;
		protectEnvKey(protectedKeys, key);
		protectEnvKey(protectedKeys, normalized);
		if (env[normalized] == null) env[normalized] = value;
	}
	return protectedKeys;
}
function buildAgentEnvironment(authCredentials, sessionEnv) {
	const env = { ...process.env };
	const protectedAuthEnvKeys = promotePrefixedAuthEnvironment(env);
	if (authCredentials) for (const [methodId, credential] of Object.entries(authCredentials)) {
		addAuthCredentialEnvKeys(protectedAuthEnvKeys, methodId, credential);
		assignAuthCredentialEnv(env, methodId, credential);
	}
	if (sessionEnv) for (const [key, value] of Object.entries(sessionEnv)) {
		if (typeof value !== "string" || protectedAuthEnvKeys.has(protectedEnvKey(key))) continue;
		assignSessionEnv(env, key, value);
	}
	return env;
}
function assignSessionEnv(env, key, value) {
	const normalizedKey = protectedEnvKey(key);
	for (const existingKey of Object.keys(env)) if (protectedEnvKey(existingKey) === normalizedKey) delete env[existingKey];
	env[key] = value;
}
function addAuthCredentialEnvKeys(protectedKeys, methodId, credential) {
	if (typeof credential !== "string" || credential.trim().length === 0) return;
	if (!methodId.includes("=") && !methodId.includes("\0")) protectEnvKey(protectedKeys, methodId);
	const normalized = toEnvToken(methodId);
	if (normalized) {
		protectEnvKey(protectedKeys, `${AUTH_ENV_PREFIX}${normalized}`);
		protectEnvKey(protectedKeys, normalized);
	}
}
function assignAuthCredentialEnv(env, methodId, credential) {
	if (typeof credential !== "string" || credential.trim().length === 0) return;
	if (!methodId.includes("=") && !methodId.includes("\0") && env[methodId] == null) env[methodId] = credential;
	const normalized = toEnvToken(methodId);
	if (normalized) {
		assignIfMissing(env, `${AUTH_ENV_PREFIX}${normalized}`, credential);
		assignIfMissing(env, normalized, credential);
	}
}
function assignIfMissing(env, key, value) {
	if (env[key] == null) env[key] = value;
}
function resolveConfiguredAuthCredential(methodId, authCredentials) {
	const configCredentials = authCredentials ?? {};
	return configCredentials[methodId] ?? configCredentials[toEnvToken(methodId)];
}
function buildAgentSpawnOptions(cwd, authCredentials, sessionEnv) {
	return {
		cwd,
		env: buildAgentEnvironment(authCredentials, sessionEnv),
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		],
		windowsHide: true
	};
}
const REQUESTED_MODEL_UNSUPPORTED_ERROR_CODE = "ACP_MODEL_UNSUPPORTED";
const REQUESTED_MODEL_UNSUPPORTED_REASONS = ["missing-capability", "unadvertised-model"];
var RequestedModelUnsupportedError = class extends Error {
	code = REQUESTED_MODEL_UNSUPPORTED_ERROR_CODE;
	reason;
	constructor(message, reason) {
		super(message);
		this.name = "RequestedModelUnsupportedError";
		this.reason = reason;
	}
};
function isRequestedModelUnsupportedReason(value) {
	return typeof value === "string" && REQUESTED_MODEL_UNSUPPORTED_REASONS.includes(value);
}
function isRequestedModelUnsupportedError(value) {
	if (value instanceof RequestedModelUnsupportedError) return true;
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.name === "RequestedModelUnsupportedError" && candidate.code === "ACP_MODEL_UNSUPPORTED" && isRequestedModelUnsupportedReason(candidate.reason);
}
function supportsLegacyClaudeCodeModelMetadata(agentCommand) {
	if (!agentCommand) return false;
	const { command, args } = splitCommandLine(agentCommand);
	return isClaudeAcpCommand$1(command, args);
}
function asRecord$2(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function parseAvailableModel(value) {
	const option = asRecord$2(value);
	if (!option || typeof option.value !== "string" || typeof option.name !== "string") return;
	return {
		modelId: option.value,
		name: option.name
	};
}
function parseAvailableModelGroup(value) {
	const group = asRecord$2(value);
	if (!group || typeof group.group !== "string" || typeof group.name !== "string" || !Array.isArray(group.options)) return;
	const models = group.options.map((option) => parseAvailableModel(option));
	return models.every((model) => model !== void 0) ? models : void 0;
}
function parseAvailableModels(value) {
	if (!Array.isArray(value)) return;
	const directModels = value.map((option) => parseAvailableModel(option));
	if (directModels.every((model) => model !== void 0)) return directModels;
	const groupedModels = value.map((group) => parseAvailableModelGroup(group));
	return groupedModels.every((models) => models !== void 0) ? groupedModels.flat() : void 0;
}
function isModelSelectOption(option) {
	return option.type === "select" && (option.category === "model" || option.id === "model");
}
function parseModelConfigOption(value) {
	const option = asRecord$2(value);
	if (!option || !isModelSelectOption(option) || typeof option.id !== "string" || typeof option.currentValue !== "string") return;
	const availableModels = parseAvailableModels(option.options);
	return availableModels ? {
		configId: option.id,
		currentModelId: option.currentValue,
		availableModels
	} : void 0;
}
function modelStateFromConfigOptions(configOptions) {
	if (!Array.isArray(configOptions)) return;
	for (const value of configOptions) {
		const models = parseModelConfigOption(value);
		if (models) return models;
	}
}
function modelStateFromLegacyResponse(response) {
	if (!response || typeof response !== "object") return;
	const models = response.models;
	if (!models || typeof models.currentModelId !== "string" || !Array.isArray(models.availableModels)) return;
	const availableModels = models.availableModels.flatMap((entry) => {
		if (!entry || typeof entry !== "object") return [];
		const candidate = entry;
		return typeof candidate.modelId === "string" && typeof candidate.name === "string" ? [{
			modelId: candidate.modelId,
			name: candidate.name
		}] : [];
	});
	return {
		currentModelId: models.currentModelId,
		availableModels
	};
}
function modelStateFromSessionResponse(params) {
	return modelStateFromConfigOptions(params.configOptions) ?? modelStateFromLegacyResponse(params.response);
}
function formatAvailableModelIds(models) {
	const ids = models?.availableModels.map((model) => model.modelId.trim()).filter((modelId) => modelId.length > 0) ?? [];
	return ids.length > 0 ? ids.join(", ") : "none advertised";
}
function resolveRequestedModelId(params) {
	if (!params.models || !isCursorAcpCommandForModelAlias(params.agentCommand)) return params.requestedModel;
	if (params.models.availableModels.some((model) => model.modelId === params.requestedModel)) return params.requestedModel;
	const candidates = params.models.availableModels.map((model) => model.modelId).filter((modelId) => modelId.startsWith(`${params.requestedModel}[`));
	return candidates.length === 1 ? candidates[0] : params.requestedModel;
}
function isCursorAcpCommandForModelAlias(agentCommand) {
	if (!agentCommand) return false;
	const { command, args } = splitCommandLine(agentCommand);
	return isCursorAcpCommand(command, args);
}
function assertRequestedModelSupported(params) {
	if (!params.models) {
		if (supportsLegacyClaudeCodeModelMetadata(params.agentCommand)) return;
		throw new RequestedModelUnsupportedError(`Cannot ${params.context === "replay" ? "replay saved model" : "apply --model"} "${params.requestedModel}": the ACP agent did not advertise model support through a session config option or legacy models metadata, and the adapter does not support a startup model flag.`, "missing-capability");
	}
	if (!new Set(params.models.availableModels.map((model) => model.modelId)).has(params.requestedModel)) {
		const resolvedModel = resolveRequestedModelId(params);
		if (resolvedModel !== params.requestedModel) return `Cursor ACP advertised "${resolvedModel}" for requested model "${params.requestedModel}"; using the advertised id.`;
		if (supportsLegacyClaudeCodeModelMetadata(params.agentCommand)) return `requested model "${params.requestedModel}" was not in the Claude ACP advertised model list (${formatAvailableModelIds(params.models)}); forwarding it to Claude Code so the adapter can accept or reject it.`;
		throw new RequestedModelUnsupportedError(`Cannot ${params.context === "replay" ? "replay saved model" : "apply --model"} "${params.requestedModel}": the ACP agent did not advertise that model. Available models: ${formatAvailableModelIds(params.models)}.`, "unadvertised-model");
	}
}
const SESSION_CONTROL_UNSUPPORTED_ACP_CODES = /* @__PURE__ */ new Set([-32601, -32602]);
function asRecord$1(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function isLikelySessionControlUnsupportedError(acp) {
	if (SESSION_CONTROL_UNSUPPORTED_ACP_CODES.has(acp.code)) return true;
	if (acp.code !== -32603) return false;
	const details = asRecord$1(acp.data)?.details;
	return typeof details === "string" && details.toLowerCase().includes("invalid params");
}
function formatSessionControlAcpSummary(acp) {
	const details = asRecord$1(acp.data)?.details;
	if (typeof details === "string" && details.trim().length > 0) return `${details.trim()} (ACP ${acp.code}, adapter reported "${acp.message}")`;
	return `${acp.message} (ACP ${acp.code})`;
}
function maybeWrapSessionControlError(method, error, context) {
	const acp = extractAcpError(error);
	if (!acp || !isLikelySessionControlUnsupportedError(acp)) return error;
	const acpSummary = formatSessionControlAcpSummary(acp);
	const message = `Agent rejected ${method}${context ? ` ${context}` : ""}: ${acpSummary}. The adapter may not implement ${method}, or the requested value is not supported.`;
	const wrapped = new Error(message, { cause: error instanceof Error ? error : void 0 });
	wrapped.acp = acp;
	return wrapped;
}
const DEFAULT_TERMINAL_OUTPUT_LIMIT_BYTES = 64 * 1024;
const DEFAULT_KILL_GRACE_MS = 1500;
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function toCommandLine(command, args) {
	const renderedArgs = (args ?? []).map((arg) => JSON.stringify(arg)).join(" ");
	return renderedArgs.length > 0 ? `${command} ${renderedArgs}` : command;
}
function toEnvObject(env) {
	if (!env || env.length === 0) return;
	const merged = { ...process.env };
	for (const entry of env) merged[entry.name] = entry.value;
	return merged;
}
function buildTerminalSpawnOptions(command, cwd, env, platform = process.platform) {
	const resolvedEnv = toEnvObject(env);
	return buildSpawnCommandOptions(command, {
		cwd,
		env: resolvedEnv,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		windowsHide: true
	}, platform, resolvedEnv ?? process.env);
}
function trimToUtf8Boundary(buffer, limit) {
	if (limit <= 0) return Buffer.alloc(0);
	if (buffer.length <= limit) return buffer;
	let start = buffer.length - limit;
	while (start < buffer.length && (buffer[start] & 192) === 128) start += 1;
	if (start >= buffer.length) start = buffer.length - limit;
	return buffer.subarray(start);
}
function waitForSpawn(process) {
	return new Promise((resolve, reject) => {
		const onSpawn = () => {
			process.off("error", onError);
			resolve();
		};
		const onError = (error) => {
			process.off("spawn", onSpawn);
			reject(error);
		};
		process.once("spawn", onSpawn);
		process.once("error", onError);
	});
}
async function defaultConfirmExecute(commandLine) {
	return await promptForPermission({ prompt: `\n[permission] Allow terminal command "${commandLine}"? (y/N) ` });
}
function canPromptForPermission() {
	return process.stdin.isTTY && process.stderr.isTTY;
}
function waitMs(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, Math.max(0, ms));
	});
}
var TerminalManager = class {
	cwd;
	permissionMode;
	nonInteractivePermissions;
	onOperation;
	usesDefaultConfirmExecute;
	confirmExecute;
	killGraceMs;
	processHelperTimeoutMs;
	terminals = /* @__PURE__ */ new Map();
	constructor(options) {
		this.cwd = options.cwd;
		this.permissionMode = options.permissionMode;
		this.nonInteractivePermissions = options.nonInteractivePermissions ?? "deny";
		this.onOperation = options.onOperation;
		this.usesDefaultConfirmExecute = options.confirmExecute == null;
		this.confirmExecute = options.confirmExecute ?? defaultConfirmExecute;
		this.killGraceMs = Math.max(0, Math.round(options.killGraceMs ?? DEFAULT_KILL_GRACE_MS));
		this.processHelperTimeoutMs = Math.max(1, Math.round(options.processHelperTimeoutMs ?? 8e3));
	}
	updatePermissionPolicy(permissionMode, nonInteractivePermissions) {
		this.permissionMode = permissionMode;
		this.nonInteractivePermissions = nonInteractivePermissions ?? "deny";
	}
	async createTerminal(params) {
		const commandLine = toCommandLine(params.command, params.args);
		const summary = `terminal/create: ${commandLine}`;
		this.emitOperation({
			method: "terminal/create",
			status: "running",
			summary,
			timestamp: nowIso()
		});
		try {
			if (!await this.isExecuteApproved(commandLine)) throw new PermissionDeniedError("Permission denied for terminal/create");
			const outputByteLimit = Math.max(0, Math.round(params.outputByteLimit ?? DEFAULT_TERMINAL_OUTPUT_LIMIT_BYTES));
			const { proc, spawnCommand } = await spawnTerminalProcess(params, this.cwd);
			let resolveExit = () => {};
			const exitPromise = new Promise((resolve) => {
				resolveExit = resolve;
			});
			const terminal = {
				process: proc,
				killProcessGroup: spawnCommand.killProcessGroup,
				descendantPids: /* @__PURE__ */ new Set(),
				processHelperTimeoutMs: this.processHelperTimeoutMs,
				output: Buffer.alloc(0),
				truncated: false,
				outputByteLimit,
				exitCode: void 0,
				signal: void 0,
				exitPromise,
				resolveExit
			};
			const appendOutput = (chunk) => {
				const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				if (bytes.length === 0) return;
				terminal.output = Buffer.concat([terminal.output, bytes]);
				if (terminal.output.length > terminal.outputByteLimit) {
					terminal.output = trimToUtf8Boundary(terminal.output, terminal.outputByteLimit);
					terminal.truncated = true;
				}
			};
			proc.stdout.on("data", appendOutput);
			proc.stderr.on("data", appendOutput);
			proc.once("exit", (exitCode, signal) => {
				terminal.exitCode = exitCode;
				terminal.signal = signal;
				terminal.processGroupSnapshotPromise = rememberProcessGroupPids(terminal);
				(async () => {
					await terminal.processGroupSnapshotPromise;
					terminal.resolveExit({
						exitCode: exitCode ?? null,
						signal: signal ?? null
					});
				})();
			});
			const terminalId = randomUUID();
			this.terminals.set(terminalId, terminal);
			this.emitOperation({
				method: "terminal/create",
				status: "completed",
				summary,
				details: `terminalId=${terminalId}`,
				timestamp: nowIso()
			});
			return { terminalId };
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.emitOperation({
				method: "terminal/create",
				status: "failed",
				summary,
				details: message,
				timestamp: nowIso()
			});
			throw error;
		}
	}
	async terminalOutput(params) {
		const terminal = this.getTerminal(params.terminalId);
		if (!terminal) throw new Error(`Unknown terminal: ${params.terminalId}`);
		const hasExitStatus = terminal.exitCode !== void 0 || terminal.signal !== void 0;
		this.emitOperation({
			method: "terminal/output",
			status: "completed",
			summary: `terminal/output: ${params.terminalId}`,
			timestamp: nowIso()
		});
		return {
			output: terminal.output.toString("utf8"),
			truncated: terminal.truncated,
			exitStatus: hasExitStatus ? {
				exitCode: terminal.exitCode ?? null,
				signal: terminal.signal ?? null
			} : void 0
		};
	}
	async waitForTerminalExit(params) {
		const terminal = this.getTerminal(params.terminalId);
		if (!terminal) throw new Error(`Unknown terminal: ${params.terminalId}`);
		const response = await terminal.exitPromise;
		this.emitOperation({
			method: "terminal/wait_for_exit",
			status: "completed",
			summary: `terminal/wait_for_exit: ${params.terminalId}`,
			details: `exitCode=${response.exitCode ?? "null"}, signal=${response.signal ?? "null"}`,
			timestamp: nowIso()
		});
		return response;
	}
	async killTerminal(params) {
		const terminal = this.getTerminal(params.terminalId);
		if (!terminal) throw new Error(`Unknown terminal: ${params.terminalId}`);
		const summary = `terminal/kill: ${params.terminalId}`;
		this.emitOperation({
			method: "terminal/kill",
			status: "running",
			summary,
			timestamp: nowIso()
		});
		try {
			await this.killProcess(terminal);
			this.emitOperation({
				method: "terminal/kill",
				status: "completed",
				summary,
				timestamp: nowIso()
			});
			return {};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.emitOperation({
				method: "terminal/kill",
				status: "failed",
				summary,
				details: message,
				timestamp: nowIso()
			});
			throw error;
		}
	}
	async releaseTerminal(params) {
		const summary = `terminal/release: ${params.terminalId}`;
		this.emitOperation({
			method: "terminal/release",
			status: "running",
			summary,
			timestamp: nowIso()
		});
		const terminal = this.getTerminal(params.terminalId);
		if (!terminal) {
			this.emitOperation({
				method: "terminal/release",
				status: "completed",
				summary,
				details: "already released",
				timestamp: nowIso()
			});
			return {};
		}
		try {
			await this.killProcess(terminal);
			await terminal.exitPromise.catch(() => {});
			terminal.output = Buffer.alloc(0);
			this.terminals.delete(params.terminalId);
			this.emitOperation({
				method: "terminal/release",
				status: "completed",
				summary,
				timestamp: nowIso()
			});
			return {};
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.emitOperation({
				method: "terminal/release",
				status: "failed",
				summary,
				details: message,
				timestamp: nowIso()
			});
			throw error;
		}
	}
	async shutdown() {
		for (const terminalId of Array.from(this.terminals.keys())) await this.releaseTerminal({
			terminalId,
			sessionId: "shutdown"
		});
	}
	getTerminal(terminalId) {
		return this.terminals.get(terminalId);
	}
	emitOperation(operation) {
		this.onOperation?.(operation);
	}
	async isExecuteApproved(commandLine) {
		if (this.permissionMode === "approve-all") return true;
		if (this.permissionMode === "deny-all") return false;
		if (this.usesDefaultConfirmExecute && this.nonInteractivePermissions === "fail" && !canPromptForPermission()) throw new PermissionPromptUnavailableError();
		return await this.confirmExecute(commandLine);
	}
	isRunning(terminal) {
		return terminal.exitCode === void 0 && terminal.signal === void 0;
	}
	async killProcess(terminal) {
		if (!this.isRunning(terminal) && !terminal.killProcessGroup) return;
		try {
			await this.signalProcess(terminal, "SIGTERM");
		} catch {
			return;
		}
		if (await this.waitForCleanupAfterSignal(terminal) && !terminal.killProcessGroup) return;
		try {
			await this.signalProcess(terminal, "SIGKILL");
		} catch {
			return;
		}
		await this.waitForCleanupAfterSignal(terminal);
	}
	async signalProcess(terminal, signal) {
		const pid = terminal.process.pid;
		if (terminal.killProcessGroup && pid && process.platform === "win32") {
			await this.signalWindowsProcessGroup(terminal, pid, signal);
			return;
		}
		if (terminal.killProcessGroup && pid) {
			await this.signalPosixProcessGroup(terminal, pid, signal);
			return;
		}
		terminal.process.kill(signal);
	}
	async signalWindowsProcessGroup(terminal, pid, signal) {
		await this.captureDescendantPids(terminal, pid);
		if (this.isRunning(terminal)) {
			await killWindowsProcessTree(pid, signal);
			return;
		}
		for (const descendantPid of terminal.descendantPids) await killWindowsProcessTree(descendantPid, signal);
	}
	async signalPosixProcessGroup(terminal, pid, signal) {
		await this.captureDescendantPids(terminal, pid);
		if (hasLiveProcessGroup(pid)) {
			sendSignal(-pid, signal);
			return;
		}
		for (const descendantPid of terminal.descendantPids) sendSignal(descendantPid, signal);
	}
	async captureDescendantPids(terminal, pid) {
		if (!this.isRunning(terminal)) await terminal.processGroupSnapshotPromise?.catch(() => {});
		for (const descendantPid of await listDescendantPids(pid, terminal.processHelperTimeoutMs)) terminal.descendantPids.add(descendantPid);
	}
	async waitForCleanupAfterSignal(terminal) {
		return await Promise.race([this.waitForTerminalAndTrackedDescendants(terminal).then(() => true), waitMs(this.killGraceMs).then(() => false)]);
	}
	async waitForTerminalAndTrackedDescendants(terminal) {
		await terminal.exitPromise;
		while (hasLiveTerminalProcessGroup(terminal)) await waitMs(25);
		while (hasLivePid(terminal.descendantPids)) await waitMs(25);
	}
};
async function spawnTerminalProcess(params, defaultCwd) {
	const directCommand = buildTerminalSpawnCommand(params.command, params.args);
	try {
		return {
			proc: await spawnAndWait(directCommand, params, defaultCwd),
			spawnCommand: directCommand
		};
	} catch (error) {
		const fallbackCommand = params.args === void 0 && isNotFoundSpawnError(error) ? buildTerminalFallbackSpawnCommand(params.command, params.cwd ?? defaultCwd) : void 0;
		if (!fallbackCommand) throw error;
		return {
			proc: await spawnAndWait(fallbackCommand, params, defaultCwd),
			spawnCommand: fallbackCommand
		};
	}
}
async function spawnAndWait(spawnCommand, params, defaultCwd) {
	const spawnOptions = buildTerminalSpawnOptions(spawnCommand.command, params.cwd ?? defaultCwd, params.env);
	if (spawnCommand.killProcessGroup) spawnOptions.detached = true;
	const proc = spawn(spawnCommand.command, spawnCommand.args, spawnOptions);
	await waitForSpawn(proc);
	return proc;
}
function isNotFoundSpawnError(error) {
	return error instanceof Error && error.code === "ENOENT";
}
function buildTerminalFallbackSpawnCommand(command, cwd, platform = process.platform) {
	if (commandPathExists(command, cwd)) return;
	if (platform === "win32") return hasWindowsShellSyntax(command) || /\s/u.test(command) ? buildTerminalShellSpawnCommand(command, platform) : void 0;
	if (hasShellSyntax(command) || /\s/u.test(command)) return buildTerminalShellSpawnCommand(command, platform);
}
function hasShellSyntax(command) {
	return /[|&;<>()>$`*?[\]{}'"\\\r\n]/u.test(command);
}
function hasWindowsShellSyntax(command) {
	return /[|&;<>()>$`*?[\]{}'"\r\n]/u.test(command);
}
function commandPathExists(command, cwd) {
	if (!/[\\/]/u.test(command)) return false;
	const resolvedPath = path.isAbsolute(command) ? command : path.resolve(cwd, command);
	return fs.existsSync(resolvedPath);
}
async function listDescendantPids(rootPid, timeoutMs) {
	let output;
	try {
		output = await runProcessListCommand(timeoutMs);
	} catch {
		return [];
	}
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const line of output.split("\n")) addProcessListLine(childrenByParent, line);
	const descendants = [];
	const queue = [...childrenByParent.get(rootPid) ?? []];
	for (let index = 0; index < queue.length; index += 1) {
		const pid = queue[index];
		descendants.push(pid);
		queue.push(...childrenByParent.get(pid) ?? []);
	}
	return descendants;
}
function addProcessListLine(childrenByParent, line) {
	const parsed = parseProcessListLine(line);
	if (!parsed) return;
	const children = childrenByParent.get(parsed.parentPid);
	if (children) children.push(parsed.pid);
	else childrenByParent.set(parsed.parentPid, [parsed.pid]);
}
function parseProcessListLine(line) {
	const match = line.trim().match(/^(\d+)\s+(\d+)$/);
	if (!match) return;
	const pid = Number(match[1]);
	const parentPid = Number(match[2]);
	if (!Number.isInteger(pid) || !Number.isInteger(parentPid) || pid <= 0 || parentPid <= 0) return;
	return {
		pid,
		parentPid
	};
}
async function runProcessListCommand(timeoutMs) {
	if (process.platform === "win32") return await runWindowsProcessListCommand(timeoutMs);
	return await runTimedExecFile("ps", ["-eo", "pid=,ppid="], { timeoutMs });
}
async function rememberProcessGroupPids(terminal) {
	const processGroupId = terminal.process.pid;
	if (!terminal.killProcessGroup || !processGroupId) return;
	if (process.platform === "win32") {
		for (const pid of await listDescendantPids(processGroupId, terminal.processHelperTimeoutMs)) terminal.descendantPids.add(pid);
		return;
	}
	for (const pid of await listProcessGroupPids(processGroupId, terminal.processHelperTimeoutMs)) if (pid !== processGroupId) terminal.descendantPids.add(pid);
}
async function listProcessGroupPids(processGroupId, timeoutMs) {
	let output;
	try {
		output = await runProcessGroupListCommand(timeoutMs);
	} catch {
		return [];
	}
	const pids = [];
	for (const line of output.split("\n")) {
		const match = line.trim().match(/^(\d+)\s+(\d+)$/);
		if (!match) continue;
		const pid = Number(match[1]);
		const pgid = Number(match[2]);
		if (Number.isInteger(pid) && Number.isInteger(pgid) && pid > 0 && pgid === processGroupId) pids.push(pid);
	}
	return pids;
}
async function runProcessGroupListCommand(timeoutMs) {
	return await runTimedExecFile("ps", ["-eo", "pid=,pgid="], { timeoutMs });
}
async function runWindowsProcessListCommand(timeoutMs) {
	return await runTimedExecFile("powershell.exe", [
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		["Get-CimInstance Win32_Process |", "ForEach-Object { \"$($_.ProcessId) $($_.ParentProcessId)\" }"].join(" ")
	], {
		timeoutMs,
		windowsHide: true
	});
}
async function killWindowsProcessTree(pid, signal) {
	const args = [
		"/pid",
		String(pid),
		"/t"
	];
	if (signal === "SIGKILL") args.push("/f");
	await new Promise((resolve) => {
		const child = spawn("taskkill", args, {
			stdio: [
				"ignore",
				"ignore",
				"ignore"
			],
			windowsHide: true
		});
		child.once("error", () => resolve());
		child.once("close", () => resolve());
	});
}
function sendSignal(pid, signal) {
	try {
		process.kill(pid, signal);
	} catch {}
}
function hasLiveProcessGroup(processGroupId) {
	try {
		process.kill(-processGroupId, 0);
		return true;
	} catch {
		return false;
	}
}
function hasLiveTerminalProcessGroup(terminal) {
	const pid = terminal.process.pid;
	return Boolean(terminal.killProcessGroup && pid && process.platform !== "win32" && hasLiveProcessGroup(pid));
}
function hasLivePid(pids) {
	for (const pid of pids) try {
		process.kill(pid, 0);
		return true;
	} catch {
		pids.delete(pid);
	}
	return false;
}
const REPLAY_IDLE_MS = 80;
const REPLAY_DRAIN_TIMEOUT_MS = 5e3;
const DRAIN_POLL_INTERVAL_MS = 20;
const AGENT_CLOSE_TERM_GRACE_MS = 1500;
const AGENT_CLOSE_KILL_GRACE_MS = 1e3;
const STARTUP_STDERR_MAX_CHARS = 8192;
const DEVIN_COMPATIBILITY_CLIENT_CAPABILITIES_META = Object.freeze({ "cognition.ai/requestDiagnostics": true });
const DEVIN_COMPATIBILITY_CLIENT_NAME = "windsurf";
const DEFAULT_DEVIN_COMPATIBILITY_CLIENT_VERSION = "1.110.1";
const ELICITATION_CANCEL_MESSAGES = {
	inactive: "elicitation owner is no longer active",
	unavailable: "elicitation handler is unavailable",
	unsupported: "elicitation mode is not supported",
	mismatchedSession: "elicitation session is not active",
	cancelled: "elicitation request was cancelled",
	requestScoped: "request-scoped elicitation has no owner"
};
function resolveClientInfo(devinAcp) {
	if (!devinAcp) return {
		name: "acpx",
		version: getAcpxVersion()
	};
	return {
		name: DEVIN_COMPATIBILITY_CLIENT_NAME,
		version: process.env.ACPX_DEVIN_WINDSURF_VERSION ?? DEFAULT_DEVIN_COMPATIBILITY_CLIENT_VERSION
	};
}
function normalizeElicitationModes(modes) {
	return [...new Set((modes ?? []).filter((mode) => mode === "form" || mode === "url"))];
}
function cancelledElicitationResponse(message) {
	return {
		action: "cancel",
		_meta: { message }
	};
}
function isKnownElicitationResponse(response) {
	if (!response || typeof response !== "object") return false;
	const action = response.action;
	return action === "accept" || action === "decline" || action === "cancel";
}
function elicitationSessionId(request) {
	const value = request.sessionId;
	return typeof value === "string" ? value : void 0;
}
function elicitationRequestScopeId(request) {
	const value = request.requestId;
	return value === null || typeof value === "string" || typeof value === "number" ? value : void 0;
}
function waitForAbort(signal) {
	if (signal.aborted) return Promise.resolve({ kind: "aborted" });
	return new Promise((resolve) => {
		signal.addEventListener("abort", () => resolve({ kind: "aborted" }), { once: true });
	});
}
function isExtensionNotification(message) {
	if (!("method" in message) || "id" in message || typeof message.method !== "string") return false;
	return message.method !== methods.client.session.update && message.method !== methods.client.elicitation.complete && message.method !== methods.protocol.cancelRequest;
}
function elicitationRequestId(message) {
	if (!("method" in message) || message.method !== methods.client.elicitation.create || !("id" in message)) return;
	return message.id;
}
function responseId(message) {
	if (!("id" in message) || "method" in message) return;
	return message.id;
}
function promptRequestOwner(message) {
	if (!("method" in message) || message.method !== methods.agent.session.prompt || !("id" in message)) return;
	const sessionId = message.params?.sessionId;
	return typeof sessionId === "string" ? {
		requestId: message.id,
		sessionId
	} : void 0;
}
function createAgentConnectionFacade(connection) {
	const agent = connection.agent;
	return {
		signal: connection.signal,
		close: (error) => connection.close(error),
		initialize: async (params) => await agent.request(methods.agent.initialize, params),
		authenticate: async (params) => {
			await agent.request(methods.agent.authenticate, params);
		},
		newSession: async (params) => await agent.request(methods.agent.session.new, params),
		loadSession: async (params) => await agent.request(methods.agent.session.load, params),
		resumeSession: async (params) => await agent.request(methods.agent.session.resume, params),
		prompt: async (params) => await agent.request(methods.agent.session.prompt, params),
		setSessionMode: async (params) => await agent.request(methods.agent.session.setMode, params),
		setSessionConfigOption: async (params) => await agent.request(methods.agent.session.setConfigOption, params),
		extMethod: async (method, params) => await agent.request(method, params),
		cancel: async (params) => await agent.notify(methods.agent.session.cancel, params),
		closeSession: async (params) => {
			await agent.request(methods.agent.session.close, params);
		},
		listSessions: async (params) => await agent.request(methods.agent.session.list, params)
	};
}
function resolveClientCapabilities(params) {
	const baseCapabilities = {
		fs: {
			readTextFile: params.fs,
			writeTextFile: params.fs
		},
		terminal: params.terminal,
		...params.elicitationModes.length > 0 ? { elicitation: {
			...params.elicitationModes.includes("form") ? { form: {} } : {},
			...params.elicitationModes.includes("url") ? { url: {} } : {}
		} } : {}
	};
	if (!params.devinAcp) return baseCapabilities;
	return {
		...baseCapabilities,
		_meta: DEVIN_COMPATIBILITY_CLIENT_CAPABILITIES_META
	};
}
function hasResponseField(response, field) {
	return !!response && typeof response === "object" && field in response;
}
function normalizeResponseConfigOptions(response) {
	if (!response || !("configOptions" in response)) return;
	return response.configOptions ?? [];
}
function toReconnectedSessionResult(response) {
	const configOptions = normalizeResponseConfigOptions(response);
	return {
		agentSessionId: extractRuntimeSessionId(response?._meta),
		configOptions,
		models: modelStateFromSessionResponse({
			configOptions,
			response
		}),
		configOptionsPresent: hasResponseField(response, "configOptions"),
		legacyModelMetadataPresent: hasResponseField(response, "models")
	};
}
function snapshotPermissionPolicy(policy) {
	if (!policy) return;
	return {
		...policy.autoApprove ? { autoApprove: [...policy.autoApprove] } : {},
		...policy.autoDeny ? { autoDeny: [...policy.autoDeny] } : {},
		...policy.escalate ? { escalate: [...policy.escalate] } : {},
		...policy.defaultAction ? { defaultAction: policy.defaultAction } : {}
	};
}
function childProcessIsRunning(agent) {
	if (!agent) return false;
	return agent.exitCode == null && agent.signalCode == null && !agent.killed;
}
function cancelledPermissionResponse() {
	return { outcome: { outcome: "cancelled" } };
}
function shouldSuppressSdkConsoleError(args) {
	if (args.length === 0) return false;
	return typeof args[0] === "string" && args[0] === "Error handling request";
}
function installSdkConsoleErrorSuppression() {
	const originalConsoleError = console.error;
	console.error = (...args) => {
		if (shouldSuppressSdkConsoleError(args)) return;
		originalConsoleError(...args);
	};
	return () => {
		console.error = originalConsoleError;
	};
}
function enqueueNdJsonLine(agentCommand, line, controller) {
	const trimmedLine = line.trim();
	if (!trimmedLine || shouldIgnoreNonJsonAgentOutputLine(agentCommand, trimmedLine)) return;
	try {
		const message = parseAcpJsonMessageLine(trimmedLine);
		if (message) controller.enqueue(message);
	} catch (err) {
		console.error("Failed to parse JSON message:", trimmedLine, err);
	}
}
function parseAcpJsonMessageLine(line) {
	const message = JSON.parse(line);
	return isAcpMessageObject(message) ? message : void 0;
}
function enqueueNdJsonLines(agentCommand, lines, controller) {
	for (const line of lines) enqueueNdJsonLine(agentCommand, line, controller);
}
function createNdJsonMessageStream(agentCommand, output, input) {
	const textEncoder = new TextEncoder();
	const textDecoder = new TextDecoder();
	return {
		readable: new ReadableStream({ async start(controller) {
			let content = "";
			const reader = input.getReader();
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					if (!value) continue;
					content += textDecoder.decode(value, { stream: true });
					const lines = content.split("\n");
					content = lines.pop() || "";
					enqueueNdJsonLines(agentCommand, lines, controller);
				}
			} finally {
				reader.releaseLock();
				controller.close();
			}
		} }),
		writable: new WritableStream({ async write(message) {
			const content = JSON.stringify(message) + "\n";
			const writer = output.getWriter();
			try {
				await writer.write(textEncoder.encode(content));
			} finally {
				writer.releaseLock();
			}
		} })
	};
}
var AcpClient = class {
	options;
	connection;
	agent;
	initResult;
	loadedSessionId;
	eventHandlers;
	permissionStats = {
		requested: 0,
		approved: 0,
		denied: 0,
		cancelled: 0
	};
	filesystem;
	terminalManager;
	sessionUpdateChain = Promise.resolve();
	observedSessionUpdates = 0;
	processedSessionUpdates = 0;
	suppressSessionUpdates = false;
	suppressReplaySessionUpdateMessages = false;
	activePrompt;
	pendingPromptOwners = [];
	cancellingSessionIds = /* @__PURE__ */ new Set();
	permissionAbortControllers = /* @__PURE__ */ new Map();
	closing = false;
	agentStartedAt;
	lastAgentExit;
	lastKnownPid;
	promptPermissionFailures = /* @__PURE__ */ new Map();
	pendingConnectionRequests = /* @__PURE__ */ new Set();
	modelConfigIds = /* @__PURE__ */ new Map();
	legacyModelSessionIds = /* @__PURE__ */ new Set();
	constructor(options) {
		this.options = {
			...options,
			cwd: asAbsoluteCwd(options.cwd),
			authPolicy: options.authPolicy ?? "skip",
			permissionPolicy: snapshotPermissionPolicy(options.permissionPolicy),
			elicitationModes: normalizeElicitationModes(options.elicitationModes)
		};
		this.eventHandlers = {
			onAcpMessage: this.options.onAcpMessage,
			onAcpOutputMessage: this.options.onAcpOutputMessage,
			onSessionUpdate: this.options.onSessionUpdate,
			onClientOperation: this.options.onClientOperation,
			onPermissionEscalation: this.options.onPermissionEscalation
		};
		this.filesystem = new FileSystemHandlers({
			cwd: this.options.cwd,
			permissionMode: this.options.permissionMode,
			nonInteractivePermissions: this.options.nonInteractivePermissions,
			onOperation: (operation) => {
				this.eventHandlers.onClientOperation?.(operation);
			}
		});
		this.terminalManager = new TerminalManager({
			cwd: this.options.cwd,
			permissionMode: this.options.permissionMode,
			nonInteractivePermissions: this.options.nonInteractivePermissions,
			onOperation: (operation) => {
				this.eventHandlers.onClientOperation?.(operation);
			}
		});
	}
	get initializeResult() {
		return this.initResult;
	}
	getAgentPid() {
		return this.agent?.pid ?? this.lastKnownPid;
	}
	getPermissionStats() {
		return { ...this.permissionStats };
	}
	getAgentLifecycleSnapshot() {
		const pid = this.agent?.pid ?? this.lastKnownPid;
		const running = childProcessIsRunning(this.agent);
		return {
			pid,
			startedAt: this.agentStartedAt,
			running,
			lastExit: this.lastAgentExit ? { ...this.lastAgentExit } : void 0
		};
	}
	supportsLoadSession() {
		return Boolean(this.initResult?.agentCapabilities?.loadSession);
	}
	supportsResumeSession() {
		return Boolean(this.initResult?.agentCapabilities?.sessionCapabilities?.resume);
	}
	supportsCloseSession() {
		return Boolean(this.initResult?.agentCapabilities?.sessionCapabilities?.close);
	}
	supportsListSessions() {
		return Boolean(this.initResult?.agentCapabilities?.sessionCapabilities?.list);
	}
	setEventHandlers(handlers) {
		this.eventHandlers = { ...handlers };
	}
	clearEventHandlers() {
		this.eventHandlers = {};
	}
	updateRuntimeOptions(options) {
		const shouldRefreshPermissionPolicy = options.permissionMode !== void 0 || options.nonInteractivePermissions !== void 0;
		if (options.permissionMode) this.options.permissionMode = options.permissionMode;
		if (options.nonInteractivePermissions !== void 0) this.options.nonInteractivePermissions = options.nonInteractivePermissions;
		if (Object.prototype.hasOwnProperty.call(options, "permissionPolicy")) this.options.permissionPolicy = snapshotPermissionPolicy(options.permissionPolicy);
		this.updateClientCapabilityPreferences(options);
		this.refreshRuntimePermissionPolicy(shouldRefreshPermissionPolicy);
		if (options.suppressSdkConsoleErrors !== void 0) this.options.suppressSdkConsoleErrors = options.suppressSdkConsoleErrors;
		if (options.verbose !== void 0) this.options.verbose = options.verbose;
	}
	updateClientCapabilityPreferences(options) {
		if (options.fs !== void 0) this.options.fs = options.fs;
		if (options.terminal !== void 0) this.options.terminal = options.terminal;
	}
	refreshRuntimePermissionPolicy(enabled) {
		if (!enabled) return;
		this.filesystem.updatePermissionPolicy(this.options.permissionMode, this.options.nonInteractivePermissions);
		this.terminalManager.updatePermissionPolicy(this.options.permissionMode, this.options.nonInteractivePermissions);
	}
	hasReusableSession(sessionId) {
		return this.connection != null && this.agent != null && isChildProcessRunning(this.agent) && this.loadedSessionId === sessionId;
	}
	hasActivePrompt(sessionId) {
		if (!this.activePrompt) return false;
		if (sessionId == null) return true;
		return this.activePrompt.sessionId === sessionId;
	}
	hasUnresolvedPrompt() {
		return this.activePrompt !== void 0;
	}
	endPromptElicitation(sessionId) {
		const active = this.activePrompt;
		if (!active || active.sessionId !== sessionId) return;
		active.elicitationHandler = void 0;
		active.elicitationController.abort();
	}
	async start() {
		if (this.connection && this.agent && isChildProcessRunning(this.agent)) return;
		if (this.connection || this.agent) await this.close();
		const launch = await this.resolveAgentLaunchPlan();
		this.logAgentLaunch(launch);
		await this.ensureLaunchSupport(launch);
		const child = await this.spawnAgentProcess(launch);
		this.closing = false;
		this.agentStartedAt = isoNow$1();
		this.lastAgentExit = void 0;
		this.lastKnownPid = child.pid ?? void 0;
		this.attachAgentLifecycleObservers(child);
		const startupStderr = [];
		child.stderr.on("data", (chunk) => {
			this.captureStartupStderr(startupStderr, chunk);
			if (!this.options.verbose) return;
			process.stderr.write(chunk);
		});
		const input = Writable.toWeb(child.stdin);
		const output = Readable.toWeb(child.stdout);
		const stream = this.createTappedStream(createNdJsonMessageStream(this.options.agentCommand, input, output));
		const connection = this.createConnection(stream, launch);
		connection.signal.addEventListener("abort", () => {
			this.recordAgentExit("connection_close", child.exitCode ?? null, child.signalCode ?? null);
		}, { once: true });
		const startupFailure = this.createStartupFailureWatcher(child, startupStderr);
		await this.initializeAgentConnection({
			child,
			connection,
			startupFailure,
			startupStderr,
			launch
		});
	}
	async resolveAgentLaunchPlan() {
		const configuredCommand = resolveAgentCommandParts(this.options.agentCommand, this.options.agentArgv);
		const resolvedBuiltInLaunch = resolveBuiltInAgentLaunch(this.options.agentCommand);
		const spawnCommand = resolvedBuiltInLaunch?.command ?? configuredCommand.command;
		let args = resolvedBuiltInLaunch?.args ?? configuredCommand.args;
		args = await resolveGeminiCommandArgs(spawnCommand, args);
		if (isQoderAcpCommand(spawnCommand, args)) args = buildQoderAcpCommandArgs(args, this.options);
		return {
			spawnCommand,
			args,
			resolvedBuiltInLaunch,
			devinAcp: isDevinAcpCommand(spawnCommand, args),
			geminiAcp: isGeminiAcpCommand(spawnCommand, args),
			copilotAcp: isCopilotAcpCommand(spawnCommand, args),
			claudeAcp: isClaudeAcpCommand$1(spawnCommand, args),
			spawnOptions: buildAgentSpawnOptions(this.options.cwd, this.options.authCredentials, this.options.sessionOptions?.env)
		};
	}
	logAgentLaunch(plan) {
		const launch = plan.resolvedBuiltInLaunch;
		if (launch?.source === "installed") {
			this.log(`spawning installed built-in agent ${launch.packageName}${launch.packageVersion ? `@${launch.packageVersion}` : ""} via ${plan.spawnCommand} ${plan.args.join(" ")}`);
			return;
		}
		if (launch?.source === "package-exec") {
			this.log(`spawning built-in agent ${launch.packageName}@${launch.packageRange} via current Node package exec bridge ${plan.spawnCommand} ${plan.args.join(" ")}`);
			return;
		}
		this.log(`spawning agent: ${plan.spawnCommand} ${plan.args.join(" ")}`);
	}
	async ensureLaunchSupport(plan) {
		if (plan.copilotAcp) await ensureCopilotAcpSupport(plan.spawnCommand);
		if (!plan.claudeAcp) return;
		const claudeExe = resolveClaudeCodeExecutable(process.platform, plan.spawnOptions.env);
		if (claudeExe) {
			plan.spawnOptions.env.CLAUDE_CODE_EXECUTABLE = claudeExe;
			this.log(`resolved system Claude Code executable: ${claudeExe}`);
		}
	}
	async spawnAgentProcess(plan) {
		const spawnCommand = buildAgentSpawnCommand(plan.spawnCommand, plan.args, process.platform, plan.spawnOptions.env);
		const spawnedChild = spawn(spawnCommand.command, spawnCommand.args, {
			...plan.spawnOptions,
			windowsVerbatimArguments: spawnCommand.windowsVerbatimArguments
		});
		try {
			await waitForSpawn$1(spawnedChild);
		} catch (error) {
			throw new AgentSpawnError(this.options.agentCommand, error);
		}
		return requireAgentStdio(spawnedChild);
	}
	createConnection(stream, launch) {
		const app = client({ name: "acpx" }).onNotification(methods.client.session.update, async ({ params }) => {
			await this.handleSessionUpdate(params);
		}).onNotification(methods.client.elicitation.complete, async () => {}).onRequest(methods.client.session.requestPermission, async ({ params }) => {
			return await this.handlePermissionRequest(params);
		}).onRequest(methods.client.elicitation.create, async ({ params, requestId, signal }) => {
			return await this.handleElicitationRequest(params, requestId, signal);
		}).onRequest(methods.client.fs.readTextFile, async ({ params }) => {
			return await this.handleReadTextFile(params);
		}).onRequest(methods.client.fs.writeTextFile, async ({ params }) => {
			return await this.handleWriteTextFile(params);
		}).onRequest(methods.client.terminal.create, async ({ params }) => {
			return await this.handleCreateTerminal(params);
		}).onRequest(methods.client.terminal.output, async ({ params }) => {
			return await this.handleTerminalOutput(params);
		}).onRequest(methods.client.terminal.waitForExit, async ({ params }) => {
			return await this.handleWaitForTerminalExit(params);
		}).onRequest(methods.client.terminal.kill, async ({ params }) => {
			return await this.handleKillTerminal(params);
		}).onRequest(methods.client.terminal.release, async ({ params }) => {
			return await this.handleReleaseTerminal(params);
		});
		if (launch.devinAcp) app.onRequest("_cognition.ai/request_diagnostics", (params) => {
			return params && typeof params === "object" && !Array.isArray(params) ? params : {};
		}, async () => ({}));
		return createAgentConnectionFacade(app.connect(stream));
	}
	async initializeAgentConnection(params) {
		try {
			const initResult = await Promise.race([this.initializeProtocolConnection(params.connection, params.launch), params.startupFailure.promise]);
			params.startupFailure.dispose();
			this.connection = params.connection;
			this.agent = params.child;
			this.initResult = initResult;
			this.log(`initialized protocol version ${initResult.protocolVersion}`);
		} catch (error) {
			params.connection.close?.(error);
			await this.handleInitializeFailure(params, error);
		}
	}
	async initializeProtocolConnection(connection, launch) {
		const initializePromise = connection.initialize({
			protocolVersion: PROTOCOL_VERSION,
			clientCapabilities: resolveClientCapabilities({
				devinAcp: launch.devinAcp,
				fs: this.options.fs !== false,
				terminal: this.options.terminal !== false,
				elicitationModes: this.options.elicitationModes ?? []
			}),
			clientInfo: resolveClientInfo(launch.devinAcp)
		});
		const initialized = launch.geminiAcp ? await withTimeout(initializePromise, resolveGeminiAcpStartupTimeoutMs()) : await initializePromise;
		await this.authenticateIfRequired(connection, initialized.authMethods ?? []);
		return initialized;
	}
	async handleInitializeFailure(params, error) {
		params.startupFailure.dispose();
		const normalizedError = await this.normalizeInitializeError(error, params.child, params.startupStderr);
		try {
			params.child.kill();
		} catch {}
		if (params.launch.geminiAcp && error instanceof TimeoutError) throw new GeminiAcpStartupTimeoutError(await buildGeminiAcpStartupTimeoutMessage(params.launch.spawnCommand), {
			cause: error,
			retryable: true
		});
		throw normalizedError;
	}
	createTappedStream(base) {
		const onAcpMessage = () => this.eventHandlers.onAcpMessage;
		const onAcpOutputMessage = () => this.eventHandlers.onAcpOutputMessage;
		const elicitationRequestIds = /* @__PURE__ */ new Set();
		const bindPromptOwner = (owner) => {
			this.bindPromptOwner(owner);
		};
		const shouldSuppressInboundReplaySessionUpdate = (message) => {
			return this.suppressReplaySessionUpdateMessages && isSessionUpdateNotification(message);
		};
		const observeInbound = (message) => {
			const requestId = elicitationRequestId(message);
			if (requestId !== void 0) {
				elicitationRequestIds.add(requestId);
				return;
			}
			if (!shouldSuppressInboundReplaySessionUpdate(message)) {
				onAcpOutputMessage()?.("inbound", message);
				onAcpMessage()?.("inbound", message);
			}
		};
		return {
			readable: new ReadableStream({ async start(controller) {
				const reader = base.readable.getReader();
				try {
					while (true) {
						const { value, done } = await reader.read();
						if (done) break;
						if (!value) continue;
						observeInbound(value);
						if (isExtensionNotification(value)) continue;
						controller.enqueue(value);
					}
				} finally {
					reader.releaseLock();
					controller.close();
				}
			} }),
			writable: new WritableStream({ async write(message) {
				const promptOwner = promptRequestOwner(message);
				if (promptOwner) bindPromptOwner(promptOwner);
				const id = responseId(message);
				if (!(id !== void 0 && elicitationRequestIds.delete(id))) {
					onAcpOutputMessage()?.("outbound", message);
					onAcpMessage()?.("outbound", message);
				}
				const writer = base.writable.getWriter();
				try {
					await writer.write(message);
				} finally {
					writer.releaseLock();
				}
			} })
		};
	}
	async createSession(cwd = this.options.cwd) {
		const connection = this.getConnection();
		const { command, args } = resolveAgentCommandParts(this.options.agentCommand, this.options.agentArgv);
		const claudeAcp = isClaudeAcpCommand$1(command, args);
		const sessionCwd = await resolveAgentSessionCwd(cwd, this.options.agentCommand);
		let result;
		try {
			const createPromise = this.runConnectionRequest(() => connection.newSession({
				cwd: sessionCwd,
				mcpServers: this.options.mcpServers ?? [],
				_meta: buildClaudeCodeOptionsMeta(this.options.sessionOptions, claudeAcp)
			}));
			result = claudeAcp ? await withTimeout(createPromise, resolveClaudeAcpSessionCreateTimeoutMs()) : await createPromise;
		} catch (error) {
			if (claudeAcp && error instanceof TimeoutError) throw new ClaudeAcpSessionCreateTimeoutError(buildClaudeAcpSessionCreateTimeoutMessage(), {
				cause: error,
				retryable: true
			});
			throw error;
		}
		this.loadedSessionId = result.sessionId;
		const configOptions = normalizeResponseConfigOptions(result);
		const models = modelStateFromSessionResponse({
			configOptions,
			response: result
		});
		this.rememberSessionModels(result.sessionId, models);
		return {
			sessionId: result.sessionId,
			agentSessionId: extractRuntimeSessionId(result._meta),
			configOptions,
			models,
			configOptionsPresent: hasResponseField(result, "configOptions"),
			legacyModelMetadataPresent: hasResponseField(result, "models")
		};
	}
	async loadSession(sessionId, cwd = this.options.cwd) {
		this.getConnection();
		return await this.loadSessionWithOptions(sessionId, cwd, {});
	}
	async loadSessionWithOptions(sessionId, cwd = this.options.cwd, options = {}) {
		const connection = this.getConnection();
		const sessionCwd = await resolveAgentSessionCwd(cwd, this.options.agentCommand);
		const previousSuppression = this.applySessionUpdateSuppression(Boolean(options.suppressReplayUpdates));
		let response;
		try {
			response = await this.runConnectionRequest(() => connection.loadSession({
				sessionId,
				cwd: sessionCwd,
				mcpServers: this.options.mcpServers ?? []
			}));
			await this.waitForSessionUpdateDrain(options.replayIdleMs ?? REPLAY_IDLE_MS, options.replayDrainTimeoutMs ?? REPLAY_DRAIN_TIMEOUT_MS);
		} finally {
			this.restoreSessionUpdateSuppression(previousSuppression);
		}
		this.loadedSessionId = sessionId;
		const result = toReconnectedSessionResult(response);
		this.updateRememberedSessionModels(sessionId, result);
		return result;
	}
	async resumeSession(sessionId, cwd = this.options.cwd) {
		const connection = this.getConnection();
		const sessionCwd = await resolveAgentSessionCwd(cwd, this.options.agentCommand);
		const response = await this.runConnectionRequest(() => connection.resumeSession({
			sessionId,
			cwd: sessionCwd,
			mcpServers: this.options.mcpServers ?? []
		}));
		this.loadedSessionId = sessionId;
		const result = toReconnectedSessionResult(response);
		this.updateRememberedSessionModels(sessionId, result);
		return result;
	}
	applySessionUpdateSuppression(enabled) {
		const previous = {
			suppressSessionUpdates: this.suppressSessionUpdates,
			suppressReplaySessionUpdateMessages: this.suppressReplaySessionUpdateMessages
		};
		this.suppressSessionUpdates = previous.suppressSessionUpdates || enabled;
		this.suppressReplaySessionUpdateMessages = previous.suppressReplaySessionUpdateMessages || enabled;
		return previous;
	}
	restoreSessionUpdateSuppression(previous) {
		this.suppressSessionUpdates = previous.suppressSessionUpdates;
		this.suppressReplaySessionUpdateMessages = previous.suppressReplaySessionUpdateMessages;
	}
	async prompt(sessionId, prompt, onRequestStarted, onElicitation) {
		const connection = this.getConnection();
		const normalizedPrompt = this.normalizePromptForAgent(prompt);
		const restoreConsoleError = this.options.suppressSdkConsoleErrors ? installSdkConsoleErrorSuppression() : void 0;
		const activePrompt = this.beginActivePrompt(sessionId, onElicitation);
		let promptPromise;
		try {
			promptPromise = this.runConnectionRequest(() => connection.prompt({
				sessionId,
				prompt: normalizedPrompt
			}), onRequestStarted, () => !connection.signal?.aborted);
		} catch (error) {
			this.clearActivePrompt(activePrompt);
			restoreConsoleError?.();
			throw error;
		}
		activePrompt.promise = promptPromise;
		try {
			return this.returnPromptResponseOrPermissionFailure(sessionId, await promptPromise);
		} catch (error) {
			this.throwPromptPermissionFailureIfPresent(sessionId);
			throw error;
		} finally {
			restoreConsoleError?.();
			this.clearActivePrompt(activePrompt);
			this.cancellingSessionIds.delete(sessionId);
			this.abortAndDropPermissionSignal(sessionId);
			this.promptPermissionFailures.delete(sessionId);
		}
	}
	beginActivePrompt(sessionId, elicitationHandler) {
		const previous = this.activePrompt;
		this.cancellingSessionIds.delete(sessionId);
		const active = {
			sessionId,
			elicitationHandler,
			elicitationController: new AbortController()
		};
		this.activePrompt = active;
		this.pendingPromptOwners.push(active);
		previous?.elicitationController?.abort();
		return active;
	}
	bindPromptOwner(owner) {
		const active = this.pendingPromptOwners.find((candidate) => {
			return candidate.requestId === void 0 && candidate.sessionId === owner.sessionId;
		});
		if (active) active.requestId = owner.requestId;
	}
	clearActivePrompt(active) {
		if (this.activePrompt === active) this.activePrompt = void 0;
		const pendingIndex = this.pendingPromptOwners.indexOf(active);
		if (pendingIndex >= 0) this.pendingPromptOwners.splice(pendingIndex, 1);
		active.elicitationController.abort();
	}
	normalizePromptForAgent(prompt) {
		const normalizedPrompt = typeof prompt === "string" ? textPrompt(prompt) : prompt;
		const unsupportedPromptContent = getUnsupportedPromptContentMessage(normalizedPrompt, this.initResult?.agentCapabilities);
		if (unsupportedPromptContent) throw new UnsupportedPromptContentError(unsupportedPromptContent);
		return normalizedPrompt;
	}
	returnPromptResponseOrPermissionFailure(sessionId, response) {
		this.throwPromptPermissionFailureIfPresent(sessionId);
		return response;
	}
	throwPromptPermissionFailureIfPresent(sessionId) {
		const permissionFailure = this.consumePromptPermissionFailure(sessionId);
		if (permissionFailure) throw permissionFailure;
	}
	async setSessionMode(sessionId, modeId) {
		const connection = this.getConnection();
		try {
			await this.runConnectionRequest(() => connection.setSessionMode({
				sessionId,
				modeId
			}));
		} catch (error) {
			throw maybeWrapSessionControlError("session/set_mode", error, `for mode "${modeId}"`);
		}
	}
	async setSessionConfigOption(sessionId, configId, value) {
		const connection = this.getConnection();
		try {
			return await this.runConnectionRequest(() => connection.setSessionConfigOption({
				sessionId,
				configId,
				value
			}));
		} catch (error) {
			throw maybeWrapSessionControlError("session/set_config_option", error, `for "${configId}"="${value}"`);
		}
	}
	async setSessionModel(sessionId, modelId, controlOverride) {
		const control = this.resolveModelControl(sessionId, controlOverride);
		if (!control) throw new RequestedModelUnsupportedError(`Cannot set model "${modelId}": the ACP session did not advertise a model config option or legacy session/set_model support.`, "missing-capability");
		const resolvedModelId = resolveRequestedModelId({
			requestedModel: modelId,
			models: controlOverride?.availableModels ? { availableModels: controlOverride.availableModels } : void 0,
			agentCommand: this.options.agentCommand
		});
		return control.kind === "config_option" ? await this.setSessionModelThroughConfig(sessionId, resolvedModelId, control.configId) : await this.setSessionModelThroughLegacyMethod(sessionId, resolvedModelId);
	}
	async setSessionModelThroughConfig(sessionId, modelId, configId) {
		const connection = this.getConnection();
		try {
			const response = await this.runConnectionRequest(() => connection.setSessionConfigOption({
				sessionId,
				configId,
				value: modelId
			}));
			this.rememberSessionModels(sessionId, modelStateFromConfigOptions(response.configOptions));
			return response;
		} catch (error) {
			return this.throwSessionModelError("session/set_config_option", modelId, error);
		}
	}
	async setSessionModelThroughLegacyMethod(sessionId, modelId) {
		const connection = this.getConnection();
		try {
			await this.runConnectionRequest(() => connection.extMethod("session/set_model", {
				sessionId,
				modelId
			}));
			return;
		} catch (error) {
			return this.throwSessionModelError("session/set_model", modelId, error);
		}
	}
	throwSessionModelError(method, modelId, error) {
		const wrapped = maybeWrapSessionControlError(method, error, `for model "${modelId}"`);
		if (wrapped !== error) throw wrapped;
		const acp = extractAcpError(error);
		const summary = acp ? formatSessionControlAcpSummary(acp) : error instanceof Error ? error.message : String(error);
		throw new Error(`Failed ${method} for model "${modelId}": ${summary}`, { cause: error });
	}
	resolveModelControl(sessionId, controlOverride) {
		if (controlOverride) return controlOverride.configId ? {
			kind: "config_option",
			configId: controlOverride.configId
		} : { kind: "legacy_set_model" };
		const configId = this.modelConfigIds.get(sessionId);
		if (configId) return {
			kind: "config_option",
			configId
		};
		return this.legacyModelSessionIds.has(sessionId) ? { kind: "legacy_set_model" } : void 0;
	}
	rememberSessionModels(sessionId, models) {
		if (!models) {
			this.modelConfigIds.delete(sessionId);
			this.legacyModelSessionIds.delete(sessionId);
			return;
		}
		if (models.configId) {
			this.modelConfigIds.set(sessionId, models.configId);
			this.legacyModelSessionIds.delete(sessionId);
			return;
		}
		this.modelConfigIds.delete(sessionId);
		this.legacyModelSessionIds.add(sessionId);
	}
	updateRememberedSessionModels(sessionId, result) {
		const explicitConfigRemoval = result.configOptionsPresent && this.modelConfigIds.has(sessionId);
		if (result.models || result.legacyModelMetadataPresent || explicitConfigRemoval) this.rememberSessionModels(sessionId, result.models);
	}
	async cancel(sessionId) {
		const connection = this.getConnection();
		const active = this.activePrompt;
		if (active?.sessionId === sessionId) {
			this.cancellingSessionIds.add(sessionId);
			active.elicitationController?.abort();
		} else this.cancellingSessionIds.delete(sessionId);
		this.abortAndDropPermissionSignal(sessionId);
		await this.runConnectionRequest(() => connection.cancel({ sessionId }));
	}
	async closeSession(sessionId) {
		const connection = this.getConnection();
		this.cancellingSessionIds.add(sessionId);
		if (this.activePrompt?.sessionId === sessionId) this.activePrompt.elicitationController?.abort();
		await this.runConnectionRequest(() => connection.closeSession({ sessionId }));
		if (this.loadedSessionId === sessionId) this.loadedSessionId = void 0;
		this.modelConfigIds.delete(sessionId);
		this.legacyModelSessionIds.delete(sessionId);
	}
	async listSessions(params = {}) {
		const connection = this.getConnection();
		return await this.runConnectionRequest(() => connection.listSessions(params));
	}
	async requestCancelActivePrompt() {
		const active = this.activePrompt;
		if (!active) return false;
		await this.cancel(active.sessionId);
		return true;
	}
	async cancelActivePrompt(waitMs = 2500) {
		const active = this.activePrompt;
		if (!active) return;
		try {
			await this.cancel(active.sessionId);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.log(`failed to send session/cancel: ${message}`);
		}
		if (waitMs <= 0) return;
		const activePromise = active.promise;
		if (!activePromise) return;
		let timer;
		const timeoutPromise = new Promise((resolve) => {
			timer = setTimeout(resolve, waitMs);
		});
		try {
			return await Promise.race([activePromise.then((response) => response, () => void 0), timeoutPromise]);
		} finally {
			if (timer) clearTimeout(timer);
		}
	}
	async close() {
		this.closing = true;
		this.abortActiveElicitation();
		await this.terminalManager.shutdown();
		const agent = this.agent;
		if (agent) await this.terminateAgentProcess(agent);
		this.closeConnection();
		if (this.pendingConnectionRequests.size > 0) this.rejectPendingConnectionRequests(this.lastAgentExit ? new AgentDisconnectedError(this.lastAgentExit.reason, this.lastAgentExit.exitCode, this.lastAgentExit.signal, { outputAlreadyEmitted: Boolean(this.activePrompt) }) : new AgentDisconnectedError("connection_close", null, null, { outputAlreadyEmitted: Boolean(this.activePrompt) }));
		this.sessionUpdateChain = Promise.resolve();
		this.observedSessionUpdates = 0;
		this.processedSessionUpdates = 0;
		this.suppressSessionUpdates = false;
		this.suppressReplaySessionUpdateMessages = false;
		this.activePrompt = void 0;
		this.pendingPromptOwners.length = 0;
		this.cancellingSessionIds.clear();
		for (const controller of this.permissionAbortControllers.values()) controller.abort();
		this.permissionAbortControllers.clear();
		this.promptPermissionFailures.clear();
		this.loadedSessionId = void 0;
		this.modelConfigIds.clear();
		this.legacyModelSessionIds.clear();
		this.initResult = void 0;
		this.connection = void 0;
		this.agent = void 0;
	}
	abortActiveElicitation() {
		this.activePrompt?.elicitationController?.abort();
	}
	closeConnection() {
		this.connection?.close?.();
	}
	async terminateAgentProcess(child) {
		const stdinCloseGraceMs = resolveAgentCloseAfterStdinEndMs(this.options.agentCommand);
		this.endAgentStdin(child);
		let exited = await waitForChildExit(child, stdinCloseGraceMs);
		exited = await this.killAgentIfRunning(child, exited, "SIGTERM", AGENT_CLOSE_TERM_GRACE_MS);
		if (!exited) {
			this.log(`agent did not exit after ${AGENT_CLOSE_TERM_GRACE_MS}ms; forcing SIGKILL`);
			exited = await this.killAgentIfRunning(child, exited, "SIGKILL", AGENT_CLOSE_KILL_GRACE_MS);
		}
		this.detachAgentHandles(child, !exited);
	}
	endAgentStdin(child) {
		if (child.stdin.destroyed) return;
		try {
			child.stdin.end();
		} catch {}
	}
	async killAgentIfRunning(child, alreadyExited, signal, waitMs) {
		if (alreadyExited || !isChildProcessRunning(child)) return alreadyExited;
		try {
			child.kill(signal);
		} catch {}
		return await waitForChildExit(child, waitMs);
	}
	detachAgentHandles(agent, unref) {
		const stdin = agent.stdin;
		const stdout = agent.stdout;
		const stderr = agent.stderr;
		stdin?.destroy();
		stdout?.destroy();
		stderr?.destroy();
		if (unref) try {
			agent.unref();
		} catch {}
	}
	getConnection() {
		if (!this.connection) throw new Error("ACP client not started");
		return this.connection;
	}
	log(message) {
		if (!this.options.verbose) return;
		process.stderr.write(`[acpx] ${message}\n`);
	}
	captureStartupStderr(target, chunk) {
		const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
		if (text.length === 0) return;
		target.push(text);
		if (target.join("").length - STARTUP_STDERR_MAX_CHARS <= 0) return;
		const joined = target.join("");
		target.splice(0, target.length, joined.slice(-8192));
	}
	summarizeStartupStderr(target) {
		const joined = target.join("").trim();
		if (!joined) return;
		return joined.replace(/\s+/gu, " ").trim().slice(0, STARTUP_STDERR_MAX_CHARS);
	}
	createStartupFailureWatcher(child, startupStderr) {
		let settled = false;
		let rejectPromise;
		const cleanup = () => {
			child.off("error", onError);
			child.off("exit", onExit);
			child.off("close", onClose);
		};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			if (error) rejectPromise(error);
		};
		const createError = (params) => new AgentStartupError({
			agentCommand: this.options.agentCommand,
			exitCode: params?.exitCode ?? child.exitCode ?? null,
			signal: params?.signal ?? child.signalCode ?? null,
			stderrSummary: this.summarizeStartupStderr(startupStderr),
			cause: params?.cause
		});
		const onError = (error) => {
			finish(createError({ cause: error }));
		};
		const onExit = (exitCode, signal) => {
			finish(createError({
				exitCode,
				signal
			}));
		};
		const onClose = (exitCode, signal) => {
			finish(createError({
				exitCode,
				signal
			}));
		};
		return {
			promise: new Promise((_resolve, reject) => {
				rejectPromise = reject;
				child.once("error", onError);
				child.once("exit", onExit);
				child.once("close", onClose);
			}),
			dispose: () => finish()
		};
	}
	async normalizeInitializeError(error, child, startupStderr) {
		if (error instanceof AgentStartupError) return error;
		const connectionClosedDuringInitialize = error instanceof Error && /acp connection closed/i.test(error.message);
		await waitForChildExit(child, 100);
		const childExited = child.exitCode !== null || child.signalCode !== null;
		if (!connectionClosedDuringInitialize && !childExited) return error;
		return new AgentStartupError({
			agentCommand: this.options.agentCommand,
			exitCode: child.exitCode ?? null,
			signal: child.signalCode ?? null,
			stderrSummary: this.summarizeStartupStderr(startupStderr),
			cause: error
		});
	}
	selectAuthMethod(methods) {
		for (const method of methods) {
			const envCredential = readEnvCredential(method.id);
			if (envCredential) return {
				methodId: method.id,
				credential: envCredential,
				source: "env"
			};
			const configCredential = resolveConfiguredAuthCredential(method.id, this.options.authCredentials);
			if (typeof configCredential === "string" && configCredential.trim().length > 0) return {
				methodId: method.id,
				credential: configCredential,
				source: "config"
			};
			const agentSpecificEnvCredential = this.readAgentSpecificEnvCredential(method.id);
			if (agentSpecificEnvCredential) return {
				methodId: method.id,
				credential: agentSpecificEnvCredential,
				source: "env"
			};
		}
		for (const method of methods) {
			const agentManagedSelection = this.selectAgentManagedAuthMethod(method.id);
			if (agentManagedSelection) return agentManagedSelection;
		}
	}
	readAgentSpecificEnvCredential(methodId) {
		if (!this.isGrokBuildAcpCommand() || methodId !== "xai.api_key") return;
		const value = process.env.XAI_API_KEY;
		return typeof value === "string" && value.trim().length > 0 ? value : void 0;
	}
	selectAgentManagedAuthMethod(methodId) {
		if (!this.isGrokBuildAcpCommand() || methodId !== "cached_token") return;
		return {
			methodId,
			source: "agent"
		};
	}
	isGrokBuildAcpCommand() {
		const { command, args } = resolveAgentCommandParts(this.options.agentCommand, this.options.agentArgv);
		return command.replace(/\\/g, "/").split("/").pop()?.replace(/\.(cmd|exe|ps1)$/iu, "").toLowerCase() === "grok" && args[0] === "agent" && args[1] === "stdio";
	}
	async authenticateIfRequired(connection, authMethods) {
		if (authMethods.length === 0) return;
		const selected = this.selectAuthMethod(authMethods);
		if (!selected) {
			if (this.options.authPolicy === "fail") throw new AuthPolicyError(`agent advertised auth methods [${authMethods.map((m) => m.id).join(", ")}] but no matching credentials found`);
			this.log(`agent advertised auth methods [${authMethods.map((m) => m.id).join(", ")}] but no matching credentials found — skipping (agent may handle auth internally)`);
			return;
		}
		await connection.authenticate({ methodId: selected.methodId });
		this.log(`authenticated with method ${selected.methodId} (${selected.source})`);
	}
	async handlePermissionRequest(params) {
		if (this.cancellingSessionIds.has(params.sessionId)) return cancelledPermissionResponse();
		const hostResponse = await this.tryHandlePermissionRequestWithHost(params);
		if (hostResponse) return hostResponse;
		const { response, recorded } = await this.resolvePermissionRequestFromMode(params);
		if (!recorded) {
			const decision = classifyPermissionDecision(params, response);
			this.recordPermissionDecision(decision);
		}
		return response;
	}
	async handleElicitationRequest(request, requestId, requestSignal) {
		const resolved = this.resolveElicitationOwner(request);
		if ("response" in resolved) return resolved.response;
		const { active, handler } = resolved.owner;
		const signal = AbortSignal.any([requestSignal, active.elicitationController.signal]);
		const handlerAttempt = Promise.resolve().then(async () => await handler(request, {
			requestId,
			signal
		})).then((response) => ({
			kind: "response",
			response
		}), (error) => ({
			kind: "error",
			error
		}));
		const outcome = await Promise.race([handlerAttempt, waitForAbort(signal)]);
		if (this.activePrompt !== active) return cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.inactive);
		if (outcome.kind === "aborted" || signal.aborted) return cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.cancelled);
		if (outcome.kind === "error" || !isKnownElicitationResponse(outcome.response)) return cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.unavailable);
		return outcome.response;
	}
	resolveElicitationOwner(request) {
		if (!this.options.elicitationModes?.includes(request.mode)) return { response: cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.unsupported) };
		const active = this.activePrompt;
		if (!active) return { response: cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.inactive) };
		const scope = this.resolveElicitationScope(request, active);
		if ("response" in scope) return scope;
		if (this.isElicitationSessionCancelling(scope.sessionId)) return { response: cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.cancelled) };
		if (!active.elicitationHandler) return { response: cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.unavailable) };
		return { owner: {
			active,
			handler: active.elicitationHandler
		} };
	}
	resolveElicitationScope(request, active) {
		const sessionId = elicitationSessionId(request);
		if (sessionId) return sessionId === active.sessionId ? { sessionId } : { response: cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.mismatchedSession) };
		const requestScopeId = elicitationRequestScopeId(request);
		if (requestScopeId === void 0 || requestScopeId !== active.requestId) return { response: cancelledElicitationResponse(ELICITATION_CANCEL_MESSAGES.requestScoped) };
		return { sessionId: active.sessionId };
	}
	isElicitationSessionCancelling(sessionId) {
		return this.closing || this.cancellingSessionIds.has(sessionId);
	}
	async tryHandlePermissionRequestWithHost(params) {
		if (!this.options.onPermissionRequest) return;
		const signal = this.cancellationSignalForSession(params.sessionId);
		try {
			const decision = await this.options.onPermissionRequest({
				sessionId: params.sessionId,
				raw: params,
				inferredKind: inferToolKind(params)
			}, { signal });
			return this.hostPermissionDecisionResponse(params, signal, decision);
		} catch (error) {
			return this.hostPermissionErrorResponse(params, signal, error);
		}
	}
	hostPermissionDecisionResponse(params, signal, decision) {
		if (signal.aborted || this.cancellingSessionIds.has(params.sessionId)) {
			this.recordPermissionDecision("cancelled");
			return cancelledPermissionResponse();
		}
		if (!decision) return;
		const response = decisionToResponse(params, decision);
		this.recordPermissionDecision(classifyPermissionDecision(params, response));
		return response;
	}
	hostPermissionErrorResponse(params, signal, error) {
		if (signal.aborted || this.cancellingSessionIds.has(params.sessionId)) {
			this.recordPermissionDecision("cancelled");
			return cancelledPermissionResponse();
		}
		this.log(`onPermissionRequest threw, falling through to mode-based resolver: ${error instanceof Error ? error.message : String(error)}`);
	}
	async resolvePermissionRequestFromMode(params) {
		try {
			const result = await resolvePermissionRequestWithDetails(params, this.options.permissionMode, this.options.nonInteractivePermissions ?? "deny", this.options.permissionPolicy);
			this.emitPermissionEscalation(result.escalation);
			return {
				response: result.response,
				recorded: false
			};
		} catch (error) {
			return this.handleModePermissionError(params.sessionId, error);
		}
	}
	emitPermissionEscalation(escalation) {
		if (escalation) this.eventHandlers.onPermissionEscalation?.(escalation);
	}
	handleModePermissionError(sessionId, error) {
		if (!(error instanceof PermissionPromptUnavailableError)) throw error;
		this.notePromptPermissionFailure(sessionId, error);
		this.recordPermissionDecision("cancelled");
		return {
			response: cancelledPermissionResponse(),
			recorded: true
		};
	}
	attachAgentLifecycleObservers(child) {
		child.once("exit", (exitCode, signal) => {
			this.recordAgentExit("process_exit", exitCode, signal);
		});
		child.once("close", (exitCode, signal) => {
			this.recordAgentExit("process_close", exitCode, signal);
		});
		child.stdout.once("close", () => {
			this.recordAgentExit("pipe_close", child.exitCode ?? null, child.signalCode ?? null);
		});
	}
	recordAgentExit(reason, exitCode, signal) {
		if (this.lastAgentExit) return;
		this.lastAgentExit = {
			exitCode,
			signal,
			exitedAt: isoNow$1(),
			reason,
			unexpectedDuringPrompt: !this.closing && Boolean(this.activePrompt)
		};
		this.rejectPendingConnectionRequests(new AgentDisconnectedError(reason, exitCode, signal, { outputAlreadyEmitted: Boolean(this.activePrompt) }));
	}
	notePromptPermissionFailure(sessionId, error) {
		if (!this.promptPermissionFailures.has(sessionId)) this.promptPermissionFailures.set(sessionId, error);
	}
	consumePromptPermissionFailure(sessionId) {
		const error = this.promptPermissionFailures.get(sessionId);
		if (error) this.promptPermissionFailures.delete(sessionId);
		return error;
	}
	async runConnectionRequest(run, onRequestStarted, canStartRequest = () => true) {
		return await new Promise((resolve, reject) => {
			const pending = {
				settled: false,
				reject
			};
			const finish = (cb) => {
				if (pending.settled) return;
				pending.settled = true;
				this.pendingConnectionRequests.delete(pending);
				cb();
			};
			this.pendingConnectionRequests.add(pending);
			Promise.resolve().then(async () => {
				if (pending.settled) return { started: false };
				const requestCanStart = canStartRequest();
				const request = run();
				if (requestCanStart) try {
					Promise.resolve(onRequestStarted?.()).catch(() => {});
				} catch {}
				return {
					started: true,
					value: await request
				};
			}).then((outcome) => {
				if (outcome.started) finish(() => resolve(outcome.value));
			}, (error) => finish(() => reject(error)));
		});
	}
	rejectPendingConnectionRequests(error) {
		for (const pending of this.pendingConnectionRequests) {
			if (pending.settled) {
				this.pendingConnectionRequests.delete(pending);
				continue;
			}
			pending.settled = true;
			this.pendingConnectionRequests.delete(pending);
			pending.reject(error);
		}
	}
	async handleReadTextFile(params) {
		try {
			return await this.filesystem.readTextFile(params);
		} catch (error) {
			this.recordPermissionError(params.sessionId, error);
			throw error;
		}
	}
	async handleWriteTextFile(params) {
		try {
			return await this.filesystem.writeTextFile(params);
		} catch (error) {
			this.recordPermissionError(params.sessionId, error);
			throw error;
		}
	}
	async handleCreateTerminal(params) {
		try {
			return await this.terminalManager.createTerminal(params);
		} catch (error) {
			this.recordPermissionError(params.sessionId, error);
			throw error;
		}
	}
	async handleTerminalOutput(params) {
		return await this.terminalManager.terminalOutput(params);
	}
	async handleWaitForTerminalExit(params) {
		return await this.terminalManager.waitForTerminalExit(params);
	}
	async handleKillTerminal(params) {
		return await this.terminalManager.killTerminal(params);
	}
	async handleReleaseTerminal(params) {
		return await this.terminalManager.releaseTerminal(params);
	}
	cancellationSignalForSession(sessionId) {
		let controller = this.permissionAbortControllers.get(sessionId);
		if (!controller) {
			controller = new AbortController();
			this.permissionAbortControllers.set(sessionId, controller);
		}
		return controller.signal;
	}
	abortAndDropPermissionSignal(sessionId) {
		const controller = this.permissionAbortControllers.get(sessionId);
		if (controller) {
			controller.abort();
			this.permissionAbortControllers.delete(sessionId);
		}
	}
	recordPermissionDecision(decision) {
		this.permissionStats.requested += 1;
		if (decision === "approved") {
			this.permissionStats.approved += 1;
			return;
		}
		if (decision === "denied") {
			this.permissionStats.denied += 1;
			return;
		}
		this.permissionStats.cancelled += 1;
	}
	recordPermissionError(sessionId, error) {
		if (error instanceof PermissionPromptUnavailableError) {
			this.notePromptPermissionFailure(sessionId, error);
			this.recordPermissionDecision("cancelled");
			return;
		}
		if (error instanceof PermissionDeniedError) this.recordPermissionDecision("denied");
	}
	async handleSessionUpdate(notification) {
		const sequence = ++this.observedSessionUpdates;
		this.sessionUpdateChain = this.sessionUpdateChain.then(async () => {
			try {
				if (!this.suppressSessionUpdates) this.eventHandlers.onSessionUpdate?.(notification);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				this.log(`session update handler failed: ${message}`);
			} finally {
				this.processedSessionUpdates = sequence;
			}
		});
		await this.sessionUpdateChain;
	}
	async waitForSessionUpdateDrain(idleMs, timeoutMs) {
		const normalizedIdleMs = Math.max(0, idleMs);
		const normalizedTimeoutMs = Math.max(normalizedIdleMs, timeoutMs);
		const deadline = Date.now() + normalizedTimeoutMs;
		let lastObserved = this.observedSessionUpdates;
		let idleSince = Date.now();
		while (Date.now() <= deadline) {
			const observed = this.observedSessionUpdates;
			if (observed !== lastObserved) {
				lastObserved = observed;
				idleSince = Date.now();
			}
			if (this.processedSessionUpdates === this.observedSessionUpdates && Date.now() - idleSince >= normalizedIdleMs) {
				await this.sessionUpdateChain;
				if (this.processedSessionUpdates === this.observedSessionUpdates) return;
			}
			await new Promise((resolve) => {
				setTimeout(resolve, DRAIN_POLL_INTERVAL_MS);
			});
		}
		throw new Error(`Timed out waiting for session replay drain after ${normalizedTimeoutMs}ms`);
	}
	async waitForSessionUpdatesIdle(options) {
		await this.waitForSessionUpdateDrain(options?.idleMs ?? 0, options?.timeoutMs ?? 0);
	}
};
function applyLifecycleSnapshotToRecord(record, snapshot) {
	if (!snapshot) return;
	record.pid = snapshot.running ? snapshot.pid : void 0;
	record.agentStartedAt = snapshot.startedAt;
	if (snapshot.lastExit) {
		record.lastAgentExitCode = snapshot.lastExit.exitCode;
		record.lastAgentExitSignal = snapshot.lastExit.signal;
		record.lastAgentExitAt = snapshot.lastExit.exitedAt;
		record.lastAgentDisconnectReason = snapshot.lastExit.reason;
		return;
	}
	record.lastAgentExitCode = void 0;
	record.lastAgentExitSignal = void 0;
	record.lastAgentExitAt = void 0;
	record.lastAgentDisconnectReason = void 0;
}
function reconcileAgentSessionId(record, agentSessionId) {
	const normalized = normalizeRuntimeSessionId(agentSessionId);
	if (!normalized) return;
	record.agentSessionId = normalized;
}
function sessionHasAgentMessages(recordOrConversation) {
	return recordOrConversation.messages.some((message) => typeof message === "object" && message !== null && "Agent" in message);
}
function applyConversation(record, conversation) {
	record.title = conversation.title;
	record.updated_at = conversation.updated_at;
	record.messages = conversation.messages;
	record.cumulative_token_usage = conversation.cumulative_token_usage;
	record.cumulative_cost = conversation.cumulative_cost;
	record.request_token_usage = conversation.request_token_usage;
}
function assignDefinedOption(target, key, value) {
	if (value !== void 0) target[key] = value;
}
function persistSessionOptions(record, options) {
	const next = options === void 0 ? void 0 : persistedSessionOptions(options);
	if (next !== void 0) {
		record.acpx = {
			...record.acpx,
			session_options: next
		};
		return;
	}
	if (!record.acpx) return;
	delete record.acpx.session_options;
}
function sessionOptionsFromRecord(record) {
	const stored = record.acpx?.session_options;
	if (!stored) return;
	const sessionOptions = {};
	assignStoredOption(sessionOptions, "model", nonEmptyString(stored.model));
	assignStoredOption(sessionOptions, "allowedTools", storedAllowedTools(stored.allowed_tools));
	assignStoredOption(sessionOptions, "maxTurns", storedMaxTurns(stored.max_turns));
	assignStoredOption(sessionOptions, "systemPrompt", storedSystemPromptOption(stored.system_prompt));
	assignStoredOption(sessionOptions, "env", storedEnvRecord(stored.env));
	return Object.keys(sessionOptions).length > 0 ? sessionOptions : void 0;
}
function persistedSessionOptions(options) {
	const next = {
		model: nonEmptyString(options.model),
		allowed_tools: Array.isArray(options.allowedTools) ? [...options.allowedTools] : void 0,
		max_turns: typeof options.maxTurns === "number" ? options.maxTurns : void 0,
		system_prompt: normalizeSystemPromptOption(options.systemPrompt),
		env: storedEnvRecord(options.env)
	};
	return hasPersistedSessionOptions(next) ? next : void 0;
}
function hasPersistedSessionOptions(options) {
	return options.model !== void 0 || options.allowed_tools !== void 0 || options.max_turns !== void 0 || options.system_prompt !== void 0 || options.env !== void 0;
}
function storedEnvRecord(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return;
	const entries = Object.entries(value);
	const result = {};
	for (const [key, raw] of entries) {
		if (typeof raw !== "string") continue;
		result[key] = raw;
	}
	return Object.keys(result).length > 0 ? result : void 0;
}
function normalizeSystemPromptOption(value) {
	const prompt = nonEmptyString(value);
	if (prompt !== void 0) return prompt;
	const append = appendedSystemPrompt(value);
	return append === void 0 ? void 0 : { append };
}
function appendedSystemPrompt(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return;
	return nonEmptyString(value.append);
}
function assignStoredOption(target, key, value) {
	assignDefinedOption(target, key, value);
}
function storedAllowedTools(value) {
	return Array.isArray(value) && value.every((item) => typeof item === "string") ? [...value] : void 0;
}
function storedMaxTurns(value) {
	return typeof value === "number" ? value : void 0;
}
function storedSystemPromptOption(value) {
	return normalizeSystemPromptOption(value);
}
function nonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function configOptionsAreAuthoritative(state) {
	return state.model_control === "config_option";
}
function legacyModelState(state) {
	if (!Array.isArray(state.available_models)) return;
	return {
		currentModelId: state.current_model_id ?? "",
		availableModels: state.available_models.map((modelId) => ({
			modelId,
			name: modelId
		}))
	};
}
function advertisedModelState(state) {
	if (!state) return;
	const configModels = modelStateFromConfigOptions(state?.config_options);
	if (configModels) return configModels;
	if (configOptionsAreAuthoritative(state)) return;
	return legacyModelState(state);
}
function applyAdvertisedModelState(state, models) {
	state.current_model_id = models.currentModelId;
	state.available_models = models.availableModels.map((model) => model.modelId);
	state.model_control = models.configId ? "config_option" : "legacy_set_model";
}
function clearAdvertisedModelState(state) {
	delete state.current_model_id;
	delete state.available_models;
	delete state.model_control;
}
function removeModelConfigOptions(state) {
	if (!state.config_options) return;
	state.config_options = state.config_options.filter((option) => option.category !== "model" && option.id !== "model");
}
function applyConfigOptionsModelState(state, configOptions) {
	const previousConfigModels = modelStateFromConfigOptions(state.config_options);
	const preservesLegacyControl = state.model_control === "legacy_set_model" || state.model_control === void 0 && previousConfigModels === void 0 && legacyModelState(state) !== void 0;
	state.config_options = structuredClone(configOptions);
	const models = modelStateFromConfigOptions(configOptions);
	if (models) applyAdvertisedModelState(state, models);
	else if (preservesLegacyControl) state.model_control = "legacy_set_model";
	else clearAdvertisedModelState(state);
}
const MAX_RUNTIME_MESSAGES = 200;
const MAX_RUNTIME_AGENT_TEXT_CHARS = 8e3;
const MAX_RUNTIME_THINKING_CHARS = 4e3;
const MAX_RUNTIME_TOOL_IO_CHARS = 4e3;
const MAX_RUNTIME_REQUEST_TOKEN_USAGE = 100;
function isoNow$3() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function deepClone(value) {
	try {
		return structuredClone(value);
	} catch {
		return value;
	}
}
function hasOwn(source, key) {
	return Object.prototype.hasOwnProperty.call(source, key);
}
function normalizeAgentName$2(value) {
	return trimmedString(value);
}
function trimmedString(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function normalizeAvailableCommand(value) {
	const record = asRecord(value);
	if (!record) return;
	const name = trimmedString(record.name);
	if (!name) return;
	const description = trimmedString(record.description);
	return {
		name,
		...description ? { description } : {},
		has_input: record.input != null
	};
}
function extractText(content) {
	switch (content.type) {
		case "text": return content.text;
		case "resource_link": return content.title ?? content.name ?? content.uri;
		case "resource": return extractResourceText(content);
		case "audio": return `[audio] ${content.mimeType}`;
		default: return;
	}
}
function extractResourceText(content) {
	return "text" in content.resource && typeof content.resource.text === "string" ? content.resource.text : content.resource.uri;
}
function contentToUserContent(content) {
	if (content.type === "text") return { Text: content.text };
	if (content.type === "resource_link") {
		const value = content.title ?? content.name ?? content.uri;
		return { Mention: {
			uri: content.uri,
			content: value
		} };
	}
	if (content.type === "resource") return resourceToUserContent(content);
	if (content.type === "image") return { Image: {
		source: content.data,
		size: null
	} };
	if (content.type === "audio") return { Audio: {
		source: content.data,
		mime_type: content.mimeType
	} };
}
function resourceToUserContent(content) {
	if ("text" in content.resource && typeof content.resource.text === "string") return { Text: content.resource.text };
	return { Mention: {
		uri: content.resource.uri,
		content: content.resource.uri
	} };
}
function nextUserMessageId() {
	return randomUUID();
}
function isUserMessage(message) {
	return typeof message === "object" && message !== null && hasOwn(message, "User");
}
function isAgentMessage(message) {
	return typeof message === "object" && message !== null && hasOwn(message, "Agent");
}
function isAgentTextContent(content) {
	return hasOwn(content, "Text");
}
function isAgentThinkingContent(content) {
	return hasOwn(content, "Thinking");
}
function isAgentToolUseContent(content) {
	return hasOwn(content, "ToolUse");
}
function updateConversationTimestamp(conversation, timestamp) {
	conversation.updated_at = timestamp;
}
function ensureAgentMessage(conversation) {
	const last = conversation.messages.at(-1);
	if (last && isAgentMessage(last)) return last.Agent;
	const created = {
		content: [],
		tool_results: {}
	};
	conversation.messages.push({ Agent: created });
	return created;
}
function appendAgentText(agent, text) {
	if (!text.trim()) return;
	const last = agent.content.at(-1);
	if (last && isAgentTextContent(last)) {
		last.Text = trimRuntimeText(`${last.Text}${text}`, MAX_RUNTIME_AGENT_TEXT_CHARS);
		return;
	}
	const next = { Text: text };
	agent.content.push(next);
}
function appendAgentThinking(agent, text) {
	if (!text.trim()) return;
	const last = agent.content.at(-1);
	if (last && isAgentThinkingContent(last)) {
		last.Thinking.text = trimRuntimeText(`${last.Thinking.text}${text}`, MAX_RUNTIME_THINKING_CHARS);
		return;
	}
	const next = { Thinking: {
		text,
		signature: null
	} };
	agent.content.push(next);
}
function trimRuntimeText(value, maxChars) {
	if (value.length <= maxChars) return value;
	return `${value.slice(0, Math.max(0, maxChars - 3))}...`;
}
function statusIndicatesComplete(status) {
	if (typeof status !== "string") return false;
	const normalized = status.toLowerCase();
	return normalized.includes("complete") || normalized.includes("done") || normalized.includes("success") || normalized.includes("failed") || normalized.includes("error") || normalized.includes("cancel");
}
function statusIndicatesError(status) {
	if (typeof status !== "string") return false;
	const normalized = status.toLowerCase();
	return normalized.includes("fail") || normalized.includes("error");
}
function toToolResultContent(value) {
	if (typeof value === "string") return { Text: trimRuntimeText(value, MAX_RUNTIME_TOOL_IO_CHARS) };
	if (value != null) try {
		return { Text: trimRuntimeText(JSON.stringify(value), MAX_RUNTIME_TOOL_IO_CHARS) };
	} catch {
		return { Text: "[Unserializable value]" };
	}
	return { Text: "" };
}
function toRawInput(value) {
	if (typeof value === "string") return trimRuntimeText(value, MAX_RUNTIME_TOOL_IO_CHARS);
	try {
		return trimRuntimeText(JSON.stringify(value ?? {}), MAX_RUNTIME_TOOL_IO_CHARS);
	} catch {
		return value == null ? "" : "[Unserializable input]";
	}
}
function ensureToolUseContent(agent, toolCallId) {
	for (const content of agent.content) if (isAgentToolUseContent(content) && content.ToolUse.id === toolCallId) return content.ToolUse;
	const created = {
		id: toolCallId,
		name: "tool_call",
		raw_input: "{}",
		input: {},
		is_input_complete: false,
		thought_signature: null
	};
	agent.content.push({ ToolUse: created });
	return created;
}
function upsertToolResult(agent, toolCallId, patch) {
	const existing = agent.tool_results[toolCallId];
	const fallback = existingToolResultValues(existing);
	const next = {
		tool_use_id: toolCallId,
		tool_name: patch.tool_name ?? fallback.tool_name,
		is_error: patch.is_error ?? fallback.is_error,
		content: patch.content ?? fallback.content,
		output: patch.output ?? fallback.output
	};
	agent.tool_results[toolCallId] = next;
}
function existingToolResultValues(existing) {
	if (existing) return existing;
	return {
		tool_use_id: "",
		tool_name: "tool_call",
		is_error: false,
		content: { Text: "" },
		output: void 0
	};
}
function applyToolCallUpdate(agent, update) {
	const tool = ensureToolUseContent(agent, update.toolCallId);
	applyToolIdentityUpdate(tool, update);
	applyToolInputUpdate(tool, update);
	applyToolStatusUpdate(tool, update);
	applyToolResultUpdate(agent, tool, update);
}
function applyToolIdentityUpdate(tool, update) {
	if (hasOwn(update, "title")) tool.name = normalizeAgentName$2(update.title) ?? tool.name ?? "tool_call";
	if (hasOwn(update, "kind")) {
		const kindName = normalizeAgentName$2(update.kind);
		if (!tool.name || tool.name === "tool_call") tool.name = kindName ?? tool.name;
	}
}
function applyToolInputUpdate(tool, update) {
	if (!hasOwn(update, "rawInput")) return;
	const rawInput = deepClone(update.rawInput);
	tool.input = rawInput ?? {};
	tool.raw_input = toRawInput(rawInput);
}
function applyToolStatusUpdate(tool, update) {
	if (hasOwn(update, "status")) tool.is_input_complete = statusIndicatesComplete(update.status);
}
function applyToolResultUpdate(agent, tool, update) {
	if (!hasToolResultPatch(update)) return;
	const status = update.status;
	const output = hasOwn(update, "rawOutput") ? deepClone(update.rawOutput) : void 0;
	upsertToolResult(agent, update.toolCallId, {
		tool_name: tool.name,
		is_error: statusIndicatesError(status),
		content: output === void 0 ? void 0 : toToolResultContent(output),
		output
	});
}
function hasToolResultPatch(update) {
	return [
		"rawOutput",
		"status",
		"title",
		"kind"
	].some((key) => hasOwn(update, key));
}
function asRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function numberField(source, keys) {
	for (const key of keys) {
		const value = source[key];
		if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
	}
}
function sourceToTokenUsage(source) {
	const usageRecord = asRecord(source);
	if (!usageRecord) return;
	const normalized = {
		input_tokens: numberField(usageRecord, ["input_tokens", "inputTokens"]),
		output_tokens: numberField(usageRecord, ["output_tokens", "outputTokens"]),
		cache_creation_input_tokens: numberField(usageRecord, [
			"cache_creation_input_tokens",
			"cacheCreationInputTokens",
			"cachedWriteTokens"
		]),
		cache_read_input_tokens: numberField(usageRecord, [
			"cache_read_input_tokens",
			"cacheReadInputTokens",
			"cachedReadTokens"
		]),
		thought_tokens: numberField(usageRecord, ["thought_tokens", "thoughtTokens"]),
		total_tokens: numberField(usageRecord, ["total_tokens", "totalTokens"])
	};
	if (!hasTokenUsageValue(normalized)) return;
	return normalized;
}
function usageToTokenUsage(update) {
	const updateRecord = asRecord(update);
	const usageMeta = asRecord(updateRecord?._meta)?.usage;
	const source = asRecord(usageMeta) ?? updateRecord;
	if (!source) return;
	return sourceToTokenUsage(source);
}
function hasTokenUsageValue(usage) {
	return Object.values(usage).some((value) => value !== void 0);
}
function usageCost(update) {
	const cost = asRecord(asRecord(update)?.cost);
	if (!cost) return;
	return buildUsageCost(numberField(cost, ["amount"]), stringField(cost.currency));
}
function stringField(value) {
	return typeof value === "string" && value.trim() ? value : void 0;
}
function buildUsageCost(amount, currency) {
	const cost = {
		...amount !== void 0 ? { amount } : {},
		...currency !== void 0 ? { currency } : {}
	};
	return Object.keys(cost).length > 0 ? cost : void 0;
}
function ensureAcpxState$1(state) {
	return state ?? {};
}
function lastUserMessageId(conversation) {
	for (let index = conversation.messages.length - 1; index >= 0; index -= 1) {
		const message = conversation.messages[index];
		if (message && isUserMessage(message)) return message.User.id;
	}
}
function createSessionConversation(timestamp = isoNow$3()) {
	return {
		title: null,
		messages: [],
		updated_at: timestamp,
		cumulative_token_usage: {},
		cumulative_cost: void 0,
		request_token_usage: {}
	};
}
function cloneSessionConversation(conversation) {
	if (!conversation) return createSessionConversation();
	return {
		title: conversation.title,
		messages: deepClone(conversation.messages ?? []),
		updated_at: conversation.updated_at,
		cumulative_token_usage: deepClone(conversation.cumulative_token_usage ?? {}),
		cumulative_cost: cloneUsageCost(conversation.cumulative_cost),
		request_token_usage: deepClone(conversation.request_token_usage ?? {})
	};
}
function cloneUsageCost(cost) {
	return cost ? { ...cost } : void 0;
}
function cloneSessionAcpxState(state) {
	if (!state) return;
	return {
		current_mode_id: state.current_mode_id,
		desired_mode_id: state.desired_mode_id,
		desired_config_options: state.desired_config_options ? { ...state.desired_config_options } : void 0,
		current_model_id: state.current_model_id,
		available_models: state.available_models ? [...state.available_models] : void 0,
		model_control: state.model_control,
		available_commands: state.available_commands ? state.available_commands.map((command) => ({ ...command })) : void 0,
		config_options: state.config_options ? deepClone(state.config_options) : void 0,
		session_options: cloneSessionOptions(state.session_options)
	};
}
function cloneSessionOptions(options) {
	if (!options) return;
	return {
		model: options.model,
		allowed_tools: options.allowed_tools ? [...options.allowed_tools] : void 0,
		max_turns: options.max_turns,
		...options.system_prompt !== void 0 ? { system_prompt: cloneSystemPromptOption(options.system_prompt) } : {},
		...options.env !== void 0 ? { env: { ...options.env } } : {}
	};
}
function cloneSystemPromptOption(option) {
	return typeof option === "string" ? option : { append: option.append };
}
function recordPromptSubmission(conversation, prompt, timestamp = isoNow$3()) {
	const userContent = (typeof prompt === "string" ? textPrompt(prompt) : prompt).map((content) => contentToUserContent(content)).filter((content) => content !== void 0);
	if (userContent.length === 0) return;
	const promptMessageId = nextUserMessageId();
	conversation.messages.push({ User: {
		id: promptMessageId,
		content: userContent.map((content) => {
			if ("Text" in content) return { Text: trimRuntimeText(content.Text, MAX_RUNTIME_AGENT_TEXT_CHARS) };
			return content;
		})
	} });
	updateConversationTimestamp(conversation, timestamp);
	trimConversationForRuntime(conversation);
	return promptMessageId;
}
function agentMessageHasObservedReply(message) {
	return message.content.length > 0 || Object.keys(message.tool_results).length > 0;
}
function hasAgentReplyAfterPrompt(conversation, promptMessageId) {
	let sawPrompt = false;
	for (const message of conversation.messages) {
		if (!sawPrompt) {
			if (isUserMessage(message) && message.User.id === promptMessageId) sawPrompt = true;
			continue;
		}
		if (isAgentMessage(message) && agentMessageHasObservedReply(message.Agent)) return true;
	}
	return false;
}
function recordSessionUpdate(conversation, state, notification, timestamp = isoNow$3()) {
	const acpx = ensureAcpxState$1(state);
	const update = notification.update;
	applySessionUpdate(conversation, acpx, update);
	updateConversationTimestamp(conversation, timestamp);
	trimConversationForRuntime(conversation);
	return acpx;
}
function recordPromptResponseUsage(conversation, usage, promptMessageId, timestamp = isoNow$3()) {
	const tokenUsage = sourceToTokenUsage(usage);
	if (!tokenUsage) return false;
	applyTokenUsage(conversation, tokenUsage, promptMessageId);
	updateConversationTimestamp(conversation, timestamp);
	trimConversationForRuntime(conversation);
	return true;
}
function applySessionUpdate(conversation, acpx, update) {
	const handler = SESSION_UPDATE_HANDLERS[update.sessionUpdate];
	handler?.(conversation, acpx, update);
}
const SESSION_UPDATE_HANDLERS = {
	user_message_chunk: (conversation, _acpx, update) => {
		if (update.sessionUpdate === "user_message_chunk") appendUserMessageChunk(conversation, update.content);
	},
	agent_message_chunk: (conversation, _acpx, update) => {
		if (update.sessionUpdate === "agent_message_chunk") appendAgentMessageChunk(conversation, update.content, appendAgentText);
	},
	agent_thought_chunk: (conversation, _acpx, update) => {
		if (update.sessionUpdate === "agent_thought_chunk") appendAgentMessageChunk(conversation, update.content, appendAgentThinking);
	},
	tool_call: (conversation, _acpx, update) => {
		if (update.sessionUpdate === "tool_call" || update.sessionUpdate === "tool_call_update") applyToolCallUpdate(ensureAgentMessage(conversation), update);
	},
	tool_call_update: (conversation, _acpx, update) => {
		if (update.sessionUpdate === "tool_call" || update.sessionUpdate === "tool_call_update") applyToolCallUpdate(ensureAgentMessage(conversation), update);
	},
	usage_update: (conversation, _acpx, update) => {
		if (update.sessionUpdate === "usage_update") applyUsageUpdate(conversation, update);
	},
	session_info_update: (conversation, _acpx, update) => {
		if (update.sessionUpdate === "session_info_update") applySessionInfoUpdate(conversation, update);
	},
	available_commands_update: (_conversation, acpx, update) => {
		if (update.sessionUpdate === "available_commands_update") acpx.available_commands = update.availableCommands.map((entry) => normalizeAvailableCommand(entry)).filter((entry) => entry !== void 0);
	},
	current_mode_update: (_conversation, acpx, update) => {
		if (update.sessionUpdate === "current_mode_update") acpx.current_mode_id = update.currentModeId;
	},
	config_option_update: (_conversation, acpx, update) => {
		if (update.sessionUpdate === "config_option_update") applyConfigOptionsModelState(acpx, deepClone(update.configOptions));
	}
};
function appendUserMessageChunk(conversation, content) {
	const userContent = contentToUserContent(content);
	if (!userContent) return;
	conversation.messages.push({ User: {
		id: nextUserMessageId(),
		content: [userContent]
	} });
}
function appendAgentMessageChunk(conversation, content, append) {
	const text = extractText(content);
	if (text) append(ensureAgentMessage(conversation), text);
}
function applyUsageUpdate(conversation, update) {
	const usage = usageToTokenUsage(update);
	const cost = usageCost(update);
	if (!usage && !cost) return;
	if (usage) applyTokenUsage(conversation, usage);
	if (cost) conversation.cumulative_cost = cost;
}
function applyTokenUsage(conversation, usage, promptMessageId) {
	conversation.cumulative_token_usage = usage;
	const userId = promptMessageId ?? lastUserMessageId(conversation);
	if (userId) conversation.request_token_usage[userId] = usage;
}
function applySessionInfoUpdate(conversation, update) {
	if (hasOwn(update, "title")) conversation.title = update.title ?? null;
	if (hasOwn(update, "updatedAt")) conversation.updated_at = update.updatedAt ?? conversation.updated_at;
}
function recordClientOperation(conversation, state, operation, timestamp = isoNow$3()) {
	const acpx = ensureAcpxState$1(state);
	updateConversationTimestamp(conversation, timestamp);
	trimConversationForRuntime(conversation);
	return acpx;
}
function trimConversationForRuntime(conversation) {
	if (conversation.messages.length > MAX_RUNTIME_MESSAGES) conversation.messages = conversation.messages.slice(-200);
	for (const message of conversation.messages) trimRuntimeMessage(message);
	const requestUsageEntries = Object.entries(conversation.request_token_usage);
	if (requestUsageEntries.length > MAX_RUNTIME_REQUEST_TOKEN_USAGE) conversation.request_token_usage = Object.fromEntries(requestUsageEntries.slice(-100));
}
function trimRuntimeMessage(message) {
	if (isUserMessage(message)) {
		trimRuntimeUserMessage(message.User);
		return;
	}
	if (isAgentMessage(message)) trimRuntimeAgentMessage(message.Agent);
}
function trimRuntimeUserMessage(message) {
	message.content = message.content.map((content) => {
		if ("Text" in content) return { Text: trimRuntimeText(content.Text, MAX_RUNTIME_AGENT_TEXT_CHARS) };
		return content;
	});
}
function trimRuntimeAgentMessage(message) {
	for (const content of message.content) trimRuntimeAgentContent(content);
	for (const result of Object.values(message.tool_results)) trimRuntimeToolResult(result);
}
function trimRuntimeAgentContent(content) {
	if ("Text" in content) content.Text = trimRuntimeText(content.Text, MAX_RUNTIME_AGENT_TEXT_CHARS);
	else if ("Thinking" in content) content.Thinking.text = trimRuntimeText(content.Thinking.text, MAX_RUNTIME_THINKING_CHARS);
	else if ("ToolUse" in content) content.ToolUse.raw_input = trimRuntimeText(content.ToolUse.raw_input, MAX_RUNTIME_TOOL_IO_CHARS);
}
function trimRuntimeToolResult(result) {
	if ("Text" in result.content) result.content.Text = trimRuntimeText(result.content.Text, MAX_RUNTIME_TOOL_IO_CHARS);
	if (typeof result.output === "string") result.output = trimRuntimeText(result.output, MAX_RUNTIME_TOOL_IO_CHARS);
}
function applyConfigOptionsToState(state, configOptions) {
	const acpxState = cloneSessionAcpxState(state) ?? {};
	applyConfigOptionsModelState(acpxState, configOptions);
	return acpxState;
}
function applyConfigOptionsToRecord(record, result) {
	const configOptions = result?.configOptions;
	if (!configOptions) return;
	record.acpx = applyConfigOptionsToState(record.acpx, configOptions);
}
function ensureAcpxState(state) {
	return state ?? {};
}
function normalizeModeId(modeId) {
	if (typeof modeId !== "string") return;
	const trimmed = modeId.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function normalizeModelId(modelId) {
	if (typeof modelId !== "string") return;
	const trimmed = modelId.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function getDesiredModeId(state) {
	return normalizeModeId(state?.desired_mode_id);
}
function getDesiredConfigOptions(state) {
	const desired = state?.desired_config_options;
	if (!desired) return {};
	return Object.fromEntries(Object.entries(desired).flatMap(([configId, value]) => {
		const normalizedConfigId = normalizeModeId(configId);
		return normalizedConfigId && typeof value === "string" ? [[normalizedConfigId, value]] : [];
	}));
}
function setDesiredModeId(record, modeId) {
	const acpx = ensureAcpxState(record.acpx);
	const normalized = normalizeModeId(modeId);
	if (normalized) acpx.desired_mode_id = normalized;
	else delete acpx.desired_mode_id;
	record.acpx = acpx;
}
function setDesiredConfigOption(record, configId, value) {
	const normalizedConfigId = normalizeModeId(configId);
	if (!normalizedConfigId || normalizedConfigId === "mode" || normalizedConfigId === "model") return;
	const acpx = ensureAcpxState(record.acpx);
	const desired = { ...acpx.desired_config_options };
	if (typeof value === "string") desired[normalizedConfigId] = value;
	else delete desired[normalizedConfigId];
	if (Object.keys(desired).length > 0) acpx.desired_config_options = desired;
	else delete acpx.desired_config_options;
	record.acpx = acpx;
}
function clearDesiredConfigOption(state, configId) {
	const normalizedConfigId = normalizeModeId(configId);
	if (!normalizedConfigId || !state.desired_config_options) return;
	const desired = { ...state.desired_config_options };
	delete desired[normalizedConfigId];
	if (Object.keys(desired).length > 0) state.desired_config_options = desired;
	else delete state.desired_config_options;
}
function getDesiredModelId(state) {
	return normalizeModelId(state?.session_options?.model);
}
function hasStoredSessionOptions(options) {
	return typeof options.model === "string" || Array.isArray(options.allowed_tools) || typeof options.max_turns === "number" || options.system_prompt !== void 0 || options.env !== void 0;
}
function setDesiredModelId(record, modelId, modelConfigId) {
	const acpx = ensureAcpxState(record.acpx);
	const normalized = normalizeModelId(modelId);
	const sessionOptions = { ...acpx.session_options };
	if (normalized) sessionOptions.model = normalized;
	else delete sessionOptions.model;
	if (hasStoredSessionOptions(sessionOptions)) acpx.session_options = sessionOptions;
	else delete acpx.session_options;
	clearDesiredConfigOption(acpx, modelConfigId ?? modelStateFromConfigOptions(acpx.config_options)?.configId);
	record.acpx = acpx;
}
function setCurrentModelId(record, modelId) {
	const acpx = ensureAcpxState(record.acpx);
	const normalized = normalizeModelId(modelId);
	if (normalized) acpx.current_model_id = normalized;
	else delete acpx.current_model_id;
	record.acpx = acpx;
}
function syncAdvertisedModelState(record, models) {
	if (!models) return;
	const acpx = ensureAcpxState(record.acpx);
	applyAdvertisedModelState(acpx, models);
	record.acpx = acpx;
}
function currentModelIdFromSetModelResponse(response, fallbackModelId) {
	return modelStateFromConfigOptions(response?.configOptions)?.currentModelId ?? fallbackModelId;
}
async function applyRequestedModelIfAdvertised(params) {
	const requestedModel = typeof params.requestedModel === "string" ? params.requestedModel.trim() : "";
	if (!requestedModel) return { applied: false };
	const warning = assertRequestedModelSupported({
		requestedModel,
		models: params.models,
		agentCommand: params.agentCommand,
		context: "apply"
	});
	if (warning) params.onWarning?.(warning);
	if (!params.models) return { applied: false };
	if (params.models.currentModelId === requestedModel) return { applied: true };
	return {
		applied: true,
		response: await withTimeout(params.client.setSessionModel(params.sessionId, requestedModel, params.models), params.timeoutMs)
	};
}
function isProcessAlive(pid) {
	if (!pid || !Number.isInteger(pid) || pid <= 0 || pid === process.pid) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}
const SESSION_LOAD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([-32601, -32602]);
function shouldFallbackToNewSession(error, record) {
	if (isHardReconnectFailure(error)) return false;
	const acp = extractAcpError(error);
	if (isAcpResourceNotFoundError(error) || isUnsupportedSessionLoadAcpError(acp)) return true;
	return !sessionHasAgentMessages(record) && isFallbackSafeEmptySessionError(error, acp);
}
function isHardReconnectFailure(error) {
	return error instanceof TimeoutError || error instanceof InterruptedError;
}
function isUnsupportedSessionLoadAcpError(acp) {
	return !!acp && SESSION_LOAD_UNSUPPORTED_CODES.has(acp.code);
}
function isFallbackSafeEmptySessionError(error, acp) {
	return isAcpQueryClosedBeforeResponseError(error) || acp?.code === -32603;
}
function requiresSameSession(resumePolicy) {
	return resumePolicy === "same-session-only";
}
function makeSessionResumeRequiredError(params) {
	return new SessionResumeRequiredError(`Persistent ACP session ${params.record.acpSessionId} could not be resumed: ${params.reason}`, { cause: params.cause instanceof Error ? params.cause : void 0 });
}
async function replayDesiredMode(params) {
	if (!params.desiredModeId) return;
	try {
		await withTimeout(params.client.setSessionMode(params.sessionId, params.desiredModeId), params.timeoutMs);
		if (params.verbose) process.stderr.write(`[acpx] replayed desired mode ${params.desiredModeId} on fresh ACP session ${params.sessionId} (previous ${params.previousSessionId})\n`);
	} catch (error) {
		throw new SessionModeReplayError(`Failed to replay saved session mode ${params.desiredModeId} on fresh ACP session ${params.sessionId}: ${formatErrorMessage(error)}`, {
			cause: error instanceof Error ? error : void 0,
			retryable: true
		});
	}
}
async function replayDesiredModel(params) {
	if (!params.desiredModelId) return { replayed: false };
	try {
		emitModelSupportWarning(assertRequestedModelSupported({
			requestedModel: params.desiredModelId,
			models: params.models,
			agentCommand: params.record.agentCommand,
			context: "replay"
		}), params.suppressWarnings);
		if (!params.models || params.models.currentModelId === params.desiredModelId) return { replayed: false };
		const response = await withTimeout(params.client.setSessionModel(params.sessionId, params.desiredModelId, params.models), params.timeoutMs);
		applyConfigOptionsToRecord(params.record, response);
		const models = response ? modelStateFromConfigOptions(response.configOptions) : {
			...params.models,
			currentModelId: params.desiredModelId
		};
		if (params.verbose) process.stderr.write(`[acpx] replayed desired model ${params.desiredModelId} on fresh ACP session ${params.sessionId} (previous ${params.previousSessionId})\n`);
		return {
			replayed: true,
			models,
			configOptionsPresent: response !== void 0
		};
	} catch (error) {
		throw new SessionModelReplayError(`Failed to replay saved session model ${params.desiredModelId} on fresh ACP session ${params.sessionId}: ${formatErrorMessage(error)}`, {
			cause: error instanceof Error ? error : void 0,
			retryable: true
		});
	}
}
function emitModelSupportWarning(warning, suppressWarnings) {
	if (warning && !suppressWarnings) process.stderr.write(`[acpx] warning: ${warning}\n`);
}
async function replayDesiredConfigOptions(params) {
	let result = { replayed: false };
	for (const [configId, value] of Object.entries(params.desiredConfigOptions)) try {
		const response = await withTimeout(params.client.setSessionConfigOption(params.sessionId, configId, value), params.timeoutMs);
		applyConfigOptionsToRecord(params.record, response);
		result = {
			replayed: true,
			models: modelStateFromConfigOptions(response.configOptions)
		};
		if (params.verbose) process.stderr.write(`[acpx] replayed desired config option ${configId} on fresh ACP session ${params.sessionId} (previous ${params.previousSessionId})\n`);
	} catch (error) {
		throw new SessionConfigOptionReplayError(`Failed to replay saved session config option ${configId} on fresh ACP session ${params.sessionId}: ${formatErrorMessage(error)}`, {
			cause: error instanceof Error ? error : void 0,
			retryable: true
		});
	}
	return result;
}
function restoreOriginalSessionState(params) {
	params.record.acpSessionId = params.sessionId;
	params.record.agentSessionId = params.agentSessionId;
}
async function connectAndLoadSession(options) {
	const record = options.record;
	const client = options.client;
	const sameSessionOnly = requiresSameSession(options.resumePolicy) || Boolean(record.importedFrom);
	const originalSessionId = record.acpSessionId;
	const originalAgentSessionId = record.agentSessionId;
	const originalAcpx = cloneSessionAcpxState(record.acpx);
	const desiredModeId = getDesiredModeId(record.acpx);
	const desiredModelId = getDesiredModelId(record.acpx);
	const desiredConfigOptions = getDesiredConfigOptions(record.acpx);
	const storedProcessAlive = isProcessAlive(record.pid);
	logReconnectAttempt(record, storedProcessAlive, Boolean(record.pid) && !storedProcessAlive, options.verbose);
	const reusingLoadedSession = client.hasReusableSession(record.acpSessionId);
	if (reusingLoadedSession) incrementPerfCounter("runtime.connect_and_load.reused_session");
	else await withTimeout(client.start(), options.timeoutMs);
	options.onClientAvailable?.(options.activeController);
	applyLifecycleSnapshotToRecord(record, client.getAgentLifecycleSnapshot());
	record.closed = false;
	record.closedAt = void 0;
	options.onConnectedRecord?.(record);
	let resumed = false;
	let loadError;
	let sessionId = record.acpSessionId;
	let createdFreshSession = false;
	let pendingAgentSessionId = record.agentSessionId;
	let sessionModels;
	const loadState = await loadOrCreateRuntimeSession({
		client,
		record,
		reusingLoadedSession,
		sameSessionOnly,
		timeoutMs: options.timeoutMs
	});
	resumed = loadState.resumed;
	loadError = loadState.loadError;
	sessionId = loadState.sessionId;
	createdFreshSession = loadState.createdFreshSession;
	pendingAgentSessionId = loadState.pendingAgentSessionId;
	sessionModels = loadState.sessionModels;
	const preferenceReplay = await replayFreshSessionPreferences({
		client,
		record,
		createdFreshSession,
		sessionId,
		pendingAgentSessionId,
		originalSessionId,
		originalAgentSessionId,
		originalAcpx,
		desiredModeId,
		desiredModelId,
		desiredConfigOptions,
		sessionModels,
		timeoutMs: options.timeoutMs,
		verbose: options.verbose,
		suppressWarnings: options.suppressWarnings
	});
	applyReconnectedModelState(record, resolveModelsAfterReplay(preferenceReplay, sessionModels), resolveConfigOptionsPresenceAfterReplay(preferenceReplay, loadState.configOptionsPresent), loadState.legacyModelMetadataPresent, createdFreshSession);
	options.onSessionIdResolved?.(sessionId);
	return {
		sessionId,
		agentSessionId: record.agentSessionId,
		resumed,
		loadError
	};
}
function resolveModelsAfterReplay(replay, initialModels) {
	if (replay.configReplay.replayed) return replay.configReplay.models ?? preserveLegacyModels(replay.modelReplay.replayed ? replay.modelReplay.models : initialModels);
	return replay.modelReplay.replayed ? replay.modelReplay.models : initialModels;
}
function preserveLegacyModels(models) {
	return models && !models.configId ? models : void 0;
}
function resolveConfigOptionsPresenceAfterReplay(replay, initiallyPresent) {
	return initiallyPresent || replay.configReplay.replayed || replay.modelReplay.replayed && replay.modelReplay.configOptionsPresent;
}
function applyReconnectedModelState(record, sessionModels, configOptionsPresent, legacyModelMetadataPresent, createdFreshSession) {
	clearOmittedFreshSessionConfigOptions(record, createdFreshSession, configOptionsPresent);
	if (sessionModels) {
		if (legacyModelMetadataPresent && !sessionModels.configId && record.acpx) removeModelConfigOptions(record.acpx);
		syncAdvertisedModelState(record, sessionModels);
	} else clearRemovedModelState(record, legacyModelMetadataPresent || createdFreshSession);
}
function clearOmittedFreshSessionConfigOptions(record, createdFreshSession, configOptionsPresent) {
	if (createdFreshSession && !configOptionsPresent && record.acpx) delete record.acpx.config_options;
}
function clearRemovedModelState(record, shouldClear) {
	if (shouldClear && record.acpx) clearAdvertisedModelState(record.acpx);
}
function logReconnectAttempt(record, storedProcessAlive, shouldReconnect, verbose) {
	if (!verbose) return;
	if (storedProcessAlive) {
		process.stderr.write(`[acpx] saved session pid ${record.pid} is running; reconnecting to saved ACP session\n`);
		return;
	}
	if (shouldReconnect) process.stderr.write(`[acpx] saved session pid ${record.pid} is dead; respawning agent and attempting session reconnect\n`);
}
async function replayFreshSessionPreferences(params) {
	if (!params.createdFreshSession) return {
		modelReplay: { replayed: false },
		configReplay: { replayed: false }
	};
	let modelReplay = { replayed: false };
	let configReplay = { replayed: false };
	try {
		await replayDesiredMode({
			client: params.client,
			sessionId: params.sessionId,
			desiredModeId: params.desiredModeId,
			previousSessionId: params.originalSessionId,
			timeoutMs: params.timeoutMs,
			verbose: params.verbose
		});
		modelReplay = await replayDesiredModel({
			client: params.client,
			sessionId: params.sessionId,
			desiredModelId: params.desiredModelId,
			previousSessionId: params.originalSessionId,
			record: params.record,
			models: params.sessionModels,
			timeoutMs: params.timeoutMs,
			verbose: params.verbose,
			suppressWarnings: params.suppressWarnings
		});
		configReplay = await replayDesiredConfigOptions({
			client: params.client,
			record: params.record,
			sessionId: params.sessionId,
			desiredConfigOptions: params.desiredConfigOptions,
			previousSessionId: params.originalSessionId,
			timeoutMs: params.timeoutMs,
			verbose: params.verbose
		});
	} catch (error) {
		restoreOriginalSessionState({
			record: params.record,
			sessionId: params.originalSessionId,
			agentSessionId: params.originalAgentSessionId
		});
		params.record.acpx = cloneSessionAcpxState(params.originalAcpx);
		if (params.verbose) process.stderr.write(`[acpx] ${formatErrorMessage(error)}\n`);
		throw error;
	}
	params.record.acpSessionId = params.sessionId;
	reconcileAgentSessionId(params.record, params.pendingAgentSessionId);
	return {
		modelReplay,
		configReplay
	};
}
async function loadOrCreateRuntimeSession(params) {
	if (params.reusingLoadedSession) return {
		sessionId: params.record.acpSessionId,
		pendingAgentSessionId: params.record.agentSessionId,
		sessionModels: void 0,
		configOptionsPresent: false,
		legacyModelMetadataPresent: false,
		resumed: true,
		createdFreshSession: false
	};
	if (params.client.supportsResumeSession()) return await resumeRuntimeSession(params);
	if (params.client.supportsLoadSession()) return await loadRuntimeSession(params);
	if (params.sameSessionOnly) throw makeSessionResumeRequiredError({
		record: params.record,
		reason: "agent does not support session/resume or session/load"
	});
	return await createFreshRuntimeSession(params.client, params.record, params.timeoutMs);
}
async function resumeRuntimeSession(params) {
	try {
		const resumeResult = await withTimeout(params.client.resumeSession(params.record.acpSessionId, params.record.cwd), params.timeoutMs);
		reconcileAgentSessionId(params.record, resumeResult.agentSessionId);
		applyConfigOptionsToRecord(params.record, resumeResult);
		return {
			sessionId: params.record.acpSessionId,
			pendingAgentSessionId: params.record.agentSessionId,
			sessionModels: resumeResult.models,
			configOptionsPresent: resumeResult.configOptionsPresent,
			legacyModelMetadataPresent: resumeResult.legacyModelMetadataPresent,
			resumed: true,
			createdFreshSession: false
		};
	} catch (error) {
		return await recoverRuntimeSessionLoadFailure(params, error);
	}
}
async function loadRuntimeSession(params) {
	try {
		const loadResult = await withTimeout(params.client.loadSessionWithOptions(params.record.acpSessionId, params.record.cwd, { suppressReplayUpdates: true }), params.timeoutMs);
		reconcileAgentSessionId(params.record, loadResult.agentSessionId);
		applyConfigOptionsToRecord(params.record, loadResult);
		return {
			sessionId: params.record.acpSessionId,
			pendingAgentSessionId: params.record.agentSessionId,
			sessionModels: loadResult.models,
			configOptionsPresent: loadResult.configOptionsPresent,
			legacyModelMetadataPresent: loadResult.legacyModelMetadataPresent,
			resumed: true,
			createdFreshSession: false
		};
	} catch (error) {
		return await recoverRuntimeSessionLoadFailure(params, error);
	}
}
async function recoverRuntimeSessionLoadFailure(params, error) {
	const loadError = formatErrorMessage(error);
	if (params.sameSessionOnly) throw makeSessionResumeRequiredError({
		record: params.record,
		reason: loadError,
		cause: error
	});
	if (!shouldFallbackToNewSession(error, params.record)) throw error;
	return {
		...await createFreshRuntimeSession(params.client, params.record, params.timeoutMs),
		loadError
	};
}
async function createFreshRuntimeSession(client, record, timeoutMs) {
	const createdSession = await withTimeout(client.createSession(record.cwd), timeoutMs);
	applyConfigOptionsToRecord(record, createdSession);
	return {
		sessionId: createdSession.sessionId,
		pendingAgentSessionId: createdSession.agentSessionId,
		sessionModels: createdSession.models,
		configOptionsPresent: createdSession.configOptionsPresent,
		legacyModelMetadataPresent: createdSession.legacyModelMetadataPresent,
		resumed: false,
		createdFreshSession: true
	};
}
function createActiveSessionController(params) {
	const getActiveSessionId = () => params.getActiveSessionId();
	return {
		hasActivePrompt: () => params.client.hasActivePrompt(),
		requestCancelActivePrompt: async () => await params.client.requestCancelActivePrompt(),
		setSessionMode: async (modeId) => {
			await params.client.setSessionMode(getActiveSessionId(), modeId);
		},
		setSessionModel: async (modelId) => {
			const models = advertisedModelState(params.record.acpx);
			const response = await params.client.setSessionModel(getActiveSessionId(), modelId, models);
			applyConfigOptionsToRecord(params.record, response);
			return response;
		},
		setSessionConfigOption: async (configId, value) => {
			return await params.client.setSessionConfigOption(getActiveSessionId(), configId, value);
		}
	};
}
async function withConnectedSession(options) {
	const record = await options.loadRecord(options.sessionRecordId);
	const clientOptions = {
		agentCommand: record.agentCommand,
		agentArgv: record.agentArgv,
		cwd: absolutePath(record.cwd),
		mcpServers: options.mcpServers,
		permissionMode: options.permissionMode ?? "approve-reads",
		nonInteractivePermissions: options.nonInteractivePermissions,
		permissionPolicy: options.permissionPolicy,
		onPermissionRequest: options.onPermissionRequest,
		authCredentials: options.authCredentials,
		authPolicy: options.authPolicy,
		fs: options.fs,
		terminal: options.terminal,
		elicitationModes: options.elicitationModes,
		verbose: options.verbose,
		sessionOptions: sessionOptionsFromRecord(record)
	};
	const client = options.createClient?.(clientOptions) ?? new AcpClient(clientOptions);
	let activeSessionIdForControl = record.acpSessionId;
	let notifiedClientAvailable = false;
	const activeController = createActiveSessionController({
		client,
		record,
		getActiveSessionId: () => activeSessionIdForControl
	});
	try {
		return await withInterrupt(async () => {
			const { sessionId, resumed, loadError } = await connectAndLoadSession({
				client,
				record,
				resumePolicy: options.resumePolicy,
				timeoutMs: options.timeoutMs,
				verbose: options.verbose,
				activeController,
				onClientAvailable: (controller) => {
					options.onClientAvailable?.(controller);
					notifiedClientAvailable = true;
				},
				onConnectedRecord: options.onConnectedRecord,
				onSessionIdResolved: (sessionIdValue) => {
					activeSessionIdForControl = sessionIdValue;
				}
			});
			const value = await options.run({
				record,
				client,
				activeController,
				sessionId,
				resumed,
				loadError
			});
			const now = isoNow$2();
			record.lastUsedAt = now;
			record.closed = false;
			record.closedAt = void 0;
			record.protocolVersion = client.initializeResult?.protocolVersion;
			record.agentCapabilities = client.initializeResult?.agentCapabilities;
			applyLifecycleSnapshotToRecord(record, client.getAgentLifecycleSnapshot());
			await options.saveRecord(record);
			return {
				value,
				record,
				resumed,
				loadError
			};
		}, async () => {
			if (options.onInterrupt) await options.onInterrupt({
				client,
				record
			});
			else await client.cancelActivePrompt(2500);
			applyLifecycleSnapshotToRecord(record, client.getAgentLifecycleSnapshot());
			record.lastUsedAt = isoNow$2();
			await options.saveRecord(record).catch(() => {});
			await client.close();
		});
	} finally {
		if (notifiedClientAvailable) options.onClientClosed?.();
		await client.close();
		applyLifecycleSnapshotToRecord(record, client.getAgentLifecycleSnapshot());
		await options.saveRecord(record).catch(() => {});
	}
}
const SESSION_REPLY_IDLE_MS = 1e3;
const SESSION_REPLY_DRAIN_TIMEOUT_MS = 5e3;
async function runPromptTurn(params) {
	try {
		const promptPromise = params.client.prompt(params.sessionId, params.prompt, params.onPromptRequestStarted, params.onElicitation);
		await params.onPromptStarted?.();
		const response = await withTimeout(promptPromise, params.timeoutMs);
		await params.client.waitForSessionUpdatesIdle?.({
			idleMs: SESSION_REPLY_IDLE_MS,
			timeoutMs: SESSION_REPLY_DRAIN_TIMEOUT_MS
		}).catch(() => {});
		recordPromptResponseUsage(params.conversation, response.usage, params.promptMessageId);
		return {
			stopReason: response.stopReason,
			source: "rpc"
		};
	} catch (error) {
		if (!(error instanceof TimeoutError) || !params.promptMessageId) throw error;
		await params.client.waitForSessionUpdatesIdle?.({
			idleMs: SESSION_REPLY_IDLE_MS,
			timeoutMs: SESSION_REPLY_DRAIN_TIMEOUT_MS
		}).catch(() => {});
		if (hasAgentReplyAfterPrompt(params.conversation, params.promptMessageId)) return {
			stopReason: "end_turn",
			source: "session"
		};
		throw error;
	}
}
const DEFAULT_LIVE_CHECKPOINT_INTERVAL_MS = 500;
var LiveSessionCheckpoint = class {
	save;
	intervalMs;
	onError;
	dirty = false;
	flushing;
	timer;
	constructor(options) {
		this.save = options.save;
		this.intervalMs = options.intervalMs ?? DEFAULT_LIVE_CHECKPOINT_INTERVAL_MS;
		this.onError = options.onError;
	}
	request() {
		this.dirty = true;
		if (this.timer) return;
		this.timer = setTimeout(() => {
			this.timer = void 0;
			this.flush().catch((error) => {
				this.onError?.(error);
			});
		}, this.intervalMs);
		this.timer.unref?.();
	}
	async checkpoint() {
		this.dirty = true;
		await this.flush();
	}
	async flush() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = void 0;
		}
		if (this.flushing) {
			await this.flushing;
			if (!this.dirty) return;
		}
		this.flushing = this.flushDirty();
		try {
			await this.flushing;
		} finally {
			this.flushing = void 0;
		}
	}
	async flushDirty() {
		while (this.dirty) {
			this.dirty = false;
			await this.save();
		}
	}
};
//#endregion
//#region node_modules/acpx/dist/runtime.js
var AcpRuntimeError = class extends Error {
	code;
	cause;
	constructor(code, message, options) {
		super(message);
		this.name = "AcpRuntimeError";
		this.code = code;
		this.cause = options?.cause;
	}
};
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function asTrimmedString(value) {
	return typeof value === "string" ? value.trim() : "";
}
function asString(value) {
	return typeof value === "string" ? value : void 0;
}
function asOptionalString(value) {
	return asTrimmedString(value) || void 0;
}
function deriveAgentFromSessionKey(sessionKey, fallbackAgent) {
	const match = sessionKey.match(/^agent:([^:]+):/i);
	return (match?.[1] ? asTrimmedString(match[1]) : "") || fallbackAgent;
}
const TOOL_OUTPUT_SUMMARY_MAX_CHARS = 500;
function safeParseJsonObject(line) {
	try {
		const parsed = JSON.parse(line);
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function asOptionalFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function resolveStructuredPromptPayload(parsed) {
	if (asTrimmedString(parsed.method) === "session/update") {
		const params = parsed.params;
		if (isRecord(params) && isRecord(params.update)) {
			const update = params.update;
			const tag = asOptionalString(update.sessionUpdate);
			return {
				type: tag ?? "",
				payload: update,
				...tag ? { tag } : {}
			};
		}
	}
	const sessionUpdate = asOptionalString(parsed.sessionUpdate);
	if (sessionUpdate) return {
		type: sessionUpdate,
		payload: parsed,
		tag: sessionUpdate
	};
	const type = asTrimmedString(parsed.type);
	const tag = asOptionalString(parsed.tag);
	return {
		type,
		payload: parsed,
		...tag ? { tag } : {}
	};
}
function resolveStatusTextForTag(params) {
	const resolver = STATUS_TEXT_RESOLVERS[params.tag];
	return resolver ? resolver(params.payload) : null;
}
const STATUS_TEXT_RESOLVERS = {
	available_commands_update: availableCommandsStatusText,
	current_mode_update: currentModeStatusText,
	config_option_update: configOptionStatusText,
	session_info_update: sessionInfoStatusText,
	plan: planStatusText
};
function availableCommandsStatusText(payload) {
	const commands = Array.isArray(payload.availableCommands) ? payload.availableCommands : [];
	return commands.length > 0 ? `available commands updated (${commands.length})` : "available commands updated";
}
function currentModeStatusText(payload) {
	const mode = asTrimmedString(payload.currentModeId) || asTrimmedString(payload.modeId) || asTrimmedString(payload.mode);
	return mode ? `mode updated: ${mode}` : "mode updated";
}
function configOptionStatusText(payload) {
	const id = asTrimmedString(payload.id) || asTrimmedString(payload.configOptionId);
	const value = asTrimmedString(payload.currentValue) || asTrimmedString(payload.value) || asTrimmedString(payload.optionValue);
	if (id && value) return `config updated: ${id}=${value}`;
	return id ? `config updated: ${id}` : "config updated";
}
function sessionInfoStatusText(payload) {
	return asTrimmedString(payload.summary) || asTrimmedString(payload.message) || "session updated";
}
function planStatusText(payload) {
	const content = asTrimmedString((Array.isArray(payload.entries) ? payload.entries : []).find((entry) => isRecord(entry))?.content);
	return content ? `plan: ${content}` : null;
}
/**
* Documented allowlist for text_delta.meta origin fields.
* Only these keys may be copied from ACP update `_meta`.
* Unknown keys (including secret-like producer-controlled names) are dropped.
*/
const ORIGIN_META_KEYS = [
	"origin",
	"kind",
	"source"
];
/**
* Preserve a fail-closed subset of ACP update origin fields for text_delta
* consumers. Empty or unusable values are omitted rather than inferred.
*/
function extractTextDeltaOrigin(payload) {
	const messageId = asOptionalString(payload.messageId);
	const meta = sanitizeOriginMeta(payload._meta);
	return {
		...messageId ? { messageId } : {},
		...meta ? { meta } : {}
	};
}
/**
* Copy only allowlisted string origin keys from wire `_meta`.
* Nested objects, arrays, non-strings, and unknown keys are dropped.
*/
function sanitizeOriginMeta(value) {
	if (!isRecord(value)) return;
	const out = {};
	for (const key of ORIGIN_META_KEYS) {
		const entry = value[key];
		if (typeof entry !== "string") continue;
		const trimmed = entry.trim();
		if (!trimmed) continue;
		out[key] = trimmed;
	}
	return Object.keys(out).length > 0 ? out : void 0;
}
function resolveTextChunk(params) {
	const origin = extractTextDeltaOrigin(params.payload);
	const contentRaw = params.payload.content;
	if (isRecord(contentRaw)) {
		const contentType = asTrimmedString(contentRaw.type);
		if (contentType && contentType !== "text") return null;
		const text = asString(contentRaw.text);
		if (text && text.length > 0) return {
			type: "text_delta",
			text,
			stream: params.stream,
			tag: params.tag,
			...origin
		};
	}
	const text = asString(params.payload.text);
	if (!text || text.length === 0) return null;
	return {
		type: "text_delta",
		text,
		stream: params.stream,
		tag: params.tag,
		...origin
	};
}
function createTextDeltaEvent(params) {
	if (params.content == null || params.content.length === 0) return null;
	return {
		type: "text_delta",
		text: params.content,
		stream: params.stream,
		...params.tag ? { tag: params.tag } : {}
	};
}
function readFirstString(record, keys) {
	for (const key of keys) {
		const value = asOptionalString(record[key]);
		if (value) return value;
	}
}
function readFirstStringArray(record, keys) {
	for (const key of keys) {
		const value = record[key];
		if (!Array.isArray(value)) continue;
		const entries = value.map((entry) => asOptionalString(entry)).filter((entry) => entry !== void 0);
		if (entries.length > 0) return entries;
	}
}
function summarizeToolInput(rawInput) {
	if (rawInput == null) return;
	if (typeof rawInput === "string" || typeof rawInput === "number" || typeof rawInput === "boolean") return String(rawInput);
	if (!isRecord(rawInput)) return;
	const command = readFirstString(rawInput, [
		"command",
		"cmd",
		"program"
	]);
	const args = readFirstStringArray(rawInput, ["args", "arguments"]);
	if (command) return [command, ...args ?? []].join(" ");
	return readFirstString(rawInput, [
		"path",
		"file",
		"filePath",
		"filepath",
		"target",
		"uri",
		"url",
		"query",
		"pattern",
		"text",
		"search"
	]);
}
function truncateToolSummary(value) {
	if (value.length <= TOOL_OUTPUT_SUMMARY_MAX_CHARS) return value;
	return `${value.slice(0, TOOL_OUTPUT_SUMMARY_MAX_CHARS - 1)}…`;
}
function readToolContentText(value) {
	const record = isRecord(value) ? value : void 0;
	if (!record) return;
	if (record.type === "content") return readToolContentText(record.content);
	return toolContentTextReader(String(record.type))?.(record);
}
const TOOL_CONTENT_TEXT_READERS = {
	text: (record) => asString(record.text),
	audio: (record) => `[audio] ${asOptionalString(record.mimeType) || "audio"}`,
	resource_link: (record) => asOptionalString(record.title) || asOptionalString(record.name) || asOptionalString(record.uri),
	resource: (record) => {
		const resource = isRecord(record.resource) ? record.resource : void 0;
		return asString(resource?.text) || asOptionalString(resource?.uri);
	},
	diff: (record) => `diff ${asOptionalString(record.path) || "file"}`,
	terminal: (record) => {
		const terminalId = asOptionalString(record.terminalId) || asOptionalString(record.id);
		return terminalId ? `[terminal] ${terminalId}` : "[terminal]";
	}
};
function toolContentTextReader(type) {
	return Object.hasOwn(TOOL_CONTENT_TEXT_READERS, type) ? TOOL_CONTENT_TEXT_READERS[type] : void 0;
}
function summarizeToolContent(content) {
	if (!Array.isArray(content)) return;
	const fragments = content.map((entry) => readToolContentText(entry)?.trim()).filter((entry) => Boolean(entry));
	if (fragments.length === 0) return;
	return truncateToolSummary([...new Set(fragments)].join("\n"));
}
function summarizeToolOutput(rawOutput) {
	if (rawOutput == null) return;
	if (isScalarToolOutput(rawOutput)) return truncateToolSummary(String(rawOutput));
	const record = isRecord(rawOutput) ? rawOutput : void 0;
	if (!record) return;
	return truncateToolSummary(readFirstString(record, [
		"text",
		"message",
		"error",
		"stdout",
		"stderr",
		"content"
	]) ?? "") || void 0;
}
function isScalarToolOutput(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function shouldForwardArray(value) {
	return Array.isArray(value);
}
function readToolKind(value) {
	const kind = asOptionalString(value);
	return kind && TOOL_KINDS.has(kind) ? kind : void 0;
}
const TOOL_KINDS = /* @__PURE__ */ new Set([
	"read",
	"edit",
	"delete",
	"move",
	"search",
	"execute",
	"fetch",
	"think",
	"other"
]);
function createToolCallEvent(params) {
	const title = asTrimmedString(params.payload.title) || "tool call";
	const status = asTrimmedString(params.payload.status);
	const inputSummary = summarizeToolInput(params.payload.rawInput);
	const outputSummary = summarizeToolContent(params.payload.content) ?? summarizeToolOutput(params.payload.rawOutput);
	const toolCallId = asOptionalString(params.payload.toolCallId);
	const kind = readToolKind(params.payload.kind);
	const summaryText = status ? `${title} (${status})` : title;
	const detailSummary = params.tag === "tool_call_update" ? outputSummary ?? inputSummary : inputSummary ?? outputSummary;
	const event = {
		type: "tool_call",
		text: detailSummary ? `${summaryText}: ${detailSummary}` : summaryText,
		tag: params.tag,
		title
	};
	assignToolCallEventMetadata(event, params.payload, {
		toolCallId,
		status,
		kind
	});
	return event;
}
function assignToolCallEventMetadata(event, payload, values) {
	if (event.type !== "tool_call") return;
	if (values.toolCallId) event.toolCallId = values.toolCallId;
	if (values.status) event.status = values.status;
	if (values.kind) event.kind = values.kind;
	assignForwardedToolPayload(event, payload);
}
function assignForwardedToolPayload(event, payload) {
	if (shouldForwardArray(payload.locations)) event.locations = payload.locations;
	if (Object.prototype.hasOwnProperty.call(payload, "rawInput")) event.rawInput = payload.rawInput;
	if (Object.prototype.hasOwnProperty.call(payload, "rawOutput")) event.rawOutput = payload.rawOutput;
	if (shouldForwardArray(payload.content)) event.content = payload.content;
}
function parsePromptEventLine(line) {
	const trimmed = line.trim();
	if (!trimmed) return null;
	const parsed = safeParseJsonObject(trimmed);
	if (!parsed) return {
		type: "status",
		text: trimmed
	};
	const structured = resolveStructuredPromptPayload(parsed);
	const type = structured.type;
	const payload = structured.payload;
	const tag = structured.tag;
	const parser = promptEventParser(type);
	return parser ? parser(payload, tag) : null;
}
const PROMPT_EVENT_PARSERS = {
	text: (payload, tag) => createTextDeltaEvent({
		content: asString(payload.content),
		stream: "output",
		tag
	}),
	thought: (payload, tag) => createTextDeltaEvent({
		content: asString(payload.content),
		stream: "thought",
		tag
	}),
	tool_call: (payload, tag) => createToolCallEvent({
		payload,
		tag: tag ?? "tool_call"
	}),
	tool_call_update: (payload, tag) => createToolCallEvent({
		payload,
		tag: tag ?? "tool_call_update"
	}),
	agent_message_chunk: (payload) => resolveTextChunk({
		payload,
		stream: "output",
		tag: "agent_message_chunk"
	}),
	agent_thought_chunk: (payload) => resolveTextChunk({
		payload,
		stream: "thought",
		tag: "agent_thought_chunk"
	}),
	usage_update: usageUpdateEvent,
	available_commands_update: availableCommandsUpdateEvent,
	current_mode_update: (payload) => statusUpdateEvent("current_mode_update", payload),
	config_option_update: (payload) => statusUpdateEvent("config_option_update", payload),
	session_info_update: (payload) => statusUpdateEvent("session_info_update", payload),
	plan: (payload) => statusUpdateEvent("plan", payload),
	client_operation: clientOperationEvent,
	update: updateStatusEvent,
	done: () => null,
	error: () => null
};
function promptEventParser(type) {
	return Object.hasOwn(PROMPT_EVENT_PARSERS, type) ? PROMPT_EVENT_PARSERS[type] : void 0;
}
function usageUpdateEvent(payload) {
	const used = asOptionalFiniteNumber(payload.used);
	const size = asOptionalFiniteNumber(payload.size);
	const meta = isRecord(payload._meta) ? payload._meta : void 0;
	return buildUsageUpdateEvent({
		used,
		size,
		cost: normalizeUsageCost(payload.cost),
		breakdown: normalizeUsageBreakdown(meta?.usage)
	});
}
function buildUsageUpdateEvent(parts) {
	const { used, size, cost, breakdown } = parts;
	return {
		type: "status",
		text: used != null && size != null ? `usage updated: ${used}/${size}` : "usage updated",
		tag: "usage_update",
		...used != null ? { used } : {},
		...size != null ? { size } : {},
		...cost ? { cost } : {},
		...breakdown ? { breakdown } : {}
	};
}
function availableCommandsUpdateEvent(payload) {
	const raw = Array.isArray(payload.availableCommands) ? payload.availableCommands : [];
	const availableCommands = [];
	for (const entry of raw) {
		if (!isRecord(entry)) continue;
		const name = asTrimmedString(entry.name);
		if (!name) continue;
		const description = asTrimmedString(entry.description);
		availableCommands.push({
			name,
			...description ? { description } : {},
			hasInput: entry.input != null
		});
	}
	return {
		type: "status",
		text: availableCommands.length > 0 ? `available commands updated (${availableCommands.length})` : "available commands updated",
		tag: "available_commands_update",
		availableCommands
	};
}
function normalizeUsageCost(value) {
	if (!isRecord(value)) return;
	const amount = asOptionalFiniteNumber(value.amount);
	const currency = asTrimmedString(value.currency);
	if (amount == null && !currency) return;
	return {
		...amount != null ? { amount } : {},
		...currency ? { currency } : {}
	};
}
const USAGE_BREAKDOWN_FIELDS = [
	["inputTokens", ["inputTokens", "input_tokens"]],
	["outputTokens", ["outputTokens", "output_tokens"]],
	["cachedReadTokens", [
		"cachedReadTokens",
		"cacheReadInputTokens",
		"cache_read_input_tokens"
	]],
	["cachedWriteTokens", [
		"cachedWriteTokens",
		"cacheCreationInputTokens",
		"cache_creation_input_tokens"
	]],
	["thoughtTokens", ["thoughtTokens", "thought_tokens"]],
	["totalTokens", ["totalTokens", "total_tokens"]]
];
function normalizeUsageBreakdown(value) {
	if (!isRecord(value)) return;
	const breakdown = {};
	for (const [key, aliases] of USAGE_BREAKDOWN_FIELDS) {
		const v = firstFiniteNumber(value, aliases);
		if (v != null) breakdown[key] = v;
	}
	return Object.keys(breakdown).length > 0 ? breakdown : void 0;
}
function firstFiniteNumber(record, keys) {
	for (const key of keys) {
		const value = asOptionalFiniteNumber(record[key]);
		if (value != null) return value;
	}
}
function statusUpdateEvent(tag, payload) {
	const text = resolveStatusTextForTag({
		tag,
		payload
	});
	if (!text) return null;
	return {
		type: "status",
		text,
		tag
	};
}
function clientOperationEvent(payload, tag) {
	const text = [
		asTrimmedString(payload.method) || "operation",
		asTrimmedString(payload.status),
		asTrimmedString(payload.summary)
	].filter(Boolean).join(" ");
	return text ? {
		type: "status",
		text,
		...tag ? { tag } : {}
	} : null;
}
function updateStatusEvent(payload, tag) {
	const update = asTrimmedString(payload.update);
	return update ? {
		type: "status",
		text: update,
		...tag ? { tag } : {}
	} : null;
}
function shouldReuseExistingRecord(record, params) {
	if (record.acpx?.reset_on_next_ensure === true) return false;
	if (path.resolve(record.cwd) !== path.resolve(params.cwd)) return false;
	if (record.agentCommand !== params.agentCommand) return false;
	if (!sameArgv(record.agentArgv, params.agentArgv)) return false;
	if (params.resumeSessionId && record.acpSessionId !== params.resumeSessionId) return false;
	return true;
}
function sameArgv(left, right) {
	const leftValues = left ?? [];
	const rightValues = right ?? [];
	return leftValues.length === rightValues.length && leftValues.every((value, index) => value === rightValues[index]);
}
function createDeferred() {
	let resolve;
	let reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
async function settleAttempt(run) {
	try {
		return {
			ok: true,
			value: await run()
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
function firstFailedAttempt(attempts) {
	return attempts.find((attempt) => !attempt.ok);
}
var AsyncEventQueue = class {
	items = [];
	waits = [];
	closed = false;
	push(item) {
		if (this.closed) return;
		const waiter = this.waits.shift();
		if (waiter) {
			waiter.resolve(item);
			return;
		}
		this.items.push(item);
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		for (const waiter of this.waits.splice(0)) waiter.resolve(null);
	}
	clear() {
		this.items.length = 0;
	}
	async next() {
		if (this.items.length > 0) return this.items.shift() ?? null;
		if (this.closed) return null;
		const waiter = createDeferred();
		this.waits.push(waiter);
		return await waiter.promise;
	}
	async *iterate() {
		while (true) {
			const next = await this.next();
			if (!next) return;
			yield next;
		}
	}
};
function isoNow() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function isUnsupportedSessionCloseError(error) {
	const acp = extractAcpError(error);
	if (!acp) return false;
	if (acp.code === -32601 || acp.code === -32602) return true;
	if (acp.code !== -32603 || !acp.data || typeof acp.data !== "object") return false;
	const details = acp.data.details;
	return typeof details === "string" && details.toLowerCase().includes("invalid params");
}
function toPromptInput(text, attachments) {
	if (!attachments || attachments.length === 0) return text;
	const blocks = [];
	if (text) blocks.push({
		type: "text",
		text
	});
	for (const attachment of attachments) {
		if (attachment.mediaType.startsWith("image/")) {
			blocks.push({
				type: "image",
				mimeType: attachment.mediaType,
				data: attachment.data
			});
			continue;
		}
		if (attachment.mediaType.startsWith("audio/")) {
			blocks.push({
				type: "audio",
				mimeType: attachment.mediaType,
				data: attachment.data
			});
			continue;
		}
		throw new AcpRuntimeError("ACP_TURN_FAILED", `Unsupported ACP runtime attachment media type: ${attachment.mediaType}`);
	}
	return blocks.length > 0 ? blocks : textPrompt(text);
}
function createInitialRecord(params) {
	const now = isoNow();
	return {
		schema: "acpx.session.v1",
		acpxRecordId: params.recordId,
		acpSessionId: params.sessionId,
		agentSessionId: params.agentSessionId,
		agentCommand: params.agentCommand,
		agentArgv: params.agentArgv,
		cwd: params.cwd,
		name: params.sessionName,
		createdAt: now,
		lastUsedAt: now,
		lastSeq: 0,
		eventLog: defaultSessionEventLog(params.recordId),
		closed: false,
		closedAt: void 0,
		...createSessionConversation(now),
		acpx: {}
	};
}
function createRecordId(sessionKey, mode) {
	if (mode === "persistent") return sessionKey;
	return `${sessionKey}:oneshot:${randomUUID()}`;
}
function resumePolicyForSessionMode(mode) {
	return mode === "persistent" ? "same-session-only" : "allow-new";
}
function legacyTerminalEventFromTurnResult(result) {
	if (result.status === "failed") return {
		type: "error",
		message: result.error.message,
		...result.error.code ? { code: result.error.code } : {},
		...result.error.detailCode ? { detailCode: result.error.detailCode } : {},
		...result.error.retryable === void 0 ? {} : { retryable: result.error.retryable }
	};
	return {
		type: "done",
		...result.stopReason ? { stopReason: result.stopReason } : {}
	};
}
function statusSummary(record) {
	return [
		`session=${record.acpxRecordId}`,
		`backendSessionId=${record.acpSessionId}`,
		record.agentSessionId ? `agentSessionId=${record.agentSessionId}` : null,
		record.pid != null ? `pid=${record.pid}` : null,
		record.closed ? "closed" : "open"
	].filter(Boolean).join(" ");
}
function buildModelsField(record) {
	const available = record.acpx?.available_models;
	const currentModelId = record.acpx?.current_model_id;
	if (!available || available.length === 0) return currentModelId === void 0 ? {} : { models: {
		currentModelId,
		availableModelIds: []
	} };
	return { models: {
		...currentModelId !== void 0 ? { currentModelId } : {},
		availableModelIds: [...available]
	} };
}
function tokenUsageToBreakdown(usage) {
	if (!usage) return;
	const breakdown = {};
	assignUsageBreakdownField(breakdown, "inputTokens", usage.input_tokens);
	assignUsageBreakdownField(breakdown, "outputTokens", usage.output_tokens);
	assignUsageBreakdownField(breakdown, "cachedReadTokens", usage.cache_read_input_tokens);
	assignUsageBreakdownField(breakdown, "cachedWriteTokens", usage.cache_creation_input_tokens);
	assignUsageBreakdownField(breakdown, "thoughtTokens", usage.thought_tokens);
	assignUsageBreakdownField(breakdown, "totalTokens", usage.total_tokens);
	return Object.keys(breakdown).length > 0 ? breakdown : void 0;
}
function assignUsageBreakdownField(breakdown, key, value) {
	if (value !== void 0) breakdown[key] = value;
}
function buildUsageField(record) {
	const cumulative = tokenUsageToBreakdown(record.cumulative_token_usage);
	const perRequestEntries = Object.entries(record.request_token_usage ?? {}).map(([id, value]) => [id, tokenUsageToBreakdown(value)]).filter((entry) => entry[1] !== void 0);
	const perRequest = perRequestEntries.length > 0 ? Object.fromEntries(perRequestEntries) : void 0;
	const cost = record.cumulative_cost;
	const usage = {
		...cumulative ? { cumulative } : {},
		...cost ? { cost } : {},
		...perRequest ? { perRequest } : {}
	};
	return Object.keys(usage).length > 0 ? { usage } : {};
}
function buildAvailableCommandsField(record) {
	const commands = record.acpx?.available_commands;
	if (!commands || commands.length === 0) return {};
	const availableCommands = commands.map((command) => runtimeAvailableCommand(command)).filter((command) => command !== void 0);
	return availableCommands.length > 0 ? { availableCommands } : {};
}
function runtimeAvailableCommand(command) {
	if (typeof command === "string") {
		const name = command.trim();
		return name ? { name } : void 0;
	}
	const record = commandRecord(command);
	if (!record) return;
	const name = trimmedField(record.name);
	if (!name) return;
	const runtimeCommand = { name };
	const description = trimmedField(record.description);
	if (description) runtimeCommand.description = description;
	if (typeof record.has_input === "boolean") runtimeCommand.hasInput = record.has_input;
	return runtimeCommand;
}
function commandRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function trimmedField(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function advertisedConfigOptionIds(record) {
	const configOptions = record.acpx?.config_options;
	if (!configOptions) return;
	return new Set(configOptions.map((option) => option.id).filter((id) => typeof id === "string" && id.trim().length > 0));
}
function resolveSupportedConfigOptionId(record, configId) {
	const advertisedIds = advertisedConfigOptionIds(record);
	if (!advertisedIds) return configId;
	if (advertisedIds.has(configId)) return configId;
	if (configId === "thinking" && advertisedIds.has("effort")) return "effort";
	const supported = [...advertisedIds].toSorted();
	const supportedText = supported.length > 0 ? supported.join(", ") : "none";
	throw new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", `ACP session ${record.acpxRecordId} does not advertise config option '${configId}'. Supported config options: ${supportedText}.`);
}
function applyConfigOptionResponseToTurn(turn, response) {
	if (!response?.configOptions) return;
	turn.acpxState = applyConfigOptionsToState(turn.acpxState, response.configOptions);
}
function applyDesiredConfigOptionToTurn(turn, configId, value) {
	const nextState = cloneSessionAcpxState(turn.acpxState) ?? {};
	if (configId === modelStateFromConfigOptions(nextState.config_options)?.configId) {
		nextState.session_options = {
			...nextState.session_options,
			model: value
		};
		clearDesiredConfigOption(nextState, configId);
	} else if (configId === "mode") nextState.desired_mode_id = value;
	else nextState.desired_config_options = {
		...nextState.desired_config_options,
		[configId]: value
	};
	turn.acpxState = nextState;
}
function applyDesiredConfigOptionToRecord(record, configId, value) {
	if (configId === modelStateFromConfigOptions(record.acpx?.config_options)?.configId) setDesiredModelId(record, value, configId);
	else if (configId === "mode") setDesiredModeId(record, value);
	else setDesiredConfigOption(record, configId, value);
}
async function createOrLoadRuntimeSession(client, resumeSessionId, cwd) {
	if (resumeSessionId) {
		if (client.supportsResumeSession()) {
			const resumed = await client.resumeSession(resumeSessionId, cwd);
			return {
				sessionId: resumeSessionId,
				agentSessionId: resumed.agentSessionId,
				sessionResult: resumed
			};
		}
		if (!client.supportsLoadSession()) throw new Error(`Agent does not support session/resume or session/load; cannot resume session ${resumeSessionId}`);
		const loaded = await client.loadSession(resumeSessionId, cwd);
		return {
			sessionId: resumeSessionId,
			agentSessionId: loaded.agentSessionId,
			sessionResult: loaded
		};
	}
	const created = await client.createSession(cwd);
	return {
		sessionId: created.sessionId,
		agentSessionId: created.agentSessionId,
		sessionResult: created
	};
}
var AcpRuntimeManager = class {
	options;
	deps;
	activeControllers = /* @__PURE__ */ new Map();
	retainedSessionOwners = /* @__PURE__ */ new Map();
	pendingOneShotRecordIds = /* @__PURE__ */ new Map();
	ensureSessionLocks = /* @__PURE__ */ new Map();
	runtimeOperationLocks = /* @__PURE__ */ new Map();
	closingActiveRecords = /* @__PURE__ */ new Set();
	constructor(options, deps = {}) {
		this.options = options;
		this.deps = deps;
	}
	createClient(options) {
		return this.deps.clientFactory?.(options) ?? new AcpClient(options);
	}
	createSessionOwner(input) {
		const owner = {
			...input,
			bufferSessionUpdates: false,
			pendingSessionUpdates: []
		};
		input.client.setEventHandlers({
			onSessionUpdate: (notification) => this.routeOwnedSessionUpdate(owner, notification),
			onClientOperation: (operation) => this.routeOwnedClientOperation(owner, operation)
		});
		return owner;
	}
	routeOwnedSessionUpdate(owner, notification) {
		const active = owner.activeTurn;
		if (active) {
			const { task, turn } = active;
			if (turn.connectionUpdates) {
				turn.connectionUpdates.push(notification);
				this.emitRuntimeTurnEvent(task, {
					jsonrpc: "2.0",
					method: "session/update",
					params: notification
				});
				return;
			}
			turn.acpxState = recordSessionUpdate(turn.conversation, turn.acpxState, notification);
			trimConversationForRuntime(turn.conversation);
			turn.liveCheckpoint.request();
			this.emitRuntimeTurnEvent(task, {
				jsonrpc: "2.0",
				method: "session/update",
				params: notification
			});
			return;
		}
		if (owner.bufferSessionUpdates) {
			owner.pendingSessionUpdates.push(notification);
			return;
		}
		const projection = owner.projection;
		if (!projection) {
			owner.pendingSessionUpdates.push(notification);
			return;
		}
		projection.acpxState = recordSessionUpdate(projection.conversation, projection.acpxState, notification);
		trimConversationForRuntime(projection.conversation);
		projection.checkpoint.request();
	}
	routeOwnedClientOperation(owner, operation) {
		const active = owner.activeTurn;
		if (!active) return;
		const { task, turn } = active;
		turn.acpxState = recordClientOperation(turn.conversation, turn.acpxState, operation);
		trimConversationForRuntime(turn.conversation);
		turn.liveCheckpoint.request();
		this.emitRuntimeTurnEvent(task, {
			type: "client_operation",
			...operation
		});
	}
	attachIdleProjection(owner, record, conversation = cloneSessionConversation(record), acpxState = cloneSessionAcpxState(record.acpx)) {
		let projection;
		projection = {
			record,
			conversation,
			acpxState,
			checkpoint: new LiveSessionCheckpoint({ save: async () => {
				record.lastUsedAt = isoNow();
				record.acpx = projection.acpxState;
				applyConversation(record, projection.conversation);
				applyLifecycleSnapshotToRecord(record, owner.client.getAgentLifecycleSnapshot());
				await this.refreshClosedState(record);
				await this.options.sessionStore.save(record);
			} })
		};
		owner.projection = projection;
		owner.activeTurn = void 0;
		this.drainPendingSessionUpdates(owner);
	}
	drainPendingSessionUpdates(owner) {
		for (const notification of owner.pendingSessionUpdates.splice(0)) this.routeOwnedSessionUpdate(owner, notification);
	}
	async flushSessionOwner(owner) {
		await owner.client.waitForSessionUpdatesIdle?.().catch(() => {});
		await owner.projection?.checkpoint.flush();
	}
	removeRetainedSessionOwner(owner) {
		if (owner.recordId && this.retainedSessionOwners.get(owner.recordId) === owner) this.retainedSessionOwners.delete(owner.recordId);
		if (owner.mode === "oneshot" && owner.recordId && this.pendingOneShotRecordIds.get(owner.sessionKey) === owner.recordId) this.pendingOneShotRecordIds.delete(owner.sessionKey);
	}
	async readRetainedSessionOwner(record, options) {
		const owner = this.retainedSessionOwners.get(record.acpxRecordId);
		if (!owner) return;
		await this.flushSessionOwner(owner);
		const projectedRecord = owner.projection?.record;
		if (projectedRecord && projectedRecord !== record) Object.assign(record, structuredClone(projectedRecord));
		if (!owner.client.hasReusableSession(record.acpSessionId)) {
			this.removeRetainedSessionOwner(owner);
			await this.stopSessionOwner(owner);
			return;
		}
		if (options.consume) this.removeRetainedSessionOwner(owner);
		return owner;
	}
	async closeRetainedSessionOwner(recordId) {
		const owner = this.retainedSessionOwners.get(recordId);
		if (!owner) return;
		this.removeRetainedSessionOwner(owner);
		await this.stopSessionOwner(owner);
	}
	async stopSessionOwner(owner) {
		await this.flushSessionOwner(owner).catch(() => {});
		await owner.client.close().catch(() => {});
		await owner.projection?.checkpoint.flush().catch(() => {});
		try {
			owner.client.clearEventHandlers();
		} catch {}
	}
	async refreshClosedState(record) {
		if (!this.closingActiveRecords.has(record.acpxRecordId)) return record.closed === true;
		const latest = await this.options.sessionStore.load(record.acpxRecordId).catch(() => void 0);
		record.closed = true;
		record.closedAt = latest?.closedAt ?? record.closedAt ?? isoNow();
		if (latest?.acpx) record.acpx = {
			...record.acpx,
			...latest.acpx
		};
		return true;
	}
	async retainPersistentSessionOwnerAfterTurn(input) {
		const { record, owner, conversation, acpxState } = input;
		if (!this.canRetainPersistentSessionOwner(owner, record)) {
			owner.activeTurn = void 0;
			return false;
		}
		this.attachIdleProjection(owner, record, conversation, acpxState);
		const previousOwner = this.retainedSessionOwners.get(record.acpxRecordId);
		this.retainedSessionOwners.set(record.acpxRecordId, owner);
		if (previousOwner && previousOwner !== owner) {
			this.removeRetainedSessionOwner(previousOwner);
			await this.stopSessionOwner(previousOwner);
		}
		return true;
	}
	canRetainPersistentSessionOwner(owner, record) {
		return owner.mode === "persistent" && !record.closed && !(owner.client.hasUnresolvedPrompt?.() ?? false) && owner.client.hasReusableSession(record.acpSessionId);
	}
	async withRuntimeControlSession(record, sessionMode, run) {
		const owner = await this.readRetainedSessionOwner(record, { consume: false });
		if (owner) {
			const ownedRecord = owner.projection?.record ?? record;
			owner.bufferSessionUpdates = true;
			try {
				const value = await run({
					client: owner.client,
					sessionId: ownedRecord.acpSessionId,
					record: ownedRecord
				});
				this.refreshOwnedRecordLifecycle(owner, ownedRecord);
				return {
					value,
					record: ownedRecord
				};
			} finally {
				await this.finishBufferedOwnerControl(owner, ownedRecord);
			}
		}
		const result = await withConnectedSession({
			sessionRecordId: record.acpxRecordId,
			loadRecord: async (sessionRecordId) => await this.requireRecord(sessionRecordId),
			saveRecord: async (connectedRecord) => await this.options.sessionStore.save(connectedRecord),
			createClient: (options) => this.createClient(options),
			mcpServers: [...this.options.mcpServers ?? []],
			permissionMode: this.options.permissionMode,
			nonInteractivePermissions: this.options.nonInteractivePermissions,
			permissionPolicy: this.options.permissionPolicy,
			onPermissionRequest: this.options.onPermissionRequest,
			elicitationModes: this.options.elicitationModes,
			verbose: this.options.verbose,
			timeoutMs: this.options.timeoutMs,
			resumePolicy: resumePolicyForSessionMode(sessionMode),
			run
		});
		return {
			value: result.value,
			record: result.record
		};
	}
	refreshOwnedRecordLifecycle(owner, record) {
		record.lastUsedAt = isoNow();
		record.closed = false;
		record.closedAt = void 0;
		record.protocolVersion = owner.client.initializeResult?.protocolVersion;
		record.agentCapabilities = owner.client.initializeResult?.agentCapabilities;
		applyLifecycleSnapshotToRecord(record, owner.client.getAgentLifecycleSnapshot());
	}
	async finishBufferedOwnerControl(owner, record) {
		const projection = owner.projection;
		if (projection) projection.acpxState = cloneSessionAcpxState(record.acpx);
		owner.bufferSessionUpdates = false;
		this.drainPendingSessionUpdates(owner);
		if (projection) {
			record.acpx = projection.acpxState;
			applyConversation(record, projection.conversation);
			await projection.checkpoint.flush();
		}
	}
	async ensureSession(input) {
		return await this.withEnsureSessionLock(input, async () => this.ensureSessionWithOwnership(input));
	}
	async withEnsureSessionLock(input, run) {
		const key = `${input.mode}\0${input.sessionKey}`;
		return await this.withManagerLock(this.ensureSessionLocks, key, run);
	}
	async withManagerLock(locks, key, run) {
		const previous = locks.get(key) ?? Promise.resolve();
		let release;
		const gate = new Promise((resolve) => {
			release = resolve;
		});
		const tail = previous.then(() => gate);
		locks.set(key, tail);
		await previous;
		try {
			return await run();
		} finally {
			release();
			if (locks.get(key) === tail) locks.delete(key);
		}
	}
	async ensureSessionWithOwnership(input) {
		const cwd = path.resolve(input.cwd?.trim() || this.options.cwd);
		const { agentCommand, agentArgv } = normalizeAgentCommandInput(this.options.agentRegistry.resolve(input.agent));
		const agent = {
			cwd,
			agentCommand,
			agentArgv
		};
		const existing = await this.loadExistingRuntimeSession(input);
		if (existing && this.canReuseRuntimeSession(input, agent, existing)) return await this.reuseRuntimeSession(existing.record);
		await this.closeConflictingPersistentSession(input, existing?.owner);
		return await this.createOwnedRuntimeSession(input, agent);
	}
	async loadExistingRuntimeSession(input) {
		const existingRecordId = input.mode === "persistent" ? input.sessionKey : this.pendingOneShotRecordIds.get(input.sessionKey);
		if (!existingRecordId) return;
		let record = await this.options.sessionStore.load(existingRecordId);
		if (!record) return;
		const owner = this.retainedSessionOwners.get(record.acpxRecordId);
		if (owner) {
			await this.flushSessionOwner(owner);
			record = owner.projection?.record ?? record;
		}
		return {
			record,
			owner
		};
	}
	canReuseRuntimeSession(input, agent, existing) {
		if (!shouldReuseExistingRecord(existing.record, {
			cwd: agent.cwd,
			agentCommand: agent.agentCommand,
			agentArgv: agent.agentArgv,
			resumeSessionId: input.resumeSessionId
		})) return false;
		if (input.mode === "persistent") return true;
		return Boolean(existing.owner && isDeepStrictEqual(sessionOptionsFromRecord(existing.record), input.sessionOptions));
	}
	async reuseRuntimeSession(record) {
		record.closed = false;
		record.closedAt = void 0;
		this.closingActiveRecords.delete(record.acpxRecordId);
		await this.options.sessionStore.save(record);
		return record;
	}
	async closeConflictingPersistentSession(input, owner) {
		if (input.mode === "persistent" && owner?.recordId) await this.closeRetainedSessionOwner(owner.recordId);
	}
	async createOwnedRuntimeSession(input, agent) {
		const { cwd, agentCommand, agentArgv } = agent;
		const client = this.createClient({
			agentCommand,
			agentArgv,
			cwd,
			mcpServers: [...this.options.mcpServers ?? []],
			permissionMode: this.options.permissionMode,
			nonInteractivePermissions: this.options.nonInteractivePermissions,
			permissionPolicy: this.options.permissionPolicy,
			onPermissionRequest: this.options.onPermissionRequest,
			elicitationModes: this.options.elicitationModes,
			verbose: this.options.verbose,
			sessionOptions: input.sessionOptions
		});
		const owner = this.createSessionOwner({
			client,
			sessionKey: input.sessionKey,
			mode: input.mode
		});
		let retained = false;
		try {
			await client.start();
			const session = await createOrLoadRuntimeSession(client, input.resumeSessionId, cwd);
			const record = await this.createAndSaveRuntimeRecord({
				input,
				client,
				agentCommand,
				agentArgv,
				cwd,
				session
			});
			this.attachIdleProjection(owner, record);
			await this.retainInitializedSessionOwner(owner, record);
			retained = true;
			return record;
		} finally {
			if (!retained) {
				client.clearEventHandlers();
				await client.close();
			}
		}
	}
	async createAndSaveRuntimeRecord(params) {
		const { input, client, agentCommand, agentArgv, cwd, session } = params;
		const record = createInitialRecord({
			recordId: createRecordId(input.sessionKey, input.mode),
			sessionName: input.sessionKey,
			sessionId: session.sessionId,
			agentCommand,
			agentArgv,
			cwd,
			agentSessionId: session.agentSessionId
		});
		this.closingActiveRecords.delete(record.acpxRecordId);
		record.protocolVersion = client.initializeResult?.protocolVersion;
		record.agentCapabilities = client.initializeResult?.agentCapabilities;
		applyConfigOptionsToRecord(record, session.sessionResult);
		const modelApplication = await applyRequestedModelIfAdvertised({
			client,
			sessionId: session.sessionId,
			requestedModel: input.sessionOptions?.model,
			models: session.sessionResult.models,
			agentCommand,
			timeoutMs: this.options.timeoutMs
		});
		applyConfigOptionsToRecord(record, modelApplication.response);
		syncAdvertisedModelState(record, modelApplication.response ? modelStateFromConfigOptions(modelApplication.response.configOptions) : session.sessionResult.models);
		if (modelApplication.applied) setCurrentModelId(record, currentModelIdFromSetModelResponse(modelApplication.response, input.sessionOptions?.model));
		applyLifecycleSnapshotToRecord(record, client.getAgentLifecycleSnapshot());
		persistSessionOptions(record, input.sessionOptions);
		await this.options.sessionStore.save(record);
		return record;
	}
	async retainInitializedSessionOwner(owner, record) {
		owner.recordId = record.acpxRecordId;
		const previousOwner = this.retainedSessionOwners.get(record.acpxRecordId);
		this.retainedSessionOwners.set(record.acpxRecordId, owner);
		if (owner.mode === "oneshot") this.pendingOneShotRecordIds.set(owner.sessionKey, record.acpxRecordId);
		if (previousOwner && previousOwner !== owner) {
			this.removeRetainedSessionOwner(previousOwner);
			await this.stopSessionOwner(previousOwner);
		}
	}
	startTurn(input) {
		let promptInput;
		try {
			promptInput = toPromptInput(input.text, input.attachments);
		} catch (error) {
			this.closeRetainedOneShotHandle(input.handle).catch(() => {});
			throw error;
		}
		const queue = new AsyncEventQueue();
		const result = createDeferred();
		const promptStarted = createDeferred();
		promptStarted.promise.catch(() => {});
		const sessionReady = createDeferred();
		sessionReady.promise.catch(() => {});
		let resultSettled = false;
		const state = {
			pendingCancel: false,
			turnActive: true,
			activeController: null
		};
		let streamClosed = false;
		const settleResult = (next) => {
			if (resultSettled) return;
			resultSettled = true;
			result.resolve(next);
		};
		const closeStream = () => {
			if (streamClosed) return;
			streamClosed = true;
			queue.clear();
			queue.close();
		};
		const requestCancel = async () => {
			if (state.activeController) return await state.activeController.requestCancelActivePrompt();
			if (!state.turnActive) return false;
			state.pendingCancel = true;
			return true;
		};
		const abortHandler = () => {
			requestCancel();
		};
		if (input.signal) {
			if (input.signal.aborted) {
				promptStarted.reject(/* @__PURE__ */ new Error("ACP turn cancelled before prompt submission."));
				closeStream();
				this.closeRetainedOneShotHandle(input.handle).catch(() => {}).then(() => {
					settleResult({
						status: "cancelled",
						stopReason: "cancelled"
					});
				});
				return {
					requestId: input.requestId,
					promptStarted: promptStarted.promise,
					events: queue.iterate(),
					result: result.promise,
					cancel: async () => {},
					closeStream: async () => {}
				};
			}
			input.signal.addEventListener("abort", abortHandler, { once: true });
		}
		this.runRuntimeTurnTask({
			input,
			promptInput,
			queue,
			promptStarted,
			sessionReady,
			state,
			settleResult,
			abortHandler
		});
		return {
			requestId: input.requestId,
			promptStarted: promptStarted.promise,
			events: queue.iterate(),
			result: result.promise,
			cancel: async () => {
				await requestCancel();
			},
			closeStream: async () => {
				closeStream();
			}
		};
	}
	async closeRetainedOneShotHandle(handle) {
		const recordId = handle.acpxRecordId ?? handle.sessionKey;
		if (this.retainedSessionOwners.get(recordId)?.mode === "oneshot") await this.closeRetainedSessionOwner(recordId);
	}
	async runRuntimeTurnTask(task) {
		let turn;
		let terminalResult;
		try {
			turn = await this.prepareRuntimeTurn(task);
			const { sessionId, resumed, loadError } = await this.connectRuntimeTurn(task, turn);
			await this.resolveRuntimeTurnReady(task, turn, resumed, loadError);
			if (this.cancelRuntimeTurnBeforePrompt(task)) terminalResult = {
				status: "cancelled",
				stopReason: "cancelled"
			};
			else {
				await this.applyPendingRuntimeTurnCancel(task, turn);
				const response = await this.runRuntimePrompt(task, turn, sessionId);
				await this.saveCompletedRuntimeTurn(turn, response.stopReason);
				terminalResult = {
					status: response.stopReason === "cancelled" ? "cancelled" : "completed",
					...response.stopReason ? { stopReason: response.stopReason } : {}
				};
			}
		} catch (error) {
			terminalResult = this.failRuntimeTurn(task, error);
		}
		try {
			await this.finalizeRuntimeTurn(task, turn);
		} catch (error) {
			terminalResult = this.failRuntimeTurn(task, error);
		}
		task.settleResult(terminalResult);
	}
	async runRuntimePrompt(task, turn, sessionId) {
		try {
			return await runPromptTurn({
				client: turn.client,
				sessionId,
				prompt: task.promptInput,
				timeoutMs: task.input.timeoutMs ?? this.options.timeoutMs,
				conversation: turn.conversation,
				promptMessageId: turn.promptMessageId,
				onPromptRequestStarted: () => task.promptStarted.resolve(),
				onElicitation: task.input.onElicitation
			});
		} finally {
			turn.client.endPromptElicitation?.(sessionId);
		}
	}
	async prepareRuntimeTurn(task) {
		const recordId = task.input.handle.acpxRecordId ?? task.input.handle.sessionKey;
		return await this.withManagerLock(this.runtimeOperationLocks, recordId, async () => this.prepareRuntimeTurnWithOwnership(task));
	}
	async prepareRuntimeTurnWithOwnership(task) {
		const { record, retainedOwner, conversation, acpxState, promptMessageId } = await this.prepareRuntimeTurnState(task);
		try {
			const client = retainedOwner?.client ?? this.createTurnClient(record);
			const owner = this.resolveRuntimeTurnOwner(task, record, client, retainedOwner);
			const turn = this.createRunningRuntimeTurn({
				record,
				conversation,
				acpxState,
				client,
				owner,
				pendingClient: retainedOwner?.client,
				promptMessageId
			});
			this.activateRuntimeTurn(task, turn);
			return turn;
		} catch (error) {
			this.restoreBufferedSessionOwner(retainedOwner);
			throw error;
		}
	}
	async prepareRuntimeTurnState(task) {
		const { record, retainedOwner } = await this.acquireRuntimeTurnState(task);
		const conversation = cloneSessionConversation(record);
		const acpxState = cloneSessionAcpxState(record.acpx);
		try {
			const promptStartedAt = isoNow();
			const promptMessageId = recordPromptSubmission(conversation, task.promptInput, promptStartedAt);
			trimConversationForRuntime(conversation);
			record.lastPromptAt = promptStartedAt;
			record.lastUsedAt = promptStartedAt;
			record.acpx = acpxState;
			applyConversation(record, conversation);
			await this.options.sessionStore.save(record);
			return {
				record,
				retainedOwner,
				conversation,
				acpxState,
				promptMessageId
			};
		} catch (error) {
			this.restoreBufferedSessionOwner(retainedOwner);
			throw error;
		}
	}
	async acquireRuntimeTurnState(task) {
		const recordId = task.input.handle.acpxRecordId ?? task.input.handle.sessionKey;
		let record = await this.requireRecord(recordId);
		const retainedOwner = await this.readRetainedSessionOwner(record, { consume: false });
		if (!retainedOwner) return { record };
		const projection = retainedOwner.projection;
		if (projection) record = structuredClone(projection.record);
		retainedOwner.bufferSessionUpdates = true;
		return {
			record,
			retainedOwner
		};
	}
	restoreBufferedSessionOwner(owner) {
		if (!owner) return;
		owner.bufferSessionUpdates = false;
		this.drainPendingSessionUpdates(owner);
	}
	resolveRuntimeTurnOwner(task, record, client, retainedOwner) {
		return retainedOwner ?? this.createSessionOwner({
			client,
			sessionKey: record.name ?? task.input.handle.sessionKey,
			mode: task.input.sessionMode
		});
	}
	createRunningRuntimeTurn(input) {
		const { record, conversation, acpxState, client, owner, pendingClient, promptMessageId } = input;
		const turn = {
			record,
			conversation,
			acpxState,
			liveCheckpoint: this.createRuntimeTurnCheckpoint(record, conversation, () => turn.acpxState),
			client,
			owner,
			pendingClient,
			connectionUpdates: pendingClient ? void 0 : [],
			promptMessageId,
			activeSessionId: record.acpSessionId
		};
		return turn;
	}
	activateRuntimeTurn(task, turn) {
		const { owner, record } = turn;
		this.removeRetainedSessionOwner(owner);
		owner.recordId = record.acpxRecordId;
		task.state.activeController = this.buildRuntimeTurnController(task, turn);
		this.activeControllers.set(record.acpxRecordId, task.state.activeController);
		owner.projection = void 0;
		owner.activeTurn = {
			task,
			turn
		};
		owner.bufferSessionUpdates = false;
		this.drainPendingSessionUpdates(owner);
	}
	createTurnClient(record) {
		return this.createClient({
			agentCommand: record.agentCommand,
			agentArgv: record.agentArgv,
			cwd: record.cwd,
			mcpServers: [...this.options.mcpServers ?? []],
			permissionMode: this.options.permissionMode,
			nonInteractivePermissions: this.options.nonInteractivePermissions,
			permissionPolicy: this.options.permissionPolicy,
			onPermissionRequest: this.options.onPermissionRequest,
			elicitationModes: this.options.elicitationModes,
			verbose: this.options.verbose,
			sessionOptions: sessionOptionsFromRecord(record)
		});
	}
	createRuntimeTurnCheckpoint(record, conversation, readAcpxState) {
		return new LiveSessionCheckpoint({ save: async () => {
			record.lastUsedAt = isoNow();
			record.acpx = readAcpxState();
			applyConversation(record, conversation);
			await this.refreshClosedState(record);
			await this.options.sessionStore.save(record);
		} });
	}
	buildRuntimeTurnController(task, turn) {
		return {
			hasActivePrompt: () => turn.client.hasActivePrompt(),
			requestCancelActivePrompt: async () => await this.requestRuntimeTurnCancel(task, turn),
			setSessionMode: async (modeId) => {
				await this.waitForRuntimeControlSession(task, turn);
				await turn.client.setSessionMode(turn.activeSessionId, modeId);
				const nextState = cloneSessionAcpxState(turn.acpxState) ?? {};
				nextState.desired_mode_id = modeId;
				turn.acpxState = nextState;
			},
			setSessionModel: async (modelId) => {
				await this.waitForRuntimeControlSession(task, turn);
				const models = advertisedModelState(turn.acpxState);
				const response = await turn.client.setSessionModel(turn.activeSessionId, modelId, models);
				applyConfigOptionResponseToTurn(turn, response);
				const nextState = cloneSessionAcpxState(turn.acpxState) ?? {};
				nextState.session_options = {
					...nextState.session_options,
					model: modelId
				};
				nextState.current_model_id = currentModelIdFromSetModelResponse(response, modelId);
				clearDesiredConfigOption(nextState, models?.configId);
				turn.acpxState = nextState;
				return response;
			},
			setSessionConfigOption: async (configId, value) => {
				return (await task.state.activeController.setResolvedSessionConfigOption(configId, value)).response;
			},
			setResolvedSessionConfigOption: async (configId, value) => await this.setRuntimeResolvedSessionConfigOption(task, turn, configId, value)
		};
	}
	async waitForRuntimeControlSession(task, turn) {
		if (turn.client.hasActivePrompt()) return;
		await task.sessionReady.promise;
	}
	async requestRuntimeTurnCancel(task, turn) {
		if (turn.client.hasActivePrompt()) return await turn.client.requestCancelActivePrompt();
		if (!task.state.turnActive) return false;
		task.state.pendingCancel = true;
		return true;
	}
	async setRuntimeResolvedSessionConfigOption(task, turn, configId, value) {
		await this.waitForRuntimeControlSession(task, turn);
		const resolvedConfigId = resolveSupportedConfigOptionId({
			...turn.record,
			acpx: turn.acpxState ?? void 0
		}, configId);
		const response = await turn.client.setSessionConfigOption(turn.activeSessionId, resolvedConfigId, value);
		this.applyRuntimeConfigOptionState(turn, resolvedConfigId, value, response);
		return {
			configId: resolvedConfigId,
			response
		};
	}
	applyRuntimeConfigOptionState(turn, configId, value, response) {
		applyConfigOptionResponseToTurn(turn, response);
		applyDesiredConfigOptionToTurn(turn, configId, value);
	}
	emitRuntimeTurnEvent(task, payload) {
		const parsed = parsePromptEventLine(JSON.stringify(payload));
		if (!parsed) return;
		task.queue.push(parsed);
	}
	async connectRuntimeTurn(task, turn) {
		const loaded = turn.pendingClient ? {
			sessionId: turn.record.acpSessionId,
			resumed: false,
			loadError: void 0
		} : await this.connectRuntimeTurnClient(task, turn);
		this.drainRuntimeConnectionUpdates(turn);
		return loaded;
	}
	drainRuntimeConnectionUpdates(turn) {
		if (!turn.connectionUpdates) return;
		turn.acpxState = cloneSessionAcpxState(turn.record.acpx);
		for (const notification of turn.connectionUpdates) turn.acpxState = recordSessionUpdate(turn.conversation, turn.acpxState, notification);
		turn.connectionUpdates = void 0;
		trimConversationForRuntime(turn.conversation);
		turn.liveCheckpoint.request();
	}
	async connectRuntimeTurnClient(task, turn) {
		return await connectAndLoadSession({
			client: turn.client,
			record: turn.record,
			resumePolicy: resumePolicyForSessionMode(task.input.sessionMode),
			timeoutMs: this.options.timeoutMs,
			activeController: task.state.activeController,
			onClientAvailable: () => this.publishRuntimeTurnController(task, turn),
			onConnectedRecord: (connectedRecord) => {
				connectedRecord.lastPromptAt = isoNow();
			},
			onSessionIdResolved: (sessionIdValue) => {
				turn.activeSessionId = sessionIdValue;
			}
		});
	}
	publishRuntimeTurnController(task, turn) {
		const controller = task.state.activeController;
		if (controller) this.activeControllers.set(turn.record.acpxRecordId, controller);
	}
	async resolveRuntimeTurnReady(task, turn, resumed, loadError) {
		task.sessionReady.resolve();
		turn.record.lastRequestId = task.input.requestId;
		turn.record.lastPromptAt = isoNow();
		turn.record.closed = false;
		turn.record.closedAt = void 0;
		turn.record.lastUsedAt = isoNow();
		await turn.liveCheckpoint.checkpoint();
		this.emitRuntimeTurnLoadStatus(task, resumed, loadError);
	}
	emitRuntimeTurnLoadStatus(task, resumed, loadError) {
		if (!resumed && !loadError) return;
		this.emitRuntimeTurnEvent(task, {
			type: "status",
			text: loadError ? `session reconnect fallback: ${loadError}` : "session resumed"
		});
	}
	cancelRuntimeTurnBeforePrompt(task) {
		if (!task.state.pendingCancel && !task.input.signal?.aborted) return false;
		task.state.pendingCancel = false;
		task.promptStarted.reject(/* @__PURE__ */ new Error("ACP turn cancelled before prompt submission."));
		return true;
	}
	async applyPendingRuntimeTurnCancel(task, turn) {
		if (!task.state.pendingCancel || !turn.client.hasActivePrompt()) return false;
		const cancelled = await turn.client.requestCancelActivePrompt();
		if (cancelled) task.state.pendingCancel = false;
		return cancelled;
	}
	async saveCompletedRuntimeTurn(turn, _stopReason) {
		turn.record.acpSessionId = turn.activeSessionId;
		reconcileAgentSessionId(turn.record, turn.record.agentSessionId);
		turn.record.protocolVersion = turn.client.initializeResult?.protocolVersion;
		turn.record.agentCapabilities = turn.client.initializeResult?.agentCapabilities;
		turn.record.acpx = turn.acpxState;
		applyConversation(turn.record, turn.conversation);
		applyLifecycleSnapshotToRecord(turn.record, turn.client.getAgentLifecycleSnapshot());
		await this.options.sessionStore.save(turn.record);
	}
	failRuntimeTurn(task, error) {
		task.promptStarted.reject(error);
		task.sessionReady.reject(error);
		const normalized = normalizeOutputError(error, { origin: "runtime" });
		return {
			status: "failed",
			error: {
				message: normalized.message,
				...normalized.code ? { code: normalized.code } : {},
				...normalized.detailCode ? { detailCode: normalized.detailCode } : {},
				...normalized.retryable !== void 0 ? { retryable: normalized.retryable } : {}
			}
		};
	}
	async finalizeRuntimeTurn(task, turn) {
		task.state.turnActive = false;
		const abortHandlerAttempt = await settleAttempt(() => task.input.signal?.removeEventListener("abort", task.abortHandler));
		const recordAttempt = await settleAttempt(async () => turn ? await this.finalizeRuntimeTurnRecord(turn) : false);
		let failure = firstFailedAttempt([abortHandlerAttempt, recordAttempt]);
		let pooled = recordAttempt.ok ? recordAttempt.value : false;
		if (failure) {
			this.discardRetainedRuntimeTurnOwner(turn);
			pooled = false;
		}
		const closeAttempt = await settleAttempt(async () => this.closeRuntimeTurnClient(turn, pooled));
		this.cleanupRuntimeTurn(task, turn);
		failure ??= firstFailedAttempt([closeAttempt]);
		if (failure) throw failure.error;
	}
	discardRetainedRuntimeTurnOwner(turn) {
		if (turn) {
			this.removeRetainedSessionOwner(turn.owner);
			turn.owner.activeTurn = void 0;
		}
	}
	async closeRuntimeTurnClient(turn, pooled) {
		if (!turn || pooled) return;
		turn.owner.activeTurn = void 0;
		const failure = firstFailedAttempt([await settleAttempt(() => turn.client.clearEventHandlers()), await settleAttempt(async () => turn.client.close())]);
		if (failure) throw failure.error;
	}
	cleanupRuntimeTurn(task, turn) {
		if (turn) {
			this.activeControllers.delete(turn.record.acpxRecordId);
			this.closingActiveRecords.delete(turn.record.acpxRecordId);
		}
		task.queue.close();
	}
	async finalizeRuntimeTurnRecord(turn) {
		this.drainRuntimeConnectionUpdates(turn);
		applyLifecycleSnapshotToRecord(turn.record, turn.client.getAgentLifecycleSnapshot());
		turn.record.acpx = turn.acpxState;
		applyConversation(turn.record, turn.conversation);
		turn.record.lastUsedAt = isoNow();
		await turn.liveCheckpoint.flush();
		const closed = await this.refreshClosedState(turn.record);
		await this.options.sessionStore.save(turn.record);
		if (closed) return false;
		return await this.retainPersistentSessionOwnerAfterTurn({
			record: turn.record,
			owner: turn.owner,
			conversation: turn.conversation,
			acpxState: turn.acpxState
		});
	}
	async *runTurn(input) {
		const turn = this.startTurn(input);
		yield* turn.events;
		yield legacyTerminalEventFromTurnResult(await turn.result);
	}
	async getStatus(handle) {
		const recordId = handle.acpxRecordId ?? handle.sessionKey;
		const owner = this.retainedSessionOwners.get(recordId);
		if (owner) await this.flushSessionOwner(owner);
		const record = await this.requireRecord(recordId);
		return {
			summary: statusSummary(record),
			acpxRecordId: record.acpxRecordId,
			backendSessionId: record.acpSessionId,
			agentSessionId: record.agentSessionId,
			...buildModelsField(record),
			...buildUsageField(record),
			...buildAvailableCommandsField(record),
			details: {
				cwd: record.cwd,
				lastUsedAt: record.lastUsedAt,
				closed: record.closed === true,
				...record.acpx?.config_options !== void 0 ? { configOptions: structuredClone(record.acpx.config_options) } : {}
			}
		};
	}
	async setMode(handle, mode, sessionMode = "persistent") {
		const recordId = handle.acpxRecordId ?? handle.sessionKey;
		await this.withManagerLock(this.runtimeOperationLocks, recordId, async () => this.setModeWithOwnership(handle, mode, sessionMode));
	}
	async setModeWithOwnership(handle, mode, sessionMode) {
		const record = await this.requireRecord(handle.acpxRecordId ?? handle.sessionKey);
		const controller = this.activeControllers.get(record.acpxRecordId);
		let targetRecord = record;
		if (controller) await controller.setSessionMode(mode);
		else targetRecord = (await this.withRuntimeControlSession(record, sessionMode, async ({ client, sessionId }) => {
			await client.setSessionMode(sessionId, mode);
		})).record;
		setDesiredModeId(targetRecord, mode);
		await this.options.sessionStore.save(targetRecord);
	}
	async setConfigOption(handle, key, value, sessionMode = "persistent") {
		const recordId = handle.acpxRecordId ?? handle.sessionKey;
		await this.withManagerLock(this.runtimeOperationLocks, recordId, async () => this.setConfigOptionWithOwnership(handle, key, value, sessionMode));
	}
	async setConfigOptionWithOwnership(handle, key, value, sessionMode) {
		const record = await this.requireRecord(handle.acpxRecordId ?? handle.sessionKey);
		const controller = this.activeControllers.get(record.acpxRecordId);
		if (controller) {
			const { configId, response } = await controller.setResolvedSessionConfigOption(key, value);
			applyConfigOptionsToRecord(record, response);
			applyDesiredConfigOptionToRecord(record, configId, value);
			await this.options.sessionStore.save(record);
			return;
		}
		const result = await this.withRuntimeControlSession(record, sessionMode, async ({ client, sessionId, record: connectedRecord }) => {
			const configId = resolveSupportedConfigOptionId(connectedRecord, key);
			applyConfigOptionsToRecord(connectedRecord, await client.setSessionConfigOption(sessionId, configId, value));
			applyDesiredConfigOptionToRecord(connectedRecord, configId, value);
		});
		await this.options.sessionStore.save(result.record);
	}
	async cancel(handle) {
		await this.activeControllers.get(handle.acpxRecordId ?? handle.sessionKey)?.requestCancelActivePrompt();
	}
	async close(handle, options = {}) {
		const recordId = handle.acpxRecordId ?? handle.sessionKey;
		const record = await this.resolveRuntimeRecordForClose(recordId);
		this.markActiveRuntimeRecordClosing(record);
		await this.cancel(handle);
		await this.closeRuntimeRecordOwnership(record, options.discardPersistentState === true);
		record.closed = true;
		record.closedAt = isoNow();
		await this.options.sessionStore.save(record);
	}
	async resolveRuntimeRecordForClose(recordId) {
		const retainedOwner = this.retainedSessionOwners.get(recordId);
		if (retainedOwner) await this.flushSessionOwner(retainedOwner);
		return retainedOwner?.projection?.record ?? await this.requireRecord(recordId);
	}
	markActiveRuntimeRecordClosing(record) {
		if (this.activeControllers.has(record.acpxRecordId)) this.closingActiveRecords.add(record.acpxRecordId);
	}
	async closeRuntimeRecordOwnership(record, discardPersistentState) {
		if (discardPersistentState) {
			await this.closeBackendSession(record);
			record.acpx = {
				...record.acpx,
				reset_on_next_ensure: true
			};
		} else await this.closeRetainedSessionOwner(record.acpxRecordId);
	}
	async closeBackendSession(record) {
		const connection = await this.acquireBackendCloseConnection(record);
		try {
			await this.requestBackendSessionClose(record, connection);
		} catch (error) {
			this.handleBackendSessionCloseError(record, error);
		} finally {
			await this.finalizeBackendCloseConnection(connection);
		}
	}
	async finalizeBackendCloseConnection(connection) {
		const failure = firstFailedAttempt([
			await settleAttempt(async () => {
				if (connection.owner) await this.flushSessionOwner(connection.owner);
			}),
			await settleAttempt(() => connection.owner?.client.clearEventHandlers()),
			await settleAttempt(async () => connection.client.close())
		]);
		if (failure) throw failure.error;
	}
	async acquireBackendCloseConnection(record) {
		const owner = await this.readRetainedSessionOwner(record, { consume: true });
		if (owner) return {
			client: owner.client,
			owner
		};
		return { client: this.createClient({
			agentCommand: record.agentCommand,
			agentArgv: record.agentArgv,
			cwd: record.cwd,
			mcpServers: [...this.options.mcpServers ?? []],
			permissionMode: this.options.permissionMode,
			nonInteractivePermissions: this.options.nonInteractivePermissions,
			permissionPolicy: this.options.permissionPolicy,
			onPermissionRequest: this.options.onPermissionRequest,
			elicitationModes: this.options.elicitationModes,
			verbose: this.options.verbose
		}) };
	}
	async requestBackendSessionClose(record, connection) {
		if (!connection.owner) await withTimeout(connection.client.start(), this.options.timeoutMs);
		if (!connection.client.supportsCloseSession()) throw new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", `Agent does not support session/close for ${record.acpxRecordId}.`);
		await withTimeout(connection.client.closeSession(record.acpSessionId), this.options.timeoutMs);
	}
	handleBackendSessionCloseError(record, error) {
		if (isAcpResourceNotFoundError(error)) return;
		if (isUnsupportedSessionCloseError(error)) throw new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", `Agent does not support session/close for ${record.acpxRecordId}.`, { cause: error });
		throw error;
	}
	async requireRecord(sessionId) {
		const record = await this.options.sessionStore.load(sessionId);
		if (!record) throw new Error(`ACP session not found: ${sessionId}`);
		return record;
	}
};
function safeSessionId(sessionId) {
	return encodeURIComponent(sessionId);
}
var FileSessionStore = class {
	stateDir;
	constructor(stateDir) {
		this.stateDir = stateDir;
	}
	get sessionDir() {
		return path.join(this.stateDir, "sessions");
	}
	filePath(sessionId) {
		return path.join(this.sessionDir, `${safeSessionId(sessionId)}.json`);
	}
	async ensureDir() {
		await fs$1.mkdir(this.sessionDir, { recursive: true });
	}
	async load(sessionId) {
		await this.ensureDir();
		let payload;
		try {
			payload = await fs$1.readFile(this.filePath(sessionId), "utf8");
		} catch (error) {
			if (error.code === "ENOENT") return;
			throw error;
		}
		let parsed;
		try {
			parsed = JSON.parse(payload);
		} catch {
			return;
		}
		return parseSessionRecord(parsed) ?? void 0;
	}
	async save(record) {
		await this.ensureDir();
		const persisted = serializeSessionRecordForDisk(record);
		assertPersistedKeyPolicy(persisted);
		const file = this.filePath(record.acpxRecordId);
		const tempFile = createAtomicWriteTempPath(file);
		const payload = JSON.stringify(persisted, null, 2);
		await fs$1.writeFile(tempFile, `${payload}\n`, "utf8");
		await fs$1.rename(tempFile, file);
	}
};
function createFileSessionStore(options) {
	return new FileSessionStore(path.resolve(options.stateDir));
}
const ACPX_RUNTIME_HANDLE_PREFIX = "acpx:v2:";
function encodeAcpxRuntimeHandleState(state) {
	const payload = Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
	return `${ACPX_RUNTIME_HANDLE_PREFIX}${payload}`;
}
function decodeAcpxRuntimeHandleState(runtimeSessionName) {
	const trimmed = runtimeSessionName.trim();
	if (!trimmed.startsWith(ACPX_RUNTIME_HANDLE_PREFIX)) return null;
	try {
		const raw = Buffer.from(trimmed.slice(8), "base64url").toString("utf8");
		const parsed = JSON.parse(raw);
		const name = asOptionalString(parsed.name);
		const agent = asOptionalString(parsed.agent);
		const cwd = asOptionalString(parsed.cwd);
		const mode = asOptionalString(parsed.mode);
		if (!name || !agent || !cwd || mode !== "persistent" && mode !== "oneshot") return null;
		return {
			name,
			agent,
			cwd,
			mode,
			acpxRecordId: asOptionalString(parsed.acpxRecordId),
			backendSessionId: asOptionalString(parsed.backendSessionId),
			agentSessionId: asOptionalString(parsed.agentSessionId)
		};
	} catch {
		return null;
	}
}
function writeHandleState(handle, state) {
	handle.runtimeSessionName = encodeAcpxRuntimeHandleState(state);
	handle.cwd = state.cwd;
	handle.acpxRecordId = state.acpxRecordId;
	handle.backendSessionId = state.backendSessionId;
	handle.agentSessionId = state.agentSessionId;
}
function isPrimitiveDetail(value) {
	return value == null || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol";
}
function formatFunctionDetail(value) {
	return value.name ? `[Function ${value.name}]` : "[Function]";
}
function serializeRuntimeDetail(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	return JSON.stringify(value, (_key, nested) => {
		if (nested instanceof Error) return nested.message || nested.name;
		if (nested && typeof nested === "object") {
			if (seen.has(nested)) return "[Circular]";
			seen.add(nested);
		}
		return nested;
	}) ?? "undefined";
}
function formatRuntimeDetail(value) {
	if (value instanceof Error) return value.message || value.name;
	if (typeof value === "string") return value;
	if (isPrimitiveDetail(value)) return String(value);
	if (typeof value === "function") return formatFunctionDetail(value);
	try {
		return serializeRuntimeDetail(value);
	} catch {
		return "unserializable object";
	}
}
function normalizeRuntimeDetails(details) {
	return details?.map((detail) => formatRuntimeDetail(detail));
}
async function probeRuntime(options, deps = {}) {
	const agentName = options.probeAgent?.trim() || "codex";
	const agentCommand = normalizeAgentCommandInput(options.agentRegistry.resolve(agentName));
	const client = createProbeClient(options, agentCommand, deps);
	try {
		await client.start();
		return {
			ok: true,
			message: "embedded ACP runtime ready",
			details: [
				`agent=${agentName}`,
				`command=${agentCommand.agentCommand}`,
				`cwd=${options.cwd}`,
				...client.initializeResult?.protocolVersion ? [`protocolVersion=${client.initializeResult.protocolVersion}`] : []
			]
		};
	} catch (error) {
		return {
			ok: false,
			message: "embedded ACP runtime probe failed",
			details: [
				`agent=${agentName}`,
				`command=${agentCommand.agentCommand}`,
				`cwd=${options.cwd}`,
				formatRuntimeDetail(error)
			]
		};
	} finally {
		await client.close().catch(() => {});
	}
}
function createProbeClient(options, agentCommand, deps) {
	const clientOptions = {
		...agentCommand,
		cwd: options.cwd,
		mcpServers: [...options.mcpServers ?? []],
		permissionMode: options.permissionMode,
		nonInteractivePermissions: options.nonInteractivePermissions,
		permissionPolicy: options.permissionPolicy,
		verbose: options.verbose
	};
	return deps.clientFactory?.(clientOptions) ?? new AcpClient(clientOptions);
}
const ACPX_BACKEND_ID = "acpx";
const ACPX_CAPABILITIES = { controls: [
	"session/set_mode",
	"session/set_config_option",
	"session/status"
] };
function createAgentRegistry(params) {
	const overrides = normalizeRegistryOverrides(params?.overrides);
	return {
		resolve(agentName) {
			const normalizedAgentName = normalizeAgentName$1(agentName);
			return overrides[normalizedAgentName] ?? overrides[resolveCanonicalAgentName(agentName)] ?? resolveAgentArgv(agentName) ?? resolveAgentCommand$1(agentName);
		},
		list() {
			return listBuiltInAgents(overrides);
		}
	};
}
function normalizeRegistryOverrides(values) {
	const normalized = {};
	for (const [name, value] of Object.entries(values ?? {})) {
		const normalizedName = normalizeAgentName$1(name);
		if (!normalizedName) continue;
		const normalizedValue = normalizeRegistryOverride(value);
		if (normalizedValue) normalized[normalizedName] = normalizedValue;
	}
	return normalized;
}
function normalizeRegistryOverride(value) {
	if (typeof value === "string") return value.trim() || void 0;
	return value.length > 0 && value[0]?.length ? [...value] : void 0;
}
var AcpxRuntime$1 = class {
	options;
	testOptions;
	healthy = false;
	manager = null;
	managerPromise = null;
	constructor(options, testOptions) {
		this.options = options;
		this.testOptions = testOptions;
	}
	isHealthy() {
		return this.healthy;
	}
	async probeAvailability() {
		const report = await this.runProbe();
		this.healthy = report.ok;
	}
	async doctor() {
		const report = await this.runProbe();
		this.healthy = report.ok;
		return {
			ok: report.ok,
			code: report.ok ? void 0 : "ACP_BACKEND_UNAVAILABLE",
			message: report.message,
			details: normalizeRuntimeDetails(report.details)
		};
	}
	async ensureSession(input) {
		const sessionName = input.sessionKey.trim();
		if (!sessionName) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
		const agent = input.agent.trim();
		if (!agent) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP agent id is required.");
		const record = await (await this.getManager()).ensureSession({
			sessionKey: sessionName,
			agent,
			mode: input.mode,
			cwd: input.cwd ?? this.options.cwd,
			resumeSessionId: input.resumeSessionId,
			sessionOptions: input.sessionOptions
		});
		const handle = {
			sessionKey: input.sessionKey,
			backend: ACPX_BACKEND_ID,
			runtimeSessionName: "",
			cwd: record.cwd,
			acpxRecordId: record.acpxRecordId,
			backendSessionId: record.acpSessionId,
			agentSessionId: record.agentSessionId
		};
		writeHandleState(handle, {
			name: sessionName,
			agent,
			cwd: record.cwd,
			mode: input.mode,
			acpxRecordId: record.acpxRecordId,
			backendSessionId: record.acpSessionId,
			agentSessionId: record.agentSessionId
		});
		return handle;
	}
	startTurn(input) {
		const { handle, state } = this.resolveManagerHandle(input.handle);
		const turnPromise = this.getManager().then((manager) => manager.startTurn({
			handle,
			text: input.text,
			attachments: input.attachments,
			mode: input.mode,
			sessionMode: state.mode,
			requestId: input.requestId,
			timeoutMs: input.timeoutMs,
			signal: input.signal,
			onElicitation: input.onElicitation
		}));
		return {
			requestId: input.requestId,
			get promptStarted() {
				return turnPromise.then((turn) => turn.promptStarted);
			},
			events: { async *[Symbol.asyncIterator]() {
				yield* (await turnPromise).events;
			} },
			get result() {
				return turnPromise.then((turn) => turn.result);
			},
			cancel(inputArgs) {
				return turnPromise.then((turn) => turn.cancel(inputArgs));
			},
			closeStream(inputArgs) {
				return turnPromise.then((turn) => turn.closeStream(inputArgs));
			}
		};
	}
	async *runTurn(input) {
		const { handle, state } = this.resolveManagerHandle(input.handle);
		yield* (await this.getManager()).runTurn({
			handle,
			text: input.text,
			attachments: input.attachments,
			mode: input.mode,
			sessionMode: state.mode,
			requestId: input.requestId,
			timeoutMs: input.timeoutMs,
			signal: input.signal,
			onElicitation: input.onElicitation
		});
	}
	async getCapabilities(input) {
		if (!input?.handle) return ACPX_CAPABILITIES;
		const { handle } = this.resolveManagerHandle(input.handle);
		const record = await this.options.sessionStore.load(handle.acpxRecordId ?? handle.sessionKey);
		if (!record?.acpx?.config_options) return ACPX_CAPABILITIES;
		const configOptionKeys = Array.from(new Set(record.acpx.config_options.map((option) => option.id).filter((id) => typeof id === "string" && id.trim().length > 0)));
		return {
			...ACPX_CAPABILITIES,
			...configOptionKeys.length > 0 ? { configOptionKeys } : {}
		};
	}
	async getStatus(input) {
		const { handle } = this.resolveManagerHandle(input.handle);
		return await (await this.getManager()).getStatus(handle);
	}
	async setMode(input) {
		const { handle, state } = this.resolveManagerHandle(input.handle);
		await (await this.getManager()).setMode(handle, input.mode, state.mode);
	}
	async setConfigOption(input) {
		const { handle, state } = this.resolveManagerHandle(input.handle);
		await (await this.getManager()).setConfigOption(handle, input.key, input.value, state.mode);
	}
	async cancel(input) {
		const { handle } = this.resolveManagerHandle(input.handle);
		await (await this.getManager()).cancel(handle);
	}
	async close(input) {
		const { handle } = this.resolveManagerHandle(input.handle);
		await (await this.getManager()).close(handle, { discardPersistentState: input.discardPersistentState });
	}
	async getManager() {
		if (this.manager) return this.manager;
		if (!this.managerPromise) this.managerPromise = Promise.resolve(this.testOptions?.managerFactory?.(this.options) ?? new AcpRuntimeManager(this.options)).then((manager) => {
			this.manager = manager;
			return manager;
		});
		return await this.managerPromise;
	}
	async runProbe() {
		return await (this.testOptions?.probeRunner?.(this.options) ?? probeRuntime(this.options));
	}
	resolveManagerHandle(handle) {
		const state = this.resolveHandleState(handle);
		return {
			handle: {
				...handle,
				acpxRecordId: state.acpxRecordId ?? handle.acpxRecordId ?? handle.sessionKey
			},
			state
		};
	}
	resolveHandleState(handle) {
		const decoded = decodeAcpxRuntimeHandleState(handle.runtimeSessionName);
		if (decoded) return {
			...decoded,
			acpxRecordId: decoded.acpxRecordId ?? handle.acpxRecordId,
			backendSessionId: decoded.backendSessionId ?? handle.backendSessionId,
			agentSessionId: decoded.agentSessionId ?? handle.agentSessionId
		};
		const runtimeSessionName = handle.runtimeSessionName.trim();
		if (!runtimeSessionName) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "Invalid embedded ACP runtime handle: runtimeSessionName is missing.");
		return {
			name: runtimeSessionName,
			agent: deriveAgentFromSessionKey(handle.sessionKey, DEFAULT_AGENT_NAME),
			cwd: handle.cwd ?? this.options.cwd,
			mode: "persistent",
			acpxRecordId: handle.acpxRecordId,
			backendSessionId: handle.backendSessionId,
			agentSessionId: handle.agentSessionId
		};
	}
};
function createAcpRuntime(options) {
	return new AcpxRuntime$1(options);
}
//#endregion
//#region extensions/acpx/src/runtime.ts
/**
* OpenClaw ACPX runtime adapter. It wraps the upstream acpx runtime with
* OpenClaw session metadata, lease tracking, model scoping, and cleanup policy.
*/
const ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME = "openclaw-plugin-tools";
const ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME = "openclaw-tools";
const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
function withOpenClawManagedTurnTimeout(input) {
	return {
		...input,
		timeoutMs: 0
	};
}
function withOpenClawLeaseSessionMetadata(record, metadata) {
	return {
		...record,
		openclawLeaseId: metadata.openclawLeaseId,
		openclawGatewayInstanceId: metadata.openclawGatewayInstanceId
	};
}
const CODEX_WRAPPER_STDERR_LOG_PREFIX = "codex-acp-wrapper.stderr";
function safeDiagnosticFilePart(value) {
	return value.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120) || "unknown";
}
function codexWrapperStderrLogFileName(leaseId) {
	return `${CODEX_WRAPPER_STDERR_LOG_PREFIX}.${safeDiagnosticFilePart(leaseId)}.log`;
}
function compactDiagnosticText(value) {
	return value.replace(/\s+/g, " ").trim();
}
function isGenericInternalAcpErrorMessage(message) {
	return message.trim() === "Internal error";
}
function isGenericInternalAcpError(error) {
	if (!(error instanceof Error)) return false;
	return isGenericInternalAcpErrorMessage(error.message);
}
async function readCodexWrapperStderrTail(params) {
	if (!params.wrapperRoot || !params.leaseId) return "";
	try {
		return compactDiagnosticText(redactSensitiveText(sliceUtf16Safe(await fs$1.readFile(path.join(params.wrapperRoot, codexWrapperStderrLogFileName(params.leaseId)), "utf8"), -6e3)));
	} catch {
		return "";
	}
}
function readSessionRecordName(record) {
	if (typeof record !== "object" || record === null) return "";
	const { name } = record;
	return typeof name === "string" ? name.trim() : "";
}
function readRecordAgentCommand(record) {
	if (typeof record !== "object" || record === null) return;
	const { agentCommand } = record;
	return typeof agentCommand === "string" ? agentCommand.trim() || void 0 : void 0;
}
function readRecordCwd(record) {
	if (typeof record !== "object" || record === null) return;
	const { cwd } = record;
	return typeof cwd === "string" ? cwd.trim() || void 0 : void 0;
}
function readRecordResetOnNextEnsure(record) {
	if (typeof record !== "object" || record === null) return false;
	const { acpx } = record;
	if (typeof acpx !== "object" || acpx === null) return false;
	return acpx.reset_on_next_ensure === true;
}
function readRecordAgentPid(record) {
	if (typeof record !== "object" || record === null) return;
	const { pid, processId } = record;
	const rawPid = pid ?? processId;
	const numericPid = typeof rawPid === "number" ? rawPid : typeof rawPid === "string" ? parseStrictPositiveInteger(rawPid) : void 0;
	return numericPid && Number.isInteger(numericPid) && numericPid > 0 ? numericPid : void 0;
}
function readOpenClawLeaseIdFromRecord(record) {
	if (typeof record !== "object" || record === null) return;
	const { openclawLeaseId } = record;
	return typeof openclawLeaseId === "string" ? openclawLeaseId.trim() || void 0 : void 0;
}
function readOpenClawGatewayInstanceIdFromRecord(record) {
	if (typeof record !== "object" || record === null) return;
	const { openclawGatewayInstanceId } = record;
	return typeof openclawGatewayInstanceId === "string" ? openclawGatewayInstanceId.trim() || void 0 : void 0;
}
function extractGeneratedWrapperPath(command) {
	return splitCommandParts(command ?? "").find((part) => basename$1(part) === "codex-acp-wrapper.mjs" || basename$1(part) === "claude-agent-acp-wrapper.mjs") ?? "";
}
function selectCurrentSessionLease(params) {
	const sessionKeys = new Set(normalizeStringEntries(params.sessionKeys));
	const candidates = params.leases.filter((lease) => sessionKeys.has(lease.sessionKey));
	if (params.rootPid) return candidates.find((lease) => lease.rootPid === params.rootPid);
	let selected;
	for (const lease of candidates) if (!selected || lease.startedAt > selected.startedAt) selected = lease;
	return selected;
}
function createResetAwareSessionStore(baseStore, params) {
	const freshSessionKeys = /* @__PURE__ */ new Set();
	return {
		async load(sessionId) {
			const normalized = sessionId.trim();
			if (normalized && freshSessionKeys.has(normalized)) return;
			const record = await baseStore.load(sessionId);
			if (!record || !params?.leaseStore || !params.gatewayInstanceId) return record;
			const sessionName = readSessionRecordName(record) || normalized;
			const lease = selectCurrentSessionLease({
				leases: await params.leaseStore.listOpen(params.gatewayInstanceId),
				sessionKeys: [sessionName, normalized],
				rootPid: readRecordAgentPid(record)
			});
			if (!lease) return record;
			return withOpenClawLeaseSessionMetadata(record, {
				openclawLeaseId: lease.leaseId,
				openclawGatewayInstanceId: lease.gatewayInstanceId
			});
		},
		async save(record) {
			let recordToSave = record;
			const launch = params?.launchScope?.getStore();
			const sessionName = readSessionRecordName(record);
			const agentCommand = readRecordAgentCommand(record);
			const leasedCommand = launch?.leasedCommand ?? agentCommand;
			const leaseIdentity = launch ?? readAcpxProcessLeaseIdentity(leasedCommand);
			if (params?.leaseStore && params.gatewayInstanceId && params.wrapperRoot && (!launch || sessionName === launch.sessionKey) && leasedCommand && leaseIdentity?.gatewayInstanceId === params.gatewayInstanceId && isOpenClawLeaseAwareAcpxProcessCommand({
				command: leasedCommand,
				wrapperRoot: params.wrapperRoot
			})) {
				const existing = await params.leaseStore.load(leaseIdentity.leaseId);
				if (!existing || existing.gatewayInstanceId === leaseIdentity.gatewayInstanceId && existing.sessionKey === sessionName && existing.wrapperRoot === params.wrapperRoot) {
					const lifecycleRecord = Boolean(launch && launch.resolvedCommand !== launch.leasedCommand) ? {
						...record,
						pid: void 0,
						processId: void 0,
						agentStartedAt: void 0
					} : record;
					const rootPid = readRecordAgentPid(lifecycleRecord);
					if (rootPid) await params.leaseStore.save({
						leaseId: leaseIdentity.leaseId,
						gatewayInstanceId: leaseIdentity.gatewayInstanceId,
						sessionKey: sessionName,
						wrapperRoot: params.wrapperRoot,
						wrapperPath: extractGeneratedWrapperPath(leasedCommand),
						rootPid,
						...existing?.rootPid === rootPid && existing.processGroupId ? { processGroupId: existing.processGroupId } : {},
						commandHash: hashAcpxProcessCommand(leasedCommand),
						startedAt: existing?.rootPid === rootPid ? existing.startedAt : Date.now(),
						state: "open"
					});
					recordToSave = withOpenClawLeaseSessionMetadata({
						...lifecycleRecord,
						agentCommand: leasedCommand
					}, {
						openclawLeaseId: leaseIdentity.leaseId,
						openclawGatewayInstanceId: leaseIdentity.gatewayInstanceId
					});
				}
			}
			await baseStore.save(recordToSave);
			if (sessionName) freshSessionKeys.delete(sessionName);
		},
		markFresh(sessionKey) {
			const normalized = sessionKey.trim();
			if (normalized) freshSessionKeys.add(normalized);
		}
	};
}
const OPENCLAW_BRIDGE_EXECUTABLE = "openclaw";
const OPENCLAW_BRIDGE_SUBCOMMAND = "acp";
const CODEX_ACP_AGENT_ID = "codex";
const CODEX_ACP_OPENCLAW_PREFIX = "openai/";
const CLAUDE_ACP_OPENCLAW_PREFIX = "anthropic/";
const CODEX_ACP_THINKING_ALIASES = /* @__PURE__ */ new Map([
	["off", void 0],
	["minimal", "low"],
	["low", "low"],
	["medium", "medium"],
	["high", "high"],
	["x-high", "xhigh"],
	["x_high", "xhigh"],
	["extra-high", "xhigh"],
	["extra_high", "xhigh"],
	["extra high", "xhigh"],
	["xhigh", "xhigh"]
]);
function normalizeAgentName(value) {
	const normalized = value?.trim().toLowerCase();
	return normalized ? normalized : void 0;
}
function readAgentFromSessionKey(sessionKey) {
	const normalized = sessionKey?.trim();
	if (!normalized) return;
	return normalizeAgentName(/^agent:(?<agent>[^:]+):/i.exec(normalized)?.groups?.agent);
}
function readAgentFromHandle(handle) {
	const decoded = decodeAcpxRuntimeHandleState(handle.runtimeSessionName);
	if (typeof decoded === "object" && decoded !== null) {
		const { agent } = decoded;
		if (typeof agent === "string") return normalizeAgentName(agent) ?? readAgentFromSessionKey(handle.sessionKey);
	}
	return readAgentFromSessionKey(handle.sessionKey);
}
function readAgentCommandFromRecord(record) {
	return readRecordAgentCommand(record);
}
function readAgentPidFromRecord(record) {
	return readRecordAgentPid(record);
}
function basename$1(value) {
	return value.split(/[\\/]/).pop() ?? value;
}
function isEnvAssignment(value) {
	return /^[A-Za-z_][A-Za-z0-9_]*=/.test(value);
}
function unwrapEnvCommand(parts) {
	const command = parts.at(0);
	if (!command || basename$1(command) !== "env") return parts;
	let index = 1;
	while (true) {
		const part = parts.at(index);
		if (!part || !isEnvAssignment(part)) break;
		index += 1;
	}
	return parts.slice(index);
}
function matchesExecutableName(value, executableName) {
	const normalized = basename$1(value).toLowerCase();
	return normalized === executableName || normalized === `${executableName}.exe`;
}
function matchesPackageSpec(value, packageName) {
	const normalized = value.trim().toLowerCase();
	return normalized === packageName || normalized.startsWith(`${packageName}@`);
}
function stripModuleExtension(value) {
	return value.replace(/\.[cm]?js$/i, "").toLowerCase();
}
function isAcpCommand(command, params) {
	if (!command) return false;
	const parts = unwrapEnvCommand(splitCommandParts(command.trim()));
	if (!parts.length) return false;
	if (parts.some((part) => matchesPackageSpec(part, params.packageName))) return true;
	const commandName = basename$1(parts[0] ?? "");
	if (matchesExecutableName(commandName, params.executableName)) return true;
	if (!matchesExecutableName(commandName, "node")) return false;
	const scriptName = stripModuleExtension(basename$1(parts[1] ?? ""));
	return scriptName === params.executableName || scriptName === `${params.executableName}-wrapper`;
}
function isOpenClawBridgeCommand(command) {
	if (!command) return false;
	const parts = unwrapEnvCommand(splitCommandParts(command.trim()));
	if (basename$1(parts[0] ?? "") === OPENCLAW_BRIDGE_EXECUTABLE) return parts[1] === OPENCLAW_BRIDGE_SUBCOMMAND;
	if (basename$1(parts[0] ?? "") !== "node") return false;
	const scriptName = basename$1(parts[1] ?? "");
	return /^openclaw(?:\.[cm]?js)?$/i.test(scriptName) && parts[2] === OPENCLAW_BRIDGE_SUBCOMMAND;
}
function isCodexAcpCommand(command) {
	return isAcpCommand(command, {
		packageName: CODEX_ACP_PACKAGE,
		executableName: "codex-acp"
	});
}
function isClaudeAcpCommand(command) {
	return isAcpCommand(command, {
		packageName: "@agentclientprotocol/claude-agent-acp",
		executableName: "claude-agent-acp"
	});
}
function failUnsupportedCodexAcpModel(rawModel, detail) {
	throw new AcpRuntimeError$1("ACP_INVALID_RUNTIME_OPTION", detail ?? `Codex ACP model "${rawModel}" is not supported. Use openai/<model> or <model>/<reasoning-effort>.`);
}
const SUPPORTED_RUNTIME_SESSION_MODES = /* @__PURE__ */ new Set(["persistent", "oneshot"]);
const WIRE_TIMEOUT_CONFIG_KEYS = /* @__PURE__ */ new Set(["timeout", "timeout_seconds"]);
function assertSupportedRuntimeSessionMode(mode) {
	if (typeof mode === "string" && SUPPORTED_RUNTIME_SESSION_MODES.has(mode)) return;
	const supported = Array.from(SUPPORTED_RUNTIME_SESSION_MODES).join(", ");
	throw new AcpRuntimeError$1("ACP_INVALID_RUNTIME_OPTION", `Unsupported ACP runtime session mode ${JSON.stringify(mode)}. Expected one of: ${supported}.`);
}
function failUnsupportedCodexAcpThinking(rawThinking) {
	throw new AcpRuntimeError$1("ACP_INVALID_RUNTIME_OPTION", `Codex ACP thinking level "${rawThinking}" is not supported. Use off, minimal, low, medium, high, or xhigh.`);
}
function normalizeCodexAcpReasoningEffort(rawThinking) {
	const normalized = rawThinking?.trim().toLowerCase();
	if (!normalized) return;
	if (!CODEX_ACP_THINKING_ALIASES.has(normalized)) failUnsupportedCodexAcpThinking(rawThinking ?? "");
	return CODEX_ACP_THINKING_ALIASES.get(normalized);
}
function isCodexAcpReasoningEffortAlias(value) {
	const normalized = value?.trim().toLowerCase();
	return Boolean(normalized && CODEX_ACP_THINKING_ALIASES.has(normalized));
}
function classifyCodexAcpModelRequest(rawModel, rawThinking) {
	const raw = rawModel?.trim();
	const thinkingReasoningEffort = normalizeCodexAcpReasoningEffort(rawThinking);
	const thinkingOnlyOverride = thinkingReasoningEffort ? { reasoningEffort: thinkingReasoningEffort } : void 0;
	if (!raw) return {
		kind: "override",
		override: thinkingOnlyOverride ?? {}
	};
	let value = raw;
	let hadOpenAiQualifier = false;
	if (value.toLowerCase().startsWith(CODEX_ACP_OPENCLAW_PREFIX)) {
		value = value.slice(7);
		hadOpenAiQualifier = true;
	}
	let model = value.trim();
	let modelReasoningEffort;
	const slashIndex = value.lastIndexOf("/");
	if (slashIndex >= 0 && isCodexAcpReasoningEffortAlias(value.slice(slashIndex + 1))) {
		modelReasoningEffort = normalizeCodexAcpReasoningEffort(value.slice(slashIndex + 1));
		model = value.slice(0, slashIndex).trim();
	}
	if (hadOpenAiQualifier && (!model || model.includes("/"))) failUnsupportedCodexAcpModel(raw, `Codex ACP model "${raw}" is not supported. Use openai/<model> or <model>/<reasoning-effort>.`);
	if (!model || model.includes("/")) return thinkingOnlyOverride ? {
		kind: "unsupported",
		thinkingOverride: thinkingOnlyOverride
	} : { kind: "unsupported" };
	const reasoningEffort = thinkingReasoningEffort ?? modelReasoningEffort;
	return {
		kind: "override",
		override: {
			model,
			...reasoningEffort ? { reasoningEffort } : {}
		}
	};
}
function withCodexSessionModel(input, override) {
	const next = { ...input };
	if (override?.model) next.model = override.model;
	else delete next.model;
	return next;
}
function normalizeClaudeAcpModelOverride(rawModel) {
	const raw = rawModel?.trim();
	if (!raw) return;
	if (!raw.toLowerCase().startsWith(CLAUDE_ACP_OPENCLAW_PREFIX)) return raw;
	return raw.slice(10).trim() || void 0;
}
function withAcpxSessionOptions(input) {
	const existingOptions = input.sessionOptions;
	const model = input.model?.trim() || existingOptions?.model;
	const sessionOptions = model ? {
		...existingOptions,
		model
	} : existingOptions;
	const { modelExplicit: _modelExplicit, ...rest } = input;
	return {
		...rest,
		...sessionOptions ? { sessionOptions } : {}
	};
}
function isAcpModelCapabilityMissingError(error) {
	return isRequestedModelUnsupportedError(error) && error.reason === "missing-capability";
}
async function ensureDelegateSessionWithModelFallback(delegate, input) {
	try {
		return await delegate.ensureSession(withAcpxSessionOptions(input));
	} catch (error) {
		if (!input.model || !isAcpModelCapabilityMissingError(error)) throw error;
		return await delegate.ensureSession(withAcpxSessionOptions({
			...input,
			model: void 0
		}));
	}
}
function quoteShellArg(value) {
	if (/^[A-Za-z0-9_./:=@+-]+$/.test(value)) return value;
	return `'${value.replace(/'/g, "'\\''")}'`;
}
function normalizeAgentCommand(command) {
	return (Array.isArray(command) ? command.map((part) => quoteShellArg(part)).join(" ") : command).trim() || void 0;
}
function appendCodexAcpConfigOverrides(command, override) {
	const config = {
		...override.model ? { model: override.model } : {},
		...override.reasoningEffort ? { model_reasoning_effort: override.reasoningEffort } : {}
	};
	if (Object.keys(config).length === 0) return command;
	return `${command} ${OPENCLAW_CODEX_CONFIG_ARG} ${quoteShellArg(JSON.stringify(config))}`;
}
function createModelScopedAgentRegistry(params) {
	return {
		resolve(agentName) {
			const command = normalizeAgentCommand(params.agentRegistry.resolve(agentName)) ?? "";
			const override = params.scope.getStore();
			if (!override || normalizeAgentName(agentName) !== CODEX_ACP_AGENT_ID || !isCodexAcpCommand(command)) return params.leaseCommand(command);
			return params.leaseCommand(appendCodexAcpConfigOverrides(command, override));
		},
		list() {
			return params.agentRegistry.list();
		}
	};
}
function resolveAgentCommand(params) {
	const normalizedAgentName = normalizeAgentName(params.agentName);
	if (!normalizedAgentName) return;
	return normalizeAgentCommand(params.agentRegistry.resolve(normalizedAgentName));
}
function shouldUseBridgeSafeDelegateForCommand(command) {
	return isOpenClawBridgeCommand(command);
}
function shouldUseDistinctBridgeDelegate(options) {
	const { mcpServers } = options;
	return Array.isArray(mcpServers) && mcpServers.length > 0;
}
function withManagedToolsMcpSessionEnv(params) {
	const sessionKey = params.sessionKey.trim();
	if (!params.pluginToolsEnabled && !params.openclawToolsEnabled || !sessionKey || !params.mcpServers?.length) return params.mcpServers;
	let changed = false;
	const nextServers = params.mcpServers.map((server) => {
		const isManagedPluginTools = params.pluginToolsEnabled && server.name === ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME;
		const isManagedOpenClawTools = params.openclawToolsEnabled && server.name === ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME;
		if (!isManagedPluginTools && !isManagedOpenClawTools || !("command" in server)) return server;
		changed = true;
		const env = [...server.env.filter((entry) => entry.name !== OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV), {
			name: OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV,
			value: sessionKey
		}];
		return {
			...server,
			env
		};
	});
	return changed ? nextServers : params.mcpServers;
}
/** OpenClaw-managed ACP runtime implementation backed by the upstream acpx runtime. */
var AcpxRuntime = class {
	constructor(options, testOptions) {
		this.codexAcpModelOverrideScope = new AsyncLocalStorage();
		this.managedToolsSessionDelegates = /* @__PURE__ */ new Map();
		this.launchLeaseScope = new AsyncLocalStorage();
		this.ensureSessionTails = /* @__PURE__ */ new Map();
		this.processLeaseTransitionTails = /* @__PURE__ */ new Map();
		this.processLeaseOperationCounts = /* @__PURE__ */ new Map();
		this.uncertainProcessLeaseIds = /* @__PURE__ */ new Set();
		const { openclawProcessCleanup, ...delegateTestOptions } = testOptions ?? {};
		this.processCleanupDeps = openclawProcessCleanup;
		this.wrapperRoot = options.openclawWrapperRoot;
		this.gatewayInstanceId = options.openclawGatewayInstanceId;
		this.processLeaseStore = options.openclawProcessLeaseStore;
		this.pluginToolsMcpBridgeEnabled = options.pluginToolsMcpBridgeEnabled === true;
		this.openclawToolsMcpBridgeEnabled = options.openclawToolsMcpBridgeEnabled === true;
		this.managedToolsMcpBridgeEnabled = this.pluginToolsMcpBridgeEnabled || this.openclawToolsMcpBridgeEnabled;
		this.cwd = options.cwd;
		this.sessionStore = createResetAwareSessionStore(options.sessionStore, {
			gatewayInstanceId: this.gatewayInstanceId,
			leaseStore: this.processLeaseStore,
			launchScope: this.launchLeaseScope,
			wrapperRoot: this.wrapperRoot
		});
		this.agentRegistry = options.agentRegistry;
		this.scopedAgentRegistry = createModelScopedAgentRegistry({
			agentRegistry: this.agentRegistry,
			scope: this.codexAcpModelOverrideScope,
			leaseCommand: (command) => this.commandWithLaunchLease(command)
		});
		const sharedOptions = {
			...options,
			sessionStore: this.sessionStore,
			agentRegistry: this.scopedAgentRegistry
		};
		this.delegateOptions = sharedOptions;
		this.delegateTestOptions = delegateTestOptions;
		this.delegate = new AcpxRuntime$1(sharedOptions, this.delegateTestOptions);
		this.bridgeSafeDelegate = shouldUseDistinctBridgeDelegate(options) ? new AcpxRuntime$1({
			...sharedOptions,
			mcpServers: []
		}, this.delegateTestOptions) : this.delegate;
		const probeCommand = resolveAgentCommand({
			agentName: normalizeAgentName(options.probeAgent) ?? "codex",
			agentRegistry: this.agentRegistry
		});
		this.probeCommand = probeCommand;
		const useBridgeSafeProbe = this.managedToolsMcpBridgeEnabled || shouldUseBridgeSafeDelegateForCommand(probeCommand);
		this.probeDelegate = useBridgeSafeProbe ? this.bridgeSafeDelegate : this.delegate;
	}
	resolveDelegateForSession(params) {
		if (shouldUseBridgeSafeDelegateForCommand(params.command)) return this.bridgeSafeDelegate;
		return this.resolveManagedToolsDelegateForSession(params.sessionKey);
	}
	resolveManagedToolsDelegateForSession(sessionKey) {
		if (!this.managedToolsMcpBridgeEnabled) return this.delegate;
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedSessionKey) return this.delegate;
		const cached = this.managedToolsSessionDelegates.get(normalizedSessionKey);
		if (cached) return cached;
		const delegate = new AcpxRuntime$1({
			...this.delegateOptions,
			mcpServers: withManagedToolsMcpSessionEnv({
				pluginToolsEnabled: this.pluginToolsMcpBridgeEnabled,
				openclawToolsEnabled: this.openclawToolsMcpBridgeEnabled,
				mcpServers: this.delegateOptions.mcpServers,
				sessionKey: normalizedSessionKey
			})
		}, this.delegateTestOptions);
		this.managedToolsSessionDelegates.set(normalizedSessionKey, delegate);
		return delegate;
	}
	releaseManagedToolsDelegateForSession(sessionKey) {
		if (!this.managedToolsMcpBridgeEnabled) return;
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedSessionKey) return;
		this.managedToolsSessionDelegates.delete(normalizedSessionKey);
	}
	async loadOperationSnapshotForHandle(handle) {
		const record = await this.sessionStore.load(handle.acpxRecordId ?? handle.sessionKey);
		return {
			record,
			command: readAgentCommandFromRecord(record) ?? resolveAgentCommand({
				agentName: readAgentFromHandle(handle),
				agentRegistry: this.agentRegistry
			})
		};
	}
	resolveDelegateForOperationSnapshot(handle, snapshot) {
		return this.resolveDelegateForSession({
			command: snapshot.command,
			sessionKey: handle.sessionKey
		});
	}
	commandWithLaunchLease(command) {
		const launch = this.launchLeaseScope.getStore();
		if (!launch) return command;
		if (command === launch.stableCommand) return launch.resolvedCommand;
		return withAcpxLeaseEnvironment({
			command,
			leaseId: launch.leaseId,
			gatewayInstanceId: launch.gatewayInstanceId
		});
	}
	async readReusablePersistentSessionCommand(params) {
		if (params.mode !== "persistent" || !params.command) return;
		const existing = await this.sessionStore.load(params.sessionKey);
		if (!existing || readRecordResetOnNextEnsure(existing)) return;
		const recordCwd = readRecordCwd(existing);
		if (!recordCwd || resolve(recordCwd) !== resolve(params.cwd?.trim() || this.cwd)) return;
		const recordCommand = readRecordAgentCommand(existing);
		if (!recordCommand) return;
		const leaseIdentity = readAcpxProcessLeaseIdentity(recordCommand);
		if (leaseIdentity && leaseIdentity.gatewayInstanceId !== this.gatewayInstanceId) return;
		if (recordCommand !== (leaseIdentity ? withAcpxLeaseEnvironment({
			command: params.command,
			leaseId: leaseIdentity.leaseId,
			gatewayInstanceId: leaseIdentity.gatewayInstanceId
		}) : params.command)) return;
		const existingSessionId = typeof existing === "object" && existing !== null ? existing.acpSessionId : void 0;
		return !params.resumeSessionId || existingSessionId === params.resumeSessionId ? recordCommand : void 0;
	}
	async runWithLaunchLease(params) {
		if (!params.command || !this.wrapperRoot || !this.gatewayInstanceId || !this.processLeaseStore || !isOpenClawLeaseAwareAcpxProcessCommand({
			command: params.command,
			wrapperRoot: this.wrapperRoot
		})) return await params.run();
		const processLeaseStore = this.processLeaseStore;
		const reusableIdentity = readAcpxProcessLeaseIdentity(params.reusableCommand);
		const canReuseLeaseIdentity = reusableIdentity?.gatewayInstanceId === this.gatewayInstanceId;
		const leaseId = canReuseLeaseIdentity ? reusableIdentity.leaseId : params.finalizeCompletedProbe ? `probe-${hashAcpxProcessCommand(`${this.gatewayInstanceId}\0${extractGeneratedWrapperPath(params.command)}`)}` : createAcpxProcessLeaseId();
		const leasedCommand = withAcpxLeaseEnvironment({
			command: params.command,
			leaseId,
			gatewayInstanceId: this.gatewayInstanceId
		});
		const launch = {
			leaseId,
			gatewayInstanceId: this.gatewayInstanceId,
			sessionKey: params.sessionKey,
			wrapperRoot: this.wrapperRoot,
			stableCommand: params.command,
			resolvedCommand: params.reusableCommand ?? leasedCommand,
			leasedCommand
		};
		await this.retainProcessLeaseOperation(launch, async () => {
			const reusableLease = canReuseLeaseIdentity ? await processLeaseStore.load(launch.leaseId) : void 0;
			if (reusableLease && (reusableLease.gatewayInstanceId !== launch.gatewayInstanceId || reusableLease.sessionKey !== launch.sessionKey || reusableLease.wrapperRoot !== launch.wrapperRoot)) throw new AcpRuntimeError$1("ACP_SESSION_INIT_FAILED", `ACPX process lease ${launch.leaseId} belongs to another session`);
			if (!(!reusableLease && (!params.reusableCommand || params.reusableCommand === leasedCommand))) return;
			await processLeaseStore.save({
				leaseId: launch.leaseId,
				gatewayInstanceId: launch.gatewayInstanceId,
				sessionKey: launch.sessionKey,
				wrapperRoot: launch.wrapperRoot,
				wrapperPath: extractGeneratedWrapperPath(leasedCommand),
				rootPid: 0,
				commandHash: hashAcpxProcessCommand(leasedCommand),
				startedAt: Date.now(),
				state: "open"
			});
		});
		try {
			const result = await this.launchLeaseScope.run(launch, params.run);
			if (params.finalizeCompletedProbe) await this.finalizeCompletedProbeLease(launch);
			else await this.finalizeProcessLeaseForSession(params.sessionKey, launch);
			return result;
		} catch (error) {
			await this.releaseProcessLeaseAfterUncertainFailure(launch);
			throw error;
		}
	}
	async prepareProcessLeaseForOperation(handle, record) {
		if (!this.processLeaseStore || !this.gatewayInstanceId || !this.wrapperRoot) return;
		const processLeaseStore = this.processLeaseStore;
		const wrapperRoot = this.wrapperRoot;
		const recordPid = readRecordAgentPid(record);
		const command = readAgentCommandFromRecord(record);
		const identity = readAcpxProcessLeaseIdentity(command);
		if (!command || !isOpenClawLeaseAwareAcpxProcessCommand({
			command,
			wrapperRoot
		})) return;
		if (!identity) return;
		if (identity.gatewayInstanceId !== this.gatewayInstanceId) throw new AcpRuntimeError$1("ACP_TURN_FAILED", `ACPX process lease ${identity.leaseId} belongs to another gateway`);
		await this.retainProcessLeaseOperation(identity, async () => {
			const existing = await processLeaseStore.load(identity.leaseId);
			if (!existing) {
				await processLeaseStore.save({
					leaseId: identity.leaseId,
					gatewayInstanceId: identity.gatewayInstanceId,
					sessionKey: handle.sessionKey,
					wrapperRoot,
					wrapperPath: extractGeneratedWrapperPath(command),
					rootPid: recordPid ?? 0,
					commandHash: hashAcpxProcessCommand(command),
					startedAt: Date.now(),
					state: "open"
				});
				return;
			}
			if (existing.gatewayInstanceId !== identity.gatewayInstanceId || existing.sessionKey !== handle.sessionKey || existing.wrapperRoot !== wrapperRoot) throw new AcpRuntimeError$1("ACP_TURN_FAILED", `ACPX process lease ${identity.leaseId} belongs to another session`);
		});
		return identity;
	}
	async runSerializedProcessLeaseTransition(leaseId, run) {
		const previous = this.processLeaseTransitionTails.get(leaseId) ?? Promise.resolve();
		let release;
		const current = new Promise((resolve) => {
			release = resolve;
		});
		const tail = previous.then(() => current);
		this.processLeaseTransitionTails.set(leaseId, tail);
		await previous;
		try {
			return await run();
		} finally {
			release();
			if (this.processLeaseTransitionTails.get(leaseId) === tail) this.processLeaseTransitionTails.delete(leaseId);
		}
	}
	async retainProcessLeaseOperation(identity, prepare) {
		await this.runSerializedProcessLeaseTransition(identity.leaseId, async () => {
			await prepare();
			this.processLeaseOperationCounts.set(identity.leaseId, (this.processLeaseOperationCounts.get(identity.leaseId) ?? 0) + 1);
		});
	}
	async releaseProcessLeaseOperation(identity, finalize) {
		if (!identity) return;
		await this.runSerializedProcessLeaseTransition(identity.leaseId, async () => {
			const count = this.processLeaseOperationCounts.get(identity.leaseId) ?? 0;
			if (count > 1) {
				this.processLeaseOperationCounts.set(identity.leaseId, count - 1);
				return;
			}
			if (count === 0) return;
			this.processLeaseOperationCounts.delete(identity.leaseId);
			await finalize();
		});
	}
	async finalizeProcessLeaseForOperation(handle, identity) {
		await this.finalizeProcessLeaseForSession(handle.acpxRecordId ?? handle.sessionKey, identity);
	}
	async finalizeProcessLeaseForSession(sessionId, identity) {
		if (!identity || !this.processLeaseStore) return;
		const processLeaseStore = this.processLeaseStore;
		await this.releaseProcessLeaseOperation(identity, async () => {
			const lease = await processLeaseStore.load(identity.leaseId);
			if (!lease || lease.gatewayInstanceId !== identity.gatewayInstanceId) return;
			if (lease.rootPid <= 0) {
				if (this.uncertainProcessLeaseIds.has(identity.leaseId)) return;
				await processLeaseStore.markState(identity.leaseId, "lost");
				return;
			}
			this.uncertainProcessLeaseIds.delete(identity.leaseId);
			try {
				const recordIdentity = readAcpxProcessLeaseIdentity(readAgentCommandFromRecord(await this.sessionStore.load(sessionId)));
				if (recordIdentity?.leaseId !== identity.leaseId || recordIdentity.gatewayInstanceId !== identity.gatewayInstanceId) await processLeaseStore.markState(identity.leaseId, "lost");
			} catch {}
		});
	}
	async finalizeCompletedProbeLease(identity) {
		if (!this.processLeaseStore) return;
		const processLeaseStore = this.processLeaseStore;
		await this.releaseProcessLeaseOperation(identity, async () => {
			const lease = await processLeaseStore.load(identity.leaseId);
			if (!lease || lease.gatewayInstanceId !== identity.gatewayInstanceId) return;
			if (lease.rootPid > 0) return;
			await cleanupOpenClawOwnedAcpxPendingLease({
				leaseId: lease.leaseId,
				gatewayInstanceId: lease.gatewayInstanceId,
				wrapperRoot: lease.wrapperRoot,
				wrapperPath: lease.wrapperPath,
				deps: this.processCleanupDeps
			});
		});
	}
	async releaseProcessLeaseAfterUncertainFailure(identity) {
		if (!identity || !this.processLeaseStore) return;
		this.uncertainProcessLeaseIds.add(identity.leaseId);
		const processLeaseStore = this.processLeaseStore;
		await this.releaseProcessLeaseOperation(identity, async () => {
			const lease = await processLeaseStore.load(identity.leaseId);
			if (!lease || lease.gatewayInstanceId !== identity.gatewayInstanceId || lease.rootPid > 0) this.uncertainProcessLeaseIds.delete(identity.leaseId);
		});
	}
	async runWithProcessLeaseForHandle(handle, record, run) {
		const identity = await this.prepareProcessLeaseForOperation(handle, record);
		try {
			return await run();
		} finally {
			await this.finalizeProcessLeaseForOperation(handle, identity);
		}
	}
	async finalizeProcessLeaseAfter(handle, identityPromise, resultPromise) {
		try {
			return await resultPromise;
		} finally {
			await this.finalizeProcessLeaseForOperation(handle, await identityPromise);
		}
	}
	async runSerializedSessionEnsure(sessionKey, run) {
		const key = sessionKey.trim() || sessionKey;
		const previous = this.ensureSessionTails.get(key) ?? Promise.resolve();
		let release;
		const current = new Promise((resolve) => {
			release = resolve;
		});
		const tail = previous.then(() => current);
		this.ensureSessionTails.set(key, tail);
		await previous;
		try {
			return await run();
		} finally {
			release();
			if (this.ensureSessionTails.get(key) === tail) this.ensureSessionTails.delete(key);
		}
	}
	async withCodexWrapperDiagnostics(params) {
		try {
			return await params.run();
		} catch (error) {
			if (!isCodexAcpCommand(params.command) || !isGenericInternalAcpError(error)) throw error;
			const stderrTail = await readCodexWrapperStderrTail({
				wrapperRoot: this.wrapperRoot,
				leaseId: this.launchLeaseScope.getStore()?.leaseId
			});
			if (!stderrTail) throw error;
			throw new AcpRuntimeError$1(params.fallbackCode, `Internal error: ${stderrTail}`, { cause: error });
		}
	}
	async readCodexTurnFailureStderr(params) {
		const record = await this.sessionStore.load(params.handle.acpxRecordId ?? params.handle.sessionKey);
		return readCodexWrapperStderrTail({
			wrapperRoot: this.wrapperRoot,
			leaseId: readOpenClawLeaseIdFromRecord(record)
		});
	}
	async cleanupProcessTreeForRecord(handle, record) {
		const leaseId = readOpenClawLeaseIdFromRecord(record);
		const rootPid = readAgentPidFromRecord(record);
		const sessionKeys = [handle.sessionKey, readSessionRecordName(record)];
		const selectedLease = selectCurrentSessionLease({
			leases: this.gatewayInstanceId && this.processLeaseStore ? await this.processLeaseStore.listOpen(this.gatewayInstanceId) : [],
			sessionKeys,
			rootPid
		});
		const loadedLease = leaseId ? await this.processLeaseStore?.load(leaseId) : void 0;
		const lease = selectedLease ?? (loadedLease && loadedLease.gatewayInstanceId === this.gatewayInstanceId && (!rootPid || loadedLease.rootPid === rootPid) && sessionKeys.includes(loadedLease.sessionKey) ? loadedLease : void 0);
		if (lease && lease.gatewayInstanceId === this.gatewayInstanceId && lease.rootPid > 0) {
			await this.processLeaseStore?.markState(lease.leaseId, "closing");
			const result = await cleanupOpenClawOwnedAcpxProcessTree({
				rootPid: lease.rootPid,
				rootCommand: readAgentCommandFromRecord(record),
				expectedLeaseId: lease.leaseId,
				expectedGatewayInstanceId: lease.gatewayInstanceId,
				wrapperRoot: lease.wrapperRoot,
				deps: this.processCleanupDeps
			});
			await this.processLeaseStore?.markState(lease.leaseId, result.skippedReason === "process-list-unavailable" || result.skippedReason === "unsupported-platform" ? "open" : result.terminatedPids.length > 0 || result.skippedReason === "missing-root" ? "closed" : "lost");
			return;
		}
		const rootCommand = readAgentCommandFromRecord(record) ?? resolveAgentCommand({
			agentName: readAgentFromHandle(handle),
			agentRegistry: this.agentRegistry
		});
		if (!rootPid || !rootCommand) return;
		const expectedGatewayInstanceId = readOpenClawGatewayInstanceIdFromRecord(record);
		await cleanupOpenClawOwnedAcpxProcessTree({
			rootPid,
			rootCommand,
			...leaseId ? { expectedLeaseId: leaseId } : {},
			...expectedGatewayInstanceId ? { expectedGatewayInstanceId } : {},
			wrapperRoot: this.wrapperRoot,
			deps: this.processCleanupDeps
		});
	}
	isHealthy() {
		return this.probeDelegate.isHealthy();
	}
	async probeAvailability() {
		await this.runWithLaunchLease({
			sessionKey: ACPX_PROBE_LEASE_SESSION_KEY,
			command: this.probeCommand,
			finalizeCompletedProbe: true,
			run: () => this.probeDelegate.probeAvailability()
		});
	}
	async doctor() {
		return await this.runWithLaunchLease({
			sessionKey: ACPX_PROBE_LEASE_SESSION_KEY,
			command: this.probeCommand,
			finalizeCompletedProbe: true,
			run: () => this.probeDelegate.doctor()
		});
	}
	async ensureSession(input) {
		return await this.runSerializedSessionEnsure(input.sessionKey, () => this.ensureSessionUnlocked(input));
	}
	async ensureSessionUnlocked(input) {
		assertSupportedRuntimeSessionMode(input.mode);
		const command = resolveAgentCommand({
			agentName: input.agent,
			agentRegistry: this.agentRegistry
		});
		const delegate = this.resolveDelegateForSession({
			command,
			sessionKey: input.sessionKey
		});
		const isCodexAcp = normalizeAgentName(input.agent) === CODEX_ACP_AGENT_ID && isCodexAcpCommand(command);
		const claudeModelOverride = isClaudeAcpCommand(command) ? normalizeClaudeAcpModelOverride(input.model) : void 0;
		const codexClassification = isCodexAcp ? classifyCodexAcpModelRequest(input.model, input.thinking) : void 0;
		if (codexClassification?.kind === "unsupported" && input.modelExplicit) failUnsupportedCodexAcpModel(input.model ?? "");
		const classifiedCodexOverride = codexClassification?.kind === "override" ? codexClassification.override : codexClassification?.thinkingOverride;
		const codexModelOverride = classifiedCodexOverride && Object.keys(classifiedCodexOverride).length > 0 ? classifiedCodexOverride : void 0;
		const requestedModel = input.model?.trim();
		const appliedModel = isCodexAcp && requestedModel ? codexModelOverride?.model ? {
			kind: "applied",
			model: requestedModel
		} : { kind: "dropped" } : void 0;
		const ensureInput = isCodexAcp ? withCodexSessionModel(input, codexModelOverride) : claudeModelOverride ? {
			...input,
			model: claudeModelOverride
		} : input;
		const stableLaunchCommand = codexModelOverride && command ? appendCodexAcpConfigOverrides(command, codexModelOverride) : command;
		const reusableCommand = await this.readReusablePersistentSessionCommand({
			sessionKey: input.sessionKey,
			mode: input.mode,
			cwd: input.cwd,
			command: stableLaunchCommand,
			resumeSessionId: input.resumeSessionId
		});
		const handle = !codexModelOverride ? await this.runWithLaunchLease({
			sessionKey: ensureInput.sessionKey,
			command: stableLaunchCommand,
			reusableCommand,
			run: () => this.withCodexWrapperDiagnostics({
				command: stableLaunchCommand,
				fallbackCode: "ACP_SESSION_INIT_FAILED",
				run: () => ensureDelegateSessionWithModelFallback(delegate, ensureInput)
			})
		}) : await this.runWithLaunchLease({
			sessionKey: input.sessionKey,
			command: stableLaunchCommand,
			reusableCommand,
			run: () => this.codexAcpModelOverrideScope.run(codexModelOverride, () => this.withCodexWrapperDiagnostics({
				command: stableLaunchCommand,
				fallbackCode: "ACP_SESSION_INIT_FAILED",
				run: () => delegate.ensureSession(withAcpxSessionOptions(ensureInput))
			}))
		});
		return appliedModel ? {
			...handle,
			appliedModel
		} : handle;
	}
	async *runTurn(input) {
		const record = await this.sessionStore.load(input.handle.acpxRecordId ?? input.handle.sessionKey);
		const turnLease = await this.prepareProcessLeaseForOperation(input.handle, record);
		let command;
		try {
			command = (await this.loadOperationSnapshotForHandle(input.handle)).command;
			const delegate = this.resolveDelegateForOperationSnapshot(input.handle, await this.loadOperationSnapshotForHandle(input.handle));
			for await (const event of delegate.runTurn(withOpenClawManagedTurnTimeout(input))) {
				if (event.type !== "error" || !isCodexAcpCommand(command) || !isGenericInternalAcpErrorMessage(event.message)) {
					yield event;
					continue;
				}
				const stderrTail = await this.readCodexTurnFailureStderr({ handle: input.handle });
				if (!stderrTail) {
					yield event;
					continue;
				}
				yield {
					...event,
					code: "ACP_TURN_FAILED",
					message: `Internal error: ${stderrTail}`
				};
			}
		} catch (error) {
			if (!isCodexAcpCommand(command) || !isGenericInternalAcpError(error)) throw error;
			const stderrTail = await this.readCodexTurnFailureStderr({ handle: input.handle });
			if (!stderrTail) throw error;
			throw new AcpRuntimeError$1("ACP_TURN_FAILED", `Internal error: ${stderrTail}`, { cause: error });
		} finally {
			await this.finalizeProcessLeaseForOperation(input.handle, turnLease);
		}
	}
	startTurn(input) {
		const readCodexTurnFailureStderr = () => this.readCodexTurnFailureStderr({ handle: input.handle });
		const snapshotPromise = this.loadOperationSnapshotForHandle(input.handle);
		const turnLeasePromise = snapshotPromise.then(({ record }) => this.prepareProcessLeaseForOperation(input.handle, record));
		const turnPromise = Promise.all([snapshotPromise, turnLeasePromise]).then(async ([snapshot]) => {
			const { command } = snapshot;
			const delegate = this.resolveDelegateForOperationSnapshot(input.handle, snapshot);
			try {
				return {
					command,
					turn: delegate.startTurn(withOpenClawManagedTurnTimeout(input))
				};
			} catch (error) {
				if (!isCodexAcpCommand(command) || !isGenericInternalAcpError(error)) throw error;
				const stderrTail = await readCodexTurnFailureStderr();
				if (!stderrTail) throw error;
				throw new AcpRuntimeError$1("ACP_TURN_FAILED", `Internal error: ${stderrTail}`, { cause: error });
			}
		});
		return {
			requestId: input.requestId,
			get promptStarted() {
				return turnPromise.then(({ turn }) => turn.promptStarted);
			},
			events: { async *[Symbol.asyncIterator]() {
				const { command, turn } = await turnPromise;
				try {
					for await (const event of turn.events) {
						if (event.type !== "error" || !isCodexAcpCommand(command) || !isGenericInternalAcpErrorMessage(event.message)) {
							yield event;
							continue;
						}
						const stderrTail = await readCodexTurnFailureStderr();
						if (!stderrTail) {
							yield event;
							continue;
						}
						yield {
							...event,
							code: "ACP_TURN_FAILED",
							message: `Internal error: ${stderrTail}`
						};
					}
				} catch (error) {
					if (!isCodexAcpCommand(command) || !isGenericInternalAcpError(error)) throw error;
					const stderrTail = await readCodexTurnFailureStderr();
					if (!stderrTail) throw error;
					throw new AcpRuntimeError$1("ACP_TURN_FAILED", `Internal error: ${stderrTail}`, { cause: error });
				}
			} },
			result: this.finalizeProcessLeaseAfter(input.handle, turnLeasePromise, turnPromise.then(async ({ command, turn }) => {
				try {
					const result = await turn.result;
					if (result.status !== "failed" || !isCodexAcpCommand(command) || !isGenericInternalAcpErrorMessage(result.error.message)) return result;
					const stderrTail = await this.readCodexTurnFailureStderr({ handle: input.handle });
					if (!stderrTail) return result;
					return {
						status: "failed",
						error: {
							...result.error,
							code: "ACP_TURN_FAILED",
							message: `Internal error: ${stderrTail}`
						}
					};
				} catch (error) {
					if (!isCodexAcpCommand(command) || !isGenericInternalAcpError(error)) throw error;
					const stderrTail = await this.readCodexTurnFailureStderr({ handle: input.handle });
					if (!stderrTail) throw error;
					throw new AcpRuntimeError$1("ACP_TURN_FAILED", `Internal error: ${stderrTail}`, { cause: error });
				}
			})),
			cancel(inputArgs) {
				return turnPromise.then(({ turn }) => turn.cancel(inputArgs));
			},
			closeStream(inputArgs) {
				return turnPromise.then(({ turn }) => turn.closeStream(inputArgs));
			}
		};
	}
	getCapabilities(input) {
		return this.delegate.getCapabilities(input);
	}
	async getStatus(input) {
		const snapshot = await this.loadOperationSnapshotForHandle(input.handle);
		return this.resolveDelegateForOperationSnapshot(input.handle, snapshot).getStatus(input);
	}
	async setMode(input) {
		const snapshot = await this.loadOperationSnapshotForHandle(input.handle);
		await this.runWithProcessLeaseForHandle(input.handle, snapshot.record, () => this.resolveDelegateForOperationSnapshot(input.handle, snapshot).setMode(input));
	}
	async setConfigOption(input) {
		const snapshot = await this.loadOperationSnapshotForHandle(input.handle);
		await this.runWithProcessLeaseForHandle(input.handle, snapshot.record, () => this.setConfigOptionUnlocked(input, snapshot));
	}
	async setConfigOptionUnlocked(input, snapshot) {
		const { command } = snapshot;
		const delegate = this.resolveDelegateForOperationSnapshot(input.handle, snapshot);
		const key = input.key.trim().toLowerCase();
		const isCodexAcp = isCodexAcpCommand(command);
		if (WIRE_TIMEOUT_CONFIG_KEYS.has(key) && (isCodexAcp || isClaudeAcpCommand(command))) return;
		if (isCodexAcp) {
			if (key === "model") {
				const classification = classifyCodexAcpModelRequest(input.value);
				if (classification.kind === "unsupported") failUnsupportedCodexAcpModel(input.value);
				const { override } = classification;
				if (override.model) await delegate.setConfigOption({
					...input,
					key: "model",
					value: override.model
				});
				if (override.reasoningEffort) await delegate.setConfigOption({
					...input,
					key: "reasoning_effort",
					value: override.reasoningEffort
				});
				return;
			}
			if (key === "thinking" || key === "thought_level" || key === "reasoning_effort") {
				const classification = classifyCodexAcpModelRequest(void 0, input.value);
				const reasoningEffort = classification.kind === "override" ? classification.override.reasoningEffort : void 0;
				if (!reasoningEffort) return;
				await delegate.setConfigOption({
					...input,
					key: "reasoning_effort",
					value: reasoningEffort
				});
				return;
			}
		}
		if (isClaudeAcpCommand(command) && key === "model") {
			await delegate.setConfigOption({
				...input,
				value: normalizeClaudeAcpModelOverride(input.value) ?? input.value
			});
			return;
		}
		await delegate.setConfigOption(input);
	}
	async cancel(input) {
		const snapshot = await this.loadOperationSnapshotForHandle(input.handle);
		await this.resolveDelegateForOperationSnapshot(input.handle, snapshot).cancel(input);
	}
	async prepareFreshSession(input) {
		this.sessionStore.markFresh(input.sessionKey);
	}
	async close(input) {
		const snapshot = await this.loadOperationSnapshotForHandle(input.handle);
		const closeLease = await this.prepareProcessLeaseForOperation(input.handle, snapshot.record);
		let cleanupSucceeded = false;
		try {
			const delegate = this.resolveDelegateForOperationSnapshot(input.handle, snapshot);
			let closeSucceeded;
			try {
				await delegate.close({
					handle: input.handle,
					reason: input.reason,
					discardPersistentState: input.discardPersistentState
				});
				closeSucceeded = true;
			} finally {
				await this.cleanupProcessTreeForRecord(input.handle, snapshot.record);
				cleanupSucceeded = true;
			}
			if (closeSucceeded) this.releaseManagedToolsDelegateForSession(input.handle.sessionKey);
			if (closeSucceeded && input.discardPersistentState) this.sessionStore.markFresh(input.handle.sessionKey);
		} finally {
			if (cleanupSucceeded) await this.finalizeProcessLeaseForOperation(input.handle, closeLease);
			else await this.releaseProcessLeaseAfterUncertainFailure(closeLease);
		}
	}
};
/** Test-only hooks for ACPX runtime behavior that is otherwise private. */
const testing = {
	appendCodexAcpConfigOverrides,
	isClaudeAcpCommand,
	isCodexAcpCommand,
	normalizeAgentCommand
};
//#endregion
export { ACPX_BACKEND_ID, AcpxRuntime, createAcpRuntime, createAgentRegistry, createFileSessionStore, decodeAcpxRuntimeHandleState, encodeAcpxRuntimeHandleState, testing };
