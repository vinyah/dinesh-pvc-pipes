import React, { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, X, Tag, CheckCircle, TrendingUp, Percent } from "lucide-react";

const initialCoupons = [
  { id: 1, code: "DINESH40", description: "Dinesh PVC Pipes - Diwali 40% Off", discount: "40%", minAmount: 2000, maxAmount: 2000, usage: 342, usageLimit: 1000, validUntil: "2024-11-05", status: "Active" },
  { id: 2, code: "WELCOME500", description: "New Customer Discount", discount: "₹500", minAmount: 3000, maxAmount: null, usage: 156, usageLimit: 500, validUntil: "2024-12-31", status: "Active" },
  { id: 3, code: "PIPES20", description: "Dinesh PVC Pipes - Bulk 20% Off", discount: "20%", minAmount: 5000, maxAmount: null, usage: 89, usageLimit: 200, validUntil: "2025-01-15", status: "Active" },
];

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount: "",
    minAmount: "",
    maxAmount: "",
    validUntil: "",
  });

  const filteredCoupons = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q
      ? coupons.filter(
          (c) =>
            c.code.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      : coupons;
  }, [coupons, search]);

  const kpis = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.status === "Active").length;
    const totalUsage = coupons.reduce((s, c) => s + c.usage, 0);
    const avgDiscount =
      total > 0
        ? coupons
            .filter((c) => c.discount.endsWith("%"))
            .reduce((s, c) => s + parseInt(c.discount, 10), 0) / Math.max(1, coupons.filter((c) => c.discount.endsWith("%")).length)
        : 0;
    return { total, active, totalUsage, avgDiscount: Math.round(avgDiscount) };
  }, [coupons]);

  const updateForm = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const openAdd = () => {
    setEditingId(null);
    setForm({
      code: "",
      description: "",
      discount: "",
      minAmount: "",
      maxAmount: "",
      validUntil: "",
    });
    setAddOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      description: c.description,
      discount: c.discount,
      minAmount: c.minAmount ? String(c.minAmount) : "",
      maxAmount: c.maxAmount ? String(c.maxAmount) : "",
      validUntil: c.validUntil || "",
    });
    setAddOpen(true);
  };

  const closeModal = () => {
    setAddOpen(false);
    setEditingId(null);
  };

  const saveCoupon = () => {
    const code = form.code.trim();
    const description = form.description.trim();
    const discount = form.discount.trim();
    const minAmount = form.minAmount ? parseInt(form.minAmount, 10) : null;
    const maxAmount = form.maxAmount ? parseInt(form.maxAmount, 10) : null;
    const validUntil = form.validUntil.trim() || null;
    if (!code || !discount) return;

    if (editingId) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                code,
                description,
                discount,
                minAmount,
                maxAmount,
                validUntil: validUntil || c.validUntil,
              }
            : c
        )
      );
    } else {
      setCoupons((prev) => [
        ...prev,
        {
          id: Math.max(0, ...prev.map((x) => x.id)) + 1,
          code,
          description,
          discount,
          minAmount,
          maxAmount,
          usage: 0,
          usageLimit: 0,
          validUntil,
          status: "Active",
        },
      ]);
    }
    closeModal();
  };

  const deleteCoupon = (id) => {
    if (window.confirm("Delete this coupon?")) setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const formatConditions = (c) => {
    const parts = [];
    if (c.minAmount) parts.push(`Min: ₹${c.minAmount.toLocaleString("en-IN")}`);
    if (c.maxAmount) parts.push(`Max: ₹${c.maxAmount.toLocaleString("en-IN")}`);
    return parts.length ? parts.join(" | ") : "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Comprehensive business intelligence and Coupons Card.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000]"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Tag className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Coupons</p>
              <p className="text-xl font-bold text-gray-800">{kpis.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-xl font-bold text-green-600">{kpis.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Usage</p>
              <p className="text-xl font-bold text-gray-800">{kpis.totalUsage}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Percent className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Discount</p>
              <p className="text-xl font-bold text-amber-600">{kpis.avgDiscount}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Coupons..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">CODE</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">DESCRIPTION</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">DISCOUNT</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">CONDITIONS</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">USAGE</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">VALID UNTIL</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">STATUS</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#b30000] cursor-pointer hover:underline">{c.code}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{c.description}</td>
                  <td className="py-3 px-4 font-medium text-[#b30000]">{c.discount}</td>
                  <td className="py-3 px-4 text-gray-600">{formatConditions(c)}</td>
                  <td className="py-3 px-4 text-gray-700">{c.usage} / {c.usageLimit || "—"}</td>
                  <td className="py-3 px-4 text-gray-600">{c.validUntil || "—"}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">{c.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEdit(c)} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-[#b30000]">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded text-gray-600 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Coupon" : "Add Coupon"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => updateForm("code", e.target.value)}
                  placeholder="Coupon Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <input
                  type="text"
                  value={form.discount}
                  onChange={(e) => updateForm("discount", e.target.value)}
                  placeholder="Discount (e.g. 40% or ₹500)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                  <input
                    type="number"
                    value={form.minAmount}
                    onChange={(e) => updateForm("minAmount", e.target.value)}
                    placeholder="Min Amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                  <input
                    type="number"
                    value={form.maxAmount}
                    onChange={(e) => updateForm("maxAmount", e.target.value)}
                    placeholder="Max Amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.validUntil}
                    onChange={(e) => updateForm("validUntil", e.target.value)}
                    placeholder="dd-mm-yyyy"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100">
                Cancel
              </button>
              <button type="button" onClick={saveCoupon} className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
