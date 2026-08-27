import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { c as executionIdentitySpawnAdmission } from "./execution-identity-admission-Tv8ni-9_.js";
import { a as withPostAdmissionExecutionOwnerBinding } from "./execution-owner-binding-D6RWdohd.js";
import { a as prepareAgentRunAdmission, r as createOperationalRunInstanceRef } from "./admitted-run-context-KQIZywud.js";
import { n as commitMainSessionRecovery } from "./main-session-recovery-store-dpSl6NHY.js";
//#region src/agents/agent-command-admission-facts.ts
const factsByIngress = /* @__PURE__ */ new WeakMap();
function attachAgentCommandAdmissionFacts(ingress, facts) {
	factsByIngress.set(ingress, facts);
}
function getAgentCommandAdmissionFacts(ingress) {
	return factsByIngress.get(ingress);
}
/** Records the exact system attribution only after the recovery owner admits the attempt. */
function attachAgentCommandRecoveryAdmissionFacts(ingress) {
	attachAgentCommandAdmissionFacts(ingress, {
		ingress: {
			kind: "recovery",
			boundary: "gateway.main-session-recovery",
			state: "present"
		},
		invoker: {
			state: "present",
			kind: "system",
			rawPrincipalRef: "openclaw.main-session-recovery"
		},
		assurance: [{
			kind: "runtime-binding",
			rawEvidenceRef: "gateway.main-session-recovery-owner",
			strength: "boundary-verified"
		}]
	});
}
//#endregion
//#region src/agents/agent-command-execution-identity-spawn.ts
const EXECUTION_IDENTITY_SPAWN_FACTS = Symbol("executionIdentitySpawnFacts");
/** Attach authenticated spawn facts without widening the public AgentCommandOpts contract. */
function withAgentCommandExecutionIdentitySpawnFacts(opts, facts) {
	if (!facts) return opts;
	return {
		...opts,
		[EXECUTION_IDENTITY_SPAWN_FACTS]: facts
	};
}
function readAgentCommandExecutionIdentitySpawnFacts(opts) {
	return opts[EXECUTION_IDENTITY_SPAWN_FACTS];
}
function withoutAgentCommandExecutionIdentitySpawnFacts(opts) {
	return {
		...opts,
		[EXECUTION_IDENTITY_SPAWN_FACTS]: void 0
	};
}
//#endregion
//#region src/agents/agent-command-execution-identity.ts
const log = createSubsystemLogger("agents/agent-command");
const LOCAL_CLI_ADMISSION_INGRESS = {
	kind: "local-cli",
	boundary: "agent-command.local",
	state: "present"
};
function systemIngress(boundary) {
	return {
		kind: "system",
		boundary,
		state: "present"
	};
}
function prepareAgentCommandRunAdmission(params) {
	return prepareAgentCommandRunAdmissionWithSpawnFacts(params);
}
function prepareAgentCommandRunAdmissionWithSpawnFacts(params, spawnFacts) {
	const admissionFacts = getAgentCommandAdmissionFacts(params.operationalRunInstance) ?? { ingress: params.ingress };
	const applicableGrants = spawnFacts?.applicableGrants;
	const assurance = spawnFacts?.assurance ?? admissionFacts.assurance;
	return prepareAgentRunAdmission({
		cfg: params.cfg,
		operationalRunInstance: params.operationalRunInstance,
		facts: executionIdentitySpawnAdmission({
			operation: "attach",
			value: {
				runId: params.runId,
				agentId: params.agentId,
				ingress: spawnFacts?.ingress ?? admissionFacts.ingress,
				...spawnFacts?.invoker ?? admissionFacts.invoker ? { invoker: spawnFacts?.invoker ?? admissionFacts.invoker } : {},
				...applicableGrants ? { applicableGrants } : {},
				...assurance ? { assurance } : {}
			},
			extra: spawnFacts?.spawnAdmission
		}),
		...params.admission ? { recovery: params.admission } : {},
		...params.onAdmitted ? { onAdmitted: params.onAdmitted } : {}
	});
}
async function bindAgentCommandRecoveryExecutionIdentity(params) {
	try {
		const bound = await commitMainSessionRecovery({
			command: {
				kind: "bind_admitted_execution_identity",
				attempt: params.attempt,
				cycleId: params.cycleId,
				lifecycleGeneration: params.lifecycleGeneration,
				runId: params.runId,
				sessionId: params.sessionId,
				token: params.token
			},
			expectedSessionId: params.sessionId,
			requireWriteSuccess: true,
			target: {
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}
		});
		return bound.transition.kind === "rejected" ? bound.transition.reason : void 0;
	} catch (error) {
		return formatErrorMessage(error);
	}
}
function prepareAgentCommandExecutionIdentity(params) {
	const { opts, prepared } = params;
	const operationalRunInstance = opts.operationalRunInstance ?? createOperationalRunInstanceRef(prepared.runId);
	const admissionFacts = getAgentCommandAdmissionFacts(params.opts.runContext ?? params.opts);
	if (admissionFacts) attachAgentCommandAdmissionFacts(operationalRunInstance, admissionFacts);
	const admissionParams = {
		admission: opts.executionIdentityAdmission,
		agentId: prepared.sessionAgentId,
		cfg: prepared.cfg,
		ingress: params.ingress,
		operationalRunInstance,
		runId: prepared.runId,
		onAdmitted: async (admittedRunContext) => {
			await opts.onAdmittedRunContext?.(admittedRunContext);
			if (opts.mainRestartRecoveryAdmitted !== true || opts.mainRestartRecoveryAttempt === void 0 || !opts.mainRestartRecoveryOwnerLease || !admittedRunContext.executionIdentityToken || !prepared.sessionKey || !prepared.storePath) return;
			const bindingFailure = await bindAgentCommandRecoveryExecutionIdentity({
				attempt: opts.mainRestartRecoveryAttempt,
				cycleId: opts.mainRestartRecoveryOwnerLease.cycleId,
				lifecycleGeneration: params.lifecycleGeneration,
				runId: prepared.runId,
				sessionId: prepared.sessionId,
				sessionKey: prepared.sessionKey,
				storePath: prepared.storePath,
				token: admittedRunContext.executionIdentityToken
			});
			if (bindingFailure) log.warn(`failed to bind restart recovery execution identity: ${bindingFailure}`);
		}
	};
	const spawnFacts = readAgentCommandExecutionIdentitySpawnFacts(opts);
	const preparedAdmission = spawnFacts ? prepareAgentCommandRunAdmissionWithSpawnFacts(admissionParams, spawnFacts) : executionIdentity.prepare(admissionParams);
	return opts.onPostAdmittedRunContext ? withPostAdmissionExecutionOwnerBinding(preparedAdmission, opts.onPostAdmittedRunContext) : preparedAdmission;
}
function sanitizePublicAgentCommandIngressOpts(opts) {
	return withoutAgentCommandExecutionIdentitySpawnFacts({
		...opts,
		senderIsOwner: false,
		mainRestartRecoveryOwnerLease: void 0,
		mainRestartRecoveryAdmitted: void 0,
		mainRestartRecoveryAttempt: void 0,
		executionIdentityAdmission: void 0,
		operationalRunInstance: void 0,
		cronCreatorAuthorityCapability: void 0,
		onAdmittedRunContext: void 0,
		onPostAdmittedRunContext: void 0
	});
}
const executionIdentity = {
	localIngress: LOCAL_CLI_ADMISSION_INGRESS,
	prepare: prepareAgentCommandRunAdmission,
	systemIngress
};
//#endregion
export { attachAgentCommandAdmissionFacts as a, withAgentCommandExecutionIdentitySpawnFacts as i, prepareAgentCommandExecutionIdentity as n, attachAgentCommandRecoveryAdmissionFacts as o, sanitizePublicAgentCommandIngressOpts as r, executionIdentity as t };
