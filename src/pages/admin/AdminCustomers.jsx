import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import api from "../../services/api";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/customers").then((res) => setCustomers(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading customers" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Customers</h1>

      {customers.length === 0 ? (
        <p className="text-ink/50 text-sm">No registered customers yet.</p>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-gray-100">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Phone</th>
                <th className="py-3 px-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 px-4 font-medium text-ink">{c.name}</td>
                  <td className="py-3 px-4 text-ink/60">{c.email}</td>
                  <td className="py-3 px-4 text-ink/60">{c.phone || "—"}</td>
                  <td className="py-3 px-4 text-ink/40">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
