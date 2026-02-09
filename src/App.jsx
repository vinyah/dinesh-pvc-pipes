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

/* 🏠 MAIN PAGES */
import Home from "./pages/Home";
import Orders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import Account from "./pages/ProfilePage";
import LoginSignupModal from "./pages/LoginSignupModal";

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

/* 🛒 CART CONTEXT */
import { CartProvider } from "./context/CartContext";

// Error Boundary: show "You haven't logged in yet" card (2nd image) instead of "Something went wrong"
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-3">You haven&apos;t logged in yet</h1>
            <p className="text-gray-500 text-sm mb-6">
              Please login to access your account and view your profile details.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/?openLogin=1"
                className="inline-block px-5 py-2.5 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] transition-colors"
              >
                Log In
              </a>
              <a
                href="/"
                className="inline-block px-5 py-2.5 bg-white text-[#b30000] border-2 border-[#b30000] rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Home
              </a>
            </div>
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
  const isAdmin = location.pathname.startsWith("/admin");

  // When arriving with ?openLogin=1 on main site only (error-boundary "Log In"), open project login modal
  React.useEffect(() => {
    if (isAdmin) return;
    const params = new URLSearchParams(location.search);
    if (params.get("openLogin") === "1") {
      setShowModal("login");
      navigate(location.pathname || "/", { replace: true });
    }
  }, [isAdmin, location.search, location.pathname, setShowModal, navigate]);

  /* 🔑 AFTER LOGIN / SIGNUP (main site) */
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setShowModal(null);
    
    // If logging in during checkout, redirect to address page
    const isCheckoutFlow = sessionStorage.getItem("checkoutFlow");
    if (isCheckoutFlow === "true") {
      sessionStorage.removeItem("checkoutFlow");
      navigate("/add-address");
    }
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
          <Route path="/cart" element={<Cart />} />

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

  /* 🔁 LOAD USER ON START */
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(null);
      }
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

