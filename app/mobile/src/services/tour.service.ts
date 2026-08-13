import api from "./api";

export const tourService = {
  getList: (params?: Record<string, any>) =>
    api.get("/admin/tours", { params }).then((r) => r.data),

  getDetail: (id: string) =>
    api.get(`/admin/tours/${id}`).then((r) => r.data),
};
