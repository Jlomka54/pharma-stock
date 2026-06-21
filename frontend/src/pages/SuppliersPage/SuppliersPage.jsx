import React, { useEffect, useState, useCallback } from "react";
import styles from "./SuppliersPage.module.css";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/supplierService";
import Table from "../../components/Table/Table";
import SupplierForm from "../../components/SupplierForm/SupplierForm";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const fetchSuppliers = useCallback(() => {
    setLoading(true);
    setError(null);
    return getSuppliers()
      .then((data) =>
        setSuppliers(
          Array.isArray(data) ? data : data?.items || data?.data || [],
        ),
      )
      .catch((err) =>
        setError(err?.message || "Ошибка при загрузке поставщиков"),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const mapToInitial = (s) => ({
    SupplierName: s.SupplierName || s.name || s.title || "",
    Phone: s.Phone || s.phone || s.tel || "",
    Email: s.Email || s.email || "",
    Address: s.Address || s.address || "",
  });

  const handleCreateOrUpdate = async (vals) => {
    try {
      if (editingSupplier) {
        const id =
          editingSupplier.SupplierId ??
          editingSupplier.id ??
          editingSupplier._id;
        await updateSupplier(id, vals);
        setEditingSupplier(null);
      } else {
        await createSupplier(vals);
      }
      await fetchSuppliers();
      setFormKey((k) => k + 1);
    } catch (err) {
      throw err;
    }
  };

  const handleEditClick = (row) => {
    setEditingSupplier(row);
    setFormKey((k) => k + 1);
  };

  const handleDeleteClick = async (row) => {
    const ok = window.confirm("Удалить поставщика?");
    if (!ok) return;
    try {
      await deleteSupplier(row.SupplierId ?? row.id ?? row._id);
      await fetchSuppliers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      if (
        /foreign/i.test(msg) ||
        /constraint/i.test(msg) ||
        /foreign key/i.test(msg) ||
        /related/i.test(msg)
      ) {
        alert(
          "Нельзя удалить поставщика, потому что он используется в товарах.",
        );
      } else {
        alert(msg);
      }
    }
  };

  const columns = [
    { key: "SupplierId", title: "ID" },
    {
      key: "SupplierName",
      title: "Название поставщика",
      render: (r) => r.SupplierName ?? r.name ?? r.title ?? "-",
    },
    {
      key: "Phone",
      title: "Телефон",
      render: (r) => r.Phone ?? r.phone ?? r.tel ?? "-",
    },
    {
      key: "Email",
      title: "Email",
      render: (r) => r.Email ?? r.email ?? "-",
    },
    {
      key: "Address",
      title: "Адрес",
      render: (r) => r.Address ?? r.address ?? "-",
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
        <h2 className={styles.title}>Поставщики</h2>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={fetchSuppliers}>
            Обновить
          </Button>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          {editingSupplier ? "Редактировать поставщика" : "Создать поставщика"}
        </h3>
        <SupplierForm
          key={formKey}
          initialValues={
            editingSupplier ? mapToInitial(editingSupplier) : undefined
          }
          onSubmit={async (vals) => {
            await handleCreateOrUpdate(vals);
          }}
          onCancel={() => {
            setEditingSupplier(null);
            setFormKey((k) => k + 1);
          }}
          submitText={editingSupplier ? "Сохранить" : "Создать"}
        />
      </div>

      {loading ? (
        <Loader text="Загрузка поставщиков..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className={styles.tableWrap}>
          <Table columns={columns} data={suppliers} />
        </div>
      )}
    </div>
  );
}
