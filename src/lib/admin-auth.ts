import { createHmac } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "orion_admin_session";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "orion-admin-session-secret";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "orion123";
}

function getExpectedToken() {
  return createHmac("sha256", getSessionSecret()).update("orion-admin").digest("hex");
}

export function createAdminSessionToken() {
  return getExpectedToken();
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return token === getExpectedToken();
}
