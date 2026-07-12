export type UserRole = "administrator" | "asset_manager" | "department_manager" | "employee";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string | { _id: string; name: string };
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export type AssetStatus =
  | "available"
  | "allocated"
  | "in_maintenance"
  | "requested"
  | "scrapped"
  | "lost";

export interface RefOption {
  _id: string;
  name: string;
  [key: string]: unknown;
}

export interface Asset {
  _id: string;
  assetId: string;
  name: string;
  image?: string;
  qrCode?: string;
  barcode?: string;
  category: RefOption | string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  vendor?: RefOption | string;
  warrantyExpiry?: string;
  currentValue?: number;
  status: AssetStatus;
  location: RefOption | string;
  department?: RefOption | string;
  assignedEmployee?: RefOption | string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}
