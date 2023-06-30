import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/user/validators";
import { AuthError, DefaultError, ValidationError } from "@/core/erros";
import { LoginInDb } from "@/core/ports/repositories/user-repository";
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

export const login: Login = (ctx) => (data) => {
  const user = pipe(
    pipe(data, V.loginValidator, TE.map(transform)),
    TE.chain(ctx.loginInDb),
    TE.chain((e) =>
      e.status !== V.userStatus.ENABLED
        ? TE.left(new ValidationError("User is disabled"))
        : TE.right(e),
    ),
  );

  return pipe(
    user,
    TE.chain((e) => ctx.verifyHash(e.password, data.password)),
    TE.chain((e) => (e ? user : TE.left(new AuthError("Wrong password")))),
    TE.chain((e) => ctx.generateToken({ id: e.id })),
  );
};
