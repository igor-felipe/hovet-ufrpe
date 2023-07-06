import { SignJWT, jwtVerify, errors as jwtErrors } from "jose";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { GenerateToken, Payload, VerifyToken } from "@/core/ports/jwt";
import { AuthError } from "@/core/erros";

declare module "jose" {
  interface JWTPayload extends Payload {}
}

const { JWT_EXPIRATION_TIME, JWT_SECRET } = process.env;
const secret = Buffer.from(JWT_SECRET);

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

const toJwtError = (error: unknown) =>
  error instanceof jwtErrors.JWTExpired && error.name === "JWTExpired"
    ? new AuthError("JWT expired")
    : new AuthError("JWT invalid");

export const verifyToken: VerifyToken = (token: string) =>
  pipe(
    TE.tryCatch(
      () => jwtVerify(token, secret),
      (error) => toJwtError(error),
    ),
    TE.map((result) => result.payload),
  );
