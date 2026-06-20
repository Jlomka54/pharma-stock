import React from "react";
import styles from "./Table.module.css";

export default function Table({ columns = [], data = [] }) {
  if (!data || data.length === 0) {
    return <div className={styles.empty}>Данные не найдены</div>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={styles.th}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={row.id || rowIndex} className={styles.tr}>
            {columns.map((col) => (
              <td key={col.key} className={styles.td}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
