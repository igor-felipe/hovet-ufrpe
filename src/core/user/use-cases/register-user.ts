import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { CreateUser, createUserValidator } from "@/core/user/validators";
import { toValidationError } from "@/helpers/toValidationError";
import { ValidationError } from "@/helpers/errors";

export type OutsideRegister<A> = (data: CreateUser) => Promise<A>;

export type Register = <A>(
  outsideRegister: OutsideRegister<A>,
) => (data: CreateUser) => TE.TaskEither<Error | ValidationError, A>;

export const register: Register = (outsideRegister) => (data) => {
  console.log("register");
  return pipe(
    data,
    toValidationError(createUserValidator),
    TE.chain(() => TE.tryCatch(() => outsideRegister(data), E.toError)),
  );
};
