import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/user/validators";
import { DefaultError, ValidationError } from "@/core/errors";
import { LoginInDb } from "@/core/ports/repositories/user_repository";
import { GenerateToken } from "@/core/ports/jwt";
import { VerifyHash } from "@/core/ports/hash";

export type Ctx = {
  loginInDb: LoginInDb;
  generateToken: GenerateToken;
  verifyHash: VerifyHash;
};

export type Login = (
  ctx: Ctx,
) => (data: V.LoginInput) => TE.TaskEither<DefaultError, V.LoginOutput>;

export type LoginUseCase = (
  data: V.LoginInput,
) => TE.TaskEither<Error, V.LoginOutput>;

export const transform = (data: V.LoginInput): Pick<V.User, "email"> => ({
  email: data.email.toLowerCase(),
});

const isUserEnabled = <T extends Partial<V.User>>(
  user: T,
): TE.TaskEither<ValidationError, T> =>
  user.status !== V.userStatus.ENABLED
    ? TE.left(new ValidationError("User is disabled"))
    : TE.right(user);

export const login: Login = (ctx) => (data) => {
  const user = pipe(
    data,
    V.loginValidator,
    TE.map(transform),
    TE.chain(ctx.loginInDb),
    TE.chain(isUserEnabled),
  );

  return pipe(
    user,
    TE.chain((e) => ctx.verifyHash(e.password, data.password)),
    TE.chain(() => user),
    TE.chain((e) => ctx.generateToken({ id: e.id })),
  );
};
