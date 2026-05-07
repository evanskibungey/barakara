
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Target,
  TrendingUp,
  Users,
  Receipt,
  ShieldCheck,
  LineChart,
  FileText,
  Briefcase,
  GraduationCap,
  Send,
  Store,
  LifeBuoy,
  Award,
  FileSignature,
  UserCheck,
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { useRole } from '@/hooks/use-role';

export function MainNav() {
  const pathname = usePathname();
  const { role } = useRole();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/chamas', label: 'Chama Circles', icon: Users },
    { href: '/chamas/requests', label: 'Member Requests', icon: UserCheck },
    { href: '/crowdfunding', label: 'Milestone Drives', icon: Target },
    { href: '/investments', label: 'Investments', icon: TrendingUp },
    { href: '/marketplace', label: 'Marketplace', icon: Store },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/documentation', label: 'Documentation', icon: FileSignature },
    { href: '/accountability', label: 'BI Dashboard', icon: ShieldCheck },
  ];

  const bottomMenuItems = [
      { href: '/analysis', label: 'Analysis', icon: LineChart },
      { href: '/learning', label: 'Learning', icon: GraduationCap },
      { href: '/communications', label: 'Communications', icon: Send },
      { href: '/support', label: 'Support', icon: LifeBuoy },
      { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const managementMenuItems = [
    { href: '/management', label: 'Platform', icon: Briefcase },
    { href: '/management/learning', label: 'Learning', icon: GraduationCap },
    { href: '/management/awards', label: 'Awards', icon: Award },
  ];

  const showManagement = role === 'admin';

  // All registered hrefs — used to ensure a more-specific sibling wins over its parent
  const allHrefs = [
    ...menuItems.map(i => i.href),
    ...bottomMenuItems.map(i => i.href),
    ...managementMenuItems.map(i => i.href),
  ];

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    if (!pathname.startsWith(href)) return false;
    // Yield to a more specific sibling that also matches
    return !allHrefs.some(
      other => other !== href && other.startsWith(href) && pathname.startsWith(other),
    );
  }

  return (
    <SidebarMenu>
      {menuItems.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            asChild
            isActive={isActive(href)}
            tooltip={label}
          >
            <Link href={href}>
              <Icon />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      
      {showManagement && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
              {managementMenuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    tooltip={label}
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarGroup>
        </>
      )}

      <SidebarSeparator />
      {bottomMenuItems.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            asChild
            isActive={isActive(href)}
            tooltip={label}
          >
            <Link href={href}>
              <Icon />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
