import * as user from "@/core/user/use-cases";
import { db } from "@/container/db";
import { generateToken } from "@/container/jwt";
import { generateHash, verifyHash } from "@/container/hash";

export const register: user.RegisterUseCase = user.register({
  registerInDb: db.user.createUser,
  generateHash,
});

export const update: user.UpdateUseCase = user.update({
  updateInDb: db.user.updateUser,
  generateHash,
});

export const login: user.LoginUseCase = user.login({
  loginInDb: db.user.loginInDb,
  generateToken,
  verifyHash,
});

export const getOneById: user.GetOneByIdUseCase = user.getOneById({
  getOneByIdInDb: db.user.getOneByIdInDb,
});

export const findMany: user.FindManyUseCase = user.findMany({
  findManyInDb: db.user.findManyInDb,
});
