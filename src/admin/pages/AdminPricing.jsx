import React, { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

const RULE_TYPES = ["Percentage", "Flat", "Bulk"];
const CATEGORY_OPTIONS = ["Pipes", "Junction Boxes", "Hose", "Pipe Bends", "Fittings"];
const WAREHOUSE_OPTIONS = ["All Warehouses", "Mumbai Main", "Chennai", "Delhi", "Bangalore"];
const STATUS_OPTIONS = ["Active", "Inactive"];

function buildMockRules() {
  return [
    { id: 1, ruleName: "Dinesh PVC Pipes - Diwali Sale", scope: "All", type: "Percentage", value: 25, valueSuffix: "%", conditions: "Minimum Amount: ₹2000", validFrom: "2024-10-20", validTo: "2024-11-05", usage: 342, usageLimit: 1000, status: "Active" },
    { id: 2, ruleName: "Buy 3 Get 10% Off", scope: "Pipes, Fittings", type: "Bulk", value: 10, valueSuffix: "%", conditions: "Minimum Quantity: 3", validFrom: "2024-09-01", validTo: "2024-12-31", usage: 156, usageLimit: null, status: "Active" },
    { id: 3, ruleName: "Flat Pipe Deal", scope: "Pipes", type: "Flat", value: 500, valueSuffix: "₹", conditions: "None", validFrom: "2024-08-15", validTo: "2024-10-15", usage: 89, usageLimit: 500, status: "Inactive" },
    { id: 4, ruleName: "Junction Box Bundle", scope: "Junction Boxes", type: "Percentage", value: 15, valueSuffix: "%", conditions: "Minimum Quantity: 2", validFrom: "2024-11-01", validTo: "2024-11-30", usage: 234, usageLimit: null, status: "Active" },
    { id: 5, ruleName: "Monsoon Sale", scope: "All", type: "Percentage", value: 10, valueSuffix: "%", conditions: "Minimum Amount: ₹1500", validFrom: "2024-06-01", validTo: "2024-08-31", usage: 512, usageLimit: 800, status: "Inactive" },
    { id: 6, ruleName: "Fittings Flash Sale", scope: "Fittings", type: "Flat", value: 100, valueSuffix: "₹", conditions: "None", validFrom: "2024-10-01", validTo: "2024-10-10", usage: 78, usageLimit: 200, status: "Active" },
    { id: 7, ruleName: "Bulk Hose Discount", scope: "Hose", type: "Bulk", value: 12, valueSuffix: "%", conditions: "Minimum Quantity: 5", validFrom: "2024-07-01", validTo: "2024-09-30", usage: 45, usageLimit: 100, status: "Active" },
    { id: 8, ruleName: "Pipe Bends Offer", scope: "Pipe Bends", type: "Percentage", value: 8, valueSuffix: "%", conditions: "Minimum Amount: ₹800", validFrom: "2024-09-15", validTo: "2024-11-15", usage: 189, usageLimit: null, status: "Active" },
  ];
}

const PAGE_SIZE = 10;

export default function AdminPricing() {
  const [rules, setRules] = useState(() => buildMockRules());
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [page, setPage] = useState(1);
  const [addForm, setAddForm] = useState({
    ruleName: "",
    type: "Percentage",
    value: "",
    valueSuffix: "%",
    conditions: "",
    conditionMinAmount: "",
    conditionMinQty: "",
    appliesTo: "All",
    categories: "",
    productSkus: "",
    warehouse: "All Warehouses",
    validFrom: "",
    validTo: "",
    usageLimit: "",
    status: "Active",
  });

  const updateForm = (field, value) => setAddForm((prev) => ({ ...prev, [field]: value }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rules;
    return rules.filter(
      (r) =>
        r.ruleName.toLowerCase().includes(q) ||
        r.scope.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
    );
  }, [rules, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const kpis = useMemo(() => {
    const active = rules.filter((r) => r.status === "Active").length;
    const totalUsage = rules.reduce((sum, r) => sum + (r.usage || 0), 0);
    const avgDiscount =
      rules.length > 0
        ? Math.round(
            rules.reduce((sum, r) => sum + (r.type === "Percentage" ? r.value : 10), 0) / rules.length
          )
        : 0;
    return { total: rules.length, active, totalUsage, avgDiscount };
  }, [rules]);

  const closePricingModal = () => {
    setAddOpen(false);
    setEditingRuleId(null);
    setAddForm({
      ruleName: "", type: "Percentage", value: "", valueSuffix: "%", conditions: "",
      conditionMinAmount: "", conditionMinQty: "", appliesTo: "All", categories: "", productSkus: "",
      warehouse: "All Warehouses", validFrom: "", validTo: "", usageLimit: "", status: "Active",
    });
  };

  const openEditRule = (r) => {
    const scope = r.scope || "All";
    const appliesTo = scope === "All" ? "All" : /^\d|SKU|BX|pipe/i.test(scope) ? "Products" : "Categories";
    setAddForm({
      ruleName: r.ruleName,
      type: r.type || "Percentage",
      value: r.value != null ? String(r.value) : "",
      valueSuffix: r.valueSuffix || "%",
      conditions: r.conditions || "",
      conditionMinAmount: "",
      conditionMinQty: "",
      appliesTo,
      categories: appliesTo === "Categories" ? scope : "",
      productSkus: appliesTo === "Products" ? scope : "",
      warehouse: "All Warehouses",
      validFrom: r.validFrom && r.validFrom !== "—" ? r.validFrom : "",
      validTo: r.validTo && r.validTo !== "—" ? r.validTo : "",
      usageLimit: r.usageLimit != null ? String(r.usageLimit) : "",
      status: r.status || "Active",
    });
    setEditingRuleId(r.id);
    setAddOpen(true);
  };

  const handleAddRule = () => {
    const valueNum = parseFloat(addForm.value) || 0;
    const suffix = addForm.type === "Flat" ? "₹" : "%";
    const conditions =
      addForm.conditionMinAmount || addForm.conditionMinQty
        ? [
            addForm.conditionMinAmount ? `Minimum Amount: ₹${addForm.conditionMinAmount}` : null,
            addForm.conditionMinQty ? `Minimum Quantity: ${addForm.conditionMinQty}` : null,
          ]
            .filter(Boolean)
            .join(", ") || "None"
        : addForm.conditions.trim() || "None";
    const scope =
      addForm.appliesTo === "All"
        ? "All"
        : addForm.appliesTo === "Categories"
          ? addForm.categories.trim() || "All"
          : addForm.productSkus.trim() || "All";
    const payload = {
      ruleName: addForm.ruleName.trim() || "New Rule",
      scope,
      type: addForm.type,
      value: valueNum,
      valueSuffix: suffix,
      conditions,
      validFrom: addForm.validFrom || "—",
      validTo: addForm.validTo || "—",
      usageLimit: addForm.usageLimit ? parseInt(addForm.usageLimit, 10) : null,
      status: addForm.status,
    };
    if (editingRuleId) {
      setRules((prev) =>
        prev.map((r) => (r.id === editingRuleId ? { ...r, ...payload, usage: r.usage } : r))
      );
    } else {
      const nextId = rules.length ? Math.max(...rules.map((r) => r.id)) + 1 : 1;
      setRules((prev) => [{ id: nextId, ...payload, usage: 0 }, ...prev]);
    }
    closePricingModal();
  };

  const deleteRule = (id) => setRules((prev) => prev.filter((r) => r.id !== id));

  const typeBadgeClass = (type) => {
    if (type === "Percentage") return "text-blue-700 bg-blue-50";
    if (type === "Bulk") return "text-amber-700 bg-amber-50";
    return "text-green-800 bg-green-100";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pricing & Discounts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage dynamic pricing, discount rules, and price history.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingRuleId(null); setAddForm({ ruleName: "", type: "Percentage", value: "", valueSuffix: "%", conditions: "", conditionMinAmount: "", conditionMinQty: "", appliesTo: "All", categories: "", productSkus: "", warehouse: "All Warehouses", validFrom: "", validTo: "", usageLimit: "", status: "Active" }); setAddOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] border-2 border-[#b30000] transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Discount Rule
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Rules</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Rules</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.active}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Usage</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.totalUsage}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avg Discount</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.avgDiscount}%</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Discount Rules..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">RULE NAME</th>
                <th className="px-4 py-3 font-semibold text-gray-700">TYPE</th>
                <th className="px-4 py-3 font-semibold text-gray-700">VALUE</th>
                <th className="px-4 py-3 font-semibold text-gray-700">CONDITIONS</th>
                <th className="px-4 py-3 font-semibold text-gray-700">VALID PERIOD</th>
                <th className="px-4 py-3 font-semibold text-gray-700">USAGE</th>
                <th className="px-4 py-3 font-semibold text-gray-700">STATUS</th>
                <th className="px-4 py-3 font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No discount rules found.
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{r.ruleName}</p>
                      <p className="text-xs text-gray-500">{r.scope}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeBadgeClass(r.type)}`}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#b30000]">
                      {r.value}
                      {r.valueSuffix}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{r.conditions}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      <span className="block">{r.validFrom}</span>
                      <span className="block text-gray-500">{r.validTo}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {r.usage}
                      {r.usageLimit != null ? `/${r.usageLimit}` : "/"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          r.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-[#b30000]"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditRule(r)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-[#b30000] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRule(r.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
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
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
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
                    n === currentPage
                      ? "bg-[#b30000] text-white border-2 border-[#b30000]"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100"
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
      </div>

      {addOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closePricingModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{editingRuleId ? "Edit Discount Rule" : "Add Discount Rule"}</h2>
              <button
                type="button"
                onClick={closePricingModal}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule name</label>
                  <input
                    type="text"
                    value={addForm.ruleName}
                    onChange={(e) => updateForm("ruleName", e.target.value)}
                    placeholder="e.g. Dinesh PVC Pipes - Bulk Discount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={addForm.type}
                    onChange={(e) => {
                      updateForm("type", e.target.value);
                      updateForm("valueSuffix", e.target.value === "Flat" ? "₹" : "%");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  >
                    {RULE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addForm.value}
                    onChange={(e) => updateForm("value", e.target.value)}
                    placeholder={addForm.type === "Flat" ? "Amount in ₹" : "Percentage"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    value={addForm.conditionMinAmount}
                    onChange={(e) => updateForm("conditionMinAmount", e.target.value)}
                    placeholder="Min amount (₹)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    value={addForm.conditionMinQty}
                    onChange={(e) => updateForm("conditionMinQty", e.target.value)}
                    placeholder="Min quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={addForm.conditions}
                  onChange={(e) => updateForm("conditions", e.target.value)}
                  placeholder="Or other conditions (e.g. None)"
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applies to</label>
                <select
                  value={addForm.appliesTo}
                  onChange={(e) => updateForm("appliesTo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                >
                  <option value="All">All products</option>
                  <option value="Categories">Specific categories</option>
                  <option value="Products">Specific products (SKU)</option>
                </select>
                {addForm.appliesTo === "Categories" && (
                  <input
                    type="text"
                    value={addForm.categories}
                    onChange={(e) => updateForm("categories", e.target.value)}
                    placeholder="e.g. Pipes, Fittings (comma-separated)"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                )}
                {addForm.appliesTo === "Products" && (
                  <input
                    type="text"
                    value={addForm.productSkus}
                    onChange={(e) => updateForm("productSkus", e.target.value)}
                    placeholder="SKU or product names (comma-separated)"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse (optional)</label>
                <select
                  value={addForm.warehouse}
                  onChange={(e) => updateForm("warehouse", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                >
                  {WAREHOUSE_OPTIONS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid from</label>
                  <input
                    type="date"
                    value={addForm.validFrom}
                    onChange={(e) => updateForm("validFrom", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid to</label>
                  <input
                    type="date"
                    value={addForm.validTo}
                    onChange={(e) => updateForm("validTo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage limit (optional)</label>
                <input
                  type="number"
                  min="0"
                  value={addForm.usageLimit}
                  onChange={(e) => updateForm("usageLimit", e.target.value)}
                  placeholder="Max number of uses"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={closePricingModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRule}
                className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000] transition-colors"
              >
                {editingRuleId ? "Update Discount Rule" : "Add Discount Rule"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
