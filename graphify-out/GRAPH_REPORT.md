# Graph Report - .  (2026-07-22)

## Corpus Check
- Large corpus: 137 files · ~1,616,422 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 447 nodes · 470 edges · 81 communities (64 shown, 17 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Project Docs & AI Workflow Rules
- Team & Events Admin CRUD
- ESLint/Dev Tooling Deps
- Runtime Package Deps
- Public/Admin Routes Reference
- App Routing (App.jsx)
- Supabase Schema Core Tables
- Design System & Button Variants
- FAQs API & Admin CRUD
- Robocast Page & API
- Home Page Composition
- Events Listing Sections
- Admin Auth API
- Error Boundary
- Footer Section
- Join Us Page Composition
- Navbar & Projects Dropdown
- Partners Section & Categories
- Partner Logo Component
- Projects Page & Filtering
- About Page Composition
- Partners Page Composition
- Category Formatting Utils
- Admin Pagination
- Member Stories Section
- Fundraising Section
- Home Project Section
- Join-Us Application Steps
- What We Offer Section
- Admin Events Form
- Admin Partners Form
- Admin Projects Form
- Events Page Composition
- Vercel Redirects/Rewrites Config
- FAQ Schema (category enum + table)
- Fundraising Config
- Supabase Client
- Logger Util
- Project Name Enum
- Teams Enum

## God Nodes (most connected - your core abstractions)
1. `CLAUDE.md - RoboTUM Website Guide` - 32 edges
2. `Routes Reference` - 22 edges
3. `AGENTS.md - Agent Working Rules` - 17 edges
4. `uploadPublicImage()` - 9 edges
5. `deletePublicImageByUrl()` - 9 edges
6. `Design System Notes` - 9 edges
7. `Architecture Overview` - 8 edges
8. `PLAN.md - Mobile Navbar Professional Polish` - 8 edges
9. `AdminRoute Protected Admin Area` - 8 edges
10. `getAdminImageUploadTarget()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `README.md - RoboTUM Website` --semantically_similar_to--> `Routes Reference`  [INFERRED] [semantically similar]
  README.md → .docs/routes.md
- `AGENTS.md - Agent Working Rules` --semantically_similar_to--> `CLAUDE.md - RoboTUM Website Guide`  [INFERRED] [semantically similar]
  AGENTS.md → CLAUDE.md
- `Review UI Prompt (Codex workflow)` --references--> `AGENTS.md - Agent Working Rules`  [EXTRACTED]
  .codex/prompts/review-ui.md → AGENTS.md
- `CLAUDE.md - RoboTUM Website Guide` --conceptually_related_to--> `Button Variant System (primary/primary-light/secondary/secondaryStatic)`  [EXTRACTED]
  CLAUDE.md → .docs/design-system.md
- `Implement Feature Prompt (Codex workflow)` --references--> `AGENTS.md - Agent Working Rules`  [EXTRACTED]
  .codex/prompts/implement-feature.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Button Variant System spanning design-system.md, CLAUDE.md, and Button.jsx** - _docs_design_system_button_primary, _docs_design_system_button_primary_light, _docs_design_system_button_secondary, _docs_design_system_button_secondary_static, concept_button_component, claude [INFERRED 0.85]
- **Centralized data-API-layer rule repeated across governance docs** - agents, claude, _docs_architecture, readme, concept_data_api_layer_pattern [INFERRED 0.85]
- **Robocast-is-not-a-projects-tab rule enforced across docs** - _docs_routes, agents, claude, readme, concept_robocast_standalone_route [INFERRED 0.85]

## Communities (81 total, 17 thin omitted)

### Community 0 - "Project Docs & AI Workflow Rules"
Cohesion: 0.06
Nodes (49): Implement Feature Prompt (Codex workflow), Architecture Overview, Architecture Core Principles, Architecture Maintenance Notes, Data Model (Supabase Schema), Data model doc must always mirror live Supabase schema (never manually rewritten), SEO Notes (empty file), AGENTS.md - Agent Working Rules (+41 more)

### Community 1 - "Team & Events Admin CRUD"
Cohesion: 0.07
Nodes (25): TeamSection(), EventSection(), adminUpsertEvent(), EVENT_FORMAT_OPTIONS, fetchEventsForHomepage(), fetchTeamMembers(), MEMBER_CATEGORIES, adminUpsertPartner() (+17 more)

### Community 2 - "ESLint/Dev Tooling Deps"
Cohesion: 0.06
Nodes (35): depcheck, eslint, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-unused-imports, jsdom, devDependencies (+27 more)

### Community 3 - "Runtime Package Deps"
Cohesion: 0.08
Nodes (24): clsx, emailjs-com, @heroicons/react, dependencies, clsx, emailjs-com, @heroicons/react, react (+16 more)

### Community 4 - "Public/Admin Routes Reference"
Cohesion: 0.11
Nodes (23): Routes Reference, Route: /about, Route (planned): /admin/applications, Route: /admin, Route: /admin/events, Route: /admin/faqs, Route: /admin/login, Route (planned): /admin/members (+15 more)

### Community 5 - "App Routing (App.jsx)"
Cohesion: 0.09
Nodes (21): About, AdminDashboard, AdminEvents, AdminFaqs, AdminLogin, AdminPartners, AdminProjects, App() (+13 more)

### Community 6 - "Supabase Schema Core Tables"
Cohesion: 0.13
Nodes (19): "asset" Supabase Storage Bucket, departments table, event_category enum, event_format enum, events table, member_memberships table, member_memberships_with_names view, member_projects table (+11 more)

### Community 7 - "Design System & Button Variants"
Cohesion: 0.18
Nodes (11): Review UI Prompt (Codex workflow), Design System Notes, Button variant: primary, Button variant: primary-light, Button variant: secondary, Button variant: secondaryStatic, hero-offset layout class, section-container layout class (+3 more)

### Community 8 - "FAQs API & Admin CRUD"
Cohesion: 0.22
Nodes (3): FAQ_CATEGORIES, fetchFaqs(), Faqs()

### Community 9 - "Robocast Page & API"
Cohesion: 0.36
Nodes (6): fetchPublishedRobocastEpisodes(), EpisodeCard(), formatDate(), getPlatformLinks(), prettifyKey(), RobocastPage()

### Community 10 - "Home Page Composition"
Cohesion: 0.25
Nodes (6): EventSection, FundraisingSection, JoinUsSection, MissionSection, PartnersSection, ProjectSection

### Community 11 - "Events Listing Sections"
Cohesion: 0.33
Nodes (5): PreviousEventsSection(), EventsSection(), normalizeCategory(), EVENT_CATEGORY_OPTIONS, fetchEvents()

### Community 12 - "Admin Auth API"
Cohesion: 0.38
Nodes (3): fetchIsAdmin(), signInAdmin(), verifyAdminAccess()

### Community 14 - "Footer Section"
Cohesion: 0.33
Nodes (3): EXPLORE_LINKS, LEGAL_LINKS, SOCIAL_LINKS

### Community 15 - "Join Us Page Composition"
Cohesion: 0.33
Nodes (4): ApplicationFormSection, ApplicationSection, MemberStoriesSection, WhyWeSection

### Community 16 - "Navbar & Projects Dropdown"
Cohesion: 0.50
Nodes (3): NAV_LINKS, Navbar(), PROJECT_TABS

### Community 17 - "Partners Section & Categories"
Cohesion: 0.40
Nodes (3): PartnersSection(), PartnerCategories(), fetchActivePartners()

### Community 18 - "Partner Logo Component"
Cohesion: 0.50
Nodes (4): getPartnerTier(), LOGO_SIZE_MAP, PartnerLogo(), NOTE: flex-none so items don't get squished into vertical lines in marquee

### Community 19 - "Projects Page & Filtering"
Cohesion: 0.50
Nodes (4): fetchProjects(), CURATED_TAGS, Projects(), TABS

### Community 20 - "About Page Composition"
Cohesion: 0.40
Nodes (3): PreviousEventsSection, TeamSection, WhatIsRobotum

### Community 21 - "Partners Page Composition"
Cohesion: 0.40
Nodes (3): ContactUsSection, PartnerCategories, WhatWeOffer

### Community 22 - "Category Formatting Utils"
Cohesion: 0.70
Nodes (4): formatEventCategory(), formatPartnerCategory(), formatProjectCategory(), titleCase()

### Community 23 - "Admin Pagination"
Cohesion: 0.67
Nodes (3): AdminPagination(), getVisiblePages(), PAGE_SIZE_OPTIONS

## Knowledge Gaps
- **142 isolated node(s):** `name`, `version`, `type`, `dev`, `build` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** - run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CLAUDE.md - RoboTUM Website Guide` connect `Project Docs & AI Workflow Rules` to `Design System & Button Variants`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Data Model (Supabase Schema)` connect `Project Docs & AI Workflow Rules` to `Supabase Schema Core Tables`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `"asset" Supabase Storage Bucket` connect `Supabase Schema Core Tables` to `Project Docs & AI Workflow Rules`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _142 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Project Docs & AI Workflow Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.06285714285714286 - nodes in this community are weakly interconnected._
- **Should `Team & Events Admin CRUD` be split into smaller, more focused modules?**
  _Cohesion score 0.07246376811594203 - nodes in this community are weakly interconnected._
- **Should `ESLint/Dev Tooling Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._