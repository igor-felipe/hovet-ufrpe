import { SignJWT, JWTPayload, jwtVerify } from "jose";

const JWT_SECRET = process.env["JWT_SECRET"] || "";

if (JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 chars long");
}

export async function createJWT(
  payload: JWTPayload,
  expirationTime: string = "10m",
) {
  const secret = Buffer.from(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expirationTime)
    .sign(secret);
}

export function verifyJWT(token: string) {
  const secret = Buffer.from(JWT_SECRET);
  return jwtVerify(token, secret);
}
