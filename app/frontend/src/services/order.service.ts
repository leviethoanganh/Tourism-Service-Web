import api from "@/lib/api";
import { CartItem, Order } from "@/types";

interface CreateOrderPayload {
  fullName: string;
  phone: string;
  note?: string;
  paymentMethod: string;
  items: CartItem[];
}

export const orderService = {
  create: (data: CreateOrderPayload) =>
    api.post<{ code: string; orderCode: string; orderId: string }>(
      "/orders/create",
      data
    ).then((r) => r.data),

  getSuccess: (orderCode: string, phone: string) =>
    api
      .get<{ order: Order }>("/orders/success", {
        params: { orderCode, phone },
      })
      .then((r) => r.data),
};
