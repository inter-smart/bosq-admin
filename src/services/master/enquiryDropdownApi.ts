import { apiCall } from "@/utils/apiUtils";

export interface EnquiryDropdown {
    id?: number;
    title: string;
    title_ar?: string;
    sort_order: number;
    status: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface EnquiryDropdownListResponse {
    success: boolean;
    message: string;
    data: {
        list: EnquiryDropdown[];
        pagination: {
            totalCount: number;
            totalPages: number;
            currentPage: number;
            pageSize: number;
        };
    };
}

export interface EnquiryDropdownSingleResponse {
    success: boolean;
    message: string;
    data: EnquiryDropdown;
}

export const fetchEnquiryDropdownList = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<EnquiryDropdownListResponse> => {
    const params: Record<string, string | number> = {
        page,
        limit,
    };
    if (search) params.search = search;

    return apiCall("/master/enquiry-dropdown", { params });
};

export const fetchEnquiryDropdownById = async (id: number): Promise<EnquiryDropdownSingleResponse> => {
    return apiCall(`/master/enquiry-dropdown/${id}`);
};

export const createEnquiryDropdown = async (data: any): Promise<EnquiryDropdownSingleResponse> => {
    return apiCall("/master/enquiry-dropdown", {
        method: "POST",
        data,
    });
};

export const updateEnquiryDropdown = async (id: number, data: any): Promise<EnquiryDropdownSingleResponse> => {
    return apiCall(`/master/enquiry-dropdown/${id}`, {
        method: "PUT",
        data,
    });
};

export const deleteEnquiryDropdown = async (id: number): Promise<void> => {
    return apiCall(`/master/enquiry-dropdown/${id}`, {
        method: "DELETE",
    });
};
