import { z } from "zod";

export const ThreadGenerationSchema = z.object({
  text: z.string().min(50, { message: "Content must be at least 50 characters long to generate a meaningful thread." }).max(15000, { message: "Content is too long. Please shorten it." }),
  platform: z.enum(['Twitter', 'LinkedIn']),
  style: z.enum(['Professional', 'Casual', 'Storytelling', 'Educational']),
  threadLength: z.coerce.number().min(5).max(15),
  targetAudience: z.string().min(3, {message: "Please describe your target audience."}).max(100, {message: "Description is too long."}).optional().or(z.literal('')),
});

export type ThreadGenerationForm = z.infer<typeof ThreadGenerationSchema>;
