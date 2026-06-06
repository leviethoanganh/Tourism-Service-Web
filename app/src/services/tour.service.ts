import api from './api';
import { Tour, Pagination } from '../types';

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
    api.get<HomeToursResponse>('/tours/home').then(r => r.data),

  getList: (params: Record<string, string | number>) =>
    api.get<TourListResponse>('/tours', { params }).then(r => r.data),

  getDetail: (slug: string) =>
    api.get<{ tour: Tour; category: { name: string; slug: string } }>(`/tours/${slug}`).then(r => r.data),

  search: (params: Record<string, string>) =>
    api.get<{ tourList: Tour[] }>('/tours/search', { params }).then(r => r.data),
};
