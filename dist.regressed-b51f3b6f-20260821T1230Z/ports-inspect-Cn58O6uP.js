import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as getWindowsSystem32ExePath, o as getWindowsWmicExePath, r as getWindowsPowerShellExePath } from "./windows-install-roots-BdGcwph2.js";
import { n as parseTcpListenerEndpoint, r as parseWindowsNetstatListeners, t as parseTcpEndpoint } from "./ports-netstat-CIAA8WbL.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { n as probePortUsage } from "./ports-probe-BkHRb4hs.js";
import { t as buildPortHints } from "./ports-format-BfMa8zv8.js";
import { t as resolveLsofCommand } from "./ports-lsof-BmdLddJi.js";
import os from "node:os";
import net from "node:net";
import pMap from "p-map";
//#region src/infra/ports-lsof-listeners.ts
function parseLsofListenerFieldRecords(output) {
	const records = [];
	let processFields = {};
	let processLines = [];
	let fileLines = [];
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) continue;
		if (line.startsWith("p")) {
			const pid = parseStrictPositiveInteger(line.slice(1));
			processFields = pid !== void 0 ? { pid } : {};
			processLines = [line];
			fileLines = [];
			continue;
		}
		if (line.startsWith("c")) {
			processFields.command = line.slice(1);
			processLines.push(line);
			continue;
		}
		if (line.startsWith("f")) {
			fileLines = [line];
			continue;
		}
		if (line.startsWith("n")) {
			records.push({
				listener: {
					...processFields,
					address: line.slice(1)
				},
				detail: [
					...processLines,
					...fileLines,
					line
				].join("\n")
			});
			fileLines = [];
		}
	}
	return records;
}
function parseLsofListenerPort(address) {
	const normalized = address?.replace(/^tcp\s+/i, "").replace(/\s*\([^)]*\)\s*$/i, "").trim();
	if (!normalized || normalized.includes("->")) return null;
	return parseTcpEndpoint(normalized)?.port ?? null;
}
function parseLsofListenerRecordsByPort(output) {
	const recordsByPort = /* @__PURE__ */ new Map();
	for (const record of parseLsofListenerFieldRecords(output)) {
		const port = parseLsofListenerPort(record.listener.address);
		if (port === null) continue;
		const records = recordsByPort.get(port) ?? [];
		records.push(record);
		recordsByPort.set(port, records);
	}
	return recordsByPort;
}
function listenerIdentity(listener) {
	return `${listener.pid ?? ""}\0${listener.command ?? ""}\0${listener.address ?? ""}`;
}
function readLsofListenersForPort(recordsByPort, port) {
	const records = recordsByPort.get(port) ?? [];
	const seen = /* @__PURE__ */ new Set();
	const listeners = [];
	const detailLines = [];
	for (const record of records) {
		const key = listenerIdentity(record.listener);
		if (seen.has(key)) continue;
		seen.add(key);
		listeners.push(record.listener);
		detailLines.push(record.detail);
	}
	return {
		listeners,
		detail: detailLines.join("\n") || void 0
	};
}
//#endregion
//#region src/infra/ports-inspect.ts
const PORT_PROCESS_ENRICHMENT_CONCURRENCY = 20;
async function runCommandSafe(argv, timeoutMs = 5e3) {
	try {
		const res = await runCommandWithTimeout(argv, { timeoutMs });
		return {
			stdout: res.stdout,
			stderr: res.stderr,
			code: res.code ?? 1
		};
	} catch (err) {
		return {
			stdout: "",
			stderr: "",
			code: 1,
			error: String(err)
		};
	}
}
function parseLsofFieldOutput(output) {
	const lines = output.split(/\r?\n/).filter(Boolean);
	const listeners = [];
	let processFields = {};
	for (const line of lines) if (line.startsWith("p")) {
		const pid = parseStrictPositiveInteger(line.slice(1));
		processFields = pid !== void 0 ? { pid } : {};
	} else if (line.startsWith("c")) processFields.command = line.slice(1);
	else if (line.startsWith("n")) listeners.push({
		...processFields,
		address: line.slice(1)
	});
	return listeners;
}
function parseLsofTcpConnectionAddress(address) {
	const normalized = address?.replace(/^tcp\s+/i, "").replace(/\s*\([^)]*\)\s*$/i, "").trim();
	if (!normalized?.includes("->")) return null;
	const [localRaw, remoteRaw] = normalized.split("->", 2);
	const local = parseTcpEndpoint(localRaw ?? "");
	const remote = parseTcpEndpoint(remoteRaw ?? "");
	return local && remote ? {
		local,
		remote
	} : null;
}
function resolveLocalNetworkAddresses() {
	const addresses = /* @__PURE__ */ new Set([
		"127.0.0.1",
		"::1",
		"localhost",
		"0.0.0.0",
		"::"
	]);
	for (const entries of Object.values(os.networkInterfaces())) for (const entry of entries ?? []) addresses.add(entry.address.toLowerCase());
	return addresses;
}
function isGatewayConnectionAddress(address, port, localAddresses) {
	const parsed = parseLsofTcpConnectionAddress(address);
	if (!parsed) return false;
	if (parsed.local.port === port) return true;
	return parsed.remote.port === port && localAddresses.has(parsed.remote.host);
}
function resolveLsofTcpDirection(address, port) {
	const parsed = parseLsofTcpConnectionAddress(address);
	if (!parsed) return "unknown";
	if (parsed.local.port === port) return "server";
	return parsed.remote.port === port ? "client" : "unknown";
}
function parseLsofConnectionFieldOutput(output, port) {
	const connections = [];
	const localAddresses = resolveLocalNetworkAddresses();
	for (const entry of parseLsofFieldOutput(output)) {
		if (!isGatewayConnectionAddress(entry.address, port, localAddresses)) continue;
		const connection = entry;
		connection.direction = resolveLsofTcpDirection(entry.address, port);
		connections.push(connection);
	}
	return connections;
}
function parseSsConnectionEndpoint(raw) {
	if (raw.startsWith("users:")) return null;
	if (raw.includes(":")) return raw;
	return null;
}
function parseSsConnections(output, port) {
	const connections = [];
	const localAddresses = resolveLocalNetworkAddresses();
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) continue;
		const endpoints = line.split(/\s+/).map(parseSsConnectionEndpoint).filter((endpoint) => Boolean(endpoint));
		if (endpoints.length < 2) continue;
		const [local, remote] = endpoints.slice(-2);
		const address = `TCP ${local}->${remote} (ESTABLISHED)`;
		if (!isGatewayConnectionAddress(address, port, localAddresses)) continue;
		const connection = {
			address,
			direction: resolveLsofTcpDirection(address, port)
		};
		const pidMatch = line.match(/pid=(\d+)/);
		if (pidMatch) {
			const pid = Number.parseInt(expectDefined(pidMatch[1], "pid match capture group 1"), 10);
			if (Number.isFinite(pid)) connection.pid = pid;
		}
		const commandMatch = line.match(/users:\(\("([^"]+)"/);
		if (commandMatch?.[1]) connection.command = commandMatch[1];
		connections.push(connection);
	}
	return connections;
}
async function enrichUnixListenerProcessInfo(listeners) {
	await pMap(listeners, async (listener) => {
		if (!listener.pid) return;
		const [commandLine, user, parentPid] = await Promise.all([
			resolveUnixCommandLine(listener.pid),
			resolveUnixUser(listener.pid),
			resolveUnixParentPid(listener.pid)
		]);
		if (commandLine) listener.commandLine = commandLine;
		if (user) listener.user = user;
		if (parentPid !== void 0) listener.ppid = parentPid;
	}, { concurrency: PORT_PROCESS_ENRICHMENT_CONCURRENCY });
}
async function readUnixEstablishedConnectionsFromSs(port) {
	const errors = [];
	const res = await runCommandSafe([
		"ss",
		"-H",
		"-tnp",
		"state",
		"established",
		`( sport = :${port} or dport = :${port} )`
	]);
	if (res.code === 0) {
		const connections = parseSsConnections(res.stdout, port);
		await enrichUnixListenerProcessInfo(connections);
		return {
			connections,
			detail: res.stdout.trim() || void 0,
			errors
		};
	}
	const stderr = res.stderr.trim();
	if (res.code === 1 && !res.error && !stderr) return {
		connections: [],
		detail: void 0,
		errors
	};
	if (res.error) errors.push(res.error);
	const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
	if (detail) errors.push(detail);
	return {
		connections: [],
		detail: void 0,
		errors
	};
}
async function readUnixEstablishedConnections(port) {
	const res = await runCommandSafe([
		await resolveLsofCommand(),
		"-nP",
		`-iTCP:${port}`,
		"-sTCP:ESTABLISHED",
		"-FpFcn"
	]);
	if (res.code === 0) {
		const connections = parseLsofConnectionFieldOutput(res.stdout, port);
		await enrichUnixListenerProcessInfo(connections);
		return {
			connections,
			detail: res.stdout.trim() || void 0,
			errors: []
		};
	}
	const stderr = res.stderr.trim();
	if (res.code === 1 && !res.error && !stderr) return {
		connections: [],
		detail: void 0,
		errors: []
	};
	const errors = [];
	if (res.error) errors.push(res.error);
	const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
	if (detail) errors.push(detail);
	const ssFallback = await readUnixEstablishedConnectionsFromSs(port);
	if (ssFallback.connections.length > 0) return ssFallback;
	return {
		connections: [],
		detail: void 0,
		errors: [...errors, ...ssFallback.errors]
	};
}
async function resolveUnixCommandLine(pid) {
	const res = await runCommandSafe([
		"ps",
		"-p",
		String(pid),
		"-o",
		"command="
	]);
	if (res.code !== 0) return;
	return res.stdout.trim() || void 0;
}
async function resolveUnixUser(pid) {
	const res = await runCommandSafe([
		"ps",
		"-p",
		String(pid),
		"-o",
		"user="
	]);
	if (res.code !== 0) return;
	return res.stdout.trim() || void 0;
}
async function resolveUnixParentPid(pid) {
	const res = await runCommandSafe([
		"ps",
		"-p",
		String(pid),
		"-o",
		"ppid="
	]);
	if (res.code !== 0) return;
	const line = res.stdout.trim();
	const parentPid = Number.parseInt(line, 10);
	return Number.isFinite(parentPid) && parentPid > 0 ? parentPid : void 0;
}
function parseSsListeners(output, port) {
	const lines = output.split(/\r?\n/).map((line) => line.trim());
	const listeners = [];
	for (const line of lines) {
		if (!line || !line.includes("LISTEN")) continue;
		const localAddress = line.split(/\s+/).find((part) => parseTcpEndpoint(part)?.port === port);
		if (!localAddress) continue;
		const listener = { address: localAddress };
		const pidMatch = line.match(/pid=(\d+)/);
		if (pidMatch) {
			const pid = Number.parseInt(expectDefined(pidMatch[1], "pid match capture group 1"), 10);
			if (Number.isFinite(pid)) listener.pid = pid;
		}
		const commandMatch = line.match(/users:\(\("([^"]+)"/);
		if (commandMatch?.[1]) listener.command = commandMatch[1];
		listeners.push(listener);
	}
	return listeners;
}
async function readUnixListenersFromSs(port) {
	const errors = [];
	const res = await runCommandSafe([
		"ss",
		"-H",
		"-ltnp",
		`sport = :${port}`
	]);
	if (res.code === 0) {
		const listeners = parseSsListeners(res.stdout, port);
		await enrichUnixListenerProcessInfo(listeners);
		return {
			listeners,
			detail: res.stdout.trim() || void 0,
			errors
		};
	}
	const stderr = res.stderr.trim();
	if (res.code === 1 && !res.error && !stderr) return {
		listeners: [],
		detail: void 0,
		errors
	};
	if (res.error) errors.push(res.error);
	const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
	if (detail) errors.push(detail);
	return {
		listeners: [],
		detail: void 0,
		errors
	};
}
async function readUnixListenerSnapshot() {
	const res = await runCommandSafe([
		await resolveLsofCommand(),
		"-nP",
		"-iTCP",
		"-sTCP:LISTEN",
		"-FpFcn"
	]);
	if (res.code === 0) return {
		recordsByPort: parseLsofListenerRecordsByPort(res.stdout),
		errors: [],
		lsofUnavailable: false
	};
	const errors = [];
	const stderr = res.stderr.trim();
	if (res.code === 1 && !res.error && !stderr) return {
		recordsByPort: /* @__PURE__ */ new Map(),
		errors,
		lsofUnavailable: false
	};
	if (res.error) errors.push(res.error);
	const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
	if (detail) errors.push(detail);
	return {
		recordsByPort: /* @__PURE__ */ new Map(),
		errors,
		lsofUnavailable: true
	};
}
async function readUnixListenersFromLsof(port) {
	const res = await runCommandSafe([
		await resolveLsofCommand(),
		"-nP",
		`-iTCP:${port}`,
		"-sTCP:LISTEN",
		"-FpFcn"
	]);
	if (res.code === 0) {
		const result = readLsofListenersForPort(parseLsofListenerRecordsByPort(res.stdout), port);
		await enrichUnixListenerProcessInfo(result.listeners);
		return {
			...result,
			errors: [],
			lsofUnavailable: false
		};
	}
	const errors = [];
	const stderr = res.stderr.trim();
	if (res.code === 1 && !res.error && !stderr) return {
		listeners: [],
		detail: void 0,
		errors,
		lsofUnavailable: false
	};
	if (res.error) errors.push(res.error);
	const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
	if (detail) errors.push(detail);
	return {
		listeners: [],
		detail: void 0,
		errors,
		lsofUnavailable: true
	};
}
async function readUnixListeners(port, snapshot) {
	if (snapshot) {
		if (!snapshot.lsofUnavailable) {
			const result = readLsofListenersForPort(snapshot.recordsByPort, port);
			await enrichUnixListenerProcessInfo(result.listeners);
			return {
				...result,
				errors: snapshot.errors
			};
		}
		const ssFallback = await readUnixListenersFromSs(port);
		if (ssFallback.listeners.length > 0) return ssFallback;
		return {
			listeners: [],
			detail: void 0,
			errors: [...snapshot.errors, ...ssFallback.errors]
		};
	}
	const lsofResult = await readUnixListenersFromLsof(port);
	if (!lsofResult.lsofUnavailable) return lsofResult;
	const ssFallback = await readUnixListenersFromSs(port);
	if (ssFallback.listeners.length > 0) return ssFallback;
	return {
		listeners: [],
		detail: void 0,
		errors: [...lsofResult.errors, ...ssFallback.errors]
	};
}
function parseNetstatListeners(output, port) {
	return parseWindowsNetstatListeners(output, port);
}
function parseNetstatConnections(output, port) {
	const connections = [];
	const localAddresses = resolveLocalNetworkAddresses();
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || !normalizeLowercaseStringOrEmpty(line).includes("established")) continue;
		const parts = line.split(/\s+/);
		if (parts.length < 5) continue;
		const local = parts[1];
		const remote = parts[2];
		const pidRaw = parts.at(-1);
		if (!local || !remote || !pidRaw) continue;
		const address = `TCP ${local}->${remote} (ESTABLISHED)`;
		if (!isGatewayConnectionAddress(address, port, localAddresses)) continue;
		const connection = {
			address,
			direction: resolveLsofTcpDirection(address, port)
		};
		const pid = parseStrictPositiveInteger(pidRaw);
		if (pid !== void 0) connection.pid = pid;
		connections.push(connection);
	}
	return connections;
}
async function resolveWindowsImageName(pid) {
	const res = await runCommandSafe([
		getWindowsSystem32ExePath("tasklist.exe"),
		"/FI",
		`PID eq ${pid}`,
		"/FO",
		"CSV",
		"/NH"
	]);
	if (res.code !== 0) return;
	for (const rawLine of res.stdout.split(/\r?\n/)) {
		const match = rawLine.trim().match(/^"([^"]+)","(\d+)",/);
		if (match?.[1] && match[2] === String(pid)) return match[1];
	}
}
async function resolveWindowsCommandLine(pid) {
	const powershell = await runCommandSafe([
		getWindowsPowerShellExePath(),
		"-NoProfile",
		"-Command",
		`(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`
	]);
	if (powershell.code === 0) {
		const value = powershell.stdout.trim();
		if (value) return value;
	}
	const wmic = await runCommandSafe([
		getWindowsWmicExePath(),
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CommandLine",
		"/value"
	]);
	if (wmic.code !== 0) return;
	for (const rawLine of wmic.stdout.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!normalizeLowercaseStringOrEmpty(line).startsWith("commandline=")) continue;
		return line.slice(12).trim() || void 0;
	}
}
async function readWindowsNetstatEntries(port, parse) {
	const errors = [];
	const res = await runCommandSafe([getWindowsSystem32ExePath("netstat.exe"), "-ano"]);
	if (res.code !== 0) {
		if (res.error) errors.push(res.error);
		const detail = [res.stderr.trim(), res.stdout.trim()].filter(Boolean).join("\n");
		if (detail) errors.push(detail);
		return {
			entries: [],
			errors
		};
	}
	const entries = parse(res.stdout, port);
	await pMap(entries, async (entry) => {
		if (!entry.pid) return;
		const [imageName, commandLine] = await Promise.all([resolveWindowsImageName(entry.pid), resolveWindowsCommandLine(entry.pid)]);
		if (imageName) entry.command = imageName;
		if (commandLine) entry.commandLine = commandLine;
	}, { concurrency: PORT_PROCESS_ENRICHMENT_CONCURRENCY });
	return {
		entries,
		detail: res.stdout.trim() || void 0,
		errors
	};
}
async function readWindowsListeners(port) {
	const result = await readWindowsNetstatEntries(port, parseNetstatListeners);
	return {
		listeners: result.entries,
		detail: result.detail,
		errors: result.errors
	};
}
async function readWindowsEstablishedConnections(port) {
	const result = await readWindowsNetstatEntries(port, parseNetstatConnections);
	return {
		connections: result.entries,
		detail: result.detail,
		errors: result.errors
	};
}
async function inspectPortUsage(port, options) {
	return buildPortUsage(port, process.platform === "win32" ? await readWindowsListeners(port) : await readUnixListeners(port), options?.probeHosts);
}
async function buildPortUsage(port, result, probeHosts) {
	const errors = [];
	errors.push(...result.errors);
	let listeners = result.listeners;
	const status = probeHosts ? await probePortUsage(port, probeHosts) : listeners.length > 0 ? "busy" : await probePortUsage(port);
	if (status !== "busy") listeners = [];
	else if (probeHosts) listeners = listeners.filter((listener) => isListenerRelevantToProbeHosts(listener, port, probeHosts));
	const hints = buildPortHints(listeners, port);
	if (status === "busy" && listeners.length === 0) hints.push("Port is in use but process details are unavailable (install lsof or run as an admin user).");
	return {
		port,
		status,
		listeners,
		hints,
		detail: result.detail,
		errors: errors.length > 0 ? errors : void 0
	};
}
function isWildcardTcpHost(host) {
	return host === "0.0.0.0" || host === "::" || host === "*";
}
function isSameTcpAddressFamily(leftHost, rightHost) {
	const leftFamily = net.isIP(leftHost);
	const rightFamily = net.isIP(rightHost);
	return leftFamily === 0 || rightFamily === 0 || leftFamily === rightFamily;
}
function isListenerRelevantToProbeHosts(listener, port, probeHosts) {
	const endpoint = parseTcpListenerEndpoint(listener.address);
	if (!endpoint || endpoint.port !== port) return false;
	return probeHosts.some((probeHost) => {
		const normalizedProbeHost = normalizeLowercaseStringOrEmpty(probeHost);
		if (isWildcardTcpHost(endpoint.host)) return isSameTcpAddressFamily(endpoint.host, normalizedProbeHost);
		if (isWildcardTcpHost(normalizedProbeHost)) return isSameTcpAddressFamily(normalizedProbeHost, endpoint.host);
		return normalizedProbeHost === endpoint.host;
	});
}
async function inspectPortUsages(ports, options) {
	const uniquePorts = Array.from(new Set(ports));
	if (process.platform === "win32") {
		const entries = await Promise.all(uniquePorts.map(async (port) => {
			const probeHosts = options?.probeHostsByPort?.get(port);
			return [port, await inspectPortUsage(port, probeHosts ? { probeHosts } : void 0)];
		}));
		return new Map(entries);
	}
	const snapshot = await readUnixListenerSnapshot();
	const entries = await Promise.all(uniquePorts.map(async (port) => [port, await buildPortUsage(port, await readUnixListeners(port, snapshot), options?.probeHostsByPort?.get(port))]));
	return new Map(entries);
}
async function inspectPortConnections(port) {
	const result = process.platform === "win32" ? await readWindowsEstablishedConnections(port) : await readUnixEstablishedConnections(port);
	return {
		port,
		connections: result.connections,
		detail: result.detail,
		errors: result.errors.length > 0 ? result.errors : void 0
	};
}
//#endregion
export { inspectPortUsage as n, inspectPortUsages as r, inspectPortConnections as t };
