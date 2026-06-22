import React, { useEffect, useState, useCallback } from "react";
import styles from "./ProductsPage.module.css";
import {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
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
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [createError, setCreateError] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    return getProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data?.items || data?.data || []);
      })
      .catch((err) => setError(err?.message || "Ошибка при загрузке товаров"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    Promise.all([getCategories(), getSuppliers()])
      .then(([cats, sups]) => {
        setCategories(Array.isArray(cats) ? cats : cats?.items || cats?.data || []);
        setSuppliers(Array.isArray(sups) ? sups : sups?.items || sups?.data || []);
      })
      .catch(() => {});
  }, []);

  const handleCreateOrUpdate = async (values) => {
    setCreateError(null);
    try {
      if (editingProduct) {
        const id = editingProduct.ProductId ?? editingProduct.id ?? editingProduct._id;
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
    }
  };

  const handleEditClick = async (row) => {
    try {
      const id = row.ProductId ?? row.id ?? row._id;
      const fullProduct = id ? (await getProductById(id)) || row : row;
      setEditingProduct(fullProduct);
      setFormKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setEditingProduct(row);
      setFormKey((k) => k + 1);
    }
  };

  const handleDeleteClick = async (row) => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await deleteProduct(row.ProductId ?? row.id ?? row._id);
      await fetchProducts();
    } catch (err) {
      alert(err?.message || "Ошибка при удалении");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setCreateError(null);
    setFormKey((k) => k + 1);
  };

  const mapToInitial = (r) => ({
    ProductName: r.ProductName || r.name || "",
    CategoryId: r.CategoryId ?? r.category?.id ?? r.categoryId ?? "",
    SupplierId: r.SupplierId ?? r.supplier?.id ?? r.supplierId ?? "",
    Price: r.Price ?? r.price ?? "",
    QuantityInStock: r.QuantityInStock ?? r.stock ?? r.quantity ?? "",
    MinQuantity: r.MinQuantity ?? r.minStock ?? r.min_stock ?? "",
    ExpirationDate: (() => {
      const d = r.ExpirationDate || r.expiryDate || r.expirationDate;
      if (!d) return "";
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return String(d);
        return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
      } catch { return String(d); }
    })(),
  });

  const numFmt = new Intl.NumberFormat("ru-RU");

  const columns = [
    { key: "ProductId", title: "ID" },
    {
      key: "name", title: "Название",
      render: (r) => <strong>{r.ProductName ?? r.name ?? "—"}</strong>,
    },
    {
      key: "category", title: "Категория",
      render: (r) => r.CategoryName ?? r.category?.name ?? r.categoryName ?? "—",
    },
    {
      key: "supplier", title: "Поставщик",
      render: (r) => r.SupplierName ?? r.supplier?.name ?? r.supplierName ?? "—",
    },
    {
      key: "price", title: "Цена",
      render: (r) => formatCurrency(Number(r.Price ?? r.price ?? 0)),
    },
    {
      key: "stock", title: "Остаток",
      render: (r) => numFmt.format(r.QuantityInStock ?? r.stock ?? 0),
    },
    {
      key: "minStock", title: "Мин. остаток",
      render: (r) => numFmt.format(r.MinQuantity ?? r.minStock ?? 0),
    },
    {
      key: "expiry", title: "Срок годности",
      render: (r) => {
        const d = r.ExpirationDate || r.expiryDate;
        if (!d) return "—";
        return formatDate(d).split(",")[0] || formatDate(d);
      },
    },
    {
      key: "status", title: "Статус",
      render: (r) => {
        const status = getStockStatus(r);
        const colors = {
          "Норма": { color: "#0e9f6e", bg: "#f0fdf4" },
          "Низкий остаток": { color: "#ff8800", bg: "#fff8ee" },
          "Критически мало": { color: "#e02424", bg: "#fef2f2" },
          "Просрочен": { color: "#7c3aed", bg: "#f5f3ff" },
        };
        const c = colors[status] || { color: "#64748b", bg: "#f1f5f9" };
        return (
          <span style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            color: c.color,
            background: c.bg,
          }}>
            {status}
          </span>
        );
      },
    },
    {
      key: "actions", title: "Действия",
      render: (r) => (
        <div className={styles.actionButtons}>
          <Button variant="secondary" onClick={() => handleEditClick(r)}>Редактировать</Button>
          <Button variant="danger" onClick={() => handleDeleteClick(r)}>Удалить</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Медицинские товары</h2>
          <p className={styles.subtitle}>Полный список препаратов и продуктов</p>
        </div>
        <Button onClick={fetchProducts} variant="secondary">Обновить</Button>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionHeader}>
          <span className={styles.formSectionTitle}>
            {editingProduct ? "✏️ Редактировать товар" : "➕ Новый товар"}
          </span>
          {editingProduct && (
            <Button variant="secondary" onClick={handleCancelEdit}>Отменить</Button>
          )}
        </div>
        <div className={styles.formSectionBody}>
          {createError && <div style={{ marginBottom: 12 }}><ErrorMessage message={createError} /></div>}
          <ProductForm
            key={formKey}
            onSubmit={handleCreateOrUpdate}
            onCancel={editingProduct ? handleCancelEdit : undefined}
            initialValues={editingProduct ? mapToInitial(editingProduct) : undefined}
            categories={categories}
            suppliers={suppliers}
            submitText={editingProduct ? "Сохранить изменения" : "Создать"}
          />
        </div>
      </div>

      {loading ? (
        <Loader text="Загрузка товаров..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <Table columns={columns} data={products} />
      )}
    </div>
  );
}
