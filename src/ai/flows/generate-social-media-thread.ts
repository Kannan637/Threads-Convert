'use server';

/**
 * @fileOverview A social media thread generator AI agent.
 * 
 * - generateSocialMediaThread - A function that generates a social media thread from a block of text.
 * - GenerateSocialMediaThreadInput - The input type for the generateSocialMediaThread function.
 * - GenerateSocialMediaThreadOutput - The return type for the generateSocialMediaThread function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaThreadInputSchema = z.object({
  text: z.string().describe('The text to generate a social media thread from.'),
  platform: z
    .enum(['Twitter', 'LinkedIn'])
    .describe('The social media platform to generate the thread for.'),
  style: z
    .enum(['Professional', 'Casual', 'Storytelling', 'Educational'])
    .describe('The style of the social media thread.'),
  threadLength: z
    .number()
    .min(5)
    .max(15)
    .describe('The preferred length of the social media thread (number of tweets/posts).'),
});
export type GenerateSocialMediaThreadInput = z.infer<
  typeof GenerateSocialMediaThreadInputSchema
>;

const GenerateSocialMediaThreadOutputSchema = z.object({
  thread: z.array(z.string()).describe('The generated social media thread.'),
});
export type GenerateSocialMediaThreadOutput = z.infer<
  typeof GenerateSocialMediaThreadOutputSchema
>;

export async function generateSocialMediaThread(
  input: GenerateSocialMediaThreadInput
): Promise<GenerateSocialMediaThreadOutput> {
  return generateSocialMediaThreadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaThreadPrompt',
  input: {schema: GenerateSocialMediaThreadInputSchema},
  output: {schema: GenerateSocialMediaThreadOutputSchema},
  prompt: `You are an expert social media content creator.

You will generate a social media thread based on the provided text, platform, style, and preferred thread length.

Text: {{{text}}}
Platform: {{{platform}}}
Style: {{{style}}}
Thread Length: {{{threadLength}}}

Ensure each tweet/post is engaging and maintains narrative coherence.
Add thread connectors where appropriate (e.g., \"In the next tweet...\").
Create a compelling opening and closing tweet.

Output the thread as a JSON array of strings.{
  "safetySettings": [
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_ONLY_HIGH",
    },
  ],
}`,
});

const generateSocialMediaThreadFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaThreadFlow',
    inputSchema: GenerateSocialMediaThreadInputSchema,
    outputSchema: GenerateSocialMediaThreadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
