
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface MemberUploaderProps {
  chamaName: string;
}

export function MemberUploader({ chamaName }: MemberUploaderProps) {
  const { toast } = useToast();
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleUpload = () => {
    toast({
      title: 'Upload Successful!',
      description: `${fileName} has been processed and members have been added to ${chamaName}.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadCloud className="mr-2 h-4 w-4" /> Upload Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Onboard Members</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file to add multiple members to {chamaName} at once.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>1. Download Template</Label>
            <p className="text-sm text-muted-foreground">
              To ensure your data is mapped correctly, please download and use our template.
            </p>
            <Button variant="outline" asChild>
                <Link href="/member-upload-template.csv" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                </Link>
            </Button>
          </div>
          <div className="space-y-2">
            <Label>2. Upload Completed File</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary">
              <label htmlFor="member-file-upload" className="cursor-pointer">
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {fileName ? `Selected: ${fileName}` : 'Click or drag file to this area to upload'}
                </p>
                <Input id="member-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleUpload} disabled={!fileName}>
              Upload & Add Members
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
