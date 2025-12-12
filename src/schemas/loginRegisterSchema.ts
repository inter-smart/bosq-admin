import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const loginRegisterCmsSchema = z.object({
  // Signup Section
  signup_title: commonValidations.requiredString("Signup Title"),
  signup_title_ar: commonValidations.requiredText("Signup Title (Arabic)"),
  signup_subtitle: commonValidations.requiredText("Signup Subtitle"),
  signup_subtitle_ar: commonValidations.requiredText("Signup Subtitle (Arabic)"),
  signup_media_path: commonValidations.validateFileUpload("Signup Media"),

  // OTP Section
  otp_title: commonValidations.requiredString("OTP Title"),
  otp_title_ar: commonValidations.requiredText("OTP Title (Arabic)"),
  otp_subtitle: commonValidations.requiredText("OTP Subtitle"),
  otp_subtitle_ar: commonValidations.requiredText("OTP Subtitle (Arabic)"),
  otp_media_path: commonValidations.validateFileUpload("OTP Media"),

  // Your Password Section
  your_password_title: commonValidations.requiredString("Your Password Title"),
  your_password_title_ar: commonValidations.requiredText(
    "Your Password Title (Arabic)"
  ),
  your_password_subtitle: commonValidations.requiredText(
    "Your Password Subtitle"
  ),
  your_password_subtitle_ar: commonValidations.requiredText(
    "Your Password Subtitle (Arabic)"
  ),
  your_password_media_path: commonValidations.validateFileUpload(
    "Your Password Media"
  ),

  // Login Section
  login_title: commonValidations.requiredString("Login Title"),
  login_title_ar: commonValidations.requiredText("Login Title (Arabic)"),
  login_subtitle: commonValidations.requiredText("Login Subtitle"),
  login_subtitle_ar: commonValidations.requiredText("Login Subtitle (Arabic)"),
  login_media_path: commonValidations.validateFileUpload("Login Media"),

  // Recover Email Section
  recover_email_title: commonValidations.requiredString("Recover Email Title"),
  recover_email_title_ar: commonValidations.requiredText(
    "Recover Email Title (Arabic)"
  ),
  recover_email_subtitle: commonValidations.requiredText(
    "Recover Email Subtitle"
  ),
  recover_email_subtitle_ar: commonValidations.requiredText(
    "Recover Email Subtitle (Arabic)"
  ),
  recover_email_media_path: commonValidations.validateFileUpload(
    "Recover Email Media"
  ),

  // Recover Password Section
  recover_password_title: commonValidations.requiredString(
    "Recover Password Title"
  ),
  recover_password_title_ar: commonValidations.requiredText(
    "Recover Password Title (Arabic)"
  ),
  recover_password_subtitle: commonValidations.requiredText(
    "Recover Password Subtitle"
  ),
  recover_password_subtitle_ar: commonValidations.requiredText(
    "Recover Password Subtitle (Arabic)"
  ),
  recover_password_media_path: commonValidations.validateFileUpload(
    "Recover Password Media"
  ),

  // New Password Section
  new_password_title: commonValidations.requiredString("New Password Title"),
  new_password_title_ar: commonValidations.requiredText(
    "New Password Title (Arabic)"
  ),
  new_password_media_path: commonValidations.validateFileUpload(
    "New Password Media"
  ),
});

export type LoginRegisterCmsFormData = z.infer<typeof loginRegisterCmsSchema>;
