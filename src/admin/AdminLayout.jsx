import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Percent,
  Megaphone,
  Users,
  Star,
  Truck,
  CreditCard,
  Tag,
  Shield,
  Search,
  Mail,
} from "lucide-react";
const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/inventory", label: "Inventory", icon: Layers },
  { path: "/admin/pricing", label: "Pricing & Discounts", icon: Percent },
  { path: "/admin/promotions", label: "Promotions", icon: Megaphone },
  { path: "/admin/customers", label: "Customers", icon: Users },
  { path: "/admin/reviews", label: "Reviews & Ratings", icon: Star },
  { path: "/admin/shipments", label: "Shipments", icon: Truck },
  { path: "/admin/payments", label: "Payments", icon: CreditCard },
  { path: "/admin/coupons", label: "Coupons", icon: Tag },
  { path: "/admin/permissions", label: "Permissions", icon: Shield },
];

export default function AdminLayout({ openAuthModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qFromUrl = location.pathname === "/admin/search" ? searchParams.get("q") ?? "" : "";
  const [searchQuery, setSearchQuery] = useState(qFromUrl);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (qFromUrl !== undefined) setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  const handleSearch = useCallback(
    (e) => {
      e?.preventDefault();
      const input = document.getElementById("admin-search-input");
      const q = (input?.value ?? searchQuery)?.trim();
      if (q) navigate(`/admin/search?q=${encodeURIComponent(q)}`);
    },
    [navigate, searchQuery]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "/" && !searchFocused && !/input|textarea/i.test(e.target?.tagName)) {
        e.preventDefault();
        document.getElementById("admin-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchFocused]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top dark bar */}
      <div className="h-1 bg-[#3d2c29]" />

      {/* Main header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 tracking-tight">
          Dinesh PVC Pipes Admin
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal?.("login")}
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors"
          >
            Sign in with Email
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue with Google
          </button>
        </div>
      </header>

      {/* Sub-header with search */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-bold text-gray-800">Admin Dashboard</h2>
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="admin-search-input"
              type="text"
              name="query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search orders, products, customers... (Press / to Focus)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none"
            />
          </div>
        </form>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-gray-100 border-r border-gray-200 flex flex-col">
          <nav className="p-3 space-y-0.5">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { NAV_ITEMS };
