import * as user from "@/core/user/use-cases";
import { db } from "@/linkers/db";
import { generateToken } from "@/linkers/jwt";
import { generateHash, verifyHash } from "@/linkers/hash";

export const create: user.CreateUseCase = user.create({
  createInDb: db.user.createInDb,
  generateHash,
});

export const update: user.UpdateUseCase = user.update({
  updateInDb: db.user.updateInDb,
  generateHash,
});

export const login: user.LoginUseCase = user.login({
  loginInDb: db.user.loginInDb,
  generateToken,
  verifyHash,
});

export const getOne: user.GetOneUseCase = user.getOne({
  getOneInDb: db.user.getOneInDb,
});

export const findMany: user.FindManyUseCase = user.findMany({
  findManyInDb: db.user.findManyInDb,
});
