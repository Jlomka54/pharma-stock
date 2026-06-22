import React, { useEffect, useState, useCallback } from "react";
import styles from "./StockOperationsPage.module.css";
import {
  getStockOperations, createStockOperation,
} from "../../services/stockService";
import { getProducts } from "../../services/productService";
import StockOperationForm from "../../components/StockOperationForm/StockOperationForm";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const OP_LABELS = {
  income: { label: "Приход", color: "#0e9f6e", bg: "#f0fdf4" },
  outcome: { label: "Расход", color: "#1a56db", bg: "#ebf0ff" },
  writeoff: { label: "Списание", color: "#e02424", bg: "#fef2f2" },
};

export default function StockOperationsPage() {
  const [operations, setOperations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError(null);
    return Promise.all([getStockOperations(), getProducts()])
      .then(([ops, prods]) => {
        setOperations(Array.isArray(ops) ? ops : ops?.items || ops?.data || []);
        setProducts(Array.isArray(prods) ? prods : prods?.items || prods?.data || []);
      })
      .catch((err) => setError(err?.message || "Ошибка при загрузке"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSubmit = async (payload) => {
    setFormError(null);
    try {
      await createStockOperation(payload);
      await fetchAll();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      setFormError(msg);
      throw err;
    }
  };

  const columns = [
    { key: "OperationId", title: "ID" },
    {
      key: "ProductName", title: "Товар",
      render: (r) => r.ProductName ?? r.product?.name ??
        products.find((p) =>
          (p.ProductId ?? p.id) === (r.ProductId ?? r.productId),
        )?.ProductName ?? "—",
    },
    {
      key: "OperationType", title: "Тип операции",
      render: (r) => {
        const op = OP_LABELS[r.OperationType] || { label: r.OperationType, color: "#64748b", bg: "#f1f5f9" };
        return (
          <span style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            color: op.color,
            background: op.bg,
          }}>
            {op.label}
          </span>
        );
      },
    },
    {
      key: "Quantity", title: "Количество",
      render: (r) => r.Quantity ?? r.quantity ?? "—",
    },
    {
      key: "OperationDate", title: "Дата",
      render: (r) => {
        const d = new Date(r.OperationDate || r.operationDate || r.createdAt);
        return isNaN(d.getTime()) ? "—" : d.toLocaleString("ru-RU");
      },
    },
    {
      key: "Username", title: "Пользователь",
      render: (r) => r.Username ?? r.user?.name ?? `ID: ${r.UserId ?? 1}`,
    },
    {
      key: "Comment", title: "Комментарий",
      render: (r) => r.Comment ?? r.comment ?? "—",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Складские операции</h2>
          <p className={styles.subtitle}>История приходов, расходов и списаний</p>
        </div>
        <Button variant="secondary" onClick={fetchAll}>Обновить</Button>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionHeader}>
          <span className={styles.formSectionTitle}>➕ Добавить операцию</span>
        </div>
        <div className={styles.formSectionBody}>
          {formError && <div style={{ marginBottom: 12 }}><ErrorMessage message={formError} /></div>}
          <StockOperationForm products={products} onSubmit={handleSubmit} submitText="Добавить" />
        </div>
      </div>

      {loading ? (
        <Loader text="Загрузка операций..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <Table columns={columns} data={operations} />
      )}
    </div>
  );
}
