import { Construction } from "lucide-react";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex h-[70vh] flex-col items-center justify-center text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-600/10">
      <Construction className="h-7 w-7" />
    </div>
    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
    <p className="mt-1.5 max-w-sm text-sm text-slate-500">
      This module is scheduled for the next build phase, following the same CRUD, search,
      filter, and pagination patterns already used in the Assets module.
    </p>
  </div>
);

export default PlaceholderPage;
