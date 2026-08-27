//#region src/cron/scratch-contract.ts
/** Publicly stable limits for private per-job scratch content. */
const CRON_JOB_SCRATCH_MAX_BYTES = 256 * 1024;
function assertCronJobScratchContent(content) {
	const sizeBytes = Buffer.byteLength(content, "utf8");
	if (sizeBytes > 262144) throw new Error(`cron scratch exceeds ${CRON_JOB_SCRATCH_MAX_BYTES} bytes (${sizeBytes} bytes provided)`);
}
//#endregion
export { assertCronJobScratchContent as n, CRON_JOB_SCRATCH_MAX_BYTES as t };
