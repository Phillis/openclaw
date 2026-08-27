import { Static, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/approvals.d.ts
/**
 * Owner-declared blast-radius facts for a pending approval. Variants are
 * named schemas so native protocol generators emit the discriminated union.
 */
declare const ApprovalScopeSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"message-send">;
  target: Type.TString;
  recipientCount: Type.TInteger;
  recipients: Type.TOptional<Type.TArray<Type.TString>>;
  audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"payment">;
  amount: Type.TString;
  currency: Type.TString;
  target: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"external-post">;
  target: Type.TString;
  visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
}>]>;
/** Reviewer-safe presentation discriminated by the approval owner. */
declare const ApprovalPresentationSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  detail: Type.TOptional<Type.TString>;
  severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"system-agent">;
  title: Type.TString;
  description: Type.TString;
  proposalHash: Type.TString;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
}>]>;
/** Authoritative pending approval set returned when a session stream subscribes. */
declare const SessionApprovalReplaySchema: Type.TObject<{
  sessionKey: Type.TString;
  updatedAtMs: Type.TInteger;
  approvals: Type.TArray<Type.TObject<{
    status: Type.TLiteral<"pending">;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>>;
  truncated: Type.TBoolean;
}>;
type ApprovalPresentation = Static<typeof ApprovalPresentationSchema>;
type SessionApprovalReplay = Static<typeof SessionApprovalReplaySchema>;
//#endregion
export { ApprovalScopeSchema as n, SessionApprovalReplay as r, ApprovalPresentation as t };