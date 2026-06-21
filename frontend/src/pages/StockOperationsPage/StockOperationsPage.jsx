import React, { useEffect, useState, useCallback } from "react";
import styles from "./StockOperationsPage.module.css";
import {
  getStockOperations,
  createStockOperation,
} from "../../services/stockService";
import { getProducts } from "../../services/productService";
import StockOperationForm from "../../components/StockOperationForm/StockOperationForm";
import Table from "../../components/Table/Table";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

export default function StockOperationsPage() {
  const [operations, setOperations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError(null);
    return Promise.all([getStockOperations(), getProducts()])
      .then(([ops, prods]) => {
        setOperations(Array.isArray(ops) ? ops : ops?.items || ops?.data || []);
        setProducts(
          Array.isArray(prods) ? prods : prods?.items || prods?.data || [],
        );
      })
      .catch((err) => setError(err?.message || "Ошибка при загрузке"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSubmit = async (payload) => {
    setFormLoading(true);
    setFormError(null);
    try {
      await createStockOperation(payload);
      await fetchAll();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      // если недостаточно товара, просто показываем сообщение
      setFormError(msg);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: "OperationId", title: "ID" },
    {
      key: "ProductName",
      title: "Товар",
      render: (r) =>
        r.ProductName ??
        r.product?.name ??
        products.find(
          (p) =>
            (p.id ?? p._id ?? p.ProductId) ===
            (r.productId ?? r.product?.id ?? r.ProductId),
        )?.ProductName ??
        r.productId ??
        "-",
    },
    {
      key: "Username",
      title: "Пользователь",
      render: (r) => r.Username ?? r.user?.name ?? r.userId ?? r.user ?? "1",
    },
    {
      key: "OperationType",
      title: "Тип операции",
      render: (r) =>
        r.OperationType === "income"
          ? "Приход"
          : r.OperationType === "outcome"
            ? "Расход"
            : r.OperationType === "writeoff"
              ? "Списание"
              : r.OperationType,
    },
    {
      key: "Quantity",
      title: "Количество",
      render: (r) => r.Quantity ?? r.quantity ?? r.qty ?? "-",
    },
    {
      key: "OperationDate",
      title: "Дата",
      render: (r) => {
        const dateValue =
          r.OperationDate || r.operationDate || r.createdAt || r.date;
        const date = new Date(dateValue);
        return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
      },
    },
    {
      key: "Comment",
      title: "Комментарий",
      render: (r) => r.Comment ?? r.comment ?? r.note ?? "-",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Складские операции</h2>
      </div>

      <div className={styles.formSection}>
        <h3>Добавить операцию</h3>
        {formError && <ErrorMessage message={formError} />}
        <StockOperationForm
          products={products}
          onSubmit={handleSubmit}
          submitText={formLoading ? "Добавление..." : "Добавить"}
        />
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className={styles.tableWrap}>
          <Table columns={columns} data={operations} />
        </div>
      )}
    </div>
  );
}
