import { z } from "zod";

// Helper function to fetch valid email domains for the selected university
async function fetchUniversityEmailDomains(universityId) {
  const response = await fetch(`/api/universities/${universityId}`);
  const data = await response.json();
  return data.emailDomains || [];
}

export const studentValidationSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .max(100, "Full Name cannot exceed 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required")
    .max(100, "Email cannot exceed 100 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),

  university: z
    .string()
    .min(1, "University cannot be empty"),

  faculty: z
    .string()
    .min(1, "Faculty cannot be empty"),

  department: z
    .string()
    .min(1, "Department cannot be empty"),
}).superRefine(async (data, ctx) => {
  // Only check if university and email are present
  if (data.university && data.email) {
    const validDomains = await fetchUniversityEmailDomains(data.university);
    const emailDomain = data.email.split("@")[1];
    if (!validDomains.includes(emailDomain)) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: `Email domain does not match the selected university. Allowed domain(s): ${validDomains.map(d => `"@${d}"`).join(", ")}`,
      });
    }
  }
});