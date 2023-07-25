import { Response, Request, Router } from "express";
import { pipe } from "fp-ts/function";
import * as rule from "@/adapters/use-cases/rule_useCase_adapter";
import { mapAll } from "@/adapters/express/helpers/mapAll";

const ruleRoutes = Router();

ruleRoutes.post("rules", async (req: Request, res: Response) =>
  pipe(req.body, rule.create, mapAll(res))(),
);

ruleRoutes.put("rules", async (req: Request, res: Response) =>
  pipe(req.body, rule.update, mapAll(res))(),
);

ruleRoutes.get("rules", async (req: Request, res: Response) =>
  pipe(req.query, rule.findMany, mapAll(res))(),
);

ruleRoutes.get("rules/:id", async (req: Request, res: Response) =>
  pipe({ id: Number(req.params["id"]) }, rule.getOne, mapAll(res))(),
);

export { ruleRoutes };
