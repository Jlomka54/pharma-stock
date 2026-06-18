import { getPool, sql } from "../config/db.js";

export async function getAllProductsService() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      p.ProductId,
      p.ProductName,
      c.CategoryName,
      s.SupplierName,
      p.Price,
      p.QuantityInStock,
      p.MinQuantity,
      p.ExpirationDate,
      p.Price * p.QuantityInStock AS TotalValue,
      CASE WHEN p.QuantityInStock <= p.MinQuantity THEN 1 ELSE 0 END AS IsLowStock,
      CASE WHEN p.ExpirationDate < GETDATE() THEN 1 ELSE 0 END AS IsExpired
    FROM Products p
    JOIN Categories c ON p.CategoryId = c.CategoryId
    JOIN Suppliers s ON p.SupplierId = s.SupplierId
    ORDER BY p.ProductName;
  `);

  return result.recordset;
}

export async function getProductByIdService(id) {
  const pool = await getPool();

  const result = await pool.request().input("id", sql.Int, id).query(`
      SELECT
        p.ProductId,
        p.ProductName,
        c.CategoryName,
        s.SupplierName,
        p.Price,
        p.QuantityInStock,
        p.MinQuantity,
        p.ExpirationDate,
        p.CreatedAt
      FROM Products p
      JOIN Categories c ON p.CategoryId = c.CategoryId
      JOIN Suppliers s ON p.SupplierId = s.SupplierId
      WHERE p.ProductId = @id;
    `);

  return result.recordset[0] || null;
}

export async function createProductService(data) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("ProductName", sql.VarChar(255), data.ProductName)
    .input("CategoryId", sql.Int, data.CategoryId)
    .input("SupplierId", sql.Int, data.SupplierId)
    .input("Price", sql.Decimal(18, 2), data.Price)
    .input("QuantityInStock", sql.Int, data.QuantityInStock)
    .input("MinQuantity", sql.Int, data.MinQuantity)
    .input("ExpirationDate", sql.DateTime, data.ExpirationDate)
    .input("CreatedAt", sql.DateTime, data.CreatedAt || new Date()).query(`
      INSERT INTO Products (
        ProductName,
        CategoryId,
        SupplierId,
        Price,
        QuantityInStock,
        MinQuantity,
        ExpirationDate,
        CreatedAt
      )
      OUTPUT inserted.ProductId,
             inserted.ProductName,
             inserted.CategoryId,
             inserted.SupplierId,
             inserted.Price,
             inserted.QuantityInStock,
             inserted.MinQuantity,
             inserted.ExpirationDate,
             inserted.CreatedAt
      VALUES (
        @ProductName,
        @CategoryId,
        @SupplierId,
        @Price,
        @QuantityInStock,
        @MinQuantity,
        @ExpirationDate,
        @CreatedAt
      );
    `);

  return result.recordset[0];
}

export async function updateProductService(id, data) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("ProductName", sql.VarChar(255), data.ProductName)
    .input("CategoryId", sql.Int, data.CategoryId)
    .input("SupplierId", sql.Int, data.SupplierId)
    .input("Price", sql.Decimal(18, 2), data.Price)
    .input("QuantityInStock", sql.Int, data.QuantityInStock)
    .input("MinQuantity", sql.Int, data.MinQuantity)
    .input("ExpirationDate", sql.DateTime, data.ExpirationDate).query(`
      UPDATE Products
      SET
        ProductName = @ProductName,
        CategoryId = @CategoryId,
        SupplierId = @SupplierId,
        Price = @Price,
        QuantityInStock = @QuantityInStock,
        MinQuantity = @MinQuantity,
        ExpirationDate = @ExpirationDate
      OUTPUT inserted.ProductId,
             inserted.ProductName,
             inserted.CategoryId,
             inserted.SupplierId,
             inserted.Price,
             inserted.QuantityInStock,
             inserted.MinQuantity,
             inserted.ExpirationDate,
             inserted.CreatedAt
      WHERE ProductId = @id;
    `);

  return result.recordset[0] || null;
}

export async function deleteProductService(id) {
  const pool = await getPool();

  const existing = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`SELECT ProductId FROM Products WHERE ProductId = @id;`);

  if (!existing.recordset.length) {
    return false;
  }

  await pool
    .request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM Products WHERE ProductId = @id;`);
  return true;
}
