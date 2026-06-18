import { getPool, sql } from "../config/db.js";

export async function getAllCategoriesService() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      CategoryId,
      CategoryName,
      Description
    FROM Categories
    ORDER BY CategoryName;
  `);

  return result.recordset;
}

export async function getCategoryByIdService(id) {
  const pool = await getPool();

  const result = await pool.request().input("id", sql.Int, id).query(`
      SELECT
        CategoryId,
        CategoryName,
        Description
      FROM Categories
      WHERE CategoryId = @id;
    `);

  return result.recordset[0] || null;
}

export async function createCategoryService(data) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("CategoryName", sql.VarChar(255), data.CategoryName)
    .input("Description", sql.VarChar(sql.MAX), data.Description).query(`
      INSERT INTO Categories (CategoryName, Description)
      OUTPUT inserted.CategoryId,
             inserted.CategoryName,
             inserted.Description
      VALUES (@CategoryName, @Description);
    `);

  return result.recordset[0];
}

export async function updateCategoryService(id, data) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("CategoryName", sql.VarChar(255), data.CategoryName)
    .input("Description", sql.VarChar(sql.MAX), data.Description).query(`
      UPDATE Categories
      SET
        CategoryName = @CategoryName,
        Description = @Description
      OUTPUT inserted.CategoryId,
             inserted.CategoryName,
             inserted.Description
      WHERE CategoryId = @id;
    `);

  return result.recordset[0] || null;
}

export async function deleteCategoryService(id) {
  const pool = await getPool();

  const existing = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`SELECT CategoryId FROM Categories WHERE CategoryId = @id;`);

  if (!existing.recordset.length) {
    return false;
  }

  try {
    await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Categories WHERE CategoryId = @id;
    `);

    return true;
  } catch (error) {
    if (error.number === 547) {
      throw new Error(
        "Category cannot be deleted because it is referenced by one or more products.",
      );
    }

    throw error;
  }
}
