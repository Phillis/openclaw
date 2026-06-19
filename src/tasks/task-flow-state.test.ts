import { describe, expect, it } from "vitest";
import {
  deriveTaskFlowAttention,
  mergeTaskFlowStructuredState,
  readTaskFlowCheckpoint,
  readTaskFlowWatch,
} from "./task-flow-state.js";

describe("task-flow-state", () => {
  it("merges structured checkpoint and watch state without dropping existing keys", () => {
    const state = mergeTaskFlowStructuredState({
      stateJson: { phase: "triage" },
      checkpoint: {
        summary: "Need a resumable checkpoint.",
        nextAction: "Review the newest artifact.",
        updatedAt: 10,
      },
      watch: {
        waitingOn: "child_task",
        expectedEvent: "child completion",
        staleAfterMs: 5_000,
      },
    });

    expect(state).toEqual({
      phase: "triage",
      __openclawCheckpoint: {
        summary: "Need a resumable checkpoint.",
        nextAction: "Review the newest artifact.",
        updatedAt: 10,
      },
      __openclawWatch: {
        waitingOn: "child_task",
        expectedEvent: "child completion",
        staleAfterMs: 5_000,
      },
    });
    expect(readTaskFlowCheckpoint(state)).toEqual({
      summary: "Need a resumable checkpoint.",
      nextAction: "Review the newest artifact.",
      updatedAt: 10,
    });
    expect(readTaskFlowWatch(state)).toEqual({
      waitingOn: "child_task",
      expectedEvent: "child completion",
      staleAfterMs: 5_000,
    });
  });

  it("derives review-due attention from structured watch state", () => {
    const attention = deriveTaskFlowAttention(
      {
        status: "waiting",
        updatedAt: 20,
        stateJson: {
          __openclawCheckpoint: {
            summary: "Waiting on child",
            updatedAt: 15,
          },
          __openclawWatch: {
            waitingOn: "child_task",
            expectedEvent: "child completion",
            reviewAt: 18,
            reviewReason: "Review the lane if the child stays silent.",
          },
        },
      },
      25,
    );

    expect(attention).toEqual({
      state: "review_due",
      reason: "Review the lane if the child stays silent.",
      updatedAt: 15,
      reviewAt: 18,
      waitingOn: "child_task",
      expectedEvent: "child completion",
    });
  });

  it("derives stale attention when checkpoint updates are overdue", () => {
    const attention = deriveTaskFlowAttention(
      {
        status: "running",
        updatedAt: 100,
        stateJson: {
          __openclawCheckpoint: {
            summary: "Still working",
            updatedAt: 100,
          },
          __openclawWatch: {
            staleAfterMs: 50,
            reviewReason: "Switch tactics if no new evidence appears.",
            stallCount: 2,
          },
        },
      },
      180,
    );

    expect(attention).toEqual({
      state: "stale",
      reason: "Switch tactics if no new evidence appears.",
      updatedAt: 100,
      stallCount: 2,
    });
  });
});
