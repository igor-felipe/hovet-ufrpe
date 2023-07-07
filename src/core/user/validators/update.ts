import { z } from "zod";
import { user } from "./user";
import { toTaskEither } from "@/core/helpers";

const updateInput = user
  .omit({
    createdAt: true,
  })
  .partial()
  .required({ id: true });

const updateOutput = updateInput.omit({ password: true });
const updateInDbInput = updateInput;
const updateInDbOutput = updateOutput;

export const updateValidator = toTaskEither(updateInput);

export type UpdateInDbInput = z.infer<typeof updateInDbInput>;
export type UpdateInDbOutput = z.infer<typeof updateInDbOutput>;
export type UpdateOutput = z.infer<typeof updateOutput>;
export type UpdateInput = z.infer<typeof updateInput>;
