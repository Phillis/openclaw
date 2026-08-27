import { c as isRecord } from "../record-coerce-DItp3I4t.js";
import { r as toCodeModeJsonSafe, t as boundCodeModeResult } from "../code-mode-json-CWwCZ1yI.js";
import { parentPort, workerData } from "node:worker_threads";
import { EvalFlags, JSException, QuickJS } from "quickjs-wasi";
//#region src/agents/code-mode-swarm-controller-source.ts
/** Guest-side Swarm helpers injected into the isolated QuickJS controller. */
const CODE_MODE_SWARM_CONTROLLER_SOURCE = String.raw`
  class SwarmAgentError extends Error {
    constructor(runId, status, detail) {
      super("Swarm agent " + runId + " " + status + ": " + detail);
      this.name = "SwarmAgentError";
      this.runId = runId;
      this.status = status;
    }
  }

  function swarmNote(kind, value) {
    if (typeof value !== "string" || !value.trim()) {
      throw new TypeError(kind + " note must be a non-empty string");
    }
    void request("swarmNote", [{ kind, text: value }]).catch(() => {});
  }

  async function runAgent(prompt, options = {}) {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new TypeError("agents.run prompt must be a non-empty string");
    }
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
      throw new TypeError("agents.run options must be an object");
    }
    if (options.phase !== undefined && (typeof options.phase !== "string" || !options.phase.trim())) {
      throw new TypeError("agents.run phase must be a non-empty string");
    }
    if (options.phase !== undefined) swarmNote("phase", options.phase);
    const spawned = await request("agentSpawn", [prompt, options]);
    const completion = await request("agentWait", [spawned.runId]);
    if (!completion || completion.status !== "done") {
      const runId = completion?.runId ?? spawned.runId ?? "unknown";
      const status = completion?.status ?? "failed";
      const detail = [completion?.error, completion?.schemaError, completion?.result].find(
        (value) => typeof value === "string" && value.trim()
      ) || "collector returned no result";
      throw new SwarmAgentError(runId, status, detail);
    }
    return options.schema !== undefined ? completion.structured : completion.result;
  }
`;
//#endregion
//#region src/agents/code-mode-controller-source.ts
/** Sandboxed guest globals and host bridge for Code Mode QuickJS cells. */
const CODE_MODE_CONTROLLER_SOURCE = String.raw`
(() => {
  const output = [];
  const pending = new Map();
  const catalogBindings = Array.isArray(globalThis.__openclawCatalog) ? globalThis.__openclawCatalog : [];
  const apiFiles = Array.isArray(globalThis.__openclawApiFiles) ? globalThis.__openclawApiFiles : [];
  const namespaceDescriptors = Array.isArray(globalThis.__openclawNamespaces) ? globalThis.__openclawNamespaces : [];
  const hostRequest = globalThis.__openclawHostRequest;
  const hostCancelRequest = globalThis.__openclawHostCancelRequest;
  delete globalThis.__openclawHostRequest;
  delete globalThis.__openclawHostCancelRequest;
  delete globalThis.__openclawCatalog;
  delete globalThis.__openclawApiFiles;
  delete globalThis.__openclawNamespaces;
  const bridgeSequences = new Map();
  const timers = new Map();
  let nextTimerId = 0;

  function safe(value) {
    if (value === undefined) return null;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      if (value instanceof Error) {
        return { name: value.name, message: value.message };
      }
      if (value === null) return null;
      const type = typeof value;
      if (type === "string" || type === "number" || type === "boolean") return value;
      return String(value);
    }
  }

  function asText(value) {
    if (typeof value === "string") return value;
    const encoded = JSON.stringify(safe(value));
    return typeof encoded === "string" ? encoded : String(value);
  }

  function beginRequest(method, args) {
    const methodName = String(method);
    const sequence = (bridgeSequences.get(methodName) ?? 0) + 1;
    bridgeSequences.set(methodName, sequence);
    const bridgeId = "bridge:" + methodName + ":" + String(sequence);
    const id = String(hostRequest(methodName, JSON.stringify(safe(args ?? [])), bridgeId));
    const promise = new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
    return { id, promise };
  }

  function request(method, args) {
    return beginRequest(method, args).promise;
  }

  function scheduleTimer(callback, delay, args) {
    if (typeof callback !== "function") {
      throw new TypeError("setTimeout callback must be a function");
    }
    const numericDelay = Number(delay);
    const delayMs = Number.isFinite(numericDelay) ? Math.max(0, Math.floor(numericDelay)) : 0;
    const timerId = ++nextTimerId;
    const timerRequest = beginRequest("sleep", [delayMs]);
    timers.set(timerId, timerRequest.id);
    void timerRequest.promise.then(() => {
      if (!timers.delete(timerId)) return;
      callback(...args);
    });
    return timerId;
  }

  function cancelTimer(timerId) {
    const requestId = timers.get(Number(timerId));
    if (!requestId) return;
    timers.delete(Number(timerId));
    hostCancelRequest(requestId);
    const entry = pending.get(requestId);
    if (!entry) return;
    pending.delete(requestId);
    entry.resolve(null);
  }

  ${CODE_MODE_SWARM_CONTROLLER_SOURCE}

  function namespaceFunction(namespaceId, path) {
    const callablePath = Object.freeze((Array.isArray(path) ? path : []).map((entry) => String(entry)));
    return (...args) => request("namespace", [namespaceId, callablePath, args]);
  }

  function deserializeNamespaceValue(namespaceId, value) {
    if (!value || typeof value !== "object") return null;
    if (value.kind === "function") {
      return namespaceFunction(namespaceId, Array.isArray(value.path) ? value.path.slice() : []);
    }
    if (value.kind === "array") {
      return Object.freeze((Array.isArray(value.items) ? value.items : []).map((item) => deserializeNamespaceValue(namespaceId, item)));
    }
    if (value.kind === "object") {
      const object = Object.create(null);
      for (const entry of Array.isArray(value.entries) ? value.entries : []) {
        const key = Array.isArray(entry) && typeof entry[0] === "string" ? entry[0] : "";
        if (!key) continue;
        Object.defineProperty(object, key, {
          value: deserializeNamespaceValue(namespaceId, entry[1]),
          enumerable: true,
        });
      }
      return Object.freeze(object);
    }
    return safe(value.value);
  }

  function settle(id, ok, payload) {
    const entry = pending.get(String(id));
    if (!entry) return false;
    pending.delete(String(id));
    let parsed = null;
    try {
      parsed = JSON.parse(String(payload));
    } catch {
      parsed = String(payload);
    }
    if (ok) {
      entry.resolve(parsed);
    } else {
      const error = new Error(typeof parsed === "string" ? parsed : parsed?.message ?? "nested tool failed");
      entry.reject(error);
    }
    return true;
  }

  function nodeHandle(descriptor) {
    const handle = Object.create(null);
    Object.defineProperties(handle, {
      id: { value: descriptor.id, enumerable: true },
      name: { value: descriptor.name, enumerable: true },
      invoke: {
        value: (command, params) => request("nodes", ["invoke", descriptor.id, command, params]),
        enumerable: true,
      },
    });
    if (typeof descriptor.listDirCommand === "string") {
      Object.defineProperty(handle, "listDir", {
        value: (path) => request("nodes", ["invoke", descriptor.id, descriptor.listDirCommand, { path }]),
        enumerable: true,
      });
    }
    return Object.freeze(handle);
  }

  const nodes = Object.freeze({
    list: () => request("nodes", ["list"]),
    get: async (idOrName) => nodeHandle(await request("nodes", ["get", idOrName])),
  });

  const skills = Object.freeze({
    list: () => request("skillsList", []),
    read: (name) => request("skillsRead", [name]),
  });

  if (globalThis.__openclawSwarmEnabled === true) {
    Object.defineProperties(globalThis, {
      agents: {
        value: Object.freeze({ run: runAgent }),
        enumerable: true,
      },
      phase: { value: (title) => swarmNote("phase", title), enumerable: true },
      log: { value: (message) => swarmNote("log", message), enumerable: true },
    });
  }

  function normalizeApiPath(value) {
    const text = String(value ?? "").trim().replace(/^\/+/, "");
    if (!text || text.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
      throw new Error("invalid API file path");
    }
    return text;
  }

  const apiFileMap = new Map();
  for (const file of apiFiles) {
    if (!file || typeof file !== "object") continue;
    const path = typeof file.path === "string" ? file.path : "";
    const content = typeof file.content === "string" ? file.content : "";
    if (!path || !content) continue;
    apiFileMap.set(path, Object.freeze({
      path,
      content,
      description: typeof file.description === "string" ? file.description : undefined,
      bytes: file.bytes,
    }));
  }
  const api = Object.freeze({
    list: async (prefix = "") => {
      // list takes a directory prefix, so tolerate a trailing slash (API.list("mcp/"))
      // that read's exact-path normalizer would otherwise reject as an empty segment.
      const rawPrefix = prefix == null ? "" : String(prefix).trim().replace(/\/+$/, "");
      const normalizedPrefix = rawPrefix === "" ? "" : normalizeApiPath(rawPrefix);
      const files = [...apiFileMap.values()]
        .filter((file) => !normalizedPrefix || file.path === normalizedPrefix || file.path.startsWith(normalizedPrefix.replace(/\/?$/, "/")))
        .map((file) => Object.freeze({
          path: file.path,
          description: file.description,
          bytes: file.bytes,
        }));
      return { files };
    },
    read: async (path) => {
      const normalizedPath = normalizeApiPath(path);
      const file = apiFileMap.get(normalizedPath);
      if (!file) throw new Error("Unknown API file: " + normalizedPath);
      return file;
    },
  });

  const callableHandles = new Map();
  const callableMetadata = new WeakMap();
  function callableHandle(binding) {
    const callableName = typeof binding?.callableName === "string" ? binding.callableName : "";
    if (!callableName) return null;
    const existing = callableHandles.get(callableName);
    if (existing) return existing;
    const handle = (input) => request("callValue", [callableName, input]);
    const metadata = Object.freeze({
      callableName,
      toolName: typeof binding.name === "string" ? binding.name : callableName,
      label: typeof binding.label === "string" ? binding.label : undefined,
      description: typeof binding.description === "string" ? binding.description : "",
      source: binding.source,
      input: binding.input,
      output: binding.output,
    });
    for (const [key, value] of Object.entries(metadata)) {
      Object.defineProperty(handle, key, { value, enumerable: true });
    }
    Object.defineProperties(handle, {
      name: { value: callableName },
      describe: { value: () => request("describe", [callableName]), enumerable: true },
      toJSON: { value: () => metadata },
    });
    const frozen = Object.freeze(handle);
    callableHandles.set(callableName, frozen);
    callableMetadata.set(frozen, metadata);
    return frozen;
  }
  // Final values may nest handles (Promise.all of searches, keyed maps); an
  // unserialized handle dumps as null and the model never learns the tool name.
  function serializeCatalogHandles(value, seen = new Set()) {
    const metadata = callableMetadata.get(value);
    if (metadata) return metadata;
    if (value === null || typeof value !== "object" || seen.has(value)) return value;
    const proto = Object.getPrototypeOf(value);
    if (!Array.isArray(value) && proto !== Object.prototype && proto !== null) return value;
    seen.add(value);
    try {
      if (Array.isArray(value)) return value.map((entry) => serializeCatalogHandles(entry, seen));
      const plain = {};
      for (const [key, entry] of Object.entries(value)) {
        plain[key] = serializeCatalogHandles(entry, seen);
      }
      return plain;
    } finally {
      seen.delete(value);
    }
  }
  const catalog = Object.freeze({
    search: async (query, options) => {
      const matches = await request("search", [query, options]);
      return Object.freeze((Array.isArray(matches) ? matches : []).map((name) =>
        callableHandles.get(String(name))
      ).filter(Boolean));
    },
    all: () => Object.freeze([...callableHandles.values()]),
  });

  const namespaceGlobals = Object.create(null);
  for (const descriptor of namespaceDescriptors) {
    const id = typeof descriptor?.id === "string" ? descriptor.id : "";
    const globalName = typeof descriptor?.globalName === "string" ? descriptor.globalName : "";
    if (!id || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(globalName)) continue;
    const scope = deserializeNamespaceValue(id, descriptor.scope);
    Object.defineProperty(namespaceGlobals, globalName, {
      value: scope,
      enumerable: true,
    });
    const existingGlobal = Object.getOwnPropertyDescriptor(globalThis, globalName);
    if (existingGlobal && existingGlobal.configurable === false) continue;
    Object.defineProperty(globalThis, globalName, {
      value: scope,
      enumerable: true,
      configurable: true,
    });
  }

  for (const binding of catalogBindings) {
    const handle = callableHandle(binding);
    const callableName = typeof binding?.callableName === "string" ? binding.callableName : "";
    if (!handle || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callableName)) continue;
    Object.defineProperty(globalThis, callableName, {
      value: handle,
      enumerable: true,
      configurable: true,
    });
  }

  Object.defineProperties(globalThis, {
    API: { value: api, enumerable: true },
    catalog: { value: catalog, enumerable: true },
    nodes: { value: nodes, enumerable: true },
    namespaces: { value: Object.freeze(namespaceGlobals), enumerable: true },
    skills: { value: skills, enumerable: true },
    setTimeout: { value: (callback, delay, ...args) => scheduleTimer(callback, delay, args), enumerable: true },
    clearTimeout: { value: cancelTimer, enumerable: true },
    text: { value: (value) => output.push({ type: "text", text: asText(value) }), enumerable: true },
    json: { value: (value) => output.push({ type: "json", value: safe(value) }), enumerable: true },
    yield_control: { value: (reason) => request("yield", [reason]), enumerable: true },
    __openclawSettleBridge: { value: settle },
    __openclawSerializeCatalogHandles: { value: serializeCatalogHandles },
    __openclawTakeOutput: { value: () => output.splice(0) },
  });
})();
`;
//#endregion
//#region src/agents/code-mode.worker.ts
/**
* QuickJS worker for Code Mode guest execution and suspended VM snapshots.
*/
var CodeModeWorkerFailure = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "CodeModeWorkerFailure";
		this.code = code;
	}
};
function isQuickJsInterruptedError(error) {
	return error instanceof JSException && error.message === "interrupted";
}
const canceledBridgeRequestIds = [];
let bridgeAdmissionFailure;
function formatQuickJsError(name, message, stack) {
	const header = message ? `${name}: ${message}` : name;
	if (!stack || stack.split(/\r?\n/, 1)[0] === header) return header;
	return `${header}\n${stack}`;
}
function errorMessage(error) {
	if (error instanceof JSException) return formatQuickJsError(error.name, error.message, error.stack);
	if (error instanceof Error) return error.message || String(error);
	return String(error);
}
function buildUserSource(code) {
	return `globalThis.__openclawResult = (async () => {\n${code}\n})()`;
}
function createHostRequestHandler(params) {
	return (methodHandle, argsHandle, bridgeIdHandle) => {
		if (params.pendingRequests.length >= params.config.maxPendingToolCalls) {
			bridgeAdmissionFailure ??= new CodeModeWorkerFailure("invalid_input", "too many pending code mode tool calls");
			throw bridgeAdmissionFailure;
		}
		const method = methodHandle.toString();
		if (method !== "search" && method !== "describe" && method !== "callValue" && method !== "nodes" && method !== "yield" && method !== "namespace" && method !== "agentSpawn" && method !== "agentWait" && method !== "skillsList" && method !== "skillsRead" && method !== "sleep" && method !== "swarmNote") throw new Error("unsupported code mode bridge method");
		let args;
		try {
			args = JSON.parse(argsHandle.toString());
		} catch {
			args = [];
		}
		const id = bridgeIdHandle?.toString();
		if (!id?.startsWith(`bridge:${method}:`) || !/^bridge:[A-Za-z]+:[1-9]\d*$/u.test(id)) throw new Error("invalid code mode bridge id");
		if (params.pendingRequests.some((request) => request.id === id)) throw new Error("duplicate code mode bridge id");
		params.pendingRequests.push({
			id,
			method,
			args: Array.isArray(args) ? args : []
		});
		return params.vm.newString(id);
	};
}
function createHostCancelRequestHandler(params) {
	return (idHandle) => {
		const id = idHandle.toString();
		const index = params.pendingRequests.findIndex((request) => request.id === id);
		if (index >= 0) {
			params.pendingRequests.splice(index, 1);
			canceledBridgeRequestIds.push(id);
		}
		return params.vm.undefined;
	};
}
async function createVm(params) {
	const startedAt = performance.now();
	let timedOut = false;
	const deadlineReached = () => performance.now() - startedAt >= params.config.timeoutMs;
	const vm = await QuickJS.create({
		wasm: params.wasmModule,
		memoryLimit: params.config.memoryLimitBytes,
		timezoneOffset: 0,
		interruptHandler: () => {
			timedOut = deadlineReached();
			return timedOut;
		}
	});
	vm.hostToHandle(params.catalog).consume((handle) => vm.global.setProp("__openclawCatalog", handle));
	vm.hostToHandle(params.namespaces).consume((handle) => vm.global.setProp("__openclawNamespaces", handle));
	vm.hostToHandle(params.apiFiles).consume((handle) => vm.global.setProp("__openclawApiFiles", handle));
	vm.hostToHandle(params.swarmEnabled).consume((handle) => vm.global.setProp("__openclawSwarmEnabled", handle));
	vm.newFunction("__openclawHostRequest", createHostRequestHandler({
		vm,
		pendingRequests: params.pendingRequests,
		config: params.config
	})).consume((hostRequest) => vm.global.setProp("__openclawHostRequest", hostRequest));
	vm.newFunction("__openclawHostCancelRequest", createHostCancelRequestHandler({
		vm,
		pendingRequests: params.pendingRequests
	})).consume((hostCancelRequest) => vm.global.setProp("__openclawHostCancelRequest", hostCancelRequest));
	vm.evalCode(CODE_MODE_CONTROLLER_SOURCE, "openclaw-code-mode:controller.js").dispose();
	return {
		vm,
		didTimeout: () => timedOut || deadlineReached()
	};
}
async function restoreVm(params) {
	const startedAt = performance.now();
	let timedOut = false;
	const deadlineReached = () => performance.now() - startedAt >= params.config.timeoutMs;
	const snapshot = QuickJS.deserializeSnapshot(params.snapshotBytes);
	const vm = await QuickJS.restore(snapshot, {
		wasm: params.wasmModule,
		memoryLimit: params.config.memoryLimitBytes,
		timezoneOffset: 0,
		interruptHandler: () => {
			timedOut = deadlineReached();
			return timedOut;
		}
	});
	vm.registerHostCallback("__openclawHostRequest", createHostRequestHandler({
		vm,
		pendingRequests: params.pendingRequests,
		config: params.config
	}));
	vm.registerHostCallback("__openclawHostCancelRequest", createHostCancelRequestHandler({
		vm,
		pendingRequests: params.pendingRequests
	}));
	return {
		vm,
		didTimeout: () => timedOut || deadlineReached()
	};
}
function takeOutput(vm) {
	return vm.global.getProp("__openclawTakeOutput").consume((take) => vm.callFunction(take, vm.undefined).consume((output) => {
		const dumped = vm.dump(output);
		return Array.isArray(dumped) ? dumped : [];
	}));
}
function takeOutputSafely(vm) {
	try {
		return takeOutput(vm);
	} catch {
		return [];
	}
}
function boundWorkerResult(result, config) {
	const bounded = boundCodeModeResult({
		output: result.output,
		...result.status === "completed" ? { value: result.value } : {},
		maxOutputBytes: config.maxOutputBytes
	});
	if (result.status === "completed") return {
		...result,
		output: bounded.output,
		value: bounded.value
	};
	return {
		...result,
		output: bounded.output
	};
}
function failedWorkerResult(code, error, output = []) {
	return {
		status: "failed",
		code,
		error,
		failurePhase: code === "invalid_input" ? "input" : "guest",
		bridgeDispatchStarted: false,
		output
	};
}
function workerFailureResult(params) {
	const timedOut = params.didTimeout() || isQuickJsInterruptedError(params.error);
	const output = params.output.length > 0 ? params.output : takeOutputSafely(params.vm);
	if (timedOut) return failedWorkerResult("timeout", "code mode timeout exceeded", output);
	if (params.error instanceof CodeModeWorkerFailure) return failedWorkerResult(params.error.code, params.error.message, output);
	if (output.length > 0) return failedWorkerResult("internal_error", errorMessage(params.error), output);
	throw params.error;
}
async function readCompletedResult(vm, resultHandle) {
	if (!resultHandle.isPromise) return serializeCompletedCatalogHandles(vm, resultHandle);
	const settled = await vm.resolvePromise(resultHandle);
	if ("error" in settled) return settled.error.consume((error) => {
		const dumped = vm.dump(error);
		if (dumped instanceof Error && dumped.name === "ReferenceError" && /^(?:require|module|process) is not defined$/u.test(dumped.message)) throw new CodeModeWorkerFailure("invalid_input", "code mode module access is disabled.");
		const text = dumped instanceof Error ? formatQuickJsError(dumped.name, dumped.message, dumped.stack) : errorMessage(dumped);
		throw new Error(text);
	});
	return settled.value.consume((value) => serializeCompletedCatalogHandles(vm, value));
}
function serializeCompletedCatalogHandles(vm, value) {
	return vm.global.getProp("__openclawSerializeCatalogHandles").consume((serialize) => vm.callFunction(serialize, vm.undefined, value).consume((serialized) => toCodeModeJsonSafe(vm.dump(serialized))));
}
function waitingResult(params) {
	const snapshotBytes = QuickJS.serializeSnapshot(params.vm.snapshot());
	if (snapshotBytes.byteLength > params.config.maxSnapshotBytes) throw new CodeModeWorkerFailure("snapshot_limit_exceeded", "code mode snapshot limit exceeded");
	return {
		status: "waiting",
		snapshotBytes,
		pendingRequests: params.pendingRequests,
		canceledRequestIds: canceledBridgeRequestIds,
		settlementMode: params.settlementMode,
		output: params.output
	};
}
async function runVmExecution(params) {
	let output = [];
	try {
		params.prepare();
		params.vm.executePendingJobs();
		if (bridgeAdmissionFailure) throw bridgeAdmissionFailure;
		output = takeOutput(params.vm);
		const resultHandle = params.vm.global.getProp("__openclawResult");
		try {
			const promisePending = resultHandle.isPromise && resultHandle.promiseState === 0;
			if (promisePending && params.pendingRequests.length === 0) throw new Error("code mode promise is pending without host work");
			const requiredPendingRequestIds = params.pendingRequests.map((request) => request.id);
			if (promisePending || requiredPendingRequestIds.length > 0) return waitingResult({
				vm: params.vm,
				pendingRequests: params.pendingRequests,
				settlementMode: promisePending ? { kind: "awaiting" } : {
					kind: "draining",
					requiredRequestIds: requiredPendingRequestIds
				},
				output,
				config: params.config
			});
			return {
				status: "completed",
				value: await readCompletedResult(params.vm, resultHandle),
				output
			};
		} finally {
			resultHandle.dispose();
		}
	} catch (error) {
		return workerFailureResult({
			error,
			didTimeout: params.didTimeout,
			output,
			vm: params.vm
		});
	} finally {
		params.vm.dispose();
	}
}
async function runExec(input) {
	const pendingRequests = [];
	const { vm, didTimeout } = await createVm({
		wasmModule: input.wasmModule,
		catalog: input.catalog,
		apiFiles: input.apiFiles ?? [],
		namespaces: input.namespaces,
		swarmEnabled: input.swarmEnabled === true,
		config: input.config,
		pendingRequests
	});
	return runVmExecution({
		vm,
		didTimeout,
		pendingRequests,
		config: input.config,
		prepare: () => {
			vm.evalCode(buildUserSource(input.source), "openclaw-code-mode:user.js", EvalFlags.ASYNC).dispose();
		}
	});
}
async function runResume(input) {
	const pendingRequests = [...input.pendingRequests ?? []];
	const { vm, didTimeout } = await restoreVm({
		wasmModule: input.wasmModule,
		snapshotBytes: input.snapshotBytes,
		config: input.config,
		pendingRequests
	});
	return runVmExecution({
		vm,
		didTimeout,
		pendingRequests,
		config: input.config,
		prepare: () => {
			vm.global.getProp("__openclawSettleBridge").consume((settle) => {
				for (const request of input.settledRequests) {
					const id = vm.newString(request.id);
					const payload = vm.newString(JSON.stringify(request.ok ? request.value : request.error));
					try {
						vm.callFunction(settle, vm.undefined, id, request.ok ? vm.true : vm.false, payload).dispose();
					} finally {
						id.dispose();
						payload.dispose();
					}
				}
			});
		}
	});
}
function isQuickJsWasmModule(value) {
	return Object.prototype.toString.call(value) === "[object WebAssembly.Module]";
}
async function main() {
	const input = workerData;
	if (!isRecord(input) || !isRecord(input.config) || !isQuickJsWasmModule(input.wasmModule)) return failedWorkerResult("invalid_input", "invalid code mode worker input");
	const config = input.config;
	try {
		if (input.kind === "exec" && typeof input.source === "string") return boundWorkerResult(await runExec({
			kind: "exec",
			wasmModule: input.wasmModule,
			source: input.source,
			config,
			catalog: Array.isArray(input.catalog) ? input.catalog : [],
			apiFiles: Array.isArray(input.apiFiles) ? input.apiFiles : [],
			namespaces: Array.isArray(input.namespaces) ? input.namespaces : [],
			swarmEnabled: input.swarmEnabled === true
		}), config);
		if (input.kind === "resume" && input.snapshotBytes instanceof Uint8Array) return boundWorkerResult(await runResume({
			kind: "resume",
			wasmModule: input.wasmModule,
			snapshotBytes: input.snapshotBytes,
			config,
			settledRequests: Array.isArray(input.settledRequests) ? input.settledRequests : [],
			pendingRequests: Array.isArray(input.pendingRequests) ? input.pendingRequests : []
		}), config);
		return failedWorkerResult("invalid_input", "invalid code mode worker input");
	} catch (error) {
		const timedOut = isQuickJsInterruptedError(error);
		return failedWorkerResult(timedOut ? "timeout" : error instanceof CodeModeWorkerFailure ? error.code : "internal_error", timedOut ? "code mode timeout exceeded" : errorMessage(error));
	}
}
if (parentPort) Reflect.apply(Reflect.get(parentPort, "postMessage"), parentPort, [await main()]);
//#endregion
export {};
