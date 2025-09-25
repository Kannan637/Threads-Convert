import { z } from "zod";

export const ThreadGenerationSchema = z.object({
  inputType: z.enum(['text', 'url']).default('text'),
  text: z.string().optional(),
  url: z.string().url({ message: "Please enter a valid URL." }).optional(),
  platform: z.enum(['Twitter', 'LinkedIn']),
  style: z.enum(['Professional', 'Casual', 'Storytelling', 'Educational']),
  threadLength: z.coerce.number().min(5).max(15),
  targetAudience: z.string().min(3, {message: "Please describe your target audience."}).max(100, {message: "Description is too long."}).optional().or(z.literal('')),
}).refine(data => {
  if (data.inputType === 'text') {
    return !!data.text && data.text.length >= 50;
  }
  if (data.inputType === 'url') {
    return !!data.url;
  }
  return false;
}, {
  message: "Content must be at least 50 characters long.",
  path: ['text'],
}).refine(data => {
  if (data.inputType === 'url') {
    return !!data.url;
  }
  return true;
}, {
  message: "Please enter a valid URL.",
  path: ['url'],
});


export type ThreadGenerationForm = z.infer<typeof ThreadGenerationSchema>;
