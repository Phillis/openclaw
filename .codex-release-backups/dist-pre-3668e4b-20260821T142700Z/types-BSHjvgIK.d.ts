import { i as ReefPeerIdentity, r as ReefAutonomy, t as ReefChannelConfig } from "./config-schema-DNYIai7Q.js";

//#region extensions/reef/protocol/receipts.d.ts
interface ReceiptBody {
  id: string;
  bodyHash: string;
  auditHead: string;
  status: "accepted" | "rejected";
  category?: string;
}
interface SignedReceipt extends ReceiptBody {
  signature: string;
}
//#endregion
//#region extensions/reef/protocol/envelope.d.ts
type ReplayClaim = "new" | "duplicate" | "mismatch" | "in_flight";
interface CompletedReplay {
  receipt: SignedReceipt;
  body?: MessageBody;
}
interface ReplayStore {
  claim(peer: string, id: string, envelopeHash: string): Promise<ReplayClaim>;
  /** Renews an in-flight claim while slow guard or review work is active. */
  refresh?(peer: string, id: string): Promise<void>;
  complete(peer: string, id: string, receipt: SignedReceipt, body?: MessageBody): Promise<void>;
  consume(peer: string, id: string): Promise<void>;
  release(peer: string, id: string): Promise<void>;
  completed(peer: string, id: string): Promise<CompletedReplay | undefined>;
}
interface MessageBody {
  text: string;
  replyTo?: string;
  thread?: string;
}
interface UnsignedEnvelope {
  v: 1;
  id: string;
  from: string;
  to: string;
  ts: number;
  epk: string;
  n: string;
  ct: string;
}
interface Envelope extends UnsignedEnvelope {
  sig: string;
}
//#endregion
//#region extensions/reef/protocol/guard.d.ts
type GuardDirection = "outbound" | "inbound";
interface GuardRequest {
  direction: GuardDirection;
  source: string;
  destination: string;
  text: string;
  policyVersion: string;
}
interface Verdict {
  decision: "allow" | "deny" | "review";
  category: string;
  reason: string;
  model: string;
  policyVersion: string;
}
interface GuardAdapter {
  readonly providerId: string;
  readonly pinnedModel: string;
  classify(request: GuardRequest): Promise<Verdict>;
}
//#endregion
//#region extensions/reef/src/types.d.ts
interface ReefKeys {
  signing: {
    publicKey: string;
    secretKey: string;
  };
  encryption: {
    publicKey: string;
    secretKey: string;
  };
  auditKey: string;
  replayKey: string;
  keyEpoch: number;
}
interface ReefAccount {
  accountId: "default";
  enabled: boolean;
  configured: boolean;
  config: ReefChannelConfig;
}
interface RelayFriend {
  peer: string;
  status: "pending" | "active" | "blocked" | "reapprove_required";
  initiated_by: string;
  vouching_mutual: string | null;
  ed25519_pub: string;
  x25519_pub: string;
  key_epoch: number;
}
interface InboxEntry {
  seq: number;
  peer: string;
  id: string;
  kind: "message" | "receipt";
  envelope?: Envelope;
  receipt?: SignedReceipt;
  ts: number;
}
interface ReefDependencies {
  fetch?: typeof fetch;
  guard?: GuardAdapter;
  onIngress?: (message: ReefIngressMessage) => Promise<void>;
  onOwnerNotice?: (text: string) => Promise<void>;
}
interface ReefIngressMessage {
  id: string;
  peer: string;
  text: string;
  thread?: string;
  replyTo?: string;
  provenance: string;
  autonomy: ReefAutonomy;
}
interface ReefDeliveryRejection {
  id: string;
  peer: string;
  /** Recipient identity pinned when the rejected envelope was composed. */
  recipient: ReefPeerIdentity;
  /** Normalized text fingerprint pinned when the rejected envelope was composed. */
  textHash?: string;
  category?: string;
  /** Durable pre-notification reservation recovered after an ambiguous restart. */
  reservedNotice?: ReefRejectionNoticeState;
}
interface ReefRejectionNoticeState {
  lastRejectionAt: number;
  lastResendAt?: number;
}
//#endregion
export { ReefIngressMessage as a, RelayFriend as c, Verdict as d, Envelope as f, ReefDependencies as i, GuardAdapter as l, SignedReceipt as m, ReefAccount as n, ReefKeys as o, ReplayStore as p, ReefDeliveryRejection as r, ReefRejectionNoticeState as s, InboxEntry as t, GuardDirection as u };