import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "number" | "email";
  required?: boolean;
}

interface ReferenceService {
  list: (params?: Record<string, unknown>) => Promise<{ data: any[]; pagination: { pages: number; total: number } }>;
  create: (payload: Record<string, unknown>) => Promise<any>;
  update: (id: string, payload: Record<string, unknown>) => Promise<any>;
  remove: (id: string) => Promise<any>;
}

interface ReferenceCrudPageProps {
  title: string;
  service: ReferenceService;
  fields: FieldConfig[];
  columns: { key: string; label: string }[];
}

const ReferenceCrudPage = ({ title, service, fields, columns }: ReferenceCrudPageProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await service.list({ keyword, limit: 50 });
      setItems(res.data);
    } catch {
      toast.error(`Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    reset(Object.fromEntries(fields.map((f) => [f.name, ""])));
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    reset(Object.fromEntries(fields.map((f) => [f.name, item[f.name] ?? ""])));
    setDialogOpen(true);
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      if (editing) {
        await service.update(editing._id, values);
        toast.success(`${title.slice(0, -1)} updated`);
      } else {
        await service.create(values);
        toast.success(`${title.slice(0, -1)} created`);
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to save`);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (item: any) => {
    if (!confirm(`Remove "${item.name}"?`)) return;
    try {
      await service.remove(item._id);
      toast.success("Removed");
      load();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
          <p className="text-sm text-slate-500">{items.length} records</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add {title.slice(0, -1).toLowerCase()}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input placeholder={`Search ${title.toLowerCase()}...`} className="pl-9" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-left font-medium text-slate-500">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-400">
                  No records yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {item[c.key] ?? "—"}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(item)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <Input type={f.type || "text"} {...register(f.name, { required: f.required })} />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ReferenceCrudPage;
