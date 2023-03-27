import { z } from "zod";

export class ValidationError extends Error {
  details: {
    [x: string]: string[] | undefined;
  };

  constructor(zodError: z.ZodError) {
    super("ValidationError");
    this.details = zodError.flatten().fieldErrors;
  }
}
