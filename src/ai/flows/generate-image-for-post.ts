'use server';

/**
 * @fileOverview A Genkit flow for generating an image based on a text prompt.
 *
 * It includes:
 * - `generateImageForPost`: An async function that takes a text prompt and returns a generated image as a data URI.
 * - `GenerateImageForPostInput`: The input type for the `generateImageForPost` function.
 * - `GenerateImageForPostOutput`: The output type for the `generateImageFor-post` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageForPostInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageForPostInput = z.infer<typeof GenerateImageForPostInputSchema>;

const GenerateImageForPostOutputSchema = z.object({
  image: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageForPostOutput = z.infer<typeof GenerateImageForPostOutputSchema>;

export async function generateImageForPost(
  input: GenerateImageForPostInput
): Promise<GenerateImageForPostOutput> {
  return generateImageForPostFlow(input);
}

const generateImageForPostFlow = ai.defineFlow(
  {
    name: 'generateImageForPostFlow',
    inputSchema: GenerateImageForPostInputSchema,
    outputSchema: GenerateImageForPostOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate an image for a social media post with the following content: ${input.prompt}`,
      config: {
        aspectRatio: '16:9',
      },
    });
    return {image: media.url!};
  }
);
