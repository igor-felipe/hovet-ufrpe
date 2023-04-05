import { OutsideRegisterType } from "@/adapters/use-cases/user/register-user-adapter";

export const outsideRegister: OutsideRegisterType = async (data) => {
  return {
    id: "2",
    name: data.name,
    cpf: data.cpf,
    email: data.email,
    status: "able",
    createdAt: new Date(),
    currentUserId: "1",
  };
};
