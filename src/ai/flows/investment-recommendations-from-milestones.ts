'use server';
/**
 * @fileOverview Provides personalized investment recommendations based on user milestones.
 *
 * - getInvestmentRecommendations - A function that returns investment recommendations.
 * - InvestmentRecommendationsInput - The input type for the getInvestmentRecommendations function.
 * - InvestmentRecommendationsOutput - The return type for the getInvestmentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentRecommendationsInputSchema = z.object({
  milestones: z
    .array(
      z.object({
        name: z.string(),
        targetAmount: z.number(),
        currentProgress: z.number(),
        deadline: z.string().optional(),
      })
    )
    .describe('An array of user-defined financial milestones.'),
  financialHabits: z
    .string()
    .describe('A description of the user\'s existing financial habits.'),
  riskTolerance: z
    .string()
    .describe('The user\'s risk tolerance (e.g., low, medium, high).'),
  investmentPreferences: z
    .string()
    .describe('The user\'s investment preferences (e.g., stocks, bonds, real estate).'),
});
export type InvestmentRecommendationsInput = z.infer<
  typeof InvestmentRecommendationsInputSchema
>;

const InvestmentRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        investmentName: z.string(),
        description: z.string().describe("A detailed viability analysis of the investment, including how to ensure accountability for returns, like using a Point of Sale system for franchises and collecting margins."),
        allocationPercentage: z.number(),
        roi: z.number().describe("The expected Return on Investment as a percentage."),
        riskLevel: z.string(),
      })
    )
    .describe('An array of investment recommendations with viability analysis.'),
  summary: z.string().describe('A summary of the investment recommendations and overall strategy.'),
});
export type InvestmentRecommendationsOutput = z.infer<
  typeof InvestmentRecommendationsOutputSchema
>;

export async function getInvestmentRecommendations(
  input: InvestmentRecommendationsInput
): Promise<InvestmentRecommendationsOutput> {
  return investmentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'investmentRecommendationsPrompt',
  input: {schema: InvestmentRecommendationsInputSchema},
  output: {schema: InvestmentRecommendationsOutputSchema},
  prompt: `You are an expert financial analyst providing personalized investment recommendations and viability analysis. Your audience is members of a Kenyan Chama (savings group).

Analyze the user's financial milestones, habits, risk tolerance, and preferences to create a tailored investment plan.

User's financial milestones:
{{#each milestones}}
- Name: {{name}}, Target Amount: KES {{targetAmount}}, Current Progress: KES {{currentProgress}}, Deadline: {{deadline}}
{{/each}}

User's financial habits: {{financialHabits}}
User's risk tolerance: {{riskTolerance}}
User's investment preferences: {{investmentPreferences}}

For each recommendation, provide:
1.  **Investment Name:** A clear, recognizable name (e.g., 'Blue-Chip Stock Portfolio', 'Maji Safi Water ATM Franchise').
2.  **Viability Description:** A detailed analysis explaining why this investment is suitable. Include potential challenges and a strategy for ensuring accountability and collecting returns. For franchise models, suggest a simple process for tracking sales (like a POS system) and remitting a portion of the revenue (e.g., a 10% margin) back to the central entity.
3.  **Allocation Percentage:** The percentage of their investment capital to allocate to this option.
4.  **ROI:** A realistic projected annual Return on Investment (as a percentage).
5.  **Risk Level:** Categorize as 'Low', 'Medium', or 'High'.

Finally, provide a concise summary of the overall investment strategy.

Make sure the output is valid JSON.
`,
});

const investmentRecommendationsFlow = ai.defineFlow(
  {
    name: 'investmentRecommendationsFlow',
    inputSchema: InvestmentRecommendationsInputSchema,
    outputSchema: InvestmentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
