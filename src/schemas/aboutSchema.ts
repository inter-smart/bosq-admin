import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const aboutCmsSchema = z.object({
  // Optional title field
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  // Banner Section
  banner_media_type: commonValidations.requiredString("Banner Media Type"),
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredString("Banner Title (Arabic)"),
  banner_description: commonValidations.requiredText("Banner Description"),
  banner_description_ar: commonValidations.requiredString("Banner Description (Arabic)"),
  banner_media_desktop_path: commonValidations.validateFileUpload("Banner Desktop Media"),
  banner_media_mobile_path: z.union([
    z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, { message: "Max 5MB allowed" }),
    z.string().min(1),
    z.null(),
    z.undefined(),
  ]),
  banner_media_desktop_path_ar: z.union([
    z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, { message: "Max 5MB allowed" }),
    z.string().min(1),
    z.null(),
    z.undefined(),
  ]),
  banner_media_mobile_path_ar: z.union([
    z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, { message: "Max 5MB allowed" }),
    z.string().min(1),
    z.null(),
    z.undefined(),
  ]),
  banner_video_thumbnail_path: z.union([
    z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, { message: "Max 5MB allowed" }),
    z.string().min(1),
    z.null(),
    z.undefined(),
  ]),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString("Banner Media Alt Text (Arabic)"),
  banner_button_text: commonValidations.requiredString("Banner Button Text"),
  banner_button_text_ar: commonValidations.requiredString("Banner Button Text (Arabic)"),
  banner_button_link: commonValidations.requiredUrl("Banner Button Link"),

  // Journey Section
  journey_title: commonValidations.requiredString("Journey Title"),
  journey_title_ar: commonValidations.requiredString("Journey Title (Arabic)"),
  journey_description: commonValidations.requiredText("Journey Description"),
  journey_description_ar: commonValidations.requiredString("Journey Description (Arabic)"),
  journey_one_media_path: commonValidations.validateFileUpload("Journey Image 1"),
  journey_two_media_path: commonValidations.validateFileUpload("Journey Image 2"),
  journey_three_media_path: commonValidations.validateFileUpload("Journey Image 3"),
  journey_one_media_alt: commonValidations.requiredString("Journey Image 1 Alt Text"),
  journey_one_media_alt_ar: commonValidations.requiredString("Journey Image 1 Alt Text (Arabic)"),
  journey_two_media_alt: commonValidations.requiredString("Journey Image 2 Alt Text"),
  journey_two_media_alt_ar: commonValidations.requiredString("Journey Image 2 Alt Text (Arabic)"),
  journey_three_media_alt: commonValidations.requiredString("Journey Image 3 Alt Text"),
  journey_three_media_alt_ar: commonValidations.requiredString("Journey Image 3 Alt Text (Arabic)"),

  // Why Choose Us Section
  why_choose_us_title: commonValidations.requiredString("Why Choose Us Title"),
  why_choose_us_title_ar: commonValidations.requiredString("Why Choose Us Title (Arabic)"),
  why_choose_us_description: commonValidations.requiredText("Why Choose Us Description"),
  why_choose_us_description_ar: commonValidations.requiredString("Why Choose Us Description (Arabic)"),

  // Testimonial Section
  testimonial_title: commonValidations.requiredString("Testimonial Title"),
  testimonial_title_ar: commonValidations.requiredString("Testimonial Title (Arabic)"),

  // Client Section
  client_title: commonValidations.requiredString("Client Title"),
  client_title_ar: commonValidations.requiredString("Client Title (Arabic)"),

  // News Section
  news_title: commonValidations.requiredString("News Title"),
  news_title_ar: commonValidations.requiredString("News Title (Arabic)"),
}).superRefine((data, ctx) => {
  if (data.banner_media_type !== "video") {
    const mobileVal = data.banner_media_mobile_path;
    if (!(mobileVal instanceof File) && !(typeof mobileVal === "string" && mobileVal.length > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Banner Mobile Media is required. Please upload Banner Mobile Media.",
        path: ["banner_media_mobile_path"],
      });
    }
    const mobileArVal = data.banner_media_mobile_path_ar;
    if (!(mobileArVal instanceof File) && !(typeof mobileArVal === "string" && mobileArVal.length > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Banner Mobile Media (Arabic) is required. Please upload Banner Mobile Media (Arabic).",
        path: ["banner_media_mobile_path_ar"],
      });
    }
    const desktopArVal = data.banner_media_desktop_path_ar;
    if (!(desktopArVal instanceof File) && !(typeof desktopArVal === "string" && desktopArVal.length > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Banner Desktop Media (Arabic) is required. Please upload Banner Desktop Media (Arabic).",
        path: ["banner_media_desktop_path_ar"],
      });
    }
  } else {
    const thumbnailVal = data.banner_video_thumbnail_path;
    if (
      !(thumbnailVal instanceof File) &&
      !(typeof thumbnailVal === "string" && thumbnailVal.length > 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Banner Video Thumbnail is required. Please upload Banner Video Thumbnail.",
        path: ["banner_video_thumbnail_path"],
      });
    }
  }
});

export type AboutCmsFormData = z.infer<typeof aboutCmsSchema>;

export const aboutTestimonialsSchema = z.object({
  title: commonValidations.optionalString("Title"),
  title_ar: commonValidations.optionalString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  name: commonValidations.requiredString("Name"),
  name_ar: commonValidations.requiredString("Name (Arabic)"),
  designation: commonValidations.optionalString("Designation"),
  designation_ar: commonValidations.optionalString("Designation (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});


export const aboutJourneysSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});


export const aboutClientsSchema = z.object({
  media_path: commonValidations.validateFileUpload("Client Image"),
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export const whyBosqSchema = z.object({
  media_path: commonValidations.validateFileUpload("Main Media"),
  media_alt: commonValidations.requiredString("Main Media Alt Text"),
  media_alt_ar: commonValidations.requiredString("Main Media Alt Text (Arabic)"),
  icon_media_path: commonValidations.validateFileUpload("Icon Media"),
  icon_media_alt: commonValidations.requiredString("Icon Alt Text"),
  icon_media_alt_ar: commonValidations.requiredString("Icon Alt Text (Arabic)"),
  title: commonValidations.requiredString("Title"),
  subtitle: commonValidations.requiredString("Subtitle"),
  description: commonValidations.requiredText("Description"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  subtitle_ar: commonValidations.requiredString("Subtitle (Arabic)"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type AboutJourneysFormData = z.infer<typeof aboutJourneysSchema>;

export type AboutTestimonialsFormData = z.infer<typeof aboutTestimonialsSchema>;

export type AboutClientsFormData = z.infer<typeof aboutClientsSchema>;

export type WhyBosqFormData = z.infer<typeof whyBosqSchema>;