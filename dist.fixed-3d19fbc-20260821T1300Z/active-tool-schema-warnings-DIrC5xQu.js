import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as sanitizeForLog } from "./ansi-9qL8iF9E.js";
import "./agent-scope-D9GLFAyB.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, l as resolveAgentDir, s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { n as extractModelCompat } from "./provider-model-compat-BdbV2CzU.js";
import { i as getPluginToolMeta } from "./tools-BRlxfgwj.js";
import { n as normalizeAgentRuntimeTools } from "./tools-eFOIeHLv.js";
import { n as filterRuntimeCompatibleTools } from "./tool-schema-projection-ZrMdwk4s.js";
import { t as createOpenClawCodingTools } from "./agent-tools-C4NuxW9s.js";
import { r as resolveModelAsync } from "./model-D2zXW9cg.js";
import { t as buildReadableToolsByName } from "./tools-effective-inventory-build-DspJb1UZ.js";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref--dBiwr51.js";
//#region src/commands/doctor/shared/active-tool-schema-warnings.ts
async function resolveRuntimeModelContext(params) {
	const model = (await resolveModelAsync(params.provider, params.modelId, params.agentDir, params.cfg, {
		agentId: params.agentId,
		workspaceDir: params.workspaceDir,
		skipAgentDiscovery: true,
		allowBundledStaticCatalogFallback: true,
		preferBundledStaticCatalogTransport: true
	})).model;
	if (!model) return {};
	return {
		modelApi: model.api,
		model,
		modelCompat: extractModelCompat(model),
		...typeof model.contextWindow === "number" ? { modelContextWindowTokens: model.contextWindow } : {}
	};
}
function formatDiagnostic(params) {
	const plugin = params.pluginId ? ` from plugin "${params.pluginId}"` : "";
	return sanitizeForLog(`- agents.${params.agentId}: active tool "${params.diagnostic.toolName}"${plugin} has unsupported runtime input schema (${params.diagnostic.violations.join(", ")}). OpenClaw will quarantine this tool at runtime; fix or disable the plugin, or remove the tool from active allowlists.`);
}
function readToolByIndex(tools, index) {
	try {
		return tools[index];
	} catch {
		return;
	}
}
function readPluginId(tool) {
	try {
		return tool ? getPluginToolMeta(tool)?.pluginId : void 0;
	} catch {
		return;
	}
}
/** Collect per-agent warnings for active plugin tools rejected by runtime schema projection. */
async function collectActiveToolSchemaProjectionWarnings(params) {
	if (params.cfg.plugins?.enabled === false) return [];
	const env = params.env ?? process.env;
	const warnings = [];
	for (const agentId of listAgentIds(params.cfg)) {
		const agentConfig = resolveAgentConfig(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId, env);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId, env);
		const collectForAgent = async () => {
			const agentWarnings = [];
			const modelRef = resolveDoctorPrimaryModelRef(params.cfg, agentConfig?.model);
			let runtimeModelContext = {};
			try {
				runtimeModelContext = await resolveRuntimeModelContext({
					cfg: params.cfg,
					agentId,
					agentDir,
					workspaceDir,
					provider: modelRef.provider,
					modelId: modelRef.model
				});
			} catch (error) {
				agentWarnings.push(sanitizeForLog(`- agents.${agentId}: active tool schema validation could not resolve the runtime model context (${formatErrorMessage(error)}). Fix provider/model loading errors before relying on assistant tool startup.`));
			}
			let tools;
			try {
				tools = createOpenClawCodingTools({
					agentId,
					agentDir,
					workspaceDir,
					config: params.cfg,
					modelProvider: modelRef.provider,
					modelId: modelRef.model,
					modelApi: runtimeModelContext.modelApi,
					modelCompat: runtimeModelContext.modelCompat,
					modelContextWindowTokens: runtimeModelContext.modelContextWindowTokens,
					allowGatewaySubagentBinding: true,
					toolPolicyAuditLogLevel: "debug"
				});
			} catch (error) {
				agentWarnings.push(sanitizeForLog(`- agents.${agentId}: active tool schema validation could not load the runtime tool set (${formatErrorMessage(error)}). Fix plugin loading errors before relying on assistant tool startup.`));
				return agentWarnings;
			}
			const rawToolsByName = buildReadableToolsByName(tools);
			const preNormalizationDiagnostics = [];
			let normalizedTools;
			try {
				normalizedTools = normalizeAgentRuntimeTools({
					tools,
					provider: modelRef.provider,
					config: params.cfg,
					workspaceDir,
					env,
					modelId: modelRef.model,
					modelApi: runtimeModelContext.modelApi,
					model: runtimeModelContext.model,
					onPreNormalizationSchemaDiagnostics: (diagnostics) => preNormalizationDiagnostics.push(...diagnostics)
				});
			} catch (error) {
				agentWarnings.push(sanitizeForLog(`- agents.${agentId}: active tool schema validation could not normalize the runtime tool set (${formatErrorMessage(error)}). Fix provider/plugin loading errors before relying on assistant tool startup.`));
				return agentWarnings;
			}
			for (const diagnostic of preNormalizationDiagnostics) {
				const pluginId = readPluginId(rawToolsByName.get(diagnostic.toolName));
				agentWarnings.push(formatDiagnostic({
					agentId,
					diagnostic,
					...pluginId ? { pluginId } : {}
				}));
			}
			const projection = filterRuntimeCompatibleTools(normalizedTools);
			for (const diagnostic of projection.diagnostics) {
				const tool = readToolByIndex(normalizedTools, diagnostic.toolIndex);
				const rawTool = rawToolsByName.get(diagnostic.toolName);
				const pluginId = readPluginId(tool) ?? readPluginId(rawTool);
				agentWarnings.push(formatDiagnostic({
					agentId,
					diagnostic,
					...pluginId ? { pluginId } : {}
				}));
			}
			return agentWarnings;
		};
		warnings.push(...params.runWithPluginMetadataSnapshot ? await params.runWithPluginMetadataSnapshot({
			config: params.cfg,
			workspaceDir
		}, collectForAgent) : await collectForAgent());
	}
	return warnings;
}
//#endregion
export { collectActiveToolSchemaProjectionWarnings };
