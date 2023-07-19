import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { rule } from "./rule_validator";

const deleteInput = rule.pick({ userId: true, resourceId: true });
const deleteOutput = rule;
const deleteInDbOutput = rule;
const deleteInDbInput = deleteInput;

export const deleteValidator = toTaskEither(deleteInput);

export type DeleteOutput = z.infer<typeof deleteOutput>;
export type DeleteInput = z.infer<typeof deleteInput>;
export type DeleteInDbInput = z.infer<typeof deleteInDbInput>;
export type DeleteInDbOutput = z.infer<typeof deleteInDbOutput>;
