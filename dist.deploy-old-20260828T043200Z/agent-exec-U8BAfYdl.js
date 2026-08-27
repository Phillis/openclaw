import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.js";
import { t as mergeDeep } from "./deep-merge-0Mm5mlIP.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { a as writeRuntimeJson, o as writeRuntimeStdout } from "./runtime-LRpY2Icg.js";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BKFiXlHH.js";
import { n as findAgentRunTerminalOutcome } from "./agent-run-terminal-error-BLySVFXs.js";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.js";
import { createReadStream, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { TextDecoder } from "node:util";
//#region src/commands/agent-exec.ts
const AGENT_EXEC_MESSAGE_MAX_BYTES = 4 * 1024 * 1024;
const AGENT_EXEC_DEFAULT_TIMEOUT_SECONDS = 600;
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });
function decodePrompt(bytes, source) {
	let value;
	try {
		value = UTF8_DECODER.decode(bytes).replace(/^\uFEFF/, "");
	} catch {
		throw new Error(`${source} must be valid UTF-8`);
	}
	if (!value.trim()) throw new Error(`${source} is empty`);
	return value;
}
async function readPromptStream(stream, source) {
	return decodePrompt(await readByteStreamWithLimit(stream, {
		maxBytes: AGENT_EXEC_MESSAGE_MAX_BYTES,
		onOverflow: () => /* @__PURE__ */ new Error(`${source} exceeds ${String(AGENT_EXEC_MESSAGE_MAX_BYTES)} bytes`)
	}), source);
}
/** Resolve the one allowed prompt source for `agent exec`. */
async function resolveAgentExecPrompt(positionalMessage, messageFile, stdin = process.stdin) {
	const file = messageFile?.trim();
	if (positionalMessage !== void 0 && file) throw new Error("Use either the prompt argument or --message-file, not both.");
	if (messageFile !== void 0 && !file) throw new Error("--message-file must not be empty.");
	if (file) {
		const stream = file === "-" ? stdin : createReadStream(file);
		try {
			return await readPromptStream(stream, file === "-" ? "stdin" : `Message file ${file}`);
		} catch (error) {
			if (file === "-" || !(error instanceof Error) || !("code" in error)) throw error;
			if (error.code === "ENOENT") throw new Error(`Message file not found: ${file}`, { cause: error });
			throw error;
		}
	}
	if (!positionalMessage?.trim()) throw new Error("Missing prompt. Pass text or use --message-file <path>.");
	return positionalMessage;
}
function projectAgentExecPayload(payload) {
	return {
		...typeof payload.text === "string" ? { text: payload.text } : {},
		...payload.mediaUrl !== void 0 ? { mediaUrl: payload.mediaUrl } : {},
		...Array.isArray(payload.mediaUrls) ? { mediaUrls: [...payload.mediaUrls] } : {},
		...payload.isError === true ? { isError: true } : {},
		...payload.isReasoning === true ? { isReasoning: true } : {},
		...payload.isCommentary === true ? { isCommentary: true } : {}
	};
}
function finalTextFromResult(result, payloads, allowMetadataFallback) {
	return payloads.filter((payload) => payload.isError !== true && payload.isReasoning !== true && payload.isCommentary !== true && typeof payload.text === "string" && payload.text.trim().length > 0).map((payload) => payload.text.trimEnd()).join("\n") || (allowMetadataFallback ? result.meta.finalAssistantVisibleText?.trimEnd() : "") || "";
}
function firstErrorPayload(result) {
	return result.payloads?.find((payload) => payload.isError === true);
}
/** Classify an embedded result into the strict `agent exec` process contract. */
function classifyAgentExecResult(result, fallbackExhausted = false, projectedErrorPayload) {
	const meta = result.meta;
	const errorPayload = firstErrorPayload(result);
	const errorPayloadMessage = typeof projectedErrorPayload === "string" ? projectedErrorPayload : typeof errorPayload?.text === "string" && errorPayload.text.trim() ? errorPayload.text : void 0;
	const hasErrorPayload = projectedErrorPayload !== void 0 || errorPayload !== void 0;
	const payloads = (result.payloads ?? []).map(projectAgentExecPayload);
	if (typeof projectedErrorPayload === "string") {
		const projectedErrorIndex = payloads.findIndex((payload) => payload.isError !== true && payload.text === projectedErrorPayload);
		if (projectedErrorIndex >= 0) payloads[projectedErrorIndex] = {
			...payloads[projectedErrorIndex],
			isError: true
		};
	}
	const timeout = meta.stopReason === "timeout" || meta.timeoutPhase !== void 0;
	const failed = fallbackExhausted || meta.aborted === true || meta.error !== void 0 || meta.stopReason === "error" || hasErrorPayload;
	const status = timeout ? "timeout" : failed ? "error" : "ok";
	const errorMessage = timeout ? meta.error?.message ?? errorPayloadMessage ?? "Agent run timed out" : fallbackExhausted ? meta.error?.message ?? errorPayloadMessage ?? "All model fallback candidates failed" : meta.error?.message ?? errorPayloadMessage ?? (failed ? "Agent run failed" : void 0);
	const errorKind = timeout ? "timeout" : fallbackExhausted ? "fallback_exhausted" : meta.error?.kind ? meta.error.kind : meta.aborted ? "aborted" : hasErrorPayload ? "error_payload" : failed ? "agent_error" : void 0;
	const agentMeta = meta.agentMeta;
	return {
		ok: status === "ok",
		status,
		final: finalTextFromResult(result, payloads, !hasErrorPayload),
		payloads,
		...agentMeta?.usage ? { usage: agentMeta.usage } : {},
		...agentMeta?.costUsd !== void 0 ? { costUsd: agentMeta.costUsd } : {},
		...agentMeta?.codeModeEngaged !== void 0 ? { codeModeEngaged: agentMeta.codeModeEngaged } : {},
		...agentMeta?.assistantTurns !== void 0 ? { assistantTurns: agentMeta.assistantTurns } : {},
		...agentMeta?.bridgeCalls ? { bridgeCalls: agentMeta.bridgeCalls } : {},
		...meta.toolSummary ? { toolSummary: meta.toolSummary } : {},
		model: agentMeta?.model ?? null,
		provider: agentMeta?.provider ?? null,
		sessionId: agentMeta?.sessionId ?? "",
		...errorMessage && errorKind ? { error: {
			message: errorMessage,
			kind: errorKind
		} } : {}
	};
}
function exitCodeForEnvelope(envelope) {
	return envelope.status === "ok" ? 0 : envelope.status === "timeout" ? 2 : 1;
}
function normalizeCodeMode(value) {
	if (value === void 0) return;
	if (value === "direct") return false;
	if (value === "auto") return "auto";
	if (value === "code") return true;
	throw new Error("--code-mode must be one of direct, auto, code.");
}
/**
* Facts owned by this invocation rather than by any config, so they win over
* both the ambient config and `--config`: exec is always scoped to the folder
* it was pointed at, a one-shot turn never bootstraps, and explicit flags
* outrank whatever the resolved config says.
*/
/**
* Drops inherited state and workspace location overrides, which outrank the
* facts this invocation owns. `session.store` and `agentDir` can redirect state
* outside the invocation root, where its lock or temporary cleanup cannot own
* it; a native harness `runtime.acp.cwd` can make the turn edit the wrong repo.
* `agents.bindings[].acp.cwd` needs no equivalent because exec runs no channel,
* so no binding matches.
*/
function stripInheritedAgentLocations(base) {
	const { session, ...root } = base;
	const { store: _store, ...sessionWithoutStore } = session ?? {};
	const withoutSessionStore = session ? {
		...root,
		session: sessionWithoutStore
	} : base;
	const entries = withoutSessionStore.agents?.entries;
	if (!entries) return withoutSessionStore;
	return {
		...withoutSessionStore,
		agents: {
			...withoutSessionStore.agents,
			entries: Object.fromEntries(Object.entries(entries).map(([id, entry]) => {
				const { agentDir: _agentDir, runtime, ...rest } = entry;
				if (runtime?.type !== "acp" || runtime.acp?.cwd === void 0) return [id, {
					...rest,
					...runtime ? { runtime } : {}
				}];
				const { cwd: _cwd, ...acp } = runtime.acp;
				return [id, {
					...rest,
					runtime: {
						...runtime,
						acp
					}
				}];
			}))
		}
	};
}
function buildExecRunOverlay(params) {
	const codeMode = normalizeCodeMode(params.opts.codeMode);
	const entries = Object.keys(params.base.agents?.entries ?? {});
	return {
		agents: {
			defaults: {
				workspace: params.cwd,
				skipBootstrap: true,
				...params.opts.localModelLean ? { experimental: { localModelLean: true } } : {}
			},
			...entries.length > 0 ? { entries: Object.fromEntries(entries.map((id) => [id, { workspace: params.cwd }])) } : {}
		},
		skills: { load: { watch: false } },
		...codeMode !== void 0 ? { tools: { codeMode } } : {}
	};
}
/**
* Coding one-shot defaults. These merge *under* the resolved config so an
* operator who configured a tool profile, shell env, or sandbox keeps it;
* notably exec must never downgrade a configured sandbox to `off`.
*/
function buildExecConfigDefaults() {
	return {
		env: { shellEnv: { enabled: false } },
		agents: { defaults: { sandbox: { mode: "off" } } },
		tools: {
			profile: "coding",
			fs: { workspaceOnly: true },
			exec: { mode: "full" }
		}
	};
}
/**
* Resolves the config exec runs against. Default is the ambient config, so a
* one-shot turn behaves like other folder-scoped coding CLIs and can reach
* configured providers, credentials, and `agentRuntime` harness choices.
*
* `--auth-env-only` opts out of that inheritance entirely rather than trying to
* launder the resolved config. A config is a credential store by design -- API
* keys, secret headers, request auth, an inline `env` block, and login-shell
* import all feed provider auth -- so the only closed way to promise
* environment-only credentials is to not read it.
*/
async function resolveExecBaseConfig(opts) {
	if (opts.config && (opts.isolated || opts.authEnvOnly === true)) {
		const conflicting = opts.isolated ? "--isolated" : "--auth-env-only";
		throw new Error(`--config cannot be combined with ${conflicting}.`);
	}
	if (opts.isolated || opts.authEnvOnly === true) {
		const { migratePersistedImplicitMainRoster } = await import("./legacy.roster-yZbs6qJ-.js");
		const { coerceConfig } = await import("./io.read-helpers-DXwGQ_GU.js");
		return coerceConfig(migratePersistedImplicitMainRoster({}).config);
	}
	const { createConfigIO, getRuntimeConfig } = await import("./io-DS-dUNoh.js");
	if (!opts.config) return getRuntimeConfig();
	const io = createConfigIO({ configPath: path.resolve(opts.config) });
	if (!existsSync(io.configPath)) throw new Error(`--config file not found: ${io.configPath}`);
	return io.loadConfig();
}
function buildExecRunConfig(params) {
	const opts = params.opts ?? {};
	const base = stripInheritedAgentLocations(params.base);
	return mergeDeep(mergeDeep(buildExecConfigDefaults(), base), buildExecRunOverlay({
		base,
		cwd: params.cwd,
		opts
	}));
}
function normalizeTimeoutSeconds(value) {
	const raw = value ?? String(AGENT_EXEC_DEFAULT_TIMEOUT_SECONDS);
	if (parseStrictNonNegativeInteger(raw) === void 0) throw new Error("--timeout must be a non-negative integer in seconds.");
	return raw;
}
function normalizeFallbacks(model, values) {
	const fallbacks = (values ?? []).map((value) => value.trim()).filter(Boolean);
	if (fallbacks.length > 0 && !model?.trim()) throw new Error("--fallback requires --model so the primary model is explicit.");
	return fallbacks;
}
async function requireDirectory(value, label) {
	const resolved = path.resolve(value);
	let stat;
	try {
		stat = await fs$1.stat(resolved);
	} catch (error) {
		throw new Error(`${label} does not exist: ${resolved}`, { cause: error });
	}
	if (!stat.isDirectory()) throw new Error(`${label} is not a directory: ${resolved}`);
	return resolved;
}
function setAgentExecEnvironment(params) {
	const previousStateDir = process.env.OPENCLAW_STATE_DIR;
	const previousConfigPath = process.env.OPENCLAW_CONFIG_PATH;
	const previousWorkspaceDir = process.env.OPENCLAW_WORKSPACE_DIR;
	process.env.OPENCLAW_STATE_DIR = params.stateDir;
	delete process.env.OPENCLAW_CONFIG_PATH;
	process.env.OPENCLAW_WORKSPACE_DIR = params.cwd;
	return () => {
		if (previousStateDir === void 0) delete process.env.OPENCLAW_STATE_DIR;
		else process.env.OPENCLAW_STATE_DIR = previousStateDir;
		if (previousConfigPath === void 0) delete process.env.OPENCLAW_CONFIG_PATH;
		else process.env.OPENCLAW_CONFIG_PATH = previousConfigPath;
		if (previousWorkspaceDir === void 0) delete process.env.OPENCLAW_WORKSPACE_DIR;
		else process.env.OPENCLAW_WORKSPACE_DIR = previousWorkspaceDir;
	};
}
function formatActiveGatewayExecRefusal(identity) {
	return `A Gateway is running for this state directory (pid ${identity.pid}, port ${identity.port}). Omit --state-dir to use isolated temporary state, or stop the Gateway first (${formatCliCommand("openclaw gateway stop")}).`;
}
function isStructuredTimeoutError(error) {
	if (findAgentRunTerminalOutcome(error)?.status === "timeout") return true;
	let candidate = error;
	for (let depth = 0; depth < 4; depth += 1) {
		if (!candidate || typeof candidate !== "object") return false;
		const record = candidate;
		if (record.name === "TimeoutError" || record.code === "ETIMEDOUT" || record.reason === "timeout") return true;
		candidate = record.cause;
	}
	return false;
}
function errorEnvelope(error, sessionId) {
	const status = isStructuredTimeoutError(error) ? "timeout" : "error";
	return {
		ok: false,
		status,
		final: "",
		payloads: [],
		model: null,
		provider: null,
		sessionId,
		error: {
			message: formatErrorMessage(error),
			kind: status === "timeout" ? "timeout" : "exception"
		}
	};
}
function writeAgentExecOutput(runtime, envelope, json) {
	if (json) writeRuntimeJson(runtime, envelope);
	else if (envelope.final) writeRuntimeStdout(runtime, envelope.final);
	if (!envelope.ok && envelope.error) runtime.error(envelope.error.message);
}
/** Run one isolated embedded agent turn and project its stable CLI result. */
async function agentExecCommand(positionalMessage, opts, runtime, deps = {}) {
	const sessionId = randomUUID();
	let commandResult;
	let temporaryStateDir;
	let restoreEnvironment;
	let restoreConfigEnvironment;
	let restoreRuntimeConfigSnapshot;
	let runtimePaths;
	let configIo;
	let stopLocalAuditWriter;
	let stateLock;
	let signalBridge;
	try {
		const prompt = await resolveAgentExecPrompt(positionalMessage, opts.messageFile, deps.stdin ?? process.stdin);
		const cwd = await requireDirectory(opts.cwd ?? process.cwd(), "Working directory");
		const stateDir = opts.stateDir ? await requireDirectory(opts.stateDir, "State directory") : await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-agent-exec-"));
		temporaryStateDir = opts.stateDir ? void 0 : stateDir;
		configIo = await import("./io-DS-dUNoh.js");
		const previousRuntimeConfigSnapshot = configIo.getRuntimeConfigSnapshot();
		const snapshotIo = configIo;
		restoreRuntimeConfigSnapshot = () => {
			if (previousRuntimeConfigSnapshot) snapshotIo.setRuntimeConfigSnapshot(previousRuntimeConfigSnapshot);
			else snapshotIo.clearRuntimeConfigSnapshot();
		};
		const { restoreEnvChangesIfUnchanged, snapshotEnv } = configIo;
		const envBeforeConfigLoad = snapshotEnv(process.env);
		const baseConfig = await resolveExecBaseConfig(opts);
		const envAfterConfigLoad = snapshotEnv(process.env);
		restoreConfigEnvironment = () => restoreEnvChangesIfUnchanged({
			env: process.env,
			before: envBeforeConfigLoad,
			after: envAfterConfigLoad
		});
		const runConfig = buildExecRunConfig({
			base: baseConfig,
			cwd,
			opts
		});
		const pluginInstallContext = opts.isolated !== true && opts.authEnvOnly !== true ? await import("./install-root-context-CM3Fz7lx.js") : void 0;
		const pluginInstallRoots = pluginInstallContext?.resolvePluginInstallRoots();
		const timeout = normalizeTimeoutSeconds(opts.timeout);
		const fallbacks = normalizeFallbacks(opts.model, opts.fallback);
		const { resolveAgentDir, resolveAmbientOwnerAgentId } = await import("./agent-scope-config-BzhjOyi7.js");
		const execAgentId = resolveAmbientOwnerAgentId(baseConfig, void 0, {
			surface: "agent exec",
			hint: "Set agents.defaults.systemAgent.agentId."
		});
		const storedAuthAgentDir = resolveAgentDir(baseConfig, execAgentId);
		runtimePaths = await import("./paths-DHUSIAJh.js");
		const storedAuthStateDir = runtimePaths.resolveStateDir();
		restoreEnvironment = setAgentExecEnvironment({
			stateDir,
			cwd
		});
		runtimePaths.pinRuntimePaths();
		if (opts.stateDir) {
			const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-jf6c1djH.js");
			signalBridge = createEmbeddedStateSignalBridge(deps.process ?? process);
			stateLock = await acquireEmbeddedStateLock({
				options: deps.gatewayLockOptions,
				signal: signalBridge.signal,
				formatActiveGatewayRefusal: formatActiveGatewayExecRefusal
			});
		}
		snapshotIo.setRuntimeConfigSnapshot(runConfig);
		if (isExecutionIdentityCollectionEnabled(runConfig)) try {
			stopLocalAuditWriter = (await import("./agent-local-audit-BsnK3ZN6.js")).startAgentLocalAuditWriter({ stateDir });
		} catch {}
		const [{ withAuthProfileStoreAgentDir, withEnvOnlyAuthProfileStore }, { withHostExecInheritedEnvOmitted }, { listKnownProviderAuthEnvVarNames }, runAgent] = await Promise.all([
			import("./auth-profiles-DgV55Au6.js"),
			import("./host-env-security-B23eCvGK.js"),
			import("./provider-env-vars-DKOPE0wz.js"),
			deps.runAgent ? Promise.resolve(deps.runAgent) : import("./agent-Cbw5t--m.js").then((module) => module.agentCommand)
		]);
		let fallbackExhausted = false;
		let resultErrorPayload;
		const silentRuntime = {
			log: () => {},
			error: (...args) => runtime.error(...args),
			exit: (code, exitOpts) => runtime.exit(code, exitOpts)
		};
		const invoke = async () => await runAgent({
			message: prompt,
			sessionId,
			agentId: execAgentId,
			workspaceDir: cwd,
			cwd,
			model: opts.model,
			thinking: opts.thinking,
			timeout,
			modelFallbacksOverride: fallbacks.length > 0 ? fallbacks : void 0,
			cleanupBundleMcpOnRunEnd: true,
			cleanupCliLiveSessionOnRunEnd: true,
			oneShotCliRun: true,
			abortSignal: signalBridge?.signal,
			onModelFallbackExhausted: () => {
				fallbackExhausted = true;
			},
			onResultErrorPayload: (message) => {
				resultErrorPayload = message ?? true;
			}
		}, silentRuntime);
		const runWithPluginInstallRoots = () => pluginInstallContext && pluginInstallRoots ? pluginInstallContext.withPluginInstallRoots(pluginInstallRoots, invoke) : invoke();
		const runWithAuthScope = () => opts.authEnvOnly === true ? withEnvOnlyAuthProfileStore(runWithPluginInstallRoots) : withAuthProfileStoreAgentDir(storedAuthAgentDir, storedAuthStateDir, runWithPluginInstallRoots);
		const result = await withHostExecInheritedEnvOmitted(listKnownProviderAuthEnvVarNames({ env: process.env }), runWithAuthScope);
		if (!result) throw new Error("Agent run returned no result");
		const envelope = classifyAgentExecResult(result, fallbackExhausted, resultErrorPayload);
		if (!envelope.sessionId) envelope.sessionId = sessionId;
		commandResult = {
			envelope,
			exitCode: exitCodeForEnvelope(envelope)
		};
	} catch (error) {
		const envelope = errorEnvelope(error, sessionId);
		commandResult = {
			envelope,
			exitCode: exitCodeForEnvelope(envelope)
		};
	}
	let cleanupError;
	await stopLocalAuditWriter?.().catch(() => void 0);
	await stateLock?.release().catch((error) => {
		cleanupError ??= error;
	});
	const runCleanupStep = (step) => {
		try {
			step();
		} catch (error) {
			cleanupError ??= error;
		}
	};
	runCleanupStep(() => restoreEnvironment?.());
	runCleanupStep(() => restoreConfigEnvironment?.());
	runCleanupStep(() => configIo?.clearConfigCache());
	runCleanupStep(() => restoreRuntimeConfigSnapshot ? restoreRuntimeConfigSnapshot() : configIo?.clearRuntimeConfigSnapshot());
	runCleanupStep(() => runtimePaths?.pinRuntimePaths());
	if (temporaryStateDir) try {
		await fs$1.rm(temporaryStateDir, {
			recursive: true,
			force: true
		});
	} catch (error) {
		cleanupError ??= error;
	}
	if (cleanupError) {
		const envelope = errorEnvelope(/* @__PURE__ */ new Error(`Agent exec cleanup failed: ${formatErrorMessage(cleanupError)}`), sessionId);
		commandResult = {
			envelope,
			exitCode: exitCodeForEnvelope(envelope)
		};
	}
	const receivedSignal = signalBridge?.getReceivedSignal();
	signalBridge?.dispose();
	if (receivedSignal) {
		runtime.exit(receivedSignal === "SIGINT" ? 130 : 143, { resetStream: process.stderr });
		return commandResult;
	}
	writeAgentExecOutput(runtime, commandResult.envelope, opts.json === true);
	return commandResult;
}
//#endregion
export { agentExecCommand };
