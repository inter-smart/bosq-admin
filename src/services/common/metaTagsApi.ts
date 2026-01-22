import { apiCall } from "@/utils/apiUtils";

export interface MetaTag {
  id: number;
  page: string;
  meta_title: string;
  meta_title_ar?: string;
  meta_description: string;
  meta_description_ar?: string;
  meta_keywords: string;
  meta_keywords_ar?: string;
  other_meta?: string;
  other_meta_ar?: string;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetaTagsListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: MetaTag[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface MetaTagItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: MetaTag;
}

export interface CreateMetaTagData {
  page: string;
  meta_title: string;
  meta_title_ar?: string;
  meta_description: string;
  meta_description_ar?: string;
  meta_keywords: string;
  meta_keywords_ar?: string;
  other_meta?: string;
  other_meta_ar?: string;
  status?: boolean;
}

export interface UpdateMetaTagRequest {
  meta_title: string;
  meta_title_ar: string;
  meta_description: string;
  meta_description_ar: string;
  meta_keywords: string;
  meta_keywords_ar: string;
  other_meta?: string;
  other_meta_ar?: string;
}





export const fetchMetaTagsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<MetaTagsListResponse> => {
  const params: Record<string, string | number> = { page, limit };

  if (search) {
    params.search = search;
  }

  return apiCall("/sitesettings/meta-tags", { params });
};


export const fetchMetaTagById = async (
  id: number
): Promise<MetaTagItemResponse> => {
  return apiCall(`/sitesettings/meta-tags/${id}`);
};


export const updateMetaTag = async (
  id: number,
  payload: Partial<UpdateMetaTagRequest>
): Promise<MetaTagItemResponse> => {

  return apiCall(`/sitesettings/meta-tags/${id}`, {
    method: "PUT",
    data: payload,
  });
};



