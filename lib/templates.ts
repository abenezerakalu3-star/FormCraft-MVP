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
];