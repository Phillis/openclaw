import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { c as redactSensitiveText } from "../../redact-Cl7lwBnl.js";
import { r as runCommandWithTimeout } from "../../exec-BL80Wdzl.js";
import { t as WorkerProviderError } from "../../capability-provider.types-BtnrpVPK.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import "../../process-runtime-BTtGkRx5.js";
import "../../text-utility-runtime-LRU688AB.js";
import "../../logging-core-DsSMdQDP.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region extensions/crabbox/src/crabbox-worker-command-error.ts
const MAX_COMMAND_DETAIL_CHARS = 512;
function crabboxCommandDetail(result) {
	const raw = (result.stderr || result.stdout).trim();
	if (!raw) return "";
	const redacted = truncateUtf16Safe(redactSensitiveText(raw).replace(/\s+/gu, " "), MAX_COMMAND_DETAIL_CHARS);
	return redacted ? `: ${redacted}` : "";
}
function crabboxCommandError(action, result) {
	if (result.termination !== "exit") return /* @__PURE__ */ new Error(`Crabbox ${action} did not exit normally (${result.termination})`);
	const exitCode = result.code === null ? "unknown" : String(result.code);
	return /* @__PURE__ */ new Error(`Crabbox ${action} failed with exit code ${exitCode}${crabboxCommandDetail(result)}`);
}
function permanentCrabboxCommandError(action, result) {
	return new WorkerProviderError(crabboxCommandError(action, result).message);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-desktop-setup.ts
const CRABBOX_WORKER_BROWSER_PATH = "/usr/local/bin/openclaw-worker-browser";
const CRABBOX_WORKER_TERMINAL_PATH = "/usr/local/bin/openclaw-worker-terminal";
const CRABBOX_WORKER_BROWSER_CDP_PORT = 9222;
const SSH_USER_PATTERN = /^(?:root|[a-z_][a-z0-9_-]{0,31})$/u;
function resolveCrabboxWorkerHome(sshUser) {
	if (!SSH_USER_PATTERN.test(sshUser)) throw new WorkerProviderError("Crabbox inspect returned an invalid desktop SSH user");
	const home = sshUser === "root" ? "/root" : `/home/${sshUser}`;
	if (!path.posix.isAbsolute(home) || path.posix.normalize(home) !== home) throw new WorkerProviderError("Crabbox inspect returned an invalid desktop home path");
	return home;
}
function browserLauncher(home, browserProfilePath) {
	return [
		"#!/bin/bash",
		"set -euo pipefail",
		"[ \"$#\" -eq 0 ] || { echo \"openclaw-worker-browser does not accept arguments\" >&2; exit 64; }",
		"[ -r /var/lib/crabbox/desktop.env ] || { echo \"Crabbox desktop environment is unavailable\" >&2; exit 1; }",
		"[ -r /var/lib/crabbox/browser.env ] || { echo \"Crabbox browser environment is unavailable\" >&2; exit 1; }",
		". /var/lib/crabbox/desktop.env",
		". /var/lib/crabbox/browser.env",
		"[ \"${CRABBOX_DESKTOP_ENV:-}\" = \"xfce\" ] || { echo \"Crabbox desktop environment is not XFCE\" >&2; exit 1; }",
		"[ \"${DISPLAY:-}\" = \":99\" ] || { echo \"Crabbox XFCE display is not :99\" >&2; exit 1; }",
		`export HOME=${home}`,
		"export DISPLAY",
		`export CRABBOX_BROWSER_PROFILE=${browserProfilePath}`,
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
		"[ -r /var/lib/crabbox/desktop.env ] || { echo \"Crabbox desktop environment is unavailable\" >&2; exit 1; }",
		". /var/lib/crabbox/desktop.env",
		"[ \"${CRABBOX_DESKTOP_ENV:-}\" = \"xfce\" ] || { echo \"Crabbox desktop environment is not XFCE\" >&2; exit 1; }",
		"[ \"${DISPLAY:-}\" = \":99\" ] || { echo \"Crabbox XFCE display is not :99\" >&2; exit 1; }",
		"export DISPLAY",
		"nohup /usr/bin/xfce4-terminal >/dev/null 2>&1 </dev/null &",
		"terminal_pid=$!",
		"sleep 0.2",
		"if kill -0 \"$terminal_pid\" 2>/dev/null; then",
		"  exit 0",
		"fi",
		"wait \"$terminal_pid\""
	];
}
function workerWallpaper() {
	return [
		"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1920\" height=\"1080\" viewBox=\"0 0 1920 1080\">",
		"  <defs>",
		"    <pattern id=\"grid\" width=\"48\" height=\"48\" patternUnits=\"userSpaceOnUse\">",
		"      <path d=\"M48 0H0V48\" fill=\"none\" stroke=\"#7f8a83\" stroke-opacity=\"0.055\" stroke-width=\"1\"/>",
		"    </pattern>",
		"  </defs>",
		"  <rect width=\"1920\" height=\"1080\" fill=\"#111512\"/>",
		"  <rect width=\"1920\" height=\"1080\" fill=\"url(#grid)\"/>",
		"  <g transform=\"translate(780 360) scale(3)\" fill=\"#d5d9d6\" fill-opacity=\"0.13\" stroke=\"#eef0ef\" stroke-opacity=\"0.16\">",
		"    <path d=\"M60 10C30 10 15 35 15 55s15 40 30 45v10h10v-10c0 0 5 2 10 0v10h10v-10c15-5 30-25 30-45S90 10 60 10Z\"/>",
		"    <path d=\"M20 45C5 40 0 50 5 60s15 5 20-5c3-7 0-10-5-10Z\"/>",
		"    <path d=\"M100 45c15-5 20 5 15 15s-15 5-20-5c-3-7 0-10 5-10Z\"/>",
		"    <path d=\"M45 15Q35 5 30 8M75 15Q85 5 90 8\" fill=\"none\" stroke-linecap=\"round\" stroke-width=\"3\"/>",
		"    <circle cx=\"45\" cy=\"35\" r=\"6\" fill=\"#111512\" stroke=\"none\"/>",
		"    <circle cx=\"75\" cy=\"35\" r=\"6\" fill=\"#111512\" stroke=\"none\"/>",
		"  </g>",
		"  <text x=\"960\" y=\"790\" text-anchor=\"middle\" fill=\"#cbd0cc\" fill-opacity=\"0.42\" font-family=\"ui-monospace, SFMono-Regular, Menlo, monospace\" font-size=\"24\" letter-spacing=\"8\">OPENCLAW WORKER</text>",
		"</svg>"
	];
}
function heredoc(target, marker, contents) {
	return [
		`cat >"$setup_dir/${target}" <<'${marker}'`,
		...contents,
		marker
	];
}
function buildCrabboxWorkerDesktopSetup(sshUser) {
	const home = resolveCrabboxWorkerHome(sshUser);
	const browserProfilePath = `${home}/.cache/openclaw/worker-browser`;
	const wallpaperPath = `${home}/.local/share/backgrounds/openclaw-worker.svg`;
	return [
		"set -euo pipefail",
		`ssh_user=${sshUser}`,
		`ssh_home=${home}`,
		"[ \"$(id -un)\" = \"$ssh_user\" ] || { echo \"Crabbox setup did not run as the advertised SSH user\" >&2; exit 1; }",
		"passwd_home=$(getent passwd \"$ssh_user\" | cut -d: -f6)",
		"[ \"$passwd_home\" = \"$ssh_home\" ] || { echo \"Crabbox SSH user home does not match the worker desktop contract\" >&2; exit 1; }",
		"ssh_group=$(id -gn \"$ssh_user\")",
		"as_root() { if [ \"$(id -u)\" -eq 0 ]; then \"$@\"; else sudo -n -- \"$@\"; fi; }",
		"[ -r /var/lib/crabbox/desktop.env ] || { echo \"Crabbox desktop environment is unavailable\" >&2; exit 1; }",
		". /var/lib/crabbox/desktop.env",
		"[ \"${CRABBOX_DESKTOP_ENV:-}\" = \"xfce\" ] || { echo \"Crabbox desktop environment is not XFCE\" >&2; exit 1; }",
		"[ \"${DISPLAY:-}\" = \":99\" ] || { echo \"Crabbox XFCE display is not :99\" >&2; exit 1; }",
		"export DISPLAY",
		"for required_command in xfconf-query curl flock; do command -v \"$required_command\" >/dev/null 2>&1 || { echo \"Required Crabbox desktop command is unavailable: $required_command\" >&2; exit 1; }; done",
		"setup_dir=$(mktemp -d)",
		"trap 'rm -rf -- \"$setup_dir\"' EXIT",
		...heredoc("browser", "WORKER_BROWSER_LAUNCHER_EOF", browserLauncher(home, browserProfilePath)),
		...heredoc("terminal", "WORKER_TERMINAL_LAUNCHER_EOF", terminalLauncher()),
		...heredoc("wallpaper.svg", "WORKER_WALLPAPER_EOF", workerWallpaper()),
		`as_root install -o root -g root -m 0755 "$setup_dir/browser" ${CRABBOX_WORKER_BROWSER_PATH}`,
		`as_root install -o root -g root -m 0755 "$setup_dir/terminal" ${CRABBOX_WORKER_TERMINAL_PATH}`,
		"as_root install -d -o \"$ssh_user\" -g \"$ssh_group\" -m 0755 \"$ssh_home/.cache\" \"$ssh_home/.cache/openclaw\"",
		`as_root install -d -o "$ssh_user" -g "$ssh_group" -m 0700 ${browserProfilePath}`,
		"as_root install -d -o \"$ssh_user\" -g \"$ssh_group\" -m 0755 \"$ssh_home/.local\" \"$ssh_home/.local/share\" \"$ssh_home/.local/share/backgrounds\"",
		`as_root install -o "$ssh_user" -g "$ssh_group" -m 0644 "$setup_dir/wallpaper.svg" ${wallpaperPath}`,
		"mapfile -t backdrop_roots < <(xfconf-query -c xfce4-desktop -l | sed -n 's#\\(/backdrop/[^/]*/[^/]*/workspace[^/]*\\)/.*#\\1#p' | sort -u)",
		"[ \"${#backdrop_roots[@]}\" -gt 0 ] || { echo \"XFCE did not advertise any desktop backdrops\" >&2; exit 1; }",
		"for backdrop in \"${backdrop_roots[@]}\"; do",
		`  xfconf-query -c xfce4-desktop -p "$backdrop/last-image" -s ${wallpaperPath} || xfconf-query -c xfce4-desktop -p "$backdrop/last-image" -n -t string -s ${wallpaperPath}`,
		"  xfconf-query -c xfce4-desktop -p \"$backdrop/image-style\" -s 5 || xfconf-query -c xfce4-desktop -p \"$backdrop/image-style\" -n -t int -s 5",
		"done"
	].join("\n");
}
function createCrabboxWorkerDesktopEndpoint(sshUser) {
	resolveCrabboxWorkerHome(sshUser);
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
async function provisionCrabboxWorkerDesktop(enabled, sshUser, current, stopInvalid, run) {
	if (!enabled) return current;
	let setup;
	try {
		setup = buildCrabboxWorkerDesktopSetup(sshUser);
	} catch (error) {
		if (error instanceof WorkerProviderError) await stopInvalid();
		throw error;
	}
	return await run(setup);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-profile.ts
const PROFILE_KEYS = /* @__PURE__ */ new Set([
	"binary",
	"class",
	"desktop",
	"idleTimeout",
	"provider",
	"setup",
	"ttl"
]);
const GO_DURATION_PATTERN = /^\+?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:ns|us|µs|μs|ms|s|m|h))+$/u;
const GO_DURATION_TOKEN_PATTERN = /(\d+(?:\.\d*)?|\.\d+)(ns|us|µs|μs|ms|s|m|h)/gu;
const MAX_GO_DURATION_NANOSECONDS = 9223372036854775807n;
const CRABBOX_LEASE_ID_DOMAIN = "openclaw:crabbox-worker-lease-id:v1\0";
const DURATION_UNIT_NANOSECONDS = {
	h: 3600000000000n,
	m: 60000000000n,
	s: 1000000000n,
	ms: 1000000n,
	us: 1000n,
	µs: 1000n,
	μs: 1000n,
	ns: 1n
};
function requirePositiveDuration(value, key) {
	const duration = normalizeOptionalString(value);
	if (!duration || !isPositiveGoDuration(duration)) throw new WorkerProviderError(`Crabbox profile ${key} must be a positive Go duration such as 60m`);
	return duration;
}
function isPositiveGoDuration(duration) {
	if (!GO_DURATION_PATTERN.test(duration)) return false;
	let total = 0n;
	for (const match of duration.matchAll(GO_DURATION_TOKEN_PATTERN)) {
		const numberText = match[1];
		const unit = match[2] ? DURATION_UNIT_NANOSECONDS[match[2]] : void 0;
		if (!numberText || unit === void 0) return false;
		const [wholeText = "", fractionText = ""] = numberText.split(".", 2);
		const whole = wholeText.replace(/^0+/u, "") || "0";
		if (whole.length > 19) return false;
		total += BigInt(whole) * unit;
		const fraction = fractionText.slice(0, 18);
		if (fraction) total += BigInt(fraction) * unit / 10n ** BigInt(fraction.length);
		if (total > MAX_GO_DURATION_NANOSECONDS) return false;
	}
	return total > 0n;
}
function parseCrabboxProfile(profile) {
	for (const key of Object.keys(profile)) if (!PROFILE_KEYS.has(key)) throw new WorkerProviderError(`unknown Crabbox profile setting: ${key}`);
	const provider = normalizeOptionalString(profile.provider)?.toLowerCase();
	const machineClass = normalizeOptionalString(profile.class);
	if (!provider) throw new WorkerProviderError("Crabbox profile provider must be a non-empty string");
	if (!machineClass) throw new WorkerProviderError("Crabbox profile class must be a non-empty string");
	const ttl = requirePositiveDuration(profile.ttl, "ttl");
	const idleTimeout = requirePositiveDuration(profile.idleTimeout, "idleTimeout");
	const binaryValue = profile.binary;
	const binary = binaryValue === void 0 ? void 0 : normalizeOptionalString(binaryValue);
	if (binaryValue !== void 0 && !binary) throw new WorkerProviderError("Crabbox profile binary must be a non-empty string");
	if (binary && !path.isAbsolute(binary)) throw new WorkerProviderError("Crabbox profile binary must be an absolute path");
	const setupValue = profile.setup;
	const setup = setupValue === void 0 ? void 0 : normalizeOptionalString(setupValue);
	if (setupValue !== void 0 && !setup) throw new WorkerProviderError("Crabbox profile setup must be a non-empty command string");
	const desktop = profile.desktop;
	if (desktop !== void 0 && typeof desktop !== "boolean") throw new WorkerProviderError("Crabbox profile desktop must be a boolean");
	return {
		binary,
		class: machineClass,
		desktop,
		idleTimeout,
		provider,
		setup,
		ttl
	};
}
function buildCrabboxWarmupArgs(profile, leaseId, slug) {
	const args = [
		"warmup",
		"--provider",
		profile.provider,
		"--network",
		"public",
		"--tailscale=false",
		"--class",
		profile.class,
		"--ttl",
		profile.ttl,
		"--idle-timeout",
		profile.idleTimeout,
		"--lease-id",
		leaseId,
		"--slug",
		slug,
		"--keep=true"
	];
	if (profile.desktop) args.push("--desktop", "--browser");
	return args;
}
function defaultIsExecutable(candidate, platform) {
	try {
		if (!fs.statSync(candidate).isFile()) return false;
		fs.accessSync(candidate, platform === "win32" ? fs.constants.F_OK : fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function binaryCandidates(base, platform) {
	return platform === "win32" ? [
		".exe",
		".cmd",
		".bat",
		".com",
		""
	].map((suffix) => `${base}${suffix}`) : [base];
}
function resolveCrabboxBinary(params) {
	if (params.explicit) return params.explicit;
	const platform = params.platform ?? process.platform;
	const isExecutable = params.isExecutable ?? ((candidate) => defaultIsExecutable(candidate, platform));
	const siblingBase = path.resolve(params.openclawRoot, "../crabbox/bin/crabbox");
	for (const candidate of binaryCandidates(siblingBase, platform)) if (isExecutable(candidate)) return candidate;
	const delimiter = platform === "win32" ? ";" : ":";
	const executableNames = binaryCandidates("crabbox", platform);
	for (const directory of (params.pathEnv ?? "").split(delimiter)) {
		if (!directory) continue;
		for (const name of executableNames) {
			const candidate = path.resolve(directory, name);
			if (isExecutable(candidate)) return candidate;
		}
	}
	return "crabbox";
}
function resolveOpenClawRoot(pluginRoot) {
	if (!pluginRoot) return process.cwd();
	const extensionsDir = path.dirname(pluginRoot);
	if (path.basename(extensionsDir) !== "extensions") return process.cwd();
	const extensionParent = path.dirname(extensionsDir);
	return path.basename(extensionParent) === "dist" || path.basename(extensionParent) === "dist-runtime" ? path.dirname(extensionParent) : extensionParent;
}
function operationSlug(operationId) {
	return `openclaw-${createHash("sha256").update(operationId).digest("hex").slice(0, 32)}`;
}
function operationLeaseId(operationId) {
	return `cbx_${createHash("sha256").update(CRABBOX_LEASE_ID_DOMAIN).update(operationId).digest("hex").slice(0, 12)}`;
}
function identityRefId(leaseId) {
	return `/leases/${leaseId}/identity`;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-inspect.ts
const MAX_SSH_FALLBACK_PORTS = 10;
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
	const sshHost = inspectString(value.sshHost, "sshHost");
	const fallbackHost = inspectString(value.host, "host");
	const host = sshHost ?? fallbackHost;
	const sshUser = inspectString(value.sshUser, "sshUser");
	const sshHostKey = inspectString(value.sshHostKey, "sshHostKey");
	const sshKey = inspectString(value.sshKey, "sshKey");
	const sshPort = inspectPort(value.sshPort);
	return {
		id,
		state,
		tailscaleEnabled,
		sshFallbackPorts: inspectFallbackPorts(value.sshFallbackPorts, sshPort),
		...awsInstanceProfileAttached !== void 0 ? { awsInstanceProfileAttached } : {},
		...host ? { host } : {},
		...sshUser ? { sshUser } : {},
		...sshHostKey ? { sshHostKey } : {},
		...sshKey ? { sshKey } : {},
		...sshPort ? { sshPort } : {},
		...typeof value.ready === "boolean" ? { ready: value.ready } : {}
	};
}
function inspectString(value, field) {
	if (value === void 0) return;
	if (typeof value !== "string") throw new Error(`Crabbox inspect returned an invalid ${field}`);
	return normalizeOptionalString(value);
}
function inspectPort(value) {
	if (value === void 0 || value === "") return;
	return inspectRequiredPort(value, "sshPort");
}
function inspectFallbackPorts(value, primaryPort) {
	if (value === void 0) return [];
	if (!Array.isArray(value)) throw new Error("Crabbox inspect returned invalid sshFallbackPorts");
	const seen = new Set(primaryPort === void 0 ? [] : [primaryPort]);
	const ports = [];
	for (const entry of value) {
		const port = inspectRequiredPort(entry, "sshFallbackPorts");
		if (!seen.has(port)) {
			seen.add(port);
			ports.push(port);
		}
	}
	if (ports.length > MAX_SSH_FALLBACK_PORTS) throw new Error("Crabbox inspect returned invalid sshFallbackPorts: maximum 10");
	return ports;
}
function inspectRequiredPort(value, field) {
	if (typeof value !== "number" && (typeof value !== "string" || !/^\d+$/u.test(value))) throw new Error(`Crabbox inspect returned an invalid ${field}`);
	const port = typeof value === "number" ? value : Number(value);
	if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Crabbox inspect returned an invalid ${field}`);
	return port;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-timeouts.ts
const CRABBOX_WARMUP_TIMEOUT_MS = 24e4;
const CRABBOX_LIFECYCLE_TIMEOUT_MS = 6e4;
const CRABBOX_PROVISION_TIMEOUT_MS = 29e4;
const CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS = 50 * 6e4;
const CRABBOX_DESKTOP_PROVISION_TIMEOUT_MS = 306e4;
const CRABBOX_SETUP_TIMEOUT_MS = 3e5;
function resolveCrabboxProvisionBaseTimeoutMs(profile) {
	return profile.desktop ? CRABBOX_DESKTOP_PROVISION_TIMEOUT_MS : CRABBOX_PROVISION_TIMEOUT_MS;
}
function countCrabboxProvisionSetupPhases(profile) {
	return Number(Boolean(profile.desktop)) + Number(Boolean(profile.setup));
}
function resolveCrabboxProvisionCallTimeoutMs(profile) {
	return resolveCrabboxProvisionBaseTimeoutMs(profile) + countCrabboxProvisionSetupPhases(profile) * CRABBOX_SETUP_TIMEOUT_MS + CRABBOX_LIFECYCLE_TIMEOUT_MS;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-provider.ts
const CRABBOX_WORKER_PROVIDER_ID = "crabbox";
const CRABBOX_KEY_REF_PROVIDER = "crabbox";
const READY_POLL_INTERVAL_MS = 2e3;
const MAX_OUTPUT_BYTES = 64 * 1024;
const MAX_ERROR_DETAIL_CHARS = 512;
const MAX_HOST_KEY_LENGTH = 16384;
const OPENSSH_HOST_KEY_TYPE_PATTERN = /^(?:ssh|ecdsa-sha2|sk-(?:ssh|ecdsa-sha2))-[A-Za-z0-9@._+-]+$/u;
const OPENSSH_HOST_KEY_DATA_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/u;
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
async function assertAwsWorkerHasNoInstanceProfile(params) {
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
	let instanceProfile;
	try {
		const config = JSON.parse(result.stdout);
		instanceProfile = config && typeof config === "object" && !Array.isArray(config) ? config.aws?.instanceProfile : void 0;
	} catch {
		throw new WorkerProviderError("Crabbox config show returned invalid JSON");
	}
	if (typeof instanceProfile !== "string") throw new WorkerProviderError("Crabbox config show returned an invalid AWS instance profile");
	if (normalizeOptionalString(instanceProfile)) throw new WorkerProviderError("Crabbox AWS instance profile must be empty for cloud workers");
}
function provisionProfileError(result) {
	if (result.termination !== "exit") return;
	const output = `${result.stderr}\n${result.stdout}`;
	if (/\bprovider=\S+\s+does not support fixed idempotent lease IDs\b/u.test(output) || /(?:unknown|unrecognized) (?:flag|option)[^\r\n]*--lease-id/iu.test(output) || /flag provided but not defined:\s*-lease-id/iu.test(output)) return new WorkerProviderError("Crabbox 0.41.1 or newer with fixed lease ID support is required");
	if (/\blease_id_conflict\b/u.test(output) && !/\bretry after provider inventory converges\b/iu.test(output)) return permanentCrabboxCommandError("warmup", result);
	if (result.code !== 2) return;
	if (/\bunknown provider\s+"[^"\r\n]+"/u.test(output)) return new WorkerProviderError("Crabbox profile provider is not supported by this Crabbox binary");
	if (/\bprovider=\S+\s+does not support warmup\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider does not support warmup");
	if (/\bprovider=\S+.*\bdoes not support status\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider does not support worker leases");
	if (/\bprovider=\S+\s+does not expose persistent status\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider does not support worker leases");
	if (/\bprovider=\S+\s+is one-shot; use crabbox run\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider is run-only");
	if (/\bprovider=\S+\s+requires module source; use crabbox run --script\b/u.test(output)) return new WorkerProviderError("Crabbox profile provider requires a run script");
	if (/--class is not supported for provider=\S+/u.test(output)) return new WorkerProviderError("Crabbox profile class is not supported by its provider");
}
function authoritativeLeaseAbsence(result, identifier) {
	const output = `${result.stderr}\n${result.stdout}`;
	if (!output.includes(identifier)) return false;
	if (/\b(?:access\s+denied|authentication|authorization|credentials?|forbidden|permission|token|unauthorized)\b/iu.test(output)) return false;
	return result.code === 4 && /\b(?:was\s+)?not found\b/iu.test(output) || result.code === 4 && /\bno longer exists\b/iu.test(output) || result.code === 4 && /\b(?:points to|is bound to) (?:a )?missing (?:instance|sandbox)\b/iu.test(output) || result.code === 4 && /\bdisappeared before release\b/iu.test(output) || result.code === 4 && /\bunknown blacksmith testbox(?:\s|:)/iu.test(output) || result.code === 4 && /\bis not claimed by Crabbox\b/iu.test(output) || result.code === 4 && /\bwandb sandbox "[^"\r\n]+" has no matching local ownership claim\b/iu.test(output) || result.code === 5 && /\bcoder workspace "[^"\r\n]+" not found\b/iu.test(output) || /\bcoordinator GET \S*\/v1\/leases\/\S+:\s*http 404\b/iu.test(output) || result.code === 4 && /\bunknown lease(?:\s|:)/iu.test(output);
}
function alreadyStopped(result, identifier) {
	const output = `${result.stderr}\n${result.stdout}`;
	return output.includes(identifier) && /\balready (?:destroyed|released|stopped|terminated)\b/iu.test(output);
}
async function runCrabboxCommand(params) {
	try {
		return await params.runCommand([params.binary, ...params.args], {
			timeoutMs: params.timeoutMs,
			maxOutputBytes: MAX_OUTPUT_BYTES,
			killProcessTree: true
		});
	} catch {
		throw new Error(`Crabbox ${params.action} could not start`);
	}
}
function requireHostKey(value) {
	if (value.length > MAX_HOST_KEY_LENGTH || /[\r\n]/u.test(value)) throw new WorkerProviderError("Crabbox inspect returned an invalid SSH host key");
	const tokens = value.trim().split(/[ \t]+/u);
	const [keyType, keyData] = tokens;
	if (tokens.length !== 2 || !OPENSSH_HOST_KEY_TYPE_PATTERN.test(keyType ?? "") || !OPENSSH_HOST_KEY_DATA_PATTERN.test(keyData ?? "") || (keyData?.length ?? 0) % 4 !== 0) throw new WorkerProviderError("Crabbox inspect returned an invalid SSH host key");
	return `${keyType} ${keyData}`;
}
async function inspectWithContext(params) {
	const result = await runCrabboxCommand({
		action: "inspect",
		args: [
			"inspect",
			"--provider",
			params.context.provider,
			"--network",
			"public",
			"--id",
			params.id,
			"--json"
		],
		binary: params.context.binary,
		runCommand: params.runCommand,
		timeoutMs: params.timeoutMs ?? 6e4
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
	if (result.termination === "exit" && authoritativeLeaseAbsence(result, params.id)) return { status: "unknown" };
	throw crabboxCommandError("inspect", result);
}
function remainingProvisionTimeout(deadline, maximum) {
	const remaining = deadline - Date.now();
	if (remaining <= 0) throw new Error("Crabbox provision exceeded its provider deadline");
	return Math.min(maximum, remaining);
}
async function stopWithContext(params) {
	const result = await runCrabboxCommand({
		action: "stop",
		args: [
			"stop",
			"--provider",
			params.context.provider,
			"--id",
			params.context.id
		],
		binary: params.context.binary,
		runCommand: params.runCommand,
		timeoutMs: params.timeoutMs ?? 6e4
	});
	if (result.termination === "exit" && result.code === 0) return;
	if (result.termination === "exit" && (authoritativeLeaseAbsence(result, params.context.id) || alreadyStopped(result, params.context.id))) return;
	throw crabboxCommandError("stop", result);
}
const isTerminalState = (state) => DESTROYED_STATES.has(state.toLowerCase());
const isUnusableProvisionState = (state) => UNUSABLE_PROVISION_STATES.has(state.toLowerCase());
function leaseFromInspect(inspect, profile) {
	if (isTerminalState(inspect.state)) throw new WorkerProviderError("Crabbox operation lease is no longer active");
	if (inspect.ready !== true) throw new Error("Crabbox operation lease is not ready");
	if (!inspect.host || !inspect.sshUser || !inspect.sshPort || !inspect.sshKey) throw new WorkerProviderError("Crabbox profile provider does not expose a complete SSH worker endpoint");
	if (!inspect.sshHostKey) throw new WorkerProviderError("Crabbox inspect does not expose the SSH host key required by the worker provider contract");
	return {
		leaseId: inspect.id,
		ssh: {
			host: inspect.host,
			port: inspect.sshPort,
			fallbackPorts: inspect.sshFallbackPorts,
			user: inspect.sshUser,
			hostKey: requireHostKey(inspect.sshHostKey),
			keyRef: {
				source: "file",
				provider: CRABBOX_KEY_REF_PROVIDER,
				id: identityRefId(inspect.id)
			}
		},
		...profile.desktop ? { desktop: createCrabboxWorkerDesktopEndpoint(inspect.sshUser) } : {}
	};
}
async function leaseFromProvisionInspect(params) {
	try {
		assertProvisionSecurityPolicy(params);
		return leaseFromInspect(params.inspect, params.profile);
	} catch (error) {
		if (error instanceof WorkerProviderError) await stopProvisionInspect(params);
		throw error;
	}
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
			timeoutMs: remainingProvisionTimeout(params.deadline, CRABBOX_LIFECYCLE_TIMEOUT_MS)
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
			await params.sleep(Math.min(READY_POLL_INTERVAL_MS, remaining));
			inspect = await inspectAgain();
			assertProvisionSecurityPolicy({
				inspect,
				provider: params.provider
			});
		}
		if (isUnusableProvisionState(inspect.state)) throw new WorkerProviderError("Crabbox operation lease entered a terminal state while waiting for SSH");
		return inspect;
	} catch (error) {
		if (error instanceof WorkerProviderError) await stopProvisionInspect({
			...params,
			inspect
		});
		throw error;
	}
}
async function runProvisionSetup(params) {
	let result;
	try {
		result = await runCrabboxCommand({
			action: "setup",
			args: [
				"run",
				"--provider",
				params.provider,
				"--network",
				"public",
				"--tailscale=false",
				"--id",
				params.inspect.id,
				"--keep=true",
				"--no-sync",
				"--",
				"bash",
				"-lc",
				params.setup
			],
			binary: params.binary,
			runCommand: params.runCommand,
			timeoutMs: remainingProvisionTimeout(params.deadline, CRABBOX_SETUP_TIMEOUT_MS)
		});
	} catch (error) {
		await stopProvisionInspect(params);
		throw error;
	}
	if (result.termination === "exit" && result.code === 0) return;
	const error = permanentCrabboxCommandError("setup", result);
	await stopProvisionInspect(params);
	throw error;
}
async function runProvisionSetupAndWaitReady(params) {
	await runProvisionSetup(params);
	return await waitForProvisionReady({
		...params,
		refresh: true
	});
}
async function stopProvisionInspect(params) {
	await stopProvisionId({
		...params,
		id: params.inspect.id
	});
}
async function stopProvisionId(params) {
	await stopWithContext({
		context: {
			binary: params.binary,
			id: params.id,
			provider: params.provider
		},
		runCommand: params.runCommand,
		timeoutMs: CRABBOX_LIFECYCLE_TIMEOUT_MS
	});
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
		await stopWithContext({
			context,
			runCommand
		});
	} catch (error) {
		throw transientAwsProfileCleanupError(profileError, "stop", invalidInspect ? new AggregateError([invalidInspect, error], "invalid inspect and stop failed") : error);
	}
	throw profileError;
}
function createCrabboxWorkerProvider(dependencies = {}) {
	const runCommand = dependencies.runCommand ?? runCommandWithTimeout;
	const sleep = dependencies.sleep ?? ((milliseconds) => new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	}));
	const openclawRoot = dependencies.openclawRoot ?? process.cwd();
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
	const resolveLeaseContext = (lease) => {
		const parsed = parseCrabboxProfile(lease.profile);
		if (!LEASE_ID_PATTERN.test(lease.leaseId)) throw new Error("Crabbox lease id is invalid");
		return {
			binary: resolveBinary(parsed.binary),
			id: lease.leaseId,
			provider: parsed.provider
		};
	};
	return {
		id: CRABBOX_WORKER_PROVIDER_ID,
		resolveProvisionTimeoutMs(profile) {
			return resolveCrabboxProvisionCallTimeoutMs(parseCrabboxProfile(profile));
		},
		async provision(profile, operationId) {
			const parsed = parseCrabboxProfile(profile);
			const warmupTimeoutMs = parsed.desktop ? CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS : CRABBOX_WARMUP_TIMEOUT_MS;
			const deadline = Date.now() + resolveCrabboxProvisionBaseTimeoutMs(parsed);
			const setupDeadline = deadline + countCrabboxProvisionSetupPhases(parsed) * CRABBOX_SETUP_TIMEOUT_MS;
			if (!operationId.trim()) throw new Error("Crabbox provision requires an operation id");
			if (LEGACY_PROVISION_OPERATION_ID_PATTERN.test(operationId)) throw new WorkerProviderError("Legacy Crabbox provision state cannot be replayed safely; clean up any prior lease and dispatch again");
			const binary = resolveBinary(parsed.binary);
			const context = {
				binary,
				provider: parsed.provider
			};
			const leaseId = operationLeaseId(operationId);
			const slug = operationSlug(operationId);
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
			const warmup = await runCrabboxCommand({
				action: "warmup",
				args: buildCrabboxWarmupArgs(parsed, leaseId, slug),
				binary,
				runCommand,
				timeoutMs: remainingProvisionTimeout(deadline, warmupTimeoutMs)
			});
			if (warmup.termination !== "exit" || warmup.code !== 0) {
				const profileError = provisionProfileError(warmup);
				if (profileError) throw profileError;
				throw crabboxCommandError("warmup", warmup);
			}
			let inspected;
			try {
				inspected = await inspectWithContext({
					context,
					expectedLeaseId: leaseId,
					id: leaseId,
					runCommand,
					timeoutMs: remainingProvisionTimeout(deadline, CRABBOX_LIFECYCLE_TIMEOUT_MS)
				});
			} catch (error) {
				if (error instanceof WorkerProviderError) await stopProvisionId({
					binary,
					id: leaseId,
					provider: parsed.provider,
					runCommand
				});
				throw error;
			}
			if (inspected.status === "unknown") throw new Error("Crabbox warmup lease was not found during inspection");
			const inspectedParams = {
				binary,
				deadline,
				inspect: inspected.inspect,
				profile: parsed,
				provider: parsed.provider,
				runCommand
			};
			if (isUnusableProvisionState(inspected.inspect.state)) {
				await stopProvisionInspect(inspectedParams);
				throw new WorkerProviderError("Crabbox warmup lease entered a terminal state");
			}
			inspectedParams.inspect = await waitForProvisionReady({
				...inspectedParams,
				sleep
			});
			inspectedParams.deadline = setupDeadline;
			inspectedParams.inspect = await provisionCrabboxWorkerDesktop(parsed.desktop === true, inspectedParams.inspect.sshUser ?? "", inspectedParams.inspect, () => stopProvisionInspect(inspectedParams), (setup) => runProvisionSetupAndWaitReady({
				...inspectedParams,
				setup,
				sleep
			}));
			if (parsed.setup) inspectedParams.inspect = await runProvisionSetupAndWaitReady({
				...inspectedParams,
				setup: parsed.setup,
				sleep
			});
			return await leaseFromProvisionInspect(inspectedParams);
		},
		async inspect(lease) {
			const context = resolveLeaseContext(lease);
			const inspected = await inspectWithContext({
				context,
				expectedLeaseId: context.id,
				id: context.id,
				runCommand
			});
			if (inspected.status === "unknown") return { status: "unknown" };
			return { status: isTerminalState(inspected.inspect.state) ? "destroyed" : "active" };
		},
		async resolveSshIdentity(request) {
			const context = resolveLeaseContext(request);
			if (request.keyRef.source !== "file" || request.keyRef.provider !== CRABBOX_KEY_REF_PROVIDER || request.keyRef.id !== identityRefId(context.id)) throw new Error("Crabbox worker identity reference does not match its lease");
			const inspected = await inspectWithContext({
				context,
				expectedLeaseId: context.id,
				id: context.id,
				runCommand
			});
			if (inspected.status === "unknown" || isTerminalState(inspected.inspect.state) || !inspected.inspect.sshKey) throw new Error("Crabbox inspect did not return the worker identity path");
			if (!path.isAbsolute(inspected.inspect.sshKey)) throw new Error("Crabbox inspect returned a non-absolute worker identity path");
			return {
				kind: "path",
				path: inspected.inspect.sshKey
			};
		},
		async destroy(lease) {
			await stopWithContext({
				context: resolveLeaseContext(lease),
				runCommand
			});
		}
	};
}
//#endregion
//#region extensions/crabbox/index.ts
var crabbox_default = definePluginEntry({
	id: "crabbox",
	name: "Crabbox Worker Provider",
	description: "Cloud worker provider backed by the Crabbox CLI",
	register(api) {
		api.registerWorkerProvider(createCrabboxWorkerProvider({ openclawRoot: resolveOpenClawRoot(api.rootDir) }));
	}
});
//#endregion
export { crabbox_default as default };
