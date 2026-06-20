import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";
import { getSummary } from "../../services/reportService";
import SummaryCards from "../../components/SummaryCards/SummaryCards";
import formatCurrency from "../../utils/formatCurrency";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getSummary()
      .then((data) => {
        if (!mounted) return;
        setSummary(data);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Ошибка загрузки данных");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const s = summary || {};
  const pick = (...keys) => {
    for (const k of keys) {
      if (s[k] !== undefined && s[k] !== null) return s[k];
    }
    return undefined;
  };

  const totalProducts = pick(
    "totalProducts",
    "products",
    "productsCount",
    "total_products",
    "countProducts",
  );
  const totalCategories = pick(
    "totalCategories",
    "categories",
    "categoriesCount",
    "total_categories",
  );
  const totalSuppliers = pick(
    "totalSuppliers",
    "suppliers",
    "suppliersCount",
    "total_suppliers",
  );
  const totalUnits = pick(
    "totalUnits",
    "units",
    "totalUnitsInStock",
    "unitsCount",
    "total_units",
  );
  const totalValue = pick(
    "totalValue",
    "total_value",
    "inventoryValue",
    "totalInventoryValue",
    "value",
    "stockValue",
  );
  const lowStockCount = pick(
    "lowStock",
    "lowStockCount",
    "productsLowStock",
    "low_stock",
  );
  const expiredCount = pick(
    "expired",
    "expiredCount",
    "expiredProducts",
    "expired_products",
  );

  const numFmt = new Intl.NumberFormat("ru-RU");
  const currFmt = (v) => formatCurrency(v);

  const cards = [
    {
      title: "Всего товаров",
      value: totalProducts != null ? numFmt.format(totalProducts) : "-",
    },
    {
      title: "Категорий",
      value: totalCategories != null ? numFmt.format(totalCategories) : "-",
    },
    {
      title: "Поставщиков",
      value: totalSuppliers != null ? numFmt.format(totalSuppliers) : "-",
    },
    {
      title: "Единиц на складе",
      value: totalUnits != null ? numFmt.format(totalUnits) : "-",
    },
    {
      title: "Общая стоимость склада",
      value: totalValue != null ? currFmt(totalValue) : "-",
    },
    {
      title: "Товары с низким остатком",
      value: lowStockCount != null ? numFmt.format(lowStockCount) : "-",
    },
    {
      title: "Просроченные товары",
      value: expiredCount != null ? numFmt.format(expiredCount) : "-",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <SummaryCards cards={cards} />
      )}
    </div>
  );
}
