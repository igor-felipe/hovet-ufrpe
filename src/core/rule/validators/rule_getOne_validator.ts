import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { rule } from "./rule_validator";

const getOneInput = rule.pick({ id: true });
const getOneOutput = rule;
const getOneInDbOutput = getOneOutput;
const getOneInDbInput = getOneInput;

export const getOneValidator = toTaskEither(getOneInput);

export type GetOneOutput = z.infer<typeof getOneOutput>;
export type GetOneInput = z.infer<typeof getOneInput>;
export type GetOneInDbInput = z.infer<typeof getOneInDbInput>;
export type GetOneInDbOutput = z.infer<typeof getOneInDbOutput>;
