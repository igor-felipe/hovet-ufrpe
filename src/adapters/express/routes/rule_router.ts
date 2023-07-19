import { Response, Request, Router } from "express";
import { pipe } from "fp-ts/function";
import * as rule from "@/adapters/use-cases/rule_useCase_adapter";
import { mapAll } from "@/adapters/express/helpers/mapAll";

const ruleRoutes = Router();

ruleRoutes.post("/api/rule", async (req: Request, res: Response) =>
  pipe(req.body, rule.create, mapAll(res))(),
);

ruleRoutes.put("/api/rule", async (req: Request, res: Response) =>
  pipe(req.body, rule.update, mapAll(res))(),
);

ruleRoutes.get("/api/rules", async (req: Request, res: Response) =>
  pipe(req.query, rule.findMany, mapAll(res))(),
);

ruleRoutes.get("/api/rule/:id", async (req: Request, res: Response) =>
  pipe({ id: Number(req.params["id"]) }, rule.getOne, mapAll(res))(),
);

export { ruleRoutes };
