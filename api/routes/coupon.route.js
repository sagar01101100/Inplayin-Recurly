import express from "express";
import { listCoupons, createCoupon, getCoupon, updateCoupon, deactivateCoupon, validateCouponCode } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", listCoupons);
router.get("/:id", getCoupon);
router.post("/", createCoupon);
router.post("/validate-coupon", validateCouponCode);
router.put("/:id", updateCoupon);
router.delete("/:id", deactivateCoupon);

export default router;
