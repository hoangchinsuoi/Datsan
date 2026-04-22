import { apiGet, apiPost, apiDeleteRaw } from "./api";

export type ReviewDto = {
  id: number;
  userFullName: string;
  rating: number;
  comment: string;
  createdAt: string;
  fieldName?: string;
};

export const reviewService = {
  async listByField(fieldId: number): Promise<ReviewDto[]> {
    return apiGet<ReviewDto[]>(`/reviews?fieldId=${fieldId}`);
  },

  async create(fieldId: number, rating: number, comment: string): Promise<ReviewDto> {
    return apiPost<ReviewDto>("/reviews", { fieldId, rating, comment });
  },

  async getAllAdmin(): Promise<ReviewDto[]> {
    return apiGet<ReviewDto[]>("/reviews/admin");
  },

  async deleteAdmin(id: number): Promise<void> {
    await apiDeleteRaw(`/reviews/${id}`);
  },
};
