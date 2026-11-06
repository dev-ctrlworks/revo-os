import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email.")
  .email("Enter a valid email address.")
  .max(254);

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(200);

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password.").max(200),
});

export const signUpSchema = z.object({
  displayName: z.string().trim().max(80).optional().default(""),
  email: emailSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  displayName: z.string().trim().max(80),
});

export const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE", { message: "Type DELETE to confirm." }),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
