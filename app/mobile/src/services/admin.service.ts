import api from "./api";

// Dashboard
export const dashboardService = {
  get: () => api.get("/admin/dashboard").then((r) => r.data),
};

// Tours
export const tourAdminService = {
  getList:    (params?: any) => api.get("/admin/tours", { params }).then((r) => r.data),
  getTrash:   (params?: any) => api.get("/admin/tours/trash", { params }).then((r) => r.data),
  getDetail:  (id: string)   => api.get(`/admin/tours/${id}`).then((r) => r.data),
  getFormData: ()            => api.get("/admin/tours/form-data").then((r) => r.data),
  create:     (data: FormData) =>
    api.post("/admin/tours", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update:     (id: string, data: FormData) =>
    api.patch(`/admin/tours/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  softDelete: (id: string) => api.patch(`/admin/tours/${id}/delete`).then((r) => r.data),
  restore:    (id: string) => api.patch(`/admin/tours/${id}/restore`).then((r) => r.data),
  destroy:    (id: string) => api.delete(`/admin/tours/${id}`).then((r) => r.data),
};

// Categories
export const categoryAdminService = {
  getList:    (params?: any) => api.get("/admin/categories", { params }).then((r) => r.data),
  getDetail:  (id: string)   => api.get(`/admin/categories/${id}`).then((r) => r.data),
  getFormData: ()            => api.get("/admin/categories/form-data").then((r) => r.data),
  create:     (data: any)    => api.post("/admin/categories", data).then((r) => r.data),
  update:     (id: string, data: any) => api.patch(`/admin/categories/${id}`, data).then((r) => r.data),
  softDelete: (id: string) => api.patch(`/admin/categories/${id}/delete`).then((r) => r.data),
};

// Orders
export const orderAdminService = {
  getList:   (params?: any) => api.get("/admin/orders", { params }).then((r) => r.data),
  getDetail: (id: string)   => api.get(`/admin/orders/${id}`).then((r) => r.data),
  update:    (id: string, data: any) => api.patch(`/admin/orders/${id}`, data).then((r) => r.data),
};

// Users
export const userAdminService = {
  getList: (params?: any) => api.get("/admin/users", { params }).then((r) => r.data),
};

// Settings
export const settingAdminService = {
  getWebsiteInfo:    () => api.get("/admin/settings/website-info").then((r) => r.data),
  updateWebsiteInfo: (data: FormData) =>
    api.patch("/admin/settings/website-info", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  getAccounts:    () => api.get("/admin/settings/accounts").then((r) => r.data),
  createAccount:  (data: FormData) =>
    api.post("/admin/settings/accounts", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  updateAccount:  (id: string, data: FormData) =>
    api.patch(`/admin/settings/accounts/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  getRoles:       () => api.get("/admin/settings/roles").then((r) => r.data),
  getRoleDetail:  (id: string) => api.get(`/admin/settings/roles/${id}`).then((r) => r.data),
  createRole:     (data: any) => api.post("/admin/settings/roles", data).then((r) => r.data),
  updateRole:     (id: string, data: any) => api.patch(`/admin/settings/roles/${id}`, data).then((r) => r.data),
};

// Profile
export const profileAdminService = {
  getInfo: () => api.get("/admin/profile").then((r) => r.data),
  update: (data: FormData) =>
    api.patch("/admin/profile", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch("/admin/profile/change-password", data).then((r) => r.data),
};
