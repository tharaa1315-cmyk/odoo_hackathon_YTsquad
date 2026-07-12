import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { StatusBadge } from "@/components/ui/Badge";
import { getBookings, deleteBooking } from "@/services/bookingService";
import BookingForm from "./BookingForm";

const BookingList = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getBookings();
            setBookings(res.data);
        } catch {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleDelete = async (id: string) => {
        if (!confirm("Cancel & remove this booking?")) return;
        try {
            await deleteBooking(id);
            toast.success("Booking removed");
            fetchBookings();
        } catch {
            toast.error("Failed to remove booking");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Resource Bookings</h1>
                    <p className="text-sm text-slate-500">Manage shared meeting rooms and assets</p>
                </div>
                <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
                    <Calendar className="h-4 w-4 mr-2" /> New Booking
                </Button>
            </div>

            <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Resource</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Booked By</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Title</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Time</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Loading bookings...</td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">No resource bookings found.</td></tr>
                        ) : (
                            bookings.map((b) => (
                                <tr key={b._id} className="border-b border-slate-100 dark:border-slate-800">
                                    <td className="px-4 py-3 font-medium">{b.asset?.name || "Unknown Resource"}</td>
                                    <td className="px-4 py-3">{b.user?.name || "Unknown User"}</td>
                                    <td className="px-4 py-3 font-medium">{b.title}</td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleTimeString()}
                                    </td>
                                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                    <td className="px-4 py-3 flex justify-end gap-1">
                                        <button onClick={() => { setEditing(b); setFormOpen(true); }} className="p-1.5 text-slate-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(b._id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Update Booking Status" : "Book Resource"} maxWidth="max-w-md">
                <BookingForm booking={editing} onCancel={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); fetchBookings(); }} />
            </Dialog>
        </div>
    );
};

export default BookingList;
