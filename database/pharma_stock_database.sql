/*
  Project: PharmaStock — Склад медицинских товаров в аптеке
  Database: PharmaStockDB
  DBMS: Microsoft SQL Server

  Script includes:
  1. Database creation
  2. 5 tables creation
  3. Demo data: 10 records for each table

  Tables:
  - Users
  - Categories
  - Suppliers
  - Products
  - StockOperations
*/

USE master;
GO

/*
  Fixed version:
  This script recreates the demo database from scratch.
  If PharmaStockDB already exists, it will be deleted and created again.
*/
IF DB_ID(N'PharmaStockDB') IS NOT NULL
BEGIN
    ALTER DATABASE [PharmaStockDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [PharmaStockDB];
END;
GO

CREATE DATABASE [PharmaStockDB];
GO

USE [PharmaStockDB];
GO

/* Drop tables if they already exist, in correct order because of foreign keys */
IF OBJECT_ID(N'dbo.StockOperations', N'U') IS NOT NULL DROP TABLE dbo.StockOperations;
IF OBJECT_ID(N'dbo.Products', N'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID(N'dbo.Suppliers', N'U') IS NOT NULL DROP TABLE dbo.Suppliers;
IF OBJECT_ID(N'dbo.Categories', N'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL DROP TABLE dbo.Users;
GO

/* =========================
   1. Users
   ========================= */
CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

/* =========================
   2. Categories
   ========================= */
CREATE TABLE dbo.Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL
);
GO

/* =========================
   3. Suppliers
   ========================= */
CREATE TABLE dbo.Suppliers (
    SupplierId INT IDENTITY(1,1) PRIMARY KEY,
    SupplierName NVARCHAR(120) NOT NULL,
    Phone NVARCHAR(30) NULL,
    Email NVARCHAR(100) NULL,
    Address NVARCHAR(255) NULL
);
GO

/* =========================
   4. Products
   ========================= */
CREATE TABLE dbo.Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(120) NOT NULL,
    CategoryId INT NOT NULL,
    SupplierId INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    QuantityInStock INT NOT NULL,
    MinQuantity INT NOT NULL,
    ExpirationDate DATE NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId)
        REFERENCES dbo.Categories(CategoryId),

    CONSTRAINT FK_Products_Suppliers FOREIGN KEY (SupplierId)
        REFERENCES dbo.Suppliers(SupplierId),

    CONSTRAINT CK_Products_Price CHECK (Price >= 0),
    CONSTRAINT CK_Products_QuantityInStock CHECK (QuantityInStock >= 0),
    CONSTRAINT CK_Products_MinQuantity CHECK (MinQuantity >= 0)
);
GO

/* =========================
   5. StockOperations
   ========================= */
CREATE TABLE dbo.StockOperations (
    OperationId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    UserId INT NOT NULL,
    OperationType NVARCHAR(20) NOT NULL,
    Quantity INT NOT NULL,
    OperationDate DATE NOT NULL,
    Comment NVARCHAR(255) NULL,

    CONSTRAINT FK_StockOperations_Products FOREIGN KEY (ProductId)
        REFERENCES dbo.Products(ProductId),

    CONSTRAINT FK_StockOperations_Users FOREIGN KEY (UserId)
        REFERENCES dbo.Users(UserId),

    CONSTRAINT CK_StockOperations_OperationType CHECK (OperationType IN (N'income', N'outcome', N'writeoff')),
    CONSTRAINT CK_StockOperations_Quantity CHECK (Quantity > 0)
);
GO

/* =========================
   Demo data: Users — 10 records
   Note: PasswordHash values are fake demo hashes.
   In a real application passwords must be hashed by backend with bcrypt.
   ========================= */
INSERT INTO dbo.Users (Username, Email, PasswordHash, CreatedAt)
VALUES
(N'admin_pharma', N'admin@pharmastock.local', N'demo_hash_admin_001', '2026-01-10T09:00:00'),
(N'olena_manager', N'olena.manager@pharmastock.local', N'demo_hash_user_002', '2026-01-11T10:15:00'),
(N'ivan_storekeeper', N'ivan.storekeeper@pharmastock.local', N'demo_hash_user_003', '2026-01-12T11:20:00'),
(N'maria_seller', N'maria.seller@pharmastock.local', N'demo_hash_user_004', '2026-01-13T12:30:00'),
(N'andrii_operator', N'andrii.operator@pharmastock.local', N'demo_hash_user_005', '2026-01-14T13:40:00'),
(N'natalia_pharmacist', N'natalia.pharmacist@pharmastock.local', N'demo_hash_user_006', '2026-01-15T14:50:00'),
(N'dmytro_assistant', N'dmytro.assistant@pharmastock.local', N'demo_hash_user_007', '2026-01-16T15:10:00'),
(N'kateryna_cashier', N'kateryna.cashier@pharmastock.local', N'demo_hash_user_008', '2026-01-17T16:25:00'),
(N'oleksii_stock', N'oleksii.stock@pharmastock.local', N'demo_hash_user_009', '2026-01-18T17:35:00'),
(N'anna_control', N'anna.control@pharmastock.local', N'demo_hash_user_010', '2026-01-19T18:45:00');
GO

/* =========================
   Demo data: Categories — 10 records
   ========================= */
INSERT INTO dbo.Categories (CategoryName, Description)
VALUES
(N'Обезболивающие', N'Средства для уменьшения боли и воспаления'),
(N'Витамины', N'Витаминные комплексы и добавки'),
(N'Антисептики', N'Средства для обработки кожи и поверхностей'),
(N'Медицинские приборы', N'Термометры, тонометры и другие приборы'),
(N'Гигиена', N'Товары для личной гигиены'),
(N'Товары для детей', N'Детские медицинские и гигиенические товары'),
(N'Противопростудные', N'Средства от простуды, кашля и насморка'),
(N'Перевязочные материалы', N'Бинты, пластыри, марля'),
(N'Косметика аптечная', N'Кремы, бальзамы и уходовая косметика'),
(N'Средства для ЖКТ', N'Препараты для желудка и пищеварения');
GO

/* =========================
   Demo data: Suppliers — 10 records
   ========================= */
INSERT INTO dbo.Suppliers (SupplierName, Phone, Email, Address)
VALUES
(N'MedLife Distribution', N'+995 322 11 22 33', N'orders@medlife.local', N'Тбилиси, ул. Медицинская 12'),
(N'PharmaGroup Georgia', N'+995 322 44 55 66', N'sales@pharmagroup.local', N'Тбилиси, пр. Руставели 48'),
(N'HealthMarket Supply', N'+995 431 20 30 40', N'info@healthmarket.local', N'Кутаиси, ул. Центральная 9'),
(N'BioCare Partners', N'+995 422 77 88 99', N'contact@biocare.local', N'Батуми, ул. Морская 21'),
(N'MediPlus Wholesale', N'+995 322 90 80 70', N'wholesale@mediplus.local', N'Тбилиси, ул. Складская 5'),
(N'EuroPharm Import', N'+995 322 18 18 18', N'import@europharm.local', N'Тбилиси, ул. Европейская 3'),
(N'CleanMed Supplier', N'+995 599 12 34 56', N'clean@cleanmed.local', N'Рустави, промышленная зона 2'),
(N'ChildCare Medical', N'+995 599 65 43 21', N'orders@childcare.local', N'Тбилиси, ул. Детская 14'),
(N'GastroHealth LTD', N'+995 322 33 22 11', N'gastro@gastrohealth.local', N'Гори, ул. Аптечная 17'),
(N'DeviceMed Service', N'+995 322 55 66 77', N'devices@devicemed.local', N'Тбилиси, ул. Техники 8');
GO

/* =========================
   Demo data: Products — 10 records
   ========================= */
INSERT INTO dbo.Products (ProductName, CategoryId, SupplierId, Price, QuantityInStock, MinQuantity, ExpirationDate, CreatedAt)
VALUES
(N'Парацетамол 500 мг №20', 1, 1, 6.50, 120, 25, '2027-04-30', '2026-02-01T09:00:00'),
(N'Ибупрофен 200 мг №20', 1, 2, 8.90, 85, 20, '2027-02-28', '2026-02-01T09:10:00'),
(N'Витамин C 1000 мг №30', 2, 3, 18.40, 60, 15, '2026-12-15', '2026-02-01T09:20:00'),
(N'Антисептик для рук 100 мл', 3, 7, 7.25, 150, 30, '2028-01-10', '2026-02-01T09:30:00'),
(N'Термометр электронный', 4, 10, 32.00, 18, 5, '2030-06-01', '2026-02-01T09:40:00'),
(N'Маски медицинские №50', 5, 5, 12.75, 40, 10, '2028-08-20', '2026-02-01T09:50:00'),
(N'Детский сироп от кашля 100 мл', 6, 8, 14.60, 34, 8, '2026-10-05', '2026-02-01T10:00:00'),
(N'Спрей для носа 10 мл', 7, 6, 11.30, 55, 12, '2027-01-18', '2026-02-01T10:10:00'),
(N'Пластырь медицинский №20', 8, 4, 4.80, 200, 50, '2029-03-25', '2026-02-01T10:20:00'),
(N'Средство для желудка №20', 10, 9, 16.90, 22, 10, '2026-09-12', '2026-02-01T10:30:00');
GO

/* =========================
   Demo data: StockOperations — 10 records
   OperationType values:
   - income: приход товара
   - outcome: расход товара
   - writeoff: списание товара
   ========================= */
INSERT INTO dbo.StockOperations (ProductId, UserId, OperationType, Quantity, OperationDate, Comment)
VALUES
(1, 3, N'income', 50, '2026-03-01', N'Поступление от поставщика MedLife Distribution'),
(2, 3, N'income', 40, '2026-03-02', N'Поступление обезболивающих на склад'),
(3, 6, N'outcome', 12, '2026-03-03', N'Продажа витаминного комплекса'),
(4, 4, N'income', 80, '2026-03-04', N'Поступление антисептиков'),
(5, 9, N'outcome', 2, '2026-03-05', N'Продажа электронных термометров'),
(6, 8, N'outcome', 10, '2026-03-06', N'Продажа медицинских масок'),
(7, 6, N'writeoff', 3, '2026-03-07', N'Списание повреждённой упаковки'),
(8, 4, N'income', 25, '2026-03-08', N'Поступление противопростудных средств'),
(9, 7, N'outcome', 35, '2026-03-09', N'Расход пластырей для продажи'),
(10, 2, N'income', 30, '2026-03-10', N'Поставка средств для ЖКТ');
GO

/* =========================
   Useful demo queries for testing
   ========================= */

-- 1. Product list with category and supplier
SELECT
    p.ProductId,
    p.ProductName,
    c.CategoryName,
    s.SupplierName,
    p.Price,
    p.QuantityInStock,
    p.MinQuantity,
    p.ExpirationDate
FROM dbo.Products p
JOIN dbo.Categories c ON p.CategoryId = c.CategoryId
JOIN dbo.Suppliers s ON p.SupplierId = s.SupplierId
ORDER BY p.ProductId;
GO

-- 2. Total warehouse value
SELECT
    SUM(Price * QuantityInStock) AS TotalWarehouseValue
FROM dbo.Products;
GO

-- 3. Low stock products
SELECT
    ProductId,
    ProductName,
    QuantityInStock,
    MinQuantity
FROM dbo.Products
WHERE QuantityInStock <= MinQuantity;
GO

-- 4. Expired products
SELECT
    ProductId,
    ProductName,
    ExpirationDate
FROM dbo.Products
WHERE ExpirationDate < CAST(GETDATE() AS DATE);
GO

-- 5. Stock operation history
SELECT
    so.OperationId,
    p.ProductName,
    u.Username,
    so.OperationType,
    so.Quantity,
    so.OperationDate,
    so.Comment
FROM dbo.StockOperations so
JOIN dbo.Products p ON so.ProductId = p.ProductId
JOIN dbo.Users u ON so.UserId = u.UserId
ORDER BY so.OperationDate DESC;
GO
