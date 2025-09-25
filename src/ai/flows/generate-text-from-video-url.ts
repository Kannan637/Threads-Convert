'use server';
/**
 * @fileOverview A Genkit flow for extracting text from a video URL.
 *
 * This file defines a Genkit flow that takes a video URL, uses a multimodal model
 * to process the video, and returns the transcribed text.
 *
 * It includes:
 * - `generateTextFromVideoUrl`: The main async function to call the flow.
 * - `GenerateTextFromVideoUrlInput`: The Zod schema for the flow's input.
 * - `GenerateTextFromVideoUrlOutput`: The Zod schema for the flow's output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MediaPart } from 'genkit';

const GenerateTextFromVideoUrlInputSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the video to process.'),
});
export type GenerateTextFromVideoUrlInput = z.infer<typeof GenerateTextFromVideoUrlInputSchema>;

const GenerateTextFromVideoUrlOutputSchema = z.object({
  text: z.string().describe('The extracted text from the video.'),
});
export type GenerateTextFromVideoUrlOutput = z.infer<typeof GenerateTextFromVideoUrlOutputSchema>;

export async function generateTextFromVideoUrl(
  input: GenerateTextFromVideoUrlInput
): Promise<GenerateTextFromVideoUrlOutput> {
  return generateTextFromVideoUrlFlow(input);
}

const generateTextFromVideoUrlFlow = ai.defineFlow(
  {
    name: 'generateTextFromVideoUrlFlow',
    inputSchema: GenerateTextFromVideoUrlInputSchema,
    outputSchema: GenerateTextFromVideoUrlOutputSchema,
  },
  async (input) => {
    
    const mediaPart: MediaPart = {
      media: {
        url: input.videoUrl,
      },
    };

    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: [mediaPart, {text: "Extract the spoken text from this video. Provide only the transcript."}],
      config: {
        // Gemini 1.5 is in preview and requires a region.
        location: 'us-central1',
      },
    });

    return { text: text };
  }
);
