import axios from "axios";

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const adminAuthService = {
  login: (email: string, password: string, rememberPassword: boolean) =>
    adminApi.post("/admin/auth/login", { email, password, rememberPassword }).then(r => r.data),

  logout: () =>
    adminApi.get("/admin/auth/logout").then(r => r.data),

  checkAuth: () =>
    adminApi.get("/admin/auth/check").then(r => r.data),

  forgotPassword: (email: string) =>
    adminApi.post("/admin/auth/forgot-password", { email }).then(r => r.data),

  otpPassword: (email: string, otp: string) =>
    adminApi.post("/admin/auth/otp-password", { email, otp }).then(r => r.data),

  resetPassword: (password: string) =>
    adminApi.post("/admin/auth/reset-password", { password }).then(r => r.data),

  register: (fullName: string, email: string, password: string) =>
    adminApi.post("/admin/auth/register", { fullName, email, password }).then(r => r.data),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const adminDashboardService = {
  get: () => adminApi.get("/admin/dashboard").then(r => r.data),
  revenueChart: (from: string, to: string) =>
    adminApi.post("/admin/dashboard/revenue-chart", { from, to }).then(r => r.data),
};

// ── Tours ─────────────────────────────────────────────────────────────────────
export const adminTourService = {
  getList: (params?: Record<string, any>) =>
    adminApi.get("/admin/tours", { params }).then(r => r.data),
  getTrash: (params?: Record<string, any>) =>
    adminApi.get("/admin/tours/trash", { params }).then(r => r.data),
  getDetail: (id: string) =>
    adminApi.get(`/admin/tours/${id}`).then(r => r.data),
  getFormData: () =>
    adminApi.get("/admin/tours/form-data").then(r => r.data),
  create: (data: FormData) =>
    adminApi.post("/admin/tours", data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),
  update: (id: string, data: FormData) =>
    adminApi.patch(`/admin/tours/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),
  softDelete: (id: string) =>
    adminApi.patch(`/admin/tours/${id}/delete`).then(r => r.data),
  restore: (id: string) =>
    adminApi.patch(`/admin/tours/${id}/restore`).then(r => r.data),
  destroy: (id: string) =>
    adminApi.delete(`/admin/tours/${id}`).then(r => r.data),
};

// ── Categories ────────────────────────────────────────────────────────────────
export const adminCategoryService = {
  getList: (params?: Record<string, any>) =>
    adminApi.get("/admin/categories", { params }).then(r => r.data),
  getDetail: (id: string) =>
    adminApi.get(`/admin/categories/${id}`).then(r => r.data),
  getFormData: () =>
    adminApi.get("/admin/categories/form-data").then(r => r.data),
  create: (data: FormData) =>
    adminApi.post("/admin/categories", data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),
  update: (id: string, data: FormData) =>
    adminApi.patch(`/admin/categories/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),
  softDelete: (id: string) =>
    adminApi.patch(`/admin/categories/${id}/delete`).then(r => r.data),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const adminOrderService = {
  getList: (params?: Record<string, any>) =>
    adminApi.get("/admin/orders", { params }).then(r => r.data),
  getDetail: (id: string) =>
    adminApi.get(`/admin/orders/${id}`).then(r => r.data),
  update: (id: string, data: Record<string, any>) =>
    adminApi.patch(`/admin/orders/${id}`, data).then(r => r.data),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const adminUserService = {
  getList: (params?: Record<string, any>) =>
    adminApi.get("/admin/users", { params }).then(r => r.data),
};

// ── Settings ──────────────────────────────────────────────────────────────────
export const adminSettingService = {
  getWebsiteInfo: () =>
    adminApi.get("/admin/settings/website-info").then(r => r.data),
  updateWebsiteInfo: (data: FormData) =>
    adminApi.patch("/admin/settings/website-info", data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),

  getAccounts: () =>
    adminApi.get("/admin/settings/accounts").then(r => r.data),
  createAccount: (data: FormData) =>
    adminApi.post("/admin/settings/accounts", data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),
  updateAccount: (id: string, data: FormData) =>
    adminApi.patch(`/admin/settings/accounts/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),

  getRoles: () =>
    adminApi.get("/admin/settings/roles").then(r => r.data),
  getRoleDetail: (id: string) =>
    adminApi.get(`/admin/settings/roles/${id}`).then(r => r.data),
  createRole: (data: Record<string, any>) =>
    adminApi.post("/admin/settings/roles", data).then(r => r.data),
  updateRole: (id: string, data: Record<string, any>) =>
    adminApi.patch(`/admin/settings/roles/${id}`, data).then(r => r.data),
};

// ── Profile ───────────────────────────────────────────────────────────────────
export const adminProfileService = {
  update: (data: FormData) =>
    adminApi.patch("/admin/profile", data, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    adminApi.patch("/admin/profile/change-password", data).then(r => r.data),
};

export default adminApi;
