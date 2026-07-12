import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { dashboardPathForRole } from "@/utils/roleDashboard";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (values: LoginForm) => {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      navigate("/redirect", { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign in</h2>
      <p className="mt-1 text-sm text-slate-500">Enter your credentials to access your dashboard.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="label">Email address</label>
          <Input
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-2.5 text-slate-400"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" loading={submitting}>
          <LogIn className="h-4 w-4" /> Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary-600 hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-8 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 space-y-2 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <strong className="block text-slate-700 dark:text-slate-300">Demo Credentials (passwords match suffix)</strong>
        <div>Admin: <strong className="text-slate-900 dark:text-slate-100">admin@syncflow.app</strong> / Admin@123</div>
        <div>Manager: <strong className="text-slate-900 dark:text-slate-100">manager@syncflow.app</strong> / Manager@123</div>
        <div>Asset Manager: <strong className="text-slate-900 dark:text-slate-100">am@syncflow.app</strong> / Manager@123</div>
        <div>Employee: <strong className="text-slate-900 dark:text-slate-100">employee@syncflow.app</strong> / Employee@123</div>
      </div>
    </div>
  );
};

export default LoginPage;
