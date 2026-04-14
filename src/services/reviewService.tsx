import { apiGet, apiPost } from "./api";

export type ReviewDto = {
  id: number;
  userFullName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const reviewService = {
  async listByField(fieldId: number): Promise<ReviewDto[]> {
    return apiGet<ReviewDto[]>(`/reviews?fieldId=${fieldId}`);
  },

  async create(fieldId: number, rating: number, comment: string): Promise<ReviewDto> {
    return apiPost<ReviewDto>("/reviews", { fieldId, rating, comment });
  },
};
