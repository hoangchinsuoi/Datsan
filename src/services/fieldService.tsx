import { apiGet, apiPost, apiPut, apiDeleteRaw } from "./api";
import type { Field } from "../types";
import { mapFieldDto, type FieldDto } from "../utils/apiMappers";

function toQuery(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const fieldService = {
  async getFields(
    filters?: Partial<{
      search: string;
      location: string;
      categoryId: number;
      minPrice: number;
      maxPrice: number;
      status: string;
      position: string;
      format: string;
    }>
  ): Promise<Field[]> {
    const q = toQuery({
      search: filters?.search,
      location: filters?.location,
      categoryId: filters?.categoryId,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      status: filters?.status,
      position: filters?.position,
      format: filters?.format,
    });
    const data = await apiGet<FieldDto[]>(`/fields${q}`);
    return data.map(mapFieldDto);
  },

  async getFieldById(id: string): Promise<Field | undefined> {
    try {
      const data = await apiGet<FieldDto>(`/fields/${encodeURIComponent(id)}`);
      return mapFieldDto(data);
    } catch {
      return undefined;
    }
  },

  async searchFields(query: string): Promise<Field[]> {
    const data = await apiGet<FieldDto[]>(`/fields/search?query=${encodeURIComponent(query)}`);
    return data.map(mapFieldDto);
  },

  async createField(body: {
    name: string;
    categoryId: number;
    location: string;
    pricePerHour: number;
    description?: string;
    imageUrl?: string | null;
    maxPlayers: number;
    position: string;
    format: string;
  }): Promise<Field> {
    const data = await apiPost<FieldDto>("/fields", body);
    return mapFieldDto(data);
  },

  async updateField(id: number, body: {
    name: string;
    categoryId: number;
    location: string;
    pricePerHour: number;
    description?: string;
    imageUrl?: string | null;
    maxPlayers: number;
    position: string;
    format: string;
  }): Promise<Field> {
    const data = await apiPut<FieldDto>(`/fields/${id}`, body);
    return mapFieldDto(data);
  },

  async deleteField(id: number): Promise<void> {
    await apiDeleteRaw(`/fields/${id}`);
  },

  async getCategories(): Promise<{ id: number; name: string; description?: string | null }[]> {
    return apiGet<{ id: number; name: string; description?: string | null }[]>("/categories");
  },
};
