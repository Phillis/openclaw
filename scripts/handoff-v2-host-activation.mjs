#!/usr/bin/env node
import process from "node:process";
import {
  executeHostActivation,
  hostActivationExitCode,
  loadPlanBytes,
} from "./lib/handoff-v2-host-activation.mjs";

function usage() {
  return [
    "Usage:",
    "  node scripts/handoff-v2-host-activation.mjs --plan <absolute-path> --plan-sha256 <sha256> [--execute]",
    "",
    "Without --execute, performs a read-only preflight and prints a preflight receipt.",
    "With --execute, permits exactly one bootout/bootstrap generation and never auto-rolls back.",
  ].join("\n");
}

function parseArgs(argv) {
  let planPath;
  let planSha256;
  let execute = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--execute") {
      execute = true;
      continue;
    }
    if (arg === "--plan" || arg === "--plan-sha256") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      if (arg === "--plan") {
        planPath = value;
      } else {
        planSha256 = value;
      }
      index += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      process.stdout.write(`${usage()}\n`);
      process.exit(0);
    }
    throw new Error(`unknown argument: ${arg}`);
  }
  if (!planPath || !planSha256) {
    throw new Error("--plan and --plan-sha256 are required");
  }
  return { planPath, planSha256, execute };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const receipt = executeHostActivation({
    planBytes: loadPlanBytes(args.planPath),
    expectedPlanSha256: args.planSha256,
    execute: args.execute,
  });
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  const receiptExitCode = hostActivationExitCode(receipt);
  if (receiptExitCode !== 0) {
    process.exitCode = receiptExitCode;
  }
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
