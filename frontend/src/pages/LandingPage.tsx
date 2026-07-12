import { Link } from "react-router-dom";
import { ArrowRight, Building2, Shield, QrCode, Laptop, BarChart2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-primary-500 selection:text-white dark:bg-slate-900">
            {/* Navbar */}
            <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">SyncFlow</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                            Sign In
                        </Link>
                        <Link to="/register">
                            <Button className="px-4 py-2 text-sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-24 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
                        Enterprise Asset Management, <span className="text-primary-600">Simplified.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Track assets, manage departments, streamline maintenance, and handle role-based access. Designed for modern organizations that value efficiency and clarity.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/register">
                            <Button className="gap-2 px-6 py-3 text-lg">
                                Create Organization <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" className="gap-2 px-6 py-3 text-lg">
                                Join Organization
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <FeatureCard
                            icon={Shield}
                            title="Role-Based Access Control"
                            description="Empower your Admin, Asset Manager, Department Head, and Employee with customized dashboards."
                        />
                        <FeatureCard
                            icon={QrCode}
                            title="QR Asset Tracking"
                            description="Instant asset identification. Automatically generate QR codes. Scan to view history, maintenance, and allocation."
                        />
                        <FeatureCard
                            icon={BarChart2}
                            title="Analytics & Reports"
                            description="Real-time insights across departments. Total assets, maintenance pipelines, and real-time dashboard analytics."
                        />
                    </div>
                </div>
            </main>

            {/* Benefits section */}
            <section className="border-t border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Why organizations choose SyncFlow
                            </h2>
                            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                                Replace unmanageable spreadsheets with a premium platform built for scalable enterprise asset and resource management.
                            </p>

                            <dl className="mt-10 space-y-6 text-base leading-7 text-slate-600 dark:text-slate-400">
                                {[
                                    "Department & Employee setup made easy",
                                    "Asset lifecycle management from procurement to scrap",
                                    "Approval workflows built natively",
                                    "Interactive QR scanning directly from the portal",
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-3">
                                        <CheckCircle2 className="h-6 w-6 shrink-0 text-primary-600" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="mt-16 sm:mt-24 lg:mt-0">
                            <div className="relative rounded-2xl bg-slate-900 p-8 shadow-2xl ring-1 ring-white/10 dark:ring-white/20">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg">
                                        <Laptop className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">Default Demo Environment</h3>
                                        <p className="text-sm text-slate-400">Experience a fully populated testbed.</p>
                                    </div>
                                </div>
                                <p className="text-slate-300">
                                    Pre-configured with an IT, HR, Finance, Operations, and Sales department. Try the Admin, Manager, and Employee flows instantly using our pre-seeded data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
);

export default LandingPage;
