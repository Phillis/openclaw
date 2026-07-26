// Gateway integration coverage proves the real Slack RPC lifecycle and authorization boundary.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { clearPluginLoaderCache } from "../plugins/loader.test-fixtures.js";
import { resetPluginRuntimeStateForTest } from "../plugins/runtime.js";
import { withEnvAsync } from "../test-utils/env.js";
import {
  createGatewayMethodRegistry,
  createPluginGatewayMethodDescriptors,
} from "./methods/registry.js";
import { handleGatewayRequest } from "./server-methods.js";
import { loadGatewayStartupPluginRuntime } from "./server-startup-plugins.js";

const SLACK_ACCESS_VERIFY_METHOD = "slack.access.verify";
const tempRoots: string[] = [];

function resetPluginState(): void {
  clearPluginLoaderCache();
  resetPluginRuntimeStateForTest();
}

function createTestLog() {
  return {
    info() {},
    warn() {},
    error() {},
    debug() {},
  };
}

beforeEach(resetPluginState);

afterEach(async () => {
  resetPluginState();
  await Promise.all(
    tempRoots.splice(0).map(async (root) => {
      await fs.rm(root, { recursive: true, force: true, maxRetries: 5 });
    }),
  );
});

describe("Slack access proof Gateway bootstrap", () => {
  it("omits setup runtime, advertises full runtime, and denies callers without operator.read", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-slack-access-bootstrap-"));
    tempRoots.push(root);
    const stateDir = path.join(root, "state");
    const workspaceDir = path.join(root, "workspace");
    await fs.mkdir(stateDir, { recursive: true });
    await fs.mkdir(workspaceDir, { recursive: true });
    const config = {
      channels: {
        slack: {
          enabled: true,
          accounts: {
            default: { enabled: false, botToken: "xoxb-default-test-only" },
            oscar: { enabled: false, botToken: "xoxb-oscar-test-only" },
          },
        },
      },
      plugins: {
        allow: ["slack"],
        entries: {
          slack: { enabled: true },
        },
      },
    } satisfies OpenClawConfig;

    await withEnvAsync(
      {
        OPENCLAW_STATE_DIR: stateDir,
        OPENCLAW_BUNDLED_PLUGINS_DIR: path.resolve(process.cwd(), "extensions"),
        OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR: "1",
        OPENCLAW_DISABLE_BUNDLED_PLUGINS: undefined,
        OPENCLAW_SKIP_CHANNELS: undefined,
        OPENCLAW_SKIP_PROVIDERS: undefined,
        OPENCLAW_TEST_MINIMAL_GATEWAY: "0",
        OPENCLAW_LAUNCHD_LABEL: undefined,
        SLACK_API_URL: undefined,
        SLACK_APP_TOKEN: undefined,
        SLACK_BOT_TOKEN: undefined,
        SLACK_USER_TOKEN: undefined,
        ALL_PROXY: undefined,
        HTTPS_PROXY: undefined,
        HTTP_PROXY: undefined,
        all_proxy: undefined,
        https_proxy: undefined,
        http_proxy: undefined,
      },
      async () => {
        const common = {
          cfg: config,
          activationSourceConfig: config,
          workspaceDir,
          log: createTestLog(),
          baseMethods: [],
          coreGatewayMethodNames: [],
          startupPluginIds: ["slack"],
        };
        const setup = await loadGatewayStartupPluginRuntime({
          ...common,
          preferSetupRuntimeForChannelPlugins: true,
          suppressPluginInfoLogs: true,
        });

        expect(setup.gatewayMethods).not.toContain(SLACK_ACCESS_VERIFY_METHOD);
        expect(setup.pluginRegistry.gatewayHandlers).not.toHaveProperty(SLACK_ACCESS_VERIFY_METHOD);

        const full = await loadGatewayStartupPluginRuntime({
          ...common,
          preferSetupRuntimeForChannelPlugins: false,
          suppressPluginInfoLogs: false,
        });
        const descriptor = full.pluginRegistry.gatewayMethodDescriptors.find(
          (candidate) => candidate.name === SLACK_ACCESS_VERIFY_METHOD,
        );

        expect(full.pluginRegistry.plugins.find((plugin) => plugin.id === "slack")).toMatchObject({
          id: "slack",
          status: "loaded",
        });
        expect(
          full.gatewayMethods.filter((method) => method === SLACK_ACCESS_VERIFY_METHOD),
        ).toEqual([SLACK_ACCESS_VERIFY_METHOD]);
        expect(full.pluginRegistry.gatewayHandlers[SLACK_ACCESS_VERIFY_METHOD]).toEqual(
          expect.any(Function),
        );
        expect(descriptor).toMatchObject({
          name: SLACK_ACCESS_VERIFY_METHOD,
          owner: { kind: "plugin", pluginId: "slack" },
          scope: "operator.read",
        });

        const methodRegistry = createGatewayMethodRegistry(
          createPluginGatewayMethodDescriptors(full.pluginRegistry),
        );
        expect(methodRegistry.listAdvertisedMethods()).toContain(SLACK_ACCESS_VERIFY_METHOD);
        expect(methodRegistry.getScope(SLACK_ACCESS_VERIFY_METHOD)).toBe("operator.read");

        const respond = vi.fn();
        await handleGatewayRequest({
          req: {
            id: "slack-access-authz-test",
            type: "req",
            method: SLACK_ACCESS_VERIFY_METHOD,
            params: {},
          },
          respond,
          client: {
            connId: "operator-without-read",
            connect: {
              role: "operator",
              scopes: ["operator.approvals"],
            },
          } as never,
          isWebchatConnect: () => false,
          context: {
            logGateway: { warn: vi.fn() },
          } as never,
          methodRegistry,
        });

        expect(respond).toHaveBeenCalledOnce();
        expect(respond).toHaveBeenCalledWith(false, undefined, {
          code: "FORBIDDEN",
          message: "missing scope: operator.read",
          details: {
            code: "MISSING_SCOPE",
            missingScope: "operator.read",
            requiredScopes: ["operator.read"],
          },
        });
      },
    );
  });
});
