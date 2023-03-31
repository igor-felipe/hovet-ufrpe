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

  const eleventh = calculateDigit(first9digits + tenthDigit);
  if (eleventh !== Number(cpf[10])) return false;

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
  );

const idValidator = z.string().min(1);
export const emailValidator = z.string().email();
const cpfValidator = z.string().refine((val) => isCpf(val));
const nameValidator = z.string().regex(/^.{10,100}$/, M.incorrectSize(10, 100));

export const userStatus = {
  ACTIVATED: "able",
  DEACTIVATED: "disabled",
} as const;

export type UserStatus = typeof userStatus;
const statusValidator = z.enum([userStatus.ACTIVATED, userStatus.DEACTIVATED]);

const createdAtValidator = z.date();

export type User = z.infer<typeof userValidator>;
export const userValidator = z
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

export type CreateUser = z.infer<typeof createUserValidator>;
export const createUserValidator = userValidator.pick({
  password: true,
  email: true,
  cpf: true,
  name: true,
});

export type UpdateUserData = z.infer<typeof updateUserValidator>;
export const updateUserValidator = userValidator
  .omit({
    createdAt: true,
    currentUserId: true,
  })
  .partial();

export type SingIn = z.infer<typeof singIn>;
export const singIn = userValidator.pick({ email: true, password: true });
