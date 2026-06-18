import {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.service.js";

export async function getAllCategories(req, res, next) {
  try {
    const categories = await getAllCategoriesService();

    return res.status(200).json({
      message: "Categories received successfully",
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category received successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const data = req.body;
    const createdCategory = await createCategoryService(data);

    return res.status(201).json({
      message: "Category created successfully",
      data: createdCategory,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedCategory = await updateCategoryService(id, data);

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteCategoryService(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
