
"use client";

import { useActionState } from "react";
import { getInvestmentRecommendationsAction } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { TrendingUp, Wand2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { SubmitButton } from "./submit-button";

const initialState = {
  recommendations: null,
  error: null,
};

export function InvestmentForm() {
  const [state, formAction] = useActionState(getInvestmentRecommendationsAction, initialState);

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Your Financial Profile</CardTitle>
          <CardDescription>Help us understand your investment style.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
              <Select name="riskTolerance" required>
                  <SelectTrigger id="risk-tolerance">
                      <SelectValue placeholder="Select your risk level" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="low">Low - I prefer safe, stable returns.</SelectItem>
                      <SelectItem value="medium">Medium - I'm willing to take some risks for better returns.</SelectItem>
                      <SelectItem value="high">High - I'm comfortable with high risk for high potential rewards.</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment-preferences">Investment Preferences</Label>
              <Input name="investmentPreferences" id="investment-preferences" placeholder="e.g., stocks, bonds, real estate, tech" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="financial-habits">Financial Habits</Label>
              <Textarea
                name="financialHabits"
                id="financial-habits"
                placeholder="Describe your saving and spending habits. e.g., 'I save 20% of my income each month...'"
                className="min-h-[100px]"
                required
              />
            </div>
            
            <SubmitButton>
                <Wand2 className="mr-2 h-4 w-4" />
                Get Recommendations
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-3">
        {state.error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}

        {!state.recommendations && !state.error && (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg p-8 text-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold font-headline">Your Investment Analysis Awaits</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Fill out your profile to receive a detailed viability report and AI-powered investment suggestions.
                </p>
            </div>
        )}

        {state.recommendations && (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-headline">Your AI-Generated Investment Plan</CardTitle>
              <CardDescription>{state.recommendations.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.recommendations.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{rec.investmentName}</h4>
                    </div>
                     <Badge variant="secondary" className="text-primary border-primary/50 bg-primary/10 shrink-0">{rec.allocationPercentage}% Allocation</Badge>
                  </div>
                   <p className="text-sm text-muted-foreground mt-2">{rec.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm pt-4 border-t">
                    <div>
                      <div className="text-muted-foreground">Expected ROI</div>
                      <div className="font-semibold text-green-400">{rec.roi}% p.a.</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Risk Level</div>
                      <div className="font-semibold capitalize">{rec.riskLevel}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
