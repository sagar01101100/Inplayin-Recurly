import express from "express";
import { getInvoicePdf, listInvoices } from "../controllers/invoice.controller.js";

const router = express.Router();

router.get("/", listInvoices);
router.get("/invoice-pdf/:id", getInvoicePdf);

export default router;
