import * as t from "io-ts";
import { withMessage } from "io-ts-types";
import isEmail from "isemail";

type EmailBrand = {
  readonly Email: unique symbol;
};

export const Email = withMessage(
  t.brand(
    t.string,
    (value): value is t.Branded<string, EmailBrand> => isEmail.validate(value),
    "Email",
  ),
  () => "Invalid email",
);
