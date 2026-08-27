import { n as CODE_MODE_WAIT_TOOL_NAME, t as CODE_MODE_EXEC_TOOL_NAME } from "../code-mode-control-tools-ChmXUFfk.js";
import { t as resolveConversationCapabilityProfile } from "../conversation-capability-profile-jN4PguVr.js";
import { S as TOOL_SEARCH_CODE_MODE_TOOL_NAME, b as TOOL_CALL_RAW_TOOL_NAME, g as createToolSearchCatalogRef, p as clearToolSearchCatalog, w as TOOL_SEARCH_RAW_TOOL_NAME, x as TOOL_DESCRIBE_RAW_TOOL_NAME } from "../tool-search-BW-kW-Zf.js";
import { a as messageToolOwnsVisibleReply, i as resolveLocalModelLeanPreserveToolNames, n as filterLocalModelLeanTools } from "../local-model-lean-BMyyuL8b.js";
import { n as filterRuntimeCompatibleTools } from "../tool-schema-projection-ZrMdwk4s.js";
import { i as createCodeModeTools, n as resolveAgentToolSurfacePlan, t as applyAgentToolSurfaceCatalog } from "../tool-surface-plan-BbMDSr1I.js";
//#region src/agents/harness/tool-surface-bridge.ts
const TOOL_SEARCH_CONTROL_ALLOWLIST_NAMES = [
	TOOL_SEARCH_CODE_MODE_TOOL_NAME,
	TOOL_SEARCH_RAW_TOOL_NAME,
	TOOL_DESCRIBE_RAW_TOOL_NAME,
	TOOL_CALL_RAW_TOOL_NAME
];
const CODE_MODE_CONTROL_ALLOWLIST_NAMES = [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME];
function createAgentHarnessToolSurfaceRuntimeCore(params) {
	const forceDirectMessageTool = messageToolOwnsVisibleReply(params);
	const { codeModeControlsEnabled, toolSearchControlsEnabled, toolSearchConfig, toolSearchRuntimeConfig } = resolveAgentToolSurfacePlan({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		forceDirectMessageTool,
		model: params.model,
		toolsEnabled: params.modelToolsEnabled,
		disableTools: params.disableTools,
		isRawModelRun: params.isRawModelRun === true,
		skillWorkshopProposalOnly: params.skillWorkshopProposalOnly,
		toolsAllow: params.toolsAllow
	});
	const toolSearchCatalogRef = toolSearchControlsEnabled || codeModeControlsEnabled ? createToolSearchCatalogRef() : void 0;
	const runtimeToolAllowlist = (toolSearchControlsEnabled || codeModeControlsEnabled) && params.runtimeToolAllowlist ? [.../* @__PURE__ */ new Set([
		...params.runtimeToolAllowlist,
		...toolSearchControlsEnabled ? TOOL_SEARCH_CONTROL_ALLOWLIST_NAMES : [],
		...codeModeControlsEnabled ? CODE_MODE_CONTROL_ALLOWLIST_NAMES : []
	])] : params.runtimeToolAllowlist ? [...params.runtimeToolAllowlist] : void 0;
	const toolSearchCatalogExecutor = toolSearchControlsEnabled || codeModeControlsEnabled ? params.executeTool : void 0;
	const preserveToolNames = resolveLocalModelLeanPreserveToolNames({
		toolNames: resolveConversationCapabilityProfile({
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			modelProvider: params.modelProvider,
			modelId: params.modelId,
			runtimeToolAllowlist,
			scheduledToolPolicy: params.scheduledToolPolicy
		}).policy.explicitToolOverrideAllowlist,
		forceMessageTool: params.forceMessageTool,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
	});
	const compactTools = (tools, options = {}) => {
		let effectiveTools = [...filterRuntimeCompatibleTools(options.localModelLeanApplied ? tools : filterLocalModelLeanTools({
			tools,
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			preserveToolNames
		})).tools];
		const compacted = applyAgentToolSurfaceCatalog({
			tools: [...codeModeControlsEnabled ? createCodeModeTools({
				config: params.config,
				runtimeConfig: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				runId: params.runId,
				catalogRef: toolSearchCatalogRef,
				abortSignal: params.abortSignal,
				executeTool: params.executeTool
			}) : [], ...effectiveTools],
			config: params.config,
			toolSearchRuntimeConfig,
			codeModeControlsEnabled,
			toolSearchConfig,
			forceDirectMessageTool,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			runId: params.runId,
			catalogRef: toolSearchCatalogRef,
			toolHookContext: options.hookContext
		});
		effectiveTools = [...filterRuntimeCompatibleTools(options.localModelLeanApplied ? compacted.tools : filterLocalModelLeanTools({
			tools: compacted.tools,
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			preserveToolNames
		})).tools];
		return { tools: effectiveTools };
	};
	return {
		codeModeControlsEnabled,
		compactTools,
		config: toolSearchControlsEnabled ? toolSearchRuntimeConfig : params.config,
		includeToolSearchControls: toolSearchControlsEnabled,
		runtimeToolAllowlist,
		toolSearchCatalogRef,
		toolSearchControlsEnabled,
		cleanup: () => {
			clearToolSearchCatalog({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				runId: params.runId,
				catalogRef: toolSearchCatalogRef
			});
		},
		toolSearchCatalogExecutor
	};
}
//#endregion
//#region src/plugin-sdk/agent-harness-tool-runtime.ts
/**
* Focused runtime SDK subpath for native harness tool-surface routing.
*
* Keep tool-search and code-mode dependencies out of the lightweight harness
* lifecycle facade used during plugin startup.
*/
function createAgentHarnessToolSurfaceRuntime(params) {
	return createAgentHarnessToolSurfaceRuntimeCore(params);
}
//#endregion
export { createAgentHarnessToolSurfaceRuntime };
