import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Field, Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import Logo from "../components/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      showToast("Welcome back!");
      navigate(location.state?.from?.pathname || "/account");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-ink text-center mb-1">Welcome back</h1>
      <p className="text-ink/50 text-center mb-8">Log in to manage your orders and appointments</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" required>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </Field>
        <Field label="Password" required>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" size="lg" loading={loading} fullWidth className="mt-2">
          Log In
        </Button>
      </form>

      <p className="text-center text-sm text-ink/50 mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand font-medium hover:text-brand-dark">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
