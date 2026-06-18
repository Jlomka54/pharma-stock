import { getPool, sql } from "../config/db.js";

export async function getAllSuppliersService() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      SupplierId,
      SupplierName,
      Phone,
      Email,
      Address
    FROM Suppliers
    ORDER BY SupplierName;
  `);

  return result.recordset;
}

export async function getSupplierByIdService(id) {
  const pool = await getPool();

  const result = await pool.request().input("id", sql.Int, id).query(`
      SELECT
        SupplierId,
        SupplierName,
        Phone,
        Email,
        Address
      FROM Suppliers
      WHERE SupplierId = @id;
    `);

  return result.recordset[0] || null;
}

export async function createSupplierService(data) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("SupplierName", sql.VarChar(255), data.SupplierName)
    .input("Phone", sql.VarChar(50), data.Phone)
    .input("Email", sql.VarChar(255), data.Email)
    .input("Address", sql.VarChar(sql.MAX), data.Address).query(`
      INSERT INTO Suppliers (SupplierName, Phone, Email, Address)
      OUTPUT inserted.SupplierId,
             inserted.SupplierName,
             inserted.Phone,
             inserted.Email,
             inserted.Address
      VALUES (@SupplierName, @Phone, @Email, @Address);
    `);

  return result.recordset[0];
}

export async function updateSupplierService(id, data) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("SupplierName", sql.VarChar(255), data.SupplierName)
    .input("Phone", sql.VarChar(50), data.Phone)
    .input("Email", sql.VarChar(255), data.Email)
    .input("Address", sql.VarChar(sql.MAX), data.Address).query(`
      UPDATE Suppliers
      SET
        SupplierName = @SupplierName,
        Phone = @Phone,
        Email = @Email,
        Address = @Address
      OUTPUT inserted.SupplierId,
             inserted.SupplierName,
             inserted.Phone,
             inserted.Email,
             inserted.Address
      WHERE SupplierId = @id;
    `);

  return result.recordset[0] || null;
}

export async function deleteSupplierService(id) {
  const pool = await getPool();

  const existing = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`SELECT SupplierId FROM Suppliers WHERE SupplierId = @id;`);

  if (!existing.recordset.length) {
    return false;
  }

  try {
    await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Suppliers WHERE SupplierId = @id;
    `);

    return true;
  } catch (error) {
    if (error.number === 547) {
      throw new Error(
        "Supplier cannot be deleted because it is referenced by one or more products.",
      );
    }

    throw error;
  }
}
