import { z } from "zod";

export class ValidationError extends Error {
  details: {
    errors: { [x: string]: string[] | undefined };
  };

  constructor(zodError: z.ZodError) {
    super("ValidationError");
    this.details = { errors: zodError.flatten().fieldErrors };
  }
}
