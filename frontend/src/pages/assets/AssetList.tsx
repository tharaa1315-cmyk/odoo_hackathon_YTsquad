import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Plus, Search, Pencil, Trash2, Archive, Eye, ChevronLeft, ChevronRight, QrCode } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Dialog } from "@/components/ui/Dialog";
import { StatusBadge } from "@/components/ui/Badge";
import { assetService } from "@/services/assetService";
import type { Asset } from "@/types";
import AssetForm from "./AssetForm";

const columnHelper = createColumnHelper<Asset>();

const refName = (v: unknown) => (v && typeof v === "object" && "name" in v ? (v as { name: string }).name : "—");

const AssetList = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await assetService.list({ keyword, status: status || undefined, page, limit: 10 });
      setAssets(res.data);
      setPages(res.pagination.pages);
      setTotal(res.pagination.total);
    } catch {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, [keyword, status, page]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleDelete = async (asset: Asset) => {
    if (!confirm(`Remove "${asset.name}"? This can't be undone.`)) return;
    try {
      await assetService.remove(asset._id);
      toast.success("Asset removed");
      fetchAssets();
    } catch {
      toast.error("Failed to remove asset");
    }
  };

  const handleScrap = async (asset: Asset) => {
    if (!confirm(`Scrap "${asset.name}"? It will move to the Scrap status but its history is kept.`)) return;
    try {
      await assetService.scrap(asset._id);
      toast.success("Asset scrapped");
      fetchAssets();
    } catch {
      toast.error("Failed to scrap asset");
    }
  };

  const downloadQR = (asset: Asset) => {
    if (!asset.qrCode) return toast.error("No QR Code available");
    const a = document.createElement("a");
    a.href = asset.qrCode;
    a.download = `QR_${asset.assetId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("assetId", { header: "Asset ID" }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">{info.getValue()}</p>
            <p className="text-xs text-slate-400">
              {info.row.original.brand} {info.row.original.model}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor((row) => refName(row.category), { id: "category", header: "Category" }),
      columnHelper.accessor((row) => refName(row.location), { id: "location", header: "Location" }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("currentValue", {
        header: "Value",
        cell: (info) => `$${(info.getValue() || 0).toLocaleString()}`,
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <div className="flex justify-end gap-1">
            <Link
              to={`/assets/${info.row.original._id}`}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                const url = info.row.original.qrCode;
                if (!url) return toast.error("No QR code found");
                const w = window.open("", "_blank");
                if (w) {
                  w.document.write(`<html><body style="display:flex;flex-direction:column;align-items:center;margin-top:50px;font-family:sans-serif;"><h2>${info.row.original.name}</h2><p>${info.row.original.assetId}</p><img src="${url}" style="width:300px;height:300px;"/><br/><button onclick="window.print()">Print</button><button onclick="window.close()" style="margin-left:10px;">Close</button></body></html>`);
                  w.document.close();
                }
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
              title="Print QR"
            >
              <QrCode className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setEditing(info.row.original);
                setFormOpen(true);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleScrap(info.row.original)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800"
            >
              <Archive className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({ data: assets, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Assets</h1>
          <p className="text-sm text-slate-500">{total} total assets</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add asset
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, asset ID, serial number..."
            className="pl-9"
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
          />
        </div>
        <Select
          className="w-48"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
          <option value="in_maintenance">In maintenance</option>
          <option value="requested">Requested</option>
          <option value="scrapped">Scrapped</option>
          <option value="lost">Lost</option>
        </Select>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-medium text-slate-500">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  Loading assets…
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  No assets found. Try adjusting filters or add a new asset.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit asset" : "Add asset"}
        maxWidth="max-w-2xl"
      >
        <AssetForm
          asset={editing}
          onCancel={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            fetchAssets();
          }}
        />
      </Dialog>
    </div>
  );
};

export default AssetList;
