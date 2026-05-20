"use server";

import { cookies } from "next/headers";
import type { InvestmentRecommendationsOutput } from "@/ai/flows/investment-recommendations-from-milestones";
import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function aiPost<T>(
  path: string,
  body: unknown
): Promise<{ status: string; data?: T; message?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("baraka_token")?.value;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

// ─── Summarize Financial Report ───────────────────────────────────────────────

export async function summarizeFinancialReportAction(
  prevState: { summary: string },
  formData: FormData
) {
  const financialReport = formData.get("financialReport") as string;
  if (!financialReport) {
    return { summary: "Please provide a financial report to summarize." };
  }
  try {
    const result = await aiPost<{ summary: string }>("/ai/summarize-report", {
      financialReport,
    });
    return {
      summary: result.data?.summary ?? "No summary was generated.",
    };
  } catch (error) {
    console.error(error);
    return { summary: "An error occurred while summarizing the report." };
  }
}

// ─── Investment Recommendations ───────────────────────────────────────────────

const investmentSchema = z.object({
  riskTolerance: z.string().min(1, "Please select your risk tolerance."),
  investmentPreferences: z
    .string()
    .min(1, "Please enter your investment preferences."),
  financialHabits: z
    .string()
    .min(1, "Please describe your financial habits."),
});

export type InvestmentState = {
  recommendations: InvestmentRecommendationsOutput | null;
  error: string | null;
};

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

  const mockMilestones = [
    {
      name: "University Fund for Child",
      targetAmount: 2000000,
      currentProgress: 500000,
      deadline: "2030-09-01",
    },
    {
      name: "New Farm Equipment",
      targetAmount: 1500000,
      currentProgress: 750000,
      deadline: "2026-12-31",
    },
  ];

  try {
    const result = await aiPost<InvestmentRecommendationsOutput>(
      "/ai/investment-recommendations",
      {
        milestones: mockMilestones,
        ...validatedFields.data,
      }
    );

    if (!result.data || !result.data.recommendations) {
      throw new Error(result.message ?? "No recommendations returned.");
    }

    return { recommendations: result.data, error: null };
  } catch (error) {
    console.error(error);
    return {
      recommendations: null,
      error: "Failed to get investment recommendations. Please try again later.",
    };
  }
}

// ─── Create Documentation ─────────────────────────────────────────────────────

const documentationSchema = z.object({
  title: z.string().min(1, "Please enter a title."),
  rawText: z.string().min(1, "Please provide some content."),
  format: z.enum([
    "meeting-minutes",
    "policy-document",
    "financial-report-summary",
  ]),
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
    const result = await aiPost<{ structuredContent: string }>(
      "/ai/create-documentation",
      validatedFields.data
    );
    return {
      structuredContent: result.data?.structuredContent ?? null,
      error: result.data?.structuredContent
        ? null
        : "No document content was generated.",
    };
  } catch (error) {
    console.error(error);
    return {
      structuredContent: null,
      error: "An error occurred while creating the document.",
    };
  }
}
