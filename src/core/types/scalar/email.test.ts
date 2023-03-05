import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { Email } from "./email";

it("Should validate the email properly", () => {
  pipe("johndoe.com", Email.decode, E.isRight, (result) =>
    expect(result).toBe(true),
  );
});

it("Should not accept an invalid email", () => {
  pipe(
    "invalid-email",
    Email.decode,
    E.mapLeft((error) => expect(error[0]?.message).toBe("Invalid email")),
  );
});
