import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { getGatewayProcessInstanceId } from "./process-instance.js";

function readFreshGatewayProcessInstanceId(): string {
  return execFileSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "--input-type=module",
      "--eval",
      "import { getGatewayProcessInstanceId } from './src/gateway/process-instance.ts'; process.stdout.write(getGatewayProcessInstanceId());",
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  ).trim();
}

describe("Gateway process instance identity", () => {
  it("is stable within one process and rotates only with a fresh process", () => {
    const current = getGatewayProcessInstanceId();

    expect(getGatewayProcessInstanceId()).toBe(current);
    expect(getGatewayProcessInstanceId()).toBe(current);

    const firstRestart = readFreshGatewayProcessInstanceId();
    const secondRestart = readFreshGatewayProcessInstanceId();
    expect(firstRestart).not.toBe(current);
    expect(secondRestart).not.toBe(current);
    expect(secondRestart).not.toBe(firstRestart);
  });
});
