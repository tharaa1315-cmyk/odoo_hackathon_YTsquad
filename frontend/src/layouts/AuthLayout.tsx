import { Outlet } from "react-router-dom";
import { Boxes, ShieldCheck, Workflow } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-600 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <Boxes className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">SyncFlow</span>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Every asset,
            <br /> tracked end to end.
          </h1>
          <p className="max-w-md text-primary-100">
            Allocation, transfers, maintenance and depreciation — one system of record
            for everything your organization owns.
          </p>
          <div className="space-y-3 pt-2 text-sm text-primary-50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Role-based access for every team
            </div>
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4" /> Full lifecycle: request to retirement
            </div>
          </div>
        </div>

        <p className="relative text-xs text-primary-100/70">© {new Date().getFullYear()} SyncFlow</p>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-6 dark:bg-surface-dark">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
