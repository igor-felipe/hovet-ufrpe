import * as TE from "fp-ts/TaskEither";
import { AuthError } from "../errors";

export type Payload = { id: string; rules: string };
export type Token = string;
export type GenerateToken = (
  payload: Payload,
  expirationTime?: string,
) => TE.TaskEither<AuthError, Token>;

export type VerifyToken = (token: string) => TE.TaskEither<AuthError, Payload>;
