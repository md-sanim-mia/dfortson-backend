import { z } from "zod";

const IntervalEnum = z.enum(["month"]);

const planValidationSchema = z.object({
  body: z.object({
    planName: z.string().min(1, "Plan name is required"),
    description: z.string().max(500).optional(),
    amount: z.number().min(0, "Amount must be positive"),
    currency: z.string().default("eur").optional(),
    interval: IntervalEnum.optional(),
    intervalCount: z
      .number()
      .int()
      .positive("Interval count must be positive")
      .optional(),
    active: z.boolean().default(true).optional(),
    features: z
      .array(z.string().min(1, "Feature must be a non-empty string"))
      .optional(),
    planType: z
      .enum(["subscription", "payPerJob"])
      .default("subscription")
      .optional(),
  }),
});

export const PlanValidation = {
  planValidationSchema,
};
