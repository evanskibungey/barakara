'use server';
/**
 * @fileOverview An AI flow that alerts users to inflation affecting their financial goals
 * and suggests adjustments to their contributions.
 *
 * - getInflationAdjustment - A function that returns the inflation adjustment alert.
 * - InflationAdjusterInput - The input type for the getInflationAdjustment function.
 * - InflationAdjusterOutput - The return type for the getInflationAdjustment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InflationAdjusterInputSchema = z.object({
  goalName: z.string().describe('The name of the financial goal, e.g., "10,000L Water Tank".'),
  initialCost: z.number().describe('The original cost of the goal.'),
  currentCost: z.number().describe('The current, inflation-adjusted cost of the goal.'),
  numberOfMembers: z.number().describe('The number of members in the savings group.'),
  contributionFrequency: z.enum(['daily', 'weekly', 'monthly']).describe('The frequency of contributions.'),
});
export type InflationAdjusterInput = z.infer<typeof InflationAdjusterInputSchema>;

const InflationAdjusterOutputSchema = z.object({
  percentageIncrease: z.number().describe('The percentage increase in the cost of the goal.'),
  alertMessage: z.string().describe('The main alert message explaining the price increase.'),
  suggestedIncrease: z.number().describe('The suggested monetary increase per member per contribution period.'),
  suggestionMessage: z.string().describe('The message suggesting the contribution adjustment.'),
});
export type InflationAdjusterOutput = z.infer<typeof InflationAdjusterOutputSchema>;


export async function getInflationAdjustment(
  input: InflationAdjusterInput
): Promise<InflationAdjusterOutput> {
  return inflationGoalAdjusterFlow(input);
}


const prompt = ai.definePrompt({
  name: 'inflationGoalPrompt',
  input: {schema: InflationAdjusterInputSchema},
  output: {schema: InflationAdjusterOutputSchema},
  prompt: `You are an AI financial assistant for a Kenyan savings group (Chama).

A financial goal has increased in price due to inflation. Your task is to calculate the percentage increase, determine the new contribution amount required per member, and generate a friendly but clear alert message.

Goal Details:
- Goal Name: {{{goalName}}}
- Initial Cost: KES {{{initialCost}}}
- Current Cost: KES {{{currentCost}}}
- Number of Members: {{{numberOfMembers}}}
- Contribution Frequency: {{{contributionFrequency}}}

Calculations:
1.  Calculate the percentage increase: ((currentCost - initialCost) / initialCost) * 100.
2.  Calculate the total increase needed: currentCost - initialCost.
3.  Calculate the increase per member: totalIncrease / numberOfMembers. Assuming the goal needs to be met in one contribution cycle for simplicity.
4.  Round the suggested increase to a clean number (e.g., nearest 10 or 50).

Generate the output in the format defined by the output schema.
- alertMessage: State that the goal for [goalName] has increased by [percentageIncrease]% due to market prices.
- suggestionMessage: State "To stay on track, we suggest increasing contributions by KES [suggestedIncrease] [contributionFrequency]."

Make sure the output is valid JSON.
`,
});


const inflationGoalAdjusterFlow = ai.defineFlow(
  {
    name: 'inflationGoalAdjusterFlow',
    inputSchema: InflationAdjusterInputSchema,
    outputSchema: InflationAdjusterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
