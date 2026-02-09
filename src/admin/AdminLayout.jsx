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
} from "lucide-react";
import AdminLoginModal from "./AdminLoginModal";

const ADMIN_CURRENT_USER_KEY = "adminCurrentUser";

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

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qFromUrl = location.pathname === "/admin/search" ? searchParams.get("q") ?? "" : "";
  const [searchQuery, setSearchQuery] = useState(qFromUrl);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollContainer, setScrollContainer] = useState(null);

  // 🔐 Admin-only auth state (separate from main site)
  const [adminUser, setAdminUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(null); // "login" | "signup" | null

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

  // Load admin session once on mount
  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_CURRENT_USER_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email) {
        setAdminUser(parsed);
      }
    } catch {
      setAdminUser(null);
    }
  }, []);

  const handleAdminAuthSuccess = (user) => {
    setAdminUser(user);
    setShowAuthModal(null);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_CURRENT_USER_KEY);
    setAdminUser(null);
    setShowAuthModal("login");
  };

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
            {adminUser ? (
              <>
                <span className="hidden md:inline text-sm text-white/90">
                  Signed in as <span className="font-semibold">{adminUser.name || adminUser.email}</span>
                </span>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="px-4 py-2 bg-white text-[#b30000] rounded-lg font-medium hover:bg-[#b30000] hover:text-white hover:border-white border-2 border-white/30 transition-all duration-200"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowAuthModal("signup")}
                  className="px-4 py-2 bg-white text-[#b30000] rounded-lg font-medium hover:bg-[#b30000] hover:text-white hover:border-white border-2 border-white/30 transition-all duration-200 shadow-sm"
                >
                  Sign in with Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal("signup")}
                  className="px-4 py-2 bg-white text-[#b30000] rounded-lg font-medium hover:bg-[#b30000] hover:text-white hover:border-white border-2 border-white/30 transition-all duration-200"
                >
                  Continue with Google
                </button>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Spacer for fixed header */}
      <div className="pt-[73px] flex flex-col flex-1 min-h-0">
      {/* Sub-header with search - white */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 flex-wrap shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          {adminUser ? "Admin Dashboard" : "Admin Login Required"}
        </h2>
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
            <div className="pt-2 border-t border-gray-200" />
          </nav>
        </aside>

        {/* Main content - scroll here drives header background */}
        <main ref={setScrollContainer} className="flex-1 overflow-auto p-6 bg-white">
          {adminUser ? (
            <Outlet />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="max-w-md w-full text-center border border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Admin access only
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Please sign in to your admin account to view dashboard, orders, products and other admin pages.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAuthModal("login")}
                  className="px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] transition-colors"
                >
                  Admin Login
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>

      {/* Admin-only login/signup modal, completely separate from main site auth */}
      {showAuthModal && (
        <AdminLoginModal
          type={showAuthModal}
          onClose={() => setShowAuthModal(null)}
          onAuthSuccess={handleAdminAuthSuccess}
        />
      )}
    </div>
  );
}

export { NAV_ITEMS };
