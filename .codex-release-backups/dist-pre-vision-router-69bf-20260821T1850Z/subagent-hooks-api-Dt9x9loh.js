import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
//#region extensions/discord/subagent-hooks-api.ts
const loadDiscordSubagentHooksModule = createLazyRuntimeModule(() => import("./subagent-hooks-DD2KdV5v.js"));
const loadDiscordSubagentProgressModule = createLazyRuntimeModule(() => import("./subagent-progress-CYn0jsGO.js"));
function registerDiscordSubagentHooks(api) {
	api.on("gateway_start", async () => {
		const { recoverDiscordSubagentProgress } = await loadDiscordSubagentProgressModule();
		await recoverDiscordSubagentProgress(api);
	});
	api.on("subagent_ended", async (event) => {
		const { handleDiscordSubagentEnded } = await loadDiscordSubagentHooksModule();
		handleDiscordSubagentEnded(event);
	});
	api.on("subagent_delivery_target", async (event) => {
		const { handleDiscordSubagentDeliveryTarget } = await loadDiscordSubagentHooksModule();
		return handleDiscordSubagentDeliveryTarget(event);
	});
}
//#endregion
export { registerDiscordSubagentHooks as t };
