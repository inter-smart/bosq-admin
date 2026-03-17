import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  CreditCard,
  Receipt,
  ExternalLink,
  Download,
  Truck,
  Globe,
  Tag,
  Clock,
} from "lucide-react";
import { fetchOrderById, updateOrder, Order } from "@/services/orders/ordersApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Cancellation Dialog State
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<Order['status'] | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder(parseInt(id));
    }
  }, [id]);

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true);
      const response = await fetchOrderById(orderId);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusSelect = (newStatus: Order['status']) => {
    if (newStatus === "cancelled") {
      setPendingStatus(newStatus);
      setCancelReason("");
      setCancelDialogOpen(true);
    } else {
      handleStatusChange(newStatus);
    }
  };

  const confirmCancellation = () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      });
      return;
    }
    setCancelDialogOpen(false);
    handleStatusChange("cancelled", cancelReason);
  };

  const handleStatusChange = async (newStatus: Order['status'], reason?: string) => {
    if (!order) return;
    try {
      setLoading(true);
      const payload: any = { status: newStatus };
      if (reason) payload.cancel_reason = reason;

      const res = await updateOrder(order.id, payload);
      if (res.success) {
        toast({
          title: "Status Updated",
          description: "Order status has been updated successfully.",
        });
        await loadOrder(order.id);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to update status",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      const aed = (val: string | number) =>
        `AED ${parseFloat(String(val)).toLocaleString("en-AE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

      // ── HEADER ──────────────────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 15, 15);
      doc.text("BOSQ", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Tax Invoice / Receipt", margin, y + 6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 15, 15);
      doc.text(`Invoice: ${order.order_id}`, pageWidth - margin, y, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      doc.text(`Date: ${orderDate}`, pageWidth - margin, y + 6, {
        align: "right",
      });
      doc.text(
        `Status: ${order.status.toUpperCase()}`,
        pageWidth - margin,
        y + 11,
        { align: "right" },
      );
      y += 18;

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // ── CUSTOMER + BILLING ADDRESS ───────────────────────────────────
      const billingAddr = order.addresses?.find(
        (a) => a.address_type === "billing",
      );
      const shippingAddr = order.addresses?.find(
        (a) => a.address_type === "shipping",
      );

      // Same anchor as header right-side text
      const rx = pageWidth - margin;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text("CUSTOMER DETAILS", margin, y);
      if (billingAddr) doc.text("BILLING ADDRESS", rx, y, { align: "right" });

      let headingY = y;
      let leftY = headingY + 6;
      let rightY = headingY + 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);

      const firstName = order?.user?.first_name?.trim();
      const lastName = order?.user?.last_name?.trim();
      const fullName = [firstName, lastName].filter(Boolean).join(" ");

      const customerName = fullName || order?.user?.name || "Guest Customer";

      doc.text(customerName, margin, leftY);
      leftY += 5;
      if (order.user?.email) {
        doc.text(order.user.email, margin, leftY);
        leftY += 5;
      }
      if (order.user?.mobile) {
        doc.text(order.user.mobile, margin, leftY);
        leftY += 5;
      }

      if (shippingAddr) {
        leftY += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text("SHIPPING ADDRESS", margin, leftY);
        leftY += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
        doc.text(shippingAddr.name, margin, leftY);
        leftY += 5;
        if (shippingAddr.company_name) {
          doc.text(shippingAddr.company_name, margin, leftY);
          leftY += 5;
        }
        doc.text(shippingAddr.street_address, margin, leftY);
        leftY += 5;
        if (shippingAddr.apartment) {
          doc.text(shippingAddr.apartment, margin, leftY);
          leftY += 5;
        }
        if (shippingAddr.state?.name) {
          doc.text(shippingAddr.state.name, margin, leftY);
          leftY += 5;
        }
        leftY += 3;
        doc.text(
          `Ph: ${shippingAddr.country_code} ${shippingAddr.phone}`,
          margin,
          leftY
        );
        leftY += 5;
      }

      if (billingAddr) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
        doc.text(billingAddr.name, rx, rightY, { align: "right" });
        rightY += 5;
        if (billingAddr.company_name) {
          doc.text(billingAddr.company_name, rx, rightY, { align: "right" });
          rightY += 5;
        }
        doc.text(billingAddr.street_address, rx, rightY, { align: "right" });
        rightY += 5;
        if (billingAddr.apartment) {
          doc.text(billingAddr.apartment, rx, rightY, { align: "right" });
          rightY += 5;
        }
        if (billingAddr.state?.name) {
          doc.text(billingAddr.state.name, rx, rightY, { align: "right" });
          rightY += 5;
        }
        rightY += 3; // breathing gap before phone
        doc.text(
          `Ph: ${billingAddr.country_code} ${billingAddr.phone}`,
          rx,
          rightY,
          { align: "right" },
        );
        rightY += 5;
      }

      y = Math.max(leftY, rightY) + 6;

      // ── PAYMENT STRIP ────────────────────────────────────────────────
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text(
        `Payment: ${order.payment_status.toUpperCase()}   |   Method: ${order.payment_type.toUpperCase()}`,
        margin,
        y,
      );
      y += 8;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;

      // ── ITEMS TABLE ──────────────────────────────────────────────────
      const cols = {
        product: margin,
        qty: margin + 90,
        price: margin + 118,
        discount: margin + 150,
        subtotal: pageWidth - margin,
      };

      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y - 4, contentWidth, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text("PRODUCT", cols.product, y);
      doc.text("QTY", cols.qty, y, { align: "center" });
      doc.text("PRICE", cols.price, y, { align: "center" });
      doc.text("DISCOUNT", cols.discount, y, { align: "center" });
      doc.text("SUBTOTAL", cols.subtotal, y, { align: "right" });
      y += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(20, 20, 20);

      (order.items ?? []).forEach((item, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, y - 4, contentWidth, 10, "F");
        }
        const unitPrice = parseFloat(item.price);
        const discountAmt = parseFloat(item.discount_amount);
        const lineSubtotal = unitPrice * item.quantity - discountAmt;
        const productTitle = item.variant?.title ?? "Unknown Product";
        const sku = item.variant?.sku ? `SKU: ${item.variant.sku}` : "";

        doc.setFont("helvetica", "bold");
        const t =
          productTitle.length > 38
            ? productTitle.substring(0, 36) + ".."
            : productTitle;
        doc.text(t, cols.product, y);
        if (sku) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(120, 120, 120);
          doc.text(sku, cols.product, y + 4);
          doc.setFontSize(8.5);
          doc.setTextColor(20, 20, 20);
        }
        doc.setFont("helvetica", "normal");
        doc.text(String(item.quantity), cols.qty, y, { align: "center" });
        doc.text(aed(unitPrice), cols.price, y, { align: "center" });
        const discountValue =
          typeof discountAmt === "number" &&
            !isNaN(discountAmt) &&
            discountAmt > 0
            ? aed(discountAmt)
            : "-";

        doc.text(discountValue, cols.discount, y, { align: "center" });
        doc.setFont("helvetica", "bold");
        doc.text(aed(lineSubtotal), cols.subtotal, y, { align: "right" });
        y += 11;

        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      });

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // ── FINANCIAL SUMMARY ────────────────────────────────────────────
      const summaryLabelX = pageWidth - margin - 70;
      const summaryValueX = pageWidth - margin;

      const drawRow = (
        label: string,
        value: string,
        bold = false,
        color: [number, number, number] = [30, 30, 30],
      ) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(bold ? 10 : 9);
        doc.setTextColor(...color);
        doc.text(label, summaryLabelX, y);
        doc.text(value, summaryValueX, y, { align: "right" });
        y += 6;
      };

      drawRow("Subtotal", aed(order.subtotal));
      drawRow("Tax", aed(order.tax_total));
      if (parseFloat(String(order.discount_total || 0)) > 0) {
        drawRow(
          "Discount",
          `- ${aed(order.discount_total)}`,
          false,
          [180, 30, 30],
        );
      }
      doc.setDrawColor(80, 80, 80);
      doc.line(summaryLabelX, y, summaryValueX, y);
      y += 5;
      drawRow("Grand Total", aed(order.grand_total), true);

      // ── FOOTER ───────────────────────────────────────────────────────
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
      doc.text(
        "Thank you for shopping with BOSQ. For queries, contact support.",
        pageWidth / 2,
        pageHeight - 12,
        { align: "center" },
      );

      doc.save(`invoice-${order.order_id}.pdf`);
      toast({
        title: "Invoice Downloaded",
        description: `Invoice for order ${order.order_id} has been downloaded.`,
      });
    } catch (error) {
      console.error("Invoice generation failed:", error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }



  console.log(order.items)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Button onClick={() => navigate("/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>
    );
  }

  const billingAddress = order.addresses?.find(
    (a) => a.address_type === "billing",
  );
  const shippingAddress = order.addresses?.find(
    (a) => a.address_type === "shipping",
  );

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    packed: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    returned: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Order #{order.order_id}
              </h1>
              {['delivered', 'cancelled', 'returned'].includes(order.status) ? (
                <Badge
                  className={`${statusColors[order.status]} capitalize px-3 py-1 font-semibold border`}
                >
                  {order.status}
                </Badge>
              ) : (
                <Select
                  value={order.status}
                  onValueChange={(val: any) => handleStatusSelect(val)}
                >
                  <SelectTrigger className={`w-[140px] h-8 capitalize ${statusColors[order.status]} font-semibold`}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'].map(s => {
                      let disabled = false;
                      if (s === 'delivered' && order.status !== 'shipped') disabled = true;
                      if (s === 'shipped' && order.status !== 'packed') disabled = true;
                      if (s === 'packed' && order.status !== 'confirmed') disabled = true;

                      return (
                        <SelectItem key={s} value={s} disabled={disabled} className="capitalize">
                          {s}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Cancellation Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cancel-reason">Reason for Cancellation</Label>
                <Textarea
                  id="cancel-reason"
                  placeholder="Please provide a reason for cancelling this order..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Back
              </Button>
              <Button variant="destructive" onClick={confirmCancellation}>
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="px-3 py-1 border-primary/20 bg-primary/5 text-primary"
          >
            Payment: {order.payment_status.toUpperCase()}
          </Badge>
          <Badge
            variant="outline"
            className="px-3 py-1 border-muted-foreground/20 bg-muted/5"
          >
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            {order.payment_type.toUpperCase()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadInvoice}
            className="ml-2 flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Section 1: User Details */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {order.user?.first_name?.[0]}
                {order.user?.last_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-lg leading-none">
                  {order?.user?.name
                    ? (order?.user?.name ?? null)
                    : `${order?.user?.first_name} ${order?.user?.last_name}`}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <a
                  href={`mailto:${order.user?.email}`}
                  className="text-primary hover:underline"
                >
                  {order.user?.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{order.user?.mobile}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Addresses */}
        <Card className="border-primary/10 shadow-sm md:col-span-2">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery & Billing Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase font-bold tracking-wider"
                >
                  Shipping Address
                </Badge>
              </div>
              {shippingAddress ? (
                <AddressData address={shippingAddress} />
              ) : (
                <AddressData address={billingAddress} />
              )}
            </div>

            <Separator className="md:hidden" />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase font-bold tracking-wider"
                >
                  Billing Address
                </Badge>
              </div>
              {billingAddress ? (
                <AddressData address={billingAddress} />
              ) : (
                <AddressData address={shippingAddress} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Shipping & Tracking */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Shipping & Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                    Est. Delivery Details
                  </p>
                  <p className="mt-0.5">
                    {order.est_delivery_details || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                    Courier Partner
                  </p>
                  <p className="mt-0.5">
                    {order.partner_name || "Not assigned"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                    AWB Number
                  </p>
                  <p className="mt-0.5 font-mono">
                    {order.awb_number || "Not available"}
                  </p>
                </div>
              </div>
              {order.order_url && (
                <div className="flex items-start gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                      Tracking Link
                    </p>
                    <a
                      href={order.order_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 mt-0.5"
                    >
                      Track Shipment <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Product Order Details */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/30">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Order Items ({order.items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/10 text-muted-foreground font-medium uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Details</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Discount</th>
                  <th className="px-6 py-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items?.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded border bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {item.variant?.media_path ||
                            item.product?.media_path ? (
                            <img
                              src={
                                `${import.meta.env.VITE_IMAGE_URL}/${item.variant?.media_path || item.product?.media_path}` ||
                                item.product?.media_path
                              }
                              alt={item.product?.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted/20" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-primary">
                            {item.product?.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            SKU: {item.variant?.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium">
                        {item.variant?.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground font-medium">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      AED {parseFloat(item.price).toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 ${parseFloat(item.discount_amount) > 0 ? "font-bold text-red-500 text-right" : "text-center"}`}
                    >
                      {parseFloat(item?.discount_amount) > 0
                        ? `-AED ${parseFloat(item?.discount_amount).toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      AED{" "}
                      {(
                        parseFloat(item.price) * item.quantity -
                        parseFloat(item.discount_amount)
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Calculations Wrapper */}
      <div className="flex justify-end">
        <Card className="w-full md:w-96 border-primary/20 shadow-lg lg:scale-105 transform origin-top-right">
          <CardHeader className="py-4 border-b bg-primary/5">
            <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Order Financials
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                AED {parseFloat(order.subtotal).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax Total</span>
              <span className="font-medium">
                AED {parseFloat(order.tax_total).toLocaleString()}
              </span>
            </div>
            {parseFloat(String(order.discount_total || 0)) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount Total</span>
                <span className="text-red-500 font-medium">
                  -AED{" "}
                  {parseFloat(order?.discount_total || "0").toLocaleString()}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-primary">
                Grand Total
              </span>
              <span className="text-2xl font-black text-primary">
                AED {parseFloat(order.grand_total).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



function AddressData({ address }) {
  return (
    <div className="space-y-1.5 text-sm">
      <p className="font-bold text-base">{address.name}</p>
      <p className="text-muted-foreground">{address.company_name}</p>
      <p className="text-muted-foreground">{address.street_address}</p>
      {address.apartment && (
        <p className="text-muted-foreground">{address.apartment}</p>
      )}
      <p className="font-medium">{address.state?.name}</p>
      <div className="pt-2">
        <p className="text-xs text-muted-foreground">
          Phone: {address.country_code} {address.phone}
        </p>
        <p className="text-xs text-muted-foreground">Email: {address.email}</p>
      </div>
    </div>
  );
};
