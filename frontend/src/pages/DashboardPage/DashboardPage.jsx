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
    return () => { mounted = false; };
  }, []);

  const s = summary || {};
  const numFmt = new Intl.NumberFormat("ru-RU");

  // Бэкенд возвращает: totalProducts, totalCategories, totalSuppliers,
  // totalStockQuantity, totalWarehouseValue, lowStockCount, expiredProductsCount
  const totalProducts = s.totalProducts ?? s.products ?? s.productsCount ?? null;
  const totalCategories = s.totalCategories ?? s.categories ?? null;
  const totalSuppliers = s.totalSuppliers ?? s.suppliers ?? null;
  const totalUnits = s.totalStockQuantity ?? s.totalUnits ?? s.units ?? null;
  const totalValue = s.totalWarehouseValue ?? s.totalValue ?? s.inventoryValue ?? null;
  const lowStockCount = s.lowStockCount ?? s.lowStock ?? null;
  const expiredCount = s.expiredProductsCount ?? s.expiredCount ?? null;

  const cards = [
    {
      icon: "💊",
      title: "Всего товаров",
      value: totalProducts != null ? numFmt.format(totalProducts) : "—",
      description: "позиций в базе",
    },
    {
      icon: "🗂",
      title: "Категории",
      value: totalCategories != null ? numFmt.format(totalCategories) : "—",
    },
    {
      icon: "🏭",
      title: "Поставщики",
      value: totalSuppliers != null ? numFmt.format(totalSuppliers) : "—",
    },
    {
      icon: "📦",
      title: "Единиц на складе",
      value: totalUnits != null ? numFmt.format(totalUnits) : "—",
    },
    {
      icon: "💰",
      title: "Стоимость склада",
      value: totalValue != null ? formatCurrency(totalValue) : "—",
      description: "суммарная стоимость",
    },
    {
      icon: "⚠️",
      title: "Низкий остаток",
      value: lowStockCount != null ? numFmt.format(lowStockCount) : "—",
      description: "товаров ниже минимума",
    },
    {
      icon: "🚫",
      title: "Просроченные",
      value: expiredCount != null ? numFmt.format(expiredCount) : "—",
      description: "требуют списания",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Обзор склада</h2>
        <p className={styles.subtitle}>Актуальная сводка по состоянию запасов</p>
      </div>

      {loading ? (
        <Loader text="Загрузка данных..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <SummaryCards cards={cards} />
      )}
    </div>
  );
}
