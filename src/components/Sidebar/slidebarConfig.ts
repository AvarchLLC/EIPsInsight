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
  LuPauseCircle,
  LuListChecks,
  LuUsers,
  LuBookOpen,
  LuGitBranch,
  LuGitPullRequest,
  LuGitCommit,
  LuPieChart,
  LuNetwork,
  LuTable,
  LuSparkles,
  LuSmile,
  LuClipboardList,
  LuTrendingUp,
  LuQuote,
  LuFileSignature,
  LuListTree,
  LuTrophy,
  LuBarChart2,
  LuGithub
} from 'react-icons/lu';


interface SidebarItem {
  label: string;
  icon: React.ElementType;
  id: string;
  children?: SidebarItem[];
  condition?: (context: any) => boolean;
}

// Define a type for the view-based configuration
interface ViewBasedConfig {
  type: SidebarItem[];
  status: SidebarItem[];
}

// Create a union type for sidebar configuration
type SidebarConfig = Record<string, SidebarItem[] | ViewBasedConfig>;

export const sidebarConfig: SidebarConfig = {
  '/': [
    { label: 'All EIPs', icon: LuHome, id: 'all' },
    { label: 'Our Tools', icon: LuWrench, id: 'ourtools' },
    { label: 'What is EIPs Insights?', icon: LuInfo, id: 'what' },
    { label: 'EIP Status Changes by Year', icon: LuBarChartBig, id: 'statuschanges' },
    { label: 'Dashboard', icon: LuDatabase, id: 'dashboard' },
  ],
  '/home': [
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
    {
      label: 'Categories',
      icon: LuListChecks,
      id: 'categories',
      children: [
        { label: 'Search EIP', icon: LuSearch, id: 'searchEIP' },
        { label: 'Living', icon: LuCheckCircle2, id: 'living' },
        { label: 'Final', icon: LuArchive, id: 'final' },
        { label: 'Last Call', icon: LuClock4, id: 'lastcall' },
        { label: 'Review', icon: LuEye, id: 'review' },
        { label: 'Draft', icon: LuFileText, id: 'draft' },
        { label: 'Withdrawn', icon: LuBan, id: 'withdrawn' },
        { label: 'Stagnant', icon: LuPauseCircle, id: 'stagnant' },
      ],
    },
  ],
  '/milestones2024': [
    { label: 'Analytics Scheduler', icon: LuClipboardList, id: 'analytics-scheduler' },
    { label: 'Reviewers Tracker', icon: LuUsers, id: 'reviewers-tracker' },
    { label: 'EIP Board', icon: LuListTree, id: 'eip-board' },
    { label: 'Search Tool', icon: LuSearch, id: 'search-tool' },
    { label: 'Pectra Network Upgrade', icon: LuTrendingUp, id: 'pectra-upgrade' },
    { label: 'Detailed Network Upgrade Information', icon: LuBookOpen, id: 'network-info' },
    { label: 'Gratitude', icon: LuSmile, id: 'gratitude' },
    { label: 'Conclusion', icon: LuQuote, id: 'conclusion' }
  ],
  '/trivia': [
    { label: 'Cool EIP Facts', icon: LuSparkles, id: 'cool-facts' },
    { label: 'Fun EIP Facts', icon: LuSmile, id: 'fun-facts' }
  ],
  '/status': [
    { label: 'Draft vs Final', icon: LuGitCommit, id: 'draft-vs-final' },
    { label: 'Draft', icon: LuFileText, id: 'draft' },
    { label: 'Review', icon: LuEye, id: 'review' },
    { label: 'Last Call', icon: LuClock4, id: 'lastcall' },
    { label: 'Final', icon: LuArchive, id: 'final' },
    { label: 'Stagnant', icon: LuPauseCircle, id: 'stagnant' },
    { label: 'Withdrawn', icon: LuBan, id: 'withdrawn' },
    { label: 'Living', icon: LuCheckCircle2, id: 'living' }
  ],
  '/issue': [
    { label: 'Description', icon: LuInfo, id: 'description' },
    { label: 'All Conversations', icon: LuGitBranch, id: 'conversations' }
  ],
  '/PR': [
    { label: 'Description', icon: LuInfo, id: 'description' },
    { label: 'All Conversations', icon: LuGitPullRequest, id: 'conversations' },
    { label: 'Review Comments', icon: LuListChecks, id: 'review-comments' }
  ],
  '/eips': [
    { label: 'Status Timeline', icon: LuBarChartBig, id: 'timeline' },
    { label: 'Simple Summary', icon: LuFileText, id: 'summary' },
    { label: 'Abstract', icon: LuFileSignature, id: 'abstract' },
    { label: 'Motivation', icon: LuTrendingUp, id: 'motivation' },
    { label: 'Specification', icon: LuClipboardList, id: 'specification' },
    { label: 'Rationale', icon: LuBookOpen, id: 'rationale' },
    { label: 'Backwards Compatibility', icon: LuGitBranch, id: 'compatibility' },
    { label: 'Copyright', icon: LuTrophy, id: 'copyright' }
  ],
  '/ercs': [
    { label: 'Status Timeline', icon: LuBarChartBig, id: 'timeline' },
    { label: 'Simple Summary', icon: LuFileText, id: 'summary' },
    { label: 'Abstract', icon: LuFileSignature, id: 'abstract' },
    { label: 'Motivation', icon: LuTrendingUp, id: 'motivation' },
    { label: 'Specification', icon: LuClipboardList, id: 'specification' },
    { label: 'Rationale', icon: LuBookOpen, id: 'rationale' },
    { label: 'Backwards Compatibility', icon: LuGitBranch, id: 'compatibility' },
    { label: 'Copyright', icon: LuTrophy, id: 'copyright' }
  ],
  '/rips': [
    { label: 'Status Timeline', icon: LuBarChartBig, id: 'timeline' },
    { label: 'Simple Summary', icon: LuFileText, id: 'summary' },
    { label: 'Abstract', icon: LuFileSignature, id: 'abstract' },
    { label: 'Motivation', icon: LuTrendingUp, id: 'motivation' },
    { label: 'Specification', icon: LuClipboardList, id: 'specification' },
    { label: 'Rationale', icon: LuBookOpen, id: 'rationale' },
    { label: 'Backwards Compatibility', icon: LuGitBranch, id: 'compatibility' },
    { label: 'Copyright', icon: LuTrophy, id: 'copyright' }
  ],
  '/insight': [
    { label: 'Summary', icon: LuFileText, id: 'Summary' },
    { label: 'Draft', icon: LuFileText, id: 'draft' },
    { label: 'Review', icon: LuEye, id: 'review' },
    { label: 'Last Call', icon: LuClock4, id: 'lastcall' },
    { label: 'Living', icon: LuCheckCircle2, id: 'living' },
    { label: 'Final', icon: LuArchive, id: 'final' },
    { label: 'Stagnant', icon: LuPauseCircle, id: 'stagnant' },
    { label: 'Withdrawn', icon: LuBan, id: 'withdrawn' }
  ],
  // '/Reviewers': [
  //   { label: 'Editors & Reviewers Leaderboard', icon: LuTrophy, id: 'leaderboard' },
  //   { label: 'Leaderboard FAQ', icon: LuInfo, id: 'faq' },
  //   { label: 'Active Editors Timeline Scatterplot', icon: LuBarChartBig, id: 'scatterplot' },
  //   { label: 'PRs Reviewed (Monthly, since 2015)', icon: LuPieChart, id: 'monthly-prs' },
  //   { label: 'Editors', icon: LuUsers, id: 'editors' },
  //   { label: 'Reviewers', icon: LuUsers, id: 'reviewers' },
  //   { label: 'Active Editors PR reviews in each Repository', icon: LuGitBranch, id: 'active-prs' }
  // ],
  '/rip': {
    type: [
      { label: 'GitHub Stats', icon: LuGithub, id: 'githubstats' },
      { label: 'Graphs', icon: LuBarChartBig, id: 'charts' },
      { label: 'Table', icon: LuInfo, id: 'type-tables' },
    ],
    status: [
      { label: 'GitHub Stats', icon: LuGithub, id: 'githubstats' },
      { label: 'Graphs', icon: LuBarChartBig, id: 'graphs' },
      { label: 'Draft vs Final', icon: LuBarChart2, id: 'draftvsfinal' },
      {
        label: 'Statuses',
        icon: LuListChecks,
        id: 'statuses',
        children: [/*...*/]
      },
      { label: 'Table', icon: LuFileSignature, id: 'status-tables' },

    ]
  },
  '/eip': {
    type: [
      { label: 'GitHub Stats', icon: LuGithub, id: 'githubstats' },
      { label: 'Graphs', icon: LuBarChartBig, id: 'charts' },
      {
        label: 'Categories',
        icon: LuListChecks,
        id: 'categories',
        children: [/*...*/]
      },
      {
        label: 'Tables',
        icon: LuTable,
        id: 'tables',
        children: [/*...*/]
      }
    ],
    status: [
      { label: 'GitHub Stats', icon: LuGithub, id: 'githubstats' },
      { label: 'Graphs', icon: LuBarChartBig, id: 'charts' },
      { label: 'Draft vs Final', icon: LuBarChart2, id: 'draftvsfinal' },
      {
        label: 'Statuses',
        icon: LuListChecks,
        id: 'statuses',
        children: [/*...*/]
      },
      {
        label: 'Tables',
        icon: LuTable,
        id: 'tables',
        children: [/*...*/]
      }
    ]
  },
  '/erc': {
    type: [
      { label: 'GitHub Stats', icon: LuGithub, id: 'githubstats' },
      { label: 'Graphs', icon: LuBarChartBig, id: 'graphs' },
      { label: 'ERC (Progress Over the Years)', icon: LuTrendingUp, id: 'ercprogress' },
      {
        label: 'Tables',
        icon: LuTable,
        id: 'tables',
        children: [/*...*/]
      }
    ],
    status: [
      { label: 'GitHub Stats', icon: LuGithub, id: 'githubstats' },
      { label: 'Graphs', icon: LuBarChartBig, id: 'graphs' },
      { label: 'Draft vs Final', icon: LuBarChart2, id: 'draftvsfinal' },
      {
        label: 'Statuses',
        icon: LuListChecks,
        id: 'statuses',
        children: [/*...*/]
      },
      {
        label: 'Tables',
        icon: LuTable,
        id: 'tables',
        children: [/*...*/]
      }
    ]
  },

  '/upgrade': [
    {
      label: 'Upgrade',
      icon: LuTrendingUp,
      id: 'pectrafusaka',
      children: [
        { label: 'PECTRA', icon: LuTrendingUp, id: 'pectra' },
        { label: 'FUSAKA', icon: LuTrendingUp, id: 'fusaka' },
      ],
    },
    { label: 'Network Upgrades Graph', icon: LuBarChartBig, id: 'NetworkUpgrades' },
    { label: 'Upgrade Table', icon: LuTable, id: 'upgrade-table' },
    { label: 'Network Upgrades and EIPs Relationship Graph', icon: LuGitBranch, id: 'NetworkUpgradesChartp' },
    { label: 'Network Upgrades chart', icon: LuBarChartBig, id: 'NetworkUpgradeschart' },
    { label: 'Author Contributions', icon: LuUsers, id: 'AuthorContributions' },

  ]
};
