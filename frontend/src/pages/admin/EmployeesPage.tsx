import ReferenceCrudPage from "@/pages/assets/ReferenceCrudPage";
import { employeeService } from "@/services/refDataService";

const EmployeesPage = () => (
  <ReferenceCrudPage
    title="Employees"
    service={employeeService}
    fields={[
      { name: "employeeId", label: "Employee ID", required: true },
      { name: "name", label: "Full name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "designation", label: "Designation" },
    ]}
    columns={[
      { key: "employeeId", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "designation", label: "Designation" },
    ]}
  />
);

export default EmployeesPage;
