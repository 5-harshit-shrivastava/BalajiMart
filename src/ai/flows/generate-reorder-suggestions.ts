'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating reorder suggestions based on current inventory and sales data.
 *
 * - generateReorderSuggestions - A function that triggers the reorder suggestion generation flow.
 * - GenerateReorderSuggestionsInput - The input type for the generateReorderSuggestions function.
 * - GenerateReorderSuggestionsOutput - The return type for the generateReorderSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReorderSuggestionsInputSchema = z.object({
  inventoryData: z
    .string()
    .describe('Current inventory data, including product names and quantities.'),
  salesData: z
    .string()
    .describe('Recent sales data, including product names and quantities sold.'),
});
export type GenerateReorderSuggestionsInput = z.infer<
  typeof GenerateReorderSuggestionsInputSchema
>;

const GenerateReorderSuggestionsOutputSchema = z.object({
  reorderSuggestions: z
    .string()
    .describe('AI-generated reorder suggestions for each product.'),
});
export type GenerateReorderSuggestionsOutput = z.infer<
  typeof GenerateReorderSuggestionsOutputSchema
>;

export async function generateReorderSuggestions(
  input: GenerateReorderSuggestionsInput
): Promise<GenerateReorderSuggestionsOutput> {
  return generateReorderSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReorderSuggestionsPrompt',
  input: {schema: GenerateReorderSuggestionsInputSchema},
  output: {schema: GenerateReorderSuggestionsOutputSchema},
  prompt: `You are an inventory management assistant. Analyze the provided inventory data and sales data to generate reorder suggestions for each product.

Inventory Data:
{{inventoryData}}

Sales Data:
{{salesData}}

Reorder Suggestions:
`, // Intentionally left blank; AI will generate content.
});

const generateReorderSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateReorderSuggestionsFlow',
    inputSchema: GenerateReorderSuggestionsInputSchema,
    outputSchema: GenerateReorderSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
