// Covers tools alsoAllow config parsing and validation.
import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./validation.js";

// NOTE: alsoAllow widens a profile and merges into the restrictive allow boundary,
// so a config can declare allow + alsoAllow in the same scope. The pipeline merges
// them, the profile is widened via profileAlsoAllow, and the agent-level allowlist
// keeps the merged surface.

describe("config: tools.alsoAllow", () => {
  it("parses tools.allow + tools.alsoAllow together", () => {
    const res = validateConfigObject({
      tools: {
        allow: ["group:fs"],
        alsoAllow: ["lobster"],
      },
    });

    expect(res.ok).toBe(true);
  });

  it("parses agents.entries.*.tools.allow + alsoAllow together", () => {
    const res = validateConfigObject({
      agents: {
        entries: {
          main: {
            tools: {
              allow: ["group:fs"],
              alsoAllow: ["lobster"],
            },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("allows profile + alsoAllow", () => {
    const res = validateConfigObject({
      tools: {
        profile: "coding",
        alsoAllow: ["lobster"],
      },
    });

    expect(res.ok).toBe(true);
  });

  it("allows per-agent message tool cross-context policy", () => {
    const res = validateConfigObject({
      agents: {
        entries: {
          sandbox: {
            tools: {
              message: {
                crossContext: {
                  allowWithinProvider: false,
                  allowAcrossProviders: false,
                },
              },
            },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("allows per-agent message tool action allowlists", () => {
    const res = validateConfigObject({
      agents: {
        entries: {
          sandbox: {
            tools: {
              message: {
                actions: {
                  allow: ["send"],
                },
              },
            },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });
});
