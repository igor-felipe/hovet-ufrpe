import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { UpdateUserData, updateUserValidator } from "@/core/user/validators";
import { ValidationError, validation } from "@/helpers/errors";

export type OutsideUpdateUser<A> = (data: UpdateUserData) => Promise<A>;

type UpdateUser = <A>(
  outsideUpdate: OutsideUpdateUser<A>,
) => (data: UpdateUserData) => TE.TaskEither<Error | ValidationError, A>;

export const updateUser: UpdateUser = (outsideUpdate) => (data) => {
  return pipe(
    data,
    validation(updateUserValidator),
    TE.chain(() => TE.tryCatch(() => outsideUpdate(data), E.toError)),
  );
};
