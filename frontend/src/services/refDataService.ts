import api from "./api";
import type { RefOption, ApiListResponse } from "@/types";

// Shared helper for the simple reference-data resources: categories, departments,
// vendors, locations, employees. Each backs an <AssetForm> dropdown and its own
// admin CRUD page.
const buildResource = (path: string) => ({
  list: (params: Record<string, unknown> = {}) =>
    api.get<ApiListResponse<RefOption>>(path, { params }).then((r) => r.data),
  get: (id: string) => api.get(`${path}/${id}`).then((r) => r.data.data),
  create: (payload: Record<string, unknown>) => api.post(path, payload).then((r) => r.data.data),
  update: (id: string, payload: Record<string, unknown>) =>
    api.put(`${path}/${id}`, payload).then((r) => r.data.data),
  remove: (id: string) => api.delete(`${path}/${id}`).then((r) => r.data),
});

export const categoryService = buildResource("/categories");
export const departmentService = buildResource("/departments");
export const vendorService = buildResource("/vendors");
export const locationService = buildResource("/locations");
export const employeeService = buildResource("/employees");
