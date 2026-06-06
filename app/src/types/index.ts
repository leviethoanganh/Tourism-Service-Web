export interface Tour {
  _id: string;
  name: string;
  slug: string;
  category: string;
  position: number;
  status: string;
  avatar: string;
  images: string[];
  priceAdult: number;
  priceChildren: number;
  priceBaby: number;
  priceNewAdult: number;
  priceNewChildren: number;
  priceNewBaby: number;
  stockAdult: number;
  stockChildren: number;
  stockBaby: number;
  locations: string[];
  time: string;
  vehicle: string;
  departureDate: string;
  departureDateFormat?: string;
  information: string;
  schedules: Schedule[];
  discount?: number;
  cityList?: City[];
}

export interface Schedule {
  title: string;
  description: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  children?: Category[];
}

export interface City {
  _id: string;
  name: string;
}

export interface CartItem {
  tourId: string;
  locationFrom: string;
  quantityAdult: number;
  quantityChildren: number;
  quantityBaby: number;
  // populated from server
  name?: string;
  slug?: string;
  avatar?: string;
  departureDate?: string;
  locationFromName?: string;
  priceNewAdult?: number;
  priceNewChildren?: number;
  priceNewBaby?: number;
  stockAdult?: number;
  stockChildren?: number;
  stockBaby?: number;
}

export interface Order {
  _id: string;
  code: string;
  fullName: string;
  phone: string;
  note?: string;
  items: CartItem[];
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  createdAtFormat?: string;
  paymentMethodName?: string;
  paymentStatusName?: string;
  statusName?: string;
}

export interface WebsiteInfo {
  websiteName: string;
  logo?: string;
}

export interface Pagination {
  currentPage: number;
  totalPage: number;
  totalRecord: number;
  limitItems: number;
}

export interface ApiResponse<T> {
  code: 'success' | 'error';
  message: string;
  data?: T;
}
