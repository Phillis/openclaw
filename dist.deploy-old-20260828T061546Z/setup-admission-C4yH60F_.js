import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { p as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-CTDt7IQ1.js";
import { r as SetupTargetLockedError, u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-De038w5n.js";
//#region src/gateway/server-methods/setup-admission.ts
const SETUP_ADMISSION_BUSY_MESSAGE = "OpenClaw setup is already in progress; try again when it finishes.";
let wizardSessionInProgress = false;
const wizardSessionAdmissionSettlements = /* @__PURE__ */ new WeakMap();
var SetupAdmissionBusyError = class extends Error {};
async function runExclusiveSystemAgentSetupActivation(task) {
	let admitted = false;
	const admittedTask = async () => {
		admitted = true;
		return await task();
	};
	try {
		return await withSetupMigrationTargetLock(resolveStateDir(), admittedTask);
	} catch (error) {
		if (!admitted && error instanceof SetupTargetLockedError) throw new SetupAdmissionBusyError(SETUP_ADMISSION_BUSY_MESSAGE);
		throw error;
	}
}
/** Resolves after both the wizard runner and its setup-target admission have settled. */
function whenAdmittedWizardSessionSettled(session) {
	return wizardSessionAdmissionSettlements.get(session) ?? session.whenSettled();
}
async function createAdmittedWizardSession(createSession, lockSetupTarget = true) {
	if (wizardSessionInProgress) return;
	wizardSessionInProgress = true;
	const releaseSession = () => {
		wizardSessionInProgress = false;
	};
	try {
		let admissionSettled;
		const session = lockSetupTarget ? await new Promise((resolve, reject) => {
			admissionSettled = runExclusiveSystemAgentSetupActivation(async () => {
				const createdSession = createSession();
				resolve(createdSession);
				await createdSession.whenSettled();
			});
			admissionSettled.catch(reject);
		}) : createSession();
		const settled = admissionSettled ?? session.whenSettled();
		wizardSessionAdmissionSettlements.set(session, settled);
		const releaseGatewayWork = retainGatewayRootWorkAdmissionContinuation();
		if (releaseGatewayWork) settled.then(releaseGatewayWork, releaseGatewayWork);
		settled.then(releaseSession, releaseSession);
		return session;
	} catch (error) {
		releaseSession();
		if (error instanceof SetupAdmissionBusyError) return;
		throw error;
	}
}
//#endregion
export { whenAdmittedWizardSessionSettled as a, runExclusiveSystemAgentSetupActivation as i, SetupAdmissionBusyError as n, createAdmittedWizardSession as r, SETUP_ADMISSION_BUSY_MESSAGE as t };
