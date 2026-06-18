import express from "express";
import {
  getAllStockOperations,
  getStockOperationById,
  createStockOperation,
  updateStockOperation,
  deleteStockOperation,
} from "../controllers/stock.controller.js";

const router = express.Router();

router.get("/", getAllStockOperations);
router.get("/:id", getStockOperationById);
router.post("/", createStockOperation);
router.put("/:id", updateStockOperation);
router.delete("/:id", deleteStockOperation);

export default router;
