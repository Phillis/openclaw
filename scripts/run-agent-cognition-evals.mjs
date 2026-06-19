#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const DEFAULT_AGENTS = ["main", "oscar", "sara", "dante", "billnye", "falkan", "victor"];
const DEFAULT_TIMEOUT_SECONDS = 120;
const DEFAULT_SUITE = "core";

const SUITES = {
  core: [
    {
      id: "identity",
      prompt:
        "Reply in compact JSON with keys role, collaborators, first_action. Based on your current agent identity and instructions, describe your role, who you primarily collaborate with, and one first action you would take when starting a normal task. Keep it specific and under 60 words.",
    },
    {
      id: "resume",
      prompt:
        "Reply in compact JSON with keys objective, blocker_check, next_action. Scenario: you are resuming a paused task and must avoid redoing verified work. State the current objective, one thing you would verify before acting, and the next action. Keep it specific and under 60 words.",
    },
    {
      id: "stall_recovery",
      prompt:
        "Reply in compact JSON with keys stall_signal, tactic_shift, escalation_trigger. Scenario: progress has stalled and your current approach is not producing new evidence. Describe the stall signal, the tactic you would switch to, and when you would escalate. Keep it specific and under 60 words.",
    },
  ],
};

function parseArgs(argv) {
  const args = {
    agents: [...DEFAULT_AGENTS],
    suite: DEFAULT_SUITE,
    timeoutSeconds: DEFAULT_TIMEOUT_SECONDS,
    openclawBin: process.env.OPENCLAW_BIN || "openclaw",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--agents") {
      args.agents = (argv[i + 1] || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    if (arg === "--suite") {
      args.suite = argv[i + 1] || DEFAULT_SUITE;
      i += 1;
      continue;
    }
    if (arg === "--timeout-seconds") {
      const parsed = Number(argv[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0) {
        args.timeoutSeconds = Math.floor(parsed);
      }
      i += 1;
      continue;
    }
    if (arg === "--openclaw-bin") {
      args.openclawBin = argv[i + 1] || args.openclawBin;
      i += 1;
    }
  }
  return args;
}

function parseAgentReply(stdout) {
  const parsed = JSON.parse(stdout);
  return {
    text: parsed?.result?.payloads?.[0]?.text ?? "",
    promptTokens: parsed?.result?.meta?.agentMeta?.promptTokens ?? null,
    promptChars: parsed?.result?.meta?.systemPromptReport?.systemPrompt?.chars ?? null,
    model: parsed?.result?.meta?.agentMeta?.model ?? null,
  };
}

function runEvalCase(params) {
  const sessionKey = `eval-${params.agent}-${params.caseId}-${Date.now()}`;
  const result = spawnSync(
    params.openclawBin,
    [
      "agent",
      "--agent",
      params.agent,
      "--session-key",
      sessionKey,
      "--message",
      params.prompt,
      "--json",
      "--timeout",
      String(params.timeoutSeconds),
    ],
    {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    },
  );
  if (result.status !== 0) {
    return {
      ok: false,
      agent: params.agent,
      caseId: params.caseId,
      error: (result.stderr || result.stdout || "agent command failed").trim(),
    };
  }
  const reply = parseAgentReply(result.stdout);
  return {
    ok: true,
    agent: params.agent,
    caseId: params.caseId,
    model: reply.model,
    promptTokens: reply.promptTokens,
    promptChars: reply.promptChars,
    text: reply.text,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const suite = SUITES[args.suite];
  if (!suite) {
    throw new Error(`Unknown suite "${args.suite}". Available: ${Object.keys(SUITES).join(", ")}`);
  }
  const results = [];
  for (const agent of args.agents) {
    for (const testCase of suite) {
      results.push(
        runEvalCase({
          agent,
          caseId: testCase.id,
          prompt: testCase.prompt,
          timeoutSeconds: args.timeoutSeconds,
          openclawBin: args.openclawBin,
        }),
      );
    }
  }
  const summary = {
    suite: args.suite,
    agents: args.agents,
    totals: {
      cases: results.length,
      passed: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length,
    },
    results,
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (summary.totals.failed > 0) {
    process.exitCode = 1;
  }
}

main();
