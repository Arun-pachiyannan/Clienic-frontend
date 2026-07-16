import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Field, Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import Logo from "../components/Logo";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      showToast("Account created — welcome to ANAN Clinic!");
      navigate("/account");
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-ink text-center mb-1">Create your account</h1>
      <p className="text-ink/50 text-center mb-8">Order products and book appointments in one place</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full Name" required error={errors.name}>
          <Input value={form.name} onChange={handleChange("name")} error={errors.name} autoFocus />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input type="email" value={form.email} onChange={handleChange("email")} error={errors.email} />
        </Field>
        <Field label="Password" required error={errors.password} hint="At least 6 characters">
          <Input type="password" value={form.password} onChange={handleChange("password")} error={errors.password} />
        </Field>
        <Field label="Confirm Password" required error={errors.confirmPassword}>
          <Input type="password" value={form.confirmPassword} onChange={handleChange("confirmPassword")} error={errors.confirmPassword} />
        </Field>

        {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

        <Button type="submit" size="lg" loading={loading} fullWidth className="mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-ink/50 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brand font-medium hover:text-brand-dark">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
