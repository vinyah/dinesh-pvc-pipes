import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddAddressPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // If user already selected an address earlier in the flow, prefill it
    const saved = sessionStorage.getItem("checkoutAddress") || localStorage.getItem("userAddress");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setName(obj.name || "");
        setAddress(obj.line1 || obj.address || "");
        setCity(obj.city || "");
        setStateVal(obj.state || "");
        setPincode(obj.pin || obj.pincode || "");
        setPhone(obj.phone || "");
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const handleContinue = () => {
    // Basic validation
    if (!name.trim()) {
      alert("Please enter a name for the delivery address.");
      return;
    }
    if (!address.trim()) {
      alert("Please enter the address line.");
      return;
    }
    if (!city.trim()) {
      alert("Please enter the city.");
      return;
    }
    if (!stateVal.trim()) {
      alert("Please enter the state.");
      return;
    }
    if (!pincode.trim()) {
      alert("Please enter the pincode.");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter a contact phone number.");
      return;
    }

    // Build consistent address object for checkout
    const checkoutAddress = {
      name: name.trim(),
      line1: address.trim(),
      city: city.trim(),
      state: stateVal.trim(),
      pin: pincode.trim(),
      phone: phone.trim(),
    };

    // Save to sessionStorage so the Delivery and Review steps can read it
    sessionStorage.setItem("checkoutAddress", JSON.stringify(checkoutAddress));

    // Also keep legacy localStorage key for backward compatibility if you used it elsewhere
    localStorage.setItem("userAddress", JSON.stringify(checkoutAddress));

    // Navigate to Delivery Options step
    navigate("/delivery");
  };

  return (
    <div className="w-full bg-white py-8 px-4 md:px-8 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#b30000] text-center mb-8">
        Select Delivery Address
      </h1>

      {/* Address Form Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-200">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Recipient name (e.g. Ramesh Kumar)"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] resize-y min-h-[100px]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House no, street, landmark, etc."
              />
            </div>

            {/* City & State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            {/* Pincode & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile number"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                className="flex-1 px-6 py-3 bg-[#b30000] text-white rounded-lg font-semibold hover:bg-[#8b0000] transition-colors"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>

              <button
                className="flex-1 px-6 py-3 border-2 border-[#b30000] text-[#b30000] bg-white rounded-lg font-semibold hover:bg-[#b30000] hover:text-white transition-colors"
                onClick={handleContinue}
              >
                Continue to Delivery Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddressPage;
