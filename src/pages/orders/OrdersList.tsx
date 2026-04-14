import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Eye, Edit } from "lucide-react";
import {
    fetchOrders,
    Order,
    updateOrder,
} from "@/services/orders/ordersApi";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, formatDateForExcel } from "@/utils/exportUtils";

export default function OrdersList() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [pageSize, setPageSize] = useState(10);

    // Edit states
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editForm, setEditForm] = useState({
        est_delivery_details: "",
        awb_number: "",
        order_url: "",
        partner_name: "",
    });
    const [updating, setUpdating] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 600);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch orders
    useEffect(() => {
        loadOrders();
    }, [currentPage, pageSize, debouncedSearchQuery]);

    const loadOrders = async () => {
        try {
            if (debouncedSearchQuery) {
                setSearching(true);
            } else {
                setLoading(true);
            }

            const response = await fetchOrders(
                currentPage,
                pageSize,
                debouncedSearchQuery
            );

            if (response.success) {
                setOrders(response.data.list);
                setTotalCount(response.data.pagination.totalCount);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load orders",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const handleEditClick = (order: Order) => {
        setSelectedOrder(order);
        setEditForm({
            est_delivery_details: order.est_delivery_details || "",
            awb_number: order.awb_number || "",
            order_url: order.order_url || "",
            partner_name: order.partner_name || "",
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;
        try {
            setUpdating(true);
            const response = await updateOrder(selectedOrder.id, editForm);
            if (response.success) {
                toast({
                    title: "Success",
                    description: "Order details updated successfully",
                });
                setIsEditDialogOpen(false);
                loadOrders(); // Refresh the list
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update order details",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleExport = async (type: "csv" | "excel" | "pdf", selectedRows?: Order[]) => {
        if (type !== "excel") return;

        try {
            let dataToExport = selectedRows;

            if (!dataToExport || dataToExport.length === 0) {
                const response = await fetchOrders(1, 100000, debouncedSearchQuery);
                if (response.success) {
                    dataToExport = response.data.list;
                } else {
                    throw new Error("Failed to fetch data for export");
                }
            }

            const formattedData = dataToExport.map((item, index) => ({
                "S.No": index + 1,
                "Order ID": item.order_id,
                "Name": item.user ? `${item.user.name}` : "Guest",
                "Email": item.user?.email || "-",
                "Phone": item.user?.mobile || "-",
                "Status": item.status,
                "Payment Status": item.payment_status,
                "Grand Total": `₹${item.grand_total}`,
                "Ordered At": formatDateForExcel(item.createdAt),
            }));

            const dateStr = new Date().toISOString().split('T')[0];

            const columnWidths = [
                { wch: 10 }, // S.No
                { wch: 20 }, // Order ID
                { wch: 25 }, // Name
                { wch: 35 }, // Email
                { wch: 20 }, // Phone
                { wch: 15 }, // Status
                { wch: 15 }, // Payment Status
                { wch: 15 }, // Grand Total
                { wch: 25 }, // Ordered At
            ];

            exportToExcel(formattedData, `orders_${dateStr}`, 'Orders', columnWidths);

            toast({
                title: "Success",
                description: "Excel file exported successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to export data",
                variant: "destructive",
            });
        }
    };

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: "order_id",
            header: "Order ID",
            cell: ({ row }) => (
                <div className="font-mono text-sm font-medium">
                    {row.getValue("order_id")}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const user = row.original.user;
                return (
                    <span className="font-medium">
                        {user ? `${user?.name}` : "Guest"}
                    </span>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => {
                const user = row.original.user;
                return (
                    <span className="text-sm">
                        {user?.email || "-"}
                    </span>
                );
            },
        },
        {
            accessorKey: "mobile",
            header: "Phone",
            cell: ({ row }) => {
                const user = row.original.user;
                return (
                    <span className="text-sm">
                        {user?.mobile || "-"}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const colors: Record<string, string> = {
                    pending: "bg-yellow-100 text-yellow-800",
                    confirmed: "bg-blue-100 text-blue-800",
                    packed: "bg-purple-100 text-purple-800",
                    shipped: "bg-indigo-100 text-indigo-800",
                    delivered: "bg-green-100 text-green-800",
                    cancelled: "bg-red-100 text-red-800",
                    returned: "bg-gray-100 text-gray-800",
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => navigate(`/orders/${item.id}`)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleEditClick(item)}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Manage Order Settings
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={orders}
                loading={loading}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searching={searching}
                pagination={{
                    currentPage,
                    pageSize,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                }}
                // onExport={handleExport}
                title="Orders"
                searchPlaceholder="Search order ID, name..."
            />

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[825px]">
                    <DialogHeader>
                        <DialogTitle>Edit Shipping Details - #{selectedOrder?.order_id}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="est_delivery_details">Delivery Details</Label>
                            <Input
                                id="est_delivery_details"
                                value={editForm.est_delivery_details}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        est_delivery_details: e.target.value,
                                    })
                                }
                                placeholder="e.g. 3-5 business days"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="partner_name">Courier Partner</Label>
                            <Input
                                id="partner_name"
                                value={editForm.partner_name}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        partner_name: e.target.value,
                                    })
                                }
                                placeholder="e.g. Aramex, DHL"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="awb_number">AWB Number</Label>
                            <Input
                                id="awb_number"
                                value={editForm.awb_number}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        awb_number: e.target.value,
                                    })
                                }
                                placeholder="Tracking number"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="order_url">Tracking URL</Label>
                            <Input
                                id="order_url"
                                value={editForm.order_url}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        order_url: e.target.value,
                                    })
                                }
                                placeholder="https://tracking-link.com/..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateOrder} disabled={updating}>
                            {updating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
