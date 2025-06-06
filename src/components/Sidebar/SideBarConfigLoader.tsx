'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SideBarContext';

export default function SidebarConfigLoader() {
  const pathname = usePathname();
  const { setRouteRoot } = useSidebar();

  useEffect(() => {
    const root = '/' + (pathname?.split('/')[1] || '');
    setRouteRoot(root.toLowerCase());
  }, [pathname, setRouteRoot]);

  return null;
}