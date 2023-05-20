import express, { Request, Response } from "express";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import morgan from "morgan";
import helmet from "helmet";
import { registerUser } from "@/adapters/use-cases/user/register-user-adapter";
import { createUserInDB } from "@/adapters/ports/db";
import { getErrorDetails } from "@/helpers/errors";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

const { PORT } = process.env;

app.post("/api/user", async (req: Request, res: Response) => {
  return pipe(
    req.body,
    registerUser(createUserInDB),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(422).json(getErrorDetails(error))),
  )();
});

app.put("/api/user", async (req: Request, res: Response) => {
  return pipe(
    req.body,
    registerUser(createUserInDB),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(422).json(getErrorDetails(error))),
  )();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
