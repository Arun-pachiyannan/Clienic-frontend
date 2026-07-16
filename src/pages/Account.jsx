import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Field, Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import api from "../services/api";

const TABS = ["Profile", "Orders", "Appointments", "Password"];

const statusColor = {
  Processing: "bg-amber-50 text-amber-700",
  Packed: "bg-blue-50 text-blue-700",
  Shipped: "bg-indigo-50 text-indigo-700",
  "Out for Delivery": "bg-purple-50 text-purple-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
};

const Account = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState("Profile");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-ink mb-2">My Account</h1>
      <p className="text-ink/50 mb-8">Welcome back, {user?.name}</p>

      <div className="flex gap-1 border-b border-gray-100 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? "border-brand text-brand" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Profile" && <ProfileTab user={user} updateUser={updateUser} showToast={showToast} />}
      {tab === "Orders" && <OrdersTab />}
      {tab === "Appointments" && <AppointmentsTab />}
      {tab === "Password" && <PasswordTab showToast={showToast} />}
    </div>
  );
};

const ProfileTab = ({ user, updateUser, showToast }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/auth/me", {
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
      });
      updateUser(data);
      showToast("Profile updated");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <Field label="Full Name">
        <Input value={form.name} onChange={handleChange("name")} />
      </Field>
      <Field label="Email">
        <Input value={user?.email} disabled className="bg-gray-50 text-ink/50" />
      </Field>
      <Field label="Phone">
        <Input value={form.phone} onChange={handleChange("phone")} />
      </Field>
      <Field label="Street Address">
        <Input value={form.street} onChange={handleChange("street")} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="City"><Input value={form.city} onChange={handleChange("city")} /></Field>
        <Field label="State"><Input value={form.state} onChange={handleChange("state")} /></Field>
        <Field label="Pincode"><Input value={form.pincode} onChange={handleChange("pincode")} /></Field>
      </div>
      <Button type="submit" loading={saving} className="mt-2 self-start">Save Changes</Button>
    </form>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading orders" />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink/50 mb-4">You haven't placed any orders yet.</p>
        <Link to="/products"><Button>Shop Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <Link
          key={order._id}
          to={`/track-order?orderId=${order.orderId}`}
          className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand/30 transition-colors"
        >
          <div>
            <p className="font-medium text-ink text-sm">{order.orderId}</p>
            <p className="text-xs text-ink/50">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.orderStatus] || "bg-gray-50 text-gray-600"}`}>
              {order.orderStatus}
            </span>
            <span className="font-display font-semibold text-ink">₹{order.totalAmount}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/appointments/my").then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading appointments" />;

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink/50 mb-4">You haven't booked any appointments yet.</p>
        <Link to="/appointment"><Button>Book an Appointment</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {appointments.map((appt) => (
        <div key={appt._id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-gray-100">
          <div>
            <p className="font-medium text-ink text-sm">{appt.preferredDate} at {appt.preferredTime}</p>
            <p className="text-xs text-ink/50">{appt.patientName} · {appt.phone}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[appt.status] || "bg-gray-50 text-gray-600"}`}>
            {appt.status}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordTab = ({ showToast }) => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    setSaving(true);
    try {
      await api.put("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      showToast("Password updated");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <Field label="Current Password" required>
        <Input type="password" value={form.currentPassword} onChange={handleChange("currentPassword")} required />
      </Field>
      <Field label="New Password" required hint="At least 6 characters">
        <Input type="password" value={form.newPassword} onChange={handleChange("newPassword")} required />
      </Field>
      <Field label="Confirm New Password" required>
        <Input type="password" value={form.confirmPassword} onChange={handleChange("confirmPassword")} required />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={saving} className="mt-2 self-start">Update Password</Button>
    </form>
  );
};

export default Account;
