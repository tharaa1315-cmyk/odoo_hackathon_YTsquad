import { useState } from "react";
import { Boxes, ClipboardList, Wrench, Bell, QrCode, X, Search } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { QRScanner } from "@/components/QRScanner";
import { StatusBadge } from "@/components/ui/Badge";
import axios from "axios";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<any>(null);
  const [scanloading, setScanLoading] = useState(false);

  const handleScan = async (decodedText: string) => {
    try {
      const parsed = JSON.stringify(decodedText) ? JSON.parse(decodedText) : null;
      if (!parsed || !parsed.assetId) return;

      setShowScanner(false);
      setScanLoading(true);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/assets`, {
        params: { search: parsed.assetId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data?.data?.length > 0) {
        // filter exact match
        const exact = res.data.data.find((a: any) => a.assetId === parsed.assetId);
        if (exact) setScannedAsset(exact);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500">Your assets and requests at a glance</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My assets" value="—" icon={Boxes} accent="primary" hint="Allocation module" />
        <StatCard label="Open requests" value="—" icon={ClipboardList} accent="indigo" hint="Requests module" />
        <StatCard label="Maintenance tickets" value="—" icon={Wrench} accent="amber" hint="Maintenance module" />
        <StatCard label="Notifications" value="—" icon={Bell} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary-600" />
              Scan Asset QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showScanner && !scannedAsset && (
              <div className="text-center py-6">
                <Button onClick={() => setShowScanner(true)} className="gap-2">
                  <QrCode className="h-5 w-5" /> Open Scanner
                </Button>
              </div>
            )}

            {showScanner && (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 z-10 p-2 text-xs"
                  onClick={() => setShowScanner(false)}
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <div className="pt-8">
                  <QRScanner onScan={handleScan} />
                </div>
              </div>
            )}

            {scanloading && <div className="text-center py-4 text-sm text-slate-500">Fetching asset details...</div>}

            {scannedAsset && (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{scannedAsset.name}</h3>
                    <p className="text-sm text-slate-500">{scannedAsset.assetId}</p>
                  </div>
                  <Button variant="ghost" className="h-8 w-8 p-1" onClick={() => setScannedAsset(null)}><X className="h-4 w-4" /></Button>
                </div>

                {scannedAsset.assignedEmployee?._id === user?._id && (
                  <div className="rounded-md bg-emerald-50 p-3 flex items-center gap-2 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">This asset is assigned to you</span>
                  </div>
                )}

                <dl className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                  <div>
                    <dt className="text-slate-500">Category</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{scannedAsset.category?.name || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Department</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{scannedAsset.department?.name || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Location</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{scannedAsset.location?.name || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Assigned To</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{scannedAsset.assignedEmployee?.name || "Unassigned"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Status</dt>
                    <dd className="mt-1"><StatusBadge status={scannedAsset.status} /></dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Warranty</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{scannedAsset.warrantyExpiry?.slice(0, 10) || "—"}</dd>
                  </div>
                </dl>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Guide</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 space-y-4">
            <p>Asset requests, returns, and damage reporting are part of the next build phase, once the Allocation and Maintenance modules are wired in.</p>
            <p>Use the QR Scanner tool to identify any asset instantly in the office.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
