import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/appointments", label: "Appointments" },
  { to: "/admin/customers", label: "Customers" },
];

const AdminLayout = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
    <aside className="lg:w-56 flex-shrink-0">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-3 px-1">Admin</h2>
      <nav className="flex lg:flex-col gap-1 overflow-x-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? "bg-brand-light text-brand" : "text-ink/60 hover:bg-gray-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <div className="flex-1 min-w-0">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
