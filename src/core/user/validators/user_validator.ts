import { flow } from "fp-ts/lib/function";
import { z } from "zod";

export const userStatus = {
  ENABLED: "enable",
  DISABLED: "disabled",
} as const;

const M = {
  incorrectSize: (min: number, max: number) => ({
    message: `must be ${min} to ${max} Characters Long.`,
  }),
  noUppercaseCharacterFound: () => ({
    message: `must have at least one Uppercase Character.`,
  }),
  noLowercaseCharacterFound: () => ({
    message: `must have at least one Lowercase Character.`,
  }),
  noDigitFound: () => ({
    message: `must have at least one Digit.`,
  }),
  noSpecialSymbolFound: () => ({
    message: `must have at least one Special Symbol.`,
  }),
  forbiddenSpaces: () => ({
    message: `cannot contain spaces.`,
  }),
  noEmpty: () => ({
    message: `cannot be empty`,
  }),
};

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
  );

export const user = z
  .object({
    id: z.string().min(4, M.noEmpty()),
    password: passwordValidator,
    email: z.string().email(),
    cpf: z.string().refine((val) => isCpf(val)),
    name: z.string().regex(/^.{10,100}$/, M.incorrectSize(10, 100)),
    status: z.enum([userStatus.ENABLED, userStatus.DISABLED]),
    createdAt: z.date(),
  })
  .strict();

export type User = z.infer<typeof user>;
