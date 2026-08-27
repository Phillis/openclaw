import { EMBEDDING_BATCH_ENDPOINT, applyEmbeddingBatchOutputLine, buildBatchHeaders, buildEmbeddingBatchGroupOptions, extractBatchErrorMessage, formatBatchErrorDetail, formatUnavailableBatchError, postJsonWithRetry, readEmbeddingBatchJsonl, resolveBatchCompletionFromStatus, resolveCompletedBatchResult, resolveEmbeddingEndpointUrl, runEmbeddingBatchGroups, throwIfBatchCompletionError, throwIfBatchTerminalFailure, uploadBatchJsonlFile, withRemoteHttpResponse } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
import { assertOkOrThrowProviderError, createProviderOperationDeadline, readProviderJsonResponse, resolveProviderOperationTimeoutMs, waitProviderOperationPollInterval } from "openclaw/plugin-sdk/provider-http";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/voyage/embedding-batch.ts
const VOYAGE_BATCH_ENDPOINT = EMBEDDING_BATCH_ENDPOINT;
const VOYAGE_BATCH_COMPLETION_WINDOW = "12h";
const VOYAGE_BATCH_MAX_REQUESTS = 5e4;
const VOYAGE_BATCH_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
function buildVoyageBatchRequest(params) {
	return {
		url: resolveEmbeddingEndpointUrl(params.client.baseUrl, params.path),
		ssrfPolicy: params.client.ssrfPolicy,
		signal: params.signal,
		init: { headers: buildBatchHeaders(params.client, { json: true }) },
		onResponse: params.onResponse
	};
}
async function submitVoyageBatch(params) {
	const inputFileId = await uploadBatchJsonlFile({
		client: params.client,
		requests: params.requests,
		errorPrefix: "voyage batch file upload failed"
	});
	return await postJsonWithRetry({
		url: resolveEmbeddingEndpointUrl(params.client.baseUrl, "batches"),
		headers: buildBatchHeaders(params.client, { json: true }),
		ssrfPolicy: params.client.ssrfPolicy,
		body: {
			input_file_id: inputFileId,
			endpoint: VOYAGE_BATCH_ENDPOINT,
			completion_window: VOYAGE_BATCH_COMPLETION_WINDOW,
			request_params: {
				model: params.client.model,
				input_type: "document"
			},
			metadata: {
				source: "clawdbot-memory",
				agent: params.agentId
			}
		},
		errorPrefix: "voyage batch create failed"
	});
}
async function fetchVoyageBatchStatus(params) {
	return await withRemoteHttpResponse(buildVoyageBatchRequest({
		client: params.client,
		path: `batches/${params.batchId}`,
		signal: params.signal,
		onResponse: async (res) => {
			await assertOkOrThrowProviderError(res, "voyage.batch-status");
			return await readProviderJsonResponse(res, "voyage-batch-status", { maxBytes: VOYAGE_BATCH_RESPONSE_MAX_BYTES });
		}
	}));
}
async function readVoyageBatchError(params) {
	try {
		return await withRemoteHttpResponse(buildVoyageBatchRequest({
			client: params.client,
			path: `files/${params.errorFileId}/content`,
			onResponse: async (res) => {
				await assertOkOrThrowProviderError(res, "voyage.batch-error-file-content");
				const bytes = await readResponseWithLimit(res, VOYAGE_BATCH_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`voyage batch error file content exceeds ${maxBytesLocal} bytes`) });
				const text = new TextDecoder().decode(bytes);
				if (!text.trim()) return;
				return formatBatchErrorDetail(extractBatchErrorMessage(normalizeStringEntries(text.split("\n")).map((line) => JSON.parse(line))));
			}
		}));
	} catch (err) {
		return formatUnavailableBatchError(err);
	}
}
async function waitForVoyageBatch(params) {
	const deadline = createProviderOperationDeadline({
		label: `voyage batch ${params.batchId}`,
		timeoutMs: params.timeoutMs
	});
	let current = params.initial;
	while (true) {
		let status;
		if (current) status = current;
		else {
			const signal = AbortSignal.timeout(resolveProviderOperationTimeoutMs({
				deadline,
				defaultTimeoutMs: params.timeoutMs
			}));
			try {
				status = await fetchVoyageBatchStatus({
					client: params.client,
					batchId: params.batchId,
					signal
				});
			} catch (error) {
				if (signal.aborted) throw new Error(`voyage batch ${params.batchId} timed out after ${params.timeoutMs}ms`, { cause: error });
				throw error;
			}
		}
		const state = status.status ?? "unknown";
		await throwIfBatchCompletionError({
			provider: "voyage",
			status: {
				...status,
				id: params.batchId
			},
			readError: async (errorFileId) => await readVoyageBatchError({
				client: params.client,
				errorFileId
			})
		});
		if (state === "completed") return resolveBatchCompletionFromStatus({
			provider: "voyage",
			batchId: params.batchId,
			status
		});
		await throwIfBatchTerminalFailure({
			provider: "voyage",
			status: {
				...status,
				id: params.batchId
			},
			readError: async (errorFileId) => await readVoyageBatchError({
				client: params.client,
				errorFileId
			})
		});
		if (!params.wait) throw new Error(`voyage batch ${params.batchId} still ${state}; wait disabled`);
		const waitMs = Math.min(params.pollIntervalMs, resolveProviderOperationTimeoutMs({
			deadline,
			defaultTimeoutMs: params.timeoutMs
		}));
		params.debug?.(`voyage batch ${params.batchId} ${state}; waiting ${waitMs}ms`);
		await waitProviderOperationPollInterval({
			deadline,
			pollIntervalMs: waitMs
		});
		resolveProviderOperationTimeoutMs({
			deadline,
			defaultTimeoutMs: params.timeoutMs
		});
		current = void 0;
	}
}
async function runVoyageEmbeddingBatches(params) {
	return await runEmbeddingBatchGroups({
		...buildEmbeddingBatchGroupOptions(params, {
			maxRequests: VOYAGE_BATCH_MAX_REQUESTS,
			debugLabel: "memory embeddings: voyage batch submit"
		}),
		runGroup: async ({ group, groupIndex, groups, byCustomId, pollIntervalMs, timeoutMs }) => {
			const batchInfo = await submitVoyageBatch({
				client: params.client,
				requests: group,
				agentId: params.agentId
			});
			if (!batchInfo.id) throw new Error("voyage batch create failed: missing batch id");
			const batchId = batchInfo.id;
			params.debug?.("memory embeddings: voyage batch created", {
				batchId: batchInfo.id,
				status: batchInfo.status,
				group: groupIndex + 1,
				groups,
				requests: group.length
			});
			await throwIfBatchCompletionError({
				provider: "voyage",
				status: batchInfo,
				readError: async (errorFileId) => await readVoyageBatchError({
					client: params.client,
					errorFileId
				})
			});
			const completed = await resolveCompletedBatchResult({
				provider: "voyage",
				status: batchInfo,
				wait: params.wait,
				waitForBatch: async () => await waitForVoyageBatch({
					client: params.client,
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
			await withRemoteHttpResponse({
				url: resolveEmbeddingEndpointUrl(params.client.baseUrl, `files/${completed.outputFileId}/content`),
				ssrfPolicy: params.client.ssrfPolicy,
				init: { headers: buildBatchHeaders(params.client, { json: true }) },
				onResponse: async (contentRes) => {
					await assertOkOrThrowProviderError(contentRes, "voyage.batch-file-content");
					await readEmbeddingBatchJsonl(contentRes, {
						label: "voyage.batch-file-content",
						maxRecords: group.length,
						onRecord: (line) => {
							if (line.custom_id && remaining.has(line.custom_id)) applyEmbeddingBatchOutputLine({
								line,
								remaining,
								errors,
								byCustomId
							});
							return errors.length === 0 && remaining.size > 0;
						}
					});
				}
			});
			if (errors.length > 0) throw new Error(`voyage batch ${batchInfo.id} failed: ${formatBatchErrorDetail(errors[0]) ?? "unknown error"}`);
			if (remaining.size > 0) throw new Error(`voyage batch ${batchInfo.id} missing ${remaining.size} embedding responses`);
		}
	});
}
//#endregion
export { runVoyageEmbeddingBatches };
