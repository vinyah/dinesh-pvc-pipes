import React from "react";
import db from "../../../db.json";

export default function AdminCustomers() {
  const profiles = db?.profiles ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
      <p className="text-gray-500 text-sm">View customer profiles.</p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No customers yet.
                </td>
              </tr>
            ) : (
              profiles.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{c.id}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
