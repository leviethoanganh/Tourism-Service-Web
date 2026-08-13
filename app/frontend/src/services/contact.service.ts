import api from "@/lib/api";

export const contactService = {
  send: (data: { fullName: string; email: string; phone: string; message: string }) =>
    api.post<{ code: string; message: string }>("/contact", data).then((r) => r.data),
};
