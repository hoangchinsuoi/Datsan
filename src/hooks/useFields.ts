import { useCallback, useEffect, useState } from "react";
import type { Field } from "../types";
import { fieldService } from "../services/fieldService";

export interface FieldFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  position?: string;
  format?: string;
  location?: string;
}

export function useFields(initialFilters?: FieldFilters) {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FieldFilters>(initialFilters ?? {});

  const refetch = useCallback(async (overrideFilters?: FieldFilters) => {
    setLoading(true);
    try {
      const f = overrideFilters ?? filters;
      const data = await fieldService.getFields(f);
      setFields(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được danh sách sân.");
      setFields([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const updateFilters = useCallback((newFilters: Partial<FieldFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return { fields, loading, error, refetch, filters, updateFilters };
}
