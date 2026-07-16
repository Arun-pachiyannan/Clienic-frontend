import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Field, Input, Textarea } from "../components/ui/Field";
import Button from "../components/ui/Button";
import api from "../services/api";

const Appointment = () => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    patientName: user?.name || "",
    phone: user?.phone || "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.patientName.trim()) next.patientName = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) next.phone = "Enter a valid 10-digit phone number";
    if (!form.preferredDate) next.preferredDate = "Pick a date";
    if (!form.preferredTime) next.preferredTime = "Pick a time";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/appointments", form);
      setSubmitted(true);
      showToast("Appointment request submitted");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not submit request", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="h-14 w-14 rounded-full bg-accent/10 text-accent-dark flex items-center justify-center mx-auto mb-5">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">Request received</h1>
        <p className="text-ink/60 mb-6">
          We've logged your appointment for {form.preferredDate} at {form.preferredTime}.
          Our team will review and confirm it shortly.
        </p>
        {isAuthenticated ? (
          <Link to="/account"><Button>View in My Account</Button></Link>
        ) : (
          <Link to="/"><Button variant="outline">Back to Home</Button></Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-ink mb-2 text-center">Book an Appointment</h1>
      <p className="text-ink/50 text-center mb-8">We'll review your request and confirm a slot</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full Name" required error={errors.patientName}>
          <Input value={form.patientName} onChange={handleChange("patientName")} error={errors.patientName} />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <Input value={form.phone} onChange={handleChange("phone")} error={errors.phone} placeholder="9876543210" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Preferred Date" required error={errors.preferredDate}>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.preferredDate}
              onChange={handleChange("preferredDate")}
              error={errors.preferredDate}
            />
          </Field>
          <Field label="Preferred Time" required error={errors.preferredTime}>
            <Input type="time" value={form.preferredTime} onChange={handleChange("preferredTime")} error={errors.preferredTime} />
          </Field>
        </div>
        <Field label="Message (optional)">
          <Textarea
            rows={4}
            value={form.message}
            onChange={handleChange("message")}
            placeholder="Briefly describe your concern so we can prepare"
          />
        </Field>

        <Button type="submit" size="lg" loading={loading} className="mt-2">
          Submit Request
        </Button>
      </form>

      {!isAuthenticated && (
        <p className="text-center text-sm text-ink/50 mt-6">
          <Link to="/login" className="text-brand font-medium">Log in</Link> to see your appointment status in one place.
        </p>
      )}
    </div>
  );
};

export default Appointment;
