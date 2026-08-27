import { i as readFileDescriptorBounded } from "./boundary-file-read-h_n3tTfV.js";
//#region src/agents/workspace-bootstrap-read.ts
const MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES = 2 * 1024 * 1024;
async function readWorkspaceBootstrapFile(fd) {
	return (await readFileDescriptorBounded(fd, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES)).toString("utf-8");
}
//#endregion
export { readWorkspaceBootstrapFile as n, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES as t };
