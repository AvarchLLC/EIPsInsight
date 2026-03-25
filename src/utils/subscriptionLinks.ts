import crypto from "crypto";

const TOKEN_VERSION = "v1";

interface SubscriptionIdentity {
  email: string;
  type: string;
  id: string;
  filter: string;
}

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("Missing NEXTAUTH_SECRET for subscription token signing");
  }
  return secret;
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createUnsubscribeToken(identity: SubscriptionIdentity) {
  const payload = Buffer.from(
    JSON.stringify({ ...identity, v: TOKEN_VERSION }),
    "utf8"
  ).toString("base64url");
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
}

export function parseUnsubscribeToken(token: string): SubscriptionIdentity | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expectedSig = signPayload(payload);
  const sigBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expectedSig);
  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (decoded?.v !== TOKEN_VERSION) return null;
    if (!decoded.email || !decoded.type || !decoded.id || !decoded.filter) return null;
    return {
      email: String(decoded.email),
      type: String(decoded.type),
      id: String(decoded.id),
      filter: String(decoded.filter),
    };
  } catch {
    return null;
  }
}

export function buildUnsubscribeUrl(identity: SubscriptionIdentity) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const token = createUnsubscribeToken(identity);
  return `${baseUrl.replace(/\/$/, "")}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}
