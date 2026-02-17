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
import { MoreHorizontal, Eye } from "lucide-react";
import {
    fetchOrders,
    Order,
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
                "User": item.user ? `${item.user.first_name} ${item.user.last_name}` : "Guest",
                "Email": item.user?.email || "-",
                "Grand Total": `₹${item.grand_total}`,
                "Status": item.status,
                "Payment Status": item.payment_status,
                "Ordered At": formatDateForExcel(item.createdAt),
            }));

            const dateStr = new Date().toISOString().split('T')[0];

            const columnWidths = [
                { wch: 10 }, // S.No
                { wch: 20 }, // Order ID
                { wch: 25 }, // User
                { wch: 35 }, // Email
                { wch: 15 }, // Grand Total
                { wch: 15 }, // Status
                { wch: 15 }, // Payment Status
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
            accessorKey: "user",
            header: "User",
            cell: ({ row }) => {
                const user = row.original.user;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {user ? `${user.first_name} ${user.last_name}` : "Guest"}
                        </span>
                        {user && (
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {user.email}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "grand_total",
            header: "Grand Total",
            cell: ({ row }) => (
                <div className="font-medium">
                    ₹{row.getValue("grand_total")}
                </div>
            ),
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
            accessorKey: "payment_status",
            header: "Payment",
            cell: ({ row }) => {
                const status = row.getValue("payment_status") as string;
                const colors: Record<string, string> = {
                    pending: "bg-yellow-100 text-yellow-800",
                    paid: "bg-green-100 text-green-800",
                    failed: "bg-red-100 text-red-800",
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Ordered At",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                    })}{" "}
                    {new Date(row.getValue("createdAt")).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            ),
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
                onExport={handleExport}
                title="Orders"
                searchPlaceholder="Search order ID, status..."
            />
        </>
    );
}
