import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, DollarSign, ShieldAlert, Wrench, Plus, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import StatCard from "@/components/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { assetService } from "@/services/assetService";

interface StatsShape {
  total: number;
  totalValue: number;
  warrantyExpiringSoon: number;
  byStatus: { _id: string; count: number }[];
}

const COLORS = ["#2563EB", "#0ea5e9", "#f59e0b", "#6366f1", "#94a3b8", "#ef4444"];

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsShape | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetService
      .stats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const inMaintenance = stats?.byStatus.find((s) => s._id === "in_maintenance")?.count || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
          <p className="text-sm text-slate-500">Organization-wide asset snapshot</p>
        </div>
        <Link to="/admin/assets">
          <Button>
            <Plus className="h-4 w-4" /> Add asset
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total assets" value={loading ? "…" : stats?.total ?? 0} icon={Boxes} accent="primary" />
        <StatCard
          label="Total asset value"
          value={loading ? "…" : `$${(stats?.totalValue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard label="In maintenance" value={loading ? "…" : inMaintenance} icon={Wrench} accent="amber" />
        <StatCard
          label="Warranty expiring (30d)"
          value={loading ? "…" : stats?.warrantyExpiringSoon ?? 0}
          icon={ShieldAlert}
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assets by status</CardTitle>
            <Link to="/admin/assets" className="flex items-center gap-1 text-sm text-primary-600 hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <div className="h-72">
            {stats && stats.byStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byStatus}
                    dataKey="count"
                    nameKey="_id"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {stats.byStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No asset data yet — add your first asset to see analytics here.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {[
              { label: "Add new asset", to: "/admin/assets" },
              { label: "Manage categories", to: "/admin/categories" },
              { label: "Manage locations", to: "/admin/locations" },
              { label: "View pending maintenance", to: "/admin/maintenance" },
              { label: "Generate reports", to: "/admin/reports" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-primary-300 hover:bg-primary-50/50 dark:border-slate-800 dark:text-slate-300"
              >
                {a.label} <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
