import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { dashboardPathForRole } from "@/utils/roleDashboard";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (values: RegisterForm) => {
    setSubmitting(true);
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      const user = await login(values.email, values.password);
      toast.success("Account created");
      navigate(dashboardPathForRole(user.role), { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h2>
      <p className="mt-1 text-sm text-slate-500">Employee accounts. Managers are added by an administrator.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="label">Full name</label>
          <Input placeholder="Jane Doe" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        </div>

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
          <Input
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
          />
        </div>

        <div>
          <label className="label">Confirm password</label>
          <Input
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
          />
        </div>

        <Button type="submit" className="w-full" loading={submitting}>
          <UserPlus className="h-4 w-4" /> Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
