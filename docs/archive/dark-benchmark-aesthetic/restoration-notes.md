# Restoration Notes

## Fast Restore

Use the last pre-overhaul commit if the objective is to restore the whole old surface:

```bash
git checkout 4990da0fdcccf481e958499cb7d96656dd5d73b8 -- app/globals.css app/layout.tsx components/nav/TopNav.tsx components/nav/ThemeToggle.tsx public/hero-landscape.svg
```

Then run the normal checks:

```bash
npm run lint
```

```bash
npm run typecheck
```

```bash
npm test
```

```bash
npm run build
```

## Partial Restore

If only the token system is needed, start from `css-or-theme-snapshot.css` and port the relevant variables into a new, isolated theme layer. Do not reintroduce the old `.dark` override into production unless the product again needs multi-theme support.

If the theme toggle returns, prefer a dedicated provider or small isolated client component with:

- one source of truth for storage key and root attribute/class
- no inline blocking script unless hydration flash becomes material
- explicit accessibility label and 44px mobile tap target
- clear QA coverage for first load, saved preference, keyboard focus, and reduced motion

## Design Decisions Changed

The Humanist Compute Atelier overhaul changes the design premise from dark benchmark terminal to archival research atelier:

- paper canvas instead of dark terminal canvas
- editorial serif hierarchy instead of compact technical display
- verdigris and aged-gold accents instead of green/dark dashboard contrast
- product-linked ledger, case, scale, and evaluation graphics instead of atmospheric landscape art
- mobile rank cards instead of squeezed desktop leaderboard as the primary mobile pattern
