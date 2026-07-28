import "./definition-mutation-guard.js";

type CronMutationGuardTestApi = {
  setPathOverrides(value?: { guardPath: string; rolloutLockPath: string }): void;
};

function getTestApi(): CronMutationGuardTestApi {
  return (globalThis as Record<PropertyKey, unknown>)[
    Symbol.for("openclaw.cronMutationGuardTestApi")
  ] as CronMutationGuardTestApi;
}

export function setCronMutationGuardPathsForTests(value?: {
  guardPath: string;
  rolloutLockPath: string;
}): void {
  getTestApi().setPathOverrides(value);
}
