import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// 🏠 Main Pages
import Home from "./pages/Home";
import Items from "./pages/Items";
import Orders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import Account from "./pages/ProfilePage";
import LoginSignupModal from "./pages/LoginSignupModal";

// 🧱 Product Details Page (PVC Pipe)
import ProductDetails from "./pages/ProductDetails";

// 🧱 Pipe Fitting Pages
import PipeFittingPage from "./pages/PipeFittingPage";
import PipeFittingPageA from "./pages/PipeFittingPageA";
import PipeFittingPageB from "./pages/PipeFittingPageB";
import PipeFittingPageC from "./pages/PipeFittingPageC";

// 🧱 Flexible Pipe Page
import FlexiblePipePage from "./pages/FlexiblePipePage";

// 🧱 Boxes Pages
import BoxesPage from "./pages/BoxesPage";
import BoxPageA from "./pages/BoxPageA";
import BoxPageB from "./pages/BoxPageB";
import BoxPageC from "./pages/BoxPageC";
import BoxPageD from "./pages/BoxPageD";

// 🧱 Braided Hose Pipe Page
import BraidedHosePage from "./pages/BraidedHosePage";

// 🧱 Zebra Hose Pipe Page
import ZebraHosePage from "./pages/ZebraHosePage";

// 🧱 Pipe Bend Page
import PipeBendPage from "./pages/PipeBendPage";

// 🏠 Checkout Flow Pages
import AddAddressPage from "./pages/AddAddressPage";
import ReviewOrderPage from "./pages/ReviewOrderPage";

// 🛒 Global Cart Context
import { CartProvider } from "./context/CartContext";

// 💄 CSS
import "./App.css";

function App() {
  // controls global login / signup popup
  const [showModal, setShowModal] = useState(null); // "login" | "signup" | null

  return (
    <CartProvider>
      <Router>
        <div className="app">
          {/* Header (if you ever want auth buttons here, you can pass setShowModal as a prop) */}
          <Header />

          <main className="main-content">
            <Routes>
              {/* 🏠 MAIN PAGES */}
              <Route
                path="/"
                element={<Home setShowModal={setShowModal} />}
              />
              <Route path="/items" element={<Items />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />

              {/* 👤 Profile page (can also open login/signup modal) */}
              <Route
                path="/account"
                element={<Account openAuthModal={setShowModal} />}
              />

              {/* 🧩 PVC PRODUCT DETAILS */}
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* 🧱 PIPE FITTING ROUTES */}
              <Route path="/pipefitting" element={<PipeFittingPage />} />
              <Route path="/pipefitting/a" element={<PipeFittingPageA />} />
              <Route path="/pipefitting/b" element={<PipeFittingPageB />} />
              <Route path="/pipefitting/c" element={<PipeFittingPageC />} />

              {/* 🧱 FLEXIBLE PIPE ROUTE */}
              <Route path="/flexiblepipe" element={<FlexiblePipePage />} />

              {/* 🧱 BOXES ROUTES */}
              <Route path="/boxes" element={<BoxesPage />} />
              <Route path="/boxes/a" element={<BoxPageA />} />
              <Route path="/boxes/b" element={<BoxPageB />} />
              <Route path="/boxes/c" element={<BoxPageC />} />
              <Route path="/boxes/d" element={<BoxPageD />} />

              {/* 🧱 BRAIDED HOSE ROUTE */}
              <Route path="/braidedhose" element={<BraidedHosePage />} />

              {/* 🧱 ZEBRA HOSE ROUTE */}
              <Route path="/zebrahose" element={<ZebraHosePage />} />

              {/* 🧱 PIPE BEND ROUTE */}
              <Route path="/pipebend" element={<PipeBendPage />} />

              {/* 🧾 CHECKOUT FLOW ROUTES */}
              <Route path="/add-address" element={<AddAddressPage />} />
              <Route path="/review-order" element={<ReviewOrderPage />} />
            </Routes>
          </main>

          {/* Footer can also open Login / Signup via these props */}
          <Footer setShowModal={setShowModal} />

          {/* 🔐 LOGIN/SIGNUP MODAL (shared globally) */}
          {showModal && (
            <LoginSignupModal
              type={showModal}          // "login" or "signup"
              onClose={() => setShowModal(null)}
            />
          )}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
