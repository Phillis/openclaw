//#region src/cron/runtime-authority.d.ts
type CronRuntimeAuthority = Readonly<{
  version: 1;
  /** Concrete harness runtime that alone may consume this opaque authority. */
  runtimeId: string;
  /** Runtime-owned payload discriminator; core never interprets its value. */
  namespace: string;
  payload: Readonly<Record<string, unknown>>;
}>;
//#endregion
export { CronRuntimeAuthority as t };