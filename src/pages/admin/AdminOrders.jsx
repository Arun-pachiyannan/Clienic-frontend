import { useEffect, useState } from "react";
import { Select } from "../../components/ui/Field";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor = {
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-amber-50 text-amber-700",
  Processing: "bg-blue-50 text-blue-700",
  Shipped: "bg-indigo-50 text-indigo-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    setUpdatingId(order._id);
    try {
      const { data } = await api.put(`/orders/${order._id}/status`, { orderStatus: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? data : o)));
      showToast(
        newStatus === "Cancelled"
          ? `Order ${order.orderId} cancelled — stock has been restored`
          : `Order ${order.orderId} marked as ${newStatus}`
      );
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner label="Loading orders" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-ink/50 text-sm">No orders placed yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order._id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-display font-semibold text-ink">{order.orderId}</p>
                  <p className="text-xs text-ink/50">
                    {order.user?.name} · {order.user?.email} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <span className="font-display font-semibold text-ink">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="text-sm text-ink/60 mb-3">
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} × {item.quantity}
                    {i < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>

              <div className="text-xs text-ink/40 mb-3">
                Deliver to: {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
              </div>

              <Select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order, e.target.value)}
                disabled={updatingId === order._id}
                className="sm:w-56"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
