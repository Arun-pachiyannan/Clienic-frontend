import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";

const placeholderImage =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23F1F5F9'/%3E%3C/svg%3E";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();
  const [limitWarning, setLimitWarning] = useState({}); // { [productId]: true }

  const handleIncrease = (item) => {
    if (item.quantity >= item.stock) {
      setLimitWarning((prev) => ({ ...prev, [item.productId]: true }));
      setTimeout(() => {
        setLimitWarning((prev) => ({ ...prev, [item.productId]: false }));
      }, 2500);
      return;
    }
    updateQuantity(item.productId, item.quantity + 1);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink mb-2">Your cart is empty</h1>
        <p className="text-ink/50 mb-6">Browse our products and add something to your cart.</p>
        <Link to="/products">
          <Button>Shop Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-ink mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white"
            >
              <img
                src={item.image || placeholderImage}
                alt={item.name}
                className="h-20 w-20 rounded-lg object-cover bg-surface flex-shrink-0"
              />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium text-ink">{item.name}</h3>
                  <p className="text-sm text-ink/50">₹{item.price} each</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1.5 text-ink/60 hover:text-ink"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item)}
                        className="px-3 py-1.5 text-ink/60 hover:text-ink"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {limitWarning[item.productId] && (
                      <p className="text-xs text-red-600">
                        Only {item.stock} {item.stock === 1 ? "unit" : "units"} in stock
                      </p>
                    )}
                  </div>
                  <span className="font-display font-semibold text-ink w-20 text-right">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-400 hover:text-red-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 h-fit sticky top-24">
          <h2 className="font-display font-semibold text-ink mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-ink/60 mb-2">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm text-ink/60 mb-4">
            <span>Delivery</span>
            <span className="text-accent-dark font-medium">Free</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-display font-bold text-ink mb-6">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
          <Button fullWidth size="lg" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
