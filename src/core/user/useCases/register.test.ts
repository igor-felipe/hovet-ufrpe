import { pipe } from "fp-ts/function";
import { registerUser, OutsideRegisterUser } from "./register";
import { CreateUser } from "@/core/user/validators";
import { mapAll } from "@/config/tests/fixtures";
import { ValidationError } from "@/helpers/errors";
import * as M from "@/core/user/errorMessages";

const registerOk: OutsideRegisterUser<string> = async (user) => {
  return user.name;
};

const registerFail: OutsideRegisterUser<never> = async () => {
  throw new Error("External error!");
};

const user: CreateUser = {
  id: "1",
  name: "Keanu Charles Reeves",
  email: "Keanu@gmail.com",
  cpf: "11144477735",
  password: "Keanu123!",
  currentUserId: "Admin",
};

const userWithWrongName: CreateUser = {
  id: "1",
  name: "Keanu",
  email: "Keanu@gmail.com",
  cpf: "11144477735",
  password: "Keanu123!",
  currentUserId: "Admin",
};

const userWithWrongEmailAndPassword: CreateUser = {
  id: "1",
  name: "Keanu Charles Reeves",
  email: "",
  cpf: "11144477735",
  password: "Keanu123",
  currentUserId: "Admin",
};

it("Should register a user properly", async () => {
  return pipe(
    user,
    registerUser(registerOk),
    mapAll((result) => expect(result).toBe(user.name)),
  )();
});

it("Should not accept a register from a user with invalid name", async () => {
  return pipe(
    userWithWrongName,
    registerUser(registerOk),
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
    registerUser(registerOk),
    mapAll((error) =>
      expect((error as ValidationError).details).toEqual({
        email: ["Invalid email"],
        password: [M.noSpecialSymbolFound().message],
      }),
    ),
  )();
});

it("Should return a Left if register function throws an error", async () => {
  return pipe(
    user,
    registerUser(registerFail),
    mapAll((error) => expect(error).toEqual(new Error("External error!"))),
  )();
});
