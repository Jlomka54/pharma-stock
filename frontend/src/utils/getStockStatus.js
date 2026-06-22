export default function getStockStatus(product) {
  if (!product) return "Норма";

  // Проверяем просрочен ли
  const expDate = product.ExpirationDate || product.expiryDate || product.expirationDate;
  if (expDate) {
    const d = new Date(expDate);
    if (!isNaN(d.getTime()) && d < new Date()) return "Просрочен";
  }

  // Флаги от бэкенда (если есть)
  const boolTrue = (v) => v === 1 || v === "1" || v === true;
  if (boolTrue(product.IsExpired ?? product.isExpired ?? product.expired)) return "Просрочен";

  // Считаем по количеству
  const qty = Number(product.QuantityInStock ?? product.stock ?? product.quantity ?? -1);
  const min = Number(product.MinQuantity ?? product.minStock ?? product.min_stock ?? 0);

  if (qty >= 0 && min > 0) {
    if (qty === 0) return "Критически мало";
    if (qty <= min) return "Низкий остаток";
  }

  if (boolTrue(product.IsLowStock ?? product.isLowStock ?? product.lowStock)) return "Низкий остаток";

  return "Норма";
}
