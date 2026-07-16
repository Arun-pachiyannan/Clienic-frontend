import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import api from "../../services/api";

const monthName = (m) => ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m];

const StatCard = ({ label, value, accent }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5">
    <p className="text-sm text-ink/50">{label}</p>
    <p className={`text-2xl font-display font-bold mt-1 ${accent || "text-ink"}`}>{value}</p>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard" />;
  if (!stats) return <p className="text-ink/50">Could not load dashboard stats.</p>;

  const maxMonthly = Math.max(...stats.monthlySales.map((m) => m.total), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} accent="text-brand" />
        <StatCard label="Total Customers" value={stats.totalCustomers} accent="text-accent-dark" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-display font-semibold text-ink mb-5">Monthly Sales</h2>
          {stats.monthlySales.length === 0 ? (
            <p className="text-sm text-ink/40">No paid orders yet.</p>
          ) : (
            <div className="flex items-end gap-3 h-40">
              {stats.monthlySales.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-brand rounded-t-md"
                    style={{ height: `${Math.max((m.total / maxMonthly) * 100, 4)}%` }}
                    title={`₹${m.total}`}
                  />
                  <span className="text-[11px] text-ink/40">{monthName(m.month)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-display font-semibold text-ink mb-5">Top Products</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-ink/40">No sales data yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.topProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <span className="text-ink/80">{p.name}</span>
                  <span className="font-medium text-ink/50">{p.popularity} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
