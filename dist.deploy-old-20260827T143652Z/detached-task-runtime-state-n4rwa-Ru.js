import { S as requireActivePluginRegistry } from "./runtime-g0R28Sy0.js";
//#region src/tasks/detached-task-runtime-state.ts
const getRegistrations = () => requireActivePluginRegistry().detachedTaskRuntimes;
function getRegisteredDetachedTaskLifecycleRuntime() {
	return getRegistrations()[0]?.runtime;
}
//#endregion
export { getRegisteredDetachedTaskLifecycleRuntime as t };
