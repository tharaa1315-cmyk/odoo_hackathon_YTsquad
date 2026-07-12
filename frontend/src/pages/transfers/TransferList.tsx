import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { StatusBadge } from "@/components/ui/Badge";
import { getTransfers, deleteTransfer } from "@/services/transferService";
import TransferForm from "./TransferForm";

const TransferList = () => {
    const [transfers, setTransfers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    const fetchTransfers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getTransfers();
            setTransfers(res.data);
        } catch {
            toast.error("Failed to load transfers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransfers();
    }, [fetchTransfers]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this transfer request?")) return;
        try {
            await deleteTransfer(id);
            toast.success("Transfer removed");
            fetchTransfers();
        } catch {
            toast.error("Failed to remove transfer");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asset Transfers</h1>
                    <p className="text-sm text-slate-500">Manage asset requests and allocations</p>
                </div>
                <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
                    <Plus className="h-4 w-4" /> Request Transfer
                </Button>
            </div>

            <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Asset</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Requested By</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Reason</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Loading transfers...</td></tr>
                        ) : transfers.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No transfers found.</td></tr>
                        ) : (
                            transfers.map((t) => (
                                <tr key={t._id} className="border-b border-slate-100 dark:border-slate-800">
                                    <td className="px-4 py-3 font-medium">{t.asset?.name || "Unknown Asset"}</td>
                                    <td className="px-4 py-3">{t.requestedBy?.name || "Unknown User"}</td>
                                    <td className="px-4 py-3 text-slate-500">{t.reason}</td>
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

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Update Transfer" : "Request Transfer"} maxWidth="max-w-md">
                <TransferForm transfer={editing} onCancel={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); fetchTransfers(); }} />
            </Dialog>
        </div>
    );
};

export default TransferList;
