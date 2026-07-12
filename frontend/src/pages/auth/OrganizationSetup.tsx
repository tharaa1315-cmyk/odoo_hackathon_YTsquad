import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Search, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import axios from "axios";

// Directly call org API endpoints since there is no orgService yet, or we'll create it.
// We'll use axios with bearer token from the context/localStorage.

const OrganizationSetup = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"join" | "create">("create");
    const [loading, setLoading] = useState(false);

    // Forms
    const [orgName, setOrgName] = useState("");
    const [orgDesc, setOrgDesc] = useState("");
    const [joinCode, setJoinCode] = useState("");

    const getToken = () => localStorage.getItem("syncflow_token") || "";

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/organizations/create`,
                { name: orgName, description: orgDesc },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success("Organization created successfully! You are now the Administrator.");
            await refreshUser(); // updates context, which will trigger route redirect
            navigate("/admin/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create organization");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/organizations/join`,
                { organizationCode: joinCode },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success("Join request submitted. Awaiting approval.");
            await refreshUser();
            navigate("/pending-approval");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid organization code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-8 rounded-2xl bg-white dark:bg-surface-dark">
            <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <Building2 className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">Organization Setup</h2>
                <p className="mt-2 text-sm text-slate-500">Welcome, {user?.name}. To continue, please create or join an organization.</p>
            </div>

            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                    type="button"
                    className={`w-1/2 rounded-md py-2 text-sm font-medium transition-all ${activeTab === "create" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                    onClick={() => setActiveTab("create")}
                >
                    Create Organization
                </button>
                <button
                    type="button"
                    className={`w-1/2 rounded-md py-2 text-sm font-medium transition-all ${activeTab === "join" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                    onClick={() => setActiveTab("join")}
                >
                    Join Organization
                </button>
            </div>

            {activeTab === "create" ? (
                <form className="mt-8 space-y-6" onSubmit={handleCreate}>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Organization Name</label>
                            <Input required value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Corp" />
                        </div>
                        <div>
                            <label className="label">Description (Optional)</label>
                            <Input value={orgDesc} onChange={(e) => setOrgDesc(e.target.value)} placeholder="Industry-leading tracking solutions" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full gap-2" loading={loading}>
                        Create Organization <ArrowRight className="h-4 w-4" />
                    </Button>
                </form>
            ) : (
                <form className="mt-8 space-y-6" onSubmit={handleJoin}>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Organization Code</label>
                            <Input required value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Enter ID or Code (e.g., A1B2C3D4)" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full gap-2" variant="outline" loading={loading}>
                        <Search className="h-4 w-4" /> Join Organization
                    </Button>
                </form>
            )}
        </div>
    );
};

export default OrganizationSetup;
