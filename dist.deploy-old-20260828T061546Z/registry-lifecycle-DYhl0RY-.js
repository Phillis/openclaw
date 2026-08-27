//#region src/plugins/registry-lifecycle.ts
const retiredRegistries = /* @__PURE__ */ new WeakSet();
const activatedRegistries = /* @__PURE__ */ new WeakSet();
const registryEpochs = /* @__PURE__ */ new WeakMap();
const recordEpochs = /* @__PURE__ */ new WeakMap();
const revokedRecordEpoch = Object.freeze({});
/** Marks a registry retired so late runtime calls can reject stale plugin state. */
function markPluginRegistryRetired(registry) {
	if (registry) {
		retiredRegistries.add(registry);
		registryEpochs.delete(registry);
	}
}
/** Marks a registry active and clears any previous retired state. */
function markPluginRegistryActive(registry) {
	if (registry) {
		activatedRegistries.add(registry);
		retiredRegistries.delete(registry);
		registryEpochs.set(registry, Object.freeze({}));
	}
}
/** Capture the exact activation generation currently owned by a registry. */
function capturePluginRegistryLifecycleEpoch(registry) {
	return retiredRegistries.has(registry) ? void 0 : registryEpochs.get(registry);
}
/** True only while the exact captured registry activation remains current. */
function isPluginRegistryLifecycleEpochActive(registry, epoch) {
	return !retiredRegistries.has(registry) && registryEpochs.get(registry) === epoch;
}
/** Mint the exact record generation used by one registered native channel runtime. */
function activatePluginRecordLifecycleEpoch(registry, record) {
	const registryEpoch = registryEpochs.get(registry);
	if (!registryEpoch || retiredRegistries.has(registry)) return;
	const epoch = Object.freeze({ registryEpoch });
	const epochs = recordEpochs.get(registry) ?? /* @__PURE__ */ new WeakMap();
	epochs.set(record, epoch);
	recordEpochs.set(registry, epochs);
	return epoch;
}
/** Return an epoch only while its exact registry activation and record remain current. */
function isPluginRecordLifecycleEpochActive(registry, record, epoch) {
	const registryEpoch = registryEpochs.get(registry);
	const epochRegistry = Object.getOwnPropertyDescriptor(epoch, "registryEpoch");
	return registryEpoch !== void 0 && !retiredRegistries.has(registry) && epochRegistry !== void 0 && "value" in epochRegistry && epochRegistry.value === registryEpoch && recordEpochs.get(registry)?.get(record) === epoch;
}
/** Revoke one record without changing unrelated records in the same registry. */
function revokePluginRecordLifecycleEpoch(registry, record) {
	const epochs = recordEpochs.get(registry) ?? /* @__PURE__ */ new WeakMap();
	epochs.set(record, revokedRecordEpoch);
	recordEpochs.set(registry, epochs);
}
/** True when a registry has been activated for runtime use. */
function isPluginRegistryActivated(registry) {
	return activatedRegistries.has(registry);
}
/** True when a registry has been retired by a newer active registry. */
function isPluginRegistryRetired(registry) {
	return retiredRegistries.has(registry);
}
/** Capture an activation; reactivating the same objects must not revive an old operation. */
function capturePluginLifecycleAuthority(registry, record, options) {
	const epoch = registryEpochs.get(registry);
	const recordEpoch = record && recordEpochs.get(registry)?.get(record);
	if (!epoch && !options?.scopedRuntime || retiredRegistries.has(registry) || recordEpoch === revokedRecordEpoch) return;
	return () => registryEpochs.get(registry) === epoch && !retiredRegistries.has(registry) && (!record || registry.plugins.includes(record) && record.enabled && record.status === "loaded" && recordEpochs.get(registry)?.get(record) === recordEpoch);
}
//#endregion
export { isPluginRegistryActivated as a, markPluginRegistryActive as c, isPluginRecordLifecycleEpochActive as i, markPluginRegistryRetired as l, capturePluginLifecycleAuthority as n, isPluginRegistryLifecycleEpochActive as o, capturePluginRegistryLifecycleEpoch as r, isPluginRegistryRetired as s, activatePluginRecordLifecycleEpoch as t, revokePluginRecordLifecycleEpoch as u };
