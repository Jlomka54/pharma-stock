import {
  getAllStockOperationsService,
  getStockOperationByIdService,
  createStockOperationService,
  updateStockOperationService,
  deleteStockOperationService,
} from "../services/stock.service.js";

export async function getAllStockOperations(req, res, next) {
  try {
    const operations = await getAllStockOperationsService();

    return res.status(200).json({
      message: "Stock operations received successfully",
      count: operations.length,
      data: operations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStockOperationById(req, res, next) {
  try {
    const { id } = req.params;
    const operation = await getStockOperationByIdService(id);

    if (!operation) {
      return res.status(404).json({ message: "Stock operation not found" });
    }

    return res.status(200).json({
      message: "Stock operation received successfully",
      data: operation,
    });
  } catch (error) {
    next(error);
  }
}

export async function createStockOperation(req, res, next) {
  try {
    const data = req.body;
    const createdOperation = await createStockOperationService(data);

    return res.status(201).json({
      message: "Stock operation created successfully",
      data: createdOperation,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStockOperation(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedOperation = await updateStockOperationService(id, data);

    if (!updatedOperation) {
      return res.status(404).json({ message: "Stock operation not found" });
    }

    return res.status(200).json({
      message: "Stock operation updated successfully",
      data: updatedOperation,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStockOperation(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteStockOperationService(id);

    if (!deleted) {
      return res.status(404).json({ message: "Stock operation not found" });
    }

    return res.status(200).json({
      message: "Stock operation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
