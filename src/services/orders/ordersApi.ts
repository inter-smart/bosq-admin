import { apiCall } from '@/utils/apiUtils';

export interface Order {
    id: number;
    order_id: string;
    user_id: number | null;
    status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    payment_status: 'pending' | 'paid' | 'failed';
    payment_type: 'cod' | 'online';
    subtotal: string;
    discount_total: string;
    tax_total: string;
    grand_total: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        mobile: string;
    };
}

export interface OrdersResponse {
    success: boolean;
    message: string;
    timestamp: string;
    statusCode: number;
    data: {
        list: Order[];
        pagination: {
            totalCount: number;
            totalPages: number;
            currentPage: number;
            limit: number;
            isSearchApplied: boolean;
        };
    };
}

export interface OrderResponse {
    success: boolean;
    message: string;
    timestamp: string;
    statusCode: number;
    data: Order;
}

// Fetch all orders
export const fetchOrders = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<OrdersResponse> => {
    const params: Record<string, string | number> = {
        page,
        limit,
    };

    if (search) {
        params.search = search;
        params.limit = 100000;
    }

    return apiCall('/orders', { params });
};

// Fetch single order
export const fetchOrderById = async (id: number): Promise<OrderResponse> => {
    return apiCall(`/orders/${id}`);
};
