import crypto from "node:crypto";

const ADMIN_SESSION_COOKIE = "orion-admin-session";

function getSecret() {
  return process.env.ADMIN_SECRET || "orion-local-admin-secret";
}

export function getAdminCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export function validateAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "orion123";
  return password === expected;
}

export function createSessionToken() {
  return crypto.createHmac("sha256", getSecret()).update("orion-admin").digest("hex");
}

export function isValidSessionToken(token?: string) {
  return token === createSessionToken();
}