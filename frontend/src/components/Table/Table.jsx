import React from "react";
import styles from "./Table.module.css";

export default function Table({ columns = [], data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📭</div>
        <div>Данные не найдены</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey =
              row.id ?? row._id ?? row.ProductId ?? row.CategoryId ??
              row.SupplierId ?? row.OperationId ?? row.UserId ?? rowIndex;
            return (
              <tr key={rowKey} className={styles.tr}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
