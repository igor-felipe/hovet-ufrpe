/* eslint-disable max-classes-per-file */
type DefaultErrorInput = {
  message: string;
  details: unknown;
  code: number;
};

export class DefaultError extends Error {
  code: number;

  details: unknown;

  constructor({ message, details, code }: DefaultErrorInput) {
    super(message);
    this.name = message;
    this.code = code;
    this.details = details;
  }
}

export class InternalServerError extends DefaultError {
  constructor(details: string) {
    super({
      code: 500,
      message: "Internal server error",
      details,
    });
  }
}

export class UnknownError extends DefaultError {
  constructor() {
    super({
      code: 418,
      message: "Unknown error",
      details: "Unknown error",
    });
  }
}

export class NotFoundError extends DefaultError {
  constructor(message: string) {
    super({ code: 404, message, details: message });
  }
}

export class ForbiddenError extends DefaultError {
  constructor(details: string) {
    super({
      code: 403,
      message: "ForbiddenError",
      details,
    });
  }
}

export class AuthError extends DefaultError {
  constructor(details: string) {
    super({ code: 401, message: "AuthError", details });
  }
}

export class ValidationError extends DefaultError {
  constructor(details: unknown) {
    super({
      code: 422,
      message: "Validation error",
      details,
    });
  }
}

export class DatabaseError extends DefaultError {
  constructor(details: unknown) {
    super({
      code: 422,
      message: "Database error",
      details: details || "database unknown error",
    });
  }
}

export class EnvError extends DefaultError {
  constructor(details: unknown) {
    super({
      code: 500,
      message: "EnvError",
      details,
    });
  }
}
