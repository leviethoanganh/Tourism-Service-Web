import api from "./api";

export const tourClientService = {
  getList:   (params?: any) => api.get("/tours", { params }).then((r) => r.data),
  getDetail: (slug: string) => api.get(`/tours/${slug}`).then((r) => r.data),
  search:    (params?: any) => api.get("/tours/search", { params }).then((r) => r.data),
};

export const orderClientService = {
  create: (data: any) => api.post("/orders/create", data).then((r) => r.data),
};

export const settingClientService = {
  getWebsiteInfo: () => api.get("/settings").then((r) => r.data),
  getCategories:  () => api.get("/categories").then((r) => r.data),
  getCities:      () => api.get("/cities").then((r) => r.data),
};

export const contactService = {
  send: (data: any) => api.post("/contact", data).then((r) => r.data),
};
