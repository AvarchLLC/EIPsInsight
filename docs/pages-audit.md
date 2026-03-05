# EIPsInsight Page Inventory and Data/Visualization Audit

Generated on: 2026-03-01T19:47:37.858Z

Total page routes (excluding API and Next internals): **80**

## Route Families
- `/admin`: **5** route(s)
- `/FAQs`: **3** route(s)
- `/authors`: **2** route(s)
- `/Blogs`: **2** route(s)
- `/contributors`: **2** route(s)
- `/upgrade`: **2** route(s)
- `/ (home)`: **1** route(s)
- `/[redirects]`: **1** route(s)
- `/About`: **1** route(s)
- `/all`: **1** route(s)
- `/alltable`: **1** route(s)
- `/Analytics`: **1** route(s)
- `/boards`: **1** route(s)
- `/boardsnew`: **1** route(s)
- `/catTable`: **1** route(s)
- `/core`: **1** route(s)
- `/dashboard`: **1** route(s)
- `/donate`: **1** route(s)
- `/draft`: **1** route(s)
- `/EditorAnalytics`: **1** route(s)
- `/eip`: **1** route(s)
- `/eip_board`: **1** route(s)
- `/eips`: **1** route(s)
- `/eiptable`: **1** route(s)
- `/erc`: **1** route(s)
- `/erc_board`: **1** route(s)
- `/ercs`: **1** route(s)
- `/erctable`: **1** route(s)
- `/Feedback`: **1** route(s)
- `/feedback-dashboard`: **1** route(s)
- `/feedbacks`: **1** route(s)
- `/final`: **1** route(s)
- `/grants`: **1** route(s)
- `/home`: **1** route(s)
- `/informational`: **1** route(s)
- `/insight`: **1** route(s)
- `/interface`: **1** route(s)
- `/issue`: **1** route(s)
- `/last-call`: **1** route(s)
- `/living`: **1** route(s)
- `/meta`: **1** route(s)
- `/milestones2024`: **1** route(s)
- `/monthly`: **1** route(s)
- `/networking`: **1** route(s)
- `/newsletter`: **1** route(s)
- `/pectra`: **1** route(s)
- `/PR`: **1** route(s)
- `/privacy`: **1** route(s)
- `/profile`: **1** route(s)
- `/proposalbuilder`: **1** route(s)
- `/resources`: **1** route(s)
- `/review`: **1** route(s)
- `/Reviewers`: **1** route(s)
- `/rip`: **1** route(s)
- `/rips`: **1** route(s)
- `/riptable`: **1** route(s)
- `/SearchEip`: **1** route(s)
- `/SearchEipTitle`: **1** route(s)
- `/SearchPRSandISSUES`: **1** route(s)
- `/signin`: **1** route(s)
- `/signup`: **1** route(s)
- `/stagnant`: **1** route(s)
- `/stats`: **1** route(s)
- `/status`: **1** route(s)
- `/tableStatus`: **1** route(s)
- `/test`: **1** route(s)
- `/testv2`: **1** route(s)
- `/trivia`: **1** route(s)
- `/txtracker`: **1** route(s)
- `/withdrawn`: **1** route(s)

## Most Reused Internal API Endpoints
- `/api/DownloadCounter` used by **33** page(s)
- `/api/new/all` used by **26** page(s)
- `/api/new/final-status-by-year` used by **9** page(s)
- `/api/new/graphsv4` used by **8** page(s)
- `/api/comments/${page}` used by **8** page(s)
- `/api/new/graphsv2` used by **6** page(s)
- `/api/subscribe` used by **6** page(s)
- `/api/subscriptions?email=${session.user.email}` used by **6** page(s)
- `/api/unsubscribe` used by **6** page(s)
- `/api/admin/auth/session` used by **5** page(s)
- `/api/lastUpdatedTime?name=${encodeURIComponent(name)}` used by **5** page(s)
- `/api/Feedback/feedback` used by **3** page(s)
- `/api/stats` used by **3** page(s)
- `/api/magicians` used by **3** page(s)
- `/api/admin/blogs` used by **3** page(s)
- `/api/comments/${page}/${commentId}/reply` used by **3** page(s)
- `/api/EIPinfo` used by **3** page(s)
- `/api/ERCinfo` used by **3** page(s)
- `/api/RIPInfo` used by **3** page(s)
- `/api/user/me?email=${email}` used by **3** page(s)

## Method
- Scanned `src/pages/**` routes and recursively inspected imported UI components up to depth 3.
- Extracted visible section hints from heading tags (`h1`/`h2`/`h3`) and section ids (`id="..."`).
- Detected chart/graph usage by component naming patterns (Chart/Graph/Donut/Timeline/Heatmap/etc).
- Classified data loading path as SSR/SSG/client based on `getServerSideProps`, `getStaticProps`, and `fetch`/`axios` calls.

> Note: this is static source analysis. Runtime conditional rendering, dynamic imports, and remote data schemas may add details beyond this document.

## Route: `/`
- File: `src/pages/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `button-row-container`, `all`, `statuschanges`, `dashboard`, `latest-updates`, `Ethereum Improvement`, `ourtools`, `supported-by`, `trending`, `faq`
- Graphs/charts used: `AllChart`, `TypeGraphs`, `DashboardDonut2`, `DashboardDonut`, `TwitterTimeline`, `StatusColumnChart`, `StatusChart`
- Internal API data sources: `fetch /api/count/views`, `fetch /api/new/all`, `fetch /api/Feedback/feedback`, `fetch /api/viewCount?path=${path}`, `fetch /api/stats`, `axios.get /api/magicians`, `fetch /api/new/final-status-by-year`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `Dashboard (src/components/Dashboard.tsx)`, `ViewsShare (src/components/ViewsNShare.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FusakaCountdownBadge (src/components/FusakaCountdownBadge.tsx)`, `WhatIsEIPsInsightDropdown (src/components/WhatIsEIPsInsightDropdown.tsx)`, `BoyGirl3 (src/components/BoyGirl3.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `AllChart (src/components/AllChart2.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `ToolsSection (src/components/AvailableTools.tsx)`, `SupportedBy (src/components/SupportedBy.tsx)`, `TypeGraphs (src/components/TypeGraphs2.tsx)`, `Clients (src/components/Clients.tsx)`, `StatBox (src/components/StatBox.tsx)`, `DashboardDonut2 (src/components/DashboardDonut2.tsx)`, `DashboardDonut (src/components/DashboardDonut.tsx)`, `... (+8 more)`

## Route: `/[redirects]`
- File: `src/pages/[redirects]/index.tsx`
- Data delivery way: `SSR via getServerSideProps`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `None detected`

## Route: `/About`
- File: `src/pages/About/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `team`, `funding`, `grants`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/allcontributors`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `ContributorsGrid (src/components/ContributorsGrid.tsx)`, `FundingDetails (src/components/FundingDetails.tsx)`, `GrantList (src/components/GrantList.tsx)`, `Partners (src/components/Partners.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/admin`
- File: `src/pages/admin/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/admin/auth/session`
- External/other data sources: `None detected`
- Key composed UI blocks: `None detected`

## Route: `/admin/dashboard`
- File: `src/pages/admin/dashboard.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/admin/auth/session`, `fetch /api/admin/blogs`, `fetch /api/admin/blogs/static`, `fetch /api/admin/auth/logout`, `fetch /api/admin/blogs/${id}`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/admin/dashboard/edit/[id]`
- File: `src/pages/admin/dashboard/edit/[id].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `cover-upload`, `image-upload`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/admin/auth/session`, `fetch /api/admin/blogs/${id}`, `fetch /api/admin/upload`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/admin/dashboard/new`
- File: `src/pages/admin/dashboard/new.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `cover-upload`, `image-upload`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/admin/auth/session`, `fetch /api/admin/upload`, `fetch /api/admin/blogs`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/admin/login`
- File: `src/pages/admin/login.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/admin/auth/session`, `fetch /api/admin/auth/login`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/all`
- File: `src/pages/all/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `All EIP ERC RIP`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/all`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/alltable`
- File: `src/pages/alltable/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `table`, `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`, `fetch /api/new/graphsv2`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Table (src/components/Table.tsx)`, `AreaC (src/components/AreaC.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/Analytics`
- File: `src/pages/Analytics/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `GithubAnalytics`, `EIPsLabelChart`, `CategorySubcategoryChart`, `PrLabelsChart`
- Graphs/charts used: `ChartDataItem`, `CategorySubcategoryChart`, `ReactECharts`, `ChartDocument`
- Internal API data sources: `axios.get /api/AnalyticsCharts/${activeTab === `, `axios.post /api/DownloadCounter`, `fetch /api/lastUpdatedTime?name=${encodeURIComponent(name)}`, `fetch /api/pr-details?${qs}`, `fetch /api/AnalyticsCharts/graph2/${graph2ApiName}?view=${view}`, `fetch /api/AnalyticsCharts/category-subcategory/${graph2ApiName}/details?month=${selectedMonth}&source=snapshot`, `fetch /api/AnalyticsCharts/graph3/${repoKey}`
- External/other data sources: `None detected`
- Key composed UI blocks: `LoaderComponent (src/components/Loader.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `LastUpdatedDateTime (src/components/LastUpdatedDateTime.tsx)`, `PRAnalyticsCard (src/components/PrLabels.tsx)`, `CategorySubcategoryChart (src/components/CategorySubcategoryChart.tsx)`, `Logo (src/components/Logo.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `DateTime (src/components/DateTime.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/authors`
- File: `src/pages/authors/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Search Author`, `Search EIP`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `Author (src/components/Author.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/authors/[name]`
- File: `src/pages/authors/[name]/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Search Author`, `Search EIP`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Author (src/components/Author.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/Blogs`
- File: `src/pages/Blogs/index.tsx`
- Data delivery way: `SSG via getStaticProps`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `BlogsClient (src/components/Blog/BlogsClient.tsx)`, `AllLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/Blogs/[slug]`
- File: `src/pages/Blogs/[slug].tsx`
- Data delivery way: `SSG via getStaticProps`, `Dynamic SSG via getStaticPaths`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `BlogPostClient (src/components/Blog/BlogPostClient.tsx)`, `AllLayout (src/components/Layout.tsx)`, `ScrollToHashOnLoad (src/components/ScrollToHashOnLoad.tsx)`, `MarkdownRenderer (src/components/MarkdownRenderer.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CodeBlock (src/components/Codehelper.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/boards`
- File: `src/pages/boards/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `EIPsBOARD`, `ERCsBOARD`, `BOARD`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `axios.get /api/FullBoards`, `axios.post /api/DownloadCounter`, `fetch /api/lastUpdatedTime?name=${encodeURIComponent(name)}`, `axios.get /api/comments/${page}`, `axios.post /api/comments/${page}`, `axios.post /api/comments/${page}/${commentId}/reply`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `LabelFilter (src/components/LabelFilter.tsx)`, `LastUpdatedDateTime (src/components/LastUpdatedDateTime.tsx)`, `Comments (src/components/comments.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/boardsnew`
- File: `src/pages/boardsnew/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/AnalyticsCharts/graph3/${repoKey}`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/catTable/[status]/[cat]`
- File: `src/pages/catTable/[status]/[cat].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `axios.post /api/DownloadCounter`, `fetch /api/alleips`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `TableCatStat (src/components/TableCatStat.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/contributors`
- File: `src/pages/contributors/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Activity Timeline`, `Activity Distribution`, `Repository Breakdown`, `Recent Activities`, `Activity Velocity`, `Top Contributors`, `Activity Comparison`, `🏆 Contributor Rankings`, `colorCommits`, `colorPRs`, `colorReviews`, `colorComments`
- Graphs/charts used: `ActivityTimelineChart`, `ActivityDistributionChart`, `RepositoryBreakdownChart`, `ActivityVelocityChart`, `TopContributorsChart`, `ActivityComparisonChart`, `ContributorRankings`, `AreaChart`, `BarChart`, `PieChart`, `Pie`, `LineChart`, `RadarChart`
- Internal API data sources: `fetch /api/contributors/stats`, `fetch /api/contributors/analytics?${params}`, `fetch /api/contributors/list?${params}`, `fetch /api/contributors/export-detailed?timeline=${timelineFilter}`, `fetch /api/contributors/recent-activities?${params}`, `fetch /api/contributors/lastSyncTime`
- External/other data sources: `None detected`
- Key composed UI blocks: `Contributor (src/types/contributors.ts)`, `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `ActivityTimelineChart (src/components/contributors/ActivityTimelineChart.tsx)`, `ActivityDistributionChart (src/components/contributors/ActivityDistributionChart.tsx)`, `RepositoryBreakdownChart (src/components/contributors/RepositoryBreakdownChart.tsx)`, `RecentActivitiesWidget (src/components/contributors/RecentActivitiesWidget.tsx)`, `ActivityVelocityChart (src/components/contributors/ActivityVelocityChart.tsx)`, `TopContributorsChart (src/components/contributors/TopContributorsChart.tsx)`, `ActivityComparisonChart (src/components/contributors/ActivityComparisonChart.tsx)`, `ContributorRankings (src/components/contributors/ContributorRankings.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `ContributorLastUpdatedDateTime (src/components/ContributorLastUpdatedDateTime.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/contributors/[username]`
- File: `src/pages/contributors/[username].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Activity Timeline`, `Activity Distribution`, `Repository Breakdown`, `Activity Heatmap`, `activity-timeline`, `colorCommits`, `colorPRs`, `colorReviews`, `colorComments`
- Graphs/charts used: `ActivityTimelineChart`, `ActivityDistributionChart`, `RepositoryBreakdownChart`, `ContributorHeatmap`, `AreaChart`, `BarChart`, `PieChart`, `Pie`
- Internal API data sources: `fetch /api/contributors/list?search=${username}&limit=1`, `fetch /api/contributors/timeline?${params}`, `fetch /api/contributors/analytics?${params}`, `fetch /api/contributors/lastSyncTime`
- External/other data sources: `None detected`
- Key composed UI blocks: `Contributor (src/types/contributors.ts)`, `Activity (src/types/contributors.ts)`, `AllLayout (src/components/Layout.tsx)`, `ActivityTimelineChart (src/components/contributors/ActivityTimelineChart.tsx)`, `ActivityDistributionChart (src/components/contributors/ActivityDistributionChart.tsx)`, `RepositoryBreakdownChart (src/components/contributors/RepositoryBreakdownChart.tsx)`, `ContributorHeatmap (src/components/contributors/ContributorHeatmap.tsx)`, `ActivityCard (src/components/ActivityCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `ContributorLastUpdatedDateTime (src/components/ContributorLastUpdatedDateTime.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/core`
- File: `src/pages/core/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`, `StatusColumnChart`, `StatusChart`
- Internal API data sources: `fetch /api/new/all`, `axios.post /api/DownloadCounter`, `fetch /api/new/final-status-by-year`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatus (src/components/TableStatus.tsx)`, `StatusColumnChart (src/components/StatusColumnChart.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/dashboard`
- File: `src/pages/dashboard/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `button-row-container`, `all`, `statuschanges`, `dashboard`, `latest-updates`, `Ethereum Improvement`, `ourtools`, `supported-by`, `trending`, `faq`
- Graphs/charts used: `AllChart`, `TypeGraphs`, `DashboardDonut2`, `DashboardDonut`, `TwitterTimeline`, `StatusColumnChart`, `StatusChart`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/Feedback/feedback`, `fetch /api/stats`, `axios.get /api/magicians`, `fetch /api/new/final-status-by-year`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Dashboard (src/components/Dashboard.tsx)`, `PlaceYourAdCard (src/components/PlaceYourAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FusakaCountdownBadge (src/components/FusakaCountdownBadge.tsx)`, `WhatIsEIPsInsightDropdown (src/components/WhatIsEIPsInsightDropdown.tsx)`, `BoyGirl3 (src/components/BoyGirl3.tsx)`, `Header (src/components/Header.tsx)`, `AllChart (src/components/AllChart2.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `ToolsSection (src/components/AvailableTools.tsx)`, `SupportedBy (src/components/SupportedBy.tsx)`, `TypeGraphs (src/components/TypeGraphs2.tsx)`, `Clients (src/components/Clients.tsx)`, `StatBox (src/components/StatBox.tsx)`, `DashboardDonut2 (src/components/DashboardDonut2.tsx)`, `DashboardDonut (src/components/DashboardDonut.tsx)`, `... (+8 more)`

## Route: `/donate`
- File: `src/pages/donate.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `Layout (src/components/Layout.tsx)`, `Partners (src/components/Partners.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/draft`
- File: `src/pages/draft/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatusByStatus (src/components/TableStatusByStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/EditorAnalytics`
- File: `src/pages/EditorAnalytics/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `EditorLeaderboard`, `PRsReviewedChart`, `EditorFrequencyChart`, `EditorReviewVelocity`, `EditorContributionHeatmap`, `EditorActivityTimeline`, `RepositoryDistributionChart`, `EditorComparisonTable`, `Heatmap`
- Internal API data sources: `axios.get /api/editorAnalytics?${params}`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `EditorMetricsCards (src/components/editorAnalytics/EditorMetricsCards.tsx)`, `EditorLeaderboard (src/components/editorAnalytics/EditorLeaderboard.tsx)`, `PRsReviewedChart (src/components/editorAnalytics/PRsReviewedChart.tsx)`, `EditorFrequencyChart (src/components/editorAnalytics/EditorFrequencyChart.tsx)`, `EditorReviewVelocity (src/components/editorAnalytics/EditorReviewVelocity.tsx)`, `EditorContributionHeatmap (src/components/editorAnalytics/EditorContributionHeatmap.tsx)`, `EditorActivityTimeline (src/components/editorAnalytics/EditorActivityTimeline.tsx)`, `RepositoryDistributionChart (src/components/editorAnalytics/RepositoryDistributionChart.tsx)`, `EditorReviewerRepoGrid (src/components/editorAnalytics/EditorReviewerRepoGrid.tsx)`, `EditorComparisonTable (src/components/editorAnalytics/EditorComparisonTable.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/eip`
- File: `src/pages/eip/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `// // // // // //`, `// // // // // // // // // // // // // // //`, `EIP`, `all`, `githubstats`, `chart type`, `charts`, `categories`, `draftvsfinal`, `statuses`, `tables`, `Ethereum Improvement`, `Eip Table`
- Graphs/charts used: `AllChart3`, `AllChart`, `EIPStatusDonut`, `EIPTypeDonut`, `TypeGraphs`, `AreaStatus`, `StackedColumnChart`, `Pie`, `StatusColumnChart`, `StatusChart`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/graphsv2`, `fetch /api/subscribe`, `fetch /api/subscriptions?email=${session.user.email}`, `fetch /api/unsubscribe`, `fetch /api/EIPinfo`, `fetch /api/ERCinfo`, `fetch /api/RIPInfo`, `axios.post /api/DownloadCounter`, `fetch /api/user/me?email=${email}`, `fetch /api/new/final-status-by-year`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Header (src/components/Header.tsx)`, `SubscriptionButton (src/components/SubscribtionButton.tsx)`, `OtherBox (src/components/OtherStats.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `AllChart3 (src/components/AllChart3.tsx)`, `AllChart (src/components/AllChart.tsx)`, `EIPStatusDonut (src/components/EIPStatusDonut.tsx)`, `EIPTypeDonut (src/components/EIPTypeDonut.tsx)`, `TypeGraphs (src/components/TypeGraphs.tsx)`, `CatTable2 (src/components/CatTable2.tsx)`, `AreaStatus (src/components/AreaStatus.tsx)`, `StackedColumnChart (src/components/StackedBarChart.tsx)`, `CatTable (src/components/CatTable.tsx)`, `EipTable (src/components/EipTable.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `... (+3 more)`

## Route: `/eip_board`
- File: `src/pages/eip_board/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `axios.get /api/all_board`, `axios.get /api/comments/${page}`, `axios.post /api/comments/${page}`, `axios.post /api/comments/${page}/${commentId}/reply`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Comments (src/components/comments.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/eips/[eip-number]`
- File: `src/pages/eips/[eip-number]/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `🤖AI Summary`, `timeline`, `guest-email`
- Graphs/charts used: `LineChart`, `HTMLParagraphElement`
- Internal API data sources: `fetch /api/new/${repoPath}/${eipNo}`, `fetch /api/new/${Repo.toLowerCase()}history/${eipNo}`, `fetch /api/eips/${eipNo}`, `fetch /api/subscribe`, `fetch /api/subscriptions?email=${session.user.email}`, `fetch /api/unsubscribe`, `fetch /api/ai-summary`
- External/other data sources: `None detected`
- Key composed UI blocks: `LoaderComponent (src/components/Loader.tsx)`, `AllLayout (src/components/Layout.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `Header (src/components/Header2.tsx)`, `SingleSubscriptionButton (src/components/SingleSubscriptionButton.tsx)`, `EipAiSummary (src/components/EipAiSummary.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Markdown (src/components/MarkdownEIP.tsx)`, `Logo (src/components/Logo.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Card (src/components/ui/card.tsx)`, `CardHeader (src/components/ui/card.tsx)`, `Button (src/components/ui/button.tsx)`, `CardContent (src/components/ui/card.tsx)`, `CodeBlock (src/components/Codehelper.tsx)`

## Route: `/eiptable`
- File: `src/pages/eiptable/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Table (src/components/Table.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/erc`
- File: `src/pages/erc/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `// // // // // // // // // // // // // // //`, `ERC`, `all`, `githubstats`, `graphs`, `progress`, `draftvsfinal`, `statuses`, `ErcActivity`, `tables`, `Ethereum Improvement`, `ERC progress bar`, `ERC Activity`
- Graphs/charts used: `AllChart3`, `AllChart`, `ERCStatusDonut`, `ERCTypeDonut`, `ERCStatusGraph`, `AreaStatus`, `StackedColumnChart`, `ERCsPRChart`, `StatusChartData`, `ChartDataItem`, `Pie`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/graphsv2`, `fetch /api/subscribe`, `fetch /api/subscriptions?email=${session.user.email}`, `fetch /api/unsubscribe`, `fetch /api/EIPinfo`, `fetch /api/ERCinfo`, `fetch /api/RIPInfo`, `axios.post /api/DownloadCounter`, `fetch /api/new/final-status-by-year`, `axios.get /api/ercsrecentactivity`, `axios.get /api/ercseditorsactivity`, `fetch /api/user/me?email=${email}`, `fetch /api/lastUpdatedTime?name=${encodeURIComponent(name)}`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `SubscriptionButton (src/components/SubscribtionButton.tsx)`, `OtherBox (src/components/OtherStats.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `AllChart3 (src/components/AllChart3.tsx)`, `AllChart (src/components/AllChart.tsx)`, `ERCStatusDonut (src/components/ERCStatusDonut.tsx)`, `ERCTypeDonut (src/components/ERCTypeDonut.tsx)`, `ERCStatusGraph (src/components/ERCStatusGraph.tsx)`, `AreaStatus (src/components/AreaStatus.tsx)`, `StackedColumnChart (src/components/StackedBarChart2.tsx)`, `CatTable (src/components/CatTable.tsx)`, `ERCsPRChart (src/components/Ercsprs.tsx)`, `ErcTable (src/components/ErcTable.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `... (+3 more)`

## Route: `/erc_board`
- File: `src/pages/erc_board/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `axios.get /api/all_board`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/ercs/[erc-number]`
- File: `src/pages/ercs/[erc-number]/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `🤖AI Summary`, `timeline`, `guest-email`
- Graphs/charts used: `HTMLParagraphElement`
- Internal API data sources: `fetch /api/new/erchistory/${ercNo}`, `fetch /api/subscribe`, `fetch /api/subscriptions?email=${session.user.email}`, `fetch /api/unsubscribe`, `fetch /api/ai-summary`
- External/other data sources: `None detected`
- Key composed UI blocks: `LoaderComponent (src/components/Loader.tsx)`, `AllLayout (src/components/Layout.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `Header (src/components/Header2.tsx)`, `SingleSubscriptionButton (src/components/SingleSubscriptionButton.tsx)`, `EipAiSummary (src/components/EipAiSummary.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Markdown (src/components/MarkdownEIP.tsx)`, `Logo (src/components/Logo.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Card (src/components/ui/card.tsx)`, `CardHeader (src/components/ui/card.tsx)`, `Button (src/components/ui/button.tsx)`, `CardContent (src/components/ui/card.tsx)`, `CodeBlock (src/components/Codehelper.tsx)`

## Route: `/erctable`
- File: `src/pages/erctable/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Table (src/components/Table.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/FAQs/EIP`
- File: `src/pages/FAQs/EIP/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/FAQs/ERC`
- File: `src/pages/FAQs/ERC/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/FAQs/RIP`
- File: `src/pages/FAQs/RIP/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/Feedback`
- File: `src/pages/Feedback/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `axios.get /api/comments/${page}`, `axios.post /api/comments/${page}`
- External/other data sources: `axios.get https://api.github.com/users/${githubProfile}`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/feedback-dashboard`
- File: `src/pages/feedback-dashboard.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/Feedback/getAllFeedback?page=${page}&limit=25`, `fetch /api/Feedback/getEnhancedFeedback?page=${page}&limit=25`, `fetch /api/test-discord-webhook`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/feedbacks`
- File: `src/pages/feedbacks.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/Feedback/getAllFeedback?page=${page}&limit=50`, `fetch /api/test-discord-webhook`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/final`
- File: `src/pages/final/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatusByStatus (src/components/TableStatusByStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/grants`
- File: `src/pages/grants/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `GrantCard (src/components/GrantCard.tsx)`

## Route: `/home`
- File: `src/pages/home/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `button-row-container`, `all`, `statuschanges`, `dashboard`, `latest-updates`, `Ethereum Improvement`, `ourtools`, `supported-by`, `trending`, `faq`
- Graphs/charts used: `AllChart`, `TypeGraphs`, `DashboardDonut2`, `DashboardDonut`, `TwitterTimeline`, `StatusColumnChart`, `StatusChart`
- Internal API data sources: `fetch /api/count/views`, `fetch /api/new/all`, `fetch /api/Feedback/feedback`, `fetch /api/viewCount?path=${path}`, `fetch /api/stats`, `axios.get /api/magicians`, `fetch /api/new/final-status-by-year`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `Dashboard (src/components/Dashboard.tsx)`, `PlaceYourAdCard (src/components/PlaceYourAdCard.tsx)`, `ViewsShare (src/components/ViewsNShare.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FusakaCountdownBadge (src/components/FusakaCountdownBadge.tsx)`, `WhatIsEIPsInsightDropdown (src/components/WhatIsEIPsInsightDropdown.tsx)`, `BoyGirl3 (src/components/BoyGirl3.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `AllChart (src/components/AllChart2.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `ToolsSection (src/components/AvailableTools.tsx)`, `SupportedBy (src/components/SupportedBy.tsx)`, `TypeGraphs (src/components/TypeGraphs2.tsx)`, `Clients (src/components/Clients.tsx)`, `StatBox (src/components/StatBox.tsx)`, `DashboardDonut2 (src/components/DashboardDonut2.tsx)`, `... (+9 more)`

## Route: `/informational`
- File: `src/pages/informational/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`, `StatusColumnChart`, `StatusChart`
- Internal API data sources: `fetch /api/new/all`, `axios.post /api/DownloadCounter`, `fetch /api/new/final-status-by-year`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatus (src/components/TableStatus.tsx)`, `StatusColumnChart (src/components/StatusColumnChart.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/insight/[2023]/[month]`
- File: `src/pages/insight/[2023]/[month].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Summary`, `draft-vs-final`, `draft`, `Draft`, `review`, `Review`, `lastcall`, `LastCall`, `living`, `Living`, `final`, `Final`, `stagnant`, `Stagnant`, `withdrawn`, `Withdrawn`, `Ethereum Improvement`
- Graphs/charts used: `InsightsAllStats`, `AreaStatus`, `InsightStats`, `StackedColumnChart`, `InsightSummary`, `InsightsLeaderboard`, `InsightsOpenPrsIssues`
- Internal API data sources: `fetch /api/new/graphsv2`, `axios.post /api/DownloadCounter`, `fetch /api/new/statusChanges/${year}/${month}`, `fetch /api/lastUpdatedTime?name=${encodeURIComponent(name)}`
- External/other data sources: `fetch https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `Header (src/components/Header.tsx)`, `InsightsAllStats (src/components/InsightsAllStats.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `AreaStatus (src/components/AreaStatus3.tsx)`, `StackedColumnChart (src/components/DraftBarChart.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `InsightSummary (src/components/InsightSummaryTable.tsx)`, `DateTime (src/components/DateTime.tsx)`, `LastUpdatedDateTime (src/components/LastUpdatedDateTime.tsx)`, `InsightsLeaderboard (src/components/InsightsLeaderboard.tsx)`, `InsightsOpenPrsIssues (src/components/InsightOpenPrsIssues.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/interface`
- File: `src/pages/interface/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatus (src/components/TableStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/issue/[Type]/[number]`
- File: `src/pages/issue/[Type]/[number].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `description`, `conversations`, `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/get-issue-details/${Type}/${issueNumber}`
- External/other data sources: `None detected`
- Key composed UI blocks: `IssuePage (src/components/IssuesPage.tsx)`, `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `MarkdownBox (src/components/PrOrIssueDescription.tsx)`, `IssueConversations (src/components/IssueConversations.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`

## Route: `/last-call`
- File: `src/pages/last-call/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatusByStatus (src/components/TableStatusByStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/living`
- File: `src/pages/living/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatusByStatus (src/components/TableStatusByStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/meta`
- File: `src/pages/meta/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `StatusColumnChart`, `CategoryDistributionChart`, `StatusInsightsCard`, `StatusChart`
- Internal API data sources: `fetch /api/new/all`, `axios.post /api/DownloadCounter`, `fetch /api/new/final-status-by-year`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `TableStatus (src/components/TableStatus.tsx)`, `StatusColumnChart (src/components/StatusColumnChart.tsx)`, `LineStatus (src/components/LineStatus.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/milestones2024`
- File: `src/pages/milestones2024/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `reviewers-tracker`, `eip-board`, `search-tool`, `pectra-upgrade`, `network-info`, `gratitute`, `conclusion`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/monthly/[type]/[year]/[month]/[status]`
- File: `src/pages/monthly/[type]/[year]/[month]/[status].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/statusChanges/${year}/${month}`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `InsightTable (src/components/InsightTable.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/networking`
- File: `src/pages/networking/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`, `StatusColumnChart`, `StatusChart`
- Internal API data sources: `fetch /api/new/all`, `axios.post /api/DownloadCounter`, `fetch /api/new/final-status-by-year`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatus (src/components/TableStatus.tsx)`, `StatusColumnChart (src/components/StatusColumnChart.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/newsletter`
- File: `src/pages/newsletter/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `PlaceYourAdCard (src/components/PlaceYourAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/pectra`
- File: `src/pages/pectra/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `- [$ ]`}`, `NetworkUpgradesChart`, `NetworkUpgrades`, `AuthorContributions`, `carousel-section`
- Graphs/charts used: `NetworkUpgradesChart`, `NetworkUpgradesChart2`
- Internal API data sources: `axios.post /api/DownloadCounter`, `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `NetworkUpgradesChart (src/components/NetworkUpgradesChart.tsx)`, `NetworkUpgradesChart2 (src/components/NetworkUpgradesChart2.tsx)`, `PectraTable (src/components/PectraTable.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `DateTime (src/components/DateTime.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/PR/[Type]/[number]`
- File: `src/pages/PR/[Type]/[number].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `description`, `conversations`, `review-comments`, `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/get-pr-details/${Type}/${prNumber}`
- External/other data sources: `None detected`
- Key composed UI blocks: `PrPage (src/components/PrPage.tsx)`, `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `MarkdownBox (src/components/PrOrIssueDescription.tsx)`, `PrConversations (src/components/PrConversations.tsx)`, `PrComments (src/components/PrReviewComments.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`

## Route: `/privacy`
- File: `src/pages/privacy/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `DefaultLayout (src/components/Layout.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/profile`
- File: `src/pages/profile/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/user/verify`, `fetch /api/GetUserStatus`, `fetch /api/user/update`, `fetch /api/stripe/cancel-subscription`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/LoginLayout.tsx)`, `SessionWrapper (src/components/SessionWrapper.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`

## Route: `/proposalbuilder`
- File: `src/pages/proposalbuilder/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `EipTemplateEditor`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/ValidateEip`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `ProposalEditor (src/components/Editor/ProposalEditor.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/resources`
- File: `src/pages/resources/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/admin/blogs`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `Resources (src/components/Resources3.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `PlaceYourAdCard (src/components/PlaceYourAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `Header (src/components/Header.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `CopyLink (src/components/CopyLink.tsx)`

## Route: `/review`
- File: `src/pages/review/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatusByStatus (src/components/TableStatusByStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/Reviewers`
- File: `src/pages/Reviewers/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `editors`, `Reviewers`, `LeaderBoard`, `Leaderboard`, `ActivityTimeline`, `Monthly`, `PRs Reviewed`, `active editors`, `Speciality`, `comments`
- Graphs/charts used: `LeaderboardGrid`, `ReviewActivityTimeline`, `ActiveEditorsChart`, `Scatter`
- Internal API data sources: `fetch /api/ReviewersCharts/chart/eips`, `fetch /api/ReviewersCharts/chart/ercs`, `fetch /api/ReviewersCharts/chart/rips`, `fetch /api/editorsActivity`, `axios.post /api/DownloadCounter`, `fetch /api/lastUpdatedTime?name=${encodeURIComponent(name)}`, `axios.get /api/comments/${page}`, `axios.post /api/comments/${page}`, `axios.post /api/comments/${page}/${commentId}/reply`
- External/other data sources: `fetch https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml`
- Key composed UI blocks: `LeaderboardGrid (src/components/reviewers/LeaderboardGrid.tsx)`, `ReviewerCard (src/components/reviewers/ReviewerCard.tsx)`, `ReviewActivityTimeline (src/components/reviewers/ReviewActivityTimeline.tsx)`, `ActiveEditorsChart (src/components/reviewers/ActiveEditorsChart.tsx)`, `EditorRepoGrid (src/components/reviewers/EditorRepoGrid.tsx)`, `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `LastUpdatedDateTime (src/components/LastUpdatedDateTime.tsx)`, `Comments (src/components/comments.tsx)`, `DateTime (src/components/DateTime.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/rip`
- File: `src/pages/rip/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `// // // // // // // // // // // // // // //`, `RIP`, `all`, `githubstats`, `graphs`, `charts`, `draftvsfinal`, `statuses`, `status-tables`, `Ethereum Improvement`
- Graphs/charts used: `AllChart3`, `AllChart`, `RIPStatusDonut`, `RIPTypeDonut`, `AreaStatus`, `StackedColumnChart`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/graphsv2`, `fetch /api/subscribe`, `fetch /api/subscriptions?email=${session.user.email}`, `fetch /api/unsubscribe`, `fetch /api/EIPinfo`, `fetch /api/ERCinfo`, `fetch /api/RIPInfo`, `axios.post /api/DownloadCounter`, `fetch /api/user/me?email=${email}`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `Header (src/components/Header.tsx)`, `SubscriptionButton (src/components/SubscribtionButton.tsx)`, `OtherBox (src/components/OtherStats.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `AllChart3 (src/components/AllChart3.tsx)`, `AllChart (src/components/AllChart.tsx)`, `RIPStatusDonut (src/components/RIPStatusDonut.tsx)`, `RIPTypeDonut (src/components/RIPTypeDonut.tsx)`, `AreaStatus (src/components/AreaStatus.tsx)`, `StackedColumnChart (src/components/StackedBarChart3.tsx)`, `CatTable (src/components/CatTable.tsx)`, `RipTable (src/components/RipTable.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SubscribeForm (src/components/SubscriptionForm.tsx)`, `DateTime (src/components/DateTime.tsx)`

## Route: `/rips/[rip-number]`
- File: `src/pages/rips/[rip-number]/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `timeline`, `guest-email`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/riphistory/${RIPNo}`, `fetch /api/subscribe`, `fetch /api/subscriptions?email=${session.user.email}`, `fetch /api/unsubscribe`
- External/other data sources: `None detected`
- Key composed UI blocks: `LoaderComponent (src/components/Loader.tsx)`, `AllLayout (src/components/Layout.tsx)`, `SearchBox (src/components/SearchBox.tsx)`, `Header (src/components/Header2.tsx)`, `SingleSubscriptionButton (src/components/SingleSubscriptionButton.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Markdown (src/components/MarkdownEIP.tsx)`, `Logo (src/components/Logo.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CodeBlock (src/components/Codehelper.tsx)`

## Route: `/riptable`
- File: `src/pages/riptable/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `Table (src/components/Table.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/SearchEip`
- File: `src/pages/SearchEip/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `SearchByEip (src/components/SearchByEIP.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/SearchEipTitle`
- File: `src/pages/SearchEipTitle/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Search EIP Title`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/graphsv4`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `SearchByTitle (src/components/SearchByTitle.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/SearchPRSandISSUES`
- File: `src/pages/SearchPRSandISSUES/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Search PR/ISSUE`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/allprs`, `fetch /api/allissues`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `SearchByPrOrIssue (src/components/SearchByPrOrIssue.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/signin`
- File: `src/pages/signin/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `None detected`

## Route: `/signup`
- File: `src/pages/signup/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `UserButton (src/components/user-button.tsx)`, `DropdownMenu (src/components/ui/dropdown-menu.tsx)`, `DropdownMenuTrigger (src/components/ui/dropdown-menu.tsx)`, `Avatar (src/components/ui/avatar.tsx)`, `AvatarImage (src/components/ui/avatar.tsx)`, `AvatarFallback (src/components/ui/avatar.tsx)`, `DropdownMenuContent (src/components/ui/dropdown-menu.tsx)`, `DropdownMenuItem (src/components/ui/dropdown-menu.tsx)`, `Button (src/components/ui/button.tsx)`

## Route: `/stagnant`
- File: `src/pages/stagnant/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatusByStatus (src/components/TableStatusByStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/stats/[status]/[date]`
- File: `src/pages/stats/[status]/[date].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/statusChanges/${year}/${month}`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `TableStatus (src/components/TableS.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/status`
- File: `src/pages/status/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `draft-vs-final`, `draft`, `review`, `lastcall`, `final`, `stagnant`, `withdrawn`, `living`, `Ethereum Improvement`
- Graphs/charts used: `AreaStatus`, `StackedColumnChart`
- Internal API data sources: `fetch /api/new/all`, `fetch /api/new/alleips`, `fetch /api/new/graphsv2`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `Header (src/components/Header.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `AreaStatus (src/components/AreaStatus2.tsx)`, `AreaC (src/components/AreaC.tsx)`, `StackedColumnChart (src/components/DraftBarChart2.tsx)`, `CBoxStatus (src/components/CBoxStatus2.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `DateTime (src/components/DateTime.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/tableStatus/[type]/[status]`
- File: `src/pages/tableStatus/[type]/[status].tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `fetch /api/new/all`, `axios.post /api/DownloadCounter`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `TableStat (src/components/TableStat.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/test`
- File: `src/pages/test/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `fetch ${beaconApi}/eth/v1/beacon/headers/head`
- Key composed UI blocks: `SlotCountdown (src/components/OldSlotCountdown.tsx)`

## Route: `/testv2`
- File: `src/pages/testv2/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `TransactionFeeChart`, `TransactionCountChart`, `CalendarHeatmap`
- Internal API data sources: `fetch /api/fetchData`, `fetch /api/fetchData1`, `fetch /api/fetchData2`, `fetch /api/fetchData3`, `fetch /api/fetchData4`
- External/other data sources: `None detected`
- Key composed UI blocks: `Sidebar (src/components/Sidebar.tsx)`, `BlockInfo (src/components/BlockInfo.tsx)`, `TransactionFeeChart (src/components/TransactionFeeChart.tsx)`, `TransactionCountChart (src/components/TransactionCountChart.tsx)`, `RecentTransactions (src/components/RecentTransactions.tsx)`, `RecentBlocks (src/components/RecentBlocks.tsx)`

## Route: `/trivia`
- File: `src/pages/trivia/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `cool-facts`, `fun-facts`
- Graphs/charts used: `No chart component pattern detected in scanned scope`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `FactsSection (src/components/TriviaContents.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/txtracker`
- File: `src/pages/txtracker/index.tsx`
- Data delivery way: `Static/local composition (no direct fetch detected)`
- Sections present: `No explicit section ids/headings detected in scanned scope`
- Graphs/charts used: `TransactionFeeChart`, `TransactionCountChart`
- Internal API data sources: `None detected`
- External/other data sources: `None detected`
- Key composed UI blocks: `LiveBlockIndicator (src/components/TxTracker/LiveBlockIndicator.tsx)`, `FeedbackWidget (src/components/FeedbackWidget.tsx)`, `AllLayout (src/components/Layout.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `ExplainerPanel (src/components/TxTracker/ExplainerPanel.tsx)`, `NetworkStatus (src/components/TxTracker/NetworkStatus.tsx)`, `TransactionFeeChart (src/components/TxTracker/TransactionFeeChart.tsx)`, `TransactionCountChart (src/components/TxTracker/TransactionCountChart.tsx)`, `RecentTransactions (src/components/TxTracker/RecentTransactions.tsx)`, `RecentBlocks (src/components/TxTracker/RecentBlocks.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/upgrade`
- File: `src/pages/upgrade/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `upgrade-timeline`, `network-stats`, `horizontal-timeline`, `upgrade-chart`, `select-upgrade`, `NetworkUpgrades`, `upgrade-description`, `upgrade-blogs`, `eip-status`, `declined-eips`, `AuthorContributions`, `NetworkUpgradesChartp`, `dfi`
- Graphs/charts used: `ZoomableTimeline`, `HorizontalUpgradeTimeline`, `NetworkUpgradesChart`, `UpgradesTimeline`, `NetworkUpgradesChart2`, `Graph`, `TimelineChart`
- Internal API data sources: `fetch /api/eips/${number}`, `axios.post /api/DownloadCounter`
- External/other data sources: `fetch ${beaconApi}/eth/v1/beacon/headers/head`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `ZoomableTimeline (src/components/ZoomableTimeline.tsx)`, `HorizontalUpgradeTimeline (src/components/HorizontalUpgradeTimeline.tsx)`, `NetworkUpgradesChart (src/components/NetworkUpgradesChart.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SlotCountdown (src/components/SlotCountdown.tsx)`, `UpgradesTimeline (src/components/UpgradesTimeline.tsx)`, `UpgradeEIPsShowcase (src/components/UpgradeEIPsShowcase.tsx)`, `DeclinedEIPListPage (src/components/DeclinedCardsPage.tsx)`, `NetworkUpgradesChart2 (src/components/NetworkUpgradesChart2.tsx)`, `Graph (src/components/EIP3DWrapper.tsx)`, `PlaceYourAdCard (src/components/PlaceYourAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `DateTime (src/components/DateTime.tsx)`, `TimelineChart (src/components/TimelineChart.tsx)`, `DeclinedEIPCard (src/components/DeclinedForInclusion.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/upgrade/[upgrade]`
- File: `src/pages/upgrade/[upgrade]/index.tsx`
- Data delivery way: `SSG via getStaticProps`, `Dynamic SSG via getStaticPaths`, `Client data fetching (fetch/axios)`
- Sections present: `upgrade-timeline`, `network-stats`, `horizontal-timeline`, `upgrade-chart`, `select-upgrade`, `NetworkUpgrades`, `upgrade-description`, `upgrade-blogs`, `eip-status`, `declined-eips`, `AuthorContributions`, `NetworkUpgradesChartp`, `dfi`
- Graphs/charts used: `ZoomableTimeline`, `HorizontalUpgradeTimeline`, `NetworkUpgradesChart`, `UpgradesTimeline`, `NetworkUpgradesChart2`, `Graph`, `TimelineChart`
- Internal API data sources: `fetch /api/eips/${number}`, `axios.post /api/DownloadCounter`
- External/other data sources: `fetch ${beaconApi}/eth/v1/beacon/headers/head`
- Key composed UI blocks: `All (src/pages/upgrade/index.tsx)`, `AllLayout (src/components/Layout.tsx)`, `AnimatedHeader (src/components/AnimatedHeader.tsx)`, `ZoomableTimeline (src/components/ZoomableTimeline.tsx)`, `HorizontalUpgradeTimeline (src/components/HorizontalUpgradeTimeline.tsx)`, `NetworkUpgradesChart (src/components/NetworkUpgradesChart.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SlotCountdown (src/components/SlotCountdown.tsx)`, `UpgradesTimeline (src/components/UpgradesTimeline.tsx)`, `UpgradeEIPsShowcase (src/components/UpgradeEIPsShowcase.tsx)`, `DeclinedEIPListPage (src/components/DeclinedCardsPage.tsx)`, `NetworkUpgradesChart2 (src/components/NetworkUpgradesChart2.tsx)`, `Graph (src/components/EIP3DWrapper.tsx)`, `PlaceYourAdCard (src/components/PlaceYourAdCard.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `DateTime (src/components/DateTime.tsx)`, `TimelineChart (src/components/TimelineChart.tsx)`, `DeclinedEIPCard (src/components/DeclinedForInclusion.tsx)`, `Logo (src/components/Logo.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

## Route: `/withdrawn`
- File: `src/pages/withdrawn/index.tsx`
- Data delivery way: `Client data fetching (fetch/axios)`
- Sections present: `Ethereum Improvement`
- Graphs/charts used: `CategoryDistributionChart`, `StatusInsightsCard`
- Internal API data sources: `fetch /api/new/all`
- External/other data sources: `None detected`
- Key composed UI blocks: `AllLayout (src/components/Layout.tsx)`, `LoaderComponent (src/components/Loader.tsx)`, `StatusTabNavigation (src/components/StatusTabNavigation.tsx)`, `FlexBetween (src/components/FlexBetween.tsx)`, `Header (src/components/Header.tsx)`, `AnalyticsStatCard (src/components/AnalyticsStatCard.tsx)`, `CategoryDistributionChart (src/components/CategoryDistributionChart.tsx)`, `StatusInsightsCard (src/components/StatusInsightsCard.tsx)`, `FAQSection (src/components/FAQSection.tsx)`, `CloseableAdCard (src/components/CloseableAdCard.tsx)`, `TableStatusByStatus (src/components/TableStatusByStatus.tsx)`, `BookmarkProvider (src/components/BookmarkContext.tsx)`, `SidebarConfigLoader (src/components/Sidebar/SideBarConfigLoader.tsx)`, `AppSidebar (src/components/Sidebar/AppSidebar.tsx)`, `Navbar (src/components/Navbar.tsx)`, `AuthLocalStorageInitializer (src/components/AuthLocalStorageInitializer.tsx)`, `UniversalFeedbackSystem (src/components/UniversalFeedbackSystem.tsx)`, `FloatingContributionIcon (src/components/FloatingContributionIcon.tsx)`, `BookmarkFloater (src/components/BookmarkFloater.tsx)`, `SubscriptionFloater (src/components/SubscriptionFloater.tsx)`, `LargeWithAppLinksAndSocial (src/components/Footer.tsx)`, `CookieConsentBanner (src/components/CookieConsentBanner.tsx)`, `Logo (src/components/Logo.tsx)`, `CopyLink (src/components/CopyLink.tsx)`, `SearchBox (src/components/SearchBox.tsx)`

