import { g as readStringValue } from "./string-coerce-CIXf7egm.js";
import { n as createNonExitingRuntime, t as ExitError } from "./runtime-DtFIMC-W.js";
import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Ga as validateWizardStartParams, Ka as validateWizardStatusParams, Ua as validateWizardCancelParams, Wa as validateWizardNextParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as formatForLog } from "./ws-log-ByzETCsI.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as sanitizeWizardStepForClient, t as WizardSession } from "./session-BhplepEX.js";
import { a as whenAdmittedWizardSessionSettled, r as createAdmittedWizardSession, t as SETUP_ADMISSION_BUSY_MESSAGE } from "./setup-admission-COHvpMqL.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/wizard.ts
const runDefaultSetupWizard = async (...args) => {
	const { runSetupWizard } = await import("./setup-NxdaWiLz.js");
	return runSetupWizard(...args);
};
const runDefaultChannelSetupWizard = async (...args) => {
	const { runChannelsSetupWizard } = await import("./add-wizard-daBI9GDt.js");
	return runChannelsSetupWizard(...args);
};
async function runHostedWizard(run) {
	try {
		await run(createNonExitingRuntime());
	} catch (error) {
		if (error instanceof ExitError && error.code === 0) return;
		throw error;
	}
}
function readWizardStatus(session) {
	return {
		status: session.getStatus(),
		error: session.getError()
	};
}
function sanitizeWizardResultForClient(result) {
	return result.step ? {
		...result,
		step: sanitizeWizardStepForClient(result.step)
	} : result;
}
/** Resolves a live wizard session or sends the public not-found error. */
function findWizardSessionOrRespond(params) {
	const session = params.context.wizardSessions.get(params.sessionId);
	if (!session) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard not found", { details: { code: GatewayErrorDetailCodes.WIZARD_NOT_FOUND } }));
		return null;
	}
	return session;
}
/** Gateway handlers for the interactive setup wizard session lifecycle. */
const wizardHandlers = {
	"wizard.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWizardStartParams, "wizard.start", respond)) return;
		const sessionId = randomUUID();
		const flow = params.flow ?? "setup";
		const createSession = () => flow === "channels" ? new WizardSession((prompter, _signal, wizardSession) => runHostedWizard((runtime) => context.channelWizardRunner({
			channel: readStringValue(params.channel),
			onConfigured: (accounts) => wizardSession.setConfiguredAccounts(accounts),
			beforePersistentEffect: async () => wizardSession.lockCancellation()
		}, runtime, prompter))) : new WizardSession((prompter) => runHostedWizard((runtime) => context.wizardRunner({
			mode: params.mode,
			workspace: readStringValue(params.workspace),
			installDaemon: params.installDaemon
		}, runtime, prompter)));
		const session = await createAdmittedWizardSession(createSession, flow === "setup");
		if (!session) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, SETUP_ADMISSION_BUSY_MESSAGE, { retryable: true }));
			return;
		}
		context.wizardSessions.set(sessionId, session);
		const result = await session.next();
		if (result.done) {
			await whenAdmittedWizardSessionSettled(session);
			context.purgeWizardSession(sessionId);
		}
		respond(true, {
			sessionId,
			...sanitizeWizardResultForClient(result)
		}, void 0);
	},
	"wizard.next": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWizardNextParams, "wizard.next", respond)) return;
		const sessionId = params.sessionId;
		const session = findWizardSessionOrRespond({
			context,
			respond,
			sessionId
		});
		if (!session) return;
		const answer = params.answer;
		if (answer) {
			if (session.getStatus() !== "running") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard not running"));
				return;
			}
			try {
				const validationError = await session.answer(answer.stepId ?? "", answer.value);
				if (validationError) {
					respond(true, {
						...sanitizeWizardResultForClient(await session.next()),
						error: validationError
					}, void 0);
					return;
				}
			} catch (err) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
				return;
			}
		}
		const result = await session.next();
		if (result.done) {
			await whenAdmittedWizardSessionSettled(session);
			context.purgeWizardSession(sessionId);
		}
		respond(true, sanitizeWizardResultForClient(result), void 0);
	},
	"wizard.cancel": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWizardCancelParams, "wizard.cancel", respond)) return;
		const sessionId = params.sessionId;
		const session = findWizardSessionOrRespond({
			context,
			respond,
			sessionId
		});
		if (!session) return;
		const cancelled = session.cancel();
		const status = readWizardStatus(session);
		if (cancelled) {
			const purge = () => context.purgeWizardSession(sessionId);
			whenAdmittedWizardSessionSettled(session).then(purge, purge);
		} else context.purgeWizardSession(sessionId);
		respond(true, status, void 0);
	},
	"wizard.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWizardStatusParams, "wizard.status", respond)) return;
		const sessionId = params.sessionId;
		const session = findWizardSessionOrRespond({
			context,
			respond,
			sessionId
		});
		if (!session) return;
		const status = readWizardStatus(session);
		if (status.status !== "running") await whenAdmittedWizardSessionSettled(session);
		context.purgeWizardSession(sessionId);
		respond(true, status, void 0);
	}
};
//#endregion
export { runDefaultChannelSetupWizard, runDefaultSetupWizard, wizardHandlers };
