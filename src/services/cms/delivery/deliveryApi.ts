import { apiCall } from '@/utils/apiUtils';

export interface DeliveryCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;

  // BANNER SECTION
  banner_title?: string | null;
  banner_title_ar?: string | null;
  banner_media_desktop_path?: string | null;
  banner_media_mobile_path?: string | null;
  banner_media_alt?: string | null;
  banner_media_alt_ar?: string | null;

  // DELIVERY TIME SECTION
  delivery_time_title?: string | null;
  delivery_time_title_ar?: string | null;
  delivery_time_subtitle?: string | null;
  delivery_time_subtitle_ar?: string | null;

  // DELIVERY MEDIA SECTION
  delivery_media_path?: string | null;
  delivery_media_alt?: string | null;
  delivery_media_alt_ar?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: DeliveryCms;
}

// Fetch Delivery CMS data
export const fetchDeliveryCms = async (): Promise<DeliveryCmsResponse> => {
  return apiCall('/cms/delivery/delivery-cms');
};

// Update Delivery CMS data
export const saveDeliveryCms = async (formData: FormData): Promise<DeliveryCmsResponse> => {
  return apiCall('/cms/delivery/delivery-cms', {
    method: 'POST',
    data: formData,
  });
};
