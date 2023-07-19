import { z } from "zod";
import { user } from "./user_validator";
import { toTaskEither } from "@/core/helpers";

const getOneInput = user
  .pick({ id: true })
  .or(user.pick({ email: true }))
  .or(user.pick({ cpf: true }));

const getOneOutput = user.omit({ password: true });
const getOneInDbInput = getOneOutput;
const getOneInDbOutput = getOneOutput;

export const getOneValidator = toTaskEither(getOneInput);

export type GetOneOutput = z.infer<typeof getOneOutput>;
export type GetOneInput = z.infer<typeof getOneInput>;
export type GetOneInDbInput = z.infer<typeof getOneInDbInput>;
export type GetOneInDbOutput = z.infer<typeof getOneInDbOutput>;
