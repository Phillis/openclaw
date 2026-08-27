import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as getRegisteredDetachedTaskLifecycleRuntime } from "./detached-task-runtime-state-XujR9BCp.js";
import { n as cancelTaskById, t as assertTaskCancellationReadyById, x as getTaskById } from "./task-registry-1cqXcWjA.js";
import "./runtime-internal-Ckk2djFk.js";
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
