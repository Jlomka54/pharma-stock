import {
  getAllSuppliersService,
  getSupplierByIdService,
  createSupplierService,
  updateSupplierService,
  deleteSupplierService,
} from "../services/supplier.service.js";

export async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await getAllSuppliersService();

    return res.status(200).json({
      message: "Suppliers received successfully",
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSupplierById(req, res, next) {
  try {
    const { id } = req.params;
    const supplier = await getSupplierByIdService(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({
      message: "Supplier received successfully",
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSupplier(req, res, next) {
  try {
    const data = req.body;
    const createdSupplier = await createSupplierService(data);

    return res.status(201).json({
      message: "Supplier created successfully",
      data: createdSupplier,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedSupplier = await updateSupplierService(id, data);

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteSupplierService(id);

    if (!deleted) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
