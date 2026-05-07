import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Portal — Baraka Fintech Hub',
  description: 'Access your personal savings, loans and Chama activity.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
