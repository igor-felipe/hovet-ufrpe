import { z } from "zod";
import { user } from "./user";
import { toTaskEither } from "@/core/helpers";

const registerInput = user.pick({
  password: true,
  email: true,
  cpf: true,
  name: true,
});
const registerOutput = user.omit({ password: true });
const registerInDbInput = user.omit({
  id: true,
  createdAt: true,
});
const registerInDbOutput = user.omit({
  password: true,
});

export const registerValidator = toTaskEither(registerInput);

export type RegisterInput = z.infer<typeof registerInput>;
export type RegisterOutput = z.infer<typeof registerOutput>;
export type RegisterInDbInput = z.infer<typeof registerInDbInput>;
export type RegisterInDbOutput = z.infer<typeof registerInDbOutput>;
