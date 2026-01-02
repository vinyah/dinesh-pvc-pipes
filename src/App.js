import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* 🧩 COMPONENTS */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* 🏠 MAIN PAGES */
import Home from "./pages/Home";
import Items from "./pages/Items";
import Orders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import Account from "./pages/ProfilePage";
import LoginSignupModal from "./pages/LoginSignupModal";

/* 🧱 PRODUCT DETAILS */
import ProductDetails from "./pages/ProductDetails";

/* 🧱 PIPE FITTINGS */
import PipeFittingPage from "./pages/PipeFittingPage";
import PipeFittingPageA from "./pages/PipeFittingPageA";
import PipeFittingPageB from "./pages/PipeFittingPageB";
import PipeFittingPageC from "./pages/PipeFittingPageC";

/* 🧱 FLEXIBLE PIPE */
import FlexiblePipePage from "./pages/FlexiblePipePage";

/* 🧱 BOXES */
import BoxesPage from "./pages/BoxesPage";
import BoxPageA from "./pages/BoxPageA";
import BoxPageB from "./pages/BoxPageB";
import BoxPageC from "./pages/BoxPageC";
import BoxPageD from "./pages/BoxPageD";

/* 🧱 OTHER PRODUCTS */
import BraidedHosePage from "./pages/BraidedHosePage";
import ZebraHosePage from "./pages/ZebraHosePage";
import PipeBendPage from "./pages/PipeBendPage";

/* 🧾 CHECKOUT FLOW */
import CheckoutAuthPage from "./pages/CheckoutAuthPage";
import AddAddressPage from "./pages/AddAddressPage";
import DeliveryPage from "./pages/DeliveryPage";
import ReviewOrderPage from "./pages/ReviewOrderPage";
import OrderProcessingPage from "./pages/OrderProcessingPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

/* 🛒 CART CONTEXT */
import { CartProvider } from "./context/CartContext";

/* 💄 GLOBAL CSS */
import "./App.css";

const CURRENT_USER_KEY = "currentUser";

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

  /* 🔑 AFTER LOGIN / SIGNUP */
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setShowModal(null);
  };

  return (
    <CartProvider>
      <Router>
        <div className="app">
          {/* HEADER */}
          <Header
            currentUser={currentUser}
            openAuthModal={setShowModal}
            setCurrentUser={setCurrentUser}
          />

          {/* MAIN CONTENT */}
          <main className="main-content">
            <Routes>
              {/* 🏠 HOME */}
              <Route path="/" element={<Home setShowModal={setShowModal} />} />
              <Route path="/items" element={<Items />} />
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

              {/* 🧩 PRODUCT DETAILS */}
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* 🧱 PIPE FITTINGS */}
              <Route path="/pipefitting" element={<PipeFittingPage />} />
              <Route path="/pipefitting/a" element={<PipeFittingPageA />} />
              <Route path="/pipefitting/b" element={<PipeFittingPageB />} />
              <Route path="/pipefitting/c" element={<PipeFittingPageC />} />

              {/* 🧱 FLEXIBLE PIPE */}
              <Route path="/flexiblepipe" element={<FlexiblePipePage />} />

              {/* 🧱 BOXES */}
              <Route path="/boxes" element={<BoxesPage />} />
              <Route path="/boxes/a" element={<BoxPageA />} />
              <Route path="/boxes/b" element={<BoxPageB />} />
              <Route path="/boxes/c" element={<BoxPageC />} />
              <Route path="/boxes/d" element={<BoxPageD />} />

              {/* 🧱 OTHER PRODUCTS */}
              <Route path="/braidedhose" element={<BraidedHosePage />} />
              <Route path="/zebrahose" element={<ZebraHosePage />} />
              <Route path="/pipebend" element={<PipeBendPage />} />

              {/* 🧾 CHECKOUT */}
              <Route path="/checkout-auth" element={<CheckoutAuthPage />} />
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
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
