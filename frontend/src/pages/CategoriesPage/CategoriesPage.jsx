import React, { useEffect, useState, useCallback } from "react";
import styles from "./CategoriesPage.module.css";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
} from "../../services/categoryService";
import Table from "../../components/Table/Table";
import CategoryForm from "../../components/CategoryForm/CategoryForm";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    setError(null);
    return getCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : data?.items || data?.data || []);
      })
      .catch((err) => setError(err?.message || "Ошибка при загрузке категорий"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const mapToInitial = (cat) => ({
    CategoryName: cat.CategoryName || cat.name || "",
    Description: cat.Description || cat.description || "",
  });

  const handleCreateOrUpdate = async (vals) => {
    if (editingCategory) {
      const id = editingCategory.CategoryId ?? editingCategory.id ?? editingCategory._id;
      await updateCategory(id, vals);
      setEditingCategory(null);
    } else {
      await createCategory(vals);
    }
    await fetchCategories();
    setFormKey((k) => k + 1);
  };

  const handleEditClick = (row) => {
    setEditingCategory(row);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormKey((k) => k + 1);
  };

  const handleDeleteClick = async (row) => {
    if (!window.confirm("Удалить категорию?")) return;
    try {
      await deleteCategory(row.CategoryId ?? row.id ?? row._id);
      await fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      if (/foreign|constraint|related/i.test(msg)) {
        alert("Нельзя удалить категорию: она используется в товарах.");
      } else {
        alert(msg);
      }
    }
  };

  const columns = [
    { key: "CategoryId", title: "ID" },
    {
      key: "CategoryName", title: "Название",
      render: (r) => r.CategoryName ?? r.name ?? "—",
    },
    {
      key: "Description", title: "Описание",
      render: (r) => r.Description ?? r.description ?? "—",
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
          <h2 className={styles.title}>Категории</h2>
          <p className={styles.subtitle}>Управление категориями товаров</p>
        </div>
        <Button variant="secondary" onClick={fetchCategories}>Обновить</Button>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionHeader}>
          <span className={styles.formSectionTitle}>
            {editingCategory ? "✏️ Редактировать категорию" : "➕ Новая категория"}
          </span>
          {editingCategory && (
            <Button variant="secondary" onClick={handleCancelEdit}>Отменить редактирование</Button>
          )}
        </div>
        <div className={styles.formSectionBody}>
          <CategoryForm
            key={formKey}
            initialValues={editingCategory ? mapToInitial(editingCategory) : undefined}
            onSubmit={handleCreateOrUpdate}
            onCancel={editingCategory ? handleCancelEdit : undefined}
            submitText={editingCategory ? "Сохранить" : "Создать"}
          />
        </div>
      </div>

      {loading ? (
        <Loader text="Загрузка категорий..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <Table columns={columns} data={categories} />
      )}
    </div>
  );
}
