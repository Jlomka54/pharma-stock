import React, { useState, useEffect } from "react";
import styles from "./StockOperationForm.module.css";
import Button from "../Button/Button";

const empty = {
  ProductId: "",
  UserId: 1,
  OperationType: "income",
  Quantity: "",
  OperationDate: "",
  Comment: "",
};

export default function StockOperationForm({
  products = [],
  onSubmit,
  submitText = "Добавить",
  onCancel,
}) {
  const [values, setValues] = useState({ ...empty });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      ...empty,
      OperationDate: new Date().toISOString().slice(0, 16),
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!values.ProductId) e.ProductId = "Выберите товар";
    if (!values.OperationType) e.OperationType = "Выберите тип операции";
    if (!values.Quantity || Number(values.Quantity) <= 0)
      e.Quantity = "Количество должно быть больше 0";
    if (!values.OperationDate) e.OperationDate = "Укажите дату операции";
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
      const payload = {
        productId: values.ProductId,
        userId: values.UserId || 1,
        operationType: values.OperationType,
        quantity: Number(values.Quantity),
        operationDate: new Date(values.OperationDate).toISOString(),
        comment: values.Comment || undefined,
      };
      await onSubmit(payload);
      setValues({
        ...empty,
        OperationDate: new Date().toISOString().slice(0, 16),
      });
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Товар</label>
          <select
            name="ProductId"
            value={values.ProductId}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">-- выберите --</option>
            {products.map((p) => (
              <option key={p.id ?? p._id} value={p.id ?? p._id}>
                {p.name ?? p.title ?? p.productName}
              </option>
            ))}
          </select>
          {errors.ProductId && (
            <div className={styles.error}>{errors.ProductId}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Тип операции</label>
          <select
            name="OperationType"
            value={values.OperationType}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="income">Приход</option>
            <option value="outcome">Расход</option>
            <option value="writeoff">Списание</option>
          </select>
          {errors.OperationType && (
            <div className={styles.error}>{errors.OperationType}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Количество</label>
          <input
            name="Quantity"
            type="number"
            min="0"
            value={values.Quantity}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.Quantity && (
            <div className={styles.error}>{errors.Quantity}</div>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Дата операции</label>
          <input
            name="OperationDate"
            type="datetime-local"
            value={values.OperationDate}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.OperationDate && (
            <div className={styles.error}>{errors.OperationDate}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Комментарий</label>
          <input
            name="Comment"
            value={values.Comment}
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
            onClick={() => onCancel()}
            disabled={submitting}
          >
            Отменить
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Добавление..." : submitText}
        </Button>
      </div>
    </form>
  );
}
