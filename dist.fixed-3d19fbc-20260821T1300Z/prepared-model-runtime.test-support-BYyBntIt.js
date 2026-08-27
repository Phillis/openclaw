//#region src/agents/prepared-model-runtime.test-support.ts
/** Clears prepared model owners when the production module is loaded in this test worker. */
function resetPreparedModelRuntimeSnapshotsForTest() {
	globalThis[Symbol.for("openclaw.preparedModelRuntimeTestApi")]?.resetPreparedModelRuntimeSnapshotsForTest();
}
//#endregion
export { resetPreparedModelRuntimeSnapshotsForTest };
