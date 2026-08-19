import { apiCall } from "@/utils/apiUtils";

export interface StatusUpdatePayload {
  model_name: string;
  row_id?: number;
  status: boolean | string | number;
}

export interface SortOrderUpdatePayload {
  model_name: string;
  row_id?: number;
  sort_order: number;
}

export interface IsPrimaryUpdatePayload {
  model_name: string;
  row_id?: number;
  is_primary: boolean;
}

export interface ShowInFooterUpdatePayload {
  model_name: string;
  row_id?: number;
  show_in_footer: boolean;
}

export interface CommonResponse<T = any> {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: T;
}

// 🔥 Update Status (common)
export const updateStatus = async (
  payload: StatusUpdatePayload
): Promise<CommonResponse> => {
  return apiCall(`/common-actions/status/${payload.model_name}/${payload.row_id}`, {
    method: "PUT",
    data: { status: payload.status },
  });
};


// 🔥 Update Sort Order (common)
export const updateSortOrder = async (
  payload: SortOrderUpdatePayload
): Promise<CommonResponse> => {
  return apiCall(`/common-actions/sort-order/${payload.model_name}/${payload.row_id}`, {
    method: "PUT",
    data: { sort_order: payload.sort_order },
  });
};

// 🔥 Update Is Primary (common)
export const updateIsPrimary = async (
  payload: IsPrimaryUpdatePayload
): Promise<CommonResponse> => {
  return apiCall(`/common-actions/is-primary/${payload.model_name}/${payload.row_id}`, {
    method: "PUT",
    data: { is_primary: payload.is_primary },
  });
};

// 🔥 Update Show In Footer (common)
export const updateShowInFooter = async (
  payload: ShowInFooterUpdatePayload
): Promise<CommonResponse> => {
  return apiCall(`/common-actions/show-in-footer/${payload.model_name}/${payload.row_id}`, {
    method: "PUT",
    data: { show_in_footer: payload.show_in_footer },
  });
};
