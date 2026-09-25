import { newFieldId } from "@/lib/fields";

export interface StarterField {
  id: string;
  type: "text" | "textarea" | "email" | "number" | "select" | "radio" | "checkbox" | "date" | "file";
  label: string;
  required: boolean;
  options: string;
}

export interface FormTemplate {
  key: string;
  label: string;
  title: string;
  description: string;
  fields: StarterField[];
}

function f(
  type: StarterField["type"],
  label: string,
  required = false,
  options = ""
): StarterField {
  return { id: newFieldId(), type, label, required, options };
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    key: "customer-feedback",
    label: "Customer feedback",
    title: "Customer Feedback",
    description: "A quick satisfaction survey with a rating and open comments.",
    fields: [
      f("text", "Your name"),
      f("email", "Your email", false),
      f("radio", "How satisfied are you?", true, "Very satisfied\nSatisfied\nNeutral\nDissatisfied"),
      f("textarea", "What could we improve?", false),
    ],
  },
  {
    key: "job-application",
    label: "Job application",
    title: "Job Application",
    description: "Capture the essentials from interested candidates.",
    fields: [
      f("text", "Full name", true),
      f("email", "Email address", true),
      f("text", "LinkedIn or portfolio URL", false),
      f("textarea", "Tell us about yourself", true),
      f("file", "Upload your resume"),
    ],
  },
  {
    key: "registration",
    label: "Registration",
    title: "Registration",
    description: "Standard event or workshop signup.",
    fields: [
      f("text", "Full name", true),
      f("email", "Email address", true),
      f("select", "How did you hear about us?", false, "Social media\nSearch engine\nFriend or colleague\nOther"),
    ],
  },
  {
    key: "quiz",
    label: "Quiz",
    title: "Quiz",
    description: "Multiple-choice questions with a mix of single and multi answers.",
    fields: [
      f("text", "Your name", false),
      f("radio", "Question 1 — pick one", true, "Option A\nOption B\nOption C"),
      f("checkbox", "Question 2 — select all that apply", false, "Option A\nOption B\nOption C"),
    ],
  },
  {
    key: "survey",
    label: "Survey",
    title: "Survey",
    description: "General purpose opinions with ratings and open answers.",
    fields: [
      f("radio", "How likely are you to recommend us? (1–10)", true, "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"),
      f("textarea", "Anything else you'd like to share?", false),
    ],
  },
  {
    key: "contact-form",
    label: "Contact form",
    title: "Contact Us",
    description: "A simple way for visitors to reach your team.",
    fields: [
      f("text", "Your name", true),
      f("email", "Your email", true),
      f("text", "Subject", true),
      f("textarea", "Message", true),
    ],
  },
  {
    key: "lead-generation",
    label: "Lead generation",
    title: "Lead Generation",
    description: "Capture high-quality leads from your website or landing pages.",
    fields: [
      f("text", "Full name", true),
      f("email", "Work email", true),
      f("text", "Company name", true),
      f("select", "Company size", false, "1-10\\n11-50\\n51-200\\n201-500\\n500+"),
      f("textarea", "What are you looking to achieve?", false),
    ],
  },
  {
    key: "event-rsvp",
    label: "Event RSVP",
    title: "Event RSVP",
    description: "Collect attendance and dietary preferences for your next event.",
    fields: [
      f("text", "First and last name", true),
      f("email", "Email address", true),
      f("radio", "Will you be attending?", true, "Yes, I'll be there\\nNo, I can't make it"),
      f("number", "Number of guests (including yourself)", true),
      f("checkbox", "Dietary restrictions", false, "Vegetarian\\nVegan\\nGluten-Free\\nNut Allergy\\nNone"),
    ],
  },
  {
    key: "it-support-ticket",
    label: "IT support ticket",
    title: "IT Support Ticket",
    description: "Streamline technical issues from your team or customers.",
    fields: [
      f("text", "Your name", true),
      f("email", "Your email", true),
      f("select", "Issue category", true, "Hardware\\nSoftware\\nNetwork/Internet\\nAccess/Permissions\\nOther"),
      f("select", "Priority level", true, "Low\\nMedium\\nHigh\\nUrgent (Work completely blocked)"),
      f("textarea", "Describe the issue in detail", true),
      f("file", "Upload screenshot (optional)", false),
    ],
  },
  {
    key: "maintenance-request",
    label: "Maintenance request",
    title: "Maintenance Request",
    description: "Allow tenants to easily report issues and request repairs.",
    fields: [
      f("text", "Tenant name", true),
      f("text", "Apartment / Unit number", true),
      f("text", "Phone number", true),
      f("select", "Type of issue", true, "Plumbing\\nElectrical\\nHVAC / Heating\\nAppliances\\nStructural\\nOther"),
      f("textarea", "Detailed description of the problem", true),
      f("radio", "Permission to enter if you are not home?", true, "Yes, maintenance can enter\\nNo, please call to schedule"),
      f("file", "Upload photo of the issue", false),
    ],
  },
  {
    key: "product-order",
    label: "Product order",
    title: "Product Order Form",
    description: "Accept custom orders for your products or services.",
    fields: [
      f("text", "Full name", true),
      f("email", "Email address", true),
      f("text", "Shipping address", true),
      f("select", "Select product", true, "Basic Package ($49)\\nPro Package ($99)\\nEnterprise Package ($199)"),
      f("number", "Quantity", true),
      f("textarea", "Special instructions or customizations", false),
    ],
  },
  {
    key: "employee-onboarding",
    label: "Employee onboarding",
    title: "Employee Onboarding",
    description: "Collect necessary information from new hires before their first day.",
    fields: [
      f("text", "Full legal name", true),
      f("email", "Personal email address", true),
      f("text", "Phone number", true),
      f("date", "Date of birth", true),
      f("text", "Emergency contact name", true),
      f("text", "Emergency contact phone", true),
      f("textarea", "Do you have any special equipment requests?", false),
    ],
  },
];