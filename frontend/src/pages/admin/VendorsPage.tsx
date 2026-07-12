import ReferenceCrudPage from "@/pages/assets/ReferenceCrudPage";
import { vendorService } from "@/services/refDataService";

const VendorsPage = () => (
  <ReferenceCrudPage
    title="Vendors"
    service={vendorService}
    fields={[
      { name: "name", label: "Vendor name", required: true },
      { name: "contactPerson", label: "Contact person" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "contactPerson", label: "Contact" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
    ]}
  />
);

export default VendorsPage;
