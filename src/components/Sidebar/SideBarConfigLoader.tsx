'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sidebarConfig } from './slidebarConfig';
import { useSidebar } from './SideBarContext';

export default function SidebarConfigLoader() {
  const pathname = usePathname();
  const { setSections } = useSidebar();

  useEffect(() => {
    const firstSegment = '/' + pathname?.split('/')[1]; // Extracts '/issue' from '/issue/EIPs/70'
    setSections(firstSegment ? sidebarConfig[firstSegment] || [] : []);
  }, [pathname, setSections]);

  return null;
}
