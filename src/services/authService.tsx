import { apiPost } from "./api";
import type { AuthUser } from "../types";

export type RegisterRequest = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
};

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthUser> {
    return apiPost<AuthUser>("/auth/login", {
      usernameOrEmail: credentials.email,
      password: credentials.password,
    });
  },

  async register(body: RegisterRequest): Promise<AuthUser> {
    return apiPost<AuthUser>("/auth/register", body);
  },

  async updateProfile(body: any): Promise<AuthUser> {
    const { apiPut } = await import("./api");
    return apiPut<AuthUser>("/auth/profile", body);
  },
};
