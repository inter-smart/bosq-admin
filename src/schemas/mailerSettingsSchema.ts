import { z } from "zod";

const strictEmailField = z
  .string()
  .min(1, "From email is required")
  .email("Must be a valid email address")
  .refine((val) => val === val.trim(), "No leading or trailing spaces allowed")
  .refine((val) => !/\s/.test(val), "Email must not contain spaces");

export const mailerTabSchema = z.object({
  to_email: strictEmailField,
  cc_emails: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        if (val !== val.trim()) return false;
        const parts = val.split(",");
        return parts.every((part) => {
          if (part !== part.trim()) return false;
          if (part === "") return false;
          if (/\s/.test(part)) return false;
          return z.string().email().safeParse(part).success;
        });
      },
      { message: "CC must be valid emails separated by commas, with no extra spaces or empty entries" }
    ),
});

export type MailerTabFormData = z.infer<typeof mailerTabSchema>;
