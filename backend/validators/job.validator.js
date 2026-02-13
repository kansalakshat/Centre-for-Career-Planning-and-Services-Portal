import { z } from "zod";

const emptyToUndefined = z.preprocess((val) => (val === "" ? undefined : val), z.any());

export const createJobSchema = z.object({
  body: z.object({
    jobTitle: z.string().min(3, "Job title must be at least 3 characters long"),
    jobDescription: z.string().min(1, "Job description is required"),
    Company: z.string().min(1, "Company name is required"),
    requiredSkills: z.array(z.string()).optional(),
    Type: z.enum(["on-campus", "off-campus"], {
      errorMap: () => ({ message: "Type must be either 'on-campus' or 'off-campus'" }),
    }),
    batch: z.coerce.number({ required_error: "Batch is required" }),
    Deadline: emptyToUndefined.pipe(z.coerce.date().optional()),
    ApplicationLink: emptyToUndefined.pipe(z.string().url("Invalid application link").optional()),
    Expiry: emptyToUndefined.pipe(z.coerce.date().optional()),
    author: z.string().optional(),
    relevanceScore: z.coerce.number().optional(),
  }),
});
