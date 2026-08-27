//#region src/infra/node-commands.ts
const NODE_SYSTEM_RUN_COMMANDS = [
	"system.run.prepare",
	"system.run",
	"system.which"
];
const NODE_SYSTEM_NOTIFY_COMMAND = "system.notify";
const NODE_FS_LIST_DIR_COMMAND = "fs.listDir";
const NODE_TERMINAL_UPLOAD_COMMAND = "terminal.upload";
const NODE_FILE_COMMANDS = [NODE_FS_LIST_DIR_COMMAND, NODE_TERMINAL_UPLOAD_COMMAND];
const NODE_BROWSER_PROXY_COMMANDS = ["browser.proxy", "browser.proxy.upload.v1"];
const NODE_MCP_TOOLS_CALL_COMMAND = "mcp.tools.call.v1";
const NODE_AGENT_CLI_CLAUDE_RUN_COMMAND = "agent.cli.claude.run.v1";
const NODE_DEVICE_APPS_COMMAND = "device.apps";
const NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND = "worker.launch.v1";
const NODE_WORKER_SUPERVISOR_STATUS_COMMAND = "worker.status.v1";
const NODE_WORKER_SUPERVISOR_CANCEL_COMMAND = "worker.cancel.v1";
const NODE_WORKER_WORKSPACE_EXEC_COMMAND = "worker.workspace.exec.v1";
const NODE_WORKER_WORKSPACE_RETAIN_COMMAND = "worker.workspace.retain.v1";
const NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE = "WORKER_CAPACITY_EXHAUSTED";
const NODE_WORKER_PRIVATE_COMMANDS = [
	NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND,
	NODE_WORKER_SUPERVISOR_STATUS_COMMAND,
	NODE_WORKER_SUPERVISOR_CANCEL_COMMAND,
	NODE_WORKER_WORKSPACE_EXEC_COMMAND,
	NODE_WORKER_WORKSPACE_RETAIN_COMMAND
];
const PRIVATE_NODE_INVOKE_COMMAND_SET = new Set(NODE_WORKER_PRIVATE_COMMANDS);
/** Private node controls are never part of advertised or operator-invocable command surfaces. */
function isPrivateNodeInvokeCommand(command) {
	return typeof command === "string" && PRIVATE_NODE_INVOKE_COMMAND_SET.has(command.trim());
}
function filterPublicNodeCommands(commands) {
	return commands.filter((command) => !isPrivateNodeInvokeCommand(command));
}
const NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS = 3e4;
const NODE_EXEC_APPROVALS_COMMANDS = ["system.execApprovals.get", "system.execApprovals.set"];
const NODE_ADMIN_ONLY_INVOKE_COMMANDS = [
	...NODE_BROWSER_PROXY_COMMANDS,
	NODE_FS_LIST_DIR_COMMAND,
	NODE_TERMINAL_UPLOAD_COMMAND
];
const NODE_ADMIN_ONLY_INVOKE_COMMAND_SET = new Set(NODE_ADMIN_ONLY_INVOKE_COMMANDS);
/** Returns true when direct node invocation crosses an admin-only host boundary. */
function isAdminOnlyNodeInvokeCommand(command) {
	return typeof command === "string" && NODE_ADMIN_ONLY_INVOKE_COMMAND_SET.has(command);
}
/** Returns true for every versioned Browser node proxy command. */
function isBrowserProxyNodeInvokeCommand(command) {
	return typeof command === "string" && NODE_BROWSER_PROXY_COMMANDS.includes(command);
}
const NODE_MCP_TOOL_CALL_TIMEOUT_MS = 12e4;
const NODE_MCP_TOOL_CALL_GATEWAY_TIMEOUT_MS = 125e3;
//#endregion
export { isBrowserProxyNodeInvokeCommand as C, isAdminOnlyNodeInvokeCommand as S, NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND as _, NODE_EXEC_APPROVALS_COMMANDS as a, NODE_WORKER_WORKSPACE_RETAIN_COMMAND as b, NODE_MCP_TOOLS_CALL_COMMAND as c, NODE_SYSTEM_NOTIFY_COMMAND as d, NODE_SYSTEM_RUN_COMMANDS as f, NODE_WORKER_SUPERVISOR_CANCEL_COMMAND as g, NODE_WORKER_PRIVATE_COMMANDS as h, NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS as i, NODE_MCP_TOOL_CALL_GATEWAY_TIMEOUT_MS as l, NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE as m, NODE_BROWSER_PROXY_COMMANDS as n, NODE_FILE_COMMANDS as o, NODE_TERMINAL_UPLOAD_COMMAND as p, NODE_DEVICE_APPS_COMMAND as r, NODE_FS_LIST_DIR_COMMAND as s, NODE_AGENT_CLI_CLAUDE_RUN_COMMAND as t, NODE_MCP_TOOL_CALL_TIMEOUT_MS as u, NODE_WORKER_SUPERVISOR_STATUS_COMMAND as v, isPrivateNodeInvokeCommand as w, filterPublicNodeCommands as x, NODE_WORKER_WORKSPACE_EXEC_COMMAND as y };
