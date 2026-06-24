export const formatCurrency = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (safeValue >= 1_000_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(safeValue / 1_000_000_000)} tỷ`;
  }

  if (safeValue >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(safeValue / 1_000_000)}tr`;
  }

  if (safeValue >= 1_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 0,
    }).format(safeValue / 1_000)}K`;
  }

  return `${new Intl.NumberFormat("vi-VN").format(safeValue)}đ`;
};

export const formatFullCurrency = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(safeValue);
};
