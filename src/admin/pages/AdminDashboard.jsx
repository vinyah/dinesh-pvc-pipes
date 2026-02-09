import React, { useState } from "react";
import { IndianRupee, TrendingUp, ShoppingCart, Package, BarChart3, AlertTriangle, Clock, CheckCircle, Banknote } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const THEME = { primary: "#b30000", grid: "#d1d5db", lineBright: "#c41e3a" };

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

// Sales & Orders trend – by period
const SALES_ORDERS_WEEK = [
  { date: "Jan 1", orders: 45000, sales: 42000 },
  { date: "Jan 2", orders: 52000, sales: 48000 },
  { date: "Jan 3", orders: 38000, sales: 35000 },
  { date: "Jan 4", orders: 62000, sales: 58000 },
  { date: "Jan 5", orders: 41000, sales: 39000 },
  { date: "Jan 6", orders: 58000, sales: 54000 },
  { date: "Jan 7", orders: 75000, sales: 71000 },
];

const SALES_ORDERS_MONTH = [
  { date: "Week 1", orders: 185000, sales: 172000 },
  { date: "Week 2", orders: 212000, sales: 198000 },
  { date: "Week 3", orders: 198000, sales: 184000 },
  { date: "Week 4", orders: 234000, sales: 218000 },
];

const SALES_ORDERS_YEAR = [
  { date: "Jan", orders: 820000, sales: 768000 },
  { date: "Feb", orders: 790000, sales: 742000 },
  { date: "Mar", orders: 910000, sales: 855000 },
  { date: "Apr", orders: 875000, sales: 820000 },
  { date: "May", orders: 940000, sales: 882000 },
  { date: "Jun", orders: 888000, sales: 832000 },
  { date: "Jul", orders: 925000, sales: 868000 },
  { date: "Aug", orders: 862000, sales: 808000 },
  { date: "Sep", orders: 898000, sales: 845000 },
  { date: "Oct", orders: 956000, sales: 898000 },
  { date: "Nov", orders: 912000, sales: 856000 },
  { date: "Dec", orders: 988000, sales: 928000 },
];

const TREND_BY_PERIOD = { week: SALES_ORDERS_WEEK, month: SALES_ORDERS_MONTH, year: SALES_ORDERS_YEAR };

// Category Mix – different mix per period (theme red shades + gray)
const CATEGORY_MIX_WEEK = [
  { name: "Pipes", value: 35, color: "#b30000" },
  { name: "Fittings", value: 25, color: "#c41e3a" },
  { name: "Boxes", value: 20, color: "#8b0000" },
  { name: "Hose", value: 12, color: "#dc3545" },
  { name: "Others", value: 8, color: "#6b7280" },
];
const CATEGORY_MIX_MONTH = [
  { name: "Pipes", value: 38, color: "#b30000" },
  { name: "Fittings", value: 24, color: "#c41e3a" },
  { name: "Boxes", value: 18, color: "#8b0000" },
  { name: "Hose", value: 11, color: "#dc3545" },
  { name: "Others", value: 9, color: "#6b7280" },
];
const CATEGORY_MIX_YEAR = [
  { name: "Pipes", value: 40, color: "#b30000" },
  { name: "Fittings", value: 22, color: "#c41e3a" },
  { name: "Boxes", value: 17, color: "#8b0000" },
  { name: "Hose", value: 12, color: "#dc3545" },
  { name: "Others", value: 9, color: "#6b7280" },
];
const CATEGORY_BY_PERIOD = { week: CATEGORY_MIX_WEEK, month: CATEGORY_MIX_MONTH, year: CATEGORY_MIX_YEAR };

// Payment Methods – theme red for bars
const PAYMENT_METHODS_DATA = [
  { name: "UPI", count: 115000 },
  { name: "Cards", count: 85000 },
  { name: "COD", count: 40000 },
  { name: "Wallets", count: 32000 },
  { name: "NetBanking", count: 28000 },
];

// Status / alert cards (theme: Delayed uses primary red)
const ALERT_CARDS = [
  { title: "Low Stock", value: "23", desc: "Products below reorder point", color: "#eab308", icon: AlertTriangle },
  { title: "Delayed", value: "8", desc: "Shipments past SLA", color: "#b30000", icon: Clock },
  { title: "Pending", value: "12", desc: "Awaiting approval", color: "#2563eb", icon: CheckCircle },
  { title: "High Value", value: "5", desc: "Orders above ₹50,000", color: "#16a34a", icon: Banknote },
];

// Top Products – PVC relevant, units sold & revenue
const TOP_PRODUCTS_DATA = [
  { name: "4\" PVC Pipes", unitsSold: 58, revenue: 62400 },
  { name: "2\" CPVC Fittings", unitsSold: 52, revenue: 41800 },
  { name: "6\" PVC Pipes", unitsSold: 48, revenue: 55200 },
  { name: "Elbow & Tee Set", unitsSold: 42, revenue: 28900 },
  { name: "PVC Couplers (Box)", unitsSold: 38, revenue: 19200 },
];

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm"
      style={{ borderColor: THEME.grid }}
    >
      <p className="font-medium text-gray-800 mb-1">{label}</p>
      <p className="text-[#b30000]">orders : {(point.orders ?? 0).toLocaleString()}</p>
      <p className="text-[#b30000]">sales : {(point.sales ?? 0).toLocaleString()}</p>
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm"
      style={{ borderColor: THEME.grid }}
    >
      <p className="font-medium text-gray-800">
        {d.name} : {d.value}%
      </p>
    </div>
  );
}

function PaymentTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm"
      style={{ borderColor: THEME.grid }}
    >
      <p className="font-medium text-gray-800">{d.name}</p>
      <p className="text-[#b30000]">count : {Number(d.count).toLocaleString()}</p>
    </div>
  );
}

function TopProductsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm max-w-[220px]"
      style={{ borderColor: THEME.grid }}
    >
      <p className="font-medium text-gray-800 mb-1">{d.name}</p>
      <p className="text-gray-600 text-xs">Units Sold: {d.unitsSold}</p>
      <p className="text-[#b30000]">Revenue: ₹{Number(d.revenue).toLocaleString()}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [range, setRange] = useState("7");
  const [chartPeriod, setChartPeriod] = useState("week");

  const trendData = TREND_BY_PERIOD[chartPeriod];
  const categoryData = CATEGORY_BY_PERIOD[chartPeriod];
  const yAxisMax = chartPeriod === "year" ? 1200000 : chartPeriod === "month" ? 300000 : 80000;

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
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000]"
          >
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 border-2 border-[#b30000] text-[#b30000] rounded-lg text-sm font-medium hover:bg-[#b30000] hover:text-white transition-colors"
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
              <span className="p-1.5 rounded-lg bg-red-50 text-[#b30000]">
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

      {/* Charts row – reference layout with theme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Orders Trend – line chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales & Orders Trend</h3>
          <div className="flex gap-2 mb-4 justify-end">
            {["week", "month", "year"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setChartPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                  chartPeriod === p
                    ? "bg-[#b30000] text-white border-2 border-[#b30000]"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-red-50 hover:text-[#b30000]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${v / 1000}k` : v)}
                  domain={[0, yAxisMax]}
                />
                <Tooltip content={<TrendTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Sales & Orders"
                  stroke={THEME.lineBright}
                  strokeWidth={3}
                  dot={{ fill: "white", stroke: THEME.lineBright, strokeWidth: 2.5, r: 5 }}
                  activeDot={{ r: 7, fill: "white", stroke: THEME.lineBright, strokeWidth: 2.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Mix – pie with labels outside */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Mix</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius="70%"
                  paddingAngle={1}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={{ strokeWidth: 1, stroke: "#9ca3af" }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods – bar chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PAYMENT_METHODS_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                />
                <Tooltip content={<PaymentTooltip />} cursor={{ fill: "rgba(179, 0, 0, 0.06)" }} />
                <Bar
                  dataKey="count"
                  fill={THEME.lineBright}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products – horizontal bar chart (no overlapping labels) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TOP_PRODUCTS_DATA}
                layout="vertical"
                margin={{ top: 8, right: 8, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<TopProductsTooltip />} cursor={{ fill: "rgba(179, 0, 0, 0.06)" }} />
                <Bar
                  dataKey="unitsSold"
                  fill={THEME.lineBright}
                  radius={[0, 6, 6, 0]}
                  maxBarSize={32}
                  barCategoryGap="12%"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status cards – Low Stock, Delayed, Pending, High Value (theme: red for Delayed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ALERT_CARDS.map(({ title, value, desc, color, icon: Icon }) => (
          <div
            key={title}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-[0_14px_32px_rgba(0,0,0,0.28)] transition-shadow"
            style={{ borderColor: color, borderLeftWidth: 4 }}
          >
            <div className="flex items-start gap-3">
              <span
                className="p-2 rounded-lg shrink-0"
                style={{ backgroundColor: `${color}20`, color }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
