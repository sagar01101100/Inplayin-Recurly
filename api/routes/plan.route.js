import express from "express";
import { listPlans, createPlan, getPlan, updatePlan, deletePlan } from "../controllers/plan.controller.js";

const router = express.Router();

router.get("/", listPlans);
router.get("/:id", getPlan);
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export default router;
