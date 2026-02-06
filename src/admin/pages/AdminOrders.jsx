import React from "react";
import db from "../../../db.json";

export default function AdminOrders() {
  const orders = db?.orders ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      <p className="text-gray-500 text-sm">Manage and view all orders.</p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Item</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Quantity</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{o.id}</td>
                  <td className="px-4 py-3">{o.item}</td>
                  <td className="px-4 py-3">{o.quantity}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-[#b30000]">
                      {o.status}
                    </span>
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
