import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { StatusBadge } from "@/components/ui/Badge";
import { getAudits, createAudit, updateAudit } from "@/services/auditService";
import { Input } from "@/components/ui/Input";

const AuditList = () => {
    const [audits, setAudits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const fetchAudits = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAudits();
            setAudits(res.data);
        } catch {
            toast.error("Failed to load audits");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAudits();
    }, [fetchAudits]);

    const handleCreate = async () => {
        if (!newTitle.trim()) return toast.error("Title required");
        try {
            await createAudit({ title: newTitle, assignedAuditor: "placeholder-id" }); // Using a placeholder for simplicity in this MVP view; backend will assign robustly.
            toast.success("Audit Cycle Started");
            setFormOpen(false);
            setNewTitle("");
            fetchAudits();
        } catch {
            toast.error("Failed to create audit");
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await updateAudit(id, { status: "completed" });
            toast.success("Audit completed");
            fetchAudits();
        } catch {
            toast.error("Failed to update audit");
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asset Audits</h1>
                    <p className="text-sm text-slate-500">Track and verify physical assets</p>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Start Audit Cycle
                </Button>
            </div>

            <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Title</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Auditor</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">Loading audits...</td></tr>
                        ) : audits.length === 0 ? (
                            <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">No audits found.</td></tr>
                        ) : (
                            audits.map((a) => (
                                <tr key={a._id} className="border-b border-slate-100 dark:border-slate-800">
                                    <td className="px-4 py-3 font-medium">{a.title}</td>
                                    <td className="px-4 py-3 text-slate-500">{a.assignedAuditor?.name || "Unassigned"}</td>
                                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                                    <td className="px-4 py-3 flex justify-end gap-1">
                                        {a.status !== "completed" && (
                                            <button onClick={() => handleComplete(a._id)} className="p-1.5 text-slate-400 hover:text-emerald-600 tooltip" title="Mark Complete">
                                                <CheckSquare className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} title="Start New Audit Cycle" maxWidth="max-w-md">
                <div className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Audit Name / Cycle</label>
                        <Input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Q3 Asset Inventory..." />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate}>Start Audit</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AuditList;
