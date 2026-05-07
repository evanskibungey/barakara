
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Award { id: number; title: string; category: string; description?: string; status: string; }

export default function AwardsManagementPage() {
  const { toast } = useToast();
  const [awards, setAwards] = useState<Award[]>([]);

  useEffect(() => {
    apiFetch<Award[]>('/admin/awards').then(res => {
      if (res.status === 'success' && res.data) setAwards(res.data);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <Badge variant="secondary" className="bg-green-900/50 text-green-300">Active</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const handleDelete = (awardTitle: string) => {
    toast({
        title: "Award Deleted",
        description: `The award template "${awardTitle}" has been successfully deleted.`
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Awards & Certificates
        </h1>
        <p className="text-muted-foreground">
          Manage award templates and criteria for member recognition.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Award Templates</CardTitle>
          <CardDescription>
            A list of all award types that can be issued to members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Award Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awards.map(award => (
                <TableRow key={award.id}>
                  <TableCell className="font-medium">{award.title}</TableCell>
                  <TableCell>{award.category}</TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">{award.description}</TableCell>
                  <TableCell>
                    {getStatusBadge(award.status)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/management/awards/edit/${award.id}`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete the <strong>{award.title}</strong> award template.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button variant="destructive" onClick={() => handleDelete(award.title)}>Delete Award</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <Button asChild>
              <Link href="/management/awards/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Award
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
