import {
  register as registerCore,
  Register,
  OutsideRegister,
} from "@/core/user/use-cases/register-user";
import { UserWithoutPassword } from "@/core/user/validators";

export type OutsideRegisterType = OutsideRegister<UserWithoutPassword>;

export const register: Register = (outsideRegister) => (data) =>
  registerCore(outsideRegister)(data);
