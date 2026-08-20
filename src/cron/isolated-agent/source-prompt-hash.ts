import { createHash } from "node:crypto";

/** Stable hash-only identity for one stored cron `agentTurn` message. */
export type CronSourcePromptHash = `sha256:${string}`;

/**
 * Canonicalizes and hashes a stored cron prompt before any runtime wrapper is
 * applied. Empty prompts are omitted rather than given a shared identity.
 */
export function createCronSourcePromptHash(
  message: string | undefined,
): CronSourcePromptHash | undefined {
  const canonical = message
    ?.normalize("NFKC")
    .replace(/\r\n?/gu, "\n")
    .trim()
    .replace(/\s+/gu, " ");
  if (!canonical) {
    return undefined;
  }
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}
