const boolIsTrue = (val) => val === 1 || val === "1" || val === true;

export default function getStockStatus(product) {
  if (!product) return "В норме";
  const isExpired = boolIsTrue(
    product.IsExpired ??
      product.isExpired ??
      product.expired ??
      product.is_expired,
  );
  if (isExpired) return "Просрочен";
  const isLow = boolIsTrue(
    product.IsLowStock ??
      product.isLowStock ??
      product.lowStock ??
      product.is_low_stock ??
      product.low_stock,
  );
  if (isLow) return "Низкий остаток";
  return "В норме";
}
