type GatewaySuspendHandoffTestApi = {
  deletePrivateDurableBytesCompareAndSwap(
    path: string,
    expectedBytes: Buffer,
    options?: { beforeDeleteCommit?: () => void },
  ): void;
};

function gatewaySuspendHandoffTestApi(): GatewaySuspendHandoffTestApi {
  const api = (globalThis as Record<PropertyKey, unknown>)[
    Symbol.for("openclaw.gatewaySuspendHandoffTestApi")
  ] as GatewaySuspendHandoffTestApi | undefined;
  if (!api) {
    throw new Error("gateway suspension handoff test API is unavailable");
  }
  return api;
}

export function deletePrivateDurableBytesCompareAndSwapForTest(
  path: string,
  expectedBytes: Buffer,
  options?: { beforeDeleteCommit?: () => void },
): void {
  gatewaySuspendHandoffTestApi().deletePrivateDurableBytesCompareAndSwap(
    path,
    expectedBytes,
    options,
  );
}
