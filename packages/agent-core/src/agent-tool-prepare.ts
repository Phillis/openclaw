import { isRecord } from "@openclaw/normalization-core/record-coerce";
import type { AgentTool, AgentToolCall } from "./types.js";

export function prepareToolCallArguments(tool: AgentTool, toolCall: AgentToolCall): AgentToolCall {
  if (!tool.prepareArguments) {
    return toolCall;
  }
  const preparedArguments = tool.prepareArguments(toolCall.arguments);
  if (preparedArguments === toolCall.arguments) {
    return toolCall;
  }
  return {
    ...toolCall,
    // SAFETY: prepareArguments returns the same shape it receives (contract).
    arguments: preparedArguments as Record<string, unknown>,
  };
}

/** Applies the tool's preValidate normalization before batch admission; a non-record result keeps the raw arguments. */
export function applyToolPreValidate(tool: AgentTool, toolCall: AgentToolCall): AgentToolCall {
  if (!tool.preValidate || !isRecord(toolCall.arguments)) {
    return toolCall;
  }
  const normalized = tool.preValidate(toolCall.arguments);
  if (!isRecord(normalized) || normalized === toolCall.arguments) {
    return toolCall;
  }
  return { ...toolCall, arguments: normalized };
}
