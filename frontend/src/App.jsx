import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import SuppliersPage from "./pages/SuppliersPage/SuppliersPage";
import StockOperationsPage from "./pages/StockOperationsPage/StockOperationsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="stock-operations" element={<StockOperationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
