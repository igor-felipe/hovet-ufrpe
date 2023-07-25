import { Router } from "express";
import { userRoutes } from "./user_router";
import { ruleRoutes } from "./rule_router";
import { resourceRoutes } from "./resource_router";
import { authMiddleware } from "../middlewares";

const router = Router();

router.use("/api", authMiddleware, userRoutes, ruleRoutes, resourceRoutes);

export { router };
