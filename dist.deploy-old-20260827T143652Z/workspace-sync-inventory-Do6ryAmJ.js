import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as hasNodeErrorCode } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { t as killProcessTree } from "./kill-tree-B-nnBWyI.js";
import { a as workerSshCommandOptions } from "./ssh-DfcMAYGe.js";
import { a as isDerivedWorkspacePath } from "./workspace-path-exclusions-DDdHI_3m.js";
import { S as MAX_WORKSPACE_INVENTORY_ENTRIES, g as gitFileMode, t as isPortableRootContainedSymlink, x as MAX_WORKSPACE_GIT_CANDIDATES } from "./workspace-actual-manifest-B7ccel6H.js";
import { createReadStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { spawn } from "node:child_process";
//#region src/gateway/worker-environments/workspace-sync-inventory.ts
const COMMAND_KILL_GRACE_MS = 300;
var WorkerWorkspacePreflightError = class extends Error {
	constructor(message) {
		super(message);
		this.code = "invalid_state";
		this.name = "WorkerWorkspacePreflightError";
	}
};
const workspaceInventoryError = (message) => new WorkerWorkspacePreflightError(message);
function assertWorkerWorkspaceInventoryValues(manifestEntries, manifestPathBytes, transferPathBytes, manifestBytes, eligibleBytes) {
	if (manifestEntries > 25e4) throw workspaceInventoryError(`Cloud workspace inventory exceeds ${MAX_WORKSPACE_INVENTORY_ENTRIES} manifest entries; reduce eligible files or narrow .worktreeinclude`);
	if (manifestPathBytes > 67108864) throw workspaceInventoryError("Cloud workspace manifest paths exceed the 64 MiB metadata limit; reduce eligible files or shorten their paths");
	if (transferPathBytes > 67108864) throw workspaceInventoryError("Cloud workspace eligible paths exceed the 64 MiB metadata limit; reduce eligible files or narrow .worktreeinclude");
	if (manifestBytes > 67108864) throw workspaceInventoryError("Cloud workspace manifest exceeds the 64 MiB limit; reduce eligible files or shorten their paths");
	if (eligibleBytes > 4294967296) throw workspaceInventoryError("Cloud workspace eligible content exceeds the 4 GiB limit; remove large eligible files or ignore them");
}
function inventoryEntryJson(entry) {
	if (entry.type === "directory") return JSON.stringify({
		path: entry.path,
		type: entry.type,
		mode: 448
	});
	if (entry.type === "symlink") return JSON.stringify({
		path: entry.path,
		type: entry.type,
		mode: 511,
		target: entry.target
	});
	return JSON.stringify({
		path: entry.path,
		type: entry.type,
		mode: gitFileMode(entry.mode),
		size: entry.size,
		sha256: "0".repeat(64)
	});
}
var WorkerWorkspaceInventoryBudget = class {
	#paths = /* @__PURE__ */ new Set();
	#emptyManifestBytes = Buffer.byteLength(JSON.stringify({
		version: 1,
		baseCommit: "0".repeat(64),
		entries: []
	}));
	#manifestPathBytes = 0;
	#transferPathBytes = 0;
	#manifestEntryBytes = 0;
	#eligibleBytes = 0;
	#assert() {
		const manifestEntries = this.#paths.size;
		assertWorkerWorkspaceInventoryValues(manifestEntries, this.#manifestPathBytes, this.#transferPathBytes, this.#emptyManifestBytes + this.#manifestEntryBytes + Math.max(0, manifestEntries - 1), this.#eligibleBytes);
	}
	addTransferPath(entryPath) {
		this.#transferPathBytes += Buffer.byteLength(entryPath) + 1;
		this.#assert();
	}
	addEntry(entry) {
		if (this.#paths.has(entry.path)) return;
		this.#paths.add(entry.path);
		this.#manifestPathBytes += Buffer.byteLength(entry.path);
		this.#eligibleBytes += entry.type === "file" ? entry.size : entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0;
		this.#manifestEntryBytes += Buffer.byteLength(inventoryEntryJson(entry));
		this.#assert();
	}
};
function validateGitRelativePath(file) {
	if (!file || path.posix.isAbsolute(file) || path.posix.normalize(file) !== file || file === ".." || file.startsWith("../")) throw new Error("Worker workspace git file list contains an unsafe path");
	return file;
}
async function* readBoundedGitPathCandidates(filePath) {
	let pending = Buffer.alloc(0);
	let candidateCount = 0;
	let pathBytes = 0;
	for await (const value of createReadStream(filePath)) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		pathBytes += chunk.byteLength;
		if (pathBytes > 67108864) throw workspaceInventoryError("Cloud workspace Git path metadata exceeds the 64 MiB limit");
		const buffer = pending.length === 0 ? chunk : Buffer.concat([pending, chunk]);
		let offset = 0;
		for (;;) {
			const separator = buffer.indexOf(0, offset);
			if (separator < 0) break;
			candidateCount += 1;
			if (candidateCount > 1e6) throw workspaceInventoryError(`Cloud workspace Git path candidates exceed the ${MAX_WORKSPACE_GIT_CANDIDATES} limit`);
			yield validateGitRelativePath(buffer.subarray(offset, separator).toString("utf8"));
			offset = separator + 1;
		}
		pending = Buffer.from(buffer.subarray(offset));
	}
	if (pending.length > 0) throw new Error("Worker workspace git file list is not NUL terminated");
}
async function runWorkspaceInventoryCommandToFile(params) {
	const [command, ...args] = params.argv;
	if (!command) throw new Error("Worker workspace command requires an executable");
	const output = await fs$1.open(params.outputPath, "wx", 384);
	const input = params.inputPath ? await fs$1.open(params.inputPath, "r") : void 0;
	let stderr = "";
	let timer;
	let terminationTimer;
	let abort;
	let outputError;
	let outputBytes = 0;
	let outputWrite = Promise.resolve();
	try {
		if (params.signal.aborted) throw new Error("Worker workspace file enumeration was aborted");
		const boundedOutput = params.maxOutputBytes !== void 0;
		const child = spawn(command, args, {
			env: workerSshCommandOptions({ timeoutMs: params.timeoutMs }).baseEnv,
			stdio: [
				input?.fd ?? "ignore",
				boundedOutput ? "pipe" : output.fd,
				"pipe"
			],
			...process.platform !== "win32" ? { detached: true } : {},
			windowsHide: true
		});
		const childStderr = child.stderr;
		if (!childStderr) throw new Error("Worker workspace command has no stderr pipe");
		childStderr.setEncoding("utf8");
		childStderr.on("data", (chunk) => {
			stderr = sliceUtf16Safe(`${stderr}${chunk}`, -4096);
		});
		const result = await new Promise((resolve) => {
			let settled = false;
			const finish = (value) => {
				if (settled) return;
				settled = true;
				resolve(value);
			};
			let terminationStarted = false;
			const terminate = () => {
				if (settled || terminationStarted) return;
				terminationStarted = true;
				const pid = child.pid;
				if (typeof pid === "number" && pid > 0) killProcessTree(pid, {
					graceMs: COMMAND_KILL_GRACE_MS,
					detached: process.platform !== "win32"
				});
				else child.kill("SIGTERM");
				terminationTimer = setTimeout(() => {
					if (typeof pid === "number" && pid > 0) killProcessTree(pid, {
						force: true,
						detached: process.platform !== "win32"
					});
					else child.kill("SIGKILL");
					childStderr.destroy();
					finish({ code: null });
				}, 1300);
				terminationTimer.unref?.();
			};
			if (boundedOutput) {
				const childStdout = child.stdout;
				if (!childStdout) {
					finish({
						code: null,
						error: /* @__PURE__ */ new Error("Worker workspace command has no stdout pipe")
					});
					return;
				}
				childStdout.on("data", (value) => {
					const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
					outputBytes += chunk.byteLength;
					if (outputBytes > params.maxOutputBytes) {
						outputError = workspaceInventoryError(`Cloud workspace pack exceeds the ${params.maxOutputBytes} byte limit`);
						terminate();
						return;
					}
					childStdout.pause();
					outputWrite = outputWrite.then(async () => {
						await output.writeFile(chunk);
						childStdout.resume();
					}).catch((error) => {
						outputError = error instanceof Error ? error : new Error(String(error));
						terminate();
					});
				});
				childStdout.once("error", (error) => {
					outputError = error;
					terminate();
				});
			}
			child.once("error", (error) => finish({
				code: null,
				error
			}));
			child.once("close", (code) => finish({ code }));
			abort = terminate;
			params.signal.addEventListener("abort", abort, { once: true });
			timer = setTimeout(terminate, params.timeoutMs);
			timer.unref?.();
			if (params.signal.aborted) terminate();
		});
		await outputWrite;
		if (outputError) throw outputError;
		if (result.error) throw result.error;
		if (params.signal.aborted) throw new Error("Worker workspace file enumeration was aborted");
		if (result.code !== 0) throw new Error(stderr.trim() ? `Worker workspace file enumeration failed: ${stderr.trim()}` : "Worker workspace file enumeration failed");
	} finally {
		clearTimeout(timer);
		clearTimeout(terminationTimer);
		if (abort) params.signal.removeEventListener("abort", abort);
		await output.close();
		await input?.close();
	}
}
async function writeEligibleGitFiles(params) {
	const output = await fs$1.open(params.outputPath, "wx", 384);
	const canonicalRoot = await fs$1.realpath(params.gitRoot);
	const budget = new WorkerWorkspaceInventoryBudget();
	const transferredPaths = /* @__PURE__ */ new Set();
	let buffered = [];
	let bufferedBytes = 0;
	const flush = async () => {
		if (buffered.length === 0) return;
		await output.writeFile(buffered.join(""));
		buffered = [];
		bufferedBytes = 0;
	};
	const appendIfTransferable = async (file) => {
		if (isDerivedWorkspacePath(file) || transferredPaths.has(file)) return;
		const absolute = path.join(canonicalRoot, file);
		const stats = await fs$1.lstat(absolute).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
			throw error;
		});
		if (!stats || !stats.isFile() && !stats.isSymbolicLink()) return;
		transferredPaths.add(file);
		let symlinkTarget;
		if (stats.isSymbolicLink()) {
			symlinkTarget = await fs$1.readlink(absolute);
			if (!isPortableRootContainedSymlink(canonicalRoot, file, symlinkTarget)) throw workspaceInventoryError(`Cloud workspace symlink is not portable or escapes the sync root: ${sliceUtf16Safe(file, 0, 160)}`);
		}
		const segments = file.split("/");
		for (let index = 1; index < segments.length; index += 1) budget.addEntry({
			path: segments.slice(0, index).join("/"),
			type: "directory"
		});
		if (stats.isSymbolicLink()) budget.addEntry({
			path: file,
			type: "symlink",
			target: symlinkTarget
		});
		else budget.addEntry({
			path: file,
			type: "file",
			mode: stats.mode & 511,
			size: stats.size
		});
		budget.addTransferPath(file);
		const record = `${file}\0`;
		buffered.push(record);
		bufferedBytes += Buffer.byteLength(record);
		if (bufferedBytes >= 64 * 1024) await flush();
	};
	try {
		for await (const file of readBoundedGitPathCandidates(params.eligiblePath)) await appendIfTransferable(file);
		const ignored = readBoundedGitPathCandidates(params.ignoredPath)[Symbol.asyncIterator]();
		const selected = readBoundedGitPathCandidates(params.selectedPath)[Symbol.asyncIterator]();
		let ignoredItem = await ignored.next();
		let selectedItem = await selected.next();
		while (!ignoredItem.done && !selectedItem.done) {
			const order = Buffer.compare(Buffer.from(ignoredItem.value), Buffer.from(selectedItem.value));
			if (order === 0) {
				await appendIfTransferable(ignoredItem.value);
				ignoredItem = await ignored.next();
				selectedItem = await selected.next();
			} else if (order < 0) ignoredItem = await ignored.next();
			else selectedItem = await selected.next();
		}
		while (!ignoredItem.done) ignoredItem = await ignored.next();
		while (!selectedItem.done) selectedItem = await selected.next();
		await flush();
	} finally {
		await output.close();
	}
}
async function createWorkspaceGitTransferList(params) {
	const eligiblePath = path.join(params.temporaryDirectory, "eligible");
	const ignoredPath = path.join(params.temporaryDirectory, "ignored");
	const selectedPath = path.join(params.temporaryDirectory, "selected");
	const outputPath = path.join(params.temporaryDirectory, "transfer-list");
	await fs$1.mkdir(params.temporaryDirectory, { mode: 448 });
	await runWorkspaceInventoryCommandToFile({
		argv: [
			"git",
			"-C",
			params.gitRoot,
			"ls-files",
			"--full-name",
			"--cached",
			"--others",
			"--exclude-standard",
			"-z"
		],
		outputPath: eligiblePath,
		signal: params.signal,
		timeoutMs: params.timeoutMs
	});
	const worktreeIncludePath = path.join(params.gitRoot, ".worktreeinclude");
	if ((await fs$1.lstat(worktreeIncludePath).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
		throw error;
	}))?.isFile()) {
		const [ignoredResult, selectedResult] = await Promise.allSettled([runWorkspaceInventoryCommandToFile({
			argv: [
				"git",
				"-C",
				params.gitRoot,
				"ls-files",
				"--full-name",
				"--others",
				"--ignored",
				"--exclude-standard",
				"-z"
			],
			outputPath: ignoredPath,
			signal: params.signal,
			timeoutMs: params.timeoutMs
		}), runWorkspaceInventoryCommandToFile({
			argv: [
				"git",
				"-C",
				params.gitRoot,
				"ls-files",
				"--full-name",
				"--others",
				"--ignored",
				`--exclude-from=${worktreeIncludePath}`,
				"-z"
			],
			outputPath: selectedPath,
			signal: params.signal,
			timeoutMs: params.timeoutMs
		})]);
		if (ignoredResult.status === "rejected") throw ignoredResult.reason;
		if (selectedResult.status === "rejected") throw selectedResult.reason;
	} else await Promise.all([fs$1.writeFile(ignoredPath, "", { mode: 384 }), fs$1.writeFile(selectedPath, "", { mode: 384 })]);
	await writeEligibleGitFiles({
		gitRoot: params.gitRoot,
		eligiblePath,
		ignoredPath,
		selectedPath,
		outputPath
	});
	return outputPath;
}
//#endregion
export { runWorkspaceInventoryCommandToFile as n, workspaceInventoryError as r, createWorkspaceGitTransferList as t };
