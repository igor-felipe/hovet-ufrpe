import * as user from "@/adapters/use-cases/user/register-user-adapter";
import { unsafe } from "@/config/tests/fixtures";
import { userStatus } from "@/core/user/validators";

export const outsideRegister: user.OutsideRegisterUser = async (data) => {
  return unsafe({
    id: "2",
    name: data.name,
    cpf: data.cpf,
    email: data.email,
    status: userStatus.ACTIVATED,
    createdAt: new Date(),
    currentUserId: "1",
  });
};
