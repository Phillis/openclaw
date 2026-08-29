import { expectDefined } from "@openclaw/normalization-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { applyCodeModeCatalog } from "./code-mode.js";
import {
  createCodeModeHarness,
  pluginToolWithExecute,
  resetCodeModeTestState,
  resultDetails,
} from "./code-mode.test-support.js";
import { jsonResult, type AnyAgentTool } from "./tools/common.js";

function throwTypedFailure(mutationProvenance: string | undefined): () => never {
  return () => {
    throw typedFailure(mutationProvenance);
  };
}

function typedFailure(mutationProvenance: string | undefined): Error {
  // Mirrors the Handoff v2 bridge catch path: a typed failure whose error
  // object may carry the exact `mutationProvenance` marker emitted by the
  // plugin before the host settles the bridge request.
  const failure = new Error(
    "rejected | typed_code=EXPECTED_VERSION_CONFLICT | re-read canonical state before retrying",
  );
  failure.name = "HandoffV2ToolError";
  if (mutationProvenance !== undefined) {
    (failure as Error & { mutationProvenance?: string }).mutationProvenance = mutationProvenance;
  }
  return failure;
}

async function runCode(code: string, targets: AnyAgentTool[]) {
  const { config, catalogRef, tools } = createCodeModeHarness();
  applyCodeModeCatalog({
    tools: [...tools, ...targets],
    config,
    sessionId: "session-code-mode",
    sessionKey: "agent:main:main",
    runId: "run-code-mode",
    catalogRef,
  });
  return resultDetails(
    await expectDefined(tools[0], "Code Mode exec test invariant").execute(
      "code-call-mutation-provenance",
      { code },
    ),
  );
}

describe("Code Mode mutation provenance", () => {
  afterEach(() => resetCodeModeTestState());

  it("stamps pre-mutation provenance on failed exec details when a typed plugin failure settles before any mutation", async () => {
    const target = pluginToolWithExecute(
      "fake_ewt_typed_reject",
      "Typed pre-mutation rejection",
      throwTypedFailure("pre-mutation"),
    );

    const details = await runCode("await fake_ewt_typed_reject({});", [target]);

    expect(target.execute).toHaveBeenCalledOnce();
    expect(details).toMatchObject({
      status: "failed",
      failurePhase: "bridge",
      bridgeDispatchStarted: true,
      mutationProvenance: "pre-mutation",
    });
  });

  it("keeps failed exec details marker-free when the plugin failure carries no provenance", async () => {
    const target = pluginToolWithExecute(
      "fake_plain_reject",
      "Plain post-dispatch failure",
      async () => {
        throw new Error("transport failed after dispatch");
      },
    );

    const details = await runCode("await fake_plain_reject({});", [target]);

    expect(target.execute).toHaveBeenCalledOnce();
    expect(details).toMatchObject({
      status: "failed",
      failurePhase: "bridge",
      bridgeDispatchStarted: true,
    });
    expect(details).not.toHaveProperty("mutationProvenance");
  });

  it("keeps failed exec details marker-free for any non pre-mutation provenance value", async () => {
    const target = pluginToolWithExecute(
      "fake_post_mutation_reject",
      "Post-mutation provenance value",
      throwTypedFailure("post-mutation"),
    );

    const details = await runCode("await fake_post_mutation_reject({});", [target]);

    expect(details).toMatchObject({
      status: "failed",
      failurePhase: "bridge",
      bridgeDispatchStarted: true,
    });
    expect(details).not.toHaveProperty("mutationProvenance");
  });

  it("keeps successful exec details marker-free when the guest recovers from a typed rejection", async () => {
    const target = pluginToolWithExecute(
      "fake_recoverable_reject",
      "Typed rejection the guest catches",
      vi
        .fn<() => Promise<ReturnType<typeof jsonResult>>>()
        .mockRejectedValueOnce(typedFailure("pre-mutation"))
        .mockResolvedValueOnce(jsonResult({ recovered: true })),
    );

    const details = await runCode(
      "try { await fake_recoverable_reject({}); } catch {} return await fake_recoverable_reject({});",
      [target],
    );

    expect(target.execute).toHaveBeenCalledTimes(2);
    expect(details).toMatchObject({ status: "completed" });
    expect(details).not.toHaveProperty("mutationProvenance");
  });
});
