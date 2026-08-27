import { w as requireActivePluginRegistry } from "./runtime-DMlUh4Cg.js";
//#region src/tasks/detached-task-runtime-state.ts
const getRegistrations = () => requireActivePluginRegistry().detachedTaskRuntimes;
function getRegisteredDetachedTaskLifecycleRuntime() {
	return getRegistrations()[0]?.runtime;
}
//#endregion
export { getRegisteredDetachedTaskLifecycleRuntime as t };
