'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { OnboardingForm } from '@/components/onboarding-form';

interface ChamaPublicInfo {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  membership_fee?: number;
}

export default function OnboardingPage() {
  const params = useParams();
  const chamaId = params.id as string;

  const [chama, setChama] = useState<ChamaPublicInfo | null>(null);
  const [loadingChama, setLoadingChama] = useState(true);
  const [chamaError, setChamaError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!chamaId) return;
    apiFetch<ChamaPublicInfo>(`/public/chamas/${chamaId}`)
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setChama(res.data);
        } else {
          setChamaError(true);
        }
      })
      .catch(() => setChamaError(true))
      .finally(() => setLoadingChama(false));
  }, [chamaId]);

  if (loadingChama) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (chamaError || !chama) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle>Invitation Not Found</CardTitle>
            <CardDescription>
              This onboarding link is invalid or has expired. Please contact the Chama administrator
              for a new link.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 border border-green-700/40">
                <Check className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <CardTitle className="font-headline text-2xl">Application Received!</CardTitle>
            <CardDescription>
              The administrators of <span className="font-medium text-foreground">{chama.name}</span> have
              been notified. You will be able to access the member portal once your application is approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* What happens next */}
            <div className="rounded-lg bg-muted/50 text-left p-4 space-y-3 text-sm">
              <p className="font-medium text-foreground">What happens next?</p>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs text-primary font-bold mt-0.5">1</span>
                  <span>The Chama administrator reviews your application.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs text-primary font-bold mt-0.5">2</span>
                  <span>Once approved, your member account is created automatically.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs text-primary font-bold mt-0.5">3</span>
                  <span>Sign in to the Member Portal using the phone number you provided on this form.</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href="/portal/login">Go to Member Portal</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const initials = chama.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Cover image */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1080&auto=format&fit=crop"
          alt="Chama cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative -mt-16 px-4 md:px-8 pb-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                {chama.logo_url && <AvatarImage src={chama.logo_url} alt={chama.name} />}
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="font-headline text-3xl">Join {chama.name}</CardTitle>
            <CardDescription>
              {chama.description ??
                'Complete the form below to apply. Your application will be reviewed by the Chama administrators.'}
            </CardDescription>
            {chama.membership_fee && chama.membership_fee > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Membership fee:{' '}
                <span className="font-semibold text-foreground">
                  KES {chama.membership_fee.toLocaleString()}
                </span>
              </p>
            )}
          </CardHeader>

          <CardContent>
            <OnboardingForm
              chamaId={chamaId}
              mode="public"
              onSuccess={() => setSubmitted(true)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
