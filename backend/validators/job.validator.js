import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

const safeDate = z
  .union([
    z.string().min(1).pipe(z.coerce.date()),
    z.literal("")
  ])
  .transform((val) => (val === "" ? undefined : val))
  .optional();

export const createJobSchema = z.object({
  body: z.object({
    jobTitle: z.string().min(3, "Job title must be at least 3 characters long"),
    jobDescription: z.string().min(1, "Job description is required"),
    Company: z.string().min(1, "Company name is required"),
    requiredSkills: z.array(z.string()).optional(),
    Type: z.enum(["on-campus", "off-campus"], {
      error: "Type must be either 'on-campus' or 'off-campus'",
    }),
    batch: z.coerce
      .number()
      .int("Batch must be an integer")
      .min(2020, "Batch must be a valid year")
      .max(2100, "Batch must be a valid year"),
    Deadline: safeDate,
    ApplicationLink: z.union([z.string().url("Invalid application link"), z.literal("")]).transform(val => val === "" ? undefined : val).optional(),
    Expiry: safeDate,
  }),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    jobTitle: z.string().min(3, "Job title must be at least 3 characters long").optional(),
    jobDescription: z.string().min(1, "Job description is required").optional(),
    Company: z.string().min(1, "Company name is required").optional(),
    requiredSkills: z.array(z.string()).optional(),
    Type: z.enum(["on-campus", "off-campus"], {
      error: "Type must be either 'on-campus' or 'off-campus'",
    }).optional(),
    batch: z.coerce
      .number()
      .int("Batch must be an integer")
      .min(2020, "Batch must be a valid year")
      .max(2100, "Batch must be a valid year")
      .optional(),
    Deadline: safeDate,
    ApplicationLink: z.union([z.string().url("Invalid application link"), z.literal("")]).transform(val => val === "" ? undefined : val).optional(),
    Expiry: safeDate,
  }),
});
