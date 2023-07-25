import * as rule from "@/core/rule/use-cases";
import { db } from "@/linkers/db";

export const create: rule.CreateUseCase = rule.create({
  createInDb: db.rule.createInDb,
});

export const update: rule.UpdateUseCase = rule.update({
  updateInDb: db.rule.updateInDb,
});

export const getOne: rule.GetOneUseCase = rule.getOne({
  getOneInDb: db.rule.getOneInDb,
});

export const findMany: rule.FindManyUseCase = rule.findMany({
  findManyInDb: db.rule.findManyInDb,
});
