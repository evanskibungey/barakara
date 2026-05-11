'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';

interface OnboardingFormProps {
  chamaId: string;
  /**
   * 'public'  → submits to /public/chamas/{id}/join → member stays pending
   * 'admin'   → submits to /chamas/{id}/members/direct-onboard → immediately active
   */
  mode: 'public' | 'admin';
  onSuccess?: (data?: any) => void;
  onCancel?: () => void;
  /** Show role selector — only relevant in admin mode */
  showRole?: boolean;
}

export function OnboardingForm({ chamaId, mode, onSuccess, onCancel, showRole = false }: OnboardingFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null);
  const [role, setRole] = useState('member');
  const idInputRef = useRef<HTMLInputElement>(null);
  const supportingInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData();

    data.append('applicant_name',        (form.elements.namedItem('fullName') as HTMLInputElement).value);
    data.append('applicant_email',       (form.elements.namedItem('email') as HTMLInputElement).value);
    data.append('applicant_phone',       (form.elements.namedItem('phone') as HTMLInputElement).value);
    data.append('applicant_national_id', (form.elements.namedItem('nationalId') as HTMLInputElement).value);
    data.append('applicant_location',    (form.elements.namedItem('location') as HTMLInputElement).value);
    data.append('applicant_occupation',  (form.elements.namedItem('occupation') as HTMLInputElement).value);
    data.append('introduction',          (form.elements.namedItem('introduction') as HTMLTextAreaElement).value ?? '');

    if (mode === 'admin' && showRole) {
      data.append('role', role);
    }

    if (idFile)         data.append('id_document',         idFile);
    if (supportingFile) data.append('supporting_document', supportingFile);

    const endpoint = mode === 'admin'
      ? `/chamas/${chamaId}/members/direct-onboard`
      : `/public/chamas/${chamaId}/join`;

    try {
      const res = await apiFetch<any>(endpoint, { method: 'POST', body: data });

      if (res.status === 'success') {
        if (mode === 'admin') {
          toast({
            title: 'Member Added',
            description: res.message ?? 'Member has been added and approved immediately.',
          });
        } else {
          toast({
            title: 'Application Submitted!',
            description: 'Your request to join has been sent for approval.',
          });
        }
        form.reset();
        setIdFile(null);
        setSupportingFile(null);
        onSuccess?.(res.data);
      } else {
        throw new Error(res.message ?? 'Submission failed.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-semibold border-b pb-2">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Legal Name</Label>
            <Input id="fullName" name="fullName" placeholder="Juma Kamau" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="juma.kamau@example.com" required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (M-PESA)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+254 712 345 678" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationalId">National ID Number</Label>
            <Input id="nationalId" name="nationalId" placeholder="12345678" required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location (City/Town)</Label>
            <Input id="location" name="location" placeholder="e.g., Nairobi" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" name="occupation" placeholder="e.g., Software Engineer" required />
          </div>
        </div>
      </div>

      {/* Role selector — admin mode only */}
      {mode === 'admin' && showRole && (
        <div className="space-y-2">
          <Label>Member Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="chairperson">Chairperson</SelectItem>
              <SelectItem value="secretary">Secretary</SelectItem>
              <SelectItem value="treasurer">Treasurer</SelectItem>
              <SelectItem value="guarantor">Guarantor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Document uploads */}
      <div className="space-y-4">
        <h3 className="font-semibold border-b pb-2">Statutory Documents</h3>

        <div className="space-y-2">
          <Label>National ID / Passport Copy</Label>
          <div
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => idInputRef.current?.click()}
          >
            {idFile ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{idFile.name}</span>
              </div>
            ) : (
              <>
                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Click to upload (JPG, PNG, PDF — max 5MB)</p>
              </>
            )}
            <input
              ref={idInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="sr-only"
              onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Other Supporting Documents (e.g., KRA PIN)</Label>
          <div
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => supportingInputRef.current?.click()}
          >
            {supportingFile ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{supportingFile.name}</span>
              </div>
            ) : (
              <>
                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Click to upload (JPG, PNG, PDF — max 5MB)</p>
              </>
            )}
            <input
              ref={supportingInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="sr-only"
              onChange={(e) => setSupportingFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="space-y-2">
        <Label htmlFor="introduction">Brief Introduction</Label>
        <Textarea
          id="introduction"
          name="introduction"
          placeholder="Tell us a little about yourself and why you want to join this Chama."
          className="min-h-[80px]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{mode === 'admin' ? 'Adding Member…' : 'Submitting…'}</>
          ) : (
            mode === 'admin' ? 'Add Member to Chama' : 'Submit Application'
          )}
        </Button>
      </div>
    </form>
  );
}
