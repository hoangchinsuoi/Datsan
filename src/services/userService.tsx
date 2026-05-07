import { apiGet, apiPut, apiPost } from "./api";

export type AdminUser = {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
};

export const userService = {
  async getAllUsers(): Promise<AdminUser[]> {
    return apiGet<AdminUser[]>("/users");
  },

  async toggleStatus(userId: number): Promise<void> {
    await apiPut(`/users/${userId}/toggle-status`);
  },

  async changeRole(userId: number, role: string): Promise<void> {
    await apiPut(`/users/${userId}/role`, role);
  },

  async inviteAdmin(data: any): Promise<void> {
    await apiPost("/users/invite-admin", data);
  },
};
