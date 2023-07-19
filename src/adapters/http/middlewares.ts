import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { verifyToken } from "@/container/jwt";
import { AuthError } from "@/core/errors";

export const extractToken = (authHeader: string) =>
  pipe(
    authHeader,
    (e) =>
      e.startsWith("Bearer ")
        ? E.right(e)
        : E.left(new AuthError("invalid Bearer token header")),
    E.map((e) => e.replace("Bearer ", "").replace(/^['"](.*)['"]$/, "$1")),
  );

export const auth = (authHeader: string = "") =>
  pipe(authHeader, extractToken, TE.fromEither, TE.chain(verifyToken));
