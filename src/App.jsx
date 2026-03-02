import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";

/* 🧩 COMPONENTS */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* 🛠️ ADMIN */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminInventory from "./admin/pages/AdminInventory";
import AdminPricing from "./admin/pages/AdminPricing";
import AdminPromotions from "./admin/pages/AdminPromotions";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminReviews from "./admin/pages/AdminReviews";
import AdminShipments from "./admin/pages/AdminShipments";
import AdminShipmentPrintLabel from "./admin/pages/AdminShipmentPrintLabel";
import AdminPayments from "./admin/pages/AdminPayments";
import AdminCoupons from "./admin/pages/AdminCoupons";
import AdminPermissions from "./admin/pages/AdminPermissions";
import AdminSearch from "./admin/pages/AdminSearch";

/* 🛠️ SUPER ADMIN */
import SuperAdminLayout from "./superadmin/SuperAdminLayout";

/* 🏠 MAIN PAGES */
import Home from "./pages/Home";
import Orders from "./pages/MyOrders";
import WishListPage from "./pages/WishListPage";
import Cart from "./pages/Cart";
import Account from "./pages/ProfilePage";
import LoginSignupModal from "./pages/LoginSignupModal";
import OffersPage from "./pages/OffersPage";

/* 🧱 UNIFIED PAGES */
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";

/* 🧾 CHECKOUT FLOW */
import CheckoutAuthPage from "./pages/CheckoutAuthPage";
import AddAddressPage from "./pages/AddAddressPage";
import DeliveryPage from "./pages/DeliveryPage";
import ReviewOrderPage from "./pages/ReviewOrderPage";
import OrderProcessingPage from "./pages/OrderProcessingPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";

/* 🛒 CART CONTEXT */
import { CartProvider } from "./context/CartContext";

/* 🔐 FIREBASE */
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

/** Catches crashes and shows a fallback with "Go to Home" so you never see a white page */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("App error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 32, maxWidth: 400, textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Use the link below to open the home page.</p>
            <a href="/" style={{ display: "inline-block", padding: "10px 20px", background: "#b30000", color: "white", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>Go to Home Page</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const CURRENT_USER_KEY = "currentUser";

// Inner component that has access to navigate (must be inside Router)
function AppContent({ currentUser, setCurrentUser, showModal, setShowModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin") || location.pathname.startsWith("/superadmin");

  // When arriving with ?openLogin=1 on main site only (error-boundary "Log In"), open project login modal
  React.useEffect(() => {
    if (isAdmin) return;
    const params = new URLSearchParams(location.search);
    if (params.get("openLogin") === "1") {
      setShowModal("login");
      navigate(location.pathname || "/", { replace: true });
    }
  }, [isAdmin, location.search, location.pathname, setShowModal, navigate]);

  /* 🔑 AFTER LOGIN / SIGNUP (main site) – called directly from Login/Signup modal */
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setShowModal(null);
    
    // If logging in during checkout, redirect to address page
    const isCheckoutFlow = sessionStorage.getItem("checkoutFlow");
    if (isCheckoutFlow === "true") {
      sessionStorage.removeItem("checkoutFlow");
      navigate("/add-address");
      return;
    }

    // Otherwise go straight to My Account page (only right after login/signup)
    navigate("/account");
  };

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="shipments" element={<AdminShipments />} />
          <Route path="shipments/print" element={<AdminShipmentPrintLabel />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="permissions" element={<AdminPermissions />} />
          <Route path="search" element={<AdminSearch />} />
        </Route>
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="shipments" element={<AdminShipments />} />
          <Route path="shipments/print" element={<AdminShipmentPrintLabel />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="permissions" element={<AdminPermissions />} />
          <Route path="search" element={<AdminSearch />} />
        </Route>
      </Routes>
    );
  }

  return (
    <>
      {/* HEADER */}
      <Header
        currentUser={currentUser}
        openAuthModal={setShowModal}
        setCurrentUser={setCurrentUser}
      />

      {/* MAIN CONTENT - sentinel at top for header scroll detection */}
      <main className="w-full flex-1 max-md:!mt-0 max-md:!pt-0 relative">
        <div id="header-scroll-sentinel" aria-hidden="true" className="absolute top-0 left-0 right-0 h-px w-full pointer-events-none" style={{ zIndex: 0 }} />
        <Routes>
          {/* 🏠 HOME */}
          <Route path="/" element={<Home setShowModal={setShowModal} />} />
          
          {/* 📁 CATEGORY PAGES */}
          <Route path="/category/:categoryType" element={<CategoryPage setShowModal={setShowModal} />} />
          <Route path="/items" element={<CategoryPage setShowModal={setShowModal} />} />
          <Route path="/boxes" element={<CategoryPage setShowModal={setShowModal} />} />
          <Route path="/pipefitting" element={<CategoryPage setShowModal={setShowModal} />} />

          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/track/:orderId" element={<OrderTrackingPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/offers" element={<OffersPage />} />

          {/* 👤 ACCOUNT */}
          <Route
            path="/account"
            element={
              <Account
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                openAuthModal={setShowModal}
              />
            }
          />

          {/* 🧩 PRODUCT PAGES */}
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/product/:productType/:id" element={<ProductPage />} />
          
          {/* Legacy routes - redirect to new ProductPage */}
          <Route path="/boxes/a" element={<ProductPage />} />
          <Route path="/boxes/b" element={<ProductPage />} />
          <Route path="/boxes/c" element={<ProductPage />} />
          <Route path="/boxes/d" element={<ProductPage />} />
          <Route path="/pipefitting/a" element={<ProductPage />} />
          <Route path="/pipefitting/b" element={<ProductPage />} />
          <Route path="/pipefitting/c" element={<ProductPage />} />
          <Route path="/flexiblepipe" element={<ProductPage />} />
          <Route path="/braidedhose" element={<ProductPage />} />
          <Route path="/zebrahose" element={<ProductPage />} />
          <Route path="/pipebend" element={<ProductPage />} />

          {/* 🧾 CHECKOUT */}
          <Route path="/checkout-auth" element={<CheckoutAuthPage setShowModal={setShowModal} />} />
          <Route path="/add-address" element={<AddAddressPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/review-order" element={<ReviewOrderPage />} />
          <Route
            path="/order-processing"
            element={<OrderProcessingPage />}
          />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer setShowModal={setShowModal} />

      {/* LOGIN / SIGNUP MODAL */}
      {showModal && (
        <LoginSignupModal
          type={showModal}
          onClose={() => setShowModal(null)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

function App() {
  /* 🔐 AUTH STATE */
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(null); // project: login | signup | null

  /* 🔁 AUTH: Firebase when configured, else localStorage – never throw */
  useEffect(() => {
    try {
      if (auth && typeof onAuthStateChanged === "function") {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          try {
            if (user) {
              let photoURL = user.photoURL || "";
              if (!photoURL) {
                const stored = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "{}");
                if (stored?.email === user?.email && stored?.photoURL) photoURL = stored.photoURL;
              }
              setCurrentUser({
                name: user?.displayName || "",
                email: user?.email || "",
                phone: "",
                address: "",
                photoURL: photoURL || "",
              });
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user?.displayName || "", email: user?.email || "", phone: "", address: "", photoURL: photoURL || "" }));
            } else {
              setCurrentUser(null);
              localStorage.removeItem(CURRENT_USER_KEY);
            }
          } catch (_) {
            setCurrentUser(null);
          }
        });
        return () => { try { unsubscribe(); } catch (_) {} };
      }
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && typeof parsed === "object") setCurrentUser(parsed);
        } catch (_) {
          setCurrentUser(null);
        }
      }
    } catch (_) {
      setCurrentUser(null);
    }
  }, []);

  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          <div className="w-full flex flex-col min-h-screen m-0 p-0">
            <AppContent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              showModal={showModal}
              setShowModal={setShowModal}
            />
          </div>
        </Router>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;

