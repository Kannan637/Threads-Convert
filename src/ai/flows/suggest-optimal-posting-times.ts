'use server';
/**
 * @fileOverview Suggests optimal posting times for a given social media thread.
 *
 * - suggestOptimalPostingTimes - A function that suggests optimal posting times for a thread.
 * - SuggestOptimalPostingTimesInput - The input type for the suggestOptimalPostingTimes function.
 * - SuggestOptimalPostingTimesOutput - The return type for the suggestOptimalPostingTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalPostingTimesInputSchema = z.object({
  threadContent: z
    .string()
    .describe('The content of the social media thread to be posted.'),
  targetAudience: z
    .string()
    .describe('Description of the target audience for the thread.'),
  platform: z.enum(['Twitter', 'LinkedIn']).describe('The social media platform for the thread.'),
});
export type SuggestOptimalPostingTimesInput = z.infer<
  typeof SuggestOptimalPostingTimesInputSchema
>;

const SuggestOptimalPostingTimesOutputSchema = z.object({
  suggestedPostTimes: z
    .array(z.string())
    .describe(
      'An array of suggested posting times in ISO 8601 format (e.g., 2024-01-01T10:00:00Z).'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the suggested posting times, based on the thread content and target audience.'
    ),
});
export type SuggestOptimalPostingTimesOutput = z.infer<
  typeof SuggestOptimalPostingTimesOutputSchema
>;

export async function suggestOptimalPostingTimes(
  input: SuggestOptimalPostingTimesInput
): Promise<SuggestOptimalPostingTimesOutput> {
  return suggestOptimalPostingTimesFlow(input);
}

const suggestOptimalPostingTimesPrompt = ai.definePrompt({
  name: 'suggestOptimalPostingTimesPrompt',
  input: {schema: SuggestOptimalPostingTimesInputSchema},
  output: {schema: SuggestOptimalPostingTimesOutputSchema},
  prompt: `You are an expert social media manager. Analyze the following social media thread and suggest the three best times to post it to maximize engagement, taking into account the target audience and platform.

Thread Content: {{{threadContent}}}
Target Audience: {{{targetAudience}}}
Platform: {{{platform}}}

Respond with the suggested posting times in ISO 8601 format (e.g., 2024-01-01T10:00:00Z), and provide a brief explanation of your reasoning for each suggested time.

Format your response as a JSON object with \"suggestedPostTimes\" (an array of ISO 8601 timestamps) and \"reasoning\" (a string explaining your choices).`,
});

const suggestOptimalPostingTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalPostingTimesFlow',
    inputSchema: SuggestOptimalPostingTimesInputSchema,
    outputSchema: SuggestOptimalPostingTimesOutputSchema,
  },
  async input => {
    try {
      const {output} = await suggestOptimalPostingTimesPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error suggesting optimal posting times:', error);
      return {
        suggestedPostTimes: [],
        reasoning: "Could not generate posting time suggestions due to a temporary issue with the AI model. Please try again later."
      };
    }
  }
);
