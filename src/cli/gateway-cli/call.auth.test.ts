import { describe, expect, it } from "vitest";
import { callGatewayCli } from "./call.js";

describe("gateway call CLI authentication", () => {
  it("requires explicit authentication for an explicit URL before opening a transport", async () => {
    await expect(
      callGatewayCli("health", {
        config: {
          gateway: {
            mode: "local",
          },
        },
        url: "wss://gateway.example/ws",
        json: true,
      }),
    ).rejects.toThrow(/gateway url override requires explicit credentials/u);
  });
});
