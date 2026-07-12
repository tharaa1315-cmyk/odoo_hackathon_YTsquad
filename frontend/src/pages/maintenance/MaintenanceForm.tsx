import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { assetService } from "@/services/assetService";
import { createMaintenanceTicket, updateMaintenanceTicket } from "@/services/maintenanceService";
import type { Asset } from "@/types";
import toast from "react-hot-toast";

const MaintenanceForm = ({ ticket, onCancel, onSaved }: { ticket?: any, onCancel: () => void, onSaved: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [formData, setFormData] = useState({
        asset: ticket?.asset?._id || "",
        issueDescription: ticket?.issueDescription || "",
        priority: ticket?.priority || "medium",
        status: ticket?.status || "pending",
    });

    useEffect(() => {
        assetService.list({ limit: 100 }).then(res => setAssets(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (ticket) {
                await updateMaintenanceTicket(ticket._id, formData);
                toast.success("Ticket updated");
            } else {
                await createMaintenanceTicket(formData);
                toast.success("Ticket created");
            }
            onSaved();
        } catch {
            toast.error("Failed to save ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Asset</label>
                <Select required value={formData.asset} onChange={e => setFormData({ ...formData, asset: e.target.value })} disabled={!!ticket}>
                    <option value="">Select Asset</option>
                    {assets.map(a => <option key={a._id} value={a._id}>{a.name} ({a.assetId})</option>)}
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Issue Description</label>
                <Input required value={formData.issueDescription} onChange={e => setFormData({ ...formData, issueDescription: e.target.value })} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <Select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </Select>
            </div>
            {ticket && (
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </Select>
                </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Ticket"}</Button>
            </div>
        </form>
    );
};

export default MaintenanceForm;
