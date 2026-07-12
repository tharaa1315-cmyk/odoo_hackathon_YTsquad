import api from "./api";
import type { User } from "@/types";

export interface AuthResponse {
  success: boolean;
  data: User;
  token: string;
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data),

  register: (payload: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  me: () => api.get<{ success: boolean; data: User }>("/auth/me").then((r) => r.data.data),

  updateProfile: (payload: Partial<Pick<User, "name" | "phone" | "avatar">>) =>
    api.put<{ success: boolean; data: User }>("/auth/me", payload).then((r) => r.data.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/change-password", { currentPassword, newPassword }).then((r) => r.data),
};
