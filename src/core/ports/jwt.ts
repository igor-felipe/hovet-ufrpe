import * as TE from "fp-ts/TaskEither";
import { AuthError } from "../errors";
import { User } from "../user/validators";

export type Payload = Pick<User, "id">;
export type Token = string;
export type GenerateToken = (
  payload: Payload,
  expirationTime?: string,
) => TE.TaskEither<AuthError, Token>;

export type VerifyToken = (token: string) => TE.TaskEither<AuthError, Payload>;
