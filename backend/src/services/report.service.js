import { getPool } from "../config/db.js";

export async function getSummaryReportService() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      (SELECT COUNT(*) FROM Products) AS totalProducts,
      (SELECT COUNT(*) FROM Categories) AS totalCategories,
      (SELECT COUNT(*) FROM Suppliers) AS totalSuppliers,
      (SELECT ISNULL(SUM(QuantityInStock), 0) FROM Products) AS totalStockQuantity,
      (SELECT ISNULL(SUM(Price * QuantityInStock), 0) FROM Products) AS totalWarehouseValue,
      (SELECT COUNT(*) FROM Products WHERE QuantityInStock <= MinQuantity) AS lowStockCount,
      (SELECT COUNT(*) FROM Products WHERE ExpirationDate < GETDATE()) AS expiredProductsCount
  `);

  return result.recordset[0];
}

export async function getLowStockReportService() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      p.ProductId,
      p.ProductName,
      c.CategoryName,
      s.SupplierName,
      p.QuantityInStock,
      p.MinQuantity
    FROM Products p
    LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
    LEFT JOIN Suppliers s ON p.SupplierId = s.SupplierId
    WHERE p.QuantityInStock <= p.MinQuantity
    ORDER BY p.QuantityInStock ASC;
  `);

  return result.recordset;
}

export async function getExpiredProductsReportService() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      p.ProductId,
      p.ProductName,
      c.CategoryName,
      s.SupplierName,
      p.ExpirationDate,
      p.QuantityInStock
    FROM Products p
    LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
    LEFT JOIN Suppliers s ON p.SupplierId = s.SupplierId
    WHERE p.ExpirationDate < GETDATE()
    ORDER BY p.ExpirationDate ASC;
  `);

  return result.recordset;
}
