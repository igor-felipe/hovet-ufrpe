import { Response, Request, NextFunction } from "express";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { auth } from "@/adapters/http/middlewares";
import { Payload } from "@/core/ports/jwt";

export type CustomRequest = Request & {
  auth?: Payload;
};

export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  pipe(
    auth(req.header("authorization")),
    TE.map((payload) => {
      req.auth = payload;
      return next();
    }),
    TE.mapLeft((result) => res.status(result.code).json(result.details)),
  )();
};
