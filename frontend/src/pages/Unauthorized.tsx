import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

const Unauthorized = () => (
  <div className="flex h-screen flex-col items-center justify-center text-center">
    <ShieldAlert className="h-12 w-12 text-red-500" />
    <h2 className="mt-3 text-xl font-semibold text-slate-800">Access restricted</h2>
    <p className="mt-1 text-sm text-slate-500">You don't have permission to view this page.</p>
    <Link to="/" className="mt-6">
      <Button variant="outline">Back home</Button>
    </Link>
  </div>
);

export default Unauthorized;
