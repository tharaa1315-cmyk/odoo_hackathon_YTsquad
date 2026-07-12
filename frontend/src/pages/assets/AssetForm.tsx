import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { assetService } from "@/services/assetService";
import { categoryService, locationService, vendorService, departmentService, employeeService } from "@/services/refDataService";
import type { Asset, RefOption } from "@/types";

interface AssetFormProps {
  asset?: Asset | null;
  onSaved: () => void;
  onCancel: () => void;
}

interface AssetFormValues {
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  vendor: string;
  warrantyExpiry: string;
  status: string;
  location: string;
  department: string;
  assignedEmployee: string;
  description: string;
}

const AssetForm = ({ asset, onSaved, onCancel }: AssetFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [refData, setRefData] = useState<{
    categories: RefOption[];
    locations: RefOption[];
    vendors: RefOption[];
    departments: RefOption[];
    employees: RefOption[];
  }>({ categories: [], locations: [], vendors: [], departments: [], employees: [] });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormValues>({
    defaultValues: {
      name: asset?.name || "",
      category: typeof asset?.category === "object" ? asset.category._id : asset?.category || "",
      brand: asset?.brand || "",
      model: asset?.model || "",
      serialNumber: asset?.serialNumber || "",
      purchaseDate: asset?.purchaseDate?.slice(0, 10) || "",
      purchaseCost: asset?.purchaseCost || 0,
      currentValue: asset?.currentValue || 0,
      vendor: typeof asset?.vendor === "object" ? asset.vendor._id : asset?.vendor || "",
      warrantyExpiry: asset?.warrantyExpiry?.slice(0, 10) || "",
      status: asset?.status || "available",
      location: typeof asset?.location === "object" ? asset.location._id : asset?.location || "",
      department: typeof asset?.department === "object" ? asset.department._id : asset?.department || "",
      assignedEmployee:
        typeof asset?.assignedEmployee === "object" ? asset.assignedEmployee._id : asset?.assignedEmployee || "",
      description: asset?.description || "",
    },
  });

  useEffect(() => {
    Promise.all([
      categoryService.list({ limit: 100 }),
      locationService.list({ limit: 100 }),
      vendorService.list({ limit: 100 }),
      departmentService.list({ limit: 100 }),
      employeeService.list({ limit: 100 }),
    ]).then(([categories, locations, vendors, departments, employees]) => {
      setRefData({
        categories: categories.data,
        locations: locations.data,
        vendors: vendors.data,
        departments: departments.data,
        employees: employees.data,
      });
    });
  }, []);

  const onSubmit = async (values: AssetFormValues) => {
    setSubmitting(true);
    try {
      const payload: Partial<Asset> = {
        ...values,
        assignedEmployee: values.assignedEmployee || undefined,
        department: values.department || undefined,
        vendor: values.vendor || undefined,
      } as Partial<Asset>;

      if (asset) {
        await assetService.update(asset._id, payload);
        toast.success("Asset updated");
      } else {
        await assetService.create(payload);
        toast.success("Asset created");
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save asset");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Asset name</label>
          <Input error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        </div>

        <div>
          <label className="label">Category</label>
          <Select error={errors.category?.message} {...register("category", { required: "Category is required" })}>
            <option value="">Select category</option>
            {refData.categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="label">Location</label>
          <Select error={errors.location?.message} {...register("location", { required: "Location is required" })}>
            <option value="">Select location</option>
            {refData.locations.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="label">Brand</label>
          <Input {...register("brand")} />
        </div>
        <div>
          <label className="label">Model</label>
          <Input {...register("model")} />
        </div>

        <div>
          <label className="label">Serial number</label>
          <Input {...register("serialNumber")} />
        </div>
        <div>
          <label className="label">Status</label>
          <Select {...register("status")}>
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
            <option value="in_maintenance">In maintenance</option>
            <option value="requested">Requested</option>
            <option value="scrapped">Scrapped</option>
            <option value="lost">Lost</option>
          </Select>
        </div>

        <div>
          <label className="label">Purchase date</label>
          <Input type="date" {...register("purchaseDate")} />
        </div>
        <div>
          <label className="label">Purchase cost</label>
          <Input type="number" step="0.01" {...register("purchaseCost", { valueAsNumber: true })} />
        </div>

        <div>
          <label className="label">Current value</label>
          <Input type="number" step="0.01" {...register("currentValue", { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label">Warranty expiry</label>
          <Input type="date" {...register("warrantyExpiry")} />
        </div>

        <div>
          <label className="label">Vendor</label>
          <Select {...register("vendor")}>
            <option value="">None</option>
            {refData.vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="label">Department</label>
          <Select {...register("department")}>
            <option value="">None</option>
            {refData.departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="col-span-2">
          <label className="label">Assigned employee</label>
          <Select {...register("assignedEmployee")}>
            <option value="">Unassigned</option>
            {refData.employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="col-span-2">
          <label className="label">Description</label>
          <textarea className="input min-h-[90px]" {...register("description")} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          <Save className="h-4 w-4" /> {asset ? "Save changes" : "Create asset"}
        </Button>
      </div>
    </form>
  );
};

export default AssetForm;
