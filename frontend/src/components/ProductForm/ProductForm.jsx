import React, { useState, useEffect } from "react";
import styles from "./ProductForm.module.css";
import Button from "../Button/Button";

const emptyValues = {
  ProductName: "",
  CategoryId: "",
  SupplierId: "",
  Price: "",
  QuantityInStock: "",
  MinQuantity: "",
  ExpirationDate: "",
};

export default function ProductForm({
  onSubmit,
  initialValues = {},
  categories = [],
  suppliers = [],
  submitText = "Создать",
  onCancel,
}) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setValues({ ...emptyValues, ...initialValues });
    setErrors({});
  }, [JSON.stringify(initialValues)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!values.ProductName || String(values.ProductName).trim() === "")
      err.ProductName = "Название обязательно";
    const price = Number(values.Price);
    if (isNaN(price) || price <= 0) err.Price = "Цена должна быть больше 0";
    const qty = Number(values.QuantityInStock);
    if (isNaN(qty) || qty < 0)
      err.QuantityInStock = "Количество не может быть отрицательным";
    if (!values.CategoryId) err.CategoryId = "Категория обязательна";
    if (!values.SupplierId) err.SupplierId = "Поставщик обязателен";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    if (!onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ProductName: values.ProductName,
        CategoryId: values.CategoryId,
        SupplierId: values.SupplierId,
        Price: Number(values.Price),
        QuantityInStock: Number(values.QuantityInStock),
        MinQuantity: Number(values.MinQuantity),
        ExpirationDate: values.ExpirationDate || null,
      });
      // on success, clear form
      setValues({ ...emptyValues });
      setErrors({});
    } catch (err) {
      // show error at top
      setErrors({ form: err?.message || "Ошибка при создании товара" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {errors.form && <div className={styles.formError}>{errors.form}</div>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Название</label>
          <input
            name="ProductName"
            value={values.ProductName}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.ProductName && (
            <div className={styles.error}>{errors.ProductName}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Категория</label>
          <select
            name="CategoryId"
            value={values.CategoryId}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">— Выберите —</option>
            {categories.map((c) => (
              <option
                key={c.CategoryId ?? c.id ?? c._id ?? c.value}
                value={c.CategoryId ?? c.id ?? c._id ?? c.value}
              >
                {c.CategoryName ?? c.name ?? c.title ?? c.label}
              </option>
            ))}
          </select>
          {errors.CategoryId && (
            <div className={styles.error}>{errors.CategoryId}</div>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Поставщик</label>
          <select
            name="SupplierId"
            value={values.SupplierId}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">— Выберите —</option>
            {suppliers.map((s) => (
              <option
                key={s.SupplierId ?? s.id ?? s._id ?? s.value}
                value={s.SupplierId ?? s.id ?? s._id ?? s.value}
              >
                {s.SupplierName ?? s.name ?? s.title ?? s.label}
              </option>
            ))}
          </select>
          {errors.SupplierId && (
            <div className={styles.error}>{errors.SupplierId}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Цена</label>
          <input
            name="Price"
            value={values.Price}
            onChange={handleChange}
            className={styles.input}
            type="number"
            step="0.01"
          />
          {errors.Price && <div className={styles.error}>{errors.Price}</div>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Количество на складе</label>
          <input
            name="QuantityInStock"
            value={values.QuantityInStock}
            onChange={handleChange}
            className={styles.input}
            type="number"
          />
          {errors.QuantityInStock && (
            <div className={styles.error}>{errors.QuantityInStock}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Минимальное количество</label>
          <input
            name="MinQuantity"
            value={values.MinQuantity}
            onChange={handleChange}
            className={styles.input}
            type="number"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Срок годности</label>
          <input
            name="ExpirationDate"
            value={values.ExpirationDate}
            onChange={handleChange}
            className={styles.input}
            type="date"
          />
        </div>

        <div className={styles.fieldActions}>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (!submitting) onCancel();
              }}
              disabled={submitting}
            >
              Отменить редактирование
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Сохранение..." : submitText}
          </Button>
        </div>
      </div>
    </form>
  );
}
