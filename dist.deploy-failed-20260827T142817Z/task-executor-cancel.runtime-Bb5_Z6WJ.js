import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as getRegisteredDetachedTaskLifecycleRuntime } from "./detached-task-runtime-state-BYg9364_.js";
import { n as cancelTaskById, t as assertTaskCancellationReadyById, x as getTaskById } from "./task-registry-CV6EhTBX.js";
import "./runtime-internal-CbPNKBWW.js";
//#region src/tasks/task-executor-cancel.runtime.ts
async function cancelDetachedTaskRunByIdCore(params) {
	const task = getTaskById(params.taskId);
	const registeredRuntime = getRegisteredDetachedTaskLifecycleRuntime();
	if (!task) {
		if (registeredRuntime) {
			const cancelled = await registeredRuntime.cancelDetachedTaskRunById(params);
			if (cancelled.found) return cancelled;
		}
		return cancelTaskById(params);
	}
	try {
		assertTaskCancellationReadyById(task.taskId);
	} catch (error) {
		return {
			found: true,
			cancelled: false,
			reason: formatErrorMessage(error),
			task
		};
	}
	if (registeredRuntime) {
		const cancelled = await registeredRuntime.cancelDetachedTaskRunById(params);
		if (cancelled.found) return cancelled;
	}
	return cancelTaskById(params);
}
//#endregion
export { cancelDetachedTaskRunByIdCore };
