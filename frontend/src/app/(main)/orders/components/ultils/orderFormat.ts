export const formatCurrency = (value: string | number | null | undefined) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))} d`;

export const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};
export const escapeHtml = (value: string | number | null | undefined) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
