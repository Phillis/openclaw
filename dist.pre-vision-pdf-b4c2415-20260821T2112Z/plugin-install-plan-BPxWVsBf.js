import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { r as parseGitPluginSpec } from "./git-install-C9WVvj3s.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import { t as findBundledPluginSource } from "./bundled-sources-C9V3iC71.js";
import { a as resolveCatalogOfficialExternalInstallPlan, i as resolveOpenClawTrustedNpmPackageInstall } from "./install-provenance-5w7YB8TZ.js";
import { z as PLUGIN_INSTALL_ERROR_CODE } from "./install-managed-npm-state-Jj1GJhPR.js";
import "./install-DeEAX-7s.js";
import { c as parseNpmPrefixSpec, l as resolveFileNpmSpecToLocalPath, s as parseNpmPackPrefixPath } from "./plugins-command-helpers-Ck_Lz7c8.js";
import fs from "node:fs";
import path from "node:path";
//#region src/cli/install-spec.ts
/** Detect specs that should be interpreted as local file/path installs. */
function looksLikeLocalInstallSpec(spec, knownSuffixes) {
	return spec.startsWith(".") || spec.startsWith("~") || path.isAbsolute(spec) || knownSuffixes.some((suffix) => spec.endsWith(suffix));
}
//#endregion
//#region src/cli/plugin-install-plan.ts
function sourcePlan(request, raw, sourceClass) {
	return {
		ok: true,
		request,
		...sourceClass ? { acknowledgement: {
			sourceClass,
			spec: raw
		} } : {}
	};
}
function resolvePluginInstallSourcePlan(params) {
	const fileSpec = resolveFileNpmSpecToLocalPath(params.raw);
	if (fileSpec && !fileSpec.ok) return fileSpec;
	const resolved = resolveUserPath(fileSpec?.ok ? fileSpec.path : params.raw);
	if (fs.existsSync(resolved)) {
		const recordSource = resolveArchiveKind(resolved) ? "archive" : "path";
		const bundled = recordSource === "path" ? findBundledPluginSource({ lookup: {
			kind: "localPath",
			value: resolved
		} }) : void 0;
		return sourcePlan({
			source: "local",
			path: resolved,
			recordSource,
			mode: params.mode,
			...params.link ? { link: true } : {}
		}, params.raw, bundled ? void 0 : recordSource === "archive" ? "local-archive" : "local-path");
	}
	const npmPackPath = parseNpmPackPrefixPath(params.raw);
	if (npmPackPath !== null) return npmPackPath ? sourcePlan({
		source: "npm-pack",
		archivePath: npmPackPath,
		mode: params.mode
	}, params.raw, "npm-pack") : {
		ok: false,
		error: "Unsupported npm-pack plugin spec: missing archive path."
	};
	const gitPrefix = params.raw.trim().toLowerCase().startsWith("git:");
	const git = parseGitPluginSpec(params.raw);
	if (gitPrefix) return git ? sourcePlan({
		source: "git",
		spec: params.raw,
		mode: params.mode
	}, params.raw, "git") : {
		ok: false,
		error: `unsupported git: plugin spec: ${params.raw}`
	};
	const clawhubPrefix = params.raw.trim().toLowerCase().startsWith("clawhub:");
	const clawhub = parseClawHubPluginSpec(params.raw);
	if (clawhubPrefix) return clawhub ? sourcePlan({
		source: "clawhub",
		spec: params.raw,
		mode: params.mode
	}, params.raw) : {
		ok: false,
		error: `Unsupported ClawHub plugin spec: ${params.raw}`
	};
	const explicitNpm = parseNpmPrefixSpec(params.raw);
	if (explicitNpm !== null && !explicitNpm) return {
		ok: false,
		error: "Unsupported npm plugin spec: missing package."
	};
	if (explicitNpm === null && looksLikeLocalInstallSpec(params.raw, [
		".ts",
		".js",
		".mjs",
		".cjs",
		".tgz",
		".tar.gz",
		".tar",
		".zip"
	])) return {
		ok: false,
		error: `Plugin path not found: ${resolved}`
	};
	const npmSpec = explicitNpm ?? params.raw;
	const bundledPlan = explicitNpm === null ? resolveBundledInstallPlanBeforeNpm({
		rawSpec: params.raw,
		findBundledSource: (lookup) => findBundledPluginSource({ lookup })
	}) : null;
	if (bundledPlan) return sourcePlan({
		source: "bundled",
		rawSpec: params.raw,
		bundledSource: bundledPlan.bundledSource,
		warning: bundledPlan.warning
	}, params.raw);
	const official = explicitNpm === null ? resolveCatalogOfficialExternalInstallPlan(params.raw) : null;
	if (official) return sourcePlan({
		source: "official",
		spec: official.npmSpec,
		pluginId: official.pluginId,
		mode: params.mode,
		...official.expectedIntegrity ? { expectedIntegrity: official.expectedIntegrity } : {},
		...params.pin ? { pin: true } : {}
	}, params.raw);
	const trusted = resolveOpenClawTrustedNpmPackageInstall(npmSpec);
	return sourcePlan({
		source: "npm",
		spec: npmSpec,
		mode: params.mode,
		...params.pin ? { pin: true } : {},
		...explicitNpm === null ? { allowBundledFallback: true } : {},
		...trusted ? {
			expectedPluginId: trusted.pluginId,
			...trusted.expectedIntegrity ? { expectedIntegrity: trusted.expectedIntegrity } : {},
			trustedSourceLinkedOfficialInstall: true
		} : {}
	}, params.raw, trusted ? void 0 : "npm");
}
function isBareNpmPackageName(spec) {
	const trimmed = spec.trim();
	return /^[a-z0-9][a-z0-9-._~]*$/.test(trimmed);
}
function isSourceCheckoutBundledPath(localPath) {
	const extensionsDir = path.dirname(path.resolve(localPath));
	if (path.basename(extensionsDir) !== "extensions") return false;
	const extensionsParent = path.dirname(extensionsDir);
	const packageRoot = ["dist", "dist-runtime"].includes(path.basename(extensionsParent)) ? path.dirname(extensionsParent) : extensionsParent;
	try {
		return JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).name === "openclaw" && fs.existsSync(path.join(packageRoot, ".git")) && fs.existsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && fs.existsSync(path.join(packageRoot, "src")) && fs.existsSync(path.join(packageRoot, "extensions"));
	} catch {
		return false;
	}
}
function resolveBundledInstallPlanForCatalogEntry(params) {
	const pluginId = params.pluginId.trim();
	const npmSpec = params.npmSpec.trim();
	if (!pluginId || !npmSpec) return null;
	const bundledBySpec = params.findBundledSource({
		kind: "npmSpec",
		value: npmSpec
	});
	if (bundledBySpec?.pluginId === pluginId) return { bundledSource: bundledBySpec };
	const bundledById = params.findBundledSource({
		kind: "pluginId",
		value: pluginId
	});
	if (bundledById?.pluginId !== pluginId) return null;
	if (bundledById.npmSpec && bundledById.npmSpec !== npmSpec) return null;
	return { bundledSource: bundledById };
}
function resolveBundledInstallPlanBeforeNpm(params) {
	const rawSpec = params.rawSpec.trim();
	if (!rawSpec) return null;
	if (isBareNpmPackageName(rawSpec)) {
		const bundledSource = params.findBundledSource({
			kind: "pluginId",
			value: rawSpec
		});
		if (!bundledSource) return null;
		return {
			bundledSource,
			warning: `Using bundled plugin "${bundledSource.pluginId}" from ${shortenHomePath(bundledSource.localPath)} for bare install spec "${rawSpec}". To install an npm package with the same name, use a scoped package name (for example @scope/${rawSpec}).`
		};
	}
	const parsedNpmSpec = parseRegistryNpmSpec(rawSpec);
	if (!parsedNpmSpec) return null;
	const bundledSource = params.findBundledSource({
		kind: "npmSpec",
		value: rawSpec
	}) ?? params.findBundledSource({
		kind: "npmSpec",
		value: parsedNpmSpec.name
	});
	if (!bundledSource) return null;
	if (!isBareNpmPackageName(params.rawSpec) && isSourceCheckoutBundledPath(bundledSource.localPath)) return null;
	return {
		bundledSource,
		warning: `Using bundled plugin "${bundledSource.pluginId}" from ${shortenHomePath(bundledSource.localPath)} for npm install spec "${rawSpec}" because this plugin ships with the current OpenClaw build. To force an external npm override, use npm:${rawSpec}.`
	};
}
function resolveBundledInstallPlanForNpmFailure(params) {
	if (params.code !== PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND) return null;
	const bundledSource = params.findBundledSource({
		kind: "npmSpec",
		value: params.rawSpec
	});
	if (!bundledSource) return null;
	if (!isBareNpmPackageName(params.rawSpec) && isSourceCheckoutBundledPath(bundledSource.localPath)) return null;
	return {
		bundledSource,
		warning: `npm package unavailable for ${params.rawSpec}; using bundled plugin at ${shortenHomePath(bundledSource.localPath)}.`
	};
}
//#endregion
export { resolveBundledInstallPlanForNpmFailure as n, resolvePluginInstallSourcePlan as r, resolveBundledInstallPlanForCatalogEntry as t };
