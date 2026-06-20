import React, { useState, useEffect } from "react";
import styles from "./SupplierForm.module.css";
import Button from "../Button/Button";

const empty = { SupplierName: "", Phone: "", Email: "", Address: "" };

export default function SupplierForm({
  onSubmit,
  initialValues = {},
  submitText = "Создать",
  onCancel,
}) {
  const [values, setValues] = useState({ ...empty, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues({ ...empty, ...initialValues });
    setErrors({});
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!values.SupplierName || String(values.SupplierName).trim() === "")
      e.SupplierName = "Название обязательно";
    if (values.Email && !String(values.Email).includes("@"))
      e.Email = "Некорректный email";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    if (!onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: values.SupplierName,
        phone: values.Phone,
        email: values.Email,
        address: values.Address,
      });
      setValues({ ...empty });
      setErrors({});
    } catch (err) {
      setErrors({ form: err?.message || "Ошибка при сохранении" });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {errors.form && <div className={styles.formError}>{errors.form}</div>}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Название поставщика</label>
          <input
            name="SupplierName"
            value={values.SupplierName}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.SupplierName && (
            <div className={styles.error}>{errors.SupplierName}</div>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Телефон</label>
          <input
            name="Phone"
            value={values.Phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            name="Email"
            value={values.Email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.Email && <div className={styles.error}>{errors.Email}</div>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Адрес</label>
          <input
            name="Address"
            value={values.Address}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.rowActions}>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (!submitting) onCancel();
            }}
            disabled={submitting}
          >
            Отменить
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Сохранение..." : submitText}
        </Button>
      </div>
    </form>
  );
}
