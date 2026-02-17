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
} from "lucide-react";
import { fetchOrderById, Order } from "@/services/orders/ordersApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

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

    const billingAddress = order.addresses?.find(a => a.address_type === 'billing');
    const shippingAddress = order.addresses?.find(a => a.address_type === 'shipping');

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
                    <Button variant="outline" size="icon" onClick={() => navigate("/orders")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Order #{order.order_id}</h1>
                            <Badge className={`${statusColors[order.status]} capitalize px-3 py-1 font-semibold border`}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                        Payment: {order.payment_status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 border-muted-foreground/20 bg-muted/5">
                        <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                        {order.payment_type.toUpperCase()}
                    </Badge>
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
                        <div className="flex items-start gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {order.user?.first_name?.[0]}{order.user?.last_name?.[0]}
                            </div>
                            <div>
                                <p className="font-semibold text-lg leading-none">
                                    {order.user ? `${order.user.first_name} ${order.user.last_name}` : "Guest Customer"}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">ID: #{order.user?.id || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Email:</span>
                                <a href={`mailto:${order.user?.email}`} className="text-primary hover:underline">{order.user?.email || 'N/A'}</a>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Phone:</span>
                                <span>{order.user?.mobile || 'N/A'}</span>
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
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">Shipping Address</Badge>
                            </div>
                            {shippingAddress ? (
                                <div className="space-y-1.5 text-sm">
                                    <p className="font-bold text-base">{shippingAddress.name}</p>
                                    <p className="text-muted-foreground">{shippingAddress.company_name}</p>
                                    <p className="text-muted-foreground">{shippingAddress.street_address}</p>
                                    {shippingAddress.apartment && <p className="text-muted-foreground">{shippingAddress.apartment}</p>}
                                    <p className="font-medium">{shippingAddress.state?.name}</p>
                                    <div className="pt-2">
                                        <p className="text-xs text-muted-foreground">Phone: {shippingAddress.country_code} {shippingAddress.phone}</p>
                                        <p className="text-xs text-muted-foreground">Email: {shippingAddress.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No shipping address provided</p>
                            )}
                        </div>

                        <Separator className="md:hidden" />

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">Billing Address</Badge>
                            </div>
                            {billingAddress ? (
                                <div className="space-y-1.5 text-sm">
                                    <p className="font-bold text-base">{billingAddress.name}</p>
                                    <p className="text-muted-foreground">{billingAddress.company_name}</p>
                                    <p className="text-muted-foreground">{billingAddress.street_address}</p>
                                    {billingAddress.apartment && <p className="text-muted-foreground">{billingAddress.apartment}</p>}
                                    <p className="font-medium">{billingAddress.state?.name}</p>
                                    <div className="pt-2">
                                        <p className="text-xs text-muted-foreground">Phone: {billingAddress.country_code} {billingAddress.phone}</p>
                                        <p className="text-xs text-muted-foreground">Email: {billingAddress.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No billing address provided</p>
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
                                    <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded border bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                    {item.variant?.media_path || item.product?.media_path ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_IMAGE_URL}/${item.variant?.media_path || item.product?.media_path}` || item.product?.media_path}
                                                            alt={item.product?.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-8 w-8 text-muted/20" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-primary">{item.product?.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.variant?.sku || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-medium">{item.variant?.title}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground font-medium">
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">₹{parseFloat(item.price).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-red-500">-₹{parseFloat(item.discount_amount).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-bold">
                                            ₹{(parseFloat(item.price) * item.quantity - parseFloat(item.discount_amount)).toLocaleString()}
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
                            <span className="font-medium">₹{parseFloat(order.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax Total</span>
                            <span className="font-medium">₹{parseFloat(order.tax_total).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount Total</span>
                            <span className="text-red-500 font-medium">-₹{parseFloat(order.discount_total || '0').toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-base font-bold text-primary">Grand Total</span>
                            <span className="text-2xl font-black text-primary">₹{parseFloat(order.grand_total).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
