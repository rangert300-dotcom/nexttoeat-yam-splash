# Next To Eat — Y.A.M. Integration

## Project Overview
Static site for **nexttoeat.com**, a New Orleans-based wholistic culinary business. Deploys via **GitHub → Cloudflare Pages** (no framework, no build step, zero npm dependencies).

## Y.A.M. = Young Adult Market
Canonical name is "Young Adult Market" but it intentionally contains multitudes (Youth Advocacy Magazine, Young Audience Marketplace, etc.). These alternate names are **not errors**.

## File Structure
```
/
├── index.html          ← Homepage with banner overlay
├── yam.html            ← Y.A.M. content page (no banner)
├── css/
│   ├── tokens.css      ← Shared design tokens (CSS custom properties)
│   ├── base.css        ← Reset, typography, shared styles
│   ├── banner.css      ← Newspaper overlay styles + animations
│   └── yam.css         ← Y.A.M. page-specific styles
├── js/
│   ├── banner.js       ← Banner: animation, shatter, dismiss, localStorage
│   └── yam.js          ← Y.A.M.: scroll reveals, newsletter placeholder
├── assets/
│   ├── 123_1.jpeg      ← Y.A.M. logo
│   └── Next_To_Eat_WCM_CMYK_High_Res-01.png  ← NTE logo
└── CLAUDE.md           ← This file
```

## Key Design Decisions
- **Banner palette is canon**: `--dark: #1A1A1A` (not `#111111`)
- **`NOW_OPEN = true`** in `js/banner.js` — shatter sequence is active
- **localStorage key** `yam-banner-dismissed-permanently` controls "Don't show again"
- **No banner on `/yam`** — only on the homepage
- **Paper texture** from banner applied to YAM page `.section-light` backgrounds
- **All colors** use CSS custom properties from `tokens.css`
- **All `mailto:` links** replaced with `/contact`
- **Team photos** are placeholder boxes (real photos to be added later)
- **Newsletter** is decorative — button shows "Coming Soon!" on click

## Things NOT to Change
- Banner animation sequencing/timing (spin → bounce → cracks → shatter → shockwave → sparkles → reveal)
- `NOW_OPEN` config flag name
- Y.A.M. page section order or content copy
- Marquee band's alternate Y.A.M. names
- `"I Yam What I Yam"` footer quote

## Future Work
- Replace homepage placeholder with real content
- Add team photos to replace placeholder boxes
- Connect newsletter to a real service
- Create `/contact` page
- Verify asset paths match Cloudflare Pages deployment
