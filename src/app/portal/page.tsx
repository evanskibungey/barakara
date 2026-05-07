'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPortalToken } from '@/lib/portal-api';
import { Loader2 } from 'lucide-react';

export default function PortalRoot() {
  const router = useRouter();

  useEffect(() => {
    const token = getPortalToken();
    router.replace(token ? '/portal/dashboard' : '/portal/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
