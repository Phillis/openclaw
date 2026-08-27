import { u as ChannelSetupAdapter } from "./manifest-registry-BJhqwERh.js";
import { n as ChannelSetupWizardAdapter } from "./setup-wizard-types-CTl56MML.js";
import "./setup-D8bin8hp.js";
//#region extensions/matrix/src/setup-core.d.ts
type MatrixSetupWizardModule = {
  matrixSetupWizard: ChannelSetupWizardAdapter;
};
declare function createMatrixSetupWizardProxy(loadWizardModule: () => Promise<MatrixSetupWizardModule>): ChannelSetupWizardAdapter;
declare const matrixSetupAdapter: ChannelSetupAdapter;
//#endregion
//#region extensions/matrix/src/onboarding.d.ts
declare const matrixOnboardingAdapter: ChannelSetupWizardAdapter;
//#endregion
export { createMatrixSetupWizardProxy as n, matrixSetupAdapter as r, matrixOnboardingAdapter as t };