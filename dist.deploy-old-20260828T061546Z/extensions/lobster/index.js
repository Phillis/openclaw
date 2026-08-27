import { i as toErrorObject } from "../../error-coercion-CKFmnpjH.js";
import { a as isPathInside } from "../../path-D138yf8v.js";
import { d as readNonNegativeIntegerParam, p as readPositiveIntegerParam } from "../../common-CI1GnPjt.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { a as optionalPositiveIntegerSchema, i as optionalNonNegativeIntegerSchema } from "../../typebox-DzztcX9H.js";
import "../../error-runtime-CmA1H4Zg.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import "../../file-access-runtime-DRZWsOJC.js";
import "../../channel-actions-D2ZN81sL.js";
import "../../param-readers-D1z2ybhD.js";
import path from "node:path";
import { stat } from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import { Type } from "typebox";
//#region extensions/lobster/src/lobster-runner.ts
const workflowExts = /* @__PURE__ */ new Set([
	".lobster",
	".yaml",
	".yml",
	".json"
]);
function resolveLobsterCwd(cwdRaw) {
	if (typeof cwdRaw !== "string" || !cwdRaw.trim()) return process.cwd();
	const cwd = cwdRaw.trim();
	if (path.isAbsolute(cwd)) throw new Error("cwd must be a relative path");
	const base = process.cwd();
	const resolved = path.resolve(base, cwd);
	if (!isPathInside(base, resolved)) throw new Error("cwd must stay within the gateway working directory");
	return resolved;
}
function createLimitedSink(maxBytes, label) {
	let bytes = 0;
	return new Writable({ write(chunk, _encoding, callback) {
		bytes += Buffer.byteLength(String(chunk), "utf8");
		if (bytes > maxBytes) {
			callback(/* @__PURE__ */ new Error(`lobster ${label} exceeded maxStdoutBytes`));
			return;
		}
		callback();
	} });
}
function normalizeEnvelope(envelope) {
	if (!envelope.ok) throw new Error(envelope.error?.message ?? "lobster runtime failed");
	if (envelope.status === "needs_input") throw new Error("Lobster input requests are not supported by the OpenClaw Lobster tool yet");
	return {
		ok: true,
		status: envelope.status ?? "ok",
		output: Array.isArray(envelope.output) ? envelope.output : [],
		requiresApproval: envelope.requiresApproval ? {
			type: "approval_request",
			prompt: envelope.requiresApproval.prompt,
			items: envelope.requiresApproval.items,
			...envelope.requiresApproval.resumeToken ? { resumeToken: envelope.requiresApproval.resumeToken } : {},
			...envelope.requiresApproval.approvalId ? { approvalId: envelope.requiresApproval.approvalId } : {}
		} : null
	};
}
function isMissingPathError(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
async function detectWorkflowFile(candidate, cwd) {
	const trimmed = candidate.trim();
	if (!trimmed || trimmed.includes("|") || !workflowExts.has(path.extname(trimmed).toLowerCase())) return null;
	const resolved = path.isAbsolute(trimmed) ? trimmed : path.resolve(cwd, trimmed);
	try {
		if (!(await stat(resolved)).isFile()) throw new Error("Workflow path is not a file");
		return resolved;
	} catch (error) {
		if (/\s/.test(trimmed) && isMissingPathError(error)) return null;
		throw error;
	}
}
function createEmbeddedToolContext(params, signal) {
	const env = { ...process.env };
	return {
		cwd: params.cwd,
		env,
		mode: "tool",
		stdin: Readable.from([]),
		stdout: createLimitedSink(Math.max(1024, params.maxStdoutBytes), "stdout"),
		stderr: createLimitedSink(Math.max(1024, params.maxStdoutBytes), "stderr"),
		signal
	};
}
async function withTimeout(timeoutMs, fn) {
	const timeout = Math.max(200, timeoutMs);
	const controller = new AbortController();
	return await new Promise((resolve, reject) => {
		const onTimeout = () => {
			const error = /* @__PURE__ */ new Error("lobster runtime timed out");
			controller.abort(error);
			reject(error);
		};
		const timer = setTimeout(onTimeout, timeout);
		fn(controller.signal).then((value) => {
			clearTimeout(timer);
			resolve(value);
		}, (error) => {
			clearTimeout(timer);
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
async function loadEmbeddedToolRuntimeFromPackage() {
	return await import([
		"@clawdbot",
		"lobster",
		"core"
	].join("/"));
}
function createEmbeddedLobsterRunner(options) {
	const loadRuntime = options?.loadRuntime ?? loadEmbeddedToolRuntimeFromPackage;
	let runtimePromise;
	return { async run(params) {
		runtimePromise ??= loadRuntime();
		const runtime = await runtimePromise;
		return await withTimeout(params.timeoutMs, async (signal) => {
			const ctx = createEmbeddedToolContext(params, signal);
			if (params.action === "run") {
				const pipeline = params.pipeline?.trim() ?? "";
				if (!pipeline) throw new Error("pipeline required");
				const filePath = await detectWorkflowFile(pipeline, params.cwd);
				if (filePath) {
					const parsedArgsJson = params.argsJson?.trim() ?? "";
					let args;
					if (parsedArgsJson) try {
						args = JSON.parse(parsedArgsJson);
					} catch {
						throw new Error("run --args-json must be valid JSON");
					}
					return normalizeEnvelope(await runtime.runToolRequest({
						filePath,
						args,
						ctx
					}));
				}
				return normalizeEnvelope(await runtime.runToolRequest({
					pipeline,
					ctx
				}));
			}
			const token = params.token?.trim() ?? "";
			const approvalId = params.approvalId?.trim() ?? "";
			if (!token && !approvalId) throw new Error("token or approvalId required");
			if (typeof params.approve !== "boolean") throw new Error("approve required");
			return normalizeEnvelope(await runtime.resumeToolRequest({
				...token ? { token } : {},
				...approvalId ? { approvalId } : {},
				approved: params.approve,
				ctx
			}));
		});
	} };
}
//#endregion
//#region extensions/lobster/src/lobster-taskflow.ts
function toJsonLike(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (value === null) return null;
	switch (typeof value) {
		case "boolean":
		case "string": return value;
		case "number": return Number.isFinite(value) ? value : String(value);
		case "bigint": return value.toString();
		case "undefined":
		case "function":
		case "symbol": return null;
		case "object": {
			if (value instanceof Date) return value.toISOString();
			if (Array.isArray(value)) return value.map((item) => toJsonLike(item, seen));
			if (seen.has(value)) return "[Circular]";
			seen.add(value);
			const jsonObject = {};
			for (const [key, entry] of Object.entries(value)) {
				if (entry === void 0 || typeof entry === "function" || typeof entry === "symbol") continue;
				jsonObject[key] = toJsonLike(entry, seen);
			}
			seen.delete(value);
			return jsonObject;
		}
	}
	return null;
}
function buildApprovalWaitState(envelope) {
	const approval = envelope.requiresApproval;
	return {
		kind: "lobster_approval",
		prompt: approval ? approval.prompt : "",
		items: approval ? approval.items.map((item) => toJsonLike(item)) : [],
		...approval?.resumeToken ? { resumeToken: approval.resumeToken } : {},
		...approval?.approvalId ? { approvalId: approval.approvalId } : {}
	};
}
function applyEnvelopeToFlow(params) {
	const { taskFlow, flow, envelope, waitingStep } = params;
	const flowMutation = {
		flowId: flow.flowId,
		expectedRevision: flow.revision
	};
	if (!envelope.ok) return taskFlow.fail(flowMutation);
	if (envelope.status === "needs_approval") return taskFlow.setWaiting({
		...flowMutation,
		currentStep: waitingStep,
		waitJson: buildApprovalWaitState(envelope)
	});
	return taskFlow.finish(flowMutation);
}
async function executeManagedLobsterFlow(params, flow, failureFlowId = flow.flowId) {
	try {
		const envelope = await params.runner.run(params.runnerParams);
		const mutation = applyEnvelopeToFlow({
			taskFlow: params.taskFlow,
			flow,
			envelope,
			waitingStep: params.waitingStep ?? "await_lobster_approval"
		});
		if (!envelope.ok) return {
			ok: false,
			flow,
			mutation,
			error: new Error(envelope.error.message)
		};
		return {
			ok: true,
			envelope,
			flow,
			mutation
		};
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error));
		try {
			return {
				ok: false,
				flow,
				mutation: params.taskFlow.fail({
					flowId: failureFlowId,
					expectedRevision: flow.revision
				}),
				error: err
			};
		} catch {
			return {
				ok: false,
				flow,
				error: err
			};
		}
	}
}
async function runManagedLobsterFlow(params) {
	const createFlowParams = {
		controllerId: params.controllerId,
		goal: params.goal,
		currentStep: params.currentStep ?? "run_lobster",
		...params.stateJson !== void 0 ? { stateJson: params.stateJson } : {}
	};
	const flow = params.taskFlow.tryCreateManaged ? params.taskFlow.tryCreateManaged(createFlowParams) : params.taskFlow.createManaged(createFlowParams);
	if (!flow) return {
		ok: false,
		error: /* @__PURE__ */ new Error("TaskFlow persistence failed.")
	};
	return await executeManagedLobsterFlow(params, flow);
}
async function resumeManagedLobsterFlow(params) {
	const resumed = params.taskFlow.resume({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		status: "running",
		currentStep: params.currentStep ?? "resume_lobster"
	});
	if (!resumed.applied) return {
		ok: false,
		mutation: resumed,
		error: /* @__PURE__ */ new Error(`TaskFlow resume failed: ${resumed.code}`)
	};
	return await executeManagedLobsterFlow(params, resumed.flow, params.flowId);
}
//#endregion
//#region extensions/lobster/src/lobster-tool.ts
function readOptionalTrimmedString(value, fieldName) {
	if (value === void 0) return;
	if (typeof value !== "string") throw new Error(`${fieldName} must be a string`);
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function readOptionalNumber(value, fieldName) {
	return readNonNegativeIntegerParam({ [fieldName]: value }, fieldName, { message: `${fieldName} must be a non-negative integer` });
}
function readOptionalBoolean(value, fieldName) {
	if (value === void 0) return;
	if (typeof value !== "boolean") throw new Error(`${fieldName} must be a boolean`);
	return value;
}
function parseOptionalFlowStateJson(value) {
	if (value === void 0) return;
	if (typeof value !== "string") throw new Error("flowStateJson must be a JSON string");
	const trimmed = value.trim();
	if (!trimmed) return;
	try {
		return JSON.parse(trimmed);
	} catch {
		throw new Error("flowStateJson must be valid JSON");
	}
}
function isEmptyJsonObject(value) {
	return value !== void 0 && value !== null && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;
}
function parseManagedFlowParams(action, params, runnerParams) {
	if (action === "run") {
		const controllerId = readOptionalTrimmedString(params.flowControllerId, "flowControllerId");
		const goal = readOptionalTrimmedString(params.flowGoal, "flowGoal");
		const currentStep = readOptionalTrimmedString(params.flowCurrentStep, "flowCurrentStep");
		const waitingStep = readOptionalTrimmedString(params.flowWaitingStep, "flowWaitingStep");
		const stateJson = parseOptionalFlowStateJson(params.flowStateJson);
		const resumeFlowId = readOptionalTrimmedString(params.flowId, "flowId");
		const resumeRevision = readOptionalNumber(params.flowExpectedRevision, "flowExpectedRevision");
		const stateJsonSignalsRunMode = stateJson !== void 0 && !isEmptyJsonObject(stateJson);
		if (resumeFlowId !== void 0 || resumeRevision !== void 0 && resumeRevision !== 0) throw new Error("run action does not accept flowId or flowExpectedRevision");
		if (controllerId === void 0 && goal === void 0 && currentStep === void 0 && waitingStep === void 0 && !stateJsonSignalsRunMode) return null;
		if (!controllerId) throw new Error("flowControllerId required when using managed TaskFlow run mode");
		if (!goal) throw new Error("flowGoal required when using managed TaskFlow run mode");
		return {
			action,
			controllerId,
			goal,
			...currentStep ? { currentStep } : {},
			...waitingStep ? { waitingStep } : {},
			...stateJson !== void 0 ? { stateJson } : {}
		};
	}
	const flowId = readOptionalTrimmedString(params.flowId, "flowId");
	const expectedRevision = readOptionalNumber(params.flowExpectedRevision, "flowExpectedRevision");
	const currentStep = readOptionalTrimmedString(params.flowCurrentStep, "flowCurrentStep");
	const waitingStep = readOptionalTrimmedString(params.flowWaitingStep, "flowWaitingStep");
	const token = readOptionalTrimmedString(params.token, "token");
	const approvalId = readOptionalTrimmedString(params.approvalId, "approvalId");
	const approve = readOptionalBoolean(params.approve, "approve");
	const runControllerId = readOptionalTrimmedString(params.flowControllerId, "flowControllerId");
	const runGoal = readOptionalTrimmedString(params.flowGoal, "flowGoal");
	const stateJson = parseOptionalFlowStateJson(params.flowStateJson);
	const stateJsonDisallowed = stateJson !== void 0 && !isEmptyJsonObject(stateJson);
	if (runControllerId !== void 0 || runGoal !== void 0 || stateJsonDisallowed) throw new Error("resume action does not accept flowControllerId, flowGoal, or flowStateJson");
	if (!(flowId !== void 0 || expectedRevision !== void 0 && expectedRevision !== 0 || currentStep !== void 0 || waitingStep !== void 0)) return null;
	if (!flowId) throw new Error("flowId required when using managed TaskFlow resume mode");
	if (expectedRevision === void 0) throw new Error("flowExpectedRevision required when using managed TaskFlow resume mode");
	const credentialParams = token ? { token: runnerParams.token ?? token } : approvalId ? { approvalId: runnerParams.approvalId ?? approvalId } : null;
	if (!credentialParams) throw new Error("token or approvalId required when using managed TaskFlow resume mode");
	if (approve === void 0) throw new Error("approve required when using managed TaskFlow resume mode");
	return {
		action,
		flowId,
		expectedRevision,
		...currentStep ? { currentStep } : {},
		...waitingStep ? { waitingStep } : {},
		runnerParams: {
			...runnerParams,
			...credentialParams,
			action,
			approve
		}
	};
}
function resolveManagedFlowToolResult(result) {
	if (!result.ok) throw result.error;
	return jsonResult({
		...result.envelope,
		flow: result.flow,
		mutation: result.mutation
	});
}
function requireTaskFlowRuntime(taskFlow, action) {
	if (!taskFlow) throw new Error(`Managed TaskFlow ${action} mode requires a bound taskFlow runtime`);
	return taskFlow;
}
function createLobsterTool(api, options) {
	const runner = options?.runner ?? createEmbeddedLobsterRunner();
	return {
		name: "lobster",
		label: "Lobster Workflow",
		description: "Run Lobster pipelines as a local-first workflow runtime (typed JSON envelope + resumable approvals).",
		parameters: Type.Object({
			action: Type.Enum(["run", "resume"], { type: "string" }),
			pipeline: Type.Optional(Type.String()),
			argsJson: Type.Optional(Type.String()),
			token: Type.Optional(Type.String()),
			approvalId: Type.Optional(Type.String()),
			approve: Type.Optional(Type.Boolean()),
			cwd: Type.Optional(Type.String({ description: "Relative working directory (optional). Must stay within the gateway working directory." })),
			timeoutMs: optionalPositiveIntegerSchema(),
			maxStdoutBytes: optionalPositiveIntegerSchema(),
			flowControllerId: Type.Optional(Type.String()),
			flowGoal: Type.Optional(Type.String()),
			flowStateJson: Type.Optional(Type.String()),
			flowId: Type.Optional(Type.String()),
			flowExpectedRevision: optionalNonNegativeIntegerSchema(),
			flowCurrentStep: Type.Optional(Type.String()),
			flowWaitingStep: Type.Optional(Type.String())
		}),
		async execute(_id, params) {
			const action = typeof params.action === "string" ? params.action.trim() : "";
			if (!action) throw new Error("action required");
			if (action !== "run" && action !== "resume") throw new Error(`Unknown action: ${action}`);
			const cwd = resolveLobsterCwd(params.cwd);
			const timeoutMs = readPositiveIntegerParam(params, "timeoutMs") ?? 2e4;
			const maxStdoutBytes = readPositiveIntegerParam(params, "maxStdoutBytes") ?? 512e3;
			if (api.runtime?.version && api.logger?.debug) api.logger.debug(`lobster plugin runtime=${api.runtime.version}`);
			const runnerParams = {
				action,
				...typeof params.pipeline === "string" ? { pipeline: params.pipeline } : {},
				...typeof params.argsJson === "string" ? { argsJson: params.argsJson } : {},
				...typeof params.token === "string" ? { token: params.token } : {},
				...typeof params.approvalId === "string" ? { approvalId: params.approvalId } : {},
				...typeof params.approve === "boolean" ? { approve: params.approve } : {},
				cwd,
				timeoutMs,
				maxStdoutBytes
			};
			const taskFlow = options?.taskFlow;
			const flowParams = parseManagedFlowParams(action, params, runnerParams);
			if (flowParams?.action === "run") return resolveManagedFlowToolResult(await runManagedLobsterFlow({
				taskFlow: requireTaskFlowRuntime(taskFlow, "run"),
				runner,
				runnerParams,
				controllerId: flowParams.controllerId,
				goal: flowParams.goal,
				...flowParams.stateJson !== void 0 ? { stateJson: flowParams.stateJson } : {},
				...flowParams.currentStep ? { currentStep: flowParams.currentStep } : {},
				...flowParams.waitingStep ? { waitingStep: flowParams.waitingStep } : {}
			}));
			if (flowParams?.action === "resume") return resolveManagedFlowToolResult(await resumeManagedLobsterFlow({
				taskFlow: requireTaskFlowRuntime(taskFlow, "resume"),
				runner,
				runnerParams: flowParams.runnerParams,
				flowId: flowParams.flowId,
				expectedRevision: flowParams.expectedRevision,
				...flowParams.currentStep ? { currentStep: flowParams.currentStep } : {},
				...flowParams.waitingStep ? { waitingStep: flowParams.waitingStep } : {}
			}));
			const envelope = await runner.run(runnerParams);
			if (!envelope.ok) throw new Error(envelope.error.message);
			return jsonResult(envelope);
		}
	};
}
//#endregion
//#region extensions/lobster/index.ts
var lobster_default = definePluginEntry({
	id: "lobster",
	name: "Lobster",
	description: "Optional local shell helper tools",
	register(api) {
		api.registerTool(((ctx) => {
			if (ctx.sandboxed) return null;
			return createLobsterTool(api, { taskFlow: api.runtime?.tasks.managedFlows && ctx.sessionKey ? api.runtime.tasks.managedFlows.fromToolContext(ctx) : void 0 });
		}), { optional: true });
	}
});
//#endregion
export { lobster_default as default };
