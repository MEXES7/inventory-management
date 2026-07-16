import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
  },
  {
    name: "Sync Products",
    path: "/sync",
    icon: RefreshCw,
  },
  {
    name: "Stock Logs",
    path: "/logs",
    icon: ClipboardList,
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
      fixed left-0 top-0 z-50
      flex h-screen w-64 flex-col
      bg-slate-900 text-white
      transition-transform duration-300

      ${open ? "translate-x-0" : "-translate-x-full"}

      lg:static
      lg:translate-x-0
    `}
      >
        {" "}
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Inventory
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              onClick={onClose}
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              {name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
