import axios from "axios";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const baseURL = "/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err: any) => {
    let msg = "Đã xảy ra lỗi không xác định.";
    
    if (err.response) {
      // Server trả về lỗi (400, 401, 500...)
      msg = err.response.data?.message || err.message || "Lỗi máy chủ.";
    } else if (err.request) {
      // Không nhận được phản hồi từ server (Network Error)
      msg = "Không thể kết nối tới máy chủ. Vui lòng kiểm tra xem Backend đã chạy chưa (dotnet run).";
    } else {
      msg = err.message;
    }
    
    return Promise.reject(new Error(msg));
  }
);

export async function apiGet<T>(url: string, config?: Parameters<typeof api.get>[1]): Promise<T> {
  const { data } = await api.get<ApiEnvelope<T>>(url, config);
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function apiPost<T>(url: string, body?: unknown, config?: Parameters<typeof api.post>[2]): Promise<T> {
  const { data } = await api.post<ApiEnvelope<T>>(url, body, config);
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function apiDeleteRaw(url: string, config?: Parameters<typeof api.delete>[1]): Promise<void> {
  const { data } = await api.delete<ApiEnvelope<unknown>>(url, config);
  if (!data.success) throw new Error(data.message);
}

export default api;
