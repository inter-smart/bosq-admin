import { apiCall } from "@/utils/apiUtils";

export interface AttributeValue {
  id?: number;
  value: string;
  value_ar: string;
  attribute_id: number;
  sort_order?: number;
  status?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttributeValueResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: AttributeValue[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
      searchTerm: string | null;
    };
  };
}

export interface AttributeValueItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: AttributeValue;
}

// Fetch all attribute values for an attribute
export const fetchAttributeValueList = async (
  attributeId: number,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<AttributeValueResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    attribute_id: attributeId,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/resources/attribute-values", { params });
};

// Fetch single attribute value
export const fetchAttributeValueById = async (id: number): Promise<AttributeValueItemResponse> => {
  return apiCall(`/resources/attribute-values/${id}`);
};

// Create attribute value
export const createAttributeValue = async (
  formData: FormData
): Promise<AttributeValueItemResponse> => {
  return apiCall("/resources/attribute-values", {
    method: "POST",
    data: formData,
  });
};

// Update attribute value
export const updateAttributeValue = async (
  id: number,
  formData: FormData
): Promise<AttributeValueItemResponse> => {
  return apiCall(`/resources/attribute-values/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete attribute value
export const deleteAttributeValue = async (id: number): Promise<void> => {
  return apiCall(`/resources/attribute-values/${id}`, {
    method: "DELETE",
  });
};
