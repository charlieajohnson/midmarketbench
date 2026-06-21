export const formatScore = (value: number) => value.toFixed(1);
export const formatPercent = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "percent", maximumFractionDigits: 0 }).format(value);
export const formatCurrencyMillions = (value: number) => `€${value.toFixed(1)}m`;
