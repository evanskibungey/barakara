"use server";

import { getInvestmentRecommendations } from "@/ai/flows/investment-recommendations-from-milestones";
import { summarizeFinancialReports } from "@/ai/flows/summarize-financial-reports";
import { createDocumentation } from "@/ai/flows/create-documentation";
import type { InvestmentRecommendationsOutput } from "@/ai/flows/investment-recommendations-from-milestones";
import { z } from "zod";

// Action for summarizing financial reports
export async function summarizeFinancialReportAction(
  prevState: { summary: string },
  formData: FormData
) {
  const financialReport = formData.get("financialReport") as string;
  if (!financialReport) {
    return { summary: "Please provide a financial report to summarize." };
  }
  try {
    const result = await summarizeFinancialReports({ financialReport });
    return { summary: result.summary };
  } catch (error) {
    console.error(error);
    return { summary: "An error occurred while summarizing the report." };
  }
}

// Schema for investment recommendations form
const investmentSchema = z.object({
  riskTolerance: z.string().min(1, "Please select your risk tolerance."),
  investmentPreferences: z.string().min(1, "Please enter your investment preferences."),
  financialHabits: z.string().min(1, "Please describe your financial habits."),
});

export type InvestmentState = {
  recommendations: InvestmentRecommendationsOutput | null;
  error: string | null;
};

// Action for getting investment recommendations
export async function getInvestmentRecommendationsAction(
  prevState: InvestmentState,
  formData: FormData
): Promise<InvestmentState> {
  const validatedFields = investmentSchema.safeParse({
    riskTolerance: formData.get("riskTolerance"),
    investmentPreferences: formData.get("investmentPreferences"),
    financialHabits: formData.get("financialHabits"),
  });

  if (!validatedFields.success) {
    return {
      recommendations: null,
      error: "Invalid form data. Please check your inputs.",
    };
  }

  // Mock milestone data representing a user's goals
  const mockMilestones = [
    { name: "University Fund for Child", targetAmount: 2000000, currentProgress: 500000, deadline: "2030-09-01" },
    { name: "New Farm Equipment", targetAmount: 1500000, currentProgress: 750000, deadline: "2026-12-31" },
  ];

  try {
    const recommendations = await getInvestmentRecommendations({
      milestones: mockMilestones,
      ...validatedFields.data,
    });
    return { recommendations, error: null };
  } catch (error) {
    console.error(error);
    return {
      recommendations: null,
      error: "Failed to get investment recommendations. Please try again later.",
    };
  }
}

// Action for creating documentation
const documentationSchema = z.object({
  title: z.string().min(1, "Please enter a title."),
  rawText: z.string().min(1, "Please provide some content."),
  format: z.enum(['meeting-minutes', 'policy-document', 'financial-report-summary']),
});

export type DocumentationState = {
  structuredContent: string | null;
  error: string | null;
};

export async function createDocumentationAction(
  prevState: DocumentationState,
  formData: FormData
): Promise<DocumentationState> {
  const validatedFields = documentationSchema.safeParse({
    title: formData.get("title"),
    rawText: formData.get("rawText"),
    format: formData.get("format"),
  });

  if (!validatedFields.success) {
    return {
      structuredContent: null,
      error: "Invalid form data. Please check your inputs.",
    };
  }

  try {
    const result = await createDocumentation(validatedFields.data);
    return { structuredContent: result.structuredContent, error: null };
  } catch (error) {
    console.error(error);
    return {
      structuredContent: null,
      error: "An error occurred while creating the document.",
    };
  }
}
