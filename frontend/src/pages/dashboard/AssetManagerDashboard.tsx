import { useEffect, useState } from "react";
import { Boxes, Wrench, PackageCheck, ArrowLeftRight } from "lucide-react";
import StatCard from "@/components/StatCard";
import { assetService } from "@/services/assetService";

const AssetManagerDashboard = () => {
  const [stats, setStats] = useState<{ total: number; byStatus: { _id: string; count: number }[] } | null>(null);

  useEffect(() => {
    assetService.stats().then(setStats).catch(() => setStats(null));
  }, []);

  const count = (id: string) => stats?.byStatus.find((s) => s._id === id)?.count || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asset Monitoring</h1>
        <p className="text-sm text-slate-500">Live status across allocation, maintenance and transfers</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total assets" value={stats?.total ?? "…"} icon={Boxes} accent="primary" />
        <StatCard label="Allocated" value={count("allocated")} icon={PackageCheck} accent="indigo" />
        <StatCard label="In maintenance" value={count("in_maintenance")} icon={Wrench} accent="amber" />
        <StatCard label="Available" value={count("available")} icon={ArrowLeftRight} accent="emerald" />
      </div>

      <div className="card p-6 text-sm text-slate-500">
        Maintenance scheduling, allocation and transfer workflows are being built in the next phase.
        The Asset Monitoring table below already reflects live data from the Assets module.
      </div>
    </div>
  );
};

export default AssetManagerDashboard;
