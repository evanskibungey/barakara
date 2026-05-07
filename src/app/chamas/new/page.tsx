'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Loader2, Share2, Users, UserPlus, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiFetch } from '@/lib/api';

interface CreatedChama {
  id: number;
  name: string;
  pool_id: string;
}

export default function NewChamaPage() {
  const [loading, setLoading] = useState(false);
  const [chamaCreated, setChamaCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [onboardingLink, setOnboardingLink] = useState('');
  const [createdChama, setCreatedChama] = useState<CreatedChama | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const freq = formData.get('contribution-frequency') as string | null;
      const res = await apiFetch<{ chama: CreatedChama }>('/chamas', {
        method: 'POST',
        body: JSON.stringify({
          name:                   formData.get('chama-name') as string,
          description:            formData.get('chama-description') as string,
          membership_fee:         Number(formData.get('contribution-amount')) || 0,
          contribution_frequency: freq || 'monthly',
        }),
      });

      if (res.status === 'success' && res.data) {
        const chama = res.data.chama;
        setCreatedChama(chama);
        setOnboardingLink(`${window.location.origin}/onboarding/${chama.id}`);
        setChamaCreated(true);
        toast({
          title: 'Chama Created Successfully!',
          description: 'Your new Chama circle is ready for members.',
        });
      } else {
        throw new Error(res.message ?? 'Failed to create chama.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(onboardingLink);
    setCopied(true);
    toast({
      title: 'Link Copied!',
      description: 'You can now share the onboarding link with potential members.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (chamaCreated && createdChama) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-tight">Chama Created!</h1>
          <p className="text-muted-foreground">
            <strong>{createdChama.name}</strong> is ready. You are the owner and manager — membership is a separate step.
          </p>
        </div>

        {/* Ownership vs Membership notice */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex gap-4 pt-6">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-1">You own this Chama but are not yet a member</p>
              <p className="text-muted-foreground">
                As the creator you have full management rights — you can approve members, configure rules, and
                view all data. To participate in contributions, loans, and payouts you must also join as a member
                using the onboarding link below.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" /> Share Onboarding Link
            </CardTitle>
            <CardDescription>
              Share this link with potential members. They fill in their details and you approve them from the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input value={onboardingLink} readOnly />
              <Button onClick={handleCopy} size="icon" variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="grid sm:grid-cols-3 gap-3">
          <Button className="w-full" asChild>
            <Link href={`/chamas/${createdChama.id}`}>Go to Dashboard</Link>
          </Button>
          <Button variant="secondary" className="w-full" asChild>
            <Link href={onboardingLink} target="_blank">
              <UserPlus className="mr-2 h-4 w-4" />
              Join as a Member
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={onboardingLink} target="_blank">Preview Form</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-sans text-3xl font-bold tracking-tight">Create a New Chama Circle</h1>
        <p className="text-muted-foreground">
          Set up a new, independent savings group with its own members and rules.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chama Details</CardTitle>
          <CardDescription>
            This information will be used to create a dedicated space for your Chama.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="chama-name">Chama Name</Label>
              <Input
                id="chama-name"
                name="chama-name"
                placeholder="e.g., Nairobi Tech Investors"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chama-description">Chama Description</Label>
              <Textarea
                id="chama-description"
                name="chama-description"
                placeholder="Briefly describe the purpose and goals of this Chama circle."
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contribution-amount">Contribution Amount (KES)</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">KES</span>
                  </div>
                  <Input
                    id="contribution-amount"
                    name="contribution-amount"
                    type="number"
                    placeholder="5000"
                    className="pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contribution-frequency">Contribution Frequency</Label>
                <Select name="contribution-frequency" defaultValue="monthly">
                  <SelectTrigger id="contribution-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>M-PESA Integration (Optional)</CardTitle>
                <CardDescription>
                  Connect a dedicated Paybill or Till Number for automated reconciliation.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mpesa-paybill">Paybill Number</Label>
                  <Input id="mpesa-paybill" placeholder="e.g., 888880" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpesa-account">Account Number</Label>
                  <Input id="mpesa-account" placeholder="e.g., CHAMA01" />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Circle...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Chama &amp; Get Onboarding Link
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
