'use server';

/**
 * @fileOverview Summarizes financial reports for Chama leaders.
 *
 * - summarizeFinancialReports - A function that summarizes financial reports.
 * - SummarizeFinancialReportsInput - The input type for the summarizeFinancialReports function.
 * - SummarizeFinancialReportsOutput - The return type for the summarizeFinancialReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFinancialReportsInputSchema = z.object({
  financialReport: z.string().describe('The financial report to summarize.'),
});
export type SummarizeFinancialReportsInput = z.infer<typeof SummarizeFinancialReportsInputSchema>;

const SummarizeFinancialReportsOutputSchema = z.object({
  summary: z.string().describe('The summary of the financial report.'),
});
export type SummarizeFinancialReportsOutput = z.infer<typeof SummarizeFinancialReportsOutputSchema>;

export async function summarizeFinancialReports(input: SummarizeFinancialReportsInput): Promise<SummarizeFinancialReportsOutput> {
  return summarizeFinancialReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFinancialReportsPrompt',
  input: {schema: SummarizeFinancialReportsInputSchema},
  output: {schema: SummarizeFinancialReportsOutputSchema},
  prompt: `You are an expert financial analyst specializing in summarizing financial reports for Chama leaders.

You will use the following financial report to generate a concise and informative summary that highlights key financial insights and trends.

Financial Report:
{{{financialReport}}}

Summary:`, // Ensure the output is just the summary.
});

const summarizeFinancialReportsFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialReportsFlow',
    inputSchema: SummarizeFinancialReportsInputSchema,
    outputSchema: SummarizeFinancialReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
