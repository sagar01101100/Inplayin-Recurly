import express from "express";

import { createAccount, updateAccount, getAccount, listAccounts, deactivateAccount, reactivateAccount, getAccountAcquisition, updateAccountAcquisition, removeAcquisition, getAccountByCode } from "../controllers/account.controller.js";

import { getBillingInfo, updateBillingInfo, removeBillingInfo } from "../controllers/billing.account.controller.js";

const router = express.Router();

router.get("/:id", getAccount);
router.get("/", listAccounts);
router.get("/code/:code", getAccountByCode);
router.post("/",createAccount);
router.put("/:code",updateAccount);
router.delete("/:id", deactivateAccount);
router.get("/:id/reactivate", reactivateAccount);

router.get("/:id/acquisition", getAccountAcquisition);
router.post("/:id/acquisition", updateAccountAcquisition);
router.delete("/:id/acquisition",removeAcquisition);

router.get("/:id/billing_info", getBillingInfo);
router.post("/:id/billing_info", updateBillingInfo);
router.delete("/:id/billing_info",removeBillingInfo);

export default router;
