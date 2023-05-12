/* eslint-disable @typescript-eslint/no-unused-vars */
import { pipe } from "fp-ts/function";
import { register, OutsideRegister } from "./register-user";
import { CreateUser } from "@/core/user/validators";
import { mapAll, unsafe } from "@/config/tests/fixtures";
import * as M from "@/core/user/errorMessages";
import { ValidationError } from "@/helpers/errors";

const registerOk: OutsideRegister<CreateUser> = async (user) => {
  return user;
};

const registerFail: OutsideRegister<never> = async () => {
  throw new Error("External error!");
};

const user: CreateUser = unsafe({
  name: "Keanu Charles Reeves",
  email: "Keanu@gmail.com",
  cpf: "11144477735",
  password: "Keanu123!",
});

const userWithWrongName: CreateUser = unsafe({
  name: "Keanu",
  email: "Keanu@gmail.com",
  cpf: "11144477735",
  password: "Keanu123!",
});

const userWithWrongEmailAndPassword: CreateUser = unsafe({
  name: "Keanu Charles Reeves",
  email: "",
  cpf: "11144477735",
  password: "Keanu123",
});

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
    mapAll((result) => expect(result).toBe(user)),
  )();
});

// TODO:  remove the assertion operator below. Verify it error is instance of ValidationError.
it("Should not accept a register from a user with invalid name", async () => {
  return pipe(
    userWithWrongName,
    register(registerOk),
    mapAll((error) => {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).details).toEqual({
        name: [M.incorrectSize(10, 100).message],
      });
    }),
  )();
});

it("Should not accept a register from a user with invalid email and/or password", async () => {
  return pipe(
    userWithWrongEmailAndPassword,
    register(registerOk),
    mapAll((error) => {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).details).toEqual({
        email: ["Invalid email"],
        password: [M.noSpecialSymbolFound().message],
      });
    }),
  )();
});
