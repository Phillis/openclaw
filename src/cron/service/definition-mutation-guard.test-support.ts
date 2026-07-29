import "./definition-mutation-guard.js";

type CronMutationGuardTestApi = {
  setPathOverrides(value?: { guardPath: string; rolloutLockPath: string }): void;
  inspect(options?: {
    guardPath?: string;
    rolloutLockPath?: string;
    nowMs?: number;
  }):
    | { active: false }
    | { active: true; failClosed: boolean; planSha256?: string; runId?: string };
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

export function inspectCronDefinitionMutationGuardForTests(options?: {
  guardPath?: string;
  rolloutLockPath?: string;
  nowMs?: number;
}) {
  return getTestApi().inspect(options);
}
