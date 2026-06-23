import React, { useState, useEffect } from "react";
import styles from "./CategoryForm.module.css";
import Button from "../Button/Button";

const empty = { CategoryName: "", Description: "" };

export default function CategoryForm({
  onSubmit,
  initialValues = {},
  submitText = "Создать",
  onCancel,
}) {
  const [values, setValues] = useState({ ...empty, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setValues({ ...empty, ...initialValues });
    setErrors({});
  }, [JSON.stringify(initialValues)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!values.CategoryName || String(values.CategoryName).trim() === "")
      err.CategoryName = "Название обязательно";
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
        CategoryName: values.CategoryName,
        Description: values.Description,
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
          <label className={styles.label}>Название категории</label>
          <input
            name="CategoryName"
            value={values.CategoryName}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.CategoryName && (
            <div className={styles.error}>{errors.CategoryName}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Описание</label>
          <input
            name="Description"
            value={values.Description}
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
