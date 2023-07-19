import { pipe } from "fp-ts/function";
import { z } from "zod";
import * as TE from "fp-ts/TaskEither";
import { EnvError } from "@/core/errors";

const toEnvError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return new EnvError({ error: error.flatten().fieldErrors });
  }
  return new EnvError("Unknown error");
};

type Validator<T> = {
  parse: (data: unknown) => T;
};

export const toTaskEither =
  <T>(validator: Validator<T>) =>
  (data: unknown) =>
    TE.tryCatch(async () => validator.parse(data), toEnvError);

const env = z.object({
  JWT_SECRET: z
    .string()
    .min(32, { message: "JWT_SECRET must be at least 32 chars long" }),

  JWT_EXPIRATION_TIME: z
    .string()
    .nonempty({ message: "JWT_EXPIRATION_TIME not set" }),
  PORT: z.string().nonempty({ message: "PORT not set" }),

  DATABASE_URL: z.string().nonempty({ message: "DATABASE_URL not set" }),
});

export const envValidator = pipe(
  process.env,
  toTaskEither(env),
  TE.mapLeft((error) => {
    throw error;
  }),
);

envValidator();
