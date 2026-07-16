import { useState } from "react";
import { Field, Input, Textarea } from "../components/ui/Field";
import Button from "../components/ui/Button";
import api from "../services/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send your message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-ink">Get in Touch</h1>
        <p className="text-ink/50 mt-3">We're here to help with orders, appointments, or anything else</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-ink">Phone</p>
              <a href="tel:1234567890" className="text-sm text-ink/60 hover:text-brand">+91 12345 67890</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-ink">Email</p>
              <a href="mailto:anan@gmail.com" className="text-sm text-ink/60 hover:text-brand">anan@gmail.com</a>
            </div>
          </div>
          <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 h-48 bg-surface flex items-center justify-center text-ink/30 text-sm">
            Map placeholder — embed Google Maps here
          </div>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-accent/10 text-accent-dark flex items-center justify-center mb-4">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-medium text-ink">Message sent</p>
            <p className="text-sm text-ink/50 mt-1">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Your Name" required>
              <Input value={form.name} onChange={handleChange("name")} required />
            </Field>
            <Field label="Your Email" required>
              <Input type="email" value={form.email} onChange={handleChange("email")} required />
            </Field>
            <Field label="Message" required>
              <Textarea rows={5} value={form.message} onChange={handleChange("message")} required />
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" loading={loading} size="lg">Send Message</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
