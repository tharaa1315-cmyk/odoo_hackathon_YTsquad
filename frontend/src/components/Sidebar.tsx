import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Tags,
  Building2,
  Users,
  Truck,
  MapPin,
  Wrench,
  ArrowLeftRight,
  PackageCheck,
  PackageX,
  Layers,
  FileBarChart,
  BarChart3,
  Bell,
  Settings,
  ClipboardList,
  UserCircle,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const navByRole: Record<string, NavItem[]> = {
  administrator: [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Assets", to: "/admin/assets", icon: Boxes },
    { label: "Categories", to: "/admin/categories", icon: Tags },
    { label: "Departments", to: "/admin/departments", icon: Building2 },
    { label: "Employees", to: "/admin/employees", icon: Users },
    { label: "Vendors", to: "/admin/vendors", icon: Truck },
    { label: "Locations", to: "/admin/locations", icon: MapPin },
    { label: "Inventory", to: "/admin/inventory", icon: Layers },
    { label: "Maintenance", to: "/admin/maintenance", icon: Wrench },
    { label: "Allocation", to: "/admin/allocation", icon: PackageCheck },
    { label: "Transfers", to: "/admin/transfers", icon: ArrowLeftRight },
    { label: "Returns", to: "/admin/returns", icon: PackageX },
    { label: "Consumables", to: "/admin/consumables", icon: ClipboardList },
    { label: "Reports", to: "/admin/reports", icon: FileBarChart },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
    { label: "Notifications", to: "/admin/notifications", icon: Bell },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ],
  asset_manager: [
    { label: "Dashboard", to: "/asset-manager/dashboard", icon: LayoutDashboard },
    { label: "Asset Monitoring", to: "/asset-manager/assets", icon: Boxes },
    { label: "Maintenance", to: "/asset-manager/maintenance", icon: Wrench },
    { label: "Inventory", to: "/asset-manager/inventory", icon: Layers },
    { label: "Allocation", to: "/asset-manager/allocation", icon: PackageCheck },
    { label: "Transfers", to: "/asset-manager/transfers", icon: ArrowLeftRight },
    { label: "Reports", to: "/asset-manager/reports", icon: FileBarChart },
    { label: "Analytics", to: "/asset-manager/analytics", icon: BarChart3 },
  ],
  department_manager: [
    { label: "Dashboard", to: "/manager/dashboard", icon: LayoutDashboard },
    { label: "Department Assets", to: "/manager/department-assets", icon: Boxes },
    { label: "Employee Assets", to: "/manager/employee-assets", icon: Users },
    { label: "Asset Requests", to: "/manager/requests", icon: ClipboardList },
    { label: "Approvals", to: "/manager/approvals", icon: CheckSquare },
    { label: "Reports", to: "/manager/reports", icon: FileBarChart },
  ],
  employee: [
    { label: "Dashboard", to: "/employee/dashboard", icon: LayoutDashboard },
    { label: "My Assets", to: "/employee/my-assets", icon: Boxes },
    { label: "Request Asset", to: "/employee/request-asset", icon: ClipboardList },
    { label: "Return Asset", to: "/employee/return-asset", icon: PackageX },
    { label: "Report Damage", to: "/employee/report-damage", icon: Wrench },
    { label: "Maintenance Requests", to: "/employee/maintenance-requests", icon: Wrench },
    { label: "Notifications", to: "/employee/notifications", icon: Bell },
    { label: "Profile", to: "/employee/profile", icon: UserCircle },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const items = user ? navByRole[user.role] || [] : [];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
          SF
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">SyncFlow</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-600/10 dark:text-primary-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4 text-xs text-slate-400 dark:border-slate-800">
        SyncFlow Asset Management &copy; {new Date().getFullYear()}
      </div>
    </aside>
  );
};

export default Sidebar;
