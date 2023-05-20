import * as user from "@/adapters/use-cases/user/register-user-adapter";
import * as db from "@/ports/db-in-memory/db";

export const createUserInDB: user.OutsideRegisterUser = (data) => {
  return db.outsideRegister(data);
};
