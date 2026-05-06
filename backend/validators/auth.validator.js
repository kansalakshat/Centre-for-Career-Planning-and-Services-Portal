import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),

    email: z.string().trim().email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters long"),

    role: z.enum(["student", "recruiter", "admin", "alumni"], {
      error: "Role must be one of: student, recruiter, admin, alumni",
    }),

    // Common optional fields
    phone: z.string().optional(),
    address: z.string().optional(),

    // Alumni fields (aligned with frontend)
    instituteId: z.string().optional(),
    mobileNumber: z.string().optional(),

    //  FIX: match frontend (batch instead of graduationBatch)
    batch: z
      .union([z.string(), z.number()])
      .optional(),

    company: z.string().optional(),

    //  FIX: allow empty string OR valid URL
    linkedin: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          val.trim() === "" ||
          /^https?:\/\/.+/.test(val),
        {
          message: "Invalid LinkedIn URL",
        }
      ),
  }).superRefine((data, ctx) => {
    if (data.role === "alumni") {
      if (!data.instituteId || data.instituteId.trim() === "") {
        ctx.addIssue({
          path: ["instituteId"],
          message: "Institute ID is required for alumni",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.mobileNumber || data.mobileNumber.trim() === "") {
        ctx.addIssue({
          path: ["mobileNumber"],
          message: "Mobile number is required for alumni",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.batch || data.batch.toString().trim() === "") {
        ctx.addIssue({
          path: ["batch"],
          message: "Graduation batch is required for alumni",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});
