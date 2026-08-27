import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-ChqKLfPp.js";
import { s as readConfigFileSnapshot } from "./io-DlN5njvP.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-C0L8fX98.js";
import "./config-B2bSneS2.js";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-8MjcFmVH.js";
import { r as detectRespawnSupervisor } from "./supervisor-markers-BXjiMLrU.js";
import { t as resolveStableNodePath } from "./stable-node-path-CysbL5Xo.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { n as isRestartEnabled } from "./commands.flags-CZN5Wwe1.js";
import { Ba as validateUpdateHoldParams, Ha as validateUpdateRunParams, Ua as validateUpdateStatusParams, Va as validateUpdateHoldResult, Wa as validateUpdateStatusResult } from "./src-4dv5TpeQ.js";
import { t as extractDeliveryInfo } from "./sessions-CdrF1uzY.js";
import { f as scheduleGatewaySigusr1Restart, o as normalizeGatewayRestartDelayMs, u as resolveGatewayRestartDeferralTimeoutMs } from "./restart-Znvaw4so.js";
import { h as resolveUpdateInstallRoot, m as writeRestartSentinel, p as trimLogTail } from "./restart-sentinel-BabYlCrz.js";
import { l as buildUpdateRestartSentinelPayload, t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON, u as normalizeControlPlaneUpdateResult } from "./update-control-plane-sentinel-BujVAevG.js";
import { r as devUpdateTargetFromGitTarget } from "./update-dev-target-BGSFRuDr.js";
import { a as formatManagedServiceUpdateCommand, s as startManagedServiceUpdateHandoff, t as buildManagedServiceHandoffUnavailableMessage } from "./update-managed-service-handoff-BoFfquwu.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { d as resolveEffectiveUpdateChannel, i as UPDATE_EFFECTIVE_CHANNEL_ENV, l as normalizeUpdateChannel } from "./update-channels-D2-WrHya.js";
import { i as buildPostCoreHandoffEnv } from "./update-post-core-context-BIm4ywkD.js";
import { r as readPackageVersion } from "./package-json-BoWJND-q.js";
import { n as runGatewayUpdatePreflight, r as resolveUpdateInstallSurface, t as runGatewayUpdate } from "./update-runner-DHF8R-8n.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as parseRestartRequestParams } from "./restart-request-cVXXa5KE.js";
import { a as refreshGatewayUpdateStatus, c as gatewayUpdateCampaign, i as initializeGatewayUpdateStatus, n as getUpdateEffectiveChannel, r as getUpdateSchedule, t as getUpdateAvailable } from "./update-startup-DqjzQL8s.js";
import { a as refreshLatestUpdateRestartSentinel, n as getLatestUpdateRestartSentinel, r as recordLatestUpdateRestartSentinel } from "./server-restart-sentinel-BJyvAfac.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
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
const updateStatusCheckoutRefreshes = /* @__PURE__ */ new WeakMap();
function refreshUpdateStatusCheckout(config) {
	const current = updateStatusCheckoutRefreshes.get(config);
	if (current) return current;
	const refresh = refreshGatewayUpdateStatus(config).finally(() => {
		if (updateStatusCheckoutRefreshes.get(config) === refresh) updateStatusCheckoutRefreshes.delete(config);
	});
	updateStatusCheckoutRefreshes.set(config, refresh);
	return refresh;
}
async function readPreUpdateConfigForPostCoreFinalize() {
	const snapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
	if (!snapshot.valid) return;
	return {
		sourceConfig: snapshot.sourceConfig,
		authoredConfig: isRecord(snapshot.parsed) ? snapshot.parsed : snapshot.sourceConfig
	};
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
		const config = context?.getRuntimeConfig?.();
		const configChannel = normalizeUpdateChannel(config?.update?.channel);
		if (params.refreshCheckout === true && config) try {
			await refreshUpdateStatusCheckout(config);
		} catch (err) {
			context?.logGateway?.warn(`update.status checkout refresh failed: ${formatUpdateRunErrorMessage(err)}`);
		}
		const schedule = getUpdateSchedule();
		let effectiveChannel = configChannel ?? normalizeUpdateChannel(schedule?.channel);
		if (!effectiveChannel) try {
			effectiveChannel = await getUpdateEffectiveChannel();
		} catch (err) {
			context?.logGateway?.warn(`update.status install identity failed: ${formatUpdateRunErrorMessage(err)}`);
		}
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
		const actor = resolveControlPlaneActor(client);
		const { sessionKey, deliveryContext: requestedDeliveryContext, threadId: requestedThreadId, note, continuationMessage, restartDelayMs: requestedRestartDelayMs } = parseRestartRequestParams(params);
		const restartDelayMs = normalizeGatewayRestartDelayMs(requestedRestartDelayMs);
		const { deliveryContext: sessionDeliveryContext, threadId: sessionThreadId } = extractDeliveryInfo(sessionKey);
		const deliveryContext = requestedDeliveryContext ?? sessionDeliveryContext;
		const threadId = requestedThreadId ?? sessionThreadId;
		const timeoutMsRaw = params.timeoutMs;
		const timeoutMs = typeof timeoutMsRaw === "number" && Number.isFinite(timeoutMsRaw) ? Math.max(1e3, Math.floor(timeoutMsRaw)) : void 0;
		let result;
		let handoff = null;
		let managedHandoffRestart = null;
		let ownsManagedServiceHandoff = true;
		let adoptedCampaignId;
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
			const { root, status } = await initializeGatewayUpdateStatus();
			const installSurface = await resolveUpdateInstallSurface({
				root,
				installKind: status.installKind,
				timeoutMs
			});
			const installRoot = installSurface.root;
			const effectiveChannel = resolveEffectiveUpdateChannel({
				configChannel,
				currentVersion: VERSION,
				installKind: status.installKind,
				git: status.git
			}).channel;
			const requestedTarget = params.target;
			const explicitDevTarget = isRecord(requestedTarget) && requestedTarget.kind === "git" && typeof requestedTarget.upstreamRef === "string" && /^[^\s\p{Cc}]+$/u.test(requestedTarget.upstreamRef) && typeof requestedTarget.upstreamSha === "string" && /^[a-f\d]{40}$/iu.test(requestedTarget.upstreamSha) ? devUpdateTargetFromGitTarget({
				upstreamRef: requestedTarget.upstreamRef,
				upstreamSha: requestedTarget.upstreamSha
			}) : void 0;
			let targetFailureReason = requestedTarget !== void 0 && !explicitDevTarget ? "invalid-update-target" : explicitDevTarget && (installSurface.kind !== "git" || effectiveChannel !== "dev") ? "unsupported-update-target" : explicitDevTarget && explicitDevTarget.upstreamRef !== status.git?.upstream ? "update-target-upstream-mismatch" : void 0;
			const adoption = targetFailureReason ? void 0 : gatewayUpdateCampaign.adopt(explicitDevTarget);
			if (adoption?.status === "mismatch") targetFailureReason = "update-target-campaign-mismatch";
			else if (adoption?.status === "applying") targetFailureReason = "update-campaign-applying";
			const adoptedCampaign = adoption?.status === "adopted" ? adoption : void 0;
			adoptedCampaignId = adoptedCampaign?.campaignId;
			const adoptedDevTarget = adoptedCampaign?.target.kind === "git" ? devUpdateTargetFromGitTarget(adoptedCampaign.target) : void 0;
			const adoptedPackageTargetVersion = adoptedCampaign?.target.kind === "package" ? adoptedCampaign.target.version.trim() || void 0 : void 0;
			if (adoptedCampaign) context?.logGateway?.info(`update.run adopted campaign ${adoptedCampaign.campaignId} ${formatControlPlaneActor(actor)}`, { target: adoptedCampaign.target });
			const devTarget = explicitDevTarget ?? adoptedDevTarget;
			const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
			const requiresManagedServiceHandoff = installSurface.kind === "global" || installSurface.kind === "git" && supervisor !== null;
			const managedGitPreflightFailure = !targetFailureReason && installSurface.kind === "git" && effectiveChannel === "dev" && supervisor && !isGatewayExternallySupervised() ? await runGatewayUpdatePreflight(installRoot, timeoutMs, devTarget) : void 0;
			if (targetFailureReason) result = {
				status: "error",
				mode: installSurface.mode,
				...installRoot ? { root: installRoot } : {},
				reason: targetFailureReason,
				steps: [],
				durationMs: 0
			};
			else if (installSurface.kind === "missing") result = {
				status: "error",
				mode: "unknown",
				reason: "not-openclaw-root",
				steps: [],
				durationMs: 0
			};
			else if (isGatewayExternallySupervised()) {
				const beforeVersion = await readPackageVersion(installSurface.root);
				result = {
					status: "skipped",
					mode: installSurface.mode,
					root: installSurface.root,
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
			} else if (managedGitPreflightFailure) result = managedGitPreflightFailure;
			else if (requiresManagedServiceHandoff) {
				if (!installRoot) throw new Error("managed update install root is unavailable");
				const handoffChannel = installSurface.kind === "git" ? void 0 : effectiveChannel === "extended-stable" ? effectiveChannel : configChannel ?? void 0;
				const command = formatManagedServiceUpdateCommand({
					timeoutMs,
					...handoffChannel ? { channel: handoffChannel } : {},
					...adoptedPackageTargetVersion ? { tag: adoptedPackageTargetVersion } : {}
				});
				if (supervisor) try {
					const beforeVersion = await readPackageVersion(installRoot);
					const startedAt = Date.now();
					const handoffId = randomUUID();
					const managedRestartDelayMs = supervisor === "systemd" ? Math.max(restartDelayMs, MANAGED_HANDOFF_RESTART_DELAY_MS) : restartDelayMs;
					sentinelMeta.handoffId = handoffId;
					sentinelMeta.root = resolveUpdateInstallRoot(installRoot);
					const started = await startManagedServiceUpdateHandoff({
						root: installRoot,
						timeoutMs,
						restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
						...handoffChannel ? { channel: handoffChannel } : {},
						...adoptedPackageTargetVersion ? { tag: adoptedPackageTargetVersion } : {},
						...devTarget ? { devTarget } : {},
						restartDelayMs: managedRestartDelayMs,
						meta: sentinelMeta,
						handoffId,
						supervisor
					});
					ownsManagedServiceHandoff = started.status === "started";
					sentinelMeta.handoffId = started.handoffId ?? handoffId;
					if (started.status === "started") {
						handoff = {
							status: "started",
							...started.pid ? { pid: started.pid } : {},
							command: started.command
						};
						managedHandoffRestart = scheduleGatewaySigusr1Restart({
							delayMs: managedRestartDelayMs,
							reason: "update.run",
							successorOwner: {
								kind: "managed-update-handoff",
								handoffId: started.handoffId,
								installRoot: started.installRoot
							},
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
					cwd: installSurface.root,
					channel: installSurface.kind === "git" ? configChannel ?? void 0 : effectiveChannel === "extended-stable" ? effectiveChannel : configChannel ?? void 0,
					...adoptedPackageTargetVersion ? { tag: adoptedPackageTargetVersion } : {},
					...devTarget ? { devTarget } : {},
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
