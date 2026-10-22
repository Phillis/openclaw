/**
 * Builds host capabilities passed into context-engine runtime calls.
 */
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ContextEngineRuntimeContext } from "../../context-engine/types.js";
import { resolveBoundAgentIdForSession } from "../session-agent-binding.js";
import { withoutGatewayToolCallerIdentity } from "../tools/gateway-caller-context.js";

type ResolveContextEngineCapabilitiesParams = {
  config?: OpenClawConfig;
  sessionKey?: string;
  explicitAgentId?: string;
  authProfileId?: string;
  contextEnginePluginId?: string;
  purpose: string;
};

/**
 * Build host-owned capabilities that are bound to one context-engine runtime call.
 */
export function resolveContextEngineCapabilities(
  params: ResolveContextEngineCapabilitiesParams,
): Pick<ContextEngineRuntimeContext, "llm"> {
  const sessionKey = normalizeOptionalString(params.sessionKey);
  const agentId = resolveBoundAgentIdForSession({
    config: params.config,
    sessionKey,
    agentId: params.explicitAgentId,
  });
  const contextEnginePluginId = normalizeOptionalString(params.contextEnginePluginId);
  return {
    llm: {
      complete: async (request) => {
        const { createRuntimeLlm } = await import("../../plugins/runtime/runtime-llm.runtime.js");
        // Context-engine completions are process-owned maintenance work: they
        // outlive the turn that scheduled them, so the completion must not
        // assert the launching turn's gateway tool caller identity.
        return withoutGatewayToolCallerIdentity(() =>
          createRuntimeLlm({
            getConfig: () => params.config,
            authority: {
              caller: { kind: "context-engine", id: params.purpose },
              requiresBoundAgent: true,
              ...(sessionKey ? { sessionKey } : {}),
              ...(agentId ? { agentId } : {}),
              ...(params.authProfileId ? { preferredProfile: params.authProfileId } : {}),
              ...(contextEnginePluginId ? { pluginIdForPolicy: contextEnginePluginId } : {}),
              allowAgentIdOverride: false,
              allowModelOverride: false,
              allowComplete: true,
            },
          }).complete(request),
        );
      },
    },
  };
}
