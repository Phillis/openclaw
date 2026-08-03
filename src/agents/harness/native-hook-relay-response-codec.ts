import type { JsonValue, NativeHookRelayProcessResponse } from "./native-hook-relay-types.js";

/** Render the native Codex hook responses shared by server and cold client paths. */
export const codexNativeHookRelayResponseCodec = {
  renderNoopResponse(): NativeHookRelayProcessResponse {
    // Codex treats empty stdout plus exit 0 as no decision/no additional context.
    return { stdout: "", stderr: "", exitCode: 0 };
  },
  renderPreToolUseBlockResponse(
    reason: string,
    failureDisposition?: NativeHookRelayProcessResponse["failureDisposition"],
  ): NativeHookRelayProcessResponse {
    return {
      stdout: `${JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: reason,
        },
      })}\n`,
      stderr: "",
      exitCode: 0,
      ...(failureDisposition ? { failureDisposition } : {}),
    };
  },
  renderPreToolUseRewriteResponse(
    updatedInput: Record<string, JsonValue>,
  ): NativeHookRelayProcessResponse {
    return {
      stdout: `${JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
          updatedInput,
        },
      })}\n`,
      stderr: "",
      exitCode: 0,
    };
  },
  renderPermissionDecisionResponse(
    decision: "allow" | "deny",
    message?: string,
  ): NativeHookRelayProcessResponse {
    return {
      stdout: `${JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PermissionRequest",
          decision:
            decision === "allow"
              ? { behavior: "allow" }
              : {
                  behavior: "deny",
                  message: message?.trim() || "Denied by OpenClaw",
                },
        },
      })}\n`,
      stderr: "",
      exitCode: 0,
    };
  },
};
