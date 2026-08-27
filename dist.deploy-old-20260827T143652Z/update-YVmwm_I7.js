import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-B4HhnyPv.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { l as readConfigFileSnapshot } from "./io-CeQckj5v.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-Cr5lTl_D.js";
import "./config-Dl8DJbzM.js";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-DYdF2Puc.js";
import { r as detectRespawnSupervisor } from "./supervisor-markers-DPGGuE_D.js";
import { t as resolveStableNodePath } from "./stable-node-path-CysbL5Xo.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { n as isRestartEnabled } from "./commands.flags-CZN5Wwe1.js";
import { d as scheduleGatewaySigusr1Restart, l as resolveGatewayRestartDeferralTimeoutMs } from "./restart-DHXBMqqF.js";
import { t as extractDeliveryInfo } from "./delivery-info-oSP7gMHg.js";
import { Ca as validateUpdateStatusParams, Sa as validateUpdateRunParams, ba as validateUpdateHoldParams, wa as validateUpdateStatusResult, xa as validateUpdateHoldResult } from "./src-Bo4ezI_n.js";
import "./sessions-D-jhKYGW.js";
import { f as trimLogTail, m as resolveUpdateInstallRoot, p as writeRestartSentinel } from "./restart-sentinel-CWrwiMK_.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { d as resolveEffectiveUpdateChannel, i as UPDATE_EFFECTIVE_CHANNEL_ENV, l as normalizeUpdateChannel } from "./update-channels-Dv2OGOSa.js";
import { r as readPackageVersion } from "./package-json-Dl4NSL9y.js";
import { t as checkUpdateStatus } from "./update-check-Du5TJ6YP.js";
import { n as resolveUpdateInstallSurface, t as runGatewayUpdate } from "./update-runner-BjiLtfAU.js";
import { l as buildUpdateRestartSentinelPayload, t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON, u as normalizeControlPlaneUpdateResult } from "./update-control-plane-sentinel-B7T4OA34.js";
import { r as devUpdateTargetFromGitCampaign } from "./update-dev-target-CgOB-zhY.js";
import { i as buildPostCoreHandoffEnv } from "./update-post-core-context-BIm4ywkD.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { c as startManagedServiceUpdateHandoff, l as gatewayUpdateCampaign, n as getUpdateSchedule, o as buildManagedServiceHandoffUnavailableMessage, r as refreshGatewayUpdateStatus, s as formatManagedServiceUpdateCommand, t as getUpdateAvailable } from "./update-startup-CQ3ipCAi.js";
import { t as parseRestartRequestParams } from "./restart-request-BGS5sWuT.js";
import { a as refreshLatestUpdateRestartSentinel, n as getLatestUpdateRestartSentinel, r as recordLatestUpdateRestartSentinel } from "./server-restart-sentinel-CRU--AcT.js";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-post-core-finalize.ts
const FINALIZE_PROCESS_TIMEOUT_FLOOR_MS = 30 * 6e4;
const FINALIZE_PROCESS_STEP_BUDGET_MULTIPLIER = 6;
function buildFinalizeEnv(baseEnv, effectiveChannel, compatHostVersion, sourceConfigPath, serviceRepairPolicy) {
	const env = buildPostCoreHandoffEnv({
		baseEnv,
		compatHostVersion,
		sourceConfigPath
	});
	delete env.OPENCLAW_SERVICE_MARKER;
	delete env.OPENCLAW_SERVICE_KIND;
	delete env[GATEWAY_SERVICE_RUNTIME_PID_ENV];
	env[UPDATE_EFFECTIVE_CHANNEL_ENV] = effectiveChannel;
	if (serviceRepairPolicy) env.OPENCLAW_SERVICE_REPAIR_POLICY = serviceRepairPolicy;
	return env;
}
const defaultFinalizeSpawner = async ({ argv, cwd, timeoutMs, env }) => {
	const res = await runCommandWithTimeout(argv, {
		baseEnv: {},
		cwd,
		timeoutMs,
		env
	});
	return {
		code: res.code,
		...res.stderr ? { stderr: res.stderr } : {}
	};
};
function isGitUpdateNeedingFinalize(result) {
	return result.status === "ok" && result.mode === "git" && typeof result.root === "string" && result.root.length > 0;
}
function buildFinalizeArgv(params) {
	const argv = [
		params.nodePath,
		params.entrypoint,
		"update",
		"finalize",
		"--json",
		"--yes",
		"--no-restart"
	];
	if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) argv.push("--timeout", String(Math.max(1, Math.ceil(params.timeoutMs / 1e3))));
	return argv;
}
async function runPostCoreFinalizeAfterGatewayUpdate(params) {
	const { result } = params;
	if (!isGitUpdateNeedingFinalize(result)) return {
		status: "skipped",
		reason: "not-git-update"
	};
	const entrypoint = await (params.resolveEntrypoint ?? resolveGatewayInstallEntrypoint)(result.root);
	if (!entrypoint) return {
		status: "skipped",
		reason: "entrypoint-missing"
	};
	const spawnFinalize = params.spawnFinalize ?? defaultFinalizeSpawner;
	const perStepTimeoutMs = typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) ? params.timeoutMs : void 0;
	const effectiveChannel = params.channel ?? "dev";
	const argv = buildFinalizeArgv({
		nodePath: await resolveStableNodePath(process.execPath),
		entrypoint,
		...perStepTimeoutMs === void 0 ? {} : { timeoutMs: perStepTimeoutMs }
	});
	const compatHostVersion = result.after?.version ?? void 0;
	const processTimeoutMs = Math.max(FINALIZE_PROCESS_TIMEOUT_FLOOR_MS, (perStepTimeoutMs ?? 0) * FINALIZE_PROCESS_STEP_BUDGET_MULTIPLIER);
	let sourceConfigDir;
	try {
		let sourceConfigPath;
		if (params.preUpdateConfig) {
			sourceConfigDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-update-post-core-"));
			sourceConfigPath = path.join(sourceConfigDir, "source-config.json");
			await fs.writeFile(sourceConfigPath, `${JSON.stringify(params.preUpdateConfig)}\n`, "utf-8");
		}
		const env = buildFinalizeEnv(params.env ?? process.env, effectiveChannel, compatHostVersion, sourceConfigPath, params.serviceRepairPolicy);
		const spawnResult = await spawnFinalize({
			argv,
			cwd: path.dirname(entrypoint),
			timeoutMs: processTimeoutMs,
			env
		});
		if (spawnResult.code === 0) return {
			status: "ok",
			entrypoint
		};
		return {
			status: "error",
			reason: "nonzero-exit",
			entrypoint,
			...typeof spawnResult.code === "number" ? { exitCode: spawnResult.code } : {},
			...spawnResult.stderr ? { message: spawnResult.stderr } : {}
		};
	} catch (err) {
		return {
			status: "error",
			reason: "spawn-failed",
			entrypoint,
			message: err instanceof Error ? err.message : String(err)
		};
	} finally {
		if (sourceConfigDir) await fs.rm(sourceConfigDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
function foldPostCoreFinalizeIntoResult(result, outcome) {
	if (outcome.status !== "error") return result;
	return {
		...result,
		status: "error",
		reason: "post-core-plugin-finalize-failed",
		steps: [...result.steps, {
			name: "post-core plugin finalize",
			command: "openclaw update finalize",
			cwd: result.root ?? process.cwd(),
			durationMs: 0,
			exitCode: outcome.reason === "nonzero-exit" ? outcome.exitCode ?? 1 : 1,
			...outcome.message ? { stderrTail: trimLogTail(outcome.message) } : {}
		}]
	};
}
//#endregion
//#region src/gateway/server-methods/update.ts
const MANAGED_HANDOFF_RESTART_DELAY_MS = 2e3;
const MANAGED_HANDOFF_ALREADY_RUNNING_REASON = "managed-service-handoff-already-running";
function formatUpdateRunErrorMessage(err) {
	if (err instanceof Error) return err.message || err.name;
	return String(err);
}
function tryResolveProcessCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
async function resolveGatewayEffectiveUpdateChannel(configChannel) {
	const invocationCwd = tryResolveProcessCwd();
	const status = await checkUpdateStatus({
		root: await resolveOpenClawPackageRoot({
			moduleUrl: import.meta.url,
			argv1: process.argv[1],
			...invocationCwd ? { cwd: invocationCwd } : {}
		}),
		timeoutMs: 2500,
		fetchGit: false,
		includeRegistry: false
	});
	if (status.installKind === "unknown") return null;
	return resolveEffectiveUpdateChannel({
		configChannel,
		currentVersion: VERSION,
		installKind: status.installKind,
		git: status.git
	}).channel;
}
async function readPreUpdateConfigForPostCoreFinalize() {
	const snapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
	if (!snapshot.valid) return;
	return {
		sourceConfig: snapshot.sourceConfig,
		authoredConfig: isRecord(snapshot.parsed) ? snapshot.parsed : snapshot.sourceConfig
	};
}
function resolveManagedServiceHandoffRestartDelayMs(restartDelayMs, supervisor) {
	const resolvedDelayMs = restartDelayMs ?? MANAGED_HANDOFF_RESTART_DELAY_MS;
	if (supervisor !== "systemd") return resolvedDelayMs;
	return Math.max(resolvedDelayMs, MANAGED_HANDOFF_RESTART_DELAY_MS);
}
function hasManagedServiceHandoffContext(env, supervisor) {
	if (supervisor === "launchd") return Boolean(env.OPENCLAW_LAUNCHD_LABEL?.trim() || env.LAUNCH_JOB_LABEL?.trim() || env.LAUNCH_JOB_NAME?.trim() || env.XPC_SERVICE_NAME?.trim());
	if (supervisor === "systemd") return Boolean(env.OPENCLAW_SYSTEMD_UNIT?.trim());
	if (supervisor === "schtasks") return Boolean(env.OPENCLAW_WINDOWS_TASK_NAME?.trim() || env.OPENCLAW_SERVICE_MARKER?.trim() === "openclaw" && env.OPENCLAW_SERVICE_KIND?.trim() === "gateway");
	return false;
}
const updateHandlers = {
	"update.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateUpdateStatusParams, "update.status", respond)) return;
		let sentinel;
		try {
			sentinel = await refreshLatestUpdateRestartSentinel();
		} catch (err) {
			context?.logGateway?.warn(`update.status sentinel refresh failed: ${formatUpdateRunErrorMessage(err)}`);
			sentinel = getLatestUpdateRestartSentinel();
		}
		const configChannel = context?.getRuntimeConfig ? normalizeUpdateChannel(context.getRuntimeConfig().update?.channel) : null;
		if (context?.getRuntimeConfig) try {
			await refreshGatewayUpdateStatus(context.getRuntimeConfig());
		} catch (err) {
			context.logGateway?.warn(`update.status checkout refresh failed: ${formatUpdateRunErrorMessage(err)}`);
		}
		const schedule = getUpdateSchedule();
		const effectiveChannel = await resolveGatewayEffectiveUpdateChannel(configChannel).catch(() => null);
		const result = {
			sentinel,
			updateAvailable: getUpdateAvailable(),
			...effectiveChannel ? { effectiveChannel } : {},
			...schedule ? { schedule } : {}
		};
		if (!validateUpdateStatusResult(result)) {
			respond(false, void 0, {
				code: "UNAVAILABLE",
				message: "update status is temporarily unavailable"
			});
			return;
		}
		respond(true, result);
	},
	"update.hold": ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateUpdateHoldParams, "update.hold", respond)) return;
		const actor = resolveControlPlaneActor(client);
		const campaignBeforeHold = gatewayUpdateCampaign.getState();
		const ok = gatewayUpdateCampaign.hold();
		const schedule = getUpdateSchedule();
		if (ok) {
			const heldCampaign = gatewayUpdateCampaign.getState();
			context?.logGateway?.info(`update.hold granted ${formatControlPlaneActor(actor)} holdUntilMs=${heldCampaign?.holdUntilMs} forceAtMs=${heldCampaign?.forceAtMs}`);
		} else {
			const reason = !campaignBeforeHold ? "no campaign" : campaignBeforeHold.state === "applying" ? "applying" : "already held";
			context?.logGateway?.info(`update.hold refused ${formatControlPlaneActor(actor)}`, { reason });
		}
		const result = {
			ok,
			...schedule ? { schedule } : {}
		};
		if (!validateUpdateHoldResult(result)) {
			respond(false, void 0, {
				code: "UNAVAILABLE",
				message: "update hold status is temporarily unavailable"
			});
			return;
		}
		respond(true, result);
	},
	"update.run": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateUpdateRunParams, "update.run", respond)) return;
		const adoptedCampaign = gatewayUpdateCampaign.adopt();
		const adoptedCampaignId = adoptedCampaign?.campaignId;
		const adoptedDevTarget = adoptedCampaign?.target.kind === "git" ? devUpdateTargetFromGitCampaign(adoptedCampaign.target) : void 0;
		const adoptedPackageTargetVersion = adoptedCampaign?.target.kind === "package" ? adoptedCampaign.target.version.trim() || void 0 : void 0;
		const actor = resolveControlPlaneActor(client);
		if (adoptedCampaign) context?.logGateway?.info(`update.run adopted campaign ${adoptedCampaign.campaignId} ${formatControlPlaneActor(actor)}`, { target: adoptedCampaign.target });
		const { sessionKey, deliveryContext: requestedDeliveryContext, threadId: requestedThreadId, note, continuationMessage, restartDelayMs } = parseRestartRequestParams(params);
		const { deliveryContext: sessionDeliveryContext, threadId: sessionThreadId } = extractDeliveryInfo(sessionKey);
		const deliveryContext = requestedDeliveryContext ?? sessionDeliveryContext;
		const threadId = requestedThreadId ?? sessionThreadId;
		const timeoutMsRaw = params.timeoutMs;
		const timeoutMs = typeof timeoutMsRaw === "number" && Number.isFinite(timeoutMsRaw) ? Math.max(1e3, Math.floor(timeoutMsRaw)) : void 0;
		let result;
		let handoff = null;
		let managedHandoffRestart = null;
		let ownsManagedServiceHandoff = true;
		const sentinelMeta = {
			...sessionKey ? { sessionKey } : {},
			...deliveryContext ? { deliveryContext } : {},
			...threadId ? { threadId } : {},
			...note !== void 0 ? { note } : {},
			...continuationMessage !== void 0 ? { continuationMessage } : {}
		};
		try {
			const config = context.getRuntimeConfig();
			const configChannel = normalizeUpdateChannel(config.update?.channel);
			const invocationCwd = tryResolveProcessCwd();
			const root = await resolveOpenClawPackageRoot({
				moduleUrl: import.meta.url,
				argv1: process.argv[1],
				...invocationCwd ? { cwd: invocationCwd } : {}
			}) ?? invocationCwd ?? os.homedir();
			const installSurface = await resolveUpdateInstallSurface({
				timeoutMs,
				cwd: root,
				argv1: process.argv[1]
			});
			const installRoot = installSurface.root;
			const effectiveChannel = resolveEffectiveUpdateChannel({
				configChannel,
				currentVersion: VERSION,
				installKind: installSurface.kind === "git" ? "git" : installSurface.kind === "global" || installSurface.kind === "package-root" ? "package" : "unknown"
			}).channel;
			const supervisor = detectRespawnSupervisor(process.env, process.platform);
			const hasHandoffContext = supervisor ? hasManagedServiceHandoffContext(process.env, supervisor) : false;
			const requiresManagedServiceHandoff = installSurface.kind === "global" || installSurface.kind === "git" && supervisor !== null;
			if (isGatewayExternallySupervised()) {
				const beforeVersion = installSurface.root ? await readPackageVersion(installSurface.root) : null;
				result = {
					status: "skipped",
					mode: installSurface.mode,
					...installSurface.root ? { root: installSurface.root } : {},
					reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON,
					...beforeVersion ? { before: { version: beforeVersion } } : {},
					steps: [],
					durationMs: 0
				};
			} else if (configChannel === "extended-stable" && installSurface.kind === "git") result = {
				status: "error",
				mode: "git",
				root: installSurface.root,
				reason: "unsupported_git_channel",
				steps: [],
				durationMs: 0
			};
			else if (!isRestartEnabled(config) && !supervisor) {
				const beforeVersion = installSurface.root ? await readPackageVersion(installSurface.root) : null;
				result = {
					status: "skipped",
					mode: installSurface.mode,
					...installSurface.root ? { root: installSurface.root } : {},
					reason: installSurface.kind === "global" ? "restart-unavailable" : "restart-disabled",
					...beforeVersion ? { before: { version: beforeVersion } } : {},
					steps: [],
					durationMs: 0
				};
			} else if (requiresManagedServiceHandoff) {
				if (!installRoot) throw new Error("managed update install root is unavailable");
				const handoffChannel = installSurface.kind === "git" ? void 0 : effectiveChannel === "extended-stable" ? effectiveChannel : configChannel ?? void 0;
				const command = formatManagedServiceUpdateCommand({
					timeoutMs,
					...handoffChannel ? { channel: handoffChannel } : {},
					...adoptedPackageTargetVersion ? { tag: adoptedPackageTargetVersion } : {}
				});
				if (supervisor && hasHandoffContext) try {
					const beforeVersion = await readPackageVersion(installRoot);
					const startedAt = Date.now();
					const handoffId = randomUUID();
					const managedRestartDelayMs = resolveManagedServiceHandoffRestartDelayMs(restartDelayMs, supervisor);
					sentinelMeta.handoffId = handoffId;
					sentinelMeta.root = resolveUpdateInstallRoot(installRoot);
					const started = await startManagedServiceUpdateHandoff({
						root: installRoot,
						timeoutMs,
						restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
						...handoffChannel ? { channel: handoffChannel } : {},
						...adoptedPackageTargetVersion ? { tag: adoptedPackageTargetVersion } : {},
						...adoptedDevTarget ? { devTarget: adoptedDevTarget } : {},
						restartDelayMs: managedRestartDelayMs,
						meta: sentinelMeta,
						handoffId,
						supervisor
					});
					ownsManagedServiceHandoff = started.status === "started";
					sentinelMeta.handoffId = started.handoffId ?? handoffId;
					if (ownsManagedServiceHandoff) {
						handoff = {
							status: "started",
							...started.pid ? { pid: started.pid } : {},
							command: started.command
						};
						managedHandoffRestart = scheduleGatewaySigusr1Restart({
							delayMs: managedRestartDelayMs,
							reason: "update.run",
							skipDeferral: true,
							skipCooldown: true,
							audit: {
								actor: actor.actor,
								deviceId: actor.deviceId,
								clientIp: actor.clientIp,
								changedPaths: []
							}
						});
					} else handoff = {
						status: "already-running",
						command: started.command,
						message: "Another managed update is already running; retry after it completes."
					};
					result = {
						status: "skipped",
						mode: installSurface.mode,
						root: installRoot,
						reason: ownsManagedServiceHandoff ? CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON : MANAGED_HANDOFF_ALREADY_RUNNING_REASON,
						...beforeVersion ? { before: { version: beforeVersion } } : {},
						steps: ownsManagedServiceHandoff ? [{
							name: "managed-service update handoff",
							command: started.command,
							cwd: installRoot,
							durationMs: Date.now() - startedAt,
							exitCode: null
						}] : [],
						durationMs: Date.now() - startedAt
					};
				} catch (err) {
					context?.logGateway?.warn(`update.run managed-service handoff failed ${formatControlPlaneActor(actor)} error=${formatUpdateRunErrorMessage(err)}`);
					result = {
						status: "error",
						mode: installSurface.mode,
						root: installRoot,
						reason: "managed-service-handoff-failed",
						steps: [],
						durationMs: 0
					};
				}
				else {
					const beforeVersion = await readPackageVersion(installRoot);
					handoff = {
						status: "unavailable",
						command,
						message: buildManagedServiceHandoffUnavailableMessage(command)
					};
					result = {
						status: "skipped",
						mode: installSurface.mode,
						root: installRoot,
						reason: "managed-service-handoff-unavailable",
						...beforeVersion ? { before: { version: beforeVersion } } : {},
						steps: [],
						durationMs: 0
					};
				}
			} else {
				const preUpdateConfig = installSurface.kind === "git" ? await readPreUpdateConfigForPostCoreFinalize().catch((err) => {
					context?.logGateway?.warn(`update.run could not capture pre-update config ${formatControlPlaneActor(actor)} error=${formatUpdateRunErrorMessage(err)}`);
				}) : void 0;
				result = await runGatewayUpdate({
					timeoutMs,
					cwd: root,
					argv1: process.argv[1],
					channel: installSurface.kind === "git" ? configChannel ?? void 0 : effectiveChannel === "extended-stable" ? effectiveChannel : configChannel ?? void 0,
					...adoptedPackageTargetVersion ? { tag: adoptedPackageTargetVersion } : {},
					...adoptedDevTarget ? { devTarget: adoptedDevTarget } : {},
					allowGatewayServiceRepair: false,
					allowGatewayActivation: false
				});
				const finalizeOutcome = await runPostCoreFinalizeAfterGatewayUpdate({
					result,
					channel: configChannel ?? void 0,
					serviceRepairPolicy: "external",
					...timeoutMs === void 0 ? {} : { timeoutMs },
					...preUpdateConfig ? { preUpdateConfig } : {}
				});
				if (finalizeOutcome.status === "error") context?.logGateway?.warn(`update.run post-core plugin finalize failed ${formatControlPlaneActor(actor)} reason=${finalizeOutcome.reason}`);
				result = foldPostCoreFinalizeIntoResult(result, finalizeOutcome);
			}
		} catch {
			result = {
				status: "error",
				mode: "unknown",
				reason: "unexpected-error",
				steps: [],
				durationMs: 0
			};
		}
		result = normalizeControlPlaneUpdateResult(result);
		if (result.status !== "ok" && handoff?.status !== "started" && adoptedCampaignId !== void 0 && gatewayUpdateCampaign.getState()?.id === adoptedCampaignId) {
			gatewayUpdateCampaign.clear();
			context?.logGateway?.info("update.run failed; adopted campaign cleared", { campaignId: adoptedCampaignId });
		}
		const payload = buildUpdateRestartSentinelPayload({
			result,
			meta: sentinelMeta
		});
		let sentinelPersisted = false;
		if (ownsManagedServiceHandoff) try {
			await writeRestartSentinel(payload);
			sentinelPersisted = true;
			recordLatestUpdateRestartSentinel(payload);
		} catch {}
		const updateWasPackageSwap = result.status === "ok" && result.mode !== "git";
		const restart = managedHandoffRestart ?? (result.status === "ok" ? scheduleGatewaySigusr1Restart({
			delayMs: updateWasPackageSwap ? 0 : restartDelayMs,
			reason: "update.run",
			skipDeferral: updateWasPackageSwap,
			skipCooldown: updateWasPackageSwap,
			audit: {
				actor: actor.actor,
				deviceId: actor.deviceId,
				clientIp: actor.clientIp,
				changedPaths: []
			}
		}) : null);
		context?.logGateway?.info(`update.run completed ${formatControlPlaneActor(actor)} changedPaths=<n/a> restartReason=update.run status=${result.status}`);
		if (restart?.coalesced) context?.logGateway?.warn(`update.run restart coalesced ${formatControlPlaneActor(actor)} delayMs=${restart.delayMs}`);
		respond(true, {
			ok: result.status === "ok" || handoff?.status === "started",
			result,
			...handoff ? { handoff } : {},
			restart,
			sentinel: {
				persisted: sentinelPersisted,
				payload
			}
		}, void 0);
	}
};
//#endregion
export { updateHandlers };
