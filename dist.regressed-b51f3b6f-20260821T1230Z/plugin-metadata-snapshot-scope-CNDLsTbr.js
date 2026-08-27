import { i as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-DwABKB-T.js";
import { a as rebasePluginMetadataSnapshotManifestRegistry, i as loadPluginMetadataSnapshot, n as isPluginMetadataSnapshotCompatible, t as completePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-BQhELyO0.js";
//#region src/commands/doctor/shared/plugin-metadata-snapshot-scope.ts
const configWideDoctorSnapshots = /* @__PURE__ */ new WeakSet();
/** Aligns Doctor's immutable snapshot view with config-wide agent workspace discovery. */
function resolveConfigWideDoctorPluginMetadataSnapshot(params) {
	if (configWideDoctorSnapshots.has(params.snapshot)) return params.snapshot;
	const manifestRegistry = resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.env,
		allowCurrent: false
	});
	const snapshot = rebasePluginMetadataSnapshotManifestRegistry(params.snapshot, manifestRegistry);
	configWideDoctorSnapshots.add(snapshot);
	return snapshot;
}
/** Promotes validation-scoped metadata to a complete immutable Doctor snapshot. */
function completeDoctorPluginMetadataSnapshot(params) {
	const snapshot = completePluginMetadataSnapshot(params);
	return snapshot ? resolveConfigWideDoctorPluginMetadataSnapshot({
		snapshot,
		config: params.config,
		env: params.env
	}) : void 0;
}
/** Reuses one exact immutable plugin metadata generation per Doctor workspace. */
function createDoctorPluginMetadataSnapshotScope(params) {
	const env = params.env ?? process.env;
	const snapshotsByWorkspace = /* @__PURE__ */ new Map();
	const readBaseSnapshot = () => params.getBaseSnapshot?.() ?? params.baseSnapshot;
	let currentBaseSnapshot;
	const refreshBaseSnapshot = () => {
		const nextBaseSnapshot = readBaseSnapshot();
		if (nextBaseSnapshot === currentBaseSnapshot) return;
		currentBaseSnapshot = nextBaseSnapshot;
		snapshotsByWorkspace.clear();
		if (nextBaseSnapshot && nextBaseSnapshot.pluginIds === void 0) snapshotsByWorkspace.set(nextBaseSnapshot.workspaceDir, nextBaseSnapshot);
	};
	const resolveSnapshot = (config, workspaceDir) => {
		refreshBaseSnapshot();
		const current = snapshotsByWorkspace.get(workspaceDir);
		if (current && isPluginMetadataSnapshotCompatible({
			snapshot: current,
			config,
			env,
			workspaceDir
		})) {
			const snapshot = resolveConfigWideDoctorPluginMetadataSnapshot({
				snapshot: current,
				config,
				env
			});
			snapshotsByWorkspace.set(workspaceDir, snapshot);
			return snapshot;
		}
		const snapshot = resolveConfigWideDoctorPluginMetadataSnapshot({
			snapshot: loadPluginMetadataSnapshot({
				config,
				env,
				...workspaceDir ? { workspaceDir } : {}
			}),
			config,
			env
		});
		snapshotsByWorkspace.set(workspaceDir, snapshot);
		return snapshot;
	};
	const run = (scope, operation) => {
		return withPluginMetadataSnapshotScope(resolveSnapshot(scope.config, scope.workspaceDir), operation, {
			config: scope.config,
			env,
			...scope.workspaceDir ? { workspaceDir: scope.workspaceDir } : {}
		});
	};
	return {
		run,
		invalidate: () => {
			currentBaseSnapshot = void 0;
			snapshotsByWorkspace.clear();
		}
	};
}
//#endregion
export { createDoctorPluginMetadataSnapshotScope as n, resolveConfigWideDoctorPluginMetadataSnapshot as r, completeDoctorPluginMetadataSnapshot as t };
