import * as SecureStore from "expo-secure-store";
import api from "./api";

export type Role = "admin" | "user";

export const authService = {
  loginAdmin: async (email: string, password: string) => {
    const res = await api.post("/admin/auth/login", { email, password, rememberPassword: true });
    if (res.data.code === "success" && res.data.token) {
      await SecureStore.setItemAsync("token", res.data.token);
      await SecureStore.setItemAsync("role", "admin");
    }
    return res.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
  },

  checkAuth: () => api.get("/admin/auth/check").then((r) => r.data),

  getRole: async (): Promise<Role | null> => {
    const role = await SecureStore.getItemAsync("role");
    return (role as Role) ?? null;
  },

  isLoggedIn: async () => {
    const token = await SecureStore.getItemAsync("token");
    return !!token;
  },
};
