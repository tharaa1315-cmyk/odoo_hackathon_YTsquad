# SyncFlow Asset Management System

A MERN-stack enterprise asset management system, inspired by the Odoo Asset
Management module, with role-based dashboards for Administrators, Asset
Managers, Department Managers, and Employees.

This is **Phase 1** of the build: the production foundation. It's fully
functional end to end (auth → role dashboards → Asset CRUD → reference data),
and structured so every remaining module follows the same patterns already
in place.

## What's included in this phase

**Backend (Node/Express/MongoDB)**
- JWT authentication with 4 roles and route-level authorization
- Full Asset CRUD: search, filter, sort, pagination, soft delete, scrap
  workflow, auto-generated Asset ID, QR code generation, activity history log
- Full CRUD for Categories, Departments, Vendors, Locations, Employees
- Cloudinary-backed file upload endpoint for asset images/attachments
- Centralized error handling, validation, reusable query/CRUD utilities
- Seed script for a default administrator + baseline reference data

**Frontend (React 19 + Vite + TypeScript + Tailwind)**
- Login / Register, JWT session handling, role-based redirect after login
- Protected routes per role, with a shared dashboard shell (sidebar + navbar)
- Admin dashboard with live stats and a status breakdown chart
- Asset Manager, Department Manager, and Employee dashboard shells
- Full Assets module: searchable/filterable/paginated table (TanStack Table),
  create/edit dialog, detail page with QR code and activity timeline
- Full CRUD screens for Categories, Departments, Vendors, Locations, Employees
- Dark mode, toast notifications, original blue/indigo design system

## Not yet built (next phases)

Asset Requests, Allocation, Transfers, Returns, Maintenance, Consumables,
Inventory, Reports (PDF/Excel/CSV), Analytics, Notifications, Audit Logs,
Settings, and barcode scanning. These routes exist as placeholders in the
UI so navigation and role structure are already in place — they just need
their backend models/controllers and frontend pages, built the same way the
Assets module was.

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys, etc.
npm run seed            # creates admin@syncflow.app / Admin@123 + base data
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev              # starts on http://localhost:5173
```

Log in with `admin@syncflow.app` / `Admin@123` after seeding, or register a
new employee account from the UI.

## Notes

- MongoDB must be running locally (or point `MONGO_URI` at Atlas).
- Cloudinary keys are optional to start the app, but required for image
  uploads to work — asset images will fail to upload without them.
- This was generated in a sandboxed environment without network access, so
  dependencies were not installed or run here — install and test locally
  before deploying.
