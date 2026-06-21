import React, { useEffect, useState, useCallback } from "react";
import styles from "./ProductsPage.module.css";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import ProductForm from "../../components/ProductForm/ProductForm";
import { getCategories } from "../../services/categoryService";
import { getSuppliers } from "../../services/supplierService";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import getStockStatus from "../../utils/getStockStatus";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    return getProducts()
      .then((data) => {
        setProducts(
          Array.isArray(data) ? data : data?.items || data?.data || [],
        );
      })
      .catch((err) => {
        setError(err?.message || "Ошибка при загрузке списка товаров");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // metadata for product creation
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setLoadingMeta(true);
    Promise.all([getCategories(), getSuppliers()])
      .then(([cats, sups]) => {
        setCategories(
          Array.isArray(cats) ? cats : cats?.items || cats?.data || [],
        );
        setSuppliers(
          Array.isArray(sups) ? sups : sups?.items || sups?.data || [],
        );
      })
      .catch(() => {})
      .finally(() => setLoadingMeta(false));
  }, []);

  const handleCreate = async (values) => {
    setCreating(true);
    setCreateError(null);
    try {
      if (editingProduct) {
        const id =
          editingProduct.ProductId ?? editingProduct.id ?? editingProduct._id;
        await updateProduct(id, values);
        setEditingProduct(null);
      } else {
        await createProduct(values);
      }
      await fetchProducts();
      setFormKey((k) => k + 1);
    } catch (err) {
      setCreateError(err?.message || "Ошибка при сохранении товара");
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const numFmt = new Intl.NumberFormat("ru-RU");

  const boolIsTrue = (val) => val === 1 || val === "1" || val === true;

  const columns = [
    { key: "ProductId", title: "ID" },
    {
      key: "name",
      title: "Название",
      render: (r) => r.ProductName ?? r.name ?? r.title ?? r.productName ?? "-",
    },
    {
      key: "category",
      title: "Категория",
      render: (r) =>
        r.CategoryName ??
        r.category?.name ??
        r.categoryName ??
        r.category ??
        "-",
    },
    {
      key: "supplier",
      title: "Поставщик",
      render: (r) =>
        r.SupplierName ??
        r.supplier?.name ??
        r.supplierName ??
        r.supplier ??
        "-",
    },
    {
      key: "price",
      title: "Цена",
      render: (r) => {
        const p = Number(r.Price ?? r.price ?? r.unitPrice ?? r.cost ?? 0) || 0;
        return formatCurrency(p);
      },
    },
    {
      key: "stock",
      title: "Остаток",
      render: (r) =>
        numFmt.format(r.QuantityInStock ?? r.stock ?? r.quantity ?? r.qty ?? 0),
    },
    {
      key: "minStock",
      title: "Минимальный остаток",
      render: (r) =>
        numFmt.format(
          r.MinQuantity ?? r.minStock ?? r.min_stock ?? r.reorderLevel ?? 0,
        ),
    },
    {
      key: "expiry",
      title: "Срок годности",
      render: (r) => {
        const date =
          r.ExpirationDate ||
          r.expiryDate ||
          r.expirationDate ||
          r.expiresAt ||
          r.expiry ||
          r.expireDate;
        if (!date) return "-";
        return formatDate(date).split(",")[0] || formatDate(date);
      },
    },
    {
      key: "stockValue",
      title: "Стоимость на складе",
      render: (r) => {
        const total =
          Number(r.TotalValue ?? r.stockValue ?? 0) ||
          (Number(r.Price ?? r.price ?? 0) || 0) *
            (Number(r.QuantityInStock ?? r.stock ?? r.quantity ?? 0) || 0);
        return formatCurrency(total);
      },
    },
    {
      key: "status",
      title: "Статус",
      render: (r) => getStockStatus(r),
    },
    {
      key: "actions",
      title: "Действия",
      render: (r) => (
        <div className={styles.actionButtons}>
          <Button variant="secondary" onClick={() => handleEditClick(r)}>
            Редактировать
          </Button>
          <Button variant="danger" onClick={() => handleDeleteClick(r)}>
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  // edit / delete handlers
  const [editingProduct, setEditingProduct] = useState(null);

  const mapToInitial = (r) => ({
    ProductId: r.ProductId ?? r.id ?? r._id ?? "",
    ProductName: r.ProductName || r.name || r.title || r.productName || "",
    CategoryId:
      r.CategoryId ??
      r.category?.id ??
      r.categoryId ??
      r.category ??
      r.categoryName ??
      "",
    SupplierId:
      r.SupplierId ??
      r.supplier?.id ??
      r.supplierId ??
      r.supplier ??
      r.supplierName ??
      "",
    Price: r.Price ?? r.price ?? r.unitPrice ?? r.cost ?? "",
    QuantityInStock: r.QuantityInStock ?? r.stock ?? r.quantity ?? r.qty ?? "",
    MinQuantity:
      r.MinQuantity ?? r.minStock ?? r.min_stock ?? r.reorderLevel ?? "",
    ExpirationDate: (() => {
      const date =
        r.ExpirationDate ||
        r.expiryDate ||
        r.expirationDate ||
        r.expiresAt ||
        r.expiry ||
        r.expireDate;
      if (!date) return "";
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        // format as yyyy-mm-dd for input
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      } catch {
        return String(date);
      }
    })(),
  });

  const handleEditClick = async (row) => {
    try {
      const id = row.ProductId ?? row.id ?? row._id;
      if (!id) {
        setEditingProduct(row);
      } else {
        const fullProduct = await getProductById(id);
        setEditingProduct(fullProduct || row);
      }
      setFormKey((k) => k + 1);
    } catch (err) {
      alert(err?.message || "Ошибка при загрузке товара");
    }
  };

  const handleDeleteClick = async (row) => {
    const ok = window.confirm("Удалить товар?");
    if (!ok) return;
    try {
      await deleteProduct(row.ProductId ?? row.id ?? row._id);
      await fetchProducts();
    } catch (err) {
      alert(err?.message || "Ошибка при удалении");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Медицинские товары</h2>
        <div className={styles.actions}>
          <Button onClick={fetchProducts} variant="secondary">
            Обновить
          </Button>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Создать товар</h3>
        {createError && <div className={styles.error}>{createError}</div>}
        <ProductForm
          key={formKey}
          onSubmit={handleCreate}
          onCancel={() => {
            setEditingProduct(null);
            setFormKey((k) => k + 1);
          }}
          initialValues={
            editingProduct ? mapToInitial(editingProduct) : undefined
          }
          categories={categories}
          suppliers={suppliers}
          submitText={
            editingProduct
              ? creating
                ? "Сохранение..."
                : "Сохранить изменения"
              : creating
                ? "Создание..."
                : "Создать"
          }
        />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className={styles.tableWrap}>
          <Table columns={columns} data={products} />
        </div>
      )}
    </div>
  );
}
