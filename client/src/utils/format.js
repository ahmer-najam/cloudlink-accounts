const readCurrency = () => {
  if (typeof window === "undefined") return "USD";
  return window.localStorage.getItem("app_currency") || "USD";
};

const readLocale = () => {
  if (typeof window === "undefined") return "en-US";
  return window.localStorage.getItem("app_locale") || "en-US";
};

export const setCurrencyPreference = ({ currency, locale }) => {
  if (typeof window === "undefined") return;
  if (currency) window.localStorage.setItem("app_currency", String(currency).toUpperCase());
  if (locale) window.localStorage.setItem("app_locale", locale);
};

export const money = (value) => {
  const currency = readCurrency();
  const locale = readLocale();
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value || 0);
};

export const percent = (value) => `${Number(value || 0).toFixed(1)}%`;

export const prettyDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

export const prettyMonth = (value) => {
  const [year, month] = String(value).split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const toInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);

export const endOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const startOfYear = (date = new Date()) => new Date(date.getFullYear(), 0, 1);

export const TYPE_LABELS = {
  income: "Customer Income",
  investment: "Investments",
  expense: "Expenses",
  purchase: "Purchases"
};

export const TYPE_COLORS = {
  income: "#0f766e",
  investment: "#2563eb",
  expense: "#dc2626",
  purchase: "#d97706"
};
