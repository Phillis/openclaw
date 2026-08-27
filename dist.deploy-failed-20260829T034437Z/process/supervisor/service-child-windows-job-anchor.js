import { a as asOptionalRecord, l as isStringRecord } from "../../record-coerce-DItp3I4t.js";
import { t as getWindowsCmdExePath } from "../../windows-install-roots-BdGcwph2.js";
import { t as createWindowsOutputDecoder } from "../../windows-encoding-BFYUNnZu.js";
import { n as resolveEnvironmentValue, t as mergeProcessEnv } from "../../process-env-CW4bkwqq.js";
import { t as createDeferredCore } from "../../deferred-D0La5CRk.js";
//#region src/process/supervisor/service-child-windows-job-native.ts
const JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE = 8192;
const PROC_THREAD_ATTRIBUTE_HANDLE_LIST = 131074;
const PROC_THREAD_ATTRIBUTE_JOB_LIST = 131085;
const HANDLE_FLAG_INHERIT = 1;
const GENERIC_READ = 2147483648;
const OPEN_EXISTING = 3;
const FILE_ATTRIBUTE_NORMAL = 128;
function createWindowsJobBindings(koffi) {
	if (process.arch !== "x64" && process.arch !== "arm64") throw new Error(`Windows Job command ownership requires x64 or arm64, got ${process.arch}`);
	const kernel32 = koffi.load("kernel32.dll");
	const HANDLE = koffi.pointer("HANDLE", koffi.opaque());
	const VOID_POINTER = koffi.pointer("VOID_POINTER", koffi.opaque());
	const SECURITY_ATTRIBUTES = koffi.struct("SECURITY_ATTRIBUTES", {
		nLength: "uint32_t",
		lpSecurityDescriptor: VOID_POINTER,
		bInheritHandle: "int32_t"
	});
	const BASIC_LIMITS = koffi.struct("JOBOBJECT_BASIC_LIMIT_INFORMATION", {
		PerProcessUserTimeLimit: "int64_t",
		PerJobUserTimeLimit: "int64_t",
		LimitFlags: "uint32_t",
		MinimumWorkingSetSize: "uintptr_t",
		MaximumWorkingSetSize: "uintptr_t",
		ActiveProcessLimit: "uint32_t",
		Affinity: "uintptr_t",
		PriorityClass: "uint32_t",
		SchedulingClass: "uint32_t"
	});
	const IO_COUNTERS = koffi.struct("IO_COUNTERS", {
		ReadOperationCount: "uint64_t",
		WriteOperationCount: "uint64_t",
		OtherOperationCount: "uint64_t",
		ReadTransferCount: "uint64_t",
		WriteTransferCount: "uint64_t",
		OtherTransferCount: "uint64_t"
	});
	const EXTENDED_LIMITS = koffi.struct("JOBOBJECT_EXTENDED_LIMIT_INFORMATION", {
		BasicLimitInformation: BASIC_LIMITS,
		IoInfo: IO_COUNTERS,
		ProcessMemoryLimit: "uintptr_t",
		JobMemoryLimit: "uintptr_t",
		PeakProcessMemoryUsed: "uintptr_t",
		PeakJobMemoryUsed: "uintptr_t"
	});
	const BASIC_ACCOUNTING = koffi.struct("JOBOBJECT_BASIC_ACCOUNTING_INFORMATION", {
		TotalUserTime: "int64_t",
		TotalKernelTime: "int64_t",
		ThisPeriodTotalUserTime: "int64_t",
		ThisPeriodTotalKernelTime: "int64_t",
		TotalPageFaultCount: "uint32_t",
		TotalProcesses: "uint32_t",
		ActiveProcesses: "uint32_t",
		TotalTerminatedProcesses: "uint32_t"
	});
	const STARTUPINFO = koffi.struct("STARTUPINFOW", {
		cb: "uint32_t",
		lpReserved: VOID_POINTER,
		lpDesktop: VOID_POINTER,
		lpTitle: VOID_POINTER,
		dwX: "uint32_t",
		dwY: "uint32_t",
		dwXSize: "uint32_t",
		dwYSize: "uint32_t",
		dwXCountChars: "uint32_t",
		dwYCountChars: "uint32_t",
		dwFillAttribute: "uint32_t",
		dwFlags: "uint32_t",
		wShowWindow: "uint16_t",
		cbReserved2: "uint16_t",
		lpReserved2: VOID_POINTER,
		hStdInput: HANDLE,
		hStdOutput: HANDLE,
		hStdError: HANDLE
	});
	const STARTUPINFOEX = koffi.struct("STARTUPINFOEXW", {
		StartupInfo: STARTUPINFO,
		lpAttributeList: VOID_POINTER
	});
	const PROCESS_INFORMATION = koffi.struct("PROCESS_INFORMATION", {
		hProcess: HANDLE,
		hThread: HANDLE,
		dwProcessId: "uint32_t",
		dwThreadId: "uint32_t"
	});
	const getLastErrorCode = kernel32.func("__stdcall", "GetLastError", "uint32_t", []);
	const CloseHandle = kernel32.func("__stdcall", "CloseHandle", "int32_t", [HANDLE]);
	const CreateJobObjectW = kernel32.func("__stdcall", "CreateJobObjectW", HANDLE, [VOID_POINTER, "str16"]);
	const SetExtendedLimits = kernel32.func("__stdcall", "SetInformationJobObject", "int32_t", [
		HANDLE,
		"int32_t",
		koffi.pointer(EXTENDED_LIMITS),
		"uint32_t"
	]);
	const CreatePipe = kernel32.func("__stdcall", "CreatePipe", "int32_t", [
		koffi.out(koffi.pointer(HANDLE)),
		koffi.out(koffi.pointer(HANDLE)),
		koffi.pointer(SECURITY_ATTRIBUTES),
		"uint32_t"
	]);
	const SetHandleInformation = kernel32.func("__stdcall", "SetHandleInformation", "int32_t", [
		HANDLE,
		"uint32_t",
		"uint32_t"
	]);
	const CreateFileW = kernel32.func("__stdcall", "CreateFileW", HANDLE, [
		"str16",
		"uint32_t",
		"uint32_t",
		koffi.pointer(SECURITY_ATTRIBUTES),
		"uint32_t",
		"uint32_t",
		HANDLE
	]);
	const InitializeProcThreadAttributeList = kernel32.func("__stdcall", "InitializeProcThreadAttributeList", "int32_t", [
		VOID_POINTER,
		"uint32_t",
		"uint32_t",
		koffi.inout(koffi.pointer("uintptr_t"))
	]);
	const UpdateProcThreadAttribute = kernel32.func("__stdcall", "UpdateProcThreadAttribute", "int32_t", [
		VOID_POINTER,
		"uint32_t",
		"uintptr_t",
		VOID_POINTER,
		"uintptr_t",
		VOID_POINTER,
		VOID_POINTER
	]);
	const DeleteProcThreadAttributeList = kernel32.func("__stdcall", "DeleteProcThreadAttributeList", "void", [VOID_POINTER]);
	const CreateProcessW = kernel32.func("__stdcall", "CreateProcessW", "int32_t", [
		"str16",
		koffi.pointer("uint16_t"),
		VOID_POINTER,
		VOID_POINTER,
		"int32_t",
		"uint32_t",
		VOID_POINTER,
		"str16",
		koffi.pointer(STARTUPINFOEX),
		koffi.out(koffi.pointer(PROCESS_INFORMATION))
	]);
	const WaitForSingleObject = kernel32.func("__stdcall", "WaitForSingleObject", "uint32_t", [HANDLE, "uint32_t"]);
	const GetExitCodeProcess = kernel32.func("__stdcall", "GetExitCodeProcess", "int32_t", [HANDLE, koffi.out(koffi.pointer("uint32_t"))]);
	const QueryInformationJobObject = kernel32.func("__stdcall", "QueryInformationJobObject", "int32_t", [
		HANDLE,
		"int32_t",
		koffi.out(koffi.pointer(BASIC_ACCOUNTING)),
		"uint32_t",
		VOID_POINTER
	]);
	const PeekNamedPipe = kernel32.func("__stdcall", "PeekNamedPipe", "int32_t", [
		HANDLE,
		VOID_POINTER,
		"uint32_t",
		VOID_POINTER,
		koffi.out(koffi.pointer("uint32_t")),
		VOID_POINTER
	]);
	const ReadFile = kernel32.func("__stdcall", "ReadFile", "int32_t", [
		HANDLE,
		koffi.out(koffi.pointer("uint8_t")),
		"uint32_t",
		koffi.out(koffi.pointer("uint32_t")),
		VOID_POINTER
	]);
	const TerminateJobObject = kernel32.func("__stdcall", "TerminateJobObject", "int32_t", [HANDLE, "uint32_t"]);
	const lastError = (operation) => /* @__PURE__ */ new Error(`${operation} failed (Win32 error ${getLastErrorCode()})`);
	const requireHandle = (value, operation) => {
		if (typeof value !== "bigint" || value === 0n) throw lastError(operation);
		return value;
	};
	const createCommandStdio = () => {
		let stdinHandle;
		const outputPipes = {
			stdout: {},
			stderr: {}
		};
		const securityAttributes = {
			nLength: koffi.sizeof(SECURITY_ATTRIBUTES),
			lpSecurityDescriptor: null,
			bInheritHandle: 1
		};
		const closeChildHandles = () => {
			for (const handle of [
				stdinHandle,
				outputPipes.stdout.write,
				outputPipes.stderr.write
			]) if (handle !== void 0) CloseHandle(handle);
			stdinHandle = void 0;
			delete outputPipes.stdout.write;
			delete outputPipes.stderr.write;
		};
		const closeRawReadHandles = () => {
			for (const pipe of Object.values(outputPipes)) {
				const handle = pipe.read;
				if (handle !== void 0) CloseHandle(handle);
				delete pipe.read;
			}
		};
		try {
			for (const [streamName, pipe] of Object.entries(outputPipes)) {
				const read = [null];
				const write = [null];
				if (!CreatePipe(read, write, securityAttributes, 0)) throw lastError(`CreatePipe(${streamName})`);
				if (typeof write[0] === "bigint" && write[0] !== 0n) pipe.write = write[0];
				pipe.read = requireHandle(read[0], `CreatePipe(${streamName} read)`);
				pipe.write = requireHandle(write[0], `CreatePipe(${streamName} write)`);
				if (!SetHandleInformation(pipe.read, HANDLE_FLAG_INHERIT, 0)) throw lastError(`SetHandleInformation(${streamName} read)`);
			}
			const openedStdin = CreateFileW("NUL", GENERIC_READ, 3, securityAttributes, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, null);
			if (openedStdin === 18446744073709551615n) throw lastError("CreateFileW(NUL)");
			const childStdin = requireHandle(openedStdin, "CreateFileW(NUL)");
			stdinHandle = childStdin;
			const childStdout = outputPipes.stdout.write;
			const childStderr = outputPipes.stderr.write;
			if (childStdout === void 0 || childStderr === void 0) throw new Error("Windows command output handles were not initialized");
			return {
				inheritedHandles: [
					childStdin,
					childStdout,
					childStderr
				],
				stdinHandle: childStdin,
				stdoutWriteHandle: childStdout,
				stderrWriteHandle: childStderr,
				closeChildHandles,
				takeOutputReadHandles: () => {
					if (outputPipes.stdout.read === void 0 || outputPipes.stderr.read === void 0) throw new Error("Windows command output handles were already transferred");
					const output = {
						stdoutReadHandle: outputPipes.stdout.read,
						stderrReadHandle: outputPipes.stderr.read
					};
					delete outputPipes.stdout.read;
					delete outputPipes.stderr.read;
					return output;
				},
				close: () => {
					closeChildHandles();
					closeRawReadHandles();
				}
			};
		} catch (error) {
			closeChildHandles();
			closeRawReadHandles();
			throw error;
		}
	};
	const createProcessAttributeList = (handles, job) => {
		const size = [0n];
		InitializeProcThreadAttributeList(null, 2, 0, size);
		const attributeListSize = size[0] ?? 0n;
		if (attributeListSize <= 0n) throw lastError("InitializeProcThreadAttributeList(size)");
		const attributeList = Buffer.alloc(Number(attributeListSize));
		if (!InitializeProcThreadAttributeList(attributeList, 2, 0, size)) throw lastError("InitializeProcThreadAttributeList");
		const backingLists = [];
		const release = () => {
			DeleteProcThreadAttributeList(attributeList);
			backingLists.length = 0;
		};
		try {
			for (const { attribute, values, name } of [{
				attribute: PROC_THREAD_ATTRIBUTE_HANDLE_LIST,
				values: handles,
				name: "HANDLE_LIST"
			}, {
				attribute: PROC_THREAD_ATTRIBUTE_JOB_LIST,
				values: [job],
				name: "JOB_LIST"
			}]) {
				const backingList = Buffer.alloc(koffi.sizeof(HANDLE) * values.length);
				backingLists.push(backingList);
				koffi.encode(backingList, HANDLE, values, values.length);
				if (!UpdateProcThreadAttribute(attributeList, 0, attribute, backingList, koffi.sizeof(HANDLE) * values.length, null, null)) throw lastError(`UpdateProcThreadAttribute(${name})`);
			}
			return {
				attributeList,
				release
			};
		} catch (error) {
			release();
			throw error;
		}
	};
	return {
		CreateJobObjectW,
		SetExtendedLimits,
		CreateProcessW,
		WaitForSingleObject,
		GetExitCodeProcess,
		QueryInformationJobObject,
		PeekNamedPipe,
		ReadFile,
		TerminateJobObject,
		CloseHandle,
		getLastErrorCode,
		lastError,
		requireHandle,
		createCommandStdio,
		createProcessAttributeList,
		assertLayouts: () => {
			const actual = [
				koffi.sizeof(STARTUPINFO),
				koffi.sizeof(STARTUPINFOEX),
				koffi.sizeof(PROCESS_INFORMATION),
				koffi.sizeof(BASIC_LIMITS),
				koffi.sizeof(EXTENDED_LIMITS),
				koffi.sizeof(BASIC_ACCOUNTING),
				koffi.offsetof(BASIC_ACCOUNTING, "ActiveProcesses"),
				koffi.sizeof(SECURITY_ATTRIBUTES)
			];
			const expected = [
				104,
				112,
				24,
				64,
				144,
				48,
				40,
				24
			];
			if (actual.some((value, index) => value !== expected[index])) throw new Error(`Koffi Win32 layout mismatch: ${actual.join(",")}`);
		},
		extendedLimits: { BasicLimitInformation: { LimitFlags: JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE } },
		extendedLimitsSize: koffi.sizeof(EXTENDED_LIMITS),
		basicAccountingSize: koffi.sizeof(BASIC_ACCOUNTING),
		startupInfoExSize: koffi.sizeof(STARTUPINFOEX)
	};
}
//#endregion
//#region src/process/supervisor/service-child-windows-job-start.ts
function buildWindowsJobEnvironmentBlock(env) {
	const merged = mergeProcessEnv([env], "win32");
	for (const [key, value] of Object.entries(merged)) if (key.includes("\0") || value.includes("\0")) throw new Error("owned command environment contains a NUL byte");
	const entries = Object.keys(merged).toSorted((left, right) => {
		const leftFolded = left.toUpperCase();
		const rightFolded = right.toUpperCase();
		return leftFolded < rightFolded ? -1 : leftFolded > rightFolded ? 1 : 0;
	}).map((key) => `${key}=${merged[key]}`);
	return Buffer.from(`${entries.join("\0")}\0\0`, "utf16le");
}
function isWindowsJobServiceStart(value) {
	const message = asOptionalRecord(value);
	return Boolean(message && message.type === "start" && typeof message.generation === "string" && typeof message.command === "string" && Array.isArray(message.args) && message.args.every((arg) => typeof arg === "string") && (message.cwd === void 0 || typeof message.cwd === "string") && (message.env === void 0 || isStringRecord(message.env)) && (message.stdinMode === "inherit" || message.stdinMode === "pipe-open" || message.stdinMode === "pipe-closed") && (message.secretFd === void 0 || typeof message.secretFd === "number") && (message.controlFd === void 0 || typeof message.controlFd === "number") && (message.windowsShellCommand === void 0 || typeof message.windowsShellCommand === "string"));
}
//#endregion
//#region src/process/supervisor/service-child-windows-job-anchor.ts
const JOB_OBJECT_BASIC_ACCOUNTING_INFORMATION = 1;
const JOB_OBJECT_EXTENDED_LIMIT_INFORMATION = 9;
const STARTF_USESTDHANDLES = 256;
const WAIT_OBJECT_0 = 0;
const WAIT_TIMEOUT = 258;
const WAIT_FAILED = 4294967295;
const ERROR_BROKEN_PIPE = 109;
const IDLE_OBSERVATION_MS = 10;
const OUTPUT_BUFFER_BYTES = 64 * 1024;
const OUTPUT_ROUNDS_PER_TURN = 2;
function errorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
function sendProcessMessage(message) {
	return new Promise((resolve, reject) => {
		if (!process.connected || !process.send) {
			reject(/* @__PURE__ */ new Error("Windows Job anchor IPC is closed"));
			return;
		}
		process.send(message, (error) => error ? reject(error) : resolve());
	});
}
function runServiceChildWindowsJobAnchor() {
	let start;
	let state = "starting";
	let sequence = 0;
	let lastHostSequence = 0;
	let outboundQueue = Promise.resolve();
	let job;
	let processHandle;
	let bindings;
	let pendingCommandStdio;
	let rootObserved = false;
	let extinctionProven = false;
	let terminationRequested = false;
	let closeReason;
	let lifecycleTimer;
	let lifecycleImmediate;
	let lifecycleRunning = false;
	let lifecycleRerun = false;
	const outputStreams = [];
	const outputBuffer = Buffer.allocUnsafe(OUTPUT_BUFFER_BYTES);
	const startupErrorAcknowledged = createDeferredCore();
	const cleanupFinished = createDeferredCore();
	cleanupFinished.promise.catch(() => {});
	const send = (payload) => {
		if (!start) return Promise.reject(/* @__PURE__ */ new Error("Windows Job anchor has not started"));
		sequence += 1;
		const message = {
			...payload,
			generation: start.generation,
			sequence
		};
		const delivery = outboundQueue.then(() => sendProcessMessage(message));
		outboundQueue = delivery.catch(() => {});
		return delivery;
	};
	const deliver = async (payload) => {
		if (!process.connected) {
			if (!closeReason) requestCleanup("parent-lost");
			return;
		}
		try {
			await send(payload);
		} catch (error) {
			if (process.connected) throw error;
			if (!closeReason) requestCleanup("parent-lost");
		}
	};
	const stopLifecycle = () => {
		clearTimeout(lifecycleTimer);
		clearImmediate(lifecycleImmediate);
		lifecycleTimer = void 0;
		lifecycleImmediate = void 0;
	};
	const finishAnchor = (exitCode) => {
		stopLifecycle();
		process.exitCode = exitCode;
		if (process.connected) process.disconnect?.();
	};
	const closeOutputHandle = (stream) => {
		const handle = stream.handle;
		if (handle === void 0) return;
		if (!bindings) throw new Error(`${stream.name} output bindings were not initialized`);
		if (!bindings.CloseHandle(handle)) throw bindings.lastError(`CloseHandle(${stream.name} pipe)`);
		stream.handle = void 0;
	};
	const closeNativeHandles = () => {
		let closeError;
		for (const stream of outputStreams) try {
			closeOutputHandle(stream);
		} catch (error) {
			closeError ??= error instanceof Error ? error : new Error(errorMessage(error));
		}
		for (const handle of [processHandle, job]) if (handle !== void 0 && bindings && !bindings.CloseHandle(handle)) {
			const error = bindings.lastError("CloseHandle");
			closeError ??= error;
		}
		processHandle = void 0;
		job = void 0;
		if (closeError) throw closeError;
	};
	const closeAuthority = async (reason) => {
		if (state === "closed") return;
		state = "closed";
		stopLifecycle();
		try {
			if (process.connected) await send({
				type: "closing",
				reason
			});
			closeNativeHandles();
			cleanupFinished.resolve();
			finishAnchor(0);
		} catch (error) {
			try {
				closeNativeHandles();
			} catch {}
			cleanupFinished.reject(error);
			finishAnchor(1);
		}
	};
	const failAuthority = async (error) => {
		if (state === "closed") return;
		state = "closed";
		stopLifecycle();
		try {
			if (process.connected && start) await send({
				type: "result-error",
				error: errorMessage(error)
			}).catch(() => {});
			closeNativeHandles();
		} catch {} finally {
			cleanupFinished.reject(error);
			finishAnchor(1);
		}
	};
	const finishOutput = async (stream) => {
		if (stream.ended) return;
		closeOutputHandle(stream);
		stream.ended = true;
		const tail = stream.decoder?.flush();
		if (tail) await deliver({
			type: "output",
			stream: stream.name,
			chunk: tail
		});
		await deliver({
			type: "output-end",
			stream: stream.name
		});
	};
	const observeOutput = async (stream) => {
		if (stream.ended) return false;
		if (!bindings || stream.handle === void 0 || !stream.decoder) throw new Error(`${stream.name} output ownership was not initialized`);
		const available = [0];
		if (!bindings.PeekNamedPipe(stream.handle, null, 0, null, available, null)) {
			const errorCode = bindings.getLastErrorCode();
			if (errorCode !== ERROR_BROKEN_PIPE) throw new Error(`PeekNamedPipe(${stream.name}) failed (Win32 error ${errorCode})`);
			await finishOutput(stream);
			return true;
		}
		const availableBytes = available[0];
		if (typeof availableBytes !== "number" || !Number.isSafeInteger(availableBytes) || availableBytes < 0) throw new Error(`PeekNamedPipe(${stream.name}) returned an invalid byte count`);
		if (availableBytes === 0) return false;
		const requestedBytes = Math.min(availableBytes, outputBuffer.length);
		const bytesRead = [0];
		if (!bindings.ReadFile(stream.handle, outputBuffer, requestedBytes, bytesRead, null)) {
			const errorCode = bindings.getLastErrorCode();
			if (errorCode !== ERROR_BROKEN_PIPE) throw new Error(`ReadFile(${stream.name}) failed (Win32 error ${errorCode})`);
			await finishOutput(stream);
			return true;
		}
		const count = bytesRead[0];
		if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0 || count > requestedBytes) throw new Error(`ReadFile(${stream.name}) returned an invalid byte count`);
		if (count === 0) throw new Error(`ReadFile(${stream.name}) returned no available bytes`);
		const text = stream.decoder.decode(outputBuffer.subarray(0, count));
		if (text) await deliver({
			type: "output",
			stream: stream.name,
			chunk: text
		});
		return true;
	};
	const observeRoot = async () => {
		if (rootObserved) return false;
		if (!bindings || !processHandle) throw new Error("Windows root process ownership was not initialized");
		const waitResult = bindings.WaitForSingleObject(processHandle, 0);
		if (waitResult === WAIT_TIMEOUT) return false;
		if (waitResult === WAIT_FAILED) throw bindings.lastError("WaitForSingleObject(root)");
		if (waitResult !== WAIT_OBJECT_0) throw new Error(`WaitForSingleObject(root) returned unexpected result ${waitResult}`);
		const exitCode = [0];
		if (!bindings.GetExitCodeProcess(processHandle, exitCode)) throw bindings.lastError("GetExitCodeProcess");
		const code = exitCode[0];
		if (typeof code !== "number" || !Number.isSafeInteger(code) || code < 0 || code > 4294967295) throw new Error("GetExitCodeProcess returned an invalid exit code");
		rootObserved = true;
		await deliver({
			type: "root-result",
			code,
			signal: null
		});
		return true;
	};
	const observeJob = () => {
		if (extinctionProven) return false;
		if (!bindings || !job) throw new Error("Windows Job ownership was not initialized");
		const accounting = {};
		if (!bindings.QueryInformationJobObject(job, JOB_OBJECT_BASIC_ACCOUNTING_INFORMATION, accounting, bindings.basicAccountingSize, null)) throw bindings.lastError("QueryInformationJobObject");
		const count = accounting.ActiveProcesses;
		if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) throw new Error("QueryInformationJobObject returned an invalid active process count");
		extinctionProven = count === 0;
		return extinctionProven;
	};
	const runLifecycle = async () => {
		if (lifecycleRunning || state === "closed" || !processHandle) {
			lifecycleRerun ||= lifecycleRunning;
			return;
		}
		lifecycleRunning = true;
		let advanced = false;
		try {
			advanced = await observeRoot() || advanced;
			advanced = rootObserved && observeJob() || advanced;
			for (let round = 0; round < OUTPUT_ROUNDS_PER_TURN; round += 1) {
				let outputAdvanced = false;
				for (const stream of outputStreams) outputAdvanced = await observeOutput(stream) || outputAdvanced;
				advanced ||= outputAdvanced;
				if (!outputAdvanced) break;
			}
			if (extinctionProven && rootObserved && outputStreams.every((stream) => stream.ended)) {
				await closeAuthority(closeReason ?? "lineage-closed");
				return;
			}
		} catch (error) {
			await failAuthority(error);
			return;
		} finally {
			lifecycleRunning = false;
		}
		const immediate = advanced || lifecycleRerun;
		lifecycleRerun = false;
		scheduleLifecycle(immediate);
	};
	const scheduleLifecycle = (immediate) => {
		if (state === "closed" || !processHandle) return;
		if (lifecycleRunning) {
			lifecycleRerun ||= immediate;
			return;
		}
		if (immediate && lifecycleTimer) {
			clearTimeout(lifecycleTimer);
			lifecycleTimer = void 0;
		}
		if (lifecycleTimer || lifecycleImmediate) return;
		if (immediate) {
			lifecycleImmediate = setImmediate(() => {
				lifecycleImmediate = void 0;
				runLifecycle();
			});
			return;
		}
		lifecycleTimer = setTimeout(() => {
			lifecycleTimer = void 0;
			runLifecycle();
		}, IDLE_OBSERVATION_MS);
		if (state === "active" && process.connected) lifecycleTimer.unref();
	};
	const requestCleanup = (reason) => {
		if (state === "closed") return cleanupFinished.promise;
		closeReason ??= reason;
		state = "closing";
		if (!processHandle) {
			closeAuthority(reason);
			return cleanupFinished.promise;
		}
		if (!terminationRequested && !extinctionProven) {
			terminationRequested = true;
			if (!bindings || !job) {
				failAuthority(/* @__PURE__ */ new Error("Windows Job cleanup authority was not initialized"));
				return cleanupFinished.promise;
			}
			if (!bindings.TerminateJobObject(job, 1)) {
				const error = bindings.lastError("TerminateJobObject");
				failAuthority(error);
				return cleanupFinished.promise;
			}
		}
		scheduleLifecycle(true);
		return cleanupFinished.promise;
	};
	const reportStartupError = async (error) => {
		if (!process.connected) return;
		await send({
			type: "startup-error",
			error: errorMessage(error)
		});
		await startupErrorAcknowledged.promise;
	};
	const startCommand = async (next) => {
		start = next;
		if (typeof next.windowsShellCommand !== "string") {
			state = "closed";
			finishAnchor(1);
			return;
		}
		try {
			const koffi = (await import("koffi")).default;
			if (state !== "starting") return;
			bindings = createWindowsJobBindings(koffi);
			bindings.assertLayouts();
			job = bindings.requireHandle(bindings.CreateJobObjectW(null, null), "CreateJobObjectW");
			if (!bindings.SetExtendedLimits(job, JOB_OBJECT_EXTENDED_LIMIT_INFORMATION, bindings.extendedLimits, bindings.extendedLimitsSize)) throw bindings.lastError("SetInformationJobObject(KILL_ON_JOB_CLOSE)");
			const commandStdio = bindings.createCommandStdio();
			pendingCommandStdio = commandStdio;
			let processAttributes;
			const processInfo = {};
			try {
				processAttributes = bindings.createProcessAttributeList(commandStdio.inheritedHandles, job);
				const shell = resolveEnvironmentValue(next.env, "COMSPEC", "win32") || getWindowsCmdExePath(next.env);
				const commandLine = Buffer.from(`"${shell}" /d /s /c "${next.windowsShellCommand}"\0`, "utf16le");
				if (!bindings.CreateProcessW(shell, commandLine, null, null, 1, 525824, buildWindowsJobEnvironmentBlock(next.env), next.cwd ?? null, {
					StartupInfo: {
						cb: bindings.startupInfoExSize,
						dwFlags: STARTF_USESTDHANDLES,
						hStdInput: commandStdio.stdinHandle,
						hStdOutput: commandStdio.stdoutWriteHandle,
						hStdError: commandStdio.stderrWriteHandle
					},
					lpAttributeList: processAttributes.attributeList
				}, processInfo)) throw bindings.lastError("CreateProcessW(JOB_LIST)");
				processHandle = bindings.requireHandle(processInfo.hProcess, "CreateProcessW process");
				const threadHandle = bindings.requireHandle(processInfo.hThread, "CreateProcessW thread");
				if (!bindings.CloseHandle(threadHandle)) throw bindings.lastError("CloseHandle(command thread)");
			} finally {
				processAttributes?.release();
				pendingCommandStdio?.closeChildHandles();
			}
			const commandPid = Number(processInfo.dwProcessId);
			const handles = commandStdio.takeOutputReadHandles();
			outputStreams.push({
				name: "stdout",
				handle: handles.stdoutReadHandle,
				ended: false
			}, {
				name: "stderr",
				handle: handles.stderrReadHandle,
				ended: false
			});
			for (const stream of outputStreams) stream.decoder = createWindowsOutputDecoder();
			commandStdio.close();
			pendingCommandStdio = void 0;
			state = "active";
			const readyDelivery = send({
				type: "ready",
				commandPid,
				anchorPid: process.pid
			});
			scheduleLifecycle(true);
			await readyDelivery;
		} catch (error) {
			if (state === "closed") return;
			if (state === "closing") {
				await cleanupFinished.promise.catch(() => {});
				return;
			}
			if (processHandle && outputStreams.some((stream) => !stream.decoder)) for (const stream of outputStreams) {
				closeOutputHandle(stream);
				stream.ended = true;
			}
			await reportStartupError(error);
			await (processHandle ? requestCleanup("lineage-lost") : closeAuthority("lineage-lost"));
		} finally {
			pendingCommandStdio?.close();
			pendingCommandStdio = void 0;
		}
	};
	process.once("disconnect", () => {
		startupErrorAcknowledged.resolve();
		if (!start) {
			state = "closed";
			process.exitCode = 1;
			return;
		}
		requestCleanup("parent-lost");
	});
	process.once("SIGTERM", () => void requestCleanup("parent-lost"));
	process.once("SIGINT", () => void requestCleanup("parent-lost"));
	process.on("message", (raw) => {
		if (isWindowsJobServiceStart(raw) && start === void 0 && state === "starting") {
			startCommand(raw);
			return;
		}
		const message = asOptionalRecord(raw);
		if (!start || state === "closed" || !message || message.type !== "cancel" && message.type !== "startup-error-ack" || typeof message.generation !== "string" || typeof message.sequence !== "number" || message.generation !== start.generation || message.sequence <= lastHostSequence) {
			if (start && state !== "closed") requestCleanup("lineage-lost");
			return;
		}
		lastHostSequence = message.sequence;
		if (message.type === "startup-error-ack") startupErrorAcknowledged.resolve();
		else requestCleanup("cancel");
	});
}
runServiceChildWindowsJobAnchor();
//#endregion
export { runServiceChildWindowsJobAnchor };
