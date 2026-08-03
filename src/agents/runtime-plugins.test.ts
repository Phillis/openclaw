// Verifies agent runtime plugin loads stay scoped to prepared-runtime handles.
import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  getCurrentPluginMetadataSnapshot: vi.fn(),
  getActivePluginRegistry: vi.fn(),
  loadPluginRegistryHandle: vi.fn(),
  resolveAgentRuntimePluginLoadPlan: vi.fn(),
}));

vi.mock("../plugins/current-plugin-metadata-snapshot.js", () => ({
  getCurrentPluginMetadataSnapshot: hoisted.getCurrentPluginMetadataSnapshot,
}));

vi.mock("../plugins/loader.js", () => ({
  loadPluginRegistryHandle: hoisted.loadPluginRegistryHandle,
}));

vi.mock("../plugins/runtime.js", () => ({
  getActivePluginRegistry: hoisted.getActivePluginRegistry,
}));

vi.mock("./harness/runtime-plugin-load-plan.js", () => ({
  resolveAgentRuntimePluginLoadPlan: hoisted.resolveAgentRuntimePluginLoadPlan,
}));

import { loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins.js";

describe("agent runtime plugin registries", () => {
  beforeEach(() => {
    hoisted.getCurrentPluginMetadataSnapshot.mockReset().mockReturnValue(undefined);
    hoisted.getActivePluginRegistry.mockReset().mockReturnValue(undefined);
    hoisted.loadPluginRegistryHandle.mockReset().mockReturnValue({
      handle: true,
      contextEngines: new Map(),
    });
    hoisted.resolveAgentRuntimePluginLoadPlan.mockReset().mockImplementation(({ config }) => ({
      config,
      pluginIds: ["codex", "memory-core"],
    }));
  });

  it("returns a non-activating handle for a prepared runtime", () => {
    const config = {} as never;
    const env = { OPENCLAW_STATE_DIR: "/tmp/openclaw-state" };
    const selections = [{ provider: "openai", modelId: "gpt-5.5", runtime: "codex" }];

    expect(
      loadAgentRuntimePluginRegistryHandle({
        config,
        env,
        workspaceDir: "/tmp/workspace",
        allowGatewaySubagentBinding: true,
        selections,
      }),
    ).toEqual({ handle: true, contextEngines: new Map() });
    expect(hoisted.getCurrentPluginMetadataSnapshot).toHaveBeenCalledWith({
      config,
      env,
      workspaceDir: "/tmp/workspace",
    });
    expect(hoisted.resolveAgentRuntimePluginLoadPlan).toHaveBeenCalledWith({
      config,
      workspaceDir: "/tmp/workspace",
      selections,
    });
    expect(hoisted.loadPluginRegistryHandle).toHaveBeenCalledWith({
      activate: false,
      config,
      activationSourceConfig: config,
      env,
      workspaceDir: "/tmp/workspace",
      runtimeOptions: { allowGatewaySubagentBinding: true },
    });
  });

  it("loads an explicit empty handle when plugins are globally disabled", () => {
    const params = {
      config: { plugins: { enabled: false } } as never,
      workspaceDir: "/tmp/workspace",
    };
    expect(loadAgentRuntimePluginRegistryHandle(params)).toEqual({
      handle: true,
      contextEngines: new Map(),
    });
    expect(hoisted.resolveAgentRuntimePluginLoadPlan).not.toHaveBeenCalled();
    expect(hoisted.loadPluginRegistryHandle).toHaveBeenCalledWith({
      activate: false,
      activationSourceConfig: params.config,
      config: params.config,
      onlyPluginIds: [],
      runtimeOptions: undefined,
      workspaceDir: "/tmp/workspace",
    });
  });

  it("preserves the gateway startup scope and ordering", () => {
    const config = {} as never;
    hoisted.getCurrentPluginMetadataSnapshot.mockReturnValue({
      startup: { pluginIds: ["telegram", "memory-core"] },
    });

    loadAgentRuntimePluginRegistryHandle({ config, workspaceDir: "/tmp/workspace" });

    expect(hoisted.resolveAgentRuntimePluginLoadPlan).toHaveBeenCalledWith({
      config,
      workspaceDir: "/tmp/workspace",
      basePluginIds: ["telegram", "memory-core"],
      selections: [],
    });
    expect(hoisted.loadPluginRegistryHandle).toHaveBeenCalledWith(
      expect.objectContaining({
        channelPluginLoadIntent: "full",
      }),
    );
  });

  it("binds the selected gateway-owned runtime context engine into the prepared handle", () => {
    const runtimeRegistration = {
      owner: "plugin:lossless-claw",
      lifecycle: "runtime",
      factory: vi.fn(),
    };
    hoisted.getActivePluginRegistry.mockReturnValue({
      contextEngines: new Map([["lossless-claw", runtimeRegistration]]),
    });

    const registry = loadAgentRuntimePluginRegistryHandle({
      config: {
        plugins: { slots: { contextEngine: "lossless-claw" } },
      } as never,
      workspaceDir: "/tmp/workspace",
    });

    expect(registry.contextEngines.get("lossless-claw")).toBe(runtimeRegistration);
  });

  it("does not promote a discovery-only context engine registration", () => {
    const discoveryRegistration = {
      owner: "plugin:lossless-claw",
      lifecycle: "readOnlyDiscovery",
      factory: vi.fn(),
    };
    hoisted.getActivePluginRegistry.mockReturnValue({
      contextEngines: new Map([["lossless-claw", discoveryRegistration]]),
    });

    const registry = loadAgentRuntimePluginRegistryHandle({
      config: {
        plugins: { slots: { contextEngine: "lossless-claw" } },
      } as never,
      workspaceDir: "/tmp/workspace",
    });

    expect(registry.contextEngines.has("lossless-claw")).toBe(false);
  });
});
