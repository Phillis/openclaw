import { execFileSync } from "node:child_process";
import { truncateUtf16Safe } from "@openclaw/normalization-core/utf16-slice";
import {
  appendGatewayLifecycleAuditLog,
  type GatewayLifecycleAuditSource,
} from "../../daemon/restart-logs.js";
import { createGatewayLifecycleMutationReporter } from "../../daemon/service-mutation.js";
/** Gateway lifecycle audit helpers shared by managed and unmanaged CLI paths. */
import type {
  GatewayLifecycleMutation,
  GatewayLifecycleMutationMode,
} from "../../daemon/service-types.js";
import { isTerminalInteractive } from "../terminal-interactivity.js";

type GatewayLifecycleAction = "start" | "stop" | "restart";

const LIFECYCLE_AUDIT_PARENT_CMD_MAX_LENGTH = 200;

/**
 * Best-effort parent-command lookup for lifecycle attribution; runs in the CLI
 * restart path, so any failure (missing ps, timeout, orphaned pid) yields
 * undefined instead of blocking the mutation.
 */
function resolveParentCommand(ppid: number): string | undefined {
  try {
    const command = execFileSync("ps", ["-p", String(ppid), "-o", "command="], {
      timeout: 2000,
      encoding: "utf8",
    });
    const trimmed = command.trim();
    return trimmed ? truncateUtf16Safe(trimmed, LIFECYCLE_AUDIT_PARENT_CMD_MAX_LENGTH) : undefined;
  } catch {
    return undefined;
  }
}

export function appendGatewayLifecycleAudit(params: {
  action: GatewayLifecycleAction;
  source: GatewayLifecycleAuditSource;
  mode: GatewayLifecycleMutationMode;
  pid?: number;
  env?: NodeJS.ProcessEnv;
}): void {
  // The invoking process tree is diagnostic identity for source=cli lifecycle
  // lines; capture it here so every caller (direct + mutation reporter) records it.
  const ppid = process.ppid;
  appendGatewayLifecycleAuditLog(params.env ?? process.env, {
    action: params.action,
    source: params.source,
    mode: params.mode,
    ...(params.pid === undefined ? {} : { pid: params.pid }),
    ppid,
    ppidCmd: resolveParentCommand(ppid),
    interactive: isTerminalInteractive(),
  });
}

export function createGatewayLifecycleMutationAudit(params: {
  action: GatewayLifecycleAction;
  source?: GatewayLifecycleAuditSource;
  env?: NodeJS.ProcessEnv;
}): (mutation: GatewayLifecycleMutation) => void {
  const reportMutation = createGatewayLifecycleMutationReporter((mutation) => {
    appendGatewayLifecycleAudit({
      action: params.action,
      source: params.source ?? "cli",
      mode: mutation.mode,
      ...(params.env === undefined ? {} : { env: params.env }),
    });
  });
  return (mutation) => reportMutation(mutation.mode);
}

export function createServiceLifecycleMutationAudit(params: {
  serviceNoun: string;
  action: GatewayLifecycleAction;
}): ((mutation: GatewayLifecycleMutation) => void) | undefined {
  return params.serviceNoun === "Gateway"
    ? createGatewayLifecycleMutationAudit({ action: params.action })
    : undefined;
}

export function appendServiceLifecycleRepairAudit(params: {
  serviceNoun: string;
  action: "start" | "restart";
  pid?: number;
}): void {
  if (params.serviceNoun !== "Gateway") {
    return;
  }
  appendGatewayLifecycleAudit({
    action: params.action,
    source: "cli",
    mode: "service-repair",
    ...(params.pid === undefined ? {} : { pid: params.pid }),
  });
}
