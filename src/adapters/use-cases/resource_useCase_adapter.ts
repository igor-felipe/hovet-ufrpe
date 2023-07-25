import * as resource from "@/core/resource/use-cases";
import { db } from "@/linkers/db";

export const create: resource.CreateUseCase = resource.create({
  createInDb: db.resource.createInDb,
});

export const update: resource.UpdateUseCase = resource.update({
  updateInDb: db.resource.updateInDb,
});

export const getOne: resource.GetOneUseCase = resource.getOne({
  getOneInDb: db.resource.getOneInDb,
});

export const findMany: resource.FindManyUseCase = resource.findMany({
  findManyInDb: db.resource.findManyInDb,
});
