# PushyTao · Orbit blog design

Build a Chinese personal technology blog on Hexo with a custom Orbit theme. The reference is Qiwen's full-width cover, quiet navigation and readable post collection. Use an original dark midnight/ice-cyan orbital illustration, spacious typography and subtle grid details, not copied assets. Default brand: PushyTao. No unverified biography, credentials, visitor counts or personal stories.

## Experience
- Homepage: full-width atmospheric orbital hero, title, two actions, recent articles with illustrated covers, category filter, author sidebar, real post/category counts.
- Navigation: home, archives, topics, about, search, light/dark switch; accessible mobile menu.
- Search: local generated JSON, case-insensitive title/tag/body matching, keyboard shortcut, dialog focus management, clear loading/empty/error states.
- Articles: Markdown, highlighted code, copy button, table of contents, reading progress, previous/next links.
- Archives/categories/tags/about/404, Atom feed and sitemap are static routes that work on direct load.
- Responsive at 375px and 1440px, readable contrast, keyboard support, reduced motion.

## Content and architecture
Keep the original root Markdown files as legacy sources. Copy the title-only C++ note into source/_drafts with its original date; do not fabricate its body. Publish two factual site-related introductory articles clearly describing this site and its writing workflow, without invented personal history.
Hexo + EJS with plain CSS and browser ES modules. No remote font/CDN/runtime dependency. Local SVG art. Source in source/_posts, custom theme in themes/orbit, generation helper in themes/orbit/scripts. Build public/ with npm run build. Node >=22, lockfile committed. Official GitHub Pages Actions build, verify and deploy public/ on main.

## Verification
Build generated routes; parse internal href/src references and verify targets. Assert original draft absent from public posts, metadata/feed/search valid. Browser-check desktop/mobile, theme persistence, topic filter, search success/empty/escape, article navigation and code copy. Review diff independently before commit/push. Preserve remote changes and use only fast-forward synchronization.
