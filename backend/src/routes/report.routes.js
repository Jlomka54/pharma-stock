import express from "express";
import {
  getSummaryReport,
  getLowStockReport,
  getExpiredProductsReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/summary", getSummaryReport);
router.get("/low-stock", getLowStockReport);
router.get("/expired-products", getExpiredProductsReport);

export default router;
