import { Boxes, ClipboardList, Wrench, Bell } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/context/AuthContext";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500">Your assets and requests at a glance</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My assets" value="—" icon={Boxes} accent="primary" hint="Allocation module" />
        <StatCard label="Open requests" value="—" icon={ClipboardList} accent="indigo" hint="Requests module" />
        <StatCard label="Maintenance tickets" value="—" icon={Wrench} accent="amber" hint="Maintenance module" />
        <StatCard label="Notifications" value="—" icon={Bell} accent="red" />
      </div>

      <div className="card p-6 text-sm text-slate-500">
        Asset requests, returns, and damage reporting are part of the next build phase, once the
        Allocation and Maintenance modules are wired in.
      </div>
    </div>
  );
};

export default EmployeeDashboard;
