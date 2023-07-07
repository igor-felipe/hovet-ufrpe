import { z } from "zod";
import { user } from "./user";
import { toTaskEither } from "@/core/helpers";

const getOneByIdInput = user.pick({ id: true });
const getOneByIdOutput = user.omit({ password: true });
const getOneByIdInDbInput = getOneByIdOutput;
const getOneByIdInDbOutput = getOneByIdOutput;

export const getOneByIdValidator = toTaskEither(
  user.pick({ id: true }).required(),
);

export type GetOneByIdOutput = z.infer<typeof getOneByIdOutput>;
export type GetOneByIdInput = z.infer<typeof getOneByIdInput>;
export type GetOneByIdInDbInput = z.infer<typeof getOneByIdInDbInput>;
export type GetOneByIdInDbOutput = z.infer<typeof getOneByIdInDbOutput>;
