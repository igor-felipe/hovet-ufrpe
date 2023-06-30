/* eslint-disable no-nested-ternary */
import { Prisma as P } from "@prisma/client";
import { DatabaseError } from "@/core/erros";

export type PrismaClientKnownRequestError = {
  meta:
    | {
        target: string | undefined;
        cause: string | undefined;
      }
    | undefined;
};

type KnownError = P.PrismaClientKnownRequestError;
type UnknownError = P.PrismaClientUnknownRequestError;
type ValidationError = P.PrismaClientValidationError;

const isKnownError = (error: unknown): error is KnownError =>
  error instanceof P.PrismaClientKnownRequestError;

const isUnknownError = (error: unknown): error is UnknownError =>
  error instanceof P.PrismaClientUnknownRequestError;

const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof P.PrismaClientValidationError;

const P2002 = (error: KnownError) => {
  const { meta } = error;

  const target =
    meta && Array.isArray(meta.target) ? meta.target.join(", ") : undefined;

  const cause =
    meta && Array.isArray(meta.target) ? meta.target.join(", ") : undefined;

  const fields = target || cause;

  return new DatabaseError(`${fields} already in use`);
};
const P2025 = (error: KnownError) => {
  const fields = error.meta;
  return new DatabaseError(`${fields}: NotFoundError`);
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
