import type { UserRole } from "@/types";

// Where each role lands immediately after login.
export const dashboardPathForRole = (role: UserRole): string => {
  switch (role) {
    case "administrator":
      return "/admin/dashboard";
    case "asset_manager":
      return "/asset-manager/dashboard";
    case "department_manager":
      return "/manager/dashboard";
    case "employee":
    default:
      return "/employee/dashboard";
  }
};
