import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, 'src');
const pagesRoot = path.join(srcRoot, 'pages');
const docsDir = path.join(repoRoot, 'docs');
const outputFile = path.join(docsDir, 'pages-audit.md');

const exts = ['.tsx', '.ts', '.jsx', '.js'];
const chartNameRe = /(Chart|Graph|Donut|Timeline|Heatmap|Scatter|Pie|AreaStatus|ColumnChart|LineChart|Leaderboard|Velocity|Distribution|Comparison|Rankings|Trend|Insights)/i;
const sharedShellFileNames = new Set([
  'Layout.tsx',
  'Navbar.tsx',
  'Footer.tsx',
  'CookieConsentBanner.tsx',
  'BookmarkContext.tsx',
  'BookmarkFloater.tsx',
  'SubscriptionFloater.tsx',
  'SideBarConfigLoader.tsx',
  'AppSidebar.tsx',
  'SideBar.tsx',
  'SearchBox.tsx',
  'Logo.tsx',
  'AuthLocalStorageInitializer.tsx',
  'UniversalFeedbackSystem.tsx',
  'FloatingContributionIcon.tsx',
  'FeedbackWidget.tsx',
]);

function existsFile(file) {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}

function existsDir(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

function resolveModule(fromFile, mod) {
  let base;
  if (mod.startsWith('@/')) {
    base = path.join(srcRoot, mod.slice(2));
  } else if (mod.startsWith('./') || mod.startsWith('../')) {
    base = path.resolve(path.dirname(fromFile), mod);
  } else {
    return null;
  }

  if (existsFile(base)) return base;
  for (const ext of exts) {
    if (existsFile(base + ext)) return base + ext;
  }
  if (existsDir(base)) {
    for (const ext of exts) {
      const idx = path.join(base, 'index' + ext);
      if (existsFile(idx)) return idx;
    }
  }
  return null;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function cleanText(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFile(file) {
  const text = read(file);

  const imports = [];
  const importRe = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(text))) {
    imports.push({ raw: m[1], mod: m[2] });
  }

  const localImportMap = new Map();
  for (const imp of imports) {
    const resolved = resolveModule(file, imp.mod);
    if (!resolved) continue;

    const raw = imp.raw.trim();
    // default import
    const defaultMatch = raw.match(/^([A-Za-z_$][\w$]*)/);
    if (defaultMatch) {
      localImportMap.set(defaultMatch[1], resolved);
    }
    // named imports
    const namedMatch = raw.match(/\{([\s\S]*?)\}/);
    if (namedMatch) {
      const names = namedMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.split(' as ')[1]?.trim() || s.split(' as ')[0].trim());
      for (const n of names) localImportMap.set(n, resolved);
    }
  }

  const jsxComponents = new Set();
  const jsxRe = /<([A-Z][A-Za-z0-9_]*)\b/g;
  while ((m = jsxRe.exec(text))) jsxComponents.add(m[1]);

  const headings = [];
  const headingRe = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi;
  while ((m = headingRe.exec(text))) {
    const t = cleanText(m[1]);
    if (t && t.length <= 140) headings.push(t);
  }

  const sections = [];
  const sectionRe = /\bid\s*=\s*['"]([^'"]+)['"]/g;
  while ((m = sectionRe.exec(text))) {
    const id = m[1].trim();
    if (id && id.length <= 80) sections.push(id);
  }

  const endpoints = [];
  const fetchRe = /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g;
  while ((m = fetchRe.exec(text))) endpoints.push({ method: 'fetch', url: m[1] });

  const axiosRe = /axios\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
  while ((m = axiosRe.exec(text))) endpoints.push({ method: `axios.${m[1]}`, url: m[2] });

  const hasGssp = /export\s+async\s+function\s+getServerSideProps|export\s+const\s+getServerSideProps/.test(text);
  const hasGsp = /export\s+async\s+function\s+getStaticProps|export\s+const\s+getStaticProps/.test(text);
  const hasGspPaths = /getStaticPaths/.test(text);

  const localDeps = [];
  for (const c of jsxComponents) {
    const dep = localImportMap.get(c);
    if (dep) localDeps.push({ name: c, file: dep });
  }

  const chartComponents = [...jsxComponents].filter((c) => {
    if (c.endsWith('Props')) return false;
    if (/^(Bs|Fa|Fi|Io|Lu|Md|Ri|Hi)[A-Z]/.test(c)) return false;
    return chartNameRe.test(c);
  });

  return {
    file,
    headings,
    sections,
    endpoints,
    hasGssp,
    hasGsp,
    hasGspPaths,
    localDeps,
    chartComponents,
  };
}

function collectPageFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'api') continue;
      out.push(...collectPageFiles(full));
    } else if (entry.isFile()) {
      if (!exts.includes(path.extname(entry.name))) continue;
      out.push(full);
    }
  }
  return out;
}

function fileToRoute(file) {
  const rel = path.relative(pagesRoot, file).replace(/\\/g, '/');
  if (rel === '_app.tsx' || rel === '_document.tsx' || rel === '_error.tsx') return null;

  const noExt = rel.replace(/\.(tsx|ts|jsx|js)$/, '');
  const parts = noExt.split('/');
  if (parts[parts.length - 1] === 'index') parts.pop();
  return '/' + parts.join('/');
}

function uniq(arr) {
  return [...new Set(arr)];
}

function trimList(arr, max = 18) {
  const u = uniq(arr).filter(Boolean);
  if (u.length <= max) return u;
  return [...u.slice(0, max), `... (+${u.length - max} more)`];
}

function isSharedShellFile(file) {
  return sharedShellFileNames.has(path.basename(file));
}

function analyzePage(pageFile) {
  const visited = new Set();
  const queue = [{ file: pageFile, depth: 0 }];
  const maxDepth = 3;

  const aggregate = {
    headings: [],
    sections: [],
    endpoints: [],
    charts: [],
    dataModes: [],
    deps: [],
  };

  while (queue.length) {
    const { file, depth } = queue.shift();
    if (visited.has(file)) continue;
    visited.add(file);

    let parsed;
    try {
      parsed = parseFile(file);
    } catch {
      continue;
    }

    const sharedShell = isSharedShellFile(file);
    if (!sharedShell) {
      aggregate.headings.push(...parsed.headings);
      aggregate.sections.push(...parsed.sections);
      aggregate.endpoints.push(...parsed.endpoints.map((e) => `${e.method} ${e.url}`));
      aggregate.charts.push(...parsed.chartComponents);
    }
    aggregate.deps.push(...parsed.localDeps.map((d) => `${d.name} (${path.relative(repoRoot, d.file).replace(/\\/g, '/')})`));

    if (!sharedShell) {
      if (parsed.hasGssp) aggregate.dataModes.push('SSR via getServerSideProps');
      if (parsed.hasGsp) aggregate.dataModes.push('SSG via getStaticProps');
      if (parsed.hasGspPaths) aggregate.dataModes.push('Dynamic SSG via getStaticPaths');
      if (parsed.endpoints.length) aggregate.dataModes.push('Client data fetching (fetch/axios)');
    }

    if (depth < maxDepth) {
      for (const dep of parsed.localDeps) {
        // focus on relevant UI composition files only
        if (dep.file.includes('/src/components/') || dep.file.includes('/src/pages/')) {
          queue.push({ file: dep.file, depth: depth + 1 });
        }
      }
    }
  }

  const apiEndpoints = aggregate.endpoints.filter((e) => e.includes(' /api/') || e.includes('/api/'));
  const externalEndpoints = aggregate.endpoints.filter((e) => !e.includes('/api/'));

  return {
    route: fileToRoute(pageFile),
    file: path.relative(repoRoot, pageFile).replace(/\\/g, '/'),
    sections: trimList([...aggregate.headings, ...aggregate.sections], 24),
    graphs: trimList(aggregate.charts, 24),
    dataModes: trimList(aggregate.dataModes, 6),
    apiEndpoints: trimList(apiEndpoints, 30),
    externalEndpoints: trimList(externalEndpoints, 20),
    keyComposedComponents: trimList(aggregate.deps, 30),
  };
}

function routeGroup(route) {
  const parts = route.split('/').filter(Boolean);
  if (!parts.length) return '/ (home)';
  return `/${parts[0]}`;
}

const pageFiles = collectPageFiles(pagesRoot)
  .filter((f) => !path.basename(f).startsWith('_'))
  .filter((f) => path.basename(f) !== 'layout.tsx')
  .sort();

const pages = pageFiles
  .map((f) => analyzePage(f))
  .filter((p) => p.route !== null)
  .sort((a, b) => a.route.localeCompare(b.route));

let md = '';
md += '# EIPsInsight Page Inventory and Data/Visualization Audit\n\n';
md += `Generated on: ${new Date().toISOString()}\n\n`;
md += `Total page routes (excluding API and Next internals): **${pages.length}**\n\n`;
const groupCounts = new Map();
for (const p of pages) {
  const g = routeGroup(p.route || '/');
  groupCounts.set(g, (groupCounts.get(g) || 0) + 1);
}
const grouped = [...groupCounts.entries()].sort((a, b) => b[1] - a[1]);

const apiFrequency = new Map();
for (const p of pages) {
  for (const endpoint of p.apiEndpoints) {
    const endpointPath = endpoint.replace(/^(fetch|axios\.[a-z]+)\s+/, '');
    apiFrequency.set(endpointPath, (apiFrequency.get(endpointPath) || 0) + 1);
  }
}
const topApis = [...apiFrequency.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

md += '## Route Families\n';
for (const [group, count] of grouped) {
  md += `- \`${group}\`: **${count}** route(s)\n`;
}
md += '\n';
md += '## Most Reused Internal API Endpoints\n';
for (const [endpoint, count] of topApis) {
  md += `- \`${endpoint}\` used by **${count}** page(s)\n`;
}
md += '\n';
md += '## Method\n';
md += '- Scanned `src/pages/**` routes and recursively inspected imported UI components up to depth 3.\n';
md += '- Extracted visible section hints from heading tags (`h1`/`h2`/`h3`) and section ids (`id="..."`).\n';
md += '- Detected chart/graph usage by component naming patterns (Chart/Graph/Donut/Timeline/Heatmap/etc).\n';
md += '- Classified data loading path as SSR/SSG/client based on `getServerSideProps`, `getStaticProps`, and `fetch`/`axios` calls.\n\n';
md += '> Note: this is static source analysis. Runtime conditional rendering, dynamic imports, and remote data schemas may add details beyond this document.\n\n';

for (const p of pages) {
  md += `## Route: \`${p.route || '/'}\`\n`;
  md += `- File: \`${p.file}\`\n`;
  md += `- Data delivery way: ${p.dataModes.length ? p.dataModes.map((x) => `\`${x}\``).join(', ') : '`Static/local composition (no direct fetch detected)`'}\n`;
  md += `- Sections present: ${p.sections.length ? p.sections.map((x) => `\`${x}\``).join(', ') : '`No explicit section ids/headings detected in scanned scope`'}\n`;
  md += `- Graphs/charts used: ${p.graphs.length ? p.graphs.map((x) => `\`${x}\``).join(', ') : '`No chart component pattern detected in scanned scope`'}\n`;
  md += `- Internal API data sources: ${p.apiEndpoints.length ? p.apiEndpoints.map((x) => `\`${x}\``).join(', ') : '`None detected`'}\n`;
  md += `- External/other data sources: ${p.externalEndpoints.length ? p.externalEndpoints.map((x) => `\`${x}\``).join(', ') : '`None detected`'}\n`;
  md += `- Key composed UI blocks: ${p.keyComposedComponents.length ? p.keyComposedComponents.map((x) => `\`${x}\``).join(', ') : '`None detected`'}\n\n`;
}

if (!existsDir(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(outputFile, md, 'utf8');
console.log(`Wrote ${outputFile} with ${pages.length} routes.`);
