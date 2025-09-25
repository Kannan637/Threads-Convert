// src/ai/flows/generate-compelling-hook.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a compelling opening hook for a social media thread.
 *
 * It includes:
 * - `generateCompellingHook`: An async function that takes thread content as input and returns a suggested opening hook.
 * - `GenerateCompellingHookInput`: The input type for the `generateCompellingHook` function.
 * - `GenerateCompellingHookOutput`: The output type for the `generateCompellingHook` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateCompellingHookInputSchema = z.object({
  threadContent: z.string().describe('The content of the social media thread.'),
});

export type GenerateCompellingHookInput = z.infer<
  typeof GenerateCompellingHookInputSchema
>;

// Define the output schema
const GenerateCompellingHookOutputSchema = z.object({
  hook: z.string().describe('A compelling opening hook for the thread.'),
});

export type GenerateCompellingHookOutput = z.infer<
  typeof GenerateCompellingHookOutputSchema
>;

// Define the main function that calls the flow
export async function generateCompellingHook(
  input: GenerateCompellingHookInput
): Promise<GenerateCompellingHookOutput> {
  return generateCompellingHookFlow(input);
}

// Define the prompt
const generateCompellingHookPrompt = ai.definePrompt({
  name: 'generateCompellingHookPrompt',
  input: {schema: GenerateCompellingHookInputSchema},
  output: {schema: GenerateCompellingHookOutputSchema},
  prompt: `You are an expert social media thread writer.

  Given the following thread content, generate a compelling opening hook to capture the reader's attention immediately.

  Thread Content:
  {{threadContent}}

  Opening Hook:`, // The opening hook should be engaging.
});

// Define the flow
const generateCompellingHookFlow = ai.defineFlow(
  {
    name: 'generateCompellingHookFlow',
    inputSchema: GenerateCompellingHookInputSchema,
    outputSchema: GenerateCompellingHookOutputSchema,
  },
  async input => {
    const {output} = await generateCompellingHookPrompt(input);
    return output!;
  }
);
