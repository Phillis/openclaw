import { S as describeAgentsWaitTool, x as describeAgentsListTool } from "./tool-catalog-DKzjKSZr.js";
import { n as isAutomationsToolName } from "./automations-tool-name-DBMZPbPL.js";
import { u as copyAgentToolMetadata } from "./gateway-caller-context-D1DYQtHE.js";
import { n as describeProcessTool, t as describeExecTool } from "./bash-tools.descriptions-CEkY4pe5.js";
//#region src/agents/agent-tools.deferred-followup.ts
function replaceDescription(tool, description) {
	return copyAgentToolMetadata(tool, {
		...tool,
		description
	});
}
const TOOL_FOLLOWUPS = [
	[
		"gateway",
		"openclaw",
		" unavailable; ask human.",
		": use openclaw tool."
	],
	[
		"sessions_search",
		"sessions_history",
		"Search your own past sessions for matching user and assistant text.",
		"Search your own past sessions for matching user and assistant text. Follow up with sessions_history using a returned sessionKey, sessionId, and messageId for neighboring context."
	],
	[
		"conversations_send",
		"conversations_list",
		"through a conversationRef.",
		"through a conversationRef from conversations_list."
	],
	[
		"sessions_spawn",
		"agents_list",
		"configured agent;",
		"configured agent (see agents_list);"
	],
	[
		"sessions_spawn",
		"agents_wait",
		"`groupId` groups a batch.",
		"`groupId` groups a batch; await with agents_wait."
	]
];
function describeAvailableTool(tool, availableTools) {
	let description = tool.description;
	for (const [sourceTool, requiredTool, original, expanded] of TOOL_FOLLOWUPS) if (sourceTool === tool.name && availableTools.has(requiredTool)) description = description.replace(original, expanded);
	if (tool.name === "sessions_send") {
		const deliveryTools = ["conversations_send", "conversations_turn"].filter((name) => availableTools.has(name));
		if (availableTools.has("conversations_list") && deliveryTools.length > 0) {
			const guidance = `For an exact external destination, use \`conversations_list\` plus ${deliveryTools.map((name) => `\`${name}\``).join("/")}.`;
			description = description.replace(" Thread chats rejected:", ` ${guidance} Thread chats rejected:`);
		}
	}
	if (tool.name === "sessions_spawn") {
		const statusTools = ["subagents", "sessions_history"].filter((name) => availableTools.has(name));
		if (statusTools.length > 0) {
			const guidance = statusTools.map((name) => `\`${name}\``).join("/");
			description = description.replace("No spawn for quick lookup/single read.", `No spawn for quick lookup/single read. Check spawns via ${guidance}.`);
		}
	}
	return description;
}
/** Return tools with cross-tool guidance adjusted for the tools that survived filtering. */
function applyToolAvailabilityDescriptions(tools, params) {
	const availableTools = new Set(tools.map((tool) => tool.name));
	const hasCronTool = tools.some((tool) => isAutomationsToolName(tool.name));
	const hasProcessTool = availableTools.has("process");
	const hasSessionsSpawnTool = availableTools.has("sessions_spawn");
	return tools.map((tool) => {
		if (tool.name === "exec") return replaceDescription(tool, describeExecTool({
			agentId: params?.agentId,
			hasCronTool,
			hasProcessTool
		}));
		if (tool.name === "process") return replaceDescription(tool, describeProcessTool({ hasCronTool }));
		if (tool.name === "agents_list") return replaceDescription(tool, describeAgentsListTool(hasSessionsSpawnTool));
		if (tool.name === "agents_wait") return replaceDescription(tool, describeAgentsWaitTool(hasSessionsSpawnTool));
		const description = describeAvailableTool(tool, availableTools);
		return description === tool.description ? tool : replaceDescription(tool, description);
	});
}
//#endregion
export { applyToolAvailabilityDescriptions as t };
