import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { generateToken, verifyToken } from "./jose";
import { expectShouldBeRight } from "@/config/test-helpers";
import { Payload } from "@/core/ports/jwt";

describe("jwt", () => {
  const payload: Payload = {
    id: "123456789",
  };
  it("GenerateToken", () => {
    return pipe(
      payload,
      generateToken,
      expectShouldBeRight,
      TE.map((result) => {
        expect(result).toEqual(expect.any(String));
        return result;
      }),
    )();
  });
  it("generateToken and verifyToken", () => {
    return pipe(
      payload,
      generateToken,
      TE.chain(verifyToken),
      expectShouldBeRight,
      TE.map((result) => {
        return expect(result).toEqual(expect.objectContaining(payload));
      }),
    )();
  });
});
