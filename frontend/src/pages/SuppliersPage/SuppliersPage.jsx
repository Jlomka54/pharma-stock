import React, { useEffect, useState, useCallback } from "react";
import styles from "./SuppliersPage.module.css";
import {
  getSuppliers, createSupplier, updateSupplier, deleteSupplier,
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
        setSuppliers(Array.isArray(data) ? data : data?.items || data?.data || []),
      )
      .catch((err) => setError(err?.message || "Ошибка при загрузке поставщиков"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const mapToInitial = React.useCallback((s) => ({
    SupplierName: s.SupplierName || s.name || "",
    Phone: s.Phone || s.phone || "",
    Email: s.Email || s.email || "",
    Address: s.Address || s.address || "",
  }), []);

  const handleCreateOrUpdate = async (vals) => {
    if (editingSupplier) {
      const id = editingSupplier.SupplierId ?? editingSupplier.id ?? editingSupplier._id;
      await updateSupplier(id, vals);
      setEditingSupplier(null);
    } else {
      await createSupplier(vals);
    }
    await fetchSuppliers();
    setFormKey((k) => k + 1);
  };

  const handleEditClick = (row) => {
    setEditingSupplier(row);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (row) => {
    if (!window.confirm("Удалить поставщика?")) return;
    try {
      await deleteSupplier(row.SupplierId ?? row.id ?? row._id);
      await fetchSuppliers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      if (/foreign|constraint|related/i.test(msg)) {
        alert("Нельзя удалить поставщика: он используется в товарах.");
      } else {
        alert(msg);
      }
    }
  };

  const columns = [
    { key: "SupplierId", title: "ID" },
    { key: "SupplierName", title: "Поставщик", render: (r) => r.SupplierName ?? r.name ?? "—" },
    { key: "Phone", title: "Телефон", render: (r) => r.Phone ?? r.phone ?? "—" },
    { key: "Email", title: "Email", render: (r) => r.Email ?? r.email ?? "—" },
    { key: "Address", title: "Адрес", render: (r) => r.Address ?? r.address ?? "—" },
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
          <h2 className={styles.title}>Поставщики</h2>
          <p className={styles.subtitle}>Управление поставщиками медикаментов</p>
        </div>
        <Button variant="secondary" onClick={fetchSuppliers}>Обновить</Button>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionHeader}>
          <span className={styles.formSectionTitle}>
            {editingSupplier ? "✏️ Редактировать поставщика" : "➕ Новый поставщик"}
          </span>
          {editingSupplier && (
            <Button variant="secondary" onClick={() => { setEditingSupplier(null); setFormKey(k => k + 1); }}>
              Отменить редактирование
            </Button>
          )}
        </div>
        <div className={styles.formSectionBody}>
          <SupplierForm
            key={formKey}
            initialValues={editingSupplier ? mapToInitial(editingSupplier) : undefined}
            onSubmit={handleCreateOrUpdate}
            onCancel={editingSupplier ? () => { setEditingSupplier(null); setFormKey(k => k + 1); } : undefined}
            submitText={editingSupplier ? "Сохранить" : "Создать"}
          />
        </div>
      </div>

      {loading ? (
        <Loader text="Загрузка поставщиков..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <Table columns={columns} data={suppliers} />
      )}
    </div>
  );
}
