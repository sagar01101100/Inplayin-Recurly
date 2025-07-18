import express from "express";
import { listSubscriptions, createSubscription, getSubscription, updateSubscription, terminateSubscription, cancelSubscription, reactivateSubscription, pauseSubscription, resumeSubscription, listSubscriptionsAccountCode, createSubscriptionChange } from "../controllers/subscription.controller.js";

const router = express.Router();

router.get("/", listSubscriptions);
router.post("/account-subscription", listSubscriptionsAccountCode);

router.post("/", createSubscription);
router.get("/:id", getSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", terminateSubscription);
router.put("/:id/cancel", cancelSubscription);
router.put("/:id/reactivate", reactivateSubscription);
router.put("/:id/pause", pauseSubscription);
router.put("/:id/resume", resumeSubscription);

router.post("/:id/change", createSubscriptionChange);

export default router;
