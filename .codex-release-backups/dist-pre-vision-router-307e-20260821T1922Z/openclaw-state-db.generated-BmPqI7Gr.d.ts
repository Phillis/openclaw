import { Static, Type } from "typebox";
//#region src/audit/execution-identity-admission.d.ts
declare const ExecutionIdentityAdmissionEnvelopeSchema: Type.TObject<{
  envelopeVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
  runtimeInstanceId: Type.TString;
  agentId: Type.TString;
  ingress: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"local-cli">, Type.TLiteral<"gateway-client">, Type.TLiteral<"channel">, Type.TLiteral<"api">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"task">, Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"worker">, Type.TLiteral<"plugin">, Type.TLiteral<"recovery">, Type.TLiteral<"system">]>;
    boundary: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    rawSourceRef: Type.TOptional<Type.TString>;
  }>;
  runtime: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"embedded">, Type.TLiteral<"worker">, Type.TLiteral<"plugin-harness">, Type.TLiteral<"acp">]>;
  }>;
  invoker: Type.TOptional<Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"present">;
    kind: Type.TUnion<[Type.TLiteral<"person">, Type.TLiteral<"agent">, Type.TLiteral<"service">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"system">, Type.TLiteral<"local-account">, Type.TLiteral<"runtime">]>;
    rawPrincipalRef: Type.TString;
    displayLabel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
  }>]>>;
  applicableGrants: Type.TArray<Type.TObject<{
    rawGrantRef: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
  }>>;
  assurance: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"durable-profile">, Type.TLiteral<"trusted-proxy">, Type.TLiteral<"tailscale-whois">, Type.TLiteral<"device-proof">, Type.TLiteral<"channel-admission">, Type.TLiteral<"local-process">, Type.TLiteral<"spawn-lineage">, Type.TLiteral<"worker-admission">, Type.TLiteral<"runtime-binding">, Type.TLiteral<"other">]>;
    rawEvidenceRef: Type.TString;
    strength: Type.TUnion<[Type.TLiteral<"self-asserted">, Type.TLiteral<"boundary-verified">, Type.TLiteral<"cryptographic">]>;
  }>>;
}>;
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionEnvelope = Static<typeof ExecutionIdentityAdmissionEnvelopeSchema>;
type ExecutionIdentityAdmissionFacts = Omit<ExecutionIdentityAdmissionEnvelope, "envelopeVersion" | "contextId" | "executionId" | "createdAt" | "runtimeInstanceId" | "ingress" | "applicableGrants" | "assurance"> & {
  ingress: Omit<ExecutionIdentityAdmissionEnvelope["ingress"], "state"> & {
    state?: ExecutionIdentityAdmissionEnvelope["ingress"]["state"];
  };
  applicableGrants?: ExecutionIdentityAdmissionEnvelope["applicableGrants"];
  assurance?: ExecutionIdentityAdmissionEnvelope["assurance"];
};
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
//#endregion
//#region src/agents/admitted-run-context.d.ts
/** Operational lifecycle correlation. This is never identity or authorization evidence. */
type OperationalRunInstanceRef = Readonly<{
  instanceId: string;
  runId: string;
}>;
/** Exact context carried by one admitted execution and every retry/fallback it owns. */
type AdmittedRunContext = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
}>;
type PreparedAgentRunAdmission = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef; /** Exact post-prepare owner; repeated fallback/retry returns the same object. */
  admit: (runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"], runtimeInstanceId?: string) => Promise<AdmittedRunContext>; /** Idempotently closes the exact delegated approval lease, if admission occurred. */
  close: () => void;
}>;
//#endregion
export { ExecutionIdentityAdmissionToken as i, OperationalRunInstanceRef as n, PreparedAgentRunAdmission as r, AdmittedRunContext as t };