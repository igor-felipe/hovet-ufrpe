import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { z } from "zod";

type Callback<E, T> = (a: E | T) => unknown;

type MapAll = <E, T>(
  fn: Callback<E, T>,
) => (data: TE.TaskEither<E, T>) => TE.TaskEither<unknown, unknown>;

export const mapAll: MapAll = (fn) => (data) => {
  return pipe(data, TE.map(fn), TE.mapLeft(fn));
};

type P = { [x: string]: string[] | undefined };
export const toTaskEither =
  <T extends z.AnyZodObject>(validador: T) =>
  (data: z.infer<T>): TE.TaskEither<P, z.infer<T>> =>
    pipe(data, validador.safeParse, (result) =>
      result.success
        ? TE.right(result.data)
        : TE.left(result.error.flatten().fieldErrors),
    );

export function unsafe<T>(value: unknown): T {
  return value as T;
}
