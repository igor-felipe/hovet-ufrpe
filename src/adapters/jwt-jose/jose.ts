import { SignJWT, jwtVerify } from "jose";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { GenerateToken, Payload, VerifyToken } from "@/core/ports/jwt";
import { AuthError } from "@/core/erros";

declare module "jose" {
  interface JWTPayload extends Payload {}
}

const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "";
const secret = Buffer.from(process.env.JWT_SECRET || "");

export const generateToken: GenerateToken = (
  payload: Payload,
  expirationTime = JWT_EXPIRATION_TIME,
) =>
  pipe(
    TE.tryCatch(
      () =>
        new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime(expirationTime)
          .sign(secret),
      () => new AuthError("JWT signing error"),
    ),
  );

export const verifyToken: VerifyToken = (token: string) =>
  pipe(
    TE.tryCatch(
      () => jwtVerify(token, secret),
      () => new AuthError("JWT verification error"),
    ),
    TE.map((result) => result.payload),
  );
