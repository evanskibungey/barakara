
'use client';

import { useActionState } from 'react';
import { summarizeFinancialReportAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';

const initialState = {
  summary: '',
};

export default function AnalysisPage() {
  const [state, formAction] = useActionState(summarizeFinancialReportAction, initialState);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Financial Report Analysis
        </h1>
        <p className="text-muted-foreground">
          Use AI to get deeper insights from your financial reports.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Report</CardTitle>
            <CardDescription>
              Paste your financial report below to generate a summary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <Textarea
                name="financialReport"
                placeholder="Paste your financial report content here..."
                className="min-h-[300px] text-sm"
              />
              <SubmitButton className="mt-4">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Summary
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Summary</CardTitle>
            <CardDescription>
              A concise overview of the key financial insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.summary ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{state.summary}</p>
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg p-8 text-center min-h-[300px]">
                    <Wand2 className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold font-headline">Insights will appear here</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Submit a financial report to get started.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
