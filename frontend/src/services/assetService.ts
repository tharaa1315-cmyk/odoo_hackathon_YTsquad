import api from "./api";
import type { Asset, ApiListResponse, ApiItemResponse } from "@/types";

export interface AssetQuery {
  keyword?: string;
  status?: string;
  category?: string;
  location?: string;
  department?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const assetService = {
  list: (params: AssetQuery = {}) =>
    api.get<ApiListResponse<Asset>>("/assets", { params }).then((r) => r.data),

  get: (id: string) => api.get<ApiItemResponse<Asset>>(`/assets/${id}`).then((r) => r.data.data),

  create: (payload: Partial<Asset>) =>
    api.post<ApiItemResponse<Asset>>("/assets", payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<Asset>) =>
    api.put<ApiItemResponse<Asset>>(`/assets/${id}`, payload).then((r) => r.data.data),

  remove: (id: string) => api.delete(`/assets/${id}`).then((r) => r.data),

  scrap: (id: string, note?: string) =>
    api.put<ApiItemResponse<Asset>>(`/assets/${id}/scrap`, { note }).then((r) => r.data.data),

  stats: () => api.get("/assets/stats").then((r) => r.data.data),
};
