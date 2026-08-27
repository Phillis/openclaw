import { Rn as string, Tn as object } from "./schemas-C7gqXY2T.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import pLimit from "p-limit";
//#region src/infra/installed-apps.ts
const execFileAsync = promisify(execFile);
const PLIST_READ_CONCURRENCY = 8;
const PLIST_READ_TIMEOUT_MS = 2e3;
const SYSTEM_APP_NAMES = /* @__PURE__ */ new Set([
	"Calendar",
	"Contacts",
	"FaceTime",
	"Home",
	"Mail",
	"Maps",
	"Messages",
	"Music",
	"Notes",
	"Photos",
	"Podcasts",
	"Reminders",
	"Shortcuts"
]);
const InfoPlistSchema = object({ CFBundleIdentifier: string().trim().min(1).optional() }).passthrough();
function defaultRoots() {
	return {
		applications: "/Applications",
		userApplications: path.join(os.homedir(), "Applications"),
		systemApplications: "/System/Applications"
	};
}
function isBackupishBundle(label) {
	return /(?:^|[\s._-])(?:backup|previous|rollback)(?:[\s._-]|$)/i.test(label) || /(?:^|[\s._-])pre-[\p{L}\p{N}._-]+$/iu.test(label);
}
async function listAppPaths(root, system) {
	let entries;
	try {
		entries = await fs.readdir(root, { withFileTypes: true });
	} catch {
		return [];
	}
	return (await Promise.all(entries.map(async (entry) => {
		if (!entry.name.toLowerCase().endsWith(".app")) return [];
		let isDirectory = entry.isDirectory();
		if (!isDirectory && entry.isSymbolicLink()) isDirectory = await fs.stat(path.join(root, entry.name)).then((stats) => stats.isDirectory()).catch(() => false);
		if (!isDirectory) return [];
		const label = entry.name.slice(0, -4);
		if (isBackupishBundle(label) || system && !SYSTEM_APP_NAMES.has(label)) return [];
		return [{
			path: path.join(root, entry.name),
			system
		}];
	}))).flat();
}
async function readBundleIdWithPlutil(appPath) {
	try {
		const { stdout } = await execFileAsync("/usr/bin/plutil", [
			"-convert",
			"json",
			"-o",
			"-",
			path.join(appPath, "Contents", "Info.plist")
		], {
			encoding: "utf8",
			maxBuffer: 1024 * 1024,
			timeout: PLIST_READ_TIMEOUT_MS
		});
		return InfoPlistSchema.parse(JSON.parse(stdout)).CFBundleIdentifier;
	} catch {
		return;
	}
}
async function scanInstalledApps(options = {}) {
	const platform = options.platform ?? process.platform;
	if (platform !== "darwin") return {
		status: "unsupported",
		platform,
		apps: []
	};
	const roots = options.roots ?? defaultRoots();
	const appPaths = (await Promise.all([
		listAppPaths(roots.applications, false),
		listAppPaths(roots.userApplications, false),
		listAppPaths(roots.systemApplications, true)
	])).flat();
	const readBundleId = options.readBundleId ?? readBundleIdWithPlutil;
	const limit = pLimit(PLIST_READ_CONCURRENCY);
	return {
		status: "ok",
		apps: (await Promise.all(appPaths.map((entry) => limit(async () => {
			const bundleId = await readBundleId(entry.path);
			return {
				label: path.basename(entry.path, ".app"),
				...bundleId ? { bundleId } : {},
				path: entry.path,
				system: entry.system
			};
		})))).toSorted((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base" }) || left.path.localeCompare(right.path))
	};
}
//#endregion
export { scanInstalledApps as t };
