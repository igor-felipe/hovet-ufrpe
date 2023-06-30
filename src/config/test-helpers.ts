import * as TE from "fp-ts/TaskEither";

export const expectShouldBeLeft = <E, T>(taskEither: TE.TaskEither<E, T>) =>
  TE.map((e) => expect(e).toBe("Error: should be Left"))(taskEither);

export const expectShouldBeRight = <E, T>(taskEither: TE.TaskEither<E, T>) =>
  TE.mapLeft((e) => expect(e).toBe("Error: should be Rigth"))(taskEither);
