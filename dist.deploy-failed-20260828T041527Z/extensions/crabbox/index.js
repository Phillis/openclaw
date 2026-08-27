import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { c as isRecord } from "../../record-coerce-DItp3I4t.js";
import { d as asPositiveSafeInteger } from "../../number-coercion-CLj0HTDM.js";
import { f as redactSensitiveText, m as redactToolPayloadText } from "../../redact-CWP17HFN.js";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-DnyL0lW9.js";
import { r as runCommandWithTimeout } from "../../exec-D2kbpwdA.js";
import { t as truncateUtf8Prefix } from "../../utf8-truncate-Dro7v_iB.js";
import { r as createPluginStateSyncKeyedStore } from "../../plugin-state-store-WXMs6Mfy.js";
import { t as WorkerProviderError } from "../../capability-provider.types-cizOzEy5.js";
import "../../temp-path-wP_7naJE.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import "../../plugin-state-store-runtime-BJ3_ylcI.js";
import "../../process-runtime-B-C-YQA7.js";
import "../../logging-core-CPB7z_U5.js";
import "../../text-utility-runtime-BNhX-3os.js";
import { _ as countCrabboxProvisionSetupPhases, a as operationLeaseId, b as resolveCrabboxProvisionCallTimeoutMs, c as resolveCrabboxBinary, d as CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS, f as CRABBOX_LIFECYCLE_TIMEOUT_MS, g as CRABBOX_WARMUP_TIMEOUT_MS, h as CRABBOX_SETUP_TIMEOUT_MS, i as listCrabboxMachineOptions, l as resolveCrabboxProvisionProfile, m as CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS, n as buildCrabboxWarmupArgs, o as operationSlug, p as CRABBOX_MACHINE_CATALOG_TIMEOUT_MS, s as parseCrabboxProfile, t as CRABBOX_WORKER_PROVIDER_ID, u as resolveOpenClawRoot, v as resolveCrabboxLifecycleTimeoutMs, x as resolveCrabboxReadyPollIntervalMs, y as resolveCrabboxProvisionBaseTimeoutMs } from "../../crabbox-worker-profile-BwpaZfhQ.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { join } from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
//#region extensions/crabbox/src/crabbox-worker-command-error.ts
const MAX_COMMAND_DETAIL_CHARS = 512;
function crabboxCommandDetail(result) {
	const raw = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
	if (!raw) return "";
	const compressed = redactSensitiveText(raw).replace(/\s+/gu, " ");
	return compressed.length <= MAX_COMMAND_DETAIL_CHARS ? `: ${compressed}` : `: ... ${sliceUtf16Safe(compressed, 4 - MAX_COMMAND_DETAIL_CHARS)}`;
}
function crabboxCommandError(action, result) {
	if (result.termination !== "exit") return /* @__PURE__ */ new Error(`Crabbox ${action} did not exit normally (${result.termination})${crabboxCommandDetail(result)}`);
	const exitCode = result.code === null ? "unknown" : String(result.code);
	return /* @__PURE__ */ new Error(`Crabbox ${action} failed with exit code ${exitCode}${crabboxCommandDetail(result)}`);
}
function permanentCrabboxCommandError(action, result) {
	return new WorkerProviderError(crabboxCommandError(action, result).message);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-command.ts
const MAX_OUTPUT_BYTES = 64 * 1024;
async function runCrabboxCommand(params) {
	try {
		return await params.runCommand([params.binary, ...params.args], {
			timeoutMs: params.timeoutMs,
			maxOutputBytes: MAX_OUTPUT_BYTES,
			killProcessTree: true,
			...params.env === void 0 ? {} : { env: params.env },
			...params.input === void 0 ? {} : { input: params.input },
			...params.signal ? { signal: params.signal } : {}
		});
	} catch {
		throw new Error(`Crabbox ${params.action} could not start`);
	}
}
function provisionProfileError(result) {
	if (result.termination !== "exit") return;
	const output = `${result.stderr}\n${result.stdout}`;
	if (/\bprovider=\S+\s+does not support fixed idempotent lease IDs\b/u.test(output) || /(?:unknown|unrecognized) (?:flag|option)[^\r\n]*--lease-id/iu.test(output) || /flag provided but not defined:\s*-lease-id/iu.test(output)) return new WorkerProviderError("Crabbox 0.41.1 or newer with fixed lease ID support is required");
	if (/\blease_id_conflict\b/u.test(output) && !/\bretry after provider inventory converges\b/iu.test(output)) return permanentCrabboxCommandError("warmup", result);
	if (result.code !== 2) return;
	if (/\bunknown provider\s+"[^"\r\n]+"/u.test(output)) return new WorkerProviderError("Crabbox profile provider is not supported by this Crabbox binary");
	if (/\bprovider=\S+\s+does not support warmup\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider does not support warmup");
	if (/\bprovider=\S+.*\bdoes not support status\b/u.test(output) || /\bprovider=\S+\s+does not expose persistent status\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider does not support worker leases");
	if (/\bprovider=\S+\s+is one-shot; use crabbox run\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider is run-only");
	if (/\bprovider=\S+\s+requires module source; use crabbox run --script\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider requires a run script");
	if (/--class is not supported for provider=\S+/u.test(output)) return new WorkerProviderError("Crabbox profile class is not supported by its provider");
}
function isAuthoritativeLeaseAbsence(result, identifier) {
	const output = `${result.stderr}\n${result.stdout}`;
	if (!output.includes(identifier) || /\b(?:access\s+denied|authentication|authorization|credentials?|forbidden|permission|token|unauthorized)\b/iu.test(output)) return false;
	return result.code === 4 && /\b(?:was\s+)?not found\b/iu.test(output) || result.code === 4 && /\bno longer exists\b/iu.test(output) || result.code === 4 && /\b(?:points to|is bound to) (?:a )?missing (?:instance|sandbox)\b/iu.test(output) || result.code === 4 && /\bdisappeared before release\b/iu.test(output) || result.code === 4 && /\bunknown blacksmith testbox(?:\s|:)/iu.test(output) || result.code === 4 && /\bis not claimed by Crabbox\b/iu.test(output) || result.code === 4 && /\bwandb sandbox "[^"\r\n]+" has no matching local ownership claim\b/iu.test(output) || result.code === 5 && /\bcoder workspace "[^"\r\n]+" not found\b/iu.test(output) || /\bcoordinator GET \S*\/v1\/leases\/\S+:\s*http 404\b/iu.test(output) || result.code === 4 && /\bunknown lease(?:\s|:)/iu.test(output);
}
async function stopCrabboxLease(params) {
	const result = await runCrabboxCommand({
		action: "stop",
		args: [
			"stop",
			"--provider",
			params.provider,
			"--id",
			params.id
		],
		binary: params.binary,
		runCommand: params.runCommand,
		timeoutMs: params.timeoutMs ?? 6e4
	});
	if (result.termination === "exit" && result.code === 0) return;
	const alreadyStopped = `${result.stderr}\n${result.stdout}`.includes(params.id) && /\balready (?:destroyed|released|stopped|terminated)\b/iu.test(`${result.stderr}\n${result.stdout}`);
	if (result.termination === "exit" && (isAuthoritativeLeaseAbsence(result, params.id) || alreadyStopped)) return;
	throw crabboxCommandError("stop", result);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-desktop-setup.ts
const CRABBOX_WORKER_BROWSER_PATH = "/usr/local/bin/openclaw-worker-browser";
const CRABBOX_WORKER_TERMINAL_PATH = "/usr/local/bin/openclaw-worker-terminal";
const CRABBOX_WORKER_BROWSER_CDP_PORT = 9222;
function xfceDesktopEnvironment() {
	return [
		"[ -r /var/lib/crabbox/desktop.env ] || { echo \"Crabbox desktop environment is unavailable\" >&2; exit 1; }",
		"grep -Fx 'CRABBOX_DESKTOP_ENV=xfce' /var/lib/crabbox/desktop.env >/dev/null || { echo \"Crabbox desktop environment is not XFCE\" >&2; exit 1; }",
		"grep -Fx 'DISPLAY=:99' /var/lib/crabbox/desktop.env >/dev/null || { echo \"Crabbox XFCE display is not :99\" >&2; exit 1; }",
		"export DISPLAY=:99"
	];
}
function browserLauncher(leaseId) {
	return [
		"#!/bin/bash",
		"set -euo pipefail",
		"[ \"$#\" -eq 0 ] || { echo \"openclaw-worker-browser does not accept arguments\" >&2; exit 64; }",
		...xfceDesktopEnvironment(),
		"[ -x /usr/local/bin/crabbox-browser ] || { echo \"Crabbox browser is unavailable\" >&2; exit 1; }",
		"worker_home=$(getent passwd \"$(id -u)\" | cut -d: -f6)",
		"case \"$worker_home\" in /*) ;; *) echo \"Crabbox worker home is invalid\" >&2; exit 1 ;; esac",
		"export HOME=\"$worker_home\"",
		`export CRABBOX_BROWSER_PROFILE="$worker_home/.cache/openclaw/worker-browser/${leaseId}"`,
		"mkdir -p \"$CRABBOX_BROWSER_PROFILE\"",
		"chmod 700 \"$CRABBOX_BROWSER_PROFILE\"",
		"exec 9>\"$CRABBOX_BROWSER_PROFILE/.openclaw-launch.lock\"",
		"flock -x 9",
		`cdp_url=http://127.0.0.1:${CRABBOX_WORKER_BROWSER_CDP_PORT}/json/version`,
		"if curl --fail --silent --show-error --max-time 1 \"$cdp_url\" >/dev/null; then",
		"  exit 0",
		"fi",
		"launch_log=\"$CRABBOX_BROWSER_PROFILE/launch.log\"",
		": >\"$launch_log\"",
		`nohup /usr/local/bin/crabbox-browser --remote-debugging-address=127.0.0.1 --remote-debugging-port=${CRABBOX_WORKER_BROWSER_CDP_PORT} about:blank >>"$launch_log" 2>&1 </dev/null &`,
		"for _attempt in $(seq 1 40); do",
		"  if curl --fail --silent --show-error --max-time 1 \"$cdp_url\" >/dev/null; then",
		"    exit 0",
		"  fi",
		"  sleep 0.5",
		"done",
		`echo "Browser CDP did not become ready on 127.0.0.1:${CRABBOX_WORKER_BROWSER_CDP_PORT} within 20 seconds" >&2`,
		"exit 1"
	];
}
function terminalLauncher() {
	return [
		"#!/bin/bash",
		"set -euo pipefail",
		"[ \"$#\" -eq 0 ] || { echo \"openclaw-worker-terminal does not accept arguments\" >&2; exit 64; }",
		...xfceDesktopEnvironment(),
		"nohup /usr/bin/xfce4-terminal >/dev/null 2>&1 </dev/null &",
		"terminal_pid=$!",
		"sleep 0.2",
		"if kill -0 \"$terminal_pid\" 2>/dev/null; then",
		"  exit 0",
		"fi",
		"wait \"$terminal_pid\""
	];
}
function heredoc(target, marker, contents) {
	return [
		`cat >"$setup_dir/${target}" <<'${marker}'`,
		...contents,
		marker
	];
}
function createCrabboxWorkerDesktopSetup(leaseId, wallpaperBase64) {
	return [
		"set -euo pipefail",
		"worker_user=$(id -un)",
		"worker_uid=$(id -u)",
		"worker_group=$(id -gn)",
		"worker_home=$(getent passwd \"$worker_uid\" | cut -d: -f6)",
		"case \"$worker_home\" in /*) ;; *) echo \"Crabbox worker home is invalid\" >&2; exit 1 ;; esac",
		"as_root() { if [ \"$worker_uid\" -eq 0 ]; then \"$@\"; else sudo -n -- \"$@\"; fi; }",
		...xfceDesktopEnvironment(),
		"for required_command in xfconf-query xfdesktop xrandr awk curl flock getent pgrep pkill python3; do command -v \"$required_command\" >/dev/null 2>&1 || { echo \"Required Crabbox desktop command is unavailable: $required_command\" >&2; exit 1; }; done",
		"read_xfce_process_environment() {",
		"  local process_pid=\"$1\"",
		"  exec 8<\"/proc/$process_pid/environ\" || return 1",
		"  process_display=",
		"  process_dbus=",
		"  process_runtime_dir=",
		"  while IFS= read -r -d '' process_variable; do",
		"    case \"$process_variable\" in",
		"      DISPLAY=*) process_display=\"${process_variable#*=}\" ;;",
		"      DBUS_SESSION_BUS_ADDRESS=*) process_dbus=\"${process_variable#*=}\" ;;",
		"      XDG_RUNTIME_DIR=*) process_runtime_dir=\"${process_variable#*=}\" ;;",
		"    esac",
		"  done <&8",
		"  exec 8<&-",
		"}",
		"# XFCE owns the D-Bus session; the image's original renderer may have been launched outside it.",
		"mapfile -t session_pids < <(pgrep -u \"$worker_uid\" -x xfce4-session || true)",
		"[ \"${#session_pids[@]}\" -eq 1 ] || { echo \"Expected exactly one worker-owned XFCE session; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"session_pid=\"${session_pids[0]}\"",
		"read_xfce_process_environment \"$session_pid\" || { echo \"XFCE session changed while it was inspected; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"[ \"$process_display\" = \":99\" ] || { echo \"XFCE session does not use DISPLAY=:99; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"DBUS_SESSION_BUS_ADDRESS=\"$process_dbus\"",
		"unset XDG_RUNTIME_DIR",
		"XDG_RUNTIME_DIR=\"$process_runtime_dir\"",
		"[ -n \"$DBUS_SESSION_BUS_ADDRESS\" ] || { echo \"XFCE session is missing its D-Bus binding; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"case \"$XDG_RUNTIME_DIR\" in \"\"|/*) ;; *) echo \"XFCE session has an invalid XDG_RUNTIME_DIR\" >&2; exit 1 ;; esac",
		"export DBUS_SESSION_BUS_ADDRESS",
		"[ -z \"$XDG_RUNTIME_DIR\" ] || export XDG_RUNTIME_DIR",
		"bind_xfdesktop_renderer() {",
		"  mapfile -t renderer_pids < <(pgrep -u \"$worker_uid\" -x xfdesktop || true)",
		"  [ \"${#renderer_pids[@]}\" -eq 1 ] || return 1",
		"  renderer_pid=\"${renderer_pids[0]}\"",
		"  read_xfce_process_environment \"$renderer_pid\" || return 1",
		"  [ \"$process_display\" = \"$DISPLAY\" ] && [ \"$process_dbus\" = \"$DBUS_SESSION_BUS_ADDRESS\" ]",
		"}",
		"setup_dir=$(mktemp -d)",
		"trap 'rm -rf -- \"$setup_dir\"' EXIT",
		...heredoc("browser", "WORKER_BROWSER_LAUNCHER_EOF", browserLauncher(leaseId)),
		...heredoc("terminal", "WORKER_TERMINAL_LAUNCHER_EOF", terminalLauncher()),
		`python3 -c 'import base64,pathlib,sys;pathlib.Path(sys.argv[1]).write_bytes(base64.b64decode(sys.stdin.buffer.read().strip(),validate=True))' "$setup_dir/wallpaper.png" <<'WORKER_WALLPAPER_B64_EOF'`,
		wallpaperBase64,
		"WORKER_WALLPAPER_B64_EOF",
		`as_root install -o root -g root -m 0755 "$setup_dir/browser" ${CRABBOX_WORKER_BROWSER_PATH}`,
		`as_root install -o root -g root -m 0755 "$setup_dir/terminal" ${CRABBOX_WORKER_TERMINAL_PATH}`,
		"as_root install -d -o \"$worker_user\" -g \"$worker_group\" -m 0755 \"$worker_home/.cache\" \"$worker_home/.cache/openclaw\" \"$worker_home/.cache/openclaw/worker-browser\"",
		`as_root install -d -o "$worker_user" -g "$worker_group" -m 0700 "$worker_home/.cache/openclaw/worker-browser/${leaseId}"`,
		"as_root install -d -o \"$worker_user\" -g \"$worker_group\" -m 0755 \"$worker_home/.local\" \"$worker_home/.local/share\" \"$worker_home/.local/share/backgrounds\"",
		"wallpaper_path=\"$worker_home/.local/share/backgrounds/openclaw-worker.png\"",
		"as_root install -o \"$worker_user\" -g \"$worker_group\" -m 0644 \"$setup_dir/wallpaper.png\" \"$wallpaper_path\"",
		"# Setup precedes node enrollment, so re-home only this worker's renderer before publishing it.",
		"pkill -TERM -u \"$worker_uid\" -x xfdesktop || true",
		"for _attempt in $(seq 1 20); do pgrep -u \"$worker_uid\" -x xfdesktop >/dev/null || break; sleep 0.1; done",
		"pkill -KILL -u \"$worker_uid\" -x xfdesktop || true",
		"nohup xfdesktop >\"$worker_home/.cache/openclaw/xfdesktop.log\" 2>&1 </dev/null &",
		"for _attempt in $(seq 1 40); do bind_xfdesktop_renderer && break; sleep 0.1; done",
		"bind_xfdesktop_renderer || { echo \"XFCE desktop renderer did not converge on the worker session\" >&2; exit 1; }",
		"mapfile -t backdrop_roots < <(",
		"  {",
		"    xfconf-query -c xfce4-desktop -l | sed -n 's#\\(/backdrop/[^/]*/[^/]*/workspace[^/]*\\)/.*#\\1#p'",
		"    while read -r monitor; do for workspace in 0 1 2 3; do printf \"/backdrop/screen0/monitor%s/workspace%s\\n\" \"$monitor\" \"$workspace\"; done; done < <(xrandr --listmonitors | awk 'NR > 1 { print $NF }')",
		"  } | sort -u",
		")",
		"[ \"${#backdrop_roots[@]}\" -gt 0 ] || { echo \"XFCE did not advertise any desktop backdrops\" >&2; exit 1; }",
		"for backdrop in \"${backdrop_roots[@]}\"; do",
		"  xfconf-query -c xfce4-desktop -p \"$backdrop/last-image\" -s \"$wallpaper_path\" || xfconf-query -c xfce4-desktop -p \"$backdrop/last-image\" -n -t string -s \"$wallpaper_path\"",
		"  xfconf-query -c xfce4-desktop -p \"$backdrop/image-style\" -s 5 || xfconf-query -c xfce4-desktop -p \"$backdrop/image-style\" -n -t int -s 5",
		"done",
		"renderer_pid_before_reload=\"$renderer_pid\"",
		"xfdesktop --reload",
		"bind_xfdesktop_renderer || { echo \"XFCE desktop renderer lost its worker session during reload\" >&2; exit 1; }",
		"[ \"$renderer_pid\" = \"$renderer_pid_before_reload\" ] || { echo \"XFCE desktop renderer changed during reload; restart crabbox-desktop.service and retry\" >&2; exit 1; }"
	].join("\n");
}
function createCrabboxWorkerDesktopEndpoint() {
	return {
		protocol: "rfb",
		port: 5900,
		passwordFilePath: "/var/lib/crabbox/vnc.password",
		apps: [{
			id: "browser",
			executablePath: CRABBOX_WORKER_BROWSER_PATH,
			cdpPort: CRABBOX_WORKER_BROWSER_CDP_PORT
		}, {
			id: "terminal",
			executablePath: CRABBOX_WORKER_TERMINAL_PATH
		}]
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-env-profile.ts
async function withCrabboxWorkerEnvProfile(values, run) {
	const entries = Object.entries(values ?? {});
	const names = entries.map(([name]) => name);
	let directory;
	try {
		let profilePath;
		if (entries.length > 0) {
			const profile = entries.map(([name, value]) => {
				if ([
					"\0",
					"\r",
					"\n",
					"`",
					"$("
				].some((unsafe) => value.includes(unsafe))) throw new WorkerProviderError(`Crabbox setup environment value cannot be represented safely: ${name}`);
				return `${name}="${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}"`;
			}).join("\n");
			directory = await mkdtemp(join(resolvePreferredOpenClawTmpDir(), "openclaw-crabbox-env-"));
			profilePath = join(directory, "setup.env");
			await writeFile(profilePath, `${profile}\n`, {
				mode: 384,
				flag: "wx"
			});
		}
		return await run(names, profilePath, {
			...Object.fromEntries(names.map((name) => [name, void 0])),
			CRABBOX_ENV_ALLOW: ","
		});
	} finally {
		if (directory) await rm(directory, {
			force: true,
			recursive: true
		});
	}
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-heartbeat.ts
const CRABBOX_HEARTBEAT_UPGRADE = "upgrade Crabbox to v0.44.0 or newer for `crabbox heartbeat`";
function permanentHeartbeatFailure(result) {
	const output = `${result.stderr}\n${result.stdout}`;
	if (result.termination === "exit" && result.code === 2 && /\bprovider=\S+ does not support lease heartbeat\b/iu.test(output)) return "provider";
	return /\b(?:unexpected argument|unknown command|unrecognized command)[^\r\n]*\bheartbeat\b/iu.test(output) || /\bheartbeat\b[^\r\n]*\b(?:unknown|unrecognized)\b/iu.test(output) || result.termination === "exit" && result.code === 2 ? "command" : void 0;
}
function createCrabboxHeartbeatManager(dependencies) {
	const entries = /* @__PURE__ */ new Map();
	let disposed = false;
	const isCurrent = (entry) => !disposed && entries.get(entry.id) === entry;
	const warn = (entry, message) => dependencies.warn(`${message}; cloud worker machines may be reaped after ${entry.idleTimeout} of coordinator-idle time`);
	const schedule = (entry, delayMs = entry.heartbeatIntervalMs) => {
		if (!isCurrent(entry)) return;
		entry.timer = setTimeout(() => void heartbeat(entry), delayMs);
		entry.timer.unref?.();
	};
	const heartbeat = async (entry) => {
		if (!isCurrent(entry) || entry.controller) return;
		const controller = new AbortController();
		entry.controller = controller;
		let result;
		const startedAt = Date.now();
		try {
			result = await dependencies.run(entry, controller.signal);
		} catch (error) {
			if (isCurrent(entry) && !entry.failureWarned) {
				entry.failureWarned = true;
				warn(entry, error instanceof Error ? error.message : "Crabbox heartbeat failed");
			}
			delete entry.controller;
			schedule(entry);
			return;
		}
		delete entry.controller;
		if (!isCurrent(entry)) return;
		if (result.termination === "exit" && result.code === 0) {
			entry.failureWarned = false;
			schedule(entry);
			return;
		}
		const permanentFailure = permanentHeartbeatFailure(result);
		if (permanentFailure) {
			const message = permanentFailure === "command" ? `Crabbox heartbeat is unavailable for worker lease ${entry.id}; ${CRABBOX_HEARTBEAT_UPGRADE}` : `Crabbox provider ${entry.provider} does not support heartbeat for worker lease ${entry.id}`;
			warn(entry, message);
			return;
		}
		if (!entry.failureWarned) {
			entry.failureWarned = true;
			const message = crabboxCommandError("heartbeat", result).message;
			warn(entry, message.replace("(timeout)", `(timeout after ${Date.now() - startedAt} ms)`));
		}
		schedule(entry);
	};
	const stop = (leaseId) => {
		const entry = entries.get(leaseId);
		if (!entry) return;
		entries.delete(leaseId);
		if (entry.timer) clearTimeout(entry.timer);
		entry.controller?.abort();
	};
	return {
		start(context) {
			if (disposed || entries.has(context.id)) return;
			const entry = {
				...context,
				failureWarned: false
			};
			entries.set(context.id, entry);
			schedule(entry, 0);
		},
		stop,
		dispose() {
			disposed = true;
			for (const leaseId of entries.keys()) stop(leaseId);
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-inspect.ts
function parseInspectJson(stdout) {
	let value;
	try {
		const parsed = JSON.parse(stdout);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("inspect output is not an object");
		value = parsed;
	} catch {
		throw new Error("Crabbox inspect returned invalid JSON");
	}
	const id = normalizeOptionalString(value.id);
	const state = normalizeOptionalString(value.state)?.toLowerCase();
	if (!id || !/^\S{1,128}$/u.test(id) || !state) throw new Error("Crabbox inspect returned an invalid lease identity or state");
	if (value.ready !== void 0 && typeof value.ready !== "boolean") throw new Error("Crabbox inspect returned an invalid ready state");
	if (value.tailscale !== void 0 && (value.tailscale === null || typeof value.tailscale !== "object" || Array.isArray(value.tailscale))) throw new Error("Crabbox inspect returned invalid Tailscale state");
	const tailscaleEnabled = value.tailscale !== void 0;
	let awsInstanceProfileAttached;
	if (value.providerMetadata !== void 0) {
		if (value.providerMetadata === null || typeof value.providerMetadata !== "object" || Array.isArray(value.providerMetadata)) throw new Error("Crabbox inspect returned invalid provider metadata");
		const attached = value.providerMetadata["instanceProfileAttached"];
		if (attached !== void 0 && typeof attached !== "boolean") throw new Error("Crabbox inspect returned invalid AWS instance profile metadata");
		awsInstanceProfileAttached = attached;
	}
	return {
		id,
		state,
		tailscaleEnabled,
		...awsInstanceProfileAttached !== void 0 ? { awsInstanceProfileAttached } : {},
		...typeof value.ready === "boolean" ? { ready: value.ready } : {}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-machine-options.ts
function parseCrabboxMachineShapes(stdout) {
	const parsed = JSON.parse(stdout);
	if (!Array.isArray(parsed)) throw new Error("Crabbox providers returned invalid JSON");
	return new Map(parsed.flatMap((entry) => {
		if (!isRecord(entry) || isRecord(entry.classCatalog) && entry.classCatalog.disposition === "unmapped") return [];
		const classes = (Array.isArray(entry.classes) ? entry.classes : []).flatMap((raw) => {
			if (!isRecord(raw)) return [];
			const machineClass = normalizeOptionalString(raw.class);
			if (!machineClass) return [];
			const cpu = asPositiveSafeInteger(raw.vcpu);
			const memoryGb = asPositiveSafeInteger(raw.memoryGb);
			return [{
				class: machineClass,
				...cpu ? { cpu } : {},
				...memoryGb ? { memoryGb } : {}
			}];
		});
		const provider = normalizeOptionalString(entry.provider)?.toLowerCase();
		return provider && classes.length > 0 ? [[provider, classes]] : [];
	}));
}
function createCrabboxMachineOptionsResolver(dependencies) {
	const machineShapesByBinary = /* @__PURE__ */ new Map();
	const loadMachineShapes = async (binary) => {
		const result = await dependencies.runCommand([
			binary,
			"providers",
			"--json"
		], {
			maxOutputBytes: 1024 * 1024,
			killProcessTree: true,
			timeoutMs: CRABBOX_MACHINE_CATALOG_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw new Error(`Crabbox providers command failed (${result.termination}, code ${result.code})`);
		return parseCrabboxMachineShapes(result.stdout);
	};
	return async (profile) => {
		const parsed = parseCrabboxProfile(profile);
		const binary = dependencies.resolveBinary(parsed.binary);
		let shapes = machineShapesByBinary.get(binary);
		if (!shapes) {
			shapes = loadMachineShapes(binary).catch((error) => {
				machineShapesByBinary.delete(binary);
				dependencies.warn(`Crabbox machine shapes unavailable: ${error instanceof Error ? error.message : String(error)}`);
				return /* @__PURE__ */ new Map();
			});
			machineShapesByBinary.set(binary, shapes);
		}
		return listCrabboxMachineOptions(parsed.class, (await shapes).get(parsed.provider));
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-node-enrollment-diagnostics.ts
const NODE_ENROLLMENT_DIAGNOSTIC_TIMEOUT_MS = 6e4;
const MAX_NODE_ENROLLMENT_EVIDENCE_BYTES = 2048;
async function collectCrabboxNodeEnrollmentEvidence(params) {
	let label = "box evidence";
	let detail;
	try {
		const result = await runCrabboxCommand({
			action: "enrollment diagnostics",
			args: params.args,
			binary: params.binary,
			input: [
				`state_dir="$HOME/.openclaw/cloud-workers/${params.id}"`,
				"printf \"package-spec=\"",
				"if [ -s \"$state_dir/package-spec\" ]; then head -c 256 \"$state_dir/package-spec\"; else printf absent; fi",
				"printf \" node-pid=\"",
				"if [ -s \"$state_dir/node.pid\" ] && kill -0 \"$(head -c 32 \"$state_dir/node.pid\")\" 2>/dev/null; then printf alive; else printf dead-or-absent; fi",
				"printf \" node.log tail: \"",
				"if [ -r \"$state_dir/node.log\" ]; then tail -c 2000 \"$state_dir/node.log\"; else printf absent; fi"
			].join("\n"),
			runCommand: params.runCommand,
			...params.signal ? { signal: params.signal } : {},
			timeoutMs: NODE_ENROLLMENT_DIAGNOSTIC_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError("enrollment diagnostics", result);
		detail = result.stdout.trim();
		if (!detail) throw new Error("diagnostic command returned no output");
	} catch (error) {
		label = "box evidence unavailable";
		detail = error instanceof Error ? error.message : "diagnostic command failed";
	}
	const prefix = `${label}: `;
	return `${prefix}${truncateUtf8Prefix(redactToolPayloadText(detail).replace(/\s+/gu, " ").trim(), MAX_NODE_ENROLLMENT_EVIDENCE_BYTES - prefix.length)}`;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-node-enrollment.ts
const CLOUD_SETUP_CODE_ENV = "CRABBOX_WORKER_SETUP_CODE";
function shellQuote(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function createCrabboxNodeEnrollmentSetup(params) {
	const { enrollment, executionMode, leaseId } = params;
	const stateDir = `.openclaw/cloud-workers/${leaseId}`;
	const packageCandidates = enrollment.packageSpecs.map(shellQuote).join(" ");
	if (!packageCandidates) throw new Error("Worker node enrollment has no OpenClaw package source");
	const versionLabel = shellQuote(`OpenClaw ${enrollment.openclawVersion}`);
	const versionMetadataPrefix = shellQuote(`OpenClaw ${enrollment.openclawVersion} `);
	const setupCodeLines = enrollment.mode === "connect" ? [
		"setup_code_file=\"$state_dir/setup-code\"",
		"umask 077",
		`printf "%s\\n" "$${CLOUD_SETUP_CODE_ENV}" >"$setup_code_file"`,
		`unset ${CLOUD_SETUP_CODE_ENV}`
	] : [];
	const launch = enrollment.mode === "connect" ? `connect --target-file "$setup_code_file" --ephemeral --display-name ${shellQuote(enrollment.displayName)}` : `node run --ephemeral --display-name ${shellQuote(enrollment.displayName)}`;
	const prepareCodex = () => {
		if (executionMode !== "remote-exec") return [];
		return [`"$@" plugins inspect codex --json | node -e ${shellQuote([
			"try{",
			"const fs=require(\"node:fs\"),path=require(\"node:path\"),module=require(\"node:module\");",
			"const inspection=JSON.parse(fs.readFileSync(0,\"utf8\")),plugin=inspection.plugin;",
			`const version=${JSON.stringify(enrollment.openclawVersion)};`,
			"if(plugin?.id!==\"codex\"||plugin.packageName!==\"@openclaw/codex\"||plugin.packageVersion!==version||(plugin.origin!==\"bundled\"&&(plugin.trustedOfficialInstall!==true||inspection.install?.source!==\"npm\"))){",
			"throw new Error(`Codex remote-exec requires the exact official @openclaw/codex@${version} plugin to be installed by cloudWorkers profile setup`)}",
			"const root=fs.realpathSync(plugin.rootDir);",
			"const manifest=JSON.parse(fs.readFileSync(path.join(root,\"package.json\"),\"utf8\"));",
			"const requirePlugin=module.createRequire(path.join(root,\"package.json\"));",
			"const runtime=requirePlugin(\"@openai/codex/package.json\");",
			"if(manifest.name!==plugin.packageName||manifest.version!==version||runtime.version!==manifest.dependencies?.[\"@openai/codex\"]){",
			"throw new Error(\"Codex remote-exec requires the plugin and its exact pinned native runtime\")}",
			"const launcher=requirePlugin.resolve(\"@openai/codex/bin/codex.js\");",
			"const probe=require(\"node:child_process\").spawnSync(process.execPath,[launcher,\"--version\"],{encoding:\"utf8\",timeout:10000,stdio:[\"ignore\",\"pipe\",\"pipe\"]});",
			"if(probe.status!==0||probe.stdout?.trim()!==`codex-cli ${runtime.version}`){",
			"throw new Error(\"Codex remote-exec requires the exact executable platform-native Codex binary\")}",
			"if(plugin.origin!==\"bundled\"){",
			"const project=path.join(process.argv[1],\"npm\",\"projects\",\"codex\");",
			"const packageRoot=path.join(project,\"node_modules\",\"@openclaw\");",
			"fs.mkdirSync(packageRoot,{recursive:true,mode:0o700});",
			"const dependency={\"@openclaw/codex\":version};",
			"fs.writeFileSync(path.join(project,\"package.json\"),JSON.stringify({name:\"openclaw-cloud-codex\",private:true,dependencies:dependency})+\"\\n\",{mode:0o600});",
			"const projected=path.join(packageRoot,\"codex\");",
			"try{const existing=fs.lstatSync(projected);",
			"if(!existing.isSymbolicLink()||fs.realpathSync(projected)!==root){throw new Error(\"Codex node plugin path is occupied\")}",
			"}catch(error){if(error.code!==\"ENOENT\"){throw error}fs.symlinkSync(root,projected)}",
			"}",
			"}catch(error){console.error(String(error));process.exitCode=1}"
		].join(""))} "$state_dir"`, "OPENCLAW_STATE_DIR=\"$state_dir\" \"$@\" plugins enable codex"];
	};
	return {
		command: [
			"set -eu",
			`state_dir="$HOME/${stateDir}"`,
			"mkdir -p \"$state_dir\"",
			"chmod 700 \"$state_dir\"",
			"pid_file=\"$state_dir/node.pid\"",
			"package_spec_file=\"$state_dir/package-spec\"",
			"if [ -s \"$pid_file\" ] && kill -0 \"$(cat \"$pid_file\")\" 2>/dev/null; then exit 0; fi",
			...setupCodeLines,
			"if command -v openclaw >/dev/null 2>&1; then",
			"  case \"$(openclaw --version 2>/dev/null || true)\" in",
			`    ${versionLabel}|${versionMetadataPrefix}*) printf "%s\\n" "@global" >"$package_spec_file" ;;`,
			"  esac",
			"fi",
			"if [ ! -s \"$package_spec_file\" ]; then",
			"  rm -f \"$package_spec_file\"",
			`  for package_candidate in ${packageCandidates}; do`,
			"    if OPENCLAW_STATE_DIR=\"$state_dir\" npx --yes --package \"$package_candidate\" -- openclaw --version >/dev/null 2>&1; then",
			"      printf \"%s\\n\" \"$package_candidate\" >\"$package_spec_file\"",
			"      break",
			"    fi",
			"  done",
			"fi",
			"if [ ! -s \"$package_spec_file\" ]; then",
			`  printf "%s\\n" ${shellQuote(`OpenClaw worker bootstrap could not install Gateway version ${enrollment.openclawVersion}; for an unreleased Gateway build, cloudWorkers profile setup must install that exact version globally before enrollment.`)} >&2`,
			"  exit 1",
			"fi",
			"package_spec=\"$(cat \"$package_spec_file\")\"",
			"if [ \"$package_spec\" = \"@global\" ]; then",
			"  set -- openclaw",
			"else",
			"  set -- npx --yes --package \"$package_spec\" -- openclaw",
			"fi",
			...prepareCodex(),
			`setsid -f sh -c 'printf "%s\\n" "$$" >"$1"; shift; exec "$@"' sh "$pid_file" env OPENCLAW_STATE_DIR="$state_dir" "$@" ${launch} >"$state_dir/node.log" 2>&1 </dev/null`,
			"for _ in 1 2 3 4 5 6 7 8 9 10; do [ -s \"$pid_file\" ] && break; sleep 0.1; done",
			"test -s \"$pid_file\""
		].join("\n"),
		...enrollment.mode === "connect" ? { forwardedEnv: { [CLOUD_SETUP_CODE_ENV]: enrollment.setupCode } } : {}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-wallpaper.ts
const WORKER_WALLPAPER_WIDTH = 1024;
const WORKER_WALLPAPER_HEIGHT = 576;
const PNG_SIGNATURE = Buffer.from([
	137,
	80,
	78,
	71,
	13,
	10,
	26,
	10
]);
function loadCrabboxWorkerWallpaperBase64(wallpaperPath) {
	let wallpaper;
	try {
		wallpaper = fs.readFileSync(wallpaperPath);
	} catch (cause) {
		throw new Error(`Crabbox worker wallpaper could not be read: ${wallpaperPath}`, { cause });
	}
	if (wallpaper.length < 33 || !wallpaper.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE) || wallpaper.readUInt32BE(8) !== 13 || wallpaper.toString("ascii", 12, 16) !== "IHDR") throw new Error(`Crabbox worker wallpaper is not a PNG: ${wallpaperPath}`);
	const width = wallpaper.readUInt32BE(16);
	const height = wallpaper.readUInt32BE(20);
	if (width !== WORKER_WALLPAPER_WIDTH || height !== WORKER_WALLPAPER_HEIGHT) throw new Error(`Crabbox worker wallpaper must be ${WORKER_WALLPAPER_WIDTH}x${WORKER_WALLPAPER_HEIGHT}; got ${width}x${height}: ${wallpaperPath}`);
	return wallpaper.toString("base64");
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-warm-image.ts
const WARM_IMAGE_RETENTION_MS = 336 * 60 * 60 * 1e3;
const WARM_IMAGE_COMMAND_TIMEOUT_MS = 6e4;
const WARM_IMAGE_CAPTURE_TIMEOUT_MS = 18e4;
const WARM_IMAGE_CAPTURE_RESERVATION_TIMEOUT_MS = 2 * WARM_IMAGE_CAPTURE_TIMEOUT_MS;
const WARM_IMAGE_MAX_ENTRIES = 128;
const CHECKPOINT_ID_PATTERN = /^chk_[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/u;
const SCRUB_WORKER_STATE = `set -eu
worker_root="$HOME/.openclaw/cloud-workers"
worker_processes=$(ps -eo pid=,args=)
worker_pids=$(printf '%s\\n' "$worker_processes" | awk -v root="$worker_root" -v self="$$" '$1 != self && index($0, root) { print $1 }')
if [ -n "$worker_pids" ]; then
  kill -TERM $worker_pids 2>/dev/null || true
  sleep 1
  kill -KILL $worker_pids 2>/dev/null || true
fi
rm -rf "$worker_root"
`;
function crabboxWarmImageKey(profile) {
	return createHash("sha256").update(JSON.stringify({
		backendProvider: profile.provider,
		setup: profile.setup ?? "",
		setupEnvKeys: [...profile.setupEnv ?? []].toSorted(),
		desktop: profile.desktop ?? false,
		machineClass: profile.class
	})).digest("hex");
}
function parseCheckpointJson(stdout, action) {
	let parsed;
	try {
		parsed = JSON.parse(stdout);
	} catch {
		throw new Error(`Crabbox checkpoint ${action} returned invalid JSON`);
	}
	if (!isRecord(parsed)) throw new Error(`Crabbox checkpoint ${action} returned an invalid record`);
	return parsed;
}
function parseCreatedCheckpoint(stdout, leaseId) {
	const record = parseCheckpointJson(stdout, "create");
	const checkpointId = normalizeOptionalString(record.id);
	const kind = normalizeOptionalString(record.kind);
	const nativeState = isRecord(record.native) ? normalizeOptionalString(record.native.state) : void 0;
	if (!checkpointId || !CHECKPOINT_ID_PATTERN.test(checkpointId) || !kind || record.leaseId !== leaseId || !nativeState) throw new Error("Crabbox checkpoint create returned an invalid native checkpoint");
	return {
		checkpointId,
		kind,
		state: nativeState === "available" ? "available" : "pending"
	};
}
function parseCheckpointAvailability(stdout) {
	const record = parseCheckpointJson(stdout, "inspect");
	if (!normalizeOptionalString(record.localState) || !normalizeOptionalString(record.nextAction)) throw new Error("Crabbox checkpoint inspect returned an invalid verification record");
	if (record.providerState === void 0 || record.providerState === "missing") return "missing";
	if (typeof record.providerState !== "string") throw new Error("Crabbox checkpoint inspect returned an invalid provider state");
	return record.providerState === "available" ? "available" : "pending";
}
function createCrabboxWarmImageManager(dependencies) {
	let store;
	const warned = /* @__PURE__ */ new Set();
	const openStore = () => store ??= createPluginStateSyncKeyedStore("crabbox", {
		namespace: "warm-images",
		maxEntries: WARM_IMAGE_MAX_ENTRIES,
		overflowPolicy: "evict-oldest"
	});
	const warnOnce = (action, error) => {
		const message = `Crabbox warm image ${action} failed; using cold provisioning: ${error instanceof Error ? error.message : String(error)}`;
		if (!warned.has(message)) {
			warned.add(message);
			dependencies.warn(message);
		}
	};
	const checkpointCommand = async (context, action, args, timeoutMs = WARM_IMAGE_COMMAND_TIMEOUT_MS, input) => {
		const result = await runCrabboxCommand({
			action: action === "scrub" ? action : `checkpoint ${action}`,
			args,
			binary: context.binary,
			runCommand: dependencies.runCommand,
			timeoutMs,
			...input === void 0 ? {} : { input }
		});
		if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError(action === "scrub" ? action : `checkpoint ${action}`, result);
		return result.stdout;
	};
	const deleteImage = async (context, key, record, timeoutMs = WARM_IMAGE_COMMAND_TIMEOUT_MS) => {
		if (record.checkpointId) await checkpointCommand(context, "delete", [
			"checkpoint",
			"delete",
			record.checkpointId
		], timeoutMs);
		openStore().delete(key);
	};
	const makeRoomForCapture = async (context) => {
		const deadline = Date.now() + WARM_IMAGE_COMMAND_TIMEOUT_MS;
		for (let remainingEntries = WARM_IMAGE_MAX_ENTRIES; remainingEntries > 0; remainingEntries--) {
			const entries = openStore().entries();
			if (entries.length < WARM_IMAGE_MAX_ENTRIES) return true;
			const remainingTime = deadline - Date.now();
			if (remainingTime <= 0) return false;
			const oldest = entries.filter(({ value }) => value.checkpointId || Date.now() - value.createdAtMs >= WARM_IMAGE_CAPTURE_RESERVATION_TIMEOUT_MS).toSorted((left, right) => left.value.lastUsedAtMs - right.value.lastUsedAtMs)[0];
			if (!oldest) return false;
			await deleteImage(context, oldest.key, oldest.value, remainingTime);
		}
		return openStore().entries().length < WARM_IMAGE_MAX_ENTRIES;
	};
	const collectExpiredImages = async (context) => {
		const deadline = Date.now() + WARM_IMAGE_COMMAND_TIMEOUT_MS;
		for (const { key, value } of openStore().entries()) {
			if (Date.now() - value.lastUsedAtMs < WARM_IMAGE_RETENTION_MS) continue;
			const remaining = deadline - Date.now();
			if (remaining <= 0) break;
			await deleteImage(context, key, value, remaining);
		}
	};
	const verifyImage = async (context, checkpointId) => parseCheckpointAvailability(await checkpointCommand(context, "inspect", [
		"checkpoint",
		"inspect",
		checkpointId,
		"--verify",
		"--json"
	]));
	const forkImage = async (context) => {
		try {
			await collectExpiredImages(context);
			const key = crabboxWarmImageKey(context.profile);
			let record = openStore().lookup(key);
			if (!record?.checkpointId) return false;
			if (record.state === "pending") {
				const state = await verifyImage(context, record.checkpointId);
				if (state === "missing") {
					await deleteImage(context, key, record);
					return false;
				}
				if (state !== "available") return false;
				record = {
					...record,
					state
				};
				openStore().register(key, record);
			}
			const fork = parseCheckpointJson(await checkpointCommand(context, "fork", [
				"checkpoint",
				"fork",
				record.checkpointId,
				"--provider",
				context.provider,
				"--lease-id",
				context.id,
				"--class",
				context.profile.class,
				"--slug",
				context.slug,
				"--json"
			], context.timeoutMs()), "fork");
			if (fork.checkpointId !== record.checkpointId || fork.leaseId !== context.id || fork.provider !== context.provider || fork.slug !== context.slug || !normalizeOptionalString(fork.workdir)) throw new Error("Crabbox checkpoint fork returned an invalid lease identity");
			openStore().register(key, {
				...record,
				lastUsedAtMs: Date.now()
			});
			return true;
		} catch (error) {
			warnOnce("fork", error);
			return false;
		}
	};
	return {
		async capture(context) {
			const key = crabboxWarmImageKey(context.profile);
			let reservation;
			try {
				await collectExpiredImages(context);
				const existing = openStore().lookup(key);
				if (existing) if (!existing.checkpointId) {
					const staleBefore = Date.now() - WARM_IMAGE_CAPTURE_RESERVATION_TIMEOUT_MS;
					if (existing.createdAtMs > staleBefore || !openStore().deleteIf?.(key, (current) => !current.checkpointId && current.createdAtMs <= staleBefore)) return;
				} else {
					if (await verifyImage(context, existing.checkpointId) !== "missing") return;
					await deleteImage(context, key, existing);
				}
				if (!context.eligible || !await makeRoomForCapture(context)) return;
				const now = Date.now();
				reservation = {
					checkpointId: "",
					kind: "",
					state: "pending",
					createdAtMs: now,
					lastUsedAtMs: now
				};
				if (!openStore().registerIfAbsent(key, reservation)) {
					reservation = void 0;
					return;
				}
				await checkpointCommand(context, "scrub", dependencies.runArgs(context), WARM_IMAGE_CAPTURE_TIMEOUT_MS, SCRUB_WORKER_STATE);
				const created = parseCreatedCheckpoint(await checkpointCommand(context, "create", [
					"checkpoint",
					"create",
					"--provider",
					context.provider,
					"--id",
					context.id,
					"--mode",
					"native",
					"--wait=false",
					"--json"
				], WARM_IMAGE_CAPTURE_TIMEOUT_MS), context.id);
				openStore().register(key, {
					...reservation,
					...created
				});
				reservation = void 0;
			} catch (error) {
				if (reservation) try {
					store?.deleteIf?.(key, (current) => current.checkpointId === "");
				} catch {}
				warnOnce("capture", error);
			}
		},
		async allocate(context) {
			if (context.profile.warmImage && await forkImage(context)) return;
			const result = await runCrabboxCommand({
				action: "warmup",
				args: buildCrabboxWarmupArgs(context.profile, context.id, context.slug),
				binary: context.binary,
				runCommand: dependencies.runCommand,
				timeoutMs: context.timeoutMs()
			});
			if (result.termination === "exit" && result.code === 0) return;
			throw provisionProfileError(result) ?? crabboxCommandError("warmup", result);
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-provider.ts
const MAX_ERROR_DETAIL_CHARS = 512;
const DESTROYED_STATES = /* @__PURE__ */ new Set([
	"deleted",
	"destroyed",
	"expired",
	"missing",
	"released",
	"stopped",
	"stopped_with_code",
	"terminated"
]);
const UNUSABLE_PROVISION_STATES = /* @__PURE__ */ new Set([
	...DESTROYED_STATES,
	"deleting",
	"failed"
]);
const LEASE_ID_PATTERN = /^(?:cbx_|tbx_)[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/u;
const LEGACY_PROVISION_OPERATION_ID_PATTERN = /^provision:[a-f0-9]{64}$/u;
async function loadCrabboxConfigShow(params) {
	const result = await runCrabboxCommand({
		action: "config show",
		args: [
			"config",
			"show",
			"--json"
		],
		binary: params.binary,
		runCommand: params.runCommand,
		timeoutMs: CRABBOX_LIFECYCLE_TIMEOUT_MS
	});
	if (result.termination !== "exit" || result.code !== 0) throw permanentCrabboxCommandError("config show", result);
	try {
		return JSON.parse(result.stdout);
	} catch {
		throw new WorkerProviderError("Crabbox config show returned invalid JSON");
	}
}
async function assertAwsWorkerHasNoInstanceProfile(params) {
	const config = await loadCrabboxConfigShow(params);
	const instanceProfile = config && typeof config === "object" && !Array.isArray(config) ? config.aws?.instanceProfile : void 0;
	if (typeof instanceProfile !== "string") throw new WorkerProviderError("Crabbox config show returned an invalid AWS instance profile");
	if (normalizeOptionalString(instanceProfile)) throw new WorkerProviderError("Crabbox AWS instance profile must be empty for cloud workers");
}
async function assertHetznerDesktopHasManagedCoordinator(params) {
	const config = await loadCrabboxConfigShow(params);
	const view = isRecord(config) ? config : void 0;
	if (normalizeOptionalString(view?.coordinator) && view?.brokerMode === "managed") return;
	throw new WorkerProviderError("Crabbox Hetzner desktop profiles require a managed coordinator");
}
async function inspectWithContext(params) {
	const action = params.waitForReady ? "status" : "inspect";
	const result = await runCrabboxCommand({
		action,
		args: [
			action,
			"--provider",
			params.context.provider,
			"--network",
			"public",
			"--id",
			params.id,
			...params.waitForReady ? [
				"--wait",
				"--wait-timeout",
				"4m"
			] : [],
			"--json"
		],
		binary: params.context.binary,
		runCommand: params.runCommand,
		timeoutMs: params.timeoutMs ?? resolveCrabboxLifecycleTimeoutMs(params.context.provider)
	});
	if (result.termination === "exit" && result.code === 0) {
		let inspect;
		try {
			inspect = parseInspectJson(result.stdout);
		} catch (error) {
			throw new WorkerProviderError(error instanceof Error ? error.message : "Crabbox inspect returned invalid output");
		}
		if (params.expectedLeaseId && inspect.id !== params.expectedLeaseId) throw new WorkerProviderError("Crabbox inspect returned a different lease id");
		return {
			status: "found",
			inspect
		};
	}
	if (result.termination === "exit" && isAuthoritativeLeaseAbsence(result, params.id)) return { status: "unknown" };
	throw crabboxCommandError(action, result);
}
function remainingProvisionTimeout(deadline, maximum) {
	const remaining = deadline - Date.now();
	if (remaining <= 0) throw new Error("Crabbox provision exceeded its provider deadline");
	return Math.min(maximum, remaining);
}
const isTerminalState = (state) => DESTROYED_STATES.has(state.toLowerCase());
const isUnusableProvisionState = (state) => UNUSABLE_PROVISION_STATES.has(state.toLowerCase());
function leaseRunArgs(context, forwardedEnvNames = [], envProfilePath) {
	return [
		"run",
		"--provider",
		context.provider,
		"--network",
		"public",
		"--tailscale=false",
		"--id",
		context.id,
		"--keep=true",
		"--no-sync",
		...forwardedEnvNames.flatMap((name) => ["--allow-env", name]),
		...envProfilePath ? ["--env-from-profile", envProfilePath] : [],
		"--script-stdin"
	];
}
function assertProvisionSecurityPolicy(params) {
	if (params.inspect.tailscaleEnabled) throw new WorkerProviderError("Crabbox cloud worker lease must not have Tailscale enabled");
	const attached = params.inspect.awsInstanceProfileAttached;
	const pending = !params.inspect.ready && !isUnusableProvisionState(params.inspect.state);
	if (params.provider === "aws" && attached !== false && (attached || !pending)) throw new WorkerProviderError("Crabbox AWS inspect must attest that no instance profile is attached");
}
async function waitForProvisionReady(params) {
	let inspect = params.inspect;
	const inspectAgain = async () => {
		const replay = await inspectWithContext({
			context: {
				binary: params.binary,
				provider: params.provider
			},
			expectedLeaseId: inspect.id,
			id: inspect.id,
			runCommand: params.runCommand,
			timeoutMs: remainingProvisionTimeout(params.deadline, resolveCrabboxLifecycleTimeoutMs(params.provider)),
			waitForReady: params.provider === "machine0"
		});
		if (replay.status === "unknown") throw new Error("Crabbox operation lease disappeared while waiting for SSH readiness");
		return replay.inspect;
	};
	try {
		inspect = params.refresh ? await inspectAgain() : params.inspect;
		assertProvisionSecurityPolicy({
			inspect,
			provider: params.provider
		});
		while (inspect.ready !== true && !isUnusableProvisionState(inspect.state)) {
			const remaining = remainingProvisionTimeout(params.deadline, CRABBOX_LIFECYCLE_TIMEOUT_MS);
			await params.sleep(Math.min(resolveCrabboxReadyPollIntervalMs(params.provider), remaining));
			inspect = await inspectAgain();
			assertProvisionSecurityPolicy({
				inspect,
				provider: params.provider
			});
		}
		if (isUnusableProvisionState(inspect.state)) throw new WorkerProviderError("Crabbox operation lease entered a terminal state while waiting for SSH");
		return inspect;
	} catch (error) {
		if (error instanceof WorkerProviderError) return await failProvisionAfterCleanup({
			...params,
			id: inspect.id
		}, error);
		throw error;
	}
}
async function runProvisionSetupAndWaitReady(params) {
	try {
		const result = await withCrabboxWorkerEnvProfile(params.forwardedEnv, (names, profilePath, childEnv) => runCrabboxCommand({
			action: params.phase,
			args: leaseRunArgs({
				...params,
				id: params.inspect.id
			}, names, profilePath),
			binary: params.binary,
			env: childEnv,
			input: params.setup,
			runCommand: params.runCommand,
			timeoutMs: remainingProvisionTimeout(params.deadline, params.timeoutMs ?? 9e5)
		}));
		if (result.termination !== "exit" || result.code !== 0) throw permanentCrabboxCommandError(params.phase, result);
	} catch (error) {
		return await failProvisionAfterCleanup({
			...params,
			id: params.inspect.id
		}, error);
	}
	return await waitForProvisionReady({
		...params,
		refresh: true
	});
}
async function stopProvisionId(params) {
	await stopCrabboxLease({
		binary: params.binary,
		id: params.id,
		provider: params.provider,
		runCommand: params.runCommand,
		timeoutMs: resolveCrabboxLifecycleTimeoutMs(params.provider)
	});
}
async function failProvisionAfterCleanup(params, provisionError) {
	try {
		await stopProvisionId(params);
	} catch (cleanupError) {
		throw WorkerProviderError.cleanupIndeterminate(params.id, provisionError, cleanupError);
	}
	throw provisionError;
}
function transientAwsProfileCleanupError(profileError, action, cleanupError) {
	const message = `Crabbox AWS profile rejection cleanup is indeterminate during ${action}: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}; rejection: ${profileError.message}`;
	return new Error(truncateUtf16Safe(redactSensitiveText(message).replace(/\s+/gu, " "), MAX_ERROR_DETAIL_CHARS), { cause: cleanupError });
}
async function rejectAwsProfileAfterLeaseReconciliation(context, profileError, runCommand) {
	let inspected;
	let invalidInspect;
	try {
		inspected = await inspectWithContext({
			context,
			expectedLeaseId: context.id,
			id: context.id,
			runCommand
		});
	} catch (error) {
		if (!(error instanceof WorkerProviderError)) throw transientAwsProfileCleanupError(profileError, "inspect", error);
		invalidInspect = error;
	}
	if (!invalidInspect && inspected?.status === "unknown") throw profileError;
	try {
		await stopCrabboxLease({
			...context,
			runCommand
		});
	} catch (error) {
		if (!invalidInspect && inspected?.status === "found") throw WorkerProviderError.cleanupIndeterminate(context.id, profileError, error);
		throw transientAwsProfileCleanupError(profileError, "stop", invalidInspect ? new AggregateError([invalidInspect, error], "invalid inspect and stop failed") : error);
	}
	throw profileError;
}
function createCrabboxWorkerProvider(dependencies) {
	const wallpaperBase64 = loadCrabboxWorkerWallpaperBase64(dependencies.wallpaperPath);
	const runCommand = dependencies.runCommand ?? runCommandWithTimeout;
	const warn = dependencies.warn ?? (() => {});
	const sleep = dependencies.sleep ?? ((milliseconds) => new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	}));
	const openclawRoot = dependencies.openclawRoot ?? process.cwd();
	const heartbeats = createCrabboxHeartbeatManager({
		run: (context, signal) => runCrabboxCommand({
			action: "heartbeat",
			args: [
				"heartbeat",
				"--provider",
				context.provider,
				"--id",
				context.id,
				"--idle-timeout",
				context.idleTimeout,
				"--json"
			],
			binary: context.binary,
			runCommand,
			signal,
			timeoutMs: context.heartbeatTimeoutMs
		}),
		warn
	});
	let defaultBinary;
	const resolveBinary = (explicit) => {
		if (explicit) return explicit;
		defaultBinary ??= resolveCrabboxBinary({
			explicit,
			isExecutable: dependencies.isExecutable,
			openclawRoot,
			pathEnv: dependencies.pathEnv ?? process.env.PATH,
			platform: dependencies.platform
		});
		return defaultBinary;
	};
	const listMachineOptions = createCrabboxMachineOptionsResolver({
		resolveBinary,
		runCommand,
		warn
	});
	const warmImages = createCrabboxWarmImageManager({
		runCommand,
		runArgs: leaseRunArgs,
		warn
	});
	let warmLeases;
	const openWarmLeases = () => warmLeases ??= createPluginStateSyncKeyedStore("crabbox", {
		namespace: "warm-leases",
		maxEntries: 256,
		overflowPolicy: "evict-oldest"
	});
	const resolveLeaseContext = (lease) => {
		const profile = parseCrabboxProfile(lease.profile);
		if (!LEASE_ID_PATTERN.test(lease.leaseId)) throw new Error("Crabbox lease id is invalid");
		return {
			context: {
				binary: resolveBinary(profile.binary),
				heartbeatIntervalMs: profile.heartbeatIntervalMs,
				heartbeatTimeoutMs: profile.heartbeatTimeoutMs,
				id: lease.leaseId,
				idleTimeout: profile.idleTimeout,
				provider: profile.provider
			},
			profile
		};
	};
	return {
		id: CRABBOX_WORKER_PROVIDER_ID,
		dispose: () => heartbeats.dispose(),
		listMachineOptions,
		supportedExecutionModes: ["worker-turn", "remote-exec"],
		provisionBeforeInstallation: true,
		requiresNodeEnrollment: true,
		resolveProvisionTimeoutMs(profile) {
			return resolveCrabboxProvisionCallTimeoutMs(parseCrabboxProfile(profile));
		},
		async provision(profile, operationId, options) {
			const executionMode = options?.executionMode;
			if (executionMode !== void 0 && executionMode !== "worker-turn" && executionMode !== "remote-exec") throw new WorkerProviderError("Crabbox execution mode is unsupported");
			const { profile: parsed, forwardedEnv } = resolveCrabboxProvisionProfile(profile, options?.machineClass);
			const warmupTimeoutMs = parsed.desktop ? CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS : CRABBOX_WARMUP_TIMEOUT_MS;
			const deadline = Date.now() + resolveCrabboxProvisionBaseTimeoutMs(parsed);
			const setupDeadline = deadline + countCrabboxProvisionSetupPhases(parsed) * CRABBOX_SETUP_TIMEOUT_MS + CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS;
			if (!operationId.trim()) throw new Error("Crabbox provision requires an operation id");
			if (LEGACY_PROVISION_OPERATION_ID_PATTERN.test(operationId)) throw new WorkerProviderError("Legacy Crabbox provision state cannot be replayed safely; clean up any prior lease and dispatch again");
			const binary = resolveBinary(parsed.binary);
			const context = {
				binary,
				provider: parsed.provider
			};
			const leaseId = operationLeaseId(operationId);
			const slug = operationSlug(operationId);
			if (parsed.desktop && parsed.provider === "hetzner") await assertHetznerDesktopHasManagedCoordinator({
				binary,
				runCommand
			});
			if (parsed.provider === "aws") try {
				await assertAwsWorkerHasNoInstanceProfile({
					binary,
					runCommand
				});
			} catch (error) {
				if (!(error instanceof WorkerProviderError)) throw error;
				await rejectAwsProfileAfterLeaseReconciliation({
					binary,
					id: leaseId,
					provider: parsed.provider
				}, error, runCommand);
			}
			await warmImages.allocate({
				...context,
				id: leaseId,
				profile: parsed,
				slug,
				timeoutMs: () => remainingProvisionTimeout(deadline, warmupTimeoutMs)
			});
			let inspected;
			try {
				inspected = await inspectWithContext({
					context,
					expectedLeaseId: leaseId,
					id: leaseId,
					runCommand,
					timeoutMs: remainingProvisionTimeout(deadline, resolveCrabboxLifecycleTimeoutMs(parsed.provider)),
					waitForReady: parsed.provider === "machine0"
				});
			} catch (error) {
				if (error instanceof WorkerProviderError) return await failProvisionAfterCleanup({
					...context,
					id: leaseId,
					runCommand
				}, error);
				throw error;
			}
			if (inspected.status === "unknown") throw new Error("Crabbox warmup lease was not found during inspection");
			const inspectedParams = {
				...context,
				deadline,
				inspect: inspected.inspect,
				profile: parsed,
				runCommand
			};
			if (isUnusableProvisionState(inspected.inspect.state)) return await failProvisionAfterCleanup({
				...inspectedParams,
				id: leaseId
			}, new WorkerProviderError("Crabbox warmup lease entered a terminal state"));
			inspectedParams.inspect = await waitForProvisionReady({
				...inspectedParams,
				sleep
			});
			inspectedParams.deadline = setupDeadline;
			if (parsed.setup) inspectedParams.inspect = await runProvisionSetupAndWaitReady({
				...inspectedParams,
				phase: "profile setup",
				setup: parsed.setup,
				forwardedEnv,
				sleep
			});
			if (parsed.desktop) inspectedParams.inspect = await runProvisionSetupAndWaitReady({
				...inspectedParams,
				phase: "desktop setup",
				setup: createCrabboxWorkerDesktopSetup(leaseId, wallpaperBase64),
				sleep
			});
			const beginNodeEnrollment = options?.beginNodeEnrollment;
			if (!beginNodeEnrollment) return await failProvisionAfterCleanup({
				...inspectedParams,
				id: leaseId
			}, /* @__PURE__ */ new Error("Crabbox worker node enrollment is unavailable"));
			let enrollment;
			try {
				enrollment = await beginNodeEnrollment();
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") throw error;
				return await failProvisionAfterCleanup({
					...inspectedParams,
					id: leaseId
				}, error);
			}
			const nodeEnrollmentSetup = createCrabboxNodeEnrollmentSetup({
				enrollment,
				executionMode,
				leaseId
			});
			inspectedParams.inspect = await runProvisionSetupAndWaitReady({
				...inspectedParams,
				phase: "node enrollment setup",
				setup: nodeEnrollmentSetup.command,
				timeoutMs: CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS,
				...nodeEnrollmentSetup.forwardedEnv ? { forwardedEnv: nodeEnrollmentSetup.forwardedEnv } : {},
				sleep
			});
			let deviceId;
			try {
				deviceId = await enrollment.waitForDeviceId();
			} catch (error) {
				if (enrollment.signal?.aborted) throw error;
				const leaseContext = {
					...inspectedParams,
					id: leaseId
				};
				const evidence = await collectCrabboxNodeEnrollmentEvidence({
					...leaseContext,
					args: leaseRunArgs(leaseContext),
					...enrollment.signal ? { signal: enrollment.signal } : {}
				});
				enrollment.signal?.throwIfAborted();
				const message = error instanceof Error ? error.message : "Worker node enrollment failed";
				return await failProvisionAfterCleanup(leaseContext, new Error(`${message}; ${evidence}`, { cause: error }));
			}
			if (parsed.warmImage) openWarmLeases().register(leaseId, { machineClass: parsed.class });
			heartbeats.start({
				binary,
				heartbeatIntervalMs: parsed.heartbeatIntervalMs,
				heartbeatTimeoutMs: parsed.heartbeatTimeoutMs,
				id: leaseId,
				idleTimeout: parsed.idleTimeout,
				provider: parsed.provider
			});
			return {
				leaseId,
				node: { deviceId },
				sharedHost: false,
				...parsed.desktop ? { desktop: createCrabboxWorkerDesktopEndpoint() } : {}
			};
		},
		async inspect(lease) {
			const { context } = resolveLeaseContext(lease);
			const inspected = await inspectWithContext({
				context,
				expectedLeaseId: context.id,
				id: context.id,
				runCommand
			});
			if (inspected.status === "unknown") {
				heartbeats.stop(context.id);
				return { status: "unknown" };
			}
			if (isTerminalState(inspected.inspect.state)) {
				heartbeats.stop(context.id);
				return { status: "destroyed" };
			}
			heartbeats.start(context);
			return { status: "active" };
		},
		async destroy(lease) {
			const { context, profile } = resolveLeaseContext(lease);
			heartbeats.stop(context.id);
			if (profile.warmImage) {
				const machineClass = openWarmLeases().lookup(context.id)?.machineClass;
				await warmImages.capture({
					...context,
					profile: machineClass ? {
						...profile,
						class: machineClass
					} : profile,
					eligible: machineClass !== void 0
				});
			}
			await stopCrabboxLease({
				...context,
				runCommand,
				timeoutMs: resolveCrabboxLifecycleTimeoutMs(context.provider)
			});
			warmLeases?.delete(context.id);
		}
	};
}
//#endregion
//#region extensions/crabbox/index.ts
const workerWallpaperPath = fileURLToPath(new URL("./assets/openclaw-worker-wallpaper.png", import.meta.url));
var crabbox_default = definePluginEntry({
	id: "crabbox",
	name: "Crabbox Worker Provider",
	description: "Cloud worker provider backed by the Crabbox CLI",
	register(api) {
		const provider = createCrabboxWorkerProvider({
			openclawRoot: resolveOpenClawRoot(api.rootDir),
			wallpaperPath: workerWallpaperPath,
			warn: (message) => api.logger.warn(message)
		});
		api.registerWorkerProvider(provider);
		api.registerService({
			id: "crabbox-worker-cleanup",
			start() {},
			stop() {
				provider.dispose();
			}
		});
	}
});
//#endregion
export { crabbox_default as default };
