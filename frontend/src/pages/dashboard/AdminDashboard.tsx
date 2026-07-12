import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, DollarSign, ShieldAlert, Wrench, Plus, ArrowRight, UserPlus, Check, X } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import StatCard from "@/components/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { assetService } from "@/services/assetService";

import axios from "axios";
import toast from "react-hot-toast";

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
  const [requests, setRequests] = useState<any[]>([]);
  const [reqLoading, setReqLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/organizations/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      setRequests(res.data);
    } catch {
      setRequests([]);
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
    assetService
      .stats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));

    fetchRequests();
  }, []);

  const handleProcess = async (userId: string, action: "approve" | "reject", role?: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/organizations/process`, { userId, action, role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      toast.success(action === "approve" ? "User approved" : "User rejected");
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to process request");
    }
  };

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <UserPlus className="h-5 w-5 text-indigo-500" /> Pending Join Requests
            {requests.length > 0 && (
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {requests.length} pending
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role Assignment</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {reqLoading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center bg-slate-50/50 dark:bg-slate-900/30">No pending requests</td></tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{r.name}</td>
                    <td className="px-6 py-4">{r.email}</td>
                    <td className="px-6 py-4">
                      <select
                        id={`role-${r._id}`}
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
                        defaultValue=""
                      >
                        <option value="" disabled>Select Role...</option>
                        <option value="employee">Employee</option>
                        <option value="department_manager">Department Head</option>
                        <option value="asset_manager">Asset Manager</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                          onClick={() => {
                            const sel = document.getElementById(`role-${r._id}`) as HTMLSelectElement;
                            if (!sel.value) return toast.error("Please select a role first");
                            handleProcess(r._id, "approve", sel.value);
                          }}
                        >
                          <Check className="h-3 w-3" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                          onClick={() => handleProcess(r._id, "reject")}
                        >
                          <X className="h-3 w-3" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
