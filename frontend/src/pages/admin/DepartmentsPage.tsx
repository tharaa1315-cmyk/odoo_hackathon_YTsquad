import ReferenceCrudPage from "@/pages/assets/ReferenceCrudPage";
import { departmentService } from "@/services/refDataService";

const DepartmentsPage = () => (
  <ReferenceCrudPage
    title="Departments"
    service={departmentService}
    fields={[
      { name: "name", label: "Department name", required: true },
      { name: "code", label: "Code" },
      { name: "description", label: "Description" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "code", label: "Code" },
      { key: "description", label: "Description" },
    ]}
  />
);

export default DepartmentsPage;
