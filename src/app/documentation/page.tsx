
'use client';

import { useActionState } from 'react';
import { createDocumentationAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSignature, Wand2 } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const exampleDocumentation = `
# Baraka Fintech Hub: System Overview

This document provides a comprehensive overview of the Baraka Fintech Hub, an integrated financial technology platform designed to digitize and enhance Kenya's communal financial culture.

## 1. Introduction

Baraka Fintech Hub is a centralized platform for managing communal savings groups (Chamas), facilitating crowdfunding for community projects, and providing AI-driven financial insights. It aims to bring transparency, efficiency, and growth opportunities to both individuals and groups.

## 2. Core Features

The platform is built upon several key pillars:

### 2.1. Chama Management
Digitize and manage all aspects of a Chama, including:
*   **Member Roster:** Maintain a detailed list of all members, their roles, and contact information.
*   **Contribution Tracking:** Record and monitor member contributions automatically.
*   **Loan Management:** A complete loan lifecycle management system from application, guarantor signing, approval, disbursement, and repayment tracking with automated amortization schedules.
*   **Penalty System (Fines):** Configure and apply fines for late payments or missed meetings.
*   **Welfare & Drives:** Manage internal welfare funds and create special-purpose contribution drives.
*   **Document Repository:** Securely store and share important documents like meeting minutes and legal certificates.
*   **Polls & Elections:** Conduct secure votes for leadership changes or key decisions.

### 2.2. Milestone Crowdfunding
A public-facing module allowing users to create and manage fundraising campaigns for specific goals (e.g., community projects, business startups).
*   Secure payment integration (M-Pesa, Bank, etc.).
*   Progress tracking and backer management.
*   Social sharing features to increase visibility.
*   Compliance with regulatory guidelines (e.g., CMA investment limits).

### 2.3. AI-Powered Tools
Leverage generative AI to provide intelligent assistance:
*   **Investment Recommendations:** Generates personalized investment advice based on a user's financial habits, goals, and risk tolerance.
*   **Financial Report Analysis:** Summarizes complex financial reports into concise, understandable insights.
*   **AI Document Assistant:** Transforms raw notes into structured documents like meeting minutes or policy papers.
*   **Inflation Goal Adjuster:** Monitors financial goals and suggests adjustments based on inflation.

### 2.4. Marketplace
*   **Member Marketplace:** A space for Chama members to advertise and support each other's businesses and services.
*   **Investment Marketplace:** A curated list of investment portfolios (e.g., stocks, bonds, real estate) for users to explore.

### 2.5. Business Intelligence & Reporting
*   **BI Dashboard:** Visual dashboards providing insights into member growth, financial performance, and user engagement.
*   **Financial Reports:** Generate detailed financial statements and transaction histories for accountability.

## 3. Technology Stack

The application is built using a modern, robust technology stack:
*   **Frontend:** Next.js and React
*   **Styling:** Tailwind CSS with ShadCN UI components
*   **AI/Generative Features:** Google's Genkit
*   **State Management:** React Hooks and Context API

This combination ensures a performant, scalable, and feature-rich user experience.

## 4. User Roles

The platform supports different access levels to ensure proper governance:
*   **Admin:** Full control over platform settings, user management, and global configurations.
*   **Chairperson:** Manages a specific Chama, including members, loans, and events.
*   **Member:** A standard user who participates in Chamas, contributes, and can view their own financial data.

## 5. Style and Branding

The user interface follows a clean and professional design to build trust and guide users through financial tasks.
*   **Primary Color:** Deep, emerald green
*   **Accent Color:** Warm gold
*   **Theme:** A modern dark mode is the default, providing excellent contrast and a premium feel.
`;


const initialState = {
  structuredContent: exampleDocumentation,
  error: null,
};

export default function DocumentationPage() {
  const [state, formAction] = useActionState(createDocumentationAction, initialState);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          AI Document Assistant
        </h1>
        <p className="text-muted-foreground">
          Transform your notes into professionally structured documents.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a Document</CardTitle>
            <CardDescription>
              Provide your raw notes and let AI do the formatting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input id="title" name="title" placeholder="e.g., Q3 2024 Planning Meeting Minutes" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Document Format</Label>
                <Select name="format" required>
                    <SelectTrigger id="format">
                        <SelectValue placeholder="Select a document type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="meeting-minutes">Meeting Minutes</SelectItem>
                        <SelectItem value="policy-document">Policy Document</SelectItem>
                        <SelectItem value="financial-report-summary">Financial Report Summary</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rawText">Raw Content / Notes</Label>
                <Textarea
                  name="rawText"
                  id="rawText"
                  placeholder="Paste your unformatted notes here. e.g., 'Meeting on July 30. Attendees: Jane, John, Sarah. Discussed budget. Action: John to send report...'"
                  className="min-h-[300px] text-sm"
                  required
                />
              </div>

              <SubmitButton className="mt-4">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Document
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Document</CardTitle>
            <CardDescription>
              A full system overview is shown below. Use the form to generate your own.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            {state.structuredContent ? (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-lg min-h-[300px]">
                <ReactMarkdown>{state.structuredContent}</ReactMarkdown>
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg p-8 text-center min-h-[300px]">
                    <FileSignature className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold font-headline">Your document will be generated here</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Fill out the form and click "Generate Document" to start.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
