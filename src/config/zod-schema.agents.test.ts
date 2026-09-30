import { describe, expect, it } from "vitest";
import { AgentsSchema } from "./zod-schema.agents.js";
import { OpenClawSchema } from "./zod-schema.js";

describe("agent roster ownership", () => {
  it("rejects an empty roster after load-time migration", () => {
    expect(AgentsSchema.safeParse({ entries: {} }).success).toBe(false);
  });

  it("accepts sole and explicitly owned multi-agent rosters without a stored default", () => {
    expect(AgentsSchema.safeParse({ entries: { Ops: {} } }).success).toBe(true);
    expect(
      AgentsSchema.safeParse({ ownership: "explicit", entries: { alpha: {}, beta: {} } }).success,
    ).toBe(true);
  });

  it("rejects a markerless multi-agent roster without explicit ownership", () => {
    const result = AgentsSchema.safeParse({ entries: { alpha: {}, beta: {} } });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('agents.ownership="explicit"');
      expect(result.error.issues[0]?.message).toContain("run openclaw doctor");
    }
  });

  it("accepts one legacy default marker", () => {
    expect(
      AgentsSchema.safeParse({ entries: { alpha: { default: true }, beta: {} } }).success,
    ).toBe(true);
  });

  it("rejects multiple legacy default markers", () => {
    expect(
      AgentsSchema.safeParse({
        entries: { alpha: { default: true }, beta: { default: true } },
      }).success,
    ).toBe(false);
  });

  it("rejects entry keys that resolve to the same agent id", () => {
    const result = AgentsSchema.safeParse({
      ownership: "explicit",
      entries: { Ops: {}, ops: {} },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["entries", "ops"],
        message:
          'agents.entries keys "Ops" and "ops" resolve to the same agent id "ops"; rename one key so each agent has a unique id',
      });
    }
  });

  it("rejects a legacy marker with explicit ownership", () => {
    expect(
      AgentsSchema.safeParse({
        ownership: "explicit",
        entries: { alpha: { default: true }, beta: {} },
      }).success,
    ).toBe(false);
  });
});

describe("explicit ambient agent targets", () => {
  it("rejects an unknown explicit target", () => {
    const result = OpenClawSchema.safeParse({
      agents: { defaults: { heartbeat: { agentId: "missing" } }, entries: { main: {} } },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("Unknown agent id");
    }
  });

  it("accepts configured heartbeat, system-agent, compatibility, and Talk targets", () => {
    expect(
      OpenClawSchema.safeParse({
        agents: {
          defaults: {
            heartbeat: { agentId: "ops" },
            systemAgent: { agentId: "ops" },
            authInheritance: { agentId: "ops" },
            sessionStore: { agentId: "ops" },
          },
          entries: { ops: {} },
        },
        talk: { agentId: "ops" },
      }).success,
    ).toBe(true);
  });

  it("validates targets against the implicit main roster", () => {
    expect(OpenClawSchema.safeParse({ talk: { agentId: "main" } }).success).toBe(true);
    expect(OpenClawSchema.safeParse({ talk: { agentId: "missing" } }).success).toBe(false);
  });

  it("allows upgrade compatibility owners to outlive their roster entries", () => {
    expect(
      OpenClawSchema.safeParse({
        agents: {
          ownership: "explicit",
          defaults: {
            authInheritance: { agentId: "retired-ops" },
            sessionStore: { agentId: "retired-ops" },
          },
          entries: { research: {}, writer: {} },
        },
      }).success,
    ).toBe(true);
  });
});

describe("loop governor byKind budgets", () => {
  const entries = { oscar: {} };
  const base = { agents: ["oscar"], maxTurnsPerHour: 40 };

  it("accepts colon and colon-less kind keys with positive integer budgets", () => {
    for (const byKind of [
      { "cron:": 20, "subagent:": 40 },
      { cron: 20, subagent: 40, incognito: 10 },
    ]) {
      expect(AgentsSchema.safeParse({ entries, loopGovernor: { ...base, byKind } }).success).toBe(
        true,
      );
    }
  });

  it("accepts config without byKind (existing single-budget shape)", () => {
    expect(AgentsSchema.safeParse({ entries, loopGovernor: base }).success).toBe(true);
  });

  it("rejects unknown kinds and invalid budgets", () => {
    expect(
      AgentsSchema.safeParse({
        entries,
        loopGovernor: { ...base, byKind: { heartbeat: 20 } },
      }).success,
    ).toBe(false);
    expect(
      AgentsSchema.safeParse({ entries, loopGovernor: { ...base, byKind: { "cron:": 0 } } })
        .success,
    ).toBe(false);
    expect(
      AgentsSchema.safeParse({ entries, loopGovernor: { ...base, byKind: { "cron:": 1.5 } } })
        .success,
    ).toBe(false);
  });
});
