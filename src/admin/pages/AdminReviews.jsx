import React, { useState, useMemo } from "react";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";
import { getImageUrl } from "../../utils/imageLoader";

const mockReviews = [
  {
    id: 1,
    productName: "Dinesh PVC Pipe",
    productImage: "p1a.png",
    customerName: "Ramesh Builders",
    verifiedPurchase: true,
    date: "2024-11-20",
    rating: 5,
    comment: "Excellent quality. Dinesh PVC pipes are durable and exactly as described. Used for plumbing and very satisfied.",
    helpfulCount: 12,
    status: "Approved",
    reply: "",
  },
  {
    id: 2,
    productName: "Dinesh Round Junction Box",
    productImage: "boxA1.png",
    customerName: "Kolkata Plumbing Co.",
    verifiedPurchase: true,
    date: "2024-11-18",
    rating: 4,
    comment: "Good product but delivery took longer than expected. Dinesh PVC Pipes quality is good. Fits well for our electrical work.",
    helpfulCount: 8,
    status: "Approved",
    reply: "",
  },
  {
    id: 3,
    productName: "Dinesh PVC Pipe Fitting",
    productImage: "r1.png",
    customerName: "Hyderabad Hardware",
    verifiedPurchase: true,
    date: "2024-11-15",
    rating: 5,
    comment: "Bought these for our store. Dinesh fittings are sturdy and easy to install. Highly recommended for plumbing.",
    helpfulCount: 3,
    status: "Pending",
    reply: "",
  },
  {
    id: 4,
    productName: "Dinesh Deep Junction Box",
    productImage: "boxA2.png",
    customerName: "Chennai Pipes & Fittings",
    verifiedPurchase: false,
    date: "2024-11-10",
    rating: 3,
    comment: "Product is okay, but expected better finishing on the edges. Dinesh PVC Pipes packaging was great and delivery was on time.",
    helpfulCount: 5,
    status: "Pending",
    reply: "",
  },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const kpis = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === "Pending").length;
    const approved = reviews.filter((r) => r.status === "Approved").length;
    const avgRating = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(2) : "0";
    return { total, pending, approved, avgRating };
  }, [reviews]);

  const openReply = (id) => {
    const r = reviews.find((x) => x.id === id);
    setReplyingId(id);
    setReplyText(r?.reply || "");
  };

  const cancelReply = () => {
    setReplyingId(null);
    setReplyText("");
  };

  const sendReply = () => {
    if (!replyingId) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === replyingId ? { ...r, reply: replyText.trim() } : r))
    );
    setReplyingId(null);
    setReplyText("");
  };

  const imgSrc = (imageName) => {
    if (!imageName) return null;
    try {
      return getImageUrl(imageName);
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reviews & Ratings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer reviews and testimonials.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-[#b30000] mt-0.5">{kpis.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-0.5">{kpis.pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-0.5">{kpis.approved}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avg Rating</p>
          <p className="text-2xl font-bold text-gray-800 mt-0.5 flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            {kpis.avgRating}
          </p>
        </div>
      </div>

      <div className="space-y-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 last:border-b-0 p-6"
          >
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                {imgSrc(review.productImage) ? (
                  <img
                    src={imgSrc(review.productImage)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">img</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">{review.productName}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-sm">
                  <span className="text-gray-700">{review.customerName}</span>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-blue-600">
                      <span className="text-blue-500">✓</span>
                      Verified Purchase
                    </span>
                  )}
                  <span className="text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                  <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    {review.helpfulCount} Helpful
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        review.status === "Approved" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {review.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => openReply(review.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </button>
                  </div>
                </div>
                {review.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <p className="text-sm text-gray-600 font-medium">Your reply:</p>
                    <p className="text-gray-700 text-sm mt-0.5">{review.reply}</p>
                  </div>
                )}
                {replyingId === review.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] outline-none resize-y"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={sendReply}
                        className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000] transition-colors"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
