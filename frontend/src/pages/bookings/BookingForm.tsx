import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { assetService } from "@/services/assetService";
import { createBooking, updateBookingStatus } from "@/services/bookingService";
import type { Asset } from "@/types";
import toast from "react-hot-toast";

const BookingForm = ({ booking, onCancel, onSaved }: { booking?: any, onCancel: () => void, onSaved: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [formData, setFormData] = useState({
        asset: booking?.asset?._id || "",
        title: booking?.title || "",
        startTime: booking?.startTime ? new Date(booking.startTime).toISOString().slice(0, 16) : "",
        endTime: booking?.endTime ? new Date(booking.endTime).toISOString().slice(0, 16) : "",
        notes: booking?.notes || "",
        status: booking?.status || "upcoming",
    });

    useEffect(() => {
        // Ideally, only fetch isShared: true assets. For now, fetch all or specify keyword.
        assetService.list({ limit: 100 }).then(res => setAssets(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (booking) {
                await updateBookingStatus(booking._id, formData.status);
                toast.success("Booking updated");
            } else {
                await createBooking(formData);
                toast.success("Booking created");
            }
            onSaved();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save booking. Check for conflicts.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Resource / Asset</label>
                <Select required value={formData.asset} onChange={e => setFormData({ ...formData, asset: e.target.value })} disabled={!!booking}>
                    <option value="">Select Resource</option>
                    {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Meeting / Event Title</label>
                <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} disabled={!!booking} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <Input type="datetime-local" required value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} disabled={!!booking} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <Input type="datetime-local" required value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} disabled={!!booking} />
                </div>
            </div>

            {booking && (
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Select>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : booking ? "Update Booking" : "Book Resource"}</Button>
            </div>
        </form>
    );
};

export default BookingForm;
