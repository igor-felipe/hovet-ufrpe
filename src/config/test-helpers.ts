import * as TE from "fp-ts/TaskEither";
import { DefaultError } from "@/core/errors";

export const expectShouldBeLeft = <E, T>(taskEither: TE.TaskEither<E, T>) =>
  TE.map((e) => expect(e).toBe("Error: should be Left"))(taskEither);

export const expectShouldBeRight = <E, T>(taskEither: TE.TaskEither<E, T>) =>
  TE.mapLeft((e) => {
    const r =
      e instanceof DefaultError
        ? e.details
        : e instanceof Error
        ? e.message
        : () => {
            throw e;
          };
    expect(r).toBe("Error: should be Right");
  })(taskEither);
