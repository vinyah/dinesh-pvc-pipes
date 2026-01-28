import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

/* 🧩 COMPONENTS */
import Header from "./components/Header";
import Footer from "./components/Footer";

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

// Error Boundary Component
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
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1 style={{ color: "#b30000" }}>Something went wrong</h1>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "20px", textAlign: "left" }}>
            <summary>Error Details (Click to expand)</summary>
            <pre style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#b30000",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
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

  /* 🔑 AFTER LOGIN / SIGNUP */
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

  return (
    <>
      {/* HEADER */}
      <Header
        currentUser={currentUser}
        openAuthModal={setShowModal}
        setCurrentUser={setCurrentUser}
      />

      {/* MAIN CONTENT */}
      <main className="w-full flex-1 max-md:!mt-0 max-md:!pt-0">
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
  const [showModal, setShowModal] = useState(null); // login | signup | null

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

