/* eslint-disable no-nested-ternary */
import { Prisma as P } from "@prisma/client";
import { pipe } from "fp-ts/lib/function";
import { DatabaseError } from "@/core/errors";

type KnownError = P.PrismaClientKnownRequestError;
const isKnownError = (error: unknown): error is KnownError =>
  error instanceof P.PrismaClientKnownRequestError;

const isUnknownError = (
  error: unknown,
): error is P.PrismaClientUnknownRequestError =>
  error instanceof P.PrismaClientUnknownRequestError;

const isValidationError = (
  error: unknown,
): error is P.PrismaClientValidationError =>
  error instanceof P.PrismaClientValidationError;

const P2002 = (error: KnownError) => {
  const entity = error.message.split(".")[1];

  return pipe(
    error.message,
    (m) => m.split("Unique constraint failed on the fields: ")[1] || "",
    (m) => m.replace(/[()``]/g, "").split(","),
    (fields) =>
      fields.length === 1
        ? `${fields[0]} already in use`
        : `${entity} already exists`,
    (details) => new DatabaseError(details),
  );
};

const P2025 = (error: KnownError) => {
  const { meta } = error;

  const message = meta && meta["cause"] ? meta["cause"] : error.message;

  return new DatabaseError(`${message}`);
};

const selectByCode = (error: KnownError) => {
  return {
    P2002: P2002(error),
    P2025: P2025(error),
  }[error.code];
};

const knownErrorHandler = (error: KnownError) => {
  return (
    selectByCode(error) ||
    new DatabaseError("database known error but not that mapped")
  );
};

const unknownErrorHandler = () => new DatabaseError("Unknown error");

const validationErrorHandler = () =>
  new DatabaseError("data validation error in the database");

const fatalError = (error: unknown) => {
  throw error;
};

export const toDatabaseError = (error: unknown) =>
  isKnownError(error)
    ? knownErrorHandler(error)
    : isUnknownError(error)
    ? unknownErrorHandler()
    : isValidationError(error)
    ? validationErrorHandler()
    : fatalError(error);
