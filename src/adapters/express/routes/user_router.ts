import { Response, Request, Router } from "express";
import { pipe } from "fp-ts/function";
import * as user from "@/adapters/use-cases/user_useCase_adapter";
import { mapAll } from "@/adapters/express/helpers/mapAll";

const userRoutes = Router();

userRoutes.post("/login", async (req: Request, res: Response) =>
  pipe(req.body, user.login, mapAll(res))(),
);

userRoutes.post("/users", async (req: Request, res: Response) =>
  pipe(req.body, user.create, mapAll(res))(),
);

userRoutes.put("/users", async (req: Request, res: Response) =>
  pipe(req.body, user.update, mapAll(res))(),
);

userRoutes.get("/users", async (req: Request, res: Response) =>
  pipe(req.query, user.findMany, mapAll(res))(),
);

userRoutes.get("/users/:id", async (req: Request, res: Response) =>
  pipe({ id: req.params["id"] || "" }, user.getOne, mapAll(res))(),
);

userRoutes.get("/users/email/:email", async (req: Request, res: Response) =>
  pipe({ email: req.params["email"] || "" }, user.getOne, mapAll(res))(),
);

userRoutes.get("/users/cpf/:cpf", async (req: Request, res: Response) =>
  pipe({ cpf: req.params["cpf"] || "" }, user.getOne, mapAll(res))(),
);

export { userRoutes };
