import { describe, expect, it, vi } from "vitest";
import {
  collectSessionMaintenancePreserveKeys,
  registerSessionMaintenancePreserveKeysProvider,
} from "./store-maintenance-preserve.js";

/**
 * Plugin-exposed session preserve-keys registration (WC8 host exemption).
 * Mirrors the internal provider contract: fail-soft, normalized key list,
 * never throws into maintenance.
 */
describe("session maintenance preserve keys provider registry", () => {
  it("collects keys from registered providers and tolerates empty strings", () => {
    const before = collectSessionMaintenancePreserveKeys()?.size ?? 0;
    const unregister = registerSessionMaintenancePreserveKeysProvider(() => [
      "agent:test:supervision:r7",
      "",
      "agent:test:supervision:r8",
    ]);
    try {
      const keys = collectSessionMaintenancePreserveKeys();
      expect(keys).toBeDefined();
      expect(keys!.has("agent:test:supervision:r7")).toBe(true);
      expect(keys!.has("agent:test:supervision:r8")).toBe(true);
      expect(keys!.has("")).toBe(false);
    } finally {
      unregister();
    }
    const after = collectSessionMaintenancePreserveKeys()?.size ?? 0;
    expect(after).toBe(before);
  });

  it("swallows a throwing provider (maintenance must never abort)", () => {
    const unregister = registerSessionMaintenancePreserveKeysProvider(() => {
      throw new Error("plugin bug");
    });
    try {
      expect(() => collectSessionMaintenancePreserveKeys()).not.toThrow();
    } finally {
      unregister();
    }
  });

  it("unregister removes the provider before it is ever consulted", () => {
    const probe = vi.fn(() => ["agent:test:gone:r1"] as const);
    const unregister = registerSessionMaintenancePreserveKeysProvider(probe);
    unregister();
    const keys = collectSessionMaintenancePreserveKeys();
    expect(keys?.has("agent:test:gone:r1")).toBeFalsy();
    expect(probe).not.toHaveBeenCalled();
  });
});
