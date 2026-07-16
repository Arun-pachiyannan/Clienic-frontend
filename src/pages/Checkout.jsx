import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
// import { useRazorpay } from "../hooks/useRazorpay";
import { Field, Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import api from "../services/api";

const emptyAddress = { name: "", phone: "", email: "", street: "", city: "", state: "", pincode: "" };

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  // const { openCheckout } = useRazorpay();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    ...emptyAddress,
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);

  const handleChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!address.name.trim()) next.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) next.phone = "Enter a valid 10-digit phone number";
    if (!/^\S+@\S+\.\S+$/.test(address.email.trim())) next.email = "Enter a valid email";
    if (!address.street.trim()) next.street = "Street address is required";
    if (!address.city.trim()) next.city = "City is required";
    if (!address.state.trim()) next.state = "State is required";
    if (!/^\d{6}$/.test(address.pincode.trim())) next.pincode = "Enter a valid 6-digit pincode";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // const handlePay = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;
  //   if (items.length === 0) return;

  //   setPaying(true);
  //   try {
  //     // Step 1: ask backend to create the Razorpay order (server recomputes
  //     // the total from current product prices/stock - we never trust the
  //     // client-side total for the actual charge).
  //     const orderItems = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
  //     const { data: rpOrder } = await api.post("/orders/razorpay", { items: orderItems });

  //     await openCheckout({
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: rpOrder.amount,
  //       currency: rpOrder.currency,
  //       name: "ANAN Clinic",
  //       description: "Order Payment",
  //       order_id: rpOrder.razorpayOrderId,
  //       prefill: {
  //         name: address.name,
  //         email: address.email,
  //         contact: address.phone,
  //       },
  //       theme: { color: "#2563EB" },
  //       handler: async (response) => {
  //         try {
  //           // Step 2: backend verifies the payment signature before
  //           // creating the real order and decrementing stock.
  //           const { data: order } = await api.post("/orders/verify", {
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //             items: rpOrder.items,
  //             totalAmount: rpOrder.totalAmount,
  //             deliveryAddress: address,
  //           });
  //           clearCart();
  //           showToast("Payment successful! Your order is confirmed.");
  //           navigate(`/track-order?orderId=${order.orderId}`);
  //         } catch (err) {
  //           showToast(
  //             err.response?.data?.message || "Payment succeeded but order confirmation failed. Contact support.",
  //             "error"
  //           );
  //         } finally {
  //           setPaying(false);
  //         }
  //       },
  //       modal: {
  //         ondismiss: () => setPaying(false),
  //       },
  //     });
  //   } catch (err) {
  //     showToast(err.response?.data?.message || err.message || "Could not start checkout", "error");
  //     setPaying(false);
  //   }
  // };

  const handlePay = async (e) => {
  e.preventDefault();

  if (!validate()) return;
  if (items.length === 0) return;

  setPaying(true);

  try {
    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const { data } = await api.post("/orders/razorpay", {
      items: orderItems,
      deliveryAddress: address,
    });

    clearCart();

    showToast("Order placed successfully!");

    navigate(`/track-order?orderId=${data.order.orderId}`);
  } catch (err) {
    showToast(
      err.response?.data?.message ||
        "Failed to place order",
      "error"
    );
  } finally {
    setPaying(false);
  }
};

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-ink/60 mb-4">Your cart is empty, so there's nothing to check out.</p>
        <Button onClick={() => navigate("/products")}>Shop Products</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-ink mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handlePay} className="lg:col-span-2 flex flex-col gap-5">
          <h2 className="font-display font-semibold text-ink">Delivery Address</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required error={errors.name}>
              <Input value={address.name} onChange={handleChange("name")} error={errors.name} />
            </Field>
            <Field label="Phone Number" required error={errors.phone}>
              <Input value={address.phone} onChange={handleChange("phone")} error={errors.phone} placeholder="9876543210" />
            </Field>
          </div>

          <Field label="Email" required error={errors.email}>
            <Input type="email" value={address.email} onChange={handleChange("email")} error={errors.email} />
          </Field>

          <Field label="Street Address" required error={errors.street}>
            <Input value={address.street} onChange={handleChange("street")} error={errors.street} />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" required error={errors.city}>
              <Input value={address.city} onChange={handleChange("city")} error={errors.city} />
            </Field>
            <Field label="State" required error={errors.state}>
              <Input value={address.state} onChange={handleChange("state")} error={errors.state} />
            </Field>
            <Field label="Pincode" required error={errors.pincode}>
              <Input value={address.pincode} onChange={handleChange("pincode")} error={errors.pincode} />
            </Field>
          </div>

          <Button type="submit" size="lg" loading={paying} className="mt-2">
            {paying ? "Processing..." : `Pay ₹${totalAmount}`}
          </Button>
        </form>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 h-fit">
          <h2 className="font-display font-semibold text-ink mb-4">Order Summary</h2>
          <div className="flex flex-col gap-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-ink/70">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-display font-bold text-ink">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
