# EIPs Insight - AI Coding Instructions

## Project Overview

EIPs Insight is a comprehensive Next.js 13+ dashboard for analyzing Ethereum Improvement Proposals (EIPs), Ethereum Request for Comments (ERCs), and Rollup Improvement Proposals (RIPs). The platform provides data visualization, analytics, and tracking for the Ethereum ecosystem's proposal lifecycle.

## Architecture

### Hybrid Routing Structure
- **Pages Router**: Core API routes and main pages in `src/pages/`
- **App Router**: Layout and providers in `src/app/` (Next.js 13+ pattern)
- **Mixed Authentication**: NextAuth.js with MongoDB adapter + custom session handling

### Key Directories
```
src/
├── pages/            # Pages Router (APIs, main routes)
├── app/             # App Router (layout, providers)
├── components/      # React components (charts, tables, forms)
├── data/           # Static data, validation schemas
├── constants/      # JSON data files for charts
├── types/         # TypeScript type definitions
├── services/      # External service integrations
├── hooks/         # Custom React hooks
├── stores/        # Zustand state management
└── utils/         # Utility functions
```

## Data Architecture

### EIP/ERC/RIP Processing
- **Data Sources**: GitHub API (ethereum/EIPs, ethereum/ERCs, ethereum/RIPs)
- **Processing**: Custom aggregation in `/api/` routes with MongoDB
- **Labels**: Two types - `customLabels` (normalized) and `githubLabels` (raw workflow)
- **Time Series**: Monthly aggregation by `monthYear` field (YYYY-MM format)

### API Patterns
```typescript
// Standard API pattern for analytics
/api/pr-stats?labelType=githubLabels&repo=eip
/api/pr-details?repo=erc&mode=detail&labelType=customLabels

// Data structure
interface AggregatedLabelCount {
  monthYear: string;    // "2024-03"
  label: string;        // "e-review", "New EIP", etc.
  count: number;
  labelType: string;    // "customLabels" | "githubLabels"
  prNumbers: number[];  // Associated PR numbers
}
```

## Component Patterns

### Chart Components
- **Base**: Use `@ant-design/plots`, `echarts-for-react`, `recharts`
- **Data Transformation**: Always transform API data to chart format in component
- **Labels**: Filter by `availableLabels` array, handle "miscellaneous" bucket
- **Colors**: Consistent color scheme based on label prefixes (a-, e-, s-, etc.)

### State Management
- **Zustand**: For global state (sidebar, filters)
- **React State**: For component-local state
- **Chakra UI**: For theming and responsive design

### Authentication Flow
```typescript
// Session handling in _app.tsx and layout.tsx
SessionProvider -> AuthLocalStorageInitializer -> Components
```

## Development Workflows

### Adding New Charts
1. Create component in `src/components/` 
2. Use existing API endpoints like `/api/pr-stats` or `/api/pr-details`
3. Follow label filtering pattern with `showLabels` state
4. Implement CSV download with proper data transformation
5. Add to analytics dashboard pages

### API Development
1. Create in `src/pages/api/` following REST conventions
2. Use MongoDB aggregation for time-series data
3. Support `labelType` parameter for custom vs github labels
4. Return consistent data structure with `monthYear`, `label`, `count`

### Label System
```typescript
// Standard labels across components
const availableLabels = [
  'a-review', 'e-review', 'e-consensus', 
  'stagnant', 'stale', 'created-by-bot', 
  'miscellaneous'
];

// Handle unknown labels as miscellaneous
if (!availableLabels.includes(label) && showLabels.miscellaneous) {
  effectiveLabel = 'miscellaneous';
}
```

## Deployment & Performance

### Next.js Configuration
- **MDX**: Supports both `.md` and `.mdx` files for EIP content
- **Images**: Configured domains for external images
- **SSR**: Strategic use of `dynamic` imports with `ssr: false` for charts

### Environment Setup
```bash
npm install
npm run dev    # Development server
npm run build  # Production build
```

### Critical Dependencies
- **Charts**: @ant-design/plots, echarts-for-react, recharts
- **UI**: @chakra-ui/react, framer-motion
- **Data**: mongoose, next-auth, @octokit/rest
- **Utils**: papaparse (CSV), dayjs (dates)

## Common Patterns

### Chart Data Flow
```typescript
// 1. Fetch from API
const response = await fetch('/api/pr-stats?labelType=githubLabels');
const data = await response.json();

// 2. Transform for chart
const chartData = data.reduce((acc, {monthYear, label, count}) => {
  // Group by month, aggregate by label
}, {});

// 3. Apply label filters
const filteredData = data.filter(item => showLabels[item.label]);
```

### CSV Export Pattern
```typescript
const downloadCSV = async () => {
  const response = await fetch('/api/pr-details?mode=detail');
  const data = await response.json();
  const csv = Papa.unparse(filteredData);
  // Create download link
};
```

When working on this codebase, prioritize consistency with existing patterns, especially around data transformation, label filtering, and API structure. The project emphasizes real-time analytics and data visualization for the Ethereum ecosystem.