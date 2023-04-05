import express, { Request, Response } from "express";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import morgan from "morgan";
import { register } from "@/adapters/use-cases/user/register-user-adapter";
import { userRegister } from "@/adapters/ports/db";
import { ValidationError } from "@/helpers/errors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// const { PORT } = process.env;
const PORT = 3333;

function getError(error: Error | ValidationError) {
  return error instanceof ValidationError ? error.details : error.message;
}

app.post("/api/users", async (req: Request, res: Response) => {
  return pipe(
    req.body,
    register(userRegister),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(422).json(getError(error))),
  )();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
