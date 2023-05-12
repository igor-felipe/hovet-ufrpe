import { flow } from "fp-ts/lib/function";
import { z } from "zod";
import * as M from "./errorMessages";

const isCpf = (cpf: string) => {
  // regex: only 11 digits, not all the same
  if (/^(\d)(?!\1+$)\d{10}$/.test(cpf) === false) return false;

  const calculateDigit = flow(
    (string: string) =>
      string
        .split("")
        .map(Number)
        .reverse()
        .reduce((acc, cur, i) => acc + cur * (i + 2), 0),
    (sum) => sum % 11,
    (remainder) => (remainder < 2 ? 0 : 11 - remainder),
  );

  const first9digits = cpf.substring(0, 9);

  const tenthDigit = calculateDigit(first9digits);
  if (tenthDigit !== Number(cpf[9])) return false;

  const eleventhDigit = calculateDigit(first9digits + tenthDigit);
  if (eleventhDigit !== Number(cpf[10])) return false;

  return true;
};

const passwordValidator = z
  .string()
  .regex(/^\S+$/, M.forbiddenSpaces())
  .min(8, M.incorrectSize(8, 10))
  .regex(/^(?=.*[A-Z])/, M.noUppercaseCharacterFound())
  .regex(/^(?=.*[a-z])/, M.noLowercaseCharacterFound())
  .regex(/^(?=.*[0-9])/, M.noDigitFound())
  .regex(
    /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹])/,
    M.noSpecialSymbolFound(),
  )
  .brand<"Password">();

const idValidator = z.string().min(1).brand<"Id">();
export const emailValidator = z.string().email().brand<"Email">();
const cpfValidator = z
  .string()
  .refine((val) => isCpf(val))
  .brand<"Cpf">();
const nameValidator = z
  .string()
  .regex(/^.{10,100}$/, M.incorrectSize(10, 100))
  .brand<"Name">();

export const userStatus = {
  ACTIVATED: "enable",
  DEACTIVATED: "disabled",
} as const;

export type UserStatus = typeof userStatus;
const statusValidator = z
  .enum([userStatus.ACTIVATED, userStatus.DEACTIVATED])
  .brand<"Status">();

const createdAtValidator = z.date();

export const userValidatorBase = z
  .object({
    id: idValidator,
    password: passwordValidator,
    email: emailValidator,
    cpf: cpfValidator,
    name: nameValidator,
    status: statusValidator,
    createdAt: createdAtValidator,
    currentUserId: idValidator,
  })
  .strict();

export const userValidator = userValidatorBase.brand<"User">();
export type User = z.infer<typeof userValidator>;

export const createUserValidator = userValidatorBase
  .pick({
    password: true,
    email: true,
    cpf: true,
    name: true,
  })
  .brand<"CreateUser">();
export type CreateUser = z.infer<typeof createUserValidator>;

export const updateUserValidator = userValidatorBase
  .omit({
    createdAt: true,
    currentUserId: true,
  })
  .partial()
  .brand<"UpdateUserData">();
export type UpdateUserData = z.infer<typeof updateUserValidator>;

export const singIn = userValidatorBase
  .pick({ email: true, password: true })
  .brand<"SingIn">();
export type SingIn = z.infer<typeof singIn>;

export const userWithoutPassword = userValidatorBase
  .omit({ password: true })
  .brand<"UserWithoutPassword">();
export type UserWithoutPassword = z.infer<typeof userWithoutPassword>;
