import { z } from "zod";

export const mailerTabSchema = z.object({
  to_email: z
    .string()
    .min(1, "Recipient email is required")
    .email("Must be a valid email address"),
  cc_emails: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const emails = val.split(",").map((e) => e.trim());
        return emails.every((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
      },
      { message: "CC must be a valid comma-separated list of email addresses" }
    ),
});

export type MailerTabFormData = z.infer<typeof mailerTabSchema>;
