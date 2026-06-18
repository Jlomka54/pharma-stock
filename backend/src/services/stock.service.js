import { getPool, sql } from "../config/db.js";

export async function getAllStockOperationsService() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      so.OperationId,
      so.ProductId,
      p.ProductName,
      so.UserId,
      u.Username,
      so.OperationType,
      so.Quantity,
      so.OperationDate,
      so.Comment
    FROM StockOperations so
    LEFT JOIN Products p ON so.ProductId = p.ProductId
    LEFT JOIN Users u ON so.UserId = u.UserId
    ORDER BY so.OperationDate DESC;
  `);

  return result.recordset;
}

export async function getStockOperationByIdService(id) {
  const pool = await getPool();

  const result = await pool.request().input("id", sql.Int, id).query(`
      SELECT
        so.OperationId,
        so.ProductId,
        p.ProductName,
        so.UserId,
        u.Username,
        so.OperationType,
        so.Quantity,
        so.OperationDate,
        so.Comment
      FROM StockOperations so
      LEFT JOIN Products p ON so.ProductId = p.ProductId
      LEFT JOIN Users u ON so.UserId = u.UserId
      WHERE so.OperationId = @id;
    `);

  return result.recordset[0] || null;
}

export async function createStockOperationService(data) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = transaction.request();

    const productResult = await request.input(
      "ProductId",
      sql.Int,
      data.ProductId,
    ).query(`
        SELECT ProductId, QuantityInStock
        FROM Products
        WHERE ProductId = @ProductId;
      `);

    const product = productResult.recordset[0];

    if (!product) {
      throw new Error("Product not found");
    }

    const quantity = Number(data.Quantity);
    if (Number.isNaN(quantity) || quantity < 0) {
      throw new Error("Quantity must be a non-negative number");
    }

    let newQuantityInStock = product.QuantityInStock;

    if (data.OperationType === "income") {
      newQuantityInStock += quantity;
    } else if (
      data.OperationType === "outcome" ||
      data.OperationType === "writeoff"
    ) {
      newQuantityInStock -= quantity;
      if (newQuantityInStock < 0) {
        throw new Error("Insufficient stock for outcome or writeoff operation");
      }
    } else {
      throw new Error("Invalid operation type");
    }

    await request.input("QuantityInStock", sql.Int, newQuantityInStock).query(`
        UPDATE Products
        SET QuantityInStock = @QuantityInStock
        WHERE ProductId = @ProductId;
      `);

    const insertResult = await request
      .input("UserId", sql.Int, data.UserId)
      .input("OperationType", sql.VarChar(50), data.OperationType)
      .input("Quantity", sql.Int, quantity)
      .input(
        "OperationDate",
        sql.DateTime,
        data.OperationDate ? new Date(data.OperationDate) : new Date(),
      )
      .input("Comment", sql.VarChar(sql.MAX), data.Comment).query(`
        INSERT INTO StockOperations (
          ProductId,
          UserId,
          OperationType,
          Quantity,
          OperationDate,
          Comment
        )
        OUTPUT inserted.OperationId,
               inserted.ProductId,
               inserted.UserId,
               inserted.OperationType,
               inserted.Quantity,
               inserted.OperationDate,
               inserted.Comment
        VALUES (
          @ProductId,
          @UserId,
          @OperationType,
          @Quantity,
          @OperationDate,
          @Comment
        );
      `);

    await transaction.commit();

    return insertResult.recordset[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateStockOperationService(id, data) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("ProductId", sql.Int, data.ProductId)
    .input("UserId", sql.Int, data.UserId)
    .input("OperationType", sql.VarChar(50), data.OperationType)
    .input("Quantity", sql.Int, data.Quantity)
    .input(
      "OperationDate",
      sql.DateTime,
      data.OperationDate ? new Date(data.OperationDate) : new Date(),
    )
    .input("Comment", sql.VarChar(sql.MAX), data.Comment).query(`
      UPDATE StockOperations
      SET
        ProductId = @ProductId,
        UserId = @UserId,
        OperationType = @OperationType,
        Quantity = @Quantity,
        OperationDate = @OperationDate,
        Comment = @Comment
      OUTPUT inserted.OperationId,
             inserted.ProductId,
             inserted.UserId,
             inserted.OperationType,
             inserted.Quantity,
             inserted.OperationDate,
             inserted.Comment
      WHERE OperationId = @id;
    `);

  return result.recordset[0] || null;
}

export async function deleteStockOperationService(id) {
  const pool = await getPool();

  const result = await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM StockOperations
      OUTPUT deleted.OperationId
      WHERE OperationId = @id;
    `);

  return !!result.recordset.length;
}
