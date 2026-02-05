import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import db from "../../../db.json";

function searchAll(q) {
  const lower = (q || "").toLowerCase().trim();
  if (!lower) return { orders: [], products: [], customers: [] };

  const orders = (db?.orders ?? []).filter(
    (o) => (o.item && o.item.toLowerCase().includes(lower)) || String(o.id) === lower
  );
  const items = (db?.pages?.items ?? []).filter((i) => i.name && i.name.toLowerCase().includes(lower));
  const profiles = (db?.profiles ?? []).filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(lower)) ||
      (p.email && p.email.toLowerCase().includes(lower)) ||
      (p.phone && p.phone.includes(lower))
  );
  const productDetails = (db?.products?.productdetails ?? []).filter(
    (p) => (p.name && p.name.toLowerCase().includes(lower)) || (p.code && p.code.toLowerCase().includes(lower))
  );
  const products = [...items.map((i) => ({ type: "Item", name: i.name, link: i.link })), ...productDetails.map((p) => ({ type: "Product", name: p.name, code: p.code }))];

  return { orders, products, customers: profiles };
}

export default function AdminSearch() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { orders, products, customers } = useMemo(() => searchAll(q), [q]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Search results</h1>
      <p className="text-gray-500 text-sm">
        {q ? `"${q}" in orders, products, and customers.` : "Enter a search query."}
      </p>

      {!q ? (
        <p className="text-gray-500">Use the search bar above or press / to focus and search.</p>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Orders ({orders.length})</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {orders.length === 0 ? (
                <p className="px-4 py-6 text-gray-500">No matching orders.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-700">ID</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Item</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2">{o.id}</td>
                        <td className="px-4 py-2">{o.item}</td>
                        <td className="px-4 py-2">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Products ({products.length})</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {products.length === 0 ? (
                <p className="px-4 py-6 text-gray-500">No matching products.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {products.map((p, i) => (
                    <li key={i} className="px-4 py-2 hover:bg-gray-50">
                      {p.link ? (
                        <Link to={p.link} className="text-[#2563eb] hover:underline">
                          {p.name}
                        </Link>
                      ) : (
                        <span>{p.name} {p.code && `(${p.code})`}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Customers ({customers.length})</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {customers.length === 0 ? (
                <p className="px-4 py-6 text-gray-500">No matching customers.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2">{c.name}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
