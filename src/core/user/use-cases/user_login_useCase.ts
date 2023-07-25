import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as R from "ramda";
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

const isUserEnabled = (
  user: Partial<V.User>,
): TE.TaskEither<ValidationError, Partial<V.User>> =>
  user.status !== V.userStatus.ENABLED
    ? TE.left(new ValidationError("User is disabled"))
    : TE.right(user);

const formatRules = (
  rules: { resourceName: string; permission: string }[],
): string => R.map((r) => `${r.resourceName}:${r.permission}`, rules).join(",");

export const login: Login = (ctx: Ctx) => (data: V.LoginInput) =>
  pipe(
    data,
    V.loginValidator,
    TE.map(transform),
    TE.chain(ctx.loginInDb),
    TE.chain(({ user, rules }) =>
      pipe(
        isUserEnabled(user),
        TE.chain(() => ctx.verifyHash(user.password, data.password)),
        TE.map(() => ({ id: user.id, rules: formatRules(rules) })),
        TE.chain(ctx.generateToken),
      ),
    ),
  );
