export default function formatDate(input) {
  if (!input) return "-";
  try {
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return String(input);
    return d.toLocaleString("ru-RU");
  } catch (e) {
    return String(input);
  }
}
