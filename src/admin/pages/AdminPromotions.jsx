import React, { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, X, Target } from "lucide-react";

const CATEGORY_OPTIONS = ["Festival", "Seasonal", "Bulk", "New Launch", "Clearance", "Trade", "Combo", "Flash Sale", "Segment"];
const AUDIENCE_OPTIONS = ["All Customers", "Dealers", "Contractors", "New Customers"];

function buildMockPromotions() {
  return [
    {
      id: 1,
      title: "Dinesh PVC Pipes - Diwali Sale 2024",
      description: "Grand Diwali sale with up to 40% off on Dinesh PVC pipes and fittings",
      startDate: "2024-10-20",
      endDate: "2024-11-05",
      audience: "All Customers",
      reach: "50K",
      category: "Festival",
      status: "active",
      image: null,
      budget: 50000,
      spent: 32450,
      views: 34.6,
      conversions: 1234,
      cvr: 3.57,
      roi: 11308.3,
    },
    {
      id: 2,
      title: "Dinesh PVC Pipes - Contractor Bulk Offer",
      description: "Exclusive bulk pricing on Dinesh PVC pipes for dealers and contractors",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      audience: "All Customers",
      reach: "30K",
      category: "Bulk",
      status: "active",
      image: null,
      budget: 75000,
      spent: 45000,
      views: 18.2,
      conversions: 567,
      cvr: 3.11,
      roi: 3680.0,
    },
    {
      id: 3,
      title: "Dinesh PVC Pipes - Flash Sale Friday",
      description: "24-hour mega discount on Dinesh PVC pipes every Friday",
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      audience: "All Customers",
      reach: "20K",
      category: "Flash Sale",
      status: "active",
      image: null,
      budget: 25000,
      spent: 18500,
      views: 15.7,
      conversions: 890,
      cvr: 5.68,
      roi: 14332.4,
    },
    {
      id: 4,
      title: "Dinesh PVC Pipes - New Range Launch",
      description: "New Dinesh PVC pipes and fittings range for plumbing and electrical",
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      audience: "All Customers",
      reach: "40K",
      category: "New Launch",
      status: "inactive",
      image: null,
      budget: 60000,
      spent: 58500,
      views: 42.1,
      conversions: 1567,
      cvr: 3.72,
      roi: 7881.3,
    },
  ];
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState(() => buildMockPromotions());
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    audience: "All Customers",
    reach: "",
    category: "Festival",
    views: "",
    conversions: "",
    budgetUsed: "",
    budgetTotal: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return promotions;
    return promotions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [promotions, search]);

  const kpis = useMemo(() => {
    const active = promotions.filter((p) => p.status === "active").length;
    const totalViews = promotions.reduce((s, p) => s + (p.views || 0), 0);
    const totalConv = promotions.reduce((s, p) => s + (p.conversions || 0), 0);
    const budget = promotions.reduce((s, p) => s + (p.budget || 0), 0);
    const spent = promotions.reduce((s, p) => s + (p.spent || 0), 0);
    return {
      total: promotions.length,
      active,
      totalViews: totalViews.toFixed(1),
      conversions: totalConv,
      budget,
      spent,
    };
  }, [promotions]);

  const handleCreate = () => {
    const reachVal = form.reach.trim() || "0K";
    const viewsNum = parseFloat(form.views) || 0;
    const conversionsNum = parseInt(form.conversions, 10) || 0;
    const budgetUsedNum = parseInt(form.budgetUsed, 10) || 0;
    const budgetTotalNum = parseInt(form.budgetTotal, 10) || 0;
    const cvr = viewsNum > 0 ? (conversionsNum / viewsNum) * 100 : 0;
    const roi = budgetUsedNum > 0 ? (conversionsNum / budgetUsedNum) * 100 : 0;
    const newPromo = {
      id: promotions.length ? Math.max(...promotions.map((p) => p.id)) + 1 : 1,
      title: form.title.trim() || "New Promotion",
      description: form.description.trim() || "",
      startDate: form.startDate || "—",
      endDate: form.endDate || "—",
      audience: form.audience,
      reach: reachVal,
      category: form.category,
      status: "active",
      image: imagePreview,
      budget: budgetTotalNum,
      spent: budgetUsedNum,
      views: viewsNum,
      conversions: conversionsNum,
      cvr: Number(cvr.toFixed(2)),
      roi: Number(roi.toFixed(1)),
    };
    setPromotions((prev) => [newPromo, ...prev]);
    closeModal();
  };

  const closeModal = () => {
    setCreateOpen(false);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      audience: "All Customers",
      reach: "",
      category: "Festival",
      views: "",
      conversions: "",
      budgetUsed: "",
      budgetTotal: "",
      imageFile: null,
    });
    setImagePreview(null);
  };

  const deletePromo = (id) => setPromotions((prev) => prev.filter((p) => p.id !== id));

  const openEdit = (p) => {
    setForm({
      title: p.title,
      description: p.description || "",
      startDate: p.startDate && p.startDate !== "—" ? p.startDate : "",
      endDate: p.endDate && p.endDate !== "—" ? p.endDate : "",
      audience: p.audience || "All Customers",
      reach: p.reach || "",
      category: p.category || "Festival",
      views: p.views != null ? String(p.views) : "",
      conversions: p.conversions != null ? String(p.conversions) : "",
      budgetUsed: p.spent != null ? String(p.spent) : "",
      budgetTotal: p.budget != null ? String(p.budget) : "",
      imageFile: null,
    });
    setImagePreview(p.image || null);
    setEditingId(p.id);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    const reachVal = form.reach.trim() || "0K";
    const viewsNum = parseFloat(form.views) || 0;
    const conversionsNum = parseInt(form.conversions, 10) || 0;
    const budgetUsedNum = parseInt(form.budgetUsed, 10) || 0;
    const budgetTotalNum = parseInt(form.budgetTotal, 10) || 0;
    const cvr = viewsNum > 0 ? (conversionsNum / viewsNum) * 100 : 0;
    const roi = budgetUsedNum > 0 ? (conversionsNum / budgetUsedNum) * 100 : 0;
    setPromotions((prev) =>
      prev.map((promo) =>
        promo.id === editingId
          ? {
              ...promo,
              title: form.title.trim() || promo.title,
              description: form.description.trim() || "",
              startDate: form.startDate || "—",
              endDate: form.endDate || "—",
              audience: form.audience,
              reach: reachVal,
              category: form.category,
              image: imagePreview ?? promo.image,
              budget: budgetTotalNum,
              spent: budgetUsedNum,
              views: viewsNum,
              conversions: conversionsNum,
              cvr: Number(cvr.toFixed(2)),
              roi: Number(roi.toFixed(1)),
            }
          : promo
      )
    );
    closeModal();
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      updateForm("imageFile", file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage campaigns, seasonal offers, and promotions for Dinesh PVC pipes.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreateOpen(true);
            setForm({
              title: "",
              description: "",
              startDate: "",
              endDate: "",
              audience: "All Customers",
              reach: "",
              category: "Festival",
              views: "",
              conversions: "",
              budgetUsed: "",
              budgetTotal: "",
              imageFile: null,
            });
            setImagePreview(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8c0000] border-2 border-[#b30000] transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Promotion
        </button>
      </div>

      <div className="bg-gray-100 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Promotions..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Campaigns</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.active}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.totalViews}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Conversions</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.conversions.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">₹{kpis.budget.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Spent</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">₹{kpis.spent.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
            No promotions found.
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-4 flex gap-3">
                <div className="relative w-20 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs">Image</span>
                  )}
                  <span
                    className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                      p.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-[#b30000]"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 float-right">
                    {p.category}
                  </span>
                  <h3 className="font-semibold text-gray-800 mt-0.5">{p.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {p.startDate} – {p.endDate}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>{p.audience}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Target className="w-3.5 h-3.5" />
                      Reach: {p.reach}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-2 grid grid-cols-4 gap-2 text-center text-sm border-t border-gray-100 pt-3">
                <div>
                  <p className="text-gray-500 text-xs">Views</p>
                  <p className="font-medium text-gray-800">{p.views}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Conv.</p>
                  <p className="font-medium text-[#b30000]">{p.conversions.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">CVR</p>
                  <p className="font-medium text-gray-800">{p.cvr}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">ROI</p>
                  <p className="font-medium text-[#b30000]">{p.roi}%</p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>
                    ₹{p.spent.toLocaleString("en-IN")} / ₹{p.budget.toLocaleString("en-IN")}
                  </span>
                  <span className="font-medium text-[#b30000]">
                    {p.budget ? Math.round((p.spent / p.budget) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b30000] rounded-full transition-all"
                    style={{ width: p.budget ? `${Math.min(100, (p.spent / p.budget) * 100)}%` : "0%" }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-[#b30000] hover:text-[#b30000] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePromo(p.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {(createOpen || editingId) && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-gray-800">{editingId ? "Edit Promotion" : "Create Promotion"}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion image / banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#b30000] file:text-white file:font-medium hover:file:bg-[#8c0000]"
                />
                {imagePreview && (
                  <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="e.g. Dinesh PVC Pipes - Monsoon Sale 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Brief description of the promotion"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateForm("startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target audience</label>
                  <select
                    value={form.audience}
                    onChange={(e) => updateForm("audience", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  >
                    {AUDIENCE_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reach</label>
                  <input
                    type="text"
                    value={form.reach}
                    onChange={(e) => updateForm("reach", e.target.value)}
                    placeholder="e.g. 50K, 30K"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category / type</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.views}
                    onChange={(e) => updateForm("views", e.target.value)}
                    placeholder="e.g. 34.6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conversions</label>
                  <input
                    type="number"
                    min="0"
                    value={form.conversions}
                    onChange={(e) => updateForm("conversions", e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget used (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.budgetUsed}
                    onChange={(e) => updateForm("budgetUsed", e.target.value)}
                    placeholder="Amount spent"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget total (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.budgetTotal}
                    onChange={(e) => updateForm("budgetTotal", e.target.value)}
                    placeholder="Total budget"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editingId ? handleUpdate : handleCreate}
                className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000] transition-colors"
              >
                {editingId ? "Update Promotion" : "Create Promotion"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
