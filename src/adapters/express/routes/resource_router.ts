import { Response, Request, Router } from "express";
import { pipe } from "fp-ts/function";
import * as resource from "@/adapters/use-cases/resource_useCase_adapter";
import { mapAll } from "@/adapters/express/helpers/mapAll";

const resourceRoutes = Router();

resourceRoutes.post("/resources", async (req: Request, res: Response) =>
  pipe(req.body, resource.create, mapAll(res))(),
);

resourceRoutes.put("/resources", async (req: Request, res: Response) =>
  pipe(req.body, resource.update, mapAll(res))(),
);

resourceRoutes.get("/resources", async (req: Request, res: Response) =>
  pipe(req.query, resource.findMany, mapAll(res))(),
);

resourceRoutes.get("/resources/:id", async (req: Request, res: Response) =>
  pipe({ id: Number(req.params["id"]) }, resource.getOne, mapAll(res))(),
);

export { resourceRoutes };
