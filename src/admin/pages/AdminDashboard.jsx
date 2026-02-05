import React, { useState } from "react";
import { IndianRupee, TrendingUp, ShoppingCart, Package, BarChart3 } from "lucide-react";

const KPI_CARDS = [
  { title: "Gross Value", value: "₹3.2L", change: 12.5, icon: IndianRupee },
  { title: "Net Sales", value: "₹2.8L", change: 8.3, icon: TrendingUp },
  { title: "Orders", value: "847", change: 15.2, icon: ShoppingCart },
  { title: "Units Sold", value: "1,243", change: 11.4, icon: Package },
  { title: "Avg Order Value", value: "₹3,780", change: -2.1, icon: IndianRupee },
  { title: "Conversion Rate", value: "3.4%", change: 0.8, icon: BarChart3 },
  { title: "Returns Rate", value: "2.1%", change: -0.3, icon: TrendingUp },
  { title: "In-Stock %", value: "94.2%", change: 1.2, icon: Package },
  { title: "Live SKUs", value: "1,847", change: 0, icon: Package },
  { title: "Active Customers", value: "3,421", change: 18.5, sub: "vs last month", icon: BarChart3 },
];

const TREND_DATA = [40, 55, 45, 65, 58, 72, 68];
const CATEGORY_MIX = [
  { label: "Pipes", pct: 35, color: "#2563eb" },
  { label: "Fittings", pct: 25, color: "#38bdf8" },
  { label: "Boxes", pct: 20, color: "#34d399" },
  { label: "Hose", pct: 12, color: "#fbbf24" },
  { label: "Others", pct: 8, color: "#9ca3af" },
];

export default function AdminDashboard() {
  const [range, setRange] = useState("7");
  const [chartPeriod, setChartPeriod] = useState("week");

  const handleExport = () => {
    const data = JSON.stringify({ range, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dinesh-pvc-admin-report-${range}-days.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your marketplace performance</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb]"
          >
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {KPI_CARDS.map(({ title, value, change, sub, icon: Icon }) => (
          <div
            key={title}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-500">{title}</span>
              <span className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <Icon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
            <p className="text-xs mt-1">
              {change >= 0 ? (
                <span className="text-green-600">▲ {change}% vs last {sub || "week"}</span>
              ) : (
                <span className="text-red-600">▼ {change}% vs last {sub || "week"}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Orders Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales & Orders Trend</h3>
          <div className="flex gap-2 mb-4">
            {["week", "month", "year"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setChartPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                  chartPeriod === p ? "bg-[#2563eb] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="h-48 flex items-end gap-1">
            {TREND_DATA.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[#2563eb]/80 rounded-t min-w-[24px] transition-all hover:bg-[#2563eb]"
                style={{ height: `${h}%` }}
                title={`${h}`}
              />
            ))}
          </div>
        </div>

        {/* Category Mix */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Mix</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center justify-center w-40 h-40 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {CATEGORY_MIX.map(({ pct, color }, i) => {
                  const circumference = 2 * Math.PI * 40;
                  const dash = (pct / 100) * circumference;
                  const offset = CATEGORY_MIX.slice(0, i).reduce((s, { pct: p }) => s + (p / 100) * circumference, 0);
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={color}
                      strokeWidth="20"
                      strokeDasharray={`${dash} ${circumference}`}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="space-y-2">
              {CATEGORY_MIX.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">{label} {pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
