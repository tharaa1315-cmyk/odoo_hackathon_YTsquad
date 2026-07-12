import ReferenceCrudPage from "@/pages/assets/ReferenceCrudPage";
import { categoryService } from "@/services/refDataService";

const CategoriesPage = () => (
  <ReferenceCrudPage
    title="Categories"
    service={categoryService}
    fields={[
      { name: "name", label: "Category name", required: true },
      { name: "code", label: "Code" },
      { name: "depreciationRate", label: "Depreciation rate (% / year)", type: "number" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "code", label: "Code" },
      { key: "depreciationRate", label: "Depreciation %" },
    ]}
  />
);

export default CategoriesPage;
