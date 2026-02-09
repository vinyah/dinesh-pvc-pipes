import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Plus, Pencil, Trash2, Star, X } from "lucide-react";
import db from "../../../db.json";
import { getImageUrl } from "../../utils/imageLoader";

const CATEGORY_LABELS = {
  productdetails: "Pipes",
  boxA: "Junction Boxes",
  boxB: "Junction Boxes",
  boxC: "Junction Boxes",
  boxD: "Junction Boxes",
  braidedHose: "Hose",
  flexiblepipe: "Pipes",
  pipebend: "Pipe Bends",
  pipefittingA: "Fittings",
  pipefittingB: "Fittings",
  pipefittingC: "Fittings",
  pipefittingD: "Fittings",
};

function getPrice(p) {
  if (p.price != null && p.price !== "") return Number(p.price);
  if (p.rates && typeof p.rates === "object") {
    const first = Object.values(p.rates)[0];
    if (typeof first === "number") return first;
    if (typeof first === "object" && first != null) {
      const val = Object.values(first)[0];
      if (typeof val === "number") return val;
    }
  }
  if (Array.isArray(p.thicknessOptions) && p.thicknessOptions.length > 0) {
    const firstOption = p.thicknessOptions[0];
    const rates = firstOption?.rates;
    if (rates && typeof rates === "object") {
      const values = Object.values(rates).filter((v) => typeof v === "number");
      if (values.length > 0) return Math.min(...values);
    }
  }
  return 0;
}

function buildProductList() {
  const list = [];
  const products = db?.products ?? {};
  let id = 1;
  Object.entries(products).forEach(([key, arr]) => {
    if (!Array.isArray(arr)) return;
    const category = CATEGORY_LABELS[key] ?? key;
    arr.forEach((p) => {
      const price = getPrice(p);
      const mrp = Math.round(price * 1.25);
      const stock = 5 + Math.floor(Math.random() * 86);
      list.push({
        id: id++,
        sku: p.code ?? `SKU-${id}`,
        name: p.name ?? "Product",
        category,
        price,
        mrp,
        stock,
        image: Array.isArray(p.images) ? p.images[0] : null,
        rating: (4.2 + Math.random() * 0.8).toFixed(1),
        status: "Active",
      });
    });
  });
  return list;
}

const STATUS_OPTIONS = ["All Status", "Active", "Draft", "Archived"];
const STOCK_OPTIONS = ["All Stock", "In Stock", "Low Stock", "Out of Stock"];
const LOW_STOCK_THRESHOLD = 15;

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

const CATEGORY_FORM_OPTIONS = ["Pipes", "Junction Boxes", "Hose", "Pipe Bends", "Fittings"];
const STATUS_FORM_OPTIONS = ["Active", "Draft", "Archived"];

export default function AdminProducts() {
  const [productList, setProductList] = useState(() => buildProductList());
  const categories = useMemo(() => {
    const set = new Set(productList.map((p) => p.category));
    return ["All Categories", ...Array.from(set).sort()];
  }, [productList]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [addProductForm, setAddProductForm] = useState({
    sku: "",
    name: "",
    price: "",
    mrp: "",
    stock: "",
    category: "Pipes",
    rating: "4.5",
    status: "Active",
    imageNames: "",
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const updateAddProduct = (field, value) => setAddProductForm((prev) => ({ ...prev, [field]: value }));

  const closeProductModal = () => {
    setAddProductOpen(false);
    setEditingProductId(null);
    setAddProductForm({ sku: "", name: "", price: "", mrp: "", stock: "", category: "Pipes", rating: "4.5", status: "Active", imageNames: "" });
    setImagePreviewUrls([]);
  };

  const openEditProduct = (p) => {
    setAddProductForm({
      sku: p.sku,
      name: p.name,
      price: p.price != null ? String(p.price) : "",
      mrp: p.mrp != null ? String(p.mrp) : "",
      stock: p.stock != null ? String(p.stock) : "",
      category: p.category || "Pipes",
      rating: p.rating || "4.5",
      status: p.status || "Active",
      imageNames: "",
    });
    setImagePreviewUrls(p.image && typeof p.image === "string" && p.image.startsWith("data:") ? [p.image] : []);
    setEditingProductId(p.id);
    setAddProductOpen(true);
  };

  const handleAddProductSubmit = () => {
    const priceNum = parseFloat(addProductForm.price) || 0;
    const mrpNum = parseFloat(addProductForm.mrp) || Math.round(priceNum * 1.25);
    const stockNum = parseInt(addProductForm.stock, 10) || 0;
    let imageValue = null;
    if (imagePreviewUrls.length > 0 && imagePreviewUrls[0]) imageValue = imagePreviewUrls[0];
    if (!imageValue && addProductForm.imageNames.trim()) {
      const first = addProductForm.imageNames.split(",").map((s) => s.trim()).filter(Boolean)[0];
      if (first) imageValue = first;
    }
    const payload = {
      sku: addProductForm.sku.trim() || `SKU-${editingProductId || ""}`,
      name: addProductForm.name.trim() || "New Product",
      category: addProductForm.category,
      price: priceNum,
      mrp: mrpNum,
      stock: stockNum,
      image: imageValue,
      rating: addProductForm.rating.trim() || "4.5",
      status: addProductForm.status,
    };
    if (editingProductId) {
      setProductList((prev) =>
        prev.map((p) => (p.id === editingProductId ? { ...p, ...payload, image: payload.image ?? p.image } : p))
      );
    } else {
      const nextId = productList.length ? Math.max(...productList.map((p) => p.id)) + 1 : 1;
      setProductList((prev) => [{ id: nextId, ...payload }, ...prev]);
    }
    closeProductModal();
  };

  const deleteProduct = (id) => setProductList((prev) => prev.filter((p) => p.id !== id));

  const onImageFileChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;
    const urls = [];
    let done = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        urls.push(reader.result);
        done += 1;
        if (done === files.length) setImagePreviewUrls(urls);
      };
      reader.readAsDataURL(file);
    });
  };

  const filtered = useMemo(() => {
    return productList.filter((p) => {
      const q = search.toLowerCase();
      if (q && !p.sku.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q)) return false;
      if (statusFilter !== "All Status" && p.status !== statusFilter) return false;
      if (categoryFilter !== "All Categories" && p.category !== categoryFilter) return false;
      if (stockFilter === "Low Stock" && p.stock >= LOW_STOCK_THRESHOLD) return false;
      if (stockFilter === "In Stock" && p.stock <= 0) return false;
      if (stockFilter === "Out of Stock" && p.stock > 0) return false;
      return true;
    });
  }, [productList, search, statusFilter, categoryFilter, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSelect = (id) =>
    setSelectedIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleSelectAll = () =>
    setSelectedIds((s) => (s.size === filtered.length && filtered.length > 0 ? new Set() : new Set(filtered.map((p) => p.id))));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalog.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddProductOpen(true);
            setEditingProductId(null);
            setAddProductForm({ sku: "", name: "", price: "", mrp: "", stock: "", category: "Pipes", rating: "4.5", status: "Active", imageNames: "" });
            setImagePreviewUrls([]);
            setAddProductOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#b30000] text-white rounded-lg font-medium hover:bg-[#8b0000] border-2 border-[#b30000] transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Products
        </button>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, Product Name..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
          />
        </div>
        <FilterDropdown options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        <FilterDropdown options={categories} value={categoryFilter} onChange={setCategoryFilter} />
        <FilterDropdown options={STOCK_OPTIONS} value={stockFilter} onChange={setStockFilter} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
                <th className="px-4 py-3 font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 font-semibold text-gray-700">PRODUCT</th>
                <th className="px-4 py-3 font-semibold text-gray-700">PRICE</th>
                <th className="px-4 py-3 font-semibold text-gray-700">MRP</th>
                <th className="px-4 py-3 font-semibold text-gray-700">STOCK</th>
                <th className="px-4 py-3 font-semibold text-gray-700">CATEGORY</th>
                <th className="px-4 py-3 font-semibold text-gray-700">RATING</th>
                <th className="px-4 py-3 font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {p.image ? (
                            <img
                              src={typeof p.image === "string" && p.image.startsWith("data:") ? p.image : getImageUrl(p.image)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">img</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-500">Dinesh PVC Pipes</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{p.price > 0 ? `₹${p.price.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{p.mrp > 0 ? <span className="line-through">₹{p.mrp.toLocaleString("en-IN")}</span> : "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          p.stock <= LOW_STOCK_THRESHOLD ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-0.5 text-amber-600">
                        <Star className="w-4 h-4 fill-current" />
                        {p.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-[#b30000] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
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
      </div>

      {addProductOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeProductModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{editingProductId ? "Edit Product" : "Add Product"}</h2>
              <button
                type="button"
                onClick={closeProductModal}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={addProductForm.sku}
                    onChange={(e) => updateAddProduct("sku", e.target.value)}
                    placeholder="e.g. 9004, BX1001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
                  <input
                    type="text"
                    value={addProductForm.name}
                    onChange={(e) => updateAddProduct("name", e.target.value)}
                    placeholder="Product name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addProductForm.price}
                    onChange={(e) => updateAddProduct("price", e.target.value)}
                    placeholder="Selling price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addProductForm.mrp}
                    onChange={(e) => updateAddProduct("mrp", e.target.value)}
                    placeholder="Maximum retail price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={addProductForm.stock}
                    onChange={(e) => updateAddProduct("stock", e.target.value)}
                    placeholder="Quantity in stock"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={addProductForm.category}
                    onChange={(e) => updateAddProduct("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  >
                    {CATEGORY_FORM_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="text"
                    value={addProductForm.rating}
                    onChange={(e) => updateAddProduct("rating", e.target.value)}
                    placeholder="e.g. 4.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={addProductForm.status}
                    onChange={(e) => updateAddProduct("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                  >
                    {STATUS_FORM_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onImageFileChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#b30000] file:text-white file:font-medium hover:file:bg-[#8c0000]"
                />
                {imagePreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviewUrls.map((url, i) => (
                      <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Or enter asset names (comma-separated) from your project</p>
                <input
                  type="text"
                  value={addProductForm.imageNames}
                  onChange={(e) => updateAddProduct("imageNames", e.target.value)}
                  placeholder="e.g. pipe.jpg, box.png"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeProductModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProductSubmit}
                className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000] transition-colors"
              >
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
