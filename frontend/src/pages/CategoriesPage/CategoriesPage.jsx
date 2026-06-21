import React, { useEffect, useState, useCallback } from "react";
import styles from "./CategoriesPage.module.css";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
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
        setCategories(
          Array.isArray(data) ? data : data?.items || data?.data || [],
        );
      })
      .catch((err) => setError(err?.message || "Ошибка при загрузке категорий"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const mapToInitial = (cat) => ({
    CategoryName: cat.CategoryName || cat.name || cat.title || "",
    Description: cat.Description || cat.description || cat.desc || "",
  });

  const handleCreateOrUpdate = async (vals) => {
    try {
      if (editingCategory) {
        const id =
          editingCategory.CategoryId ??
          editingCategory.id ??
          editingCategory._id;
        await updateCategory(id, vals);
        setEditingCategory(null);
      } else {
        await createCategory(vals);
      }
      await fetchCategories();
      setFormKey((k) => k + 1);
    } catch (err) {
      throw err;
    }
  };

  const handleEditClick = (row) => {
    setEditingCategory(row);
    setFormKey((k) => k + 1);
  };

  const handleDeleteClick = async (row) => {
    const ok = window.confirm("Удалить категорию?");
    if (!ok) return;
    try {
      await deleteCategory(row.CategoryId ?? row.id ?? row._id);
      await fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      if (
        /foreign/i.test(msg) ||
        /constraint/i.test(msg) ||
        /foreign key/i.test(msg) ||
        /related/i.test(msg)
      ) {
        alert(
          "Нельзя удалить категорию, потому что она используется в товарах.",
        );
      } else {
        alert(msg);
      }
    }
  };

  const columns = [
    { key: "CategoryId", title: "ID" },
    {
      key: "CategoryName",
      title: "Название категории",
      render: (r) => r.CategoryName ?? r.name ?? r.title ?? "-",
    },
    {
      key: "Description",
      title: "Описание",
      render: (r) => r.Description ?? r.description ?? r.desc ?? "-",
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

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Категории</h2>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={fetchCategories}>
            Обновить
          </Button>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          {editingCategory ? "Редактировать категорию" : "Создать категорию"}
        </h3>
        <CategoryForm
          key={formKey}
          initialValues={
            editingCategory ? mapToInitial(editingCategory) : undefined
          }
          onSubmit={async (vals) => {
            await handleCreateOrUpdate(vals);
          }}
          onCancel={() => {
            setEditingCategory(null);
            setFormKey((k) => k + 1);
          }}
          submitText={editingCategory ? "Сохранить" : "Создать"}
        />
      </div>

      {loading ? (
        <Loader text="Загрузка категорий..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className={styles.tableWrap}>
          <Table columns={columns} data={categories} />
        </div>
      )}
    </div>
  );
}
