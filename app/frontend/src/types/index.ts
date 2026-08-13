export interface Tour {
  _id: string;
  code?: string;
  name: string;
  slug: string;
  avatar: string;
  images: string[];
  category: string;
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
  status: string;
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
  avatar?: string;
  children?: Category[];
}

export interface City {
  _id: string;
  name: string;
}

export interface CartItem {
  tourId: string;
  name: string;
  avatar: string;
  slug: string;
  quantityAdult: number;
  quantityChildren: number;
  quantityBaby: number;
  priceNewAdult: number;
  priceNewChildren: number;
  priceNewBaby: number;
  locationFrom: string;
  departureDate?: string;
}

export interface Order {
  _id: string;
  code: string;
  fullName: string;
  phone: string;
  note: string;
  items: OrderItem[];
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentMethodName?: string;
  paymentStatus: string;
  paymentStatusName?: string;
  status: string;
  statusName?: string;
  createdAtFormat?: string;
}

export interface OrderItem {
  tourId: string;
  name: string;
  avatar: string;
  quantityAdult: number;
  quantityChildren: number;
  quantityBaby: number;
  priceNewAdult: number;
  priceNewChildren: number;
  priceNewBaby: number;
  departureDate: string;
  departureDateFormat?: string;
  locationFrom: string;
  locationFromName?: string;
}

export interface Pagination {
  currentPage: number;
  totalPage: number;
  totalRecord: number;
  limitItems: number;
}

export interface WebsiteInfo {
  websiteName: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  favicon?: string;
}
