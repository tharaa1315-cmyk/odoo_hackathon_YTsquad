import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { assetService } from "@/services/assetService";
import { createTransfer, updateTransferStatus } from "@/services/transferService";
import type { Asset } from "@/types";
import toast from "react-hot-toast";

const TransferForm = ({ transfer, onCancel, onSaved }: { transfer?: any, onCancel: () => void, onSaved: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [formData, setFormData] = useState({
        asset: transfer?.asset?._id || "",
        reason: transfer?.reason || "",
        status: transfer?.status || "pending_dept_head",
        step: transfer ? "dept_head" : "" // For updating status
    });

    useEffect(() => {
        assetService.list({ limit: 100 }).then(res => setAssets(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (transfer) {
                await updateTransferStatus(transfer._id, { status: formData.status, step: formData.step });
                toast.success("Transfer updated");
            } else {
                await createTransfer(formData);
                toast.success("Transfer requested");
            }
            onSaved();
        } catch {
            toast.error("Failed to save transfer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Asset</label>
                <Select required value={formData.asset} onChange={e => setFormData({ ...formData, asset: e.target.value })} disabled={!!transfer}>
                    <option value="">Select Asset to transfer</option>
                    {assets.map(a => <option key={a._id} value={a._id}>{a.name} ({a.assetId})</option>)}
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Reason for Transfer</label>
                <Input required value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} disabled={!!transfer} />
            </div>

            {transfer && (
                <>
                    <div>
                        <label className="block text-sm font-medium mb-1">Update Status</label>
                        <Select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="pending_dept_head">Pending Dept Head</option>
                            <option value="pending_asset_manager">Pending Asset Manager</option>
                            <option value="approved">Approved / Completed</option>
                            <option value="rejected">Rejected</option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Approval Step</label>
                        <Select required value={formData.step} onChange={e => setFormData({ ...formData, step: e.target.value })}>
                            <option value="dept_head">Department Head</option>
                            <option value="asset_manager">Asset Manager</option>
                        </Select>
                    </div>
                </>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : transfer ? "Update Transfer" : "Request Transfer"}</Button>
            </div>
        </form>
    );
};

export default TransferForm;
