import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { StatusBadge } from "@/components/ui/Badge";
import { getMaintenanceTickets, deleteMaintenanceTicket } from "@/services/maintenanceService";
import MaintenanceForm from "./MaintenanceForm";

const MaintenanceList = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMaintenanceTickets();
            setTickets(res.data);
        } catch {
            toast.error("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this ticket?")) return;
        try {
            await deleteMaintenanceTicket(id);
            toast.success("Ticket removed");
            fetchTickets();
        } catch {
            toast.error("Failed to remove ticket");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Maintenance</h1>
                    <p className="text-sm text-slate-500">Manage asset repairs and servicing</p>
                </div>
                <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
                    <Plus className="h-4 w-4" /> Request Maintenance
                </Button>
            </div>

            <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Asset</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Issue</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Priority</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Loading tickets...</td></tr>
                        ) : tickets.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No maintenance tickets found.</td></tr>
                        ) : (
                            tickets.map((t) => (
                                <tr key={t._id} className="border-b border-slate-100 dark:border-slate-800">
                                    <td className="px-4 py-3 font-medium">{t.asset?.name || "Unknown Asset"}</td>
                                    <td className="px-4 py-3 text-slate-500">{t.issueDescription}</td>
                                    <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                                    <td className="px-4 py-3 flex justify-end gap-1">
                                        <button onClick={() => { setEditing(t); setFormOpen(true); }} className="p-1.5 text-slate-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(t._id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Update Ticket" : "Request Maintenance"} maxWidth="max-w-md">
                <MaintenanceForm ticket={editing} onCancel={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); fetchTickets(); }} />
            </Dialog>
        </div>
    );
};

export default MaintenanceList;
