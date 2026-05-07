'use server';
/**
 * @fileOverview An AI flow that helps users create structured documentation from raw text.
 *
 * - createDocumentation - A function that handles the document creation process.
 * - CreateDocumentationInput - The input type for the createDocumentation function.
 * - CreateDocumentationOutput - The return type for the createDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateDocumentationInputSchema = z.object({
  title: z.string().describe('The title of the document.'),
  rawText: z
    .string()
    .describe('The raw, unstructured text or notes to be converted into a formal document.'),
  format: z
    .enum(['meeting-minutes', 'policy-document', 'financial-report-summary'])
    .describe('The desired format for the output document.'),
});
export type CreateDocumentationInput = z.infer<
  typeof CreateDocumentationInputSchema
>;

const CreateDocumentationOutputSchema = z.object({
  structuredContent: z
    .string()
    .describe('The well-structured and formatted content of the document in Markdown.'),
});
export type CreateDocumentationOutput = z.infer<
  typeof CreateDocumentationOutputSchema
>;

export async function createDocumentation(
  input: CreateDocumentationInput
): Promise<CreateDocumentationOutput> {
  return createDocumentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createDocumentationPrompt',
  input: {schema: CreateDocumentationInputSchema},
  output: {schema: CreateDocumentationOutputSchema},
  prompt: `You are an expert administrative assistant specializing in creating professional documents for Kenyan Chamas (savings groups).

Your task is to take the user's raw text and transform it into a structured document based on the specified format. The output should be in clean Markdown.

Document Details:
- Title: {{{title}}}
- Desired Format: {{{format}}}

Raw Text/Notes:
{{{rawText}}}

Instructions:
- If the format is 'meeting-minutes', structure the text with a title, date, attendees, absentees, agenda items, discussions, and action items.
- If the format is 'policy-document', create a formal policy with sections like 'Introduction', 'Policy Statement', 'Scope', 'Procedures', and 'Enforcement'.
- If the format is 'financial-report-summary', create a concise summary highlighting key financial metrics, income, expenses, and net position.
- Ensure the language is professional, clear, and appropriate for a formal document.
- The final output must be only the structured content in Markdown format.
`,
});

const createDocumentationFlow = ai.defineFlow(
  {
    name: 'createDocumentationFlow',
    inputSchema: CreateDocumentationInputSchema,
    outputSchema: CreateDocumentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
