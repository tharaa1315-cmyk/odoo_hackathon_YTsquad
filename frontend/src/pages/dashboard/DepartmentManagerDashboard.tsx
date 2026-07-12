import { useEffect, useState } from "react";
import { Boxes, Users, ClipboardList, CheckSquare } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/context/AuthContext";
import { assetService } from "@/services/assetService";

const DepartmentManagerDashboard = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const deptId = typeof user?.department === "object" ? user.department._id : user?.department;
    assetService
      .list(deptId ? { department: deptId, limit: 1 } : { limit: 1 })
      .then((res) => setTotal(res.pagination.total))
      .catch(() => setTotal(null));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Department Overview</h1>
        <p className="text-sm text-slate-500">Assets and requests for your department</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Department assets" value={total ?? "…"} icon={Boxes} accent="primary" />
        <StatCard label="Team members" value="—" icon={Users} accent="indigo" hint="Employees module" />
        <StatCard label="Pending requests" value="—" icon={ClipboardList} accent="amber" hint="Requests module" />
        <StatCard label="Approvals due" value="—" icon={CheckSquare} accent="red" hint="Approvals module" />
      </div>

      <div className="card p-6 text-sm text-slate-500">
        Asset requests and approvals workflow are part of the next build phase.
      </div>
    </div>
  );
};

export default DepartmentManagerDashboard;
