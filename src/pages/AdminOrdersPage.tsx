/**
 * Admin Orders Dashboard
 *
 * Full order management dashboard for VARENO admins.
 * Connected to real Supabase database via admin-orders Edge Function.
 */

import { useState, useEffect, useCallback } from "react";
import { PRODUCT, formatPriceEGP } from "@/lib/config/product";
import { useAuth } from "@/lib/auth";
import {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrder,
  type AdminOrder,
  type AdminOrderItem,
  type AdminSummary,
} from "@/lib/services/adminService";
import { Icon } from "@/components/ui/Icon";
import { Divider } from "@/components/ui/Divider";

const ORDER_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "awaiting_proof", "verified", "failed"] as const;

const statusColors: Record<string, string> = {
  confirmed: "text-primary bg-primary/10",
  processing: "text-tertiary bg-tertiary/10",
  shipped: "text-secondary bg-secondary/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-error bg-error/10",
  pending: "text-on-surface-variant bg-on-surface-variant/10",
  awaiting_proof: "text-primary bg-primary/10",
  verified: "text-green-400 bg-green-400/10",
  failed: "text-error bg-error/10",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminOrdersPage() {
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [sort, setSort] = useState("newest");

  // Detail panel
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orderItems, setOrderItems] = useState<AdminOrderItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const result = await adminListOrders({
      search,
      status: statusFilter,
      payment: paymentFilter,
      method: methodFilter,
      sort,
    });
    if (result.success && result.orders) {
      setOrders(result.orders);
      setSummary(result.summary || null);
    }
    setLoading(false);
  }, [search, statusFilter, paymentFilter, methodFilter, sort]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const openDetail = async (order: AdminOrder) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    const result = await adminGetOrder(order.id);
    if (result.success && result.order) {
      setSelectedOrder(result.order);
      setOrderItems(result.items || []);
    }
    setDetailLoading(false);
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const updateStatus = async (
    field: "orderStatus" | "paymentStatus",
    value: string
  ) => {
    if (!selectedOrder) return;
    setUpdating(true);
    const result = await adminUpdateOrder({
      orderId: selectedOrder.id,
      [field]: value,
    });
    if (result.success && result.order) {
      setSelectedOrder(result.order);
      // Update in list too
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? result.order! : o))
      );
      fetchOrders(); // refresh summary
    }
    setUpdating(false);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-headline-lg sm:text-headline-md uppercase text-on-surface tracking-[0.03em]">
              Orders Dashboard
            </h1>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">
              Manage customer orders, payments, and fulfillment.
            </p>
          </div>
          <button
            onClick={signOut}
            className="font-body text-label-sm uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors px-3 py-2 border border-outline-variant/30 hover:border-primary/50 shrink-0"
          >
            Sign Out
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {[
              { label: "Total Orders", value: summary.total, icon: "shopping_bag" },
              { label: "New Orders", value: summary.new, icon: "fiber_new" },
              { label: "Pending Payment", value: summary.pendingPayment, icon: "pending" },
              { label: "Paid", value: summary.paid, icon: "payments" },
              { label: "Completed", value: summary.completed, icon: "check_circle" },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-surface-container p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                  <Icon name={card.icon} size="md" />
                </div>
                <div>
                  <span className="block font-body text-[11px] sm:text-label-sm text-on-surface-variant uppercase tracking-[0.15em]">
                    {card.label}
                  </span>
                  <span className="font-display text-headline-sm text-on-surface">
                    {card.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-surface-container p-4 sm:p-5 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon
              name="search"
              size="md"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-surface-container-lowest text-on-surface pl-10 pr-4 py-2.5 font-body text-body-sm placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface px-3 py-2.5 font-body text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Status</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface px-3 py-2.5 font-body text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Payment</option>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface px-3 py-2.5 font-body text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Methods</option>
              <option value="cod">Cash on Delivery</option>
              <option value="instapay">InstaPay</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-surface-container-lowest text-on-surface px-3 py-2.5 font-body text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Icon name="inbox" size="xl" className="text-on-surface-variant/40 mb-4" />
            <p className="font-body text-body-md text-on-surface-variant">
              No orders found.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] pb-3 pr-4">
                      Order
                    </th>
                    <th className="text-left font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] pb-3 pr-4">
                      Customer
                    </th>
                    <th className="text-left font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] pb-3 pr-4">
                      Date
                    </th>
                    <th className="text-right font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] pb-3 pr-4">
                      Total
                    </th>
                    <th className="text-left font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] pb-3 pr-4">
                      Method
                    </th>
                    <th className="text-left font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] pb-3 pr-4">
                      Payment
                    </th>
                    <th className="text-left font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] pb-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-outline-variant/10 hover:bg-surface-container-high/50 cursor-pointer transition-colors"
                      onClick={() => openDetail(order)}
                    >
                      <td className="py-4 pr-4">
                        <span className="font-body text-label-md text-primary font-semibold tracking-[0.1em]">
                          #{order.order_reference}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-body text-body-sm text-on-surface">
                          {order.customer_name}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-body text-body-sm text-on-surface-variant">
                          {formatDate(order.created_at)}
                        </span>
                        <br />
                        <span className="font-body text-[11px] text-on-surface-variant/60">
                          {formatTime(order.created_at)}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <span className="font-body text-body-sm text-on-surface font-medium">
                          {formatPriceEGP(order.total_amount_piastres)} {PRODUCT.currencyDisplay}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-body text-body-sm text-on-surface-variant capitalize">
                          {order.payment_method === "cod" ? "COD" : "InstaPay"}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-block px-2 py-0.5 font-body text-[11px] uppercase tracking-[0.1em] ${
                            statusColors[order.payment_status] || "text-on-surface-variant"
                          }`}
                        >
                          {order.payment_status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2 py-0.5 font-body text-[11px] uppercase tracking-[0.1em] ${
                            statusColors[order.order_status] || "text-on-surface-variant"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-container p-4 cursor-pointer hover:bg-surface-container-high transition-colors"
                  onClick={() => openDetail(order)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-label-md text-primary font-semibold tracking-[0.1em]">
                      #{order.order_reference}
                    </span>
                    <span className="font-body text-body-sm text-on-surface font-medium">
                      {formatPriceEGP(order.total_amount_piastres)} {PRODUCT.currencyDisplay}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-body-sm text-on-surface">
                      {order.customer_name}
                    </span>
                    <span className="font-body text-body-sm text-on-surface-variant capitalize">
                      {order.payment_method === "cod" ? "COD" : "InstaPay"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[11px] text-on-surface-variant/60">
                      {formatDate(order.created_at)} — {formatTime(order.created_at)}
                    </span>
                    <div className="flex gap-1.5">
                      <span
                        className={`inline-block px-2 py-0.5 font-body text-[10px] uppercase tracking-[0.1em] ${
                          statusColors[order.payment_status] || "text-on-surface-variant"
                        }`}
                      >
                        {order.payment_status.replace("_", " ")}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 font-body text-[10px] uppercase tracking-[0.1em] ${
                          statusColors[order.order_status] || "text-on-surface-variant"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order Detail Slide-over */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeDetail}
          />

          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-surface-container-lowest overflow-y-auto shadow-2xl animate-slide-in">
            {detailLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="font-body text-label-sm text-primary uppercase tracking-[0.18em] block mb-1">
                      Order Details
                    </span>
                    <h2 className="font-display text-headline-sm text-on-surface">
                      #{selectedOrder.order_reference}
                    </h2>
                    <span className="font-body text-body-sm text-on-surface-variant">
                      {formatDate(selectedOrder.created_at)} at{" "}
                      {formatTime(selectedOrder.created_at)}
                    </span>
                  </div>
                  <button
                    onClick={closeDetail}
                    className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <Icon name="close" size="lg" />
                  </button>
                </div>

                {/* Status Controls */}
                <div className="bg-surface-container p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] block mb-1.5">
                      Order Status
                    </label>
                    <select
                      value={selectedOrder.order_status}
                      onChange={(e) => updateStatus("orderStatus", e.target.value)}
                      disabled={updating}
                      className="w-full bg-surface-container-lowest text-on-surface px-3 py-2.5 font-body text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em] block mb-1.5">
                      Payment Status
                    </label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => updateStatus("paymentStatus", e.target.value)}
                      disabled={updating}
                      className="w-full bg-surface-container-lowest text-on-surface px-3 py-2.5 font-body text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s
                            .replace("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Divider className="mb-6" />

                {/* Customer Information */}
                <div className="mb-6">
                  <h3 className="font-body text-label-sm text-primary uppercase tracking-[0.18em] mb-3">
                    Customer Information
                  </h3>
                  <div className="bg-surface-container p-4 space-y-3">
                    <DetailRow label="Full Name" value={selectedOrder.customer_name} />
                    <DetailRow label="Phone" value={selectedOrder.phone} />
                    <DetailRow label="Email" value={selectedOrder.email} />
                    <DetailRow
                      label="Shipping Address"
                      value={`${selectedOrder.street_address}, ${selectedOrder.area_district}, ${selectedOrder.city}`}
                    />
                  </div>
                </div>

                {/* Order Information */}
                <div className="mb-6">
                  <h3 className="font-body text-label-sm text-primary uppercase tracking-[0.18em] mb-3">
                    Order Information
                  </h3>
                  <div className="bg-surface-container p-4 space-y-3">
                    <DetailRow label="Product" value={PRODUCT.name} />
                    <DetailRow label="Quantity" value={String(selectedOrder.quantity)} />
                    <DetailRow
                      label="Unit Price"
                      value={`${formatPriceEGP(selectedOrder.unit_price_piastres)} ${PRODUCT.currencyDisplay}`}
                    />
                    <DetailRow label="Shipping" value="Complimentary" />
                    <Divider className="my-2" />
                    <DetailRow
                      label="Total"
                      value={`${formatPriceEGP(selectedOrder.total_amount_piastres)} ${PRODUCT.currencyDisplay}`}
                      highlight
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-6">
                  <h3 className="font-body text-label-sm text-primary uppercase tracking-[0.18em] mb-3">
                    Payment Information
                  </h3>
                  <div className="bg-surface-container p-4 space-y-3">
                    <DetailRow
                      label="Payment Method"
                      value={
                        selectedOrder.payment_method === "cod"
                          ? "Cash on Delivery"
                          : "InstaPay"
                      }
                    />
                    <DetailRow
                      label="Payment Status"
                      value={selectedOrder.payment_status.replace("_", " ")}
                    />
                    {selectedOrder.payment_method === "instapay" &&
                      selectedOrder.instapay_sender_name && (
                        <div className="bg-primary/5 border border-primary/20 p-3 mt-2">
                          <span className="font-body text-label-sm text-primary uppercase tracking-[0.15em] block mb-1">
                            InstaPay Sender Name
                          </span>
                          <span className="font-display text-headline-sm text-on-surface">
                            {selectedOrder.instapay_sender_name}
                          </span>
                        </div>
                      )}
                    {selectedOrder.instapay_proof_path && (
                      <DetailRow
                        label="Payment Proof"
                        value="Uploaded"
                      />
                    )}
                  </div>
                </div>

                {/* Order Items */}
                {orderItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-body text-label-sm text-primary uppercase tracking-[0.18em] mb-3">
                      Order Items
                    </h3>
                    <div className="bg-surface-container p-4">
                      {orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0"
                        >
                          <div>
                            <span className="font-body text-body-sm text-on-surface">
                              {item.product_name}
                            </span>
                            <span className="font-body text-body-sm text-on-surface-variant ml-2">
                              × {item.quantity}
                            </span>
                          </div>
                          <span className="font-body text-body-sm text-on-surface font-medium">
                            {formatPriceEGP(item.total_price_piastres)}{" "}
                            {PRODUCT.currencyDisplay}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
      <span className="font-body text-label-sm text-on-surface-variant uppercase tracking-[0.15em]">
        {label}
      </span>
      <span
        className={`font-body text-body-sm ${
          highlight ? "text-primary font-semibold" : "text-on-surface"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
