import { r as STATE_DIR } from "./paths-BBSTUjD5.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { u as normalizeMainKey } from "./session-key-Dbce_H9p.js";
import { S as createConfigIO, n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { i as getRuntimeConfigAppliedHash } from "./runtime-snapshot-Cv5MaU8U.js";
import { n as resolveGatewayAuth } from "./auth-resolve-BCGWcCc0.js";
import "./auth-CqG8D1lM.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import "./sessions-CdrF1uzY.js";
import { n as resolveGatewayAgentSelectionState } from "./agent-list-HVk8EUft.js";
import { t as listSystemPresence } from "./system-presence-Ccv3L_9H.js";
import { n as collectGatewayHealthSnapshot } from "./collector-C73nrMBE.js";
import { r as getUpdateSchedule, t as getUpdateAvailable } from "./update-startup-Ddnh09d7.js";
import { a as projectUpdateAvailable } from "./events-CcYyn8LU.js";
import { t as createPresenceRecipientProjection } from "./presence-projection-Cw-k1V1b.js";
//#region src/gateway/server/health-state.ts
let presenceVersion = 1;
let healthVersion = 1;
let healthCache = null;
let broadcastHealthUpdate = null;
const healthRefreshStates = {
	public: {
		nextGeneration: 0,
		committedGeneration: 0,
		inFlight: {
			passive: null,
			probe: null
		}
	},
	admin: {
		nextGeneration: 0,
		committedGeneration: 0,
		inFlight: {
			passive: null,
			probe: null
		}
	}
};
function buildGatewaySnapshot(opts) {
	const cfg = getRuntimeConfig();
	const selection = resolveGatewayAgentSelectionState(cfg);
	const defaultAgentId = selection.defaultId;
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	const scope = cfg.session?.scope ?? "per-sender";
	const mainSessionKey = scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId: defaultAgentId
	});
	const presence = createPresenceRecipientProjection({
		cfg,
		presence: listSystemPresence()
	})(opts.client);
	const uptimeMs = Math.round(process.uptime() * 1e3);
	const includeUpdateDetails = opts?.includeUpdateDetails === true;
	const updateAvailable = projectUpdateAvailable(getUpdateAvailable(), includeUpdateDetails) ?? void 0;
	const updateSchedule = includeUpdateDetails ? getUpdateSchedule() ?? void 0 : void 0;
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	const snapshot = {
		presence,
		health: {},
		stateVersion: {
			presence: presenceVersion,
			health: healthVersion
		},
		uptimeMs,
		appliedConfigHash: appliedConfigHash ? opts.revisionProjector.projectResolvedHash(appliedConfigHash) : null,
		sessionDefaults: {
			defaultAgentId,
			modelConfigured: Boolean(resolveAgentEffectiveModelPrimary(cfg, defaultAgentId)),
			ownership: selection.ownership,
			selectionRequired: selection.selectionRequired,
			mainKey,
			mainSessionKey,
			scope
		},
		updateAvailable,
		updateSchedule
	};
	if (opts?.includeSensitive === true) {
		const auth = resolveGatewayAuth({
			authConfig: cfg.gateway?.auth,
			env: process.env
		});
		snapshot.configPath = createConfigIO().configPath;
		snapshot.stateDir = STATE_DIR;
		snapshot.authMode = auth.mode;
	}
	return snapshot;
}
function getHealthCache() {
	return healthCache;
}
function getHealthVersion() {
	return healthVersion;
}
function incrementPresenceVersion() {
	presenceVersion += 1;
	return presenceVersion;
}
function getPresenceVersion() {
	return presenceVersion;
}
function setBroadcastHealthUpdate(fn) {
	broadcastHealthUpdate = fn;
}
async function refreshGatewayHealthSnapshot(opts) {
	const includeSensitive = opts?.includeSensitive === true;
	const audience = includeSensitive ? "admin" : "public";
	const state = healthRefreshStates[audience];
	const strength = opts?.probe === false ? "passive" : "probe";
	const existing = strength === "passive" ? state.inFlight.probe ?? state.inFlight.passive : state.inFlight.probe;
	if (existing) return existing.promise;
	const generation = state.nextGeneration + 1;
	state.nextGeneration = generation;
	const promise = (async () => {
		let runtimeSnapshot;
		try {
			runtimeSnapshot = opts?.getRuntimeSnapshot?.();
		} catch {
			runtimeSnapshot = void 0;
		}
		const eventLoop = opts?.getEventLoopHealth?.();
		const configReloadHotReloadStatus = opts?.getConfigReloaderHotReloadStatus?.();
		const snap = await collectGatewayHealthSnapshot({
			audience,
			probe: strength === "probe",
			runtimeSnapshot,
			...eventLoop ? { eventLoop } : {},
			...configReloadHotReloadStatus ? { configReloadHotReloadStatus } : {}
		});
		if (strength === "probe" && state.inFlight.passive && state.inFlight.passive.generation < generation) state.inFlight.passive = null;
		if (!includeSensitive && generation > state.committedGeneration) {
			state.committedGeneration = generation;
			healthCache = snap;
			healthVersion += 1;
			if (broadcastHealthUpdate) broadcastHealthUpdate(snap);
		}
		return snap;
	})().finally(() => {
		if (state.inFlight[strength]?.generation === generation) state.inFlight[strength] = null;
	});
	state.inFlight[strength] = {
		generation,
		promise
	};
	return promise;
}
//#endregion
export { incrementPresenceVersion as a, getPresenceVersion as i, getHealthCache as n, refreshGatewayHealthSnapshot as o, getHealthVersion as r, setBroadcastHealthUpdate as s, buildGatewaySnapshot as t };
