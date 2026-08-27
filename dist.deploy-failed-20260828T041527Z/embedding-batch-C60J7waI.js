import { t as coerceErrorMessage } from "./error-coercion-CKFmnpjH.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { h as readProviderTextResponse, m as readProviderJsonResponse, r as assertOkOrThrowProviderError } from "./provider-http-errors-BXG5plR9.js";
import { g as waitProviderOperationPollInterval, h as resolveProviderOperationTimeoutMs, n as createProviderOperationDeadline } from "./shared-DOiR3nrc.js";
import "./error-runtime-CmA1H4Zg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./provider-http-gpLoOs40.js";
import { A as extractBatchErrorMessage, C as EMBEDDING_BATCH_ENDPOINT, E as postJsonWithRetry, M as formatUnavailableBatchError, O as withRemoteHttpResponse, T as readEmbeddingBatchJsonl, _ as throwIfBatchCompletionError, b as runEmbeddingBatchGroups, d as uploadBatchJsonlFile, g as resolveCompletedBatchResult, h as resolveBatchCompletionFromStatus, j as formatBatchErrorDetail, p as resolveEmbeddingEndpointUrl, v as throwIfBatchTerminalFailure, w as applyEmbeddingBatchOutputLine, x as buildBatchHeaders, y as buildEmbeddingBatchGroupOptions } from "./memory-core-host-engine-embeddings-vIl5eOM9.js";
//#region extensions/openai/embedding-batch.ts
const OPENAI_BATCH_ENDPOINT = EMBEDDING_BATCH_ENDPOINT;
const OPENAI_BATCH_COMPLETION_WINDOW = "24h";
const OPENAI_BATCH_MAX_REQUESTS = 5e4;
const OPENAI_BATCH_MAX_JSONL_BYTES = 190 * 1024 * 1024;
const OPENAI_BATCH_MAX_POLL_BACKOFF_MS = 5 * 6e4;
async function submitOpenAiBatch(params) {
	const inputFileId = await uploadBatchJsonlFile({
		client: params.openAi,
		requests: params.requests,
		errorPrefix: "openai batch file upload failed"
	});
	return await postJsonWithRetry({
		url: resolveEmbeddingEndpointUrl(params.openAi.baseUrl, "batches"),
		headers: buildBatchHeaders(params.openAi, { json: true }),
		ssrfPolicy: params.openAi.ssrfPolicy,
		fetchImpl: params.openAi.fetchImpl,
		body: {
			input_file_id: inputFileId,
			endpoint: OPENAI_BATCH_ENDPOINT,
			completion_window: OPENAI_BATCH_COMPLETION_WINDOW,
			metadata: {
				source: "openclaw-memory",
				agent: params.agentId
			}
		},
		errorPrefix: "openai batch create failed"
	});
}
async function fetchOpenAiBatchStatus(params) {
	return await fetchOpenAiBatchResource({
		openAi: params.openAi,
		path: `/batches/${params.batchId}`,
		label: "openai.batch-status",
		signal: params.signal,
		parse: async (res) => readProviderJsonResponse(res, "openai.batch-status")
	});
}
async function fetchOpenAiFileContent(params) {
	return await fetchOpenAiBatchResource({
		openAi: params.openAi,
		path: `/files/${params.fileId}/content`,
		label: "openai.batch-file-content",
		parse: async (res) => await readProviderTextResponse(res, "openai.batch-file-content")
	});
}
async function readOpenAiBatchOutputFile(params) {
	return await fetchOpenAiBatchResource({
		openAi: params.openAi,
		path: `/files/${params.fileId}/content`,
		label: "openai.batch-file-content",
		parse: async (res) => await readEmbeddingBatchJsonl(res, {
			label: "openai.batch-file-content",
			maxRecords: params.maxLines,
			onRecord: params.onLine
		})
	});
}
async function fetchOpenAiBatchResource(params) {
	return await withRemoteHttpResponse({
		url: resolveEmbeddingEndpointUrl(params.openAi.baseUrl, params.path),
		ssrfPolicy: params.openAi.ssrfPolicy,
		fetchImpl: params.openAi.fetchImpl,
		signal: params.signal,
		init: { headers: buildBatchHeaders(params.openAi, { json: true }) },
		onResponse: async (res) => {
			await assertOkOrThrowProviderError(res, params.label);
			return await params.parse(res);
		}
	});
}
function formatOpenAiBatchDiagnostic(error) {
	return formatBatchErrorDetail(coerceErrorMessage(error)) ?? "unknown error";
}
function isOpenAiBatchUploadTooLargeError(error) {
	const message = coerceErrorMessage(error);
	if (!/openai batch file upload failed/i.test(message)) return false;
	return /\b413\b/.test(message) || /payload too large/i.test(message) || /request body too large/i.test(message) || /file too large/i.test(message) || /maximum allowed/i.test(message) || /max(?:imum)? (?:body|payload|file) (?:size )?(?:exceeded|limit)/i.test(message);
}
function parseOpenAiBatchOutput(text) {
	if (!text.trim()) return [];
	return normalizeStringEntries(text.split("\n")).map(parseOpenAiBatchOutputLine);
}
function parseOpenAiBatchOutputLine(line) {
	try {
		return JSON.parse(line);
	} catch {
		throw new Error("OpenAI embedding batch output contained malformed JSONL");
	}
}
async function readOpenAiBatchError(params) {
	try {
		return formatBatchErrorDetail(extractBatchErrorMessage(parseOpenAiBatchOutput(await fetchOpenAiFileContent({
			openAi: params.openAi,
			fileId: params.errorFileId
		}))));
	} catch (err) {
		return formatUnavailableBatchError(err);
	}
}
function createOpenAiBatchPollBackoff(params) {
	const maxDelayMs = Math.max(params.pollIntervalMs, Math.min(params.timeoutMs, OPENAI_BATCH_MAX_POLL_BACKOFF_MS));
	let delayMs = params.pollIntervalMs;
	return { nextDelayMs: () => {
		const current = delayMs;
		delayMs = Math.min(maxDelayMs, current * 2);
		return current;
	} };
}
function formatOpenAiBatchProgress(status) {
	const counts = status.request_counts;
	if (!counts || typeof counts.total !== "number") return "";
	const completed = typeof counts.completed === "number" ? counts.completed : 0;
	const failed = typeof counts.failed === "number" ? counts.failed : 0;
	return `; progress ${completed}/${counts.total} failed=${failed}`;
}
function isRetryableOpenAiBatchPollError(error) {
	const message = coerceErrorMessage(error);
	const status = error && typeof error === "object" ? error.status : void 0;
	return typeof status === "number" && (status === 408 || status === 409 || status === 425 || status === 429 || status >= 500 && status <= 599) || /\b(ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN)\b|fetch failed|network error/i.test(message);
}
async function waitForOpenAiBatch(params) {
	const deadline = createProviderOperationDeadline({
		label: `openai batch ${params.batchId}`,
		timeoutMs: params.timeoutMs
	});
	const pollBackoff = createOpenAiBatchPollBackoff(params);
	let current = params.initial;
	while (true) {
		let status;
		let statusSignal;
		try {
			if (current) status = current;
			else {
				statusSignal = AbortSignal.timeout(resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: params.timeoutMs
				}));
				status = await fetchOpenAiBatchStatus({
					openAi: params.openAi,
					batchId: params.batchId,
					signal: statusSignal
				});
			}
		} catch (error) {
			if (statusSignal?.aborted) throw new Error(`openai batch ${params.batchId} timed out after ${params.timeoutMs}ms`, { cause: error });
			if (!params.wait || !isRetryableOpenAiBatchPollError(error)) throw error;
			const delayMs = pollBackoff.nextDelayMs();
			params.debug?.(`openai batch ${params.batchId} status check failed: ${formatOpenAiBatchDiagnostic(error)}; waiting up to ${delayMs}ms`);
			try {
				await waitProviderOperationPollInterval({
					deadline,
					pollIntervalMs: delayMs
				});
				resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: params.timeoutMs
				});
			} catch {
				throw new Error(`openai batch ${params.batchId} timed out after ${params.timeoutMs}ms`, { cause: error });
			}
			current = void 0;
			continue;
		}
		const state = status.status ?? "unknown";
		await throwIfBatchCompletionError({
			provider: "openai",
			status: {
				...status,
				id: params.batchId
			},
			readError: async (errorFileId) => await readOpenAiBatchError({
				openAi: params.openAi,
				errorFileId
			})
		});
		if (state === "completed") return resolveBatchCompletionFromStatus({
			provider: "openai",
			batchId: params.batchId,
			status
		});
		await throwIfBatchTerminalFailure({
			provider: "openai",
			status: {
				...status,
				id: params.batchId
			},
			readError: async (errorFileId) => await readOpenAiBatchError({
				openAi: params.openAi,
				errorFileId
			})
		});
		if (!params.wait) throw new Error(`openai batch ${params.batchId} still ${state}; wait disabled`);
		const delayMs = pollBackoff.nextDelayMs();
		params.debug?.(`openai batch ${params.batchId} ${state}${formatOpenAiBatchProgress(status)}; waiting up to ${delayMs}ms`);
		await waitProviderOperationPollInterval({
			deadline,
			pollIntervalMs: delayMs
		});
		resolveProviderOperationTimeoutMs({
			deadline,
			defaultTimeoutMs: params.timeoutMs
		});
		current = void 0;
	}
}
async function runOpenAiEmbeddingBatches(params) {
	return await runEmbeddingBatchGroups({
		...buildEmbeddingBatchGroupOptions(params, {
			maxRequests: OPENAI_BATCH_MAX_REQUESTS,
			maxJsonlBytes: params.maxJsonlBytes ?? OPENAI_BATCH_MAX_JSONL_BYTES,
			debugLabel: "memory embeddings: openai batch submit"
		}),
		shouldSplitGroupOnError: isOpenAiBatchUploadTooLargeError,
		onSplitGroup: ({ error, group, parts, depth }) => {
			params.debug?.("memory embeddings: openai batch upload too large; splitting group", {
				requests: group.length,
				parts: parts.map((part) => part.length),
				depth,
				error: formatOpenAiBatchDiagnostic(error)
			});
		},
		runGroup: async ({ group, groupIndex, groups, byCustomId, pollIntervalMs, timeoutMs }) => {
			const batchInfo = await submitOpenAiBatch({
				openAi: params.openAi,
				requests: group,
				agentId: params.agentId
			});
			if (!batchInfo.id) throw new Error("openai batch create failed: missing batch id");
			const batchId = batchInfo.id;
			params.debug?.("memory embeddings: openai batch created", {
				batchId: batchInfo.id,
				status: batchInfo.status,
				group: groupIndex + 1,
				groups,
				requests: group.length
			});
			await throwIfBatchCompletionError({
				provider: "openai",
				status: batchInfo,
				readError: async (errorFileId) => await readOpenAiBatchError({
					openAi: params.openAi,
					errorFileId
				})
			});
			const completed = await resolveCompletedBatchResult({
				provider: "openai",
				status: batchInfo,
				wait: params.wait,
				waitForBatch: async () => await waitForOpenAiBatch({
					openAi: params.openAi,
					batchId,
					wait: params.wait,
					pollIntervalMs,
					timeoutMs,
					debug: params.debug,
					initial: batchInfo
				})
			});
			const errors = [];
			const remaining = new Set(group.map((request) => request.custom_id));
			await readOpenAiBatchOutputFile({
				openAi: params.openAi,
				fileId: completed.outputFileId,
				maxLines: group.length,
				onLine: (line) => {
					if (line.custom_id && remaining.has(line.custom_id)) applyEmbeddingBatchOutputLine({
						line,
						remaining,
						errors,
						byCustomId
					});
					return errors.length === 0 && remaining.size > 0;
				}
			});
			if (errors.length > 0) throw new Error(`openai batch ${batchInfo.id} failed: ${formatBatchErrorDetail(errors[0]) ?? "unknown error"}`);
			if (remaining.size > 0) throw new Error(`openai batch ${batchInfo.id} missing ${remaining.size} embedding responses`);
		}
	});
}
//#endregion
export { runOpenAiEmbeddingBatches as n, OPENAI_BATCH_ENDPOINT as t };
