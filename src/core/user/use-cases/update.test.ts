import { pipe } from "fp-ts/function";
import { UpdateUserData } from "@/core/user/validators";
import { OutsideUpdateUser, updateUser } from "@/core/user/use-cases/update";
import { mapAll } from "@/config/tests/fixtures";
import { ValidationError } from "@/helpers/errors";
import * as M from "@/core/user/errorMessages";

const updateOk: OutsideUpdateUser<UpdateUserData> = async (user) => {
  return user;
};

const updateFail: OutsideUpdateUser<never> = async () => {
  throw new Error("External error!");
};

const user: UpdateUserData = {
  name: "Keanu Charles Reeves",
  email: "Keanu@gmail.com",
  password: "Keanu123!",
};

const userWithWrongName: UpdateUserData = {
  name: "Keanu",
  email: "Keanu@gmail.com",
  cpf: "11144477735",
  password: "Keanu123!",
};

const userWithWrongEmailAndPassword: UpdateUserData = {
  name: "Keanu Charles Reeves",
  email: "",
  cpf: "11144477735",
  password: "Keanu123",
};

it("Should return a Left if register function throws an error", async () => {
  return pipe(
    user,
    updateUser(updateFail),
    mapAll((error) => expect(error).toEqual(new Error("External error!"))),
  )();
});

it("Should register a user properly", async () => {
  return pipe(
    user,
    updateUser(updateOk),
    mapAll((result) => expect(result).toBe(user)),
  )();
});

it("Should not accept a register from a user with invalid name", async () => {
  return pipe(
    userWithWrongName,
    updateUser(updateOk),
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
    updateUser(updateOk),
    mapAll((error) =>
      expect((error as ValidationError).details).toEqual({
        email: ["Invalid email"],
        password: [M.noSpecialSymbolFound().message],
      }),
    ),
  )();
});
