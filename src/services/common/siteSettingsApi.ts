import { apiCall } from "@/utils/apiUtils";

export interface HeaderFooterSettings {
  id?: number;

  header_logo_media_path: string | null;
  footer_logo_media_path: string | null;

  header_media_alt: string;
  header_media_alt_ar: string;

  footer_media_alt: string;
  footer_media_alt_ar: string;

  address: string;
  address_ar: string;

  sale_enquiry_title: string;
  sale_enquiry_title_ar: string;
  sale_enquiry_email: string;
  sales_phone_number: string;

  phone_number: string;
  email: string;

  support_enquiry_title: string;
  support_enquiry_title_ar: string;
  support_email: string;


  news_letter_main_title: string;
  news_letter_main_title_ar: string;

  news_letter_title: string;
  news_letter_title_ar: string;

  po_box_number: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface HeaderFooterResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: HeaderFooterSettings;
}

export interface SaveHeaderFooterData {
  header_logo_media_path?: File | string | null;
  footer_logo_media_path?: File | string | null;

  header_media_alt: string;
  header_media_alt_ar: string;

  footer_media_alt: string;
  footer_media_alt_ar: string;

  address: string;
  address_ar: string;

  sale_enquiry_title: string;
  sale_enquiry_title_ar: string;
  sale_enquiry_email: string;

  phone_number: string;

  support_enquiry_title: string;
  support_enquiry_title_ar: string;
  support_email: string;

  news_letter_main_title: string;
  news_letter_main_title_ar: string;

  news_letter_title: string;
  news_letter_title_ar: string;

  po_box_number: string;
}
export const fetchHeaderFooterSettings =
  async (): Promise<HeaderFooterResponse> => {
    return apiCall('/sitesettings/header-footer');
  };


export const saveHeaderFooterSettings = async (
  formData: FormData
): Promise<HeaderFooterSettings> => {
  return apiCall('/sitesettings/header-footer', {
    method: 'POST',
    data: formData,
  });
};




