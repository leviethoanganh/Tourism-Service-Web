import axios from 'axios';
import api from './api';
import { CartItem, Order } from '../types';

interface CreateOrderPayload {
  fullName: string;
  phone: string;
  note: string;
  paymentMethod: string;
  items: CartItem[];
}

export const orderService = {
  create: (payload: CreateOrderPayload) =>
    axios.post('/order/create', payload).then(r => r.data),

  getSuccess: (orderCode: string, phone: string) =>
    api.get<{ order: Order }>('/orders/success', { params: { orderCode, phone } }).then(r => r.data),
};
