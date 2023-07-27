import { Response, Request, NextFunction } from "express";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { auth, guard, HttpMethod } from "@/adapters/http/middlewares";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  req.path.includes("login")
    ? next()
    : pipe(
        auth(req.header("authorization")),
        TE.map((payload) => {
          req.auth = payload;
          req.body.authId = payload.id;
          return payload;
        }),
        TE.chain((payload) =>
          guard({
            method: req.method as HttpMethod,
            path: req.path,
            rule: payload.rules,
          }),
        ),
        TE.map(() => next()),
        TE.mapLeft((result) => res.status(result.code).json(result.details)),
      )();
