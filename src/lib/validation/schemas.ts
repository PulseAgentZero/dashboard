import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(200, "Name is too long");

export const orgNameSchema = z
  .string()
  .trim()
  .min(1, "Company name is required")
  .max(200, "Company name is too long");

export const optionalNameSchema = z
  .string()
  .trim()
  .max(200, "Name is too long")
  .optional()
  .or(z.literal(""));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  org_name: orgNameSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export const acceptInviteSchema = z
  .object({
    full_name: nameSchema,
    password: passwordSchema,
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: passwordSchema,
    confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm, {
    message: "New passwords don't match",
    path: ["confirm"],
  });

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(200, "Name is too long"),
});

const teamRoles = ["admin", "manager", "analyst", "viewer"] as const;

export const inviteUserSchema = z.object({
  email: emailSchema,
  role: z.enum(teamRoles, { message: "Select a valid role" }),
});

export const businessContextSchema = z.object({
  industry: z.string().optional(),
  business_context: z
    .string()
    .trim()
    .min(1, "Business context is required")
    .max(5000, "Business context is too long"),
  entity_label: z.string().trim().max(100).optional(),
  goal_label: z.string().trim().max(100).optional(),
});

export const completeGoogleSignupSchema = z.object({
  org_name: orgNameSchema,
  full_name: optionalNameSchema,
});

export const linkGoogleAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
