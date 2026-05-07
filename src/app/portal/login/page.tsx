'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { portalFetch, PORTAL_TOKEN_KEY, PORTAL_USER_KEY, getPortalToken } from '@/lib/portal-api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Phone, ArrowLeft, ShieldCheck, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'phone' | 'otp' | 'pending_approval';

export default function PortalLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (getPortalToken()) router.replace('/portal/dashboard');
  }, [router]);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const res = await portalFetch<{ state: string; dev_otp?: string; expires_in?: number }>(
        '/portal/auth/request-otp',
        { method: 'POST', body: JSON.stringify({ phone: phone.trim() }) },
      );
      if (res.status === 'success') {
        const state = res.data?.state;
        if (state === 'pending_approval') {
          setStep('pending_approval');
        } else if (state === 'otp_sent') {
          setStep('otp');
          setCountdown(60);
          setOtp(['', '', '', '', '', '']);
          if (res.data?.dev_otp) setDevOtp(res.data.dev_otp);
          setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } else {
          // state === 'not_found' — show generic error without revealing details
          toast({ title: 'Not found', description: 'No active account was found for this phone number.', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Error', description: res.message ?? 'Failed to send OTP.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(digits: string[]) {
    const code = digits.join('');
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = await portalFetch<{ token: string; user: any }>(
        '/portal/auth/verify-otp',
        { method: 'POST', body: JSON.stringify({ phone: phone.trim(), otp: code }) },
      );
      if (res.status === 'success' && res.data) {
        localStorage.setItem(PORTAL_TOKEN_KEY, res.data.token);
        localStorage.setItem(PORTAL_USER_KEY, JSON.stringify(res.data.user));
        router.replace('/portal/dashboard');
      } else {
        toast({ title: 'Invalid OTP', description: res.message ?? 'The code was incorrect or has expired.', variant: 'destructive' });
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch {
      toast({ title: 'Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every(d => d !== '')) handleVerifyOtp(next);
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setOtp(digits);
      otpRefs.current[5]?.focus();
      handleVerifyOtp(digits);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Cover strip */}
      <div className="absolute inset-x-0 top-0 h-56 overflow-hidden -z-10">
        <Image
          src="https://images.unsplash.com/photo-1611348524140-53c9a25263d6?q=80&w=1080&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Logo / brand */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">
          B
        </div>
        <p className="text-lg font-semibold tracking-tight">Baraka Member Portal</p>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Your personal window into your Chama savings, loans&nbsp;and activity.
        </p>
      </div>

      <Card className="w-full max-w-sm">
        {step === 'phone' ? (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription>
                Enter the M-PESA phone number you used when registering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 712 345 678"
                      className="pl-9"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending OTP…</>
                    : 'Send OTP'}
                </Button>
              </form>
            </CardContent>
          </>
        ) : step === 'pending_approval' ? (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-900/30 border border-yellow-700/40">
                  <Clock className="h-7 w-7 text-yellow-400" />
                </div>
              </div>
              <CardTitle className="text-xl">Waiting for Approval</CardTitle>
              <CardDescription className="pt-1">
                Your membership application is still under review. You will be able to sign in once
                the Chama administrator approves your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  <span>Application submitted successfully</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Awaiting administrator approval</span>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Once approved, return here and sign in with{' '}
                <span className="font-medium text-foreground">{phone}</span>.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { setStep('phone'); setPhone(''); }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Try a different number
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setStep('phone')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-xl">Enter OTP</CardTitle>
              </div>
              <CardDescription className="pt-1">
                A 6-digit code was sent to <span className="font-medium text-foreground">{phone}</span>.
                Enter it below to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Dev OTP hint */}
              {devOtp && (
                <div className="flex items-center gap-2 rounded-md bg-yellow-900/30 border border-yellow-700/40 px-3 py-2 text-xs text-yellow-300">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Dev mode — your OTP is <span className="font-mono font-bold">{devOtp}</span></span>
                </div>
              )}

              {/* OTP boxes */}
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    disabled={loading}
                    className={cn(
                      'h-12 w-10 rounded-md border bg-input text-center text-lg font-mono font-semibold',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                      'disabled:opacity-50 transition-colors',
                    )}
                  />
                ))}
              </div>

              {loading && (
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Resend */}
              <div className="flex justify-center">
                {countdown > 0 ? (
                  <p className="text-xs text-muted-foreground">Resend in {countdown}s</p>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1"
                    disabled={loading}
                    onClick={() => { setStep('phone'); setOtp(['','','','','','']); setDevOtp(null); }}
                  >
                    <RefreshCw className="h-3 w-3" /> Resend OTP
                  </Button>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Having trouble? Contact your Chama administrator.
      </p>
    </div>
  );
}
