/* eslint-disable no-nested-ternary */
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { verifyToken } from "@/linkers/jwt";
import { AuthError } from "@/core/errors";

export const extractToken = (authHeader: string) =>
  pipe(
    authHeader,
    (e) =>
      e.startsWith("Bearer ")
        ? E.right(e)
        : E.left(new AuthError("invalid Bearer token header")),
    E.map((e) => e.replace("Bearer ", "").replace(/^['"](.*)['"]$/, "$1")),
  );

export const auth = (authHeader: string = "") =>
  pipe(authHeader, extractToken, TE.fromEither, TE.chain(verifyToken));

export type HttpMethod = "POST" | "GET" | "PUT" | "DELETE";

const getPermission = (method: HttpMethod) => {
  return method === "GET"
    ? "r"
    : method === "POST" || method === "PUT"
    ? "w"
    : method === "DELETE"
    ? "d"
    : { method: "" };
};

type RulesObject = Record<"user", "r" | "w" | "d">;

export const transform = (rule: string) =>
  Object.fromEntries(
    rule
      .split(",")
      .flat()
      .map((e) => e.split(":")),
  ) as RulesObject;

const getResource = (path: string) =>
  path.split("/").filter((e) => e !== "")[0];

export const guard = (input: {
  method: HttpMethod;
  path: string;
  rule: string;
}): TE.TaskEither<AuthError, boolean> => {
  const permission = getPermission(input.method);
  const resource = getResource(input.path);
  return pipe(
    input.rule.includes(`${resource}:${permission}`),
    TE.fromPredicate(
      (e) => e,
      () => new AuthError("unauthorized"),
    ),
  );
};
