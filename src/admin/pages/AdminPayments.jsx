import React, { useState, useMemo } from "react";
import { Search, CreditCard, CheckCircle, Clock, TrendingUp, Check, X, Settings, Eye } from "lucide-react";

function downloadInvoicePDF(company, transaction) {
  const JsPDF = window.jspdf?.jsPDF || window.jspdf;
  if (!JsPDF) {
    alert("PDF library is loading. Please try again in a moment.");
    return;
  }
  const doc = new JsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text(company.name, margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(company.address, margin, y);
  y += 6;
  doc.text(`GSTIN: ${company.gstin} | PAN: ${company.pan}`, margin, y);
  y += 10;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 190, y);
  y += 10;

  doc.setFont(undefined, "bold");
  doc.setFontSize(11);
  doc.text("Bill To", margin, y);
  y += 7;
  doc.setFont(undefined, "normal");
  doc.text(transaction.customer, margin, y);
  y += 6;
  doc.text(transaction.customerAddress, margin, y);
  y += 10;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 190, y);
  y += 10;

  doc.setFont(undefined, "bold");
  doc.text("Description", margin, y);
  y += 7;
  doc.setFont(undefined, "normal");
  doc.text(transaction.description, margin, y);
  y += 12;

  const tableTop = y;
  const colW = [25, 20, 35, 25, 45];
  const rowH = 8;
  const headers = ["HSN", "QTY", "RATE", "GST", "AMOUNT"];
  doc.setFillColor(173, 216, 230);
  doc.setDrawColor(0, 0, 0);
  let x = margin;
  headers.forEach((h, i) => {
    doc.rect(x, tableTop, colW[i], rowH, "FD");
    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    doc.text(h, x + 2, tableTop + 5.5);
    x += colW[i];
  });
  y += rowH;

  const rateStr = "₹" + transaction.rate.toLocaleString("en-IN");
  const amountStr = "₹" + transaction.itemAmount.toLocaleString("en-IN");
  const rowData = [transaction.hsn, String(transaction.qty), rateStr, transaction.gst, amountStr];
  doc.setFont(undefined, "normal");
  let xCol = margin;
  colW.forEach((w, i) => {
    doc.rect(xCol, y, w, rowH);
    doc.text(rowData[i], xCol + 2, y + 5.5);
    xCol += w;
  });
  y += rowH + 10;

  doc.setFont(undefined, "bold");
  doc.setFontSize(11);
  doc.text("Total Amount: ₹" + transaction.amount.toLocaleString("en-IN"), margin, y);

  doc.save(`Dinesh-PVC-Pipes-Invoice-${transaction.orderId}.pdf`);
}

const mockGateways = [
  { id: 1, name: "Razorpay", type: "CARD", status: "active", primary: true, transactionFee: "2% + ₹3", transactions: 8542, settlement: "T+2 days", successRate: 98.3, merchantId: "MERCHANT_001", apiKey: "sk_live_xxxxxxxx" },
  { id: 2, name: "PhonePe", type: "UPI", status: "inactive", primary: false, transactionFee: "1.5%", transactions: 12453, settlement: "T+1 days", successRate: 97.8, merchantId: "MERCHANT_002", apiKey: "xxxxxxxx" },
];

const mockTransactions = [
  { id: 1, orderId: "ORD-2024-1234", amount: 45999, gateway: "Razorpay", status: "Successful", date: "28/11/2024, 2:30 pm", customer: "Ramesh Builders", paymentMethod: "Credit Card", transactionRef: "pay_MhJ7K8N9OP1Q2", customerAddress: "Mumbai, Maharashtra - 400001", description: "PVC Pipes & Fittings - Bulk Order", hsn: "3917", qty: 1, rate: 44999, gst: "3%", itemAmount: 45999 },
  { id: 2, orderId: "ORD-2024-1235", amount: 32500, gateway: "PhonePe", status: "Successful", date: "28/11/2024, 1:15 pm", customer: "Kolkata Plumbing Co.", paymentMethod: "UPI", transactionRef: "UPI_2024112813150001", customerAddress: "Kolkata, West Bengal - 700016", description: "Dinesh PVC Pipes - Plumbing Kit", hsn: "3917", qty: 2, rate: 15800, gst: "3%", itemAmount: 32500 },
  { id: 3, orderId: "ORD-2024-1236", amount: 28750, gateway: "Razorpay", status: "Pending", date: "28/11/2024, 12:45 pm", customer: "Hyderabad Hardware", paymentMethod: "Net Banking", transactionRef: "pay_NIK8L9MON1OP3", customerAddress: "Hyderabad, Telangana - 500034", description: "Dinesh PVC Fittings Set", hsn: "3917", qty: 1, rate: 27912, gst: "3%", itemAmount: 28750 },
];

const COMPANY = { name: "Dinesh PVC Pipes", address: "123 Industrial Area, Mumbai, MH 400001", gstin: "27AABCU1234A1Z5", pan: "AABCR1234A" };

export default function AdminPayments() {
  const [gateways, setGateways] = useState(mockGateways);
  const [activeTab, setActiveTab] = useState("gateways");
  const [gatewaySearch, setGatewaySearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const filteredGateways = useMemo(() => {
    const q = gatewaySearch.toLowerCase().trim();
    return q ? gateways.filter((g) => g.name.toLowerCase().includes(q) || g.type.toLowerCase().includes(q)) : gateways;
  }, [gateways, gatewaySearch]);

  const filteredTransactions = useMemo(() => {
    const q = transactionSearch.toLowerCase().trim();
    return q
      ? mockTransactions.filter(
          (t) =>
            t.orderId.toLowerCase().includes(q) ||
            t.customer.toLowerCase().includes(q) ||
            (t.transactionRef || "").toLowerCase().includes(q)
        )
      : mockTransactions;
  }, [transactionSearch]);

  const kpis = useMemo(() => {
    const total = mockTransactions.length;
    const successful = mockTransactions.filter((t) => t.status === "Successful").length;
    const pending = mockTransactions.filter((t) => t.status === "Pending").length;
    const revenue = mockTransactions.reduce((s, t) => s + (t.status === "Successful" ? t.amount : 0), 0);
    return { totalTransactions: total, successful, pending, totalRevenue: revenue };
  }, []);

  const setGatewayStatus = (id, status) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payments & Settlements</h1>
        <p className="text-gray-500 text-sm mt-1">Manage payment gateways and transactions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-xl font-bold text-gray-800">{kpis.totalTransactions}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Successful</p>
              <p className="text-xl font-bold text-gray-800">{kpis.successful}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-800">{kpis.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#b30000]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#b30000]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">₹ {kpis.totalRevenue.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg bg-white border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveTab("gateways")}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "gateways" ? "bg-white text-[#b30000] border-b-2 border-[#b30000] shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Payment Gateways
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "transactions" ? "bg-white text-[#b30000] border-b-2 border-[#b30000] shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Recent Transactions
          </button>
        </div>
        {activeTab === "gateways" && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={gatewaySearch}
              onChange={(e) => setGatewaySearch(e.target.value)}
              placeholder="Search Gateways..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
            />
          </div>
        )}
        {activeTab === "transactions" && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={transactionSearch}
              onChange={(e) => setTransactionSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none"
            />
          </div>
        )}
      </div>

      {activeTab === "gateways" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGateways.map((g) => (
            <div key={g.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${g.name === "Razorpay" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-red-500 via-amber-400 to-blue-500 text-white"}`}>
                    {g.name === "Razorpay" ? "R" : "P"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{g.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${g.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {g.status === "active" ? <><Check className="w-3 h-3" /> active</> : <><X className="w-3 h-3" /> inactive</>}
                      </span>
                      {g.primary && <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800">Primary</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 uppercase">{g.type}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                <div>
                  <p className="text-gray-500">Transaction Fee</p>
                  <p className="font-medium text-gray-800">{g.transactionFee}</p>
                </div>
                <div>
                  <p className="text-gray-500">Transactions</p>
                  <p className="font-medium text-gray-800">{g.transactions.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-gray-500">Merchant ID</p>
                  <p className="font-medium text-gray-800">{g.merchantId}</p>
                </div>
                <div>
                  <p className="text-gray-500">API Key</p>
                  <p className="font-medium text-gray-800 font-mono">************</p>
                </div>
                <div>
                  <p className="text-gray-500">Settlement</p>
                  <p className="font-medium text-gray-800">{g.settlement}</p>
                </div>
                <div>
                  <p className="text-gray-500">Success Rate</p>
                  <p className="font-medium text-green-600">{g.successRate}%</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
                {g.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => setGatewayStatus(g.id, "inactive")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium hover:bg-red-100"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setGatewayStatus(g.id, "active")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#b30000] text-white text-sm font-medium hover:bg-[#8c0000]"
                  >
                    Activate
                  </button>
                )}
                <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                  <Settings className="w-4 h-4" /> Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-3">
          {filteredTransactions.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800">{t.orderId}</p>
                <p className={`text-sm font-medium mt-0.5 flex items-center gap-1 ${t.status === "Successful" ? "text-green-600" : "text-amber-600"}`}>
                  {t.status === "Successful" ? <><CheckCircle className="w-4 h-4" /> Success</> : <><Clock className="w-4 h-4" /> Pending</>}
                </p>
                <p className="text-sm text-gray-600 mt-1">{t.customer} • {t.paymentMethod} • {t.gateway}</p>
                <p className="text-sm text-gray-500 mt-0.5">{t.transactionRef}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{t.amount.toLocaleString("en-IN")}</p>
                  <p className="text-sm text-gray-500">{t.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTransactionId(t.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTransactionId != null && (() => {
        const t = mockTransactions.find((x) => x.id === selectedTransactionId);
        if (!t) return null;
        const handleDownloadPDF = () => {
          downloadInvoicePDF(COMPANY, t);
        };
        return (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={() => setSelectedTransactionId(null)} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">Transaction Details</h2>
                <button type="button" onClick={() => setSelectedTransactionId(null)} className="p-1 rounded text-gray-500 hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <div id="invoice-pdf-content" className="p-6 overflow-y-auto text-sm">
                <p className="text-xl font-bold text-gray-900">{COMPANY.name}</p>
                <p className="text-gray-600 mt-0.5">{COMPANY.address}</p>
                <p className="text-gray-500 text-xs mt-0.5">GSTIN: {COMPANY.gstin} | PAN: {COMPANY.pan}</p>
                <hr className="border-gray-200 my-4" />
                <p className="font-semibold text-gray-800">Bill To</p>
                <p className="text-gray-800 mt-0.5">{t.customer}</p>
                <p className="text-gray-600">{t.customerAddress}</p>
                <hr className="border-gray-200 my-4" />
                <p className="font-semibold text-gray-800">Description</p>
                <p className="text-gray-700 mt-0.5">{t.description}</p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border border-gray-200 text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-3 font-semibold text-gray-800 border-b border-gray-200">HSN</th>
                        <th className="py-2 px-3 font-semibold text-gray-800 border-b border-gray-200">QTY</th>
                        <th className="py-2 px-3 font-semibold text-gray-800 border-b border-gray-200">RATE</th>
                        <th className="py-2 px-3 font-semibold text-gray-800 border-b border-gray-200">GST</th>
                        <th className="py-2 px-3 font-semibold text-gray-800 border-b border-gray-200">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 border-b border-gray-100">{t.hsn}</td>
                        <td className="py-2 px-3 border-b border-gray-100">{t.qty}</td>
                        <td className="py-2 px-3 border-b border-gray-100">₹{t.rate.toLocaleString("en-IN")}</td>
                        <td className="py-2 px-3 border-b border-gray-100">{t.gst}</td>
                        <td className="py-2 px-3 border-b border-gray-100">₹{t.itemAmount.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-bold text-gray-900 mt-4">Total Amount: ₹{t.amount.toLocaleString("en-IN")}</p>
              </div>
              <div className="no-print-invoice px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setSelectedTransactionId(null)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100">
                  Close
                </button>
                <button type="button" onClick={handleDownloadPDF} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">
                  Download PDF
                </button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
