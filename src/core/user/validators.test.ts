import { pipe } from "fp-ts/function";
import { mapAll, toTaskEither } from "@/config/tests/fixtures";
import { userValidator } from "./validators";
import * as M from "./errorMessages";

const invalidInput = ["Invalid input"];
const required = ["Required"];
const invalidEmail = ["Invalid email"];
const stringNumber = ["Expected string, received number"];

const validEmail = "Keanu@gmail.com";
it.each([
  [validEmail, validEmail],
  [undefined, required],
  [1, stringNumber],
  ["", invalidEmail],
  ["invalid@.com", invalidEmail],
])(
  "Should validate email '%s' with errors '%s'",
  async (email: any, expectedErrors) => {
    return pipe(
      { email },
      toTaskEither(userValidator.pick({ email: true })),
      mapAll((errors) =>
        expect(errors).toStrictEqual({
          email: expectedErrors,
        }),
      ),
    )();
  },
);

const validCpf = "11144477735";
it.each([
  [validCpf, validCpf],
  [undefined, required],
  [11144477735, stringNumber],
  ["00000000000", invalidInput],
  ["11144477700", invalidInput],
])(
  "Should validate cpf '%s' with errors '%s'",
  async (cpf: any, expectedErrors) => {
    return pipe(
      { cpf },
      toTaskEither(userValidator.pick({ cpf: true })),
      mapAll((errors) => expect(errors).toStrictEqual({ cpf: expectedErrors })),
    )();
  },
);

const validName = "Keanu Charles Reeves";
it.each([
  [validName, validName],
  [undefined, required],
  [1, stringNumber],
  ["keanu", [M.incorrectSize(10, 100).message]],
])(
  "Should validate name '%s' with errors '%s'",
  async (name: any, expectedErrors) => {
    return pipe(
      { name },
      toTaskEither(userValidator.pick({ name: true })),
      mapAll((errors) =>
        expect(errors).toStrictEqual({ name: expectedErrors }),
      ),
    )();
  },
);

const validPassword = "Aeeee@12";
it.each([
  [validPassword, validPassword],
  [undefined, required],
  [{}, ["Expected string, received object"]],
  ["Aeeee @12", [M.forbiddenSpaces().message]],
  ["aeeee@12", [M.noUppercaseCharacterFound().message]],
  ["AEEEE@12", [M.noLowercaseCharacterFound().message]],
  ["Aeeee@rr", [M.noDigitFound().message]],
  ["Aeeee123", [M.noSpecialSymbolFound().message]],
])(
  "Should validate password '%s' with errors '%s'",
  async (password: any, expectedErrors) => {
    return pipe(
      { password },
      toTaskEither(userValidator.pick({ password: true })),
      mapAll((errors) =>
        expect(errors).toStrictEqual({ password: expectedErrors }),
      ),
    )();
  },
);

it.each([
  [undefined, required],
  [{}, ["Expected 'able' | 'disabled', received object"]],
  ["able", "able"],
  ["disabled", "disabled"],
  [
    "aeeee@12",
    ["Invalid enum value. Expected 'able' | 'disabled', received 'aeeee@12'"],
  ],
])(
  "Should validate status '%s' with errors '%s'",
  async (status: any, expectedErrors) => {
    return pipe(
      { status },
      toTaskEither(userValidator.pick({ status: true })),
      mapAll((errors) =>
        expect(errors).toStrictEqual({ status: expectedErrors }),
      ),
    )();
  },
);
