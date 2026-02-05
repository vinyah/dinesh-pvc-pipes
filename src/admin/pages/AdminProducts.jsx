import React from "react";
import { Link } from "react-router-dom";
import db from "../../../db.json";

function flattenProducts(db) {
  const out = [];
  const pages = db?.pages;
  if (pages?.items) {
    pages.items.forEach((item) => out.push({ type: "Item", name: item.name, link: item.link }));
  }
  const products = db?.products;
  if (products?.productdetails) {
    products.productdetails.forEach((p) => out.push({ type: "Product", name: p.name, code: p.code }));
  }
  ["boxA", "boxB", "boxC", "boxD"].forEach((key) => {
    (products?.[key] ?? []).forEach((p) => out.push({ type: "Box", name: p.name, code: p.code }));
  });
  return out;
}

export default function AdminProducts() {
  const products = flattenProducts(db);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Products</h1>
      <p className="text-gray-500 text-sm">View and manage products.</p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Code / Link</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No products.
                </td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">
                    {p.link ? (
                      <Link to={p.link} className="text-[#2563eb] hover:underline">
                        {p.link}
                      </Link>
                    ) : (
                      p.code ?? "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
