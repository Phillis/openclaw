import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Bt as validateExecApprovalsSetParams, It as validateExecApprovalsGetParams, Lt as validateExecApprovalsNodeGetParams, Rt as validateExecApprovalsNodeSetParams, zt as validateExecApprovalsNodeSnapshot } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { a as mergeExecApprovalsSocketDefaults } from "./exec-approvals-config-moZwurok.js";
import { G as ensureExecApprovalsSnapshot, J as readExecApprovalsSnapshot, Q as updateExecApprovals, t as normalizeExecApprovals } from "./exec-approvals-DkNiV-ux.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-Cru_no7H.js";
import { t as parseGatewayPayload } from "./server-json-CUC0gj3q.js";
import { i as respondUnavailableOnThrow, r as respondUnavailableOnNodeInvokeErrorWithProvenance } from "./nodes.helpers-CkPbEFOM.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as resolveBaseHashParam } from "./base-hash-BJkn_bB6.js";
//#region src/gateway/server-methods/exec-approvals.ts
function requireApprovalsBaseHash(params, snapshot, respond) {
	const baseHash = resolveBaseHashParam(params);
	if (!snapshot.exists) {
		if (baseHash && baseHash !== snapshot.hash) {
			respondApprovalsChanged(respond);
			return false;
		}
		return true;
	}
	if (!snapshot.hash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals base hash unavailable; re-run exec.approvals.get and retry"));
		return false;
	}
	if (!baseHash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals base hash required; re-run exec.approvals.get and retry"));
		return false;
	}
	if (baseHash !== snapshot.hash) {
		respondApprovalsChanged(respond);
		return false;
	}
	return true;
}
function respondApprovalsChanged(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals changed since last load; re-run exec.approvals.get and retry"));
}
function redactExecApprovals(file) {
	const socketPath = file.socket?.path?.trim();
	return {
		...file,
		socket: socketPath ? { path: socketPath } : void 0
	};
}
function toExecApprovalsPayload(snapshot) {
	return {
		path: snapshot.path,
		exists: snapshot.exists,
		hash: snapshot.hash,
		file: redactExecApprovals(snapshot.file)
	};
}
function isMacAppNode(session) {
	const platform = session?.platform?.trim().toLowerCase();
	return session?.clientId === GATEWAY_CLIENT_IDS.MACOS_APP && session.clientMode === GATEWAY_CLIENT_MODES.NODE && (platform === "macos" || platform?.startsWith("macos ") === true);
}
async function respondWithExecApprovalsNodePayload(params) {
	const rawParams = params.rawParams;
	if (!assertValidParams(rawParams, params.validate, params.method, params.respond)) return;
	const parsedParams = rawParams;
	const nodeId = parsedParams.nodeId.trim();
	if (!nodeId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
		return;
	}
	const nodeSession = params.context.nodeRegistry.get(nodeId);
	if (nodeSession) {
		const allowed = isNodeCommandAllowed({
			command: params.command,
			declaredCommands: nodeSession.commands,
			allowlist: resolveNodeCommandAllowlist(params.context.getRuntimeConfig(), {
				...nodeSession,
				approvedCommands: nodeSession.commands
			})
		});
		if (!allowed.ok) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `node command not allowed: ${params.command} (${allowed.reason})`, { details: {
				command: params.command,
				reason: allowed.reason
			} }));
			return;
		}
	}
	await respondUnavailableOnThrow(params.respond, async () => {
		let nodeCommandDispatched = false;
		const res = await params.context.nodeRegistry.invoke({
			nodeId,
			...nodeSession ? {
				expectedConnId: nodeSession.connId,
				...nodeSession.pairingGeneration ? { expectedPairingGeneration: nodeSession.pairingGeneration } : {}
			} : {},
			command: params.command,
			params: params.commandParams(parsedParams, nodeSession),
			onDispatchReady: () => {
				nodeCommandDispatched = true;
			}
		});
		if (!respondUnavailableOnNodeInvokeErrorWithProvenance(params.respond, res, { nodeCommandDispatched })) return;
		const payload = params.readPayload(res);
		if (params.validatePayload && !params.validatePayload(payload)) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node returned invalid exec approvals payload"));
			return;
		}
		params.respond(true, payload, void 0);
	});
}
const execApprovalsHandlers = {
	"exec.approvals.get": async ({ params, respond }) => {
		if (!assertValidParams(params, validateExecApprovalsGetParams, "exec.approvals.get", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, toExecApprovalsPayload(await ensureExecApprovalsSnapshot()), void 0);
		});
	},
	"exec.approvals.set": async ({ params, respond }) => {
		if (!assertValidParams(params, validateExecApprovalsSetParams, "exec.approvals.set", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			const snapshot = readExecApprovalsSnapshot();
			if (!requireApprovalsBaseHash(params, snapshot, respond)) return;
			const incoming = params.file;
			if (!incoming || typeof incoming !== "object") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals file is required"));
				return;
			}
			const normalized = normalizeExecApprovals(incoming);
			const nextSnapshot = await updateExecApprovals({
				baseHash: snapshot.hash,
				update: (current) => mergeExecApprovalsSocketDefaults({
					normalized,
					current
				})
			});
			if (!nextSnapshot) {
				respondApprovalsChanged(respond);
				return;
			}
			respond(true, toExecApprovalsPayload(nextSnapshot), void 0);
		});
	},
	"exec.approvals.node.get": async ({ params, respond, context }) => {
		await respondWithExecApprovalsNodePayload({
			method: "exec.approvals.node.get",
			rawParams: params,
			validate: validateExecApprovalsNodeGetParams,
			context,
			respond,
			command: "system.execApprovals.get",
			commandParams: (_parsedParams, nodeSession) => isMacAppNode(nodeSession) ? { includeResolvedDefaults: true } : {},
			readPayload: (res) => res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload,
			validatePayload: validateExecApprovalsNodeSnapshot
		});
	},
	"exec.approvals.node.set": async ({ params, respond, context }) => {
		await respondWithExecApprovalsNodePayload({
			method: "exec.approvals.node.set",
			rawParams: params,
			validate: validateExecApprovalsNodeSetParams,
			context,
			respond,
			command: "system.execApprovals.set",
			commandParams: (parsedParams) => "native" in parsedParams ? {
				...parsedParams.native,
				baseHash: parsedParams.baseHash
			} : {
				file: parsedParams.file,
				baseHash: parsedParams.baseHash
			},
			readPayload: (res) => res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload
		});
	}
};
//#endregion
export { execApprovalsHandlers };
