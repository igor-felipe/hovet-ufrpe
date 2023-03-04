import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { register, OutsideRegister } from "./register";
import { CreateUser } from "@/core/types/user";

const registerOk: OutsideRegister<string> = async (data) =>
  `Usuário ${data.name} cadastrado com sucesso!`;

const data: CreateUser = {
  id: "1",
  name: "Keanu Charles Reeves",
  email: "Keanu@gmail.com",
  cpf: "12345678900",
  password: "Keanu123!",
  currentUserId: "admin1",
};

it("Deve cadastrar um usuário com sucesso", async () =>
  pipe(
    data,
    register(registerOk),
    TE.map((result) =>
      expect(result).toBe(`Usuário ${data.name} cadastrado com sucesso!`),
    ),
  )());
