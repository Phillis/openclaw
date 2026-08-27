import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as getRegisteredDetachedTaskLifecycleRuntime } from "./detached-task-runtime-state--xQXeO5n.js";
import { S as getTaskById, n as cancelTaskById, t as assertTaskCancellationReadyById } from "./task-registry-DzN8snH1.js";
import "./runtime-internal-KZAce0-2.js";
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
