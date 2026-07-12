import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import PlaceholderPage from "@/pages/PlaceholderPage";

import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import AssetManagerDashboard from "@/pages/dashboard/AssetManagerDashboard";
import DepartmentManagerDashboard from "@/pages/dashboard/DepartmentManagerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";

import AssetList from "@/pages/assets/AssetList";
import AssetDetail from "@/pages/assets/AssetDetail";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import DepartmentsPage from "@/pages/admin/DepartmentsPage";
import VendorsPage from "@/pages/admin/VendorsPage";
import LocationsPage from "@/pages/admin/LocationsPage";
import EmployeesPage from "@/pages/admin/EmployeesPage";

import { dashboardPathForRole } from "@/utils/roleDashboard";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? dashboardPathForRole(user.role) : "/login"} replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontSize: "14px" } }} />
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Administrator */}
          <Route element={<ProtectedRoute allowedRoles={["administrator"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/assets" element={<AssetList />} />
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/departments" element={<DepartmentsPage />} />
              <Route path="/admin/employees" element={<EmployeesPage />} />
              <Route path="/admin/vendors" element={<VendorsPage />} />
              <Route path="/admin/locations" element={<LocationsPage />} />
              <Route path="/admin/inventory" element={<PlaceholderPage title="Inventory" />} />
              <Route path="/admin/maintenance" element={<PlaceholderPage title="Maintenance" />} />
              <Route path="/admin/allocation" element={<PlaceholderPage title="Asset Allocation" />} />
              <Route path="/admin/transfers" element={<PlaceholderPage title="Asset Transfers" />} />
              <Route path="/admin/returns" element={<PlaceholderPage title="Asset Returns" />} />
              <Route path="/admin/consumables" element={<PlaceholderPage title="Consumables" />} />
              <Route path="/admin/reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="/admin/analytics" element={<PlaceholderPage title="Analytics" />} />
              <Route path="/admin/notifications" element={<PlaceholderPage title="Notifications" />} />
              <Route path="/admin/settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Route>

          {/* Asset Manager */}
          <Route element={<ProtectedRoute allowedRoles={["asset_manager"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/asset-manager/dashboard" element={<AssetManagerDashboard />} />
              <Route path="/asset-manager/assets" element={<AssetList />} />
              <Route path="/asset-manager/maintenance" element={<PlaceholderPage title="Maintenance" />} />
              <Route path="/asset-manager/inventory" element={<PlaceholderPage title="Inventory" />} />
              <Route path="/asset-manager/allocation" element={<PlaceholderPage title="Allocation" />} />
              <Route path="/asset-manager/transfers" element={<PlaceholderPage title="Transfers" />} />
              <Route path="/asset-manager/reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="/asset-manager/analytics" element={<PlaceholderPage title="Analytics" />} />
            </Route>
          </Route>

          {/* Department Manager */}
          <Route element={<ProtectedRoute allowedRoles={["department_manager"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/manager/dashboard" element={<DepartmentManagerDashboard />} />
              <Route path="/manager/department-assets" element={<PlaceholderPage title="Department Assets" />} />
              <Route path="/manager/employee-assets" element={<PlaceholderPage title="Employee Assets" />} />
              <Route path="/manager/requests" element={<PlaceholderPage title="Asset Requests" />} />
              <Route path="/manager/approvals" element={<PlaceholderPage title="Approvals" />} />
              <Route path="/manager/reports" element={<PlaceholderPage title="Reports" />} />
            </Route>
          </Route>

          {/* Employee */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/my-assets" element={<PlaceholderPage title="My Assets" />} />
              <Route path="/employee/request-asset" element={<PlaceholderPage title="Request Asset" />} />
              <Route path="/employee/return-asset" element={<PlaceholderPage title="Return Asset" />} />
              <Route path="/employee/report-damage" element={<PlaceholderPage title="Report Damage" />} />
              <Route path="/employee/maintenance-requests" element={<PlaceholderPage title="Maintenance Requests" />} />
              <Route path="/employee/notifications" element={<PlaceholderPage title="Notifications" />} />
              <Route path="/employee/profile" element={<PlaceholderPage title="Profile" />} />
            </Route>
          </Route>

          {/* Shared: any authenticated role can view an asset's detail page */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/assets/:id" element={<AssetDetail />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
