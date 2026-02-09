import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, ExternalLink, Plus, X } from "lucide-react";
import db from "../../../db.json";

const THEME = { primary: "#b30000" };

// Collect all product codes and names from website catalog (db.products)
function getWebsiteProducts() {
  const products = db?.products ?? {};
  const list = [];
  Object.values(products).forEach((category) => {
    if (!Array.isArray(category)) return;
    category.forEach((p) => {
      const code = p.code ?? p.id;
      const name = p.name ?? "";
      if (code) list.push({ code: String(code), name });
    });
  });
  return list;
}

// Expected order shape (for backend). Map your API response to this.
// { id, orderId, dateTime, customer, items, total, payment, status, fulfillment, channel, sla }
function buildMockOrders() {
  const productList = getWebsiteProducts();
  const now = new Date();
  const fmt = (d, h = 12, min = 0) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day} ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };
  const day = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  };
  const customers = ["Ramesh Builders", "Kolkata Plumbing Co.", "Hyderabad Hardware", "Chennai Pipes & Fittings", "Bangalore Plumbing Store", "Suresh Nair", "Kavita Reddy", "Rajesh Iyer"];
  const payments = ["Paid", "COD", "Paid", "Paid", "COD", "Paid", "COD", "Paid"];
  const statuses = ["Accepted", "Waiting", "Accepted", "Accepted", "Waiting", "Accepted", "Accepted", "Accepted"];
  const fulfillments = ["Shipped", "Processing", "Delivered", "Packed", "Processing", "Delivered", "Shipped", "Delivered"];
  const channels = ["Website", "Mobile App", "Website", "Website", "Mobile App", "Website", "Mobile App", "Website"];
  const slas = ["2h left", "4h left", "On Time", "6h left", "On Time", "On Time", "On Time", "On Time"];
  const dayOffsets = [0, 0, 1, 1, 2, 5, 15, 45];
  const times = [[14, 32], [12, 15], [18, 45], [11, 20], [9, 0], [10, 30], [16, 0], [9, 45]];
  const itemsCounts = [3, 1, 5, 2, 4, 1, 2, 3];
  const totals = [8950, 2499, 15200, 5600, 18900, 3200, 6700, 11200];

  if (productList.length === 0) {
    return [
      { id: 1, orderId: "DPP-ORD-001", dateTime: fmt(day(0), 14, 32), customer: "Ramesh Builders", items: 3, total: 8950, payment: "Paid", status: "Accepted", fulfillment: "Shipped", channel: "Website", sla: "2h left" },
      { id: 2, orderId: "DPP-ORD-002", dateTime: fmt(day(0), 12, 15), customer: "Kolkata Plumbing Co.", items: 1, total: 2499, payment: "COD", status: "Waiting", fulfillment: "Processing", channel: "Mobile App", sla: "4h left" },
    ];
  }

  return dayOffsets.map((offset, i) => {
    const product = productList[i % productList.length];
    const seq = String(i + 1).padStart(3, "0");
    const orderId = `DPP-ORD-${product.code}-${seq}`;
    return {
      id: i + 1,
      orderId,
      dateTime: fmt(day(offset), times[i][0], times[i][1]),
      customer: customers[i],
      items: itemsCounts[i],
      total: totals[i],
      payment: payments[i],
      status: statuses[i],
      fulfillment: fulfillments[i],
      channel: channels[i],
      sla: slas[i],
      productCode: product.code,
      productName: product.name,
    };
  });
}

// Normalize backend response to expected order shape (use when API returns different keys)
function normalizeOrder(row) {
  if (!row) return null;
  return {
    id: row.id ?? row.order_id,
    orderId: row.orderId ?? row.order_id ?? String(row.id ?? ""),
    dateTime: row.dateTime ?? row.date_time ?? row.createdAt ?? "",
    customer: row.customer ?? row.customerName ?? row.customer_name ?? "",
    items: Number(row.items ?? row.item_count ?? row.quantity ?? 0),
    total: Number(row.total ?? row.amount ?? row.grand_total ?? 0),
    payment: row.payment ?? row.paymentMethod ?? "Paid",
    status: row.status ?? row.orderStatus ?? "Accepted",
    fulfillment: row.fulfillment ?? row.fulfillmentStatus ?? row.shipping_status ?? "Processing",
    channel: row.channel ?? row.source ?? "Website",
    sla: row.sla ?? row.sla_status ?? "On Time",
  };
}

const PAYMENT_OPTIONS = ["All Payments", "Paid", "COD", "Failed"];
const STATUS_OPTIONS = ["All Status", "Processing", "Shipped", "Delivered", "Packed", "In Transit", "Cancelled"];
const DATE_OPTIONS = ["Today", "Last 7 Days", "Last 30 Days", "Last 90 Days"];
const CHANNEL_OPTIONS = ["All Channels", "Website", "Mobile App", "Manual"];

const PAYMENT_FORM_OPTIONS = ["Paid", "COD", "Failed"];
const STATUS_FORM_OPTIONS = ["Accepted", "Waiting", "Processing", "Shipped", "Delivered", "Packed", "In Transit", "Cancelled"];
const FULFILLMENT_FORM_OPTIONS = ["Shipped", "Processing", "Delivered", "Packed", "In Transit"];
const CHANNEL_FORM_OPTIONS = ["Website", "Mobile App", "Manual"];

function parseOrderDate(dateTimeStr) {
  const [datePart] = dateTimeStr.split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function orderMatchesDateRange(orderDate, dateFilter) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const orderDayStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = (todayStart - orderDayStart) / msPerDay;

  switch (dateFilter) {
    case "Today":
      return daysDiff === 0;
    case "Last 7 Days":
      return daysDiff >= 0 && daysDiff <= 7;
    case "Last 30 Days":
      return daysDiff >= 0 && daysDiff <= 30;
    case "Last 90 Days":
      return daysDiff >= 0 && daysDiff <= 90;
    default:
      return true;
  }
}

function FilterDropdown({ label, options, value, onChange }) {
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
          <ul
            className="absolute top-full left-0 mt-1 z-20 w-full min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.15)] py-1 max-h-56 overflow-auto"
            role="listbox"
          >
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={opt === value}
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

function Badge({ children, variant = "default" }) {
  const styles = {
    paid: "bg-green-100 text-green-800",
    cod: "bg-blue-100 text-blue-800",
    failed: "bg-red-100 text-[#b30000]",
    accepted: "bg-green-100 text-green-800",
    waiting: "bg-amber-100 text-amber-800",
    shipped: "bg-[#b30000]/15 text-[#b30000]",
    processing: "bg-[#b30000]/15 text-[#b30000]",
    delivered: "bg-[#b30000]/15 text-[#b30000]",
    packed: "bg-[#b30000]/15 text-[#b30000]",
    "in transit": "bg-[#b30000]/15 text-[#b30000]",
    cancelled: "bg-gray-100 text-gray-600",
    default: "bg-gray-100 text-gray-800",
    sla: "bg-green-100 text-green-800",
  };
  const c = styles[variant] ?? styles.default;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c}`}>{children}</span>;
}

function DateTimeCell({ dateTime }) {
  const [datePart, timePart] = (dateTime || "").split(" ");
  return (
    <div className="flex flex-col">
      <span className="text-gray-800">{datePart || "—"}</span>
      <span className="text-gray-500 text-xs">{timePart || "—"}</span>
    </div>
  );
}

const API_ORDERS_URL = "/api/admin/orders"; // Set to your backend endpoint; when not used, mock data is shown.

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("Last 7 Days");
  const [channelFilter, setChannelFilter] = useState("All Channels");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [manualOrderOpen, setManualOrderOpen] = useState(false);
  const [manualOrderForm, setManualOrderForm] = useState({
    orderId: "",
    date: "",
    time: "",
    customer: "",
    items: "",
    total: "",
    payment: "Paid",
    status: "Accepted",
    fulfillment: "Processing",
    channel: "Website",
    sla: "On Time",
  });

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ORDERS_URL);
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.orders ?? data?.data ?? [];
      setOrders(list.map(normalizeOrder).filter(Boolean));
    } catch {
      setOrders(buildMockOrders());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const toggleSelect = (id) => setSelectedIds((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleSelectAll = () => setSelectedIds((s) => s.size === filtered.length && filtered.length > 0 ? new Set() : new Set(filtered.map((o) => o.id)));

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    if (q && !o.orderId.toLowerCase().includes(q) && !o.customer.toLowerCase().includes(q)) return false;
    if (paymentFilter !== "All Payments" && o.payment !== paymentFilter) return false;
    if (statusFilter !== "All Status" && o.fulfillment !== statusFilter) return false;
    if (channelFilter !== "All Channels" && o.channel !== channelFilter) return false;
    const orderDate = parseOrderDate(o.dateTime);
    if (!orderMatchesDateRange(orderDate, dateFilter)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all customer orders.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, "0");
            const d = String(now.getDate()).padStart(2, "0");
            const h = String(now.getHours()).padStart(2, "0");
            const min = String(now.getMinutes()).padStart(2, "0");
            setManualOrderForm({
              orderId: "",
              date: `${y}-${m}-${d}`,
              time: `${h}:${min}`,
              customer: "",
              items: "",
              total: "",
              payment: "Paid",
              status: "Accepted",
              fulfillment: "Processing",
              channel: "Website",
              sla: "On Time",
            });
            setManualOrderOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8b0000] border-2 border-[#b30000] transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Manual Order
        </button>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Customer Name"
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
          />
        </div>
        <FilterDropdown label="Payment" options={PAYMENT_OPTIONS} value={paymentFilter} onChange={setPaymentFilter} />
        <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        <FilterDropdown label="Date" options={DATE_OPTIONS} value={dateFilter} onChange={setDateFilter} />
        <FilterDropdown label="Channel" options={CHANNEL_OPTIONS} value={channelFilter} onChange={setChannelFilter} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#b30000] rounded-lg px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-4 py-12 text-center text-gray-500">Loading orders…</div>
        ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">ORDER ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">DATE & TIME</th>
                <th className="px-4 py-3 font-semibold text-gray-700">CUSTOMER</th>
                <th className="px-4 py-3 font-semibold text-gray-700">ITEMS</th>
                <th className="px-4 py-3 font-semibold text-gray-700">TOTAL (₹)</th>
                <th className="px-4 py-3 font-semibold text-gray-700">PAYMENT</th>
                <th className="px-4 py-3 font-semibold text-gray-700">STATUS</th>
                <th className="px-4 py-3 font-semibold text-gray-700">FULFILLMENT</th>
                <th className="px-4 py-3 font-semibold text-gray-700">CHANNEL</th>
                <th className="px-4 py-3 font-semibold text-gray-700">SLA</th>
                <th className="px-4 py-3 font-semibold text-gray-700">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginated.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(o.id)}
                        onChange={() => toggleSelect(o.id)}
                        className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" className="text-[#b30000] font-bold hover:underline focus:outline-none">
                        {o.orderId}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <DateTimeCell dateTime={o.dateTime} />
                    </td>
                    <td className="px-4 py-3 text-gray-800">{o.customer}</td>
                    <td className="px-4 py-3 text-gray-700">{o.items}</td>
                    <td className="px-4 py-3 text-gray-800">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <Badge variant={o.payment.toLowerCase()}>{o.payment}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={o.status.toLowerCase()}>{o.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={o.fulfillment.toLowerCase()}>{o.fulfillment}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{o.channel}</td>
                    <td className="px-4 py-3">
                      <Badge variant="sla">{o.sla}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-[#b30000] transition-colors"
                        title="View / Edit"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
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
                  className={`min-w-[32px] px-3 py-1.5 rounded-lg text-sm font-medium ${
                    n === currentPage ? "bg-[#b30000] text-white border-2 border-[#b30000]" : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
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
        </>
        )}
      </div>

      {/* Manual Order modal - big rectangle with all order fields */}
      {manualOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setManualOrderOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">Create Manual Order</h2>
              <button type="button" onClick={() => setManualOrderOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const items = parseInt(manualOrderForm.items, 10) || 0;
                const total = parseInt(manualOrderForm.total, 10) || 0;
                const dateTime = `${manualOrderForm.date} ${manualOrderForm.time}`;
                const newOrder = {
                  id: orders.length + 1,
                  orderId: manualOrderForm.orderId || `ORD-MAN-${Date.now()}`,
                  dateTime,
                  customer: manualOrderForm.customer,
                  items,
                  total,
                  payment: manualOrderForm.payment,
                  status: manualOrderForm.status,
                  fulfillment: manualOrderForm.fulfillment,
                  channel: manualOrderForm.channel,
                  sla: manualOrderForm.sla,
                };
                setOrders((prev) => [newOrder, ...prev]);
                setManualOrderOpen(false);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <input type="text" value={manualOrderForm.orderId} onChange={(e) => setManualOrderForm((f) => ({ ...f, orderId: e.target.value }))} placeholder="e.g. DPP-ORD-9004-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input type="text" value={manualOrderForm.customer} onChange={(e) => setManualOrderForm((f) => ({ ...f, customer: e.target.value }))} placeholder="Customer name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={manualOrderForm.date} onChange={(e) => setManualOrderForm((f) => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={manualOrderForm.time} onChange={(e) => setManualOrderForm((f) => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items (quantity)</label>
                  <input type="number" min="1" value={manualOrderForm.items} onChange={(e) => setManualOrderForm((f) => ({ ...f, items: e.target.value }))} placeholder="Number of items" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total (₹)</label>
                  <input type="number" min="0" value={manualOrderForm.total} onChange={(e) => setManualOrderForm((f) => ({ ...f, total: e.target.value }))} placeholder="Order total" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                  <select value={manualOrderForm.payment} onChange={(e) => setManualOrderForm((f) => ({ ...f, payment: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none">
                    {PAYMENT_FORM_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={manualOrderForm.status} onChange={(e) => setManualOrderForm((f) => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none">
                    {STATUS_FORM_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fulfillment</label>
                  <select value={manualOrderForm.fulfillment} onChange={(e) => setManualOrderForm((f) => ({ ...f, fulfillment: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none">
                    {FULFILLMENT_FORM_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                  <select value={manualOrderForm.channel} onChange={(e) => setManualOrderForm((f) => ({ ...f, channel: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none">
                    {CHANNEL_FORM_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SLA</label>
                  <input type="text" value={manualOrderForm.sla} onChange={(e) => setManualOrderForm((f) => ({ ...f, sla: e.target.value }))} placeholder="e.g. 2h left, On Time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setManualOrderOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8b0000] border-2 border-[#b30000]">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
