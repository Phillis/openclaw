import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as assertCodexModelListResponse } from "./protocol-validators-DQMpwHD0.js";
//#region extensions/codex/src/app-server/models.ts
/**
* Lists and normalizes models exposed by the Codex app-server `model/list`
* endpoint, including pagination and shared-client lease handling.
*/
/** Lists one Codex app-server model page using the configured auth/client options. */
async function listCodexAppServerModels(options = {}) {
	return await withCodexAppServerModelClient(options, async ({ client, timeoutMs }) => requestModelListPage(client, {
		...options,
		timeoutMs
	}));
}
/** Walks Codex app-server model pages until exhaustion or the max-page guard. */
async function listAllCodexAppServerModels(options = {}) {
	const maxPages = normalizeMaxPages(options.maxPages);
	return await withCodexAppServerModelClient(options, async ({ client, timeoutMs }) => {
		const models = [];
		let cursor = options.cursor;
		let nextCursor;
		for (let page = 0; page < maxPages; page += 1) {
			const result = await requestModelListPage(client, {
				...options,
				timeoutMs,
				cursor
			});
			models.push(...result.models);
			nextCursor = result.nextCursor;
			if (!nextCursor) return { models };
			cursor = nextCursor;
		}
		return {
			models,
			nextCursor,
			truncated: true
		};
	});
}
async function withCodexAppServerModelClient(options, run) {
	const timeoutMs = options.timeoutMs ?? 2500;
	const useSharedClient = options.sharedClient !== false;
	const { createIsolatedCodexAppServerClient, getLeasedSharedCodexAppServerClient, releaseLeasedSharedCodexAppServerClient } = await import("./shared-client-D_ZGbdzH.js");
	const client = useSharedClient ? await getLeasedSharedCodexAppServerClient({
		startOptions: options.startOptions,
		timeoutMs,
		authProfileId: options.authProfileId,
		authRequirement: options.authRequirement,
		agentDir: options.agentDir,
		config: options.config
	}) : await createIsolatedCodexAppServerClient({
		startOptions: options.startOptions,
		timeoutMs,
		authProfileId: options.authProfileId,
		authRequirement: options.authRequirement,
		agentDir: options.agentDir,
		config: options.config
	});
	try {
		return await run({
			client,
			timeoutMs
		});
	} finally {
		if (useSharedClient) releaseLeasedSharedCodexAppServerClient(client);
		else client.close();
	}
}
async function requestModelListPage(client, options) {
	return readModelListResult(await client.request("model/list", {
		limit: options.limit ?? null,
		cursor: options.cursor ?? null,
		includeHidden: options.includeHidden ?? null
	}, { timeoutMs: options.timeoutMs }));
}
/** Parses a raw Codex app-server model/list response into OpenClaw's normalized shape. */
function readModelListResult(value) {
	const response = assertCodexModelListResponse(value);
	const models = response.data.map((entry) => readCodexModel(entry));
	const nextCursor = response.nextCursor ?? void 0;
	return {
		models,
		...nextCursor ? { nextCursor } : {}
	};
}
function readCodexModel(value) {
	const id = normalizeOptionalString(value.id);
	const model = normalizeOptionalString(value.model);
	if (!id || !model) throw new Error("Invalid Codex app-server model/list response: model id and name must be non-empty strings");
	return {
		id,
		model,
		...normalizeOptionalString(value.displayName) ? { displayName: normalizeOptionalString(value.displayName) } : {},
		...normalizeOptionalString(value.description) ? { description: normalizeOptionalString(value.description) } : {},
		hidden: value.hidden,
		isDefault: value.isDefault,
		inputModalities: value.inputModalities,
		supportedReasoningEfforts: readReasoningEfforts(value.supportedReasoningEfforts),
		...normalizeOptionalString(value.defaultReasoningEffort) ? { defaultReasoningEffort: normalizeOptionalString(value.defaultReasoningEffort) } : {}
	};
}
function readReasoningEfforts(value) {
	return uniqueStrings(value.map((entry) => normalizeOptionalString(entry.reasoningEffort)).filter((entry) => entry !== void 0));
}
function normalizeMaxPages(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 20;
}
//#endregion
export { listCodexAppServerModels as n, readModelListResult as r, listAllCodexAppServerModels as t };
