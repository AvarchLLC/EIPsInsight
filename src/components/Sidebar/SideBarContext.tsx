// // // 'use client';
// // // import React, { createContext, useContext, useState } from 'react';

// // // export interface SidebarItem {
// // //   label: string;
// // //   icon: React.ElementType;
// // //   id: string;
// // // }

// // // const SidebarContext = createContext<{
// // //   isCollapsed: boolean;
// // //   toggleSidebar: () => void;
// // //   sections: SidebarItem[];
// // //   setSections: (items: SidebarItem[]) => void;
// // // }>({
// // //   isCollapsed: false,
// // //   toggleSidebar: () => {},
// // //   sections: [],
// // //   setSections: () => {},
// // // });

// // // export const useSidebar = () => useContext(SidebarContext);

// // // export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
// // //   const [isCollapsed, setIsCollapsed] = useState(true);
// // //   const [sections, setSections] = useState<SidebarItem[]>([]);

// // //   const toggleSidebar = () => setIsCollapsed((prev) => !prev);

// // //   return (
// // //     <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, sections, setSections }}>
// // //       {children}
// // //     </SidebarContext.Provider>
// // //   );
// // // };

// // // // // 'use client';

// // // // // import React, { createContext, useContext, useState, useMemo } from 'react';
// // // // // import { sidebarConfig } from './slidebarConfig';   // ← your existing file

// // // // // /* ---------- types ---------- */
// // // // // export interface SidebarItem {
// // // // //   label: string;
// // // // //   icon: React.ElementType;
// // // // //   id: string;
// // // // //   children?: SidebarItem[];
// // // // // }

// // // // // /* ---------- context ---------- */
// // // // // interface SidebarCtx {
// // // // //   isCollapsed: boolean;
// // // // //   toggleSidebar: () => void;

// // // // //   /* upgrade toggle */
// // // // //   selectedUpgrade: 'pectra' | 'fusaka';
// // // // //   setSelectedUpgrade: (u: 'pectra' | 'fusaka') => void;

// // // // //   /* computed menu for current route */
// // // // //   sections: SidebarItem[];
// // // // //   setRouteRoot: (root: string) => void;   // called by SidebarConfigLoader
// // // // // }

// // // // // const SidebarContext = createContext<SidebarCtx | null>(null);

// // // // // /* ---------- provider ---------- */
// // // // // export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
// // // // //   const [isCollapsed, setIsCollapsed]        = useState(true);
// // // // //   const [routeRoot, setRouteRoot]            = useState('/');                 // '/upgrade', '/eip', etc.
// // // // //   const [selectedUpgrade, setSelectedUpgrade]= useState<'pectra' | 'fusaka'>('pectra');

// // // // //   /* toggle collapse */
// // // // //   const toggleSidebar = () => setIsCollapsed(p => !p);

// // // // //   /* compute sections every time routeRoot or selectedUpgrade changes */
// // // // //   const sections = useMemo<SidebarItem[]>(() => {
// // // // //     if (routeRoot !== '/upgrade') {
// // // // //       return sidebarConfig[routeRoot] ?? [];
// // // // //     }

// // // // //     /* ---- special filtering for /upgrade ---- */
// // // // //     const base = sidebarConfig['/upgrade'] ?? [];
// // // // //     return base.map((item) => {
// // // // //       if (item.id === 'pectrafusaka') {
// // // // //         return {
// // // // //           ...item,
// // // // //           /* show only the child that matches the dropdown */
// // // // //           children: item.children?.filter(c => c.id === selectedUpgrade),
// // // // //         };
// // // // //       }
// // // // //       return item;
// // // // //     });
// // // // //   }, [routeRoot, selectedUpgrade]);

// // // // //   const value: SidebarCtx = {
// // // // //     isCollapsed,
// // // // //     toggleSidebar,
// // // // //     selectedUpgrade,
// // // // //     setSelectedUpgrade,
// // // // //     sections,
// // // // //     setRouteRoot,            // exposed so SidebarConfigLoader can tell us the path root
// // // // //   };

// // // // //   return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
// // // // // };

// // // // // /* ---------- hook ---------- */
// // // // // export const useSidebar = () => {
// // // // //   const ctx = useContext(SidebarContext);
// // // // //   if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>');
// // // // //   return ctx;
// // // // // };


// // // // // SideBarContext.tsx
// // // // 'use client';
// // // // import React, { createContext, useContext, useState, useMemo } from 'react';
// // // // import { sidebarConfig } from './slidebarConfig';

// // // // export interface SidebarItem {
// // // //   label: string;
// // // //   icon: React.ElementType;
// // // //   id: string;
// // // //   children?: SidebarItem[];
// // // // }

// // // // interface SidebarCtx {
// // // //   isCollapsed: boolean;
// // // //   toggleSidebar: () => void;
// // // //   selectedUpgrade: 'pectra' | 'fusaka';
// // // //   setSelectedUpgrade: (u: 'pectra' | 'fusaka') => void;
// // // //   sections: SidebarItem[];
// // // //   setRouteRoot: (root: string) => void;
// // // // }

// // // // const SidebarContext = createContext<SidebarCtx | null>(null);

// // // // export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
// // // //   const [isCollapsed, setIsCollapsed] = useState(true);
// // // //   const [routeRoot, setRouteRoot] = useState('/');
// // // //   const [selectedUpgrade, setSelectedUpgrade] = useState<'pectra' | 'fusaka'>('pectra');

// // // //   const toggleSidebar = () => setIsCollapsed(prev => !prev);

// // // //   const sections = useMemo<SidebarItem[]>(() => {
// // // //     if (routeRoot !== '/upgrade') {
// // // //       return sidebarConfig[routeRoot] ?? [];
// // // //     }

// // // //     const base = sidebarConfig['/upgrade'] ?? [];
// // // //     return base.map(item => {
// // // //       if (item.id === 'pectrafusaka') {
// // // //         return {
// // // //           ...item,
// // // //           children: item.children?.filter(c => c.id === selectedUpgrade),
// // // //         };
// // // //       }
// // // //       return item;
// // // //     });
// // // //   }, [routeRoot, selectedUpgrade]);

// // // //   const value: SidebarCtx = {
// // // //     isCollapsed,
// // // //     toggleSidebar,
// // // //     selectedUpgrade,
// // // //     setSelectedUpgrade,
// // // //     sections,
// // // //     setRouteRoot,
// // // //   };

// // // //   return (
// // // //     <SidebarContext.Provider value={value}>
// // // //       {children}
// // // //     </SidebarContext.Provider>
// // // //   );
// // // // };

// // // // export const useSidebar = () => {
// // // //   const ctx = useContext(SidebarContext);
// // // //   if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>');
// // // //   return ctx;
// // // // };

// // // 'use client';
// // // import React, { createContext, useContext, useState, useMemo } from 'react';
// // // import { sidebarConfig } from './slidebarConfig';


// // // const defaultContext = {
// // //   isCollapsed: false,
// // //   toggleSidebar: () => {},
// // //   selectedUpgrade: 'pectra' as 'pectra' | 'fusaka',
// // //   setSelectedUpgrade: (u: 'pectra' | 'fusaka') => {},
// // //   sections: [] as SidebarItem[],
// // //   setSections: (items: SidebarItem[]) => {},
// // //   setRouteRoot: (root: string) => {},
// // // };


// // // export interface SidebarItem {
// // //   label: string;
// // //   icon: React.ElementType;
// // //   id: string;
// // //   children?: SidebarItem[];
// // // }

// // // interface SidebarCtx {
// // //   isCollapsed: boolean;
// // //   toggleSidebar: () => void;

// // //   /* upgrade toggle */
// // //   selectedUpgrade: 'pectra' | 'fusaka';
// // //   setSelectedUpgrade: (u: 'pectra' | 'fusaka') => void;

// // //   /* sections management */
// // //   sections: SidebarItem[];
// // //   setSections: (items: SidebarItem[]) => void; // Add setSections back

// // //   /* route management */
// // //   setRouteRoot: (root: string) => void;
// // // }

// // // const SidebarContext = createContext<SidebarCtx | null>(null);


// // // export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
// // //   const [isCollapsed, setIsCollapsed] = useState(true);
// // //   const [manualSections, setManualSections] = useState<SidebarItem[]>([]); // For manual control
// // //   const [routeRoot, setRouteRoot] = useState('/');
// // //   const [selectedUpgrade, setSelectedUpgrade] = useState<'pectra' | 'fusaka'>('pectra');

// // //   const toggleSidebar = () => setIsCollapsed(prev => !prev);

// // //   // Computed sections based on route and upgrade
// // //   const computedSections = useMemo<SidebarItem[]>(() => {
// // //     if (routeRoot !== '/upgrade') {
// // //       return sidebarConfig[routeRoot] ?? [];
// // //     }

// // //     const base = sidebarConfig['/upgrade'] ?? [];
// // //     return base.map(item => {
// // //       if (item.id === 'pectrafusaka') {
// // //         return {
// // //           ...item,
// // //           children: item.children?.filter(c => c.id === selectedUpgrade),
// // //         };
// // //       }
// // //       return item;
// // //     });
// // //   }, [routeRoot, selectedUpgrade]);

// // //   // Final sections - either manually set or computed
// // //   const sections = manualSections.length > 0 ? manualSections : computedSections;

// // //   const value: SidebarCtx = {
// // //     isCollapsed,
// // //     toggleSidebar,
// // //     selectedUpgrade,
// // //     setSelectedUpgrade,
// // //     sections,
// // //     setSections: setManualSections, // Connect to manual sections
// // //     setRouteRoot,
// // //   };

// // //   return (
// // //     <SidebarContext.Provider value={value}>
// // //       {children}
// // //     </SidebarContext.Provider>
// // //   );
// // // };

// // // export const useSidebar = () => {
// // //   const ctx = useContext(SidebarContext);

// // //   // During server-side rendering, return default values
// // //   if (typeof window === 'undefined') {
// // //     return defaultContext;
// // //   }

// // //   // On client side, throw error if context is missing
// // //   if (!ctx) {
// // //     throw new Error('useSidebar must be used inside <SidebarProvider>');
// // //   }

// // //   return ctx;
// // // };

// // // components/Sidebar/SideBarContext.tsx
// // 'use client';
// // import React, { createContext, useContext, useState, useMemo } from 'react';
// // import { sidebarConfig } from './slidebarConfig';

// // interface SidebarItem {
// //   label: string;
// //   icon: React.ElementType;
// //   id: string;
// //   children?: SidebarItem[];
// // }

// // interface SidebarCtx {
// //   isCollapsed: boolean;
// //   toggleSidebar: () => void;
// //   selectedUpgrade: 'pectra' | 'fusaka';
// //   setSelectedUpgrade: (u: 'pectra' | 'fusaka') => void;
// //   sections: SidebarItem[];
// //   setRouteRoot: (root: string) => void;
// // }

// // // Default context values
// // const defaultContext: SidebarCtx = {
// //   isCollapsed: false,
// //   toggleSidebar: () => { },
// //   selectedUpgrade: 'pectra',
// //   setSelectedUpgrade: () => { },
// //   sections: [],
// //   setRouteRoot: () => { },
// // };

// // const SidebarContext = createContext<SidebarCtx | null>(null);

// // export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
// //   const [isCollapsed, setIsCollapsed] = useState(true);
// //   const [routeRoot, setRouteRoot] = useState('/');
// //   const [selectedUpgrade, setSelectedUpgrade] = useState<'pectra' | 'fusaka'>('pectra');

// //   const toggleSidebar = () => setIsCollapsed(prev => !prev);

// //   const sections = useMemo<SidebarItem[]>(() => {
// //     if (routeRoot !== '/upgrade') {
// //       return sidebarConfig[routeRoot] ?? [];
// //     }

// //     const base = sidebarConfig['/upgrade'] ?? [];
// //     return base.map(item => {
// //       if (item.id === 'pectrafusaka') {
// //         // Show only the selected upgrade child
// //         return {
// //           ...item,
// //           children: item.children?.filter(c => c.id === selectedUpgrade),
// //         };
// //       } else if (item.id === 'upgrade-table') {
// //         // Customize label based on selected upgrade
// //         return {
// //           ...item,
// //           label: `${selectedUpgrade.charAt(0).toUpperCase() + selectedUpgrade.slice(1)} Table`,
// //         };
// //       }
// //       return item;
// //     });
// //   }, [routeRoot, selectedUpgrade]);


// //   const value: SidebarCtx = {
// //     isCollapsed,
// //     toggleSidebar,
// //     selectedUpgrade,
// //     setSelectedUpgrade,
// //     sections,
// //     setRouteRoot,
// //   };

// //   return (
// //     <SidebarContext.Provider value={value}>
// //       {children}
// //     </SidebarContext.Provider>
// //   );
// // };

// // export const useSidebar = () => {
// //   const ctx = useContext(SidebarContext);
// //   if (!ctx) {
// //     return {
// //       isCollapsed: false,
// //       toggleSidebar: () => { },
// //       selectedUpgrade: 'pectra',
// //       setSelectedUpgrade: () => { },
// //       sections: [],
// //       setRouteRoot: () => { },
// //     };
// //   }
// //   return ctx;
// // };

// // components/Sidebar/SideBarContext.tsx
// 'use client';
// import React, { createContext, useContext, useState, useMemo } from 'react';
// import { sidebarConfig } from './slidebarConfig';

// interface SidebarItem {
//   label: string;
//   icon: React.ElementType;
//   id: string;
//   children?: SidebarItem[];
// }

// interface SidebarCtx {
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
//   selectedUpgrade: 'pectra' | 'fusaka';
//   setSelectedUpgrade: (u: 'pectra' | 'fusaka') => void;
//   sections: SidebarItem[];
//   setSections: (items: SidebarItem[]) => void; // Add this
//   setRouteRoot: (root: string) => void;
// }

// // Default context values
// const defaultContext: SidebarCtx = {
//   isCollapsed: false,
//   toggleSidebar: () => { },
//   selectedUpgrade: 'pectra',
//   setSelectedUpgrade: () => { },
//   sections: [],
//   setSections: () => { }, // Add this
//   setRouteRoot: () => { },
// };

// const SidebarContext = createContext<SidebarCtx | null>(null);

// export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [routeRoot, setRouteRoot] = useState('/');
//   const [selectedUpgrade, setSelectedUpgrade] = useState<'pectra' | 'fusaka'>('pectra');
//   const [manualSections, setManualSections] = useState<SidebarItem[] | null>(null); // Add this

//   const toggleSidebar = () => setIsCollapsed(prev => !prev);

//   const computedSections = useMemo<SidebarItem[]>(() => {
//     if (routeRoot !== '/upgrade') {
//       return sidebarConfig[routeRoot] ?? [];
//     }

//     const base = sidebarConfig['/upgrade'] ?? [];
//     return base.map(item => {
//       if (item.id === 'pectrafusaka') {
//         return {
//           ...item,
//           children: item.children?.filter(c => c.id === selectedUpgrade),
//         };
//       } else if (item.id === 'upgrade-table') {
//         return {
//           ...item,
//           label: `${selectedUpgrade.charAt(0).toUpperCase() + selectedUpgrade.slice(1)} Table`,
//         };
//       }
//       return item;
//     });
//   }, [routeRoot, selectedUpgrade]);

//   // Final sections: manualSections if set, otherwise computedSections
//   const sections = manualSections !== null ? manualSections : computedSections;

//   const value: SidebarCtx = {
//     isCollapsed,
//     toggleSidebar,
//     selectedUpgrade,
//     setSelectedUpgrade,
//     sections,
//     setSections: setManualSections, // Add this
//     setRouteRoot,
//   };

//   return (
//     <SidebarContext.Provider value={value}>
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const useSidebar = () => {
//   const ctx = useContext(SidebarContext);
//   if (!ctx) {
//     return defaultContext;
//   }
//   return ctx;
// };

'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { sidebarConfig } from './slidebarConfig';

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  id: string;
  children?: SidebarItem[];
}

interface ViewBasedConfig {
  type: SidebarItem[];
  status: SidebarItem[];
}

interface SidebarCtx {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  selectedUpgrade: 'pectra' | 'fusaka';
  setSelectedUpgrade: (u: 'pectra' | 'fusaka') => void;
  sections: SidebarItem[];
  setSections: (items: SidebarItem[]) => void;
  setRouteRoot: (root: string) => void;
  view: 'type' | 'status';
  setView: (v: 'type' | 'status') => void;
}

const defaultContext: SidebarCtx = {
  isCollapsed: false,
  toggleSidebar: () => {},
  selectedUpgrade: 'pectra',
  setSelectedUpgrade: () => {},
  sections: [],
  setSections: () => {},
  setRouteRoot: () => {},
  view: 'type',
  setView: () => {},
};

const SidebarContext = createContext<SidebarCtx | null>(null);

function isViewBasedConfig(
  config: SidebarItem[] | ViewBasedConfig
): config is ViewBasedConfig {
  return typeof config === 'object' && !Array.isArray(config) && 'type' in config && 'status' in config;
}

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [routeRoot, setRouteRoot] = useState('/');
  const [selectedUpgrade, setSelectedUpgrade] = useState<'pectra' | 'fusaka'>('pectra');
  const [manualSections, setManualSections] = useState<SidebarItem[] | null>(null);

  const viewParam = searchParams?.get('view') === 'status' ? 'status' : 'type';
  const [view, setView] = useState<'type' | 'status'>(viewParam);

  useEffect(() => {
    setView(viewParam);
  }, [viewParam]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const computedSections = useMemo<SidebarItem[]>(() => {
    const config = sidebarConfig[routeRoot];

    if (!config) return [];

    if (routeRoot !== '/upgrade') {
      if (isViewBasedConfig(config)) {
        // config is { type: SidebarItem[], status: SidebarItem[] }
        return config[view] ?? [];
      }

      // If config is an array (fallback)
      if (Array.isArray(config)) {
        return config;
      }

      return [];
    }

    // routeRoot === '/upgrade' is an array
    const base = Array.isArray(config) ? config : [];

    return base.map((item: SidebarItem) => {
      if (item.id === 'pectrafusaka') {
        return {
          ...item,
          children: item.children?.filter(
            (c: SidebarItem) => c.id === selectedUpgrade
          ),
        };
      } else if (item.id === 'upgrade-table') {
        return {
          ...item,
          label:
            selectedUpgrade.charAt(0).toUpperCase() +
            selectedUpgrade.slice(1) +
            ' Table',
        };
      }
      return item;
    });
  }, [routeRoot, selectedUpgrade, view]);

  const sections = manualSections !== null ? manualSections : computedSections;

  const value: SidebarCtx = {
    isCollapsed,
    toggleSidebar,
    selectedUpgrade,
    setSelectedUpgrade,
    sections,
    setSections: setManualSections,
    setRouteRoot,
    view,
    setView,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    return defaultContext;
  }
  return ctx;
};