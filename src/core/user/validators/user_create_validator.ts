import { z } from "zod";
import { user } from "./user_validator";
import { toTaskEither } from "@/core/helpers";

const createInput = user.pick({
  password: true,
  email: true,
  cpf: true,
  name: true,
});

const createOutput = user.omit({ password: true });

const createInDbInput = user.omit({
  id: true,
  createdAt: true,
});

const createInDbOutput = user.omit({
  password: true,
});

export const createValidator = toTaskEither(createInput);

export type CreateInput = z.infer<typeof createInput>;
export type CreateOutput = z.infer<typeof createOutput>;
export type CreateInDbInput = z.infer<typeof createInDbInput>;
export type CreateInDbOutput = z.infer<typeof createInDbOutput>;
