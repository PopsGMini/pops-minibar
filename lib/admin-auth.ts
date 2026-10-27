import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "pops_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

function config() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return null;
  return { password, secret };
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function adminIsConfigured() {
  return Boolean(config());
}

export function verifyAdminPassword(candidate: string) {
  const value = config();
  return Boolean(value && safeEqual(candidate, value.password));
}

export function createAdminSession() {
  const value = config();
  if (!value) throw new Error("Admin authentication is not configured.");
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `admin.${expires}`;
  return `${payload}.${signature(payload, value.secret)}`;
}

export function verifyAdminSession(token: string | undefined) {
  const value = config();
  if (!value || !token) return false;
  const [role, expiryText, suppliedSignature] = token.split(".");
  const expiry = Number(expiryText);
  if (role !== "admin" || !Number.isFinite(expiry) || expiry < Date.now() / 1000 || !suppliedSignature) return false;
  const payload = `${role}.${expiryText}`;
  return safeEqual(suppliedSignature, signature(payload, value.secret));
}

export async function isAdminRequest() {
  const store = await cookies();
  return verifyAdminSession(store.get(COOKIE_NAME)?.value);
}

export function adminCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}

export function clearAdminCookie() {
  return { ...adminCookie(""), maxAge: 0 };
}
