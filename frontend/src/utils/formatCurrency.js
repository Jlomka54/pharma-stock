export default function formatCurrency(value, currency = "GEL") {
  const num = Number(value) || 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(num);
  } catch (e) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
      }).format(num);
    } catch (e2) {
      return String(num);
    }
  }
}
