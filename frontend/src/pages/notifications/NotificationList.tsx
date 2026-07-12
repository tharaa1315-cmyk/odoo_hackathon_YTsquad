import { useState, useEffect, useCallback } from "react";
import { Check, MailOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "@/services/notificationService";

const NotificationList = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyNotifications();
            setNotifications(res.data);
        } catch {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkRead = async (id: string, isAlreadyRead: boolean) => {
        if (isAlreadyRead) return;
        try {
            await markNotificationRead(id);
            fetchNotifications();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            toast.success("Marked all as read");
            fetchNotifications();
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications</h1>
                    <p className="text-sm text-slate-500">System alerts and workflow approvals</p>
                </div>
                <Button variant="outline" onClick={handleMarkAllRead}>
                    <Check className="h-4 w-4 mr-2" /> Mark All Read
                </Button>
            </div>

            <div className="space-y-3 mt-4">
                {loading ? (
                    <div className="text-center p-10 text-slate-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center p-10 text-slate-400 card border-dashed">You're all caught up! No notifications.</div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n._id}
                            className={`card p-4 flex gap-4 transition-colors ${n.isRead ? "bg-slate-50 opacity-75 dark:bg-slate-800/50" : "bg-white dark:bg-slate-800 border-l-4 border-l-primary-500"}`}
                        >
                            <div className="flex-shrink-0 mt-1">
                                <MailOpen className={`w-5 h-5 ${n.isRead ? "text-slate-400" : "text-primary-500"}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`text-sm font-semibold ${n.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                                        {n.title}
                                    </h4>
                                    <span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                            </div>
                            {!n.isRead && (
                                <button
                                    onClick={() => handleMarkRead(n._id, n.isRead)}
                                    className="text-primary-600 text-sm font-medium hover:underline flex items-center h-fit self-center"
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationList;
