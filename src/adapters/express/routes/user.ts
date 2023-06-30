import { Response, Request, Router } from "express";
import { pipe } from "fp-ts/function";
import * as user from "@/adapters/use-cases/user";
import { mapAll } from "@/adapters/express/helpers/mapAll";

const userRoutes = Router();

userRoutes.post("/api/user", async (req: Request, res: Response) =>
  pipe(req.body, user.register, mapAll(res))(),
);

userRoutes.put("/api/user", async (req: Request, res: Response) =>
  pipe(req.body, user.update, mapAll(res))(),
);

userRoutes.post("/api/login", async (req: Request, res: Response) =>
  pipe(req.body, user.login, mapAll(res))(),
);

userRoutes.get("/api/users", async (req: Request, res: Response) =>
  pipe(req.query, user.findMany, mapAll(res))(),
);

userRoutes.get("/api/user/:id", async (req: Request, res: Response) =>
  pipe({ id: req.params.id }, user.getOneById, mapAll(res))(),
);

export { userRoutes };
