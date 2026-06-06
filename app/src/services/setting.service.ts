import api from './api';
import { Category, City, WebsiteInfo } from '../types';

export const settingService = {
  getWebsiteInfo: () =>
    api.get<{ websiteInfo: WebsiteInfo }>('/settings').then(r => r.data),

  getCategories: () =>
    api.get<{ categoryList: Category[] }>('/categories').then(r => r.data),

  getCities: () =>
    api.get<{ cityList: City[] }>('/cities').then(r => r.data),
};
