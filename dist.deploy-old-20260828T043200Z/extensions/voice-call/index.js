import { r as isGatewayTransportError } from "../../transport-error-D_LRKgla.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { o as redactSensitiveUrlLikeString } from "../../redact-sensitive-url-BN1NZvXG.js";
import { a as asOptionalRecord, c as isRecord, t as asNonArrayRecord } from "../../record-coerce-DItp3I4t.js";
import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs, R as timestampMsToIsoString, a as addTimerTimeoutGraceMs, m as clampTimerTimeoutMs } from "../../number-coercion-CLj0HTDM.js";
import { t as sleep } from "../../sleep-D7nua6TP.js";
import { t as MAX_TCP_PORT } from "../../tcp-port-C3gLZtJi.js";
import { r as formatErrorMessage } from "../../errors-Ccx0R-_Z.js";
import { i as resolveGlobalSingleton } from "../../global-singleton-Dc_stLtU.js";
import { n as normalizeAgentId } from "../../agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "../../session-key-utils-Di3FvABa.js";
import { n as callGatewayFromCli } from "../../gateway-rpc-4LDXqcsd.js";
import { t as ErrorCodes } from "../../gateway-error-details-C2IaYyht.js";
import { f as isGatewayClientRequestError } from "../../call-Bwn2P4nz.js";
import { d as errorShape } from "../../validation-errors-rELRlKfn.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import "../../error-runtime-CmA1H4Zg.js";
import "../../number-runtime-Cy4drVnh.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import "../../routing-DM8631ts.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import "../../gateway-runtime-CwascfPd.js";
import "../../global-singleton-n3T4_y1q.js";
import "../../api-BAzSVPvK.js";
import { t as VOICE_CALL_CLI_DESCRIPTOR } from "../../cli-output-mode-CpMZs2b4.js";
import { i as resolveVoiceCallConfig, l as resolveVoiceCallStreamExposurePaths, t as VoiceCallConfigSchema, u as validateProviderConfig } from "../../config-D5MzA5kB.js";
import { a as setupTailscaleExposureRoutes, i as getTailscaleSelfInfo, n as resolveWebhookExposureStatus, r as cleanupTailscaleExposureRoute, s as resolveUserPath, t as createVoiceCallRuntime } from "../../runtime-entry-DMnNQ0-P.js";
import { b as setVoiceCallStateRuntime, d as loadActiveCallsFromStore, l as findCallMatchesInStore, t as resolveDefaultVoiceCallStoreDir, u as getCallHistoryFromStore } from "../../store-path-BQPRjX1e.js";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { format } from "node:util";
import { StringDecoder } from "node:string_decoder";
import { Type } from "typebox";
//#region extensions/voice-call/src/cli-command-io.ts
function writeCliLine(...values) {
	process.stdout.write(`${format(...values)}\n`);
}
function writeCliJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function parseCliInteger(raw, optionName, opts) {
	const min = opts?.min ?? 0;
	const parsed = parseStrictNonNegativeInteger(raw?.trim() ?? "");
	if (parsed === void 0 || parsed < min || opts?.max !== void 0 && parsed > opts.max) throw new Error(`Invalid numeric value for ${optionName}: ${raw ?? ""}`);
	return parsed;
}
//#endregion
//#region extensions/voice-call/src/cli-call-log.ts
function percentile(values, p) {
	if (values.length === 0) return 0;
	const sorted = [...values].toSorted((a, b) => a - b);
	return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p / 100 * sorted.length) - 1))] ?? 0;
}
function summarizeSeries(values) {
	if (values.length === 0) return {
		count: 0,
		minMs: 0,
		maxMs: 0,
		avgMs: 0,
		p50Ms: 0,
		p95Ms: 0
	};
	const minMs = values.reduce((min, value) => value < min ? value : min);
	const maxMs = values.reduce((max, value) => value > max ? value : max);
	const avgMs = values.reduce((sum, value) => sum + value, 0) / values.length;
	return {
		count: values.length,
		minMs,
		maxMs,
		avgMs,
		p50Ms: percentile(values, 50),
		p95Ms: percentile(values, 95)
	};
}
function writeVoiceCallLatencySummary(calls) {
	const turnLatencyMs = [];
	const listenWaitMs = [];
	for (const call of calls) {
		const metadata = isRecord(call) && isRecord(call.metadata) ? call.metadata : void 0;
		const latency = metadata?.lastTurnLatencyMs;
		const listenWait = metadata?.lastTurnListenWaitMs;
		if (typeof latency === "number" && Number.isFinite(latency)) turnLatencyMs.push(latency);
		if (typeof listenWait === "number" && Number.isFinite(listenWait)) listenWaitMs.push(listenWait);
	}
	writeCliJson({
		recordsScanned: calls.length,
		turnLatency: summarizeSeries(turnLatencyMs),
		listenWait: summarizeSeries(listenWaitMs)
	});
}
function registerVoiceCallLogs(params) {
	params.root.command("tail").description("Tail voice-call JSONL logs (prints new lines; useful during provider tests)").option("--file <path>", "Path to calls.jsonl", params.defaultFile).option("--since <n>", "Print last N lines first", "25").option("--poll <ms>", "Poll interval in ms", "250").action(async (options) => {
		const file = options.file;
		const since = parseCliInteger(options.since, "--since", { min: 0 });
		const pollMs = parseCliInteger(options.poll, "--poll", { min: 50 });
		const tailSqliteHistory = async (initialLimit) => {
			params.ensureHistoryStateRuntime();
			const seen = /* @__PURE__ */ new Set();
			const printCall = (call) => {
				const line = JSON.stringify(call);
				if (!seen.has(line)) {
					seen.add(line);
					writeCliLine(line);
				}
			};
			if (initialLimit > 0) for (const call of await getCallHistoryFromStore(path.dirname(file), initialLimit)) printCall(call);
			for (;;) {
				try {
					for (const call of await getCallHistoryFromStore(path.dirname(file), 1e3)) printCall(call);
				} catch {}
				await sleep(pollMs);
			}
		};
		if (fs.existsSync(file) && path.basename(file) !== "calls.jsonl") {
			const initial = fs.readFileSync(file);
			let decoder = new StringDecoder("utf8");
			const initialLines = decoder.write(initial).split("\n");
			let pendingLine = initialLines.pop() ?? "";
			const lines = initialLines.filter(Boolean);
			for (const line of lines.slice(Math.max(0, lines.length - since))) writeCliLine(line);
			let offset = initial.length;
			let lastObservedSize = initial.length;
			for (;;) {
				try {
					const stat = fs.statSync(file);
					if (stat.size < lastObservedSize) {
						offset = 0;
						decoder = new StringDecoder("utf8");
						pendingLine = "";
					}
					lastObservedSize = stat.size;
					if (stat.size > offset) {
						const fd = fs.openSync(file, "r");
						try {
							const buf = Buffer.alloc(stat.size - offset);
							const bytesRead = fs.readSync(fd, buf, 0, buf.length, offset);
							offset += bytesRead;
							const text = decoder.write(buf.subarray(0, bytesRead));
							const completeLines = `${pendingLine}${text}`.split("\n");
							pendingLine = completeLines.pop() ?? "";
							for (const line of completeLines.filter(Boolean)) writeCliLine(line);
						} finally {
							fs.closeSync(fd);
						}
					}
				} catch {}
				await sleep(pollMs);
			}
		} else await tailSqliteHistory(since);
	});
	params.root.command("latency").description("Summarize turn latency metrics from voice-call JSONL logs").option("--file <path>", "Path to calls.jsonl", params.defaultFile).option("--last <n>", "Analyze last N records", "200").action(async (options) => {
		const file = options.file;
		const last = parseCliInteger(options.last, "--last", { min: 1 });
		if (fs.existsSync(file) && path.basename(file) !== "calls.jsonl") writeVoiceCallLatencySummary(fs.readFileSync(file, "utf8").split("\n").filter(Boolean).slice(-last).map((line) => {
			try {
				const parsed = JSON.parse(line);
				return (isRecord(parsed) ? parsed.call : void 0) ?? parsed;
			} catch {
				return null;
			}
		}).filter((call) => call !== null));
		else {
			params.ensureHistoryStateRuntime();
			writeVoiceCallLatencySummary(await getCallHistoryFromStore(path.dirname(file), last));
		}
	});
}
//#endregion
//#region extensions/voice-call/src/cli-gateway-call.ts
const VOICE_CALL_GATEWAY_DEFAULT_TIMEOUT_MS = 5e3;
const VOICE_CALL_GATEWAY_OPERATION_TIMEOUT_MS = 3e4;
const VOICE_CALL_GATEWAY_TRANSCRIPT_BUFFER_MS = 1e4;
const VOICE_CALL_GATEWAY_POLL_INTERVAL_MS = 1e3;
function isGatewayUnavailableForLocalFallback(err) {
	return isGatewayTransportError(err) && err.kind === "closed" && (err.code === void 0 || err.code === 1006);
}
function isGatewayCredentialFailure(err) {
	return err instanceof Error && (err.name === "GatewayCredentialsRequiredError" || err.name === "GatewayExplicitAuthRequiredError" || err.name === "GatewaySecretRefUnavailableError");
}
function gatewayOperationalError(err) {
	const message = formatErrorMessage(err);
	const detail = (() => {
		if (isGatewayClientRequestError(err)) return `Gateway responded but voicecall failed: ${message}\nThe running Gateway owns the voice-call runtime; check \`openclaw gateway status\` or restart it.`;
		if (isGatewayCredentialFailure(err)) return `Gateway requires credentials: ${message}\nConfigure gateway.auth or pair this device with \`openclaw devices approve --latest\`.`;
		if (isGatewayTransportError(err)) {
			const url = err.connectionDetails.url;
			if (err.kind === "timeout") return `Gateway at ${url} did not answer within ${err.timeoutMs === void 0 ? "the configured timeout" : `${err.timeoutMs}ms`}: ${message}\nIt may be starting or wedged; check \`openclaw gateway status\`.`;
			return `Gateway connection at ${url} failed: ${message}\nCheck gateway.auth and \`openclaw gateway status\`, then retry.`;
		}
		return `Gateway voicecall request failed: ${message}\nCheck \`openclaw gateway status\`, then retry.`;
	})();
	return new Error(redactSensitiveUrlLikeString(detail));
}
function isUnknownMethod(err, method) {
	return formatErrorMessage(err).includes(`unknown method: ${method}`);
}
async function callVoiceCallGateway(method, params, opts) {
	try {
		const timeoutMs = typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? Math.max(1, Math.ceil(opts.timeoutMs)) : VOICE_CALL_GATEWAY_DEFAULT_TIMEOUT_MS;
		return {
			ok: true,
			payload: await callGatewayFromCli(method, {
				json: true,
				timeout: String(timeoutMs)
			}, params, { progress: false })
		};
	} catch (err) {
		if (isGatewayUnavailableForLocalFallback(err)) return {
			ok: false,
			error: err
		};
		throw gatewayOperationalError(err);
	}
}
function resolveOperationTimeout(config) {
	return Math.max(VOICE_CALL_GATEWAY_OPERATION_TIMEOUT_MS, addTimerTimeoutGraceMs(config.ringTimeoutMs) ?? 1);
}
function resolveContinueTimeout(config) {
	return clampTimerTimeoutMs(config.transcriptTimeoutMs + VOICE_CALL_GATEWAY_OPERATION_TIMEOUT_MS + VOICE_CALL_GATEWAY_TRANSCRIPT_BUFFER_MS) ?? 1;
}
function resolveVoiceCallDeadlineMs(timeoutMs, nowMs = Date.now()) {
	return nowMs + (clampTimerTimeoutMs(timeoutMs) ?? 2147e6);
}
function readGatewayOperationId(payload) {
	if (isRecord(payload) && typeof payload.operationId === "string" && payload.operationId) return payload.operationId;
	throw new Error("voicecall gateway response missing operationId");
}
function readGatewayPollTimeoutMs(payload, fallbackTimeoutMs) {
	if (isRecord(payload) && typeof payload.pollTimeoutMs === "number") return clampTimerTimeoutMs(payload.pollTimeoutMs) ?? fallbackTimeoutMs;
	return fallbackTimeoutMs;
}
function readCompletedContinueResult(payload) {
	if (!isRecord(payload)) throw new Error("voicecall gateway response missing operation status");
	if (payload.status === "pending") return { status: "pending" };
	if (payload.status === "failed") return {
		status: "failed",
		error: typeof payload.error === "string" ? payload.error : "continue failed"
	};
	if (payload.status === "completed") return {
		status: "completed",
		result: payload.result
	};
	throw new Error("voicecall gateway response has unknown operation status");
}
async function pollContinueGateway(payload, fallbackTimeoutMs) {
	if (!isRecord(payload) || typeof payload.operationId !== "string") return payload;
	const params = {
		operationId: readGatewayOperationId(payload),
		timeoutMs: readGatewayPollTimeoutMs(payload, fallbackTimeoutMs)
	};
	const deadlineMs = resolveVoiceCallDeadlineMs(params.timeoutMs);
	for (;;) {
		const remainingMs = deadlineMs - Date.now();
		if (remainingMs <= 0) break;
		const gateway = await callVoiceCallGateway("voicecall.continue.result", { operationId: params.operationId }, { timeoutMs: Math.min(VOICE_CALL_GATEWAY_DEFAULT_TIMEOUT_MS, remainingMs) });
		if (!gateway.ok) throw new Error(`gateway unavailable while waiting for voicecall continue result: ${formatErrorMessage(gateway.error)}`);
		const result = readCompletedContinueResult(gateway.payload);
		if (result.status === "completed") return result.result;
		if (result.status === "failed") throw new Error(result.error);
		const sleepMs = Math.min(VOICE_CALL_GATEWAY_POLL_INTERVAL_MS, deadlineMs - Date.now());
		if (sleepMs <= 0) break;
		await sleep(sleepMs);
	}
	throw new Error("voicecall continue timed out waiting for gateway operation");
}
async function ensureStandaloneRuntime(params) {
	try {
		return await params.ensureRuntime();
	} catch (err) {
		if (err instanceof Error && "code" in err && err.code === "EADDRINUSE") throw new Error(`Voice-call webhook port ${params.config.serve.port} is already in use. A running Gateway probably already serves it; operational commands route through that Gateway. Check \`openclaw gateway status\` and retry.`, { cause: err });
		throw err;
	}
}
async function runGatewayManagerCommand(params) {
	const gateway = await params.gatewayCall();
	if (gateway.ok) {
		writeCliJson(params.resolveGatewayPayload ? await params.resolveGatewayPayload(gateway.payload) : gateway.payload);
		return;
	}
	const runtime = await ensureStandaloneRuntime(params);
	const result = await params.managerFallback(runtime.manager);
	if (!result.success) throw new Error(result.error || `${params.failureLabel} failed`);
	writeCliJson(result);
}
function readGatewayCallId(payload, invalidCallIdMessage) {
	if (isRecord(payload) && typeof payload.callId === "string") {
		if (!invalidCallIdMessage || payload.callId) return payload.callId;
	}
	if (invalidCallIdMessage) throw new Error(invalidCallIdMessage);
	if (isRecord(payload) && typeof payload.error === "string") throw new Error(payload.error);
	throw new Error("voicecall gateway response missing callId");
}
async function initiateVoiceCall(params) {
	const mode = params.mode === "notify" || params.mode === "conversation" ? params.mode : params.defaultMode;
	const gateway = await callVoiceCallGateway(params.method, {
		...params.to ? { to: params.to } : {},
		...params.message ? { message: params.message } : {},
		...mode ? { mode } : {}
	}, { timeoutMs: resolveOperationTimeout(params.config) });
	if (gateway.ok) return readGatewayCallId(gateway.payload, params.failureMessage);
	const runtime = await ensureStandaloneRuntime(params);
	const to = params.to ?? runtime.config.toNumber;
	if (!to) throw new Error("Missing --to and no toNumber configured");
	const result = await runtime.manager.initiateCall(to, void 0, {
		message: params.message,
		mode
	});
	if (!result.success) throw new Error(result.error || params.failureMessage || "initiate failed");
	if (params.failureMessage && !result.callId) throw new Error(params.failureMessage);
	return result.callId;
}
//#endregion
//#region extensions/voice-call/src/cli.ts
function resolveMode(input) {
	const raw = normalizeOptionalLowercaseString(input) ?? "";
	if (raw === "serve" || raw === "off") return raw;
	return "funnel";
}
function resolveDefaultStorePath(config) {
	const base = config.store?.trim() ? resolveUserPath(config.store) : resolveDefaultVoiceCallStoreDir();
	return path.join(base, "calls.jsonl");
}
function buildSetupStatus(config) {
	const validation = validateProviderConfig(config);
	const webhookExposure = resolveWebhookExposureStatus(config);
	const checks = [
		{
			id: "plugin-enabled",
			ok: config.enabled,
			message: config.enabled ? "Voice Call plugin is enabled" : "Enable plugins.entries.voice-call.enabled"
		},
		{
			id: "provider",
			ok: Boolean(config.provider),
			message: config.provider ? `Provider configured: ${config.provider}` : "Set plugins.entries.voice-call.config.provider"
		},
		{
			id: "provider-config",
			ok: validation.valid,
			message: validation.valid ? "Provider credentials/config look complete" : validation.errors.join("; ")
		},
		{
			id: "webhook-exposure",
			ok: webhookExposure.ok,
			message: webhookExposure.message
		},
		{
			id: "mode",
			ok: !(config.streaming.enabled && config.realtime.enabled),
			message: config.streaming.enabled && config.realtime.enabled ? "streaming.enabled and realtime.enabled cannot both be true" : config.realtime.enabled ? `Realtime voice enabled (${config.realtime.provider ?? "first registered provider"})` : config.streaming.enabled ? `Streaming transcription enabled (${config.streaming.provider ?? "first registered provider"})` : "Notify/conversation calls use normal TTS/STT flow"
		}
	];
	return {
		ok: checks.every((check) => check.ok),
		checks
	};
}
function writeSetupStatus(status) {
	writeCliLine("Voice Call setup: %s", status.ok ? "OK" : "needs attention");
	for (const check of status.checks) writeCliLine("%s %s: %s", check.ok ? "OK" : "FAIL", check.id, check.message);
}
function registerVoiceCallCli(params) {
	const { program, config, ensureRuntime, stateRuntime } = params;
	const ensureHistoryStateRuntime = () => {
		if (stateRuntime) setVoiceCallStateRuntime({ state: stateRuntime });
	};
	const root = program.command("voicecall").description("Voice call utilities").addHelpText("after", () => `\nDocs: https://docs.openclaw.ai/cli/voicecall\n`);
	root.command("setup").description("Show Voice Call provider and webhook setup status").option("--json", "Print machine-readable JSON").action((options) => {
		const status = buildSetupStatus(config);
		if (options.json) {
			writeCliJson(status);
			return;
		}
		writeSetupStatus(status);
	});
	root.command("smoke").description("Check Voice Call readiness and optionally place a short outbound test call").option("-t, --to <phone>", "Phone number to call for a live smoke").option("--message <text>", "Message to speak during the smoke call", "OpenClaw voice call smoke test.").option("--mode <mode>", "Call mode: notify or conversation", "notify").option("--yes", "Actually place the live outbound call").option("--json", "Print machine-readable JSON").action(async (options) => {
		const setup = buildSetupStatus(config);
		if (!setup.ok) {
			if (options.json) writeCliJson({
				ok: false,
				setup
			});
			else writeSetupStatus(setup);
			process.exitCode = 1;
			return;
		}
		if (!options.to) {
			if (options.json) writeCliJson({
				ok: true,
				setup,
				liveCall: false
			});
			else {
				writeSetupStatus(setup);
				writeCliLine("live-call: skipped (pass --to and --yes to place one)");
			}
			return;
		}
		if (!options.yes) {
			if (options.json) writeCliJson({
				ok: true,
				setup,
				liveCall: false,
				wouldCall: options.to
			});
			else {
				writeSetupStatus(setup);
				writeCliLine("live-call: dry run for %s (add --yes to place it)", options.to);
			}
			return;
		}
		const callId = await initiateVoiceCall({
			ensureRuntime,
			config,
			method: "voicecall.start",
			to: options.to,
			message: options.message,
			mode: options.mode,
			defaultMode: "notify",
			failureMessage: "smoke call failed"
		});
		if (options.json) {
			writeCliJson({
				ok: true,
				setup,
				liveCall: true,
				callId
			});
			return;
		}
		writeSetupStatus(setup);
		writeCliLine("live-call: started %s", callId);
	});
	root.command("call").description("Initiate an outbound voice call").requiredOption("-m, --message <text>", "Message to speak when call connects").option("-t, --to <phone>", "Phone number to call (E.164 format, uses config toNumber if not set)").option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation").action(async (options) => {
		writeCliJson({ callId: await initiateVoiceCall({
			ensureRuntime,
			config,
			method: "voicecall.initiate",
			to: options.to,
			message: options.message,
			mode: options.mode
		}) });
	});
	root.command("start").description("Alias for voicecall call").requiredOption("--to <phone>", "Phone number to call").option("--message <text>", "Message to speak when call connects").option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation").action(async (options) => {
		writeCliJson({ callId: await initiateVoiceCall({
			ensureRuntime,
			config,
			method: "voicecall.start",
			to: options.to,
			message: options.message,
			mode: options.mode
		}) });
	});
	root.command("continue").description("Speak a message and wait for a response").requiredOption("--call-id <id>", "Call ID").requiredOption("--message <text>", "Message to speak").action(async (options) => {
		const gatewayParams = {
			callId: options.callId,
			message: options.message
		};
		const continueTimeoutMs = resolveContinueTimeout(config);
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: async () => {
				try {
					return await callVoiceCallGateway("voicecall.continue.start", gatewayParams, { timeoutMs: resolveOperationTimeout(config) });
				} catch (err) {
					if (!isUnknownMethod(err, "voicecall.continue.start")) throw err;
					return callVoiceCallGateway("voicecall.continue", gatewayParams, { timeoutMs: continueTimeoutMs });
				}
			},
			resolveGatewayPayload: (payload) => pollContinueGateway(payload, continueTimeoutMs),
			managerFallback: (manager) => manager.continueCall(options.callId, options.message),
			failureLabel: "continue"
		});
	});
	root.command("speak").description("Speak a message without waiting for response").requiredOption("--call-id <id>", "Call ID").requiredOption("--message <text>", "Message to speak").action(async (options) => {
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: () => callVoiceCallGateway("voicecall.speak", {
				callId: options.callId,
				message: options.message
			}),
			managerFallback: (manager) => manager.speak(options.callId, options.message),
			failureLabel: "speak"
		});
	});
	root.command("dtmf").description("Send DTMF digits to an active call").requiredOption("--call-id <id>", "Call ID").requiredOption("--digits <digits>", "DTMF digits").action(async (options) => {
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: () => callVoiceCallGateway("voicecall.dtmf", {
				callId: options.callId,
				digits: options.digits
			}),
			managerFallback: (manager) => manager.sendDtmf(options.callId, options.digits),
			failureLabel: "dtmf"
		});
	});
	root.command("end").description("Hang up an active call").requiredOption("--call-id <id>", "Call ID").action(async (options) => {
		await runGatewayManagerCommand({
			config,
			ensureRuntime,
			gatewayCall: () => callVoiceCallGateway("voicecall.end", { callId: options.callId }),
			managerFallback: (manager) => manager.endCall(options.callId),
			failureLabel: "end"
		});
	});
	root.command("status").description("Show call status").option("--call-id <id>", "Call ID").option("--json", "Print machine-readable JSON").action(async (options) => {
		const gateway = await callVoiceCallGateway("voicecall.status", options.callId ? { callId: options.callId } : void 0);
		if (gateway.ok) {
			if (options.callId && isRecord(gateway.payload)) {
				if (gateway.payload.found === true && "call" in gateway.payload) {
					writeCliJson(gateway.payload.call);
					return;
				}
				if (gateway.payload.found === false) {
					writeCliJson({ found: false });
					return;
				}
			}
			writeCliJson(gateway.payload);
			return;
		}
		ensureHistoryStateRuntime();
		const storePath = path.dirname(resolveDefaultStorePath(config));
		if (options.callId) {
			const persisted = await findCallMatchesInStore(storePath, options.callId);
			writeCliJson(persisted.byCallId ?? persisted.byProviderCallId ?? { found: false });
			return;
		}
		writeCliJson({
			found: true,
			calls: Array.from(loadActiveCallsFromStore(storePath).activeCalls.values())
		});
	});
	registerVoiceCallLogs({
		root,
		defaultFile: resolveDefaultStorePath(config),
		ensureHistoryStateRuntime
	});
	root.command("expose").description("Enable/disable Tailscale serve/funnel for the webhook").option("--mode <mode>", "off | serve (tailnet) | funnel (public)", "funnel").option("--path <path>", "Tailscale path to expose (recommend matching serve.path)").option("--port <port>", "Local webhook port").option("--serve-path <path>", "Local webhook path").action(async (options) => {
		const mode = resolveMode(options.mode ?? "funnel");
		const servePort = parseCliInteger(options.port ?? String(config.serve.port ?? 3334), "--port", {
			min: 1,
			max: MAX_TCP_PORT
		});
		const servePath = options.servePath ?? config.serve.path ?? "/voice/webhook";
		const tsPath = options.path ?? config.tailscale?.path ?? servePath;
		const streamExposurePaths = resolveVoiceCallStreamExposurePaths(config, {
			publicWebhookPath: tsPath,
			localWebhookPath: servePath
		});
		const streamPaths = streamExposurePaths.map(({ publicPath }) => publicPath);
		const localUrl = `http://127.0.0.1:${servePort}${servePath}`;
		if (mode === "off") {
			for (const exposurePath of [tsPath, ...streamPaths]) for (const tailscaleMode of ["serve", "funnel"]) await cleanupTailscaleExposureRoute({
				mode: tailscaleMode,
				port: config.tailscale.port,
				path: exposurePath
			});
			writeCliJson({
				ok: true,
				mode: "off",
				path: tsPath,
				streamPaths
			});
			return;
		}
		const publicUrl = await setupTailscaleExposureRoutes({
			mode,
			port: config.tailscale.port,
			routes: [{
				path: tsPath,
				localUrl
			}, ...streamExposurePaths.map(({ publicPath, localPath }) => ({
				path: publicPath,
				localUrl: `http://127.0.0.1:${servePort}${localPath}`
			}))]
		});
		const tsInfo = publicUrl ? null : await getTailscaleSelfInfo();
		const enableUrl = tsInfo?.nodeId ? `https://login.tailscale.com/f/${mode}?node=${tsInfo.nodeId}` : null;
		writeCliJson({
			ok: Boolean(publicUrl),
			mode,
			path: tsPath,
			streamPaths,
			localUrl,
			publicUrl,
			hint: publicUrl ? void 0 : {
				note: "Tailscale serve/funnel may be disabled on this tailnet (or require admin enable).",
				enableUrl
			}
		});
	});
}
//#endregion
//#region extensions/voice-call/src/command-service.ts
var VoiceCallCommandInputError = class extends Error {};
function toVoiceCallStatus(call) {
	return {
		callId: call.callId,
		...call.providerCallId !== void 0 ? { providerCallId: call.providerCallId } : {},
		provider: call.provider,
		direction: call.direction,
		state: call.state,
		startedAt: call.startedAt,
		...call.answeredAt !== void 0 ? { answeredAt: call.answeredAt } : {},
		...call.endedAt !== void 0 ? { endedAt: call.endedAt } : {},
		...call.endReason !== void 0 ? { endReason: call.endReason } : {}
	};
}
function requireInput(value, message) {
	if (!value) throw new VoiceCallCommandInputError(message);
	return value;
}
function requireSuccess(result, fallback) {
	if (!result.success) throw new Error(result.error || fallback);
}
function createVoiceCallCommandService(ensureRuntime) {
	const describeHistoricalCall = async (rt, callId) => {
		const call = await rt.manager.getCallFromMemoryOrStore(callId);
		if (!call) return;
		const endedAt = timestampMsToIsoString(call.endedAt);
		return `call is not active (${[
			`last state=${call.state}`,
			call.endReason ? `endReason=${call.endReason}` : void 0,
			endedAt ? `endedAt=${endedAt}` : void 0
		].filter(Boolean).join(", ")})`;
	};
	const resolveCallMessage = async (callId, message) => {
		const resolvedCallId = requireInput(callId, "callId and message required");
		const resolvedMessage = requireInput(message, "callId and message required");
		const rt = await ensureRuntime();
		const activeCall = rt.manager.getCall(resolvedCallId) ?? rt.manager.getCallByProviderCallId(resolvedCallId);
		if (!activeCall) throw new VoiceCallCommandInputError(await describeHistoricalCall(rt, resolvedCallId) ?? "Call not found");
		return {
			rt,
			callId: activeCall.callId,
			message: resolvedMessage
		};
	};
	const prepareContinue = async (callId, message) => {
		const request = await resolveCallMessage(callId, message);
		return {
			rt: request.rt,
			callId: request.callId,
			run: async () => {
				const result = await request.rt.manager.continueCall(request.callId, request.message);
				requireSuccess(result, "continue failed");
				return {
					success: true,
					transcript: result.transcript
				};
			}
		};
	};
	return {
		prepareContinue,
		async initiate(params, missingToMessage = "to required") {
			const rt = await ensureRuntime();
			const to = requireInput(params.to ?? rt.config.toNumber, missingToMessage);
			const result = await rt.manager.initiateCall(to, params.sessionKey, {
				message: params.message,
				mode: params.mode,
				dtmfSequence: params.dtmfSequence,
				...params.requesterSessionKey ? { requesterSessionKey: params.requesterSessionKey } : {},
				...params.agentId ? { agentId: params.agentId } : {}
			});
			requireSuccess(result, "initiate failed");
			return {
				callId: result.callId,
				initiated: true
			};
		},
		async continueCall(callId, message) {
			return await (await prepareContinue(callId, message)).run();
		},
		async speak(params) {
			const request = await resolveCallMessage(params.callId, params.message);
			if (request.rt.config.realtime.enabled) {
				const realtimeResult = request.rt.webhookServer.speakRealtime(request.callId, request.message);
				if (realtimeResult.success) return { success: true };
				if (params.allowTwimlFallback === false) return {
					success: false,
					error: realtimeResult.error ?? "Realtime bridge is not active"
				};
			}
			requireSuccess(await request.rt.manager.speak(request.callId, request.message), "speak failed");
			return { success: true };
		},
		async sendDtmf(callId, digits) {
			const resolvedCallId = requireInput(callId, "callId and digits required");
			const resolvedDigits = requireInput(digits, "callId and digits required");
			requireSuccess(await (await ensureRuntime()).manager.sendDtmf(resolvedCallId, resolvedDigits), "dtmf failed");
			return { success: true };
		},
		async endCall(callId) {
			const resolvedCallId = requireInput(callId, "callId required");
			requireSuccess(await (await ensureRuntime()).manager.endCall(resolvedCallId), "end failed");
			return { success: true };
		},
		async status(callId) {
			const rt = await ensureRuntime();
			if (!callId) return {
				found: true,
				calls: rt.manager.getActiveCalls().map(toVoiceCallStatus)
			};
			const call = await rt.manager.getCallFromMemoryOrStore(callId);
			return call ? {
				found: true,
				call: toVoiceCallStatus(call)
			} : { found: false };
		}
	};
}
//#endregion
//#region extensions/voice-call/src/gateway-continue-operation.ts
const VOICE_CALL_CONTINUE_OPERATION_BUFFER_MS = 3e4;
const VOICE_CALL_CONTINUE_OPERATION_CLEANUP_MS = 300 * 1e3;
/** Create a process-local operation store for gateway continue-call polling. */
function createVoiceCallContinueOperationStore(params) {
	const operations = /* @__PURE__ */ new Map();
	const resolvePollTimeoutMs = (rt) => {
		const ttsTimeoutMs = rt.config.tts?.timeoutMs ?? params.config.tts?.timeoutMs ?? params.coreConfig.tts?.timeoutMs ?? 8e3;
		return resolveTimerTimeoutMs((rt.config.transcriptTimeoutMs ?? params.config.transcriptTimeoutMs) + ttsTimeoutMs + VOICE_CALL_CONTINUE_OPERATION_BUFFER_MS, VOICE_CALL_CONTINUE_OPERATION_BUFFER_MS);
	};
	const scheduleCleanup = (operationId) => {
		setTimeout(() => {
			operations.delete(operationId);
		}, VOICE_CALL_CONTINUE_OPERATION_CLEANUP_MS).unref?.();
	};
	const start = (request) => {
		const operationId = randomUUID();
		const startedAtMs = Date.now();
		const pollTimeoutMs = resolvePollTimeoutMs(request.rt);
		operations.set(operationId, {
			operationId,
			status: "pending",
			callId: request.callId,
			startedAtMs,
			pollTimeoutMs
		});
		request.run().then((result) => {
			const current = operations.get(operationId);
			if (!current || current.status !== "pending") return;
			operations.set(operationId, {
				operationId,
				status: "completed",
				callId: request.callId,
				startedAtMs,
				completedAtMs: Date.now(),
				pollTimeoutMs,
				result: {
					success: true,
					transcript: result.transcript
				}
			});
		}).catch((err) => {
			const current = operations.get(operationId);
			if (!current || current.status !== "pending") return;
			operations.set(operationId, {
				operationId,
				status: "failed",
				callId: request.callId,
				startedAtMs,
				completedAtMs: Date.now(),
				pollTimeoutMs,
				error: formatErrorMessage(err)
			});
		}).finally(() => {
			scheduleCleanup(operationId);
		});
		return {
			operationId,
			status: "pending",
			pollTimeoutMs
		};
	};
	const read = (operationId) => {
		const operation = operations.get(operationId);
		if (!operation) return {
			ok: false,
			error: "operation not found"
		};
		if (operation.status === "pending") return {
			ok: true,
			payload: {
				operationId,
				status: "pending",
				pollTimeoutMs: operation.pollTimeoutMs
			}
		};
		if (operation.status === "failed") {
			operations.delete(operationId);
			return {
				ok: true,
				payload: {
					operationId,
					status: "failed",
					error: operation.error
				}
			};
		}
		operations.delete(operationId);
		return {
			ok: true,
			payload: {
				operationId,
				status: "completed",
				result: operation.result
			}
		};
	};
	return {
		start,
		read
	};
}
//#endregion
//#region extensions/voice-call/index.ts
const VOICE_CALL_WRITE_METHOD_SCOPE = { scope: "operator.write" };
const VOICE_CALL_READ_METHOD_SCOPE = { scope: "operator.read" };
const voiceCallConfigSchema = { parse(value) {
	const config = asOptionalRecord(value) ?? {};
	const enabled = typeof config.enabled === "boolean" ? config.enabled : true;
	return VoiceCallConfigSchema.parse({
		...config,
		enabled,
		provider: config.provider ?? (enabled ? "mock" : void 0)
	});
} };
const VoiceCallToolSchema = Type.Union([
	Type.Object({
		action: Type.Literal("initiate_call"),
		to: Type.Optional(Type.String({ description: "Call target" })),
		message: Type.String({ description: "Intro message" }),
		mode: Type.Optional(Type.Union([Type.Literal("notify"), Type.Literal("conversation")])),
		sessionKey: Type.Optional(Type.String({ description: "OpenClaw session key for the call" })),
		dtmfSequence: Type.Optional(Type.String({ description: "DTMF digits to play before connect" }))
	}),
	Type.Object({
		action: Type.Literal("continue_call"),
		callId: Type.String({ description: "Call ID" }),
		message: Type.String({ description: "Follow-up message" })
	}),
	Type.Object({
		action: Type.Literal("speak_to_user"),
		callId: Type.String({ description: "Call ID" }),
		message: Type.String({ description: "Message to speak" })
	}),
	Type.Object({
		action: Type.Literal("send_dtmf"),
		callId: Type.String({ description: "Call ID" }),
		digits: Type.String({ description: "DTMF digits to send" })
	}),
	Type.Object({
		action: Type.Literal("end_call"),
		callId: Type.String({ description: "Call ID" })
	}),
	Type.Object({
		action: Type.Literal("get_status"),
		callId: Type.String({ description: "Call ID" })
	}),
	Type.Object({
		mode: Type.Optional(Type.Union([Type.Literal("call"), Type.Literal("status")])),
		to: Type.Optional(Type.String({ description: "Call target" })),
		sid: Type.Optional(Type.String({ description: "Call SID" })),
		message: Type.Optional(Type.String({ description: "Optional intro message" })),
		sessionKey: Type.Optional(Type.String({ description: "OpenClaw session key for the call" })),
		dtmfSequence: Type.Optional(Type.String({ description: "DTMF digits to play before connect" }))
	})
]);
function isCliOnlyProcess() {
	return process.env.OPENCLAW_CLI === "1" && !process.argv.slice(2).includes("gateway");
}
const VOICE_CALL_RUNTIME_COORDINATOR_KEY = Symbol.for("openclaw.voice-call.runtimeCoordinator");
var VoiceCallRuntimeLifecycleError = class extends Error {};
function getVoiceCallRuntimeCoordinator() {
	return resolveGlobalSingleton(VOICE_CALL_RUNTIME_COORDINATOR_KEY, () => ({ epochCounter: 0 }));
}
function activateVoiceCallRuntimeGeneration(coordinator, registration, generation) {
	if (registration.epoch < (coordinator.current?.epoch ?? 0) || registration.generation !== generation) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation was superseded; use the current plugin registration");
	if (generation.retired) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation is retired; use the current plugin registration");
	if (coordinator.current !== registration) {
		if (coordinator.current) coordinator.current.generation.retired = true;
		coordinator.current = registration;
	}
}
function stopVoiceCallRuntimeGeneration(coordinator, generation) {
	const ownedSlot = coordinator.slot?.owner === generation ? coordinator.slot : void 0;
	if (!ownedSlot || ownedSlot.state === "stopping") return ownedSlot?.promise ?? Promise.resolve();
	const stopPromise = Promise.resolve().then(async () => {
		await (ownedSlot.state === "running" ? ownedSlot.runtime : await ownedSlot.promise).stop();
	});
	const stoppingSlot = {
		state: "stopping",
		owner: generation,
		promise: stopPromise
	};
	if (coordinator.slot === ownedSlot) coordinator.slot = stoppingSlot;
	return stopPromise.finally(() => {
		if (coordinator.slot === stoppingSlot) coordinator.slot = void 0;
	});
}
var voice_call_default = definePluginEntry({
	id: "voice-call",
	name: "Voice Call",
	description: "Voice-call plugin with Telnyx/Twilio/Plivo providers",
	configSchema: voiceCallConfigSchema,
	register(api) {
		const config = resolveVoiceCallConfig(voiceCallConfigSchema.parse(api.pluginConfig));
		const validation = validateProviderConfig(config);
		const runtimeCoordinator = getVoiceCallRuntimeCoordinator();
		const runtimeRegistration = api.registrationMode !== "full" && runtimeCoordinator.current ? runtimeCoordinator.current : {
			epoch: ++runtimeCoordinator.epochCounter,
			generation: { retired: false }
		};
		const continueOperationStore = createVoiceCallContinueOperationStore({
			config,
			coreConfig: api.config
		});
		const activateRuntimeGeneration = (generation) => activateVoiceCallRuntimeGeneration(runtimeCoordinator, runtimeRegistration, generation);
		const ensureRuntimeForGeneration = async (runtimeGeneration) => {
			activateRuntimeGeneration(runtimeGeneration);
			if (!config.enabled) throw new Error("Voice call disabled in plugin config");
			if (!validation.valid) throw new Error(validation.errors.join("; "));
			while (true) {
				activateRuntimeGeneration(runtimeGeneration);
				const slot = runtimeCoordinator.slot;
				if (slot) {
					if (slot.owner !== runtimeGeneration) {
						if (slot.owner.retired) {
							await stopVoiceCallRuntimeGeneration(runtimeCoordinator, slot.owner);
							continue;
						}
						throw new VoiceCallRuntimeLifecycleError("A previous voice call runtime generation is still active; retry after it stops");
					}
					if (slot.state === "running") return slot.runtime;
					if (slot.state === "stopping") {
						await slot.promise;
						continue;
					}
					let createdRuntime;
					try {
						createdRuntime = await slot.promise;
					} catch (err) {
						if (runtimeCoordinator.slot === slot) runtimeCoordinator.slot = void 0;
						throw err;
					}
					activateRuntimeGeneration(runtimeGeneration);
					if (runtimeCoordinator.slot !== slot) continue;
					runtimeCoordinator.slot = {
						state: "running",
						owner: runtimeGeneration,
						runtime: createdRuntime
					};
					return createdRuntime;
				}
				const startingSlot = {
					state: "starting",
					owner: runtimeGeneration,
					promise: createVoiceCallRuntime({
						config,
						coreConfig: api.config,
						fullConfig: api.config,
						agentRuntime: api.runtime.agent,
						stateRuntime: api.runtime.state,
						ttsRuntime: api.runtime.tts,
						logger: api.logger
					})
				};
				runtimeCoordinator.slot = startingSlot;
			}
		};
		const ensureRuntime = async (runtimeGeneration = runtimeRegistration.generation) => {
			try {
				const runtime = await ensureRuntimeForGeneration(runtimeGeneration);
				runtimeGeneration.serviceHealth?.clearFailure();
				return runtime;
			} catch (err) {
				if (!(err instanceof VoiceCallRuntimeLifecycleError)) runtimeGeneration.serviceHealth?.reportFailure(err);
				throw err;
			}
		};
		const commands = createVoiceCallCommandService(ensureRuntime);
		const registerGatewayCommand = (method, handler, scope) => {
			api.registerGatewayMethod(method, async (options) => {
				try {
					options.respond(true, await handler(options));
				} catch (err) {
					const code = err instanceof VoiceCallCommandInputError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE;
					options.respond(false, void 0, errorShape(code, formatErrorMessage(err)));
				}
			}, scope);
		};
		registerGatewayCommand("voicecall.initiate", async ({ params }) => {
			const message = normalizeOptionalString(params?.message);
			if (!message) throw new VoiceCallCommandInputError("message required");
			return await commands.initiate({
				to: normalizeOptionalString(params?.to),
				message,
				mode: params?.mode === "notify" || params?.mode === "conversation" ? params.mode : void 0,
				sessionKey: normalizeOptionalString(params?.sessionKey),
				requesterSessionKey: normalizeOptionalString(params?.requesterSessionKey)
			});
		}, VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.continue", ({ params }) => commands.continueCall(normalizeOptionalString(params?.callId), normalizeOptionalString(params?.message)), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.continue.start", async ({ params }) => continueOperationStore.start(await commands.prepareContinue(normalizeOptionalString(params?.callId), normalizeOptionalString(params?.message))), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.continue.result", ({ params }) => {
			const operationId = normalizeOptionalString(params?.operationId);
			if (!operationId) throw new VoiceCallCommandInputError("operationId required");
			const operation = continueOperationStore.read(operationId);
			if (!operation.ok) throw new VoiceCallCommandInputError(operation.error);
			return operation.payload;
		}, VOICE_CALL_READ_METHOD_SCOPE);
		registerGatewayCommand("voicecall.speak", ({ params }) => commands.speak({
			callId: normalizeOptionalString(params?.callId),
			message: normalizeOptionalString(params?.message),
			allowTwimlFallback: params?.allowTwimlFallback !== false
		}), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.dtmf", ({ params }) => commands.sendDtmf(normalizeOptionalString(params?.callId), normalizeOptionalString(params?.digits)), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.end", ({ params }) => commands.endCall(normalizeOptionalString(params?.callId)), VOICE_CALL_WRITE_METHOD_SCOPE);
		registerGatewayCommand("voicecall.status", ({ params }) => commands.status(normalizeOptionalString(params?.callId) ?? normalizeOptionalString(params?.sid)), VOICE_CALL_READ_METHOD_SCOPE);
		registerGatewayCommand("voicecall.start", async ({ params, client }) => {
			const to = normalizeOptionalString(params?.to);
			const requestedAgentId = normalizeOptionalString(params?.agentId);
			const normalizedAgentId = requestedAgentId ? normalizeAgentId(requestedAgentId) : void 0;
			const pluginOwnerId = normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId);
			if (requestedAgentId && (!pluginOwnerId || normalizedAgentId !== requestedAgentId.toLowerCase())) throw new VoiceCallCommandInputError("agentId requires a trusted plugin caller and a valid agent id");
			if (!to) throw new VoiceCallCommandInputError("to required");
			return await commands.initiate({
				to,
				message: normalizeOptionalString(params?.message),
				mode: params?.mode === "notify" || params?.mode === "conversation" ? params.mode : void 0,
				dtmfSequence: normalizeOptionalString(params?.dtmfSequence),
				sessionKey: normalizeOptionalString(params?.sessionKey),
				requesterSessionKey: normalizeOptionalString(params?.requesterSessionKey),
				agentId: normalizedAgentId
			});
		}, VOICE_CALL_WRITE_METHOD_SCOPE);
		api.registerTool((toolContext) => ({
			name: "voice_call",
			label: "Voice Call",
			description: "Make phone calls and have voice conversations via the voice-call plugin.",
			parameters: VoiceCallToolSchema,
			async execute(_toolCallId, params) {
				const rawParams = asNonArrayRecord(params);
				const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
				const contextAgentId = normalizeOptionalString(toolContext.agentId) ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
				const agentId = contextAgentId ? normalizeAgentId(contextAgentId) : void 0;
				try {
					await ensureRuntime();
					if (typeof rawParams.action === "string") switch (rawParams.action) {
						case "initiate_call": {
							const message = normalizeOptionalString(rawParams.message);
							if (!message) throw new VoiceCallCommandInputError("message required");
							return jsonResult(await commands.initiate({
								to: normalizeOptionalString(rawParams.to),
								message,
								dtmfSequence: normalizeOptionalString(rawParams.dtmfSequence),
								mode: rawParams.mode === "notify" || rawParams.mode === "conversation" ? rawParams.mode : void 0,
								sessionKey: normalizeOptionalString(rawParams.sessionKey),
								agentId,
								requesterSessionKey
							}));
						}
						case "continue_call": return jsonResult(await commands.continueCall(normalizeOptionalString(rawParams.callId), normalizeOptionalString(rawParams.message)));
						case "speak_to_user": return jsonResult(await commands.speak({
							callId: normalizeOptionalString(rawParams.callId),
							message: normalizeOptionalString(rawParams.message)
						}));
						case "send_dtmf": return jsonResult(await commands.sendDtmf(normalizeOptionalString(rawParams.callId), normalizeOptionalString(rawParams.digits)));
						case "end_call": return jsonResult(await commands.endCall(normalizeOptionalString(rawParams.callId)));
						case "get_status": {
							const callId = normalizeOptionalString(rawParams.callId);
							if (!callId) throw new VoiceCallCommandInputError("callId required");
							return jsonResult(await commands.status(callId));
						}
					}
					if ((rawParams.mode ?? "call") === "status") {
						const sid = normalizeOptionalString(rawParams.sid) ?? "";
						if (!sid) throw new Error("sid required for status");
						return jsonResult(await commands.status(sid));
					}
					return jsonResult(await commands.initiate({
						to: normalizeOptionalString(rawParams.to),
						dtmfSequence: normalizeOptionalString(rawParams.dtmfSequence),
						message: normalizeOptionalString(rawParams.message),
						sessionKey: normalizeOptionalString(rawParams.sessionKey),
						agentId,
						requesterSessionKey
					}, "to required for call"));
				} catch (err) {
					return jsonResult({ error: formatErrorMessage(err) });
				}
			}
		}));
		api.registerCli(({ program }) => registerVoiceCallCli({
			program,
			config,
			ensureRuntime,
			stateRuntime: api.runtime.state,
			logger: api.logger
		}), {
			commands: ["voicecall"],
			descriptors: [VOICE_CALL_CLI_DESCRIPTOR]
		});
		api.registerService({
			id: "voicecall",
			start: (ctx) => {
				if (isCliOnlyProcess()) return;
				try {
					if (runtimeRegistration.generation.retired) {
						if (runtimeCoordinator.current !== runtimeRegistration) throw new VoiceCallRuntimeLifecycleError("Voice call runtime generation was superseded; use the current plugin registration");
						runtimeRegistration.generation = { retired: false };
					}
					runtimeRegistration.generation.serviceHealth = ctx.serviceHealth;
					activateRuntimeGeneration(runtimeRegistration.generation);
				} catch (err) {
					ctx.serviceHealth?.reportFailure(err);
					api.logger.error(`[voice-call] Failed to start runtime: ${formatErrorMessage(err)}`);
					return;
				}
				if (!config.enabled) return;
				if (!validation.valid) {
					const error = /* @__PURE__ */ new Error(`setup incomplete: ${validation.errors.join("; ")}`);
					ctx.serviceHealth?.reportFailure(error);
					api.logger.error(`[voice-call] Runtime not started: ${error.message}`);
					return;
				}
				const startingGeneration = runtimeRegistration.generation;
				ensureRuntime(startingGeneration).catch((err) => {
					if (err instanceof VoiceCallRuntimeLifecycleError) return;
					ctx.serviceHealth?.reportFailure(err);
					api.logger.error(`[voice-call] Failed to start runtime: ${formatErrorMessage(err)}`);
				});
			},
			stop: async () => {
				const runtimeGeneration = runtimeRegistration.generation;
				runtimeGeneration.retired = true;
				try {
					await stopVoiceCallRuntimeGeneration(runtimeCoordinator, runtimeGeneration);
				} finally {
					runtimeGeneration.serviceHealth = void 0;
				}
			}
		});
	}
});
//#endregion
export { voice_call_default as default };
