import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { i as isOpenClawOrgNpmSpec, s as parseRegistryNpmSpec } from "./npm-registry-spec-BdgyvSs0.js";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-DllFtsSG.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { t as clearLoadInstalledPluginIndexInstallRecordsCache } from "./installed-plugin-index-record-cache-Dy20sC-s.js";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-BlJhejU6.js";
import { t as enableExplicitlySelectedPluginInConfig } from "./enable-Cs_eB1UN.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-HeQJZ2vC.js";
import { f as recordPluginInstall, l as buildNpmResolutionInstallFields, p as resolveNpmInstallRecordSpec } from "./installed-plugin-index-records-CHK-Mu2-.js";
import "./with-timeout-DH-MyY5v.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-QVxAzcU7.js";
import { n as t } from "./i18n-BQpjgFU-.js";
import { a as resolveBundledPluginSources, n as findBundledPluginSourceInMap } from "./bundled-sources-8oSxLSsI.js";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-C2sZ7kh_.js";
import { n as WizardCancelledError, r as WizardNavigationError } from "./prompts-DLsO8MlU.js";
import { n as capturePluginCapabilityConsentHandlerErrors, s as prepareManagedPluginArtifactConsentHandler } from "./capability-consent-WudatxYT.js";
import { B as isUnavailableNpmTarget } from "./install-managed-npm-state-BKmVpI9X.js";
import { t as invalidatePluginRuntimeDiscoveryAfterConfigMutation } from "./registry-refresh-Hpdl6ZAz.js";
import { i as installPluginFromNpmPackArchive, r as installPluginFromNpmSpec } from "./install-DJ6ueg-H.js";
import { t as resolveBundledInstallPlanForCatalogEntry } from "./plugin-install-plan-Dz2XWMPo.js";
import { n as isUnavailableClawHubTarget, t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-Bqqw9uh0.js";
import { f as resolveRegistryUpdateChannel, l as normalizeUpdateChannel } from "./update-channels-D2-WrHya.js";
import { i as buildClawHubPluginInstallRecordFields, n as resolveClawHubInstallSpecsForUpdateChannel, r as resolveNpmInstallSpecsForUpdateChannel, t as installWithChannelFallback } from "./install-channel-specs-DvTjoiME.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/install-overrides.ts
/** Env var containing JSON plugin install override specs. */
const PLUGIN_INSTALL_OVERRIDES_ENV = "OPENCLAW_PLUGIN_INSTALL_OVERRIDES";
/** Env var gate that must be enabled before install overrides are honored. */
const ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV = "OPENCLAW_ALLOW_PLUGIN_INSTALL_OVERRIDES";
function overrideAllowed(env) {
	return env[ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV]?.trim() === "1";
}
function parseOverrideSpec(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (trimmed.startsWith("npm:")) {
		const spec = trimmed.slice(4).trim();
		return spec && parseRegistryNpmSpec(spec) ? {
			kind: "npm",
			spec
		} : null;
	}
	if (trimmed.startsWith("npm-pack:")) {
		const rawPath = trimmed.slice(9).trim();
		if (!rawPath) return null;
		return {
			kind: "npm-pack",
			archivePath: path.resolve(resolveUserPath(rawPath))
		};
	}
	return null;
}
/** Resolves a gated plugin install override from environment configuration. */
function resolvePluginInstallOverride(params) {
	const env = params.env ?? process.env;
	if (!overrideAllowed(env)) return null;
	const raw = env[PLUGIN_INSTALL_OVERRIDES_ENV]?.trim();
	if (!raw) return null;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!isRecord(parsed)) return null;
	const value = parsed[params.pluginId];
	return typeof value === "string" ? parseOverrideSpec(value) : null;
}
//#endregion
//#region src/commands/onboarding-plugin-install.ts
/**
* Onboarding plugin installation flow.
*
* It selects local, ClawHub, npm, or override install sources; records durable
* install metadata; and enables plugins requested by setup workflows.
*/
const ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS = 300 * 1e3;
const ONBOARDING_PLUGIN_INSTALL_WATCHDOG_TIMEOUT_MS = 305e3;
function incompletePluginInstall(cfg, pluginId, status, error) {
	return {
		cfg,
		installed: false,
		pluginId,
		status,
		...error === void 0 ? {} : { error }
	};
}
async function markOnboardingPluginInstalled(params) {
	clearLoadInstalledPluginIndexInstallRecordsCache();
	clearPluginMetadataLifecycleCaches();
	await invalidatePluginRuntimeDiscoveryAfterConfigMutation({ logger: { warn: (message) => params.runtime.log(message) } });
	return {
		cfg: params.cfg,
		installed: true,
		pluginId: params.pluginId,
		status: "installed"
	};
}
function shouldFallbackClawHubToNpm(params) {
	if (!isOpenClawOrgNpmSpec(params.npmSpec)) return false;
	return params.result.code === CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND || params.result.code === CLAWHUB_INSTALL_ERROR_CODE.VERSION_NOT_FOUND || params.result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE || params.result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE;
}
function readInstallFailureWarning(result) {
	if (result.ok || !("warning" in result) || typeof result.warning !== "string") return;
	return result.warning;
}
function resolveRealDirectory(dir) {
	try {
		const resolved = fs.realpathSync(dir);
		return fs.statSync(resolved).isDirectory() ? resolved : null;
	} catch {
		return null;
	}
}
function resolveGitDirectoryMarker(dir) {
	const marker = path.join(dir, ".git");
	try {
		const stat = fs.statSync(marker);
		if (stat.isDirectory()) return resolveRealDirectory(marker);
		if (!stat.isFile()) return null;
		const content = fs.readFileSync(marker, "utf8").trim();
		const match = /^gitdir:\s*(.+)$/i.exec(content);
		if (!match) return null;
		const gitDir = match[1]?.trim();
		if (!gitDir) return null;
		return resolveRealDirectory(path.isAbsolute(gitDir) ? gitDir : path.resolve(dir, gitDir));
	} catch {
		return null;
	}
}
function hasTrustedGitWorkspace(root) {
	const realRoot = resolveRealDirectory(root);
	if (!realRoot) return false;
	for (let dir = realRoot;; dir = path.dirname(dir)) {
		if (resolveGitDirectoryMarker(dir)) return true;
		if (path.dirname(dir) === dir) return false;
	}
}
function hasGitWorkspace(workspaceDir) {
	const roots = [process.cwd()];
	if (workspaceDir && workspaceDir !== process.cwd()) roots.push(workspaceDir);
	return roots.some((root) => hasTrustedGitWorkspace(root));
}
function addPluginLoadPath(cfg, pluginPath) {
	const merged = uniqueStrings([...cfg.plugins?.load?.paths ?? [], pluginPath]);
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			load: {
				...cfg.plugins?.load,
				paths: merged
			}
		}
	};
}
function pathsReferToSameDirectory(left, right) {
	if (!left || !right) return false;
	const realLeft = resolveRealDirectory(left);
	const realRight = resolveRealDirectory(right);
	return Boolean(realLeft && realRight && realLeft === realRight);
}
function formatPortableLocalPath(localPath, workspaceDir) {
	const bases = [workspaceDir, process.cwd()].filter((entry) => Boolean(entry));
	for (const base of bases) {
		const realBase = resolveRealDirectory(base);
		if (!realBase) continue;
		if (isPathInside(realBase, localPath)) {
			const portable = path.relative(realBase, localPath).split(path.sep).join("/");
			return portable ? `./${portable}` : ".";
		}
	}
}
function resolveLocalPath(params) {
	if (!params.allowLocal) return null;
	const raw = params.entry.install.localPath?.trim();
	if (!raw) return null;
	const candidates = /* @__PURE__ */ new Set();
	const bases = [process.cwd()];
	if (params.workspaceDir && params.workspaceDir !== process.cwd()) bases.push(params.workspaceDir);
	for (const base of bases) {
		const realBase = resolveRealDirectory(base);
		if (!realBase) continue;
		candidates.add(path.resolve(realBase, raw));
	}
	for (const candidate of candidates) try {
		const resolved = fs.realpathSync(candidate);
		if (!bases.some((base) => {
			const realBase = resolveRealDirectory(base);
			return realBase ? isPathInside(realBase, resolved) : false;
		})) continue;
		if (fs.statSync(resolved).isDirectory()) return resolved;
	} catch {
		continue;
	}
	return null;
}
function resolveBundledLocalPath(params) {
	const bundledSources = resolveBundledPluginSources({ workspaceDir: params.workspaceDir });
	const npmSpec = params.entry.install.npmSpec?.trim();
	if (npmSpec) return resolveBundledInstallPlanForCatalogEntry({
		pluginId: params.entry.pluginId,
		npmSpec,
		findBundledSource: (lookup) => findBundledPluginSourceInMap({
			bundled: bundledSources,
			lookup
		})
	})?.bundledSource.localPath ?? null;
	return findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "pluginId",
			value: params.entry.pluginId
		}
	})?.localPath ?? null;
}
function resolveNpmSpecForOnboarding(install) {
	const npmSpec = install.npmSpec?.trim();
	if (!npmSpec) return null;
	return parseRegistryNpmSpec(npmSpec) ? npmSpec : null;
}
function resolveClawHubSpecForOnboarding(install) {
	const clawhubSpec = install.clawhubSpec?.trim();
	if (!clawhubSpec) return null;
	return parseClawHubPluginSpec(clawhubSpec) ? clawhubSpec : null;
}
function resolveInstallDefaultChoice(params) {
	const { cfg, entry, localPath, bundledLocalPath, hasClawHubSpec, hasNpmSpec } = params;
	const hasRemoteSpec = hasClawHubSpec || hasNpmSpec;
	const entryDefault = entry.install.defaultChoice;
	const remoteDefault = () => {
		if (entryDefault === "clawhub" && hasClawHubSpec) return "clawhub";
		if (entryDefault === "npm" && hasNpmSpec) return "npm";
		return hasNpmSpec ? "npm" : "clawhub";
	};
	if (!hasRemoteSpec) return localPath ? "local" : "skip";
	if (!localPath) return remoteDefault();
	if (bundledLocalPath) return "local";
	const updateChannel = cfg.update?.channel;
	if (updateChannel === "dev") return "local";
	if (updateChannel === "stable" || updateChannel === "extended-stable" || updateChannel === "beta") return remoteDefault();
	if (entryDefault === "local") return "local";
	return remoteDefault();
}
async function promptInstallChoice(params) {
	const rawClawHubSpec = resolveClawHubSpecForOnboarding(params.entry.install);
	const rawNpmSpec = resolveNpmSpecForOnboarding(params.entry.install);
	const clawhubSpec = params.bundledLocalPath ? null : params.effectiveClawHubSpec ?? rawClawHubSpec;
	const npmSpec = params.bundledLocalPath ? null : params.effectiveNpmSpec ?? rawNpmSpec;
	const safeLabel = sanitizeTerminalText(params.entry.label);
	const safeClawHubSpec = clawhubSpec ? sanitizeTerminalText(clawhubSpec) : null;
	const safeNpmSpec = npmSpec ? sanitizeTerminalText(npmSpec) : null;
	const safeLocalPath = params.localPath ? sanitizeTerminalText(params.localPath) : null;
	const options = [];
	if (safeClawHubSpec) options.push({
		value: "clawhub",
		label: t("wizard.plugins.downloadFromClawHub", { spec: safeClawHubSpec })
	});
	if (safeNpmSpec) options.push({
		value: "npm",
		label: t("wizard.plugins.downloadFromNpm", { spec: safeNpmSpec })
	});
	if (params.localPath) options.push({
		value: "local",
		label: t("wizard.plugins.useLocalPluginPath"),
		...safeLocalPath ? { hint: safeLocalPath } : {}
	});
	if (params.autoConfirmSingleSource) {
		const realSources = [];
		if (safeClawHubSpec) realSources.push("clawhub");
		if (safeNpmSpec) realSources.push("npm");
		if (params.localPath) realSources.push("local");
		if (realSources.length === 1) return expectDefined(realSources[0], "real sources entry at 0");
	}
	options.push({
		value: "skip",
		label: t("common.skipForNow")
	});
	const initialValue = params.defaultChoice === "local" && !params.localPath ? clawhubSpec ? "clawhub" : npmSpec ? "npm" : "skip" : params.defaultChoice === "clawhub" && !clawhubSpec ? npmSpec ? "npm" : params.localPath ? "local" : "skip" : params.defaultChoice === "npm" && !npmSpec ? clawhubSpec ? "clawhub" : params.localPath ? "local" : "skip" : params.defaultChoice;
	return await params.prompter.select({
		message: t("wizard.plugins.installPluginPrompt", { plugin: safeLabel }),
		options,
		initialValue
	});
}
function formatDurationLabel(timeoutMs) {
	if (timeoutMs % 6e4 === 0) {
		const minutes = timeoutMs / 6e4;
		return t(minutes === 1 ? "common.minute" : "common.minutes", { count: minutes });
	}
	const seconds = Math.round(timeoutMs / 1e3);
	return t(seconds === 1 ? "common.second" : "common.seconds", { count: seconds });
}
function formatPluginInstallProgress(label) {
	return t("wizard.plugins.installingPlugin", { plugin: label });
}
function formatPluginInstalled(label) {
	return t("wizard.plugins.installedPlugin", { plugin: label });
}
function formatPluginInstallFailed(label) {
	return t("wizard.plugins.installFailedShort", { plugin: label });
}
function formatPluginInstallTimedOut(label) {
	return t("wizard.plugins.installTimedOutShort", { plugin: label });
}
function formatPluginInstallTimedOutNote(spec) {
	return [t("wizard.plugins.installTimedOut", {
		spec,
		duration: formatDurationLabel(ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS)
	}), t("wizard.plugins.returningToSelection")].join("\n");
}
function summarizeInstallError(message) {
	const cleaned = sanitizeTerminalText(message).replace(/^Install failed(?:\s*\([^)]*\))?\s*:?\s*/i, "").trim();
	if (!cleaned) return "Unknown install failure";
	return cleaned.length > 180 ? `${truncateUtf16Safe(cleaned, 179)}…` : cleaned;
}
const ONBOARDING_PLUGIN_INSTALL_ERROR_MAX_CHARS = 12e3;
function formatInstallErrorDetail(message) {
	const cleaned = message.replace(/\r\n?/g, "\n").split("\n").map((line) => sanitizeTerminalText(line)).join("\n").trim();
	if (cleaned.length <= ONBOARDING_PLUGIN_INSTALL_ERROR_MAX_CHARS) return cleaned;
	return `${truncateUtf16Safe(cleaned, ONBOARDING_PLUGIN_INSTALL_ERROR_MAX_CHARS - 31).trimEnd()}
… (installer output truncated)`;
}
async function notePluginInstallFailure(prompter, spec, error) {
	await prompter.note([t("wizard.plugins.installFailed", {
		spec: sanitizeTerminalText(spec),
		error: summarizeInstallError(error)
	}), t("wizard.plugins.returningToSelection")].join("\n"), t("wizard.plugins.installTitle"));
}
function isTimeoutError(error) {
	return error instanceof Error && error.message === "timeout";
}
async function applyPluginEnablement(params) {
	const enableResult = enableExplicitlySelectedPluginInConfig(params.cfg, params.pluginId);
	if (enableResult.enabled) return enableResult;
	const safeLabel = sanitizeTerminalText(params.label);
	const reason = enableResult.reason ?? "plugin disabled";
	await params.prompter.note(t("wizard.plugins.enableFailed", {
		plugin: safeLabel,
		reason
	}), t("wizard.plugins.installTitle"));
	params.runtime.error?.(`Plugin install failed: ${sanitizeTerminalText(params.pluginId)} is disabled (${reason}).`);
	return enableResult;
}
async function finishOnboardingPluginInstall(params) {
	const enableResult = await applyPluginEnablement(params);
	if (!enableResult.enabled) return incompletePluginInstall(enableResult.config, params.pluginId, "failed");
	return await markOnboardingPluginInstalled({
		cfg: params.install ? recordPluginInstall(enableResult.config, params.install) : await params.prepareConfig?.(enableResult.config) ?? enableResult.config,
		pluginId: params.pluginId,
		runtime: params.runtime
	});
}
async function installLocalOnboardingPlugin(params) {
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	try {
		return await finishOnboardingPluginInstall({
			cfg: params.cfg,
			pluginId: params.entry.pluginId,
			label: params.entry.label,
			prompter: params.prompter,
			runtime: params.runtime,
			prepareConfig: async (cfg) => {
				if (pathsReferToSameDirectory(params.localPath, params.bundledLocalPath)) return cfg;
				const capabilityConsent = await prepareManagedPluginArtifactConsentHandler({
					config: params.cfg,
					source: "path",
					spec: params.npmSpec ?? params.localPath,
					onCapabilityConsent: consent.onCapabilityConsent
				});
				await capabilityConsent.onBeforePluginArtifactCommit({
					pluginId: params.entry.pluginId,
					stagedArtifactDir: params.localPath,
					mode: "install"
				});
				const sourcePath = formatPortableLocalPath(params.localPath, params.workspaceDir);
				return recordPluginInstall(addPluginLoadPath(cfg, params.localPath), capabilityConsent.applyAcceptedSurface(params.entry.pluginId, {
					pluginId: params.entry.pluginId,
					source: "path",
					installPath: params.localPath,
					...sourcePath ? { sourcePath } : {},
					...params.npmSpec ? { spec: params.npmSpec } : {}
				}));
			}
		});
	} catch (error) {
		consent.rethrowCallbackError();
		const detail = error instanceof Error ? error.message : String(error);
		await notePluginInstallFailure(params.prompter, params.localPath, detail);
		return incompletePluginInstall(params.cfg, params.entry.pluginId, "failed", formatInstallErrorDetail(detail));
	}
}
const PROGRESS_BAR_WIDTH = 16;
const PROGRESS_BAR_TICK_MS = 200;
const PROGRESS_BAR_DURATION_MS = 1e4;
const PROGRESS_BAR_MAX_PERCENT = 99;
/** Shortens known install steps while preserving unfamiliar output verbatim. */
function shortenInstallLabel(message) {
	const trimmed = message.trim();
	for (const [pattern, label] of [
		[/^Downloading\b/i, "Downloading"],
		[/^Extracting\b/i, "Extracting"],
		[/^Installing\s+to\b/i, "Installing"],
		[/^Installing\b/i, "Installing"],
		[/^Resolving\b/i, "Resolving"],
		[/^Cloning\b/i, "Cloning"],
		[/^Verifying\b/i, "Verifying"],
		[/^Preparing\b/i, "Preparing"],
		[/^Linking\b/i, "Linking"],
		[/^Linked\b/i, "Linking"],
		[/^npm rejected managed npm alias overrides\b/i, "Retrying"],
		[/^Compatibility\b/i, "Resolving"],
		[/^ClawHub\b/i, "Resolving"]
	]) if (pattern.test(trimmed)) return label;
	return trimmed;
}
/** Adds a steadily growing, 99%-capped bar between coarse installer updates. */
function createAnimatedInstallProgress(progress, options = {}) {
	const totalMs = options.totalMs ?? PROGRESS_BAR_DURATION_MS;
	let currentLabel = "";
	const startedAt = Date.now();
	const computePercent = () => {
		const elapsed = Date.now() - startedAt;
		const raw = Math.floor(elapsed / totalMs * 100);
		return Math.max(0, Math.min(PROGRESS_BAR_MAX_PERCENT, raw));
	};
	const renderBar = () => {
		const percent = computePercent();
		const filled = Math.round(percent / 100 * PROGRESS_BAR_WIDTH);
		return `[${"█".repeat(filled) + "░".repeat(Math.max(0, PROGRESS_BAR_WIDTH - filled))}] ${percent}%`;
	};
	const decorate = (label) => {
		if (!label) return renderBar();
		return `${label}  ${renderBar()}`;
	};
	const timer = setInterval(() => {
		if (currentLabel) progress.update(decorate(currentLabel));
	}, PROGRESS_BAR_TICK_MS);
	if (typeof timer.unref === "function") timer.unref();
	return {
		setLabel: (label) => {
			currentLabel = label;
			progress.update(label);
		},
		stop: () => {
			clearInterval(timer);
		}
	};
}
function logInstallWarningWithSpacing(runtime, message) {
	const sanitized = sanitizeTerminalText(message).trim();
	if (!sanitized) return;
	runtime.log?.(`${sanitized}\n`);
}
function logInstallWarningWithLineBreaks(runtime, message) {
	const sanitized = message.split("\n").map((line) => sanitizeTerminalText(line)).join("\n").trim();
	if (!sanitized) return;
	runtime.log?.(`${sanitized}\n`);
}
function isReviewRequiredClawHubTrustWarning(message) {
	return message.includes("WARNING - ClawHub found security risks");
}
function isClawHubTrustWarning(message) {
	return isReviewRequiredClawHubTrustWarning(message) || message.includes("BLOCKED - ClawHub") || message.includes("REVIEW RECOMMENDED - ClawHub");
}
async function runInstallWatchdog(install) {
	const controller = new AbortController();
	const ownedInstallPromise = install(controller.signal);
	try {
		return await withTimeout(ownedInstallPromise, ONBOARDING_PLUGIN_INSTALL_WATCHDOG_TIMEOUT_MS);
	} catch (error) {
		if (isTimeoutError(error)) {
			controller.abort();
			await ownedInstallPromise.catch(() => void 0);
		}
		throw error;
	}
}
async function runOnboardingPluginInstallWithProgress(params) {
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	const capabilityConsent = await prepareManagedPluginArtifactConsentHandler({
		config: params.cfg,
		source: "npm",
		spec: params.spec,
		expectedIntegrity: params.entry.install.expectedIntegrity,
		onCapabilityConsent: consent.onCapabilityConsent
	});
	const safeLabel = sanitizeTerminalText(params.entry.label);
	const progress = params.prompter.progress(formatPluginInstallProgress(safeLabel));
	const animated = createAnimatedInstallProgress(progress);
	animated.setLabel(t("wizard.plugins.preparingInstall"));
	const updateProgress = (message) => {
		const sanitized = sanitizeTerminalText(message).trim();
		if (!sanitized) return;
		animated.setLabel(shortenInstallLabel(sanitized));
	};
	try {
		const result = await runInstallWatchdog((signal) => params.install({
			info: updateProgress,
			warn: (message) => {
				updateProgress(message);
				logInstallWarningWithSpacing(params.runtime, message);
			}
		}, signal, capabilityConsent.onBeforePluginArtifactCommit));
		progress.stop(result.ok ? formatPluginInstalled(safeLabel) : formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		return {
			status: "completed",
			result,
			capabilityConsent
		};
	} catch (error) {
		progress.stop(isTimeoutError(error) ? formatPluginInstallTimedOut(safeLabel) : formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		if (isTimeoutError(error)) return { status: "timed_out" };
		if (params.rethrowUnexpectedErrors && !(error instanceof ManagedPluginLifecycleError)) throw error;
		return {
			status: "completed",
			capabilityConsent,
			result: {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			}
		};
	} finally {
		animated.stop();
	}
}
async function installPluginFromNpmSpecWithProgress(params) {
	return await runOnboardingPluginInstallWithProgress({
		...params,
		spec: params.npmSpec,
		install: (logger, signal, onBeforePluginArtifactCommit) => installPluginFromNpmSpec({
			spec: params.npmSpec,
			mode: "update",
			config: params.cfg,
			timeoutMs: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS,
			expectedPluginId: params.entry.pluginId,
			expectedIntegrity: params.entry.install.expectedIntegrity,
			...params.trustedSourceLinkedOfficialInstall ?? params.entry.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
			extensionsDir: resolveDefaultPluginExtensionsDir(),
			logger,
			signal,
			onBeforePluginArtifactCommit
		})
	});
}
async function installPluginFromNpmPackArchiveWithProgress(params) {
	return await runOnboardingPluginInstallWithProgress({
		...params,
		spec: `npm-pack:${params.archivePath}`,
		install: (logger, signal, onBeforePluginArtifactCommit) => installPluginFromNpmPackArchive({
			archivePath: params.archivePath,
			timeoutMs: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS,
			config: params.cfg,
			expectedPluginId: params.entry.pluginId,
			expectedIntegrity: params.entry.install.expectedIntegrity,
			extensionsDir: resolveDefaultPluginExtensionsDir(),
			logger,
			signal,
			onBeforePluginArtifactCommit
		}),
		rethrowUnexpectedErrors: true
	});
}
async function installPluginFromOverride(params) {
	const { entry, prompter, runtime } = params;
	runtime.log?.(`Using plugin install override for ${sanitizeTerminalText(entry.pluginId)} from ${PLUGIN_INSTALL_OVERRIDES_ENV} (${ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV}=1).`);
	const installOutcome = params.override.kind === "npm" ? await installPluginFromNpmSpecWithProgress({
		cfg: params.cfg,
		entry,
		npmSpec: params.override.spec,
		prompter,
		runtime,
		onCapabilityConsent: params.onCapabilityConsent,
		trustedSourceLinkedOfficialInstall: false
	}) : await installPluginFromNpmPackArchiveWithProgress({
		cfg: params.cfg,
		entry,
		archivePath: params.override.archivePath,
		prompter,
		runtime,
		onCapabilityConsent: params.onCapabilityConsent
	});
	const displaySpec = params.override.kind === "npm" ? params.override.spec : `npm-pack:${params.override.archivePath}`;
	if (installOutcome.status === "timed_out") {
		await prompter.note(formatPluginInstallTimedOutNote(sanitizeTerminalText(displaySpec)), t("wizard.plugins.installTitle"));
		runtime.error?.(`Plugin install timed out after ${ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS}ms: ${sanitizeTerminalText(displaySpec)}`);
		return incompletePluginInstall(params.cfg, entry.pluginId, "timed_out");
	}
	const { result } = installOutcome;
	if (!result.ok) {
		const errorDetail = formatInstallErrorDetail(result.error);
		await notePluginInstallFailure(prompter, displaySpec, result.error);
		runtime.error?.(`Plugin install failed: ${summarizeInstallError(result.error)}`);
		return incompletePluginInstall(params.cfg, entry.pluginId, "failed", errorDetail);
	}
	const npmTarballName = params.override.kind === "npm-pack" ? result.npmTarballName : void 0;
	const install = params.override.kind === "npm-pack" ? {
		pluginId: result.pluginId,
		source: "npm",
		spec: result.npmResolution?.resolvedSpec ?? result.manifestName ?? result.pluginId,
		sourcePath: params.override.archivePath,
		installPath: result.targetDir,
		...result.version ? { version: result.version } : {},
		...buildNpmResolutionInstallFields(result.npmResolution),
		artifactKind: "npm-pack",
		artifactFormat: "tgz",
		...result.npmResolution?.integrity ? { npmIntegrity: result.npmResolution.integrity } : {},
		...result.npmResolution?.shasum ? { npmShasum: result.npmResolution.shasum } : {},
		...npmTarballName ? { npmTarballName } : {}
	} : {
		pluginId: result.pluginId,
		source: "npm",
		spec: params.override.spec,
		installPath: result.targetDir,
		...result.version ? { version: result.version } : {},
		...buildNpmResolutionInstallFields(result.npmResolution)
	};
	return await finishOnboardingPluginInstall({
		cfg: params.cfg,
		pluginId: result.pluginId,
		label: entry.label,
		prompter,
		runtime,
		install: installOutcome.capabilityConsent.applyAcceptedSurface(result.pluginId, install)
	});
}
async function installPluginFromClawHubSpecWithProgress(params) {
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	const capabilityConsent = await prepareManagedPluginArtifactConsentHandler({
		config: params.cfg,
		source: "clawhub",
		spec: params.clawhubSpec,
		onCapabilityConsent: consent.onCapabilityConsent
	});
	const safeLabel = sanitizeTerminalText(params.entry.label);
	const progress = params.prompter.progress(formatPluginInstallProgress(safeLabel));
	const animated = createAnimatedInstallProgress(progress);
	animated.setLabel(t("wizard.plugins.preparingInstall"));
	const updateProgress = (message) => {
		const sanitized = sanitizeTerminalText(message).trim();
		if (!sanitized) return;
		animated.setLabel(shortenInstallLabel(sanitized));
	};
	let renderedTrustWarning = false;
	const renderTrustWarning = (message) => {
		logInstallWarningWithLineBreaks(params.runtime, message);
		renderedTrustWarning = true;
	};
	try {
		const { installPluginFromClawHub } = await import("./clawhub-BBUXxy8_.js");
		const result = await installPluginFromClawHub({
			spec: params.clawhubSpec,
			timeoutMs: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS,
			config: params.cfg,
			extensionsDir: resolveDefaultPluginExtensionsDir(),
			expectedPluginId: params.entry.pluginId,
			mode: "install",
			onBeforePluginArtifactCommit: capabilityConsent.onBeforePluginArtifactCommit,
			logger: {
				info: updateProgress,
				warn: (message) => {
					updateProgress(message);
					if (isReviewRequiredClawHubTrustWarning(message)) return;
					if (isClawHubTrustWarning(message)) {
						renderTrustWarning(message);
						return;
					}
					logInstallWarningWithSpacing(params.runtime, message);
				}
			},
			onClawHubRisk: async (request) => {
				animated.stop();
				progress.stop("Review ClawHub warning");
				renderTrustWarning(request.warning);
				const packageName = sanitizeTerminalText(request.packageName);
				const releaseLabel = `${packageName}@${sanitizeTerminalText(request.version)}`;
				if (request.acknowledgementKind === "type-package") return (await params.prompter.text({
					message: `To install anyway, type the package name for "${releaseLabel}"`,
					placeholder: packageName
				})).trim() === packageName;
				return await params.prompter.confirm({
					message: `Install ClawHub package "${releaseLabel}" after reviewing the warning above?`,
					initialValue: false
				});
			}
		});
		animated.stop();
		const failureWarning = readInstallFailureWarning(result);
		if (failureWarning && !renderedTrustWarning) {
			progress.stop("Review ClawHub warning");
			renderTrustWarning(failureWarning);
		}
		if (result.ok) progress.stop(formatPluginInstalled(safeLabel));
		else progress.stop(formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		return {
			result,
			capabilityConsent
		};
	} catch (error) {
		animated.stop();
		progress.stop(formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		if (error instanceof WizardCancelledError || error instanceof WizardNavigationError) throw error;
		return {
			result: {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			},
			capabilityConsent
		};
	}
}
/** Ensures an onboarding plugin is installed, enabled, and recorded in config. */
async function ensureOnboardingPluginInstalled(params) {
	const { entry, prompter, runtime, workspaceDir } = params;
	const next = params.cfg;
	const onCapabilityConsent = params.onCapabilityConsent ?? createPluginCapabilityConsentPrompter(prompter, params.beforePersistentEffect);
	const installOverride = resolvePluginInstallOverride({ pluginId: entry.pluginId });
	if (installOverride) {
		assertConfigWriteAllowedInCurrentMode();
		await params.beforePersistentEffect?.();
		return await withPluginLifecycleLease({}, async () => installPluginFromOverride({
			cfg: next,
			entry,
			override: installOverride,
			prompter,
			runtime,
			onCapabilityConsent
		}));
	}
	const allowLocal = hasGitWorkspace(workspaceDir);
	const bundledLocalPath = entry.preferRemoteInstall ? null : resolveBundledLocalPath({
		entry,
		workspaceDir
	});
	const localPath = bundledLocalPath ?? (entry.preferRemoteInstall ? null : resolveLocalPath({
		entry,
		workspaceDir,
		allowLocal
	}));
	const clawhubSpec = resolveClawHubSpecForOnboarding(entry.install);
	const npmSpec = resolveNpmSpecForOnboarding(entry.install);
	const updateChannel = resolveRegistryUpdateChannel({
		configChannel: normalizeUpdateChannel(next.update?.channel),
		currentVersion: VERSION
	});
	const clawhubSpecs = clawhubSpec ? resolveClawHubInstallSpecsForUpdateChannel({
		spec: clawhubSpec,
		updateChannel
	}) : null;
	const npmSpecs = npmSpec ? resolveNpmInstallSpecsForUpdateChannel({
		spec: npmSpec,
		updateChannel,
		officialPackageName: entry.trustedSourceLinkedOfficialInstall ? parseRegistryNpmSpec(npmSpec)?.name : void 0,
		coreVersion: VERSION,
		versionBoundToCore: entry.versionBoundToOpenClaw
	}) : null;
	const clawhubInstallSpec = clawhubSpecs?.installSpec ?? clawhubSpec;
	const npmInstallSpec = npmSpecs?.installSpec ?? npmSpec;
	const defaultChoice = resolveInstallDefaultChoice({
		cfg: next,
		entry,
		localPath,
		bundledLocalPath,
		hasClawHubSpec: Boolean(clawhubSpec),
		hasNpmSpec: Boolean(npmSpec)
	});
	const choice = params.promptInstall === false ? defaultChoice : await promptInstallChoice({
		entry,
		localPath,
		bundledLocalPath,
		defaultChoice,
		prompter,
		autoConfirmSingleSource: params.autoConfirmSingleSource,
		effectiveClawHubSpec: clawhubInstallSpec,
		effectiveNpmSpec: npmInstallSpec
	});
	if (choice === "skip") return incompletePluginInstall(next, entry.pluginId, "skipped");
	assertConfigWriteAllowedInCurrentMode();
	return await withPluginLifecycleLease({}, async () => {
		if (choice === "local" && localPath) return await installLocalOnboardingPlugin({
			cfg: next,
			entry,
			localPath,
			bundledLocalPath,
			npmSpec,
			workspaceDir,
			prompter,
			runtime,
			onCapabilityConsent
		});
		let shouldTryNpm = choice === "npm";
		if (choice === "clawhub" && clawhubInstallSpec) {
			await params.beforePersistentEffect?.();
			let usedClawHubSpec = clawhubInstallSpec;
			const { result, capabilityConsent } = await installWithChannelFallback({
				installSpec: clawhubInstallSpec,
				...entry.install.expectedIntegrity ? {} : { fallbackSpec: clawhubSpecs?.fallbackSpec },
				install: async (spec) => {
					usedClawHubSpec = spec;
					return await installPluginFromClawHubSpecWithProgress({
						cfg: next,
						entry,
						clawhubSpec: spec,
						prompter,
						runtime,
						onCapabilityConsent
					});
				},
				isRetryable: (attempt) => !attempt.result.ok && isUnavailableClawHubTarget(attempt.result),
				onFallback: async (message) => {
					await prompter.note(message, t("wizard.plugins.installTitle"));
				}
			});
			if (result.ok) return await finishOnboardingPluginInstall({
				cfg: next,
				pluginId: result.pluginId,
				label: entry.label,
				prompter,
				runtime,
				install: capabilityConsent.applyAcceptedSurface(result.pluginId, {
					pluginId: result.pluginId,
					...buildClawHubPluginInstallRecordFields(result.clawhub),
					spec: clawhubSpecs?.recordSpec ?? clawhubInstallSpec,
					installPath: result.targetDir
				})
			});
			await notePluginInstallFailure(prompter, usedClawHubSpec, result.error);
			const errorDetail = formatInstallErrorDetail(result.error);
			if (!npmInstallSpec || !shouldFallbackClawHubToNpm({
				result,
				npmSpec: npmInstallSpec
			})) {
				runtime.error?.(`Plugin install failed: ${summarizeInstallError(result.error)}`);
				return incompletePluginInstall(next, entry.pluginId, "failed", errorDetail);
			}
			shouldTryNpm = await prompter.confirm({
				message: t("wizard.plugins.useNpmPackageInstead", { spec: sanitizeTerminalText(npmInstallSpec) }),
				initialValue: true
			});
			if (!shouldTryNpm) {
				runtime.error?.(`Plugin install failed: ${summarizeInstallError(result.error)}`);
				return incompletePluginInstall(next, entry.pluginId, "failed", errorDetail);
			}
		}
		if (!shouldTryNpm || !npmInstallSpec) {
			await prompter.note(t("wizard.plugins.noRemoteInstallSource", { plugin: sanitizeTerminalText(entry.label) }), t("wizard.plugins.installTitle"));
			runtime.error?.(`Plugin install failed: no remote spec available for ${sanitizeTerminalText(entry.pluginId)}.`);
			return incompletePluginInstall(next, entry.pluginId, "failed");
		}
		await params.beforePersistentEffect?.();
		const installOutcome = await installWithChannelFallback({
			installSpec: npmInstallSpec,
			...entry.install.expectedIntegrity ? {} : { fallbackSpec: npmSpecs?.fallbackSpec },
			install: async (spec) => await installPluginFromNpmSpecWithProgress({
				cfg: next,
				entry,
				npmSpec: spec,
				prompter,
				runtime,
				onCapabilityConsent
			}),
			isRetryable: (outcome) => outcome.status === "completed" && !outcome.result.ok && isUnavailableNpmTarget(outcome.result),
			onFallback: async (message) => {
				await prompter.note(message, t("wizard.plugins.installTitle"));
			}
		});
		if (installOutcome.status === "timed_out") {
			await prompter.note(formatPluginInstallTimedOutNote(sanitizeTerminalText(npmInstallSpec)), t("wizard.plugins.installTitle"));
			runtime.error?.(`Plugin install timed out after ${ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS}ms: ${sanitizeTerminalText(npmInstallSpec)}`);
			return incompletePluginInstall(next, entry.pluginId, "timed_out");
		}
		const { result } = installOutcome;
		if (result.ok) return await finishOnboardingPluginInstall({
			cfg: next,
			pluginId: result.pluginId,
			label: entry.label,
			prompter,
			runtime,
			install: installOutcome.capabilityConsent.applyAcceptedSurface(result.pluginId, {
				pluginId: result.pluginId,
				source: "npm",
				spec: resolveNpmInstallRecordSpec({
					requestedSpec: npmSpecs?.recordSpec ?? npmInstallSpec,
					resolution: result.npmResolution,
					pinResolvedRegistrySpec: false
				}),
				installPath: result.targetDir,
				version: result.version,
				...buildNpmResolutionInstallFields(result.npmResolution)
			})
		});
		await notePluginInstallFailure(prompter, npmInstallSpec, result.error);
		if (localPath) {
			if (await prompter.confirm({
				message: t("wizard.plugins.useLocalPluginPathInstead", { path: sanitizeTerminalText(localPath) }),
				initialValue: true
			})) return await installLocalOnboardingPlugin({
				cfg: next,
				entry,
				localPath,
				bundledLocalPath,
				npmSpec,
				workspaceDir,
				prompter,
				runtime,
				onCapabilityConsent
			});
		}
		const errorDetail = formatInstallErrorDetail(result.error);
		runtime.error?.(`Plugin install failed: ${summarizeInstallError(result.error)}`);
		return incompletePluginInstall(next, entry.pluginId, "failed", errorDetail);
	});
}
//#endregion
export { ensureOnboardingPluginInstalled as t };
