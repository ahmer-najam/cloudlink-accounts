import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const apiLogin = (payload) => api.post("/auth/login", payload);
export const apiMe = () => api.get("/auth/me");
export const apiUpdateMe = (payload) => api.put("/auth/me", payload);

export const fetchTransactions = (type = "all") =>
  api.get("/transactions", { params: type === "all" ? {} : { type } });

export const fetchSummary = () => api.get("/transactions/summary");

export const addTransaction = (payload) => api.post("/transactions", payload);

export const removeTransaction = (id) => api.delete(`/transactions/${id}`);

export const fetchInvestors = (status = "all") =>
  api.get("/investors", { params: status === "all" ? {} : { status } });

export const fetchInvestorSummary = () => api.get("/investors/summary");

export const addInvestor = (payload) => api.post("/investors", payload);

export const updateInvestor = (id, payload) => api.put(`/investors/${id}`, payload);

export const removeInvestor = (id) => api.delete(`/investors/${id}`);

export const fetchReport = ({ from, to } = {}) =>
  api.get("/reports", { params: { from: from || undefined, to: to || undefined } });

export const fetchSettings = () => api.get("/settings");

export const updateCurrency = (payload) => api.put("/settings/currency", payload);

export const addBank = (payload) => api.post("/settings/banks", payload);

export const updateBank = (bankId, payload) => api.put(`/settings/banks/${bankId}`, payload);

export const removeBank = (bankId) => api.delete(`/settings/banks/${bankId}`);

export const fetchUsers = () => api.get("/users");
export const createUser = (payload) => api.post("/users", payload);
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload);
