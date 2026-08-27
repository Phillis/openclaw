import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { R as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-C0L8fX98.js";
import { o as writeConfigMachineState, r as readConfigMachineState } from "./config-machine-state-DjliVw3j.js";
import { r as detectRespawnSupervisor } from "./supervisor-markers-BXjiMLrU.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { f as scheduleGatewaySigusr1Restart, o as normalizeGatewayRestartDelayMs, u as resolveGatewayRestartDeferralTimeoutMs } from "./restart-DyWvGcd6.js";
import { d as readVerifiedGitUpdateReceipt, g as updateInstallRootsMatch } from "./restart-sentinel-DedQJXFM.js";
import { t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON } from "./update-control-plane-sentinel-CjDvg0VZ.js";
import { n as applyDevUpdateTargetEnv, r as devUpdateTargetFromGitTarget } from "./update-dev-target-BGSFRuDr.js";
import { s as startManagedServiceUpdateHandoff } from "./update-managed-service-handoff-BLHrOKoq.js";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-vhDO4DiE.js";
import { a as channelToNpmTag, d as resolveEffectiveUpdateChannel, l as normalizeUpdateChannel, s as isBetaTag } from "./update-channels-D2-WrHya.js";
import { r as checkTelemetryUpdate } from "./telemetry-DxQUXMlP.js";
import { n as compareSemverStrings, o as resolveNpmChannelTag, t as checkUpdateStatus } from "./update-check-iQLkkUmm.js";
import { n as runGatewayUpdatePreflight } from "./update-runner-2ESoe5eG.js";
import { n as refreshRemoteModelCatalog, t as REMOTE_MODEL_CATALOG_TTL_MS } from "./remote-refresh-BunhUNB9.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/update-campaign.ts
const CAMPAIGN_FORCE_DELAY_MS = 15 * 6e4;
const CAMPAIGN_COUNTDOWN_MS = 6e4;
const CAMPAIGN_HOLD_MS = 60 * 6e4;
const CAMPAIGN_POLL_MS = 5e3;
function sameTarget(a, b) {
	if (a.kind !== b.kind) return false;
	if (a.kind === "package" && b.kind === "package") return a.version === b.version;
	return a.kind === "git" && b.kind === "git" && a.upstreamRef === b.upstreamRef && a.upstreamSha === b.upstreamSha && a.commitsBehind === b.commitsBehind;
}
/** Owns the single in-memory automatic-update campaign for this process. */
var UpdateCampaignController = class {
	constructor(dependencies = {
		now: () => Date.now(),
		setTimer: (callback, delayMs) => setTimeout(callback, delayMs),
		clearTimer: (timer) => clearTimeout(timer),
		createId: randomUUID
	}) {
		this.dependencies = dependencies;
		this.held = false;
	}
	getState() {
		return this.campaign;
	}
	announce(announcement) {
		if (this.target && this.campaign && sameTarget(this.target, announcement.target)) {
			this.announcement = announcement;
			this.reconcile();
			return;
		}
		this.cancelTimer();
		this.held = false;
		this.target = announcement.target;
		this.announcement = announcement;
		const now = this.dependencies.now();
		this.campaign = {
			id: this.dependencies.createId(),
			state: "waiting-for-idle",
			announcedAtMs: now,
			forceAtMs: now + CAMPAIGN_FORCE_DELAY_MS,
			updatedAtMs: now
		};
		announcement.onChange(this.campaign);
		this.reconcile();
	}
	clear() {
		const onChange = this.announcement?.onChange;
		const hadCampaign = this.campaign !== void 0;
		this.reset();
		if (hadCampaign) onChange?.(void 0);
	}
	adopt(expectedTarget) {
		const campaign = this.campaign;
		const target = this.target;
		if (!campaign || !target) return { status: "absent" };
		if (campaign.state === "applying") return { status: "applying" };
		if (expectedTarget && (target.kind !== "git" || target.upstreamRef !== expectedTarget.upstreamRef || target.upstreamSha !== expectedTarget.upstreamSha)) return { status: "mismatch" };
		this.beginApplying(false, false);
		return {
			status: "adopted",
			campaignId: campaign.id,
			target: { ...target }
		};
	}
	hold(durationMs = CAMPAIGN_HOLD_MS) {
		const campaign = this.campaign;
		if (!campaign || campaign.state === "applying" || this.held) return false;
		this.cancelTimer();
		this.held = true;
		const now = this.dependencies.now();
		const holdUntilMs = now + durationMs;
		this.transition({
			id: campaign.id,
			state: "waiting-for-idle",
			announcedAtMs: campaign.announcedAtMs,
			holdUntilMs,
			forceAtMs: holdUntilMs + CAMPAIGN_FORCE_DELAY_MS,
			updatedAtMs: now
		});
		this.scheduleNext();
		return true;
	}
	resetForTest() {
		this.reset();
	}
	reset() {
		this.cancelTimer();
		this.campaign = void 0;
		this.target = void 0;
		this.announcement = void 0;
		this.held = false;
	}
	reconcile() {
		const campaign = this.campaign;
		const announcement = this.announcement;
		if (!campaign || !announcement || campaign.state === "applying") return;
		this.cancelTimer();
		const now = this.dependencies.now();
		if (campaign.holdUntilMs !== void 0 && now < campaign.holdUntilMs) {
			this.scheduleNext();
			return;
		}
		if (now >= campaign.forceAtMs) {
			this.beginApplying(true, true);
			return;
		}
		if (campaign.state === "waiting-for-idle") {
			let idle = false;
			try {
				idle = createGatewayActiveWorkSnapshot(announcement.inspect, { ignoreTerminalSessions: true }).idle;
			} catch {}
			if (!idle) {
				this.scheduleNext();
				return;
			}
			this.transition({
				id: campaign.id,
				state: "countdown",
				announcedAtMs: campaign.announcedAtMs,
				applyAtMs: now + CAMPAIGN_COUNTDOWN_MS,
				...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
				forceAtMs: campaign.forceAtMs,
				updatedAtMs: now
			});
			this.scheduleNext();
			return;
		}
		if (campaign.applyAtMs !== void 0 && now >= campaign.applyAtMs) {
			this.beginApplying(false, true);
			return;
		}
		this.scheduleNext();
	}
	transition(next) {
		const current = this.campaign;
		if (current?.state === next.state && current.applyAtMs === next.applyAtMs && current.holdUntilMs === next.holdUntilMs && current.forceAtMs === next.forceAtMs) return;
		this.campaign = next;
		this.announcement?.onChange(next);
	}
	beginApplying(forced, runApply) {
		const campaign = this.campaign;
		const announcement = this.announcement;
		if (!campaign || !announcement) return;
		this.cancelTimer();
		const now = this.dependencies.now();
		this.transition({
			id: campaign.id,
			state: "applying",
			announcedAtMs: campaign.announcedAtMs,
			...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
			forceAtMs: campaign.forceAtMs,
			updatedAtMs: now
		});
		if (runApply) announcement.apply({ forced }).then((outcome) => {
			if (outcome === "failed" && this.campaign?.id === campaign.id) this.clear();
		}, () => {
			if (this.campaign?.id === campaign.id) this.clear();
		});
	}
	scheduleNext() {
		const campaign = this.campaign;
		if (!campaign || campaign.state === "applying") return;
		const now = this.dependencies.now();
		const holdBoundaryMs = campaign.holdUntilMs !== void 0 && campaign.holdUntilMs > now ? campaign.holdUntilMs : Number.POSITIVE_INFINITY;
		const nextBoundaryMs = Math.min(campaign.forceAtMs, campaign.applyAtMs ?? Number.POSITIVE_INFINITY, holdBoundaryMs);
		const delayMs = Math.max(0, Math.min(CAMPAIGN_POLL_MS, nextBoundaryMs - now));
		this.timer = this.dependencies.setTimer(() => this.reconcile(), delayMs);
		this.timer.unref?.();
	}
	cancelTimer() {
		if (this.timer === void 0) return;
		this.dependencies.clearTimer(this.timer);
		this.timer = void 0;
	}
};
const gatewayUpdateCampaign = new UpdateCampaignController();
//#endregion
//#region src/infra/update-startup.ts
let updateAvailableCache = null;
let updateScheduleCache = null;
let installStatusInitialization = null;
function getUpdateAvailable() {
	return updateAvailableCache;
}
function getUpdateSchedule() {
	return updateScheduleCache;
}
async function getUpdateEffectiveChannel() {
	const { status } = await initializeGatewayUpdateStatus();
	return resolveEffectiveUpdateChannel({
		currentVersion: VERSION,
		installKind: status.installKind,
		git: status.git
	}).channel;
}
const UPDATE_CHECK_STATE_KEY = "update.checkState";
const UPDATE_CHECK_INTERVAL_MS = 1440 * 60 * 1e3;
const ONE_HOUR_MS = 3600 * 1e3;
const AUTO_UPDATE_COMMAND_TIMEOUT_MS = 2700 * 1e3;
const AUTO_STABLE_DELAY_HOURS_DEFAULT = 6;
const AUTO_STABLE_JITTER_HOURS_DEFAULT = 12;
const AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT = 1;
const DEV_COMMIT_LIMIT = 5;
const DEV_COMMIT_SUBJECT_MAX_LENGTH = 120;
const DEV_COMMIT_LOG_MAX_OUTPUT_BYTES = 8 * 1024;
function shouldSkipCheck(allowInTests) {
	return !allowInTests && Boolean(process.env.VITEST || false);
}
function resolveAutoUpdatePolicy(cfg) {
	const auto = cfg.update?.auto;
	return {
		enabled: Boolean(auto?.enabled),
		stableDelayHours: AUTO_STABLE_DELAY_HOURS_DEFAULT,
		stableJitterHours: AUTO_STABLE_JITTER_HOURS_DEFAULT,
		betaCheckIntervalHours: AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT
	};
}
function resolveCheckIntervalMs(cfg, installKind) {
	const channel = normalizeUpdateChannel(cfg.update?.channel) ?? "stable";
	const auto = resolveAutoUpdatePolicy(cfg);
	if (!auto.enabled) return UPDATE_CHECK_INTERVAL_MS;
	if (channel === "beta") return Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS));
	if (channel === "stable") return ONE_HOUR_MS;
	if (channel === "dev" && installKind === "git") return ONE_HOUR_MS;
	return UPDATE_CHECK_INTERVAL_MS;
}
async function readState() {
	return readConfigMachineState(UPDATE_CHECK_STATE_KEY) ?? {};
}
async function writeState(state) {
	writeConfigMachineState(UPDATE_CHECK_STATE_KEY, state);
}
function sameUpdateAvailable(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.currentVersion === b.currentVersion && a.latestVersion === b.latestVersion && a.channel === b.channel && a.currentSha === b.currentSha && a.upstreamRef === b.upstreamRef && a.upstreamSha === b.upstreamSha && a.commitsBehind === b.commitsBehind && JSON.stringify(a.commits) === JSON.stringify(b.commits);
}
function sameUpdateSchedule(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
function setUpdateScheduleCache(params) {
	if (sameUpdateSchedule(updateScheduleCache, params.next)) return;
	updateScheduleCache = params.next;
	params.onUpdateScheduleChange?.(params.next);
}
function withoutCampaign(schedule) {
	const { campaign: _campaign, ...rest } = schedule;
	return rest;
}
function withoutTarget(schedule) {
	const { target: _target, campaign: _campaign, ...rest } = schedule;
	return rest;
}
function setUpdateAvailableCache(params) {
	if (sameUpdateAvailable(updateAvailableCache, params.next)) return;
	updateAvailableCache = params.next;
	params.onUpdateAvailableChange?.(params.next);
}
function isPersistedAvailabilityForChannel(params) {
	const tag = params.state.lastAvailableTag?.trim();
	if (params.channel === "stable") return !tag || tag === "latest";
	if (params.channel === "beta") return tag === "beta" || tag === "latest";
	return tag === params.channel;
}
function resolvePersistedUpdateAvailable(state, channel) {
	const latestVersion = state.lastAvailableVersion?.trim();
	if (!latestVersion || !isPersistedAvailabilityForChannel({
		state,
		channel
	})) return null;
	const cmp = compareSemverStrings(VERSION, latestVersion);
	if (cmp == null || cmp >= 0) return null;
	return {
		currentVersion: VERSION,
		latestVersion,
		channel: state.lastAvailableTag?.trim() || channelToNpmTag(channel)
	};
}
function clearPersistedAvailabilityForChannel(nextState, channel) {
	if (!isPersistedAvailabilityForChannel({
		state: nextState,
		channel
	})) return;
	delete nextState.lastAvailableVersion;
	delete nextState.lastAvailableTag;
}
function resolveStableJitterMs(params) {
	if (params.jitterWindowMs <= 0) return 0;
	return createHash("sha256").update(`${params.installId}:${params.version}:${params.tag}`).digest().readUInt32BE(0) % (Math.floor(params.jitterWindowMs) + 1);
}
function resolveUpdateCheckNowMs(valueMs) {
	return asDateTimestampMs(valueMs) ?? asDateTimestampMs(Date.now()) ?? 0;
}
function resolveUpdateCheckTimestamp(valueMs) {
	return timestampMsToIsoString(valueMs) ?? timestampMsToIsoString(resolveUpdateCheckNowMs(Date.now())) ?? (/* @__PURE__ */ new Date()).toISOString();
}
function resolveStableAutoApplyAtMs(params) {
	if (!params.nextState.autoInstallId) params.nextState.autoInstallId = params.state.autoInstallId?.trim() || randomUUID();
	const installId = params.nextState.autoInstallId;
	if (!(params.state.autoFirstSeenVersion === params.version && params.state.autoFirstSeenTag === params.tag)) {
		params.nextState.autoFirstSeenVersion = params.version;
		params.nextState.autoFirstSeenTag = params.tag;
		params.nextState.autoFirstSeenAt = resolveUpdateCheckTimestamp(params.nowMs);
	} else {
		params.nextState.autoFirstSeenVersion = params.state.autoFirstSeenVersion;
		params.nextState.autoFirstSeenTag = params.state.autoFirstSeenTag;
		params.nextState.autoFirstSeenAt = params.state.autoFirstSeenAt;
	}
	const parsedFirstSeenMs = params.nextState.autoFirstSeenAt ? Date.parse(params.nextState.autoFirstSeenAt) : params.nowMs;
	const firstSeenMs = Number.isFinite(parsedFirstSeenMs) ? parsedFirstSeenMs : params.nowMs;
	const baseDelayMs = Math.max(0, params.stableDelayHours) * ONE_HOUR_MS;
	const jitterWindowMs = Math.max(0, params.stableJitterHours) * ONE_HOUR_MS;
	const jitterMs = resolveStableJitterMs({
		installId,
		version: params.version,
		tag: params.tag,
		jitterWindowMs
	});
	return firstSeenMs + baseDelayMs + jitterMs;
}
async function startManagedServiceAutoUpdateHandoff(params) {
	const restartDelayMs = normalizeGatewayRestartDelayMs(params.supervisor === "systemd" ? void 0 : 0);
	const handoffId = randomUUID();
	try {
		if (!params.root?.trim()) throw new Error("managed auto-update install root is unavailable");
		const started = await startManagedServiceUpdateHandoff({
			root: params.root,
			timeoutMs: params.timeoutMs,
			restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(params.restartDrainTimeoutMs) ?? resolveGatewayRestartDeferralTimeoutMs(),
			channel: params.channel,
			...params.packageTargetVersion ? { tag: params.packageTargetVersion } : {},
			restartDelayMs,
			supervisor: params.supervisor,
			handoffId,
			...params.devTarget ? { devTarget: params.devTarget } : {},
			meta: {
				handoffId,
				note: "background auto-update"
			}
		});
		if (started.status === "started") {
			const { handoffId: ownerId, installRoot } = started;
			scheduleGatewaySigusr1Restart({
				delayMs: restartDelayMs,
				reason: "update.auto",
				successorOwner: {
					kind: "managed-update-handoff",
					handoffId: ownerId,
					installRoot
				},
				skipCooldown: true,
				skipDeferral: true
			});
		}
		return {
			ok: true,
			code: 0,
			reason: CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
			command: started.command,
			logPath: started.logPath
		};
	} catch (err) {
		return {
			ok: false,
			code: null,
			reason: String(err)
		};
	}
}
async function runAutoUpdateCommand(params) {
	if (isGatewayExternallySupervised()) return {
		ok: false,
		code: null,
		reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
	};
	const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	if (supervisor && params.devTarget) {
		const failure = await runGatewayUpdatePreflight(params.root, params.timeoutMs, params.devTarget);
		if (failure) return {
			ok: false,
			code: 1,
			reason: failure.reason ?? "preflight-failed"
		};
	}
	if (supervisor) return await startManagedServiceAutoUpdateHandoff({
		...params,
		supervisor
	});
	const baseArgs = [
		"update",
		"--yes",
		...[
			"--channel",
			params.channel,
			...params.packageTargetVersion ? ["--tag", params.packageTargetVersion] : []
		],
		"--json"
	];
	const execPath = process.execPath?.trim();
	const argv1 = process.argv[1]?.trim();
	const lowerExecBase = execPath ? normalizeLowercaseStringOrEmpty(path.basename(execPath)) : "";
	const runtimeIsNodeOrBun = lowerExecBase === "node" || lowerExecBase === "node.exe" || lowerExecBase === "bun" || lowerExecBase === "bun.exe";
	const argv = [];
	if (execPath && argv1) argv.push(execPath, argv1, ...baseArgs);
	else if (execPath && !runtimeIsNodeOrBun) argv.push(execPath, ...baseArgs);
	else if (execPath && params.root) {
		const candidates = [
			path.join(params.root, "dist", "entry.js"),
			path.join(params.root, "dist", "entry.mjs"),
			path.join(params.root, "dist", "index.js"),
			path.join(params.root, "dist", "index.mjs")
		];
		for (const candidate of candidates) try {
			await fs.access(candidate);
			argv.push(execPath, candidate, ...baseArgs);
			break;
		} catch {}
	}
	if (argv.length === 0) argv.push("openclaw", ...baseArgs);
	try {
		const res = await runCommandWithTimeout(argv, {
			timeoutMs: params.timeoutMs,
			...params.devTarget ? { env: applyDevUpdateTargetEnv({}, params.devTarget) } : {}
		});
		return {
			ok: res.code === 0,
			code: res.code,
			stdout: res.stdout,
			stderr: res.stderr,
			reason: res.code === 0 ? void 0 : "non-zero-exit"
		};
	} catch (err) {
		return {
			ok: false,
			code: null,
			reason: String(err)
		};
	}
}
function clearAutoState(nextState) {
	delete nextState.autoFirstSeenVersion;
	delete nextState.autoFirstSeenTag;
	delete nextState.autoFirstSeenAt;
}
async function resolveStartupInstallStatus(fetchRemoteGit) {
	const [root, installReceipt] = await Promise.all([resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	}), readVerifiedGitUpdateReceipt()]);
	const gitUpstreamFallback = installReceipt?.upstreamRef && root && updateInstallRootsMatch(root, installReceipt.root) ? {
		currentSha: installReceipt.sha,
		upstreamRef: installReceipt.upstreamRef
	} : void 0;
	return {
		root,
		status: await checkUpdateStatus({
			root,
			...fetchRemoteGit ? {} : { timeoutMs: 2500 },
			fetchGit: fetchRemoteGit,
			includeRegistry: false,
			...fetchRemoteGit ? { useDetachedDevUpstream: true } : {},
			...gitUpstreamFallback ? { gitUpstreamFallback } : {}
		}),
		installReceipt
	};
}
/** Caches only the fast local install probe; remote Git refresh remains post-ready. */
function initializeGatewayUpdateStatus() {
	if (installStatusInitialization) return installStatusInitialization;
	const initialization = resolveStartupInstallStatus(false);
	installStatusInitialization = initialization;
	initialization.catch(() => {
		if (installStatusInitialization === initialization) installStatusInitialization = null;
	});
	return initialization;
}
function gitCommitsMatch(left, right) {
	const normalizedLeft = left.trim().toLowerCase();
	const normalizedRight = right.trim().toLowerCase();
	return normalizedLeft.length >= 7 && normalizedRight.length >= 7 && (normalizedLeft.startsWith(normalizedRight) || normalizedRight.startsWith(normalizedLeft));
}
function resolveGitInstalledAtMs(git, installReceipt, root) {
	return installReceipt && root !== null && updateInstallRootsMatch(root, installReceipt.root) && git.sha && gitCommitsMatch(installReceipt.sha, git.sha) ? installReceipt.installedAtMs : void 0;
}
function resolveGitScheduleStatus(update, installReceipt, root) {
	if (update.installKind !== "git") return;
	const git = update.git;
	const installedAtMs = git ? resolveGitInstalledAtMs(git, installReceipt, root) : void 0;
	const metadata = git ? {
		...git.sha ? { currentSha: git.sha } : {},
		...typeof git.commitAtMs === "number" ? { commitAtMs: git.commitAtMs } : {},
		...installedAtMs === void 0 ? {} : { installedAtMs }
	} : {};
	if (!git || git.error || !git.sha) return {
		...metadata,
		status: "unavailable",
		reason: "git-unavailable"
	};
	if (git.fetchOk !== true) return {
		...metadata,
		status: "unavailable",
		reason: "fetch-failed"
	};
	if (!git.upstream) return {
		...metadata,
		status: "unavailable",
		reason: "no-upstream"
	};
	if (!git.upstreamSha) return {
		...metadata,
		status: "unavailable",
		reason: "no-upstream-sha"
	};
	if (git.ahead === null || git.behind === null) return {
		...metadata,
		status: "unavailable",
		reason: "comparison-failed"
	};
	if (git.ahead > 0 && git.behind > 0) return {
		...metadata,
		status: "diverged",
		commitsAhead: git.ahead,
		commitsBehind: git.behind
	};
	if (git.behind > 0) return {
		...metadata,
		status: "behind",
		commitsBehind: git.behind
	};
	if (git.ahead > 0) return {
		...metadata,
		status: "ahead",
		commitsAhead: git.ahead
	};
	return {
		...metadata,
		status: "current"
	};
}
function withInstallStatus(schedule, update, includeGitStatus, installReceipt, root) {
	const git = includeGitStatus ? resolveGitScheduleStatus(update, installReceipt, root) : void 0;
	return {
		...schedule,
		install: {
			kind: update.installKind,
			...git ? { git } : {}
		}
	};
}
/** Refreshes the read-only Dev checkout comparison used by update.status. */
async function refreshGatewayUpdateStatus(cfg) {
	const channel = normalizeUpdateChannel(cfg.update?.channel) ?? "stable";
	if (channel !== "dev") return;
	const { root, status, installReceipt } = await resolveStartupInstallStatus(true);
	setUpdateScheduleCache({ next: withInstallStatus(updateScheduleCache?.channel === channel ? updateScheduleCache : {
		channel,
		autoEnabled: Boolean(cfg.update?.auto?.enabled)
	}, status, true, installReceipt, root) });
}
async function resolveDevGitCommits(params) {
	const result = await runCommandWithTimeout([
		"git",
		"-C",
		params.root,
		"log",
		"--format=%h%x09%s",
		`--max-count=${DEV_COMMIT_LIMIT}`,
		`${params.currentSha}..${params.upstreamSha}`
	], {
		timeoutMs: 2500,
		maxOutputBytes: {
			stdout: DEV_COMMIT_LOG_MAX_OUTPUT_BYTES,
			stderr: 1024
		}
	}).catch(() => null);
	if (!result || result.code !== 0 || result.termination !== "exit") return [];
	return result.stdout.split("\n").flatMap((line) => {
		const separator = line.indexOf("	");
		const sha = separator < 0 ? "" : line.slice(0, separator).trim();
		if (!sha) return [];
		return [{
			sha,
			subject: line.slice(separator + 1).trim().slice(0, DEV_COMMIT_SUBJECT_MAX_LENGTH)
		}];
	}).slice(0, DEV_COMMIT_LIMIT);
}
async function runCampaignUpdate(params) {
	const attemptAt = resolveUpdateCheckNowMs(Date.now());
	const attemptState = await readState();
	attemptState.autoLastAttemptVersion = params.version;
	attemptState.autoLastAttemptAt = resolveUpdateCheckTimestamp(attemptAt);
	await writeState(attemptState);
	const outcome = await params.runAuto({
		channel: params.channel,
		timeoutMs: AUTO_UPDATE_COMMAND_TIMEOUT_MS,
		restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
		...params.root ? { root: params.root } : {},
		...params.channel === "dev" ? {} : { packageTargetVersion: params.version },
		...params.devTarget ? { devTarget: params.devTarget } : {}
	});
	if (outcome.ok && outcome.reason === "managed-service-handoff-started") {
		params.log.info("auto-update handoff started", {
			channel: params.channel,
			version: params.version,
			tag: params.tag,
			forced: params.forced,
			...outcome.command ? { command: outcome.command } : {},
			...outcome.logPath ? { logPath: outcome.logPath } : {}
		});
		return "handoff";
	}
	if (outcome.ok) {
		const successState = await readState();
		successState.autoLastSuccessVersion = params.version;
		successState.autoLastSuccessAt = resolveUpdateCheckTimestamp(Date.now());
		await writeState(successState);
		params.log.info("auto-update applied", {
			channel: params.channel,
			version: params.version,
			tag: params.tag,
			forced: params.forced
		});
		return "applied";
	}
	params.log.info("auto-update attempt failed", {
		channel: params.channel,
		version: params.version,
		tag: params.tag,
		forced: params.forced,
		reason: outcome.reason ?? `exit:${outcome.code}`
	});
	return "failed";
}
async function runGatewayUpdateCheck(params) {
	if (shouldSkipCheck(Boolean(params.allowInTests))) return;
	if (params.isNixMode) return;
	const configChannel = normalizeUpdateChannel(params.cfg.update?.channel);
	const updateCampaign = params.updateCampaign ?? gatewayUpdateCampaign;
	const auto = resolveAutoUpdatePolicy(params.cfg);
	const autoDisabledByEnv = isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE);
	if (params.cfg.update?.checkOnStart === false || autoDisabledByEnv) {
		updateCampaign.clear();
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		const channel = configChannel ?? updateScheduleCache?.channel ?? "stable";
		setUpdateScheduleCache({
			next: withoutTarget({
				...updateScheduleCache?.channel === channel ? updateScheduleCache : {
					channel,
					autoEnabled: false
				},
				autoEnabled: false
			}),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		return;
	}
	const autoDisabledByExternalSupervisor = isGatewayExternallySupervised();
	const initializedInstallStatus = await initializeGatewayUpdateStatus();
	const potentialChannel = resolveEffectiveUpdateChannel({
		configChannel,
		currentVersion: VERSION,
		installKind: initializedInstallStatus.status.installKind,
		git: initializedInstallStatus.status.git
	}).channel;
	let installStatus = initializedInstallStatus;
	if (potentialChannel === "dev" && installStatus.status.installKind === "git") installStatus = await resolveStartupInstallStatus(true);
	const configuredChannel = resolveEffectiveUpdateChannel({
		configChannel,
		currentVersion: VERSION,
		installKind: installStatus.status.installKind,
		git: installStatus.status.git
	}).channel;
	const autoDesired = (configuredChannel === "stable" || configuredChannel === "beta" || configuredChannel === "dev") && auto.enabled && !autoDisabledByExternalSupervisor;
	if (updateScheduleCache?.channel !== configuredChannel) updateCampaign.clear();
	const priorSchedule = updateScheduleCache?.channel === configuredChannel ? updateScheduleCache : null;
	const initialSchedule = priorSchedule ? {
		...priorSchedule,
		autoEnabled: auto.enabled
	} : {
		channel: configuredChannel,
		autoEnabled: auto.enabled
	};
	setUpdateScheduleCache({
		next: autoDesired ? initialSchedule : withoutCampaign(initialSchedule),
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	if (!autoDesired) updateCampaign.clear();
	const onCampaignChange = (campaign) => {
		const current = updateScheduleCache;
		if (!current || current.channel !== configuredChannel) return;
		const target = current.target?.kind === "package" ? current.target.version : current.target?.kind === "git" ? {
			upstreamSha: current.target.upstreamSha,
			commitsBehind: current.target.commitsBehind
		} : void 0;
		if (campaign) params.log.info(`update campaign ${campaign.state}`, {
			campaignId: campaign.id,
			state: campaign.state,
			channel: configuredChannel,
			...target === void 0 ? {} : { target },
			...campaign.applyAtMs === void 0 ? {} : { applyAtMs: campaign.applyAtMs },
			...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
			forceAtMs: campaign.forceAtMs
		});
		else params.log.info("update campaign ended", {
			...current.campaign?.id ? { campaignId: current.campaign.id } : {},
			channel: configuredChannel,
			...target === void 0 ? {} : { target }
		});
		setUpdateScheduleCache({
			next: campaign ? {
				...current,
				campaign
			} : withoutCampaign(current),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
	};
	if (configuredChannel === "extended-stable" || configuredChannel === "dev") setUpdateScheduleCache({
		next: withInstallStatus(updateScheduleCache ?? initialSchedule, installStatus.status, configuredChannel === "dev", installStatus.installReceipt, installStatus.root),
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	if (configuredChannel === "extended-stable") {
		if (installStatus.status.installKind !== "package") {
			updateCampaign.clear();
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
			setUpdateScheduleCache({
				next: withoutTarget(updateScheduleCache ?? initialSchedule),
				onUpdateScheduleChange: params.onUpdateScheduleChange
			});
			return;
		}
	}
	const isDevGit = configuredChannel === "dev" && installStatus?.status.installKind === "git";
	const shouldRunAutoUpdate = autoDesired && (configuredChannel === "stable" || configuredChannel === "beta" || isDevGit);
	if (!shouldRunAutoUpdate) updateCampaign.clear();
	const telemetryUpdate = await checkTelemetryUpdate(params.cfg, { surface: "gateway" });
	const state = await readState();
	const rawNow = Date.now();
	const now = resolveUpdateCheckNowMs(rawNow);
	const rawNowIsValid = asDateTimestampMs(rawNow) !== void 0;
	const lastCheckedAt = state.lastCheckedAt ? Date.parse(state.lastCheckedAt) : null;
	const persistedAvailable = isDevGit ? null : resolvePersistedUpdateAvailable(state, configuredChannel);
	const hasExtendedStableCheckMarker = state.lastAvailableTag?.trim() === "extended-stable";
	const shouldBypassSharedThrottle = isDevGit || configuredChannel === "extended-stable" && !hasExtendedStableCheckMarker;
	setUpdateAvailableCache({
		next: persistedAvailable,
		onUpdateAvailableChange: params.onUpdateAvailableChange
	});
	if (persistedAvailable) setUpdateScheduleCache({
		next: {
			...updateScheduleCache ?? initialSchedule,
			target: {
				kind: "package",
				version: persistedAvailable.latestVersion
			}
		},
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	const checkIntervalMs = shouldRunAutoUpdate ? resolveCheckIntervalMs(params.cfg, installStatus?.status.installKind) : UPDATE_CHECK_INTERVAL_MS;
	if (!shouldBypassSharedThrottle && rawNowIsValid && lastCheckedAt && Number.isFinite(lastCheckedAt)) {
		if (now - lastCheckedAt < checkIntervalMs) return;
	}
	const { root, status, installReceipt } = installStatus;
	setUpdateScheduleCache({
		next: withInstallStatus(updateScheduleCache ?? initialSchedule, status, isDevGit, installReceipt, root),
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	const nextState = {
		...state,
		lastCheckedAt: resolveUpdateCheckTimestamp(now)
	};
	if (isDevGit) {
		delete nextState.lastAvailableVersion;
		delete nextState.lastAvailableTag;
		clearAutoState(nextState);
		const git = status.git;
		if (typeof git?.behind !== "number" || git.behind <= 0 || !git.sha || !git.upstream || !git.upstreamSha) {
			updateCampaign.clear();
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
			setUpdateScheduleCache({
				next: withoutTarget(updateScheduleCache ?? initialSchedule),
				onUpdateScheduleChange: params.onUpdateScheduleChange
			});
			await writeState(nextState);
			return;
		}
		const currentSha = git.sha;
		const upstreamRef = git.upstream;
		const upstreamSha = git.upstreamSha;
		const commitsBehind = git.behind;
		const commits = await resolveDevGitCommits({
			root: git.root,
			currentSha,
			upstreamSha
		});
		const target = {
			kind: "git",
			upstreamRef,
			upstreamSha,
			commitsBehind
		};
		setUpdateAvailableCache({
			next: {
				currentVersion: VERSION,
				latestVersion: VERSION,
				channel: "dev",
				currentSha,
				upstreamRef,
				upstreamSha,
				commitsBehind,
				commits
			},
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		setUpdateScheduleCache({
			next: {
				...updateScheduleCache ?? initialSchedule,
				target
			},
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		if (auto.enabled && autoDisabledByExternalSupervisor) params.log.info("auto-update delegated to external supervisor", {
			version: upstreamSha,
			tag: "dev",
			reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
		});
		const hasTrackedDevUpstream = (git.branch === "main" || git.branch === "HEAD") && git.upstreamSource === "tracking";
		const hasReceiptBackedDetachedHead = git.branch === "HEAD" && git.upstreamSource === "receipt";
		const canRunTrackedDevCampaign = (hasTrackedDevUpstream || hasReceiptBackedDetachedHead) && git.ahead === 0;
		if (shouldRunAutoUpdate && canRunTrackedDevCampaign) {
			const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
			if (!(lastAttemptAt != null && Number.isFinite(lastAttemptAt) && now - lastAttemptAt < ONE_HOUR_MS)) {
				const runAuto = params.runAutoUpdate ?? runAutoUpdateCommand;
				updateCampaign.announce({
					target,
					inspect: params.activeWorkInspectors,
					onChange: onCampaignChange,
					apply: async ({ forced }) => await runCampaignUpdate({
						channel: "dev",
						version: upstreamSha,
						tag: "dev",
						forced,
						root: root ?? status.root ?? void 0,
						devTarget: devUpdateTargetFromGitTarget(target),
						log: params.log,
						runAuto
					})
				});
			}
		} else updateCampaign.clear();
		await writeState(nextState);
		return;
	}
	if (status.installKind !== "package") {
		delete nextState.lastAvailableVersion;
		delete nextState.lastAvailableTag;
		clearAutoState(nextState);
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		updateCampaign.clear();
		setUpdateScheduleCache({
			next: withoutTarget(updateScheduleCache ?? initialSchedule),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		await writeState(nextState);
		return;
	}
	const channel = configuredChannel;
	const resolved = shouldRunAutoUpdate ? await resolveNpmChannelTag({
		channel,
		timeoutMs: 2500
	}) : {
		tag: channel === "beta" && telemetryUpdate?.version && !isBetaTag(telemetryUpdate.version) ? "latest" : channelToNpmTag(channel),
		version: telemetryUpdate?.version ?? null
	};
	const tag = resolved.tag;
	if (!resolved.version) {
		if (channel === "extended-stable") {
			clearPersistedAvailabilityForChannel(nextState, channel);
			if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
			setUpdateAvailableCache({
				next: null,
				onUpdateAvailableChange: params.onUpdateAvailableChange
			});
			updateCampaign.clear();
			setUpdateScheduleCache({
				next: withoutTarget(updateScheduleCache ?? initialSchedule),
				onUpdateScheduleChange: params.onUpdateScheduleChange
			});
		}
		await writeState(nextState);
		return;
	}
	const resolvedVersion = resolved.version;
	const cmp = compareSemverStrings(VERSION, resolvedVersion);
	if (cmp != null && cmp < 0) {
		const nextAvailable = {
			currentVersion: VERSION,
			latestVersion: resolved.version,
			channel: tag
		};
		const target = {
			kind: "package",
			version: resolved.version
		};
		setUpdateScheduleCache({
			next: {
				...updateScheduleCache ?? initialSchedule,
				target
			},
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
		setUpdateAvailableCache({
			next: nextAvailable,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		nextState.lastAvailableVersion = resolved.version;
		nextState.lastAvailableTag = tag;
		if (state.lastNotifiedVersion !== resolved.version || state.lastNotifiedTag !== tag) {
			const updateNotice = `update available (${tag}): v${resolved.version} (current v${VERSION}). Run: ${formatCliCommand("openclaw update")}`;
			const note = telemetryUpdate?.note ? sanitizeTerminalText(telemetryUpdate.note).trim().slice(0, 500) : void 0;
			params.log.info(note ? `${updateNotice} Note: ${note}` : updateNotice);
			nextState.lastNotifiedVersion = resolved.version;
			nextState.lastNotifiedTag = tag;
		}
		if (channel !== "extended-stable" && auto.enabled && autoDisabledByExternalSupervisor) params.log.info("auto-update delegated to external supervisor", {
			version: resolved.version,
			tag,
			reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
		});
		if (shouldRunAutoUpdate && (channel === "stable" || channel === "beta")) {
			const runAuto = params.runAutoUpdate ?? runAutoUpdateCommand;
			const attemptIntervalMs = channel === "beta" ? Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS)) : ONE_HOUR_MS;
			const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
			const recentAttemptForSameVersion = state.autoLastAttemptVersion === resolved.version && lastAttemptAt != null && Number.isFinite(lastAttemptAt) && now - lastAttemptAt < attemptIntervalMs;
			let dueNow = channel === "beta";
			let applyAfterMs = null;
			if (channel === "stable") {
				applyAfterMs = resolveStableAutoApplyAtMs({
					state,
					nextState,
					nowMs: now,
					version: resolved.version,
					tag,
					stableDelayHours: auto.stableDelayHours,
					stableJitterHours: auto.stableJitterHours
				});
				dueNow = now >= applyAfterMs;
			}
			if (!dueNow) params.log.info("auto-update deferred (stable rollout window active)", {
				version: resolved.version,
				tag,
				applyAfter: applyAfterMs ? resolveUpdateCheckTimestamp(applyAfterMs) : void 0
			});
			else if (recentAttemptForSameVersion) params.log.info("auto-update deferred (recent attempt exists)", {
				version: resolved.version,
				tag
			});
			else updateCampaign.announce({
				target,
				inspect: params.activeWorkInspectors,
				onChange: onCampaignChange,
				apply: async ({ forced }) => await runCampaignUpdate({
					channel,
					version: resolvedVersion,
					tag,
					forced,
					root: root ?? status.root ?? void 0,
					log: params.log,
					runAuto
				})
			});
		}
	} else {
		if (channel === "extended-stable") {
			clearPersistedAvailabilityForChannel(nextState, channel);
			if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
		} else {
			delete nextState.lastAvailableVersion;
			delete nextState.lastAvailableTag;
			clearAutoState(nextState);
		}
		setUpdateAvailableCache({
			next: null,
			onUpdateAvailableChange: params.onUpdateAvailableChange
		});
		updateCampaign.clear();
		setUpdateScheduleCache({
			next: withoutTarget(updateScheduleCache ?? initialSchedule),
			onUpdateScheduleChange: params.onUpdateScheduleChange
		});
	}
	await writeState(nextState);
}
function scheduleGatewayUpdateCheck(params) {
	const stopRemoteCatalogRefresh = scheduleRemoteModelCatalogRefresh(params);
	if ((normalizeUpdateChannel(params.cfg.update?.channel) ?? "stable") === "extended-stable" && params.cfg.update?.checkOnStart === false) return () => {
		stopRemoteCatalogRefresh();
		gatewayUpdateCampaign.clear();
	};
	let stopped = false;
	let timer = null;
	let running = false;
	const tick = async () => {
		if (stopped || running) return;
		running = true;
		try {
			await runGatewayUpdateCheck(params);
		} catch {} finally {
			running = false;
		}
		if (stopped) {
			gatewayUpdateCampaign.clear();
			return;
		}
		const intervalMs = resolveCheckIntervalMs(params.cfg, updateScheduleCache?.install?.kind);
		timer = setTimeout(() => {
			tick();
		}, intervalMs);
	};
	tick();
	return () => {
		stopRemoteCatalogRefresh();
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		gatewayUpdateCampaign.clear();
	};
}
function scheduleRemoteModelCatalogRefresh(params) {
	let stopped = false;
	let timer = null;
	let running = false;
	let activeAbortController = null;
	const tick = async () => {
		if (stopped || running) return;
		running = true;
		const abortController = new AbortController();
		activeAbortController = abortController;
		const result = await refreshRemoteModelCatalog({
			config: params.cfg,
			signal: abortController.signal
		});
		if (activeAbortController === abortController) activeAbortController = null;
		running = false;
		if (stopped) return;
		if (result.status === "error") params.log.info("remote model catalog refresh failed", { error: result.error });
		else if (result.status === "updated") params.log.info("remote model catalog updated; restart the Gateway to apply it", {
			providers: result.providers,
			models: result.models,
			generatedAt: result.generatedAt
		});
		const nextCheckInMs = result.status === "fresh" ? result.nextCheckInMs : REMOTE_MODEL_CATALOG_TTL_MS;
		timer = setTimeout(() => void tick(), nextCheckInMs);
		timer.unref?.();
	};
	tick();
	return () => {
		stopped = true;
		activeAbortController?.abort();
		activeAbortController = null;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};
}
//#endregion
export { refreshGatewayUpdateStatus as a, gatewayUpdateCampaign as c, initializeGatewayUpdateStatus as i, getUpdateEffectiveChannel as n, runGatewayUpdateCheck as o, getUpdateSchedule as r, scheduleGatewayUpdateCheck as s, getUpdateAvailable as t };
