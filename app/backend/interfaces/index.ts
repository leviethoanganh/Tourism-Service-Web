import { Request } from "express";
import { Document } from "mongoose";

export interface ITour extends Document {
  id: string;
  name: string;
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
  departureDate: Date;
  information: string;
  schedules: any[];
  slug: string;
  createdBy: string;
  updatedBy: string;
  deleted: boolean;
  deletedBy: string;
  deletedAt: Date;
  // virtual fields
  departureDateFormat?: string;
  discount?: number;
  cityList?: ICity[];
}

export interface IOrderItem {
  tourId: string;
  name: string;
  avatar: string;
  quantityAdult: number;
  quantityChildren: number;
  quantityBaby: number;
  priceNewAdult: number;
  priceNewChildren: number;
  priceNewBaby: number;
  departureDate: Date;
  locationFrom: string;
  departureDateFormat?: string;
  locationFromName?: string;
}

export interface IOrder extends Document {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  note: string;
  items: IOrderItem[];
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  updatedBy: string;
  deleted: boolean;
  deletedBy: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // virtual fields
  paymentMethodName?: string;
  paymentStatusName?: string;
  statusName?: string;
  statusDetail?: any;
  createdAtFormat?: string;
  createdAtTime?: string;
  createdAtDate?: string;
}

export interface IUser extends Document {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  password: string;
  status: string;
  deleted: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountAdmin extends Document {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  positionCompany: string;
  status: string;
  password: string;
  avatar: string;
  createdBy: string;
  updatedBy: string;
  deleted: boolean;
  deletedBy: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // virtual fields
  roleName?: string;
}

export interface IRole extends Document {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdBy: string;
  updatedBy: string;
  deleted: boolean;
  deletedBy: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  id: string;
  name: string;
  parent: string;
  position: number;
  status: string;
  avatar: string;
  description: string;
  slug: string;
  createdBy: string;
  updatedBy: string;
  deleted: boolean;
  deletedBy: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICity extends Document {
  id: string;
  name: string;
}

export interface IForgotPassword extends Document {
  id: string;
  email: string;
  otp: string;
  expireAt: Date;
}

export interface ISettingWebsiteInfo extends Document {
  id: string;
  websiteName: string;
  phone: string;
  email: string;
  address: string;
  logo: string;
  favicon: string;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  children: CategoryTreeNode[];
}

export interface AuthRequest extends Request {
  account?: IAccountAdmin;
  pers?: string[];
}
