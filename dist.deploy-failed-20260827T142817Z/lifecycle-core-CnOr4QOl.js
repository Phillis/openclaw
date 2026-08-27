import { y as resolveIsNixMode } from "./paths-CqeDjSA4.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { l as readConfigFileSnapshot, s as readBestEffortConfig } from "./io-D1h6pxaD.js";
import { f as isWSL } from "./undici-runtime-BPtCUKlO.js";
import { h as resolveFutureConfigActionBlock } from "./config-env-vars-BITg3hPR.js";
import { n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { n as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CsUZ07YX.js";
import "./config-CW-q_d35.js";
import { x as isSystemdUserServiceAvailable } from "./systemd-DPnIQILH.js";
import { t as createGatewayCredentialPlan } from "./credential-planner-DbFT4bf0.js";
import { n as isGatewaySecretRefUnavailableError, t as GatewaySecretRefUnavailableError } from "./credentials-CBejaoWm.js";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-sW2BPjp8.js";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-DyzHamq7.js";
import { t as appendGatewayLifecycleAuditLog } from "./restart-logs-BwAq4Xj9.js";
import { r as checkTokenDrift } from "./service-audit-DXrhLiU4.js";
import { o as startGatewayService, r as inspectGatewayServiceStartRepair, t as describeGatewayServiceRestart } from "./service-CJsmassN.js";
import { a as renderSystemdUnavailableHints } from "./runtime-hints-Db7lTXFy.js";
import { _ as emitDaemonScheduledRestart, g as emitDaemonAlreadyRunning, i as filterContainerGenericHints, m as createDaemonActionContext, p as buildDaemonServiceSnapshot } from "./shared-Cauz4p0y.js";
import { a as writeGatewayRestartIntentSync, t as clearGatewayRestartIntentSync } from "./restart-intent-KHLytUfT.js";
import { r as isTerminalInteractive } from "./terminal-interactivity-Bmck99HR.js";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint, t as formatInvalidConfigRecoveryHint } from "./config-recovery-hints-Lnv7HBW0.js";
import { l as listAuthProfileStoresRequiringMigration, t as AUTH_PROFILE_MIGRATION_COMMAND } from "./legacy-source-diagnostic-oIpndhGF.js";
import { n as collectCandidateAgentDirs } from "./runtime-fast-path-CWleA27y.js";
//#region src/cli/daemon-cli/lifecycle-audit.ts
function appendGatewayLifecycleAudit(params) {
	appendGatewayLifecycleAuditLog(params.env ?? process.env, {
		action: params.action,
		source: params.source,
		mode: params.mode,
		...params.pid === void 0 ? {} : { pid: params.pid },
		interactive: isTerminalInteractive()
	});
}
function createGatewayLifecycleMutationAudit(params) {
	const reportMutation = createGatewayLifecycleMutationReporter((mutation) => {
		appendGatewayLifecycleAudit({
			action: params.action,
			source: params.source ?? "cli",
			mode: mutation.mode,
			...params.env === void 0 ? {} : { env: params.env }
		});
	});
	return (mutation) => reportMutation(mutation.mode);
}
function createServiceLifecycleMutationAudit(params) {
	return params.serviceNoun === "Gateway" ? createGatewayLifecycleMutationAudit({ action: params.action }) : void 0;
}
function appendServiceLifecycleRepairAudit(params) {
	if (params.serviceNoun !== "Gateway") return;
	appendGatewayLifecycleAudit({
		action: params.action,
		source: "cli",
		mode: "service-repair",
		...params.pid === void 0 ? {} : { pid: params.pid }
	});
}
//#endregion
//#region src/cli/daemon-cli/gateway-token-drift.ts
function authModeDisablesToken(mode) {
	return mode === "password" || mode === "none" || mode === "trusted-proxy";
}
function isPasswordFallbackActive(params) {
	const plan = createGatewayCredentialPlan({
		config: params.cfg,
		env: params.env
	});
	if (plan.authMode !== void 0) return false;
	return plan.passwordCanWin && !plan.tokenCanWin;
}
/** Resolve the expected Gateway token for service drift checks, or undefined when token auth is inactive. */
async function resolveGatewayTokenForDriftCheck(params) {
	const env = params.env ?? process.env;
	const mode = params.cfg.gateway?.auth?.mode;
	if (authModeDisablesToken(mode)) return;
	if (isPasswordFallbackActive({
		cfg: params.cfg,
		env
	})) return;
	const resolved = await resolveGatewayAuthToken({
		cfg: params.cfg,
		env,
		envFallback: "never",
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.token) return resolved.token;
	if (!resolved.secretRefConfigured) return;
	throw new GatewaySecretRefUnavailableError("gateway.auth.token");
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-action-preflight.ts
const ACTION_PROSE = {
	start: "start the gateway service",
	restart: "restart the gateway service",
	stop: "stop the gateway service",
	uninstall: "uninstall the gateway service"
};
const GATEWAY_LAUNCHING_ACTIONS = /* @__PURE__ */ new Set(["start", "restart"]);
function formatPluginPackagingRuntimeOutputRecoveryHints() {
	return formatPluginPackagingRuntimeOutputRecoveryHint().split("\n");
}
/**
* Retired credential files make the gateway throw AuthProfileMigrationRequiredError during boot.
* Blocking here keeps the running service up instead of taking it down into a known-fatal state.
* Only launching actions are gated; stop/uninstall never read the auth store.
*/
function resolveAuthProfileMigrationBlock(action, snapshot) {
	if (!GATEWAY_LAUNCHING_ACTIONS.has(action) || !snapshot.valid) return null;
	let stores;
	try {
		stores = listAuthProfileStoresRequiringMigration({
			agentDirs: collectCandidateAgentDirs(snapshot.runtimeConfig, process.env),
			env: process.env
		});
	} catch {
		return null;
	}
	if (stores.length === 0) return null;
	return {
		message: stores.length === 1 ? `Auth profile store ${stores[0]} requires legacy credential migration.` : `Auth profile stores ${stores.join(", ")} require legacy credential migration.`,
		hints: [`Run \`${AUTH_PROFILE_MIGRATION_COMMAND}\`, then retry this command.`]
	};
}
/** Best-effort validation before a service action mutates runtime state. */
async function getServiceActionPreflightFailure(action) {
	let snapshot;
	try {
		snapshot = await readConfigFileSnapshot();
		if (snapshot.exists && !snapshot.valid) return {
			message: snapshot.issues.length > 0 ? formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true }).join("\n") : "Unknown validation issue.",
			...isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? { hints: formatPluginPackagingRuntimeOutputRecoveryHints() } : {}
		};
	} catch {
		return null;
	}
	const futureBlock = resolveFutureConfigActionBlock({
		action: ACTION_PROSE[action],
		snapshot
	});
	if (futureBlock) return {
		message: futureBlock.message,
		hints: futureBlock.hints
	};
	return resolveAuthProfileMigrationBlock(action, snapshot);
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-core.ts
async function maybeAugmentSystemdHints(hints) {
	if (process.platform !== "linux") return hints;
	if (await isSystemdUserServiceAvailable().catch(() => false)) return hints;
	return [...hints, ...renderSystemdUnavailableHints({
		wsl: await isWSL(),
		kind: "generic_unavailable"
	})];
}
function mergeWarnings(captured, reported) {
	const combined = [...captured, ...reported ?? []];
	return combined.length > 0 ? combined : void 0;
}
async function handleServiceNotLoaded(params) {
	const hints = filterContainerGenericHints(await maybeAugmentSystemdHints(params.renderStartHints()));
	params.emit({
		ok: true,
		result: "not-loaded",
		message: `${params.serviceNoun} service ${params.service.notLoadedText}.`,
		hints,
		service: buildDaemonServiceSnapshot(params.service, params.loaded)
	});
	if (!params.json) {
		defaultRuntime.log(`${params.serviceNoun} service ${params.service.notLoadedText}.`);
		for (const hint of hints) defaultRuntime.log(`Start with: ${hint}`);
	}
}
async function resolveServiceLoadedOrFail(params) {
	try {
		return await params.service.isLoaded({ env: process.env });
	} catch (err) {
		if (params.acceptInstalledDefinition) {
			if (params.service.hasInstalledDefinition ? await params.service.hasInstalledDefinition({ env: process.env }).catch(() => false) : Boolean(await params.service.readCommand(process.env).catch(() => null))) return true;
		}
		params.fail(`${params.serviceNoun} service check failed: ${String(err)}`);
		return null;
	}
}
async function runServiceUninstall(params) {
	const { stdout, emit, fail } = createDaemonActionContext({
		action: "uninstall",
		json: Boolean(params.opts?.json)
	});
	if (resolveIsNixMode(process.env)) {
		fail("Nix mode detected; service uninstall is disabled.");
		return;
	}
	{
		const preflight = await getServiceActionPreflightFailure("uninstall");
		if (preflight) {
			fail(`${params.serviceNoun} uninstall blocked: ${preflight.message}`, preflight.hints);
			return;
		}
	}
	let loaded;
	try {
		loaded = await params.service.isLoaded({ env: process.env });
	} catch {
		loaded = false;
	}
	if (loaded && params.stopBeforeUninstall) try {
		await params.service.stop({
			env: process.env,
			stdout
		});
	} catch {}
	try {
		await params.service.uninstall({
			env: process.env,
			stdout
		});
	} catch (err) {
		fail(`${params.serviceNoun} uninstall failed: ${String(err)}`);
		return;
	}
	try {
		loaded = await params.service.isLoaded({ env: process.env });
	} catch {
		loaded = false;
	}
	if (loaded && params.assertNotLoadedAfterUninstall) {
		fail(`${params.serviceNoun} service still loaded after uninstall.`);
		return;
	}
	emit({
		ok: true,
		result: "uninstalled",
		service: buildDaemonServiceSnapshot(params.service, loaded)
	});
}
async function runServiceStart(params) {
	const json = Boolean(params.opts?.json);
	const { stdout, warnings, emit, fail } = createDaemonActionContext({
		action: "start",
		json
	});
	const warn = json ? (message) => warnings.push(message) : void 0;
	const loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail
	});
	if (loaded === null) return;
	{
		const preflight = await getServiceActionPreflightFailure("start");
		if (preflight) {
			fail(preflight.hints ? `${params.serviceNoun} start blocked: ${preflight.message}` : `${params.serviceNoun} aborted: config is invalid.\n${preflight.message}\n${formatInvalidConfigRecoveryHint()}`, preflight.hints);
			return;
		}
	}
	if (!loaded) try {
		const handled = await params.onNotLoaded?.({
			json,
			stdout,
			warn,
			fail
		});
		if (handled) {
			emit({
				ok: true,
				result: handled.result,
				message: handled.message,
				warnings: mergeWarnings(warnings, handled.warnings),
				service: buildDaemonServiceSnapshot(params.service, handled.loaded ?? false)
			});
			if (!json && handled.message) defaultRuntime.log(handled.message);
			return;
		}
	} catch (err) {
		const hints = params.renderStartHints();
		fail(`${params.serviceNoun} start failed: ${String(err)}`, hints);
		return;
	}
	try {
		const startResult = await startGatewayService(params.service, {
			env: process.env,
			stdout,
			warn,
			onMutation: createServiceLifecycleMutationAudit({
				serviceNoun: params.serviceNoun,
				action: "start"
			})
		}, params.expectedPort);
		if (startResult.outcome === "missing-install") {
			await handleServiceNotLoaded({
				serviceNoun: params.serviceNoun,
				service: params.service,
				loaded: startResult.state.loaded,
				renderStartHints: params.renderStartHints,
				json,
				emit
			});
			return;
		}
		if (startResult.outcome === "already-running") {
			if (startResult.issues.length > 0) {
				const warning = `${params.serviceNoun} service already running, but its installed service definition needs repair: ${startResult.issues.map((issue) => issue.message).join("; ")}; run \`openclaw gateway restart\` to apply.`;
				warnings.push(warning);
				if (!json) defaultRuntime.log(warning);
			}
			emitDaemonAlreadyRunning({
				serviceNoun: params.serviceNoun,
				service: params.service,
				pid: startResult.state.runtime?.pid,
				json,
				warnings,
				emit
			});
			return;
		}
		if (startResult.outcome === "repair-required") {
			try {
				const handled = await params.repairLoadedService?.({
					json,
					stdout,
					warn,
					fail,
					state: startResult.state,
					issues: startResult.issues
				});
				if (handled) {
					appendServiceLifecycleRepairAudit({
						serviceNoun: params.serviceNoun,
						action: "start"
					});
					emit({
						ok: true,
						result: handled.result,
						message: handled.message,
						warnings: mergeWarnings(warnings, handled.warnings),
						service: buildDaemonServiceSnapshot(params.service, handled.loaded ?? true)
					});
					if (!json && handled.message) defaultRuntime.log(handled.message);
					return;
				}
			} catch (err) {
				const hints = params.renderStartHints();
				fail(`${params.serviceNoun} repair failed: ${String(err)}`, hints);
				return;
			}
			fail(`${params.serviceNoun} service needs repair before it can start: ${startResult.issues.map((issue) => issue.message).join("; ")}`, [formatCliCommand("openclaw gateway install --force")]);
			return;
		}
		emit({
			ok: true,
			result: "started",
			service: buildDaemonServiceSnapshot(params.service, startResult.state.loaded),
			warnings: warnings.length ? warnings : void 0
		});
	} catch (err) {
		const hints = params.renderStartHints();
		fail(`${params.serviceNoun} start failed: ${String(err)}`, hints);
	}
}
async function runServiceStop(params) {
	const json = Boolean(params.opts?.json);
	const { stdout, emit, fail } = createDaemonActionContext({
		action: "stop",
		json
	});
	const gatewayStopAudit = createServiceLifecycleMutationAudit({
		serviceNoun: params.serviceNoun,
		action: "stop"
	});
	const loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail
	});
	if (loaded === null) return;
	{
		const preflight = await getServiceActionPreflightFailure("stop");
		if (preflight) {
			fail(`${params.serviceNoun} stop blocked: ${preflight.message}`, preflight.hints);
			return;
		}
	}
	if (!loaded) {
		if (params.stopWhenNotLoaded) {
			try {
				await params.service.stop({
					env: process.env,
					stdout,
					disable: params.opts?.disable,
					onMutation: gatewayStopAudit
				});
			} catch (err) {
				fail(`${params.serviceNoun} stop failed: ${String(err)}`);
				return;
			}
			emit({
				ok: true,
				result: "stopped",
				service: buildDaemonServiceSnapshot(params.service, false)
			});
			return;
		}
		try {
			const handled = await params.onNotLoaded?.({
				json,
				stdout,
				fail
			});
			if (handled) {
				emit({
					ok: true,
					result: handled.result,
					message: handled.message,
					warnings: handled.warnings,
					service: buildDaemonServiceSnapshot(params.service, false)
				});
				if (!json && handled.message) defaultRuntime.log(handled.message);
				return;
			}
		} catch (err) {
			fail(`${params.serviceNoun} stop failed: ${String(err)}`);
			return;
		}
		emit({
			ok: true,
			result: "not-loaded",
			message: `${params.serviceNoun} service ${params.service.notLoadedText}.`,
			service: buildDaemonServiceSnapshot(params.service, loaded)
		});
		if (!json) defaultRuntime.log(`${params.serviceNoun} service ${params.service.notLoadedText}.`);
		return;
	}
	try {
		await params.service.stop({
			env: process.env,
			stdout,
			disable: params.opts?.disable,
			onMutation: gatewayStopAudit
		});
	} catch (err) {
		fail(`${params.serviceNoun} stop failed: ${String(err)}`);
		return;
	}
	let stopped;
	try {
		stopped = await params.service.isLoaded({ env: process.env });
	} catch {
		stopped = false;
	}
	emit({
		ok: true,
		result: "stopped",
		service: buildDaemonServiceSnapshot(params.service, stopped)
	});
}
async function runServiceRestart(params) {
	const json = Boolean(params.opts?.json);
	const { stdout, warnings, emit, fail } = createDaemonActionContext({
		action: "restart",
		json
	});
	const warn = json ? (message) => warnings.push(message) : void 0;
	const restartIntent = params.opts?.restartIntent;
	const gatewayRestartAudit = createServiceLifecycleMutationAudit({
		serviceNoun: params.serviceNoun,
		action: "restart"
	});
	let handledRecovery = null;
	let handledRepair = null;
	let recoveredLoadedState = null;
	let wroteRestartIntent = false;
	const prepareGatewayRestartIntent = async () => {
		if (params.serviceNoun !== "Gateway" || wroteRestartIntent) return;
		wroteRestartIntent = writeGatewayRestartIntentSync({
			targetPid: (await params.service.readRuntime(process.env).catch(() => null))?.pid,
			reason: "gateway.restart",
			...restartIntent ? { intent: restartIntent } : {}
		});
	};
	const clearPreparedRestartIntent = () => {
		if (wroteRestartIntent) {
			clearGatewayRestartIntentSync();
			wroteRestartIntent = false;
		}
	};
	const emitScheduledRestart = (restartStatus, serviceLoaded) => {
		return emitDaemonScheduledRestart({
			json,
			emit,
			result: restartStatus.daemonActionResult,
			message: restartStatus.message,
			service: params.service,
			loaded: serviceLoaded,
			warnings
		});
	};
	const loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail,
		acceptInstalledDefinition: true
	});
	if (loaded === null) return false;
	{
		const preflight = await getServiceActionPreflightFailure("restart");
		if (preflight) {
			fail(preflight.hints ? `${params.serviceNoun} restart blocked: ${preflight.message}` : `${params.serviceNoun} aborted: config is invalid.\n${preflight.message}\n${formatInvalidConfigRecoveryHint()}`, preflight.hints);
			return false;
		}
	}
	if (loaded) params.beforeServiceMutation?.();
	if (!loaded) {
		try {
			handledRecovery = await params.onNotLoaded?.({
				json,
				stdout,
				warn,
				fail
			}) ?? null;
		} catch (err) {
			fail(`${params.serviceNoun} restart failed: ${String(err)}`);
			return false;
		}
		if (!handledRecovery) {
			await handleServiceNotLoaded({
				serviceNoun: params.serviceNoun,
				service: params.service,
				loaded,
				renderStartHints: params.renderStartHints,
				json,
				emit
			});
			return false;
		}
		if (handledRecovery.warnings?.length) warnings.push(...handledRecovery.warnings);
		recoveredLoadedState = handledRecovery.loaded ?? null;
	}
	if (loaded && params.repairLoadedService) try {
		const { state, issues } = await inspectGatewayServiceStartRepair(params.service, { env: process.env }, params.expectedPort);
		if (issues.length > 0) {
			await prepareGatewayRestartIntent();
			handledRepair = await params.repairLoadedService({
				json,
				stdout,
				warn,
				fail,
				state,
				issues
			});
			if (!handledRepair) {
				clearPreparedRestartIntent();
				fail(`${params.serviceNoun} service needs repair before restart: ${issues.map((issue) => issue.message).join("; ")}`, [formatCliCommand("openclaw gateway install --force")]);
				return false;
			}
			appendServiceLifecycleRepairAudit({
				serviceNoun: params.serviceNoun,
				action: "restart",
				pid: state.runtime?.pid
			});
			if (handledRepair.warnings?.length) warnings.push(...handledRepair.warnings);
		}
	} catch (err) {
		clearPreparedRestartIntent();
		const hints = params.renderStartHints();
		fail(`${params.serviceNoun} repair failed: ${String(err)}`, hints);
		return false;
	}
	if (loaded && params.checkTokenDrift) try {
		const command = await params.service.readCommand(process.env);
		const serviceToken = command?.environment?.OPENCLAW_GATEWAY_TOKEN;
		const driftIssue = checkTokenDrift({
			serviceToken,
			configToken: await resolveGatewayTokenForDriftCheck({
				cfg: await readBestEffortConfig(),
				env: {
					...process.env,
					...command?.environment
				}
			})
		});
		if (driftIssue) {
			const warning = driftIssue.detail ? `${driftIssue.message} ${driftIssue.detail}` : driftIssue.message;
			warnings.push(warning);
			if (!json) {
				defaultRuntime.log(`\n⚠️  ${driftIssue.message}`);
				if (driftIssue.detail) defaultRuntime.log(`   ${driftIssue.detail}\n`);
			}
		}
	} catch (err) {
		if (isGatewaySecretRefUnavailableError(err, "gateway.auth.token")) {
			const warning = "Unable to verify gateway token drift: gateway.auth.token SecretRef is configured but unavailable in this command path.";
			warnings.push(warning);
			if (!json) defaultRuntime.log(`\n⚠️  ${warning}\n`);
		}
	}
	try {
		let restartResult = { outcome: "completed" };
		if (loaded && !handledRepair) {
			await prepareGatewayRestartIntent();
			try {
				restartResult = await params.service.restart({
					env: process.env,
					stdout,
					warn,
					onMutation: gatewayRestartAudit
				});
			} catch (err) {
				clearPreparedRestartIntent();
				throw err;
			}
		}
		let restartStatus = describeGatewayServiceRestart(params.serviceNoun, restartResult);
		if (restartStatus.scheduled) return emitScheduledRestart(restartStatus, loaded || recoveredLoadedState === true);
		if (params.postRestartCheck) {
			const postRestartResult = await params.postRestartCheck({
				json,
				stdout,
				warnings,
				warn,
				fail
			});
			if (postRestartResult) {
				restartStatus = describeGatewayServiceRestart(params.serviceNoun, postRestartResult);
				if (restartStatus.scheduled) return emitScheduledRestart(restartStatus, loaded || recoveredLoadedState === true);
			}
		}
		emit({
			ok: true,
			result: "restarted",
			message: handledRecovery?.message ?? handledRepair?.message,
			service: buildDaemonServiceSnapshot(params.service, loaded || recoveredLoadedState === true),
			warnings: warnings.length ? warnings : void 0
		});
		const actionMessage = handledRecovery?.message ?? handledRepair?.message;
		if (!json && actionMessage) defaultRuntime.log(actionMessage);
		return true;
	} catch (err) {
		const hints = params.renderStartHints();
		fail(`${params.serviceNoun} restart failed: ${String(err)}`, hints);
		return false;
	}
}
//#endregion
export { appendGatewayLifecycleAudit as a, runServiceUninstall as i, runServiceStart as n, createGatewayLifecycleMutationAudit as o, runServiceStop as r, runServiceRestart as t };
