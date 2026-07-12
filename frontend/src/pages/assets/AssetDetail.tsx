import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, MapPin, Building2, User as UserIcon, Tag } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { assetService } from "@/services/assetService";
import type { Asset } from "@/types";

const refName = (v: unknown) => (v && typeof v === "object" && "name" in v ? (v as { name: string }).name : "—");

interface HistoryEntry {
  action: string;
  note?: string;
  createdAt: string;
  performedBy?: { name: string };
}

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<(Asset & { history?: HistoryEntry[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    assetService
      .get(id)
      .then((data) => setAsset(data as Asset & { history?: HistoryEntry[] }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-slate-400">Loading asset…</p>;
  if (!asset) return <p className="text-sm text-slate-400">Asset not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/admin/assets" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to assets
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{asset.name}</h1>
            <StatusBadge status={asset.status} />
          </div>
          <p className="text-sm text-slate-500">
            {asset.assetId} · {asset.brand} {asset.model}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail icon={Tag} label="Category" value={refName(asset.category)} />
            <Detail icon={MapPin} label="Location" value={refName(asset.location)} />
            <Detail icon={Building2} label="Department" value={refName(asset.department)} />
            <Detail icon={UserIcon} label="Assigned to" value={refName(asset.assignedEmployee)} />
            <Detail icon={Calendar} label="Purchase date" value={asset.purchaseDate?.slice(0, 10) || "—"} />
            <Detail icon={DollarSign} label="Purchase cost" value={`$${(asset.purchaseCost || 0).toLocaleString()}`} />
            <Detail icon={Calendar} label="Warranty expiry" value={asset.warrantyExpiry?.slice(0, 10) || "—"} />
            <Detail icon={DollarSign} label="Current value" value={`$${(asset.currentValue || 0).toLocaleString()}`} />
            <Detail icon={Tag} label="Serial number" value={asset.serialNumber || "—"} />
            <Detail icon={Tag} label="Vendor" value={refName(asset.vendor)} />
          </dl>
          {asset.description && (
            <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
              {asset.description}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR code</CardTitle>
          </CardHeader>
          {asset.qrCode ? (
            <img src={asset.qrCode} alt="Asset QR code" className="mx-auto w-40 rounded-xl border border-slate-100" />
          ) : (
            <p className="text-center text-sm text-slate-400">No QR code generated</p>
          )}
          <p className="mt-3 text-center text-xs text-slate-400">Scan to identify {asset.assetId}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity timeline</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {asset.history && asset.history.length > 0 ? (
            [...asset.history].reverse().map((h, i) => (
              <div key={i} className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-600" />
                <div>
                  <p className="text-sm font-medium capitalize text-slate-800 dark:text-slate-100">
                    {h.action.replace("_", " ")}
                  </p>
                  {h.note && <p className="text-sm text-slate-500">{h.note}</p>}
                  <p className="text-xs text-slate-400">
                    {new Date(h.createdAt).toLocaleString()} {h.performedBy?.name && `· ${h.performedBy.name}`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No activity recorded yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

const Detail = ({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) => (
  <div className="flex items-start gap-2.5">
    <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-700 dark:text-slate-200">{value}</dd>
    </div>
  </div>
);

export default AssetDetail;
