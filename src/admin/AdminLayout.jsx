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
  LogIn,
  LogOut,
} from "lucide-react";

const ADMIN_LOGIN_KEY = "adminLoggedIn";

function LoggedOutView({ onLogIn }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-3">You haven&apos;t logged in yet</h1>
        <p className="text-gray-500 text-sm mb-6">
          Please login to access your account and view your profile details.
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLogIn}
            className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

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

export default function AdminLayout({ adminLoggedIn, setAdminLoggedIn, openAuthModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qFromUrl = location.pathname === "/admin/search" ? searchParams.get("q") ?? "" : "";
  const [searchQuery, setSearchQuery] = useState(qFromUrl);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollContainer, setScrollContainer] = useState(null);

  const handleLogIn = () => {
    openAuthModal?.("login");
  };

  const handleLogOut = () => {
    setAdminLoggedIn?.(false);
    if (typeof window !== "undefined") window.localStorage.removeItem(ADMIN_LOGIN_KEY);
    openAuthModal?.("login");
  };

  if (!adminLoggedIn) {
    return (
      <LoggedOutView onLogIn={handleLogIn} />
    );
  }

  useEffect(() => {
    if (qFromUrl !== undefined) setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  // Same as app header: at top = background on hover only; when scrolled = fixed background
  useEffect(() => {
    if (!scrollContainer) return;
    const SCROLL_THRESHOLD = 10;
    const handler = () => setIsScrolled(scrollContainer.scrollTop > SCROLL_THRESHOLD);
    handler();
    scrollContainer.addEventListener("scroll", handler, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handler);
  }, [scrollContainer]);

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

  const shouldShowShadow = isScrolled;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin header - solid red, white text & buttons */}
      <div
        id="admin-header"
        data-scrolled={isScrolled ? "true" : "false"}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#b30000]"
        style={{
          boxShadow: shouldShowShadow ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <div className="h-0.5 bg-white/20" />
        <header className="px-6 py-4 flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            className="text-xl md:text-2xl font-semibold text-white tracking-tight hover:text-white/90 transition-colors"
          >
            Dinesh PVC Pipes Admin
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogIn}
              className="px-4 py-2 bg-white text-[#b30000] rounded-lg font-medium hover:bg-[#b30000] hover:text-white hover:border-white border-2 border-white/30 transition-all duration-200 shadow-sm"
            >
              Sign in with Email
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-white text-[#b30000] rounded-lg font-medium hover:bg-[#b30000] hover:text-white hover:border-white border-2 border-white/30 transition-all duration-200"
            >
              Continue with Google
            </button>
          </div>
        </header>
      </div>

      {/* Spacer for fixed header */}
      <div className="pt-[73px] flex flex-col flex-1 min-h-0">
      {/* Sub-header with search - white */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 flex-wrap shrink-0">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
            />
          </div>
        </form>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar - white/light gray with red active */}
        <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <nav className="p-3 flex flex-col flex-1 min-h-0">
            <div className="space-y-0.5">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#b30000] text-white"
                        : "text-gray-700 hover:bg-red-50 hover:text-[#b30000]"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-gray-200">
              {adminLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogOut}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-[#b30000] text-white hover:bg-[#8b0000] transition-colors"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  LOG OUT
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogIn}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#b30000] transition-colors"
                >
                  <LogIn className="w-5 h-5 shrink-0" />
                  LOG IN
                </button>
              )}
            </div>
          </nav>
        </aside>

        {/* Main content - scroll here drives header background */}
        <main ref={setScrollContainer} className="flex-1 overflow-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
      </div>
    </div>
  );
}

export { NAV_ITEMS };
