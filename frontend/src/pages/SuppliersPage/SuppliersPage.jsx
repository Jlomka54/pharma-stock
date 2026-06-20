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
    SupplierName: s.name || s.title || "",
    Phone: s.phone || s.tel || "",
    Email: s.email || "",
    Address: s.address || "",
  });

  const handleCreateOrUpdate = async (vals) => {
    try {
      if (editingSupplier) {
        const id = editingSupplier.id ?? editingSupplier._id;
        await updateSupplier(id, {
          name: vals.name ?? vals.SupplierName,
          phone: vals.phone ?? vals.Phone,
          email: vals.email ?? vals.Email,
          address: vals.address ?? vals.Address,
        });
        setEditingSupplier(null);
      } else {
        await createSupplier({
          name: vals.name ?? vals.SupplierName,
          phone: vals.phone ?? vals.Phone,
          email: vals.email ?? vals.Email,
          address: vals.address ?? vals.Address,
        });
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
      await deleteSupplier(row.id ?? row._id);
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
    { key: "id", title: "ID" },
    {
      key: "name",
      title: "Название поставщика",
      render: (r) => r.name ?? r.title ?? "-",
    },
    { key: "phone", title: "Телефон", render: (r) => r.phone ?? r.tel ?? "-" },
    { key: "email", title: "Email", render: (r) => r.email ?? "-" },
    { key: "address", title: "Адрес", render: (r) => r.address ?? "-" },
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
            const payload = {
              name: vals.name ?? vals.SupplierName,
              phone: vals.phone ?? vals.Phone,
              email: vals.email ?? vals.Email,
              address: vals.address ?? vals.Address,
            };
            await handleCreateOrUpdate(payload);
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
