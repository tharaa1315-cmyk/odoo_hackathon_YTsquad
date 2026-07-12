import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/analyticsService";
import { Boxes, PackageCheck, Wrench, RefreshCw, BarChart2 } from "lucide-react";
import StatCard from "@/components/StatCard";

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then((res) => {
                setStats(res.data);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-primary-600" /> Organization Analytics
                </h1>
                <p className="text-sm text-slate-500">Live reporting of system usage</p>
            </div>

            {loading ? (
                <div className="text-center p-10 text-slate-500">Loading metrics...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Assets" value={stats?.assets?.total || 0} icon={Boxes} accent="primary" />
                    <StatCard label="Allocated Assets" value={stats?.assets?.allocated || 0} icon={PackageCheck} accent="emerald" />
                    <StatCard label="In Maintenance" value={stats?.assets?.inMaintenance || 0} icon={Wrench} accent="amber" />
                    <StatCard label="Active Bookings" value={stats?.bookings?.active || 0} icon={RefreshCw} accent="indigo" />
                </div>
            )}

            {/* Placeholder for complex SVG Charts like LineChart, PieChart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card h-64 flex flex-col justify-center items-center text-slate-400 bg-slate-50 dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg">
                    <p>Asset Lifecycle Chart</p>
                    <p className="text-xs mt-2">Visual graphs go here</p>
                </div>
                <div className="card h-64 flex flex-col justify-center items-center text-slate-400 bg-slate-50 dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg">
                    <p>Department Utilization</p>
                    <p className="text-xs mt-2">Visual graphs go here</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
