import * as user from "@/core/user/use-cases/register-user";
import { UserWithoutPassword } from "@/core/user/validators";

export type OutsideRegisterUser = user.OutsideRegisterUser<UserWithoutPassword>;

export const registerUser: user.RegisterUser = (outsideRegister) => (data) =>
  user.registerUser(outsideRegister)(data);
