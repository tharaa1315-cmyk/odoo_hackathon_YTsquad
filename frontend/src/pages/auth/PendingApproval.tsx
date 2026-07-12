import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PendingApproval = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="w-full max-w-md text-center space-y-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
                    <Clock className="h-8 w-8 animate-pulse" />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Awaiting Approval
                </h2>

                <p className="text-base text-slate-600 dark:text-slate-400">
                    Your request to join the organization has been submitted. You will be able to access your dashboard as soon as the administrator approves your request and assigns a role.
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="mb-4 text-sm text-slate-500 dark:text-slate-500">
                        Already approved? Refresh the page or sign in again.
                    </p>
                    <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
                        Refresh Page
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
