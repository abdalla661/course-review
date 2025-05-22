import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});
