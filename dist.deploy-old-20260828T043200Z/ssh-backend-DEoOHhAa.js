import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { C as parseStrictNonNegativeInteger, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { o as PATH_ALIAS_POLICIES } from "./root-impl-BbMR4leC.js";
import { n as resolveRootPath } from "./root-path-CsUfUJ7P.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { t as createAbortError } from "./abort-signal-D2k14JsD.js";
import { s as coerceSecretRef } from "./types.secrets-Bre8L6Ts.js";
import "./boundary-path-DDLrDh1C.js";
import "./errors-Ccx0R-_Z.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { i as listAgentEntriesWithSource, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { f as secretRefKey } from "./ref-contract-BHWY70rN.js";
import { a as normalizeEnvVarKey } from "./host-env-security-B_a4cpNH.js";
import { t as createContainerEnvFile } from "./container-env-file-DfZQ-p50.js";
import { c as spawnCommand, u as isPlainCommandExitFailure } from "./exec-D2kbpwdA.js";
import "./path-alias-guards-C2hsuc07.js";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-D5EZZ925.js";
import { x as SANDBOX_COMMAND_MAX_BUFFER_BYTES } from "./constants-CZykxrCI.js";
import { i as resolveSandboxConfigForAgent } from "./config-CfIhW1Vb.js";
import { t as hashTextSha256 } from "./hash-DZK-8tRm.js";
import { n as sanitizeEnvVars } from "./sanitize-env-vars-DrKKX-jQ.js";
import { A as execContainerRaw, D as DOCKER_SANDBOX_ENGINE, E as validateSandboxContainerEngineTarget, O as PODMAN_SANDBOX_ENGINE, T as resolvePodmanSandboxRuntimeInfo, k as execContainer, n as containerState, o as ensureSandboxContainer, w as bindPodmanSandboxEngine } from "./docker-Cvt4DYNi.js";
import { n as normalizeContainerPathCore, r as relativePathEscapesContainerRoot, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.js";
import { a as isExistingWorkspaceSkillMountSource, o as resolveMaterializedSandboxSkillsWorkspaceDir } from "./workspace-mounts-DBv2Eyoj.js";
import { n as resolveSandboxAgentId } from "./shared-BYKW6NFa.js";
import { n as runtimeSandboxSecretOwnerId, t as assertRuntimeSandboxSecretOwnerAvailable } from "./runtime-sandbox-secret-owner-BoM2WBV0.js";
import { t as parseSshTarget } from "./ssh-tunnel-DR1fowhG.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
//#region src/agents/sandbox/docker-backend.ts
/**
* Docker sandbox backend implementation.
*
* Creates/reuses Docker containers and exposes backend-neutral exec and shell-command handles.
*/
function resolveContainerExecEnv(env) {
	const { PATH: requestedPath, ...containerEnv } = env;
	if (requestedPath) containerEnv.OPENCLAW_PREPEND_PATH = requestedPath;
	return containerEnv;
}
function buildContainerExecArgs(params) {
	const args = ["exec", "-i"];
	if (params.tty) args.push("-t");
	if (params.workdir) args.push("-w", params.workdir);
	args.push("--env-file", params.envFile);
	const pathExport = params.env.PATH ? "export PATH=\"${OPENCLAW_PREPEND_PATH}:$PATH\"; unset OPENCLAW_PREPEND_PATH; " : "";
	args.push(params.containerName, "/bin/sh", "-lc", `${pathExport}${params.command}`);
	return args;
}
function resolveConfiguredDockerRuntimeImage(params) {
	const sandboxCfg = resolveSandboxConfigForAgent(params.config, params.agentId);
	switch (params.configLabelKind) {
		case "BrowserImage": return sandboxCfg.browser.image;
		default: return sandboxCfg.docker.image;
	}
}
async function createContainerSandboxBackend(engine, params) {
	if (engine.id === "podman" && params.cfg.browser.enabled) throw new Error("Podman sandboxing does not support browser sandboxes. Install Docker and select the docker backend, or disable sandbox.browser.enabled.");
	const podmanTarget = engine.id === "podman" ? (await resolvePodmanSandboxRuntimeInfo()).target : void 0;
	const boundEngine = podmanTarget ? bindPodmanSandboxEngine(podmanTarget) : engine;
	return createContainerSandboxBackendHandle({
		engine: boundEngine,
		containerName: await ensureSandboxContainer({
			engine: boundEngine,
			...podmanTarget ? { podmanTarget } : {},
			scopeKey: params.scopeKey,
			workspaceDir: params.workspaceDir,
			agentWorkspaceDir: params.agentWorkspaceDir,
			skillsWorkspaceDir: params.skillsWorkspaceDir,
			cfg: params.cfg,
			...params.requireCurrentConfig !== void 0 ? { requireCurrentConfig: params.requireCurrentConfig } : {}
		}),
		workdir: params.cfg.docker.workdir,
		env: params.cfg.docker.env,
		image: params.cfg.docker.image,
		podmanTarget
	});
}
async function createDockerSandboxBackend(params) {
	return await createContainerSandboxBackend(DOCKER_SANDBOX_ENGINE, params);
}
async function createPodmanSandboxBackend(params) {
	return await createContainerSandboxBackend(PODMAN_SANDBOX_ENGINE, params);
}
function createContainerSandboxBackendHandle(params) {
	return {
		id: params.engine.id,
		runtimeId: params.containerName,
		runtimeLabel: params.containerName,
		workdir: params.workdir,
		env: params.env,
		configLabel: params.image,
		configLabelKind: "Image",
		capabilities: { browser: params.engine.id === "docker" },
		async buildExecSpec({ command, workdir, env, usePty }) {
			await validateSandboxContainerEngineTarget(params.engine, params.podmanTarget);
			const envFile = await createContainerEnvFile(resolveContainerExecEnv(env));
			try {
				return {
					argv: [
						params.engine.command,
						...params.engine.globalArgs ?? [],
						...buildContainerExecArgs({
							containerName: params.containerName,
							command,
							workdir: workdir ?? params.workdir,
							env,
							envFile: envFile.path,
							tty: usePty
						})
					],
					env: process.env,
					stdinMode: usePty ? "pipe-open" : "pipe-closed",
					finalizeToken: envFile.cleanup
				};
			} catch (error) {
				await envFile.cleanup();
				throw error;
			}
		},
		async finalizeExec({ token }) {
			if (token === void 0) return;
			if (typeof token !== "function") throw new Error("Invalid container sandbox execution cleanup token.");
			await token();
		},
		runShellCommand(command) {
			return runContainerSandboxShellCommand({
				engine: params.engine,
				containerName: params.containerName,
				podmanTarget: params.podmanTarget,
				...command
			});
		}
	};
}
async function runContainerSandboxShellCommand(params) {
	await validateSandboxContainerEngineTarget(params.engine, params.podmanTarget);
	const dockerArgs = [
		"exec",
		"-i",
		params.containerName,
		"sh",
		"-c",
		params.script,
		"openclaw-sandbox-fs"
	];
	if (params.args?.length) dockerArgs.push(...params.args);
	return execContainerRaw(params.engine, dockerArgs, {
		input: params.stdin,
		allowFailure: params.allowFailure,
		signal: params.signal
	});
}
function runDockerSandboxShellCommand(params) {
	return runContainerSandboxShellCommand({
		engine: DOCKER_SANDBOX_ENGINE,
		...params
	});
}
function createContainerSandboxBackendManager(engine) {
	const resolvePodmanTarget = (entry) => {
		if (engine.id !== "podman") return;
		if (entry.backendTarget) return entry.backendTarget;
		throw Object.assign(/* @__PURE__ */ new Error(`Podman sandbox runtime ${entry.containerName} has no recorded engine target. Remove that unshipped runtime manually before managing it.`), { code: "INVALID_CONFIG" });
	};
	return {
		async describeRuntime({ entry, config, agentId }) {
			const podmanTarget = resolvePodmanTarget(entry);
			await validateSandboxContainerEngineTarget(engine, podmanTarget);
			const runtimeEngine = podmanTarget ? bindPodmanSandboxEngine(podmanTarget) : engine;
			const state = await containerState(runtimeEngine, entry.containerName);
			let actualConfigLabel = entry.image;
			let actualImageId;
			if (state.exists) try {
				const result = await execContainer(runtimeEngine, [
					"inspect",
					"-f",
					runtimeEngine.id === "podman" ? "{{.ImageName}}	{{.Image}}" : "{{.Config.Image}}",
					entry.containerName
				], { allowFailure: true });
				if (result.code === 0) {
					const inspected = result.stdout.trim();
					if (runtimeEngine.id === "podman") {
						const [imageName, imageId] = inspected.split("	", 2);
						actualConfigLabel = imageName || actualConfigLabel;
						actualImageId = imageId;
					} else actualConfigLabel = inspected || actualConfigLabel;
				}
			} catch {}
			const configuredImage = resolveConfiguredDockerRuntimeImage({
				config,
				agentId,
				configLabelKind: entry.configLabelKind
			});
			let configLabelMatch = actualConfigLabel === configuredImage;
			if (runtimeEngine.id === "podman" && !configLabelMatch && actualImageId) try {
				const result = await execContainer(runtimeEngine, [
					"image",
					"inspect",
					"-f",
					"{{.Id}}",
					configuredImage
				], { allowFailure: true });
				if (result.code === 0) {
					const normalizeImageId = (value) => value.trim().replace(/^sha256:/u, "");
					configLabelMatch = normalizeImageId(actualImageId) === normalizeImageId(result.stdout);
				}
			} catch {}
			return {
				running: state.running,
				actualConfigLabel,
				configLabelMatch
			};
		},
		async removeRuntime({ entry }) {
			const podmanTarget = resolvePodmanTarget(entry);
			await validateSandboxContainerEngineTarget(engine, podmanTarget);
			const result = await execContainer(podmanTarget ? bindPodmanSandboxEngine(podmanTarget) : engine, [
				"rm",
				"-f",
				entry.containerName
			], { allowFailure: true });
			if (result.code !== 0) {
				const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
				if (/No such (container|object)|does not exist/iu.test(detail)) return;
				throw new Error(`Failed to remove ${engine.displayName} sandbox runtime ${entry.containerName}: ${detail}`);
			}
		}
	};
}
const dockerSandboxBackendManager = createContainerSandboxBackendManager(DOCKER_SANDBOX_ENGINE);
const podmanSandboxBackendManager = createContainerSandboxBackendManager(PODMAN_SANDBOX_ENGINE);
//#endregion
//#region src/agents/sandbox/fs-bridge-native-mutation-python.ts
const SANDBOX_CREATE_STAGING_PYTHON = [
	"def create_staging_dir(parent_fd):",
	"    # This helper guarantees descriptor-relative confinement and no-replace",
	"    # publication, not content integrity against same-UID peers; they can",
	"    # also rewrite the destination immediately after publication.",
	"    prefix = '.openclaw-create-'",
	"    for _ in range(128):",
	"        candidate = prefix + secrets.token_hex(6)",
	"        try:",
	"            os.mkdir(candidate, 0o700, dir_fd=parent_fd)",
	"        except FileExistsError:",
	"            continue",
	"        created_identity = entry_identity(os.lstat(candidate, dir_fd=parent_fd))",
	"        staging_fd = None",
	"        try:",
	"            staging_fd = open_dir(candidate, dir_fd=parent_fd)",
	"            if not same_identity(created_identity, os.fstat(staging_fd)):",
	"                raise OSError(errno.ESTALE, 'create staging directory changed', candidate)",
	"            return candidate, staging_fd",
	"        except Exception:",
	"            if staging_fd is not None:",
	"                os.close(staging_fd)",
	"            try:",
	"                current = os.lstat(candidate, dir_fd=parent_fd)",
	"                if same_identity(created_identity, current):",
	"                    os.rmdir(candidate, dir_fd=parent_fd)",
	"                    os.fsync(parent_fd)",
	"            except FileNotFoundError:",
	"                pass",
	"            raise",
	"    raise RuntimeError('failed to allocate sandbox create staging directory')"
].join("\n");
const SANDBOX_RENAME_NO_REPLACE_PYTHON = [
	"def rename_no_replace(src_parent_fd, src_basename, dst_parent_fd, dst_basename):",
	"    libc = ctypes.CDLL(None, use_errno=True)",
	"    is_linux = sys.platform.startswith('linux')",
	"    if is_linux:",
	"        rename_fn = getattr(libc, 'renameat2', None)",
	"        if rename_fn is None:",
	"            os.link(",
	"                src_basename,",
	"                dst_basename,",
	"                src_dir_fd=src_parent_fd,",
	"                dst_dir_fd=dst_parent_fd,",
	"                follow_symlinks=False,",
	"            )",
	"            return",
	"        flags = 1  # RENAME_NOREPLACE",
	"    elif sys.platform == 'darwin':",
	"        rename_fn = getattr(libc, 'renameatx_np', None)",
	"        flags = 0x00000004  # RENAME_EXCL",
	"    else:",
	"        rename_fn = None",
	"        flags = 0",
	"    if rename_fn is None:",
	"        raise OSError(errno.ENOSYS, 'atomic no-replace rename is unavailable')",
	"    rename_fn.argtypes = [ctypes.c_int, ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p, ctypes.c_uint]",
	"    rename_fn.restype = ctypes.c_int",
	"    result = rename_fn(",
	"        src_parent_fd,",
	"        os.fsencode(src_basename),",
	"        dst_parent_fd,",
	"        os.fsencode(dst_basename),",
	"        flags,",
	"    )",
	"    if result != 0:",
	"        error_code = ctypes.get_errno()",
	"        unsupported_codes = {errno.ENOSYS, errno.EINVAL, errno.ENOTSUP}",
	"        if hasattr(errno, 'EOPNOTSUPP'):",
	"            unsupported_codes.add(errno.EOPNOTSUPP)",
	"        if is_linux and error_code in unsupported_codes:",
	"            os.link(",
	"                src_basename,",
	"                dst_basename,",
	"                src_dir_fd=src_parent_fd,",
	"                dst_dir_fd=dst_parent_fd,",
	"                follow_symlinks=False,",
	"            )",
	"            return",
	"        raise OSError(error_code, os.strerror(error_code), dst_basename)"
].join("\n");
const SANDBOX_CREATE_EXCLUSIVE_PYTHON = [
	"def create_exclusive(parent_fd, basename, stdin_buffer):",
	"    staging_fd = None",
	"    staging_name = None",
	"    temp_fd = None",
	"    temp_name = 'payload'",
	"    temp_inode = None",
	"    try:",
	"        try:",
	"            os.lstat(basename, dir_fd=parent_fd)",
	"        except FileNotFoundError:",
	"            pass",
	"        else:",
	"            raise FileExistsError(errno.EEXIST, os.strerror(errno.EEXIST), basename)",
	"        staging_name, staging_fd = create_staging_dir(parent_fd)",
	"        temp_fd = os.open(temp_name, WRITE_FLAGS, 0o600, dir_fd=staging_fd)",
	"        while True:",
	"            chunk = stdin_buffer.read(65536)",
	"            if not chunk:",
	"                break",
	"            write_all(temp_fd, chunk)",
	"        # exclusive create payload is durable before publication",
	"        os.fsync(temp_fd)",
	"        temp_inode = inode_identity(os.fstat(temp_fd))",
	"        # Publish with a native atomic no-replace rename.",
	"        rename_no_replace(staging_fd, temp_name, parent_fd, basename)",
	"        target_stat = os.lstat(basename, dir_fd=parent_fd)",
	"        if temp_inode != inode_identity(target_stat):",
	"            raise OSError(errno.ESTALE, 'exclusive publication source changed', basename)",
	"        os.fsync(parent_fd)",
	"    finally:",
	"        if temp_fd is not None:",
	"            os.close(temp_fd)",
	"        if staging_fd is not None:",
	"            # Cleanup stays relative to the private pinned directory, so a",
	"            # parent-path substitution cannot redirect payload deletion.",
	"            try:",
	"                os.unlink(temp_name, dir_fd=staging_fd)",
	"            except FileNotFoundError:",
	"                pass",
	"            staging_identity = entry_identity(os.fstat(staging_fd))",
	"            os.close(staging_fd)",
	"            staging_removed = False",
	"            if staging_name is not None:",
	"                try:",
	"                    current_staging = os.lstat(staging_name, dir_fd=parent_fd)",
	"                    if same_identity(staging_identity, current_staging):",
	"                        os.rmdir(staging_name, dir_fd=parent_fd)",
	"                        staging_removed = True",
	"                except FileNotFoundError:",
	"                    pass",
	"            if staging_removed:",
	"                os.fsync(parent_fd)"
].join("\n");
//#endregion
//#region src/agents/sandbox/fs-bridge-mutation-helper.ts
/**
* Pinned Python mutation helper for sandbox filesystem writes.
*
* Performs symlink-resistant create/replace/delete operations inside a previously validated sandbox boundary.
*/
const SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES = [
	"/usr/bin/python3",
	"/usr/local/bin/python3",
	"/opt/homebrew/bin/python3",
	"/bin/python3"
];
const SANDBOX_PINNED_MUTATION_PYTHON = [
	`SANDBOX_CREATE_EXISTS_EXIT_CODE = 17`,
	"import ctypes",
	"import errno",
	"import os",
	"import secrets",
	"import stat",
	"import sys",
	"",
	"operation = sys.argv[1]",
	"",
	"DIR_FLAGS = os.O_RDONLY",
	"if hasattr(os, 'O_DIRECTORY'):",
	"    DIR_FLAGS |= os.O_DIRECTORY",
	"if hasattr(os, 'O_NOFOLLOW'):",
	"    DIR_FLAGS |= os.O_NOFOLLOW",
	"",
	"READ_FLAGS = os.O_RDONLY",
	"if hasattr(os, 'O_NOFOLLOW'):",
	"    READ_FLAGS |= os.O_NOFOLLOW",
	"if hasattr(os, 'O_NONBLOCK'):",
	"    READ_FLAGS |= os.O_NONBLOCK",
	"",
	"WRITE_FLAGS = os.O_WRONLY | os.O_CREAT | os.O_EXCL",
	"if hasattr(os, 'O_NOFOLLOW'):",
	"    WRITE_FLAGS |= os.O_NOFOLLOW",
	"",
	"def split_relative(path_value):",
	"    segments = []",
	"    for segment in path_value.split('/'):",
	"        if not segment or segment == '.':",
	"            continue",
	"        if segment == '..':",
	"            raise OSError(errno.EPERM, 'path traversal is not allowed', segment)",
	"        segments.append(segment)",
	"    return segments",
	"",
	"def open_dir(path_value, dir_fd=None):",
	"    return os.open(path_value, DIR_FLAGS, dir_fd=dir_fd)",
	"",
	"def walk_dir(root_fd, rel_path, mkdir_enabled):",
	"    current_fd = os.dup(root_fd)",
	"    try:",
	"        for segment in split_relative(rel_path):",
	"            try:",
	"                next_fd = open_dir(segment, dir_fd=current_fd)",
	"            except FileNotFoundError:",
	"                if not mkdir_enabled:",
	"                    raise",
	"                os.mkdir(segment, 0o777, dir_fd=current_fd)",
	"                next_fd = open_dir(segment, dir_fd=current_fd)",
	"            os.close(current_fd)",
	"            current_fd = next_fd",
	"        return current_fd",
	"    except Exception:",
	"        os.close(current_fd)",
	"        raise",
	"",
	"def create_temp_file(parent_fd, basename):",
	"    prefix = '.openclaw-write-' + basename + '.'",
	"    for _ in range(128):",
	"        candidate = prefix + secrets.token_hex(6)",
	"        try:",
	"            fd = os.open(candidate, WRITE_FLAGS, 0o600, dir_fd=parent_fd)",
	"            return candidate, fd",
	"        except FileExistsError:",
	"            continue",
	"    raise RuntimeError('failed to allocate sandbox temp file')",
	"",
	"def create_temp_dir(parent_fd, basename, mode):",
	"    prefix = '.openclaw-move-' + basename + '.'",
	"    for _ in range(128):",
	"        candidate = prefix + secrets.token_hex(6)",
	"        try:",
	"            os.mkdir(candidate, mode, dir_fd=parent_fd)",
	"            return candidate",
	"        except FileExistsError:",
	"            continue",
	"    raise RuntimeError('failed to allocate sandbox temp directory')",
	"",
	SANDBOX_CREATE_STAGING_PYTHON,
	"",
	"def existing_regular_file_mode(parent_fd, basename):",
	"    try:",
	"        target_stat = os.lstat(basename, dir_fd=parent_fd)",
	"    except FileNotFoundError:",
	"        return None",
	"    if stat.S_ISREG(target_stat.st_mode):",
	"        return stat.S_IMODE(target_stat.st_mode)",
	"    return None",
	"",
	"def write_all(file_fd, data):",
	"    view = memoryview(data)",
	"    while view:",
	"        written = os.write(file_fd, view)",
	"        if written <= 0:",
	"            raise OSError(errno.EIO, 'failed to write copied file')",
	"        view = view[written:]",
	"",
	SANDBOX_RENAME_NO_REPLACE_PYTHON,
	"",
	"def copy_regular_file(src_parent_fd, src_basename, dst_parent_fd, dst_basename):",
	"    src_fd = os.open(src_basename, READ_FLAGS, dir_fd=src_parent_fd)",
	"    dst_fd = None",
	"    destination_created = False",
	"    copy_completed = False",
	"    try:",
	"        src_stat = os.fstat(src_fd)",
	"        if not stat.S_ISREG(src_stat.st_mode):",
	"            raise OSError(errno.EPERM, 'only regular files are allowed', src_basename)",
	"        if src_stat.st_nlink > 1:",
	"            raise OSError(errno.EPERM, 'hardlinked file is not allowed', src_basename)",
	"        dst_fd = os.open(dst_basename, WRITE_FLAGS, stat.S_IMODE(src_stat.st_mode), dir_fd=dst_parent_fd)",
	"        destination_created = True",
	"        while True:",
	"            chunk = os.read(src_fd, 65536)",
	"            if not chunk:",
	"                break",
	"            write_all(dst_fd, chunk)",
	"        try:",
	"            os.fchmod(dst_fd, stat.S_IMODE(src_stat.st_mode))",
	"        except AttributeError:",
	"            pass",
	"        os.fsync(dst_fd)",
	"        copy_completed = True",
	"        return entry_identity(src_stat)",
	"    finally:",
	"        if dst_fd is not None:",
	"            os.close(dst_fd)",
	"        if destination_created and not copy_completed:",
	"            try:",
	"                os.unlink(dst_basename, dir_fd=dst_parent_fd)",
	"            except FileNotFoundError:",
	"                pass",
	"        os.close(src_fd)",
	"",
	"def copy_file_atomic(src_parent_fd, src_basename, dst_parent_fd, dst_basename):",
	"    prefix = '.openclaw-copy-'",
	"    temp_name = None",
	"    try:",
	"        for _ in range(128):",
	"            candidate = prefix + secrets.token_hex(6)",
	"            try:",
	"                copy_regular_file(src_parent_fd, src_basename, dst_parent_fd, candidate)",
	"                temp_name = candidate",
	"                break",
	"            except FileExistsError:",
	"                continue",
	"        if temp_name is None:",
	"            raise RuntimeError('failed to allocate sandbox copy temp file')",
	"        os.replace(temp_name, dst_basename, src_dir_fd=dst_parent_fd, dst_dir_fd=dst_parent_fd)",
	"        temp_name = None",
	"        os.fsync(dst_parent_fd)",
	"    finally:",
	"        if temp_name is not None:",
	"            try:",
	"                os.unlink(temp_name, dir_fd=dst_parent_fd)",
	"            except FileNotFoundError:",
	"                pass",
	"",
	"def write_atomic(parent_fd, basename, stdin_buffer):",
	"    target_mode = existing_regular_file_mode(parent_fd, basename)",
	"    temp_fd = None",
	"    temp_name = None",
	"    try:",
	"        temp_name, temp_fd = create_temp_file(parent_fd, basename)",
	"        while True:",
	"            chunk = stdin_buffer.read(65536)",
	"            if not chunk:",
	"                break",
	"            write_all(temp_fd, chunk)",
	"        if target_mode is not None:",
	"            try:",
	"                os.fchmod(temp_fd, target_mode)",
	"            except AttributeError:",
	"                pass",
	"        os.fsync(temp_fd)",
	"        os.close(temp_fd)",
	"        temp_fd = None",
	"        os.replace(temp_name, basename, src_dir_fd=parent_fd, dst_dir_fd=parent_fd)",
	"        temp_name = None",
	"        os.fsync(parent_fd)",
	"    finally:",
	"        if temp_fd is not None:",
	"            os.close(temp_fd)",
	"        if temp_name is not None:",
	"            try:",
	"                os.unlink(temp_name, dir_fd=parent_fd)",
	"            except FileNotFoundError:",
	"                pass",
	"",
	SANDBOX_CREATE_EXCLUSIVE_PYTHON,
	"",
	"def read_file_impl(parent_fd, basename, max_bytes):",
	"    file_fd = os.open(basename, READ_FLAGS, dir_fd=parent_fd)",
	"    try:",
	"        file_stat = os.fstat(file_fd)",
	"        if not stat.S_ISREG(file_stat.st_mode):",
	"            raise OSError(errno.EPERM, 'only regular files are allowed', basename)",
	"        if file_stat.st_nlink > 1:",
	"            raise OSError(errno.EPERM, 'hardlinked file is not allowed', basename)",
	"        if max_bytes is not None and file_stat.st_size > max_bytes:",
	"            raise OSError(errno.EFBIG, 'file exceeds bounded read limit', basename)",
	"        bytes_read = 0",
	"        while True:",
	"            read_size = 65536 if max_bytes is None else min(65536, max_bytes - bytes_read + 1)",
	"            chunk = os.read(file_fd, read_size)",
	"            if not chunk:",
	"                break",
	"            bytes_read += len(chunk)",
	"            if max_bytes is not None and bytes_read > max_bytes:",
	"                raise OSError(errno.EFBIG, 'file exceeds bounded read limit', basename)",
	"            write_all(1, chunk)",
	"    finally:",
	"        os.close(file_fd)",
	"",
	"def read_file(parent_fd, basename):",
	"    read_file_impl(parent_fd, basename, None)",
	"",
	"def read_file_bounded(parent_fd, basename, max_bytes):",
	"    if max_bytes < 0:",
	"        raise OSError(errno.EINVAL, 'read limit must be non-negative', basename)",
	"    read_file_impl(parent_fd, basename, max_bytes)",
	"",
	"def remove_tree(parent_fd, basename):",
	"    entry_stat = os.lstat(basename, dir_fd=parent_fd)",
	"    if not stat.S_ISDIR(entry_stat.st_mode) or stat.S_ISLNK(entry_stat.st_mode):",
	"        os.unlink(basename, dir_fd=parent_fd)",
	"        return",
	"    dir_fd = open_dir(basename, dir_fd=parent_fd)",
	"    try:",
	"        for child in os.listdir(dir_fd):",
	"            remove_tree(dir_fd, child)",
	"    finally:",
	"        os.close(dir_fd)",
	"    os.rmdir(basename, dir_fd=parent_fd)",
	"",
	"def entry_identity(entry_stat):",
	"    return (",
	"        entry_stat.st_dev,",
	"        entry_stat.st_ino,",
	"        entry_stat.st_mode,",
	"        entry_stat.st_size,",
	"        getattr(entry_stat, 'st_mtime_ns', int(entry_stat.st_mtime * 1000000000)),",
	"        getattr(entry_stat, 'st_ctime_ns', int(entry_stat.st_ctime * 1000000000)),",
	"    )",
	"",
	"def inode_identity(entry_stat):",
	"    return (entry_stat.st_dev, entry_stat.st_ino)",
	"",
	"def same_identity(expected, entry_stat):",
	"    return expected == entry_identity(entry_stat)",
	"",
	"def source_changed_error(basename):",
	"    return OSError(getattr(errno, 'ESTALE', errno.EIO), 'source changed during move fallback cleanup', basename)",
	"",
	"def copy_entry(src_parent_fd, src_basename, dst_parent_fd, dst_basename):",
	"    src_stat = os.lstat(src_basename, dir_fd=src_parent_fd)",
	"    if stat.S_ISDIR(src_stat.st_mode) and not stat.S_ISLNK(src_stat.st_mode):",
	"        os.mkdir(dst_basename, stat.S_IMODE(src_stat.st_mode) or 0o755, dir_fd=dst_parent_fd)",
	"        copied_children = []",
	"        src_dir_fd = None",
	"        dst_dir_fd = None",
	"        try:",
	"            src_dir_fd = open_dir(src_basename, dir_fd=src_parent_fd)",
	"            src_stat = os.fstat(src_dir_fd)",
	"            dst_dir_fd = open_dir(dst_basename, dir_fd=dst_parent_fd)",
	"            for child in os.listdir(src_dir_fd):",
	"                copied_children.append((child, copy_entry(src_dir_fd, child, dst_dir_fd, child)))",
	"        except Exception:",
	"            if dst_dir_fd is not None:",
	"                os.close(dst_dir_fd)",
	"                dst_dir_fd = None",
	"            try:",
	"                remove_tree(dst_parent_fd, dst_basename)",
	"            except FileNotFoundError:",
	"                pass",
	"            raise",
	"        finally:",
	"            if src_dir_fd is not None:",
	"                os.close(src_dir_fd)",
	"            if dst_dir_fd is not None:",
	"                os.close(dst_dir_fd)",
	"        return ('dir', entry_identity(src_stat), copied_children)",
	"    if stat.S_ISLNK(src_stat.st_mode):",
	"        link_target = os.readlink(src_basename, dir_fd=src_parent_fd)",
	"        os.symlink(link_target, dst_basename, dir_fd=dst_parent_fd)",
	"        return ('leaf', entry_identity(src_stat), None)",
	"    return ('leaf', copy_regular_file(src_parent_fd, src_basename, dst_parent_fd, dst_basename), None)",
	"",
	"def remove_copied_entry(parent_fd, basename, manifest):",
	"    kind, expected_identity, children = manifest",
	"    current_stat = os.lstat(basename, dir_fd=parent_fd)",
	"    if not same_identity(expected_identity, current_stat):",
	"        raise source_changed_error(basename)",
	"    if kind != 'dir':",
	"        os.unlink(basename, dir_fd=parent_fd)",
	"        return",
	"    dir_fd = open_dir(basename, dir_fd=parent_fd)",
	"    try:",
	"        for child, child_manifest in children:",
	"            remove_copied_entry(dir_fd, child, child_manifest)",
	"    finally:",
	"        os.close(dir_fd)",
	"    os.rmdir(basename, dir_fd=parent_fd)",
	"",
	"def move_entry(src_parent_fd, src_basename, dst_parent_fd, dst_basename):",
	"    try:",
	"        os.rename(src_basename, dst_basename, src_dir_fd=src_parent_fd, dst_dir_fd=dst_parent_fd)",
	"        os.fsync(dst_parent_fd)",
	"        os.fsync(src_parent_fd)",
	"        return",
	"    except OSError as err:",
	"        if err.errno != errno.EXDEV:",
	"            raise",
	"    src_stat = os.lstat(src_basename, dir_fd=src_parent_fd)",
	"    if stat.S_ISDIR(src_stat.st_mode) and not stat.S_ISLNK(src_stat.st_mode):",
	"        temp_dir_name = create_temp_dir(dst_parent_fd, dst_basename, stat.S_IMODE(src_stat.st_mode) or 0o755)",
	"        copied_children = []",
	"        temp_dir_fd = None",
	"        src_dir_fd = None",
	"        try:",
	"            temp_dir_fd = open_dir(temp_dir_name, dir_fd=dst_parent_fd)",
	"            src_dir_fd = open_dir(src_basename, dir_fd=src_parent_fd)",
	"            src_stat = os.fstat(src_dir_fd)",
	"            for child in os.listdir(src_dir_fd):",
	"                copied_children.append((child, copy_entry(src_dir_fd, child, temp_dir_fd, child)))",
	"            os.close(src_dir_fd)",
	"            src_dir_fd = None",
	"            os.close(temp_dir_fd)",
	"            temp_dir_fd = None",
	"            os.rename(temp_dir_name, dst_basename, src_dir_fd=dst_parent_fd, dst_dir_fd=dst_parent_fd)",
	"        except Exception:",
	"            if src_dir_fd is not None:",
	"                os.close(src_dir_fd)",
	"            if temp_dir_fd is not None:",
	"                os.close(temp_dir_fd)",
	"            try:",
	"                remove_tree(dst_parent_fd, temp_dir_name)",
	"            except FileNotFoundError:",
	"                pass",
	"            raise",
	"        remove_copied_entry(src_parent_fd, src_basename, ('dir', entry_identity(src_stat), copied_children))",
	"        os.fsync(dst_parent_fd)",
	"        os.fsync(src_parent_fd)",
	"        return",
	"    if stat.S_ISLNK(src_stat.st_mode):",
	"        link_target = os.readlink(src_basename, dir_fd=src_parent_fd)",
	"        try:",
	"            os.unlink(dst_basename, dir_fd=dst_parent_fd)",
	"        except FileNotFoundError:",
	"            pass",
	"        os.symlink(link_target, dst_basename, dir_fd=dst_parent_fd)",
	"        os.unlink(src_basename, dir_fd=src_parent_fd)",
	"        os.fsync(dst_parent_fd)",
	"        os.fsync(src_parent_fd)",
	"        return",
	"    src_fd = os.open(src_basename, READ_FLAGS, dir_fd=src_parent_fd)",
	"    temp_fd = None",
	"    temp_name = None",
	"    try:",
	"        src_file_stat = os.fstat(src_fd)",
	"        if not stat.S_ISREG(src_file_stat.st_mode):",
	"            raise OSError(errno.EPERM, 'only regular files are allowed', src_basename)",
	"        if src_file_stat.st_nlink > 1:",
	"            raise OSError(errno.EPERM, 'hardlinked file is not allowed', src_basename)",
	"        temp_name, temp_fd = create_temp_file(dst_parent_fd, dst_basename)",
	"        while True:",
	"            chunk = os.read(src_fd, 65536)",
	"            if not chunk:",
	"                break",
	"            write_all(temp_fd, chunk)",
	"        try:",
	"            os.fchmod(temp_fd, stat.S_IMODE(src_stat.st_mode))",
	"        except AttributeError:",
	"            pass",
	"        os.fsync(temp_fd)",
	"        os.close(temp_fd)",
	"        temp_fd = None",
	"        os.replace(temp_name, dst_basename, src_dir_fd=dst_parent_fd, dst_dir_fd=dst_parent_fd)",
	"        temp_name = None",
	"        os.unlink(src_basename, dir_fd=src_parent_fd)",
	"        os.fsync(dst_parent_fd)",
	"        os.fsync(src_parent_fd)",
	"    finally:",
	"        if temp_fd is not None:",
	"            os.close(temp_fd)",
	"        if temp_name is not None:",
	"            try:",
	"                os.unlink(temp_name, dir_fd=dst_parent_fd)",
	"            except FileNotFoundError:",
	"                pass",
	"        os.close(src_fd)",
	"",
	"if operation == 'copy':",
	"    src_root_fd = open_dir(sys.argv[2])",
	"    dst_root_fd = open_dir(sys.argv[5])",
	"    src_parent_fd = None",
	"    dst_parent_fd = None",
	"    try:",
	"        src_parent_fd = walk_dir(src_root_fd, sys.argv[3], False)",
	"        dst_parent_fd = walk_dir(dst_root_fd, sys.argv[6], sys.argv[8] == '1')",
	"        copy_file_atomic(src_parent_fd, sys.argv[4], dst_parent_fd, sys.argv[7])",
	"    finally:",
	"        if src_parent_fd is not None:",
	"            os.close(src_parent_fd)",
	"        if dst_parent_fd is not None:",
	"            os.close(dst_parent_fd)",
	"        os.close(src_root_fd)",
	"        os.close(dst_root_fd)",
	"elif operation == 'write':",
	"    root_fd = open_dir(sys.argv[2])",
	"    parent_fd = None",
	"    try:",
	"        parent_fd = walk_dir(root_fd, sys.argv[3], sys.argv[5] == '1')",
	"        write_atomic(parent_fd, sys.argv[4], sys.stdin.buffer)",
	"    finally:",
	"        if parent_fd is not None:",
	"            os.close(parent_fd)",
	"        os.close(root_fd)",
	"elif operation == 'create':",
	"    root_fd = open_dir(sys.argv[2])",
	"    parent_fd = None",
	"    try:",
	"        parent_fd = walk_dir(root_fd, sys.argv[3], sys.argv[5] == '1')",
	"        try:",
	"            create_exclusive(parent_fd, sys.argv[4], sys.stdin.buffer)",
	"        except FileExistsError:",
	"            sys.exit(SANDBOX_CREATE_EXISTS_EXIT_CODE)",
	"    finally:",
	"        if parent_fd is not None:",
	"            os.close(parent_fd)",
	"        os.close(root_fd)",
	"elif operation == 'read':",
	"    root_fd = open_dir(sys.argv[2])",
	"    parent_fd = None",
	"    try:",
	"        parent_fd = walk_dir(root_fd, sys.argv[3], False)",
	"        if len(sys.argv) > 5:",
	"            read_file_bounded(parent_fd, sys.argv[4], int(sys.argv[5]))",
	"        else:",
	"            read_file(parent_fd, sys.argv[4])",
	"    finally:",
	"        if parent_fd is not None:",
	"            os.close(parent_fd)",
	"        os.close(root_fd)",
	"elif operation == 'mkdirp':",
	"    root_fd = open_dir(sys.argv[2])",
	"    target_fd = None",
	"    try:",
	"        target_fd = walk_dir(root_fd, sys.argv[3], True)",
	"        os.fsync(target_fd)",
	"    finally:",
	"        if target_fd is not None:",
	"            os.close(target_fd)",
	"        os.close(root_fd)",
	"elif operation == 'remove':",
	"    root_fd = open_dir(sys.argv[2])",
	"    parent_fd = None",
	"    try:",
	"        parent_fd = walk_dir(root_fd, sys.argv[3], False)",
	"        try:",
	"            if sys.argv[5] == '1':",
	"                remove_tree(parent_fd, sys.argv[4])",
	"            else:",
	"                entry_stat = os.lstat(sys.argv[4], dir_fd=parent_fd)",
	"                if stat.S_ISDIR(entry_stat.st_mode) and not stat.S_ISLNK(entry_stat.st_mode):",
	"                    os.rmdir(sys.argv[4], dir_fd=parent_fd)",
	"                else:",
	"                    os.unlink(sys.argv[4], dir_fd=parent_fd)",
	"            os.fsync(parent_fd)",
	"        except FileNotFoundError:",
	"            if sys.argv[6] != '1':",
	"                raise",
	"    finally:",
	"        if parent_fd is not None:",
	"            os.close(parent_fd)",
	"        os.close(root_fd)",
	"elif operation == 'rename':",
	"    src_root_fd = open_dir(sys.argv[2])",
	"    dst_root_fd = open_dir(sys.argv[5])",
	"    src_parent_fd = None",
	"    dst_parent_fd = None",
	"    try:",
	"        src_parent_fd = walk_dir(src_root_fd, sys.argv[3], False)",
	"        dst_parent_fd = walk_dir(dst_root_fd, sys.argv[6], sys.argv[8] == '1')",
	"        move_entry(src_parent_fd, sys.argv[4], dst_parent_fd, sys.argv[7])",
	"    finally:",
	"        if src_parent_fd is not None:",
	"            os.close(src_parent_fd)",
	"        if dst_parent_fd is not None:",
	"            os.close(dst_parent_fd)",
	"        os.close(src_root_fd)",
	"        os.close(dst_root_fd)",
	"else:",
	"    raise RuntimeError('unknown sandbox mutation operation: ' + operation)"
].join("\n");
const SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL = `'${SANDBOX_PINNED_MUTATION_PYTHON.replaceAll("'", `'\\''`)}'`;
function buildPinnedMutationPlan(params) {
	return {
		checks: params.checks,
		recheckBeforeCommand: true,
		script: [
			"set -eu",
			"python_cmd=''",
			...SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES.map((candidate) => `if [ -z "$python_cmd" ] && [ -x '${candidate}' ]; then python_cmd='${candidate}'; fi`),
			"if [ -z \"$python_cmd\" ]; then python_cmd=$(command -v python3 2>/dev/null || command -v python 2>/dev/null || true); fi",
			"if [ -z \"$python_cmd\" ]; then",
			"  echo >&2 'sandbox pinned mutation helper requires python3 or python'",
			"  exit 127",
			"fi",
			`python_script=${SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL}`,
			"exec \"$python_cmd\" -c \"$python_script\" \"$@\""
		].join("\n"),
		args: params.args
	};
}
function buildPinnedWritePlan(params) {
	return buildPinnedMutationPlan({
		checks: [params.check],
		args: [
			"write",
			params.pinned.mountRootPath,
			params.pinned.relativeParentPath,
			params.pinned.basename,
			params.mkdir ? "1" : "0"
		]
	});
}
function buildPinnedCreatePlan(params) {
	return buildPinnedMutationPlan({
		checks: [params.check],
		args: [
			"create",
			params.pinned.mountRootPath,
			params.pinned.relativeParentPath,
			params.pinned.basename,
			params.mkdir ? "1" : "0"
		]
	});
}
function buildPinnedCopyPlan(params) {
	return buildPinnedMutationPlan({
		checks: [params.sourceCheck, params.destinationCheck],
		args: [
			"copy",
			params.source.mountRootPath,
			params.source.relativeParentPath,
			params.source.basename,
			params.destination.mountRootPath,
			params.destination.relativeParentPath,
			params.destination.basename,
			params.mkdir ? "1" : "0"
		]
	});
}
function buildPinnedMkdirpPlan(params) {
	return buildPinnedMutationPlan({
		checks: [params.check],
		args: [
			"mkdirp",
			params.pinned.mountRootPath,
			params.pinned.relativePath
		]
	});
}
function buildPinnedRemovePlan(params) {
	return buildPinnedMutationPlan({
		checks: [{
			target: params.check.target,
			options: {
				...params.check.options,
				aliasPolicy: PATH_ALIAS_POLICIES.unlinkTarget
			}
		}],
		args: [
			"remove",
			params.pinned.mountRootPath,
			params.pinned.relativeParentPath,
			params.pinned.basename,
			params.recursive ? "1" : "0",
			params.force === false ? "0" : "1"
		]
	});
}
function buildPinnedRenamePlan(params) {
	return buildPinnedMutationPlan({
		checks: [{
			target: params.fromCheck.target,
			options: {
				...params.fromCheck.options,
				aliasPolicy: PATH_ALIAS_POLICIES.unlinkTarget
			}
		}, params.toCheck],
		args: [
			"rename",
			params.from.mountRootPath,
			params.from.relativeParentPath,
			params.from.basename,
			params.to.mountRootPath,
			params.to.relativeParentPath,
			params.to.basename,
			"1"
		]
	});
}
//#endregion
//#region src/agents/sandbox/fs-bridge-rename-targets.ts
/**
* Shared writable-target resolution for sandbox fs bridge rename operations.
*/
/** Resolves both rename endpoints and verifies write access before command execution. */
function resolveWritableRenameTargets(params) {
	const action = params.action ?? "rename files";
	const from = params.resolveTarget({
		filePath: params.from,
		cwd: params.cwd
	});
	const to = params.resolveTarget({
		filePath: params.to,
		cwd: params.cwd
	});
	params.ensureWritable(from, action);
	params.ensureWritable(to, action);
	return {
		from,
		to
	};
}
/** Adapter used by bridge implementations that pass resolver callbacks separately. */
function resolveWritableRenameTargetsForBridge(params, resolveTarget, ensureWritable) {
	return resolveWritableRenameTargets({
		...params,
		resolveTarget,
		ensureWritable
	});
}
/** Creates a reusable resolver bound to a bridge's target and permission helpers. */
function createWritableRenameTargetResolver(resolveTarget, ensureWritable) {
	return (params) => resolveWritableRenameTargetsForBridge(params, resolveTarget, ensureWritable);
}
//#endregion
//#region src/agents/sandbox/fs-bridge-stat-parse.ts
/**
* Stat output parsers for sandbox filesystem bridges.
*
* Handles GNU/BSD size and mtime formats returned through backend shell commands.
*/
function hasMultipleHardlinks(raw) {
	const linkCount = parseStrictNonNegativeInteger(raw);
	return linkCount === void 0 ? /^\d+$/.test(raw) : linkCount > 1;
}
/** Parses file sizes, capping huge integer strings at the largest safe JS integer. */
function parseSandboxStatSize(value) {
	const raw = value ?? "0";
	const parsed = parseStrictNonNegativeInteger(raw);
	if (parsed !== void 0) return parsed;
	return /^\d+$/.test(raw) ? Number.MAX_SAFE_INTEGER : 0;
}
/** Parses stat mtimes from epoch seconds or date strings into millisecond timestamps. */
function parseSandboxStatMtimeMs(value) {
	const raw = value ?? "0";
	if (/^\d+(?:\.\d+)?$/.test(raw)) return asDateTimestampMs(Number(raw) * 1e3) ?? 0;
	return asDateTimestampMs(Date.parse(raw)) ?? 0;
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge-paths.ts
/** Pure mount and path helpers for the remote sandbox filesystem bridge. */
function buildRemoteProtectedSkillMounts(params) {
	const materializedSkillsWorkspaceDir = path.resolve(params.skillsWorkspaceDir ?? resolveMaterializedSandboxSkillsWorkspaceDir(params.localRoot));
	const mounts = [
		{
			localRoot: path.join(params.localRoot, "skills"),
			containerRoot: path.posix.join(params.workspaceContainerRoot, "skills"),
			writable: false,
			source: "protectedSkill",
			allowedRoot: params.localRoot
		},
		{
			localRoot: path.join(params.localRoot, ".agents", "skills"),
			containerRoot: path.posix.join(params.workspaceContainerRoot, ".agents", "skills"),
			writable: false,
			source: "protectedSkill",
			allowedRoot: params.localRoot
		},
		{
			localRoot: path.join(materializedSkillsWorkspaceDir, "skills"),
			containerRoot: path.posix.join(params.workspaceContainerRoot, ".openclaw", "sandbox-skills", "skills"),
			writable: false,
			source: "protectedSkill",
			allowedRoot: materializedSkillsWorkspaceDir
		}
	];
	if (params.includeAgentMount) mounts.push({
		localRoot: path.join(params.localRoot, "skills"),
		containerRoot: path.posix.join(params.agentContainerRoot, "skills"),
		writable: false,
		source: "protectedSkill",
		allowedRoot: params.localRoot
	}, {
		localRoot: path.join(params.localRoot, ".agents", "skills"),
		containerRoot: path.posix.join(params.agentContainerRoot, ".agents", "skills"),
		writable: false,
		source: "protectedSkill",
		allowedRoot: params.localRoot
	}, {
		localRoot: path.join(materializedSkillsWorkspaceDir, "skills"),
		containerRoot: path.posix.join(params.agentContainerRoot, ".openclaw", "sandbox-skills", "skills"),
		writable: false,
		source: "protectedSkill",
		allowedRoot: materializedSkillsWorkspaceDir
	});
	return mounts.filter((mount) => isExistingWorkspaceSkillMountSource({
		rootDir: mount.allowedRoot,
		hostPath: mount.localRoot
	})).map(({ allowedRoot: _allowedRoot, ...mount }) => mount);
}
function compareRemoteMountsByContainerPath(a, b) {
	return b.containerRoot.length - a.containerRoot.length || mountPriority(b) - mountPriority(a);
}
function compareRemoteMountsByLocalPath(a, b) {
	return b.localRoot.length - a.localRoot.length || mountPriority(b) - mountPriority(a);
}
function buildRemoteProtectedSkillRoots(params) {
	const roots = [
		path.posix.join(params.workspaceContainerRoot, "skills"),
		path.posix.join(params.workspaceContainerRoot, ".agents", "skills"),
		path.posix.join(params.workspaceContainerRoot, ".openclaw", "sandbox-skills", "skills")
	];
	if (params.includeAgentMount) roots.push(path.posix.join(params.agentContainerRoot, "skills"), path.posix.join(params.agentContainerRoot, ".agents", "skills"), path.posix.join(params.agentContainerRoot, ".openclaw", "sandbox-skills", "skills"));
	return roots;
}
function mountPriority(mount) {
	if (mount.source === "protectedSkill") return 2;
	if (mount.source === "agent") return 1;
	return 0;
}
function normalizeContainerPath(value) {
	const normalized = normalizeContainerPathCore(value.trim() || "/");
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
function toPosixRelative(root, candidate) {
	return path.relative(root, candidate).split(path.sep).filter(Boolean).join(path.posix.sep);
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge-canonical-path.ts
/** Canonical path resolution for remote shell-backed sandbox mounts. */
async function resolveRemoteCanonicalPath(params) {
	const script = [
		"set -eu",
		"target=\"$1\"",
		"allow_final=\"$2\"",
		"suffix=\"\"",
		"probe=\"$target\"",
		"if [ \"$allow_final\" = \"1\" ] && [ -L \"$target\" ]; then probe=$(dirname -- \"$target\"); fi",
		"cursor=\"$probe\"",
		"while [ ! -e \"$cursor\" ] && [ ! -L \"$cursor\" ]; do",
		"  parent=$(dirname -- \"$cursor\")",
		"  if [ \"$parent\" = \"$cursor\" ]; then break; fi",
		"  base=$(basename -- \"$cursor\")",
		"  suffix=\"/$base$suffix\"",
		"  cursor=\"$parent\"",
		"done",
		"canonical=$(readlink -f -- \"$cursor\")",
		"canonical_root=$(readlink -f -- \"$3\")",
		"printf \"%s%s\\n%s\\n\" \"$canonical\" \"$suffix\" \"$canonical_root\""
	].join("\n");
	const [canonicalRaw = "", canonicalRootRaw = ""] = (await params.runRemoteShellScript({
		script,
		args: [
			params.containerPath,
			params.allowFinalSymlinkForUnlink ? "1" : "0",
			params.mountRootPath
		],
		signal: params.signal
	})).stdout.toString("utf8").trim().split("\n");
	if (!canonicalRaw || !canonicalRootRaw) throw new Error(`Sandbox path canonicalization failed; cannot ${params.action}: ${params.containerPath}`);
	const canonicalPath = normalizeContainerPath(canonicalRaw);
	const canonicalMountRoot = normalizeContainerPath(canonicalRootRaw);
	const relative = path.posix.relative(canonicalMountRoot, canonicalPath);
	if (relativePathEscapesContainerRoot(relative)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`);
	return {
		canonicalPath,
		canonicalMountRoot,
		logicalPath: relative === "." ? params.mountRootPath : normalizeContainerPath(path.posix.join(params.mountRootPath, relative))
	};
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge.ts
/**
* Remote shell-backed sandbox filesystem bridge.
*
* Resolves sandbox paths against uploaded remote mounts and performs guarded operations through backend shell commands.
*/
/** Create the filesystem bridge for remote shell-backed sandbox runtimes. */
function createRemoteShellSandboxFsBridge(params) {
	return new RemoteShellSandboxFsBridge(params.sandbox, params.runtime);
}
var RemoteShellSandboxFsBridge = class {
	constructor(sandbox, runtime) {
		this.sandbox = sandbox;
		this.runtime = runtime;
		this.resolveRenameTargets = createWritableRenameTargetResolver((target) => this.resolveTarget(target), (target, action) => this.ensureWritable(target, action));
	}
	resolvePath(params) {
		const target = this.resolveTarget(params);
		return {
			relativePath: target.relativePath,
			containerPath: target.containerPath
		};
	}
	async readFile(params) {
		if (params.maxBytes !== void 0 && (!Number.isSafeInteger(params.maxBytes) || params.maxBytes < 0)) throw new RangeError("Sandbox file read limit must be a non-negative safe integer.");
		const target = this.resolveTarget(params);
		const relativePath = path.posix.relative(target.mountRootPath, target.containerPath);
		if (relativePath === "" || relativePath === "." || relativePathEscapesContainerRoot(relativePath)) throw new Error(`Invalid sandbox entry target: ${target.containerPath}`);
		const pinned = await this.resolvePinnedParent({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "read files",
			signal: params.signal
		});
		return (await this.runMutation({
			args: [
				"read",
				pinned.mountRootPath,
				pinned.relativeParentPath,
				pinned.basename,
				...params.maxBytes === void 0 ? [] : [String(params.maxBytes)]
			],
			signal: params.signal
		})).stdout;
	}
	async copyFile(params) {
		const source = this.resolveTarget({
			filePath: params.sourcePath,
			cwd: params.cwd
		});
		const destination = this.resolveTarget({
			filePath: params.destinationPath,
			cwd: params.cwd
		});
		await this.ensureRemoteWritable(destination, "copy files", params.signal);
		await this.assertNoHardlinkedFile({
			containerPath: destination.containerPath,
			action: "copy files",
			signal: params.signal
		});
		const sourcePinned = await this.resolvePinnedParent({
			containerPath: source.containerPath,
			mountRootPath: source.mountRootPath,
			action: "copy files",
			signal: params.signal
		});
		const destinationPinned = await this.resolvePinnedParent({
			containerPath: destination.containerPath,
			mountRootPath: destination.mountRootPath,
			action: "copy files",
			requireWritable: true,
			signal: params.signal
		});
		await this.runMutation({
			args: [
				"copy",
				sourcePinned.mountRootPath,
				sourcePinned.relativeParentPath,
				sourcePinned.basename,
				destinationPinned.mountRootPath,
				destinationPinned.relativeParentPath,
				destinationPinned.basename,
				params.mkdir !== false ? "1" : "0"
			],
			signal: params.signal
		});
	}
	async writeFile(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "write files", params.signal);
		const pinned = await this.resolvePinnedParent({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "write files",
			requireWritable: true,
			signal: params.signal
		});
		await this.assertNoHardlinkedFile({
			containerPath: target.containerPath,
			action: "write files",
			signal: params.signal
		});
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		await this.runMutation({
			args: [
				"write",
				pinned.mountRootPath,
				pinned.relativeParentPath,
				pinned.basename,
				params.mkdir !== false ? "1" : "0"
			],
			stdin: buffer,
			signal: params.signal
		});
	}
	async createFileExclusive(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "create files", params.signal);
		const pinned = await this.resolvePinnedParent({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "create files",
			requireWritable: true,
			signal: params.signal
		});
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const result = await this.runMutation({
			args: [
				"create",
				pinned.mountRootPath,
				pinned.relativeParentPath,
				pinned.basename,
				params.mkdir !== false ? "1" : "0"
			],
			stdin: buffer,
			allowFailure: true,
			signal: params.signal
		});
		if (result.code === 17) return "exists";
		if (result.code !== 0) throw new Error(`Sandbox create failed for ${target.containerPath}: ${result.stderr.toString("utf8").trim()}`);
		return "created";
	}
	async mkdirp(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "create directories", params.signal);
		const relativePath = path.posix.relative(target.mountRootPath, target.containerPath);
		if (relativePathEscapesContainerRoot(relativePath)) throw new Error(`Sandbox path escapes allowed mounts; cannot create directories: ${target.containerPath}`);
		if (relativePath === "" || relativePath === ".") return;
		const pinned = await this.resolvePinnedParent({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "create directories",
			requireWritable: true,
			signal: params.signal
		});
		await this.runMutation({
			args: [
				"mkdirp",
				pinned.mountRootPath,
				path.posix.join(pinned.relativeParentPath, pinned.basename)
			],
			signal: params.signal
		});
	}
	async remove(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "remove files", params.signal);
		if (!await this.remotePathExists(target.containerPath, params.signal)) {
			if (params.force === false) throw new Error(`Sandbox path not found; cannot remove files: ${target.containerPath}`);
			return;
		}
		const pinned = await this.resolvePinnedParent({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "remove files",
			requireWritable: true,
			allowFinalSymlinkForUnlink: true,
			signal: params.signal
		});
		await this.runMutation({
			args: [
				"remove",
				pinned.mountRootPath,
				pinned.relativeParentPath,
				pinned.basename,
				params.recursive ? "1" : "0",
				params.force === false ? "0" : "1"
			],
			signal: params.signal,
			allowFailure: params.force !== false
		});
	}
	async rename(params) {
		const { from, to } = this.resolveRenameTargets(params);
		await this.ensureRemoteWritable(from, "rename files", params.signal);
		await this.ensureRemoteWritable(to, "rename files", params.signal);
		const fromPinned = await this.resolvePinnedParent({
			containerPath: from.containerPath,
			mountRootPath: from.mountRootPath,
			action: "rename files",
			requireWritable: true,
			allowFinalSymlinkForUnlink: true,
			signal: params.signal
		});
		const toPinned = await this.resolvePinnedParent({
			containerPath: to.containerPath,
			mountRootPath: to.mountRootPath,
			action: "rename files",
			requireWritable: true,
			signal: params.signal
		});
		await this.runMutation({
			args: [
				"rename",
				fromPinned.mountRootPath,
				fromPinned.relativeParentPath,
				fromPinned.basename,
				toPinned.mountRootPath,
				toPinned.relativeParentPath,
				toPinned.basename,
				"1"
			],
			signal: params.signal
		});
	}
	async stat(params) {
		const target = this.resolveTarget(params);
		if (!await this.remotePathExists(target.containerPath, params.signal)) return null;
		const { canonicalPath } = await this.resolveCanonicalPath({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "stat files",
			signal: params.signal
		});
		await this.assertNoHardlinkedFile({
			containerPath: canonicalPath,
			action: "stat files",
			signal: params.signal
		});
		const [kindRaw = "", sizeRaw = "0", mtimeRaw = "0"] = (await this.runtime.runRemoteShellScript({
			script: "set -eu\nLC_ALL=C stat -c \"%F|%s|%y\" -- \"$1\"",
			args: [canonicalPath],
			signal: params.signal
		})).stdout.toString("utf8").trim().split("|");
		return {
			type: kindRaw === "directory" ? "directory" : kindRaw === "regular file" ? "file" : "other",
			size: parseSandboxStatSize(sizeRaw),
			mtimeMs: parseSandboxStatMtimeMs(mtimeRaw)
		};
	}
	getMounts() {
		const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
		const agentRoot = path.resolve(this.sandbox.agentWorkspaceDir);
		const workspaceContainerRoot = normalizeContainerPath(this.runtime.remoteWorkspaceDir);
		const agentContainerRoot = normalizeContainerPath(this.runtime.remoteAgentWorkspaceDir);
		const mounts = [{
			localRoot: workspaceRoot,
			containerRoot: workspaceContainerRoot,
			writable: this.sandbox.workspaceAccess === "rw",
			source: "workspace"
		}];
		if (this.sandbox.workspaceAccess !== "none" && path.resolve(this.sandbox.agentWorkspaceDir) !== path.resolve(this.sandbox.workspaceDir)) mounts.push({
			localRoot: agentRoot,
			containerRoot: agentContainerRoot,
			writable: this.sandbox.workspaceAccess === "rw",
			source: "agent"
		});
		if (this.sandbox.workspaceAccess === "rw") mounts.push(...buildRemoteProtectedSkillMounts({
			localRoot: agentRoot,
			skillsWorkspaceDir: this.sandbox.skillsWorkspaceDir,
			workspaceContainerRoot,
			agentContainerRoot,
			includeAgentMount: path.resolve(this.sandbox.agentWorkspaceDir) !== path.resolve(this.sandbox.workspaceDir)
		}));
		return mounts;
	}
	resolveTarget(params) {
		const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
		const mounts = this.getMounts();
		const input = params.filePath.trim();
		const inputPosix = input.replace(/\\/g, "/");
		const maybeContainerMount = path.posix.isAbsolute(inputPosix) ? this.resolveMountByContainerPath(mounts, normalizeContainerPath(inputPosix)) : null;
		if (maybeContainerMount) return this.toResolvedPath({
			mount: maybeContainerMount,
			containerPath: normalizeContainerPath(inputPosix)
		});
		const hostCwd = params.cwd ? path.resolve(params.cwd) : workspaceRoot;
		const hostCandidate = path.isAbsolute(input) ? path.resolve(input) : path.resolve(hostCwd, input);
		const hostMount = this.resolveMountByLocalPath(mounts, hostCandidate);
		if (hostMount) {
			const relative = toPosixRelative(hostMount.localRoot, hostCandidate);
			return this.toResolvedPath({
				mount: hostMount,
				containerPath: relative ? path.posix.join(hostMount.containerRoot, relative) : hostMount.containerRoot
			});
		}
		if (params.cwd) {
			const cwdPosix = params.cwd.replace(/\\/g, "/");
			if (path.posix.isAbsolute(cwdPosix)) {
				const cwdContainer = normalizeContainerPath(cwdPosix);
				const cwdMount = this.resolveMountByContainerPath(mounts, cwdContainer);
				if (cwdMount) {
					const containerPath = normalizeContainerPath(path.posix.resolve(cwdContainer, inputPosix));
					const targetMount = this.resolveMountByContainerPath(mounts, containerPath) ?? cwdMount;
					return this.toResolvedPath({
						mount: targetMount,
						containerPath
					});
				}
			}
		}
		throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${params.filePath}`);
	}
	toResolvedPath(params) {
		const relative = path.posix.relative(params.mount.containerRoot, params.containerPath);
		if (relativePathEscapesContainerRoot(relative)) throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${params.containerPath}`);
		return {
			relativePath: params.mount.source === "workspace" || params.mount.source === "protectedSkill" ? relative === "." ? "" : path.posix.relative(this.runtime.remoteWorkspaceDir, params.containerPath) : relative === "." ? params.mount.containerRoot : `${params.mount.containerRoot}/${relative}`,
			containerPath: params.containerPath,
			writable: params.mount.writable,
			mountRootPath: params.mount.containerRoot,
			source: params.mount.source
		};
	}
	resolveMountByContainerPath(mounts, containerPath) {
		const ordered = [...mounts].toSorted(compareRemoteMountsByContainerPath);
		for (const mount of ordered) if (isPathInsideContainerRoot(mount.containerRoot, containerPath)) return mount;
		return null;
	}
	resolveMountByLocalPath(mounts, localPath) {
		const ordered = [...mounts].toSorted(compareRemoteMountsByLocalPath);
		for (const mount of ordered) if (isPathInside(mount.localRoot, localPath)) return mount;
		return null;
	}
	ensureWritable(target, action) {
		if (this.sandbox.workspaceAccess !== "rw" || !target.writable) throw new Error(`Sandbox path is read-only; cannot ${action}: ${target.containerPath}`);
	}
	async ensureRemoteWritable(target, action, signal) {
		this.ensureWritable(target, action);
		await this.assertRemoteProtectedPathWritable({
			containerPath: target.containerPath,
			action,
			signal
		});
	}
	async assertRemoteProtectedPathWritable(params) {
		const protectedRoot = this.findRemoteProtectedSkillRoot(params.containerPath);
		if (protectedRoot && await this.remotePathExists(protectedRoot, params.signal)) throw new Error(`Sandbox path is read-only; cannot ${params.action}: ${params.displayPath ?? params.containerPath}`);
	}
	findRemoteProtectedSkillRoot(containerPath) {
		const roots = buildRemoteProtectedSkillRoots({
			workspaceContainerRoot: normalizeContainerPath(this.runtime.remoteWorkspaceDir),
			agentContainerRoot: normalizeContainerPath(this.runtime.remoteAgentWorkspaceDir),
			includeAgentMount: path.resolve(this.sandbox.agentWorkspaceDir) !== path.resolve(this.sandbox.workspaceDir)
		}).toSorted((a, b) => b.length - a.length);
		for (const root of roots) if (isPathInsideContainerRoot(root, containerPath)) return root;
		return null;
	}
	async remotePathExists(containerPath, signal) {
		return (await this.runtime.runRemoteShellScript({
			script: "if [ -e \"$1\" ] || [ -L \"$1\" ]; then printf \"1\\n\"; else printf \"0\\n\"; fi",
			args: [containerPath],
			signal
		})).stdout.toString("utf8").trim() === "1";
	}
	async resolveCanonicalPath(params) {
		return await resolveRemoteCanonicalPath({
			...params,
			runRemoteShellScript: async (command) => await this.runtime.runRemoteShellScript(command)
		});
	}
	async assertNoHardlinkedFile(params) {
		const output = (await this.runtime.runRemoteShellScript({
			script: [
				"if [ ! -e \"$1\" ] && [ ! -L \"$1\" ]; then exit 0; fi",
				"stats=$(LC_ALL=C stat -c \"%F|%h\" -- \"$1\")",
				"printf \"%s\\n\" \"$stats\""
			].join("\n"),
			args: [params.containerPath],
			signal: params.signal,
			allowFailure: true
		})).stdout.toString("utf8").trim();
		if (!output) return;
		const [kind = "", linksRaw = "1"] = output.split("|");
		if (kind === "regular file" && hasMultipleHardlinks(linksRaw)) throw new Error(`Hardlinked path is not allowed under sandbox mount root: ${params.containerPath}`);
	}
	async resolvePinnedParent(params) {
		const basename = path.posix.basename(params.containerPath);
		if (!basename || basename === "." || basename === "/") throw new Error(`Invalid sandbox entry target: ${params.containerPath}`);
		const { canonicalPath, canonicalMountRoot, logicalPath } = await this.resolveCanonicalPath({
			containerPath: normalizeContainerPath(path.posix.dirname(params.containerPath)),
			mountRootPath: params.mountRootPath,
			action: params.action,
			allowFinalSymlinkForUnlink: params.allowFinalSymlinkForUnlink,
			signal: params.signal
		});
		const mount = this.resolveMountByContainerPath(this.getMounts(), logicalPath);
		if (!mount) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`);
		if (params.requireWritable && !mount.writable) throw new Error(`Sandbox path is read-only; cannot ${params.action}: ${params.containerPath}`);
		if (params.requireWritable) await this.assertRemoteProtectedPathWritable({
			containerPath: logicalPath,
			action: params.action,
			displayPath: params.containerPath,
			signal: params.signal
		});
		const relativeParentPath = path.posix.relative(canonicalMountRoot, canonicalPath);
		if (relativePathEscapesContainerRoot(relativeParentPath)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`);
		return {
			mountRootPath: canonicalMountRoot,
			relativeParentPath: relativeParentPath === "." ? "" : relativeParentPath,
			basename
		};
	}
	async runMutation(params) {
		return await this.runtime.runRemoteShellScript({
			script: [
				"set -eu",
				"python3 /dev/fd/3 \"$@\" 3<<'PY'",
				SANDBOX_PINNED_MUTATION_PYTHON,
				"PY"
			].join("\n"),
			args: params.args,
			stdin: params.stdin,
			signal: params.signal,
			allowFailure: params.allowFailure
		});
	}
};
//#endregion
//#region src/agents/sandbox/secret-owner.ts
const SSH_SECRET_KEYS = [
	"identityData",
	"certificateData",
	"knownHostsData"
];
/** Rejects cold or unmaterialized SSH credentials before any host SSH fallback is possible. */
function assertSshSandboxSecretOwnerAvailable(params) {
	if (params.agentId) assertRuntimeSandboxSecretOwnerAvailable(params.agentId);
	if (!params.config) return;
	const defaultsSsh = params.config.agents?.defaults?.sandbox?.ssh;
	const agentSsh = params.agentId && params.scope !== "shared" ? resolveAgentConfig(params.config, params.agentId)?.sandbox?.ssh : void 0;
	const normalizedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	const agentSource = normalizedAgentId ? listAgentEntriesWithSource(params.config).find(({ entry }) => normalizeAgentId(entry.id) === normalizedAgentId)?.source : void 0;
	const unresolved = [];
	for (const key of SSH_SECRET_KEYS) {
		const usesAgentValue = Boolean(agentSsh && Object.hasOwn(agentSsh, key));
		const ref = coerceSecretRef(usesAgentValue ? agentSsh?.[key] : defaultsSsh?.[key], params.config.secrets?.defaults);
		if (!ref) continue;
		unresolved.push({
			path: usesAgentValue && agentSource ? agentSource.kind === "entries" ? `agents.entries.${agentSource.key}.sandbox.ssh.${key}` : `agents.list.${agentSource.index}.sandbox.ssh.${key}` : `agents.defaults.sandbox.ssh.${key}`,
			refKey: secretRefKey(ref)
		});
	}
	if (unresolved.length > 0) throw new SecretSurfaceUnavailableError({
		ownerKind: "capability",
		ownerId: runtimeSandboxSecretOwnerId(params.agentId ?? "shared"),
		state: "unavailable",
		paths: unresolved.map((entry) => entry.path),
		refKeys: unresolved.map((entry) => entry.refKey),
		reason: "configured SSH secret reference was not materialized"
	});
}
//#endregion
//#region src/agents/sandbox/ssh.ts
/**
* SSH sandbox transport helpers.
*
* Materializes temporary SSH config, validates remote shell snippets, runs commands, and uploads workspace trees.
*/
function normalizeInlineSshMaterial(contents, filename) {
	const normalizedEscapedNewlines = contents.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").replace(/\\r\\n/g, "\\n").replace(/\\r/g, "\\n");
	const expanded = filename === "identity" || filename === "certificate.pub" ? normalizedEscapedNewlines.replace(/\\n/g, "\n") : normalizedEscapedNewlines;
	return expanded.endsWith("\n") ? expanded : `${expanded}\n`;
}
function buildSshFailureMessage(stderr, exitCode) {
	const trimmed = stderr.trim();
	if (trimmed.includes("error in libcrypto") && (trimmed.includes("Load key \"") || trimmed.includes("Permission denied (publickey)"))) return `${trimmed}\nSSH sandbox failed to load the configured identity. The private key contents may be malformed (for example CRLF or escaped newlines). Prefer identityFile when possible.`;
	return trimmed || (exitCode !== void 0 ? `ssh exited with code ${exitCode}` : "ssh exited with a non-zero status");
}
/** Single-quote a value for POSIX shell argv construction. */
function shellEscape(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
/** Build a remote shell command from literal argv entries. */
function buildRemoteCommand(argv) {
	return argv.map((entry) => shellEscape(entry)).join(" ");
}
function assertValidExecRemoteCommand(command) {
	const frames = [{
		kind: "root",
		quote: "plain",
		escaping: false,
		parenDepth: 0
	}];
	const pendingHeredocs = [];
	for (let index = 0; index < command.length; index += 1) {
		const frame = frames.at(-1);
		if (!frame) throw new Error("Malformed SSH/OpenShell exec command: parser state underflow.");
		const char = command.charAt(index);
		if (frame.escaping) {
			frame.escaping = false;
			continue;
		}
		if (frame.quote === "single") {
			if (char === "'") frame.quote = "plain";
			continue;
		}
		if (char === "\\") {
			frame.escaping = true;
			continue;
		}
		if (frame.quote === "double") {
			if (char === "\"") {
				frame.quote = "plain";
				continue;
			}
			if (char === "`") {
				frames.push(createExecCommandFrame("backtick"));
				continue;
			}
			if (char === "$" && command[index + 1] === "(" && command[index + 2] === "(") {
				frames.push(createExecCommandFrame("arithmetic", 2));
				index += 2;
				continue;
			}
			if (char === "$" && command[index + 1] === "(") {
				frames.push(createExecCommandFrame("command-substitution", 1));
				index += 1;
			}
			continue;
		}
		if (frame.kind === "arithmetic") {
			if (char === "(") {
				frame.parenDepth += 1;
				continue;
			}
			if (char === ")") {
				frame.parenDepth -= 1;
				if (frame.parenDepth === 0) frames.pop();
			}
			continue;
		}
		if (char === "\n") {
			const frameHeredocs = pendingHeredocs.filter((pending) => pending.frameDepth === frames.length);
			if (frameHeredocs.length > 0) {
				index = skipHeredocBodies(command, index + 1, frameHeredocs) - 1;
				for (const pending of frameHeredocs) pendingHeredocs.splice(pendingHeredocs.indexOf(pending), 1);
				continue;
			}
		}
		if (frame.kind === "backtick" && char === "`") {
			frames.pop();
			continue;
		}
		if (char === "'") {
			frame.quote = "single";
			continue;
		}
		if (char === "\"") {
			frame.quote = "double";
			continue;
		}
		if (char === "`") {
			frames.push(createExecCommandFrame("backtick"));
			continue;
		}
		if (char === "$" && command[index + 1] === "(" && command[index + 2] === "(") {
			frames.push(createExecCommandFrame("arithmetic", 2));
			index += 2;
			continue;
		}
		if (char === "$" && command[index + 1] === "(") {
			frames.push(createExecCommandFrame("command-substitution", 1));
			index += 1;
			continue;
		}
		if (char === "#" && isShellCommentStart(command, index)) {
			index = skipShellComment(command, index) - 1;
			continue;
		}
		if (char === "<") {
			const heredoc = readHeredoc(command, index);
			if (heredoc) {
				pendingHeredocs.push({
					...heredoc.pending,
					frameDepth: frames.length
				});
				index = heredoc.endIndex - 1;
				continue;
			}
			const placeholder = readPlaceholderToken(command, index);
			if (placeholder) throw new Error(`Malformed SSH/OpenShell exec command: unresolved placeholder token ${placeholder}.`);
		}
		if (frame.kind === "command-substitution") {
			if (char === "(") {
				frame.parenDepth += 1;
				continue;
			}
			if (char === ")") {
				frame.parenDepth -= 1;
				if (frame.parenDepth === 0) frames.pop();
			}
		}
	}
	if (frames.at(-1)?.escaping) throw new Error("Malformed SSH/OpenShell exec command: trailing backslash escape.");
	if (pendingHeredocs.length > 0) {
		const pending = pendingHeredocs.at(0);
		if (!pending) throw new Error("Malformed SSH/OpenShell exec command: parser state underflow.");
		throw new Error(`Malformed SSH/OpenShell exec command: unterminated here-doc ${pending.delimiter}.`);
	}
	for (const frame of frames.toReversed()) {
		if (frame.quote === "single") throw new Error("Malformed SSH/OpenShell exec command: unclosed single quote.");
		if (frame.quote === "double") throw new Error("Malformed SSH/OpenShell exec command: unclosed double quote.");
		if (frame.kind === "backtick") throw new Error("Malformed SSH/OpenShell exec command: unterminated backtick command substitution.");
		if (frame.kind === "command-substitution") throw new Error("Malformed SSH/OpenShell exec command: unterminated command substitution.");
		if (frame.kind === "arithmetic") throw new Error("Malformed SSH/OpenShell exec command: unterminated arithmetic expansion.");
	}
}
/** Build the wrapped remote `/bin/sh -c` command for sandbox exec. */
function buildExecRemoteCommand(params) {
	if (Object.keys(params.env).length > 0) throw new Error("SSH sandbox environment requires secure script staging; use prepareSshSandboxExec.");
	return buildRemoteCommand([
		"/bin/sh",
		"-c",
		params.workdir ? `cd ${shellEscape(params.workdir)} && ${params.command}` : params.command
	]);
}
/** Validate and build a remote exec command for untrusted model input. */
function buildValidatedExecRemoteCommand(params) {
	assertValidExecRemoteCommand(params.command);
	return buildExecRemoteCommand(params);
}
function createSshSandboxExecCleanup(session, remoteDir) {
	return async () => {
		await runSshSandboxCommand({
			session,
			remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				"rm -rf -- \"$1\"",
				"openclaw-sandbox-exec-cleanup",
				remoteDir
			]),
			allowFailure: true
		});
	};
}
/** Stage exec environment through private SSH stdin, never local or remote argv. */
async function prepareSshSandboxExec(params) {
	const env = params.tty && params.env.TERM === void 0 ? {
		TERM: "xterm-256color",
		...params.env
	} : params.env;
	for (const [key, value] of Object.entries(env)) {
		if (normalizeEnvVarKey(key, { portable: true }) !== key) throw new Error(`Invalid SSH sandbox environment variable name ${JSON.stringify(key)}; use a POSIX variable name.`);
		if (value.includes("\0")) throw new Error(`Invalid SSH sandbox environment variable ${JSON.stringify(key)}; values must not contain NUL bytes.`);
	}
	const remoteDir = `/tmp/openclaw-sandbox-exec-${randomUUID()}`;
	const remoteScript = `${remoteDir}/exec.sh`;
	const script = [
		"#!/bin/sh",
		"set -e",
		`rm -rf -- ${shellEscape(remoteDir)}`,
		...Object.entries(env).map(([key, value]) => `export ${key}=${shellEscape(value)}`),
		`exec ${params.remoteCommand}`,
		""
	].join("\n");
	const cleanup = createSshSandboxExecCleanup(params.session, remoteDir);
	try {
		await runSshSandboxCommand({
			session: params.session,
			remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				"umask 077 && mkdir -- \"$1\" && cat > \"$1/exec.sh\" && chmod 700 \"$1/exec.sh\"",
				"openclaw-sandbox-exec-stage",
				remoteDir
			]),
			stdin: script
		});
	} catch (error) {
		await cleanup().catch(() => void 0);
		throw error;
	}
	return {
		argv: buildSshSandboxArgv({
			session: params.session,
			remoteCommand: buildRemoteCommand(["/bin/sh", remoteScript]),
			tty: params.tty
		}),
		cleanup
	};
}
const VALIDATE_REMOTE_WORKDIR_SCRIPT = [
	"set -e",
	"target=\"$1\"",
	"root=\"$2\"",
	"case \"$target\" in /*) ;; *) echo \"remote directory must be absolute: $target\" >&2; exit 1 ;; esac",
	"case \"$root\" in /*) ;; *) echo \"remote root must be absolute: $root\" >&2; exit 1 ;; esac",
	"target=\"${target%/}\"",
	"root=\"${root%/}\"",
	"[ -n \"$target\" ] || target=\"/\"",
	"[ -n \"$root\" ] || root=\"/\"",
	"if [ \"$root\" != \"/\" ]; then",
	"  case \"$target/\" in \"$root\"/*|\"$root/\") ;; *) echo \"remote directory must stay under root: $target\" >&2; exit 1 ;; esac",
	"fi",
	"for path_to_check in \"$target\" \"$root\"; do",
	"  relative=\"${path_to_check#/}\"",
	"  while [ -n \"$relative\" ]; do",
	"    part=\"${relative%%/*}\"",
	"    if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"    [ -n \"$part\" ] || continue",
	"    case \"$part\" in \".\"|\"..\") echo \"unsafe remote directory component: $part\" >&2; exit 1 ;; esac",
	"  done",
	"done",
	"if [ -L \"$root\" ]; then echo \"unsafe remote root symlink: $root\" >&2; exit 1; fi",
	"if [ ! -d \"$root\" ]; then echo \"remote root not found: $root\" >&2; exit 1; fi",
	"canonical_root=\"$(cd \"$root\" && pwd -P)\"",
	"relative=\"${target#\"$root\"}\"",
	"relative=\"${relative#/}\"",
	"current=\"$canonical_root\"",
	"while [ -n \"$relative\" ]; do",
	"  part=\"${relative%%/*}\"",
	"  if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"  [ -n \"$part\" ] || continue",
	"  if [ \"$current\" = \"/\" ]; then next=\"/$part\"; else next=\"$current/$part\"; fi",
	"  if [ -L \"$next\" ]; then echo \"unsafe remote directory symlink: $next\" >&2; exit 1; fi",
	"  if [ ! -d \"$next\" ]; then echo \"remote directory not found: $next\" >&2; exit 1; fi",
	"  current=\"$next\"",
	"done",
	"printf \"%s\\n\" \"$current\""
].join("\n");
function buildRemoteWorkdirValidationCommand(params) {
	return buildRemoteCommand([
		"/bin/sh",
		"-c",
		VALIDATE_REMOTE_WORKDIR_SCRIPT,
		"openclaw-validate-workdir",
		params.workdir,
		params.root
	]);
}
function createExecCommandFrame(kind, parenDepth = 0) {
	return {
		kind,
		quote: "plain",
		escaping: false,
		parenDepth
	};
}
function readPlaceholderToken(command, index) {
	const match = /^<[A-Za-z][A-Za-z0-9_-]*>/.exec(command.slice(index));
	if (!match) return null;
	if (command[index - 1] === "=") return match[0];
	if (isLikelyGeneratedWorkflowPlaceholder(command, index)) return match[0];
	const next = command[index + match[0].length];
	if (next === void 0 || /[\r\n;&|)]/.test(next)) return match[0];
	if (next === " " || next === "	") return hasRedirectionTargetAfter(command, index + match[0].length) ? null : match[0];
	return null;
}
function hasRedirectionTargetAfter(command, index) {
	let cursor = index;
	while (command.charAt(cursor) === " " || command.charAt(cursor) === "	") cursor += 1;
	const next = command.charAt(cursor);
	return next !== "" && !/[;&|()<>\r\n]/.test(next);
}
function isLikelyGeneratedWorkflowPlaceholder(command, index) {
	const prefix = command.slice(0, index);
	const segmentStart = Math.max(prefix.lastIndexOf("\n"), prefix.lastIndexOf(";"), prefix.lastIndexOf("&"), prefix.lastIndexOf("|"), prefix.lastIndexOf("("), prefix.lastIndexOf("`")) + 1;
	const currentCommand = prefix.slice(segmentStart).trim();
	return /^workflow(?:\s+[A-Za-z0-9._/-]+)*$/.test(currentCommand);
}
function readHeredoc(command, index) {
	if (command[index + 1] !== "<" || command[index + 2] === "<") return null;
	let cursor = index + 2;
	const stripLeadingTabs = command[cursor] === "-";
	if (stripLeadingTabs) cursor += 1;
	while (command[cursor] === " " || command[cursor] === "	") cursor += 1;
	const delimiter = readHeredocDelimiter(command, cursor);
	if (!delimiter) throw new Error("Malformed SSH/OpenShell exec command: missing here-doc delimiter.");
	return {
		pending: {
			delimiter: delimiter.value,
			stripLeadingTabs
		},
		endIndex: delimiter.endIndex
	};
}
function readHeredocDelimiter(command, index) {
	let cursor = index;
	let delimiter = "";
	let quote = "plain";
	let escaping = false;
	while (cursor < command.length) {
		const char = command[cursor];
		if (escaping) {
			delimiter += char;
			escaping = false;
			cursor += 1;
			continue;
		}
		if (quote === "single") {
			if (char === "'") quote = "plain";
			else delimiter += char;
			cursor += 1;
			continue;
		}
		if (quote === "double") {
			if (char === "\"") quote = "plain";
			else if (char === "\\") escaping = true;
			else delimiter += char;
			cursor += 1;
			continue;
		}
		if (char === "\\") {
			escaping = true;
			cursor += 1;
			continue;
		}
		if (char === "'") {
			quote = "single";
			cursor += 1;
			continue;
		}
		if (char === "\"") {
			quote = "double";
			cursor += 1;
			continue;
		}
		if (isHeredocDelimiterTerminator(char)) break;
		delimiter += char;
		cursor += 1;
	}
	if (quote !== "plain" || escaping) throw new Error("Malformed SSH/OpenShell exec command: unterminated here-doc delimiter.");
	return delimiter ? {
		value: delimiter,
		endIndex: cursor
	} : null;
}
function isHeredocDelimiterTerminator(char) {
	return char === void 0 || /\s/.test(char) || [
		";",
		"&",
		"|",
		"(",
		")",
		"<",
		">"
	].includes(char);
}
function skipHeredocBodies(command, index, pendingHeredocs) {
	let cursor = index;
	for (const pending of pendingHeredocs) {
		let found = false;
		while (cursor <= command.length) {
			const lineEnd = command.indexOf("\n", cursor);
			const endIndex = lineEnd === -1 ? command.length : lineEnd;
			const rawLine = command.slice(cursor, endIndex);
			const normalizedLine = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
			const line = pending.stripLeadingTabs ? normalizedLine.replace(/^\t+/, "") : normalizedLine;
			cursor = lineEnd === -1 ? command.length : lineEnd + 1;
			if (line === pending.delimiter) {
				found = true;
				break;
			}
			if (lineEnd === -1) break;
		}
		if (!found) throw new Error(`Malformed SSH/OpenShell exec command: unterminated here-doc ${pending.delimiter}.`);
	}
	return cursor;
}
function isShellCommentStart(command, index) {
	const previous = command[index - 1];
	return previous === void 0 || /[\s;&|()]/.test(previous);
}
function skipShellComment(command, index) {
	const newlineIndex = command.indexOf("\n", index);
	return newlineIndex === -1 ? command.length : newlineIndex;
}
/** Build the local ssh argv for a prepared sandbox session. */
function buildSshSandboxArgv(params) {
	return [
		params.session.command,
		"-F",
		params.session.configPath,
		...params.tty ? [
			"-tt",
			"-o",
			"RequestTTY=force"
		] : [
			"-T",
			"-o",
			"RequestTTY=no"
		],
		params.session.host,
		params.remoteCommand
	];
}
/** Create a temporary SSH session from already-rendered ssh config text. */
async function createSshSandboxSessionFromConfigText(params) {
	const host = params.host?.trim() || parseSshConfigHost(params.configText);
	if (!host) throw new Error("Failed to parse SSH config output.");
	return await createSshSandboxSession(params.command?.trim() || "ssh", host, () => params.configText);
}
/** Create a temporary SSH session from structured sandbox SSH settings. */
async function createSshSandboxSessionFromSettings(settings) {
	const parsed = parseSshTarget(settings.target);
	if (!parsed) throw new Error(`Invalid sandbox SSH target: ${settings.target}`);
	return await createSshSandboxSession(settings.command.trim() || "ssh", "openclaw-sandbox", async (configDir) => {
		const materializedIdentity = settings.identityData ? await writeSecretMaterial(configDir, "identity", settings.identityData) : void 0;
		const materializedCertificate = settings.certificateData ? await writeSecretMaterial(configDir, "certificate.pub", settings.certificateData) : void 0;
		const materializedKnownHosts = settings.knownHostsData ? await writeSecretMaterial(configDir, "known_hosts", settings.knownHostsData) : void 0;
		const identityFile = materializedIdentity ?? resolveOptionalLocalPath(settings.identityFile);
		const certificateFile = materializedCertificate ?? resolveOptionalLocalPath(settings.certificateFile);
		const knownHostsFile = materializedKnownHosts ?? resolveOptionalLocalPath(settings.knownHostsFile);
		assertSshConfigLineValue(identityFile, "identityFile");
		assertSshConfigLineValue(certificateFile, "certificateFile");
		assertSshConfigLineValue(knownHostsFile, "knownHostsFile");
		const lines = [
			"Host openclaw-sandbox",
			`  HostName ${parsed.host}`,
			`  Port ${parsed.port}`,
			"  BatchMode yes",
			"  ConnectTimeout 5",
			"  ServerAliveInterval 15",
			"  ServerAliveCountMax 3",
			`  StrictHostKeyChecking ${settings.strictHostKeyChecking ? "yes" : "no"}`,
			`  UpdateHostKeys ${settings.updateHostKeys ? "yes" : "no"}`
		];
		if (parsed.user) lines.push(`  User ${parsed.user}`);
		if (knownHostsFile) lines.push(`  UserKnownHostsFile ${quoteSshConfigPath(knownHostsFile)}`);
		else if (!settings.strictHostKeyChecking) lines.push("  UserKnownHostsFile /dev/null");
		if (identityFile) lines.push(`  IdentityFile ${quoteSshConfigPath(identityFile)}`);
		if (certificateFile) lines.push(`  CertificateFile ${quoteSshConfigPath(certificateFile)}`);
		if (identityFile || certificateFile) lines.push("  IdentitiesOnly yes");
		return `${lines.join("\n")}\n`;
	});
}
/** Remove temporary SSH config and materialized secret files. */
async function disposeSshSandboxSession(session) {
	await fs.rm(path.dirname(session.configPath), {
		recursive: true,
		force: true
	});
}
/** Run a remote command through ssh and return buffered stdout/stderr. */
async function runSshSandboxCommand(params) {
	const [executable, ...args] = buildSshSandboxArgv({
		session: params.session,
		remoteCommand: params.remoteCommand,
		tty: params.tty
	});
	if (!executable) throw new Error("SSH command argv is empty");
	const sshEnv = sanitizeEnvVars(process.env).allowed;
	const result = await spawnCommand([executable, ...args], {
		baseEnv: sshEnv,
		cancelSignal: params.signal,
		encoding: "buffer",
		input: params.stdin ?? Buffer.alloc(0),
		maxBuffer: SANDBOX_COMMAND_MAX_BUFFER_BYTES,
		reject: false,
		stripFinalNewline: false
	});
	if (params.signal?.aborted || result.isCanceled) throw createAbortError("Aborted");
	if (result.failed && !isPlainCommandExitFailure(result)) throw toErrorObject(result, "SSH command execution failed");
	const stdout = Buffer.from(result.stdout);
	const stderr = Buffer.from(result.stderr);
	const exitCode = result.exitCode ?? (result.failed ? 1 : 0);
	if (exitCode !== 0 && !params.allowFailure) throw Object.assign(new Error(buildSshFailureMessage(stderr.toString("utf8"), exitCode)), {
		code: exitCode,
		stdout,
		stderr
	});
	return {
		stdout,
		stderr,
		code: exitCode
	};
}
const ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT = [
	"set -e",
	"target=\"$1\"",
	"root=\"${2:-$1}\"",
	"case \"$target\" in /*) ;; *) echo \"remote directory must be absolute: $target\" >&2; exit 1 ;; esac",
	"case \"$root\" in /*) ;; *) echo \"remote root must be absolute: $root\" >&2; exit 1 ;; esac",
	"target=\"${target%/}\"",
	"root=\"${root%/}\"",
	"[ -n \"$target\" ] || target=\"/\"",
	"[ -n \"$root\" ] || root=\"/\"",
	"case \"$target/\" in \"$root\"/*|\"$root/\") ;; *) echo \"remote directory must stay under root: $target\" >&2; exit 1 ;; esac",
	"for path_to_check in \"$target\" \"$root\"; do",
	"  relative=\"${path_to_check#/}\"",
	"  while [ -n \"$relative\" ]; do",
	"    part=\"${relative%%/*}\"",
	"    if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"    [ -n \"$part\" ] || continue",
	"    case \"$part\" in \".\"|\"..\") echo \"unsafe remote directory component: $part\" >&2; exit 1 ;; esac",
	"  done",
	"done",
	"if [ -L \"$root\" ]; then echo \"unsafe remote root symlink: $root\" >&2; exit 1; fi",
	"mkdir -p -- \"$root\"",
	"canonical_root=\"$(cd \"$root\" && pwd -P)\"",
	"relative=\"${target#\"$root\"}\"",
	"relative=\"${relative#/}\"",
	"current=\"$canonical_root\"",
	"while [ -n \"$relative\" ]; do",
	"  part=\"${relative%%/*}\"",
	"  if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"  [ -n \"$part\" ] || continue",
	"  if [ \"$current\" = \"/\" ]; then next=\"/$part\"; else next=\"$current/$part\"; fi",
	"  if [ -L \"$next\" ]; then echo \"unsafe remote directory symlink: $next\" >&2; exit 1; fi",
	"  if [ -e \"$next\" ]; then",
	"    if [ ! -d \"$next\" ]; then echo \"unsafe remote directory component: $next\" >&2; exit 1; fi",
	"  else",
	"    mkdir -- \"$next\"",
	"  fi",
	"  current=\"$next\"",
	"done"
].join("\n");
/** Stream a local directory to the remote sandbox with tar over ssh. */
async function uploadDirectoryToSshTarget(params) {
	await assertSafeUploadSymlinks(params.localDir);
	const remoteCommand = buildRemoteCommand([
		"/bin/sh",
		"-c",
		`${ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT}\ntar -xf - -C "$1"`,
		"openclaw-sandbox-upload",
		params.remoteDir,
		params.remoteRootDir ?? params.remoteDir
	]);
	const [sshExecutable, ...sshArgs] = buildSshSandboxArgv({
		session: params.session,
		remoteCommand
	});
	if (!sshExecutable) throw new Error("SSH command argv is empty");
	const sshEnv = sanitizeEnvVars(process.env).allowed;
	await new Promise((resolve, reject) => {
		const tar = spawn("tar", [
			"-C",
			params.localDir,
			"-cf",
			"-",
			"."
		], {
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			signal: params.signal
		});
		const ssh = spawn(sshExecutable, sshArgs, {
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: sshEnv,
			signal: params.signal
		});
		const tarStderr = [];
		const sshStdout = [];
		const sshStderr = [];
		let tarClosed = false;
		let sshClosed = false;
		let tarCode = 0;
		let sshCode = 0;
		let settled = false;
		const fail = (error) => {
			if (settled) return;
			settled = true;
			for (const child of [tar, ssh]) try {
				child.kill("SIGKILL");
			} catch {}
			reject(toErrorObject(error, "Non-Error rejection"));
		};
		tar.stderr.on("data", (chunk) => tarStderr.push(Buffer.from(chunk)));
		tar.stderr.on("error", fail);
		tar.stdout.on("error", fail);
		ssh.stdout.on("data", (chunk) => sshStdout.push(Buffer.from(chunk)));
		ssh.stdout.on("error", fail);
		ssh.stderr.on("data", (chunk) => sshStderr.push(Buffer.from(chunk)));
		ssh.stderr.on("error", fail);
		ssh.stdin?.on("error", fail);
		tar.on("error", fail);
		ssh.on("error", fail);
		tar.on("close", (code) => {
			tarClosed = true;
			tarCode = code ?? 0;
			maybeResolve();
		});
		ssh.on("close", (code) => {
			sshClosed = true;
			sshCode = code ?? 0;
			maybeResolve();
		});
		function maybeResolve() {
			if (settled || !tarClosed || !sshClosed) return;
			settled = true;
			if (tarCode !== 0) {
				reject(new Error(Buffer.concat(tarStderr).toString("utf8").trim() || `tar exited with code ${tarCode}`));
				return;
			}
			if (sshCode !== 0) {
				reject(new Error(Buffer.concat(sshStderr).toString("utf8").trim() || `ssh exited with code ${sshCode}`));
				return;
			}
			resolve();
		}
		try {
			tar.stdout.pipe(ssh.stdin);
		} catch (error) {
			fail(error);
		}
	});
}
async function assertSafeUploadSymlinks(localDir) {
	const rootDir = path.resolve(localDir);
	await walkDirectory(rootDir);
	async function walkDirectory(currentDir) {
		const entries = await fs.readdir(currentDir, { withFileTypes: true });
		for (const entry of entries) {
			const entryPath = path.join(currentDir, entry.name);
			if (entry.isSymbolicLink()) {
				try {
					await resolveRootPath({
						absolutePath: entryPath,
						rootPath: rootDir,
						boundaryLabel: "SSH sandbox upload tree"
					});
				} catch (error) {
					const relativePath = path.relative(rootDir, entryPath).split(path.sep).join("/");
					throw new Error(`SSH sandbox upload refuses symlink escaping the workspace: ${relativePath}`, { cause: error });
				}
				continue;
			}
			if (entry.isDirectory()) await walkDirectory(entryPath);
		}
	}
}
function parseSshConfigHost(configText) {
	return configText.match(/^\s*Host\s+(\S+)/m)?.[1]?.trim() || null;
}
function resolveSshTmpRoot() {
	return path.resolve(resolvePreferredOpenClawTmpDir() ?? os.tmpdir());
}
async function createSshSandboxSession(command, host, buildConfigText) {
	const configDir = await fs.mkdtemp(path.join(resolveSshTmpRoot(), "openclaw-sandbox-ssh-"));
	const configPath = path.join(configDir, "config");
	try {
		await writePrivateFile(configPath, await buildConfigText(configDir));
		return {
			command,
			configPath,
			host
		};
	} catch (error) {
		await fs.rm(configDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		throw error;
	}
}
function assertSshConfigLineValue(value, field) {
	if (value && /[\r\n"]/.test(value)) throw new Error(`SSH sandbox ${field} must not contain line breaks or double quotes.`);
}
function quoteSshConfigPath(value) {
	return /\s/.test(value) ? `"${value}"` : value;
}
function resolveOptionalLocalPath(value) {
	const trimmed = value?.trim();
	return trimmed ? resolveUserPath(trimmed) : void 0;
}
async function writeSecretMaterial(dir, filename, contents) {
	const pathname = path.join(dir, filename);
	await writePrivateFile(pathname, normalizeInlineSshMaterial(contents, filename));
	return pathname;
}
async function writePrivateFile(pathname, contents) {
	await fs.writeFile(pathname, contents, {
		encoding: "utf8",
		mode: 384
	});
	await fs.chmod(pathname, 384);
}
//#endregion
//#region src/agents/sandbox/ssh-backend.ts
/**
* SSH sandbox backend implementation.
*
* Creates remote workspace copies, builds remote exec specs, and exposes a backend-neutral filesystem bridge.
*/
/** SSH backend lifecycle hooks for probing and removing remote sandbox copies. */
const sshSandboxBackendManager = {
	async describeRuntime({ entry, config, agentId }) {
		const effectiveAgentId = agentId ?? resolveSandboxAgentId(entry.sessionKey);
		const cfg = resolveSandboxConfigForAgent(config, effectiveAgentId);
		if (cfg.backend !== "ssh" || !cfg.ssh.target) return {
			running: false,
			actualConfigLabel: cfg.ssh.target,
			configLabelMatch: false
		};
		assertSshSandboxSecretOwnerAvailable({
			config,
			scope: cfg.scope,
			agentId: effectiveAgentId
		});
		const runtimePaths = resolveSshRuntimePaths(cfg.ssh.workspaceRoot, entry.sessionKey);
		const session = await createSshSandboxSessionFromSettings({
			...cfg.ssh,
			target: cfg.ssh.target
		});
		try {
			return {
				running: (await runSshSandboxCommand({
					session,
					remoteCommand: buildRemoteCommand([
						"/bin/sh",
						"-c",
						"if [ -d \"$1\" ]; then printf \"1\\n\"; else printf \"0\\n\"; fi",
						"openclaw-sandbox-check",
						runtimePaths.runtimeRootDir
					])
				})).stdout.toString("utf8").trim() === "1",
				actualConfigLabel: cfg.ssh.target,
				configLabelMatch: entry.image === cfg.ssh.target
			};
		} finally {
			await disposeSshSandboxSession(session);
		}
	},
	async removeRuntime({ entry, config, agentId }) {
		const effectiveAgentId = agentId ?? resolveSandboxAgentId(entry.sessionKey);
		const cfg = resolveSandboxConfigForAgent(config, effectiveAgentId);
		if (cfg.backend !== "ssh" || !cfg.ssh.target) return;
		assertSshSandboxSecretOwnerAvailable({
			config,
			scope: cfg.scope,
			agentId: effectiveAgentId
		});
		const runtimePaths = resolveSshRuntimePaths(cfg.ssh.workspaceRoot, entry.sessionKey);
		const session = await createSshSandboxSessionFromSettings({
			...cfg.ssh,
			target: cfg.ssh.target
		});
		try {
			const result = await runSshSandboxCommand({
				session,
				remoteCommand: buildRemoteCommand([
					"/bin/sh",
					"-c",
					"rm -rf -- \"$1\"",
					"openclaw-sandbox-remove",
					runtimePaths.runtimeRootDir
				]),
				allowFailure: true
			});
			if (result.code !== 0) {
				const detail = result.stderr.toString("utf8").trim() || `exit ${result.code}`;
				throw new Error(`Failed to remove SSH sandbox runtime ${entry.containerName}: ${detail}`);
			}
		} finally {
			await disposeSshSandboxSession(session);
		}
	}
};
async function createSshSandboxBackendInternal(params, preprovisionedSshWorkdir) {
	if ((params.cfg.docker.binds?.length ?? 0) > 0) throw new Error("SSH sandbox backend does not support sandbox.docker.binds.");
	const target = params.cfg.ssh.target;
	if (!target) throw new Error("Sandbox backend \"ssh\" requires agents.defaults.sandbox.ssh.target.");
	return new SshSandboxBackendImpl({
		createParams: params,
		preprovisionedSshWorkdir,
		target,
		runtimePaths: preprovisionedSshWorkdir ? resolvePreprovisionedSshRuntimePaths(preprovisionedSshWorkdir) : resolveSshRuntimePaths(params.cfg.ssh.workspaceRoot, params.scopeKey)
	}).asHandle();
}
async function createSshSandboxBackend(params) {
	return await createSshSandboxBackendInternal(params);
}
/** Adopts a placement-owned remote worktree without mirroring local files into it. */
async function createPreprovisionedSshSandboxBackend(params, preprovisionedSshWorkdir) {
	return await createSshSandboxBackendInternal(params, preprovisionedSshWorkdir);
}
var SshSandboxBackendImpl = class {
	constructor(params) {
		this.params = params;
		this.ensurePromise = null;
		this.refreshedSkillsForNextExecWorkdir = null;
	}
	asHandle() {
		return {
			id: "ssh",
			runtimeId: this.params.runtimePaths.runtimeId,
			runtimeLabel: this.params.runtimePaths.runtimeId,
			workdir: this.params.runtimePaths.remoteWorkspaceDir,
			env: this.params.createParams.cfg.docker.env,
			configLabel: this.params.target,
			configLabelKind: "Target",
			workdirValidation: "backend",
			validateWorkdir: async (workdir) => await this.validateWorkdir(workdir),
			discardPreparedWorkdir: (workdir) => this.discardPreparedWorkdir(workdir),
			workdirRoots: [this.params.runtimePaths.remoteWorkspaceDir, ...this.params.preprovisionedSshWorkdir ? [] : [this.params.runtimePaths.remoteAgentWorkspaceDir]],
			remoteWorkspaceDir: this.params.runtimePaths.remoteWorkspaceDir,
			remoteAgentWorkspaceDir: this.params.runtimePaths.remoteAgentWorkspaceDir,
			buildExecSpec: async ({ command, workdir, env, usePty }) => {
				const remoteWorkdir = workdir ?? this.params.runtimePaths.remoteWorkspaceDir;
				const remoteCommand = buildValidatedExecRemoteCommand({
					command,
					workdir: remoteWorkdir,
					env: {}
				});
				await this.ensureRuntime();
				const sshSession = await this.createSession();
				try {
					if (!this.consumeRefreshedSkillsForNextExec(remoteWorkdir)) await this.refreshRemoteSkillsWorkspace(sshSession);
					const prepared = await prepareSshSandboxExec({
						session: sshSession,
						remoteCommand,
						env,
						tty: usePty
					});
					return {
						argv: prepared.argv,
						env: sanitizeEnvVars(process.env).allowed,
						stdinMode: "pipe-open",
						finalizeToken: {
							sshSession,
							cleanup: prepared.cleanup
						}
					};
				} catch (error) {
					await disposeSshSandboxSession(sshSession);
					throw error;
				}
			},
			finalizeExec: async ({ token }) => {
				const pending = token;
				if (pending) try {
					await pending.cleanup();
				} finally {
					await disposeSshSandboxSession(pending.sshSession);
				}
			},
			runShellCommand: async (command) => await this.runRemoteShellScript(command),
			createFsBridge: ({ sandbox }) => createRemoteShellSandboxFsBridge({
				sandbox,
				runtime: this.asHandle()
			}),
			runRemoteShellScript: async (command) => await this.runRemoteShellScript(command)
		};
	}
	async createSession() {
		return await createSshSandboxSessionFromSettings({
			...this.params.createParams.cfg.ssh,
			target: this.params.target
		});
	}
	async ensureRuntime() {
		if (this.ensurePromise) return await this.ensurePromise;
		this.ensurePromise = this.ensureRuntimeInner();
		try {
			await this.ensurePromise;
		} catch (error) {
			this.ensurePromise = null;
			throw error;
		}
	}
	async ensureRuntimeInner() {
		if (this.params.preprovisionedSshWorkdir) return;
		const session = await this.createSession();
		try {
			if ((await runSshSandboxCommand({
				session,
				remoteCommand: buildRemoteCommand([
					"/bin/sh",
					"-c",
					"if [ -d \"$1\" ]; then printf \"1\\n\"; else printf \"0\\n\"; fi",
					"openclaw-sandbox-check",
					this.params.runtimePaths.runtimeRootDir
				])
			})).stdout.toString("utf8").trim() === "1") return;
			await this.replaceRemoteDirectoryFromLocal(session, this.params.createParams.workspaceDir, this.params.runtimePaths.remoteWorkspaceDir);
			if (this.params.createParams.cfg.workspaceAccess !== "none" && path.resolve(this.params.createParams.agentWorkspaceDir) !== path.resolve(this.params.createParams.workspaceDir)) await this.replaceRemoteDirectoryFromLocal(session, this.params.createParams.agentWorkspaceDir, this.params.runtimePaths.remoteAgentWorkspaceDir);
		} finally {
			await disposeSshSandboxSession(session);
		}
	}
	async validateWorkdir(workdir) {
		await this.ensureRuntime();
		const session = await this.createSession();
		let refreshedSkillsForWorkdir = null;
		try {
			if (isRemotePathInsideRoot(this.params.runtimePaths.remoteSkillsWorkspaceDir, workdir)) {
				await this.refreshRemoteSkillsWorkspace(session);
				refreshedSkillsForWorkdir = workdir;
				this.refreshedSkillsForNextExecWorkdir = workdir;
			}
			const result = await runSshSandboxCommand({
				session,
				remoteCommand: buildRemoteWorkdirValidationCommand({
					workdir,
					root: this.resolveWorkdirValidationRoot(workdir)
				}),
				allowFailure: true
			});
			const resolvedWorkdir = result.code === 0 ? result.stdout.toString("utf8").trim() : "";
			if (refreshedSkillsForWorkdir) this.refreshedSkillsForNextExecWorkdir = resolvedWorkdir || null;
			return resolvedWorkdir || null;
		} catch (error) {
			if (refreshedSkillsForWorkdir && this.refreshedSkillsForNextExecWorkdir === refreshedSkillsForWorkdir) this.refreshedSkillsForNextExecWorkdir = null;
			throw error;
		} finally {
			await disposeSshSandboxSession(session);
		}
	}
	discardPreparedWorkdir(workdir) {
		if (this.refreshedSkillsForNextExecWorkdir === workdir) this.refreshedSkillsForNextExecWorkdir = null;
	}
	consumeRefreshedSkillsForNextExec(workdir) {
		if (this.refreshedSkillsForNextExecWorkdir !== workdir) {
			this.refreshedSkillsForNextExecWorkdir = null;
			return false;
		}
		this.refreshedSkillsForNextExecWorkdir = null;
		return true;
	}
	resolveWorkdirValidationRoot(workdir) {
		return [this.params.runtimePaths.remoteAgentWorkspaceDir, this.params.runtimePaths.remoteWorkspaceDir].find((root) => isRemotePathInsideRoot(root, workdir)) ?? this.params.runtimePaths.remoteWorkspaceDir;
	}
	async refreshRemoteSkillsWorkspace(session) {
		if (this.params.preprovisionedSshWorkdir || this.params.createParams.cfg.workspaceAccess !== "rw" || !this.params.createParams.skillsWorkspaceDir) return;
		await this.clearRemoteDirectory(session, this.params.runtimePaths.remoteSkillsWorkspaceDir);
		if (!await isExistingDirectory(this.params.createParams.skillsWorkspaceDir)) return;
		await uploadDirectoryToSshTarget({
			session,
			localDir: this.params.createParams.skillsWorkspaceDir,
			remoteDir: this.params.runtimePaths.remoteSkillsWorkspaceDir,
			remoteRootDir: this.params.runtimePaths.runtimeRootDir
		});
	}
	async clearRemoteDirectory(session, remoteDir) {
		await runSshSandboxCommand({
			session,
			remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				`${ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT}\nfind "$1" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +`,
				"openclaw-sandbox-clear",
				remoteDir,
				this.params.runtimePaths.runtimeRootDir
			])
		});
	}
	async replaceRemoteDirectoryFromLocal(session, localDir, remoteDir) {
		await this.clearRemoteDirectory(session, remoteDir);
		await uploadDirectoryToSshTarget({
			session,
			localDir,
			remoteDir,
			remoteRootDir: this.params.runtimePaths.runtimeRootDir
		});
	}
	async runRemoteShellScript(params) {
		await this.ensureRuntime();
		const session = await this.createSession();
		try {
			await this.refreshRemoteSkillsWorkspace(session);
			return await runSshSandboxCommand({
				session,
				remoteCommand: buildRemoteCommand([
					"/bin/sh",
					"-c",
					params.script,
					"openclaw-sandbox-fs",
					...params.args ?? []
				]),
				stdin: params.stdin,
				allowFailure: params.allowFailure,
				signal: params.signal
			});
		} finally {
			await disposeSshSandboxSession(session);
		}
	}
};
async function isExistingDirectory(dir) {
	try {
		return (await fs.stat(dir)).isDirectory();
	} catch {
		return false;
	}
}
function normalizeRemotePath(input) {
	const normalized = path.posix.normalize(input.replace(/\\/g, "/"));
	return normalized === "/" ? normalized : normalized.replace(/\/+$/g, "");
}
function isRemotePathInsideRoot(root, candidate) {
	const normalizedRoot = normalizeRemotePath(root);
	const normalizedCandidate = normalizeRemotePath(candidate);
	return normalizedCandidate === normalizedRoot || (normalizedRoot === "/" ? normalizedCandidate.startsWith("/") : normalizedCandidate.startsWith(`${normalizedRoot}/`));
}
function resolveSshRuntimePaths(workspaceRoot, scopeKey) {
	const runtimeId = buildSshSandboxRuntimeId(scopeKey);
	const runtimeRootDir = path.posix.join(workspaceRoot, runtimeId);
	return {
		runtimeId,
		runtimeRootDir,
		remoteWorkspaceDir: path.posix.join(runtimeRootDir, "workspace"),
		remoteAgentWorkspaceDir: path.posix.join(runtimeRootDir, "agent"),
		remoteSkillsWorkspaceDir: path.posix.join(runtimeRootDir, "workspace", ".openclaw", "sandbox-skills")
	};
}
function resolvePreprovisionedSshRuntimePaths(params) {
	const remoteWorkspaceDir = params.remoteWorkspaceDir;
	if (!path.posix.isAbsolute(remoteWorkspaceDir) || remoteWorkspaceDir === "/" || path.posix.normalize(remoteWorkspaceDir) !== remoteWorkspaceDir || remoteWorkspaceDir.endsWith("/")) throw new Error("Preprovisioned SSH workdir must be an absolute non-root path.");
	const runtimeId = params.runtimeId.trim();
	if (!runtimeId) throw new Error("Preprovisioned SSH runtime id must be a non-empty string.");
	return {
		runtimeId,
		runtimeRootDir: remoteWorkspaceDir,
		remoteWorkspaceDir,
		remoteAgentWorkspaceDir: remoteWorkspaceDir,
		remoteSkillsWorkspaceDir: path.posix.join(remoteWorkspaceDir, ".openclaw", "sandbox-skills")
	};
}
function buildSshSandboxRuntimeId(scopeKey) {
	const trimmed = scopeKey.trim() || "session";
	if (/:workspace:[a-f0-9]{32}$/i.test(trimmed)) return `openclaw-ssh-workspace-${hashTextSha256(trimmed).slice(0, 32)}`;
	const safe = normalizeLowercaseStringOrEmpty(trimmed).replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
	const hash = Array.from(trimmed).reduce((acc, char) => (acc * 33 ^ char.charCodeAt(0)) >>> 0, 5381);
	return `openclaw-ssh-${safe || "session"}-${hash.toString(16).slice(0, 8)}`;
}
//#endregion
export { createDockerSandboxBackend as A, resolveWritableRenameTargetsForBridge as C, buildPinnedRemovePlan as D, buildPinnedMkdirpPlan as E, dockerSandboxBackendManager as M, podmanSandboxBackendManager as N, buildPinnedRenamePlan as O, runDockerSandboxShellCommand as P, resolveWritableRenameTargets as S, buildPinnedCreatePlan as T, assertSshSandboxSecretOwnerAvailable as _, buildExecRemoteCommand as a, parseSandboxStatSize as b, buildSshSandboxArgv as c, createSshSandboxSessionFromSettings as d, disposeSshSandboxSession as f, uploadDirectoryToSshTarget as g, shellEscape as h, sshSandboxBackendManager as i, createPodmanSandboxBackend as j, buildPinnedWritePlan as k, buildValidatedExecRemoteCommand as l, runSshSandboxCommand as m, createSshSandboxBackend as n, buildRemoteCommand as o, prepareSshSandboxExec as p, resolveSshRuntimePaths as r, buildRemoteWorkdirValidationCommand as s, createPreprovisionedSshSandboxBackend as t, createSshSandboxSessionFromConfigText as u, createRemoteShellSandboxFsBridge as v, buildPinnedCopyPlan as w, createWritableRenameTargetResolver as x, parseSandboxStatMtimeMs as y };
