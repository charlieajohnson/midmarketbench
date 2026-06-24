# Theme Notes

## Aesthetic Summary

The archived aesthetic combined:

- light parchment defaults with a fully defined `.dark` token override
- dark benchmark-terminal surfaces for users with dark preference or saved `mmb-theme`
- compact sans and mono-led interface chrome
- a muted landscape hero image with overlay gradients
- table-first leaderboard styling with small row heights and terminal-like density
- provider/logo chips and numeric score cells as the main product signal

## Theme Ownership

Primary files at the pre-overhaul commit:

- `app/globals.css`: colour tokens, dark token override, nav/table/card/footer styling, responsive rules, reduced-motion rule.
- `app/layout.tsx`: inline theme bootstrap script reading `localStorage.mmb-theme` and `prefers-color-scheme`.
- `components/nav/ThemeToggle.tsx`: client toggle that wrote `mmb-theme` and switched the root `.dark` class.
- `components/nav/TopNav.tsx`: rendered the toggle inside primary navigation.
- `public/hero-landscape.svg`: prior atmospheric hero artwork.

## Removed Theme Logic

The overhaul removes:

- the `LIGHT`/`DARK` nav control
- `mmb-theme` local-storage reads and writes
- root `.dark` class switching
- dark token overrides as live production styling

The archive keeps snapshots instead of preserving unused alternate-theme code in the live app.
