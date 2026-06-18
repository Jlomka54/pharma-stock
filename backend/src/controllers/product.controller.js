import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/product.service.js";

export async function getAllProducts(req, res, next) {
  try {
    const products = await getAllProductsService();

    return res.status(200).json({
      message: "Products received successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product received successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const data = req.body;
    const createdProduct = await createProductService(data);

    return res.status(201).json({
      message: "Product created successfully",
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedProduct = await updateProductService(id, data);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteProductService(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
