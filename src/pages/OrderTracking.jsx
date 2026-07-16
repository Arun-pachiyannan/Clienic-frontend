import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import api from "../services/api";

const STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState(searchParams.get("orderId") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${id.trim()}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found. Double-check your Order ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("orderId")) {
      trackOrder(searchParams.get("orderId"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    trackOrder(orderIdInput);
  };

  const currentStepIndex = order ? STEPS.indexOf(order.orderStatus) : -1;
  const isCancelled = order?.orderStatus === "Cancelled";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-ink mb-2 text-center">Track Your Order</h1>
      <p className="text-ink/50 text-center mb-8">Paste the Order ID from your confirmation to see live status</p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <Input
          placeholder="e.g. ANAN-1719312345678"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" loading={loading}>Track</Button>
      </form>

      {loading && <Spinner label="Looking up your order" />}

      {error && (
        <p className="text-center text-sm text-red-600 bg-red-50 rounded-lg py-3 px-4">{error}</p>
      )}

      {order && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap justify-between gap-2 mb-8 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-ink/50">Order ID</p>
              <p className="font-display font-semibold text-ink">{order.orderId}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Placed On</p>
              <p className="font-medium text-ink">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Total</p>
              <p className="font-display font-semibold text-brand">₹{order.totalAmount}</p>
            </div>
          </div>

          {isCancelled ? (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-medium text-ink">This order was cancelled</p>
            </div>
          ) : (
            <ol className="relative flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-0">
              {STEPS.map((step, i) => {
                const done = i < currentStepIndex;
                const active = i === currentStepIndex;
                return (
                  <li key={step} className="relative flex-1 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2">
                    {i > 0 && (
                      <div
                        className={`hidden sm:block absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                          done || active ? "bg-accent" : "bg-gray-200"
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center border-2 ${
                        active
                          ? "border-brand bg-brand text-white"
                          : done
                          ? "border-accent bg-accent text-white"
                          : "border-gray-200 bg-white text-gray-300"
                      }`}
                    >
                      {done ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="text-xs font-semibold">{i + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm sm:text-center ${active ? "font-semibold text-brand" : done ? "text-ink/70" : "text-ink/40"}`}>
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-ink mb-3">Items</h3>
            <div className="flex flex-col gap-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-ink/70">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
