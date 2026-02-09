import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Plus, Pencil, Trash2, X, Mail, Phone } from "lucide-react";
import db from "../../../db.json";

const SEGMENT_OPTIONS = ["All Segments", "VIP", "Loyal", "Regular", "New", "None"];
const STATUS_OPTIONS = ["All Status", "Active", "Inactive", "Blocked"];
const SEGMENT_VALUES = ["VIP", "Loyal", "Regular", "New", "None"];
const STATUS_VALUES = ["Active", "Inactive", "Blocked"];
const RISK_OPTIONS = ["None", "COD-Only", "High RTO"];
const PAGE_SIZE = 10;

function buildCustomerList() {
  const profiles = db?.profiles ?? [];
  const segments = ["VIP", "Regular", "New", "Loyal", "Regular"];
  const lastSeen = ["2 hours ago", "1 day ago", "2 days ago", "5 days ago", "1 week ago"];
  const riskFlags = ["None", "None", "COD-Only", "None", "High RTO"];
  const statuses = ["Active", "Active", "Active", "Inactive", "Active"];
  const names = ["Ramesh Builders", "Kolkata Plumbing Co.", "Hyderabad Hardware", "Chennai Pipes & Fittings", "Bangalore Plumbing Store", "Suresh Nair", "Kavita Reddy", "Rajesh Iyer"];
  const emails = names.map((n, i) => (n.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "") || "customer" + (i + 1)) + "@gmail.com");
  const phones = ["+91 98765 43210", "+91 98765 43211", "+91 98765 43212", "+91 98765 43213", "+91 98765 43214", "+91 98765 43215", "+91 98765 43216", "+91 98765 43217"];
  const ordersCounts = [12, 3, 7, 5, 1, 4, 2, 8];
  const ltvs = [45680, 12450, 28900, 15420, 2499, 18900, 5600, 32100];

  if (profiles.length > 0) {
    return profiles.map((p, i) => ({
      id: p.id,
      customerId: `DPP-CUST-${String(1000 + p.id).padStart(4, "0")}`,
      name: p.name,
      email: p.email || "",
      phone: p.phone || "",
      orders: 1,
      ltv: 0,
      segment: "New",
      lastSeen: "1 day ago",
      riskFlag: "None",
      status: "Active",
    }));
  }

  return names.map((name, i) => ({
    id: i + 1,
    customerId: `DPP-CUST-${1001 + i}`,
    name,
    email: emails[i],
    phone: phones[i],
    orders: ordersCounts[i],
    ltv: ltvs[i],
    segment: segments[i % segments.length],
    lastSeen: lastSeen[i % lastSeen.length],
    riskFlag: riskFlags[i % riskFlags.length],
    status: statuses[i % statuses.length],
  }));
}

function FilterDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 min-w-[120px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:border-gray-400 focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
      >
        {value}
        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" aria-hidden onClick={() => setOpen(false)} />
          <ul className="absolute top-full left-0 mt-1 z-20 w-full min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.15)] py-1 max-h-56 overflow-auto">
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  opt === value ? "bg-[#b30000] text-white font-medium" : "text-gray-800 hover:bg-red-50 hover:text-[#b30000]"
                }`}
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

function segmentBadgeClass(seg) {
  if (seg === "VIP") return "bg-purple-100 text-purple-800";
  if (seg === "Loyal") return "bg-blue-100 text-blue-800";
  if (seg === "Regular") return "bg-green-100 text-green-800";
  if (seg === "New") return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-800";
}

function riskBadgeClass(risk) {
  if (risk === "High RTO") return "bg-red-100 text-[#b30000]";
  if (risk === "COD-Only") return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-600";
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(() => buildCustomerList());
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("All Segments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    customerId: "",
    segment: "Regular",
    status: "Active",
    riskFlag: "None",
  });

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !(c.phone || "").includes(q) && !(c.customerId || "").toLowerCase().includes(q)) return false;
      if (segmentFilter !== "All Segments" && c.segment !== segmentFilter) return false;
      if (statusFilter !== "All Status" && c.status !== statusFilter) return false;
      return true;
    });
  }, [customers, search, segmentFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSelect = (id) => setSelectedIds((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleSelectAll = () => setSelectedIds((s) => (s.size === filtered.length && filtered.length > 0 ? new Set() : new Set(filtered.map((c) => c.id))));

  const closeModal = () => {
    setAddOpen(false);
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", customerId: "", segment: "Regular", status: "Active", riskFlag: "None" });
  };

  const openEdit = (c) => {
    setForm({
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
      customerId: c.customerId || "",
      segment: c.segment || "Regular",
      status: c.status || "Active",
      riskFlag: c.riskFlag || "None",
    });
    setEditingId(c.id);
  };

  const handleSave = () => {
    const payload = {
      name: form.name.trim() || "Customer",
      email: form.email.trim() || "",
      phone: form.phone.trim() || "",
      customerId: form.customerId.trim() || (editingId ? customers.find((x) => x.id === editingId)?.customerId : `DPP-CUST-${1000 + customers.length + 1}`),
      segment: form.segment,
      status: form.status,
      riskFlag: form.riskFlag,
    };
    if (editingId) {
      const existing = customers.find((c) => c.id === editingId);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, ...payload, orders: existing.orders, ltv: existing.ltv, lastSeen: existing.lastSeen }
            : c
        )
      );
    } else {
      const newId = customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
      setCustomers((prev) => [
        {
          id: newId,
          ...payload,
          orders: 0,
          ltv: 0,
          lastSeen: "Just now",
        },
        ...prev,
      ]);
    }
    closeModal();
  };

  const deleteCustomer = (id) => setCustomers((prev) => prev.filter((c) => c.id !== id));

  const modalOpen = addOpen || editingId != null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer relationships and profiles.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddOpen(true);
            setForm({ name: "", email: "", phone: "", customerId: "", segment: "Regular", status: "Active", riskFlag: "None" });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] border-2 border-[#b30000] transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, Email, Phone, Customer ID..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
          />
        </div>
        <FilterDropdown options={SEGMENT_OPTIONS} value={segmentFilter} onChange={setSegmentFilter} />
        <FilterDropdown options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">CUSTOMER</th>
                <th className="px-4 py-3 font-semibold text-gray-700">CONTACT</th>
                <th className="px-4 py-3 font-semibold text-gray-700">ORDERS</th>
                <th className="px-4 py-3 font-semibold text-gray-700">LTV</th>
                <th className="px-4 py-3 font-semibold text-gray-700">SEGMENT</th>
                <th className="px-4 py-3 font-semibold text-gray-700">LAST SEEN</th>
                <th className="px-4 py-3 font-semibold text-gray-700">RISK FLAGS</th>
                <th className="px-4 py-3 font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" className="text-[#b30000] font-semibold hover:underline text-left">
                        {c.name}
                      </button>
                      <p className="text-xs text-gray-500">{c.customerId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-xs">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-700 mt-0.5">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-xs">{c.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{c.orders}</td>
                    <td className="px-4 py-3">
                      <button type="button" className="text-[#b30000] font-medium hover:underline">
                        ₹{Number(c.ltv).toLocaleString("en-IN")}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${segmentBadgeClass(c.segment)}`}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.lastSeen}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${riskBadgeClass(c.riskFlag)}`}>
                        {c.riskFlag}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-[#b30000] transition-colors border border-gray-200"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCustomer(c.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`min-w-[32px] px-3 py-1.5 rounded-lg text-sm font-medium ${n === currentPage ? "bg-[#b30000] text-white border-2 border-[#b30000]" : "border border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-gray-800">{editingId ? "Edit Customer" : "Add Customer"}</h2>
              <button type="button" onClick={closeModal} className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="customer@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID (optional)</label>
                <input
                  type="text"
                  value={form.customerId}
                  onChange={(e) => updateForm("customerId", e.target.value)}
                  placeholder="e.g. DPP-CUST-1001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
                  <select
                    value={form.segment}
                    onChange={(e) => updateForm("segment", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  >
                    {SEGMENT_VALUES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  >
                    {STATUS_VALUES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk flag</label>
                <select
                  value={form.riskFlag}
                  onChange={(e) => updateForm("riskFlag", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                >
                  {RISK_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000] transition-colors">
                {editingId ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
