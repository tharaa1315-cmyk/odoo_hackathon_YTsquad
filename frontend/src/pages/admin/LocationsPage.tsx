import ReferenceCrudPage from "@/pages/assets/ReferenceCrudPage";
import { locationService } from "@/services/refDataService";

const LocationsPage = () => (
  <ReferenceCrudPage
    title="Locations"
    service={locationService}
    fields={[
      { name: "name", label: "Location name", required: true },
      { name: "address", label: "Address" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "address", label: "Address" },
    ]}
  />
);

export default LocationsPage;
