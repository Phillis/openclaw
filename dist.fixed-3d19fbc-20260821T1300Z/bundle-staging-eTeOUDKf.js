import { n as collectPackageDistInventory } from "./package-dist-inventory-BBLuKRGf.js";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/shared/worker-bundle-hash.ts
const WORKER_BUNDLE_MANIFEST_VERSION = "openclaw-worker-bundle-v1";
/** Hashes the canonical worker manifest shared by Gateway bundles and node-local installs. */
function hashWorkerBundleManifest(entries) {
	const hash = createHash("sha256");
	hash.update(`${WORKER_BUNDLE_MANIFEST_VERSION}\0`);
	for (const entry of entries) hash.update(`${entry.path}\0${entry.mode.toString(8)}\0${entry.size}\0${entry.sha256}\0`);
	return hash.digest("hex");
}
//#endregion
//#region src/gateway/worker-environments/bundle-staging.ts
const WORKER_PACKAGE_LIFECYCLE_FIELDS = [
	"devDependencies",
	"scripts",
	"pnpm"
];
const CONTROL_UI_DIST_PREFIX = "dist/control-ui/";
function recordSourceIdentity(identities, entry) {
	identities?.set(`${entry.kind}\0${entry.path}`, entry);
}
async function recordSourceDirectoryIdentity(identities, directoryPath) {
	if (!identities) return;
	const realPath = await fs$1.realpath(directoryPath);
	const stats = await fs$1.lstat(realPath, { bigint: true });
	if (!stats.isDirectory() || stats.isSymbolicLink()) throw new Error(`Unsafe worker bundle directory: ${directoryPath}`);
	recordSourceIdentity(identities, {
		path: realPath,
		realPath,
		kind: "directory",
		...sourceIdentityStats(stats)
	});
}
function sourceIdentityStats(stats) {
	return {
		dev: stats.dev,
		ino: stats.ino,
		mode: stats.mode,
		size: stats.size,
		mtimeNs: stats.mtimeNs,
		ctimeNs: stats.ctimeNs
	};
}
function comparePaths(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
function readManifestDependencies(parsed) {
	return parsed.dependencies && typeof parsed.dependencies === "object" ? parsed.dependencies : {};
}
function withoutLifecycleFields(parsed) {
	const prunedFields = WORKER_PACKAGE_LIFECYCLE_FIELDS.filter((key) => key in parsed);
	const pruned = { ...parsed };
	for (const key of prunedFields) delete pruned[key];
	return {
		pruned,
		prunedFieldCount: prunedFields.length
	};
}
function serializePackageManifest(parsed) {
	return Buffer.from(`${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}
function pruneWorkerPackageManifest(contents, vendoredDirsByName = /* @__PURE__ */ new Map()) {
	const parsed = JSON.parse(contents.toString("utf8"));
	const dependencies = readManifestDependencies(parsed);
	let workspaceSpecCount = 0;
	const portable = {};
	for (const [name, spec] of Object.entries(dependencies)) {
		if (!spec.startsWith("workspace:")) {
			portable[name] = spec;
			continue;
		}
		workspaceSpecCount += 1;
		const vendorDir = vendoredDirsByName.get(name);
		if (vendorDir) portable[name] = `file:./${vendorDir}`;
	}
	const { pruned, prunedFieldCount } = withoutLifecycleFields(parsed);
	if (prunedFieldCount === 0 && workspaceSpecCount === 0) return contents;
	pruned.dependencies = portable;
	return serializePackageManifest(pruned);
}
function normalizePortableMode(mode, relativePath) {
	return relativePath === "openclaw.mjs" || (mode & 73) !== 0 ? 448 : 384;
}
async function stageFileEntry(stagingRoot, source, sourceIdentities) {
	const { sourcePath, expectedRealPath, stagedPath } = source;
	if (await fs$1.realpath(sourcePath) !== expectedRealPath) throw new Error(`Unsafe worker bundle path: ${stagedPath}`);
	const stats = await fs$1.lstat(sourcePath);
	if (stats.isSymbolicLink() || !stats.isFile()) throw new Error(`Unsafe worker bundle path: ${stagedPath}`);
	const handle = await fs$1.open(sourcePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
	let contents;
	let mode;
	try {
		const openedStats = await handle.stat({ bigint: true });
		const currentStats = await fs$1.lstat(sourcePath, { bigint: true });
		const currentRealPath = await fs$1.realpath(sourcePath);
		if (!openedStats.isFile() || currentStats.isSymbolicLink() || !currentStats.isFile() || currentRealPath !== expectedRealPath || currentStats.dev !== openedStats.dev || currentStats.ino !== openedStats.ino) throw new Error(`Worker bundle path changed while packaging: ${stagedPath}`);
		contents = await handle.readFile();
		if (source.transform) contents = source.transform(contents);
		mode = normalizePortableMode(Number(openedStats.mode), stagedPath);
		recordSourceIdentity(sourceIdentities, {
			path: expectedRealPath,
			realPath: currentRealPath,
			kind: "file",
			...sourceIdentityStats(openedStats)
		});
	} finally {
		await handle.close();
	}
	const stagedFilePath = path.join(stagingRoot, ...stagedPath.split("/"));
	await fs$1.mkdir(path.dirname(stagedFilePath), { recursive: true });
	await fs$1.writeFile(stagedFilePath, contents, { mode });
	await fs$1.chmod(stagedFilePath, mode);
	return {
		entry: {
			path: stagedPath,
			mode,
			size: contents.byteLength,
			sha256: createHash("sha256").update(contents).digest("hex")
		},
		contents
	};
}
async function stageManifestEntry(sourceRoot, sourceRootRealPath, stagingRoot, relativePath, transform, sourceIdentities) {
	return await stageFileEntry(stagingRoot, {
		sourcePath: path.join(sourceRoot, relativePath),
		expectedRealPath: path.resolve(sourceRootRealPath, ...relativePath.split("/")),
		stagedPath: relativePath,
		transform
	}, sourceIdentities);
}
const OPENCLAW_IMPORT_SPECIFIER_PATTERN = /["'`](@openclaw\/[a-z0-9-]+)(?:\/[A-Za-z0-9./_-]+)?["'`]/gu;
function collectOpenclawImportSpecifiers(relativePath, contents, into) {
	if (!/\.(?:cjs|js|mjs)$/u.test(relativePath)) return;
	for (const match of contents.toString("utf8").matchAll(OPENCLAW_IMPORT_SPECIFIER_PATTERN)) {
		const packageName = match[1];
		if (packageName) into.add(packageName);
	}
}
function pruneVendoredPackageManifest(packageName, referencedPackages, contents) {
	const parsed = JSON.parse(contents.toString("utf8"));
	for (const [dependencyName, spec] of Object.entries(readManifestDependencies(parsed))) if (spec.startsWith("workspace:") && referencedPackages.has(dependencyName)) throw new Error(`Vendored workspace dependency ${dependencyName} remains referenced by ${packageName} dist; bundle it into the package build or add explicit worker bundle support`);
	return pruneWorkerPackageManifest(contents);
}
async function readWorkspaceDependencyNames(sourceRoot) {
	const raw = await fs$1.readFile(path.join(sourceRoot, "package.json"), "utf8");
	const dependencies = readManifestDependencies(JSON.parse(raw));
	const names = Object.entries(dependencies).filter(([, spec]) => spec.startsWith("workspace:")).map(([name]) => name);
	return new Set(names);
}
async function collectVendoredPackageFiles(packageName, vendorRealRoot, sourceIdentities) {
	const files = ["package.json"];
	const walk = async (relativeDir) => {
		const directoryPath = path.join(vendorRealRoot, ...relativeDir.split("/"));
		await recordSourceDirectoryIdentity(sourceIdentities, directoryPath);
		const dirents = await fs$1.readdir(directoryPath, { withFileTypes: true });
		for (const dirent of dirents) {
			const relativePath = `${relativeDir}/${dirent.name}`;
			if (dirent.isDirectory()) await walk(relativePath);
			else if (dirent.isFile()) files.push(relativePath);
			else throw new Error(`Unsafe worker bundle vendor path: ${packageName}/${relativePath}`);
		}
	};
	try {
		await walk("dist");
	} catch (error) {
		if (error.code === "ENOENT") throw new Error(`Workspace dependency ${packageName} referenced by the worker dist has no built dist directory at ${vendorRealRoot}`, { cause: error });
		throw error;
	}
	return files.toSorted(comparePaths);
}
async function stageVendoredWorkspacePackages(params) {
	const entries = [];
	const vendoredDirsByName = /* @__PURE__ */ new Map();
	for (const packageName of [...params.packageNames].toSorted(comparePaths)) {
		const linkedPath = path.join(params.sourceRoot, "node_modules", ...packageName.split("/"));
		let vendorRealRoot;
		try {
			vendorRealRoot = await fs$1.realpath(linkedPath);
		} catch (error) {
			throw new Error(`Worker bundle cannot resolve workspace dependency ${packageName} referenced by dist; expected an installed package at ${linkedPath}`, { cause: error });
		}
		const vendorDir = `vendor/${packageName.replace(/^@/u, "").replaceAll("/", "-")}`;
		const files = await collectVendoredPackageFiles(packageName, vendorRealRoot, params.sourceIdentities);
		const referencedPackages = /* @__PURE__ */ new Set();
		for (const relativePath of files.filter((candidate) => candidate !== "package.json")) {
			const { entry, contents } = await stageFileEntry(params.stagingRoot, {
				sourcePath: path.join(vendorRealRoot, ...relativePath.split("/")),
				expectedRealPath: path.resolve(vendorRealRoot, ...relativePath.split("/")),
				stagedPath: `${vendorDir}/${relativePath}`
			}, params.sourceIdentities);
			collectOpenclawImportSpecifiers(relativePath, contents, referencedPackages);
			entries.push(entry);
		}
		const { entry: packageManifestEntry } = await stageFileEntry(params.stagingRoot, {
			sourcePath: path.join(vendorRealRoot, "package.json"),
			expectedRealPath: path.resolve(vendorRealRoot, "package.json"),
			stagedPath: `${vendorDir}/package.json`,
			transform: (contents) => pruneVendoredPackageManifest(packageName, referencedPackages, contents)
		}, params.sourceIdentities);
		entries.push(packageManifestEntry);
		vendoredDirsByName.set(packageName, vendorDir);
	}
	return {
		entries,
		vendoredDirsByName
	};
}
async function collectWorkerBundleManifestInternal(sourceRoot, stagingRoot, sourceIdentities) {
	const sourceRootRealPath = await fs$1.realpath(sourceRoot);
	const distFiles = (await collectPackageDistInventory(sourceRoot, { onDirectory: async (directoryPath) => await recordSourceDirectoryIdentity(sourceIdentities, directoryPath) })).filter((relativePath) => !relativePath.startsWith(CONTROL_UI_DIST_PREFIX));
	if (distFiles.length === 0) throw new Error(`OpenClaw worker bundle has no packaged dist files; build the running package at ${sourceRoot}`);
	const referencedPackages = /* @__PURE__ */ new Set();
	const entries = [];
	for (const relativePath of ["openclaw.mjs", ...distFiles].toSorted(comparePaths)) {
		const { entry, contents } = await stageManifestEntry(sourceRoot, sourceRootRealPath, stagingRoot, relativePath, void 0, sourceIdentities);
		collectOpenclawImportSpecifiers(relativePath, contents, referencedPackages);
		entries.push(entry);
	}
	const vendored = await stageVendoredWorkspacePackages({
		sourceRoot,
		stagingRoot,
		packageNames: [...await readWorkspaceDependencyNames(sourceRoot)].filter((name) => referencedPackages.has(name)),
		sourceIdentities
	});
	entries.push(...vendored.entries);
	const manifest = await stageManifestEntry(sourceRoot, sourceRootRealPath, stagingRoot, "package.json", (contents) => pruneWorkerPackageManifest(contents, vendored.vendoredDirsByName), sourceIdentities);
	entries.push(manifest.entry);
	return entries.toSorted((left, right) => comparePaths(left.path, right.path));
}
async function collectWorkerBundleManifest(sourceRoot, stagingRoot) {
	return await collectWorkerBundleManifestInternal(sourceRoot, stagingRoot);
}
async function collectWorkerBundleManifestWithSourceIdentity(sourceRoot, stagingRoot) {
	const identities = /* @__PURE__ */ new Map();
	return {
		manifest: await collectWorkerBundleManifestInternal(sourceRoot, stagingRoot, identities),
		sourceIdentity: [...identities.values()].toSorted((left, right) => comparePaths(`${left.kind}\0${left.path}`, `${right.kind}\0${right.path}`))
	};
}
//#endregion
export { hashWorkerBundleManifest as a, WORKER_BUNDLE_MANIFEST_VERSION as i, collectWorkerBundleManifestWithSourceIdentity as n, comparePaths as r, collectWorkerBundleManifest as t };
