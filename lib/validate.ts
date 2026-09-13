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
  type: z.enum(["text", "textarea", "email", "number", "select", "radio", "checkbox", "date"]),
  label: z.string().min(1, "Label is required").max(200),
  required: z.boolean().default(false),
  options: z.string().max(2000).default(""),
});

export const formFieldsSchema = z.object({
  fields: z.array(formFieldSchema).max(50),
});

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
});

export const updateFormSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  published: z.boolean().optional(),
});

export const submissionSchema = z.object({
  slug: z.string().min(1),
  data: z.record(z.string(), z.string()),
});