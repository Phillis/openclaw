import { describe, expect, it } from "vitest";
import { resolveModelWorkspaceDir } from "./model-discovery-context.js";

describe("resolveModelWorkspaceDir", () => {
  it("uses the explicit agent owner when multi-agent config has no default", () => {
    const cfg = {
      agents: {
        list: [
          { id: "alpha", workspace: "/tmp/alpha-workspace" },
          { id: "beta", workspace: "/tmp/beta-workspace" },
        ],
      },
    };

    expect(resolveModelWorkspaceDir(cfg, undefined, "beta")).toBe("/tmp/beta-workspace");
  });
});
