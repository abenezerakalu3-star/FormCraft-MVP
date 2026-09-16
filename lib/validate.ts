import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["text", "textarea", "email", "number", "select", "radio", "checkbox", "date", "file"]),
  label: z.string().min(1, "Label is required").max(200),
  required: z.boolean().default(false),
  options: z.string().max(2000).default(""),
});

export const formFieldsSchema = z.object({
  fields: z.array(formFieldSchema).max(50),
});

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  fields: z.array(formFieldSchema).max(50).optional(),
});

export const updateFormSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  published: z.boolean().optional(),
  notifyOnSubmission: z.boolean().optional(),
});

export const submissionSchema = z.object({
  slug: z.string().min(1),
  data: z.record(z.string(), z.string()),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().max(200).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required").max(50000),
  published: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Invalid email").max(200),
  subject: z.string().max(150),
  message: z.string().min(1, "Message is required").max(4000),
});

export const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Invalid email").max(200),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  permissions: z.array(z.string()).min(1, "Pick at least one authority"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Invalid email").max(200),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").max(200),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});