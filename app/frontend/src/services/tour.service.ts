import api from "@/lib/api";
import { Tour, Pagination } from "@/types";

interface TourListResponse {
  tourList: Tour[];
  pagination: Pagination;
}

interface HomeToursResponse {
  featured: Tour[];
  domestic: Tour[];
  international: Tour[];
}

export const tourService = {
  getHome: () =>
    api.get<HomeToursResponse>("/tours/home").then((r) => r.data),

  getList: (params: Record<string, string | number | undefined>) =>
    api.get<TourListResponse>("/tours", {
      params: Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "" && v !== undefined)
      ),
    }).then((r) => r.data),

  getDetail: (slug: string) =>
    api
      .get<{ tour: Tour; category: { name: string; slug: string } | null }>(
        `/tours/${slug}`
      )
      .then((r) => r.data),

  search: (params: Record<string, string>) =>
    api.get<{ tourList: Tour[] }>("/tours/search", { params }).then((r) => r.data),
};
