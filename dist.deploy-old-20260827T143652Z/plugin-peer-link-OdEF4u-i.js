import { w as hasErrnoCode } from "./redact-Cl7lwBnl.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./path-guards-fBZukd5S.js";
import "./errors-CSNUPl5U.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { a as readRootJsonObjectSync } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { o as resolvePluginInstallDir } from "./install-paths-BYSW9x3z.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/plugins/plugin-peer-link.ts
/** Resolve the host declaration consistently for peer and direct runtime dependencies. */
function resolveOpenClawHostDependency(manifest) {
	for (const declaration of ["peerDependencies", "dependencies"]) {
		const dependencies = manifest[declaration];
		const spec = typeof dependencies === "object" && dependencies !== null && !Array.isArray(dependencies) ? dependencies.openclaw : void 0;
		if (typeof spec === "string" && spec) return {
			declaration,
			spec
		};
	}
	return null;
}
async function readSafePackageManifest(packageDir) {
	const result = readRootJsonObjectSync({
		rootDir: packageDir,
		relativePath: "package.json",
		boundaryLabel: "installed plugin package directory"
	});
	if (!result.ok) {
		if (result.reason === "open" && result.failure.error?.code === "ENOENT") return null;
		if (result.reason === "parse") throw new SyntaxError(result.error);
		if (result.reason === "open" && result.failure.error instanceof Error) throw result.failure.error;
		throw new Error(`Could not safely read package.json from ${packageDir}: ${result.reason === "open" ? result.failure.reason : result.error}`);
	}
	return result.value;
}
async function readPackageOpenClawLinkDependencies(packageDir) {
	const manifest = await readSafePackageManifest(packageDir);
	const dependency = manifest ? resolveOpenClawHostDependency(manifest) : null;
	return dependency ? { openclaw: dependency.spec } : {};
}
async function listManagedNpmRootPackageDirs(npmRoot) {
	const nodeModulesDir = path.join(npmRoot, "node_modules");
	let entries;
	try {
		entries = await fs.readdir(nodeModulesDir, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
	const packageDirs = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name === ".bin") continue;
		const entryPath = path.join(nodeModulesDir, entry.name);
		if (entry.name.startsWith("@")) {
			const scopedEntries = await fs.readdir(entryPath, { withFileTypes: true }).catch((error) => {
				if (error.code === "ENOENT") return [];
				throw error;
			});
			for (const scopedEntry of scopedEntries) if (scopedEntry.isDirectory()) packageDirs.push(path.join(entryPath, scopedEntry.name));
			continue;
		}
		if (!entry.name.startsWith(".")) packageDirs.push(entryPath);
	}
	return packageDirs.toSorted((a, b) => a.localeCompare(b));
}
async function safeRealpath(filePath) {
	try {
		return await fs.realpath(filePath);
	} catch {
		return null;
	}
}
function managedPackageNameFromDir(params) {
	return path.relative(path.join(params.npmRoot, "node_modules"), params.packageDir).split(path.sep).join("/");
}
async function auditOpenClawPeerDependency(params) {
	const packageName = params.packageName ?? (params.npmRoot ? managedPackageNameFromDir({
		npmRoot: params.npmRoot,
		packageDir: params.packageDir
	}) : path.basename(params.packageDir));
	const nodeModulesDir = path.join(params.packageDir, "node_modules");
	try {
		const existing = await fs.lstat(nodeModulesDir);
		if (!existing.isDirectory() || existing.isSymbolicLink()) return {
			packageName,
			packageDir: params.packageDir,
			reason: `${nodeModulesDir} is not a real directory`
		};
	} catch (error) {
		if (error.code === "ENOENT") return {
			packageName,
			packageDir: params.packageDir,
			reason: `missing ${path.join(nodeModulesDir, "openclaw")}`
		};
		throw error;
	}
	const linkPath = path.join(nodeModulesDir, "openclaw");
	const currentTarget = await safeRealpath(linkPath);
	if (!currentTarget) return {
		packageName,
		packageDir: params.packageDir,
		reason: `missing ${linkPath}`
	};
	const expectedTarget = await safeRealpath(params.hostRoot) ?? params.hostRoot;
	if (currentTarget !== expectedTarget) return {
		packageName,
		packageDir: params.packageDir,
		reason: `${linkPath} points to ${currentTarget} instead of ${expectedTarget}`
	};
	return null;
}
async function auditOpenClawPeerDependencyLink(params) {
	const packageName = params.packageName ?? path.basename(params.packageDir);
	const hostRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) return {
		packageName,
		packageDir: params.packageDir,
		reason: "could not locate openclaw package root"
	};
	return await auditOpenClawPeerDependency({
		hostRoot,
		packageDir: params.packageDir,
		packageName
	});
}
/** Audit the installed host only when the package actually declares an OpenClaw dependency. */
async function auditDeclaredOpenClawHostDependency(params) {
	const dependencies = await readPackageOpenClawLinkDependencies(params.packageDir);
	if (!Object.hasOwn(dependencies, "openclaw")) return null;
	return await auditOpenClawPeerDependencyLink(params);
}
async function ensureRealNodeModulesDir(params) {
	const nodeModulesDir = path.join(params.installedDir, "node_modules");
	try {
		const existing = await fs.lstat(nodeModulesDir);
		if (!existing.isDirectory() || existing.isSymbolicLink()) {
			params.logger.warn?.(`Skipping openclaw peerDependency link because ${nodeModulesDir} is not a real directory.`);
			return null;
		}
		return nodeModulesDir;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	await fs.mkdir(nodeModulesDir, { recursive: true });
	const created = await fs.lstat(nodeModulesDir);
	if (!created.isDirectory() || created.isSymbolicLink()) {
		params.logger.warn?.(`Skipping openclaw peerDependency link because ${nodeModulesDir} is not a real directory.`);
		return null;
	}
	return nodeModulesDir;
}
async function linkOpenClawPeerDependency(params) {
	const nodeModulesDir = await ensureRealNodeModulesDir({
		installedDir: params.installedDir,
		logger: params.logger
	});
	if (!nodeModulesDir) return "skipped";
	const linkPath = path.join(nodeModulesDir, params.peerName);
	const expectedTarget = await safeRealpath(params.hostRoot) ?? params.hostRoot;
	if (await safeRealpath(linkPath) === expectedTarget) return "unchanged";
	try {
		const existing = await fs.lstat(linkPath).catch((err) => {
			if (hasErrnoCode(err, "ENOENT")) return null;
			throw err;
		});
		if (existing) {
			if (!existing.isSymbolicLink()) {
				if (params.peerName === "openclaw" && existing.isDirectory()) {
					if (await readPackageName(linkPath) === "openclaw") {
						await fs.rm(linkPath, {
							recursive: true,
							force: true
						});
						await fs.symlink(params.hostRoot, linkPath, "junction");
						params.logger.info?.(`Linked peerDependency "${params.peerName}" -> ${params.hostRoot}`);
						return "linked";
					}
				}
				params.logger.warn?.(`Skipping openclaw peerDependency link because ${linkPath} already exists and is not a symlink.`);
				return "skipped";
			}
			await fs.unlink(linkPath);
		}
		await fs.symlink(params.hostRoot, linkPath, "junction");
		params.logger.info?.(`Linked peerDependency "${params.peerName}" -> ${params.hostRoot}`);
		return "linked";
	} catch (err) {
		params.logger.warn?.(`Failed to symlink peerDependency "${params.peerName}": ${String(err)}`);
		return "skipped";
	}
}
async function readPackageName(packageDir) {
	const manifest = await readSafePackageManifest(packageDir);
	return typeof manifest?.name === "string" ? manifest.name : void 0;
}
/**
* Symlink the host openclaw package for plugins that declare it as a dependency.
* Plugin package managers still own third-party dependencies; this only wires
* the host SDK package into the plugin-local Node graph.
*/
async function linkOpenClawPeerDependencies(params) {
	const peers = Object.keys(params.peerDependencies).filter((name) => name === "openclaw");
	if (peers.length === 0) return {
		repaired: 0,
		skipped: 0
	};
	const hostRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) {
		params.logger.warn?.("Could not locate openclaw package root to symlink peerDependencies; plugin may fail to resolve openclaw at runtime.");
		return {
			repaired: 0,
			skipped: peers.length
		};
	}
	let repaired = 0;
	let skipped = 0;
	for (const peerName of peers) {
		const result = await linkOpenClawPeerDependency({
			hostRoot,
			installedDir: params.installedDir,
			peerName,
			logger: params.logger
		});
		if (result === "linked") repaired += 1;
		else if (result === "skipped") skipped += 1;
	}
	return {
		repaired,
		skipped
	};
}
/**
* Repair only npm-owned legacy installs named by the authoritative install ledger.
* Local/path installs and symlink escapes remain developer-owned and are never mutated.
*/
async function reconcileRegisteredOpenClawHostLinks(params) {
	const extensionsRoot = path.resolve(params.extensionsDir);
	const extensionsRootRealPath = await safeRealpath(extensionsRoot);
	if (!extensionsRootRealPath) return {
		checked: 0,
		repaired: 0,
		skipped: 0,
		issues: []
	};
	let checked = 0;
	let repaired = 0;
	let skipped = 0;
	const issues = [];
	for (const [pluginId, record] of Object.entries(params.installRecords).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (record.source !== "npm" || !record.installPath?.trim()) continue;
		let packageDir;
		let expectedPackageDir;
		try {
			packageDir = path.resolve(resolveUserPath(record.installPath, params.env));
			expectedPackageDir = path.resolve(resolvePluginInstallDir(pluginId, extensionsRoot));
		} catch {
			continue;
		}
		if (packageDir !== expectedPackageDir) continue;
		const packageRealPath = await safeRealpath(packageDir);
		const expectedPackageRealPath = path.join(extensionsRootRealPath, path.relative(extensionsRoot, expectedPackageDir));
		if (!packageRealPath || !isPathInside(extensionsRootRealPath, packageRealPath) || packageRealPath !== expectedPackageRealPath) continue;
		let dependencies;
		try {
			dependencies = await readPackageOpenClawLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			skipped += 1;
			continue;
		}
		if (!Object.hasOwn(dependencies, "openclaw")) continue;
		checked += 1;
		const issue = await auditOpenClawPeerDependencyLink({
			packageDir,
			packageName: pluginId
		});
		if (!issue) continue;
		issues.push(issue);
		if (params.mode !== "repair") continue;
		const result = await linkOpenClawPeerDependencies({
			installedDir: packageDir,
			peerDependencies: dependencies,
			logger: params.logger ?? {}
		});
		repaired += result.repaired;
		skipped += result.skipped;
	}
	return {
		checked,
		repaired,
		skipped,
		issues
	};
}
async function relinkOpenClawPeerDependenciesInManagedNpmRoot(params) {
	let checked = 0;
	let attempted = 0;
	let repaired = 0;
	let skipped = 0;
	for (const packageDir of await listManagedNpmRootPackageDirs(params.npmRoot)) {
		let openClawLinkDependencies;
		try {
			openClawLinkDependencies = await readPackageOpenClawLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			skipped += 1;
			continue;
		}
		if (!Object.hasOwn(openClawLinkDependencies, "openclaw")) continue;
		checked += 1;
		const result = await linkOpenClawPeerDependencies({
			installedDir: packageDir,
			peerDependencies: openClawLinkDependencies,
			logger: params.logger
		});
		attempted += 1;
		repaired += result.repaired;
		skipped += result.skipped;
	}
	return {
		checked,
		attempted,
		repaired,
		skipped
	};
}
async function auditOpenClawPeerDependenciesInManagedNpmRoot(params) {
	const hostRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) return {
		checked: 0,
		broken: 0,
		issues: []
	};
	let checked = 0;
	const issues = [];
	for (const packageDir of await listManagedNpmRootPackageDirs(params.npmRoot)) {
		let openClawLinkDependencies;
		try {
			openClawLinkDependencies = await readPackageOpenClawLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			continue;
		}
		if (!Object.hasOwn(openClawLinkDependencies, "openclaw")) continue;
		checked += 1;
		const issue = await auditOpenClawPeerDependency({
			hostRoot,
			npmRoot: params.npmRoot,
			packageDir
		});
		if (issue) issues.push(issue);
	}
	return {
		checked,
		broken: issues.length,
		issues
	};
}
//#endregion
export { reconcileRegisteredOpenClawHostLinks as a, linkOpenClawPeerDependencies as i, auditOpenClawPeerDependenciesInManagedNpmRoot as n, relinkOpenClawPeerDependenciesInManagedNpmRoot as o, auditOpenClawPeerDependencyLink as r, resolveOpenClawHostDependency as s, auditDeclaredOpenClawHostDependency as t };
