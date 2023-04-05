import { pipe } from "fp-ts/function";
import { register, OutsideRegister } from "./register-user";
import { CreateUser } from "@/core/user/validators";
import { mapAll } from "@/config/tests/fixtures";
import { ValidationError } from "@/helpers/errors";
import * as M from "@/core/user/errorMessages";

const registerOk: OutsideRegister<string> = async (user) => {
  return user.name;
};

const registerFail: OutsideRegister<never> = async () => {
  throw new Error("External error!");
};

const user: CreateUser = {
  name: "Keanu Charles Reeves",
  email: "Keanu@gmail.com",
  cpf: "11144477735",
  password: "Keanu123!",
};

const userWithWrongName: CreateUser = {
  name: "Keanu",
  email: "Keanu@gmail.com",
  cpf: "11144477735",
  password: "Keanu123!",
};

const userWithWrongEmailAndPassword: CreateUser = {
  name: "Keanu Charles Reeves",
  email: "",
  cpf: "11144477735",
  password: "Keanu123",
};

it("Should return a Left if register function throws an error", async () => {
  return pipe(
    user,
    register(registerFail),
    mapAll((error) => expect(error).toEqual(new Error("External error!"))),
  )();
});

it("Should register a user properly", async () => {
  return pipe(
    user,
    register(registerOk),
    mapAll((result) => expect(result).toBe(user.name)),
  )();
});

it("Should not accept a register from a user with invalid name", async () => {
  return pipe(
    userWithWrongName,
    register(registerOk),
    mapAll((error) =>
      expect((error as ValidationError).details).toEqual({
        name: [M.incorrectSize(10, 100).message],
      }),
    ),
  )();
});

it("Should not accept a register from a user with invalid email and/or password", async () => {
  return pipe(
    userWithWrongEmailAndPassword,
    register(registerOk),
    mapAll((error) =>
      expect((error as ValidationError).details).toEqual({
        email: ["Invalid email"],
        password: [M.noSpecialSymbolFound().message],
      }),
    ),
  )();
});
