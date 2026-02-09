import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Printer } from "lucide-react";

export default function AdminShipmentPrintLabel() {
  const navigate = useNavigate();
  const location = useLocation();
  const shipment = location.state?.shipment;

  React.useEffect(() => {
    if (!shipment) navigate("/admin/shipments", { replace: true });
  }, [shipment, navigate]);

  if (!shipment) return null;

  const now = new Date();
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  const phone = shipment.phone ?? "—";
  const dimensions = shipment.dimensions ?? "30x20x15 cm";
  const packageType = shipment.packageType ?? "Dinesh PVC Pipes Carton";
  const paymentStatus = shipment.paymentStatus ?? "Prepaid";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Buttons: visible on screen, hidden when printing */}
      <div className="no-print mb-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/shipments")}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      {/* Printable label: full-page layout like image 2/3 */}
      <div
        id="print-label-content"
        className="bg-white border-2 border-black shadow-none max-w-xl mx-auto p-8 print:border-2 print:shadow-none print:max-w-none"
      >
        <div className="flex justify-between items-start text-sm text-black mb-4">
          <span>{dateStr}, {timeStr}</span>
          <span className="font-semibold">Dinesh PVC Pipes - Shipping Label - {shipment.trackingId}</span>
        </div>

        <h1 className="text-2xl font-bold text-center text-black uppercase tracking-wide">
          Dinesh PVC Pipes - Shipping Label
        </h1>
        <p className="text-center text-black mt-1">{shipment.partner}</p>
        <hr className="border-black my-4" />

        <p className="text-2xl font-bold text-center text-black my-4">{shipment.trackingId}</p>
        <hr className="border-black my-4" />

        <div className="space-y-4 text-black">
          <div>
            <p className="font-bold uppercase text-sm">FROM:</p>
            <p className="mt-0.5">{shipment.origin}</p>
          </div>
          <div>
            <p className="font-bold uppercase text-sm">TO:</p>
            <p className="mt-0.5">{shipment.customer}</p>
            <p>{shipment.destination}</p>
            <p>{phone}</p>
          </div>
          <div>
            <p className="font-bold uppercase text-sm">PACKAGE DETAILS:</p>
            <p className="mt-0.5">Weight: {shipment.weight ?? "—"}</p>
            <p>Dimensions: {dimensions}</p>
            <p>Type: {packageType}</p>
          </div>
          <div>
            <p className="font-bold uppercase text-sm">ORDER INFO:</p>
            <p className="mt-0.5">Order ID: {shipment.orderId}</p>
            <p>Payment: {paymentStatus}</p>
            <p>Notes: {shipment.notes || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
