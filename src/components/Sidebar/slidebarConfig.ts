// sidebarConfig.ts
import {
  LuHome,
  LuWrench,
  LuInfo,
  LuBarChartBig,
  LuDatabase,
  LuSearch,
  LuCheckCircle2,
  LuArchive,
  LuClock4,
  LuEye,
  LuFileText,
  LuBan,
  LuPauseCircle
} from 'react-icons/lu';

export const sidebarConfig: Record<string, { label: string; icon: React.ElementType; id: string }[]> = {
  '/': [
    { label: 'All EIPs', icon: LuHome, id: 'all' },
    { label: 'Our Tools', icon: LuWrench, id: 'ourtools' },
    { label: 'What is EIPs Insights?', icon: LuInfo, id: 'what' },
    { label: 'EIP Status Changes by Year', icon: LuBarChartBig, id: 'statuschanges' },
    { label: 'Dashboard', icon: LuDatabase, id: 'dashboard' },
  ],
  '/About': [
    { label: 'What is EIPs Insights', icon: LuInfo, id: 'what' }
  ],
  '/all': [
    { label: 'Search EIP', icon: LuSearch, id: 'searchEIP' },
    { label: 'Living', icon: LuCheckCircle2, id: 'living' },
    { label: 'Final', icon: LuArchive, id: 'final' },
    { label: 'Last Call', icon: LuClock4, id: 'lastcall' },
    { label: 'Review', icon: LuEye, id: 'review' },
    { label: 'Draft', icon: LuFileText, id: 'draft' },
    { label: 'Withdrawn', icon: LuBan, id: 'withdrawn' },
    { label: 'Stagnant', icon: LuPauseCircle, id: 'stagnant' },
  ],
  'alltable': [
    { label: 'Table', icon: LuDatabase, id: 'table' },
  ],
};
