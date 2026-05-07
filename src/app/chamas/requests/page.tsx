'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Check, X, Search, Users, FileText, Phone, Mail,
  MapPin, Briefcase, CreditCard, UserCheck, Clock, Loader2, Eye,
  Building2, UserX,
} from 'lucide-react';

interface JoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  national_id?: string;
  location?: string;
  occupation?: string;
  avatar_url?: string;
  member_id?: string;
  introduction?: string;
  id_document_url?: string;
  supporting_document_url?: string;
  is_guest: boolean;
  created_at: string;
  chama: {
    id: number;
    name: string;
    logo_url?: string;
    pool_id?: string;
  };
}

export default function MemberRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [chamaFilter, setChamaFilter] = useState('all');
  const [selected, setSelected] = useState<JoinRequest | null>(null);
  const [actioning, setActioning] = useState<{ id: number; type: 'approve' | 'reject' } | null>(null);

  useEffect(() => {
    apiFetch<JoinRequest[]>('/member-requests')
      .then(res => {
        if (res.status === 'success' && res.data) setRequests(res.data as JoinRequest[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const uniqueChamas = useMemo(() => {
    const map = new Map<number, string>();
    requests.forEach(r => map.set(r.chama.id, r.chama.name));
    return Array.from(map.entries());
  }, [requests]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter(r => {
      const matchesSearch = !q
        || r.name.toLowerCase().includes(q)
        || r.email.toLowerCase().includes(q)
        || r.phone.toLowerCase().includes(q);
      const matchesChama = chamaFilter === 'all' || r.chama.id === Number(chamaFilter);
      return matchesSearch && matchesChama;
    });
  }, [requests, search, chamaFilter]);

  async function handleAction(req: JoinRequest, type: 'approve' | 'reject') {
    setActioning({ id: req.id, type });
    try {
      const res = await apiFetch(`/chamas/${req.chama.id}/requests/${req.id}/${type}`, { method: 'POST' });
      if (res.status === 'success') {
        setRequests(prev => prev.filter(r => r.id !== req.id));
        setSelected(null);
        toast({
          title: type === 'approve' ? 'Member Approved' : 'Request Rejected',
          description: type === 'approve'
            ? `${req.name} has been added to ${req.chama.name}.`
            : `${req.name}'s application has been rejected.`,
        });
      } else {
        throw new Error(res.message ?? 'Action failed.');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setActioning(null);
    }
  }

  const initials = (name: string) =>
    name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/chamas"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-bold tracking-tight">Membership Requests</h1>
          <p className="text-muted-foreground text-sm">
            Review and action all pending join applications across your Chama circles.
          </p>
        </div>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {filtered.length} pending
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or phone…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={chamaFilter} onValueChange={setChamaFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Filter by Chama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chamas</SelectItem>
            {uniqueChamas.map(([id, name]) => (
              <SelectItem key={id} value={String(id)}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            Approve to immediately add as an active member, or reject to decline the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="rounded-full bg-muted p-4">
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium">No pending requests</p>
              <p className="text-sm text-muted-foreground">
                {search || chamaFilter !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'All membership applications have been reviewed.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Chama</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Applied</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(req => {
                  const isActioning = actioning?.id === req.id;
                  return (
                    <TableRow key={req.id}>
                      {/* Applicant */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={req.avatar_url} />
                            <AvatarFallback className="text-xs">{initials(req.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium leading-tight">{req.name}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{req.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Chama */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={req.chama.logo_url} />
                            <AvatarFallback className="text-[10px]">
                              {initials(req.chama.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-tight">{req.chama.name}</p>
                            {req.chama.pool_id && (
                              <p className="text-xs text-muted-foreground">{req.chama.pool_id}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">{req.phone}</span>
                        </div>
                      </TableCell>

                      {/* Applied date */}
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString('en-KE', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </TableCell>

                      {/* Type */}
                      <TableCell className="hidden lg:table-cell">
                        {req.is_guest ? (
                          <Badge variant="outline" className="text-xs">Guest</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-blue-900/40 text-blue-300">Registered</Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setSelected(req)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            disabled={isActioning}
                            onClick={() => handleAction(req, 'reject')}
                          >
                            {isActioning && actioning.type === 'reject'
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <X className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                            disabled={isActioning}
                            onClick={() => handleAction(req, 'approve')}
                          >
                            {isActioning && actioning.type === 'approve'
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Check className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selected && (
        <Dialog open onOpenChange={open => !open && setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review the full application before approving or rejecting.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {/* Applicant header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selected.avatar_url} />
                  <AvatarFallback className="text-lg">{initials(selected.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base">{selected.name}</p>
                  {selected.member_id && (
                    <p className="text-xs text-muted-foreground">{selected.member_id}</p>
                  )}
                  {selected.is_guest ? (
                    <Badge variant="outline" className="text-xs mt-1">Guest applicant</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs mt-1 bg-blue-900/40 text-blue-300">Registered user</Badge>
                  )}
                </div>
              </div>

              {/* Chama target */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Requesting to join</p>
                  <p className="font-medium text-sm">{selected.chama.name}</p>
                  {selected.chama.pool_id && (
                    <p className="text-xs text-muted-foreground">{selected.chama.pool_id}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="ml-auto text-xs" asChild>
                  <Link href={`/chamas/${selected.chama.id}`}>View Chama</Link>
                </Button>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{selected.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{selected.phone}</span>
                </div>
                {selected.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{selected.location}</span>
                  </div>
                )}
                {selected.occupation && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{selected.occupation}</span>
                  </div>
                )}
                {selected.national_id && (
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <CreditCard className="h-3.5 w-3.5 shrink-0" />
                    <span>ID: {selected.national_id}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Applied {new Date(selected.created_at).toLocaleDateString('en-KE', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Introduction */}
              {selected.introduction && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Introduction</p>
                  <p className="text-sm leading-relaxed bg-muted/50 rounded-md p-3">
                    {selected.introduction}
                  </p>
                </div>
              )}

              {/* Documents */}
              {(selected.id_document_url || selected.supporting_document_url) && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.id_document_url && (
                      <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                        <a href={selected.id_document_url} target="_blank" rel="noreferrer">
                          <FileText className="h-3.5 w-3.5" /> ID Document
                        </a>
                      </Button>
                    )}
                    {selected.supporting_document_url && (
                      <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                        <a href={selected.supporting_document_url} target="_blank" rel="noreferrer">
                          <FileText className="h-3.5 w-3.5" /> Supporting Doc
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/40 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  disabled={!!actioning}
                  onClick={() => handleAction(selected, 'reject')}
                >
                  {actioning?.type === 'reject' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
                  Reject
                </Button>
                <Button
                  className="flex-1"
                  disabled={!!actioning}
                  onClick={() => handleAction(selected, 'approve')}
                >
                  {actioning?.type === 'approve' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                  Approve & Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
