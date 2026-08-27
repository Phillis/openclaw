import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as callGatewayFromCli } from "./gateway-rpc-4LDXqcsd.js";
import { randomUUID } from "node:crypto";
//#region src/cli/cron-cli/list-jobs.ts
const CRON_LIST_PAGE_SIZE = 200;
const CRON_LIST_MAX_PAGES = 50;
const CRON_LIST_MAX_SNAPSHOT_RESTARTS = 3;
/** Recognize the explicit protocol-v4 capability boundary, not transport failures. */
function isUnknownCronGetMethodError(error) {
	return error instanceof Error && error.name === "GatewayClientRequestError" && error.gatewayCode === "INVALID_REQUEST" && error.message.includes("unknown method: cron.get");
}
/** Read every bounded Gateway page from one complete cron inventory revision. */
async function listCronJobsFromGateway(opts, filters, options = {}) {
	let allowLegacyUnversionedPagination = options.allowLegacyUnversionedPagination === true;
	for (let restart = 0; restart <= CRON_LIST_MAX_SNAPSHOT_RESTARTS; restart += 1) {
		let offset = 0;
		let snapshotRevision;
		let total;
		let pageMetadataMode;
		let firstPage;
		let snapshotChanged = false;
		const jobs = [];
		const deliveryPreviews = {};
		for (let pageNumber = 0; pageNumber < CRON_LIST_MAX_PAGES; pageNumber += 1) {
			const page = await callGatewayFromCli("cron.list", opts, {
				...filters,
				limit: CRON_LIST_PAGE_SIZE,
				offset
			});
			const hasCanonicalMetadata = page !== null && typeof page === "object" && (page.snapshotRevision !== void 0 || page.total !== void 0 || page.offset !== void 0 || page.limit !== void 0);
			if (!page || typeof page !== "object" || !Array.isArray(page.jobs) || page.jobs.length > CRON_LIST_PAGE_SIZE || page.snapshotRevision !== void 0 && (typeof page.snapshotRevision !== "string" || page.snapshotRevision.length === 0) || page.total !== void 0 && (typeof page.total !== "number" || !Number.isSafeInteger(page.total) || page.total < 0) || page.offset !== void 0 && (typeof page.offset !== "number" || !Number.isSafeInteger(page.offset) || page.offset < 0) || page.limit !== void 0 && (typeof page.limit !== "number" || !Number.isSafeInteger(page.limit) || page.limit < 1 || page.limit > CRON_LIST_PAGE_SIZE || page.jobs.length > page.limit) || page.hasMore !== void 0 && typeof page.hasMore !== "boolean" || hasCanonicalMetadata && (page.snapshotRevision === void 0 || page.total === void 0 || page.offset === void 0 || page.limit === void 0 || page.hasMore === void 0 || page.nextOffset === void 0)) throw new Error("cron.list returned an invalid inventory page");
			const currentMetadataMode = hasCanonicalMetadata ? "canonical" : "legacy";
			if (pageMetadataMode !== void 0 && pageMetadataMode !== currentMetadataMode) {
				snapshotChanged = true;
				break;
			}
			if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) {
				snapshotChanged = true;
				break;
			}
			if (page.offset !== void 0 && page.offset !== offset) throw new Error("cron.list returned an invalid inventory page");
			if (!hasCanonicalMetadata && !allowLegacyUnversionedPagination) {
				const probeJob = page.jobs[0];
				if (probeJob && (typeof probeJob.id !== "string" || probeJob.id.length === 0)) throw new Error("cron.list returned an invalid inventory page");
				const probeJobId = probeJob?.id ?? randomUUID();
				try {
					await callGatewayFromCli("cron.get", opts, { id: probeJobId });
				} catch (error) {
					if (isUnknownCronGetMethodError(error)) allowLegacyUnversionedPagination = true;
					else if (!isMissingCronGetError(error, probeJobId)) throw error;
				}
				if (!allowLegacyUnversionedPagination) throw new Error("cron.list returned an invalid inventory page");
			}
			pageMetadataMode ??= currentMetadataMode;
			firstPage ??= page;
			snapshotRevision ??= page.snapshotRevision;
			total ??= page.total;
			jobs.push(...page.jobs);
			if (page.deliveryPreviews) Object.assign(deliveryPreviews, page.deliveryPreviews);
			if (!page.hasMore) {
				if (total !== void 0 && jobs.length !== total || page.nextOffset !== void 0 && page.nextOffset !== null) throw new Error("cron.list returned an inconsistent terminal inventory page");
				return {
					...firstPage,
					jobs,
					...Object.keys(deliveryPreviews).length > 0 ? { deliveryPreviews } : {},
					...total !== void 0 ? { total } : {},
					...snapshotRevision !== void 0 ? { snapshotRevision } : {},
					...firstPage.offset !== void 0 ? { offset: firstPage.offset } : {},
					...firstPage.limit !== void 0 ? { limit: firstPage.limit } : {},
					...firstPage.hasMore !== void 0 ? {
						hasMore: false,
						nextOffset: null
					} : {}
				};
			}
			if (typeof page.nextOffset !== "number" || !Number.isSafeInteger(page.nextOffset) || page.nextOffset <= offset || total !== void 0 && page.nextOffset !== offset + page.jobs.length) throw new Error("cron.list pagination did not advance while looking up automation");
			offset = page.nextOffset;
		}
		if (!snapshotChanged) throw new Error("cron.list pagination exceeded maximum pages while looking up automation");
		if (restart === CRON_LIST_MAX_SNAPSHOT_RESTARTS) throw new Error("cron.list inventory changed repeatedly while reading automations");
	}
	throw new Error("cron.list inventory changed repeatedly while reading automations");
}
function isMissingCronGetError(error, id) {
	return isUnknownCronGetMethodError(error) || error instanceof Error && error.name === "GatewayClientRequestError" && error.gatewayCode === "INVALID_REQUEST" && (error.message.includes(`automation not found: ${id}`) || error.message.includes(`cron job not found: ${id}`));
}
/** Resolve stable IDs before exact names without trusting page order. */
async function findCronJobByIdOrName(opts, idOrName, options = {}) {
	let allowLegacyUnversionedPagination = false;
	try {
		const directJob = await callGatewayFromCli("cron.get", opts, { id: idOrName });
		if (directJob?.id === idOrName) {
			if (!options.includeDeliveryPreview) return { job: directJob };
			return {
				job: directJob,
				deliveryPreview: (await listCronJobsFromGateway(opts, {
					includeDisabled: true,
					query: idOrName
				})).deliveryPreviews?.[directJob.id]
			};
		}
	} catch (error) {
		if (!isMissingCronGetError(error, idOrName)) throw error;
		allowLegacyUnversionedPagination = isUnknownCronGetMethodError(error);
	}
	const inventory = await listCronJobsFromGateway(opts, { includeDisabled: true }, { allowLegacyUnversionedPagination });
	const needle = normalizeLowercaseStringOrEmpty(idOrName);
	const job = inventory.jobs.find((candidate) => normalizeLowercaseStringOrEmpty(candidate.id) === needle) ?? inventory.jobs.find((candidate) => normalizeLowercaseStringOrEmpty(candidate.name) === needle);
	return {
		job,
		deliveryPreview: job ? inventory.deliveryPreviews?.[job.id] : void 0
	};
}
//#endregion
export { isUnknownCronGetMethodError as n, listCronJobsFromGateway as r, findCronJobByIdOrName as t };
