import os from "node:os";
//#region src/daemon/gateway-heap.ts
/** Adaptive Node heap policy for the managed Gateway service. */
const MEBIBYTE_BYTES = 1024 * 1024;
const GATEWAY_HEAP_FLOOR_MIB = 2048;
const GATEWAY_HEAP_CAP_MIB = 8192;
function readAvailableMemory(params) {
	const constrainedMemoryBytes = params.constrainedMemoryBytes ?? process.constrainedMemory();
	const physicalMemoryBytes = params.physicalMemoryBytes ?? os.totalmem();
	if (Number.isFinite(constrainedMemoryBytes) && constrainedMemoryBytes > 0 && constrainedMemoryBytes <= physicalMemoryBytes) return {
		bytes: constrainedMemoryBytes,
		source: "constrained"
	};
	return {
		bytes: physicalMemoryBytes,
		source: "physical"
	};
}
function resolveGatewayHeapLimit(params = {}) {
	const memory = readAvailableMemory(params);
	const availableMemoryMiB = Math.floor(memory.bytes / MEBIBYTE_BYTES);
	const halfMemoryMiB = Math.floor(availableMemoryMiB / 2);
	const headroomCapMiB = Math.floor(availableMemoryMiB * .75);
	return {
		maxOldSpaceSizeMiB: Math.min(GATEWAY_HEAP_CAP_MIB, Math.max(GATEWAY_HEAP_FLOOR_MIB, halfMemoryMiB), headroomCapMiB),
		availableMemoryMiB,
		memorySource: memory.source,
		floorMiB: GATEWAY_HEAP_FLOOR_MIB,
		capMiB: GATEWAY_HEAP_CAP_MIB,
		headroomCapMiB
	};
}
function parseNodeOptionsTokens(nodeOptions) {
	const tokens = [];
	let token = "";
	let inQuotes = false;
	let tokenStarted = false;
	for (let index = 0; index < nodeOptions.length; index += 1) {
		let char = nodeOptions[index];
		if (char === "\\" && inQuotes) {
			index += 1;
			if (index >= nodeOptions.length) return null;
			char = nodeOptions[index];
		} else if (char === " " && !inQuotes) {
			if (tokenStarted) {
				tokens.push(token);
				token = "";
				tokenStarted = false;
			}
			continue;
		} else if (char === "\"") {
			inQuotes = !inQuotes;
			tokenStarted = true;
			continue;
		}
		token += char;
		tokenStarted = true;
	}
	if (inQuotes) return null;
	if (tokenStarted) tokens.push(token);
	return tokens;
}
function parseMaxOldSpaceSizeMiB(nodeOptions) {
	if (!nodeOptions) return null;
	const tokens = parseNodeOptionsTokens(nodeOptions);
	if (!tokens) return null;
	const heapFlag = /^--max[-_]old[-_]space[-_]size$/iu;
	const heapAssignment = /^--max[-_]old[-_]space[-_]size=(\d+)$/iu;
	let result = null;
	for (let index = 0; index < tokens.length; index += 1) {
		const rawValue = heapAssignment.exec(tokens[index] ?? "")?.[1] ?? (heapFlag.test(tokens[index] ?? "") ? tokens[index + 1] : null);
		const value = Number(rawValue);
		if (Number.isSafeInteger(value) && value > 0) result = value;
	}
	return result;
}
function resolveGatewayHeapNodeOptions(existingNodeOptions, memory = {}) {
	return `--max-old-space-size=${parseMaxOldSpaceSizeMiB(existingNodeOptions) ?? resolveGatewayHeapLimit(memory).maxOldSpaceSizeMiB}`;
}
function inspectGatewayHeapLimit(nodeOptions, memory = {}) {
	return {
		...resolveGatewayHeapLimit(memory),
		appliedMiB: parseMaxOldSpaceSizeMiB(nodeOptions)
	};
}
function formatGatewayHeapLimitReport(report) {
	const derivation = `50% of ${report.availableMemoryMiB} MiB ${report.memorySource} memory, target range ${report.floorMiB}-${report.capMiB} MiB, native headroom cap ${report.headroomCapMiB} MiB`;
	if (report.appliedMiB === null) return `not set; adaptive default ${report.maxOldSpaceSizeMiB} MiB (${derivation})`;
	if (report.appliedMiB === report.maxOldSpaceSizeMiB) return `${report.appliedMiB} MiB (adaptive default: ${derivation})`;
	return `${report.appliedMiB} MiB (service setting; adaptive default ${report.maxOldSpaceSizeMiB} MiB from ${derivation})`;
}
//#endregion
export { inspectGatewayHeapLimit as n, resolveGatewayHeapNodeOptions as r, formatGatewayHeapLimitReport as t };
