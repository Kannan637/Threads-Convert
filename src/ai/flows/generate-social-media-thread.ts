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
import { generateImageForPost } from './generate-image-for-post';

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
    .min(1)
    .max(15)
    .describe('The preferred length of the social media thread (number of tweets/posts).'),
});
export type GenerateSocialMediaThreadInput = z.infer<
  typeof GenerateSocialMediaThreadInputSchema
>;

const GenerateSocialMediaThreadOutputSchema = z.object({
  thread: z.array(z.object({
    text: z.string().describe('The text of the post.'),
    image: z.string().describe('A data URI for a generated image related to the post content.'),
    isPlaceholder: z.boolean().optional().describe('Indicates if the image is a placeholder.')
  })).describe('The generated social media thread, with each post having text and an image.'),
  usedPlaceholders: z.boolean().optional().describe('Indicates if placeholder images were used.'),
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
  output: {schema: z.object({
    thread: z.array(z.string()).describe('The generated social media thread as an array of strings.'),
  })},
  prompt: `You are an expert social media content creator.

You will generate a social media thread based on the provided text, platform, style, and preferred thread length.

Text: {{{text}}}
Platform: {{{platform}}}
Style: {{{style}}}
Thread Length: {{{threadLength}}}

Ensure each tweet/post is engaging and maintains narrative coherence.
Add thread connectors where appropriate (e.g., \"In the next tweet...\").
Create a compelling opening and closing tweet.

Output the thread as a JSON array of strings.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  }
});

const generateSocialMediaThreadFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaThreadFlow',
    inputSchema: GenerateSocialMediaThreadInputSchema,
    outputSchema: GenerateSocialMediaThreadOutputSchema,
  },
  async input => {
    const {output: textOutput} = await prompt(input);
    if (!textOutput?.thread) {
      throw new Error('Failed to generate thread text.');
    }

    const imagePromises = textOutput.thread.map(postText => 
      generateImageForPost({ prompt: postText })
    );

    const imageResults = await Promise.all(imagePromises);

    let usedPlaceholders = false;
    const finalThread = textOutput.thread.map((postText, index) => {
      const imageResult = imageResults[index];
      if (imageResult.isPlaceholder) {
        usedPlaceholders = true;
      }
      return {
        text: postText,
        image: imageResult.image,
        isPlaceholder: imageResult.isPlaceholder,
      }
    });
    
    return { thread: finalThread, usedPlaceholders };
  }
);
