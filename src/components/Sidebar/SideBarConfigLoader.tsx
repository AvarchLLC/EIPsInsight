'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sidebarConfig } from './slidebarConfig';
import { useSidebar } from './SideBarContext';

export default function SidebarConfigLoader() {
  const pathname = usePathname();
  const { setSections } = useSidebar();

  useEffect(() => {
    setSections(pathname ? sidebarConfig[pathname] || [] : []);
  }, [pathname, setSections]);

  return null;
}
