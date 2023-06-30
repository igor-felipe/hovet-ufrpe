import { z } from "zod";
import { user } from "./user";
import { toTaskEither } from "@/core/helpers";

const getOneByIdInput = user.pick({ id: true }).partial();
export const getOneByIdValidator = toTaskEither(
  user.pick({ id: true }).required(),
);
const getOneByIdOutput = user.omit({ password: true });

export type GetOneByIdOutput = z.infer<typeof getOneByIdOutput>;
export type GetOneByIdInput = z.infer<typeof getOneByIdInput>;

export const getOneByIdInDbInput = user.pick({ id: true });
export const getOneByIdInDbOutput = user.omit({ password: true });

export type GetOneByIdInDbInput = z.infer<typeof getOneByIdInDbInput>;
export type GetOneByIdInDbOutput = z.infer<typeof getOneByIdInDbOutput>;
