import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, X, Handshake, Truck, Award, MapPin, ChevronDown, Eye, Printer, Check } from "lucide-react";

const TABS = [
  { id: "partners", label: "Shipping Partners" },
  { id: "zones", label: "Delivery Zones" },
  { id: "tracking", label: "Tracking Details" },
];

const mockPartners = [
  { id: 1, name: "BlueDart Express", status: "active", service: "Express / Standard", deliveryDays: "2-3 days", baseRate: 80, shipments: 1245, successRate: 98.5, zones: 4 },
  { id: 2, name: "Delhivery", status: "inactive", service: "Surface / Standard", deliveryDays: "4-5 days", baseRate: 60, shipments: 856, successRate: 97.8, zones: 2 },
];

const mockZones = [
  { id: 1, name: "Metro Cities", cities: "Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad", deliveryTime: "1-2 days", shippingCost: 80, codAvailable: true, partnersCount: 2 },
  { id: 2, name: "North India", cities: "Punjab, Haryana, Rajasthan, UP, Uttarakhand", deliveryTime: "3-4 days", shippingCost: 100, codAvailable: true, partnersCount: 2 },
];

const TIMELINE_EVENTS = [
  { key: "Order Placed", location: "Mumbai", desc: "Dinesh PVC Pipes order confirmed and ready for pickup", statusKey: "Order Placed" },
  { key: "Picked Up", location: "Dinesh PVC Pipes, Mumbai Warehouse", desc: "Dinesh PVC Pipes order picked up by courier", statusKey: "Picked Up" },
  { key: "In Transit", location: "Mumbai Hub", desc: "Package departed from Dinesh PVC Pipes Mumbai facility", statusKey: "In Transit" },
  { key: "In Transit", location: "Delhi Hub", desc: "Arrived at Delhi sorting facility", statusKey: "In Transit" },
  { key: "Out for Delivery", location: "Delhi - Sector 18", desc: "Expected to be out for delivery", statusKey: "Out For Delivery" },
  { key: "Delivered", location: "Customer Address", desc: "Dinesh PVC Pipes order delivered", statusKey: "Delivered" },
];

const STATUS_TO_TIMELINE_INDEX = { "Order Placed": 0, "Picked Up": 1, "In Transit": 3, "Out For Delivery": 4, "Delivered": 5 };

const mockTracking = [
  { id: 1, trackingId: "DPP-TRK-2024-001", partner: "BlueDart Express", status: "In Transit", orderId: "DPP-ORD-2024-1234", customer: "Ramesh Builders", origin: "Dinesh PVC Pipes, Mumbai Warehouse", destination: "A-123, Sector 18, Delhi - 110001", progress: 67, estDelivery: "25 Dec 2024", lastUpdate: "Delhi Hub - 2 days ago", weight: "2.5 kg", notes: "PVC pipes - Handle with care", shippingCost: 180 },
  { id: 2, trackingId: "DPP-TRK-2024-003", partner: "BlueDart Express", status: "Out For Delivery", orderId: "DPP-ORD-2024-1236", customer: "Kolkata Plumbing Co.", origin: "Dinesh PVC Pipes, Delhi Hub", destination: "C-789, Park Street, Kolkata - 700016", progress: 80, estDelivery: "24 Dec 2024", lastUpdate: "Kolkata - Park Street - 2 days ago", weight: "1.2 kg", notes: "Dinesh PVC Pipes fittings order", shippingCost: 80 },
  { id: 3, trackingId: "DPP-TRK-2024-004", partner: "BlueDart Express", status: "Order Placed", orderId: "DPP-ORD-2024-1237", customer: "Hyderabad Hardware", origin: "Dinesh PVC Pipes, Mumbai Warehouse", destination: "D-101, Banjara Hills, Hyderabad - 500034", progress: 20, estDelivery: "26 Dec 2024", lastUpdate: "Mumbai - 3 days ago", weight: "3 kg", notes: "", shippingCost: 100 },
];

function FilterDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 min-w-[140px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:border-gray-400 focus:ring-2 focus:ring-[#b30000] outline-none"
      >
        {value}
        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" aria-hidden onClick={() => setOpen(false)} />
          <ul className="absolute top-full left-0 mt-1 z-20 w-full min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-56 overflow-auto">
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`px-3 py-2 text-sm cursor-pointer ${opt === value ? "bg-[#b30000] text-white font-medium" : "text-gray-800 hover:bg-red-50 hover:text-[#b30000]"}`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function AdminShipments() {
  const [activeTab, setActiveTab] = useState("partners");
  const [partners, setPartners] = useState(mockPartners);
  const [zones, setZones] = useState(mockZones);
  const [tracking, setTracking] = useState(mockTracking);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [zoneSearch, setZoneSearch] = useState("");
  const [trackSearch, setTrackSearch] = useState("");
  const [trackStatusFilter, setTrackStatusFilter] = useState("All Status");
  const [trackPartnerFilter, setTrackPartnerFilter] = useState("All Partners");

  const [addPartnerOpen, setAddPartnerOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", status: "active", service: "", deliveryDays: "", baseRate: "", shipments: "", successRate: "", zones: "" });

  const [addZoneOpen, setAddZoneOpen] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [zoneForm, setZoneForm] = useState({ name: "", cities: "", deliveryTime: "", shippingCost: "", codAvailable: true, partnersCount: "" });

  const navigate = useNavigate();
  const [editingTrackingId, setEditingTrackingId] = useState(null);
  const [addTrackingOpen, setAddTrackingOpen] = useState(false);
  const [viewingDetailsId, setViewingDetailsId] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ trackingId: "", partner: "", status: "", orderId: "", customer: "", origin: "", destination: "", progress: "", estDelivery: "", lastUpdate: "" });

  const updatePartnerForm = (field, value) => setPartnerForm((p) => ({ ...p, [field]: value }));
  const updateZoneForm = (field, value) => setZoneForm((z) => ({ ...z, [field]: value }));
  const updateTrackingForm = (field, value) => setTrackingForm((t) => ({ ...t, [field]: value }));

  const kpis = useMemo(() => {
    const activePartners = partners.filter((p) => p.status === "active").length;
    const totalShipments = partners.reduce((s, p) => s + (p.shipments || 0), 0);
    const avgSuccess = partners.length ? (partners.reduce((s, p) => s + (p.successRate || 0), 0) / partners.length).toFixed(1) : "0";
    return { activePartners, totalShipments, avgSuccess, deliveryZones: zones.length };
  }, [partners, zones]);

  const filteredPartners = useMemo(() => {
    const q = partnerSearch.toLowerCase().trim();
    return q ? partners.filter((p) => p.name.toLowerCase().includes(q)) : partners;
  }, [partners, partnerSearch]);

  const filteredZones = useMemo(() => {
    const q = zoneSearch.toLowerCase().trim();
    return q ? zones.filter((z) => z.name.toLowerCase().includes(q) || z.cities.toLowerCase().includes(q)) : zones;
  }, [zones, zoneSearch]);

  const filteredTracking = useMemo(() => {
    let list = tracking;
    const q = trackSearch.toLowerCase().trim();
    if (q) list = list.filter((t) => t.trackingId.toLowerCase().includes(q) || t.orderId.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q));
    if (trackStatusFilter !== "All Status") list = list.filter((t) => t.status === trackStatusFilter);
    if (trackPartnerFilter !== "All Partners") list = list.filter((t) => t.partner === trackPartnerFilter);
    return list;
  }, [tracking, trackSearch, trackStatusFilter, trackPartnerFilter]);

  const exportTrackingCSV = () => {
    const headers = ["Tracking ID", "Order ID", "Customer", "Shipping Partner", "Status", "Origin", "Destination", "Progress %", "Est. Delivery", "Last Update", "Weight", "Shipping Cost (₹)", "Notes"];
    const escape = (v) => {
      const s = String(v ?? "");
      if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const rows = filteredTracking.map((t) => [
      t.trackingId,
      t.orderId,
      t.customer,
      t.partner,
      t.status,
      t.origin,
      t.destination,
      t.progress,
      t.estDelivery,
      t.lastUpdate,
      t.weight ?? "",
      t.shippingCost ?? "",
      t.notes ?? "",
    ].map(escape).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dinesh-pvc-pipes-shipments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const closePartnerModal = () => {
    setAddPartnerOpen(false);
    setEditingPartnerId(null);
    setPartnerForm({ name: "", status: "active", service: "", deliveryDays: "", baseRate: "", shipments: "", successRate: "", zones: "" });
  };

  const openEditPartner = (p) => {
    setPartnerForm({
      name: p.name,
      status: p.status,
      service: p.service || "",
      deliveryDays: p.deliveryDays || "",
      baseRate: p.baseRate != null ? String(p.baseRate) : "",
      shipments: p.shipments != null ? String(p.shipments) : "",
      successRate: p.successRate != null ? String(p.successRate) : "",
      zones: p.zones != null ? String(p.zones) : "",
    });
    setEditingPartnerId(p.id);
    setAddPartnerOpen(true);
  };

  const savePartner = () => {
    const payload = {
      name: partnerForm.name.trim() || "Partner",
      status: partnerForm.status,
      service: partnerForm.service.trim() || "",
      deliveryDays: partnerForm.deliveryDays.trim() || "",
      baseRate: parseInt(partnerForm.baseRate, 10) || 0,
      shipments: parseInt(partnerForm.shipments, 10) || 0,
      successRate: parseFloat(partnerForm.successRate) || 0,
      zones: parseInt(partnerForm.zones, 10) || 0,
    };
    if (editingPartnerId) {
      setPartners((prev) => prev.map((p) => (p.id === editingPartnerId ? { ...p, ...payload } : p)));
    } else {
      const nextId = partners.length ? Math.max(...partners.map((p) => p.id)) + 1 : 1;
      setPartners((prev) => [{ id: nextId, ...payload }, ...prev]);
    }
    closePartnerModal();
  };

  const deletePartner = (id) => setPartners((prev) => prev.filter((p) => p.id !== id));

  const togglePartnerStatus = (id) => {
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p)));
  };

  const closeZoneModal = () => {
    setAddZoneOpen(false);
    setEditingZoneId(null);
    setZoneForm({ name: "", cities: "", deliveryTime: "", shippingCost: "", codAvailable: true, partnersCount: "" });
  };

  const openEditZone = (z) => {
    setZoneForm({
      name: z.name,
      cities: z.cities || "",
      deliveryTime: z.deliveryTime || "",
      shippingCost: z.shippingCost != null ? String(z.shippingCost) : "",
      codAvailable: z.codAvailable !== false,
      partnersCount: z.partnersCount != null ? String(z.partnersCount) : "",
    });
    setEditingZoneId(z.id);
    setAddZoneOpen(true);
  };

  const saveZone = () => {
    const payload = {
      name: zoneForm.name.trim() || "Zone",
      cities: zoneForm.cities.trim() || "",
      deliveryTime: zoneForm.deliveryTime.trim() || "",
      shippingCost: parseInt(zoneForm.shippingCost, 10) || 0,
      codAvailable: zoneForm.codAvailable,
      partnersCount: parseInt(zoneForm.partnersCount, 10) || 0,
    };
    if (editingZoneId) {
      setZones((prev) => prev.map((z) => (z.id === editingZoneId ? { ...z, ...payload } : z)));
    } else {
      const nextId = zones.length ? Math.max(...zones.map((z) => z.id)) + 1 : 1;
      setZones((prev) => [{ id: nextId, ...payload }, ...prev]);
    }
    closeZoneModal();
  };

  const deleteZone = (id) => setZones((prev) => prev.filter((z) => z.id !== id));

  const openEditTracking = (t) => {
    setAddTrackingOpen(false);
    setTrackingForm({
      trackingId: t.trackingId,
      partner: t.partner,
      status: t.status,
      orderId: t.orderId,
      customer: t.customer,
      origin: t.origin,
      destination: t.destination,
      progress: String(t.progress),
      estDelivery: t.estDelivery,
      lastUpdate: t.lastUpdate,
    });
    setEditingTrackingId(t.id);
  };

  const closeTrackingModal = () => {
    setEditingTrackingId(null);
    setAddTrackingOpen(false);
    setTrackingForm({ trackingId: "", partner: "", status: "", orderId: "", customer: "", origin: "", destination: "", progress: "", estDelivery: "", lastUpdate: "" });
  };

  const openAddTracking = () => {
    setTrackingForm({ trackingId: "", partner: "", status: "Order Placed", orderId: "", customer: "", origin: "", destination: "", progress: "0", estDelivery: "", lastUpdate: "" });
    setAddTrackingOpen(true);
  };

  const saveTracking = () => {
    const payload = {
      trackingId: trackingForm.trackingId.trim(),
      partner: trackingForm.partner.trim(),
      status: trackingForm.status.trim(),
      orderId: trackingForm.orderId.trim(),
      customer: trackingForm.customer.trim(),
      origin: trackingForm.origin.trim(),
      destination: trackingForm.destination.trim(),
      progress: parseInt(trackingForm.progress, 10) || 0,
      estDelivery: trackingForm.estDelivery.trim(),
      lastUpdate: trackingForm.lastUpdate.trim(),
    };
    if (addTrackingOpen) {
      const nextId = tracking.length ? Math.max(...tracking.map((t) => t.id)) + 1 : 1;
      setTracking((prev) => [{ id: nextId, ...payload, weight: "", notes: "", shippingCost: 0 }, ...prev]);
      setAddTrackingOpen(false);
    } else if (editingTrackingId != null) {
      setTracking((prev) => prev.map((t) => (t.id === editingTrackingId ? { ...t, ...payload } : t)));
    }
    closeTrackingModal();
  };

  const deleteTracking = (id) => setTracking((prev) => prev.filter((t) => t.id !== id));

  const partnerOptions = ["All Partners", ...partners.map((p) => p.name)];
  const statusOptions = ["All Status", "Order Placed", "In Transit", "Out For Delivery", "Delivered"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Logistics & Shipments</h1>
        <p className="text-gray-500 text-sm mt-1">Manage shipping partners, delivery zones, and track shipments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Partners</p>
            <p className="text-2xl font-bold text-[#b30000]">{kpis.activePartners}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Shipments</p>
            <p className="text-2xl font-bold text-[#b30000]">{kpis.totalShipments}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Success Rate</p>
            <p className="text-2xl font-bold text-[#b30000]">{kpis.avgSuccess}%</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Delivery Zones</p>
            <p className="text-2xl font-bold text-[#b30000]">{kpis.deliveryZones}</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id ? "bg-white border border-b-0 border-gray-200 text-[#b30000] -mb-px" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "partners" && (
        <>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                placeholder="Search partners..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => { setEditingPartnerId(null); setPartnerForm({ name: "", status: "active", service: "", deliveryDays: "", baseRate: "", shipments: "", successRate: "", zones: "" }); setAddPartnerOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] border-2 border-[#b30000] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Partner
            </button>
          </div>
          <div className="space-y-4">
            {filteredPartners.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold">LOGO</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{p.name}</h3>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${p.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-[#b30000]"}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{p.service}</p>
                      <p className="text-xs text-gray-500">{p.deliveryDays}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">₹{p.baseRate}</p>
                      <p className="text-gray-500 text-xs">Base Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">{p.shipments}</p>
                      <p className="text-gray-500 text-xs">Shipments</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{p.successRate}%</p>
                      <p className="text-gray-500 text-xs">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">{p.zones} zones</p>
                      <p className="text-gray-500 text-xs">Regions</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => togglePartnerStatus(p.id)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                  >
                    {p.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button type="button" onClick={() => openEditPartner(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-red-50 hover:border-[#b30000] hover:text-[#b30000]">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button type="button" onClick={() => deletePartner(p.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tracking")}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                  >
                    View Tracking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "zones" && (
        <>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={zoneSearch}
                onChange={(e) => setZoneSearch(e.target.value)}
                placeholder="Search zones..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => { setEditingZoneId(null); setZoneForm({ name: "", cities: "", deliveryTime: "", shippingCost: "", codAvailable: true, partnersCount: "" }); setAddZoneOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] border-2 border-[#b30000] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Zone
            </button>
          </div>
          <div className="space-y-4">
            {filteredZones.map((z) => (
              <div key={z.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{z.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#b30000] shrink-0" />
                    {z.cities}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>Delivery Time: {z.deliveryTime}</span>
                    <span>Shipping Cost: ₹{z.shippingCost}</span>
                    <span className="text-green-600">COD Available: {z.codAvailable ? "Yes" : "No"}</span>
                    <span>Partners: {z.partnersCount} active</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEditZone(z)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-red-50 hover:border-[#b30000] hover:text-[#b30000]">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button type="button" onClick={() => deleteZone(z.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm hover:bg-red-100">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "tracking" && (
        <>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openAddTracking}
              className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000]"
            >
              <Plus className="w-4 h-4" /> Add Tracking
            </button>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={trackSearch}
                onChange={(e) => setTrackSearch(e.target.value)}
                placeholder="Search by Tracking ID, Order ID, or Customer..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
              />
            </div>
            <FilterDropdown options={statusOptions} value={trackStatusFilter} onChange={setTrackStatusFilter} />
            <FilterDropdown options={partnerOptions} value={trackPartnerFilter} onChange={setTrackPartnerFilter} />
            <button type="button" onClick={exportTrackingCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
              Export
            </button>
          </div>
          <p className="text-sm text-gray-600">Showing 1-{filteredTracking.length} of {filteredTracking.length} shipments</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracking.map((t) => (
              <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-start">
                  <span className="text-lg font-bold text-gray-900">{t.trackingId}</span>
                  <span className="text-sm text-gray-700">{t.partner}</span>
                </div>
                <span className={`inline-flex mt-2 px-2.5 py-1 rounded-md text-xs font-medium w-fit ${t.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                  {t.status}
                </span>
                <p className="text-sm text-gray-600 mt-2">Order: {t.orderId}</p>
                <p className="text-sm text-gray-600">Customer: {t.customer}</p>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1 flex-wrap">
                  <MapPin className="w-4 h-4 text-[#b30000] shrink-0" /> {t.origin}
                  <span className="text-gray-400">→</span>
                  <MapPin className="w-4 h-4 text-[#b30000] shrink-0" /> {t.destination}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#b30000] rounded-full" style={{ width: `${t.progress}%` }} />
                  </div>
                  <span className="text-sm font-medium text-[#b30000]">{t.progress}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>Est. Delivery: {t.estDelivery}</span>
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">{t.lastUpdate}</p>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button type="button" onClick={() => setViewingDetailsId(t.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b30000] text-white text-sm hover:bg-[#8c0000]">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <button type="button" onClick={() => navigate("/admin/shipments/print", { state: { shipment: t } })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                    <Printer className="w-4 h-4" /> Print Label
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {addPartnerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closePartnerModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{editingPartnerId ? "Edit Partner" : "Add Partner"}</h2>
              <button type="button" onClick={closePartnerModal} className="p-1 rounded text-gray-500 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partner name</label>
                <input type="text" value={partnerForm.name} onChange={(e) => updatePartnerForm("name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" placeholder="e.g. BlueDart, Delhivery" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={partnerForm.status} onChange={(e) => updatePartnerForm("status", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input type="text" value={partnerForm.service} onChange={(e) => updatePartnerForm("service", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" placeholder="Express / Standard" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery days</label>
                  <input type="text" value={partnerForm.deliveryDays} onChange={(e) => updatePartnerForm("deliveryDays", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" placeholder="2-3 days" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base rate (₹)</label>
                  <input type="number" value={partnerForm.baseRate} onChange={(e) => updatePartnerForm("baseRate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipments</label>
                  <input type="number" value={partnerForm.shipments} onChange={(e) => updatePartnerForm("shipments", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Success rate (%)</label>
                  <input type="number" step="0.1" value={partnerForm.successRate} onChange={(e) => updatePartnerForm("successRate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zones / Regions</label>
                <input type="number" value={partnerForm.zones} onChange={(e) => updatePartnerForm("zones", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button type="button" onClick={closePartnerModal} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100">Cancel</button>
              <button type="button" onClick={savePartner} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">{editingPartnerId ? "Update Partner" : "Add Partner"}</button>
            </div>
          </div>
        </>
      )}

      {addZoneOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeZoneModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{editingZoneId ? "Edit Zone" : "Add Zone"}</h2>
              <button type="button" onClick={closeZoneModal} className="p-1 rounded text-gray-500 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone name</label>
                <input type="text" value={zoneForm.name} onChange={(e) => updateZoneForm("name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" placeholder="e.g. Metro Cities" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Included cities</label>
                <input type="text" value={zoneForm.cities} onChange={(e) => updateZoneForm("cities", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" placeholder="Delhi, Mumbai, Bangalore..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery time</label>
                  <input type="text" value={zoneForm.deliveryTime} onChange={(e) => updateZoneForm("deliveryTime", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" placeholder="1-2 days" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping cost (₹)</label>
                  <input type="number" value={zoneForm.shippingCost} onChange={(e) => updateZoneForm("shippingCost", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="zone-cod" checked={zoneForm.codAvailable} onChange={(e) => updateZoneForm("codAvailable", e.target.checked)} className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]" />
                <label htmlFor="zone-cod" className="text-sm text-gray-700">COD Available</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Active partners count</label>
                <input type="number" value={zoneForm.partnersCount} onChange={(e) => updateZoneForm("partnersCount", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none" />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button type="button" onClick={closeZoneModal} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100">Cancel</button>
              <button type="button" onClick={saveZone} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">{editingZoneId ? "Update Zone" : "Add Zone"}</button>
            </div>
          </div>
        </>
      )}

      {(editingTrackingId != null || addTrackingOpen) && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeTrackingModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{addTrackingOpen ? "Add Tracking" : "Edit Tracking"}</h2>
              <button type="button" onClick={closeTrackingModal} className="p-1 rounded text-gray-500 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3">
              {["trackingId", "partner", "status", "orderId", "customer", "origin", "destination", "progress", "estDelivery", "lastUpdate"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.replace(/([A-Z])/g, " $1").trim()}</label>
                  <input
                    type={field === "progress" ? "number" : "text"}
                    value={trackingForm[field]}
                    onChange={(e) => updateTrackingForm(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button type="button" onClick={closeTrackingModal} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100">Cancel</button>
              <button type="button" onClick={saveTracking} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">{addTrackingOpen ? "Add Tracking" : "Update Tracking"}</button>
            </div>
          </div>
        </>
      )}

      {viewingDetailsId != null && (() => {
        const t = tracking.find((x) => x.id === viewingDetailsId);
        if (!t) return null;
        const currentIndex = STATUS_TO_TIMELINE_INDEX[t.status] ?? 0;
        return (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={() => setViewingDetailsId(null)} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">Tracking Details</h2>
                <button type="button" onClick={() => setViewingDetailsId(null)} className="p-1 rounded text-gray-500 hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6 pr-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">TRACKING ID</span><p className="text-gray-900 font-medium">{t.trackingId}</p></div>
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">CUSTOMER</span><p className="text-gray-900">{t.customer}</p></div>
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">CURRENT STATUS</span><p className="mt-1"><span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${t.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{t.status}</span></p></div>
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">WEIGHT</span><p className="text-gray-900">{t.weight || "—"}</p></div>
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">NOTES</span><div className={`mt-1 p-2 rounded border-l-4 ${t.notes ? "border-[#b30000] bg-gray-50 text-gray-700" : "border-gray-200 text-gray-500"}`}>{t.notes || "—"}</div></div>
                  </div>
                  <div className="space-y-3">
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">ORDER ID</span><p className="text-gray-900 font-medium">{t.orderId}</p></div>
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">SHIPPING PARTNER</span><p className="text-gray-900">{t.partner}</p></div>
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">EST. DELIVERY</span><p className="text-gray-900">{t.estDelivery}</p></div>
                    <div><span className="text-xs font-semibold text-gray-500 uppercase">SHIPPING COST</span><p className="text-gray-900">₹{t.shippingCost ?? "—"}</p></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-4">Shipment Timeline</h3>
                  <div className="relative border-l-2 border-gray-200 pl-12">
                    {TIMELINE_EVENTS.map((ev, i) => {
                      const isCompleted = i < currentIndex;
                      const isCurrent = i === currentIndex;
                      const hasTimestamp = isCompleted || isCurrent;
                      const isLast = i === TIMELINE_EVENTS.length - 1;
                      return (
                        <div key={i} className={`relative ${!isLast ? "pb-6" : ""}`}>
                          <span className={`absolute left-0 w-5 h-5 rounded-full border-2 flex items-center justify-center -translate-x-[calc(1rem+1px)] shrink-0 ${isCompleted ? "bg-green-500 border-green-500 text-white" : isCurrent ? "bg-[#b30000] border-[#b30000] text-white" : "bg-white border-gray-300"}`} style={{ top: "0.125rem" }}>
                            {(isCompleted || isCurrent) && <Check className="w-3 h-3" strokeWidth={3} />}
                          </span>
                          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 ml-6">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800">{ev.key}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5 text-[#b30000] shrink-0" /> {ev.location}</p>
                              <p className="text-sm text-gray-500">{ev.desc}</p>
                            </div>
                            {hasTimestamp && <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{i === 0 ? "2024-12-20 10:30 AM" : i === 1 ? "2024-12-20 02:15 PM" : i === 2 ? "2024-12-20 06:45 PM" : i === 3 ? "2024-12-23 08:30 AM" : "—"}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => { navigate("/admin/shipments/print", { state: { shipment: t } }); setViewingDetailsId(null); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">
                  <Printer className="w-4 h-4" /> Print Label
                </button>
                <button type="button" onClick={() => setViewingDetailsId(null)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100">
                  Close
                </button>
              </div>
            </div>
          </>
        );
      })()}

    </div>
  );
}
