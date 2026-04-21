import { apiCall } from "@/utils/apiUtils";

export type MailerType = "auth" | "enquiries" | "newsletter" | "orders";

export interface MailerSetting {
  id: number;
  type: MailerType;
  to_email: string;
  cc_emails: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MailerSettingsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: MailerSetting[];
}

export interface MailerSettingUpdateResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: MailerSetting;
}

export const fetchMailerSettings = (): Promise<MailerSettingsResponse> =>
  apiCall("/sitesettings/mailer-settings");

export const updateMailerSetting = (
  type: MailerType,
  data: { to_email: string; cc_emails?: string | null }
): Promise<MailerSettingUpdateResponse> =>
  apiCall(`/sitesettings/mailer-settings/${type}`, {
    method: "PUT",
    data,
  });
