import { i as getPluginToolMeta } from "./tools-tey_1PC-.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-jN4PguVr.js";
import { a as getOrCreateSessionMcpRuntime, c as rememberAdvertisedScopedMcpCatalog, g as mergeMcpConnectCatalog, i as getOrCreateRequesterScopedMcpRuntime, l as retireSessionMcpRuntime, r as getAdvertisedScopedMcpCatalog } from "./agent-bundle-mcp-manager-api---RxFpSz.js";
import { n as requiresMcpCodexToolApproval } from "./mcp-codex-tool-approval-qXI1z_QK.js";
import "./agent-bundle-mcp-runtime-Bmkx958o.js";
import { r as materializeBundleMcpToolsForRun, t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-Cxv5pslJ.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-JlfT_Mo_.js";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D_uFFO7I.js";
//#region src/agents/agent-bundle-mcp-harness.ts
function formatScheduledMcpDiagnosticNotice(messages) {
	const bounded = [...new Set(messages)].map((message) => message.replaceAll(/\s+/g, " ").trim().slice(0, 180)).filter(Boolean).slice(0, 4);
	if (bounded.length === 0) return;
	return `Configured MCP is incomplete for this scheduled run: ${bounded.join("; ")}. Do not claim MCP-backed work succeeded; report this blocker to the operator.`;
}
function isScheduledCodexApprovalAllowed(tool, autoApprove) {
	const mcp = getPluginToolMeta(tool)?.mcp;
	return mcp?.operation !== "tool" || autoApprove || mcp.codexApproval !== void 0 && !requiresMcpCodexToolApproval(mcp.codexApproval);
}
function filterScheduledCodexApproval(tools, autoApprove, onOmitted) {
	return tools.filter((tool) => {
		if (isScheduledCodexApprovalAllowed(tool, autoApprove)) return true;
		const mcp = getPluginToolMeta(tool)?.mcp;
		onOmitted?.(`${mcp?.serverName ?? "configured MCP"}/${mcp?.toolName ?? tool.name}: requires interactive Codex approval (${mcp?.codexApproval?.mode ?? "auto"}); configure codex.defaultToolsApprovalMode="approve" or use the host-confirmed yolo profile`);
		return false;
	});
}
function notConnectedToolResult(serverName, toolName) {
	const message = `Requester has not connected MCP server "${serverName}" (tool "${toolName}") for this turn.`;
	return {
		content: [{
			type: "text",
			text: message
		}],
		details: {
			status: "error",
			error: message,
			mcpServer: serverName,
			mcpTool: toolName
		}
	};
}
function applyHarnessToolPolicy(tools, params) {
	if (tools.length === 0) return tools;
	const allowed = applyEmbeddedAttemptToolsAllow(tools, params.toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
	const profile = params.conversationCapabilityProfile ?? (params.policyContext ? resolveConversationCapabilityProfile({
		...params.policyContext,
		runtimeToolAllowlist: params.toolsAllow
	}) : void 0);
	if (!profile) return allowed;
	return applyFinalEffectiveToolPolicy({
		bundledTools: allowed,
		config: params.policyContext?.config ?? params.cfg,
		conversationCapabilityProfile: profile,
		warn: params.warn ?? (() => void 0)
	});
}
function buildCatalogTools(catalog, params, requesterConnect) {
	return buildBundleMcpToolsFromCatalog({
		catalog,
		reservedToolNames: params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0,
		createExecute: (tool) => {
			return requesterConnect?.createExecute(tool.serverName) ?? (async () => notConnectedToolResult(tool.serverName, tool.toolName));
		}
	});
}
/**
* Materialize only static configured MCP for an authenticated scheduled turn.
* No requester identity is accepted here, so requester resolvers stay unreachable.
*/
async function materializeStaticMcpToolsForScheduledHarnessRunCore(params) {
	const runtime = await getOrCreateSessionMcpRuntime({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	const retireSnapshotRuntime = params.retireSessionRuntimeAfterDispose ? async () => {
		await retireSessionMcpRuntime({
			sessionId: params.sessionId,
			reason: "scheduled-authority-snapshot-complete"
		});
	} : void 0;
	let liveRuntime;
	try {
		liveRuntime = await materializeBundleMcpToolsForRun({
			runtime,
			agentId: params.agentId,
			reservedToolNames: params.reservedToolNames,
			...retireSnapshotRuntime ? { disposeRuntime: retireSnapshotRuntime } : {}
		});
	} catch (error) {
		await retireSnapshotRuntime?.();
		throw error;
	}
	try {
		const policyWarnings = [];
		const policyParams = {
			...params,
			warn: (message) => {
				policyWarnings.push(message);
				params.warn?.(message);
			}
		};
		const allowed = filterScheduledCodexApproval(applyHarnessToolPolicy(liveRuntime.tools, policyParams), params.autoApproveCodexAppServerApprovals === true, (message) => policyWarnings.push(message));
		liveRuntime.restrictAppTools?.(filterScheduledCodexApproval(applyHarnessToolPolicy(liveRuntime.appTools ?? liveRuntime.tools, policyParams), params.autoApproveCodexAppServerApprovals === true, (message) => policyWarnings.push(message)));
		const diagnosticNotice = formatScheduledMcpDiagnosticNotice([...(liveRuntime.diagnostics ?? []).map((diagnostic) => `${diagnostic.serverName}: ${diagnostic.message}`), ...policyWarnings]);
		let disposed = false;
		return {
			tools: allowed,
			...diagnosticNotice ? { diagnosticNotice } : {},
			dispose: async () => {
				if (disposed) return;
				disposed = true;
				await liveRuntime.dispose();
			}
		};
	} catch (error) {
		await liveRuntime.dispose();
		throw error;
	}
}
/**
* Materialize requester-scoped MCP tools for a harness run (e.g. Codex dynamic tools).
* Updates the session advertised-catalog cache when a requester resolves a catalog.
* Before any requester resolves in the session, returns undefined (nothing to advertise).
*/
async function materializeRequesterScopedMcpToolsForHarnessRunCore(params) {
	const scopedRuntime = await getOrCreateRequesterScopedMcpRuntime({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides,
		requesterSenderId: params.requesterSenderId,
		agentAccountId: params.agentAccountId,
		messageChannel: params.messageChannel
	});
	let liveRuntime;
	let liveCatalog;
	try {
		if (scopedRuntime) {
			liveRuntime = await materializeBundleMcpToolsForRun({
				runtime: scopedRuntime,
				agentId: params.agentId,
				reservedToolNames: params.reservedToolNames
			});
			liveCatalog = scopedRuntime.peekCatalog() ?? await scopedRuntime.getCatalog();
			if (liveCatalog.tools.length > 0) rememberAdvertisedScopedMcpCatalog(params.sessionId, liveCatalog);
		}
		const advertisedCatalog = getAdvertisedScopedMcpCatalog(params.sessionId) ?? (liveCatalog ? mergeMcpConnectCatalog(liveCatalog, scopedRuntime?.requesterConnect) : void 0);
		if (!advertisedCatalog || advertisedCatalog.tools.length === 0) {
			await liveRuntime?.dispose();
			return;
		}
		const reservedToolNames = params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0;
		const advertisedTools = buildCatalogTools(advertisedCatalog, {
			...params,
			reservedToolNames
		}, scopedRuntime?.requesterConnect);
		const liveByName = new Map((liveRuntime?.tools ?? []).map((tool) => [tool.name, tool]));
		const filteredTools = applyHarnessToolPolicy(advertisedTools.map((tool) => liveByName.get(tool.name) ?? tool), params);
		const filteredAdvertised = applyHarnessToolPolicy(advertisedTools, params);
		const allowedNames = new Set(filteredAdvertised.map((tool) => tool.name));
		const executableTools = filteredTools.filter((tool) => allowedNames.has(tool.name));
		let disposed = false;
		return {
			tools: executableTools,
			advertisedTools: filteredAdvertised,
			dispose: async () => {
				if (disposed) return;
				disposed = true;
				await liveRuntime?.dispose();
			}
		};
	} catch (error) {
		await liveRuntime?.dispose();
		throw error;
	}
}
//#endregion
export { materializeRequesterScopedMcpToolsForHarnessRunCore, materializeStaticMcpToolsForScheduledHarnessRunCore };
