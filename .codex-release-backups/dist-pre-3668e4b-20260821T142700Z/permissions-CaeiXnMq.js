import { t as normalizeLowercaseStringOrEmpty } from "./string-coerce-DTQhjyM_.js";
import { t as getNativeBinding } from "./native-Blu24Mu6.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/permission-exec.js
const execFileAsync = promisify(execFile);
const DEFAULT_PERMISSION_EXEC_TIMEOUT_MS = 3e4;
async function executePermissionCommand(command, args, timeoutMs = DEFAULT_PERMISSION_EXEC_TIMEOUT_MS) {
	try {
		return await execFileAsync(command, args, {
			encoding: "utf8",
			windowsHide: true,
			maxBuffer: 1024 * 1024,
			timeout: timeoutMs,
			killSignal: "SIGKILL"
		});
	} catch (err) {
		if (err && typeof err === "object" && "killed" in err && err.killed === true && "signal" in err && err.signal === "SIGKILL") throw new Error(`Windows permission inspection timed out after ${timeoutMs}ms`, { cause: err });
		throw err;
	}
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/windows-command.js
function getEnvValueCaseInsensitive(env, name) {
	const direct = env[name];
	if (direct !== void 0) return direct;
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(env)) if (key.toLowerCase() === lower) return value;
}
function normalizeWindowsInstallRoot(value) {
	const trimmed = value?.trim();
	if (!trimmed || !path.win32.isAbsolute(trimmed)) return null;
	let end = trimmed.length;
	while (end > 0 && (trimmed[end - 1] === "\\" || trimmed[end - 1] === "/")) end -= 1;
	return trimmed.slice(0, end);
}
function resolveWindowsSystemRoot(env) {
	const source = env ?? process.env;
	return normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(source, "SystemRoot")) ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(source, "WINDIR")) ?? "C:\\Windows";
}
function resolveWindowsSystemCommand(command, env) {
	return path.win32.join(resolveWindowsSystemRoot(env), "System32", command);
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/windows-owner.js
const SID_RE$1 = /^\*?s-\d+-\d+(-\d+)+$/i;
const TRUSTED_OWNER_SIDS = /* @__PURE__ */ new Set(["s-1-5-18", "s-1-5-32-544"]);
function normalizeSid$1(value) {
	const normalized = value.trim().toLowerCase();
	return normalized.startsWith("*") ? normalized.slice(1) : normalized;
}
function encodePowerShellCommand(source) {
	return Buffer.from(source, "utf16le").toString("base64");
}
function windowsOwnerQueryCommand(targetPath) {
	return [
		"$ErrorActionPreference='Stop'",
		`$p=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(targetPath, "utf8").toString("base64")}'))`,
		"$sections=[System.Security.AccessControl.AccessControlSections]::Access -bor [System.Security.AccessControl.AccessControlSections]::Owner",
		"$acl=if([IO.Directory]::Exists($p)){[IO.Directory]::GetAccessControl($p,$sections)}else{[IO.File]::GetAccessControl($p,$sections)}",
		"$ownerSid=$acl.GetOwner([System.Security.Principal.SecurityIdentifier]).Value",
		"$currentSid=[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value",
		"$root=[IO.Path]::GetPathRoot($p)",
		"$extendedDrive=$p.Length -ge 7 -and $p.StartsWith('\\\\?\\') -and [char]::IsLetter($p[4]) -and $p[5] -eq ':' -and $p[6] -eq '\\'",
		"$driveRoot=if($extendedDrive){$p.Substring(4,3)}else{$root}",
		"$namespacePath=$p.StartsWith('\\\\')",
		"$remote=($namespacePath -and -not $extendedDrive) -or ([IO.DriveInfo]::new($driveRoot).DriveType -eq [IO.DriveType]::Network)",
		"$rules=$acl.GetAccessRules($true,$true,[System.Security.Principal.SecurityIdentifier])",
		"$principalSids=@($rules|ForEach-Object {$identity=$_.IdentityReference;$sid=$identity.Value;@{name=$sid;sid=$sid};try{@{name=$identity.Translate([System.Security.Principal.NTAccount]).Value;sid=$sid}}catch{}})",
		"@{ownerSid=$ownerSid;currentUserSid=$currentSid;principalSids=$principalSids;principalTranslationFailed=$false;remote=$remote}|ConvertTo-Json -Depth 4 -Compress"
	].join(";");
}
function windowsPrincipalQueryCommand(principals) {
	return [
		"$ErrorActionPreference='Stop'",
		`$names=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(JSON.stringify(principals), "utf8").toString("base64")}'))|ConvertFrom-Json`,
		"$rows=@($names|ForEach-Object {@{name=$_;sid=(New-Object System.Security.Principal.NTAccount($_)).Translate([System.Security.Principal.SecurityIdentifier]).Value}})",
		"ConvertTo-Json -InputObject $rows -Compress"
	].join(";");
}
function parsePrincipalSidRows(value) {
	const rows = Array.isArray(value) ? value : value ? [value] : [];
	const result = {};
	for (const row of rows) {
		if (!row || typeof row !== "object") continue;
		const name = "name" in row && typeof row.name === "string" ? row.name.trim() : "";
		const sid = "sid" in row && typeof row.sid === "string" ? normalizeSid$1(row.sid) : "";
		if (name && SID_RE$1.test(sid)) result[name.toLowerCase()] = sid;
	}
	return result;
}
async function resolveWindowsPrincipalSids(params) {
	const principals = [...new Set(params.principals.map((value) => value.trim()).filter(Boolean))];
	const known = Object.fromEntries(Object.entries(params.known ?? {}).map(([name, sid]) => [name.toLowerCase(), normalizeSid$1(sid)]));
	const unresolved = principals.filter((principal) => !known[principal.toLowerCase()]);
	if (unresolved.length === 0) return known;
	const command = resolveWindowsSystemCommand(String.raw`WindowsPowerShell\v1.0\powershell.exe`, params.env);
	const { stdout } = await params.exec(command, [
		"-NoLogo",
		"-NoProfile",
		"-NonInteractive",
		"-EncodedCommand",
		encodePowerShellCommand(windowsPrincipalQueryCommand(unresolved))
	]);
	const resolved = {
		...known,
		...parsePrincipalSidRows(JSON.parse(stdout.trim()))
	};
	if (principals.some((principal) => !resolved[principal.toLowerCase()])) throw new Error("Windows ACL principal translation returned incomplete SID data");
	return resolved;
}
async function resolveWindowsCurrentUserSid(params) {
	try {
		const { stdout, stderr } = await params.exec(resolveWindowsSystemCommand("whoami.exe", params.env), [
			"/user",
			"/fo",
			"csv",
			"/nh"
		]);
		const match = `${stdout}\n${stderr}`.match(/\*?S-\d+-\d+(?:-\d+)+/i);
		return match ? normalizeSid$1(match[0]) : null;
	} catch {
		return null;
	}
}
async function inspectWindowsOwner(params) {
	try {
		const command = resolveWindowsSystemCommand(String.raw`WindowsPowerShell\v1.0\powershell.exe`, params.env);
		const { stdout } = await params.exec(command, [
			"-NoLogo",
			"-NoProfile",
			"-NonInteractive",
			"-EncodedCommand",
			encodePowerShellCommand(windowsOwnerQueryCommand(params.targetPath))
		]);
		const parsed = JSON.parse(stdout.trim());
		const ownerSid = typeof parsed.ownerSid === "string" && SID_RE$1.test(parsed.ownerSid) ? normalizeSid$1(parsed.ownerSid) : void 0;
		const currentUserSid = typeof parsed.currentUserSid === "string" && SID_RE$1.test(parsed.currentUserSid) ? normalizeSid$1(parsed.currentUserSid) : void 0;
		if (!ownerSid || !currentUserSid) return { error: "Windows owner query returned invalid SID data" };
		const remote = parsed.remote === true;
		return {
			sid: ownerSid,
			currentUserSid,
			principalSids: parsePrincipalSidRows(parsed.principalSids),
			principalTranslationFailed: parsed.principalTranslationFailed === true,
			remote,
			trusted: !remote && (ownerSid === currentUserSid || TRUSTED_OWNER_SIDS.has(ownerSid))
		};
	} catch (err) {
		return { error: String(err) };
	}
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/permissions-windows.js
const INHERIT_FLAGS = /* @__PURE__ */ new Set([
	"I",
	"OI",
	"CI",
	"IO",
	"NP"
]);
const WORLD_PRINCIPALS = /* @__PURE__ */ new Set([
	"everyone",
	"users",
	"builtin\\users",
	"authenticated users",
	"nt authority\\authenticated users",
	"anonymous logon",
	"nt authority\\anonymous logon",
	"guests",
	"builtin\\guests",
	"interactive",
	"nt authority\\interactive",
	"network",
	"nt authority\\network",
	"local"
]);
const TRUSTED_BASE = /* @__PURE__ */ new Set([
	"nt authority\\system",
	"system",
	"builtin\\administrators",
	"creator owner",
	"autorite nt\\système",
	"nt-autorität\\system",
	"autoridad nt\\system",
	"autoridade nt\\system"
]);
const WORLD_SUFFIXES = ["\\users", "\\authenticated users"];
const SID_RE = /^\*?s-\d+-\d+(-\d+)+$/i;
const TRUSTED_SIDS = /* @__PURE__ */ new Set([
	"s-1-5-18",
	"s-1-5-32-544",
	"s-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464"
]);
const WORLD_SIDS = /* @__PURE__ */ new Set([
	"s-1-1-0",
	"s-1-5-11",
	"s-1-5-32-545",
	"s-1-5-7",
	"s-1-5-32-546",
	"s-1-5-4",
	"s-1-2-0",
	"s-1-5-2"
]);
const STATUS_PREFIXES = [
	"successfully processed",
	"processed",
	"failed processing",
	"no mapping between account names"
];
function stripDiacritics(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const TRUSTED_BASE_ASCII = new Set([...TRUSTED_BASE].map(stripDiacritics));
const normalize = (value) => normalizeLowercaseStringOrEmpty(value);
const defaultWindowsUserInfo = () => os.userInfo();
const defaultPermissionExec = executePermissionCommand;
function inspectWindowsPermissionsNative(params) {
	const native = getNativeBinding();
	if (!native) return void 0;
	try {
		const facts = native.readOwnerAndDacl(params.targetPath);
		if (facts.fallbackRequired) return void 0;
		return {
			ok: true,
			isSymlink: params.stat.isSymlink,
			isDir: params.effectiveIsDir,
			mode: params.effectiveMode,
			bits: params.bits,
			source: "windows-acl",
			worldWritable: facts.worldWritable,
			groupWritable: facts.groupWritable,
			worldReadable: facts.worldReadable,
			groupReadable: facts.groupReadable,
			ownerSid: facts.ownerSid,
			ownerTrusted: facts.ownerClass !== "foreign",
			aclSummary: `native owner=${facts.ownerClass} world=${facts.worldReadable ? "r" : "-"}${facts.worldWritable ? "w" : "-"} group=${facts.groupReadable ? "r" : "-"}${facts.groupWritable ? "w" : "-"}`
		};
	} catch {
		return;
	}
}
async function inspectWindowsPermissions(params) {
	const native = inspectWindowsPermissionsNative(params);
	if (native) return native;
	const unverified = {
		ok: true,
		isSymlink: params.stat.isSymlink,
		isDir: params.effectiveIsDir,
		mode: params.effectiveMode,
		bits: params.bits,
		source: "unknown",
		worldWritable: false,
		groupWritable: false,
		worldReadable: false,
		groupReadable: false
	};
	const owner = await inspectWindowsOwner({
		targetPath: params.targetPath,
		env: params.opts?.env,
		exec: params.opts?.exec ?? defaultPermissionExec
	});
	if (owner.error) {
		const error = `Windows owner inspection failed: ${owner.error}`;
		return {
			...unverified,
			ownerError: owner.error,
			error
		};
	}
	const acl = await inspectWindowsAcl(params.targetPath, {
		env: params.opts?.env,
		exec: params.opts?.exec,
		currentUserSid: owner.currentUserSid,
		principalSids: owner.principalSids,
		principalTranslationFailed: owner.principalTranslationFailed
	});
	const ownerFields = {
		...owner.sid ? { ownerSid: owner.sid } : {},
		...owner.trusted !== void 0 ? { ownerTrusted: owner.trusted } : {},
		...owner.error ? { ownerError: owner.error } : {}
	};
	if (!acl.ok) return {
		...unverified,
		...ownerFields,
		error: acl.error
	};
	return {
		ok: true,
		isSymlink: params.stat.isSymlink,
		isDir: params.effectiveIsDir,
		mode: params.effectiveMode,
		bits: params.bits,
		source: "windows-acl",
		worldWritable: acl.untrustedWorld.some((entry) => entry.canWrite),
		groupWritable: acl.untrustedGroup.some((entry) => entry.canWrite),
		worldReadable: acl.untrustedWorld.some((entry) => entry.canRead),
		groupReadable: acl.untrustedGroup.some((entry) => entry.canRead),
		...ownerFields,
		aclSummary: formatWindowsAclSummary(acl)
	};
}
function normalizeSid(value) {
	const normalized = normalize(value);
	return normalized.startsWith("*") ? normalized.slice(1) : normalized;
}
function resolveWindowsUserPrincipal(env, userInfo = defaultWindowsUserInfo) {
	const username = env?.USERNAME?.trim() || userInfo().username?.trim();
	if (!username) return null;
	const domain = env?.USERDOMAIN?.trim();
	return domain ? `${domain}\\${username}` : username;
}
function buildTrustedPrincipals(env) {
	const trusted = new Set(TRUSTED_BASE);
	const principal = resolveWindowsUserPrincipal(env);
	if (principal) {
		trusted.add(normalize(principal));
		const userOnly = principal.split("\\").at(-1);
		if (userOnly) trusted.add(normalize(userOnly));
	}
	const userSid = normalizeSid(env?.USERSID ?? "");
	if (userSid && SID_RE.test(userSid) && !WORLD_SIDS.has(userSid)) trusted.add(userSid);
	return trusted;
}
function classifyPrincipal(principal, trustedPrincipals) {
	const normalized = normalize(principal);
	if (SID_RE.test(normalized)) {
		const sid = normalizeSid(normalized);
		if (WORLD_SIDS.has(sid)) return "world";
		if (TRUSTED_SIDS.has(sid) || trustedPrincipals.has(sid)) return "trusted";
		return "group";
	}
	if (trustedPrincipals.has(normalized) || TRUSTED_BASE.has(normalized)) return "trusted";
	if (WORLD_PRINCIPALS.has(normalized) || WORLD_SUFFIXES.some((suffix) => normalized.endsWith(suffix))) return "world";
	const stripped = stripDiacritics(normalized);
	return stripped !== normalized && TRUSTED_BASE_ASCII.has(stripped) ? "trusted" : "group";
}
function rightsFromTokens(tokens) {
	const upper = tokens.join("").toUpperCase();
	return {
		canWrite: upper.includes("F") || upper.includes("M") || upper.includes("W") || upper.includes("D"),
		canRead: upper.includes("F") || upper.includes("M") || upper.includes("R")
	};
}
function stripTargetPrefix(params) {
	if (params.lowerLine.startsWith(params.lowerTarget)) return params.trimmedLine.slice(params.normalizedTarget.length).trim();
	if (params.lowerLine.startsWith(params.quotedLower)) return params.trimmedLine.slice(params.quotedTarget.length).trim();
	return params.trimmedLine;
}
function parseAceEntry(entry) {
	if (!entry.includes("(")) return null;
	const idx = entry.indexOf(":");
	if (idx === -1) return null;
	const principal = entry.slice(0, idx).trim();
	const rawRights = entry.slice(idx + 1).trim();
	const tokens = rawRights.match(/\(([^)]+)\)/g)?.map((token) => token.slice(1, -1).trim()).filter(Boolean) ?? [];
	if (tokens.some((token) => token.toUpperCase() === "DENY")) return null;
	const rights = tokens.filter((token) => !INHERIT_FLAGS.has(token.toUpperCase()));
	if (rights.length === 0) return null;
	const normalizedPrincipal = normalizeSid(principal);
	return {
		principal,
		...SID_RE.test(normalizedPrincipal) ? { sid: normalizedPrincipal } : {},
		rights,
		rawRights,
		...rightsFromTokens(rights)
	};
}
function parseIcaclsOutput(output, targetPath) {
	const entries = [];
	const normalizedTarget = targetPath.trim();
	const lowerTarget = normalizedTarget.toLowerCase();
	const quotedTarget = `"${normalizedTarget}"`;
	const quotedLower = quotedTarget.toLowerCase();
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trimEnd();
		if (!line.trim()) continue;
		const trimmed = line.trim();
		const lowerLine = trimmed.toLowerCase();
		if (STATUS_PREFIXES.some((prefix) => lowerLine.startsWith(prefix))) continue;
		const parsed = parseAceEntry(stripTargetPrefix({
			trimmedLine: trimmed,
			lowerLine,
			normalizedTarget,
			lowerTarget,
			quotedTarget,
			quotedLower
		}));
		if (parsed) entries.push(parsed);
	}
	return entries;
}
function summarizeWindowsAcl(entries, env) {
	const trustedPrincipals = buildTrustedPrincipals(env);
	const trusted = [];
	const untrustedWorld = [];
	const untrustedGroup = [];
	for (const entry of entries) {
		const classification = classifyPrincipal(entry.sid ?? entry.principal, trustedPrincipals);
		if (classification === "trusted") trusted.push(entry);
		else if (classification === "world") untrustedWorld.push(entry);
		else untrustedGroup.push(entry);
	}
	return {
		trusted,
		untrustedWorld,
		untrustedGroup
	};
}
async function inspectWindowsAcl(targetPath, opts) {
	const exec = opts?.exec ?? defaultPermissionExec;
	try {
		if (opts?.principalTranslationFailed) throw new Error("Windows ACL principal SID translation failed");
		const { stdout, stderr } = await exec(resolveWindowsSystemCommand("icacls.exe", opts?.env), [targetPath]);
		let entries = parseIcaclsOutput(`${stdout}\n${stderr}`.trim(), targetPath);
		if (!entries.length) throw new Error("Windows ACL output could not be verified");
		const principalSids = await resolveWindowsPrincipalSids({
			principals: entries.filter((entry) => !entry.sid).map((entry) => entry.principal),
			known: opts?.principalSids,
			env: opts?.env,
			exec
		});
		entries = entries.map((entry) => {
			const sid = entry.sid ?? principalSids[entry.principal.toLowerCase()];
			if (!sid) throw new Error(`Windows ACL principal SID could not be verified: ${entry.principal}`);
			return {
				...entry,
				sid
			};
		});
		let currentUserSid = normalizeSid(opts?.currentUserSid ?? "");
		let effectiveEnv = currentUserSid ? { USERSID: currentUserSid } : void 0;
		let { trusted, untrustedWorld, untrustedGroup } = summarizeWindowsAcl(entries, effectiveEnv);
		if (!currentUserSid && untrustedGroup.some((entry) => entry.sid && !TRUSTED_SIDS.has(entry.sid))) {
			currentUserSid = await resolveWindowsCurrentUserSid({
				exec,
				env: opts?.env
			}) ?? "";
			if (currentUserSid) {
				effectiveEnv = { USERSID: currentUserSid };
				({trusted, untrustedWorld, untrustedGroup} = summarizeWindowsAcl(entries, effectiveEnv));
			}
		}
		return {
			ok: true,
			entries,
			trusted,
			untrustedWorld,
			untrustedGroup
		};
	} catch (err) {
		return {
			ok: false,
			entries: [],
			trusted: [],
			untrustedWorld: [],
			untrustedGroup: [],
			error: String(err)
		};
	}
}
function formatWindowsAclSummary(summary) {
	if (!summary.ok) return "unknown";
	const untrusted = [...summary.untrustedWorld, ...summary.untrustedGroup];
	return untrusted.length === 0 ? "trusted-only" : untrusted.map((entry) => `${entry.principal}:${entry.rawRights}`).join(", ");
}
function formatIcaclsResetCommand(targetPath, opts) {
	const command = resolveWindowsSystemCommand("icacls.exe", opts.env);
	const user = resolveWindowsUserPrincipal(opts.env, opts.userInfo) ?? "%USERNAME%";
	const grant = opts.isDir ? "(OI)(CI)F" : "F";
	return [
		command,
		`"${targetPath}"`,
		"/inheritance:r",
		"/grant:r",
		`"${user}:${grant}"`,
		"/grant:r",
		`"*S-1-5-18:${grant}"`
	].join(" ");
}
function createIcaclsResetCommand(targetPath, opts) {
	const user = resolveWindowsUserPrincipal(opts.env, opts.userInfo);
	if (!user) return null;
	const grant = opts.isDir ? "(OI)(CI)F" : "F";
	const args = [
		targetPath,
		"/inheritance:r",
		"/grant:r",
		`${user}:${grant}`,
		"/grant:r",
		`*S-1-5-18:${grant}`
	];
	return {
		command: resolveWindowsSystemCommand("icacls.exe", opts.env),
		args,
		display: formatIcaclsResetCommand(targetPath, opts)
	};
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/permissions.js
async function safeStat(targetPath) {
	try {
		const lst = await fs.lstat(targetPath);
		return {
			ok: true,
			isSymlink: lst.isSymbolicLink(),
			isDir: lst.isDirectory(),
			mode: typeof lst.mode === "number" ? lst.mode : null,
			uid: typeof lst.uid === "number" ? lst.uid : null,
			gid: typeof lst.gid === "number" ? lst.gid : null
		};
	} catch (err) {
		return {
			ok: false,
			isSymlink: false,
			isDir: false,
			mode: null,
			uid: null,
			gid: null,
			error: String(err)
		};
	}
}
async function inspectPathPermissions(targetPath, opts) {
	const st = await safeStat(targetPath);
	if (!st.ok) return {
		ok: false,
		isSymlink: false,
		isDir: false,
		mode: null,
		bits: null,
		source: "unknown",
		worldWritable: false,
		groupWritable: false,
		worldReadable: false,
		groupReadable: false,
		error: st.error
	};
	let effectiveMode = st.mode;
	let effectiveIsDir = st.isDir;
	if (st.isSymlink) try {
		const target = await fs.stat(targetPath);
		effectiveMode = typeof target.mode === "number" ? target.mode : st.mode;
		effectiveIsDir = target.isDirectory();
	} catch {}
	const bits = modeBits(effectiveMode);
	if ((opts?.platform ?? process.platform) === "win32") return await inspectWindowsPermissions({
		targetPath,
		stat: st,
		effectiveIsDir,
		effectiveMode,
		bits,
		opts
	});
	return {
		ok: true,
		isSymlink: st.isSymlink,
		isDir: effectiveIsDir,
		mode: effectiveMode,
		bits,
		source: "posix",
		worldWritable: isWorldWritable(bits),
		groupWritable: isGroupWritable(bits),
		worldReadable: isWorldReadable(bits),
		groupReadable: isGroupReadable(bits)
	};
}
function formatPermissionDetail(targetPath, perms) {
	if (perms.source === "windows-acl") return `${targetPath} acl=${perms.aclSummary ?? "unknown"}`;
	return `${targetPath} mode=${formatOctal(perms.bits)}`;
}
function formatPermissionRemediation(params) {
	if (params.perms.source === "windows-acl") return formatIcaclsResetCommand(params.targetPath, {
		isDir: params.isDir,
		env: params.env
	});
	const optionSeparator = params.targetPath.startsWith("-") ? "-- " : "";
	return `chmod ${params.posixMode.toString(8).padStart(3, "0")} ${optionSeparator}` + formatPosixShellArgument(params.targetPath);
}
function formatPosixShellArgument(value) {
	if (value && /^[A-Za-z0-9_@%+=:,./-]+$/.test(value)) return value;
	return `'${value.replaceAll("'", `'\\''`)}'`;
}
function modeBits(mode) {
	return mode == null ? null : mode & 511;
}
function formatOctal(bits) {
	return bits == null ? "unknown" : bits.toString(8).padStart(3, "0");
}
function isWorldWritable(bits) {
	return bits != null && (bits & 2) !== 0;
}
function isGroupWritable(bits) {
	return bits != null && (bits & 16) !== 0;
}
function isWorldReadable(bits) {
	return bits != null && (bits & 4) !== 0;
}
function isGroupReadable(bits) {
	return bits != null && (bits & 32) !== 0;
}
//#endregion
export { isGroupWritable as a, modeBits as c, formatIcaclsResetCommand as d, isGroupReadable as i, safeStat as l, formatPermissionRemediation as n, isWorldReadable as o, inspectPathPermissions as r, isWorldWritable as s, formatPermissionDetail as t, createIcaclsResetCommand as u };
