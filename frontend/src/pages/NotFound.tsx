import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const NotFound = () => (
  <div className="flex h-screen flex-col items-center justify-center text-center">
    <p className="text-6xl font-bold text-primary-600">404</p>
    <h2 className="mt-2 text-xl font-semibold text-slate-800">Page not found</h2>
    <p className="mt-1 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
    <Link to="/" className="mt-6">
      <Button>Back home</Button>
    </Link>
  </div>
);

export default NotFound;
