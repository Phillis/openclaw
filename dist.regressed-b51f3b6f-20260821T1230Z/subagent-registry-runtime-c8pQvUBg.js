//#region src/agents/subagents/registry/subagent-registry-runtime.ts
async function replaceSubagentRunAfterSteer(params) {
	return (await import("./subagent-registry-BeTV-3wU.js")).replaceSubagentRunAfterSteerCore(params);
}
//#endregion
export { replaceSubagentRunAfterSteer };
